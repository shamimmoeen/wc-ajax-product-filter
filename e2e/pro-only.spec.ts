import { test, expect } from '@playwright/test';
import { deleteAllForms, seedForm } from './utils/wp';
import { isPro } from './utils/env';

/**
 * Verifies pro-only features are present in the pro build and absent in free.
 * isPro auto-detects from the repo (pro repo -> true, free repo -> false), so
 * just run `npm run test:e2e` in each repo.
 */
const FORMS_PAGE = '/wp-admin/admin.php?page=wcapf';

test.describe( 'pro-only forms-list UI', () => {
	test.beforeEach( () => {
		deleteAllForms();
		seedForm();
	} );

	test( 'the duplicate action is pro-only in the forms list UI', async ( {
		page,
	} ) => {
		await page.goto( FORMS_PAGE );

		const buttons = page
			.locator( '.__forms_table tbody tr' )
			.first()
			.getByRole( 'button' );

		// Counting role=button only (Edit has an href, so it renders as a link).
		// Free: delete, shortcode (2). Pro: + duplicate (3).
		await expect( buttons ).toHaveCount( isPro ? 3 : 2 );
	} );
} );

test( 'the duplicate REST route is registered only in pro', async ( {
	request,
} ) => {
	// A non-existent id, so this never mutates data. We only care whether the
	// route exists: free returns "rest_no_route"; pro matches the route and
	// fails later (auth/missing form), so its code is never "rest_no_route".
	const res = await request.post(
		'/wp-json/wcapf/v1/forms/999999/duplicate'
	);
	const body = await res.json();

	if ( isPro ) {
		expect( body.code ).not.toBe( 'rest_no_route' );
	} else {
		expect( body.code ).toBe( 'rest_no_route' );
	}
} );
