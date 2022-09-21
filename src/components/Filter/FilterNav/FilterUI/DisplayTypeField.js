import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import { proTag } from '../../../utils';

const DisplayTypeField = ({
	id,
	label,
	description,
	segments,
	value,
	onChange,
}) => {
	const renderSegments = () => {
		return segments.map((options, index) => (
			<div className={`__row${index + 1}`} key={`segment-${index}`}>
				{renderOptions(options)}
			</div>
		));
	};

	const renderOptions = (options) => {
		return options.map((option) => (
			<div
				key={option.value}
				className={classnames('components-radio-control__option')}
			>
				<input
					id={option.value}
					className='components-radio-control__input'
					type='radio'
					name={id}
					value={option.value}
					onChange={(e) => onChange(e, id)}
					checked={option.value === value}
				/>
				<label htmlFor={option.value}>
					{option.label}
					{proTag(option.isPro)}
				</label>
			</div>
		));
	};

	return (
		<div className='__form_control display-type'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor={id}>{label}</label>
				</div>
				<div className='__wrapper'>
					<div className='__input_wrapper'>{renderSegments()}</div>
				</div>
			</div>
			{description ? <p className='description'>{description}</p> : ''}
		</div>
	);
};

export default DisplayTypeField;
