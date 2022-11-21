import { __ } from '@wordpress/i18n';
import { CheckboxControl } from '@wordpress/components';
import Text from '../../../Field/Text';

const FieldNumber = ({
	label,
	id,
	index = '',
	value,
	onChange,
	description,
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
							<Text
								id={id}
								index={index}
								value={value}
								onChange={onChange}
								renderAsFormField={false}
								type={'number'}
								{...rest}
							/>
						</div>

						<div className='checkbox-wrapper'>
							<CheckboxControl
								checked={checkIsChecked}
								id={`${checkboxId}-${index}`}
								onChange={(checked) =>
									onCheckChange(checked, checkboxId, index)
								}
							/>

							<label htmlFor={`${checkboxId}-${index}`}>
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
