const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
	...defaultConfig,
	entry: {
		...defaultConfig.entry,
		'list-filters': path.resolve(process.cwd(), 'src', 'list-filters.js'),
		'list-forms': path.resolve(process.cwd(), 'src', 'list-forms.js'),
		filter: path.resolve(process.cwd(), 'src', 'filter.js'),
		form: path.resolve(process.cwd(), 'src', 'form.js'),
		settings: path.resolve(process.cwd(), 'src', 'settings.js'),
	},
};
