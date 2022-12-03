import { pick } from 'lodash';
import useFormData from './useFormData';
import {
	filterDefaultData,
	filterTypeDependentFields,
	manualEntryOrderTypes,
} from './utils';

const useFormFilterData = (state, dispatch) => {
	const { setDirty } = useFormData(state, dispatch);

	const { formFilters } = state;

	const updateFilter = (index, key, value) => {
		const filterData = formFilters[index];

		if (filterData[key] === value) {
			return;
		}

		const _formFilters = formFilters.map((filter, _index) => {
			if (_index === index) {
				return { ...filter, [key]: value };
			}

			return filter;
		});

		dispatch({ type: 'SET_FORM_FILTERS', payload: _formFilters });

		setDirty();
	};

	const updateFilterMany = (
		index,
		primaryColumn,
		primaryColumnValue,
		many = {}
	) => {
		const filterData = formFilters[index];

		if (filterData[primaryColumn] === primaryColumnValue) {
			return;
		}

		const _formFilters = formFilters.map((filter, _index) => {
			if (_index === index) {
				return { ...filter, ...many };
			}

			return filter;
		});

		dispatch({ type: 'SET_FORM_FILTERS', payload: _formFilters });

		setDirty();
	};

	const updateFilterType = (
		index,
		primaryColumn,
		primaryColumnValue,
		many = {}
	) => {
		const filterData = formFilters[index];

		if (filterData[primaryColumn] === primaryColumnValue) {
			return;
		}

		const defaultData = pick(
			filterDefaultData(),
			filterTypeDependentFields()
		);

		const _formFilters = formFilters.map((filter, _index) => {
			if (_index === index) {
				return { ...filter, ...defaultData, ...many };
			}

			return filter;
		});

		dispatch({ type: 'SET_FORM_FILTERS', payload: _formFilters });

		setDirty();
	};

	const handleFilterTypeChange = (selectedItem, key, index) => {
		const { value, type, taxHierarchical } = selectedItem;

		// Also remove the server side field key error.

		if ('taxonomy' === type) {
			// Also reset the display type.

			updateFilterType(index, type, value, {
				[key]: type,
				type_error: '',
				field_key_error_: '',
				taxonomy: value,
				taxHierarchical: taxHierarchical ? '1' : '',
				display_type: 'checkbox',
			});

			return;
		}

		updateFilterType(index, key, value, {
			[key]: value,
			type_error: '',
			field_key_error_: '',
		});
	};

	const handleFilterKeyChange = (value, key, index) => {
		const filterKey = wpFeSanitizeTitle(value);

		// Remove both client and server side errors when changed.
		const many = {
			[key]: filterKey,
			field_key_error: '',
			field_key_error_: '',
		};

		// if (filterKey && formFilters[index]['field_key_error']) {
		// 	many['field_key_error'] = '';
		// }

		updateFilterMany(index, [key], filterKey, many);
	};

	const handleMetaKeyChange = (selectedItem, key, index) => {
		const value = selectedItem.value;
		const many = { [key]: value };

		if (value && formFilters[index]['meta_key_error']) {
			many['meta_key_error'] = '';
		}

		updateFilterMany(index, [key], value, many);
	};

	const handleHierarchyChange = (_value, key, index) => {
		const filterData = formFilters[index];
		const value = _value ? '1' : '';

		if ('entry' === filterData['order_terms_by']) {
			updateFilterMany(index, key, value, {
				[key]: value,
				order_terms_by: 'default',
			});
		} else {
			updateFilter(index, key, value);
		}
	};

	const handleGetOptionsChange = (e, key, index) => {
		const value = e.target.value;
		const filterData = formFilters[index];

		if ('automatically' !== value) {
			updateFilter(index, key, value);

			return;
		}

		const { type, value_type } = filterData;

		if ('taxonomy' === type && 'entry' === filterData['order_terms_by']) {
			updateFilterMany(index, key, value, {
				[key]: value,
				order_terms_by: 'default',
			});
		} else if (
			'post-meta' === type &&
			'text' === value_type &&
			manualEntryOrderTypes().includes(filterData['options_order_by'])
		) {
			updateFilterMany(index, key, value, {
				[key]: value,
				options_order_by: 'none',
			});
		} else if (
			'post-author' === type &&
			'entry' === filterData['post_author_order_by']
		) {
			updateFilterMany(index, key, value, {
				[key]: value,
				post_author_order_by: 'default',
			});
		} else {
			updateFilter(index, key, value);
		}
	};

	const handleRadioChange = (e, key, index) => {
		const value = e.target.value;

		updateFilter(index, key, value);
	};

	const handleCheckboxChange = (value, key, index) => {
		const _value = value ? '1' : '';

		updateFilter(index, key, _value);
	};

	const handleTextFieldChange = (value, key, index) => {
		updateFilter(index, key, value);
	};

	const handleToggleGroupChange = (value, key, index) => {
		updateFilter(index, key, value);
	};

	const handleSelectChange = (selectedItem, key, index) => {
		updateFilter(index, key, selectedItem.value);
	};

	const handleSelectTermChange = (selected, key, index) => {
		updateFilter(index, key, selected);
	};

	const handleManualOptionsChange = (value, key, index, makeDirty = true) => {
		const _formFilters = formFilters.map((filter, _index) => {
			if (_index === index) {
				return { ...filter, [key]: value };
			}

			return filter;
		});

		dispatch({ type: 'SET_FORM_FILTERS', payload: _formFilters });

		if (makeDirty) {
			setDirty();
		}
	};

	return {
		handleFilterTypeChange,
		handleFilterKeyChange,
		handleMetaKeyChange,
		handleHierarchyChange,
		handleGetOptionsChange,
		handleCheckboxChange,
		handleRadioChange,
		handleTextFieldChange,
		handleToggleGroupChange,
		handleSelectChange,
		handleSelectTermChange,
		handleManualOptionsChange,
	};
};

export default useFormFilterData;
