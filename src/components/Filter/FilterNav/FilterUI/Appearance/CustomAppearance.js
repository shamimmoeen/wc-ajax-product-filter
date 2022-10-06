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
import DropdownSelect from '../../../../Field/DropdownSelect';
import ReactPaginate from 'react-paginate';

const perPageOptions = [
	{
		key: 10,
		name: 10,
	},
	{
		key: 25,
		name: 25,
	},
	{
		key: 50,
		name: 50,
	},
	{
		key: 100,
		name: 100,
	},
];

const ALLOWED_MEDIA_TYPES = ['image'];

const CustomAppearance = ({ type }) => {
	const [open, setOpen] = useState(true);
	const [loading, setLoading] = useState(true);
	const [options, setOptions] = useState([]);
	const [fetched, setFetched] = useState(false);
	const [message, setMessage] = useState('');
	const [color, setColor] = useState('');
	const [colorPickerIndex, setColorPickerIndex] = useState(null);
	const [searchInput, setSearchInput] = useState('');
	const [perPageData, setPerPageData] = useState(perPageOptions[1]);
	const [currentPage, setCurrentPage] = useState(1);
	const [currentItems, setCurrentItems] = useState([]);
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [modalClasses, setModalClasses] = useState(
		'__custom_appearance_modal'
	);

	useEffect(() => {
		if (!open) {
			return;
		}

		if (fetched) {
			return;
		}

		const ajaxParams = {
			action: 'get_custom_appearance_data',
			taxonomy: 'product_cat',
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
				setOptions(data);
				setIsFullScreen(true);
				setModalClasses('__custom_appearance_modal options-fetched');

				const perPage = perPageData.key;
				const splitted = data.slice(0, perPage);

				setCurrentItems(splitted);
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

	const openModal = () => setOpen(true);

	const closeModal = () => setOpen(false);

	const openColorPicker = (index) => {
		if (colorPickerIndex === index) {
			setColorPickerIndex(null);
		} else {
			setColorPickerIndex(index);
		}
	};

	const handlePageChange = ({ selected }) => {
		setCurrentPage(selected + 1);
	};

	const handleUpdate = () => {
		console.log(perPageData);
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
		return (
			<div className='__table_header'>
				<div className='__per_page_dropdown'>
					<span>{__('Show', 'wc-ajax-product-filter')}</span>
					<DropdownSelect
						options={perPageOptions}
						onChange={setPerPageData}
					/>
					<span>{__('items', 'wc-ajax-product-filter')}</span>
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
		const perPage = perPageData.key;
		const totalPages = Math.ceil(totalItems / perPage);
		const startIndex = currentPage > 1 ? currentPage * perPage : 1;
		const _endIndex = startIndex + (perPage - 1);
		const endIndex = _endIndex >= totalItems ? totalItems : _endIndex;

		const info = sprintf(
			__('Showing %d to %d of %d items', 'wc-ajax-product-filter'),
			startIndex,
			endIndex,
			totalItems
		);

		return (
			<div className='__table_footer'>
				<div className='__total_items_info'>
					<p
						className='description'
						dangerouslySetInnerHTML={{ __html: info }}
					/>
				</div>

				{totalPages > 1 && (
					<div className='__pagination_wrapper'>
						<ReactPaginate
							pageCount={totalPages}
							containerClassName='__pagination'
							onPageChange={handlePageChange}
						/>
					</div>
				)}
			</div>
		);
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
						<tbody>
							{currentItems.map((option, index) => {
								const mediaId = '';

								return (
									<tr key={`custom-appearance-data-${index}`}>
										<td className='__term'>
											{option.label}
											<br />
											<span className='__info'>
												ID: {option.value}
											</span>
										</td>

										{'color' === type && (
											<td className='__color'>
												<button
													className='__color_picker_button'
													onClick={() =>
														openColorPicker(index)
													}
												>
													<span className='__select_button'>
														{__(
															'Select Color',
															'wc-ajax-product-filter'
														)}
													</span>
												</button>
												{index === colorPickerIndex && (
													<div className='__color_picker_wrapper'>
														<ColorPicker
															color={color}
															onChange={setColor}
															enableAlpha
															defaultValue='#000'
															disableAlpha
														/>
													</div>
												)}
											</td>
										)}

										{'image' === type && (
											<td className='__image'>
												<MediaUpload
													onSelect={(media) =>
														console.log(media)
													}
													allowedTypes={
														ALLOWED_MEDIA_TYPES
													}
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
							})}
						</tbody>
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
		<div className='__custom_appearance_wrapper'>
			<Button variant='secondary' onClick={openModal}>
				{buttonLabel}
			</Button>
			{open && (
				<Modal
					title={modalTitle}
					onRequestClose={closeModal}
					shouldCloseOnClickOutside={false}
					isFullScreen={isFullScreen}
					className={modalClasses}
				>
					{modalLoader()}

					{modalInfo()}

					{modalContent()}

					{modalFooter()}
				</Modal>
			)}
		</div>
	);
};

export default CustomAppearance;
