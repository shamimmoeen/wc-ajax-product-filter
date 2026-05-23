#!/usr/bin/env bash
# Runs PHPUnit. From the host, execs into the wpcli container; from inside a
# container, runs phpunit directly. Argument forwarding via "$@" — works with
# `composer test -- --filter=SmokeTest`, `bin/test.sh --debug`, etc.

set -euo pipefail

if [ -f /.dockerenv ]; then
	exec vendor/bin/phpunit "$@"
fi

exec docker compose exec -T \
	-w /var/www/html/wp-content/plugins/wc-ajax-product-filter \
	wpcli vendor/bin/phpunit "$@"
