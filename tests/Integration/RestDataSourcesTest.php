<?php
/**
 * Pins the read-only wcapf/v1 dropdown/modal data routes (/terms, /authors,
 * /pages, /products, /meta-values). Locks the {label,value} response shape
 * the React AsyncPaginate consumes, dropdown pagination, the only_parent
 * filter, and the modal vs dropdown collapse via ?context=.
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

	public function test_terms_modal_returns_value_label_rows(): void {
		$term_id = $this->factory()->term->create(
			array( 'taxonomy' => 'product_cat', 'name' => 'Chairs' )
		);

		$response = $this->do_rest(
			'GET',
			'/wcapf/v1/terms',
			array( 'context' => 'modal', 'taxonomy' => 'product_cat' )
		);

		$this->assertSame( 200, $response->get_status() );
		$row = $this->find_row( $response->get_data(), 'value', $term_id );
		$this->assertNotNull( $row );
		$this->assertSame( array( 'value', 'label' ), array_keys( $row ) );
		$this->assertSame( 'Chairs', $row['label'] );
	}

	public function test_terms_dropdown_paginates(): void {
		for ( $i = 1; $i <= 22; $i++ ) {
			$this->factory()->term->create(
				array( 'taxonomy' => 'product_cat', 'name' => sprintf( 'Bulk %02d', $i ) )
			);
		}

		$page_1 = $this->do_rest( 'GET', '/wcapf/v1/terms', array( 'taxonomy' => 'product_cat', 'page' => 1 ) );
		$page_2 = $this->do_rest( 'GET', '/wcapf/v1/terms', array( 'taxonomy' => 'product_cat', 'page' => 2 ) );

		$this->assertCount( 20, $page_1->get_data() );
		$this->assertSame( array( 'label', 'value' ), array_keys( $page_1->get_data()[0] ) );
		$this->assertNotEmpty( $page_2->get_data() );

		$page_1_ids = wp_list_pluck( $page_1->get_data(), 'value' );
		$page_2_ids = wp_list_pluck( $page_2->get_data(), 'value' );
		$this->assertSame( array(), array_intersect( $page_1_ids, $page_2_ids ) );
	}

	public function test_terms_dropdown_only_parent_filters_to_terms_with_children(): void {
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

	public function test_authors_dropdown_returns_label_value_rows(): void {
		$author_id = self::factory()->user->create(
			array( 'role' => 'author', 'display_name' => 'Jane Author' )
		);

		$response = $this->do_rest( 'GET', '/wcapf/v1/authors' );

		$this->assertSame( 200, $response->get_status() );
		$values = array_map( 'intval', wp_list_pluck( $response->get_data(), 'value' ) );
		$this->assertContains( $author_id, $values );
	}

	public function test_authors_modal_filters_by_roles(): void {
		$author_id = self::factory()->user->create(
			array( 'role' => 'author', 'display_name' => 'In-role' )
		);
		$editor_id = self::factory()->user->create(
			array( 'role' => 'editor', 'display_name' => 'Out-of-role' )
		);

		$response = $this->do_rest(
			'GET',
			'/wcapf/v1/authors',
			array( 'context' => 'modal', 'roles' => array( 'author' ) )
		);

		$values = array_map( 'intval', wp_list_pluck( $response->get_data(), 'value' ) );
		$this->assertContains( $author_id, $values );
		$this->assertNotContains( $editor_id, $values );
		$this->assertSame( array( 'label', 'value' ), array_keys( $response->get_data()[0] ) );
	}

	public function test_pages_searches_by_keyword(): void {
		$matched = $this->factory()->post->create(
			array( 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => 'Match page' )
		);
		$other = $this->factory()->post->create(
			array( 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => 'Unrelated' )
		);

		$response = $this->do_rest( 'GET', '/wcapf/v1/pages', array( 'keyword' => 'Match' ) );

		$values = wp_list_pluck( $response->get_data(), 'value' );
		$this->assertContains( $matched, $values );
		$this->assertNotContains( $other, $values );
	}

	public function test_products_returns_published_products(): void {
		$product = $this->factory()->post->create(
			array( 'post_type' => 'product', 'post_status' => 'publish', 'post_title' => 'Visible widget' )
		);

		$response = $this->do_rest( 'GET', '/wcapf/v1/products', array( 'keyword' => 'widget' ) );

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
		$this->assertSame( array( 'value', 'label' ), array_keys( $response->get_data()[0] ) );
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
