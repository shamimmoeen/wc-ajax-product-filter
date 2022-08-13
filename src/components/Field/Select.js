import CustomSelect from 'react-dropdown-select';

const Select = ({
	label,
	id,
	values,
	options,
	onChange,
	description,
	placeholder,
	searchable,
}) => {
	return (
		<div className='__form_control'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor={id}>{label}</label>
				</div>
				<div className='__wrapper'>
					<div className='__input_wrapper'>
						<CustomSelect
							id={id}
							options={options}
							values={values}
							className='__custom_select_control'
							separator={true}
							onChange={onChange}
							placeholder={placeholder}
							searchable={searchable}
						/>
					</div>
				</div>
			</div>
			{description ? <p className='description'>{description}</p> : ''}
		</div>
	);
};

export default Select;
