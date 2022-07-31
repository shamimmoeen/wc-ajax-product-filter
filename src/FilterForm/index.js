import { Fragment, useState, useEffect } from '@wordpress/element';
import FilterFormSettings from './FilterFormSettings';
import FilterFormPreview from './FilterFormPreview';
import axios from 'axios';

function FilterForm() {
	const [availableFiltersLoading, setAvailableFiltersLoading] =
		useState(true);

	const [availableFilters, setAvailableFilters] = useState([]);

	useEffect(async () => {
		const data = {
			action: 'get_available_filters',
		};

		const fetchFilters = await axios.get(wcapf_admin_params.ajaxurl, {
			params: data,
		});

		const response = fetchFilters.data;

		setAvailableFilters(response.data);
		setAvailableFiltersLoading(false);
	}, []);

	return (
		<Fragment>
			<FilterFormSettings />
			<FilterFormPreview />
		</Fragment>
	);
}

export default FilterForm;
