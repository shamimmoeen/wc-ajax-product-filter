import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useForm } from '../../FormContext';
import { manualEntryOrderTypes, metaValuesOrderByOptions } from '../../utils';
import ManualOptions from './ManualOptions';
import ManualOptionsModal from './ManualOptionsModal';
import useFields from './useFields';

const ValueTypeText = ({ index }) => {
	const { state } = useForm();

	const {
		getOptionsField,
		orderByField,
		orderDirectionField,
		orderTypeField,
	} = useFields(index);

	const [open, setOpen] = useState(false);
	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	const { formFilters } = state;

	const filter = formFilters[index];

	const { get_options, options_order_by } = filter;

	const _orderByField = () => {
		let _options = metaValuesOrderByOptions();
		let options;

		if ('automatically' === get_options) {
			options = _options.filter(
				(option) => !manualEntryOrderTypes().includes(option.value)
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
					<ManualOptions index={index} openModal={openModal} />

					<ManualOptionsModal
						index={index}
						open={open}
						closeModal={closeModal}
					/>
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
