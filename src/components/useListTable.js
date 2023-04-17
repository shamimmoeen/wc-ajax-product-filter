import { useState } from '@wordpress/element';
import axios from 'axios';
import {
	itemDeletedErrorNotice,
	itemDeletedSuccessNotice,
	itemDuplicatedErrorNotice,
	itemDuplicatedSuccessNotice,
	removeCopiedToClipboardNotice,
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
		removeItemDeletedNotices();
		removeItemDuplicatedNotices();

		setAddNewModalOpen(true);
	};

	const handleOpenDeleteModal = (id) => {
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

		const formData = new FormData();

		formData.append('action', `wcapf_delete_${postType}`);
		formData.append('post_id', id);

		axios
			.post(wcapf_admin_params.ajaxurl, formData)
			.then((res) => {
				setDeletingItemId(null);

				const {
					data: { data: message, success },
				} = res;

				if (success) {
					itemDeletedSuccessNotice(message);

					const _items = items.filter((item) => item.id !== id);

					dispatch({ type: dispatchType, payload: _items });
				} else {
					itemDeletedErrorNotice(message);
				}
			})
			.catch((err) => {
				setDeletingItemId(null);

				itemDeletedErrorNotice(err.message);
			});
	};

	const handleOpenDuplicateModal = (id) => {
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

		const formData = new FormData();

		formData.append('action', `wcapf_duplicate_${postType}`);
		formData.append('post_id', id);

		axios
			.post(wcapf_admin_params.ajaxurl, formData)
			.then((res) => {
				setDuplicatingItemId(null);

				const {
					data: { data, success },
				} = res;

				if (success) {
					const { message, new_post } = data;

					itemDuplicatedSuccessNotice(message);

					const _items = [new_post, ...items];

					dispatch({ type: dispatchType, payload: _items });
				} else {
					itemDuplicatedErrorNotice(data);
				}
			})
			.catch((err) => {
				setDuplicatingItemId(null);

				itemDuplicatedErrorNotice(err.message);
			});
	};

	const handleOpenPublishModal = () => {
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
