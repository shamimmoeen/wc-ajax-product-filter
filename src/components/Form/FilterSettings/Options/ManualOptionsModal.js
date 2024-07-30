import { sprintf, _n, __ } from '@wordpress/i18n';
import {
	Button,
	CheckboxControl,
	Modal,
	Spinner,
	SearchControl,
} from '@wordpress/components';
import { isEmpty } from 'lodash';
import { useEffect, useState } from '@wordpress/element';
import axios from 'axios';
import classnames from 'classnames';
import { useForm } from '../../FormContext';
import useFormFilterData from '../../useFormFilterData';
import { getNonceToken } from '../../../utils';

const modalInitialClass = '__manual_options_modal';

const authorRoles = wcapf_admin_params.author_roles;

const ManualOptionsModal = ({ index, open, closeModal }) => {
	const [loading, setLoading] = useState(true);
	const [options, setOptions] = useState([]);
	const [message, setMessage] = useState('');
	const [modalClasses, setModalClasses] = useState(modalInitialClass);
	const [replaceOptions, toggleReplaceOptions] = useState(false);
	const [searchInput, setSearchInput] = useState('');

	const { state, dispatch } = useForm();
	const { handleManualOptionsChange } = useFormFilterData(state, dispatch);

	const { formFilters } = state;

	const filter = formFilters[index];

	const { type, taxonomy, meta_key, manual_options } = filter;

	// Fetch the options for the first time render.
	useEffect(() => {
		if (!open) {
			return;
		}

		let ajaxParams;

		if ('taxonomy' === type) {
			if (!taxonomy) {
				setLoading(false);

				setMessage(
					__('Please select a taxonomy.', 'wc-ajax-product-filter')
				);

				return;
			}

			ajaxParams = {
				action: 'wcapf_get_terms_for_modal',
				taxonomy,
			};
		} else if ('post-author' === type) {
			if (isEmpty(authorRoles)) {
				setLoading(false);

				setMessage(
					__(
						'Please select the author roles from <strong>Settings > Others</strong> tab.',
						'wc-ajax-product-filter'
					)
				);

				return;
			}

			ajaxParams = {
				action: 'wcapf_get_post_authors_for_modal',
				roles: authorRoles,
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

		ajaxParams['nonce'] = getNonceToken();

		axios
			.get(wcapf_admin_params.ajaxurl, {
				params: ajaxParams,
			})
			.then((res) => {
				setLoading(false);

				const data = res.data.data;

				if (!isEmpty(data)) {
					const classes = `${modalInitialClass} ajax-done`;

					if ('taxonomy' === type || 'post-author' === type) {
						const synced = syncData(data);
						setOptions(synced);
					} else {
						setOptions(data);
					}

					setModalClasses(classes);
				}
			})
			.catch((err) => {
				console.log(err);

				setLoading(false);

				setMessage(
					__(
						'There was an error fetching the options.',
						'wc-ajax-product-filter'
					)
				);
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
				if ('taxonomy' === type || 'post-author' === type) {
					const found = oldOptions.find(
						(_option) => _option.value == option.value
					);

					if (found) {
						return;
					}
				}

				const data = {
					value: option.value,
					label: '',
					tooltip: '',
					color: '',
					secondary_color_enabled: '',
					secondary_color: '',
					image_id: '',
					image_url: '',
				};

				if ('taxonomy' === type) {
					data['name'] = option.label;
				} else if ('post-author' === type) {
					data['name'] = option.label;
				}

				newOptions.push(data);
			}
		});

		if (!isEmpty(newOptions)) {
			let manualOptions = [];

			if (replaceOptions) {
				manualOptions = newOptions;
			} else {
				manualOptions = [...oldOptions, ...newOptions];
			}

			handleManualOptionsChange(manualOptions, 'manual_options', index);
		}

		closeModal();
	};

	const modalHeader = () => {
		const foundOptions = options.length;
		let description;

		if ('taxonomy' === type) {
			description = sprintf(
				_n(
					'Found %d term for <strong>%s</strong>.',
					'Found %d terms for <strong>%s</strong>.',
					foundOptions,
					'wc-ajax-product-filter'
				),
				foundOptions,
				taxonomy
			);
		} else if ('post-meta' === type) {
			description = sprintf(
				_n(
					'Found %d meta value for <strong>%s</strong>.',
					'Found %d meta values for <strong>%s</strong>.',
					foundOptions,
					'wc-ajax-product-filter'
				),
				foundOptions,
				meta_key
			);
		} else if ('post-author' === type) {
			description = sprintf(
				_n(
					'Found %d author for roles of <strong>%s</strong>.',
					'Found %d authors for roles of <strong>%s</strong>.',
					foundOptions,
					'wc-ajax-product-filter'
				),
				foundOptions,
				authorRoles.join(', ')
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

								{'post-meta' !== type && (
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
					{'post-meta' === type && (
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
			let description;

			if ('taxonomy' === type) {
				description = sprintf(
					__(
						'No terms found for <strong>%s</strong>.',
						'wc-ajax-product-filter'
					),
					taxonomy
				);
			} else if ('post-meta' === type) {
				description = sprintf(
					__(
						'No meta values found for <strong>%s</strong>.',
						'wc-ajax-product-filter'
					),
					meta_key
				);
			} else if ('post-author' === type) {
				description = sprintf(
					__(
						'No authors found in user roles <strong>%s</strong>.',
						'wc-ajax-product-filter'
					),
					authorRoles.join(', ')
				);
			}

			return (
				<p
					className='__description'
					dangerouslySetInnerHTML={{
						__html: description,
					}}
				/>
			);
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
		__meta_values_modal: 'post-meta' === type,
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
