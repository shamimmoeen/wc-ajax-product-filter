import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
// import Select from 'react-select';
// import AsyncSelect from 'react-select/async';
import { AsyncPaginate } from 'react-select-async-paginate';
import axios from 'axios';

const SelectNew = ({ label, id, description }) => {
	const options = [
		{ value: 'The Crownlands' },
		{ value: 'Iron Islands' },
		{ value: 'The North' },
		{ value: 'The Reach' },
		{ value: 'The Riverlands' },
		{ value: 'The Vale' },
		{ value: 'The Westerlands' },
		{ value: 'The Stormlands' },
	];

	const [region, setRegion] = useState(options[0]);

	const onchangeSelect = (item) => {
		setRegion(item);
	};

	const _loadOptions = async (inputValue) => {
		console.log(inputValue);

		const ajaxParams = {
			action: 'get_taxonomy_filter_options',
			taxonomy: 'product_cat',
			keyword: inputValue,
		};

		// Fetch the options.
		try {
			const res = await axios.get(wcapf_admin_params.ajaxurl, {
				params: ajaxParams,
			});

			const data = res.data.data;

			console.log(data);

			return data;
		} catch (err) {
			console.log(err);
		}
	};

	const loadOptions = async (searchQuery, loadedOptions, { page }) => {
		console.log(searchQuery, loadedOptions, page);

		const ajaxParams = {
			action: 'get_taxonomy_filter_options',
			taxonomy: 'product_cat',
			keyword: inputValue,
		};

		// Fetch the options.
		try {
			const res = await axios.get(wcapf_admin_params.ajaxurl, {
				params: ajaxParams,
			});

			const data = res.data.data;

			console.log(data);

			return data;
		} catch (err) {
			console.log(err);
		}
	};

	const onChange = () => {
		console.log('onchange called');
	};

	return (
		<div className='__form_control react_select'>
			<div className='__inner'>
				<div className='__label'>
					<label htmlFor={id}>{label}</label>
				</div>
				<div className='__wrapper'>
					<div className='__input_wrapper'>
						<AsyncPaginate
							key={'hello'}
							value={'hello'}
							loadOptions={loadOptions}
							onChange={onChange}
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
						{/* <AsyncSelect
							placeholder={__(
								'Select...',
								'wc-ajax-product-filter'
							)}
							loadOptions={loadOptions}
							defaultOptions
							isMulti
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
						/> */}
						{/* <Select
							width={'200px'}
							value={region}
							onChange={onchangeSelect}
							options={options}
							getOptionValue={(option) => option.value}
							getOptionLabel={(option) => option.value}
							className='__custom_react_select'
							classNamePrefix='__react_select'
							theme={(theme) => ({
								...theme,
								borderRadius: 0,
								colors: {
									...theme.colors,
									primary: '#007cba',
								},
							})}
						/> */}
					</div>
				</div>
			</div>
			{description ? <p className='description'>{description}</p> : ''}
		</div>
	);
};

export default SelectNew;
