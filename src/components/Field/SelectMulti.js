import { __ } from '@wordpress/i18n';
import { CheckboxControl } from '@wordpress/components';
import { AsyncPaginate } from 'react-select-async-paginate';
import { default as ReactSelect } from 'react-select';
import axios from 'axios';
import { FormatSelectMultiLabel } from './utilsForReactSelect';

const SelectMulti = ({
	label,
	id,
	description,
	value,
	onChange,
	taxonomy,
	onlyParent = false,
	isMultiple = false,
	type = 'taxonomy',
	isUserRoles = false,
	options,
	showIncludeChildren = false,
	checkboxId,
	checkIsChecked,
	onCheckChange,
}) => {
	const loadOptions = async (keyword, prevOptions, { page }) => {
		let ajaxParams;

		if ('author' === type) {
			ajaxParams = {
				action: 'wcapf_get_post_authors_for_dropdown',
				keyword,
				page,
			};
		} else {
			ajaxParams = {
				action: 'wcapf_get_taxonomy_terms_for_dropdown',
				taxonomy,
				only_parent: onlyParent,
				keyword,
				page,
			};
		}

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

	let _classnames;

	if (isMultiple) {
		_classnames = '__custom_react_select full-width';
	} else {
		_classnames = '__custom_react_select fixed-width';
	}

	let placeholder;
	let noOptionsMessage;

	if ('author' === type) {
		if (isUserRoles) {
			placeholder = __(
				'Start typing to find the role',
				'wc-ajax-product-filter'
			);
			noOptionsMessage = __('No roles found', 'wc-ajax-product-filter');
		} else {
			placeholder = __(
				'Start typing to find the author',
				'wc-ajax-product-filter'
			);
			noOptionsMessage = __('No authors found', 'wc-ajax-product-filter');
		}
	} else {
		placeholder = __(
			'Start typing to find the term',
			'wc-ajax-product-filter'
		);
		noOptionsMessage = __('No terms found', 'wc-ajax-product-filter');
	}

	const loadingMessage = __('Loading...', 'wc-ajax-product-filter');

	const renderSelect = () => {
		if (isUserRoles) {
			return (
				<ReactSelect
					value={value}
					options={options}
					placeholder={placeholder}
					noOptionsMessage={() => noOptionsMessage}
					loadingMessage={() => loadingMessage}
					formatOptionLabel={FormatSelectMultiLabel}
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
			);
		} else {
			return (
				<AsyncPaginate
					value={value}
					loadOptions={loadOptions}
					additional={{
						page: 1,
					}}
					placeholder={placeholder}
					noOptionsMessage={() => noOptionsMessage}
					loadingMessage={() => loadingMessage}
					formatOptionLabel={FormatSelectMultiLabel}
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
			);
		}
	};

	return (
		<div className='__form_control react_select'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor={id}>{label}</label>
				</div>
				<div className='__wrapper'>
					<div className='__input_wrapper'>
						{renderSelect()}

						{showIncludeChildren && (
							<CheckboxControl
								label={__(
									'Include children',
									'wc-ajax-product-filter'
								)}
								className='__include_child_terms'
								checked={checkIsChecked}
								onChange={(checked) =>
									onCheckChange(checked, checkboxId)
								}
							/>
						)}
					</div>
				</div>
			</div>
			{description && (
				<p
					className='description'
					dangerouslySetInnerHTML={{ __html: description }}
				/>
			)}
		</div>
	);
};

export default SelectMulti;
