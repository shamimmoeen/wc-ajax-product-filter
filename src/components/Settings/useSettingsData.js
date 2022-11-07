const useSettingsData = (state, dispatch) => {
	const { isDirty, settings } = state;

	const setDirty = () => {
		if (!isDirty) {
			dispatch({ type: 'SET_DIRTY', payload: true });
		}
	};

	const handleRadioChange = (e, key) => {
		const value = e.target.value;

		updateSettings(key, value);
	};

	const handleCheckboxChange = (value, key) => {
		const _value = value ? '1' : '';

		updateSettings(key, _value);
	};

	const handleTextFieldChange = (value, key) => {
		updateSettings(key, value);
	};

	const updateSettings = (key, value) => {
		const prevValue = settings[key];

		if (value === prevValue) {
			return;
		}

		dispatch({
			type: 'UPDATE_SETTINGS',
			payload: { ...settings, [key]: value },
		});

		setDirty();
	};

	return { handleRadioChange, handleCheckboxChange, handleTextFieldChange };
};

export default useSettingsData;
