<?php
/**
 * WCAPF_Field_Price class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/fields
 * @author     Mainul Hassan Main
 */

/**
 * WCAPF_Field_Post_Meta class.
 *
 * @since 3.0.0
 */
class WCAPF_Field_Price extends WCAPF_Field {

	/**
	 * Sets the field groups.
	 *
	 * @return array
	 */
	protected function field_groups() {
		$number_field_group = new WCAPF_Field_Group_Number();

		return $number_field_group->get_group_fields();
	}

	/**
	 * The field type.
	 *
	 * @return string
	 */
	protected function type() {
		return 'price';
	}

	/**
	 * TODO: Complete this.
	 *
	 * @return void
	 */
	protected function render_filter_form() {
		// TODO: Maybe redundant
		if ( ! is_shop() && ! is_product_taxonomy() ) {
			return;
		}

		$instance = $this->get_instance();
		$form_id  = 1; // TODO: Set it dynamically.

		$display_type       = $this->get_sub_field_value( 'number_display_type' );
		$all_items_label    = $this->get_sub_field_value( 'all_items_label' );
		$query_type         = $this->get_sub_field_value( 'query_type' );
		$enable_multiple    = boolval( $this->get_sub_field_value( 'enable_multiple_filter' ) );
		$use_chosen         = boolval( $this->get_sub_field_value( 'use_chosen' ) );
		$no_results_message = $this->get_sub_field_value( 'chosen_no_results_message' );
		$show_count         = boolval( $this->get_sub_field_value( 'show_count' ) );
		$hierarchical       = boolval( $this->get_sub_field_value( 'hierarchical' ) );
		$show_children_only = boolval( $this->get_sub_field_value( 'show_children_only' ) ); // todo: remove
		$hide_empty         = boolval( $this->get_sub_field_value( 'hide_empty' ) );
		$position           = $this->get_sub_field_value( 'position' );

		$custom_appearance_options = $this->get_sub_field_value( 'custom_appearance_options' );

		$walker = new WCAPF_Walker();

		$classes = array( 'wcapf-ajax-term-filter' );

		// if ( ! $items ) {
		// 	$classes[] = 'wcapf-field-hidden';
		// }

		$items       = array();
		$filter_key  = 'price';
		$filter_type = 'post_meta';

		$this->before_filter_form( $classes );

		$chosen_filters = WCAPF_Product_Filter::instance()->get_chosen_filters();
		$filters        = $chosen_filters[ $filter_type ];
		$filter         = isset( $filters[ $filter_key ] ) ? $filters[ $filter_key ] : array();
		$values         = isset( $filter['values'] ) ? $filter['values'] : array();

		$range_min_value       = floatval( $this->get_sub_field_value( 'min_value' ) );
		$range_max_value       = floatval( $this->get_sub_field_value( 'max_value' ) );
		$step                  = floatval( $this->get_sub_field_value( 'step' ) );
		$range_min_auto_detect = $this->get_sub_field_value( 'min_value_auto_detect' );
		$range_max_auto_detect = $this->get_sub_field_value( 'max_value_auto_detect' );
		$value_prefix          = $this->get_sub_field_value( 'value_prefix' );
		$value_postfix         = $this->get_sub_field_value( 'value_postfix' );
		$values_separator      = $this->get_sub_field_value( 'values_separator' );
		$decimal_places        = absint( $this->get_sub_field_value( 'decimal_places' ) );
		$thousand_separator    = $this->get_sub_field_value( 'thousand_separator' );
		$decimal_separator     = $this->get_sub_field_value( 'decimal_separator' );

		list( $db_min, $db_max ) = $this->get_db_price_range();

		if ( $range_min_auto_detect ) {
			$range_min_value = $db_min;
		}

		if ( $range_max_auto_detect ) {
			$range_max_value = $db_max;
		}

		if ( 2 === count( $values ) ) {
			$min_value = $values[0];
			$max_value = $values[1];
		} else {
			$min_value = $range_min_value;
			$max_value = $range_max_value;
		}

		if ( floatval( $min_value ) > floatval( $max_value ) ) {
			$max_value = $min_value;
		}

		if ( 'range_number' === $display_type ) {
			$data = array(
				'filter_key'       => $filter_key,
				'min_value'        => $min_value,
				'max_value'        => $max_value,
				'range_min_value'  => $range_min_value,
				'range_max_value'  => $range_max_value,
				'step'             => $step,
				'value_prefix'     => $value_prefix,
				'value_postfix'    => $value_postfix,
				'values_separator' => $values_separator,
			);

			WCAPF_Template_Loader::get_instance()->load( 'public/filter-range-number', $data );
		} elseif ( 'range_slider' === $display_type ) {
			$slider_id         = $filter_key . '-slider-' . $form_id . '-' . $position;
			$display_values_as = $this->get_sub_field_value( 'number_range_slider_display_values_as' );

			$data = array(
				'filter_key'         => $filter_key,
				'min_value'          => $min_value,
				'max_value'          => $max_value,
				'range_min_value'    => $range_min_value,
				'range_max_value'    => $range_max_value,
				'step'               => $step,
				'value_prefix'       => $value_prefix,
				'value_postfix'      => $value_postfix,
				'values_separator'   => $values_separator,
				'decimal_places'     => $decimal_places,
				'thousand_separator' => $thousand_separator,
				'decimal_separator'  => $decimal_separator,
				'slider_id'          => $slider_id,
				'display_values_as'  => $display_values_as,
			);

			WCAPF_Template_Loader::get_instance()->load( 'public/filter-range-slider', $data );
		} else {
			echo $walker->build_menu( $items ); // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped // todo
		}

		$this->after_filter_form();
	}

	/**
	 * @return array
	 */
	private function get_db_price_range() {
		$db_min_price = $this->get_db_min_price();
		$db_max_price = $this->get_db_max_price();

		// echo 'min price: ' . $db_min_price . '<br>';
		// echo 'max price: ' . $db_max_price . '<br>';

		// @source woof plugin
		$min = floatval( $db_min_price );
		$max = floatval( $db_max_price );

		if ( wc_tax_enabled() && 'incl' === get_option( 'woocommerce_tax_display_shop' ) && ! wc_prices_include_tax() ) {
			$tax_classes = array_merge( array( '' ), WC_Tax::get_tax_classes() );
			$class_max   = $max;
			$class_min   = $min;

			foreach ( $tax_classes as $tax_class ) {
				if ( $tax_rates = WC_Tax::get_rates( $tax_class ) ) {
					$class_max = ceil( $max + WC_Tax::get_tax_total( WC_Tax::calc_exclusive_tax( $max, $tax_rates ) ) );
					$class_min = floor( $min + WC_Tax::get_tax_total( WC_Tax::calc_exclusive_tax( $min, $tax_rates ) ) );
				}
			}

			$min = $class_min;
			$max = $class_max;
		}

		return array( $min, $max );

		// echo '<br><hr>after tax calculation:<br>';
		// echo 'min price: ' . $min . '<br>';
		// echo 'max price: ' . $max . '<br>';
		// echo '<br>';
	}

	/**
	 * @noinspection SqlNoDataSourceInspection
	 * @noinspection SqlResolve
	 *
	 * @source https://wordpress.stackexchange.com/a/54795
	 *
	 * @return string
	 */
	public function get_db_min_price() {
		global $wpdb;

		$query = $wpdb->prepare(
			"SELECT MIN( CAST( meta_value as UNSIGNED ) ) FROM $wpdb->postmeta WHERE meta_key='%s'",
			'_price'
		);

		return $wpdb->get_var( $query );
	}

	/**
	 * @noinspection SqlNoDataSourceInspection
	 * @noinspection SqlResolve
	 *
	 * @source https://wordpress.stackexchange.com/a/54795
	 *
	 * @return string
	 */
	public function get_db_max_price() {
		global $wpdb;

		$query = $wpdb->prepare(
			"SELECT MAX( CAST( meta_value as UNSIGNED ) ) FROM $wpdb->postmeta WHERE meta_key='%s'",
			'_price'
		);

		return $wpdb->get_var( $query );
	}

}
