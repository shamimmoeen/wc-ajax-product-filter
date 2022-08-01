import { Spinner } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { useFilterForm } from '../../FilterFormContext';
import FormFilters from './FormFilters';

const FilterFormUI = () => {
	const {
		state: { availableFiltersLoading },
	} = useFilterForm();

	return (
		<Fragment>
			{availableFiltersLoading ? <Spinner /> : <FormFilters />}
		</Fragment>
	);
};

export default FilterFormUI;
