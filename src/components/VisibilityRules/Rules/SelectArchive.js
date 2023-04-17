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

let customClasses = '__custom_react_select __single_select __archive_select';

const SelectArchive = ({ value, taxonomy, onChange }) => {
	const loadOptions = async (keyword, prevOptions, { page }) => {
		const ajaxParams = {
			action: 'wcapf_get_taxonomy_terms',
			taxonomy,
			only_parent: false,
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

	const placeholder = __('Select...', 'wc-ajax-product-filter');
	const noOptionsMessage = __('No terms found', 'wc-ajax-product-filter');
	const loadingMessage = __('Loading...', 'wc-ajax-product-filter');

	return (
		<AsyncPaginate
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
			key={taxonomy}
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

export default SelectArchive;
