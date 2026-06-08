import ValueTypeNumber from './ValueTypeNumber';
import TaxonomyOptions from './TaxonomyOptions';
import RatingOptions from './RatingOptions';
import ManualOptions from './ManualOptions';
import ValueTypeText from './ValueTypeText';
import ValueTypeDate from './ValueTypeDate';
import PostAuthorOptions from './PostAuthorOptions';

/**
 * To place the popover outside the table element.
 */
import { Popover, SlotFillProvider } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import store from '../../../../store/form';

const Options = ( { index }: { index: number } ) => {
	const filter = useSelect(
		( select ) => select( store ).getFilter( index ),
		[ index ],
	);

	const { type: filterType, value_type } = filter;

	const renderFields = () => {
		let fields;

		if ( 'taxonomy' === filterType ) {
			if ( 'number' === value_type ) {
				fields = <ValueTypeNumber index={ index } />;
			} else {
				fields = <TaxonomyOptions index={ index } />;
			}
		} else if ( 'price' === filterType ) {
			fields = <ValueTypeNumber index={ index } />;
		} else if ( 'rating' === filterType ) {
			fields = <RatingOptions index={ index } />;
		} else if (
			'product-status' === filterType ||
			'sort-by' === filterType ||
			'per-page' === filterType
		) {
			fields = <ManualOptions index={ index } />;
		} else if ( 'post-meta' === filterType ) {
			if ( 'text' === value_type ) {
				fields = <ValueTypeText index={ index } />;
			} else if ( 'number' === value_type ) {
				fields = <ValueTypeNumber index={ index } />;
			} else if ( 'date' === value_type ) {
				fields = <ValueTypeDate index={ index } />;
			}
		} else if ( 'post-author' === filterType ) {
			fields = <PostAuthorOptions index={ index } />;
		}

		return fields;
	};

	const PopoverSlot = ( Popover as any ).Slot;

	return (
		<SlotFillProvider>
			{ renderFields() }

			<PopoverSlot name='popover-slot-for-options-table' />
		</SlotFillProvider>
	);
};

export default Options;
