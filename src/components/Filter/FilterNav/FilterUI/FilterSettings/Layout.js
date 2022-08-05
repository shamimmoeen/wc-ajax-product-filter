import { __ } from '@wordpress/i18n';
import Toggle from '../../../../Field/Toggle';
import Select from '../../../../Field/Select';
import Text from '../../../../Field/Text';
import { useFilter } from '../../../FilterContext';

const Layout = () => {
	const {
		state: { filterType },
	} = useFilter();

	const displayTypeOptions = [
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

	return (
		<div>
			<Select
				id={'display_type'}
				label={__('Display Type', 'wc-ajax-product-filter')}
				options={displayTypeOptions}
			/>
		</div>
	);
};

export default Layout;
