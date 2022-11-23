import classnames from 'classnames';
import { proTag } from '../utils';

const Radio = ({
	label,
	id,
	index = '',
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
					<label>
						{label}
						{proTag(isPro)}
					</label>
				</div>
				<div
					className={classnames('__wrapper', 'radio-group', id, {
						'radio-group-vertical': isVertical,
					})}
				>
					<div className='__input_wrapper'>
						{options.map((option, optionIndex) => (
							<div
								key={`${id}-${index}-${optionIndex}`}
								className='components-radio-control__option'
							>
								<input
									id={`${id}-${index}-${optionIndex}`}
									className='components-radio-control__input'
									type='radio'
									value={option.value}
									onChange={(e) => onChange(e, id, index)}
									checked={option.value === value}
								/>
								<label
									htmlFor={`${id}-${index}-${optionIndex}`}
								>
									{option.label}
									{proTag(option.isPro)}
								</label>
							</div>
						))}
					</div>
				</div>
			</div>
			{description && (
				<p
					className='description'
					dangerouslySetInnerHTML={{ __html: description }}
				/>
			)}
		</div>
	);
};

export default Radio;
