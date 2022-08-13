import { Button, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useFilter } from '../../FilterContext';
import { ReactSortable } from 'react-sortablejs';
import { useState, useEffect } from '@wordpress/element';
import { dragHandle, cancelCircleFilled, row } from '@wordpress/icons';
import { isEmpty } from 'lodash';

const OptionsTable = ({ openModal }) => {
	const {
		state: {
			activeFilterData: { get_options, display_type },
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

	const handleLabelChange = () => {};

	const table = () => {
		return (
			<table className='wp-list-table widefat fixed striped'>
				<thead>
					<tr>
						<th className='__drag_handle' />
						<th className='__option'>
							{__('Value', 'wc-ajax-product-filter')}
						</th>
						<th className='__label'>
							{__('Label', 'wc-ajax-product-filter')}
						</th>
						{'color' === display_type ? (
							<th className='__color'>
								{__('Color', 'wc-ajax-product-filter')}
							</th>
						) : null}
						{'image' === display_type ? (
							<th className='__image'>
								{__('Image', 'wc-ajax-product-filter')}
							</th>
						) : null}
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
									<div className='__option_value'>
										<span className='slug'>
											{__(
												'Slug',
												'wc-ajax-product-filter'
											)}
											:{` `}
											<span>{slug}</span>
										</span>
										<span className='id'>
											{__('ID', 'wc-ajax-product-filter')}
											:{` `}
											<span>{term_id}</span>
										</span>
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
								{'color' === display_type ? (
									<td>
										<div>{color}</div>
									</td>
								) : null}
								{'image' === display_type ? (
									<td>
										<div>{image}</div>
									</td>
								) : null}
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
			{'manual_entry' === get_options && (
				<div className='__options_table'>
					<p className='__heading'>
						{__('Filter Options', 'wc-ajax-product-filter')}
					</p>
					<p className='description'>
						{__(
							'Add the options that will be available to the filter.',
							'wc-ajax-product-filter'
						)}
					</p>
					{!isEmpty(rows) && table()}
					<div className='__button_group'>
						<Button variant='secondary' onClick={openModal}>
							{__('Browse Options', 'wc-ajax-product-filter')}
						</Button>
						{!isEmpty(rows) && (
							<>
								{` `}
								<Button
									variant='tertiary'
									isDestructive
									onClick={handleRemoveAll}
								>
									{__('Remove All', 'wc-ajax-product-filter')}
								</Button>
							</>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default OptionsTable;
