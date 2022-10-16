import { __ } from '@wordpress/i18n';
import { TabPanel } from '@wordpress/components';
import { useFilter } from '../../FilterContext';
import Advanced from './Advanced';
import General from './General';
import Appearance from './Appearance';
import Options from './Options';

const FilterUI = () => {
	const {
		state: { activeUIStep, filterType },
		dispatch,
	} = useFilter();

	const handleSelect = (tabName) => {
		if (activeUIStep !== tabName) {
			dispatch({ type: 'SET_ACTIVE_UI_STEP', payload: tabName });
		}
	};

	let initialTabName = 'general';

	if (activeUIStep) {
		initialTabName = activeUIStep;
	}

	let tabs = [
		{
			name: 'general',
			title: __('General', 'wc-ajax-product-filter'),
			className: 'general',
		},
		{
			name: 'appearance',
			title: __('Appearance', 'wc-ajax-product-filter'),
			className: 'appearance',
		},
		{
			name: 'options',
			title: __('Options', 'wc-ajax-product-filter'),
			className: 'options',
		},
		{
			name: 'advanced',
			title: __('Advanced', 'wc-ajax-product-filter'),
			className: 'advanced',
		},
	];

	const withoutOptions = ['active-filters', 'reset-button'];

	if (withoutOptions.includes(filterType)) {
		tabs = tabs.filter((tab) => 'options' !== tab.name);
	}

	return (
		<TabPanel
			className='__filter_ui_tab_panel'
			activeClass='active-tab'
			initialTabName={initialTabName}
			onSelect={handleSelect}
			tabs={tabs}
		>
			{(tab) => {
				if ('general' === tab.name) {
					return <General />;
				} else if ('appearance' === tab.name) {
					return <Appearance />;
				} else if ('options' === tab.name) {
					return <Options />;
				} else if ('advanced' === tab.name) {
					return <Advanced />;
				}
			}}
		</TabPanel>
	);
};

export default FilterUI;
