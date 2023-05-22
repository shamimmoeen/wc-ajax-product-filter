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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJ1dGlscy5qcyJdLCJuYW1lcyI6WyJ3Y2FwZl9wYXJhbXMiLCIkIiwid2luZG93IiwiX2RlbGF5IiwicGFyc2VJbnQiLCJmaWx0ZXJfaW5wdXRfZGVsYXkiLCJkZWxheSIsImlzUHJvIiwid2NhcGZfcHJvIiwiJGJvZHkiLCIkZG9jdW1lbnQiLCJkb2N1bWVudCIsImluc3RhbmNlSWRzIiwiZWFjaCIsImlkIiwiZGF0YSIsInB1c2giLCJmb2N1c2VkRWxtIiwidGlwcHlJbnN0YW5jZXMiLCJXQ0FQRiIsImhhbmRsZUZpbHRlckFjY29yZGlvbiIsInRvZ2dsZUFjY29yZGlvbiIsIiRlbCIsInByZXNzZWQiLCJhdHRyIiwiJGZpbHRlcklubmVyIiwiY2xvc2VzdCIsImNoaWxkcmVuIiwiZW5hYmxlX2FuaW1hdGlvbl9mb3JfZmlsdGVyX2FjY29yZGlvbiIsInNsaWRlVG9nZ2xlIiwiZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQiLCJmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmciLCJ0b2dnbGUiLCJvbiIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCIkdHJpZ2dlciIsImZpbmQiLCJoYW5kbGVIaWVyYXJjaHlUb2dnbGUiLCIkY2hpbGQiLCJlbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uIiwiaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQiLCJoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmciLCJrZXkiLCJwcmV2ZW50RGVmYXVsdCIsImhhbmRsZVNvZnRMaW1pdCIsInRvZ2dsZUZpbHRlck9wdGlvbnMiLCIkbGlzdFdyYXBwZXIiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiaGFuZGxlU2VhcmNoRmlsdGVyT3B0aW9ucyIsIiR0aGF0IiwiJGlubmVyIiwiJGZpbHRlciIsInNvZnRMaW1pdEVuYWJsZWQiLCJoYXNDbGFzcyIsInNvZnRMaW1pdFRvZ2dsZSIsIm5vUmVzdWx0cyIsInZpc2libGVPcHRpb25zIiwia2V5d29yZCIsInZhbCIsImxlbmd0aCIsImluZGV4IiwiJGZpbHRlckl0ZW0iLCJyZW1vdmVBdHRyIiwidGV4dCIsImhpZGUiLCJsYWJlbCIsInRvU3RyaW5nIiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsInNob3ciLCJ1cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0IiwiJHJlc3BvbnNlIiwiJGNvbnRhaW5lciIsInNob3BfbG9vcF9jb250YWluZXIiLCJzZWxlY3RvciIsIm5ld0NvdW50IiwiaHRtbCIsImhhcyIsInNjcm9sbFRvIiwic2Nyb2xsX3dpbmRvdyIsInNjcm9sbEZvciIsInNjcm9sbF93aW5kb3dfZm9yIiwiaXNNb2JpbGUiLCJpc19tb2JpbGUiLCJwcm9jZWVkIiwiYWRqdXN0aW5nT2Zmc2V0Iiwib2Zmc2V0Iiwic2Nyb2xsX3RvX3RvcF9vZmZzZXQiLCJjb250YWluZXIiLCJub3RfZm91bmRfY29udGFpbmVyIiwic2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudCIsInRvcCIsInN0b3AiLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwic2Nyb2xsX3RvX3RvcF9zcGVlZCIsInNjcm9sbF90b190b3BfZWFzaW5nIiwiYmVmb3JlRmV0Y2hpbmdQcm9kdWN0cyIsInRyaWdnZXJlZEJ5IiwiYWN0aXZlRWxlbWVudCIsInNjcm9sbF93aW5kb3dfd2hlbiIsInRyaWdnZXIiLCJkZXN0cm95VGlwcHlJbnN0YW5jZXMiLCJ1c2VfdGlwcHlqcyIsImZvckVhY2giLCJpbnN0YW5jZSIsImRlc3Ryb3kiLCJiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzIiwiYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzIiwicmVzdG9yZV9mb2N1c19hZnRlcl9maWx0ZXJpbmciLCJib2R5IiwiZm9jdXMiLCJpbml0IiwiY3VzdG9tX3NjcmlwdHMiLCJldmFsIiwiZmlsdGVyUHJvZHVjdHMiLCJhamF4IiwidXJsIiwibG9jYXRpb24iLCJocmVmIiwic3VjY2VzcyIsInJlc3BvbnNlIiwidXBkYXRlX2RvY3VtZW50X3RpdGxlIiwidGl0bGUiLCJmaWx0ZXIiLCJpbnN0YW5jZUlkIiwiJGluc3RhbmNlIiwiX2luc3RhbmNlIiwicHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSIsInRvZ2dsZVNlbGVjdG9yIiwicHJlc2VydmVfc29mdF9saW1pdF9zdGF0ZSIsIl9odG1sIiwiJHNob3BMb29wQ29udGFpbmVyIiwiJG5vdEZvdW5kQ29udGFpbmVyIiwicmVxdWVzdEZpbHRlciIsImRpc2FibGVfYWpheCIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJ3Y2FwZiIsImhhbmRsZU51bWJlcklucHV0RmlsdGVycyIsInJhbmdlTnVtYmVyU2VsZWN0b3JzIiwiJGl0ZW0iLCIkcmFuZ2VOdW1iZXIiLCJmb3JtYXROdW1iZXJzIiwicmFuZ2VNaW5WYWx1ZSIsInBhcnNlRmxvYXQiLCJyYW5nZU1heFZhbHVlIiwib2xkTWluVmFsdWUiLCJvbGRNYXhWYWx1ZSIsImRlY2ltYWxQbGFjZXMiLCJ0aG91c2FuZFNlcGFyYXRvciIsImRlY2ltYWxTZXBhcmF0b3IiLCJjbGVhclRpbWVvdXQiLCJnZXRWYWx1ZSIsImZsb2F0VmFsdWUiLCJudW1iZXJGb3JtYXQiLCJzZXRUaW1lb3V0IiwicmVtb3ZlRGF0YSIsIm1pblZhbHVlIiwibWF4VmFsdWUiLCJpc05hTiIsInJlcGxhY2UiLCJoYW5kbGVEYXRlSW5wdXRGaWx0ZXJzIiwiaXNSYW5nZSIsImZpbHRlclVybCIsImZyb20iLCJ0byIsImhhbmRsZUxpc3RGaWx0ZXJzIiwibmF0aXZlSW5wdXRzIiwidG9nZ2xlQ2xhc3MiLCJjdXN0b21SYWRpb1NlbGVjdG9yIiwibm90IiwicHJvcCIsImhhbmRsZURyb3Bkb3duRmlsdGVycyIsIiRzZWxlY3QiLCJ2YWx1ZXMiLCJmaWx0ZXJVUkwiLCJjbGVhckZpbHRlclVSTCIsImhhbmRsZVBhZ2luYXRpb24iLCJlbmFibGVfcGFnaW5hdGlvbl92aWFfYWpheCIsInBhZ2luYXRpb25fY29udGFpbmVyIiwiX3NlbGVjdG9ycyIsInNwbGl0Iiwic2VsZWN0b3JzIiwiam9pbiIsImhhbmRsZURlZmF1bHRPcmRlcmJ5Iiwic29ydGluZ19jb250cm9sIiwib3JkZXIiLCJVUkwiLCJzZWFyY2hQYXJhbXMiLCJzZXQiLCJnZXRPcmRlckJ5VXJsIiwiaGFuZGxlQ2xlYXJGaWx0ZXIiLCJoYW5kbGVGaWx0ZXJUb29sdGlwIiwidGlwcHkiLCJwbGFjZW1lbnQiLCJjb250ZW50IiwicmVmZXJlbmNlIiwiZ2V0QXR0cmlidXRlIiwiYWxsb3dIVE1MIiwiaW5pdENvbWJvYm94IiwialF1ZXJ5IiwiY2hvc2VuV0NBUEYiLCJ0ZW1wbGF0ZVJlc3VsdCIsInRlbXBsYXRlU2VsZWN0aW9uIiwiY291bnQiLCJkZWZhdWx0cyIsImluaGVyaXRfc2VsZWN0X2NsYXNzZXMiLCJpbmhlcml0X29wdGlvbl9jbGFzc2VzIiwibm9fcmVzdWx0c190ZXh0IiwiY29tYm9ib3hfbm9fcmVzdWx0c190ZXh0Iiwib3B0aW9uc19ub25lX3RleHQiLCJjb21ib2JveF9vcHRpb25zX25vbmVfdGV4dCIsInNlYXJjaF9jb250YWlucyIsInNlYXJjaF9pbl92YWx1ZXMiLCJpc19ydGwiLCIkdGhpcyIsIm9wdGlvbnMiLCJjb21ib2JveF9kaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMiLCJhdHRhY2hfY29tYm9ib3hfb25fc29ydGluZyIsImRpc2FibGVTZWFyY2giLCJzZWFyY2hfYm94X2luX2RlZmF1bHRfb3JkZXJieSIsImluaXRSYW5nZVNsaWRlciIsIm5vVWlTbGlkZXIiLCIkc2xpZGVyIiwic2xpZGVySWQiLCJkaXNwbGF5VmFsdWVzQXMiLCJzdGVwIiwiJG1pblZhbHVlIiwiJG1heFZhbHVlIiwic2xpZGVyIiwiZ2V0RWxlbWVudEJ5SWQiLCJjcmVhdGUiLCJzdGFydCIsImNvbm5lY3QiLCJjc3NQcmVmaXgiLCJyYW5nZSIsImZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIiLCJfbWluVmFsdWUiLCJfbWF4VmFsdWUiLCIkaW5wdXQiLCJnZXQiLCJpbml0RGF0ZXBpY2tlciIsImRhdGVwaWNrZXIiLCIkd2NhcGZEYXRlRmlsdGVyIiwiZm9ybWF0IiwieWVhckRyb3Bkb3duIiwibW9udGhEcm9wZG93biIsIiRmcm9tIiwiJHRvIiwiZGF0ZUZvcm1hdCIsImNoYW5nZVllYXIiLCJjaGFuZ2VNb250aCIsImluaXRGaWx0ZXJPcHRpb25Ub29sdGlwIiwidG9vbHRpcFBvc2l0aW9ucyIsInRvb2x0aXBQb3NpdGlvbiIsImlkZW50aWZpZXIiLCJpbnN0YW5jZXMiLCJjb25jYXQiLCJpbml0UG9wU3RhdGUiLCJyZWxvYWRfb25fYmFjayIsImZvdW5kX3djYXBmIiwicmVwbGFjZVN0YXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInN0YXRlIiwiaGFzT3duUHJvcGVydHkiLCJudW1iZXIiLCJkZWNpbWFscyIsImRlY19wb2ludCIsInRob3VzYW5kc19zZXAiLCJuIiwiaXNGaW5pdGUiLCJwcmVjIiwiTWF0aCIsImFicyIsInNlcCIsImRlYyIsInMiLCJ0b0ZpeGVkRml4IiwiayIsInBvdyIsInJvdW5kIiwiQXJyYXkiLCJjbGVhblVybCIsInBhZ2VkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSxZQUFZLEdBQUdBLFlBQVksSUFBSTtBQUNwQyxZQUFVLEVBRDBCO0FBRXBDLHdCQUFzQixFQUZjO0FBR3BDLHVDQUFxQyxFQUhEO0FBSXBDLDhCQUE0QixFQUpRO0FBS3BDLGdDQUE4QixFQUxNO0FBTXBDLG1DQUFpQyxFQU5HO0FBT3BDLHdDQUFzQyxFQVBGO0FBUXBDLCtCQUE2QixFQVJPO0FBU3BDLDJDQUF5QyxFQVRMO0FBVXBDLHNDQUFvQyxFQVZBO0FBV3BDLHVDQUFxQyxFQVhEO0FBWXBDLDhDQUE0QyxFQVpSO0FBYXBDLHlDQUF1QyxFQWJIO0FBY3BDLDBDQUF3QyxFQWRKO0FBZXBDLG1DQUFpQyxFQWZHO0FBZ0JwQyx5QkFBdUIsRUFoQmE7QUFpQnBDLDBC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QjFOLE1BQWpCLEdBQTBCcU4sSUFBL0IsRUFBc0M7QUFDckNLLElBQUFBLENBQUMsQ0FBRSxDQUFGLENBQUQsR0FBU0EsQ0FBQyxDQUFFLENBQUYsQ0FBRCxJQUFVLEVBQW5CO0FBQ0FBLElBQUFBLENBQUMsQ0FBRSxDQUFGLENBQUQsSUFBVSxJQUFJSyxLQUFKLENBQVdWLElBQUksR0FBR0ssQ0FBQyxDQUFFLENBQUYsQ0FBRCxDQUFPMU4sTUFBZCxHQUF1QixDQUFsQyxFQUFzQzZILElBQXRDLENBQTRDLEdBQTVDLENBQVY7QUFDQTs7QUFFRCxTQUFPNkYsQ0FBQyxDQUFDN0YsSUFBRixDQUFRNEYsR0FBUixDQUFQO0FBQ0E7O0FBRUQsU0FBU08sUUFBVCxDQUFtQnRLLEdBQW5CLEVBQXlCO0FBQ3hCLFNBQU9BLEdBQUcsQ0FBQzRDLE9BQUosQ0FBYSxNQUFiLEVBQXFCLEdBQXJCLENBQVA7QUFDQTs7QUFFRCxTQUFTOEIsYUFBVCxDQUF3QjFFLEdBQXhCLEVBQThCO0FBQzdCLE1BQU11SyxLQUFLLEdBQUcxUixRQUFRLENBQUVtSCxHQUFHLENBQUM0QyxPQUFKLENBQWEsa0JBQWIsRUFBaUMsSUFBakMsQ0FBRixDQUF0Qjs7QUFFQSxNQUFLMkgsS0FBTCxFQUFhO0FBQ1p2SyxJQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQzRDLE9BQUosQ0FBYSxlQUFiLEVBQThCLEVBQTlCLENBQU47QUFDQTs7QUFFRCxTQUFPMEgsUUFBUSxDQUFFdEssR0FBRixDQUFmO0FBQ0EiLCJmaWxlIjoid2MtYWpheC1wcm9kdWN0LWZpbHRlci1wdWJsaWMtc2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIG1haW4ganMgZmlsZS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9wdWJsaWMvc3JjL2pzXG4gKiBAYXV0aG9yICAgICB3cHRvb2xzLmlvXG4gKi9cblxuY29uc3Qgd2NhcGZfcGFyYW1zID0gd2NhcGZfcGFyYW1zIHx8IHtcblx0J2lzX3J0bCc6ICcnLFxuXHQnZmlsdGVyX2lucHV0X2RlbGF5JzogJycsXG5cdCdjb21ib2JveF9kaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMnOiAnJyxcblx0J2NvbWJvYm94X25vX3Jlc3VsdHNfdGV4dCc6ICcnLFxuXHQnY29tYm9ib3hfb3B0aW9uc19ub25lX3RleHQnOiAnJyxcblx0J3NlYXJjaF9ib3hfaW5fZGVmYXVsdF9vcmRlcmJ5JzogJycsXG5cdCdwcmVzZXJ2ZV9oaWVyYXJjaHlfYWNjb3JkaW9uX3N0YXRlJzogJycsXG5cdCdwcmVzZXJ2ZV9zb2Z0X2xpbWl0X3N0YXRlJzogJycsXG5cdCdlbmFibGVfYW5pbWF0aW9uX2Zvcl9maWx0ZXJfYWNjb3JkaW9uJzogJycsXG5cdCdmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCc6ICcnLFxuXHQnZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nJzogJycsXG5cdCdlbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uJzogJycsXG5cdCdoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCc6ICcnLFxuXHQnaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nJzogJycsXG5cdCdyZXN0b3JlX2ZvY3VzX2FmdGVyX2ZpbHRlcmluZyc6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9zcGVlZCc6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9lYXNpbmcnOiAnJyxcblx0J2lzX21vYmlsZSc6ICcnLFxuXHQncmVsb2FkX29uX2JhY2snOiAnJyxcblx0J2ZvdW5kX3djYXBmJzogJycsXG5cdCd3Y2FwZl9wcm8nOiAnJyxcblx0J3VwZGF0ZV9kb2N1bWVudF90aXRsZSc6ICcnLFxuXHQndXNlX3RpcHB5anMnOiAnJyxcblx0J3Nob3BfbG9vcF9jb250YWluZXInOiAnJyxcblx0J25vdF9mb3VuZF9jb250YWluZXInOiAnJyxcblx0J3BhZ2luYXRpb25fY29udGFpbmVyJzogJycsXG5cdCdkaXNhYmxlX2FqYXgnOiAnJyxcblx0J2VuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4JzogJycsXG5cdCdzb3J0aW5nX2NvbnRyb2wnOiAnJyxcblx0J2F0dGFjaF9jb21ib2JveF9vbl9zb3J0aW5nJzogJycsXG5cdCdsb2FkaW5nX2FuaW1hdGlvbic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvdyc6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd19mb3InOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfd2hlbic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudCc6ICcnLFxuXHQnc2Nyb2xsX29uJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX29mZnNldCc6ICcnLFxuXHQnZGlzYWJsZV9zY3JvbGxfYW5pbWF0aW9uJzogJycsXG5cdCdtb3JlX3NlbGVjdG9ycyc6ICcnLFxuXHQnY3VzdG9tX3NjcmlwdHMnOiAnJyxcbn07XG5cbiggZnVuY3Rpb24oICQsIHdpbmRvdyApIHtcblxuXHRjb25zdCBfZGVsYXkgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLmZpbHRlcl9pbnB1dF9kZWxheSApO1xuXHRjb25zdCBkZWxheSAgPSBfZGVsYXkgPj0gMCA/IF9kZWxheSA6IDMwMDtcblxuXHRjb25zdCBpc1BybyA9IHdjYXBmX3BhcmFtcy53Y2FwZl9wcm87XG5cblx0Y29uc3QgJGJvZHkgICAgID0gJCggJ2JvZHknICk7XG5cdGNvbnN0ICRkb2N1bWVudCA9ICQoIGRvY3VtZW50ICk7XG5cblx0Y29uc3QgaW5zdGFuY2VJZHMgPSBbXTtcblxuXHQkKCAnLndjYXBmLWZpbHRlcicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCBpZCA9ICQoIHRoaXMgKS5kYXRhKCAnaWQnICk7XG5cblx0XHRpZiAoICEgaWQgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aW5zdGFuY2VJZHMucHVzaCggaWQgKTtcblx0fSApO1xuXG5cdGxldCBmb2N1c2VkRWxtO1xuXG5cdHdpbmRvdy50aXBweUluc3RhbmNlcyA9IFtdO1xuXG5cdHdpbmRvdy5XQ0FQRiA9IHdpbmRvdy5XQ0FQRiB8fCB7fTtcblxuXHR3aW5kb3cuV0NBUEYgPSB7XG5cdFx0aGFuZGxlRmlsdGVyQWNjb3JkaW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHRvZ2dsZUFjY29yZGlvbiA9ICggJGVsICkgPT4ge1xuXHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGFjY29yZGlvbiBpcyBvcGVuZWRcblx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1leHBhbmRlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdC8vIENoYW5nZSBhcmlhLWV4cGFuZGVkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuXHRcdFx0XHQkZWwuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAhIHByZXNzZWQgKTtcblxuXHRcdFx0XHRjb25zdCAkZmlsdGVySW5uZXIgPSAkZWwuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXInICkuY2hpbGRyZW4oICcud2NhcGYtZmlsdGVyLWlubmVyJyApO1xuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9hbmltYXRpb25fZm9yX2ZpbHRlcl9hY2NvcmRpb24gKSB7XG5cdFx0XHRcdFx0JGZpbHRlcklubmVyLnNsaWRlVG9nZ2xlKFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkLFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZ1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JGZpbHRlcklubmVyLnRvZ2dsZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHQkYm9keS5vbiggJ2NsaWNrJywgJy53Y2FwZi1maWx0ZXItYWNjb3JkaW9uLXRyaWdnZXInLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQkYm9keS5vbiggJ2NsaWNrJywgJy53Y2FwZi1maWx0ZXItdGl0bGUuaGFzLWFjY29yZGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkdHJpZ2dlciA9ICQoIHRoaXMgKS5maW5kKCAnLndjYXBmLWZpbHRlci1hY2NvcmRpb24tdHJpZ2dlcicgKTtcblxuXHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICR0cmlnZ2VyICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVIaWVyYXJjaHlUb2dnbGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgdG9nZ2xlQWNjb3JkaW9uID0gKCAkZWwgKSA9PiB7XG5cdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYnV0dG9uIGlzIHByZXNzZWRcblx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0Ly8gQ2hhbmdlIGFyaWEtcHJlc3NlZCB0byB0aGUgb3Bwb3NpdGUgc3RhdGVcblx0XHRcdFx0JGVsLmF0dHIoICdhcmlhLXByZXNzZWQnLCAhIHByZXNzZWQgKTtcblxuXHRcdFx0XHRjb25zdCAkY2hpbGQgPSAkZWwuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICk7XG5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbiApIHtcblx0XHRcdFx0XHQkY2hpbGQuc2xpZGVUb2dnbGUoXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQsXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkY2hpbGQudG9nZ2xlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdCRib2R5XG5cdFx0XHRcdC5vbiggJ2NsaWNrJywgJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0XHRcdH0gKVxuXHRcdFx0XHQub24oICdrZXlkb3duJywgJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdGlmICggZS5rZXkgPT09ICcgJyB8fCBlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJ1NwYWNlYmFyJyApIHtcblx0XHRcdFx0XHRcdC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgYWN0aW9uIHRvIHN0b3Agc2Nyb2xsaW5nIHdoZW4gc3BhY2UgaXMgcHJlc3NlZFxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlU29mdExpbWl0OiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHRvZ2dsZUZpbHRlck9wdGlvbnMgPSAoICRlbCApID0+IHtcblx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBidXR0b24gaXMgcHJlc3NlZFxuXHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLXByZXNzZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHQvLyBDaGFuZ2UgYXJpYS1wcmVzc2VkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuXHRcdFx0XHQkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICEgcHJlc3NlZCApO1xuXG5cdFx0XHRcdGNvbnN0ICRsaXN0V3JhcHBlciA9ICRlbC5jbG9zZXN0KCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKTtcblxuXHRcdFx0XHRpZiAoIHByZXNzZWQgKSB7XG5cdFx0XHRcdFx0JGxpc3RXcmFwcGVyLnJlbW92ZUNsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkbGlzdFdyYXBwZXIuYWRkQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHQkYm9keVxuXHRcdFx0XHQub24oICdjbGljaycsICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dG9nZ2xlRmlsdGVyT3B0aW9ucyggJCggdGhpcyApICk7XG5cdFx0XHRcdH0gKVxuXHRcdFx0XHQub24oICdrZXlkb3duJywgJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRpZiAoIGUua2V5ID09PSAnICcgfHwgZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICdTcGFjZWJhcicgKSB7XG5cdFx0XHRcdFx0XHQvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvbiB0byBzdG9wIHNjcm9sbGluZyB3aGVuIHNwYWNlIGlzIHByZXNzZWRcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdFx0dG9nZ2xlRmlsdGVyT3B0aW9ucyggJCggdGhpcyApICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVTZWFyY2hGaWx0ZXJPcHRpb25zOiBmdW5jdGlvbigpIHtcblx0XHRcdCRib2R5Lm9uKCAnaW5wdXQnLCAnLndjYXBmLXNlYXJjaC1ib3ggaW5wdXRbdHlwZT1cInRleHRcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRoYXQgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgJGlubmVyICA9ICR0aGF0LmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyLWlubmVyJyApO1xuXHRcdFx0XHRjb25zdCAkZmlsdGVyID0gJGlubmVyLmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyJyApO1xuXG5cdFx0XHRcdGNvbnN0IHNvZnRMaW1pdEVuYWJsZWQgPSAkZmlsdGVyLmhhc0NsYXNzKCAnaGFzLXNvZnQtbGltaXQnICk7XG5cdFx0XHRcdGNvbnN0IHNvZnRMaW1pdFRvZ2dsZSAgPSAkZmlsdGVyLmZpbmQoICcud2NhcGYtc29mdC1saW1pdC13cmFwcGVyJyApO1xuXHRcdFx0XHRjb25zdCBub1Jlc3VsdHMgICAgICAgID0gJGZpbHRlci5maW5kKCAnLndjYXBmLW5vLXJlc3VsdHMtdGV4dCcgKTtcblx0XHRcdFx0Y29uc3QgdmlzaWJsZU9wdGlvbnMgICA9IHBhcnNlSW50KCAkZmlsdGVyLmF0dHIoICdkYXRhLXZpc2libGUtb3B0aW9ucycgKSApO1xuXG5cdFx0XHRcdGNvbnN0IGtleXdvcmQgPSAkdGhhdC52YWwoKTtcblxuXHRcdFx0XHRpZiAoICEga2V5d29yZC5sZW5ndGggKSB7XG5cdFx0XHRcdFx0bGV0IGluZGV4ID0gMDtcblx0XHRcdFx0XHQkZmlsdGVyLnJlbW92ZUNsYXNzKCAnc2VhcmNoLWFjdGl2ZScgKTtcblxuXHRcdFx0XHRcdCQuZWFjaCggJGlubmVyLmZpbmQoICcud2NhcGYtZmlsdGVyLW9wdGlvbnMgPiBsaScgKSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRpbmRleCsrO1xuXG5cdFx0XHRcdFx0XHRjb25zdCAkZmlsdGVySXRlbSA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLnJlbW92ZUNsYXNzKCAna2V5d29yZC1tYXRjaGVkJyApO1xuXG5cdFx0XHRcdFx0XHRpZiAoIHNvZnRMaW1pdEVuYWJsZWQgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggaW5kZXggPiB2aXNpYmxlT3B0aW9ucyApIHtcblx0XHRcdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5hZGRDbGFzcyggJ3djYXBmLWZpbHRlci1vcHRpb24taGlkZGVuJyApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLnJlbW92ZUNsYXNzKCAnd2NhcGYtZmlsdGVyLW9wdGlvbi1oaWRkZW4nICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0XHRpZiAoIHNvZnRMaW1pdEVuYWJsZWQgKSB7XG5cdFx0XHRcdFx0XHRzb2Z0TGltaXRUb2dnbGUucmVtb3ZlQXR0ciggJ3N0eWxlJyApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdG5vUmVzdWx0cy5jaGlsZHJlbiggJ3NwYW4nICkudGV4dCggJycgKTtcblx0XHRcdFx0XHRub1Jlc3VsdHMuaGlkZSgpO1xuXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IGluZGV4ID0gMDtcblx0XHRcdFx0JGZpbHRlci5hZGRDbGFzcyggJ3NlYXJjaC1hY3RpdmUnICk7XG5cblx0XHRcdFx0JC5lYWNoKCAkaW5uZXIuZmluZCggJy53Y2FwZi1maWx0ZXItb3B0aW9ucyA+IGxpJyApLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCAkZmlsdGVySXRlbSA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRjb25zdCBsYWJlbCAgICAgICA9ICRmaWx0ZXJJdGVtLmZpbmQoICcud2NhcGYtZmlsdGVyLWl0ZW0tbGFiZWwnICkuZGF0YSggJ2xhYmVsJyApO1xuXG5cdFx0XHRcdFx0aWYgKCBsYWJlbC50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoIGtleXdvcmQudG9Mb3dlckNhc2UoKSApICkge1xuXHRcdFx0XHRcdFx0aW5kZXgrKztcblxuXHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0uYWRkQ2xhc3MoICdrZXl3b3JkLW1hdGNoZWQnICk7XG5cblx0XHRcdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCBpbmRleCA+IHZpc2libGVPcHRpb25zICkge1xuXHRcdFx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLmFkZENsYXNzKCAnd2NhcGYtZmlsdGVyLW9wdGlvbi1oaWRkZW4nICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5yZW1vdmVDbGFzcyggJ2tleXdvcmQtbWF0Y2hlZCcgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRpZiAoIHNvZnRMaW1pdEVuYWJsZWQgKSB7XG5cdFx0XHRcdFx0aWYgKCBpbmRleCA8PSB2aXNpYmxlT3B0aW9ucyApIHtcblx0XHRcdFx0XHRcdHNvZnRMaW1pdFRvZ2dsZS5oaWRlKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHNvZnRMaW1pdFRvZ2dsZS5zaG93KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCAwID09PSBpbmRleCApIHtcblx0XHRcdFx0XHRub1Jlc3VsdHMuY2hpbGRyZW4oICdzcGFuJyApLnRleHQoIGtleXdvcmQgKTtcblx0XHRcdFx0XHRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5jaGlsZHJlbiggJ3NwYW4nICkudGV4dCggJycgKTtcblx0XHRcdFx0XHRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHR1cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0OiBmdW5jdGlvbiggJHJlc3BvbnNlICkge1xuXHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRjb25zdCBzZWxlY3RvciAgID0gJy53b29jb21tZXJjZS1yZXN1bHQtY291bnQnO1xuXHRcdFx0Y29uc3QgbmV3Q291bnQgICA9ICRyZXNwb25zZS5maW5kKCBzZWxlY3RvciApLmh0bWwoKTtcblxuXHRcdFx0JGJvZHkuZmluZCggc2VsZWN0b3IgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGVsID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdGlmICggISAkY29udGFpbmVyLmhhcyggJGVsICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdCRlbC5odG1sKCBuZXdDb3VudCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRzY3JvbGxUbzogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICdub25lJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc2Nyb2xsRm9yID0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfZm9yO1xuXHRcdFx0Y29uc3QgaXNNb2JpbGUgID0gd2NhcGZfcGFyYW1zLmlzX21vYmlsZTtcblx0XHRcdGxldCBwcm9jZWVkICAgICA9IGZhbHNlO1xuXG5cdFx0XHRpZiAoICdtb2JpbGUnID09PSBzY3JvbGxGb3IgJiYgaXNNb2JpbGUgKSB7XG5cdFx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmICggJ2Rlc2t0b3AnID09PSBzY3JvbGxGb3IgJiYgISBpc01vYmlsZSApIHtcblx0XHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0XHR9IGVsc2UgaWYgKCAnYm90aCcgPT09IHNjcm9sbEZvciApIHtcblx0XHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISBwcm9jZWVkICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCBhZGp1c3RpbmdPZmZzZXQgPSAwLCBvZmZzZXQgPSAwO1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX29mZnNldCApIHtcblx0XHRcdFx0YWRqdXN0aW5nT2Zmc2V0ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX29mZnNldCApO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgY29udGFpbmVyO1xuXG5cdFx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lcjtcblx0XHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lcjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAnY3VzdG9tJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRcdGNvbnRhaW5lciA9IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50O1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCAkY29udGFpbmVyID0gJCggY29udGFpbmVyICk7XG5cblx0XHRcdGlmICggJGNvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdG9mZnNldCA9ICRjb250YWluZXIub2Zmc2V0KCkudG9wIC0gYWRqdXN0aW5nT2Zmc2V0O1xuXG5cdFx0XHRcdGlmICggb2Zmc2V0IDwgMCApIHtcblx0XHRcdFx0XHRvZmZzZXQgPSAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JCggJ2h0bWwsIGJvZHknICkuc3RvcCgpLmFuaW1hdGUoXG5cdFx0XHRcdFx0eyBzY3JvbGxUb3A6IG9mZnNldCB9LFxuXHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX3NwZWVkLFxuXHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX2Vhc2luZ1xuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Ly8gVGhpbmdzIGFyZSBkb25lIGJlZm9yZSBmZXRjaGluZyB0aGUgcHJvZHVjdHMgbGlrZSBzaG93aW5nIHRoZSBsb2FkaW5nIGluZGljYXRvci5cblx0XHRiZWZvcmVGZXRjaGluZ1Byb2R1Y3RzOiBmdW5jdGlvbiggdHJpZ2dlcmVkQnkgKSB7XG5cdFx0XHQvLyBUcmFjayB0aGUgY3VycmVudCBlbGVtZW50IGZvY3VzLlxuXHRcdFx0Zm9jdXNlZEVsbSA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG5cblx0XHRcdCRib2R5LmZpbmQoICcud2NhcGYtbG9hZGVyJyApLmFkZENsYXNzKCAnaXMtYWN0aXZlJyApO1xuXG5cdFx0XHRpZiAoICEgaXNQcm8gJiYgJ2ltbWVkaWF0ZWx5JyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfd2hlbiApIHtcblx0XHRcdFx0V0NBUEYuc2Nyb2xsVG8oKTtcblx0XHRcdH1cblxuXHRcdFx0JGRvY3VtZW50LnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfZmV0Y2hpbmdfcHJvZHVjdHMnLCBbIHRyaWdnZXJlZEJ5IF0gKTtcblx0XHR9LFxuXHRcdGRlc3Ryb3lUaXBweUluc3RhbmNlczogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy51c2VfdGlwcHlqcyApIHtcblx0XHRcdFx0Ly8gQHNvdXJjZSBodHRwczovL2dpdGh1Yi5jb20vYXRvbWlrcy90aXBweWpzL2lzc3Vlcy80NzNcblx0XHRcdFx0dGlwcHlJbnN0YW5jZXMuZm9yRWFjaCggaW5zdGFuY2UgPT4ge1xuXHRcdFx0XHRcdGluc3RhbmNlLmRlc3Ryb3koKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0XHR0aXBweUluc3RhbmNlcy5sZW5ndGggPSAwOyAvLyBjbGVhciBpdFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Ly8gVGhpbmdzIGFyZSBkb25lIGJlZm9yZSB1cGRhdGluZyB0aGUgcHJvZHVjdHMgbGlrZSBoaWRpbmcgdGhlIGxvYWRpbmcgaW5kaWNhdG9yLlxuXHRcdGJlZm9yZVVwZGF0aW5nUHJvZHVjdHM6IGZ1bmN0aW9uKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICkge1xuXHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1sb2FkZXInICkucmVtb3ZlQ2xhc3MoICdpcy1hY3RpdmUnICk7XG5cblx0XHRcdC8vIE1heWJlIGdvb2QgZm9yIHBlcmZvcm1hbmNlLlxuXHRcdFx0V0NBUEYuZGVzdHJveVRpcHB5SW5zdGFuY2VzKCk7XG5cblx0XHRcdCRkb2N1bWVudC50cmlnZ2VyKCAnd2NhcGZfYmVmb3JlX3VwZGF0aW5nX3Byb2R1Y3RzJywgWyAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5IF0gKTtcblx0XHR9LFxuXHRcdGFmdGVyVXBkYXRpbmdQcm9kdWN0czogZnVuY3Rpb24oICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgKSB7XG5cdFx0XHRXQ0FQRi51cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0KCAkcmVzcG9uc2UgKTtcblxuXHRcdFx0Ly8gUmVzdG9yZSB0aGUgZm9jdXMgKE1heWJlIHJlc3RvcmluZyB0aGUgZm9jdXMgaW4gbW9iaWxlIGRldmljZSBpc24ndCBnb29kKS5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnJlc3RvcmVfZm9jdXNfYWZ0ZXJfZmlsdGVyaW5nICYmICEgd2NhcGZfcGFyYW1zLmlzX21vYmlsZSApIHtcblx0XHRcdFx0aWYgKCBkb2N1bWVudC5ib2R5ICE9PSBmb2N1c2VkRWxtICkge1xuXHRcdFx0XHRcdGlmICggZm9jdXNlZEVsbS5pZCApIHtcblx0XHRcdFx0XHRcdCQoIGAjJHsgZm9jdXNlZEVsbS5pZCB9YCApLmZvY3VzKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlaW5pdGlhbGl6ZSB3Y2FwZi5cblx0XHRcdFdDQVBGLmluaXQoKTtcblxuXHRcdFx0aWYgKCAhIGlzUHJvICYmICdhZnRlcicgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X3doZW4gKSB7XG5cdFx0XHRcdFdDQVBGLnNjcm9sbFRvKCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRyaWdnZXIgZXZlbnRzLlxuXHRcdFx0JCggZG9jdW1lbnQgKS50cmlnZ2VyKCAncmVhZHknICk7XG5cdFx0XHQkKCB3aW5kb3cgKS50cmlnZ2VyKCAnc2Nyb2xsJyApO1xuXHRcdFx0JCggd2luZG93ICkudHJpZ2dlciggJ3Jlc2l6ZScgKTtcblxuXHRcdFx0Ly8gQTMgTGF6eSBMb2FkIHN1cHBvcnQuXG5cdFx0XHQkKCB3aW5kb3cgKS50cmlnZ2VyKCAnbGF6eXNob3cnICk7XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmN1c3RvbV9zY3JpcHRzICkge1xuXHRcdFx0XHRldmFsKCB3Y2FwZl9wYXJhbXMuY3VzdG9tX3NjcmlwdHMgKTtcblx0XHRcdH1cblxuXHRcdFx0JGRvY3VtZW50LnRyaWdnZXIoICd3Y2FwZl9hZnRlcl91cGRhdGluZ19wcm9kdWN0cycsIFsgJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSBdICk7XG5cdFx0fSxcblx0XHRmaWx0ZXJQcm9kdWN0czogZnVuY3Rpb24oIHRyaWdnZXJlZEJ5ID0gJ2ZpbHRlcicgKSB7XG5cdFx0XHRXQ0FQRi5iZWZvcmVGZXRjaGluZ1Byb2R1Y3RzKCB0cmlnZ2VyZWRCeSApO1xuXG5cdFx0XHQkLmFqYXgoIHtcblx0XHRcdFx0dXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0XHRcdGNvbnN0ICRyZXNwb25zZSA9ICQoIHJlc3BvbnNlICk7XG5cblx0XHRcdFx0XHRXQ0FQRi5iZWZvcmVVcGRhdGluZ1Byb2R1Y3RzKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICk7XG5cblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBVcGRhdGUgZG9jdW1lbnQgdGl0bGUuXG5cdFx0XHRcdFx0ICpcblx0XHRcdFx0XHQgKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS83NTk5NTYyXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMudXBkYXRlX2RvY3VtZW50X3RpdGxlICkge1xuXHRcdFx0XHRcdFx0ZG9jdW1lbnQudGl0bGUgPSAkcmVzcG9uc2UuZmlsdGVyKCAndGl0bGUnICkudGV4dCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgaW5zdGFuY2VzLlxuXHRcdFx0XHRcdGZvciAoIGNvbnN0IGlkIG9mIGluc3RhbmNlSWRzICkge1xuXHRcdFx0XHRcdFx0Y29uc3QgaW5zdGFuY2VJZCA9ICdbZGF0YS1pZD1cIicgKyBpZCArICdcIl0nO1xuXHRcdFx0XHRcdFx0Y29uc3QgJGluc3RhbmNlICA9ICQoIGluc3RhbmNlSWQgKTtcblx0XHRcdFx0XHRcdGNvbnN0ICRpbm5lciAgICAgPSAkaW5zdGFuY2UuZmluZCggJy53Y2FwZi1maWx0ZXItaW5uZXInICk7XG5cdFx0XHRcdFx0XHRjb25zdCBfaW5zdGFuY2UgID0gJHJlc3BvbnNlLmZpbmQoIGluc3RhbmNlSWQgKTtcblxuXHRcdFx0XHRcdFx0Ly8gUHJlc2VydmUgaGllcmFyY2h5IGFjY29yZGlvbiBzdGF0ZS5cblx0XHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJGluc3RhbmNlLmhhc0NsYXNzKCAnaGFzLWhpZXJhcmNoeS1hY2NvcmRpb24nICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JGluc3RhbmNlLmZpbmQoICcud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCAkZWwgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBpZCAgPSAkZWwuZGF0YSggJ2lkJyApO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCB0b2dnbGVTZWxlY3RvciA9IGAud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGVbZGF0YS1pZD1cIiR7IGlkIH1cIl1gO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGFjY29yZGlvbiBpcyBvcGVuZWRcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIHByZXNzZWQgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCB0b2dnbGVTZWxlY3RvciApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAndHJ1ZScgKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICkuc2hvdygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICdmYWxzZScgKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICkuaGlkZSgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBQcmVzZXJ2ZSBzb2Z0IGxpbWl0IHN0YXRlLlxuXHRcdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucHJlc2VydmVfc29mdF9saW1pdF9zdGF0ZSApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkaW5zdGFuY2UuaGFzQ2xhc3MoICdoYXMtc29mdC1saW1pdCcgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCAkbGlzdFdyYXBwZXIgPSAkaW5zdGFuY2UuZmluZCggJy53Y2FwZi1saXN0LXdyYXBwZXInICk7XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAoICRsaXN0V3JhcHBlci5oYXNDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1saXN0LXdyYXBwZXInICkuYWRkQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJyApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAndHJ1ZScgKTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtbGlzdC13cmFwcGVyJyApLnJlbW92ZUNsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLXNvZnQtbGltaXQtdHJpZ2dlcicgKS5hdHRyKCAnYXJpYS1wcmVzc2VkJywgJ2ZhbHNlJyApO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRjb25zdCBfaHRtbCA9IF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLWZpbHRlci1pbm5lcicgKS5odG1sKCk7XG5cblx0XHRcdFx0XHRcdC8vIEZpbmFsbHkgdXBkYXRlIHRoZSBpbnN0YW5jZS5cblx0XHRcdFx0XHRcdCRpbm5lci5odG1sKCBfaHRtbCApO1xuXG5cdFx0XHRcdFx0XHQkaW5zdGFuY2UudHJpZ2dlciggJ3djYXBmLWZpbHRlci11cGRhdGVkJywgWyBfaW5zdGFuY2UgXSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgYWN0aXZlIGZpbHRlcnMgYW5kIHJlc2V0IGZpbHRlcnMuXG5cdFx0XHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1hY3RpdmUtZmlsdGVycywgLndjYXBmLXJlc2V0LWZpbHRlcnMnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRjb25zdCAkdGhhdCAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdFx0Y29uc3QgaW5zdGFuY2VJZCA9ICdbZGF0YS1pZD1cIicgKyAkdGhhdC5kYXRhKCAnaWQnICkgKyAnXCJdJztcblxuXHRcdFx0XHRcdFx0JHRoYXQuaHRtbCggJHJlc3BvbnNlLmZpbmQoIGluc3RhbmNlSWQgKS5odG1sKCkgKTtcblx0XHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0XHQvLyBSZXBsYWNlIG9sZCBzaG9wIGxvb3Agd2l0aCBuZXcgb25lLlxuXHRcdFx0XHRcdGNvbnN0ICRzaG9wTG9vcENvbnRhaW5lciA9ICRyZXNwb25zZS5maW5kKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0XHRcdGNvbnN0ICRub3RGb3VuZENvbnRhaW5lciA9ICRyZXNwb25zZS5maW5kKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApO1xuXG5cdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciA9PT0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0V0NBUEYuYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdHJlcXVlc3RGaWx0ZXI6IGZ1bmN0aW9uKCB1cmwsIHRyaWdnZXJlZEJ5ID0gJ2ZpbHRlcicgKSB7XG5cdFx0XHRpZiAoICEgdXJsICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmRpc2FibGVfYWpheCApIHtcblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmw7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSggeyB3Y2FwZjogdHJ1ZSB9LCAnJywgdXJsICk7XG5cblx0XHRcdFx0V0NBUEYuZmlsdGVyUHJvZHVjdHMoIHRyaWdnZXJlZEJ5ICk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRoYW5kbGVOdW1iZXJJbnB1dEZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgcmFuZ2VOdW1iZXJTZWxlY3RvcnMgPSAnLndjYXBmLXJhbmdlLW51bWJlciAubWluLXZhbHVlLCAud2NhcGYtcmFuZ2UtbnVtYmVyIC5tYXgtdmFsdWUnO1xuXG5cdFx0XHQkYm9keS5vbiggJ2lucHV0JywgcmFuZ2VOdW1iZXJTZWxlY3RvcnMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRjb25zdCAkcmFuZ2VOdW1iZXIgICAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtcmFuZ2UtbnVtYmVyJyApO1xuXHRcdFx0XHRjb25zdCBmb3JtYXROdW1iZXJzICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1mb3JtYXQtbnVtYmVycycgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBvbGRNaW5WYWx1ZSAgICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgb2xkTWF4VmFsdWUgICAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWRlY2ltYWwtcGxhY2VzJyApO1xuXHRcdFx0XHRjb25zdCB0aG91c2FuZFNlcGFyYXRvciA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS10aG91c2FuZC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdGNvbnN0IGdldFZhbHVlID0gKCBmbG9hdFZhbHVlICkgPT4ge1xuXHRcdFx0XHRcdGlmICggZm9ybWF0TnVtYmVycyApIHtcblx0XHRcdFx0XHRcdHJldHVybiBudW1iZXJGb3JtYXQoIGZsb2F0VmFsdWUsIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIGZsb2F0VmFsdWU7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0bGV0IG1pblZhbHVlID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCgpICk7XG5cdFx0XHRcdFx0bGV0IG1heFZhbHVlID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCgpICk7XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0XHRcdGlmICggaXNOYU4oIG1pblZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdFx0XHRpZiAoIGlzTmFOKCBtYXhWYWx1ZSApICkge1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gYmVsb3cgdGhlIHJhbmdlTWluVmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA8IHJhbmdlTWluVmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID4gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0XHRcdGlmICggbWF4VmFsdWUgPiByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gZ28gYmVsb3cgdGhlIG1pblZhbHVlLlxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPiBtYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gbWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gSWYgdmFsdWUgaXMgbm90IGNoYW5nZWQgdGhlbiBkb24ndCBwcm9jZWVkLlxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPT09IG9sZE1pblZhbHVlICYmIG1heFZhbHVlID09PSBvbGRNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIG1heFZhbHVlID09PSByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0Ly8gUmVtb3ZlIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICRyYW5nZU51bWJlci5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBBZGQgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0Y29uc3QgdXJsID0gJHJhbmdlTnVtYmVyLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIG1pblZhbHVlICkucmVwbGFjZSggJyUycycsIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZURhdGVJbnB1dEZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCAnLndjYXBmLWRhdGUtaW5wdXQgLmRhdGUtaW5wdXQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGZpbHRlciA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWRhdGUtaW5wdXQnICk7XG5cdFx0XHRcdGNvbnN0IGlzUmFuZ2UgPSAkZmlsdGVyLmRhdGEoICdpcy1yYW5nZScgKTtcblxuXHRcdFx0XHRsZXQgZmlsdGVyVXJsID0gJyc7XG5cblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGZpbHRlci5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRpZiAoIGlzUmFuZ2UgKSB7XG5cdFx0XHRcdFx0Y29uc3QgZnJvbSA9ICRmaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICkudmFsKCk7XG5cdFx0XHRcdFx0Y29uc3QgdG8gICA9ICRmaWx0ZXIuZmluZCggJy5kYXRlLXRvLWlucHV0JyApLnZhbCgpO1xuXG5cdFx0XHRcdFx0aWYgKCBmcm9tICYmIHRvICkge1xuXHRcdFx0XHRcdFx0ZmlsdGVyVXJsID0gJGZpbHRlci5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclMXMnLCBmcm9tICkucmVwbGFjZSggJyUycycsIHRvICk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggISBmcm9tICYmICEgdG8gKSB7XG5cdFx0XHRcdFx0XHRmaWx0ZXJVcmwgPSAkZmlsdGVyLmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zdCBmcm9tID0gJGZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKS52YWwoKTtcblxuXHRcdFx0XHRcdGlmICggZnJvbSApIHtcblx0XHRcdFx0XHRcdGZpbHRlclVybCA9ICRmaWx0ZXIuZGF0YSggJ3VybCcgKS5yZXBsYWNlKCAnJXMnLCBmcm9tICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGZpbHRlclVybCA9ICRmaWx0ZXIuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBmaWx0ZXJVcmwgKSB7XG5cdFx0XHRcdFx0JGZpbHRlci5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCRmaWx0ZXIucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCBmaWx0ZXJVcmwgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZUxpc3RGaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IG5hdGl2ZUlucHV0cyA9ICcubGlzdC10eXBlLW5hdGl2ZSBbdHlwZT1cImNoZWNrYm94XCJdLCcgK1xuXHRcdFx0XHQnLmxpc3QtdHlwZS1uYXRpdmUgW3R5cGU9XCJyYWRpb1wiXSwnICtcblx0XHRcdFx0Jy5saXN0LXR5cGUtY3VzdG9tLWNoZWNrYm94IFt0eXBlPVwiY2hlY2tib3hcIl0nO1xuXG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsIG5hdGl2ZUlucHV0cywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZpbHRlci1pdGVtJyApLnRvZ2dsZUNsYXNzKCAnaXRlbS1hY3RpdmUnICk7XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJCggdGhpcyApLmRhdGEoICd1cmwnICkgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Y29uc3QgY3VzdG9tUmFkaW9TZWxlY3RvciA9ICcubGlzdC10eXBlLWN1c3RvbS1yYWRpbyc7XG5cblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgY3VzdG9tUmFkaW9TZWxlY3RvciArICcgW3R5cGU9XCJjaGVja2JveFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXItaXRlbScgKS50b2dnbGVDbGFzcyggJ2l0ZW0tYWN0aXZlJyApO1xuXG5cdFx0XHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81ODM5OTI0XG5cdFx0XHRcdCQoIHRoaXMgKVxuXHRcdFx0XHRcdC5jbG9zZXN0KCBjdXN0b21SYWRpb1NlbGVjdG9yIClcblx0XHRcdFx0XHQuZmluZCggJy53Y2FwZi1maWx0ZXItaXRlbS5pdGVtLWFjdGl2ZSBbdHlwZT1cImNoZWNrYm94XCJdJyApXG5cdFx0XHRcdFx0Lm5vdCggdGhpcyApXG5cdFx0XHRcdFx0LnByb3AoICdjaGVja2VkJywgZmFsc2UgKVxuXHRcdFx0XHRcdC5jbG9zZXN0KCAnLndjYXBmLWZpbHRlci1pdGVtJyApXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCAnaXRlbS1hY3RpdmUnICk7XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJCggdGhpcyApLmRhdGEoICd1cmwnICkgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZURyb3Bkb3duRmlsdGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsICcud2NhcGYtZHJvcGRvd24td3JhcHBlciBzZWxlY3QnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHNlbGVjdCAgICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IHZhbHVlcyAgICAgICAgID0gJHNlbGVjdC52YWwoKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyVVJMICAgICAgPSAkc2VsZWN0LmRhdGEoICd1cmwnICk7XG5cdFx0XHRcdGNvbnN0IGNsZWFyRmlsdGVyVVJMID0gJHNlbGVjdC5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKTtcblx0XHRcdFx0bGV0IHVybDtcblxuXHRcdFx0XHRpZiAoIHZhbHVlcy5sZW5ndGggKSB7XG5cdFx0XHRcdFx0dXJsID0gZmlsdGVyVVJMLnJlcGxhY2UoICclcycsIHZhbHVlcy50b1N0cmluZygpICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dXJsID0gY2xlYXJGaWx0ZXJVUkw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZVBhZ2luYXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXggJiYgd2NhcGZfcGFyYW1zLnBhZ2luYXRpb25fY29udGFpbmVyICkge1xuXHRcdFx0XHRjb25zdCAkY29udGFpbmVyID0gJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdFx0Y29uc3QgX3NlbGVjdG9ycyA9IHdjYXBmX3BhcmFtcy5wYWdpbmF0aW9uX2NvbnRhaW5lci5zcGxpdCggJywnICk7XG5cdFx0XHRcdGNvbnN0IHNlbGVjdG9ycyAgPSBbXTtcblxuXHRcdFx0XHRfc2VsZWN0b3JzLmZvckVhY2goIHNlbGVjdG9yID0+IHtcblx0XHRcdFx0XHRpZiAoIHNlbGVjdG9yICkge1xuXHRcdFx0XHRcdFx0c2VsZWN0b3JzLnB1c2goIHNlbGVjdG9yICsgJyBhJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGNvbnN0IHNlbGVjdG9yID0gc2VsZWN0b3JzLmpvaW4oICcsJyApO1xuXG5cdFx0XHRcdGlmICggJGNvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0JGNvbnRhaW5lci5vbiggJ2NsaWNrJywgc2VsZWN0b3IsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBocmVmID0gJCggdGhpcyApLmF0dHIoICdocmVmJyApO1xuXG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCBocmVmLCAncGFnaW5hdGUnICk7XG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRoYW5kbGVEZWZhdWx0T3JkZXJieTogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLnNvcnRpbmdfY29udHJvbCApIHtcblx0XHRcdFx0Ly8gU3VibWl0IHRoZSBvcmRlcmJ5IGZvcm0gd2hlbiB2YWx1ZSBpcyBjaGFuZ2VkLlxuXHRcdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsICcud29vY29tbWVyY2Utb3JkZXJpbmcgc2VsZWN0Lm9yZGVyYnknLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKCB0aGlzICkuY2xvc2VzdCggJ2Zvcm0nICkudHJpZ2dlciggJ3N1Ym1pdCcgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUHJldmVudCB0aGUgYXV0byBzdWJtaXNzaW9uIG9mIHRoZSBvcmRlcmJ5IGZvcm0uXG5cdFx0XHQkYm9keS5vbiggJ3N1Ym1pdCcsICcud29vY29tbWVyY2Utb3JkZXJpbmcnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IHZpYSBhamF4IHdoZW4gdGhlIG9yZGVyYnkgdmFsdWUgaXMgY2hhbmdlZC5cblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgJy53b29jb21tZXJjZS1vcmRlcmluZyBzZWxlY3Qub3JkZXJieScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBvcmRlciA9ICQoIHRoaXMgKS52YWwoKTtcblxuXHRcdFx0XHRjb25zdCB1cmwgPSBuZXcgVVJMKCB3aW5kb3cubG9jYXRpb24gKTtcblx0XHRcdFx0dXJsLnNlYXJjaFBhcmFtcy5zZXQoICdvcmRlcmJ5Jywgb3JkZXIgKTtcblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCBnZXRPcmRlckJ5VXJsKCB1cmwuaHJlZiApICk7XG5cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlQ2xlYXJGaWx0ZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtZmlsdGVyLWNsZWFyLWJ0bicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5hdHRyKCAnZGF0YS1jbGVhci1maWx0ZXItdXJsJyApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVGaWx0ZXJUb29sdGlwOiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRSZWZlcmVuY2Vcblx0XHRcdGlmICggJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHRpcHB5ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMudXNlX3RpcHB5anMgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZFJlZmVyZW5jZVxuXHRcdFx0dGlwcHkoICcud2NhcGYtZmlsdGVyLXRvb2x0aXAnLCB7XG5cdFx0XHRcdHBsYWNlbWVudDogJ3RvcCcsXG5cdFx0XHRcdGNvbnRlbnQoIHJlZmVyZW5jZSApIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSggJ2RhdGEtY29udGVudCcgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0YWxsb3dIVE1MOiB0cnVlLFxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aW5pdENvbWJvYm94OiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggISBqUXVlcnkoKS5jaG9zZW5XQ0FQRiApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB0ZW1wbGF0ZVJlc3VsdCA9ICggdGV4dCwgZGF0YSApID0+IHtcblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQnPHNwYW4+JyArIHRleHQgKyAnPC9zcGFuPicsXG5cdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwid2NhcGYtY291bnRcIj4nICsgZGF0YVsgJ2NvdW50TWFya3VwJyBdICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRdLmpvaW4oICcnICk7XG5cdFx0XHR9O1xuXG5cdFx0XHRjb25zdCB0ZW1wbGF0ZVNlbGVjdGlvbiA9ICggdGV4dCwgZGF0YSApID0+IHtcblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJ3Y2FwZi1jb3VudC0nICsgZGF0YS5jb3VudCArICdcIj4nICsgdGV4dCArICc8L3NwYW4+Jyxcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJ3Y2FwZi1jb3VudCB3Y2FwZi1jb3VudC0nICsgZGF0YS5jb3VudCArICdcIj4nICsgZGF0YVsgJ2NvdW50TWFya3VwJyBdICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRdLmpvaW4oICcnICk7XG5cdFx0XHR9O1xuXG5cdFx0XHRjb25zdCBkZWZhdWx0cyA9IHtcblx0XHRcdFx0aW5oZXJpdF9zZWxlY3RfY2xhc3NlczogdHJ1ZSxcblx0XHRcdFx0aW5oZXJpdF9vcHRpb25fY2xhc3NlczogdHJ1ZSxcblx0XHRcdFx0bm9fcmVzdWx0c190ZXh0OiB3Y2FwZl9wYXJhbXMuY29tYm9ib3hfbm9fcmVzdWx0c190ZXh0LFxuXHRcdFx0XHRvcHRpb25zX25vbmVfdGV4dDogd2NhcGZfcGFyYW1zLmNvbWJvYm94X29wdGlvbnNfbm9uZV90ZXh0LFxuXHRcdFx0XHRzZWFyY2hfY29udGFpbnM6IHRydWUsIC8vIE1hdGNoIGZyb20gYW55d2hlcmUgaW4gc3RyaW5nLlxuXHRcdFx0XHRzZWFyY2hfaW5fdmFsdWVzOiB0cnVlLCAvLyBTZWFyY2ggaW4gdmFsdWVzIGFsc28uXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5pc19ydGwgKSB7XG5cdFx0XHRcdGRlZmF1bHRzWyAncnRsJyBdID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1jaG9zZW4nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0aGlzICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7IC4uLmRlZmF1bHRzIH07XG5cblx0XHRcdFx0Ly8gSWYgaGllcmFyY2h5IGVuYWJsZWQgdGhlbiB3ZSBzaG93IHRoZSBzZWxlY3RlZCBvcHRpb25zLlxuXHRcdFx0XHRpZiAoICR0aGlzLmhhc0NsYXNzKCAnaGFzLWhpZXJhcmNoeScgKSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJyBdID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJyBdID0gd2NhcGZfcGFyYW1zLmNvbWJvYm94X2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEVuYWJsZSB0ZW1wbGF0aW5nIHdoZW4gc2hvd2luZyBjb3VudC5cblx0XHRcdFx0aWYgKCAkdGhpcy5oYXNDbGFzcyggJ3dpdGgtY291bnQnICkgKSB7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ3RlbXBsYXRlUmVzdWx0JyBdICAgID0gdGVtcGxhdGVSZXN1bHQ7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ3RlbXBsYXRlU2VsZWN0aW9uJyBdID0gdGVtcGxhdGVTZWxlY3Rpb247XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBEaXNhYmxlIHNlYXJjaCBib3guXG5cdFx0XHRcdGlmICggISAkdGhpcy5kYXRhKCAnZW5hYmxlLXNlYXJjaCcgKSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnZGlzYWJsZV9zZWFyY2gnIF0gPSB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JHRoaXMuY2hvc2VuV0NBUEYoIG9wdGlvbnMgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gQXR0YWNoIGNob3NlbiBmb3IgZGVmYXVsdCBvcmRlcmJ5LlxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuYXR0YWNoX2NvbWJvYm94X29uX3NvcnRpbmcgKSB7XG5cdFx0XHRcdGxldCBkaXNhYmxlU2VhcmNoID0gdHJ1ZTtcblxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zZWFyY2hfYm94X2luX2RlZmF1bHRfb3JkZXJieSApIHtcblx0XHRcdFx0XHRkaXNhYmxlU2VhcmNoID0gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0cyB9O1xuXG5cdFx0XHRcdG9wdGlvbnNbICdkaXNhYmxlX3NlYXJjaCcgXSA9IGRpc2FibGVTZWFyY2g7XG5cblx0XHRcdFx0JGJvZHkuZmluZCggJy53b29jb21tZXJjZS1vcmRlcmluZyBzZWxlY3Qub3JkZXJieScgKS5jaG9zZW5XQ0FQRiggb3B0aW9ucyApO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aW5pdFJhbmdlU2xpZGVyOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCRib2R5LmZpbmQoICcud2NhcGYtcmFuZ2Utc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkaXRlbSAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCAkc2xpZGVyID0gJGl0ZW0uZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKTtcblxuXHRcdFx0XHRjb25zdCBzbGlkZXJJZCAgICAgICAgICA9ICRzbGlkZXIuYXR0ciggJ2lkJyApO1xuXHRcdFx0XHRjb25zdCBkaXNwbGF5VmFsdWVzQXMgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRpc3BsYXktdmFsdWVzLWFzJyApO1xuXHRcdFx0XHRjb25zdCBmb3JtYXROdW1iZXJzICAgICA9ICRpdGVtLmF0dHIoICdkYXRhLWZvcm1hdC1udW1iZXJzJyApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1pblZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBzdGVwICAgICAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXN0ZXAnICkgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFBsYWNlcyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRcdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkaXRlbS5hdHRyKCAnZGF0YS10aG91c2FuZC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IG1pblZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IG1heFZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0ICRtaW5WYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5taW4tdmFsdWUnICk7XG5cdFx0XHRcdGNvbnN0ICRtYXhWYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5tYXgtdmFsdWUnICk7XG5cblx0XHRcdFx0Y29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIHNsaWRlcklkICk7XG5cblx0XHRcdFx0bm9VaVNsaWRlci5jcmVhdGUoIHNsaWRlciwge1xuXHRcdFx0XHRcdHN0YXJ0OiBbIG1pblZhbHVlLCBtYXhWYWx1ZSBdLFxuXHRcdFx0XHRcdHN0ZXAsXG5cdFx0XHRcdFx0Y29ubmVjdDogdHJ1ZSxcblx0XHRcdFx0XHRjc3NQcmVmaXg6ICd3Y2FwZi1ub3VpLScsXG5cdFx0XHRcdFx0cmFuZ2U6IHtcblx0XHRcdFx0XHRcdCdtaW4nOiByYW5nZU1pblZhbHVlLFxuXHRcdFx0XHRcdFx0J21heCc6IHJhbmdlTWF4VmFsdWUsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICd1cGRhdGUnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHRcdGxldCBtaW5WYWx1ZTtcblx0XHRcdFx0XHRsZXQgbWF4VmFsdWU7XG5cblx0XHRcdFx0XHRpZiAoIGZvcm1hdE51bWJlcnMgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IG51bWJlckZvcm1hdCggdmFsdWVzWyAwIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IG51bWJlckZvcm1hdCggdmFsdWVzWyAxIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAwIF0gKTtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoICdwbGFpbl90ZXh0JyA9PT0gZGlzcGxheVZhbHVlc0FzICkge1xuXHRcdFx0XHRcdFx0JG1pblZhbHVlLmh0bWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0XHQkbWF4VmFsdWUuaHRtbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JG1pblZhbHVlLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHRcdCRtYXhWYWx1ZS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICkge1xuXHRcdFx0XHRcdGNvbnN0IF9taW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0Y29uc3QgX21heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblxuXHRcdFx0XHRcdC8vIElmIHZhbHVlIGlzIG5vdCBjaGFuZ2VkIHRoZW4gZG9uJ3QgcHJvY2VlZC5cblx0XHRcdFx0XHRpZiAoIF9taW5WYWx1ZSA9PT0gbWluVmFsdWUgJiYgX21heFZhbHVlID09PSBtYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIF9taW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBfbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHQvLyBSZW1vdmUgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJGl0ZW0uZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdGNvbnN0IHVybCA9ICRpdGVtLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIF9taW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBfbWF4VmFsdWUgKTtcblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtaW5WYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG1pblZhbHVlLCBudWxsIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkbWF4VmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRcdGNsZWFyVGltZW91dCggJGlucHV0LmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBudWxsLCBtYXhWYWx1ZSBdICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRpbml0RGF0ZXBpY2tlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgalF1ZXJ5KCkuZGF0ZXBpY2tlciApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCAkd2NhcGZEYXRlRmlsdGVyID0gJGJvZHkuZmluZCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXG5cdFx0XHRjb25zdCBmb3JtYXQgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLWZvcm1hdCcgKTtcblx0XHRcdGNvbnN0IHllYXJEcm9wZG93biAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtcGlja2VyLXllYXItZHJvcGRvd24nICk7XG5cdFx0XHRjb25zdCBtb250aERyb3Bkb3duID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLXBpY2tlci1tb250aC1kcm9wZG93bicgKTtcblxuXHRcdFx0Y29uc3QgJGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApO1xuXHRcdFx0Y29uc3QgJHRvICAgPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKTtcblxuXHRcdFx0JGZyb20uZGF0ZXBpY2tlcigge1xuXHRcdFx0XHRkYXRlRm9ybWF0OiBmb3JtYXQsXG5cdFx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdFx0Y2hhbmdlTW9udGg6IG1vbnRoRHJvcGRvd24sXG5cdFx0XHR9ICk7XG5cblx0XHRcdCR0by5kYXRlcGlja2VyKCB7XG5cdFx0XHRcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdFx0Y2hhbmdlWWVhcjogeWVhckRyb3Bkb3duLFxuXHRcdFx0XHRjaGFuZ2VNb250aDogbW9udGhEcm9wZG93bixcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXRGaWx0ZXJPcHRpb25Ub29sdGlwOiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRSZWZlcmVuY2Vcblx0XHRcdGlmICggJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHRpcHB5ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMudXNlX3RpcHB5anMgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgdG9vbHRpcFBvc2l0aW9ucyA9IFsgJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCcgXTtcblxuXHRcdFx0dG9vbHRpcFBvc2l0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbiggdG9vbHRpcFBvc2l0aW9uICkge1xuXHRcdFx0XHRjb25zdCBpZGVudGlmaWVyID0gJ2RhdGEtd2NhcGYtdG9vbHRpcC0nICsgdG9vbHRpcFBvc2l0aW9uO1xuXG5cdFx0XHRcdC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRSZWZlcmVuY2Vcblx0XHRcdFx0Y29uc3QgaW5zdGFuY2VzID0gdGlwcHkoICdbJyArIGlkZW50aWZpZXIgKyAnXScsIHtcblx0XHRcdFx0XHRwbGFjZW1lbnQ6IHRvb2x0aXBQb3NpdGlvbixcblx0XHRcdFx0XHRjb250ZW50KCByZWZlcmVuY2UgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSggaWRlbnRpZmllciApO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0YWxsb3dIVE1MOiB0cnVlLFxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0d2luZG93LnRpcHB5SW5zdGFuY2VzID0gdGlwcHlJbnN0YW5jZXMuY29uY2F0KCBpbnN0YW5jZXMgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0V0NBUEYuaW5pdENvbWJvYm94KCk7XG5cdFx0XHRXQ0FQRi5pbml0UmFuZ2VTbGlkZXIoKTtcblx0XHRcdFdDQVBGLmluaXREYXRlcGlja2VyKCk7XG5cdFx0XHRXQ0FQRi5pbml0RmlsdGVyT3B0aW9uVG9vbHRpcCgpO1xuXHRcdH0sXG5cdFx0aW5pdFBvcFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnJlbG9hZF9vbl9iYWNrICYmIHdjYXBmX3BhcmFtcy5mb3VuZF93Y2FwZiApIHtcblx0XHRcdFx0aGlzdG9yeS5yZXBsYWNlU3RhdGUoIHsgd2NhcGY6IHRydWUgfSwgJycsIHdpbmRvdy5sb2NhdGlvbiApO1xuXG5cdFx0XHRcdC8vIEhhbmRsZSB0aGUgcG9wc3RhdGUgZXZlbnQoYnJvd3NlcidzIGJhY2svZm9yd2FyZClcblx0XHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdwb3BzdGF0ZScsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdGlmICggbnVsbCAhPT0gZS5zdGF0ZSAmJiBlLnN0YXRlLmhhc093blByb3BlcnR5KCAnd2NhcGYnICkgKSB7XG5cdFx0XHRcdFx0XHRXQ0FQRi5maWx0ZXJQcm9kdWN0cyggJ3BvcHN0YXRlJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICogRW5hYmxlIGl0IGlmIG5lY2Vzc2FyeS5cblx0ICpcblx0ICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzMwMDQ5MTdcblx0ICovXG5cdGlmICggJ3Njcm9sbFJlc3RvcmF0aW9uJyBpbiBoaXN0b3J5ICkge1xuXHRcdC8vIGhpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb24gPSAnbWFudWFsJztcblx0fVxuXG59KCBqUXVlcnksIHdpbmRvdyApICk7XG5cbiggZnVuY3Rpb24oICQsIFdDQVBGICkge1xuXG5cdFdDQVBGLmluaXQoKTtcblx0V0NBUEYuaW5pdFBvcFN0YXRlKCk7XG5cblx0V0NBUEYuaGFuZGxlRmlsdGVyQWNjb3JkaW9uKCk7XG5cdFdDQVBGLmhhbmRsZUhpZXJhcmNoeVRvZ2dsZSgpO1xuXHRXQ0FQRi5oYW5kbGVTb2Z0TGltaXQoKTtcblx0V0NBUEYuaGFuZGxlU2VhcmNoRmlsdGVyT3B0aW9ucygpO1xuXG5cdFdDQVBGLmhhbmRsZUxpc3RGaWx0ZXJzKCk7XG5cdFdDQVBGLmhhbmRsZURyb3Bkb3duRmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVOdW1iZXJJbnB1dEZpbHRlcnMoKTtcblx0V0NBUEYuaGFuZGxlRGF0ZUlucHV0RmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVQYWdpbmF0aW9uKCk7XG5cdFdDQVBGLmhhbmRsZURlZmF1bHRPcmRlcmJ5KCk7XG5cblx0V0NBUEYuaGFuZGxlQ2xlYXJGaWx0ZXIoKTtcblxuXHRXQ0FQRi5oYW5kbGVGaWx0ZXJUb29sdGlwKCk7XG5cblx0LyoqXG5cdCAqIE1ha2UgaXQgY29tcGF0aWJsZSB3aXRoIG90aGVyIHBsdWdpbnMuXG5cdCAqL1xuXHQkKCBkb2N1bWVudCApLm9uKCAnd2NhcGZfYWZ0ZXJfdXBkYXRpbmdfcHJvZHVjdHMnLCBmdW5jdGlvbigpIHtcblx0XHQvLyB3b28tdmFyaWF0aW9uLXN3YXRjaGVzXG5cdFx0JCggZG9jdW1lbnQgKS50cmlnZ2VyKCAnd29vX3ZhcmlhdGlvbl9zd2F0Y2hlc19wcm9faW5pdCcgKTtcblx0fSApO1xuXG59KCBqUXVlcnksIHdpbmRvdy5XQ0FQRiApICk7XG4iLCIvKipcbiAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM0MTQxODEzXG4gKlxuICogQHBhcmFtIG51bWJlclxuICogQHBhcmFtIGRlY2ltYWxzXG4gKiBAcGFyYW0gZGVjX3BvaW50XG4gKiBAcGFyYW0gdGhvdXNhbmRzX3NlcFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIG51bWJlckZvcm1hdCggbnVtYmVyLCBkZWNpbWFscywgZGVjX3BvaW50LCB0aG91c2FuZHNfc2VwICkge1xuXHQvLyBTdHJpcCBhbGwgY2hhcmFjdGVycyBidXQgbnVtZXJpY2FsIG9uZXMuXG5cdG51bWJlciA9ICggbnVtYmVyICsgJycgKS5yZXBsYWNlKCAvW15cXGQrXFwtRWUuXS9nLCAnJyApO1xuXG5cdGNvbnN0IG4gICAgPSAhIGlzRmluaXRlKCArbnVtYmVyICkgPyAwIDogK251bWJlcjtcblx0Y29uc3QgcHJlYyA9ICEgaXNGaW5pdGUoICtkZWNpbWFscyApID8gMCA6IE1hdGguYWJzKCBkZWNpbWFscyApO1xuXHRjb25zdCBzZXAgID0gKCB0eXBlb2YgdGhvdXNhbmRzX3NlcCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcsJyA6IHRob3VzYW5kc19zZXA7XG5cdGNvbnN0IGRlYyAgPSAoIHR5cGVvZiBkZWNfcG9pbnQgPT09ICd1bmRlZmluZWQnICkgPyAnLicgOiBkZWNfcG9pbnQ7XG5cblx0bGV0IHM7XG5cblx0Y29uc3QgdG9GaXhlZEZpeCA9IGZ1bmN0aW9uKCBuLCBwcmVjICkge1xuXHRcdGNvbnN0IGsgPSBNYXRoLnBvdyggMTAsIHByZWMgKTtcblx0XHRyZXR1cm4gJycgKyBNYXRoLnJvdW5kKCBuICogayApIC8gaztcblx0fTtcblxuXHQvLyBGaXggZm9yIElFIHBhcnNlRmxvYXQoMC41NSkudG9GaXhlZCgwKSA9IDA7XG5cdHMgPSAoIHByZWMgPyB0b0ZpeGVkRml4KCBuLCBwcmVjICkgOiAnJyArIE1hdGgucm91bmQoIG4gKSApLnNwbGl0KCAnLicgKTtcblxuXHRpZiAoIHNbIDAgXS5sZW5ndGggPiAzICkge1xuXHRcdHNbIDAgXSA9IHNbIDAgXS5yZXBsYWNlKCAvXFxCKD89KD86XFxkezN9KSsoPyFcXGQpKS9nLCBzZXAgKTtcblx0fVxuXG5cdGlmICggKCBzWyAxIF0gfHwgJycgKS5sZW5ndGggPCBwcmVjICkge1xuXHRcdHNbIDEgXSA9IHNbIDEgXSB8fCAnJztcblx0XHRzWyAxIF0gKz0gbmV3IEFycmF5KCBwcmVjIC0gc1sgMSBdLmxlbmd0aCArIDEgKS5qb2luKCAnMCcgKTtcblx0fVxuXG5cdHJldHVybiBzLmpvaW4oIGRlYyApO1xufVxuXG5mdW5jdGlvbiBjbGVhblVybCggdXJsICkge1xuXHRyZXR1cm4gdXJsLnJlcGxhY2UoIC8lMkMvZywgJywnICk7XG59XG5cbmZ1bmN0aW9uIGdldE9yZGVyQnlVcmwoIHVybCApIHtcblx0Y29uc3QgcGFnZWQgPSBwYXJzZUludCggdXJsLnJlcGxhY2UoIC8uK1xcL3BhZ2VcXC8oXFxkKykrLywgJyQxJyApICk7XG5cblx0aWYgKCBwYWdlZCApIHtcblx0XHR1cmwgPSB1cmwucmVwbGFjZSggL3BhZ2VcXC8oXFxkKylcXC8vLCAnJyApO1xuXHR9XG5cblx0cmV0dXJuIGNsZWFuVXJsKCB1cmwgKTtcbn1cbiJdfQ==
