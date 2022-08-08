import CustomSelect from 'react-dropdown-select';

const Select = ({ label, id, values, options, onChange }) => {
	return (
		<div className='__form_control'>
			<div className='__label'>
				<label htmlFor={id}>{label}</label>
			</div>
			<div className='__wrapper'>
				<CustomSelect
					id={id}
					options={options}
					values={values}
					className='__custom_select_control'
					separator={true}
					onChange={onChange}
				/>
			</div>
		</div>
	);
};

export default Select;
