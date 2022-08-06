import { useFilter } from '../../FilterContext';
import { __ } from '@wordpress/i18n';
import { getAvailableFilters } from '../../utils';
import { Button } from '@wordpress/components';

const AvaialableFilters = () => {
	const {
		state: { filterType },
		dispatch,
	} = useFilter();

	const handleSetFilterType = (filter) => {
		dispatch({ type: 'SET_FILTER_TYPE', payload: filter.type });
		dispatch({ type: 'SET_FILTER_TYPE_LABEL', payload: filter.title });
		dispatch({ type: 'SET_DIRTY' });
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
								disabled={filter.isPro}
							>
								{filter.title}
								{filter.isPro ? (
									<span className='__pro_tag' />
								) : (
									''
								)}
							</Button>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default AvaialableFilters;
