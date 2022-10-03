import { Button, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ReactSortable } from 'react-sortablejs';
import { dragHandle, cancelCircleFilled } from '@wordpress/icons';
import { isEmpty } from 'lodash';
import { useFilter } from '../../../FilterContext';
import DropdownSelect from '../../../../Field/DropdownSelect';
import {
	getTableData,
	isTaxonomyFilters,
	productStatusOptions,
} from '../../../utils';

const ManualOptions = ({ openModal }) => {
	const {
		state: { filterType, activeFilterData, additionalData },
		dispatch,
	} = useFilter();

	const { default_time_periods } = additionalData;

	const { type, optionsKey } = getTableData(filterType, activeFilterData);

	const rows = activeFilterData[optionsKey];

	const emptyRow = () => {
		let row;

		if ('taxonomy-options' === type) {
			row = { value, label: '', color: '', image_id: '', image_url: '' };
		} else if ('product-status-options' === type) {
			const firstOption = productStatusOptions()[0];
			const value = firstOption.key;

			row = { value, label: '', color: '', image_id: '', image_url: '' };
		} else if ('number-options' === type) {
			row = { min_value: '', max_value: '', label: '' };
		} else if ('time-period-options' === type) {
			const firstOption = default_time_periods[0];
			const value = firstOption.key;

			row = { value, label: '' };
		}

		return row;
	};

	const setRows = (_rows) => {
		const _activeFilterData = {
			...activeFilterData,
			[optionsKey]: _rows,
		};

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: _activeFilterData,
		});
	};

	const handleAddOption = () => {
		const _activeFilterData = {
			...activeFilterData,
			[optionsKey]: [...rows, emptyRow()],
		};

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: _activeFilterData,
		});
	};

	const handleRemoveAll = () => {
		const _activeFilterData = {
			...activeFilterData,
			[optionsKey]: [],
		};

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: _activeFilterData,
		});
	};

	const handleRemove = (index) => {
		const _rows = [...rows];
		_rows.splice(index, 1);

		const _activeFilterData = {
			...activeFilterData,
			[optionsKey]: _rows,
		};

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: _activeFilterData,
		});
	};

	const handleChange = (value, index, key) => {
		const _rows = [...rows];
		_rows[index][key] = value;

		const _activeFilterData = {
			...activeFilterData,
			[optionsKey]: _rows,
		};

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: _activeFilterData,
		});
	};

	const handleSelectChange = (value, index, key) => {
		handleChange(value.key, index, key);
	};

	const handleInputChange = (e, index, key) => {
		handleChange(e.target.value, index, key);
	};

	// TODO: Make it dynamic.
	const display_type = 'checkbox';

	const tableHeader = () => {
		if ('taxonomy-options' === type) {
			return (
				<>
					<th className='__option'>
						{__('Term', 'wc-ajax-product-filter')}
					</th>
					<th className='__label'>
						{__('Label', 'wc-ajax-product-filter')}
					</th>
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
		} else if ('product-status-options' === type) {
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
		}
	};

	const inputField = (wrapperClass, index, key, value) => {
		return (
			<div className={wrapperClass}>
				<input
					type='text'
					value={value}
					className='components-text-control__input'
					onChange={(e) => handleInputChange(e, index, key)}
				/>
			</div>
		);
	};

	const selectField = (wrapperClass, index, key, options, value) => {
		return (
			<div className={wrapperClass}>
				<DropdownSelect
					options={options}
					value={value}
					onChange={(_value) =>
						handleSelectChange(_value, index, key)
					}
				/>
			</div>
		);
	};

	const tableBody = (row, rowIndex) => {
		if ('taxonomy-options' === type) {
			const { color, image_id, image_url, value, slug, label } = row;

			return (
				<>
					<td>
						<div className='__option_value'>
							<span className='slug'>
								{__('Slug', 'wc-ajax-product-filter')}:{` `}
								<span>{slug}</span>
							</span>
							<span className='id'>
								{__('ID', 'wc-ajax-product-filter')}:{` `}
								<span>{value}</span>
							</span>
						</div>
					</td>
					<td>{inputField('__label', rowIndex, 'label', label)}</td>
					{'color' === display_type && (
						<td>
							<div>{color}</div>
						</td>
					)}
					{'image' === display_type && (
						<td>
							<div>{image}</div>
						</td>
					)}
				</>
			);
		} else if ('product-status-options' === type) {
			const { color, image_id, image_url, value, label } = row;
			const options = productStatusOptions();
			let selected = options.find((option) => value === option.key);

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
			const options = default_time_periods;
			let selected = options.find((option) => value === option.key);

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
		}
	};

	const table = () => {
		return (
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
		);
	};

	const footerButtons = () => {
		return (
			<>
				{isTaxonomyFilters(filterType) || 'text-options' === type ? (
					<Button variant='secondary' onClick={openModal}>
						{__('Browse Options', 'wc-ajax-product-filter')}
					</Button>
				) : (
					<Button variant='secondary' onClick={handleAddOption}>
						{__('Add Option', 'wc-ajax-product-filter')}
					</Button>
				)}
			</>
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
			<div className='__button_group'>
				{footerButtons()}
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
