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
      $(window).trigger('resize');

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJ1dGlscy5qcyJdLCJuYW1lcyI6WyJ3Y2FwZl9wYXJhbXMiLCIkIiwid2luZG93IiwiX2RlbGF5IiwicGFyc2VJbnQiLCJmaWx0ZXJfaW5wdXRfZGVsYXkiLCJkZWxheSIsImlzUHJvIiwid2NhcGZfcHJvIiwiJGJvZHkiLCIkZG9jdW1lbnQiLCJkb2N1bWVudCIsImluc3RhbmNlSWRzIiwiZWFjaCIsImlkIiwiZGF0YSIsInB1c2giLCJmb2N1c2VkRWxtIiwidGlwcHlJbnN0YW5jZXMiLCJXQ0FQRiIsImhhbmRsZUZpbHRlckFjY29yZGlvbiIsInRvZ2dsZUFjY29yZGlvbiIsIiRlbCIsInByZXNzZWQiLCJhdHRyIiwiJGZpbHRlcklubmVyIiwiY2xvc2VzdCIsImNoaWxkcmVuIiwiZW5hYmxlX2FuaW1hdGlvbl9mb3JfZmlsdGVyX2FjY29yZGlvbiIsInNsaWRlVG9nZ2xlIiwiZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQiLCJmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmciLCJ0b2dnbGUiLCJvbiIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCIkdHJpZ2dlciIsImZpbmQiLCJoYW5kbGVIaWVyYXJjaHlUb2dnbGUiLCIkY2hpbGQiLCJlbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uIiwiaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQiLCJoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmciLCJrZXkiLCJwcmV2ZW50RGVmYXVsdCIsImhhbmRsZVNvZnRMaW1pdCIsInRvZ2dsZUZpbHRlck9wdGlvbnMiLCIkbGlzdFdyYXBwZXIiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiaGFuZGxlU2VhcmNoRmlsdGVyT3B0aW9ucyIsIiR0aGF0IiwiJGlubmVyIiwiJGZpbHRlciIsInNvZnRMaW1pdEVuYWJsZWQiLCJoYXNDbGFzcyIsInNvZnRMaW1pdFRvZ2dsZSIsIm5vUmVzdWx0cyIsInZpc2libGVPcHRpb25zIiwia2V5d29yZCIsInZhbCIsImxlbmd0aCIsImluZGV4IiwiJGZpbHRlckl0ZW0iLCJyZW1vdmVBdHRyIiwidGV4dCIsImhpZGUiLCJsYWJlbCIsInRvU3RyaW5nIiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsInNob3ciLCJ1cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0IiwiJHJlc3BvbnNlIiwiJGNvbnRhaW5lciIsInNob3BfbG9vcF9jb250YWluZXIiLCJzZWxlY3RvciIsIm5ld0NvdW50IiwiaHRtbCIsImhhcyIsInNjcm9sbFRvIiwic2Nyb2xsX3dpbmRvdyIsInNjcm9sbEZvciIsInNjcm9sbF93aW5kb3dfZm9yIiwiaXNNb2JpbGUiLCJpc19tb2JpbGUiLCJwcm9jZWVkIiwiYWRqdXN0aW5nT2Zmc2V0Iiwib2Zmc2V0Iiwic2Nyb2xsX3RvX3RvcF9vZmZzZXQiLCJjb250YWluZXIiLCJub3RfZm91bmRfY29udGFpbmVyIiwic2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudCIsInRvcCIsImRpc2FibGVfc2Nyb2xsX2FuaW1hdGlvbiIsInN0b3AiLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwic2Nyb2xsX3RvX3RvcF9zcGVlZCIsInNjcm9sbF90b190b3BfZWFzaW5nIiwiYmVmb3JlRmV0Y2hpbmdQcm9kdWN0cyIsInRyaWdnZXJlZEJ5IiwiYWN0aXZlRWxlbWVudCIsInNjcm9sbF93aW5kb3dfd2hlbiIsInRyaWdnZXIiLCJkZXN0cm95VGlwcHlJbnN0YW5jZXMiLCJ1c2VfdGlwcHlqcyIsImZvckVhY2giLCJpbnN0YW5jZSIsImRlc3Ryb3kiLCJiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzIiwiYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzIiwicmVzdG9yZV9mb2N1c19hZnRlcl9maWx0ZXJpbmciLCJib2R5IiwiZm9jdXMiLCJpbml0IiwiY3VzdG9tX3NjcmlwdHMiLCJldmFsIiwiZmlsdGVyUHJvZHVjdHMiLCJhamF4IiwidXJsIiwibG9jYXRpb24iLCJocmVmIiwic3VjY2VzcyIsInJlc3BvbnNlIiwidXBkYXRlX2RvY3VtZW50X3RpdGxlIiwidGl0bGUiLCJmaWx0ZXIiLCJpbnN0YW5jZUlkIiwiJGluc3RhbmNlIiwiX2luc3RhbmNlIiwicHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSIsInRvZ2dsZVNlbGVjdG9yIiwicHJlc2VydmVfc29mdF9saW1pdF9zdGF0ZSIsIl9odG1sIiwiJHNob3BMb29wQ29udGFpbmVyIiwiJG5vdEZvdW5kQ29udGFpbmVyIiwicmVxdWVzdEZpbHRlciIsImhvc3RuYW1lIiwicmVwbGFjZSIsImRpc2FibGVfYWpheCIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJ3Y2FwZiIsImhhbmRsZU51bWJlcklucHV0RmlsdGVycyIsInJhbmdlTnVtYmVyU2VsZWN0b3JzIiwiJGl0ZW0iLCIkcmFuZ2VOdW1iZXIiLCJmb3JtYXROdW1iZXJzIiwicmFuZ2VNaW5WYWx1ZSIsInBhcnNlRmxvYXQiLCJyYW5nZU1heFZhbHVlIiwib2xkTWluVmFsdWUiLCJvbGRNYXhWYWx1ZSIsImRlY2ltYWxQbGFjZXMiLCJ0aG91c2FuZFNlcGFyYXRvciIsImRlY2ltYWxTZXBhcmF0b3IiLCJjbGVhclRpbWVvdXQiLCJnZXRWYWx1ZSIsImZsb2F0VmFsdWUiLCJudW1iZXJGb3JtYXQiLCJzZXRUaW1lb3V0IiwicmVtb3ZlRGF0YSIsIm1pblZhbHVlIiwibWF4VmFsdWUiLCJpc05hTiIsImhhbmRsZURhdGVJbnB1dEZpbHRlcnMiLCJpc1JhbmdlIiwiZmlsdGVyVXJsIiwiZnJvbSIsInRvIiwiaGFuZGxlTGlzdEZpbHRlcnMiLCJuYXRpdmVJbnB1dHMiLCJ0b2dnbGVDbGFzcyIsImN1c3RvbVJhZGlvU2VsZWN0b3IiLCJub3QiLCJwcm9wIiwiaGFuZGxlRHJvcGRvd25GaWx0ZXJzIiwiJHNlbGVjdCIsInZhbHVlcyIsImZpbHRlclVSTCIsImNsZWFyRmlsdGVyVVJMIiwiaGFuZGxlUGFnaW5hdGlvbiIsImVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4IiwicGFnaW5hdGlvbl9jb250YWluZXIiLCJfc2VsZWN0b3JzIiwic3BsaXQiLCJzZWxlY3RvcnMiLCJqb2luIiwiaGFuZGxlRGVmYXVsdE9yZGVyYnkiLCJzb3J0aW5nX2NvbnRyb2wiLCJvcmRlciIsIlVSTCIsInNlYXJjaFBhcmFtcyIsInNldCIsImdldE9yZGVyQnlVcmwiLCJoYW5kbGVDbGVhckZpbHRlciIsImhhbmRsZUZpbHRlclRvb2x0aXAiLCJ0aXBweSIsInBsYWNlbWVudCIsImNvbnRlbnQiLCJyZWZlcmVuY2UiLCJnZXRBdHRyaWJ1dGUiLCJhbGxvd0hUTUwiLCJpbml0Q29tYm9ib3giLCJqUXVlcnkiLCJjaG9zZW5XQ0FQRiIsInRlbXBsYXRlUmVzdWx0IiwidGVtcGxhdGVTZWxlY3Rpb24iLCJjb3VudCIsImRlZmF1bHRzIiwiaW5oZXJpdF9zZWxlY3RfY2xhc3NlcyIsImluaGVyaXRfb3B0aW9uX2NsYXNzZXMiLCJub19yZXN1bHRzX3RleHQiLCJjaG9zZW5fbm9fcmVzdWx0c190ZXh0Iiwib3B0aW9uc19ub25lX3RleHQiLCJjaG9zZW5fb3B0aW9uc19ub25lX3RleHQiLCJzZWFyY2hfY29udGFpbnMiLCJzZWFyY2hfaW5fdmFsdWVzIiwiaXNfcnRsIiwiJHRoaXMiLCJvcHRpb25zIiwiY2hvc2VuX2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucyIsImF0dGFjaF9jaG9zZW5fb25fc29ydGluZyIsImRpc2FibGVTZWFyY2giLCJzZWFyY2hfYm94X2luX2RlZmF1bHRfb3JkZXJieSIsImluaXRSYW5nZVNsaWRlciIsIm5vVWlTbGlkZXIiLCIkc2xpZGVyIiwic2xpZGVySWQiLCJkaXNwbGF5VmFsdWVzQXMiLCJzdGVwIiwiJG1pblZhbHVlIiwiJG1heFZhbHVlIiwic2xpZGVyIiwiZ2V0RWxlbWVudEJ5SWQiLCJjcmVhdGUiLCJzdGFydCIsImNvbm5lY3QiLCJjc3NQcmVmaXgiLCJyYW5nZSIsImZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIiLCJfbWluVmFsdWUiLCJfbWF4VmFsdWUiLCIkaW5wdXQiLCJnZXQiLCJpbml0RGF0ZXBpY2tlciIsImRhdGVwaWNrZXIiLCIkd2NhcGZEYXRlRmlsdGVyIiwiZm9ybWF0IiwieWVhckRyb3Bkb3duIiwibW9udGhEcm9wZG93biIsIiRmcm9tIiwiJHRvIiwiZGF0ZUZvcm1hdCIsImNoYW5nZVllYXIiLCJjaGFuZ2VNb250aCIsImluaXRGaWx0ZXJPcHRpb25Ub29sdGlwIiwidG9vbHRpcFBvc2l0aW9ucyIsInRvb2x0aXBQb3NpdGlvbiIsImlkZW50aWZpZXIiLCJpbnN0YW5jZXMiLCJjb25jYXQiLCJpbml0UG9wU3RhdGUiLCJyZWxvYWRfb25fYmFjayIsImZvdW5kX3djYXBmIiwicmVwbGFjZVN0YXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInN0YXRlIiwiaGFzT3duUHJvcGVydHkiLCJudW1iZXIiLCJkZWNpbWFscyIsImRlY19wb2ludCIsInRob3VzYW5kc19zZXAiLCJuIiwiaXNGaW5pdGUiLCJwcmVjIiwiTWF0aCIsImFicyIsInNlcCIsImRlYyIsInMiLCJ0b0ZpeGVkRml4IiwiayIsInBvdyIsInJvdW5kIiwiQXJyYXkiLCJjbGVhblVybCIsInBhZ2VkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSxZQUFZLEdBQUdBLFlBQVksSUFBSTtBQUNwQyxZQUFVLEVBRDBCO0FBRXBDLHdCQUFzQixFQUZjO0FBR3BDLHFDQUFtQyxFQUhDO0FBSXBDLDRCQUEwQixFQUpVO0FBS3BDLDhCQUE0QixFQUxRO0FBTXBDLG1DQUFpQyxFQU5HO0FBT3BDLHdDQUFzQyxFQVBGO0FBUXBDLCtCQUE2QixFQVJPO0FBU3BDLDJDQUF5QyxFQVRMO0FBVXBDLHNDQUFvQyxFQVZBO0FBV3BDLHVDQUFxQyxFQVhEO0FBWXBDLDhDQUE0QyxFQVpSO0FBYXBDLHlDQUF1QyxFQWJIO0FBY3BDLDBDQUF3QyxFQWRKO0FBZXBDLG1DQUFpQyxFQWZHO0FBZ0JwQyx5QkFBdUIsRUFoQmE7QUFpQnBDLDBCQUF3QixFQWpCWTtBQWtCcEMsZUFBYSxFQWxCdUI7QUFtQnBDLG9CQUFrQixFQW5Ca0I7QUFvQnBDLGlCQUFlLEVBcEJxQjtBQXFCcEMsZUFBYSxFQXJCdUI7QUFzQnBDLDJCQUF5QixFQXRCVztBQXVCcEMsaUJBQWUsRUF2QnFCO0FBd0JwQyx5QkFBdUIsRUF4QmE7QUF5QnBDLHlCQUF1QixFQXpCYTtBQTBCcEMsMEJBQXdCLEVBMUJZO0FBMkJwQyxrQkFBZ0IsRUEzQm9CO0FBNEJwQyxnQ0FBOEIsRUE1Qk07QUE2QnBDLHFCQUFtQixFQTdCaUI7QUE4QnBDLDhCQUE0QixFQTlCUTtBQStCcEMsdUJBQXFCLEVBL0JlO0FBZ0NwQyxtQkFBaUIsRUFoQ21CO0FBaUNwQyx1QkFBcUIsRUFqQ2U7QUFrQ3BDLHdCQUFzQixFQWxDYztBQW1DcEMsa0NBQWdDLEVBbkNJO0FBb0NwQyxlQUFhLEVBcEN1QjtBQXFDcEMsMEJBQXdCLEVBckNZO0FBc0NwQyx5QkFBdUIsRUF0Q2E7QUF1Q3BDLDhCQUE0QixFQXZDUTtBQXdDcEMsb0JBQWtCLEVBeENrQjtBQXlDcEMsb0JBQWtCO0FBekNrQixDQUFyQzs7QUE0Q0UsV0FBVUMsQ0FBVixFQUFhQyxNQUFiLEVBQXNCO0FBRXZCLE1BQU1DLE1BQU0sR0FBR0MsUUFBUSxDQUFFSixZQUFZLENBQUNLLGtCQUFmLENBQXZCOztBQUNBLE1BQU1DLEtBQUssR0FBSUgsTUFBTSxJQUFJLENBQVYsR0FBY0EsTUFBZCxHQUF1QixHQUF0QztBQUVBLE1BQU1JLEtBQUssR0FBR1AsWUFBWSxDQUFDUSxTQUEzQjtBQUVBLE1BQU1DLEtBQUssR0FBT1IsQ0FBQyxDQUFFLE1BQUYsQ0FBbkI7QUFDQSxNQUFNUyxTQUFTLEdBQUdULENBQUMsQ0FBRVUsUUFBRixDQUFuQjtBQUVBLE1BQU1DLFdBQVcsR0FBRyxFQUFwQjtBQUVBWCxFQUFBQSxDQUFDLENBQUUsZUFBRixDQUFELENBQXFCWSxJQUFyQixDQUEyQixZQUFXO0FBQ3JDLFFBQU1DLEVBQUUsR0FBR2IsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVYyxJQUFWLENBQWdCLElBQWhCLENBQVg7O0FBRUEsUUFBSyxDQUFFRCxFQUFQLEVBQVk7QUFDWDtBQUNBOztBQUVERixJQUFBQSxXQUFXLENBQUNJLElBQVosQ0FBa0JGLEVBQWxCO0FBQ0EsR0FSRDtBQVVBLE1BQUlHLFVBQUo7QUFFQWYsRUFBQUEsTUFBTSxDQUFDZ0IsY0FBUCxHQUF3QixFQUF4QjtBQUVBaEIsRUFBQUEsTUFBTSxDQUFDaUIsS0FBUCxHQUFlakIsTUFBTSxDQUFDaUIsS0FBUCxJQUFnQixFQUEvQjtBQUVBakIsRUFBQUEsTUFBTSxDQUFDaUIsS0FBUCxHQUFlO0FBQ2RDLElBQUFBLHFCQUFxQixFQUFFLGlDQUFXO0FBQ2pDLFVBQU1DLGVBQWUsR0FBRyxTQUFsQkEsZUFBa0IsQ0FBRUMsR0FBRixFQUFXO0FBQ2xDO0FBQ0EsWUFBTUMsT0FBTyxHQUFHRCxHQUFHLENBQUNFLElBQUosQ0FBVSxlQUFWLE1BQWdDLE1BQWhELENBRmtDLENBSWxDOztBQUNBRixRQUFBQSxHQUFHLENBQUNFLElBQUosQ0FBVSxlQUFWLEVBQTJCLENBQUVELE9BQTdCO0FBRUEsWUFBTUUsWUFBWSxHQUFHSCxHQUFHLENBQUNJLE9BQUosQ0FBYSxlQUFiLEVBQStCQyxRQUEvQixDQUF5QyxxQkFBekMsQ0FBckI7O0FBRUEsWUFBSzNCLFlBQVksQ0FBQzRCLHFDQUFsQixFQUEwRDtBQUN6REgsVUFBQUEsWUFBWSxDQUFDSSxXQUFiLENBQ0M3QixZQUFZLENBQUM4QixnQ0FEZCxFQUVDOUIsWUFBWSxDQUFDK0IsaUNBRmQ7QUFJQSxTQUxELE1BS087QUFDTk4sVUFBQUEsWUFBWSxDQUFDTyxNQUFiO0FBQ0E7QUFDRCxPQWpCRDs7QUFtQkF2QixNQUFBQSxLQUFLLENBQUN3QixFQUFOLENBQVUsT0FBVixFQUFtQixpQ0FBbkIsRUFBc0QsVUFBVUMsQ0FBVixFQUFjO0FBQ25FQSxRQUFBQSxDQUFDLENBQUNDLGVBQUY7QUFFQWQsUUFBQUEsZUFBZSxDQUFFcEIsQ0FBQyxDQUFFLElBQUYsQ0FBSCxDQUFmO0FBQ0EsT0FKRDtBQU1BUSxNQUFBQSxLQUFLLENBQUN3QixFQUFOLENBQVUsT0FBVixFQUFtQixtQ0FBbkIsRUFBd0QsWUFBVztBQUNsRSxZQUFNRyxRQUFRLEdBQUduQyxDQUFDLENBQUUsSUFBRixDQUFELENBQVVvQyxJQUFWLENBQWdCLGlDQUFoQixDQUFqQjtBQUVBaEIsUUFBQUEsZUFBZSxDQUFFZSxRQUFGLENBQWY7QUFDQSxPQUpEO0FBS0EsS0FoQ2E7QUFpQ2RFLElBQUFBLHFCQUFxQixFQUFFLGlDQUFXO0FBQ2pDLFVBQU1qQixlQUFlLEdBQUcsU0FBbEJBLGVBQWtCLENBQUVDLEdBQUYsRUFBVztBQUNsQztBQUNBLFlBQU1DLE9BQU8sR0FBR0QsR0FBRyxDQUFDRSxJQUFKLENBQVUsY0FBVixNQUErQixNQUEvQyxDQUZrQyxDQUlsQzs7QUFDQUYsUUFBQUEsR0FBRyxDQUFDRSxJQUFKLENBQVUsY0FBVixFQUEwQixDQUFFRCxPQUE1QjtBQUVBLFlBQU1nQixNQUFNLEdBQUdqQixHQUFHLENBQUNJLE9BQUosQ0FBYSxJQUFiLEVBQW9CQyxRQUFwQixDQUE4QixJQUE5QixDQUFmOztBQUVBLFlBQUszQixZQUFZLENBQUN3Qyx3Q0FBbEIsRUFBNkQ7QUFDNURELFVBQUFBLE1BQU0sQ0FBQ1YsV0FBUCxDQUNDN0IsWUFBWSxDQUFDeUMsbUNBRGQsRUFFQ3pDLFlBQVksQ0FBQzBDLG9DQUZkO0FBSUEsU0FMRCxNQUtPO0FBQ05ILFVBQUFBLE1BQU0sQ0FBQ1AsTUFBUDtBQUNBO0FBQ0QsT0FqQkQ7O0FBbUJBdkIsTUFBQUEsS0FBSyxDQUNId0IsRUFERixDQUNNLE9BRE4sRUFDZSxtQ0FEZixFQUNvRCxZQUFXO0FBQzdEWixRQUFBQSxlQUFlLENBQUVwQixDQUFDLENBQUUsSUFBRixDQUFILENBQWY7QUFDQSxPQUhGLEVBSUVnQyxFQUpGLENBSU0sU0FKTixFQUlpQixtQ0FKakIsRUFJc0QsVUFBVUMsQ0FBVixFQUFjO0FBQ2xFLFlBQUtBLENBQUMsQ0FBQ1MsR0FBRixLQUFVLEdBQVYsSUFBaUJULENBQUMsQ0FBQ1MsR0FBRixLQUFVLE9BQTNCLElBQXNDVCxDQUFDLENBQUNTLEdBQUYsS0FBVSxVQUFyRCxFQUFrRTtBQUNqRTtBQUNBVCxVQUFBQSxDQUFDLENBQUNVLGNBQUY7QUFFQXZCLFVBQUFBLGVBQWUsQ0FBRXBCLENBQUMsQ0FBRSxJQUFGLENBQUgsQ0FBZjtBQUNBO0FBQ0QsT0FYRjtBQVlBLEtBakVhO0FBa0VkNEMsSUFBQUEsZUFBZSxFQUFFLDJCQUFXO0FBQzNCLFVBQU1DLG1CQUFtQixHQUFHLFNBQXRCQSxtQkFBc0IsQ0FBRXhCLEdBQUYsRUFBVztBQUN0QztBQUNBLFlBQU1DLE9BQU8sR0FBR0QsR0FBRyxDQUFDRSxJQUFKLENBQVUsY0FBVixNQUErQixNQUEvQyxDQUZzQyxDQUl0Qzs7QUFDQUYsUUFBQUEsR0FBRyxDQUFDRSxJQUFKLENBQVUsY0FBVixFQUEwQixDQUFFRCxPQUE1QjtBQUVBLFlBQU13QixZQUFZLEdBQUd6QixHQUFHLENBQUNJLE9BQUosQ0FBYSxxQkFBYixDQUFyQjs7QUFFQSxZQUFLSCxPQUFMLEVBQWU7QUFDZHdCLFVBQUFBLFlBQVksQ0FBQ0MsV0FBYixDQUEwQixxQkFBMUI7QUFDQSxTQUZELE1BRU87QUFDTkQsVUFBQUEsWUFBWSxDQUFDRSxRQUFiLENBQXVCLHFCQUF2QjtBQUNBO0FBQ0QsT0FkRDs7QUFnQkF4QyxNQUFBQSxLQUFLLENBQ0h3QixFQURGLENBQ00sT0FETixFQUNlLDJCQURmLEVBQzRDLFlBQVc7QUFDckRhLFFBQUFBLG1CQUFtQixDQUFFN0MsQ0FBQyxDQUFFLElBQUYsQ0FBSCxDQUFuQjtBQUNBLE9BSEYsRUFJRWdDLEVBSkYsQ0FJTSxTQUpOLEVBSWlCLDJCQUpqQixFQUk4QyxVQUFVQyxDQUFWLEVBQWM7QUFDMUQsWUFBS0EsQ0FBQyxDQUFDUyxHQUFGLEtBQVUsR0FBVixJQUFpQlQsQ0FBQyxDQUFDUyxHQUFGLEtBQVUsT0FBM0IsSUFBc0NULENBQUMsQ0FBQ1MsR0FBRixLQUFVLFVBQXJELEVBQWtFO0FBQ2pFO0FBQ0FULFVBQUFBLENBQUMsQ0FBQ1UsY0FBRjtBQUVBRSxVQUFBQSxtQkFBbUIsQ0FBRTdDLENBQUMsQ0FBRSxJQUFGLENBQUgsQ0FBbkI7QUFDQTtBQUNELE9BWEY7QUFZQSxLQS9GYTtBQWdHZGlELElBQUFBLHlCQUF5QixFQUFFLHFDQUFXO0FBQ3JDekMsTUFBQUEsS0FBSyxDQUFDd0IsRUFBTixDQUFVLE9BQVYsRUFBbUIsc0NBQW5CLEVBQTJELFlBQVc7QUFDckUsWUFBTWtCLEtBQUssR0FBS2xELENBQUMsQ0FBRSxJQUFGLENBQWpCO0FBQ0EsWUFBTW1ELE1BQU0sR0FBSUQsS0FBSyxDQUFDekIsT0FBTixDQUFlLHFCQUFmLENBQWhCO0FBQ0EsWUFBTTJCLE9BQU8sR0FBR0QsTUFBTSxDQUFDMUIsT0FBUCxDQUFnQixlQUFoQixDQUFoQjtBQUVBLFlBQU00QixnQkFBZ0IsR0FBR0QsT0FBTyxDQUFDRSxRQUFSLENBQWtCLGdCQUFsQixDQUF6QjtBQUNBLFlBQU1DLGVBQWUsR0FBSUgsT0FBTyxDQUFDaEIsSUFBUixDQUFjLDJCQUFkLENBQXpCO0FBQ0EsWUFBTW9CLFNBQVMsR0FBVUosT0FBTyxDQUFDaEIsSUFBUixDQUFjLHdCQUFkLENBQXpCO0FBQ0EsWUFBTXFCLGNBQWMsR0FBS3RELFFBQVEsQ0FBRWlELE9BQU8sQ0FBQzdCLElBQVIsQ0FBYyxzQkFBZCxDQUFGLENBQWpDO0FBRUEsWUFBTW1DLE9BQU8sR0FBR1IsS0FBSyxDQUFDUyxHQUFOLEVBQWhCOztBQUVBLFlBQUssQ0FBRUQsT0FBTyxDQUFDRSxNQUFmLEVBQXdCO0FBQ3ZCLGNBQUlDLE1BQUssR0FBRyxDQUFaO0FBQ0FULFVBQUFBLE9BQU8sQ0FBQ0wsV0FBUixDQUFxQixlQUFyQjtBQUVBL0MsVUFBQUEsQ0FBQyxDQUFDWSxJQUFGLENBQVF1QyxNQUFNLENBQUNmLElBQVAsQ0FBYSw0QkFBYixDQUFSLEVBQXFELFlBQVc7QUFDL0R5QixZQUFBQSxNQUFLO0FBRUwsZ0JBQU1DLFdBQVcsR0FBRzlELENBQUMsQ0FBRSxJQUFGLENBQXJCO0FBQ0E4RCxZQUFBQSxXQUFXLENBQUNmLFdBQVosQ0FBeUIsaUJBQXpCOztBQUVBLGdCQUFLTSxnQkFBTCxFQUF3QjtBQUN2QixrQkFBS1EsTUFBSyxHQUFHSixjQUFiLEVBQThCO0FBQzdCSyxnQkFBQUEsV0FBVyxDQUFDZCxRQUFaLENBQXNCLDRCQUF0QjtBQUNBLGVBRkQsTUFFTztBQUNOYyxnQkFBQUEsV0FBVyxDQUFDZixXQUFaLENBQXlCLDRCQUF6QjtBQUNBO0FBQ0Q7QUFDRCxXQWJEOztBQWVBLGNBQUtNLGdCQUFMLEVBQXdCO0FBQ3ZCRSxZQUFBQSxlQUFlLENBQUNRLFVBQWhCLENBQTRCLE9BQTVCO0FBQ0E7O0FBRURQLFVBQUFBLFNBQVMsQ0FBQzlCLFFBQVYsQ0FBb0IsTUFBcEIsRUFBNkJzQyxJQUE3QixDQUFtQyxFQUFuQztBQUNBUixVQUFBQSxTQUFTLENBQUNTLElBQVY7QUFFQTtBQUNBOztBQUVELFlBQUlKLEtBQUssR0FBRyxDQUFaO0FBQ0FULFFBQUFBLE9BQU8sQ0FBQ0osUUFBUixDQUFrQixlQUFsQjtBQUVBaEQsUUFBQUEsQ0FBQyxDQUFDWSxJQUFGLENBQVF1QyxNQUFNLENBQUNmLElBQVAsQ0FBYSw0QkFBYixDQUFSLEVBQXFELFlBQVc7QUFDL0QsY0FBTTBCLFdBQVcsR0FBRzlELENBQUMsQ0FBRSxJQUFGLENBQXJCO0FBQ0EsY0FBTWtFLEtBQUssR0FBU0osV0FBVyxDQUFDMUIsSUFBWixDQUFrQiwwQkFBbEIsRUFBK0N0QixJQUEvQyxDQUFxRCxPQUFyRCxDQUFwQjs7QUFFQSxjQUFLb0QsS0FBSyxDQUFDQyxRQUFOLEdBQWlCQyxXQUFqQixHQUErQkMsUUFBL0IsQ0FBeUNYLE9BQU8sQ0FBQ1UsV0FBUixFQUF6QyxDQUFMLEVBQXdFO0FBQ3ZFUCxZQUFBQSxLQUFLO0FBRUxDLFlBQUFBLFdBQVcsQ0FBQ2QsUUFBWixDQUFzQixpQkFBdEI7O0FBRUEsZ0JBQUtLLGdCQUFMLEVBQXdCO0FBQ3ZCLGtCQUFLUSxLQUFLLEdBQUdKLGNBQWIsRUFBOEI7QUFDN0JLLGdCQUFBQSxXQUFXLENBQUNkLFFBQVosQ0FBc0IsNEJBQXRCO0FBQ0EsZUFGRCxNQUVPO0FBQ05jLGdCQUFBQSxXQUFXLENBQUNmLFdBQVosQ0FBeUIsNEJBQXpCO0FBQ0E7QUFDRDtBQUNELFdBWkQsTUFZTztBQUNOZSxZQUFBQSxXQUFXLENBQUNmLFdBQVosQ0FBeUIsaUJBQXpCO0FBQ0E7QUFDRCxTQW5CRDs7QUFxQkEsWUFBS00sZ0JBQUwsRUFBd0I7QUFDdkIsY0FBS1EsS0FBSyxJQUFJSixjQUFkLEVBQStCO0FBQzlCRixZQUFBQSxlQUFlLENBQUNVLElBQWhCO0FBQ0EsV0FGRCxNQUVPO0FBQ05WLFlBQUFBLGVBQWUsQ0FBQ2UsSUFBaEI7QUFDQTtBQUNEOztBQUVELFlBQUssTUFBTVQsS0FBWCxFQUFtQjtBQUNsQkwsVUFBQUEsU0FBUyxDQUFDOUIsUUFBVixDQUFvQixNQUFwQixFQUE2QnNDLElBQTdCLENBQW1DTixPQUFuQztBQUNBRixVQUFBQSxTQUFTLENBQUNjLElBQVY7QUFDQSxTQUhELE1BR087QUFDTmQsVUFBQUEsU0FBUyxDQUFDOUIsUUFBVixDQUFvQixNQUFwQixFQUE2QnNDLElBQTdCLENBQW1DLEVBQW5DO0FBQ0FSLFVBQUFBLFNBQVMsQ0FBQ1MsSUFBVjtBQUNBO0FBQ0QsT0FoRkQ7QUFpRkEsS0FsTGE7QUFtTGRNLElBQUFBLHlCQUF5QixFQUFFLG1DQUFVQyxTQUFWLEVBQXNCO0FBQ2hELFVBQU1DLFVBQVUsR0FBR3pFLENBQUMsQ0FBRUQsWUFBWSxDQUFDMkUsbUJBQWYsQ0FBcEI7QUFDQSxVQUFNQyxRQUFRLEdBQUssMkJBQW5CO0FBQ0EsVUFBTUMsUUFBUSxHQUFLSixTQUFTLENBQUNwQyxJQUFWLENBQWdCdUMsUUFBaEIsRUFBMkJFLElBQTNCLEVBQW5CO0FBRUFyRSxNQUFBQSxLQUFLLENBQUM0QixJQUFOLENBQVl1QyxRQUFaLEVBQXVCL0QsSUFBdkIsQ0FBNkIsWUFBVztBQUN2QyxZQUFNUyxHQUFHLEdBQUdyQixDQUFDLENBQUUsSUFBRixDQUFiOztBQUVBLFlBQUssQ0FBRXlFLFVBQVUsQ0FBQ0ssR0FBWCxDQUFnQnpELEdBQWhCLEVBQXNCdUMsTUFBN0IsRUFBc0M7QUFDckN2QyxVQUFBQSxHQUFHLENBQUN3RCxJQUFKLENBQVVELFFBQVY7QUFDQTtBQUNELE9BTkQ7QUFPQSxLQS9MYTtBQWdNZEcsSUFBQUEsUUFBUSxFQUFFLG9CQUFXO0FBQ3BCLFVBQUssV0FBV2hGLFlBQVksQ0FBQ2lGLGFBQTdCLEVBQTZDO0FBQzVDO0FBQ0E7O0FBRUQsVUFBTUMsU0FBUyxHQUFHbEYsWUFBWSxDQUFDbUYsaUJBQS9CO0FBQ0EsVUFBTUMsUUFBUSxHQUFJcEYsWUFBWSxDQUFDcUYsU0FBL0I7QUFDQSxVQUFJQyxPQUFPLEdBQU8sS0FBbEI7O0FBRUEsVUFBSyxhQUFhSixTQUFiLElBQTBCRSxRQUEvQixFQUEwQztBQUN6Q0UsUUFBQUEsT0FBTyxHQUFHLElBQVY7QUFDQSxPQUZELE1BRU8sSUFBSyxjQUFjSixTQUFkLElBQTJCLENBQUVFLFFBQWxDLEVBQTZDO0FBQ25ERSxRQUFBQSxPQUFPLEdBQUcsSUFBVjtBQUNBLE9BRk0sTUFFQSxJQUFLLFdBQVdKLFNBQWhCLEVBQTRCO0FBQ2xDSSxRQUFBQSxPQUFPLEdBQUcsSUFBVjtBQUNBOztBQUVELFVBQUssQ0FBRUEsT0FBUCxFQUFpQjtBQUNoQjtBQUNBOztBQUVELFVBQUlDLGVBQUosRUFBcUJDLE1BQXJCOztBQUVBLFVBQUt4RixZQUFZLENBQUN5RixvQkFBbEIsRUFBeUM7QUFDeENGLFFBQUFBLGVBQWUsR0FBR25GLFFBQVEsQ0FBRUosWUFBWSxDQUFDeUYsb0JBQWYsQ0FBMUI7QUFDQTs7QUFFRCxVQUFJQyxTQUFKOztBQUVBLFVBQUt6RixDQUFDLENBQUVELFlBQVksQ0FBQzJFLG1CQUFmLENBQUQsQ0FBc0NkLE1BQTNDLEVBQW9EO0FBQ25ENkIsUUFBQUEsU0FBUyxHQUFHMUYsWUFBWSxDQUFDMkUsbUJBQXpCO0FBQ0EsT0FGRCxNQUVPLElBQUsxRSxDQUFDLENBQUVELFlBQVksQ0FBQzJGLG1CQUFmLENBQUQsQ0FBc0M5QixNQUEzQyxFQUFvRDtBQUMxRDZCLFFBQUFBLFNBQVMsR0FBRzFGLFlBQVksQ0FBQzJGLG1CQUF6QjtBQUNBOztBQUVELFVBQUssYUFBYTNGLFlBQVksQ0FBQ2lGLGFBQS9CLEVBQStDO0FBQzlDUyxRQUFBQSxTQUFTLEdBQUcxRixZQUFZLENBQUM0Riw0QkFBekI7QUFDQTs7QUFFRCxVQUFNbEIsVUFBVSxHQUFHekUsQ0FBQyxDQUFFeUYsU0FBRixDQUFwQjs7QUFFQSxVQUFLaEIsVUFBVSxDQUFDYixNQUFoQixFQUF5QjtBQUN4QjJCLFFBQUFBLE1BQU0sR0FBR2QsVUFBVSxDQUFDYyxNQUFYLEdBQW9CSyxHQUFwQixHQUEwQk4sZUFBbkM7O0FBRUEsWUFBS0MsTUFBTSxHQUFHLENBQWQsRUFBa0I7QUFDakJBLFVBQUFBLE1BQU0sR0FBRyxDQUFUO0FBQ0E7O0FBRUQsWUFBS3hGLFlBQVksQ0FBQzhGLHdCQUFsQixFQUE2QztBQUM1QzVGLFVBQUFBLE1BQU0sQ0FBQzhFLFFBQVAsQ0FBaUI7QUFBRWEsWUFBQUEsR0FBRyxFQUFFTDtBQUFQLFdBQWpCO0FBQ0EsU0FGRCxNQUVPO0FBQ052RixVQUFBQSxDQUFDLENBQUUsWUFBRixDQUFELENBQWtCOEYsSUFBbEIsR0FBeUJDLE9BQXpCLENBQ0M7QUFBRUMsWUFBQUEsU0FBUyxFQUFFVDtBQUFiLFdBREQsRUFFQ3hGLFlBQVksQ0FBQ2tHLG1CQUZkLEVBR0NsRyxZQUFZLENBQUNtRyxvQkFIZDtBQUtBO0FBQ0Q7QUFDRCxLQTFQYTtBQTJQZDtBQUNBQyxJQUFBQSxzQkFBc0IsRUFBRSxnQ0FBVUMsV0FBVixFQUF3QjtBQUMvQztBQUNBcEYsTUFBQUEsVUFBVSxHQUFHTixRQUFRLENBQUMyRixhQUF0QjtBQUVBN0YsTUFBQUEsS0FBSyxDQUFDNEIsSUFBTixDQUFZLGVBQVosRUFBOEJZLFFBQTlCLENBQXdDLFdBQXhDOztBQUVBLFVBQUssQ0FBRTFDLEtBQUYsSUFBVyxrQkFBa0JQLFlBQVksQ0FBQ3VHLGtCQUEvQyxFQUFvRTtBQUNuRXBGLFFBQUFBLEtBQUssQ0FBQzZELFFBQU47QUFDQTs7QUFFRHRFLE1BQUFBLFNBQVMsQ0FBQzhGLE9BQVYsQ0FBbUIsZ0NBQW5CLEVBQXFELENBQUVILFdBQUYsQ0FBckQ7QUFDQSxLQXZRYTtBQXdRZEksSUFBQUEscUJBQXFCLEVBQUUsaUNBQVc7QUFDakMsVUFBS3pHLFlBQVksQ0FBQzBHLFdBQWxCLEVBQWdDO0FBQy9CO0FBQ0F4RixRQUFBQSxjQUFjLENBQUN5RixPQUFmLENBQXdCLFVBQUFDLFFBQVEsRUFBSTtBQUNuQ0EsVUFBQUEsUUFBUSxDQUFDQyxPQUFUO0FBQ0EsU0FGRDtBQUdBM0YsUUFBQUEsY0FBYyxDQUFDMkMsTUFBZixHQUF3QixDQUF4QixDQUwrQixDQUtKO0FBQzNCO0FBQ0QsS0FoUmE7QUFpUmQ7QUFDQWlELElBQUFBLHNCQUFzQixFQUFFLGdDQUFVckMsU0FBVixFQUFxQjRCLFdBQXJCLEVBQW1DO0FBQzFENUYsTUFBQUEsS0FBSyxDQUFDNEIsSUFBTixDQUFZLGVBQVosRUFBOEJXLFdBQTlCLENBQTJDLFdBQTNDLEVBRDBELENBRzFEOztBQUNBN0IsTUFBQUEsS0FBSyxDQUFDc0YscUJBQU47QUFFQS9GLE1BQUFBLFNBQVMsQ0FBQzhGLE9BQVYsQ0FBbUIsZ0NBQW5CLEVBQXFELENBQUUvQixTQUFGLEVBQWE0QixXQUFiLENBQXJEO0FBQ0EsS0F6UmE7QUEwUmRVLElBQUFBLHFCQUFxQixFQUFFLCtCQUFVdEMsU0FBVixFQUFxQjRCLFdBQXJCLEVBQW1DO0FBQ3pEbEYsTUFBQUEsS0FBSyxDQUFDcUQseUJBQU4sQ0FBaUNDLFNBQWpDLEVBRHlELENBR3pEOztBQUNBLFVBQUt6RSxZQUFZLENBQUNnSCw2QkFBYixJQUE4QyxDQUFFaEgsWUFBWSxDQUFDcUYsU0FBbEUsRUFBOEU7QUFDN0UsWUFBSzFFLFFBQVEsQ0FBQ3NHLElBQVQsS0FBa0JoRyxVQUF2QixFQUFvQztBQUNuQyxjQUFLQSxVQUFVLENBQUNILEVBQWhCLEVBQXFCO0FBQ3BCYixZQUFBQSxDQUFDLFlBQU9nQixVQUFVLENBQUNILEVBQWxCLEVBQUQsQ0FBMkJvRyxLQUEzQjtBQUNBO0FBQ0Q7QUFDRCxPQVZ3RCxDQVl6RDs7O0FBQ0EvRixNQUFBQSxLQUFLLENBQUNnRyxJQUFOOztBQUVBLFVBQUssQ0FBRTVHLEtBQUYsSUFBVyxZQUFZUCxZQUFZLENBQUN1RyxrQkFBekMsRUFBOEQ7QUFDN0RwRixRQUFBQSxLQUFLLENBQUM2RCxRQUFOO0FBQ0EsT0FqQndELENBbUJ6RDs7O0FBQ0EvRSxNQUFBQSxDQUFDLENBQUVVLFFBQUYsQ0FBRCxDQUFjNkYsT0FBZCxDQUF1QixPQUF2QjtBQUNBdkcsTUFBQUEsQ0FBQyxDQUFFQyxNQUFGLENBQUQsQ0FBWXNHLE9BQVosQ0FBcUIsUUFBckI7QUFDQXZHLE1BQUFBLENBQUMsQ0FBRUMsTUFBRixDQUFELENBQVlzRyxPQUFaLENBQXFCLFFBQXJCOztBQUVBLFVBQUt4RyxZQUFZLENBQUNvSCxjQUFsQixFQUFtQztBQUNsQ0MsUUFBQUEsSUFBSSxDQUFFckgsWUFBWSxDQUFDb0gsY0FBZixDQUFKO0FBQ0E7O0FBRUQxRyxNQUFBQSxTQUFTLENBQUM4RixPQUFWLENBQW1CLCtCQUFuQixFQUFvRCxDQUFFL0IsU0FBRixFQUFhNEIsV0FBYixDQUFwRDtBQUNBLEtBdlRhO0FBd1RkaUIsSUFBQUEsY0FBYyxFQUFFLDBCQUFtQztBQUFBLFVBQXpCakIsV0FBeUIsdUVBQVgsUUFBVztBQUNsRGxGLE1BQUFBLEtBQUssQ0FBQ2lGLHNCQUFOLENBQThCQyxXQUE5QjtBQUVBcEcsTUFBQUEsQ0FBQyxDQUFDc0gsSUFBRixDQUFRO0FBQ1BDLFFBQUFBLEdBQUcsRUFBRXRILE1BQU0sQ0FBQ3VILFFBQVAsQ0FBZ0JDLElBRGQ7QUFFUEMsUUFBQUEsT0FBTyxFQUFFLGlCQUFVQyxRQUFWLEVBQXFCO0FBQzdCLGNBQU1uRCxTQUFTLEdBQUd4RSxDQUFDLENBQUUySCxRQUFGLENBQW5CO0FBRUF6RyxVQUFBQSxLQUFLLENBQUMyRixzQkFBTixDQUE4QnJDLFNBQTlCLEVBQXlDNEIsV0FBekM7QUFFQTtBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUNLLGNBQUtyRyxZQUFZLENBQUM2SCxxQkFBbEIsRUFBMEM7QUFDekNsSCxZQUFBQSxRQUFRLENBQUNtSCxLQUFULEdBQWlCckQsU0FBUyxDQUFDc0QsTUFBVixDQUFrQixPQUFsQixFQUE0QjlELElBQTVCLEVBQWpCO0FBQ0EsV0FaNEIsQ0FjN0I7OztBQWQ2QixxREFlWHJELFdBZlc7QUFBQTs7QUFBQTtBQUFBO0FBQUEsa0JBZWpCRSxFQWZpQjtBQWdCNUIsa0JBQU1rSCxVQUFVLEdBQUcsZUFBZWxILEVBQWYsR0FBb0IsSUFBdkM7QUFDQSxrQkFBTW1ILFNBQVMsR0FBSWhJLENBQUMsQ0FBRStILFVBQUYsQ0FBcEI7QUFDQSxrQkFBTTVFLE1BQU0sR0FBTzZFLFNBQVMsQ0FBQzVGLElBQVYsQ0FBZ0IscUJBQWhCLENBQW5COztBQUNBLGtCQUFNNkYsU0FBUyxHQUFJekQsU0FBUyxDQUFDcEMsSUFBVixDQUFnQjJGLFVBQWhCLENBQW5CLENBbkI0QixDQXFCNUI7OztBQUNBLGtCQUFLaEksWUFBWSxDQUFDbUksa0NBQWxCLEVBQXVEO0FBQ3RELG9CQUFLRixTQUFTLENBQUMxRSxRQUFWLENBQW9CLHlCQUFwQixDQUFMLEVBQXVEO0FBQ3REMEUsa0JBQUFBLFNBQVMsQ0FBQzVGLElBQVYsQ0FBZ0IsbUNBQWhCLEVBQXNEeEIsSUFBdEQsQ0FBNEQsWUFBVztBQUN0RSx3QkFBTVMsR0FBRyxHQUFHckIsQ0FBQyxDQUFFLElBQUYsQ0FBYjtBQUNBLHdCQUFNYSxFQUFFLEdBQUlRLEdBQUcsQ0FBQ1AsSUFBSixDQUFVLElBQVYsQ0FBWjtBQUVBLHdCQUFNcUgsY0FBYyx5REFBa0R0SCxFQUFsRCxRQUFwQixDQUpzRSxDQU10RTs7QUFDQSx3QkFBTVMsT0FBTyxHQUFHRCxHQUFHLENBQUNFLElBQUosQ0FBVSxjQUFWLE1BQStCLE1BQS9DOztBQUVBLHdCQUFLRCxPQUFMLEVBQWU7QUFDZDJHLHNCQUFBQSxTQUFTLENBQUM3RixJQUFWLENBQWdCK0YsY0FBaEIsRUFBaUM1RyxJQUFqQyxDQUF1QyxjQUF2QyxFQUF1RCxNQUF2RDs7QUFDQTBHLHNCQUFBQSxTQUFTLENBQUM3RixJQUFWLENBQWdCK0YsY0FBaEIsRUFBaUMxRyxPQUFqQyxDQUEwQyxJQUExQyxFQUFpREMsUUFBakQsQ0FBMkQsSUFBM0QsRUFBa0U0QyxJQUFsRTtBQUNBLHFCQUhELE1BR087QUFDTjJELHNCQUFBQSxTQUFTLENBQUM3RixJQUFWLENBQWdCK0YsY0FBaEIsRUFBaUM1RyxJQUFqQyxDQUF1QyxjQUF2QyxFQUF1RCxPQUF2RDs7QUFDQTBHLHNCQUFBQSxTQUFTLENBQUM3RixJQUFWLENBQWdCK0YsY0FBaEIsRUFBaUMxRyxPQUFqQyxDQUEwQyxJQUExQyxFQUFpREMsUUFBakQsQ0FBMkQsSUFBM0QsRUFBa0V1QyxJQUFsRTtBQUNBO0FBQ0QsbUJBaEJEO0FBaUJBO0FBQ0QsZUExQzJCLENBNEM1Qjs7O0FBQ0Esa0JBQUtsRSxZQUFZLENBQUNxSSx5QkFBbEIsRUFBOEM7QUFDN0Msb0JBQUtKLFNBQVMsQ0FBQzFFLFFBQVYsQ0FBb0IsZ0JBQXBCLENBQUwsRUFBOEM7QUFDN0Msc0JBQU1SLFlBQVksR0FBR2tGLFNBQVMsQ0FBQzVGLElBQVYsQ0FBZ0IscUJBQWhCLENBQXJCOztBQUVBLHNCQUFLVSxZQUFZLENBQUNRLFFBQWIsQ0FBdUIscUJBQXZCLENBQUwsRUFBc0Q7QUFDckQyRSxvQkFBQUEsU0FBUyxDQUFDN0YsSUFBVixDQUFnQixxQkFBaEIsRUFBd0NZLFFBQXhDLENBQWtELHFCQUFsRDs7QUFDQWlGLG9CQUFBQSxTQUFTLENBQUM3RixJQUFWLENBQWdCLDJCQUFoQixFQUE4Q2IsSUFBOUMsQ0FBb0QsY0FBcEQsRUFBb0UsTUFBcEU7QUFDQSxtQkFIRCxNQUdPO0FBQ04wRyxvQkFBQUEsU0FBUyxDQUFDN0YsSUFBVixDQUFnQixxQkFBaEIsRUFBd0NXLFdBQXhDLENBQXFELHFCQUFyRDs7QUFDQWtGLG9CQUFBQSxTQUFTLENBQUM3RixJQUFWLENBQWdCLDJCQUFoQixFQUE4Q2IsSUFBOUMsQ0FBb0QsY0FBcEQsRUFBb0UsT0FBcEU7QUFDQTtBQUNEO0FBQ0Q7O0FBRUQsa0JBQU04RyxLQUFLLEdBQUdKLFNBQVMsQ0FBQzdGLElBQVYsQ0FBZ0IscUJBQWhCLEVBQXdDeUMsSUFBeEMsRUFBZCxDQTNENEIsQ0E2RDVCOzs7QUFDQTFCLGNBQUFBLE1BQU0sQ0FBQzBCLElBQVAsQ0FBYXdELEtBQWI7QUFFQUwsY0FBQUEsU0FBUyxDQUFDekIsT0FBVixDQUFtQixzQkFBbkIsRUFBMkMsQ0FBRTBCLFNBQUYsQ0FBM0M7QUFoRTRCOztBQWU3QixnRUFBZ0M7QUFBQTtBQWtEL0IsYUFqRTRCLENBbUU3Qjs7QUFuRTZCO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBb0U3QnpILFVBQUFBLEtBQUssQ0FBQzRCLElBQU4sQ0FBWSw2Q0FBWixFQUE0RHhCLElBQTVELENBQWtFLFlBQVc7QUFDNUUsZ0JBQU1zQyxLQUFLLEdBQVFsRCxDQUFDLENBQUUsSUFBRixDQUFwQjtBQUNBLGdCQUFNK0gsVUFBVSxHQUFHLGVBQWU3RSxLQUFLLENBQUNwQyxJQUFOLENBQVksSUFBWixDQUFmLEdBQW9DLElBQXZEO0FBRUFvQyxZQUFBQSxLQUFLLENBQUMyQixJQUFOLENBQVlMLFNBQVMsQ0FBQ3BDLElBQVYsQ0FBZ0IyRixVQUFoQixFQUE2QmxELElBQTdCLEVBQVo7QUFDQSxXQUxELEVBcEU2QixDQTJFN0I7O0FBQ0EsY0FBTXlELGtCQUFrQixHQUFHOUQsU0FBUyxDQUFDcEMsSUFBVixDQUFnQnJDLFlBQVksQ0FBQzJFLG1CQUE3QixDQUEzQjtBQUNBLGNBQU02RCxrQkFBa0IsR0FBRy9ELFNBQVMsQ0FBQ3BDLElBQVYsQ0FBZ0JyQyxZQUFZLENBQUMyRixtQkFBN0IsQ0FBM0I7O0FBRUEsY0FBSzNGLFlBQVksQ0FBQzJFLG1CQUFiLEtBQXFDM0UsWUFBWSxDQUFDMkYsbUJBQXZELEVBQTZFO0FBQzVFMUYsWUFBQUEsQ0FBQyxDQUFFRCxZQUFZLENBQUMyRSxtQkFBZixDQUFELENBQXNDRyxJQUF0QyxDQUE0Q3lELGtCQUFrQixDQUFDekQsSUFBbkIsRUFBNUM7QUFDQSxXQUZELE1BRU87QUFDTixnQkFBSzdFLENBQUMsQ0FBRUQsWUFBWSxDQUFDMkYsbUJBQWYsQ0FBRCxDQUFzQzlCLE1BQTNDLEVBQW9EO0FBQ25ELGtCQUFLMEUsa0JBQWtCLENBQUMxRSxNQUF4QixFQUFpQztBQUNoQzVELGdCQUFBQSxDQUFDLENBQUVELFlBQVksQ0FBQzJGLG1CQUFmLENBQUQsQ0FBc0NiLElBQXRDLENBQTRDeUQsa0JBQWtCLENBQUN6RCxJQUFuQixFQUE1QztBQUNBLGVBRkQsTUFFTyxJQUFLMEQsa0JBQWtCLENBQUMzRSxNQUF4QixFQUFpQztBQUN2QzVELGdCQUFBQSxDQUFDLENBQUVELFlBQVksQ0FBQzJGLG1CQUFmLENBQUQsQ0FBc0NiLElBQXRDLENBQTRDMEQsa0JBQWtCLENBQUMxRCxJQUFuQixFQUE1QztBQUNBO0FBQ0QsYUFORCxNQU1PLElBQUs3RSxDQUFDLENBQUVELFlBQVksQ0FBQzJFLG1CQUFmLENBQUQsQ0FBc0NkLE1BQTNDLEVBQW9EO0FBQzFELGtCQUFLMEUsa0JBQWtCLENBQUMxRSxNQUF4QixFQUFpQztBQUNoQzVELGdCQUFBQSxDQUFDLENBQUVELFlBQVksQ0FBQzJFLG1CQUFmLENBQUQsQ0FBc0NHLElBQXRDLENBQTRDeUQsa0JBQWtCLENBQUN6RCxJQUFuQixFQUE1QztBQUNBLGVBRkQsTUFFTyxJQUFLMEQsa0JBQWtCLENBQUMzRSxNQUF4QixFQUFpQztBQUN2QzVELGdCQUFBQSxDQUFDLENBQUVELFlBQVksQ0FBQzJFLG1CQUFmLENBQUQsQ0FBc0NHLElBQXRDLENBQTRDMEQsa0JBQWtCLENBQUMxRCxJQUFuQixFQUE1QztBQUNBO0FBQ0Q7QUFDRDs7QUFFRDNELFVBQUFBLEtBQUssQ0FBQzRGLHFCQUFOLENBQTZCdEMsU0FBN0IsRUFBd0M0QixXQUF4QztBQUNBO0FBcEdNLE9BQVI7QUFzR0EsS0FqYWE7QUFrYWRvQyxJQUFBQSxhQUFhLEVBQUUsdUJBQVVqQixHQUFWLEVBQXdDO0FBQUEsVUFBekJuQixXQUF5Qix1RUFBWCxRQUFXOztBQUN0RCxVQUFLLENBQUVtQixHQUFQLEVBQWE7QUFDWjtBQUNBOztBQUVELFVBQU1rQixRQUFRLEdBQUdqQixRQUFRLENBQUNpQixRQUExQixDQUxzRCxDQU90RDs7QUFDQSxVQUFLLGdCQUFnQkEsUUFBckIsRUFBZ0M7QUFDL0JsQixRQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ21CLE9BQUosQ0FBYSx3QkFBYixFQUF1QyxrQkFBdkMsQ0FBTjtBQUNBOztBQUVELFVBQUszSSxZQUFZLENBQUM0SSxZQUFsQixFQUFpQztBQUNoQzFJLFFBQUFBLE1BQU0sQ0FBQ3VILFFBQVAsQ0FBZ0JDLElBQWhCLEdBQXVCRixHQUF2QjtBQUNBLE9BRkQsTUFFTztBQUNOcUIsUUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQW1CO0FBQUVDLFVBQUFBLEtBQUssRUFBRTtBQUFULFNBQW5CLEVBQW9DLEVBQXBDLEVBQXdDdkIsR0FBeEM7QUFFQXJHLFFBQUFBLEtBQUssQ0FBQ21HLGNBQU4sQ0FBc0JqQixXQUF0QjtBQUNBO0FBQ0QsS0FyYmE7QUFzYmQyQyxJQUFBQSx3QkFBd0IsRUFBRSxvQ0FBVztBQUNwQyxVQUFNQyxvQkFBb0IsR0FBRyxnRUFBN0I7QUFFQXhJLE1BQUFBLEtBQUssQ0FBQ3dCLEVBQU4sQ0FBVSxPQUFWLEVBQW1CZ0gsb0JBQW5CLEVBQXlDLFlBQVc7QUFDbkQsWUFBTUMsS0FBSyxHQUFHakosQ0FBQyxDQUFFLElBQUYsQ0FBZjtBQUVBLFlBQU1rSixZQUFZLEdBQVFELEtBQUssQ0FBQ3hILE9BQU4sQ0FBZSxxQkFBZixDQUExQjtBQUNBLFlBQU0wSCxhQUFhLEdBQU9ELFlBQVksQ0FBQzNILElBQWIsQ0FBbUIscUJBQW5CLENBQTFCO0FBQ0EsWUFBTTZILGFBQWEsR0FBT0MsVUFBVSxDQUFFSCxZQUFZLENBQUMzSCxJQUFiLENBQW1CLHNCQUFuQixDQUFGLENBQXBDO0FBQ0EsWUFBTStILGFBQWEsR0FBT0QsVUFBVSxDQUFFSCxZQUFZLENBQUMzSCxJQUFiLENBQW1CLHNCQUFuQixDQUFGLENBQXBDO0FBQ0EsWUFBTWdJLFdBQVcsR0FBU0YsVUFBVSxDQUFFSCxZQUFZLENBQUMzSCxJQUFiLENBQW1CLGdCQUFuQixDQUFGLENBQXBDO0FBQ0EsWUFBTWlJLFdBQVcsR0FBU0gsVUFBVSxDQUFFSCxZQUFZLENBQUMzSCxJQUFiLENBQW1CLGdCQUFuQixDQUFGLENBQXBDO0FBQ0EsWUFBTWtJLGFBQWEsR0FBT1AsWUFBWSxDQUFDM0gsSUFBYixDQUFtQixxQkFBbkIsQ0FBMUI7QUFDQSxZQUFNbUksaUJBQWlCLEdBQUdSLFlBQVksQ0FBQzNILElBQWIsQ0FBbUIseUJBQW5CLENBQTFCO0FBQ0EsWUFBTW9JLGdCQUFnQixHQUFJVCxZQUFZLENBQUMzSCxJQUFiLENBQW1CLHdCQUFuQixDQUExQixDQVhtRCxDQWFuRDs7QUFDQXFJLFFBQUFBLFlBQVksQ0FBRVgsS0FBSyxDQUFDbkksSUFBTixDQUFZLE9BQVosQ0FBRixDQUFaOztBQUVBLFlBQU0rSSxRQUFRLEdBQUcsU0FBWEEsUUFBVyxDQUFFQyxVQUFGLEVBQWtCO0FBQ2xDLGNBQUtYLGFBQUwsRUFBcUI7QUFDcEIsbUJBQU9ZLFlBQVksQ0FBRUQsVUFBRixFQUFjTCxhQUFkLEVBQTZCRSxnQkFBN0IsRUFBK0NELGlCQUEvQyxDQUFuQjtBQUNBOztBQUVELGlCQUFPSSxVQUFQO0FBQ0EsU0FORDs7QUFRQWIsUUFBQUEsS0FBSyxDQUFDbkksSUFBTixDQUFZLE9BQVosRUFBcUJrSixVQUFVLENBQUUsWUFBVztBQUMzQ2YsVUFBQUEsS0FBSyxDQUFDZ0IsVUFBTixDQUFrQixPQUFsQjtBQUVBLGNBQUlDLFFBQVEsR0FBR2IsVUFBVSxDQUFFSCxZQUFZLENBQUM5RyxJQUFiLENBQW1CLFlBQW5CLEVBQWtDdUIsR0FBbEMsRUFBRixDQUF6QjtBQUNBLGNBQUl3RyxRQUFRLEdBQUdkLFVBQVUsQ0FBRUgsWUFBWSxDQUFDOUcsSUFBYixDQUFtQixZQUFuQixFQUFrQ3VCLEdBQWxDLEVBQUYsQ0FBekIsQ0FKMkMsQ0FNM0M7O0FBQ0EsY0FBS3lHLEtBQUssQ0FBRUYsUUFBRixDQUFWLEVBQXlCO0FBQ3hCQSxZQUFBQSxRQUFRLEdBQUdkLGFBQVg7QUFFQUYsWUFBQUEsWUFBWSxDQUFDOUcsSUFBYixDQUFtQixZQUFuQixFQUFrQ3VCLEdBQWxDLENBQXVDa0csUUFBUSxDQUFFSyxRQUFGLENBQS9DO0FBQ0EsV0FKRCxNQUlPO0FBQ05oQixZQUFBQSxZQUFZLENBQUM5RyxJQUFiLENBQW1CLFlBQW5CLEVBQWtDdUIsR0FBbEMsQ0FBdUNrRyxRQUFRLENBQUVLLFFBQUYsQ0FBL0M7QUFDQSxXQWIwQyxDQWUzQzs7O0FBQ0EsY0FBS0UsS0FBSyxDQUFFRCxRQUFGLENBQVYsRUFBeUI7QUFDeEJBLFlBQUFBLFFBQVEsR0FBR2IsYUFBWDtBQUVBSixZQUFBQSxZQUFZLENBQUM5RyxJQUFiLENBQW1CLFlBQW5CLEVBQWtDdUIsR0FBbEMsQ0FBdUNrRyxRQUFRLENBQUVNLFFBQUYsQ0FBL0M7QUFDQSxXQUpELE1BSU87QUFDTmpCLFlBQUFBLFlBQVksQ0FBQzlHLElBQWIsQ0FBbUIsWUFBbkIsRUFBa0N1QixHQUFsQyxDQUF1Q2tHLFFBQVEsQ0FBRU0sUUFBRixDQUEvQztBQUNBLFdBdEIwQyxDQXdCM0M7OztBQUNBLGNBQUtELFFBQVEsR0FBR2QsYUFBaEIsRUFBZ0M7QUFDL0JjLFlBQUFBLFFBQVEsR0FBR2QsYUFBWDtBQUVBRixZQUFBQSxZQUFZLENBQUM5RyxJQUFiLENBQW1CLFlBQW5CLEVBQWtDdUIsR0FBbEMsQ0FBdUNrRyxRQUFRLENBQUVLLFFBQUYsQ0FBL0M7QUFDQSxXQTdCMEMsQ0ErQjNDOzs7QUFDQSxjQUFLQSxRQUFRLEdBQUdaLGFBQWhCLEVBQWdDO0FBQy9CWSxZQUFBQSxRQUFRLEdBQUdaLGFBQVg7QUFFQUosWUFBQUEsWUFBWSxDQUFDOUcsSUFBYixDQUFtQixZQUFuQixFQUFrQ3VCLEdBQWxDLENBQXVDa0csUUFBUSxDQUFFSyxRQUFGLENBQS9DO0FBQ0EsV0FwQzBDLENBc0MzQzs7O0FBQ0EsY0FBS0MsUUFBUSxHQUFHYixhQUFoQixFQUFnQztBQUMvQmEsWUFBQUEsUUFBUSxHQUFHYixhQUFYO0FBRUFKLFlBQUFBLFlBQVksQ0FBQzlHLElBQWIsQ0FBbUIsWUFBbkIsRUFBa0N1QixHQUFsQyxDQUF1Q2tHLFFBQVEsQ0FBRU0sUUFBRixDQUEvQztBQUNBLFdBM0MwQyxDQTZDM0M7OztBQUNBLGNBQUtELFFBQVEsR0FBR0MsUUFBaEIsRUFBMkI7QUFDMUJBLFlBQUFBLFFBQVEsR0FBR0QsUUFBWDtBQUVBaEIsWUFBQUEsWUFBWSxDQUFDOUcsSUFBYixDQUFtQixZQUFuQixFQUFrQ3VCLEdBQWxDLENBQXVDa0csUUFBUSxDQUFFTSxRQUFGLENBQS9DO0FBQ0EsV0FsRDBDLENBb0QzQzs7O0FBQ0EsY0FBS0QsUUFBUSxLQUFLWCxXQUFiLElBQTRCWSxRQUFRLEtBQUtYLFdBQTlDLEVBQTREO0FBQzNEO0FBQ0E7O0FBRUQsY0FBS1UsUUFBUSxLQUFLZCxhQUFiLElBQThCZSxRQUFRLEtBQUtiLGFBQWhELEVBQWdFO0FBQy9EO0FBQ0FwSSxZQUFBQSxLQUFLLENBQUNzSCxhQUFOLENBQXFCVSxZQUFZLENBQUNwSSxJQUFiLENBQW1CLGtCQUFuQixDQUFyQjtBQUNBLFdBSEQsTUFHTztBQUNOO0FBQ0EsZ0JBQU15RyxHQUFHLEdBQUcyQixZQUFZLENBQUNwSSxJQUFiLENBQW1CLEtBQW5CLEVBQTJCNEgsT0FBM0IsQ0FBb0MsS0FBcEMsRUFBMkN3QixRQUEzQyxFQUFzRHhCLE9BQXRELENBQStELEtBQS9ELEVBQXNFeUIsUUFBdEUsQ0FBWjtBQUNBakosWUFBQUEsS0FBSyxDQUFDc0gsYUFBTixDQUFxQmpCLEdBQXJCO0FBQ0E7QUFDRCxTQWpFOEIsRUFpRTVCbEgsS0FqRTRCLENBQS9CO0FBa0VBLE9BMUZEO0FBMkZBLEtBcGhCYTtBQXFoQmRnSyxJQUFBQSxzQkFBc0IsRUFBRSxrQ0FBVztBQUNsQzdKLE1BQUFBLEtBQUssQ0FBQ3dCLEVBQU4sQ0FBVSxRQUFWLEVBQW9CLCtCQUFwQixFQUFxRCxZQUFXO0FBQy9ELFlBQU1vQixPQUFPLEdBQUdwRCxDQUFDLENBQUUsSUFBRixDQUFELENBQVV5QixPQUFWLENBQW1CLG1CQUFuQixDQUFoQjtBQUNBLFlBQU02SSxPQUFPLEdBQUdsSCxPQUFPLENBQUN0QyxJQUFSLENBQWMsVUFBZCxDQUFoQjtBQUVBLFlBQUl5SixTQUFTLEdBQUcsRUFBaEIsQ0FKK0QsQ0FNL0Q7O0FBQ0FYLFFBQUFBLFlBQVksQ0FBRXhHLE9BQU8sQ0FBQ3RDLElBQVIsQ0FBYyxPQUFkLENBQUYsQ0FBWjs7QUFFQSxZQUFLd0osT0FBTCxFQUFlO0FBQ2QsY0FBTUUsSUFBSSxHQUFHcEgsT0FBTyxDQUFDaEIsSUFBUixDQUFjLGtCQUFkLEVBQW1DdUIsR0FBbkMsRUFBYjtBQUNBLGNBQU04RyxFQUFFLEdBQUtySCxPQUFPLENBQUNoQixJQUFSLENBQWMsZ0JBQWQsRUFBaUN1QixHQUFqQyxFQUFiOztBQUVBLGNBQUs2RyxJQUFJLElBQUlDLEVBQWIsRUFBa0I7QUFDakJGLFlBQUFBLFNBQVMsR0FBR25ILE9BQU8sQ0FBQ3RDLElBQVIsQ0FBYyxLQUFkLEVBQXNCNEgsT0FBdEIsQ0FBK0IsS0FBL0IsRUFBc0M4QixJQUF0QyxFQUE2QzlCLE9BQTdDLENBQXNELEtBQXRELEVBQTZEK0IsRUFBN0QsQ0FBWjtBQUNBLFdBRkQsTUFFTyxJQUFLLENBQUVELElBQUYsSUFBVSxDQUFFQyxFQUFqQixFQUFzQjtBQUM1QkYsWUFBQUEsU0FBUyxHQUFHbkgsT0FBTyxDQUFDdEMsSUFBUixDQUFjLGtCQUFkLENBQVo7QUFDQTtBQUNELFNBVEQsTUFTTztBQUNOLGNBQU0wSixLQUFJLEdBQUdwSCxPQUFPLENBQUNoQixJQUFSLENBQWMsa0JBQWQsRUFBbUN1QixHQUFuQyxFQUFiOztBQUVBLGNBQUs2RyxLQUFMLEVBQVk7QUFDWEQsWUFBQUEsU0FBUyxHQUFHbkgsT0FBTyxDQUFDdEMsSUFBUixDQUFjLEtBQWQsRUFBc0I0SCxPQUF0QixDQUErQixJQUEvQixFQUFxQzhCLEtBQXJDLENBQVo7QUFDQSxXQUZELE1BRU87QUFDTkQsWUFBQUEsU0FBUyxHQUFHbkgsT0FBTyxDQUFDdEMsSUFBUixDQUFjLGtCQUFkLENBQVo7QUFDQTtBQUNEOztBQUVELFlBQUt5SixTQUFMLEVBQWlCO0FBQ2hCbkgsVUFBQUEsT0FBTyxDQUFDdEMsSUFBUixDQUFjLE9BQWQsRUFBdUJrSixVQUFVLENBQUUsWUFBVztBQUM3QzVHLFlBQUFBLE9BQU8sQ0FBQzZHLFVBQVIsQ0FBb0IsT0FBcEI7QUFFQS9JLFlBQUFBLEtBQUssQ0FBQ3NILGFBQU4sQ0FBcUIrQixTQUFyQjtBQUNBLFdBSmdDLEVBSTlCbEssS0FKOEIsQ0FBakM7QUFLQTtBQUNELE9BbkNEO0FBb0NBLEtBMWpCYTtBQTJqQmRxSyxJQUFBQSxpQkFBaUIsRUFBRSw2QkFBVztBQUM3QixVQUFNQyxZQUFZLEdBQUcseUNBQ3BCLG1DQURvQixHQUVwQiw4Q0FGRDtBQUlBbkssTUFBQUEsS0FBSyxDQUFDd0IsRUFBTixDQUFVLFFBQVYsRUFBb0IySSxZQUFwQixFQUFrQyxZQUFXO0FBQzVDM0ssUUFBQUEsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVeUIsT0FBVixDQUFtQixvQkFBbkIsRUFBMENtSixXQUExQyxDQUF1RCxhQUF2RDtBQUVBMUosUUFBQUEsS0FBSyxDQUFDc0gsYUFBTixDQUFxQnhJLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVWMsSUFBVixDQUFnQixLQUFoQixDQUFyQjtBQUNBLE9BSkQ7QUFNQSxVQUFNK0osbUJBQW1CLEdBQUcseUJBQTVCO0FBRUFySyxNQUFBQSxLQUFLLENBQUN3QixFQUFOLENBQVUsUUFBVixFQUFvQjZJLG1CQUFtQixHQUFHLG9CQUExQyxFQUFnRSxZQUFXO0FBQzFFN0ssUUFBQUEsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVeUIsT0FBVixDQUFtQixvQkFBbkIsRUFBMENtSixXQUExQyxDQUF1RCxhQUF2RCxFQUQwRSxDQUcxRTs7QUFDQTVLLFFBQUFBLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FDRXlCLE9BREYsQ0FDV29KLG1CQURYLEVBRUV6SSxJQUZGLENBRVEsa0RBRlIsRUFHRTBJLEdBSEYsQ0FHTyxJQUhQLEVBSUVDLElBSkYsQ0FJUSxTQUpSLEVBSW1CLEtBSm5CLEVBS0V0SixPQUxGLENBS1csb0JBTFgsRUFNRXNCLFdBTkYsQ0FNZSxhQU5mO0FBUUE3QixRQUFBQSxLQUFLLENBQUNzSCxhQUFOLENBQXFCeEksQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVYyxJQUFWLENBQWdCLEtBQWhCLENBQXJCO0FBQ0EsT0FiRDtBQWNBLEtBdGxCYTtBQXVsQmRrSyxJQUFBQSxxQkFBcUIsRUFBRSxpQ0FBVztBQUNqQ3hLLE1BQUFBLEtBQUssQ0FBQ3dCLEVBQU4sQ0FBVSxRQUFWLEVBQW9CLGdDQUFwQixFQUFzRCxZQUFXO0FBQ2hFLFlBQU1pSixPQUFPLEdBQVVqTCxDQUFDLENBQUUsSUFBRixDQUF4QjtBQUNBLFlBQU1rTCxNQUFNLEdBQVdELE9BQU8sQ0FBQ3RILEdBQVIsRUFBdkI7QUFDQSxZQUFNd0gsU0FBUyxHQUFRRixPQUFPLENBQUNuSyxJQUFSLENBQWMsS0FBZCxDQUF2QjtBQUNBLFlBQU1zSyxjQUFjLEdBQUdILE9BQU8sQ0FBQ25LLElBQVIsQ0FBYyxrQkFBZCxDQUF2QjtBQUNBLFlBQUl5RyxHQUFKOztBQUVBLFlBQUsyRCxNQUFNLENBQUN0SCxNQUFaLEVBQXFCO0FBQ3BCMkQsVUFBQUEsR0FBRyxHQUFHNEQsU0FBUyxDQUFDekMsT0FBVixDQUFtQixJQUFuQixFQUF5QndDLE1BQU0sQ0FBQy9HLFFBQVAsRUFBekIsQ0FBTjtBQUNBLFNBRkQsTUFFTztBQUNOb0QsVUFBQUEsR0FBRyxHQUFHNkQsY0FBTjtBQUNBOztBQUVEbEssUUFBQUEsS0FBSyxDQUFDc0gsYUFBTixDQUFxQmpCLEdBQXJCO0FBQ0EsT0FkRDtBQWVBLEtBdm1CYTtBQXdtQmQ4RCxJQUFBQSxnQkFBZ0IsRUFBRSw0QkFBVztBQUM1QixVQUFLdEwsWUFBWSxDQUFDdUwsMEJBQWIsSUFBMkN2TCxZQUFZLENBQUN3TCxvQkFBN0QsRUFBb0Y7QUFDbkYsWUFBTTlHLFVBQVUsR0FBR3pFLENBQUMsQ0FBRUQsWUFBWSxDQUFDMkUsbUJBQWYsQ0FBcEI7O0FBQ0EsWUFBTThHLFVBQVUsR0FBR3pMLFlBQVksQ0FBQ3dMLG9CQUFiLENBQWtDRSxLQUFsQyxDQUF5QyxHQUF6QyxDQUFuQjs7QUFDQSxZQUFNQyxTQUFTLEdBQUksRUFBbkI7O0FBRUFGLFFBQUFBLFVBQVUsQ0FBQzlFLE9BQVgsQ0FBb0IsVUFBQS9CLFFBQVEsRUFBSTtBQUMvQixjQUFLQSxRQUFMLEVBQWdCO0FBQ2YrRyxZQUFBQSxTQUFTLENBQUMzSyxJQUFWLENBQWdCNEQsUUFBUSxHQUFHLElBQTNCO0FBQ0E7QUFDRCxTQUpEOztBQU1BLFlBQU1BLFFBQVEsR0FBRytHLFNBQVMsQ0FBQ0MsSUFBVixDQUFnQixHQUFoQixDQUFqQjs7QUFFQSxZQUFLbEgsVUFBVSxDQUFDYixNQUFoQixFQUF5QjtBQUN4QmEsVUFBQUEsVUFBVSxDQUFDekMsRUFBWCxDQUFlLE9BQWYsRUFBd0IyQyxRQUF4QixFQUFrQyxVQUFVMUMsQ0FBVixFQUFjO0FBQy9DQSxZQUFBQSxDQUFDLENBQUNVLGNBQUY7QUFFQSxnQkFBTThFLElBQUksR0FBR3pILENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVXVCLElBQVYsQ0FBZ0IsTUFBaEIsQ0FBYjtBQUVBTCxZQUFBQSxLQUFLLENBQUNzSCxhQUFOLENBQXFCZixJQUFyQixFQUEyQixVQUEzQjtBQUNBLFdBTkQ7QUFPQTtBQUNEO0FBQ0QsS0Fob0JhO0FBaW9CZG1FLElBQUFBLG9CQUFvQixFQUFFLGdDQUFXO0FBQ2hDLFVBQUssQ0FBRTdMLFlBQVksQ0FBQzhMLGVBQXBCLEVBQXNDO0FBQ3JDO0FBQ0FyTCxRQUFBQSxLQUFLLENBQUN3QixFQUFOLENBQVUsUUFBVixFQUFvQixzQ0FBcEIsRUFBNEQsWUFBVztBQUN0RWhDLFVBQUFBLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVXlCLE9BQVYsQ0FBbUIsTUFBbkIsRUFBNEI4RSxPQUE1QixDQUFxQyxRQUFyQztBQUNBLFNBRkQ7QUFJQTtBQUNBLE9BUitCLENBVWhDOzs7QUFDQS9GLE1BQUFBLEtBQUssQ0FBQ3dCLEVBQU4sQ0FBVSxRQUFWLEVBQW9CLHVCQUFwQixFQUE2QyxZQUFXO0FBQ3ZELGVBQU8sS0FBUDtBQUNBLE9BRkQsRUFYZ0MsQ0FlaEM7O0FBQ0F4QixNQUFBQSxLQUFLLENBQUN3QixFQUFOLENBQVUsUUFBVixFQUFvQixzQ0FBcEIsRUFBNEQsWUFBVztBQUN0RSxZQUFNOEosS0FBSyxHQUFHOUwsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVMkQsR0FBVixFQUFkO0FBRUEsWUFBTTRELEdBQUcsR0FBRyxJQUFJd0UsR0FBSixDQUFTOUwsTUFBTSxDQUFDdUgsUUFBaEIsQ0FBWjtBQUNBRCxRQUFBQSxHQUFHLENBQUN5RSxZQUFKLENBQWlCQyxHQUFqQixDQUFzQixTQUF0QixFQUFpQ0gsS0FBakM7QUFFQTVLLFFBQUFBLEtBQUssQ0FBQ3NILGFBQU4sQ0FBcUIwRCxhQUFhLENBQUUzRSxHQUFHLENBQUNFLElBQU4sQ0FBbEM7QUFFQSxlQUFPLEtBQVA7QUFDQSxPQVREO0FBVUEsS0EzcEJhO0FBNHBCZDBFLElBQUFBLGlCQUFpQixFQUFFLDZCQUFXO0FBQzdCM0wsTUFBQUEsS0FBSyxDQUFDd0IsRUFBTixDQUFVLE9BQVYsRUFBbUIseUJBQW5CLEVBQThDLFVBQVVDLENBQVYsRUFBYztBQUMzREEsUUFBQUEsQ0FBQyxDQUFDQyxlQUFGO0FBRUFoQixRQUFBQSxLQUFLLENBQUNzSCxhQUFOLENBQXFCeEksQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVdUIsSUFBVixDQUFnQix1QkFBaEIsQ0FBckI7QUFDQSxPQUpEO0FBS0EsS0FscUJhO0FBbXFCZDZLLElBQUFBLG1CQUFtQixFQUFFLCtCQUFXO0FBQy9CO0FBQ0EsVUFBSyxlQUFlLE9BQU9DLEtBQTNCLEVBQW1DO0FBQ2xDO0FBQ0E7O0FBRUQsVUFBSyxDQUFFdE0sWUFBWSxDQUFDMEcsV0FBcEIsRUFBa0M7QUFDakM7QUFDQSxPQVI4QixDQVUvQjs7O0FBQ0E0RixNQUFBQSxLQUFLLENBQUUsdUJBQUYsRUFBMkI7QUFDL0JDLFFBQUFBLFNBQVMsRUFBRSxLQURvQjtBQUUvQkMsUUFBQUEsT0FGK0IsbUJBRXRCQyxTQUZzQixFQUVWO0FBQ3BCLGlCQUFPQSxTQUFTLENBQUNDLFlBQVYsQ0FBd0IsY0FBeEIsQ0FBUDtBQUNBLFNBSjhCO0FBSy9CQyxRQUFBQSxTQUFTLEVBQUU7QUFMb0IsT0FBM0IsQ0FBTDtBQU9BLEtBcnJCYTtBQXNyQmRDLElBQUFBLFlBQVksRUFBRSx3QkFBVztBQUN4QixVQUFLLENBQUVDLE1BQU0sR0FBR0MsV0FBaEIsRUFBOEI7QUFDN0I7QUFDQTs7QUFFRCxVQUFNQyxjQUFjLEdBQUcsU0FBakJBLGNBQWlCLENBQUU5SSxJQUFGLEVBQVFsRCxJQUFSLEVBQWtCO0FBQ3hDLGVBQU8sQ0FDTixXQUFXa0QsSUFBWCxHQUFrQixTQURaLEVBRU4sK0JBQStCbEQsSUFBSSxDQUFFLGFBQUYsQ0FBbkMsR0FBdUQsU0FGakQsRUFHTDZLLElBSEssQ0FHQyxFQUhELENBQVA7QUFJQSxPQUxEOztBQU9BLFVBQU1vQixpQkFBaUIsR0FBRyxTQUFwQkEsaUJBQW9CLENBQUUvSSxJQUFGLEVBQVFsRCxJQUFSLEVBQWtCO0FBQzNDLGVBQU8sQ0FDTiw4QkFBOEJBLElBQUksQ0FBQ2tNLEtBQW5DLEdBQTJDLElBQTNDLEdBQWtEaEosSUFBbEQsR0FBeUQsU0FEbkQsRUFFTiwwQ0FBMENsRCxJQUFJLENBQUNrTSxLQUEvQyxHQUF1RCxJQUF2RCxHQUE4RGxNLElBQUksQ0FBRSxhQUFGLENBQWxFLEdBQXNGLFNBRmhGLEVBR0w2SyxJQUhLLENBR0MsRUFIRCxDQUFQO0FBSUEsT0FMRDs7QUFPQSxVQUFNc0IsUUFBUSxHQUFHO0FBQ2hCQyxRQUFBQSxzQkFBc0IsRUFBRSxJQURSO0FBRWhCQyxRQUFBQSxzQkFBc0IsRUFBRSxJQUZSO0FBR2hCQyxRQUFBQSxlQUFlLEVBQUVyTixZQUFZLENBQUNzTixzQkFIZDtBQUloQkMsUUFBQUEsaUJBQWlCLEVBQUV2TixZQUFZLENBQUN3Tix3QkFKaEI7QUFLaEJDLFFBQUFBLGVBQWUsRUFBRSxJQUxEO0FBS087QUFDdkJDLFFBQUFBLGdCQUFnQixFQUFFLElBTkYsQ0FNUTs7QUFOUixPQUFqQjs7QUFTQSxVQUFLMU4sWUFBWSxDQUFDMk4sTUFBbEIsRUFBMkI7QUFDMUJULFFBQUFBLFFBQVEsQ0FBRSxLQUFGLENBQVIsR0FBb0IsSUFBcEI7QUFDQTs7QUFFRHpNLE1BQUFBLEtBQUssQ0FBQzRCLElBQU4sQ0FBWSxlQUFaLEVBQThCeEIsSUFBOUIsQ0FBb0MsWUFBVztBQUM5QyxZQUFNK00sS0FBSyxHQUFLM04sQ0FBQyxDQUFFLElBQUYsQ0FBakI7O0FBQ0EsWUFBTTROLE9BQU8scUJBQVFYLFFBQVIsQ0FBYixDQUY4QyxDQUk5Qzs7O0FBQ0EsWUFBS1UsS0FBSyxDQUFDckssUUFBTixDQUFnQixlQUFoQixDQUFMLEVBQXlDO0FBQ3hDc0ssVUFBQUEsT0FBTyxDQUFFLDBCQUFGLENBQVAsR0FBd0MsSUFBeEM7QUFDQSxTQUZELE1BRU87QUFDTkEsVUFBQUEsT0FBTyxDQUFFLDBCQUFGLENBQVAsR0FBd0M3TixZQUFZLENBQUM4TiwrQkFBckQ7QUFDQSxTQVQ2QyxDQVc5Qzs7O0FBQ0EsWUFBS0YsS0FBSyxDQUFDckssUUFBTixDQUFnQixZQUFoQixDQUFMLEVBQXNDO0FBQ3JDc0ssVUFBQUEsT0FBTyxDQUFFLGdCQUFGLENBQVAsR0FBaUNkLGNBQWpDO0FBQ0FjLFVBQUFBLE9BQU8sQ0FBRSxtQkFBRixDQUFQLEdBQWlDYixpQkFBakM7QUFDQSxTQWY2QyxDQWlCOUM7OztBQUNBLFlBQUssQ0FBRVksS0FBSyxDQUFDN00sSUFBTixDQUFZLGVBQVosQ0FBUCxFQUF1QztBQUN0QzhNLFVBQUFBLE9BQU8sQ0FBRSxnQkFBRixDQUFQLEdBQThCLElBQTlCO0FBQ0E7O0FBRURELFFBQUFBLEtBQUssQ0FBQ2QsV0FBTixDQUFtQmUsT0FBbkI7QUFDQSxPQXZCRCxFQWhDd0IsQ0F5RHhCOztBQUNBLFVBQUs3TixZQUFZLENBQUMrTix3QkFBbEIsRUFBNkM7QUFDNUMsWUFBSUMsYUFBYSxHQUFHLElBQXBCOztBQUVBLFlBQUtoTyxZQUFZLENBQUNpTyw2QkFBbEIsRUFBa0Q7QUFDakRELFVBQUFBLGFBQWEsR0FBRyxLQUFoQjtBQUNBOztBQUVELFlBQU1ILE9BQU8scUJBQVFYLFFBQVIsQ0FBYjs7QUFFQVcsUUFBQUEsT0FBTyxDQUFFLGdCQUFGLENBQVAsR0FBOEJHLGFBQTlCO0FBRUF2TixRQUFBQSxLQUFLLENBQUM0QixJQUFOLENBQVksc0NBQVosRUFBcUR5SyxXQUFyRCxDQUFrRWUsT0FBbEU7QUFDQTtBQUNELEtBN3ZCYTtBQTh2QmRLLElBQUFBLGVBQWUsRUFBRSwyQkFBVztBQUMzQixVQUFLLGdCQUFnQixPQUFPQyxVQUE1QixFQUF5QztBQUN4QztBQUNBOztBQUVEMU4sTUFBQUEsS0FBSyxDQUFDNEIsSUFBTixDQUFZLHFCQUFaLEVBQW9DeEIsSUFBcEMsQ0FBMEMsWUFBVztBQUNwRCxZQUFNcUksS0FBSyxHQUFLakosQ0FBQyxDQUFFLElBQUYsQ0FBakI7QUFDQSxZQUFNbU8sT0FBTyxHQUFHbEYsS0FBSyxDQUFDN0csSUFBTixDQUFZLG9CQUFaLENBQWhCO0FBRUEsWUFBTWdNLFFBQVEsR0FBWUQsT0FBTyxDQUFDNU0sSUFBUixDQUFjLElBQWQsQ0FBMUI7QUFDQSxZQUFNOE0sZUFBZSxHQUFLcEYsS0FBSyxDQUFDMUgsSUFBTixDQUFZLHdCQUFaLENBQTFCO0FBQ0EsWUFBTTRILGFBQWEsR0FBT0YsS0FBSyxDQUFDMUgsSUFBTixDQUFZLHFCQUFaLENBQTFCO0FBQ0EsWUFBTTZILGFBQWEsR0FBT0MsVUFBVSxDQUFFSixLQUFLLENBQUMxSCxJQUFOLENBQVksc0JBQVosQ0FBRixDQUFwQztBQUNBLFlBQU0rSCxhQUFhLEdBQU9ELFVBQVUsQ0FBRUosS0FBSyxDQUFDMUgsSUFBTixDQUFZLHNCQUFaLENBQUYsQ0FBcEM7QUFDQSxZQUFNK00sSUFBSSxHQUFnQmpGLFVBQVUsQ0FBRUosS0FBSyxDQUFDMUgsSUFBTixDQUFZLFdBQVosQ0FBRixDQUFwQztBQUNBLFlBQU1rSSxhQUFhLEdBQU9SLEtBQUssQ0FBQzFILElBQU4sQ0FBWSxxQkFBWixDQUExQjtBQUNBLFlBQU1tSSxpQkFBaUIsR0FBR1QsS0FBSyxDQUFDMUgsSUFBTixDQUFZLHlCQUFaLENBQTFCO0FBQ0EsWUFBTW9JLGdCQUFnQixHQUFJVixLQUFLLENBQUMxSCxJQUFOLENBQVksd0JBQVosQ0FBMUI7QUFDQSxZQUFNMkksUUFBUSxHQUFZYixVQUFVLENBQUVKLEtBQUssQ0FBQzFILElBQU4sQ0FBWSxnQkFBWixDQUFGLENBQXBDO0FBQ0EsWUFBTTRJLFFBQVEsR0FBWWQsVUFBVSxDQUFFSixLQUFLLENBQUMxSCxJQUFOLENBQVksZ0JBQVosQ0FBRixDQUFwQztBQUNBLFlBQU1nTixTQUFTLEdBQVd0RixLQUFLLENBQUM3RyxJQUFOLENBQVksWUFBWixDQUExQjtBQUNBLFlBQU1vTSxTQUFTLEdBQVd2RixLQUFLLENBQUM3RyxJQUFOLENBQVksWUFBWixDQUExQjtBQUVBLFlBQU1xTSxNQUFNLEdBQUcvTixRQUFRLENBQUNnTyxjQUFULENBQXlCTixRQUF6QixDQUFmO0FBRUFGLFFBQUFBLFVBQVUsQ0FBQ1MsTUFBWCxDQUFtQkYsTUFBbkIsRUFBMkI7QUFDMUJHLFVBQUFBLEtBQUssRUFBRSxDQUFFMUUsUUFBRixFQUFZQyxRQUFaLENBRG1CO0FBRTFCbUUsVUFBQUEsSUFBSSxFQUFKQSxJQUYwQjtBQUcxQk8sVUFBQUEsT0FBTyxFQUFFLElBSGlCO0FBSTFCQyxVQUFBQSxTQUFTLEVBQUUsYUFKZTtBQUsxQkMsVUFBQUEsS0FBSyxFQUFFO0FBQ04sbUJBQU8zRixhQUREO0FBRU4sbUJBQU9FO0FBRkQ7QUFMbUIsU0FBM0I7QUFXQW1GLFFBQUFBLE1BQU0sQ0FBQ1AsVUFBUCxDQUFrQmxNLEVBQWxCLENBQXNCLFFBQXRCLEVBQWdDLFVBQVVrSixNQUFWLEVBQW1CO0FBQ2xELGNBQUloQixRQUFKO0FBQ0EsY0FBSUMsUUFBSjs7QUFFQSxjQUFLaEIsYUFBTCxFQUFxQjtBQUNwQmUsWUFBQUEsUUFBUSxHQUFHSCxZQUFZLENBQUVtQixNQUFNLENBQUUsQ0FBRixDQUFSLEVBQWV6QixhQUFmLEVBQThCRSxnQkFBOUIsRUFBZ0RELGlCQUFoRCxDQUF2QjtBQUNBUyxZQUFBQSxRQUFRLEdBQUdKLFlBQVksQ0FBRW1CLE1BQU0sQ0FBRSxDQUFGLENBQVIsRUFBZXpCLGFBQWYsRUFBOEJFLGdCQUE5QixFQUFnREQsaUJBQWhELENBQXZCO0FBQ0EsV0FIRCxNQUdPO0FBQ05RLFlBQUFBLFFBQVEsR0FBR2IsVUFBVSxDQUFFNkIsTUFBTSxDQUFFLENBQUYsQ0FBUixDQUFyQjtBQUNBZixZQUFBQSxRQUFRLEdBQUdkLFVBQVUsQ0FBRTZCLE1BQU0sQ0FBRSxDQUFGLENBQVIsQ0FBckI7QUFDQTs7QUFFRCxjQUFLLGlCQUFpQm1ELGVBQXRCLEVBQXdDO0FBQ3ZDRSxZQUFBQSxTQUFTLENBQUMxSixJQUFWLENBQWdCcUYsUUFBaEI7QUFDQXNFLFlBQUFBLFNBQVMsQ0FBQzNKLElBQVYsQ0FBZ0JzRixRQUFoQjtBQUNBLFdBSEQsTUFHTztBQUNOb0UsWUFBQUEsU0FBUyxDQUFDNUssR0FBVixDQUFldUcsUUFBZjtBQUNBc0UsWUFBQUEsU0FBUyxDQUFDN0ssR0FBVixDQUFld0csUUFBZjtBQUNBO0FBQ0QsU0FuQkQ7O0FBcUJBLGlCQUFTNkUsK0JBQVQsQ0FBMEM5RCxNQUExQyxFQUFtRDtBQUNsRCxjQUFNK0QsU0FBUyxHQUFHNUYsVUFBVSxDQUFFNkIsTUFBTSxDQUFFLENBQUYsQ0FBUixDQUE1Qjs7QUFDQSxjQUFNZ0UsU0FBUyxHQUFHN0YsVUFBVSxDQUFFNkIsTUFBTSxDQUFFLENBQUYsQ0FBUixDQUE1QixDQUZrRCxDQUlsRDs7O0FBQ0EsY0FBSytELFNBQVMsS0FBSy9FLFFBQWQsSUFBMEJnRixTQUFTLEtBQUsvRSxRQUE3QyxFQUF3RDtBQUN2RDtBQUNBOztBQUVELGNBQUs4RSxTQUFTLEtBQUs3RixhQUFkLElBQStCOEYsU0FBUyxLQUFLNUYsYUFBbEQsRUFBa0U7QUFDakU7QUFDQXBJLFlBQUFBLEtBQUssQ0FBQ3NILGFBQU4sQ0FBcUJTLEtBQUssQ0FBQ25JLElBQU4sQ0FBWSxrQkFBWixDQUFyQjtBQUNBLFdBSEQsTUFHTztBQUNOO0FBQ0EsZ0JBQU15RyxHQUFHLEdBQUcwQixLQUFLLENBQUNuSSxJQUFOLENBQVksS0FBWixFQUFvQjRILE9BQXBCLENBQTZCLEtBQTdCLEVBQW9DdUcsU0FBcEMsRUFBZ0R2RyxPQUFoRCxDQUF5RCxLQUF6RCxFQUFnRXdHLFNBQWhFLENBQVo7QUFDQWhPLFlBQUFBLEtBQUssQ0FBQ3NILGFBQU4sQ0FBcUJqQixHQUFyQjtBQUNBO0FBQ0Q7O0FBRURrSCxRQUFBQSxNQUFNLENBQUNQLFVBQVAsQ0FBa0JsTSxFQUFsQixDQUFzQixRQUF0QixFQUFnQyxVQUFVa0osTUFBVixFQUFtQjtBQUNsRDtBQUNBdEIsVUFBQUEsWUFBWSxDQUFFWCxLQUFLLENBQUNuSSxJQUFOLENBQVksT0FBWixDQUFGLENBQVo7QUFFQW1JLFVBQUFBLEtBQUssQ0FBQ25JLElBQU4sQ0FBWSxPQUFaLEVBQXFCa0osVUFBVSxDQUFFLFlBQVc7QUFDM0NmLFlBQUFBLEtBQUssQ0FBQ2dCLFVBQU4sQ0FBa0IsT0FBbEI7QUFFQStFLFlBQUFBLCtCQUErQixDQUFFOUQsTUFBRixDQUEvQjtBQUNBLFdBSjhCLEVBSTVCN0ssS0FKNEIsQ0FBL0I7QUFLQSxTQVREO0FBV0FrTyxRQUFBQSxTQUFTLENBQUN2TSxFQUFWLENBQWMsT0FBZCxFQUF1QixZQUFXO0FBQ2pDLGNBQU1tTixNQUFNLEdBQUduUCxDQUFDLENBQUUsSUFBRixDQUFoQixDQURpQyxDQUdqQzs7QUFDQTRKLFVBQUFBLFlBQVksQ0FBRXVGLE1BQU0sQ0FBQ3JPLElBQVAsQ0FBYSxPQUFiLENBQUYsQ0FBWjtBQUVBcU8sVUFBQUEsTUFBTSxDQUFDck8sSUFBUCxDQUFhLE9BQWIsRUFBc0JrSixVQUFVLENBQUUsWUFBVztBQUM1Q21GLFlBQUFBLE1BQU0sQ0FBQ2xGLFVBQVAsQ0FBbUIsT0FBbkI7QUFFQSxnQkFBTUMsUUFBUSxHQUFHaUYsTUFBTSxDQUFDeEwsR0FBUCxFQUFqQjtBQUVBOEssWUFBQUEsTUFBTSxDQUFDUCxVQUFQLENBQWtCakMsR0FBbEIsQ0FBdUIsQ0FBRS9CLFFBQUYsRUFBWSxJQUFaLENBQXZCO0FBRUE4RSxZQUFBQSwrQkFBK0IsQ0FBRVAsTUFBTSxDQUFDUCxVQUFQLENBQWtCa0IsR0FBbEIsRUFBRixDQUEvQjtBQUNBLFdBUitCLEVBUTdCL08sS0FSNkIsQ0FBaEM7QUFTQSxTQWZEO0FBaUJBbU8sUUFBQUEsU0FBUyxDQUFDeE0sRUFBVixDQUFjLE9BQWQsRUFBdUIsWUFBVztBQUNqQyxjQUFNbU4sTUFBTSxHQUFHblAsQ0FBQyxDQUFFLElBQUYsQ0FBaEIsQ0FEaUMsQ0FHakM7O0FBQ0E0SixVQUFBQSxZQUFZLENBQUV1RixNQUFNLENBQUNyTyxJQUFQLENBQWEsT0FBYixDQUFGLENBQVo7QUFFQXFPLFVBQUFBLE1BQU0sQ0FBQ3JPLElBQVAsQ0FBYSxPQUFiLEVBQXNCa0osVUFBVSxDQUFFLFlBQVc7QUFDNUNtRixZQUFBQSxNQUFNLENBQUNsRixVQUFQLENBQW1CLE9BQW5CO0FBRUEsZ0JBQU1FLFFBQVEsR0FBR2dGLE1BQU0sQ0FBQ3hMLEdBQVAsRUFBakI7QUFFQThLLFlBQUFBLE1BQU0sQ0FBQ1AsVUFBUCxDQUFrQmpDLEdBQWxCLENBQXVCLENBQUUsSUFBRixFQUFROUIsUUFBUixDQUF2QjtBQUVBNkUsWUFBQUEsK0JBQStCLENBQUVQLE1BQU0sQ0FBQ1AsVUFBUCxDQUFrQmtCLEdBQWxCLEVBQUYsQ0FBL0I7QUFDQSxXQVIrQixFQVE3Qi9PLEtBUjZCLENBQWhDO0FBU0EsU0FmRDtBQWdCQSxPQW5IRDtBQW9IQSxLQXYzQmE7QUF3M0JkZ1AsSUFBQUEsY0FBYyxFQUFFLDBCQUFXO0FBQzFCLFVBQUssQ0FBRXpDLE1BQU0sR0FBRzBDLFVBQWhCLEVBQTZCO0FBQzVCO0FBQ0E7O0FBRUQsVUFBTUMsZ0JBQWdCLEdBQUcvTyxLQUFLLENBQUM0QixJQUFOLENBQVksbUJBQVosQ0FBekI7QUFFQSxVQUFNb04sTUFBTSxHQUFVRCxnQkFBZ0IsQ0FBQ2hPLElBQWpCLENBQXVCLGtCQUF2QixDQUF0QjtBQUNBLFVBQU1rTyxZQUFZLEdBQUlGLGdCQUFnQixDQUFDaE8sSUFBakIsQ0FBdUIsZ0NBQXZCLENBQXRCO0FBQ0EsVUFBTW1PLGFBQWEsR0FBR0gsZ0JBQWdCLENBQUNoTyxJQUFqQixDQUF1QixpQ0FBdkIsQ0FBdEI7QUFFQSxVQUFNb08sS0FBSyxHQUFHSixnQkFBZ0IsQ0FBQ25OLElBQWpCLENBQXVCLGtCQUF2QixDQUFkO0FBQ0EsVUFBTXdOLEdBQUcsR0FBS0wsZ0JBQWdCLENBQUNuTixJQUFqQixDQUF1QixnQkFBdkIsQ0FBZDtBQUVBdU4sTUFBQUEsS0FBSyxDQUFDTCxVQUFOLENBQWtCO0FBQ2pCTyxRQUFBQSxVQUFVLEVBQUVMLE1BREs7QUFFakJNLFFBQUFBLFVBQVUsRUFBRUwsWUFGSztBQUdqQk0sUUFBQUEsV0FBVyxFQUFFTDtBQUhJLE9BQWxCO0FBTUFFLE1BQUFBLEdBQUcsQ0FBQ04sVUFBSixDQUFnQjtBQUNmTyxRQUFBQSxVQUFVLEVBQUVMLE1BREc7QUFFZk0sUUFBQUEsVUFBVSxFQUFFTCxZQUZHO0FBR2ZNLFFBQUFBLFdBQVcsRUFBRUw7QUFIRSxPQUFoQjtBQUtBLEtBajVCYTtBQWs1QmRNLElBQUFBLHVCQUF1QixFQUFFLG1DQUFXO0FBQ25DO0FBQ0EsVUFBSyxlQUFlLE9BQU8zRCxLQUEzQixFQUFtQztBQUNsQztBQUNBOztBQUVELFVBQUssQ0FBRXRNLFlBQVksQ0FBQzBHLFdBQXBCLEVBQWtDO0FBQ2pDO0FBQ0E7O0FBRUQsVUFBTXdKLGdCQUFnQixHQUFHLENBQUUsS0FBRixFQUFTLE9BQVQsRUFBa0IsUUFBbEIsRUFBNEIsTUFBNUIsQ0FBekI7QUFFQUEsTUFBQUEsZ0JBQWdCLENBQUN2SixPQUFqQixDQUEwQixVQUFVd0osZUFBVixFQUE0QjtBQUNyRCxZQUFNQyxVQUFVLEdBQUcsd0JBQXdCRCxlQUEzQyxDQURxRCxDQUdyRDs7QUFDQSxZQUFNRSxTQUFTLEdBQUcvRCxLQUFLLENBQUUsTUFBTThELFVBQU4sR0FBbUIsR0FBckIsRUFBMEI7QUFDaEQ3RCxVQUFBQSxTQUFTLEVBQUU0RCxlQURxQztBQUVoRDNELFVBQUFBLE9BRmdELG1CQUV2Q0MsU0FGdUMsRUFFM0I7QUFDcEIsbUJBQU9BLFNBQVMsQ0FBQ0MsWUFBVixDQUF3QjBELFVBQXhCLENBQVA7QUFDQSxXQUorQztBQUtoRHpELFVBQUFBLFNBQVMsRUFBRTtBQUxxQyxTQUExQixDQUF2QjtBQVFBek0sUUFBQUEsTUFBTSxDQUFDZ0IsY0FBUCxHQUF3QkEsY0FBYyxDQUFDb1AsTUFBZixDQUF1QkQsU0FBdkIsQ0FBeEI7QUFDQSxPQWJEO0FBY0EsS0E1NkJhO0FBNjZCZGxKLElBQUFBLElBQUksRUFBRSxnQkFBVztBQUNoQmhHLE1BQUFBLEtBQUssQ0FBQ3lMLFlBQU47QUFDQXpMLE1BQUFBLEtBQUssQ0FBQytNLGVBQU47QUFDQS9NLE1BQUFBLEtBQUssQ0FBQ21PLGNBQU47QUFDQW5PLE1BQUFBLEtBQUssQ0FBQzhPLHVCQUFOO0FBQ0EsS0FsN0JhO0FBbTdCZE0sSUFBQUEsWUFBWSxFQUFFLHdCQUFXO0FBQ3hCLFVBQUt2USxZQUFZLENBQUN3USxjQUFiLElBQStCeFEsWUFBWSxDQUFDeVEsV0FBakQsRUFBK0Q7QUFDOUQ1SCxRQUFBQSxPQUFPLENBQUM2SCxZQUFSLENBQXNCO0FBQUUzSCxVQUFBQSxLQUFLLEVBQUU7QUFBVCxTQUF0QixFQUF1QyxFQUF2QyxFQUEyQzdJLE1BQU0sQ0FBQ3VILFFBQWxELEVBRDhELENBRzlEOztBQUNBdkgsUUFBQUEsTUFBTSxDQUFDeVEsZ0JBQVAsQ0FBeUIsVUFBekIsRUFBcUMsVUFBVXpPLENBQVYsRUFBYztBQUNsRCxjQUFLLFNBQVNBLENBQUMsQ0FBQzBPLEtBQVgsSUFBb0IxTyxDQUFDLENBQUMwTyxLQUFGLENBQVFDLGNBQVIsQ0FBd0IsT0FBeEIsQ0FBekIsRUFBNkQ7QUFDNUQxUCxZQUFBQSxLQUFLLENBQUNtRyxjQUFOLENBQXNCLFVBQXRCO0FBQ0E7QUFDRCxTQUpEO0FBS0E7QUFDRDtBQTk3QmEsR0FBZjtBQWk4QkE7QUFDRDtBQUNBO0FBQ0E7QUFDQTs7QUFDQyxNQUFLLHVCQUF1QnVCLE9BQTVCLEVBQXNDLENBQ3JDO0FBQ0E7QUFFRCxDQXQrQkMsRUFzK0JDZ0UsTUF0K0JELEVBcytCUzNNLE1BdCtCVCxDQUFGOztBQXcrQkUsV0FBVUQsQ0FBVixFQUFha0IsS0FBYixFQUFxQjtBQUV0QkEsRUFBQUEsS0FBSyxDQUFDZ0csSUFBTjtBQUNBaEcsRUFBQUEsS0FBSyxDQUFDb1AsWUFBTjtBQUVBcFAsRUFBQUEsS0FBSyxDQUFDQyxxQkFBTjtBQUNBRCxFQUFBQSxLQUFLLENBQUNtQixxQkFBTjtBQUNBbkIsRUFBQUEsS0FBSyxDQUFDMEIsZUFBTjtBQUNBMUIsRUFBQUEsS0FBSyxDQUFDK0IseUJBQU47QUFFQS9CLEVBQUFBLEtBQUssQ0FBQ3dKLGlCQUFOO0FBQ0F4SixFQUFBQSxLQUFLLENBQUM4SixxQkFBTjtBQUNBOUosRUFBQUEsS0FBSyxDQUFDNkgsd0JBQU47QUFDQTdILEVBQUFBLEtBQUssQ0FBQ21KLHNCQUFOO0FBQ0FuSixFQUFBQSxLQUFLLENBQUNtSyxnQkFBTjtBQUNBbkssRUFBQUEsS0FBSyxDQUFDMEssb0JBQU47QUFFQTFLLEVBQUFBLEtBQUssQ0FBQ2lMLGlCQUFOO0FBRUFqTCxFQUFBQSxLQUFLLENBQUNrTCxtQkFBTjtBQUVBO0FBQ0Q7QUFDQTs7QUFDQ3BNLEVBQUFBLENBQUMsQ0FBRVUsUUFBRixDQUFELENBQWNzQixFQUFkLENBQWtCLCtCQUFsQixFQUFtRCxZQUFXO0FBQzdEO0FBQ0FoQyxJQUFBQSxDQUFDLENBQUVVLFFBQUYsQ0FBRCxDQUFjNkYsT0FBZCxDQUF1QixpQ0FBdkI7QUFDQSxHQUhEO0FBS0EsQ0E3QkMsRUE2QkNxRyxNQTdCRCxFQTZCUzNNLE1BQU0sQ0FBQ2lCLEtBN0JoQixDQUFGOzs7QUM3aENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzZJLFlBQVQsQ0FBdUI4RyxNQUF2QixFQUErQkMsUUFBL0IsRUFBeUNDLFNBQXpDLEVBQW9EQyxhQUFwRCxFQUFvRTtBQUNuRTtBQUNBSCxFQUFBQSxNQUFNLEdBQUcsQ0FBRUEsTUFBTSxHQUFHLEVBQVgsRUFBZ0JuSSxPQUFoQixDQUF5QixjQUF6QixFQUF5QyxFQUF6QyxDQUFUO0FBRUEsTUFBTXVJLENBQUMsR0FBTSxDQUFFQyxRQUFRLENBQUUsQ0FBQ0wsTUFBSCxDQUFWLEdBQXdCLENBQXhCLEdBQTRCLENBQUNBLE1BQTFDO0FBQ0EsTUFBTU0sSUFBSSxHQUFHLENBQUVELFFBQVEsQ0FBRSxDQUFDSixRQUFILENBQVYsR0FBMEIsQ0FBMUIsR0FBOEJNLElBQUksQ0FBQ0MsR0FBTCxDQUFVUCxRQUFWLENBQTNDO0FBQ0EsTUFBTVEsR0FBRyxHQUFNLE9BQU9OLGFBQVAsS0FBeUIsV0FBM0IsR0FBMkMsR0FBM0MsR0FBaURBLGFBQTlEO0FBQ0EsTUFBTU8sR0FBRyxHQUFNLE9BQU9SLFNBQVAsS0FBcUIsV0FBdkIsR0FBdUMsR0FBdkMsR0FBNkNBLFNBQTFEO0FBRUEsTUFBSVMsQ0FBSjs7QUFFQSxNQUFNQyxVQUFVLEdBQUcsU0FBYkEsVUFBYSxDQUFVUixDQUFWLEVBQWFFLElBQWIsRUFBb0I7QUFDdEMsUUFBTU8sQ0FBQyxHQUFHTixJQUFJLENBQUNPLEdBQUwsQ0FBVSxFQUFWLEVBQWNSLElBQWQsQ0FBVjtBQUNBLFdBQU8sS0FBS0MsSUFBSSxDQUFDUSxLQUFMLENBQVlYLENBQUMsR0FBR1MsQ0FBaEIsSUFBc0JBLENBQWxDO0FBQ0EsR0FIRCxDQVhtRSxDQWdCbkU7OztBQUNBRixFQUFBQSxDQUFDLEdBQUcsQ0FBRUwsSUFBSSxHQUFHTSxVQUFVLENBQUVSLENBQUYsRUFBS0UsSUFBTCxDQUFiLEdBQTJCLEtBQUtDLElBQUksQ0FBQ1EsS0FBTCxDQUFZWCxDQUFaLENBQXRDLEVBQXdEeEYsS0FBeEQsQ0FBK0QsR0FBL0QsQ0FBSjs7QUFFQSxNQUFLK0YsQ0FBQyxDQUFFLENBQUYsQ0FBRCxDQUFPNU4sTUFBUCxHQUFnQixDQUFyQixFQUF5QjtBQUN4QjROLElBQUFBLENBQUMsQ0FBRSxDQUFGLENBQUQsR0FBU0EsQ0FBQyxDQUFFLENBQUYsQ0FBRCxDQUFPOUksT0FBUCxDQUFnQix5QkFBaEIsRUFBMkM0SSxHQUEzQyxDQUFUO0FBQ0E7O0FBRUQsTUFBSyxDQUFFRSxDQUFDLENBQUUsQ0FBRixDQUFELElBQVUsRUFBWixFQUFpQjVOLE1BQWpCLEdBQTBCdU4sSUFBL0IsRUFBc0M7QUFDckNLLElBQUFBLENBQUMsQ0FBRSxDQUFGLENBQUQsR0FBU0EsQ0FBQyxDQUFFLENBQUYsQ0FBRCxJQUFVLEVBQW5CO0FBQ0FBLElBQUFBLENBQUMsQ0FBRSxDQUFGLENBQUQsSUFBVSxJQUFJSyxLQUFKLENBQVdWLElBQUksR0FBR0ssQ0FBQyxDQUFFLENBQUYsQ0FBRCxDQUFPNU4sTUFBZCxHQUF1QixDQUFsQyxFQUFzQytILElBQXRDLENBQTRDLEdBQTVDLENBQVY7QUFDQTs7QUFFRCxTQUFPNkYsQ0FBQyxDQUFDN0YsSUFBRixDQUFRNEYsR0FBUixDQUFQO0FBQ0E7O0FBRUQsU0FBU08sUUFBVCxDQUFtQnZLLEdBQW5CLEVBQXlCO0FBQ3hCLFNBQU9BLEdBQUcsQ0FBQ21CLE9BQUosQ0FBYSxNQUFiLEVBQXFCLEdBQXJCLENBQVA7QUFDQTs7QUFFRCxTQUFTd0QsYUFBVCxDQUF3QjNFLEdBQXhCLEVBQThCO0FBQzdCLE1BQU13SyxLQUFLLEdBQUc1UixRQUFRLENBQUVvSCxHQUFHLENBQUNtQixPQUFKLENBQWEsa0JBQWIsRUFBaUMsSUFBakMsQ0FBRixDQUF0Qjs7QUFFQSxNQUFLcUosS0FBTCxFQUFhO0FBQ1p4SyxJQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ21CLE9BQUosQ0FBYSxlQUFiLEVBQThCLEVBQTlCLENBQU47QUFDQTs7QUFFRCxTQUFPb0osUUFBUSxDQUFFdkssR0FBRixDQUFmO0FBQ0EiLCJmaWxlIjoid2MtYWpheC1wcm9kdWN0LWZpbHRlci1wdWJsaWMtc2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIG1haW4ganMgZmlsZS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9wdWJsaWMvc3JjL2pzXG4gKiBAYXV0aG9yICAgICB3cHRvb2xzLmlvXG4gKi9cblxuY29uc3Qgd2NhcGZfcGFyYW1zID0gd2NhcGZfcGFyYW1zIHx8IHtcblx0J2lzX3J0bCc6ICcnLFxuXHQnZmlsdGVyX2lucHV0X2RlbGF5JzogJycsXG5cdCdjaG9zZW5fZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJzogJycsXG5cdCdjaG9zZW5fbm9fcmVzdWx0c190ZXh0JzogJycsXG5cdCdjaG9zZW5fb3B0aW9uc19ub25lX3RleHQnOiAnJyxcblx0J3NlYXJjaF9ib3hfaW5fZGVmYXVsdF9vcmRlcmJ5JzogJycsXG5cdCdwcmVzZXJ2ZV9oaWVyYXJjaHlfYWNjb3JkaW9uX3N0YXRlJzogJycsXG5cdCdwcmVzZXJ2ZV9zb2Z0X2xpbWl0X3N0YXRlJzogJycsXG5cdCdlbmFibGVfYW5pbWF0aW9uX2Zvcl9maWx0ZXJfYWNjb3JkaW9uJzogJycsXG5cdCdmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCc6ICcnLFxuXHQnZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nJzogJycsXG5cdCdlbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uJzogJycsXG5cdCdoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCc6ICcnLFxuXHQnaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nJzogJycsXG5cdCdyZXN0b3JlX2ZvY3VzX2FmdGVyX2ZpbHRlcmluZyc6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9zcGVlZCc6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9lYXNpbmcnOiAnJyxcblx0J2lzX21vYmlsZSc6ICcnLFxuXHQncmVsb2FkX29uX2JhY2snOiAnJyxcblx0J2ZvdW5kX3djYXBmJzogJycsXG5cdCd3Y2FwZl9wcm8nOiAnJyxcblx0J3VwZGF0ZV9kb2N1bWVudF90aXRsZSc6ICcnLFxuXHQndXNlX3RpcHB5anMnOiAnJyxcblx0J3Nob3BfbG9vcF9jb250YWluZXInOiAnJyxcblx0J25vdF9mb3VuZF9jb250YWluZXInOiAnJyxcblx0J3BhZ2luYXRpb25fY29udGFpbmVyJzogJycsXG5cdCdkaXNhYmxlX2FqYXgnOiAnJyxcblx0J2VuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4JzogJycsXG5cdCdzb3J0aW5nX2NvbnRyb2wnOiAnJyxcblx0J2F0dGFjaF9jaG9zZW5fb25fc29ydGluZyc6ICcnLFxuXHQnbG9hZGluZ19hbmltYXRpb24nOiAnJyxcblx0J3Njcm9sbF93aW5kb3cnOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfZm9yJzogJycsXG5cdCdzY3JvbGxfd2luZG93X3doZW4nOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfY3VzdG9tX2VsZW1lbnQnOiAnJyxcblx0J3Njcm9sbF9vbic6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9vZmZzZXQnOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfZGVsYXknOiAnJyxcblx0J2Rpc2FibGVfc2Nyb2xsX2FuaW1hdGlvbic6ICcnLFxuXHQnbW9yZV9zZWxlY3RvcnMnOiAnJyxcblx0J2N1c3RvbV9zY3JpcHRzJzogJycsXG59O1xuXG4oIGZ1bmN0aW9uKCAkLCB3aW5kb3cgKSB7XG5cblx0Y29uc3QgX2RlbGF5ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5maWx0ZXJfaW5wdXRfZGVsYXkgKTtcblx0Y29uc3QgZGVsYXkgID0gX2RlbGF5ID49IDAgPyBfZGVsYXkgOiAzMDA7XG5cblx0Y29uc3QgaXNQcm8gPSB3Y2FwZl9wYXJhbXMud2NhcGZfcHJvO1xuXG5cdGNvbnN0ICRib2R5ICAgICA9ICQoICdib2R5JyApO1xuXHRjb25zdCAkZG9jdW1lbnQgPSAkKCBkb2N1bWVudCApO1xuXG5cdGNvbnN0IGluc3RhbmNlSWRzID0gW107XG5cblx0JCggJy53Y2FwZi1maWx0ZXInICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgaWQgPSAkKCB0aGlzICkuZGF0YSggJ2lkJyApO1xuXG5cdFx0aWYgKCAhIGlkICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGluc3RhbmNlSWRzLnB1c2goIGlkICk7XG5cdH0gKTtcblxuXHRsZXQgZm9jdXNlZEVsbTtcblxuXHR3aW5kb3cudGlwcHlJbnN0YW5jZXMgPSBbXTtcblxuXHR3aW5kb3cuV0NBUEYgPSB3aW5kb3cuV0NBUEYgfHwge307XG5cblx0d2luZG93LldDQVBGID0ge1xuXHRcdGhhbmRsZUZpbHRlckFjY29yZGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCB0b2dnbGVBY2NvcmRpb24gPSAoICRlbCApID0+IHtcblx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBhY2NvcmRpb24gaXMgb3BlbmVkXG5cdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtZXhwYW5kZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHQvLyBDaGFuZ2UgYXJpYS1leHBhbmRlZCB0byB0aGUgb3Bwb3NpdGUgc3RhdGVcblx0XHRcdFx0JGVsLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgISBwcmVzc2VkICk7XG5cblx0XHRcdFx0Y29uc3QgJGZpbHRlcklubmVyID0gJGVsLmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyJyApLmNoaWxkcmVuKCAnLndjYXBmLWZpbHRlci1pbm5lcicgKTtcblxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfYW5pbWF0aW9uX2Zvcl9maWx0ZXJfYWNjb3JkaW9uICkge1xuXHRcdFx0XHRcdCRmaWx0ZXJJbm5lci5zbGlkZVRvZ2dsZShcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5maWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCxcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5maWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmdcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRmaWx0ZXJJbm5lci50b2dnbGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtZmlsdGVyLWFjY29yZGlvbi10cmlnZ2VyJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkKCB0aGlzICkgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtZmlsdGVyLXRpdGxlLmhhcy1hY2NvcmRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRyaWdnZXIgPSAkKCB0aGlzICkuZmluZCggJy53Y2FwZi1maWx0ZXItYWNjb3JkaW9uLXRyaWdnZXInICk7XG5cblx0XHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkdHJpZ2dlciApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlSGllcmFyY2h5VG9nZ2xlOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHRvZ2dsZUFjY29yZGlvbiA9ICggJGVsICkgPT4ge1xuXHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGJ1dHRvbiBpcyBwcmVzc2VkXG5cdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdC8vIENoYW5nZSBhcmlhLXByZXNzZWQgdG8gdGhlIG9wcG9zaXRlIHN0YXRlXG5cdFx0XHRcdCRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJywgISBwcmVzc2VkICk7XG5cblx0XHRcdFx0Y29uc3QgJGNoaWxkID0gJGVsLmNsb3Nlc3QoICdsaScgKS5jaGlsZHJlbiggJ3VsJyApO1xuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24gKSB7XG5cdFx0XHRcdFx0JGNoaWxkLnNsaWRlVG9nZ2xlKFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkLFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZ1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JGNoaWxkLnRvZ2dsZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHQkYm9keVxuXHRcdFx0XHQub24oICdjbGljaycsICcud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdFx0XHR9IClcblx0XHRcdFx0Lm9uKCAna2V5ZG93bicsICcud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRpZiAoIGUua2V5ID09PSAnICcgfHwgZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICdTcGFjZWJhcicgKSB7XG5cdFx0XHRcdFx0XHQvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvbiB0byBzdG9wIHNjcm9sbGluZyB3aGVuIHNwYWNlIGlzIHByZXNzZWRcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkKCB0aGlzICkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZVNvZnRMaW1pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCB0b2dnbGVGaWx0ZXJPcHRpb25zID0gKCAkZWwgKSA9PiB7XG5cdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYnV0dG9uIGlzIHByZXNzZWRcblx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0Ly8gQ2hhbmdlIGFyaWEtcHJlc3NlZCB0byB0aGUgb3Bwb3NpdGUgc3RhdGVcblx0XHRcdFx0JGVsLmF0dHIoICdhcmlhLXByZXNzZWQnLCAhIHByZXNzZWQgKTtcblxuXHRcdFx0XHRjb25zdCAkbGlzdFdyYXBwZXIgPSAkZWwuY2xvc2VzdCggJy53Y2FwZi1saXN0LXdyYXBwZXInICk7XG5cblx0XHRcdFx0aWYgKCBwcmVzc2VkICkge1xuXHRcdFx0XHRcdCRsaXN0V3JhcHBlci5yZW1vdmVDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JGxpc3RXcmFwcGVyLmFkZENsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0JGJvZHlcblx0XHRcdFx0Lm9uKCAnY2xpY2snLCAnLndjYXBmLXNvZnQtbGltaXQtdHJpZ2dlcicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRvZ2dsZUZpbHRlck9wdGlvbnMoICQoIHRoaXMgKSApO1xuXHRcdFx0XHR9IClcblx0XHRcdFx0Lm9uKCAna2V5ZG93bicsICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0aWYgKCBlLmtleSA9PT0gJyAnIHx8IGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnU3BhY2ViYXInICkge1xuXHRcdFx0XHRcdFx0Ly8gUHJldmVudCB0aGUgZGVmYXVsdCBhY3Rpb24gdG8gc3RvcCBzY3JvbGxpbmcgd2hlbiBzcGFjZSBpcyBwcmVzc2VkXG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRcdHRvZ2dsZUZpbHRlck9wdGlvbnMoICQoIHRoaXMgKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlU2VhcmNoRmlsdGVyT3B0aW9uczogZnVuY3Rpb24oKSB7XG5cdFx0XHQkYm9keS5vbiggJ2lucHV0JywgJy53Y2FwZi1zZWFyY2gtYm94IGlucHV0W3R5cGU9XCJ0ZXh0XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0aGF0ICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0ICRpbm5lciAgPSAkdGhhdC5jbG9zZXN0KCAnLndjYXBmLWZpbHRlci1pbm5lcicgKTtcblx0XHRcdFx0Y29uc3QgJGZpbHRlciA9ICRpbm5lci5jbG9zZXN0KCAnLndjYXBmLWZpbHRlcicgKTtcblxuXHRcdFx0XHRjb25zdCBzb2Z0TGltaXRFbmFibGVkID0gJGZpbHRlci5oYXNDbGFzcyggJ2hhcy1zb2Z0LWxpbWl0JyApO1xuXHRcdFx0XHRjb25zdCBzb2Z0TGltaXRUb2dnbGUgID0gJGZpbHRlci5maW5kKCAnLndjYXBmLXNvZnQtbGltaXQtd3JhcHBlcicgKTtcblx0XHRcdFx0Y29uc3Qgbm9SZXN1bHRzICAgICAgICA9ICRmaWx0ZXIuZmluZCggJy53Y2FwZi1uby1yZXN1bHRzLXRleHQnICk7XG5cdFx0XHRcdGNvbnN0IHZpc2libGVPcHRpb25zICAgPSBwYXJzZUludCggJGZpbHRlci5hdHRyKCAnZGF0YS12aXNpYmxlLW9wdGlvbnMnICkgKTtcblxuXHRcdFx0XHRjb25zdCBrZXl3b3JkID0gJHRoYXQudmFsKCk7XG5cblx0XHRcdFx0aWYgKCAhIGtleXdvcmQubGVuZ3RoICkge1xuXHRcdFx0XHRcdGxldCBpbmRleCA9IDA7XG5cdFx0XHRcdFx0JGZpbHRlci5yZW1vdmVDbGFzcyggJ3NlYXJjaC1hY3RpdmUnICk7XG5cblx0XHRcdFx0XHQkLmVhY2goICRpbm5lci5maW5kKCAnLndjYXBmLWZpbHRlci1vcHRpb25zID4gbGknICksIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0aW5kZXgrKztcblxuXHRcdFx0XHRcdFx0Y29uc3QgJGZpbHRlckl0ZW0gPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5yZW1vdmVDbGFzcyggJ2tleXdvcmQtbWF0Y2hlZCcgKTtcblxuXHRcdFx0XHRcdFx0aWYgKCBzb2Z0TGltaXRFbmFibGVkICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIGluZGV4ID4gdmlzaWJsZU9wdGlvbnMgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0uYWRkQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5yZW1vdmVDbGFzcyggJ3djYXBmLWZpbHRlci1vcHRpb24taGlkZGVuJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdFx0aWYgKCBzb2Z0TGltaXRFbmFibGVkICkge1xuXHRcdFx0XHRcdFx0c29mdExpbWl0VG9nZ2xlLnJlbW92ZUF0dHIoICdzdHlsZScgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRub1Jlc3VsdHMuY2hpbGRyZW4oICdzcGFuJyApLnRleHQoICcnICk7XG5cdFx0XHRcdFx0bm9SZXN1bHRzLmhpZGUoKTtcblxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCBpbmRleCA9IDA7XG5cdFx0XHRcdCRmaWx0ZXIuYWRkQ2xhc3MoICdzZWFyY2gtYWN0aXZlJyApO1xuXG5cdFx0XHRcdCQuZWFjaCggJGlubmVyLmZpbmQoICcud2NhcGYtZmlsdGVyLW9wdGlvbnMgPiBsaScgKSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGZpbHRlckl0ZW0gPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0Y29uc3QgbGFiZWwgICAgICAgPSAkZmlsdGVySXRlbS5maW5kKCAnLndjYXBmLWZpbHRlci1pdGVtLWxhYmVsJyApLmRhdGEoICdsYWJlbCcgKTtcblxuXHRcdFx0XHRcdGlmICggbGFiZWwudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCBrZXl3b3JkLnRvTG93ZXJDYXNlKCkgKSApIHtcblx0XHRcdFx0XHRcdGluZGV4Kys7XG5cblx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLmFkZENsYXNzKCAna2V5d29yZC1tYXRjaGVkJyApO1xuXG5cdFx0XHRcdFx0XHRpZiAoIHNvZnRMaW1pdEVuYWJsZWQgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggaW5kZXggPiB2aXNpYmxlT3B0aW9ucyApIHtcblx0XHRcdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5hZGRDbGFzcyggJ3djYXBmLWZpbHRlci1vcHRpb24taGlkZGVuJyApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLnJlbW92ZUNsYXNzKCAnd2NhcGYtZmlsdGVyLW9wdGlvbi1oaWRkZW4nICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICdrZXl3b3JkLW1hdGNoZWQnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0aWYgKCBzb2Z0TGltaXRFbmFibGVkICkge1xuXHRcdFx0XHRcdGlmICggaW5kZXggPD0gdmlzaWJsZU9wdGlvbnMgKSB7XG5cdFx0XHRcdFx0XHRzb2Z0TGltaXRUb2dnbGUuaGlkZSgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzb2Z0TGltaXRUb2dnbGUuc2hvdygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggMCA9PT0gaW5kZXggKSB7XG5cdFx0XHRcdFx0bm9SZXN1bHRzLmNoaWxkcmVuKCAnc3BhbicgKS50ZXh0KCBrZXl3b3JkICk7XG5cdFx0XHRcdFx0bm9SZXN1bHRzLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRub1Jlc3VsdHMuY2hpbGRyZW4oICdzcGFuJyApLnRleHQoICcnICk7XG5cdFx0XHRcdFx0bm9SZXN1bHRzLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0dXBkYXRlUHJvZHVjdHNDb3VudFJlc3VsdDogZnVuY3Rpb24oICRyZXNwb25zZSApIHtcblx0XHRcdGNvbnN0ICRjb250YWluZXIgPSAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3IgICA9ICcud29vY29tbWVyY2UtcmVzdWx0LWNvdW50Jztcblx0XHRcdGNvbnN0IG5ld0NvdW50ICAgPSAkcmVzcG9uc2UuZmluZCggc2VsZWN0b3IgKS5odG1sKCk7XG5cblx0XHRcdCRib2R5LmZpbmQoIHNlbGVjdG9yICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRlbCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRpZiAoICEgJGNvbnRhaW5lci5oYXMoICRlbCApLmxlbmd0aCApIHtcblx0XHRcdFx0XHQkZWwuaHRtbCggbmV3Q291bnQgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0c2Nyb2xsVG86IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAnbm9uZScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHNjcm9sbEZvciA9IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X2Zvcjtcblx0XHRcdGNvbnN0IGlzTW9iaWxlICA9IHdjYXBmX3BhcmFtcy5pc19tb2JpbGU7XG5cdFx0XHRsZXQgcHJvY2VlZCAgICAgPSBmYWxzZTtcblxuXHRcdFx0aWYgKCAnbW9iaWxlJyA9PT0gc2Nyb2xsRm9yICYmIGlzTW9iaWxlICkge1xuXHRcdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSBpZiAoICdkZXNrdG9wJyA9PT0gc2Nyb2xsRm9yICYmICEgaXNNb2JpbGUgKSB7XG5cdFx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmICggJ2JvdGgnID09PSBzY3JvbGxGb3IgKSB7XG5cdFx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgcHJvY2VlZCApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgYWRqdXN0aW5nT2Zmc2V0LCBvZmZzZXQ7XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfb2Zmc2V0ICkge1xuXHRcdFx0XHRhZGp1c3RpbmdPZmZzZXQgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfb2Zmc2V0ICk7XG5cdFx0XHR9XG5cblx0XHRcdGxldCBjb250YWluZXI7XG5cblx0XHRcdGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdGNvbnRhaW5lciA9IHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyO1xuXHRcdFx0fSBlbHNlIGlmICggJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdGNvbnRhaW5lciA9IHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICdjdXN0b20nID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvdyApIHtcblx0XHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfY3VzdG9tX2VsZW1lbnQ7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0ICRjb250YWluZXIgPSAkKCBjb250YWluZXIgKTtcblxuXHRcdFx0aWYgKCAkY29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0b2Zmc2V0ID0gJGNvbnRhaW5lci5vZmZzZXQoKS50b3AgLSBhZGp1c3RpbmdPZmZzZXQ7XG5cblx0XHRcdFx0aWYgKCBvZmZzZXQgPCAwICkge1xuXHRcdFx0XHRcdG9mZnNldCA9IDA7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5kaXNhYmxlX3Njcm9sbF9hbmltYXRpb24gKSB7XG5cdFx0XHRcdFx0d2luZG93LnNjcm9sbFRvKCB7IHRvcDogb2Zmc2V0IH0gKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkKCAnaHRtbCwgYm9keScgKS5zdG9wKCkuYW5pbWF0ZShcblx0XHRcdFx0XHRcdHsgc2Nyb2xsVG9wOiBvZmZzZXQgfSxcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX3NwZWVkLFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3BfZWFzaW5nXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Ly8gVGhpbmdzIGFyZSBkb25lIGJlZm9yZSBmZXRjaGluZyB0aGUgcHJvZHVjdHMgbGlrZSBzaG93aW5nIHRoZSBsb2FkaW5nIGluZGljYXRvci5cblx0XHRiZWZvcmVGZXRjaGluZ1Byb2R1Y3RzOiBmdW5jdGlvbiggdHJpZ2dlcmVkQnkgKSB7XG5cdFx0XHQvLyBUcmFjayB0aGUgY3VycmVudCBlbGVtZW50IGZvY3VzLlxuXHRcdFx0Zm9jdXNlZEVsbSA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG5cblx0XHRcdCRib2R5LmZpbmQoICcud2NhcGYtbG9hZGVyJyApLmFkZENsYXNzKCAnaXMtYWN0aXZlJyApO1xuXG5cdFx0XHRpZiAoICEgaXNQcm8gJiYgJ2ltbWVkaWF0ZWx5JyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfd2hlbiApIHtcblx0XHRcdFx0V0NBUEYuc2Nyb2xsVG8oKTtcblx0XHRcdH1cblxuXHRcdFx0JGRvY3VtZW50LnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfZmV0Y2hpbmdfcHJvZHVjdHMnLCBbIHRyaWdnZXJlZEJ5IF0gKTtcblx0XHR9LFxuXHRcdGRlc3Ryb3lUaXBweUluc3RhbmNlczogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy51c2VfdGlwcHlqcyApIHtcblx0XHRcdFx0Ly8gQHNvdXJjZSBodHRwczovL2dpdGh1Yi5jb20vYXRvbWlrcy90aXBweWpzL2lzc3Vlcy80NzNcblx0XHRcdFx0dGlwcHlJbnN0YW5jZXMuZm9yRWFjaCggaW5zdGFuY2UgPT4ge1xuXHRcdFx0XHRcdGluc3RhbmNlLmRlc3Ryb3koKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0XHR0aXBweUluc3RhbmNlcy5sZW5ndGggPSAwOyAvLyBjbGVhciBpdFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Ly8gVGhpbmdzIGFyZSBkb25lIGJlZm9yZSB1cGRhdGluZyB0aGUgcHJvZHVjdHMgbGlrZSBoaWRpbmcgdGhlIGxvYWRpbmcgaW5kaWNhdG9yLlxuXHRcdGJlZm9yZVVwZGF0aW5nUHJvZHVjdHM6IGZ1bmN0aW9uKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICkge1xuXHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1sb2FkZXInICkucmVtb3ZlQ2xhc3MoICdpcy1hY3RpdmUnICk7XG5cblx0XHRcdC8vIE1heWJlIGdvb2QgZm9yIHBlcmZvcm1hbmNlLlxuXHRcdFx0V0NBUEYuZGVzdHJveVRpcHB5SW5zdGFuY2VzKCk7XG5cblx0XHRcdCRkb2N1bWVudC50cmlnZ2VyKCAnd2NhcGZfYmVmb3JlX3VwZGF0aW5nX3Byb2R1Y3RzJywgWyAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5IF0gKTtcblx0XHR9LFxuXHRcdGFmdGVyVXBkYXRpbmdQcm9kdWN0czogZnVuY3Rpb24oICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgKSB7XG5cdFx0XHRXQ0FQRi51cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0KCAkcmVzcG9uc2UgKTtcblxuXHRcdFx0Ly8gUmVzdG9yZSB0aGUgZm9jdXMgKE1heWJlIHJlc3RvcmluZyB0aGUgZm9jdXMgaW4gbW9iaWxlIGRldmljZSBpc24ndCBnb29kKS5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnJlc3RvcmVfZm9jdXNfYWZ0ZXJfZmlsdGVyaW5nICYmICEgd2NhcGZfcGFyYW1zLmlzX21vYmlsZSApIHtcblx0XHRcdFx0aWYgKCBkb2N1bWVudC5ib2R5ICE9PSBmb2N1c2VkRWxtICkge1xuXHRcdFx0XHRcdGlmICggZm9jdXNlZEVsbS5pZCApIHtcblx0XHRcdFx0XHRcdCQoIGAjJHsgZm9jdXNlZEVsbS5pZCB9YCApLmZvY3VzKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlaW5pdGlhbGl6ZSB3Y2FwZi5cblx0XHRcdFdDQVBGLmluaXQoKTtcblxuXHRcdFx0aWYgKCAhIGlzUHJvICYmICdhZnRlcicgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X3doZW4gKSB7XG5cdFx0XHRcdFdDQVBGLnNjcm9sbFRvKCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRyaWdnZXIgZXZlbnRzLlxuXHRcdFx0JCggZG9jdW1lbnQgKS50cmlnZ2VyKCAncmVhZHknICk7XG5cdFx0XHQkKCB3aW5kb3cgKS50cmlnZ2VyKCAnc2Nyb2xsJyApO1xuXHRcdFx0JCggd2luZG93ICkudHJpZ2dlciggJ3Jlc2l6ZScgKTtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuY3VzdG9tX3NjcmlwdHMgKSB7XG5cdFx0XHRcdGV2YWwoIHdjYXBmX3BhcmFtcy5jdXN0b21fc2NyaXB0cyApO1xuXHRcdFx0fVxuXG5cdFx0XHQkZG9jdW1lbnQudHJpZ2dlciggJ3djYXBmX2FmdGVyX3VwZGF0aW5nX3Byb2R1Y3RzJywgWyAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5IF0gKTtcblx0XHR9LFxuXHRcdGZpbHRlclByb2R1Y3RzOiBmdW5jdGlvbiggdHJpZ2dlcmVkQnkgPSAnZmlsdGVyJyApIHtcblx0XHRcdFdDQVBGLmJlZm9yZUZldGNoaW5nUHJvZHVjdHMoIHRyaWdnZXJlZEJ5ICk7XG5cblx0XHRcdCQuYWpheCgge1xuXHRcdFx0XHR1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHRcdFx0Y29uc3QgJHJlc3BvbnNlID0gJCggcmVzcG9uc2UgKTtcblxuXHRcdFx0XHRcdFdDQVBGLmJlZm9yZVVwZGF0aW5nUHJvZHVjdHMoICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgKTtcblxuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIFVwZGF0ZSBkb2N1bWVudCB0aXRsZS5cblx0XHRcdFx0XHQgKlxuXHRcdFx0XHRcdCAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzc1OTk1NjJcblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy51cGRhdGVfZG9jdW1lbnRfdGl0bGUgKSB7XG5cdFx0XHRcdFx0XHRkb2N1bWVudC50aXRsZSA9ICRyZXNwb25zZS5maWx0ZXIoICd0aXRsZScgKS50ZXh0KCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBpbnN0YW5jZXMuXG5cdFx0XHRcdFx0Zm9yICggY29uc3QgaWQgb2YgaW5zdGFuY2VJZHMgKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBpbnN0YW5jZUlkID0gJ1tkYXRhLWlkPVwiJyArIGlkICsgJ1wiXSc7XG5cdFx0XHRcdFx0XHRjb25zdCAkaW5zdGFuY2UgID0gJCggaW5zdGFuY2VJZCApO1xuXHRcdFx0XHRcdFx0Y29uc3QgJGlubmVyICAgICA9ICRpbnN0YW5jZS5maW5kKCAnLndjYXBmLWZpbHRlci1pbm5lcicgKTtcblx0XHRcdFx0XHRcdGNvbnN0IF9pbnN0YW5jZSAgPSAkcmVzcG9uc2UuZmluZCggaW5zdGFuY2VJZCApO1xuXG5cdFx0XHRcdFx0XHQvLyBQcmVzZXJ2ZSBoaWVyYXJjaHkgYWNjb3JkaW9uIHN0YXRlLlxuXHRcdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkaW5zdGFuY2UuaGFzQ2xhc3MoICdoYXMtaGllcmFyY2h5LWFjY29yZGlvbicgKSApIHtcblx0XHRcdFx0XHRcdFx0XHQkaW5zdGFuY2UuZmluZCggJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0ICRlbCA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IGlkICA9ICRlbC5kYXRhKCAnaWQnICk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHRvZ2dsZVNlbGVjdG9yID0gYC53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZVtkYXRhLWlkPVwiJHsgaWQgfVwiXWA7XG5cblx0XHRcdFx0XHRcdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYWNjb3JkaW9uIGlzIG9wZW5lZFxuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGlmICggcHJlc3NlZCApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICd0cnVlJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5jbG9zZXN0KCAnbGknICkuY2hpbGRyZW4oICd1bCcgKS5zaG93KCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5hdHRyKCAnYXJpYS1wcmVzc2VkJywgJ2ZhbHNlJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5jbG9zZXN0KCAnbGknICkuY2hpbGRyZW4oICd1bCcgKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIFByZXNlcnZlIHNvZnQgbGltaXQgc3RhdGUuXG5cdFx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5wcmVzZXJ2ZV9zb2Z0X2xpbWl0X3N0YXRlICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRpbnN0YW5jZS5oYXNDbGFzcyggJ2hhcy1zb2Z0LWxpbWl0JyApICkge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0ICRsaXN0V3JhcHBlciA9ICRpbnN0YW5jZS5maW5kKCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKTtcblxuXHRcdFx0XHRcdFx0XHRcdGlmICggJGxpc3RXcmFwcGVyLmhhc0NsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKS5hZGRDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICd0cnVlJyApO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1saXN0LXdyYXBwZXInICkucmVtb3ZlQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJyApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAnZmFsc2UnICk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGNvbnN0IF9odG1sID0gX2luc3RhbmNlLmZpbmQoICcud2NhcGYtZmlsdGVyLWlubmVyJyApLmh0bWwoKTtcblxuXHRcdFx0XHRcdFx0Ly8gRmluYWxseSB1cGRhdGUgdGhlIGluc3RhbmNlLlxuXHRcdFx0XHRcdFx0JGlubmVyLmh0bWwoIF9odG1sICk7XG5cblx0XHRcdFx0XHRcdCRpbnN0YW5jZS50cmlnZ2VyKCAnd2NhcGYtZmlsdGVyLXVwZGF0ZWQnLCBbIF9pbnN0YW5jZSBdICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBhY3RpdmUgZmlsdGVycyBhbmQgcmVzZXQgZmlsdGVycy5cblx0XHRcdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLWFjdGl2ZS1maWx0ZXJzLCAud2NhcGYtcmVzZXQtZmlsdGVycycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGNvbnN0ICR0aGF0ICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0XHRjb25zdCBpbnN0YW5jZUlkID0gJ1tkYXRhLWlkPVwiJyArICR0aGF0LmRhdGEoICdpZCcgKSArICdcIl0nO1xuXG5cdFx0XHRcdFx0XHQkdGhhdC5odG1sKCAkcmVzcG9uc2UuZmluZCggaW5zdGFuY2VJZCApLmh0bWwoKSApO1xuXHRcdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRcdC8vIFJlcGxhY2Ugb2xkIHNob3AgbG9vcCB3aXRoIG5ldyBvbmUuXG5cdFx0XHRcdFx0Y29uc3QgJHNob3BMb29wQ29udGFpbmVyID0gJHJlc3BvbnNlLmZpbmQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRcdFx0Y29uc3QgJG5vdEZvdW5kQ29udGFpbmVyID0gJHJlc3BvbnNlLmZpbmQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICk7XG5cblx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyID09PSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRXQ0FQRi5hZnRlclVwZGF0aW5nUHJvZHVjdHMoICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0cmVxdWVzdEZpbHRlcjogZnVuY3Rpb24oIHVybCwgdHJpZ2dlcmVkQnkgPSAnZmlsdGVyJyApIHtcblx0XHRcdGlmICggISB1cmwgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaG9zdG5hbWUgPSBsb2NhdGlvbi5ob3N0bmFtZTtcblxuXHRcdFx0Ly8gVE9ETzogUmVtb3ZlIGZyb20gcHJvZHVjdGlvbiBidWlsZC5cblx0XHRcdGlmICggJ2xvY2FsaG9zdCcgPT09IGhvc3RuYW1lICkge1xuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSggJ2h0dHA6Ly93Y2ZpbHRlci0yLnRlc3QnLCAnLy9sb2NhbGhvc3Q6MzAwMScgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZGlzYWJsZV9hamF4ICkge1xuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IHVybDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7IHdjYXBmOiB0cnVlIH0sICcnLCB1cmwgKTtcblxuXHRcdFx0XHRXQ0FQRi5maWx0ZXJQcm9kdWN0cyggdHJpZ2dlcmVkQnkgKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGhhbmRsZU51bWJlcklucHV0RmlsdGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCByYW5nZU51bWJlclNlbGVjdG9ycyA9ICcud2NhcGYtcmFuZ2UtbnVtYmVyIC5taW4tdmFsdWUsIC53Y2FwZi1yYW5nZS1udW1iZXIgLm1heC12YWx1ZSc7XG5cblx0XHRcdCRib2R5Lm9uKCAnaW5wdXQnLCByYW5nZU51bWJlclNlbGVjdG9ycywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRpdGVtID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdGNvbnN0ICRyYW5nZU51bWJlciAgICAgID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1yYW5nZS1udW1iZXInICk7XG5cdFx0XHRcdGNvbnN0IGZvcm1hdE51bWJlcnMgICAgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWZvcm1hdC1udW1iZXJzJyApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1pblZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IG9sZE1pblZhbHVlICAgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBvbGRNYXhWYWx1ZSAgICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFBsYWNlcyAgICAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZGVjaW1hbC1wbGFjZXMnICk7XG5cdFx0XHRcdGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXRob3VzYW5kLXNlcGFyYXRvcicgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFNlcGFyYXRvciAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZGVjaW1hbC1zZXBhcmF0b3InICk7XG5cblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGl0ZW0uZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0Y29uc3QgZ2V0VmFsdWUgPSAoIGZsb2F0VmFsdWUgKSA9PiB7XG5cdFx0XHRcdFx0aWYgKCBmb3JtYXROdW1iZXJzICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG51bWJlckZvcm1hdCggZmxvYXRWYWx1ZSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gZmxvYXRWYWx1ZTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQkaXRlbS5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRsZXQgbWluVmFsdWUgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCkgKTtcblx0XHRcdFx0XHRsZXQgbWF4VmFsdWUgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCkgKTtcblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRcdFx0aWYgKCBpc05hTiggbWluVmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNaW5WYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0XHRcdGlmICggaXNOYU4oIG1heFZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgcmFuZ2VNaW5WYWx1ZS5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlIDwgcmFuZ2VNaW5WYWx1ZSApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNaW5WYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPiByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBtYXhWYWx1ZSA+IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgbWluVmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA+IG1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSBtaW5WYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBJZiB2YWx1ZSBpcyBub3QgY2hhbmdlZCB0aGVuIGRvbid0IHByb2NlZWQuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gb2xkTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IG9sZE1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHQvLyBSZW1vdmUgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJHJhbmdlTnVtYmVyLmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIEFkZCByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0XHRjb25zdCB1cmwgPSAkcmFuZ2VOdW1iZXIuZGF0YSggJ3VybCcgKS5yZXBsYWNlKCAnJTFzJywgbWluVmFsdWUgKS5yZXBsYWNlKCAnJTJzJywgbWF4VmFsdWUgKTtcblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlRGF0ZUlucHV0RmlsdGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsICcud2NhcGYtZGF0ZS1pbnB1dCAuZGF0ZS1pbnB1dCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkZmlsdGVyID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZGF0ZS1pbnB1dCcgKTtcblx0XHRcdFx0Y29uc3QgaXNSYW5nZSA9ICRmaWx0ZXIuZGF0YSggJ2lzLXJhbmdlJyApO1xuXG5cdFx0XHRcdGxldCBmaWx0ZXJVcmwgPSAnJztcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkZmlsdGVyLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdGlmICggaXNSYW5nZSApIHtcblx0XHRcdFx0XHRjb25zdCBmcm9tID0gJGZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKS52YWwoKTtcblx0XHRcdFx0XHRjb25zdCB0byAgID0gJGZpbHRlci5maW5kKCAnLmRhdGUtdG8taW5wdXQnICkudmFsKCk7XG5cblx0XHRcdFx0XHRpZiAoIGZyb20gJiYgdG8gKSB7XG5cdFx0XHRcdFx0XHRmaWx0ZXJVcmwgPSAkZmlsdGVyLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIGZyb20gKS5yZXBsYWNlKCAnJTJzJywgdG8gKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCAhIGZyb20gJiYgISB0byApIHtcblx0XHRcdFx0XHRcdGZpbHRlclVybCA9ICRmaWx0ZXIuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IGZyb20gPSAkZmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApLnZhbCgpO1xuXG5cdFx0XHRcdFx0aWYgKCBmcm9tICkge1xuXHRcdFx0XHRcdFx0ZmlsdGVyVXJsID0gJGZpbHRlci5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclcycsIGZyb20gKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZmlsdGVyVXJsID0gJGZpbHRlci5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIGZpbHRlclVybCApIHtcblx0XHRcdFx0XHQkZmlsdGVyLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGZpbHRlci5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIGZpbHRlclVybCApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlTGlzdEZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgbmF0aXZlSW5wdXRzID0gJy5saXN0LXR5cGUtbmF0aXZlIFt0eXBlPVwiY2hlY2tib3hcIl0sJyArXG5cdFx0XHRcdCcubGlzdC10eXBlLW5hdGl2ZSBbdHlwZT1cInJhZGlvXCJdLCcgK1xuXHRcdFx0XHQnLmxpc3QtdHlwZS1jdXN0b20tY2hlY2tib3ggW3R5cGU9XCJjaGVja2JveFwiXSc7XG5cblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgbmF0aXZlSW5wdXRzLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyLWl0ZW0nICkudG9nZ2xlQ2xhc3MoICdpdGVtLWFjdGl2ZScgKTtcblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkKCB0aGlzICkuZGF0YSggJ3VybCcgKSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRjb25zdCBjdXN0b21SYWRpb1NlbGVjdG9yID0gJy5saXN0LXR5cGUtY3VzdG9tLXJhZGlvJztcblxuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCBjdXN0b21SYWRpb1NlbGVjdG9yICsgJyBbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZpbHRlci1pdGVtJyApLnRvZ2dsZUNsYXNzKCAnaXRlbS1hY3RpdmUnICk7XG5cblx0XHRcdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzU4Mzk5MjRcblx0XHRcdFx0JCggdGhpcyApXG5cdFx0XHRcdFx0LmNsb3Nlc3QoIGN1c3RvbVJhZGlvU2VsZWN0b3IgKVxuXHRcdFx0XHRcdC5maW5kKCAnLndjYXBmLWZpbHRlci1pdGVtLml0ZW0tYWN0aXZlIFt0eXBlPVwiY2hlY2tib3hcIl0nIClcblx0XHRcdFx0XHQubm90KCB0aGlzIClcblx0XHRcdFx0XHQucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApXG5cdFx0XHRcdFx0LmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyLWl0ZW0nIClcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoICdpdGVtLWFjdGl2ZScgKTtcblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkKCB0aGlzICkuZGF0YSggJ3VybCcgKSApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlRHJvcGRvd25GaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgJy53Y2FwZi1kcm9wZG93bi13cmFwcGVyIHNlbGVjdCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkc2VsZWN0ICAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgdmFsdWVzICAgICAgICAgPSAkc2VsZWN0LnZhbCgpO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJVUkwgICAgICA9ICRzZWxlY3QuZGF0YSggJ3VybCcgKTtcblx0XHRcdFx0Y29uc3QgY2xlYXJGaWx0ZXJVUkwgPSAkc2VsZWN0LmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApO1xuXHRcdFx0XHRsZXQgdXJsO1xuXG5cdFx0XHRcdGlmICggdmFsdWVzLmxlbmd0aCApIHtcblx0XHRcdFx0XHR1cmwgPSBmaWx0ZXJVUkwucmVwbGFjZSggJyVzJywgdmFsdWVzLnRvU3RyaW5nKCkgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR1cmwgPSBjbGVhckZpbHRlclVSTDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlUGFnaW5hdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfcGFnaW5hdGlvbl92aWFfYWpheCAmJiB3Y2FwZl9wYXJhbXMucGFnaW5hdGlvbl9jb250YWluZXIgKSB7XG5cdFx0XHRcdGNvbnN0ICRjb250YWluZXIgPSAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0XHRjb25zdCBfc2VsZWN0b3JzID0gd2NhcGZfcGFyYW1zLnBhZ2luYXRpb25fY29udGFpbmVyLnNwbGl0KCAnLCcgKTtcblx0XHRcdFx0Y29uc3Qgc2VsZWN0b3JzICA9IFtdO1xuXG5cdFx0XHRcdF9zZWxlY3RvcnMuZm9yRWFjaCggc2VsZWN0b3IgPT4ge1xuXHRcdFx0XHRcdGlmICggc2VsZWN0b3IgKSB7XG5cdFx0XHRcdFx0XHRzZWxlY3RvcnMucHVzaCggc2VsZWN0b3IgKyAnIGEnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0Y29uc3Qgc2VsZWN0b3IgPSBzZWxlY3RvcnMuam9pbiggJywnICk7XG5cblx0XHRcdFx0aWYgKCAkY29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHQkY29udGFpbmVyLm9uKCAnY2xpY2snLCBzZWxlY3RvciwgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IGhyZWYgPSAkKCB0aGlzICkuYXR0ciggJ2hyZWYnICk7XG5cblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIGhyZWYsICdwYWdpbmF0ZScgKTtcblx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdGhhbmRsZURlZmF1bHRPcmRlcmJ5OiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMuc29ydGluZ19jb250cm9sICkge1xuXHRcdFx0XHQvLyBTdWJtaXQgdGhlIG9yZGVyYnkgZm9ybSB3aGVuIHZhbHVlIGlzIGNoYW5nZWQuXG5cdFx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgJy53b29jb21tZXJjZS1vcmRlcmluZyBzZWxlY3Qub3JkZXJieScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5jbG9zZXN0KCAnZm9ybScgKS50cmlnZ2VyKCAnc3VibWl0JyApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBQcmV2ZW50IHRoZSBhdXRvIHN1Ym1pc3Npb24gb2YgdGhlIG9yZGVyYnkgZm9ybS5cblx0XHRcdCRib2R5Lm9uKCAnc3VibWl0JywgJy53b29jb21tZXJjZS1vcmRlcmluZycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgdmlhIGFqYXggd2hlbiB0aGUgb3JkZXJieSB2YWx1ZSBpcyBjaGFuZ2VkLlxuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nIHNlbGVjdC5vcmRlcmJ5JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0IG9yZGVyID0gJCggdGhpcyApLnZhbCgpO1xuXG5cdFx0XHRcdGNvbnN0IHVybCA9IG5ldyBVUkwoIHdpbmRvdy5sb2NhdGlvbiApO1xuXHRcdFx0XHR1cmwuc2VhcmNoUGFyYW1zLnNldCggJ29yZGVyYnknLCBvcmRlciApO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIGdldE9yZGVyQnlVcmwoIHVybC5ocmVmICkgKTtcblxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVDbGVhckZpbHRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHQkYm9keS5vbiggJ2NsaWNrJywgJy53Y2FwZi1maWx0ZXItY2xlYXItYnRuJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJCggdGhpcyApLmF0dHIoICdkYXRhLWNsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZUZpbHRlclRvb2x0aXA6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZFJlZmVyZW5jZVxuXHRcdFx0aWYgKCAnZnVuY3Rpb24nICE9PSB0eXBlb2YgdGlwcHkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy51c2VfdGlwcHlqcyApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkUmVmZXJlbmNlXG5cdFx0XHR0aXBweSggJy53Y2FwZi1maWx0ZXItdG9vbHRpcCcsIHtcblx0XHRcdFx0cGxhY2VtZW50OiAndG9wJyxcblx0XHRcdFx0Y29udGVudCggcmVmZXJlbmNlICkge1xuXHRcdFx0XHRcdHJldHVybiByZWZlcmVuY2UuZ2V0QXR0cmlidXRlKCAnZGF0YS1jb250ZW50JyApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRhbGxvd0hUTUw6IHRydWUsXG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRpbml0Q29tYm9ib3g6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAhIGpRdWVyeSgpLmNob3NlbldDQVBGICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHRlbXBsYXRlUmVzdWx0ID0gKCB0ZXh0LCBkYXRhICkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdCc8c3Bhbj4nICsgdGV4dCArICc8L3NwYW4+Jyxcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJ3Y2FwZi1jb3VudFwiPicgKyBkYXRhWyAnY291bnRNYXJrdXAnIF0gKyAnPC9zcGFuPicsXG5cdFx0XHRcdF0uam9pbiggJycgKTtcblx0XHRcdH07XG5cblx0XHRcdGNvbnN0IHRlbXBsYXRlU2VsZWN0aW9uID0gKCB0ZXh0LCBkYXRhICkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cIndjYXBmLWNvdW50LScgKyBkYXRhLmNvdW50ICsgJ1wiPicgKyB0ZXh0ICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cIndjYXBmLWNvdW50IHdjYXBmLWNvdW50LScgKyBkYXRhLmNvdW50ICsgJ1wiPicgKyBkYXRhWyAnY291bnRNYXJrdXAnIF0gKyAnPC9zcGFuPicsXG5cdFx0XHRcdF0uam9pbiggJycgKTtcblx0XHRcdH07XG5cblx0XHRcdGNvbnN0IGRlZmF1bHRzID0ge1xuXHRcdFx0XHRpbmhlcml0X3NlbGVjdF9jbGFzc2VzOiB0cnVlLFxuXHRcdFx0XHRpbmhlcml0X29wdGlvbl9jbGFzc2VzOiB0cnVlLFxuXHRcdFx0XHRub19yZXN1bHRzX3RleHQ6IHdjYXBmX3BhcmFtcy5jaG9zZW5fbm9fcmVzdWx0c190ZXh0LFxuXHRcdFx0XHRvcHRpb25zX25vbmVfdGV4dDogd2NhcGZfcGFyYW1zLmNob3Nlbl9vcHRpb25zX25vbmVfdGV4dCxcblx0XHRcdFx0c2VhcmNoX2NvbnRhaW5zOiB0cnVlLCAvLyBNYXRjaCBmcm9tIGFueXdoZXJlIGluIHN0cmluZy5cblx0XHRcdFx0c2VhcmNoX2luX3ZhbHVlczogdHJ1ZSwgLy8gU2VhcmNoIGluIHZhbHVlcyBhbHNvLlxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuaXNfcnRsICkge1xuXHRcdFx0XHRkZWZhdWx0c1sgJ3J0bCcgXSA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdCRib2R5LmZpbmQoICcud2NhcGYtY2hvc2VuJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkdGhpcyAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0cyB9O1xuXG5cdFx0XHRcdC8vIElmIGhpZXJhcmNoeSBlbmFibGVkIHRoZW4gd2Ugc2hvdyB0aGUgc2VsZWN0ZWQgb3B0aW9ucy5cblx0XHRcdFx0aWYgKCAkdGhpcy5oYXNDbGFzcyggJ2hhcy1oaWVyYXJjaHknICkgKSB7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucycgXSA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucycgXSA9IHdjYXBmX3BhcmFtcy5jaG9zZW5fZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gRW5hYmxlIHRlbXBsYXRpbmcgd2hlbiBzaG93aW5nIGNvdW50LlxuXHRcdFx0XHRpZiAoICR0aGlzLmhhc0NsYXNzKCAnd2l0aC1jb3VudCcgKSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAndGVtcGxhdGVSZXN1bHQnIF0gICAgPSB0ZW1wbGF0ZVJlc3VsdDtcblx0XHRcdFx0XHRvcHRpb25zWyAndGVtcGxhdGVTZWxlY3Rpb24nIF0gPSB0ZW1wbGF0ZVNlbGVjdGlvbjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIERpc2FibGUgc2VhcmNoIGJveC5cblx0XHRcdFx0aWYgKCAhICR0aGlzLmRhdGEoICdlbmFibGUtc2VhcmNoJyApICkge1xuXHRcdFx0XHRcdG9wdGlvbnNbICdkaXNhYmxlX3NlYXJjaCcgXSA9IHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkdGhpcy5jaG9zZW5XQ0FQRiggb3B0aW9ucyApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBBdHRhY2ggY2hvc2VuIGZvciBkZWZhdWx0IG9yZGVyYnkuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5hdHRhY2hfY2hvc2VuX29uX3NvcnRpbmcgKSB7XG5cdFx0XHRcdGxldCBkaXNhYmxlU2VhcmNoID0gdHJ1ZTtcblxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zZWFyY2hfYm94X2luX2RlZmF1bHRfb3JkZXJieSApIHtcblx0XHRcdFx0XHRkaXNhYmxlU2VhcmNoID0gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0cyB9O1xuXG5cdFx0XHRcdG9wdGlvbnNbICdkaXNhYmxlX3NlYXJjaCcgXSA9IGRpc2FibGVTZWFyY2g7XG5cblx0XHRcdFx0JGJvZHkuZmluZCggJy53b29jb21tZXJjZS1vcmRlcmluZyBzZWxlY3Qub3JkZXJieScgKS5jaG9zZW5XQ0FQRiggb3B0aW9ucyApO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aW5pdFJhbmdlU2xpZGVyOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCRib2R5LmZpbmQoICcud2NhcGYtcmFuZ2Utc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkaXRlbSAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCAkc2xpZGVyID0gJGl0ZW0uZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKTtcblxuXHRcdFx0XHRjb25zdCBzbGlkZXJJZCAgICAgICAgICA9ICRzbGlkZXIuYXR0ciggJ2lkJyApO1xuXHRcdFx0XHRjb25zdCBkaXNwbGF5VmFsdWVzQXMgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRpc3BsYXktdmFsdWVzLWFzJyApO1xuXHRcdFx0XHRjb25zdCBmb3JtYXROdW1iZXJzICAgICA9ICRpdGVtLmF0dHIoICdkYXRhLWZvcm1hdC1udW1iZXJzJyApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1pblZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBzdGVwICAgICAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXN0ZXAnICkgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFBsYWNlcyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRcdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkaXRlbS5hdHRyKCAnZGF0YS10aG91c2FuZC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IG1pblZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IG1heFZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0ICRtaW5WYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5taW4tdmFsdWUnICk7XG5cdFx0XHRcdGNvbnN0ICRtYXhWYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5tYXgtdmFsdWUnICk7XG5cblx0XHRcdFx0Y29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIHNsaWRlcklkICk7XG5cblx0XHRcdFx0bm9VaVNsaWRlci5jcmVhdGUoIHNsaWRlciwge1xuXHRcdFx0XHRcdHN0YXJ0OiBbIG1pblZhbHVlLCBtYXhWYWx1ZSBdLFxuXHRcdFx0XHRcdHN0ZXAsXG5cdFx0XHRcdFx0Y29ubmVjdDogdHJ1ZSxcblx0XHRcdFx0XHRjc3NQcmVmaXg6ICd3Y2FwZi1ub3VpLScsXG5cdFx0XHRcdFx0cmFuZ2U6IHtcblx0XHRcdFx0XHRcdCdtaW4nOiByYW5nZU1pblZhbHVlLFxuXHRcdFx0XHRcdFx0J21heCc6IHJhbmdlTWF4VmFsdWUsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICd1cGRhdGUnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHRcdGxldCBtaW5WYWx1ZTtcblx0XHRcdFx0XHRsZXQgbWF4VmFsdWU7XG5cblx0XHRcdFx0XHRpZiAoIGZvcm1hdE51bWJlcnMgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IG51bWJlckZvcm1hdCggdmFsdWVzWyAwIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IG51bWJlckZvcm1hdCggdmFsdWVzWyAxIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAwIF0gKTtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoICdwbGFpbl90ZXh0JyA9PT0gZGlzcGxheVZhbHVlc0FzICkge1xuXHRcdFx0XHRcdFx0JG1pblZhbHVlLmh0bWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0XHQkbWF4VmFsdWUuaHRtbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JG1pblZhbHVlLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHRcdCRtYXhWYWx1ZS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICkge1xuXHRcdFx0XHRcdGNvbnN0IF9taW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0Y29uc3QgX21heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblxuXHRcdFx0XHRcdC8vIElmIHZhbHVlIGlzIG5vdCBjaGFuZ2VkIHRoZW4gZG9uJ3QgcHJvY2VlZC5cblx0XHRcdFx0XHRpZiAoIF9taW5WYWx1ZSA9PT0gbWluVmFsdWUgJiYgX21heFZhbHVlID09PSBtYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIF9taW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBfbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHQvLyBSZW1vdmUgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJGl0ZW0uZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdGNvbnN0IHVybCA9ICRpdGVtLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIF9taW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBfbWF4VmFsdWUgKTtcblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtaW5WYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG1pblZhbHVlLCBudWxsIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkbWF4VmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRcdGNsZWFyVGltZW91dCggJGlucHV0LmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBudWxsLCBtYXhWYWx1ZSBdICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRpbml0RGF0ZXBpY2tlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgalF1ZXJ5KCkuZGF0ZXBpY2tlciApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCAkd2NhcGZEYXRlRmlsdGVyID0gJGJvZHkuZmluZCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXG5cdFx0XHRjb25zdCBmb3JtYXQgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLWZvcm1hdCcgKTtcblx0XHRcdGNvbnN0IHllYXJEcm9wZG93biAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtcGlja2VyLXllYXItZHJvcGRvd24nICk7XG5cdFx0XHRjb25zdCBtb250aERyb3Bkb3duID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLXBpY2tlci1tb250aC1kcm9wZG93bicgKTtcblxuXHRcdFx0Y29uc3QgJGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApO1xuXHRcdFx0Y29uc3QgJHRvICAgPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKTtcblxuXHRcdFx0JGZyb20uZGF0ZXBpY2tlcigge1xuXHRcdFx0XHRkYXRlRm9ybWF0OiBmb3JtYXQsXG5cdFx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdFx0Y2hhbmdlTW9udGg6IG1vbnRoRHJvcGRvd24sXG5cdFx0XHR9ICk7XG5cblx0XHRcdCR0by5kYXRlcGlja2VyKCB7XG5cdFx0XHRcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdFx0Y2hhbmdlWWVhcjogeWVhckRyb3Bkb3duLFxuXHRcdFx0XHRjaGFuZ2VNb250aDogbW9udGhEcm9wZG93bixcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXRGaWx0ZXJPcHRpb25Ub29sdGlwOiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRSZWZlcmVuY2Vcblx0XHRcdGlmICggJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHRpcHB5ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMudXNlX3RpcHB5anMgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgdG9vbHRpcFBvc2l0aW9ucyA9IFsgJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCcgXTtcblxuXHRcdFx0dG9vbHRpcFBvc2l0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbiggdG9vbHRpcFBvc2l0aW9uICkge1xuXHRcdFx0XHRjb25zdCBpZGVudGlmaWVyID0gJ2RhdGEtd2NhcGYtdG9vbHRpcC0nICsgdG9vbHRpcFBvc2l0aW9uO1xuXG5cdFx0XHRcdC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRSZWZlcmVuY2Vcblx0XHRcdFx0Y29uc3QgaW5zdGFuY2VzID0gdGlwcHkoICdbJyArIGlkZW50aWZpZXIgKyAnXScsIHtcblx0XHRcdFx0XHRwbGFjZW1lbnQ6IHRvb2x0aXBQb3NpdGlvbixcblx0XHRcdFx0XHRjb250ZW50KCByZWZlcmVuY2UgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSggaWRlbnRpZmllciApO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0YWxsb3dIVE1MOiB0cnVlLFxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0d2luZG93LnRpcHB5SW5zdGFuY2VzID0gdGlwcHlJbnN0YW5jZXMuY29uY2F0KCBpbnN0YW5jZXMgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0V0NBUEYuaW5pdENvbWJvYm94KCk7XG5cdFx0XHRXQ0FQRi5pbml0UmFuZ2VTbGlkZXIoKTtcblx0XHRcdFdDQVBGLmluaXREYXRlcGlja2VyKCk7XG5cdFx0XHRXQ0FQRi5pbml0RmlsdGVyT3B0aW9uVG9vbHRpcCgpO1xuXHRcdH0sXG5cdFx0aW5pdFBvcFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnJlbG9hZF9vbl9iYWNrICYmIHdjYXBmX3BhcmFtcy5mb3VuZF93Y2FwZiApIHtcblx0XHRcdFx0aGlzdG9yeS5yZXBsYWNlU3RhdGUoIHsgd2NhcGY6IHRydWUgfSwgJycsIHdpbmRvdy5sb2NhdGlvbiApO1xuXG5cdFx0XHRcdC8vIEhhbmRsZSB0aGUgcG9wc3RhdGUgZXZlbnQoYnJvd3NlcidzIGJhY2svZm9yd2FyZClcblx0XHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdwb3BzdGF0ZScsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdGlmICggbnVsbCAhPT0gZS5zdGF0ZSAmJiBlLnN0YXRlLmhhc093blByb3BlcnR5KCAnd2NhcGYnICkgKSB7XG5cdFx0XHRcdFx0XHRXQ0FQRi5maWx0ZXJQcm9kdWN0cyggJ3BvcHN0YXRlJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICogRW5hYmxlIGl0IGlmIG5lY2Vzc2FyeS5cblx0ICpcblx0ICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzMwMDQ5MTdcblx0ICovXG5cdGlmICggJ3Njcm9sbFJlc3RvcmF0aW9uJyBpbiBoaXN0b3J5ICkge1xuXHRcdC8vIGhpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb24gPSAnbWFudWFsJztcblx0fVxuXG59KCBqUXVlcnksIHdpbmRvdyApICk7XG5cbiggZnVuY3Rpb24oICQsIFdDQVBGICkge1xuXG5cdFdDQVBGLmluaXQoKTtcblx0V0NBUEYuaW5pdFBvcFN0YXRlKCk7XG5cblx0V0NBUEYuaGFuZGxlRmlsdGVyQWNjb3JkaW9uKCk7XG5cdFdDQVBGLmhhbmRsZUhpZXJhcmNoeVRvZ2dsZSgpO1xuXHRXQ0FQRi5oYW5kbGVTb2Z0TGltaXQoKTtcblx0V0NBUEYuaGFuZGxlU2VhcmNoRmlsdGVyT3B0aW9ucygpO1xuXG5cdFdDQVBGLmhhbmRsZUxpc3RGaWx0ZXJzKCk7XG5cdFdDQVBGLmhhbmRsZURyb3Bkb3duRmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVOdW1iZXJJbnB1dEZpbHRlcnMoKTtcblx0V0NBUEYuaGFuZGxlRGF0ZUlucHV0RmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVQYWdpbmF0aW9uKCk7XG5cdFdDQVBGLmhhbmRsZURlZmF1bHRPcmRlcmJ5KCk7XG5cblx0V0NBUEYuaGFuZGxlQ2xlYXJGaWx0ZXIoKTtcblxuXHRXQ0FQRi5oYW5kbGVGaWx0ZXJUb29sdGlwKCk7XG5cblx0LyoqXG5cdCAqIE1ha2UgaXQgY29tcGF0aWJsZSB3aXRoIG90aGVyIHBsdWdpbnMuXG5cdCAqL1xuXHQkKCBkb2N1bWVudCApLm9uKCAnd2NhcGZfYWZ0ZXJfdXBkYXRpbmdfcHJvZHVjdHMnLCBmdW5jdGlvbigpIHtcblx0XHQvLyB3b28tdmFyaWF0aW9uLXN3YXRjaGVzXG5cdFx0JCggZG9jdW1lbnQgKS50cmlnZ2VyKCAnd29vX3ZhcmlhdGlvbl9zd2F0Y2hlc19wcm9faW5pdCcgKTtcblx0fSApO1xuXG59KCBqUXVlcnksIHdpbmRvdy5XQ0FQRiApICk7XG4iLCIvKipcbiAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM0MTQxODEzXG4gKlxuICogQHBhcmFtIG51bWJlclxuICogQHBhcmFtIGRlY2ltYWxzXG4gKiBAcGFyYW0gZGVjX3BvaW50XG4gKiBAcGFyYW0gdGhvdXNhbmRzX3NlcFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIG51bWJlckZvcm1hdCggbnVtYmVyLCBkZWNpbWFscywgZGVjX3BvaW50LCB0aG91c2FuZHNfc2VwICkge1xuXHQvLyBTdHJpcCBhbGwgY2hhcmFjdGVycyBidXQgbnVtZXJpY2FsIG9uZXMuXG5cdG51bWJlciA9ICggbnVtYmVyICsgJycgKS5yZXBsYWNlKCAvW15cXGQrXFwtRWUuXS9nLCAnJyApO1xuXG5cdGNvbnN0IG4gICAgPSAhIGlzRmluaXRlKCArbnVtYmVyICkgPyAwIDogK251bWJlcjtcblx0Y29uc3QgcHJlYyA9ICEgaXNGaW5pdGUoICtkZWNpbWFscyApID8gMCA6IE1hdGguYWJzKCBkZWNpbWFscyApO1xuXHRjb25zdCBzZXAgID0gKCB0eXBlb2YgdGhvdXNhbmRzX3NlcCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcsJyA6IHRob3VzYW5kc19zZXA7XG5cdGNvbnN0IGRlYyAgPSAoIHR5cGVvZiBkZWNfcG9pbnQgPT09ICd1bmRlZmluZWQnICkgPyAnLicgOiBkZWNfcG9pbnQ7XG5cblx0bGV0IHM7XG5cblx0Y29uc3QgdG9GaXhlZEZpeCA9IGZ1bmN0aW9uKCBuLCBwcmVjICkge1xuXHRcdGNvbnN0IGsgPSBNYXRoLnBvdyggMTAsIHByZWMgKTtcblx0XHRyZXR1cm4gJycgKyBNYXRoLnJvdW5kKCBuICogayApIC8gaztcblx0fTtcblxuXHQvLyBGaXggZm9yIElFIHBhcnNlRmxvYXQoMC41NSkudG9GaXhlZCgwKSA9IDA7XG5cdHMgPSAoIHByZWMgPyB0b0ZpeGVkRml4KCBuLCBwcmVjICkgOiAnJyArIE1hdGgucm91bmQoIG4gKSApLnNwbGl0KCAnLicgKTtcblxuXHRpZiAoIHNbIDAgXS5sZW5ndGggPiAzICkge1xuXHRcdHNbIDAgXSA9IHNbIDAgXS5yZXBsYWNlKCAvXFxCKD89KD86XFxkezN9KSsoPyFcXGQpKS9nLCBzZXAgKTtcblx0fVxuXG5cdGlmICggKCBzWyAxIF0gfHwgJycgKS5sZW5ndGggPCBwcmVjICkge1xuXHRcdHNbIDEgXSA9IHNbIDEgXSB8fCAnJztcblx0XHRzWyAxIF0gKz0gbmV3IEFycmF5KCBwcmVjIC0gc1sgMSBdLmxlbmd0aCArIDEgKS5qb2luKCAnMCcgKTtcblx0fVxuXG5cdHJldHVybiBzLmpvaW4oIGRlYyApO1xufVxuXG5mdW5jdGlvbiBjbGVhblVybCggdXJsICkge1xuXHRyZXR1cm4gdXJsLnJlcGxhY2UoIC8lMkMvZywgJywnICk7XG59XG5cbmZ1bmN0aW9uIGdldE9yZGVyQnlVcmwoIHVybCApIHtcblx0Y29uc3QgcGFnZWQgPSBwYXJzZUludCggdXJsLnJlcGxhY2UoIC8uK1xcL3BhZ2VcXC8oXFxkKykrLywgJyQxJyApICk7XG5cblx0aWYgKCBwYWdlZCApIHtcblx0XHR1cmwgPSB1cmwucmVwbGFjZSggL3BhZ2VcXC8oXFxkKylcXC8vLCAnJyApO1xuXHR9XG5cblx0cmV0dXJuIGNsZWFuVXJsKCB1cmwgKTtcbn1cbiJdfQ==
