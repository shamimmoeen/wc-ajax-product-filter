import { __ } from '@wordpress/i18n';
import { Button, Icon } from '@wordpress/components';
import { BackIcon } from './SVGIcons';
import { removeParam } from './utils';
import axios from 'axios';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';

const Title = ({ value, handleChange }) => {
	const { createErrorNotice } = useDispatch(noticesStore);

	const link = removeParam('id', window.location.search);

	const handlePublish = () => {
		const formData = new FormData();

		formData.append('action', 'save_filter');
		formData.append('post_title', 'hello world');

		axios
			.post(wcapf_admin_params.ajaxurl, formData)
			.then(() => {})
			.catch((err) => {
				createErrorNotice(err.message, {
					type: 'snackbar',
					icon: '🔥',
				});
			});
	};

	return (
		<div className='__title_wrapper'>
			<Button href={link} className='__back_button'>
				<Icon icon={BackIcon} />
			</Button>

			<input
				type='text'
				value={value}
				className='components-text-control__input'
				onChange={(e) => handleChange(e.target.value)}
			/>

			<Button
				variant='secondary'
				className='__save_button'
				onClick={handlePublish}
			>
				{__('Publish', 'wc-ajax-product-filter	')}
			</Button>
		</div>
	);
};

export default Title;
