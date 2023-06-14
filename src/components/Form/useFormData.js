const useFormData = (state, dispatch) => {
	const { isDirty, saveError } = state;

	const setDirty = () => {
		if (!isDirty) {
			dispatch({ type: 'SET_DIRTY', payload: true });

			wcapf_admin_params.dirty = true;
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
