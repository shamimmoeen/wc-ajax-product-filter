import { __ } from '@wordpress/i18n';
import { CheckboxControl } from '@wordpress/components';

const FieldNumber = ({
	label,
	id,
	value,
	onChange,
	description,
	type = 'text',
	checkIsChecked,
	onCheckChange,
	...rest
}) => {
	const checkboxId = `${id}-auto-detect`;

	return (
		<div className='__form_control number with-checkbox'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor={id}>{label}</label>
				</div>
				<div className='__wrapper'>
					<div className='__input_wrapper'>
						<div>
							<input
								type={type}
								id={id}
								className='components-text-control__input'
								value={value}
								onChange={onChange}
								{...rest}
							/>
						</div>
						<div className='checkbox-wrapper'>
							<CheckboxControl
								checked={checkIsChecked}
								id={checkboxId}
								onChange={onCheckChange}
							/>
							<label htmlFor={checkboxId}>
								{__('Auto Detect', 'wc-ajax-product-filter')}
							</label>
						</div>
					</div>
				</div>
			</div>
			{description ? <p className='description'>{description}</p> : ''}
		</div>
	);
};

export default FieldNumber;
