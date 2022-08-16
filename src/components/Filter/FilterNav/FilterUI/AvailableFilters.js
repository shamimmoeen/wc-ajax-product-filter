import { useFilter } from '../../FilterContext';
import { __ } from '@wordpress/i18n';
import { getAvailableFilters, getFilterDefaultData } from '../../utils';
import { NavigableMenu, Button } from '@wordpress/components';
import { proTag } from '../../../utils';

const AvaialableFilters = () => {
	const {
		state: { filterType, filtersData, activeFilterData },
		dispatch,
	} = useFilter();

	const handleSetFilterType = (filter) => {
		const _filterType = filter.type;

		dispatch({ type: 'SET_FILTER_TYPE', payload: _filterType });
		dispatch({ type: 'SET_DIRTY' });

		let filterData = filtersData[_filterType];

		if (!filterData) {
			filterData = getFilterDefaultData(_filterType);
		}

		dispatch({ type: 'SET_ACTIVE_FILTER_DATA', payload: filterData });

		const _filtersData = { ...filtersData, [filterType]: activeFilterData };

		dispatch({ type: 'SET_FILTERS_DATA', payload: _filtersData });
	};

	return (
		<div className='__available_filters'>
			<div className='__inner'>
				<p className='description'>
					{__(
						'Select a component to start building the filter.',
						'wc-ajax-product-filter'
					)}
				</p>

				<div className='__filters'>
					<NavigableMenu role={'menu'} orientation='horizontal'>
						{getAvailableFilters().map((filter) => {
							let _classes = '__item';

							if (filterType === filter.type) {
								_classes += ' active';
							}

							return (
								<Button
									className={_classes}
									key={filter.type}
									onClick={() => handleSetFilterType(filter)}
								>
									{filter.title}
									{proTag(filter.isPro)}
								</Button>
							);
						})}
					</NavigableMenu>
				</div>
			</div>
		</div>
	);
};

export default AvaialableFilters;
