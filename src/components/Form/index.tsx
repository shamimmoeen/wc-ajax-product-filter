import TopBar from '../TopBar';
import FormTitle from './FormTitle';
import FormTabPanel from './FormTabPanel';
import Notifications from '../Notifications';
import ReviewNotices from './ReviewNotices';

const Form = () => {
	return (
		<>
			<div className='__wcapf_admin'>
				<TopBar view={ 'form' } />

				{ /* This is customized only for the 'form' view */ }
				<ReviewNotices />

				<div className='__edit_filter'>
					<div className='__edit_filter_from'>
						<div className='__content'>
							<FormTitle />
							<FormTabPanel />
						</div>
					</div>

					{ /* <FormPreview /> */ }
				</div>

				<Notifications />
			</div>
		</>
	);
};

export default Form;
