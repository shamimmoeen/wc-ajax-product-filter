const useForm = (state, dispatch) => {
	const { availableFilters, formFilters } = state;

	const addFilter = (item) => {
		const _availableFilters = availableFilters.map((filter) => {
			if (filter.id === item.id) {
				return { ...filter, status: 'added' };
			}

			return filter;
		});

		dispatch({ type: 'SET_AVAILABLE_FILTERS', payload: _availableFilters });

		const _formFilters = [item, ...formFilters];

		dispatch({ type: 'SET_FORM_FILTERS', payload: _formFilters });
	};

	const removeFilter = (item) => {
		const _availableFilters = availableFilters.map((filter) => {
			if (filter.id === item.id) {
				return { ...filter, status: '' };
			}

			return filter;
		});

		dispatch({ type: 'SET_AVAILABLE_FILTERS', payload: _availableFilters });

		const _formFilters = formFilters.filter(
			(filter) => filter.id !== item.id
		);

		dispatch({ type: 'SET_FORM_FILTERS', payload: _formFilters });
	};

	return { addFilter, removeFilter };
};

export default useForm;
