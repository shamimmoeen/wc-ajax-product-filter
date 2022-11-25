import { Modal, Button } from '@wordpress/components';
import { sprintf, __ } from '@wordpress/i18n';

const PublishModal = ({ isOpen: id, closeModal }) => {
	const description = sprintf(
		__(
			'Go to the widgets page, add <b>%s</b> widget to the desired area.',
			'wc-ajax-product-filter'
		),
		'WC Ajax Product Filter'
	);

	const widgetsPageLink = wcapf_admin_params.widgets_page_link;

	return (
		id && (
			<Modal
				onRequestClose={closeModal}
				__experimentalHideHeader
				className='__publish_modal'
			>
				<h3>{__('Publish Form', 'wc-ajax-product-filter')}</h3>

				<p dangerouslySetInnerHTML={{ __html: description }} />

				<div className='__link'>
					<Button
						variant='primary'
						href={widgetsPageLink}
						target='_blank'
					>
						{__('Go to Widgets', 'wc-ajax-product-filter')}
					</Button>
				</div>
			</Modal>
		)
	);
};

export default PublishModal;
