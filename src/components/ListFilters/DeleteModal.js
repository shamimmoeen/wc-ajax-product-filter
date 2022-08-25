import { Modal, Icon, Button } from '@wordpress/components';
import { trash } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

const DeleteModal = ({ isOpen, closeModal }) => {
	return (
		isOpen && (
			<Modal onRequestClose={closeModal} __experimentalHideHeader>
				<div className='__delete_modal'>
					<Icon icon={trash} size={40} />

					<h3>{__('Are you sure?', 'wc-ajax-product-filter')}</h3>

					<p className='description'>
						{__(
							'This will delete the filter permanently.',
							'wc-ajax-product-filter'
						)}
					</p>

					<div className='__buttons'>
						<Button
							variant='secondary'
							onClick={closeModal}
							autoFocus
						>
							{__('Cancel', 'wc-ajax-product-filter')}
						</Button>
						<Button variant='primary'>
							{__('Delete', 'wc-ajax-product-filter')}
						</Button>
					</div>
				</div>
			</Modal>
		)
	);
};

export default DeleteModal;
