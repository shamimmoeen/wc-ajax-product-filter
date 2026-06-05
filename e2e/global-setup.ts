import { chromium, type FullConfig } from '@playwright/test';
import { baseURL } from './utils/env';

/**
 * Logs in once as admin and saves the session so every test starts
 * authenticated (no per-test login).
 */
async function globalSetup( _config: FullConfig ) {
	const browser = await chromium.launch();
	const page = await browser.newPage();

	await page.goto( `${ baseURL }/wp-login.php` );
	await page.fill( '#user_login', 'admin' );
	await page.fill( '#user_pass', 'password' );
	await page.click( '#wp-submit' );
	await page.waitForURL( '**/wp-admin/**' );

	await page.context().storageState( { path: 'e2e/.auth/admin.json' } );
	await browser.close();
}

export default globalSetup;
