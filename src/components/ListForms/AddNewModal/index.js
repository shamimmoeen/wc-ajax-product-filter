import { Modal } from '@wordpress/components';
import { removeItemCreateNotice } from '../../notices';

const AddNewModal = ({ isOpen, setAddNewModalOpen }) => {
	const handleCloseModal = () => {
		removeItemCreateNotice();

		setAddNewModalOpen(false);
		// setStep(1);
		// setTotalSteps(3);
		// setLoading(true);
		// setNewItemId('');

		// dispatch({ type: 'SET_TITLE', payload: '' });
		// dispatch({ type: 'SET_FILTER_TYPE', payload: '' });
		// dispatch({ type: 'SET_ACTIVE_FILTER_DATA', payload: {} });
		// dispatch({ type: 'SET_FILTER_KEYS', payload: {} });
		// dispatch({ type: 'SET_ADDITIONAL_DATA', payload: {} });
		// dispatch({ type: 'SET_FILTERS_DATA', payload: {} });
	};

	return (
		isOpen && (
			<Modal
				className='__add_filter_modal'
				onRequestClose={handleCloseModal}
				ref={modalRef}
				__experimentalHideHeader
			>
				<div className='__add_post_modal'>
					<h3 className='__heading'>
						{__('Add Filter', 'wc-ajax-product-filter')}
					</h3>

					{modalContent()}
				</div>
			</Modal>
		)
	);
};

export default AddNewModal;
