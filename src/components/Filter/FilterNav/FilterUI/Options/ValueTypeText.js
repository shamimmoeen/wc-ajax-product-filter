import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useFilter } from '../../../FilterContext';
import useFilterData from '../../../useFilterData';
import { metaValuesOrderByOptions } from '../../../utils';
import ManualOptions from './ManualOptions';
import ManualOptionsModal from './ManualOptionsModal';
import useFields from './useFields';

const orderTypesForManualEntry = ['label', 'entry'];

const ValueTypeText = () => {
	const { state, dispatch } = useFilter();
	const { handleToggleGroupChange } = useFilterData(state, dispatch);

	const {
		getOptionsField,
		orderByField,
		orderDirectionField,
		orderTypeField,
	} = useFields();

	const [open, setOpen] = useState(false);
	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	const {
		activeFilterData: { get_options, options_order_by },
	} = state;

	useEffect(() => {
		if ('automatically' !== get_options) {
			return;
		}

		if (orderTypesForManualEntry.includes(options_order_by)) {
			handleToggleGroupChange('none', 'options_order_by');
		}
	}, [get_options]);

	const _orderByField = () => {
		let _options = metaValuesOrderByOptions();
		let options;

		if ('automatically' === get_options) {
			options = _options.filter(
				(option) => !orderTypesForManualEntry.includes(option.value)
			);
		} else {
			options = _options;
		}

		return orderByField('options_order_by', options, true);
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

					<ManualOptionsModal open={open} closeModal={closeModal} />
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
