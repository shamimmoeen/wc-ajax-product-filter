import { __, sprintf } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { Icon, plus } from '@wordpress/icons';
import { useForm } from '../../FormContext';
import useFormData from '../../useFormData';

const AvailableFilter = ({ item }) => {
	const { state, dispatch } = useForm();
	const { setDirty } = useFormData(state, dispatch);

	const { availableFilters, formFilters } = state;

	const handleAddFilter = () => {
		if (formFilters.find((filter) => filter.id === item.id)) {
			return;
		}

		const _availableFilters = availableFilters.map((_item) => {
			if (_item.id === item.id) {
				_item.status = 'added';
			}

			return _item;
		});

		dispatch({ type: 'SET_AVAILABLE_FILTERS', payload: _availableFilters });

		const _formFilters = [item, ...formFilters];

		dispatch({ type: 'SET_FORM_FILTERS', payload: _formFilters });

		setDirty();
	};

	return (
		<div className='__item' onClick={handleAddFilter}>
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
