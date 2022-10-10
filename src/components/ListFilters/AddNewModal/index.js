import { Modal, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import Footer from './Footer';
import Body from './Body';
import { useListFilters } from '../ListFiltersContext';
import { getAdditionalData } from '../../utils';

const AddNewModal = ({
	isOpen,
	closeModal,
	step,
	setStep,
	totalSteps,
	setTotalSteps,
	loading,
	setLoading,
	handleFilterSubmit,
	addPostModalContent,
}) => {
	const { dispatch } = useListFilters();

	const modalRef = useRef(null);

	// Reset the modal.
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

	return (
		isOpen && (
			<Modal
				className='__add_filter_modal'
				onRequestClose={closeModal}
				ref={modalRef}
				__experimentalHideHeader
			>
				<div className='__add_post_modal'>
					<h3 className='__heading'>
						{__('Add Filter', 'wc-ajax-product-filter')}
					</h3>

					{loading ? (
						<div className='__loader'>
							<Spinner />
						</div>
					) : (
						<>
							{addPostModalContent ? (
								addPostModalContent
							) : (
								<>
									<Body
										step={step}
										setTotalSteps={setTotalSteps}
									/>

									<Footer
										step={step}
										setStep={setStep}
										totalSteps={totalSteps}
										closeModal={closeModal}
										handleFilterSubmit={handleFilterSubmit}
									/>
								</>
							)}
						</>
					)}
				</div>
			</Modal>
		)
	);
};

export default AddNewModal;
