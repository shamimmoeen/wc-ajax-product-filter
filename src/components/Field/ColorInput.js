import { Button, ColorPicker, Dropdown } from '@wordpress/components';
import { proTag, wpVersion } from '../utils';

const DropdownColorPicker = ({ value, onChange, disableAlpha, slotName }) => {
	let dropdownProps;

	if (6.2 <= wpVersion()) {
		dropdownProps = {
			popoverProps: {
				noArrow: false,
				__unstableSlotName: slotName,
				position: 'bottom right',
			},
		};
	} else {
		dropdownProps = {
			popoverProps: { noArrow: false, __unstableSlotName: slotName },
			position: 'bottom right',
		};
	}

	return (
		<Dropdown
			{...dropdownProps}
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
					enableAlpha={!disableAlpha}
				/>
			)}
		/>
	);
};

const ColorInput = ({
	label,
	value,
	onChange,
	description,
	isPro,
	disableAlpha = true,
	renderAsFormField = false,
	slotName,
}) => {
	if (renderAsFormField) {
		return (
			<div className='__form_control'>
				<div className='__inner'>
					<div className='__label'>
						<label>
							{label}
							{proTag(isPro)}
						</label>
					</div>
					<div className='__wrapper'>
						<div className='__input_wrapper'>
							<DropdownColorPicker
								value={value}
								onChange={onChange}
								disableAlpha={disableAlpha}
								slotName={slotName}
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
			<DropdownColorPicker
				value={value}
				onChange={onChange}
				slotName={slotName}
			/>
		);
	}
};

export default ColorInput;
