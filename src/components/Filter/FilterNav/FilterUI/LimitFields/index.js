import { __ } from '@wordpress/i18n';
import { Button, ButtonGroup } from '@wordpress/components';
import { useFilter } from '../../../FilterContext';
import { taxonomyLimitByOptions } from '../../../utils';
import { proTag } from '../../../../utils';

const LimitBy = () => {
	const {
		state: { activeFilterData },
		dispatch,
	} = useFilter();

	const { limit_options } = activeFilterData;

	const id = 'limit_options';
	const label = __('Limit Options', 'wc-ajax-product-filter');
	const description = __(
		'Limit the filter options.',
		'wc-ajax-product-filter'
	);
	const options = taxonomyLimitByOptions();
	const isPro = true;

	const handleChange = (value) => {
		if (value === limit_options) {
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
					<label htmlFor={id}>
						{label}
						{proTag(isPro)}
					</label>
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
										limit_options === option.value
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

export default LimitBy;
