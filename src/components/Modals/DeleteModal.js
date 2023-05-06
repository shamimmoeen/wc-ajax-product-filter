import { Modal, Icon, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { DeleteIcon } from '../SVGIcons';

const DeleteModal = ({ isOpen, closeModal, deleteItem, postType }) => {
	let heading;
	let description;

	if ('filter' === postType) {
		heading = __('Delete Filter?', 'wc-ajax-product-filter');
		description = __(
			'This will delete the filter permanently.',
			'wc-ajax-product-filter'
		);
	} else if ('form' === postType) {
		heading = __('Delete Form?', 'wc-ajax-product-filter');
		description = __(
			'This will delete the form permanently.',
			'wc-ajax-product-filter'
		);
	}

	return (
		isOpen && (
			<Modal onRequestClose={closeModal} __experimentalHideHeader>
				<div className='__action_modal __delete_modal'>
					<Icon icon={DeleteIcon} size={60} className='__icon' />

					<h3>{heading}</h3>

					<p className='description'>{description}</p>

					<div className='__buttons'>
						<Button variant='secondary' onClick={closeModal}>
							{__('No', 'wc-ajax-product-filter')}
						</Button>
						<Button
							variant='primary'
							onClick={deleteItem}
							autoFocus
						>
							{__('Yes', 'wc-ajax-product-filter')}
						</Button>
					</div>
				</div>
			</Modal>
		)
	);
};

export default DeleteModal;
