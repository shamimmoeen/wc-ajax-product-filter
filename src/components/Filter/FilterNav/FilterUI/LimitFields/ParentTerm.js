import { __ } from '@wordpress/i18n';
import CustomSelect from 'react-dropdown-select';

const ParentTerm = () => {
	const id = 'parent_term';
	const label = __('Parent Term', 'wc-ajax-product-filter');
	const description = __('', 'wc-ajax-product-filter');
	const values = [];
	const options = [];

	const onChange = () => {};

	return (
		<>
			<div className='__form_control'>
				<div className='__inner'>
					<div className='__label'>
						<label htmlFor={id}>{label}</label>
					</div>
					<div className='__wrapper'>
						<div className='__input_wrapper'>
							<CustomSelect
								id={id}
								options={options}
								values={values}
								className='__custom_select_control'
								separator={true}
								onChange={onChange}
								searchable={true}
							/>
						</div>
					</div>
				</div>
				{description ? (
					<p className='description'>{description}</p>
				) : (
					''
				)}
			</div>
		</>
	);
};

export default ParentTerm;
