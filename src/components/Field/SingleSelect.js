import { Icon } from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import { chevronDown } from '@wordpress/icons';
import Select, { components } from 'react-select';

const colourOptions = [
	{ value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
	{ value: 'blue', label: 'Blue', color: '#0052CC', disabled: true },
	{ value: 'purple', label: 'Purple', color: '#5243AA' },
	{ value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
	{ value: 'orange', label: 'Orange', color: '#FF8B00' },
	{ value: 'yellow', label: 'Yellow', color: '#FFC400' },
	{ value: 'green', label: 'Green', color: '#36B37E' },
	{ value: 'forest', label: 'Forest', color: '#00875A' },
	{ value: 'slate', label: 'Slate', color: '#253858' },
	{ value: 'silver', label: 'Silver', color: '#666666' },
];

const customStyles = {
	control: (base) => ({
		...base,
		height: 30,
		minHeight: 30,
	}),
	dropdownIndicator: (base) => ({
		...base,
		paddingTop: 0,
		paddingBottom: 0,
	}),
	clearIndicator: (base) => ({
		...base,
		paddingTop: 0,
		paddingBottom: 0,
	}),
	input: (base) => ({
		...base,
		paddingTop: 0,
		paddingBottom: 0,
	}),
};

const CaretDownIcon = () => {
	return <Icon icon={chevronDown} size={18} />;
};

const IndicatorSeparator = () => null;

const DropdownIndicator = (props) => {
	return (
		<components.DropdownIndicator {...props}>
			<CaretDownIcon />
		</components.DropdownIndicator>
	);
};

const SingleSelect = ({ id, label, description }) => {
	const ref = useRef(null);

	useEffect(() => {
		ref.current.focus();
	}, []);

	return (
		<div className='__form_control react_select'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor={id}>{label}</label>
				</div>
				<div className='__wrapper'>
					<div className='__input_wrapper'>
						<div style={{ width: 130 }}>
							<Select
								ref={ref}
								components={{
									IndicatorSeparator,
									DropdownIndicator,
								}}
								// menuIsOpen
								isSearchable={false}
								defaultValue={colourOptions[0]}
								options={colourOptions}
								styles={customStyles}
								className='__custom_react_select __single_select'
								classNamePrefix='__react_select'
								theme={(theme) => ({
									...theme,
									borderRadius: 0,
									colors: {
										...theme.colors,
										primary: '#007cba',
									},
								})}
							/>
						</div>
					</div>
				</div>
			</div>
			{description ? <p className='description'>{description}</p> : ''}
		</div>
	);
};

export default SingleSelect;
