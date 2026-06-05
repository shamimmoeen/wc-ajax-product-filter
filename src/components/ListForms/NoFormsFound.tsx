import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button, Icon } from '@wordpress/components';
import { ImportIcon, PlusIcon } from '../SVGIcons';
import {
	itemCreateErrorNotice,
	itemCreateSuccessNotice,
	removeItemCreateNotices,
	removeItemDeletedNotices,
	removeItemDuplicatedNotices,
} from '../notices';
import store from '../../store/forms';
import { useDispatch } from '@wordpress/data';

const NoFormsFound = () => {
	const { createSampleForm } = useDispatch( store );
	const [ loading, setLoading ] = useState( false );

	const handleImportSampleForm = async () => {
		// todo: create a utility function.
		removeItemCreateNotices();
		removeItemDeletedNotices();
		removeItemDuplicatedNotices();

		setLoading( true );

		try {
			await createSampleForm();
			itemCreateSuccessNotice(); // todo: should be created
		} catch ( err ) {
			itemCreateErrorNotice( ( err as Error ).message );
		} finally {
			setLoading( false );
		}
	};

	return (
		<div className='__import_sample_form'>
			<Icon icon={ PlusIcon } size={ 40 } fill='#babbbc' />

			<h3>
				{ __(
					"You don't have any forms yet.",
					'wc-ajax-product-filter',
				) }
			</h3>

			<p className='__description'>
				{ __(
					'Do you want to create a sample form? Click on the button below.',
					'wc-ajax-product-filter',
				) }
			</p>

			<Button
				variant='secondary'
				onClick={ handleImportSampleForm }
				isBusy={ loading }
				disabled={ loading }
			>
				<Icon icon={ ImportIcon } size={ 20 } />
				{ __( 'Create a Sample Form', 'wc-ajax-product-filter' ) }
			</Button>
		</div>
	);
};

export default NoFormsFound;
