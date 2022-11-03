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

	const {
		title,
		filterType,
		filterId,
		activeFilterData,
		visibilityRules,
		filtersData,
		isDirty,
	} = state;

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

		setPublishModalId(filterId);
	};

	const handleClosePublishModal = () => {
		removeCopiedToClipboardNotice();

		setPublishModalId(null);
	};

	const setNewFilterData = (data) => {
		const {
			detailed: {
				post_title,
				filter_data: newFilterData,
				visibility_rules: visibilityRules,
			},
		} = data;

		dispatch({ type: 'SET_DIRTY', payload: false });
		dispatch({ type: 'SET_LOAD_PREVIEW', payload: false });

		dispatch({
			type: 'SET_TITLE',
			payload: post_title,
		});

		const { type } = newFilterData;

		if (filterType === type) {
			dispatch({
				type: 'SET_ACTIVE_FILTER_DATA',
				payload: newFilterData,
			});
		} else {
			const newFiltersData = { ...filtersData, [type]: newFilterData };

			dispatch({ type: 'SET_FILTERS_DATA', payload: newFiltersData });
		}

		dispatch({ type: 'SET_VISIBILITY_RULES', payload: visibilityRules });
	};

	const handleSaveFilter = () => {
		removeItemSavedNotices();

		setLoading(true);

		const formData = new FormData();

		formData.append('action', 'wcapf_save_filter');
		formData.append('filter_title', title);
		formData.append('filter_id', filterId);
		formData.append('filter_data', JSON.stringify(activeFilterData));
		formData.append('visibility_rules', JSON.stringify(visibilityRules));

		axios
			.post(wcapf_admin_params.ajaxurl, formData)
			.then((res) => {
				setLoading(false);

				const {
					data: { data, success },
				} = res;

				if (success) {
					setNewFilterData(data);

					itemSavedSuccessNotice(
						__(
							'Filter saved successfully',
							'wc-ajax-product-filter'
						)
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
			handleSaveFilter();
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
				postType={'filter'}
			/>
		</>
	);
};

export default FormTitle;
