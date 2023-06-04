=== WCAPF - WooCommerce Ajax Product Filter ===
Contributors: shamimmoeen
Tags: product filter, ajax product filter, ajax filter, woocommerce ajax product filter, woocommerce product filter, woocommerce ajax filter, woocommerce filter, products filter, ajax filter, advanced products filter, woocommerce layered nav, woocommerce layered navigation, ajax filtered nav, ajax filtered navigation, price filter, ajax price filter, ajax product search, woocommerce product sorting, woocommerce, wc ajax product filter, wc product filter, wc ajax filter, wc filter
Requires at least: 4.0
Tested up to: 6.2
Stable tag: 4.0.0
Requires PHP: 5.5
License: GPLv3
License URI: https://www.gnu.org/licenses/gpl-3.0.html

WCAPF - WooCommerce Ajax Product Filter is a powerful plugin that enhances the filtering functionality of your WooCommerce store.

== Description ==

**WCAPF - WooCommerce Ajax Product Filter** is a powerful plugin that enhances the filtering functionality of your WooCommerce store. It allows your customers to easily find and narrow down their product search using a dynamic and interactive filter system. With Ajax-based filtering, the plugin provides instant results without page reloading, ensuring a smooth and seamless user experience.

== Filtering Options ==

- **Filter by Taxonomy:** Enable customers to filter products based on different taxonomies, such as categories, tags, and custom taxonomies.

- **Filter by Attribute:** Allow customers to refine their product search by attribute values like size, color, material, and more.

- **Filter by Price:** Provide a price range filter to help customers find products within their desired price range.

- **Filter by Rating:** Enable customers to filter products based on user ratings to find highly rated items.

- **Filter by Product Status:** Allow customers to filter products based on their status, such as featured or in-stock items.

- **Filter by Post-Author:** Provide the ability to filter products based on the author of the associated posts.

- **Filter by Post-Meta:** Offer customers the ability to filter products based on custom post metadata, with support for different value types like text, number, or date.

- **Sort by Filter:** Offer customers the option to sort products based on different criteria, enhancing their browsing experience.

- **Per Page Filter:** Allow customers to select the number of products displayed per page.

== Flexible Filter Display Options ==

- **Multiple Display Options:** Present filter options using checkboxes, radio buttons, dropdowns, multiselect, or labels.

- **Styling and Layout:** Choose from list, inline, grid, or hierarchical display for taxonomies, with accordion support for hierarchies.

- **Price Filter Options:** Provide a slider with min and max input fields for the price filter, or define custom price ranges displayed as checkboxes, radio buttons, or other options.

- **Product Count Display:** Show the number of products available for each filter option, helping customers gauge the product availability within their selected criteria.

- **Tooltip Information:** Display informative tooltips when customers hover over filter options, including product count information within the tooltip.

- **Automatic or Manual Filter Options:** Set filter options to be generated automatically or manually enter custom options, allowing for precise customization of labels and tooltips.

- **Options Ordering:** Define the order of filter options, including taxonomy, post-author, and post-meta filters. For taxonomy filters, order by ID, Name, Slug, Count, or Include Order. For post-author filters, order by ID, Name, Count, or Include Order. For post-meta filters, order by Value, Label, or Count.

- **Include/Exclude Options:** For taxonomy filters, include or exclude specific terms. If the taxonomy is hierarchical, set the parent term to limit the child terms displayed. Choose to include only immediate child terms or all child terms. For post-author filters, include or exclude specific users and specify user roles. For post-meta filters, include or exclude by values.

- **Accordion and Tooltip:** Implement accordion-style display for filters, allowing users to expand or collapse the filter options. When collapsed, the filter displays the filter title only, and when expanded, it shows the filter options. Additionally, use tooltip icons beside the filter titles to provide additional information about each filter option when users hover over them.

- **Search Field:** Include a search field for quick navigation through the filter options. Visitors can enter keywords in the search field to narrow down the available filter options, making it easier to find specific choices.

- **Show More/Show Less Toggle:** Provide a toggle option to show or hide additional filter options for better user experience. The toggle allows users to expand or collapse the filter options, reducing clutter and improving usability.

- **Max Height of Filter Block:** Set the maximum height of a filter block to limit the number of visible filter options. This feature helps users show more filters within a specific height, enhancing the browsing experience and avoiding overwhelming displays.

- **Color/Image Swatches:** Enhance the visual appeal of your filter options by displaying them using color or image swatches. For color swatches, the plugin looks for the color first and, if not found, displays the image. The color swatch data includes the primary color and secondary color, when both exist in the swatch data it enables the color gradient which is a more comprehensive visual representation. For image swatches, the data includes the image ID. For the **popular variation swatches plugins** the swatch data can be obtained from term meta automatically. Otherwise, you'll need to manually input the filter options and configure the swatch data.

== Advanced Filtering Functionality ==

- **Variable Product Filtering Support:** Ensure seamless filtering for variable products, including support for attribute lookup tables.

- **Ajax Pagination:** Enable seamless browsing with Ajax-based pagination, allowing customers to navigate through filtered results without page reloads.

- **Active Filters Display:** Showcase the active filters prominently above the product loop, making it easy for customers to see and modify their selections.

- **Active Sorting Option:** Enable AJAX for the default product sorting dropdown and display the active sorting option in the active filters section.

== Easy Integration ==
Effortlessly integrate the filters into your store using a single widget or shortcode. The plugin allows you to create filters by creating a form and adding filters inside it. The flexibility of the plugin allows you to create unlimited forms and filters according to your specific needs. By using the "**Available on**" setting, you can precisely determine where the filters should be displayed. Simply add the form widget (named '**WCAPF - Product Filter Form**') to the sidebar, and the filters will automatically appear based on the current template being used.

== Customizable Filter Keys in URL ==
Set the filter key used in the URL to identify the type of filter applied.

For example, in the URL **../?category=sneakers&material=mesh**, **category**, and **material** are the filer keys.

== Multi-Vendor Plugin Support ==
When enabled, the filter plugin supports multi-vendor setups by showing the store name as the filter option label. This allows customers to easily filter products from specific vendors or stores. Supported plugins like **WC Vendors** and **WCFM Marketplace**.

== Customization ==
Easily customize the appearance of the filters to match the design and style of your theme. The plugin provides a variety of settings on the plugin settings page, **including CSS variables**, which allow developers to quickly transform the global style of a filter to a unique style.

== Dynamic Product Count ==
Update the product count dynamically based on the applied filters, providing accurate and real-time information to customers, allowing customers to filter products with confidence and avoiding "no results found" messages.

== Hide/Disable Irrelevant Options ==
Streamline the filtering experience by hiding or disabling options that return zero products. The plugin offers the flexibility to either hide or disable irrelevant options based on the applied filters. By removing these options, users can focus on relevant choices, enhancing their browsing experience.

== Hide Empty Filters ==
Exclude empty filters from display to declutter the user interface. Empty filters that do not have any available options are automatically hidden, reducing visual noise and improving the usability of the filter system.

== Option to Disable Ajax Filtering ==
Provide flexibility to disable AJAX filtering if needed. While AJAX filtering is generally recommended for seamless browsing, users can choose to disable it to troubleshoot any potential JavaScript conflicts that may arise after updating the product loop.

== Compatible with Popular Themes ==
The plugin is compatible with a wide range of popular themes, including **Astra**, **Avada**, **Blocksy**, **Divi**, **Flatsome**, **GeneratePress**, **Hestia**, **Kadence**, **Neve**, **OceanWP**, **OnePress**, **Shapely**, **Storefront**, **Sydney**, **The7**, **Woostify**, and **Zakra**.

== Drag and Drop Filter Creation ==
The plugin provides a user-friendly interface for managing filters. You can easily create, customize, and organize filters using an intuitive drag-and-drop interface.

== Different Filters for Different Archive Pages ==
Tailor the filter options to specific product categories by displaying different filters on various archive pages. With this feature, you can create custom filter sets that cater to the unique requirements of different product categories.

For example, clothing filters may include options for *size* and *color*, while laptop filters may include options for *processor*, *motherboard*, *RAM*, and *hard disk*. By using different filters for different archive pages, you can enhance the filtering experience for your customers.

== Integration on Singular Pages ==
Integrate filters on singular pages by utilizing the `[wcapf_product_loop]` shortcode in conjunction with the form shortcode `[wcapf_form]`. This integration allows you to display products similarly to the shop page and effectively combines them with the filters.

The `[wcapf_product_loop]` shortcode leverages the popular **WooCommerce products shortcode**, providing extensive customization options. With the product loop, you can:

- Specify the layout (such as standard shop loop, products with pagination, or only products)
- Select the type of products to display (on sale, best selling, top rated)
- Define the visibility of products (visible, catalog, search, hidden, featured)
- Configure the product ordering
- Determine the number of columns for the grid layout
- Set the total number of displayed products
- Apply taxonomy and meta queries
- Exclude specific products
- Define a custom message when no products match the applied filters

== Useful Hooks and Filters ==
Take advantage of the provided hooks and filters for easy customization and extensibility. The plugin leverages the power of WordPress hooks and filters, making it easy for developers to customize and extend the functionality of the filters according to their specific requirements.

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

= 4.0.0 =

* Refactor the ADMIN UI

= 3.3.2 (04 January 2023) =

* Prevent redirect to product page while filtering on the search page and getting a single result.
* Fix SQL error caused by joining alias

= 3.3.1 (27 September 2022) =

* Make it compatible with woo-variation-swatches

= 3.3.0 (13 September 2022) =

* Feature - Option to specify user roles for post author filter

= 3.2.0 (01 August 2022) =

* Fix - custom loading image issue

= 3.1.0 (29 July 2022) =

* Fix - loading image upload button js issue
* Fix - product sorting via ajax issue
* Fix - products count result not updating issue

= 3.0.0 (17 July 2022) =

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

== Upgrade Notice ==

= 4.0.0 =

We're excited to announce the release of version 4.0.0 of the WooCommerce Ajax Product Filter plugin! This update brings several new features, improvements, and bug fixes to enhance your filtering experience. Here's what's included:

1. New Filtering Options: We've added additional filtering options to give you more control over your product searches. You can now filter products based on [specific criteria], providing even more precise results.

2. Enhanced Performance: Version 4.0.0 includes performance optimizations to ensure faster and smoother filtering. The plugin now handles large product catalogs more efficiently, reducing loading times and improving overall performance.

3. Updated User Interface: We've made visual enhancements to the filter elements, improving their appearance and making them more intuitive to use. The updated user interface provides a seamless and engaging filtering experience for your customers.

4. Improved Compatibility: We've further enhanced compatibility with popular WooCommerce themes and plugins, ensuring that the plugin works seamlessly with your existing setup. You can now take advantage of the advanced filtering features without any conflicts.

5. Bug Fixes: We've addressed several reported issues and resolved bugs to make the plugin more stable and reliable. We appreciate your feedback in helping us improve the overall quality of the plugin.

To upgrade to version 4.0.0, follow these steps:

1. Backup your current plugin files and database, just to be safe.
2. Deactivate and delete the existing WooCommerce Ajax Product Filter plugin from your WordPress site.
3. Download the latest version (4.0.0) of the plugin from [insert download link].
4. Upload and install the new plugin files to your WordPress site.
5. Activate the plugin.
6. Visit the plugin settings page to review and adjust any new options or settings introduced in version 4.0.0.

If you encounter any issues during the upgrade process or have any questions, don't hesitate to reach out to our support team at [support email or forum link].

We hope you enjoy the new features and improvements in version 4.0.0 of the WooCommerce Ajax Product Filter plugin. Thank you for your continued support!

