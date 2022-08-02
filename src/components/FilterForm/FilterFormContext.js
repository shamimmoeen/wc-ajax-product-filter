import { createContext, useContext, useReducer } from '@wordpress/element';
import filterFormReducer, { initialState } from './filterFormReducer';

const FilterFormContext = createContext(initialState);

const FilterFormProvider = ({ children }) => {
	const [state, dispatch] = useReducer(filterFormReducer, initialState);

	return (
		<FilterFormContext.Provider value={{ state, dispatch }}>
			{children}
		</FilterFormContext.Provider>
	);
};

const useFilterForm = () => {
	const context = useContext(FilterFormContext);

	if (context === undefined) {
		throw new Error(
			'useFilterForm must be used within a FilterFormProvider'
		);
	}

	return context;
};

export { FilterFormProvider, useFilterForm };
