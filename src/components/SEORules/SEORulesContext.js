import { createContext, useContext, useReducer } from '@wordpress/element';
import seoRulesReducer, { initialState } from './seoRulesReducer';

const SEORulesContext = createContext(initialState);

const SEORulesProvider = ({ children }) => {
	const [state, dispatch] = useReducer(seoRulesReducer, initialState);

	return (
		<SEORulesContext.Provider value={{ state, dispatch }}>
			{children}
		</SEORulesContext.Provider>
	);
};

const useSEORules = () => {
	const context = useContext(SEORulesContext);

	if (context === undefined) {
		throw new Error('useSEORules must be used within a SEORulesProvider');
	}

	return context;
};

export { SEORulesProvider, useSEORules };
