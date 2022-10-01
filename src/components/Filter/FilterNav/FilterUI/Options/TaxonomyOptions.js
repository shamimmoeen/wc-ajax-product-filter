import { __ } from '@wordpress/i18n';
import Radio from '../../../../Field/Radio';
import Select from '../../../../Field/Select';
import { useFilter } from '../../../FilterContext';
import OptionsTable from '../OptionsTable';
import OptionsTableModal from '../OptionsTableModal';
import { useEffect, useState } from '@wordpress/element';
import { termsOrderByOptions, orderDirectionOptions } from '../../../utils';
import { Spinner } from '@wordpress/components';
import axios from 'axios';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import { isEmpty } from 'lodash';
import LimitBy from '../LimitFields';
import useFilterData from '../../../useFilterData';
import ToggleGroup from '../../../../Field/ToggleGroup';

const TaxonomyOptions = () => {
	const {
		state: { activeFilterData, isFilterOptionsLoading },
		dispatch,
	} = useFilter();

	const [isOpen, setOpen] = useState(false);

	const { handleRadioChange, handleToggleGroupChange } = useFilterData(
		activeFilterData,
		dispatch
	);

	const { get_options, limit_options, order_terms_by, order_terms_dir } =
		activeFilterData;

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
				description={__(
					'Whether to get the options automatically or you want to add the options manually.'
				)}
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
				value={get_options}
				onChange={handleRadioChange}
			/>
		);
	};

	const orderByField = () => {
		const options = termsOrderByOptions();

		return (
			<ToggleGroup
				id={'order_terms_by'}
				label={__('Order By', 'wc-ajax-product-filter')}
				description={__(
					'Field to order options by.',
					'wc-ajax-product-filter'
				)}
				options={options}
				onChange={handleToggleGroupChange}
				value={order_terms_by}
			/>
		);
	};

	const orderDirectionField = () => {
		if ('default' !== order_terms_by) {
			return (
				<Radio
					id={'order_terms_dir'}
					label={__('Order Direction', 'wc-ajax-product-filter')}
					description={__(
						'Whether to order options in ascending or descending order.',
						'wc-ajax-product-filter'
					)}
					options={orderDirectionOptions()}
					value={order_terms_dir}
					onChange={handleRadioChange}
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
		if ('automatically' === get_options && 'child' === limit_options) {
			const options = [];
			const value = [];

			return (
				<Select
					id={'parent_term'}
					label={__('Parent Term', 'wc-ajax-product-filter')}
					description={__(
						'Only show the child terms of a parent term.',
						'wc-ajax-product-filter'
					)}
					options={options}
					values={value}
					onChange={(values) =>
						handleSelectChange(values, 'parent_term')
					}
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
					id={'limit_values_by_id'}
					label={__('Terms to include', 'wc-ajax-product-filter')}
					description={__(
						'Select the terms that will be available to filter by.',
						'wc-ajax-product-filter'
					)}
					options={options}
					values={value}
					onChange={(values) =>
						handleSelectChange(values, 'limit_values_by_id')
					}
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
					id={'exclude_values_id'}
					label={__('Terms to exclude', 'wc-ajax-product-filter')}
					description={__(
						'Select the terms that will be excluded.',
						'wc-ajax-product-filter'
					)}
					options={options}
					values={value}
					onChange={(values) =>
						handleSelectChange(values, 'exclude_values_id')
					}
				/>
			);
		}
	};

	return (
		<>
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
		</>
	);
};

export default TaxonomyOptions;
