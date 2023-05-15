import { Button, Icon } from '@wordpress/components';
import { sprintf, __ } from '@wordpress/i18n';
import { ReactSortable } from 'react-sortablejs';
import {
	dragHandle,
	cancelCircleFilled,
	plus,
	closeSmall,
	// chevronDown,
} from '@wordpress/icons';
import { isEmpty } from 'lodash';
import classnames from 'classnames';
import {
	getTableData,
	orderDirectionOptions,
	swatchCanBeEnabled,
	tooltipCanBeEnabled,
} from '../../utils';
import Select from '../../../Field/Select';
import Text from '../../../Field/Text';
import ColorInput from '../../../Field/ColorInput';
import { PictureIcon } from '../../../SVGIcons';
import { useForm } from '../../FormContext';
import useFormData from '../../useFormData';
import useFormFilterData from '../../useFormFilterData';

const statusOptions = wcapf_admin_params.status_options;
const timePeriods = wcapf_admin_params.time_periods;
const sortByOptions = wcapf_admin_params.sort_by_options;
const metaKeys = wcapf_admin_params.meta_keys;
const metaTypes = wcapf_admin_params.meta_types;
const sortDirections = orderDirectionOptions();

const SLOT_NAME = 'popover-slot-for-options-table';

const ManualOptions = ({ index: filterIndex, openModal }) => {
	const { state, dispatch } = useForm();

	const { setDirty } = useFormData(state, dispatch);
	const { handleManualOptionsChange } = useFormFilterData(state, dispatch);

	const { formFilters } = state;

	const filter = formFilters[filterIndex];

	const { type: filterType } = filter;

	const { swatch_type, enable_tooltip } = filter;

	const { type, optionsKey } = getTableData(filterType, filter);

	const rows = filter[optionsKey];

	const hasTooltip = tooltipCanBeEnabled(filter) && '1' === enable_tooltip;
	const hasSwatch = swatchCanBeEnabled(filter);

	const emptyRow = () => {
		let row;

		if ('product-status-options' === type) {
			const firstOption = statusOptions[0];
			const value = firstOption.value;

			row = { value, label: '' };
		} else if ('text-options' === type) {
			row = { value: '', label: '' };
		} else if ('number-options' === type) {
			if ('rating' === filterType) {
				row = {
					min_value: '',
					max_value: '',
					label: '',
					secondary_label: '',
				};
			} else {
				row = { min_value: '', max_value: '', label: '' };
			}
		} else if ('time-period-options' === type) {
			const firstOption = timePeriods[0];
			const value = firstOption.value;

			row = { value, label: '' };
		} else if ('sort-by-options' === type) {
			const firstSortByOption = sortByOptions[0];
			const sortByValue = firstSortByOption.value;

			const firstSortDirection = sortDirections[1];
			const sortDirectionValue = firstSortDirection.value;

			row = {
				value: sortByValue,
				direction: sortDirectionValue,
				label: '',
			};
		} else if ('per-page-options' === type) {
			row = { value: '', label: '' };
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
		handleChange(value, index, key);
	};

	const handleRemoveSecondaryColor = (index) => {
		const _rows = rows.map((_row, _index) => {
			if (_index === index) {
				return {
					..._row,
					secondary_color_enabled: '',
					secondary_color: '',
				};
			}

			return _row;
		});

		updateRows(_rows);
	};

	const handleAddImage = (image_id, image_url, index) => {
		const _rows = rows.map((_row, _index) => {
			if (_index === index) {
				return { ..._row, image_id, image_url };
			}

			return _row;
		});

		updateRows(_rows);
	};

	const handleRemoveImage = (index) => {
		const _rows = rows.map((_row, _index) => {
			if (_index === index) {
				return { ..._row, image_id: '', image_url: '' };
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

	const handleSwatchChange = (index, type) => {
		const _rows = rows.map((_row, _index) => {
			if (_index === index) {
				return { ..._row, swatch: type };
			}

			return _row;
		});

		updateRows(_rows);
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
					{'rating' === filterType && (
						<th className='__secondary_label'>
							{__('Secondary Label', 'wc-ajax-product-filter')}
						</th>
					)}
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
		} else if ('sort-by-options' === type) {
			return (
				<>
					<th className='__sort_by'>
						{__('Sort by', 'wc-ajax-product-filter')}
					</th>
					<th className='__direction'>
						{__('Direction', 'wc-ajax-product-filter')}
					</th>
					<th className='__label'>
						{__('Label', 'wc-ajax-product-filter')}
					</th>
				</>
			);
		} else if ('per-page-options' === type) {
			return (
				<>
					<th className='__per_page'>
						{__('Per page', 'wc-ajax-product-filter')}
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

	const appearanceHeaders = () => {
		return (
			<>
				{hasTooltip && (
					<th className='__tooltip'>
						{__('Tooltip', 'wc-ajax-product-filter')}
					</th>
				)}

				{hasSwatch && (
					<th className='__color_image'>
						{__('Color / Image Swatch', 'wc-ajax-product-filter')}
					</th>
				)}
			</>
		);
	};

	const appearanceColumns = (row, rowIndex) => {
		const {
			tooltip,
			swatch,
			color,
			secondary_color_enabled,
			secondary_color,
			image_id,
			image_url,
		} = row;

		const currentSwatch = swatch ? swatch : swatch_type;

		const swatchButtons = () => {
			if ('color' === currentSwatch) {
				return (
					<div className='__swatch_switches'>
						{__('Color', 'wc-ajax-product-filter')}
						{` `}/{` `}
						<Button
							variant='link'
							onClick={() =>
								handleSwatchChange(rowIndex, 'image')
							}
						>
							{__('Image', 'wc-ajax-product-filter')}
						</Button>
					</div>
				);
			} else if ('image' === currentSwatch) {
				return (
					<div className='__swatch_switches'>
						<Button
							variant='link'
							onClick={() =>
								handleSwatchChange(rowIndex, 'color')
							}
						>
							{__('Color', 'wc-ajax-product-filter')}
						</Button>
						{` `}/{` `}
						{__('Image', 'wc-ajax-product-filter')}
					</div>
				);
			}
		};

		const secondaryColor = () => {
			if ('1' === secondary_color_enabled) {
				return (
					<>
						<ColorInput
							slotName={SLOT_NAME}
							value={secondary_color}
							onChange={(value) =>
								handleChange(value, rowIndex, 'secondary_color')
							}
						/>

						<Button
							variant='link'
							isDestructive
							onClick={() => handleRemoveSecondaryColor(rowIndex)}
						>
							<Icon icon={closeSmall} />
						</Button>
					</>
				);
			} else {
				return (
					<>
						<Button
							variant='link'
							isDestructive
							onClick={() => handleChange('', rowIndex, 'color')}
						>
							<Icon icon={closeSmall} />
						</Button>

						<Button
							isSmall
							icon={plus}
							onClick={() =>
								handleChange(
									'1',
									rowIndex,
									'secondary_color_enabled'
								)
							}
						/>
					</>
				);
			}
		};

		return (
			<>
				{hasTooltip && (
					<td>
						{inputField('__tooltip', rowIndex, 'tooltip', tooltip)}
					</td>
				)}

				{hasSwatch && (
					<td>
						<div className='__swatch_wrapper'>
							<div className='__primary_settings'>
								{/* <Button
									className='__more_settings'
									icon={chevronDown}
									isSmall
								></Button> */}

								{swatchButtons()}

								{'color' === currentSwatch && (
									<div className='__color'>
										<ColorInput
											slotName={SLOT_NAME}
											value={color}
											onChange={(value) =>
												handleChange(
													value,
													rowIndex,
													'color'
												)
											}
										/>

										{color && secondaryColor()}
									</div>
								)}

								{'image' === currentSwatch && (
									<div className='__image'>
										{image_id ? (
											<>
												<img
													className='__img_preview'
													src={image_url}
												/>

												<Button
													variant='link'
													isDestructive
													onClick={() =>
														handleRemoveImage(
															rowIndex
														)
													}
												>
													<Icon icon={closeSmall} />
												</Button>
											</>
										) : (
											<Button
												icon={PictureIcon}
												onClick={() =>
													openMediaUpload(rowIndex)
												}
											/>
										)}
									</div>
								)}
							</div>

							<div className='__more_settings'></div>
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
			const { min_value, max_value, label, secondary_label } = row;

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

					{'rating' === filterType && (
						<td>
							{inputField(
								'secondary_label',
								rowIndex,
								'secondary_label',
								secondary_label
							)}
						</td>
					)}
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
		} else if ('sort-by-options' === type) {
			const { value, direction, label, meta_key, meta_type } = row;

			const sortByValue = sortByOptions.find(
				(option) => value === option.value
			);

			const sortDirectionValue = sortDirections.find(
				(option) => direction === option.value
			);

			const isDisabled = 'rand' === value;

			const metaValue = metaKeys.find(
				(option) => meta_key === option.value
			);

			const metaType = metaTypes.find(
				(option) => meta_type === option.value
			);

			return (
				<>
					<td>
						{selectField(
							'__sort_by',
							rowIndex,
							'value',
							sortByOptions,
							sortByValue
						)}

						{'meta_value' === value && (
							<div className='__meta_info'>
								<div>
									{__('Meta Key', 'wc-ajax-product-filter')}
									{selectField(
										'__meta_key',
										rowIndex,
										'meta_key',
										metaKeys,
										metaValue
									)}
								</div>

								<div>
									{__('Meta Type', 'wc-ajax-product-filter')}
									{selectField(
										'__meta_type',
										rowIndex,
										'meta_type',
										metaTypes,
										metaType
									)}
								</div>
							</div>
						)}
					</td>

					<td>
						{!isDisabled &&
							selectField(
								'__direction',
								rowIndex,
								'direction',
								sortDirections,
								sortDirectionValue
							)}
					</td>

					<td>{inputField('__label', rowIndex, 'label', label)}</td>
				</>
			);
		} else if ('per-page-options' === type) {
			const { value, label } = row;

			return (
				<>
					<td>
						{inputField('__per_page', rowIndex, 'value', value)}
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
				</>
			);
		}
	};

	const table = () => {
		const classes = classnames(
			'__responsive_table',
			type,
			{ 'tooltip-enabled': hasTooltip },
			{ 'swatch-enabled': hasSwatch }
		);

		return (
			<>
				<div className={classes}>
					<table className='wp-list-table widefat fixed striped'>
						<thead>
							<tr>
								<th className='__drag_handle' />
								{tableHeader()}
								{appearanceHeaders()}
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
											<div className='__drag_handler_wrapper'>
												<Icon
													icon={dragHandle}
													className='__drag_handler'
												/>
											</div>
										</td>
										{tableBody(row, rowIndex)}
										{appearanceColumns(row, rowIndex)}
										<td>
											<div className='__remove_row_button_wrapper'>
												<button
													className='button-link button-link-delete'
													onClick={() =>
														handleRemove(rowIndex)
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
										</td>
									</tr>
								);
							})}
						</ReactSortable>
					</table>
				</div>
			</>
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

	const withLabelAndTooltips = ['taxonomy', 'product-status', 'post-meta'];

	if ('rating' === filterType) {
		description = sprintf(
			__(
				'Add the options that will be available to the filter. To show stars in the label, put <code>[star]</code> for filled star, <code>[star-empty]</code> for empty star and <code>[star-half]</code> for half star.',
				'wc-ajax-product-filter'
			)
		);
	} else if (withLabelAndTooltips.includes(filterType)) {
		description = sprintf(
			__(
				'Add the options that will be available to the filter. <b>Note:</b> Leave the label and tooltip fields empty if you do not want to override.',
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
