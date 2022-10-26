import { __ } from '@wordpress/i18n';
import { foundProVersion, upgradeToProLink } from './utils';

const ProFeaturesNotice = () => {
	if (!foundProVersion()) {
		return (
			<div className='__pro_settings'>
				<p>
					{__(
						'These settings are available only at the pro version.',
						'wc-ajax-product-filter'
					)}
					{` `}
					<a href={upgradeToProLink()} target='_blank'>
						{__('Upgrade', 'wc-ajax-product-filter')}
					</a>
				</p>
			</div>
		);
	}
};

export default ProFeaturesNotice;
