import { __ } from '@wordpress/i18n';
import { useForm } from '../FormContext';
import useFormFilterData from '../useFormFilterData';
import Text from '../../Field/Text';
import Select from '../../Field/Select';
import Checkbox from '../../Field/Checkbox';
import Number from '../../Field/Number';
import { Notice } from '@wordpress/components';
import { getGlobalFilterKey, getFilterTypes, getMetaKeys } from '../utils';
import Radio from '../../Field/Radio';

const General = ({ index }) => {
	const { state, dispatch } = useForm();

	const {
		handleFilterTypeChange,
		handleFilterKeyChange,
		handleMetaKeyChange,
		handleTextFieldChange,
		handleRadioChange,
		handleCheckboxChange,
	} = useFormFilterData(state, dispatch);

	const { filterKeys, formFilters } = state;

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
		is_acf,
		value_decimal,
		value_decimal_places,
		date_input_format,
		field_key,
		field_key_error,
		field_key_error_,
	} = filter;

	let typeDisabledInfo;
	let filterKeyDisabledInfo;

	if (id) {
		typeDisabledInfo = __(
			'Filter type can not be changed after it is saved. But you can permanently delete the filter and add a new one.',
			'wc-ajax-product-filter'
		);

		filterKeyDisabledInfo = __(
			'Filter key can not be changed after it is saved. But you can change the filter keys globally from "Settings > Filter Keys" section.',
			'wc-ajax-product-filter'
		);
	}

	let filterTitle = title;
	let filterTypes;
	let metaKeys;
	let filterKey = field_key;
	let globalFilterKey;

	if (id) {
		filterTypes = wcapf_admin_params.filter_types;
		metaKeys = wcapf_admin_params.meta_keys;
	} else {
		const otherFilters = [...formFilters];
		otherFilters.splice(index, 1);

		filterTypes = getFilterTypes(otherFilters);

		metaKeys = getMetaKeys(otherFilters);

		globalFilterKey = getGlobalFilterKey(filterKeys, filter);

		if (globalFilterKey) {
			filterKeyDisabledInfo = __(
				'This key is already assigned for this filter type and can\'t be changed from here. But you can change the filter keys globally from "Settings > Filter Keys" section.',
				'wc-ajax-product-filter'
			);
		}
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

	// Default filter title.
	if (!filterTitle) {
		filterTitle = filterType.label;

		if ('post-meta' === type && meta_key) {
			filterTitle += `[${meta_key}]`;
		}
	}

	// Default filter key.
	if (!filterKey) {
		if ('post-meta' === type) {
			if (meta_key) {
				filterKey = meta_key;
			}
		} else {
			filterKey = filterType.key;
		}
	}

	const metaKey = metaKeys.find((option) => option.value === meta_key);

	let fieldKeyError;

	if (!globalFilterKey && field_key_error) {
		fieldKeyError = field_key_error;
	} else if (field_key_error_) {
		fieldKeyError = field_key_error_;
	}

	return (
		<>
			<Text
				id={'title'}
				index={index}
				label={__('Filter Title', 'wc-ajax-product-filter')}
				description={__(
					'Give a title to the filter which will appear before the filter options.',
					'wc-ajax-product-filter'
				)}
				value={title}
				placeholder={filterTitle}
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
				label={__('Filter Type', 'wc-ajax-product-filter')}
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

			{'taxonomy' === type && (
				<Radio
					id={'value_type'}
					index={index}
					label={__('Value Type', 'wc-ajax-product-filter')}
					description={__(
						'Determines the taxonomy terms value type.',
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
							isPro: true,
						},
					]}
					onChange={handleRadioChange}
					value={value_type}
					isDisabled={id}
				/>
			)}

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

					<Radio
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
								isPro: true,
							},
							{
								label: __('Date', 'wc-ajax-product-filter'),
								value: 'date',
								isPro: true,
							},
						]}
						onChange={handleRadioChange}
						value={value_type}
						isDisabled={id}
					/>
				</>
			)}

			{'post-meta' === type && 'text' === value_type && (
				<Checkbox
					id={'is_acf'}
					index={index}
					label={__('Is ACF Field', 'wc-ajax-product-filter')}
					description={__(
						'Enable this if this is a field of <b>Advanced Custom Fields</b>. If enabled the labels and values will be synced directly.',
						'wc-ajax-product-filter'
					)}
					isChecked={is_acf}
					onChange={handleCheckboxChange}
				/>
			)}

			{'post-meta' === type && 'number' === value_type && (
				<>
					<Checkbox
						id={'value_decimal'}
						index={index}
						label={__('Value is decimal', 'wc-ajax-product-filter')}
						description={__(
							"Enable this if the meta values have decimal places. It'll filter the products more accurately.",
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

			{'post-meta' === type && 'date' === value_type && (
				<Radio
					id={'date_input_format'}
					index={index}
					label={__('Date Input Format', 'wc-ajax-product-filter')}
					description={__(
						'Determines the format of the date saved in the database.',
						'wc-ajax-product-filter'
					)}
					options={[
						{
							label: __('Timestamp', 'wc-ajax-product-filter'),
							value: 'timestamp',
						},
						{
							label: __('YYYYMMDD', 'wc-ajax-product-filter'),
							value: 'yyyymmdd',
						},
					]}
					value={date_input_format}
					onChange={handleRadioChange}
				/>
			)}

			{fieldKeyError && (
				<Notice status='error' isDismissible={false}>
					{fieldKeyError}
				</Notice>
			)}

			<Text
				id={'field_key'}
				index={index}
				label={__('Filter Key', 'wc-ajax-product-filter')}
				description={__(
					'The unique key that will be used in the URL. Only a-z, 0-9, "_" and "-" symbols are supported.',
					'wc-ajax-product-filter'
				)}
				value={globalFilterKey ? globalFilterKey : field_key}
				placeholder={filterKey}
				onChange={handleFilterKeyChange}
				isDisabled={id || globalFilterKey}
				tooltip={filterKeyDisabledInfo}
			/>
		</>
	);
};

export default General;
