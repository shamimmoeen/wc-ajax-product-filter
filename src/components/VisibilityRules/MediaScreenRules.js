import { __ } from '@wordpress/i18n';
import { CheckboxControl } from '@wordpress/components';

const MediaScreenRules = ({ label, description, rules, onChange }) => {
	return (
		<div className='__form_control __media_screen_rules'>
			<div className='__inner'>
				<div className='__label'>
					<label>{label}</label>
				</div>
				<div className='__wrapper'>
					<div className='__input_wrapper'>
						<CheckboxControl
							label={__('Mobile', 'wc-ajax-product-filter')}
							checked={rules.includes('mobile')}
							onChange={() => onChange('mobile')}
						/>

						<CheckboxControl
							label={__('Tablet', 'wc-ajax-product-filter')}
							checked={rules.includes('tablet')}
							onChange={() => onChange('tablet')}
						/>

						<CheckboxControl
							label={__('Desktop', 'wc-ajax-product-filter')}
							checked={rules.includes('desktop')}
							onChange={() => onChange('desktop')}
						/>
					</div>
				</div>
			</div>
			{description ? <p className='description'>{description}</p> : ''}
		</div>
	);
};

export default MediaScreenRules;
