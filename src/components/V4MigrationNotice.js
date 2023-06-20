import { Button } from '@wordpress/components';
import { proUpgradeRequired } from './utils';

const showMigrationNotice = wcapf_admin_params.show_v4_migration_notice;
const migrationFormEditUrl = wcapf_admin_params.v4_migrated_form_url;
const migrationDocUrl = wcapf_admin_params.v4_migration_doc_url;
const proUpgradeNotice = proUpgradeRequired();

const V4MigrationNotice = () => {
	const handleDismissNotice = () => {
		if (typeof removeWCAPFMigrationNotice === 'function') {
			removeWCAPFMigrationNotice();
		}
	};

	return (
		<>
			{showMigrationNotice && (
				<div
					className='notice notice-info v4-upgrade-notice'
					id='wcapf-v4-migration-notice'
				>
					<p>
						<strong>
							WCAPF - WooCommerce Ajax Product Filter (v4
							Migration Notice)
						</strong>
					</p>
					<p>
						The WC Ajax Product Filter plugin has been upgraded to
						v4 and is now named WCAPF - WooCommerce Ajax Product
						Filter. We have redesigned the admin UI to provide a
						more intuitive user experience and refactored the
						codebase for improved performance and easier future
						enhancements. As part of the migration process, a form
						has been automatically created with all the existing
						filters from your shop. We kindly request that you visit
						the form and review the order of the filters.
					</p>
					<p>
						<Button variant='link' href={migrationFormEditUrl}>
							Review the filters
						</Button>{' '}
						|{' '}
						<Button
							variant='link'
							href={migrationDocUrl}
							target='_blank'
						>
							Learn more about migration
						</Button>{' '}
						|{' '}
						<Button variant='link' onClick={handleDismissNotice}>
							I understand, remove the notice
						</Button>
					</p>
				</div>
			)}

			{proUpgradeNotice && (
				<div className='notice notice-error pro-upgrade-notice'>
					<p dangerouslySetInnerHTML={{ __html: proUpgradeNotice }} />
				</div>
			)}
		</>
	);
};

export default V4MigrationNotice;
