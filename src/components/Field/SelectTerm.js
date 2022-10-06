import { sprintf, __ } from '@wordpress/i18n';
import { AsyncPaginate } from 'react-select-async-paginate';
import axios from 'axios';

const SelectTerm = ({
	label,
	id,
	description,
	value,
	onChange,
	taxonomy,
	onlyParent = false,
	isMultiple = false,
}) => {
	const loadOptions = async (keyword, prevOptions, { page }) => {
		const ajaxParams = {
			action: 'get_taxonomy_filter_options',
			taxonomy,
			only_parent: onlyParent,
			keyword,
			page,
		};

		// Fetch the options.
		try {
			const res = await axios.get(wcapf_admin_params.ajaxurl, {
				params: ajaxParams,
			});

			const data = res.data.data;
			const hasMore = data.length >= 1;

			return {
				options: data,
				hasMore,
				additional: {
					page: page + 1,
				},
			};
		} catch (err) {
			console.log(err);
		}
	};

	const formatLabel = (data) => {
		return (
			<span>
				{data.label}
				<span className='__info'>
					[
					{sprintf(
						__('ID: %s', 'wc-ajax-product-filter'),
						data.value
					)}
					]
				</span>
			</span>
		);
	};

	let _classnames;

	if (isMultiple) {
		_classnames = '__custom_react_select full-width';
	} else {
		_classnames = '__custom_react_select fixed-width';
	}

	return (
		<div className='__form_control react_select'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor={id}>{label}</label>
				</div>
				<div className='__wrapper'>
					<div className='__input_wrapper'>
						<AsyncPaginate
							value={value}
							loadOptions={loadOptions}
							additional={{
								page: 1,
							}}
							placeholder={__(
								'Start typing to find the term',
								'wc-ajax-product-filter'
							)}
							noOptionsMessage={() =>
								__('No terms found', 'wc-ajax-product-filter')
							}
							loadingMessage={() =>
								__('Loading...', 'wc-ajax-product-filter')
							}
							formatOptionLabel={formatLabel}
							isMulti={isMultiple}
							closeMenuOnSelect={!isMultiple}
							onChange={(selected) => onChange(selected, id)}
							isClearable
							className={_classnames}
							classNamePrefix='__react_select'
							theme={(theme) => ({
								...theme,
								borderRadius: 0,
								colors: {
									...theme.colors,
									primary: '#007cba',
								},
							})}
						/>
					</div>
				</div>
			</div>
			{description ? <p className='description'>{description}</p> : ''}
		</div>
	);
};

export default SelectTerm;
