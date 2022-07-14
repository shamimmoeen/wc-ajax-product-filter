const { src, dest, watch, series } = require( 'gulp' );
const sass = require( 'gulp-sass' );
const sourcemaps = require( 'gulp-sourcemaps' );
const touch = require( 'gulp-touch-cmd' );
const autoPrefix = require( 'gulp-autoprefixer' );
const babel = require( 'gulp-babel' );
const concat = require( 'gulp-concat' );
const minCss = require( 'gulp-minify-css' );
const rename = require( 'gulp-rename' );
const uglify = require( 'gulp-uglify' );
const browserSync = require( 'browser-sync' ).create();

/**
 * @source https://stackoverflow.com/a/34028652
 */
function backendCss() {
	const DEST = './admin/css';

	return src( './admin/src/scss/wc-ajax-product-filter-admin-styles.scss' )
		.pipe( sourcemaps.init() )
		.pipe( sass.sync( { outputStyle: 'expanded' } ).on( 'error', sass.logError ) )
		.pipe( autoPrefix() )
		.pipe( sourcemaps.write() )
		.pipe( dest( DEST ) ) // Output non-minified css file
		.pipe( browserSync.stream() )

		.pipe( minCss() )
		.pipe( rename( { extname: '.min.css' } ) )
		.pipe( dest( DEST ) ) // Output minified css file

		.pipe( touch() );
}

function frontendCss() {
	const DEST = './public/css';

	return src( './public/src/scss/wc-ajax-product-filter-public-styles.scss' )
		.pipe( sourcemaps.init() )
		.pipe( sass.sync( { outputStyle: 'expanded' } ).on( 'error', sass.logError ) )
		.pipe( autoPrefix() )
		.pipe( sourcemaps.write() )
		.pipe( dest( DEST ) ) // Output non-minified css file
		.pipe( browserSync.stream() )

		.pipe( minCss() )
		.pipe( rename( { extname: '.min.css' } ) )
		.pipe( dest( DEST ) ) // Output minified css file

		.pipe( touch() );
}

/**
 * @source https://github.com/gulpjs/gulp/blob/master/docs/recipes/minified-and-non-minified.md
 */
function backendJs() {
	const DEST = './admin/js';

	return src( './admin/src/js/**/*.js' )
		.pipe( sourcemaps.init() )
		.pipe(
			babel(
				{
					presets: [ '@babel/env' ],
				}
			)
		)
		.pipe( concat( 'wc-ajax-product-filter-admin-scripts.js' ) )
		.pipe( sourcemaps.write() )
		.pipe( dest( DEST ) ) // Output non-minified js file

		.pipe( uglify() )
		.pipe( rename( { extname: '.min.js' } ) )
		.pipe( dest( DEST ) ) // Output minified js file

		.pipe( touch() );
}

function frontendJs() {
	const DEST = './public/js';

	return src( './public/src/js/**/*.js' )
		.pipe( sourcemaps.init() )
		.pipe(
			babel(
				{
					presets: [ '@babel/env' ],
				}
			)
		)
		.pipe( concat( 'wc-ajax-product-filter-public-scripts.js' ) )
		.pipe( sourcemaps.write() )
		.pipe( dest( DEST ) ) // Output non-minified js file

		.pipe( uglify() )
		.pipe( rename( { extname: '.min.js' } ) )
		.pipe( dest( DEST ) ) // Output minified js file

		.pipe( touch() );
}

function browser() {
	browserSync.init(
		{
			open: false, // Stop the browser from automatically opening
			proxy: 'http://wcfilter.test/',
			files: [
				'./**/*.php',
			],
		}
	);

	watch( './admin/src/scss/**/*.scss', backendCss );
	watch( './public/src/scss/**/*.scss', frontendCss );
	watch( './admin/src/js/**/*.js', backendJs ).on( 'change', browserSync.reload );
	watch( './public/src/js/**/*.js', frontendJs ).on( 'change', browserSync.reload );
}

function watchBuild() {
	watch( './admin/src/scss/**/*.scss', backendCss );
	watch( './public/src/scss/**/*.scss', frontendCss );
	watch( './admin/src/js/**/*.js', backendJs );
	watch( './public/src/js/**/*.js', frontendJs );
}

const build = series(
	backendCss,
	frontendCss,
	backendJs,
	frontendJs,
);

module.exports.backendCss = backendCss;
module.exports.frontendCss = frontendCss;
module.exports.backendJs = backendJs;
module.exports.frontendJs = frontendJs;
module.exports.watchBuild = watchBuild;
module.exports.build = build;
module.exports.default = browser;
