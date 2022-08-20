import { __ } from '@wordpress/i18n';
import Radio from '../../../Field/Radio';
import Select from '../../../Field/Select';
import { useFilter } from '../../FilterContext';
import OptionsTable from './OptionsTable';
import OptionsTableModal from './OptionsTableModal';
import { useEffect, useState } from '@wordpress/element';
import { getOrderByOptions, getOrderDirectionOptions } from '../../utils';
import { Spinner } from '@wordpress/components';
import axios from 'axios';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import { find, isEmpty } from 'lodash';
import LimitBy from './LimitFields';

const Options = () => {
	const {
		state: { activeFilterData, isFilterOptionsLoading },
		dispatch,
	} = useFilter();

	const [isOpen, setOpen] = useState(false);

	const {
		get_options,
		limit_options,
		parent_term,
		limit_values_by_id,
		exclude_values_id,
		order_terms_by,
		order_terms_dir,
	} = activeFilterData;

	const { createErrorNotice } = useDispatch(noticesStore);

	useEffect(() => {
		const data = {
			action: 'get_taxonomy_filter_options',
			taxonomy: 'pa_color',
		};

		axios
			.get(wcapf_admin_params.ajaxurl, {
				params: data,
			})
			.then((res) => {
				const data = res.data.data;

				dispatch({
					type: 'SET_FILTERS_OPTIONS_LOADING',
					payload: false,
				});

				dispatch({
					type: 'SET_FILTERS_MODAL_OPTIONS',
					payload: data,
				});
			})
			.catch((err) => {
				console.log(err);

				dispatch({
					type: 'SET_FILTERS_OPTIONS_LOADING',
					payload: false,
				});

				createErrorNotice(
					__(
						'There was an error fetching the filter options',
						'wc-ajax-product-filter'
					),
					{
						type: 'snackbar',
						icon: '🔥',
					}
				);
			});
	}, []);

	const openModal = () => setOpen(true);

	const closeModal = () => setOpen(false);

	const handleRadioChange = (e, key) => {
		const value = e.target.value;

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: { ...activeFilterData, [key]: value },
		});
	};

	const handleSelectChange = (values, key) => {
		if (isEmpty(values)) {
			dispatch({
				type: 'SET_ACTIVE_FILTER_DATA',
				payload: { ...activeFilterData, [key]: '' },
			});
		} else {
			const { value } = values[0];

			dispatch({
				type: 'SET_ACTIVE_FILTER_DATA',
				payload: { ...activeFilterData, [key]: value },
			});
		}
	};

	const getOptionsField = () => {
		return (
			<Radio
				id={'get_options'}
				label={__('Get Options', 'wc-ajax-product-filter')}
				value={get_options}
				onChange={(e) => handleRadioChange(e, 'get_options')}
				options={[
					{
						label: __('Automatically', 'wc-ajax-product-filter'),
						value: 'automatically',
					},
					{
						label: __('Manual Entry', 'wc-ajax-product-filter'),
						value: 'manual_entry',
						isPro: true,
					},
				]}
				description={__(
					'Whether to get the options automatically or you want to add the options manually.'
				)}
			/>
		);
	};

	const orderByField = () => {
		const options = getOrderByOptions();
		const _value = find(options, { value: order_terms_by });
		const value = _value ? [_value] : [];

		return (
			<Select
				label={__('Order By', 'wc-ajax-product-filter')}
				id={'order_terms_by'}
				options={options}
				values={value}
				onChange={(values) =>
					handleSelectChange(values, 'order_terms_by')
				}
				placeholder={__('Default', 'wc-ajax-product-filter')}
				searchable={false}
				description={__(
					'Field to order options by.',
					'wc-ajax-product-filter'
				)}
			/>
		);
	};

	const orderDirectionField = () => {
		if (order_terms_by) {
			return (
				<Radio
					id={'order_terms_dir'}
					label={__('Order Direction', 'wc-ajax-product-filter')}
					value={order_terms_dir}
					onChange={(e) => handleRadioChange(e, 'order_terms_dir')}
					options={getOrderDirectionOptions()}
					description={__(
						'Whether to order options in ascending or descending order.',
						'wc-ajax-product-filter'
					)}
				/>
			);
		}
	};

	const limitOptionsField = () => {
		if ('automatically' === get_options) {
			return <LimitBy />;
		}
	};

	const parentTermField = () => {
		const options = [];
		const value = [];

		if ('automatically' === get_options && 'child' === limit_options) {
			return (
				<Select
					label={__('Parent Term', 'wc-ajax-product-filter')}
					id={'parent_term'}
					options={options}
					values={value}
					onChange={(values) =>
						handleSelectChange(values, 'parent_term')
					}
					description={__(
						'Only show the child terms of a parent term.',
						'wc-ajax-product-filter'
					)}
				/>
			);
		}
	};

	const includeTermsField = () => {
		const options = [];
		const value = [];

		if ('automatically' === get_options && 'include' === limit_options) {
			return (
				<Select
					label={__('Terms to include', 'wc-ajax-product-filter')}
					id={'limit_values_by_id'}
					options={options}
					values={value}
					onChange={(values) =>
						handleSelectChange(values, 'limit_values_by_id')
					}
					description={__(
						'Select the terms that will be available to filter by.',
						'wc-ajax-product-filter'
					)}
				/>
			);
		}
	};

	const excludeTermsField = () => {
		const options = [];
		const value = [];

		if ('automatically' === get_options && 'exclude' === limit_options) {
			return (
				<Select
					label={__('Terms to exclude', 'wc-ajax-product-filter')}
					id={'exclude_values_id'}
					options={options}
					values={value}
					onChange={(values) =>
						handleSelectChange(values, 'exclude_values_id')
					}
					description={__(
						'Select the terms that will be excluded.',
						'wc-ajax-product-filter'
					)}
				/>
			);
		}
	};

	return (
		<div>
			{getOptionsField()}

			{orderByField()}

			{orderDirectionField()}

			{limitOptionsField()}

			{parentTermField()}

			{includeTermsField()}

			{excludeTermsField()}

			{isFilterOptionsLoading ? (
				<Spinner />
			) : (
				<>
					<OptionsTable openModal={openModal} />

					<OptionsTableModal
						isOpen={isOpen}
						closeModal={closeModal}
					/>
				</>
			)}
		</div>
	);
};

export default Options;
