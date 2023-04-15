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
  'chosen_display_selected_options': '',
  'chosen_no_results_text': '',
  'chosen_options_none_text': '',
  'search_box_in_default_orderby': '',
  'preserve_hierarchy_accordion_state': '',
  'preserve_soft_limit_state': '',
  'enable_animation_for_filter_accordion': '',
  'filter_accordion_animation_speed': '',
  'filter_accordion_animation_easing': '',
  'enable_animation_for_hierarchy_accordion': '',
  'hierarchy_accordion_animation_speed': '',
  'hierarchy_accordion_animation_easing': '',
  'restore_focus_after_filtering': '',
  'scroll_to_top_speed': '',
  'scroll_to_top_easing': '',
  'immediate_scroll_on_paginate': '',
  'is_mobile': '',
  'reload_on_back': '',
  'found_wcapf': '',
  'update_document_title': '',
  'use_tippyjs': '',
  'shop_loop_container': '',
  'not_found_container': '',
  'pagination_container': '',
  'enable_pagination_via_ajax': '',
  'sorting_control': '',
  'attach_chosen_on_sorting': '',
  'loading_animation': '',
  'scroll_window': '',
  'scroll_window_for': '',
  'scroll_window_when': '',
  'scroll_window_custom_element': '',
  'scroll_to_top_offset': '',
  'disable_scroll_animation': '',
  'more_selectors': '',
  'custom_scripts': ''
};

(function ($, window) {
  var _delay = parseInt(wcapf_params.filter_input_delay);

  var delay = _delay >= 0 ? _delay : 800;
  var $body = $('body');
  var instanceIds = [];
  $('.wcapf-filter').each(function () {
    var id = $(this).data('id');

    if (!id) {
      return;
    }

    instanceIds.push(id);
  });
  var focusedElm;
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
    scrollTo: function scrollTo(triggeredBy) {
      if ('none' === wcapf_params.scroll_window) {
        return;
      }

      var allowed = [];
      var scrollWhen = wcapf_params.scroll_window_when;

      if ('all' === scrollWhen) {
        allowed.push('filter');
        allowed.push('paginate');
      } else {
        allowed.push(scrollWhen);
      }

      if (!allowed.includes(triggeredBy)) {
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

      var adjustingOffset, offset;

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

        if (wcapf_params.disable_scroll_animation) {
          window.scrollTo({
            top: offset
          });
        } else {
          $('html, body').stop().animate({
            scrollTop: offset
          }, wcapf_params.scroll_to_top_speed, wcapf_params.scroll_to_top_easing);
        }
      }
    },
    // Things are done before fetching the products like showing the loading indicator.
    beforeFetchingProducts: function beforeFetchingProducts(triggeredBy) {
      // Track the current element focus.
      focusedElm = document.activeElement;
      $body.find('.wcapf-loader').addClass('is-active'); // Scroll into view on paginate.

      if ('paginate' === triggeredBy && wcapf_params.immediate_scroll_on_paginate) {
        WCAPF.scrollTo(triggeredBy);
      }

      $body.trigger('wcapf_before_fetching_products', [triggeredBy]);
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
      $body.trigger('wcapf_before_updating_products', [$response, triggeredBy]);
    },
    afterUpdatingProducts: function afterUpdatingProducts($response, triggeredBy) {
      WCAPF.updateProductsCountResult($response); // Restore the focus (Maybe restoring the focus in mobile device isn't good).

      if (wcapf_params.restore_focus_after_filtering && !wcapf_params.is_mobile) {
        if (document.body !== focusedElm) {
          if (focusedElm.id) {
            $("#".concat(focusedElm.id)).focus();
          }
        }
      } // Reinitialize wcapf.


      WCAPF.init(); // Scroll into view.

      if ('paginate' === triggeredBy && wcapf_params.immediate_scroll_on_paginate) {// Do nothing because it already happened.
      } else {
        WCAPF.scrollTo(triggeredBy);
      } // Trigger events.


      $(document).trigger('ready');
      $(window).trigger('scroll');
      $(window).trigger('resize');

      if (wcapf_params.custom_scripts) {
        eval(wcapf_params.custom_scripts);
      }

      $body.trigger('wcapf_after_updating_products', [$response, triggeredBy]);
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

      var hostname = location.hostname; // TODO: Remove from production build.

      if ('localhost' === hostname) {
        url = url.replace('http://wcfilter-2.test', '//localhost:3001');
      } // window.location.href = url;


      history.pushState({
        wcapf: true
      }, '', url);
      WCAPF.filterProducts(triggeredBy);
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
        $body.on('change', '.woocommerce-ordering select.orderby', function () {
          $(this).closest('form').trigger('submit');
        });
        return;
      } // Prevent the auto submission of the orderby form.


      $body.on('submit', '.woocommerce-ordering', function () {
        return false;
      }); // Handle the filter request via ajax when the orderby value is changed.

      $body.on('change', '.woocommerce-ordering select.orderby', function () {
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
        no_results_text: wcapf_params.chosen_no_results_text,
        options_none_text: wcapf_params.chosen_options_none_text,
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
          options['display_selected_options'] = wcapf_params.chosen_display_selected_options;
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

      if (wcapf_params.attach_chosen_on_sorting) {
        var disableSearch = true;

        if (wcapf_params.search_box_in_default_orderby) {
          disableSearch = false;
        }

        var options = _objectSpread({}, defaults);

        options['disable_search'] = disableSearch;
        $body.find('.woocommerce-ordering select.orderby').chosenWCAPF(options);
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

          $body.trigger('wcapf-nouislider-update', [$item, values]);
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
          filterProductsAccordingToSlider(values);
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

  $('body').on('wcapf_after_updating_products', function () {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJ1dGlscy5qcyJdLCJuYW1lcyI6WyJ3Y2FwZl9wYXJhbXMiLCIkIiwid2luZG93IiwiX2RlbGF5IiwicGFyc2VJbnQiLCJmaWx0ZXJfaW5wdXRfZGVsYXkiLCJkZWxheSIsIiRib2R5IiwiaW5zdGFuY2VJZHMiLCJlYWNoIiwiaWQiLCJkYXRhIiwicHVzaCIsImZvY3VzZWRFbG0iLCJ0aXBweUluc3RhbmNlcyIsIldDQVBGIiwiaGFuZGxlRmlsdGVyQWNjb3JkaW9uIiwidG9nZ2xlQWNjb3JkaW9uIiwiJGVsIiwicHJlc3NlZCIsImF0dHIiLCIkZmlsdGVySW5uZXIiLCJjbG9zZXN0IiwiY2hpbGRyZW4iLCJlbmFibGVfYW5pbWF0aW9uX2Zvcl9maWx0ZXJfYWNjb3JkaW9uIiwic2xpZGVUb2dnbGUiLCJmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsInRvZ2dsZSIsIm9uIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsIiR0cmlnZ2VyIiwiZmluZCIsImhhbmRsZUhpZXJhcmNoeVRvZ2dsZSIsIiRjaGlsZCIsImVuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24iLCJoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsImtleSIsInByZXZlbnREZWZhdWx0IiwiaGFuZGxlU29mdExpbWl0IiwidG9nZ2xlRmlsdGVyT3B0aW9ucyIsIiRsaXN0V3JhcHBlciIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJoYW5kbGVTZWFyY2hGaWx0ZXJPcHRpb25zIiwiJHRoYXQiLCIkaW5uZXIiLCIkZmlsdGVyIiwic29mdExpbWl0RW5hYmxlZCIsImhhc0NsYXNzIiwic29mdExpbWl0VG9nZ2xlIiwibm9SZXN1bHRzIiwidmlzaWJsZU9wdGlvbnMiLCJrZXl3b3JkIiwidmFsIiwibGVuZ3RoIiwiaW5kZXgiLCIkZmlsdGVySXRlbSIsInJlbW92ZUF0dHIiLCJ0ZXh0IiwiaGlkZSIsImxhYmVsIiwidG9TdHJpbmciLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwic2hvdyIsInVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQiLCIkcmVzcG9uc2UiLCIkY29udGFpbmVyIiwic2hvcF9sb29wX2NvbnRhaW5lciIsInNlbGVjdG9yIiwibmV3Q291bnQiLCJodG1sIiwiaGFzIiwic2Nyb2xsVG8iLCJ0cmlnZ2VyZWRCeSIsInNjcm9sbF93aW5kb3ciLCJhbGxvd2VkIiwic2Nyb2xsV2hlbiIsInNjcm9sbF93aW5kb3dfd2hlbiIsInNjcm9sbEZvciIsInNjcm9sbF93aW5kb3dfZm9yIiwiaXNNb2JpbGUiLCJpc19tb2JpbGUiLCJwcm9jZWVkIiwiYWRqdXN0aW5nT2Zmc2V0Iiwib2Zmc2V0Iiwic2Nyb2xsX3RvX3RvcF9vZmZzZXQiLCJjb250YWluZXIiLCJub3RfZm91bmRfY29udGFpbmVyIiwic2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudCIsInRvcCIsImRpc2FibGVfc2Nyb2xsX2FuaW1hdGlvbiIsInN0b3AiLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwic2Nyb2xsX3RvX3RvcF9zcGVlZCIsInNjcm9sbF90b190b3BfZWFzaW5nIiwiYmVmb3JlRmV0Y2hpbmdQcm9kdWN0cyIsImRvY3VtZW50IiwiYWN0aXZlRWxlbWVudCIsImltbWVkaWF0ZV9zY3JvbGxfb25fcGFnaW5hdGUiLCJ0cmlnZ2VyIiwiZGVzdHJveVRpcHB5SW5zdGFuY2VzIiwidXNlX3RpcHB5anMiLCJmb3JFYWNoIiwiaW5zdGFuY2UiLCJkZXN0cm95IiwiYmVmb3JlVXBkYXRpbmdQcm9kdWN0cyIsImFmdGVyVXBkYXRpbmdQcm9kdWN0cyIsInJlc3RvcmVfZm9jdXNfYWZ0ZXJfZmlsdGVyaW5nIiwiYm9keSIsImZvY3VzIiwiaW5pdCIsImN1c3RvbV9zY3JpcHRzIiwiZXZhbCIsImZpbHRlclByb2R1Y3RzIiwiYWpheCIsInVybCIsImxvY2F0aW9uIiwiaHJlZiIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsInVwZGF0ZV9kb2N1bWVudF90aXRsZSIsInRpdGxlIiwiZmlsdGVyIiwiaW5zdGFuY2VJZCIsIiRpbnN0YW5jZSIsIl9pbnN0YW5jZSIsInByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUiLCJ0b2dnbGVTZWxlY3RvciIsInByZXNlcnZlX3NvZnRfbGltaXRfc3RhdGUiLCJfaHRtbCIsIiRzaG9wTG9vcENvbnRhaW5lciIsIiRub3RGb3VuZENvbnRhaW5lciIsInJlcXVlc3RGaWx0ZXIiLCJob3N0bmFtZSIsInJlcGxhY2UiLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwid2NhcGYiLCJoYW5kbGVOdW1iZXJJbnB1dEZpbHRlcnMiLCJyYW5nZU51bWJlclNlbGVjdG9ycyIsIiRpdGVtIiwiJHJhbmdlTnVtYmVyIiwiZm9ybWF0TnVtYmVycyIsInJhbmdlTWluVmFsdWUiLCJwYXJzZUZsb2F0IiwicmFuZ2VNYXhWYWx1ZSIsIm9sZE1pblZhbHVlIiwib2xkTWF4VmFsdWUiLCJkZWNpbWFsUGxhY2VzIiwidGhvdXNhbmRTZXBhcmF0b3IiLCJkZWNpbWFsU2VwYXJhdG9yIiwiY2xlYXJUaW1lb3V0IiwiZ2V0VmFsdWUiLCJmbG9hdFZhbHVlIiwibnVtYmVyRm9ybWF0Iiwic2V0VGltZW91dCIsInJlbW92ZURhdGEiLCJtaW5WYWx1ZSIsIm1heFZhbHVlIiwiaXNOYU4iLCJoYW5kbGVEYXRlSW5wdXRGaWx0ZXJzIiwiaXNSYW5nZSIsImZpbHRlclVybCIsImZyb20iLCJ0byIsImhhbmRsZUxpc3RGaWx0ZXJzIiwibmF0aXZlSW5wdXRzIiwidG9nZ2xlQ2xhc3MiLCJjdXN0b21SYWRpb1NlbGVjdG9yIiwibm90IiwicHJvcCIsImhhbmRsZURyb3Bkb3duRmlsdGVycyIsIiRzZWxlY3QiLCJ2YWx1ZXMiLCJmaWx0ZXJVUkwiLCJjbGVhckZpbHRlclVSTCIsImhhbmRsZVBhZ2luYXRpb24iLCJlbmFibGVfcGFnaW5hdGlvbl92aWFfYWpheCIsInBhZ2luYXRpb25fY29udGFpbmVyIiwiX3NlbGVjdG9ycyIsInNwbGl0Iiwic2VsZWN0b3JzIiwiam9pbiIsImhhbmRsZURlZmF1bHRPcmRlcmJ5Iiwic29ydGluZ19jb250cm9sIiwib3JkZXIiLCJVUkwiLCJzZWFyY2hQYXJhbXMiLCJzZXQiLCJnZXRPcmRlckJ5VXJsIiwiaGFuZGxlQ2xlYXJGaWx0ZXIiLCJoYW5kbGVGaWx0ZXJUb29sdGlwIiwidGlwcHkiLCJwbGFjZW1lbnQiLCJjb250ZW50IiwicmVmZXJlbmNlIiwiZ2V0QXR0cmlidXRlIiwiYWxsb3dIVE1MIiwiaW5pdENvbWJvYm94IiwialF1ZXJ5IiwiY2hvc2VuV0NBUEYiLCJ0ZW1wbGF0ZVJlc3VsdCIsInRlbXBsYXRlU2VsZWN0aW9uIiwiY291bnQiLCJkZWZhdWx0cyIsImluaGVyaXRfc2VsZWN0X2NsYXNzZXMiLCJpbmhlcml0X29wdGlvbl9jbGFzc2VzIiwibm9fcmVzdWx0c190ZXh0IiwiY2hvc2VuX25vX3Jlc3VsdHNfdGV4dCIsIm9wdGlvbnNfbm9uZV90ZXh0IiwiY2hvc2VuX29wdGlvbnNfbm9uZV90ZXh0Iiwic2VhcmNoX2NvbnRhaW5zIiwic2VhcmNoX2luX3ZhbHVlcyIsImlzX3J0bCIsIiR0aGlzIiwib3B0aW9ucyIsImNob3Nlbl9kaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMiLCJhdHRhY2hfY2hvc2VuX29uX3NvcnRpbmciLCJkaXNhYmxlU2VhcmNoIiwic2VhcmNoX2JveF9pbl9kZWZhdWx0X29yZGVyYnkiLCJpbml0UmFuZ2VTbGlkZXIiLCJub1VpU2xpZGVyIiwiJHNsaWRlciIsInNsaWRlcklkIiwiZGlzcGxheVZhbHVlc0FzIiwic3RlcCIsIiRtaW5WYWx1ZSIsIiRtYXhWYWx1ZSIsInNsaWRlciIsImdldEVsZW1lbnRCeUlkIiwiY3JlYXRlIiwic3RhcnQiLCJjb25uZWN0IiwiY3NzUHJlZml4IiwicmFuZ2UiLCJmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyIiwiX21pblZhbHVlIiwiX21heFZhbHVlIiwiJGlucHV0IiwiZ2V0IiwiaW5pdERhdGVwaWNrZXIiLCJkYXRlcGlja2VyIiwiJHdjYXBmRGF0ZUZpbHRlciIsImZvcm1hdCIsInllYXJEcm9wZG93biIsIm1vbnRoRHJvcGRvd24iLCIkZnJvbSIsIiR0byIsImRhdGVGb3JtYXQiLCJjaGFuZ2VZZWFyIiwiY2hhbmdlTW9udGgiLCJpbml0RmlsdGVyT3B0aW9uVG9vbHRpcCIsInRvb2x0aXBQb3NpdGlvbnMiLCJ0b29sdGlwUG9zaXRpb24iLCJpZGVudGlmaWVyIiwiaW5zdGFuY2VzIiwiY29uY2F0IiwiaW5pdFBvcFN0YXRlIiwicmVsb2FkX29uX2JhY2siLCJmb3VuZF93Y2FwZiIsInJlcGxhY2VTdGF0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJzdGF0ZSIsImhhc093blByb3BlcnR5IiwibnVtYmVyIiwiZGVjaW1hbHMiLCJkZWNfcG9pbnQiLCJ0aG91c2FuZHNfc2VwIiwibiIsImlzRmluaXRlIiwicHJlYyIsIk1hdGgiLCJhYnMiLCJzZXAiLCJkZWMiLCJzIiwidG9GaXhlZEZpeCIsImsiLCJwb3ciLCJyb3VuZCIsIkFycmF5IiwiY2xlYW5VcmwiLCJwYWdlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsWUFBWSxHQUFHQSxZQUFZLElBQUk7QUFDcEMsWUFBVSxFQUQwQjtBQUVwQyx3QkFBc0IsRUFGYztBQUdwQyxxQ0FBbUMsRUFIQztBQUlwQyw0QkFBMEIsRUFKVTtBQUtwQyw4QkFBNEIsRUFMUTtBQU1wQyxtQ0FBaUMsRUFORztBQU9wQyx3Q0FBc0MsRUFQRjtBQVFwQywrQkFBNkIsRUFSTztBQVNwQywyQ0FBeUMsRUFUTDtBQVVwQyxzQ0FBb0MsRUFWQTtBQVdwQyx1Q0FBcUMsRUFYRDtBQVlwQyw4Q0FBNEMsRUFaUjtBQWFwQyx5Q0FBdUMsRUFiSDtBQWNwQywwQ0FBd0MsRUFkSjtBQWVwQyxtQ0FBaUMsRUFmRztBQWdCcEMseUJBQXVCLEVBaEJhO0FBaUJwQywwQkFBd0IsRUFqQlk7QUFrQnBDLGtDQUFnQyxFQWxCSTtBQW1CcEMsZUFBYSxFQW5CdUI7QUFvQnBDLG9CQUFrQixFQXBCa0I7QUFxQnBDLGlCQUFlLEVBckJxQjtBQXNCcEMsMkJBQXlCLEVBdEJXO0FBdUJwQyxpQkFBZSxFQXZCcUI7QUF3QnBDLHlCQUF1QixFQXhCYTtBQXlCcEMseUJBQXVCLEVBekJhO0FBMEJwQywwQkFBd0IsRUExQlk7QUEyQnBDLGdDQUE4QixFQTNCTTtBQTRCcEMscUJBQW1CLEVBNUJpQjtBQTZCcEMsOEJBQTRCLEVBN0JRO0FBOEJwQyx1QkFBcUIsRUE5QmU7QUErQnBDLG1CQUFpQixFQS9CbUI7QUFnQ3BDLHVCQUFxQixFQWhDZTtBQWlDcEMsd0JBQXNCLEVBakNjO0FBa0NwQyxrQ0FBZ0MsRUFsQ0k7QUFtQ3BDLDBCQUF3QixFQW5DWTtBQW9DcEMsOEJBQTRCLEVBcENRO0FBcUNwQyxvQkFBa0IsRUFyQ2tCO0FBc0NwQyxvQkFBa0I7QUF0Q2tCLENBQXJDOztBQXlDRSxXQUFVQyxDQUFWLEVBQWFDLE1BQWIsRUFBc0I7QUFFdkIsTUFBTUMsTUFBTSxHQUFHQyxRQUFRLENBQUVKLFlBQVksQ0FBQ0ssa0JBQWYsQ0FBdkI7O0FBQ0EsTUFBTUMsS0FBSyxHQUFJSCxNQUFNLElBQUksQ0FBVixHQUFjQSxNQUFkLEdBQXVCLEdBQXRDO0FBRUEsTUFBTUksS0FBSyxHQUFHTixDQUFDLENBQUUsTUFBRixDQUFmO0FBRUEsTUFBTU8sV0FBVyxHQUFHLEVBQXBCO0FBRUFQLEVBQUFBLENBQUMsQ0FBRSxlQUFGLENBQUQsQ0FBcUJRLElBQXJCLENBQTJCLFlBQVc7QUFDckMsUUFBTUMsRUFBRSxHQUFHVCxDQUFDLENBQUUsSUFBRixDQUFELENBQVVVLElBQVYsQ0FBZ0IsSUFBaEIsQ0FBWDs7QUFFQSxRQUFLLENBQUVELEVBQVAsRUFBWTtBQUNYO0FBQ0E7O0FBRURGLElBQUFBLFdBQVcsQ0FBQ0ksSUFBWixDQUFrQkYsRUFBbEI7QUFDQSxHQVJEO0FBVUEsTUFBSUcsVUFBSjtBQUVBWCxFQUFBQSxNQUFNLENBQUNZLGNBQVAsR0FBd0IsRUFBeEI7QUFFQVosRUFBQUEsTUFBTSxDQUFDYSxLQUFQLEdBQWViLE1BQU0sQ0FBQ2EsS0FBUCxJQUFnQixFQUEvQjtBQUVBYixFQUFBQSxNQUFNLENBQUNhLEtBQVAsR0FBZTtBQUNkQyxJQUFBQSxxQkFBcUIsRUFBRSxpQ0FBVztBQUNqQyxVQUFNQyxlQUFlLEdBQUcsU0FBbEJBLGVBQWtCLENBQUVDLEdBQUYsRUFBVztBQUNsQztBQUNBLFlBQU1DLE9BQU8sR0FBR0QsR0FBRyxDQUFDRSxJQUFKLENBQVUsZUFBVixNQUFnQyxNQUFoRCxDQUZrQyxDQUlsQzs7QUFDQUYsUUFBQUEsR0FBRyxDQUFDRSxJQUFKLENBQVUsZUFBVixFQUEyQixDQUFFRCxPQUE3QjtBQUVBLFlBQU1FLFlBQVksR0FBR0gsR0FBRyxDQUFDSSxPQUFKLENBQWEsZUFBYixFQUErQkMsUUFBL0IsQ0FBeUMscUJBQXpDLENBQXJCOztBQUVBLFlBQUt2QixZQUFZLENBQUN3QixxQ0FBbEIsRUFBMEQ7QUFDekRILFVBQUFBLFlBQVksQ0FBQ0ksV0FBYixDQUNDekIsWUFBWSxDQUFDMEIsZ0NBRGQsRUFFQzFCLFlBQVksQ0FBQzJCLGlDQUZkO0FBSUEsU0FMRCxNQUtPO0FBQ05OLFVBQUFBLFlBQVksQ0FBQ08sTUFBYjtBQUNBO0FBQ0QsT0FqQkQ7O0FBbUJBckIsTUFBQUEsS0FBSyxDQUFDc0IsRUFBTixDQUFVLE9BQVYsRUFBbUIsaUNBQW5CLEVBQXNELFVBQVVDLENBQVYsRUFBYztBQUNuRUEsUUFBQUEsQ0FBQyxDQUFDQyxlQUFGO0FBRUFkLFFBQUFBLGVBQWUsQ0FBRWhCLENBQUMsQ0FBRSxJQUFGLENBQUgsQ0FBZjtBQUNBLE9BSkQ7QUFNQU0sTUFBQUEsS0FBSyxDQUFDc0IsRUFBTixDQUFVLE9BQVYsRUFBbUIsbUNBQW5CLEVBQXdELFlBQVc7QUFDbEUsWUFBTUcsUUFBUSxHQUFHL0IsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVZ0MsSUFBVixDQUFnQixpQ0FBaEIsQ0FBakI7QUFFQWhCLFFBQUFBLGVBQWUsQ0FBRWUsUUFBRixDQUFmO0FBQ0EsT0FKRDtBQUtBLEtBaENhO0FBaUNkRSxJQUFBQSxxQkFBcUIsRUFBRSxpQ0FBVztBQUNqQyxVQUFNakIsZUFBZSxHQUFHLFNBQWxCQSxlQUFrQixDQUFFQyxHQUFGLEVBQVc7QUFDbEM7QUFDQSxZQUFNQyxPQUFPLEdBQUdELEdBQUcsQ0FBQ0UsSUFBSixDQUFVLGNBQVYsTUFBK0IsTUFBL0MsQ0FGa0MsQ0FJbEM7O0FBQ0FGLFFBQUFBLEdBQUcsQ0FBQ0UsSUFBSixDQUFVLGNBQVYsRUFBMEIsQ0FBRUQsT0FBNUI7QUFFQSxZQUFNZ0IsTUFBTSxHQUFHakIsR0FBRyxDQUFDSSxPQUFKLENBQWEsSUFBYixFQUFvQkMsUUFBcEIsQ0FBOEIsSUFBOUIsQ0FBZjs7QUFFQSxZQUFLdkIsWUFBWSxDQUFDb0Msd0NBQWxCLEVBQTZEO0FBQzVERCxVQUFBQSxNQUFNLENBQUNWLFdBQVAsQ0FDQ3pCLFlBQVksQ0FBQ3FDLG1DQURkLEVBRUNyQyxZQUFZLENBQUNzQyxvQ0FGZDtBQUlBLFNBTEQsTUFLTztBQUNOSCxVQUFBQSxNQUFNLENBQUNQLE1BQVA7QUFDQTtBQUNELE9BakJEOztBQW1CQXJCLE1BQUFBLEtBQUssQ0FDSHNCLEVBREYsQ0FDTSxPQUROLEVBQ2UsbUNBRGYsRUFDb0QsWUFBVztBQUM3RFosUUFBQUEsZUFBZSxDQUFFaEIsQ0FBQyxDQUFFLElBQUYsQ0FBSCxDQUFmO0FBQ0EsT0FIRixFQUlFNEIsRUFKRixDQUlNLFNBSk4sRUFJaUIsbUNBSmpCLEVBSXNELFVBQVVDLENBQVYsRUFBYztBQUNsRSxZQUFLQSxDQUFDLENBQUNTLEdBQUYsS0FBVSxHQUFWLElBQWlCVCxDQUFDLENBQUNTLEdBQUYsS0FBVSxPQUEzQixJQUFzQ1QsQ0FBQyxDQUFDUyxHQUFGLEtBQVUsVUFBckQsRUFBa0U7QUFDakU7QUFDQVQsVUFBQUEsQ0FBQyxDQUFDVSxjQUFGO0FBRUF2QixVQUFBQSxlQUFlLENBQUVoQixDQUFDLENBQUUsSUFBRixDQUFILENBQWY7QUFDQTtBQUNELE9BWEY7QUFZQSxLQWpFYTtBQWtFZHdDLElBQUFBLGVBQWUsRUFBRSwyQkFBVztBQUMzQixVQUFNQyxtQkFBbUIsR0FBRyxTQUF0QkEsbUJBQXNCLENBQUV4QixHQUFGLEVBQVc7QUFDdEM7QUFDQSxZQUFNQyxPQUFPLEdBQUdELEdBQUcsQ0FBQ0UsSUFBSixDQUFVLGNBQVYsTUFBK0IsTUFBL0MsQ0FGc0MsQ0FJdEM7O0FBQ0FGLFFBQUFBLEdBQUcsQ0FBQ0UsSUFBSixDQUFVLGNBQVYsRUFBMEIsQ0FBRUQsT0FBNUI7QUFFQSxZQUFNd0IsWUFBWSxHQUFHekIsR0FBRyxDQUFDSSxPQUFKLENBQWEscUJBQWIsQ0FBckI7O0FBRUEsWUFBS0gsT0FBTCxFQUFlO0FBQ2R3QixVQUFBQSxZQUFZLENBQUNDLFdBQWIsQ0FBMEIscUJBQTFCO0FBQ0EsU0FGRCxNQUVPO0FBQ05ELFVBQUFBLFlBQVksQ0FBQ0UsUUFBYixDQUF1QixxQkFBdkI7QUFDQTtBQUNELE9BZEQ7O0FBZ0JBdEMsTUFBQUEsS0FBSyxDQUNIc0IsRUFERixDQUNNLE9BRE4sRUFDZSwyQkFEZixFQUM0QyxZQUFXO0FBQ3JEYSxRQUFBQSxtQkFBbUIsQ0FBRXpDLENBQUMsQ0FBRSxJQUFGLENBQUgsQ0FBbkI7QUFDQSxPQUhGLEVBSUU0QixFQUpGLENBSU0sU0FKTixFQUlpQiwyQkFKakIsRUFJOEMsVUFBVUMsQ0FBVixFQUFjO0FBQzFELFlBQUtBLENBQUMsQ0FBQ1MsR0FBRixLQUFVLEdBQVYsSUFBaUJULENBQUMsQ0FBQ1MsR0FBRixLQUFVLE9BQTNCLElBQXNDVCxDQUFDLENBQUNTLEdBQUYsS0FBVSxVQUFyRCxFQUFrRTtBQUNqRTtBQUNBVCxVQUFBQSxDQUFDLENBQUNVLGNBQUY7QUFFQUUsVUFBQUEsbUJBQW1CLENBQUV6QyxDQUFDLENBQUUsSUFBRixDQUFILENBQW5CO0FBQ0E7QUFDRCxPQVhGO0FBWUEsS0EvRmE7QUFnR2Q2QyxJQUFBQSx5QkFBeUIsRUFBRSxxQ0FBVztBQUNyQ3ZDLE1BQUFBLEtBQUssQ0FBQ3NCLEVBQU4sQ0FBVSxPQUFWLEVBQW1CLHNDQUFuQixFQUEyRCxZQUFXO0FBQ3JFLFlBQU1rQixLQUFLLEdBQUs5QyxDQUFDLENBQUUsSUFBRixDQUFqQjtBQUNBLFlBQU0rQyxNQUFNLEdBQUlELEtBQUssQ0FBQ3pCLE9BQU4sQ0FBZSxxQkFBZixDQUFoQjtBQUNBLFlBQU0yQixPQUFPLEdBQUdELE1BQU0sQ0FBQzFCLE9BQVAsQ0FBZ0IsZUFBaEIsQ0FBaEI7QUFFQSxZQUFNNEIsZ0JBQWdCLEdBQUdELE9BQU8sQ0FBQ0UsUUFBUixDQUFrQixnQkFBbEIsQ0FBekI7QUFDQSxZQUFNQyxlQUFlLEdBQUlILE9BQU8sQ0FBQ2hCLElBQVIsQ0FBYywyQkFBZCxDQUF6QjtBQUNBLFlBQU1vQixTQUFTLEdBQVVKLE9BQU8sQ0FBQ2hCLElBQVIsQ0FBYyx3QkFBZCxDQUF6QjtBQUNBLFlBQU1xQixjQUFjLEdBQUtsRCxRQUFRLENBQUU2QyxPQUFPLENBQUM3QixJQUFSLENBQWMsc0JBQWQsQ0FBRixDQUFqQztBQUVBLFlBQU1tQyxPQUFPLEdBQUdSLEtBQUssQ0FBQ1MsR0FBTixFQUFoQjs7QUFFQSxZQUFLLENBQUVELE9BQU8sQ0FBQ0UsTUFBZixFQUF3QjtBQUN2QixjQUFJQyxNQUFLLEdBQUcsQ0FBWjtBQUNBVCxVQUFBQSxPQUFPLENBQUNMLFdBQVIsQ0FBcUIsZUFBckI7QUFFQTNDLFVBQUFBLENBQUMsQ0FBQ1EsSUFBRixDQUFRdUMsTUFBTSxDQUFDZixJQUFQLENBQWEsNEJBQWIsQ0FBUixFQUFxRCxZQUFXO0FBQy9EeUIsWUFBQUEsTUFBSztBQUVMLGdCQUFNQyxXQUFXLEdBQUcxRCxDQUFDLENBQUUsSUFBRixDQUFyQjtBQUNBMEQsWUFBQUEsV0FBVyxDQUFDZixXQUFaLENBQXlCLGlCQUF6Qjs7QUFFQSxnQkFBS00sZ0JBQUwsRUFBd0I7QUFDdkIsa0JBQUtRLE1BQUssR0FBR0osY0FBYixFQUE4QjtBQUM3QkssZ0JBQUFBLFdBQVcsQ0FBQ2QsUUFBWixDQUFzQiw0QkFBdEI7QUFDQSxlQUZELE1BRU87QUFDTmMsZ0JBQUFBLFdBQVcsQ0FBQ2YsV0FBWixDQUF5Qiw0QkFBekI7QUFDQTtBQUNEO0FBQ0QsV0FiRDs7QUFlQSxjQUFLTSxnQkFBTCxFQUF3QjtBQUN2QkUsWUFBQUEsZUFBZSxDQUFDUSxVQUFoQixDQUE0QixPQUE1QjtBQUNBOztBQUVEUCxVQUFBQSxTQUFTLENBQUM5QixRQUFWLENBQW9CLE1BQXBCLEVBQTZCc0MsSUFBN0IsQ0FBbUMsRUFBbkM7QUFDQVIsVUFBQUEsU0FBUyxDQUFDUyxJQUFWO0FBRUE7QUFDQTs7QUFFRCxZQUFJSixLQUFLLEdBQUcsQ0FBWjtBQUNBVCxRQUFBQSxPQUFPLENBQUNKLFFBQVIsQ0FBa0IsZUFBbEI7QUFFQTVDLFFBQUFBLENBQUMsQ0FBQ1EsSUFBRixDQUFRdUMsTUFBTSxDQUFDZixJQUFQLENBQWEsNEJBQWIsQ0FBUixFQUFxRCxZQUFXO0FBQy9ELGNBQU0wQixXQUFXLEdBQUcxRCxDQUFDLENBQUUsSUFBRixDQUFyQjtBQUNBLGNBQU04RCxLQUFLLEdBQVNKLFdBQVcsQ0FBQzFCLElBQVosQ0FBa0IsMEJBQWxCLEVBQStDdEIsSUFBL0MsQ0FBcUQsT0FBckQsQ0FBcEI7O0FBRUEsY0FBS29ELEtBQUssQ0FBQ0MsUUFBTixHQUFpQkMsV0FBakIsR0FBK0JDLFFBQS9CLENBQXlDWCxPQUFPLENBQUNVLFdBQVIsRUFBekMsQ0FBTCxFQUF3RTtBQUN2RVAsWUFBQUEsS0FBSztBQUVMQyxZQUFBQSxXQUFXLENBQUNkLFFBQVosQ0FBc0IsaUJBQXRCOztBQUVBLGdCQUFLSyxnQkFBTCxFQUF3QjtBQUN2QixrQkFBS1EsS0FBSyxHQUFHSixjQUFiLEVBQThCO0FBQzdCSyxnQkFBQUEsV0FBVyxDQUFDZCxRQUFaLENBQXNCLDRCQUF0QjtBQUNBLGVBRkQsTUFFTztBQUNOYyxnQkFBQUEsV0FBVyxDQUFDZixXQUFaLENBQXlCLDRCQUF6QjtBQUNBO0FBQ0Q7QUFDRCxXQVpELE1BWU87QUFDTmUsWUFBQUEsV0FBVyxDQUFDZixXQUFaLENBQXlCLGlCQUF6QjtBQUNBO0FBQ0QsU0FuQkQ7O0FBcUJBLFlBQUtNLGdCQUFMLEVBQXdCO0FBQ3ZCLGNBQUtRLEtBQUssSUFBSUosY0FBZCxFQUErQjtBQUM5QkYsWUFBQUEsZUFBZSxDQUFDVSxJQUFoQjtBQUNBLFdBRkQsTUFFTztBQUNOVixZQUFBQSxlQUFlLENBQUNlLElBQWhCO0FBQ0E7QUFDRDs7QUFFRCxZQUFLLE1BQU1ULEtBQVgsRUFBbUI7QUFDbEJMLFVBQUFBLFNBQVMsQ0FBQzlCLFFBQVYsQ0FBb0IsTUFBcEIsRUFBNkJzQyxJQUE3QixDQUFtQ04sT0FBbkM7QUFDQUYsVUFBQUEsU0FBUyxDQUFDYyxJQUFWO0FBQ0EsU0FIRCxNQUdPO0FBQ05kLFVBQUFBLFNBQVMsQ0FBQzlCLFFBQVYsQ0FBb0IsTUFBcEIsRUFBNkJzQyxJQUE3QixDQUFtQyxFQUFuQztBQUNBUixVQUFBQSxTQUFTLENBQUNTLElBQVY7QUFDQTtBQUNELE9BaEZEO0FBaUZBLEtBbExhO0FBbUxkTSxJQUFBQSx5QkFBeUIsRUFBRSxtQ0FBVUMsU0FBVixFQUFzQjtBQUNoRCxVQUFNQyxVQUFVLEdBQUdyRSxDQUFDLENBQUVELFlBQVksQ0FBQ3VFLG1CQUFmLENBQXBCO0FBQ0EsVUFBTUMsUUFBUSxHQUFLLDJCQUFuQjtBQUNBLFVBQU1DLFFBQVEsR0FBS0osU0FBUyxDQUFDcEMsSUFBVixDQUFnQnVDLFFBQWhCLEVBQTJCRSxJQUEzQixFQUFuQjtBQUVBbkUsTUFBQUEsS0FBSyxDQUFDMEIsSUFBTixDQUFZdUMsUUFBWixFQUF1Qi9ELElBQXZCLENBQTZCLFlBQVc7QUFDdkMsWUFBTVMsR0FBRyxHQUFHakIsQ0FBQyxDQUFFLElBQUYsQ0FBYjs7QUFFQSxZQUFLLENBQUVxRSxVQUFVLENBQUNLLEdBQVgsQ0FBZ0J6RCxHQUFoQixFQUFzQnVDLE1BQTdCLEVBQXNDO0FBQ3JDdkMsVUFBQUEsR0FBRyxDQUFDd0QsSUFBSixDQUFVRCxRQUFWO0FBQ0E7QUFDRCxPQU5EO0FBT0EsS0EvTGE7QUFnTWRHLElBQUFBLFFBQVEsRUFBRSxrQkFBVUMsV0FBVixFQUF3QjtBQUNqQyxVQUFLLFdBQVc3RSxZQUFZLENBQUM4RSxhQUE3QixFQUE2QztBQUM1QztBQUNBOztBQUVELFVBQU1DLE9BQU8sR0FBTSxFQUFuQjtBQUNBLFVBQU1DLFVBQVUsR0FBR2hGLFlBQVksQ0FBQ2lGLGtCQUFoQzs7QUFFQSxVQUFLLFVBQVVELFVBQWYsRUFBNEI7QUFDM0JELFFBQUFBLE9BQU8sQ0FBQ25FLElBQVIsQ0FBYyxRQUFkO0FBQ0FtRSxRQUFBQSxPQUFPLENBQUNuRSxJQUFSLENBQWMsVUFBZDtBQUNBLE9BSEQsTUFHTztBQUNObUUsUUFBQUEsT0FBTyxDQUFDbkUsSUFBUixDQUFjb0UsVUFBZDtBQUNBOztBQUVELFVBQUssQ0FBRUQsT0FBTyxDQUFDYixRQUFSLENBQWtCVyxXQUFsQixDQUFQLEVBQXlDO0FBQ3hDO0FBQ0E7O0FBRUQsVUFBTUssU0FBUyxHQUFHbEYsWUFBWSxDQUFDbUYsaUJBQS9CO0FBQ0EsVUFBTUMsUUFBUSxHQUFJcEYsWUFBWSxDQUFDcUYsU0FBL0I7QUFDQSxVQUFJQyxPQUFPLEdBQU8sS0FBbEI7O0FBRUEsVUFBSyxhQUFhSixTQUFiLElBQTBCRSxRQUEvQixFQUEwQztBQUN6Q0UsUUFBQUEsT0FBTyxHQUFHLElBQVY7QUFDQSxPQUZELE1BRU8sSUFBSyxjQUFjSixTQUFkLElBQTJCLENBQUVFLFFBQWxDLEVBQTZDO0FBQ25ERSxRQUFBQSxPQUFPLEdBQUcsSUFBVjtBQUNBLE9BRk0sTUFFQSxJQUFLLFdBQVdKLFNBQWhCLEVBQTRCO0FBQ2xDSSxRQUFBQSxPQUFPLEdBQUcsSUFBVjtBQUNBOztBQUVELFVBQUssQ0FBRUEsT0FBUCxFQUFpQjtBQUNoQjtBQUNBOztBQUVELFVBQUlDLGVBQUosRUFBcUJDLE1BQXJCOztBQUVBLFVBQUt4RixZQUFZLENBQUN5RixvQkFBbEIsRUFBeUM7QUFDeENGLFFBQUFBLGVBQWUsR0FBR25GLFFBQVEsQ0FBRUosWUFBWSxDQUFDeUYsb0JBQWYsQ0FBMUI7QUFDQTs7QUFFRCxVQUFJQyxTQUFKOztBQUVBLFVBQUt6RixDQUFDLENBQUVELFlBQVksQ0FBQ3VFLG1CQUFmLENBQUQsQ0FBc0NkLE1BQTNDLEVBQW9EO0FBQ25EaUMsUUFBQUEsU0FBUyxHQUFHMUYsWUFBWSxDQUFDdUUsbUJBQXpCO0FBQ0EsT0FGRCxNQUVPLElBQUt0RSxDQUFDLENBQUVELFlBQVksQ0FBQzJGLG1CQUFmLENBQUQsQ0FBc0NsQyxNQUEzQyxFQUFvRDtBQUMxRGlDLFFBQUFBLFNBQVMsR0FBRzFGLFlBQVksQ0FBQzJGLG1CQUF6QjtBQUNBOztBQUVELFVBQUssYUFBYTNGLFlBQVksQ0FBQzhFLGFBQS9CLEVBQStDO0FBQzlDWSxRQUFBQSxTQUFTLEdBQUcxRixZQUFZLENBQUM0Riw0QkFBekI7QUFDQTs7QUFFRCxVQUFNdEIsVUFBVSxHQUFHckUsQ0FBQyxDQUFFeUYsU0FBRixDQUFwQjs7QUFFQSxVQUFLcEIsVUFBVSxDQUFDYixNQUFoQixFQUF5QjtBQUN4QitCLFFBQUFBLE1BQU0sR0FBR2xCLFVBQVUsQ0FBQ2tCLE1BQVgsR0FBb0JLLEdBQXBCLEdBQTBCTixlQUFuQzs7QUFFQSxZQUFLQyxNQUFNLEdBQUcsQ0FBZCxFQUFrQjtBQUNqQkEsVUFBQUEsTUFBTSxHQUFHLENBQVQ7QUFDQTs7QUFFRCxZQUFLeEYsWUFBWSxDQUFDOEYsd0JBQWxCLEVBQTZDO0FBQzVDNUYsVUFBQUEsTUFBTSxDQUFDMEUsUUFBUCxDQUFpQjtBQUFFaUIsWUFBQUEsR0FBRyxFQUFFTDtBQUFQLFdBQWpCO0FBQ0EsU0FGRCxNQUVPO0FBQ052RixVQUFBQSxDQUFDLENBQUUsWUFBRixDQUFELENBQWtCOEYsSUFBbEIsR0FBeUJDLE9BQXpCLENBQ0M7QUFBRUMsWUFBQUEsU0FBUyxFQUFFVDtBQUFiLFdBREQsRUFFQ3hGLFlBQVksQ0FBQ2tHLG1CQUZkLEVBR0NsRyxZQUFZLENBQUNtRyxvQkFIZDtBQUtBO0FBQ0Q7QUFDRCxLQXhRYTtBQXlRZDtBQUNBQyxJQUFBQSxzQkFBc0IsRUFBRSxnQ0FBVXZCLFdBQVYsRUFBd0I7QUFDL0M7QUFDQWhFLE1BQUFBLFVBQVUsR0FBR3dGLFFBQVEsQ0FBQ0MsYUFBdEI7QUFFQS9GLE1BQUFBLEtBQUssQ0FBQzBCLElBQU4sQ0FBWSxlQUFaLEVBQThCWSxRQUE5QixDQUF3QyxXQUF4QyxFQUorQyxDQU0vQzs7QUFDQSxVQUFLLGVBQWVnQyxXQUFmLElBQThCN0UsWUFBWSxDQUFDdUcsNEJBQWhELEVBQStFO0FBQzlFeEYsUUFBQUEsS0FBSyxDQUFDNkQsUUFBTixDQUFnQkMsV0FBaEI7QUFDQTs7QUFFRHRFLE1BQUFBLEtBQUssQ0FBQ2lHLE9BQU4sQ0FBZSxnQ0FBZixFQUFpRCxDQUFFM0IsV0FBRixDQUFqRDtBQUNBLEtBdFJhO0FBdVJkNEIsSUFBQUEscUJBQXFCLEVBQUUsaUNBQVc7QUFDakMsVUFBS3pHLFlBQVksQ0FBQzBHLFdBQWxCLEVBQWdDO0FBQy9CO0FBQ0E1RixRQUFBQSxjQUFjLENBQUM2RixPQUFmLENBQXdCLFVBQUFDLFFBQVEsRUFBSTtBQUNuQ0EsVUFBQUEsUUFBUSxDQUFDQyxPQUFUO0FBQ0EsU0FGRDtBQUdBL0YsUUFBQUEsY0FBYyxDQUFDMkMsTUFBZixHQUF3QixDQUF4QixDQUwrQixDQUtKO0FBQzNCO0FBQ0QsS0EvUmE7QUFnU2Q7QUFDQXFELElBQUFBLHNCQUFzQixFQUFFLGdDQUFVekMsU0FBVixFQUFxQlEsV0FBckIsRUFBbUM7QUFDMUR0RSxNQUFBQSxLQUFLLENBQUMwQixJQUFOLENBQVksZUFBWixFQUE4QlcsV0FBOUIsQ0FBMkMsV0FBM0MsRUFEMEQsQ0FHMUQ7O0FBQ0E3QixNQUFBQSxLQUFLLENBQUMwRixxQkFBTjtBQUVBbEcsTUFBQUEsS0FBSyxDQUFDaUcsT0FBTixDQUFlLGdDQUFmLEVBQWlELENBQUVuQyxTQUFGLEVBQWFRLFdBQWIsQ0FBakQ7QUFDQSxLQXhTYTtBQXlTZGtDLElBQUFBLHFCQUFxQixFQUFFLCtCQUFVMUMsU0FBVixFQUFxQlEsV0FBckIsRUFBbUM7QUFDekQ5RCxNQUFBQSxLQUFLLENBQUNxRCx5QkFBTixDQUFpQ0MsU0FBakMsRUFEeUQsQ0FHekQ7O0FBQ0EsVUFBS3JFLFlBQVksQ0FBQ2dILDZCQUFiLElBQThDLENBQUVoSCxZQUFZLENBQUNxRixTQUFsRSxFQUE4RTtBQUM3RSxZQUFLZ0IsUUFBUSxDQUFDWSxJQUFULEtBQWtCcEcsVUFBdkIsRUFBb0M7QUFDbkMsY0FBS0EsVUFBVSxDQUFDSCxFQUFoQixFQUFxQjtBQUNwQlQsWUFBQUEsQ0FBQyxZQUFPWSxVQUFVLENBQUNILEVBQWxCLEVBQUQsQ0FBMkJ3RyxLQUEzQjtBQUNBO0FBQ0Q7QUFDRCxPQVZ3RCxDQVl6RDs7O0FBQ0FuRyxNQUFBQSxLQUFLLENBQUNvRyxJQUFOLEdBYnlELENBZXpEOztBQUNBLFVBQUssZUFBZXRDLFdBQWYsSUFBOEI3RSxZQUFZLENBQUN1Ryw0QkFBaEQsRUFBK0UsQ0FDOUU7QUFDQSxPQUZELE1BRU87QUFDTnhGLFFBQUFBLEtBQUssQ0FBQzZELFFBQU4sQ0FBZ0JDLFdBQWhCO0FBQ0EsT0FwQndELENBc0J6RDs7O0FBQ0E1RSxNQUFBQSxDQUFDLENBQUVvRyxRQUFGLENBQUQsQ0FBY0csT0FBZCxDQUF1QixPQUF2QjtBQUNBdkcsTUFBQUEsQ0FBQyxDQUFFQyxNQUFGLENBQUQsQ0FBWXNHLE9BQVosQ0FBcUIsUUFBckI7QUFDQXZHLE1BQUFBLENBQUMsQ0FBRUMsTUFBRixDQUFELENBQVlzRyxPQUFaLENBQXFCLFFBQXJCOztBQUVBLFVBQUt4RyxZQUFZLENBQUNvSCxjQUFsQixFQUFtQztBQUNsQ0MsUUFBQUEsSUFBSSxDQUFFckgsWUFBWSxDQUFDb0gsY0FBZixDQUFKO0FBQ0E7O0FBRUQ3RyxNQUFBQSxLQUFLLENBQUNpRyxPQUFOLENBQWUsK0JBQWYsRUFBZ0QsQ0FBRW5DLFNBQUYsRUFBYVEsV0FBYixDQUFoRDtBQUNBLEtBelVhO0FBMFVkeUMsSUFBQUEsY0FBYyxFQUFFLDBCQUFtQztBQUFBLFVBQXpCekMsV0FBeUIsdUVBQVgsUUFBVztBQUNsRDlELE1BQUFBLEtBQUssQ0FBQ3FGLHNCQUFOLENBQThCdkIsV0FBOUI7QUFFQTVFLE1BQUFBLENBQUMsQ0FBQ3NILElBQUYsQ0FBUTtBQUNQQyxRQUFBQSxHQUFHLEVBQUV0SCxNQUFNLENBQUN1SCxRQUFQLENBQWdCQyxJQURkO0FBRVBDLFFBQUFBLE9BQU8sRUFBRSxpQkFBVUMsUUFBVixFQUFxQjtBQUM3QixjQUFNdkQsU0FBUyxHQUFHcEUsQ0FBQyxDQUFFMkgsUUFBRixDQUFuQjtBQUVBN0csVUFBQUEsS0FBSyxDQUFDK0Ysc0JBQU4sQ0FBOEJ6QyxTQUE5QixFQUF5Q1EsV0FBekM7QUFFQTtBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUNLLGNBQUs3RSxZQUFZLENBQUM2SCxxQkFBbEIsRUFBMEM7QUFDekN4QixZQUFBQSxRQUFRLENBQUN5QixLQUFULEdBQWlCekQsU0FBUyxDQUFDMEQsTUFBVixDQUFrQixPQUFsQixFQUE0QmxFLElBQTVCLEVBQWpCO0FBQ0EsV0FaNEIsQ0FjN0I7OztBQWQ2QixxREFlWHJELFdBZlc7QUFBQTs7QUFBQTtBQUFBO0FBQUEsa0JBZWpCRSxFQWZpQjtBQWdCNUIsa0JBQU1zSCxVQUFVLEdBQUcsZUFBZXRILEVBQWYsR0FBb0IsSUFBdkM7QUFDQSxrQkFBTXVILFNBQVMsR0FBSWhJLENBQUMsQ0FBRStILFVBQUYsQ0FBcEI7QUFDQSxrQkFBTWhGLE1BQU0sR0FBT2lGLFNBQVMsQ0FBQ2hHLElBQVYsQ0FBZ0IscUJBQWhCLENBQW5COztBQUNBLGtCQUFNaUcsU0FBUyxHQUFJN0QsU0FBUyxDQUFDcEMsSUFBVixDQUFnQitGLFVBQWhCLENBQW5CLENBbkI0QixDQXFCNUI7OztBQUNBLGtCQUFLaEksWUFBWSxDQUFDbUksa0NBQWxCLEVBQXVEO0FBQ3RELG9CQUFLRixTQUFTLENBQUM5RSxRQUFWLENBQW9CLHlCQUFwQixDQUFMLEVBQXVEO0FBQ3REOEUsa0JBQUFBLFNBQVMsQ0FBQ2hHLElBQVYsQ0FBZ0IsbUNBQWhCLEVBQXNEeEIsSUFBdEQsQ0FBNEQsWUFBVztBQUN0RSx3QkFBTVMsR0FBRyxHQUFHakIsQ0FBQyxDQUFFLElBQUYsQ0FBYjtBQUNBLHdCQUFNUyxFQUFFLEdBQUlRLEdBQUcsQ0FBQ1AsSUFBSixDQUFVLElBQVYsQ0FBWjtBQUVBLHdCQUFNeUgsY0FBYyx5REFBa0QxSCxFQUFsRCxRQUFwQixDQUpzRSxDQU10RTs7QUFDQSx3QkFBTVMsT0FBTyxHQUFHRCxHQUFHLENBQUNFLElBQUosQ0FBVSxjQUFWLE1BQStCLE1BQS9DOztBQUVBLHdCQUFLRCxPQUFMLEVBQWU7QUFDZCtHLHNCQUFBQSxTQUFTLENBQUNqRyxJQUFWLENBQWdCbUcsY0FBaEIsRUFBaUNoSCxJQUFqQyxDQUF1QyxjQUF2QyxFQUF1RCxNQUF2RDs7QUFDQThHLHNCQUFBQSxTQUFTLENBQUNqRyxJQUFWLENBQWdCbUcsY0FBaEIsRUFBaUM5RyxPQUFqQyxDQUEwQyxJQUExQyxFQUFpREMsUUFBakQsQ0FBMkQsSUFBM0QsRUFBa0U0QyxJQUFsRTtBQUNBLHFCQUhELE1BR087QUFDTitELHNCQUFBQSxTQUFTLENBQUNqRyxJQUFWLENBQWdCbUcsY0FBaEIsRUFBaUNoSCxJQUFqQyxDQUF1QyxjQUF2QyxFQUF1RCxPQUF2RDs7QUFDQThHLHNCQUFBQSxTQUFTLENBQUNqRyxJQUFWLENBQWdCbUcsY0FBaEIsRUFBaUM5RyxPQUFqQyxDQUEwQyxJQUExQyxFQUFpREMsUUFBakQsQ0FBMkQsSUFBM0QsRUFBa0V1QyxJQUFsRTtBQUNBO0FBQ0QsbUJBaEJEO0FBaUJBO0FBQ0QsZUExQzJCLENBNEM1Qjs7O0FBQ0Esa0JBQUs5RCxZQUFZLENBQUNxSSx5QkFBbEIsRUFBOEM7QUFDN0Msb0JBQUtKLFNBQVMsQ0FBQzlFLFFBQVYsQ0FBb0IsZ0JBQXBCLENBQUwsRUFBOEM7QUFDN0Msc0JBQU1SLFlBQVksR0FBR3NGLFNBQVMsQ0FBQ2hHLElBQVYsQ0FBZ0IscUJBQWhCLENBQXJCOztBQUVBLHNCQUFLVSxZQUFZLENBQUNRLFFBQWIsQ0FBdUIscUJBQXZCLENBQUwsRUFBc0Q7QUFDckQrRSxvQkFBQUEsU0FBUyxDQUFDakcsSUFBVixDQUFnQixxQkFBaEIsRUFBd0NZLFFBQXhDLENBQWtELHFCQUFsRDs7QUFDQXFGLG9CQUFBQSxTQUFTLENBQUNqRyxJQUFWLENBQWdCLDJCQUFoQixFQUE4Q2IsSUFBOUMsQ0FBb0QsY0FBcEQsRUFBb0UsTUFBcEU7QUFDQSxtQkFIRCxNQUdPO0FBQ044RyxvQkFBQUEsU0FBUyxDQUFDakcsSUFBVixDQUFnQixxQkFBaEIsRUFBd0NXLFdBQXhDLENBQXFELHFCQUFyRDs7QUFDQXNGLG9CQUFBQSxTQUFTLENBQUNqRyxJQUFWLENBQWdCLDJCQUFoQixFQUE4Q2IsSUFBOUMsQ0FBb0QsY0FBcEQsRUFBb0UsT0FBcEU7QUFDQTtBQUNEO0FBQ0Q7O0FBRUQsa0JBQU1rSCxLQUFLLEdBQUdKLFNBQVMsQ0FBQ2pHLElBQVYsQ0FBZ0IscUJBQWhCLEVBQXdDeUMsSUFBeEMsRUFBZCxDQTNENEIsQ0E2RDVCOzs7QUFDQTFCLGNBQUFBLE1BQU0sQ0FBQzBCLElBQVAsQ0FBYTRELEtBQWI7QUFFQUwsY0FBQUEsU0FBUyxDQUFDekIsT0FBVixDQUFtQixzQkFBbkIsRUFBMkMsQ0FBRTBCLFNBQUYsQ0FBM0M7QUFoRTRCOztBQWU3QixnRUFBZ0M7QUFBQTtBQWtEL0IsYUFqRTRCLENBbUU3Qjs7QUFuRTZCO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBb0U3QjNILFVBQUFBLEtBQUssQ0FBQzBCLElBQU4sQ0FBWSw2Q0FBWixFQUE0RHhCLElBQTVELENBQWtFLFlBQVc7QUFDNUUsZ0JBQU1zQyxLQUFLLEdBQVE5QyxDQUFDLENBQUUsSUFBRixDQUFwQjtBQUNBLGdCQUFNK0gsVUFBVSxHQUFHLGVBQWVqRixLQUFLLENBQUNwQyxJQUFOLENBQVksSUFBWixDQUFmLEdBQW9DLElBQXZEO0FBRUFvQyxZQUFBQSxLQUFLLENBQUMyQixJQUFOLENBQVlMLFNBQVMsQ0FBQ3BDLElBQVYsQ0FBZ0IrRixVQUFoQixFQUE2QnRELElBQTdCLEVBQVo7QUFDQSxXQUxELEVBcEU2QixDQTJFN0I7O0FBQ0EsY0FBTTZELGtCQUFrQixHQUFHbEUsU0FBUyxDQUFDcEMsSUFBVixDQUFnQmpDLFlBQVksQ0FBQ3VFLG1CQUE3QixDQUEzQjtBQUNBLGNBQU1pRSxrQkFBa0IsR0FBR25FLFNBQVMsQ0FBQ3BDLElBQVYsQ0FBZ0JqQyxZQUFZLENBQUMyRixtQkFBN0IsQ0FBM0I7O0FBRUEsY0FBSzNGLFlBQVksQ0FBQ3VFLG1CQUFiLEtBQXFDdkUsWUFBWSxDQUFDMkYsbUJBQXZELEVBQTZFO0FBQzVFMUYsWUFBQUEsQ0FBQyxDQUFFRCxZQUFZLENBQUN1RSxtQkFBZixDQUFELENBQXNDRyxJQUF0QyxDQUE0QzZELGtCQUFrQixDQUFDN0QsSUFBbkIsRUFBNUM7QUFDQSxXQUZELE1BRU87QUFDTixnQkFBS3pFLENBQUMsQ0FBRUQsWUFBWSxDQUFDMkYsbUJBQWYsQ0FBRCxDQUFzQ2xDLE1BQTNDLEVBQW9EO0FBQ25ELGtCQUFLOEUsa0JBQWtCLENBQUM5RSxNQUF4QixFQUFpQztBQUNoQ3hELGdCQUFBQSxDQUFDLENBQUVELFlBQVksQ0FBQzJGLG1CQUFmLENBQUQsQ0FBc0NqQixJQUF0QyxDQUE0QzZELGtCQUFrQixDQUFDN0QsSUFBbkIsRUFBNUM7QUFDQSxlQUZELE1BRU8sSUFBSzhELGtCQUFrQixDQUFDL0UsTUFBeEIsRUFBaUM7QUFDdkN4RCxnQkFBQUEsQ0FBQyxDQUFFRCxZQUFZLENBQUMyRixtQkFBZixDQUFELENBQXNDakIsSUFBdEMsQ0FBNEM4RCxrQkFBa0IsQ0FBQzlELElBQW5CLEVBQTVDO0FBQ0E7QUFDRCxhQU5ELE1BTU8sSUFBS3pFLENBQUMsQ0FBRUQsWUFBWSxDQUFDdUUsbUJBQWYsQ0FBRCxDQUFzQ2QsTUFBM0MsRUFBb0Q7QUFDMUQsa0JBQUs4RSxrQkFBa0IsQ0FBQzlFLE1BQXhCLEVBQWlDO0FBQ2hDeEQsZ0JBQUFBLENBQUMsQ0FBRUQsWUFBWSxDQUFDdUUsbUJBQWYsQ0FBRCxDQUFzQ0csSUFBdEMsQ0FBNEM2RCxrQkFBa0IsQ0FBQzdELElBQW5CLEVBQTVDO0FBQ0EsZUFGRCxNQUVPLElBQUs4RCxrQkFBa0IsQ0FBQy9FLE1BQXhCLEVBQWlDO0FBQ3ZDeEQsZ0JBQUFBLENBQUMsQ0FBRUQsWUFBWSxDQUFDdUUsbUJBQWYsQ0FBRCxDQUFzQ0csSUFBdEMsQ0FBNEM4RCxrQkFBa0IsQ0FBQzlELElBQW5CLEVBQTVDO0FBQ0E7QUFDRDtBQUNEOztBQUVEM0QsVUFBQUEsS0FBSyxDQUFDZ0cscUJBQU4sQ0FBNkIxQyxTQUE3QixFQUF3Q1EsV0FBeEM7QUFDQTtBQXBHTSxPQUFSO0FBc0dBLEtBbmJhO0FBb2JkNEQsSUFBQUEsYUFBYSxFQUFFLHVCQUFVakIsR0FBVixFQUF3QztBQUFBLFVBQXpCM0MsV0FBeUIsdUVBQVgsUUFBVzs7QUFDdEQsVUFBSyxDQUFFMkMsR0FBUCxFQUFhO0FBQ1o7QUFDQTs7QUFFRCxVQUFNa0IsUUFBUSxHQUFHakIsUUFBUSxDQUFDaUIsUUFBMUIsQ0FMc0QsQ0FPdEQ7O0FBQ0EsVUFBSyxnQkFBZ0JBLFFBQXJCLEVBQWdDO0FBQy9CbEIsUUFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUNtQixPQUFKLENBQWEsd0JBQWIsRUFBdUMsa0JBQXZDLENBQU47QUFDQSxPQVZxRCxDQVl0RDs7O0FBRUFDLE1BQUFBLE9BQU8sQ0FBQ0MsU0FBUixDQUFtQjtBQUFFQyxRQUFBQSxLQUFLLEVBQUU7QUFBVCxPQUFuQixFQUFvQyxFQUFwQyxFQUF3Q3RCLEdBQXhDO0FBRUF6RyxNQUFBQSxLQUFLLENBQUN1RyxjQUFOLENBQXNCekMsV0FBdEI7QUFDQSxLQXJjYTtBQXNjZGtFLElBQUFBLHdCQUF3QixFQUFFLG9DQUFXO0FBQ3BDLFVBQU1DLG9CQUFvQixHQUFHLGdFQUE3QjtBQUVBekksTUFBQUEsS0FBSyxDQUFDc0IsRUFBTixDQUFVLE9BQVYsRUFBbUJtSCxvQkFBbkIsRUFBeUMsWUFBVztBQUNuRCxZQUFNQyxLQUFLLEdBQUdoSixDQUFDLENBQUUsSUFBRixDQUFmO0FBRUEsWUFBTWlKLFlBQVksR0FBUUQsS0FBSyxDQUFDM0gsT0FBTixDQUFlLHFCQUFmLENBQTFCO0FBQ0EsWUFBTTZILGFBQWEsR0FBT0QsWUFBWSxDQUFDOUgsSUFBYixDQUFtQixxQkFBbkIsQ0FBMUI7QUFDQSxZQUFNZ0ksYUFBYSxHQUFPQyxVQUFVLENBQUVILFlBQVksQ0FBQzlILElBQWIsQ0FBbUIsc0JBQW5CLENBQUYsQ0FBcEM7QUFDQSxZQUFNa0ksYUFBYSxHQUFPRCxVQUFVLENBQUVILFlBQVksQ0FBQzlILElBQWIsQ0FBbUIsc0JBQW5CLENBQUYsQ0FBcEM7QUFDQSxZQUFNbUksV0FBVyxHQUFTRixVQUFVLENBQUVILFlBQVksQ0FBQzlILElBQWIsQ0FBbUIsZ0JBQW5CLENBQUYsQ0FBcEM7QUFDQSxZQUFNb0ksV0FBVyxHQUFTSCxVQUFVLENBQUVILFlBQVksQ0FBQzlILElBQWIsQ0FBbUIsZ0JBQW5CLENBQUYsQ0FBcEM7QUFDQSxZQUFNcUksYUFBYSxHQUFPUCxZQUFZLENBQUM5SCxJQUFiLENBQW1CLHFCQUFuQixDQUExQjtBQUNBLFlBQU1zSSxpQkFBaUIsR0FBR1IsWUFBWSxDQUFDOUgsSUFBYixDQUFtQix5QkFBbkIsQ0FBMUI7QUFDQSxZQUFNdUksZ0JBQWdCLEdBQUlULFlBQVksQ0FBQzlILElBQWIsQ0FBbUIsd0JBQW5CLENBQTFCLENBWG1ELENBYW5EOztBQUNBd0ksUUFBQUEsWUFBWSxDQUFFWCxLQUFLLENBQUN0SSxJQUFOLENBQVksT0FBWixDQUFGLENBQVo7O0FBRUEsWUFBTWtKLFFBQVEsR0FBRyxTQUFYQSxRQUFXLENBQUVDLFVBQUYsRUFBa0I7QUFDbEMsY0FBS1gsYUFBTCxFQUFxQjtBQUNwQixtQkFBT1ksWUFBWSxDQUFFRCxVQUFGLEVBQWNMLGFBQWQsRUFBNkJFLGdCQUE3QixFQUErQ0QsaUJBQS9DLENBQW5CO0FBQ0E7O0FBRUQsaUJBQU9JLFVBQVA7QUFDQSxTQU5EOztBQVFBYixRQUFBQSxLQUFLLENBQUN0SSxJQUFOLENBQVksT0FBWixFQUFxQnFKLFVBQVUsQ0FBRSxZQUFXO0FBQzNDZixVQUFBQSxLQUFLLENBQUNnQixVQUFOLENBQWtCLE9BQWxCO0FBRUEsY0FBSUMsUUFBUSxHQUFHYixVQUFVLENBQUVILFlBQVksQ0FBQ2pILElBQWIsQ0FBbUIsWUFBbkIsRUFBa0N1QixHQUFsQyxFQUFGLENBQXpCO0FBQ0EsY0FBSTJHLFFBQVEsR0FBR2QsVUFBVSxDQUFFSCxZQUFZLENBQUNqSCxJQUFiLENBQW1CLFlBQW5CLEVBQWtDdUIsR0FBbEMsRUFBRixDQUF6QixDQUoyQyxDQU0zQzs7QUFDQSxjQUFLNEcsS0FBSyxDQUFFRixRQUFGLENBQVYsRUFBeUI7QUFDeEJBLFlBQUFBLFFBQVEsR0FBR2QsYUFBWDtBQUVBRixZQUFBQSxZQUFZLENBQUNqSCxJQUFiLENBQW1CLFlBQW5CLEVBQWtDdUIsR0FBbEMsQ0FBdUNxRyxRQUFRLENBQUVLLFFBQUYsQ0FBL0M7QUFDQSxXQUpELE1BSU87QUFDTmhCLFlBQUFBLFlBQVksQ0FBQ2pILElBQWIsQ0FBbUIsWUFBbkIsRUFBa0N1QixHQUFsQyxDQUF1Q3FHLFFBQVEsQ0FBRUssUUFBRixDQUEvQztBQUNBLFdBYjBDLENBZTNDOzs7QUFDQSxjQUFLRSxLQUFLLENBQUVELFFBQUYsQ0FBVixFQUF5QjtBQUN4QkEsWUFBQUEsUUFBUSxHQUFHYixhQUFYO0FBRUFKLFlBQUFBLFlBQVksQ0FBQ2pILElBQWIsQ0FBbUIsWUFBbkIsRUFBa0N1QixHQUFsQyxDQUF1Q3FHLFFBQVEsQ0FBRU0sUUFBRixDQUEvQztBQUNBLFdBSkQsTUFJTztBQUNOakIsWUFBQUEsWUFBWSxDQUFDakgsSUFBYixDQUFtQixZQUFuQixFQUFrQ3VCLEdBQWxDLENBQXVDcUcsUUFBUSxDQUFFTSxRQUFGLENBQS9DO0FBQ0EsV0F0QjBDLENBd0IzQzs7O0FBQ0EsY0FBS0QsUUFBUSxHQUFHZCxhQUFoQixFQUFnQztBQUMvQmMsWUFBQUEsUUFBUSxHQUFHZCxhQUFYO0FBRUFGLFlBQUFBLFlBQVksQ0FBQ2pILElBQWIsQ0FBbUIsWUFBbkIsRUFBa0N1QixHQUFsQyxDQUF1Q3FHLFFBQVEsQ0FBRUssUUFBRixDQUEvQztBQUNBLFdBN0IwQyxDQStCM0M7OztBQUNBLGNBQUtBLFFBQVEsR0FBR1osYUFBaEIsRUFBZ0M7QUFDL0JZLFlBQUFBLFFBQVEsR0FBR1osYUFBWDtBQUVBSixZQUFBQSxZQUFZLENBQUNqSCxJQUFiLENBQW1CLFlBQW5CLEVBQWtDdUIsR0FBbEMsQ0FBdUNxRyxRQUFRLENBQUVLLFFBQUYsQ0FBL0M7QUFDQSxXQXBDMEMsQ0FzQzNDOzs7QUFDQSxjQUFLQyxRQUFRLEdBQUdiLGFBQWhCLEVBQWdDO0FBQy9CYSxZQUFBQSxRQUFRLEdBQUdiLGFBQVg7QUFFQUosWUFBQUEsWUFBWSxDQUFDakgsSUFBYixDQUFtQixZQUFuQixFQUFrQ3VCLEdBQWxDLENBQXVDcUcsUUFBUSxDQUFFTSxRQUFGLENBQS9DO0FBQ0EsV0EzQzBDLENBNkMzQzs7O0FBQ0EsY0FBS0QsUUFBUSxHQUFHQyxRQUFoQixFQUEyQjtBQUMxQkEsWUFBQUEsUUFBUSxHQUFHRCxRQUFYO0FBRUFoQixZQUFBQSxZQUFZLENBQUNqSCxJQUFiLENBQW1CLFlBQW5CLEVBQWtDdUIsR0FBbEMsQ0FBdUNxRyxRQUFRLENBQUVNLFFBQUYsQ0FBL0M7QUFDQSxXQWxEMEMsQ0FvRDNDOzs7QUFDQSxjQUFLRCxRQUFRLEtBQUtYLFdBQWIsSUFBNEJZLFFBQVEsS0FBS1gsV0FBOUMsRUFBNEQ7QUFDM0Q7QUFDQTs7QUFFRCxjQUFLVSxRQUFRLEtBQUtkLGFBQWIsSUFBOEJlLFFBQVEsS0FBS2IsYUFBaEQsRUFBZ0U7QUFDL0Q7QUFDQXZJLFlBQUFBLEtBQUssQ0FBQzBILGFBQU4sQ0FBcUJTLFlBQVksQ0FBQ3ZJLElBQWIsQ0FBbUIsa0JBQW5CLENBQXJCO0FBQ0EsV0FIRCxNQUdPO0FBQ047QUFDQSxnQkFBTTZHLEdBQUcsR0FBRzBCLFlBQVksQ0FBQ3ZJLElBQWIsQ0FBbUIsS0FBbkIsRUFBMkJnSSxPQUEzQixDQUFvQyxLQUFwQyxFQUEyQ3VCLFFBQTNDLEVBQXNEdkIsT0FBdEQsQ0FBK0QsS0FBL0QsRUFBc0V3QixRQUF0RSxDQUFaO0FBQ0FwSixZQUFBQSxLQUFLLENBQUMwSCxhQUFOLENBQXFCakIsR0FBckI7QUFDQTtBQUNELFNBakU4QixFQWlFNUJsSCxLQWpFNEIsQ0FBL0I7QUFrRUEsT0ExRkQ7QUEyRkEsS0FwaUJhO0FBcWlCZCtKLElBQUFBLHNCQUFzQixFQUFFLGtDQUFXO0FBQ2xDOUosTUFBQUEsS0FBSyxDQUFDc0IsRUFBTixDQUFVLFFBQVYsRUFBb0IsK0JBQXBCLEVBQXFELFlBQVc7QUFDL0QsWUFBTW9CLE9BQU8sR0FBR2hELENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVXFCLE9BQVYsQ0FBbUIsbUJBQW5CLENBQWhCO0FBQ0EsWUFBTWdKLE9BQU8sR0FBR3JILE9BQU8sQ0FBQ3RDLElBQVIsQ0FBYyxVQUFkLENBQWhCO0FBRUEsWUFBSTRKLFNBQVMsR0FBRyxFQUFoQixDQUorRCxDQU0vRDs7QUFDQVgsUUFBQUEsWUFBWSxDQUFFM0csT0FBTyxDQUFDdEMsSUFBUixDQUFjLE9BQWQsQ0FBRixDQUFaOztBQUVBLFlBQUsySixPQUFMLEVBQWU7QUFDZCxjQUFNRSxJQUFJLEdBQUd2SCxPQUFPLENBQUNoQixJQUFSLENBQWMsa0JBQWQsRUFBbUN1QixHQUFuQyxFQUFiO0FBQ0EsY0FBTWlILEVBQUUsR0FBS3hILE9BQU8sQ0FBQ2hCLElBQVIsQ0FBYyxnQkFBZCxFQUFpQ3VCLEdBQWpDLEVBQWI7O0FBRUEsY0FBS2dILElBQUksSUFBSUMsRUFBYixFQUFrQjtBQUNqQkYsWUFBQUEsU0FBUyxHQUFHdEgsT0FBTyxDQUFDdEMsSUFBUixDQUFjLEtBQWQsRUFBc0JnSSxPQUF0QixDQUErQixLQUEvQixFQUFzQzZCLElBQXRDLEVBQTZDN0IsT0FBN0MsQ0FBc0QsS0FBdEQsRUFBNkQ4QixFQUE3RCxDQUFaO0FBQ0EsV0FGRCxNQUVPLElBQUssQ0FBRUQsSUFBRixJQUFVLENBQUVDLEVBQWpCLEVBQXNCO0FBQzVCRixZQUFBQSxTQUFTLEdBQUd0SCxPQUFPLENBQUN0QyxJQUFSLENBQWMsa0JBQWQsQ0FBWjtBQUNBO0FBQ0QsU0FURCxNQVNPO0FBQ04sY0FBTTZKLEtBQUksR0FBR3ZILE9BQU8sQ0FBQ2hCLElBQVIsQ0FBYyxrQkFBZCxFQUFtQ3VCLEdBQW5DLEVBQWI7O0FBRUEsY0FBS2dILEtBQUwsRUFBWTtBQUNYRCxZQUFBQSxTQUFTLEdBQUd0SCxPQUFPLENBQUN0QyxJQUFSLENBQWMsS0FBZCxFQUFzQmdJLE9BQXRCLENBQStCLElBQS9CLEVBQXFDNkIsS0FBckMsQ0FBWjtBQUNBLFdBRkQsTUFFTztBQUNORCxZQUFBQSxTQUFTLEdBQUd0SCxPQUFPLENBQUN0QyxJQUFSLENBQWMsa0JBQWQsQ0FBWjtBQUNBO0FBQ0Q7O0FBRUQsWUFBSzRKLFNBQUwsRUFBaUI7QUFDaEJ0SCxVQUFBQSxPQUFPLENBQUN0QyxJQUFSLENBQWMsT0FBZCxFQUF1QnFKLFVBQVUsQ0FBRSxZQUFXO0FBQzdDL0csWUFBQUEsT0FBTyxDQUFDZ0gsVUFBUixDQUFvQixPQUFwQjtBQUVBbEosWUFBQUEsS0FBSyxDQUFDMEgsYUFBTixDQUFxQjhCLFNBQXJCO0FBQ0EsV0FKZ0MsRUFJOUJqSyxLQUo4QixDQUFqQztBQUtBO0FBQ0QsT0FuQ0Q7QUFvQ0EsS0Exa0JhO0FBMmtCZG9LLElBQUFBLGlCQUFpQixFQUFFLDZCQUFXO0FBQzdCLFVBQU1DLFlBQVksR0FBRyx5Q0FDcEIsbUNBRG9CLEdBRXBCLDhDQUZEO0FBSUFwSyxNQUFBQSxLQUFLLENBQUNzQixFQUFOLENBQVUsUUFBVixFQUFvQjhJLFlBQXBCLEVBQWtDLFlBQVc7QUFDNUMxSyxRQUFBQSxDQUFDLENBQUUsSUFBRixDQUFELENBQVVxQixPQUFWLENBQW1CLG9CQUFuQixFQUEwQ3NKLFdBQTFDLENBQXVELGFBQXZEO0FBRUE3SixRQUFBQSxLQUFLLENBQUMwSCxhQUFOLENBQXFCeEksQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVVSxJQUFWLENBQWdCLEtBQWhCLENBQXJCO0FBQ0EsT0FKRDtBQU1BLFVBQU1rSyxtQkFBbUIsR0FBRyx5QkFBNUI7QUFFQXRLLE1BQUFBLEtBQUssQ0FBQ3NCLEVBQU4sQ0FBVSxRQUFWLEVBQW9CZ0osbUJBQW1CLEdBQUcsb0JBQTFDLEVBQWdFLFlBQVc7QUFDMUU1SyxRQUFBQSxDQUFDLENBQUUsSUFBRixDQUFELENBQVVxQixPQUFWLENBQW1CLG9CQUFuQixFQUEwQ3NKLFdBQTFDLENBQXVELGFBQXZELEVBRDBFLENBRzFFOztBQUNBM0ssUUFBQUEsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUNFcUIsT0FERixDQUNXdUosbUJBRFgsRUFFRTVJLElBRkYsQ0FFUSxrREFGUixFQUdFNkksR0FIRixDQUdPLElBSFAsRUFJRUMsSUFKRixDQUlRLFNBSlIsRUFJbUIsS0FKbkIsRUFLRXpKLE9BTEYsQ0FLVyxvQkFMWCxFQU1Fc0IsV0FORixDQU1lLGFBTmY7QUFRQTdCLFFBQUFBLEtBQUssQ0FBQzBILGFBQU4sQ0FBcUJ4SSxDQUFDLENBQUUsSUFBRixDQUFELENBQVVVLElBQVYsQ0FBZ0IsS0FBaEIsQ0FBckI7QUFDQSxPQWJEO0FBY0EsS0F0bUJhO0FBdW1CZHFLLElBQUFBLHFCQUFxQixFQUFFLGlDQUFXO0FBQ2pDekssTUFBQUEsS0FBSyxDQUFDc0IsRUFBTixDQUFVLFFBQVYsRUFBb0IsZ0NBQXBCLEVBQXNELFlBQVc7QUFDaEUsWUFBTW9KLE9BQU8sR0FBVWhMLENBQUMsQ0FBRSxJQUFGLENBQXhCO0FBQ0EsWUFBTWlMLE1BQU0sR0FBV0QsT0FBTyxDQUFDekgsR0FBUixFQUF2QjtBQUNBLFlBQU0ySCxTQUFTLEdBQVFGLE9BQU8sQ0FBQ3RLLElBQVIsQ0FBYyxLQUFkLENBQXZCO0FBQ0EsWUFBTXlLLGNBQWMsR0FBR0gsT0FBTyxDQUFDdEssSUFBUixDQUFjLGtCQUFkLENBQXZCO0FBQ0EsWUFBSTZHLEdBQUo7O0FBRUEsWUFBSzBELE1BQU0sQ0FBQ3pILE1BQVosRUFBcUI7QUFDcEIrRCxVQUFBQSxHQUFHLEdBQUcyRCxTQUFTLENBQUN4QyxPQUFWLENBQW1CLElBQW5CLEVBQXlCdUMsTUFBTSxDQUFDbEgsUUFBUCxFQUF6QixDQUFOO0FBQ0EsU0FGRCxNQUVPO0FBQ053RCxVQUFBQSxHQUFHLEdBQUc0RCxjQUFOO0FBQ0E7O0FBRURySyxRQUFBQSxLQUFLLENBQUMwSCxhQUFOLENBQXFCakIsR0FBckI7QUFDQSxPQWREO0FBZUEsS0F2bkJhO0FBd25CZDZELElBQUFBLGdCQUFnQixFQUFFLDRCQUFXO0FBQzVCLFVBQUtyTCxZQUFZLENBQUNzTCwwQkFBYixJQUEyQ3RMLFlBQVksQ0FBQ3VMLG9CQUE3RCxFQUFvRjtBQUNuRixZQUFNakgsVUFBVSxHQUFHckUsQ0FBQyxDQUFFRCxZQUFZLENBQUN1RSxtQkFBZixDQUFwQjs7QUFDQSxZQUFNaUgsVUFBVSxHQUFHeEwsWUFBWSxDQUFDdUwsb0JBQWIsQ0FBa0NFLEtBQWxDLENBQXlDLEdBQXpDLENBQW5COztBQUNBLFlBQU1DLFNBQVMsR0FBSSxFQUFuQjs7QUFFQUYsUUFBQUEsVUFBVSxDQUFDN0UsT0FBWCxDQUFvQixVQUFBbkMsUUFBUSxFQUFJO0FBQy9CLGNBQUtBLFFBQUwsRUFBZ0I7QUFDZmtILFlBQUFBLFNBQVMsQ0FBQzlLLElBQVYsQ0FBZ0I0RCxRQUFRLEdBQUcsSUFBM0I7QUFDQTtBQUNELFNBSkQ7O0FBTUEsWUFBTUEsUUFBUSxHQUFHa0gsU0FBUyxDQUFDQyxJQUFWLENBQWdCLEdBQWhCLENBQWpCOztBQUVBLFlBQUtySCxVQUFVLENBQUNiLE1BQWhCLEVBQXlCO0FBQ3hCYSxVQUFBQSxVQUFVLENBQUN6QyxFQUFYLENBQWUsT0FBZixFQUF3QjJDLFFBQXhCLEVBQWtDLFVBQVUxQyxDQUFWLEVBQWM7QUFDL0NBLFlBQUFBLENBQUMsQ0FBQ1UsY0FBRjtBQUVBLGdCQUFNa0YsSUFBSSxHQUFHekgsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVbUIsSUFBVixDQUFnQixNQUFoQixDQUFiO0FBRUFMLFlBQUFBLEtBQUssQ0FBQzBILGFBQU4sQ0FBcUJmLElBQXJCLEVBQTJCLFVBQTNCO0FBQ0EsV0FORDtBQU9BO0FBQ0Q7QUFDRCxLQWhwQmE7QUFpcEJka0UsSUFBQUEsb0JBQW9CLEVBQUUsZ0NBQVc7QUFDaEMsVUFBSyxDQUFFNUwsWUFBWSxDQUFDNkwsZUFBcEIsRUFBc0M7QUFDckM7QUFDQXRMLFFBQUFBLEtBQUssQ0FBQ3NCLEVBQU4sQ0FBVSxRQUFWLEVBQW9CLHNDQUFwQixFQUE0RCxZQUFXO0FBQ3RFNUIsVUFBQUEsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVcUIsT0FBVixDQUFtQixNQUFuQixFQUE0QmtGLE9BQTVCLENBQXFDLFFBQXJDO0FBQ0EsU0FGRDtBQUlBO0FBQ0EsT0FSK0IsQ0FVaEM7OztBQUNBakcsTUFBQUEsS0FBSyxDQUFDc0IsRUFBTixDQUFVLFFBQVYsRUFBb0IsdUJBQXBCLEVBQTZDLFlBQVc7QUFDdkQsZUFBTyxLQUFQO0FBQ0EsT0FGRCxFQVhnQyxDQWVoQzs7QUFDQXRCLE1BQUFBLEtBQUssQ0FBQ3NCLEVBQU4sQ0FBVSxRQUFWLEVBQW9CLHNDQUFwQixFQUE0RCxZQUFXO0FBQ3RFLFlBQU1pSyxLQUFLLEdBQUc3TCxDQUFDLENBQUUsSUFBRixDQUFELENBQVV1RCxHQUFWLEVBQWQ7QUFFQSxZQUFNZ0UsR0FBRyxHQUFHLElBQUl1RSxHQUFKLENBQVM3TCxNQUFNLENBQUN1SCxRQUFoQixDQUFaO0FBQ0FELFFBQUFBLEdBQUcsQ0FBQ3dFLFlBQUosQ0FBaUJDLEdBQWpCLENBQXNCLFNBQXRCLEVBQWlDSCxLQUFqQztBQUVBL0ssUUFBQUEsS0FBSyxDQUFDMEgsYUFBTixDQUFxQnlELGFBQWEsQ0FBRTFFLEdBQUcsQ0FBQ0UsSUFBTixDQUFsQztBQUVBLGVBQU8sS0FBUDtBQUNBLE9BVEQ7QUFVQSxLQTNxQmE7QUE0cUJkeUUsSUFBQUEsaUJBQWlCLEVBQUUsNkJBQVc7QUFDN0I1TCxNQUFBQSxLQUFLLENBQUNzQixFQUFOLENBQVUsT0FBVixFQUFtQix5QkFBbkIsRUFBOEMsVUFBVUMsQ0FBVixFQUFjO0FBQzNEQSxRQUFBQSxDQUFDLENBQUNDLGVBQUY7QUFFQWhCLFFBQUFBLEtBQUssQ0FBQzBILGFBQU4sQ0FBcUJ4SSxDQUFDLENBQUUsSUFBRixDQUFELENBQVVtQixJQUFWLENBQWdCLHVCQUFoQixDQUFyQjtBQUNBLE9BSkQ7QUFLQSxLQWxyQmE7QUFtckJkZ0wsSUFBQUEsbUJBQW1CLEVBQUUsK0JBQVc7QUFDL0I7QUFDQSxVQUFLLGVBQWUsT0FBT0MsS0FBM0IsRUFBbUM7QUFDbEM7QUFDQTs7QUFFRCxVQUFLLENBQUVyTSxZQUFZLENBQUMwRyxXQUFwQixFQUFrQztBQUNqQztBQUNBLE9BUjhCLENBVS9COzs7QUFDQTJGLE1BQUFBLEtBQUssQ0FBRSx1QkFBRixFQUEyQjtBQUMvQkMsUUFBQUEsU0FBUyxFQUFFLEtBRG9CO0FBRS9CQyxRQUFBQSxPQUYrQixtQkFFdEJDLFNBRnNCLEVBRVY7QUFDcEIsaUJBQU9BLFNBQVMsQ0FBQ0MsWUFBVixDQUF3QixjQUF4QixDQUFQO0FBQ0EsU0FKOEI7QUFLL0JDLFFBQUFBLFNBQVMsRUFBRTtBQUxvQixPQUEzQixDQUFMO0FBT0EsS0Fyc0JhO0FBc3NCZEMsSUFBQUEsWUFBWSxFQUFFLHdCQUFXO0FBQ3hCLFVBQUssQ0FBRUMsTUFBTSxHQUFHQyxXQUFoQixFQUE4QjtBQUM3QjtBQUNBOztBQUVELFVBQU1DLGNBQWMsR0FBRyxTQUFqQkEsY0FBaUIsQ0FBRWpKLElBQUYsRUFBUWxELElBQVIsRUFBa0I7QUFDeEMsZUFBTyxDQUNOLFdBQVdrRCxJQUFYLEdBQWtCLFNBRFosRUFFTiwrQkFBK0JsRCxJQUFJLENBQUUsYUFBRixDQUFuQyxHQUF1RCxTQUZqRCxFQUdMZ0wsSUFISyxDQUdDLEVBSEQsQ0FBUDtBQUlBLE9BTEQ7O0FBT0EsVUFBTW9CLGlCQUFpQixHQUFHLFNBQXBCQSxpQkFBb0IsQ0FBRWxKLElBQUYsRUFBUWxELElBQVIsRUFBa0I7QUFDM0MsZUFBTyxDQUNOLDhCQUE4QkEsSUFBSSxDQUFDcU0sS0FBbkMsR0FBMkMsSUFBM0MsR0FBa0RuSixJQUFsRCxHQUF5RCxTQURuRCxFQUVOLDBDQUEwQ2xELElBQUksQ0FBQ3FNLEtBQS9DLEdBQXVELElBQXZELEdBQThEck0sSUFBSSxDQUFFLGFBQUYsQ0FBbEUsR0FBc0YsU0FGaEYsRUFHTGdMLElBSEssQ0FHQyxFQUhELENBQVA7QUFJQSxPQUxEOztBQU9BLFVBQU1zQixRQUFRLEdBQUc7QUFDaEJDLFFBQUFBLHNCQUFzQixFQUFFLElBRFI7QUFFaEJDLFFBQUFBLHNCQUFzQixFQUFFLElBRlI7QUFHaEJDLFFBQUFBLGVBQWUsRUFBRXBOLFlBQVksQ0FBQ3FOLHNCQUhkO0FBSWhCQyxRQUFBQSxpQkFBaUIsRUFBRXROLFlBQVksQ0FBQ3VOLHdCQUpoQjtBQUtoQkMsUUFBQUEsZUFBZSxFQUFFLElBTEQ7QUFLTztBQUN2QkMsUUFBQUEsZ0JBQWdCLEVBQUUsSUFORixDQU1ROztBQU5SLE9BQWpCOztBQVNBLFVBQUt6TixZQUFZLENBQUMwTixNQUFsQixFQUEyQjtBQUMxQlQsUUFBQUEsUUFBUSxDQUFFLEtBQUYsQ0FBUixHQUFvQixJQUFwQjtBQUNBOztBQUVEMU0sTUFBQUEsS0FBSyxDQUFDMEIsSUFBTixDQUFZLGVBQVosRUFBOEJ4QixJQUE5QixDQUFvQyxZQUFXO0FBQzlDLFlBQU1rTixLQUFLLEdBQUsxTixDQUFDLENBQUUsSUFBRixDQUFqQjs7QUFDQSxZQUFNMk4sT0FBTyxxQkFBUVgsUUFBUixDQUFiLENBRjhDLENBSTlDOzs7QUFDQSxZQUFLVSxLQUFLLENBQUN4SyxRQUFOLENBQWdCLGVBQWhCLENBQUwsRUFBeUM7QUFDeEN5SyxVQUFBQSxPQUFPLENBQUUsMEJBQUYsQ0FBUCxHQUF3QyxJQUF4QztBQUNBLFNBRkQsTUFFTztBQUNOQSxVQUFBQSxPQUFPLENBQUUsMEJBQUYsQ0FBUCxHQUF3QzVOLFlBQVksQ0FBQzZOLCtCQUFyRDtBQUNBLFNBVDZDLENBVzlDOzs7QUFDQSxZQUFLRixLQUFLLENBQUN4SyxRQUFOLENBQWdCLFlBQWhCLENBQUwsRUFBc0M7QUFDckN5SyxVQUFBQSxPQUFPLENBQUUsZ0JBQUYsQ0FBUCxHQUFpQ2QsY0FBakM7QUFDQWMsVUFBQUEsT0FBTyxDQUFFLG1CQUFGLENBQVAsR0FBaUNiLGlCQUFqQztBQUNBLFNBZjZDLENBaUI5Qzs7O0FBQ0EsWUFBSyxDQUFFWSxLQUFLLENBQUNoTixJQUFOLENBQVksZUFBWixDQUFQLEVBQXVDO0FBQ3RDaU4sVUFBQUEsT0FBTyxDQUFFLGdCQUFGLENBQVAsR0FBOEIsSUFBOUI7QUFDQTs7QUFFREQsUUFBQUEsS0FBSyxDQUFDZCxXQUFOLENBQW1CZSxPQUFuQjtBQUNBLE9BdkJELEVBaEN3QixDQXlEeEI7O0FBQ0EsVUFBSzVOLFlBQVksQ0FBQzhOLHdCQUFsQixFQUE2QztBQUM1QyxZQUFJQyxhQUFhLEdBQUcsSUFBcEI7O0FBRUEsWUFBSy9OLFlBQVksQ0FBQ2dPLDZCQUFsQixFQUFrRDtBQUNqREQsVUFBQUEsYUFBYSxHQUFHLEtBQWhCO0FBQ0E7O0FBRUQsWUFBTUgsT0FBTyxxQkFBUVgsUUFBUixDQUFiOztBQUVBVyxRQUFBQSxPQUFPLENBQUUsZ0JBQUYsQ0FBUCxHQUE4QkcsYUFBOUI7QUFFQXhOLFFBQUFBLEtBQUssQ0FBQzBCLElBQU4sQ0FBWSxzQ0FBWixFQUFxRDRLLFdBQXJELENBQWtFZSxPQUFsRTtBQUNBO0FBQ0QsS0E3d0JhO0FBOHdCZEssSUFBQUEsZUFBZSxFQUFFLDJCQUFXO0FBQzNCLFVBQUssZ0JBQWdCLE9BQU9DLFVBQTVCLEVBQXlDO0FBQ3hDO0FBQ0E7O0FBRUQzTixNQUFBQSxLQUFLLENBQUMwQixJQUFOLENBQVkscUJBQVosRUFBb0N4QixJQUFwQyxDQUEwQyxZQUFXO0FBQ3BELFlBQU13SSxLQUFLLEdBQUtoSixDQUFDLENBQUUsSUFBRixDQUFqQjtBQUNBLFlBQU1rTyxPQUFPLEdBQUdsRixLQUFLLENBQUNoSCxJQUFOLENBQVksb0JBQVosQ0FBaEI7QUFFQSxZQUFNbU0sUUFBUSxHQUFZRCxPQUFPLENBQUMvTSxJQUFSLENBQWMsSUFBZCxDQUExQjtBQUNBLFlBQU1pTixlQUFlLEdBQUtwRixLQUFLLENBQUM3SCxJQUFOLENBQVksd0JBQVosQ0FBMUI7QUFDQSxZQUFNK0gsYUFBYSxHQUFPRixLQUFLLENBQUM3SCxJQUFOLENBQVkscUJBQVosQ0FBMUI7QUFDQSxZQUFNZ0ksYUFBYSxHQUFPQyxVQUFVLENBQUVKLEtBQUssQ0FBQzdILElBQU4sQ0FBWSxzQkFBWixDQUFGLENBQXBDO0FBQ0EsWUFBTWtJLGFBQWEsR0FBT0QsVUFBVSxDQUFFSixLQUFLLENBQUM3SCxJQUFOLENBQVksc0JBQVosQ0FBRixDQUFwQztBQUNBLFlBQU1rTixJQUFJLEdBQWdCakYsVUFBVSxDQUFFSixLQUFLLENBQUM3SCxJQUFOLENBQVksV0FBWixDQUFGLENBQXBDO0FBQ0EsWUFBTXFJLGFBQWEsR0FBT1IsS0FBSyxDQUFDN0gsSUFBTixDQUFZLHFCQUFaLENBQTFCO0FBQ0EsWUFBTXNJLGlCQUFpQixHQUFHVCxLQUFLLENBQUM3SCxJQUFOLENBQVkseUJBQVosQ0FBMUI7QUFDQSxZQUFNdUksZ0JBQWdCLEdBQUlWLEtBQUssQ0FBQzdILElBQU4sQ0FBWSx3QkFBWixDQUExQjtBQUNBLFlBQU04SSxRQUFRLEdBQVliLFVBQVUsQ0FBRUosS0FBSyxDQUFDN0gsSUFBTixDQUFZLGdCQUFaLENBQUYsQ0FBcEM7QUFDQSxZQUFNK0ksUUFBUSxHQUFZZCxVQUFVLENBQUVKLEtBQUssQ0FBQzdILElBQU4sQ0FBWSxnQkFBWixDQUFGLENBQXBDO0FBQ0EsWUFBTW1OLFNBQVMsR0FBV3RGLEtBQUssQ0FBQ2hILElBQU4sQ0FBWSxZQUFaLENBQTFCO0FBQ0EsWUFBTXVNLFNBQVMsR0FBV3ZGLEtBQUssQ0FBQ2hILElBQU4sQ0FBWSxZQUFaLENBQTFCO0FBRUEsWUFBTXdNLE1BQU0sR0FBR3BJLFFBQVEsQ0FBQ3FJLGNBQVQsQ0FBeUJOLFFBQXpCLENBQWY7QUFFQUYsUUFBQUEsVUFBVSxDQUFDUyxNQUFYLENBQW1CRixNQUFuQixFQUEyQjtBQUMxQkcsVUFBQUEsS0FBSyxFQUFFLENBQUUxRSxRQUFGLEVBQVlDLFFBQVosQ0FEbUI7QUFFMUJtRSxVQUFBQSxJQUFJLEVBQUpBLElBRjBCO0FBRzFCTyxVQUFBQSxPQUFPLEVBQUUsSUFIaUI7QUFJMUJDLFVBQUFBLFNBQVMsRUFBRSxhQUplO0FBSzFCQyxVQUFBQSxLQUFLLEVBQUU7QUFDTixtQkFBTzNGLGFBREQ7QUFFTixtQkFBT0U7QUFGRDtBQUxtQixTQUEzQjtBQVdBbUYsUUFBQUEsTUFBTSxDQUFDUCxVQUFQLENBQWtCck0sRUFBbEIsQ0FBc0IsUUFBdEIsRUFBZ0MsVUFBVXFKLE1BQVYsRUFBbUI7QUFDbEQsY0FBSWhCLFFBQUo7QUFDQSxjQUFJQyxRQUFKOztBQUVBLGNBQUtoQixhQUFMLEVBQXFCO0FBQ3BCZSxZQUFBQSxRQUFRLEdBQUdILFlBQVksQ0FBRW1CLE1BQU0sQ0FBRSxDQUFGLENBQVIsRUFBZXpCLGFBQWYsRUFBOEJFLGdCQUE5QixFQUFnREQsaUJBQWhELENBQXZCO0FBQ0FTLFlBQUFBLFFBQVEsR0FBR0osWUFBWSxDQUFFbUIsTUFBTSxDQUFFLENBQUYsQ0FBUixFQUFlekIsYUFBZixFQUE4QkUsZ0JBQTlCLEVBQWdERCxpQkFBaEQsQ0FBdkI7QUFDQSxXQUhELE1BR087QUFDTlEsWUFBQUEsUUFBUSxHQUFHYixVQUFVLENBQUU2QixNQUFNLENBQUUsQ0FBRixDQUFSLENBQXJCO0FBQ0FmLFlBQUFBLFFBQVEsR0FBR2QsVUFBVSxDQUFFNkIsTUFBTSxDQUFFLENBQUYsQ0FBUixDQUFyQjtBQUNBOztBQUVELGNBQUssaUJBQWlCbUQsZUFBdEIsRUFBd0M7QUFDdkNFLFlBQUFBLFNBQVMsQ0FBQzdKLElBQVYsQ0FBZ0J3RixRQUFoQjtBQUNBc0UsWUFBQUEsU0FBUyxDQUFDOUosSUFBVixDQUFnQnlGLFFBQWhCO0FBQ0EsV0FIRCxNQUdPO0FBQ05vRSxZQUFBQSxTQUFTLENBQUMvSyxHQUFWLENBQWUwRyxRQUFmO0FBQ0FzRSxZQUFBQSxTQUFTLENBQUNoTCxHQUFWLENBQWUyRyxRQUFmO0FBQ0E7O0FBRUQ1SixVQUFBQSxLQUFLLENBQUNpRyxPQUFOLENBQWUseUJBQWYsRUFBMEMsQ0FBRXlDLEtBQUYsRUFBU2lDLE1BQVQsQ0FBMUM7QUFDQSxTQXJCRDs7QUF1QkEsaUJBQVM4RCwrQkFBVCxDQUEwQzlELE1BQTFDLEVBQW1EO0FBQ2xELGNBQU0rRCxTQUFTLEdBQUc1RixVQUFVLENBQUU2QixNQUFNLENBQUUsQ0FBRixDQUFSLENBQTVCOztBQUNBLGNBQU1nRSxTQUFTLEdBQUc3RixVQUFVLENBQUU2QixNQUFNLENBQUUsQ0FBRixDQUFSLENBQTVCLENBRmtELENBSWxEOzs7QUFDQSxjQUFLK0QsU0FBUyxLQUFLL0UsUUFBZCxJQUEwQmdGLFNBQVMsS0FBSy9FLFFBQTdDLEVBQXdEO0FBQ3ZEO0FBQ0E7O0FBRUQsY0FBSzhFLFNBQVMsS0FBSzdGLGFBQWQsSUFBK0I4RixTQUFTLEtBQUs1RixhQUFsRCxFQUFrRTtBQUNqRTtBQUNBdkksWUFBQUEsS0FBSyxDQUFDMEgsYUFBTixDQUFxQlEsS0FBSyxDQUFDdEksSUFBTixDQUFZLGtCQUFaLENBQXJCO0FBQ0EsV0FIRCxNQUdPO0FBQ047QUFDQSxnQkFBTTZHLEdBQUcsR0FBR3lCLEtBQUssQ0FBQ3RJLElBQU4sQ0FBWSxLQUFaLEVBQW9CZ0ksT0FBcEIsQ0FBNkIsS0FBN0IsRUFBb0NzRyxTQUFwQyxFQUFnRHRHLE9BQWhELENBQXlELEtBQXpELEVBQWdFdUcsU0FBaEUsQ0FBWjtBQUNBbk8sWUFBQUEsS0FBSyxDQUFDMEgsYUFBTixDQUFxQmpCLEdBQXJCO0FBQ0E7QUFDRDs7QUFFRGlILFFBQUFBLE1BQU0sQ0FBQ1AsVUFBUCxDQUFrQnJNLEVBQWxCLENBQXNCLFFBQXRCLEVBQWdDLFVBQVVxSixNQUFWLEVBQW1CO0FBQ2xEOEQsVUFBQUEsK0JBQStCLENBQUU5RCxNQUFGLENBQS9CO0FBQ0EsU0FGRDtBQUlBcUQsUUFBQUEsU0FBUyxDQUFDMU0sRUFBVixDQUFjLE9BQWQsRUFBdUIsWUFBVztBQUNqQyxjQUFNc04sTUFBTSxHQUFHbFAsQ0FBQyxDQUFFLElBQUYsQ0FBaEIsQ0FEaUMsQ0FHakM7O0FBQ0EySixVQUFBQSxZQUFZLENBQUV1RixNQUFNLENBQUN4TyxJQUFQLENBQWEsT0FBYixDQUFGLENBQVo7QUFFQXdPLFVBQUFBLE1BQU0sQ0FBQ3hPLElBQVAsQ0FBYSxPQUFiLEVBQXNCcUosVUFBVSxDQUFFLFlBQVc7QUFDNUNtRixZQUFBQSxNQUFNLENBQUNsRixVQUFQLENBQW1CLE9BQW5CO0FBRUEsZ0JBQU1DLFFBQVEsR0FBR2lGLE1BQU0sQ0FBQzNMLEdBQVAsRUFBakI7QUFFQWlMLFlBQUFBLE1BQU0sQ0FBQ1AsVUFBUCxDQUFrQmpDLEdBQWxCLENBQXVCLENBQUUvQixRQUFGLEVBQVksSUFBWixDQUF2QjtBQUVBOEUsWUFBQUEsK0JBQStCLENBQUVQLE1BQU0sQ0FBQ1AsVUFBUCxDQUFrQmtCLEdBQWxCLEVBQUYsQ0FBL0I7QUFDQSxXQVIrQixFQVE3QjlPLEtBUjZCLENBQWhDO0FBU0EsU0FmRDtBQWlCQWtPLFFBQUFBLFNBQVMsQ0FBQzNNLEVBQVYsQ0FBYyxPQUFkLEVBQXVCLFlBQVc7QUFDakMsY0FBTXNOLE1BQU0sR0FBR2xQLENBQUMsQ0FBRSxJQUFGLENBQWhCLENBRGlDLENBR2pDOztBQUNBMkosVUFBQUEsWUFBWSxDQUFFdUYsTUFBTSxDQUFDeE8sSUFBUCxDQUFhLE9BQWIsQ0FBRixDQUFaO0FBRUF3TyxVQUFBQSxNQUFNLENBQUN4TyxJQUFQLENBQWEsT0FBYixFQUFzQnFKLFVBQVUsQ0FBRSxZQUFXO0FBQzVDbUYsWUFBQUEsTUFBTSxDQUFDbEYsVUFBUCxDQUFtQixPQUFuQjtBQUVBLGdCQUFNRSxRQUFRLEdBQUdnRixNQUFNLENBQUMzTCxHQUFQLEVBQWpCO0FBRUFpTCxZQUFBQSxNQUFNLENBQUNQLFVBQVAsQ0FBa0JqQyxHQUFsQixDQUF1QixDQUFFLElBQUYsRUFBUTlCLFFBQVIsQ0FBdkI7QUFFQTZFLFlBQUFBLCtCQUErQixDQUFFUCxNQUFNLENBQUNQLFVBQVAsQ0FBa0JrQixHQUFsQixFQUFGLENBQS9CO0FBQ0EsV0FSK0IsRUFRN0I5TyxLQVI2QixDQUFoQztBQVNBLFNBZkQ7QUFnQkEsT0E5R0Q7QUErR0EsS0FsNEJhO0FBbTRCZCtPLElBQUFBLGNBQWMsRUFBRSwwQkFBVztBQUMxQixVQUFLLENBQUV6QyxNQUFNLEdBQUcwQyxVQUFoQixFQUE2QjtBQUM1QjtBQUNBOztBQUVELFVBQU1DLGdCQUFnQixHQUFHaFAsS0FBSyxDQUFDMEIsSUFBTixDQUFZLG1CQUFaLENBQXpCO0FBRUEsVUFBTXVOLE1BQU0sR0FBVUQsZ0JBQWdCLENBQUNuTyxJQUFqQixDQUF1QixrQkFBdkIsQ0FBdEI7QUFDQSxVQUFNcU8sWUFBWSxHQUFJRixnQkFBZ0IsQ0FBQ25PLElBQWpCLENBQXVCLGdDQUF2QixDQUF0QjtBQUNBLFVBQU1zTyxhQUFhLEdBQUdILGdCQUFnQixDQUFDbk8sSUFBakIsQ0FBdUIsaUNBQXZCLENBQXRCO0FBRUEsVUFBTXVPLEtBQUssR0FBR0osZ0JBQWdCLENBQUN0TixJQUFqQixDQUF1QixrQkFBdkIsQ0FBZDtBQUNBLFVBQU0yTixHQUFHLEdBQUtMLGdCQUFnQixDQUFDdE4sSUFBakIsQ0FBdUIsZ0JBQXZCLENBQWQ7QUFFQTBOLE1BQUFBLEtBQUssQ0FBQ0wsVUFBTixDQUFrQjtBQUNqQk8sUUFBQUEsVUFBVSxFQUFFTCxNQURLO0FBRWpCTSxRQUFBQSxVQUFVLEVBQUVMLFlBRks7QUFHakJNLFFBQUFBLFdBQVcsRUFBRUw7QUFISSxPQUFsQjtBQU1BRSxNQUFBQSxHQUFHLENBQUNOLFVBQUosQ0FBZ0I7QUFDZk8sUUFBQUEsVUFBVSxFQUFFTCxNQURHO0FBRWZNLFFBQUFBLFVBQVUsRUFBRUwsWUFGRztBQUdmTSxRQUFBQSxXQUFXLEVBQUVMO0FBSEUsT0FBaEI7QUFLQSxLQTU1QmE7QUE2NUJkTSxJQUFBQSx1QkFBdUIsRUFBRSxtQ0FBVztBQUNuQztBQUNBLFVBQUssZUFBZSxPQUFPM0QsS0FBM0IsRUFBbUM7QUFDbEM7QUFDQTs7QUFFRCxVQUFLLENBQUVyTSxZQUFZLENBQUMwRyxXQUFwQixFQUFrQztBQUNqQztBQUNBOztBQUVELFVBQU11SixnQkFBZ0IsR0FBRyxDQUFFLEtBQUYsRUFBUyxPQUFULEVBQWtCLFFBQWxCLEVBQTRCLE1BQTVCLENBQXpCO0FBRUFBLE1BQUFBLGdCQUFnQixDQUFDdEosT0FBakIsQ0FBMEIsVUFBVXVKLGVBQVYsRUFBNEI7QUFDckQsWUFBTUMsVUFBVSxHQUFHLHdCQUF3QkQsZUFBM0MsQ0FEcUQsQ0FHckQ7O0FBQ0EsWUFBTUUsU0FBUyxHQUFHL0QsS0FBSyxDQUFFLE1BQU04RCxVQUFOLEdBQW1CLEdBQXJCLEVBQTBCO0FBQ2hEN0QsVUFBQUEsU0FBUyxFQUFFNEQsZUFEcUM7QUFFaEQzRCxVQUFBQSxPQUZnRCxtQkFFdkNDLFNBRnVDLEVBRTNCO0FBQ3BCLG1CQUFPQSxTQUFTLENBQUNDLFlBQVYsQ0FBd0IwRCxVQUF4QixDQUFQO0FBQ0EsV0FKK0M7QUFLaER6RCxVQUFBQSxTQUFTLEVBQUU7QUFMcUMsU0FBMUIsQ0FBdkI7QUFRQXhNLFFBQUFBLE1BQU0sQ0FBQ1ksY0FBUCxHQUF3QkEsY0FBYyxDQUFDdVAsTUFBZixDQUF1QkQsU0FBdkIsQ0FBeEI7QUFDQSxPQWJEO0FBY0EsS0F2N0JhO0FBdzdCZGpKLElBQUFBLElBQUksRUFBRSxnQkFBVztBQUNoQnBHLE1BQUFBLEtBQUssQ0FBQzRMLFlBQU47QUFDQTVMLE1BQUFBLEtBQUssQ0FBQ2tOLGVBQU47QUFDQWxOLE1BQUFBLEtBQUssQ0FBQ3NPLGNBQU47QUFDQXRPLE1BQUFBLEtBQUssQ0FBQ2lQLHVCQUFOO0FBQ0EsS0E3N0JhO0FBODdCZE0sSUFBQUEsWUFBWSxFQUFFLHdCQUFXO0FBQ3hCLFVBQUt0USxZQUFZLENBQUN1USxjQUFiLElBQStCdlEsWUFBWSxDQUFDd1EsV0FBakQsRUFBK0Q7QUFDOUQ1SCxRQUFBQSxPQUFPLENBQUM2SCxZQUFSLENBQXNCO0FBQUUzSCxVQUFBQSxLQUFLLEVBQUU7QUFBVCxTQUF0QixFQUF1QyxFQUF2QyxFQUEyQzVJLE1BQU0sQ0FBQ3VILFFBQWxELEVBRDhELENBRzlEOztBQUNBdkgsUUFBQUEsTUFBTSxDQUFDd1EsZ0JBQVAsQ0FBeUIsVUFBekIsRUFBcUMsVUFBVTVPLENBQVYsRUFBYztBQUNsRCxjQUFLLFNBQVNBLENBQUMsQ0FBQzZPLEtBQVgsSUFBb0I3TyxDQUFDLENBQUM2TyxLQUFGLENBQVFDLGNBQVIsQ0FBd0IsT0FBeEIsQ0FBekIsRUFBNkQ7QUFDNUQ3UCxZQUFBQSxLQUFLLENBQUN1RyxjQUFOLENBQXNCLFVBQXRCO0FBQ0E7QUFDRCxTQUpEO0FBS0E7QUFDRDtBQXo4QmEsR0FBZjtBQTQ4QkE7QUFDRDtBQUNBO0FBQ0E7QUFDQTs7QUFDQyxNQUFLLHVCQUF1QnNCLE9BQTVCLEVBQXNDLENBQ3JDO0FBQ0E7QUFFRCxDQTkrQkMsRUE4K0JDZ0UsTUE5K0JELEVBOCtCUzFNLE1BOStCVCxDQUFGOztBQWcvQkUsV0FBVUQsQ0FBVixFQUFhYyxLQUFiLEVBQXFCO0FBRXRCQSxFQUFBQSxLQUFLLENBQUNvRyxJQUFOO0FBQ0FwRyxFQUFBQSxLQUFLLENBQUN1UCxZQUFOO0FBRUF2UCxFQUFBQSxLQUFLLENBQUNDLHFCQUFOO0FBQ0FELEVBQUFBLEtBQUssQ0FBQ21CLHFCQUFOO0FBQ0FuQixFQUFBQSxLQUFLLENBQUMwQixlQUFOO0FBQ0ExQixFQUFBQSxLQUFLLENBQUMrQix5QkFBTjtBQUVBL0IsRUFBQUEsS0FBSyxDQUFDMkosaUJBQU47QUFDQTNKLEVBQUFBLEtBQUssQ0FBQ2lLLHFCQUFOO0FBQ0FqSyxFQUFBQSxLQUFLLENBQUNnSSx3QkFBTjtBQUNBaEksRUFBQUEsS0FBSyxDQUFDc0osc0JBQU47QUFDQXRKLEVBQUFBLEtBQUssQ0FBQ3NLLGdCQUFOO0FBQ0F0SyxFQUFBQSxLQUFLLENBQUM2SyxvQkFBTjtBQUVBN0ssRUFBQUEsS0FBSyxDQUFDb0wsaUJBQU47QUFFQXBMLEVBQUFBLEtBQUssQ0FBQ3FMLG1CQUFOO0FBRUE7QUFDRDtBQUNBOztBQUNDbk0sRUFBQUEsQ0FBQyxDQUFFLE1BQUYsQ0FBRCxDQUFZNEIsRUFBWixDQUFnQiwrQkFBaEIsRUFBaUQsWUFBVztBQUMzRDtBQUNBNUIsSUFBQUEsQ0FBQyxDQUFFb0csUUFBRixDQUFELENBQWNHLE9BQWQsQ0FBdUIsaUNBQXZCO0FBQ0EsR0FIRDtBQUtBLENBN0JDLEVBNkJDb0csTUE3QkQsRUE2QlMxTSxNQUFNLENBQUNhLEtBN0JoQixDQUFGOzs7QUNsaUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBU2dKLFlBQVQsQ0FBdUI4RyxNQUF2QixFQUErQkMsUUFBL0IsRUFBeUNDLFNBQXpDLEVBQW9EQyxhQUFwRCxFQUFvRTtBQUNuRTtBQUNBSCxFQUFBQSxNQUFNLEdBQUcsQ0FBRUEsTUFBTSxHQUFHLEVBQVgsRUFBZ0JsSSxPQUFoQixDQUF5QixjQUF6QixFQUF5QyxFQUF6QyxDQUFUO0FBRUEsTUFBTXNJLENBQUMsR0FBTSxDQUFFQyxRQUFRLENBQUUsQ0FBQ0wsTUFBSCxDQUFWLEdBQXdCLENBQXhCLEdBQTRCLENBQUNBLE1BQTFDO0FBQ0EsTUFBTU0sSUFBSSxHQUFHLENBQUVELFFBQVEsQ0FBRSxDQUFDSixRQUFILENBQVYsR0FBMEIsQ0FBMUIsR0FBOEJNLElBQUksQ0FBQ0MsR0FBTCxDQUFVUCxRQUFWLENBQTNDO0FBQ0EsTUFBTVEsR0FBRyxHQUFNLE9BQU9OLGFBQVAsS0FBeUIsV0FBM0IsR0FBMkMsR0FBM0MsR0FBaURBLGFBQTlEO0FBQ0EsTUFBTU8sR0FBRyxHQUFNLE9BQU9SLFNBQVAsS0FBcUIsV0FBdkIsR0FBdUMsR0FBdkMsR0FBNkNBLFNBQTFEO0FBRUEsTUFBSVMsQ0FBSjs7QUFFQSxNQUFNQyxVQUFVLEdBQUcsU0FBYkEsVUFBYSxDQUFVUixDQUFWLEVBQWFFLElBQWIsRUFBb0I7QUFDdEMsUUFBTU8sQ0FBQyxHQUFHTixJQUFJLENBQUNPLEdBQUwsQ0FBVSxFQUFWLEVBQWNSLElBQWQsQ0FBVjtBQUNBLFdBQU8sS0FBS0MsSUFBSSxDQUFDUSxLQUFMLENBQVlYLENBQUMsR0FBR1MsQ0FBaEIsSUFBc0JBLENBQWxDO0FBQ0EsR0FIRCxDQVhtRSxDQWdCbkU7OztBQUNBRixFQUFBQSxDQUFDLEdBQUcsQ0FBRUwsSUFBSSxHQUFHTSxVQUFVLENBQUVSLENBQUYsRUFBS0UsSUFBTCxDQUFiLEdBQTJCLEtBQUtDLElBQUksQ0FBQ1EsS0FBTCxDQUFZWCxDQUFaLENBQXRDLEVBQXdEeEYsS0FBeEQsQ0FBK0QsR0FBL0QsQ0FBSjs7QUFFQSxNQUFLK0YsQ0FBQyxDQUFFLENBQUYsQ0FBRCxDQUFPL04sTUFBUCxHQUFnQixDQUFyQixFQUF5QjtBQUN4QitOLElBQUFBLENBQUMsQ0FBRSxDQUFGLENBQUQsR0FBU0EsQ0FBQyxDQUFFLENBQUYsQ0FBRCxDQUFPN0ksT0FBUCxDQUFnQix5QkFBaEIsRUFBMkMySSxHQUEzQyxDQUFUO0FBQ0E7O0FBRUQsTUFBSyxDQUFFRSxDQUFDLENBQUUsQ0FBRixDQUFELElBQVUsRUFBWixFQUFpQi9OLE1BQWpCLEdBQTBCME4sSUFBL0IsRUFBc0M7QUFDckNLLElBQUFBLENBQUMsQ0FBRSxDQUFGLENBQUQsR0FBU0EsQ0FBQyxDQUFFLENBQUYsQ0FBRCxJQUFVLEVBQW5CO0FBQ0FBLElBQUFBLENBQUMsQ0FBRSxDQUFGLENBQUQsSUFBVSxJQUFJSyxLQUFKLENBQVdWLElBQUksR0FBR0ssQ0FBQyxDQUFFLENBQUYsQ0FBRCxDQUFPL04sTUFBZCxHQUF1QixDQUFsQyxFQUFzQ2tJLElBQXRDLENBQTRDLEdBQTVDLENBQVY7QUFDQTs7QUFFRCxTQUFPNkYsQ0FBQyxDQUFDN0YsSUFBRixDQUFRNEYsR0FBUixDQUFQO0FBQ0E7O0FBRUQsU0FBU08sUUFBVCxDQUFtQnRLLEdBQW5CLEVBQXlCO0FBQ3hCLFNBQU9BLEdBQUcsQ0FBQ21CLE9BQUosQ0FBYSxNQUFiLEVBQXFCLEdBQXJCLENBQVA7QUFDQTs7QUFFRCxTQUFTdUQsYUFBVCxDQUF3QjFFLEdBQXhCLEVBQThCO0FBQzdCLE1BQU11SyxLQUFLLEdBQUczUixRQUFRLENBQUVvSCxHQUFHLENBQUNtQixPQUFKLENBQWEsa0JBQWIsRUFBaUMsSUFBakMsQ0FBRixDQUF0Qjs7QUFFQSxNQUFLb0osS0FBTCxFQUFhO0FBQ1p2SyxJQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ21CLE9BQUosQ0FBYSxlQUFiLEVBQThCLEVBQTlCLENBQU47QUFDQTs7QUFFRCxTQUFPbUosUUFBUSxDQUFFdEssR0FBRixDQUFmO0FBQ0EiLCJmaWxlIjoid2MtYWpheC1wcm9kdWN0LWZpbHRlci1wdWJsaWMtc2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIG1haW4ganMgZmlsZS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9wdWJsaWMvc3JjL2pzXG4gKiBAYXV0aG9yICAgICB3cHRvb2xzLmlvXG4gKi9cblxuY29uc3Qgd2NhcGZfcGFyYW1zID0gd2NhcGZfcGFyYW1zIHx8IHtcblx0J2lzX3J0bCc6ICcnLFxuXHQnZmlsdGVyX2lucHV0X2RlbGF5JzogJycsXG5cdCdjaG9zZW5fZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJzogJycsXG5cdCdjaG9zZW5fbm9fcmVzdWx0c190ZXh0JzogJycsXG5cdCdjaG9zZW5fb3B0aW9uc19ub25lX3RleHQnOiAnJyxcblx0J3NlYXJjaF9ib3hfaW5fZGVmYXVsdF9vcmRlcmJ5JzogJycsXG5cdCdwcmVzZXJ2ZV9oaWVyYXJjaHlfYWNjb3JkaW9uX3N0YXRlJzogJycsXG5cdCdwcmVzZXJ2ZV9zb2Z0X2xpbWl0X3N0YXRlJzogJycsXG5cdCdlbmFibGVfYW5pbWF0aW9uX2Zvcl9maWx0ZXJfYWNjb3JkaW9uJzogJycsXG5cdCdmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCc6ICcnLFxuXHQnZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nJzogJycsXG5cdCdlbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uJzogJycsXG5cdCdoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCc6ICcnLFxuXHQnaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nJzogJycsXG5cdCdyZXN0b3JlX2ZvY3VzX2FmdGVyX2ZpbHRlcmluZyc6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9zcGVlZCc6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9lYXNpbmcnOiAnJyxcblx0J2ltbWVkaWF0ZV9zY3JvbGxfb25fcGFnaW5hdGUnOiAnJyxcblx0J2lzX21vYmlsZSc6ICcnLFxuXHQncmVsb2FkX29uX2JhY2snOiAnJyxcblx0J2ZvdW5kX3djYXBmJzogJycsXG5cdCd1cGRhdGVfZG9jdW1lbnRfdGl0bGUnOiAnJyxcblx0J3VzZV90aXBweWpzJzogJycsXG5cdCdzaG9wX2xvb3BfY29udGFpbmVyJzogJycsXG5cdCdub3RfZm91bmRfY29udGFpbmVyJzogJycsXG5cdCdwYWdpbmF0aW9uX2NvbnRhaW5lcic6ICcnLFxuXHQnZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXgnOiAnJyxcblx0J3NvcnRpbmdfY29udHJvbCc6ICcnLFxuXHQnYXR0YWNoX2Nob3Nlbl9vbl9zb3J0aW5nJzogJycsXG5cdCdsb2FkaW5nX2FuaW1hdGlvbic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvdyc6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd19mb3InOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfd2hlbic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudCc6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9vZmZzZXQnOiAnJyxcblx0J2Rpc2FibGVfc2Nyb2xsX2FuaW1hdGlvbic6ICcnLFxuXHQnbW9yZV9zZWxlY3RvcnMnOiAnJyxcblx0J2N1c3RvbV9zY3JpcHRzJzogJycsXG59O1xuXG4oIGZ1bmN0aW9uKCAkLCB3aW5kb3cgKSB7XG5cblx0Y29uc3QgX2RlbGF5ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5maWx0ZXJfaW5wdXRfZGVsYXkgKTtcblx0Y29uc3QgZGVsYXkgID0gX2RlbGF5ID49IDAgPyBfZGVsYXkgOiA4MDA7XG5cblx0Y29uc3QgJGJvZHkgPSAkKCAnYm9keScgKTtcblxuXHRjb25zdCBpbnN0YW5jZUlkcyA9IFtdO1xuXG5cdCQoICcud2NhcGYtZmlsdGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IGlkID0gJCggdGhpcyApLmRhdGEoICdpZCcgKTtcblxuXHRcdGlmICggISBpZCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpbnN0YW5jZUlkcy5wdXNoKCBpZCApO1xuXHR9ICk7XG5cblx0bGV0IGZvY3VzZWRFbG07XG5cblx0d2luZG93LnRpcHB5SW5zdGFuY2VzID0gW107XG5cblx0d2luZG93LldDQVBGID0gd2luZG93LldDQVBGIHx8IHt9O1xuXG5cdHdpbmRvdy5XQ0FQRiA9IHtcblx0XHRoYW5kbGVGaWx0ZXJBY2NvcmRpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgdG9nZ2xlQWNjb3JkaW9uID0gKCAkZWwgKSA9PiB7XG5cdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYWNjb3JkaW9uIGlzIG9wZW5lZFxuXHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLWV4cGFuZGVkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0Ly8gQ2hhbmdlIGFyaWEtZXhwYW5kZWQgdG8gdGhlIG9wcG9zaXRlIHN0YXRlXG5cdFx0XHRcdCRlbC5hdHRyKCAnYXJpYS1leHBhbmRlZCcsICEgcHJlc3NlZCApO1xuXG5cdFx0XHRcdGNvbnN0ICRmaWx0ZXJJbm5lciA9ICRlbC5jbG9zZXN0KCAnLndjYXBmLWZpbHRlcicgKS5jaGlsZHJlbiggJy53Y2FwZi1maWx0ZXItaW5uZXInICk7XG5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX2FuaW1hdGlvbl9mb3JfZmlsdGVyX2FjY29yZGlvbiApIHtcblx0XHRcdFx0XHQkZmlsdGVySW5uZXIuc2xpZGVUb2dnbGUoXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQsXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkZmlsdGVySW5uZXIudG9nZ2xlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdCRib2R5Lm9uKCAnY2xpY2snLCAnLndjYXBmLWZpbHRlci1hY2NvcmRpb24tdHJpZ2dlcicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdCRib2R5Lm9uKCAnY2xpY2snLCAnLndjYXBmLWZpbHRlci10aXRsZS5oYXMtYWNjb3JkaW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0cmlnZ2VyID0gJCggdGhpcyApLmZpbmQoICcud2NhcGYtZmlsdGVyLWFjY29yZGlvbi10cmlnZ2VyJyApO1xuXG5cdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJHRyaWdnZXIgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZUhpZXJhcmNoeVRvZ2dsZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCB0b2dnbGVBY2NvcmRpb24gPSAoICRlbCApID0+IHtcblx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBidXR0b24gaXMgcHJlc3NlZFxuXHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLXByZXNzZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHQvLyBDaGFuZ2UgYXJpYS1wcmVzc2VkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuXHRcdFx0XHQkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICEgcHJlc3NlZCApO1xuXG5cdFx0XHRcdGNvbnN0ICRjaGlsZCA9ICRlbC5jbG9zZXN0KCAnbGknICkuY2hpbGRyZW4oICd1bCcgKTtcblxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uICkge1xuXHRcdFx0XHRcdCRjaGlsZC5zbGlkZVRvZ2dsZShcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5oaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCxcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5oaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmdcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRjaGlsZC50b2dnbGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0JGJvZHlcblx0XHRcdFx0Lm9uKCAnY2xpY2snLCAnLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkKCB0aGlzICkgKTtcblx0XHRcdFx0fSApXG5cdFx0XHRcdC5vbiggJ2tleWRvd24nLCAnLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0aWYgKCBlLmtleSA9PT0gJyAnIHx8IGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnU3BhY2ViYXInICkge1xuXHRcdFx0XHRcdFx0Ly8gUHJldmVudCB0aGUgZGVmYXVsdCBhY3Rpb24gdG8gc3RvcCBzY3JvbGxpbmcgd2hlbiBzcGFjZSBpcyBwcmVzc2VkXG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVTb2Z0TGltaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgdG9nZ2xlRmlsdGVyT3B0aW9ucyA9ICggJGVsICkgPT4ge1xuXHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGJ1dHRvbiBpcyBwcmVzc2VkXG5cdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdC8vIENoYW5nZSBhcmlhLXByZXNzZWQgdG8gdGhlIG9wcG9zaXRlIHN0YXRlXG5cdFx0XHRcdCRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJywgISBwcmVzc2VkICk7XG5cblx0XHRcdFx0Y29uc3QgJGxpc3RXcmFwcGVyID0gJGVsLmNsb3Nlc3QoICcud2NhcGYtbGlzdC13cmFwcGVyJyApO1xuXG5cdFx0XHRcdGlmICggcHJlc3NlZCApIHtcblx0XHRcdFx0XHQkbGlzdFdyYXBwZXIucmVtb3ZlQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRsaXN0V3JhcHBlci5hZGRDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdCRib2R5XG5cdFx0XHRcdC5vbiggJ2NsaWNrJywgJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0b2dnbGVGaWx0ZXJPcHRpb25zKCAkKCB0aGlzICkgKTtcblx0XHRcdFx0fSApXG5cdFx0XHRcdC5vbiggJ2tleWRvd24nLCAnLndjYXBmLXNvZnQtbGltaXQtdHJpZ2dlcicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdGlmICggZS5rZXkgPT09ICcgJyB8fCBlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJ1NwYWNlYmFyJyApIHtcblx0XHRcdFx0XHRcdC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgYWN0aW9uIHRvIHN0b3Agc2Nyb2xsaW5nIHdoZW4gc3BhY2UgaXMgcHJlc3NlZFxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0XHR0b2dnbGVGaWx0ZXJPcHRpb25zKCAkKCB0aGlzICkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZVNlYXJjaEZpbHRlck9wdGlvbnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdpbnB1dCcsICcud2NhcGYtc2VhcmNoLWJveCBpbnB1dFt0eXBlPVwidGV4dFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkdGhhdCAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCAkaW5uZXIgID0gJHRoYXQuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXItaW5uZXInICk7XG5cdFx0XHRcdGNvbnN0ICRmaWx0ZXIgPSAkaW5uZXIuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXInICk7XG5cblx0XHRcdFx0Y29uc3Qgc29mdExpbWl0RW5hYmxlZCA9ICRmaWx0ZXIuaGFzQ2xhc3MoICdoYXMtc29mdC1saW1pdCcgKTtcblx0XHRcdFx0Y29uc3Qgc29mdExpbWl0VG9nZ2xlICA9ICRmaWx0ZXIuZmluZCggJy53Y2FwZi1zb2Z0LWxpbWl0LXdyYXBwZXInICk7XG5cdFx0XHRcdGNvbnN0IG5vUmVzdWx0cyAgICAgICAgPSAkZmlsdGVyLmZpbmQoICcud2NhcGYtbm8tcmVzdWx0cy10ZXh0JyApO1xuXHRcdFx0XHRjb25zdCB2aXNpYmxlT3B0aW9ucyAgID0gcGFyc2VJbnQoICRmaWx0ZXIuYXR0ciggJ2RhdGEtdmlzaWJsZS1vcHRpb25zJyApICk7XG5cblx0XHRcdFx0Y29uc3Qga2V5d29yZCA9ICR0aGF0LnZhbCgpO1xuXG5cdFx0XHRcdGlmICggISBrZXl3b3JkLmxlbmd0aCApIHtcblx0XHRcdFx0XHRsZXQgaW5kZXggPSAwO1xuXHRcdFx0XHRcdCRmaWx0ZXIucmVtb3ZlQ2xhc3MoICdzZWFyY2gtYWN0aXZlJyApO1xuXG5cdFx0XHRcdFx0JC5lYWNoKCAkaW5uZXIuZmluZCggJy53Y2FwZi1maWx0ZXItb3B0aW9ucyA+IGxpJyApLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGluZGV4Kys7XG5cblx0XHRcdFx0XHRcdGNvbnN0ICRmaWx0ZXJJdGVtID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICdrZXl3b3JkLW1hdGNoZWQnICk7XG5cblx0XHRcdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCBpbmRleCA+IHZpc2libGVPcHRpb25zICkge1xuXHRcdFx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLmFkZENsYXNzKCAnd2NhcGYtZmlsdGVyLW9wdGlvbi1oaWRkZW4nICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRcdHNvZnRMaW1pdFRvZ2dsZS5yZW1vdmVBdHRyKCAnc3R5bGUnICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bm9SZXN1bHRzLmNoaWxkcmVuKCAnc3BhbicgKS50ZXh0KCAnJyApO1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5oaWRlKCk7XG5cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgaW5kZXggPSAwO1xuXHRcdFx0XHQkZmlsdGVyLmFkZENsYXNzKCAnc2VhcmNoLWFjdGl2ZScgKTtcblxuXHRcdFx0XHQkLmVhY2goICRpbm5lci5maW5kKCAnLndjYXBmLWZpbHRlci1vcHRpb25zID4gbGknICksIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0ICRmaWx0ZXJJdGVtID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdGNvbnN0IGxhYmVsICAgICAgID0gJGZpbHRlckl0ZW0uZmluZCggJy53Y2FwZi1maWx0ZXItaXRlbS1sYWJlbCcgKS5kYXRhKCAnbGFiZWwnICk7XG5cblx0XHRcdFx0XHRpZiAoIGxhYmVsLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygga2V5d29yZC50b0xvd2VyQ2FzZSgpICkgKSB7XG5cdFx0XHRcdFx0XHRpbmRleCsrO1xuXG5cdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5hZGRDbGFzcyggJ2tleXdvcmQtbWF0Y2hlZCcgKTtcblxuXHRcdFx0XHRcdFx0aWYgKCBzb2Z0TGltaXRFbmFibGVkICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIGluZGV4ID4gdmlzaWJsZU9wdGlvbnMgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0uYWRkQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5yZW1vdmVDbGFzcyggJ3djYXBmLWZpbHRlci1vcHRpb24taGlkZGVuJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLnJlbW92ZUNsYXNzKCAna2V5d29yZC1tYXRjaGVkJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRpZiAoIGluZGV4IDw9IHZpc2libGVPcHRpb25zICkge1xuXHRcdFx0XHRcdFx0c29mdExpbWl0VG9nZ2xlLmhpZGUoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c29mdExpbWl0VG9nZ2xlLnNob3coKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIDAgPT09IGluZGV4ICkge1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5jaGlsZHJlbiggJ3NwYW4nICkudGV4dCgga2V5d29yZCApO1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bm9SZXN1bHRzLmNoaWxkcmVuKCAnc3BhbicgKS50ZXh0KCAnJyApO1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdHVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQ6IGZ1bmN0aW9uKCAkcmVzcG9uc2UgKSB7XG5cdFx0XHRjb25zdCAkY29udGFpbmVyID0gJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdGNvbnN0IHNlbGVjdG9yICAgPSAnLndvb2NvbW1lcmNlLXJlc3VsdC1jb3VudCc7XG5cdFx0XHRjb25zdCBuZXdDb3VudCAgID0gJHJlc3BvbnNlLmZpbmQoIHNlbGVjdG9yICkuaHRtbCgpO1xuXG5cdFx0XHQkYm9keS5maW5kKCBzZWxlY3RvciApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkZWwgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0aWYgKCAhICRjb250YWluZXIuaGFzKCAkZWwgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0JGVsLmh0bWwoIG5ld0NvdW50ICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdHNjcm9sbFRvOiBmdW5jdGlvbiggdHJpZ2dlcmVkQnkgKSB7XG5cdFx0XHRpZiAoICdub25lJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgYWxsb3dlZCAgICA9IFtdO1xuXHRcdFx0Y29uc3Qgc2Nyb2xsV2hlbiA9IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X3doZW47XG5cblx0XHRcdGlmICggJ2FsbCcgPT09IHNjcm9sbFdoZW4gKSB7XG5cdFx0XHRcdGFsbG93ZWQucHVzaCggJ2ZpbHRlcicgKTtcblx0XHRcdFx0YWxsb3dlZC5wdXNoKCAncGFnaW5hdGUnICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhbGxvd2VkLnB1c2goIHNjcm9sbFdoZW4gKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhIGFsbG93ZWQuaW5jbHVkZXMoIHRyaWdnZXJlZEJ5ICkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc2Nyb2xsRm9yID0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfZm9yO1xuXHRcdFx0Y29uc3QgaXNNb2JpbGUgID0gd2NhcGZfcGFyYW1zLmlzX21vYmlsZTtcblx0XHRcdGxldCBwcm9jZWVkICAgICA9IGZhbHNlO1xuXG5cdFx0XHRpZiAoICdtb2JpbGUnID09PSBzY3JvbGxGb3IgJiYgaXNNb2JpbGUgKSB7XG5cdFx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmICggJ2Rlc2t0b3AnID09PSBzY3JvbGxGb3IgJiYgISBpc01vYmlsZSApIHtcblx0XHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0XHR9IGVsc2UgaWYgKCAnYm90aCcgPT09IHNjcm9sbEZvciApIHtcblx0XHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISBwcm9jZWVkICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCBhZGp1c3RpbmdPZmZzZXQsIG9mZnNldDtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKSB7XG5cdFx0XHRcdGFkanVzdGluZ09mZnNldCA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGNvbnRhaW5lcjtcblxuXHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXI7XG5cdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXI7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggJ2N1c3RvbScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93ICkge1xuXHRcdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudDtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIGNvbnRhaW5lciApO1xuXG5cdFx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRvZmZzZXQgPSAkY29udGFpbmVyLm9mZnNldCgpLnRvcCAtIGFkanVzdGluZ09mZnNldDtcblxuXHRcdFx0XHRpZiAoIG9mZnNldCA8IDAgKSB7XG5cdFx0XHRcdFx0b2Zmc2V0ID0gMDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmRpc2FibGVfc2Nyb2xsX2FuaW1hdGlvbiApIHtcblx0XHRcdFx0XHR3aW5kb3cuc2Nyb2xsVG8oIHsgdG9wOiBvZmZzZXQgfSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCQoICdodG1sLCBib2R5JyApLnN0b3AoKS5hbmltYXRlKFxuXHRcdFx0XHRcdFx0eyBzY3JvbGxUb3A6IG9mZnNldCB9LFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfc3BlZWQsXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9lYXNpbmdcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvLyBUaGluZ3MgYXJlIGRvbmUgYmVmb3JlIGZldGNoaW5nIHRoZSBwcm9kdWN0cyBsaWtlIHNob3dpbmcgdGhlIGxvYWRpbmcgaW5kaWNhdG9yLlxuXHRcdGJlZm9yZUZldGNoaW5nUHJvZHVjdHM6IGZ1bmN0aW9uKCB0cmlnZ2VyZWRCeSApIHtcblx0XHRcdC8vIFRyYWNrIHRoZSBjdXJyZW50IGVsZW1lbnQgZm9jdXMuXG5cdFx0XHRmb2N1c2VkRWxtID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcblxuXHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1sb2FkZXInICkuYWRkQ2xhc3MoICdpcy1hY3RpdmUnICk7XG5cblx0XHRcdC8vIFNjcm9sbCBpbnRvIHZpZXcgb24gcGFnaW5hdGUuXG5cdFx0XHRpZiAoICdwYWdpbmF0ZScgPT09IHRyaWdnZXJlZEJ5ICYmIHdjYXBmX3BhcmFtcy5pbW1lZGlhdGVfc2Nyb2xsX29uX3BhZ2luYXRlICkge1xuXHRcdFx0XHRXQ0FQRi5zY3JvbGxUbyggdHJpZ2dlcmVkQnkgKTtcblx0XHRcdH1cblxuXHRcdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2JlZm9yZV9mZXRjaGluZ19wcm9kdWN0cycsIFsgdHJpZ2dlcmVkQnkgXSApO1xuXHRcdH0sXG5cdFx0ZGVzdHJveVRpcHB5SW5zdGFuY2VzOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnVzZV90aXBweWpzICkge1xuXHRcdFx0XHQvLyBAc291cmNlIGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9taWtzL3RpcHB5anMvaXNzdWVzLzQ3M1xuXHRcdFx0XHR0aXBweUluc3RhbmNlcy5mb3JFYWNoKCBpbnN0YW5jZSA9PiB7XG5cdFx0XHRcdFx0aW5zdGFuY2UuZGVzdHJveSgpO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHRcdHRpcHB5SW5zdGFuY2VzLmxlbmd0aCA9IDA7IC8vIGNsZWFyIGl0XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvLyBUaGluZ3MgYXJlIGRvbmUgYmVmb3JlIHVwZGF0aW5nIHRoZSBwcm9kdWN0cyBsaWtlIGhpZGluZyB0aGUgbG9hZGluZyBpbmRpY2F0b3IuXG5cdFx0YmVmb3JlVXBkYXRpbmdQcm9kdWN0czogZnVuY3Rpb24oICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgKSB7XG5cdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLWxvYWRlcicgKS5yZW1vdmVDbGFzcyggJ2lzLWFjdGl2ZScgKTtcblxuXHRcdFx0Ly8gTWF5YmUgZ29vZCBmb3IgcGVyZm9ybWFuY2UuXG5cdFx0XHRXQ0FQRi5kZXN0cm95VGlwcHlJbnN0YW5jZXMoKTtcblxuXHRcdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2JlZm9yZV91cGRhdGluZ19wcm9kdWN0cycsIFsgJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSBdICk7XG5cdFx0fSxcblx0XHRhZnRlclVwZGF0aW5nUHJvZHVjdHM6IGZ1bmN0aW9uKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICkge1xuXHRcdFx0V0NBUEYudXBkYXRlUHJvZHVjdHNDb3VudFJlc3VsdCggJHJlc3BvbnNlICk7XG5cblx0XHRcdC8vIFJlc3RvcmUgdGhlIGZvY3VzIChNYXliZSByZXN0b3JpbmcgdGhlIGZvY3VzIGluIG1vYmlsZSBkZXZpY2UgaXNuJ3QgZ29vZCkuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5yZXN0b3JlX2ZvY3VzX2FmdGVyX2ZpbHRlcmluZyAmJiAhIHdjYXBmX3BhcmFtcy5pc19tb2JpbGUgKSB7XG5cdFx0XHRcdGlmICggZG9jdW1lbnQuYm9keSAhPT0gZm9jdXNlZEVsbSApIHtcblx0XHRcdFx0XHRpZiAoIGZvY3VzZWRFbG0uaWQgKSB7XG5cdFx0XHRcdFx0XHQkKCBgIyR7IGZvY3VzZWRFbG0uaWQgfWAgKS5mb2N1cygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZWluaXRpYWxpemUgd2NhcGYuXG5cdFx0XHRXQ0FQRi5pbml0KCk7XG5cblx0XHRcdC8vIFNjcm9sbCBpbnRvIHZpZXcuXG5cdFx0XHRpZiAoICdwYWdpbmF0ZScgPT09IHRyaWdnZXJlZEJ5ICYmIHdjYXBmX3BhcmFtcy5pbW1lZGlhdGVfc2Nyb2xsX29uX3BhZ2luYXRlICkge1xuXHRcdFx0XHQvLyBEbyBub3RoaW5nIGJlY2F1c2UgaXQgYWxyZWFkeSBoYXBwZW5lZC5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFdDQVBGLnNjcm9sbFRvKCB0cmlnZ2VyZWRCeSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUcmlnZ2VyIGV2ZW50cy5cblx0XHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggJ3JlYWR5JyApO1xuXHRcdFx0JCggd2luZG93ICkudHJpZ2dlciggJ3Njcm9sbCcgKTtcblx0XHRcdCQoIHdpbmRvdyApLnRyaWdnZXIoICdyZXNpemUnICk7XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmN1c3RvbV9zY3JpcHRzICkge1xuXHRcdFx0XHRldmFsKCB3Y2FwZl9wYXJhbXMuY3VzdG9tX3NjcmlwdHMgKTtcblx0XHRcdH1cblxuXHRcdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2FmdGVyX3VwZGF0aW5nX3Byb2R1Y3RzJywgWyAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5IF0gKTtcblx0XHR9LFxuXHRcdGZpbHRlclByb2R1Y3RzOiBmdW5jdGlvbiggdHJpZ2dlcmVkQnkgPSAnZmlsdGVyJyApIHtcblx0XHRcdFdDQVBGLmJlZm9yZUZldGNoaW5nUHJvZHVjdHMoIHRyaWdnZXJlZEJ5ICk7XG5cblx0XHRcdCQuYWpheCgge1xuXHRcdFx0XHR1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHRcdFx0Y29uc3QgJHJlc3BvbnNlID0gJCggcmVzcG9uc2UgKTtcblxuXHRcdFx0XHRcdFdDQVBGLmJlZm9yZVVwZGF0aW5nUHJvZHVjdHMoICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgKTtcblxuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIFVwZGF0ZSBkb2N1bWVudCB0aXRsZS5cblx0XHRcdFx0XHQgKlxuXHRcdFx0XHRcdCAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzc1OTk1NjJcblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy51cGRhdGVfZG9jdW1lbnRfdGl0bGUgKSB7XG5cdFx0XHRcdFx0XHRkb2N1bWVudC50aXRsZSA9ICRyZXNwb25zZS5maWx0ZXIoICd0aXRsZScgKS50ZXh0KCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBpbnN0YW5jZXMuXG5cdFx0XHRcdFx0Zm9yICggY29uc3QgaWQgb2YgaW5zdGFuY2VJZHMgKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBpbnN0YW5jZUlkID0gJ1tkYXRhLWlkPVwiJyArIGlkICsgJ1wiXSc7XG5cdFx0XHRcdFx0XHRjb25zdCAkaW5zdGFuY2UgID0gJCggaW5zdGFuY2VJZCApO1xuXHRcdFx0XHRcdFx0Y29uc3QgJGlubmVyICAgICA9ICRpbnN0YW5jZS5maW5kKCAnLndjYXBmLWZpbHRlci1pbm5lcicgKTtcblx0XHRcdFx0XHRcdGNvbnN0IF9pbnN0YW5jZSAgPSAkcmVzcG9uc2UuZmluZCggaW5zdGFuY2VJZCApO1xuXG5cdFx0XHRcdFx0XHQvLyBQcmVzZXJ2ZSBoaWVyYXJjaHkgYWNjb3JkaW9uIHN0YXRlLlxuXHRcdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkaW5zdGFuY2UuaGFzQ2xhc3MoICdoYXMtaGllcmFyY2h5LWFjY29yZGlvbicgKSApIHtcblx0XHRcdFx0XHRcdFx0XHQkaW5zdGFuY2UuZmluZCggJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0ICRlbCA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IGlkICA9ICRlbC5kYXRhKCAnaWQnICk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHRvZ2dsZVNlbGVjdG9yID0gYC53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZVtkYXRhLWlkPVwiJHsgaWQgfVwiXWA7XG5cblx0XHRcdFx0XHRcdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYWNjb3JkaW9uIGlzIG9wZW5lZFxuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGlmICggcHJlc3NlZCApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICd0cnVlJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5jbG9zZXN0KCAnbGknICkuY2hpbGRyZW4oICd1bCcgKS5zaG93KCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5hdHRyKCAnYXJpYS1wcmVzc2VkJywgJ2ZhbHNlJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5jbG9zZXN0KCAnbGknICkuY2hpbGRyZW4oICd1bCcgKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIFByZXNlcnZlIHNvZnQgbGltaXQgc3RhdGUuXG5cdFx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5wcmVzZXJ2ZV9zb2Z0X2xpbWl0X3N0YXRlICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRpbnN0YW5jZS5oYXNDbGFzcyggJ2hhcy1zb2Z0LWxpbWl0JyApICkge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0ICRsaXN0V3JhcHBlciA9ICRpbnN0YW5jZS5maW5kKCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKTtcblxuXHRcdFx0XHRcdFx0XHRcdGlmICggJGxpc3RXcmFwcGVyLmhhc0NsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKS5hZGRDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICd0cnVlJyApO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1saXN0LXdyYXBwZXInICkucmVtb3ZlQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJyApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAnZmFsc2UnICk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGNvbnN0IF9odG1sID0gX2luc3RhbmNlLmZpbmQoICcud2NhcGYtZmlsdGVyLWlubmVyJyApLmh0bWwoKTtcblxuXHRcdFx0XHRcdFx0Ly8gRmluYWxseSB1cGRhdGUgdGhlIGluc3RhbmNlLlxuXHRcdFx0XHRcdFx0JGlubmVyLmh0bWwoIF9odG1sICk7XG5cblx0XHRcdFx0XHRcdCRpbnN0YW5jZS50cmlnZ2VyKCAnd2NhcGYtZmlsdGVyLXVwZGF0ZWQnLCBbIF9pbnN0YW5jZSBdICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBhY3RpdmUgZmlsdGVycyBhbmQgcmVzZXQgZmlsdGVycy5cblx0XHRcdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLWFjdGl2ZS1maWx0ZXJzLCAud2NhcGYtcmVzZXQtZmlsdGVycycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGNvbnN0ICR0aGF0ICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0XHRjb25zdCBpbnN0YW5jZUlkID0gJ1tkYXRhLWlkPVwiJyArICR0aGF0LmRhdGEoICdpZCcgKSArICdcIl0nO1xuXG5cdFx0XHRcdFx0XHQkdGhhdC5odG1sKCAkcmVzcG9uc2UuZmluZCggaW5zdGFuY2VJZCApLmh0bWwoKSApO1xuXHRcdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRcdC8vIFJlcGxhY2Ugb2xkIHNob3AgbG9vcCB3aXRoIG5ldyBvbmUuXG5cdFx0XHRcdFx0Y29uc3QgJHNob3BMb29wQ29udGFpbmVyID0gJHJlc3BvbnNlLmZpbmQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRcdFx0Y29uc3QgJG5vdEZvdW5kQ29udGFpbmVyID0gJHJlc3BvbnNlLmZpbmQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICk7XG5cblx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyID09PSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRXQ0FQRi5hZnRlclVwZGF0aW5nUHJvZHVjdHMoICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0cmVxdWVzdEZpbHRlcjogZnVuY3Rpb24oIHVybCwgdHJpZ2dlcmVkQnkgPSAnZmlsdGVyJyApIHtcblx0XHRcdGlmICggISB1cmwgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaG9zdG5hbWUgPSBsb2NhdGlvbi5ob3N0bmFtZTtcblxuXHRcdFx0Ly8gVE9ETzogUmVtb3ZlIGZyb20gcHJvZHVjdGlvbiBidWlsZC5cblx0XHRcdGlmICggJ2xvY2FsaG9zdCcgPT09IGhvc3RuYW1lICkge1xuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSggJ2h0dHA6Ly93Y2ZpbHRlci0yLnRlc3QnLCAnLy9sb2NhbGhvc3Q6MzAwMScgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gd2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmw7XG5cblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7IHdjYXBmOiB0cnVlIH0sICcnLCB1cmwgKTtcblxuXHRcdFx0V0NBUEYuZmlsdGVyUHJvZHVjdHMoIHRyaWdnZXJlZEJ5ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVOdW1iZXJJbnB1dEZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgcmFuZ2VOdW1iZXJTZWxlY3RvcnMgPSAnLndjYXBmLXJhbmdlLW51bWJlciAubWluLXZhbHVlLCAud2NhcGYtcmFuZ2UtbnVtYmVyIC5tYXgtdmFsdWUnO1xuXG5cdFx0XHQkYm9keS5vbiggJ2lucHV0JywgcmFuZ2VOdW1iZXJTZWxlY3RvcnMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRjb25zdCAkcmFuZ2VOdW1iZXIgICAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtcmFuZ2UtbnVtYmVyJyApO1xuXHRcdFx0XHRjb25zdCBmb3JtYXROdW1iZXJzICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1mb3JtYXQtbnVtYmVycycgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBvbGRNaW5WYWx1ZSAgICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgb2xkTWF4VmFsdWUgICAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWRlY2ltYWwtcGxhY2VzJyApO1xuXHRcdFx0XHRjb25zdCB0aG91c2FuZFNlcGFyYXRvciA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS10aG91c2FuZC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdGNvbnN0IGdldFZhbHVlID0gKCBmbG9hdFZhbHVlICkgPT4ge1xuXHRcdFx0XHRcdGlmICggZm9ybWF0TnVtYmVycyApIHtcblx0XHRcdFx0XHRcdHJldHVybiBudW1iZXJGb3JtYXQoIGZsb2F0VmFsdWUsIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIGZsb2F0VmFsdWU7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0bGV0IG1pblZhbHVlID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCgpICk7XG5cdFx0XHRcdFx0bGV0IG1heFZhbHVlID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCgpICk7XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0XHRcdGlmICggaXNOYU4oIG1pblZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdFx0XHRpZiAoIGlzTmFOKCBtYXhWYWx1ZSApICkge1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gYmVsb3cgdGhlIHJhbmdlTWluVmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA8IHJhbmdlTWluVmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID4gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0XHRcdGlmICggbWF4VmFsdWUgPiByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gZ28gYmVsb3cgdGhlIG1pblZhbHVlLlxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPiBtYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gbWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gSWYgdmFsdWUgaXMgbm90IGNoYW5nZWQgdGhlbiBkb24ndCBwcm9jZWVkLlxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPT09IG9sZE1pblZhbHVlICYmIG1heFZhbHVlID09PSBvbGRNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIG1heFZhbHVlID09PSByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0Ly8gUmVtb3ZlIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICRyYW5nZU51bWJlci5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBBZGQgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0Y29uc3QgdXJsID0gJHJhbmdlTnVtYmVyLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIG1pblZhbHVlICkucmVwbGFjZSggJyUycycsIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZURhdGVJbnB1dEZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCAnLndjYXBmLWRhdGUtaW5wdXQgLmRhdGUtaW5wdXQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGZpbHRlciA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWRhdGUtaW5wdXQnICk7XG5cdFx0XHRcdGNvbnN0IGlzUmFuZ2UgPSAkZmlsdGVyLmRhdGEoICdpcy1yYW5nZScgKTtcblxuXHRcdFx0XHRsZXQgZmlsdGVyVXJsID0gJyc7XG5cblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGZpbHRlci5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRpZiAoIGlzUmFuZ2UgKSB7XG5cdFx0XHRcdFx0Y29uc3QgZnJvbSA9ICRmaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICkudmFsKCk7XG5cdFx0XHRcdFx0Y29uc3QgdG8gICA9ICRmaWx0ZXIuZmluZCggJy5kYXRlLXRvLWlucHV0JyApLnZhbCgpO1xuXG5cdFx0XHRcdFx0aWYgKCBmcm9tICYmIHRvICkge1xuXHRcdFx0XHRcdFx0ZmlsdGVyVXJsID0gJGZpbHRlci5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclMXMnLCBmcm9tICkucmVwbGFjZSggJyUycycsIHRvICk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggISBmcm9tICYmICEgdG8gKSB7XG5cdFx0XHRcdFx0XHRmaWx0ZXJVcmwgPSAkZmlsdGVyLmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zdCBmcm9tID0gJGZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKS52YWwoKTtcblxuXHRcdFx0XHRcdGlmICggZnJvbSApIHtcblx0XHRcdFx0XHRcdGZpbHRlclVybCA9ICRmaWx0ZXIuZGF0YSggJ3VybCcgKS5yZXBsYWNlKCAnJXMnLCBmcm9tICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGZpbHRlclVybCA9ICRmaWx0ZXIuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBmaWx0ZXJVcmwgKSB7XG5cdFx0XHRcdFx0JGZpbHRlci5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCRmaWx0ZXIucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCBmaWx0ZXJVcmwgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZUxpc3RGaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IG5hdGl2ZUlucHV0cyA9ICcubGlzdC10eXBlLW5hdGl2ZSBbdHlwZT1cImNoZWNrYm94XCJdLCcgK1xuXHRcdFx0XHQnLmxpc3QtdHlwZS1uYXRpdmUgW3R5cGU9XCJyYWRpb1wiXSwnICtcblx0XHRcdFx0Jy5saXN0LXR5cGUtY3VzdG9tLWNoZWNrYm94IFt0eXBlPVwiY2hlY2tib3hcIl0nO1xuXG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsIG5hdGl2ZUlucHV0cywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZpbHRlci1pdGVtJyApLnRvZ2dsZUNsYXNzKCAnaXRlbS1hY3RpdmUnICk7XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJCggdGhpcyApLmRhdGEoICd1cmwnICkgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Y29uc3QgY3VzdG9tUmFkaW9TZWxlY3RvciA9ICcubGlzdC10eXBlLWN1c3RvbS1yYWRpbyc7XG5cblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgY3VzdG9tUmFkaW9TZWxlY3RvciArICcgW3R5cGU9XCJjaGVja2JveFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXItaXRlbScgKS50b2dnbGVDbGFzcyggJ2l0ZW0tYWN0aXZlJyApO1xuXG5cdFx0XHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81ODM5OTI0XG5cdFx0XHRcdCQoIHRoaXMgKVxuXHRcdFx0XHRcdC5jbG9zZXN0KCBjdXN0b21SYWRpb1NlbGVjdG9yIClcblx0XHRcdFx0XHQuZmluZCggJy53Y2FwZi1maWx0ZXItaXRlbS5pdGVtLWFjdGl2ZSBbdHlwZT1cImNoZWNrYm94XCJdJyApXG5cdFx0XHRcdFx0Lm5vdCggdGhpcyApXG5cdFx0XHRcdFx0LnByb3AoICdjaGVja2VkJywgZmFsc2UgKVxuXHRcdFx0XHRcdC5jbG9zZXN0KCAnLndjYXBmLWZpbHRlci1pdGVtJyApXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCAnaXRlbS1hY3RpdmUnICk7XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJCggdGhpcyApLmRhdGEoICd1cmwnICkgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZURyb3Bkb3duRmlsdGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsICcud2NhcGYtZHJvcGRvd24td3JhcHBlciBzZWxlY3QnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHNlbGVjdCAgICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IHZhbHVlcyAgICAgICAgID0gJHNlbGVjdC52YWwoKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyVVJMICAgICAgPSAkc2VsZWN0LmRhdGEoICd1cmwnICk7XG5cdFx0XHRcdGNvbnN0IGNsZWFyRmlsdGVyVVJMID0gJHNlbGVjdC5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKTtcblx0XHRcdFx0bGV0IHVybDtcblxuXHRcdFx0XHRpZiAoIHZhbHVlcy5sZW5ndGggKSB7XG5cdFx0XHRcdFx0dXJsID0gZmlsdGVyVVJMLnJlcGxhY2UoICclcycsIHZhbHVlcy50b1N0cmluZygpICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dXJsID0gY2xlYXJGaWx0ZXJVUkw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZVBhZ2luYXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXggJiYgd2NhcGZfcGFyYW1zLnBhZ2luYXRpb25fY29udGFpbmVyICkge1xuXHRcdFx0XHRjb25zdCAkY29udGFpbmVyID0gJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdFx0Y29uc3QgX3NlbGVjdG9ycyA9IHdjYXBmX3BhcmFtcy5wYWdpbmF0aW9uX2NvbnRhaW5lci5zcGxpdCggJywnICk7XG5cdFx0XHRcdGNvbnN0IHNlbGVjdG9ycyAgPSBbXTtcblxuXHRcdFx0XHRfc2VsZWN0b3JzLmZvckVhY2goIHNlbGVjdG9yID0+IHtcblx0XHRcdFx0XHRpZiAoIHNlbGVjdG9yICkge1xuXHRcdFx0XHRcdFx0c2VsZWN0b3JzLnB1c2goIHNlbGVjdG9yICsgJyBhJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGNvbnN0IHNlbGVjdG9yID0gc2VsZWN0b3JzLmpvaW4oICcsJyApO1xuXG5cdFx0XHRcdGlmICggJGNvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0JGNvbnRhaW5lci5vbiggJ2NsaWNrJywgc2VsZWN0b3IsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBocmVmID0gJCggdGhpcyApLmF0dHIoICdocmVmJyApO1xuXG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCBocmVmLCAncGFnaW5hdGUnICk7XG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRoYW5kbGVEZWZhdWx0T3JkZXJieTogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLnNvcnRpbmdfY29udHJvbCApIHtcblx0XHRcdFx0Ly8gU3VibWl0IHRoZSBvcmRlcmJ5IGZvcm0gd2hlbiB2YWx1ZSBpcyBjaGFuZ2VkLlxuXHRcdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsICcud29vY29tbWVyY2Utb3JkZXJpbmcgc2VsZWN0Lm9yZGVyYnknLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKCB0aGlzICkuY2xvc2VzdCggJ2Zvcm0nICkudHJpZ2dlciggJ3N1Ym1pdCcgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUHJldmVudCB0aGUgYXV0byBzdWJtaXNzaW9uIG9mIHRoZSBvcmRlcmJ5IGZvcm0uXG5cdFx0XHQkYm9keS5vbiggJ3N1Ym1pdCcsICcud29vY29tbWVyY2Utb3JkZXJpbmcnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IHZpYSBhamF4IHdoZW4gdGhlIG9yZGVyYnkgdmFsdWUgaXMgY2hhbmdlZC5cblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgJy53b29jb21tZXJjZS1vcmRlcmluZyBzZWxlY3Qub3JkZXJieScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBvcmRlciA9ICQoIHRoaXMgKS52YWwoKTtcblxuXHRcdFx0XHRjb25zdCB1cmwgPSBuZXcgVVJMKCB3aW5kb3cubG9jYXRpb24gKTtcblx0XHRcdFx0dXJsLnNlYXJjaFBhcmFtcy5zZXQoICdvcmRlcmJ5Jywgb3JkZXIgKTtcblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCBnZXRPcmRlckJ5VXJsKCB1cmwuaHJlZiApICk7XG5cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlQ2xlYXJGaWx0ZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtZmlsdGVyLWNsZWFyLWJ0bicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5hdHRyKCAnZGF0YS1jbGVhci1maWx0ZXItdXJsJyApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVGaWx0ZXJUb29sdGlwOiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRSZWZlcmVuY2Vcblx0XHRcdGlmICggJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHRpcHB5ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMudXNlX3RpcHB5anMgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZFJlZmVyZW5jZVxuXHRcdFx0dGlwcHkoICcud2NhcGYtZmlsdGVyLXRvb2x0aXAnLCB7XG5cdFx0XHRcdHBsYWNlbWVudDogJ3RvcCcsXG5cdFx0XHRcdGNvbnRlbnQoIHJlZmVyZW5jZSApIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSggJ2RhdGEtY29udGVudCcgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0YWxsb3dIVE1MOiB0cnVlLFxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aW5pdENvbWJvYm94OiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggISBqUXVlcnkoKS5jaG9zZW5XQ0FQRiApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB0ZW1wbGF0ZVJlc3VsdCA9ICggdGV4dCwgZGF0YSApID0+IHtcblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQnPHNwYW4+JyArIHRleHQgKyAnPC9zcGFuPicsXG5cdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwid2NhcGYtY291bnRcIj4nICsgZGF0YVsgJ2NvdW50TWFya3VwJyBdICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRdLmpvaW4oICcnICk7XG5cdFx0XHR9O1xuXG5cdFx0XHRjb25zdCB0ZW1wbGF0ZVNlbGVjdGlvbiA9ICggdGV4dCwgZGF0YSApID0+IHtcblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJ3Y2FwZi1jb3VudC0nICsgZGF0YS5jb3VudCArICdcIj4nICsgdGV4dCArICc8L3NwYW4+Jyxcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJ3Y2FwZi1jb3VudCB3Y2FwZi1jb3VudC0nICsgZGF0YS5jb3VudCArICdcIj4nICsgZGF0YVsgJ2NvdW50TWFya3VwJyBdICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRdLmpvaW4oICcnICk7XG5cdFx0XHR9O1xuXG5cdFx0XHRjb25zdCBkZWZhdWx0cyA9IHtcblx0XHRcdFx0aW5oZXJpdF9zZWxlY3RfY2xhc3NlczogdHJ1ZSxcblx0XHRcdFx0aW5oZXJpdF9vcHRpb25fY2xhc3NlczogdHJ1ZSxcblx0XHRcdFx0bm9fcmVzdWx0c190ZXh0OiB3Y2FwZl9wYXJhbXMuY2hvc2VuX25vX3Jlc3VsdHNfdGV4dCxcblx0XHRcdFx0b3B0aW9uc19ub25lX3RleHQ6IHdjYXBmX3BhcmFtcy5jaG9zZW5fb3B0aW9uc19ub25lX3RleHQsXG5cdFx0XHRcdHNlYXJjaF9jb250YWluczogdHJ1ZSwgLy8gTWF0Y2ggZnJvbSBhbnl3aGVyZSBpbiBzdHJpbmcuXG5cdFx0XHRcdHNlYXJjaF9pbl92YWx1ZXM6IHRydWUsIC8vIFNlYXJjaCBpbiB2YWx1ZXMgYWxzby5cblx0XHRcdH07XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmlzX3J0bCApIHtcblx0XHRcdFx0ZGVmYXVsdHNbICdydGwnIF0gPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLWNob3NlbicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRoaXMgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHsgLi4uZGVmYXVsdHMgfTtcblxuXHRcdFx0XHQvLyBJZiBoaWVyYXJjaHkgZW5hYmxlZCB0aGVuIHdlIHNob3cgdGhlIHNlbGVjdGVkIG9wdGlvbnMuXG5cdFx0XHRcdGlmICggJHRoaXMuaGFzQ2xhc3MoICdoYXMtaGllcmFyY2h5JyApICkge1xuXHRcdFx0XHRcdG9wdGlvbnNbICdkaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMnIF0gPSB0cnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG9wdGlvbnNbICdkaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMnIF0gPSB3Y2FwZl9wYXJhbXMuY2hvc2VuX2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEVuYWJsZSB0ZW1wbGF0aW5nIHdoZW4gc2hvd2luZyBjb3VudC5cblx0XHRcdFx0aWYgKCAkdGhpcy5oYXNDbGFzcyggJ3dpdGgtY291bnQnICkgKSB7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ3RlbXBsYXRlUmVzdWx0JyBdICAgID0gdGVtcGxhdGVSZXN1bHQ7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ3RlbXBsYXRlU2VsZWN0aW9uJyBdID0gdGVtcGxhdGVTZWxlY3Rpb247XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBEaXNhYmxlIHNlYXJjaCBib3guXG5cdFx0XHRcdGlmICggISAkdGhpcy5kYXRhKCAnZW5hYmxlLXNlYXJjaCcgKSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnZGlzYWJsZV9zZWFyY2gnIF0gPSB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JHRoaXMuY2hvc2VuV0NBUEYoIG9wdGlvbnMgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gQXR0YWNoIGNob3NlbiBmb3IgZGVmYXVsdCBvcmRlcmJ5LlxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuYXR0YWNoX2Nob3Nlbl9vbl9zb3J0aW5nICkge1xuXHRcdFx0XHRsZXQgZGlzYWJsZVNlYXJjaCA9IHRydWU7XG5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2VhcmNoX2JveF9pbl9kZWZhdWx0X29yZGVyYnkgKSB7XG5cdFx0XHRcdFx0ZGlzYWJsZVNlYXJjaCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHsgLi4uZGVmYXVsdHMgfTtcblxuXHRcdFx0XHRvcHRpb25zWyAnZGlzYWJsZV9zZWFyY2gnIF0gPSBkaXNhYmxlU2VhcmNoO1xuXG5cdFx0XHRcdCRib2R5LmZpbmQoICcud29vY29tbWVyY2Utb3JkZXJpbmcgc2VsZWN0Lm9yZGVyYnknICkuY2hvc2VuV0NBUEYoIG9wdGlvbnMgKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGluaXRSYW5nZVNsaWRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLXJhbmdlLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGl0ZW0gICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgJHNsaWRlciA9ICRpdGVtLmZpbmQoICcud2NhcGYtbm91aS1zbGlkZXInICk7XG5cblx0XHRcdFx0Y29uc3Qgc2xpZGVySWQgICAgICAgICAgPSAkc2xpZGVyLmF0dHIoICdpZCcgKTtcblx0XHRcdFx0Y29uc3QgZGlzcGxheVZhbHVlc0FzICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kaXNwbGF5LXZhbHVlcy1hcycgKTtcblx0XHRcdFx0Y29uc3QgZm9ybWF0TnVtYmVycyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1mb3JtYXQtbnVtYmVycycgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgc3RlcCAgICAgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1zdGVwJyApICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1wbGFjZXMnICk7XG5cdFx0XHRcdGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gJGl0ZW0uYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBtaW5WYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBtYXhWYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCAkbWluVmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWluLXZhbHVlJyApO1xuXHRcdFx0XHRjb25zdCAkbWF4VmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWF4LXZhbHVlJyApO1xuXG5cdFx0XHRcdGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBzbGlkZXJJZCApO1xuXG5cdFx0XHRcdG5vVWlTbGlkZXIuY3JlYXRlKCBzbGlkZXIsIHtcblx0XHRcdFx0XHRzdGFydDogWyBtaW5WYWx1ZSwgbWF4VmFsdWUgXSxcblx0XHRcdFx0XHRzdGVwLFxuXHRcdFx0XHRcdGNvbm5lY3Q6IHRydWUsXG5cdFx0XHRcdFx0Y3NzUHJlZml4OiAnd2NhcGYtbm91aS0nLFxuXHRcdFx0XHRcdHJhbmdlOiB7XG5cdFx0XHRcdFx0XHQnbWluJzogcmFuZ2VNaW5WYWx1ZSxcblx0XHRcdFx0XHRcdCdtYXgnOiByYW5nZU1heFZhbHVlLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAndXBkYXRlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHRsZXQgbWluVmFsdWU7XG5cdFx0XHRcdFx0bGV0IG1heFZhbHVlO1xuXG5cdFx0XHRcdFx0aWYgKCBmb3JtYXROdW1iZXJzICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSBudW1iZXJGb3JtYXQoIHZhbHVlc1sgMCBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSBudW1iZXJGb3JtYXQoIHZhbHVlc1sgMSBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMSBdICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCAncGxhaW5fdGV4dCcgPT09IGRpc3BsYXlWYWx1ZXNBcyApIHtcblx0XHRcdFx0XHRcdCRtaW5WYWx1ZS5odG1sKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdFx0JG1heFZhbHVlLmh0bWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRtaW5WYWx1ZS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0XHQkbWF4VmFsdWUudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1ub3Vpc2xpZGVyLXVwZGF0ZScsIFsgJGl0ZW0sIHZhbHVlcyBdICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRmdW5jdGlvbiBmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdFx0Y29uc3QgX21pblZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAwIF0gKTtcblx0XHRcdFx0XHRjb25zdCBfbWF4VmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDEgXSApO1xuXG5cdFx0XHRcdFx0Ly8gSWYgdmFsdWUgaXMgbm90IGNoYW5nZWQgdGhlbiBkb24ndCBwcm9jZWVkLlxuXHRcdFx0XHRcdGlmICggX21pblZhbHVlID09PSBtaW5WYWx1ZSAmJiBfbWF4VmFsdWUgPT09IG1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggX21pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIF9tYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdC8vIFJlbW92ZSByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkaXRlbS5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBBZGQgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0Y29uc3QgdXJsID0gJGl0ZW0uZGF0YSggJ3VybCcgKS5yZXBsYWNlKCAnJTFzJywgX21pblZhbHVlICkucmVwbGFjZSggJyUycycsIF9tYXhWYWx1ZSApO1xuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICdjaGFuZ2UnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0JG1pblZhbHVlLm9uKCAnaW5wdXQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRcdCRpbnB1dC5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5zZXQoIFsgbWluVmFsdWUsIG51bGwgXSApO1xuXG5cdFx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtYXhWYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG51bGwsIG1heFZhbHVlIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXREYXRlcGlja2VyOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggISBqUXVlcnkoKS5kYXRlcGlja2VyICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0ICR3Y2FwZkRhdGVGaWx0ZXIgPSAkYm9keS5maW5kKCAnLndjYXBmLWRhdGUtaW5wdXQnICk7XG5cblx0XHRcdGNvbnN0IGZvcm1hdCAgICAgICAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtZm9ybWF0JyApO1xuXHRcdFx0Y29uc3QgeWVhckRyb3Bkb3duICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1waWNrZXIteWVhci1kcm9wZG93bicgKTtcblx0XHRcdGNvbnN0IG1vbnRoRHJvcGRvd24gPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtcGlja2VyLW1vbnRoLWRyb3Bkb3duJyApO1xuXG5cdFx0XHRjb25zdCAkZnJvbSA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICk7XG5cdFx0XHRjb25zdCAkdG8gICA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLXRvLWlucHV0JyApO1xuXG5cdFx0XHQkZnJvbS5kYXRlcGlja2VyKCB7XG5cdFx0XHRcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdFx0Y2hhbmdlWWVhcjogeWVhckRyb3Bkb3duLFxuXHRcdFx0XHRjaGFuZ2VNb250aDogbW9udGhEcm9wZG93bixcblx0XHRcdH0gKTtcblxuXHRcdFx0JHRvLmRhdGVwaWNrZXIoIHtcblx0XHRcdFx0ZGF0ZUZvcm1hdDogZm9ybWF0LFxuXHRcdFx0XHRjaGFuZ2VZZWFyOiB5ZWFyRHJvcGRvd24sXG5cdFx0XHRcdGNoYW5nZU1vbnRoOiBtb250aERyb3Bkb3duLFxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aW5pdEZpbHRlck9wdGlvblRvb2x0aXA6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZFJlZmVyZW5jZVxuXHRcdFx0aWYgKCAnZnVuY3Rpb24nICE9PSB0eXBlb2YgdGlwcHkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy51c2VfdGlwcHlqcyApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB0b29sdGlwUG9zaXRpb25zID0gWyAndG9wJywgJ3JpZ2h0JywgJ2JvdHRvbScsICdsZWZ0JyBdO1xuXG5cdFx0XHR0b29sdGlwUG9zaXRpb25zLmZvckVhY2goIGZ1bmN0aW9uKCB0b29sdGlwUG9zaXRpb24gKSB7XG5cdFx0XHRcdGNvbnN0IGlkZW50aWZpZXIgPSAnZGF0YS13Y2FwZi10b29sdGlwLScgKyB0b29sdGlwUG9zaXRpb247XG5cblx0XHRcdFx0Ly8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZFJlZmVyZW5jZVxuXHRcdFx0XHRjb25zdCBpbnN0YW5jZXMgPSB0aXBweSggJ1snICsgaWRlbnRpZmllciArICddJywge1xuXHRcdFx0XHRcdHBsYWNlbWVudDogdG9vbHRpcFBvc2l0aW9uLFxuXHRcdFx0XHRcdGNvbnRlbnQoIHJlZmVyZW5jZSApIHtcblx0XHRcdFx0XHRcdHJldHVybiByZWZlcmVuY2UuZ2V0QXR0cmlidXRlKCBpZGVudGlmaWVyICk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRhbGxvd0hUTUw6IHRydWUsXG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHR3aW5kb3cudGlwcHlJbnN0YW5jZXMgPSB0aXBweUluc3RhbmNlcy5jb25jYXQoIGluc3RhbmNlcyApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRXQ0FQRi5pbml0Q29tYm9ib3goKTtcblx0XHRcdFdDQVBGLmluaXRSYW5nZVNsaWRlcigpO1xuXHRcdFx0V0NBUEYuaW5pdERhdGVwaWNrZXIoKTtcblx0XHRcdFdDQVBGLmluaXRGaWx0ZXJPcHRpb25Ub29sdGlwKCk7XG5cdFx0fSxcblx0XHRpbml0UG9wU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucmVsb2FkX29uX2JhY2sgJiYgd2NhcGZfcGFyYW1zLmZvdW5kX3djYXBmICkge1xuXHRcdFx0XHRoaXN0b3J5LnJlcGxhY2VTdGF0ZSggeyB3Y2FwZjogdHJ1ZSB9LCAnJywgd2luZG93LmxvY2F0aW9uICk7XG5cblx0XHRcdFx0Ly8gSGFuZGxlIHRoZSBwb3BzdGF0ZSBldmVudChicm93c2VyJ3MgYmFjay9mb3J3YXJkKVxuXHRcdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3BvcHN0YXRlJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0aWYgKCBudWxsICE9PSBlLnN0YXRlICYmIGUuc3RhdGUuaGFzT3duUHJvcGVydHkoICd3Y2FwZicgKSApIHtcblx0XHRcdFx0XHRcdFdDQVBGLmZpbHRlclByb2R1Y3RzKCAncG9wc3RhdGUnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBFbmFibGUgaXQgaWYgbmVjZXNzYXJ5LlxuXHQgKlxuXHQgKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zMzAwNDkxN1xuXHQgKi9cblx0aWYgKCAnc2Nyb2xsUmVzdG9yYXRpb24nIGluIGhpc3RvcnkgKSB7XG5cdFx0Ly8gaGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvbiA9ICdtYW51YWwnO1xuXHR9XG5cbn0oIGpRdWVyeSwgd2luZG93ICkgKTtcblxuKCBmdW5jdGlvbiggJCwgV0NBUEYgKSB7XG5cblx0V0NBUEYuaW5pdCgpO1xuXHRXQ0FQRi5pbml0UG9wU3RhdGUoKTtcblxuXHRXQ0FQRi5oYW5kbGVGaWx0ZXJBY2NvcmRpb24oKTtcblx0V0NBUEYuaGFuZGxlSGllcmFyY2h5VG9nZ2xlKCk7XG5cdFdDQVBGLmhhbmRsZVNvZnRMaW1pdCgpO1xuXHRXQ0FQRi5oYW5kbGVTZWFyY2hGaWx0ZXJPcHRpb25zKCk7XG5cblx0V0NBUEYuaGFuZGxlTGlzdEZpbHRlcnMoKTtcblx0V0NBUEYuaGFuZGxlRHJvcGRvd25GaWx0ZXJzKCk7XG5cdFdDQVBGLmhhbmRsZU51bWJlcklucHV0RmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVEYXRlSW5wdXRGaWx0ZXJzKCk7XG5cdFdDQVBGLmhhbmRsZVBhZ2luYXRpb24oKTtcblx0V0NBUEYuaGFuZGxlRGVmYXVsdE9yZGVyYnkoKTtcblxuXHRXQ0FQRi5oYW5kbGVDbGVhckZpbHRlcigpO1xuXG5cdFdDQVBGLmhhbmRsZUZpbHRlclRvb2x0aXAoKTtcblxuXHQvKipcblx0ICogTWFrZSBpdCBjb21wYXRpYmxlIHdpdGggb3RoZXIgcGx1Z2lucy5cblx0ICovXG5cdCQoICdib2R5JyApLm9uKCAnd2NhcGZfYWZ0ZXJfdXBkYXRpbmdfcHJvZHVjdHMnLCBmdW5jdGlvbigpIHtcblx0XHQvLyB3b28tdmFyaWF0aW9uLXN3YXRjaGVzXG5cdFx0JCggZG9jdW1lbnQgKS50cmlnZ2VyKCAnd29vX3ZhcmlhdGlvbl9zd2F0Y2hlc19wcm9faW5pdCcgKTtcblx0fSApO1xuXG59KCBqUXVlcnksIHdpbmRvdy5XQ0FQRiApICk7XG4iLCIvKipcbiAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM0MTQxODEzXG4gKlxuICogQHBhcmFtIG51bWJlclxuICogQHBhcmFtIGRlY2ltYWxzXG4gKiBAcGFyYW0gZGVjX3BvaW50XG4gKiBAcGFyYW0gdGhvdXNhbmRzX3NlcFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIG51bWJlckZvcm1hdCggbnVtYmVyLCBkZWNpbWFscywgZGVjX3BvaW50LCB0aG91c2FuZHNfc2VwICkge1xuXHQvLyBTdHJpcCBhbGwgY2hhcmFjdGVycyBidXQgbnVtZXJpY2FsIG9uZXMuXG5cdG51bWJlciA9ICggbnVtYmVyICsgJycgKS5yZXBsYWNlKCAvW15cXGQrXFwtRWUuXS9nLCAnJyApO1xuXG5cdGNvbnN0IG4gICAgPSAhIGlzRmluaXRlKCArbnVtYmVyICkgPyAwIDogK251bWJlcjtcblx0Y29uc3QgcHJlYyA9ICEgaXNGaW5pdGUoICtkZWNpbWFscyApID8gMCA6IE1hdGguYWJzKCBkZWNpbWFscyApO1xuXHRjb25zdCBzZXAgID0gKCB0eXBlb2YgdGhvdXNhbmRzX3NlcCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcsJyA6IHRob3VzYW5kc19zZXA7XG5cdGNvbnN0IGRlYyAgPSAoIHR5cGVvZiBkZWNfcG9pbnQgPT09ICd1bmRlZmluZWQnICkgPyAnLicgOiBkZWNfcG9pbnQ7XG5cblx0bGV0IHM7XG5cblx0Y29uc3QgdG9GaXhlZEZpeCA9IGZ1bmN0aW9uKCBuLCBwcmVjICkge1xuXHRcdGNvbnN0IGsgPSBNYXRoLnBvdyggMTAsIHByZWMgKTtcblx0XHRyZXR1cm4gJycgKyBNYXRoLnJvdW5kKCBuICogayApIC8gaztcblx0fTtcblxuXHQvLyBGaXggZm9yIElFIHBhcnNlRmxvYXQoMC41NSkudG9GaXhlZCgwKSA9IDA7XG5cdHMgPSAoIHByZWMgPyB0b0ZpeGVkRml4KCBuLCBwcmVjICkgOiAnJyArIE1hdGgucm91bmQoIG4gKSApLnNwbGl0KCAnLicgKTtcblxuXHRpZiAoIHNbIDAgXS5sZW5ndGggPiAzICkge1xuXHRcdHNbIDAgXSA9IHNbIDAgXS5yZXBsYWNlKCAvXFxCKD89KD86XFxkezN9KSsoPyFcXGQpKS9nLCBzZXAgKTtcblx0fVxuXG5cdGlmICggKCBzWyAxIF0gfHwgJycgKS5sZW5ndGggPCBwcmVjICkge1xuXHRcdHNbIDEgXSA9IHNbIDEgXSB8fCAnJztcblx0XHRzWyAxIF0gKz0gbmV3IEFycmF5KCBwcmVjIC0gc1sgMSBdLmxlbmd0aCArIDEgKS5qb2luKCAnMCcgKTtcblx0fVxuXG5cdHJldHVybiBzLmpvaW4oIGRlYyApO1xufVxuXG5mdW5jdGlvbiBjbGVhblVybCggdXJsICkge1xuXHRyZXR1cm4gdXJsLnJlcGxhY2UoIC8lMkMvZywgJywnICk7XG59XG5cbmZ1bmN0aW9uIGdldE9yZGVyQnlVcmwoIHVybCApIHtcblx0Y29uc3QgcGFnZWQgPSBwYXJzZUludCggdXJsLnJlcGxhY2UoIC8uK1xcL3BhZ2VcXC8oXFxkKykrLywgJyQxJyApICk7XG5cblx0aWYgKCBwYWdlZCApIHtcblx0XHR1cmwgPSB1cmwucmVwbGFjZSggL3BhZ2VcXC8oXFxkKylcXC8vLCAnJyApO1xuXHR9XG5cblx0cmV0dXJuIGNsZWFuVXJsKCB1cmwgKTtcbn1cbiJdfQ==
