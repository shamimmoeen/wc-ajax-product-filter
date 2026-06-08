import { useSelect } from '@wordpress/data';
import ReviewNotice from '../ReviewNotice';
import store from '../../store/form';

const timeSince = wcapf_admin_params.show_review_notice_for_time_since;

const ReviewNotices = () => {
	const showReviewNotice = useSelect(
		( select ) => select( store ).getShowReviewNotice(),
		[],
	);

	const showReviewNoticeForMilestoneAchieved = showReviewNotice;

	const renderNotices = () => {
		if ( showReviewNoticeForMilestoneAchieved ) {
			return <ReviewNotice noticeType={ 'milestone-achieved' } />;
		} else if ( timeSince ) {
			return (
				<ReviewNotice
					noticeType={ 'time-since' }
					timeSince={ timeSince }
				/>
			);
		} else {
			return null;
		}
	};

	return renderNotices();
};

export default ReviewNotices;
