import { Button, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ReactSortable } from 'react-sortablejs';
import { useState, useEffect } from '@wordpress/element';
import { dragHandle, cancelCircleFilled } from '@wordpress/icons';
import { isEmpty } from 'lodash';
import { useFilter } from '../../../FilterContext';

const NumberOptionsTable = () => {
	const {
		state: {
			activeFilterData: { number_get_options },
			filterOptions,
		},
		dispatch,
	} = useFilter();

	const [rows, setRows] = useState(filterOptions);

	useEffect(() => {
		setRows(filterOptions);
	}, [filterOptions]);

	const handleSort = () => {
		dispatch({ type: 'SET_FILTERS_OPTIONS', payload: rows });
	};

	const handleRemoveAll = () => {
		dispatch({ type: 'SET_FILTERS_OPTIONS', payload: [] });
	};

	const handleRemove = (row) => {
		const _filterOptions = filterOptions.filter(
			(option) => option.term_id !== row.term_id
		);

		dispatch({ type: 'SET_FILTERS_OPTIONS', payload: _filterOptions });
	};

	const addOption = () => {};

	const handleLabelChange = () => {};

	const table = () => {
		return (
			<table className='wp-list-table widefat fixed striped'>
				<thead>
					<tr>
						<th className='__drag_handle' />
						<th className='__value'>
							{__('Min Value', 'wc-ajax-product-filter')}
						</th>
						<th className='__value'>
							{__('Max Value', 'wc-ajax-product-filter')}
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
						const { term_id, slug, color, image } = row;

						const label = row.label ? row.label : row.name;

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
									<div>
										<input
											type='text'
											value={label}
											className='components-text-control__input'
											onChange={handleLabelChange}
										/>
									</div>
								</td>
								<td>
									<div>
										<input
											type='text'
											value={label}
											className='components-text-control__input'
											onChange={handleLabelChange}
										/>
									</div>
								</td>
								<td>
									<div>
										<input
											type='text'
											value={label}
											className='components-text-control__input'
											onChange={handleLabelChange}
										/>
									</div>
								</td>
								<td>
									<div>
										<button
											className='button-link button-link-delete'
											onClick={() => handleRemove(row)}
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
			{'manual_entry' === number_get_options && (
				<div className='__options_table'>
					<div className='__form_control'>
						<div className='__inner'>
							<div className='__label'>
								<label>
									{__(
										'Filter Options',
										'wc-ajax-product-filter'
									)}
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
						<Button variant='secondary' onClick={addOption}>
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
			)}
		</>
	);
};

export default NumberOptionsTable;
