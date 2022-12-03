import { Modal, Button, TabPanel, Icon } from '@wordpress/components';
import { sprintf, __ } from '@wordpress/i18n';
import { ClipboardIcon } from '../SVGIcons';
import {
	copiedToClipboardNotice,
	removeCopiedToClipboardNotice,
} from '../notices';

const PublishModal = ({ isOpen, closeModal }) => {
	const clipboardApiFound = window.isSecureContext && navigator.clipboard;

	const handleCopyToClipboard = (text) => {
		if (!clipboardApiFound) {
			return;
		}

		navigator.clipboard.writeText(text);

		copiedToClipboardNotice();
	};

	const handleTabChange = () => {
		removeCopiedToClipboardNotice();
	};

	const getTabContent = (tab) => {
		let description;
		let code;

		const shortcode = `[wcapf_form"]`;
		const widgetName = 'WC Ajax Product Filter — Form';

		const widgetsPageLink = wcapf_admin_params.widgets_page_link;

		if ('shortcode' === tab) {
			description = __(
				'If you want to publish using shortcode, just copy code below and use it.',
				'wc-ajax-product-filter'
			);
			code = shortcode;
		} else if ('php-code' === tab) {
			description = __(
				'If you want to publish using PHP code, just copy code below and use it.',
				'wc-ajax-product-filter'
			);
			code = `<?php echo do_shortcode( '${shortcode}' ); ?>`;
		} else {
			description = sprintf(
				__(
					'Go to the widgets page, add <b>%s</b> widget to the desired area.',
					'wc-ajax-product-filter'
				),
				widgetName
			);
		}

		let classes = '__code';

		if (clipboardApiFound) {
			classes += ' __clipboard-api-found';
		}

		return (
			<div className='__publish_tab_content'>
				<p dangerouslySetInnerHTML={{ __html: description }} />

				{('shortcode' === tab || 'php-code' === tab) && (
					<div
						className={classes}
						tabIndex={0}
						onClick={() => handleCopyToClipboard(code)}
					>
						<div className='__text'>{code}</div>

						{clipboardApiFound && (
							<Icon icon={ClipboardIcon} size={24} />
						)}
					</div>
				)}

				{'widget' === tab && (
					<div className='__link'>
						<Button
							variant='primary'
							href={widgetsPageLink}
							target='_blank'
						>
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
					<h3>{__('Publish Form', 'wc-ajax-product-filter')}</h3>

					<TabPanel
						className='__publish_tab_panel'
						activeClass='active-tab'
						onSelect={handleTabChange}
						tabs={[
							{
								name: 'widget',
								title: __('Widget', 'wc-ajax-product-filter'),
							},
							{
								name: 'shortcode',
								title: __(
									'Shortcode',
									'wc-ajax-product-filter'
								),
							},
							{
								name: 'php-code',
								title: __('PHP Code', 'wc-ajax-product-filter'),
							},
						]}
					>
						{({ name }) => getTabContent(name)}
					</TabPanel>
				</>
			</Modal>
		)
	);
};

export default PublishModal;
