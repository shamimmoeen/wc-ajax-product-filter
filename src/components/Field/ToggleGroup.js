import { Button, ButtonGroup } from '@wordpress/components';
import { proTag } from '../utils';

// TODO: Replace it with ToggleGroupControl.
const ToggleGroup = ({
	label,
	id,
	index = '',
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
					<label>
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
									key={`${id}-${option.value}-${index}`}
									onClick={() =>
										onChange(option.value, id, index)
									}
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
