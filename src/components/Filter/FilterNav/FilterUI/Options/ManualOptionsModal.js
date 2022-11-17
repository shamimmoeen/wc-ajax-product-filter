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

const userRoles = wcapf_admin_params.user_roles_for_available_options_modal;

const ManualOptionsModal = ({ open, closeModal }) => {
	const [loading, setLoading] = useState(true);
	const [options, setOptions] = useState([]);
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

	let optionsFor;
	let modalType;

	if (isTaxonomyFilters(filterType)) {
		modalType = 'taxonomy';
		optionsFor = taxonomy;
	} else if ('post-author' === filterType) {
		modalType = 'post-author';
	} else {
		modalType = 'post-meta';
		optionsFor = meta_key;
	}

	// Fetch the options for the first time render.
	useEffect(() => {
		if (!open) {
			return;
		}

		let ajaxParams;

		if ('taxonomy' === modalType) {
			if (!taxonomy) {
				setLoading(false);

				if ('attribute' === filterType) {
					setMessage(
						__(
							'Please select a attribute.',
							'wc-ajax-product-filter'
						)
					);
				} else {
					setMessage(
						__(
							'Please select a taxonomy.',
							'wc-ajax-product-filter'
						)
					);
				}

				return;
			}

			ajaxParams = {
				action: 'wcapf_get_taxonomy_terms_for_modal',
				taxonomy,
			};
		} else if ('post-author' === modalType) {
			if (isEmpty(userRoles)) {
				setLoading(false);

				setMessage(
					__(
						'Please select the post author roles from the plugin settings page.',
						'wc-ajax-product-filter'
					)
				);

				return;
			}

			ajaxParams = {
				action: 'wcapf_post_authors_for_modal',
			};
		} else {
			if (!meta_key) {
				setLoading(false);

				setMessage(
					__('Please select a meta key.', 'wc-ajax-product-filter')
				);

				return;
			}

			ajaxParams = {
				action: 'wcapf_get_meta_values_for_modal',
				meta_key,
			};
		}

		axios
			.get(wcapf_admin_params.ajaxurl, {
				params: ajaxParams,
			})
			.then((res) => {
				setLoading(false);

				const data = res.data.data;

				if (!isEmpty(data)) {
					const classes = `${modalInitialClass} ajax-done`;

					if (
						'taxonomy' === modalType ||
						'post-author' === modalType
					) {
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
				setMessage(
					__(
						'There was an error fetching the options.',
						'wc-ajax-product-filter'
					)
				);

				console.log(err);
			});
	}, [open]);

	// Reset the modal states after it is closed.
	useEffect(() => {
		if (open) {
			return;
		}

		setLoading(true);
		setOptions([]);
		setMessage('');
		setModalClasses(modalInitialClass);
		toggleReplaceOptions(false);
		setSearchInput('');
	}, [open]);

	// For the search box.
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
				if ('taxonomy' === modalType || 'post-author' === modalType) {
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

	const modalHeader = () => {
		let description;

		if ('taxonomy' === modalType || 'post-meta' === modalType) {
			description = sprintf(
				__(
					'Found %d options for <strong>%s</strong>.',
					'wc-ajax-product-filter'
				),
				options.length,
				optionsFor
			);
		} else if ('post-author' === modalType) {
			description = sprintf(
				__(
					'Found %d options for user role <strong>%s</strong>.',
					'wc-ajax-product-filter'
				),
				options.length,
				optionsFor
			);
		}

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

	const modalBody = () => {
		return (
			<div className='__options'>
				{options.map((option, index) => {
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

								<span className='__label'>{option.label}</span>

								{'post-meta' !== modalType && (
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
	};

	const modalFooter = () => {
		return (
			<div className='__modal_footer'>
				<div>
					<Button variant='secondary' onClick={handleSelectAll}>
						{__('Select All', 'wc-ajax-product-filter')}
					</Button>
					<Button variant='secondary' onClick={handleClearSelection}>
						{__('Clear Selection', 'wc-ajax-product-filter')}
					</Button>
				</div>
				<div className='__add_options_btn_group'>
					{'post-meta' === modalType && (
						<CheckboxControl
							label={__(
								'Replace current options?',
								'wc-ajax-product-filter'
							)}
							checked={replaceOptions}
							onChange={(value) => toggleReplaceOptions(value)}
						/>
					)}
					<Button variant='primary' onClick={handleAddOptions}>
						{__('Add Options', 'wc-ajax-product-filter')}
					</Button>
				</div>
			</div>
		);
	};

	const modalContent = () => {
		if (loading) {
			return (
				<div className='__loader'>
					<Spinner />
				</div>
			);
		}

		if (message) {
			return (
				<p
					className='__description'
					dangerouslySetInnerHTML={{ __html: message }}
				/>
			);
		}

		if (isEmpty(options)) {
			return __('No options found', 'wc-ajax-product-filter');
		}

		return (
			<>
				{modalHeader()}

				{modalBody()}

				{modalFooter()}
			</>
		);
	};

	const _modalClasses = classnames(modalClasses, {
		__meta_values_modal: 'post-meta' === modalType,
	});

	return (
		<>
			{open && (
				<Modal
					title={__('Available Options', 'wc-ajax-product-filter')}
					onRequestClose={closeModal}
					className={_modalClasses}
				>
					{modalContent()}
				</Modal>
			)}
		</>
	);
};

export default ManualOptionsModal;
