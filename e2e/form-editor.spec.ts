import { test, expect } from './utils/fixtures';
import type { Page } from '@playwright/test';
import { deleteAllForms, seedForm } from './utils/wp';
import { isPro } from './utils/env';

const editorUrl = ( id: number ) => `/wp-admin/admin.php?page=wcapf&id=${ id }`;

// Clicking Save fires an async POST; wait for the response before asserting or
// reloading, otherwise a navigation aborts the in-flight save (see settings.spec).
async function saveForm( page: Page ): Promise< void > {
	const saved = page.waitForResponse(
		( r ) =>
			r.url().includes( '/wcapf/v1/forms/' ) &&
			r.request().method() === 'POST'
	);
	await page.locator( '.__save_button' ).click();
	await saved;
}

test.describe( 'form editor', () => {
	let formId: number;

	test.beforeEach( () => {
		deleteAllForms();
		formId = seedForm( 'Editor E2E' );
	} );

	// Baseline: the editor hydrates from GET /forms/{id} without a fatal (the
	// fixture fails the test on any pageerror / 5xx).
	test( 'opens and hydrates without a fatal', async ( { page } ) => {
		await page.goto( editorUrl( formId ) );

		await expect( page.locator( '.__title_wrapper input' ) ).toHaveValue(
			'Editor E2E'
		);
		await expect(
			page.getByRole( 'tab', { name: 'Filters' } )
		).toBeVisible();
		await expect(
			page.getByRole( 'tab', { name: 'Settings' } )
		).toBeVisible();
	} );

	// Core save flow: adding a filter makes the form dirty (Publish → Save) and
	// the save round-trip succeeds (dirty clears back to Publish). Covers the
	// dirty-tracking signal the migration must preserve.
	test( 'adding a filter goes dirty and saves', async ( { page } ) => {
		await page.goto( editorUrl( formId ) );

		const filters = page.locator( '.__form_filters .__item' );
		const saveBtn = page.locator( '.__save_button' );

		// Wait for the initial fetch(es) to settle before interacting — a late
		// GET would otherwise overwrite the just-added filter with the server's
		// (empty) list.
		await page.waitForLoadState( 'networkidle' );

		await expect( filters ).toHaveCount( 0 );
		await expect( saveBtn ).toContainText( 'Publish' ); // clean

		await page.locator( '.__add_filter_btn' ).click();
		await expect( filters ).toHaveCount( 1 );
		await expect( saveBtn ).toContainText( 'Save' ); // dirty

		await saveForm( page );
		await expect( saveBtn ).toContainText( 'Publish' ); // saved → dirty cleared
	} );

	// Settings tab: changing a form setting goes through useFormSettings and
	// marks the form dirty. Pro-only — every form setting is pro-gated/disabled
	// in free (the gating itself is covered below).
	test( 'changing a form setting marks the form dirty', async ( { page } ) => {
		test.skip( ! isPro, 'Form settings are pro-gated/disabled in free.' );

		await page.goto( editorUrl( formId ) );
		await page.waitForLoadState( 'networkidle' );

		await page.getByRole( 'tab', { name: 'Settings' } ).click();

		const saveBtn = page.locator( '.__save_button' );
		await expect( saveBtn ).toContainText( 'Publish' ); // clean

		const accordion = page.locator( '#form_accordion' );
		await accordion.setChecked( ! ( await accordion.isChecked() ) );

		await expect( saveBtn ).toContainText( 'Save' ); // dirty
	} );

	// Pro/free boundary: the "Priority" form setting is pro-only.
	test( 'the Priority form setting is pro-only', async ( { page } ) => {
		await page.goto( editorUrl( formId ) );
		await page.waitForLoadState( 'networkidle' );

		await page.getByRole( 'tab', { name: 'Settings' } ).click();

		const priority = page
			.locator( '#wcapf-form-admin-ui' )
			.getByText( 'Priority', { exact: true } );

		if ( isPro ) {
			await expect( priority ).toBeVisible();
		} else {
			await expect( priority ).toHaveCount( 0 );
		}
	} );
} );
