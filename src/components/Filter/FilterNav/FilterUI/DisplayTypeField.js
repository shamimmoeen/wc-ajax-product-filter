import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import { proTag } from '../../../utils';
import { useFilter } from '../../FilterContext';

const DisplayTypeField = () => {
	const {
		state: { activeFilterData },
		dispatch,
	} = useFilter();

	const { display_type } = activeFilterData;

	const id = 'display_type';
	const label = __('Display Type', 'wc-ajax-product-filter');
	const description = __(
		'Determines how the filter will be shown on the frontend.',
		'wc-ajax-product-filter'
	);

	const firstSegment = [
		{
			label: __('Checkbox', 'wc-ajax-product-filter'),
			value: 'checkbox',
		},
		{
			label: __('Radio', 'wc-ajax-product-filter'),
			value: 'radio',
		},
		{
			label: __('Select', 'wc-ajax-product-filter'),
			value: 'select',
		},
		{
			label: __('Multi select', 'wc-ajax-product-filter'),
			value: 'multi-select',
		},
	];

	const secondSegment = [
		{
			label: __('Label', 'wc-ajax-product-filter'),
			value: 'label',
		},
		{
			label: __('Color', 'wc-ajax-product-filter'),
			value: 'color',
			isPro: true,
		},
		{
			label: __('Image', 'wc-ajax-product-filter'),
			value: 'image',
			isPro: true,
		},
	];

	const handleDisplayTypeChange = (e) => {
		const value = e.target.value;

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: { ...activeFilterData, display_type: value },
		});
	};

	const renderOptions = (options) => {
		return (
			<>
				{options.map((option) => (
					<div
						key={option.value}
						className={classnames(
							'components-radio-control__option'
						)}
					>
						<input
							id={option.value}
							className='components-radio-control__input'
							type='radio'
							name={id}
							value={option.value}
							onChange={handleDisplayTypeChange}
							checked={option.value === display_type}
						/>
						<label htmlFor={option.value}>
							{option.label}
							{proTag(option.isPro)}
						</label>
					</div>
				))}
			</>
		);
	};

	return (
		<div className='__form_control display-type'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor={id}>{label}</label>
				</div>
				<div className='__wrapper'>
					<div className='__input_wrapper'>
						<div className='__row1'>
							{renderOptions(firstSegment)}
						</div>
						<div className='__row2'>
							{renderOptions(secondSegment)}
						</div>
					</div>
				</div>
			</div>
			{description ? <p className='description'>{description}</p> : ''}
		</div>
	);
};

export default DisplayTypeField;
