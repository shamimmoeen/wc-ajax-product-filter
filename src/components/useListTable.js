import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import {
	itemDeletedErrorNotice,
	itemDeletedSuccessNotice,
	itemDuplicatedErrorNotice,
	itemDuplicatedSuccessNotice,
	removeCopiedToClipboardNotice,
	removeItemCreateNotices,
	removeItemDeletedNotices,
	removeItemDuplicatedNotices,
} from './notices';

const useListTable = (dispatch, items, postType) => {
	const [addNewModalOpen, setAddNewModalOpen] = useState(false);
	const [deleteModalId, setDeleteModalId] = useState(null);
	const [duplicateModalId, setDuplicateModalId] = useState(null);
	const [publishModalOpen, setPublishModalOpen] = useState(false);
	const [deletingItemId, setDeletingItemId] = useState(null);
	const [duplicatingItemId, setDuplicatingItemId] = useState(null);

	let dispatchType;

	if ('filter' === postType) {
		dispatchType = 'SET_FILTERS';
	} else if ('form' === postType) {
		dispatchType = 'SET_FORMS';
	}

	const handleOpenAddNewModal = () => {
		removeItemCreateNotices();
		removeItemDeletedNotices();
		removeItemDuplicatedNotices();

		setAddNewModalOpen(true);
	};

	const handleOpenDeleteModal = (id) => {
		removeItemCreateNotices();
		removeItemDeletedNotices();
		removeItemDuplicatedNotices();

		setDeleteModalId(id);
	};

	const handleCloseDeleteModal = () => {
		setDeleteModalId(null);
	};

	const handleDeleteItem = () => {
		const id = deleteModalId;

		handleCloseDeleteModal();

		setDeletingItemId(id);

		apiFetch({
			path: `/wcapf/v1/${postType}s/${id}`,
			method: 'DELETE',
		})
			.then(() => {
				setDeletingItemId(null);

				itemDeletedSuccessNotice(
					'form' === postType
						? __('Form deleted successfully', 'wc-ajax-product-filter')
						: __('Filter deleted successfully', 'wc-ajax-product-filter')
				);

				const _items = items.filter((item) => item.id !== id);

				dispatch({ type: dispatchType, payload: _items });
			})
			.catch((err) => {
				setDeletingItemId(null);

				itemDeletedErrorNotice(err.message);
			});
	};

	const handleOpenDuplicateModal = (id) => {
		removeItemCreateNotices();
		removeItemDeletedNotices();
		removeItemDuplicatedNotices();

		setDuplicateModalId(id);
	};

	const handleCloseDuplicateModal = () => {
		setDuplicateModalId(null);
	};

	const handleDuplicateItem = () => {
		const id = duplicateModalId;

		handleCloseDuplicateModal();

		setDuplicatingItemId(id);

		apiFetch({
			path: `/wcapf/v1/${postType}s/${id}/duplicate`,
			method: 'POST',
		})
			.then((res) => {
				setDuplicatingItemId(null);

				itemDuplicatedSuccessNotice(
					__('Form duplicated successfully', 'wc-ajax-product-filter')
				);

				const _items = [res, ...items];

				dispatch({ type: dispatchType, payload: _items });
			})
			.catch((err) => {
				setDuplicatingItemId(null);

				itemDuplicatedErrorNotice(err.message);
			});
	};

	const handleOpenPublishModal = () => {
		removeItemCreateNotices();
		removeItemDeletedNotices();
		removeItemDuplicatedNotices();

		setPublishModalOpen(true);
	};

	const handleClosePublishModal = () => {
		removeCopiedToClipboardNotice();

		setPublishModalOpen(false);
	};

	return {
		addNewModalOpen,
		setAddNewModalOpen,
		handleOpenAddNewModal,
		deleteModalId,
		handleOpenDeleteModal,
		handleCloseDeleteModal,
		handleDeleteItem,
		duplicateModalId,
		handleOpenDuplicateModal,
		handleCloseDuplicateModal,
		handleDuplicateItem,
		publishModalOpen,
		handleOpenPublishModal,
		handleClosePublishModal,
		deletingItemId,
		duplicatingItemId,
	};
};

export default useListTable;
