const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const webpack = require('webpack');

module.exports = {
	...defaultConfig,
	plugins: [
		...defaultConfig.plugins,
		new webpack.DefinePlugin({
			WCAPF_PRO: false,
		}),
	],
};
