import { sprintf, __ } from '@wordpress/i18n';
import {
	Button,
	CheckboxControl,
	Modal,
	Spinner,
	SearchControl,
} from '@wordpress/components';
import { useFilter } from '../../../FilterContext';
import { isEmpty } from 'lodash';
import { useEffect, useState } from '@wordpress/element';
import axios from 'axios';
import classnames from 'classnames';
import useFilterData from '../../../useFilterData';
import { getTaxonomy, isTaxonomyFilters } from '../../../utils';

const modalInitialClass = '__manual_options_modal';

const ManualOptionsModal = ({ open, closeModal }) => {
	const [loading, setLoading] = useState(true);
	const [options, setOptions] = useState([]);
	const [fetched, setFetched] = useState(false);
	const [message, setMessage] = useState('');
	const [modalClasses, setModalClasses] = useState(modalInitialClass);
	const [replaceOptions, toggleReplaceOptions] = useState(false);
	const [searchInput, setSearchInput] = useState('');

	const { state, dispatch } = useFilter();
	const { setActiveFilterData } = useFilterData(state, dispatch);

	const {
		filterType,
		activeFilterData: { taxonomy: _taxonomy, meta_key, manual_options },
	} = state;

	const taxonomy = getTaxonomy(filterType, _taxonomy);
	const isTaxonomyModal = isTaxonomyFilters(filterType);

	// Fetch the options for the first time render.
	useEffect(() => {
		if (!open) {
			return;
		}

		if (fetched) {
			return;
		}

		let ajaxParams;

		if (isTaxonomyModal) {
			if (!taxonomy) {
				setLoading(false);
				setFetched(true);
				setMessage(
					__('Please select a taxonomy.', 'wc-ajax-product-filter')
				);

				return;
			}

			ajaxParams = {
				action: 'get_custom_appearance_data',
				taxonomy,
			};
		} else {
			if (!meta_key) {
				setLoading(false);
				setFetched(true);
				setMessage(
					__('Please select a meta key.', 'wc-ajax-product-filter')
				);

				return;
			}

			ajaxParams = {
				action: 'wcapf_get_meta_values',
				meta_key,
			};
		}

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

					if (isTaxonomyModal) {
						const synced = syncData(data);
						setOptions(synced);
					} else {
						setOptions(data);
					}

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

		if (isTaxonomyModal) {
			return;
		}

		toggleReplaceOptions(false);
		handleClearSelection();
	}, [open]);

	useEffect(() => {
		if (!open) {
			return;
		}

		if (!fetched) {
			return;
		}

		if (!isTaxonomyModal) {
			return;
		}

		const unsynced = options;
		const synced = syncData(unsynced);

		setOptions(synced);
	}, [open]);

	useEffect(() => {
		let _options;

		if (searchInput) {
			_options = options.map((option) => {
				const { label, value } = option;

				if (
					label.toLowerCase().includes(searchInput.toLowerCase()) ||
					value
						.toString()
						.toLowerCase()
						.includes(searchInput.toLowerCase())
				) {
					return { ...option, matched: '1' };
				} else {
					return { ...option, matched: '0' };
				}
			});
		} else {
			_options = options.map((option) => {
				return { ...option, matched: '1' };
			});
		}

		setOptions(_options);
	}, [searchInput]);

	const syncData = (unsynced) => {
		const manualOptions = manual_options ? manual_options : [];

		const synced = unsynced.map((option) => {
			const found = manualOptions.find(
				(_option) => _option.value == option.value
			);

			if (found) {
				return { ...option, status: 'added' };
			}

			return { ...option, status: '' };
		});

		return synced;
	};

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
		const find = options[index];

		const _options = options.map((option) => {
			if (option.value === find.value) {
				if (value) {
					return { ...option, status: 'added' };
				}

				return { ...option, status: '' };
			}

			return option;
		});

		setOptions(_options);
	};

	const handleAddOptions = () => {
		const oldOptions = manual_options ? manual_options : [];
		const newOptions = [];

		options.forEach((option) => {
			if ('added' === option.status) {
				if (isTaxonomyModal) {
					const found = oldOptions.find(
						(_option) => _option.value == option.value
					);

					if (found) {
						return;
					}
				}

				newOptions.push({
					value: option.value,
					label: option.label,
					tooltip: option.label,
					color: '',
					secondaryColorEnabled: '',
					secondaryColor: '',
					imageId: '',
					imageUrl: '',
				});
			}
		});

		if (!isEmpty(newOptions)) {
			let manualOptions = [];

			if (replaceOptions) {
				manualOptions = newOptions;
			} else {
				manualOptions = [...oldOptions, ...newOptions];
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

	const modalHeader = () => {
		const itemsFor = isTaxonomyModal ? taxonomy : meta_key;
		const description = sprintf(
			__(
				'Found %d items for <strong>%s</strong>.',
				'wc-ajax-product-filter'
			),
			options.length,
			itemsFor
		);

		return (
			<div className='__header'>
				<div className='__results_info'>
					<p
						className='__description'
						dangerouslySetInnerHTML={{ __html: description }}
					></p>
				</div>
				<div className='__search_box'>
					<SearchControl
						value={searchInput}
						onChange={setSearchInput}
					/>
				</div>
			</div>
		);
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
				const itemsFor = isTaxonomyModal ? taxonomy : meta_key;

				if (!isEmpty(options)) {
					return modalHeader();
				} else {
					description = sprintf(
						__(
							'No items found for <strong>%s</strong>.',
							'wc-ajax-product-filter'
						),
						itemsFor
					);
				}
			}
		}

		if (description) {
			return (
				<p
					className='__description'
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
						let _label = option.label;

						if (isTaxonomyModal) {
							_label += <span>{option.value}</span>;
						}

						return (
							<div
								key={`modal-option-${index}`}
								className={classnames('__option', {
									__hide_option: '0' === option.matched,
								})}
							>
								<label>
									<CheckboxControl
										checked={'added' === option.status}
										onChange={(value) =>
											handleOptionChange(value, index)
										}
									/>

									<span className='__label'>
										{option.label}
									</span>

									{isTaxonomyModal && (
										<span className='__info'>
											{sprintf(
												__(
													'ID: %d',
													'wc-ajax-product-filter'
												),
												option.value
											)}
										</span>
									)}
								</label>
							</div>
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
						{!isTaxonomyModal && (
							<CheckboxControl
								label={__(
									'Replace current options?',
									'wc-ajax-product-filter'
								)}
								checked={replaceOptions}
								onChange={(value) =>
									toggleReplaceOptions(value)
								}
							/>
						)}
						<Button variant='primary' onClick={handleAddOptions}>
							{__('Add Options', 'wc-ajax-product-filter')}
						</Button>
					</div>
				</div>
			)
		);
	};

	const _modalClasses = classnames(modalClasses, {
		__meta_values_modal: !isTaxonomyModal,
	});

	return (
		<>
			{open && (
				<Modal
					title={__('Add Options', 'wc-ajax-product-filter')}
					onRequestClose={closeModal}
					className={_modalClasses}
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

export default ManualOptionsModal;
