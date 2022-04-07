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

		$field_instance = new WCAPF_Field_Instance( $instance );

		echo '<pre>';
		print_r( $field_instance );
		echo '</pre>';

		$display_type = $this->get_sub_field_value( 'number_display_type' );
		$position     = $this->get_sub_field_value( 'position' );

		// todo: this codes are backed up on scratches/price.php file.
		echo 'render price filter';
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
