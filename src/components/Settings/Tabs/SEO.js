import { __ } from '@wordpress/i18n';
import ProFeaturesNotice from '../../ProFeaturesNotice';
import { foundProVersion } from '../../utils';

const WCAPF_PRO = foundProVersion();

const SEO = () => {
	return (
		<>
			<ProFeaturesNotice
				message={__(
					'These settings are available only at the PRO version.',
					'wc-ajax-product-filter'
				)}
			/>

			{WCAPF_PRO && (
				<>
					<h4>{__('Indexing Filters', 'wc-ajax-product-filter')}</h4>

					<p>
						Check filters, pages of which should be available for
						indexing by search engines. Besides this you will also
						need to create SEO Rules to make filter pages available
						for indexing.
					</p>

					<h4>{__('Indexing Depth', 'wc-ajax-product-filter')}</h4>

					<p>
						By default all filtering results pages are closed from
						indexing. These settings determines maximum number of
						filters (only filters, not archive page) will be indexed
						by Search Engines.
					</p>
				</>
			)}
		</>
	);
};

export default SEO;
