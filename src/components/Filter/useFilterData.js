const useFilterData = (state, dispatch) => {
	const { activeFilterData, isDirty } = state;

	const setDirty = () => {
		if (!isDirty) {
			dispatch({ type: 'SET_DIRTY', payload: true });
			dispatch({ type: 'SET_LOAD_PREVIEW', payload: true });
		}
	};

	const handleRadioChange = (e, key) => {
		const value = e.target.value;

		setActiveFilterData(key, value);
	};

	const handleCheckboxChange = (value, key) => {
		const _value = value ? '1' : '';

		setActiveFilterData(key, _value);
	};

	const handleTextFieldChange = (value, key) => {
		setActiveFilterData(key, value);
	};

	const handleToggleGroupChange = (value, key) => {
		setActiveFilterData(key, value);
	};

	const handleSelectChange = (selectedItem, key) => {
		setActiveFilterData(key, selectedItem.value);
	};

	const handleSelectTermChange = (selected, key) => {
		setActiveFilterData(key, selected);
	};

	const setActiveFilterData = (key, value, makeDirty = true) => {
		const prevValue = activeFilterData[key];

		if (value === prevValue) {
			return;
		}

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: { ...activeFilterData, [key]: value },
		});

		if (makeDirty) {
			setDirty();
		}
	};

	const setActiveFilterMultiData = (data) => {
		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: { ...activeFilterData, ...data },
		});

		setDirty();
	};

	return {
		setDirty,
		handleRadioChange,
		handleCheckboxChange,
		handleTextFieldChange,
		handleToggleGroupChange,
		handleSelectChange,
		handleSelectTermChange,
		setActiveFilterData,
		setActiveFilterMultiData,
	};
};

export default useFilterData;
