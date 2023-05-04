import { __ } from '@wordpress/i18n';
import { Modal, Button } from '@wordpress/components';

const ProV2UpgradeModal = ({ isOpen, closeModal }) => {
	return (
		isOpen && (
			<Modal
				onRequestClose={closeModal}
				__experimentalHideHeader
				className='__pro_v2_upgrade_modal'
			>
				<h3>WC Ajax Product Filter Pro - Upgrade Required</h3>

				<div className='__separator' />

				<p>
					Thank you for using the pro version. WC Ajax Product Filter
					v4 requires you to upgrade WC Ajax Product Filter Pro to
					v2.0.0. Please upgrade.
				</p>

				<div className='__buttons'>
					<Button variant='secondary' onClick={closeModal}>
						{__('Cancel', 'wc-ajax-product-filter')}
					</Button>
				</div>
			</Modal>
		)
	);
};

export default ProV2UpgradeModal;
