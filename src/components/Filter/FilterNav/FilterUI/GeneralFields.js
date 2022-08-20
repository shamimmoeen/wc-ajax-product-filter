import { __ } from '@wordpress/i18n';
import Text from '../../../Field/Text';
import Select from '../../../Field/Select';
import { useFilter } from '../../FilterContext';
import { find } from 'lodash';

const GeneralFields = () => {
	const {
		state: { filterType, activeFilterData, filterKeys, additionalData },
		dispatch,
	} = useFilter();

	const filterKey = activeFilterData['field_key'] ?? '';

	const handleTaxonomyChange = (selected) => {
		if (!selected.length) {
			const _activeFilterData = {
				...activeFilterData,
				field_key: '',
				taxonomy: '',
			};

			dispatch({
				type: 'SET_ACTIVE_FILTER_DATA',
				payload: _activeFilterData,
			});

			return;
		}

		const _taxonomyData = selected[0];
		const _taxonomy = _taxonomyData.value;

		const type = activeFilterData['type'];
		const filterKey = filterKeys[type][_taxonomy];

		const _activeFilterData = {
			...activeFilterData,
			field_key: filterKey,
			taxonomy: _taxonomy,
		};

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: _activeFilterData,
		});
	};

	const taxonomyField = () => {
		if ('custom-taxonomy' === filterType || 'attribute' === filterType) {
			const taxonomy = activeFilterData['taxonomy'];
			let taxonomyFieldLabel;
			let data = {};
			let options = [];

			if ('custom-taxonomy' === filterType) {
				taxonomyFieldLabel = __('Taxonomy', 'wc-ajax-product-filter');
				data = additionalData['custom_taxonomies'];
			} else {
				taxonomyFieldLabel = __('Attribute', 'wc-ajax-product-filter');
				data = additionalData['attributes'];
			}

			for (const [value, label] of Object.entries(data)) {
				options.push({ label, value });
			}

			const _values = find(options, { value: taxonomy });
			const values = _values ? [_values] : [];

			return (
				<Select
					label={taxonomyFieldLabel}
					id={'taxonomy'}
					options={options}
					values={values}
					onChange={handleTaxonomyChange}
					searchable={false}
				/>
			);
		}
	};

	const handleMetaKeyChange = (selected) => {
		if (!selected.length) {
			const _activeFilterData = {
				...activeFilterData,
				field_key: '',
				meta_key: '',
			};

			dispatch({
				type: 'SET_ACTIVE_FILTER_DATA',
				payload: _activeFilterData,
			});

			return;
		}

		const _metaKeyData = selected[0];
		const _metaKey = _metaKeyData.value;

		const type = activeFilterData['type'];
		const filterKey = filterKeys[type][_metaKey];

		const _activeFilterData = {
			...activeFilterData,
			field_key: filterKey,
			meta_key: _metaKey,
		};

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: _activeFilterData,
		});
	};

	const postMetaField = () => {
		if ('post-meta' === filterType) {
			const metaKey = activeFilterData['meta_key'];
			const data = additionalData['meta_keys'];
			let options = [];

			for (const [value, label] of Object.entries(data)) {
				options.push({ label, value });
			}

			const _values = find(options, { value: metaKey });
			const values = _values ? [_values] : [];

			return (
				<Select
					label={__('Meta Key', 'wc-ajax-product-filter')}
					id={'meta_key'}
					options={options}
					values={values}
					onChange={handleMetaKeyChange}
				/>
			);
		}
	};

	const handlePostPropertyChange = (selected) => {
		if (!selected.length) {
			const _activeFilterData = {
				...activeFilterData,
				field_key: '',
				post_property: '',
			};

			dispatch({
				type: 'SET_ACTIVE_FILTER_DATA',
				payload: _activeFilterData,
			});

			return;
		}

		const _postPropertyData = selected[0];
		const _postProperty = _postPropertyData.value;

		const type = activeFilterData['type'];
		const filterKey = filterKeys[type][_postProperty];

		const _activeFilterData = {
			...activeFilterData,
			field_key: filterKey,
			post_property: _postProperty,
		};

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: _activeFilterData,
		});
	};

	const postPropertyField = () => {
		if ('post-property' === filterType) {
			const postProperty = activeFilterData['post_property'];
			const data = additionalData['post_properties'];
			let options = [];

			for (const [value, { label }] of Object.entries(data)) {
				options.push({ label, value });
			}

			const _values = find(options, { value: postProperty });
			const values = _values ? [_values] : [];

			return (
				<Select
					label={__('Post Property', 'wc-ajax-product-filter')}
					id={'post_property'}
					options={options}
					values={values}
					onChange={handlePostPropertyChange}
					searchable={false}
				/>
			);
		}
	};

	const handleFilterKeyChange = (e) => {
		const _filterKey = e.target.value;

		const _activeFilterData = {
			...activeFilterData,
			field_key: _filterKey,
		};

		dispatch({
			type: 'SET_ACTIVE_FILTER_DATA',
			payload: _activeFilterData,
		});

		if ('custom-taxonomy' === filterType || 'attribute' === filterType) {
			const taxonomy = activeFilterData['taxonomy'];
			let _filterKeys;

			if ('attribute' === filterType) {
				_filterKeys = {
					...filterKeys,
					attribute: {
						...filterKeys['attribute'],
						[taxonomy]: _filterKey,
					},
				};
			} else {
				_filterKeys = {
					...filterKeys,
					'custom-taxonomy': {
						...filterKeys['custom-taxonomy'],
						[taxonomy]: _filterKey,
					},
				};
			}

			dispatch({ type: 'SET_FILTER_KEYS', payload: _filterKeys });
		}
	};

	const filterKeyField = () => {
		if ('active-filters' !== filterType && 'reset-button' !== filterType) {
			return (
				<Text
					id={'filter_key'}
					label={__('Filter Key', 'wc-ajax-product-filter')}
					value={filterKey}
					onChange={handleFilterKeyChange}
				/>
			);
		}
	};

	let output = '';

	if (filterType) {
		output = (
			<>
				{taxonomyField()}
				{postMetaField()}
				{postPropertyField()}
				{filterKeyField()}
			</>
		);
	}

	return output;
};

export default GeneralFields;
