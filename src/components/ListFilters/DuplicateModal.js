import { Modal, Icon, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { DuplicateIcon } from '../SVGIcons';

const DuplicateModal = ({ isOpen, closeModal }) => {
	return (
		isOpen && (
			<Modal onRequestClose={closeModal} __experimentalHideHeader>
				<div className='__action_modal __duplicate_modal'>
					<Icon icon={DuplicateIcon} size={60} />

					<h3>{__('Duplicate Filter?', 'wc-ajax-product-filter')}</h3>

					<p className='description'>
						{__(
							'This will duplicate the filter.',
							'wc-ajax-product-filter'
						)}
					</p>

					<div className='__buttons'>
						<Button variant='secondary' onClick={closeModal}>
							{__('No', 'wc-ajax-product-filter')}
						</Button>
						<Button variant='primary'>
							{__('Yes', 'wc-ajax-product-filter')}
						</Button>
					</div>
				</div>
			</Modal>
		)
	);
};

export default DuplicateModal;
