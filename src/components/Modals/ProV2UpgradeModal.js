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
				<h3>
					WCAPF - WooCommerce Ajax Product Filter Pro (Upgrade
					Required)
				</h3>

				<div className='__separator' />

				<p>
					Thank you for using the Pro version. To ensure compatibility
					with <i>WCAPF - WooCommerce Ajax Product Filter</i> v4.0.0,
					it is necessary to upgrade{' '}
					<i>WCAPF - WooCommerce Ajax Product Filter Pro</i> to
					v2.0.0. Please proceed with the upgrade.
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
