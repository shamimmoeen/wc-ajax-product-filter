<?php
/**
 * Pins the read-only `wcapf/v1` dropdown/modal data routes (/terms, /authors,
 * /pages, /products, /meta-values). Locks the `{label, value}` response shape
 * the React AsyncPaginate consumes, dropdown pagination, the only_parent
 * filter, the per_page param, and the roles-vs-capability author filtering.
 *
 * @package wc-ajax-product-filter
 */

class RestDataSourcesTest extends WP_UnitTestCase {

	public function set_up() {
		parent::set_up();

		wp_set_current_user( self::factory()->user->create( array( 'role' => 'administrator' ) ) );
	}

	private function do_rest( string $method, string $route, array $params = array() ): \WP_REST_Response {
		$request = new \WP_REST_Request( $method, $route );
		foreach ( $params as $key => $value ) {
			$request->set_param( $key, $value );
		}
		return rest_do_request( $request );
	}

	public function test_terms_bulk_fetch_returns_label_value_rows(): void {
		$term_id = $this->factory()->term->create(
			array( 'taxonomy' => 'product_cat', 'name' => 'Chairs' )
		);

		$response = $this->do_rest(
			'GET',
			'/wcapf/v1/terms',
			array( 'taxonomy' => 'product_cat', 'per_page' => 99 )
		);

		$this->assertSame( 200, $response->get_status() );
		$row = $this->find_row( $response->get_data(), 'value', $term_id );
		$this->assertNotNull( $row );
		$this->assertSame( array( 'label', 'value' ), array_keys( $row ) );
		$this->assertSame( 'Chairs', $row['label'] );
	}

	public function test_terms_paginates_at_default_per_page(): void {
		for ( $i = 1; $i <= 22; $i++ ) {
			$this->factory()->term->create(
				array( 'taxonomy' => 'product_cat', 'name' => sprintf( 'Bulk %02d', $i ) )
			);
		}

		$page_1 = $this->do_rest( 'GET', '/wcapf/v1/terms', array( 'taxonomy' => 'product_cat', 'page' => 1 ) );
		$page_2 = $this->do_rest( 'GET', '/wcapf/v1/terms', array( 'taxonomy' => 'product_cat', 'page' => 2 ) );

		$this->assertCount( 20, $page_1->get_data(), 'Default per_page is 20.' );
		$this->assertSame( array( 'label', 'value' ), array_keys( $page_1->get_data()[0] ) );
		$this->assertNotEmpty( $page_2->get_data() );

		$page_1_ids = wp_list_pluck( $page_1->get_data(), 'value' );
		$page_2_ids = wp_list_pluck( $page_2->get_data(), 'value' );
		$this->assertSame( array(), array_intersect( $page_1_ids, $page_2_ids ) );
	}

	public function test_terms_only_parent_filters_to_terms_with_children(): void {
		$parent = $this->factory()->term->create(
			array( 'taxonomy' => 'product_cat', 'name' => 'Parent cat' )
		);
		$this->factory()->term->create(
			array( 'taxonomy' => 'product_cat', 'name' => 'Child cat', 'parent' => $parent )
		);
		$leaf = $this->factory()->term->create(
			array( 'taxonomy' => 'product_cat', 'name' => 'Leaf cat' )
		);

		$response = $this->do_rest(
			'GET',
			'/wcapf/v1/terms',
			array( 'taxonomy' => 'product_cat', 'only_parent' => 'true' )
		);

		$values = wp_list_pluck( $response->get_data(), 'value' );
		$this->assertContains( $parent, $values );
		$this->assertNotContains( $leaf, $values );
	}

	public function test_terms_per_page_is_capped_by_filter(): void {
		add_filter( 'wcapf_max_number_of_terms_for_browse_options_modal', static fn() => 3 );

		for ( $i = 1; $i <= 5; $i++ ) {
			$this->factory()->term->create(
				array( 'taxonomy' => 'product_cat', 'name' => "Cap $i" )
			);
		}

		$response = $this->do_rest(
			'GET',
			'/wcapf/v1/terms',
			array( 'taxonomy' => 'product_cat', 'per_page' => 99 )
		);

		$this->assertCount( 3, $response->get_data(), 'Per_page must be capped by the filter.' );

		remove_all_filters( 'wcapf_max_number_of_terms_for_browse_options_modal' );
	}

	public function test_authors_defaults_to_edit_posts_capability_when_no_filter(): void {
		$author_id     = self::factory()->user->create(
			array( 'role' => 'author', 'display_name' => 'Jane Author' )
		);
		$subscriber_id = self::factory()->user->create(
			array( 'role' => 'subscriber', 'display_name' => 'No-cap Sub' )
		);

		$response = $this->do_rest( 'GET', '/wcapf/v1/authors' );

		$this->assertSame( 200, $response->get_status() );
		$values = array_map( 'intval', wp_list_pluck( $response->get_data(), 'value' ) );
		$this->assertContains( $author_id, $values, 'Authors (have edit_posts) should appear in the default list.' );
		$this->assertNotContains( $subscriber_id, $values, 'Subscribers (no edit_posts) must be excluded by the default.' );
	}

	public function test_authors_roles_param_filters_by_role(): void {
		$author_id = self::factory()->user->create(
			array( 'role' => 'author', 'display_name' => 'In-role' )
		);
		$editor_id = self::factory()->user->create(
			array( 'role' => 'editor', 'display_name' => 'Out-of-role' )
		);

		$response = $this->do_rest(
			'GET',
			'/wcapf/v1/authors',
			array( 'roles' => array( 'author' ) )
		);

		$values = array_map( 'intval', wp_list_pluck( $response->get_data(), 'value' ) );
		$this->assertContains( $author_id, $values );
		$this->assertNotContains( $editor_id, $values );
		$this->assertSame( array( 'label', 'value' ), array_keys( $response->get_data()[0] ) );
	}

	public function test_pages_searches_by_search_param(): void {
		$matched = $this->factory()->post->create(
			array( 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => 'Match page' )
		);
		$other = $this->factory()->post->create(
			array( 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => 'Unrelated' )
		);

		$response = $this->do_rest( 'GET', '/wcapf/v1/pages', array( 'search' => 'Match' ) );

		$values = wp_list_pluck( $response->get_data(), 'value' );
		$this->assertContains( $matched, $values );
		$this->assertNotContains( $other, $values );
	}

	public function test_products_searches_by_search_param(): void {
		$product = $this->factory()->post->create(
			array( 'post_type' => 'product', 'post_status' => 'publish', 'post_title' => 'Visible widget' )
		);

		$response = $this->do_rest( 'GET', '/wcapf/v1/products', array( 'search' => 'widget' ) );

		$this->assertContains( $product, wp_list_pluck( $response->get_data(), 'value' ) );
	}

	public function test_meta_values_returns_distinct_values_for_meta_key(): void {
		$a = $this->factory()->post->create( array( 'post_type' => 'product', 'post_status' => 'publish' ) );
		$b = $this->factory()->post->create( array( 'post_type' => 'product', 'post_status' => 'publish' ) );
		update_post_meta( $a, 'fabric', 'cotton' );
		update_post_meta( $b, 'fabric', 'wool' );

		$response = $this->do_rest( 'GET', '/wcapf/v1/meta-values', array( 'meta_key' => 'fabric' ) );

		$values = wp_list_pluck( $response->get_data(), 'value' );
		$this->assertContains( 'cotton', $values );
		$this->assertContains( 'wool', $values );
		$this->assertSame( array( 'label', 'value' ), array_keys( $response->get_data()[0] ) );
	}

	private function find_row( array $rows, string $key, $value ): ?array {
		foreach ( $rows as $row ) {
			if ( isset( $row[ $key ] ) && $row[ $key ] === $value ) {
				return $row;
			}
		}
		return null;
	}
}
