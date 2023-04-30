import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import { useForm } from './FormContext';
import FormFilters from './FormFilters';
import FormSettings from './FormSettings';
import CustomTabPanel from '../CustomTabPanel';

const FormTabPanel = () => {
	const { state, dispatch } = useForm();

	const { isLoading, currentTab, accordionStates } = state;

	useEffect(() => {
		if ('settings' === currentTab) {
			const newStates = accordionStates.map((_isExpanded) => {
				if (_isExpanded) {
					return false;
				}

				return _isExpanded;
			});

			dispatch({ type: 'SET_ACCORDION_STATES', payload: newStates });
		}
	}, [currentTab]);

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
