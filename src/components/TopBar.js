import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import { Link, NavLink } from 'react-router-dom';
import { DiamondIcon } from './SVGIcons';
import { pluginVersion, upgradeToProLink } from './utils';
import V4MigrationNotice from './V4MigrationNotice';
import ReviewNotices from './ReviewNotices';

const TopBar = ({ view }) => {
	const url = window.location.hash;
	console.log(url);

	return (
		<>
			<div className='__top_bar'>
				<div className='__navbar'>
					<h2>
						<Icon icon={'filter'} className='__icon' />
						WCAPF - WooCommerce Ajax Product Filter
					</h2>

					{wcapf_admin_params.pages.map(({ path, title }, index) => {
						const isActive =
							'#' + path === url ||
							('/' === path && url.startsWith('#/form/')) ||
							('' === url && '/' === path)
								? 'is-active'
								: '';

						if (0 === index) {
							return (
								<NavLink
									key={index}
									to={path}
									className={isActive}
								>
									{__('Forms', 'wc-ajax-product-filter')}
								</NavLink>
							);
						} else {
							return (
								<Link
									key={index}
									to={path}
									className={isActive}
								>
									{title}
								</Link>
							);
						}
					})}
				</div>

				<div className='__cta'>
					{!WCAPF_PRO && (
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
							{WCAPF_PRO ? __('Pro Plan') : __('Free Plan')}
						</div>
					</div>

					<div className='__version'>
						<div>{__('Version', 'wc-ajax-product-filter')}</div>
						<div>{pluginVersion()}</div>
					</div>
				</div>
			</div>

			<V4MigrationNotice />

			{'form' !== view && <ReviewNotices />}
		</>
	);
};

export default TopBar;
