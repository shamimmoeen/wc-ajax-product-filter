import { __ } from '@wordpress/i18n';
import { Button, Icon } from '@wordpress/components';
import Sidebar from '../Sidebar';
import TopBar from '../TopBar';
import Fields from './Fields';
import { useSettings } from './SettingsContext';
import { SaveIcon } from '../SVGIcons';

const Settings = () => {
	const {
		state: { isDirty },
		dispatch,
	} = useSettings();

	const handleSaveSettings = () => {
		console.log('save settings');
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
									disabled={!isDirty}
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
			</div>
		</div>
	);
};

export default Settings;
