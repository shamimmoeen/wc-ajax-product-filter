const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const webpack = require('webpack');

module.exports = {
	...defaultConfig,
	entry: {
		...defaultConfig.entry,
		'list-forms': path.resolve(process.cwd(), 'src', 'list-forms.tsx'),
		form: path.resolve(process.cwd(), 'src', 'form.tsx'),
		settings: path.resolve(process.cwd(), 'src', 'settings.tsx'),
		'seo-rules': path.resolve(process.cwd(), 'src', 'seo-rules.js'),
	},
	plugins: [
		...defaultConfig.plugins,
		new webpack.DefinePlugin({
			WCAPF_PRO: false,
		}),
	],
};
