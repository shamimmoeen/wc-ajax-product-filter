import { CheckboxControl } from '@wordpress/components';
import { proTag } from '../utils';

const Checkbox = ({ id, label, isChecked, onChange, description, isPro }) => {
	return (
		<div className='__form_control __checkbox_toggle'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor={id}>
						{label}
						{proTag(isPro)}
					</label>
				</div>
				<div className='__wrapper'>
					<div className='__input_wrapper'>
						<CheckboxControl
							checked={isChecked}
							id={id}
							onChange={onChange}
						/>
					</div>
				</div>
			</div>
			{description ? <p className='description'>{description}</p> : ''}
		</div>
	);
};

export default Checkbox;
