import { Fragment } from '@wordpress/element';
import FilterFormSettings from './FilterFormSettings';
import FilterFormPreview from './FilterFormPreview';

function FilterForm() {
	return (
		<Fragment>
			<FilterFormSettings />
			<FilterFormPreview />
		</Fragment>
	);
}

export default FilterForm;
