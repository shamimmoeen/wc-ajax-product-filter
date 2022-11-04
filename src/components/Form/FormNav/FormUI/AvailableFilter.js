import { __, sprintf } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { Icon, plus } from '@wordpress/icons';
import { useForm } from '../../FormContext';
import useFormData from '../../useFormData';

const AvailableFilter = ({ item }) => {
	const { state, dispatch } = useForm();
	const { handleAddFilter } = useFormData(state, dispatch);

	return (
		<div className='__item' onClick={() => handleAddFilter(item)}>
			<div>
				<span className='__post_title'>{item.title}</span>
				<span className='__post_id'>
					{sprintf(__('ID: %d', 'wc-ajax-product-filter'), item.id)}
				</span>
			</div>
			<div className='__btn_wrapper'>
				<Button variant='secondary' disabled={'added' === item.status}>
					<Icon icon={plus} size={20} />
				</Button>
			</div>
		</div>
	);
};

export default AvailableFilter;
