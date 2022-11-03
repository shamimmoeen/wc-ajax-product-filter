import { Modal, Icon, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { DuplicateIcon } from '../SVGIcons';

const DuplicateModal = ({ isOpen, closeModal, duplicateItem, postType }) => {
	let heading;
	let description;

	if ('filter' === postType) {
		heading = __('Delete Filter?', 'wc-ajax-product-filter');
		description = __(
			'This will duplicate the filter.',
			'wc-ajax-product-filter'
		);
	} else if ('form' === postType) {
		heading = __('Delete Form?', 'wc-ajax-product-filter');
		description = __(
			'This will duplicate the form.',
			'wc-ajax-product-filter'
		);
	}

	return (
		isOpen && (
			<Modal onRequestClose={closeModal} __experimentalHideHeader>
				<div className='__action_modal __duplicate_modal'>
					<Icon icon={DuplicateIcon} size={60} className='__icon' />

					<h3>{heading}</h3>

					<p className='description'>{description}</p>

					<div className='__buttons'>
						<Button variant='secondary' onClick={closeModal}>
							{__('No', 'wc-ajax-product-filter')}
						</Button>
						<Button variant='primary' onClick={duplicateItem}>
							{__('Yes', 'wc-ajax-product-filter')}
						</Button>
					</div>
				</div>
			</Modal>
		)
	);
};

export default DuplicateModal;
