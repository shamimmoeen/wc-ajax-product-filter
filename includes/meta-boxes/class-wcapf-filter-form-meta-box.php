<?php
/**
 * The filter form meta box class.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/meta-boxes
 * @author     wptools.io
 */

/**
 * WCAPF_Filter_Form_Meta_Box class.
 *
 * @since 3.1.0
 */
class WCAPF_Filter_Form_Meta_Box {

	/**
	 * Constructor.
	 */
	private function __construct() {
	}

	/**
	 * Returns an instance of this class.
	 *
	 * @return WCAPF_Filter_Form_Meta_Box
	 */
	public static function instance() {
		// Store the instance locally to avoid private static replication
		static $instance = null;

		// Only run these methods if they haven't been run previously
		if ( null === $instance ) {
			$instance = new WCAPF_Filter_Form_Meta_Box();
			$instance->init_hooks();
		}

		return $instance;
	}

	/**
	 * Hook into actions and filters.
	 */
	private function init_hooks() {
		add_action( 'save_post', array( $this, 'save_form' ) );
		add_action( 'edit_form_advanced', array( $this, 'render_meta_box' ) );
		add_action( 'admin_footer', array( $this, 'render_tmpl_templates' ) );
	}

	/**
	 * Saves the form.
	 *
	 * @param int $post_id The post id.
	 *
	 * @return void
	 */
	public function save_form( $post_id ) {
		if ( ! isset( $_POST['wcapf_filter_form_meta_box_nonce'] ) ) {
			return;
		}

		if ( ! wp_verify_nonce( $_POST['wcapf_filter_form_meta_box_nonce'], 'save_filter_form_meta_data' ) ) {
			return;
		}

		$filter_ids              = isset( $_POST['filter_id'] ) ? $_POST['filter_id'] : array();
		$hide_on                 = isset( $_POST['hide_on'] ) ? $_POST['hide_on'] : array();
		$enable_visibility_rules = isset( $_POST['enable_visibility_rules'] ) ? $_POST['enable_visibility_rules'] : '';

		$parsed_data = array(
			'filter_ids'              => $filter_ids,
			'hide_on'                 => $hide_on,
			'enable_visibility_rules' => $enable_visibility_rules,
		);

		$parsed_data = apply_filters( 'wcapf_parse_form_data', $parsed_data, $_POST );

		update_post_meta( $post_id, '_form_data', $parsed_data );
	}

	/**
	 * Renders the meta box.
	 *
	 * @param WP_Post $post The post object.
	 *
	 * @return void
	 */
	public function render_meta_box( $post ) {
		if ( 'wcapf-form' !== get_post_type() ) {
			return;
		}

		$post_id = $post->ID;

		$form_data  = get_post_meta( $post_id, '_form_data', true );
		$filter_ids = isset( $form_data['filter_ids'] ) ? $form_data['filter_ids'] : array();

		$available_filters = get_posts(
			array(
				'post_type'   => 'wcapf-filter',
				'post_status' => 'publish',
				'nopaging'    => true,
				'fields'      => 'ids',
			)
		);

		WCAPF_Template_Loader::get_instance()->load(
			'admin/filter-form-meta-box',
			array(
				'available_filters' => $available_filters,
				'filter_ids'        => $filter_ids,
			)
		);
	}

	/**
	 * Renders the tmpl version of filter form item template.
	 *
	 * @return void
	 */
	public function render_tmpl_templates() {
		if ( 'wcapf-form' === get_post_type() ) {
			echo '<script type="text/html" id="tmpl-wcapf-filter-form-item">';
			echo WCAPF_Template_Loader::get_instance()->load(
				'admin/filter-form-item',
				array( 'for_tmpl' => true ),
				false
			);
			echo '</script>';
		}
	}

}

WCAPF_Filter_Form_Meta_Box::instance();
