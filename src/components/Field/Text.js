import { useLayoutEffect, useState } from '@wordpress/element';
import { wpFeSanitizeTitle } from '../Filter/wp-fe-sanitize-title';

const InputField = ({
	id,
	index,
	initialValue,
	onChange,
	type = 'text',
	isFilterKey,
	...rest
}) => {
	const [value, setValue] = useState(initialValue);

	useLayoutEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	const handleInputChange = (e) => {
		let _value;

		if (isFilterKey) {
			_value = wpFeSanitizeTitle(e.target.value);
		} else {
			_value = e.target.value;
		}

		setValue(_value);
	};

	return (
		<input
			type={type}
			id={id}
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
	value,
	index, // Index is used on the manual options table
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
						<label htmlFor={id}>{label}</label>
					</div>
					<div className='__wrapper'>
						<div className='__input_wrapper'>
							<InputField
								id={id}
								index={index}
								initialValue={value}
								onChange={onChange}
								type={type}
								isFilterKey={isFilterKey}
								{...rest}
							/>
						</div>
					</div>
				</div>
				{description && <p className='description'>{description}</p>}
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
				isFilterKey={isFilterKey}
				{...rest}
			/>
		);
	}
};

export default Text;
