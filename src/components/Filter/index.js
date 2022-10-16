import FilterSettings from './FilterSettings';
import FilterPreview from './FilterPreview';
import Notifications from '../Notifications';
import FilterSaveButton from './FilterSaveButton';
import { useFilter } from './FilterContext';
import { useEffect } from '@wordpress/element';
import { filterDefaultData, initialFilterKeysData } from './utils';
import axios from 'axios';
import { isEmpty, merge } from 'lodash';
import { getAdditionalData } from '../utils';
import TopBar from '../TopBar';

const Filter = () => {
	const { dispatch } = useFilter();

	const getFilterData = () => {
		/**
		 * @source https://stackoverflow.com/a/979995
		 */
		var query = new URL(window.location.href);
		var id = query.searchParams.get('id');

		const data = {
			action: 'get_filter_data',
			post_id: id,
		};

		return axios.get(wcapf_admin_params.ajaxurl, {
			params: data,
		});
	};

	useEffect(() => {
		Promise.all([getFilterData(), getAdditionalData()])
			.then((results) => {
				const resFilterData = results[0];
				const resAdditionalData = results[1];

				const {
					data: { data: filterData },
				} = resFilterData;

				const {
					data: { data: additionalData },
				} = resAdditionalData;

				let activeFilterData = {};
				let filterType = '';
				let filterKey = '';

				if (!isEmpty(filterData)) {
					dispatch({
						type: 'SET_TITLE',
						payload: filterData['post_title'],
					});

					activeFilterData = merge(
						filterDefaultData(),
						filterData['field_data']
					);

					filterType = activeFilterData['type'];
					filterKey = activeFilterData['field_key'];

					dispatch({
						type: 'SET_ACTIVE_FILTER_DATA',
						payload: activeFilterData,
					});

					dispatch({ type: 'SET_FILTER_TYPE', payload: filterType });
				}

				dispatch({
					type: 'SET_ADDITIONAL_DATA',
					payload: additionalData,
				});

				const filterKeys = initialFilterKeysData(activeFilterData);

				dispatch({ type: 'SET_FILTER_KEYS', payload: filterKeys });

				dispatch({ type: 'SET_LOADING', payload: false });
			})
			.catch((err) => console.log(err));
	}, []);

	return (
		<div className='__wcapf_admin'>
			<TopBar view={'filters'} />

			<div className='__edit_form'>
				<FilterSettings />
				<FilterPreview />
			</div>

			<Notifications />

			{/* <div className='__wcapf_layout'>
				<FilterSaveButton />
			</div> */}
		</div>
	);
};

export default Filter;
