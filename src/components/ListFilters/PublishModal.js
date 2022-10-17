import { Modal, Button, TabPanel, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ClipboardIcon } from '../SVGIcons';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';

const PublishModal = ({ isOpen, closeModal }) => {
	const { createSuccessNotice } = useDispatch(noticesStore);

	const clipboardApiFound = window.isSecureContext && navigator.clipboard;

	const handleCopyToClipboard = (text) => {
		if (!clipboardApiFound) {
			return;
		}

		navigator.clipboard.writeText(text);

		createSuccessNotice('Copied to clipboard', {
			type: 'snackbar',
			id: 'copied-to-clipboard',
		});
	};

	const gettabContent = (tab) => {
		let description;
		let code;

		if ('shortcode' === tab) {
			description = __(
				'If you want to publish using shortcode, just copy code below and use it.',
				'wc-ajax-product-filter'
			);
			code = '[wcapf_filter id="456"]';
		} else if ('php-code' === tab) {
			description = __(
				'If you want to publish using PHP code, just copy code below and use it.',
				'wc-ajax-product-filter'
			);
			code = '<?php echo do_shortcode( \'[wcapf_filter id="456"]\' ); ?>';
		} else {
			description = __(
				"If you want to use it in a widget, go to the widgets page, and then drag and drop plugin's widget to the desired area.",
				'wc-ajax-product-filter'
			);
		}

		let classes = '__code';

		if (clipboardApiFound) {
			classes += ' __clipboard-api-found';
		}

		return (
			<div className='__publish_tab_content'>
				<p>{description}</p>

				{('shortcode' === tab || 'php-code' === tab) && (
					<div
						className={classes}
						tabIndex={0}
						onClick={() => handleCopyToClipboard('hello world')}
					>
						<div className='__text'>{code}</div>

						{clipboardApiFound && (
							<Icon icon={ClipboardIcon} size={24} />
						)}
					</div>
				)}

				{'widget' === tab && (
					<div className='__link'>
						<Button variant='primary'>
							{__('Go to Widgets', 'wc-ajax-product-filter')}
						</Button>
					</div>
				)}

				<div className='__buttons'>
					<Button variant='secondary' onClick={closeModal}>
						{__('Cancel', 'wc-ajax-product-filter')}
					</Button>
				</div>
			</div>
		);
	};

	return (
		isOpen && (
			<Modal
				onRequestClose={closeModal}
				__experimentalHideHeader
				className='__publish_modal'
			>
				<>
					<h3>{__('Publish Filter', 'wc-ajax-product-filter')}</h3>

					<TabPanel
						className='__publish_tab_panel'
						activeClass='active-tab'
						tabs={[
							{
								name: 'shortcode',
								title: __(
									'Shortcode',
									'wc-ajax-product-filter'
								),
								className: 'shortcode',
							},
							{
								name: 'php-code',
								title: __('PHP Code', 'wc-ajax-product-filter'),
								className: 'php-code',
							},
							{
								name: 'widget',
								title: __('Widget', 'wc-ajax-product-filter'),
								className: 'widget',
							},
						]}
					>
						{(tab) => gettabContent(tab.name)}
					</TabPanel>
				</>
			</Modal>
		)
	);
};

export default PublishModal;
