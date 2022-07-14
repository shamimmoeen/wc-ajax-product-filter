<?php
/**
 * The filter post type class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
 */

/**
 * WCAPF_Post_Type class.
 *
 * @since 3.0.0
 */
class WCAPF_Post_Type {

	/**
	 * Constructor.
	 */
	private function __construct() {
	}

	/**
	 * Returns an instance of this class.
	 *
	 * @return WCAPF_Post_Type
	 */
	public static function instance() {
		// Store the instance locally to avoid private static replication
		static $instance = null;

		// Only run these methods if they haven't been run previously
		if ( null === $instance ) {
			$instance = new WCAPF_Post_Type();
			$instance->init_hooks();
		}

		return $instance;
	}

	/**
	 * Hook into actions and filters.
	 */
	private function init_hooks() {
		add_action( 'init', array( $this, 'register_post_types' ) );
		add_filter( 'post_row_actions', array( $this, 'remove_row_actions' ) );
		add_filter( 'manage_wcapf-filter_posts_columns', array( $this, 'set_filter_posts_table_columns' ) );
		add_action( 'manage_wcapf-filter_posts_custom_column', array( $this, 'set_filter_posts_column_data' ), 10, 2 );
		add_action( 'admin_init', array( $this, 'action_admin_init' ) );
		add_filter( 'enter_title_here', array( $this, 'set_filter_post_title_placeholder' ), 10, 2 );
		add_filter( 'post_updated_messages', array( $this, 'set_filter_updated_messages' ) );
		add_filter( 'bulk_post_updated_messages', array( $this, 'change_bulk_post_updated_message' ), 10, 2 );
	}

	/**
	 * Register a custom post type called "wcapf-filter".
	 */
	public function register_post_types() {
		$labels = array(
			'name'               => _x( 'Filters', 'Post type general name', 'wc-ajax-product-filter' ),
			'singular_name'      => _x( 'Filter', 'Post type singular name', 'wc-ajax-product-filter' ),
			'menu_name'          => _x( 'WCAPF', 'Admin Menu text', 'wc-ajax-product-filter' ),
			'name_admin_bar'     => _x( 'Filter', 'Add New on Toolbar', 'wc-ajax-product-filter' ),
			'add_new'            => __( 'Add New', 'wc-ajax-product-filter' ),
			'add_new_item'       => __( 'Add New Filter', 'wc-ajax-product-filter' ),
			'new_item'           => __( 'New Filter', 'wc-ajax-product-filter' ),
			'edit_item'          => __( 'Edit Filter', 'wc-ajax-product-filter' ),
			'view_item'          => __( 'View Filter', 'wc-ajax-product-filter' ),
			'all_items'          => __( 'All Filters', 'wc-ajax-product-filter' ),
			'search_items'       => __( 'Search Filters', 'wc-ajax-product-filter' ),
			'parent_item_colon'  => __( 'Parent Filters:', 'wc-ajax-product-filter' ),
			'not_found'          => __( 'No filters found.', 'wc-ajax-product-filter' ),
			'not_found_in_trash' => __( 'No filters found in Trash.', 'wc-ajax-product-filter' ),
		);

		$args = array(
			'labels'            => $labels,
			'public'            => false,
			'show_ui'           => true,
			'show_in_nav_menus' => false,
			'show_in_menu'      => true,
			'show_in_admin_bar' => false,
			'query_var'         => true,
			'rewrite'           => array( 'slug' => 'wcapf-filter' ),
			'supports'          => array( 'title' ),
			'menu_icon'         => 'dashicons-filter',
			'menu_position'     => 100,
			'capabilities'      => array(
				'edit_post'          => 'manage_options',
				'read_post'          => 'manage_options',
				'delete_post'        => 'manage_options',
				'edit_posts'         => 'manage_options',
				'edit_others_posts'  => 'manage_options',
				'delete_posts'       => 'manage_options',
				'publish_posts'      => 'manage_options',
				'read_private_posts' => 'manage_options'
			),
		);

		register_post_type( 'wcapf-filter', $args );
	}

	/**
	 * Remove row action "Quick Edit".
	 *
	 * @param array $actions The row actions.
	 *
	 * @return array
	 */
	public function remove_row_actions( $actions ) {
		if ( 'wcapf-filter' !== get_post_type() ) {
			return $actions;
		}

		unset( $actions['inline hide-if-no-js'] );

		return $actions;
	}

	/**
	 * Add the custom columns to the wcapf-filter post type.
	 *
	 * @param array $columns The columns.
	 *
	 * @return array
	 */
	public function set_filter_posts_table_columns( $columns ) {
		unset( $columns['date'] );

		$columns['filter_key']       = __( 'Filter Key', 'wc-ajax-product-filter' );
		$columns['filter_type']      = __( 'Filter Type', 'wc-ajax-product-filter' );
		$columns['filter_shortcode'] = __( 'Shortcode', 'wc-ajax-product-filter' );

		return $columns;
	}

	/**
	 * Sets the custom columns' data for the wcapf-filter post type.
	 *
	 * @param string $column  The column name.
	 * @param int    $post_id The post id.
	 *
	 * @return void
	 */
	public function set_filter_posts_column_data( $column, $post_id ) {
		switch ( $column ) {
			case 'filter_key' :
				echo get_post_meta( $post_id, '_filter_key', true );

				break;

			case 'filter_type' :
				$filter_type = $this->get_filter_type_custom_column( $post_id );

				echo $filter_type;

				break;

			case 'filter_shortcode' :
				if ( 'publish' === get_post_status( $post_id ) ) {
					echo '<span class="wcapf-filter-shortcode">';
					echo '[wcapf_filter id="' . esc_html( $post_id ) . '"]';
					echo '</span>';
				}

				break;
		}
	}

	/**
	 * Gets the filter type custom column data.
	 *
	 * @param int $post_id The post id.
	 *
	 * @return string
	 */
	protected function get_filter_type_custom_column( $post_id ) {
		$data = get_post_meta( $post_id, '_field_data', true );
		$type = isset( $data['type'] ) ? $data['type'] : '';

		$fields = WCAPF_Helper::available_search_fields();
		$name   = isset( $fields[ $type ] ) ? $fields[ $type ] : '';

		if ( 'attribute' === $type ) {
			$taxonomy = isset( $data['taxonomy'] ) ? $data['taxonomy'] : '';

			$name .= $taxonomy ? ': <b>' . $taxonomy . '</b>' : '';
		}

		return apply_filters( 'wcapf_filter_type_custom_column', $name, $data );
	}

	/**
	 * Run admin init scripts.
	 *
	 * @return void
	 */
	public function action_admin_init() {
		global $typenow;

		if ( 'wcapf-filter' === $typenow ) {
			add_filter( 'months_dropdown_results', '__return_empty_array' );
		}
	}

	/**
	 * Sets the 'wcapf-filter' post type placeholder.
	 *
	 * @param string  $placeholder The default placeholder.
	 * @param WP_Post $post        The post object.
	 *
	 * @return string
	 */
	public function set_filter_post_title_placeholder( $placeholder, $post ) {
		if ( 'wcapf-filter' === $post->post_type ) {
			$placeholder = __( 'Filter title', 'wc-ajax-product-filter' );
		}

		return $placeholder;
	}

	/**
	 * Filter-specific update messages.
	 *
	 * @param array $messages Existing post update messages.
	 *
	 * @return array Amended post update messages with new CPT update messages.
	 *
	 * @see /wp-admin/edit-form-advanced.php
	 */
	public function set_filter_updated_messages( $messages ) {
		$post = get_post();

		$revision_message = isset( $_GET['revision'] ) ? sprintf(
			__( 'Filter restored to revision from %s', 'wc-ajax-product-filter' ),
			wp_post_revision_title( (int) $_GET['revision'], false )
		) : false;

		$scheduled_message = sprintf(
			__( 'Filter scheduled for: <strong>%1$s</strong>.', 'wc-ajax-product-filter' ),
			// translators: Publish box date format, see http://php.net/date
			date_i18n( __( 'M j, Y @ G:i', 'wc-ajax-product-filter' ), strtotime( $post->post_date ) )
		);

		$messages['wcapf-filter'] = array(
			0  => '', // Unused. Messages start at index 1.
			1  => __( 'Filter updated.', 'wc-ajax-product-filter' ),
			2  => __( 'Custom field updated.', 'wc-ajax-product-filter' ),
			3  => __( 'Custom field deleted.', 'wc-ajax-product-filter' ),
			4  => __( 'Filter updated.', 'wc-ajax-product-filter' ),
			/* translators: %s: date and time of the revision */
			5  => $revision_message,
			6  => __( 'Filter published.', 'wc-ajax-product-filter' ),
			7  => __( 'Filter saved.', 'wc-ajax-product-filter' ),
			8  => __( 'Filter submitted.', 'wc-ajax-product-filter' ),
			9  => $scheduled_message,
			10 => __( 'Filter draft updated.', 'wc-ajax-product-filter' ),
		);

		return $messages;
	}

	/**
	 * Specify custom bulk actions messages for 'wcapf-filter' post type.
	 *
	 * @param array $bulk_messages Array of messages.
	 * @param array $bulk_counts   Array of how many objects were updated.
	 *
	 * @return array
	 */
	public function change_bulk_post_updated_message( $bulk_messages, $bulk_counts ) {
		$deleted_message = sprintf(
			_n(
				'%s filter permanently deleted.',
				'%s filters permanently deleted.',
				$bulk_counts['deleted'],
				'wc-ajax-product-filter'
			),
			$bulk_counts['deleted']
		);

		$trashed_message = sprintf(
			_n(
				'%s filter moved to the Trash.',
				'%s filters moved to the Trash.',
				$bulk_counts['trashed'],
				'wc-ajax-product-filter'
			),
			$bulk_counts['trashed']
		);

		$untrashed_message = sprintf(
			_n(
				'%s filter restored from the Trash.',
				'%s filters restored from the Trash.',
				$bulk_counts['untrashed'],
				'wc-ajax-product-filter'
			),
			$bulk_counts['untrashed']
		);

		$bulk_messages['wcapf-filter']['deleted']   = $deleted_message;
		$bulk_messages['wcapf-filter']['trashed']   = $trashed_message;
		$bulk_messages['wcapf-filter']['untrashed'] = $untrashed_message;

		return $bulk_messages;
	}

}

WCAPF_Post_Type::instance();
