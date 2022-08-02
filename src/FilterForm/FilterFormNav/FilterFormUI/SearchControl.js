import { __ } from '@wordpress/i18n';
import { useFilterForm } from '../../FilterFormContext';

const SearchControl = () => {
	const {
		state: { _availableFilters },
		dispatch,
	} = useFilterForm();

	const limitAvailableFilters = (e) => {
		const keyword = e.target.value;

		// https://stackoverflow.com/a/59675652
		const searchResults = _availableFilters.filter((item) => {
			return item.query.toLowerCase().includes(keyword.toLowerCase());
		});

		dispatch({ type: 'SET_AVAILABLE_FILTERS', payload: searchResults });
	};

	return (
		<input
			type={'text'}
			placeholder={__(
				'Search filter using title, key or id',
				'wc-ajax-product-filter'
			)}
			className='__fz_add_filter_input'
			style={{
				borderWidth: '0 0 1px',
				borderRadius: 0,
				width: '100%',
				marginBottom: '1em',
				backgroundColor: 'transparent',
				padding: '3px 8px',
			}}
			onChange={limitAvailableFilters}
			autoFocus
		/>
	);
};

export default SearchControl;
