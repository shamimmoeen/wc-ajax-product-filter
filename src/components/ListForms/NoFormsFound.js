import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button, Icon } from '@wordpress/components';
import { ImportIcon, PlusIcon } from '../SVGIcons';
import axios from 'axios';
import { useListForms } from './ListFormsContext';
import {
	itemCreateErrorNotice,
	itemCreateSuccessNotice,
	removeItemCreateNotices,
	removeItemDeletedNotices,
	removeItemDuplicatedNotices,
} from '../notices';

const NoFormsFound = () => {
	const {
		state: { forms },
		dispatch,
	} = useListForms();

	const [loading, setLoading] = useState(false);

	const handleImportSampleForm = () => {
		removeItemCreateNotices();
		removeItemDeletedNotices();
		removeItemDuplicatedNotices();

		setLoading(true);

		const formData = new FormData();

		formData.append('action', 'wcapf_create_sample_form');

		axios
			.post(wcapf_admin_params.ajaxurl, formData)
			.then((res) => {
				setLoading(false);

				const {
					data: { data, success },
				} = res;

				if (success) {
					itemCreateSuccessNotice();

					const _forms = [data, ...forms];

					dispatch({ type: 'SET_FORMS', payload: _forms });
				} else {
					itemCreateErrorNotice(data);
				}
			})
			.catch((err) => {
				setLoading(false);

				itemCreateErrorNotice(err.message);
			});
	};

	return (
		<div className='__import_sample_form'>
			<Icon icon={PlusIcon} size={40} fill='#babbbc' />

			<h3>
				{__("You don't have any forms yet.", 'wc-ajax-product-filter')}
			</h3>

			<p className='__description'>
				{__(
					'Do you want to create a sample form? Click on the button below.',
					'wc-ajax-product-filter'
				)}
			</p>

			<Button
				variant='secondary'
				onClick={handleImportSampleForm}
				isBusy={loading}
				disabled={loading}
			>
				<Icon icon={ImportIcon} size={20} />
				{__('Create a Sample Form', 'wc-ajax-product-filter')}
			</Button>
		</div>
	);
};

export default NoFormsFound;
