import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import store from '../../store/forms';
import TopBar from '../TopBar';
import Table from './Table';
import Sidebar from '../Sidebar';
import AddNewModal from './AddNewModal';
import Notifications from '../Notifications';
import DeleteModal from '../Modals/DeleteModal';
import DuplicateModal from '../Modals/DuplicateModal';
import PublishModal from '../Modals/PublishModal';
import {
	itemDeletedSuccessNotice,
	itemDeletedErrorNotice,
	itemDuplicatedSuccessNotice,
	itemDuplicatedErrorNotice,
	removeCopiedToClipboardNotice,
	removeItemCreateNotices, // TODO: should be removeItemCreatedNotices
	removeItemDeletedNotices,
	removeItemDuplicatedNotices,
} from '../notices';

const postType = 'form';

const ListForms = () => {
	const { deleteForm, duplicateForm } = useDispatch( store );

	const [ addNewModalOpen, setAddNewModalOpen ] = useState( false );
	const [ deleteModalId, setDeleteModalId ] = useState< number | null >(
		null,
	);
	const [ duplicateModalId, setDuplicateModalId ] = useState< number | null >(
		null,
	);
	const [ publishModalOpen, setPublishModalOpen ] = useState( false );
	const [ deletingItemId, setDeletingItemId ] = useState< number | null >(
		null,
	);
	const [ duplicatingItemId, setDuplicatingItemId ] = useState<
		number | null
	>( null );

	const clearActionNotices = () => {
		removeItemCreateNotices();
		removeItemDeletedNotices();
		removeItemDuplicatedNotices();
	};

	const handleOpenAddNewModal = () => {
		clearActionNotices();
		setAddNewModalOpen( true );
	};

	const handleOpenDeleteModal = ( id: number ) => {
		clearActionNotices();
		setDeleteModalId( id );
	};

	const handleDeleteItem = async () => {
		const id = deleteModalId;
		if ( id === null ) {
			return;
		}

		setDeleteModalId( null );
		setDeletingItemId( id );

		try {
			await deleteForm( id );
			itemDeletedSuccessNotice(
				__( 'Form deleted successfully', 'wc-ajax-product-filter' ),
			);
		} catch ( err ) {
			itemDeletedErrorNotice( ( err as Error ).message );
		} finally {
			setDeletingItemId( null );
		}
	};

	const handleOpenDuplicateModal = ( id: number ) => {
		clearActionNotices();
		setDuplicateModalId( id );
	};

	const handleDuplicateItem = async () => {
		const id = duplicateModalId;
		if ( id === null ) {
			return;
		}

		setDuplicateModalId( null );
		setDuplicatingItemId( id );

		try {
			await duplicateForm( id );
			itemDuplicatedSuccessNotice(
				__( 'Form duplicated successfully', 'wc-ajax-product-filter' ),
			);
		} catch ( err ) {
			itemDuplicatedErrorNotice( ( err as Error ).message );
		} finally {
			setDuplicatingItemId( null );
		}
	};

	const handleOpenPublishModal = () => {
		clearActionNotices();
		setPublishModalOpen( true );
	};

	const handleClosePublishModal = () => {
		removeCopiedToClipboardNotice();
		setPublishModalOpen( false );
	};

	return (
		<div className='__wcapf_admin'>
			<TopBar view={ 'forms' } />

			<div className='__wcapf_layout'>
				<div className='__main'>
					<Table
						openAddNewModal={ handleOpenAddNewModal }
						openDeleteModal={ handleOpenDeleteModal }
						openDuplicateModal={ handleOpenDuplicateModal }
						openPublishModal={ handleOpenPublishModal }
						deletingItemId={ deletingItemId }
						duplicatingItemId={ duplicatingItemId }
					/>

					<Sidebar />
				</div>

				<AddNewModal
					isOpen={ addNewModalOpen }
					setAddNewModalOpen={ setAddNewModalOpen }
				/>

				<DeleteModal
					isOpen={ deleteModalId }
					closeModal={ () => setDeleteModalId( null ) }
					deleteItem={ handleDeleteItem }
					postType={ postType }
				/>

				<DuplicateModal
					isOpen={ duplicateModalId }
					closeModal={ () => setDuplicateModalId( null ) }
					duplicateItem={ handleDuplicateItem }
					postType={ postType }
				/>

				<PublishModal
					isOpen={ publishModalOpen }
					closeModal={ handleClosePublishModal }
				/>

				<Notifications />
			</div>
		</div>
	);
};

export default ListForms;
