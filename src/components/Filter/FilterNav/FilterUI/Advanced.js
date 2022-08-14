import { __ } from '@wordpress/i18n';
import Checkbox from '../../../Field/Checkbox';
import Radio from '../../../Field/Radio';
import Text from '../../../Field/Text';
import { useFilter } from '../../FilterContext';

const Advanced = () => {
	const {
		state: { activeFilterData },
		dispatch,
	} = useFilter();

	const {
		use_term_slug_in_url,
		enable_accordion,
		accordion_default_state,
		show_clear_button,
		enable_soft_limit,
		soft_limit,
	} = activeFilterData;

	const handleCheckboxChange = (key, value) => {
		const _value = value ? '1' : '';

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: { ...activeFilterData, [key]: _value },
		});
	};

	const handleRadioChange = (e, key) => {
		const value = e.target.value;

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: { ...activeFilterData, [key]: value },
		});
	};

	const handleTextChange = (e, key) => {
		const value = e.target.value;

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: { ...activeFilterData, [key]: value },
		});
	};

	return (
		<>
			<Checkbox
				id={'enable_accordion'}
				label={__('Enable Accordion', 'wc-ajax-product-filter')}
				isChecked={enable_accordion}
				onChange={(value) =>
					handleCheckboxChange('enable_accordion', value)
				}
			/>

			{enable_accordion && (
				<Radio
					id={'accordion_default_state'}
					label={__(
						'Accordion default state',
						'wc-ajax-product-filter'
					)}
					value={accordion_default_state}
					onChange={(e) =>
						handleRadioChange(e, 'accordion_default_state')
					}
					options={[
						{
							label: __('Expanded', 'wc-ajax-product-filter'),
							value: 'expanded',
						},
						{
							label: __('Collapsed', 'wc-ajax-product-filter'),
							value: 'collapsed',
						},
					]}
				/>
			)}

			<Checkbox
				id={'enable_soft_limit'}
				label={__('Soft Limit', 'wc-ajax-product-filter')}
				isChecked={enable_soft_limit}
				onChange={(value) =>
					handleCheckboxChange('enable_soft_limit', value)
				}
				isPro={true}
			/>

			{enable_soft_limit && (
				<Text
					id={'soft_limit'}
					label={__(
						'Show a toggle link after this many choices',
						'wc-ajax-product-filter	'
					)}
					value={soft_limit}
					onChange={(e) => handleTextChange(e, 'soft_limit')}
					type={'number'}
					min={1}
				/>
			)}

			<Checkbox
				id={'use_term_slug_in_url'}
				label={__('Use term slug in URL', 'wc-ajax-product-filter')}
				isChecked={use_term_slug_in_url}
				onChange={(value) =>
					handleCheckboxChange('use_term_slug_in_url', value)
				}
				isPro={true}
			/>

			<Checkbox
				id={'show_clear_button'}
				label={__('Enable clear filter', 'wc-ajax-product-filter')}
				isChecked={show_clear_button}
				onChange={(value) =>
					handleCheckboxChange('show_clear_button', value)
				}
				isPro={true}
			/>
		</>
	);
};

export default Advanced;
