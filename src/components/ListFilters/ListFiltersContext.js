import { createContext, useContext, useReducer } from '@wordpress/element';
import listFiltersReducer, { initialState } from './listFiltersReducer';

const ListFiltersContext = createContext(initialState);

const ListFiltersProvider = ({ children }) => {
	const [state, dispatch] = useReducer(listFiltersReducer, initialState);

	return (
		<ListFiltersContext.Provider value={{ state, dispatch }}>
			{children}
		</ListFiltersContext.Provider>
	);
};

const useListFilters = () => {
	const context = useContext(ListFiltersContext);

	if (context === undefined) {
		throw new Error(
			'useListFilters must be used within a ListFiltersProvider'
		);
	}

	return context;
};

export { ListFiltersProvider, useListFilters };
