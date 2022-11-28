import { __ } from '@wordpress/i18n';
import ProFeaturesNotice from '../../ProFeaturesNotice';

const SEO = () => {
	return (
		<>
			<ProFeaturesNotice
				message={__(
					'These settings are available only at the pro version.',
					'wc-ajax-product-filter'
				)}
			/>

			<h4>SEO Options</h4>
		</>
	);
};

export default SEO;
