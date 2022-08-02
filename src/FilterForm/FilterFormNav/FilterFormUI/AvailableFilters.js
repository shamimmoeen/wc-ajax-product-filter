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
				style={{ maxHeight: 200 }}
				className='__available_filters_dropdown'
			>
				<div>
					{availableFilters.length ? (
						availableFilters.map((item) => (
							<AvailableFilter item={item} key={item.id} />
						))
					) : (
						<div
							className='__item'
							style={{
								display: 'flex',
								padding: '0 10px',
								lineHeight: '40px',
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
