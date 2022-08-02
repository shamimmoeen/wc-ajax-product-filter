import { createContext, useContext, useReducer } from '@wordpress/element';
import filterReducer, { initialState } from './filterReducer';

const FilterContext = createContext(initialState);

const FilterProvider = ({ children }) => {
	const [state, dispatch] = useReducer(filterReducer, initialState);

	return (
		<FilterContext.Provider value={{ state, dispatch }}>
			{children}
		</FilterContext.Provider>
	);
};

const useFilter = () => {
	const context = useContext(FilterContext);

	if (context === undefined) {
		throw new Error('useFilter must be used within a FilterProvider');
	}

	return context;
};

export { FilterProvider, useFilter };
