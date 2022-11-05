import { TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import FormUI from './FormUI';
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
				{
					name: 'settings',
					title: __('Settings', 'wc-ajax-product-filter'),
					className: 'settings',
				},
			]}
		>
			{(tab) => {
				if (tab.name === 'form_ui') {
					return <FormUI />;
				} else if (tab.name === 'settings') {
					return <FormSettings />;
				}
			}}
		</TabPanel>
	);
};

export default FormNav;
