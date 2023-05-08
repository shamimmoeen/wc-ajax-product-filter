import { __ } from '@wordpress/i18n';
import { useSettings } from '../SettingsContext';
import Checkbox from '../../Field/Checkbox';
import useSettingsData from '../useSettingsData';
import Select from '../../Field/Select';
import Radio from '../../Field/Radio';

const filterRelationshipOptions = [
	{
		label: __('AND', 'wc-ajax-product-filter'),
		value: 'and',
	},
	{
		label: __('OR', 'wc-ajax-product-filter'),
		value: 'or',
	},
];

const removeEmptyOptions = [
	{
		label: __('Always show', 'wc-ajax-product-filter'),
		value: 'show',
	},
	{
		label: __('Never show', 'wc-ajax-product-filter'),
		value: 'remove',
	},
	{
		label: __('Show and disable selection', 'wc-ajax-product-filter'),
		value: 'disable',
		isPro: true,
	},
];

const General = () => {
	const { state, dispatch } = useSettings();
	const { handleCheckboxChange, handleRadioChange, handleSelectChange } =
		useSettingsData(state, dispatch);

	const {
		settings: {
			filter_relationships,
			update_count,
			remove_empty,
			remove_empty_filters,
			disable_ajax,
		},
	} = state;

	const filterRelationship = filterRelationshipOptions.find(
		(option) => option.value === filter_relationships
	);

	return (
		<>
			<Select
				id={'filter_relationships'}
				label={__('Filter Relationships', 'wc-ajax-product-filter')}
				description={__(
					'The relationship between filters. AND - products shown will match all filters, OR - products shown will match any of the filters.',
					'wc-ajax-product-filter'
				)}
				value={filterRelationship}
				onChange={handleSelectChange}
				options={filterRelationshipOptions}
				renderAsFormField
			/>

			<Checkbox
				id={'update_count'}
				label={__('Dynamic Product Count', 'wc-ajax-product-filter')}
				description={__(
					'Whether to update the product count number according to the applied filters.',
					'wc-ajax-product-filter'
				)}
				isChecked={update_count}
				onChange={handleCheckboxChange}
			/>

			<Radio
				id={'remove_empty'}
				label={__(
					'Options with zero products',
					'wc-ajax-product-filter'
				)}
				description={__(
					'Determines what we do with the options with zero products.',
					'wc-ajax-product-filter'
				)}
				options={removeEmptyOptions}
				value={remove_empty}
				onChange={handleRadioChange}
			/>

			<Checkbox
				id={'remove_empty_filters'}
				label={__('Hide empty filters', 'wc-ajax-product-filter')}
				description={__(
					"Whether to hide the filters that don't have any options.",
					'wc-ajax-product-filter'
				)}
				isChecked={remove_empty_filters}
				onChange={handleCheckboxChange}
				isPro
			/>

			<Checkbox
				id={'disable_ajax'}
				label={__('Disable Ajax', 'wc-ajax-product-filter')}
				description={__(
					'Enable this if you want to disable filtering via Ajax.',
					'wc-ajax-product-filter'
				)}
				isChecked={disable_ajax}
				onChange={handleCheckboxChange}
			/>
		</>
	);
};

export default General;
