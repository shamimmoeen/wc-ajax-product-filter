import { __ } from '@wordpress/i18n';
import { useSettings } from '../SettingsContext';
import Checkbox from '../../Field/Checkbox';
import useSettingsData from '../useSettingsData';
import Select from '../../Field/Select';
import ColorInput from '../../Field/ColorInput';

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

const General = () => {
	const { state, dispatch } = useSettings();
	const { handleCheckboxChange, handleTextFieldChange, handleSelectChange } =
		useSettingsData(state, dispatch);

	const {
		settings: {
			filter_relationships,
			update_count,
			disable_empty_options,
			remove_empty_filters,
			disable_ajax,
			primary_color,
		},
	} = state;

	const filterRelationship = filterRelationshipOptions.find(
		(option) => option.value === filter_relationships
	);

	const handlePrimaryColorChange = (value) => {
		handleTextFieldChange(value, 'primary_color');
	};

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

			<Checkbox
				id={'disable_empty_options'}
				label={__('Disable empty options', 'wc-ajax-product-filter')}
				description={__(
					'By default we remove the options that will return zero results. Enable this if you want to show them as disabled.',
					'wc-ajax-product-filter'
				)}
				isChecked={disable_empty_options}
				onChange={handleCheckboxChange}
				isPro
			/>

			<Checkbox
				id={'remove_empty_filters'}
				label={__('Remove empty filters', 'wc-ajax-product-filter')}
				description={__(
					"Whether to remove the filters that don't have any options.",
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
					'Enable this if you want to disable filtering via ajax.',
					'wc-ajax-product-filter'
				)}
				isChecked={disable_ajax}
				onChange={handleCheckboxChange}
			/>

			{/* <ColorInput
				label={__('Primary Color', 'wc-ajax-product-filter')}
				description={__(
					'Set a primary color according to your theme.',
					'wc-ajax-product-filter'
				)}
				value={primary_color}
				onChange={handlePrimaryColorChange}
				renderAsFormField
			/> */}
		</>
	);
};

export default General;
