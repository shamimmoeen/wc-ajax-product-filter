import { Button, Icon, Spinner } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { cloudUpload } from '@wordpress/icons';
import axios from 'axios';

const FilterFormSaveButton = () => {
	const [isLoading, setLoading] = useState(false);
	const [isModified, setModified] = useState(true);

	const handleSaveFilterForm = async () => {
		setLoading(true);

		const data = {
			action: 'save_filter_form',
		};

		try {
			const fetchFilters = await axios.get(wcapf_admin_params.ajaxurl, {
				params: data,
			});

			const response = fetchFilters.data;

			console.log(response);
		} catch (err) {
			console.log(err.message);
		}

		setLoading(false);
		setModified(false);
	};

	let _disabled = false;

	if (!isModified) {
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
			{isLoading ? <Spinner /> : <Icon icon={cloudUpload} size={40} />}
		</Button>
	);
};

export default FilterFormSaveButton;
