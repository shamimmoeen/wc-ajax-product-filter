import { __ } from '@wordpress/i18n';
import { Button, Card, CardBody, CardHeader } from '@wordpress/components';

const documentation = __(
	'There you can find detailed information about how to use the plugin correctly.',
	'wc-ajax-product-filter'
);

const support = __(
	'Did you find any <b>bugs</b> or <b>compatibility issues</b>? Please do not hesitate to open a thread on the support forum.',
	'wc-ajax-product-filter'
);

const question = __(
	"Do you have any <b>questions</b> or <b>feature requests</b> or do you need help with <b>custom development</b>? We'll be able to answer any kind of query.",
	'wc-ajax-product-filter'
);

const documentationURL =
	'https://wptools.io/docs/wc-ajax-product-filter/?utm_source=WP+Admin&utm_medium=inside+plugin&utm_campaign=WCAPF+Documentation';
const demoURL =
	'https://demos.wptools.io/wc-ajax-product-filter/?utm_source=WP+Admin&utm_medium=inside+plugin&utm_campaign=WCAPF+Demo';
const wpSupportURL =
	'https://wordpress.org/support/plugin/wc-ajax-product-filter/';
const supportURL =
	'https://wptools.io/support/?utm_source=WP+Admin&utm_medium=inside+plugin&utm_campaign=WCAPF+Support';

const Sidebar = () => {
	return (
		<div className='__sidebar'>
			<Card>
				<CardHeader>
					<h2>{__('Documentation', 'wc-ajax-product-filter')}</h2>
				</CardHeader>
				<CardBody>
					<p dangerouslySetInnerHTML={{ __html: documentation }} />
					<div className='__buttons'>
						<Button
							variant='secondary'
							href={documentationURL}
							target='_blank'
						>
							{__('To Documentation', 'wc-ajax-product-filter')}
						</Button>
						<Button
							variant='secondary'
							href={demoURL}
							target='_blank'
						>
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
					<Button
						variant='secondary'
						href={wpSupportURL}
						target='_blank'
					>
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
					<Button
						variant='secondary'
						href={supportURL}
						target='_blank'
					>
						{__('Ask Us', 'wc-ajax-product-filter')}
					</Button>
				</CardBody>
			</Card>
		</div>
	);
};

export default Sidebar;
