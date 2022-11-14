import { Button, ColorPicker, Dropdown } from '@wordpress/components';

const DropdownColorPicker = ({ value, onChange }) => {
	return (
		<Dropdown
			position='bottom right'
			renderToggle={({ isOpen, onToggle }) => (
				<div className='components-circular-option-picker__option-wrapper'>
					<Button
						onClick={onToggle}
						aria-expanded={isOpen}
						className='components-circular-option-picker__option'
						style={{
							backgroundColor: value ? value : '#fff',
							color: value ? value : '#fff',
						}}
					/>
				</div>
			)}
			renderContent={() => (
				<ColorPicker
					color={value}
					onChange={(color) => onChange(color)}
					defaultValue='#fff'
				/>
			)}
		/>
	);
};

const ColorInput = ({
	label,
	id,
	value,
	onChange,
	description,
	renderAsFormField = false,
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
							<DropdownColorPicker
								value={value}
								onChange={onChange}
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
		return <DropdownColorPicker value={value} onChange={onChange} />;
	}
};

export default ColorInput;
