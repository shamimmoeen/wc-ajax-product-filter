import { __ } from '@wordpress/i18n';
import { Modal, Button } from '@wordpress/components';
import { proUpgradeRequired } from '../utils';

const proUpgradeNotice = proUpgradeRequired();

const ProUpgradeModal = ({ isOpen, closeModal }) => {
	return (
		isOpen && (
			<Modal
				onRequestClose={closeModal}
				__experimentalHideHeader
				className='__pro_upgrade_modal'
			>
				<h3>
					WCAPF - WooCommerce Ajax Product Filter Pro (Upgrade
					Required)
				</h3>

				<div className='__separator' />

				<p
					dangerouslySetInnerHTML={{
						__html: proUpgradeNotice['message'],
					}}
				/>

				<div className='__buttons'>
					<Button variant='secondary' onClick={closeModal}>
						{__('Cancel', 'wc-ajax-product-filter')}
					</Button>
				</div>
			</Modal>
		)
	);
};

export default ProUpgradeModal;
