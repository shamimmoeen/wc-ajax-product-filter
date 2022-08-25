import { __ } from '@wordpress/i18n';
import AvailableFilters from '../../AvailableFilters';
import Listbox from '../../Field/Listbox';
import Text from '../../Field/Text';
import GeneralFields from '../../Filter/FilterNav/FilterUI/GeneralFields';
import { useListFilters } from '../ListFiltersContext';

const Body = ({ step, setTotalSteps }) => {
	const {
		state: {
			title,
			filterType,
			activeFilterData,
			filterKeys,
			additionalData,
		},
		dispatch,
	} = useListFilters();

	const handleTitleChange = (e) => {
		const {
			target: { value },
		} = e;

		dispatch({ type: 'SET_TITLE', payload: value });
	};

	const handleSetFilterType = (filter) => {
		const _filterType = filter.type;

		if (_filterType === filterType) {
			return;
		}

		if (
			'active-filters' === _filterType ||
			'reset-button' === _filterType
		) {
			setTotalSteps(2);
		} else {
			setTotalSteps(3);
		}

		dispatch({ type: 'SET_FILTER_TYPE', payload: _filterType });
	};

	let content;

	if (1 === step) {
		content = (
			<div className='__step_inner __title_step'>
				<Text
					id={'filter_title'}
					label={__('Filter Title', 'wc-ajax-product-filter')}
					value={title}
					onChange={handleTitleChange}
				/>
			</div>
		);
	} else if (2 === step) {
		content = (
			<AvailableFilters
				filterType={filterType}
				handleSetFilterType={handleSetFilterType}
			/>
		);
	} else if (3 === step) {
		content = (
			<div className='__step_inner'>
				<Listbox />

				<GeneralFields
					filterType={filterType}
					activeFilterData={activeFilterData}
					filterKeys={filterKeys}
					additionalData={additionalData}
					dispatch={dispatch}
				/>
			</div>
		);
	}

	return content;
};

export default Body;
