import { Modal, Icon, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { DeleteIcon } from '../SVGIcons';

const DeleteModal = ({ isOpen, closeModal, deleteFilter }) => {
	return (
		isOpen && (
			<Modal onRequestClose={closeModal} __experimentalHideHeader>
				<div className='__action_modal __delete_modal'>
					<Icon icon={DeleteIcon} size={60} className='__icon' />

					<h3>{__('Delete Filter?', 'wc-ajax-product-filter')}</h3>

					<p className='description'>
						{__(
							'This will delete the filter permanently.',
							'wc-ajax-product-filter'
						)}
					</p>

					<div className='__buttons'>
						<Button variant='secondary' onClick={closeModal}>
							{__('No', 'wc-ajax-product-filter')}
						</Button>
						<Button variant='primary' onClick={deleteFilter}>
							{__('Yes', 'wc-ajax-product-filter')}
						</Button>
					</div>
				</div>
			</Modal>
		)
	);
};

export default DeleteModal;
