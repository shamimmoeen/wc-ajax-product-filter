import { Button } from '@wordpress/components';
import { showProV2UpgradeNotice } from './utils';

const showMigrationNotice = wcapf_admin_params.show_v4_migration_notice;
const migrationFormEditUrl = wcapf_admin_params.v4_migrated_form_url;
const migrationDocUrl = wcapf_admin_params.v4_migration_doc_url;
const showProUpgradeNotice = showProV2UpgradeNotice();

const V4MigrationNotice = () => {
	const handleDismissNotice = () => {
		removeWCAPFMigrationNotice();
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
							WCAPF - WooCommerce Ajax Product Filter (v4.0.0
							Migration Notice)
						</strong>
					</p>
					<p>
						The <i>WC Ajax Product Filter</i> plugin has been
						upgraded to v4.0.0 and is now named{' '}
						<i>WCAPF - WooCommerce Ajax Product Filter</i>. We have
						redesigned the admin UI to provide a more intuitive user
						experience and refactored the codebase for improved
						performance and easier future enhancements. As part of
						the migration process, a form has been automatically
						created with all the existing filters from your shop. We
						kindly request that you visit the form and review the
						order of the filters.
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

			{showProUpgradeNotice && (
				<div className='notice notice-info v4-upgrade-notice'>
					<p>
						<strong>
							WCAPF - WooCommerce Ajax Product Filter Pro (Upgrade
							Required)
						</strong>
					</p>
					<p>
						Thank you for using the Pro version. To ensure
						compatibility with{' '}
						<i>WCAPF - WooCommerce Ajax Product Filter</i> v4.0.0,
						it is necessary to upgrade{' '}
						<i>WCAPF - WooCommerce Ajax Product Filter Pro</i> to
						v2.0.0. Please proceed with the upgrade.
					</p>
				</div>
			)}
		</>
	);
};

export default V4MigrationNotice;
