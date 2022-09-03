import { Spinner } from '@wordpress/components';

const FilterKey = ({
	label,
	id,
	value,
	onChange,
	description,
	type = 'text',
	isFilterKeyChecking,
	...rest
}) => {
	return (
		<div className='__form_control __filter_key'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor={id}>{label}</label>
				</div>
				<div className='__wrapper'>
					<div className='__input_wrapper'>
						<input
							type={type}
							id={id}
							className='components-text-control__input'
							value={value}
							onChange={onChange}
							{...rest}
						/>
						{isFilterKeyChecking && <Spinner />}
					</div>
				</div>
			</div>
			{description ? <p className='description'>{description}</p> : ''}
		</div>
	);
};

export default FilterKey;
