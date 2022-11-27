import useFormData from './useFormData';

const useFormSettings = (state, dispatch) => {
	const { setDirty } = useFormData(state, dispatch);

	const { formSettings } = state;

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

	const handleSelectChange = (selectedItem, key) => {
		updateFormSettings(key, selectedItem.value);
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
		handleRadioChange,
		handleCheckboxChange,
		handleTextFieldChange,
		handleSelectChange,
	};
};

export default useFormSettings;
