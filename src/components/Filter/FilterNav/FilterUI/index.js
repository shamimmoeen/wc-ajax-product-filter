import { TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useFilter } from '../../FilterContext';
import Advanced from './Advanced';
import Basic from './Basic';
import Layout from './Layout';
import Options from './Options';

const FilterUI = () => {
	const {
		state: { activeUIStep },
		dispatch,
	} = useFilter();

	const handleSelect = (tabName) => {
		dispatch({ type: 'SET_ACTIVE_UI_STEP', payload: tabName });
	};

	let initialTabName = '';

	if (activeUIStep) {
		initialTabName = activeUIStep;
	}

	return (
		<TabPanel
			className='__filter_ui_tab_panel'
			activeClass='active-tab'
			orientation='vertical'
			initialTabName={initialTabName}
			onSelect={handleSelect}
			tabs={[
				{
					name: 'basic',
					title: __('Basic', 'wc-ajax-product-filter'),
					className: 'basic',
				},
				{
					name: 'layout',
					title: __('Layout', 'wc-ajax-product-filter'),
					className: 'layout',
					isDisabled: true,
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
			]}
		>
			{(tab) => {
				if ('basic' === tab.name) {
					return <Basic />;
				} else if ('layout' === tab.name) {
					return <Layout />;
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
