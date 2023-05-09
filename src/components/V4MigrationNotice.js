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
							WC Ajax Product Filter - V4 Migration Notice
						</strong>
					</p>
					<p>
						The plugin has been upgraded to v4. We have changed the
						admin UI and refactored the codes for better performance
						and easier future improvements. As a migration process,
						a form has been created automatically with all the
						existing filters of your shop. You are requested to
						check the order of filters by visiting the form.
					</p>
					<p>
						<Button variant='link' href={migrationFormEditUrl}>
							Check the order of filters
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
							WC Ajax Product Filter Pro - Upgrade Required
						</strong>
					</p>
					<p>
						Thank you for using the pro version. WC Ajax Product
						Filter v4 requires you to upgrade WC Ajax Product Filter
						Pro to v2.0.0. Please upgrade.
					</p>
				</div>
			)}
		</>
	);
};

export default V4MigrationNotice;
