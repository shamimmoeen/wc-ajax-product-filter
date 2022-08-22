import { __ } from '@wordpress/i18n';
import {
	Button,
	Flex,
	FlexItem,
	Icon,
	Modal,
	NavigableMenu,
	Spinner,
} from '@wordpress/components';
import PostTable from '../PostTable';
import { useEffect, useState } from '@wordpress/element';
import { useListFilters } from './ListFiltersContext';
import axios from 'axios';
import { prepareFilterData, proTag } from '../utils';
import { trash } from '@wordpress/icons';
import { getAvailableFilters } from '../Filter/utils';
import Text from '../Field/Text';

const ListFilters = () => {
	const {
		state: { filters },
		dispatch,
	} = useListFilters();

	const [deletePostModalOpen, setDeletePostModalOpen] = useState(false);
	const [addPostModalOpen, setAddPostModalOpen] = useState(true);

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
		getFilters()
			.then((res) => {
				const {
					data: { data: _filters },
				} = res;

				const newFilters = [];

				_filters.forEach((filter) => {
					newFilters.push(prepareFilterData(filter));
				});

				dispatch({ type: 'SET_FILTERS', payload: newFilters });

				dispatch({ type: 'SET_LOADING', payload: false });
			})
			.catch((err) => console.log(err));
	}, []);

	const handleAddFilter = () => {
		openAddPostModal();
		console.log('add filter modal');
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

			{addPostModalOpen && (
				<Modal
					className='__add_filter_modal'
					onRequestClose={closeAddPostModal}
					__experimentalHideHeader
				>
					<div className='__add_post_modal'>
						<h3 className='__heading'>
							{__('Add Filter', 'wc-ajax-product-filter')}
						</h3>

						<p className='description'>
							{__('Enter filter title', 'wc-ajax-product-filter')}
						</p>

						<div className='__available_filters'>
							<div className='__inner'>
								<p className='description'>
									{__(
										'Select a component to start building the filter.',
										'wc-ajax-product-filter'
									)}
								</p>

								<div className='__filters'>
									<NavigableMenu
										role={'menu'}
										orientation='horizontal'
									>
										{getAvailableFilters().map((filter) => {
											let _classes = '__item';

											return (
												<Button
													className={_classes}
													key={filter.type}
												>
													{filter.title}
													{proTag(filter.isPro)}
												</Button>
											);
										})}
									</NavigableMenu>
								</div>

								<Text
									id={'filter_title'}
									label={__(
										'Filter Title',
										'wc-ajax-product-filter'
									)}
								/>

								<Text
									id={'filter_title'}
									label={__(
										'Filter Title',
										'wc-ajax-product-filter'
									)}
								/>

								<Flex>
									<FlexItem>
										<Button variant='secondary'>
											{__(
												'Cancel',
												'wc-ajax-product-filter'
											)}
										</Button>
									</FlexItem>
									<FlexItem>
										<Button variant='primary'>
											{__(
												'Next',
												'wc-ajax-product-filter'
											)}
										</Button>
									</FlexItem>
								</Flex>
							</div>
						</div>
					</div>
				</Modal>
			)}

			{deletePostModalOpen && (
				<Modal
					onRequestClose={closeDeletePostModal}
					__experimentalHideHeader
				>
					<div className='__delete_modal'>
						<Icon icon={trash} size={40} />

						<h3>{__('Are you sure?', 'wc-ajax-product-filter')}</h3>

						<p className='description'>
							{__(
								'This will delete the filter permanently.',
								'wc-ajax-product-filter'
							)}
						</p>

						<div className='__buttons'>
							<Button
								variant='secondary'
								onClick={closeDeletePostModal}
								autoFocus
							>
								{__('Cancel', 'wc-ajax-product-filter')}
							</Button>
							<Button variant='primary'>
								{__('Delete', 'wc-ajax-product-filter')}
							</Button>
						</div>
					</div>
				</Modal>
			)}
		</>
	);
};

export default ListFilters;
