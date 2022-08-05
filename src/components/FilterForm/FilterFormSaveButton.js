import { useState } from '@wordpress/element';
import axios from 'axios';
import { useFilterForm } from './FilterFormContext';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import SaveButton from '../SaveButton';

const FilterFormSaveButton = () => {
	const {
		state: { isDirty, title, formFilters },
		dispatch,
	} = useFilterForm();

	const [isLoading, setLoading] = useState(false);

	const { createErrorNotice } = useDispatch(noticesStore);

	const handleSave = () => {
		setLoading(true);

		// https://stackoverflow.com/a/62939225
		const formData = new FormData();

		formData.append('action', 'save_filter_form');
		formData.append('form_filters', JSON.stringify(formFilters));
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

export default FilterFormSaveButton;
