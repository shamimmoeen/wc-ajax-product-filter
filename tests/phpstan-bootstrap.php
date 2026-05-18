<?php
/**
 * PHPStan bootstrap — defines plugin constants so static analysis doesn't flag them as undefined.
 * Loaded only during analysis; never at runtime.
 */

define( 'WCAPF_PLUGIN_FILE', __DIR__ . '/../wc-ajax-product-filter.php' );
define( 'WCAPF_PLUGIN_DIR', __DIR__ . '/..' );
define( 'WCAPF_PLUGIN_URL', '' );
define( 'WCAPF_VERSION', '4.4.0' );
define( 'WCAPF_CACHE_TIME', 60 * 60 * 12 );
