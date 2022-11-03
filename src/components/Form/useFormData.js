const useFormData = (state, dispatch) => {
	const { isDirty } = state;

	const setDirty = () => {
		if (!isDirty) {
			dispatch({ type: 'SET_DIRTY', payload: true });
			dispatch({ type: 'SET_LOAD_PREVIEW', payload: true });
		}
	};

	return { setDirty };
};

export default useFormData;
