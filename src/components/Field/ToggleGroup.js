import { Button, ButtonGroup } from '@wordpress/components';
import { proTag } from '../utils';

const ToggleGroup = ({
	label,
	id,
	value,
	options,
	onChange,
	description,
	isPro,
}) => {
	return (
		<div className='__form_control'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor={id}>
						{label}
						{proTag(isPro)}
					</label>
				</div>
				<div className='__wrapper'>
					<div className='__input_wrapper'>
						<ButtonGroup>
							{options.map((option) => (
								<Button
									value={option.value}
									key={`radio-group-${id}-${option.value}`}
									onClick={() => onChange(option.value, id)}
									variant={
										value === option.value ? 'primary' : ''
									}
								>
									{option.label}
									{proTag(option.isPro)}
								</Button>
							))}
						</ButtonGroup>
					</div>
				</div>
			</div>
			{description && (
				<p
					className='description'
					dangerouslySetInnerHTML={{ __html: description }}
				/>
			)}
		</div>
	);
};

export default ToggleGroup;
