import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { Icon } from '@wordpress/icons';
import { PlusIcon } from '../../../SVGIcons';

const Header = ({ searchFilterActive, setSearchFilterActive }) => {
	const toggleSearchFilterActive = () => {
		const _searchFilterActive = !searchFilterActive;
		setSearchFilterActive(_searchFilterActive);
	};

	const addFilterBtnClasses = searchFilterActive
		? '__add_filter_btn active'
		: '__add_filter_btn';

	return (
		<div className='__header'>
			<h2 className='__label'>
				{__('Filters', 'wc-ajax-product-filter')}
			</h2>
			<Button
				variant='primary'
				className={addFilterBtnClasses}
				onClick={toggleSearchFilterActive}
			>
				<Icon icon={PlusIcon} size={14} />
			</Button>
		</div>
	);
};

export default Header;
