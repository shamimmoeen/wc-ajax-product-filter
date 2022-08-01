import { Fragment, useEffect } from '@wordpress/element';
import FilterFormSettings from './FilterFormSettings';
import FilterFormPreview from './FilterFormPreview';
import { useFilterForm } from './FilterFormContext';
import axios from 'axios';
import FilterFormSaveButton from './FilterFormSaveButton';

const FilterForm = () => {
	const { dispatch } = useFilterForm();

	useEffect(async () => {
		const data = {
			action: 'get_available_filters',
		};

		try {
			const fetchFilters = await axios.get(wcapf_admin_params.ajaxurl, {
				params: data,
			});

			const response = fetchFilters.data;

			dispatch({
				type: 'SET_BACKUP_AVAILABLE_FILTERS',
				payload: response.data,
			});
			dispatch({ type: 'SET_AVAILABLE_FILTERS', payload: response.data });
			dispatch({ type: 'SET_AVAILABLE_FILTERS_LOADING', payload: false });
		} catch (err) {
			console.log(err.message);
		}
	}, []);

	return (
		<Fragment>
			<FilterFormSettings />
			<FilterFormPreview />
			<FilterFormSaveButton />
		</Fragment>
	);
};

export default FilterForm;
