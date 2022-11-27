import { CheckboxControl } from '@wordpress/components';
import { proTag } from '../utils';

const Checkbox = ({
	id,
	index = '',
	label,
	isChecked,
	onChange,
	description,
	isPro,
	isDisabled,
}) => {
	return (
		<div className='__form_control __checkbox_toggle'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor={`${id}-${index}`}>
						{label}
						{proTag(isPro)}
					</label>
				</div>
				<div className='__wrapper'>
					<div className='__input_wrapper'>
						<CheckboxControl
							checked={isChecked}
							id={`${id}-${index}`}
							onChange={(value) => onChange(value, id, index)}
							disabled={isDisabled}
						/>
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

export default Checkbox;
