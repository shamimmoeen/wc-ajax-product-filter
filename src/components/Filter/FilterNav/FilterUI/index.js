import { __ } from '@wordpress/i18n';
import CustomTabPanel from '../../../CustomTabPanel';
import { useFilter } from '../../FilterContext';
import Advanced from './Advanced';
import Basic from './Basic';
import Layout from './Layout';
import Options from './Options';

const FilterUI = () => {
	const {
		state: { activeUIStep, filterType },
		dispatch,
	} = useFilter();

	const handleSelect = (tabName) => {
		dispatch({ type: 'SET_ACTIVE_UI_STEP', payload: tabName });
	};

	let initialTabName = 'options';

	if (activeUIStep) {
		initialTabName = activeUIStep;
	}

	const disableTabItem = !filterType.length ? true : false;

	return (
		<CustomTabPanel
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
					isDisabled: disableTabItem,
				},
				{
					name: 'options',
					title: __('Options', 'wc-ajax-product-filter'),
					className: 'options',
					isDisabled: disableTabItem,
				},
				{
					name: 'advanced',
					title: __('Advanced', 'wc-ajax-product-filter'),
					className: 'advanced',
					isDisabled: disableTabItem,
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
		</CustomTabPanel>
	);
};

export default FilterUI;
