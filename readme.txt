=== WC Ajax Product Filter ===
Contributors: shamimmoeen
Tags: product filter, ajax product filter, ajax filter, woocommerce ajax product filter, woocommerce product filter, woocommerce ajax filter, woocommerce filter, products filter, ajax filter, advanced products filter, woocommerce layered nav, woocommerce layered navigation, ajax filtered nav, ajax filtered navigation, price filter, ajax price filter, ajax product search, woocommerce product sorting, woocommerce, wc ajax product filter, wc product filter, wc ajax filter, wc filter
Requires at least: 4.0
Tested up to: 6.0.2
Stable tag: 3.3.0
Requires PHP: 5.5
License: GPLv3
License URI: https://www.gnu.org/licenses/gpl-3.0.html

WooCommerce Ajax Product Filter - adds advanced product filtering to your shop.

== Description ==

WooCommerce Ajax Product Filter – is a plugin that allows you to filter your products easily by categories, attributes, prices, and post metas. You can sort products, and navigate to the next and previous pages without reloading the page.

[Free Demo](https://demos.wptools.io/wc-ajax-product-filter/) | [Paid Demo](https://demos.wptools.io/wc-ajax-product-filter-pro/)

== Features: ==

* Filter by category, tag, attribute, price, rating
* Filter by product status (featured, on-sale)
* Unlimited filters
* Option to set the filter key
* Display the filter using shortcode
* Display filter values using checkbox, radio, select, multi-select, label
* Display categories as hierarchical tree
* Option to enable/disable accordion in hierarchy tree
* Updates the product count according to the applied filters
* Option to exclude the filter items having no product
* Sort products via ajax
* Display the active filters
* Reset filters button
* Ajax pagination
* jQuery chosen plugin for select boxes
* Fastest filtering
* SEO friendly url (HTML5 pushstate)
* Works with caching plugins and all majority of themes
* Fully responsive
* Easy to modify the CSS to better fit your theme style
* Developer friendly - contains useful hooks and filters

== Pro Features: ==

* Filter by custom taxonomy
* Filter by post meta
* Filter by post property (author, date, modified)
* Filter by vendors (WCFM - WooCommerce Multivendor Marketplace by WC Lovers)
* Filter to sort the products using post table columns and meta value
* Products per page filter
* Display the filter values using color, image
* Display the price ranges using checkbox, radio, select, multi-select, label
* Use term slug as the filter value
* Display the child terms for the specific parent term
* Option to include/exclude terms
* Limit terms using child term only
* Choose the ordering of terms
* Display filters in accordion
* Clear button in filter title
* Show more/show less button in filter items to minimize the filter height

[Get the pro version](https://wptools.io/wc-ajax-product-filter/?utm_source=wordpress.org&utm_medium=free+plugin+listing&utm_campaign=WCAPF+Pro+Upgrade)

== Frequently Asked Questions ==

= How do I create a filter? =

Once the plugin is activated, go to **WCAPF** > **Add New** from WordPress admin. Chose a filter from the available filters, give a unique filter key, configure the filter settings and publish the filter.

= How do I display the filters to the store? =

The filters can be displayed using both shortcode and widget. The shortcode is `[wcapf_filter id="*"]`, where id is the filter post id.

= Why does the product attribute count not right? =

Go to **WooCommerce** > **Status** > **Tools** from WordPress admin. At the bottom, there is a section called **Regenerate the product attributes lookup table**. Click on the **Regenerate** button on that section.

= Why does the filter not working? =

If you have problems with the work of the plugin you should follow these steps:

* Ensure that WordPress and WooCommerce versions are met the plugin’s minimum required versions.
* Test the plugin with a default WordPress theme. If the plugin works with the default themes then the issue is coming from the theme that you are using.
* Deactivate all your plugins and then re-activate them one by one, checking your site for the problem after each reactivation.

== Screenshots ==

1. Demo (Free Version)
2. Demo (Pro Version)
3. Filters list (admin view)
4. Active filters settings
5. Category filter settings
6. Tag filter settings
7. Attribute filter settings
8. Price filter settings
9. Rating filter settings
10. Product status filter settings
11. Reset filters button settings
12. Plugin settings

== Changelog ==

= 3.3.0 =

* Feature - Option to specify user roles for post author filter

= 3.2.0 =

* Fix - custom loading image issue

= 3.1.0 =

* Fix - loading image upload button js issue
* Fix - product sorting via ajax issue
* Fix - products count result not updating issue

= 3.0.0 =

* Release pro version
* Refactor the plugin

= 2.0.3 =

* Fixed bug - 'wcapf_get_term_objects' function was working incorrectly

= 2.0.2 =

* Added option to disable transients
* Added option to clear transients

= 2.0.1 =

* Fixed filtering bugs on product taxonomy pages
* Added more functionality to price filter display type list widget
* Added option to enable/disable font awesome
* Updated localization

= 2.0 =

* Fixed PHP version related issue
* Fixed translation and localization issue
* Fixed compatibility issue with WooCommerce Average Rating Filter
* Added functionality to filter products by price list
* Added functionality to clear all active filters with one click

= 1.0 =

* Initial release
