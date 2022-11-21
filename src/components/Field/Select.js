import { __ } from '@wordpress/i18n';
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
import { proTag } from '../utils';

const SimpleReactSelect = ({
	id,
	index = '',
	options,
	value,
	onChange,
	classes,
	isSearchable,
	portalTarget,
}) => {
	return (
		<ReactSelect
			inputId={`${id}-${index}`}
			components={{
				IndicatorSeparator,
				DropdownIndicator,
				Option,
				SingleValue,
				Group,
			}}
			formatGroupLabel={FormatGroupLabel}
			isSearchable={isSearchable}
			noOptionsMessage={() =>
				__('No option found', 'wc-ajax-product-filter')
			}
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
	index,
	label,
	description,
	options,
	value,
	onChange,
	isSearchable = false,
	renderAsFormField = false,
	portalTarget = false,
	isPro = false,
}) => {
	let customClasses = '__custom_react_select __single_select';
	let html;

	if (id) {
		customClasses += ` ${id}`;
	}

	if (renderAsFormField) {
		html = (
			<div className='__form_control react_select_simple'>
				<div className='__inner'>
					<div className='__label'>
						<label htmlFor={`${id}-${index}`}>
							{label}
							{proTag(isPro)}
						</label>
					</div>
					<div className='__wrapper'>
						<div className='__input_wrapper'>
							<SimpleReactSelect
								id={id}
								index={index}
								options={options}
								value={value}
								classes={customClasses}
								isSearchable={isSearchable}
								portalTarget={portalTarget}
								onChange={(selectedItem) =>
									onChange(selectedItem, id, index)
								}
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
		html = (
			<SimpleReactSelect
				id={id}
				index={index}
				options={options}
				value={value}
				classes={customClasses}
				portalTarget={portalTarget}
				onChange={(selectedItem) => onChange(selectedItem)}
				isSearchable={isSearchable}
			/>
		);
	}

	return html;
};

export default Select;
