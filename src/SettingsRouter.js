import './settings.scss';
import { SettingsProvider } from './components/Settings/SettingsContext';
import Settings from './components/Settings';

const SettingsRouter = () => {
	return (
		<SettingsProvider>
			<Settings />
		</SettingsProvider>
	);
};

export default SettingsRouter;
