import { __ } from '@wordpress/i18n';
import { Button, Flex, Icon, Modal, Spinner } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { itemCreateErrorNotice, removeItemCreateNotice } from '../notices';
import { getEditFormLink } from '../utils';
import { useListForms } from './ListFormsContext';
import { CheckIcon } from '../SVGIcons';
import axios from 'axios';
import { defaultFormSettings } from '../utilsForForm';

const AddNewModal = ({ isOpen, setAddNewModalOpen }) => {
	const {
		state: { forms },
		dispatch,
	} = useListForms();

	const [title, setTitle] = useState('');
	const [loading, setLoading] = useState(false);
	const [newItemId, setNewItemId] = useState('');

	const modalRef = useRef(null);

	// Focus the modal when loading state gets changed.
	useEffect(() => {
		if (!isOpen) {
			return;
		}

		if (!modalRef.current) {
			return;
		}

		if (loading) {
			return;
		}

		modalRef.current.children[0].focus();
	}, [loading]);

	const handleTitleChange = (e) => {
		removeItemCreateNotice();

		setTitle(e.target.value);
	};

	const handleCloseModal = () => {
		removeItemCreateNotice();

		setAddNewModalOpen(false);
		setLoading(false);
		setNewItemId('');
		setTitle('');
	};

	const handleSubmit = () => {
		removeItemCreateNotice();

		setLoading(true);

		const formData = new FormData();

		formData.append('action', 'wcapf_save_form');
		formData.append('form_title', title);
		formData.append('form_settings', JSON.stringify(defaultFormSettings()));

		axios
			.post(wcapf_admin_params.ajaxurl, formData)
			.then((res) => {
				setLoading(false);

				const {
					data: { data, success },
				} = res;

				if (success) {
					setNewItemId(data.id);

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

	const modalContent = () => {
		if (loading) {
			return (
				<div className='__loader'>
					<Spinner />
				</div>
			);
		} else if (newItemId) {
			return (
				<div className='__filter_response'>
					<Icon icon={CheckIcon} />
					<h4>{__('Form was created', 'wc-ajax-product-filter')}</h4>
					<p className='__description'>
						{__(
							'Now you can add filters and edit the settings of this form.',
							'wc-ajax-product-filter'
						)}
					</p>
					<div className='_buttons'>
						<Button variant='secondary' onClick={handleCloseModal}>
							{__('Maybe Later', 'wc-ajax-product-filter')}
						</Button>
						<Button
							variant='primary'
							href={getEditFormLink(newItemId)}
						>
							{__('Edit Form', 'wc-ajax-product-filter')}
						</Button>
					</div>
				</div>
			);
		} else {
			return (
				<>
					<div className='__step_inner __title_step'>
						<input
							type={'text'}
							placeholder={__(
								'Enter form title',
								'wc-ajax-product-filter'
							)}
							className='components-text-control__input'
							value={title}
							onChange={handleTitleChange}
						/>
					</div>

					<Flex justify={'space-between'}>
						<Button variant='secondary' onClick={handleCloseModal}>
							{__('Cancel', 'wc-ajax-product-filter')}
						</Button>

						<Button
							variant='primary'
							onClick={handleSubmit}
							disabled={!title}
							className='__next_btn'
						>
							{__('Next', 'wc-ajax-product-filter')}
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
				onRequestClose={handleCloseModal}
				ref={modalRef}
				__experimentalHideHeader
			>
				<div className='__add_post_modal'>
					<h3 className='__heading'>
						{__('Add Form', 'wc-ajax-product-filter')}
					</h3>

					{modalContent()}
				</div>
			</Modal>
		)
	);
};

export default AddNewModal;
