import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import { DiamondIcon } from './SVGIcons';

const navMenus = [
	{
		label: __('Filters', 'wc-ajax-product-filter'),
		id: 'filters',
		href: wcapf_admin_params.filters_page_link,
	},
	{
		label: __('Forms', 'wc-ajax-product-filter'),
		id: 'forms',
		href: wcapf_admin_params.forms_page_link,
	},
	{
		label: __('Settings', 'wc-ajax-product-filter'),
		id: 'settings',
		href: wcapf_admin_params.settings_page_link,
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

			<a href='' className='__upgrade_btn'>
				<Icon icon={DiamondIcon} size={18} />
				{__('Upgrade to PRO', 'wc-ajax-product-filter')}
			</a>
		</div>
	);
};

export default TopBar;
