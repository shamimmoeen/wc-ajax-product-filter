import { getInputId, proTag } from '../utils';
import Text from './Text';

const Number = ({
	label,
	id,
	index = '',
	value,
	onChange,
	description,
	isPro,
	...rest
}) => {
	return (
		<div className='__form_control number'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor={getInputId(id, index)}>
						{label}
						{proTag(isPro)}
					</label>
				</div>
				<div className='__wrapper'>
					<div className='__input_wrapper'>
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

export default Number;
