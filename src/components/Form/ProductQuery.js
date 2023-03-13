import { __ } from '@wordpress/i18n';
import { Button, Icon } from '@wordpress/components';
import { useLayoutEffect, useRef, useState } from '@wordpress/element';
import { closeSmall, plus } from '@wordpress/icons';
import Select from '../Field/Select';
import SelectMulti from '../Field/SelectMulti';
import Text from '../Field/Text';
import { orderDirectionOptions } from './utils';
import { copiedToClipboardNotice } from '../notices';
import { ClipboardIcon } from '../SVGIcons';
import TippyTooltip from '../TippyTooltip';

const layoutOptions = [
	{
		label: __('Standard shop loop', 'wc-ajax-product-filter'),
		value: 'standard',
	},
	{
		label: __('Products + Pagination', 'wc-ajax-product-filter'),
		value: 'products_with_pagination',
	},
	{
		label: __('Products only', 'wc-ajax-product-filter'),
		value: 'products_only',
	},
];

const productTypeOptions = [
	{
		label: __('Default', 'wc-ajax-product-filter'),
		value: 'products',
	},
	{
		label: __('On Sale', 'wc-ajax-product-filter'),
		value: 'on_sale',
	},
	{
		label: __('Best Selling', 'wc-ajax-product-filter'),
		value: 'best_selling',
	},
	{
		label: __('Top Rated', 'wc-ajax-product-filter'),
		value: 'top_rated',
	},
];

const visibilityOptions = [
	{
		label: __('Visible', 'wc-ajax-product-filter'),
		value: 'visible',
	},
	{
		label: __('Catalog', 'wc-ajax-product-filter'),
		value: 'catalog',
	},
	{
		label: __('Search', 'wc-ajax-product-filter'),
		value: 'search',
	},
	{
		label: __('Hidden', 'wc-ajax-product-filter'),
		value: 'hidden',
	},
	{
		label: __('Featured', 'wc-ajax-product-filter'),
		value: 'featured',
	},
];

const orderByOptions = [
	{
		label: __('Default', 'wc-ajax-product-filter'),
		value: 'default',
	},
	{
		label: __('Date', 'wc-ajax-product-filter'),
		value: 'date',
	},
	{
		label: __('ID', 'wc-ajax-product-filter'),
		value: 'id',
	},
	{
		label: __('Menu Order', 'wc-ajax-product-filter'),
		value: 'menu_order',
	},
	{
		label: __('Popularity', 'wc-ajax-product-filter'),
		value: 'popularity',
	},
	{
		label: __('Price', 'wc-ajax-product-filter'),
		value: 'price',
	},
	{
		label: __('Rating', 'wc-ajax-product-filter'),
		value: 'rating',
	},
	{
		label: __('Random', 'wc-ajax-product-filter'),
		value: 'rand',
	},
	{
		label: __('Title', 'wc-ajax-product-filter'),
		value: 'title',
	},
];

const orderDirections = orderDirectionOptions();
const metaKeys = wcapf_admin_params.meta_keys;
const metaTypes = wcapf_admin_params.meta_types;
const filterTypes = wcapf_admin_params.filter_types;
const taxonomyType = filterTypes.find((option) => 'taxonomy' === option.value);
const taxonomies = taxonomyType ? taxonomyType.options : [];

const taxQueryOperators = [
	{
		label: __('IN', 'wc-ajax-product-filter'),
		value: 'IN',
	},
	{
		label: __('NOT IN', 'wc-ajax-product-filter'),
		value: 'NOT IN',
	},
	{
		label: __('AND', 'wc-ajax-product-filter'),
		value: 'AND',
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
	operator: 'IN',
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
		layout,
		type,
		visibility,
		orderby,
		order,
		columns,
		limit,
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

	const layoutOption = layoutOptions.find(
		(option) => layout === option.value
	);

	const productType = productTypeOptions.find(
		(option) => type === option.value
	);

	const productVisibility = visibilityOptions.find(
		(option) => visibility === option.value
	);

	const orderBy = orderByOptions.find((option) => orderby === option.value);

	const orderDirection = orderDirections.find(
		(option) => order === option.value
	);

	let classes = '__code';

	if (clipboardApiFound) {
		classes += ' __clipboard-api-found';
	}

	const code = '[wcapf_products]';

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
						<div className='__field_row __layout'>
							<div className='__field_label'>
								<label>
									{__('Layout', 'wc-ajax-product-filter')}
									<TippyTooltip
										content={
											<>
												<b>Standard shop loop:</b> It
												comes with results count,
												orderby, product loop and
												pagination depending on your
												theme.
												<br />
												<br />
												<b>Products + Pagination:</b> A
												customized product loop with
												pagination at the bottom.
												<br />
												<br />
												<b>Products only:</b> Show only
												the products without any
												pagination.
											</>
										}
									/>
								</label>
							</div>
							<div className='__field_input'>
								<Select
									id={`layout-${index}`}
									inputKey={`layout-${index}`}
									options={layoutOptions}
									value={layoutOption}
									onChange={(selected) =>
										handleSelectChange(selected, 'layout')
									}
								/>
							</div>
						</div>

						<div className='__field_row __type'>
							<div className='__field_label'>
								<label>
									{__('Type', 'wc-ajax-product-filter')}
								</label>
							</div>
							<div className='__field_input'>
								<Select
									id={`type-${index}`}
									inputKey={`type-${index}`}
									options={productTypeOptions}
									value={productType}
									onChange={(selected) =>
										handleSelectChange(selected, 'type')
									}
								/>
							</div>
						</div>

						<div className='__field_row __visibility'>
							<div className='__field_label'>
								<label>
									{__('Visibility', 'wc-ajax-product-filter')}
								</label>
							</div>
							<div className='__field_input'>
								<Select
									id={`visibility-${index}`}
									inputKey={`visibility-${index}`}
									options={visibilityOptions}
									value={productVisibility}
									onChange={(selected) =>
										handleSelectChange(
											selected,
											'visibility'
										)
									}
								/>
							</div>
						</div>

						<div className='__field_row __order'>
							<div className='__field_label'>
								<label htmlFor={`order-${index}`}>
									{__('Order By', 'wc-ajax-product-filter')}
								</label>
							</div>
							<div className='__field_input'>
								<div className='__top_input'>
									<div className='__order_select'>
										<Select
											id={`order-${index}`}
											inputKey={`order-${index}`}
											options={orderByOptions}
											value={orderBy}
											onChange={(selected) =>
												handleSelectChange(
													selected,
													'orderby'
												)
											}
										/>
									</div>
									{'rand' !== orderby && (
										<div className='__order_direction_select'>
											<Select
												id={`order_direction-${index}`}
												inputKey={`order_direction-${index}`}
												options={orderDirections}
												value={orderDirection}
												onChange={(selected) =>
													handleSelectChange(
														selected,
														'order'
													)
												}
											/>
										</div>
									)}
								</div>
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

						<div className='__field_row __limit'>
							<div className='__field_label'>
								<label htmlFor={`limit-${index}`}>
									{__('Limit', 'wc-ajax-product-filter')}
									<TippyTooltip
										content={__(
											"The number of products to display per page. Put '-1' to display all products.",
											'wc-ajax-product-filter'
										)}
									/>
								</label>
							</div>
							<div className='__field_input'>
								<Text
									id={`limit-${index}`}
									type={'number'}
									renderAsFormField={false}
									value={limit}
									onChange={(value) =>
										handleQueryTextChange(value, 'limit')
									}
									min={-1}
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

						{'standard' !== layout && (
							<>
								<div className='__field_row __no_post_message'>
									<div className='__field_label'>
										<label
											htmlFor={`no-post-message-${index}`}
										>
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
					</>
				)}
			</fieldset>
		</div>
	);
};

export default ProductQuery;
