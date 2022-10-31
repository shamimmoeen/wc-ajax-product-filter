import { sprintf, __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import { check, chevronDown } from '@wordpress/icons';
import { components } from 'react-select';
import { isProFeature } from '../utils';

export const customStyles = {
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
	menuPortal: (base) => ({
		...base,
		zIndex: 300,
	}),
	menu: (base) => ({
		...base,
		borderRadius: 2,
		boxShadow: 'none',
		border: '1px solid #ddd',
		marginTop: 5,
		marginBottom: 5,
		zIndex: 300,
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
	group: (base) => ({
		...base,
		paddingBottom: 0,
	}),
	groupHeading: (base) => ({
		...base,
		padding: '0 8px',
	}),
};

export const IndicatorSeparator = () => null;

const CaretDownIcon = () => {
	return <Icon icon={chevronDown} size={18} />;
};

export const DropdownIndicator = (props) => {
	return (
		<components.DropdownIndicator {...props}>
			<CaretDownIcon />
		</components.DropdownIndicator>
	);
};

export const Option = (props) => {
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

const groupInfoForSelectRule = ({ value, group }) => {
	let html = '';

	if ('archive' === group) {
		html = <span className='__info'>{value}</span>;
	} else if ('filter' === group) {
		html = (
			<span className='__info'>
				[{sprintf(__('ID: %s', 'wc-ajax-product-filter'), value)}]
			</span>
		);
	}

	return html;
};

export const OptionForSelectRule = (props) => {
	const { data, isSelected } = props;
	const { label } = data;

	return (
		<components.Option {...props}>
			<div className='__wrapper'>
				<div className='__option_label'>
					{label}
					{groupInfoForSelectRule(data)}
				</div>
				{isSelected && <Icon icon={check} className='__icon' />}
			</div>
		</components.Option>
	);
};

export const OptionForSelectArchive = (props) => {
	const { data, isSelected } = props;
	const { label } = data;

	return (
		<components.Option {...props}>
			<div className='__wrapper'>
				<div className='__option_label'>
					{label}
					<span className='__info'>
						[
						{sprintf(
							__('ID: %s', 'wc-ajax-product-filter'),
							data.value
						)}
						]
					</span>
				</div>
				{isSelected && <Icon icon={check} className='__icon' />}
			</div>
		</components.Option>
	);
};

export const SingleValue = (props) => {
	const { data } = props;
	const { label, isPro } = data;

	return (
		<components.SingleValue {...props}>
			{label}
			{isProFeature(isPro) && <span className='__pro_tag' />}
		</components.SingleValue>
	);
};

export const SingleValueForSelectRule = (props) => {
	const { data } = props;
	const { label } = data;

	return (
		<components.SingleValue {...props}>
			{label}
			{groupInfoForSelectRule(data)}
		</components.SingleValue>
	);
};

export const Group = (props) => {
	if (props.data.proGroup) {
		return (
			<div className='__pro_group'>
				<components.Group {...props} />
			</div>
		);
	}

	return <components.Group {...props} />;
};

export const FormatTermLabel = (data) => {
	return (
		<span>
			{data.label}
			<span className='__info'>
				[{sprintf(__('ID: %s', 'wc-ajax-product-filter'), data.value)}]
			</span>
		</span>
	);
};

export const FormatGroupLabel = (data) => {
	if (data.proGroup) {
		return (
			<span className='__pro_heading_wrapper'>
				<span className='__pro_heading'>
					{__('Pro', 'wc-ajax-product-filter')}
				</span>
			</span>
		);
	}

	return <span>{data.label}</span>;
};
