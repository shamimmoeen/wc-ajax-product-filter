import { default as ReactSelect } from 'react-select';
import {
	customStyles,
	IndicatorSeparator,
	DropdownIndicator,
	Option,
	SingleValue,
	Group,
	FormatGroupLabel,
} from '../Field/utilsForReactSelect';

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
				Group,
			}}
			formatGroupLabel={FormatGroupLabel}
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
