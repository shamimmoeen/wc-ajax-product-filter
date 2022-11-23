import { __ } from '@wordpress/i18n';
import { Button, Icon } from '@wordpress/components';
import { ImportIcon, PlusIcon } from '../SVGIcons';

const NoFormsFound = () => {
	const handleImportSampleForm = () => {
		console.log('import sample form');
	};

	return (
		<div className='__import_sample_form'>
			<Icon icon={PlusIcon} size={40} fill='#babbbc' />

			<h3>
				{__("You don't have any forms yet.", 'wc-ajax-product-filter')}
			</h3>

			<p className='__description'>
				{__(
					'Do you want to import a sample form? Click on the button below.',
					'wc-ajax-product-filter'
				)}
			</p>

			<Button variant='secondary' onClick={handleImportSampleForm}>
				<Icon icon={ImportIcon} size={20} />
				{__('Import Sample Form', 'wc-ajax-product-filter')}
			</Button>
		</div>
	);
};

export default NoFormsFound;
