import { Button } from '@wordpress/components';
import { Icon, plus } from '@wordpress/icons';

const AvailableFilter = ({ item, handleAddFilter }) => {
	return (
		<div
			style={{
				padding: 10,
				borderBottom: '1px solid #c3c4c7',
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
					onClick={() => handleAddFilter(item)}
					disabled={'added' === item.status}
				>
					<Icon icon={plus} size='20' />
				</Button>
			</div>
		</div>
	);
};

export default AvailableFilter;
