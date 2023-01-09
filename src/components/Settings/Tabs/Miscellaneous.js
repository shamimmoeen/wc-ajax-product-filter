import { __ } from '@wordpress/i18n';
import { useSettings } from '../SettingsContext';
import Checkbox from '../../Field/Checkbox';
import useSettingsData from '../useSettingsData';

const Miscellaneous = () => {
	const { state, dispatch } = useSettings();
	const { handleCheckboxChange } = useSettingsData(state, dispatch);

	const {
		settings: {
			debug_mode,
			disable_wcapf,
			send_anonymous_data,
			remove_data,
		},
	} = state;

	return (
		<>
			<Checkbox
				id={'debug_mode'}
				label={__('Debug Mode', 'wc-ajax-product-filter')}
				description={__(
					'This will help you to configure the plugin correctly.',
					'wc-ajax-product-filter'
				)}
				isChecked={debug_mode}
				onChange={handleCheckboxChange}
			/>

			<Checkbox
				id={'disable_wcapf'}
				label={__('Disable WCAPF', 'wc-ajax-product-filter')}
				description={__(
					'Enable this to disable WCAPF temporarily for testing purposes.',
					'wc-ajax-product-filter'
				)}
				isChecked={disable_wcapf}
				onChange={handleCheckboxChange}
			/>

			<Checkbox
				id={'send_anonymous_data'}
				label={__('Send anonymous data', 'wc-ajax-product-filter')}
				description={__(
					'Enable this if you agree to send anonymous data to the developer to make the plugin better.',
					'wc-ajax-product-filter'
				)}
				isChecked={send_anonymous_data}
				onChange={handleCheckboxChange}
			/>

			<Checkbox
				id={'remove_data'}
				label={__('Remove Data', 'wc-ajax-product-filter')}
				description={__(
					'Enable this to remove all data when uninstalling WC Ajax Product Filter via the <b>Plugins</b> page.',
					'wc-ajax-product-filter'
				)}
				isChecked={remove_data}
				onChange={handleCheckboxChange}
			/>
		</>
	);
};

export default Miscellaneous;
