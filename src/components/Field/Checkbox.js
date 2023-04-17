import { CheckboxControl } from '@wordpress/components';
import { getInputId, proTag } from '../utils';

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
	const inputId = getInputId(id, index);

	return (
		<div className='__form_control __checkbox_toggle'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor={inputId}>
						{label}
						{proTag(isPro)}
					</label>
				</div>
				<div className='__wrapper'>
					<div className='__input_wrapper'>
						<CheckboxControl
							checked={isChecked}
							id={inputId}
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
