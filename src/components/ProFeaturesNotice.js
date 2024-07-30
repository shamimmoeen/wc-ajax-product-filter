import { __ } from '@wordpress/i18n';
import { upgradeToProLink } from './utils';

const ProFeaturesNotice = ({ message }) => {
	return (
		<>
			{!WCAPF_PRO && (
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
