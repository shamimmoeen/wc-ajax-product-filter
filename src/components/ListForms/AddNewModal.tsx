import { __ } from '@wordpress/i18n';
import { Button, Flex, Icon, Modal, Spinner } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { itemCreateErrorNotice, removeItemCreateNotices } from '../notices';
import { getEditFormLink } from '../utils';
import { CheckIcon } from '../SVGIcons';
import { defaultFormSettings } from '../utilsForForm';
import ProFeaturesNotice from '../ProFeaturesNotice';
import store from '../../store/forms';
import { useDispatch, useSelect } from '@wordpress/data';
import React from 'react';

interface AddNewModalProps {
	isOpen: boolean;
	setAddNewModalOpen: ( open: boolean ) => void;
}

const proMessage = __(
	'The free version supports one form only.',
	'wc-ajax-product-filter',
);

const AddNewModal = ( { isOpen, setAddNewModalOpen }: AddNewModalProps ) => {
	const forms = useSelect( ( select ) => select( store ).getForms(), [] );
	const { createForm } = useDispatch( store );

	const [ title, setTitle ] = useState( '' );
	const [ loading, setLoading ] = useState( false );
	const [ newItemId, setNewItemId ] = useState< number | '' >( '' );

	const modalRef = useRef< HTMLDivElement >( null );

	// Focus the modal when loading state gets changed.
	useEffect( () => {
		if ( ! isOpen ) {
			return;
		}

		if ( ! modalRef.current ) {
			return;
		}

		if ( loading ) {
			return;
		}

		( modalRef.current.children[ 0 ] as HTMLElement ).focus();
	}, [ loading ] );

	const handleTitleChange = ( e: React.ChangeEvent< HTMLInputElement > ) => {
		removeItemCreateNotices();

		setTitle( e.target.value );
	};

	const handleCloseModal = () => {
		removeItemCreateNotices();

		setAddNewModalOpen( false );
		setLoading( false );
		setNewItemId( '' );
		setTitle( '' );
	};

	const formSubmissionDisabled = () => {
		if ( WCAPF_PRO ) {
			return false;
		}

		if ( forms.length >= 1 ) {
			return true;
		}
	};

	const handleSubmit = async ( e: React.SyntheticEvent ) => {
		e.preventDefault();

		if ( ! title ) {
			return;
		}

		if ( formSubmissionDisabled() ) {
			return;
		}

		removeItemCreateNotices();

		setLoading( true );

		try {
			const form = await createForm( {
				title,
				settings: defaultFormSettings(),
			} );
			setNewItemId( form.id );
		} catch ( err ) {
			itemCreateErrorNotice( ( err as Error ).message );
		} finally {
			setLoading( false );
		}
	};

	const modalContent = () => {
		if ( loading ) {
			return (
				<div className='__loader'>
					<Spinner />
				</div>
			);
		} else if ( newItemId ) {
			return (
				<div className='__filter_response'>
					<Icon icon={ CheckIcon } />
					<h4>
						{ __( 'Form was created', 'wc-ajax-product-filter' ) }
					</h4>
					<p className='__description'>
						{ __(
							'Now you can add filters and edit the settings of this form.',
							'wc-ajax-product-filter',
						) }
					</p>
					<div className='_buttons'>
						<Button
							variant='secondary'
							onClick={ handleCloseModal }
						>
							{ __( 'Maybe Later', 'wc-ajax-product-filter' ) }
						</Button>
						<Button
							variant='primary'
							href={ getEditFormLink( newItemId ) }
						>
							{ __( 'Edit Form', 'wc-ajax-product-filter' ) }
						</Button>
					</div>
				</div>
			);
		} else {
			return (
				<>
					{ formSubmissionDisabled() && (
						<ProFeaturesNotice message={ proMessage } />
					) }

					<div className='__step_inner __title_step'>
						<form onSubmit={ handleSubmit }>
							<input
								type={ 'text' }
								placeholder={ __(
									'Enter form title',
									'wc-ajax-product-filter',
								) }
								className='components-text-control__input'
								value={ title }
								onChange={ handleTitleChange }
								disabled={ formSubmissionDisabled() }
								autoFocus
							/>
						</form>
					</div>

					<Flex justify={ 'space-between' }>
						<Button
							variant='secondary'
							onClick={ handleCloseModal }
						>
							{ __( 'Cancel', 'wc-ajax-product-filter' ) }
						</Button>

						<Button
							variant='primary'
							onClick={ handleSubmit }
							disabled={ ! title }
							className='__next_btn'
						>
							{ __( 'Next', 'wc-ajax-product-filter' ) }
						</Button>
					</Flex>
				</>
			);
		}
	};

	return (
		isOpen && (
			<Modal
				className='__add_new_modal'
				onRequestClose={ handleCloseModal }
				ref={ modalRef }
				__experimentalHideHeader
			>
				<div className='__add_post_modal'>
					<h3 className='__heading'>
						{ __( 'Add Form', 'wc-ajax-product-filter' ) }
					</h3>

					{ modalContent() }
				</div>
			</Modal>
		)
	);
};

export default AddNewModal;
