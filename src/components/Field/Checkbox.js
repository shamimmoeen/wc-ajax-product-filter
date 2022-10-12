import { CheckboxControl } from '@wordpress/components';
import { proTag } from '../utils';

const Checkbox = ({ id, label, isChecked, onChange, description, isPro }) => {
	const renderDescription = () => {
		if (description) {
			if (
				'enable_soft_limit' === id ||
				'enable_soft_limit_for_extended_layout' === id
			) {
				return (
					<p
						className='description'
						dangerouslySetInnerHTML={{ __html: description }}
					/>
				);
			} else {
				return <p className='description'>{description}</p>;
			}
		}
	};

	return (
		<div className='__form_control __checkbox_toggle'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor={id}>
						{label}
						{proTag(isPro)}
					</label>
				</div>
				<div className='__wrapper'>
					<div className='__input_wrapper'>
						<CheckboxControl
							checked={isChecked}
							id={id}
							onChange={(value) => onChange(value, id)}
						/>
					</div>
				</div>
			</div>
			{renderDescription()}
		</div>
	);
};

export default Checkbox;
