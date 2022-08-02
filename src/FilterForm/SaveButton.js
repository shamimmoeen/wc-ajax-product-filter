import { Button, Icon, Spinner } from '@wordpress/components';
import { useState } from '@wordpress/element';
import axios from 'axios';
import { useFilterForm } from './FilterFormContext';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const SaveButton = () => {
	const {
		state: { isDirty, title, formFilters },
		dispatch,
	} = useFilterForm();

	const [isLoading, setLoading] = useState(false);

	const { createErrorNotice } = useDispatch(noticesStore);

	const handleSaveFilterForm = () => {
		setLoading(true);

		// https://stackoverflow.com/a/62939225
		const formData = new FormData();

		formData.append('action', 'save_filter_form');
		formData.append('form_filters', JSON.stringify(formFilters));
		formData.append('post_title', title);

		axios
			.post(wcapf_admin_params.ajaxurl, formData)
			.then(() => {
				setLoading(false);
				dispatch({ type: 'UNSET_DIRTY' });
			})
			.catch((err) => {
				setLoading(false);
				createErrorNotice(err.message, {
					type: 'snackbar',
					icon: '🔥',
				});
			});
	};

	let _disabled = false;

	if (!isDirty) {
		_disabled = true;
	} else if (isLoading) {
		_disabled = true;
	}

	return (
		<Button
			variant='primary'
			className='__save_post'
			disabled={_disabled}
			onClick={handleSaveFilterForm}
		>
			{isLoading ? (
				<Spinner />
			) : (
				<>
					<Icon
						icon={
							<svg>
								<path
									xmlns='http://www.w3.org/2000/svg'
									d='M22,4h-2v6c0,0.552-0.448,1-1,1h-9c-0.552,0-1-0.448-1-1V4H6C4.895,4,4,4.895,4,6v18c0,1.105,0.895,2,2,2h18  c1.105,0,2-0.895,2-2V8L22,4z M22,24H8v-6c0-1.105,0.895-2,2-2h10c1.105,0,2,0.895,2,2V24z'
								/>
								<rect height='5' width='2' x='16' y='4' />
							</svg>
						}
						size={28}
					/>
					<span className='__text'>
						{__('Save', 'wc-ajax-product-filter')}
					</span>
				</>
			)}
		</Button>
	);
};

export default SaveButton;
