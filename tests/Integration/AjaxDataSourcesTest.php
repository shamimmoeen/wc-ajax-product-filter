<?php
/**
 * Pins the read-only dropdown/modal data sources in \WCAPF\Ajax. These power
 * the AsyncPaginate selectors and the manual-options browse modal. Tests lock
 * the {label,value} response shape (the React contract), the dropdown
 * pagination contract, and the only_parent filter that lets the visibility
 * rules pick top-level terms.
 *
 * @package wc-ajax-product-filter
 */

class AjaxDataSourcesTest extends WP_Ajax_UnitTestCase {

	private int $admin_id;

	public function set_up() {
		parent::set_up();

		$this->admin_id = self::factory()->user->create( array( 'role' => 'administrator' ) );
		wp_set_current_user( $this->admin_id );
	}

	private function call_handler( string $action, array $get = array(), array $post = array() ): array {
		$get['nonce']  = wp_create_nonce( 'wcapf-nonce' );
		$post['nonce'] = wp_create_nonce( 'wcapf-nonce' );
		$_GET          = $get;
		$_POST         = $post;

		$this->_last_response = '';

		try {
			$this->_handleAjax( $action );
		} catch ( WPAjaxDieContinueException $e ) {
			return (array) json_decode( $this->_last_response, true );
		}

		$this->fail( "Handler $action did not call wp_send_json_*" );
	}

	public function test_get_terms_for_modal_returns_value_label_rows(): void {
		$term_id = $this->factory()->term->create(
			array(
				'taxonomy' => 'product_cat',
				'name'     => 'Chairs',
			)
		);

		$response = $this->call_handler(
			'wcapf_get_terms_for_modal',
			array( 'taxonomy' => 'product_cat' )
		);

		$this->assertTrue( $response['success'] );
		$row = $this->find_row( $response['data'], 'value', $term_id );
		$this->assertNotNull( $row, "Term $term_id missing from modal response." );
		$this->assertSame( array( 'value', 'label' ), array_keys( $row ) );
		$this->assertSame( 'Chairs', $row['label'] );
	}

	public function test_get_terms_for_dropdown_returns_label_value_rows_and_paginates(): void {
		for ( $i = 1; $i <= 22; $i++ ) {
			$this->factory()->term->create(
				array(
					'taxonomy' => 'product_cat',
					'name'     => sprintf( 'Bulk %02d', $i ),
				)
			);
		}

		$page_1 = $this->call_handler(
			'wcapf_get_terms_for_dropdown',
			array(
				'taxonomy' => 'product_cat',
				'page'     => 1,
			)
		);
		$page_2 = $this->call_handler(
			'wcapf_get_terms_for_dropdown',
			array(
				'taxonomy' => 'product_cat',
				'page'     => 2,
			)
		);

		$this->assertCount( 20, $page_1['data'], 'Dropdown page size is 20.' );
		$this->assertSame( array( 'label', 'value' ), array_keys( $page_1['data'][0] ) );
		$this->assertNotEmpty( $page_2['data'], 'Page 2 must return the overflow rows.' );

		$page_1_ids = wp_list_pluck( $page_1['data'], 'value' );
		$page_2_ids = wp_list_pluck( $page_2['data'], 'value' );
		$this->assertSame( array(), array_intersect( $page_1_ids, $page_2_ids ), 'Pages must not overlap.' );
	}

	public function test_get_terms_for_dropdown_only_parent_filters_to_terms_with_children(): void {
		$parent = $this->factory()->term->create(
			array(
				'taxonomy' => 'product_cat',
				'name'     => 'Parent cat',
			)
		);
		$this->factory()->term->create(
			array(
				'taxonomy' => 'product_cat',
				'name'     => 'Child cat',
				'parent'   => $parent,
			)
		);
		$leaf = $this->factory()->term->create(
			array(
				'taxonomy' => 'product_cat',
				'name'     => 'Leaf cat',
			)
		);

		$response = $this->call_handler(
			'wcapf_get_terms_for_dropdown',
			array(
				'taxonomy'    => 'product_cat',
				'only_parent' => 'true',
			)
		);

		$values = wp_list_pluck( $response['data'], 'value' );
		$this->assertContains( $parent, $values, 'Parent term should be in the response.' );
		$this->assertNotContains( $leaf, $values, 'Childless term should be filtered out.' );
	}

	public function test_get_authors_for_dropdown_returns_label_value_rows(): void {
		$author_id = self::factory()->user->create(
			array(
				'role'         => 'author',
				'display_name' => 'Jane Author',
			)
		);

		$response = $this->call_handler( 'wcapf_get_authors_for_dropdown', array() );

		$this->assertTrue( $response['success'] );
		// Author ids round-trip through JSON encode/decode; compare loosely so
		// "8" / 8 don't fail the assertion when the underlying type shifts.
		$row = $this->find_row( $response['data'], 'value', (string) $author_id ) ?? $this->find_row( $response['data'], 'value', $author_id );
		$this->assertNotNull( $row, 'Author missing from dropdown response.' );
		$this->assertSame( array( 'label', 'value' ), array_keys( $row ) );
		$this->assertSame( 'Jane Author', $row['label'] );
	}

	public function test_get_post_authors_for_modal_filters_by_roles(): void {
		$author_id = self::factory()->user->create(
			array(
				'role'         => 'author',
				'display_name' => 'In-role',
			)
		);
		$editor_id = self::factory()->user->create(
			array(
				'role'         => 'editor',
				'display_name' => 'Out-of-role',
			)
		);

		$response = $this->call_handler(
			'wcapf_get_post_authors_for_modal',
			array( 'roles' => array( 'author' ) )
		);

		$values = array_map( 'intval', wp_list_pluck( $response['data'], 'value' ) );
		$this->assertContains( $author_id, $values );
		$this->assertNotContains( $editor_id, $values );
		$this->assertSame( array( 'label', 'value' ), array_keys( $response['data'][0] ) );
	}

	public function test_get_pages_for_dropdown_searches_by_keyword(): void {
		$matched = $this->factory()->post->create(
			array(
				'post_type'   => 'page',
				'post_status' => 'publish',
				'post_title'  => 'Match page',
			)
		);
		$other   = $this->factory()->post->create(
			array(
				'post_type'   => 'page',
				'post_status' => 'publish',
				'post_title'  => 'Unrelated',
			)
		);

		$response = $this->call_handler(
			'wcapf_get_pages_for_dropdown',
			array( 'keyword' => 'Match' )
		);

		$values = wp_list_pluck( $response['data'], 'value' );
		$this->assertContains( $matched, $values );
		$this->assertNotContains( $other, $values );
	}

	public function test_get_products_for_dropdown_returns_published_products(): void {
		$product = $this->factory()->post->create(
			array(
				'post_type'   => 'product',
				'post_status' => 'publish',
				'post_title'  => 'Visible widget',
			)
		);

		$response = $this->call_handler(
			'wcapf_get_products_for_dropdown',
			array( 'keyword' => 'widget' )
		);

		$values = wp_list_pluck( $response['data'], 'value' );
		$this->assertContains( $product, $values );
	}

	public function test_get_meta_values_for_modal_returns_distinct_values_for_meta_key(): void {
		$product_a = $this->factory()->post->create( array( 'post_type' => 'product', 'post_status' => 'publish' ) );
		$product_b = $this->factory()->post->create( array( 'post_type' => 'product', 'post_status' => 'publish' ) );

		update_post_meta( $product_a, 'fabric', 'cotton' );
		update_post_meta( $product_b, 'fabric', 'wool' );

		$response = $this->call_handler(
			'wcapf_get_meta_values_for_modal',
			array( 'meta_key' => 'fabric' )
		);

		$values = wp_list_pluck( $response['data'], 'value' );
		$this->assertContains( 'cotton', $values );
		$this->assertContains( 'wool', $values );
		$this->assertSame( array( 'value', 'label' ), array_keys( $response['data'][0] ) );
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
