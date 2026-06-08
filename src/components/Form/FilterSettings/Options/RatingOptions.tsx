import { __ } from '@wordpress/i18n';
import ManualOptions from './ManualOptions';
import useFields from './useFields';
import { useSelect } from '@wordpress/data';
import store from '../../../../store/form';

const RatingOptions = ( { index }: { index: number } ) => {
	const filter = useSelect(
		( select ) => select( store ).getFilter( index ),
		[ index ],
	);

	const { getOptionsField } = useFields( index );

	const { number_get_options } = filter;

	const manualOptions = () => {
		if ( 'manual_entry' === number_get_options ) {
			return <ManualOptions index={ index } />;
		}
	};

	return (
		<>
			{ getOptionsField( 'number_get_options' ) }

			{ manualOptions() }
		</>
	);
};

export default RatingOptions;
