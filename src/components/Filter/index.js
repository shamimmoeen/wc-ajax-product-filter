import { useEffect } from '@wordpress/element';
import TopBar from '../TopBar';
import FilterTitle from './FilterTitle';
import FilterNav from './FilterNav';
import FilterPreview from './FilterPreview';
import Notifications from '../Notifications';
import { useFilter } from './FilterContext';
import { filterDefaultData, initialFilterKeysData } from './utils';
import axios from 'axios';
import { isEmpty, merge } from 'lodash';
import { getAdditionalData } from '../utils';

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

				if (!isEmpty(filterData)) {
					dispatch({
						type: 'SET_TITLE',
						payload: filterData['post_title'],
					});

					activeFilterData = merge(
						filterDefaultData(),
						filterData['filter_data']
					);

					const filterType = activeFilterData['type'];
					const filterId = activeFilterData['field_id'];

					dispatch({
						type: 'SET_ACTIVE_FILTER_DATA',
						payload: activeFilterData,
					});

					dispatch({ type: 'SET_FILTER_TYPE', payload: filterType });

					dispatch({ type: 'SET_FILTER_ID', payload: filterId });
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

			<div className='__wcapf_layout'>
				<div className='__main __edit_filter'>
					<div className='__edit_filter_from'>
						<div className='__content'>
							<FilterTitle />
							<FilterNav />
						</div>
					</div>

					<div className='__sidebar'>
						<FilterPreview />
					</div>
				</div>
			</div>

			<Notifications />
		</div>
	);
};

export default Filter;
