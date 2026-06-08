import { useDispatch, useSelect } from '@wordpress/data';
import { pick } from 'lodash';
import store from '../../store/form';
import { filterDefaultData, filterTypeDependentFields } from './utils';

const useFormFilterData = () => {
	const formFilters = useSelect(
		( select ) => select( store ).getFilters(),
		[],
	);

	const { updateFilter, markDirty } = useDispatch( store );

	const updateOne = ( index: number, key: string, value: any ) => {
		if ( formFilters[ index ][ key ] === value ) {
			return;
		}

		updateFilter( index, { [ key ]: value } );
		markDirty();
	};

	const updateMany = (
		index: number,
		primaryColumn: any,
		primaryColumnValue: any,
		many: any = {},
	) => {
		if ( formFilters[ index ][ primaryColumn ] === primaryColumnValue ) {
			return;
		}

		updateFilter( index, many );
		markDirty();
	};

	const updateType = (
		index: number,
		primaryColumn: any,
		primaryColumnValue: any,
		many: any = {},
	) => {
		if ( formFilters[ index ][ primaryColumn ] === primaryColumnValue ) {
			return;
		}

		const defaultData = pick(
			filterDefaultData(),
			filterTypeDependentFields(),
		);

		const partial: any = { ...defaultData, ...many };

		if ( [ 'sort-by', 'per-page' ].includes( primaryColumnValue ) ) {
			partial[ 'display_type' ] = 'radio';
		}

		updateFilter( index, partial );
		markDirty();
	};

	const handleFilterTypeChange = (
		selectedItem: any,
		key: string,
		index: number,
	) => {
		const { value, type, taxHierarchical } = selectedItem;

		if ( 'taxonomy' === type ) {
			updateType( index, type, value, {
				[ key ]: type,
				type_error: '',
				field_key_error_: '',
				taxonomy: value,
				taxHierarchical: taxHierarchical ? '1' : '',
				display_type: 'checkbox',
			} );

			return;
		} else if ( 'component' === type ) {
			updateType( index, type, value, {
				[ key ]: type,
				component: value,
				type_error: '',
				field_key_error_: '',
			} );

			return;
		}

		updateType( index, key, value, {
			[ key ]: value,
			type_error: '',
			field_key_error_: '',
		} );
	};

	const handleFilterKeyChange = (
		value: string,
		key: string,
		index: number,
	) => {
		const filterKey = value;

		// Remove both client and server side errors when changed.
		const many = {
			[ key ]: filterKey,
			field_key_error: '',
			field_key_error_: '',
		};

		updateMany( index, [ key ], filterKey, many );
	};

	const handleMetaKeyChange = (
		selectedItem: any,
		key: string,
		index: number,
	) => {
		const value = selectedItem.value;
		const many = { [ key ]: value };

		if ( value && formFilters[ index ][ 'meta_key_error' ] ) {
			many[ 'meta_key_error' ] = '';
		}

		updateMany( index, [ key ], value, many );
	};

	const handleGetOptionsChange = ( e: any, key: string, index: number ) => {
		const value = e.target.value;
		const filterData = formFilters[ index ];

		if ( 'automatically' !== value ) {
			updateOne( index, key, value );

			return;
		}

		const { type, value_type } = filterData;

		if (
			'post-meta' === type &&
			'text' === value_type &&
			'include' === filterData[ 'options_order_by' ]
		) {
			updateMany( index, key, value, {
				[ key ]: value,
				options_order_by: 'none',
			} );
		} else {
			updateOne( index, key, value );
		}
	};

	const handleRadioChange = ( e: any, key: string, index: number ) => {
		const value = e.target.value;

		updateOne( index, key, value );
	};

	const handleCheckboxChange = (
		value: boolean,
		key: string,
		index: number,
	) => {
		const _value = value ? '1' : '';

		updateOne( index, key, _value );
	};

	const handleTextFieldChange = (
		value: string,
		key: string,
		index: number,
	) => {
		updateOne( index, key, value );
	};

	const handleToggleGroupChange = (
		value: any,
		key: string,
		index: number,
	) => {
		updateOne( index, key, value );
	};

	const handleSelectChange = (
		selectedItem: any,
		key: string,
		index: number,
	) => {
		updateOne( index, key, selectedItem.value );
	};

	const handleSelectTermChange = (
		selected: any,
		key: string,
		index: number,
	) => {
		updateOne( index, key, selected );
	};

	const handleManualOptionsChange = (
		value: any,
		key: string,
		index: number,
		makeDirty = true,
	) => {
		updateFilter( index, { [ key ]: value } );

		if ( makeDirty ) {
			markDirty();
		}
	};

	const handleShowHierarchyChange = (
		value: boolean,
		key: string,
		index: number,
	) => {
		const _value = value ? '1' : '';

		const many = { [ key ]: _value };

		if (
			_value &&
			'soft_limit' === formFilters[ index ][ 'enable_reduce_height' ]
		) {
			many[ 'enable_reduce_height' ] = 'no';
		}

		updateMany( index, [ key ], _value, many );
	};

	const handleVisibilityRulesChange = (
		rules: any,
		key: string,
		index: number,
	) => {
		updateOne( index, key, rules );
	};

	return {
		handleFilterTypeChange,
		handleFilterKeyChange,
		handleMetaKeyChange,
		handleGetOptionsChange,
		handleCheckboxChange,
		handleRadioChange,
		handleTextFieldChange,
		handleToggleGroupChange,
		handleSelectChange,
		handleSelectTermChange,
		handleManualOptionsChange,
		handleShowHierarchyChange,
		handleVisibilityRulesChange,
	};
};

export default useFormFilterData;
