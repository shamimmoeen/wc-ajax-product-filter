import Text from './Text';

const Number = ({
	label,
	id,
	value,
	onChange,
	description,
	type = 'text',
	...rest
}) => {
	return (
		<div className='__form_control number'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor={id}>{label}</label>
				</div>
				<div className='__wrapper'>
					<div className='__input_wrapper'>
						<Text
							type={type}
							id={id}
							value={value}
							onChange={onChange}
							renderAsFormField={false}
							{...rest}
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

export default Number;
