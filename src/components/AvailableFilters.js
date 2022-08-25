import { __ } from '@wordpress/i18n';
import { Button, NavigableMenu } from '@wordpress/components';
import { getAvailableFilters } from './Filter/utils';
import { proTag } from './utils';

const AvailableFilters = ({ filterType, handleSetFilterType }) => {
	return (
		<div className='__available_filters'>
			<div className='__inner'>
				<p className='description'>
					{__(
						'Select a component to start building the filter.',
						'wc-ajax-product-filter'
					)}
				</p>

				<div className='__filters'>
					<NavigableMenu role={'menu'} orientation='horizontal'>
						{getAvailableFilters().map((filter) => {
							let _classes = '__item';

							if (filterType === filter.type) {
								_classes += ' active';
							}

							return (
								<Button
									className={_classes}
									key={filter.type}
									onClick={() => handleSetFilterType(filter)}
								>
									{filter.title}
									{proTag(filter.isPro)}
								</Button>
							);
						})}
					</NavigableMenu>
				</div>
			</div>
		</div>
	);
};

export default AvailableFilters;
