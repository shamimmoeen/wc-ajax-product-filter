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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJ1dGlscy5qcyJdLCJuYW1lcyI6WyJ3Y2FwZl9wYXJhbXMiLCIkIiwid2luZG93IiwiX2RlbGF5IiwicGFyc2VJbnQiLCJmaWx0ZXJfaW5wdXRfZGVsYXkiLCJkZWxheSIsImlzUHJvIiwid2NhcGZfcHJvIiwiJGJvZHkiLCIkZG9jdW1lbnQiLCJkb2N1bWVudCIsImluc3RhbmNlSWRzIiwiZWFjaCIsImlkIiwiZGF0YSIsInB1c2giLCJmb2N1c2VkRWxtIiwidGlwcHlJbnN0YW5jZXMiLCJXQ0FQRiIsImhhbmRsZUZpbHRlckFjY29yZGlvbiIsInRvZ2dsZUFjY29yZGlvbiIsIiRlbCIsInByZXNzZWQiLCJhdHRyIiwiJGZpbHRlcklubmVyIiwiY2xvc2VzdCIsImNoaWxkcmVuIiwiZW5hYmxlX2FuaW1hdGlvbl9mb3JfZmlsdGVyX2FjY29yZGlvbiIsInNsaWRlVG9nZ2xlIiwiZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQiLCJmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmciLCJ0b2dnbGUiLCJvbiIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCIkdHJpZ2dlciIsImZpbmQiLCJoYW5kbGVIaWVyYXJjaHlUb2dnbGUiLCIkY2hpbGQiLCJlbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uIiwiaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQiLCJoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmciLCJrZXkiLCJwcmV2ZW50RGVmYXVsdCIsImhhbmRsZVNvZnRMaW1pdCIsInRvZ2dsZUZpbHRlck9wdGlvbnMiLCIkbGlzdFdyYXBwZXIiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiaGFuZGxlU2VhcmNoRmlsdGVyT3B0aW9ucyIsIiR0aGF0IiwiJGlubmVyIiwiJGZpbHRlciIsInNvZnRMaW1pdEVuYWJsZWQiLCJoYXNDbGFzcyIsInNvZnRMaW1pdFRvZ2dsZSIsIm5vUmVzdWx0cyIsInZpc2libGVPcHRpb25zIiwia2V5d29yZCIsInZhbCIsImxlbmd0aCIsImluZGV4IiwiJGZpbHRlckl0ZW0iLCJyZW1vdmVBdHRyIiwidGV4dCIsImhpZGUiLCJsYWJlbCIsInRvU3RyaW5nIiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsInNob3ciLCJ1cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0IiwiJHJlc3BvbnNlIiwiJGNvbnRhaW5lciIsInNob3BfbG9vcF9jb250YWluZXIiLCJzZWxlY3RvciIsIm5ld0NvdW50IiwiaHRtbCIsImhhcyIsInNjcm9sbFRvIiwic2Nyb2xsX3dpbmRvdyIsInNjcm9sbEZvciIsInNjcm9sbF93aW5kb3dfZm9yIiwiaXNNb2JpbGUiLCJpc19tb2JpbGUiLCJwcm9jZWVkIiwiYWRqdXN0aW5nT2Zmc2V0Iiwib2Zmc2V0Iiwic2Nyb2xsX3RvX3RvcF9vZmZzZXQiLCJjb250YWluZXIiLCJub3RfZm91bmRfY29udGFpbmVyIiwic2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudCIsInRvcCIsInN0b3AiLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwic2Nyb2xsX3RvX3RvcF9zcGVlZCIsInNjcm9sbF90b190b3BfZWFzaW5nIiwiYmVmb3JlRmV0Y2hpbmdQcm9kdWN0cyIsInRyaWdnZXJlZEJ5IiwiYWN0aXZlRWxlbWVudCIsInNjcm9sbF93aW5kb3dfd2hlbiIsInRyaWdnZXIiLCJkZXN0cm95VGlwcHlJbnN0YW5jZXMiLCJ1c2VfdGlwcHlqcyIsImZvckVhY2giLCJpbnN0YW5jZSIsImRlc3Ryb3kiLCJiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzIiwiYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzIiwicmVzdG9yZV9mb2N1c19hZnRlcl9maWx0ZXJpbmciLCJib2R5IiwiZm9jdXMiLCJpbml0IiwiY3VzdG9tX3NjcmlwdHMiLCJldmFsIiwiZmlsdGVyUHJvZHVjdHMiLCJhamF4IiwidXJsIiwibG9jYXRpb24iLCJocmVmIiwic3VjY2VzcyIsInJlc3BvbnNlIiwidXBkYXRlX2RvY3VtZW50X3RpdGxlIiwidGl0bGUiLCJmaWx0ZXIiLCJpbnN0YW5jZUlkIiwiJGluc3RhbmNlIiwiX2luc3RhbmNlIiwicHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSIsInRvZ2dsZVNlbGVjdG9yIiwicHJlc2VydmVfc29mdF9saW1pdF9zdGF0ZSIsIl9odG1sIiwiJHNob3BMb29wQ29udGFpbmVyIiwiJG5vdEZvdW5kQ29udGFpbmVyIiwicmVxdWVzdEZpbHRlciIsImhvc3RuYW1lIiwicmVwbGFjZSIsImRpc2FibGVfYWpheCIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJ3Y2FwZiIsImhhbmRsZU51bWJlcklucHV0RmlsdGVycyIsInJhbmdlTnVtYmVyU2VsZWN0b3JzIiwiJGl0ZW0iLCIkcmFuZ2VOdW1iZXIiLCJmb3JtYXROdW1iZXJzIiwicmFuZ2VNaW5WYWx1ZSIsInBhcnNlRmxvYXQiLCJyYW5nZU1heFZhbHVlIiwib2xkTWluVmFsdWUiLCJvbGRNYXhWYWx1ZSIsImRlY2ltYWxQbGFjZXMiLCJ0aG91c2FuZFNlcGFyYXRvciIsImRlY2ltYWxTZXBhcmF0b3IiLCJjbGVhclRpbWVvdXQiLCJnZXRWYWx1ZSIsImZsb2F0VmFsdWUiLCJudW1iZXJGb3JtYXQiLCJzZXRUaW1lb3V0IiwicmVtb3ZlRGF0YSIsIm1pblZhbHVlIiwibWF4VmFsdWUiLCJpc05hTiIsImhhbmRsZURhdGVJbnB1dEZpbHRlcnMiLCJpc1JhbmdlIiwiZmlsdGVyVXJsIiwiZnJvbSIsInRvIiwiaGFuZGxlTGlzdEZpbHRlcnMiLCJuYXRpdmVJbnB1dHMiLCJ0b2dnbGVDbGFzcyIsImN1c3RvbVJhZGlvU2VsZWN0b3IiLCJub3QiLCJwcm9wIiwiaGFuZGxlRHJvcGRvd25GaWx0ZXJzIiwiJHNlbGVjdCIsInZhbHVlcyIsImZpbHRlclVSTCIsImNsZWFyRmlsdGVyVVJMIiwiaGFuZGxlUGFnaW5hdGlvbiIsImVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4IiwicGFnaW5hdGlvbl9jb250YWluZXIiLCJfc2VsZWN0b3JzIiwic3BsaXQiLCJzZWxlY3RvcnMiLCJqb2luIiwiaGFuZGxlRGVmYXVsdE9yZGVyYnkiLCJzb3J0aW5nX2NvbnRyb2wiLCJvcmRlciIsIlVSTCIsInNlYXJjaFBhcmFtcyIsInNldCIsImdldE9yZGVyQnlVcmwiLCJoYW5kbGVDbGVhckZpbHRlciIsImhhbmRsZUZpbHRlclRvb2x0aXAiLCJ0aXBweSIsInBsYWNlbWVudCIsImNvbnRlbnQiLCJyZWZlcmVuY2UiLCJnZXRBdHRyaWJ1dGUiLCJhbGxvd0hUTUwiLCJpbml0Q29tYm9ib3giLCJqUXVlcnkiLCJjaG9zZW5XQ0FQRiIsInRlbXBsYXRlUmVzdWx0IiwidGVtcGxhdGVTZWxlY3Rpb24iLCJjb3VudCIsImRlZmF1bHRzIiwiaW5oZXJpdF9zZWxlY3RfY2xhc3NlcyIsImluaGVyaXRfb3B0aW9uX2NsYXNzZXMiLCJub19yZXN1bHRzX3RleHQiLCJjb21ib2JveF9ub19yZXN1bHRzX3RleHQiLCJvcHRpb25zX25vbmVfdGV4dCIsImNvbWJvYm94X29wdGlvbnNfbm9uZV90ZXh0Iiwic2VhcmNoX2NvbnRhaW5zIiwic2VhcmNoX2luX3ZhbHVlcyIsImlzX3J0bCIsIiR0aGlzIiwib3B0aW9ucyIsImNvbWJvYm94X2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucyIsImF0dGFjaF9jb21ib2JveF9vbl9zb3J0aW5nIiwiZGlzYWJsZVNlYXJjaCIsInNlYXJjaF9ib3hfaW5fZGVmYXVsdF9vcmRlcmJ5IiwiaW5pdFJhbmdlU2xpZGVyIiwibm9VaVNsaWRlciIsIiRzbGlkZXIiLCJzbGlkZXJJZCIsImRpc3BsYXlWYWx1ZXNBcyIsInN0ZXAiLCIkbWluVmFsdWUiLCIkbWF4VmFsdWUiLCJzbGlkZXIiLCJnZXRFbGVtZW50QnlJZCIsImNyZWF0ZSIsInN0YXJ0IiwiY29ubmVjdCIsImNzc1ByZWZpeCIsInJhbmdlIiwiZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciIsIl9taW5WYWx1ZSIsIl9tYXhWYWx1ZSIsIiRpbnB1dCIsImdldCIsImluaXREYXRlcGlja2VyIiwiZGF0ZXBpY2tlciIsIiR3Y2FwZkRhdGVGaWx0ZXIiLCJmb3JtYXQiLCJ5ZWFyRHJvcGRvd24iLCJtb250aERyb3Bkb3duIiwiJGZyb20iLCIkdG8iLCJkYXRlRm9ybWF0IiwiY2hhbmdlWWVhciIsImNoYW5nZU1vbnRoIiwiaW5pdEZpbHRlck9wdGlvblRvb2x0aXAiLCJ0b29sdGlwUG9zaXRpb25zIiwidG9vbHRpcFBvc2l0aW9uIiwiaWRlbnRpZmllciIsImluc3RhbmNlcyIsImNvbmNhdCIsImluaXRQb3BTdGF0ZSIsInJlbG9hZF9vbl9iYWNrIiwiZm91bmRfd2NhcGYiLCJyZXBsYWNlU3RhdGUiLCJhZGRFdmVudExpc3RlbmVyIiwic3RhdGUiLCJoYXNPd25Qcm9wZXJ0eSIsIm51bWJlciIsImRlY2ltYWxzIiwiZGVjX3BvaW50IiwidGhvdXNhbmRzX3NlcCIsIm4iLCJpc0Zpbml0ZSIsInByZWMiLCJNYXRoIiwiYWJzIiwic2VwIiwiZGVjIiwicyIsInRvRml4ZWRGaXgiLCJrIiwicG93Iiwicm91bmQiLCJBcnJheSIsImNsZWFuVXJsIiwicGFnZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLFlBQVksR0FBR0EsWUFBWSxJQUFJO0FBQ3BDLFlBQVUsRUFEMEI7QUFFcEMsd0JBQXNCLEVBRmM7QUFHcEMsdUNBQXFDLEVBSEQ7QUFJcEMsOEJBQTRCLEVBSlE7QUFLcEMsZ0NBQThCLEVBTE07QUFNcEMsbUNBQWlDLEVBTkc7QUFPcEMsd0NBQXNDLEVBUEY7QUFRcEMsK0JBQTZCLEVBUk87QUFTcEMsMkNBQXlDLEVBVEw7QUFVcEMsc0NBQW9DLEVBVkE7QUFXcEMsdUNBQXFDLEVBWEQ7QUFZcEMsOENBQTRDLEVBWlI7QUFhcEMseUNBQXVDLEVBYkg7QUFjcEMsMENBQXdDLEVBZEo7QUFlcEMsbUNBQWlDLEVBZkc7QUFnQnBDLHlCQUF1QixFQWhC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dGVudCI6WyIvKipcbiAqIFRoZSBtYWluIGpzIGZpbGUuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvcHVibGljL3NyYy9qc1xuICogQGF1dGhvciAgICAgd3B0b29scy5pb1xuICovXG5cbmNvbnN0IHdjYXBmX3BhcmFtcyA9IHdjYXBmX3BhcmFtcyB8fCB7XG5cdCdpc19ydGwnOiAnJyxcblx0J2ZpbHRlcl9pbnB1dF9kZWxheSc6ICcnLFxuXHQnY29tYm9ib3hfZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJzogJycsXG5cdCdjb21ib2JveF9ub19yZXN1bHRzX3RleHQnOiAnJyxcblx0J2NvbWJvYm94X29wdGlvbnNfbm9uZV90ZXh0JzogJycsXG5cdCdzZWFyY2hfYm94X2luX2RlZmF1bHRfb3JkZXJieSc6ICcnLFxuXHQncHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSc6ICcnLFxuXHQncHJlc2VydmVfc29mdF9saW1pdF9zdGF0ZSc6ICcnLFxuXHQnZW5hYmxlX2FuaW1hdGlvbl9mb3JfZmlsdGVyX2FjY29yZGlvbic6ICcnLFxuXHQnZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQnOiAnJyxcblx0J2ZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyc6ICcnLFxuXHQnZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbic6ICcnLFxuXHQnaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQnOiAnJyxcblx0J2hpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyc6ICcnLFxuXHQncmVzdG9yZV9mb2N1c19hZnRlcl9maWx0ZXJpbmcnOiAnJyxcblx0J3Njcm9sbF90b190b3Bfc3BlZWQnOiAnJyxcblx0J3Njcm9sbF90b190b3BfZWFzaW5nJzogJycsXG5cdCdpc19tb2JpbGUnOiAnJyxcblx0J3JlbG9hZF9vbl9iYWNrJzogJycsXG5cdCdmb3VuZF93Y2FwZic6ICcnLFxuXHQnd2NhcGZfcHJvJzogJycsXG5cdCd1cGRhdGVfZG9jdW1lbnRfdGl0bGUnOiAnJyxcblx0J3VzZV90aXBweWpzJzogJycsXG5cdCdzaG9wX2xvb3BfY29udGFpbmVyJzogJycsXG5cdCdub3RfZm91bmRfY29udGFpbmVyJzogJycsXG5cdCdwYWdpbmF0aW9uX2NvbnRhaW5lcic6ICcnLFxuXHQnZGlzYWJsZV9hamF4JzogJycsXG5cdCdlbmFibGVfcGFnaW5hdGlvbl92aWFfYWpheCc6ICcnLFxuXHQnc29ydGluZ19jb250cm9sJzogJycsXG5cdCdhdHRhY2hfY29tYm9ib3hfb25fc29ydGluZyc6ICcnLFxuXHQnbG9hZGluZ19hbmltYXRpb24nOiAnJyxcblx0J3Njcm9sbF93aW5kb3cnOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfZm9yJzogJycsXG5cdCdzY3JvbGxfd2luZG93X3doZW4nOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfY3VzdG9tX2VsZW1lbnQnOiAnJyxcblx0J3Njcm9sbF9vbic6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9vZmZzZXQnOiAnJyxcblx0J2Rpc2FibGVfc2Nyb2xsX2FuaW1hdGlvbic6ICcnLFxuXHQnbW9yZV9zZWxlY3RvcnMnOiAnJyxcblx0J2N1c3RvbV9zY3JpcHRzJzogJycsXG59O1xuXG4oIGZ1bmN0aW9uKCAkLCB3aW5kb3cgKSB7XG5cblx0Y29uc3QgX2RlbGF5ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5maWx0ZXJfaW5wdXRfZGVsYXkgKTtcblx0Y29uc3QgZGVsYXkgID0gX2RlbGF5ID49IDAgPyBfZGVsYXkgOiAzMDA7XG5cblx0Y29uc3QgaXNQcm8gPSB3Y2FwZl9wYXJhbXMud2NhcGZfcHJvO1xuXG5cdGNvbnN0ICRib2R5ICAgICA9ICQoICdib2R5JyApO1xuXHRjb25zdCAkZG9jdW1lbnQgPSAkKCBkb2N1bWVudCApO1xuXG5cdGNvbnN0IGluc3RhbmNlSWRzID0gW107XG5cblx0JCggJy53Y2FwZi1maWx0ZXInICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgaWQgPSAkKCB0aGlzICkuZGF0YSggJ2lkJyApO1xuXG5cdFx0aWYgKCAhIGlkICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGluc3RhbmNlSWRzLnB1c2goIGlkICk7XG5cdH0gKTtcblxuXHRsZXQgZm9jdXNlZEVsbTtcblxuXHR3aW5kb3cudGlwcHlJbnN0YW5jZXMgPSBbXTtcblxuXHR3aW5kb3cuV0NBUEYgPSB3aW5kb3cuV0NBUEYgfHwge307XG5cblx0d2luZG93LldDQVBGID0ge1xuXHRcdGhhbmRsZUZpbHRlckFjY29yZGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCB0b2dnbGVBY2NvcmRpb24gPSAoICRlbCApID0+IHtcblx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBhY2NvcmRpb24gaXMgb3BlbmVkXG5cdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtZXhwYW5kZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHQvLyBDaGFuZ2UgYXJpYS1leHBhbmRlZCB0byB0aGUgb3Bwb3NpdGUgc3RhdGVcblx0XHRcdFx0JGVsLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgISBwcmVzc2VkICk7XG5cblx0XHRcdFx0Y29uc3QgJGZpbHRlcklubmVyID0gJGVsLmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyJyApLmNoaWxkcmVuKCAnLndjYXBmLWZpbHRlci1pbm5lcicgKTtcblxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfYW5pbWF0aW9uX2Zvcl9maWx0ZXJfYWNjb3JkaW9uICkge1xuXHRcdFx0XHRcdCRmaWx0ZXJJbm5lci5zbGlkZVRvZ2dsZShcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5maWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCxcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5maWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmdcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRmaWx0ZXJJbm5lci50b2dnbGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtZmlsdGVyLWFjY29yZGlvbi10cmlnZ2VyJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkKCB0aGlzICkgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtZmlsdGVyLXRpdGxlLmhhcy1hY2NvcmRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRyaWdnZXIgPSAkKCB0aGlzICkuZmluZCggJy53Y2FwZi1maWx0ZXItYWNjb3JkaW9uLXRyaWdnZXInICk7XG5cblx0XHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkdHJpZ2dlciApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlSGllcmFyY2h5VG9nZ2xlOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHRvZ2dsZUFjY29yZGlvbiA9ICggJGVsICkgPT4ge1xuXHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGJ1dHRvbiBpcyBwcmVzc2VkXG5cdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdC8vIENoYW5nZSBhcmlhLXByZXNzZWQgdG8gdGhlIG9wcG9zaXRlIHN0YXRlXG5cdFx0XHRcdCRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJywgISBwcmVzc2VkICk7XG5cblx0XHRcdFx0Y29uc3QgJGNoaWxkID0gJGVsLmNsb3Nlc3QoICdsaScgKS5jaGlsZHJlbiggJ3VsJyApO1xuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24gKSB7XG5cdFx0XHRcdFx0JGNoaWxkLnNsaWRlVG9nZ2xlKFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkLFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZ1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JGNoaWxkLnRvZ2dsZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHQkYm9keVxuXHRcdFx0XHQub24oICdjbGljaycsICcud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdFx0XHR9IClcblx0XHRcdFx0Lm9uKCAna2V5ZG93bicsICcud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRpZiAoIGUua2V5ID09PSAnICcgfHwgZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICdTcGFjZWJhcicgKSB7XG5cdFx0XHRcdFx0XHQvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvbiB0byBzdG9wIHNjcm9sbGluZyB3aGVuIHNwYWNlIGlzIHByZXNzZWRcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkKCB0aGlzICkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZVNvZnRMaW1pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCB0b2dnbGVGaWx0ZXJPcHRpb25zID0gKCAkZWwgKSA9PiB7XG5cdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYnV0dG9uIGlzIHByZXNzZWRcblx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0Ly8gQ2hhbmdlIGFyaWEtcHJlc3NlZCB0byB0aGUgb3Bwb3NpdGUgc3RhdGVcblx0XHRcdFx0JGVsLmF0dHIoICdhcmlhLXByZXNzZWQnLCAhIHByZXNzZWQgKTtcblxuXHRcdFx0XHRjb25zdCAkbGlzdFdyYXBwZXIgPSAkZWwuY2xvc2VzdCggJy53Y2FwZi1saXN0LXdyYXBwZXInICk7XG5cblx0XHRcdFx0aWYgKCBwcmVzc2VkICkge1xuXHRcdFx0XHRcdCRsaXN0V3JhcHBlci5yZW1vdmVDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JGxpc3RXcmFwcGVyLmFkZENsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0JGJvZHlcblx0XHRcdFx0Lm9uKCAnY2xpY2snLCAnLndjYXBmLXNvZnQtbGltaXQtdHJpZ2dlcicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRvZ2dsZUZpbHRlck9wdGlvbnMoICQoIHRoaXMgKSApO1xuXHRcdFx0XHR9IClcblx0XHRcdFx0Lm9uKCAna2V5ZG93bicsICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0aWYgKCBlLmtleSA9PT0gJyAnIHx8IGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnU3BhY2ViYXInICkge1xuXHRcdFx0XHRcdFx0Ly8gUHJldmVudCB0aGUgZGVmYXVsdCBhY3Rpb24gdG8gc3RvcCBzY3JvbGxpbmcgd2hlbiBzcGFjZSBpcyBwcmVzc2VkXG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRcdHRvZ2dsZUZpbHRlck9wdGlvbnMoICQoIHRoaXMgKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlU2VhcmNoRmlsdGVyT3B0aW9uczogZnVuY3Rpb24oKSB7XG5cdFx0XHQkYm9keS5vbiggJ2lucHV0JywgJy53Y2FwZi1zZWFyY2gtYm94IGlucHV0W3R5cGU9XCJ0ZXh0XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0aGF0ICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0ICRpbm5lciAgPSAkdGhhdC5jbG9zZXN0KCAnLndjYXBmLWZpbHRlci1pbm5lcicgKTtcblx0XHRcdFx0Y29uc3QgJGZpbHRlciA9ICRpbm5lci5jbG9zZXN0KCAnLndjYXBmLWZpbHRlcicgKTtcblxuXHRcdFx0XHRjb25zdCBzb2Z0TGltaXRFbmFibGVkID0gJGZpbHRlci5oYXNDbGFzcyggJ2hhcy1zb2Z0LWxpbWl0JyApO1xuXHRcdFx0XHRjb25zdCBzb2Z0TGltaXRUb2dnbGUgID0gJGZpbHRlci5maW5kKCAnLndjYXBmLXNvZnQtbGltaXQtd3JhcHBlcicgKTtcblx0XHRcdFx0Y29uc3Qgbm9SZXN1bHRzICAgICAgICA9ICRmaWx0ZXIuZmluZCggJy53Y2FwZi1uby1yZXN1bHRzLXRleHQnICk7XG5cdFx0XHRcdGNvbnN0IHZpc2libGVPcHRpb25zICAgPSBwYXJzZUludCggJGZpbHRlci5hdHRyKCAnZGF0YS12aXNpYmxlLW9wdGlvbnMnICkgKTtcblxuXHRcdFx0XHRjb25zdCBrZXl3b3JkID0gJHRoYXQudmFsKCk7XG5cblx0XHRcdFx0aWYgKCAhIGtleXdvcmQubGVuZ3RoICkge1xuXHRcdFx0XHRcdGxldCBpbmRleCA9IDA7XG5cdFx0XHRcdFx0JGZpbHRlci5yZW1vdmVDbGFzcyggJ3NlYXJjaC1hY3RpdmUnICk7XG5cblx0XHRcdFx0XHQkLmVhY2goICRpbm5lci5maW5kKCAnLndjYXBmLWZpbHRlci1vcHRpb25zID4gbGknICksIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0aW5kZXgrKztcblxuXHRcdFx0XHRcdFx0Y29uc3QgJGZpbHRlckl0ZW0gPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5yZW1vdmVDbGFzcyggJ2tleXdvcmQtbWF0Y2hlZCcgKTtcblxuXHRcdFx0XHRcdFx0aWYgKCBzb2Z0TGltaXRFbmFibGVkICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIGluZGV4ID4gdmlzaWJsZU9wdGlvbnMgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0uYWRkQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5yZW1vdmVDbGFzcyggJ3djYXBmLWZpbHRlci1vcHRpb24taGlkZGVuJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdFx0aWYgKCBzb2Z0TGltaXRFbmFibGVkICkge1xuXHRcdFx0XHRcdFx0c29mdExpbWl0VG9nZ2xlLnJlbW92ZUF0dHIoICdzdHlsZScgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRub1Jlc3VsdHMuY2hpbGRyZW4oICdzcGFuJyApLnRleHQoICcnICk7XG5cdFx0XHRcdFx0bm9SZXN1bHRzLmhpZGUoKTtcblxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCBpbmRleCA9IDA7XG5cdFx0XHRcdCRmaWx0ZXIuYWRkQ2xhc3MoICdzZWFyY2gtYWN0aXZlJyApO1xuXG5cdFx0XHRcdCQuZWFjaCggJGlubmVyLmZpbmQoICcud2NhcGYtZmlsdGVyLW9wdGlvbnMgPiBsaScgKSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGZpbHRlckl0ZW0gPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0Y29uc3QgbGFiZWwgICAgICAgPSAkZmlsdGVySXRlbS5maW5kKCAnLndjYXBmLWZpbHRlci1pdGVtLWxhYmVsJyApLmRhdGEoICdsYWJlbCcgKTtcblxuXHRcdFx0XHRcdGlmICggbGFiZWwudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCBrZXl3b3JkLnRvTG93ZXJDYXNlKCkgKSApIHtcblx0XHRcdFx0XHRcdGluZGV4Kys7XG5cblx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLmFkZENsYXNzKCAna2V5d29yZC1tYXRjaGVkJyApO1xuXG5cdFx0XHRcdFx0XHRpZiAoIHNvZnRMaW1pdEVuYWJsZWQgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggaW5kZXggPiB2aXNpYmxlT3B0aW9ucyApIHtcblx0XHRcdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5hZGRDbGFzcyggJ3djYXBmLWZpbHRlci1vcHRpb24taGlkZGVuJyApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLnJlbW92ZUNsYXNzKCAnd2NhcGYtZmlsdGVyLW9wdGlvbi1oaWRkZW4nICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICdrZXl3b3JkLW1hdGNoZWQnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0aWYgKCBzb2Z0TGltaXRFbmFibGVkICkge1xuXHRcdFx0XHRcdGlmICggaW5kZXggPD0gdmlzaWJsZU9wdGlvbnMgKSB7XG5cdFx0XHRcdFx0XHRzb2Z0TGltaXRUb2dnbGUuaGlkZSgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzb2Z0TGltaXRUb2dnbGUuc2hvdygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggMCA9PT0gaW5kZXggKSB7XG5cdFx0XHRcdFx0bm9SZXN1bHRzLmNoaWxkcmVuKCAnc3BhbicgKS50ZXh0KCBrZXl3b3JkICk7XG5cdFx0XHRcdFx0bm9SZXN1bHRzLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRub1Jlc3VsdHMuY2hpbGRyZW4oICdzcGFuJyApLnRleHQoICcnICk7XG5cdFx0XHRcdFx0bm9SZXN1bHRzLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0dXBkYXRlUHJvZHVjdHNDb3VudFJlc3VsdDogZnVuY3Rpb24oICRyZXNwb25zZSApIHtcblx0XHRcdGNvbnN0ICRjb250YWluZXIgPSAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3IgICA9ICcud29vY29tbWVyY2UtcmVzdWx0LWNvdW50Jztcblx0XHRcdGNvbnN0IG5ld0NvdW50ICAgPSAkcmVzcG9uc2UuZmluZCggc2VsZWN0b3IgKS5odG1sKCk7XG5cblx0XHRcdCRib2R5LmZpbmQoIHNlbGVjdG9yICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRlbCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRpZiAoICEgJGNvbnRhaW5lci5oYXMoICRlbCApLmxlbmd0aCApIHtcblx0XHRcdFx0XHQkZWwuaHRtbCggbmV3Q291bnQgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0c2Nyb2xsVG86IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAnbm9uZScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHNjcm9sbEZvciA9IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X2Zvcjtcblx0XHRcdGNvbnN0IGlzTW9iaWxlICA9IHdjYXBmX3BhcmFtcy5pc19tb2JpbGU7XG5cdFx0XHRsZXQgcHJvY2VlZCAgICAgPSBmYWxzZTtcblxuXHRcdFx0aWYgKCAnbW9iaWxlJyA9PT0gc2Nyb2xsRm9yICYmIGlzTW9iaWxlICkge1xuXHRcdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSBpZiAoICdkZXNrdG9wJyA9PT0gc2Nyb2xsRm9yICYmICEgaXNNb2JpbGUgKSB7XG5cdFx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmICggJ2JvdGgnID09PSBzY3JvbGxGb3IgKSB7XG5cdFx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgcHJvY2VlZCApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgYWRqdXN0aW5nT2Zmc2V0ID0gMCwgb2Zmc2V0ID0gMDtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKSB7XG5cdFx0XHRcdGFkanVzdGluZ09mZnNldCA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGNvbnRhaW5lcjtcblxuXHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXI7XG5cdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXI7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggJ2N1c3RvbScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93ICkge1xuXHRcdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudDtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIGNvbnRhaW5lciApO1xuXG5cdFx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRvZmZzZXQgPSAkY29udGFpbmVyLm9mZnNldCgpLnRvcCAtIGFkanVzdGluZ09mZnNldDtcblxuXHRcdFx0XHRpZiAoIG9mZnNldCA8IDAgKSB7XG5cdFx0XHRcdFx0b2Zmc2V0ID0gMDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCQoICdodG1sLCBib2R5JyApLnN0b3AoKS5hbmltYXRlKFxuXHRcdFx0XHRcdHsgc2Nyb2xsVG9wOiBvZmZzZXQgfSxcblx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9zcGVlZCxcblx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9lYXNpbmdcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8vIFRoaW5ncyBhcmUgZG9uZSBiZWZvcmUgZmV0Y2hpbmcgdGhlIHByb2R1Y3RzIGxpa2Ugc2hvd2luZyB0aGUgbG9hZGluZyBpbmRpY2F0b3IuXG5cdFx0YmVmb3JlRmV0Y2hpbmdQcm9kdWN0czogZnVuY3Rpb24oIHRyaWdnZXJlZEJ5ICkge1xuXHRcdFx0Ly8gVHJhY2sgdGhlIGN1cnJlbnQgZWxlbWVudCBmb2N1cy5cblx0XHRcdGZvY3VzZWRFbG0gPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXG5cdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLWxvYWRlcicgKS5hZGRDbGFzcyggJ2lzLWFjdGl2ZScgKTtcblxuXHRcdFx0aWYgKCAhIGlzUHJvICYmICdpbW1lZGlhdGVseScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X3doZW4gKSB7XG5cdFx0XHRcdFdDQVBGLnNjcm9sbFRvKCk7XG5cdFx0XHR9XG5cblx0XHRcdCRkb2N1bWVudC50cmlnZ2VyKCAnd2NhcGZfYmVmb3JlX2ZldGNoaW5nX3Byb2R1Y3RzJywgWyB0cmlnZ2VyZWRCeSBdICk7XG5cdFx0fSxcblx0XHRkZXN0cm95VGlwcHlJbnN0YW5jZXM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMudXNlX3RpcHB5anMgKSB7XG5cdFx0XHRcdC8vIEBzb3VyY2UgaHR0cHM6Ly9naXRodWIuY29tL2F0b21pa3MvdGlwcHlqcy9pc3N1ZXMvNDczXG5cdFx0XHRcdHRpcHB5SW5zdGFuY2VzLmZvckVhY2goIGluc3RhbmNlID0+IHtcblx0XHRcdFx0XHRpbnN0YW5jZS5kZXN0cm95KCk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdFx0dGlwcHlJbnN0YW5jZXMubGVuZ3RoID0gMDsgLy8gY2xlYXIgaXRcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8vIFRoaW5ncyBhcmUgZG9uZSBiZWZvcmUgdXBkYXRpbmcgdGhlIHByb2R1Y3RzIGxpa2UgaGlkaW5nIHRoZSBsb2FkaW5nIGluZGljYXRvci5cblx0XHRiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzOiBmdW5jdGlvbiggJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSApIHtcblx0XHRcdCRib2R5LmZpbmQoICcud2NhcGYtbG9hZGVyJyApLnJlbW92ZUNsYXNzKCAnaXMtYWN0aXZlJyApO1xuXG5cdFx0XHQvLyBNYXliZSBnb29kIGZvciBwZXJmb3JtYW5jZS5cblx0XHRcdFdDQVBGLmRlc3Ryb3lUaXBweUluc3RhbmNlcygpO1xuXG5cdFx0XHQkZG9jdW1lbnQudHJpZ2dlciggJ3djYXBmX2JlZm9yZV91cGRhdGluZ19wcm9kdWN0cycsIFsgJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSBdICk7XG5cdFx0fSxcblx0XHRhZnRlclVwZGF0aW5nUHJvZHVjdHM6IGZ1bmN0aW9uKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICkge1xuXHRcdFx0V0NBUEYudXBkYXRlUHJvZHVjdHNDb3VudFJlc3VsdCggJHJlc3BvbnNlICk7XG5cblx0XHRcdC8vIFJlc3RvcmUgdGhlIGZvY3VzIChNYXliZSByZXN0b3JpbmcgdGhlIGZvY3VzIGluIG1vYmlsZSBkZXZpY2UgaXNuJ3QgZ29vZCkuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5yZXN0b3JlX2ZvY3VzX2FmdGVyX2ZpbHRlcmluZyAmJiAhIHdjYXBmX3BhcmFtcy5pc19tb2JpbGUgKSB7XG5cdFx0XHRcdGlmICggZG9jdW1lbnQuYm9keSAhPT0gZm9jdXNlZEVsbSApIHtcblx0XHRcdFx0XHRpZiAoIGZvY3VzZWRFbG0uaWQgKSB7XG5cdFx0XHRcdFx0XHQkKCBgIyR7IGZvY3VzZWRFbG0uaWQgfWAgKS5mb2N1cygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZWluaXRpYWxpemUgd2NhcGYuXG5cdFx0XHRXQ0FQRi5pbml0KCk7XG5cblx0XHRcdGlmICggISBpc1BybyAmJiAnYWZ0ZXInID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd193aGVuICkge1xuXHRcdFx0XHRXQ0FQRi5zY3JvbGxUbygpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUcmlnZ2VyIGV2ZW50cy5cblx0XHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggJ3JlYWR5JyApO1xuXHRcdFx0JCggd2luZG93ICkudHJpZ2dlciggJ3Njcm9sbCcgKTtcblx0XHRcdCQoIHdpbmRvdyApLnRyaWdnZXIoICdyZXNpemUnICk7XG5cblx0XHRcdC8vIEEzIExhenkgTG9hZCBzdXBwb3J0LlxuXHRcdFx0JCggd2luZG93ICkudHJpZ2dlciggJ2xhenlzaG93JyApO1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5jdXN0b21fc2NyaXB0cyApIHtcblx0XHRcdFx0ZXZhbCggd2NhcGZfcGFyYW1zLmN1c3RvbV9zY3JpcHRzICk7XG5cdFx0XHR9XG5cblx0XHRcdCRkb2N1bWVudC50cmlnZ2VyKCAnd2NhcGZfYWZ0ZXJfdXBkYXRpbmdfcHJvZHVjdHMnLCBbICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgXSApO1xuXHRcdH0sXG5cdFx0ZmlsdGVyUHJvZHVjdHM6IGZ1bmN0aW9uKCB0cmlnZ2VyZWRCeSA9ICdmaWx0ZXInICkge1xuXHRcdFx0V0NBUEYuYmVmb3JlRmV0Y2hpbmdQcm9kdWN0cyggdHJpZ2dlcmVkQnkgKTtcblxuXHRcdFx0JC5hamF4KCB7XG5cdFx0XHRcdHVybDogd2luZG93LmxvY2F0aW9uLmhyZWYsXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdFx0XHRjb25zdCAkcmVzcG9uc2UgPSAkKCByZXNwb25zZSApO1xuXG5cdFx0XHRcdFx0V0NBUEYuYmVmb3JlVXBkYXRpbmdQcm9kdWN0cyggJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSApO1xuXG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogVXBkYXRlIGRvY3VtZW50IHRpdGxlLlxuXHRcdFx0XHRcdCAqXG5cdFx0XHRcdFx0ICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNzU5OTU2MlxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnVwZGF0ZV9kb2N1bWVudF90aXRsZSApIHtcblx0XHRcdFx0XHRcdGRvY3VtZW50LnRpdGxlID0gJHJlc3BvbnNlLmZpbHRlciggJ3RpdGxlJyApLnRleHQoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBVcGRhdGUgdGhlIGluc3RhbmNlcy5cblx0XHRcdFx0XHRmb3IgKCBjb25zdCBpZCBvZiBpbnN0YW5jZUlkcyApIHtcblx0XHRcdFx0XHRcdGNvbnN0IGluc3RhbmNlSWQgPSAnW2RhdGEtaWQ9XCInICsgaWQgKyAnXCJdJztcblx0XHRcdFx0XHRcdGNvbnN0ICRpbnN0YW5jZSAgPSAkKCBpbnN0YW5jZUlkICk7XG5cdFx0XHRcdFx0XHRjb25zdCAkaW5uZXIgICAgID0gJGluc3RhbmNlLmZpbmQoICcud2NhcGYtZmlsdGVyLWlubmVyJyApO1xuXHRcdFx0XHRcdFx0Y29uc3QgX2luc3RhbmNlICA9ICRyZXNwb25zZS5maW5kKCBpbnN0YW5jZUlkICk7XG5cblx0XHRcdFx0XHRcdC8vIFByZXNlcnZlIGhpZXJhcmNoeSBhY2NvcmRpb24gc3RhdGUuXG5cdFx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5wcmVzZXJ2ZV9oaWVyYXJjaHlfYWNjb3JkaW9uX3N0YXRlICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRpbnN0YW5jZS5oYXNDbGFzcyggJ2hhcy1oaWVyYXJjaHktYWNjb3JkaW9uJyApICkge1xuXHRcdFx0XHRcdFx0XHRcdCRpbnN0YW5jZS5maW5kKCAnLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgJGVsID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgaWQgID0gJGVsLmRhdGEoICdpZCcgKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgdG9nZ2xlU2VsZWN0b3IgPSBgLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlW2RhdGEtaWQ9XCIkeyBpZCB9XCJdYDtcblxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBhY2NvcmRpb24gaXMgb3BlbmVkXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLXByZXNzZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCBwcmVzc2VkICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5hdHRyKCAnYXJpYS1wcmVzc2VkJywgJ3RydWUnICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCB0b2dnbGVTZWxlY3RvciApLmNsb3Nlc3QoICdsaScgKS5jaGlsZHJlbiggJ3VsJyApLnNob3coKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCB0b2dnbGVTZWxlY3RvciApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAnZmFsc2UnICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCB0b2dnbGVTZWxlY3RvciApLmNsb3Nlc3QoICdsaScgKS5jaGlsZHJlbiggJ3VsJyApLmhpZGUoKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gUHJlc2VydmUgc29mdCBsaW1pdCBzdGF0ZS5cblx0XHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnByZXNlcnZlX3NvZnRfbGltaXRfc3RhdGUgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJGluc3RhbmNlLmhhc0NsYXNzKCAnaGFzLXNvZnQtbGltaXQnICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgJGxpc3RXcmFwcGVyID0gJGluc3RhbmNlLmZpbmQoICcud2NhcGYtbGlzdC13cmFwcGVyJyApO1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCAkbGlzdFdyYXBwZXIuaGFzQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtbGlzdC13cmFwcGVyJyApLmFkZENsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLXNvZnQtbGltaXQtdHJpZ2dlcicgKS5hdHRyKCAnYXJpYS1wcmVzc2VkJywgJ3RydWUnICk7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKS5yZW1vdmVDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICdmYWxzZScgKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Y29uc3QgX2h0bWwgPSBfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1maWx0ZXItaW5uZXInICkuaHRtbCgpO1xuXG5cdFx0XHRcdFx0XHQvLyBGaW5hbGx5IHVwZGF0ZSB0aGUgaW5zdGFuY2UuXG5cdFx0XHRcdFx0XHQkaW5uZXIuaHRtbCggX2h0bWwgKTtcblxuXHRcdFx0XHRcdFx0JGluc3RhbmNlLnRyaWdnZXIoICd3Y2FwZi1maWx0ZXItdXBkYXRlZCcsIFsgX2luc3RhbmNlIF0gKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBVcGRhdGUgdGhlIGFjdGl2ZSBmaWx0ZXJzIGFuZCByZXNldCBmaWx0ZXJzLlxuXHRcdFx0XHRcdCRib2R5LmZpbmQoICcud2NhcGYtYWN0aXZlLWZpbHRlcnMsIC53Y2FwZi1yZXNldC1maWx0ZXJzJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0Y29uc3QgJHRoYXQgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRcdGNvbnN0IGluc3RhbmNlSWQgPSAnW2RhdGEtaWQ9XCInICsgJHRoYXQuZGF0YSggJ2lkJyApICsgJ1wiXSc7XG5cblx0XHRcdFx0XHRcdCR0aGF0Lmh0bWwoICRyZXNwb25zZS5maW5kKCBpbnN0YW5jZUlkICkuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdFx0Ly8gUmVwbGFjZSBvbGQgc2hvcCBsb29wIHdpdGggbmV3IG9uZS5cblx0XHRcdFx0XHRjb25zdCAkc2hvcExvb3BDb250YWluZXIgPSAkcmVzcG9uc2UuZmluZCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdFx0XHRjb25zdCAkbm90Rm91bmRDb250YWluZXIgPSAkcmVzcG9uc2UuZmluZCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKTtcblxuXHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgPT09IHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGlmICggJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJHNob3BMb29wQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmh0bWwoICRub3RGb3VuZENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJHNob3BMb29wQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRub3RGb3VuZENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFdDQVBGLmFmdGVyVXBkYXRpbmdQcm9kdWN0cyggJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRyZXF1ZXN0RmlsdGVyOiBmdW5jdGlvbiggdXJsLCB0cmlnZ2VyZWRCeSA9ICdmaWx0ZXInICkge1xuXHRcdFx0aWYgKCAhIHVybCApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBob3N0bmFtZSA9IGxvY2F0aW9uLmhvc3RuYW1lO1xuXG5cdFx0XHQvLyBUT0RPOiBSZW1vdmUgZnJvbSBwcm9kdWN0aW9uIGJ1aWxkLlxuXHRcdFx0aWYgKCAnbG9jYWxob3N0JyA9PT0gaG9zdG5hbWUgKSB7XG5cdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCAnaHR0cDovL3djZmlsdGVyLTIudGVzdCcsICcvL2xvY2FsaG9zdDozMDAwJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5kaXNhYmxlX2FqYXggKSB7XG5cdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJsO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHsgd2NhcGY6IHRydWUgfSwgJycsIHVybCApO1xuXG5cdFx0XHRcdFdDQVBGLmZpbHRlclByb2R1Y3RzKCB0cmlnZ2VyZWRCeSApO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aGFuZGxlTnVtYmVySW5wdXRGaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHJhbmdlTnVtYmVyU2VsZWN0b3JzID0gJy53Y2FwZi1yYW5nZS1udW1iZXIgLm1pbi12YWx1ZSwgLndjYXBmLXJhbmdlLW51bWJlciAubWF4LXZhbHVlJztcblxuXHRcdFx0JGJvZHkub24oICdpbnB1dCcsIHJhbmdlTnVtYmVyU2VsZWN0b3JzLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Y29uc3QgJHJhbmdlTnVtYmVyICAgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXJhbmdlLW51bWJlcicgKTtcblx0XHRcdFx0Y29uc3QgZm9ybWF0TnVtYmVycyAgICAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZm9ybWF0LW51bWJlcnMnICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgb2xkTWluVmFsdWUgICAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IG9sZE1heFZhbHVlICAgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsUGxhY2VzICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRcdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1kZWNpbWFsLXNlcGFyYXRvcicgKTtcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRjb25zdCBnZXRWYWx1ZSA9ICggZmxvYXRWYWx1ZSApID0+IHtcblx0XHRcdFx0XHRpZiAoIGZvcm1hdE51bWJlcnMgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVtYmVyRm9ybWF0KCBmbG9hdFZhbHVlLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBmbG9hdFZhbHVlO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpdGVtLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGxldCBtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoKSApO1xuXHRcdFx0XHRcdGxldCBtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoKSApO1xuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdFx0XHRpZiAoIGlzTmFOKCBtaW5WYWx1ZSApICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRcdFx0aWYgKCBpc05hTiggbWF4VmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSByYW5nZU1pblZhbHVlLlxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPCByYW5nZU1pblZhbHVlICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA+IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdFx0XHRpZiAoIG1heFZhbHVlID4gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSBtaW5WYWx1ZS5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID4gbWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IG1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIElmIHZhbHVlIGlzIG5vdCBjaGFuZ2VkIHRoZW4gZG9uJ3QgcHJvY2VlZC5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID09PSBvbGRNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gb2xkTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdC8vIFJlbW92ZSByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkcmFuZ2VOdW1iZXIuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdGNvbnN0IHVybCA9ICRyYW5nZU51bWJlci5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclMXMnLCBtaW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVEYXRlSW5wdXRGaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgJy53Y2FwZi1kYXRlLWlucHV0IC5kYXRlLWlucHV0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWx0ZXIgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXHRcdFx0XHRjb25zdCBpc1JhbmdlID0gJGZpbHRlci5kYXRhKCAnaXMtcmFuZ2UnICk7XG5cblx0XHRcdFx0bGV0IGZpbHRlclVybCA9ICcnO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRmaWx0ZXIuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0aWYgKCBpc1JhbmdlICkge1xuXHRcdFx0XHRcdGNvbnN0IGZyb20gPSAkZmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApLnZhbCgpO1xuXHRcdFx0XHRcdGNvbnN0IHRvICAgPSAkZmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKS52YWwoKTtcblxuXHRcdFx0XHRcdGlmICggZnJvbSAmJiB0byApIHtcblx0XHRcdFx0XHRcdGZpbHRlclVybCA9ICRmaWx0ZXIuZGF0YSggJ3VybCcgKS5yZXBsYWNlKCAnJTFzJywgZnJvbSApLnJlcGxhY2UoICclMnMnLCB0byApO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoICEgZnJvbSAmJiAhIHRvICkge1xuXHRcdFx0XHRcdFx0ZmlsdGVyVXJsID0gJGZpbHRlci5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc3QgZnJvbSA9ICRmaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICkudmFsKCk7XG5cblx0XHRcdFx0XHRpZiAoIGZyb20gKSB7XG5cdFx0XHRcdFx0XHRmaWx0ZXJVcmwgPSAkZmlsdGVyLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyVzJywgZnJvbSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRmaWx0ZXJVcmwgPSAkZmlsdGVyLmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggZmlsdGVyVXJsICkge1xuXHRcdFx0XHRcdCRmaWx0ZXIuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkZmlsdGVyLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggZmlsdGVyVXJsICk7XG5cdFx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVMaXN0RmlsdGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCBuYXRpdmVJbnB1dHMgPSAnLmxpc3QtdHlwZS1uYXRpdmUgW3R5cGU9XCJjaGVja2JveFwiXSwnICtcblx0XHRcdFx0Jy5saXN0LXR5cGUtbmF0aXZlIFt0eXBlPVwicmFkaW9cIl0sJyArXG5cdFx0XHRcdCcubGlzdC10eXBlLWN1c3RvbS1jaGVja2JveCBbdHlwZT1cImNoZWNrYm94XCJdJztcblxuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCBuYXRpdmVJbnB1dHMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXItaXRlbScgKS50b2dnbGVDbGFzcyggJ2l0ZW0tYWN0aXZlJyApO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5kYXRhKCAndXJsJyApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGNvbnN0IGN1c3RvbVJhZGlvU2VsZWN0b3IgPSAnLmxpc3QtdHlwZS1jdXN0b20tcmFkaW8nO1xuXG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsIGN1c3RvbVJhZGlvU2VsZWN0b3IgKyAnIFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyLWl0ZW0nICkudG9nZ2xlQ2xhc3MoICdpdGVtLWFjdGl2ZScgKTtcblxuXHRcdFx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTgzOTkyNFxuXHRcdFx0XHQkKCB0aGlzIClcblx0XHRcdFx0XHQuY2xvc2VzdCggY3VzdG9tUmFkaW9TZWxlY3RvciApXG5cdFx0XHRcdFx0LmZpbmQoICcud2NhcGYtZmlsdGVyLWl0ZW0uaXRlbS1hY3RpdmUgW3R5cGU9XCJjaGVja2JveFwiXScgKVxuXHRcdFx0XHRcdC5ub3QoIHRoaXMgKVxuXHRcdFx0XHRcdC5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlIClcblx0XHRcdFx0XHQuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXItaXRlbScgKVxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcyggJ2l0ZW0tYWN0aXZlJyApO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5kYXRhKCAndXJsJyApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVEcm9wZG93bkZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCAnLndjYXBmLWRyb3Bkb3duLXdyYXBwZXIgc2VsZWN0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRzZWxlY3QgICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCB2YWx1ZXMgICAgICAgICA9ICRzZWxlY3QudmFsKCk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlclVSTCAgICAgID0gJHNlbGVjdC5kYXRhKCAndXJsJyApO1xuXHRcdFx0XHRjb25zdCBjbGVhckZpbHRlclVSTCA9ICRzZWxlY3QuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICk7XG5cdFx0XHRcdGxldCB1cmw7XG5cblx0XHRcdFx0aWYgKCB2YWx1ZXMubGVuZ3RoICkge1xuXHRcdFx0XHRcdHVybCA9IGZpbHRlclVSTC5yZXBsYWNlKCAnJXMnLCB2YWx1ZXMudG9TdHJpbmcoKSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHVybCA9IGNsZWFyRmlsdGVyVVJMO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVQYWdpbmF0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4ICYmIHdjYXBmX3BhcmFtcy5wYWdpbmF0aW9uX2NvbnRhaW5lciApIHtcblx0XHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRcdGNvbnN0IF9zZWxlY3RvcnMgPSB3Y2FwZl9wYXJhbXMucGFnaW5hdGlvbl9jb250YWluZXIuc3BsaXQoICcsJyApO1xuXHRcdFx0XHRjb25zdCBzZWxlY3RvcnMgID0gW107XG5cblx0XHRcdFx0X3NlbGVjdG9ycy5mb3JFYWNoKCBzZWxlY3RvciA9PiB7XG5cdFx0XHRcdFx0aWYgKCBzZWxlY3RvciApIHtcblx0XHRcdFx0XHRcdHNlbGVjdG9ycy5wdXNoKCBzZWxlY3RvciArICcgYScgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRjb25zdCBzZWxlY3RvciA9IHNlbGVjdG9ycy5qb2luKCAnLCcgKTtcblxuXHRcdFx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdCRjb250YWluZXIub24oICdjbGljaycsIHNlbGVjdG9yLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgaHJlZiA9ICQoIHRoaXMgKS5hdHRyKCAnaHJlZicgKTtcblxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggaHJlZiwgJ3BhZ2luYXRlJyApO1xuXHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aGFuZGxlRGVmYXVsdE9yZGVyYnk6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5zb3J0aW5nX2NvbnRyb2wgKSB7XG5cdFx0XHRcdC8vIFN1Ym1pdCB0aGUgb3JkZXJieSBmb3JtIHdoZW4gdmFsdWUgaXMgY2hhbmdlZC5cblx0XHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nIHNlbGVjdC5vcmRlcmJ5JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCggdGhpcyApLmNsb3Nlc3QoICdmb3JtJyApLnRyaWdnZXIoICdzdWJtaXQnICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFByZXZlbnQgdGhlIGF1dG8gc3VibWlzc2lvbiBvZiB0aGUgb3JkZXJieSBmb3JtLlxuXHRcdFx0JGJvZHkub24oICdzdWJtaXQnLCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCB2aWEgYWpheCB3aGVuIHRoZSBvcmRlcmJ5IHZhbHVlIGlzIGNoYW5nZWQuXG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsICcud29vY29tbWVyY2Utb3JkZXJpbmcgc2VsZWN0Lm9yZGVyYnknLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3Qgb3JkZXIgPSAkKCB0aGlzICkudmFsKCk7XG5cblx0XHRcdFx0Y29uc3QgdXJsID0gbmV3IFVSTCggd2luZG93LmxvY2F0aW9uICk7XG5cdFx0XHRcdHVybC5zZWFyY2hQYXJhbXMuc2V0KCAnb3JkZXJieScsIG9yZGVyICk7XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggZ2V0T3JkZXJCeVVybCggdXJsLmhyZWYgKSApO1xuXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZUNsZWFyRmlsdGVyOiBmdW5jdGlvbigpIHtcblx0XHRcdCRib2R5Lm9uKCAnY2xpY2snLCAnLndjYXBmLWZpbHRlci1jbGVhci1idG4nLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkKCB0aGlzICkuYXR0ciggJ2RhdGEtY2xlYXItZmlsdGVyLXVybCcgKSApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlRmlsdGVyVG9vbHRpcDogZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkUmVmZXJlbmNlXG5cdFx0XHRpZiAoICdmdW5jdGlvbicgIT09IHR5cGVvZiB0aXBweSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLnVzZV90aXBweWpzICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRSZWZlcmVuY2Vcblx0XHRcdHRpcHB5KCAnLndjYXBmLWZpbHRlci10b29sdGlwJywge1xuXHRcdFx0XHRwbGFjZW1lbnQ6ICd0b3AnLFxuXHRcdFx0XHRjb250ZW50KCByZWZlcmVuY2UgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlZmVyZW5jZS5nZXRBdHRyaWJ1dGUoICdkYXRhLWNvbnRlbnQnICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGFsbG93SFRNTDogdHJ1ZSxcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXRDb21ib2JveDogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgalF1ZXJ5KCkuY2hvc2VuV0NBUEYgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgdGVtcGxhdGVSZXN1bHQgPSAoIHRleHQsIGRhdGEgKSA9PiB7XG5cdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0JzxzcGFuPicgKyB0ZXh0ICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cIndjYXBmLWNvdW50XCI+JyArIGRhdGFbICdjb3VudE1hcmt1cCcgXSArICc8L3NwYW4+Jyxcblx0XHRcdFx0XS5qb2luKCAnJyApO1xuXHRcdFx0fTtcblxuXHRcdFx0Y29uc3QgdGVtcGxhdGVTZWxlY3Rpb24gPSAoIHRleHQsIGRhdGEgKSA9PiB7XG5cdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwid2NhcGYtY291bnQtJyArIGRhdGEuY291bnQgKyAnXCI+JyArIHRleHQgKyAnPC9zcGFuPicsXG5cdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwid2NhcGYtY291bnQgd2NhcGYtY291bnQtJyArIGRhdGEuY291bnQgKyAnXCI+JyArIGRhdGFbICdjb3VudE1hcmt1cCcgXSArICc8L3NwYW4+Jyxcblx0XHRcdFx0XS5qb2luKCAnJyApO1xuXHRcdFx0fTtcblxuXHRcdFx0Y29uc3QgZGVmYXVsdHMgPSB7XG5cdFx0XHRcdGluaGVyaXRfc2VsZWN0X2NsYXNzZXM6IHRydWUsXG5cdFx0XHRcdGluaGVyaXRfb3B0aW9uX2NsYXNzZXM6IHRydWUsXG5cdFx0XHRcdG5vX3Jlc3VsdHNfdGV4dDogd2NhcGZfcGFyYW1zLmNvbWJvYm94X25vX3Jlc3VsdHNfdGV4dCxcblx0XHRcdFx0b3B0aW9uc19ub25lX3RleHQ6IHdjYXBmX3BhcmFtcy5jb21ib2JveF9vcHRpb25zX25vbmVfdGV4dCxcblx0XHRcdFx0c2VhcmNoX2NvbnRhaW5zOiB0cnVlLCAvLyBNYXRjaCBmcm9tIGFueXdoZXJlIGluIHN0cmluZy5cblx0XHRcdFx0c2VhcmNoX2luX3ZhbHVlczogdHJ1ZSwgLy8gU2VhcmNoIGluIHZhbHVlcyBhbHNvLlxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuaXNfcnRsICkge1xuXHRcdFx0XHRkZWZhdWx0c1sgJ3J0bCcgXSA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdCRib2R5LmZpbmQoICcud2NhcGYtY2hvc2VuJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkdGhpcyAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0cyB9O1xuXG5cdFx0XHRcdC8vIElmIGhpZXJhcmNoeSBlbmFibGVkIHRoZW4gd2Ugc2hvdyB0aGUgc2VsZWN0ZWQgb3B0aW9ucy5cblx0XHRcdFx0aWYgKCAkdGhpcy5oYXNDbGFzcyggJ2hhcy1oaWVyYXJjaHknICkgKSB7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucycgXSA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucycgXSA9IHdjYXBmX3BhcmFtcy5jb21ib2JveF9kaXNwbGF5X3NlbGVjdGVkX29wdGlvbnM7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBFbmFibGUgdGVtcGxhdGluZyB3aGVuIHNob3dpbmcgY291bnQuXG5cdFx0XHRcdGlmICggJHRoaXMuaGFzQ2xhc3MoICd3aXRoLWNvdW50JyApICkge1xuXHRcdFx0XHRcdG9wdGlvbnNbICd0ZW1wbGF0ZVJlc3VsdCcgXSAgICA9IHRlbXBsYXRlUmVzdWx0O1xuXHRcdFx0XHRcdG9wdGlvbnNbICd0ZW1wbGF0ZVNlbGVjdGlvbicgXSA9IHRlbXBsYXRlU2VsZWN0aW9uO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gRGlzYWJsZSBzZWFyY2ggYm94LlxuXHRcdFx0XHRpZiAoICEgJHRoaXMuZGF0YSggJ2VuYWJsZS1zZWFyY2gnICkgKSB7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ2Rpc2FibGVfc2VhcmNoJyBdID0gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCR0aGlzLmNob3NlbldDQVBGKCBvcHRpb25zICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIEF0dGFjaCBjaG9zZW4gZm9yIGRlZmF1bHQgb3JkZXJieS5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmF0dGFjaF9jb21ib2JveF9vbl9zb3J0aW5nICkge1xuXHRcdFx0XHRsZXQgZGlzYWJsZVNlYXJjaCA9IHRydWU7XG5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2VhcmNoX2JveF9pbl9kZWZhdWx0X29yZGVyYnkgKSB7XG5cdFx0XHRcdFx0ZGlzYWJsZVNlYXJjaCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHsgLi4uZGVmYXVsdHMgfTtcblxuXHRcdFx0XHRvcHRpb25zWyAnZGlzYWJsZV9zZWFyY2gnIF0gPSBkaXNhYmxlU2VhcmNoO1xuXG5cdFx0XHRcdCRib2R5LmZpbmQoICcud29vY29tbWVyY2Utb3JkZXJpbmcgc2VsZWN0Lm9yZGVyYnknICkuY2hvc2VuV0NBUEYoIG9wdGlvbnMgKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGluaXRSYW5nZVNsaWRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLXJhbmdlLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGl0ZW0gICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgJHNsaWRlciA9ICRpdGVtLmZpbmQoICcud2NhcGYtbm91aS1zbGlkZXInICk7XG5cblx0XHRcdFx0Y29uc3Qgc2xpZGVySWQgICAgICAgICAgPSAkc2xpZGVyLmF0dHIoICdpZCcgKTtcblx0XHRcdFx0Y29uc3QgZGlzcGxheVZhbHVlc0FzICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kaXNwbGF5LXZhbHVlcy1hcycgKTtcblx0XHRcdFx0Y29uc3QgZm9ybWF0TnVtYmVycyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1mb3JtYXQtbnVtYmVycycgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgc3RlcCAgICAgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1zdGVwJyApICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1wbGFjZXMnICk7XG5cdFx0XHRcdGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gJGl0ZW0uYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBtaW5WYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBtYXhWYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCAkbWluVmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWluLXZhbHVlJyApO1xuXHRcdFx0XHRjb25zdCAkbWF4VmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWF4LXZhbHVlJyApO1xuXG5cdFx0XHRcdGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBzbGlkZXJJZCApO1xuXG5cdFx0XHRcdG5vVWlTbGlkZXIuY3JlYXRlKCBzbGlkZXIsIHtcblx0XHRcdFx0XHRzdGFydDogWyBtaW5WYWx1ZSwgbWF4VmFsdWUgXSxcblx0XHRcdFx0XHRzdGVwLFxuXHRcdFx0XHRcdGNvbm5lY3Q6IHRydWUsXG5cdFx0XHRcdFx0Y3NzUHJlZml4OiAnd2NhcGYtbm91aS0nLFxuXHRcdFx0XHRcdHJhbmdlOiB7XG5cdFx0XHRcdFx0XHQnbWluJzogcmFuZ2VNaW5WYWx1ZSxcblx0XHRcdFx0XHRcdCdtYXgnOiByYW5nZU1heFZhbHVlLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAndXBkYXRlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHRsZXQgbWluVmFsdWU7XG5cdFx0XHRcdFx0bGV0IG1heFZhbHVlO1xuXG5cdFx0XHRcdFx0aWYgKCBmb3JtYXROdW1iZXJzICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSBudW1iZXJGb3JtYXQoIHZhbHVlc1sgMCBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSBudW1iZXJGb3JtYXQoIHZhbHVlc1sgMSBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMSBdICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCAncGxhaW5fdGV4dCcgPT09IGRpc3BsYXlWYWx1ZXNBcyApIHtcblx0XHRcdFx0XHRcdCRtaW5WYWx1ZS5odG1sKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdFx0JG1heFZhbHVlLmh0bWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRtaW5WYWx1ZS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0XHQkbWF4VmFsdWUudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApIHtcblx0XHRcdFx0XHRjb25zdCBfbWluVmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDAgXSApO1xuXHRcdFx0XHRcdGNvbnN0IF9tYXhWYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMSBdICk7XG5cblx0XHRcdFx0XHQvLyBJZiB2YWx1ZSBpcyBub3QgY2hhbmdlZCB0aGVuIGRvbid0IHByb2NlZWQuXG5cdFx0XHRcdFx0aWYgKCBfbWluVmFsdWUgPT09IG1pblZhbHVlICYmIF9tYXhWYWx1ZSA9PT0gbWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBfbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgX21heFZhbHVlID09PSByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0Ly8gUmVtb3ZlIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICRpdGVtLmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIEFkZCByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0XHRjb25zdCB1cmwgPSAkaXRlbS5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclMXMnLCBfbWluVmFsdWUgKS5yZXBsYWNlKCAnJTJzJywgX21heFZhbHVlICk7XG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkbWluVmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRcdGNsZWFyVGltZW91dCggJGlucHV0LmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgbWluVmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBtaW5WYWx1ZSwgbnVsbCBdICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0JG1heFZhbHVlLm9uKCAnaW5wdXQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRcdCRpbnB1dC5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5zZXQoIFsgbnVsbCwgbWF4VmFsdWUgXSApO1xuXG5cdFx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aW5pdERhdGVwaWNrZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAhIGpRdWVyeSgpLmRhdGVwaWNrZXIgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgJHdjYXBmRGF0ZUZpbHRlciA9ICRib2R5LmZpbmQoICcud2NhcGYtZGF0ZS1pbnB1dCcgKTtcblxuXHRcdFx0Y29uc3QgZm9ybWF0ICAgICAgICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1mb3JtYXQnICk7XG5cdFx0XHRjb25zdCB5ZWFyRHJvcGRvd24gID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLXBpY2tlci15ZWFyLWRyb3Bkb3duJyApO1xuXHRcdFx0Y29uc3QgbW9udGhEcm9wZG93biA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1waWNrZXItbW9udGgtZHJvcGRvd24nICk7XG5cblx0XHRcdGNvbnN0ICRmcm9tID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKTtcblx0XHRcdGNvbnN0ICR0byAgID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtdG8taW5wdXQnICk7XG5cblx0XHRcdCRmcm9tLmRhdGVwaWNrZXIoIHtcblx0XHRcdFx0ZGF0ZUZvcm1hdDogZm9ybWF0LFxuXHRcdFx0XHRjaGFuZ2VZZWFyOiB5ZWFyRHJvcGRvd24sXG5cdFx0XHRcdGNoYW5nZU1vbnRoOiBtb250aERyb3Bkb3duLFxuXHRcdFx0fSApO1xuXG5cdFx0XHQkdG8uZGF0ZXBpY2tlcigge1xuXHRcdFx0XHRkYXRlRm9ybWF0OiBmb3JtYXQsXG5cdFx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdFx0Y2hhbmdlTW9udGg6IG1vbnRoRHJvcGRvd24sXG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRpbml0RmlsdGVyT3B0aW9uVG9vbHRpcDogZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkUmVmZXJlbmNlXG5cdFx0XHRpZiAoICdmdW5jdGlvbicgIT09IHR5cGVvZiB0aXBweSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLnVzZV90aXBweWpzICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHRvb2x0aXBQb3NpdGlvbnMgPSBbICd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2xlZnQnIF07XG5cblx0XHRcdHRvb2x0aXBQb3NpdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oIHRvb2x0aXBQb3NpdGlvbiApIHtcblx0XHRcdFx0Y29uc3QgaWRlbnRpZmllciA9ICdkYXRhLXdjYXBmLXRvb2x0aXAtJyArIHRvb2x0aXBQb3NpdGlvbjtcblxuXHRcdFx0XHQvLyBub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkUmVmZXJlbmNlXG5cdFx0XHRcdGNvbnN0IGluc3RhbmNlcyA9IHRpcHB5KCAnWycgKyBpZGVudGlmaWVyICsgJ10nLCB7XG5cdFx0XHRcdFx0cGxhY2VtZW50OiB0b29sdGlwUG9zaXRpb24sXG5cdFx0XHRcdFx0Y29udGVudCggcmVmZXJlbmNlICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJlZmVyZW5jZS5nZXRBdHRyaWJ1dGUoIGlkZW50aWZpZXIgKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGFsbG93SFRNTDogdHJ1ZSxcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHdpbmRvdy50aXBweUluc3RhbmNlcyA9IHRpcHB5SW5zdGFuY2VzLmNvbmNhdCggaW5zdGFuY2VzICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRcdFdDQVBGLmluaXRDb21ib2JveCgpO1xuXHRcdFx0V0NBUEYuaW5pdFJhbmdlU2xpZGVyKCk7XG5cdFx0XHRXQ0FQRi5pbml0RGF0ZXBpY2tlcigpO1xuXHRcdFx0V0NBUEYuaW5pdEZpbHRlck9wdGlvblRvb2x0aXAoKTtcblx0XHR9LFxuXHRcdGluaXRQb3BTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5yZWxvYWRfb25fYmFjayAmJiB3Y2FwZl9wYXJhbXMuZm91bmRfd2NhcGYgKSB7XG5cdFx0XHRcdGhpc3RvcnkucmVwbGFjZVN0YXRlKCB7IHdjYXBmOiB0cnVlIH0sICcnLCB3aW5kb3cubG9jYXRpb24gKTtcblxuXHRcdFx0XHQvLyBIYW5kbGUgdGhlIHBvcHN0YXRlIGV2ZW50KGJyb3dzZXIncyBiYWNrL2ZvcndhcmQpXG5cdFx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAncG9wc3RhdGUnLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRpZiAoIG51bGwgIT09IGUuc3RhdGUgJiYgZS5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSggJ3djYXBmJyApICkge1xuXHRcdFx0XHRcdFx0V0NBUEYuZmlsdGVyUHJvZHVjdHMoICdwb3BzdGF0ZScgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIEVuYWJsZSBpdCBpZiBuZWNlc3NhcnkuXG5cdCAqXG5cdCAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzMzMDA0OTE3XG5cdCAqL1xuXHRpZiAoICdzY3JvbGxSZXN0b3JhdGlvbicgaW4gaGlzdG9yeSApIHtcblx0XHQvLyBoaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uID0gJ21hbnVhbCc7XG5cdH1cblxufSggalF1ZXJ5LCB3aW5kb3cgKSApO1xuXG4oIGZ1bmN0aW9uKCAkLCBXQ0FQRiApIHtcblxuXHRXQ0FQRi5pbml0KCk7XG5cdFdDQVBGLmluaXRQb3BTdGF0ZSgpO1xuXG5cdFdDQVBGLmhhbmRsZUZpbHRlckFjY29yZGlvbigpO1xuXHRXQ0FQRi5oYW5kbGVIaWVyYXJjaHlUb2dnbGUoKTtcblx0V0NBUEYuaGFuZGxlU29mdExpbWl0KCk7XG5cdFdDQVBGLmhhbmRsZVNlYXJjaEZpbHRlck9wdGlvbnMoKTtcblxuXHRXQ0FQRi5oYW5kbGVMaXN0RmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVEcm9wZG93bkZpbHRlcnMoKTtcblx0V0NBUEYuaGFuZGxlTnVtYmVySW5wdXRGaWx0ZXJzKCk7XG5cdFdDQVBGLmhhbmRsZURhdGVJbnB1dEZpbHRlcnMoKTtcblx0V0NBUEYuaGFuZGxlUGFnaW5hdGlvbigpO1xuXHRXQ0FQRi5oYW5kbGVEZWZhdWx0T3JkZXJieSgpO1xuXG5cdFdDQVBGLmhhbmRsZUNsZWFyRmlsdGVyKCk7XG5cblx0V0NBUEYuaGFuZGxlRmlsdGVyVG9vbHRpcCgpO1xuXG5cdC8qKlxuXHQgKiBNYWtlIGl0IGNvbXBhdGlibGUgd2l0aCBvdGhlciBwbHVnaW5zLlxuXHQgKi9cblx0JCggZG9jdW1lbnQgKS5vbiggJ3djYXBmX2FmdGVyX3VwZGF0aW5nX3Byb2R1Y3RzJywgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gd29vLXZhcmlhdGlvbi1zd2F0Y2hlc1xuXHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggJ3dvb192YXJpYXRpb25fc3dhdGNoZXNfcHJvX2luaXQnICk7XG5cdH0gKTtcblxufSggalF1ZXJ5LCB3aW5kb3cuV0NBUEYgKSApO1xuIiwiLyoqXG4gKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNDE0MTgxM1xuICpcbiAqIEBwYXJhbSBudW1iZXJcbiAqIEBwYXJhbSBkZWNpbWFsc1xuICogQHBhcmFtIGRlY19wb2ludFxuICogQHBhcmFtIHRob3VzYW5kc19zZXBcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBudW1iZXJGb3JtYXQoIG51bWJlciwgZGVjaW1hbHMsIGRlY19wb2ludCwgdGhvdXNhbmRzX3NlcCApIHtcblx0Ly8gU3RyaXAgYWxsIGNoYXJhY3RlcnMgYnV0IG51bWVyaWNhbCBvbmVzLlxuXHRudW1iZXIgPSAoIG51bWJlciArICcnICkucmVwbGFjZSggL1teXFxkK1xcLUVlLl0vZywgJycgKTtcblxuXHRjb25zdCBuICAgID0gISBpc0Zpbml0ZSggK251bWJlciApID8gMCA6ICtudW1iZXI7XG5cdGNvbnN0IHByZWMgPSAhIGlzRmluaXRlKCArZGVjaW1hbHMgKSA/IDAgOiBNYXRoLmFicyggZGVjaW1hbHMgKTtcblx0Y29uc3Qgc2VwICA9ICggdHlwZW9mIHRob3VzYW5kc19zZXAgPT09ICd1bmRlZmluZWQnICkgPyAnLCcgOiB0aG91c2FuZHNfc2VwO1xuXHRjb25zdCBkZWMgID0gKCB0eXBlb2YgZGVjX3BvaW50ID09PSAndW5kZWZpbmVkJyApID8gJy4nIDogZGVjX3BvaW50O1xuXG5cdGxldCBzO1xuXG5cdGNvbnN0IHRvRml4ZWRGaXggPSBmdW5jdGlvbiggbiwgcHJlYyApIHtcblx0XHRjb25zdCBrID0gTWF0aC5wb3coIDEwLCBwcmVjICk7XG5cdFx0cmV0dXJuICcnICsgTWF0aC5yb3VuZCggbiAqIGsgKSAvIGs7XG5cdH07XG5cblx0Ly8gRml4IGZvciBJRSBwYXJzZUZsb2F0KDAuNTUpLnRvRml4ZWQoMCkgPSAwO1xuXHRzID0gKCBwcmVjID8gdG9GaXhlZEZpeCggbiwgcHJlYyApIDogJycgKyBNYXRoLnJvdW5kKCBuICkgKS5zcGxpdCggJy4nICk7XG5cblx0aWYgKCBzWyAwIF0ubGVuZ3RoID4gMyApIHtcblx0XHRzWyAwIF0gPSBzWyAwIF0ucmVwbGFjZSggL1xcQig/PSg/OlxcZHszfSkrKD8hXFxkKSkvZywgc2VwICk7XG5cdH1cblxuXHRpZiAoICggc1sgMSBdIHx8ICcnICkubGVuZ3RoIDwgcHJlYyApIHtcblx0XHRzWyAxIF0gPSBzWyAxIF0gfHwgJyc7XG5cdFx0c1sgMSBdICs9IG5ldyBBcnJheSggcHJlYyAtIHNbIDEgXS5sZW5ndGggKyAxICkuam9pbiggJzAnICk7XG5cdH1cblxuXHRyZXR1cm4gcy5qb2luKCBkZWMgKTtcbn1cblxuZnVuY3Rpb24gY2xlYW5VcmwoIHVybCApIHtcblx0cmV0dXJuIHVybC5yZXBsYWNlKCAvJTJDL2csICcsJyApO1xufVxuXG5mdW5jdGlvbiBnZXRPcmRlckJ5VXJsKCB1cmwgKSB7XG5cdGNvbnN0IHBhZ2VkID0gcGFyc2VJbnQoIHVybC5yZXBsYWNlKCAvLitcXC9wYWdlXFwvKFxcZCspKy8sICckMScgKSApO1xuXG5cdGlmICggcGFnZWQgKSB7XG5cdFx0dXJsID0gdXJsLnJlcGxhY2UoIC9wYWdlXFwvKFxcZCspXFwvLywgJycgKTtcblx0fVxuXG5cdHJldHVybiBjbGVhblVybCggdXJsICk7XG59XG4iXX0=
