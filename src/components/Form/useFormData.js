const useFormData = (state, dispatch) => {
	const { isDirty, availableFilters, formFilters, formSettings } = state;

	const setDirty = () => {
		if (!isDirty) {
			dispatch({ type: 'SET_DIRTY', payload: true });
			dispatch({ type: 'SET_LOAD_PREVIEW', payload: true });
		}
	};

	const handleAddFilter = (item) => {
		if (formFilters.find((filter) => filter.id === item.id)) {
			return;
		}

		const _availableFilters = availableFilters.map((filter) => {
			if (filter.id === item.id) {
				return { ...filter, status: 'added' };
			}

			return filter;
		});

		dispatch({ type: 'SET_AVAILABLE_FILTERS', payload: _availableFilters });

		const _formFilters = [item, ...formFilters];

		dispatch({ type: 'SET_FORM_FILTERS', payload: _formFilters });

		setDirty();
	};

	const handleRemoveFilter = (item) => {
		const _formFilters = formFilters.filter(
			(filter) => filter.id !== item.id
		);

		dispatch({ type: 'SET_FORM_FILTERS', payload: _formFilters });

		const _availableFilters = availableFilters.map((filter) => {
			if (filter.id === item.id) {
				return { ...filter, status: '' };
			}

			return filter;
		});

		dispatch({ type: 'SET_AVAILABLE_FILTERS', payload: _availableFilters });

		setDirty();
	};

	const handleRemoveAllFilters = () => {
		dispatch({
			type: 'SET_FORM_FILTERS',
			payload: [],
		});

		const _availableFilters = availableFilters.map((filter) => ({
			...filter,
			status: '',
		}));

		dispatch({ type: 'SET_AVAILABLE_FILTERS', payload: _availableFilters });

		setDirty();
	};

	const handleUpdateFilter = (id, key, value) => {
		const filterData = formFilters.find((filter) => filter.id === id);

		if (filterData[key] === value) {
			return;
		}

		const _formFilters = formFilters.map((filter) => {
			if (filter.id === id) {
				return { ...filter, [key]: value };
			}

			return filter;
		});

		dispatch({ type: 'SET_FORM_FILTERS', payload: _formFilters });

		setDirty();
	};

	const handleFilterCheckboxChange = (id, key, value) => {
		handleUpdateFilter(id, key, value ? '1' : '');
	};

	const handleFilterRadioChange = (id, key, e) => {
		const value = e.target.value;

		handleUpdateFilter(id, key, value);
	};

	const handleRadioChange = (e, key) => {
		const value = e.target.value;

		updateFormSettings(key, value);
	};

	const handleCheckboxChange = (value, key) => {
		const _value = value ? '1' : '';

		updateFormSettings(key, _value);
	};

	const handleTextFieldChange = (value, key) => {
		updateFormSettings(key, value);
	};

	const updateFormSettings = (key, value) => {
		const prevValue = formSettings[key];

		if (value === prevValue) {
			return;
		}

		dispatch({
			type: 'SET_FORM_SETTINGS',
			payload: { ...formSettings, [key]: value },
		});

		setDirty();
	};

	return {
		setDirty,
		handleAddFilter,
		handleRemoveFilter,
		handleRemoveAllFilters,
		handleFilterCheckboxChange,
		handleFilterRadioChange,
		handleRadioChange,
		handleCheckboxChange,
		handleTextFieldChange,
		updateFormSettings,
	};
};

export default useFormData;
