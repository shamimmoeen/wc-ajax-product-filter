import { __ } from '@wordpress/i18n';
import { foundProVersion } from '../utils';

export function availableFilters() {
	return [
		{
			title: __('Active Filters', 'wc-ajax-product-filter'),
			type: 'active-filters',
		},
		{
			title: __('Category', 'wc-ajax-product-filter'),
			type: 'category',
			defaultFilterKey: '_product_cat',
		},
		{
			title: __('Tag', 'wc-ajax-product-filter'),
			type: 'tag',
			defaultFilterKey: '_product_tag',
		},
		{
			title: __('Attribute', 'wc-ajax-product-filter'),
			type: 'attribute',
		},
		{
			title: __('Price', 'wc-ajax-product-filter'),
			type: 'price',
			defaultFilterKey: '_price',
		},
		{
			title: __('Rating', 'wc-ajax-product-filter'),
			type: 'rating',
			defaultFilterKey: '_rating',
		},
		{
			title: __('Product Status', 'wc-ajax-product-filter'),
			type: 'product-status',
			defaultFilterKey: '_status',
		},
		{
			title: __('Post Property', 'wc-ajax-product-filter'),
			type: 'post-property',
			isPro: true,
		},
		{
			title: __('Custom Taxonomy', 'wc-ajax-product-filter'),
			type: 'custom-taxonomy',
			isPro: true,
		},
		{
			title: __('Post Meta', 'wc-ajax-product-filter'),
			type: 'post-meta',
			isPro: true,
		},
		{
			title: __('Sort by', 'wc-ajax-product-filter'),
			type: 'sort-by',
			defaultFilterKey: '_sort_by',
			isPro: true,
		},
		{
			title: __('Per page', 'wc-ajax-product-filter'),
			type: 'per-page',
			defaultFilterKey: '_per_page',
			isPro: true,
		},
		{
			title: __('Reset Button', 'wc-ajax-product-filter'),
			type: 'reset-button',
		},
	];
}

export function filterDefaultData() {
	return {
		// Taxonomy
		show_title: '1',
		field_key: '',
		taxonomy: '',
		display_type: 'checkbox',
		query_type: 'and',
		all_items_label: '',
		use_chosen: '',
		chosen_no_results_message: '',
		enable_multiple_filter: '',
		hierarchical: '',
		enable_hierarchy_accordion: '',
		show_count: '',
		hide_empty: '',
		enable_tooltip: '',
		show_count_in_tooltip: '',
		tooltip_position: 'top',
		custom_appearance_options: [],
		use_term_slug_in_url: '',
		limit_options: 'off',
		parent_term: '',
		limit_values_by_id: '',
		exclude_values_id: '',
		show_clear_button: '',
		order_terms_by: 'default',
		order_terms_dir: 'asc',
		enable_accordion: '',
		accordion_default_state: 'expanded',
		enable_soft_limit: '',
		soft_limit: '5',
		type: '',
		field_id: '',
		enable_visibility_rules: '',
		visibility_rules: [],
		get_options: 'automatically',
		use_category_images: '',
		// Active Filters
		active_filters_layout: 'simple',
		enable_clear_all_button: '1',
		clear_all_button_label: __('Clear All', 'wc-ajax-product-filter'),
		show_if_empty: '',
		empty_filter_message: __(
			'No filter is applied.',
			'wc-ajax-product-filter'
		),
		move_clear_all_button_in_title: '',
		enable_soft_limit_for_extended_layout: '',
		soft_limit_for_extended_layout: '5',
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
		max_value: '1000',
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
		meta_key: '',
		value_type: 'text',
		value_decimal: '',
		value_decimal_places: '2',
		options_order_by: 'value',
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
		// Post Property
		post_property: '',
		// Sort by
		sort_by_options: [],
		// Per page
		per_page_options: [],
		// Reset Button
		reset_button_label: __('Reset', 'wc-ajax-product-filter'),
	};
}

function ratingFilterDefaultData() {
	return { options_order_dir: 'desc' };
}

function perPageFilterDefaultData() {
	return {
		display_type: 'radio',
		min_value: '25',
		max_value: '100',
		step: '25',
	};
}

function sortByFilterDefaultData() {
	return {
		display_type: 'radio',
	};
}

export function getFilterDefaultData(type) {
	const allFilters = availableFilters();
	const defaultData = filterDefaultData();

	// Set filter type.
	defaultData.type = type;

	// Set filter key.
	const _filterData = allFilters.find((filter) => type === filter.type);
	const _defaultFilterKey = _filterData.defaultFilterKey;

	if (_defaultFilterKey) {
		defaultData.field_key = _defaultFilterKey;
	}

	// Rating filter default options.
	if ('rating' === type) {
		for (const [key, value] of Object.entries(ratingFilterDefaultData())) {
			defaultData[key] = value;
		}
	}

	// Per-Page filter default options.
	if ('per-page' === type) {
		for (const [key, value] of Object.entries(perPageFilterDefaultData())) {
			defaultData[key] = value;
		}
	}

	// Sort By filter default options.
	if ('sort-by' === type) {
		for (const [key, value] of Object.entries(sortByFilterDefaultData())) {
			defaultData[key] = value;
		}
	}

	return defaultData;
}

export function variableFilterTypesData() {
	return {
		attribute: 'taxonomy',
		'custom-taxonomy': 'taxonomy',
		'post-meta': 'meta_key',
		'post-property': 'post_property',
	};
}

export function initialFilterKeysData(activeFilterData) {
	const filterType = activeFilterData['type'] ?? '';
	const filterKey = activeFilterData['field_key'] ?? '';
	const filterKeys = {};

	if (!filterType || !filterKey) {
		return filterKeys;
	}

	if ('active-filters' === filterType || 'reset-button' === filterType) {
		return filterKeys;
	}

	const variableFilterTypes = variableFilterTypesData();

	const variableFilterTypeKeys = Object.keys(variableFilterTypes);

	if (variableFilterTypeKeys.includes(filterType)) {
		variableFilterTypeKeys.forEach((type) => {
			if (filterType === type) {
				const property = variableFilterTypes[type];
				const data = { [activeFilterData[property]]: filterKey };

				filterKeys[type] = data;
			}
		});
	} else {
		filterKeys[filterType] = filterKey;
	}

	return filterKeys;
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
			isPro: true,
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
	];
}

export function orderByOptions() {
	return [
		{
			label: __('Default', 'wc-ajax-product-filter'),
			value: 'none',
		},
		{
			label: __('Label', 'wc-ajax-product-filter'),
			value: 'label',
		},
		{
			label: __('Value', 'wc-ajax-product-filter'),
			value: 'value',
		},
		{
			label: __('Count', 'wc-ajax-product-filter'),
			value: 'count',
		},
	];
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
		const proDisplayTypes = ['label', 'color', 'image'];

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

export function dateDisplayTypes() {
	return [
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

export function getMetaOptions(meta_keys) {
	const metaOptions = [];

	for (const key in meta_keys) {
		const option = { label: key, value: key };

		metaOptions.push(option);
	}

	return metaOptions;
}

export function getTaxonomy(filterType, taxonomy) {
	let _taxonomy;

	if ('category' === filterType) {
		_taxonomy = 'product_cat';
	} else if ('tag' === filterType) {
		_taxonomy = 'product_tag';
	} else {
		_taxonomy = taxonomy;
	}

	return _taxonomy;
}

export function isTaxonomyFilters(filterType) {
	const taxonomyFilterTypes = [
		'category',
		'tag',
		'attribute',
		'custom-taxonomy',
	];

	return taxonomyFilterTypes.includes(filterType);
}

export function getTableData(filterType, activeFilterData) {
	let type;
	let optionsKey;

	const { value_type } = activeFilterData;

	if ('price' === filterType || 'rating' === filterType) {
		type = 'number-options';
		optionsKey = 'number_manual_options';
	} else if ('product-status' === filterType) {
		type = 'product-status-options';
		optionsKey = 'product_status_options';
	} else if ('post-meta' === filterType) {
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
	}

	return { type, optionsKey };
}

export function getCustomAppearanceModalData(filterType, activeFilterData) {
	let taxonomy = '';
	let type = '';

	if (isTaxonomyFilters(filterType)) {
		const {
			display_type: _type,
			taxonomy: _taxonomy,
			use_category_images,
		} = activeFilterData;

		if ('color' === _type || ('image' === _type && !use_category_images)) {
			if ('category' === filterType) {
				taxonomy = 'product_cat';
			} else if ('tag' === filterType) {
				taxonomy = 'product_tag';
			} else if (
				'attribute' === filterType ||
				'custom-taxonomy' === filterType
			) {
				taxonomy = _taxonomy;
			}

			type = _type;
		}
	}

	return { type, taxonomy };
}
