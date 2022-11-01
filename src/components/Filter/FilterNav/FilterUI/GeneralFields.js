import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { has } from 'lodash';
import { wpFeSanitizeTitle } from '../../wp-fe-sanitize-title';
import Listbox from '../../../Field/Listbox';
import Text from '../../../Field/Text';
import ToggleGroup from '../../../Field/ToggleGroup';
import Checkbox from '../../../Field/Checkbox';
import useFilterData from '../../useFilterData';
import Number from '../../../Field/Number';
import { variableFilterTypesData } from '../../utils';

const GeneralFields = ({ state, dispatch }) => {
	const {
		handleCheckboxChange,
		handleToggleGroupChange,
		handleTextFieldChange,
		setActiveFilterData,
		setActiveFilterMultiData,
	} = useFilterData(state, dispatch);

	const { filterType, activeFilterData, additionalData, filterKeys } = state;

	const {
		field_key,
		value_type,
		value_decimal,
		value_decimal_places,
		post_property,
	} = activeFilterData;

	const { initial_filter_keys: initialFilterKeysData } = additionalData;

	useEffect(() => {
		if ('post-property' !== filterType) {
			return;
		}

		const { post_property_data } = additionalData;
		const propertyType = post_property_data[post_property] ?? 'text';

		setActiveFilterData('value_type', propertyType, false);
	}, [post_property]);

	/**
	 * type = 'post-meta'
	 * value = '_stock_status'
	 * property = 'meta_key'
	 */
	const handleVariableFilterTypesChange = (type, value, property) => {
		let filterKey;
		let _filterKeys;

		if (has(filterKeys, [type, value])) {
			filterKey = filterKeys[type][value];
		} else {
			if (has(initialFilterKeysData, [type, value])) {
				filterKey = initialFilterKeysData[type][value];
			} else {
				filterKey = '_' + wpFeSanitizeTitle(value);
			}

			_filterKeys = {
				...filterKeys,
				[type]: {
					...filterKeys[type],
					[value]: filterKey,
				},
			};
		}

		const data = { field_key: filterKey, [property]: value };

		setActiveFilterMultiData(data);

		if (_filterKeys) {
			dispatch({
				type: 'SET_FILTER_KEYS',
				payload: _filterKeys,
			});
		}
	};

	const handleTaxonomyChange = (value) => {
		const { type, taxonomy } = activeFilterData;

		if (value === taxonomy) {
			return;
		}

		handleVariableFilterTypesChange(type, value, 'taxonomy');
	};

	const taxonomyField = () => {
		if ('custom-taxonomy' === filterType || 'attribute' === filterType) {
			const taxonomy = activeFilterData['taxonomy'];
			let taxonomyFieldLabel;
			let taxonomyFieldDesc;
			let data = {};
			let options = [];

			if ('custom-taxonomy' === filterType) {
				taxonomyFieldLabel = __('Taxonomy', 'wc-ajax-product-filter');
				taxonomyFieldDesc = __(
					'Select the taxonomy that terms will be available as filter options.',
					'wc-ajax-product-filter'
				);
				data = additionalData['custom_taxonomies'];
			} else {
				taxonomyFieldLabel = __('Attribute', 'wc-ajax-product-filter');
				taxonomyFieldDesc = __(
					'Select the attribute that values will be available as filter options.',
					'wc-ajax-product-filter'
				);
				data = additionalData['attributes'];
			}

			for (const [value, label] of Object.entries(data)) {
				options.push({ label, value });
			}

			return (
				<Listbox
					label={taxonomyFieldLabel}
					description={taxonomyFieldDesc}
					id={'taxonomy'}
					options={options}
					value={taxonomy}
					onChange={handleTaxonomyChange}
					searchable={false}
				/>
			);
		}
	};

	const handleMetaKeyChange = (value) => {
		const { type, meta_key } = activeFilterData;

		if (value === meta_key) {
			return;
		}

		handleVariableFilterTypesChange(type, value, 'meta_key');
	};

	const postMetaField = () => {
		if ('post-meta' === filterType) {
			const metaKey = activeFilterData['meta_key'];
			const data = additionalData['meta_keys'];
			let options = [];

			for (const [value, label] of Object.entries(data)) {
				options.push({ label, value });
			}

			return (
				<>
					<Listbox
						id={'meta_key'}
						label={__('Meta Key', 'wc-ajax-product-filter')}
						description={__(
							'Select the meta key that values will be available as filter options.',
							'wc-ajax-product-filter'
						)}
						options={options}
						value={metaKey}
						onChange={handleMetaKeyChange}
						visible={4}
					/>
				</>
			);
		}
	};

	const handlePostPropertyChange = (value) => {
		const { type, post_property } = activeFilterData;

		if (value === post_property) {
			return;
		}

		handleVariableFilterTypesChange(type, value, 'post_property');
	};

	const postPropertyField = () => {
		if ('post-property' === filterType) {
			const data = additionalData['post_properties'];
			let options = [];

			for (const [value, { label }] of Object.entries(data)) {
				options.push({ label, value });
			}

			return (
				<Listbox
					label={__('Post Property', 'wc-ajax-product-filter')}
					description={__(
						'Select the post property that values will be available as filter options.',
						'wc-ajax-product-filter'
					)}
					id={'post_property'}
					options={options}
					value={post_property}
					onChange={handlePostPropertyChange}
					searchable={false}
				/>
			);
		}
	};

	const handleFilterKeyChange = (filterKey) => {
		setActiveFilterData('field_key', filterKey);

		const variableFilterTypes = variableFilterTypesData();

		const variableFilterTypeKeys = Object.keys(variableFilterTypes);

		if (variableFilterTypeKeys.includes(filterType)) {
			let _filterKeys;

			variableFilterTypeKeys.forEach((type) => {
				if (filterType === type) {
					const property = variableFilterTypes[type];
					const key = activeFilterData[property];

					_filterKeys = {
						...filterKeys,
						[type]: {
							...filterKeys[type],
							[key]: filterKey,
						},
					};
				}
			});

			if (_filterKeys) {
				dispatch({ type: 'SET_FILTER_KEYS', payload: _filterKeys });
			}
		}
	};

	const filterKeyField = () => {
		if ('active-filters' !== filterType && 'reset-button' !== filterType) {
			return (
				<Text
					id={'filter_key'}
					label={__('Filter Key', 'wc-ajax-product-filter')}
					description={__(
						'The unique key that will be used in the URL. Only a-z, 0-9, "_" and "-" symbols are supported.',
						'wc-ajax-product-filter'
					)}
					value={field_key}
					onChange={handleFilterKeyChange}
					isFilterKey={true}
				/>
			);
		}
	};

	const valueTypeField = () => {
		if ('post-meta' === filterType) {
			return (
				<ToggleGroup
					id={'value_type'}
					label={__('Value Type', 'wc-ajax-product-filter')}
					description={__(
						'Determines the meta value type.',
						'wc-ajax-product-filter'
					)}
					options={[
						{
							label: __('Text', 'wc-ajax-product-filter'),
							value: 'text',
						},
						{
							label: __('Number', 'wc-ajax-product-filter'),
							value: 'number',
						},
						{
							label: __('Date', 'wc-ajax-product-filter'),
							value: 'date',
						},
					]}
					onChange={handleToggleGroupChange}
					value={value_type}
				/>
			);
		}
	};

	const valueIsDecimalField = () => {
		if ('post-meta' === filterType && 'number' === value_type) {
			return (
				<Checkbox
					id={'value_decimal'}
					label={__('Value is decimal', 'wc-ajax-product-filter')}
					description={__(
						'Whether the meta values have decimal places.',
						'wc-ajax-product-filter'
					)}
					isChecked={value_decimal}
					onChange={handleCheckboxChange}
				/>
			);
		}
	};

	const decimalPlacesField = () => {
		if (
			'post-meta' === filterType &&
			'number' === value_type &&
			'1' === value_decimal
		) {
			return (
				<Number
					id={'value_decimal_places'}
					label={__('Decimal Places', 'wc-ajax-product-filter')}
					description={__(
						'Determines the number of decimal places in meta values.',
						'wc-ajax-product-filter'
					)}
					value={value_decimal_places}
					onChange={handleTextFieldChange}
				/>
			);
		}
	};

	let output = '';

	if (filterType) {
		output = (
			<>
				{taxonomyField()}

				{postMetaField()}

				{postPropertyField()}

				{filterKeyField()}

				{valueTypeField()}

				{valueIsDecimalField()}

				{decimalPlacesField()}
			</>
		);
	}

	return output;
};

export default GeneralFields;
