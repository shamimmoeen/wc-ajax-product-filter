const Text = ({
	label,
	id,
	value,
	onChange,
	description,
	type = 'text',
	...rest
}) => {
	return (
		<div className='__form_control'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor={id}>{label}</label>
				</div>
				<div className='__wrapper'>
					<div className='__input_wrapper'>
						<input
							type={type}
							id={id}
							className='components-text-control__input'
							value={value}
							onChange={(e) => onChange(e, id)}
							{...rest}
						/>
					</div>
				</div>
			</div>
			{description ? <p className='description'>{description}</p> : ''}
		</div>
	);
};

export default Text;
