import { execSync } from 'node:child_process';

/**
 * Runs a wp-cli command in the Docker `wpcli` container of the current repo.
 * Resolves the compose project from the working directory, so the pro suite
 * targets the pro site and the free suite targets the free site.
 */
function wpCli( args: string ): string {
	return execSync( `docker compose exec -T wpcli wp --allow-root ${ args }`, {
		encoding: 'utf-8',
	} ).trim();
}

/**
 * Deletes every form (and its filters) so a test starts from a known empty
 * state. Deleting the form post directly doesn't cascade to its child
 * wcapf-filter posts (the REST route does), so remove those too — otherwise
 * orphaned filters linger and pollute the global filter-keys list.
 */
export function deleteAllForms(): void {
	const formIds = wpCli(
		'post list --post_type=wcapf-form --post_status=any --field=ID --format=ids',
	);

	if ( formIds ) {
		wpCli( `post delete ${ formIds } --force` );
	}

	const filterIds = wpCli(
		'post list --post_type=wcapf-filter --post_status=any --field=ID --format=ids',
	);

	if ( filterIds ) {
		wpCli( `post delete ${ filterIds } --force` );
	}
}

/** Creates one form and returns its post ID (for opening the editor directly). */
export function seedForm( title = 'E2E Seed' ): number {
	const id = wpCli(
		`post create --post_type=wcapf-form --post_status=publish --post_title='${ title }' --porcelain`,
	);

	return parseInt( id, 10 );
}

/** Reverts settings to defaults by removing the stored option. */
export function resetSettings(): void {
	// delete_option is silent and idempotent (returns false on a missing
	// option, prints nothing). The `wp option delete` command instead warns
	// when the option is absent — the very state a reset wants — so use eval.
	wpCli( `eval 'delete_option("wcapf_settings");'` );
}

/** Seeds the settings option with a known JSON payload (merged over defaults). */
export function setSettings( json: string ): void {
	wpCli( `option update wcapf_settings --format=json '${ json }'` );
}
