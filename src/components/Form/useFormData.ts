import { useDispatch } from '@wordpress/data';
import store from '../../store/form';

const useFormData = () => {
	const { markDirty } = useDispatch( store );

	return {
		setDirty: markDirty,
	};
};

export default useFormData;
