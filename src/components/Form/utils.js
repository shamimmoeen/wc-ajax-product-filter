import { sprintf, __ } from '@wordpress/i18n';
import { isEmpty, merge, find } from 'lodash';
import { foundProVersion } from '../utils';

export function newFilterData(index, formFilters) {
	let title;

	if (index > 1) {
		title = sprintf(__('New Filter (%d)', 'wc-ajax-product-filter'), index);
	} else {
		title = __('New Filter', 'wc-ajax-product-filter');
	}

	let data = {};

	const types = wcapf_admin_params.filter_types;

	const _taxonomyTypes = find(types, { value: 'taxonomy' });
	const taxonomyTypes = _taxonomyTypes.options;

	for (let index = 0; index < taxonomyTypes.length; index++) {
		const taxonomyType = taxonomyTypes[index];
		const { type, value: taxonomy, taxHierarchical } = taxonomyType;

		const found = find(formFilters, { type, taxonomy });

		if (!found) {
			data = {
				type,
				taxonomy,
				taxHierarchical: taxHierarchical ? '1' : '',
			};

			break;
		}
	}

	if (isEmpty(data)) {
		for (let index = 0; index < types.length; index++) {
			const otherType = types[index];

			if ('taxonomy' !== otherType.value) {
				const { value: type } = otherType;

				const found = find(formFilters, { type });

				if (!found) {
					data = { type: otherType.value };

					break;
				}
			}
		}
	}

	if (isEmpty(data)) {
		data = { type: 'post-meta' };
	}

	return merge(filterDefaultData(), data, {
		isNew: true,
		uniqueIndex: index,
		title,
	});
}

export function getFilterTypes(otherFilters) {
	const _filterTypes = wcapf_admin_params.filter_types;

	const _taxonomyTypes = find(_filterTypes, { value: 'taxonomy' });
	const taxonomyOptions = _taxonomyTypes.options;

	const taxonomyTypes = taxonomyOptions.map((taxonomyType) => {
		const { value } = taxonomyType;

		if (find(otherFilters, { taxonomy: value })) {
			return { ...taxonomyType, isDisabled: true };
		}

		return taxonomyType;
	});

	const filterTypes = _filterTypes.map((filterType) => {
		const { value } = filterType;

		if ('taxonomy' === value) {
			return { ...filterType, options: taxonomyTypes };
		} else if ('post-meta' === value) {
			return filterType;
		} else {
			if (find(otherFilters, { type: value })) {
				return { ...filterType, isDisabled: true };
			}

			return filterType;
		}
	});

	return filterTypes;
}

export function getMetaKeys(otherFilters) {
	const _metaKeys = wcapf_admin_params.meta_keys;

	const metaKeys = _metaKeys.map((metaKey) => {
		if (find(otherFilters, { meta_key: metaKey.value })) {
			return { ...metaKey, isDisabled: true };
		}

		return metaKey;
	});

	return metaKeys;
}

export function filterDefaultData() {
	return {
		id: '',
		title: '',
		type: '',
		taxonomy: '',
		taxHierarchical: '',
		meta_key: '',
		isACF: '',
		value_type: 'text',
		field_key: '',
		// Taxonomy
		display_type: 'checkbox',
		query_type: 'and',
		all_items_label: '',
		use_chosen: '',
		chosen_no_results_message: '',
		enable_multiple_filter: '',
		hierarchical: '',
		enable_hierarchy_accordion: '',
		show_count: '',
		enable_tooltip: '',
		show_count_in_tooltip: '',
		tooltip_position: 'top',
		get_options: 'automatically',
		order_terms_by: 'default',
		order_terms_dir: 'asc',
		limit_options: 'off',
		parent_term: '',
		only_parent: '',
		limit_values_by_id: '',
		limit_values_include_children: '',
		exclude_values_id: '',
		exclude_values_include_children: '',
		// Price Filter
		number_display_type: 'range_slider',
		number_range_slider_display_values_as: 'plain_text',
		align_values_at_the_end: '1',
		number_range_enable_multiple_filter: '',
		number_range_query_type: 'and',
		number_range_select_all_items_label: '',
		number_range_use_chosen: '',
		number_range_chosen_no_results_message: '',
		number_range_show_count: '',
		number_range_hide_empty: '',
		number_get_options: 'automatically',
		manual_options: [],
		number_manual_options: [],
		time_period_options: [],
		min_value: '0',
		min_value_auto_detect: '',
		max_value: '100',
		max_value_auto_detect: '',
		step: '10',
		value_prefix: '',
		value_postfix: '',
		values_separator: '-',
		decimal_places: '0',
		thousand_separator: '',
		decimal_separator: '.',
		// Product Status
		product_status_options: [],
		// Post Meta
		value_decimal: '',
		value_decimal_places: '2',
		options_order_by: 'none',
		options_order_dir: 'asc',
		options_order_type: 'alphabetical',
		// Post Meta - value type Date
		date_display_type: 'input_date',
		date_format: 'dd-mm-yy',
		time_period_enable_multiple_filter: '',
		time_period_query_type: 'and',
		time_period_select_all_items_label: '',
		time_period_use_chosen: '',
		time_period_chosen_no_results_message: '',
		show_date_inputs_inline: '',
		time_period_show_count: '',
		time_period_hide_empty: '',
		date_picker_month_dropdown: '',
		date_picker_year_dropdown: '',
		date_from_prefix: '',
		date_from_postfix: '',
		date_from_placeholder: '',
		date_to_prefix: '',
		date_to_postfix: '',
		date_to_placeholder: '',
		// Post Author
		post_author_order_by: 'default',
		post_author_order_dir: 'asc',
		include_user_roles: [],
		// Advanced Settings
		hide_title: '',
		enable_accordion: '',
		accordion_default_state: 'expanded',
		help_text: '',
		options_with_no_products: 'remove',
		enable_search_field: '',
		enable_reduce_height: 'no',
		soft_limit: '5',
		max_height: '200',
		// Error
		type_error: '',
		meta_key_error: '',
		field_key_error: '',
	};
}

// These data gets reset after filter type is changed.
export function filterTypeDependentFields() {
	return [
		'taxonomy',
		'taxHierarchical',
		'meta_key',
		'isACF',
		// Taxonomy
		'get_options',
		'order_terms_by',
		'order_terms_dir',
		'limit_options',
		'parent_term',
		'only_parent',
		'limit_values_by_id',
		'limit_values_include_children',
		'exclude_values_id',
		'exclude_values_include_children',
		// Manual Options
		'number_get_options',
		'manual_options',
		'number_manual_options',
		'time_period_options',
		// Post Meta
		'value_type',
		'value_decimal',
		'value_decimal_places',
		'options_order_by',
		'options_order_dir',
		'options_order_type',
	];
}

export function methodsOfGettingOptions() {
	return [
		{
			label: __('Automatically', 'wc-ajax-product-filter'),
			value: 'automatically',
		},
		{
			label: __('Manual Entry', 'wc-ajax-product-filter'),
			value: 'manual_entry',
			isPro: true,
		},
	];
}

export function taxonomyLimitByOptions() {
	return [
		{
			label: __('Off', 'wc-ajax-product-filter'),
			value: 'off',
		},
		{
			label: __('Include', 'wc-ajax-product-filter'),
			value: 'include',
		},
		{
			label: __('Exclude', 'wc-ajax-product-filter'),
			value: 'exclude',
		},
		{
			label: __('Child of', 'wc-ajax-product-filter'),
			value: 'child',
		},
		{
			label: __('Parent Only', 'wc-ajax-product-filter'),
			value: 'parent_only',
		},
	];
}

export function termsOrderByOptions() {
	return [
		{
			label: __('Default', 'wc-ajax-product-filter'),
			value: 'default',
		},
		{
			label: __('Term Order', 'wc-ajax-product-filter'),
			value: 'term_order',
		},
		{
			label: __('ID', 'wc-ajax-product-filter'),
			value: 'id',
		},
		{
			label: __('Name', 'wc-ajax-product-filter'),
			value: 'name',
		},
		{
			label: __('Slug', 'wc-ajax-product-filter'),
			value: 'slug',
		},
		{
			label: __('Count', 'wc-ajax-product-filter'),
			value: 'count',
		},
		{
			label: __('Entry', 'wc-ajax-product-filter'),
			value: 'entry',
		},
	];
}

export function metaValuesOrderByOptions() {
	return [
		{
			label: __('Default', 'wc-ajax-product-filter'),
			value: 'none',
		},
		{
			label: __('Value', 'wc-ajax-product-filter'),
			value: 'value',
		},
		{
			label: __('Count', 'wc-ajax-product-filter'),
			value: 'count',
		},
		{
			label: __('Label', 'wc-ajax-product-filter'),
			value: 'label',
		},
		{
			label: __('Entry', 'wc-ajax-product-filter'),
			value: 'entry',
		},
	];
}

export function manualEntryOrderTypes() {
	return ['label', 'entry'];
}

export function orderDirectionOptions() {
	return [
		{
			label: __('ASC', 'wc-ajax-product-filter'),
			value: 'asc',
		},
		{
			label: __('DESC', 'wc-ajax-product-filter'),
			value: 'desc',
		},
	];
}

export function orderTypeOptions() {
	return [
		{
			label: __('Alphabetical', 'wc-ajax-product-filter'),
			value: 'alphabetical',
		},
		{
			label: __('Numerical', 'wc-ajax-product-filter'),
			value: 'numerical',
		},
	];
}

export function authorOrderByOptions() {
	return [
		{
			label: __('Default', 'wc-ajax-product-filter'),
			value: 'default',
		},
		{
			label: __('ID', 'wc-ajax-product-filter'),
			value: 'id',
		},
		{
			label: __('Name', 'wc-ajax-product-filter'),
			value: 'name',
		},
		{
			label: __('Count', 'wc-ajax-product-filter'),
			value: 'count',
		},
		{
			label: __('Entry', 'wc-ajax-product-filter'),
			value: 'entry',
		},
	];
}

export function authorLimitByOptions() {
	return [
		{
			label: __('Off', 'wc-ajax-product-filter'),
			value: 'off',
		},
		{
			label: __('Include', 'wc-ajax-product-filter'),
			value: 'include',
		},
		{
			label: __('Exclude', 'wc-ajax-product-filter'),
			value: 'exclude',
		},
		{
			label: __('Role', 'wc-ajax-product-filter'),
			value: 'user_roles',
		},
	];
}

export function productStatusOptions() {
	return [
		{
			label: __('Featured', 'wc-ajax-product-filter'),
			value: 'featured',
		},
		{
			label: __('On Sale', 'wc-ajax-product-filter'),
			value: 'on_sale',
		},
	];
}

export function textDisplayTypes(withPro = false) {
	const options = [
		{
			label: __('Checkbox', 'wc-ajax-product-filter'),
			value: 'checkbox',
		},
		{
			label: __('Radio', 'wc-ajax-product-filter'),
			value: 'radio',
		},
		{
			label: __('Select', 'wc-ajax-product-filter'),
			value: 'select',
		},
		{
			label: __('Multi select', 'wc-ajax-product-filter'),
			value: 'multi-select',
		},
		{
			label: __('Label', 'wc-ajax-product-filter'),
			value: 'label',
		},
		{
			label: __('Color', 'wc-ajax-product-filter'),
			value: 'color',
		},
		{
			label: __('Image', 'wc-ajax-product-filter'),
			value: 'image',
		},
	];

	if (withPro && !foundProVersion()) {
		const proDisplayTypes = ['color', 'image'];

		return options.map((option) => {
			if (!proDisplayTypes.includes(option.value)) {
				return option;
			} else {
				option.isPro = true;

				return option;
			}
		});
	}

	return options;
}

export function numberDisplayTypes(withPro = false) {
	const options = [
		{
			label: __('Range - Slider', 'wc-ajax-product-filter'),
			value: 'range_slider',
		},
		{
			label: __('Range - Number', 'wc-ajax-product-filter'),
			value: 'range_number',
		},
		{
			label: __('Range - Checkbox', 'wc-ajax-product-filter'),
			value: 'range_checkbox',
		},
		{
			label: __('Range - Radio', 'wc-ajax-product-filter'),
			value: 'range_radio',
		},
		{
			label: __('Range - Select', 'wc-ajax-product-filter'),
			value: 'range_select',
		},
		{
			label: __('Range - Multiselect', 'wc-ajax-product-filter'),
			value: 'range_multiselect',
		},
		{
			label: __('Range - Label', 'wc-ajax-product-filter'),
			value: 'range_label',
		},
	];

	if (withPro && !foundProVersion()) {
		const allowed = ['range_slider', 'range_number'];

		return options.map((option) => {
			if (allowed.includes(option.value)) {
				return option;
			} else {
				option.isPro = true;

				return option;
			}
		});
	}

	return options;
}

export function dateDisplayTypes(withPro = false) {
	const options = [
		{
			label: __('Input - Date', 'wc-ajax-product-filter'),
			value: 'input_date',
		},
		{
			label: __('Input - Date Range', 'wc-ajax-product-filter'),
			value: 'input_date_range',
		},
		{
			label: __('Time Period - Checkbox', 'wc-ajax-product-filter'),
			value: 'time_period_checkbox',
		},
		{
			label: __('Time Period - Radio', 'wc-ajax-product-filter'),
			value: 'time_period_radio',
		},
		{
			label: __('Time Period - Select', 'wc-ajax-product-filter'),
			value: 'time_period_select',
		},
		{
			label: __('Time Period - Multi select', 'wc-ajax-product-filter'),
			value: 'time_period_multiselect',
		},
		{
			label: __('Time Period - Label', 'wc-ajax-product-filter'),
			value: 'time_period_label',
		},
	];

	if (withPro && !foundProVersion()) {
		const allowed = ['input_date', 'input_date_range'];

		return options.map((option) => {
			if (allowed.includes(option.value)) {
				return option;
			} else {
				option.isPro = true;

				return option;
			}
		});
	}

	return options;
}

export function accordionStates() {
	return [
		{
			label: __('Expanded', 'wc-ajax-product-filter'),
			value: 'expanded',
		},
		{
			label: __('Collapsed', 'wc-ajax-product-filter'),
			value: 'collapsed',
		},
	];
}

export function getTableData(filterType, filterData) {
	let type;
	let optionsKey;

	if ('price' === filterType || 'rating' === filterType) {
		type = 'number-options';
		optionsKey = 'number_manual_options';
	} else if ('product-status' === filterType) {
		type = 'product-status-options';
		optionsKey = 'product_status_options';
	} else if ('post-meta' === filterType) {
		const { value_type } = filterData;

		if ('text' === value_type) {
			type = 'text-options';
			optionsKey = 'manual_options';
		} else if ('number' === value_type) {
			type = 'number-options';
			optionsKey = 'number_manual_options';
		} else if ('date' === value_type) {
			type = 'time-period-options';
			optionsKey = 'time_period_options';
		}
	} else if ('post-author' === filterType) {
		type = 'post-author-options';
		optionsKey = 'manual_options';
	} else if ('taxonomy' === filterType) {
		type = 'taxonomy-options';
		optionsKey = 'manual_options';
	}

	return { type, optionsKey };
}
