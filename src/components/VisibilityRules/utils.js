import { __ } from '@wordpress/i18n';
import { isEmpty } from 'lodash';

const { taxonomy_hierarchical_data, visibility_rules_data } =
	wcapf_admin_params;

const {
	rules: { page, taxonomies, filters },
} = visibility_rules_data;

export const operators = [
	{
		label: __('equal', 'wc-ajax-product-filter'),
		value: 'equal',
	},
	{
		label: __('not equal', 'wc-ajax-product-filter'),
		value: 'not-equal',
	},
];

export const placeholderRule = {
	rule: page,
	operator: operators[0],
};

export function getRules() {
	const rules = [page];

	if (!isEmpty(taxonomies)) {
		rules.push({
			label: __('Archive', 'wc-ajax-product-filter'),
			group: 'archive',
			options: taxonomies,
		});
	}

	if (!isEmpty(filters)) {
		rules.push({
			label: __('Filter', 'wc-ajax-product-filter'),
			group: 'filter',
			options: filters,
		});
	}

	return rules;
}

export function isTaxonomyHierarchical(tax) {
	return taxonomy_hierarchical_data[tax];
}
