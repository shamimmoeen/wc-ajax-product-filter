import { Button } from '@wordpress/components';
import { Icon, plus } from '@wordpress/icons';
import { useFilterForm } from '../../FilterFormContext';

const AvailableFilter = ({ item }) => {
	const {
		state: { availableFilters },
		dispatch,
	} = useFilterForm();

	const handleAddFilter = () => {
		const _availableFilters = availableFilters.map((_item) => {
			if (_item.id === item.id) {
				_item.status = 'added';
			}

			return _item;
		});

		dispatch({ type: 'SET_AVAILABLE_FILTERS', payload: _availableFilters });
		dispatch({ type: 'ADD_FORM_FILTER', payload: item });
	};

	return (
		<div
			style={{
				padding: 10,
				borderBottom: '1px solid #e2e2e2',
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
			}}
		>
			<div>
				<span style={{ fontWeight: 500 }}>{item.title}</span>
				{item.filterKey ? (
					<span style={{ color: '#646970' }}>: {item.filterKey}</span>
				) : (
					''
				)}
			</div>
			<div
				style={{
					display: 'inline-flex',
					alignItems: 'center',
				}}
			>
				<Button
					style={{ padding: 0, height: 20 }}
					variant='secondary'
					onClick={handleAddFilter}
					disabled={'added' === item.status}
				>
					<Icon icon={plus} size='20' />
				</Button>
			</div>
		</div>
	);
};

export default AvailableFilter;
