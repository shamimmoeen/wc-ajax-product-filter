import { __ } from '@wordpress/i18n';
import Radio from '../../../../Field/Radio';
import Checkbox from '../../../../Field/Checkbox';
import Text from '../../../../Field/Text';
import { useFilter } from '../../../FilterContext';
import useFilterData from '../../../useFilterData';

const ActiveFilters = () => {
	const {
		state: { activeFilterData },
		dispatch,
	} = useFilter();

	const {
		active_filters_layout,
		enable_clear_all_button,
		clear_all_button_label,
		move_clear_all_button_in_title,
		show_if_empty,
		empty_filter_message,
	} = activeFilterData;

	const [handleRadioChange, handleCheckboxChange, handleTextFieldChange] =
		useFilterData(activeFilterData, dispatch);

	return (
		<>
			<Radio
				id={'active_filters_layout'}
				label={__('Layout', 'wc-ajax-product-filter')}
				description={__(
					'Simple: show all the active filter items one by one, Extended: group the items by filter.',
					'wc-ajax-product-filter'
				)}
				options={[
					{
						label: __('Simple', 'wc-ajax-product-filter'),
						value: 'simple',
					},
					{
						label: __(
							'Extended (group by filter)',
							'wc-ajax-product-filter'
						),
						value: 'extended',
					},
				]}
				onChange={(e) => handleRadioChange(e, 'active_filters_layout')}
				value={active_filters_layout}
			/>

			<Checkbox
				id={'enable_clear_all_button'}
				label={__('Clear All Filters button', 'wc-ajax-product-filter')}
				description={__(
					'Whether to show a button to clear all filters.',
					'wc-ajax-product-filter'
				)}
				isChecked={enable_clear_all_button}
				onChange={(value) =>
					handleCheckboxChange('enable_clear_all_button', value)
				}
			/>

			{'1' === enable_clear_all_button && (
				<>
					<Text
						id={'clear_all_button_label'}
						label={__('Button Label', 'wc-ajax-product-filter')}
						description={__(
							'Change the button default label.',
							'wc-ajax-product-filter'
						)}
						value={clear_all_button_label}
						onChange={(e) =>
							handleTextFieldChange(e, 'clear_all_button_label')
						}
					/>

					<Checkbox
						id={'move_clear_all_button_in_title'}
						label={__(
							'Show button in heading',
							'wc-ajax-product-filter'
						)}
						description={__(
							'Whether to show the button in heading.',
							'wc-ajax-product-filter'
						)}
						isChecked={move_clear_all_button_in_title}
						onChange={(value) =>
							handleCheckboxChange(
								'move_clear_all_button_in_title',
								value
							)
						}
					/>
				</>
			)}

			<Checkbox
				id={'show_if_empty'}
				label={__('Show if empty', 'wc-ajax-product-filter')}
				description={__(
					'Whether to show a message when no filter is applied.',
					'wc-ajax-product-filter'
				)}
				isChecked={show_if_empty}
				onChange={(value) =>
					handleCheckboxChange('show_if_empty', value)
				}
			/>

			{'1' === show_if_empty && (
				<Text
					id={'empty_filter_message'}
					label={__('Empty filter message', 'wc-ajax-product-filter')}
					description={__(
						'Change the default message.',
						'wc-ajax-product-filter'
					)}
					value={empty_filter_message}
					onChange={(e) =>
						handleTextFieldChange(e, 'empty_filter_message')
					}
				/>
			)}
		</>
	);
};

export default ActiveFilters;
