import classnames from 'classnames';
import { getInputId, proTag } from '../utils';
import TippyTooltip from '../TippyTooltip';

const Radio = ({
	label,
	id,
	index = '',
	value,
	options,
	isVertical,
	onChange,
	description,
	tooltip,
	isPro,
}) => {
	return (
		<div className='__form_control'>
			<div className='__inner'>
				<div className='__label'>
					<label>
						{label}
						{proTag(isPro)}
						{tooltip && <TippyTooltip content={tooltip} />}
					</label>
				</div>
				<div
					className={classnames('__wrapper', 'radio-group', id, {
						'radio-group-vertical': isVertical,
					})}
				>
					<div className='__input_wrapper'>
						{options.map((option, optionIndex) => {
							const inputId = getInputId(id, index, optionIndex);

							return (
								<div
									key={inputId}
									className='components-radio-control__option'
								>
									<input
										id={inputId}
										className='components-radio-control__input'
										type='radio'
										value={option.value}
										onChange={(e) => onChange(e, id, index)}
										checked={option.value === value}
									/>
									<label htmlFor={inputId}>
										{option.label}
										{proTag(option.isPro)}
									</label>
								</div>
							);
						})}
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
