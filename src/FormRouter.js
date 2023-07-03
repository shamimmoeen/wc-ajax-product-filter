import './form.scss';
import Form from './components/Form';
import { FormProvider } from './components/Form/FormContext';

const FormRouter = () => {
	return (
		<FormProvider>
			<Form />
		</FormProvider>
	);
};

export default FormRouter;
