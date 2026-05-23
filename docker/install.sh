#!/usr/bin/env bash
# Set up the WCAPF Docker dev environment from a clean state.
#
# Usage: bash docker/install.sh
#
# Idempotent — safe to re-run. Re-running after a `docker compose down -v` gives
# a fresh install with sample products.

set -euo pipefail

# Load .env so settings are available.
# Parsed manually rather than `source`d so shell-special characters in values
# don't break the shell.
if [ -f .env ]; then
	while IFS='=' read -r key value || [ -n "$key" ]; do
		case "$key" in
			''|\#*) continue ;;
		esac
		case "$value" in
			\"*\") value="${value#\"}"; value="${value%\"}" ;;
			\'*\') value="${value#\'}"; value="${value%\'}" ;;
		esac
		export "$key=$value"
	done < .env
fi

SITE_URL="${SITE_URL:-http://localhost:${WCAPF_HTTP_PORT:-8081}}"

wpc() {
	docker compose exec -T wpcli wp --allow-root "$@"
}

if wpc core is-installed 2>/dev/null; then
	echo "==> WordPress is already installed. Skipping install."
else
	echo "==> Installing WordPress..."
	wpc core install \
		--url="$SITE_URL" \
		--title='WCAPF Dev' \
		--admin_user=admin --admin_password=password \
		--admin_email=admin@example.test --skip-email

	echo "==> Setting pretty permalinks..."
	wpc rewrite structure '/%postname%/'
fi

echo "==> Activating theme..."
wpc theme activate twentytwentyfive

echo "==> Activating plugins..."
wpc plugin activate woocommerce wc-ajax-product-filter query-monitor

if [ "$(wpc post list --post_type=product --post_status=publish --format=count 2>/dev/null || echo 0)" -gt 0 ]; then
	echo "==> Sample products already imported. Skipping."
else
	echo "==> Installing WordPress Importer..."
	wpc plugin install wordpress-importer --activate

	echo "==> Importing WooCommerce sample products (WXR)..."
	wpc import \
		wp-content/plugins/woocommerce/sample-data/sample_products.xml \
		--authors=create
fi

echo ""
echo "Done. Open $SITE_URL/wp-admin/ (admin/password)"
