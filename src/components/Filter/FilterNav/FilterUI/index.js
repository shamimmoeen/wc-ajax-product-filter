import { __ } from '@wordpress/i18n';
import CustomTabPanel from '../../../CustomTabPanel';
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

	let initialTabName = 'appearance';

	if (activeUIStep) {
		initialTabName = activeUIStep;
	}

	const isOptionsDisabled = () => {
		let disabled = false;

		if ('active-filters' === filterType) {
			disabled = true;
		} else if ('reset-button' === filterType) {
			disabled = true;
		}

		return disabled;
	};

	const isAppearanceDisabled = () => {
		let disabled = false;

		return disabled;
	};

	return (
		<CustomTabPanel
			className='__filter_ui_tab_panel'
			activeClass='active-tab'
			orientation='vertical'
			initialTabName={initialTabName}
			onSelect={handleSelect}
			tabs={[
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
					isDisabled: isOptionsDisabled(),
				},
				{
					name: 'advanced',
					title: __('Advanced', 'wc-ajax-product-filter'),
					className: 'advanced',
					isDisabled: isAppearanceDisabled(),
				},
			]}
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
		</CustomTabPanel>
	);
};

export default FilterUI;
