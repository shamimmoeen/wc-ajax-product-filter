import { __ } from '@wordpress/i18n';
import Text from '../../../Field/Text';
import Listbox from '../../../Field/Listbox';

const GeneralFields = ({
	filterType,
	activeFilterData,
	filterKeys,
	additionalData,
	dispatch,
}) => {
	const filterKey = activeFilterData['field_key'] ?? '';

	const handleTaxonomyChange = (value) => {
		if (!value) {
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

		const type = activeFilterData['type'];
		const filterKey = filterKeys[type][value];

		const _activeFilterData = {
			...activeFilterData,
			field_key: filterKey,
			taxonomy: value,
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

			return (
				<Listbox
					label={taxonomyFieldLabel}
					id={'taxonomy'}
					options={options}
					value={taxonomy}
					onChange={handleTaxonomyChange}
					searchable={false}
				/>
			);
		}
	};

	const handleMetaKeyChange = (value) => {
		if (!value) {
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

		const type = activeFilterData['type'];
		const filterKey = filterKeys[type][value];

		const _activeFilterData = {
			...activeFilterData,
			field_key: filterKey,
			meta_key: value,
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

			return (
				<>
					<Listbox
						id={'meta_key'}
						label={__('Meta Key', 'wc-ajax-product-filter')}
						options={options}
						value={metaKey}
						onChange={handleMetaKeyChange}
						visible={4}
					/>
				</>
			);
		}
	};

	const handlePostPropertyChange = (value) => {
		if (!value) {
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

		const type = activeFilterData['type'];
		const filterKey = filterKeys[type][value];

		const _activeFilterData = {
			...activeFilterData,
			field_key: filterKey,
			post_property: value,
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

			return (
				<Listbox
					label={__('Post Property', 'wc-ajax-product-filter')}
					id={'post_property'}
					options={options}
					value={postProperty}
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
					description={__(
						'The unique key that will be used to identify the filter.',
						'wc-ajax-product-filter'
					)}
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
