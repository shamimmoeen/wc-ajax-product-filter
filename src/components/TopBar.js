import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';

const TopBar = () => {
	return (
		<div className='__top_bar'>
			<h2>
				<Icon icon={'filter'} className='__icon' />
				WC Ajax Product Filter
			</h2>

			<div className='__buttons'>
				<a href='#'>{__('Filters', 'wc-ajax-product-filter')}</a>
				<a href='#'>{__('Filter Forms', 'wc-ajax-product-filter')}</a>
				<a href='#'>{__('Settings', 'wc-ajax-product-filter')}</a>
			</div>
		</div>
	);
};

export default TopBar;
