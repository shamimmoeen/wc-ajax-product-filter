import { Button, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ReactSortable } from 'react-sortablejs';
import { dragHandle, cancelCircleFilled } from '@wordpress/icons';
import { isEmpty } from 'lodash';
import { useFilter } from '../../../FilterContext';
import DropdownSelect from '../../../../Field/DropdownSelect';

const FilterOptions = () => {
	const {
		state: { filterType, activeFilterData, additionalData },
		dispatch,
	} = useFilter();

	const { default_time_periods } = additionalData;

	const getOptionsKey = () => {
		let key;

		if ('post-meta' === filterType) {
			if ('date' === value_type) {
				key = 'time_period_options';
			}
		}

		return key;
	};

	const { value_type } = activeFilterData;
	const rows = activeFilterData[getOptionsKey()];

	const emptyRow = () => {
		let row;

		if ('post-meta' === filterType) {
			if ('date' === value_type) {
				const firstOption = default_time_periods[0];
				const value = firstOption.key;

				row = { value, label: '' };
			}
		}

		return row;
	};

	const setRows = (_rows) => {
		const _activeFilterData = {
			...activeFilterData,
			[getOptionsKey()]: _rows,
		};

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: _activeFilterData,
		});
	};

	const handleAddOption = () => {
		const _activeFilterData = {
			...activeFilterData,
			[getOptionsKey()]: [...rows, emptyRow()],
		};

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: _activeFilterData,
		});
	};

	const handleRemoveAll = () => {
		const _activeFilterData = {
			...activeFilterData,
			[getOptionsKey()]: [],
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
			[getOptionsKey()]: _rows,
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
			[getOptionsKey()]: _rows,
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

	const tableHeader = () => {
		if ('post-meta' === filterType) {
			if ('date' === value_type) {
				return (
					<>
						<th className='__time_period'>
							{__('Period', 'wc-ajax-product-filter')}
						</th>
						<th className='__time_period_label'>
							{__('Label', 'wc-ajax-product-filter')}
						</th>
					</>
				);
			}
		}
	};

	const tableBody = (row, rowIndex) => {
		if ('post-meta' === filterType) {
			if ('date' === value_type) {
				const { value, label } = row;
				const options = default_time_periods;
				let selected = options.find((option) => value === option.key);

				return (
					<>
						<td>
							<div className='__time_period'>
								<DropdownSelect
									options={options}
									value={selected}
									onChange={(_value) =>
										handleSelectChange(
											_value,
											rowIndex,
											'value'
										)
									}
								/>
							</div>
						</td>
						<td>
							<div className='__time_period_label'>
								<input
									type='text'
									value={label}
									className='components-text-control__input'
									onChange={(e) =>
										handleInputChange(e, rowIndex, 'label')
									}
								/>
							</div>
						</td>
					</>
				);
			}
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

	let description = __(
		'Add the options that will be available to the filter.',
		'wc-ajax-product-filter'
	);

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
				<p className='description'>{description}</p>
			</div>
			{!isEmpty(rows) && table()}
			<div className='__button_group'>
				<Button variant='secondary' onClick={handleAddOption}>
					{__('Add Option', 'wc-ajax-product-filter')}
				</Button>
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

export default FilterOptions;
