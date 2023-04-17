import { createContext, useContext, useReducer } from '@wordpress/element';
import listFormsReducer, { initialState } from './listFormsReducer';

const ListFormsContext = createContext(initialState);

const ListFormsProvider = ({ children }) => {
	const [state, dispatch] = useReducer(listFormsReducer, initialState);

	return (
		<ListFormsContext.Provider value={{ state, dispatch }}>
			{children}
		</ListFormsContext.Provider>
	);
};

const useListForms = () => {
	const context = useContext(ListFormsContext);

	if (context === undefined) {
		throw new Error('useListForms must be used within a ListFormsProvider');
	}

	return context;
};

export { ListFormsProvider, useListForms };
