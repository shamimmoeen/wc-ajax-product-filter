import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { AsyncPaginate } from 'react-select-async-paginate';
import axios from 'axios';

const SelectNew2 = () => {
	const [value, setValue] = useState([]);

	const loadOptions = async (keyword, prevOptions, { page }) => {
		const ajaxParams = {
			action: 'get_taxonomy_filter_options',
			taxonomy: 'product_cat',
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

			console.log(page, hasMore);

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

	return (
		<AsyncPaginate
			value={value}
			loadOptions={loadOptions}
			additional={{
				page: 1,
			}}
			isMulti
			closeMenuOnSelect={false}
			onChange={setValue}
			className='__custom_react_select fixed-width'
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

export default SelectNew2;
