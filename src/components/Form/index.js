import { useEffect } from '@wordpress/element';
import { useForm } from './FormContext';
import axios from 'axios';
import { merge } from 'lodash';
import TopBar from '../TopBar';
import FormTitle from './FormTitle';
import FormTabPanel from './FormTabPanel';
import FormPreview from './FormPreview';
import Notifications from '../Notifications';
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
		getFormData()
			.then((response) => {
				const {
					data: { data: formData },
				} = response;

				const filterKeys = formData['filter_keys'];
				const formFilters = formData['form_filters'];
				const formSettings = formData['form_settings'];

				dispatch({
					type: 'SET_FILTER_KEYS',
					payload: filterKeys,
				});

				// The accordion states of form filters.
				const accordionStates = [];

				// TODO: Remove commented codes.
				for (let index = 0; index < formFilters.length; index++) {
					// if (index === 0) {
					// 	accordionStates[index] = true;
					// } else {
					// 	accordionStates[index] = false;
					// }
					accordionStates[index] = false;
				}

				dispatch({
					type: 'SET_ACCORDION_STATES',
					payload: accordionStates,
				});

				dispatch({
					type: 'SET_FORM_FILTERS',
					payload: formFilters,
				});

				dispatch({
					type: 'SET_FORM_SETTINGS',
					payload: merge(defaultFormSettings(), formSettings),
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
