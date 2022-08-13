import { CheckboxControl } from '@wordpress/components';

const Checkbox = ({ id, label, isChecked, onChange, description }) => {
	return (
		<div className='__form_control __checkbox_toggle'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor={id}>{label}</label>
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
