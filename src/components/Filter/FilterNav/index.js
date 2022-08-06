import { useState } from '@wordpress/element';
import { TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import FilterUI from './FilterUI';

const FilterNav = () => {
	const [activeTab, setActiveTab] = useState('filter_ui');

	const handleSelect = (tabName) => {
		setActiveTab(tabName);
	};

	let tabPanelClasses = '__tab_panel';

	if ('filter_ui' === activeTab) {
		tabPanelClasses += ' filter_ui';
	}

	return (
		<TabPanel
			className={tabPanelClasses}
			activeClass='active-tab'
			onSelect={handleSelect}
			tabs={[
				{
					name: 'filter_ui',
					title: __('Filter UI', 'wc-ajax-product-filter'),
					className: 'filter_ui',
				},
				{
					name: 'visibility_rules',
					title: __('Visibility Rules', 'wc-ajax-product-filter'),
					className: 'visibility_rules',
				},
				{
					name: 'customize',
					title: __('Customize', 'wc-ajax-product-filter'),
					className: 'customize',
				},
			]}
		>
			{(tab) => {
				if (tab.name === 'filter_ui') {
					return <FilterUI />;
				} else if (tab.name === 'visibility_rules') {
					return 'Visbility Ruels';
				} else if (tab.name === 'customize') {
					return 'Customize Form';
				}
			}}
		</TabPanel>
	);
};

export default FilterNav;
