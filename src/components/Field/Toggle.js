import { useState } from '@wordpress/element';
import { FormToggle } from '@wordpress/components';

const Toggle = ({ label, id }) => {
	const [isChecked, setChecked] = useState(true);

	return (
		<div className='__form_control'>
			<div className='__label'>
				<label htmlFor={id}>{label}</label>
			</div>
			<div className='__wrapper'>
				<FormToggle
					checked={isChecked}
					onChange={() => setChecked((state) => !state)}
					id={id}
				/>
			</div>
		</div>
	);
};

export default Toggle;
