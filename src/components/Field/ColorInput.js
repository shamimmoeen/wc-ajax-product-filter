import { Button, ColorPicker, Dropdown } from '@wordpress/components';
import { proTag } from '../utils';

const DropdownColorPicker = ({ value, onChange, disableAlpha }) => {
	return (
		<Dropdown
			position='bottom right'
			popoverProps={{ noArrow: false }}
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
					disableAlpha={disableAlpha}
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
