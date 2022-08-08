const Text = ({ label, id, value, onChange, type = 'text', ...rest }) => {
	return (
		<div className='__form_control'>
			<div className='__label'>
				<label htmlFor={id}>{label}</label>
			</div>
			<div className='__wrapper'>
				<input
					type={type}
					id={id}
					className='components-text-control__input'
					value={value}
					onChange={onChange}
					{...rest}
				/>
			</div>
		</div>
	);
};

export default Text;
