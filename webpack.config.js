const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
	...defaultConfig,
	entry: {
		...defaultConfig.entry,
		'list-filters': path.resolve(process.cwd(), 'src', 'list-filters.js'),
		'list-filter-forms': path.resolve(
			process.cwd(),
			'src',
			'list-filter-forms.js'
		),
		'filter-form': path.resolve(process.cwd(), 'src', 'filter-form.js'),
		filter: path.resolve(process.cwd(), 'src', 'filter.js'),
	},
};
