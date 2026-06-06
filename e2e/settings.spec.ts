import { test, expect, type Page } from '@playwright/test';
import { resetSettings, setSettings } from './utils/wp';
import { isPro } from './utils/env';

const SETTINGS_PAGE = '/wp-admin/admin.php?page=wcapf-settings';

const saveButton = ( page: Page ) =>
	page.getByRole( 'button', { name: 'Save' } );

test.describe( 'settings', () => {
	test.beforeEach( () => resetSettings() );

	// T1 — hydration: the UI reflects what's stored, independent of the save path.
	test( 'loads with the saved value', async ( { page } ) => {
		setSettings( '{"disable_ajax":"1"}' );

		await page.goto( SETTINGS_PAGE );

		await expect( page.getByLabel( 'Disable Ajax' ) ).toBeChecked();
	} );

	// T2 — dirty tracking: Save is gated by unsaved changes.
	test( 'Save enables on change and disables again after saving', async ( {
		page,
	} ) => {
		await page.goto( SETTINGS_PAGE );
		await expect( saveButton( page ) ).toBeDisabled();

		const ajax = page.getByLabel( 'Disable Ajax' );
		await ajax.setChecked( ! ( await ajax.isChecked() ) );
		await expect( saveButton( page ) ).toBeEnabled();

		await saveButton( page ).click();
		await expect( saveButton( page ) ).toBeDisabled(); // save done, dirty cleared
	} );

	// T3 — persistence: a changed setting survives a reload (the core round-trip).
	test( 'a changed setting persists across reload', async ( { page } ) => {
		await page.goto( SETTINGS_PAGE );

		const ajax = page.getByLabel( 'Disable Ajax' );
		const next = ! ( await ajax.isChecked() );
		await ajax.setChecked( next );

		await saveButton( page ).click();
		await expect( saveButton( page ) ).toBeDisabled(); // wait for save

		await page.goto( SETTINGS_PAGE );
		await expect( page.getByLabel( 'Disable Ajax' ) ).toBeChecked( {
			checked: next,
		} );
	} );

	// T4 — multi-tab: settings from different tabs all persist in one save.
	// (Catches a migration that drops a non-current tab's settings from the payload.)
	test( 'settings changed across multiple tabs all persist', async ( {
		page,
	} ) => {
		await page.goto( SETTINGS_PAGE );

		// General tab (shown by default).
		const ajax = page.getByLabel( 'Disable Ajax' );
		const ajaxNext = ! ( await ajax.isChecked() );
		await ajax.setChecked( ajaxNext );

		// Miscellaneous tab.
		await page.getByRole( 'tab', { name: 'Miscellaneous' } ).click();
		const debug = page.getByLabel( 'Debug Mode' );
		const debugNext = ! ( await debug.isChecked() );
		await debug.setChecked( debugNext );

		await saveButton( page ).click();
		await expect( saveButton( page ) ).toBeDisabled();

		// Reload: both persisted.
		await page.goto( SETTINGS_PAGE );
		await expect( page.getByLabel( 'Disable Ajax' ) ).toBeChecked( {
			checked: ajaxNext,
		} );
		await page.getByRole( 'tab', { name: 'Miscellaneous' } ).click();
		await expect( page.getByLabel( 'Debug Mode' ) ).toBeChecked( {
			checked: debugNext,
		} );
	} );

	// T7 — pro/free boundary: a pro-only phrase field is present in pro, absent in free.
	test( 'the per-filter clear button label is a pro-only setting', async ( {
		page,
	} ) => {
		await page.goto( SETTINGS_PAGE );
		await page.getByRole( 'tab', { name: 'Phrases' } ).click();

		const proPhrase = page.getByText( 'Clear button label', {
			exact: true,
		} );

		if ( isPro ) {
			await expect( proPhrase ).toBeVisible();
		} else {
			await expect( proPhrase ).toHaveCount( 0 );
		}
	} );
} );
