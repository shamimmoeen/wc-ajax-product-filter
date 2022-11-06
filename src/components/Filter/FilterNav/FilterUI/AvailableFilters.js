import { __ } from '@wordpress/i18n';
import { Button, NavigableMenu } from '@wordpress/components';
import { availableFilters, getFilterDefaultData } from '../../utils';
import { proTag } from '../../../utils';

const AvailableFilters = ({ state, dispatch, callback }) => {
	const {
		filterType,
		activeFilterData,
		additionalData: { initial_filter_keys: initialFilterKeysData },
		filtersData,
	} = state;

	const handleSetFilterType = (filter) => {
		const _filterType = filter.type;

		if (_filterType === filterType) {
			return;
		}

		dispatch({ type: 'SET_FILTER_TYPE', payload: _filterType });

		let _activeFilterData = filtersData[_filterType];

		if (!_activeFilterData) {
			_activeFilterData = getFilterDefaultData(
				_filterType,
				initialFilterKeysData
			);
		}

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: _activeFilterData,
		});

		const _filtersData = { ...filtersData, [filterType]: activeFilterData };

		dispatch({ type: 'SET_FILTERS_DATA', payload: _filtersData });

		// Make the filter dirty.
		if (callback) {
			callback();
		}
	};

	return (
		<div className='__available_filters'>
			<div className='__inner'>
				<p className='__description'>
					{__(
						'Select a component to start building the filter.',
						'wc-ajax-product-filter'
					)}
				</p>

				<div className='__filters'>
					<NavigableMenu role={'menu'} orientation='horizontal'>
						{availableFilters().map((filter) => {
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

export default AvailableFilters;
