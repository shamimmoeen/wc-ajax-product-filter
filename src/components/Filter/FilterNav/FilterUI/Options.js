import { __ } from '@wordpress/i18n';
import Radio from '../../../Field/Radio';
import Select from '../../../Field/Select';
import { useFilter } from '../../FilterContext';
import OptionsTable from './OptionsTable';
import OptionsTableModal from './OptionsTableModal';
import { useEffect, useState } from '@wordpress/element';
import {
	getLimitByOptions,
	getOrderByOptions,
	getOrderDirectionOptions,
} from '../../utils';
import { Spinner } from '@wordpress/components';
import axios from 'axios';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';

const Options = () => {
	const {
		state: {
			activeFilterData,
			isFilterOptionsLoading,
			doneFetchingFilterOptions,
		},
		dispatch,
	} = useFilter();

	const [isOpen, setOpen] = useState(false);

	const { get_options, order_terms_by, order_terms_dir } = activeFilterData;

	const { createErrorNotice } = useDispatch(noticesStore);

	useEffect(() => {
		if (doneFetchingFilterOptions) {
			return;
		}

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
					type: 'SET_FILTER_OPTIONS_FETCHED',
					payload: true,
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

				dispatch({
					type: 'SET_FILTER_OPTIONS_FETCHED',
					payload: true,
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
					},
				]}
				description={__(
					'Whether to get the options automatically or you want to add the options manually.'
				)}
			/>
		);
	};

	const limitOptionsField = () => {
		if ('automatically' === get_options) {
			return (
				<Select
					label={__('Limit Options', 'wc-ajax-product-filter')}
					id={'limit_options'}
					options={getLimitByOptions()}
					searchable={false}
					description={__(
						'Limit the filter options.',
						'wc-ajax-product-filter'
					)}
				/>
			);
		}
	};

	const orderByField = () => {
		return (
			<Select
				label={__('Order By', 'wc-ajax-product-filter')}
				id={'order_by'}
				options={getOrderByOptions()}
				placeholder={__('Default', 'wc-ajax-product-filter')}
				searchable={false}
				description={__(
					'Field to order terms by.',
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
						'Whether to order terms in ascending or descending order.',
						'wc-ajax-product-filter'
					)}
				/>
			);
		}
	};

	return (
		<div>
			{getOptionsField()}

			{limitOptionsField()}

			{orderByField()}

			{orderDirectionField()}

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
