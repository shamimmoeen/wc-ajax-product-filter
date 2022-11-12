import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { useFilter } from '../../FilterContext';
import useFilterData from '../../useFilterData';
import Checkbox from '../../../Field/Checkbox';
import Text from '../../../Field/Text';

const MoreSettings = () => {
	const { state, dispatch } = useFilter();
	const { handleCheckboxChange, handleTextFieldChange } = useFilterData(
		state,
		dispatch
	);

	const [moreSettings, showMoreSettings] = useState(false);

	const {
		filterType,
		activeFilterData: {
			taxonomy: _taxonomy,
			show_in_active_filters,
			prepend_title_in_active_filters,
			title_in_active_filters,
		},
	} = state;

	const toggleMoreSettings = () => {
		const _moreSettings = !moreSettings;

		showMoreSettings(_moreSettings);
	};

	const moreSettingsToggle = () => {
		let buttonLabel;

		if (moreSettings) {
			buttonLabel = __('Less Settings', 'wc-ajax-product-filter');
		} else {
			buttonLabel = __('More Settings', 'wc-ajax-product-filter');
		}

		return (
			<div className='__form_control __active_filters_settings_toggle_wrapper'>
				<Button variant='link' onClick={toggleMoreSettings}>
					{buttonLabel}
				</Button>
			</div>
		);
	};

	const showInActiveFiltersField = () => {
		return (
			<Checkbox
				id={'show_in_active_filters'}
				label={__('Show in Active Filters', 'wc-ajax-product-filter')}
				description={__(
					'Whether to show the active options in active filters.',
					'wc-ajax-product-filter	'
				)}
				isChecked={show_in_active_filters}
				onChange={handleCheckboxChange}
			/>
		);
	};

	const prependTitleInActiveFiltersField = () => {
		return (
			<Checkbox
				id={'prepend_title_in_active_filters'}
				label={__(
					'Prepend title in Active Filters',
					'wc-ajax-product-filter'
				)}
				description={__(
					'If you show the active filters as <b>Simple(one by one)</b>, you can prepend the title.',
					'wc-ajax-product-filter	'
				)}
				isChecked={prepend_title_in_active_filters}
				onChange={handleCheckboxChange}
			/>
		);
	};

	const activeFilterLabelField = () => {
		if ('1' === show_in_active_filters) {
			return (
				<Text
					id={'title_in_active_filters'}
					label={__(
						'Custom title in Active Filters',
						'wc-ajax-product-filter'
					)}
					description={__(
						'If you show the active filters as <b>Extended(group by filter)</b>, you can show a different title. Leave blank to show the filter title.',
						'wc-ajax-product-filter	'
					)}
					value={title_in_active_filters}
					onChange={handleTextFieldChange}
				/>
			);
		}
	};

	return (
		<>
			{'active-filters' !== filterType && 'reset-button' !== filterType && (
				<>
					{moreSettingsToggle()}

					{moreSettings && (
						<>
							{showInActiveFiltersField()}

							{prependTitleInActiveFiltersField()}

							{activeFilterLabelField()}
						</>
					)}
				</>
			)}
		</>
	);
};

export default MoreSettings;
