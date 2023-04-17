import { __ } from '@wordpress/i18n';
import { isEmpty } from 'lodash';

const { taxonomy_hierarchical_data, visibility_rules_data } =
	wcapf_admin_params;

const { operators, page, taxonomies, filters } = visibility_rules_data;

export function getOperators() {
	return operators;
}

export const placeholderRule = {
	group: 'page',
	rule: 'page',
	operator: 'equal',
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

export function getRule(group, rule) {
	if ('archive' === group) {
		return taxonomies.find((option) => option.value === rule);
	} else if ('filter' === group) {
		return filters.find((option) => option.value === rule);
	} else {
		return getRules().find((option) => option.value === rule);
	}
}

export function isTaxonomyHierarchical(tax) {
	return taxonomy_hierarchical_data[tax];
}
