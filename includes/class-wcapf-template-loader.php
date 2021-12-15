<?php
/**
 * The template loader class.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/includes
 * @author     Mainul Hassan Main
 */

/**
 * Template loader class.
 */
class WCAPF_Template_Loader {

	/**
	 * The constructor.
	 */
	public function __construct() {
	}

	/**
	 * Gets the instance of this class.
	 */
	public static function get_instance() {
		// Store the instance locally to avoid private static replication.
		static $instance = null;

		if ( null === $instance ) {
			$instance = new WCAPF_Template_Loader();
		}

		return $instance;
	}

	/**
	 * Loads the template.
	 *
	 * @param string $slug   The template path.
	 * @param array  $params The parameters.
	 * @param bool   $render Determines if we render or just return the output.
	 *
	 * @return bool|string
	 */
	public function load( $slug, $params = array(), $render = true ) {
		/**
		 * Fires at the start of loading the template
		 *
		 * This is a variable hook that is dependent on the slug passed in.
		 *
		 * @param string $slug Template part slug requested.
		 */
		do_action( 'wcapf_get_template_part_' . $slug, $slug );

		$template = $slug . '.php';

		/**
		 * Filters the template part to be loaded.
		 *
		 * @param array  $templates Array of templates located.
		 * @param string $slug      Template part slug requested.
		 */
		$template = apply_filters( 'wcapf_get_template_part', $template, $slug );

		// No file found yet.
		$located           = false;
		$template_location = WCAPF_PLUGIN_DIR . '/templates';

		$template_location = apply_filters( 'wcapf_get_template_location', $template_location, $template );

		if ( file_exists( trailingslashit( $template_location ) . $template ) ) {
			$located = trailingslashit( $template_location ) . $template;
		}

		$html = false;

		// Loads the template.
		if ( file_exists( $located ) ) {
			extract( $params, EXTR_SKIP ); // phpcs:disable WordPress.PHP.DontExtract.extract_extract

			if ( $render ) {
				require $located;
			} else {
				ob_start();
				require $located;
				$html = ob_get_clean();
			}
		}

		return $html;
	}

}
