const smileyIcon = 'dashicons dashicons-smiley wcapf-dashicon-smiley';
const reviewUrl =
	'https://wordpress.org/support/plugin/wc-ajax-product-filter/reviews/?filter=5';

const ReviewNotice = ({ noticeType, timeSince }) => {
	const dismissNotice = (type) => {
		if (typeof wcapfDismissNotice === 'function') {
			wcapfDismissNotice(type);
		}
	};

	let noticeClasses;
	let noticeId;
	let noticeMessage;

	if ('milestone-achieved' === noticeType) {
		noticeClasses = 'notice notice-info is-dismissible review-notice';
		noticeId = 'wcapf-review-notice-for-milestone-achieved';
		noticeMessage = (
			<>
				<p>
					<span className={smileyIcon}></span> Congratulations! You
					have reached a milestone in using WCAPF - WooCommerce Ajax
					Product Filter by updating the filters five times. Help us
					improve by sharing your experience. Please consider{' '}
					<a href={reviewUrl} target='_blank'>
						writing a review on WordPress
					</a>
					.
				</p>
				<button
					type='button'
					className='notice-dismiss'
					onClick={() => dismissNotice('milestone-achieved')}
				>
					<span className='screen-reader-text'>
						Dismiss this notice
					</span>
				</button>
			</>
		);
	} else {
		noticeClasses = 'notice notice-info review-notice';
		noticeId = 'wcapf-review-notice-for-time-since';
		noticeMessage = (
			<p>
				Awesome! You've been using WCAPF - WooCommerce Ajax Product
				Filter for more than {timeSince}. Would you mind taking a few
				seconds to give it a 5-star rating on WordPress? Thank you in
				advance :){' '}
				<a href={reviewUrl} target='_blank'>
					Ok, you deserved it
				</a>{' '}
				|{' '}
				<a
					href={'#'}
					onClick={() =>
						dismissNotice('permanently-dismiss-time-since')
					}
				>
					I already did
				</a>{' '}
				|{' '}
				<a
					href={'#'}
					onClick={() => dismissNotice('postpone-time-since')}
				>
					No, not good enough
				</a>
			</p>
		);
	}

	return (
		<div className={noticeClasses} id={noticeId}>
			{noticeMessage}
		</div>
	);
};

export default ReviewNotice;
