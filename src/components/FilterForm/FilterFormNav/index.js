import { Flex, Spinner, TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useFilterForm } from '../FilterFormContext';
import FilterFormUI from './FilterFormUI';
import FilterSettings from './FilterSettings';
import FormSettings from './FormSettings';

const FilterFormNav = () => {
	const {
		state: { availableFiltersLoading },
	} = useFilterForm();

	return (
		<TabPanel
			className='__tab_panel'
			activeClass='active-tab'
			tabs={[
				{
					name: 'filter_form_ui',
					title: __('Filter Form UI', 'wc-ajax-product-filter'),
					className: 'filter_form_ui',
				},
				{
					name: 'visibility_rules',
					title: __('Visibility Rules', 'wc-ajax-product-filter'),
					className: 'visibility_rules',
				},
				{
					name: 'settings',
					title: __('Settings', 'wc-ajax-product-filter'),
					className: 'settings',
				},
				{
					name: 'customize',
					title: __('Customize', 'wc-ajax-product-filter'),
					className: 'customize',
				},
			]}
		>
			{(tab) => {
				if (availableFiltersLoading) {
					return (
						<Flex justify={'center'} style={{ margin: '2em 0' }}>
							<Spinner />
						</Flex>
					);
				} else {
					if (tab.name === 'filter_form_ui') {
						return <FilterFormUI />;
					} else if (tab.name === 'filter_settings') {
						return <FilterSettings />;
					} else if (tab.name === 'visibility_rules') {
						return 'Visbility Ruels';
					} else if (tab.name === 'settings') {
						return <FormSettings />;
					} else if (tab.name === 'customize') {
						return 'Customize Form';
					}
				}
			}}
		</TabPanel>
	);
};

export default FilterFormNav;
