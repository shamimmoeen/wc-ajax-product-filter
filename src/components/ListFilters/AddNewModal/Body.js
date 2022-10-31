import { __ } from '@wordpress/i18n';
import AvailableFilters from '../../Filter/FilterNav/FilterUI/AvailableFilters';
import GeneralFields from '../../Filter/FilterNav/FilterUI/GeneralFields';
import { useListFilters } from '../ListFiltersContext';

const Body = ({ step }) => {
	const { state, dispatch } = useListFilters();

	const { title } = state;

	const handleTitleChange = (e) => {
		const value = e.target.value;

		dispatch({ type: 'SET_TITLE', payload: value });
	};

	let content;

	if (1 === step) {
		content = (
			<div className='__step_inner __title_step'>
				<div className='__form_control'>
					<input
						type={'text'}
						placeholder={__(
							'Enter filter title',
							'wc-ajax-product-filter'
						)}
						className='components-text-control__input'
						value={title}
						onChange={handleTitleChange}
					/>
				</div>
			</div>
		);
	} else if (2 === step) {
		content = <AvailableFilters state={state} dispatch={dispatch} />;
	} else if (3 === step) {
		content = (
			<div className='__step_inner'>
				<GeneralFields state={state} dispatch={dispatch} />
			</div>
		);
	}

	return content;
};

export default Body;
