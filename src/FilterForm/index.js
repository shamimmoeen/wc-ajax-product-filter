import { Fragment, useEffect } from '@wordpress/element';
import FilterFormSettings from './FilterFormSettings';
import FilterFormPreview from './FilterFormPreview';
import { useFilterForm } from './FilterFormContext';
import axios from 'axios';
import FilterFormSaveButton from './FilterFormSaveButton';
import Notifications from './Notifications';

const FilterForm = () => {
	const { dispatch } = useFilterForm();

	function getAvailableFilters() {
		const data = {
			action: 'get_available_filters',
		};

		return axios.get(wcapf_admin_params.ajaxurl, {
			params: data,
		});
	}

	function getFormFilters() {
		const data = {
			action: 'get_filter_form_data',
		};

		return axios.get(wcapf_admin_params.ajaxurl, {
			params: data,
		});
	}

	useEffect(() => {
		Promise.all([getAvailableFilters(), getFormFilters()])
			.then((results) => {
				const resAvailableFilters = results[0];
				const resFormFilters = results[1];

				const {
					data: { data: availableFilters },
				} = resAvailableFilters;

				const {
					data: { data: filterFormData },
				} = resFormFilters;

				const postTitle = filterFormData['post_title'];
				const formFilters = filterFormData['filters_data'];
				const formFilterIds = [];

				if (formFilters.length) {
					formFilters.map((filter) => formFilterIds.push(filter.id));
				}

				dispatch({
					type: 'UPDATE_FORM_FILTERS',
					payload: formFilters,
				});

				dispatch({
					type: 'SET_TITLE',
					payload: postTitle,
				});

				availableFilters.map((filter) => {
					if (formFilterIds.includes(filter.id)) {
						filter.status = 'added';
					}

					return filter;
				});

				dispatch({
					type: 'SET_BACKUP_AVAILABLE_FILTERS',
					payload: availableFilters,
				});

				dispatch({
					type: 'SET_AVAILABLE_FILTERS',
					payload: availableFilters,
				});

				dispatch({
					type: 'SET_AVAILABLE_FILTERS_LOADING',
					payload: false,
				});
			})
			.catch((err) => console.log(err));
	}, []);

	return (
		<Fragment>
			<FilterFormSettings />
			<FilterFormPreview />
			<Notifications />
			<FilterFormSaveButton />
		</Fragment>
	);
};

export default FilterForm;
