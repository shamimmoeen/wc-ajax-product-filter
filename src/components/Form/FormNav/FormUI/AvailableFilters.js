import { sprintf, __ } from '@wordpress/i18n';
import AvailableFilter from './AvailableFilter';
import { __experimentalScrollable as Scrollable } from '@wordpress/components';

const AvailableFilters = ({
	availableFilters,
	handleToggleAddFilter,
	formFilters,
	forModal = false,
}) => {
	return (
		<div className='__available_filters_wrapper'>
			<Scrollable className='__available_filters_dropdown'>
				{availableFilters.map((item) => (
					<AvailableFilter
						item={item}
						handleToggleAddFilter={handleToggleAddFilter}
						forModal={forModal}
						key={item.id}
					/>
				))}
			</Scrollable>

			<p>
				{sprintf('%d/%d', formFilters.length, availableFilters.length)}
			</p>
		</div>
	);
};

export default AvailableFilters;
