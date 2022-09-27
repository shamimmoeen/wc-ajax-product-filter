<?php
/**
 * WCAPF_Field_Instance class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     wptools.io
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
	public $custom_appearance_options;
	public $type;
	public $filter_id;
	public $filter_key;
	public $filter_type;
	public $taxonomy;
	public $hierarchical;
	public $enable_hierarchy_accordion;
	public $value_type;
	public $meta_key;
	public $post_property;
	public $use_store_name;
	public $number_data_type;

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
		$field_type = $this->get_field_type();
		$this->type = $field_type;

		$value_type = $this->field_default_value_type();

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
			$get_options               = 'manual_entry';
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

		if ( 'product-status' === $field_type ) {
			$get_options    = 'manual_entry';
			$manual_options = $this->get_sub_field_value( 'product_status_options' );
		}

		$get_options    = apply_filters( 'wcapf_field_instance_get_options', $get_options, $this->instance );
		$manual_options = apply_filters( 'wcapf_field_instance_manual_options', $manual_options, $this->instance );

		// Default is 'automatically'.
		$get_options = 'manual_entry' === $get_options ? 'manual_entry' : 'automatically';

		// Default is an array.
		$manual_options = is_array( $manual_options ) ? $manual_options : array();

		$this->get_options    = $get_options;
		$this->manual_options = $manual_options;

		$_display_type    = $this->parse_display_type( $display_type );
		$_all_items_label = $this->parse_all_items_label( $all_items_label );

		$this->display_type              = $_display_type;
		$this->all_items_label           = $_all_items_label;
		$this->use_chosen                = $use_chosen;
		$this->chosen_no_results_message = $chosen_no_results_message;
		$this->show_count                = $show_count;
		$this->hide_empty                = $hide_empty;

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

		$this->filter_id  = $this->get_sub_field_value( 'field_id' );
		$this->filter_key = $this->get_sub_field_value( 'field_key' );

		$this->filter_type  = $this->get_filter_type();
		$this->taxonomy     = $this->get_taxonomy();
		$this->hierarchical = $this->taxonomy_is_hierarchical();

		$this->enable_hierarchy_accordion = $this->is_hierarchy_accordion_enabled();

		$this->meta_key         = $this->get_meta_key();
		$this->value_type       = $this->get_value_type();
		$this->number_data_type = $this->get_number_data_type();

		$this->post_property = $this->get_sub_field_value( 'post_property' );

		$this->use_store_name = $this->is_store_name_enabled();

		$this->custom_appearance_options = $this->get_appearance_data();
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
	 * @return string
	 */
	private function field_default_value_type() {
		$field_type = $this->get_field_type();
		$value_type = $this->get_sub_field_value( 'value_type' );

		if ( 'price' === $field_type ) {
			$value_type = 'number';
		}

		return apply_filters( 'wcapf_field_default_value_type', $value_type, $field_type, $this->instance );
	}

	/**
	 * @param string $display_type
	 *
	 * @return string
	 */
	private function parse_display_type( $display_type ) {
		$available_display_types = array(
			'checkbox'     => array( 'checkbox' ),
			'radio'        => array( 'radio' ),
			'select'       => array( 'select' ),
			'multiselect'  => array( 'multi-select' ),
			'label'        => array( 'label' ),
			'range_slider' => array( 'range_slider' ),
			'range_number' => array( 'range_number' ),
		);

		$available_display_types = apply_filters( 'wcapf_field_display_types', $available_display_types );

		if ( 'price' === $this->get_field_type() ) {
			$_display_type = 'range_slider';
		} else {
			$_display_type = 'checkbox';
		}

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
					$all_items_label = apply_filters( 'wcapf_default_all_items_label', '', $type );
					break;
			}
		}

		return $all_items_label ?: __( 'All items', 'wc-ajax-product-filter' );
	}

	/**
	 * @return string
	 */
	private function get_filter_type() {
		$field_type = $this->get_field_type();

		if ( in_array( $field_type, WCAPF_Helper::taxonomy_field_types() ) ) {
			$filter_type = 'taxonomy';
		} else {
			$filter_type = $field_type;
		}

		return apply_filters( 'wcapf_field_filter_type', $filter_type, $field_type, $this->instance );
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
				$taxonomy = $this->get_sub_field_value( 'taxonomy' );
				break;

			default:
				$taxonomy = '';
				break;
		}

		return apply_filters( 'wcapf_field_taxonomy', $taxonomy, $field_type, $this->instance );
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

	/**
	 * @return string
	 */
	private function get_meta_key() {
		$meta_key = $this->get_sub_field_value( 'meta_key' );

		return apply_filters( 'wcapf_field_meta_key', $meta_key, $this->instance );
	}

	/**
	 * @return string
	 */
	private function get_value_type() {
		$default_value_type = $this->field_default_value_type();

		return apply_filters( 'wcapf_field_value_type', $default_value_type, $this->instance );
	}

	/**
	 * @return string
	 */
	private function get_number_data_type() {
		$data_type = 'SIGNED';

		$field_type = $this->get_field_type();
		$value_type = $this->get_value_type();

		if ( 'price' === $field_type ) {
			$dec_places = absint( wc_get_price_decimals() );

			$data_type = 'DECIMAL(10,' . $dec_places . ')';
		} elseif ( 'number' === $value_type ) {
			if ( '1' === $this->get_sub_field_value( 'value_decimal' ) ) {
				$dec_places = $this->get_sub_field_value( 'value_decimal_places' );

				$data_type = 'DECIMAL(10,' . $dec_places . ')';
			}
		}

		return apply_filters( 'wcapf_number_data_type', $data_type, $this->instance );
	}

	/**
	 * @return string
	 *
	 * @since 3.3.0
	 */
	public function is_store_name_enabled() {
		if ( ! class_exists( 'WCFMmp' ) ) {
			return '';
		}

		return $this->get_sub_field_value( 'use_store_name' );
	}

	/**
	 * @return array
	 */
	protected function get_appearance_data() {
		$options = $this->get_sub_field_value( 'custom_appearance_options' );

		return apply_filters( 'wcapf_field_instance_appearance_options', $options, $this );
	}

}
