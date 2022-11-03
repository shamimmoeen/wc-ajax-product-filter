import { Spinner } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { useForm } from './FormContext';
import axios from 'axios';
import TopBar from '../TopBar';
import FormTitle from './FormTitle';
import FormNav from './FormNav';
import FormPreview from './FormPreview';
import Notifications from '../Notifications';

const Form = () => {
	const {
		state: { isLoading },
		dispatch,
	} = useForm();

	const getAvailableFilters = () => {
		const data = {
			action: 'wcapf_get_available_filters',
		};

		return axios.get(wcapf_admin_params.ajaxurl, {
			params: data,
		});
	};

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

				dispatch({
					type: 'SET_TITLE',
					payload: formData['post_title'],
				});

				const formFilters = formData['form_filters'];

				dispatch({
					type: 'SET_FORM_FILTERS',
					payload: formData['form_filters'],
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
				<TopBar view={'forms'} />

				<div className='__wcapf_layout'>
					{isLoading ? (
						<div className='__post_data_fetching'>
							<Spinner />
						</div>
					) : (
						<div className='__main __edit_filter'>
							<div className='__edit_filter_from'>
								<div className='__content'>
									<FormTitle />
									<FormNav />
								</div>
							</div>

							<div className='__sidebar'>
								<FormPreview />
							</div>
						</div>
					)}
				</div>

				<Notifications />
			</div>
		</>
	);
};

export default Form;
