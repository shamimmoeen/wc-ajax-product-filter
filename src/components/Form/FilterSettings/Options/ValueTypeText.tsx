import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import ManualOptions from './ManualOptions';
import ManualOptionsModal from './ManualOptionsModal';
import useFields from './useFields';
import { useSelect } from '@wordpress/data';
import store from '../../../../store/form';

const ValueTypeText = ( { index }: { index: number } ) => {
	const {
		getOptionsField,
		orderByField,
		orderDirectionField,
		orderTypeField,
	} = useFields( index );

	const [ open, setOpen ] = useState( false );
	const openModal = () => setOpen( true );
	const closeModal = () => setOpen( false );

	const filter = useSelect(
		( select ) => select( store ).getFilter( index ),
		[ index ],
	);

	const { get_options, options_order_by } = filter;

	const _orderDirectionField = () => {
		if ( 'none' !== options_order_by ) {
			return orderDirectionField( 'options_order_dir' );
		}
	};

	const _orderTypeField = () => {
		const allowed = [ 'label', 'value' ];

		if ( allowed.includes( options_order_by ) ) {
			return orderTypeField( 'options_order_type' );
		}
	};

	const manualOptions = () => {
		if ( 'manual_entry' === get_options ) {
			return (
				<>
					<ManualOptions index={ index } openModal={ openModal } />

					<ManualOptionsModal
						index={ index }
						open={ open }
						closeModal={ closeModal }
					/>
				</>
			);
		}
	};

	return (
		<>
			{ getOptionsField( 'get_options' ) }

			{ orderByField( 'options_order_by' ) }

			{ _orderDirectionField() }

			{ _orderTypeField() }

			{ manualOptions() }
		</>
	);
};

export default ValueTypeText;
