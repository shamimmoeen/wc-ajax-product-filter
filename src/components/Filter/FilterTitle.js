import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { useFilter } from './FilterContext';
import Title from '../Title';
import axios from 'axios';
import PublishModal from '../ListFilters/PublishModal';
import {
	filterSavedSuccessNotice,
	filterSavedErrorNotice,
	removeFilterSavedNotices,
	removeCopiedToClipboardNotice,
} from '../notices';

const FilterTitle = () => {
	const {
		state: {
			title,
			filterType,
			filterId,
			activeFilterData,
			filtersData,
			isDirty,
		},
		dispatch,
	} = useFilter();

	const [publishModalId, setPublishModalId] = useState(null);
	const [btnBusy, setBtnBusy] = useState(false);
	const [btnDisabled, setBtnDisabled] = useState(false);

	useEffect(() => {
		if (!isDirty) {
			return;
		}

		removeFilterSavedNotices();
	}, [isDirty]);

	const handleChange = (value) => {
		dispatch({ type: 'SET_TITLE', payload: value });

		if (!isDirty) {
			dispatch({ type: 'SET_DIRTY' });
		}
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
			detailed: { post_title, filter_data: newFilterData },
		} = data;

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

		dispatch({ type: 'UNSET_DIRTY' });
	};

	const handleSaveFilter = () => {
		removeFilterSavedNotices();

		setBtnDisabled(true);
		setBtnBusy(true);

		const formData = new FormData();

		formData.append('action', 'wcapf_save_filter');
		formData.append('filter_title', title);
		formData.append('filter_id', filterId);
		formData.append('filter_data', JSON.stringify(activeFilterData));

		axios
			.post(wcapf_admin_params.ajaxurl, formData)
			.then((res) => {
				setBtnDisabled(false);
				setBtnBusy(false);

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
				setBtnDisabled(false);
				setBtnBusy(false);

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
				label={__('Filter Title', 'wc-ajax-product-filter')}
				value={title}
				handleChange={handleChange}
				isDirty={isDirty}
				btnBusy={btnBusy}
				btnDisabled={btnDisabled}
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
