<?php
/**
 * Behavior tests for the post-author filter.
 *
 * Asserts the authors a configured post-author field produces (include/exclude,
 * role limiting, sort) via the filter-type output, independent of where that
 * logic is wired. Counts are not asserted (hide_empty is off, so authors with
 * zero products still appear), so no products are needed.
 *
 * @package wc-ajax-product-filter
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/FilterBehaviorTestCase.php';

/**
 * @group post-author-filter
 */
class PostAuthorFilterTest extends FilterBehaviorTestCase {

	/**
	 * Author user ID (display name "Aaa Author").
	 *
	 * @var int
	 */
	private $author_a;

	/**
	 * Author user ID (display name "Bbb Author").
	 *
	 * @var int
	 */
	private $author_b;

	/**
	 * Editor user ID (display name "Ccc Editor").
	 *
	 * @var int
	 */
	private $editor;

	/**
	 * Creates two authors and one editor with name-sortable display names.
	 */
	public function set_up() {
		parent::set_up();

		$this->author_a = $this->factory()->user->create(
			array(
				'role'         => 'author',
				'display_name' => 'Aaa Author',
			)
		);
		$this->author_b = $this->factory()->user->create(
			array(
				'role'         => 'author',
				'display_name' => 'Bbb Author',
			)
		);
		$this->editor = $this->factory()->user->create(
			array(
				'role'         => 'editor',
				'display_name' => 'Ccc Editor',
			)
		);
	}

	/**
	 * Builds a post-author field with the given overrides applied.
	 *
	 * @param array $overrides Field-data overrides.
	 *
	 * @return \WCAPF_Field_Instance
	 */
	private function author_field( array $overrides = array() ): \WCAPF_Field_Instance {
		return $this->make_field(
			array_merge(
				array(
					'type'         => 'post-author',
					'field_key'    => 'post_author',
					'id'           => 1,
					'get_options'  => 'automatically',
					'display_type' => 'checkbox',
					'show_count'   => '1',
					'hide_empty'   => '',
				),
				$overrides
			)
		);
	}

	public function test_include_limits_to_listed_authors() {
		$field = $this->author_field(
			array(
				'limit_options'   => 'include',
				'include_authors' => array( $this->author_a, $this->author_b ),
			)
		);

		$ids = array_keys( $this->post_author_items( $field ) );
		sort( $ids );

		$expected = array( $this->author_a, $this->author_b );
		sort( $expected );

		$this->assertSame( $expected, $ids );
	}

	public function test_exclude_removes_listed_author() {
		$field = $this->author_field(
			array(
				'limit_options'   => 'exclude',
				'exclude_authors' => array( $this->author_b ),
			)
		);

		$ids = array_keys( $this->post_author_items( $field ) );

		$this->assertNotContains( $this->author_b, $ids );
		$this->assertContains( $this->author_a, $ids );
	}

	public function test_user_roles_limits_to_role() {
		$field = $this->author_field(
			array(
				'limit_options'      => 'user_roles',
				'include_user_roles' => array( 'author' ),
			)
		);

		$ids = array_keys( $this->post_author_items( $field ) );
		sort( $ids );

		$expected = array( $this->author_a, $this->author_b );
		sort( $expected );

		$this->assertSame( $expected, $ids );
	}

	public function test_sort_by_name_ascending_and_descending() {
		$base = array(
			'limit_options'         => 'include',
			'include_authors'       => array( $this->author_a, $this->author_b, $this->editor ),
			'post_author_order_by'  => 'name',
		);

		$asc = array_keys( $this->post_author_items( $this->author_field( $base + array( 'post_author_order_dir' => 'asc' ) ) ) );
		$this->assertSame( array( $this->author_a, $this->author_b, $this->editor ), $asc );

		$desc = array_keys( $this->post_author_items( $this->author_field( $base + array( 'post_author_order_dir' => 'desc' ) ) ) );
		$this->assertSame( array_reverse( $asc ), $desc );
	}

	public function test_sort_by_id_ascending() {
		$field = $this->author_field(
			array(
				'limit_options'         => 'include',
				'include_authors'       => array( $this->author_a, $this->author_b, $this->editor ),
				'post_author_order_by'  => 'id',
				'post_author_order_dir' => 'asc',
			)
		);

		$ids      = array_keys( $this->post_author_items( $field ) );
		$expected = $ids;
		sort( $expected, SORT_NUMERIC );

		$this->assertSame( $expected, $ids );
	}
}
