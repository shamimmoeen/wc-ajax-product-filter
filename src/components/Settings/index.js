import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { Button, Icon } from '@wordpress/components';
import Sidebar from '../Sidebar';
import TopBar from '../TopBar';
import Fields from './Fields';
import Notifications from '../Notifications';
import { useSettings } from './SettingsContext';
import { SaveIcon } from '../SVGIcons';
import axios from 'axios';
import {
	removeSettingsSavedNotices,
	settingsSavedErrorNotice,
	settingsSavedSuccessNotice,
} from '../notices';

const Settings = () => {
	const {
		state: { isDirty, settings },
		dispatch,
	} = useSettings();

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

							<div className='__settings_fields'>
								<Fields />
							</div>
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
