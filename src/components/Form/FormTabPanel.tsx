import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import FormFilters from './FormFilters';
import FormSettings from './FormSettings';
import CustomTabPanel from '../CustomTabPanel';
import { useDispatch, useSelect } from '@wordpress/data';
import store from '../../store/form';

const FormTabPanel = () => {
	const currentTab = useSelect(
		( select ) => select( store ).getCurrentTab(),
		[],
	);

	// Reading getFilters() kicks off the store's getFilters resolver (the GET +
	// hydrate); its resolution status is the editor's loading state.
	const isLoading = useSelect( ( select ) => {
		select( store ).getFilters();

		return ! ( select( store ) as any ).hasFinishedResolution(
			'getFilters',
		);
	}, [] );

	const filterStates = useSelect(
		( select ) => select( store ).getFilterStates(),
		[],
	);

	const { setFilterStates, setCurrentTab } = useDispatch( store );

	const handleTabChange = ( newTab: string ) => setCurrentTab( newTab );

	// Reset the accordion and tab states of form filters when moving to the 'settings' tab.
	useEffect( () => {
		if ( 'settings' === currentTab ) {
			const newStates: Record< string, any > = {};

			for ( const id in filterStates ) {
				newStates[ id ] = {
					accordionStatus: false,
					currentTab: 'general',
				};
			}

			setFilterStates( newStates );
		}
	}, [ currentTab ] );

	return (
		<CustomTabPanel
			currentTab={ currentTab }
			onChangeTab={ handleTabChange }
			className='__tab_panel __form_tab_panel'
			activeClass='active-tab'
			tabs={ [
				{
					name: 'filters',
					title: __( 'Filters', 'wc-ajax-product-filter' ),
				},
				{
					name: 'settings',
					title: __( 'Settings', 'wc-ajax-product-filter' ),
				},
			] }
		>
			{ ( { name }: { name: string } ) => {
				if ( isLoading ) {
					return (
						<div className='__loader'>
							<Spinner />
						</div>
					);
				} else {
					if ( name === 'filters' ) {
						return <FormFilters />;
					} else if ( name === 'settings' ) {
						return (
							<div className='__form_settings'>
								<FormSettings />
							</div>
						);
					}
				}
			} }
		</CustomTabPanel>
	);
};

export default FormTabPanel;
