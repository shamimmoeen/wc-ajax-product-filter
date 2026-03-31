import { useState } from '@wordpress/element';
import { Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { dragHandle, cancelCircleFilled } from '@wordpress/icons';
import { orderDirectionOptions } from '../../utils';
import Select from '../../../Field/Select';
import Text from '../../../Field/Text';

const sortByOptions = wcapf_admin_params.sort_by_options;
const metaKeys = wcapf_admin_params.meta_keys;
const metaTypes = wcapf_admin_params.meta_types;
const sortDirections = orderDirectionOptions();
const secondarySortOptions = [
	{ value: '', label: __('— None —', 'wc-ajax-product-filter') },
	...sortByOptions.filter((o) => 'rand' !== o.value),
];

const blockSelect = (rowIndex, onSelectChange, wrapperClass, key, options, selectedValue, isSearchable = false) => (
	<div className={wrapperClass}>
		<Select
			options={options}
			value={selectedValue}
			onChange={(selected) => onSelectChange(selected, rowIndex, key)}
			portalTarget={document.querySelector('body')}
			isSearchable={isSearchable}
		/>
	</div>
);

const blockInput = (rowIndex, onInputChange, wrapperClass, key, val, placeholder = '') => (
	<div className={wrapperClass}>
		<Text
			id={key}
			index={rowIndex}
			value={val}
			onChange={onInputChange}
			renderAsFormField={false}
			{...(placeholder ? { placeholder } : {})}
		/>
	</div>
);

const SortByOptionBlock = ({ row, rowIndex, onSelectChange, onInputChange, onRemove }) => {
	const {
		value,
		direction,
		label,
		meta_key,
		meta_type,
		secondary_sort,
		secondary_direction,
		secondary_meta_key,
		secondary_meta_type,
	} = row;

	const [tiebreakerOpen, setTiebreakerOpen] = useState(!!secondary_sort);

	const sel = (wrapperClass, key, options, selectedValue, isSearchable = false) =>
		blockSelect(rowIndex, onSelectChange, wrapperClass, key, options, selectedValue, isSearchable);

	const inp = (wrapperClass, key, val, placeholder = '') =>
		blockInput(rowIndex, onInputChange, wrapperClass, key, val, placeholder);

	const sortByValue  = sortByOptions.find((o) => value === o.value);
	const sortDirValue = sortDirections.find((o) => direction === o.value);
	const isDisabled   = 'rand' === value;

	const defaultSortByLabel = sortByValue ? sortByValue.label : value;
	const defaultDirections  = { price: 'asc' };
	const defaultDir         = defaultDirections[value] || 'desc';
	const labelPlaceholder   = 'meta_value' === value
		? (meta_key ? `Meta key: ${meta_key}` : '')
		: defaultDir !== direction
			? `${defaultSortByLabel} (${direction})`
			: defaultSortByLabel;

	const metaValue    = metaKeys.find((o) => meta_key === o.value);
	const metaTypeVal  = metaTypes.find((o) => (meta_type || 'alphabetic') === o.value);
	const secSortValue = secondarySortOptions.find((o) => (secondary_sort || '') === o.value);
	const secDirValue  = sortDirections.find((o) => (secondary_direction || 'asc') === o.value);
	const secMetaValue = metaKeys.find((o) => secondary_meta_key === o.value);
	const secMetaType  = metaTypes.find((o) => (secondary_meta_type || 'alphabetic') === o.value);

	return (
		<div className='wcapf-sort-by-block'>
			<div className='wcapf-sort-by-block__handle'>
				<Icon icon={dragHandle} className='__drag_handler' />
			</div>

			<div className='wcapf-sort-by-block__body'>
				<div className='wcapf-sort-by-block__row'>
					<div className='wcapf-sort-by-block__field wcapf-sort-by-block__field--sort-by'>
						<label className='wcapf-sort-by-block__label'>
							{__('Sort by', 'wc-ajax-product-filter')}
						</label>
						{sel('__sort_by', 'value', sortByOptions, sortByValue, true)}
					</div>

					{!isDisabled && (
						<div className='wcapf-sort-by-block__field wcapf-sort-by-block__field--direction'>
							<label className='wcapf-sort-by-block__label'>
								{__('Direction', 'wc-ajax-product-filter')}
							</label>
							{sel('__direction', 'direction', sortDirections, sortDirValue)}
						</div>
					)}

					<div className='wcapf-sort-by-block__field wcapf-sort-by-block__field--label'>
						<label className='wcapf-sort-by-block__label'>
							{__('Label', 'wc-ajax-product-filter')}
						</label>
						{inp('__label', 'label', label, labelPlaceholder)}
					</div>

					{'meta_value' === value && (
						<>
							<div className='wcapf-sort-by-block__field wcapf-sort-by-block__field--meta-key'>
								<label className='wcapf-sort-by-block__label'>
									{__('Meta Key', 'wc-ajax-product-filter')}
								</label>
								{sel('__meta_key', 'meta_key', metaKeys, metaValue, true)}
							</div>
							<div className='wcapf-sort-by-block__field wcapf-sort-by-block__field--meta-type'>
								<label className='wcapf-sort-by-block__label'>
									{__('Meta Type', 'wc-ajax-product-filter')}
								</label>
								{sel('__meta_type', 'meta_type', metaTypes, metaTypeVal)}
							</div>
						</>
					)}
				</div>

				{!tiebreakerOpen ? (
					<button
						type='button'
						className='wcapf-sort-by-block__add-tiebreaker button-link'
						onClick={() => setTiebreakerOpen(true)}
					>
						{__('+ Then sort by', 'wc-ajax-product-filter')}
					</button>
				) : (
					<div className='wcapf-sort-by-block__tiebreaker'>
						<div className='wcapf-sort-by-block__row'>
							<div className='wcapf-sort-by-block__field wcapf-sort-by-block__field--sort-by'>
								<label className='wcapf-sort-by-block__label'>
									{__('Then sort by', 'wc-ajax-product-filter')}
								</label>
								{sel('__secondary_sort', 'secondary_sort', secondarySortOptions, secSortValue, true)}
							</div>

							{secondary_sort && (
								<div className='wcapf-sort-by-block__field wcapf-sort-by-block__field--direction'>
									<label className='wcapf-sort-by-block__label'>
										{__('Direction', 'wc-ajax-product-filter')}
									</label>
									{sel('__secondary_direction', 'secondary_direction', sortDirections, secDirValue)}
								</div>
							)}

							{'meta_value' === secondary_sort && (
								<>
									<div className='wcapf-sort-by-block__field wcapf-sort-by-block__field--meta-key'>
										<label className='wcapf-sort-by-block__label'>
											{__('Meta Key', 'wc-ajax-product-filter')}
										</label>
										{sel('__secondary_meta_key', 'secondary_meta_key', metaKeys, secMetaValue, true)}
									</div>
									<div className='wcapf-sort-by-block__field wcapf-sort-by-block__field--meta-type'>
										<label className='wcapf-sort-by-block__label'>
											{__('Meta Type', 'wc-ajax-product-filter')}
										</label>
										{sel('__secondary_meta_type', 'secondary_meta_type', metaTypes, secMetaType)}
									</div>
								</>
							)}
						</div>
					</div>
				)}
			</div>

			<div className='wcapf-sort-by-block__actions'>
				<button
					type='button'
					className='wcapf-sort-by-block__remove button-link button-link-delete'
					onClick={() => onRemove(rowIndex)}
				>
					<Icon icon={cancelCircleFilled} size={20} />
				</button>
			</div>
		</div>
	);
};

export default SortByOptionBlock;
