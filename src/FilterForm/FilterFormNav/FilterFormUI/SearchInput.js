import { __ } from '@wordpress/i18n';

const SearchInput = () => {
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
			}}
			autoFocus
		/>
	);
};

export default SearchInput;
