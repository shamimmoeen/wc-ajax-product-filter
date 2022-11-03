import { TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import FormUI from './FormUI';
import FilterSettings from './FilterSettings';
import FormSettings from './FormSettings';

const FormNav = () => {
	return (
		<TabPanel
			className='__tab_panel'
			activeClass='active-tab'
			tabs={[
				{
					name: 'form_ui',
					title: __('Form UI', 'wc-ajax-product-filter'),
					className: 'form_ui',
				},
				// {
				// 	name: 'visibility_rules',
				// 	title: __('Visibility Rules', 'wc-ajax-product-filter'),
				// 	className: 'visibility_rules',
				// },
				{
					name: 'settings',
					title: __('Settings', 'wc-ajax-product-filter'),
					className: 'settings',
				},
				// {
				// 	name: 'customize',
				// 	title: __('Customize', 'wc-ajax-product-filter'),
				// 	className: 'customize',
				// },
			]}
		>
			{(tab) => {
				if (tab.name === 'form_ui') {
					return <FormUI />;
				} else if (tab.name === 'filter_settings') {
					return <FilterSettings />;
				} else if (tab.name === 'visibility_rules') {
					return 'Visibility Rules';
				} else if (tab.name === 'settings') {
					return <FormSettings />;
				} else if (tab.name === 'customize') {
					return 'Customize Form';
				}
			}}
		</TabPanel>
	);
};

export default FormNav;
