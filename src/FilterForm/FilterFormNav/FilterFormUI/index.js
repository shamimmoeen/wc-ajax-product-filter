import { Spinner } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import FormFilters from './FormFilters';

const FilterFormUI = () => {
	const loading = true;

	return (
		<Fragment>
			{loading ? (
				<Spinner />
			) : (
				<FormFilters
					availableFilters={availableFilters}
					setAvailableFilters={setAvailableFilters}
				/>
			)}
		</Fragment>
	);
};

export default FilterFormUI;
