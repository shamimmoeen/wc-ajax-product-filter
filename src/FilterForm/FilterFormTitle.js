import { TextControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const FilterFormTitle = () => {
	const [className, setClassName] = useState('');

	return (
		<TextControl
			label={__('Filter Form Title', 'wc-ajax-product-filter')}
			value={className}
			onChange={(value) => setClassName(value)}
			className={'__title'}
		/>
	);
};

export default FilterFormTitle;
