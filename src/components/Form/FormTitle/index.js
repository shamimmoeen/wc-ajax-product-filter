import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { useForm } from '../FormContext';
import useFormData from '../useFormData';
import axios from 'axios';
import {
	removeCopiedToClipboardNotice,
	itemSavedSuccessNotice,
	itemSavedErrorNotice,
	removeItemSavedNotices,
} from '../../notices';
import Title from './Title';
import PublishModal from '../../Modals/PublishModal';

const FormTitle = () => {
	const { state, dispatch } = useForm();
	const { setDirty } = useFormData(state, dispatch);

	const [publishModalId, setPublishModalId] = useState(null);
	const [loading, setLoading] = useState(false);

	const { isDirty, title, formId, formFilters, formSettings } = state;

	useEffect(() => {
		if (!isDirty) {
			return;
		}

		removeItemSavedNotices();
	}, [isDirty]);

	const handleTitleChange = (value) => {
		if (title === value) {
			return;
		}

		dispatch({ type: 'SET_TITLE', payload: value });

		setDirty();
	};

	const handleOpenPublishModal = () => {
		removeItemSavedNotices();

		setPublishModalId(formId);
	};

	const handleClosePublishModal = () => {
		removeCopiedToClipboardNotice();

		setPublishModalId(null);
	};

	const handleSaveForm = () => {
		removeItemSavedNotices();

		setLoading(true);

		const formData = new FormData();

		formData.append('action', 'wcapf_save_form');
		formData.append('form_title', title);
		formData.append('form_id', formId);
		formData.append('form_filters', JSON.stringify(formFilters));
		formData.append('form_settings', JSON.stringify(formSettings));

		axios
			.post(wcapf_admin_params.ajaxurl, formData)
			.then((res) => {
				setLoading(false);

				const {
					data: { data, success },
				} = res;

				if (success) {
					dispatch({ type: 'SET_DIRTY', payload: false });

					itemSavedSuccessNotice(
						__('Form saved successfully', 'wc-ajax-product-filter')
					);
				} else {
					itemSavedErrorNotice(data);
				}
			})
			.catch((err) => {
				setLoading(false);

				itemSavedErrorNotice(err.message);
			});
	};

	const handleSubmit = () => {
		if (isDirty) {
			handleSaveForm();
		} else {
			handleOpenPublishModal();
		}
	};

	return (
		<>
			<Title
				loading={loading}
				handleTitleChange={handleTitleChange}
				handleSubmit={handleSubmit}
			/>

			<PublishModal
				isOpen={publishModalId}
				closeModal={handleClosePublishModal}
				postType={'form'}
			/>
		</>
	);
};

export default FormTitle;
