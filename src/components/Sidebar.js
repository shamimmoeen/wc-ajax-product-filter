import { __ } from '@wordpress/i18n';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Icon,
} from '@wordpress/components';
import {
	DocumentationCardIcon,
	ReviewCardIcon,
	SupportCardIcon,
} from './SVGIcons';

const documentation = __(
	'Explore our comprehensive documentation and interactive demos.',
	'wc-ajax-product-filter'
);

const support = __(
	"Whether you require technical support, have questions about specific features, or need assistance with custom development, we're here to help.",
	'wc-ajax-product-filter'
);

const review = __(
	'Your 5-star review is a valuable reward for us. Please help us grow in the community by sharing your review.',
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
const reviewUrl =
	'https://wordpress.org/support/plugin/wc-ajax-product-filter/reviews/?filter=5';

const Sidebar = () => {
	return (
		<div className='__sidebar'>
			<Card>
				<CardHeader>
					<h2>
						<Icon icon={DocumentationCardIcon} fill='#00B894' />
						{__(
							'Need Help Getting Started?',
							'wc-ajax-product-filter'
						)}
					</h2>
				</CardHeader>
				<CardBody>
					<p dangerouslySetInnerHTML={{ __html: documentation }} />
					<div className='__buttons'>
						<Button
							variant='secondary'
							href={documentationURL}
							target='_blank'
						>
							{__('Documentation', 'wc-ajax-product-filter')}
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
					<h2>
						<Icon icon={SupportCardIcon} fill='#6C5CE7' />
						{__('Support & Questions', 'wc-ajax-product-filter')}
					</h2>
				</CardHeader>
				<CardBody>
					<p dangerouslySetInnerHTML={{ __html: support }} />
					<Button
						variant='secondary'
						href={wpSupportURL}
						target='_blank'
					>
						{__('Support Forum', 'wc-ajax-product-filter')}
					</Button>
					<Button
						variant='secondary'
						href={supportURL}
						target='_blank'
					>
						{__('Contact Us', 'wc-ajax-product-filter')}
					</Button>
				</CardBody>
			</Card>

			<Card>
				<CardHeader>
					<h2>
						<Icon icon={ReviewCardIcon} fill='#FD7E14' />
						{__('Like the Plugin?', 'wc-ajax-product-filter')}
					</h2>
				</CardHeader>
				<CardBody>
					<p dangerouslySetInnerHTML={{ __html: review }} />
					<Button
						variant='secondary'
						href={reviewUrl}
						target='_blank'
					>
						{__('Write a Review', 'wc-ajax-product-filter')}
					</Button>
				</CardBody>
			</Card>
		</div>
	);
};

export default Sidebar;
