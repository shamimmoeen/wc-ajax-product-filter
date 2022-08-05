import { __ } from '@wordpress/i18n';
import { useFilter } from '../../../FilterContext';
import { Panel, PanelBody, PanelRow } from '@wordpress/components';
import Basic from './Basic';
import Layout from './Layout';
import Options from './Options';
import Advanced from './Advanced';

const FilterSettings = () => {
	const {
		state: { filterTypeLabel },
	} = useFilter();

	return filterTypeLabel ? (
		<Panel header={filterTypeLabel} className='__filter_settings_panel'>
			<PanelBody
				title={__('Basic', 'wc-ajax-product-filter')}
				initialOpen={false}
			>
				<PanelRow>
					<Basic />
				</PanelRow>
			</PanelBody>
			<PanelBody
				title={__('Layout', 'wc-ajax-product-filter')}
				initialOpen={true}
			>
				<PanelRow>
					<Layout />
				</PanelRow>
			</PanelBody>
			<PanelBody
				title={__('Options', 'wc-ajax-product-filter')}
				initialOpen={false}
			>
				<PanelRow>
					<Options />
				</PanelRow>
			</PanelBody>
			<PanelBody
				title={__('Advanced', 'wc-ajax-product-filter')}
				initialOpen={false}
			>
				<PanelRow>
					<Advanced />
				</PanelRow>
			</PanelBody>
		</Panel>
	) : (
		''
	);
};

export default FilterSettings;
