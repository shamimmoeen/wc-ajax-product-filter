import { Panel, PanelBody, PanelRow } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import AvaialableFilters from './FilterUI/AvailableFilters';
import Text from '../../Field/Text';
import Toggle from '../../Field/Toggle';

const MyPanel = () => {
	return (
		<>
			<AvaialableFilters />

			<Panel header='Filter by Category'>
				<PanelBody
					title={__('Basic', 'wc-ajax-product-filter')}
					initialOpen={true}
				>
					<PanelRow>
						<div>
							<Text
								id={'filter_key'}
								label={__(
									'Filter Key',
									'wc-ajax-product-filter'
								)}
							/>

							<Toggle
								id={'show_title'}
								label={__(
									'Show Title',
									'wc-ajax-product-filter'
								)}
							/>
						</div>
					</PanelRow>
				</PanelBody>
				<PanelBody
					title={__('Layout', 'wc-ajax-product-filter')}
					initialOpen={false}
				>
					<PanelRow>
						{__(
							'Select any of these filters to start building the filter.',
							'wc-ajax-product-filter'
						)}
					</PanelRow>
				</PanelBody>
				<PanelBody
					title={__('Options', 'wc-ajax-product-filter')}
					initialOpen={false}
				>
					<PanelRow>
						{__(
							'Select any of these filters to start building the filter.',
							'wc-ajax-product-filter'
						)}
					</PanelRow>
				</PanelBody>
				<PanelBody
					title={__('Advanced', 'wc-ajax-product-filter')}
					initialOpen={false}
				>
					<PanelRow>
						{__(
							'Select any of these filters to start building the filter.',
							'wc-ajax-product-filter'
						)}
					</PanelRow>
				</PanelBody>
			</Panel>
		</>
	);
};

export default MyPanel;
