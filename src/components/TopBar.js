import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import { DiamondIcon } from './SVGIcons';
import {
	foundProVersion,
	getFormsPageLink,
	// getSeoRulesPageLink,
	getSettingsPageLink,
	pluginVersion,
	upgradeToProLink,
} from './utils';
import V4MigrationNotice from './V4MigrationNotice';

const navMenus = [
	{
		label: __('Forms', 'wc-ajax-product-filter'),
		id: 'forms',
		href: getFormsPageLink(),
	},
	// {
	// 	label: __('SEO Rules', 'wc-ajax-product-filter'),
	// 	id: 'seo-rules',
	// 	href: getSeoRulesPageLink(),
	// },
	{
		label: __('Settings', 'wc-ajax-product-filter'),
		id: 'settings',
		href: getSettingsPageLink(),
	},
];

const TopBar = ({ view }) => {
	return (
		<>
			<div className='__top_bar'>
				<div className='__navbar'>
					<h2>
						<Icon icon={'filter'} className='__icon' />
						WCAPF - WooCommerce Ajax Product Filter
					</h2>

					{navMenus.map((menu) => {
						const _view = 'form' === view ? 'forms' : view;
						const menuClass = _view === menu.id ? 'is-active' : '';

						return (
							<a
								className={menuClass}
								href={menu.href}
								key={menu.id}
							>
								{menu.label}
							</a>
						);
					})}
				</div>

				<div className='__cta'>
					{!foundProVersion() && (
						<a
							target='_blank'
							href={upgradeToProLink()}
							className='__upgrade_btn'
						>
							<Icon icon={DiamondIcon} size={18} />
							{__('Upgrade to Pro', 'wc-ajax-product-filter')}
						</a>
					)}

					<div className='__plan'>
						<div>
							{__('You are on the', 'wc-ajax-product-filter')}
						</div>
						<div>
							{foundProVersion()
								? __('Pro Plan')
								: __('Free Plan')}
						</div>
					</div>

					<div className='__version'>
						<div>{__('Version', 'wc-ajax-product-filter')}</div>
						<div>{pluginVersion()}</div>
					</div>
				</div>
			</div>

			<V4MigrationNotice />
		</>
	);
};

export default TopBar;
