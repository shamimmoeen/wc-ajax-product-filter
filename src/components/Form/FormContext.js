import { createContext, useContext, useReducer } from '@wordpress/element';
import formReducer, { initialState } from './formReducer';

const FormContext = createContext(initialState);

const FormProvider = ({ children }) => {
	const [state, dispatch] = useReducer(formReducer, initialState);

	return (
		<FormContext.Provider value={{ state, dispatch }}>
			{children}
		</FormContext.Provider>
	);
};

const useForm = () => {
	const context = useContext(FormContext);

	if (context === undefined) {
		throw new Error('useForm must be used within a FormProvider');
	}

	return context;
};

export { FormProvider, useForm };
