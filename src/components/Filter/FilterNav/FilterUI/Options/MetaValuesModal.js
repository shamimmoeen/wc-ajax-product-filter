import { Button, CheckboxControl, Modal, Spinner } from '@wordpress/components';
import { sprintf, __ } from '@wordpress/i18n';
import { useFilter } from '../../../FilterContext';
import { isEmpty } from 'lodash';
import { useEffect, useState } from '@wordpress/element';
import axios from 'axios';
import useFilterData from '../../../useFilterData';

const modalInitialClass = '__meta_values_modal';

const MetaValuesModal = ({ open, closeModal }) => {
	const {
		state: { activeFilterData },
		dispatch,
	} = useFilter();

	const { setActiveFilterData } = useFilterData(activeFilterData, dispatch);

	const [loading, setLoading] = useState(true);
	const [options, setOptions] = useState([]);
	const [fetched, setFetched] = useState(false);
	const [message, setMessage] = useState('');
	const [modalClasses, setModalClasses] = useState(modalInitialClass);
	const [replaceOptions, toggleReplaceOptions] = useState(false);

	const { meta_key, manual_options } = activeFilterData;

	// Fetch the options for the first time render.
	useEffect(() => {
		if (!open) {
			return;
		}

		if (fetched) {
			return;
		}

		const ajaxParams = {
			action: 'wcapf_get_meta_values',
			meta_key,
		};

		axios
			.get(wcapf_admin_params.ajaxurl, {
				params: ajaxParams,
			})
			.then((res) => {
				const data = res.data.data;

				setLoading(false);
				setFetched(true);

				if (!isEmpty(data)) {
					const classes = `${modalInitialClass} ajax-done`;

					setOptions(data);
					setModalClasses(classes);
				}
			})
			.catch((err) => {
				setLoading(false);
				setFetched(true);
				setMessage(
					__(
						'There was an error fetching the items.',
						'wc-ajax-product-filter'
					)
				);

				console.log(err);
			});
	}, [open]);

	// Triggers after modal is closed.
	useEffect(() => {
		if (open) {
			return;
		}

		toggleReplaceOptions(false);
		handleClearSelection();
	}, [open]);

	const handleSelectAll = () => {
		const _options = options.map((option) => {
			option['status'] = 'added';

			return option;
		});

		setOptions(_options);
	};

	const handleClearSelection = () => {
		const _options = options.map((option) => {
			option['status'] = '';

			return option;
		});

		setOptions(_options);
	};

	const handleOptionChange = (value, index) => {
		const _options = [...options];
		_options[index]['status'] = value ? 'added' : '';

		setOptions(_options);
	};

	const handleAddOptions = () => {
		const newOptions = [];

		options.forEach((option) => {
			if ('added' === option.status) {
				newOptions.push({
					value: option.value,
					label: option.label,
				});
			}
		});

		if (!isEmpty(newOptions)) {
			let manualOptions = [];

			if (replaceOptions) {
				manualOptions = newOptions;
			} else {
				manualOptions = [...manual_options, ...newOptions];
			}

			setActiveFilterData('manual_options', manualOptions);
		}

		closeModal();
	};

	const modalLoader = () => {
		if (loading) {
			return (
				<div className='__loader'>
					<Spinner />
				</div>
			);
		}
	};

	const modalInfo = () => {
		let description = '';

		if (loading) {
			return;
		}

		if (fetched) {
			if (message) {
				description = message;
			} else {
				if (!isEmpty(options)) {
					description = sprintf(
						__(
							'Found %d items for <strong>%s</strong>.',
							'wc-ajax-product-filter'
						),
						options.length,
						meta_key
					);
				} else {
					description = sprintf(
						__(
							'No items found for <strong>%s</strong>.',
							'wc-ajax-product-filter'
						),
						meta_key
					);
				}
			}
		}

		if (description) {
			return (
				<p
					className='description'
					dangerouslySetInnerHTML={{ __html: description }}
				/>
			);
		}
	};

	const modalContent = () => {
		if (fetched && !isEmpty(options)) {
			return (
				<div className='__options'>
					{options.map((option, index) => {
						return (
							<CheckboxControl
								key={`modal-option-${index}`}
								label={option.label}
								checked={'added' === option.status}
								onChange={(value) =>
									handleOptionChange(value, index)
								}
							/>
						);
					})}
				</div>
			);
		}
	};

	const modalFooter = () => {
		return (
			fetched &&
			!isEmpty(options) && (
				<div className='__modal_footer'>
					<div>
						<Button variant='secondary' onClick={handleSelectAll}>
							{__('Select All', 'wc-ajax-product-filter')}
						</Button>
						<Button
							variant='secondary'
							onClick={handleClearSelection}
						>
							{__('Clear Selection', 'wc-ajax-product-filter')}
						</Button>
					</div>
					<div className='__add_options_btn_group'>
						<CheckboxControl
							label={__(
								'Replace current options?',
								'wc-ajax-product-filter'
							)}
							checked={replaceOptions}
							onChange={(value) => toggleReplaceOptions(value)}
						/>
						<Button variant='primary' onClick={handleAddOptions}>
							{__('Add Options', 'wc-ajax-product-filter')}
						</Button>
					</div>
				</div>
			)
		);
	};

	return (
		<>
			{open && (
				<Modal
					title={__('Add Options', 'wc-ajax-product-filter')}
					onRequestClose={closeModal}
					className={modalClasses}
				>
					{modalLoader()}

					{modalInfo()}

					{modalContent()}

					{modalFooter()}
				</Modal>
			)}
		</>
	);
};

export default MetaValuesModal;
