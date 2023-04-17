import { default as ReactSelect } from 'react-select';
import {
	customStyles,
	IndicatorSeparator,
	DropdownIndicator,
	OptionForSelectRule,
	SingleValueForSelectRule,
	Group,
	FormatGroupLabel,
} from '../../Field/utilsForReactSelect';

const customClasses = '__custom_react_select __single_select __rule_select';

const SelectRule = ({ options, value, onChange }) => {
	return (
		<ReactSelect
			components={{
				IndicatorSeparator,
				DropdownIndicator,
				Option: OptionForSelectRule,
				SingleValue: SingleValueForSelectRule,
				Group,
			}}
			formatGroupLabel={FormatGroupLabel}
			isSearchable={false}
			options={options}
			value={value}
			onChange={onChange}
			styles={customStyles}
			className={customClasses}
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

export default SelectRule;
