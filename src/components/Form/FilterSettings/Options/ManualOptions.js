import { Button, Icon } from '@wordpress/components';
import { sprintf, __ } from '@wordpress/i18n';
import { ReactSortable } from 'react-sortablejs';
import {
	dragHandle,
	cancelCircleFilled,
	plus,
	closeSmall,
} from '@wordpress/icons';
import { isEmpty } from 'lodash';
import { getTableData } from '../../utils';
import Select from '../../../Field/Select';
import Text from '../../../Field/Text';
import ColorInput from '../../../Field/ColorInput';
import { PictureIcon } from '../../../SVGIcons';
import { useForm } from '../../FormContext';
import useFormData from '../../useFormData';
import useFormFilterData from '../../useFormFilterData';

const statusOptions = wcapf_admin_params.status_options;
const timePeriods = wcapf_admin_params.time_periods;

const ManualOptions = ({ index: filterIndex, openModal }) => {
	const { state, dispatch } = useForm();

	const { setDirty } = useFormData(state, dispatch);
	const { handleManualOptionsChange } = useFormFilterData(state, dispatch);

	const { formFilters } = state;

	const filter = formFilters[filterIndex];

	const { type: filterType } = filter;

	const { display_type, enable_tooltip } = filter;

	const { type, optionsKey } = getTableData(filterType, filter);

	const rows = filter[optionsKey];

	const emptyRow = () => {
		let row;

		if ('product-status-options' === type) {
			const firstOption = statusOptions[0];
			const value = firstOption.value;

			row = { value, label: '' };
		} else if ('text-options' === type) {
			row = { value: '', label: '' };
		} else if ('number-options' === type) {
			row = { min_value: '', max_value: '', label: '' };
		} else if ('time-period-options' === type) {
			const firstOption = timePeriods[0];
			const value = firstOption.value;

			row = { value, label: '' };
		}

		return row;
	};

	const updateRows = (_rows, makeDirty = true) => {
		handleManualOptionsChange(_rows, optionsKey, filterIndex, makeDirty);
	};

	/**
	 * @source https://github.com/SortableJS/react-sortablejs/issues/210#issuecomment-880414814
	 */
	const setRows = (_rows, sortable, store) => {
		if (!sortable) {
			return;
		}

		if (!store.dragging) {
			return;
		}

		updateRows(_rows, false);
	};

	const handleAddOption = () => {
		const _rows = [...rows, emptyRow()];

		updateRows(_rows);
	};

	const handleRemoveAll = () => {
		updateRows([]);
	};

	const handleRemove = (index) => {
		const _rows = [...rows];
		_rows.splice(index, 1);

		updateRows(_rows);
	};

	const handleChange = (value, index, key) => {
		if (rows[index][key] === value) {
			return;
		}

		const _rows = rows.map((_row, _index) => {
			if (_index === index) {
				return { ..._row, [key]: value };
			}

			return _row;
		});

		updateRows(_rows);
	};

	const handleSelectChange = (selected, index, key) => {
		handleChange(selected.value, index, key);
	};

	const handleInputChange = (value, key, index) => {
		console.log(key, index, value);
		handleChange(value, index, key);
	};

	const handleRemoveSecondaryColor = (index) => {
		const _rows = rows.map((_row, _index) => {
			if (_index === index) {
				return {
					..._row,
					secondaryColorEnabled: '',
					secondaryColor: '',
				};
			}

			return _row;
		});

		updateRows(_rows);
	};

	const handleAddImage = (imageId, imageUrl, index) => {
		const _rows = rows.map((_row, _index) => {
			if (_index === index) {
				return { ..._row, imageId, imageUrl };
			}

			return _row;
		});

		updateRows(_rows);
	};

	const handleRemoveImage = (index) => {
		const _rows = rows.map((_row, _index) => {
			if (_index === index) {
				return { ..._row, imageId: '', imageUrl: '' };
			}

			return _row;
		});

		updateRows(_rows);
	};

	const openMediaUpload = (rowIndex) => {
		// https://rudrastyh.com/wordpress/customizable-media-uploader.html
		const customUploader = wp
			.media({
				library: { type: 'image' },
				multiple: false,
			})
			.on('select', function () {
				const attachment = customUploader
					.state()
					.get('selection')
					.first()
					.toJSON();

				const { id, url } = attachment;

				handleAddImage(id, url, rowIndex);
			});

		customUploader.open();
	};

	const tableHeader = () => {
		if ('product-status-options' === type) {
			return (
				<>
					<th className='__product_status'>
						{__('Status', 'wc-ajax-product-filter')}
					</th>
					<th className='__label'>
						{__('Label', 'wc-ajax-product-filter')}
					</th>
				</>
			);
		} else if ('text-options' === type) {
			return (
				<>
					<th className='__value'>
						{__('Value', 'wc-ajax-product-filter')}
					</th>
					<th className='__label'>
						{__('Label', 'wc-ajax-product-filter')}
					</th>
				</>
			);
		} else if ('number-options' === type) {
			let classes = '__label';

			if ('rating' === filterType) {
				classes = '__rating_label';
			}

			return (
				<>
					<th className='__min_value'>
						{__('Min Value', 'wc-ajax-product-filter')}
					</th>
					<th className='__max_value'>
						{__('Max Value', 'wc-ajax-product-filter')}
					</th>
					<th className={classes}>
						{__('Label', 'wc-ajax-product-filter')}
					</th>
				</>
			);
		} else if ('time-period-options' === type) {
			return (
				<>
					<th className='__time_period'>
						{__('Period', 'wc-ajax-product-filter')}
					</th>
					<th className='__label'>
						{__('Label', 'wc-ajax-product-filter')}
					</th>
				</>
			);
		} else if ('taxonomy-options' === type) {
			return (
				<>
					<th className='__term'>
						{__('Term', 'wc-ajax-product-filter')}
					</th>
					<th className='__label'>
						{__('Label', 'wc-ajax-product-filter')}
					</th>
					{'1' === enable_tooltip && (
						<th className='__tooltip'>
							{__('Tooltip', 'wc-ajax-product-filter')}
						</th>
					)}
					{'color' === display_type && (
						<th className='__color'>
							{__('Color', 'wc-ajax-product-filter')}
						</th>
					)}
					{'image' === display_type && (
						<th className='__image'>
							{__('Image', 'wc-ajax-product-filter')}
						</th>
					)}
				</>
			);
		} else if ('post-author-options' === type) {
			return (
				<>
					<th className='__author'>
						{__('Author', 'wc-ajax-product-filter')}
					</th>
					<th className='__label'>
						{__('Label', 'wc-ajax-product-filter')}
					</th>
					{'1' === enable_tooltip && (
						<th className='__tooltip'>
							{__('Tooltip', 'wc-ajax-product-filter')}
						</th>
					)}
					{'color' === display_type && (
						<th className='__color'>
							{__('Color', 'wc-ajax-product-filter')}
						</th>
					)}
					{'image' === display_type && (
						<th className='__image'>
							{__('Image', 'wc-ajax-product-filter')}
						</th>
					)}
				</>
			);
		}
	};

	const inputField = (wrapperClass, index, key, value) => {
		return (
			<div className={wrapperClass}>
				<Text
					id={key}
					index={index}
					value={value}
					onChange={handleInputChange}
					renderAsFormField={false}
				/>
			</div>
		);
	};

	const selectField = (wrapperClass, index, key, options, value) => {
		return (
			<div className={wrapperClass}>
				<Select
					options={options}
					value={value}
					onChange={(selected) =>
						handleSelectChange(selected, index, key)
					}
					portalTarget={document.querySelector('body')}
				/>
			</div>
		);
	};

	const appearanceColumns = (row, rowIndex) => {
		const {
			tooltip,
			color,
			secondaryColorEnabled,
			secondaryColor,
			imageId,
			imageUrl,
		} = row;

		return (
			<>
				{'1' === enable_tooltip && (
					<td>
						{inputField('__tooltip', rowIndex, 'tooltip', tooltip)}
					</td>
				)}

				{'color' === display_type && (
					<td>
						<div className='__color'>
							<ColorInput
								value={color}
								onChange={(value) =>
									handleChange(value, rowIndex, 'color')
								}
							/>

							{'1' === secondaryColorEnabled ? (
								<>
									<ColorInput
										value={secondaryColor}
										onChange={(value) =>
											handleChange(
												value,
												rowIndex,
												'secondaryColor'
											)
										}
									/>

									<Button
										variant='link'
										isDestructive
										onClick={() =>
											handleRemoveSecondaryColor(rowIndex)
										}
									>
										<Icon icon={closeSmall} />
									</Button>
								</>
							) : (
								<Button
									isSmall
									icon={plus}
									onClick={() =>
										handleChange(
											'1',
											rowIndex,
											'secondaryColorEnabled'
										)
									}
								/>
							)}
						</div>
					</td>
				)}

				{'image' === display_type && (
					<td>
						<div className='__image'>
							{imageId ? (
								<>
									<img
										className='__img_preview'
										src={imageUrl}
									/>

									<Button
										variant='link'
										isDestructive
										onClick={() =>
											handleRemoveImage(rowIndex)
										}
									>
										<Icon icon={closeSmall} />
									</Button>
								</>
							) : (
								<Button
									icon={PictureIcon}
									onClick={() => openMediaUpload(rowIndex)}
								/>
							)}
						</div>
					</td>
				)}
			</>
		);
	};

	const tableBody = (row, rowIndex) => {
		if ('product-status-options' === type) {
			const { value, label } = row;
			const options = statusOptions;
			const selected = options.find((option) => value === option.value);

			return (
				<>
					<td>
						{selectField(
							'__product_status',
							rowIndex,
							'value',
							options,
							selected
						)}
					</td>
					<td>{inputField('__label', rowIndex, 'label', label)}</td>
				</>
			);
		} else if ('text-options' === type) {
			const { value, label } = row;

			return (
				<>
					<td>{inputField('__value', rowIndex, 'value', value)}</td>
					<td>{inputField('__label', rowIndex, 'label', label)}</td>
				</>
			);
		} else if ('number-options' === type) {
			const { min_value, max_value, label } = row;

			let classes = '__label';

			if ('rating' === filterType) {
				classes = '__rating_label';
			}

			return (
				<>
					<td>
						{inputField(
							'__min_value',
							rowIndex,
							'min_value',
							min_value
						)}
					</td>
					<td>
						{inputField(
							'__max_value',
							rowIndex,
							'max_value',
							max_value
						)}
					</td>
					<td>{inputField(classes, rowIndex, 'label', label)}</td>
				</>
			);
		} else if ('time-period-options' === type) {
			const { value, label } = row;
			const options = timePeriods;
			const selected = options.find((option) => value === option.value);

			return (
				<>
					<td>
						{selectField(
							'__time_period',
							rowIndex,
							'value',
							options,
							selected
						)}
					</td>
					<td>{inputField('__label', rowIndex, 'label', label)}</td>
				</>
			);
		} else if ('taxonomy-options' === type) {
			const { name, value, label } = row;

			return (
				<>
					<td>
						<span className='__term_name'>{name}</span>
						<span className='__term_id'>
							{sprintf(
								__('ID: %d', 'wc-ajax-product-filter'),
								value
							)}
						</span>
					</td>

					<td>{inputField('__label', rowIndex, 'label', label)}</td>

					{appearanceColumns(row, rowIndex)}
				</>
			);
		} else if ('post-author-options' === type) {
			const { name, value, label } = row;

			return (
				<>
					<td>
						<span className='__author_name'>{name}</span>
						<span className='__author_id'>
							{sprintf(
								__('ID: %d', 'wc-ajax-product-filter'),
								value
							)}
						</span>
					</td>

					<td>{inputField('__label', rowIndex, 'label', label)}</td>

					{appearanceColumns(row, rowIndex)}
				</>
			);
		}
	};

	const table = () => {
		const classes = `__responsive_table ${type}`;

		return (
			<div className={classes}>
				<table className='wp-list-table widefat fixed striped'>
					<thead>
						<tr>
							<th className='__drag_handle' />
							{tableHeader()}
							<th className='__action' />
						</tr>
					</thead>
					<ReactSortable
						list={rows}
						setList={setRows}
						tag={'tbody'}
						direction={'vertical'}
						handle='.__drag_handler'
						onSort={setDirty}
					>
						{rows.map((row, rowIndex) => {
							return (
								<tr key={`filter-option-${rowIndex}`}>
									<td>
										<div>
											<Icon
												icon={dragHandle}
												className='__drag_handler'
											/>
										</div>
									</td>
									{tableBody(row, rowIndex)}
									<td>
										<div>
											<button
												className='button-link button-link-delete'
												onClick={() =>
													handleRemove(rowIndex)
												}
											>
												<Icon
													icon={cancelCircleFilled}
													size={20}
												/>
											</button>
										</div>
									</td>
								</tr>
							);
						})}
					</ReactSortable>
				</table>
			</div>
		);
	};

	const actionButtons = () => {
		const browseOptionsBtnLabel = __(
			'Browse Options',
			'wc-ajax-product-filter'
		);

		const onlyBrowse = ['taxonomy-options', 'post-author-options'];

		return (
			<div>
				{onlyBrowse.includes(type) ? (
					<Button variant='secondary' onClick={openModal}>
						{browseOptionsBtnLabel}
					</Button>
				) : (
					<>
						<Button variant='secondary' onClick={handleAddOption}>
							{__('Add Option', 'wc-ajax-product-filter')}
						</Button>
						{'text-options' === type && (
							<Button variant='secondary' onClick={openModal}>
								{browseOptionsBtnLabel}
							</Button>
						)}
					</>
				)}
			</div>
		);
	};

	let description = __(
		'Add the options that will be available to the filter.',
		'wc-ajax-product-filter'
	);

	if ('rating' === filterType) {
		description = sprintf(
			__(
				'Add the options that will be available to the filter. To show stars in the label, put <code>[star]</code> for filled star, <code>[star-empty]</code> for empty star and <code>[star-half]</code> for half star.',
				'wc-ajax-product-filter'
			)
		);
	}

	return (
		<div className='__options_table'>
			<div className='__form_control'>
				<div className='__inner'>
					<div className='__label'>
						<label>
							{__('Filter Options', 'wc-ajax-product-filter')}
						</label>
					</div>
					<div className='__wrapper'>
						<div className='__input_wrapper' />
					</div>
				</div>
				<p
					className='description'
					dangerouslySetInnerHTML={{ __html: description }}
				/>
			</div>
			{!isEmpty(rows) && table()}
			<div className='__action_buttons'>
				{actionButtons()}
				{!isEmpty(rows) && (
					<Button
						variant='tertiary'
						isDestructive
						onClick={handleRemoveAll}
					>
						{__('Remove All', 'wc-ajax-product-filter')}
					</Button>
				)}
			</div>
		</div>
	);
};

export default ManualOptions;
