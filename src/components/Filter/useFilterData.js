const useFilterData = (activeFilterData, dispatch) => {
	const handleRadioChange = (e, key) => {
		const value = e.target.value;

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: { ...activeFilterData, [key]: value },
		});
	};

	const handleCheckboxChange = (key, value) => {
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

	return {
		handleRadioChange,
		handleCheckboxChange,
		handleTextFieldChange,
	};
};

export default useFilterData;
