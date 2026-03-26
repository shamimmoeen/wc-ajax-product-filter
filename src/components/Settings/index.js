import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { omit, pick, find } from 'lodash';
import Sidebar from '../Sidebar';
import TopBar from '../TopBar';
import Notifications from '../Notifications';
import { useSettings } from './SettingsContext';
import { SaveIcon, SettingsIcon } from '../SVGIcons';
import axios from 'axios';
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
import {
	FILTER_KEY_IN_USE_MESSAGE,
	GENERIC_ERROR_MESSAGE,
	getNonceToken,
	proUpdateRequired,
} from '../utils';
import { defaultSettings } from './utils';
import ProUpdateModal from '../Modals/ProUpdateModal';
import { Icon } from '@wordpress/icons';

const tabs = [
	{
		name: 'general',
		title: __('General', 'wc-ajax-product-filter'),
	},
	{
		name: 'integration',
		title: __('Integration', 'wc-ajax-product-filter'),
	},
	{
		name: 'appearance',
		title: __('Appearance', 'wc-ajax-product-filter'),
	},
	{
		name: 'loader-scrollTo',
		title: __('Loader & Scroll To', 'wc-ajax-product-filter'),
	},
	{
		name: 'filter-keys',
		title: __('Filter Keys', 'wc-ajax-product-filter'),
	},
	{
		name: 'others',
		title: __('Phrases', 'wc-ajax-product-filter'),
	},
	{
		name: 'miscellaneous',
		title: __('Miscellaneous', 'wc-ajax-product-filter'),
	},
];

const Settings = () => {
	const { state, dispatch } = useSettings();

	const {
		isDirty,
		currentTab,
		settings,
		globalFilterKeys,
		filterKeysChanged,
	} = state;

	const [saveBtnBusy, setSaveBtnBusy] = useState(false);
	const [ProUpdateModalOpen, setProUpdateModalOpen] = useState(false);

	const handleOpenProUpdateModal = () => {
		setProUpdateModalOpen(true);
	};

	const handleCloseProUpdateModal = () => {
		setProUpdateModalOpen(false);
	};

	const handleTabChange = (newTab) => {
		dispatch({ type: 'SET_CURRENT_TAB', payload: newTab });
	};

	useEffect(() => {
		if (!isDirty) {
			return;
		}

		removeSettingsSavedNotices();
	}, [isDirty]);

	const sanitizedSettings = () => {
		if (WCAPF_PRO) {
			return omit(settings, ['loading_image_src']);
		}

		const proSettings = [];

		if ('disable' === settings['remove_empty']) {
			proSettings.push('remove_empty');
		}

		if ('none' === settings['loading_animation']) {
			proSettings.push('loading_animation');
		}

		if ('custom' === settings['loading_icon']) {
			proSettings.push('loading_icon');
		}

		const defaults = pick(defaultSettings(), proSettings);
		const merged = { ...settings, ...defaults };

		return omit(merged, [
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
		]);
	};

	const validateFilterKeys = () => {
		dispatch({ type: 'SET_ERROR', payload: '' });

		const validatedFilterKeys = [];
		let isValid = true;

		globalFilterKeys.forEach((_filterKeyData, index) => {
			const otherKeys = globalFilterKeys.filter(
				(_data, _index) => index !== _index
			);

			const filterKeyData = omit(_filterKeyData, [
				'field_key_error',
				'field_key_error_',
			]);

			const { field_key: filterKey } = filterKeyData;

			if (filterKey && find(otherKeys, { field_key: filterKey })) {
				filterKeyData['field_key_error'] = FILTER_KEY_IN_USE_MESSAGE;
				isValid = false;
			}

			validatedFilterKeys.push(filterKeyData);
		});

		dispatch({
			type: 'UPDATE_GLOBAL_FILTER_KEYS',
			payload: validatedFilterKeys,
		});

		if (!isValid) {
			dispatch({ type: 'SET_ERROR', payload: GENERIC_ERROR_MESSAGE });

			if ('filter-keys' !== currentTab) {
				dispatch({
					type: 'SET_CURRENT_TAB',
					payload: 'filter-keys',
				});
			}
		}

		return { isValid, validatedFilterKeys };
	};

	const handleSaveSettings = () => {
		if (proUpdateRequired()) {
			handleOpenProUpdateModal();

			return;
		}

		const { isValid, validatedFilterKeys } = validateFilterKeys();
		const updateFilterKeys = filterKeysChanged ? '1' : '';

		if (!isValid) {
			return;
		}

		setSaveBtnBusy(true);

		const formData = new FormData();

		formData.append('action', 'wcapf_save_settings');
		formData.append('nonce', getNonceToken());
		formData.append('settings', JSON.stringify(sanitizedSettings()));
		formData.append('filter_keys', JSON.stringify(validatedFilterKeys));
		formData.append('update_filter_keys', updateFilterKeys);

		axios
			.post(wcapf_admin_params.ajaxurl, formData)
			.then((res) => {
				setSaveBtnBusy(false);

				const {
					data: { data, success },
				} = res;

				if (success) {
					dispatch({
						type: 'UPDATE_SETTINGS',
						payload: data.settings,
					});

					dispatch({
						type: 'UPDATE_GLOBAL_FILTER_KEYS',
						payload: data.global_filter_keys,
					});

					dispatch({ type: 'SET_DIRTY', payload: false });

					wcapf_admin_params.dirty = false;

					dispatch({
						type: 'SET_FILTER_KEYS_CHANGED',
						payload: false,
					});

					settingsSavedSuccessNotice(
						__(
							'Settings saved successfully',
							'wc-ajax-product-filter'
						)
					);
				} else if (data.errors) {
					dispatch({
						type: 'SET_ERROR',
						payload: GENERIC_ERROR_MESSAGE,
					});

					const errorsData = data['errors'];

					console.log(errorsData); // TODO: Remove.

					const filterKeys = globalFilterKeys.map(
						(filterKey, index) => {
							const error = find(errorsData, { order: index });

							if (error) {
								const { key, message } = error;

								return {
									...filterKey,
									[key]: message,
									// Reset client side errors.
									field_key_error: '',
								};
							} else {
								return {
									...filterKey,
									// Reset client side errors.
									field_key_error: '',
								};
							}
						}
					);

					dispatch({
						type: 'UPDATE_GLOBAL_FILTER_KEYS',
						payload: filterKeys,
					});

					if ('filter-keys' !== currentTab) {
						dispatch({
							type: 'SET_CURRENT_TAB',
							payload: 'filter-keys',
						});
					}
				} else {
					settingsSavedErrorNotice(data);
				}
			})
			.catch((err) => {
				setSaveBtnBusy(false);

				settingsSavedErrorNotice(err.message);
			});
	};

	return (
		<div className='__wcapf_admin'>
			<TopBar view={'settings'} />

			<ProUpdateModal
				isOpen={ProUpdateModalOpen}
				closeModal={handleCloseProUpdateModal}
			/>

			<div className='__wcapf_layout'>
				<div className='__main'>
					<div className='__content'>
						<div className='__settings_wrapper'>
							<div className='__settings_header'>
								<h2>
									<Icon icon={SettingsIcon} />
									{__('Settings', 'wc-ajax-product-filter')}
								</h2>
								<Button
									variant={isDirty ? 'primary' : 'secondary'}
									disabled={!isDirty || saveBtnBusy}
									isBusy={saveBtnBusy}
									onClick={handleSaveSettings}
								>
									<Icon icon={SaveIcon} />
									{__('Save', 'wc-ajax-product-filter')}
								</Button>
							</div>

							<CustomTabPanel
								currentTab={currentTab}
								onChangeTab={handleTabChange}
								className='__tab_panel __settings_tab'
								activeClass='active-tab'
								tabs={tabs}
							>
								{({ name }) => {
									if ('general' === name) {
										return <General />;
									} else if ('integration' === name) {
										return <Integration />;
									} else if ('appearance' === name) {
										return <Appearance />;
									} else if ('loader-scrollTo' === name) {
										return <LoaderScrollTo />;
									} else if ('filter-keys' === name) {
										return <FilterKeys />;
									} else if ('others' === name) {
										return <Phrases />;
									} else if ('miscellaneous' === name) {
										return <Miscellaneous />;
									}
								}}
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
