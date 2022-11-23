import { useLayoutEffect, useState } from '@wordpress/element';
import TippyTooltip from '../TippyTooltip';

const InputField = ({
	id,
	index,
	initialValue,
	onChange,
	type = 'text',
	isDisabled,
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
			disabled={isDisabled}
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
	isDisabled = false,
	tooltip,
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
								isDisabled={isDisabled}
								{...rest}
							/>

							{tooltip && <TippyTooltip content={tooltip} />}
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
				isDisabled={isDisabled}
				{...rest}
			/>
		);
	}
};

export default Text;
