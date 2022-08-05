import { SelectControl } from '@wordpress/components';

const Select = ({ label, id, options }) => {
	return (
		<div className='__form_control'>
			<div className='__label'>
				<label htmlFor={id}>{label}</label>
			</div>
			<div className='__wrapper'>
				<SelectControl options={options} id={id} />
			</div>
		</div>
	);
};

export default Select;
