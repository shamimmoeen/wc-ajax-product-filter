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
  'is_mobile': '',
  'reload_on_back': '',
  'found_wcapf': '',
  'wcapf_pro': '',
  'update_document_title': '',
  'use_tippyjs': '',
  'shop_loop_container': '',
  'not_found_container': '',
  'pagination_container': '',
  'disable_ajax': '',
  'enable_pagination_via_ajax': '',
  'sorting_control': '',
  'attach_chosen_on_sorting': '',
  'loading_animation': '',
  'scroll_window': '',
  'scroll_window_for': '',
  'scroll_window_when': '',
  'scroll_window_custom_element': '',
  'scroll_on': '',
  'scroll_to_top_offset': '',
  'scroll_window_delay': '',
  'disable_scroll_animation': '',
  'more_selectors': '',
  'custom_scripts': ''
};

(function ($, window) {
  var _delay = parseInt(wcapf_params.filter_input_delay);

  var delay = _delay >= 0 ? _delay : 800;
  var isPro = wcapf_params.wcapf_pro;
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
      $body.find('.wcapf-loader').addClass('is-active');

      if (!isPro && 'immediately' === wcapf_params.scroll_window_when) {
        WCAPF.scrollTo();
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


      WCAPF.init();

      if (!isPro && 'after' === wcapf_params.scroll_window_when) {
        WCAPF.scrollTo();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJ1dGlscy5qcyJdLCJuYW1lcyI6WyJ3Y2FwZl9wYXJhbXMiLCIkIiwid2luZG93IiwiX2RlbGF5IiwicGFyc2VJbnQiLCJmaWx0ZXJfaW5wdXRfZGVsYXkiLCJkZWxheSIsImlzUHJvIiwid2NhcGZfcHJvIiwiJGJvZHkiLCJpbnN0YW5jZUlkcyIsImVhY2giLCJpZCIsImRhdGEiLCJwdXNoIiwiZm9jdXNlZEVsbSIsInRpcHB5SW5zdGFuY2VzIiwiV0NBUEYiLCJoYW5kbGVGaWx0ZXJBY2NvcmRpb24iLCJ0b2dnbGVBY2NvcmRpb24iLCIkZWwiLCJwcmVzc2VkIiwiYXR0ciIsIiRmaWx0ZXJJbm5lciIsImNsb3Nlc3QiLCJjaGlsZHJlbiIsImVuYWJsZV9hbmltYXRpb25fZm9yX2ZpbHRlcl9hY2NvcmRpb24iLCJzbGlkZVRvZ2dsZSIsImZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkIiwiZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nIiwidG9nZ2xlIiwib24iLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwiJHRyaWdnZXIiLCJmaW5kIiwiaGFuZGxlSGllcmFyY2h5VG9nZ2xlIiwiJGNoaWxkIiwiZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbiIsImhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkIiwiaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nIiwia2V5IiwicHJldmVudERlZmF1bHQiLCJoYW5kbGVTb2Z0TGltaXQiLCJ0b2dnbGVGaWx0ZXJPcHRpb25zIiwiJGxpc3RXcmFwcGVyIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsImhhbmRsZVNlYXJjaEZpbHRlck9wdGlvbnMiLCIkdGhhdCIsIiRpbm5lciIsIiRmaWx0ZXIiLCJzb2Z0TGltaXRFbmFibGVkIiwiaGFzQ2xhc3MiLCJzb2Z0TGltaXRUb2dnbGUiLCJub1Jlc3VsdHMiLCJ2aXNpYmxlT3B0aW9ucyIsImtleXdvcmQiLCJ2YWwiLCJsZW5ndGgiLCJpbmRleCIsIiRmaWx0ZXJJdGVtIiwicmVtb3ZlQXR0ciIsInRleHQiLCJoaWRlIiwibGFiZWwiLCJ0b1N0cmluZyIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJzaG93IiwidXBkYXRlUHJvZHVjdHNDb3VudFJlc3VsdCIsIiRyZXNwb25zZSIsIiRjb250YWluZXIiLCJzaG9wX2xvb3BfY29udGFpbmVyIiwic2VsZWN0b3IiLCJuZXdDb3VudCIsImh0bWwiLCJoYXMiLCJzY3JvbGxUbyIsInNjcm9sbF93aW5kb3ciLCJzY3JvbGxGb3IiLCJzY3JvbGxfd2luZG93X2ZvciIsImlzTW9iaWxlIiwiaXNfbW9iaWxlIiwicHJvY2VlZCIsImFkanVzdGluZ09mZnNldCIsIm9mZnNldCIsInNjcm9sbF90b190b3Bfb2Zmc2V0IiwiY29udGFpbmVyIiwibm90X2ZvdW5kX2NvbnRhaW5lciIsInNjcm9sbF93aW5kb3dfY3VzdG9tX2VsZW1lbnQiLCJ0b3AiLCJkaXNhYmxlX3Njcm9sbF9hbmltYXRpb24iLCJzdG9wIiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsInNjcm9sbF90b190b3Bfc3BlZWQiLCJzY3JvbGxfdG9fdG9wX2Vhc2luZyIsImJlZm9yZUZldGNoaW5nUHJvZHVjdHMiLCJ0cmlnZ2VyZWRCeSIsImRvY3VtZW50IiwiYWN0aXZlRWxlbWVudCIsInNjcm9sbF93aW5kb3dfd2hlbiIsInRyaWdnZXIiLCJkZXN0cm95VGlwcHlJbnN0YW5jZXMiLCJ1c2VfdGlwcHlqcyIsImZvckVhY2giLCJpbnN0YW5jZSIsImRlc3Ryb3kiLCJiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzIiwiYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzIiwicmVzdG9yZV9mb2N1c19hZnRlcl9maWx0ZXJpbmciLCJib2R5IiwiZm9jdXMiLCJpbml0IiwiY3VzdG9tX3NjcmlwdHMiLCJldmFsIiwiZmlsdGVyUHJvZHVjdHMiLCJhamF4IiwidXJsIiwibG9jYXRpb24iLCJocmVmIiwic3VjY2VzcyIsInJlc3BvbnNlIiwidXBkYXRlX2RvY3VtZW50X3RpdGxlIiwidGl0bGUiLCJmaWx0ZXIiLCJpbnN0YW5jZUlkIiwiJGluc3RhbmNlIiwiX2luc3RhbmNlIiwicHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSIsInRvZ2dsZVNlbGVjdG9yIiwicHJlc2VydmVfc29mdF9saW1pdF9zdGF0ZSIsIl9odG1sIiwiJHNob3BMb29wQ29udGFpbmVyIiwiJG5vdEZvdW5kQ29udGFpbmVyIiwicmVxdWVzdEZpbHRlciIsImhvc3RuYW1lIiwicmVwbGFjZSIsImRpc2FibGVfYWpheCIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJ3Y2FwZiIsImhhbmRsZU51bWJlcklucHV0RmlsdGVycyIsInJhbmdlTnVtYmVyU2VsZWN0b3JzIiwiJGl0ZW0iLCIkcmFuZ2VOdW1iZXIiLCJmb3JtYXROdW1iZXJzIiwicmFuZ2VNaW5WYWx1ZSIsInBhcnNlRmxvYXQiLCJyYW5nZU1heFZhbHVlIiwib2xkTWluVmFsdWUiLCJvbGRNYXhWYWx1ZSIsImRlY2ltYWxQbGFjZXMiLCJ0aG91c2FuZFNlcGFyYXRvciIsImRlY2ltYWxTZXBhcmF0b3IiLCJjbGVhclRpbWVvdXQiLCJnZXRWYWx1ZSIsImZsb2F0VmFsdWUiLCJudW1iZXJGb3JtYXQiLCJzZXRUaW1lb3V0IiwicmVtb3ZlRGF0YSIsIm1pblZhbHVlIiwibWF4VmFsdWUiLCJpc05hTiIsImhhbmRsZURhdGVJbnB1dEZpbHRlcnMiLCJpc1JhbmdlIiwiZmlsdGVyVXJsIiwiZnJvbSIsInRvIiwiaGFuZGxlTGlzdEZpbHRlcnMiLCJuYXRpdmVJbnB1dHMiLCJ0b2dnbGVDbGFzcyIsImN1c3RvbVJhZGlvU2VsZWN0b3IiLCJub3QiLCJwcm9wIiwiaGFuZGxlRHJvcGRvd25GaWx0ZXJzIiwiJHNlbGVjdCIsInZhbHVlcyIsImZpbHRlclVSTCIsImNsZWFyRmlsdGVyVVJMIiwiaGFuZGxlUGFnaW5hdGlvbiIsImVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4IiwicGFnaW5hdGlvbl9jb250YWluZXIiLCJfc2VsZWN0b3JzIiwic3BsaXQiLCJzZWxlY3RvcnMiLCJqb2luIiwiaGFuZGxlRGVmYXVsdE9yZGVyYnkiLCJzb3J0aW5nX2NvbnRyb2wiLCJvcmRlciIsIlVSTCIsInNlYXJjaFBhcmFtcyIsInNldCIsImdldE9yZGVyQnlVcmwiLCJoYW5kbGVDbGVhckZpbHRlciIsImhhbmRsZUZpbHRlclRvb2x0aXAiLCJ0aXBweSIsInBsYWNlbWVudCIsImNvbnRlbnQiLCJyZWZlcmVuY2UiLCJnZXRBdHRyaWJ1dGUiLCJhbGxvd0hUTUwiLCJpbml0Q29tYm9ib3giLCJqUXVlcnkiLCJjaG9zZW5XQ0FQRiIsInRlbXBsYXRlUmVzdWx0IiwidGVtcGxhdGVTZWxlY3Rpb24iLCJjb3VudCIsImRlZmF1bHRzIiwiaW5oZXJpdF9zZWxlY3RfY2xhc3NlcyIsImluaGVyaXRfb3B0aW9uX2NsYXNzZXMiLCJub19yZXN1bHRzX3RleHQiLCJjaG9zZW5fbm9fcmVzdWx0c190ZXh0Iiwib3B0aW9uc19ub25lX3RleHQiLCJjaG9zZW5fb3B0aW9uc19ub25lX3RleHQiLCJzZWFyY2hfY29udGFpbnMiLCJzZWFyY2hfaW5fdmFsdWVzIiwiaXNfcnRsIiwiJHRoaXMiLCJvcHRpb25zIiwiY2hvc2VuX2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucyIsImF0dGFjaF9jaG9zZW5fb25fc29ydGluZyIsImRpc2FibGVTZWFyY2giLCJzZWFyY2hfYm94X2luX2RlZmF1bHRfb3JkZXJieSIsImluaXRSYW5nZVNsaWRlciIsIm5vVWlTbGlkZXIiLCIkc2xpZGVyIiwic2xpZGVySWQiLCJkaXNwbGF5VmFsdWVzQXMiLCJzdGVwIiwiJG1pblZhbHVlIiwiJG1heFZhbHVlIiwic2xpZGVyIiwiZ2V0RWxlbWVudEJ5SWQiLCJjcmVhdGUiLCJzdGFydCIsImNvbm5lY3QiLCJjc3NQcmVmaXgiLCJyYW5nZSIsImZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIiLCJfbWluVmFsdWUiLCJfbWF4VmFsdWUiLCIkaW5wdXQiLCJnZXQiLCJpbml0RGF0ZXBpY2tlciIsImRhdGVwaWNrZXIiLCIkd2NhcGZEYXRlRmlsdGVyIiwiZm9ybWF0IiwieWVhckRyb3Bkb3duIiwibW9udGhEcm9wZG93biIsIiRmcm9tIiwiJHRvIiwiZGF0ZUZvcm1hdCIsImNoYW5nZVllYXIiLCJjaGFuZ2VNb250aCIsImluaXRGaWx0ZXJPcHRpb25Ub29sdGlwIiwidG9vbHRpcFBvc2l0aW9ucyIsInRvb2x0aXBQb3NpdGlvbiIsImlkZW50aWZpZXIiLCJpbnN0YW5jZXMiLCJjb25jYXQiLCJpbml0UG9wU3RhdGUiLCJyZWxvYWRfb25fYmFjayIsImZvdW5kX3djYXBmIiwicmVwbGFjZVN0YXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInN0YXRlIiwiaGFzT3duUHJvcGVydHkiLCJudW1iZXIiLCJkZWNpbWFscyIsImRlY19wb2ludCIsInRob3VzYW5kc19zZXAiLCJuIiwiaXNGaW5pdGUiLCJwcmVjIiwiTWF0aCIsImFicyIsInNlcCIsImRlYyIsInMiLCJ0b0ZpeGVkRml4IiwiayIsInBvdyIsInJvdW5kIiwiQXJyYXkiLCJjbGVhblVybCIsInBhZ2VkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSxZQUFZLEdBQUdBLFlBQVksSUFBSTtBQUNwQyxZQUFVLEVBRDBCO0FBRXBDLHdCQUFzQixFQUZjO0FBR3BDLHFDQUFtQyxFQUhDO0FBSXBDLDRCQUEwQixFQUpVO0FBS3BDLDhCQUE0QixFQUxRO0FBTXBDLG1DQUFpQyxFQU5HO0FBT3BDLHdDQUFzQyxFQVBGO0FBUXBDLCtCQUE2QixFQVJPO0FBU3BDLDJDQUF5QyxFQVRMO0FBVXBDLHNDQUFvQyxFQVZBO0FBV3BDLHVDQUFxQyxFQVhEO0FBWXBDLDhDQUE0QyxFQVpSO0FBYXBDLHlDQUF1QyxFQWJIO0FBY3BDLDBDQUF3QyxFQWRKO0FBZXBDLG1DQUFpQyxFQWZHO0FBZ0JwQyx5QkFB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QUFFRCxNQUFLLENBQUVFLENBQUMsQ0FBRSxDQUFGLENBQUQsSUFBVSxFQUFaLEVBQWlCN04sTUFBakIsR0FBMEJ3TixJQUEvQixFQUFzQztBQUNyQ0ssSUFBQUEsQ0FBQyxDQUFFLENBQUYsQ0FBRCxHQUFTQSxDQUFDLENBQUUsQ0FBRixDQUFELElBQVUsRUFBbkI7QUFDQUEsSUFBQUEsQ0FBQyxDQUFFLENBQUYsQ0FBRCxJQUFVLElBQUlLLEtBQUosQ0FBV1YsSUFBSSxHQUFHSyxDQUFDLENBQUUsQ0FBRixDQUFELENBQU83TixNQUFkLEdBQXVCLENBQWxDLEVBQXNDZ0ksSUFBdEMsQ0FBNEMsR0FBNUMsQ0FBVjtBQUNBOztBQUVELFNBQU82RixDQUFDLENBQUM3RixJQUFGLENBQVE0RixHQUFSLENBQVA7QUFDQTs7QUFFRCxTQUFTTyxRQUFULENBQW1CdkssR0FBbkIsRUFBeUI7QUFDeEIsU0FBT0EsR0FBRyxDQUFDbUIsT0FBSixDQUFhLE1BQWIsRUFBcUIsR0FBckIsQ0FBUDtBQUNBOztBQUVELFNBQVN3RCxhQUFULENBQXdCM0UsR0FBeEIsRUFBOEI7QUFDN0IsTUFBTXdLLEtBQUssR0FBRzNSLFFBQVEsQ0FBRW1ILEdBQUcsQ0FBQ21CLE9BQUosQ0FBYSxrQkFBYixFQUFpQyxJQUFqQyxDQUFGLENBQXRCOztBQUVBLE1BQUtxSixLQUFMLEVBQWE7QUFDWnhLLElBQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDbUIsT0FBSixDQUFhLGVBQWIsRUFBOEIsRUFBOUIsQ0FBTjtBQUNBOztBQUVELFNBQU9vSixRQUFRLENBQUV2SyxHQUFGLENBQWY7QUFDQSIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLXB1YmxpYy1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgbWFpbiBqcyBmaWxlLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL3B1YmxpYy9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5jb25zdCB3Y2FwZl9wYXJhbXMgPSB3Y2FwZl9wYXJhbXMgfHwge1xuXHQnaXNfcnRsJzogJycsXG5cdCdmaWx0ZXJfaW5wdXRfZGVsYXknOiAnJyxcblx0J2Nob3Nlbl9kaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMnOiAnJyxcblx0J2Nob3Nlbl9ub19yZXN1bHRzX3RleHQnOiAnJyxcblx0J2Nob3Nlbl9vcHRpb25zX25vbmVfdGV4dCc6ICcnLFxuXHQnc2VhcmNoX2JveF9pbl9kZWZhdWx0X29yZGVyYnknOiAnJyxcblx0J3ByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUnOiAnJyxcblx0J3ByZXNlcnZlX3NvZnRfbGltaXRfc3RhdGUnOiAnJyxcblx0J2VuYWJsZV9hbmltYXRpb25fZm9yX2ZpbHRlcl9hY2NvcmRpb24nOiAnJyxcblx0J2ZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkJzogJycsXG5cdCdmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmcnOiAnJyxcblx0J2VuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24nOiAnJyxcblx0J2hpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkJzogJycsXG5cdCdoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmcnOiAnJyxcblx0J3Jlc3RvcmVfZm9jdXNfYWZ0ZXJfZmlsdGVyaW5nJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX3NwZWVkJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX2Vhc2luZyc6ICcnLFxuXHQnaXNfbW9iaWxlJzogJycsXG5cdCdyZWxvYWRfb25fYmFjayc6ICcnLFxuXHQnZm91bmRfd2NhcGYnOiAnJyxcblx0J3djYXBmX3Bybyc6ICcnLFxuXHQndXBkYXRlX2RvY3VtZW50X3RpdGxlJzogJycsXG5cdCd1c2VfdGlwcHlqcyc6ICcnLFxuXHQnc2hvcF9sb29wX2NvbnRhaW5lcic6ICcnLFxuXHQnbm90X2ZvdW5kX2NvbnRhaW5lcic6ICcnLFxuXHQncGFnaW5hdGlvbl9jb250YWluZXInOiAnJyxcblx0J2Rpc2FibGVfYWpheCc6ICcnLFxuXHQnZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXgnOiAnJyxcblx0J3NvcnRpbmdfY29udHJvbCc6ICcnLFxuXHQnYXR0YWNoX2Nob3Nlbl9vbl9zb3J0aW5nJzogJycsXG5cdCdsb2FkaW5nX2FuaW1hdGlvbic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvdyc6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd19mb3InOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfd2hlbic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudCc6ICcnLFxuXHQnc2Nyb2xsX29uJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX29mZnNldCc6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd19kZWxheSc6ICcnLFxuXHQnZGlzYWJsZV9zY3JvbGxfYW5pbWF0aW9uJzogJycsXG5cdCdtb3JlX3NlbGVjdG9ycyc6ICcnLFxuXHQnY3VzdG9tX3NjcmlwdHMnOiAnJyxcbn07XG5cbiggZnVuY3Rpb24oICQsIHdpbmRvdyApIHtcblxuXHRjb25zdCBfZGVsYXkgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLmZpbHRlcl9pbnB1dF9kZWxheSApO1xuXHRjb25zdCBkZWxheSAgPSBfZGVsYXkgPj0gMCA/IF9kZWxheSA6IDgwMDtcblxuXHRjb25zdCBpc1BybyA9IHdjYXBmX3BhcmFtcy53Y2FwZl9wcm87XG5cblx0Y29uc3QgJGJvZHkgPSAkKCAnYm9keScgKTtcblxuXHRjb25zdCBpbnN0YW5jZUlkcyA9IFtdO1xuXG5cdCQoICcud2NhcGYtZmlsdGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IGlkID0gJCggdGhpcyApLmRhdGEoICdpZCcgKTtcblxuXHRcdGlmICggISBpZCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpbnN0YW5jZUlkcy5wdXNoKCBpZCApO1xuXHR9ICk7XG5cblx0bGV0IGZvY3VzZWRFbG07XG5cblx0d2luZG93LnRpcHB5SW5zdGFuY2VzID0gW107XG5cblx0d2luZG93LldDQVBGID0gd2luZG93LldDQVBGIHx8IHt9O1xuXG5cdHdpbmRvdy5XQ0FQRiA9IHtcblx0XHRoYW5kbGVGaWx0ZXJBY2NvcmRpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgdG9nZ2xlQWNjb3JkaW9uID0gKCAkZWwgKSA9PiB7XG5cdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYWNjb3JkaW9uIGlzIG9wZW5lZFxuXHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLWV4cGFuZGVkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0Ly8gQ2hhbmdlIGFyaWEtZXhwYW5kZWQgdG8gdGhlIG9wcG9zaXRlIHN0YXRlXG5cdFx0XHRcdCRlbC5hdHRyKCAnYXJpYS1leHBhbmRlZCcsICEgcHJlc3NlZCApO1xuXG5cdFx0XHRcdGNvbnN0ICRmaWx0ZXJJbm5lciA9ICRlbC5jbG9zZXN0KCAnLndjYXBmLWZpbHRlcicgKS5jaGlsZHJlbiggJy53Y2FwZi1maWx0ZXItaW5uZXInICk7XG5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX2FuaW1hdGlvbl9mb3JfZmlsdGVyX2FjY29yZGlvbiApIHtcblx0XHRcdFx0XHQkZmlsdGVySW5uZXIuc2xpZGVUb2dnbGUoXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQsXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkZmlsdGVySW5uZXIudG9nZ2xlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdCRib2R5Lm9uKCAnY2xpY2snLCAnLndjYXBmLWZpbHRlci1hY2NvcmRpb24tdHJpZ2dlcicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdCRib2R5Lm9uKCAnY2xpY2snLCAnLndjYXBmLWZpbHRlci10aXRsZS5oYXMtYWNjb3JkaW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0cmlnZ2VyID0gJCggdGhpcyApLmZpbmQoICcud2NhcGYtZmlsdGVyLWFjY29yZGlvbi10cmlnZ2VyJyApO1xuXG5cdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJHRyaWdnZXIgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZUhpZXJhcmNoeVRvZ2dsZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCB0b2dnbGVBY2NvcmRpb24gPSAoICRlbCApID0+IHtcblx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBidXR0b24gaXMgcHJlc3NlZFxuXHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLXByZXNzZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHQvLyBDaGFuZ2UgYXJpYS1wcmVzc2VkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuXHRcdFx0XHQkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICEgcHJlc3NlZCApO1xuXG5cdFx0XHRcdGNvbnN0ICRjaGlsZCA9ICRlbC5jbG9zZXN0KCAnbGknICkuY2hpbGRyZW4oICd1bCcgKTtcblxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uICkge1xuXHRcdFx0XHRcdCRjaGlsZC5zbGlkZVRvZ2dsZShcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5oaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCxcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5oaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmdcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRjaGlsZC50b2dnbGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0JGJvZHlcblx0XHRcdFx0Lm9uKCAnY2xpY2snLCAnLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkKCB0aGlzICkgKTtcblx0XHRcdFx0fSApXG5cdFx0XHRcdC5vbiggJ2tleWRvd24nLCAnLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0aWYgKCBlLmtleSA9PT0gJyAnIHx8IGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnU3BhY2ViYXInICkge1xuXHRcdFx0XHRcdFx0Ly8gUHJldmVudCB0aGUgZGVmYXVsdCBhY3Rpb24gdG8gc3RvcCBzY3JvbGxpbmcgd2hlbiBzcGFjZSBpcyBwcmVzc2VkXG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVTb2Z0TGltaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgdG9nZ2xlRmlsdGVyT3B0aW9ucyA9ICggJGVsICkgPT4ge1xuXHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGJ1dHRvbiBpcyBwcmVzc2VkXG5cdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdC8vIENoYW5nZSBhcmlhLXByZXNzZWQgdG8gdGhlIG9wcG9zaXRlIHN0YXRlXG5cdFx0XHRcdCRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJywgISBwcmVzc2VkICk7XG5cblx0XHRcdFx0Y29uc3QgJGxpc3RXcmFwcGVyID0gJGVsLmNsb3Nlc3QoICcud2NhcGYtbGlzdC13cmFwcGVyJyApO1xuXG5cdFx0XHRcdGlmICggcHJlc3NlZCApIHtcblx0XHRcdFx0XHQkbGlzdFdyYXBwZXIucmVtb3ZlQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRsaXN0V3JhcHBlci5hZGRDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdCRib2R5XG5cdFx0XHRcdC5vbiggJ2NsaWNrJywgJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0b2dnbGVGaWx0ZXJPcHRpb25zKCAkKCB0aGlzICkgKTtcblx0XHRcdFx0fSApXG5cdFx0XHRcdC5vbiggJ2tleWRvd24nLCAnLndjYXBmLXNvZnQtbGltaXQtdHJpZ2dlcicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdGlmICggZS5rZXkgPT09ICcgJyB8fCBlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJ1NwYWNlYmFyJyApIHtcblx0XHRcdFx0XHRcdC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgYWN0aW9uIHRvIHN0b3Agc2Nyb2xsaW5nIHdoZW4gc3BhY2UgaXMgcHJlc3NlZFxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0XHR0b2dnbGVGaWx0ZXJPcHRpb25zKCAkKCB0aGlzICkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZVNlYXJjaEZpbHRlck9wdGlvbnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdpbnB1dCcsICcud2NhcGYtc2VhcmNoLWJveCBpbnB1dFt0eXBlPVwidGV4dFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkdGhhdCAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCAkaW5uZXIgID0gJHRoYXQuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXItaW5uZXInICk7XG5cdFx0XHRcdGNvbnN0ICRmaWx0ZXIgPSAkaW5uZXIuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXInICk7XG5cblx0XHRcdFx0Y29uc3Qgc29mdExpbWl0RW5hYmxlZCA9ICRmaWx0ZXIuaGFzQ2xhc3MoICdoYXMtc29mdC1saW1pdCcgKTtcblx0XHRcdFx0Y29uc3Qgc29mdExpbWl0VG9nZ2xlICA9ICRmaWx0ZXIuZmluZCggJy53Y2FwZi1zb2Z0LWxpbWl0LXdyYXBwZXInICk7XG5cdFx0XHRcdGNvbnN0IG5vUmVzdWx0cyAgICAgICAgPSAkZmlsdGVyLmZpbmQoICcud2NhcGYtbm8tcmVzdWx0cy10ZXh0JyApO1xuXHRcdFx0XHRjb25zdCB2aXNpYmxlT3B0aW9ucyAgID0gcGFyc2VJbnQoICRmaWx0ZXIuYXR0ciggJ2RhdGEtdmlzaWJsZS1vcHRpb25zJyApICk7XG5cblx0XHRcdFx0Y29uc3Qga2V5d29yZCA9ICR0aGF0LnZhbCgpO1xuXG5cdFx0XHRcdGlmICggISBrZXl3b3JkLmxlbmd0aCApIHtcblx0XHRcdFx0XHRsZXQgaW5kZXggPSAwO1xuXHRcdFx0XHRcdCRmaWx0ZXIucmVtb3ZlQ2xhc3MoICdzZWFyY2gtYWN0aXZlJyApO1xuXG5cdFx0XHRcdFx0JC5lYWNoKCAkaW5uZXIuZmluZCggJy53Y2FwZi1maWx0ZXItb3B0aW9ucyA+IGxpJyApLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGluZGV4Kys7XG5cblx0XHRcdFx0XHRcdGNvbnN0ICRmaWx0ZXJJdGVtID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICdrZXl3b3JkLW1hdGNoZWQnICk7XG5cblx0XHRcdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCBpbmRleCA+IHZpc2libGVPcHRpb25zICkge1xuXHRcdFx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLmFkZENsYXNzKCAnd2NhcGYtZmlsdGVyLW9wdGlvbi1oaWRkZW4nICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRcdHNvZnRMaW1pdFRvZ2dsZS5yZW1vdmVBdHRyKCAnc3R5bGUnICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bm9SZXN1bHRzLmNoaWxkcmVuKCAnc3BhbicgKS50ZXh0KCAnJyApO1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5oaWRlKCk7XG5cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgaW5kZXggPSAwO1xuXHRcdFx0XHQkZmlsdGVyLmFkZENsYXNzKCAnc2VhcmNoLWFjdGl2ZScgKTtcblxuXHRcdFx0XHQkLmVhY2goICRpbm5lci5maW5kKCAnLndjYXBmLWZpbHRlci1vcHRpb25zID4gbGknICksIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0ICRmaWx0ZXJJdGVtID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdGNvbnN0IGxhYmVsICAgICAgID0gJGZpbHRlckl0ZW0uZmluZCggJy53Y2FwZi1maWx0ZXItaXRlbS1sYWJlbCcgKS5kYXRhKCAnbGFiZWwnICk7XG5cblx0XHRcdFx0XHRpZiAoIGxhYmVsLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygga2V5d29yZC50b0xvd2VyQ2FzZSgpICkgKSB7XG5cdFx0XHRcdFx0XHRpbmRleCsrO1xuXG5cdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5hZGRDbGFzcyggJ2tleXdvcmQtbWF0Y2hlZCcgKTtcblxuXHRcdFx0XHRcdFx0aWYgKCBzb2Z0TGltaXRFbmFibGVkICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIGluZGV4ID4gdmlzaWJsZU9wdGlvbnMgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0uYWRkQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5yZW1vdmVDbGFzcyggJ3djYXBmLWZpbHRlci1vcHRpb24taGlkZGVuJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLnJlbW92ZUNsYXNzKCAna2V5d29yZC1tYXRjaGVkJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRpZiAoIGluZGV4IDw9IHZpc2libGVPcHRpb25zICkge1xuXHRcdFx0XHRcdFx0c29mdExpbWl0VG9nZ2xlLmhpZGUoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c29mdExpbWl0VG9nZ2xlLnNob3coKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIDAgPT09IGluZGV4ICkge1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5jaGlsZHJlbiggJ3NwYW4nICkudGV4dCgga2V5d29yZCApO1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bm9SZXN1bHRzLmNoaWxkcmVuKCAnc3BhbicgKS50ZXh0KCAnJyApO1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdHVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQ6IGZ1bmN0aW9uKCAkcmVzcG9uc2UgKSB7XG5cdFx0XHRjb25zdCAkY29udGFpbmVyID0gJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdGNvbnN0IHNlbGVjdG9yICAgPSAnLndvb2NvbW1lcmNlLXJlc3VsdC1jb3VudCc7XG5cdFx0XHRjb25zdCBuZXdDb3VudCAgID0gJHJlc3BvbnNlLmZpbmQoIHNlbGVjdG9yICkuaHRtbCgpO1xuXG5cdFx0XHQkYm9keS5maW5kKCBzZWxlY3RvciApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkZWwgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0aWYgKCAhICRjb250YWluZXIuaGFzKCAkZWwgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0JGVsLmh0bWwoIG5ld0NvdW50ICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdHNjcm9sbFRvOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggJ25vbmUnID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvdyApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzY3JvbGxGb3IgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19mb3I7XG5cdFx0XHRjb25zdCBpc01vYmlsZSAgPSB3Y2FwZl9wYXJhbXMuaXNfbW9iaWxlO1xuXHRcdFx0bGV0IHByb2NlZWQgICAgID0gZmFsc2U7XG5cblx0XHRcdGlmICggJ21vYmlsZScgPT09IHNjcm9sbEZvciAmJiBpc01vYmlsZSApIHtcblx0XHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0XHR9IGVsc2UgaWYgKCAnZGVza3RvcCcgPT09IHNjcm9sbEZvciAmJiAhIGlzTW9iaWxlICkge1xuXHRcdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSBpZiAoICdib3RoJyA9PT0gc2Nyb2xsRm9yICkge1xuXHRcdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhIHByb2NlZWQgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGFkanVzdGluZ09mZnNldCwgb2Zmc2V0O1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX29mZnNldCApIHtcblx0XHRcdFx0YWRqdXN0aW5nT2Zmc2V0ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX29mZnNldCApO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgY29udGFpbmVyO1xuXG5cdFx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lcjtcblx0XHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lcjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAnY3VzdG9tJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRcdGNvbnRhaW5lciA9IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50O1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCAkY29udGFpbmVyID0gJCggY29udGFpbmVyICk7XG5cblx0XHRcdGlmICggJGNvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdG9mZnNldCA9ICRjb250YWluZXIub2Zmc2V0KCkudG9wIC0gYWRqdXN0aW5nT2Zmc2V0O1xuXG5cdFx0XHRcdGlmICggb2Zmc2V0IDwgMCApIHtcblx0XHRcdFx0XHRvZmZzZXQgPSAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZGlzYWJsZV9zY3JvbGxfYW5pbWF0aW9uICkge1xuXHRcdFx0XHRcdHdpbmRvdy5zY3JvbGxUbyggeyB0b3A6IG9mZnNldCB9ICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JCggJ2h0bWwsIGJvZHknICkuc3RvcCgpLmFuaW1hdGUoXG5cdFx0XHRcdFx0XHR7IHNjcm9sbFRvcDogb2Zmc2V0IH0sXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9zcGVlZCxcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX2Vhc2luZ1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdC8vIFRoaW5ncyBhcmUgZG9uZSBiZWZvcmUgZmV0Y2hpbmcgdGhlIHByb2R1Y3RzIGxpa2Ugc2hvd2luZyB0aGUgbG9hZGluZyBpbmRpY2F0b3IuXG5cdFx0YmVmb3JlRmV0Y2hpbmdQcm9kdWN0czogZnVuY3Rpb24oIHRyaWdnZXJlZEJ5ICkge1xuXHRcdFx0Ly8gVHJhY2sgdGhlIGN1cnJlbnQgZWxlbWVudCBmb2N1cy5cblx0XHRcdGZvY3VzZWRFbG0gPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXG5cdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLWxvYWRlcicgKS5hZGRDbGFzcyggJ2lzLWFjdGl2ZScgKTtcblxuXHRcdFx0aWYgKCAhIGlzUHJvICYmICdpbW1lZGlhdGVseScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X3doZW4gKSB7XG5cdFx0XHRcdFdDQVBGLnNjcm9sbFRvKCk7XG5cdFx0XHR9XG5cblx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfZmV0Y2hpbmdfcHJvZHVjdHMnLCBbIHRyaWdnZXJlZEJ5IF0gKTtcblx0XHR9LFxuXHRcdGRlc3Ryb3lUaXBweUluc3RhbmNlczogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy51c2VfdGlwcHlqcyApIHtcblx0XHRcdFx0Ly8gQHNvdXJjZSBodHRwczovL2dpdGh1Yi5jb20vYXRvbWlrcy90aXBweWpzL2lzc3Vlcy80NzNcblx0XHRcdFx0dGlwcHlJbnN0YW5jZXMuZm9yRWFjaCggaW5zdGFuY2UgPT4ge1xuXHRcdFx0XHRcdGluc3RhbmNlLmRlc3Ryb3koKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0XHR0aXBweUluc3RhbmNlcy5sZW5ndGggPSAwOyAvLyBjbGVhciBpdFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Ly8gVGhpbmdzIGFyZSBkb25lIGJlZm9yZSB1cGRhdGluZyB0aGUgcHJvZHVjdHMgbGlrZSBoaWRpbmcgdGhlIGxvYWRpbmcgaW5kaWNhdG9yLlxuXHRcdGJlZm9yZVVwZGF0aW5nUHJvZHVjdHM6IGZ1bmN0aW9uKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICkge1xuXHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1sb2FkZXInICkucmVtb3ZlQ2xhc3MoICdpcy1hY3RpdmUnICk7XG5cblx0XHRcdC8vIE1heWJlIGdvb2QgZm9yIHBlcmZvcm1hbmNlLlxuXHRcdFx0V0NBUEYuZGVzdHJveVRpcHB5SW5zdGFuY2VzKCk7XG5cblx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfdXBkYXRpbmdfcHJvZHVjdHMnLCBbICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgXSApO1xuXHRcdH0sXG5cdFx0YWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzOiBmdW5jdGlvbiggJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSApIHtcblx0XHRcdFdDQVBGLnVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQoICRyZXNwb25zZSApO1xuXG5cdFx0XHQvLyBSZXN0b3JlIHRoZSBmb2N1cyAoTWF5YmUgcmVzdG9yaW5nIHRoZSBmb2N1cyBpbiBtb2JpbGUgZGV2aWNlIGlzbid0IGdvb2QpLlxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucmVzdG9yZV9mb2N1c19hZnRlcl9maWx0ZXJpbmcgJiYgISB3Y2FwZl9wYXJhbXMuaXNfbW9iaWxlICkge1xuXHRcdFx0XHRpZiAoIGRvY3VtZW50LmJvZHkgIT09IGZvY3VzZWRFbG0gKSB7XG5cdFx0XHRcdFx0aWYgKCBmb2N1c2VkRWxtLmlkICkge1xuXHRcdFx0XHRcdFx0JCggYCMkeyBmb2N1c2VkRWxtLmlkIH1gICkuZm9jdXMoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVpbml0aWFsaXplIHdjYXBmLlxuXHRcdFx0V0NBUEYuaW5pdCgpO1xuXG5cdFx0XHRpZiAoICEgaXNQcm8gJiYgJ2FmdGVyJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfd2hlbiApIHtcblx0XHRcdFx0V0NBUEYuc2Nyb2xsVG8oKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVHJpZ2dlciBldmVudHMuXG5cdFx0XHQkKCBkb2N1bWVudCApLnRyaWdnZXIoICdyZWFkeScgKTtcblx0XHRcdCQoIHdpbmRvdyApLnRyaWdnZXIoICdzY3JvbGwnICk7XG5cdFx0XHQkKCB3aW5kb3cgKS50cmlnZ2VyKCAncmVzaXplJyApO1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5jdXN0b21fc2NyaXB0cyApIHtcblx0XHRcdFx0ZXZhbCggd2NhcGZfcGFyYW1zLmN1c3RvbV9zY3JpcHRzICk7XG5cdFx0XHR9XG5cblx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9hZnRlcl91cGRhdGluZ19wcm9kdWN0cycsIFsgJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSBdICk7XG5cdFx0fSxcblx0XHRmaWx0ZXJQcm9kdWN0czogZnVuY3Rpb24oIHRyaWdnZXJlZEJ5ID0gJ2ZpbHRlcicgKSB7XG5cdFx0XHRXQ0FQRi5iZWZvcmVGZXRjaGluZ1Byb2R1Y3RzKCB0cmlnZ2VyZWRCeSApO1xuXG5cdFx0XHQkLmFqYXgoIHtcblx0XHRcdFx0dXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0XHRcdGNvbnN0ICRyZXNwb25zZSA9ICQoIHJlc3BvbnNlICk7XG5cblx0XHRcdFx0XHRXQ0FQRi5iZWZvcmVVcGRhdGluZ1Byb2R1Y3RzKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICk7XG5cblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBVcGRhdGUgZG9jdW1lbnQgdGl0bGUuXG5cdFx0XHRcdFx0ICpcblx0XHRcdFx0XHQgKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS83NTk5NTYyXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMudXBkYXRlX2RvY3VtZW50X3RpdGxlICkge1xuXHRcdFx0XHRcdFx0ZG9jdW1lbnQudGl0bGUgPSAkcmVzcG9uc2UuZmlsdGVyKCAndGl0bGUnICkudGV4dCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgaW5zdGFuY2VzLlxuXHRcdFx0XHRcdGZvciAoIGNvbnN0IGlkIG9mIGluc3RhbmNlSWRzICkge1xuXHRcdFx0XHRcdFx0Y29uc3QgaW5zdGFuY2VJZCA9ICdbZGF0YS1pZD1cIicgKyBpZCArICdcIl0nO1xuXHRcdFx0XHRcdFx0Y29uc3QgJGluc3RhbmNlICA9ICQoIGluc3RhbmNlSWQgKTtcblx0XHRcdFx0XHRcdGNvbnN0ICRpbm5lciAgICAgPSAkaW5zdGFuY2UuZmluZCggJy53Y2FwZi1maWx0ZXItaW5uZXInICk7XG5cdFx0XHRcdFx0XHRjb25zdCBfaW5zdGFuY2UgID0gJHJlc3BvbnNlLmZpbmQoIGluc3RhbmNlSWQgKTtcblxuXHRcdFx0XHRcdFx0Ly8gUHJlc2VydmUgaGllcmFyY2h5IGFjY29yZGlvbiBzdGF0ZS5cblx0XHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJGluc3RhbmNlLmhhc0NsYXNzKCAnaGFzLWhpZXJhcmNoeS1hY2NvcmRpb24nICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JGluc3RhbmNlLmZpbmQoICcud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCAkZWwgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBpZCAgPSAkZWwuZGF0YSggJ2lkJyApO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCB0b2dnbGVTZWxlY3RvciA9IGAud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGVbZGF0YS1pZD1cIiR7IGlkIH1cIl1gO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGFjY29yZGlvbiBpcyBvcGVuZWRcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIHByZXNzZWQgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCB0b2dnbGVTZWxlY3RvciApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAndHJ1ZScgKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICkuc2hvdygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICdmYWxzZScgKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICkuaGlkZSgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBQcmVzZXJ2ZSBzb2Z0IGxpbWl0IHN0YXRlLlxuXHRcdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucHJlc2VydmVfc29mdF9saW1pdF9zdGF0ZSApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkaW5zdGFuY2UuaGFzQ2xhc3MoICdoYXMtc29mdC1saW1pdCcgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCAkbGlzdFdyYXBwZXIgPSAkaW5zdGFuY2UuZmluZCggJy53Y2FwZi1saXN0LXdyYXBwZXInICk7XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAoICRsaXN0V3JhcHBlci5oYXNDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1saXN0LXdyYXBwZXInICkuYWRkQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJyApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAndHJ1ZScgKTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtbGlzdC13cmFwcGVyJyApLnJlbW92ZUNsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLXNvZnQtbGltaXQtdHJpZ2dlcicgKS5hdHRyKCAnYXJpYS1wcmVzc2VkJywgJ2ZhbHNlJyApO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRjb25zdCBfaHRtbCA9IF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLWZpbHRlci1pbm5lcicgKS5odG1sKCk7XG5cblx0XHRcdFx0XHRcdC8vIEZpbmFsbHkgdXBkYXRlIHRoZSBpbnN0YW5jZS5cblx0XHRcdFx0XHRcdCRpbm5lci5odG1sKCBfaHRtbCApO1xuXG5cdFx0XHRcdFx0XHQkaW5zdGFuY2UudHJpZ2dlciggJ3djYXBmLWZpbHRlci11cGRhdGVkJywgWyBfaW5zdGFuY2UgXSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgYWN0aXZlIGZpbHRlcnMgYW5kIHJlc2V0IGZpbHRlcnMuXG5cdFx0XHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1hY3RpdmUtZmlsdGVycywgLndjYXBmLXJlc2V0LWZpbHRlcnMnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRjb25zdCAkdGhhdCAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdFx0Y29uc3QgaW5zdGFuY2VJZCA9ICdbZGF0YS1pZD1cIicgKyAkdGhhdC5kYXRhKCAnaWQnICkgKyAnXCJdJztcblxuXHRcdFx0XHRcdFx0JHRoYXQuaHRtbCggJHJlc3BvbnNlLmZpbmQoIGluc3RhbmNlSWQgKS5odG1sKCkgKTtcblx0XHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0XHQvLyBSZXBsYWNlIG9sZCBzaG9wIGxvb3Agd2l0aCBuZXcgb25lLlxuXHRcdFx0XHRcdGNvbnN0ICRzaG9wTG9vcENvbnRhaW5lciA9ICRyZXNwb25zZS5maW5kKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0XHRcdGNvbnN0ICRub3RGb3VuZENvbnRhaW5lciA9ICRyZXNwb25zZS5maW5kKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApO1xuXG5cdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciA9PT0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0V0NBUEYuYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdHJlcXVlc3RGaWx0ZXI6IGZ1bmN0aW9uKCB1cmwsIHRyaWdnZXJlZEJ5ID0gJ2ZpbHRlcicgKSB7XG5cdFx0XHRpZiAoICEgdXJsICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGhvc3RuYW1lID0gbG9jYXRpb24uaG9zdG5hbWU7XG5cblx0XHRcdC8vIFRPRE86IFJlbW92ZSBmcm9tIHByb2R1Y3Rpb24gYnVpbGQuXG5cdFx0XHRpZiAoICdsb2NhbGhvc3QnID09PSBob3N0bmFtZSApIHtcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoICdodHRwOi8vd2NmaWx0ZXItMi50ZXN0JywgJy8vbG9jYWxob3N0OjMwMDEnICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmRpc2FibGVfYWpheCApIHtcblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmw7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSggeyB3Y2FwZjogdHJ1ZSB9LCAnJywgdXJsICk7XG5cblx0XHRcdFx0V0NBUEYuZmlsdGVyUHJvZHVjdHMoIHRyaWdnZXJlZEJ5ICk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRoYW5kbGVOdW1iZXJJbnB1dEZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgcmFuZ2VOdW1iZXJTZWxlY3RvcnMgPSAnLndjYXBmLXJhbmdlLW51bWJlciAubWluLXZhbHVlLCAud2NhcGYtcmFuZ2UtbnVtYmVyIC5tYXgtdmFsdWUnO1xuXG5cdFx0XHQkYm9keS5vbiggJ2lucHV0JywgcmFuZ2VOdW1iZXJTZWxlY3RvcnMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRjb25zdCAkcmFuZ2VOdW1iZXIgICAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtcmFuZ2UtbnVtYmVyJyApO1xuXHRcdFx0XHRjb25zdCBmb3JtYXROdW1iZXJzICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1mb3JtYXQtbnVtYmVycycgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBvbGRNaW5WYWx1ZSAgICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgb2xkTWF4VmFsdWUgICAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWRlY2ltYWwtcGxhY2VzJyApO1xuXHRcdFx0XHRjb25zdCB0aG91c2FuZFNlcGFyYXRvciA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS10aG91c2FuZC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdGNvbnN0IGdldFZhbHVlID0gKCBmbG9hdFZhbHVlICkgPT4ge1xuXHRcdFx0XHRcdGlmICggZm9ybWF0TnVtYmVycyApIHtcblx0XHRcdFx0XHRcdHJldHVybiBudW1iZXJGb3JtYXQoIGZsb2F0VmFsdWUsIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIGZsb2F0VmFsdWU7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0bGV0IG1pblZhbHVlID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCgpICk7XG5cdFx0XHRcdFx0bGV0IG1heFZhbHVlID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCgpICk7XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0XHRcdGlmICggaXNOYU4oIG1pblZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdFx0XHRpZiAoIGlzTmFOKCBtYXhWYWx1ZSApICkge1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gYmVsb3cgdGhlIHJhbmdlTWluVmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA8IHJhbmdlTWluVmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID4gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0XHRcdGlmICggbWF4VmFsdWUgPiByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gZ28gYmVsb3cgdGhlIG1pblZhbHVlLlxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPiBtYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gbWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gSWYgdmFsdWUgaXMgbm90IGNoYW5nZWQgdGhlbiBkb24ndCBwcm9jZWVkLlxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPT09IG9sZE1pblZhbHVlICYmIG1heFZhbHVlID09PSBvbGRNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIG1heFZhbHVlID09PSByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0Ly8gUmVtb3ZlIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICRyYW5nZU51bWJlci5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBBZGQgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0Y29uc3QgdXJsID0gJHJhbmdlTnVtYmVyLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIG1pblZhbHVlICkucmVwbGFjZSggJyUycycsIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZURhdGVJbnB1dEZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCAnLndjYXBmLWRhdGUtaW5wdXQgLmRhdGUtaW5wdXQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGZpbHRlciA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWRhdGUtaW5wdXQnICk7XG5cdFx0XHRcdGNvbnN0IGlzUmFuZ2UgPSAkZmlsdGVyLmRhdGEoICdpcy1yYW5nZScgKTtcblxuXHRcdFx0XHRsZXQgZmlsdGVyVXJsID0gJyc7XG5cblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGZpbHRlci5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRpZiAoIGlzUmFuZ2UgKSB7XG5cdFx0XHRcdFx0Y29uc3QgZnJvbSA9ICRmaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICkudmFsKCk7XG5cdFx0XHRcdFx0Y29uc3QgdG8gICA9ICRmaWx0ZXIuZmluZCggJy5kYXRlLXRvLWlucHV0JyApLnZhbCgpO1xuXG5cdFx0XHRcdFx0aWYgKCBmcm9tICYmIHRvICkge1xuXHRcdFx0XHRcdFx0ZmlsdGVyVXJsID0gJGZpbHRlci5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclMXMnLCBmcm9tICkucmVwbGFjZSggJyUycycsIHRvICk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggISBmcm9tICYmICEgdG8gKSB7XG5cdFx0XHRcdFx0XHRmaWx0ZXJVcmwgPSAkZmlsdGVyLmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zdCBmcm9tID0gJGZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKS52YWwoKTtcblxuXHRcdFx0XHRcdGlmICggZnJvbSApIHtcblx0XHRcdFx0XHRcdGZpbHRlclVybCA9ICRmaWx0ZXIuZGF0YSggJ3VybCcgKS5yZXBsYWNlKCAnJXMnLCBmcm9tICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGZpbHRlclVybCA9ICRmaWx0ZXIuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBmaWx0ZXJVcmwgKSB7XG5cdFx0XHRcdFx0JGZpbHRlci5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCRmaWx0ZXIucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCBmaWx0ZXJVcmwgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZUxpc3RGaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IG5hdGl2ZUlucHV0cyA9ICcubGlzdC10eXBlLW5hdGl2ZSBbdHlwZT1cImNoZWNrYm94XCJdLCcgK1xuXHRcdFx0XHQnLmxpc3QtdHlwZS1uYXRpdmUgW3R5cGU9XCJyYWRpb1wiXSwnICtcblx0XHRcdFx0Jy5saXN0LXR5cGUtY3VzdG9tLWNoZWNrYm94IFt0eXBlPVwiY2hlY2tib3hcIl0nO1xuXG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsIG5hdGl2ZUlucHV0cywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZpbHRlci1pdGVtJyApLnRvZ2dsZUNsYXNzKCAnaXRlbS1hY3RpdmUnICk7XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJCggdGhpcyApLmRhdGEoICd1cmwnICkgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Y29uc3QgY3VzdG9tUmFkaW9TZWxlY3RvciA9ICcubGlzdC10eXBlLWN1c3RvbS1yYWRpbyc7XG5cblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgY3VzdG9tUmFkaW9TZWxlY3RvciArICcgW3R5cGU9XCJjaGVja2JveFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXItaXRlbScgKS50b2dnbGVDbGFzcyggJ2l0ZW0tYWN0aXZlJyApO1xuXG5cdFx0XHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81ODM5OTI0XG5cdFx0XHRcdCQoIHRoaXMgKVxuXHRcdFx0XHRcdC5jbG9zZXN0KCBjdXN0b21SYWRpb1NlbGVjdG9yIClcblx0XHRcdFx0XHQuZmluZCggJy53Y2FwZi1maWx0ZXItaXRlbS5pdGVtLWFjdGl2ZSBbdHlwZT1cImNoZWNrYm94XCJdJyApXG5cdFx0XHRcdFx0Lm5vdCggdGhpcyApXG5cdFx0XHRcdFx0LnByb3AoICdjaGVja2VkJywgZmFsc2UgKVxuXHRcdFx0XHRcdC5jbG9zZXN0KCAnLndjYXBmLWZpbHRlci1pdGVtJyApXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCAnaXRlbS1hY3RpdmUnICk7XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJCggdGhpcyApLmRhdGEoICd1cmwnICkgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZURyb3Bkb3duRmlsdGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsICcud2NhcGYtZHJvcGRvd24td3JhcHBlciBzZWxlY3QnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHNlbGVjdCAgICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IHZhbHVlcyAgICAgICAgID0gJHNlbGVjdC52YWwoKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyVVJMICAgICAgPSAkc2VsZWN0LmRhdGEoICd1cmwnICk7XG5cdFx0XHRcdGNvbnN0IGNsZWFyRmlsdGVyVVJMID0gJHNlbGVjdC5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKTtcblx0XHRcdFx0bGV0IHVybDtcblxuXHRcdFx0XHRpZiAoIHZhbHVlcy5sZW5ndGggKSB7XG5cdFx0XHRcdFx0dXJsID0gZmlsdGVyVVJMLnJlcGxhY2UoICclcycsIHZhbHVlcy50b1N0cmluZygpICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dXJsID0gY2xlYXJGaWx0ZXJVUkw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZVBhZ2luYXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXggJiYgd2NhcGZfcGFyYW1zLnBhZ2luYXRpb25fY29udGFpbmVyICkge1xuXHRcdFx0XHRjb25zdCAkY29udGFpbmVyID0gJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdFx0Y29uc3QgX3NlbGVjdG9ycyA9IHdjYXBmX3BhcmFtcy5wYWdpbmF0aW9uX2NvbnRhaW5lci5zcGxpdCggJywnICk7XG5cdFx0XHRcdGNvbnN0IHNlbGVjdG9ycyAgPSBbXTtcblxuXHRcdFx0XHRfc2VsZWN0b3JzLmZvckVhY2goIHNlbGVjdG9yID0+IHtcblx0XHRcdFx0XHRpZiAoIHNlbGVjdG9yICkge1xuXHRcdFx0XHRcdFx0c2VsZWN0b3JzLnB1c2goIHNlbGVjdG9yICsgJyBhJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGNvbnN0IHNlbGVjdG9yID0gc2VsZWN0b3JzLmpvaW4oICcsJyApO1xuXG5cdFx0XHRcdGlmICggJGNvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0JGNvbnRhaW5lci5vbiggJ2NsaWNrJywgc2VsZWN0b3IsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBocmVmID0gJCggdGhpcyApLmF0dHIoICdocmVmJyApO1xuXG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCBocmVmLCAncGFnaW5hdGUnICk7XG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRoYW5kbGVEZWZhdWx0T3JkZXJieTogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLnNvcnRpbmdfY29udHJvbCApIHtcblx0XHRcdFx0Ly8gU3VibWl0IHRoZSBvcmRlcmJ5IGZvcm0gd2hlbiB2YWx1ZSBpcyBjaGFuZ2VkLlxuXHRcdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsICcud29vY29tbWVyY2Utb3JkZXJpbmcgc2VsZWN0Lm9yZGVyYnknLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKCB0aGlzICkuY2xvc2VzdCggJ2Zvcm0nICkudHJpZ2dlciggJ3N1Ym1pdCcgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUHJldmVudCB0aGUgYXV0byBzdWJtaXNzaW9uIG9mIHRoZSBvcmRlcmJ5IGZvcm0uXG5cdFx0XHQkYm9keS5vbiggJ3N1Ym1pdCcsICcud29vY29tbWVyY2Utb3JkZXJpbmcnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IHZpYSBhamF4IHdoZW4gdGhlIG9yZGVyYnkgdmFsdWUgaXMgY2hhbmdlZC5cblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgJy53b29jb21tZXJjZS1vcmRlcmluZyBzZWxlY3Qub3JkZXJieScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBvcmRlciA9ICQoIHRoaXMgKS52YWwoKTtcblxuXHRcdFx0XHRjb25zdCB1cmwgPSBuZXcgVVJMKCB3aW5kb3cubG9jYXRpb24gKTtcblx0XHRcdFx0dXJsLnNlYXJjaFBhcmFtcy5zZXQoICdvcmRlcmJ5Jywgb3JkZXIgKTtcblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCBnZXRPcmRlckJ5VXJsKCB1cmwuaHJlZiApICk7XG5cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlQ2xlYXJGaWx0ZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtZmlsdGVyLWNsZWFyLWJ0bicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5hdHRyKCAnZGF0YS1jbGVhci1maWx0ZXItdXJsJyApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVGaWx0ZXJUb29sdGlwOiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRSZWZlcmVuY2Vcblx0XHRcdGlmICggJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHRpcHB5ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMudXNlX3RpcHB5anMgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZFJlZmVyZW5jZVxuXHRcdFx0dGlwcHkoICcud2NhcGYtZmlsdGVyLXRvb2x0aXAnLCB7XG5cdFx0XHRcdHBsYWNlbWVudDogJ3RvcCcsXG5cdFx0XHRcdGNvbnRlbnQoIHJlZmVyZW5jZSApIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSggJ2RhdGEtY29udGVudCcgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0YWxsb3dIVE1MOiB0cnVlLFxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aW5pdENvbWJvYm94OiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggISBqUXVlcnkoKS5jaG9zZW5XQ0FQRiApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB0ZW1wbGF0ZVJlc3VsdCA9ICggdGV4dCwgZGF0YSApID0+IHtcblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQnPHNwYW4+JyArIHRleHQgKyAnPC9zcGFuPicsXG5cdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwid2NhcGYtY291bnRcIj4nICsgZGF0YVsgJ2NvdW50TWFya3VwJyBdICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRdLmpvaW4oICcnICk7XG5cdFx0XHR9O1xuXG5cdFx0XHRjb25zdCB0ZW1wbGF0ZVNlbGVjdGlvbiA9ICggdGV4dCwgZGF0YSApID0+IHtcblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJ3Y2FwZi1jb3VudC0nICsgZGF0YS5jb3VudCArICdcIj4nICsgdGV4dCArICc8L3NwYW4+Jyxcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJ3Y2FwZi1jb3VudCB3Y2FwZi1jb3VudC0nICsgZGF0YS5jb3VudCArICdcIj4nICsgZGF0YVsgJ2NvdW50TWFya3VwJyBdICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRdLmpvaW4oICcnICk7XG5cdFx0XHR9O1xuXG5cdFx0XHRjb25zdCBkZWZhdWx0cyA9IHtcblx0XHRcdFx0aW5oZXJpdF9zZWxlY3RfY2xhc3NlczogdHJ1ZSxcblx0XHRcdFx0aW5oZXJpdF9vcHRpb25fY2xhc3NlczogdHJ1ZSxcblx0XHRcdFx0bm9fcmVzdWx0c190ZXh0OiB3Y2FwZl9wYXJhbXMuY2hvc2VuX25vX3Jlc3VsdHNfdGV4dCxcblx0XHRcdFx0b3B0aW9uc19ub25lX3RleHQ6IHdjYXBmX3BhcmFtcy5jaG9zZW5fb3B0aW9uc19ub25lX3RleHQsXG5cdFx0XHRcdHNlYXJjaF9jb250YWluczogdHJ1ZSwgLy8gTWF0Y2ggZnJvbSBhbnl3aGVyZSBpbiBzdHJpbmcuXG5cdFx0XHRcdHNlYXJjaF9pbl92YWx1ZXM6IHRydWUsIC8vIFNlYXJjaCBpbiB2YWx1ZXMgYWxzby5cblx0XHRcdH07XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmlzX3J0bCApIHtcblx0XHRcdFx0ZGVmYXVsdHNbICdydGwnIF0gPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLWNob3NlbicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRoaXMgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHsgLi4uZGVmYXVsdHMgfTtcblxuXHRcdFx0XHQvLyBJZiBoaWVyYXJjaHkgZW5hYmxlZCB0aGVuIHdlIHNob3cgdGhlIHNlbGVjdGVkIG9wdGlvbnMuXG5cdFx0XHRcdGlmICggJHRoaXMuaGFzQ2xhc3MoICdoYXMtaGllcmFyY2h5JyApICkge1xuXHRcdFx0XHRcdG9wdGlvbnNbICdkaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMnIF0gPSB0cnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG9wdGlvbnNbICdkaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMnIF0gPSB3Y2FwZl9wYXJhbXMuY2hvc2VuX2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEVuYWJsZSB0ZW1wbGF0aW5nIHdoZW4gc2hvd2luZyBjb3VudC5cblx0XHRcdFx0aWYgKCAkdGhpcy5oYXNDbGFzcyggJ3dpdGgtY291bnQnICkgKSB7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ3RlbXBsYXRlUmVzdWx0JyBdICAgID0gdGVtcGxhdGVSZXN1bHQ7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ3RlbXBsYXRlU2VsZWN0aW9uJyBdID0gdGVtcGxhdGVTZWxlY3Rpb247XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBEaXNhYmxlIHNlYXJjaCBib3guXG5cdFx0XHRcdGlmICggISAkdGhpcy5kYXRhKCAnZW5hYmxlLXNlYXJjaCcgKSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnZGlzYWJsZV9zZWFyY2gnIF0gPSB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JHRoaXMuY2hvc2VuV0NBUEYoIG9wdGlvbnMgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gQXR0YWNoIGNob3NlbiBmb3IgZGVmYXVsdCBvcmRlcmJ5LlxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuYXR0YWNoX2Nob3Nlbl9vbl9zb3J0aW5nICkge1xuXHRcdFx0XHRsZXQgZGlzYWJsZVNlYXJjaCA9IHRydWU7XG5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2VhcmNoX2JveF9pbl9kZWZhdWx0X29yZGVyYnkgKSB7XG5cdFx0XHRcdFx0ZGlzYWJsZVNlYXJjaCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHsgLi4uZGVmYXVsdHMgfTtcblxuXHRcdFx0XHRvcHRpb25zWyAnZGlzYWJsZV9zZWFyY2gnIF0gPSBkaXNhYmxlU2VhcmNoO1xuXG5cdFx0XHRcdCRib2R5LmZpbmQoICcud29vY29tbWVyY2Utb3JkZXJpbmcgc2VsZWN0Lm9yZGVyYnknICkuY2hvc2VuV0NBUEYoIG9wdGlvbnMgKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGluaXRSYW5nZVNsaWRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLXJhbmdlLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGl0ZW0gICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgJHNsaWRlciA9ICRpdGVtLmZpbmQoICcud2NhcGYtbm91aS1zbGlkZXInICk7XG5cblx0XHRcdFx0Y29uc3Qgc2xpZGVySWQgICAgICAgICAgPSAkc2xpZGVyLmF0dHIoICdpZCcgKTtcblx0XHRcdFx0Y29uc3QgZGlzcGxheVZhbHVlc0FzICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kaXNwbGF5LXZhbHVlcy1hcycgKTtcblx0XHRcdFx0Y29uc3QgZm9ybWF0TnVtYmVycyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1mb3JtYXQtbnVtYmVycycgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgc3RlcCAgICAgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1zdGVwJyApICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1wbGFjZXMnICk7XG5cdFx0XHRcdGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gJGl0ZW0uYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBtaW5WYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBtYXhWYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCAkbWluVmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWluLXZhbHVlJyApO1xuXHRcdFx0XHRjb25zdCAkbWF4VmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWF4LXZhbHVlJyApO1xuXG5cdFx0XHRcdGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBzbGlkZXJJZCApO1xuXG5cdFx0XHRcdG5vVWlTbGlkZXIuY3JlYXRlKCBzbGlkZXIsIHtcblx0XHRcdFx0XHRzdGFydDogWyBtaW5WYWx1ZSwgbWF4VmFsdWUgXSxcblx0XHRcdFx0XHRzdGVwLFxuXHRcdFx0XHRcdGNvbm5lY3Q6IHRydWUsXG5cdFx0XHRcdFx0Y3NzUHJlZml4OiAnd2NhcGYtbm91aS0nLFxuXHRcdFx0XHRcdHJhbmdlOiB7XG5cdFx0XHRcdFx0XHQnbWluJzogcmFuZ2VNaW5WYWx1ZSxcblx0XHRcdFx0XHRcdCdtYXgnOiByYW5nZU1heFZhbHVlLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAndXBkYXRlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHRsZXQgbWluVmFsdWU7XG5cdFx0XHRcdFx0bGV0IG1heFZhbHVlO1xuXG5cdFx0XHRcdFx0aWYgKCBmb3JtYXROdW1iZXJzICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSBudW1iZXJGb3JtYXQoIHZhbHVlc1sgMCBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSBudW1iZXJGb3JtYXQoIHZhbHVlc1sgMSBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMSBdICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCAncGxhaW5fdGV4dCcgPT09IGRpc3BsYXlWYWx1ZXNBcyApIHtcblx0XHRcdFx0XHRcdCRtaW5WYWx1ZS5odG1sKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdFx0JG1heFZhbHVlLmh0bWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRtaW5WYWx1ZS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0XHQkbWF4VmFsdWUudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1ub3Vpc2xpZGVyLXVwZGF0ZScsIFsgJGl0ZW0sIHZhbHVlcyBdICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRmdW5jdGlvbiBmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdFx0Y29uc3QgX21pblZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAwIF0gKTtcblx0XHRcdFx0XHRjb25zdCBfbWF4VmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDEgXSApO1xuXG5cdFx0XHRcdFx0Ly8gSWYgdmFsdWUgaXMgbm90IGNoYW5nZWQgdGhlbiBkb24ndCBwcm9jZWVkLlxuXHRcdFx0XHRcdGlmICggX21pblZhbHVlID09PSBtaW5WYWx1ZSAmJiBfbWF4VmFsdWUgPT09IG1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggX21pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIF9tYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdC8vIFJlbW92ZSByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkaXRlbS5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBBZGQgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0Y29uc3QgdXJsID0gJGl0ZW0uZGF0YSggJ3VybCcgKS5yZXBsYWNlKCAnJTFzJywgX21pblZhbHVlICkucmVwbGFjZSggJyUycycsIF9tYXhWYWx1ZSApO1xuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICdjaGFuZ2UnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0JG1pblZhbHVlLm9uKCAnaW5wdXQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRcdCRpbnB1dC5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5zZXQoIFsgbWluVmFsdWUsIG51bGwgXSApO1xuXG5cdFx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtYXhWYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG51bGwsIG1heFZhbHVlIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXREYXRlcGlja2VyOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggISBqUXVlcnkoKS5kYXRlcGlja2VyICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0ICR3Y2FwZkRhdGVGaWx0ZXIgPSAkYm9keS5maW5kKCAnLndjYXBmLWRhdGUtaW5wdXQnICk7XG5cblx0XHRcdGNvbnN0IGZvcm1hdCAgICAgICAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtZm9ybWF0JyApO1xuXHRcdFx0Y29uc3QgeWVhckRyb3Bkb3duICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1waWNrZXIteWVhci1kcm9wZG93bicgKTtcblx0XHRcdGNvbnN0IG1vbnRoRHJvcGRvd24gPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtcGlja2VyLW1vbnRoLWRyb3Bkb3duJyApO1xuXG5cdFx0XHRjb25zdCAkZnJvbSA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICk7XG5cdFx0XHRjb25zdCAkdG8gICA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLXRvLWlucHV0JyApO1xuXG5cdFx0XHQkZnJvbS5kYXRlcGlja2VyKCB7XG5cdFx0XHRcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdFx0Y2hhbmdlWWVhcjogeWVhckRyb3Bkb3duLFxuXHRcdFx0XHRjaGFuZ2VNb250aDogbW9udGhEcm9wZG93bixcblx0XHRcdH0gKTtcblxuXHRcdFx0JHRvLmRhdGVwaWNrZXIoIHtcblx0XHRcdFx0ZGF0ZUZvcm1hdDogZm9ybWF0LFxuXHRcdFx0XHRjaGFuZ2VZZWFyOiB5ZWFyRHJvcGRvd24sXG5cdFx0XHRcdGNoYW5nZU1vbnRoOiBtb250aERyb3Bkb3duLFxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aW5pdEZpbHRlck9wdGlvblRvb2x0aXA6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZFJlZmVyZW5jZVxuXHRcdFx0aWYgKCAnZnVuY3Rpb24nICE9PSB0eXBlb2YgdGlwcHkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy51c2VfdGlwcHlqcyApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB0b29sdGlwUG9zaXRpb25zID0gWyAndG9wJywgJ3JpZ2h0JywgJ2JvdHRvbScsICdsZWZ0JyBdO1xuXG5cdFx0XHR0b29sdGlwUG9zaXRpb25zLmZvckVhY2goIGZ1bmN0aW9uKCB0b29sdGlwUG9zaXRpb24gKSB7XG5cdFx0XHRcdGNvbnN0IGlkZW50aWZpZXIgPSAnZGF0YS13Y2FwZi10b29sdGlwLScgKyB0b29sdGlwUG9zaXRpb247XG5cblx0XHRcdFx0Ly8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZFJlZmVyZW5jZVxuXHRcdFx0XHRjb25zdCBpbnN0YW5jZXMgPSB0aXBweSggJ1snICsgaWRlbnRpZmllciArICddJywge1xuXHRcdFx0XHRcdHBsYWNlbWVudDogdG9vbHRpcFBvc2l0aW9uLFxuXHRcdFx0XHRcdGNvbnRlbnQoIHJlZmVyZW5jZSApIHtcblx0XHRcdFx0XHRcdHJldHVybiByZWZlcmVuY2UuZ2V0QXR0cmlidXRlKCBpZGVudGlmaWVyICk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRhbGxvd0hUTUw6IHRydWUsXG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHR3aW5kb3cudGlwcHlJbnN0YW5jZXMgPSB0aXBweUluc3RhbmNlcy5jb25jYXQoIGluc3RhbmNlcyApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRXQ0FQRi5pbml0Q29tYm9ib3goKTtcblx0XHRcdFdDQVBGLmluaXRSYW5nZVNsaWRlcigpO1xuXHRcdFx0V0NBUEYuaW5pdERhdGVwaWNrZXIoKTtcblx0XHRcdFdDQVBGLmluaXRGaWx0ZXJPcHRpb25Ub29sdGlwKCk7XG5cdFx0fSxcblx0XHRpbml0UG9wU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucmVsb2FkX29uX2JhY2sgJiYgd2NhcGZfcGFyYW1zLmZvdW5kX3djYXBmICkge1xuXHRcdFx0XHRoaXN0b3J5LnJlcGxhY2VTdGF0ZSggeyB3Y2FwZjogdHJ1ZSB9LCAnJywgd2luZG93LmxvY2F0aW9uICk7XG5cblx0XHRcdFx0Ly8gSGFuZGxlIHRoZSBwb3BzdGF0ZSBldmVudChicm93c2VyJ3MgYmFjay9mb3J3YXJkKVxuXHRcdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3BvcHN0YXRlJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0aWYgKCBudWxsICE9PSBlLnN0YXRlICYmIGUuc3RhdGUuaGFzT3duUHJvcGVydHkoICd3Y2FwZicgKSApIHtcblx0XHRcdFx0XHRcdFdDQVBGLmZpbHRlclByb2R1Y3RzKCAncG9wc3RhdGUnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBFbmFibGUgaXQgaWYgbmVjZXNzYXJ5LlxuXHQgKlxuXHQgKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zMzAwNDkxN1xuXHQgKi9cblx0aWYgKCAnc2Nyb2xsUmVzdG9yYXRpb24nIGluIGhpc3RvcnkgKSB7XG5cdFx0Ly8gaGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvbiA9ICdtYW51YWwnO1xuXHR9XG5cbn0oIGpRdWVyeSwgd2luZG93ICkgKTtcblxuKCBmdW5jdGlvbiggJCwgV0NBUEYgKSB7XG5cblx0V0NBUEYuaW5pdCgpO1xuXHRXQ0FQRi5pbml0UG9wU3RhdGUoKTtcblxuXHRXQ0FQRi5oYW5kbGVGaWx0ZXJBY2NvcmRpb24oKTtcblx0V0NBUEYuaGFuZGxlSGllcmFyY2h5VG9nZ2xlKCk7XG5cdFdDQVBGLmhhbmRsZVNvZnRMaW1pdCgpO1xuXHRXQ0FQRi5oYW5kbGVTZWFyY2hGaWx0ZXJPcHRpb25zKCk7XG5cblx0V0NBUEYuaGFuZGxlTGlzdEZpbHRlcnMoKTtcblx0V0NBUEYuaGFuZGxlRHJvcGRvd25GaWx0ZXJzKCk7XG5cdFdDQVBGLmhhbmRsZU51bWJlcklucHV0RmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVEYXRlSW5wdXRGaWx0ZXJzKCk7XG5cdFdDQVBGLmhhbmRsZVBhZ2luYXRpb24oKTtcblx0V0NBUEYuaGFuZGxlRGVmYXVsdE9yZGVyYnkoKTtcblxuXHRXQ0FQRi5oYW5kbGVDbGVhckZpbHRlcigpO1xuXG5cdFdDQVBGLmhhbmRsZUZpbHRlclRvb2x0aXAoKTtcblxuXHQvKipcblx0ICogTWFrZSBpdCBjb21wYXRpYmxlIHdpdGggb3RoZXIgcGx1Z2lucy5cblx0ICovXG5cdCQoICdib2R5JyApLm9uKCAnd2NhcGZfYWZ0ZXJfdXBkYXRpbmdfcHJvZHVjdHMnLCBmdW5jdGlvbigpIHtcblx0XHQvLyB3b28tdmFyaWF0aW9uLXN3YXRjaGVzXG5cdFx0JCggZG9jdW1lbnQgKS50cmlnZ2VyKCAnd29vX3ZhcmlhdGlvbl9zd2F0Y2hlc19wcm9faW5pdCcgKTtcblx0fSApO1xuXG59KCBqUXVlcnksIHdpbmRvdy5XQ0FQRiApICk7XG4iLCIvKipcbiAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM0MTQxODEzXG4gKlxuICogQHBhcmFtIG51bWJlclxuICogQHBhcmFtIGRlY2ltYWxzXG4gKiBAcGFyYW0gZGVjX3BvaW50XG4gKiBAcGFyYW0gdGhvdXNhbmRzX3NlcFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIG51bWJlckZvcm1hdCggbnVtYmVyLCBkZWNpbWFscywgZGVjX3BvaW50LCB0aG91c2FuZHNfc2VwICkge1xuXHQvLyBTdHJpcCBhbGwgY2hhcmFjdGVycyBidXQgbnVtZXJpY2FsIG9uZXMuXG5cdG51bWJlciA9ICggbnVtYmVyICsgJycgKS5yZXBsYWNlKCAvW15cXGQrXFwtRWUuXS9nLCAnJyApO1xuXG5cdGNvbnN0IG4gICAgPSAhIGlzRmluaXRlKCArbnVtYmVyICkgPyAwIDogK251bWJlcjtcblx0Y29uc3QgcHJlYyA9ICEgaXNGaW5pdGUoICtkZWNpbWFscyApID8gMCA6IE1hdGguYWJzKCBkZWNpbWFscyApO1xuXHRjb25zdCBzZXAgID0gKCB0eXBlb2YgdGhvdXNhbmRzX3NlcCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcsJyA6IHRob3VzYW5kc19zZXA7XG5cdGNvbnN0IGRlYyAgPSAoIHR5cGVvZiBkZWNfcG9pbnQgPT09ICd1bmRlZmluZWQnICkgPyAnLicgOiBkZWNfcG9pbnQ7XG5cblx0bGV0IHM7XG5cblx0Y29uc3QgdG9GaXhlZEZpeCA9IGZ1bmN0aW9uKCBuLCBwcmVjICkge1xuXHRcdGNvbnN0IGsgPSBNYXRoLnBvdyggMTAsIHByZWMgKTtcblx0XHRyZXR1cm4gJycgKyBNYXRoLnJvdW5kKCBuICogayApIC8gaztcblx0fTtcblxuXHQvLyBGaXggZm9yIElFIHBhcnNlRmxvYXQoMC41NSkudG9GaXhlZCgwKSA9IDA7XG5cdHMgPSAoIHByZWMgPyB0b0ZpeGVkRml4KCBuLCBwcmVjICkgOiAnJyArIE1hdGgucm91bmQoIG4gKSApLnNwbGl0KCAnLicgKTtcblxuXHRpZiAoIHNbIDAgXS5sZW5ndGggPiAzICkge1xuXHRcdHNbIDAgXSA9IHNbIDAgXS5yZXBsYWNlKCAvXFxCKD89KD86XFxkezN9KSsoPyFcXGQpKS9nLCBzZXAgKTtcblx0fVxuXG5cdGlmICggKCBzWyAxIF0gfHwgJycgKS5sZW5ndGggPCBwcmVjICkge1xuXHRcdHNbIDEgXSA9IHNbIDEgXSB8fCAnJztcblx0XHRzWyAxIF0gKz0gbmV3IEFycmF5KCBwcmVjIC0gc1sgMSBdLmxlbmd0aCArIDEgKS5qb2luKCAnMCcgKTtcblx0fVxuXG5cdHJldHVybiBzLmpvaW4oIGRlYyApO1xufVxuXG5mdW5jdGlvbiBjbGVhblVybCggdXJsICkge1xuXHRyZXR1cm4gdXJsLnJlcGxhY2UoIC8lMkMvZywgJywnICk7XG59XG5cbmZ1bmN0aW9uIGdldE9yZGVyQnlVcmwoIHVybCApIHtcblx0Y29uc3QgcGFnZWQgPSBwYXJzZUludCggdXJsLnJlcGxhY2UoIC8uK1xcL3BhZ2VcXC8oXFxkKykrLywgJyQxJyApICk7XG5cblx0aWYgKCBwYWdlZCApIHtcblx0XHR1cmwgPSB1cmwucmVwbGFjZSggL3BhZ2VcXC8oXFxkKylcXC8vLCAnJyApO1xuXHR9XG5cblx0cmV0dXJuIGNsZWFuVXJsKCB1cmwgKTtcbn1cbiJdfQ==
