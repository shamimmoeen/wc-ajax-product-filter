import { __ } from '@wordpress/i18n';
import { Button, ButtonGroup } from '@wordpress/components';

const ToggleGroup = ({ label, id, value, options, onChange, description }) => {
	return (
		<div className='__form_control'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor={id}>{label}</label>
				</div>
				<div className='__wrapper'>
					<div className='__input_wrapper'>
						<ButtonGroup>
							{options.map((option) => (
								<Button
									value={option.value}
									key={`fradio-group-${id}-${option.value}`}
									onClick={() => onChange(option.value, id)}
									variant={
										value === option.value ? 'primary' : ''
									}
								>
									{option.label}
								</Button>
							))}
						</ButtonGroup>
					</div>
				</div>
			</div>
			{description ? <p className='description'>{description}</p> : ''}
		</div>
	);
};

export default ToggleGroup;
