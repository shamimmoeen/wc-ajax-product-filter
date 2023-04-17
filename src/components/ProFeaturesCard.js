import { __ } from '@wordpress/i18n';
import { upgradeToProLink } from './utils';

const ProFeaturesCard = () => {
	return (
		<div className='__pro_features_card'>
			<div className='__heading'>
				<h2>{__('Need more features?', 'wc-ajax-product-filter')}</h2>
				<p>
					{__(
						'Upgrade to PRO to unlock all features.',
						'wc-ajax-product-filter'
					)}
					{` `}
					<a href={upgradeToProLink()}>
						{__('Upgrade Now', 'wc-ajax-product-filter')}
					</a>
				</p>
			</div>
			<ul>
				<li>
					{__(
						'Filter by Custom Taxonomy, Post Meta',
						'wc-ajax-product-filter'
					)}
				</li>
				<li>
					{__(
						'Filter by Post Property(author/vendor, date, modified)',
						'wc-ajax-product-filter'
					)}
				</li>
				<li>
					{__(
						'Sort by, Results per page filters',
						'wc-ajax-product-filter'
					)}
				</li>
				<li>
					{__(
						'Display the filter options using color, image',
						'wc-ajax-product-filter'
					)}
				</li>
				<li>
					{__(
						'Display the price ranges using checkbox, radio, select, multi-select, label',
						'wc-ajax-product-filter'
					)}
				</li>
				<li>
					{__(
						'Display the terms in a hierarchical view and enable accordion on them',
						'wc-ajax-product-filter'
					)}
				</li>
				<li>
					{__(
						'Remove filter options that show empty results',
						'wc-ajax-product-filter'
					)}
				</li>
				<li>
					{__(
						'Choose the ordering of terms, include/exclude terms, and use term slug as the filter value',
						'wc-ajax-product-filter'
					)}
				</li>
				<li>
					{__(
						'Manually create the rating filter options',
						'wc-ajax-product-filter'
					)}
				</li>
				<li>
					{__(
						"Hide the filter items using the 'Show more' and 'Show less' buttons",
						'wc-ajax-product-filter'
					)}
				</li>
				<li>
					{__(
						'Set visibility rules to determine when to display the filter',
						'wc-ajax-product-filter'
					)}
				</li>
			</ul>
		</div>
	);
};

export default ProFeaturesCard;
