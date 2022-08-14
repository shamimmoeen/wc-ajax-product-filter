import classnames from 'classnames';
import { isProFeature, proTag } from '../utils';

const Radio = ({
	label,
	id,
	value,
	options,
	isVertical,
	onChange,
	description,
	isPro,
}) => {
	return (
		<div className='__form_control'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor={id}>
						{label}
						{proTag(isPro)}
					</label>
				</div>
				<div
					className={classnames('__wrapper', 'radio-group', {
						'radio-group-vertical': isVertical,
					})}
				>
					<div className='__input_wrapper'>
						{options.map((option, index) => (
							<div
								key={`${id}-${index}`}
								className={classnames(
									'components-radio-control__option',
									{ disabled: isProFeature(option.isPro) }
								)}
							>
								<input
									id={`${id}-${index}`}
									className='components-radio-control__input'
									type='radio'
									name={id}
									value={option.value}
									onChange={onChange}
									checked={option.value === value}
									disabled={
										isProFeature(option.isPro) ||
										isProFeature(isPro)
									}
								/>
								<label htmlFor={`${id}-${index}`}>
									{option.label}
									{proTag(option.isPro)}
								</label>
							</div>
						))}
					</div>
				</div>
			</div>
			{description ? <p className='description'>{description}</p> : ''}
		</div>
	);
};

export default Radio;
