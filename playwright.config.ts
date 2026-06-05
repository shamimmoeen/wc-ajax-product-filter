import { defineConfig } from '@playwright/test';
import { baseURL } from './e2e/utils/env';

export default defineConfig( {
	testDir: './e2e',
	// Admin tests share one WordPress site, so run them serially.
	workers: 1,
	reporter: 'list',
	use: {
		baseURL,
		storageState: 'e2e/.auth/admin.json',
		trace: 'on-first-retry',
	},
	globalSetup: './e2e/global-setup.ts',
} );
