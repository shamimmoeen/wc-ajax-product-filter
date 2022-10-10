import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import Text from '../../Field/Text';
import AvailableFilters from '../../Filter/FilterNav/FilterUI/AvailableFilters';
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
			filtersData,
		},
		dispatch,
	} = useListFilters();

	useEffect(() => {
		if (!filterType) {
			return;
		}

		const filtersWithoutOptions = ['active-filters', 'reset-button'];

		if (filtersWithoutOptions.includes(filterType)) {
			setTotalSteps(2);
		} else {
			setTotalSteps(3);
		}
	}, [filterType]);

	const handleTitleChange = (e) => {
		const value = e.target.value;

		dispatch({ type: 'SET_TITLE', payload: value });
	};

	let content;

	if (1 === step) {
		content = (
			<div className='__step_inner __title_step'>
				<Text
					id={'filter_title'}
					label={__('Filter Title', 'wc-ajax-product-filter')}
					placeholder={__(
						'Enter filter title',
						'wc-ajax-product-filter'
					)}
					value={title}
					onChange={handleTitleChange}
				/>
			</div>
		);
	} else if (2 === step) {
		content = (
			<AvailableFilters
				filterType={filterType}
				activeFilterData={activeFilterData}
				filtersData={filtersData}
				dispatch={dispatch}
			/>
		);
	} else if (3 === step) {
		content = (
			<div className='__step_inner'>
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
