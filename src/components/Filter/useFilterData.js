const useFilterData = (activeFilterData, dispatch) => {
	const handleRadioChange = (e, key) => {
		const value = e.target.value;

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: { ...activeFilterData, [key]: value },
		});
	};

	const handleCheckboxChange = (value, key) => {
		const _value = value ? '1' : '';

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: { ...activeFilterData, [key]: _value },
		});
	};

	const handleTextFieldChange = (e, key) => {
		const value = e.target.value;

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: { ...activeFilterData, [key]: value },
		});
	};

	const handleToggleGroupChange = (value, key) => {
		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: { ...activeFilterData, [key]: value },
		});
	};

	const handleDropdownChange = (selectedItem, key) => {
		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: { ...activeFilterData, [key]: selectedItem.key },
		});
	};

	return {
		handleRadioChange,
		handleCheckboxChange,
		handleTextFieldChange,
		handleToggleGroupChange,
		handleDropdownChange,
	};
};

export default useFilterData;
