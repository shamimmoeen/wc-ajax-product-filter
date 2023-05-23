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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJ1dGlscy5qcyJdLCJuYW1lcyI6WyJ3Y2FwZl9wYXJhbXMiLCIkIiwid2luZG93IiwiX2RlbGF5IiwicGFyc2VJbnQiLCJmaWx0ZXJfaW5wdXRfZGVsYXkiLCJkZWxheSIsImlzUHJvIiwid2NhcGZfcHJvIiwiJGJvZHkiLCIkZG9jdW1lbnQiLCJkb2N1bWVudCIsImluc3RhbmNlSWRzIiwiZWFjaCIsImlkIiwiZGF0YSIsInB1c2giLCJ0aXBweUluc3RhbmNlcyIsIldDQVBGIiwiaGFuZGxlRmlsdGVyQWNjb3JkaW9uIiwidG9nZ2xlQWNjb3JkaW9uIiwiJGVsIiwicHJlc3NlZCIsImF0dHIiLCIkZmlsdGVySW5uZXIiLCJjbG9zZXN0IiwiY2hpbGRyZW4iLCJlbmFibGVfYW5pbWF0aW9uX2Zvcl9maWx0ZXJfYWNjb3JkaW9uIiwic2xpZGVUb2dnbGUiLCJmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsInRvZ2dsZSIsIm9uIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsIiR0cmlnZ2VyIiwiZmluZCIsImhhbmRsZUhpZXJhcmNoeVRvZ2dsZSIsIiRjaGlsZCIsImVuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24iLCJoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsImtleSIsInByZXZlbnREZWZhdWx0IiwiaGFuZGxlU29mdExpbWl0IiwidG9nZ2xlRmlsdGVyT3B0aW9ucyIsIiRsaXN0V3JhcHBlciIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJoYW5kbGVTZWFyY2hGaWx0ZXJPcHRpb25zIiwiJHRoYXQiLCIkaW5uZXIiLCIkZmlsdGVyIiwic29mdExpbWl0RW5hYmxlZCIsImhhc0NsYXNzIiwic29mdExpbWl0VG9nZ2xlIiwibm9SZXN1bHRzIiwidmlzaWJsZU9wdGlvbnMiLCJrZXl3b3JkIiwidmFsIiwibGVuZ3RoIiwiaW5kZXgiLCIkZmlsdGVySXRlbSIsInJlbW92ZUF0dHIiLCJ0ZXh0IiwiaGlkZSIsImxhYmVsIiwidG9TdHJpbmciLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwic2hvdyIsInVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQiLCIkcmVzcG9uc2UiLCIkY29udGFpbmVyIiwic2hvcF9sb29wX2NvbnRhaW5lciIsInNlbGVjdG9yIiwibmV3Q291bnQiLCJodG1sIiwiaGFzIiwic2Nyb2xsVG8iLCJzY3JvbGxfd2luZG93Iiwic2Nyb2xsRm9yIiwic2Nyb2xsX3dpbmRvd19mb3IiLCJpc01vYmlsZSIsImlzX21vYmlsZSIsInByb2NlZWQiLCJhZGp1c3RpbmdPZmZzZXQiLCJvZmZzZXQiLCJzY3JvbGxfdG9fdG9wX29mZnNldCIsImNvbnRhaW5lciIsIm5vdF9mb3VuZF9jb250YWluZXIiLCJzY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50IiwidG9wIiwic3RvcCIsImFuaW1hdGUiLCJzY3JvbGxUb3AiLCJzY3JvbGxfdG9fdG9wX3NwZWVkIiwic2Nyb2xsX3RvX3RvcF9lYXNpbmciLCJiZWZvcmVGZXRjaGluZ1Byb2R1Y3RzIiwidHJpZ2dlcmVkQnkiLCJzY3JvbGxfd2luZG93X3doZW4iLCJ0cmlnZ2VyIiwiZGVzdHJveVRpcHB5SW5zdGFuY2VzIiwidXNlX3RpcHB5anMiLCJmb3JFYWNoIiwiaW5zdGFuY2UiLCJkZXN0cm95IiwiYmVmb3JlVXBkYXRpbmdQcm9kdWN0cyIsImFmdGVyVXBkYXRpbmdQcm9kdWN0cyIsImluaXQiLCJjdXN0b21fc2NyaXB0cyIsImV2YWwiLCJmaWx0ZXJQcm9kdWN0cyIsImFqYXgiLCJ1cmwiLCJsb2NhdGlvbiIsImhyZWYiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJ1cGRhdGVfZG9jdW1lbnRfdGl0bGUiLCJ0aXRsZSIsImZpbHRlciIsImluc3RhbmNlSWQiLCIkaW5zdGFuY2UiLCJfaW5zdGFuY2UiLCJwcmVzZXJ2ZV9oaWVyYXJjaHlfYWNjb3JkaW9uX3N0YXRlIiwidG9nZ2xlU2VsZWN0b3IiLCJwcmVzZXJ2ZV9zb2Z0X2xpbWl0X3N0YXRlIiwiX2h0bWwiLCIkc2hvcExvb3BDb250YWluZXIiLCIkbm90Rm91bmRDb250YWluZXIiLCJyZXF1ZXN0RmlsdGVyIiwiZGlzYWJsZV9hamF4IiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsIndjYXBmIiwiaGFuZGxlTnVtYmVySW5wdXRGaWx0ZXJzIiwicmFuZ2VOdW1iZXJTZWxlY3RvcnMiLCIkaXRlbSIsIiRyYW5nZU51bWJlciIsImZvcm1hdE51bWJlcnMiLCJyYW5nZU1pblZhbHVlIiwicGFyc2VGbG9hdCIsInJhbmdlTWF4VmFsdWUiLCJvbGRNaW5WYWx1ZSIsIm9sZE1heFZhbHVlIiwiZGVjaW1hbFBsYWNlcyIsInRob3VzYW5kU2VwYXJhdG9yIiwiZGVjaW1hbFNlcGFyYXRvciIsImNsZWFyVGltZW91dCIsImdldFZhbHVlIiwiZmxvYXRWYWx1ZSIsIm51bWJlckZvcm1hdCIsInNldFRpbWVvdXQiLCJyZW1vdmVEYXRhIiwibWluVmFsdWUiLCJtYXhWYWx1ZSIsImlzTmFOIiwicmVwbGFjZSIsImhhbmRsZURhdGVJbnB1dEZpbHRlcnMiLCJpc1JhbmdlIiwiZmlsdGVyVXJsIiwiZnJvbSIsInRvIiwiaGFuZGxlTGlzdEZpbHRlcnMiLCJuYXRpdmVJbnB1dHMiLCJ0b2dnbGVDbGFzcyIsImN1c3RvbVJhZGlvU2VsZWN0b3IiLCJub3QiLCJwcm9wIiwiaGFuZGxlRHJvcGRvd25GaWx0ZXJzIiwiJHNlbGVjdCIsInZhbHVlcyIsImZpbHRlclVSTCIsImNsZWFyRmlsdGVyVVJMIiwiaGFuZGxlUGFnaW5hdGlvbiIsImVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4IiwicGFnaW5hdGlvbl9jb250YWluZXIiLCJfc2VsZWN0b3JzIiwic3BsaXQiLCJzZWxlY3RvcnMiLCJqb2luIiwiaGFuZGxlRGVmYXVsdE9yZGVyYnkiLCJzb3J0aW5nX2NvbnRyb2wiLCJvcmRlciIsIlVSTCIsInNlYXJjaFBhcmFtcyIsInNldCIsImdldE9yZGVyQnlVcmwiLCJoYW5kbGVDbGVhckZpbHRlciIsImhhbmRsZUZpbHRlclRvb2x0aXAiLCJ0aXBweSIsInBsYWNlbWVudCIsImNvbnRlbnQiLCJyZWZlcmVuY2UiLCJnZXRBdHRyaWJ1dGUiLCJhbGxvd0hUTUwiLCJpbml0Q29tYm9ib3giLCJqUXVlcnkiLCJjaG9zZW5XQ0FQRiIsInRlbXBsYXRlUmVzdWx0IiwidGVtcGxhdGVTZWxlY3Rpb24iLCJjb3VudCIsImRlZmF1bHRzIiwiaW5oZXJpdF9zZWxlY3RfY2xhc3NlcyIsImluaGVyaXRfb3B0aW9uX2NsYXNzZXMiLCJub19yZXN1bHRzX3RleHQiLCJjb21ib2JveF9ub19yZXN1bHRzX3RleHQiLCJvcHRpb25zX25vbmVfdGV4dCIsImNvbWJvYm94X29wdGlvbnNfbm9uZV90ZXh0Iiwic2VhcmNoX2NvbnRhaW5zIiwic2VhcmNoX2luX3ZhbHVlcyIsImlzX3J0bCIsIiR0aGlzIiwib3B0aW9ucyIsImNvbWJvYm94X2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucyIsImF0dGFjaF9jb21ib2JveF9vbl9zb3J0aW5nIiwiZGlzYWJsZVNlYXJjaCIsInNlYXJjaF9ib3hfaW5fZGVmYXVsdF9vcmRlcmJ5IiwiaW5pdFJhbmdlU2xpZGVyIiwibm9VaVNsaWRlciIsIiRzbGlkZXIiLCJzbGlkZXJJZCIsImRpc3BsYXlWYWx1ZXNBcyIsInN0ZXAiLCIkbWluVmFsdWUiLCIkbWF4VmFsdWUiLCJzbGlkZXIiLCJnZXRFbGVtZW50QnlJZCIsImNyZWF0ZSIsInN0YXJ0IiwiY29ubmVjdCIsImNzc1ByZWZpeCIsInJhbmdlIiwiZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciIsIl9taW5WYWx1ZSIsIl9tYXhWYWx1ZSIsIiRpbnB1dCIsImdldCIsImluaXREYXRlcGlja2VyIiwiZGF0ZXBpY2tlciIsIiR3Y2FwZkRhdGVGaWx0ZXIiLCJmb3JtYXQiLCJ5ZWFyRHJvcGRvd24iLCJtb250aERyb3Bkb3duIiwiJGZyb20iLCIkdG8iLCJkYXRlRm9ybWF0IiwiY2hhbmdlWWVhciIsImNoYW5nZU1vbnRoIiwiaW5pdEZpbHRlck9wdGlvblRvb2x0aXAiLCJ0b29sdGlwUG9zaXRpb25zIiwidG9vbHRpcFBvc2l0aW9uIiwiaWRlbnRpZmllciIsImluc3RhbmNlcyIsImNvbmNhdCIsImluaXRQb3BTdGF0ZSIsInJlbG9hZF9vbl9iYWNrIiwiZm91bmRfd2NhcGYiLCJyZXBsYWNlU3RhdGUiLCJhZGRFdmVudExpc3RlbmVyIiwic3RhdGUiLCJoYXNPd25Qcm9wZXJ0eSIsIm51bWJlciIsImRlY2ltYWxzIiwiZGVjX3BvaW50IiwidGhvdXNhbmRzX3NlcCIsIm4iLCJpc0Zpbml0ZSIsInByZWMiLCJNYXRoIiwiYWJzIiwic2VwIiwiZGVjIiwicyIsInRvRml4ZWRGaXgiLCJrIiwicG93Iiwicm91bmQiLCJBcnJheSIsImNsZWFuVXJsIiwicGFnZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLFlBQVksR0FBR0EsWUFBWSxJQUFJO0FBQ3BDLFlBQVUsRUFEMEI7QUFFcEMsd0JBQXNCLEVBRmM7QUFHcEMsdUNBQXFDLEVBSEQ7QUFJcEMsOEJBQTRCLEVBSlE7QUFLcEMsZ0NBQThCLEVBTE07QUFNcEMsbUNBQWlDLEVBTkc7QUFPcEMsd0NBQXNDLEVBUEY7QUFRcEMsK0JBQTZCLEVBUk87QUFTcEMsMkNBQXlDLEVBVEw7QUFVcEMsc0NBQW9DLEVBVkE7QUFXcEMsdUNBQXFDLEVBWEQ7QUFZcEMsOENBQTRDLEVBWlI7QUFhcEMseUNBQXVDLEVBYkg7QUFjcEMsMENBQXdDLEVBZEo7QUFlcEMseUJBQXVCLEVBZmE7QUFnQnBDLDBCQUF3QixFQWhCWTtBQWlCcEMsZUFBYSxFQWpCdUI7QUFrQnBDLG9CQUFrQixFQWxCa0I7QUFtQnBDLGlCQUFlLEVBbkJxQjtBQW9CcEMsZUFBYSxFQXBCdUI7QUFxQnBD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Q0FBd0IxRSxHQUF4QixFQUE4QjtBQUM3QixNQUFNdUssS0FBSyxHQUFHclIsUUFBUSxDQUFFOEcsR0FBRyxDQUFDNEMsT0FBSixDQUFhLGtCQUFiLEVBQWlDLElBQWpDLENBQUYsQ0FBdEI7O0FBRUEsTUFBSzJILEtBQUwsRUFBYTtBQUNadkssSUFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUM0QyxPQUFKLENBQWEsZUFBYixFQUE4QixFQUE5QixDQUFOO0FBQ0E7O0FBRUQsU0FBTzBILFFBQVEsQ0FBRXRLLEdBQUYsQ0FBZjtBQUNBIiwiZmlsZSI6IndjLWFqYXgtcHJvZHVjdC1maWx0ZXItcHVibGljLXNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSBtYWluIGpzIGZpbGUuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvcHVibGljL3NyYy9qc1xuICogQGF1dGhvciAgICAgd3B0b29scy5pb1xuICovXG5cbmNvbnN0IHdjYXBmX3BhcmFtcyA9IHdjYXBmX3BhcmFtcyB8fCB7XG5cdCdpc19ydGwnOiAnJyxcblx0J2ZpbHRlcl9pbnB1dF9kZWxheSc6ICcnLFxuXHQnY29tYm9ib3hfZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJzogJycsXG5cdCdjb21ib2JveF9ub19yZXN1bHRzX3RleHQnOiAnJyxcblx0J2NvbWJvYm94X29wdGlvbnNfbm9uZV90ZXh0JzogJycsXG5cdCdzZWFyY2hfYm94X2luX2RlZmF1bHRfb3JkZXJieSc6ICcnLFxuXHQncHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSc6ICcnLFxuXHQncHJlc2VydmVfc29mdF9saW1pdF9zdGF0ZSc6ICcnLFxuXHQnZW5hYmxlX2FuaW1hdGlvbl9mb3JfZmlsdGVyX2FjY29yZGlvbic6ICcnLFxuXHQnZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQnOiAnJyxcblx0J2ZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyc6ICcnLFxuXHQnZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbic6ICcnLFxuXHQnaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQnOiAnJyxcblx0J2hpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyc6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9zcGVlZCc6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9lYXNpbmcnOiAnJyxcblx0J2lzX21vYmlsZSc6ICcnLFxuXHQncmVsb2FkX29uX2JhY2snOiAnJyxcblx0J2ZvdW5kX3djYXBmJzogJycsXG5cdCd3Y2FwZl9wcm8nOiAnJyxcblx0J3VwZGF0ZV9kb2N1bWVudF90aXRsZSc6ICcnLFxuXHQndXNlX3RpcHB5anMnOiAnJyxcblx0J3Nob3BfbG9vcF9jb250YWluZXInOiAnJyxcblx0J25vdF9mb3VuZF9jb250YWluZXInOiAnJyxcblx0J3BhZ2luYXRpb25fY29udGFpbmVyJzogJycsXG5cdCdkaXNhYmxlX2FqYXgnOiAnJyxcblx0J2VuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4JzogJycsXG5cdCdzb3J0aW5nX2NvbnRyb2wnOiAnJyxcblx0J2F0dGFjaF9jb21ib2JveF9vbl9zb3J0aW5nJzogJycsXG5cdCdsb2FkaW5nX2FuaW1hdGlvbic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvdyc6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd19mb3InOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfd2hlbic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudCc6ICcnLFxuXHQnc2Nyb2xsX29uJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX29mZnNldCc6ICcnLFxuXHQnZGlzYWJsZV9zY3JvbGxfYW5pbWF0aW9uJzogJycsXG5cdCdtb3JlX3NlbGVjdG9ycyc6ICcnLFxuXHQnY3VzdG9tX3NjcmlwdHMnOiAnJyxcbn07XG5cbiggZnVuY3Rpb24oICQsIHdpbmRvdyApIHtcblxuXHRjb25zdCBfZGVsYXkgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLmZpbHRlcl9pbnB1dF9kZWxheSApO1xuXHRjb25zdCBkZWxheSAgPSBfZGVsYXkgPj0gMCA/IF9kZWxheSA6IDMwMDtcblxuXHRjb25zdCBpc1BybyA9IHdjYXBmX3BhcmFtcy53Y2FwZl9wcm87XG5cblx0Y29uc3QgJGJvZHkgICAgID0gJCggJ2JvZHknICk7XG5cdGNvbnN0ICRkb2N1bWVudCA9ICQoIGRvY3VtZW50ICk7XG5cblx0Y29uc3QgaW5zdGFuY2VJZHMgPSBbXTtcblxuXHQkKCAnLndjYXBmLWZpbHRlcicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCBpZCA9ICQoIHRoaXMgKS5kYXRhKCAnaWQnICk7XG5cblx0XHRpZiAoICEgaWQgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aW5zdGFuY2VJZHMucHVzaCggaWQgKTtcblx0fSApO1xuXG5cdHdpbmRvdy50aXBweUluc3RhbmNlcyA9IFtdO1xuXG5cdHdpbmRvdy5XQ0FQRiA9IHdpbmRvdy5XQ0FQRiB8fCB7fTtcblxuXHR3aW5kb3cuV0NBUEYgPSB7XG5cdFx0aGFuZGxlRmlsdGVyQWNjb3JkaW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHRvZ2dsZUFjY29yZGlvbiA9ICggJGVsICkgPT4ge1xuXHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGFjY29yZGlvbiBpcyBvcGVuZWRcblx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1leHBhbmRlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdC8vIENoYW5nZSBhcmlhLWV4cGFuZGVkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuXHRcdFx0XHQkZWwuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAhIHByZXNzZWQgKTtcblxuXHRcdFx0XHRjb25zdCAkZmlsdGVySW5uZXIgPSAkZWwuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXInICkuY2hpbGRyZW4oICcud2NhcGYtZmlsdGVyLWlubmVyJyApO1xuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9hbmltYXRpb25fZm9yX2ZpbHRlcl9hY2NvcmRpb24gKSB7XG5cdFx0XHRcdFx0JGZpbHRlcklubmVyLnNsaWRlVG9nZ2xlKFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkLFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZ1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JGZpbHRlcklubmVyLnRvZ2dsZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHQkYm9keS5vbiggJ2NsaWNrJywgJy53Y2FwZi1maWx0ZXItYWNjb3JkaW9uLXRyaWdnZXInLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQkYm9keS5vbiggJ2NsaWNrJywgJy53Y2FwZi1maWx0ZXItdGl0bGUuaGFzLWFjY29yZGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkdHJpZ2dlciA9ICQoIHRoaXMgKS5maW5kKCAnLndjYXBmLWZpbHRlci1hY2NvcmRpb24tdHJpZ2dlcicgKTtcblxuXHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICR0cmlnZ2VyICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVIaWVyYXJjaHlUb2dnbGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgdG9nZ2xlQWNjb3JkaW9uID0gKCAkZWwgKSA9PiB7XG5cdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYnV0dG9uIGlzIHByZXNzZWRcblx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0Ly8gQ2hhbmdlIGFyaWEtcHJlc3NlZCB0byB0aGUgb3Bwb3NpdGUgc3RhdGVcblx0XHRcdFx0JGVsLmF0dHIoICdhcmlhLXByZXNzZWQnLCAhIHByZXNzZWQgKTtcblxuXHRcdFx0XHRjb25zdCAkY2hpbGQgPSAkZWwuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICk7XG5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbiApIHtcblx0XHRcdFx0XHQkY2hpbGQuc2xpZGVUb2dnbGUoXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQsXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkY2hpbGQudG9nZ2xlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdCRib2R5XG5cdFx0XHRcdC5vbiggJ2NsaWNrJywgJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0XHRcdH0gKVxuXHRcdFx0XHQub24oICdrZXlkb3duJywgJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdGlmICggZS5rZXkgPT09ICcgJyB8fCBlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJ1NwYWNlYmFyJyApIHtcblx0XHRcdFx0XHRcdC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgYWN0aW9uIHRvIHN0b3Agc2Nyb2xsaW5nIHdoZW4gc3BhY2UgaXMgcHJlc3NlZFxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlU29mdExpbWl0OiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHRvZ2dsZUZpbHRlck9wdGlvbnMgPSAoICRlbCApID0+IHtcblx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBidXR0b24gaXMgcHJlc3NlZFxuXHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLXByZXNzZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHQvLyBDaGFuZ2UgYXJpYS1wcmVzc2VkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuXHRcdFx0XHQkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICEgcHJlc3NlZCApO1xuXG5cdFx0XHRcdGNvbnN0ICRsaXN0V3JhcHBlciA9ICRlbC5jbG9zZXN0KCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKTtcblxuXHRcdFx0XHRpZiAoIHByZXNzZWQgKSB7XG5cdFx0XHRcdFx0JGxpc3RXcmFwcGVyLnJlbW92ZUNsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkbGlzdFdyYXBwZXIuYWRkQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHQkYm9keVxuXHRcdFx0XHQub24oICdjbGljaycsICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dG9nZ2xlRmlsdGVyT3B0aW9ucyggJCggdGhpcyApICk7XG5cdFx0XHRcdH0gKVxuXHRcdFx0XHQub24oICdrZXlkb3duJywgJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRpZiAoIGUua2V5ID09PSAnICcgfHwgZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICdTcGFjZWJhcicgKSB7XG5cdFx0XHRcdFx0XHQvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvbiB0byBzdG9wIHNjcm9sbGluZyB3aGVuIHNwYWNlIGlzIHByZXNzZWRcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdFx0dG9nZ2xlRmlsdGVyT3B0aW9ucyggJCggdGhpcyApICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVTZWFyY2hGaWx0ZXJPcHRpb25zOiBmdW5jdGlvbigpIHtcblx0XHRcdCRib2R5Lm9uKCAnaW5wdXQnLCAnLndjYXBmLXNlYXJjaC1ib3ggaW5wdXRbdHlwZT1cInRleHRcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRoYXQgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgJGlubmVyICA9ICR0aGF0LmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyLWlubmVyJyApO1xuXHRcdFx0XHRjb25zdCAkZmlsdGVyID0gJGlubmVyLmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyJyApO1xuXG5cdFx0XHRcdGNvbnN0IHNvZnRMaW1pdEVuYWJsZWQgPSAkZmlsdGVyLmhhc0NsYXNzKCAnaGFzLXNvZnQtbGltaXQnICk7XG5cdFx0XHRcdGNvbnN0IHNvZnRMaW1pdFRvZ2dsZSAgPSAkZmlsdGVyLmZpbmQoICcud2NhcGYtc29mdC1saW1pdC13cmFwcGVyJyApO1xuXHRcdFx0XHRjb25zdCBub1Jlc3VsdHMgICAgICAgID0gJGZpbHRlci5maW5kKCAnLndjYXBmLW5vLXJlc3VsdHMtdGV4dCcgKTtcblx0XHRcdFx0Y29uc3QgdmlzaWJsZU9wdGlvbnMgICA9IHBhcnNlSW50KCAkZmlsdGVyLmF0dHIoICdkYXRhLXZpc2libGUtb3B0aW9ucycgKSApO1xuXG5cdFx0XHRcdGNvbnN0IGtleXdvcmQgPSAkdGhhdC52YWwoKTtcblxuXHRcdFx0XHRpZiAoICEga2V5d29yZC5sZW5ndGggKSB7XG5cdFx0XHRcdFx0bGV0IGluZGV4ID0gMDtcblx0XHRcdFx0XHQkZmlsdGVyLnJlbW92ZUNsYXNzKCAnc2VhcmNoLWFjdGl2ZScgKTtcblxuXHRcdFx0XHRcdCQuZWFjaCggJGlubmVyLmZpbmQoICcud2NhcGYtZmlsdGVyLW9wdGlvbnMgPiBsaScgKSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRpbmRleCsrO1xuXG5cdFx0XHRcdFx0XHRjb25zdCAkZmlsdGVySXRlbSA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLnJlbW92ZUNsYXNzKCAna2V5d29yZC1tYXRjaGVkJyApO1xuXG5cdFx0XHRcdFx0XHRpZiAoIHNvZnRMaW1pdEVuYWJsZWQgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggaW5kZXggPiB2aXNpYmxlT3B0aW9ucyApIHtcblx0XHRcdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5hZGRDbGFzcyggJ3djYXBmLWZpbHRlci1vcHRpb24taGlkZGVuJyApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLnJlbW92ZUNsYXNzKCAnd2NhcGYtZmlsdGVyLW9wdGlvbi1oaWRkZW4nICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0XHRpZiAoIHNvZnRMaW1pdEVuYWJsZWQgKSB7XG5cdFx0XHRcdFx0XHRzb2Z0TGltaXRUb2dnbGUucmVtb3ZlQXR0ciggJ3N0eWxlJyApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdG5vUmVzdWx0cy5jaGlsZHJlbiggJ3NwYW4nICkudGV4dCggJycgKTtcblx0XHRcdFx0XHRub1Jlc3VsdHMuaGlkZSgpO1xuXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IGluZGV4ID0gMDtcblx0XHRcdFx0JGZpbHRlci5hZGRDbGFzcyggJ3NlYXJjaC1hY3RpdmUnICk7XG5cblx0XHRcdFx0JC5lYWNoKCAkaW5uZXIuZmluZCggJy53Y2FwZi1maWx0ZXItb3B0aW9ucyA+IGxpJyApLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCAkZmlsdGVySXRlbSA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRjb25zdCBsYWJlbCAgICAgICA9ICRmaWx0ZXJJdGVtLmZpbmQoICcud2NhcGYtZmlsdGVyLWl0ZW0tbGFiZWwnICkuZGF0YSggJ2xhYmVsJyApO1xuXG5cdFx0XHRcdFx0aWYgKCBsYWJlbC50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoIGtleXdvcmQudG9Mb3dlckNhc2UoKSApICkge1xuXHRcdFx0XHRcdFx0aW5kZXgrKztcblxuXHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0uYWRkQ2xhc3MoICdrZXl3b3JkLW1hdGNoZWQnICk7XG5cblx0XHRcdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCBpbmRleCA+IHZpc2libGVPcHRpb25zICkge1xuXHRcdFx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLmFkZENsYXNzKCAnd2NhcGYtZmlsdGVyLW9wdGlvbi1oaWRkZW4nICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5yZW1vdmVDbGFzcyggJ2tleXdvcmQtbWF0Y2hlZCcgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRpZiAoIHNvZnRMaW1pdEVuYWJsZWQgKSB7XG5cdFx0XHRcdFx0aWYgKCBpbmRleCA8PSB2aXNpYmxlT3B0aW9ucyApIHtcblx0XHRcdFx0XHRcdHNvZnRMaW1pdFRvZ2dsZS5oaWRlKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHNvZnRMaW1pdFRvZ2dsZS5zaG93KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCAwID09PSBpbmRleCApIHtcblx0XHRcdFx0XHRub1Jlc3VsdHMuY2hpbGRyZW4oICdzcGFuJyApLnRleHQoIGtleXdvcmQgKTtcblx0XHRcdFx0XHRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5jaGlsZHJlbiggJ3NwYW4nICkudGV4dCggJycgKTtcblx0XHRcdFx0XHRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHR1cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0OiBmdW5jdGlvbiggJHJlc3BvbnNlICkge1xuXHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRjb25zdCBzZWxlY3RvciAgID0gJy53b29jb21tZXJjZS1yZXN1bHQtY291bnQnO1xuXHRcdFx0Y29uc3QgbmV3Q291bnQgICA9ICRyZXNwb25zZS5maW5kKCBzZWxlY3RvciApLmh0bWwoKTtcblxuXHRcdFx0JGJvZHkuZmluZCggc2VsZWN0b3IgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGVsID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdGlmICggISAkY29udGFpbmVyLmhhcyggJGVsICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdCRlbC5odG1sKCBuZXdDb3VudCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRzY3JvbGxUbzogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICdub25lJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc2Nyb2xsRm9yID0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfZm9yO1xuXHRcdFx0Y29uc3QgaXNNb2JpbGUgID0gd2NhcGZfcGFyYW1zLmlzX21vYmlsZTtcblx0XHRcdGxldCBwcm9jZWVkICAgICA9IGZhbHNlO1xuXG5cdFx0XHRpZiAoICdtb2JpbGUnID09PSBzY3JvbGxGb3IgJiYgaXNNb2JpbGUgKSB7XG5cdFx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmICggJ2Rlc2t0b3AnID09PSBzY3JvbGxGb3IgJiYgISBpc01vYmlsZSApIHtcblx0XHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0XHR9IGVsc2UgaWYgKCAnYm90aCcgPT09IHNjcm9sbEZvciApIHtcblx0XHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISBwcm9jZWVkICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCBhZGp1c3RpbmdPZmZzZXQgPSAwLCBvZmZzZXQgPSAwO1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX29mZnNldCApIHtcblx0XHRcdFx0YWRqdXN0aW5nT2Zmc2V0ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX29mZnNldCApO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgY29udGFpbmVyO1xuXG5cdFx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lcjtcblx0XHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lcjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAnY3VzdG9tJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRcdGNvbnRhaW5lciA9IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50O1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCAkY29udGFpbmVyID0gJCggY29udGFpbmVyICk7XG5cblx0XHRcdGlmICggJGNvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdG9mZnNldCA9ICRjb250YWluZXIub2Zmc2V0KCkudG9wIC0gYWRqdXN0aW5nT2Zmc2V0O1xuXG5cdFx0XHRcdGlmICggb2Zmc2V0IDwgMCApIHtcblx0XHRcdFx0XHRvZmZzZXQgPSAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JCggJ2h0bWwsIGJvZHknICkuc3RvcCgpLmFuaW1hdGUoXG5cdFx0XHRcdFx0eyBzY3JvbGxUb3A6IG9mZnNldCB9LFxuXHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX3NwZWVkLFxuXHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX2Vhc2luZ1xuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Ly8gVGhpbmdzIGFyZSBkb25lIGJlZm9yZSBmZXRjaGluZyB0aGUgcHJvZHVjdHMgbGlrZSBzaG93aW5nIHRoZSBsb2FkaW5nIGluZGljYXRvci5cblx0XHRiZWZvcmVGZXRjaGluZ1Byb2R1Y3RzOiBmdW5jdGlvbiggdHJpZ2dlcmVkQnkgKSB7XG5cdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLWxvYWRlcicgKS5hZGRDbGFzcyggJ2lzLWFjdGl2ZScgKTtcblxuXHRcdFx0aWYgKCAhIGlzUHJvICYmICdpbW1lZGlhdGVseScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X3doZW4gKSB7XG5cdFx0XHRcdFdDQVBGLnNjcm9sbFRvKCk7XG5cdFx0XHR9XG5cblx0XHRcdCRkb2N1bWVudC50cmlnZ2VyKCAnd2NhcGZfYmVmb3JlX2ZldGNoaW5nX3Byb2R1Y3RzJywgWyB0cmlnZ2VyZWRCeSBdICk7XG5cdFx0fSxcblx0XHRkZXN0cm95VGlwcHlJbnN0YW5jZXM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMudXNlX3RpcHB5anMgKSB7XG5cdFx0XHRcdC8vIEBzb3VyY2UgaHR0cHM6Ly9naXRodWIuY29tL2F0b21pa3MvdGlwcHlqcy9pc3N1ZXMvNDczXG5cdFx0XHRcdHRpcHB5SW5zdGFuY2VzLmZvckVhY2goIGluc3RhbmNlID0+IHtcblx0XHRcdFx0XHRpbnN0YW5jZS5kZXN0cm95KCk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdFx0dGlwcHlJbnN0YW5jZXMubGVuZ3RoID0gMDsgLy8gY2xlYXIgaXRcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8vIFRoaW5ncyBhcmUgZG9uZSBiZWZvcmUgdXBkYXRpbmcgdGhlIHByb2R1Y3RzIGxpa2UgaGlkaW5nIHRoZSBsb2FkaW5nIGluZGljYXRvci5cblx0XHRiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzOiBmdW5jdGlvbiggJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSApIHtcblx0XHRcdCRib2R5LmZpbmQoICcud2NhcGYtbG9hZGVyJyApLnJlbW92ZUNsYXNzKCAnaXMtYWN0aXZlJyApO1xuXG5cdFx0XHQvLyBNYXliZSBnb29kIGZvciBwZXJmb3JtYW5jZS5cblx0XHRcdFdDQVBGLmRlc3Ryb3lUaXBweUluc3RhbmNlcygpO1xuXG5cdFx0XHQkZG9jdW1lbnQudHJpZ2dlciggJ3djYXBmX2JlZm9yZV91cGRhdGluZ19wcm9kdWN0cycsIFsgJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSBdICk7XG5cdFx0fSxcblx0XHRhZnRlclVwZGF0aW5nUHJvZHVjdHM6IGZ1bmN0aW9uKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICkge1xuXHRcdFx0V0NBUEYudXBkYXRlUHJvZHVjdHNDb3VudFJlc3VsdCggJHJlc3BvbnNlICk7XG5cblx0XHRcdC8vIFJlaW5pdGlhbGl6ZSB3Y2FwZi5cblx0XHRcdFdDQVBGLmluaXQoKTtcblxuXHRcdFx0aWYgKCAhIGlzUHJvICYmICdhZnRlcicgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X3doZW4gKSB7XG5cdFx0XHRcdFdDQVBGLnNjcm9sbFRvKCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRyaWdnZXIgZXZlbnRzLlxuXHRcdFx0JCggZG9jdW1lbnQgKS50cmlnZ2VyKCAncmVhZHknICk7XG5cdFx0XHQkKCB3aW5kb3cgKS50cmlnZ2VyKCAnc2Nyb2xsJyApO1xuXHRcdFx0JCggd2luZG93ICkudHJpZ2dlciggJ3Jlc2l6ZScgKTtcblxuXHRcdFx0Ly8gQTMgTGF6eSBMb2FkIHN1cHBvcnQuXG5cdFx0XHQkKCB3aW5kb3cgKS50cmlnZ2VyKCAnbGF6eXNob3cnICk7XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmN1c3RvbV9zY3JpcHRzICkge1xuXHRcdFx0XHRldmFsKCB3Y2FwZl9wYXJhbXMuY3VzdG9tX3NjcmlwdHMgKTtcblx0XHRcdH1cblxuXHRcdFx0JGRvY3VtZW50LnRyaWdnZXIoICd3Y2FwZl9hZnRlcl91cGRhdGluZ19wcm9kdWN0cycsIFsgJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSBdICk7XG5cdFx0fSxcblx0XHRmaWx0ZXJQcm9kdWN0czogZnVuY3Rpb24oIHRyaWdnZXJlZEJ5ID0gJ2ZpbHRlcicgKSB7XG5cdFx0XHRXQ0FQRi5iZWZvcmVGZXRjaGluZ1Byb2R1Y3RzKCB0cmlnZ2VyZWRCeSApO1xuXG5cdFx0XHQkLmFqYXgoIHtcblx0XHRcdFx0dXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0XHRcdGNvbnN0ICRyZXNwb25zZSA9ICQoIHJlc3BvbnNlICk7XG5cblx0XHRcdFx0XHRXQ0FQRi5iZWZvcmVVcGRhdGluZ1Byb2R1Y3RzKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICk7XG5cblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBVcGRhdGUgZG9jdW1lbnQgdGl0bGUuXG5cdFx0XHRcdFx0ICpcblx0XHRcdFx0XHQgKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS83NTk5NTYyXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMudXBkYXRlX2RvY3VtZW50X3RpdGxlICkge1xuXHRcdFx0XHRcdFx0ZG9jdW1lbnQudGl0bGUgPSAkcmVzcG9uc2UuZmlsdGVyKCAndGl0bGUnICkudGV4dCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgaW5zdGFuY2VzLlxuXHRcdFx0XHRcdGZvciAoIGNvbnN0IGlkIG9mIGluc3RhbmNlSWRzICkge1xuXHRcdFx0XHRcdFx0Y29uc3QgaW5zdGFuY2VJZCA9ICdbZGF0YS1pZD1cIicgKyBpZCArICdcIl0nO1xuXHRcdFx0XHRcdFx0Y29uc3QgJGluc3RhbmNlICA9ICQoIGluc3RhbmNlSWQgKTtcblx0XHRcdFx0XHRcdGNvbnN0ICRpbm5lciAgICAgPSAkaW5zdGFuY2UuZmluZCggJy53Y2FwZi1maWx0ZXItaW5uZXInICk7XG5cdFx0XHRcdFx0XHRjb25zdCBfaW5zdGFuY2UgID0gJHJlc3BvbnNlLmZpbmQoIGluc3RhbmNlSWQgKTtcblxuXHRcdFx0XHRcdFx0Ly8gUHJlc2VydmUgaGllcmFyY2h5IGFjY29yZGlvbiBzdGF0ZS5cblx0XHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJGluc3RhbmNlLmhhc0NsYXNzKCAnaGFzLWhpZXJhcmNoeS1hY2NvcmRpb24nICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JGluc3RhbmNlLmZpbmQoICcud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCAkZWwgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBpZCAgPSAkZWwuZGF0YSggJ2lkJyApO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCB0b2dnbGVTZWxlY3RvciA9IGAud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGVbZGF0YS1pZD1cIiR7IGlkIH1cIl1gO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGFjY29yZGlvbiBpcyBvcGVuZWRcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIHByZXNzZWQgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCB0b2dnbGVTZWxlY3RvciApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAndHJ1ZScgKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICkuc2hvdygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICdmYWxzZScgKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICkuaGlkZSgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBQcmVzZXJ2ZSBzb2Z0IGxpbWl0IHN0YXRlLlxuXHRcdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucHJlc2VydmVfc29mdF9saW1pdF9zdGF0ZSApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkaW5zdGFuY2UuaGFzQ2xhc3MoICdoYXMtc29mdC1saW1pdCcgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCAkbGlzdFdyYXBwZXIgPSAkaW5zdGFuY2UuZmluZCggJy53Y2FwZi1saXN0LXdyYXBwZXInICk7XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAoICRsaXN0V3JhcHBlci5oYXNDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1saXN0LXdyYXBwZXInICkuYWRkQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJyApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAndHJ1ZScgKTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtbGlzdC13cmFwcGVyJyApLnJlbW92ZUNsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLXNvZnQtbGltaXQtdHJpZ2dlcicgKS5hdHRyKCAnYXJpYS1wcmVzc2VkJywgJ2ZhbHNlJyApO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRjb25zdCBfaHRtbCA9IF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLWZpbHRlci1pbm5lcicgKS5odG1sKCk7XG5cblx0XHRcdFx0XHRcdC8vIEZpbmFsbHkgdXBkYXRlIHRoZSBpbnN0YW5jZS5cblx0XHRcdFx0XHRcdCRpbm5lci5odG1sKCBfaHRtbCApO1xuXG5cdFx0XHRcdFx0XHQkaW5zdGFuY2UudHJpZ2dlciggJ3djYXBmLWZpbHRlci11cGRhdGVkJywgWyBfaW5zdGFuY2UgXSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgYWN0aXZlIGZpbHRlcnMgYW5kIHJlc2V0IGZpbHRlcnMuXG5cdFx0XHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1hY3RpdmUtZmlsdGVycywgLndjYXBmLXJlc2V0LWZpbHRlcnMnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRjb25zdCAkdGhhdCAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdFx0Y29uc3QgaW5zdGFuY2VJZCA9ICdbZGF0YS1pZD1cIicgKyAkdGhhdC5kYXRhKCAnaWQnICkgKyAnXCJdJztcblxuXHRcdFx0XHRcdFx0JHRoYXQuaHRtbCggJHJlc3BvbnNlLmZpbmQoIGluc3RhbmNlSWQgKS5odG1sKCkgKTtcblx0XHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0XHQvLyBSZXBsYWNlIG9sZCBzaG9wIGxvb3Agd2l0aCBuZXcgb25lLlxuXHRcdFx0XHRcdGNvbnN0ICRzaG9wTG9vcENvbnRhaW5lciA9ICRyZXNwb25zZS5maW5kKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0XHRcdGNvbnN0ICRub3RGb3VuZENvbnRhaW5lciA9ICRyZXNwb25zZS5maW5kKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApO1xuXG5cdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciA9PT0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0V0NBUEYuYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdHJlcXVlc3RGaWx0ZXI6IGZ1bmN0aW9uKCB1cmwsIHRyaWdnZXJlZEJ5ID0gJ2ZpbHRlcicgKSB7XG5cdFx0XHRpZiAoICEgdXJsICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmRpc2FibGVfYWpheCApIHtcblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmw7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSggeyB3Y2FwZjogdHJ1ZSB9LCAnJywgdXJsICk7XG5cblx0XHRcdFx0V0NBUEYuZmlsdGVyUHJvZHVjdHMoIHRyaWdnZXJlZEJ5ICk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRoYW5kbGVOdW1iZXJJbnB1dEZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgcmFuZ2VOdW1iZXJTZWxlY3RvcnMgPSAnLndjYXBmLXJhbmdlLW51bWJlciAubWluLXZhbHVlLCAud2NhcGYtcmFuZ2UtbnVtYmVyIC5tYXgtdmFsdWUnO1xuXG5cdFx0XHQkYm9keS5vbiggJ2lucHV0JywgcmFuZ2VOdW1iZXJTZWxlY3RvcnMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRjb25zdCAkcmFuZ2VOdW1iZXIgICAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtcmFuZ2UtbnVtYmVyJyApO1xuXHRcdFx0XHRjb25zdCBmb3JtYXROdW1iZXJzICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1mb3JtYXQtbnVtYmVycycgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBvbGRNaW5WYWx1ZSAgICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgb2xkTWF4VmFsdWUgICAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWRlY2ltYWwtcGxhY2VzJyApO1xuXHRcdFx0XHRjb25zdCB0aG91c2FuZFNlcGFyYXRvciA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS10aG91c2FuZC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdGNvbnN0IGdldFZhbHVlID0gKCBmbG9hdFZhbHVlICkgPT4ge1xuXHRcdFx0XHRcdGlmICggZm9ybWF0TnVtYmVycyApIHtcblx0XHRcdFx0XHRcdHJldHVybiBudW1iZXJGb3JtYXQoIGZsb2F0VmFsdWUsIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIGZsb2F0VmFsdWU7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0bGV0IG1pblZhbHVlID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCgpICk7XG5cdFx0XHRcdFx0bGV0IG1heFZhbHVlID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCgpICk7XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0XHRcdGlmICggaXNOYU4oIG1pblZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdFx0XHRpZiAoIGlzTmFOKCBtYXhWYWx1ZSApICkge1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gYmVsb3cgdGhlIHJhbmdlTWluVmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA8IHJhbmdlTWluVmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID4gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0XHRcdGlmICggbWF4VmFsdWUgPiByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gZ28gYmVsb3cgdGhlIG1pblZhbHVlLlxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPiBtYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gbWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gSWYgdmFsdWUgaXMgbm90IGNoYW5nZWQgdGhlbiBkb24ndCBwcm9jZWVkLlxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPT09IG9sZE1pblZhbHVlICYmIG1heFZhbHVlID09PSBvbGRNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIG1heFZhbHVlID09PSByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0Ly8gUmVtb3ZlIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICRyYW5nZU51bWJlci5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBBZGQgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0Y29uc3QgdXJsID0gJHJhbmdlTnVtYmVyLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIG1pblZhbHVlICkucmVwbGFjZSggJyUycycsIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZURhdGVJbnB1dEZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCAnLndjYXBmLWRhdGUtaW5wdXQgLmRhdGUtaW5wdXQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGZpbHRlciA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWRhdGUtaW5wdXQnICk7XG5cdFx0XHRcdGNvbnN0IGlzUmFuZ2UgPSAkZmlsdGVyLmRhdGEoICdpcy1yYW5nZScgKTtcblxuXHRcdFx0XHRsZXQgZmlsdGVyVXJsID0gJyc7XG5cblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGZpbHRlci5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRpZiAoIGlzUmFuZ2UgKSB7XG5cdFx0XHRcdFx0Y29uc3QgZnJvbSA9ICRmaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICkudmFsKCk7XG5cdFx0XHRcdFx0Y29uc3QgdG8gICA9ICRmaWx0ZXIuZmluZCggJy5kYXRlLXRvLWlucHV0JyApLnZhbCgpO1xuXG5cdFx0XHRcdFx0aWYgKCBmcm9tICYmIHRvICkge1xuXHRcdFx0XHRcdFx0ZmlsdGVyVXJsID0gJGZpbHRlci5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclMXMnLCBmcm9tICkucmVwbGFjZSggJyUycycsIHRvICk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggISBmcm9tICYmICEgdG8gKSB7XG5cdFx0XHRcdFx0XHRmaWx0ZXJVcmwgPSAkZmlsdGVyLmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zdCBmcm9tID0gJGZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKS52YWwoKTtcblxuXHRcdFx0XHRcdGlmICggZnJvbSApIHtcblx0XHRcdFx0XHRcdGZpbHRlclVybCA9ICRmaWx0ZXIuZGF0YSggJ3VybCcgKS5yZXBsYWNlKCAnJXMnLCBmcm9tICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGZpbHRlclVybCA9ICRmaWx0ZXIuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBmaWx0ZXJVcmwgKSB7XG5cdFx0XHRcdFx0JGZpbHRlci5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCRmaWx0ZXIucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCBmaWx0ZXJVcmwgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZUxpc3RGaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IG5hdGl2ZUlucHV0cyA9ICcubGlzdC10eXBlLW5hdGl2ZSBbdHlwZT1cImNoZWNrYm94XCJdLCcgK1xuXHRcdFx0XHQnLmxpc3QtdHlwZS1uYXRpdmUgW3R5cGU9XCJyYWRpb1wiXSwnICtcblx0XHRcdFx0Jy5saXN0LXR5cGUtY3VzdG9tLWNoZWNrYm94IFt0eXBlPVwiY2hlY2tib3hcIl0nO1xuXG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsIG5hdGl2ZUlucHV0cywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZpbHRlci1pdGVtJyApLnRvZ2dsZUNsYXNzKCAnaXRlbS1hY3RpdmUnICk7XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJCggdGhpcyApLmRhdGEoICd1cmwnICkgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Y29uc3QgY3VzdG9tUmFkaW9TZWxlY3RvciA9ICcubGlzdC10eXBlLWN1c3RvbS1yYWRpbyc7XG5cblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgY3VzdG9tUmFkaW9TZWxlY3RvciArICcgW3R5cGU9XCJjaGVja2JveFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXItaXRlbScgKS50b2dnbGVDbGFzcyggJ2l0ZW0tYWN0aXZlJyApO1xuXG5cdFx0XHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81ODM5OTI0XG5cdFx0XHRcdCQoIHRoaXMgKVxuXHRcdFx0XHRcdC5jbG9zZXN0KCBjdXN0b21SYWRpb1NlbGVjdG9yIClcblx0XHRcdFx0XHQuZmluZCggJy53Y2FwZi1maWx0ZXItaXRlbS5pdGVtLWFjdGl2ZSBbdHlwZT1cImNoZWNrYm94XCJdJyApXG5cdFx0XHRcdFx0Lm5vdCggdGhpcyApXG5cdFx0XHRcdFx0LnByb3AoICdjaGVja2VkJywgZmFsc2UgKVxuXHRcdFx0XHRcdC5jbG9zZXN0KCAnLndjYXBmLWZpbHRlci1pdGVtJyApXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCAnaXRlbS1hY3RpdmUnICk7XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJCggdGhpcyApLmRhdGEoICd1cmwnICkgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZURyb3Bkb3duRmlsdGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsICcud2NhcGYtZHJvcGRvd24td3JhcHBlciBzZWxlY3QnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHNlbGVjdCAgICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IHZhbHVlcyAgICAgICAgID0gJHNlbGVjdC52YWwoKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyVVJMICAgICAgPSAkc2VsZWN0LmRhdGEoICd1cmwnICk7XG5cdFx0XHRcdGNvbnN0IGNsZWFyRmlsdGVyVVJMID0gJHNlbGVjdC5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKTtcblx0XHRcdFx0bGV0IHVybDtcblxuXHRcdFx0XHRpZiAoIHZhbHVlcy5sZW5ndGggKSB7XG5cdFx0XHRcdFx0dXJsID0gZmlsdGVyVVJMLnJlcGxhY2UoICclcycsIHZhbHVlcy50b1N0cmluZygpICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dXJsID0gY2xlYXJGaWx0ZXJVUkw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZVBhZ2luYXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXggJiYgd2NhcGZfcGFyYW1zLnBhZ2luYXRpb25fY29udGFpbmVyICkge1xuXHRcdFx0XHRjb25zdCAkY29udGFpbmVyID0gJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdFx0Y29uc3QgX3NlbGVjdG9ycyA9IHdjYXBmX3BhcmFtcy5wYWdpbmF0aW9uX2NvbnRhaW5lci5zcGxpdCggJywnICk7XG5cdFx0XHRcdGNvbnN0IHNlbGVjdG9ycyAgPSBbXTtcblxuXHRcdFx0XHRfc2VsZWN0b3JzLmZvckVhY2goIHNlbGVjdG9yID0+IHtcblx0XHRcdFx0XHRpZiAoIHNlbGVjdG9yICkge1xuXHRcdFx0XHRcdFx0c2VsZWN0b3JzLnB1c2goIHNlbGVjdG9yICsgJyBhJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGNvbnN0IHNlbGVjdG9yID0gc2VsZWN0b3JzLmpvaW4oICcsJyApO1xuXG5cdFx0XHRcdGlmICggJGNvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0JGNvbnRhaW5lci5vbiggJ2NsaWNrJywgc2VsZWN0b3IsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBocmVmID0gJCggdGhpcyApLmF0dHIoICdocmVmJyApO1xuXG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCBocmVmLCAncGFnaW5hdGUnICk7XG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRoYW5kbGVEZWZhdWx0T3JkZXJieTogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLnNvcnRpbmdfY29udHJvbCApIHtcblx0XHRcdFx0Ly8gU3VibWl0IHRoZSBvcmRlcmJ5IGZvcm0gd2hlbiB2YWx1ZSBpcyBjaGFuZ2VkLlxuXHRcdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsICcud29vY29tbWVyY2Utb3JkZXJpbmcgc2VsZWN0Lm9yZGVyYnknLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKCB0aGlzICkuY2xvc2VzdCggJ2Zvcm0nICkudHJpZ2dlciggJ3N1Ym1pdCcgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUHJldmVudCB0aGUgYXV0byBzdWJtaXNzaW9uIG9mIHRoZSBvcmRlcmJ5IGZvcm0uXG5cdFx0XHQkYm9keS5vbiggJ3N1Ym1pdCcsICcud29vY29tbWVyY2Utb3JkZXJpbmcnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IHZpYSBhamF4IHdoZW4gdGhlIG9yZGVyYnkgdmFsdWUgaXMgY2hhbmdlZC5cblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgJy53b29jb21tZXJjZS1vcmRlcmluZyBzZWxlY3Qub3JkZXJieScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBvcmRlciA9ICQoIHRoaXMgKS52YWwoKTtcblxuXHRcdFx0XHRjb25zdCB1cmwgPSBuZXcgVVJMKCB3aW5kb3cubG9jYXRpb24gKTtcblx0XHRcdFx0dXJsLnNlYXJjaFBhcmFtcy5zZXQoICdvcmRlcmJ5Jywgb3JkZXIgKTtcblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCBnZXRPcmRlckJ5VXJsKCB1cmwuaHJlZiApICk7XG5cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlQ2xlYXJGaWx0ZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtZmlsdGVyLWNsZWFyLWJ0bicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5hdHRyKCAnZGF0YS1jbGVhci1maWx0ZXItdXJsJyApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVGaWx0ZXJUb29sdGlwOiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRSZWZlcmVuY2Vcblx0XHRcdGlmICggJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHRpcHB5ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMudXNlX3RpcHB5anMgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZFJlZmVyZW5jZVxuXHRcdFx0dGlwcHkoICcud2NhcGYtZmlsdGVyLXRvb2x0aXAnLCB7XG5cdFx0XHRcdHBsYWNlbWVudDogJ3RvcCcsXG5cdFx0XHRcdGNvbnRlbnQoIHJlZmVyZW5jZSApIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSggJ2RhdGEtY29udGVudCcgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0YWxsb3dIVE1MOiB0cnVlLFxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aW5pdENvbWJvYm94OiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggISBqUXVlcnkoKS5jaG9zZW5XQ0FQRiApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB0ZW1wbGF0ZVJlc3VsdCA9ICggdGV4dCwgZGF0YSApID0+IHtcblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQnPHNwYW4+JyArIHRleHQgKyAnPC9zcGFuPicsXG5cdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwid2NhcGYtY291bnRcIj4nICsgZGF0YVsgJ2NvdW50TWFya3VwJyBdICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRdLmpvaW4oICcnICk7XG5cdFx0XHR9O1xuXG5cdFx0XHRjb25zdCB0ZW1wbGF0ZVNlbGVjdGlvbiA9ICggdGV4dCwgZGF0YSApID0+IHtcblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJ3Y2FwZi1jb3VudC0nICsgZGF0YS5jb3VudCArICdcIj4nICsgdGV4dCArICc8L3NwYW4+Jyxcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJ3Y2FwZi1jb3VudCB3Y2FwZi1jb3VudC0nICsgZGF0YS5jb3VudCArICdcIj4nICsgZGF0YVsgJ2NvdW50TWFya3VwJyBdICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRdLmpvaW4oICcnICk7XG5cdFx0XHR9O1xuXG5cdFx0XHRjb25zdCBkZWZhdWx0cyA9IHtcblx0XHRcdFx0aW5oZXJpdF9zZWxlY3RfY2xhc3NlczogdHJ1ZSxcblx0XHRcdFx0aW5oZXJpdF9vcHRpb25fY2xhc3NlczogdHJ1ZSxcblx0XHRcdFx0bm9fcmVzdWx0c190ZXh0OiB3Y2FwZl9wYXJhbXMuY29tYm9ib3hfbm9fcmVzdWx0c190ZXh0LFxuXHRcdFx0XHRvcHRpb25zX25vbmVfdGV4dDogd2NhcGZfcGFyYW1zLmNvbWJvYm94X29wdGlvbnNfbm9uZV90ZXh0LFxuXHRcdFx0XHRzZWFyY2hfY29udGFpbnM6IHRydWUsIC8vIE1hdGNoIGZyb20gYW55d2hlcmUgaW4gc3RyaW5nLlxuXHRcdFx0XHRzZWFyY2hfaW5fdmFsdWVzOiB0cnVlLCAvLyBTZWFyY2ggaW4gdmFsdWVzIGFsc28uXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5pc19ydGwgKSB7XG5cdFx0XHRcdGRlZmF1bHRzWyAncnRsJyBdID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1jaG9zZW4nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0aGlzICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7IC4uLmRlZmF1bHRzIH07XG5cblx0XHRcdFx0Ly8gSWYgaGllcmFyY2h5IGVuYWJsZWQgdGhlbiB3ZSBzaG93IHRoZSBzZWxlY3RlZCBvcHRpb25zLlxuXHRcdFx0XHRpZiAoICR0aGlzLmhhc0NsYXNzKCAnaGFzLWhpZXJhcmNoeScgKSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJyBdID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJyBdID0gd2NhcGZfcGFyYW1zLmNvbWJvYm94X2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEVuYWJsZSB0ZW1wbGF0aW5nIHdoZW4gc2hvd2luZyBjb3VudC5cblx0XHRcdFx0aWYgKCAkdGhpcy5oYXNDbGFzcyggJ3dpdGgtY291bnQnICkgKSB7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ3RlbXBsYXRlUmVzdWx0JyBdICAgID0gdGVtcGxhdGVSZXN1bHQ7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ3RlbXBsYXRlU2VsZWN0aW9uJyBdID0gdGVtcGxhdGVTZWxlY3Rpb247XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBEaXNhYmxlIHNlYXJjaCBib3guXG5cdFx0XHRcdGlmICggISAkdGhpcy5kYXRhKCAnZW5hYmxlLXNlYXJjaCcgKSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnZGlzYWJsZV9zZWFyY2gnIF0gPSB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JHRoaXMuY2hvc2VuV0NBUEYoIG9wdGlvbnMgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gQXR0YWNoIGNob3NlbiBmb3IgZGVmYXVsdCBvcmRlcmJ5LlxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuYXR0YWNoX2NvbWJvYm94X29uX3NvcnRpbmcgKSB7XG5cdFx0XHRcdGxldCBkaXNhYmxlU2VhcmNoID0gdHJ1ZTtcblxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zZWFyY2hfYm94X2luX2RlZmF1bHRfb3JkZXJieSApIHtcblx0XHRcdFx0XHRkaXNhYmxlU2VhcmNoID0gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0cyB9O1xuXG5cdFx0XHRcdG9wdGlvbnNbICdkaXNhYmxlX3NlYXJjaCcgXSA9IGRpc2FibGVTZWFyY2g7XG5cblx0XHRcdFx0JGJvZHkuZmluZCggJy53b29jb21tZXJjZS1vcmRlcmluZyBzZWxlY3Qub3JkZXJieScgKS5jaG9zZW5XQ0FQRiggb3B0aW9ucyApO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aW5pdFJhbmdlU2xpZGVyOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCRib2R5LmZpbmQoICcud2NhcGYtcmFuZ2Utc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkaXRlbSAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCAkc2xpZGVyID0gJGl0ZW0uZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKTtcblxuXHRcdFx0XHRjb25zdCBzbGlkZXJJZCAgICAgICAgICA9ICRzbGlkZXIuYXR0ciggJ2lkJyApO1xuXHRcdFx0XHRjb25zdCBkaXNwbGF5VmFsdWVzQXMgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRpc3BsYXktdmFsdWVzLWFzJyApO1xuXHRcdFx0XHRjb25zdCBmb3JtYXROdW1iZXJzICAgICA9ICRpdGVtLmF0dHIoICdkYXRhLWZvcm1hdC1udW1iZXJzJyApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1pblZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBzdGVwICAgICAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXN0ZXAnICkgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFBsYWNlcyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRcdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkaXRlbS5hdHRyKCAnZGF0YS10aG91c2FuZC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IG1pblZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IG1heFZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0ICRtaW5WYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5taW4tdmFsdWUnICk7XG5cdFx0XHRcdGNvbnN0ICRtYXhWYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5tYXgtdmFsdWUnICk7XG5cblx0XHRcdFx0Y29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIHNsaWRlcklkICk7XG5cblx0XHRcdFx0bm9VaVNsaWRlci5jcmVhdGUoIHNsaWRlciwge1xuXHRcdFx0XHRcdHN0YXJ0OiBbIG1pblZhbHVlLCBtYXhWYWx1ZSBdLFxuXHRcdFx0XHRcdHN0ZXAsXG5cdFx0XHRcdFx0Y29ubmVjdDogdHJ1ZSxcblx0XHRcdFx0XHRjc3NQcmVmaXg6ICd3Y2FwZi1ub3VpLScsXG5cdFx0XHRcdFx0cmFuZ2U6IHtcblx0XHRcdFx0XHRcdCdtaW4nOiByYW5nZU1pblZhbHVlLFxuXHRcdFx0XHRcdFx0J21heCc6IHJhbmdlTWF4VmFsdWUsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICd1cGRhdGUnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHRcdGxldCBtaW5WYWx1ZTtcblx0XHRcdFx0XHRsZXQgbWF4VmFsdWU7XG5cblx0XHRcdFx0XHRpZiAoIGZvcm1hdE51bWJlcnMgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IG51bWJlckZvcm1hdCggdmFsdWVzWyAwIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IG51bWJlckZvcm1hdCggdmFsdWVzWyAxIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAwIF0gKTtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoICdwbGFpbl90ZXh0JyA9PT0gZGlzcGxheVZhbHVlc0FzICkge1xuXHRcdFx0XHRcdFx0JG1pblZhbHVlLmh0bWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0XHQkbWF4VmFsdWUuaHRtbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JG1pblZhbHVlLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHRcdCRtYXhWYWx1ZS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICkge1xuXHRcdFx0XHRcdGNvbnN0IF9taW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0Y29uc3QgX21heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblxuXHRcdFx0XHRcdC8vIElmIHZhbHVlIGlzIG5vdCBjaGFuZ2VkIHRoZW4gZG9uJ3QgcHJvY2VlZC5cblx0XHRcdFx0XHRpZiAoIF9taW5WYWx1ZSA9PT0gbWluVmFsdWUgJiYgX21heFZhbHVlID09PSBtYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIF9taW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBfbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHQvLyBSZW1vdmUgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJGl0ZW0uZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdGNvbnN0IHVybCA9ICRpdGVtLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIF9taW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBfbWF4VmFsdWUgKTtcblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtaW5WYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG1pblZhbHVlLCBudWxsIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkbWF4VmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRcdGNsZWFyVGltZW91dCggJGlucHV0LmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBudWxsLCBtYXhWYWx1ZSBdICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRpbml0RGF0ZXBpY2tlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgalF1ZXJ5KCkuZGF0ZXBpY2tlciApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCAkd2NhcGZEYXRlRmlsdGVyID0gJGJvZHkuZmluZCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXG5cdFx0XHRjb25zdCBmb3JtYXQgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLWZvcm1hdCcgKTtcblx0XHRcdGNvbnN0IHllYXJEcm9wZG93biAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtcGlja2VyLXllYXItZHJvcGRvd24nICk7XG5cdFx0XHRjb25zdCBtb250aERyb3Bkb3duID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLXBpY2tlci1tb250aC1kcm9wZG93bicgKTtcblxuXHRcdFx0Y29uc3QgJGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApO1xuXHRcdFx0Y29uc3QgJHRvICAgPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKTtcblxuXHRcdFx0JGZyb20uZGF0ZXBpY2tlcigge1xuXHRcdFx0XHRkYXRlRm9ybWF0OiBmb3JtYXQsXG5cdFx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdFx0Y2hhbmdlTW9udGg6IG1vbnRoRHJvcGRvd24sXG5cdFx0XHR9ICk7XG5cblx0XHRcdCR0by5kYXRlcGlja2VyKCB7XG5cdFx0XHRcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdFx0Y2hhbmdlWWVhcjogeWVhckRyb3Bkb3duLFxuXHRcdFx0XHRjaGFuZ2VNb250aDogbW9udGhEcm9wZG93bixcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXRGaWx0ZXJPcHRpb25Ub29sdGlwOiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRSZWZlcmVuY2Vcblx0XHRcdGlmICggJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHRpcHB5ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMudXNlX3RpcHB5anMgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgdG9vbHRpcFBvc2l0aW9ucyA9IFsgJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCcgXTtcblxuXHRcdFx0dG9vbHRpcFBvc2l0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbiggdG9vbHRpcFBvc2l0aW9uICkge1xuXHRcdFx0XHRjb25zdCBpZGVudGlmaWVyID0gJ2RhdGEtd2NhcGYtdG9vbHRpcC0nICsgdG9vbHRpcFBvc2l0aW9uO1xuXG5cdFx0XHRcdC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRSZWZlcmVuY2Vcblx0XHRcdFx0Y29uc3QgaW5zdGFuY2VzID0gdGlwcHkoICdbJyArIGlkZW50aWZpZXIgKyAnXScsIHtcblx0XHRcdFx0XHRwbGFjZW1lbnQ6IHRvb2x0aXBQb3NpdGlvbixcblx0XHRcdFx0XHRjb250ZW50KCByZWZlcmVuY2UgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSggaWRlbnRpZmllciApO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0YWxsb3dIVE1MOiB0cnVlLFxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0d2luZG93LnRpcHB5SW5zdGFuY2VzID0gdGlwcHlJbnN0YW5jZXMuY29uY2F0KCBpbnN0YW5jZXMgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0V0NBUEYuaW5pdENvbWJvYm94KCk7XG5cdFx0XHRXQ0FQRi5pbml0UmFuZ2VTbGlkZXIoKTtcblx0XHRcdFdDQVBGLmluaXREYXRlcGlja2VyKCk7XG5cdFx0XHRXQ0FQRi5pbml0RmlsdGVyT3B0aW9uVG9vbHRpcCgpO1xuXHRcdH0sXG5cdFx0aW5pdFBvcFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnJlbG9hZF9vbl9iYWNrICYmIHdjYXBmX3BhcmFtcy5mb3VuZF93Y2FwZiApIHtcblx0XHRcdFx0aGlzdG9yeS5yZXBsYWNlU3RhdGUoIHsgd2NhcGY6IHRydWUgfSwgJycsIHdpbmRvdy5sb2NhdGlvbiApO1xuXG5cdFx0XHRcdC8vIEhhbmRsZSB0aGUgcG9wc3RhdGUgZXZlbnQoYnJvd3NlcidzIGJhY2svZm9yd2FyZClcblx0XHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdwb3BzdGF0ZScsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdGlmICggbnVsbCAhPT0gZS5zdGF0ZSAmJiBlLnN0YXRlLmhhc093blByb3BlcnR5KCAnd2NhcGYnICkgKSB7XG5cdFx0XHRcdFx0XHRXQ0FQRi5maWx0ZXJQcm9kdWN0cyggJ3BvcHN0YXRlJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICogRW5hYmxlIGl0IGlmIG5lY2Vzc2FyeS5cblx0ICpcblx0ICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzMwMDQ5MTdcblx0ICovXG5cdGlmICggJ3Njcm9sbFJlc3RvcmF0aW9uJyBpbiBoaXN0b3J5ICkge1xuXHRcdC8vIGhpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb24gPSAnbWFudWFsJztcblx0fVxuXG59KCBqUXVlcnksIHdpbmRvdyApICk7XG5cbiggZnVuY3Rpb24oICQsIFdDQVBGICkge1xuXG5cdFdDQVBGLmluaXQoKTtcblx0V0NBUEYuaW5pdFBvcFN0YXRlKCk7XG5cblx0V0NBUEYuaGFuZGxlRmlsdGVyQWNjb3JkaW9uKCk7XG5cdFdDQVBGLmhhbmRsZUhpZXJhcmNoeVRvZ2dsZSgpO1xuXHRXQ0FQRi5oYW5kbGVTb2Z0TGltaXQoKTtcblx0V0NBUEYuaGFuZGxlU2VhcmNoRmlsdGVyT3B0aW9ucygpO1xuXG5cdFdDQVBGLmhhbmRsZUxpc3RGaWx0ZXJzKCk7XG5cdFdDQVBGLmhhbmRsZURyb3Bkb3duRmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVOdW1iZXJJbnB1dEZpbHRlcnMoKTtcblx0V0NBUEYuaGFuZGxlRGF0ZUlucHV0RmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVQYWdpbmF0aW9uKCk7XG5cdFdDQVBGLmhhbmRsZURlZmF1bHRPcmRlcmJ5KCk7XG5cblx0V0NBUEYuaGFuZGxlQ2xlYXJGaWx0ZXIoKTtcblxuXHRXQ0FQRi5oYW5kbGVGaWx0ZXJUb29sdGlwKCk7XG5cblx0LyoqXG5cdCAqIE1ha2UgaXQgY29tcGF0aWJsZSB3aXRoIG90aGVyIHBsdWdpbnMuXG5cdCAqL1xuXHQkKCBkb2N1bWVudCApLm9uKCAnd2NhcGZfYWZ0ZXJfdXBkYXRpbmdfcHJvZHVjdHMnLCBmdW5jdGlvbigpIHtcblx0XHQvLyB3b28tdmFyaWF0aW9uLXN3YXRjaGVzXG5cdFx0JCggZG9jdW1lbnQgKS50cmlnZ2VyKCAnd29vX3ZhcmlhdGlvbl9zd2F0Y2hlc19wcm9faW5pdCcgKTtcblx0fSApO1xuXG59KCBqUXVlcnksIHdpbmRvdy5XQ0FQRiApICk7XG4iLCIvKipcbiAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM0MTQxODEzXG4gKlxuICogQHBhcmFtIG51bWJlclxuICogQHBhcmFtIGRlY2ltYWxzXG4gKiBAcGFyYW0gZGVjX3BvaW50XG4gKiBAcGFyYW0gdGhvdXNhbmRzX3NlcFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIG51bWJlckZvcm1hdCggbnVtYmVyLCBkZWNpbWFscywgZGVjX3BvaW50LCB0aG91c2FuZHNfc2VwICkge1xuXHQvLyBTdHJpcCBhbGwgY2hhcmFjdGVycyBidXQgbnVtZXJpY2FsIG9uZXMuXG5cdG51bWJlciA9ICggbnVtYmVyICsgJycgKS5yZXBsYWNlKCAvW15cXGQrXFwtRWUuXS9nLCAnJyApO1xuXG5cdGNvbnN0IG4gICAgPSAhIGlzRmluaXRlKCArbnVtYmVyICkgPyAwIDogK251bWJlcjtcblx0Y29uc3QgcHJlYyA9ICEgaXNGaW5pdGUoICtkZWNpbWFscyApID8gMCA6IE1hdGguYWJzKCBkZWNpbWFscyApO1xuXHRjb25zdCBzZXAgID0gKCB0eXBlb2YgdGhvdXNhbmRzX3NlcCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcsJyA6IHRob3VzYW5kc19zZXA7XG5cdGNvbnN0IGRlYyAgPSAoIHR5cGVvZiBkZWNfcG9pbnQgPT09ICd1bmRlZmluZWQnICkgPyAnLicgOiBkZWNfcG9pbnQ7XG5cblx0bGV0IHM7XG5cblx0Y29uc3QgdG9GaXhlZEZpeCA9IGZ1bmN0aW9uKCBuLCBwcmVjICkge1xuXHRcdGNvbnN0IGsgPSBNYXRoLnBvdyggMTAsIHByZWMgKTtcblx0XHRyZXR1cm4gJycgKyBNYXRoLnJvdW5kKCBuICogayApIC8gaztcblx0fTtcblxuXHQvLyBGaXggZm9yIElFIHBhcnNlRmxvYXQoMC41NSkudG9GaXhlZCgwKSA9IDA7XG5cdHMgPSAoIHByZWMgPyB0b0ZpeGVkRml4KCBuLCBwcmVjICkgOiAnJyArIE1hdGgucm91bmQoIG4gKSApLnNwbGl0KCAnLicgKTtcblxuXHRpZiAoIHNbIDAgXS5sZW5ndGggPiAzICkge1xuXHRcdHNbIDAgXSA9IHNbIDAgXS5yZXBsYWNlKCAvXFxCKD89KD86XFxkezN9KSsoPyFcXGQpKS9nLCBzZXAgKTtcblx0fVxuXG5cdGlmICggKCBzWyAxIF0gfHwgJycgKS5sZW5ndGggPCBwcmVjICkge1xuXHRcdHNbIDEgXSA9IHNbIDEgXSB8fCAnJztcblx0XHRzWyAxIF0gKz0gbmV3IEFycmF5KCBwcmVjIC0gc1sgMSBdLmxlbmd0aCArIDEgKS5qb2luKCAnMCcgKTtcblx0fVxuXG5cdHJldHVybiBzLmpvaW4oIGRlYyApO1xufVxuXG5mdW5jdGlvbiBjbGVhblVybCggdXJsICkge1xuXHRyZXR1cm4gdXJsLnJlcGxhY2UoIC8lMkMvZywgJywnICk7XG59XG5cbmZ1bmN0aW9uIGdldE9yZGVyQnlVcmwoIHVybCApIHtcblx0Y29uc3QgcGFnZWQgPSBwYXJzZUludCggdXJsLnJlcGxhY2UoIC8uK1xcL3BhZ2VcXC8oXFxkKykrLywgJyQxJyApICk7XG5cblx0aWYgKCBwYWdlZCApIHtcblx0XHR1cmwgPSB1cmwucmVwbGFjZSggL3BhZ2VcXC8oXFxkKylcXC8vLCAnJyApO1xuXHR9XG5cblx0cmV0dXJuIGNsZWFuVXJsKCB1cmwgKTtcbn1cbiJdfQ==
