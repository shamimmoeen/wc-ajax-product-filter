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
  'loading_overlay_options': '',
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
    showLoadingAnimation: function showLoadingAnimation() {
      if (!wcapf_params.loading_animation) {
        return;
      }

      $.LoadingOverlay('show', wcapf_params.loading_overlay_options);
    },
    resetLoadingAnimation: function resetLoadingAnimation() {
      if (!wcapf_params.loading_animation) {
        return;
      }

      $.LoadingOverlay('hide');
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
      WCAPF.showLoadingAnimation(); // Scroll into view on paginate.

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
      WCAPF.resetLoadingAnimation(); // Maybe good for performance.

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJ1dGlscy5qcyJdLCJuYW1lcyI6WyJ3Y2FwZl9wYXJhbXMiLCIkIiwid2luZG93IiwiX2RlbGF5IiwicGFyc2VJbnQiLCJmaWx0ZXJfaW5wdXRfZGVsYXkiLCJkZWxheSIsIiRib2R5IiwiaW5zdGFuY2VJZHMiLCJlYWNoIiwiaWQiLCJkYXRhIiwicHVzaCIsImZvY3VzZWRFbG0iLCJ0aXBweUluc3RhbmNlcyIsIldDQVBGIiwiaGFuZGxlRmlsdGVyQWNjb3JkaW9uIiwidG9nZ2xlQWNjb3JkaW9uIiwiJGVsIiwicHJlc3NlZCIsImF0dHIiLCIkZmlsdGVySW5uZXIiLCJjbG9zZXN0IiwiY2hpbGRyZW4iLCJlbmFibGVfYW5pbWF0aW9uX2Zvcl9maWx0ZXJfYWNjb3JkaW9uIiwic2xpZGVUb2dnbGUiLCJmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsInRvZ2dsZSIsIm9uIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsIiR0cmlnZ2VyIiwiZmluZCIsImhhbmRsZUhpZXJhcmNoeVRvZ2dsZSIsIiRjaGlsZCIsImVuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24iLCJoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsImtleSIsInByZXZlbnREZWZhdWx0IiwiaGFuZGxlU29mdExpbWl0IiwidG9nZ2xlRmlsdGVyT3B0aW9ucyIsIiRsaXN0V3JhcHBlciIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJoYW5kbGVTZWFyY2hGaWx0ZXJPcHRpb25zIiwiJHRoYXQiLCIkaW5uZXIiLCIkZmlsdGVyIiwic29mdExpbWl0RW5hYmxlZCIsImhhc0NsYXNzIiwic29mdExpbWl0VG9nZ2xlIiwibm9SZXN1bHRzIiwidmlzaWJsZU9wdGlvbnMiLCJrZXl3b3JkIiwidmFsIiwibGVuZ3RoIiwiaW5kZXgiLCIkZmlsdGVySXRlbSIsInJlbW92ZUF0dHIiLCJ0ZXh0IiwiaGlkZSIsImxhYmVsIiwidG9TdHJpbmciLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwic2hvdyIsInVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQiLCIkcmVzcG9uc2UiLCIkY29udGFpbmVyIiwic2hvcF9sb29wX2NvbnRhaW5lciIsInNlbGVjdG9yIiwibmV3Q291bnQiLCJodG1sIiwiaGFzIiwic2hvd0xvYWRpbmdBbmltYXRpb24iLCJsb2FkaW5nX2FuaW1hdGlvbiIsIkxvYWRpbmdPdmVybGF5IiwibG9hZGluZ19vdmVybGF5X29wdGlvbnMiLCJyZXNldExvYWRpbmdBbmltYXRpb24iLCJzY3JvbGxUbyIsInRyaWdnZXJlZEJ5Iiwic2Nyb2xsX3dpbmRvdyIsImFsbG93ZWQiLCJzY3JvbGxXaGVuIiwic2Nyb2xsX3dpbmRvd193aGVuIiwic2Nyb2xsRm9yIiwic2Nyb2xsX3dpbmRvd19mb3IiLCJpc01vYmlsZSIsImlzX21vYmlsZSIsInByb2NlZWQiLCJhZGp1c3RpbmdPZmZzZXQiLCJvZmZzZXQiLCJzY3JvbGxfdG9fdG9wX29mZnNldCIsImNvbnRhaW5lciIsIm5vdF9mb3VuZF9jb250YWluZXIiLCJzY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50IiwidG9wIiwiZGlzYWJsZV9zY3JvbGxfYW5pbWF0aW9uIiwic3RvcCIsImFuaW1hdGUiLCJzY3JvbGxUb3AiLCJzY3JvbGxfdG9fdG9wX3NwZWVkIiwic2Nyb2xsX3RvX3RvcF9lYXNpbmciLCJiZWZvcmVGZXRjaGluZ1Byb2R1Y3RzIiwiZG9jdW1lbnQiLCJhY3RpdmVFbGVtZW50IiwiaW1tZWRpYXRlX3Njcm9sbF9vbl9wYWdpbmF0ZSIsInRyaWdnZXIiLCJkZXN0cm95VGlwcHlJbnN0YW5jZXMiLCJ1c2VfdGlwcHlqcyIsImZvckVhY2giLCJpbnN0YW5jZSIsImRlc3Ryb3kiLCJiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzIiwiYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzIiwicmVzdG9yZV9mb2N1c19hZnRlcl9maWx0ZXJpbmciLCJib2R5IiwiZm9jdXMiLCJpbml0IiwiY3VzdG9tX3NjcmlwdHMiLCJldmFsIiwiZmlsdGVyUHJvZHVjdHMiLCJhamF4IiwidXJsIiwibG9jYXRpb24iLCJocmVmIiwic3VjY2VzcyIsInJlc3BvbnNlIiwidXBkYXRlX2RvY3VtZW50X3RpdGxlIiwidGl0bGUiLCJmaWx0ZXIiLCJpbnN0YW5jZUlkIiwiJGluc3RhbmNlIiwiX2luc3RhbmNlIiwicHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSIsInRvZ2dsZVNlbGVjdG9yIiwicHJlc2VydmVfc29mdF9saW1pdF9zdGF0ZSIsIl9odG1sIiwiJHNob3BMb29wQ29udGFpbmVyIiwiJG5vdEZvdW5kQ29udGFpbmVyIiwicmVxdWVzdEZpbHRlciIsImhvc3RuYW1lIiwicmVwbGFjZSIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJ3Y2FwZiIsImhhbmRsZU51bWJlcklucHV0RmlsdGVycyIsInJhbmdlTnVtYmVyU2VsZWN0b3JzIiwiJGl0ZW0iLCIkcmFuZ2VOdW1iZXIiLCJmb3JtYXROdW1iZXJzIiwicmFuZ2VNaW5WYWx1ZSIsInBhcnNlRmxvYXQiLCJyYW5nZU1heFZhbHVlIiwib2xkTWluVmFsdWUiLCJvbGRNYXhWYWx1ZSIsImRlY2ltYWxQbGFjZXMiLCJ0aG91c2FuZFNlcGFyYXRvciIsImRlY2ltYWxTZXBhcmF0b3IiLCJjbGVhclRpbWVvdXQiLCJnZXRWYWx1ZSIsImZsb2F0VmFsdWUiLCJudW1iZXJGb3JtYXQiLCJzZXRUaW1lb3V0IiwicmVtb3ZlRGF0YSIsIm1pblZhbHVlIiwibWF4VmFsdWUiLCJpc05hTiIsImhhbmRsZURhdGVJbnB1dEZpbHRlcnMiLCJpc1JhbmdlIiwiZmlsdGVyVXJsIiwiZnJvbSIsInRvIiwiaGFuZGxlTGlzdEZpbHRlcnMiLCJuYXRpdmVJbnB1dHMiLCJ0b2dnbGVDbGFzcyIsImN1c3RvbVJhZGlvU2VsZWN0b3IiLCJub3QiLCJwcm9wIiwiaGFuZGxlRHJvcGRvd25GaWx0ZXJzIiwiJHNlbGVjdCIsInZhbHVlcyIsImZpbHRlclVSTCIsImNsZWFyRmlsdGVyVVJMIiwiaGFuZGxlUGFnaW5hdGlvbiIsImVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4IiwicGFnaW5hdGlvbl9jb250YWluZXIiLCJfc2VsZWN0b3JzIiwic3BsaXQiLCJzZWxlY3RvcnMiLCJqb2luIiwiaGFuZGxlRGVmYXVsdE9yZGVyYnkiLCJzb3J0aW5nX2NvbnRyb2wiLCJvcmRlciIsIlVSTCIsInNlYXJjaFBhcmFtcyIsInNldCIsImdldE9yZGVyQnlVcmwiLCJoYW5kbGVDbGVhckZpbHRlciIsImhhbmRsZUZpbHRlclRvb2x0aXAiLCJ0aXBweSIsInBsYWNlbWVudCIsImNvbnRlbnQiLCJyZWZlcmVuY2UiLCJnZXRBdHRyaWJ1dGUiLCJhbGxvd0hUTUwiLCJpbml0Q29tYm9ib3giLCJqUXVlcnkiLCJjaG9zZW5XQ0FQRiIsInRlbXBsYXRlUmVzdWx0IiwidGVtcGxhdGVTZWxlY3Rpb24iLCJjb3VudCIsImRlZmF1bHRzIiwiaW5oZXJpdF9zZWxlY3RfY2xhc3NlcyIsImluaGVyaXRfb3B0aW9uX2NsYXNzZXMiLCJub19yZXN1bHRzX3RleHQiLCJjaG9zZW5fbm9fcmVzdWx0c190ZXh0Iiwib3B0aW9uc19ub25lX3RleHQiLCJjaG9zZW5fb3B0aW9uc19ub25lX3RleHQiLCJzZWFyY2hfY29udGFpbnMiLCJzZWFyY2hfaW5fdmFsdWVzIiwiaXNfcnRsIiwiJHRoaXMiLCJvcHRpb25zIiwiY2hvc2VuX2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucyIsImF0dGFjaF9jaG9zZW5fb25fc29ydGluZyIsImRpc2FibGVTZWFyY2giLCJzZWFyY2hfYm94X2luX2RlZmF1bHRfb3JkZXJieSIsImluaXRSYW5nZVNsaWRlciIsIm5vVWlTbGlkZXIiLCIkc2xpZGVyIiwic2xpZGVySWQiLCJkaXNwbGF5VmFsdWVzQXMiLCJzdGVwIiwiJG1pblZhbHVlIiwiJG1heFZhbHVlIiwic2xpZGVyIiwiZ2V0RWxlbWVudEJ5SWQiLCJjcmVhdGUiLCJzdGFydCIsImNvbm5lY3QiLCJjc3NQcmVmaXgiLCJyYW5nZSIsImZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIiLCJfbWluVmFsdWUiLCJfbWF4VmFsdWUiLCIkaW5wdXQiLCJnZXQiLCJpbml0RGF0ZXBpY2tlciIsImRhdGVwaWNrZXIiLCIkd2NhcGZEYXRlRmlsdGVyIiwiZm9ybWF0IiwieWVhckRyb3Bkb3duIiwibW9udGhEcm9wZG93biIsIiRmcm9tIiwiJHRvIiwiZGF0ZUZvcm1hdCIsImNoYW5nZVllYXIiLCJjaGFuZ2VNb250aCIsImluaXRGaWx0ZXJPcHRpb25Ub29sdGlwIiwidG9vbHRpcFBvc2l0aW9ucyIsInRvb2x0aXBQb3NpdGlvbiIsImlkZW50aWZpZXIiLCJpbnN0YW5jZXMiLCJjb25jYXQiLCJpbml0UG9wU3RhdGUiLCJyZWxvYWRfb25fYmFjayIsImZvdW5kX3djYXBmIiwicmVwbGFjZVN0YXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInN0YXRlIiwiaGFzT3duUHJvcGVydHkiLCJudW1iZXIiLCJkZWNpbWFscyIsImRlY19wb2ludCIsInRob3VzYW5kc19zZXAiLCJuIiwiaXNGaW5pdGUiLCJwcmVjIiwiTWF0aCIsImFicyIsInNlcCIsImRlYyIsInMiLCJ0b0ZpeGVkRml4IiwiayIsInBvdyIsInJvdW5kIiwiQXJyYXkiLCJjbGVhblVybCIsInBhZ2VkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSxZQUFZLEdBQUdBLFlBQVksSUFBSTtBQUNwQyxZQUFVLEVBRDBCO0FBRXBDLHdCQUFzQixFQUZjO0FBR3BDLHFDQUFtQyxFQUhDO0FBSXBDLDRCQUEwQixFQUpVO0FBS3BDLDhCQUE0QixFQUxRO0FBTXBDLG1DQUFpQyxFQU5HO0FBT3BDLHdDQUFzQyxFQVBGO0FBUXBDLCtCQUE2QixFQVJPO0FBU3BDLDJD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QVE0RixHQUFSLENBQVA7QUFDQTs7QUFFRCxTQUFTTyxRQUFULENBQW1CdEssR0FBbkIsRUFBeUI7QUFDeEIsU0FBT0EsR0FBRyxDQUFDbUIsT0FBSixDQUFhLE1BQWIsRUFBcUIsR0FBckIsQ0FBUDtBQUNBOztBQUVELFNBQVN1RCxhQUFULENBQXdCMUUsR0FBeEIsRUFBOEI7QUFDN0IsTUFBTXVLLEtBQUssR0FBR2hTLFFBQVEsQ0FBRXlILEdBQUcsQ0FBQ21CLE9BQUosQ0FBYSxrQkFBYixFQUFpQyxJQUFqQyxDQUFGLENBQXRCOztBQUVBLE1BQUtvSixLQUFMLEVBQWE7QUFDWnZLLElBQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDbUIsT0FBSixDQUFhLGVBQWIsRUFBOEIsRUFBOUIsQ0FBTjtBQUNBOztBQUVELFNBQU9tSixRQUFRLENBQUV0SyxHQUFGLENBQWY7QUFDQSIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLXB1YmxpYy1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgbWFpbiBqcyBmaWxlLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL3B1YmxpYy9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5jb25zdCB3Y2FwZl9wYXJhbXMgPSB3Y2FwZl9wYXJhbXMgfHwge1xuXHQnaXNfcnRsJzogJycsXG5cdCdmaWx0ZXJfaW5wdXRfZGVsYXknOiAnJyxcblx0J2Nob3Nlbl9kaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMnOiAnJyxcblx0J2Nob3Nlbl9ub19yZXN1bHRzX3RleHQnOiAnJyxcblx0J2Nob3Nlbl9vcHRpb25zX25vbmVfdGV4dCc6ICcnLFxuXHQnc2VhcmNoX2JveF9pbl9kZWZhdWx0X29yZGVyYnknOiAnJyxcblx0J3ByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUnOiAnJyxcblx0J3ByZXNlcnZlX3NvZnRfbGltaXRfc3RhdGUnOiAnJyxcblx0J2VuYWJsZV9hbmltYXRpb25fZm9yX2ZpbHRlcl9hY2NvcmRpb24nOiAnJyxcblx0J2ZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkJzogJycsXG5cdCdmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmcnOiAnJyxcblx0J2VuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24nOiAnJyxcblx0J2hpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkJzogJycsXG5cdCdoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmcnOiAnJyxcblx0J3Jlc3RvcmVfZm9jdXNfYWZ0ZXJfZmlsdGVyaW5nJzogJycsXG5cdCdsb2FkaW5nX292ZXJsYXlfb3B0aW9ucyc6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9zcGVlZCc6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9lYXNpbmcnOiAnJyxcblx0J2ltbWVkaWF0ZV9zY3JvbGxfb25fcGFnaW5hdGUnOiAnJyxcblx0J2lzX21vYmlsZSc6ICcnLFxuXHQncmVsb2FkX29uX2JhY2snOiAnJyxcblx0J2ZvdW5kX3djYXBmJzogJycsXG5cdCd1cGRhdGVfZG9jdW1lbnRfdGl0bGUnOiAnJyxcblx0J3VzZV90aXBweWpzJzogJycsXG5cdCdzaG9wX2xvb3BfY29udGFpbmVyJzogJycsXG5cdCdub3RfZm91bmRfY29udGFpbmVyJzogJycsXG5cdCdwYWdpbmF0aW9uX2NvbnRhaW5lcic6ICcnLFxuXHQnZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXgnOiAnJyxcblx0J3NvcnRpbmdfY29udHJvbCc6ICcnLFxuXHQnYXR0YWNoX2Nob3Nlbl9vbl9zb3J0aW5nJzogJycsXG5cdCdsb2FkaW5nX2FuaW1hdGlvbic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvdyc6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd19mb3InOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfd2hlbic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudCc6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9vZmZzZXQnOiAnJyxcblx0J2Rpc2FibGVfc2Nyb2xsX2FuaW1hdGlvbic6ICcnLFxuXHQnbW9yZV9zZWxlY3RvcnMnOiAnJyxcblx0J2N1c3RvbV9zY3JpcHRzJzogJycsXG59O1xuXG4oIGZ1bmN0aW9uKCAkLCB3aW5kb3cgKSB7XG5cblx0Y29uc3QgX2RlbGF5ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5maWx0ZXJfaW5wdXRfZGVsYXkgKTtcblx0Y29uc3QgZGVsYXkgID0gX2RlbGF5ID49IDAgPyBfZGVsYXkgOiA4MDA7XG5cblx0Y29uc3QgJGJvZHkgPSAkKCAnYm9keScgKTtcblxuXHRjb25zdCBpbnN0YW5jZUlkcyA9IFtdO1xuXG5cdCQoICcud2NhcGYtZmlsdGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IGlkID0gJCggdGhpcyApLmRhdGEoICdpZCcgKTtcblxuXHRcdGlmICggISBpZCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpbnN0YW5jZUlkcy5wdXNoKCBpZCApO1xuXHR9ICk7XG5cblx0bGV0IGZvY3VzZWRFbG07XG5cblx0d2luZG93LnRpcHB5SW5zdGFuY2VzID0gW107XG5cblx0d2luZG93LldDQVBGID0gd2luZG93LldDQVBGIHx8IHt9O1xuXG5cdHdpbmRvdy5XQ0FQRiA9IHtcblx0XHRoYW5kbGVGaWx0ZXJBY2NvcmRpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgdG9nZ2xlQWNjb3JkaW9uID0gKCAkZWwgKSA9PiB7XG5cdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYWNjb3JkaW9uIGlzIG9wZW5lZFxuXHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLWV4cGFuZGVkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0Ly8gQ2hhbmdlIGFyaWEtZXhwYW5kZWQgdG8gdGhlIG9wcG9zaXRlIHN0YXRlXG5cdFx0XHRcdCRlbC5hdHRyKCAnYXJpYS1leHBhbmRlZCcsICEgcHJlc3NlZCApO1xuXG5cdFx0XHRcdGNvbnN0ICRmaWx0ZXJJbm5lciA9ICRlbC5jbG9zZXN0KCAnLndjYXBmLWZpbHRlcicgKS5jaGlsZHJlbiggJy53Y2FwZi1maWx0ZXItaW5uZXInICk7XG5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX2FuaW1hdGlvbl9mb3JfZmlsdGVyX2FjY29yZGlvbiApIHtcblx0XHRcdFx0XHQkZmlsdGVySW5uZXIuc2xpZGVUb2dnbGUoXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQsXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkZmlsdGVySW5uZXIudG9nZ2xlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdCRib2R5Lm9uKCAnY2xpY2snLCAnLndjYXBmLWZpbHRlci1hY2NvcmRpb24tdHJpZ2dlcicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdCRib2R5Lm9uKCAnY2xpY2snLCAnLndjYXBmLWZpbHRlci10aXRsZS5oYXMtYWNjb3JkaW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0cmlnZ2VyID0gJCggdGhpcyApLmZpbmQoICcud2NhcGYtZmlsdGVyLWFjY29yZGlvbi10cmlnZ2VyJyApO1xuXG5cdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJHRyaWdnZXIgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZUhpZXJhcmNoeVRvZ2dsZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCB0b2dnbGVBY2NvcmRpb24gPSAoICRlbCApID0+IHtcblx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBidXR0b24gaXMgcHJlc3NlZFxuXHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLXByZXNzZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHQvLyBDaGFuZ2UgYXJpYS1wcmVzc2VkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuXHRcdFx0XHQkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICEgcHJlc3NlZCApO1xuXG5cdFx0XHRcdGNvbnN0ICRjaGlsZCA9ICRlbC5jbG9zZXN0KCAnbGknICkuY2hpbGRyZW4oICd1bCcgKTtcblxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uICkge1xuXHRcdFx0XHRcdCRjaGlsZC5zbGlkZVRvZ2dsZShcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5oaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCxcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5oaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmdcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRjaGlsZC50b2dnbGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0JGJvZHlcblx0XHRcdFx0Lm9uKCAnY2xpY2snLCAnLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkKCB0aGlzICkgKTtcblx0XHRcdFx0fSApXG5cdFx0XHRcdC5vbiggJ2tleWRvd24nLCAnLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0aWYgKCBlLmtleSA9PT0gJyAnIHx8IGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnU3BhY2ViYXInICkge1xuXHRcdFx0XHRcdFx0Ly8gUHJldmVudCB0aGUgZGVmYXVsdCBhY3Rpb24gdG8gc3RvcCBzY3JvbGxpbmcgd2hlbiBzcGFjZSBpcyBwcmVzc2VkXG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVTb2Z0TGltaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgdG9nZ2xlRmlsdGVyT3B0aW9ucyA9ICggJGVsICkgPT4ge1xuXHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGJ1dHRvbiBpcyBwcmVzc2VkXG5cdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdC8vIENoYW5nZSBhcmlhLXByZXNzZWQgdG8gdGhlIG9wcG9zaXRlIHN0YXRlXG5cdFx0XHRcdCRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJywgISBwcmVzc2VkICk7XG5cblx0XHRcdFx0Y29uc3QgJGxpc3RXcmFwcGVyID0gJGVsLmNsb3Nlc3QoICcud2NhcGYtbGlzdC13cmFwcGVyJyApO1xuXG5cdFx0XHRcdGlmICggcHJlc3NlZCApIHtcblx0XHRcdFx0XHQkbGlzdFdyYXBwZXIucmVtb3ZlQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRsaXN0V3JhcHBlci5hZGRDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdCRib2R5XG5cdFx0XHRcdC5vbiggJ2NsaWNrJywgJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0b2dnbGVGaWx0ZXJPcHRpb25zKCAkKCB0aGlzICkgKTtcblx0XHRcdFx0fSApXG5cdFx0XHRcdC5vbiggJ2tleWRvd24nLCAnLndjYXBmLXNvZnQtbGltaXQtdHJpZ2dlcicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdGlmICggZS5rZXkgPT09ICcgJyB8fCBlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJ1NwYWNlYmFyJyApIHtcblx0XHRcdFx0XHRcdC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgYWN0aW9uIHRvIHN0b3Agc2Nyb2xsaW5nIHdoZW4gc3BhY2UgaXMgcHJlc3NlZFxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0XHR0b2dnbGVGaWx0ZXJPcHRpb25zKCAkKCB0aGlzICkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZVNlYXJjaEZpbHRlck9wdGlvbnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdpbnB1dCcsICcud2NhcGYtc2VhcmNoLWJveCBpbnB1dFt0eXBlPVwidGV4dFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkdGhhdCAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCAkaW5uZXIgID0gJHRoYXQuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXItaW5uZXInICk7XG5cdFx0XHRcdGNvbnN0ICRmaWx0ZXIgPSAkaW5uZXIuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXInICk7XG5cblx0XHRcdFx0Y29uc3Qgc29mdExpbWl0RW5hYmxlZCA9ICRmaWx0ZXIuaGFzQ2xhc3MoICdoYXMtc29mdC1saW1pdCcgKTtcblx0XHRcdFx0Y29uc3Qgc29mdExpbWl0VG9nZ2xlICA9ICRmaWx0ZXIuZmluZCggJy53Y2FwZi1zb2Z0LWxpbWl0LXdyYXBwZXInICk7XG5cdFx0XHRcdGNvbnN0IG5vUmVzdWx0cyAgICAgICAgPSAkZmlsdGVyLmZpbmQoICcud2NhcGYtbm8tcmVzdWx0cy10ZXh0JyApO1xuXHRcdFx0XHRjb25zdCB2aXNpYmxlT3B0aW9ucyAgID0gcGFyc2VJbnQoICRmaWx0ZXIuYXR0ciggJ2RhdGEtdmlzaWJsZS1vcHRpb25zJyApICk7XG5cblx0XHRcdFx0Y29uc3Qga2V5d29yZCA9ICR0aGF0LnZhbCgpO1xuXG5cdFx0XHRcdGlmICggISBrZXl3b3JkLmxlbmd0aCApIHtcblx0XHRcdFx0XHRsZXQgaW5kZXggPSAwO1xuXHRcdFx0XHRcdCRmaWx0ZXIucmVtb3ZlQ2xhc3MoICdzZWFyY2gtYWN0aXZlJyApO1xuXG5cdFx0XHRcdFx0JC5lYWNoKCAkaW5uZXIuZmluZCggJy53Y2FwZi1maWx0ZXItb3B0aW9ucyA+IGxpJyApLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGluZGV4Kys7XG5cblx0XHRcdFx0XHRcdGNvbnN0ICRmaWx0ZXJJdGVtID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICdrZXl3b3JkLW1hdGNoZWQnICk7XG5cblx0XHRcdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCBpbmRleCA+IHZpc2libGVPcHRpb25zICkge1xuXHRcdFx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLmFkZENsYXNzKCAnd2NhcGYtZmlsdGVyLW9wdGlvbi1oaWRkZW4nICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRcdHNvZnRMaW1pdFRvZ2dsZS5yZW1vdmVBdHRyKCAnc3R5bGUnICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bm9SZXN1bHRzLmNoaWxkcmVuKCAnc3BhbicgKS50ZXh0KCAnJyApO1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5oaWRlKCk7XG5cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgaW5kZXggPSAwO1xuXHRcdFx0XHQkZmlsdGVyLmFkZENsYXNzKCAnc2VhcmNoLWFjdGl2ZScgKTtcblxuXHRcdFx0XHQkLmVhY2goICRpbm5lci5maW5kKCAnLndjYXBmLWZpbHRlci1vcHRpb25zID4gbGknICksIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0ICRmaWx0ZXJJdGVtID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdGNvbnN0IGxhYmVsICAgICAgID0gJGZpbHRlckl0ZW0uZmluZCggJy53Y2FwZi1maWx0ZXItaXRlbS1sYWJlbCcgKS5kYXRhKCAnbGFiZWwnICk7XG5cblx0XHRcdFx0XHRpZiAoIGxhYmVsLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygga2V5d29yZC50b0xvd2VyQ2FzZSgpICkgKSB7XG5cdFx0XHRcdFx0XHRpbmRleCsrO1xuXG5cdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5hZGRDbGFzcyggJ2tleXdvcmQtbWF0Y2hlZCcgKTtcblxuXHRcdFx0XHRcdFx0aWYgKCBzb2Z0TGltaXRFbmFibGVkICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIGluZGV4ID4gdmlzaWJsZU9wdGlvbnMgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0uYWRkQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5yZW1vdmVDbGFzcyggJ3djYXBmLWZpbHRlci1vcHRpb24taGlkZGVuJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLnJlbW92ZUNsYXNzKCAna2V5d29yZC1tYXRjaGVkJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRpZiAoIGluZGV4IDw9IHZpc2libGVPcHRpb25zICkge1xuXHRcdFx0XHRcdFx0c29mdExpbWl0VG9nZ2xlLmhpZGUoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c29mdExpbWl0VG9nZ2xlLnNob3coKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIDAgPT09IGluZGV4ICkge1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5jaGlsZHJlbiggJ3NwYW4nICkudGV4dCgga2V5d29yZCApO1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bm9SZXN1bHRzLmNoaWxkcmVuKCAnc3BhbicgKS50ZXh0KCAnJyApO1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdHVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQ6IGZ1bmN0aW9uKCAkcmVzcG9uc2UgKSB7XG5cdFx0XHRjb25zdCAkY29udGFpbmVyID0gJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdGNvbnN0IHNlbGVjdG9yICAgPSAnLndvb2NvbW1lcmNlLXJlc3VsdC1jb3VudCc7XG5cdFx0XHRjb25zdCBuZXdDb3VudCAgID0gJHJlc3BvbnNlLmZpbmQoIHNlbGVjdG9yICkuaHRtbCgpO1xuXG5cdFx0XHQkYm9keS5maW5kKCBzZWxlY3RvciApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkZWwgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0aWYgKCAhICRjb250YWluZXIuaGFzKCAkZWwgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0JGVsLmh0bWwoIG5ld0NvdW50ICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdHNob3dMb2FkaW5nQW5pbWF0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMubG9hZGluZ19hbmltYXRpb24gKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0JC5Mb2FkaW5nT3ZlcmxheSggJ3Nob3cnLCB3Y2FwZl9wYXJhbXMubG9hZGluZ19vdmVybGF5X29wdGlvbnMgKTtcblx0XHR9LFxuXHRcdHJlc2V0TG9hZGluZ0FuaW1hdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLmxvYWRpbmdfYW5pbWF0aW9uICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCQuTG9hZGluZ092ZXJsYXkoICdoaWRlJyApO1xuXHRcdH0sXG5cdFx0c2Nyb2xsVG86IGZ1bmN0aW9uKCB0cmlnZ2VyZWRCeSApIHtcblx0XHRcdGlmICggJ25vbmUnID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvdyApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBhbGxvd2VkICAgID0gW107XG5cdFx0XHRjb25zdCBzY3JvbGxXaGVuID0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfd2hlbjtcblxuXHRcdFx0aWYgKCAnYWxsJyA9PT0gc2Nyb2xsV2hlbiApIHtcblx0XHRcdFx0YWxsb3dlZC5wdXNoKCAnZmlsdGVyJyApO1xuXHRcdFx0XHRhbGxvd2VkLnB1c2goICdwYWdpbmF0ZScgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFsbG93ZWQucHVzaCggc2Nyb2xsV2hlbiApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgYWxsb3dlZC5pbmNsdWRlcyggdHJpZ2dlcmVkQnkgKSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzY3JvbGxGb3IgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19mb3I7XG5cdFx0XHRjb25zdCBpc01vYmlsZSAgPSB3Y2FwZl9wYXJhbXMuaXNfbW9iaWxlO1xuXHRcdFx0bGV0IHByb2NlZWQgICAgID0gZmFsc2U7XG5cblx0XHRcdGlmICggJ21vYmlsZScgPT09IHNjcm9sbEZvciAmJiBpc01vYmlsZSApIHtcblx0XHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0XHR9IGVsc2UgaWYgKCAnZGVza3RvcCcgPT09IHNjcm9sbEZvciAmJiAhIGlzTW9iaWxlICkge1xuXHRcdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSBpZiAoICdib3RoJyA9PT0gc2Nyb2xsRm9yICkge1xuXHRcdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhIHByb2NlZWQgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGFkanVzdGluZ09mZnNldCwgb2Zmc2V0O1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX29mZnNldCApIHtcblx0XHRcdFx0YWRqdXN0aW5nT2Zmc2V0ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX29mZnNldCApO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgY29udGFpbmVyO1xuXG5cdFx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lcjtcblx0XHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lcjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAnY3VzdG9tJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRcdGNvbnRhaW5lciA9IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50O1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCAkY29udGFpbmVyID0gJCggY29udGFpbmVyICk7XG5cblx0XHRcdGlmICggJGNvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdG9mZnNldCA9ICRjb250YWluZXIub2Zmc2V0KCkudG9wIC0gYWRqdXN0aW5nT2Zmc2V0O1xuXG5cdFx0XHRcdGlmICggb2Zmc2V0IDwgMCApIHtcblx0XHRcdFx0XHRvZmZzZXQgPSAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZGlzYWJsZV9zY3JvbGxfYW5pbWF0aW9uICkge1xuXHRcdFx0XHRcdHdpbmRvdy5zY3JvbGxUbyggeyB0b3A6IG9mZnNldCB9ICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JCggJ2h0bWwsIGJvZHknICkuc3RvcCgpLmFuaW1hdGUoXG5cdFx0XHRcdFx0XHR7IHNjcm9sbFRvcDogb2Zmc2V0IH0sXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9zcGVlZCxcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX2Vhc2luZ1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdC8vIFRoaW5ncyBhcmUgZG9uZSBiZWZvcmUgZmV0Y2hpbmcgdGhlIHByb2R1Y3RzIGxpa2Ugc2hvd2luZyB0aGUgbG9hZGluZyBpbmRpY2F0b3IuXG5cdFx0YmVmb3JlRmV0Y2hpbmdQcm9kdWN0czogZnVuY3Rpb24oIHRyaWdnZXJlZEJ5ICkge1xuXHRcdFx0Ly8gVHJhY2sgdGhlIGN1cnJlbnQgZWxlbWVudCBmb2N1cy5cblx0XHRcdGZvY3VzZWRFbG0gPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXG5cdFx0XHRXQ0FQRi5zaG93TG9hZGluZ0FuaW1hdGlvbigpO1xuXG5cdFx0XHQvLyBTY3JvbGwgaW50byB2aWV3IG9uIHBhZ2luYXRlLlxuXHRcdFx0aWYgKCAncGFnaW5hdGUnID09PSB0cmlnZ2VyZWRCeSAmJiB3Y2FwZl9wYXJhbXMuaW1tZWRpYXRlX3Njcm9sbF9vbl9wYWdpbmF0ZSApIHtcblx0XHRcdFx0V0NBUEYuc2Nyb2xsVG8oIHRyaWdnZXJlZEJ5ICk7XG5cdFx0XHR9XG5cblx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfZmV0Y2hpbmdfcHJvZHVjdHMnLCBbIHRyaWdnZXJlZEJ5IF0gKTtcblx0XHR9LFxuXHRcdGRlc3Ryb3lUaXBweUluc3RhbmNlczogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy51c2VfdGlwcHlqcyApIHtcblx0XHRcdFx0Ly8gQHNvdXJjZSBodHRwczovL2dpdGh1Yi5jb20vYXRvbWlrcy90aXBweWpzL2lzc3Vlcy80NzNcblx0XHRcdFx0dGlwcHlJbnN0YW5jZXMuZm9yRWFjaCggaW5zdGFuY2UgPT4ge1xuXHRcdFx0XHRcdGluc3RhbmNlLmRlc3Ryb3koKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0XHR0aXBweUluc3RhbmNlcy5sZW5ndGggPSAwOyAvLyBjbGVhciBpdFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Ly8gVGhpbmdzIGFyZSBkb25lIGJlZm9yZSB1cGRhdGluZyB0aGUgcHJvZHVjdHMgbGlrZSBoaWRpbmcgdGhlIGxvYWRpbmcgaW5kaWNhdG9yLlxuXHRcdGJlZm9yZVVwZGF0aW5nUHJvZHVjdHM6IGZ1bmN0aW9uKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICkge1xuXHRcdFx0V0NBUEYucmVzZXRMb2FkaW5nQW5pbWF0aW9uKCk7XG5cblx0XHRcdC8vIE1heWJlIGdvb2QgZm9yIHBlcmZvcm1hbmNlLlxuXHRcdFx0V0NBUEYuZGVzdHJveVRpcHB5SW5zdGFuY2VzKCk7XG5cblx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfdXBkYXRpbmdfcHJvZHVjdHMnLCBbICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgXSApO1xuXHRcdH0sXG5cdFx0YWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzOiBmdW5jdGlvbiggJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSApIHtcblx0XHRcdFdDQVBGLnVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQoICRyZXNwb25zZSApO1xuXG5cdFx0XHQvLyBSZXN0b3JlIHRoZSBmb2N1cyAoTWF5YmUgcmVzdG9yaW5nIHRoZSBmb2N1cyBpbiBtb2JpbGUgZGV2aWNlIGlzbid0IGdvb2QpLlxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucmVzdG9yZV9mb2N1c19hZnRlcl9maWx0ZXJpbmcgJiYgISB3Y2FwZl9wYXJhbXMuaXNfbW9iaWxlICkge1xuXHRcdFx0XHRpZiAoIGRvY3VtZW50LmJvZHkgIT09IGZvY3VzZWRFbG0gKSB7XG5cdFx0XHRcdFx0aWYgKCBmb2N1c2VkRWxtLmlkICkge1xuXHRcdFx0XHRcdFx0JCggYCMkeyBmb2N1c2VkRWxtLmlkIH1gICkuZm9jdXMoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVpbml0aWFsaXplIHdjYXBmLlxuXHRcdFx0V0NBUEYuaW5pdCgpO1xuXG5cdFx0XHQvLyBTY3JvbGwgaW50byB2aWV3LlxuXHRcdFx0aWYgKCAncGFnaW5hdGUnID09PSB0cmlnZ2VyZWRCeSAmJiB3Y2FwZl9wYXJhbXMuaW1tZWRpYXRlX3Njcm9sbF9vbl9wYWdpbmF0ZSApIHtcblx0XHRcdFx0Ly8gRG8gbm90aGluZyBiZWNhdXNlIGl0IGFscmVhZHkgaGFwcGVuZWQuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRXQ0FQRi5zY3JvbGxUbyggdHJpZ2dlcmVkQnkgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVHJpZ2dlciBldmVudHMuXG5cdFx0XHQkKCBkb2N1bWVudCApLnRyaWdnZXIoICdyZWFkeScgKTtcblx0XHRcdCQoIHdpbmRvdyApLnRyaWdnZXIoICdzY3JvbGwnICk7XG5cdFx0XHQkKCB3aW5kb3cgKS50cmlnZ2VyKCAncmVzaXplJyApO1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5jdXN0b21fc2NyaXB0cyApIHtcblx0XHRcdFx0ZXZhbCggd2NhcGZfcGFyYW1zLmN1c3RvbV9zY3JpcHRzICk7XG5cdFx0XHR9XG5cblx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9hZnRlcl91cGRhdGluZ19wcm9kdWN0cycsIFsgJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSBdICk7XG5cdFx0fSxcblx0XHRmaWx0ZXJQcm9kdWN0czogZnVuY3Rpb24oIHRyaWdnZXJlZEJ5ID0gJ2ZpbHRlcicgKSB7XG5cdFx0XHRXQ0FQRi5iZWZvcmVGZXRjaGluZ1Byb2R1Y3RzKCB0cmlnZ2VyZWRCeSApO1xuXG5cdFx0XHQkLmFqYXgoIHtcblx0XHRcdFx0dXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0XHRcdGNvbnN0ICRyZXNwb25zZSA9ICQoIHJlc3BvbnNlICk7XG5cblx0XHRcdFx0XHRXQ0FQRi5iZWZvcmVVcGRhdGluZ1Byb2R1Y3RzKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICk7XG5cblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBVcGRhdGUgZG9jdW1lbnQgdGl0bGUuXG5cdFx0XHRcdFx0ICpcblx0XHRcdFx0XHQgKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS83NTk5NTYyXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMudXBkYXRlX2RvY3VtZW50X3RpdGxlICkge1xuXHRcdFx0XHRcdFx0ZG9jdW1lbnQudGl0bGUgPSAkcmVzcG9uc2UuZmlsdGVyKCAndGl0bGUnICkudGV4dCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgaW5zdGFuY2VzLlxuXHRcdFx0XHRcdGZvciAoIGNvbnN0IGlkIG9mIGluc3RhbmNlSWRzICkge1xuXHRcdFx0XHRcdFx0Y29uc3QgaW5zdGFuY2VJZCA9ICdbZGF0YS1pZD1cIicgKyBpZCArICdcIl0nO1xuXHRcdFx0XHRcdFx0Y29uc3QgJGluc3RhbmNlICA9ICQoIGluc3RhbmNlSWQgKTtcblx0XHRcdFx0XHRcdGNvbnN0ICRpbm5lciAgICAgPSAkaW5zdGFuY2UuZmluZCggJy53Y2FwZi1maWx0ZXItaW5uZXInICk7XG5cdFx0XHRcdFx0XHRjb25zdCBfaW5zdGFuY2UgID0gJHJlc3BvbnNlLmZpbmQoIGluc3RhbmNlSWQgKTtcblxuXHRcdFx0XHRcdFx0Ly8gUHJlc2VydmUgaGllcmFyY2h5IGFjY29yZGlvbiBzdGF0ZS5cblx0XHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJGluc3RhbmNlLmhhc0NsYXNzKCAnaGFzLWhpZXJhcmNoeS1hY2NvcmRpb24nICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JGluc3RhbmNlLmZpbmQoICcud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCAkZWwgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBpZCAgPSAkZWwuZGF0YSggJ2lkJyApO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCB0b2dnbGVTZWxlY3RvciA9IGAud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGVbZGF0YS1pZD1cIiR7IGlkIH1cIl1gO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGFjY29yZGlvbiBpcyBvcGVuZWRcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIHByZXNzZWQgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCB0b2dnbGVTZWxlY3RvciApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAndHJ1ZScgKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICkuc2hvdygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICdmYWxzZScgKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICkuaGlkZSgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBQcmVzZXJ2ZSBzb2Z0IGxpbWl0IHN0YXRlLlxuXHRcdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucHJlc2VydmVfc29mdF9saW1pdF9zdGF0ZSApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkaW5zdGFuY2UuaGFzQ2xhc3MoICdoYXMtc29mdC1saW1pdCcgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCAkbGlzdFdyYXBwZXIgPSAkaW5zdGFuY2UuZmluZCggJy53Y2FwZi1saXN0LXdyYXBwZXInICk7XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAoICRsaXN0V3JhcHBlci5oYXNDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1saXN0LXdyYXBwZXInICkuYWRkQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJyApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAndHJ1ZScgKTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtbGlzdC13cmFwcGVyJyApLnJlbW92ZUNsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLXNvZnQtbGltaXQtdHJpZ2dlcicgKS5hdHRyKCAnYXJpYS1wcmVzc2VkJywgJ2ZhbHNlJyApO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRjb25zdCBfaHRtbCA9IF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLWZpbHRlci1pbm5lcicgKS5odG1sKCk7XG5cblx0XHRcdFx0XHRcdC8vIEZpbmFsbHkgdXBkYXRlIHRoZSBpbnN0YW5jZS5cblx0XHRcdFx0XHRcdCRpbm5lci5odG1sKCBfaHRtbCApO1xuXG5cdFx0XHRcdFx0XHQkaW5zdGFuY2UudHJpZ2dlciggJ3djYXBmLWZpbHRlci11cGRhdGVkJywgWyBfaW5zdGFuY2UgXSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgYWN0aXZlIGZpbHRlcnMgYW5kIHJlc2V0IGZpbHRlcnMuXG5cdFx0XHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1hY3RpdmUtZmlsdGVycywgLndjYXBmLXJlc2V0LWZpbHRlcnMnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRjb25zdCAkdGhhdCAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdFx0Y29uc3QgaW5zdGFuY2VJZCA9ICdbZGF0YS1pZD1cIicgKyAkdGhhdC5kYXRhKCAnaWQnICkgKyAnXCJdJztcblxuXHRcdFx0XHRcdFx0JHRoYXQuaHRtbCggJHJlc3BvbnNlLmZpbmQoIGluc3RhbmNlSWQgKS5odG1sKCkgKTtcblx0XHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0XHQvLyBSZXBsYWNlIG9sZCBzaG9wIGxvb3Agd2l0aCBuZXcgb25lLlxuXHRcdFx0XHRcdGNvbnN0ICRzaG9wTG9vcENvbnRhaW5lciA9ICRyZXNwb25zZS5maW5kKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0XHRcdGNvbnN0ICRub3RGb3VuZENvbnRhaW5lciA9ICRyZXNwb25zZS5maW5kKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApO1xuXG5cdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciA9PT0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0V0NBUEYuYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdHJlcXVlc3RGaWx0ZXI6IGZ1bmN0aW9uKCB1cmwsIHRyaWdnZXJlZEJ5ID0gJ2ZpbHRlcicgKSB7XG5cdFx0XHRpZiAoICEgdXJsICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGhvc3RuYW1lID0gbG9jYXRpb24uaG9zdG5hbWU7XG5cblx0XHRcdC8vIFRPRE86IFJlbW92ZSBmcm9tIHByb2R1Y3Rpb24gYnVpbGQuXG5cdFx0XHRpZiAoICdsb2NhbGhvc3QnID09PSBob3N0bmFtZSApIHtcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoICdodHRwOi8vd2NmaWx0ZXItMi50ZXN0JywgJy8vbG9jYWxob3N0OjMwMDEnICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJsO1xuXG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSggeyB3Y2FwZjogdHJ1ZSB9LCAnJywgdXJsICk7XG5cblx0XHRcdFdDQVBGLmZpbHRlclByb2R1Y3RzKCB0cmlnZ2VyZWRCeSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlTnVtYmVySW5wdXRGaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHJhbmdlTnVtYmVyU2VsZWN0b3JzID0gJy53Y2FwZi1yYW5nZS1udW1iZXIgLm1pbi12YWx1ZSwgLndjYXBmLXJhbmdlLW51bWJlciAubWF4LXZhbHVlJztcblxuXHRcdFx0JGJvZHkub24oICdpbnB1dCcsIHJhbmdlTnVtYmVyU2VsZWN0b3JzLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Y29uc3QgJHJhbmdlTnVtYmVyICAgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXJhbmdlLW51bWJlcicgKTtcblx0XHRcdFx0Y29uc3QgZm9ybWF0TnVtYmVycyAgICAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZm9ybWF0LW51bWJlcnMnICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgb2xkTWluVmFsdWUgICAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IG9sZE1heFZhbHVlICAgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsUGxhY2VzICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRcdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1kZWNpbWFsLXNlcGFyYXRvcicgKTtcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRjb25zdCBnZXRWYWx1ZSA9ICggZmxvYXRWYWx1ZSApID0+IHtcblx0XHRcdFx0XHRpZiAoIGZvcm1hdE51bWJlcnMgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVtYmVyRm9ybWF0KCBmbG9hdFZhbHVlLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBmbG9hdFZhbHVlO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpdGVtLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGxldCBtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoKSApO1xuXHRcdFx0XHRcdGxldCBtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoKSApO1xuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdFx0XHRpZiAoIGlzTmFOKCBtaW5WYWx1ZSApICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRcdFx0aWYgKCBpc05hTiggbWF4VmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSByYW5nZU1pblZhbHVlLlxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPCByYW5nZU1pblZhbHVlICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA+IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdFx0XHRpZiAoIG1heFZhbHVlID4gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSBtaW5WYWx1ZS5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID4gbWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IG1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIElmIHZhbHVlIGlzIG5vdCBjaGFuZ2VkIHRoZW4gZG9uJ3QgcHJvY2VlZC5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID09PSBvbGRNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gb2xkTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdC8vIFJlbW92ZSByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkcmFuZ2VOdW1iZXIuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdGNvbnN0IHVybCA9ICRyYW5nZU51bWJlci5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclMXMnLCBtaW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVEYXRlSW5wdXRGaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgJy53Y2FwZi1kYXRlLWlucHV0IC5kYXRlLWlucHV0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWx0ZXIgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXHRcdFx0XHRjb25zdCBpc1JhbmdlID0gJGZpbHRlci5kYXRhKCAnaXMtcmFuZ2UnICk7XG5cblx0XHRcdFx0bGV0IGZpbHRlclVybCA9ICcnO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRmaWx0ZXIuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0aWYgKCBpc1JhbmdlICkge1xuXHRcdFx0XHRcdGNvbnN0IGZyb20gPSAkZmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApLnZhbCgpO1xuXHRcdFx0XHRcdGNvbnN0IHRvICAgPSAkZmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKS52YWwoKTtcblxuXHRcdFx0XHRcdGlmICggZnJvbSAmJiB0byApIHtcblx0XHRcdFx0XHRcdGZpbHRlclVybCA9ICRmaWx0ZXIuZGF0YSggJ3VybCcgKS5yZXBsYWNlKCAnJTFzJywgZnJvbSApLnJlcGxhY2UoICclMnMnLCB0byApO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoICEgZnJvbSAmJiAhIHRvICkge1xuXHRcdFx0XHRcdFx0ZmlsdGVyVXJsID0gJGZpbHRlci5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc3QgZnJvbSA9ICRmaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICkudmFsKCk7XG5cblx0XHRcdFx0XHRpZiAoIGZyb20gKSB7XG5cdFx0XHRcdFx0XHRmaWx0ZXJVcmwgPSAkZmlsdGVyLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyVzJywgZnJvbSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRmaWx0ZXJVcmwgPSAkZmlsdGVyLmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggZmlsdGVyVXJsICkge1xuXHRcdFx0XHRcdCRmaWx0ZXIuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkZmlsdGVyLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggZmlsdGVyVXJsICk7XG5cdFx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVMaXN0RmlsdGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCBuYXRpdmVJbnB1dHMgPSAnLmxpc3QtdHlwZS1uYXRpdmUgW3R5cGU9XCJjaGVja2JveFwiXSwnICtcblx0XHRcdFx0Jy5saXN0LXR5cGUtbmF0aXZlIFt0eXBlPVwicmFkaW9cIl0sJyArXG5cdFx0XHRcdCcubGlzdC10eXBlLWN1c3RvbS1jaGVja2JveCBbdHlwZT1cImNoZWNrYm94XCJdJztcblxuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCBuYXRpdmVJbnB1dHMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXItaXRlbScgKS50b2dnbGVDbGFzcyggJ2l0ZW0tYWN0aXZlJyApO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5kYXRhKCAndXJsJyApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGNvbnN0IGN1c3RvbVJhZGlvU2VsZWN0b3IgPSAnLmxpc3QtdHlwZS1jdXN0b20tcmFkaW8nO1xuXG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsIGN1c3RvbVJhZGlvU2VsZWN0b3IgKyAnIFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyLWl0ZW0nICkudG9nZ2xlQ2xhc3MoICdpdGVtLWFjdGl2ZScgKTtcblxuXHRcdFx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTgzOTkyNFxuXHRcdFx0XHQkKCB0aGlzIClcblx0XHRcdFx0XHQuY2xvc2VzdCggY3VzdG9tUmFkaW9TZWxlY3RvciApXG5cdFx0XHRcdFx0LmZpbmQoICcud2NhcGYtZmlsdGVyLWl0ZW0uaXRlbS1hY3RpdmUgW3R5cGU9XCJjaGVja2JveFwiXScgKVxuXHRcdFx0XHRcdC5ub3QoIHRoaXMgKVxuXHRcdFx0XHRcdC5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlIClcblx0XHRcdFx0XHQuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXItaXRlbScgKVxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcyggJ2l0ZW0tYWN0aXZlJyApO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5kYXRhKCAndXJsJyApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVEcm9wZG93bkZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCAnLndjYXBmLWRyb3Bkb3duLXdyYXBwZXIgc2VsZWN0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRzZWxlY3QgICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCB2YWx1ZXMgICAgICAgICA9ICRzZWxlY3QudmFsKCk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlclVSTCAgICAgID0gJHNlbGVjdC5kYXRhKCAndXJsJyApO1xuXHRcdFx0XHRjb25zdCBjbGVhckZpbHRlclVSTCA9ICRzZWxlY3QuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICk7XG5cdFx0XHRcdGxldCB1cmw7XG5cblx0XHRcdFx0aWYgKCB2YWx1ZXMubGVuZ3RoICkge1xuXHRcdFx0XHRcdHVybCA9IGZpbHRlclVSTC5yZXBsYWNlKCAnJXMnLCB2YWx1ZXMudG9TdHJpbmcoKSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHVybCA9IGNsZWFyRmlsdGVyVVJMO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVQYWdpbmF0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4ICYmIHdjYXBmX3BhcmFtcy5wYWdpbmF0aW9uX2NvbnRhaW5lciApIHtcblx0XHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRcdGNvbnN0IF9zZWxlY3RvcnMgPSB3Y2FwZl9wYXJhbXMucGFnaW5hdGlvbl9jb250YWluZXIuc3BsaXQoICcsJyApO1xuXHRcdFx0XHRjb25zdCBzZWxlY3RvcnMgID0gW107XG5cblx0XHRcdFx0X3NlbGVjdG9ycy5mb3JFYWNoKCBzZWxlY3RvciA9PiB7XG5cdFx0XHRcdFx0aWYgKCBzZWxlY3RvciApIHtcblx0XHRcdFx0XHRcdHNlbGVjdG9ycy5wdXNoKCBzZWxlY3RvciArICcgYScgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRjb25zdCBzZWxlY3RvciA9IHNlbGVjdG9ycy5qb2luKCAnLCcgKTtcblxuXHRcdFx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdCRjb250YWluZXIub24oICdjbGljaycsIHNlbGVjdG9yLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgaHJlZiA9ICQoIHRoaXMgKS5hdHRyKCAnaHJlZicgKTtcblxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggaHJlZiwgJ3BhZ2luYXRlJyApO1xuXHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aGFuZGxlRGVmYXVsdE9yZGVyYnk6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5zb3J0aW5nX2NvbnRyb2wgKSB7XG5cdFx0XHRcdC8vIFN1Ym1pdCB0aGUgb3JkZXJieSBmb3JtIHdoZW4gdmFsdWUgaXMgY2hhbmdlZC5cblx0XHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nIHNlbGVjdC5vcmRlcmJ5JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCggdGhpcyApLmNsb3Nlc3QoICdmb3JtJyApLnRyaWdnZXIoICdzdWJtaXQnICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFByZXZlbnQgdGhlIGF1dG8gc3VibWlzc2lvbiBvZiB0aGUgb3JkZXJieSBmb3JtLlxuXHRcdFx0JGJvZHkub24oICdzdWJtaXQnLCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCB2aWEgYWpheCB3aGVuIHRoZSBvcmRlcmJ5IHZhbHVlIGlzIGNoYW5nZWQuXG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsICcud29vY29tbWVyY2Utb3JkZXJpbmcgc2VsZWN0Lm9yZGVyYnknLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3Qgb3JkZXIgPSAkKCB0aGlzICkudmFsKCk7XG5cblx0XHRcdFx0Y29uc3QgdXJsID0gbmV3IFVSTCggd2luZG93LmxvY2F0aW9uICk7XG5cdFx0XHRcdHVybC5zZWFyY2hQYXJhbXMuc2V0KCAnb3JkZXJieScsIG9yZGVyICk7XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggZ2V0T3JkZXJCeVVybCggdXJsLmhyZWYgKSApO1xuXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZUNsZWFyRmlsdGVyOiBmdW5jdGlvbigpIHtcblx0XHRcdCRib2R5Lm9uKCAnY2xpY2snLCAnLndjYXBmLWZpbHRlci1jbGVhci1idG4nLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkKCB0aGlzICkuYXR0ciggJ2RhdGEtY2xlYXItZmlsdGVyLXVybCcgKSApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlRmlsdGVyVG9vbHRpcDogZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkUmVmZXJlbmNlXG5cdFx0XHRpZiAoICdmdW5jdGlvbicgIT09IHR5cGVvZiB0aXBweSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLnVzZV90aXBweWpzICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRSZWZlcmVuY2Vcblx0XHRcdHRpcHB5KCAnLndjYXBmLWZpbHRlci10b29sdGlwJywge1xuXHRcdFx0XHRwbGFjZW1lbnQ6ICd0b3AnLFxuXHRcdFx0XHRjb250ZW50KCByZWZlcmVuY2UgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlZmVyZW5jZS5nZXRBdHRyaWJ1dGUoICdkYXRhLWNvbnRlbnQnICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGFsbG93SFRNTDogdHJ1ZSxcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXRDb21ib2JveDogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgalF1ZXJ5KCkuY2hvc2VuV0NBUEYgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgdGVtcGxhdGVSZXN1bHQgPSAoIHRleHQsIGRhdGEgKSA9PiB7XG5cdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0JzxzcGFuPicgKyB0ZXh0ICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cIndjYXBmLWNvdW50XCI+JyArIGRhdGFbICdjb3VudE1hcmt1cCcgXSArICc8L3NwYW4+Jyxcblx0XHRcdFx0XS5qb2luKCAnJyApO1xuXHRcdFx0fTtcblxuXHRcdFx0Y29uc3QgdGVtcGxhdGVTZWxlY3Rpb24gPSAoIHRleHQsIGRhdGEgKSA9PiB7XG5cdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwid2NhcGYtY291bnQtJyArIGRhdGEuY291bnQgKyAnXCI+JyArIHRleHQgKyAnPC9zcGFuPicsXG5cdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwid2NhcGYtY291bnQgd2NhcGYtY291bnQtJyArIGRhdGEuY291bnQgKyAnXCI+JyArIGRhdGFbICdjb3VudE1hcmt1cCcgXSArICc8L3NwYW4+Jyxcblx0XHRcdFx0XS5qb2luKCAnJyApO1xuXHRcdFx0fTtcblxuXHRcdFx0Y29uc3QgZGVmYXVsdHMgPSB7XG5cdFx0XHRcdGluaGVyaXRfc2VsZWN0X2NsYXNzZXM6IHRydWUsXG5cdFx0XHRcdGluaGVyaXRfb3B0aW9uX2NsYXNzZXM6IHRydWUsXG5cdFx0XHRcdG5vX3Jlc3VsdHNfdGV4dDogd2NhcGZfcGFyYW1zLmNob3Nlbl9ub19yZXN1bHRzX3RleHQsXG5cdFx0XHRcdG9wdGlvbnNfbm9uZV90ZXh0OiB3Y2FwZl9wYXJhbXMuY2hvc2VuX29wdGlvbnNfbm9uZV90ZXh0LFxuXHRcdFx0XHRzZWFyY2hfY29udGFpbnM6IHRydWUsIC8vIE1hdGNoIGZyb20gYW55d2hlcmUgaW4gc3RyaW5nLlxuXHRcdFx0XHRzZWFyY2hfaW5fdmFsdWVzOiB0cnVlLCAvLyBTZWFyY2ggaW4gdmFsdWVzIGFsc28uXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5pc19ydGwgKSB7XG5cdFx0XHRcdGRlZmF1bHRzWyAncnRsJyBdID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1jaG9zZW4nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0aGlzICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7IC4uLmRlZmF1bHRzIH07XG5cblx0XHRcdFx0Ly8gSWYgaGllcmFyY2h5IGVuYWJsZWQgdGhlbiB3ZSBzaG93IHRoZSBzZWxlY3RlZCBvcHRpb25zLlxuXHRcdFx0XHRpZiAoICR0aGlzLmhhc0NsYXNzKCAnaGFzLWhpZXJhcmNoeScgKSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJyBdID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJyBdID0gd2NhcGZfcGFyYW1zLmNob3Nlbl9kaXNwbGF5X3NlbGVjdGVkX29wdGlvbnM7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBFbmFibGUgdGVtcGxhdGluZyB3aGVuIHNob3dpbmcgY291bnQuXG5cdFx0XHRcdGlmICggJHRoaXMuaGFzQ2xhc3MoICd3aXRoLWNvdW50JyApICkge1xuXHRcdFx0XHRcdG9wdGlvbnNbICd0ZW1wbGF0ZVJlc3VsdCcgXSAgICA9IHRlbXBsYXRlUmVzdWx0O1xuXHRcdFx0XHRcdG9wdGlvbnNbICd0ZW1wbGF0ZVNlbGVjdGlvbicgXSA9IHRlbXBsYXRlU2VsZWN0aW9uO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gRGlzYWJsZSBzZWFyY2ggYm94LlxuXHRcdFx0XHRpZiAoICEgJHRoaXMuZGF0YSggJ2VuYWJsZS1zZWFyY2gnICkgKSB7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ2Rpc2FibGVfc2VhcmNoJyBdID0gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCR0aGlzLmNob3NlbldDQVBGKCBvcHRpb25zICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIEF0dGFjaCBjaG9zZW4gZm9yIGRlZmF1bHQgb3JkZXJieS5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmF0dGFjaF9jaG9zZW5fb25fc29ydGluZyApIHtcblx0XHRcdFx0bGV0IGRpc2FibGVTZWFyY2ggPSB0cnVlO1xuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnNlYXJjaF9ib3hfaW5fZGVmYXVsdF9vcmRlcmJ5ICkge1xuXHRcdFx0XHRcdGRpc2FibGVTZWFyY2ggPSBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7IC4uLmRlZmF1bHRzIH07XG5cblx0XHRcdFx0b3B0aW9uc1sgJ2Rpc2FibGVfc2VhcmNoJyBdID0gZGlzYWJsZVNlYXJjaDtcblxuXHRcdFx0XHQkYm9keS5maW5kKCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nIHNlbGVjdC5vcmRlcmJ5JyApLmNob3NlbldDQVBGKCBvcHRpb25zICk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRpbml0UmFuZ2VTbGlkZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG5vVWlTbGlkZXIgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1yYW5nZS1zbGlkZXInICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRpdGVtICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0ICRzbGlkZXIgPSAkaXRlbS5maW5kKCAnLndjYXBmLW5vdWktc2xpZGVyJyApO1xuXG5cdFx0XHRcdGNvbnN0IHNsaWRlcklkICAgICAgICAgID0gJHNsaWRlci5hdHRyKCAnaWQnICk7XG5cdFx0XHRcdGNvbnN0IGRpc3BsYXlWYWx1ZXNBcyAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGlzcGxheS12YWx1ZXMtYXMnICk7XG5cdFx0XHRcdGNvbnN0IGZvcm1hdE51bWJlcnMgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZm9ybWF0LW51bWJlcnMnICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IHN0ZXAgICAgICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtc3RlcCcgKSApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsUGxhY2VzICAgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtcGxhY2VzJyApO1xuXHRcdFx0XHRjb25zdCB0aG91c2FuZFNlcGFyYXRvciA9ICRpdGVtLmF0dHIoICdkYXRhLXRob3VzYW5kLXNlcGFyYXRvcicgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFNlcGFyYXRvciAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXNlcGFyYXRvcicgKTtcblx0XHRcdFx0Y29uc3QgbWluVmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgJG1pblZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1pbi12YWx1ZScgKTtcblx0XHRcdFx0Y29uc3QgJG1heFZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1heC12YWx1ZScgKTtcblxuXHRcdFx0XHRjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggc2xpZGVySWQgKTtcblxuXHRcdFx0XHRub1VpU2xpZGVyLmNyZWF0ZSggc2xpZGVyLCB7XG5cdFx0XHRcdFx0c3RhcnQ6IFsgbWluVmFsdWUsIG1heFZhbHVlIF0sXG5cdFx0XHRcdFx0c3RlcCxcblx0XHRcdFx0XHRjb25uZWN0OiB0cnVlLFxuXHRcdFx0XHRcdGNzc1ByZWZpeDogJ3djYXBmLW5vdWktJyxcblx0XHRcdFx0XHRyYW5nZToge1xuXHRcdFx0XHRcdFx0J21pbic6IHJhbmdlTWluVmFsdWUsXG5cdFx0XHRcdFx0XHQnbWF4JzogcmFuZ2VNYXhWYWx1ZSxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ3VwZGF0ZScsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdFx0bGV0IG1pblZhbHVlO1xuXHRcdFx0XHRcdGxldCBtYXhWYWx1ZTtcblxuXHRcdFx0XHRcdGlmICggZm9ybWF0TnVtYmVycyApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gbnVtYmVyRm9ybWF0KCB2YWx1ZXNbIDAgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gbnVtYmVyRm9ybWF0KCB2YWx1ZXNbIDEgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDAgXSApO1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDEgXSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggJ3BsYWluX3RleHQnID09PSBkaXNwbGF5VmFsdWVzQXMgKSB7XG5cdFx0XHRcdFx0XHQkbWluVmFsdWUuaHRtbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHRcdCRtYXhWYWx1ZS5odG1sKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkbWluVmFsdWUudmFsKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdFx0JG1heFZhbHVlLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGYtbm91aXNsaWRlci11cGRhdGUnLCBbICRpdGVtLCB2YWx1ZXMgXSApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICkge1xuXHRcdFx0XHRcdGNvbnN0IF9taW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0Y29uc3QgX21heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblxuXHRcdFx0XHRcdC8vIElmIHZhbHVlIGlzIG5vdCBjaGFuZ2VkIHRoZW4gZG9uJ3QgcHJvY2VlZC5cblx0XHRcdFx0XHRpZiAoIF9taW5WYWx1ZSA9PT0gbWluVmFsdWUgJiYgX21heFZhbHVlID09PSBtYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIF9taW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBfbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHQvLyBSZW1vdmUgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJGl0ZW0uZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdGNvbnN0IHVybCA9ICRpdGVtLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIF9taW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBfbWF4VmFsdWUgKTtcblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtaW5WYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG1pblZhbHVlLCBudWxsIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkbWF4VmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRcdGNsZWFyVGltZW91dCggJGlucHV0LmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBudWxsLCBtYXhWYWx1ZSBdICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRpbml0RGF0ZXBpY2tlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgalF1ZXJ5KCkuZGF0ZXBpY2tlciApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCAkd2NhcGZEYXRlRmlsdGVyID0gJGJvZHkuZmluZCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXG5cdFx0XHRjb25zdCBmb3JtYXQgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLWZvcm1hdCcgKTtcblx0XHRcdGNvbnN0IHllYXJEcm9wZG93biAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtcGlja2VyLXllYXItZHJvcGRvd24nICk7XG5cdFx0XHRjb25zdCBtb250aERyb3Bkb3duID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLXBpY2tlci1tb250aC1kcm9wZG93bicgKTtcblxuXHRcdFx0Y29uc3QgJGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApO1xuXHRcdFx0Y29uc3QgJHRvICAgPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKTtcblxuXHRcdFx0JGZyb20uZGF0ZXBpY2tlcigge1xuXHRcdFx0XHRkYXRlRm9ybWF0OiBmb3JtYXQsXG5cdFx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdFx0Y2hhbmdlTW9udGg6IG1vbnRoRHJvcGRvd24sXG5cdFx0XHR9ICk7XG5cblx0XHRcdCR0by5kYXRlcGlja2VyKCB7XG5cdFx0XHRcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdFx0Y2hhbmdlWWVhcjogeWVhckRyb3Bkb3duLFxuXHRcdFx0XHRjaGFuZ2VNb250aDogbW9udGhEcm9wZG93bixcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXRGaWx0ZXJPcHRpb25Ub29sdGlwOiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRSZWZlcmVuY2Vcblx0XHRcdGlmICggJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHRpcHB5ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMudXNlX3RpcHB5anMgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgdG9vbHRpcFBvc2l0aW9ucyA9IFsgJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCcgXTtcblxuXHRcdFx0dG9vbHRpcFBvc2l0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbiggdG9vbHRpcFBvc2l0aW9uICkge1xuXHRcdFx0XHRjb25zdCBpZGVudGlmaWVyID0gJ2RhdGEtd2NhcGYtdG9vbHRpcC0nICsgdG9vbHRpcFBvc2l0aW9uO1xuXG5cdFx0XHRcdC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRSZWZlcmVuY2Vcblx0XHRcdFx0Y29uc3QgaW5zdGFuY2VzID0gdGlwcHkoICdbJyArIGlkZW50aWZpZXIgKyAnXScsIHtcblx0XHRcdFx0XHRwbGFjZW1lbnQ6IHRvb2x0aXBQb3NpdGlvbixcblx0XHRcdFx0XHRjb250ZW50KCByZWZlcmVuY2UgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSggaWRlbnRpZmllciApO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0YWxsb3dIVE1MOiB0cnVlLFxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0d2luZG93LnRpcHB5SW5zdGFuY2VzID0gdGlwcHlJbnN0YW5jZXMuY29uY2F0KCBpbnN0YW5jZXMgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0V0NBUEYuaW5pdENvbWJvYm94KCk7XG5cdFx0XHRXQ0FQRi5pbml0UmFuZ2VTbGlkZXIoKTtcblx0XHRcdFdDQVBGLmluaXREYXRlcGlja2VyKCk7XG5cdFx0XHRXQ0FQRi5pbml0RmlsdGVyT3B0aW9uVG9vbHRpcCgpO1xuXHRcdH0sXG5cdFx0aW5pdFBvcFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnJlbG9hZF9vbl9iYWNrICYmIHdjYXBmX3BhcmFtcy5mb3VuZF93Y2FwZiApIHtcblx0XHRcdFx0aGlzdG9yeS5yZXBsYWNlU3RhdGUoIHsgd2NhcGY6IHRydWUgfSwgJycsIHdpbmRvdy5sb2NhdGlvbiApO1xuXG5cdFx0XHRcdC8vIEhhbmRsZSB0aGUgcG9wc3RhdGUgZXZlbnQoYnJvd3NlcidzIGJhY2svZm9yd2FyZClcblx0XHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdwb3BzdGF0ZScsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdGlmICggbnVsbCAhPT0gZS5zdGF0ZSAmJiBlLnN0YXRlLmhhc093blByb3BlcnR5KCAnd2NhcGYnICkgKSB7XG5cdFx0XHRcdFx0XHRXQ0FQRi5maWx0ZXJQcm9kdWN0cyggJ3BvcHN0YXRlJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICogRW5hYmxlIGl0IGlmIG5lY2Vzc2FyeS5cblx0ICpcblx0ICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzMwMDQ5MTdcblx0ICovXG5cdGlmICggJ3Njcm9sbFJlc3RvcmF0aW9uJyBpbiBoaXN0b3J5ICkge1xuXHRcdC8vIGhpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb24gPSAnbWFudWFsJztcblx0fVxuXG59KCBqUXVlcnksIHdpbmRvdyApICk7XG5cbiggZnVuY3Rpb24oICQsIFdDQVBGICkge1xuXG5cdFdDQVBGLmluaXQoKTtcblx0V0NBUEYuaW5pdFBvcFN0YXRlKCk7XG5cblx0V0NBUEYuaGFuZGxlRmlsdGVyQWNjb3JkaW9uKCk7XG5cdFdDQVBGLmhhbmRsZUhpZXJhcmNoeVRvZ2dsZSgpO1xuXHRXQ0FQRi5oYW5kbGVTb2Z0TGltaXQoKTtcblx0V0NBUEYuaGFuZGxlU2VhcmNoRmlsdGVyT3B0aW9ucygpO1xuXG5cdFdDQVBGLmhhbmRsZUxpc3RGaWx0ZXJzKCk7XG5cdFdDQVBGLmhhbmRsZURyb3Bkb3duRmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVOdW1iZXJJbnB1dEZpbHRlcnMoKTtcblx0V0NBUEYuaGFuZGxlRGF0ZUlucHV0RmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVQYWdpbmF0aW9uKCk7XG5cdFdDQVBGLmhhbmRsZURlZmF1bHRPcmRlcmJ5KCk7XG5cblx0V0NBUEYuaGFuZGxlQ2xlYXJGaWx0ZXIoKTtcblxuXHRXQ0FQRi5oYW5kbGVGaWx0ZXJUb29sdGlwKCk7XG5cblx0LyoqXG5cdCAqIE1ha2UgaXQgY29tcGF0aWJsZSB3aXRoIG90aGVyIHBsdWdpbnMuXG5cdCAqL1xuXHQkKCAnYm9keScgKS5vbiggJ3djYXBmX2FmdGVyX3VwZGF0aW5nX3Byb2R1Y3RzJywgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gd29vLXZhcmlhdGlvbi1zd2F0Y2hlc1xuXHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggJ3dvb192YXJpYXRpb25fc3dhdGNoZXNfcHJvX2luaXQnICk7XG5cdH0gKTtcblxufSggalF1ZXJ5LCB3aW5kb3cuV0NBUEYgKSApO1xuIiwiLyoqXG4gKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNDE0MTgxM1xuICpcbiAqIEBwYXJhbSBudW1iZXJcbiAqIEBwYXJhbSBkZWNpbWFsc1xuICogQHBhcmFtIGRlY19wb2ludFxuICogQHBhcmFtIHRob3VzYW5kc19zZXBcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBudW1iZXJGb3JtYXQoIG51bWJlciwgZGVjaW1hbHMsIGRlY19wb2ludCwgdGhvdXNhbmRzX3NlcCApIHtcblx0Ly8gU3RyaXAgYWxsIGNoYXJhY3RlcnMgYnV0IG51bWVyaWNhbCBvbmVzLlxuXHRudW1iZXIgPSAoIG51bWJlciArICcnICkucmVwbGFjZSggL1teXFxkK1xcLUVlLl0vZywgJycgKTtcblxuXHRjb25zdCBuICAgID0gISBpc0Zpbml0ZSggK251bWJlciApID8gMCA6ICtudW1iZXI7XG5cdGNvbnN0IHByZWMgPSAhIGlzRmluaXRlKCArZGVjaW1hbHMgKSA/IDAgOiBNYXRoLmFicyggZGVjaW1hbHMgKTtcblx0Y29uc3Qgc2VwICA9ICggdHlwZW9mIHRob3VzYW5kc19zZXAgPT09ICd1bmRlZmluZWQnICkgPyAnLCcgOiB0aG91c2FuZHNfc2VwO1xuXHRjb25zdCBkZWMgID0gKCB0eXBlb2YgZGVjX3BvaW50ID09PSAndW5kZWZpbmVkJyApID8gJy4nIDogZGVjX3BvaW50O1xuXG5cdGxldCBzO1xuXG5cdGNvbnN0IHRvRml4ZWRGaXggPSBmdW5jdGlvbiggbiwgcHJlYyApIHtcblx0XHRjb25zdCBrID0gTWF0aC5wb3coIDEwLCBwcmVjICk7XG5cdFx0cmV0dXJuICcnICsgTWF0aC5yb3VuZCggbiAqIGsgKSAvIGs7XG5cdH07XG5cblx0Ly8gRml4IGZvciBJRSBwYXJzZUZsb2F0KDAuNTUpLnRvRml4ZWQoMCkgPSAwO1xuXHRzID0gKCBwcmVjID8gdG9GaXhlZEZpeCggbiwgcHJlYyApIDogJycgKyBNYXRoLnJvdW5kKCBuICkgKS5zcGxpdCggJy4nICk7XG5cblx0aWYgKCBzWyAwIF0ubGVuZ3RoID4gMyApIHtcblx0XHRzWyAwIF0gPSBzWyAwIF0ucmVwbGFjZSggL1xcQig/PSg/OlxcZHszfSkrKD8hXFxkKSkvZywgc2VwICk7XG5cdH1cblxuXHRpZiAoICggc1sgMSBdIHx8ICcnICkubGVuZ3RoIDwgcHJlYyApIHtcblx0XHRzWyAxIF0gPSBzWyAxIF0gfHwgJyc7XG5cdFx0c1sgMSBdICs9IG5ldyBBcnJheSggcHJlYyAtIHNbIDEgXS5sZW5ndGggKyAxICkuam9pbiggJzAnICk7XG5cdH1cblxuXHRyZXR1cm4gcy5qb2luKCBkZWMgKTtcbn1cblxuZnVuY3Rpb24gY2xlYW5VcmwoIHVybCApIHtcblx0cmV0dXJuIHVybC5yZXBsYWNlKCAvJTJDL2csICcsJyApO1xufVxuXG5mdW5jdGlvbiBnZXRPcmRlckJ5VXJsKCB1cmwgKSB7XG5cdGNvbnN0IHBhZ2VkID0gcGFyc2VJbnQoIHVybC5yZXBsYWNlKCAvLitcXC9wYWdlXFwvKFxcZCspKy8sICckMScgKSApO1xuXG5cdGlmICggcGFnZWQgKSB7XG5cdFx0dXJsID0gdXJsLnJlcGxhY2UoIC9wYWdlXFwvKFxcZCspXFwvLywgJycgKTtcblx0fVxuXG5cdHJldHVybiBjbGVhblVybCggdXJsICk7XG59XG4iXX0=
