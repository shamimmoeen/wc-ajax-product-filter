import { AsyncPaginate } from 'react-select-async-paginate';
import axios from 'axios';
import {
	customStyles,
	IndicatorSeparator,
	DropdownIndicator,
	SingleValueForSelectArchive,
	OptionForSelectArchive,
} from '../../Field/utilsForReactSelect';
import { __ } from '@wordpress/i18n';
import { getNonceToken } from '../../utils';

const customClasses = '__custom_react_select __single_select __select_v_r';

const SelectVisibilityRule = ({
	value,
	taxonomy,
	type,
	onChange,
	uniqueId,
}) => {
	const loadOptions = async (keyword, _prevOptions, { page }) => {
		let ajaxParams;

		if ('page' === type) {
			ajaxParams = {
				action: 'wcapf_get_pages_for_dropdown',
				keyword,
				page,
				show_all: true,
			};
		} else {
			ajaxParams = {
				action: 'wcapf_get_terms_for_dropdown',
				taxonomy,
				only_parent: false,
				keyword,
				page,
			};
		}

		ajaxParams['nonce'] = getNonceToken();

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

	const loadingMessage = __('Loading...', 'wc-ajax-product-filter');

	let placeholder;
	let noOptionsMessage;

	if ('page' === type) {
		placeholder = __('Select page', 'wc-ajax-product-filter');
		noOptionsMessage = __('No pages found', 'wc-ajax-product-filter');
	} else {
		placeholder = __('Leave empty to match any', 'wc-ajax-product-filter');
		noOptionsMessage = __('No terms found', 'wc-ajax-product-filter');
	}

	return (
		<AsyncPaginate
			key={uniqueId}
			inputId={uniqueId}
			components={{
				IndicatorSeparator,
				DropdownIndicator,
				SingleValue: SingleValueForSelectArchive,
				Option: OptionForSelectArchive,
			}}
			isSearchable={true}
			loadOptions={loadOptions}
			additional={{
				page: 1,
			}}
			isClearable={'page' !== type}
			placeholder={placeholder}
			noOptionsMessage={() => noOptionsMessage}
			loadingMessage={() => loadingMessage}
			value={value}
			onChange={onChange}
			styles={customStyles}
			className={customClasses}
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
};

export default SelectVisibilityRule;
