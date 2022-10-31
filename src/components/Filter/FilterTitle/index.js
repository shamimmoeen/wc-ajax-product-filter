import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { useFilter } from '../FilterContext';
import useFilterData from '../useFilterData';
import axios from 'axios';
import PublishModal from '../../ListFilters/PublishModal';
import {
	filterSavedSuccessNotice,
	filterSavedErrorNotice,
	removeFilterSavedNotices,
	removeCopiedToClipboardNotice,
} from '../../notices';
import Title from './Title';

const FilterTitle = () => {
	const { state, dispatch } = useFilter();
	const { setDirty } = useFilterData(state, dispatch);

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

		removeFilterSavedNotices();
	}, [isDirty]);

	const handleTitleChange = (value) => {
		if (title === value) {
			return;
		}

		dispatch({ type: 'SET_TITLE', payload: value });

		setDirty();
	};

	const handleOpenPublishModal = () => {
		removeFilterSavedNotices();

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
		removeFilterSavedNotices();

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

					filterSavedSuccessNotice(
						__(
							'Filter saved successfully',
							'wc-ajax-product-filter'
						)
					);
				} else {
					filterSavedErrorNotice(data);
				}
			})
			.catch((err) => {
				setLoading(false);

				filterSavedErrorNotice(err.message);
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
			/>
		</>
	);
};

export default FilterTitle;
