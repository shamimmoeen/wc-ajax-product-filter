import { Icon } from '@wordpress/components';
import { check, chevronDown } from '@wordpress/icons';
import { default as ReactSelect, components } from 'react-select';
import { isProFeature } from '../utils';

const customStyles = {
	control: (base) => ({
		...base,
		height: 30,
		minHeight: 30,
	}),
	dropdownIndicator: (base) => ({
		...base,
		padding: '0 4px 0 0',
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
	singleValue: (base) => ({
		...base,
		marginLeft: 0,
		marginRight: 0,
	}),
	menu: (base) => ({
		...base,
		borderRadius: 2,
		boxShadow: 'none',
		border: '1px solid #ddd',
		marginTop: 5,
		marginBottom: 5,
	}),
	menuList: (base) => ({
		...base,
		padding: 0,
		borderRadius: 2,
	}),
	option: (base, { isFocused }) => ({
		...base,
		padding: '1px 8px',
		lineHeight: '28px',
		backgroundColor: isFocused ? '#ddd' : 'transparent',
		color: 'unset',
	}),
};

const IndicatorSeparator = () => null;

const CaretDownIcon = () => {
	return <Icon icon={chevronDown} size={18} />;
};

const DropdownIndicator = (props) => {
	return (
		<components.DropdownIndicator {...props}>
			<CaretDownIcon />
		</components.DropdownIndicator>
	);
};

const Option = (props) => {
	const { data, isSelected } = props;
	const { label, isPro } = data;

	return (
		<components.Option {...props}>
			<div className='__wrapper'>
				<div className='__option_label'>
					{label}
					{isProFeature(isPro) && <span className='__pro_tag' />}
				</div>
				{isSelected && <Icon icon={check} className='__icon' />}
			</div>
		</components.Option>
	);
};

const SingleValue = (props) => {
	const { data } = props;
	const { label, isPro } = data;

	return (
		<components.SingleValue {...props}>
			{label}
			{isProFeature(isPro) && <span className='__pro_tag' />}
		</components.SingleValue>
	);
};

const SimpleReactSelect = ({
	options,
	value,
	onChange,
	classes,
	portalTarget,
}) => {
	return (
		<ReactSelect
			components={{
				IndicatorSeparator,
				DropdownIndicator,
				Option,
				SingleValue,
			}}
			isSearchable={false}
			options={options}
			value={value}
			onChange={onChange}
			styles={customStyles}
			className={classes}
			menuPortalTarget={portalTarget}
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
	);
};

const Select = ({
	id,
	label,
	description,
	options,
	value,
	onChange,
	renderAsFormField = false,
	childComponent,
	portalTarget = false,
}) => {
	let customClasses = '__custom_react_select __single_select';
	let html;

	if (renderAsFormField) {
		customClasses += ` ${id}`;

		html = (
			<div className='__form_control react_select_simple'>
				<div className='__inner'>
					<div className='__label'>
						<label htmlFor={id}>{label}</label>
					</div>
					<div className='__wrapper'>
						<div className='__input_wrapper'>
							<SimpleReactSelect
								options={options}
								value={value}
								classes={customClasses}
								portalTarget={portalTarget}
								onChange={(selectedItem) =>
									onChange(selectedItem, id)
								}
							/>

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
			<SimpleReactSelect
				options={options}
				value={value}
				classes={customClasses}
				portalTarget={portalTarget}
				onChange={(selectedItem) => onChange(selectedItem)}
			/>
		);
	}

	return html;
};

export default Select;
