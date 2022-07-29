import { __ } from '@wordpress/i18n';
import AvailableFilter from './AvailableFilter';

const AvailableFilters = ({ availableFilters, setAvailableFilters }) => {
	const handleAddFilter = () => {
		alert('add filter');
	};

	return (
		<div style={{ marginBottom: '2em' }}>
			<h3 style={{ fontWeight: 500, fontSize: 'small' }}>
				{__('Available Filters', 'wc-ajax-product-filter')}
			</h3>

			<div>
				{availableFilters.map((item, key) => (
					<AvailableFilter
						item={item}
						handleAddFilter={handleAddFilter}
						key={key}
					/>
				))}
			</div>
		</div>
	);
};

export default AvailableFilters;
