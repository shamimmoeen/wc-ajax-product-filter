import { __, sprintf } from '@wordpress/i18n';
import Text from '../../Field/Text';
import { useSettings } from '../SettingsContext';
import useSettingsData from '../useSettingsData';

const Phrases = () => {
	const { state, dispatch } = useSettings();
	const { handleTextFieldChange } = useSettingsData(state, dispatch);

	const resultsCountPlaceholder = '%d';

	const resultsCountMarkupDescription = sprintf(
		/* translators: %1$s is a literal placeholder character ("%d") shown as example text to the user. */
		__(
			'Custom markup for the results count. Use <code>%1$s</code> as the number placeholder. Separate singular and plural with <code>|</code>, e.g. <code>%1$s product found|%1$s products found</code>.',
			'wc-ajax-product-filter'
		),
		resultsCountPlaceholder
	);

	const {
		settings: {
			keyword_filter_placeholder,
			keyword_filter_prefix,
			search_field_default_placeholder,
			no_results_text,
			combobox_no_options_text,
			empty_filter_text,
			show_more_btn_label,
			show_less_btn_label,
			clear_button_label,
			clear_all_button_label,
			reset_button_label,
			results_count_markup,
			sort_by_prefix,
			per_page_prefix,
		},
	} = state;

	return (
		<>
			<Text
				id={'keyword_filter_placeholder'}
				label={__(
					'Keyword filter placeholder',
					'wc-ajax-product-filter'
				)}
				description={__(
					'Placeholder text shown inside the keyword filter input.',
					'wc-ajax-product-filter'
				)}
				value={keyword_filter_placeholder}
				onChange={handleTextFieldChange}
			/>

			<Text
				id={'keyword_filter_prefix'}
				label={__(
					'Keyword filter prefix',
					'wc-ajax-product-filter'
				)}
				description={__(
					'Text shown before the entered keyword in active filters.',
					'wc-ajax-product-filter'
				)}
				value={keyword_filter_prefix}
				onChange={handleTextFieldChange}
			/>

			<Text
				id={'search_field_default_placeholder'}
				label={__('Search field placeholder', 'wc-ajax-product-filter')}
				description={__(
					'Placeholder for the search input inside filter option lists.',
					'wc-ajax-product-filter'
				)}
				value={search_field_default_placeholder}
				onChange={handleTextFieldChange}
			/>

			<Text
				id={'no_results_text'}
				label={__('No results text', 'wc-ajax-product-filter')}
				description={__(
					'Message shown when no products match the applied filters.',
					'wc-ajax-product-filter'
				)}
				value={no_results_text}
				onChange={handleTextFieldChange}
			/>

			<Text
				id={'combobox_no_options_text'}
				label={__('No options text', 'wc-ajax-product-filter')}
				description={__(
					'Message shown inside a ComboBox dropdown when it has no selectable options.',
					'wc-ajax-product-filter'
				)}
				value={combobox_no_options_text}
				onChange={handleTextFieldChange}
			/>

			<Text
				id={'empty_filter_text'}
				label={__('Empty filter text', 'wc-ajax-product-filter')}
				description={__(
					'Text shown when a filter has no options to display.',
					'wc-ajax-product-filter'
				)}
				value={empty_filter_text}
				onChange={handleTextFieldChange}
			/>

			<Text
				id={'show_more_btn_label'}
				label={__('Show more button label', 'wc-ajax-product-filter')}
				value={show_more_btn_label}
				onChange={handleTextFieldChange}
			/>

			<Text
				id={'show_less_btn_label'}
				label={__('Show less button label', 'wc-ajax-product-filter')}
				value={show_less_btn_label}
				onChange={handleTextFieldChange}
			/>

			{WCAPF_PRO && (
				<Text
					id={'clear_button_label'}
					label={__('Clear button label', 'wc-ajax-product-filter')}
					description={__(
						'Label for the per-filter clear button.',
						'wc-ajax-product-filter'
					)}
					value={clear_button_label}
					onChange={handleTextFieldChange}
				/>
			)}

			<Text
				id={'clear_all_button_label'}
				label={__('Clear All button label', 'wc-ajax-product-filter')}
				description={__(
					'Label for the button that clears all applied filters at once.',
					'wc-ajax-product-filter'
				)}
				value={clear_all_button_label}
				onChange={handleTextFieldChange}
			/>

			<Text
				id={'reset_button_label'}
				label={__('Reset button label', 'wc-ajax-product-filter')}
				description={__(
					'Label for the Reset button component inside the filter form.',
					'wc-ajax-product-filter'
				)}
				value={reset_button_label}
				onChange={handleTextFieldChange}
			/>

			{WCAPF_PRO && (
				<Text
					id={'results_count_markup'}
					label={__('Results count markup', 'wc-ajax-product-filter')}
					description={resultsCountMarkupDescription}
					value={results_count_markup}
					onChange={handleTextFieldChange}
				/>
			)}

			<Text
				id={'sort_by_prefix'}
				label={__('Sort by prefix', 'wc-ajax-product-filter')}
				description={__(
					'Text shown before the selected sort option in active filters.',
					'wc-ajax-product-filter'
				)}
				value={sort_by_prefix}
				onChange={handleTextFieldChange}
			/>

			{WCAPF_PRO && (
				<Text
					id={'per_page_prefix'}
					label={__('Per page prefix', 'wc-ajax-product-filter')}
					description={__(
						'Text shown before the selected per-page value in active filters.',
						'wc-ajax-product-filter'
					)}
					value={per_page_prefix}
					onChange={handleTextFieldChange}
				/>
			)}
		</>
	);
};

export default Phrases;
