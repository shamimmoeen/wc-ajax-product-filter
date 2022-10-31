import { __ } from '@wordpress/i18n';

const demoRules = [
	// [
	// 	{
	// 		rule: {
	// 			label: __('Page', 'wc-ajax-product-filter'),
	// 			value: 'page',
	// 			group: 'page',
	// 		},
	// 		operator: {
	// 			label: __('not equal', 'wc-ajax-product-filter'),
	// 			value: 'not-equal',
	// 		},
	// 	},
	// 	{
	// 		rule: {
	// 			label: __('Category', 'wc-ajax-product-filter'),
	// 			value: 'product_cat',
	// 			group: 'archive',
	// 		},
	// 		operator: {
	// 			label: __('equal', 'wc-ajax-product-filter'),
	// 			value: 'equal',
	// 		},
	// 		compare: { label: 'Uncategorized', value: 15 },
	// 		include_children: '1',
	// 	},
	// ],
	[
		{
			rule: {
				label: __('Price', 'wc-ajax-product-filter'),
				value: 371,
				group: 'filter',
			},
			operator: {
				label: __('equal', 'wc-ajax-product-filter'),
				value: 'equal',
			},
		},
	],
];

export const initialState = {
	isLoading: true,
	activeUIStep: '',
	title: '',
	filterType: '',
	filterId: '',
	activeFilterData: {},
	visibilityRules: {
		media_screens: ['mobile'],
		enable_rules: '1',
		rules: demoRules,
	},
	additionalData: {},
	filterKeys: {},
	filtersData: {},
	isDirty: false,
	loadPreview: true,
};

const filterReducer = (state, action) => {
	switch (action.type) {
		case 'SET_LOADING':
			return { ...state, isLoading: action.payload };

		case 'SET_ACTIVE_UI_STEP':
			return { ...state, activeUIStep: action.payload };

		case 'SET_TITLE':
			return { ...state, title: action.payload };

		case 'SET_FILTER_TYPE':
			return { ...state, filterType: action.payload };

		case 'SET_FILTER_ID':
			return { ...state, filterId: action.payload };

		case 'SET_ACTIVE_FILTER_DATA':
			return { ...state, activeFilterData: action.payload };

		case 'SET_ADDITIONAL_DATA':
			return { ...state, additionalData: action.payload };

		case 'SET_VISIBILITY_RULES':
			return { ...state, visibilityRules: action.payload };

		case 'SET_FILTER_KEYS':
			return { ...state, filterKeys: action.payload };

		case 'SET_FILTERS_DATA':
			return { ...state, filtersData: action.payload };

		case 'SET_DIRTY':
			return { ...state, isDirty: true };

		case 'UNSET_DIRTY':
			return { ...state, isDirty: false };

		case 'SET_LOAD_PREVIEW':
			return { ...state, loadPreview: true };

		case 'UNSET_LOAD_PREVIEW':
			return { ...state, loadPreview: false };

		default:
			return state;
	}
};

export default filterReducer;
