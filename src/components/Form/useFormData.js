const useFormData = (state, dispatch) => {
	const { isDirty, saveError } = state;

	const setDirty = () => {
		if (!isDirty) {
			dispatch({ type: 'SET_DIRTY', payload: true });
		}

		if (saveError) {
			dispatch({ type: 'SET_ERROR', payload: '' });
		}
	};

	return {
		setDirty,
	};
};

export default useFormData;
