import { getInputId } from '../utils';

const Textarea = ({
	label,
	id,
	index = '',
	value,
	onChange,
	description,
	...rest
}) => {
	const inputId = getInputId(id, index);

	return (
		<div className='__form_control'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor={inputId}>{label}</label>
				</div>
				<div className='__wrapper'>
					<div className='__input_wrapper'>
						<textarea
							className='components-textarea-control__input'
							id={inputId}
							value={value}
							onChange={(e) =>
								onChange(e.target.value, id, index)
							}
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

export default Textarea;
