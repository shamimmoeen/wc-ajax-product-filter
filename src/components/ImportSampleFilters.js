import { __ } from '@wordpress/i18n';
import { Button, Icon } from '@wordpress/components';
import { ImportIcon } from './SVGIcons';

const ImportSampleFilters = ({ view, callback }) => {
	const handleImportSampleFilters = () => {
		console.log('clicked');

		if (callback) {
			callback();
		}
	};

	let description;

	if ('forms' === view) {
		description = __(
			'In order to create a form you need to have filters first. Do you want to import sample filters? Click on the button below.',
			'wc-ajax-product-filter'
		);
	} else if ('filters' === view) {
		description = __(
			'Do you want to import sample filters? Click on the button below.',
			'wc-ajax-product-filter'
		);
	}

	return (
		<div className='__import_sample_filters'>
			<Icon icon={'filter'} />

			<h3>
				{__(
					"You don't have any filters yet.",
					'wc-ajax-product-filter'
				)}
			</h3>

			<p className='__description'>{description}</p>

			<Button variant='primary' onClick={handleImportSampleFilters}>
				<Icon icon={ImportIcon} />
				{__('Import Sample Filters', 'wc-ajax-product-filter')}
			</Button>
		</div>
	);
};

export default ImportSampleFilters;
