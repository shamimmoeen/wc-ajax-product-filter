import { __ } from '@wordpress/i18n';
import Toggle from '../../../../Field/Toggle';
import Select from '../../../../Field/Select';
import Text from '../../../../Field/Text';
import { useFilter } from '../../../FilterContext';

const Basic = () => {
	const {
		state: { filterType },
	} = useFilter();

	let taxonomyField = '';

	if ('custom-taxonomy' === filterType || 'attribute' === filterType) {
		let taxonomyFieldLabel;

		if ('custom-taxonomy' === filterType) {
			taxonomyFieldLabel = __('Taxonomy', 'wc-ajax-product-filter');
		} else {
			taxonomyFieldLabel = __('Attribute', 'wc-ajax-product-filter');
		}

		taxonomyField = <Select label={taxonomyFieldLabel} id={'taxonomy'} />;
	}

	let filterKeyField = '';

	if ('active-filters' !== filterType && 'reset-button' !== filterType) {
		filterKeyField = (
			<Text
				id={'filter_key'}
				label={__('Filter Key', 'wc-ajax-product-filter')}
			/>
		);
	}

	return (
		<div>
			<Toggle
				id={'show_title'}
				label={__('Show Title', 'wc-ajax-product-filter')}
			/>

			{taxonomyField}

			{filterKeyField}
		</div>
	);
};

export default Basic;
