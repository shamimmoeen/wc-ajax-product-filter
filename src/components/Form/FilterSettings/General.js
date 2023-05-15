import { __ } from '@wordpress/i18n';
import { useForm } from '../FormContext';
import useFormFilterData from '../useFormFilterData';
import Text from '../../Field/Text';
import Select from '../../Field/Select';
import Checkbox from '../../Field/Checkbox';
import Number from '../../Field/Number';
import { Notice } from '@wordpress/components';
import {
	getGlobalFilterKey,
	getFilterTypes,
	getMetaKeys,
	getFilterTypeData,
	getFilterTitle,
	getFilterKey,
	componentsWithTypeOnly,
} from '../utils';
import Radio from '../../Field/Radio';

const withOutTitleComponents = componentsWithTypeOnly();

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
		meta_key_error,
		meta_key,
		component,
		value_type,
		// is_acf,
		value_decimal,
		value_decimal_places,
		date_input_format,
		field_key,
		field_key_error,
		field_key_error_,
		show_title,
		active_filters_layout,
		empty_filter_message,
		show_if_empty,
	} = filter;

	let typeDisabledInfo;
	let filterKeyDisabledInfo;

	if (id) {
		typeDisabledInfo = __(
			'Filter type can not be changed once it is saved. But you can permanently delete the filter and add a new one.',
			'wc-ajax-product-filter'
		);

		filterKeyDisabledInfo = __(
			'Once a filter key is set, you can not change it from the filter. But you can change the filter keys globally from "Settings > Filter Keys" tab.',
			'wc-ajax-product-filter'
		);
	}

	let filterTypes;
	let metaKeys;
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
				'This key is already assigned for this entity and can not be changed from here. But you can change the filter keys globally from "Settings > Filter Keys" tab.',
				'wc-ajax-product-filter'
			);
		}
	}

	const filterType = getFilterTypeData(filter);
	const filterTitle = getFilterTitle(filter, filterType);
	const filterKey = getFilterKey(filter, filterType);

	const metaKey = metaKeys.find((option) => option.value === meta_key);

	let fieldKeyError;

	if (!globalFilterKey && field_key_error) {
		fieldKeyError = field_key_error;
	} else if (field_key_error_) {
		fieldKeyError = field_key_error_;
	}

	const showTitleField = !(
		'component' === type && withOutTitleComponents.includes(component)
	);

	return (
		<>
			{showTitleField && (
				<Text
					id={'title'}
					index={index}
					label={__('Filter Title', 'wc-ajax-product-filter')}
					description={__(
						'Give a title to the filter that will appear before the filter options.',
						'wc-ajax-product-filter'
					)}
					value={title}
					placeholder={filterTitle}
					onChange={handleTextFieldChange}
				/>
			)}

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
					'Determines the entity by which the products will be filtered.',
					'wc-ajax-product-filter'
				)}
				options={filterTypes}
				value={filterType}
				onChange={handleFilterTypeChange}
				isDisabled={id}
				renderAsFormField
				tooltip={typeDisabledInfo}
			/>

			{/* {'taxonomy' === type && (
				<Radio
					id={'value_type'}
					index={index}
					label={__('Value Type', 'wc-ajax-product-filter')}
					description={__(
						'Determines the value type of taxonomy terms.',
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
			)} */}

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

			{/* {'post-meta' === type && 'text' === value_type && (
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
			)} */}

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
					label={__('Date Format', 'wc-ajax-product-filter')}
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

			{'component' !== type && (
				<>
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
						isFilterKey
					/>
				</>
			)}

			{'active-filters' === component && (
				<>
					<Checkbox
						id={'show_title'}
						index={index}
						label={__('Show title', 'wc-ajax-product-filter')}
						description={__(
							'Enable this to show the title before the active filters.',
							'wc-ajax-product-filter'
						)}
						isChecked={show_title}
						onChange={handleCheckboxChange}
					/>

					<Radio
						id={'active_filters_layout'}
						index={index}
						label={__('Layout', 'wc-ajax-product-filter')}
						description={__(
							'Simple: Show all the active items one by one, Extended: Group the active items by filter type and show them separately with filter title.',
							'wc-ajax-product-filter'
						)}
						options={[
							{
								label: __('Simple', 'wc-ajax-product-filter'),
								value: 'simple',
							},
							{
								label: __('Extended', 'wc-ajax-product-filter'),
								value: 'extended',
							},
						]}
						value={active_filters_layout}
						onChange={handleRadioChange}
					/>

					<Text
						id={'empty_filter_message'}
						index={index}
						label={__(
							'No filter applied message',
							'wc-ajax-product-filter'
						)}
						description={__(
							'Show a message when no filter is applied. Leave it empty to not show the active filters when no filter is applied.',
							'wc-ajax-product-filter'
						)}
						value={empty_filter_message}
						onChange={handleTextFieldChange}
					/>

					<div className='__form_control'>
						<p>
							A shortcode <code>[wcapf_active_filters]</code> is
							available to show the active filters outside the
							form.
						</p>
					</div>
				</>
			)}

			{'reset-button' === component && (
				<>
					<Checkbox
						id={'show_if_empty'}
						index={index}
						label={__('Always show', 'wc-ajax-product-filter')}
						description={__(
							'Enable this to show the reset button as disabled when no filter is applied.',
							'wc-ajax-product-filter'
						)}
						isChecked={show_if_empty}
						onChange={handleCheckboxChange}
					/>

					<div className='__form_control'>
						<p>
							A shortcode <code>[wcapf_reset_button]</code> is
							available to show the reset button outside the form.
						</p>
					</div>
				</>
			)}

			{'results-count' === component && (
				<>
					<Checkbox
						id={'show_if_empty'}
						index={index}
						label={__(
							'Show conditionally',
							'wc-ajax-product-filter'
						)}
						description={__(
							'Enable this to show the results count only when a filter is applied.',
							'wc-ajax-product-filter'
						)}
						isChecked={show_if_empty}
						onChange={handleCheckboxChange}
					/>

					<div className='__form_control'>
						<p>
							A shortcode <code>[wcapf_results_count]</code> is
							available to show the results count outside the
							form.
						</p>
					</div>
				</>
			)}
		</>
	);
};

export default General;
