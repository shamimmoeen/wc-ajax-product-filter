import { useLayoutEffect, useState } from '@wordpress/element';
import TippyTooltip from '../TippyTooltip';
import { getInputId, proTag } from '../utils';

const InputField = ({
	inputId,
	id,
	index,
	initialValue,
	onChange,
	type = 'text',
	isDisabled,
	customClass,
	...rest
}) => {
	const [value, setValue] = useState(initialValue);

	useLayoutEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	const handleInputChange = (e) => {
		setValue(e.target.value);
	};

	let classes = 'components-text-control__input';

	if (customClass) {
		classes += ` ${customClass}`;
	}

	return (
		<input
			type={type}
			id={inputId}
			className={classes}
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
	customClass,
	isPro,
	...rest
}) => {
	const inputId = getInputId(id, index);

	if (renderAsFormField) {
		return (
			<div className='__form_control'>
				<div className='__inner'>
					<div className='__label'>
						<label htmlFor={inputId}>
							{label}
							{'field_key' === id && (
								<TippyTooltip
									content={
										<>
											For example, the URL will be
											<br />
											?/color=blue&size=large
											<br />
											where color & size are the filter
											keys.
											<br />
											<br />
											In the PRO version, the URL will be
											<br />
											/color-blue/size-large
										</>
									}
								/>
							)}
							{proTag(isPro)}
						</label>
					</div>
					<div className='__wrapper'>
						<div className='__input_wrapper'>
							<InputField
								inputId={inputId}
								id={id}
								index={index}
								initialValue={value}
								onChange={onChange}
								type={type}
								isDisabled={isDisabled}
								customClass={customClass}
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
				inputId={inputId}
				id={id}
				index={index}
				initialValue={value}
				onChange={onChange}
				type={type}
				isDisabled={isDisabled}
				customClass={customClass}
				{...rest}
			/>
		);
	}
};

export default Text;
