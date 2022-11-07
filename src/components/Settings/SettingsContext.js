import { createContext, useContext, useReducer } from '@wordpress/element';
import settingsReducer, { initialState } from './settingsReducer';

const SettingsContext = createContext(initialState);

const SettingsProvider = ({ children }) => {
	const [state, dispatch] = useReducer(settingsReducer, initialState);

	return (
		<SettingsContext.Provider value={{ state, dispatch }}>
			{children}
		</SettingsContext.Provider>
	);
};

const useSettings = () => {
	const context = useContext(SettingsContext);

	if (context === undefined) {
		throw new Error('useSettings must be used within a SettingsProvider');
	}

	return context;
};

export { SettingsProvider, useSettings };
