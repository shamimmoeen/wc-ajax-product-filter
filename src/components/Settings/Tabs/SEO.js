import { __ } from '@wordpress/i18n';
import Checkbox from '../../Field/Checkbox';
import Select from '../../Field/Select';
import ProFeaturesNotice from '../../ProFeaturesNotice';
import { foundProVersion } from '../../utils';

const WCAPF_PRO = foundProVersion();

const SEO = () => {
	return (
		<>
			<ProFeaturesNotice
				message={__(
					'Upgrade to PRO to unlock all SEO features.',
					'wc-ajax-product-filter'
				)}
			/>

			<Select
				id={'scroll_window_for'}
				label={__('Add "robots" Meta Tag', 'wc-ajax-product-filter')}
				description={__(
					'Add "robots" meta tag in head tag of HTML page if filters have been activated.',
					'wc-ajax-product-filter'
				)}
				// value={scrollWindowFor}
				options={[
					{ label: 'Disabled', value: 'disabled' },
					{ label: 'Disabled', value: 'disabled' },
				]}
				// onChange={(selected) =>
				// 	handleSelectChange(selected, 'scroll_window_for')
				// }
				renderAsFormField
			/>

			<Checkbox
				id={'loading_animation'}
				label={__(
					'Add "nofollow" to filter anchors',
					'wc-ajax-product-filter'
				)}
				description={__(
					'Whether to show an animation while the results are fetching.',
					'wc-ajax-product-filter'
				)}
				// isChecked={loading_animation}
				// onChange={handleCheckboxChange}
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
