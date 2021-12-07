<?php

class WCAPF_Meta {

	public function __construct() {
		add_shortcode( 'wc_ajax_product_filter_by_meta', array( $this, 'register_widget_shortcode' ) );
	}

	public function register_widget_shortcode() {
		$meta_keys = $this->get_meta_keys();

		ob_start();
		?>
		<style>
			.widget-content p label {
				margin: 0 0 5px;
				display: inline-block;
			}

			.widget-content p *:not(label) {
				width: 100%;
			}

			.widget-content select,
			.widget-content input[type="text"] {
				height: 30px;
				line-height: 30px;
			}
		</style>
		<span class="widget-title">Filter by Meta</span>
		<div class="widget-content">
			<p>
				<label for="widget-wcapf-custom-taxonomy-filter-1-meta-key">
					Meta Key:
				</label>
				<select
					class="widefat"
					name="widget-wcapf-custom-taxonomy-filter-1-meta-key"
					id="widget-wcapf-custom-taxonomy-filter-1-meta-key"
				>
					<?php foreach ( $meta_keys as $meta_key ) : ?>
						<option value="<?php echo esc_attr( $meta_key ); ?>">
							<?php echo esc_html( $meta_key ); ?>
						</option>
					<?php endforeach; ?>
				</select>
				<?php

				?>
			</p>

			<p>
				<label for="widget-wcapf-custom-taxonomy-filter-1-value-type">
					Value Type:
				</label>
				<select
					class="widefat"
					name="widget-wcapf-custom-taxonomy-filter-1-value-type"
					id="widget-wcapf-custom-taxonomy-filter-1-value-type"
				>
					<option value="text">Text</option>
					<option value="number">Number</option>
					<option value="date">Date</option>
				</select>
			</p>

			<p>
				<label for="widget-wcapf-custom-taxonomy-filter-1-display-type">
					Display Type:
				</label>
				<select
					class="widefat"
					name="widget-wcapf-custom-taxonomy-filter-1-display-type"
					id="widget-wcapf-custom-taxonomy-filter-1-display-type"
				>
					<option value="checkbox">Checkbox</option>
					<option value="radio">Radio</option>
					<option value="select">Select</option>
					<option value="cloud">Cloud</option>
					<option value="Slider">Slider</option>
					<option value="range">Range</option>
				</select>
			</p>

			<p>
				<label for="widget-wcapf-custom-taxonomy-filter-1-use-select2">
					Use Select2:
				</label>
				<select
					class="widefat"
					name="widget-wcapf-custom-taxonomy-filter-1-use-select2"
					id="widget-wcapf-custom-taxonomy-filter-1-use-select2"
				>
					<option value="no">No</option>
					<option value="yes">Yes</option>
				</select>
			</p>

			<p>
				<label for="widget-wcapf-custom-taxonomy-filter-1-enable-multiple-filter">
					Enable Multiple Filter:
				</label>
				<select
					class="widefat"
					name="widget-wcapf-custom-taxonomy-filter-1-enable-multiple-filter"
					id="widget-wcapf-custom-taxonomy-filter-1-enable-multiple-filter"
				>
					<option value="no">No</option>
					<option value="yes">Yes</option>
				</select>
			</p>

			<p>
				<label for="widget-wcapf-custom-taxonomy-filter-1-query-type">
					Query Type:
				</label>
				<select
					class="widefat"
					name="widget-wcapf-custom-taxonomy-filter-1-query-type"
					id="widget-wcapf-custom-taxonomy-filter-1-query-type"
				>
					<option value="or">Or</option>
					<option value="and">And</option>
				</select>
			</p>

			<p>
				<label for="widget-wcapf-custom-taxonomy-filter-1-get-options">
					Get Options:
				</label>
				<select
					class="widefat"
					name="widget-wcapf-custom-taxonomy-filter-1-get-options"
					id="widget-wcapf-custom-taxonomy-filter-1-get-options"
				>
					<option value="automatically">Automatically</option>
					<option value="manual_entry">Manual Entry</option>
				</select>
			</p>
		</div>

		<script>
			const wrapper = jQuery( '.widget-content' );

			wrapper.on( 'change', '#widget-wcapf-custom-taxonomy-filter-1-value-type', function() {
				console.log( jQuery( this ).val() );
			} );
		</script>
		<?php
		return ob_get_clean();
	}

	/**
	 * @source https://stackoverflow.com/a/54017483
	 *
	 * @return array
	 */
	private function get_meta_keys() {
		global $wpdb;

		$query = "
        SELECT DISTINCT($wpdb->postmeta.meta_key)
        FROM $wpdb->posts
        LEFT JOIN $wpdb->postmeta
        ON $wpdb->posts.ID = $wpdb->postmeta.post_id
        WHERE $wpdb->posts.post_type = '%s'
		ORDER BY $wpdb->postmeta.meta_key
    	";

		$post_type = 'product';

		return $wpdb->get_col( $wpdb->prepare( $query, $post_type ) );
	}

}

new WCAPF_Meta();
