import { __ } from '@wordpress/i18n';
import { useFilter } from './FilterContext';
import Title from '../Title';

const FilterTitle = () => {
	const {
		state: { title },
		dispatch,
	} = useFilter();

	const handleChange = (value) => {
		dispatch({ type: 'SET_TITLE', payload: value });
		dispatch({ type: 'SET_DIRTY' });
	};

	return (
		<Title
			label={__('Filter Title', 'wc-ajax-product-filter')}
			value={title}
			handleChange={handleChange}
		/>
	);
};

export default FilterTitle;
