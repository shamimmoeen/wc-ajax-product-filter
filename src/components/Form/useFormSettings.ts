import { useSelect, useDispatch } from '@wordpress/data';
import store from '../../store/form';
import { removeCopiedToClipboardNotice } from '../notices';

const useFormSettings = () => {
	const { mergeFormSettings, markDirty } = useDispatch( store );

	const formSettings = useSelect(
		( select ) => select( store ).getFormSettings(),
		[],
	);

	const handleRadioChange = ( e: any, key: string ) => {
		const value = e.target.value;

		updateFormSettings( key, value );
	};

	const handleCheckboxChange = ( value: boolean, key: string ) => {
		const _value = value ? '1' : '';

		updateFormSettings( key, _value );
	};

	const handleTextFieldChange = ( value: string, key: string ) => {
		updateFormSettings( key, value );
	};

	const handleSelectChange = ( selectedItem: any, key: string ) => {
		updateFormSettings( key, selectedItem.value );
	};

	const handleFormLocations = ( value: any ) => {
		updateFormSettings( 'form_locations', value );
	};

	const updateFormSettings = ( key: string, value: any ) => {
		if ( value === formSettings[ key ] ) {
			return;
		}

		mergeFormSettings( { [ key ]: value } );
		removeCopiedToClipboardNotice();
		markDirty();
	};

	return {
		handleRadioChange,
		handleCheckboxChange,
		handleTextFieldChange,
		handleSelectChange,
		handleFormLocations,
	};
};

export default useFormSettings;
