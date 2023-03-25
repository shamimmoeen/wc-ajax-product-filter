<?php
/**
 * WCAPF_Filter_Type class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes/filter-types
 * @author     wptools.io
 */

/**
 * WCAPF_Filter_Type class.
 *
 * @since 3.0.0
 */
abstract class WCAPF_Filter_Type {

	/**
	 * Filter key
	 *
	 * @var string
	 */
	protected $filter_key;

	/**
	 * Query type
	 *
	 * @var string
	 */
	protected $query_type;

	/**
	 * Hide empty
	 *
	 * @var string
	 */
	protected $hide_empty;

	/**
	 * The field instance.
	 *
	 * @var WCAPF_Field_Instance
	 */
	protected $field;

	/**
	 * The constructor.
	 *
	 * @param WCAPF_Field_Instance $field The field instance.
	 */
	public function __construct( $field ) {
		$this->field = $field;

		$this->set_default_properties();
		$this->set_properties();
	}

	/**
	 * Sets the default properties.
	 *
	 * @return void
	 */
	private function set_default_properties() {
		$field = $this->field;

		$this->filter_key = $field->filter_key;
		$this->query_type = $field->query_type;
		$this->hide_empty = $field->hide_empty;
	}

	/**
	 * Sets the properties.
	 *
	 * @return void
	 */
	abstract protected function set_properties();

	/**
	 * Gets the items.
	 *
	 * @return array
	 */
	public function get_items() {
		return $this->prepare_items();
	}

	/**
	 * Prepare the items.
	 *
	 * @return array
	 */
	abstract protected function prepare_items();

	/**
	 * @param $ranges
	 * @param $filtered_count
	 *
	 * TODO: Maybe refactor.
	 *
	 * @return array
	 */
	public function get_filtered_ranges_counts( $ranges, $filtered_count ) {
		if ( ! $ranges ) {
			return array();
		}

		$updated_count = array();

		foreach ( $ranges as $range ) {
			$id    = $range['id'];
			$count = isset( $filtered_count[ $id ] ) ? $filtered_count[ $id ] : 0;

			$range['count']  = $count;
			$updated_count[] = $range;
		}

		return $updated_count;
	}

	/**
	 * Exclude the empty items.
	 *
	 * @param array $items The items.
	 *
	 * @return array
	 */
	protected function filter_by_hide_empty( $items ) {
		if ( 'remove' === $this->hide_empty ) {
			$items_with_count = array();

			foreach ( $items as $item ) {
				$id = $item['id'];

				if ( $item['count'] ) {
					$items_with_count[ $id ] = $item;
				}
			}

			$items = $items_with_count;
		}

		return $items;
	}

	/**
	 * @return bool
	 */
	protected function auto_count_enabled() {
		return apply_filters(
			'wcapf_filter_update_count',
			$this->field->get_sub_field_value( 'update_count' ),
			$this->field
		);
	}

	/**
	 * Prepare the manual options.
	 *
	 * @param array $manual_options The manual options from the filter field.
	 *
	 * @return array
	 */
	protected function prepare_manual_options( $manual_options ) {
		$options  = array();
		$defaults = array();

		$type = $this->field->type;

		if ( 'product-status' === $type ) {
			$defaults = wp_list_pluck( WCAPF_API_Utils::product_status_options(), 'label', 'value' );
		} elseif ( 'sort-by' === $type ) {
			$defaults = wp_list_pluck( WCAPF_API_Utils::sort_by_options(), 'label', 'value' );
		}

		foreach ( $manual_options as $option ) {
			$value   = $option['value'];
			$label   = $option['label'];
			$tooltip = isset( $option['tooltip'] ) ? $option['tooltip'] : '';
			$count   = 0;

			if ( empty( $label ) ) {
				if ( 'per-page' === $type ) {
					$label = $value;
				} else {
					if ( ! empty( $defaults[ $value ] ) ) {
						$label = $defaults[ $value ];
					}
				}
			}

			$item = array_merge(
				$option,
				array(
					'id'      => $value,
					'name'    => $label,
					'tooltip' => $tooltip,
					'count'   => $count,
				)
			);

			if ( 'sort-by' === $type ) {
				// In sort-by filter, id is the unique value because id is generated from value and order direction.
				$sort_by_id = $option['id'];
				$item['id'] = $sort_by_id;

				$options[ $sort_by_id ] = $item;
			} else {
				$options[ $value ] = $item;
			}
		}

		return $options;
	}

}
