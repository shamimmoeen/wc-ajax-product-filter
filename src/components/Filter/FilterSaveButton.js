import { useState } from '@wordpress/element';
import axios from 'axios';
import { useFilter } from './FilterContext';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import SaveButton from '../SaveButton';

const FilterSaveButton = () => {
	const {
		state: { isDirty, title },
		dispatch,
	} = useFilter();

	const [isLoading, setLoading] = useState(false);

	const { createErrorNotice } = useDispatch(noticesStore);

	const handleSave = () => {
		setLoading(true);

		const formData = new FormData();

		formData.append('action', 'save_filter');
		formData.append('post_title', title);

		axios
			.post(wcapf_admin_params.ajaxurl, formData)
			.then(() => {
				setLoading(false);
				dispatch({ type: 'UNSET_DIRTY' });
			})
			.catch((err) => {
				setLoading(false);
				createErrorNotice(err.message, {
					type: 'snackbar',
					icon: '🔥',
				});
			});
	};

	let _disabled = false;

	if (!isDirty) {
		_disabled = true;
	} else if (isLoading) {
		_disabled = true;
	}

	return (
		<SaveButton
			disabled={_disabled}
			isLoading={isLoading}
			handleSave={handleSave}
		/>
	);
};

export default FilterSaveButton;
