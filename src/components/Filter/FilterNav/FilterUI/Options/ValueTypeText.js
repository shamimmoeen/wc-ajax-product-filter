import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useFilter } from '../../../FilterContext';
import useFilterData from '../../../useFilterData';
import { orderByOptions } from '../../../utils';
import ManualOptions from './ManualOptions';
import MetaValuesModal from './MetaValuesModal';
import useFields from './useFields';

const ValueTypeText = () => {
	const {
		state: { activeFilterData, isDirty },
		dispatch,
	} = useFilter();

	const { handleToggleGroupChange } = useFilterData(
		activeFilterData,
		isDirty,
		dispatch
	);

	const {
		getOptionsField,
		orderByField,
		orderDirectionField,
		orderTypeField,
	} = useFields();

	const [open, setOpen] = useState(false);

	const openModal = () => setOpen(true);

	const closeModal = () => setOpen(false);

	const { get_options, options_order_by } = activeFilterData;

	useEffect(() => {
		if ('automatically' === get_options && 'label' === options_order_by) {
			handleToggleGroupChange('none', 'options_order_by');
		}
	}, [get_options]);

	const _orderByField = () => {
		let options = orderByOptions();

		if ('automatically' === get_options) {
			options = orderByOptions().filter(
				(option) => 'label' !== option.value
			);
		}

		return orderByField('options_order_by', options);
	};

	const _orderDirectionField = () => {
		if ('none' !== options_order_by) {
			return orderDirectionField('options_order_dir');
		}
	};

	const _orderTypeField = () => {
		const allowed = ['label', 'value'];

		if (allowed.includes(options_order_by)) {
			return orderTypeField('options_order_type');
		}
	};

	const manualOptions = () => {
		if ('manual_entry' === get_options) {
			return (
				<>
					<ManualOptions openModal={openModal} />

					<MetaValuesModal open={open} closeModal={closeModal} />
				</>
			);
		}
	};

	return (
		<>
			{getOptionsField('get_options')}

			{_orderByField()}

			{_orderDirectionField()}

			{_orderTypeField()}

			{manualOptions()}
		</>
	);
};

export default ValueTypeText;
