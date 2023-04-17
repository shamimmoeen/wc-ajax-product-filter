import { __ } from '@wordpress/i18n';
import { foundProVersion, upgradeToProLink } from './utils';

const ProFeaturesNotice = ({ message }) => {
	return (
		<>
			{!foundProVersion() && (
				<div className='__pro_settings'>
					<p>
						{message}
						{` `}
						<a href={upgradeToProLink()}>
							{__('Upgrade', 'wc-ajax-product-filter')}
						</a>
					</p>
				</div>
			)}
		</>
	);
};

export default ProFeaturesNotice;
