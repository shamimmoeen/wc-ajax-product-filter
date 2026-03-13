import { __ } from '@wordpress/i18n';
import { Modal, Button } from '@wordpress/components';
import { proUpdateRequired } from '../utils';

const message = proUpdateRequired();

const ProUpdateModal = ({ isOpen, closeModal }) => {
	return (
		isOpen && (
			<Modal
				onRequestClose={closeModal}
				__experimentalHideHeader
				className='__pro_update_modal'
			>
				<h3>
					WCAPF – Ajax Product Filter for WooCommerce Pro (Update
					Required)
				</h3>

				<div className='__separator' />

				<p dangerouslySetInnerHTML={{ __html: message }} />

				<div className='__buttons'>
					<Button variant='secondary' onClick={closeModal}>
						{__('Cancel', 'wc-ajax-product-filter')}
					</Button>
				</div>
			</Modal>
		)
	);
};

export default ProUpdateModal;
