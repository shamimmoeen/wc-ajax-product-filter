import { __ } from '@wordpress/i18n';
import AvailableFilter from './AvailableFilter';
import SearchInput from './SearchInput';
import { __experimentalScrollable as Scrollable } from '@wordpress/components';
import { useFilterForm } from '../../FilterFormContext';

const AvailableFilters = () => {
	const {
		state: { availableFilters },
	} = useFilterForm();

	return (
		<div style={{ marginBottom: '2em' }} justify={'center'}>
			<SearchInput />

			<Scrollable
				style={{
					maxHeight: 200,
					boxShadow: '0 3px 6px rgb(0 0 0 / 10%)',
					backgroundColor: '#fff',
				}}
			>
				<div>
					{availableFilters.length ? (
						availableFilters.map((item) => (
							<AvailableFilter item={item} key={item.id} />
						))
					) : (
						<div
							style={{
								display: 'flex',
								padding: '0 10px',
								lineHeight: '40px',
								borderBottom: '1px solid #e2e2e2',
							}}
						>
							{__(
								'No matching results found.',
								'wc-ajax-product-filter'
							)}
						</div>
					)}
				</div>
			</Scrollable>
		</div>
	);
};

export default AvailableFilters;
