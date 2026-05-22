import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import sourcemaps from 'gulp-sourcemaps';
import touch from 'gulp-touch-cmd';
import autoPrefix from 'gulp-autoprefixer';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import minCss from 'gulp-clean-css';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import browserSync from 'browser-sync';

const { src, dest, watch, series } = gulp;
const sass = gulpSass( dartSass );
const bs = browserSync.create();

/**
 * @source https://stackoverflow.com/a/34028652
 */
function frontendCss() {
	const DEST = './public/css';

	return src( './public/src/scss/wc-ajax-product-filter-styles.scss' )
		.pipe( sourcemaps.init() )
		.pipe( sass.sync( { outputStyle: 'expanded' } ).on( 'error', sass.logError ) )
		.pipe( autoPrefix() )
		.pipe( sourcemaps.write() )
		.pipe( dest( DEST ) ) // Output non-minified css file
		.pipe( bs.stream() )

		.pipe( minCss() )
		.pipe( rename( { extname: '.min.css' } ) )
		.pipe( dest( DEST ) ) // Output minified css file

		.pipe( touch() );
}

function chosenCss() {
	const DEST = './public/lib/chosen';

	return src( './public/lib/chosen/chosen.scss' )
		.pipe( sourcemaps.init() )
		.pipe( sass.sync( { outputStyle: 'expanded' } ).on( 'error', sass.logError ) )
		.pipe( autoPrefix() )
		.pipe( sourcemaps.write() )
		.pipe( dest( DEST ) ) // Output non-minified css file
		.pipe( bs.stream() )

		.pipe( minCss() )
		.pipe( rename( { extname: '.min.css' } ) )
		.pipe( dest( DEST ) ) // Output minified css file

		.pipe( touch() );
}

/**
 * @source https://github.com/gulpjs/gulp/blob/master/docs/recipes/minified-and-non-minified.md
 */
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
		.pipe( concat( 'wc-ajax-product-filter-scripts.js' ) )
		.pipe( sourcemaps.write() )
		.pipe( dest( DEST ) ) // Output non-minified js file

		.pipe( uglify() )
		.pipe( rename( { extname: '.min.js' } ) )
		.pipe( dest( DEST ) ) // Output minified js file

		.pipe( touch() );
}

function browser() {
	bs.init(
		{
			open: false, // Stop the browser from automatically opening.
			proxy: 'http://wcfilter-2.test/',
			files: [
				'./**/*.php',
			],
		}
	);

	watch( './public/src/scss/**/*.scss', frontendCss );
	watch( './public/lib/chosen/chosen.scss', chosenCss );
	watch( './public/src/js/**/*.js', frontendJs ).on( 'change', bs.reload );
}

function watchBuild() {
	watch( './public/src/scss/**/*.scss', frontendCss );
	watch( './public/src/js/**/*.js', frontendJs );
}

const build = series(
	frontendCss,
	frontendJs,
);

export { frontendCss, frontendJs, watchBuild, build };
export default browser;
