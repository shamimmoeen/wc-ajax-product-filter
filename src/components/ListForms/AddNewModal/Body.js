import { __ } from '@wordpress/i18n';
import AvailableFilters from '../../Form/FormNav/FormUI/AvailableFilters';
import useForm from '../../useForm';
import { useListForms } from '../ListFormsContext';

const Body = ({ step }) => {
	const { state, dispatch } = useListForms();
	const { addFilter, removeFilter } = useForm(state, dispatch);

	const { title, availableFilters, formFilters } = state;

	const handleTitleChange = (e) => {
		const value = e.target.value;

		dispatch({ type: 'SET_TITLE', payload: value });
	};

	const handleToggleAddFilter = (item) => {
		if (formFilters.find((filter) => filter.id === item.id)) {
			removeFilter(item);
		} else {
			addFilter(item);
		}

		dispatch({ type: 'SET_DIRTY', payload: true });
	};

	let content;

	if (1 === step) {
		content = (
			<div className='__step_inner __title_step'>
				<input
					type={'text'}
					placeholder={__(
						'Enter form title',
						'wc-ajax-product-filter'
					)}
					className='components-text-control__input'
					value={title}
					onChange={handleTitleChange}
				/>
			</div>
		);
	} else if (2 === step) {
		content = (
			<div className='__step_inner'>
				<p className='description'>
					{__(
						'Choose the filters from the below available filters.',
						'wc-ajax-product-filter'
					)}
				</p>

				<AvailableFilters
					availableFilters={availableFilters}
					handleToggleAddFilter={handleToggleAddFilter}
					forModal
				/>
			</div>
		);
	}

	return content;
};

export default Body;
