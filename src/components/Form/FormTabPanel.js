import { __ } from '@wordpress/i18n';
import { Spinner, TabPanel } from '@wordpress/components';
import { useForm } from './FormContext';
import FormFilters from './FormFilters';
import FormSettings from './FormSettings';

const FormTabPanel = () => {
	const {
		state: { isLoading },
	} = useForm();

	return (
		<TabPanel
			className='__tab_panel __form_tab_panel'
			activeClass='active-tab'
			tabs={[
				{
					name: 'filters',
					title: __('Filters', 'wc-ajax-product-filter'),
					className: 'filters',
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
				if (isLoading) {
					return (
						<div className='__loader'>
							<Spinner />
						</div>
					);
				} else {
					if (tab.name === 'filters') {
						return <FormFilters />;
					} else if (tab.name === 'settings') {
						return (
							<div className='__form_settings'>
								<FormSettings />
							</div>
						);
					}
				}
			}}
		</TabPanel>
	);
};

export default FormTabPanel;
