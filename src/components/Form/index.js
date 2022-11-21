import { useEffect } from '@wordpress/element';
import { useForm } from './FormContext';
import axios from 'axios';
import { merge } from 'lodash';
import TopBar from '../TopBar';
import FormTitle from './FormTitle';
import FormTabPanel from './FormTabPanel';
import FormPreview from './FormPreview';
import Notifications from '../Notifications';
import { getAvailableFilters } from '../utils';
import { defaultFormSettings } from '../utilsForForm';

const Form = () => {
	const { dispatch } = useForm();

	const getFormData = () => {
		const query = new URL(window.location.href);
		const id = query.searchParams.get('id');

		const data = {
			action: 'wcapf_get_form_data',
			post_id: id,
		};

		return axios.get(wcapf_admin_params.ajaxurl, {
			params: data,
		});
	};

	useEffect(() => {
		Promise.all([getAvailableFilters(), getFormData()])
			.then((results) => {
				const resAvailableFilters = results[0];
				const resFormFilters = results[1];

				const {
					data: { data: availableFilters },
				} = resAvailableFilters;

				const {
					data: { data: formData },
				} = resFormFilters;

				const formFilters = formData['form_filters'];
				const formSettings = formData['form_settings'];

				dispatch({
					type: 'SET_FORM_FILTERS',
					payload: formFilters,
				});

				dispatch({
					type: 'SET_FORM_SETTINGS',
					payload: merge(defaultFormSettings(), formSettings),
				});

				const _availableFilters = availableFilters.map((item) => {
					if (formFilters.find((filter) => filter.id === item.id)) {
						return { ...item, status: 'added' };
					}

					return item;
				});

				dispatch({
					type: 'SET_AVAILABLE_FILTERS',
					payload: _availableFilters,
				});

				dispatch({ type: 'SET_LOADING', payload: false });
			})
			.catch((err) => {
				// TODO: Maybe show a snackbar notice.

				console.log(err);

				dispatch({ type: 'SET_LOADING', payload: false });
			});
	}, []);

	return (
		<>
			<div className='__wcapf_admin'>
				<TopBar view={'form'} />

				<div className='__edit_filter'>
					<div className='__edit_filter_from'>
						<div className='__content'>
							<FormTitle />
							<FormTabPanel />
						</div>
					</div>

					<FormPreview />
				</div>

				<Notifications />
			</div>
		</>
	);
};

export default Form;
