const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
	...defaultConfig,
	entry: {
		...defaultConfig.entry,
		'filter-form': path.resolve(process.cwd(), 'src', 'filter-form.js'),
		filter: path.resolve(process.cwd(), 'src', 'filter.js'),
	},
};
