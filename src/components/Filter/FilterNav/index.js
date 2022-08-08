import { useState } from '@wordpress/element';
import { Flex, Spinner, TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import FilterUI from './FilterUI';
import VisibilityRules from '../../VisibilityRules';
import { useFilter } from '../FilterContext';

const FilterNav = () => {
	const {
		state: { isLoading },
	} = useFilter();
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
				if (isLoading) {
					return (
						<Flex justify={'center'} style={{ margin: '2em 0' }}>
							<Spinner />
						</Flex>
					);
				} else {
					if (tab.name === 'filter_ui') {
						return <FilterUI />;
					} else if (tab.name === 'visibility_rules') {
						return <VisibilityRules />;
					} else if (tab.name === 'customize') {
						return 'Customize Form';
					}
				}
			}}
		</TabPanel>
	);
};

export default FilterNav;
