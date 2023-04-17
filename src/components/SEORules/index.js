import { __ } from '@wordpress/i18n';
import Notifications from '../Notifications';
import Sidebar from '../Sidebar';
import TopBar from '../TopBar';
import Table from './Table';

const SEORules = () => {
	return (
		<div className='__wcapf_admin'>
			<TopBar view={'seo-rules'} />

			<div className='__wcapf_layout'>
				<div className='__main'>
					<Table
					// openAddNewModal={handleOpenAddNewModal}
					// openDeleteModal={handleOpenDeleteModal}
					// openDuplicateModal={handleOpenDuplicateModal}
					// openPublishModal={handleOpenPublishModal}
					// deletingItemId={deletingItemId}
					// duplicatingItemId={duplicatingItemId}
					/>

					<Sidebar />
				</div>

				<Notifications />
			</div>
		</div>
	);
};

export default SEORules;
