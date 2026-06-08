import { __ } from '@wordpress/i18n';
import { find } from 'lodash';
import Radio from '../../../Field/Radio';
import Select from '../../../Field/Select';
import useFormFilterData from '../../useFormFilterData';
import {
	authorOrderByOptions,
	authorProOrderByOptions,
	metaValuesOrderByOptions,
	metaValuesProOrderByOptions,
	methodsOfGettingOptions,
	orderDirectionOptions,
	orderTypeOptions,
	termsOrderByOptions,
	termsProOrderByOptions,
} from '../../utils';
import { useSelect } from '@wordpress/data';
import store from '../../../../store/form';

const useFields = ( index: any ) => {
	const { handleGetOptionsChange, handleRadioChange, handleSelectChange } =
		useFormFilterData();

	const filter = useSelect(
		( select ) => select( store ).getFilter( index ),
		[ index ],
	);

	const { get_options } = filter;

	const getOptionsField = ( id: string ) => {
		return (
			<Radio
				id={ id }
				index={ index }
				label={ __( 'Get Options', 'wc-ajax-product-filter' ) }
				description={ __(
					'Determines whether you want the options to be obtained automatically or if you prefer to add them manually.',
				) }
				options={ methodsOfGettingOptions() }
				value={ filter[ id ] }
				onChange={ handleGetOptionsChange }
			/>
		);
	};

	const orderByField = ( id: string ) => {
		const isManualEntry = 'manual_entry' === get_options;
		let options: any;
		let proOptions: any;
		let value;

		if ( 'order_terms_by' === id ) {
			options = termsOrderByOptions( isManualEntry );
			proOptions = termsProOrderByOptions();
		} else if ( 'options_order_by' === id ) {
			options = metaValuesOrderByOptions( isManualEntry );
			proOptions = metaValuesProOrderByOptions();
		} else if ( 'post_author_order_by' === id ) {
			options = authorOrderByOptions( isManualEntry );
			proOptions = authorProOrderByOptions();
		}

		value = options.find(
			( option: any ) => option.value === filter[ id ],
		);

		if ( ! WCAPF_PRO ) {
			if ( proOptions.includes( filter[ id ] ) ) {
				const _proOptions = find( options, { proGroup: true } );
				const proOptions = _proOptions.options;

				value = proOptions.find(
					( option: any ) => option.value === filter[ id ],
				);
			}
		}

		return (
			<Select
				id={ id }
				index={ index }
				label={ __( 'Order By', 'wc-ajax-product-filter' ) }
				description={ __(
					'Select the criteria by which you want the items to be ordered.',
					'wc-ajax-product-filter',
				) }
				options={ options }
				value={ value }
				onChange={ handleSelectChange }
				renderAsFormField
			/>
		);
	};

	const orderDirectionField = ( id: string ) => {
		return (
			<Radio
				id={ id }
				index={ index }
				label={ __( 'Order Direction', 'wc-ajax-product-filter' ) }
				description={ __(
					'Whether to order options in ascending or descending order.',
					'wc-ajax-product-filter',
				) }
				options={ orderDirectionOptions() }
				value={ filter[ id ] }
				onChange={ handleRadioChange }
			/>
		);
	};

	const orderTypeField = ( id: string ) => {
		return (
			<Radio
				id={ id }
				index={ index }
				label={ __( 'Order Type', 'wc-ajax-product-filter' ) }
				description={ __(
					'Whether to arrange the options in alphabetical or numerical order.',
					'wc-ajax-product-filter',
				) }
				options={ orderTypeOptions() }
				value={ filter[ id ] }
				onChange={ handleRadioChange }
			/>
		);
	};

	return {
		getOptionsField,
		orderByField,
		orderDirectionField,
		orderTypeField,
	};
};

export default useFields;
