import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { close } from '@wordpress/icons';

const V4ReviewFiltersNotice = () => {
	const dismissNonce = wcapf_admin_params.v4_review_filters_dismiss_nonce;
	const [isVisible, setIsVisible] = useState(Boolean(dismissNonce));

	if (!isVisible) return null;

	const handleDismiss = () => {
		setIsVisible(false);

		const formId = new URLSearchParams(window.location.search).get('id');

		fetch(ajaxurl, {
			method: 'POST',
			body: new URLSearchParams({
				action: 'wcapf_dismiss_v4_review_filters_notice',
				nonce: dismissNonce,
				form_id: formId,
			}),
		});
	};

	return (
		<div
			className='components-notice is-info is-dismissible'
			id='wcapf-v4-review-filters-notice'
		>
			<div className='components-notice__content'>
				<p>
					Please review your filters carefully after the
					migration. None of your previous filters have been
					removed; only the filter data has been migrated.
					Take a close look at the filters and consider
					adjusting their order if necessary.
				</p>

				<p>
					Additionally, please ensure that there is only one
					filter per entity in the form. If multiple filters
					for the same entity are present, indicated by a
					light-red background, kindly remove the duplicates,
					as having multiple filters for the same entity in a
					single form is not allowed.
				</p>
			</div>
			<Button
				className='components-notice__dismiss'
				icon={close}
				onClick={handleDismiss}
			></Button>
		</div>
	);
};

export default V4ReviewFiltersNotice;
