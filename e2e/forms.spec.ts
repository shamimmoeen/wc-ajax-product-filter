import { test, expect } from '@playwright/test';
import { deleteAllForms, seedForm } from './utils/wp';
import { isPro } from './utils/env';

const FORMS_PAGE = '/wp-admin/admin.php?page=wcapf';

test.describe( 'creating and deleting a form', () => {
	// Start empty so creation is allowed (free caps at one form).
	test.beforeEach( () => deleteAllForms() );

	test( 'a form can be created, persists across reload, and can be deleted', async ( {
		page,
	} ) => {
		const title = `E2E ${ Date.now() }`;

		await page.goto( FORMS_PAGE );

		// Create.
		await page.getByRole( 'button', { name: 'Add New' } ).click();
		await page.getByPlaceholder( 'Enter form title' ).fill( title );
		await page.getByRole( 'button', { name: 'Next' } ).click();
		await expect( page.getByText( 'Form was created' ) ).toBeVisible();

		// Persists across a reload.
		await page.goto( FORMS_PAGE );
		const row = page.getByRole( 'row' ).filter( { hasText: title } );
		await expect( row ).toBeVisible();

		// Delete it (delete is the first action button in every build).
		await row.getByRole( 'button' ).first().click();
		await page.getByRole( 'button', { name: 'Yes' } ).click();
		await expect(
			page.getByRole( 'row' ).filter( { hasText: title } )
		).toHaveCount( 0 );
	} );
} );

test.describe( 'duplicating a form', () => {
	// Exactly one form to act on.
	test.beforeEach( () => {
		deleteAllForms();
		seedForm();
	} );

	test( 'clicking duplicate opens the confirm modal', async ( { page } ) => {
		test.skip( ! isPro, 'Duplicate is a pro-only feature.' );

		await page.goto( FORMS_PAGE );

		// Pro action order: delete(0), duplicate(1), shortcode(2), edit-link.
		const row = page.locator( '.__forms_table tbody tr' ).first();
		await row.getByRole( 'button' ).nth( 1 ).click();

		await expect( page.getByText( 'Duplicate Form?' ) ).toBeVisible();
	} );
} );
