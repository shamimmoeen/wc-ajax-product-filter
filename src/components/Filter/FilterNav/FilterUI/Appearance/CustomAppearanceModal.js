import { sprintf, __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import {
	Button,
	Modal,
	Spinner,
	SearchControl,
	ColorPicker,
} from '@wordpress/components';
import axios from 'axios';
import { isEmpty, find } from 'lodash';
import { useFilter } from '../../../FilterContext';
import useFilterData from '../../../useFilterData';
import {
	getNoOfMaxTermsToRender,
	getTimeoutForRemovingMediaFrames,
	removeMediaFrames,
} from '../../../../utils';
import ImagePicker from '../../../../Field/ImagePicker';

const modalInitialClass = '__custom_appearance_modal';

const maxItems = getNoOfMaxTermsToRender();
const timeout = getTimeoutForRemovingMediaFrames();

const CustomAppearanceModal = ({ type, taxonomy, appearanceData }) => {
	const { state, dispatch } = useFilter();
	const { setActiveFilterData } = useFilterData(state, dispatch);

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [fetched, setFetched] = useState(false);
	const [options, setOptions] = useState([]);
	const [filteredOptions, setFilteredOptions] = useState([]);
	const [message, setMessage] = useState('');
	const [colorPickerIndex, setColorPickerIndex] = useState(null);
	const [searchInput, setSearchInput] = useState('');
	const [modalClasses, setModalClasses] = useState(modalInitialClass);
	const [modified, setModified] = useState(false);

	// Fetch the options for the first time render.
	useEffect(() => {
		if (!open) {
			return;
		}

		if (fetched) {
			return;
		}

		const ajaxParams = {
			action: 'get_custom_appearance_data',
			taxonomy,
		};

		axios
			.get(wcapf_admin_params.ajaxurl, {
				params: ajaxParams,
			})
			.then((res) => {
				const data = res.data.data;
				const synced = syncData(data);

				setLoading(false);
				setFetched(true);

				if (!isEmpty(synced)) {
					const classes = `${modalInitialClass} ajax-done`;

					setOptions(synced);
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

	const syncData = (unsynced) => {
		const synced = unsynced.map((option) => {
			const found = find(appearanceData, { id: option.value });

			let color = '';
			let image_id = '';
			let image_url = '';

			if (found) {
				color = found['color'];
				image_id = found['image_id'];
				image_url = found['image_url'];
			}

			return {
				...option,
				color,
				image_id,
				image_url,
			};
		});

		return synced;
	};

	// Sync the appearance data every time the modal opens.
	useEffect(() => {
		if (!open) {
			return;
		}

		if (!fetched) {
			return;
		}

		const synced = syncData(options);

		setOptions(synced);
	}, [open]);

	useEffect(() => {
		if (!searchInput.length) {
			const chunked = getChunks(options);

			setFilteredOptions(chunked);

			return;
		}

		const _filtered = options.filter((option) => {
			const { label, value } = option;

			return (
				label.toLowerCase().includes(searchInput.toLowerCase()) ||
				value
					.toString()
					.toLowerCase()
					.includes(searchInput.toLowerCase())
			);
		});

		const chunked = getChunks(_filtered);

		setFilteredOptions(chunked);
	}, [searchInput, options]);

	// Triggers after modal is closed.
	useEffect(() => {
		if (open) {
			return;
		}

		// Hide the color picker.
		setColorPickerIndex(null);

		// Remove media frames after modal is closed.
		removeMediaFrames(timeout);

		// Reset the modified state.
		setModified(false);
	}, [open]);

	const getChunks = (data) => {
		let _filtered = [];

		if (data.length > maxItems) {
			_filtered = data.slice(0, maxItems);
		} else {
			_filtered = data;
		}

		return _filtered;
	};

	const openModal = () => setOpen(true);

	const closeModal = () => setOpen(false);

	const openColorPicker = (index) => {
		if (colorPickerIndex === index) {
			setColorPickerIndex(null);
		} else {
			setColorPickerIndex(index);
		}
	};

	const markAsModified = () => {
		if (!modified) {
			setModified(true);
		}
	};

	const _handleChangeColor = (value, option) => {
		const _options = options.map((_option) => {
			if (_option.value === option.value) {
				return { ..._option, color: value };
			}

			return _option;
		});

		setOptions(_options);
		markAsModified();
	};

	const handleChangeColor = (value, option) => {
		_handleChangeColor(value, option);
	};

	const handleClearColor = (option) => {
		_handleChangeColor('', option);
	};

	const _handleChangeImage = (id, url, option) => {
		const _options = options.map((_option) => {
			if (_option.value === option.value) {
				return { ..._option, image_id: id, image_url: url };
			}

			return _option;
		});

		setOptions(_options);
		markAsModified();
	};

	const handleChangeImage = (attachment, option) => {
		const id = attachment.id;
		let url;

		if (undefined !== attachment.sizes.thumbnail) {
			url = attachment.sizes.thumbnail.url;
		} else if (undefined !== attachment.sizes.full) {
			url = attachment.sizes.full.url;
		}

		if (!url) {
			return;
		}

		_handleChangeImage(id, url, option);
	};

	const handleClearImage = (option) => {
		_handleChangeImage('', '', option);
	};

	const handleClearingAppearanceData = () => {
		let newOptions;

		if ('color' === type) {
			newOptions = options.map((option) => {
				return { ...option, color: '' };
			});
		} else {
			newOptions = options.map((option) => {
				return { ...option, image_id: '', image_url: '' };
			});
		}

		setOptions(newOptions);
		markAsModified();
	};

	const handleUpdatingAppearanceData = () => {
		const _appearanceData = [];

		options.forEach((option) => {
			const _item = {
				id: option['value'],
				color: option['color'],
				image_id: option['image_id'],
				image_url: option['image_url'],
			};

			_appearanceData.push(_item);
		});

		setActiveFilterData('custom_appearance_options', _appearanceData);
		closeModal();
	};

	let buttonLabel = __('Set Images', 'wc-ajax-product-filter');
	let modalTitle = __('Set Images', 'wc-ajax-product-filter');
	let clearBtnTitle = __('Clear Images', 'wc-ajax-product-filter');

	if ('color' === type) {
		buttonLabel = __('Set Colors', 'wc-ajax-product-filter');
		modalTitle = __('Set Colors', 'wc-ajax-product-filter');
		clearBtnTitle = __('Clear Colors', 'wc-ajax-product-filter');
	}

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
			} else if (isEmpty(options)) {
				description = __('No items found.', 'wc-ajax-product-filter');
			}
		}

		if (description) {
			return <p className='__description'>{description}</p>;
		}
	};

	const tableHeader = () => {
		const currentTotalItems = filteredOptions.length;
		const totalItems = options.length;

		const info = sprintf(
			__('Showing %d of %d items', 'wc-ajax-product-filter'),
			currentTotalItems,
			totalItems
		);

		return (
			<div className='__table_header'>
				<div className='__per_page_dropdown'>
					<p className='__description'>{info}</p>
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

	const tableFooter = () => {
		const totalItems = options.length;

		if (totalItems > maxItems) {
			return (
				<p className='__description large-data-hint'>
					{sprintf(
						__(
							"The number of total items is %d and rendering all of those might crash your browser. That's why we are showing the first %d items. Use the search field to find the non-rendered items.",
							'wc-ajax-product-filter'
						),
						totalItems,
						maxItems
					)}
				</p>
			);
		}
	};

	const rows = () => {
		if (isEmpty(filteredOptions)) {
			return (
				<tr>
					<td colSpan={2}>
						{__(
							'No items matched your search value',
							'wc-ajax-product-filter'
						)}
					</td>
				</tr>
			);
		} else {
			return filteredOptions.map((option, index) => {
				const { color, image_id, image_url } = option;

				return (
					<tr key={`custom-appearance-data-${index}`}>
						<td className='__term'>
							{option.label}
							<br />
							<span className='__info'>ID: {option.value}</span>
						</td>

						{'color' === type && (
							<td className='__color'>
								<button
									className='__color_picker_button'
									onClick={() => openColorPicker(index)}
									style={{ backgroundColor: color }}
								>
									<span className='__select_button'>
										{__(
											'Select Color',
											'wc-ajax-product-filter'
										)}
									</span>
								</button>
								{index === colorPickerIndex && (
									<>
										<button
											className='__color_picker_clear_button'
											onClick={() =>
												handleClearColor(option)
											}
										>
											{__(
												'Clear',
												'wc-ajax-product-filter'
											)}
										</button>
										<div className='__color_picker_wrapper'>
											<ColorPicker
												color={color}
												onChange={(value) =>
													handleChangeColor(
														value,
														option
													)
												}
											/>
										</div>
									</>
								)}
							</td>
						)}

						{'image' === type && (
							<td className='__image'>
								<ImagePicker
									imageId={image_id}
									imageUrl={image_url}
									onChange={(media) =>
										handleChangeImage(media, option)
									}
									onClear={() => handleClearImage(option)}
									renderAsFormField={false}
								/>
							</td>
						)}
					</tr>
				);
			});
		}
	};

	const modalContent = () => {
		if (fetched && !isEmpty(options)) {
			return (
				<>
					{tableHeader()}

					<div className={`__responsive_table ${type}`}>
						<table className='wp-list-table widefat fixed striped'>
							<thead>
								<tr>
									<th className='__term'>
										{__('Term', 'wc-ajax-product-filter')}
									</th>

									{'color' === type && (
										<th className='__color'>
											{__(
												'Color',
												'wc-ajax-product-filter'
											)}
										</th>
									)}

									{'image' === type && (
										<th className='__image'>
											{__(
												'Image',
												'wc-ajax-product-filter'
											)}
										</th>
									)}
								</tr>
							</thead>
							<tbody>{rows()}</tbody>
						</table>
					</div>

					{tableFooter()}
				</>
			);
		}
	};

	const modalFooter = () => {
		return (
			fetched &&
			!isEmpty(options) && (
				<div className='__modal_footer'>
					<div>
						<Button
							variant='secondary'
							onClick={handleClearingAppearanceData}
						>
							{clearBtnTitle}
						</Button>
					</div>
					<div>
						<Button
							variant='primary'
							onClick={handleUpdatingAppearanceData}
							disabled={!modified}
						>
							{__('Update', 'wc-ajax-product-filter')}
						</Button>
					</div>
				</div>
			)
		);
	};

	return (
		<>
			<Button
				variant='secondary'
				onClick={openModal}
				className='__custom_appearance_modal_btn'
			>
				{buttonLabel}
			</Button>
			{open && (
				<Modal
					title={modalTitle}
					onRequestClose={closeModal}
					shouldCloseOnClickOutside={false}
					shouldCloseOnEsc={false}
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

export default CustomAppearanceModal;
