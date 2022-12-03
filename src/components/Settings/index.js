import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { Button, Icon } from '@wordpress/components';
import Sidebar from '../Sidebar';
import TopBar from '../TopBar';
import Notifications from '../Notifications';
import { useSettings } from './SettingsContext';
import { SaveIcon } from '../SVGIcons';
import axios from 'axios';
import {
	removeSettingsSavedNotices,
	settingsSavedErrorNotice,
	settingsSavedSuccessNotice,
} from '../notices';
import General from './Tabs/General';
import FilterKeys from './Tabs/FilterKeys';
import Miscellaneous from './Tabs/Miscellaneous';
import LoaderOverlay from './Tabs/LoaderOverlay';
import Others from './Tabs/Others';
import SEO from './Tabs/SEO';
import CustomTabPanel from '../CustomTabPanel';

const Settings = () => {
	const { state, dispatch } = useSettings();

	const { isDirty, settings, globalFilterKeys } = state;

	const [saveBtnBusy, setSaveBtnBusy] = useState(false);

	useEffect(() => {
		if (!isDirty) {
			return;
		}

		removeSettingsSavedNotices();
	}, [isDirty]);

	const handleSaveSettings = () => {
		setSaveBtnBusy(true);

		const formData = new FormData();

		formData.append('action', 'wcapf_save_settings');
		formData.append('settings', JSON.stringify(settings));
		formData.append('filter_keys', JSON.stringify(globalFilterKeys));

		axios
			.post(wcapf_admin_params.ajaxurl, formData)
			.then((res) => {
				setSaveBtnBusy(false);

				const {
					data: { data, success },
				} = res;

				if (success) {
					dispatch({ type: 'SET_DIRTY', payload: false });

					settingsSavedSuccessNotice(data);
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

			<div className='__wcapf_layout'>
				<div className='__main'>
					<div className='__content'>
						<div className='__settings_wrapper'>
							<div className='__settings_header'>
								<h2>
									{__('Settings', 'wc-ajax-product-filter')}
								</h2>
								<Button
									variant='primary'
									disabled={!isDirty || saveBtnBusy}
									isBusy={saveBtnBusy}
									onClick={handleSaveSettings}
								>
									<Icon icon={SaveIcon} />
									{__('Save', 'wc-ajax-product-filter')}
								</Button>
							</div>

							<CustomTabPanel
								state={state}
								dispatch={dispatch}
								scrollable
								className='__tab_panel __settings_tab'
								activeClass='active-tab'
								tabs={[
									{
										name: 'general',
										title: __(
											'General',
											'wc-ajax-product-filter'
										),
									},
									{
										name: 'others',
										title: __(
											'Others',
											'wc-ajax-product-filter'
										),
									},
									{
										name: 'css-javascript',
										title: __(
											'CSS & JavaScript',
											'wc-ajax-product-filter'
										),
									},
									// {
									// 	name: 'loader-scroll-to',
									// 	title: __(
									// 		'Loader & Scroll To',
									// 		'wc-ajax-product-filter'
									// 	),
									// },
									{
										name: 'filter-keys',
										title: __(
											'Filter Keys',
											'wc-ajax-product-filter'
										),
									},
									{
										name: 'seo',
										title: __(
											'SEO',
											'wc-ajax-product-filter'
										),
									},
									{
										name: 'miscellaneous',
										title: __(
											'Miscellaneous',
											'wc-ajax-product-filter'
										),
									},
								]}
							>
								{({ name }) => {
									if ('general' === name) {
										return <General />;
									} else if ('others' === name) {
										return <Others />;
									} else if ('css-javascript' === name) {
										return <LoaderOverlay />;
									} else if ('loader-scroll-to' === name) {
										return <LoaderOverlay />;
									} else if ('filter-keys' === name) {
										return <FilterKeys />;
									} else if ('seo' === name) {
										return <SEO />;
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
