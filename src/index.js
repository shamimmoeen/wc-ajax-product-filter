import { render, StrictMode, useMemo } from '@wordpress/element';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import ListFormsRouter from './ListFormsRouter';
import SettingsRouter from './SettingsRouter';
import FormRouter from './FormRouter';

// Replace the href for the parent page.
const anchors = document
	.getElementById('toplevel_page_wcapf')
	.querySelectorAll('[href="admin.php?page=wcapf"]');

for (const element of anchors) {
	element.href = '#/';
}

function App() {
	const pages = usePagesWithComponents();

	return (
		<Router>
			<Routes>
				{pages.map(({ component: Component, path }) => (
					<Route
						key={path}
						path={path}
						exact
						element={<Component />}
					/>
				))}
				<Route path={'/form/:id'} element={<FormRouter />} />
			</Routes>
		</Router>
	);
}

function usePagesWithComponents() {
	return useMemo(
		() =>
			window.wcapf_admin_params.pages.map((page) => ({
				...page,
				component: withStateManagement(page.path),
			})),
		[window.wcapf_admin_params.pages]
	);
}

function withStateManagement(path) {
	return function StateManagedComponent() {
		if (path === '/forms') {
			return <ListFormsRouter />;
		}

		if (path === '/settings') {
			return <SettingsRouter />;
		}

		return <ListFormsRouter />;
	};
}

const renderElementInstance = document.getElementById('root');

if (renderElementInstance) {
	render(
		<StrictMode>
			<App />
		</StrictMode>,
		renderElementInstance
	);
}
