import ReviewNotice from '../ReviewNotice';
import { useForm } from './FormContext';

const timeSince = wcapf_admin_params.show_review_notice_for_time_since;

const ReviewNotices = () => {
	const {
		state: { showReviewNotice },
	} = useForm();

	const showReviewNoticeForMilestoneAchieved = showReviewNotice;

	const renderNotices = () => {
		if (showReviewNoticeForMilestoneAchieved) {
			return <ReviewNotice noticeType={'milestone-achieved'} />;
		} else if (timeSince) {
			return (
				<ReviewNotice noticeType={'time-since'} timeSince={timeSince} />
			);
		}
	};

	return renderNotices();
};

export default ReviewNotices;
