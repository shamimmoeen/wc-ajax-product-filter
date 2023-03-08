import { __ } from '@wordpress/i18n';
import { Button, CheckboxControl, Icon } from '@wordpress/components';
import { useLayoutEffect, useRef, useState } from '@wordpress/element';
import { closeSmall, plus } from '@wordpress/icons';
import Select from '../Field/Select';
import SelectMulti from '../Field/SelectMulti';
import Text from '../Field/Text';
import { orderDirectionOptions } from './utils';
import { copiedToClipboardNotice } from '../notices';
import { ClipboardIcon } from '../SVGIcons';

const stickyPostOptions = [
	{
		label: __('Default', 'wc-ajax-product-filter'),
		value: 'default',
	},
	{
		label: __('Ignore', 'wc-ajax-product-filter'),
		value: 'ignore',
	},
	{
		label: __('Exclude', 'wc-ajax-product-filter'),
		value: 'exclude',
	},
];

const postStatuses = wcapf_admin_params.post_statuses;
const sortByOptions = wcapf_admin_params.sort_by_options;
const metaKeys = wcapf_admin_params.meta_keys;
const metaTypes = wcapf_admin_params.meta_types;
const sortDirections = orderDirectionOptions();
const orderByOptions = [
	{ label: __('Default', 'wc-ajax-product-filter'), value: 'default' },
	...sortByOptions,
];
const filterTypes = wcapf_admin_params.filter_types;
const taxonomyType = filterTypes.find((option) => 'taxonomy' === option.value);
const taxonomies = taxonomyType ? taxonomyType.options : [];

const taxQueryOperators = [
	{
		label: __('Include', 'wc-ajax-product-filter'),
		value: 'include',
	},
	{
		label: __('Exclude', 'wc-ajax-product-filter'),
		value: 'exclude',
	},
];

const metaQueryOperators = [
	{
		label: __('= (equals)', 'wc-ajax-product-filter'),
		value: '=',
	},
	{
		label: __('!= (not equals)', 'wc-ajax-product-filter'),
		value: '!=',
	},
	{
		label: __('< (less than)', 'wc-ajax-product-filter'),
		value: '<',
	},
	{
		label: __('> (greater than)', 'wc-ajax-product-filter'),
		value: '>',
	},
	{
		label: __('<= (less than or equal)', 'wc-ajax-product-filter'),
		value: '<=',
	},
	{
		label: __('>= (greater than or equal)', 'wc-ajax-product-filter'),
		value: '>=',
	},
	{
		label: __('like', 'wc-ajax-product-filter'),
		value: 'LIKE',
	},
	{
		label: __('not like', 'wc-ajax-product-filter'),
		value: 'NOT LIKE',
	},
	{
		label: __('exists', 'wc-ajax-product-filter'),
		value: 'EXISTS',
	},
	{
		label: __('not exists', 'wc-ajax-product-filter'),
		value: 'NOT EXISTS',
	},
];

const defaultTaxQuery = {
	taxonomy: '',
	operator: 'include',
	terms: [],
};

const defaultMetaQuery = {
	meta_key: '',
	meta_type: 'alphabetic',
	operator: '=',
	meta_value: '',
};

const TaxQuery = ({
	index,
	query,
	queryIndex,
	handleQuerySelectChange,
	handleTaxonomyTermsChange,
	handleResetTaxonomyTerms,
	handleRemoveQuery,
}) => {
	const { taxonomy, operator, terms } = query;

	const firstRender = useRef(true);

	useLayoutEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;

			return;
		}

		handleResetTaxonomyTerms(queryIndex);
	}, [taxonomy]);

	const taxQueryTaxonomy = taxonomies.find(
		(option) => taxonomy === option.value
	);

	const taxQueryOperator = taxQueryOperators.find(
		(option) => operator === option.value
	);

	const postFix = `-l-${index}-q-${queryIndex}`;

	return (
		<div className='__tax_query_row'>
			<div className='__top_input'>
				<div className='__taxonomy_select'>
					<Select
						id={`tax-query-taxonomy-${postFix}`}
						inputKey={`tax-query-taxonomy-${postFix}`}
						placeholder={__(
							'Select taxonomy',
							'wc-ajax-product-filter'
						)}
						options={taxonomies}
						value={taxQueryTaxonomy}
						onChange={(selected) =>
							handleQuerySelectChange(
								selected,
								queryIndex,
								'taxonomy',
								'tax_query'
							)
						}
					/>
				</div>

				<div className='__operator_select'>
					<Select
						id={`tax-query-operator-${postFix}`}
						inputKey={`tax-query-operator-${postFix}`}
						options={taxQueryOperators}
						value={taxQueryOperator}
						onChange={(selected) =>
							handleQuerySelectChange(
								selected,
								queryIndex,
								'operator',
								'tax_query'
							)
						}
					/>
				</div>

				<Button
					isSmall
					isDestructive
					variant='tertiary'
					icon={closeSmall}
					className={'__remove_query_btn'}
					onClick={() => handleRemoveQuery(queryIndex, 'tax_query')}
				/>
			</div>

			{taxonomy && (
				<div className='__taxonomy_terms_select'>
					<SelectMulti
						id={`tax-query-terms-${postFix}`}
						inputKey={`${taxonomy}-tax-query-terms-${postFix}`}
						type={'taxonomy'}
						taxonomy={taxonomy}
						value={terms}
						isMultiple
						onChange={(selected) =>
							handleTaxonomyTermsChange(selected, queryIndex)
						}
						renderAsFormField={false}
					/>
				</div>
			)}
		</div>
	);
};

const MetaQuery = ({
	index,
	query,
	queryIndex,
	handleQuerySelectChange,
	handleMetaQueryTextChange,
	handleRemoveQuery,
}) => {
	const { meta_key, meta_type, operator, meta_value } = query;

	const metaKey = metaKeys.find((option) => meta_key === option.value);

	const metaType = metaTypes.find((option) => meta_type === option.value);

	const metaQueryOperator = metaQueryOperators.find(
		(option) => operator === option.value
	);

	const postFix = `-l-${index}-q-${queryIndex}`;

	return (
		<div className='__meta_query_row'>
			<div className='__top_input'>
				<div className='__meta_key_select'>
					<Select
						id={`meta-query-key-${postFix}`}
						inputKey={`meta-query-key-${postFix}`}
						placeholder={__(
							'Select meta key',
							'wc-ajax-product-filter'
						)}
						options={metaKeys}
						value={metaKey}
						onChange={(selected) =>
							handleQuerySelectChange(
								selected,
								queryIndex,
								'meta_key',
								'meta_query'
							)
						}
					/>
				</div>

				<div className='__meta_type_select'>
					<Select
						id={`meta-query-type-${postFix}`}
						inputKey={`meta-query-type-${postFix}`}
						options={metaTypes}
						value={metaType}
						onChange={(selected) =>
							handleQuerySelectChange(
								selected,
								queryIndex,
								'meta_type',
								'meta_query'
							)
						}
					/>
				</div>

				<Button
					isSmall
					isDestructive
					variant='tertiary'
					icon={closeSmall}
					className={'__remove_query_btn'}
					onClick={() => handleRemoveQuery(queryIndex, 'meta_query')}
				/>
			</div>

			<div className='__bottom_input'>
				<div className='__operator_select'>
					<Select
						id={`meta-query-operator-${postFix}`}
						inputKey={`meta-query-operator-${postFix}`}
						options={metaQueryOperators}
						value={metaQueryOperator}
						onChange={(selected) =>
							handleQuerySelectChange(
								selected,
								queryIndex,
								'operator',
								'meta_query'
							)
						}
					/>
				</div>

				{!['EXISTS', 'NOT EXISTS'].includes(operator) && (
					<div className='__meta_value'>
						<Text
							id={`meta-query-value-${postFix}`}
							placeholder={__('Meta value')}
							value={meta_value}
							onChange={(value) =>
								handleMetaQueryTextChange(
									value,
									'meta_value',
									queryIndex
								)
							}
							renderAsFormField={false}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

const ProductQuery = ({ index, query, handleQueryChange }) => {
	const [expanded, setExpanded] = useState(false);

	const {
		post_status,
		sticky_posts,
		default_order,
		order_direction,
		order_meta_value,
		order_meta_type,
		columns,
		posts_per_page,
		offset,
		enable_pagination,
		tax_query,
		meta_query,
		exclude,
		no_post_message,
	} = query;

	const clipboardApiFound = window.isSecureContext && navigator.clipboard;

	const handleCopyToClipboard = (text) => {
		if (!clipboardApiFound) {
			return;
		}

		navigator.clipboard.writeText(text);

		copiedToClipboardNotice();
	};

	const handlePostStatusChange = (value) => {
		let newPostStatus = [...post_status];

		if (post_status.includes(value)) {
			newPostStatus = post_status.filter((status) => value !== status);
		} else {
			newPostStatus.push(value);
		}

		handleQueryChange('post_status', newPostStatus);
	};

	const handleEnablePagination = () => {
		const enablePagination = !enable_pagination;

		handleQueryChange('enable_pagination', enablePagination);
	};

	const handleSelectChange = (selected, key) => {
		handleQueryChange(key, selected.value);
	};

	const handleQueryTextChange = (value, key) => {
		handleQueryChange(key, value);
	};

	const handleExcludePosts = (selected) => {
		handleQueryChange('exclude', selected);
	};

	const handleAddTaxQuery = () => {
		const taxQueries = [...tax_query, defaultTaxQuery];

		handleQueryChange('tax_query', taxQueries);
	};

	const handleQuerySelectChange = (selected, queryIndex, key, queryType) => {
		let queries;

		if ('tax_query' === queryType) {
			queries = tax_query.map((query, index) => {
				if (queryIndex === index) {
					return { ...query, [key]: selected.value };
				}

				return query;
			});
		} else {
			queries = meta_query.map((query, index) => {
				if (queryIndex === index) {
					return { ...query, [key]: selected.value };
				}

				return query;
			});
		}

		handleQueryChange(queryType, queries);
	};

	const handleTaxonomyTermsChange = (selected, queryIndex) => {
		const queries = tax_query.map((query, index) => {
			if (queryIndex === index) {
				return { ...query, terms: selected };
			}

			return query;
		});

		handleQueryChange('tax_query', queries);
	};

	const handleResetTaxonomyTerms = (queryIndex) => {
		const queries = tax_query.map((query, index) => {
			if (queryIndex === index) {
				return { ...query, terms: [] };
			}

			return query;
		});

		handleQueryChange('tax_query', queries);
	};

	const handleMetaQueryTextChange = (value, key, queryIndex) => {
		const queries = meta_query.map((query, index) => {
			if (queryIndex === index) {
				return { ...query, [key]: value };
			}

			return query;
		});

		handleQueryChange('meta_query', queries);
	};

	const handleRemoveQuery = (queryIndex, queryType) => {
		let queries;

		if ('tax_query' === queryType) {
			queries = tax_query.filter((_query, index) => queryIndex !== index);
		} else {
			queries = meta_query.filter(
				(_query, index) => queryIndex !== index
			);
		}

		handleQueryChange(queryType, queries);
	};

	const handleAddMetaQuery = () => {
		const metaQueries = [...meta_query, defaultMetaQuery];

		handleQueryChange('meta_query', metaQueries);
	};

	const stickyPosts = stickyPostOptions.find(
		(option) => sticky_posts === option.value
	);

	const defaultOrder = orderByOptions.find(
		(option) => default_order === option.value
	);

	const orderDirection = sortDirections.find(
		(option) => order_direction === option.value
	);

	const orderMetaValue = metaKeys.find(
		(option) => order_meta_value === option.value
	);

	const orderMetaType = metaTypes.find(
		(option) => order_meta_type === option.value
	);

	let classes = '__code';

	if (clipboardApiFound) {
		classes += ' __clipboard-api-found';
	}

	const code = '[wcapf_product_query]';

	const expandBtnLabel = expanded
		? __('Collapse', 'wc-ajax-product-filter')
		: __('Expand', 'wc-ajax-product-filter');

	const handleExpandQuery = () => {
		if (expanded) {
			setExpanded(false);
		} else {
			setExpanded(true);
		}
	};

	return (
		<div className='__column'>
			<fieldset className='__product_query'>
				<legend>{__('Product Query', 'wc-ajax-product-filter')}</legend>

				<div className='__field_row __shortcode'>
					<div className='__field_label'>
						<label htmlFor={`shortcode-${index}`}>
							{__('Shortcode', 'wc-ajax-product-filter')}
						</label>
					</div>
					<div className='__field_input'>
						<div
							className={classes}
							tabIndex={0}
							onClick={() => handleCopyToClipboard(code)}
						>
							<div className='__text'>{code}</div>

							{clipboardApiFound && (
								<Icon icon={ClipboardIcon} size={24} />
							)}
						</div>

						<p className='description'>
							{__(
								'Place the shortcode on the selected page to show the product loop.',
								'wc-ajax-product-filter'
							)}
						</p>

						<Button variant={'link'} onClick={handleExpandQuery}>
							{expandBtnLabel}
						</Button>
					</div>
				</div>

				{expanded && (
					<>
						<div className='__field_row __post_status'>
							<div className='__field_label'>
								<label>
									{__(
										'Post Status',
										'wc-ajax-product-filter'
									)}
								</label>
							</div>
							<div className='__field_input'>
								{postStatuses.map(({ label, value }) => (
									<CheckboxControl
										key={value}
										label={label}
										checked={post_status.includes(value)}
										onChange={() =>
											handlePostStatusChange(value)
										}
									/>
								))}
							</div>
						</div>

						<div className='__field_row __sticky_posts'>
							<div className='__field_label'>
								<label htmlFor={`stickyPosts-${index}`}>
									{__(
										'Sticky Posts',
										'wc-ajax-product-filter'
									)}
								</label>
							</div>
							<div className='__field_input'>
								<Select
									id={`stickyPosts-${index}`}
									inputKey={`stickyPosts-${index}`}
									options={stickyPostOptions}
									value={stickyPosts}
									onChange={(selected) =>
										handleSelectChange(
											selected,
											'sticky_posts'
										)
									}
								/>
							</div>
						</div>

						<div className='__field_row __default_order'>
							<div className='__field_label'>
								<label htmlFor={`default_order-${index}`}>
									{__(
										'Default Order',
										'wc-ajax-product-filter'
									)}
								</label>
							</div>
							<div className='__field_input'>
								<div className='__top_input'>
									<div className='__default_order_select'>
										<Select
											id={`default_order-${index}`}
											inputKey={`default_order-${index}`}
											options={orderByOptions}
											value={defaultOrder}
											onChange={(selected) =>
												handleSelectChange(
													selected,
													'default_order'
												)
											}
										/>
									</div>
									{'rand' !== default_order && (
										<div className='__order_direction_select'>
											<Select
												id={`order_direction-${index}`}
												inputKey={`order_direction-${index}`}
												options={sortDirections}
												value={orderDirection}
												onChange={(selected) =>
													handleSelectChange(
														selected,
														'order_direction'
													)
												}
											/>
										</div>
									)}
								</div>

								{'meta_value' === default_order && (
									<div className='__meta_value_input'>
										<div className='__meta_value_select'>
											<Select
												id={`meta_value-${index}`}
												inputKey={`meta_value-${index}`}
												placeholder={__(
													'Select meta key',
													'wc-ajax-product-filter'
												)}
												options={metaKeys}
												value={orderMetaValue}
												onChange={(selected) =>
													handleSelectChange(
														selected,
														'order_meta_value'
													)
												}
											/>
										</div>

										{order_meta_value && (
											<div className='__meta_type_select'>
												<Select
													id={`meta_type-${index}`}
													inputKey={`meta_type-${index}`}
													options={metaTypes}
													value={orderMetaType}
													onChange={(selected) =>
														handleSelectChange(
															selected,
															'order_meta_type'
														)
													}
												/>
											</div>
										)}
									</div>
								)}
							</div>
						</div>

						<div className='__field_row __columns'>
							<div className='__field_label'>
								<label htmlFor={`columns-${index}`}>
									{__('Columns', 'wc-ajax-product-filter')}
								</label>
							</div>
							<div className='__field_input'>
								<Text
									id={`columns-${index}`}
									type={'number'}
									renderAsFormField={false}
									value={columns}
									onChange={(value) =>
										handleQueryTextChange(value, 'columns')
									}
									min={1}
									max={6}
								/>
							</div>
						</div>

						<div className='__field_row __posts_per_page'>
							<div className='__field_label'>
								<label htmlFor={`posts_per_page-${index}`}>
									{__(
										'Posts Per Page',
										'wc-ajax-product-filter'
									)}
								</label>
							</div>
							<div className='__field_input'>
								<Text
									id={`posts_per_page-${index}`}
									type={'number'}
									renderAsFormField={false}
									value={posts_per_page}
									onChange={(value) =>
										handleQueryTextChange(
											value,
											'posts_per_page'
										)
									}
									min={1}
								/>
							</div>
						</div>

						<div className='__field_row __offset'>
							<div className='__field_label'>
								<label htmlFor={`offset-${index}`}>
									{__('Offset', 'wc-ajax-product-filter')}
								</label>
							</div>
							<div className='__field_input'>
								<Text
									id={`offset-${index}`}
									type={'number'}
									renderAsFormField={false}
									value={offset}
									onChange={(value) =>
										handleQueryTextChange(value, 'offset')
									}
									min={0}
								/>
							</div>
						</div>

						<div className='__field_row __enable_pagination'>
							<div className='__field_label'>
								<label htmlFor={`enable_pagination-${index}`}>
									{__(
										'Enable Pagination',
										'wc-ajax-product-filter'
									)}
								</label>
							</div>
							<div className='__field_input'>
								<CheckboxControl
									id={`enable_pagination-${index}`}
									checked={enable_pagination}
									onChange={handleEnablePagination}
								/>
							</div>
						</div>

						<div className='__field_row __tax_query'>
							<div className='__field_label'>
								<label>
									{__('Tax Query', 'wc-ajax-product-filter')}
								</label>
							</div>
							<div className='__field_input'>
								<div className='__tax_query_rows'>
									{tax_query.map(
										(taxQuery, taxQueryIndex) => (
											<TaxQuery
												key={taxQueryIndex}
												index={index}
												query={taxQuery}
												queryIndex={taxQueryIndex}
												handleQuerySelectChange={
													handleQuerySelectChange
												}
												handleTaxonomyTermsChange={
													handleTaxonomyTermsChange
												}
												handleResetTaxonomyTerms={
													handleResetTaxonomyTerms
												}
												handleRemoveQuery={
													handleRemoveQuery
												}
											/>
										)
									)}
								</div>

								<Button
									icon={plus}
									variant='secondary'
									isSmall
									onClick={handleAddTaxQuery}
								/>
							</div>
						</div>

						<div className='__field_row __meta_query'>
							<div className='__field_label'>
								<label>
									{__('Meta Query', 'wc-ajax-product-filter')}
								</label>
							</div>
							<div className='__field_input'>
								<div className='__meta_query_rows'>
									{meta_query.map(
										(metaQuery, metaQueryIndex) => (
											<MetaQuery
												key={metaQueryIndex}
												index={index}
												query={metaQuery}
												queryIndex={metaQueryIndex}
												handleQuerySelectChange={
													handleQuerySelectChange
												}
												handleMetaQueryTextChange={
													handleMetaQueryTextChange
												}
												handleRemoveQuery={
													handleRemoveQuery
												}
											/>
										)
									)}
								</div>

								<Button
									icon={plus}
									variant='secondary'
									isSmall
									onClick={handleAddMetaQuery}
								/>
							</div>
						</div>

						<div className='__field_row __exclude'>
							<div className='__field_label'>
								<label htmlFor={`exclude-${index}`}>
									{__('Exclude', 'wc-ajax-product-filter')}
								</label>
							</div>
							<div className='__field_input'>
								<SelectMulti
									id={`exclude-${index}`}
									inputKey={`exclude-${index}`}
									type={'product'}
									inputPlaceholder={__(
										'Start typing to find the post'
									)}
									inputNoOptionsMessage={__(
										'No posts found',
										'wc-ajax-product-filter'
									)}
									value={exclude}
									isMultiple
									onChange={handleExcludePosts}
									renderAsFormField={false}
								/>
							</div>
						</div>

						<div className='__field_row __no_post_message'>
							<div className='__field_label'>
								<label htmlFor={`no-post-message-${index}`}>
									{__(
										'No Post Message',
										'wc-ajax-product-filter'
									)}
								</label>
							</div>
							<div className='__field_input'>
								<div>
									<Text
										id={`no-post-message-${index}`}
										renderAsFormField={false}
										placeholder={__(
											'Leave empty to use default',
											'wc-ajax-product-filter'
										)}
										value={no_post_message}
										onChange={(value) =>
											handleQueryTextChange(
												value,
												'no_post_message'
											)
										}
									/>
								</div>
							</div>
						</div>
					</>
				)}
			</fieldset>
		</div>
	);
};

export default ProductQuery;
