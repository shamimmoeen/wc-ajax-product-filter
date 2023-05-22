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

      var hostname = location.hostname; // TODO: Remove from production build.

      if ('localhost' === hostname) {
        url = url.replace('http://wcfilter-2.test', '//localhost:3000');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJ1dGlscy5qcyJdLCJuYW1lcyI6WyJ3Y2FwZl9wYXJhbXMiLCIkIiwid2luZG93IiwiX2RlbGF5IiwicGFyc2VJbnQiLCJmaWx0ZXJfaW5wdXRfZGVsYXkiLCJkZWxheSIsImlzUHJvIiwid2NhcGZfcHJvIiwiJGJvZHkiLCIkZG9jdW1lbnQiLCJkb2N1bWVudCIsImluc3RhbmNlSWRzIiwiZWFjaCIsImlkIiwiZGF0YSIsInB1c2giLCJmb2N1c2VkRWxtIiwidGlwcHlJbnN0YW5jZXMiLCJXQ0FQRiIsImhhbmRsZUZpbHRlckFjY29yZGlvbiIsInRvZ2dsZUFjY29yZGlvbiIsIiRlbCIsInByZXNzZWQiLCJhdHRyIiwiJGZpbHRlcklubmVyIiwiY2xvc2VzdCIsImNoaWxkcmVuIiwiZW5hYmxlX2FuaW1hdGlvbl9mb3JfZmlsdGVyX2FjY29yZGlvbiIsInNsaWRlVG9nZ2xlIiwiZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQiLCJmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmciLCJ0b2dnbGUiLCJvbiIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCIkdHJpZ2dlciIsImZpbmQiLCJoYW5kbGVIaWVyYXJjaHlUb2dnbGUiLCIkY2hpbGQiLCJlbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uIiwiaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQiLCJoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmciLCJrZXkiLCJwcmV2ZW50RGVmYXVsdCIsImhhbmRsZVNvZnRMaW1pdCIsInRvZ2dsZUZpbHRlck9wdGlvbnMiLCIkbGlzdFdyYXBwZXIiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiaGFuZGxlU2VhcmNoRmlsdGVyT3B0aW9ucyIsIiR0aGF0IiwiJGlubmVyIiwiJGZpbHRlciIsInNvZnRMaW1pdEVuYWJsZWQiLCJoYXNDbGFzcyIsInNvZnRMaW1pdFRvZ2dsZSIsIm5vUmVzdWx0cyIsInZpc2libGVPcHRpb25zIiwia2V5d29yZCIsInZhbCIsImxlbmd0aCIsImluZGV4IiwiJGZpbHRlckl0ZW0iLCJyZW1vdmVBdHRyIiwidGV4dCIsImhpZGUiLCJsYWJlbCIsInRvU3RyaW5nIiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsInNob3ciLCJ1cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0IiwiJHJlc3BvbnNlIiwiJGNvbnRhaW5lciIsInNob3BfbG9vcF9jb250YWluZXIiLCJzZWxlY3RvciIsIm5ld0NvdW50IiwiaHRtbCIsImhhcyIsInNjcm9sbFRvIiwic2Nyb2xsX3dpbmRvdyIsInNjcm9sbEZvciIsInNjcm9sbF93aW5kb3dfZm9yIiwiaXNNb2JpbGUiLCJpc19tb2JpbGUiLCJwcm9jZWVkIiwiYWRqdXN0aW5nT2Zmc2V0Iiwib2Zmc2V0Iiwic2Nyb2xsX3RvX3RvcF9vZmZzZXQiLCJjb250YWluZXIiLCJub3RfZm91bmRfY29udGFpbmVyIiwic2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudCIsInRvcCIsImRpc2FibGVfc2Nyb2xsX2FuaW1hdGlvbiIsInN0b3AiLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwic2Nyb2xsX3RvX3RvcF9zcGVlZCIsInNjcm9sbF90b190b3BfZWFzaW5nIiwiYmVmb3JlRmV0Y2hpbmdQcm9kdWN0cyIsInRyaWdnZXJlZEJ5IiwiYWN0aXZlRWxlbWVudCIsInNjcm9sbF93aW5kb3dfd2hlbiIsInRyaWdnZXIiLCJkZXN0cm95VGlwcHlJbnN0YW5jZXMiLCJ1c2VfdGlwcHlqcyIsImZvckVhY2giLCJpbnN0YW5jZSIsImRlc3Ryb3kiLCJiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzIiwiYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzIiwicmVzdG9yZV9mb2N1c19hZnRlcl9maWx0ZXJpbmciLCJib2R5IiwiZm9jdXMiLCJpbml0IiwiY3VzdG9tX3NjcmlwdHMiLCJldmFsIiwiZmlsdGVyUHJvZHVjdHMiLCJhamF4IiwidXJsIiwibG9jYXRpb24iLCJocmVmIiwic3VjY2VzcyIsInJlc3BvbnNlIiwidXBkYXRlX2RvY3VtZW50X3RpdGxlIiwidGl0bGUiLCJmaWx0ZXIiLCJpbnN0YW5jZUlkIiwiJGluc3RhbmNlIiwiX2luc3RhbmNlIiwicHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSIsInRvZ2dsZVNlbGVjdG9yIiwicHJlc2VydmVfc29mdF9saW1pdF9zdGF0ZSIsIl9odG1sIiwiJHNob3BMb29wQ29udGFpbmVyIiwiJG5vdEZvdW5kQ29udGFpbmVyIiwicmVxdWVzdEZpbHRlciIsImhvc3RuYW1lIiwicmVwbGFjZSIsImRpc2FibGVfYWpheCIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJ3Y2FwZiIsImhhbmRsZU51bWJlcklucHV0RmlsdGVycyIsInJhbmdlTnVtYmVyU2VsZWN0b3JzIiwiJGl0ZW0iLCIkcmFuZ2VOdW1iZXIiLCJmb3JtYXROdW1iZXJzIiwicmFuZ2VNaW5WYWx1ZSIsInBhcnNlRmxvYXQiLCJyYW5nZU1heFZhbHVlIiwib2xkTWluVmFsdWUiLCJvbGRNYXhWYWx1ZSIsImRlY2ltYWxQbGFjZXMiLCJ0aG91c2FuZFNlcGFyYXRvciIsImRlY2ltYWxTZXBhcmF0b3IiLCJjbGVhclRpbWVvdXQiLCJnZXRWYWx1ZSIsImZsb2F0VmFsdWUiLCJudW1iZXJGb3JtYXQiLCJzZXRUaW1lb3V0IiwicmVtb3ZlRGF0YSIsIm1pblZhbHVlIiwibWF4VmFsdWUiLCJpc05hTiIsImhhbmRsZURhdGVJbnB1dEZpbHRlcnMiLCJpc1JhbmdlIiwiZmlsdGVyVXJsIiwiZnJvbSIsInRvIiwiaGFuZGxlTGlzdEZpbHRlcnMiLCJuYXRpdmVJbnB1dHMiLCJ0b2dnbGVDbGFzcyIsImN1c3RvbVJhZGlvU2VsZWN0b3IiLCJub3QiLCJwcm9wIiwiaGFuZGxlRHJvcGRvd25GaWx0ZXJzIiwiJHNlbGVjdCIsInZhbHVlcyIsImZpbHRlclVSTCIsImNsZWFyRmlsdGVyVVJMIiwiaGFuZGxlUGFnaW5hdGlvbiIsImVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4IiwicGFnaW5hdGlvbl9jb250YWluZXIiLCJfc2VsZWN0b3JzIiwic3BsaXQiLCJzZWxlY3RvcnMiLCJqb2luIiwiaGFuZGxlRGVmYXVsdE9yZGVyYnkiLCJzb3J0aW5nX2NvbnRyb2wiLCJvcmRlciIsIlVSTCIsInNlYXJjaFBhcmFtcyIsInNldCIsImdldE9yZGVyQnlVcmwiLCJoYW5kbGVDbGVhckZpbHRlciIsImhhbmRsZUZpbHRlclRvb2x0aXAiLCJ0aXBweSIsInBsYWNlbWVudCIsImNvbnRlbnQiLCJyZWZlcmVuY2UiLCJnZXRBdHRyaWJ1dGUiLCJhbGxvd0hUTUwiLCJpbml0Q29tYm9ib3giLCJqUXVlcnkiLCJjaG9zZW5XQ0FQRiIsInRlbXBsYXRlUmVzdWx0IiwidGVtcGxhdGVTZWxlY3Rpb24iLCJjb3VudCIsImRlZmF1bHRzIiwiaW5oZXJpdF9zZWxlY3RfY2xhc3NlcyIsImluaGVyaXRfb3B0aW9uX2NsYXNzZXMiLCJub19yZXN1bHRzX3RleHQiLCJjaG9zZW5fbm9fcmVzdWx0c190ZXh0Iiwib3B0aW9uc19ub25lX3RleHQiLCJjaG9zZW5fb3B0aW9uc19ub25lX3RleHQiLCJzZWFyY2hfY29udGFpbnMiLCJzZWFyY2hfaW5fdmFsdWVzIiwiaXNfcnRsIiwiJHRoaXMiLCJvcHRpb25zIiwiY2hvc2VuX2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucyIsImF0dGFjaF9jaG9zZW5fb25fc29ydGluZyIsImRpc2FibGVTZWFyY2giLCJzZWFyY2hfYm94X2luX2RlZmF1bHRfb3JkZXJieSIsImluaXRSYW5nZVNsaWRlciIsIm5vVWlTbGlkZXIiLCIkc2xpZGVyIiwic2xpZGVySWQiLCJkaXNwbGF5VmFsdWVzQXMiLCJzdGVwIiwiJG1pblZhbHVlIiwiJG1heFZhbHVlIiwic2xpZGVyIiwiZ2V0RWxlbWVudEJ5SWQiLCJjcmVhdGUiLCJzdGFydCIsImNvbm5lY3QiLCJjc3NQcmVmaXgiLCJyYW5nZSIsImZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIiLCJfbWluVmFsdWUiLCJfbWF4VmFsdWUiLCIkaW5wdXQiLCJnZXQiLCJpbml0RGF0ZXBpY2tlciIsImRhdGVwaWNrZXIiLCIkd2NhcGZEYXRlRmlsdGVyIiwiZm9ybWF0IiwieWVhckRyb3Bkb3duIiwibW9udGhEcm9wZG93biIsIiRmcm9tIiwiJHRvIiwiZGF0ZUZvcm1hdCIsImNoYW5nZVllYXIiLCJjaGFuZ2VNb250aCIsImluaXRGaWx0ZXJPcHRpb25Ub29sdGlwIiwidG9vbHRpcFBvc2l0aW9ucyIsInRvb2x0aXBQb3NpdGlvbiIsImlkZW50aWZpZXIiLCJpbnN0YW5jZXMiLCJjb25jYXQiLCJpbml0UG9wU3RhdGUiLCJyZWxvYWRfb25fYmFjayIsImZvdW5kX3djYXBmIiwicmVwbGFjZVN0YXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInN0YXRlIiwiaGFzT3duUHJvcGVydHkiLCJudW1iZXIiLCJkZWNpbWFscyIsImRlY19wb2ludCIsInRob3VzYW5kc19zZXAiLCJuIiwiaXNGaW5pdGUiLCJwcmVjIiwiTWF0aCIsImFicyIsInNlcCIsImRlYyIsInMiLCJ0b0ZpeGVkRml4IiwiayIsInBvdyIsInJvdW5kIiwiQXJyYXkiLCJjbGVhblVybCIsInBhZ2VkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSxZQUFZLEdBQUdBLFlBQVksSUFBSTtBQUNwQyxZQUFVLEVBRDBCO0FBRXBDLHdCQUFzQixFQUZjO0FBR3BDLHFDQUFtQyxFQUhDO0FBSXBDLDRCQUEwQixFQUpVO0FBS3BDLDhCQUE0QixFQUxRO0FBTXBDLG1DQUFpQyxFQU5HO0FBT3BDLHdDQUFzQyxFQVBGO0FBUXBDLCtCQUE2QixFQVJPO0FBU3BDLDJDQUF5QyxFQVRMO0FBVXBDLHNDQUFvQyxFQVZBO0FBV3BDLHVDQUFxQyxFQVhEO0FBWXBDLDhDQUE0QyxFQVpSO0FBYXBDLHlDQUF1QyxFQWJIO0FBY3BDLDBDQUF3QyxFQWRKO0FBZXBDLG1DQUFpQyxFQWZH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OEIsRUFBOUIsQ0FBTjtBQUNBOztBQUVELFNBQU9vSixRQUFRLENBQUV2SyxHQUFGLENBQWY7QUFDQSIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLXB1YmxpYy1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgbWFpbiBqcyBmaWxlLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL3B1YmxpYy9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5jb25zdCB3Y2FwZl9wYXJhbXMgPSB3Y2FwZl9wYXJhbXMgfHwge1xuXHQnaXNfcnRsJzogJycsXG5cdCdmaWx0ZXJfaW5wdXRfZGVsYXknOiAnJyxcblx0J2Nob3Nlbl9kaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMnOiAnJyxcblx0J2Nob3Nlbl9ub19yZXN1bHRzX3RleHQnOiAnJyxcblx0J2Nob3Nlbl9vcHRpb25zX25vbmVfdGV4dCc6ICcnLFxuXHQnc2VhcmNoX2JveF9pbl9kZWZhdWx0X29yZGVyYnknOiAnJyxcblx0J3ByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUnOiAnJyxcblx0J3ByZXNlcnZlX3NvZnRfbGltaXRfc3RhdGUnOiAnJyxcblx0J2VuYWJsZV9hbmltYXRpb25fZm9yX2ZpbHRlcl9hY2NvcmRpb24nOiAnJyxcblx0J2ZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkJzogJycsXG5cdCdmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmcnOiAnJyxcblx0J2VuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24nOiAnJyxcblx0J2hpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkJzogJycsXG5cdCdoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmcnOiAnJyxcblx0J3Jlc3RvcmVfZm9jdXNfYWZ0ZXJfZmlsdGVyaW5nJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX3NwZWVkJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX2Vhc2luZyc6ICcnLFxuXHQnaXNfbW9iaWxlJzogJycsXG5cdCdyZWxvYWRfb25fYmFjayc6ICcnLFxuXHQnZm91bmRfd2NhcGYnOiAnJyxcblx0J3djYXBmX3Bybyc6ICcnLFxuXHQndXBkYXRlX2RvY3VtZW50X3RpdGxlJzogJycsXG5cdCd1c2VfdGlwcHlqcyc6ICcnLFxuXHQnc2hvcF9sb29wX2NvbnRhaW5lcic6ICcnLFxuXHQnbm90X2ZvdW5kX2NvbnRhaW5lcic6ICcnLFxuXHQncGFnaW5hdGlvbl9jb250YWluZXInOiAnJyxcblx0J2Rpc2FibGVfYWpheCc6ICcnLFxuXHQnZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXgnOiAnJyxcblx0J3NvcnRpbmdfY29udHJvbCc6ICcnLFxuXHQnYXR0YWNoX2Nob3Nlbl9vbl9zb3J0aW5nJzogJycsXG5cdCdsb2FkaW5nX2FuaW1hdGlvbic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvdyc6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd19mb3InOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfd2hlbic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudCc6ICcnLFxuXHQnc2Nyb2xsX29uJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX29mZnNldCc6ICcnLFxuXHQnZGlzYWJsZV9zY3JvbGxfYW5pbWF0aW9uJzogJycsXG5cdCdtb3JlX3NlbGVjdG9ycyc6ICcnLFxuXHQnY3VzdG9tX3NjcmlwdHMnOiAnJyxcbn07XG5cbiggZnVuY3Rpb24oICQsIHdpbmRvdyApIHtcblxuXHRjb25zdCBfZGVsYXkgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLmZpbHRlcl9pbnB1dF9kZWxheSApO1xuXHRjb25zdCBkZWxheSAgPSBfZGVsYXkgPj0gMCA/IF9kZWxheSA6IDMwMDtcblxuXHRjb25zdCBpc1BybyA9IHdjYXBmX3BhcmFtcy53Y2FwZl9wcm87XG5cblx0Y29uc3QgJGJvZHkgICAgID0gJCggJ2JvZHknICk7XG5cdGNvbnN0ICRkb2N1bWVudCA9ICQoIGRvY3VtZW50ICk7XG5cblx0Y29uc3QgaW5zdGFuY2VJZHMgPSBbXTtcblxuXHQkKCAnLndjYXBmLWZpbHRlcicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCBpZCA9ICQoIHRoaXMgKS5kYXRhKCAnaWQnICk7XG5cblx0XHRpZiAoICEgaWQgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aW5zdGFuY2VJZHMucHVzaCggaWQgKTtcblx0fSApO1xuXG5cdGxldCBmb2N1c2VkRWxtO1xuXG5cdHdpbmRvdy50aXBweUluc3RhbmNlcyA9IFtdO1xuXG5cdHdpbmRvdy5XQ0FQRiA9IHdpbmRvdy5XQ0FQRiB8fCB7fTtcblxuXHR3aW5kb3cuV0NBUEYgPSB7XG5cdFx0aGFuZGxlRmlsdGVyQWNjb3JkaW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHRvZ2dsZUFjY29yZGlvbiA9ICggJGVsICkgPT4ge1xuXHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGFjY29yZGlvbiBpcyBvcGVuZWRcblx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1leHBhbmRlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdC8vIENoYW5nZSBhcmlhLWV4cGFuZGVkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuXHRcdFx0XHQkZWwuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAhIHByZXNzZWQgKTtcblxuXHRcdFx0XHRjb25zdCAkZmlsdGVySW5uZXIgPSAkZWwuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXInICkuY2hpbGRyZW4oICcud2NhcGYtZmlsdGVyLWlubmVyJyApO1xuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9hbmltYXRpb25fZm9yX2ZpbHRlcl9hY2NvcmRpb24gKSB7XG5cdFx0XHRcdFx0JGZpbHRlcklubmVyLnNsaWRlVG9nZ2xlKFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkLFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZ1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JGZpbHRlcklubmVyLnRvZ2dsZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHQkYm9keS5vbiggJ2NsaWNrJywgJy53Y2FwZi1maWx0ZXItYWNjb3JkaW9uLXRyaWdnZXInLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQkYm9keS5vbiggJ2NsaWNrJywgJy53Y2FwZi1maWx0ZXItdGl0bGUuaGFzLWFjY29yZGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkdHJpZ2dlciA9ICQoIHRoaXMgKS5maW5kKCAnLndjYXBmLWZpbHRlci1hY2NvcmRpb24tdHJpZ2dlcicgKTtcblxuXHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICR0cmlnZ2VyICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVIaWVyYXJjaHlUb2dnbGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgdG9nZ2xlQWNjb3JkaW9uID0gKCAkZWwgKSA9PiB7XG5cdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYnV0dG9uIGlzIHByZXNzZWRcblx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0Ly8gQ2hhbmdlIGFyaWEtcHJlc3NlZCB0byB0aGUgb3Bwb3NpdGUgc3RhdGVcblx0XHRcdFx0JGVsLmF0dHIoICdhcmlhLXByZXNzZWQnLCAhIHByZXNzZWQgKTtcblxuXHRcdFx0XHRjb25zdCAkY2hpbGQgPSAkZWwuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICk7XG5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbiApIHtcblx0XHRcdFx0XHQkY2hpbGQuc2xpZGVUb2dnbGUoXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQsXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkY2hpbGQudG9nZ2xlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdCRib2R5XG5cdFx0XHRcdC5vbiggJ2NsaWNrJywgJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0XHRcdH0gKVxuXHRcdFx0XHQub24oICdrZXlkb3duJywgJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdGlmICggZS5rZXkgPT09ICcgJyB8fCBlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJ1NwYWNlYmFyJyApIHtcblx0XHRcdFx0XHRcdC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgYWN0aW9uIHRvIHN0b3Agc2Nyb2xsaW5nIHdoZW4gc3BhY2UgaXMgcHJlc3NlZFxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlU29mdExpbWl0OiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHRvZ2dsZUZpbHRlck9wdGlvbnMgPSAoICRlbCApID0+IHtcblx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBidXR0b24gaXMgcHJlc3NlZFxuXHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLXByZXNzZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHQvLyBDaGFuZ2UgYXJpYS1wcmVzc2VkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuXHRcdFx0XHQkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICEgcHJlc3NlZCApO1xuXG5cdFx0XHRcdGNvbnN0ICRsaXN0V3JhcHBlciA9ICRlbC5jbG9zZXN0KCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKTtcblxuXHRcdFx0XHRpZiAoIHByZXNzZWQgKSB7XG5cdFx0XHRcdFx0JGxpc3RXcmFwcGVyLnJlbW92ZUNsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkbGlzdFdyYXBwZXIuYWRkQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHQkYm9keVxuXHRcdFx0XHQub24oICdjbGljaycsICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dG9nZ2xlRmlsdGVyT3B0aW9ucyggJCggdGhpcyApICk7XG5cdFx0XHRcdH0gKVxuXHRcdFx0XHQub24oICdrZXlkb3duJywgJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRpZiAoIGUua2V5ID09PSAnICcgfHwgZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICdTcGFjZWJhcicgKSB7XG5cdFx0XHRcdFx0XHQvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvbiB0byBzdG9wIHNjcm9sbGluZyB3aGVuIHNwYWNlIGlzIHByZXNzZWRcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdFx0dG9nZ2xlRmlsdGVyT3B0aW9ucyggJCggdGhpcyApICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVTZWFyY2hGaWx0ZXJPcHRpb25zOiBmdW5jdGlvbigpIHtcblx0XHRcdCRib2R5Lm9uKCAnaW5wdXQnLCAnLndjYXBmLXNlYXJjaC1ib3ggaW5wdXRbdHlwZT1cInRleHRcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRoYXQgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgJGlubmVyICA9ICR0aGF0LmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyLWlubmVyJyApO1xuXHRcdFx0XHRjb25zdCAkZmlsdGVyID0gJGlubmVyLmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyJyApO1xuXG5cdFx0XHRcdGNvbnN0IHNvZnRMaW1pdEVuYWJsZWQgPSAkZmlsdGVyLmhhc0NsYXNzKCAnaGFzLXNvZnQtbGltaXQnICk7XG5cdFx0XHRcdGNvbnN0IHNvZnRMaW1pdFRvZ2dsZSAgPSAkZmlsdGVyLmZpbmQoICcud2NhcGYtc29mdC1saW1pdC13cmFwcGVyJyApO1xuXHRcdFx0XHRjb25zdCBub1Jlc3VsdHMgICAgICAgID0gJGZpbHRlci5maW5kKCAnLndjYXBmLW5vLXJlc3VsdHMtdGV4dCcgKTtcblx0XHRcdFx0Y29uc3QgdmlzaWJsZU9wdGlvbnMgICA9IHBhcnNlSW50KCAkZmlsdGVyLmF0dHIoICdkYXRhLXZpc2libGUtb3B0aW9ucycgKSApO1xuXG5cdFx0XHRcdGNvbnN0IGtleXdvcmQgPSAkdGhhdC52YWwoKTtcblxuXHRcdFx0XHRpZiAoICEga2V5d29yZC5sZW5ndGggKSB7XG5cdFx0XHRcdFx0bGV0IGluZGV4ID0gMDtcblx0XHRcdFx0XHQkZmlsdGVyLnJlbW92ZUNsYXNzKCAnc2VhcmNoLWFjdGl2ZScgKTtcblxuXHRcdFx0XHRcdCQuZWFjaCggJGlubmVyLmZpbmQoICcud2NhcGYtZmlsdGVyLW9wdGlvbnMgPiBsaScgKSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRpbmRleCsrO1xuXG5cdFx0XHRcdFx0XHRjb25zdCAkZmlsdGVySXRlbSA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLnJlbW92ZUNsYXNzKCAna2V5d29yZC1tYXRjaGVkJyApO1xuXG5cdFx0XHRcdFx0XHRpZiAoIHNvZnRMaW1pdEVuYWJsZWQgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggaW5kZXggPiB2aXNpYmxlT3B0aW9ucyApIHtcblx0XHRcdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5hZGRDbGFzcyggJ3djYXBmLWZpbHRlci1vcHRpb24taGlkZGVuJyApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLnJlbW92ZUNsYXNzKCAnd2NhcGYtZmlsdGVyLW9wdGlvbi1oaWRkZW4nICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0XHRpZiAoIHNvZnRMaW1pdEVuYWJsZWQgKSB7XG5cdFx0XHRcdFx0XHRzb2Z0TGltaXRUb2dnbGUucmVtb3ZlQXR0ciggJ3N0eWxlJyApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdG5vUmVzdWx0cy5jaGlsZHJlbiggJ3NwYW4nICkudGV4dCggJycgKTtcblx0XHRcdFx0XHRub1Jlc3VsdHMuaGlkZSgpO1xuXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IGluZGV4ID0gMDtcblx0XHRcdFx0JGZpbHRlci5hZGRDbGFzcyggJ3NlYXJjaC1hY3RpdmUnICk7XG5cblx0XHRcdFx0JC5lYWNoKCAkaW5uZXIuZmluZCggJy53Y2FwZi1maWx0ZXItb3B0aW9ucyA+IGxpJyApLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCAkZmlsdGVySXRlbSA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRjb25zdCBsYWJlbCAgICAgICA9ICRmaWx0ZXJJdGVtLmZpbmQoICcud2NhcGYtZmlsdGVyLWl0ZW0tbGFiZWwnICkuZGF0YSggJ2xhYmVsJyApO1xuXG5cdFx0XHRcdFx0aWYgKCBsYWJlbC50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoIGtleXdvcmQudG9Mb3dlckNhc2UoKSApICkge1xuXHRcdFx0XHRcdFx0aW5kZXgrKztcblxuXHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0uYWRkQ2xhc3MoICdrZXl3b3JkLW1hdGNoZWQnICk7XG5cblx0XHRcdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCBpbmRleCA+IHZpc2libGVPcHRpb25zICkge1xuXHRcdFx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLmFkZENsYXNzKCAnd2NhcGYtZmlsdGVyLW9wdGlvbi1oaWRkZW4nICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5yZW1vdmVDbGFzcyggJ2tleXdvcmQtbWF0Y2hlZCcgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRpZiAoIHNvZnRMaW1pdEVuYWJsZWQgKSB7XG5cdFx0XHRcdFx0aWYgKCBpbmRleCA8PSB2aXNpYmxlT3B0aW9ucyApIHtcblx0XHRcdFx0XHRcdHNvZnRMaW1pdFRvZ2dsZS5oaWRlKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHNvZnRMaW1pdFRvZ2dsZS5zaG93KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCAwID09PSBpbmRleCApIHtcblx0XHRcdFx0XHRub1Jlc3VsdHMuY2hpbGRyZW4oICdzcGFuJyApLnRleHQoIGtleXdvcmQgKTtcblx0XHRcdFx0XHRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5jaGlsZHJlbiggJ3NwYW4nICkudGV4dCggJycgKTtcblx0XHRcdFx0XHRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHR1cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0OiBmdW5jdGlvbiggJHJlc3BvbnNlICkge1xuXHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRjb25zdCBzZWxlY3RvciAgID0gJy53b29jb21tZXJjZS1yZXN1bHQtY291bnQnO1xuXHRcdFx0Y29uc3QgbmV3Q291bnQgICA9ICRyZXNwb25zZS5maW5kKCBzZWxlY3RvciApLmh0bWwoKTtcblxuXHRcdFx0JGJvZHkuZmluZCggc2VsZWN0b3IgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGVsID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdGlmICggISAkY29udGFpbmVyLmhhcyggJGVsICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdCRlbC5odG1sKCBuZXdDb3VudCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRzY3JvbGxUbzogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICdub25lJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc2Nyb2xsRm9yID0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfZm9yO1xuXHRcdFx0Y29uc3QgaXNNb2JpbGUgID0gd2NhcGZfcGFyYW1zLmlzX21vYmlsZTtcblx0XHRcdGxldCBwcm9jZWVkICAgICA9IGZhbHNlO1xuXG5cdFx0XHRpZiAoICdtb2JpbGUnID09PSBzY3JvbGxGb3IgJiYgaXNNb2JpbGUgKSB7XG5cdFx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmICggJ2Rlc2t0b3AnID09PSBzY3JvbGxGb3IgJiYgISBpc01vYmlsZSApIHtcblx0XHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0XHR9IGVsc2UgaWYgKCAnYm90aCcgPT09IHNjcm9sbEZvciApIHtcblx0XHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISBwcm9jZWVkICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCBhZGp1c3RpbmdPZmZzZXQsIG9mZnNldDtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKSB7XG5cdFx0XHRcdGFkanVzdGluZ09mZnNldCA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGNvbnRhaW5lcjtcblxuXHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXI7XG5cdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXI7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggJ2N1c3RvbScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93ICkge1xuXHRcdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudDtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIGNvbnRhaW5lciApO1xuXG5cdFx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRvZmZzZXQgPSAkY29udGFpbmVyLm9mZnNldCgpLnRvcCAtIGFkanVzdGluZ09mZnNldDtcblxuXHRcdFx0XHRpZiAoIG9mZnNldCA8IDAgKSB7XG5cdFx0XHRcdFx0b2Zmc2V0ID0gMDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmRpc2FibGVfc2Nyb2xsX2FuaW1hdGlvbiApIHtcblx0XHRcdFx0XHR3aW5kb3cuc2Nyb2xsVG8oIHsgdG9wOiBvZmZzZXQgfSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCQoICdodG1sLCBib2R5JyApLnN0b3AoKS5hbmltYXRlKFxuXHRcdFx0XHRcdFx0eyBzY3JvbGxUb3A6IG9mZnNldCB9LFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfc3BlZWQsXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9lYXNpbmdcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvLyBUaGluZ3MgYXJlIGRvbmUgYmVmb3JlIGZldGNoaW5nIHRoZSBwcm9kdWN0cyBsaWtlIHNob3dpbmcgdGhlIGxvYWRpbmcgaW5kaWNhdG9yLlxuXHRcdGJlZm9yZUZldGNoaW5nUHJvZHVjdHM6IGZ1bmN0aW9uKCB0cmlnZ2VyZWRCeSApIHtcblx0XHRcdC8vIFRyYWNrIHRoZSBjdXJyZW50IGVsZW1lbnQgZm9jdXMuXG5cdFx0XHRmb2N1c2VkRWxtID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcblxuXHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1sb2FkZXInICkuYWRkQ2xhc3MoICdpcy1hY3RpdmUnICk7XG5cblx0XHRcdGlmICggISBpc1BybyAmJiAnaW1tZWRpYXRlbHknID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd193aGVuICkge1xuXHRcdFx0XHRXQ0FQRi5zY3JvbGxUbygpO1xuXHRcdFx0fVxuXG5cdFx0XHQkZG9jdW1lbnQudHJpZ2dlciggJ3djYXBmX2JlZm9yZV9mZXRjaGluZ19wcm9kdWN0cycsIFsgdHJpZ2dlcmVkQnkgXSApO1xuXHRcdH0sXG5cdFx0ZGVzdHJveVRpcHB5SW5zdGFuY2VzOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnVzZV90aXBweWpzICkge1xuXHRcdFx0XHQvLyBAc291cmNlIGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9taWtzL3RpcHB5anMvaXNzdWVzLzQ3M1xuXHRcdFx0XHR0aXBweUluc3RhbmNlcy5mb3JFYWNoKCBpbnN0YW5jZSA9PiB7XG5cdFx0XHRcdFx0aW5zdGFuY2UuZGVzdHJveSgpO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHRcdHRpcHB5SW5zdGFuY2VzLmxlbmd0aCA9IDA7IC8vIGNsZWFyIGl0XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvLyBUaGluZ3MgYXJlIGRvbmUgYmVmb3JlIHVwZGF0aW5nIHRoZSBwcm9kdWN0cyBsaWtlIGhpZGluZyB0aGUgbG9hZGluZyBpbmRpY2F0b3IuXG5cdFx0YmVmb3JlVXBkYXRpbmdQcm9kdWN0czogZnVuY3Rpb24oICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgKSB7XG5cdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLWxvYWRlcicgKS5yZW1vdmVDbGFzcyggJ2lzLWFjdGl2ZScgKTtcblxuXHRcdFx0Ly8gTWF5YmUgZ29vZCBmb3IgcGVyZm9ybWFuY2UuXG5cdFx0XHRXQ0FQRi5kZXN0cm95VGlwcHlJbnN0YW5jZXMoKTtcblxuXHRcdFx0JGRvY3VtZW50LnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfdXBkYXRpbmdfcHJvZHVjdHMnLCBbICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgXSApO1xuXHRcdH0sXG5cdFx0YWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzOiBmdW5jdGlvbiggJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSApIHtcblx0XHRcdFdDQVBGLnVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQoICRyZXNwb25zZSApO1xuXG5cdFx0XHQvLyBSZXN0b3JlIHRoZSBmb2N1cyAoTWF5YmUgcmVzdG9yaW5nIHRoZSBmb2N1cyBpbiBtb2JpbGUgZGV2aWNlIGlzbid0IGdvb2QpLlxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucmVzdG9yZV9mb2N1c19hZnRlcl9maWx0ZXJpbmcgJiYgISB3Y2FwZl9wYXJhbXMuaXNfbW9iaWxlICkge1xuXHRcdFx0XHRpZiAoIGRvY3VtZW50LmJvZHkgIT09IGZvY3VzZWRFbG0gKSB7XG5cdFx0XHRcdFx0aWYgKCBmb2N1c2VkRWxtLmlkICkge1xuXHRcdFx0XHRcdFx0JCggYCMkeyBmb2N1c2VkRWxtLmlkIH1gICkuZm9jdXMoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVpbml0aWFsaXplIHdjYXBmLlxuXHRcdFx0V0NBUEYuaW5pdCgpO1xuXG5cdFx0XHRpZiAoICEgaXNQcm8gJiYgJ2FmdGVyJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfd2hlbiApIHtcblx0XHRcdFx0V0NBUEYuc2Nyb2xsVG8oKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVHJpZ2dlciBldmVudHMuXG5cdFx0XHQkKCBkb2N1bWVudCApLnRyaWdnZXIoICdyZWFkeScgKTtcblx0XHRcdCQoIHdpbmRvdyApLnRyaWdnZXIoICdzY3JvbGwnICk7XG5cdFx0XHQkKCB3aW5kb3cgKS50cmlnZ2VyKCAncmVzaXplJyApO1xuXG5cdFx0XHQvLyBBMyBMYXp5IExvYWQgc3VwcG9ydC5cblx0XHRcdCQoIHdpbmRvdyApLnRyaWdnZXIoICdsYXp5c2hvdycgKTtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuY3VzdG9tX3NjcmlwdHMgKSB7XG5cdFx0XHRcdGV2YWwoIHdjYXBmX3BhcmFtcy5jdXN0b21fc2NyaXB0cyApO1xuXHRcdFx0fVxuXG5cdFx0XHQkZG9jdW1lbnQudHJpZ2dlciggJ3djYXBmX2FmdGVyX3VwZGF0aW5nX3Byb2R1Y3RzJywgWyAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5IF0gKTtcblx0XHR9LFxuXHRcdGZpbHRlclByb2R1Y3RzOiBmdW5jdGlvbiggdHJpZ2dlcmVkQnkgPSAnZmlsdGVyJyApIHtcblx0XHRcdFdDQVBGLmJlZm9yZUZldGNoaW5nUHJvZHVjdHMoIHRyaWdnZXJlZEJ5ICk7XG5cblx0XHRcdCQuYWpheCgge1xuXHRcdFx0XHR1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHRcdFx0Y29uc3QgJHJlc3BvbnNlID0gJCggcmVzcG9uc2UgKTtcblxuXHRcdFx0XHRcdFdDQVBGLmJlZm9yZVVwZGF0aW5nUHJvZHVjdHMoICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgKTtcblxuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIFVwZGF0ZSBkb2N1bWVudCB0aXRsZS5cblx0XHRcdFx0XHQgKlxuXHRcdFx0XHRcdCAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzc1OTk1NjJcblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy51cGRhdGVfZG9jdW1lbnRfdGl0bGUgKSB7XG5cdFx0XHRcdFx0XHRkb2N1bWVudC50aXRsZSA9ICRyZXNwb25zZS5maWx0ZXIoICd0aXRsZScgKS50ZXh0KCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBpbnN0YW5jZXMuXG5cdFx0XHRcdFx0Zm9yICggY29uc3QgaWQgb2YgaW5zdGFuY2VJZHMgKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBpbnN0YW5jZUlkID0gJ1tkYXRhLWlkPVwiJyArIGlkICsgJ1wiXSc7XG5cdFx0XHRcdFx0XHRjb25zdCAkaW5zdGFuY2UgID0gJCggaW5zdGFuY2VJZCApO1xuXHRcdFx0XHRcdFx0Y29uc3QgJGlubmVyICAgICA9ICRpbnN0YW5jZS5maW5kKCAnLndjYXBmLWZpbHRlci1pbm5lcicgKTtcblx0XHRcdFx0XHRcdGNvbnN0IF9pbnN0YW5jZSAgPSAkcmVzcG9uc2UuZmluZCggaW5zdGFuY2VJZCApO1xuXG5cdFx0XHRcdFx0XHQvLyBQcmVzZXJ2ZSBoaWVyYXJjaHkgYWNjb3JkaW9uIHN0YXRlLlxuXHRcdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkaW5zdGFuY2UuaGFzQ2xhc3MoICdoYXMtaGllcmFyY2h5LWFjY29yZGlvbicgKSApIHtcblx0XHRcdFx0XHRcdFx0XHQkaW5zdGFuY2UuZmluZCggJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0ICRlbCA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IGlkICA9ICRlbC5kYXRhKCAnaWQnICk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHRvZ2dsZVNlbGVjdG9yID0gYC53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZVtkYXRhLWlkPVwiJHsgaWQgfVwiXWA7XG5cblx0XHRcdFx0XHRcdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYWNjb3JkaW9uIGlzIG9wZW5lZFxuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGlmICggcHJlc3NlZCApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICd0cnVlJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5jbG9zZXN0KCAnbGknICkuY2hpbGRyZW4oICd1bCcgKS5zaG93KCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5hdHRyKCAnYXJpYS1wcmVzc2VkJywgJ2ZhbHNlJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5jbG9zZXN0KCAnbGknICkuY2hpbGRyZW4oICd1bCcgKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIFByZXNlcnZlIHNvZnQgbGltaXQgc3RhdGUuXG5cdFx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5wcmVzZXJ2ZV9zb2Z0X2xpbWl0X3N0YXRlICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRpbnN0YW5jZS5oYXNDbGFzcyggJ2hhcy1zb2Z0LWxpbWl0JyApICkge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0ICRsaXN0V3JhcHBlciA9ICRpbnN0YW5jZS5maW5kKCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKTtcblxuXHRcdFx0XHRcdFx0XHRcdGlmICggJGxpc3RXcmFwcGVyLmhhc0NsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKS5hZGRDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICd0cnVlJyApO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1saXN0LXdyYXBwZXInICkucmVtb3ZlQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJyApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAnZmFsc2UnICk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGNvbnN0IF9odG1sID0gX2luc3RhbmNlLmZpbmQoICcud2NhcGYtZmlsdGVyLWlubmVyJyApLmh0bWwoKTtcblxuXHRcdFx0XHRcdFx0Ly8gRmluYWxseSB1cGRhdGUgdGhlIGluc3RhbmNlLlxuXHRcdFx0XHRcdFx0JGlubmVyLmh0bWwoIF9odG1sICk7XG5cblx0XHRcdFx0XHRcdCRpbnN0YW5jZS50cmlnZ2VyKCAnd2NhcGYtZmlsdGVyLXVwZGF0ZWQnLCBbIF9pbnN0YW5jZSBdICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBhY3RpdmUgZmlsdGVycyBhbmQgcmVzZXQgZmlsdGVycy5cblx0XHRcdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLWFjdGl2ZS1maWx0ZXJzLCAud2NhcGYtcmVzZXQtZmlsdGVycycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGNvbnN0ICR0aGF0ICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0XHRjb25zdCBpbnN0YW5jZUlkID0gJ1tkYXRhLWlkPVwiJyArICR0aGF0LmRhdGEoICdpZCcgKSArICdcIl0nO1xuXG5cdFx0XHRcdFx0XHQkdGhhdC5odG1sKCAkcmVzcG9uc2UuZmluZCggaW5zdGFuY2VJZCApLmh0bWwoKSApO1xuXHRcdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRcdC8vIFJlcGxhY2Ugb2xkIHNob3AgbG9vcCB3aXRoIG5ldyBvbmUuXG5cdFx0XHRcdFx0Y29uc3QgJHNob3BMb29wQ29udGFpbmVyID0gJHJlc3BvbnNlLmZpbmQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRcdFx0Y29uc3QgJG5vdEZvdW5kQ29udGFpbmVyID0gJHJlc3BvbnNlLmZpbmQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICk7XG5cblx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyID09PSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRXQ0FQRi5hZnRlclVwZGF0aW5nUHJvZHVjdHMoICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0cmVxdWVzdEZpbHRlcjogZnVuY3Rpb24oIHVybCwgdHJpZ2dlcmVkQnkgPSAnZmlsdGVyJyApIHtcblx0XHRcdGlmICggISB1cmwgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaG9zdG5hbWUgPSBsb2NhdGlvbi5ob3N0bmFtZTtcblxuXHRcdFx0Ly8gVE9ETzogUmVtb3ZlIGZyb20gcHJvZHVjdGlvbiBidWlsZC5cblx0XHRcdGlmICggJ2xvY2FsaG9zdCcgPT09IGhvc3RuYW1lICkge1xuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSggJ2h0dHA6Ly93Y2ZpbHRlci0yLnRlc3QnLCAnLy9sb2NhbGhvc3Q6MzAwMCcgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZGlzYWJsZV9hamF4ICkge1xuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IHVybDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7IHdjYXBmOiB0cnVlIH0sICcnLCB1cmwgKTtcblxuXHRcdFx0XHRXQ0FQRi5maWx0ZXJQcm9kdWN0cyggdHJpZ2dlcmVkQnkgKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGhhbmRsZU51bWJlcklucHV0RmlsdGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCByYW5nZU51bWJlclNlbGVjdG9ycyA9ICcud2NhcGYtcmFuZ2UtbnVtYmVyIC5taW4tdmFsdWUsIC53Y2FwZi1yYW5nZS1udW1iZXIgLm1heC12YWx1ZSc7XG5cblx0XHRcdCRib2R5Lm9uKCAnaW5wdXQnLCByYW5nZU51bWJlclNlbGVjdG9ycywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRpdGVtID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdGNvbnN0ICRyYW5nZU51bWJlciAgICAgID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1yYW5nZS1udW1iZXInICk7XG5cdFx0XHRcdGNvbnN0IGZvcm1hdE51bWJlcnMgICAgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWZvcm1hdC1udW1iZXJzJyApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1pblZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IG9sZE1pblZhbHVlICAgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBvbGRNYXhWYWx1ZSAgICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFBsYWNlcyAgICAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZGVjaW1hbC1wbGFjZXMnICk7XG5cdFx0XHRcdGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXRob3VzYW5kLXNlcGFyYXRvcicgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFNlcGFyYXRvciAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZGVjaW1hbC1zZXBhcmF0b3InICk7XG5cblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGl0ZW0uZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0Y29uc3QgZ2V0VmFsdWUgPSAoIGZsb2F0VmFsdWUgKSA9PiB7XG5cdFx0XHRcdFx0aWYgKCBmb3JtYXROdW1iZXJzICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG51bWJlckZvcm1hdCggZmxvYXRWYWx1ZSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gZmxvYXRWYWx1ZTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQkaXRlbS5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRsZXQgbWluVmFsdWUgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCkgKTtcblx0XHRcdFx0XHRsZXQgbWF4VmFsdWUgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCkgKTtcblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRcdFx0aWYgKCBpc05hTiggbWluVmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNaW5WYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0XHRcdGlmICggaXNOYU4oIG1heFZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgcmFuZ2VNaW5WYWx1ZS5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlIDwgcmFuZ2VNaW5WYWx1ZSApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNaW5WYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPiByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBtYXhWYWx1ZSA+IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgbWluVmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA+IG1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSBtaW5WYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBJZiB2YWx1ZSBpcyBub3QgY2hhbmdlZCB0aGVuIGRvbid0IHByb2NlZWQuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gb2xkTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IG9sZE1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHQvLyBSZW1vdmUgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJHJhbmdlTnVtYmVyLmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIEFkZCByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0XHRjb25zdCB1cmwgPSAkcmFuZ2VOdW1iZXIuZGF0YSggJ3VybCcgKS5yZXBsYWNlKCAnJTFzJywgbWluVmFsdWUgKS5yZXBsYWNlKCAnJTJzJywgbWF4VmFsdWUgKTtcblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlRGF0ZUlucHV0RmlsdGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsICcud2NhcGYtZGF0ZS1pbnB1dCAuZGF0ZS1pbnB1dCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkZmlsdGVyID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZGF0ZS1pbnB1dCcgKTtcblx0XHRcdFx0Y29uc3QgaXNSYW5nZSA9ICRmaWx0ZXIuZGF0YSggJ2lzLXJhbmdlJyApO1xuXG5cdFx0XHRcdGxldCBmaWx0ZXJVcmwgPSAnJztcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkZmlsdGVyLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdGlmICggaXNSYW5nZSApIHtcblx0XHRcdFx0XHRjb25zdCBmcm9tID0gJGZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKS52YWwoKTtcblx0XHRcdFx0XHRjb25zdCB0byAgID0gJGZpbHRlci5maW5kKCAnLmRhdGUtdG8taW5wdXQnICkudmFsKCk7XG5cblx0XHRcdFx0XHRpZiAoIGZyb20gJiYgdG8gKSB7XG5cdFx0XHRcdFx0XHRmaWx0ZXJVcmwgPSAkZmlsdGVyLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIGZyb20gKS5yZXBsYWNlKCAnJTJzJywgdG8gKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCAhIGZyb20gJiYgISB0byApIHtcblx0XHRcdFx0XHRcdGZpbHRlclVybCA9ICRmaWx0ZXIuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IGZyb20gPSAkZmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApLnZhbCgpO1xuXG5cdFx0XHRcdFx0aWYgKCBmcm9tICkge1xuXHRcdFx0XHRcdFx0ZmlsdGVyVXJsID0gJGZpbHRlci5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclcycsIGZyb20gKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZmlsdGVyVXJsID0gJGZpbHRlci5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIGZpbHRlclVybCApIHtcblx0XHRcdFx0XHQkZmlsdGVyLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGZpbHRlci5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIGZpbHRlclVybCApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlTGlzdEZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgbmF0aXZlSW5wdXRzID0gJy5saXN0LXR5cGUtbmF0aXZlIFt0eXBlPVwiY2hlY2tib3hcIl0sJyArXG5cdFx0XHRcdCcubGlzdC10eXBlLW5hdGl2ZSBbdHlwZT1cInJhZGlvXCJdLCcgK1xuXHRcdFx0XHQnLmxpc3QtdHlwZS1jdXN0b20tY2hlY2tib3ggW3R5cGU9XCJjaGVja2JveFwiXSc7XG5cblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgbmF0aXZlSW5wdXRzLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyLWl0ZW0nICkudG9nZ2xlQ2xhc3MoICdpdGVtLWFjdGl2ZScgKTtcblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkKCB0aGlzICkuZGF0YSggJ3VybCcgKSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRjb25zdCBjdXN0b21SYWRpb1NlbGVjdG9yID0gJy5saXN0LXR5cGUtY3VzdG9tLXJhZGlvJztcblxuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCBjdXN0b21SYWRpb1NlbGVjdG9yICsgJyBbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZpbHRlci1pdGVtJyApLnRvZ2dsZUNsYXNzKCAnaXRlbS1hY3RpdmUnICk7XG5cblx0XHRcdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzU4Mzk5MjRcblx0XHRcdFx0JCggdGhpcyApXG5cdFx0XHRcdFx0LmNsb3Nlc3QoIGN1c3RvbVJhZGlvU2VsZWN0b3IgKVxuXHRcdFx0XHRcdC5maW5kKCAnLndjYXBmLWZpbHRlci1pdGVtLml0ZW0tYWN0aXZlIFt0eXBlPVwiY2hlY2tib3hcIl0nIClcblx0XHRcdFx0XHQubm90KCB0aGlzIClcblx0XHRcdFx0XHQucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApXG5cdFx0XHRcdFx0LmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyLWl0ZW0nIClcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoICdpdGVtLWFjdGl2ZScgKTtcblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkKCB0aGlzICkuZGF0YSggJ3VybCcgKSApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlRHJvcGRvd25GaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgJy53Y2FwZi1kcm9wZG93bi13cmFwcGVyIHNlbGVjdCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkc2VsZWN0ICAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgdmFsdWVzICAgICAgICAgPSAkc2VsZWN0LnZhbCgpO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJVUkwgICAgICA9ICRzZWxlY3QuZGF0YSggJ3VybCcgKTtcblx0XHRcdFx0Y29uc3QgY2xlYXJGaWx0ZXJVUkwgPSAkc2VsZWN0LmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApO1xuXHRcdFx0XHRsZXQgdXJsO1xuXG5cdFx0XHRcdGlmICggdmFsdWVzLmxlbmd0aCApIHtcblx0XHRcdFx0XHR1cmwgPSBmaWx0ZXJVUkwucmVwbGFjZSggJyVzJywgdmFsdWVzLnRvU3RyaW5nKCkgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR1cmwgPSBjbGVhckZpbHRlclVSTDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlUGFnaW5hdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfcGFnaW5hdGlvbl92aWFfYWpheCAmJiB3Y2FwZl9wYXJhbXMucGFnaW5hdGlvbl9jb250YWluZXIgKSB7XG5cdFx0XHRcdGNvbnN0ICRjb250YWluZXIgPSAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0XHRjb25zdCBfc2VsZWN0b3JzID0gd2NhcGZfcGFyYW1zLnBhZ2luYXRpb25fY29udGFpbmVyLnNwbGl0KCAnLCcgKTtcblx0XHRcdFx0Y29uc3Qgc2VsZWN0b3JzICA9IFtdO1xuXG5cdFx0XHRcdF9zZWxlY3RvcnMuZm9yRWFjaCggc2VsZWN0b3IgPT4ge1xuXHRcdFx0XHRcdGlmICggc2VsZWN0b3IgKSB7XG5cdFx0XHRcdFx0XHRzZWxlY3RvcnMucHVzaCggc2VsZWN0b3IgKyAnIGEnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0Y29uc3Qgc2VsZWN0b3IgPSBzZWxlY3RvcnMuam9pbiggJywnICk7XG5cblx0XHRcdFx0aWYgKCAkY29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHQkY29udGFpbmVyLm9uKCAnY2xpY2snLCBzZWxlY3RvciwgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IGhyZWYgPSAkKCB0aGlzICkuYXR0ciggJ2hyZWYnICk7XG5cblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIGhyZWYsICdwYWdpbmF0ZScgKTtcblx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdGhhbmRsZURlZmF1bHRPcmRlcmJ5OiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMuc29ydGluZ19jb250cm9sICkge1xuXHRcdFx0XHQvLyBTdWJtaXQgdGhlIG9yZGVyYnkgZm9ybSB3aGVuIHZhbHVlIGlzIGNoYW5nZWQuXG5cdFx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgJy53b29jb21tZXJjZS1vcmRlcmluZyBzZWxlY3Qub3JkZXJieScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5jbG9zZXN0KCAnZm9ybScgKS50cmlnZ2VyKCAnc3VibWl0JyApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBQcmV2ZW50IHRoZSBhdXRvIHN1Ym1pc3Npb24gb2YgdGhlIG9yZGVyYnkgZm9ybS5cblx0XHRcdCRib2R5Lm9uKCAnc3VibWl0JywgJy53b29jb21tZXJjZS1vcmRlcmluZycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgdmlhIGFqYXggd2hlbiB0aGUgb3JkZXJieSB2YWx1ZSBpcyBjaGFuZ2VkLlxuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nIHNlbGVjdC5vcmRlcmJ5JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0IG9yZGVyID0gJCggdGhpcyApLnZhbCgpO1xuXG5cdFx0XHRcdGNvbnN0IHVybCA9IG5ldyBVUkwoIHdpbmRvdy5sb2NhdGlvbiApO1xuXHRcdFx0XHR1cmwuc2VhcmNoUGFyYW1zLnNldCggJ29yZGVyYnknLCBvcmRlciApO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIGdldE9yZGVyQnlVcmwoIHVybC5ocmVmICkgKTtcblxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVDbGVhckZpbHRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHQkYm9keS5vbiggJ2NsaWNrJywgJy53Y2FwZi1maWx0ZXItY2xlYXItYnRuJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJCggdGhpcyApLmF0dHIoICdkYXRhLWNsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZUZpbHRlclRvb2x0aXA6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZFJlZmVyZW5jZVxuXHRcdFx0aWYgKCAnZnVuY3Rpb24nICE9PSB0eXBlb2YgdGlwcHkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy51c2VfdGlwcHlqcyApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkUmVmZXJlbmNlXG5cdFx0XHR0aXBweSggJy53Y2FwZi1maWx0ZXItdG9vbHRpcCcsIHtcblx0XHRcdFx0cGxhY2VtZW50OiAndG9wJyxcblx0XHRcdFx0Y29udGVudCggcmVmZXJlbmNlICkge1xuXHRcdFx0XHRcdHJldHVybiByZWZlcmVuY2UuZ2V0QXR0cmlidXRlKCAnZGF0YS1jb250ZW50JyApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRhbGxvd0hUTUw6IHRydWUsXG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRpbml0Q29tYm9ib3g6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAhIGpRdWVyeSgpLmNob3NlbldDQVBGICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHRlbXBsYXRlUmVzdWx0ID0gKCB0ZXh0LCBkYXRhICkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdCc8c3Bhbj4nICsgdGV4dCArICc8L3NwYW4+Jyxcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJ3Y2FwZi1jb3VudFwiPicgKyBkYXRhWyAnY291bnRNYXJrdXAnIF0gKyAnPC9zcGFuPicsXG5cdFx0XHRcdF0uam9pbiggJycgKTtcblx0XHRcdH07XG5cblx0XHRcdGNvbnN0IHRlbXBsYXRlU2VsZWN0aW9uID0gKCB0ZXh0LCBkYXRhICkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cIndjYXBmLWNvdW50LScgKyBkYXRhLmNvdW50ICsgJ1wiPicgKyB0ZXh0ICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cIndjYXBmLWNvdW50IHdjYXBmLWNvdW50LScgKyBkYXRhLmNvdW50ICsgJ1wiPicgKyBkYXRhWyAnY291bnRNYXJrdXAnIF0gKyAnPC9zcGFuPicsXG5cdFx0XHRcdF0uam9pbiggJycgKTtcblx0XHRcdH07XG5cblx0XHRcdGNvbnN0IGRlZmF1bHRzID0ge1xuXHRcdFx0XHRpbmhlcml0X3NlbGVjdF9jbGFzc2VzOiB0cnVlLFxuXHRcdFx0XHRpbmhlcml0X29wdGlvbl9jbGFzc2VzOiB0cnVlLFxuXHRcdFx0XHRub19yZXN1bHRzX3RleHQ6IHdjYXBmX3BhcmFtcy5jaG9zZW5fbm9fcmVzdWx0c190ZXh0LFxuXHRcdFx0XHRvcHRpb25zX25vbmVfdGV4dDogd2NhcGZfcGFyYW1zLmNob3Nlbl9vcHRpb25zX25vbmVfdGV4dCxcblx0XHRcdFx0c2VhcmNoX2NvbnRhaW5zOiB0cnVlLCAvLyBNYXRjaCBmcm9tIGFueXdoZXJlIGluIHN0cmluZy5cblx0XHRcdFx0c2VhcmNoX2luX3ZhbHVlczogdHJ1ZSwgLy8gU2VhcmNoIGluIHZhbHVlcyBhbHNvLlxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuaXNfcnRsICkge1xuXHRcdFx0XHRkZWZhdWx0c1sgJ3J0bCcgXSA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdCRib2R5LmZpbmQoICcud2NhcGYtY2hvc2VuJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkdGhpcyAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0cyB9O1xuXG5cdFx0XHRcdC8vIElmIGhpZXJhcmNoeSBlbmFibGVkIHRoZW4gd2Ugc2hvdyB0aGUgc2VsZWN0ZWQgb3B0aW9ucy5cblx0XHRcdFx0aWYgKCAkdGhpcy5oYXNDbGFzcyggJ2hhcy1oaWVyYXJjaHknICkgKSB7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucycgXSA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucycgXSA9IHdjYXBmX3BhcmFtcy5jaG9zZW5fZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gRW5hYmxlIHRlbXBsYXRpbmcgd2hlbiBzaG93aW5nIGNvdW50LlxuXHRcdFx0XHRpZiAoICR0aGlzLmhhc0NsYXNzKCAnd2l0aC1jb3VudCcgKSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAndGVtcGxhdGVSZXN1bHQnIF0gICAgPSB0ZW1wbGF0ZVJlc3VsdDtcblx0XHRcdFx0XHRvcHRpb25zWyAndGVtcGxhdGVTZWxlY3Rpb24nIF0gPSB0ZW1wbGF0ZVNlbGVjdGlvbjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIERpc2FibGUgc2VhcmNoIGJveC5cblx0XHRcdFx0aWYgKCAhICR0aGlzLmRhdGEoICdlbmFibGUtc2VhcmNoJyApICkge1xuXHRcdFx0XHRcdG9wdGlvbnNbICdkaXNhYmxlX3NlYXJjaCcgXSA9IHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkdGhpcy5jaG9zZW5XQ0FQRiggb3B0aW9ucyApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBBdHRhY2ggY2hvc2VuIGZvciBkZWZhdWx0IG9yZGVyYnkuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5hdHRhY2hfY2hvc2VuX29uX3NvcnRpbmcgKSB7XG5cdFx0XHRcdGxldCBkaXNhYmxlU2VhcmNoID0gdHJ1ZTtcblxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zZWFyY2hfYm94X2luX2RlZmF1bHRfb3JkZXJieSApIHtcblx0XHRcdFx0XHRkaXNhYmxlU2VhcmNoID0gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0cyB9O1xuXG5cdFx0XHRcdG9wdGlvbnNbICdkaXNhYmxlX3NlYXJjaCcgXSA9IGRpc2FibGVTZWFyY2g7XG5cblx0XHRcdFx0JGJvZHkuZmluZCggJy53b29jb21tZXJjZS1vcmRlcmluZyBzZWxlY3Qub3JkZXJieScgKS5jaG9zZW5XQ0FQRiggb3B0aW9ucyApO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aW5pdFJhbmdlU2xpZGVyOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCRib2R5LmZpbmQoICcud2NhcGYtcmFuZ2Utc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkaXRlbSAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCAkc2xpZGVyID0gJGl0ZW0uZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKTtcblxuXHRcdFx0XHRjb25zdCBzbGlkZXJJZCAgICAgICAgICA9ICRzbGlkZXIuYXR0ciggJ2lkJyApO1xuXHRcdFx0XHRjb25zdCBkaXNwbGF5VmFsdWVzQXMgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRpc3BsYXktdmFsdWVzLWFzJyApO1xuXHRcdFx0XHRjb25zdCBmb3JtYXROdW1iZXJzICAgICA9ICRpdGVtLmF0dHIoICdkYXRhLWZvcm1hdC1udW1iZXJzJyApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1pblZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBzdGVwICAgICAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXN0ZXAnICkgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFBsYWNlcyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRcdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkaXRlbS5hdHRyKCAnZGF0YS10aG91c2FuZC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IG1pblZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IG1heFZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0ICRtaW5WYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5taW4tdmFsdWUnICk7XG5cdFx0XHRcdGNvbnN0ICRtYXhWYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5tYXgtdmFsdWUnICk7XG5cblx0XHRcdFx0Y29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIHNsaWRlcklkICk7XG5cblx0XHRcdFx0bm9VaVNsaWRlci5jcmVhdGUoIHNsaWRlciwge1xuXHRcdFx0XHRcdHN0YXJ0OiBbIG1pblZhbHVlLCBtYXhWYWx1ZSBdLFxuXHRcdFx0XHRcdHN0ZXAsXG5cdFx0XHRcdFx0Y29ubmVjdDogdHJ1ZSxcblx0XHRcdFx0XHRjc3NQcmVmaXg6ICd3Y2FwZi1ub3VpLScsXG5cdFx0XHRcdFx0cmFuZ2U6IHtcblx0XHRcdFx0XHRcdCdtaW4nOiByYW5nZU1pblZhbHVlLFxuXHRcdFx0XHRcdFx0J21heCc6IHJhbmdlTWF4VmFsdWUsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICd1cGRhdGUnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHRcdGxldCBtaW5WYWx1ZTtcblx0XHRcdFx0XHRsZXQgbWF4VmFsdWU7XG5cblx0XHRcdFx0XHRpZiAoIGZvcm1hdE51bWJlcnMgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IG51bWJlckZvcm1hdCggdmFsdWVzWyAwIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IG51bWJlckZvcm1hdCggdmFsdWVzWyAxIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAwIF0gKTtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoICdwbGFpbl90ZXh0JyA9PT0gZGlzcGxheVZhbHVlc0FzICkge1xuXHRcdFx0XHRcdFx0JG1pblZhbHVlLmh0bWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0XHQkbWF4VmFsdWUuaHRtbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JG1pblZhbHVlLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHRcdCRtYXhWYWx1ZS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICkge1xuXHRcdFx0XHRcdGNvbnN0IF9taW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0Y29uc3QgX21heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblxuXHRcdFx0XHRcdC8vIElmIHZhbHVlIGlzIG5vdCBjaGFuZ2VkIHRoZW4gZG9uJ3QgcHJvY2VlZC5cblx0XHRcdFx0XHRpZiAoIF9taW5WYWx1ZSA9PT0gbWluVmFsdWUgJiYgX21heFZhbHVlID09PSBtYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIF9taW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBfbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHQvLyBSZW1vdmUgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJGl0ZW0uZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdGNvbnN0IHVybCA9ICRpdGVtLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIF9taW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBfbWF4VmFsdWUgKTtcblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtaW5WYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG1pblZhbHVlLCBudWxsIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkbWF4VmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRcdGNsZWFyVGltZW91dCggJGlucHV0LmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBudWxsLCBtYXhWYWx1ZSBdICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRpbml0RGF0ZXBpY2tlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgalF1ZXJ5KCkuZGF0ZXBpY2tlciApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCAkd2NhcGZEYXRlRmlsdGVyID0gJGJvZHkuZmluZCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXG5cdFx0XHRjb25zdCBmb3JtYXQgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLWZvcm1hdCcgKTtcblx0XHRcdGNvbnN0IHllYXJEcm9wZG93biAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtcGlja2VyLXllYXItZHJvcGRvd24nICk7XG5cdFx0XHRjb25zdCBtb250aERyb3Bkb3duID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLXBpY2tlci1tb250aC1kcm9wZG93bicgKTtcblxuXHRcdFx0Y29uc3QgJGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApO1xuXHRcdFx0Y29uc3QgJHRvICAgPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKTtcblxuXHRcdFx0JGZyb20uZGF0ZXBpY2tlcigge1xuXHRcdFx0XHRkYXRlRm9ybWF0OiBmb3JtYXQsXG5cdFx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdFx0Y2hhbmdlTW9udGg6IG1vbnRoRHJvcGRvd24sXG5cdFx0XHR9ICk7XG5cblx0XHRcdCR0by5kYXRlcGlja2VyKCB7XG5cdFx0XHRcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdFx0Y2hhbmdlWWVhcjogeWVhckRyb3Bkb3duLFxuXHRcdFx0XHRjaGFuZ2VNb250aDogbW9udGhEcm9wZG93bixcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXRGaWx0ZXJPcHRpb25Ub29sdGlwOiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRSZWZlcmVuY2Vcblx0XHRcdGlmICggJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHRpcHB5ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMudXNlX3RpcHB5anMgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgdG9vbHRpcFBvc2l0aW9ucyA9IFsgJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCcgXTtcblxuXHRcdFx0dG9vbHRpcFBvc2l0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbiggdG9vbHRpcFBvc2l0aW9uICkge1xuXHRcdFx0XHRjb25zdCBpZGVudGlmaWVyID0gJ2RhdGEtd2NhcGYtdG9vbHRpcC0nICsgdG9vbHRpcFBvc2l0aW9uO1xuXG5cdFx0XHRcdC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRSZWZlcmVuY2Vcblx0XHRcdFx0Y29uc3QgaW5zdGFuY2VzID0gdGlwcHkoICdbJyArIGlkZW50aWZpZXIgKyAnXScsIHtcblx0XHRcdFx0XHRwbGFjZW1lbnQ6IHRvb2x0aXBQb3NpdGlvbixcblx0XHRcdFx0XHRjb250ZW50KCByZWZlcmVuY2UgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSggaWRlbnRpZmllciApO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0YWxsb3dIVE1MOiB0cnVlLFxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0d2luZG93LnRpcHB5SW5zdGFuY2VzID0gdGlwcHlJbnN0YW5jZXMuY29uY2F0KCBpbnN0YW5jZXMgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0V0NBUEYuaW5pdENvbWJvYm94KCk7XG5cdFx0XHRXQ0FQRi5pbml0UmFuZ2VTbGlkZXIoKTtcblx0XHRcdFdDQVBGLmluaXREYXRlcGlja2VyKCk7XG5cdFx0XHRXQ0FQRi5pbml0RmlsdGVyT3B0aW9uVG9vbHRpcCgpO1xuXHRcdH0sXG5cdFx0aW5pdFBvcFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnJlbG9hZF9vbl9iYWNrICYmIHdjYXBmX3BhcmFtcy5mb3VuZF93Y2FwZiApIHtcblx0XHRcdFx0aGlzdG9yeS5yZXBsYWNlU3RhdGUoIHsgd2NhcGY6IHRydWUgfSwgJycsIHdpbmRvdy5sb2NhdGlvbiApO1xuXG5cdFx0XHRcdC8vIEhhbmRsZSB0aGUgcG9wc3RhdGUgZXZlbnQoYnJvd3NlcidzIGJhY2svZm9yd2FyZClcblx0XHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdwb3BzdGF0ZScsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdGlmICggbnVsbCAhPT0gZS5zdGF0ZSAmJiBlLnN0YXRlLmhhc093blByb3BlcnR5KCAnd2NhcGYnICkgKSB7XG5cdFx0XHRcdFx0XHRXQ0FQRi5maWx0ZXJQcm9kdWN0cyggJ3BvcHN0YXRlJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICogRW5hYmxlIGl0IGlmIG5lY2Vzc2FyeS5cblx0ICpcblx0ICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzMwMDQ5MTdcblx0ICovXG5cdGlmICggJ3Njcm9sbFJlc3RvcmF0aW9uJyBpbiBoaXN0b3J5ICkge1xuXHRcdC8vIGhpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb24gPSAnbWFudWFsJztcblx0fVxuXG59KCBqUXVlcnksIHdpbmRvdyApICk7XG5cbiggZnVuY3Rpb24oICQsIFdDQVBGICkge1xuXG5cdFdDQVBGLmluaXQoKTtcblx0V0NBUEYuaW5pdFBvcFN0YXRlKCk7XG5cblx0V0NBUEYuaGFuZGxlRmlsdGVyQWNjb3JkaW9uKCk7XG5cdFdDQVBGLmhhbmRsZUhpZXJhcmNoeVRvZ2dsZSgpO1xuXHRXQ0FQRi5oYW5kbGVTb2Z0TGltaXQoKTtcblx0V0NBUEYuaGFuZGxlU2VhcmNoRmlsdGVyT3B0aW9ucygpO1xuXG5cdFdDQVBGLmhhbmRsZUxpc3RGaWx0ZXJzKCk7XG5cdFdDQVBGLmhhbmRsZURyb3Bkb3duRmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVOdW1iZXJJbnB1dEZpbHRlcnMoKTtcblx0V0NBUEYuaGFuZGxlRGF0ZUlucHV0RmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVQYWdpbmF0aW9uKCk7XG5cdFdDQVBGLmhhbmRsZURlZmF1bHRPcmRlcmJ5KCk7XG5cblx0V0NBUEYuaGFuZGxlQ2xlYXJGaWx0ZXIoKTtcblxuXHRXQ0FQRi5oYW5kbGVGaWx0ZXJUb29sdGlwKCk7XG5cblx0LyoqXG5cdCAqIE1ha2UgaXQgY29tcGF0aWJsZSB3aXRoIG90aGVyIHBsdWdpbnMuXG5cdCAqL1xuXHQkKCBkb2N1bWVudCApLm9uKCAnd2NhcGZfYWZ0ZXJfdXBkYXRpbmdfcHJvZHVjdHMnLCBmdW5jdGlvbigpIHtcblx0XHQvLyB3b28tdmFyaWF0aW9uLXN3YXRjaGVzXG5cdFx0JCggZG9jdW1lbnQgKS50cmlnZ2VyKCAnd29vX3ZhcmlhdGlvbl9zd2F0Y2hlc19wcm9faW5pdCcgKTtcblx0fSApO1xuXG59KCBqUXVlcnksIHdpbmRvdy5XQ0FQRiApICk7XG4iLCIvKipcbiAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM0MTQxODEzXG4gKlxuICogQHBhcmFtIG51bWJlclxuICogQHBhcmFtIGRlY2ltYWxzXG4gKiBAcGFyYW0gZGVjX3BvaW50XG4gKiBAcGFyYW0gdGhvdXNhbmRzX3NlcFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIG51bWJlckZvcm1hdCggbnVtYmVyLCBkZWNpbWFscywgZGVjX3BvaW50LCB0aG91c2FuZHNfc2VwICkge1xuXHQvLyBTdHJpcCBhbGwgY2hhcmFjdGVycyBidXQgbnVtZXJpY2FsIG9uZXMuXG5cdG51bWJlciA9ICggbnVtYmVyICsgJycgKS5yZXBsYWNlKCAvW15cXGQrXFwtRWUuXS9nLCAnJyApO1xuXG5cdGNvbnN0IG4gICAgPSAhIGlzRmluaXRlKCArbnVtYmVyICkgPyAwIDogK251bWJlcjtcblx0Y29uc3QgcHJlYyA9ICEgaXNGaW5pdGUoICtkZWNpbWFscyApID8gMCA6IE1hdGguYWJzKCBkZWNpbWFscyApO1xuXHRjb25zdCBzZXAgID0gKCB0eXBlb2YgdGhvdXNhbmRzX3NlcCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcsJyA6IHRob3VzYW5kc19zZXA7XG5cdGNvbnN0IGRlYyAgPSAoIHR5cGVvZiBkZWNfcG9pbnQgPT09ICd1bmRlZmluZWQnICkgPyAnLicgOiBkZWNfcG9pbnQ7XG5cblx0bGV0IHM7XG5cblx0Y29uc3QgdG9GaXhlZEZpeCA9IGZ1bmN0aW9uKCBuLCBwcmVjICkge1xuXHRcdGNvbnN0IGsgPSBNYXRoLnBvdyggMTAsIHByZWMgKTtcblx0XHRyZXR1cm4gJycgKyBNYXRoLnJvdW5kKCBuICogayApIC8gaztcblx0fTtcblxuXHQvLyBGaXggZm9yIElFIHBhcnNlRmxvYXQoMC41NSkudG9GaXhlZCgwKSA9IDA7XG5cdHMgPSAoIHByZWMgPyB0b0ZpeGVkRml4KCBuLCBwcmVjICkgOiAnJyArIE1hdGgucm91bmQoIG4gKSApLnNwbGl0KCAnLicgKTtcblxuXHRpZiAoIHNbIDAgXS5sZW5ndGggPiAzICkge1xuXHRcdHNbIDAgXSA9IHNbIDAgXS5yZXBsYWNlKCAvXFxCKD89KD86XFxkezN9KSsoPyFcXGQpKS9nLCBzZXAgKTtcblx0fVxuXG5cdGlmICggKCBzWyAxIF0gfHwgJycgKS5sZW5ndGggPCBwcmVjICkge1xuXHRcdHNbIDEgXSA9IHNbIDEgXSB8fCAnJztcblx0XHRzWyAxIF0gKz0gbmV3IEFycmF5KCBwcmVjIC0gc1sgMSBdLmxlbmd0aCArIDEgKS5qb2luKCAnMCcgKTtcblx0fVxuXG5cdHJldHVybiBzLmpvaW4oIGRlYyApO1xufVxuXG5mdW5jdGlvbiBjbGVhblVybCggdXJsICkge1xuXHRyZXR1cm4gdXJsLnJlcGxhY2UoIC8lMkMvZywgJywnICk7XG59XG5cbmZ1bmN0aW9uIGdldE9yZGVyQnlVcmwoIHVybCApIHtcblx0Y29uc3QgcGFnZWQgPSBwYXJzZUludCggdXJsLnJlcGxhY2UoIC8uK1xcL3BhZ2VcXC8oXFxkKykrLywgJyQxJyApICk7XG5cblx0aWYgKCBwYWdlZCApIHtcblx0XHR1cmwgPSB1cmwucmVwbGFjZSggL3BhZ2VcXC8oXFxkKylcXC8vLCAnJyApO1xuXHR9XG5cblx0cmV0dXJuIGNsZWFuVXJsKCB1cmwgKTtcbn1cbiJdfQ==
