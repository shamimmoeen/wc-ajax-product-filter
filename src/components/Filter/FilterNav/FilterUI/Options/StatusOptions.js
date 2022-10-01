import { Button, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ReactSortable } from 'react-sortablejs';
import { useState, useEffect } from '@wordpress/element';
import { dragHandle, cancelCircleFilled } from '@wordpress/icons';
import { isEmpty } from 'lodash';
import { useFilter } from '../../../FilterContext';
import { productStatusOptions } from '../../../utils';
import DropdownSelect from '../../../../Field/DropdownSelect';

const StatusOptions = () => {
	const {
		state: { filterType, filterOptions },
		dispatch,
	} = useFilter();

	const [rows, setRows] = useState(filterOptions);

	useEffect(() => {
		setRows(filterOptions);
	}, [filterOptions]);

	const handleAddOption = () => {
		const newOption = { min_value: '', max_value: '', label: '' };
		const _filterOptions = [...filterOptions, newOption];

		dispatch({ type: 'SET_FILTERS_OPTIONS', payload: _filterOptions });
	};

	const handleSort = () => {
		dispatch({ type: 'SET_FILTERS_OPTIONS', payload: rows });
	};

	const handleRemoveAll = () => {
		dispatch({ type: 'SET_FILTERS_OPTIONS', payload: [] });
	};

	const handleRemove = (index) => {
		const _filterOptions = [...filterOptions];
		_filterOptions.splice(index, 1);

		dispatch({ type: 'SET_FILTERS_OPTIONS', payload: _filterOptions });
	};

	const handleInputChange = (e, index, key) => {
		const _filterOptions = [...filterOptions];
		_filterOptions[index][key] = e.target.value;

		dispatch({ type: 'SET_FILTERS_OPTIONS', payload: _filterOptions });
	};

	const table = () => {
		const statusOptions = productStatusOptions();

		return (
			<table className='wp-list-table widefat fixed striped'>
				<thead>
					<tr>
						<th className='__drag_handle' />
						<th className='__product_status'>
							{__('Status', 'wc-ajax-product-filter')}
						</th>
						<th className='__label'>
							{__('Label', 'wc-ajax-product-filter')}
						</th>
						<th className='__action' />
					</tr>
				</thead>
				<ReactSortable
					list={rows}
					setList={setRows}
					tag={'tbody'}
					direction={'vertical'}
					handle='.__drag_handler'
					onSort={handleSort}
				>
					{rows.map((row, rowIndex) => {
						const { color, image_id, image_url, value, label } =
							row;

						const status = statusOptions.find(
							(option) => option.key === value
						);

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
								<td>
									<div className='__product_status'>
										<DropdownSelect
											options={statusOptions}
											value={status}
										/>
									</div>
								</td>
								<td>
									<div className='__label'>
										<input
											type='text'
											value={label}
											className='components-text-control__input'
											onChange={(e) =>
												handleInputChange(
													e,
													rowIndex,
													'label'
												)
											}
										/>
									</div>
								</td>
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

	return (
		<>
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
					<p className='description'>
						{__(
							'Add the options that will be available to the filter.',
							'wc-ajax-product-filter'
						)}
					</p>
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
		</>
	);
};

export default StatusOptions;
