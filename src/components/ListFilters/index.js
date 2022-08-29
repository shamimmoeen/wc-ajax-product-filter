import { __ } from '@wordpress/i18n';
import { Button, Icon } from '@wordpress/components';
import PostTable from '../PostTable';
import { useEffect, useState } from '@wordpress/element';
import { useListFilters } from './ListFiltersContext';
import axios from 'axios';
import { getAdditionalData, prepareFilterData } from '../utils';
import DeleteModal from './DeleteModal';
import AddNewModal from './AddNewModal';
import { getAvailableFilters } from '../Filter/utils';

const ListFilters = () => {
	const {
		state: { filters },
		dispatch,
	} = useListFilters();

	const [deletePostModalOpen, setDeletePostModalOpen] = useState(false);
	const [addPostModalOpen, setAddPostModalOpen] = useState(false);
	const [addPostModalStep, setAddPostModalStep] = useState(1);
	const [addPostModalTotalSteps, setAddPostModalTotalSteps] = useState(2);
	const [addPostModalLoading, setAddPostModalLoading] = useState(true);
	const [addPostModalContent, setAddPostModalContent] = useState('');

	const openDeletePostModal = () => setDeletePostModalOpen(true);
	const closeDeletePostModal = () => setDeletePostModalOpen(false);

	const openAddPostModal = () => setAddPostModalOpen(true);
	const closeAddPostModal = () => setAddPostModalOpen(false);

	const getFilters = () => {
		const data = {
			action: 'get_filters',
		};

		return axios.get(wcapf_admin_params.ajaxurl, {
			params: data,
		});
	};

	useEffect(() => {
		Promise.all([getFilters(), getAdditionalData()])
			.then((results) => {
				const resFiltes = results[0];
				const resAdditionalData = results[1];

				const {
					data: { data: _filters },
				} = resFiltes;

				const {
					data: { data: additionalData },
				} = resAdditionalData;

				const newFilters = [];

				_filters.forEach((filter) => {
					newFilters.push(prepareFilterData(filter));
				});

				dispatch({ type: 'SET_FILTERS', payload: newFilters });

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

				dispatch({ type: 'SET_LOADING', payload: false });
			})
			.catch((err) => console.log(err));
	}, []);

	// Reset the add filter modal when closing the modal.
	useEffect(() => {
		if (addPostModalOpen) {
			return;
		}

		setAddPostModalStep(1);
		setAddPostModalTotalSteps(2);
		setAddPostModalLoading(true);
		setAddPostModalContent('');

		dispatch({ type: 'SET_TITLE', payload: '' });
		dispatch({ type: 'SET_FILTER_TYPE', payload: '' });
		dispatch({ type: 'SET_ACTIVE_FILTER_DATA', payload: {} });
		dispatch({ type: 'SET_FILTER_KEYS', payload: {} });
	}, [addPostModalOpen]);

	const handleAddFilter = () => {
		openAddPostModal();
	};

	const handleDeleteFilter = (filter) => {
		openDeletePostModal();
		console.log(filter);
	};

	const getTableData = () => {
		let html;

		if (filters.length) {
			html = filters.map((filter) => (
				<tr key={filter.id}>
					<td>
						<a href={filter.permalink} className='row-title'>
							{filter.title}
						</a>
						<div className='__post_id'>
							{__('ID', 'wc-ajax-product-filter')}:{` `}
							{filter.id}
						</div>
					</td>
					<td>{filter.filter_key}</td>
					<td>
						{filter.component}
						{filter.componentExtra && (
							<span className='__component_extra'>
								{` `}
								{filter.componentExtra}
							</span>
						)}
					</td>
					<td>{`[wcapf_filter id="${filter.id}"]`}</td>
					<td>
						<div className='__action_buttons'>
							<Button variant='secondary' href={filter.permalink}>
								{__('Edit', 'wc-ajax-product-filter')}
							</Button>
							<Button
								variant='secondary'
								isDestructive
								onClick={() => handleDeleteFilter(filter)}
							>
								{__('Delete', 'wc-ajax-product-filter')}
							</Button>
						</div>
					</td>
				</tr>
			));
		} else {
			html = (
				<tr className='__no_results'>
					<td colSpan={5}>
						<p className='description'>
							{__(
								'No matching results found.',
								'wc-ajax-product-filter'
							)}
						</p>
					</td>
				</tr>
			);
		}

		return html;
	};

	const content = (
		<div className='__filter_response'>
			<Icon
				icon={
					<svg viewBox='0 0 24 24'>
						<polyline points='20 6 9 17 4 12'></polyline>
					</svg>
				}
			/>
			<h4>{__('Filter was created', 'wc-ajax-product-filter')}</h4>
			<p className='description'>
				{__(
					'Now you can edit all the settings of this filter.',
					'wc-ajax-product-filter'
				)}
			</p>
			<div className='_buttons'>
				<Button variant='secondary' onClick={closeAddPostModal}>
					{__('Maybe Later', 'wc-ajax-product-filter')}
				</Button>
				<Button variant='primary'>
					{__('Edit Filter', 'wc-ajax-product-filter')}
				</Button>
			</div>
		</div>
	);

	const handleFilterSubmit = () => {
		console.log('submit filter');
		setAddPostModalLoading(true);

		setTimeout(() => {
			setAddPostModalContent(content);
			setAddPostModalLoading(false);
			setAddPostModalStep(addPostModalStep + 1);
		}, 500);
	};

	return (
		<>
			<PostTable
				title={__('List of Filters', 'wc-ajax-product-filter')}
				addBtnTitle={__('Add Filter', 'wc-ajax-product-filter')}
				handleAddFilter={handleAddFilter}
				headers={[
					__('Title', 'wc-ajax-product-filter'),
					__('Filter Key', 'wc-ajax-product-filter'),
					__('Component', 'wc-ajax-product-filter'),
					__('Shortcode', 'wc-ajax-product-filter'),
					__('Actions', 'wc-ajax-product-filter'),
				]}
				tbody={getTableData}
			/>

			<AddNewModal
				isOpen={addPostModalOpen}
				closeModal={closeAddPostModal}
				step={addPostModalStep}
				setStep={setAddPostModalStep}
				totalSteps={addPostModalTotalSteps}
				setTotalSteps={setAddPostModalTotalSteps}
				loading={addPostModalLoading}
				setLoading={setAddPostModalLoading}
				handleFilterSubmit={handleFilterSubmit}
				addPostModalContent={addPostModalContent}
			/>

			<DeleteModal
				isOpen={deletePostModalOpen}
				closeModal={closeDeletePostModal}
			/>
		</>
	);
};

export default ListFilters;
