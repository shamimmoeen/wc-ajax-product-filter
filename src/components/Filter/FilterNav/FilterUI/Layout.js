import { __ } from '@wordpress/i18n';
import Toggle from '../../../Field/Toggle';
import Select from '../../../Field/Select';

const Layout = () => {
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
			isPro: true,
		},
		{
			label: __('Image', 'wc-ajax-product-filter'),
			value: 'image',
			isPro: true,
		},
	];

	return (
		<div>
			<Toggle
				id={'show_title'}
				label={__('Show Title', 'wc-ajax-product-filter')}
			/>

			<Select
				id={'display_type'}
				label={__('Display Type', 'wc-ajax-product-filter')}
				options={displayTypeOptions}
			/>
		</div>
	);
};

export default Layout;
