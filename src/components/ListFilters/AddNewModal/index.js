import { Modal, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';
import Footer from './Footer';
import Body from './Body';
import { useListFilters } from '../ListFiltersContext';

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
	const {
		state: { isLoading },
	} = useListFilters();

	const modalRef = useRef(null);

	// Restore the focus of the modal.
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
		if (!isLoading) {
			setLoading(false);
		}
	}, [isLoading]);

	// False loader.
	useEffect(() => {
		if (isOpen) {
			setTimeout(() => setLoading(false), 300);
		}
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

					{isLoading || loading ? (
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
