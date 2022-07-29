import { Button } from '@wordpress/components';
import { Icon, plus } from '@wordpress/icons';

const AvailableFilter = ({ item, handleAddFilter }) => {
	return (
		<div
			style={{
				padding: 10,
				border: '1px solid #c3c4c7',
				marginBottom: '.5em',
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
			}}
		>
			<div>
				<span style={{ fontWeight: 500 }}>{item.title}</span>
				{item.filterKey ? ': ' + item.filterKey : ''}
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
				>
					<Icon icon={plus} size='20' />
				</Button>
			</div>
		</div>
	);
};

export default AvailableFilter;
