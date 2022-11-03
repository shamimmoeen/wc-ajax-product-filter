import { __ } from '@wordpress/i18n';
import { useFilterForm } from './FormContext';
import Title from '../Title';

const FilterFormTitle = () => {
	const {
		state: { title },
		dispatch,
	} = useFilterForm();

	const handleChange = (value) => {
		dispatch({ type: 'SET_TITLE', payload: value });
		dispatch({ type: 'SET_DIRTY' });
	};

	return (
		<Title
			label={__('Filter Form Title', 'wc-ajax-product-filter')}
			value={title}
			handleChange={handleChange}
		/>
	);
};

export default FilterFormTitle;
