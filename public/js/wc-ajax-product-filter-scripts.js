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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJ1dGlscy5qcyJdLCJuYW1lcyI6WyJ3Y2FwZl9wYXJhbXMiLCIkIiwid2luZG93IiwiX2RlbGF5IiwicGFyc2VJbnQiLCJmaWx0ZXJfaW5wdXRfZGVsYXkiLCJkZWxheSIsImlzUHJvIiwid2NhcGZfcHJvIiwiJGJvZHkiLCIkZG9jdW1lbnQiLCJkb2N1bWVudCIsImluc3RhbmNlSWRzIiwiZGVmYXVsdE9yZGVyQnlFbGVtZW50Iiwib3JkZXJieV9mb3JtIiwib3JkZXJieV9lbGVtZW50IiwiZWFjaCIsImlkIiwiZGF0YSIsInB1c2giLCJ0aXBweUluc3RhbmNlcyIsIldDQVBGIiwiaGFuZGxlRmlsdGVyQWNjb3JkaW9uIiwidG9nZ2xlQWNjb3JkaW9uIiwiJGVsIiwicHJlc3NlZCIsImF0dHIiLCIkZmlsdGVySW5uZXIiLCJjbG9zZXN0IiwiY2hpbGRyZW4iLCJlbmFibGVfYW5pbWF0aW9uX2Zvcl9maWx0ZXJfYWNjb3JkaW9uIiwic2xpZGVUb2dnbGUiLCJmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsInRvZ2dsZSIsIm9uIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsIiR0cmlnZ2VyIiwiZmluZCIsImhhbmRsZUhpZXJhcmNoeVRvZ2dsZSIsIiRjaGlsZCIsImVuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24iLCJoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsImtleSIsInByZXZlbnREZWZhdWx0IiwiaGFuZGxlU29mdExpbWl0IiwidG9nZ2xlRmlsdGVyT3B0aW9ucyIsIiRsaXN0V3JhcHBlciIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJoYW5kbGVTZWFyY2hGaWx0ZXJPcHRpb25zIiwiJHRoYXQiLCIkaW5uZXIiLCIkZmlsdGVyIiwic29mdExpbWl0RW5hYmxlZCIsImhhc0NsYXNzIiwic29mdExpbWl0VG9nZ2xlIiwibm9SZXN1bHRzIiwidmlzaWJsZU9wdGlvbnMiLCJrZXl3b3JkIiwidmFsIiwibGVuZ3RoIiwiaW5kZXgiLCIkZmlsdGVySXRlbSIsInJlbW92ZUF0dHIiLCJ0ZXh0IiwiaGlkZSIsImxhYmVsIiwidG9TdHJpbmciLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwic2hvdyIsInVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQiLCIkcmVzcG9uc2UiLCIkY29udGFpbmVyIiwic2hvcF9sb29wX2NvbnRhaW5lciIsInNlbGVjdG9yIiwibmV3Q291bnQiLCJodG1sIiwiaGFzIiwic2Nyb2xsVG8iLCJzY3JvbGxfd2luZG93Iiwic2Nyb2xsRm9yIiwic2Nyb2xsX3dpbmRvd19mb3IiLCJpc01vYmlsZSIsImlzX21vYmlsZSIsInByb2NlZWQiLCJhZGp1c3RpbmdPZmZzZXQiLCJvZmZzZXQiLCJzY3JvbGxfdG9fdG9wX29mZnNldCIsImNvbnRhaW5lciIsIm5vdF9mb3VuZF9jb250YWluZXIiLCJzY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50IiwidG9wIiwic3RvcCIsImFuaW1hdGUiLCJzY3JvbGxUb3AiLCJzY3JvbGxfdG9fdG9wX3NwZWVkIiwic2Nyb2xsX3RvX3RvcF9lYXNpbmciLCJiZWZvcmVGZXRjaGluZ1Byb2R1Y3RzIiwidHJpZ2dlcmVkQnkiLCJzY3JvbGxfd2luZG93X3doZW4iLCJ0cmlnZ2VyIiwiZGVzdHJveVRpcHB5SW5zdGFuY2VzIiwidXNlX3RpcHB5anMiLCJmb3JFYWNoIiwiaW5zdGFuY2UiLCJkZXN0cm95IiwiYmVmb3JlVXBkYXRpbmdQcm9kdWN0cyIsImFmdGVyVXBkYXRpbmdQcm9kdWN0cyIsImluaXQiLCJjdXN0b21fc2NyaXB0cyIsImV2YWwiLCJmaWx0ZXJQcm9kdWN0cyIsImFqYXgiLCJ1cmwiLCJsb2NhdGlvbiIsImhyZWYiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJ1cGRhdGVfZG9jdW1lbnRfdGl0bGUiLCJ0aXRsZSIsImZpbHRlciIsImluc3RhbmNlSWQiLCIkaW5zdGFuY2UiLCJfaW5zdGFuY2UiLCJwcmVzZXJ2ZV9oaWVyYXJjaHlfYWNjb3JkaW9uX3N0YXRlIiwidG9nZ2xlU2VsZWN0b3IiLCJwcmVzZXJ2ZV9zb2Z0X2xpbWl0X3N0YXRlIiwiX2h0bWwiLCIkc2hvcExvb3BDb250YWluZXIiLCIkbm90Rm91bmRDb250YWluZXIiLCJyZXF1ZXN0RmlsdGVyIiwiZGlzYWJsZV9hamF4IiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsIndjYXBmIiwiaGFuZGxlTnVtYmVySW5wdXRGaWx0ZXJzIiwicmFuZ2VOdW1iZXJTZWxlY3RvcnMiLCIkaXRlbSIsIiRyYW5nZU51bWJlciIsImZvcm1hdE51bWJlcnMiLCJyYW5nZU1pblZhbHVlIiwicGFyc2VGbG9hdCIsInJhbmdlTWF4VmFsdWUiLCJvbGRNaW5WYWx1ZSIsIm9sZE1heFZhbHVlIiwiZGVjaW1hbFBsYWNlcyIsInRob3VzYW5kU2VwYXJhdG9yIiwiZGVjaW1hbFNlcGFyYXRvciIsImNsZWFyVGltZW91dCIsImdldFZhbHVlIiwiZmxvYXRWYWx1ZSIsIm51bWJlckZvcm1hdCIsInNldFRpbWVvdXQiLCJyZW1vdmVEYXRhIiwibWluVmFsdWUiLCJtYXhWYWx1ZSIsImlzTmFOIiwicmVwbGFjZSIsImhhbmRsZURhdGVJbnB1dEZpbHRlcnMiLCJpc1JhbmdlIiwiZmlsdGVyVXJsIiwiZnJvbSIsInRvIiwiaGFuZGxlTGlzdEZpbHRlcnMiLCJuYXRpdmVJbnB1dHMiLCJ0b2dnbGVDbGFzcyIsImN1c3RvbVJhZGlvU2VsZWN0b3IiLCJub3QiLCJwcm9wIiwiaGFuZGxlRHJvcGRvd25GaWx0ZXJzIiwiJHNlbGVjdCIsInZhbHVlcyIsImZpbHRlclVSTCIsImNsZWFyRmlsdGVyVVJMIiwiaGFuZGxlUGFnaW5hdGlvbiIsImVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4IiwicGFnaW5hdGlvbl9jb250YWluZXIiLCJfc2VsZWN0b3JzIiwic3BsaXQiLCJzZWxlY3RvcnMiLCJqb2luIiwiaGFuZGxlRGVmYXVsdE9yZGVyYnkiLCJzb3J0aW5nX2NvbnRyb2wiLCJvcmRlciIsIlVSTCIsInNlYXJjaFBhcmFtcyIsInNldCIsImdldE9yZGVyQnlVcmwiLCJoYW5kbGVDbGVhckZpbHRlciIsImhhbmRsZUZpbHRlclRvb2x0aXAiLCJ0aXBweSIsInBsYWNlbWVudCIsImNvbnRlbnQiLCJyZWZlcmVuY2UiLCJnZXRBdHRyaWJ1dGUiLCJhbGxvd0hUTUwiLCJpbml0Q29tYm9ib3giLCJqUXVlcnkiLCJjaG9zZW5XQ0FQRiIsInRlbXBsYXRlUmVzdWx0IiwidGVtcGxhdGVTZWxlY3Rpb24iLCJjb3VudCIsImRlZmF1bHRzIiwiaW5oZXJpdF9zZWxlY3RfY2xhc3NlcyIsImluaGVyaXRfb3B0aW9uX2NsYXNzZXMiLCJub19yZXN1bHRzX3RleHQiLCJjb21ib2JveF9ub19yZXN1bHRzX3RleHQiLCJvcHRpb25zX25vbmVfdGV4dCIsImNvbWJvYm94X29wdGlvbnNfbm9uZV90ZXh0Iiwic2VhcmNoX2NvbnRhaW5zIiwic2VhcmNoX2luX3ZhbHVlcyIsImlzX3J0bCIsIiR0aGlzIiwib3B0aW9ucyIsImNvbWJvYm94X2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucyIsImF0dGFjaF9jb21ib2JveF9vbl9zb3J0aW5nIiwiZGlzYWJsZVNlYXJjaCIsInNlYXJjaF9ib3hfaW5fZGVmYXVsdF9vcmRlcmJ5IiwiaW5pdFJhbmdlU2xpZGVyIiwibm9VaVNsaWRlciIsIiRzbGlkZXIiLCJzbGlkZXJJZCIsImRpc3BsYXlWYWx1ZXNBcyIsInN0ZXAiLCIkbWluVmFsdWUiLCIkbWF4VmFsdWUiLCJzbGlkZXIiLCJnZXRFbGVtZW50QnlJZCIsImNyZWF0ZSIsInN0YXJ0IiwiY29ubmVjdCIsImNzc1ByZWZpeCIsInJhbmdlIiwiZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciIsIl9taW5WYWx1ZSIsIl9tYXhWYWx1ZSIsIiRpbnB1dCIsImdldCIsImluaXREYXRlcGlja2VyIiwiZGF0ZXBpY2tlciIsIiR3Y2FwZkRhdGVGaWx0ZXIiLCJmb3JtYXQiLCJ5ZWFyRHJvcGRvd24iLCJtb250aERyb3Bkb3duIiwiJGZyb20iLCIkdG8iLCJkYXRlRm9ybWF0IiwiY2hhbmdlWWVhciIsImNoYW5nZU1vbnRoIiwiaW5pdEZpbHRlck9wdGlvblRvb2x0aXAiLCJ0b29sdGlwUG9zaXRpb25zIiwidG9vbHRpcFBvc2l0aW9uIiwiaWRlbnRpZmllciIsImluc3RhbmNlcyIsImNvbmNhdCIsImluaXRQb3BTdGF0ZSIsInJlbG9hZF9vbl9iYWNrIiwiZm91bmRfd2NhcGYiLCJyZXBsYWNlU3RhdGUiLCJhZGRFdmVudExpc3RlbmVyIiwic3RhdGUiLCJoYXNPd25Qcm9wZXJ0eSIsIm51bWJlciIsImRlY2ltYWxzIiwiZGVjX3BvaW50IiwidGhvdXNhbmRzX3NlcCIsIm4iLCJpc0Zpbml0ZSIsInByZWMiLCJNYXRoIiwiYWJzIiwic2VwIiwiZGVjIiwicyIsInRvRml4ZWRGaXgiLCJrIiwicG93Iiwicm91bmQiLCJBcnJheSIsImNsZWFuVXJsIiwicGFnZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLFlBQVksR0FBR0EsWUFBWSxJQUFJO0FBQ3BDLFlBQVUsRUFEMEI7QUFFcEMsd0JBQXNCLEVBRmM7QUFHcEMsdUNBQXFDLEVBSEQ7QUFJcEMsOEJBQTRCLEVBSlE7QUFLcEMsZ0NBQThCLEVBTE07QUFNcEMsbUNBQWlDLEVBTkc7QUFPcEMsd0NBQXNDLEVBUEY7QUFRcEMsK0JBQTZCLEVBUk87QUFTcEMsMkNBQXlDLEVBVEw7QUFVcEMsc0NBQW9DLEVBVkE7QUFXcEMsdUNBQXFDLEVBWEQ7QUFZcEMsOENBQTRDLEVBWlI7QUFhcEMseUNBQXVDLEVBYkg7QUFjcEMsMENBQXdDLEVBZEo7QUFlcEMseUJBQXVCLEVBZmE7QUFnQnBDLDBCQUF3QixFQWhCWTtBQWlCcEMsZUFBYSxFQWpCdUI7QUFrQnBDLG9C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eUgsSUFBdEMsQ0FBNEMsR0FBNUMsQ0FBVjtBQUNBOztBQUVELFNBQU82RixDQUFDLENBQUM3RixJQUFGLENBQVE0RixHQUFSLENBQVA7QUFDQTs7QUFFRCxTQUFTTyxRQUFULENBQW1CdEssR0FBbkIsRUFBeUI7QUFDeEIsU0FBT0EsR0FBRyxDQUFDNEMsT0FBSixDQUFhLE1BQWIsRUFBcUIsR0FBckIsQ0FBUDtBQUNBOztBQUVELFNBQVM4QixhQUFULENBQXdCMUUsR0FBeEIsRUFBOEI7QUFDN0IsTUFBTXVLLEtBQUssR0FBR3hSLFFBQVEsQ0FBRWlILEdBQUcsQ0FBQzRDLE9BQUosQ0FBYSxrQkFBYixFQUFpQyxJQUFqQyxDQUFGLENBQXRCOztBQUVBLE1BQUsySCxLQUFMLEVBQWE7QUFDWnZLLElBQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDNEMsT0FBSixDQUFhLGVBQWIsRUFBOEIsRUFBOUIsQ0FBTjtBQUNBOztBQUVELFNBQU8wSCxRQUFRLENBQUV0SyxHQUFGLENBQWY7QUFDQSIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLXNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSBtYWluIGpzIGZpbGUuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvcHVibGljL3NyYy9qc1xuICogQGF1dGhvciAgICAgd3B0b29scy5pb1xuICovXG5cbmNvbnN0IHdjYXBmX3BhcmFtcyA9IHdjYXBmX3BhcmFtcyB8fCB7XG5cdCdpc19ydGwnOiAnJyxcblx0J2ZpbHRlcl9pbnB1dF9kZWxheSc6ICcnLFxuXHQnY29tYm9ib3hfZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJzogJycsXG5cdCdjb21ib2JveF9ub19yZXN1bHRzX3RleHQnOiAnJyxcblx0J2NvbWJvYm94X29wdGlvbnNfbm9uZV90ZXh0JzogJycsXG5cdCdzZWFyY2hfYm94X2luX2RlZmF1bHRfb3JkZXJieSc6ICcnLFxuXHQncHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSc6ICcnLFxuXHQncHJlc2VydmVfc29mdF9saW1pdF9zdGF0ZSc6ICcnLFxuXHQnZW5hYmxlX2FuaW1hdGlvbl9mb3JfZmlsdGVyX2FjY29yZGlvbic6ICcnLFxuXHQnZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQnOiAnJyxcblx0J2ZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyc6ICcnLFxuXHQnZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbic6ICcnLFxuXHQnaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQnOiAnJyxcblx0J2hpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyc6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9zcGVlZCc6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9lYXNpbmcnOiAnJyxcblx0J2lzX21vYmlsZSc6ICcnLFxuXHQncmVsb2FkX29uX2JhY2snOiAnJyxcblx0J2ZvdW5kX3djYXBmJzogJycsXG5cdCd3Y2FwZl9wcm8nOiAnJyxcblx0J3VwZGF0ZV9kb2N1bWVudF90aXRsZSc6ICcnLFxuXHQndXNlX3RpcHB5anMnOiAnJyxcblx0J3Nob3BfbG9vcF9jb250YWluZXInOiAnJyxcblx0J25vdF9mb3VuZF9jb250YWluZXInOiAnJyxcblx0J3BhZ2luYXRpb25fY29udGFpbmVyJzogJycsXG5cdCdvcmRlcmJ5X2Zvcm0nOiAnJyxcblx0J29yZGVyYnlfZWxlbWVudCc6ICcnLFxuXHQnZGlzYWJsZV9hamF4JzogJycsXG5cdCdlbmFibGVfcGFnaW5hdGlvbl92aWFfYWpheCc6ICcnLFxuXHQnc29ydGluZ19jb250cm9sJzogJycsXG5cdCdhdHRhY2hfY29tYm9ib3hfb25fc29ydGluZyc6ICcnLFxuXHQnbG9hZGluZ19hbmltYXRpb24nOiAnJyxcblx0J3Njcm9sbF93aW5kb3cnOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfZm9yJzogJycsXG5cdCdzY3JvbGxfd2luZG93X3doZW4nOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfY3VzdG9tX2VsZW1lbnQnOiAnJyxcblx0J3Njcm9sbF9vbic6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9vZmZzZXQnOiAnJyxcblx0J2Rpc2FibGVfc2Nyb2xsX2FuaW1hdGlvbic6ICcnLFxuXHQnbW9yZV9zZWxlY3RvcnMnOiAnJyxcblx0J2N1c3RvbV9zY3JpcHRzJzogJycsXG59O1xuXG4oIGZ1bmN0aW9uKCAkLCB3aW5kb3cgKSB7XG5cblx0Y29uc3QgX2RlbGF5ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5maWx0ZXJfaW5wdXRfZGVsYXkgKTtcblx0Y29uc3QgZGVsYXkgID0gX2RlbGF5ID49IDAgPyBfZGVsYXkgOiAzMDA7XG5cblx0Y29uc3QgaXNQcm8gPSB3Y2FwZl9wYXJhbXMud2NhcGZfcHJvO1xuXG5cdGNvbnN0ICRib2R5ICAgICA9ICQoICdib2R5JyApO1xuXHRjb25zdCAkZG9jdW1lbnQgPSAkKCBkb2N1bWVudCApO1xuXG5cdGNvbnN0IGluc3RhbmNlSWRzID0gW107XG5cblx0Y29uc3QgZGVmYXVsdE9yZGVyQnlFbGVtZW50ID0gd2NhcGZfcGFyYW1zLm9yZGVyYnlfZm9ybSArICcgJyArIHdjYXBmX3BhcmFtcy5vcmRlcmJ5X2VsZW1lbnQ7XG5cblx0JCggJy53Y2FwZi1maWx0ZXInICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgaWQgPSAkKCB0aGlzICkuZGF0YSggJ2lkJyApO1xuXG5cdFx0aWYgKCAhIGlkICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGluc3RhbmNlSWRzLnB1c2goIGlkICk7XG5cdH0gKTtcblxuXHR3aW5kb3cudGlwcHlJbnN0YW5jZXMgPSBbXTtcblxuXHR3aW5kb3cuV0NBUEYgPSB3aW5kb3cuV0NBUEYgfHwge307XG5cblx0d2luZG93LldDQVBGID0ge1xuXHRcdGhhbmRsZUZpbHRlckFjY29yZGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCB0b2dnbGVBY2NvcmRpb24gPSAoICRlbCApID0+IHtcblx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBhY2NvcmRpb24gaXMgb3BlbmVkXG5cdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtZXhwYW5kZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHQvLyBDaGFuZ2UgYXJpYS1leHBhbmRlZCB0byB0aGUgb3Bwb3NpdGUgc3RhdGVcblx0XHRcdFx0JGVsLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgISBwcmVzc2VkICk7XG5cblx0XHRcdFx0Y29uc3QgJGZpbHRlcklubmVyID0gJGVsLmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyJyApLmNoaWxkcmVuKCAnLndjYXBmLWZpbHRlci1pbm5lcicgKTtcblxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfYW5pbWF0aW9uX2Zvcl9maWx0ZXJfYWNjb3JkaW9uICkge1xuXHRcdFx0XHRcdCRmaWx0ZXJJbm5lci5zbGlkZVRvZ2dsZShcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5maWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCxcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5maWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmdcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRmaWx0ZXJJbm5lci50b2dnbGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtZmlsdGVyLWFjY29yZGlvbi10cmlnZ2VyJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkKCB0aGlzICkgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtZmlsdGVyLXRpdGxlLmhhcy1hY2NvcmRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRyaWdnZXIgPSAkKCB0aGlzICkuZmluZCggJy53Y2FwZi1maWx0ZXItYWNjb3JkaW9uLXRyaWdnZXInICk7XG5cblx0XHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkdHJpZ2dlciApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlSGllcmFyY2h5VG9nZ2xlOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHRvZ2dsZUFjY29yZGlvbiA9ICggJGVsICkgPT4ge1xuXHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGJ1dHRvbiBpcyBwcmVzc2VkXG5cdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdC8vIENoYW5nZSBhcmlhLXByZXNzZWQgdG8gdGhlIG9wcG9zaXRlIHN0YXRlXG5cdFx0XHRcdCRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJywgISBwcmVzc2VkICk7XG5cblx0XHRcdFx0Y29uc3QgJGNoaWxkID0gJGVsLmNsb3Nlc3QoICdsaScgKS5jaGlsZHJlbiggJ3VsJyApO1xuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24gKSB7XG5cdFx0XHRcdFx0JGNoaWxkLnNsaWRlVG9nZ2xlKFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkLFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZ1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JGNoaWxkLnRvZ2dsZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHQkYm9keVxuXHRcdFx0XHQub24oICdjbGljaycsICcud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdFx0XHR9IClcblx0XHRcdFx0Lm9uKCAna2V5ZG93bicsICcud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRpZiAoIGUua2V5ID09PSAnICcgfHwgZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICdTcGFjZWJhcicgKSB7XG5cdFx0XHRcdFx0XHQvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvbiB0byBzdG9wIHNjcm9sbGluZyB3aGVuIHNwYWNlIGlzIHByZXNzZWRcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkKCB0aGlzICkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZVNvZnRMaW1pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCB0b2dnbGVGaWx0ZXJPcHRpb25zID0gKCAkZWwgKSA9PiB7XG5cdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYnV0dG9uIGlzIHByZXNzZWRcblx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0Ly8gQ2hhbmdlIGFyaWEtcHJlc3NlZCB0byB0aGUgb3Bwb3NpdGUgc3RhdGVcblx0XHRcdFx0JGVsLmF0dHIoICdhcmlhLXByZXNzZWQnLCAhIHByZXNzZWQgKTtcblxuXHRcdFx0XHRjb25zdCAkbGlzdFdyYXBwZXIgPSAkZWwuY2xvc2VzdCggJy53Y2FwZi1saXN0LXdyYXBwZXInICk7XG5cblx0XHRcdFx0aWYgKCBwcmVzc2VkICkge1xuXHRcdFx0XHRcdCRsaXN0V3JhcHBlci5yZW1vdmVDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JGxpc3RXcmFwcGVyLmFkZENsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0JGJvZHlcblx0XHRcdFx0Lm9uKCAnY2xpY2snLCAnLndjYXBmLXNvZnQtbGltaXQtdHJpZ2dlcicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRvZ2dsZUZpbHRlck9wdGlvbnMoICQoIHRoaXMgKSApO1xuXHRcdFx0XHR9IClcblx0XHRcdFx0Lm9uKCAna2V5ZG93bicsICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0aWYgKCBlLmtleSA9PT0gJyAnIHx8IGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnU3BhY2ViYXInICkge1xuXHRcdFx0XHRcdFx0Ly8gUHJldmVudCB0aGUgZGVmYXVsdCBhY3Rpb24gdG8gc3RvcCBzY3JvbGxpbmcgd2hlbiBzcGFjZSBpcyBwcmVzc2VkXG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRcdHRvZ2dsZUZpbHRlck9wdGlvbnMoICQoIHRoaXMgKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlU2VhcmNoRmlsdGVyT3B0aW9uczogZnVuY3Rpb24oKSB7XG5cdFx0XHQkYm9keS5vbiggJ2lucHV0JywgJy53Y2FwZi1zZWFyY2gtYm94IGlucHV0W3R5cGU9XCJ0ZXh0XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0aGF0ICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0ICRpbm5lciAgPSAkdGhhdC5jbG9zZXN0KCAnLndjYXBmLWZpbHRlci1pbm5lcicgKTtcblx0XHRcdFx0Y29uc3QgJGZpbHRlciA9ICRpbm5lci5jbG9zZXN0KCAnLndjYXBmLWZpbHRlcicgKTtcblxuXHRcdFx0XHRjb25zdCBzb2Z0TGltaXRFbmFibGVkID0gJGZpbHRlci5oYXNDbGFzcyggJ2hhcy1zb2Z0LWxpbWl0JyApO1xuXHRcdFx0XHRjb25zdCBzb2Z0TGltaXRUb2dnbGUgID0gJGZpbHRlci5maW5kKCAnLndjYXBmLXNvZnQtbGltaXQtd3JhcHBlcicgKTtcblx0XHRcdFx0Y29uc3Qgbm9SZXN1bHRzICAgICAgICA9ICRmaWx0ZXIuZmluZCggJy53Y2FwZi1uby1yZXN1bHRzLXRleHQnICk7XG5cdFx0XHRcdGNvbnN0IHZpc2libGVPcHRpb25zICAgPSBwYXJzZUludCggJGZpbHRlci5hdHRyKCAnZGF0YS12aXNpYmxlLW9wdGlvbnMnICkgKTtcblxuXHRcdFx0XHRjb25zdCBrZXl3b3JkID0gJHRoYXQudmFsKCk7XG5cblx0XHRcdFx0aWYgKCAhIGtleXdvcmQubGVuZ3RoICkge1xuXHRcdFx0XHRcdGxldCBpbmRleCA9IDA7XG5cdFx0XHRcdFx0JGZpbHRlci5yZW1vdmVDbGFzcyggJ3NlYXJjaC1hY3RpdmUnICk7XG5cblx0XHRcdFx0XHQkLmVhY2goICRpbm5lci5maW5kKCAnLndjYXBmLWZpbHRlci1vcHRpb25zID4gbGknICksIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0aW5kZXgrKztcblxuXHRcdFx0XHRcdFx0Y29uc3QgJGZpbHRlckl0ZW0gPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5yZW1vdmVDbGFzcyggJ2tleXdvcmQtbWF0Y2hlZCcgKTtcblxuXHRcdFx0XHRcdFx0aWYgKCBzb2Z0TGltaXRFbmFibGVkICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIGluZGV4ID4gdmlzaWJsZU9wdGlvbnMgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0uYWRkQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5yZW1vdmVDbGFzcyggJ3djYXBmLWZpbHRlci1vcHRpb24taGlkZGVuJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdFx0aWYgKCBzb2Z0TGltaXRFbmFibGVkICkge1xuXHRcdFx0XHRcdFx0c29mdExpbWl0VG9nZ2xlLnJlbW92ZUF0dHIoICdzdHlsZScgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRub1Jlc3VsdHMuY2hpbGRyZW4oICdzcGFuJyApLnRleHQoICcnICk7XG5cdFx0XHRcdFx0bm9SZXN1bHRzLmhpZGUoKTtcblxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCBpbmRleCA9IDA7XG5cdFx0XHRcdCRmaWx0ZXIuYWRkQ2xhc3MoICdzZWFyY2gtYWN0aXZlJyApO1xuXG5cdFx0XHRcdCQuZWFjaCggJGlubmVyLmZpbmQoICcud2NhcGYtZmlsdGVyLW9wdGlvbnMgPiBsaScgKSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGZpbHRlckl0ZW0gPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0Y29uc3QgbGFiZWwgICAgICAgPSAkZmlsdGVySXRlbS5maW5kKCAnLndjYXBmLWZpbHRlci1pdGVtLWxhYmVsJyApLmRhdGEoICdsYWJlbCcgKTtcblxuXHRcdFx0XHRcdGlmICggbGFiZWwudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCBrZXl3b3JkLnRvTG93ZXJDYXNlKCkgKSApIHtcblx0XHRcdFx0XHRcdGluZGV4Kys7XG5cblx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLmFkZENsYXNzKCAna2V5d29yZC1tYXRjaGVkJyApO1xuXG5cdFx0XHRcdFx0XHRpZiAoIHNvZnRMaW1pdEVuYWJsZWQgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggaW5kZXggPiB2aXNpYmxlT3B0aW9ucyApIHtcblx0XHRcdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5hZGRDbGFzcyggJ3djYXBmLWZpbHRlci1vcHRpb24taGlkZGVuJyApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLnJlbW92ZUNsYXNzKCAnd2NhcGYtZmlsdGVyLW9wdGlvbi1oaWRkZW4nICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICdrZXl3b3JkLW1hdGNoZWQnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0aWYgKCBzb2Z0TGltaXRFbmFibGVkICkge1xuXHRcdFx0XHRcdGlmICggaW5kZXggPD0gdmlzaWJsZU9wdGlvbnMgKSB7XG5cdFx0XHRcdFx0XHRzb2Z0TGltaXRUb2dnbGUuaGlkZSgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzb2Z0TGltaXRUb2dnbGUuc2hvdygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggMCA9PT0gaW5kZXggKSB7XG5cdFx0XHRcdFx0bm9SZXN1bHRzLmNoaWxkcmVuKCAnc3BhbicgKS50ZXh0KCBrZXl3b3JkICk7XG5cdFx0XHRcdFx0bm9SZXN1bHRzLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRub1Jlc3VsdHMuY2hpbGRyZW4oICdzcGFuJyApLnRleHQoICcnICk7XG5cdFx0XHRcdFx0bm9SZXN1bHRzLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0dXBkYXRlUHJvZHVjdHNDb3VudFJlc3VsdDogZnVuY3Rpb24oICRyZXNwb25zZSApIHtcblx0XHRcdGNvbnN0ICRjb250YWluZXIgPSAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3IgICA9ICcud29vY29tbWVyY2UtcmVzdWx0LWNvdW50Jztcblx0XHRcdGNvbnN0IG5ld0NvdW50ICAgPSAkcmVzcG9uc2UuZmluZCggc2VsZWN0b3IgKS5odG1sKCk7XG5cblx0XHRcdCRib2R5LmZpbmQoIHNlbGVjdG9yICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRlbCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRpZiAoICEgJGNvbnRhaW5lci5oYXMoICRlbCApLmxlbmd0aCApIHtcblx0XHRcdFx0XHQkZWwuaHRtbCggbmV3Q291bnQgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0c2Nyb2xsVG86IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAnbm9uZScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHNjcm9sbEZvciA9IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X2Zvcjtcblx0XHRcdGNvbnN0IGlzTW9iaWxlICA9IHdjYXBmX3BhcmFtcy5pc19tb2JpbGU7XG5cdFx0XHRsZXQgcHJvY2VlZCAgICAgPSBmYWxzZTtcblxuXHRcdFx0aWYgKCAnbW9iaWxlJyA9PT0gc2Nyb2xsRm9yICYmIGlzTW9iaWxlICkge1xuXHRcdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSBpZiAoICdkZXNrdG9wJyA9PT0gc2Nyb2xsRm9yICYmICEgaXNNb2JpbGUgKSB7XG5cdFx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmICggJ2JvdGgnID09PSBzY3JvbGxGb3IgKSB7XG5cdFx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgcHJvY2VlZCApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgYWRqdXN0aW5nT2Zmc2V0ID0gMCwgb2Zmc2V0ID0gMDtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKSB7XG5cdFx0XHRcdGFkanVzdGluZ09mZnNldCA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGNvbnRhaW5lcjtcblxuXHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXI7XG5cdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXI7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggJ2N1c3RvbScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93ICkge1xuXHRcdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudDtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIGNvbnRhaW5lciApO1xuXG5cdFx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRvZmZzZXQgPSAkY29udGFpbmVyLm9mZnNldCgpLnRvcCAtIGFkanVzdGluZ09mZnNldDtcblxuXHRcdFx0XHRpZiAoIG9mZnNldCA8IDAgKSB7XG5cdFx0XHRcdFx0b2Zmc2V0ID0gMDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCQoICdodG1sLCBib2R5JyApLnN0b3AoKS5hbmltYXRlKFxuXHRcdFx0XHRcdHsgc2Nyb2xsVG9wOiBvZmZzZXQgfSxcblx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9zcGVlZCxcblx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9lYXNpbmdcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8vIFRoaW5ncyBhcmUgZG9uZSBiZWZvcmUgZmV0Y2hpbmcgdGhlIHByb2R1Y3RzIGxpa2Ugc2hvd2luZyB0aGUgbG9hZGluZyBpbmRpY2F0b3IuXG5cdFx0YmVmb3JlRmV0Y2hpbmdQcm9kdWN0czogZnVuY3Rpb24oIHRyaWdnZXJlZEJ5ICkge1xuXHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1sb2FkZXInICkuYWRkQ2xhc3MoICdpcy1hY3RpdmUnICk7XG5cblx0XHRcdGlmICggISBpc1BybyAmJiAnaW1tZWRpYXRlbHknID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd193aGVuICkge1xuXHRcdFx0XHRXQ0FQRi5zY3JvbGxUbygpO1xuXHRcdFx0fVxuXG5cdFx0XHQkZG9jdW1lbnQudHJpZ2dlciggJ3djYXBmX2JlZm9yZV9mZXRjaGluZ19wcm9kdWN0cycsIFsgdHJpZ2dlcmVkQnkgXSApO1xuXHRcdH0sXG5cdFx0ZGVzdHJveVRpcHB5SW5zdGFuY2VzOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnVzZV90aXBweWpzICkge1xuXHRcdFx0XHQvLyBAc291cmNlIGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9taWtzL3RpcHB5anMvaXNzdWVzLzQ3M1xuXHRcdFx0XHR0aXBweUluc3RhbmNlcy5mb3JFYWNoKCBpbnN0YW5jZSA9PiB7XG5cdFx0XHRcdFx0aW5zdGFuY2UuZGVzdHJveSgpO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHRcdHRpcHB5SW5zdGFuY2VzLmxlbmd0aCA9IDA7IC8vIGNsZWFyIGl0XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvLyBUaGluZ3MgYXJlIGRvbmUgYmVmb3JlIHVwZGF0aW5nIHRoZSBwcm9kdWN0cyBsaWtlIGhpZGluZyB0aGUgbG9hZGluZyBpbmRpY2F0b3IuXG5cdFx0YmVmb3JlVXBkYXRpbmdQcm9kdWN0czogZnVuY3Rpb24oICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgKSB7XG5cdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLWxvYWRlcicgKS5yZW1vdmVDbGFzcyggJ2lzLWFjdGl2ZScgKTtcblxuXHRcdFx0Ly8gTWF5YmUgZ29vZCBmb3IgcGVyZm9ybWFuY2UuXG5cdFx0XHRXQ0FQRi5kZXN0cm95VGlwcHlJbnN0YW5jZXMoKTtcblxuXHRcdFx0JGRvY3VtZW50LnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfdXBkYXRpbmdfcHJvZHVjdHMnLCBbICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgXSApO1xuXHRcdH0sXG5cdFx0YWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzOiBmdW5jdGlvbiggJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSApIHtcblx0XHRcdFdDQVBGLnVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQoICRyZXNwb25zZSApO1xuXG5cdFx0XHQvLyBSZWluaXRpYWxpemUgd2NhcGYuXG5cdFx0XHRXQ0FQRi5pbml0KCk7XG5cblx0XHRcdGlmICggISBpc1BybyAmJiAnYWZ0ZXInID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd193aGVuICkge1xuXHRcdFx0XHRXQ0FQRi5zY3JvbGxUbygpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUcmlnZ2VyIGV2ZW50cy5cblx0XHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggJ3JlYWR5JyApO1xuXHRcdFx0JCggd2luZG93ICkudHJpZ2dlciggJ3Njcm9sbCcgKTtcblx0XHRcdCQoIHdpbmRvdyApLnRyaWdnZXIoICdyZXNpemUnICk7XG5cblx0XHRcdC8vIEEzIExhenkgTG9hZCBzdXBwb3J0LlxuXHRcdFx0JCggd2luZG93ICkudHJpZ2dlciggJ2xhenlzaG93JyApO1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5jdXN0b21fc2NyaXB0cyApIHtcblx0XHRcdFx0ZXZhbCggd2NhcGZfcGFyYW1zLmN1c3RvbV9zY3JpcHRzICk7XG5cdFx0XHR9XG5cblx0XHRcdCRkb2N1bWVudC50cmlnZ2VyKCAnd2NhcGZfYWZ0ZXJfdXBkYXRpbmdfcHJvZHVjdHMnLCBbICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgXSApO1xuXHRcdH0sXG5cdFx0ZmlsdGVyUHJvZHVjdHM6IGZ1bmN0aW9uKCB0cmlnZ2VyZWRCeSA9ICdmaWx0ZXInICkge1xuXHRcdFx0V0NBUEYuYmVmb3JlRmV0Y2hpbmdQcm9kdWN0cyggdHJpZ2dlcmVkQnkgKTtcblxuXHRcdFx0JC5hamF4KCB7XG5cdFx0XHRcdHVybDogd2luZG93LmxvY2F0aW9uLmhyZWYsXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdFx0XHRjb25zdCAkcmVzcG9uc2UgPSAkKCByZXNwb25zZSApO1xuXG5cdFx0XHRcdFx0V0NBUEYuYmVmb3JlVXBkYXRpbmdQcm9kdWN0cyggJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSApO1xuXG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogVXBkYXRlIGRvY3VtZW50IHRpdGxlLlxuXHRcdFx0XHRcdCAqXG5cdFx0XHRcdFx0ICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNzU5OTU2MlxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnVwZGF0ZV9kb2N1bWVudF90aXRsZSApIHtcblx0XHRcdFx0XHRcdGRvY3VtZW50LnRpdGxlID0gJHJlc3BvbnNlLmZpbHRlciggJ3RpdGxlJyApLnRleHQoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBVcGRhdGUgdGhlIGluc3RhbmNlcy5cblx0XHRcdFx0XHRmb3IgKCBjb25zdCBpZCBvZiBpbnN0YW5jZUlkcyApIHtcblx0XHRcdFx0XHRcdGNvbnN0IGluc3RhbmNlSWQgPSAnW2RhdGEtaWQ9XCInICsgaWQgKyAnXCJdJztcblx0XHRcdFx0XHRcdGNvbnN0ICRpbnN0YW5jZSAgPSAkKCBpbnN0YW5jZUlkICk7XG5cdFx0XHRcdFx0XHRjb25zdCAkaW5uZXIgICAgID0gJGluc3RhbmNlLmZpbmQoICcud2NhcGYtZmlsdGVyLWlubmVyJyApO1xuXHRcdFx0XHRcdFx0Y29uc3QgX2luc3RhbmNlICA9ICRyZXNwb25zZS5maW5kKCBpbnN0YW5jZUlkICk7XG5cblx0XHRcdFx0XHRcdC8vIFByZXNlcnZlIGhpZXJhcmNoeSBhY2NvcmRpb24gc3RhdGUuXG5cdFx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5wcmVzZXJ2ZV9oaWVyYXJjaHlfYWNjb3JkaW9uX3N0YXRlICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRpbnN0YW5jZS5oYXNDbGFzcyggJ2hhcy1oaWVyYXJjaHktYWNjb3JkaW9uJyApICkge1xuXHRcdFx0XHRcdFx0XHRcdCRpbnN0YW5jZS5maW5kKCAnLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgJGVsID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgaWQgID0gJGVsLmRhdGEoICdpZCcgKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgdG9nZ2xlU2VsZWN0b3IgPSBgLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlW2RhdGEtaWQ9XCIkeyBpZCB9XCJdYDtcblxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBhY2NvcmRpb24gaXMgb3BlbmVkXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLXByZXNzZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCBwcmVzc2VkICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5hdHRyKCAnYXJpYS1wcmVzc2VkJywgJ3RydWUnICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCB0b2dnbGVTZWxlY3RvciApLmNsb3Nlc3QoICdsaScgKS5jaGlsZHJlbiggJ3VsJyApLnNob3coKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCB0b2dnbGVTZWxlY3RvciApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAnZmFsc2UnICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCB0b2dnbGVTZWxlY3RvciApLmNsb3Nlc3QoICdsaScgKS5jaGlsZHJlbiggJ3VsJyApLmhpZGUoKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gUHJlc2VydmUgc29mdCBsaW1pdCBzdGF0ZS5cblx0XHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnByZXNlcnZlX3NvZnRfbGltaXRfc3RhdGUgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJGluc3RhbmNlLmhhc0NsYXNzKCAnaGFzLXNvZnQtbGltaXQnICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgJGxpc3RXcmFwcGVyID0gJGluc3RhbmNlLmZpbmQoICcud2NhcGYtbGlzdC13cmFwcGVyJyApO1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCAkbGlzdFdyYXBwZXIuaGFzQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtbGlzdC13cmFwcGVyJyApLmFkZENsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLXNvZnQtbGltaXQtdHJpZ2dlcicgKS5hdHRyKCAnYXJpYS1wcmVzc2VkJywgJ3RydWUnICk7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKS5yZW1vdmVDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICdmYWxzZScgKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Y29uc3QgX2h0bWwgPSBfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1maWx0ZXItaW5uZXInICkuaHRtbCgpO1xuXG5cdFx0XHRcdFx0XHQvLyBGaW5hbGx5IHVwZGF0ZSB0aGUgaW5zdGFuY2UuXG5cdFx0XHRcdFx0XHQkaW5uZXIuaHRtbCggX2h0bWwgKTtcblxuXHRcdFx0XHRcdFx0JGluc3RhbmNlLnRyaWdnZXIoICd3Y2FwZi1maWx0ZXItdXBkYXRlZCcsIFsgX2luc3RhbmNlIF0gKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBVcGRhdGUgdGhlIGFjdGl2ZSBmaWx0ZXJzIGFuZCByZXNldCBmaWx0ZXJzLlxuXHRcdFx0XHRcdCRib2R5LmZpbmQoICcud2NhcGYtYWN0aXZlLWZpbHRlcnMsIC53Y2FwZi1yZXNldC1maWx0ZXJzJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0Y29uc3QgJHRoYXQgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRcdGNvbnN0IGluc3RhbmNlSWQgPSAnW2RhdGEtaWQ9XCInICsgJHRoYXQuZGF0YSggJ2lkJyApICsgJ1wiXSc7XG5cblx0XHRcdFx0XHRcdCR0aGF0Lmh0bWwoICRyZXNwb25zZS5maW5kKCBpbnN0YW5jZUlkICkuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdFx0Ly8gUmVwbGFjZSBvbGQgc2hvcCBsb29wIHdpdGggbmV3IG9uZS5cblx0XHRcdFx0XHRjb25zdCAkc2hvcExvb3BDb250YWluZXIgPSAkcmVzcG9uc2UuZmluZCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdFx0XHRjb25zdCAkbm90Rm91bmRDb250YWluZXIgPSAkcmVzcG9uc2UuZmluZCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKTtcblxuXHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgPT09IHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGlmICggJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJHNob3BMb29wQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmh0bWwoICRub3RGb3VuZENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJHNob3BMb29wQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRub3RGb3VuZENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFdDQVBGLmFmdGVyVXBkYXRpbmdQcm9kdWN0cyggJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRyZXF1ZXN0RmlsdGVyOiBmdW5jdGlvbiggdXJsLCB0cmlnZ2VyZWRCeSA9ICdmaWx0ZXInICkge1xuXHRcdFx0aWYgKCAhIHVybCApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5kaXNhYmxlX2FqYXggKSB7XG5cdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJsO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHsgd2NhcGY6IHRydWUgfSwgJycsIHVybCApO1xuXG5cdFx0XHRcdFdDQVBGLmZpbHRlclByb2R1Y3RzKCB0cmlnZ2VyZWRCeSApO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aGFuZGxlTnVtYmVySW5wdXRGaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHJhbmdlTnVtYmVyU2VsZWN0b3JzID0gJy53Y2FwZi1yYW5nZS1udW1iZXIgLm1pbi12YWx1ZSwgLndjYXBmLXJhbmdlLW51bWJlciAubWF4LXZhbHVlJztcblxuXHRcdFx0JGJvZHkub24oICdpbnB1dCcsIHJhbmdlTnVtYmVyU2VsZWN0b3JzLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Y29uc3QgJHJhbmdlTnVtYmVyICAgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXJhbmdlLW51bWJlcicgKTtcblx0XHRcdFx0Y29uc3QgZm9ybWF0TnVtYmVycyAgICAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZm9ybWF0LW51bWJlcnMnICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgb2xkTWluVmFsdWUgICAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IG9sZE1heFZhbHVlICAgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsUGxhY2VzICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRcdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1kZWNpbWFsLXNlcGFyYXRvcicgKTtcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRjb25zdCBnZXRWYWx1ZSA9ICggZmxvYXRWYWx1ZSApID0+IHtcblx0XHRcdFx0XHRpZiAoIGZvcm1hdE51bWJlcnMgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVtYmVyRm9ybWF0KCBmbG9hdFZhbHVlLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBmbG9hdFZhbHVlO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpdGVtLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGxldCBtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoKSApO1xuXHRcdFx0XHRcdGxldCBtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoKSApO1xuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdFx0XHRpZiAoIGlzTmFOKCBtaW5WYWx1ZSApICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRcdFx0aWYgKCBpc05hTiggbWF4VmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSByYW5nZU1pblZhbHVlLlxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPCByYW5nZU1pblZhbHVlICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA+IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdFx0XHRpZiAoIG1heFZhbHVlID4gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSBtaW5WYWx1ZS5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID4gbWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IG1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIElmIHZhbHVlIGlzIG5vdCBjaGFuZ2VkIHRoZW4gZG9uJ3QgcHJvY2VlZC5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID09PSBvbGRNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gb2xkTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdC8vIFJlbW92ZSByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkcmFuZ2VOdW1iZXIuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdGNvbnN0IHVybCA9ICRyYW5nZU51bWJlci5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclMXMnLCBtaW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVEYXRlSW5wdXRGaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgJy53Y2FwZi1kYXRlLWlucHV0IC5kYXRlLWlucHV0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWx0ZXIgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXHRcdFx0XHRjb25zdCBpc1JhbmdlID0gJGZpbHRlci5kYXRhKCAnaXMtcmFuZ2UnICk7XG5cblx0XHRcdFx0bGV0IGZpbHRlclVybCA9ICcnO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRmaWx0ZXIuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0aWYgKCBpc1JhbmdlICkge1xuXHRcdFx0XHRcdGNvbnN0IGZyb20gPSAkZmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApLnZhbCgpO1xuXHRcdFx0XHRcdGNvbnN0IHRvICAgPSAkZmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKS52YWwoKTtcblxuXHRcdFx0XHRcdGlmICggZnJvbSAmJiB0byApIHtcblx0XHRcdFx0XHRcdGZpbHRlclVybCA9ICRmaWx0ZXIuZGF0YSggJ3VybCcgKS5yZXBsYWNlKCAnJTFzJywgZnJvbSApLnJlcGxhY2UoICclMnMnLCB0byApO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoICEgZnJvbSAmJiAhIHRvICkge1xuXHRcdFx0XHRcdFx0ZmlsdGVyVXJsID0gJGZpbHRlci5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc3QgZnJvbSA9ICRmaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICkudmFsKCk7XG5cblx0XHRcdFx0XHRpZiAoIGZyb20gKSB7XG5cdFx0XHRcdFx0XHRmaWx0ZXJVcmwgPSAkZmlsdGVyLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyVzJywgZnJvbSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRmaWx0ZXJVcmwgPSAkZmlsdGVyLmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggZmlsdGVyVXJsICkge1xuXHRcdFx0XHRcdCRmaWx0ZXIuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkZmlsdGVyLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggZmlsdGVyVXJsICk7XG5cdFx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVMaXN0RmlsdGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCBuYXRpdmVJbnB1dHMgPSAnLmxpc3QtdHlwZS1uYXRpdmUgW3R5cGU9XCJjaGVja2JveFwiXSwnICtcblx0XHRcdFx0Jy5saXN0LXR5cGUtbmF0aXZlIFt0eXBlPVwicmFkaW9cIl0sJyArXG5cdFx0XHRcdCcubGlzdC10eXBlLWN1c3RvbS1jaGVja2JveCBbdHlwZT1cImNoZWNrYm94XCJdJztcblxuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCBuYXRpdmVJbnB1dHMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXItaXRlbScgKS50b2dnbGVDbGFzcyggJ2l0ZW0tYWN0aXZlJyApO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5kYXRhKCAndXJsJyApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGNvbnN0IGN1c3RvbVJhZGlvU2VsZWN0b3IgPSAnLmxpc3QtdHlwZS1jdXN0b20tcmFkaW8nO1xuXG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsIGN1c3RvbVJhZGlvU2VsZWN0b3IgKyAnIFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyLWl0ZW0nICkudG9nZ2xlQ2xhc3MoICdpdGVtLWFjdGl2ZScgKTtcblxuXHRcdFx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTgzOTkyNFxuXHRcdFx0XHQkKCB0aGlzIClcblx0XHRcdFx0XHQuY2xvc2VzdCggY3VzdG9tUmFkaW9TZWxlY3RvciApXG5cdFx0XHRcdFx0LmZpbmQoICcud2NhcGYtZmlsdGVyLWl0ZW0uaXRlbS1hY3RpdmUgW3R5cGU9XCJjaGVja2JveFwiXScgKVxuXHRcdFx0XHRcdC5ub3QoIHRoaXMgKVxuXHRcdFx0XHRcdC5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlIClcblx0XHRcdFx0XHQuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXItaXRlbScgKVxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcyggJ2l0ZW0tYWN0aXZlJyApO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5kYXRhKCAndXJsJyApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVEcm9wZG93bkZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCAnLndjYXBmLWRyb3Bkb3duLXdyYXBwZXIgc2VsZWN0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRzZWxlY3QgICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCB2YWx1ZXMgICAgICAgICA9ICRzZWxlY3QudmFsKCk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlclVSTCAgICAgID0gJHNlbGVjdC5kYXRhKCAndXJsJyApO1xuXHRcdFx0XHRjb25zdCBjbGVhckZpbHRlclVSTCA9ICRzZWxlY3QuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICk7XG5cdFx0XHRcdGxldCB1cmw7XG5cblx0XHRcdFx0aWYgKCB2YWx1ZXMubGVuZ3RoICkge1xuXHRcdFx0XHRcdHVybCA9IGZpbHRlclVSTC5yZXBsYWNlKCAnJXMnLCB2YWx1ZXMudG9TdHJpbmcoKSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHVybCA9IGNsZWFyRmlsdGVyVVJMO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVQYWdpbmF0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4ICYmIHdjYXBmX3BhcmFtcy5wYWdpbmF0aW9uX2NvbnRhaW5lciApIHtcblx0XHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRcdGNvbnN0IF9zZWxlY3RvcnMgPSB3Y2FwZl9wYXJhbXMucGFnaW5hdGlvbl9jb250YWluZXIuc3BsaXQoICcsJyApO1xuXHRcdFx0XHRjb25zdCBzZWxlY3RvcnMgID0gW107XG5cblx0XHRcdFx0X3NlbGVjdG9ycy5mb3JFYWNoKCBzZWxlY3RvciA9PiB7XG5cdFx0XHRcdFx0aWYgKCBzZWxlY3RvciApIHtcblx0XHRcdFx0XHRcdHNlbGVjdG9ycy5wdXNoKCBzZWxlY3RvciArICcgYScgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRjb25zdCBzZWxlY3RvciA9IHNlbGVjdG9ycy5qb2luKCAnLCcgKTtcblxuXHRcdFx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdCRjb250YWluZXIub24oICdjbGljaycsIHNlbGVjdG9yLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgaHJlZiA9ICQoIHRoaXMgKS5hdHRyKCAnaHJlZicgKTtcblxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggaHJlZiwgJ3BhZ2luYXRlJyApO1xuXHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aGFuZGxlRGVmYXVsdE9yZGVyYnk6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5zb3J0aW5nX2NvbnRyb2wgKSB7XG5cdFx0XHRcdC8vIFN1Ym1pdCB0aGUgb3JkZXJieSBmb3JtIHdoZW4gdmFsdWUgaXMgY2hhbmdlZC5cblx0XHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCBkZWZhdWx0T3JkZXJCeUVsZW1lbnQsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5jbG9zZXN0KCAnZm9ybScgKS50cmlnZ2VyKCAnc3VibWl0JyApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBQcmV2ZW50IHRoZSBhdXRvIHN1Ym1pc3Npb24gb2YgdGhlIG9yZGVyYnkgZm9ybS5cblx0XHRcdCRib2R5Lm9uKCAnc3VibWl0Jywgd2NhcGZfcGFyYW1zLm9yZGVyYnlfZm9ybSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCB2aWEgYWpheCB3aGVuIHRoZSBvcmRlcmJ5IHZhbHVlIGlzIGNoYW5nZWQuXG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsIGRlZmF1bHRPcmRlckJ5RWxlbWVudCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0IG9yZGVyID0gJCggdGhpcyApLnZhbCgpO1xuXG5cdFx0XHRcdGNvbnN0IHVybCA9IG5ldyBVUkwoIHdpbmRvdy5sb2NhdGlvbiApO1xuXHRcdFx0XHR1cmwuc2VhcmNoUGFyYW1zLnNldCggJ29yZGVyYnknLCBvcmRlciApO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIGdldE9yZGVyQnlVcmwoIHVybC5ocmVmICkgKTtcblxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVDbGVhckZpbHRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHQkYm9keS5vbiggJ2NsaWNrJywgJy53Y2FwZi1maWx0ZXItY2xlYXItYnRuJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJCggdGhpcyApLmF0dHIoICdkYXRhLWNsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZUZpbHRlclRvb2x0aXA6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZFJlZmVyZW5jZVxuXHRcdFx0aWYgKCAnZnVuY3Rpb24nICE9PSB0eXBlb2YgdGlwcHkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy51c2VfdGlwcHlqcyApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkUmVmZXJlbmNlXG5cdFx0XHR0aXBweSggJy53Y2FwZi1maWx0ZXItdG9vbHRpcCcsIHtcblx0XHRcdFx0cGxhY2VtZW50OiAndG9wJyxcblx0XHRcdFx0Y29udGVudCggcmVmZXJlbmNlICkge1xuXHRcdFx0XHRcdHJldHVybiByZWZlcmVuY2UuZ2V0QXR0cmlidXRlKCAnZGF0YS1jb250ZW50JyApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRhbGxvd0hUTUw6IHRydWUsXG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRpbml0Q29tYm9ib3g6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAhIGpRdWVyeSgpLmNob3NlbldDQVBGICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHRlbXBsYXRlUmVzdWx0ID0gKCB0ZXh0LCBkYXRhICkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdCc8c3Bhbj4nICsgdGV4dCArICc8L3NwYW4+Jyxcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJ3Y2FwZi1jb3VudFwiPicgKyBkYXRhWyAnY291bnRNYXJrdXAnIF0gKyAnPC9zcGFuPicsXG5cdFx0XHRcdF0uam9pbiggJycgKTtcblx0XHRcdH07XG5cblx0XHRcdGNvbnN0IHRlbXBsYXRlU2VsZWN0aW9uID0gKCB0ZXh0LCBkYXRhICkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cIndjYXBmLWNvdW50LScgKyBkYXRhLmNvdW50ICsgJ1wiPicgKyB0ZXh0ICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cIndjYXBmLWNvdW50IHdjYXBmLWNvdW50LScgKyBkYXRhLmNvdW50ICsgJ1wiPicgKyBkYXRhWyAnY291bnRNYXJrdXAnIF0gKyAnPC9zcGFuPicsXG5cdFx0XHRcdF0uam9pbiggJycgKTtcblx0XHRcdH07XG5cblx0XHRcdGNvbnN0IGRlZmF1bHRzID0ge1xuXHRcdFx0XHRpbmhlcml0X3NlbGVjdF9jbGFzc2VzOiB0cnVlLFxuXHRcdFx0XHRpbmhlcml0X29wdGlvbl9jbGFzc2VzOiB0cnVlLFxuXHRcdFx0XHRub19yZXN1bHRzX3RleHQ6IHdjYXBmX3BhcmFtcy5jb21ib2JveF9ub19yZXN1bHRzX3RleHQsXG5cdFx0XHRcdG9wdGlvbnNfbm9uZV90ZXh0OiB3Y2FwZl9wYXJhbXMuY29tYm9ib3hfb3B0aW9uc19ub25lX3RleHQsXG5cdFx0XHRcdHNlYXJjaF9jb250YWluczogdHJ1ZSwgLy8gTWF0Y2ggZnJvbSBhbnl3aGVyZSBpbiBzdHJpbmcuXG5cdFx0XHRcdHNlYXJjaF9pbl92YWx1ZXM6IHRydWUsIC8vIFNlYXJjaCBpbiB2YWx1ZXMgYWxzby5cblx0XHRcdH07XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmlzX3J0bCApIHtcblx0XHRcdFx0ZGVmYXVsdHNbICdydGwnIF0gPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLWNob3NlbicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRoaXMgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHsgLi4uZGVmYXVsdHMgfTtcblxuXHRcdFx0XHQvLyBJZiBoaWVyYXJjaHkgZW5hYmxlZCB0aGVuIHdlIHNob3cgdGhlIHNlbGVjdGVkIG9wdGlvbnMuXG5cdFx0XHRcdGlmICggJHRoaXMuaGFzQ2xhc3MoICdoYXMtaGllcmFyY2h5JyApICkge1xuXHRcdFx0XHRcdG9wdGlvbnNbICdkaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMnIF0gPSB0cnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG9wdGlvbnNbICdkaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMnIF0gPSB3Y2FwZl9wYXJhbXMuY29tYm9ib3hfZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gRW5hYmxlIHRlbXBsYXRpbmcgd2hlbiBzaG93aW5nIGNvdW50LlxuXHRcdFx0XHRpZiAoICR0aGlzLmhhc0NsYXNzKCAnd2l0aC1jb3VudCcgKSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAndGVtcGxhdGVSZXN1bHQnIF0gICAgPSB0ZW1wbGF0ZVJlc3VsdDtcblx0XHRcdFx0XHRvcHRpb25zWyAndGVtcGxhdGVTZWxlY3Rpb24nIF0gPSB0ZW1wbGF0ZVNlbGVjdGlvbjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIERpc2FibGUgc2VhcmNoIGJveC5cblx0XHRcdFx0aWYgKCAhICR0aGlzLmRhdGEoICdlbmFibGUtc2VhcmNoJyApICkge1xuXHRcdFx0XHRcdG9wdGlvbnNbICdkaXNhYmxlX3NlYXJjaCcgXSA9IHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkdGhpcy5jaG9zZW5XQ0FQRiggb3B0aW9ucyApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBBdHRhY2ggY2hvc2VuIGZvciBkZWZhdWx0IG9yZGVyYnkuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5hdHRhY2hfY29tYm9ib3hfb25fc29ydGluZyApIHtcblx0XHRcdFx0bGV0IGRpc2FibGVTZWFyY2ggPSB0cnVlO1xuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnNlYXJjaF9ib3hfaW5fZGVmYXVsdF9vcmRlcmJ5ICkge1xuXHRcdFx0XHRcdGRpc2FibGVTZWFyY2ggPSBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7IC4uLmRlZmF1bHRzIH07XG5cblx0XHRcdFx0b3B0aW9uc1sgJ2Rpc2FibGVfc2VhcmNoJyBdID0gZGlzYWJsZVNlYXJjaDtcblxuXHRcdFx0XHQkYm9keS5maW5kKCBkZWZhdWx0T3JkZXJCeUVsZW1lbnQgKS5jaG9zZW5XQ0FQRiggb3B0aW9ucyApO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aW5pdFJhbmdlU2xpZGVyOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCRib2R5LmZpbmQoICcud2NhcGYtcmFuZ2Utc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkaXRlbSAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCAkc2xpZGVyID0gJGl0ZW0uZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKTtcblxuXHRcdFx0XHRjb25zdCBzbGlkZXJJZCAgICAgICAgICA9ICRzbGlkZXIuYXR0ciggJ2lkJyApO1xuXHRcdFx0XHRjb25zdCBkaXNwbGF5VmFsdWVzQXMgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRpc3BsYXktdmFsdWVzLWFzJyApO1xuXHRcdFx0XHRjb25zdCBmb3JtYXROdW1iZXJzICAgICA9ICRpdGVtLmF0dHIoICdkYXRhLWZvcm1hdC1udW1iZXJzJyApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1pblZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBzdGVwICAgICAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXN0ZXAnICkgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFBsYWNlcyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRcdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkaXRlbS5hdHRyKCAnZGF0YS10aG91c2FuZC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IG1pblZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IG1heFZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0ICRtaW5WYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5taW4tdmFsdWUnICk7XG5cdFx0XHRcdGNvbnN0ICRtYXhWYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5tYXgtdmFsdWUnICk7XG5cblx0XHRcdFx0Y29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIHNsaWRlcklkICk7XG5cblx0XHRcdFx0bm9VaVNsaWRlci5jcmVhdGUoIHNsaWRlciwge1xuXHRcdFx0XHRcdHN0YXJ0OiBbIG1pblZhbHVlLCBtYXhWYWx1ZSBdLFxuXHRcdFx0XHRcdHN0ZXAsXG5cdFx0XHRcdFx0Y29ubmVjdDogdHJ1ZSxcblx0XHRcdFx0XHRjc3NQcmVmaXg6ICd3Y2FwZi1ub3VpLScsXG5cdFx0XHRcdFx0cmFuZ2U6IHtcblx0XHRcdFx0XHRcdCdtaW4nOiByYW5nZU1pblZhbHVlLFxuXHRcdFx0XHRcdFx0J21heCc6IHJhbmdlTWF4VmFsdWUsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICd1cGRhdGUnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHRcdGxldCBtaW5WYWx1ZTtcblx0XHRcdFx0XHRsZXQgbWF4VmFsdWU7XG5cblx0XHRcdFx0XHRpZiAoIGZvcm1hdE51bWJlcnMgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IG51bWJlckZvcm1hdCggdmFsdWVzWyAwIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IG51bWJlckZvcm1hdCggdmFsdWVzWyAxIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAwIF0gKTtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoICdwbGFpbl90ZXh0JyA9PT0gZGlzcGxheVZhbHVlc0FzICkge1xuXHRcdFx0XHRcdFx0JG1pblZhbHVlLmh0bWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0XHQkbWF4VmFsdWUuaHRtbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JG1pblZhbHVlLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHRcdCRtYXhWYWx1ZS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICkge1xuXHRcdFx0XHRcdGNvbnN0IF9taW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0Y29uc3QgX21heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblxuXHRcdFx0XHRcdC8vIElmIHZhbHVlIGlzIG5vdCBjaGFuZ2VkIHRoZW4gZG9uJ3QgcHJvY2VlZC5cblx0XHRcdFx0XHRpZiAoIF9taW5WYWx1ZSA9PT0gbWluVmFsdWUgJiYgX21heFZhbHVlID09PSBtYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIF9taW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBfbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHQvLyBSZW1vdmUgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJGl0ZW0uZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdGNvbnN0IHVybCA9ICRpdGVtLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIF9taW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBfbWF4VmFsdWUgKTtcblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtaW5WYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG1pblZhbHVlLCBudWxsIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkbWF4VmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRcdGNsZWFyVGltZW91dCggJGlucHV0LmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBudWxsLCBtYXhWYWx1ZSBdICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRpbml0RGF0ZXBpY2tlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgalF1ZXJ5KCkuZGF0ZXBpY2tlciApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCAkd2NhcGZEYXRlRmlsdGVyID0gJGJvZHkuZmluZCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXG5cdFx0XHRjb25zdCBmb3JtYXQgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLWZvcm1hdCcgKTtcblx0XHRcdGNvbnN0IHllYXJEcm9wZG93biAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtcGlja2VyLXllYXItZHJvcGRvd24nICk7XG5cdFx0XHRjb25zdCBtb250aERyb3Bkb3duID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLXBpY2tlci1tb250aC1kcm9wZG93bicgKTtcblxuXHRcdFx0Y29uc3QgJGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApO1xuXHRcdFx0Y29uc3QgJHRvICAgPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKTtcblxuXHRcdFx0JGZyb20uZGF0ZXBpY2tlcigge1xuXHRcdFx0XHRkYXRlRm9ybWF0OiBmb3JtYXQsXG5cdFx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdFx0Y2hhbmdlTW9udGg6IG1vbnRoRHJvcGRvd24sXG5cdFx0XHR9ICk7XG5cblx0XHRcdCR0by5kYXRlcGlja2VyKCB7XG5cdFx0XHRcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdFx0Y2hhbmdlWWVhcjogeWVhckRyb3Bkb3duLFxuXHRcdFx0XHRjaGFuZ2VNb250aDogbW9udGhEcm9wZG93bixcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXRGaWx0ZXJPcHRpb25Ub29sdGlwOiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRSZWZlcmVuY2Vcblx0XHRcdGlmICggJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHRpcHB5ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMudXNlX3RpcHB5anMgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgdG9vbHRpcFBvc2l0aW9ucyA9IFsgJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCcgXTtcblxuXHRcdFx0dG9vbHRpcFBvc2l0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbiggdG9vbHRpcFBvc2l0aW9uICkge1xuXHRcdFx0XHRjb25zdCBpZGVudGlmaWVyID0gJ2RhdGEtd2NhcGYtdG9vbHRpcC0nICsgdG9vbHRpcFBvc2l0aW9uO1xuXG5cdFx0XHRcdC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRSZWZlcmVuY2Vcblx0XHRcdFx0Y29uc3QgaW5zdGFuY2VzID0gdGlwcHkoICdbJyArIGlkZW50aWZpZXIgKyAnXScsIHtcblx0XHRcdFx0XHRwbGFjZW1lbnQ6IHRvb2x0aXBQb3NpdGlvbixcblx0XHRcdFx0XHRjb250ZW50KCByZWZlcmVuY2UgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSggaWRlbnRpZmllciApO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0YWxsb3dIVE1MOiB0cnVlLFxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0d2luZG93LnRpcHB5SW5zdGFuY2VzID0gdGlwcHlJbnN0YW5jZXMuY29uY2F0KCBpbnN0YW5jZXMgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0V0NBUEYuaW5pdENvbWJvYm94KCk7XG5cdFx0XHRXQ0FQRi5pbml0UmFuZ2VTbGlkZXIoKTtcblx0XHRcdFdDQVBGLmluaXREYXRlcGlja2VyKCk7XG5cdFx0XHRXQ0FQRi5pbml0RmlsdGVyT3B0aW9uVG9vbHRpcCgpO1xuXHRcdH0sXG5cdFx0aW5pdFBvcFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnJlbG9hZF9vbl9iYWNrICYmIHdjYXBmX3BhcmFtcy5mb3VuZF93Y2FwZiApIHtcblx0XHRcdFx0aGlzdG9yeS5yZXBsYWNlU3RhdGUoIHsgd2NhcGY6IHRydWUgfSwgJycsIHdpbmRvdy5sb2NhdGlvbiApO1xuXG5cdFx0XHRcdC8vIEhhbmRsZSB0aGUgcG9wc3RhdGUgZXZlbnQoYnJvd3NlcidzIGJhY2svZm9yd2FyZClcblx0XHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdwb3BzdGF0ZScsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdGlmICggbnVsbCAhPT0gZS5zdGF0ZSAmJiBlLnN0YXRlLmhhc093blByb3BlcnR5KCAnd2NhcGYnICkgKSB7XG5cdFx0XHRcdFx0XHRXQ0FQRi5maWx0ZXJQcm9kdWN0cyggJ3BvcHN0YXRlJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICogRW5hYmxlIGl0IGlmIG5lY2Vzc2FyeS5cblx0ICpcblx0ICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzMwMDQ5MTdcblx0ICovXG5cdGlmICggJ3Njcm9sbFJlc3RvcmF0aW9uJyBpbiBoaXN0b3J5ICkge1xuXHRcdC8vIGhpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb24gPSAnbWFudWFsJztcblx0fVxuXG59KCBqUXVlcnksIHdpbmRvdyApICk7XG5cbiggZnVuY3Rpb24oICQsIFdDQVBGICkge1xuXG5cdFdDQVBGLmluaXQoKTtcblx0V0NBUEYuaW5pdFBvcFN0YXRlKCk7XG5cblx0V0NBUEYuaGFuZGxlRmlsdGVyQWNjb3JkaW9uKCk7XG5cdFdDQVBGLmhhbmRsZUhpZXJhcmNoeVRvZ2dsZSgpO1xuXHRXQ0FQRi5oYW5kbGVTb2Z0TGltaXQoKTtcblx0V0NBUEYuaGFuZGxlU2VhcmNoRmlsdGVyT3B0aW9ucygpO1xuXG5cdFdDQVBGLmhhbmRsZUxpc3RGaWx0ZXJzKCk7XG5cdFdDQVBGLmhhbmRsZURyb3Bkb3duRmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVOdW1iZXJJbnB1dEZpbHRlcnMoKTtcblx0V0NBUEYuaGFuZGxlRGF0ZUlucHV0RmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVQYWdpbmF0aW9uKCk7XG5cdFdDQVBGLmhhbmRsZURlZmF1bHRPcmRlcmJ5KCk7XG5cblx0V0NBUEYuaGFuZGxlQ2xlYXJGaWx0ZXIoKTtcblxuXHRXQ0FQRi5oYW5kbGVGaWx0ZXJUb29sdGlwKCk7XG5cblx0LyoqXG5cdCAqIE1ha2UgaXQgY29tcGF0aWJsZSB3aXRoIG90aGVyIHBsdWdpbnMuXG5cdCAqL1xuXHQkKCBkb2N1bWVudCApLm9uKCAnd2NhcGZfYWZ0ZXJfdXBkYXRpbmdfcHJvZHVjdHMnLCBmdW5jdGlvbigpIHtcblx0XHQvLyB3b28tdmFyaWF0aW9uLXN3YXRjaGVzXG5cdFx0JCggZG9jdW1lbnQgKS50cmlnZ2VyKCAnd29vX3ZhcmlhdGlvbl9zd2F0Y2hlc19wcm9faW5pdCcgKTtcblx0fSApO1xuXG59KCBqUXVlcnksIHdpbmRvdy5XQ0FQRiApICk7XG4iLCIvKipcbiAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM0MTQxODEzXG4gKlxuICogQHBhcmFtIG51bWJlclxuICogQHBhcmFtIGRlY2ltYWxzXG4gKiBAcGFyYW0gZGVjX3BvaW50XG4gKiBAcGFyYW0gdGhvdXNhbmRzX3NlcFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIG51bWJlckZvcm1hdCggbnVtYmVyLCBkZWNpbWFscywgZGVjX3BvaW50LCB0aG91c2FuZHNfc2VwICkge1xuXHQvLyBTdHJpcCBhbGwgY2hhcmFjdGVycyBidXQgbnVtZXJpY2FsIG9uZXMuXG5cdG51bWJlciA9ICggbnVtYmVyICsgJycgKS5yZXBsYWNlKCAvW15cXGQrXFwtRWUuXS9nLCAnJyApO1xuXG5cdGNvbnN0IG4gICAgPSAhIGlzRmluaXRlKCArbnVtYmVyICkgPyAwIDogK251bWJlcjtcblx0Y29uc3QgcHJlYyA9ICEgaXNGaW5pdGUoICtkZWNpbWFscyApID8gMCA6IE1hdGguYWJzKCBkZWNpbWFscyApO1xuXHRjb25zdCBzZXAgID0gKCB0eXBlb2YgdGhvdXNhbmRzX3NlcCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcsJyA6IHRob3VzYW5kc19zZXA7XG5cdGNvbnN0IGRlYyAgPSAoIHR5cGVvZiBkZWNfcG9pbnQgPT09ICd1bmRlZmluZWQnICkgPyAnLicgOiBkZWNfcG9pbnQ7XG5cblx0bGV0IHM7XG5cblx0Y29uc3QgdG9GaXhlZEZpeCA9IGZ1bmN0aW9uKCBuLCBwcmVjICkge1xuXHRcdGNvbnN0IGsgPSBNYXRoLnBvdyggMTAsIHByZWMgKTtcblx0XHRyZXR1cm4gJycgKyBNYXRoLnJvdW5kKCBuICogayApIC8gaztcblx0fTtcblxuXHQvLyBGaXggZm9yIElFIHBhcnNlRmxvYXQoMC41NSkudG9GaXhlZCgwKSA9IDA7XG5cdHMgPSAoIHByZWMgPyB0b0ZpeGVkRml4KCBuLCBwcmVjICkgOiAnJyArIE1hdGgucm91bmQoIG4gKSApLnNwbGl0KCAnLicgKTtcblxuXHRpZiAoIHNbIDAgXS5sZW5ndGggPiAzICkge1xuXHRcdHNbIDAgXSA9IHNbIDAgXS5yZXBsYWNlKCAvXFxCKD89KD86XFxkezN9KSsoPyFcXGQpKS9nLCBzZXAgKTtcblx0fVxuXG5cdGlmICggKCBzWyAxIF0gfHwgJycgKS5sZW5ndGggPCBwcmVjICkge1xuXHRcdHNbIDEgXSA9IHNbIDEgXSB8fCAnJztcblx0XHRzWyAxIF0gKz0gbmV3IEFycmF5KCBwcmVjIC0gc1sgMSBdLmxlbmd0aCArIDEgKS5qb2luKCAnMCcgKTtcblx0fVxuXG5cdHJldHVybiBzLmpvaW4oIGRlYyApO1xufVxuXG5mdW5jdGlvbiBjbGVhblVybCggdXJsICkge1xuXHRyZXR1cm4gdXJsLnJlcGxhY2UoIC8lMkMvZywgJywnICk7XG59XG5cbmZ1bmN0aW9uIGdldE9yZGVyQnlVcmwoIHVybCApIHtcblx0Y29uc3QgcGFnZWQgPSBwYXJzZUludCggdXJsLnJlcGxhY2UoIC8uK1xcL3BhZ2VcXC8oXFxkKykrLywgJyQxJyApICk7XG5cblx0aWYgKCBwYWdlZCApIHtcblx0XHR1cmwgPSB1cmwucmVwbGFjZSggL3BhZ2VcXC8oXFxkKylcXC8vLCAnJyApO1xuXHR9XG5cblx0cmV0dXJuIGNsZWFuVXJsKCB1cmwgKTtcbn1cbiJdfQ==
