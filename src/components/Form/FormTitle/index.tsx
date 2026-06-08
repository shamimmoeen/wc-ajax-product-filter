import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { find, pick, has } from 'lodash';
import {
	removeCopiedToClipboardNotice,
	itemSavedSuccessNotice,
	itemSavedErrorNotice,
	removeItemSavedNotices,
	removeFilterDeletedNotices,
} from '../../notices';
import Title from './Title';
import PublishModal from '../../Modals/PublishModal';
import { GENERIC_ERROR_MESSAGE, proUpdateRequired } from '../../utils';
import {
	filterDefaultData,
	termsProOrderByOptions,
	taxonomyProLimitByOptions,
	authorProOrderByOptions,
	metaValuesProOrderByOptions,
} from '../utils';
import { defaultFormSettings, proVisibilityOptions } from '../../utilsForForm';
import ProUpdateModal from '../../Modals/ProUpdateModal';
import { useDispatch, useSelect } from '@wordpress/data';
import store from '../../../store/form';
import validateFormFilters from './validateFormFilters';

const FormTitle = () => {
	const [ publishModalOpen, setPublishModalOpen ] = useState( false );
	const [ ProUpdateModalOpen, setProUpdateModalOpen ] = useState( false );
	const [ loading, setLoading ] = useState( false );

	const isDirty = useSelect( ( select ) => select( store ).isDirty(), [] );
	const title = useSelect( ( select ) => select( store ).getTitle(), [] );
	const currentTab = useSelect(
		( select ) => select( store ).getCurrentTab(),
		[],
	);
	const filterStates = useSelect(
		( select ) => select( store ).getFilterStates(),
		[],
	);
	const formSettings = useSelect(
		( select ) => select( store ).getFormSettings(),
		[],
	);
	const formFilters = useSelect(
		( select ) => select( store ).getFilters(),
		[],
	);
	const filterKeys = useSelect(
		( select ) => select( store ).getFilterKeys(),
		[],
	);

	const {
		setTitle,
		markDirty,
		setFilterStates,
		setError,
		saveForm,
		setFilters,
		setCurrentTab,
	} = useDispatch( store );

	useEffect( () => {
		if ( ! isDirty ) {
			return;
		}

		removeItemSavedNotices();
		removeFilterDeletedNotices();
	}, [ isDirty ] );

	const handleTitleChange = ( value: string ) => {
		if ( title === value ) {
			return;
		}

		setTitle( value );
		markDirty();
	};

	const handleOpenPublishModal = () => {
		removeItemSavedNotices();

		setPublishModalOpen( true );
	};

	const handleClosePublishModal = () => {
		removeCopiedToClipboardNotice();

		setPublishModalOpen( false );
	};

	const handleOpenProUpdateModal = () => {
		setProUpdateModalOpen( true );
	};

	const handleCloseProUpdateModal = () => {
		setProUpdateModalOpen( false );
	};

	const removeProDataFromFilters = ( validatedFormFilters: any[] ) => {
		if ( WCAPF_PRO ) {
			return validatedFormFilters;
		}

		const sanitizedFilters: any[] = [];

		validatedFormFilters.forEach( ( filter: any ) => {
			const proData = [
				'grid_columns',
				'enable_swatch',
				'swatch_type',
				'swatch_with_label',
				'get_options',
				'manual_options',
				'parent_term',
				'direct_child_only',
				'number_range_enable_multiple_filter',
				'number_range_query_type',
				'number_range_select_all_items_label',
				'number_range_show_count',
				'number_get_options',
				'number_manual_options',
				'value_type',
				'value_decimal',
				'value_decimal_places',
				'date_input_format',
				'time_period_enable_multiple_filter',
				'time_period_query_type',
				'time_period_select_all_items_label',
				'time_period_show_count',
				'time_period_options',
				'options_order_type',
				'search_field_placeholder',
				'enable_visibility_rules',
				'visibility_rules',
			];

			const proTextDisplayTypes = [
				'color',
				'image',
				'hierarchy-select',
			];

			const proNumberDisplayTypes = [
				'range_checkbox',
				'range_radio',
				'range_select',
				'range_multiselect',
				'range_label',
			];

			const proDateDisplayTypes = [
				'time_period_checkbox',
				'time_period_radio',
				'time_period_select',
				'time_period_multiselect',
				'time_period_label',
			];

			if ( proTextDisplayTypes.includes( filter[ 'display_type' ] ) ) {
				proData.push( 'display_type' );
			}

			if (
				proNumberDisplayTypes.includes(
					filter[ 'number_display_type' ],
				)
			) {
				proData.push( 'number_display_type' );
			}

			if (
				proDateDisplayTypes.includes( filter[ 'date_display_type' ] )
			) {
				proData.push( 'date_display_type' );
			}

			if (
				termsProOrderByOptions().includes( filter[ 'order_terms_by' ] )
			) {
				proData.push( 'order_terms_by' );
			}

			if (
				taxonomyProLimitByOptions().includes(
					filter[ 'limit_options' ],
				)
			) {
				proData.push( 'limit_options' );
			}

			if (
				metaValuesProOrderByOptions().includes(
					filter[ 'options_order_by' ],
				)
			) {
				proData.push( 'options_order_by' );
			}

			if (
				authorProOrderByOptions().includes(
					filter[ 'post_author_order_by' ],
				)
			) {
				proData.push( 'post_author_order_by' );
			}

			if ( 'grid' === filter[ 'native_display_type_layout' ] ) {
				proData.push( 'native_display_type_layout' );
			}

			if ( 'grid' === filter[ 'custom_display_type_layout' ] ) {
				proData.push( 'custom_display_type_layout' );
			}

			const defaultData = pick( filterDefaultData(), proData );

			const sanitized = { ...filter, ...defaultData };

			sanitizedFilters.push( sanitized );
		} );

		return sanitizedFilters;
	};

	const removeProDataFromSettings = () => {
		if ( WCAPF_PRO ) {
			return formSettings;
		}

		const proSettings = [
			'form_locations',
			'priority',
			'form_layout',
			'columns_per_row',
			'show_form_on_top_of_products',
			'filter_mode',
			'show_clear_btn',
		];

		const proVisibilityOptionKeys = proVisibilityOptions.map(
			( option ) => option.value,
		);

		if (
			proVisibilityOptionKeys.includes(
				formSettings[ 'form_visibility' ],
			)
		) {
			proSettings.push( 'form_visibility' );
		}

		const defaultSettings = pick( defaultFormSettings(), proSettings );

		return { ...formSettings, ...defaultSettings };
	};

	const handleSaveForm = async () => {
		removeItemSavedNotices();

		setError( '' );

		const { isValid, validatedFormFilters, invalidFormFilters } =
			validateFormFilters( formFilters, filterKeys );

		setFilters( validatedFormFilters );

		if ( ! isValid ) {
			const newStates: Record< string, any > = {};

			for ( const id in filterStates ) {
				if ( invalidFormFilters.map( String ).includes( id ) ) {
					newStates[ id ] = {
						accordionStatus: true,
						currentTab: 'general',
					};
				} else {
					newStates[ id ] = {
						...filterStates[ id ],
						accordionStatus: false,
					};
				}
			}

			setFilterStates( newStates );
			setError( GENERIC_ERROR_MESSAGE );

			if ( 'filters' !== currentTab ) {
				setCurrentTab( 'filters' );
			}

			return;
		}

		setLoading( true );

		try {
			await saveForm( {
				title,
				filters: removeProDataFromFilters( validatedFormFilters ),
				settings: removeProDataFromSettings(),
			} );

			wcapf_admin_params.dirty = false;
			itemSavedSuccessNotice(
				__( 'Form saved successfully', 'wc-ajax-product-filter' ),
			);
		} catch ( err ) {
			const errorsData = ( err as any )?.data.errors;

			if ( ! errorsData ) {
				itemSavedErrorNotice( ( err as Error ).message );
				return;
			}

			setError( GENERIC_ERROR_MESSAGE );

			const formFiltersWithErrors = formFilters.map(
				( formFilter: any, index: number ) => {
					const error = find( errorsData, { order: index } );

					if ( error ) {
						const { key, message } = error;
						return {
							...formFilter,
							[ key ]: message,
							type_error: '',
							meta_key_error: '',
							field_key_error: '',
						};
					}

					return formFilter;
				},
			);

			setFilters( formFiltersWithErrors );

			const newStates: Record< string, any > = {};

			for (
				let index = 0;
				index < formFiltersWithErrors.length;
				index++
			) {
				const error = find( errorsData, { order: index } );
				const filter = formFiltersWithErrors[ index ];
				const filterId = has( filter, 'isNew' )
					? filter[ 'uniqueIndex' ]
					: filter[ 'id' ];

				newStates[ filterId ] = error
					? { accordionStatus: true, currentTab: 'general' }
					: { ...filterStates[ filterId ], accordionStatus: false };
			}

			setFilterStates( newStates );

			if ( 'filters' !== currentTab ) {
				setCurrentTab( 'filters' );
			}
		} finally {
			setLoading( false );
		}
	};

	const handleSubmit = () => {
		if ( isDirty ) {
			if ( proUpdateRequired() ) {
				handleOpenProUpdateModal();
			} else {
				handleSaveForm();
			}
		} else {
			handleOpenPublishModal();
		}
	};

	return (
		<>
			<Title
				loading={ loading }
				handleTitleChange={ handleTitleChange }
				handleSubmit={ handleSubmit }
			/>

			<PublishModal
				isOpen={ publishModalOpen }
				closeModal={ handleClosePublishModal }
			/>

			<ProUpdateModal
				isOpen={ ProUpdateModalOpen }
				closeModal={ handleCloseProUpdateModal }
			/>
		</>
	);
};

export default FormTitle;
