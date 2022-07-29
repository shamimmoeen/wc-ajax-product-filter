import { __ } from '@wordpress/i18n';
import { Button, Flex, FlexItem } from '@wordpress/components';
import { Icon, plus } from '@wordpress/icons';

const FormFiltersTitle = ({ searchFilterActive, setSearchFilterActive }) => {
	const toggleSearchFilterActive = () => {
		const _searchFilterActive = !searchFilterActive;
		setSearchFilterActive(_searchFilterActive);
	};

	const addFilterBtnClasses = searchFilterActive
		? '__fz_add_filter_btn active'
		: '__fz_add_filter_btn';

	return (
		<Flex style={{ marginBottom: '1em' }}>
			<FlexItem>
				<h3 style={{ margin: 0, fontWeight: 500 }}>
					{__('Filters', 'wc-ajax-product-filter')}
				</h3>
			</FlexItem>
			<FlexItem>
				<Button
					variant='primary'
					style={{
						padding: 0,
						height: 34,
						width: 34,
						justifyContent: 'center',
					}}
					className={addFilterBtnClasses}
					onClick={toggleSearchFilterActive}
				>
					<Icon icon={plus} />
				</Button>
			</FlexItem>
		</Flex>
	);
};

export default FormFiltersTitle;
