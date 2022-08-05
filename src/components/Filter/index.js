import FilterSettings from './FilterSettings';
import FilterPreview from './FilterPreview';
import Notifications from '../Notifications';
import FilterSaveButton from './FilterSaveButton';

const Filter = () => {
	return (
		<>
			<FilterSettings />
			<FilterSaveButton />
			<FilterPreview />
			<Notifications />
		</>
	);
};

export default Filter;
