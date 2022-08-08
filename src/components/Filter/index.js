import FilterSettings from './FilterSettings';
import FilterPreview from './FilterPreview';
import Notifications from '../Notifications';
import FilterSaveButton from './FilterSaveButton';
import { useFilter } from './FilterContext';
import { useEffect } from '@wordpress/element';
import { getAvailableFilters } from './utils';
import axios from 'axios';
import { isEmpty } from 'lodash';

const Filter = () => {
	const { dispatch } = useFilter();

	const getFilterData = () => {
		const data = {
			action: 'get_filter_data',
		};

		return axios.get(wcapf_admin_params.ajaxurl, {
			params: data,
		});
	};

	const getAdditionalData = () => {
		const data = {
			action: 'get_filter_additional_data',
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

					activeFilterData = filterData['field_data'];
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

				/**
				 * Sets the default filter keys.
				 */
				const filterKeys = {};

				getAvailableFilters().map((item) => {
					const type = item.type;

					if ('active-filters' === type || 'reset-button' === type) {
						return false;
					}

					if (
						'attribute' === type ||
						'custom-taxonomy' === type ||
						'post-meta' === type ||
						'post-property' === type
					) {
						let data = {};

						if ('attribute' === type) {
							data = additionalData['attributes'];
						} else if ('custom-taxonomy' === type) {
							data = additionalData['custom_taxonomies'];
						} else if ('post-meta' === type) {
							data = additionalData['meta_keys'];
						} else if ('post-property' === type) {
							data = additionalData['post_properties'];
						}

						const _filterKeys = {};

						for (const item in data) {
							let _filterKey = `_${item}`;

							if (filterType === type) {
								let selected = '';

								if (
									'attribute' === type ||
									'custom-taxonomy' === type
								) {
									selected = activeFilterData['taxonomy'];
								} else if ('post-meta') {
									selected = activeFilterData['meta_key'];
								} else if ('post-property' === type) {
									selected =
										activeFilterData['post_property'];
								}

								if (item === selected) {
									_filterKey = filterKey;
								}
							}

							_filterKeys[item] = _filterKey;
						}

						filterKeys[type] = _filterKeys;
					} else {
						let defaultFilterKey = item.defaultFilterKey;

						if (filterType === type) {
							defaultFilterKey = filterKey;
						}

						filterKeys[type] = defaultFilterKey;
					}
				});

				dispatch({ type: 'SET_FILTER_KEYS', payload: filterKeys });

				dispatch({ type: 'SET_LOADING', payload: false });
			})
			.catch((err) => console.log(err));
	}, []);

	return (
		<>
			<FilterSettings />
			<FilterSaveButton />
			<FilterPreview />
			<Notifications />
		</>
	);
};

export default Filter;
