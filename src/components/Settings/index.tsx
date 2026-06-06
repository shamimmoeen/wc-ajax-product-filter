import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { Button } from '@wordpress/components';
import { omit, pick, find } from 'lodash';
import store from '../../store/settings';
import validateFilterKeys from './validateFilterKeys';
import Sidebar from '../Sidebar';
import TopBar from '../TopBar';
import Notifications from '../Notifications';
import { SaveIcon, SettingsIcon } from '../SVGIcons';
import {
	removeSettingsSavedNotices,
	settingsSavedErrorNotice,
	settingsSavedSuccessNotice,
} from '../notices';
import General from './Tabs/General';
import FilterKeys from './Tabs/FilterKeys';
import Miscellaneous from './Tabs/Miscellaneous';
import Appearance from './Tabs/Appearance';
import Integration from './Tabs/Integration';
import CustomTabPanel from '../CustomTabPanel';
import LoaderScrollTo from './Tabs/LoaderScrollTo';
import Phrases from './Tabs/Phrases';
import { GENERIC_ERROR_MESSAGE, proUpdateRequired } from '../utils';
import { defaultSettings } from './utils';
import ProUpdateModal from '../Modals/ProUpdateModal';
import { Icon } from '@wordpress/icons';
import type { FilterKey } from '../../store/settings/types';

const tabs = [
	{
		name: 'general',
		title: __( 'General', 'wc-ajax-product-filter' ),
	},
	{
		name: 'integration',
		title: __( 'Integration', 'wc-ajax-product-filter' ),
	},
	{
		name: 'appearance',
		title: __( 'Appearance', 'wc-ajax-product-filter' ),
	},
	{
		name: 'loader-scrollTo',
		title: __( 'Loader & Scroll To', 'wc-ajax-product-filter' ),
	},
	{
		name: 'filter-keys',
		title: __( 'Filter Keys', 'wc-ajax-product-filter' ),
	},
	{
		name: 'others',
		title: __( 'Phrases', 'wc-ajax-product-filter' ),
	},
	{
		name: 'miscellaneous',
		title: __( 'Miscellaneous', 'wc-ajax-product-filter' ),
	},
];

const Settings = () => {
	const settings = useSelect(
		( select ) => select( store ).getSettings(),
		[],
	);
	const globalFilterKeys = useSelect(
		( select ) => select( store ).getGlobalFilterKeys(),
		[],
	);
	const filterKeysChanged = useSelect(
		( select ) => select( store ).getFilterKeysChanged(),
		[],
	);
	const isDirty = useSelect( ( select ) => select( store ).isDirty(), [] );

	const { setGlobalFilterKeys, setError, saveSettings } =
		useDispatch( store );

	const [ currentTab, setCurrentTab ] = useState( 'general' );
	const [ saveBtnBusy, setSaveBtnBusy ] = useState( false );
	const [ ProUpdateModalOpen, setProUpdateModalOpen ] = useState( false );

	const handleOpenProUpdateModal = () => {
		setProUpdateModalOpen( true );
	};

	const handleCloseProUpdateModal = () => {
		setProUpdateModalOpen( false );
	};

	const handleTabChange = ( newTab: string ) => setCurrentTab( newTab );

	useEffect( () => {
		if ( ! isDirty ) {
			return;
		}

		removeSettingsSavedNotices();
	}, [ isDirty ] );

	const sanitizedSettings = () => {
		if ( WCAPF_PRO ) {
			return omit( settings, [ 'loading_image_src' ] );
		}

		const proSettings = [];

		if ( 'disable' === settings[ 'remove_empty' ] ) {
			proSettings.push( 'remove_empty' );
		}

		if ( 'none' === settings[ 'loading_animation' ] ) {
			proSettings.push( 'loading_animation' );
		}

		if ( 'custom' === settings[ 'loading_icon' ] ) {
			proSettings.push( 'loading_icon' );
		}

		const defaults = pick( defaultSettings(), proSettings );
		const merged = { ...settings, ...defaults };

		return omit( merged, [
			'remove_empty_filters',
			'child_terms_only',
			'slide_out_panel_position',
			'loading_image',
			'loading_image_src',
			'loading_overlay_color',
			'scroll_on',
			'disable_scroll_animation',
			'more_selectors',
			'multiple_form_locations',
			'filter_keys_order',
		] );
	};

	const handleSaveSettings = async () => {
		if ( proUpdateRequired() ) {
			handleOpenProUpdateModal();
			return;
		}

		setError( '' );

		const { isValid, validatedFilterKeys } =
			validateFilterKeys( globalFilterKeys );

		setGlobalFilterKeys( validatedFilterKeys );

		if ( ! isValid ) {
			setError( GENERIC_ERROR_MESSAGE );
			if ( 'filter-keys' !== currentTab ) {
				setCurrentTab( 'filter-keys' );
			}
			return;
		}

		setSaveBtnBusy( true );

		try {
			await saveSettings( {
				settings: sanitizedSettings(),
				filter_keys: validatedFilterKeys,
				update_filter_keys: filterKeysChanged ? '1' : '',
			} );

			wcapf_admin_params.dirty = false;

			settingsSavedSuccessNotice(
				__( 'Settings saved successfully', 'wc-ajax-product-filter' ),
			);
		} catch ( err ) {
			const errorsData = ( err as any )?.data?.errors;

			if ( ! errorsData ) {
				settingsSavedErrorNotice( ( err as Error ).message );
				return;
			}

			setError( GENERIC_ERROR_MESSAGE );

			const filterKeys = globalFilterKeys.map( ( filterKey, index ) => {
				const error = find( errorsData, { order: index } );

				if ( error ) {
					const { key, message } = error;
					return {
						...filterKey,
						[ key ]: message,
						field_key_error: '',
					};
				}

				return { ...filterKey, field_key_error: '' };
			} );

			setGlobalFilterKeys( filterKeys as FilterKey[] );

			if ( 'filter-keys' !== currentTab ) {
				setCurrentTab( 'filter-keys' );
			}
		} finally {
			setSaveBtnBusy( false );
		}
	};

	return (
		<div className='__wcapf_admin'>
			<TopBar view={ 'settings' } />

			<ProUpdateModal
				isOpen={ ProUpdateModalOpen }
				closeModal={ handleCloseProUpdateModal }
			/>

			<div className='__wcapf_layout'>
				<div className='__main'>
					<div className='__content'>
						<div className='__settings_wrapper'>
							<div className='__settings_header'>
								<h2>
									<Icon icon={ SettingsIcon } />
									{ __(
										'Settings',
										'wc-ajax-product-filter',
									) }
								</h2>
								<Button
									variant={
										isDirty ? 'primary' : 'secondary'
									}
									disabled={ ! isDirty || saveBtnBusy }
									isBusy={ saveBtnBusy }
									onClick={ handleSaveSettings }
								>
									<Icon icon={ SaveIcon } />
									{ __( 'Save', 'wc-ajax-product-filter' ) }
								</Button>
							</div>

							<CustomTabPanel
								currentTab={ currentTab }
								onChangeTab={ handleTabChange }
								className='__tab_panel __settings_tab'
								activeClass='active-tab'
								tabs={ tabs }
							>
								{ ( { name }: { name: string } ) => {
									if ( 'general' === name ) {
										return <General />;
									} else if ( 'integration' === name ) {
										return <Integration />;
									} else if ( 'appearance' === name ) {
										return <Appearance />;
									} else if ( 'loader-scrollTo' === name ) {
										return <LoaderScrollTo />;
									} else if ( 'filter-keys' === name ) {
										return <FilterKeys />;
									} else if ( 'others' === name ) {
										return <Phrases />;
									} else if ( 'miscellaneous' === name ) {
										return <Miscellaneous />;
									}
								} }
							</CustomTabPanel>
						</div>
					</div>

					<Sidebar />
				</div>

				<Notifications />
			</div>
		</div>
	);
};

export default Settings;
