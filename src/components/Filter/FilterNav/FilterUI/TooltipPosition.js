import { __ } from '@wordpress/i18n';
import { Button, ButtonGroup } from '@wordpress/components';
import { getTooltipPositionOptions } from '../../utils';
import { useFilter } from '../../FilterContext';

const TooltipPosition = () => {
	const {
		state: { activeFilterData },
		dispatch,
	} = useFilter();

	const { tooltip_position } = activeFilterData;

	const id = 'tooltip_position';
	const label = __('Tooltip Position', 'wc-ajax-product-filter');
	const description = __(
		'Determines on which side the tooltip will be placed.',
		'wc-ajax-product-filter'
	);
	const options = getTooltipPositionOptions();

	const handleChange = (value) => {
		if (value === tooltip_position) {
			return;
		}

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: { ...activeFilterData, [id]: value },
		});
	};

	return (
		<div className='__form_control'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor={id}>{label}</label>
				</div>
				<div className='__wrapper'>
					<div className='__input_wrapper'>
						<ButtonGroup>
							{options.map((option) => (
								<Button
									value={option.value}
									key={`${id}-${option.value}`}
									onClick={() => handleChange(option.value)}
									variant={
										tooltip_position === option.value
											? 'primary'
											: ''
									}
								>
									{option.label}
								</Button>
							))}
						</ButtonGroup>
					</div>
				</div>
			</div>
			{description ? <p className='description'>{description}</p> : ''}
		</div>
	);
};

export default TooltipPosition;
