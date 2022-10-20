import { __ } from '@wordpress/i18n';
import Text from '../../Field/Text';
import AvailableFilters from '../../Filter/FilterNav/FilterUI/AvailableFilters';
import GeneralFields from '../../Filter/FilterNav/FilterUI/GeneralFields';
import { useListFilters } from '../ListFiltersContext';

const Body = ({ step }) => {
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

	const { initial_filter_keys: initialFilterKeysData } = additionalData;

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
				initialFilterKeysData={initialFilterKeysData}
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
