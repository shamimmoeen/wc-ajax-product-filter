import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';

const navMenus = [
	{
		label: __('Filters', 'wc-ajax-product-filter'),
		id: 'filters',
		href: '#',
	},
	{
		label: __('Filter Forms', 'wc-ajax-product-filter'),
		id: 'filter-forms',
		href: '#',
	},
	{
		label: __('Settings', 'wc-ajax-product-filter'),
		id: 'settings',
		href: '#',
	},
];

const TopBar = ({ view }) => {
	return (
		<div className='__top_bar'>
			<h2>
				<Icon icon={'filter'} className='__icon' />
				WC Ajax Product Filter
			</h2>

			{navMenus.map((menu) => {
				const menuClass = view === menu.id ? 'is-active' : '';

				return (
					<a className={menuClass} href={menu.href} key={menu.id}>
						{menu.label}
					</a>
				);
			})}
		</div>
	);
};

export default TopBar;
