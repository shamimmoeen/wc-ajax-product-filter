import { useSelect, useDispatch } from '@wordpress/data';
import store from '../../store/settings';

export default function useSettingsData() {
	const {
		mergeSettings,
		setDirty: setDirtyFlag,
		setError,
	} = useDispatch( store );

	const settings = useSelect(
		( select ) => select( store ).getSettings(),
		[],
	);
	const isDirty = useSelect( ( select ) => select( store ).isDirty(), [] );
	const saveError = useSelect( ( select ) => select( store ).getError(), [] );

	const setDirty = () => {
		if ( ! isDirty ) {
			setDirtyFlag( true );
			wcapf_admin_params.dirty = true;
		}

		if ( saveError ) {
			setError( '' );
		}
	};

	const updateSingleSettings = ( key: string, value: any ) => {
		const prevValue = settings[ key ];

		if ( value === prevValue ) {
			return;
		}

		mergeSettings( { [ key ]: value } );
		setDirty();
	};

	const handleRadioChange = ( e: any, key: string ) => {
		const value = e.target.value;

		updateSingleSettings( key, value );
	};

	const handleCheckboxChange = ( value: boolean, key: string ) => {
		const _value = value ? '1' : '';

		updateSingleSettings( key, _value );
	};

	const handleTextFieldChange = ( value: string, key: string ) => {
		updateSingleSettings( key, value );
	};

	const handleSelectChange = ( selectedItem: any, key: string ) => {
		updateSingleSettings( key, selectedItem.value );
	};

	const handleImageChange = ( attachment: any, key: string ) => {
		const imageId = attachment.id;
		const imageUrl = attachment.sizes.full.url;

		if ( imageId === parseInt( settings[ key ] ) ) {
			return;
		}

		mergeSettings( { [ key ]: imageId, [ `${ key }_src` ]: imageUrl } );
		setDirty();
	};

	const handleImageRemove = ( key: string ) => {
		mergeSettings( { [ key ]: '', [ `${ key }_src` ]: '' } );
		setDirty();
	};

	const handleAuthorRolesChange = ( selected: any, key: string ) => {
		updateSingleSettings( key, selected );
	};

	return {
		setDirty,
		handleRadioChange,
		handleCheckboxChange,
		handleTextFieldChange,
		handleSelectChange,
		handleImageChange,
		handleImageRemove,
		handleAuthorRolesChange,
	};
}
