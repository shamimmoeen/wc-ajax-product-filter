import { __ } from '@wordpress/i18n';
import { CheckboxControl } from '@wordpress/components';

const FieldNumber = ({
	label,
	id,
	value,
	onChange,
	description,
	type = 'text',
	checkboxId,
	checkIsChecked,
	onCheckChange,
	...rest
}) => {
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
								onChange={(e) => onChange(e, id)}
								{...rest}
							/>
						</div>
						<div className='checkbox-wrapper'>
							<CheckboxControl
								checked={checkIsChecked}
								id={checkboxId}
								onChange={(checked) =>
									onCheckChange(checked, checkboxId)
								}
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
