<?php
/**
 * WCAPF_Field_Instance class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Field_Instance class.
 *
 * @since 3.0.0
 */
class WCAPF_Field_Instance {

	public $display_type;
	public $query_type;
	public $all_items_label;
	public $use_chosen;
	public $chosen_no_results_message;
	public $enable_multiple_filter;
	public $show_count;
	public $hide_empty;
	public $get_options;
	public $manual_options;
	public $position;
	public $type;
	public $form_id;
	public $filter_key;
	public $filter_type;
	public $taxonomy;
	public $hierarchical;
	public $enable_hierarchy_accordion;

	/**
	 * The raw field instance.
	 *
	 * @var array
	 */
	private $instance;

	/**
	 * The constructor.
	 *
	 * @param array $instance The raw field instance.
	 */
	public function __construct( $instance ) {
		$this->instance = $instance;

		$this->set_default_properties();
	}

	/**
	 * Sets the default properties.
	 *
	 * @return void
	 */
	private function set_default_properties() {
		$value_type = $this->get_value_type();

		if ( 'number' === $value_type ) {
			$display_type              = $this->get_sub_field_value( 'number_display_type' );
			$query_type                = $this->get_sub_field_value( 'number_range_query_type' );
			$all_items_label           = $this->get_sub_field_value( 'number_range_select_all_items_label' );
			$use_chosen                = $this->get_sub_field_value( 'number_range_use_chosen' );
			$chosen_no_results_message = $this->get_sub_field_value( 'number_range_chosen_no_results_message' );
			$enable_multiple_filter    = $this->get_sub_field_value( 'number_range_enable_multiple_filter' );
			$show_count                = $this->get_sub_field_value( 'number_range_show_count' );
			$hide_empty                = $this->get_sub_field_value( 'number_range_hide_empty' );
			$get_options               = $this->get_sub_field_value( 'number_get_options' );
			$manual_options            = $this->get_sub_field_value( 'number_manual_options' );
		} elseif ( 'date' === $value_type ) {
			$display_type              = $this->get_sub_field_value( 'date_display_type' );
			$query_type                = $this->get_sub_field_value( 'time_period_query_type' );
			$all_items_label           = $this->get_sub_field_value( 'time_period_select_all_items_label' );
			$use_chosen                = $this->get_sub_field_value( 'time_period_use_chosen' );
			$chosen_no_results_message = $this->get_sub_field_value( 'time_period_chosen_no_results_message' );
			$enable_multiple_filter    = $this->get_sub_field_value( 'time_period_enable_multiple_filter' );
			$show_count                = $this->get_sub_field_value( 'time_period_show_count' );
			$hide_empty                = $this->get_sub_field_value( 'time_period_hide_empty' );
			$get_options               = 'manual_entry'; // todo
			$manual_options            = $this->get_sub_field_value( 'time_period_options' );
		} else {
			$display_type              = $this->get_sub_field_value( 'display_type' );
			$query_type                = $this->get_sub_field_value( 'query_type' );
			$all_items_label           = $this->get_sub_field_value( 'all_items_label' );
			$use_chosen                = $this->get_sub_field_value( 'use_chosen' );
			$chosen_no_results_message = $this->get_sub_field_value( 'chosen_no_results_message' );
			$enable_multiple_filter    = $this->get_sub_field_value( 'enable_multiple_filter' );
			$show_count                = $this->get_sub_field_value( 'show_count' );
			$hide_empty                = $this->get_sub_field_value( 'hide_empty' );
			$get_options               = $this->get_sub_field_value( 'get_options' );
			$manual_options            = $this->get_sub_field_value( 'manual_options' );
		}

		$_display_type    = $this->parse_display_type( $display_type );
		$_all_items_label = $this->parse_all_items_label( $all_items_label );

		$this->display_type              = $_display_type;
		$this->all_items_label           = $_all_items_label;
		$this->use_chosen                = $use_chosen;
		$this->chosen_no_results_message = $chosen_no_results_message;
		$this->show_count                = $show_count;
		$this->hide_empty                = $hide_empty;
		$this->get_options               = $get_options;
		$this->manual_options            = $manual_options;

		switch ( $_display_type ) {
			case 'multiselect':
			case 'checkbox':
				$enable_multiple_filter = true;
				break;

			case 'select':
			case 'radio':
			case 'range_number':
			case 'range_slider':
				$enable_multiple_filter = false;
				$query_type             = 'or';
				break;
		}

		if ( ! $enable_multiple_filter ) {
			$query_type = 'or';
		}

		$query_type = apply_filters( 'wcapf_field_instance_query_type', $query_type, $this->instance );

		$enable_multiple_filter = apply_filters(
			'wcapf_field_instance_enable_multiple_filter',
			$enable_multiple_filter,
			$this->instance
		);

		$this->query_type             = $query_type;
		$this->enable_multiple_filter = $enable_multiple_filter;

		$this->position = $this->get_sub_field_value( 'position' );
		$this->type     = $this->get_field_type();
		$this->form_id  = 1; // TODO: Form id will be dynamic.

		$this->filter_type  = $this->get_filter_type();
		$this->filter_key   = $this->get_filter_key();
		$this->taxonomy     = $this->get_taxonomy();
		$this->hierarchical = $this->taxonomy_is_hierarchical();

		$this->enable_hierarchy_accordion = $this->is_hierarchy_accordion_enabled();
	}

	/**
	 * @return string
	 */
	private function get_value_type() {
		$field_type = $this->get_field_type();
		$value_type = $this->get_sub_field_value( 'value_type' );

		if ( 'price' === $field_type ) {
			$value_type = 'number';
		} elseif ( 'rating' === $field_type ) {
			$value_type = 'number';
		}

		return apply_filters( 'wcapf_field_value_type', $value_type );
	}

	/**
	 * @return string
	 */
	private function get_field_type() {
		return $this->get_sub_field_value( 'type' );
	}

	/**
	 * @param string $name
	 *
	 * @return mixed
	 */
	public function get_sub_field_value( $name ) {
		if ( isset( $this->instance[ $name ] ) ) {
			return $this->instance[ $name ];
		}

		return '';
	}

	/**
	 * @param string $display_type
	 *
	 * @return string
	 */
	private function parse_display_type( $display_type ) {
		$available_display_types = array(
			'checkbox'         => array( 'checkbox', 'range_checkbox', 'time_period_checkbox' ),
			'radio'            => array( 'radio', 'range_radio', 'time_period_radio' ),
			'select'           => array( 'select', 'range_select', 'time_period_select' ),
			'multiselect'      => array( 'multi-select', 'range_multiselect', 'time_period_multiselect' ),
			'label'            => array( 'label', 'range_label', 'time_period_label' ),
			'color'            => array( 'color', 'range_color', 'time_period_color' ),
			'image'            => array( 'image', 'range_image', 'time_period_image' ),
			'range_slider'     => array( 'range_slider' ),
			'range_number'     => array( 'range_number' ),
			'input_date'       => array( 'input_date' ),
			'input_date_range' => array( 'input_date_range' ),
		);

		$available_display_types = apply_filters( 'wcapf_field_display_types', $available_display_types );

		$_display_type = '';

		foreach ( $available_display_types as $key => $display_types ) {
			if ( in_array( $display_type, $display_types ) ) {
				$_display_type = $key;
				break;
			}
		}

		return $_display_type;
	}

	/**
	 * @param string $all_items_label
	 *
	 * @return string
	 */
	private function parse_all_items_label( $all_items_label ) {
		$type = $this->get_sub_field_value( 'type' );

		if ( ! $all_items_label ) {
			switch ( $type ) {
				case 'category':
					$all_items_label = __( 'All categories', 'wc-ajax-product-filter' );
					break;

				case 'tag':
					$all_items_label = __( 'All tags', 'wc-ajax-product-filter' );
					break;

				default:
					$all_items_label = __( 'All items', 'wc-ajax-product-filter' );
					break;
			}
		}

		return $all_items_label;
	}

	/**
	 * @return string
	 */
	private function get_filter_type() {
		$field_type = $this->get_field_type();

		if ( in_array( $field_type, $this->taxonomy_field_types() ) ) {
			$filter_type = 'taxonomy';
		} else {
			$filter_type = $field_type;
		}

		return $filter_type;
	}

	/**
	 * @return array
	 */
	private function taxonomy_field_types() {
		return array( 'category', 'tag', 'attribute', 'custom-taxonomy' );
	}

	/**
	 * @return string
	 */
	private function get_filter_key() {
		$field_type = $this->get_field_type();
		$filter_key = '';

		$taxonomy_types = $this->taxonomy_field_types();

		if ( in_array( $field_type, $taxonomy_types ) ) {
			$filter_key = $this->get_taxonomy_filter_key();
		} elseif ( 'price' === $field_type ) {
			$filter_key = $this->get_price_filter_key();
		} elseif ( 'rating' === $field_type ) {
			$filter_key = $this->get_rating_filter_key();
		} elseif ( 'product-status' === $field_type ) {
			$filter_key = $this->get_product_status_filter_key();
		}

		return apply_filters( 'wcapf_field_filter_key', $filter_key, $this );
	}

	/**
	 * @return string
	 */
	private function get_taxonomy_filter_key() {
		$taxonomy = $this->get_taxonomy_from_field_instance();

		$filter_keys = WCAPF_Product_Filter_Utils::get_taxonomy_filter_keys();
		$query_type  = $this->query_type;

		return isset( $filter_keys[ $taxonomy ] ) ? $filter_keys[ $taxonomy ][ $query_type ] : '';
	}

	/**
	 * @return string
	 */
	private function get_taxonomy_from_field_instance() {
		$field_type = $this->get_field_type();

		switch ( $field_type ) {
			case 'category':
				$taxonomy = 'product_cat';
				break;

			case 'tag':
				$taxonomy = 'product_tag';
				break;

			case 'attribute':
			case 'custom-taxonomy':
				$taxonomy = $this->get_sub_field_value( 'taxonomy' );
				break;

			default:
				$taxonomy = '';
				break;
		}

		return $taxonomy;
	}

	private function get_price_filter_key() {
		return 'price';
	}

	private function get_rating_filter_key() {
		return 'rating';
	}

	private function get_product_status_filter_key() {
		return 'product-status';
	}

	/**
	 * @return string
	 */
	private function get_taxonomy() {
		if ( 'taxonomy' !== $this->get_filter_type() ) {
			return '';
		}

		return $this->get_taxonomy_from_field_instance();
	}

	/**
	 * @return bool
	 */
	private function taxonomy_is_hierarchical() {
		$taxonomy = $this->get_taxonomy();

		if ( ! $taxonomy ) {
			return false;
		}

		if ( ! is_taxonomy_hierarchical( $taxonomy ) ) {
			return false;
		}

		$non_hierarchical_display_types = array( 'label', 'color', 'image' );

		if ( in_array( $this->display_type, $non_hierarchical_display_types ) ) {
			return false;
		}

		return boolval( $this->get_sub_field_value( 'hierarchical' ) );
	}

	/**
	 * @return bool
	 */
	private function is_hierarchy_accordion_enabled() {
		if ( ! $this->taxonomy_is_hierarchical() ) {
			return false;
		}

		return boolval( $this->get_sub_field_value( 'enable_hierarchy_accordion' ) );
	}

}
