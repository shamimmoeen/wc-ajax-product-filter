import { useState } from '@wordpress/element';
import { getAvailableFilters } from '../../utils';
import FormFilters from './FormFilters';

const FilterFormUI = () => {
	const [availableFilters, setAvailableFilters] =
		useState(getAvailableFilters);

	return (
		<FormFilters
			availableFilters={availableFilters}
			setAvailableFilters={setAvailableFilters}
		/>
	);
};

export default FilterFormUI;
