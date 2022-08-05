import { TextControl } from '@wordpress/components';

const Title = ({ label, value, handleChange }) => {
	return (
		<TextControl
			label={label}
			value={value}
			onChange={(value) => handleChange(value)}
			className={'__title'}
		/>
	);
};

export default Title;
