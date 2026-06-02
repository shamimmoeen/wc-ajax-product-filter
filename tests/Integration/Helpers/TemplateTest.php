<?php
/**
 * Template helper tests.
 *
 * Pins the load/get contract and both theme-override paths: the canonical
 * <theme>/woocommerce/wcapf/<slug>.php and the pre-v3 <theme>/wcapf/<slug>.php
 * fallback that emits a deprecation notice. Without these, the loader rewrite
 * could silently regress theme overrides — the worst kind of breakage because
 * customer sites just look wrong.
 *
 * @package wc-ajax-product-filter
 */

class TemplateTest extends WP_UnitTestCase {

	/**
	 * Paths created during the test that tear_down() must delete.
	 *
	 * @var string[]
	 */
	private array $fixtures = array();

	public function tear_down() {
		foreach ( $this->fixtures as $path ) {
			if ( file_exists( $path ) ) {
				unlink( $path );
			}
		}

		// Remove the fixture directories if now empty.
		$theme_dir = get_stylesheet_directory();

		foreach ( array( '/woocommerce/wcapf', '/woocommerce', '/wcapf' ) as $sub ) {
			$dir = $theme_dir . $sub;
			if ( is_dir( $dir ) && ! ( new \FilesystemIterator( $dir ) )->valid() ) {
				rmdir( $dir );
			}
		}

		$this->fixtures = array();

		parent::tear_down();
	}

	public function test_load_echoes_the_plugin_template_when_no_theme_override() {
		ob_start();
		wcapf()->template->load( 'menu-item-count', array( 'count' => 7, 'screen_reader_text' => 'count' ) );
		$output = ob_get_clean();

		// menu-item-count.php renders the count value.
		$this->assertStringContainsString( '7', $output );
	}

	public function test_get_returns_the_template_html_as_a_string() {
		$output = wcapf()->template->get( 'menu-item-count', array( 'count' => 11, 'screen_reader_text' => 'count' ) );

		$this->assertIsString( $output );
		$this->assertStringContainsString( '11', $output );
	}

	public function test_theme_override_under_woocommerce_wcapf_wins_over_plugin_default() {
		$this->write_fixture( '/woocommerce/wcapf/menu-item-count.php', '<span class="theme-override-new"></span>' );

		$output = wcapf()->template->get( 'menu-item-count', array( 'count' => 1, 'screen_reader_text' => 'count' ) );

		$this->assertStringContainsString( 'theme-override-new', $output );
	}

	public function test_legacy_theme_override_under_wcapf_is_used_as_fallback() {
		// No new-path override; only the deprecated path exists.
		$this->write_fixture( '/wcapf/menu-item-count.php', '<span class="theme-override-legacy"></span>' );
		$this->setExpectedIncorrectUsage( 'WCAPF template override' );

		$output = wcapf()->template->get( 'menu-item-count', array( 'count' => 1, 'screen_reader_text' => 'count' ) );

		$this->assertStringContainsString( 'theme-override-legacy', $output );
	}

	public function test_new_theme_override_wins_over_legacy_when_both_exist() {
		$this->write_fixture( '/woocommerce/wcapf/menu-item-count.php', '<span class="theme-override-new"></span>' );
		$this->write_fixture( '/wcapf/menu-item-count.php', '<span class="theme-override-legacy"></span>' );

		$output = wcapf()->template->get( 'menu-item-count', array( 'count' => 1, 'screen_reader_text' => 'count' ) );

		$this->assertStringContainsString( 'theme-override-new', $output );
		$this->assertStringNotContainsString( 'theme-override-legacy', $output );
	}

	/**
	 * Writes a template file into the active theme. Records the path so tear_down()
	 * can clean it up.
	 *
	 * @param string $relative_path Path under the theme directory, e.g. '/wcapf/foo.php'.
	 * @param string $contents      File contents.
	 */
	private function write_fixture( string $relative_path, string $contents ): void {
		$path = get_stylesheet_directory() . $relative_path;
		$dir  = dirname( $path );

		if ( ! is_dir( $dir ) ) {
			mkdir( $dir, 0755, true );
		}

		file_put_contents( $path, "<?php ?>" . $contents );

		$this->fixtures[] = $path;
	}
}
