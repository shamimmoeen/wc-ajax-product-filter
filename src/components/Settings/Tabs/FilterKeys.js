import { Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { dragHandle } from '@wordpress/icons';
import ProFeaturesNotice from '../../ProFeaturesNotice';
import { foundProVersion, slugify } from '../../utils';
import { ReactSortable } from 'react-sortablejs';
import useSettingsData from '../useSettingsData';
import { useSettings } from '../SettingsContext';

const globalFilterKeys = [
	{
		label: __('Product categories', 'wc-ajax-product-filter'),
		value: '_product_cat',
	},
	{
		label: __('Product tags', 'wc-ajax-product-filter'),
		value: '_product_tag',
	},
	{
		label: __('Brands', 'wc-ajax-product-filter'),
		value: '_brand',
	},
];

const WCAPF_PRO = foundProVersion();

const FilterKeys = () => {
	const { state, dispatch } = useSettings();
	const { setDirty } = useSettingsData(state, dispatch);

	const setFilterKeys = (_filterKeys, sortable, store) => {
		if (!sortable) {
			return;
		}

		if (!store.dragging) {
			return;
		}

		if (WCAPF_PRO) {
			dispatch({
				type: 'SET_FORM_FILTERS',
				payload: _filterKeys,
			});
		}
	};

	const handleSort = () => {
		if (WCAPF_PRO) {
			setDirty();
		}
	};

	return (
		<>
			<ProFeaturesNotice
				message={__(
					'Changing the order of filter keys is a pro feature.',
					'wc-ajax-product-filter'
				)}
			/>

			<h4 className='__global_filter_keys_heading'>
				{__('Global filter keys and order', 'wc-ajax-product-filter')}
			</h4>

			<ReactSortable
				list={globalFilterKeys}
				setList={setFilterKeys}
				direction={'vertical'}
				handle='.__drag_handler'
				onSort={handleSort}
				className='__global_filter_keys'
			>
				{globalFilterKeys.map((filterKey, index) => {
					const id = slugify(filterKey.label);

					return (
						<div className='__filter_key' key={id}>
							<span className='__index'>{index + 1}</span>

							<label className='__label' htmlFor={id}>
								{filterKey.label}
							</label>

							<div className='__value'>
								<input
									type={'text'}
									id={id}
									value={filterKey.value}
									className='components-text-control__input'
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
	);
};

export default FilterKeys;
