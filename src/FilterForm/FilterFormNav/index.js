import { TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import FilterFormUI from './FilterFormUI';
import FilterSettings from './FilterSettings';
import FormSettings from './FormSettings';

const onSelect = (tabName) => {
	console.log('Selecting tab', tabName);
};

const FilterFormNav = () => {
	return (
		<TabPanel
			className='my-tab-panel'
			activeClass='active-tab'
			onSelect={onSelect}
			tabs={[
				{
					name: 'filter_form_ui',
					title: __('Filter Form UI', 'wc-ajax-product-filter'),
					className: 'filter_form_ui',
				},
				{
					name: 'filter_settings',
					title: __('Filter Settings', 'wc-ajax-product-filter'),
					className: 'filter_settings',
				},
				{
					name: 'form_settings',
					title: __('Form Settings', 'wc-ajax-product-filter'),
					className: 'form_settings',
				},
			]}
		>
			{(tab) => {
				if (tab.name === 'filter_form_ui') {
					return <FilterFormUI />;
				} else if (tab.name === 'filter_settings') {
					return <FilterSettings />;
				} else if (tab.name === 'form_settings') {
					return <FormSettings />;
				}
			}}
		</TabPanel>
	);
};

export default FilterFormNav;
