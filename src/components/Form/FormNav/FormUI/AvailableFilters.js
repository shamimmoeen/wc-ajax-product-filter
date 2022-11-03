import { __ } from '@wordpress/i18n';
import AvailableFilter from './AvailableFilter';
import { __experimentalScrollable as Scrollable } from '@wordpress/components';
import { useForm } from '../../FormContext';

const AvailableFilters = () => {
	const {
		state: { availableFilters },
	} = useForm();

	return (
		<Scrollable className='__available_filters_dropdown'>
			{availableFilters.map((item) => (
				<AvailableFilter item={item} key={item.id} />
			))}
		</Scrollable>
	);
};

export default AvailableFilters;
