import { Modal, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import Footer from './Footer';
import Body from './Body';
import { useListFilters } from '../ListFiltersContext';
import { getAvailableFilters } from '../../Filter/utils';
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

				let activeFilterData = {};
				let filterType = '';
				let filterKey = '';

				/**
				 * Sets the default filter keys.
				 */
				const filterKeys = {};

				getAvailableFilters().map((item) => {
					const type = item.type;

					if ('active-filters' === type || 'reset-button' === type) {
						return false;
					}

					if (
						'attribute' === type ||
						'custom-taxonomy' === type ||
						'post-meta' === type ||
						'post-property' === type
					) {
						let data = {};

						if ('attribute' === type) {
							data = additionalData['attributes'];
						} else if ('custom-taxonomy' === type) {
							data = additionalData['custom_taxonomies'];
						} else if ('post-meta' === type) {
							data = additionalData['meta_keys'];
						} else if ('post-property' === type) {
							data = additionalData['post_properties'];
						}

						const _filterKeys = {};

						for (const item in data) {
							let _filterKey = `_${item}`;

							if (filterType === type) {
								let selected = '';

								if (
									'attribute' === type ||
									'custom-taxonomy' === type
								) {
									selected = activeFilterData['taxonomy'];
								} else if ('post-meta') {
									selected = activeFilterData['meta_key'];
								} else if ('post-property' === type) {
									selected =
										activeFilterData['post_property'];
								}

								if (item === selected) {
									_filterKey = filterKey;
								}
							}

							_filterKeys[item] = _filterKey;
						}

						filterKeys[type] = _filterKeys;
					} else {
						let defaultFilterKey = item.defaultFilterKey;

						if (filterType === type) {
							defaultFilterKey = filterKey;
						}

						filterKeys[type] = defaultFilterKey;
					}
				});

				dispatch({ type: 'SET_FILTER_KEYS', payload: filterKeys });

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
