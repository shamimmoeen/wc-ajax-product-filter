import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';
import { Button, Icon, Modal, Spinner } from '@wordpress/components';
import Footer from './Footer';
import Body from './Body';
import { useListFilters } from '../ListFiltersContext';
import { getAdditionalData, getEditFilterLink } from '../../utils';
import { CheckIcon } from '../../SVGIcons';
import axios from 'axios';
import { itemCreateErrorNotice, removeItemCreateNotice } from '../../notices';

const AddNewModal = ({ isOpen, setAddNewModalOpen }) => {
	const {
		state: { title, filterType, activeFilterData, filters },
		dispatch,
	} = useListFilters();

	const [loading, setLoading] = useState(true);
	const [step, setStep] = useState(1);
	const [totalSteps, setTotalSteps] = useState(3);
	const [newItemId, setNewItemId] = useState('');

	const modalRef = useRef(null);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		getAdditionalData()
			.then((res) => {
				const {
					data: { data: additionalData },
				} = res;

				dispatch({
					type: 'SET_ADDITIONAL_DATA',
					payload: additionalData,
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

	// Change the total steps according to the filter type.
	useEffect(() => {
		if (!filterType) {
			return;
		}

		const filtersWithoutOptions = ['active-filters', 'reset-button'];

		if (filtersWithoutOptions.includes(filterType)) {
			if (3 === totalSteps) {
				setTotalSteps(2);
			}
		} else {
			if (2 === totalSteps) {
				setTotalSteps(3);
			}
		}
	}, [filterType]);

	const handleCloseModal = () => {
		removeItemCreateNotice();

		setAddNewModalOpen(false);
		setStep(1);
		setTotalSteps(3);
		setLoading(true);
		setNewItemId('');

		dispatch({ type: 'SET_TITLE', payload: '' });
		dispatch({ type: 'SET_FILTER_TYPE', payload: '' });
		dispatch({ type: 'SET_ACTIVE_FILTER_DATA', payload: {} });
		dispatch({ type: 'SET_FILTER_KEYS', payload: {} });
		dispatch({ type: 'SET_ADDITIONAL_DATA', payload: {} });
		dispatch({ type: 'SET_FILTERS_DATA', payload: {} });
	};

	const handleFilterSubmit = () => {
		removeItemCreateNotice();

		setLoading(true);

		const formData = new FormData();

		formData.append('action', 'wcapf_save_filter');
		formData.append('filter_title', title);
		formData.append('filter_data', JSON.stringify(activeFilterData));
		formData.append('visibility_rules', JSON.stringify({}));

		axios
			.post(wcapf_admin_params.ajaxurl, formData)
			.then((res) => {
				setLoading(false);

				const {
					data: { data, success },
				} = res;

				if (success) {
					const { short: newFilterData } = data;

					setNewItemId(newFilterData.id);

					const _filters = [newFilterData, ...filters];

					dispatch({ type: 'SET_FILTERS', payload: _filters });
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
					<h4>
						{__('Filter was created', 'wc-ajax-product-filter')}
					</h4>
					<p className='description'>
						{__(
							'Now you can edit all the settings of this filter.',
							'wc-ajax-product-filter'
						)}
					</p>
					<div className='_buttons'>
						<Button variant='secondary' onClick={handleCloseModal}>
							{__('Maybe Later', 'wc-ajax-product-filter')}
						</Button>
						<Button
							variant='primary'
							href={getEditFilterLink(newItemId)}
						>
							{__('Edit Filter', 'wc-ajax-product-filter')}
						</Button>
					</div>
				</div>
			);
		} else {
			return (
				<>
					<Body step={step} setTotalSteps={setTotalSteps} />

					<Footer
						step={step}
						setStep={setStep}
						totalSteps={totalSteps}
						closeModal={handleCloseModal}
						handleFilterSubmit={handleFilterSubmit}
					/>
				</>
			);
		}
	};

	return (
		isOpen && (
			<Modal
				className='__add_filter_modal'
				onRequestClose={handleCloseModal}
				ref={modalRef}
				__experimentalHideHeader
			>
				<div className='__add_post_modal'>
					<h3 className='__heading'>
						{__('Add Filter', 'wc-ajax-product-filter')}
					</h3>

					{modalContent()}
				</div>
			</Modal>
		)
	);
};

export default AddNewModal;
