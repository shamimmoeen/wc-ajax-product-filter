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
import TippyTooltip from '../TippyTooltip';
import { getInputId, proTag } from '../utils';

const SimpleReactSelect = ({
	inputId,
	options,
	value,
	onChange,
	classes,
	isSearchable,
	portalTarget,
	maxMenuHeight,
	isDisabled,
}) => {
	return (
		<ReactSelect
			inputId={inputId}
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
			isDisabled={isDisabled}
			menuPortalTarget={portalTarget}
			maxMenuHeight={maxMenuHeight}
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
	index = '',
	label,
	description,
	options,
	value,
	onChange,
	isSearchable = false,
	renderAsFormField = false,
	portalTarget = false,
	maxMenuHeight,
	isPro = false,
	isDisabled = false,
	tooltip,
}) => {
	let customClasses = '__custom_react_select __single_select';
	let html;

	if (id) {
		customClasses += ` ${id}`;
	}

	const inputId = getInputId(id, index);

	if (renderAsFormField) {
		html = (
			<div className='__form_control react_select_simple'>
				<div className='__inner'>
					<div className='__label'>
						<label htmlFor={inputId}>
							{label}
							{proTag(isPro)}
						</label>
					</div>
					<div className='__wrapper'>
						<div className='__input_wrapper'>
							<SimpleReactSelect
								inputId={inputId}
								options={options}
								value={value}
								classes={customClasses}
								isSearchable={isSearchable}
								isDisabled={isDisabled}
								portalTarget={portalTarget}
								maxMenuHeight={maxMenuHeight}
								onChange={(selectedItem) =>
									onChange(selectedItem, id, index)
								}
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
		html = (
			<SimpleReactSelect
				inputId={inputId}
				options={options}
				value={value}
				classes={customClasses}
				isDisabled={isDisabled}
				portalTarget={portalTarget}
				maxMenuHeight={maxMenuHeight}
				onChange={(selectedItem) => onChange(selectedItem)}
				isSearchable={isSearchable}
			/>
		);
	}

	return html;
};

export default Select;
