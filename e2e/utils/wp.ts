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

/** Deletes every form so a test starts from a known empty state. */
export function deleteAllForms(): void {
	const ids = wpCli(
		'post list --post_type=wcapf-form --post_status=any --field=ID --format=ids'
	);

	if ( ids ) {
		wpCli( `post delete ${ ids } --force` );
	}
}

/** Creates one form so tests that need an existing row are deterministic. */
export function seedForm( title = 'E2E Seed' ): void {
	wpCli(
		`post create --post_type=wcapf-form --post_status=publish --post_title='${ title }'`
	);
}

/** Reverts settings to defaults by deleting the stored option. */
export function resetSettings(): void {
	try {
		wpCli( 'option delete wcapf_settings' );
	} catch {
		// The option may not exist yet — that's the default state already.
	}
}

/** Seeds the settings option with a known JSON payload (merged over defaults). */
export function setSettings( json: string ): void {
	wpCli( `option update wcapf_settings --format=json '${ json }'` );
}
