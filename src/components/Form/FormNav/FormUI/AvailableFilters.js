import { __ } from '@wordpress/i18n';
import AvailableFilter from './AvailableFilter';
import { __experimentalScrollable as Scrollable } from '@wordpress/components';

const AvailableFilters = ({
	availableFilters,
	handleToggleAddFilter,
	forModal = false,
}) => {
	return (
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
	);
};

export default AvailableFilters;
