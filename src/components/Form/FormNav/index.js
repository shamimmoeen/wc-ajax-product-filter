import { __ } from '@wordpress/i18n';
import { TabPanel } from '@wordpress/components';
import { useForm } from '../FormContext';
import { isEmpty } from 'lodash';
import FormUI from './FormUI';
import FormSettings from './FormSettings';

const FormNav = () => {
	const {
		state: { availableFilters },
	} = useForm();

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
				if (isEmpty(availableFilters)) {
					return (
						<p className='__no_filters_found __description'>
							{__(
								'No filters found, create some filters before starting the form.',
								'wc-ajax-product-filter'
							)}
						</p>
					);
				} else {
					if (tab.name === 'form_ui') {
						return <FormUI />;
					} else if (tab.name === 'settings') {
						return <FormSettings />;
					}
				}
			}}
		</TabPanel>
	);
};

export default FormNav;
