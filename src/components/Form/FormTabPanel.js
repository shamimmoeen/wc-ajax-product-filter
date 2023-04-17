import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';
import { useForm } from './FormContext';
import FormFilters from './FormFilters';
import FormSettings from './FormSettings';
import CustomTabPanel from '../CustomTabPanel';

const FormTabPanel = () => {
	const { state, dispatch } = useForm();

	const { isLoading } = state;

	return (
		<CustomTabPanel
			state={state}
			dispatch={dispatch}
			className='__tab_panel __form_tab_panel'
			activeClass='active-tab'
			tabs={[
				{
					name: 'filters',
					title: __('Filters', 'wc-ajax-product-filter'),
				},
				{
					name: 'settings',
					title: __('Settings', 'wc-ajax-product-filter'),
				},
			]}
		>
			{({ name }) => {
				if (isLoading) {
					return (
						<div className='__loader'>
							<Spinner />
						</div>
					);
				} else {
					if (name === 'filters') {
						return <FormFilters />;
					} else if (name === 'settings') {
						return (
							<div className='__form_settings'>
								<FormSettings />
							</div>
						);
					}
				}
			}}
		</CustomTabPanel>
	);
};

export default FormTabPanel;
