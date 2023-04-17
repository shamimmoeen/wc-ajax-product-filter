import { __ } from '@wordpress/i18n';
import { Button, Icon } from '@wordpress/components';
import { plus } from '@wordpress/icons';

const NoFiltersFound = ({ addFilter }) => {
	return (
		<div className='__empty_form'>
			<Icon icon={'filter'} />

			<h3>
				{__(
					"You don't have any filters yet.",
					'wc-ajax-product-filter'
				)}
			</h3>

			<p className='__description'>
				{__(
					'Click on the button below to add your first filter.',
					'wc-ajax-product-filter'
				)}
			</p>

			<Button
				variant='primary'
				onClick={addFilter}
				className='__add_filter_btn'
			>
				<Icon icon={plus} />
				{__('Add Filter', 'wc-ajax-product-filter')}
			</Button>
		</div>
	);
};

export default NoFiltersFound;
