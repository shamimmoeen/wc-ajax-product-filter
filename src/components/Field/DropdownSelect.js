import { CustomSelectControl } from '@wordpress/components';

// TODO: Use a standard package like this package react-responsive-select.

const DropdownSelect = ({
	label,
	id,
	description,
	options,
	value,
	onChange,
	renderAsFormField = false,
	childComponent,
}) => {
	let html;

	if (renderAsFormField) {
		let customClasses = '__custom_select_control';
		customClasses += ` ${id}`;

		html = (
			<div className='__form_control'>
				<div className='__inner'>
					<div className='__label'>
						<label htmlFor={id}>{label}</label>
					</div>
					<div className='__wrapper'>
						<div className='__input_wrapper'>
							<div className='__custom_select_control_wrapper'>
								<CustomSelectControl
									hideLabelFromVision={true}
									options={options}
									onChange={({ selectedItem }) =>
										onChange(selectedItem, id)
									}
									value={value}
									className={customClasses}
								/>
							</div>
							{childComponent}
						</div>
					</div>
				</div>
				{description ? (
					<p className='description'>{description}</p>
				) : (
					''
				)}
			</div>
		);
	} else {
		html = (
			<CustomSelectControl
				hideLabelFromVision={true}
				options={options}
				onChange={({ selectedItem }) => onChange(selectedItem)}
				value={value}
				className='__custom_select_control'
			/>
		);
	}

	return html;
};

export default DropdownSelect;
