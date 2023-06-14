"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * The main js file.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/public/src/js
 * @author     wptools.io
 */
var wcapf_params = wcapf_params || {
  'is_rtl': '',
  'filter_input_delay': '',
  'combobox_display_selected_options': '',
  'combobox_no_results_text': '',
  'combobox_options_none_text': '',
  'search_box_in_default_orderby': '',
  'preserve_hierarchy_accordion_state': '',
  'preserve_soft_limit_state': '',
  'enable_animation_for_filter_accordion': '',
  'filter_accordion_animation_speed': '',
  'filter_accordion_animation_easing': '',
  'enable_animation_for_hierarchy_accordion': '',
  'hierarchy_accordion_animation_speed': '',
  'hierarchy_accordion_animation_easing': '',
  'scroll_to_top_speed': '',
  'scroll_to_top_easing': '',
  'is_mobile': '',
  'reload_on_back': '',
  'found_wcapf': '',
  'wcapf_pro': '',
  'update_document_title': '',
  'use_tippyjs': '',
  'shop_loop_container': '',
  'not_found_container': '',
  'pagination_container': '',
  'orderby_form': '',
  'orderby_element': '',
  'disable_ajax': '',
  'enable_pagination_via_ajax': '',
  'sorting_control': '',
  'attach_combobox_on_sorting': '',
  'loading_animation': '',
  'scroll_window': '',
  'scroll_window_for': '',
  'scroll_window_when': '',
  'scroll_window_custom_element': '',
  'scroll_on': '',
  'scroll_to_top_offset': '',
  'disable_scroll_animation': '',
  'more_selectors': '',
  'custom_scripts': ''
};

(function ($, window) {
  var _delay = parseInt(wcapf_params.filter_input_delay);

  var delay = _delay >= 0 ? _delay : 300;
  var isPro = wcapf_params.wcapf_pro;
  var $body = $('body');
  var $document = $(document);
  var instanceIds = [];
  var defaultOrderByElement = wcapf_params.orderby_form + ' ' + wcapf_params.orderby_element;
  $('.wcapf-filter').each(function () {
    var id = $(this).data('id');

    if (!id) {
      return;
    }

    instanceIds.push(id);
  });
  window.tippyInstances = [];
  window.WCAPF = window.WCAPF || {};
  window.WCAPF = {
    handleFilterAccordion: function handleFilterAccordion() {
      var toggleAccordion = function toggleAccordion($el) {
        // Check to see if the accordion is opened
        var pressed = $el.attr('aria-expanded') === 'true'; // Change aria-expanded to the opposite state

        $el.attr('aria-expanded', !pressed);
        var $filterInner = $el.closest('.wcapf-filter').children('.wcapf-filter-inner');

        if (wcapf_params.enable_animation_for_filter_accordion) {
          $filterInner.slideToggle(wcapf_params.filter_accordion_animation_speed, wcapf_params.filter_accordion_animation_easing);
        } else {
          $filterInner.toggle();
        }
      };

      $body.on('click', '.wcapf-filter-accordion-trigger', function (e) {
        e.stopPropagation();
        toggleAccordion($(this));
      });
      $body.on('click', '.wcapf-filter-title.has-accordion', function () {
        var $trigger = $(this).find('.wcapf-filter-accordion-trigger');
        toggleAccordion($trigger);
      });
    },
    handleHierarchyToggle: function handleHierarchyToggle() {
      var toggleAccordion = function toggleAccordion($el) {
        // Check to see if the button is pressed
        var pressed = $el.attr('aria-pressed') === 'true'; // Change aria-pressed to the opposite state

        $el.attr('aria-pressed', !pressed);
        var $child = $el.closest('li').children('ul');

        if (wcapf_params.enable_animation_for_hierarchy_accordion) {
          $child.slideToggle(wcapf_params.hierarchy_accordion_animation_speed, wcapf_params.hierarchy_accordion_animation_easing);
        } else {
          $child.toggle();
        }
      };

      $body.on('click', '.wcapf-hierarchy-accordion-toggle', function () {
        toggleAccordion($(this));
      }).on('keydown', '.wcapf-hierarchy-accordion-toggle', function (e) {
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'Spacebar') {
          // Prevent the default action to stop scrolling when space is pressed
          e.preventDefault();
          toggleAccordion($(this));
        }
      });
    },
    handleSoftLimit: function handleSoftLimit() {
      var toggleFilterOptions = function toggleFilterOptions($el) {
        // Check to see if the button is pressed
        var pressed = $el.attr('aria-pressed') === 'true'; // Change aria-pressed to the opposite state

        $el.attr('aria-pressed', !pressed);
        var $listWrapper = $el.closest('.wcapf-list-wrapper');

        if (pressed) {
          $listWrapper.removeClass('show-hidden-options');
        } else {
          $listWrapper.addClass('show-hidden-options');
        }
      };

      $body.on('click', '.wcapf-soft-limit-trigger', function () {
        toggleFilterOptions($(this));
      }).on('keydown', '.wcapf-soft-limit-trigger', function (e) {
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'Spacebar') {
          // Prevent the default action to stop scrolling when space is pressed
          e.preventDefault();
          toggleFilterOptions($(this));
        }
      });
    },
    handleSearchFilterOptions: function handleSearchFilterOptions() {
      $body.on('input', '.wcapf-search-box input[type="text"]', function () {
        var $that = $(this);
        var $inner = $that.closest('.wcapf-filter-inner');
        var $filter = $inner.closest('.wcapf-filter');
        var softLimitEnabled = $filter.hasClass('has-soft-limit');
        var softLimitToggle = $filter.find('.wcapf-soft-limit-wrapper');
        var noResults = $filter.find('.wcapf-no-results-text');
        var visibleOptions = parseInt($filter.attr('data-visible-options'));
        var keyword = $that.val();

        if (!keyword.length) {
          var _index = 0;
          $filter.removeClass('search-active');
          $.each($inner.find('.wcapf-filter-options > li'), function () {
            _index++;
            var $filterItem = $(this);
            $filterItem.removeClass('keyword-matched');

            if (softLimitEnabled) {
              if (_index > visibleOptions) {
                $filterItem.addClass('wcapf-filter-option-hidden');
              } else {
                $filterItem.removeClass('wcapf-filter-option-hidden');
              }
            }
          });

          if (softLimitEnabled) {
            softLimitToggle.removeAttr('style');
          }

          noResults.children('span').text('');
          noResults.hide();
          return;
        }

        var index = 0;
        $filter.addClass('search-active');
        $.each($inner.find('.wcapf-filter-options > li'), function () {
          var $filterItem = $(this);
          var label = $filterItem.find('.wcapf-filter-item-label').data('label');

          if (label.toString().toLowerCase().includes(keyword.toLowerCase())) {
            index++;
            $filterItem.addClass('keyword-matched');

            if (softLimitEnabled) {
              if (index > visibleOptions) {
                $filterItem.addClass('wcapf-filter-option-hidden');
              } else {
                $filterItem.removeClass('wcapf-filter-option-hidden');
              }
            }
          } else {
            $filterItem.removeClass('keyword-matched');
          }
        });

        if (softLimitEnabled) {
          if (index <= visibleOptions) {
            softLimitToggle.hide();
          } else {
            softLimitToggle.show();
          }
        }

        if (0 === index) {
          noResults.children('span').text(keyword);
          noResults.show();
        } else {
          noResults.children('span').text('');
          noResults.hide();
        }
      });
    },
    updateProductsCountResult: function updateProductsCountResult($response) {
      var $container = $(wcapf_params.shop_loop_container);
      var selector = '.woocommerce-result-count';
      var newCount = $response.find(selector).html();
      $body.find(selector).each(function () {
        var $el = $(this);

        if (!$container.has($el).length) {
          $el.html(newCount);
        }
      });
    },
    scrollTo: function scrollTo() {
      if ('none' === wcapf_params.scroll_window) {
        return;
      }

      var scrollFor = wcapf_params.scroll_window_for;
      var isMobile = wcapf_params.is_mobile;
      var proceed = false;

      if ('mobile' === scrollFor && isMobile) {
        proceed = true;
      } else if ('desktop' === scrollFor && !isMobile) {
        proceed = true;
      } else if ('both' === scrollFor) {
        proceed = true;
      }

      if (!proceed) {
        return;
      }

      var adjustingOffset = 0,
          offset = 0;

      if (wcapf_params.scroll_to_top_offset) {
        adjustingOffset = parseInt(wcapf_params.scroll_to_top_offset);
      }

      var container;

      if ($(wcapf_params.shop_loop_container).length) {
        container = wcapf_params.shop_loop_container;
      } else if ($(wcapf_params.not_found_container).length) {
        container = wcapf_params.not_found_container;
      }

      if ('custom' === wcapf_params.scroll_window) {
        container = wcapf_params.scroll_window_custom_element;
      }

      var $container = $(container);

      if ($container.length) {
        offset = $container.offset().top - adjustingOffset;

        if (offset < 0) {
          offset = 0;
        }

        $('html, body').stop().animate({
          scrollTop: offset
        }, wcapf_params.scroll_to_top_speed, wcapf_params.scroll_to_top_easing);
      }
    },
    // Things are done before fetching the products like showing the loading indicator.
    beforeFetchingProducts: function beforeFetchingProducts(triggeredBy) {
      $body.find('.wcapf-loader').addClass('is-active');

      if (!isPro && 'immediately' === wcapf_params.scroll_window_when) {
        WCAPF.scrollTo();
      }

      $document.trigger('wcapf_before_fetching_products', [triggeredBy]);
    },
    destroyTippyInstances: function destroyTippyInstances() {
      if (wcapf_params.use_tippyjs) {
        // @source https://github.com/atomiks/tippyjs/issues/473
        tippyInstances.forEach(function (instance) {
          instance.destroy();
        });
        tippyInstances.length = 0; // clear it
      }
    },
    // Things are done before updating the products like hiding the loading indicator.
    beforeUpdatingProducts: function beforeUpdatingProducts($response, triggeredBy) {
      $body.find('.wcapf-loader').removeClass('is-active'); // Maybe good for performance.

      WCAPF.destroyTippyInstances();
      $document.trigger('wcapf_before_updating_products', [$response, triggeredBy]);
    },
    afterUpdatingProducts: function afterUpdatingProducts($response, triggeredBy) {
      WCAPF.updateProductsCountResult($response); // Reinitialize wcapf.

      WCAPF.init();

      if (!isPro && 'after' === wcapf_params.scroll_window_when) {
        WCAPF.scrollTo();
      } // Trigger events.


      $(document).trigger('ready');
      $(window).trigger('scroll');
      $(window).trigger('resize'); // A3 Lazy Load support.

      $(window).trigger('lazyshow');

      if (wcapf_params.custom_scripts) {
        eval(wcapf_params.custom_scripts);
      }

      $document.trigger('wcapf_after_updating_products', [$response, triggeredBy]);
    },
    filterProducts: function filterProducts() {
      var triggeredBy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'filter';
      WCAPF.beforeFetchingProducts(triggeredBy);
      $.ajax({
        url: window.location.href,
        success: function success(response) {
          var $response = $(response);
          WCAPF.beforeUpdatingProducts($response, triggeredBy);
          /**
           * Update document title.
           *
           * @source https://stackoverflow.com/a/7599562
           */

          if (wcapf_params.update_document_title) {
            document.title = $response.filter('title').text();
          } // Update the instances.


          var _iterator = _createForOfIteratorHelper(instanceIds),
              _step;

          try {
            var _loop = function _loop() {
              var id = _step.value;
              var instanceId = '[data-id="' + id + '"]';
              var $instance = $(instanceId);
              var $inner = $instance.find('.wcapf-filter-inner');

              var _instance = $response.find(instanceId); // Preserve hierarchy accordion state.


              if (wcapf_params.preserve_hierarchy_accordion_state) {
                if ($instance.hasClass('has-hierarchy-accordion')) {
                  $instance.find('.wcapf-hierarchy-accordion-toggle').each(function () {
                    var $el = $(this);
                    var id = $el.data('id');
                    var toggleSelector = ".wcapf-hierarchy-accordion-toggle[data-id=\"".concat(id, "\"]"); // Check to see if the accordion is opened

                    var pressed = $el.attr('aria-pressed') === 'true';

                    if (pressed) {
                      _instance.find(toggleSelector).attr('aria-pressed', 'true');

                      _instance.find(toggleSelector).closest('li').children('ul').show();
                    } else {
                      _instance.find(toggleSelector).attr('aria-pressed', 'false');

                      _instance.find(toggleSelector).closest('li').children('ul').hide();
                    }
                  });
                }
              } // Preserve soft limit state.


              if (wcapf_params.preserve_soft_limit_state) {
                if ($instance.hasClass('has-soft-limit')) {
                  var $listWrapper = $instance.find('.wcapf-list-wrapper');

                  if ($listWrapper.hasClass('show-hidden-options')) {
                    _instance.find('.wcapf-list-wrapper').addClass('show-hidden-options');

                    _instance.find('.wcapf-soft-limit-trigger').attr('aria-pressed', 'true');
                  } else {
                    _instance.find('.wcapf-list-wrapper').removeClass('show-hidden-options');

                    _instance.find('.wcapf-soft-limit-trigger').attr('aria-pressed', 'false');
                  }
                }
              }

              var _html = _instance.find('.wcapf-filter-inner').html(); // Finally update the instance.


              $inner.html(_html);
              $instance.trigger('wcapf-filter-updated', [_instance]);
            };

            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              _loop();
            } // Update the active filters and reset filters.

          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          $body.find('.wcapf-active-filters, .wcapf-reset-filters').each(function () {
            var $that = $(this);
            var instanceId = '[data-id="' + $that.data('id') + '"]';
            $that.html($response.find(instanceId).html());
          }); // Replace old shop loop with new one.

          var $shopLoopContainer = $response.find(wcapf_params.shop_loop_container);
          var $notFoundContainer = $response.find(wcapf_params.not_found_container);

          if (wcapf_params.shop_loop_container === wcapf_params.not_found_container) {
            $(wcapf_params.shop_loop_container).html($shopLoopContainer.html());
          } else {
            if ($(wcapf_params.not_found_container).length) {
              if ($shopLoopContainer.length) {
                $(wcapf_params.not_found_container).html($shopLoopContainer.html());
              } else if ($notFoundContainer.length) {
                $(wcapf_params.not_found_container).html($notFoundContainer.html());
              }
            } else if ($(wcapf_params.shop_loop_container).length) {
              if ($shopLoopContainer.length) {
                $(wcapf_params.shop_loop_container).html($shopLoopContainer.html());
              } else if ($notFoundContainer.length) {
                $(wcapf_params.shop_loop_container).html($notFoundContainer.html());
              }
            }
          }

          WCAPF.afterUpdatingProducts($response, triggeredBy);
        }
      });
    },
    requestFilter: function requestFilter(url) {
      var triggeredBy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'filter';

      if (!url) {
        return;
      }

      if (wcapf_params.disable_ajax) {
        window.location.href = url;
      } else {
        history.pushState({
          wcapf: true
        }, '', url);
        WCAPF.filterProducts(triggeredBy);
      }
    },
    handleNumberInputFilters: function handleNumberInputFilters() {
      var rangeNumberSelectors = '.wcapf-range-number .min-value, .wcapf-range-number .max-value';
      $body.on('input', rangeNumberSelectors, function () {
        var $item = $(this);
        var $rangeNumber = $item.closest('.wcapf-range-number');
        var formatNumbers = $rangeNumber.attr('data-format-numbers');
        var rangeMinValue = parseFloat($rangeNumber.attr('data-range-min-value'));
        var rangeMaxValue = parseFloat($rangeNumber.attr('data-range-max-value'));
        var oldMinValue = parseFloat($rangeNumber.attr('data-min-value'));
        var oldMaxValue = parseFloat($rangeNumber.attr('data-max-value'));
        var decimalPlaces = $rangeNumber.attr('data-decimal-places');
        var thousandSeparator = $rangeNumber.attr('data-thousand-separator');
        var decimalSeparator = $rangeNumber.attr('data-decimal-separator'); // Clear any previously set timer before setting a fresh one

        clearTimeout($item.data('timer'));

        var getValue = function getValue(floatValue) {
          if (formatNumbers) {
            return numberFormat(floatValue, decimalPlaces, decimalSeparator, thousandSeparator);
          }

          return floatValue;
        };

        $item.data('timer', setTimeout(function () {
          $item.removeData('timer');
          var minValue = parseFloat($rangeNumber.find('.min-value').val());
          var maxValue = parseFloat($rangeNumber.find('.max-value').val()); // Force the minValue not to be empty.

          if (isNaN(minValue)) {
            minValue = rangeMinValue;
            $rangeNumber.find('.min-value').val(getValue(minValue));
          } else {
            $rangeNumber.find('.min-value').val(getValue(minValue));
          } // Force the maxValue not to be empty.


          if (isNaN(maxValue)) {
            maxValue = rangeMaxValue;
            $rangeNumber.find('.max-value').val(getValue(maxValue));
          } else {
            $rangeNumber.find('.max-value').val(getValue(maxValue));
          } // Force the minValue not to go below the rangeMinValue.


          if (minValue < rangeMinValue) {
            minValue = rangeMinValue;
            $rangeNumber.find('.min-value').val(getValue(minValue));
          } // Force the minValue not to go up the rangeMaxValue.


          if (minValue > rangeMaxValue) {
            minValue = rangeMaxValue;
            $rangeNumber.find('.min-value').val(getValue(minValue));
          } // Force the maxValue not to go up the rangeMaxValue.


          if (maxValue > rangeMaxValue) {
            maxValue = rangeMaxValue;
            $rangeNumber.find('.max-value').val(getValue(maxValue));
          } // Force the maxValue not to go below the minValue.


          if (minValue > maxValue) {
            maxValue = minValue;
            $rangeNumber.find('.max-value').val(getValue(maxValue));
          } // If value is not changed then don't proceed.


          if (minValue === oldMinValue && maxValue === oldMaxValue) {
            return;
          }

          if (minValue === rangeMinValue && maxValue === rangeMaxValue) {
            // Remove range filter.
            WCAPF.requestFilter($rangeNumber.data('clear-filter-url'));
          } else {
            // Add range filter.
            var url = $rangeNumber.data('url').replace('%1s', minValue).replace('%2s', maxValue);
            WCAPF.requestFilter(url);
          }
        }, delay));
      });
    },
    handleDateInputFilters: function handleDateInputFilters() {
      $body.on('change', '.wcapf-date-input .date-input', function () {
        var $filter = $(this).closest('.wcapf-date-input');
        var isRange = $filter.data('is-range');
        var filterUrl = ''; // Clear any previously set timer before setting a fresh one

        clearTimeout($filter.data('timer'));

        if (isRange) {
          var from = $filter.find('.date-from-input').val();
          var to = $filter.find('.date-to-input').val();

          if (from && to) {
            filterUrl = $filter.data('url').replace('%1s', from).replace('%2s', to);
          } else if (!from && !to) {
            filterUrl = $filter.data('clear-filter-url');
          }
        } else {
          var _from = $filter.find('.date-from-input').val();

          if (_from) {
            filterUrl = $filter.data('url').replace('%s', _from);
          } else {
            filterUrl = $filter.data('clear-filter-url');
          }
        }

        if (filterUrl) {
          $filter.data('timer', setTimeout(function () {
            $filter.removeData('timer');
            WCAPF.requestFilter(filterUrl);
          }, delay));
        }
      });
    },
    handleListFilters: function handleListFilters() {
      var nativeInputs = '.list-type-native [type="checkbox"],' + '.list-type-native [type="radio"],' + '.list-type-custom-checkbox [type="checkbox"]';
      $body.on('change', nativeInputs, function () {
        $(this).closest('.wcapf-filter-item').toggleClass('item-active');
        WCAPF.requestFilter($(this).data('url'));
      });
      var customRadioSelector = '.list-type-custom-radio';
      $body.on('change', customRadioSelector + ' [type="checkbox"]', function () {
        $(this).closest('.wcapf-filter-item').toggleClass('item-active'); // https://stackoverflow.com/a/5839924

        $(this).closest(customRadioSelector).find('.wcapf-filter-item.item-active [type="checkbox"]').not(this).prop('checked', false).closest('.wcapf-filter-item').removeClass('item-active');
        WCAPF.requestFilter($(this).data('url'));
      });
    },
    handleDropdownFilters: function handleDropdownFilters() {
      $body.on('change', '.wcapf-dropdown-wrapper select', function () {
        var $select = $(this);
        var values = $select.val();
        var filterURL = $select.data('url');
        var clearFilterURL = $select.data('clear-filter-url');
        var url;

        if (values.length) {
          url = filterURL.replace('%s', values.toString());
        } else {
          url = clearFilterURL;
        }

        WCAPF.requestFilter(url);
      });
    },
    handlePagination: function handlePagination() {
      if (wcapf_params.enable_pagination_via_ajax && wcapf_params.pagination_container) {
        var $container = $(wcapf_params.shop_loop_container);

        var _selectors = wcapf_params.pagination_container.split(',');

        var selectors = [];

        _selectors.forEach(function (selector) {
          if (selector) {
            selectors.push(selector + ' a');
          }
        });

        var selector = selectors.join(',');

        if ($container.length) {
          $container.on('click', selector, function (e) {
            e.preventDefault();
            var href = $(this).attr('href');
            WCAPF.requestFilter(href, 'paginate');
          });
        }
      }
    },
    handleDefaultOrderby: function handleDefaultOrderby() {
      if (!wcapf_params.sorting_control) {
        // Submit the orderby form when value is changed.
        $body.on('change', defaultOrderByElement, function () {
          $(this).closest('form').trigger('submit');
        });
        return;
      } // Prevent the auto submission of the orderby form.


      $body.on('submit', wcapf_params.orderby_form, function () {
        return false;
      }); // Handle the filter request via ajax when the orderby value is changed.

      $body.on('change', defaultOrderByElement, function () {
        var order = $(this).val();
        var url = new URL(window.location);
        url.searchParams.set('orderby', order);
        WCAPF.requestFilter(getOrderByUrl(url.href));
        return false;
      });
    },
    handleClearFilter: function handleClearFilter() {
      $body.on('click', '.wcapf-filter-clear-btn', function (e) {
        e.stopPropagation();
        WCAPF.requestFilter($(this).attr('data-clear-filter-url'));
      });
    },
    handleFilterTooltip: function handleFilterTooltip() {
      // noinspection JSUnresolvedReference
      if ('function' !== typeof tippy) {
        return;
      }

      if (!wcapf_params.use_tippyjs) {
        return;
      } // noinspection JSUnresolvedReference


      tippy('.wcapf-filter-tooltip', {
        placement: 'top',
        content: function content(reference) {
          return reference.getAttribute('data-content');
        },
        allowHTML: true
      });
    },
    initCombobox: function initCombobox() {
      if (!jQuery().chosenWCAPF) {
        return;
      }

      var templateResult = function templateResult(text, data) {
        return ['<span>' + text + '</span>', '<span class="wcapf-count">' + data['countMarkup'] + '</span>'].join('');
      };

      var templateSelection = function templateSelection(text, data) {
        return ['<span class="wcapf-count-' + data.count + '">' + text + '</span>', '<span class="wcapf-count wcapf-count-' + data.count + '">' + data['countMarkup'] + '</span>'].join('');
      };

      var defaults = {
        inherit_select_classes: true,
        inherit_option_classes: true,
        no_results_text: wcapf_params.combobox_no_results_text,
        options_none_text: wcapf_params.combobox_options_none_text,
        search_contains: true,
        // Match from anywhere in string.
        search_in_values: true // Search in values also.

      };

      if (wcapf_params.is_rtl) {
        defaults['rtl'] = true;
      }

      $body.find('.wcapf-chosen').each(function () {
        var $this = $(this);

        var options = _objectSpread({}, defaults); // If hierarchy enabled then we show the selected options.


        if ($this.hasClass('has-hierarchy')) {
          options['display_selected_options'] = true;
        } else {
          options['display_selected_options'] = wcapf_params.combobox_display_selected_options;
        } // Enable templating when showing count.


        if ($this.hasClass('with-count')) {
          options['templateResult'] = templateResult;
          options['templateSelection'] = templateSelection;
        } // Disable search box.


        if (!$this.data('enable-search')) {
          options['disable_search'] = true;
        }

        $this.chosenWCAPF(options);
      }); // Attach chosen for default orderby.

      if (wcapf_params.attach_combobox_on_sorting) {
        var disableSearch = true;

        if (wcapf_params.search_box_in_default_orderby) {
          disableSearch = false;
        }

        var options = _objectSpread({}, defaults);

        options['disable_search'] = disableSearch;
        $body.find(defaultOrderByElement).chosenWCAPF(options);
      }
    },
    initRangeSlider: function initRangeSlider() {
      if ('undefined' === typeof noUiSlider) {
        return;
      }

      $body.find('.wcapf-range-slider').each(function () {
        var $item = $(this);
        var $slider = $item.find('.wcapf-noui-slider');
        var sliderId = $slider.attr('id');
        var displayValuesAs = $item.attr('data-display-values-as');
        var formatNumbers = $item.attr('data-format-numbers');
        var rangeMinValue = parseFloat($item.attr('data-range-min-value'));
        var rangeMaxValue = parseFloat($item.attr('data-range-max-value'));
        var step = parseFloat($item.attr('data-step'));
        var decimalPlaces = $item.attr('data-decimal-places');
        var thousandSeparator = $item.attr('data-thousand-separator');
        var decimalSeparator = $item.attr('data-decimal-separator');
        var minValue = parseFloat($item.attr('data-min-value'));
        var maxValue = parseFloat($item.attr('data-max-value'));
        var $minValue = $item.find('.min-value');
        var $maxValue = $item.find('.max-value');
        var slider = document.getElementById(sliderId);
        noUiSlider.create(slider, {
          start: [minValue, maxValue],
          step: step,
          connect: true,
          cssPrefix: 'wcapf-noui-',
          range: {
            'min': rangeMinValue,
            'max': rangeMaxValue
          }
        });
        slider.noUiSlider.on('update', function (values) {
          var minValue;
          var maxValue;

          if (formatNumbers) {
            minValue = numberFormat(values[0], decimalPlaces, decimalSeparator, thousandSeparator);
            maxValue = numberFormat(values[1], decimalPlaces, decimalSeparator, thousandSeparator);
          } else {
            minValue = parseFloat(values[0]);
            maxValue = parseFloat(values[1]);
          }

          if ('plain_text' === displayValuesAs) {
            $minValue.html(minValue);
            $maxValue.html(maxValue);
          } else {
            $minValue.val(minValue);
            $maxValue.val(maxValue);
          }
        });

        function filterProductsAccordingToSlider(values) {
          var _minValue = parseFloat(values[0]);

          var _maxValue = parseFloat(values[1]); // If value is not changed then don't proceed.


          if (_minValue === minValue && _maxValue === maxValue) {
            return;
          }

          if (_minValue === rangeMinValue && _maxValue === rangeMaxValue) {
            // Remove range filter.
            WCAPF.requestFilter($item.data('clear-filter-url'));
          } else {
            // Add range filter.
            var url = $item.data('url').replace('%1s', _minValue).replace('%2s', _maxValue);
            WCAPF.requestFilter(url);
          }
        }

        slider.noUiSlider.on('change', function (values) {
          // Clear any previously set timer before setting a fresh one
          clearTimeout($item.data('timer'));
          $item.data('timer', setTimeout(function () {
            $item.removeData('timer');
            filterProductsAccordingToSlider(values);
          }, delay));
        });
        $minValue.on('input', function () {
          var $input = $(this); // Clear any previously set timer before setting a fresh one

          clearTimeout($input.data('timer'));
          $input.data('timer', setTimeout(function () {
            $input.removeData('timer');
            var minValue = $input.val();
            slider.noUiSlider.set([minValue, null]);
            filterProductsAccordingToSlider(slider.noUiSlider.get());
          }, delay));
        });
        $maxValue.on('input', function () {
          var $input = $(this); // Clear any previously set timer before setting a fresh one

          clearTimeout($input.data('timer'));
          $input.data('timer', setTimeout(function () {
            $input.removeData('timer');
            var maxValue = $input.val();
            slider.noUiSlider.set([null, maxValue]);
            filterProductsAccordingToSlider(slider.noUiSlider.get());
          }, delay));
        });
      });
    },
    initDatepicker: function initDatepicker() {
      if (!jQuery().datepicker) {
        return;
      }

      var $wcapfDateFilter = $body.find('.wcapf-date-input');
      var format = $wcapfDateFilter.attr('data-date-format');
      var yearDropdown = $wcapfDateFilter.attr('data-date-picker-year-dropdown');
      var monthDropdown = $wcapfDateFilter.attr('data-date-picker-month-dropdown');
      var $from = $wcapfDateFilter.find('.date-from-input');
      var $to = $wcapfDateFilter.find('.date-to-input');
      $from.datepicker({
        dateFormat: format,
        changeYear: yearDropdown,
        changeMonth: monthDropdown
      });
      $to.datepicker({
        dateFormat: format,
        changeYear: yearDropdown,
        changeMonth: monthDropdown
      });
    },
    initFilterOptionTooltip: function initFilterOptionTooltip() {
      // noinspection JSUnresolvedReference
      if ('function' !== typeof tippy) {
        return;
      }

      if (!wcapf_params.use_tippyjs) {
        return;
      }

      var tooltipPositions = ['top', 'right', 'bottom', 'left'];
      tooltipPositions.forEach(function (tooltipPosition) {
        var identifier = 'data-wcapf-tooltip-' + tooltipPosition; // noinspection JSUnresolvedReference

        var instances = tippy('[' + identifier + ']', {
          placement: tooltipPosition,
          content: function content(reference) {
            return reference.getAttribute(identifier);
          },
          allowHTML: true
        });
        window.tippyInstances = tippyInstances.concat(instances);
      });
    },
    init: function init() {
      WCAPF.initCombobox();
      WCAPF.initRangeSlider();
      WCAPF.initDatepicker();
      WCAPF.initFilterOptionTooltip();
    },
    initPopState: function initPopState() {
      if (wcapf_params.reload_on_back && wcapf_params.found_wcapf) {
        history.replaceState({
          wcapf: true
        }, '', window.location); // Handle the popstate event(browser's back/forward)

        window.addEventListener('popstate', function (e) {
          if (null !== e.state && e.state.hasOwnProperty('wcapf')) {
            WCAPF.filterProducts('popstate');
          }
        });
      }
    }
  };
  /**
   * Enable it if necessary.
   *
   * @source https://stackoverflow.com/a/33004917
   */

  if ('scrollRestoration' in history) {// history.scrollRestoration = 'manual';
  }
})(jQuery, window);

(function ($, WCAPF) {
  WCAPF.init();
  WCAPF.initPopState();
  WCAPF.handleFilterAccordion();
  WCAPF.handleHierarchyToggle();
  WCAPF.handleSoftLimit();
  WCAPF.handleSearchFilterOptions();
  WCAPF.handleListFilters();
  WCAPF.handleDropdownFilters();
  WCAPF.handleNumberInputFilters();
  WCAPF.handleDateInputFilters();
  WCAPF.handlePagination();
  WCAPF.handleDefaultOrderby();
  WCAPF.handleClearFilter();
  WCAPF.handleFilterTooltip();
  /**
   * Make it compatible with other plugins.
   */

  $(document).on('wcapf_after_updating_products', function () {
    // woo-variation-swatches
    $(document).trigger('woo_variation_swatches_pro_init');
  });
})(jQuery, window.WCAPF);
"use strict";

/**
 * @source https://stackoverflow.com/a/34141813
 *
 * @param number
 * @param decimals
 * @param dec_point
 * @param thousands_sep
 *
 * @returns {string}
 */
function numberFormat(number, decimals, dec_point, thousands_sep) {
  // Strip all characters but numerical ones.
  number = (number + '').replace(/[^\d+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number;
  var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
  var sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep;
  var dec = typeof dec_point === 'undefined' ? '.' : dec_point;
  var s;

  var toFixedFix = function toFixedFix(n, prec) {
    var k = Math.pow(10, prec);
    return '' + Math.round(n * k) / k;
  }; // Fix for IE parseFloat(0.55).toFixed(0) = 0;


  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');

  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }

  return s.join(dec);
}

function cleanUrl(url) {
  return url.replace(/%2C/g, ',');
}

function getOrderByUrl(url) {
  var paged = parseInt(url.replace(/.+\/page\/(\d+)+/, '$1'));

  if (paged) {
    url = url.replace(/page\/(\d+)\//, '');
  }

  return cleanUrl(url);
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJ1dGlscy5qcyJdLCJuYW1lcyI6WyJ3Y2FwZl9wYXJhbXMiLCIkIiwid2luZG93IiwiX2RlbGF5IiwicGFyc2VJbnQiLCJmaWx0ZXJfaW5wdXRfZGVsYXkiLCJkZWxheSIsImlzUHJvIiwid2NhcGZfcHJvIiwiJGJvZHkiLCIkZG9jdW1lbnQiLCJkb2N1bWVudCIsImluc3RhbmNlSWRzIiwiZGVmYXVsdE9yZGVyQnlFbGVtZW50Iiwib3JkZXJieV9mb3JtIiwib3JkZXJieV9lbGVtZW50IiwiZWFjaCIsImlkIiwiZGF0YSIsInB1c2giLCJ0aXBweUluc3RhbmNlcyIsIldDQVBGIiwiaGFuZGxlRmlsdGVyQWNjb3JkaW9uIiwidG9nZ2xlQWNjb3JkaW9uIiwiJGVsIiwicHJlc3NlZCIsImF0dHIiLCIkZmlsdGVySW5uZXIiLCJjbG9zZXN0IiwiY2hpbGRyZW4iLCJlbmFibGVfYW5pbWF0aW9uX2Zvcl9maWx0ZXJfYWNjb3JkaW9uIiwic2xpZGVUb2dnbGUiLCJmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsInRvZ2dsZSIsIm9uIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsIiR0cmlnZ2VyIiwiZmluZCIsImhhbmRsZUhpZXJhcmNoeVRvZ2dsZSIsIiRjaGlsZCIsImVuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24iLCJoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsImtleSIsInByZXZlbnREZWZhdWx0IiwiaGFuZGxlU29mdExpbWl0IiwidG9nZ2xlRmlsdGVyT3B0aW9ucyIsIiRsaXN0V3JhcHBlciIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJoYW5kbGVTZWFyY2hGaWx0ZXJPcHRpb25zIiwiJHRoYXQiLCIkaW5uZXIiLCIkZmlsdGVyIiwic29mdExpbWl0RW5hYmxlZCIsImhhc0NsYXNzIiwic29mdExpbWl0VG9nZ2xlIiwibm9SZXN1bHRzIiwidmlzaWJsZU9wdGlvbnMiLCJrZXl3b3JkIiwidmFsIiwibGVuZ3RoIiwiaW5kZXgiLCIkZmlsdGVySXRlbSIsInJlbW92ZUF0dHIiLCJ0ZXh0IiwiaGlkZSIsImxhYmVsIiwidG9TdHJpbmciLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwic2hvdyIsInVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQiLCIkcmVzcG9uc2UiLCIkY29udGFpbmVyIiwic2hvcF9sb29wX2NvbnRhaW5lciIsInNlbGVjdG9yIiwibmV3Q291bnQiLCJodG1sIiwiaGFzIiwic2Nyb2xsVG8iLCJzY3JvbGxfd2luZG93Iiwic2Nyb2xsRm9yIiwic2Nyb2xsX3dpbmRvd19mb3IiLCJpc01vYmlsZSIsImlzX21vYmlsZSIsInByb2NlZWQiLCJhZGp1c3RpbmdPZmZzZXQiLCJvZmZzZXQiLCJzY3JvbGxfdG9fdG9wX29mZnNldCIsImNvbnRhaW5lciIsIm5vdF9mb3VuZF9jb250YWluZXIiLCJzY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50IiwidG9wIiwic3RvcCIsImFuaW1hdGUiLCJzY3JvbGxUb3AiLCJzY3JvbGxfdG9fdG9wX3NwZWVkIiwic2Nyb2xsX3RvX3RvcF9lYXNpbmciLCJiZWZvcmVGZXRjaGluZ1Byb2R1Y3RzIiwidHJpZ2dlcmVkQnkiLCJzY3JvbGxfd2luZG93X3doZW4iLCJ0cmlnZ2VyIiwiZGVzdHJveVRpcHB5SW5zdGFuY2VzIiwidXNlX3RpcHB5anMiLCJmb3JFYWNoIiwiaW5zdGFuY2UiLCJkZXN0cm95IiwiYmVmb3JlVXBkYXRpbmdQcm9kdWN0cyIsImFmdGVyVXBkYXRpbmdQcm9kdWN0cyIsImluaXQiLCJjdXN0b21fc2NyaXB0cyIsImV2YWwiLCJmaWx0ZXJQcm9kdWN0cyIsImFqYXgiLCJ1cmwiLCJsb2NhdGlvbiIsImhyZWYiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJ1cGRhdGVfZG9jdW1lbnRfdGl0bGUiLCJ0aXRsZSIsImZpbHRlciIsImluc3RhbmNlSWQiLCIkaW5zdGFuY2UiLCJfaW5zdGFuY2UiLCJwcmVzZXJ2ZV9oaWVyYXJjaHlfYWNjb3JkaW9uX3N0YXRlIiwidG9nZ2xlU2VsZWN0b3IiLCJwcmVzZXJ2ZV9zb2Z0X2xpbWl0X3N0YXRlIiwiX2h0bWwiLCIkc2hvcExvb3BDb250YWluZXIiLCIkbm90Rm91bmRDb250YWluZXIiLCJyZXF1ZXN0RmlsdGVyIiwiZGlzYWJsZV9hamF4IiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsIndjYXBmIiwiaGFuZGxlTnVtYmVySW5wdXRGaWx0ZXJzIiwicmFuZ2VOdW1iZXJTZWxlY3RvcnMiLCIkaXRlbSIsIiRyYW5nZU51bWJlciIsImZvcm1hdE51bWJlcnMiLCJyYW5nZU1pblZhbHVlIiwicGFyc2VGbG9hdCIsInJhbmdlTWF4VmFsdWUiLCJvbGRNaW5WYWx1ZSIsIm9sZE1heFZhbHVlIiwiZGVjaW1hbFBsYWNlcyIsInRob3VzYW5kU2VwYXJhdG9yIiwiZGVjaW1hbFNlcGFyYXRvciIsImNsZWFyVGltZW91dCIsImdldFZhbHVlIiwiZmxvYXRWYWx1ZSIsIm51bWJlckZvcm1hdCIsInNldFRpbWVvdXQiLCJyZW1vdmVEYXRhIiwibWluVmFsdWUiLCJtYXhWYWx1ZSIsImlzTmFOIiwicmVwbGFjZSIsImhhbmRsZURhdGVJbnB1dEZpbHRlcnMiLCJpc1JhbmdlIiwiZmlsdGVyVXJsIiwiZnJvbSIsInRvIiwiaGFuZGxlTGlzdEZpbHRlcnMiLCJuYXRpdmVJbnB1dHMiLCJ0b2dnbGVDbGFzcyIsImN1c3RvbVJhZGlvU2VsZWN0b3IiLCJub3QiLCJwcm9wIiwiaGFuZGxlRHJvcGRvd25GaWx0ZXJzIiwiJHNlbGVjdCIsInZhbHVlcyIsImZpbHRlclVSTCIsImNsZWFyRmlsdGVyVVJMIiwiaGFuZGxlUGFnaW5hdGlvbiIsImVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4IiwicGFnaW5hdGlvbl9jb250YWluZXIiLCJfc2VsZWN0b3JzIiwic3BsaXQiLCJzZWxlY3RvcnMiLCJqb2luIiwiaGFuZGxlRGVmYXVsdE9yZGVyYnkiLCJzb3J0aW5nX2NvbnRyb2wiLCJvcmRlciIsIlVSTCIsInNlYXJjaFBhcmFtcyIsInNldCIsImdldE9yZGVyQnlVcmwiLCJoYW5kbGVDbGVhckZpbHRlciIsImhhbmRsZUZpbHRlclRvb2x0aXAiLCJ0aXBweSIsInBsYWNlbWVudCIsImNvbnRlbnQiLCJyZWZlcmVuY2UiLCJnZXRBdHRyaWJ1dGUiLCJhbGxvd0hUTUwiLCJpbml0Q29tYm9ib3giLCJqUXVlcnkiLCJjaG9zZW5XQ0FQRiIsInRlbXBsYXRlUmVzdWx0IiwidGVtcGxhdGVTZWxlY3Rpb24iLCJjb3VudCIsImRlZmF1bHRzIiwiaW5oZXJpdF9zZWxlY3RfY2xhc3NlcyIsImluaGVyaXRfb3B0aW9uX2NsYXNzZXMiLCJub19yZXN1bHRzX3RleHQiLCJjb21ib2JveF9ub19yZXN1bHRzX3RleHQiLCJvcHRpb25zX25vbmVfdGV4dCIsImNvbWJvYm94X29wdGlvbnNfbm9uZV90ZXh0Iiwic2VhcmNoX2NvbnRhaW5zIiwic2VhcmNoX2luX3ZhbHVlcyIsImlzX3J0bCIsIiR0aGlzIiwib3B0aW9ucyIsImNvbWJvYm94X2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucyIsImF0dGFjaF9jb21ib2JveF9vbl9zb3J0aW5nIiwiZGlzYWJsZVNlYXJjaCIsInNlYXJjaF9ib3hfaW5fZGVmYXVsdF9vcmRlcmJ5IiwiaW5pdFJhbmdlU2xpZGVyIiwibm9VaVNsaWRlciIsIiRzbGlkZXIiLCJzbGlkZXJJZCIsImRpc3BsYXlWYWx1ZXNBcyIsInN0ZXAiLCIkbWluVmFsdWUiLCIkbWF4VmFsdWUiLCJzbGlkZXIiLCJnZXRFbGVtZW50QnlJZCIsImNyZWF0ZSIsInN0YXJ0IiwiY29ubmVjdCIsImNzc1ByZWZpeCIsInJhbmdlIiwiZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciIsIl9taW5WYWx1ZSIsIl9tYXhWYWx1ZSIsIiRpbnB1dCIsImdldCIsImluaXREYXRlcGlja2VyIiwiZGF0ZXBpY2tlciIsIiR3Y2FwZkRhdGVGaWx0ZXIiLCJmb3JtYXQiLCJ5ZWFyRHJvcGRvd24iLCJtb250aERyb3Bkb3duIiwiJGZyb20iLCIkdG8iLCJkYXRlRm9ybWF0IiwiY2hhbmdlWWVhciIsImNoYW5nZU1vbnRoIiwiaW5pdEZpbHRlck9wdGlvblRvb2x0aXAiLCJ0b29sdGlwUG9zaXRpb25zIiwidG9vbHRpcFBvc2l0aW9uIiwiaWRlbnRpZmllciIsImluc3RhbmNlcyIsImNvbmNhdCIsImluaXRQb3BTdGF0ZSIsInJlbG9hZF9vbl9iYWNrIiwiZm91bmRfd2NhcGYiLCJyZXBsYWNlU3RhdGUiLCJhZGRFdmVudExpc3RlbmVyIiwic3RhdGUiLCJoYXNPd25Qcm9wZXJ0eSIsIm51bWJlciIsImRlY2ltYWxzIiwiZGVjX3BvaW50IiwidGhvdXNhbmRzX3NlcCIsIm4iLCJpc0Zpbml0ZSIsInByZWMiLCJNYXRoIiwiYWJzIiwic2VwIiwiZGVjIiwicyIsInRvRml4ZWRGaXgiLCJrIiwicG93Iiwicm91bmQiLCJBcnJheSIsImNsZWFuVXJsIiwicGFnZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLFlBQVksR0FBR0EsWUFBWSxJQUFJO0FBQ3BDLFlBQVUsRUFEMEI7QUFFcEMsd0JBQXNCLEVBRmM7QUFHcEMsdUNBQXFDLEVBSEQ7QUFJcEMsOEJBQTRCLEVBSlE7QUFLcEMsZ0NBQThCLEVBTE07QUFNcEMsbUNBQWlDLEVBTkc7QUFPcEMsd0NBQXNDLEVBUEY7QUFRcEMsK0JBQTZCLEVBUk87QUFTcEMsMkNBQXlDLEVBVEw7QUFVcEMsc0NBQW9DLEVBVkE7QUFXcEMsdUNBQXFDLEVBWEQ7QUFZcEMsOENBQTRDLEVBWlI7QUFhcEMseUNBQXVDLEVBYkg7QUFjcEMsMENBQXdDLEVBZEo7QUFlcEMseUJBQXVCLEVBZmE7QUFnQnBDLDBCQUF3QixFQWhCWTtBQWlCcEMsZUFBYSxFQWpCdUI7QUFrQnBDLG9C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eUgsSUFBdEMsQ0FBNEMsR0FBNUMsQ0FBVjtBQUNBOztBQUVELFNBQU82RixDQUFDLENBQUM3RixJQUFGLENBQVE0RixHQUFSLENBQVA7QUFDQTs7QUFFRCxTQUFTTyxRQUFULENBQW1CdEssR0FBbkIsRUFBeUI7QUFDeEIsU0FBT0EsR0FBRyxDQUFDNEMsT0FBSixDQUFhLE1BQWIsRUFBcUIsR0FBckIsQ0FBUDtBQUNBOztBQUVELFNBQVM4QixhQUFULENBQXdCMUUsR0FBeEIsRUFBOEI7QUFDN0IsTUFBTXVLLEtBQUssR0FBR3hSLFFBQVEsQ0FBRWlILEdBQUcsQ0FBQzRDLE9BQUosQ0FBYSxrQkFBYixFQUFpQyxJQUFqQyxDQUFGLENBQXRCOztBQUVBLE1BQUsySCxLQUFMLEVBQWE7QUFDWnZLLElBQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDNEMsT0FBSixDQUFhLGVBQWIsRUFBOEIsRUFBOUIsQ0FBTjtBQUNBOztBQUVELFNBQU8wSCxRQUFRLENBQUV0SyxHQUFGLENBQWY7QUFDQSIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLXB1YmxpYy1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgbWFpbiBqcyBmaWxlLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL3B1YmxpYy9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5jb25zdCB3Y2FwZl9wYXJhbXMgPSB3Y2FwZl9wYXJhbXMgfHwge1xuXHQnaXNfcnRsJzogJycsXG5cdCdmaWx0ZXJfaW5wdXRfZGVsYXknOiAnJyxcblx0J2NvbWJvYm94X2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucyc6ICcnLFxuXHQnY29tYm9ib3hfbm9fcmVzdWx0c190ZXh0JzogJycsXG5cdCdjb21ib2JveF9vcHRpb25zX25vbmVfdGV4dCc6ICcnLFxuXHQnc2VhcmNoX2JveF9pbl9kZWZhdWx0X29yZGVyYnknOiAnJyxcblx0J3ByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUnOiAnJyxcblx0J3ByZXNlcnZlX3NvZnRfbGltaXRfc3RhdGUnOiAnJyxcblx0J2VuYWJsZV9hbmltYXRpb25fZm9yX2ZpbHRlcl9hY2NvcmRpb24nOiAnJyxcblx0J2ZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkJzogJycsXG5cdCdmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmcnOiAnJyxcblx0J2VuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24nOiAnJyxcblx0J2hpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkJzogJycsXG5cdCdoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmcnOiAnJyxcblx0J3Njcm9sbF90b190b3Bfc3BlZWQnOiAnJyxcblx0J3Njcm9sbF90b190b3BfZWFzaW5nJzogJycsXG5cdCdpc19tb2JpbGUnOiAnJyxcblx0J3JlbG9hZF9vbl9iYWNrJzogJycsXG5cdCdmb3VuZF93Y2FwZic6ICcnLFxuXHQnd2NhcGZfcHJvJzogJycsXG5cdCd1cGRhdGVfZG9jdW1lbnRfdGl0bGUnOiAnJyxcblx0J3VzZV90aXBweWpzJzogJycsXG5cdCdzaG9wX2xvb3BfY29udGFpbmVyJzogJycsXG5cdCdub3RfZm91bmRfY29udGFpbmVyJzogJycsXG5cdCdwYWdpbmF0aW9uX2NvbnRhaW5lcic6ICcnLFxuXHQnb3JkZXJieV9mb3JtJzogJycsXG5cdCdvcmRlcmJ5X2VsZW1lbnQnOiAnJyxcblx0J2Rpc2FibGVfYWpheCc6ICcnLFxuXHQnZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXgnOiAnJyxcblx0J3NvcnRpbmdfY29udHJvbCc6ICcnLFxuXHQnYXR0YWNoX2NvbWJvYm94X29uX3NvcnRpbmcnOiAnJyxcblx0J2xvYWRpbmdfYW5pbWF0aW9uJzogJycsXG5cdCdzY3JvbGxfd2luZG93JzogJycsXG5cdCdzY3JvbGxfd2luZG93X2Zvcic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd193aGVuJzogJycsXG5cdCdzY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50JzogJycsXG5cdCdzY3JvbGxfb24nOiAnJyxcblx0J3Njcm9sbF90b190b3Bfb2Zmc2V0JzogJycsXG5cdCdkaXNhYmxlX3Njcm9sbF9hbmltYXRpb24nOiAnJyxcblx0J21vcmVfc2VsZWN0b3JzJzogJycsXG5cdCdjdXN0b21fc2NyaXB0cyc6ICcnLFxufTtcblxuKCBmdW5jdGlvbiggJCwgd2luZG93ICkge1xuXG5cdGNvbnN0IF9kZWxheSA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuZmlsdGVyX2lucHV0X2RlbGF5ICk7XG5cdGNvbnN0IGRlbGF5ICA9IF9kZWxheSA+PSAwID8gX2RlbGF5IDogMzAwO1xuXG5cdGNvbnN0IGlzUHJvID0gd2NhcGZfcGFyYW1zLndjYXBmX3BybztcblxuXHRjb25zdCAkYm9keSAgICAgPSAkKCAnYm9keScgKTtcblx0Y29uc3QgJGRvY3VtZW50ID0gJCggZG9jdW1lbnQgKTtcblxuXHRjb25zdCBpbnN0YW5jZUlkcyA9IFtdO1xuXG5cdGNvbnN0IGRlZmF1bHRPcmRlckJ5RWxlbWVudCA9IHdjYXBmX3BhcmFtcy5vcmRlcmJ5X2Zvcm0gKyAnICcgKyB3Y2FwZl9wYXJhbXMub3JkZXJieV9lbGVtZW50O1xuXG5cdCQoICcud2NhcGYtZmlsdGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IGlkID0gJCggdGhpcyApLmRhdGEoICdpZCcgKTtcblxuXHRcdGlmICggISBpZCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpbnN0YW5jZUlkcy5wdXNoKCBpZCApO1xuXHR9ICk7XG5cblx0d2luZG93LnRpcHB5SW5zdGFuY2VzID0gW107XG5cblx0d2luZG93LldDQVBGID0gd2luZG93LldDQVBGIHx8IHt9O1xuXG5cdHdpbmRvdy5XQ0FQRiA9IHtcblx0XHRoYW5kbGVGaWx0ZXJBY2NvcmRpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgdG9nZ2xlQWNjb3JkaW9uID0gKCAkZWwgKSA9PiB7XG5cdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYWNjb3JkaW9uIGlzIG9wZW5lZFxuXHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLWV4cGFuZGVkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0Ly8gQ2hhbmdlIGFyaWEtZXhwYW5kZWQgdG8gdGhlIG9wcG9zaXRlIHN0YXRlXG5cdFx0XHRcdCRlbC5hdHRyKCAnYXJpYS1leHBhbmRlZCcsICEgcHJlc3NlZCApO1xuXG5cdFx0XHRcdGNvbnN0ICRmaWx0ZXJJbm5lciA9ICRlbC5jbG9zZXN0KCAnLndjYXBmLWZpbHRlcicgKS5jaGlsZHJlbiggJy53Y2FwZi1maWx0ZXItaW5uZXInICk7XG5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX2FuaW1hdGlvbl9mb3JfZmlsdGVyX2FjY29yZGlvbiApIHtcblx0XHRcdFx0XHQkZmlsdGVySW5uZXIuc2xpZGVUb2dnbGUoXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQsXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkZmlsdGVySW5uZXIudG9nZ2xlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdCRib2R5Lm9uKCAnY2xpY2snLCAnLndjYXBmLWZpbHRlci1hY2NvcmRpb24tdHJpZ2dlcicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdCRib2R5Lm9uKCAnY2xpY2snLCAnLndjYXBmLWZpbHRlci10aXRsZS5oYXMtYWNjb3JkaW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0cmlnZ2VyID0gJCggdGhpcyApLmZpbmQoICcud2NhcGYtZmlsdGVyLWFjY29yZGlvbi10cmlnZ2VyJyApO1xuXG5cdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJHRyaWdnZXIgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZUhpZXJhcmNoeVRvZ2dsZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCB0b2dnbGVBY2NvcmRpb24gPSAoICRlbCApID0+IHtcblx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBidXR0b24gaXMgcHJlc3NlZFxuXHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLXByZXNzZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHQvLyBDaGFuZ2UgYXJpYS1wcmVzc2VkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuXHRcdFx0XHQkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICEgcHJlc3NlZCApO1xuXG5cdFx0XHRcdGNvbnN0ICRjaGlsZCA9ICRlbC5jbG9zZXN0KCAnbGknICkuY2hpbGRyZW4oICd1bCcgKTtcblxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uICkge1xuXHRcdFx0XHRcdCRjaGlsZC5zbGlkZVRvZ2dsZShcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5oaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCxcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5oaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmdcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRjaGlsZC50b2dnbGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0JGJvZHlcblx0XHRcdFx0Lm9uKCAnY2xpY2snLCAnLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkKCB0aGlzICkgKTtcblx0XHRcdFx0fSApXG5cdFx0XHRcdC5vbiggJ2tleWRvd24nLCAnLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0aWYgKCBlLmtleSA9PT0gJyAnIHx8IGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnU3BhY2ViYXInICkge1xuXHRcdFx0XHRcdFx0Ly8gUHJldmVudCB0aGUgZGVmYXVsdCBhY3Rpb24gdG8gc3RvcCBzY3JvbGxpbmcgd2hlbiBzcGFjZSBpcyBwcmVzc2VkXG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVTb2Z0TGltaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgdG9nZ2xlRmlsdGVyT3B0aW9ucyA9ICggJGVsICkgPT4ge1xuXHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGJ1dHRvbiBpcyBwcmVzc2VkXG5cdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdC8vIENoYW5nZSBhcmlhLXByZXNzZWQgdG8gdGhlIG9wcG9zaXRlIHN0YXRlXG5cdFx0XHRcdCRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJywgISBwcmVzc2VkICk7XG5cblx0XHRcdFx0Y29uc3QgJGxpc3RXcmFwcGVyID0gJGVsLmNsb3Nlc3QoICcud2NhcGYtbGlzdC13cmFwcGVyJyApO1xuXG5cdFx0XHRcdGlmICggcHJlc3NlZCApIHtcblx0XHRcdFx0XHQkbGlzdFdyYXBwZXIucmVtb3ZlQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRsaXN0V3JhcHBlci5hZGRDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdCRib2R5XG5cdFx0XHRcdC5vbiggJ2NsaWNrJywgJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0b2dnbGVGaWx0ZXJPcHRpb25zKCAkKCB0aGlzICkgKTtcblx0XHRcdFx0fSApXG5cdFx0XHRcdC5vbiggJ2tleWRvd24nLCAnLndjYXBmLXNvZnQtbGltaXQtdHJpZ2dlcicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdGlmICggZS5rZXkgPT09ICcgJyB8fCBlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJ1NwYWNlYmFyJyApIHtcblx0XHRcdFx0XHRcdC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgYWN0aW9uIHRvIHN0b3Agc2Nyb2xsaW5nIHdoZW4gc3BhY2UgaXMgcHJlc3NlZFxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0XHR0b2dnbGVGaWx0ZXJPcHRpb25zKCAkKCB0aGlzICkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZVNlYXJjaEZpbHRlck9wdGlvbnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdpbnB1dCcsICcud2NhcGYtc2VhcmNoLWJveCBpbnB1dFt0eXBlPVwidGV4dFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkdGhhdCAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCAkaW5uZXIgID0gJHRoYXQuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXItaW5uZXInICk7XG5cdFx0XHRcdGNvbnN0ICRmaWx0ZXIgPSAkaW5uZXIuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXInICk7XG5cblx0XHRcdFx0Y29uc3Qgc29mdExpbWl0RW5hYmxlZCA9ICRmaWx0ZXIuaGFzQ2xhc3MoICdoYXMtc29mdC1saW1pdCcgKTtcblx0XHRcdFx0Y29uc3Qgc29mdExpbWl0VG9nZ2xlICA9ICRmaWx0ZXIuZmluZCggJy53Y2FwZi1zb2Z0LWxpbWl0LXdyYXBwZXInICk7XG5cdFx0XHRcdGNvbnN0IG5vUmVzdWx0cyAgICAgICAgPSAkZmlsdGVyLmZpbmQoICcud2NhcGYtbm8tcmVzdWx0cy10ZXh0JyApO1xuXHRcdFx0XHRjb25zdCB2aXNpYmxlT3B0aW9ucyAgID0gcGFyc2VJbnQoICRmaWx0ZXIuYXR0ciggJ2RhdGEtdmlzaWJsZS1vcHRpb25zJyApICk7XG5cblx0XHRcdFx0Y29uc3Qga2V5d29yZCA9ICR0aGF0LnZhbCgpO1xuXG5cdFx0XHRcdGlmICggISBrZXl3b3JkLmxlbmd0aCApIHtcblx0XHRcdFx0XHRsZXQgaW5kZXggPSAwO1xuXHRcdFx0XHRcdCRmaWx0ZXIucmVtb3ZlQ2xhc3MoICdzZWFyY2gtYWN0aXZlJyApO1xuXG5cdFx0XHRcdFx0JC5lYWNoKCAkaW5uZXIuZmluZCggJy53Y2FwZi1maWx0ZXItb3B0aW9ucyA+IGxpJyApLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGluZGV4Kys7XG5cblx0XHRcdFx0XHRcdGNvbnN0ICRmaWx0ZXJJdGVtID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICdrZXl3b3JkLW1hdGNoZWQnICk7XG5cblx0XHRcdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCBpbmRleCA+IHZpc2libGVPcHRpb25zICkge1xuXHRcdFx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLmFkZENsYXNzKCAnd2NhcGYtZmlsdGVyLW9wdGlvbi1oaWRkZW4nICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRcdHNvZnRMaW1pdFRvZ2dsZS5yZW1vdmVBdHRyKCAnc3R5bGUnICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bm9SZXN1bHRzLmNoaWxkcmVuKCAnc3BhbicgKS50ZXh0KCAnJyApO1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5oaWRlKCk7XG5cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgaW5kZXggPSAwO1xuXHRcdFx0XHQkZmlsdGVyLmFkZENsYXNzKCAnc2VhcmNoLWFjdGl2ZScgKTtcblxuXHRcdFx0XHQkLmVhY2goICRpbm5lci5maW5kKCAnLndjYXBmLWZpbHRlci1vcHRpb25zID4gbGknICksIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0ICRmaWx0ZXJJdGVtID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdGNvbnN0IGxhYmVsICAgICAgID0gJGZpbHRlckl0ZW0uZmluZCggJy53Y2FwZi1maWx0ZXItaXRlbS1sYWJlbCcgKS5kYXRhKCAnbGFiZWwnICk7XG5cblx0XHRcdFx0XHRpZiAoIGxhYmVsLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygga2V5d29yZC50b0xvd2VyQ2FzZSgpICkgKSB7XG5cdFx0XHRcdFx0XHRpbmRleCsrO1xuXG5cdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5hZGRDbGFzcyggJ2tleXdvcmQtbWF0Y2hlZCcgKTtcblxuXHRcdFx0XHRcdFx0aWYgKCBzb2Z0TGltaXRFbmFibGVkICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIGluZGV4ID4gdmlzaWJsZU9wdGlvbnMgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0uYWRkQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5yZW1vdmVDbGFzcyggJ3djYXBmLWZpbHRlci1vcHRpb24taGlkZGVuJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLnJlbW92ZUNsYXNzKCAna2V5d29yZC1tYXRjaGVkJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRpZiAoIGluZGV4IDw9IHZpc2libGVPcHRpb25zICkge1xuXHRcdFx0XHRcdFx0c29mdExpbWl0VG9nZ2xlLmhpZGUoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c29mdExpbWl0VG9nZ2xlLnNob3coKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIDAgPT09IGluZGV4ICkge1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5jaGlsZHJlbiggJ3NwYW4nICkudGV4dCgga2V5d29yZCApO1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bm9SZXN1bHRzLmNoaWxkcmVuKCAnc3BhbicgKS50ZXh0KCAnJyApO1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdHVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQ6IGZ1bmN0aW9uKCAkcmVzcG9uc2UgKSB7XG5cdFx0XHRjb25zdCAkY29udGFpbmVyID0gJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdGNvbnN0IHNlbGVjdG9yICAgPSAnLndvb2NvbW1lcmNlLXJlc3VsdC1jb3VudCc7XG5cdFx0XHRjb25zdCBuZXdDb3VudCAgID0gJHJlc3BvbnNlLmZpbmQoIHNlbGVjdG9yICkuaHRtbCgpO1xuXG5cdFx0XHQkYm9keS5maW5kKCBzZWxlY3RvciApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkZWwgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0aWYgKCAhICRjb250YWluZXIuaGFzKCAkZWwgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0JGVsLmh0bWwoIG5ld0NvdW50ICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdHNjcm9sbFRvOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggJ25vbmUnID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvdyApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzY3JvbGxGb3IgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19mb3I7XG5cdFx0XHRjb25zdCBpc01vYmlsZSAgPSB3Y2FwZl9wYXJhbXMuaXNfbW9iaWxlO1xuXHRcdFx0bGV0IHByb2NlZWQgICAgID0gZmFsc2U7XG5cblx0XHRcdGlmICggJ21vYmlsZScgPT09IHNjcm9sbEZvciAmJiBpc01vYmlsZSApIHtcblx0XHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0XHR9IGVsc2UgaWYgKCAnZGVza3RvcCcgPT09IHNjcm9sbEZvciAmJiAhIGlzTW9iaWxlICkge1xuXHRcdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSBpZiAoICdib3RoJyA9PT0gc2Nyb2xsRm9yICkge1xuXHRcdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhIHByb2NlZWQgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGFkanVzdGluZ09mZnNldCA9IDAsIG9mZnNldCA9IDA7XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfb2Zmc2V0ICkge1xuXHRcdFx0XHRhZGp1c3RpbmdPZmZzZXQgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfb2Zmc2V0ICk7XG5cdFx0XHR9XG5cblx0XHRcdGxldCBjb250YWluZXI7XG5cblx0XHRcdGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdGNvbnRhaW5lciA9IHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyO1xuXHRcdFx0fSBlbHNlIGlmICggJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdGNvbnRhaW5lciA9IHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICdjdXN0b20nID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvdyApIHtcblx0XHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfY3VzdG9tX2VsZW1lbnQ7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0ICRjb250YWluZXIgPSAkKCBjb250YWluZXIgKTtcblxuXHRcdFx0aWYgKCAkY29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0b2Zmc2V0ID0gJGNvbnRhaW5lci5vZmZzZXQoKS50b3AgLSBhZGp1c3RpbmdPZmZzZXQ7XG5cblx0XHRcdFx0aWYgKCBvZmZzZXQgPCAwICkge1xuXHRcdFx0XHRcdG9mZnNldCA9IDA7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkKCAnaHRtbCwgYm9keScgKS5zdG9wKCkuYW5pbWF0ZShcblx0XHRcdFx0XHR7IHNjcm9sbFRvcDogb2Zmc2V0IH0sXG5cdFx0XHRcdFx0d2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfc3BlZWQsXG5cdFx0XHRcdFx0d2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3BfZWFzaW5nXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvLyBUaGluZ3MgYXJlIGRvbmUgYmVmb3JlIGZldGNoaW5nIHRoZSBwcm9kdWN0cyBsaWtlIHNob3dpbmcgdGhlIGxvYWRpbmcgaW5kaWNhdG9yLlxuXHRcdGJlZm9yZUZldGNoaW5nUHJvZHVjdHM6IGZ1bmN0aW9uKCB0cmlnZ2VyZWRCeSApIHtcblx0XHRcdCRib2R5LmZpbmQoICcud2NhcGYtbG9hZGVyJyApLmFkZENsYXNzKCAnaXMtYWN0aXZlJyApO1xuXG5cdFx0XHRpZiAoICEgaXNQcm8gJiYgJ2ltbWVkaWF0ZWx5JyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfd2hlbiApIHtcblx0XHRcdFx0V0NBUEYuc2Nyb2xsVG8oKTtcblx0XHRcdH1cblxuXHRcdFx0JGRvY3VtZW50LnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfZmV0Y2hpbmdfcHJvZHVjdHMnLCBbIHRyaWdnZXJlZEJ5IF0gKTtcblx0XHR9LFxuXHRcdGRlc3Ryb3lUaXBweUluc3RhbmNlczogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy51c2VfdGlwcHlqcyApIHtcblx0XHRcdFx0Ly8gQHNvdXJjZSBodHRwczovL2dpdGh1Yi5jb20vYXRvbWlrcy90aXBweWpzL2lzc3Vlcy80NzNcblx0XHRcdFx0dGlwcHlJbnN0YW5jZXMuZm9yRWFjaCggaW5zdGFuY2UgPT4ge1xuXHRcdFx0XHRcdGluc3RhbmNlLmRlc3Ryb3koKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0XHR0aXBweUluc3RhbmNlcy5sZW5ndGggPSAwOyAvLyBjbGVhciBpdFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Ly8gVGhpbmdzIGFyZSBkb25lIGJlZm9yZSB1cGRhdGluZyB0aGUgcHJvZHVjdHMgbGlrZSBoaWRpbmcgdGhlIGxvYWRpbmcgaW5kaWNhdG9yLlxuXHRcdGJlZm9yZVVwZGF0aW5nUHJvZHVjdHM6IGZ1bmN0aW9uKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICkge1xuXHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1sb2FkZXInICkucmVtb3ZlQ2xhc3MoICdpcy1hY3RpdmUnICk7XG5cblx0XHRcdC8vIE1heWJlIGdvb2QgZm9yIHBlcmZvcm1hbmNlLlxuXHRcdFx0V0NBUEYuZGVzdHJveVRpcHB5SW5zdGFuY2VzKCk7XG5cblx0XHRcdCRkb2N1bWVudC50cmlnZ2VyKCAnd2NhcGZfYmVmb3JlX3VwZGF0aW5nX3Byb2R1Y3RzJywgWyAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5IF0gKTtcblx0XHR9LFxuXHRcdGFmdGVyVXBkYXRpbmdQcm9kdWN0czogZnVuY3Rpb24oICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgKSB7XG5cdFx0XHRXQ0FQRi51cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0KCAkcmVzcG9uc2UgKTtcblxuXHRcdFx0Ly8gUmVpbml0aWFsaXplIHdjYXBmLlxuXHRcdFx0V0NBUEYuaW5pdCgpO1xuXG5cdFx0XHRpZiAoICEgaXNQcm8gJiYgJ2FmdGVyJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfd2hlbiApIHtcblx0XHRcdFx0V0NBUEYuc2Nyb2xsVG8oKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVHJpZ2dlciBldmVudHMuXG5cdFx0XHQkKCBkb2N1bWVudCApLnRyaWdnZXIoICdyZWFkeScgKTtcblx0XHRcdCQoIHdpbmRvdyApLnRyaWdnZXIoICdzY3JvbGwnICk7XG5cdFx0XHQkKCB3aW5kb3cgKS50cmlnZ2VyKCAncmVzaXplJyApO1xuXG5cdFx0XHQvLyBBMyBMYXp5IExvYWQgc3VwcG9ydC5cblx0XHRcdCQoIHdpbmRvdyApLnRyaWdnZXIoICdsYXp5c2hvdycgKTtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuY3VzdG9tX3NjcmlwdHMgKSB7XG5cdFx0XHRcdGV2YWwoIHdjYXBmX3BhcmFtcy5jdXN0b21fc2NyaXB0cyApO1xuXHRcdFx0fVxuXG5cdFx0XHQkZG9jdW1lbnQudHJpZ2dlciggJ3djYXBmX2FmdGVyX3VwZGF0aW5nX3Byb2R1Y3RzJywgWyAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5IF0gKTtcblx0XHR9LFxuXHRcdGZpbHRlclByb2R1Y3RzOiBmdW5jdGlvbiggdHJpZ2dlcmVkQnkgPSAnZmlsdGVyJyApIHtcblx0XHRcdFdDQVBGLmJlZm9yZUZldGNoaW5nUHJvZHVjdHMoIHRyaWdnZXJlZEJ5ICk7XG5cblx0XHRcdCQuYWpheCgge1xuXHRcdFx0XHR1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHRcdFx0Y29uc3QgJHJlc3BvbnNlID0gJCggcmVzcG9uc2UgKTtcblxuXHRcdFx0XHRcdFdDQVBGLmJlZm9yZVVwZGF0aW5nUHJvZHVjdHMoICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgKTtcblxuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIFVwZGF0ZSBkb2N1bWVudCB0aXRsZS5cblx0XHRcdFx0XHQgKlxuXHRcdFx0XHRcdCAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzc1OTk1NjJcblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy51cGRhdGVfZG9jdW1lbnRfdGl0bGUgKSB7XG5cdFx0XHRcdFx0XHRkb2N1bWVudC50aXRsZSA9ICRyZXNwb25zZS5maWx0ZXIoICd0aXRsZScgKS50ZXh0KCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBpbnN0YW5jZXMuXG5cdFx0XHRcdFx0Zm9yICggY29uc3QgaWQgb2YgaW5zdGFuY2VJZHMgKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBpbnN0YW5jZUlkID0gJ1tkYXRhLWlkPVwiJyArIGlkICsgJ1wiXSc7XG5cdFx0XHRcdFx0XHRjb25zdCAkaW5zdGFuY2UgID0gJCggaW5zdGFuY2VJZCApO1xuXHRcdFx0XHRcdFx0Y29uc3QgJGlubmVyICAgICA9ICRpbnN0YW5jZS5maW5kKCAnLndjYXBmLWZpbHRlci1pbm5lcicgKTtcblx0XHRcdFx0XHRcdGNvbnN0IF9pbnN0YW5jZSAgPSAkcmVzcG9uc2UuZmluZCggaW5zdGFuY2VJZCApO1xuXG5cdFx0XHRcdFx0XHQvLyBQcmVzZXJ2ZSBoaWVyYXJjaHkgYWNjb3JkaW9uIHN0YXRlLlxuXHRcdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkaW5zdGFuY2UuaGFzQ2xhc3MoICdoYXMtaGllcmFyY2h5LWFjY29yZGlvbicgKSApIHtcblx0XHRcdFx0XHRcdFx0XHQkaW5zdGFuY2UuZmluZCggJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0ICRlbCA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IGlkICA9ICRlbC5kYXRhKCAnaWQnICk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHRvZ2dsZVNlbGVjdG9yID0gYC53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZVtkYXRhLWlkPVwiJHsgaWQgfVwiXWA7XG5cblx0XHRcdFx0XHRcdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYWNjb3JkaW9uIGlzIG9wZW5lZFxuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGlmICggcHJlc3NlZCApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICd0cnVlJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5jbG9zZXN0KCAnbGknICkuY2hpbGRyZW4oICd1bCcgKS5zaG93KCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5hdHRyKCAnYXJpYS1wcmVzc2VkJywgJ2ZhbHNlJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5jbG9zZXN0KCAnbGknICkuY2hpbGRyZW4oICd1bCcgKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIFByZXNlcnZlIHNvZnQgbGltaXQgc3RhdGUuXG5cdFx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5wcmVzZXJ2ZV9zb2Z0X2xpbWl0X3N0YXRlICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRpbnN0YW5jZS5oYXNDbGFzcyggJ2hhcy1zb2Z0LWxpbWl0JyApICkge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0ICRsaXN0V3JhcHBlciA9ICRpbnN0YW5jZS5maW5kKCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKTtcblxuXHRcdFx0XHRcdFx0XHRcdGlmICggJGxpc3RXcmFwcGVyLmhhc0NsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKS5hZGRDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICd0cnVlJyApO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1saXN0LXdyYXBwZXInICkucmVtb3ZlQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJyApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAnZmFsc2UnICk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGNvbnN0IF9odG1sID0gX2luc3RhbmNlLmZpbmQoICcud2NhcGYtZmlsdGVyLWlubmVyJyApLmh0bWwoKTtcblxuXHRcdFx0XHRcdFx0Ly8gRmluYWxseSB1cGRhdGUgdGhlIGluc3RhbmNlLlxuXHRcdFx0XHRcdFx0JGlubmVyLmh0bWwoIF9odG1sICk7XG5cblx0XHRcdFx0XHRcdCRpbnN0YW5jZS50cmlnZ2VyKCAnd2NhcGYtZmlsdGVyLXVwZGF0ZWQnLCBbIF9pbnN0YW5jZSBdICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBhY3RpdmUgZmlsdGVycyBhbmQgcmVzZXQgZmlsdGVycy5cblx0XHRcdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLWFjdGl2ZS1maWx0ZXJzLCAud2NhcGYtcmVzZXQtZmlsdGVycycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGNvbnN0ICR0aGF0ICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0XHRjb25zdCBpbnN0YW5jZUlkID0gJ1tkYXRhLWlkPVwiJyArICR0aGF0LmRhdGEoICdpZCcgKSArICdcIl0nO1xuXG5cdFx0XHRcdFx0XHQkdGhhdC5odG1sKCAkcmVzcG9uc2UuZmluZCggaW5zdGFuY2VJZCApLmh0bWwoKSApO1xuXHRcdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRcdC8vIFJlcGxhY2Ugb2xkIHNob3AgbG9vcCB3aXRoIG5ldyBvbmUuXG5cdFx0XHRcdFx0Y29uc3QgJHNob3BMb29wQ29udGFpbmVyID0gJHJlc3BvbnNlLmZpbmQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRcdFx0Y29uc3QgJG5vdEZvdW5kQ29udGFpbmVyID0gJHJlc3BvbnNlLmZpbmQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICk7XG5cblx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyID09PSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRXQ0FQRi5hZnRlclVwZGF0aW5nUHJvZHVjdHMoICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0cmVxdWVzdEZpbHRlcjogZnVuY3Rpb24oIHVybCwgdHJpZ2dlcmVkQnkgPSAnZmlsdGVyJyApIHtcblx0XHRcdGlmICggISB1cmwgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZGlzYWJsZV9hamF4ICkge1xuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IHVybDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7IHdjYXBmOiB0cnVlIH0sICcnLCB1cmwgKTtcblxuXHRcdFx0XHRXQ0FQRi5maWx0ZXJQcm9kdWN0cyggdHJpZ2dlcmVkQnkgKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGhhbmRsZU51bWJlcklucHV0RmlsdGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCByYW5nZU51bWJlclNlbGVjdG9ycyA9ICcud2NhcGYtcmFuZ2UtbnVtYmVyIC5taW4tdmFsdWUsIC53Y2FwZi1yYW5nZS1udW1iZXIgLm1heC12YWx1ZSc7XG5cblx0XHRcdCRib2R5Lm9uKCAnaW5wdXQnLCByYW5nZU51bWJlclNlbGVjdG9ycywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRpdGVtID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdGNvbnN0ICRyYW5nZU51bWJlciAgICAgID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1yYW5nZS1udW1iZXInICk7XG5cdFx0XHRcdGNvbnN0IGZvcm1hdE51bWJlcnMgICAgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWZvcm1hdC1udW1iZXJzJyApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1pblZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IG9sZE1pblZhbHVlICAgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBvbGRNYXhWYWx1ZSAgICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFBsYWNlcyAgICAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZGVjaW1hbC1wbGFjZXMnICk7XG5cdFx0XHRcdGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXRob3VzYW5kLXNlcGFyYXRvcicgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFNlcGFyYXRvciAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZGVjaW1hbC1zZXBhcmF0b3InICk7XG5cblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGl0ZW0uZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0Y29uc3QgZ2V0VmFsdWUgPSAoIGZsb2F0VmFsdWUgKSA9PiB7XG5cdFx0XHRcdFx0aWYgKCBmb3JtYXROdW1iZXJzICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG51bWJlckZvcm1hdCggZmxvYXRWYWx1ZSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gZmxvYXRWYWx1ZTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQkaXRlbS5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRsZXQgbWluVmFsdWUgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCkgKTtcblx0XHRcdFx0XHRsZXQgbWF4VmFsdWUgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCkgKTtcblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRcdFx0aWYgKCBpc05hTiggbWluVmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNaW5WYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0XHRcdGlmICggaXNOYU4oIG1heFZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgcmFuZ2VNaW5WYWx1ZS5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlIDwgcmFuZ2VNaW5WYWx1ZSApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNaW5WYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPiByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBtYXhWYWx1ZSA+IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgbWluVmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA+IG1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSBtaW5WYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBJZiB2YWx1ZSBpcyBub3QgY2hhbmdlZCB0aGVuIGRvbid0IHByb2NlZWQuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gb2xkTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IG9sZE1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHQvLyBSZW1vdmUgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJHJhbmdlTnVtYmVyLmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIEFkZCByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0XHRjb25zdCB1cmwgPSAkcmFuZ2VOdW1iZXIuZGF0YSggJ3VybCcgKS5yZXBsYWNlKCAnJTFzJywgbWluVmFsdWUgKS5yZXBsYWNlKCAnJTJzJywgbWF4VmFsdWUgKTtcblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlRGF0ZUlucHV0RmlsdGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsICcud2NhcGYtZGF0ZS1pbnB1dCAuZGF0ZS1pbnB1dCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkZmlsdGVyID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZGF0ZS1pbnB1dCcgKTtcblx0XHRcdFx0Y29uc3QgaXNSYW5nZSA9ICRmaWx0ZXIuZGF0YSggJ2lzLXJhbmdlJyApO1xuXG5cdFx0XHRcdGxldCBmaWx0ZXJVcmwgPSAnJztcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkZmlsdGVyLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdGlmICggaXNSYW5nZSApIHtcblx0XHRcdFx0XHRjb25zdCBmcm9tID0gJGZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKS52YWwoKTtcblx0XHRcdFx0XHRjb25zdCB0byAgID0gJGZpbHRlci5maW5kKCAnLmRhdGUtdG8taW5wdXQnICkudmFsKCk7XG5cblx0XHRcdFx0XHRpZiAoIGZyb20gJiYgdG8gKSB7XG5cdFx0XHRcdFx0XHRmaWx0ZXJVcmwgPSAkZmlsdGVyLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIGZyb20gKS5yZXBsYWNlKCAnJTJzJywgdG8gKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCAhIGZyb20gJiYgISB0byApIHtcblx0XHRcdFx0XHRcdGZpbHRlclVybCA9ICRmaWx0ZXIuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IGZyb20gPSAkZmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApLnZhbCgpO1xuXG5cdFx0XHRcdFx0aWYgKCBmcm9tICkge1xuXHRcdFx0XHRcdFx0ZmlsdGVyVXJsID0gJGZpbHRlci5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclcycsIGZyb20gKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZmlsdGVyVXJsID0gJGZpbHRlci5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIGZpbHRlclVybCApIHtcblx0XHRcdFx0XHQkZmlsdGVyLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGZpbHRlci5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIGZpbHRlclVybCApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlTGlzdEZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgbmF0aXZlSW5wdXRzID0gJy5saXN0LXR5cGUtbmF0aXZlIFt0eXBlPVwiY2hlY2tib3hcIl0sJyArXG5cdFx0XHRcdCcubGlzdC10eXBlLW5hdGl2ZSBbdHlwZT1cInJhZGlvXCJdLCcgK1xuXHRcdFx0XHQnLmxpc3QtdHlwZS1jdXN0b20tY2hlY2tib3ggW3R5cGU9XCJjaGVja2JveFwiXSc7XG5cblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgbmF0aXZlSW5wdXRzLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyLWl0ZW0nICkudG9nZ2xlQ2xhc3MoICdpdGVtLWFjdGl2ZScgKTtcblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkKCB0aGlzICkuZGF0YSggJ3VybCcgKSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRjb25zdCBjdXN0b21SYWRpb1NlbGVjdG9yID0gJy5saXN0LXR5cGUtY3VzdG9tLXJhZGlvJztcblxuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCBjdXN0b21SYWRpb1NlbGVjdG9yICsgJyBbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZpbHRlci1pdGVtJyApLnRvZ2dsZUNsYXNzKCAnaXRlbS1hY3RpdmUnICk7XG5cblx0XHRcdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzU4Mzk5MjRcblx0XHRcdFx0JCggdGhpcyApXG5cdFx0XHRcdFx0LmNsb3Nlc3QoIGN1c3RvbVJhZGlvU2VsZWN0b3IgKVxuXHRcdFx0XHRcdC5maW5kKCAnLndjYXBmLWZpbHRlci1pdGVtLml0ZW0tYWN0aXZlIFt0eXBlPVwiY2hlY2tib3hcIl0nIClcblx0XHRcdFx0XHQubm90KCB0aGlzIClcblx0XHRcdFx0XHQucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApXG5cdFx0XHRcdFx0LmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyLWl0ZW0nIClcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoICdpdGVtLWFjdGl2ZScgKTtcblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkKCB0aGlzICkuZGF0YSggJ3VybCcgKSApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlRHJvcGRvd25GaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgJy53Y2FwZi1kcm9wZG93bi13cmFwcGVyIHNlbGVjdCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkc2VsZWN0ICAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgdmFsdWVzICAgICAgICAgPSAkc2VsZWN0LnZhbCgpO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJVUkwgICAgICA9ICRzZWxlY3QuZGF0YSggJ3VybCcgKTtcblx0XHRcdFx0Y29uc3QgY2xlYXJGaWx0ZXJVUkwgPSAkc2VsZWN0LmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApO1xuXHRcdFx0XHRsZXQgdXJsO1xuXG5cdFx0XHRcdGlmICggdmFsdWVzLmxlbmd0aCApIHtcblx0XHRcdFx0XHR1cmwgPSBmaWx0ZXJVUkwucmVwbGFjZSggJyVzJywgdmFsdWVzLnRvU3RyaW5nKCkgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR1cmwgPSBjbGVhckZpbHRlclVSTDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlUGFnaW5hdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfcGFnaW5hdGlvbl92aWFfYWpheCAmJiB3Y2FwZl9wYXJhbXMucGFnaW5hdGlvbl9jb250YWluZXIgKSB7XG5cdFx0XHRcdGNvbnN0ICRjb250YWluZXIgPSAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0XHRjb25zdCBfc2VsZWN0b3JzID0gd2NhcGZfcGFyYW1zLnBhZ2luYXRpb25fY29udGFpbmVyLnNwbGl0KCAnLCcgKTtcblx0XHRcdFx0Y29uc3Qgc2VsZWN0b3JzICA9IFtdO1xuXG5cdFx0XHRcdF9zZWxlY3RvcnMuZm9yRWFjaCggc2VsZWN0b3IgPT4ge1xuXHRcdFx0XHRcdGlmICggc2VsZWN0b3IgKSB7XG5cdFx0XHRcdFx0XHRzZWxlY3RvcnMucHVzaCggc2VsZWN0b3IgKyAnIGEnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0Y29uc3Qgc2VsZWN0b3IgPSBzZWxlY3RvcnMuam9pbiggJywnICk7XG5cblx0XHRcdFx0aWYgKCAkY29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHQkY29udGFpbmVyLm9uKCAnY2xpY2snLCBzZWxlY3RvciwgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IGhyZWYgPSAkKCB0aGlzICkuYXR0ciggJ2hyZWYnICk7XG5cblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIGhyZWYsICdwYWdpbmF0ZScgKTtcblx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdGhhbmRsZURlZmF1bHRPcmRlcmJ5OiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMuc29ydGluZ19jb250cm9sICkge1xuXHRcdFx0XHQvLyBTdWJtaXQgdGhlIG9yZGVyYnkgZm9ybSB3aGVuIHZhbHVlIGlzIGNoYW5nZWQuXG5cdFx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgZGVmYXVsdE9yZGVyQnlFbGVtZW50LCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKCB0aGlzICkuY2xvc2VzdCggJ2Zvcm0nICkudHJpZ2dlciggJ3N1Ym1pdCcgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUHJldmVudCB0aGUgYXV0byBzdWJtaXNzaW9uIG9mIHRoZSBvcmRlcmJ5IGZvcm0uXG5cdFx0XHQkYm9keS5vbiggJ3N1Ym1pdCcsIHdjYXBmX3BhcmFtcy5vcmRlcmJ5X2Zvcm0sIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgdmlhIGFqYXggd2hlbiB0aGUgb3JkZXJieSB2YWx1ZSBpcyBjaGFuZ2VkLlxuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCBkZWZhdWx0T3JkZXJCeUVsZW1lbnQsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBvcmRlciA9ICQoIHRoaXMgKS52YWwoKTtcblxuXHRcdFx0XHRjb25zdCB1cmwgPSBuZXcgVVJMKCB3aW5kb3cubG9jYXRpb24gKTtcblx0XHRcdFx0dXJsLnNlYXJjaFBhcmFtcy5zZXQoICdvcmRlcmJ5Jywgb3JkZXIgKTtcblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCBnZXRPcmRlckJ5VXJsKCB1cmwuaHJlZiApICk7XG5cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlQ2xlYXJGaWx0ZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtZmlsdGVyLWNsZWFyLWJ0bicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5hdHRyKCAnZGF0YS1jbGVhci1maWx0ZXItdXJsJyApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVGaWx0ZXJUb29sdGlwOiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRSZWZlcmVuY2Vcblx0XHRcdGlmICggJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHRpcHB5ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMudXNlX3RpcHB5anMgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZFJlZmVyZW5jZVxuXHRcdFx0dGlwcHkoICcud2NhcGYtZmlsdGVyLXRvb2x0aXAnLCB7XG5cdFx0XHRcdHBsYWNlbWVudDogJ3RvcCcsXG5cdFx0XHRcdGNvbnRlbnQoIHJlZmVyZW5jZSApIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSggJ2RhdGEtY29udGVudCcgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0YWxsb3dIVE1MOiB0cnVlLFxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aW5pdENvbWJvYm94OiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggISBqUXVlcnkoKS5jaG9zZW5XQ0FQRiApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB0ZW1wbGF0ZVJlc3VsdCA9ICggdGV4dCwgZGF0YSApID0+IHtcblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQnPHNwYW4+JyArIHRleHQgKyAnPC9zcGFuPicsXG5cdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwid2NhcGYtY291bnRcIj4nICsgZGF0YVsgJ2NvdW50TWFya3VwJyBdICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRdLmpvaW4oICcnICk7XG5cdFx0XHR9O1xuXG5cdFx0XHRjb25zdCB0ZW1wbGF0ZVNlbGVjdGlvbiA9ICggdGV4dCwgZGF0YSApID0+IHtcblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJ3Y2FwZi1jb3VudC0nICsgZGF0YS5jb3VudCArICdcIj4nICsgdGV4dCArICc8L3NwYW4+Jyxcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJ3Y2FwZi1jb3VudCB3Y2FwZi1jb3VudC0nICsgZGF0YS5jb3VudCArICdcIj4nICsgZGF0YVsgJ2NvdW50TWFya3VwJyBdICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRdLmpvaW4oICcnICk7XG5cdFx0XHR9O1xuXG5cdFx0XHRjb25zdCBkZWZhdWx0cyA9IHtcblx0XHRcdFx0aW5oZXJpdF9zZWxlY3RfY2xhc3NlczogdHJ1ZSxcblx0XHRcdFx0aW5oZXJpdF9vcHRpb25fY2xhc3NlczogdHJ1ZSxcblx0XHRcdFx0bm9fcmVzdWx0c190ZXh0OiB3Y2FwZl9wYXJhbXMuY29tYm9ib3hfbm9fcmVzdWx0c190ZXh0LFxuXHRcdFx0XHRvcHRpb25zX25vbmVfdGV4dDogd2NhcGZfcGFyYW1zLmNvbWJvYm94X29wdGlvbnNfbm9uZV90ZXh0LFxuXHRcdFx0XHRzZWFyY2hfY29udGFpbnM6IHRydWUsIC8vIE1hdGNoIGZyb20gYW55d2hlcmUgaW4gc3RyaW5nLlxuXHRcdFx0XHRzZWFyY2hfaW5fdmFsdWVzOiB0cnVlLCAvLyBTZWFyY2ggaW4gdmFsdWVzIGFsc28uXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5pc19ydGwgKSB7XG5cdFx0XHRcdGRlZmF1bHRzWyAncnRsJyBdID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1jaG9zZW4nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0aGlzICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7IC4uLmRlZmF1bHRzIH07XG5cblx0XHRcdFx0Ly8gSWYgaGllcmFyY2h5IGVuYWJsZWQgdGhlbiB3ZSBzaG93IHRoZSBzZWxlY3RlZCBvcHRpb25zLlxuXHRcdFx0XHRpZiAoICR0aGlzLmhhc0NsYXNzKCAnaGFzLWhpZXJhcmNoeScgKSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJyBdID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJyBdID0gd2NhcGZfcGFyYW1zLmNvbWJvYm94X2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEVuYWJsZSB0ZW1wbGF0aW5nIHdoZW4gc2hvd2luZyBjb3VudC5cblx0XHRcdFx0aWYgKCAkdGhpcy5oYXNDbGFzcyggJ3dpdGgtY291bnQnICkgKSB7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ3RlbXBsYXRlUmVzdWx0JyBdICAgID0gdGVtcGxhdGVSZXN1bHQ7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ3RlbXBsYXRlU2VsZWN0aW9uJyBdID0gdGVtcGxhdGVTZWxlY3Rpb247XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBEaXNhYmxlIHNlYXJjaCBib3guXG5cdFx0XHRcdGlmICggISAkdGhpcy5kYXRhKCAnZW5hYmxlLXNlYXJjaCcgKSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnZGlzYWJsZV9zZWFyY2gnIF0gPSB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JHRoaXMuY2hvc2VuV0NBUEYoIG9wdGlvbnMgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gQXR0YWNoIGNob3NlbiBmb3IgZGVmYXVsdCBvcmRlcmJ5LlxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuYXR0YWNoX2NvbWJvYm94X29uX3NvcnRpbmcgKSB7XG5cdFx0XHRcdGxldCBkaXNhYmxlU2VhcmNoID0gdHJ1ZTtcblxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zZWFyY2hfYm94X2luX2RlZmF1bHRfb3JkZXJieSApIHtcblx0XHRcdFx0XHRkaXNhYmxlU2VhcmNoID0gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0cyB9O1xuXG5cdFx0XHRcdG9wdGlvbnNbICdkaXNhYmxlX3NlYXJjaCcgXSA9IGRpc2FibGVTZWFyY2g7XG5cblx0XHRcdFx0JGJvZHkuZmluZCggZGVmYXVsdE9yZGVyQnlFbGVtZW50ICkuY2hvc2VuV0NBUEYoIG9wdGlvbnMgKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGluaXRSYW5nZVNsaWRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLXJhbmdlLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGl0ZW0gICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgJHNsaWRlciA9ICRpdGVtLmZpbmQoICcud2NhcGYtbm91aS1zbGlkZXInICk7XG5cblx0XHRcdFx0Y29uc3Qgc2xpZGVySWQgICAgICAgICAgPSAkc2xpZGVyLmF0dHIoICdpZCcgKTtcblx0XHRcdFx0Y29uc3QgZGlzcGxheVZhbHVlc0FzICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kaXNwbGF5LXZhbHVlcy1hcycgKTtcblx0XHRcdFx0Y29uc3QgZm9ybWF0TnVtYmVycyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1mb3JtYXQtbnVtYmVycycgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgc3RlcCAgICAgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1zdGVwJyApICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1wbGFjZXMnICk7XG5cdFx0XHRcdGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gJGl0ZW0uYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBtaW5WYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBtYXhWYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCAkbWluVmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWluLXZhbHVlJyApO1xuXHRcdFx0XHRjb25zdCAkbWF4VmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWF4LXZhbHVlJyApO1xuXG5cdFx0XHRcdGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBzbGlkZXJJZCApO1xuXG5cdFx0XHRcdG5vVWlTbGlkZXIuY3JlYXRlKCBzbGlkZXIsIHtcblx0XHRcdFx0XHRzdGFydDogWyBtaW5WYWx1ZSwgbWF4VmFsdWUgXSxcblx0XHRcdFx0XHRzdGVwLFxuXHRcdFx0XHRcdGNvbm5lY3Q6IHRydWUsXG5cdFx0XHRcdFx0Y3NzUHJlZml4OiAnd2NhcGYtbm91aS0nLFxuXHRcdFx0XHRcdHJhbmdlOiB7XG5cdFx0XHRcdFx0XHQnbWluJzogcmFuZ2VNaW5WYWx1ZSxcblx0XHRcdFx0XHRcdCdtYXgnOiByYW5nZU1heFZhbHVlLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAndXBkYXRlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHRsZXQgbWluVmFsdWU7XG5cdFx0XHRcdFx0bGV0IG1heFZhbHVlO1xuXG5cdFx0XHRcdFx0aWYgKCBmb3JtYXROdW1iZXJzICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSBudW1iZXJGb3JtYXQoIHZhbHVlc1sgMCBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSBudW1iZXJGb3JtYXQoIHZhbHVlc1sgMSBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMSBdICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCAncGxhaW5fdGV4dCcgPT09IGRpc3BsYXlWYWx1ZXNBcyApIHtcblx0XHRcdFx0XHRcdCRtaW5WYWx1ZS5odG1sKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdFx0JG1heFZhbHVlLmh0bWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRtaW5WYWx1ZS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0XHQkbWF4VmFsdWUudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApIHtcblx0XHRcdFx0XHRjb25zdCBfbWluVmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDAgXSApO1xuXHRcdFx0XHRcdGNvbnN0IF9tYXhWYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMSBdICk7XG5cblx0XHRcdFx0XHQvLyBJZiB2YWx1ZSBpcyBub3QgY2hhbmdlZCB0aGVuIGRvbid0IHByb2NlZWQuXG5cdFx0XHRcdFx0aWYgKCBfbWluVmFsdWUgPT09IG1pblZhbHVlICYmIF9tYXhWYWx1ZSA9PT0gbWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBfbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgX21heFZhbHVlID09PSByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0Ly8gUmVtb3ZlIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICRpdGVtLmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIEFkZCByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0XHRjb25zdCB1cmwgPSAkaXRlbS5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclMXMnLCBfbWluVmFsdWUgKS5yZXBsYWNlKCAnJTJzJywgX21heFZhbHVlICk7XG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkbWluVmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRcdGNsZWFyVGltZW91dCggJGlucHV0LmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgbWluVmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBtaW5WYWx1ZSwgbnVsbCBdICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0JG1heFZhbHVlLm9uKCAnaW5wdXQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRcdCRpbnB1dC5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5zZXQoIFsgbnVsbCwgbWF4VmFsdWUgXSApO1xuXG5cdFx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aW5pdERhdGVwaWNrZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAhIGpRdWVyeSgpLmRhdGVwaWNrZXIgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgJHdjYXBmRGF0ZUZpbHRlciA9ICRib2R5LmZpbmQoICcud2NhcGYtZGF0ZS1pbnB1dCcgKTtcblxuXHRcdFx0Y29uc3QgZm9ybWF0ICAgICAgICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1mb3JtYXQnICk7XG5cdFx0XHRjb25zdCB5ZWFyRHJvcGRvd24gID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLXBpY2tlci15ZWFyLWRyb3Bkb3duJyApO1xuXHRcdFx0Y29uc3QgbW9udGhEcm9wZG93biA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1waWNrZXItbW9udGgtZHJvcGRvd24nICk7XG5cblx0XHRcdGNvbnN0ICRmcm9tID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKTtcblx0XHRcdGNvbnN0ICR0byAgID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtdG8taW5wdXQnICk7XG5cblx0XHRcdCRmcm9tLmRhdGVwaWNrZXIoIHtcblx0XHRcdFx0ZGF0ZUZvcm1hdDogZm9ybWF0LFxuXHRcdFx0XHRjaGFuZ2VZZWFyOiB5ZWFyRHJvcGRvd24sXG5cdFx0XHRcdGNoYW5nZU1vbnRoOiBtb250aERyb3Bkb3duLFxuXHRcdFx0fSApO1xuXG5cdFx0XHQkdG8uZGF0ZXBpY2tlcigge1xuXHRcdFx0XHRkYXRlRm9ybWF0OiBmb3JtYXQsXG5cdFx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdFx0Y2hhbmdlTW9udGg6IG1vbnRoRHJvcGRvd24sXG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRpbml0RmlsdGVyT3B0aW9uVG9vbHRpcDogZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkUmVmZXJlbmNlXG5cdFx0XHRpZiAoICdmdW5jdGlvbicgIT09IHR5cGVvZiB0aXBweSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLnVzZV90aXBweWpzICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHRvb2x0aXBQb3NpdGlvbnMgPSBbICd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2xlZnQnIF07XG5cblx0XHRcdHRvb2x0aXBQb3NpdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oIHRvb2x0aXBQb3NpdGlvbiApIHtcblx0XHRcdFx0Y29uc3QgaWRlbnRpZmllciA9ICdkYXRhLXdjYXBmLXRvb2x0aXAtJyArIHRvb2x0aXBQb3NpdGlvbjtcblxuXHRcdFx0XHQvLyBub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkUmVmZXJlbmNlXG5cdFx0XHRcdGNvbnN0IGluc3RhbmNlcyA9IHRpcHB5KCAnWycgKyBpZGVudGlmaWVyICsgJ10nLCB7XG5cdFx0XHRcdFx0cGxhY2VtZW50OiB0b29sdGlwUG9zaXRpb24sXG5cdFx0XHRcdFx0Y29udGVudCggcmVmZXJlbmNlICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJlZmVyZW5jZS5nZXRBdHRyaWJ1dGUoIGlkZW50aWZpZXIgKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGFsbG93SFRNTDogdHJ1ZSxcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHdpbmRvdy50aXBweUluc3RhbmNlcyA9IHRpcHB5SW5zdGFuY2VzLmNvbmNhdCggaW5zdGFuY2VzICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRcdFdDQVBGLmluaXRDb21ib2JveCgpO1xuXHRcdFx0V0NBUEYuaW5pdFJhbmdlU2xpZGVyKCk7XG5cdFx0XHRXQ0FQRi5pbml0RGF0ZXBpY2tlcigpO1xuXHRcdFx0V0NBUEYuaW5pdEZpbHRlck9wdGlvblRvb2x0aXAoKTtcblx0XHR9LFxuXHRcdGluaXRQb3BTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5yZWxvYWRfb25fYmFjayAmJiB3Y2FwZl9wYXJhbXMuZm91bmRfd2NhcGYgKSB7XG5cdFx0XHRcdGhpc3RvcnkucmVwbGFjZVN0YXRlKCB7IHdjYXBmOiB0cnVlIH0sICcnLCB3aW5kb3cubG9jYXRpb24gKTtcblxuXHRcdFx0XHQvLyBIYW5kbGUgdGhlIHBvcHN0YXRlIGV2ZW50KGJyb3dzZXIncyBiYWNrL2ZvcndhcmQpXG5cdFx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAncG9wc3RhdGUnLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRpZiAoIG51bGwgIT09IGUuc3RhdGUgJiYgZS5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSggJ3djYXBmJyApICkge1xuXHRcdFx0XHRcdFx0V0NBUEYuZmlsdGVyUHJvZHVjdHMoICdwb3BzdGF0ZScgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIEVuYWJsZSBpdCBpZiBuZWNlc3NhcnkuXG5cdCAqXG5cdCAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzMzMDA0OTE3XG5cdCAqL1xuXHRpZiAoICdzY3JvbGxSZXN0b3JhdGlvbicgaW4gaGlzdG9yeSApIHtcblx0XHQvLyBoaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uID0gJ21hbnVhbCc7XG5cdH1cblxufSggalF1ZXJ5LCB3aW5kb3cgKSApO1xuXG4oIGZ1bmN0aW9uKCAkLCBXQ0FQRiApIHtcblxuXHRXQ0FQRi5pbml0KCk7XG5cdFdDQVBGLmluaXRQb3BTdGF0ZSgpO1xuXG5cdFdDQVBGLmhhbmRsZUZpbHRlckFjY29yZGlvbigpO1xuXHRXQ0FQRi5oYW5kbGVIaWVyYXJjaHlUb2dnbGUoKTtcblx0V0NBUEYuaGFuZGxlU29mdExpbWl0KCk7XG5cdFdDQVBGLmhhbmRsZVNlYXJjaEZpbHRlck9wdGlvbnMoKTtcblxuXHRXQ0FQRi5oYW5kbGVMaXN0RmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVEcm9wZG93bkZpbHRlcnMoKTtcblx0V0NBUEYuaGFuZGxlTnVtYmVySW5wdXRGaWx0ZXJzKCk7XG5cdFdDQVBGLmhhbmRsZURhdGVJbnB1dEZpbHRlcnMoKTtcblx0V0NBUEYuaGFuZGxlUGFnaW5hdGlvbigpO1xuXHRXQ0FQRi5oYW5kbGVEZWZhdWx0T3JkZXJieSgpO1xuXG5cdFdDQVBGLmhhbmRsZUNsZWFyRmlsdGVyKCk7XG5cblx0V0NBUEYuaGFuZGxlRmlsdGVyVG9vbHRpcCgpO1xuXG5cdC8qKlxuXHQgKiBNYWtlIGl0IGNvbXBhdGlibGUgd2l0aCBvdGhlciBwbHVnaW5zLlxuXHQgKi9cblx0JCggZG9jdW1lbnQgKS5vbiggJ3djYXBmX2FmdGVyX3VwZGF0aW5nX3Byb2R1Y3RzJywgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gd29vLXZhcmlhdGlvbi1zd2F0Y2hlc1xuXHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggJ3dvb192YXJpYXRpb25fc3dhdGNoZXNfcHJvX2luaXQnICk7XG5cdH0gKTtcblxufSggalF1ZXJ5LCB3aW5kb3cuV0NBUEYgKSApO1xuIiwiLyoqXG4gKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNDE0MTgxM1xuICpcbiAqIEBwYXJhbSBudW1iZXJcbiAqIEBwYXJhbSBkZWNpbWFsc1xuICogQHBhcmFtIGRlY19wb2ludFxuICogQHBhcmFtIHRob3VzYW5kc19zZXBcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBudW1iZXJGb3JtYXQoIG51bWJlciwgZGVjaW1hbHMsIGRlY19wb2ludCwgdGhvdXNhbmRzX3NlcCApIHtcblx0Ly8gU3RyaXAgYWxsIGNoYXJhY3RlcnMgYnV0IG51bWVyaWNhbCBvbmVzLlxuXHRudW1iZXIgPSAoIG51bWJlciArICcnICkucmVwbGFjZSggL1teXFxkK1xcLUVlLl0vZywgJycgKTtcblxuXHRjb25zdCBuICAgID0gISBpc0Zpbml0ZSggK251bWJlciApID8gMCA6ICtudW1iZXI7XG5cdGNvbnN0IHByZWMgPSAhIGlzRmluaXRlKCArZGVjaW1hbHMgKSA/IDAgOiBNYXRoLmFicyggZGVjaW1hbHMgKTtcblx0Y29uc3Qgc2VwICA9ICggdHlwZW9mIHRob3VzYW5kc19zZXAgPT09ICd1bmRlZmluZWQnICkgPyAnLCcgOiB0aG91c2FuZHNfc2VwO1xuXHRjb25zdCBkZWMgID0gKCB0eXBlb2YgZGVjX3BvaW50ID09PSAndW5kZWZpbmVkJyApID8gJy4nIDogZGVjX3BvaW50O1xuXG5cdGxldCBzO1xuXG5cdGNvbnN0IHRvRml4ZWRGaXggPSBmdW5jdGlvbiggbiwgcHJlYyApIHtcblx0XHRjb25zdCBrID0gTWF0aC5wb3coIDEwLCBwcmVjICk7XG5cdFx0cmV0dXJuICcnICsgTWF0aC5yb3VuZCggbiAqIGsgKSAvIGs7XG5cdH07XG5cblx0Ly8gRml4IGZvciBJRSBwYXJzZUZsb2F0KDAuNTUpLnRvRml4ZWQoMCkgPSAwO1xuXHRzID0gKCBwcmVjID8gdG9GaXhlZEZpeCggbiwgcHJlYyApIDogJycgKyBNYXRoLnJvdW5kKCBuICkgKS5zcGxpdCggJy4nICk7XG5cblx0aWYgKCBzWyAwIF0ubGVuZ3RoID4gMyApIHtcblx0XHRzWyAwIF0gPSBzWyAwIF0ucmVwbGFjZSggL1xcQig/PSg/OlxcZHszfSkrKD8hXFxkKSkvZywgc2VwICk7XG5cdH1cblxuXHRpZiAoICggc1sgMSBdIHx8ICcnICkubGVuZ3RoIDwgcHJlYyApIHtcblx0XHRzWyAxIF0gPSBzWyAxIF0gfHwgJyc7XG5cdFx0c1sgMSBdICs9IG5ldyBBcnJheSggcHJlYyAtIHNbIDEgXS5sZW5ndGggKyAxICkuam9pbiggJzAnICk7XG5cdH1cblxuXHRyZXR1cm4gcy5qb2luKCBkZWMgKTtcbn1cblxuZnVuY3Rpb24gY2xlYW5VcmwoIHVybCApIHtcblx0cmV0dXJuIHVybC5yZXBsYWNlKCAvJTJDL2csICcsJyApO1xufVxuXG5mdW5jdGlvbiBnZXRPcmRlckJ5VXJsKCB1cmwgKSB7XG5cdGNvbnN0IHBhZ2VkID0gcGFyc2VJbnQoIHVybC5yZXBsYWNlKCAvLitcXC9wYWdlXFwvKFxcZCspKy8sICckMScgKSApO1xuXG5cdGlmICggcGFnZWQgKSB7XG5cdFx0dXJsID0gdXJsLnJlcGxhY2UoIC9wYWdlXFwvKFxcZCspXFwvLywgJycgKTtcblx0fVxuXG5cdHJldHVybiBjbGVhblVybCggdXJsICk7XG59XG4iXX0=
