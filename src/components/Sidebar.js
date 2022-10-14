import { __ } from '@wordpress/i18n';
import { Button, Card, CardBody, CardHeader } from '@wordpress/components';

const Sidebar = () => {
	return (
		<div className='__sidebar'>
			<Card>
				<CardHeader>
					<h2>{__('Documentation', 'wc-ajax-product-filter')}</h2>
				</CardHeader>
				<CardBody>
					<p>
						{__(
							'There you can find detailed information about how to use the plugin correctly.',
							'wc-ajax-product-filter'
						)}
					</p>
					<div className='__buttons'>
						<Button variant='secondary'>
							{__('To Documentation', 'wc-ajax-product-filter')}
						</Button>
						<Button variant='secondary'>
							{__('View Demos', 'wc-ajax-product-filter')}
						</Button>
					</div>
				</CardBody>
			</Card>

			<Card>
				<CardHeader>
					<h2>{__('Support', 'wc-ajax-product-filter')}</h2>
				</CardHeader>
				<CardBody>
					<p>
						{__(
							'Did you find any bugs or compatibility issues? Please do not hesitate to open a thread on the support forum.',
							'wc-ajax-product-filter'
						)}
					</p>
					<Button variant='secondary'>
						{__('To Support', 'wc-ajax-product-filter')}
					</Button>
				</CardBody>
			</Card>

			<Card>
				<CardHeader>
					<h2>{__('Any Question?', 'wc-ajax-product-filter')}</h2>
				</CardHeader>
				<CardBody>
					<p>
						{__(
							"Do you have any questions or feature requests or do you need help with custom development? We'll be able to answer any kind of query.",
							'wc-ajax-product-filter'
						)}
					</p>
					<Button variant='secondary'>
						{__('Ask Us', 'wc-ajax-product-filter')}
					</Button>
				</CardBody>
			</Card>
		</div>
	);
};

export default Sidebar;
