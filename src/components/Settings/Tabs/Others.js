import { __ } from '@wordpress/i18n';
import Checkbox from '../../Field/Checkbox';
import Text from '../../Field/Text';
import SelectMulti from '../../Field/SelectMulti';
import ProFeaturesNotice from '../../ProFeaturesNotice';
import { foundProVersion } from '../../utils';
import { useSettings } from '../SettingsContext';
import useSettingsData from '../useSettingsData';

const WCAPF_PRO = foundProVersion();

const userRoles = wcapf_admin_params.user_roles;

const Others = () => {
	const { state, dispatch } = useSettings();
	const {
		handleTextFieldChange,
		handleCheckboxChange,
		handleAuthorRolesChange,
	} = useSettingsData(state, dispatch);

	const {
		settings: {
			search_field_placeholder,
			show_more_btn_label,
			show_less_btn_label,
			opening_btn_label,
			slide_out_panel_label,
			clear_button_label,
			clear_all_button_label,
			reset_button_label,
			submit_btn_label,
			apply_btn_label,
			results_count_markup,
			pagination_container,
			results_count_container,
			sort_by_form_container,
			more_selectors,
			author_roles,
			multiple_form_locations,
		},
	} = state;

	return (
		<>
			<ProFeaturesNotice
				message={__(
					'There are settings available only in the PRO version.',
					'wc-ajax-product-filter'
				)}
			/>

			<h4 className='__section_heading'>
				{__('Phrases', 'wc-ajax-product-filter')}
			</h4>

			<p className='__description'>
				{__(
					'Here you can change the phrases shown on the front-end. Leave empty to use the default.',
					'wc-ajax-product-filter'
				)}
			</p>

			<Text
				id={'search_field_placeholder'}
				label={__('Search field placeholder', 'wc-ajax-product-filter')}
				value={search_field_placeholder}
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

			<Text
				id={'opening_btn_label'}
				label={__('Opening button label', 'wc-ajax-product-filter')}
				value={opening_btn_label}
				onChange={handleTextFieldChange}
			/>

			{WCAPF_PRO && (
				<Text
					id={'slide_out_panel_label'}
					label={__(
						'Slide-out panel label',
						'wc-ajax-product-filter'
					)}
					value={slide_out_panel_label}
					onChange={handleTextFieldChange}
				/>
			)}

			{WCAPF_PRO && (
				<Text
					id={'clear_button_label'}
					label={__('Clear button label', 'wc-ajax-product-filter')}
					value={clear_button_label}
					onChange={handleTextFieldChange}
				/>
			)}

			<Text
				id={'clear_all_button_label'}
				label={__('Clear All button label', 'wc-ajax-product-filter')}
				value={clear_all_button_label}
				onChange={handleTextFieldChange}
			/>

			<Text
				id={'reset_button_label'}
				label={__('Reset button label', 'wc-ajax-product-filter')}
				value={reset_button_label}
				onChange={handleTextFieldChange}
			/>

			{WCAPF_PRO && (
				<Text
					id={'submit_btn_label'}
					label={__('Submit button label', 'wc-ajax-product-filter')}
					value={submit_btn_label}
					onChange={handleTextFieldChange}
				/>
			)}

			{WCAPF_PRO && (
				<Text
					id={'apply_btn_label'}
					label={__('Apply button label', 'wc-ajax-product-filter')}
					value={apply_btn_label}
					onChange={handleTextFieldChange}
				/>
			)}

			{WCAPF_PRO && (
				<Text
					id={'results_count_markup'}
					label={__('Results count markup', 'wc-ajax-product-filter')}
					value={results_count_markup}
					onChange={handleTextFieldChange}
				/>
			)}

			<div className='__form_fields_separator' />

			<h4 className='__section_heading'>
				{__('Element Selectors', 'wc-ajax-product-filter')}
			</h4>

			<p className='__description'>
				{__(
					'Adjust the css selectors of elements according to your theme. Is needed when filtering via ajax.',
					'wc-ajax-product-filter'
				)}
			</p>

			<Text
				id={'pagination_container'}
				label={__('Pagination', 'wc-ajax-product-filter')}
				description={__(
					"The css class of the pagination element. In most cases, you don't need to change this.",
					'wc-ajax-product-filter'
				)}
				value={pagination_container}
				onChange={handleTextFieldChange}
			/>

			<Text
				id={'results_count_container'}
				label={__('Results count', 'wc-ajax-product-filter')}
				description={__(
					"The css class of the results count element. In most cases, you don't need to change this.",
					'wc-ajax-product-filter'
				)}
				value={results_count_container}
				onChange={handleTextFieldChange}
			/>

			<Text
				id={'sort_by_form_container'}
				label={__('Sort by form', 'wc-ajax-product-filter')}
				description={__(
					"The css class of the sort by form element. In most cases, you don't need to change this.",
					'wc-ajax-product-filter'
				)}
				value={sort_by_form_container}
				onChange={handleTextFieldChange}
			/>

			{WCAPF_PRO && (
				<Text
					id={'more_selectors'}
					label={__('Additional', 'wc-ajax-product-filter')}
					description={__(
						'If you want to update additional elements give the css classes separated by commas.',
						'wc-ajax-product-filter'
					)}
					value={more_selectors}
					onChange={handleTextFieldChange}
					isPro
				/>
			)}

			<div className='__form_fields_separator' />

			<h4 className='__section_heading'>
				{__('Post Author Filter', 'wc-ajax-product-filter')}
			</h4>

			<SelectMulti
				id={'author_roles'}
				label={__('Author Roles', 'wc-ajax-product-filter')}
				description={__(
					'Users having any of these roles will be available(on Available Options modal) for post author filter.',
					'wc-ajax-product-filter'
				)}
				isMultiple={true}
				value={author_roles}
				onChange={handleAuthorRolesChange}
				type={'author'}
				isUserRoles={true}
				options={userRoles}
				maxMenuHeight={WCAPF_PRO ? 200 : 100}
			/>

			{WCAPF_PRO && (
				<>
					<div className='__form_fields_separator' />

					<h4 className='__section_heading'>
						{__('Form Settings', 'wc-ajax-product-filter')}
					</h4>

					<Checkbox
						id={'multiple_form_locations'}
						label={__(
							'Multiple locations',
							'wc-ajax-product-filter'
						)}
						description={__(
							'Enable this if you want to reuse a form in multiple locations.',
							'wc-ajax-product-filter'
						)}
						isChecked={multiple_form_locations}
						onChange={handleCheckboxChange}
					/>
				</>
			)}
		</>
	);
};

export default Others;
