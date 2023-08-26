<?php

// Removed from filter settings
// -- hide_empty
// -- show_clear_button
// -- enable_soft_limit
// -- align_values_at_the_end
// -- min_value_auto_detect
// -- max_value_auto_detect
// -- use_chosen
// -- chosen_no_results_message
// -- only_parent (maybe it was not used)
// -- limit_values_by_id
// -- exclude_values_id

// Newly added to filter settings
// -- is_acf
// -- date_input_format
// -- help_text
// -- options_with_no_products
// -- enable_search_field
// -- search_field_placeholder
// -- enable_reduce_height
// -- max_height
// -- alignment
// -- auto_detect_min_max
// -- update_min_max
// -- text_before_min_value
// -- text_before_max_value
// -- format_numbers
// -- include_terms
// -- exclude_terms
// -- include_authors
// -- exclude_authors

// Post meta order by 'none' changed with 'default'

// Added to form settings
// -- show_clear_button
// -- clear_button_position

// Add to the plugin settings
// -- use_term_slug
// -- use_author_username
// -- author_roles
// -- disable_wcapf

?>
taxonomy>product_cat
taxonomy>product_tag
post-meta>_price>number
post-meta>_price>text
post-meta>_price>date

Tasks for tomorrow
==================
* Finish the chosen multiselect, single select (done)
* Finish the native select and multiselect design (done)
* Finish the label design (done)
* Finish the input type checkbox, radio design (done)
* Integrate stylish checkbox, radio (done)

In future release/not an issue for now
=======================================

* Maybe disable the filter inputs while results are fetching (not need anymore)
* Maybe try to use unique chosen selector to avoid style overriding comes from search & filter plugin
* The form widget is not showing in the templates page (not an issue anymore, wordpress fixed it in v6.2.2)
* Deselect filter option when again clicked for display type radio (maybe I saw this in variation swatches by emran ahmed)
* Add Search Field
* Use shop name in the url for the vendor filter
* Use the svg icons from using svg id like twenty-twenty-two/three theme
* Integrate animation for filters and hierarchy accordions

The label style in v3
======================
the heading size of filer group is 1em
prev label size 59.09 x 29.88 for blue color
prev label size 65.97 x 29.88 for blue large

21/12/2022
* Finish filter accordion, soft limit, hierarchy toggle (done)
* Finish loading icon, overlay, scroll to
* Auto update the price range
* SEO options - document title(pro), term slug, author slug
* Make the term selected in term archive page

05/01/2023
* Filter Tooltip (done)
* Filter Option Tooltip (done)
* Search filter options (done)

Backlogs
* Auto update the price range (done)
* SEO options - document title, term slug
* Make the term selected in term archive page

* Post author, include, exclude, role, order by
* rating filter
* taxonomy manual options custom label, tooltip, color, image swatches

* Design the active filters
* Integrate the products count shortcode
* Add sort by, per page

12/04/2023
* 'Available on' for the pro version (done)
* Apply the 'Show in Active Filters' settings (done)
* Comment out the pro version info on the 'Filter Key' field (done)
* Comment out 'SEO Rules' for now (done)
* Comment out 'Apply Mode' & 'Submit Mode' components for now (done)
* Comment out the primary and secondary button classes and slide-out-panel position (done)
* Maybe update the 'JavaScript after ajax update' field description (done)
* Remove post meta order direction for default instead make it none (done)
* 'Disable WCAPF' check it properly (done)
* Check 'Remove Data' properly (done)
* Loader settings (done)
* Scroll settings (done)
* Integrate 'Disable Ajax' settings (done)
* Manual options label is not working - FIX IT (done)
* If pagination is disabled in custom page query then apply the queried product ids when counting the filter items (not an issue)

17/04/2023

* The migrate functionality to convert the v3 data for v4

27/04/2023

* Same filter key can be used for post meta filters, fix it (done)
* Check sql error comes from same filter key (done)
* Range slider justify center check space besides the separator (done)
* Enable max height when hierarchy is enabled (done)
* Option to show the hierarchy toggle icon right after the label (done)
* Disable text styles from settings (done)
* Active filters group by same filter types (done)
* Sort the active filter values in ascending order (done)
* Show an alert when form/settings is changed and leaving (done)
* Don't collapse the form filters if no error found (done)
* Import sample form with filters (done)
* Show the migration button in woocommerce system tools tab (done)
* Show a message about the migration to v4 (done)
* Show a message to upgrade the pro version to v2.0.0 (done)
* Don't try to migrate if migration is already done (done)
* Setup the settings at plugin activation (done)
* Do not load wcapf-pro-v1 from wcapf-basic-v4 (done)
* Do not load wcapf-pro-v2 if wcapf-basic is less than v4.0.0 (done)

10 May 2023

* Improve color/image swatch (done)
* Improve label for future improvement with skin (done)
* Plugin settings for filter_input_delay (done)
* By default, the taxonomy hierarchy toggle we show inline (done)

15 May 2023
* Remove swatch width size field from Settings > Appearance (done)
* Remove "Get swatch data checkbox" from field appearance settings (done)
* Move the migration logic to 'register_activation_hook' (done)
* Delete the 'wcapf_forms_with_locations' transients when basic version gets activated (done)
* Maybe rename the plugin(admin menu, widgets) (done)
* Get the default data from js params (done)
* Fix the filter settings wrong tab issue in filter accordion when an error occurred saving the form (done)
* We should not load the svg file using file_get_contents if it's impossible without using https (done)
* Remove is_acf from filter data for now (done)
* Remove admin template(upgrade-to-pro.php) for now (done)
* Remove scroll window delay, improve the scroll event description (done)
* Use combobox instead of use_chosen (done)
* Fix scroll to top offset issue when the value is empty (done)
* Check the active filters, results count, reset button shortcodes on other pages (done)
* Fix showing the filter name only in active filters when the layout is extended (done)
* Change the widget name to 'WCAPF - Product Filter Form' (done)
* Show the debug message properly (done)
* Check the migration system with unpublished filter (done)
* Migrate the updated 'combobox' setting (done)
* Remove codes to restore the focus on filter options as it causes issue for 'immediate' scroll (done)
* Restore the layout by forcing to the default layout, move the logics for pro layouts to the pro version (done)
* Fix getting swatch data for hierarchy taxonomy list (done)
* Fix default loader image issue, use dir to get the svg content instead of url (done)
* Fix js error on console and Function WP_List_Util::pluck issues for the author roles (done)
* Disable swatches for 'rating' filter

14 June 2023
* Fix price slider not considering its own query (done)
* Use one option 'price' to use both for min_price and max_price in sort by filter, ignored migration (done)

Before release
* Remove development codes from WCAPF_Hooks class (done)
* Remove development codes from js file that replaces the filter url (done)
* Remove all possible todos
* Generate the .po files
* Update the readme descriptions, and description in plugin header filter also
* Change the plugin screenshots and update readme file accordingly

Next release
============
* Fix swatch issue when showing the taxonomy filter options in hierarchy view
* Enable swatches for dropdown
* Swatch and label presets
* Enable swatch for other filter types

before release v4.1.0
* Create the documentation to upgrade to pro (done)
* Add keyword filter 'Search field' (done)
* Change the "Upgrade to Pro" plugin action links color to #b443d7 (done)
* Thoroughly check the review notice system (done)
* Update the 'update plugin' link in admin notice (done)
* Update changelogs of readme files, add keyword filter in features list (done)
* Update the plugin landing page for the new feature 'Filter by Keyword' (done)
* Add keyword filter in the plugin demo website (done)
* Capture the screenshots with the keyword filter and update plugin assets (done)

Development site license
sk_YQxu2*#;a.dW_hpqo0F7H61w=&mWn

Short Description
WCAPF - WooCommerce Ajax Product Filter is a powerful plugin that enhances the filtering functionality of your WooCommerce store.

Long Description

Key Features:
* Filter by taxonomy
* Filter by attribute
* Filter by price
* Filter by rating
* Filter by product status(featured, in-stock)
* Filter by post-author
* Filter by post-meta
* Sort by filter
* Per page filter
* Present the filter options using checkbox, radio, select, multiselect, label
* Display the filter options in list, inline, grid
* For hierarchical taxonomies, display the filter options as hierarchical, enable hierarchy accordion
* For price filter, show the slider with min and max input fields, also have the ability to define the price ranges and show them as checkbox, radio and so on
* Show the product count with the filter options
* Show tooltip when hover over the filter options, show the product count in the tooltip also
* Setting to get the filter options automatically or manually enter the filter options by customizing the label, tooltip
* Display the filter options using color/image swatches, get the swatch data from term meta or manually enter the swatch data. Supports popular variation swatches plugins.
* Define the order of filter options by ID, Name, Slug, Count and Include Order
* Limit the filter options by including, excluding or defining the parent term for hierarchical taxonomy
* Enable accordion on filters to place more filters
* Show additional information about the filter using a tooltip on the filter title
* Enable search field to filter to quickly find the options
* Show more/Show less toggle or setting the max-height of the filter
* For post meta filter, show the filter options according to the meta value type. For value type text show them as checkbox, radio and so on, for value type number show a slider or ranges using checkbox, radio and so on, for value type data show date inputs or time period ranges using checkbox, radio and so on
* Support for filtering the variable products. It uses the product attributes lookup table when filtering by attributes. If you are not using variable products on your store you can disable this to speed up the filtering.
* Ability to set the filter keys for the filters that is used in the URL to identify the filter
* Vendor support for the post author filter, show the store name as the filter option label instead of author name. Supported plugins are WC Vendors, WCFM Marketplace
* Paginate the products via ajax
* Show the active filters on top of the products loop
* Enable Ajax for the default product sorting dropdown, show the active sorting option in the active filters
* Dynamically update the product count according to the applied filters
* Hide/Disable the filter options that returns zero products
* Hide empty filters
* Option to disable Ajax Filtering
* Customize the filter appearances as per the theme from the plugin settings
* Responsive ready, mobile friendly. CSS variables are used wherever possible so that the developers can adjust the design according to their need
* Easy integration, single widget/shortcode to show all the filters, shortcodes to show the active filters, reset button and results count wherever shortcodes are supported
* Compatible with popular themes. Astra, Avada, Blocksy, Botiga, Divi, Flatsome, GeneratePress, Hestia, Kadence, Neve, OceanWP, OnePress, Shapely, Storefront, Sydney, The7, Woostify, Zakra
* Drag n drop filter creation, create new filters in a few clicks. Easy to configure, and use
* Different form of filters to show on different archive pages, different form of filters for clothing, laptops, smartphones etc
* Integrate the filters on singular pages with the product loop that shows the products like on the shop page and works together with the Filters. The product loop uses the woocommerce products shortcode which is one of the most popular, useful, and widely spread shortcodes in WooCommerce. In the product loop you can specify the layout(standard shop loop, products with pagination or only products), type of products(on sale, best selling, top rated), visibility of the products(visible, catalog, search, hidden, featured), ordering of the products, columns for the grid layout, specify the total number of displayed products, setup taxonomy and meta queries, exclude specific products, define the message that will be shown when no products found for your applied filters.
* Developer friendly – contains useful hooks and filters

The pro features are:
* Display the filter option in grid layout
* Displaying the filter options using color/image swatches
* Manually enter the filter options
* Full control over the filter options ordering
* Define the placeholder for the search field that we show before the filter options to narrow down the filter options
* Vendor support for the post-author file
* Full control over the post-meta filter
* Disable filter options that returns zero results
* Hide empty filters
* Different filters on different archive pages
* Integration on singular pages


Can you please combine your responses and give me short description about the plugin? Then adjust the features, group them. Create sections for the same group. I am going to use this writing for my plugin's readme.txt file. You writing must contain strong keywords and will be SEO friendly.

Frequently Asked Questions (FAQs)

Can I use WCAPF with any WooCommerce theme?

Yes! WCAPF is designed to work seamlessly with any WooCommerce theme. You can easily integrate it into your existing store without any compatibility issues.
Is WCAPF compatible with the latest version of WooCommerce?

Absolutely! We constantly update WCAPF to ensure it remains compatible with the latest version of WooCommerce, providing you with a reliable and up-to-date filtering solution.
Can I customize the look and feel of the filters?

Yes, you have full control over the appearance of the filters. WCAPF provides various customization options, including styling, layout, and color choices, allowing you to match the filters with your store's design.
Is technical support available for WCAPF?

Yes, we offer dedicated technical support for our premium users. Our team is ready to assist you with any questions or issues you may encounter.

<svg xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 48 48" fill="none">
	<path
		d="M8.36612 16.1161C7.87796 16.6043 7.87796 17.3957 8.36612 17.8839L23.1161 32.6339C23.6043 33.122 24.3957 33.122 24.8839 32.6339L39.6339 17.8839C40.122 17.3957 40.122 16.6043 39.6339 16.1161C39.1457 15.628 38.3543 15.628 37.8661 16.1161L24 29.9822L10.1339 16.1161C9.64573 15.628 8.85427 15.628 8.36612 16.1161Z"
		fill="currentColor"></path>
</svg>

<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 512 512"><title>ionicons-v5-a</title>
	<polyline points="112 184 256 328 400 184"
			  style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px"/>
</svg>

Swatch documentation
For color swatch, if color is not found in an option and the image is found then the image will be shown, and vice versa.
With <a
	href="https://wptools.io/docs/wc-ajax-product-filter/common/color-image-swatches/?utm_source=Filter+Swatches&utm_medium=inside+plugin&utm_campaign=WCAPF+Swatches+Documentation"
	target="_blank">supported plugins</a>, swatch data can be obtained from term meta, <b>otherwise, manually input
	filter options and set swatch data.</b>
If you are using any of the supported plugins for the variation swatches, the swatch data can be obtained from term meta. However, if you're not using any of these supported plugins, you'll have to manually input the filter options and configure the swatch data.

Ask for a review
Thank you for using our plugin! If you are satisfied, please reward it a full five-star ★★★★★ rating. rating color #ffb900

WCAPF - WooCommerce Ajax Product Filter is a powerful plugin that enhances the filtering functionality of your WooCommerce store. It allows your customers to easily find and narrow down their product search using a dynamic and interactive filter system. With Ajax-based filtering, the plugin provides instant results without page reloading, ensuring a smooth and seamless user experience. Enhance your customers' shopping experience and boost conversions with WCAPF - WooCommerce Ajax Product Filter.

Screenshots for different filters for different archive pages
1528 x 813

How to ask to improve the writing?
Can you help me to format the content appropriately for the documentation page to ensure readability and clarity for the users?

Nothing was returned from render

dilantin syrup

1. craftplugin.com
2. sharpplugin.com

Could you please take a few seconds to give a good review for my plugin?

Hi Jonathan,

I hope this email finds you well. I wanted to thank you for reaching out to us about our plugin. We truly appreciate your interest and support!

I would like to extend a special offer to you – a 50% discount on the pro version of the plugin. This will provide you with access to additional features and benefits. In return, if you find the pro version helpful, we kindly request you to consider leaving a review and rating on wp.org.

If you're interested in the discount and agree to the review request, please let me know, and I will be more than happy to assist you with the next steps.

Best regards,
Mainul Hassan Main


Dear Elliot Derhay,

I hope this message finds you well. My name is Mainul Hassan Main, and I recently purchased the domain leanplugins.com with the intention of creating a WordPress profile and a Twitter account under the username "leanplugins."

During my research, I discovered that the "leanplugins" username is currently associated with an inactive WordPress plugin and a dormant Twitter account. It appears that you have a history with this username, and I wanted to reach out to kindly request if you would consider transferring or relinquishing the username on both platforms.

I am in the process of establishing a platform related to lean and efficient WordPress plugins, and having the username "leanplugins" would be incredibly valuable for maintaining a consistent brand identity across various online channels.

If you would consider this request, I would greatly appreciate the chance to discuss it further. I understand your time is valuable, and I am more than willing to work out an arrangement that suits your preferences.

Thank you for considering my request. I look forward to the possibility of collaborating with you and reaching an agreement that aligns with both of our interests.

Best regards,
Mainul Hassan Main

For 'Easy Integration'
storefront/style.css
body {
    overflow: hidden !important;
}

wp-includes/css/dist/widgets/style.css
.widget-content p {font-size: small}
