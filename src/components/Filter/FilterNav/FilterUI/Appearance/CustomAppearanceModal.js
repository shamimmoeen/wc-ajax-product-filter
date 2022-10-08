import { sprintf, __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import {
	Button,
	Modal,
	Spinner,
	SearchControl,
	ColorPicker,
	Icon,
} from '@wordpress/components';
import { MediaUpload } from '@wordpress/media-utils';
import { cancelCircleFilled } from '@wordpress/icons';
import axios from 'axios';
import { isEmpty, find } from 'lodash';
import { useFilter } from '../../../FilterContext';
import useFilterData from '../../../useFilterData';
import {
	getNoOfMaxTermsToRender,
	getTimeoutForRemovingMediaFrames,
	removeMediaFrames,
} from '../../../../utils';

const ALLOWED_MEDIA_TYPES = ['image'];
const modalInitialClass = '__custom_appearance_modal';

const CustomAppearanceModal = ({ type, taxonomy, appearanceData }) => {
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

	const {
		state: { activeFilterData },
		dispatch,
	} = useFilter();

	const { setActiveFilterData } = useFilterData(activeFilterData, dispatch);

	const maxItems = getNoOfMaxTermsToRender();
	const timeout = getTimeoutForRemovingMediaFrames();

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
					const classes = `${modalInitialClass} options-fetched`;

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

			option['color'] = color;
			option['image_id'] = image_id;
			option['image_url'] = image_url;

			return option;
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

		const unsynced = [...options];
		const synced = syncData(unsynced);

		setOptions(synced);
	}, [open]);

	useEffect(() => {
		let _options = [...options];

		if (!searchInput.length) {
			const filtered = getChunks(_options);

			setFilteredOptions(filtered);

			return;
		}

		const _filtered = _options.filter((option) => {
			const { label, value } = option;

			return (
				label.toLowerCase().includes(searchInput.toLowerCase()) ||
				value
					.toString()
					.toLowerCase()
					.includes(searchInput.toLowerCase())
			);
		});

		const filtered = getChunks(_filtered);

		setFilteredOptions(filtered);
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
		const _options = [...options];
		const index = _options.findIndex(
			(_option) => _option.value === option.value
		);

		_options[index]['color'] = value;

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
		const _options = [...options];
		const index = _options.findIndex(
			(_option) => _option.value === option.value
		);

		_options[index]['image_id'] = id;
		_options[index]['image_url'] = url;

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
		let _options = [...options];
		let newOptions = [];

		if ('color' === type) {
			newOptions = _options.map((option) => {
				option['color'] = '';

				return option;
			});
		} else {
			newOptions = _options.map((option) => {
				option['image_id'] = '';
				option['image_url'] = '';

				return option;
			});
		}

		setOptions(newOptions);
		markAsModified();
	};

	const handleUpdatingAppearanceData = () => {
		const _appearanceData = [...appearanceData];

		const newAppearanceData = _appearanceData.map((option) => {
			const found = find(options, { value: option.id });

			if ('color' === type) {
				option['color'] = found['color'];
			} else {
				option['image_id'] = found['image_id'];
				option['image_url'] = found['image_url'];
			}

			return option;
		});

		setActiveFilterData('custom_appearance_options', newAppearanceData);
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
			return <p className='description'>{description}</p>;
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
					<p className='description'>{info}</p>
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
				<p className='description large-data-hint'>
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
								<MediaUpload
									onSelect={(media) =>
										handleChangeImage(media, option)
									}
									allowedTypes={ALLOWED_MEDIA_TYPES}
									value={image_id}
									render={({ open }) => {
										if (image_id) {
											return (
												<div className='__buttons_group'>
													<Button
														variant='secondary'
														className='__thumbnail'
														onClick={open}
													>
														<span
															style={{
																backgroundImage: `url(${image_url})`,
															}}
														></span>
													</Button>
													<button
														className='button-link button-link-delete'
														onClick={() =>
															handleClearImage(
																option
															)
														}
													>
														<Icon
															icon={
																cancelCircleFilled
															}
															size={20}
														/>
													</button>
												</div>
											);
										} else {
											return (
												<Button
													className='__image_picker_button'
													variant='secondary'
													onClick={open}
												>
													{__(
														'Select Image',
														'wc-ajax-product-filter'
													)}
												</Button>
											);
										}
									}}
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
