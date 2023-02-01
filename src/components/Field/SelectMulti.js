import { __ } from '@wordpress/i18n';
import { CheckboxControl } from '@wordpress/components';
import { AsyncPaginate } from 'react-select-async-paginate';
import { default as ReactSelect } from 'react-select';
import axios from 'axios';
import { FormatSelectMultiLabel } from './utilsForReactSelect';
import { getInputId } from '../utils';

const SelectMulti = ({
	label,
	id,
	index = '',
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
	renderAsFormField = true,
	inputKey,
	inputPlaceholder,
	inputNoOptionsMessage,
	maxMenuHeight,
}) => {
	const loadOptions = async (keyword, prevOptions, { page }) => {
		let ajaxParams;

		if ('author' === type) {
			ajaxParams = {
				action: 'wcapf_get_authors_for_dropdown',
				keyword,
				page,
			};
		} else if ('page' === type) {
			ajaxParams = {
				action: 'wcapf_get_pages_for_dropdown',
				keyword,
				page,
			};
		} else {
			ajaxParams = {
				action: 'wcapf_get_terms_for_dropdown',
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
		_classnames = `__custom_react_select full-width ${id}`;
	} else {
		_classnames = `__custom_react_select fixed-width ${id}`;
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

	if (inputPlaceholder) {
		placeholder = inputPlaceholder;
	}

	if (inputNoOptionsMessage) {
		noOptionsMessage = inputNoOptionsMessage;
	}

	const loadingMessage = __('Loading...', 'wc-ajax-product-filter');

	const inputId = getInputId(id, index);

	const renderSelect = () => {
		if (isUserRoles) {
			return (
				<ReactSelect
					inputId={inputId}
					value={value}
					options={options}
					placeholder={placeholder}
					noOptionsMessage={() => noOptionsMessage}
					loadingMessage={() => loadingMessage}
					formatOptionLabel={FormatSelectMultiLabel}
					isMulti={isMultiple}
					maxMenuHeight={maxMenuHeight}
					closeMenuOnSelect={!isMultiple}
					onChange={(selected) => onChange(selected, id, index)}
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
					key={inputKey}
					inputId={inputId}
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
					maxMenuHeight={maxMenuHeight}
					closeMenuOnSelect={!isMultiple}
					onChange={(selected) => onChange(selected, id, index)}
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

	const includeChild = () => {
		let label;

		if ('direct_child_only' === checkboxId) {
			label = __('Direct child only', 'wc-ajax-product-filter');
		} else {
			label = __('Include children', 'wc-ajax-product-filter');
		}

		return (
			<CheckboxControl
				label={label}
				className='__include_child_terms'
				checked={checkIsChecked}
				onChange={(checked) =>
					onCheckChange(checked, checkboxId, index)
				}
			/>
		);
	};

	if (renderAsFormField) {
		return (
			<div className='__form_control react_select'>
				<div className='__inner'>
					<div className='__label'>
						<label htmlFor={inputId}>{label}</label>
					</div>
					<div className='__wrapper'>
						<div className='__input_wrapper'>
							{renderSelect()}

							{showIncludeChildren && includeChild()}
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
	}

	return renderSelect();
};

export default SelectMulti;
