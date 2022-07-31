import { Flex, FlexItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import AvailableFilter from './AvailableFilter';
import SearchInput from './SearchInput';
import { __experimentalScrollable as Scrollable } from '@wordpress/components';

const AvailableFilters = ({ availableFilters, setAvailableFilters }) => {
	const handleAddFilter = (item) => {
		const _availableFilters = availableFilters.map((_item) => {
			if (_item.id === item.id) {
				_item.status = 'added';
			}

			return _item;
		});

		setAvailableFilters(_availableFilters);
	};

	return (
		<div style={{ marginBottom: '2em' }} justify={'center'}>
			<SearchInput />

			<Scrollable
				style={{
					maxHeight: 200,
					boxShadow: '0 3px 6px rgb(0 0 0 / 18%)',
				}}
			>
				<div>
					{availableFilters.map((item, key) => (
						<AvailableFilter
							item={item}
							handleAddFilter={handleAddFilter}
							key={key}
						/>
					))}
				</div>
			</Scrollable>
		</div>
	);
};

export default AvailableFilters;
