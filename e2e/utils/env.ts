import { readFileSync } from 'node:fs';

// Derive the target from the repo this suite runs in (by its package.json name),
// so the wp-cli reset (which targets the cwd's Docker project) and the browser
// baseURL always point at the same site. Pro defaults to :8080, free to :8081.
// Run from the repo root, which is where npm/Playwright set the cwd.
const pkgName = (
	JSON.parse( readFileSync( 'package.json', 'utf-8' ) ) as { name: string }
).name;

const isFree = pkgName === 'wc-ajax-product-filter';

export const isPro = process.env.WCAPF_E2E_PRO
	? process.env.WCAPF_E2E_PRO === 'true'
	: ! isFree;

export const baseURL =
	process.env.WCAPF_E2E_URL ||
	`http://localhost:${ isFree ? '8081' : '8080' }`;
