import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import { DiamondIcon } from './SVGIcons';
import { foundProVersion, pluginVersion, upgradeToProLink } from './utils';

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
			<div className='__navbar'>
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

			<div className='__cta'>
				{!foundProVersion() && (
					<a
						href={upgradeToProLink()}
						className='__upgrade_btn'
						target='_blank'
					>
						<Icon icon={DiamondIcon} size={18} />
						{__('Upgrade to PRO', 'wc-ajax-product-filter')}
					</a>
				)}

				<div className='__plan'>
					<div>{__('You are on the', 'wc-ajax-product-filter')}</div>
					<div>
						{foundProVersion() ? __('PRO Plan') : __('FREE Plan')}
					</div>
				</div>

				<div className='__version'>
					<div>{__('Version', 'wc-ajax-product-filter')}</div>
					<div>{pluginVersion()}</div>
				</div>
			</div>
		</div>
	);
};

export default TopBar;
