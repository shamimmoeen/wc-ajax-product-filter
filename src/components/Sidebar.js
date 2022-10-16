import { __ } from '@wordpress/i18n';
import { Button, Card, CardBody, CardHeader } from '@wordpress/components';

const documentaion = __(
	'There you can find detailed information about how to use the plugin correctly.',
	'wc-ajax-product-filter'
);

const support = __(
	'Did you find any <b>bugs</b> or <b>compatibility issues</b>? Please do not hesitate to open a thread on the support forum.',
	'wc-ajax-product-filter'
);

const question = __(
	"Do you have any questions or <b>feature requests</b> or do you need help with <b>custom development</b>? We'll be able to answer any kind of query.",
	'wc-ajax-product-filter'
);

const Sidebar = () => {
	return (
		<div className='__sidebar'>
			<Card>
				<CardHeader>
					<h2>{__('Documentation', 'wc-ajax-product-filter')}</h2>
				</CardHeader>
				<CardBody>
					<p dangerouslySetInnerHTML={{ __html: documentaion }} />
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
					<p dangerouslySetInnerHTML={{ __html: support }} />
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
					<p dangerouslySetInnerHTML={{ __html: question }} />
					<Button variant='secondary'>
						{__('Ask Us', 'wc-ajax-product-filter')}
					</Button>
				</CardBody>
			</Card>
		</div>
	);
};

export default Sidebar;
