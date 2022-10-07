import { sprintf, __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import {
	Button,
	ColorPicker,
	Modal,
	Spinner,
	SearchControl,
} from '@wordpress/components';
import { isEmpty } from 'lodash';
import axios from 'axios';
import { MediaUpload } from '@wordpress/media-utils';

const ALLOWED_MEDIA_TYPES = ['image'];
const modalInitialClass = '__custom_appearance_modal';

const CustomAppearanceModal = ({ type, taxonomy }) => {
	const [open, setOpen] = useState(true);
	const [loading, setLoading] = useState(true);
	const [fetched, setFetched] = useState(false);
	const [options, setOptions] = useState([]);
	const [filteredOptions, setFilteredOptions] = useState([]);
	const [message, setMessage] = useState('');
	const [color, setColor] = useState('');
	const [colorPickerIndex, setColorPickerIndex] = useState(null);
	const [searchInput, setSearchInput] = useState('');
	const [modalClasses, setModalClasses] = useState(modalInitialClass);

	const maxItems =
		parseInt(wcapf_admin_params.max_items_in_custom_appearance_modal) || 99;

	const MAX_ALLOWED_ITEMS_TO_RENDER = maxItems < 1 ? 99 : maxItems;

	const timeout =
		parseInt(wcapf_admin_params.timeout_for_cleaning_wp_media_frames) ||
		100;

	const TIMEOUT_FOR_CLEANING_WP_MEDIA_FRAMES = timeout < 99 ? 100 : timeout;

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

		// Fetch the options.
		axios
			.get(wcapf_admin_params.ajaxurl, {
				params: ajaxParams,
			})
			.then((res) => {
				const data = res.data.data;

				setLoading(false);
				setFetched(true);

				if (!isEmpty(data)) {
					setOptions(data);

					setModalClasses(`${modalInitialClass} options-fetched`);

					const filtered = getFirstSafeItems(data);

					setFilteredOptions(filtered);
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

	useEffect(() => {
		let _options = [...options];

		if (!searchInput.length) {
			const filtered = getFirstSafeItems(_options);

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

		const filtered = getFirstSafeItems(_filtered);

		setFilteredOptions(filtered);
	}, [searchInput]);

	useEffect(() => {
		if (open) {
			return;
		}

		const $ = jQuery;

		$('body').children('button.browser').remove();
		$('body').children('div[id^="__wp-uploader-id"]').remove();

		setTimeout(() => {
			$('body').children('div.wp-uploader-browser').remove();
		}, TIMEOUT_FOR_CLEANING_WP_MEDIA_FRAMES);
	}, [open]);

	const getFirstSafeItems = (data) => {
		let _filtered = [];

		if (data.length > MAX_ALLOWED_ITEMS_TO_RENDER) {
			_filtered = data.slice(0, MAX_ALLOWED_ITEMS_TO_RENDER);
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

	const handleColorChange = (value) => {
		console.log(value);
	};

	const handleUpdate = () => {
		console.log(options.length);
	};

	let buttonLabel = __('Set Images', 'wc-ajax-product-filter');
	let modalTitle = __('Set Images', 'wc-ajax-product-filter');

	if ('color' === type) {
		buttonLabel = __('Set Colors', 'wc-ajax-product-filter');
		modalTitle = __('Set Colors', 'wc-ajax-product-filter');
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

		if (totalItems > MAX_ALLOWED_ITEMS_TO_RENDER) {
			return (
				<p className='description large-data-hint'>
					{sprintf(
						__(
							"The number of total items is %d and rendering all of those might crash your browser. That's why we are showing the first %d items. Use the search field to find the items that were not rendered.",
							'wc-ajax-product-filter'
						),
						totalItems,
						MAX_ALLOWED_ITEMS_TO_RENDER
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
				const mediaId = '';

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
										<button>
											{__(
												'Clear',
												'wc-ajax-product-filter'
											)}
										</button>
										<div className='__color_picker_wrapper'>
											<ColorPicker
												color={color}
												onChange={setColor}
												defaultValue=''
												disableAlpha
												onChangeComplete={
													handleColorChange
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
									onSelect={(media) => console.log(media)}
									allowedTypes={ALLOWED_MEDIA_TYPES}
									value={mediaId}
									render={({ open }) => (
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
									)}
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

					<table className='wp-list-table widefat fixed striped'>
						<thead>
							<tr>
								<th className='__term'>
									{__('Term', 'wc-ajax-product-filter')}
								</th>

								{'color' === type && (
									<th className='__color'>
										{__('Color', 'wc-ajax-product-filter')}
									</th>
								)}

								{'image' === type && (
									<th className='__image'>
										{__('Image', 'wc-ajax-product-filter')}
									</th>
								)}
							</tr>
						</thead>
						<tbody>{rows()}</tbody>
					</table>

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
						<Button variant='secondary' onClick={handleUpdate}>
							{__('Clear Colors', 'wc-ajax-product-filter')}
						</Button>
					</div>
					<div>
						<Button variant='primary' onClick={handleUpdate}>
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
