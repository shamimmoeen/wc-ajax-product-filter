import { __ } from '@wordpress/i18n';
import { useForm } from '../FormContext';
import useFormFilterData from '../useFormFilterData';
import Text from '../../Field/Text';
import Select from '../../Field/Select';
import ToggleGroup from '../../Field/ToggleGroup';
import Checkbox from '../../Field/Checkbox';
import Number from '../../Field/Number';

const filterTypes = wcapf_admin_params.filter_types;
const metaKeys = wcapf_admin_params.meta_keys;

const General = ({ index }) => {
	const { state, dispatch } = useForm();

	const {
		handleFilterTypeChange,
		handleFilterKeyChange,
		handleTextFieldChange,
		handleSelectChange,
		handleToggleGroupChange,
		handleCheckboxChange,
	} = useFormFilterData(state, dispatch);

	const { formFilters } = state;

	const filter = formFilters[index];

	const {
		title,
		type,
		taxonomy,
		meta_key,
		value_type,
		value_decimal,
		value_decimal_places,
		field_key,
	} = filter;

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
				renderAsFormField
			/>

			{'post-meta' === type && (
				<>
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
						onChange={handleSelectChange}
						isSearchable={true}
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
			/>
		</>
	);
};

export default General;
