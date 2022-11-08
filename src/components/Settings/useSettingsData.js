const useSettingsData = (state, dispatch) => {
	const { isDirty, settings } = state;

	const setDirty = () => {
		if (!isDirty) {
			dispatch({ type: 'SET_DIRTY', payload: true });
		}
	};

	const handleRadioChange = (e, key) => {
		const value = e.target.value;

		updateSingleSettings(key, value);
	};

	const handleCheckboxChange = (value, key) => {
		const _value = value ? '1' : '';

		updateSingleSettings(key, _value);
	};

	const handleTextFieldChange = (value, key) => {
		updateSingleSettings(key, value);
	};

	const handleSelectChange = (selectedItem, key) => {
		updateSingleSettings(key, selectedItem.value);
	};

	const handleImageChange = (attachment, key) => {
		const imageId = attachment.id;
		const imageUrl = attachment.sizes.full.url;

		const prevValue = parseInt(settings[key]);

		if (imageId === prevValue) {
			return;
		}

		const primaryKey = key;
		const secondaryKey = `${key}_src`;

		const _settings = {
			...settings,
			[primaryKey]: imageId,
			[secondaryKey]: imageUrl,
		};

		updateSettings(_settings);
	};

	const handleImageRemove = (key) => {
		const primaryKey = key;
		const secondaryKey = `${key}_src`;

		const _settings = {
			...settings,
			[primaryKey]: '',
			[secondaryKey]: '',
		};

		updateSettings(_settings);
	};

	const updateSingleSettings = (key, value) => {
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

	const updateSettings = (_settings) => {
		dispatch({ type: 'UPDATE_SETTINGS', payload: _settings });

		setDirty();
	};

	return {
		setDirty,
		handleRadioChange,
		handleCheckboxChange,
		handleTextFieldChange,
		handleSelectChange,
		handleImageChange,
		handleImageRemove,
	};
};

export default useSettingsData;
