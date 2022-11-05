import { __ } from '@wordpress/i18n';
import { Button, Icon, Modal, Spinner } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { itemCreateErrorNotice, removeItemCreateNotice } from '../../notices';
import { getAvailableFilters, getEditFormLink } from '../../utils';
import { defaultFormSettings } from '../../utilsForForm';
import { useListForms } from '../ListFormsContext';
import { CheckIcon } from '../../SVGIcons';
import Body from './Body';
import Footer from './Footer';
import axios from 'axios';

const AddNewModal = ({ isOpen, setAddNewModalOpen }) => {
	const {
		state: { title, forms, formFilters },
		dispatch,
	} = useListForms();

	const [loading, setLoading] = useState(true);
	const [step, setStep] = useState(1);
	const [newItemId, setNewItemId] = useState('');

	const modalRef = useRef(null);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		getAvailableFilters()
			.then((res) => {
				const {
					data: { data: availableFilters },
				} = res;

				dispatch({
					type: 'SET_AVAILABLE_FILTERS',
					payload: availableFilters,
				});

				setLoading(false);
			})
			.catch((err) => console.log(err));
	}, [isOpen]);

	// Focus the modal when step gets changed.
	useEffect(() => {
		if (!isOpen) {
			return;
		}

		if (!modalRef.current) {
			return;
		}

		if (step < 2) {
			return;
		}

		modalRef.current.children[0].focus();
	}, [step]);

	// Focus the modal when loading state gets changed.
	useEffect(() => {
		if (!isOpen) {
			return;
		}

		if (!modalRef.current) {
			return;
		}

		if (step < 2) {
			return;
		}

		if (loading) {
			return;
		}

		modalRef.current.children[0].focus();
	}, [loading]);

	const handleCloseModal = () => {
		removeItemCreateNotice();

		setAddNewModalOpen(false);
		setStep(1);
		setLoading(true);
		setNewItemId('');

		dispatch({ type: 'SET_DIRTY', payload: false });
		dispatch({ type: 'SET_TITLE', payload: '' });
		dispatch({ type: 'SET_AVAILABLE_FILTERS', payload: [] });
		dispatch({ type: 'SET_FORM_FILTERS', payload: [] });
	};

	const handleSubmit = () => {
		removeItemCreateNotice();

		setLoading(true);

		const formData = new FormData();

		formData.append('action', 'wcapf_save_form');
		formData.append('form_title', title);
		formData.append('form_filters', JSON.stringify(formFilters));
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
					<p className='description'>
						{__(
							'Now you can edit all the settings of this form.',
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
					<Body step={step} />

					<Footer
						step={step}
						setStep={setStep}
						closeModal={handleCloseModal}
						handleSubmit={handleSubmit}
					/>
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
