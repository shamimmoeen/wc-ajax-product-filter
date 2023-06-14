import ReviewNotice from './ReviewNotice';

const showReviewNoticeForMilestoneAchieved =
	wcapf_admin_params.show_review_notice_for_milestone_achieved;
const timeSince = wcapf_admin_params.show_review_notice_for_time_since;

const ReviewNotices = () => {
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
