import { __ } from '@wordpress/i18n';
import { isEmpty, merge, find } from 'lodash';
import { FILTER_KEY_IN_USE_MESSAGE, mergeSelectOptions } from '../utils';

export function newFilterData(index, formFilters) {
	let data = {};

	const types = wcapf_admin_params.filter_types;

	const _taxonomyTypes = find(types, { value: 'taxonomy' });
	const taxonomyTypes = _taxonomyTypes.options;

	for (let i = 0; i < taxonomyTypes.length; i++) {
		const taxonomyType = taxonomyTypes[i];
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
		const notAllowedTypes = [
			'taxonomy',
			'sort-by',
			'per-page',
			'component',
		];

		for (let i = 0; i < types.length; i++) {
			const otherType = types[i];

			if (!notAllowedTypes.includes(otherType.value)) {
				const { value: type } = otherType;

				const found = find(formFilters, { type });

				if (!found) {
					data = { type };

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
	});
}

/**
 * Gets the filter type data for the current filter.
 */
export function getFilterTypeData(filter) {
	const { type, taxonomy, component } = filter;
	const types = wcapf_admin_params.filter_types;

	let filterType;

	if ('taxonomy' === type) {
		const taxonomies = find(types, { value: type });

		filterType = find(taxonomies.options, { value: taxonomy });
	} else if ('component' === type) {
		const components = find(types, { value: type });

		filterType = find(components.options, { value: component });
	} else {
		filterType = find(types, { value: type });
	}

	return filterType;
}

export function getFilterTitle(filter, filterType) {
	const { title, type, meta_key } = filter;

	let filterTitle = title;

	if (!filterTitle) {
		filterTitle = filterType.label;

		if ('post-meta' === type && meta_key) {
			filterTitle += `[${meta_key}]`;
		}
	}

	return filterTitle;
}

export function getFilterKey(filter, filterType) {
	const { field_key, type, meta_key } = filter;

	let filterKey = field_key;

	if (!filterKey) {
		if ('post-meta' === type) {
			if (meta_key) {
				filterKey = `_${meta_key}`;
			}
		} else if ('component' !== type) {
			filterKey = filterType.key;
		}
	}

	return filterKey;
}

export function getDisplayTypeData(filter) {
	const {
		type,
		value_type,
		display_type,
		number_display_type,
		date_display_type,
	} = filter;

	let displayTypes;
	let _displayType;

	if ('number' === value_type || 'price' === type) {
		displayTypes = numberDisplayTypes();
		_displayType = number_display_type;
	} else if ('date' === value_type) {
		displayTypes = dateDisplayTypes();
		_displayType = date_display_type;
	} else {
		displayTypes = allTextDisplayTypes();
		_displayType = display_type;
	}

	const displayType = displayTypes.find(
		(option) => option.value === _displayType
	);

	return displayType;
}

function getFilterType(filter) {
	const { type, taxonomy, meta_key } = filter;
	let filterType;

	if ('taxonomy' === type) {
		filterType = `taxonomy>${taxonomy}`;
	} else if ('post-meta' === type) {
		filterType = `post-meta>${meta_key}`;
	} else {
		filterType = type;
	}

	return filterType;
}

export function multipleFilterInstanceFound(formFilters, currentFilterIndex) {
	if (!formFilters) {
		return false;
	}

	const filterTypes = [];
	let filterType;
	const excludedTypes = ['component'];

	for (let index = 0; index < formFilters.length; index++) {
		const filter = formFilters[index];

		if (index === currentFilterIndex) {
			filterType = getFilterType(filter);
		} else {
			if (!excludedTypes.includes(filter.type)) {
				filterTypes.push(getFilterType(filter));
			}
		}
	}

	return filterTypes.includes(filterType);
}

export function getFilterTabs(filter) {
	const availableTabs = [
		{
			name: 'general',
			title: __('General', 'wc-ajax-product-filter'),
		},
		{
			name: 'appearance',
			title: __('Appearance', 'wc-ajax-product-filter'),
		},
		{
			name: 'options',
			title: __('Options', 'wc-ajax-product-filter'),
		},
		{
			name: 'advanced',
			title: __('Advanced', 'wc-ajax-product-filter'),
		},
	];

	const { type } = filter;

	if ('component' === type) {
		return availableTabs.filter(({ name }) => 'general' === name);
	}

	return availableTabs;
}

/**
 * Gets the filter types by disabling the used filter types in the form.
 */
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

export function getGlobalFilterKey(filterKeys, filter) {
	const { id, type, taxonomy, meta_key } = filter;

	if (id) {
		return;
	}

	if ('taxonomy' === type) {
		const found = find(filterKeys, { type, taxonomy });

		if (found) {
			return found.field_key;
		}
	} else if ('post-meta' === type) {
		const found = find(filterKeys, { type, meta_key });

		if (found) {
			return found.field_key;
		}
	} else {
		const found = find(filterKeys, { type });

		if (found) {
			return found.field_key;
		}
	}
}

export function getFilterKeyError(
	filterKeys,
	filter,
	formFilters,
	currentFilterIndex
) {
	if (filter['id']) {
		return;
	}

	let filterKeyError;
	const field_key = filter['field_key'];

	// We'll use the default key.
	if (isEmpty(field_key)) {
		return;
	}

	const otherFilters = [];

	const filterTypes = wcapf_admin_params.filter_types;
	const taxonomyType = find(filterTypes, { value: 'taxonomy' });
	const taxonomyTypes = taxonomyType.options;

	for (let index = 0; index < formFilters.length; index++) {
		if (index === currentFilterIndex) {
			continue;
		}

		const formFilter = { ...formFilters[index] };

		// We'll use the default key.
		if (isEmpty(formFilter['field_key'])) {
			const { type, taxonomy, meta_key } = formFilter;

			if ('taxonomy' === type) {
				const taxonomyData = find(taxonomyTypes, { value: taxonomy });
				formFilter['field_key'] = taxonomyData['key'];
			} else if ('post-meta' === type) {
				formFilter['field_key'] = `_${meta_key}`;
			} else {
				const typeData = find(filterTypes, { value: type });
				formFilter['field_key'] = typeData['key'];
			}
		}

		otherFilters.push(formFilter);
	}

	if (find(otherFilters, { field_key })) {
		console.log('found in this form', find(otherFilters, { field_key })); // TODO: Remove.

		filterKeyError = FILTER_KEY_IN_USE_MESSAGE;
	} else if (find(filterKeys, { field_key })) {
		console.log('found in other forms', find(filterKeys, { field_key })); // TODO: Remove.

		filterKeyError = FILTER_KEY_IN_USE_MESSAGE;
	}

	return filterKeyError;
}

export function filterDefaultData() {
	return {
		id: '',
		title: '',
		type: '',
		taxonomy: '',
		taxHierarchical: '',
		meta_key: '',
		component: '',
		isACF: '',
		value_type: 'text',
		field_key: '',
		// Taxonomy
		display_type: 'checkbox',
		native_display_type_layout: 'list-item',
		custom_display_type_layout: 'inline',
		grid_columns: '2',
		swatch_with_text: '',
		query_type: 'or',
		all_items_label: '',
		enable_multiple_filter: '1',
		hierarchical: '',
		enable_hierarchy_accordion: '',
		show_count: '1',
		enable_tooltip: '',
		show_count_in_tooltip: '',
		tooltip_position: 'top',
		get_options: 'automatically',
		manual_options: [],
		order_terms_by: 'default',
		order_terms_dir: 'asc',
		limit_options: 'off',
		include_terms: [],
		include_child: '',
		exclude_terms: [],
		exclude_child: '',
		parent_term: '',
		direct_child_only: '',
		// Price Filter
		number_display_type: 'range_slider',
		number_range_slider_display_values_as: 'input_field',
		alignment: 'default',
		input_type_number: '',
		number_range_enable_multiple_filter: '1',
		number_range_query_type: 'or',
		number_range_select_all_items_label: '',
		number_range_show_count: '1',
		number_get_options: 'automatically',
		number_manual_options: [],
		auto_detect_min_max: '1',
		min_value: '0',
		max_value: '100',
		step: '1',
		gap: '0',
		value_prefix: '',
		value_postfix: '',
		values_separator: '–',
		text_before_min_value: '',
		text_before_max_value: '',
		format_numbers: '',
		decimal_places: '2',
		thousand_separator: '',
		decimal_separator: '.',
		// Product Status
		product_status_options: [],
		// Post Meta
		is_acf: '',
		value_decimal: '',
		value_decimal_places: '2',
		date_input_format: 'timestamp',
		options_order_by: 'none',
		options_order_dir: 'asc',
		options_order_type: 'alphabetical',
		// Post Meta - value type Date
		date_display_type: 'input_date',
		date_format: 'dd-mm-yy',
		time_period_enable_multiple_filter: '1',
		time_period_query_type: 'or',
		time_period_select_all_items_label: '',
		show_date_inputs_inline: '',
		time_period_show_count: '1',
		date_picker_month_dropdown: '',
		date_picker_year_dropdown: '',
		date_from_prefix: '',
		date_from_postfix: '',
		date_from_placeholder: '',
		date_to_prefix: '',
		date_to_postfix: '',
		date_to_placeholder: '',
		time_period_options: [],
		// Post Author
		post_author_order_by: 'default',
		post_author_order_dir: 'asc',
		include_authors: [],
		exclude_authors: [],
		include_user_roles: [],
		// Sort By
		sort_by_options: [],
		// Per Page
		per_page_options: [],
		// Advanced Settings
		show_title: '1',
		enable_accordion: '',
		accordion_default_state: 'expanded',
		help_text: '',
		enable_search_field: '',
		search_field_placeholder: '',
		enable_reduce_height: 'no',
		soft_limit: '5',
		max_height: '200',
		show_in_active_filters: '1',
		visibility_rules: [],
		// Active filters
		active_filters_layout: 'simple',
		empty_filter_message: '',
		// Reset Button
		show_if_empty: '',
		// Error
		type_error: '',
		meta_key_error: '',
		field_key_error: '',
		field_key_error_: '', // Comes from server side.
	};
}

// These data gets reset after filter type is changed.
export function filterTypeDependentFields() {
	return [
		'taxonomy',
		'taxHierarchical',
		'meta_key',
		'component',
		'isACF',
		'display_type',
		'native_display_type_layout',
		'custom_display_type_layout',
		'grid_columns',
		'swatch_with_text',
		// Taxonomy
		'get_options',
		'order_terms_by',
		'order_terms_dir',
		'limit_options',
		'include_terms',
		'include_child',
		'exclude_terms',
		'exclude_child',
		'parent_term',
		'direct_child_only',
		// Manual Options
		'number_get_options',
		'manual_options',
		'number_manual_options',
		'time_period_options',
		'sort_by_options',
		'per_page_options',
		// Post Meta
		'is_acf',
		'value_type',
		'value_decimal',
		'value_decimal_places',
		'options_order_by',
		'options_order_dir',
		'options_order_type',
	];
}

export function proFilterTypes() {
	return ['sort-by', 'per-page'];
}

export function proFilterComponents() {
	return ['results-count', 'apply-mode', 'submit-mode'];
}

export function componentsWithTypeOnly() {
	return ['reset-button', 'results-count', 'apply-mode', 'submit-mode'];
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

export function taxonomyProLimitByOptions() {
	return ['child', 'parent_only'];
}

export function taxonomyLimitByOptions(hierarchical = false, withPro = false) {
	const nonHierarchicalOptions = [
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
	];

	const hierarchicalProOptions = [
		{
			label: __('Child of', 'wc-ajax-product-filter'),
			value: 'child',
		},
		{
			label: __('Parent Only', 'wc-ajax-product-filter'),
			value: 'parent_only',
		},
	];

	if (hierarchical) {
		return mergeSelectOptions(
			nonHierarchicalOptions,
			hierarchicalProOptions,
			withPro
		);
	}

	return nonHierarchicalOptions;
}

export function termsProOrderByOptions() {
	return ['slug', 'count', 'include'];
}

export function termsOrderByOptions(isManualEntry) {
	const freeOptions = [
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
	];

	let includeLabel;

	if (isManualEntry) {
		includeLabel = __('Entry', 'wc-ajax-product-filter');
	} else {
		includeLabel = __('Include', 'wc-ajax-product-filter');
	}

	const proOptions = [
		{
			label: __('Slug', 'wc-ajax-product-filter'),
			value: 'slug',
		},
		{
			label: __('Count', 'wc-ajax-product-filter'),
			value: 'count',
		},
		{
			label: includeLabel,
			value: 'include',
		},
	];

	return mergeSelectOptions(freeOptions, proOptions, true);
}

export function metaValuesProOrderByOptions() {
	return ['value', 'label', 'count', 'include'];
}

export function metaValuesOrderByOptions(isManualEntry) {
	const freeOptions = [
		{
			label: __('None', 'wc-ajax-product-filter'),
			value: 'none',
		},
	];

	const proOptions = [
		{
			label: __('Value', 'wc-ajax-product-filter'),
			value: 'value',
		},
		{
			label: __('Label', 'wc-ajax-product-filter'),
			value: 'label',
		},
		{
			label: __('Count', 'wc-ajax-product-filter'),
			value: 'count',
		},
	];

	if (isManualEntry) {
		proOptions.push({
			label: __('Entry', 'wc-ajax-product-filter'),
			value: 'include',
		});
	}

	return mergeSelectOptions(freeOptions, proOptions, true);
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

export function authorProOrderByOptions() {
	return ['count', 'include'];
}

export function authorOrderByOptions(isManualEntry) {
	const freeOptions = [
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
	];

	let includeLabel;

	if (isManualEntry) {
		includeLabel = __('Entry', 'wc-ajax-product-filter');
	} else {
		includeLabel = __('Include', 'wc-ajax-product-filter');
	}

	const proOptions = [
		{
			label: __('Count', 'wc-ajax-product-filter'),
			value: 'count',
		},
		{
			label: includeLabel,
			value: 'include',
		},
	];

	return mergeSelectOptions(freeOptions, proOptions, true);
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

const textFreeDisplayTypes = [
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
		label: __('Multiselect', 'wc-ajax-product-filter'),
		value: 'multi-select',
	},
	{
		label: __('Label', 'wc-ajax-product-filter'),
		value: 'label',
	},
];

function textProDisplayTypes(taxHierarchical = false) {
	const textProDisplayTypes = [
		{
			label: __('Color Swatch', 'wc-ajax-product-filter'),
			value: 'color',
		},
		{
			label: __('Image Swatch', 'wc-ajax-product-filter'),
			value: 'image',
		},
	];

	// if (taxHierarchical) {
	// 	textProDisplayTypes.push({
	// 		label: __('Hierarchy Select', 'wc-ajax-product-filter'),
	// 		value: 'hierarchy-select',
	// 	});
	// }

	return textProDisplayTypes;
}

export function taxonomyDisplayTypes(withPro = false, taxHierarchical = false) {
	return mergeSelectOptions(
		textFreeDisplayTypes,
		textProDisplayTypes(taxHierarchical),
		withPro
	);
}

export function postMetaDisplayTypes(withPro = false) {
	return mergeSelectOptions(
		textFreeDisplayTypes,
		textProDisplayTypes(),
		withPro
	);
}

export function textDisplayTypes() {
	return textFreeDisplayTypes;
}

export function allTextDisplayTypes() {
	return mergeSelectOptions(textFreeDisplayTypes, textProDisplayTypes(true));
}

export function sortByDisplayTypes() {
	return [
		{
			label: __('Radio', 'wc-ajax-product-filter'),
			value: 'radio',
		},
		{
			label: __('Select', 'wc-ajax-product-filter'),
			value: 'select',
		},
	];
}

export function numberDisplayTypes(withPro = false) {
	const freeOptions = [
		{
			label: __('Range - Slider', 'wc-ajax-product-filter'),
			value: 'range_slider',
		},
		{
			label: __('Range - Number', 'wc-ajax-product-filter'),
			value: 'range_number',
		},
	];

	const proOptions = [
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

	return mergeSelectOptions(freeOptions, proOptions, withPro);
}

export function dateDisplayTypes(withPro = false) {
	const freeOptions = [
		{
			label: __('Input - Date', 'wc-ajax-product-filter'),
			value: 'input_date',
		},
		{
			label: __('Input - Date Range', 'wc-ajax-product-filter'),
			value: 'input_date_range',
		},
	];

	const proOptions = [
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
			label: __('Time Period - Multiselect', 'wc-ajax-product-filter'),
			value: 'time_period_multiselect',
		},
		{
			label: __('Time Period - Label', 'wc-ajax-product-filter'),
			value: 'time_period_label',
		},
	];

	return mergeSelectOptions(freeOptions, proOptions, withPro);
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
	} else if ('sort-by' === filterType) {
		type = 'sort-by-options';
		optionsKey = 'sort_by_options';
	} else if ('per-page' === filterType) {
		type = 'per-page-options';
		optionsKey = 'per_page_options';
	} else if ('post-author' === filterType) {
		type = 'post-author-options';
		optionsKey = 'manual_options';
	} else if ('taxonomy' === filterType) {
		type = 'taxonomy-options';
		optionsKey = 'manual_options';
	}

	return { type, optionsKey };
}

export function hierarchicalDisplayTypes() {
	return ['checkbox', 'radio', 'select', 'multi-select'];
}

export function tooltipCanBeEnabled(filter) {
	const {
		type,
		value_type,
		display_type,
		number_display_type,
		date_display_type,
	} = filter;

	let enabled = false;

	const _displayTypes = ['select', 'multi-select', 'hierarchy-select'];

	const _numberDisplayTypes = [
		'range_slider',
		'range_number',
		'range_select',
		'range_multiselect',
	];

	const _dateDisplayTypes = [
		'input_date',
		'input_date_range',
		'time_period_select',
		'time_period_multiselect',
	];

	if ('price' === type) {
		if (!_numberDisplayTypes.includes(number_display_type)) {
			enabled = true;
		}
	} else if ('post-meta' === type) {
		if ('text' === value_type) {
			if (!_displayTypes.includes(display_type)) {
				enabled = true;
			}
		} else if ('number' === value_type) {
			if (!_numberDisplayTypes.includes(number_display_type)) {
				enabled = true;
			}
		} else if ('date' === value_type) {
			if (!_dateDisplayTypes.includes(date_display_type)) {
				enabled = true;
			}
		}
	} else {
		if (!_displayTypes.includes(display_type)) {
			enabled = true;
		}
	}

	return enabled;
}

export function swatchCanBeEnabled(filter) {
	const { type, value_type, display_type } = filter;

	if ('taxonomy' === type) {
		if ('color' === display_type || 'image' === display_type) {
			return true;
		}
	} else if ('post-meta' === type) {
		if ('text' === value_type) {
			if ('color' === display_type || 'image' === display_type) {
				return true;
			}
		}
	}

	return false;
}
