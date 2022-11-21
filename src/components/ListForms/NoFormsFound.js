import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import { PlusIcon } from '../SVGIcons';

// TODO: Change the wrapper className.
const NoFormsFound = () => {
	return (
		<div className='__import_sample_filters'>
			<Icon icon={PlusIcon} size={40} fill='#babbbc' />

			<h3>
				{__("You don't have any forms yet.", 'wc-ajax-product-filter')}
			</h3>

			<p className='__description'>
				{__(
					'Click on the add new button to create your first form.',
					'wc-ajax-product-filter'
				)}
			</p>
		</div>
	);
};

export default NoFormsFound;
