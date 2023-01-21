import { Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { dragHandle } from '@wordpress/icons';
import { isEmpty } from 'lodash';
import { ReactSortable } from 'react-sortablejs';
import useSettingsData from '../useSettingsData';
import { useSettings } from '../SettingsContext';
import ProFeaturesNotice from '../../ProFeaturesNotice';

const FilterKeys = () => {
	const { state, dispatch } = useSettings();
	const { setDirty } = useSettingsData(state, dispatch);

	const { globalFilterKeys } = state;

	const setFilterKeys = (_filterKeys, sortable, store) => {
		if (!sortable) {
			return;
		}

		if (!store.dragging) {
			return;
		}

		dispatch({
			type: 'UPDATE_GLOBAL_FILTER_KEYS',
			payload: _filterKeys,
		});
	};

	const handleSort = () => {
		setDirty();
	};

	const handleFilterKeyChange = (e, index) => {
		const value = e.target.value;

		const _filterKeys = globalFilterKeys.map((filterKey, _index) => {
			if (_index === index) {
				return { ...filterKey, field_key: value };
			}

			return filterKey;
		});

		dispatch({
			type: 'UPDATE_GLOBAL_FILTER_KEYS',
			payload: _filterKeys,
		});
	};

	return (
		<>
			<ProFeaturesNotice
				message={__(
					'Changing the order of filter keys is a PRO feature.',
					'wc-ajax-product-filter'
				)}
			/>

			<h4 className='__global_filter_keys_heading'>
				{__('Global filter keys and order', 'wc-ajax-product-filter')}
			</h4>

			{isEmpty(globalFilterKeys) ? (
				<p className='__description'>
					{__(
						'Please create some filters first then come back here.',
						'wc-ajax-product-filter'
					)}
				</p>
			) : (
				<>
					<p className='__description'>
						{__(
							'Here you can edit the filter keys globally and change the order of those in the URL.',
							'wc-ajax-product-filter'
						)}
					</p>

					<ReactSortable
						list={globalFilterKeys}
						setList={setFilterKeys}
						direction={'vertical'}
						handle='.__drag_handler'
						onSort={handleSort}
						className='__global_filter_keys'
					>
						{globalFilterKeys.map((filterKey, index) => {
							const { type, label, field_key } = filterKey;

							return (
								<div className='__filter_key' key={type}>
									<span className='__index'>{index + 1}</span>

									<label className='__label' htmlFor={type}>
										{label}
									</label>

									<div className='__value'>
										<input
											type={'text'}
											id={type}
											value={field_key}
											className='components-text-control__input'
											onChange={(e) =>
												handleFilterKeyChange(e, index)
											}
										/>
									</div>

									<div className='__drag_handle_wrapper'>
										<Icon
											className='__drag_handler'
											icon={dragHandle}
										/>
									</div>
								</div>
							);
						})}
					</ReactSortable>
				</>
			)}
		</>
	);
};

export default FilterKeys;
