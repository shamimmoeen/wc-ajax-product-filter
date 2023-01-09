import { __ } from '@wordpress/i18n';
import Checkbox from '../../Field/Checkbox';
import Select from '../../Field/Select';
import ProFeaturesNotice from '../../ProFeaturesNotice';
import { foundProVersion } from '../../utils';
import { useSettings } from '../SettingsContext';
import useSettingsData from '../useSettingsData';

const WCAPF_PRO = foundProVersion();

const SEO = () => {
	const { state, dispatch } = useSettings();
	const { handleCheckboxChange } = useSettingsData(state, dispatch);

	const {
		settings: { use_term_slug, use_author_username, update_title_tag },
	} = state;

	return (
		<>
			<ProFeaturesNotice
				message={__(
					'Upgrade to PRO to unlock all SEO features.',
					'wc-ajax-product-filter'
				)}
			/>

			<Checkbox
				id={'use_term_slug'}
				label={__('Use term slug', 'wc-ajax-product-filter')}
				description={__(
					'Whether to use term slug instead of id as the option value.',
					'wc-ajax-product-filter'
				)}
				isChecked={use_term_slug}
				onChange={handleCheckboxChange}
			/>

			<Checkbox
				id={'update_title_tag'}
				label={__('Update title tag', 'wc-ajax-product-filter')}
				description={__(
					'Determines if we update the title tag.',
					'wc-ajax-product-filter'
				)}
				isChecked={update_title_tag}
				onChange={handleCheckboxChange}
			/>

			{/* <Select
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
			/> */}

			{/* {WCAPF_PRO && (
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
			)} */}
		</>
	);
};

export default SEO;
