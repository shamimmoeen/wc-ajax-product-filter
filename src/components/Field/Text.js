const Text = ({ label, id, type = 'text' }) => {
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
				/>
			</div>
		</div>
	);
};

export default Text;
