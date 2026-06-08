import { test, expect } from './utils/fixtures';
import type { Page, Locator } from '@playwright/test';
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

// Saves and returns the POST request body. Asserting on the payload the store
// assembled — rather than reloading and reading it back — sidesteps the post-save
// read lag (a just-saved filter is briefly invisible to a fresh GET) and pins the
// exact thing the migration can break: store state → save payload.
async function saveAndCapturePayload( page: Page ): Promise< any > {
	const request = page.waitForRequest(
		( r ) =>
			r.url().includes( '/wcapf/v1/forms/' ) && r.method() === 'POST'
	);
	const response = page.waitForResponse(
		( r ) =>
			r.url().includes( '/wcapf/v1/forms/' ) &&
			r.request().method() === 'POST'
	);
	await page.locator( '.__save_button' ).click();
	const req = await request;
	await response; // let the save settle so teardown doesn't abort it
	return req.postDataJSON();
}

// Adds a filter (always a taxonomy filter — newFilterData picks the first unused
// taxonomy) and returns its row.
async function addFilter( page: Page ): Promise< Locator > {
	const rows = page.locator( '.__form_filters .__item' );
	const before = await rows.count();
	await page.locator( '.__add_filter_btn' ).click();
	await expect( rows ).toHaveCount( before + 1 );
	return rows.nth( before );
}

// Switches a freshly-added row to a different filter type via its react-select
// "Filter Type" dropdown (the menu renders inline, not portaled).
async function setFilterType( row: Locator, label: string ): Promise< void > {
	await row.locator( '.type .__react_select__control' ).click();
	await row.locator( '.type' ).getByText( label, { exact: true } ).click();
}

// Types a filter key into a row and commits it. The field-key field uses
// InputFieldWithBlur, so the value reaches the store on blur, not per keystroke.
async function setFieldKey( row: Locator, key: string ): Promise< void > {
	const input = row.locator( 'input[id^="field_key-"]' );
	await input.fill( key );
	await input.blur();
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

	// Validation: a filter key that collides with another filter's key blocks the
	// save entirely (no POST) and surfaces both error displays. This is the path
	// the store migration regressed once — the validator has to write the validated
	// filters back through setFilters so the row can render field_key_error, and
	// setFilterStates has to expand the offending row. Build the collision with a
	// Price filter (its default key is the constant 'price') and a Category filter
	// whose key is typed as 'price'.
	test( 'a colliding filter key blocks save and flags the offending row', async ( {
		page,
	} ) => {
		await page.goto( editorUrl( formId ) );
		await page.waitForLoadState( 'networkidle' );

		const rows = page.locator( '.__form_filters .__item' );

		const priceRow = await addFilter( page );
		await setFilterType( priceRow, 'Price' );

		const categoryRow = await addFilter( page );
		await setFieldKey( categoryRow, 'price' );

		// The save must short-circuit before any network round-trip.
		let posted = false;
		page.on( 'request', ( r ) => {
			if (
				r.url().includes( '/wcapf/v1/forms/' ) &&
				r.method() === 'POST'
			) {
				posted = true;
			}
		} );
		await page.locator( '.__save_button' ).click();

		// Top-level "fix the errors" notice.
		await expect(
			page.locator( '.components-notice', {
				hasText: 'Please fix the errors below.',
			} )
		).toBeVisible();

		// Exactly one inline key-in-use error — on the category row, not the price
		// row (a filter with an empty key uses its default and is never flagged).
		await expect(
			page.locator( '.components-notice', {
				hasText: 'Filter key is in use by another entity.',
			} )
		).toHaveCount( 1 );

		expect( posted ).toBe( false );

		// The offending (category) row is expanded; the valid (price) row collapsed
		// — a collapsed row renders no accordion body.
		await expect( categoryRow.locator( '.__accordion_body' ) ).toBeVisible();
		await expect( priceRow.locator( '.__accordion_body' ) ).toHaveCount( 0 );
	} );

	// Edit round-trip: a key edited in the UI reaches the save payload. Asserting on
	// the payload (not a reload) avoids the post-save read lag and pins the indexed
	// updateFilter → saveForm path the migration rewrote.
	test( 'an edited filter key is carried into the save payload', async ( {
		page,
	} ) => {
		await page.goto( editorUrl( formId ) );
		await page.waitForLoadState( 'networkidle' );

		const row = await addFilter( page );
		await setFieldKey( row, 'my-custom-key' );

		const body = await saveAndCapturePayload( page );

		expect( body.filters ).toHaveLength( 1 );
		expect( body.filters[ 0 ].field_key ).toBe( 'my-custom-key' );
	} );

	// Delete: removing a row drops it from the payload, and the right one survives.
	// Both filters are unsaved (no id), so delete is a pure removeFilter — no DELETE
	// round-trip.
	test( 'deleting a filter removes it from the save payload', async ( {
		page,
	} ) => {
		await page.goto( editorUrl( formId ) );
		await page.waitForLoadState( 'networkidle' );

		const rows = page.locator( '.__form_filters .__item' );

		const keepRow = await addFilter( page );
		await setFieldKey( keepRow, 'keep-me' );

		const dropRow = await addFilter( page );
		await dropRow
			.getByRole( 'button', { name: 'Delete', exact: true } )
			.click();
		await page
			.locator( '.__remove_popover' )
			.getByRole( 'button', { name: 'Delete', exact: true } )
			.click();
		await expect( rows ).toHaveCount( 1 );

		const body = await saveAndCapturePayload( page );

		expect( body.filters ).toHaveLength( 1 );
		expect( body.filters[ 0 ].field_key ).toBe( 'keep-me' );
	} );

	// Title round-trip: an edited title reaches the save payload. Guards the
	// handleTitleChange path — setTitle must store the new value, not the old one.
	test( 'an edited title is carried into the save payload', async ( {
		page,
	} ) => {
		await page.goto( editorUrl( formId ) );
		await page.waitForLoadState( 'networkidle' );

		const titleInput = page.locator( '.__title_wrapper input' );
		await titleInput.selectText();
		await titleInput.pressSequentially( 'Renamed by E2E' );

		// The input is controlled off store title, so it only reads back the new
		// value once setTitle has committed — assert that before saving.
		await expect( titleInput ).toHaveValue( 'Renamed by E2E' );
		await expect( page.locator( '.__save_button' ) ).toContainText( 'Save' );

		const body = await saveAndCapturePayload( page );

		expect( body.title ).toBe( 'Renamed by E2E' );
	} );

	// Settings slice → payload: changing a form setting reaches the save payload.
	// The dirty-tracking test only proves the change registers; this proves the
	// formSettings slice is actually assembled into the POST body. Pro-only.
	test( 'a changed form setting is carried into the save payload', async ( {
		page,
	} ) => {
		test.skip( ! isPro, 'Form settings are pro-gated/disabled in free.' );

		await page.goto( editorUrl( formId ) );
		await page.waitForLoadState( 'networkidle' );

		await page.getByRole( 'tab', { name: 'Settings' } ).click();

		const accordion = page.locator( '#form_accordion' );
		const next = ! ( await accordion.isChecked() );
		await accordion.setChecked( next );

		// Let the toggle commit to state before saving.
		await expect( page.locator( '.__save_button' ) ).toContainText( 'Save' );

		const body = await saveAndCapturePayload( page );

		expect( body.settings.form_accordion ).toBe( next ? '1' : '' );
	} );

	// Hydrate-back: a saved filter comes back on reload. Every other test seeds an
	// empty form, so this is the only coverage of the resolver running
	// transformFormData over real saved data (id-bearing filter → row + key).
	// Re-fetch on a retry loop because a just-saved filter is briefly invisible to a
	// fresh GET (the post-save read lag).
	test( 'a saved filter hydrates on reload', async ( { page } ) => {
		await page.goto( editorUrl( formId ) );
		await page.waitForLoadState( 'networkidle' );

		const row = await addFilter( page );
		await setFieldKey( row, 'hydrate-key' );
		await saveForm( page );

		await page.goto( editorUrl( formId ) );
		await page.waitForLoadState( 'networkidle' );

		const rows = page.locator( '.__form_filters .__item' );
		await expect( rows ).toHaveCount( 1 );
		await expect( rows.first().locator( '.__key' ) ).toContainText(
			'hydrate-key'
		);
	} );
} );
