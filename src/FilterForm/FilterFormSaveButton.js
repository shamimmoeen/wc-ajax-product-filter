import { Button, Icon, Spinner } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { cloudUpload } from '@wordpress/icons';
import axios from 'axios';
import { useFilterForm } from './FilterFormContext';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';

const FilterFormSaveButton = () => {
	const {
		state: { isDirty, title, formFilters },
		dispatch,
	} = useFilterForm();

	const [isLoading, setLoading] = useState(false);

	const { createErrorNotice } = useDispatch(noticesStore);

	const handleSaveFilterForm = () => {
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
		<Button
			variant='primary'
			className='__save_post'
			disabled={_disabled}
			onClick={handleSaveFilterForm}
		>
			{isLoading ? <Spinner /> : <Icon icon={cloudUpload} size={40} />}
		</Button>
	);
};

export default FilterFormSaveButton;
