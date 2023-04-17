import { useListForms } from './ListFormsContext';
import TopBar from '../TopBar';
import Table from './Table';
import Sidebar from '../Sidebar';
import AddNewModal from './AddNewModal';
import Notifications from '../Notifications';
import useListTable from '../useListTable';
import DeleteModal from '../Modals/DeleteModal';
import DuplicateModal from '../Modals/DuplicateModal';
import PublishModal from '../Modals/PublishModal';

const ListForms = () => {
	const {
		state: { forms: items },
		dispatch,
	} = useListForms();

	const postType = 'form';

	const {
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
	} = useListTable(dispatch, items, postType);

	return (
		<div className='__wcapf_admin'>
			<TopBar view={'forms'} />

			<div className='__wcapf_layout'>
				<div className='__main'>
					<Table
						openAddNewModal={handleOpenAddNewModal}
						openDeleteModal={handleOpenDeleteModal}
						openDuplicateModal={handleOpenDuplicateModal}
						openPublishModal={handleOpenPublishModal}
						deletingItemId={deletingItemId}
						duplicatingItemId={duplicatingItemId}
					/>

					<Sidebar />
				</div>

				<AddNewModal
					isOpen={addNewModalOpen}
					setAddNewModalOpen={setAddNewModalOpen}
				/>

				<DeleteModal
					isOpen={deleteModalId}
					closeModal={handleCloseDeleteModal}
					deleteItem={handleDeleteItem}
					postType={postType}
				/>

				<DuplicateModal
					isOpen={duplicateModalId}
					closeModal={handleCloseDuplicateModal}
					duplicateItem={handleDuplicateItem}
					postType={postType}
				/>

				<PublishModal
					isOpen={publishModalOpen}
					closeModal={handleClosePublishModal}
				/>

				<Notifications />
			</div>
		</div>
	);
};

export default ListForms;
