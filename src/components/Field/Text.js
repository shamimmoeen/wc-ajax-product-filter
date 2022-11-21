import { useLayoutEffect, useState } from '@wordpress/element';

const InputField = ({
	id,
	index,
	initialValue,
	onChange,
	type = 'text',
	...rest
}) => {
	const [value, setValue] = useState(initialValue);

	useLayoutEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	const handleInputChange = (e) => {
		setValue(e.target.value);
	};

	return (
		<input
			type={type}
			id={`${id}-${index}`}
			className='components-text-control__input'
			value={value}
			onChange={handleInputChange}
			onBlur={() => onChange(value, id, index)}
			{...rest}
		/>
	);
};

const Text = ({
	label,
	id,
	index = '',
	value,
	onChange,
	description,
	type = 'text',
	renderAsFormField = true,
	isFilterKey = false,
	...rest
}) => {
	if (renderAsFormField) {
		return (
			<div className='__form_control'>
				<div className='__inner'>
					<div className='__label'>
						<label htmlFor={`${id}-${index}`}>{label}</label>
					</div>
					<div className='__wrapper'>
						<div className='__input_wrapper'>
							<InputField
								id={id}
								index={index}
								initialValue={value}
								onChange={onChange}
								type={type}
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
	} else {
		return (
			<InputField
				id={id}
				index={index}
				initialValue={value}
				onChange={onChange}
				type={type}
				{...rest}
			/>
		);
	}
};

export default Text;
