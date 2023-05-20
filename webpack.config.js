const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
	...defaultConfig,
	entry: {
		...defaultConfig.entry,
		'list-forms': path.resolve(process.cwd(), 'src', 'list-forms.js'),
		form: path.resolve(process.cwd(), 'src', 'form.js'),
		settings: path.resolve(process.cwd(), 'src', 'settings.js'),
		'seo-rules': path.resolve(process.cwd(), 'src', 'seo-rules.js'),
	},
};
