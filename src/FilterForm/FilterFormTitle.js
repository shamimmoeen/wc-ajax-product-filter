import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useFilterForm } from './FilterFormContext';

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
		<TextControl
			label={__('Filter Form Title', 'wc-ajax-product-filter')}
			value={title}
			onChange={(value) => handleChange(value)}
			onBlur={console.log('onblur')}
			className={'__title'}
		/>
	);
};

export default FilterFormTitle;
