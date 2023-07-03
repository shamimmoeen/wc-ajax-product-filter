import './list-forms.scss';
import { ListFormsProvider } from './components/ListForms/ListFormsContext';
import ListForms from './components/ListForms';

const ListFormsRouter = () => {
	return (
		<ListFormsProvider>
			<ListForms />
		</ListFormsProvider>
	);
};

export default ListFormsRouter;
