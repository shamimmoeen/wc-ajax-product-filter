import { test as base, expect } from '@playwright/test';

/**
 * Base test extended with an auto fixture that fails the test on any uncaught
 * page error (a JS exception / React crash) or any 5xx response. Catches PHP
 * fatals and editor crashes that would otherwise pass silently — most valuable
 * on the form editor, which renders server-fetched data through many components.
 *
 * Tests that legitimately expect a 5xx should import the base `test` from
 * `@playwright/test` instead.
 */
export const test = base.extend< { _failOnFatal: void } >( {
	_failOnFatal: [
		async ( { page }, use ) => {
			const fatals: string[] = [];

			page.on( 'pageerror', ( err ) =>
				fatals.push( `pageerror: ${ err.message }` )
			);
			page.on( 'response', ( res ) => {
				if ( res.status() >= 500 ) {
					fatals.push( `HTTP ${ res.status() }: ${ res.url() }` );
				}
			} );

			await use();

			expect(
				fatals,
				`Uncaught page errors / 5xx responses:\n${ fatals.join( '\n' ) }`
			).toEqual( [] );
		},
		{ auto: true },
	],
} );

export { expect };
