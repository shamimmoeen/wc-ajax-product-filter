import { __ } from '@wordpress/i18n';
import { useForm } from '../FormContext';
import useFormFilterData from '../useFormFilterData';
import Text from '../../Field/Text';
import Select from '../../Field/Select';
import ToggleGroup from '../../Field/ToggleGroup';
import Checkbox from '../../Field/Checkbox';
import Number from '../../Field/Number';
import { Notice } from '@wordpress/components';
import { getFilterTypes, getMetaKeys } from '../utils';

const General = ({ index }) => {
	const { state, dispatch } = useForm();

	const {
		handleFilterTypeChange,
		handleFilterKeyChange,
		handleMetaKeyChange,
		handleTextFieldChange,
		handleToggleGroupChange,
		handleCheckboxChange,
	} = useFormFilterData(state, dispatch);

	const { formFilters } = state;

	const filter = formFilters[index];

	const {
		id,
		title,
		type_error,
		type,
		taxonomy,
		meta_key_error,
		meta_key,
		value_type,
		value_decimal,
		value_decimal_places,
		field_key_error,
		field_key,
	} = filter;

	let typeDisabledInfo;
	let filterKeyDisabledInfo;

	if (id) {
		typeDisabledInfo = __(
			'Filter type can not be changed after it is saved. But you can permanently remove the filter and add a new one.',
			'wc-ajax-product-filter'
		);

		filterKeyDisabledInfo = __(
			'Filter key can not be changed after it is saved. But you can change the filter keys globally from "Settings > Filter Keys" section.',
			'wc-ajax-product-filter'
		);
	}

	let filterTypes;
	let metaKeys;

	if (id) {
		filterTypes = wcapf_admin_params.filter_types;
		metaKeys = wcapf_admin_params.meta_keys;
	} else {
		const otherFilters = [...formFilters];
		otherFilters.splice(index, 1);

		filterTypes = getFilterTypes(otherFilters);

		metaKeys = getMetaKeys(otherFilters);
	}

	let filterType;

	if ('taxonomy' === type) {
		const taxonomyOption = filterTypes.find(
			(option) => option.value === type
		);
		const taxonomies = taxonomyOption.options;

		filterType = taxonomies.find((option) => option.value === taxonomy);
	} else {
		filterType = filterTypes.find((option) => option.value === type);
	}

	const metaKey = metaKeys.find((option) => option.value === meta_key);

	return (
		<>
			<Text
				id={'title'}
				index={index}
				label={__('Filter title', 'wc-ajax-product-filter')}
				description={__(
					'Give a title to the filter which will appear before the filter options.',
					'wc-ajax-product-filter'
				)}
				value={title}
				onChange={handleTextFieldChange}
			/>

			{type_error && (
				<Notice status='error' isDismissible={false}>
					{type_error}
				</Notice>
			)}

			<Select
				id={'type'}
				index={index}
				label={__('Filter type', 'wc-ajax-product-filter')}
				description={__(
					'Select the filter type by which you want to filter the products.',
					'wc-ajax-product-filter'
				)}
				options={filterTypes}
				value={filterType}
				onChange={handleFilterTypeChange}
				isDisabled={id}
				renderAsFormField
				tooltip={typeDisabledInfo}
			/>

			{'post-meta' === type && (
				<>
					{meta_key_error && (
						<Notice status='error' isDismissible={false}>
							{meta_key_error}
						</Notice>
					)}

					<Select
						id={'meta_key'}
						index={index}
						label={__('Meta Key', 'wc-ajax-product-filter')}
						description={__(
							'Select the meta key that values will be available as filter options.',
							'wc-ajax-product-filter'
						)}
						options={metaKeys}
						value={metaKey}
						onChange={handleMetaKeyChange}
						isSearchable={true}
						isDisabled={id}
						renderAsFormField
					/>

					<ToggleGroup
						id={'value_type'}
						index={index}
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
						isDisabled={id}
					/>
				</>
			)}

			{'post-meta' === type && 'number' === value_type && (
				<>
					<Checkbox
						id={'value_decimal'}
						index={index}
						label={__('Value is decimal', 'wc-ajax-product-filter')}
						description={__(
							'Whether the meta values have decimal places.',
							'wc-ajax-product-filter'
						)}
						isChecked={value_decimal}
						onChange={handleCheckboxChange}
					/>

					{'1' === value_decimal && (
						<Number
							id={'value_decimal_places'}
							index={index}
							label={__(
								'Decimal Places',
								'wc-ajax-product-filter'
							)}
							description={__(
								'Determines the number of decimal places in meta values.',
								'wc-ajax-product-filter'
							)}
							value={value_decimal_places}
							onChange={handleTextFieldChange}
							min={0}
						/>
					)}
				</>
			)}

			{field_key_error && (
				<Notice status='error' isDismissible={false}>
					{field_key_error}
				</Notice>
			)}

			<Text
				id={'field_key'}
				index={index}
				label={__('Filter key', 'wc-ajax-product-filter')}
				description={__(
					'The unique key that will be used in the URL. Only a-z, 0-9, "_" and "-" symbols are supported.',
					'wc-ajax-product-filter'
				)}
				value={field_key}
				onChange={handleFilterKeyChange}
				isDisabled={id}
				tooltip={filterKeyDisabledInfo}
			/>
		</>
	);
};

export default General;
