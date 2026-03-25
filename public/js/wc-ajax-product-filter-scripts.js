"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * The main js file.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/public/js
 * @author     Mainul Hassan
 */

var wcapf_params = wcapf_params || {
  'is_rtl': '',
  'filter_input_delay': '',
  'keyword_filter_delay': '',
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
        var pressed = $el.attr('aria-expanded') === 'true';

        // Change aria-expanded to the opposite state
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
        var pressed = $el.attr('aria-pressed') === 'true';

        // Change aria-pressed to the opposite state
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
        var pressed = $el.attr('aria-pressed') === 'true';

        // Change aria-pressed to the opposite state
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
      $body.on('click', '.wcapf-search-box .wcapf-clear-state', function () {
        var $that = $(this);
        var $searchBox = $that.closest('.wcapf-search-box');
        var $input = $searchBox.find('input[type="text"]');
        var $filter = $searchBox.closest('.wcapf-filter');
        $input.val('');
        $input.trigger('input');
        if ($filter.hasClass('wcapf-filter-keyword')) {
          $input.trigger('change');
        }
      });
      $body.on('change', '.wcapf-filter-keyword input[type="text"]', function () {
        var $that = $(this);
        var $wrapper = $that.closest('.wcapf-keyword-filter-wrapper');
        var keyword = $that.val();
        var filterURL = $wrapper.data('filter-url');
        var clearFilterURL = $wrapper.data('clear-filter-url');
        var url = keyword.length ? filterURL.replace('%s', keyword) : clearFilterURL;
        WCAPF.requestFilter(url);
      });
      $body.on('keydown', '.wcapf-filter-keyword input[type="text"]', function (e) {
        if ('Enter' === e.key) {
          $(this).trigger('change');
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
      $body.find('.wcapf-loader').removeClass('is-active');

      // Maybe good for performance.
      WCAPF.destroyTippyInstances();
      $document.trigger('wcapf_before_updating_products', [$response, triggeredBy]);
    },
    afterUpdatingProducts: function afterUpdatingProducts($response, triggeredBy) {
      WCAPF.updateProductsCountResult($response);

      // Reinitialize wcapf.
      WCAPF.init();
      if (!isPro && 'after' === wcapf_params.scroll_window_when) {
        WCAPF.scrollTo();
      }

      // Trigger events.
      $(document).trigger('ready');
      $(window).trigger('scroll');
      $(window).trigger('resize');

      // A3 Lazy Load support.
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
          }

          // Update the instances.
          var _loop = function _loop() {
            var id = _instanceIds[_i];
            var instanceId = '[data-id="' + id + '"]';
            var $instance = $(instanceId);
            var $inner = $instance.find('.wcapf-filter-inner');
            var _instance = $response.find(instanceId);

            // Preserve hierarchy accordion state.
            if (wcapf_params.preserve_hierarchy_accordion_state) {
              if ($instance.hasClass('has-hierarchy-accordion')) {
                $instance.find('.wcapf-hierarchy-accordion-toggle').each(function () {
                  var $el = $(this);
                  var id = $el.data('id');
                  var toggleSelector = ".wcapf-hierarchy-accordion-toggle[data-id=\"".concat(id, "\"]");

                  // Check to see if the accordion is opened
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
            }

            // Preserve soft limit state.
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
            var _html = _instance.find('.wcapf-filter-inner').html();

            // Finally update the instance.
            $inner.html(_html);

            // Remove search-active from any search box whose input is now empty.
            $instance.find('.wcapf-search-box.with-cross input[type="text"]').each(function () {
              if (!$(this).val()) {
                $(this).closest('.wcapf-filter').removeClass('search-active');
              }
            });
            $instance.trigger('wcapf-filter-updated', [_instance]);
          };
          for (var _i = 0, _instanceIds = instanceIds; _i < _instanceIds.length; _i++) {
            _loop();
          }

          // Update the active filters and reset filters.
          $body.find('.wcapf-active-filters, .wcapf-reset-filters').each(function () {
            var $that = $(this);
            var instanceId = '[data-id="' + $that.data('id') + '"]';
            $that.html($response.find(instanceId).html());
          });

          // Replace old shop loop with new one.
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
      $body.on('change', rangeNumberSelectors, function () {
        var $item = $(this);
        var $rangeNumber = $item.closest('.wcapf-range-number');
        var formatNumbers = $rangeNumber.attr('data-format-numbers');
        var rangeMinValue = parseFloat($rangeNumber.attr('data-range-min-value'));
        var rangeMaxValue = parseFloat($rangeNumber.attr('data-range-max-value'));
        var oldMinValue = parseFloat($rangeNumber.attr('data-min-value'));
        var oldMaxValue = parseFloat($rangeNumber.attr('data-max-value'));
        var decimalPlaces = $rangeNumber.attr('data-decimal-places');
        var thousandSeparator = $rangeNumber.attr('data-thousand-separator');
        var decimalSeparator = $rangeNumber.attr('data-decimal-separator');
        var getValue = function getValue(floatValue) {
          if (formatNumbers) {
            return numberFormat(floatValue, decimalPlaces, decimalSeparator, thousandSeparator);
          }
          return floatValue;
        };
        var minValue = parseFloat($rangeNumber.find('.min-value').val());
        var maxValue = parseFloat($rangeNumber.find('.max-value').val());

        // Force the minValue not to be empty.
        if (isNaN(minValue)) {
          minValue = rangeMinValue;
          $rangeNumber.find('.min-value').val(getValue(minValue));
        } else {
          $rangeNumber.find('.min-value').val(getValue(minValue));
        }

        // Force the maxValue not to be empty.
        if (isNaN(maxValue)) {
          maxValue = rangeMaxValue;
          $rangeNumber.find('.max-value').val(getValue(maxValue));
        } else {
          $rangeNumber.find('.max-value').val(getValue(maxValue));
        }

        // Force the minValue not to go below the rangeMinValue.
        if (minValue < rangeMinValue) {
          minValue = rangeMinValue;
          $rangeNumber.find('.min-value').val(getValue(minValue));
        }

        // Force the minValue not to go up the rangeMaxValue.
        if (minValue > rangeMaxValue) {
          minValue = rangeMaxValue;
          $rangeNumber.find('.min-value').val(getValue(minValue));
        }

        // Force the maxValue not to go up the rangeMaxValue.
        if (maxValue > rangeMaxValue) {
          maxValue = rangeMaxValue;
          $rangeNumber.find('.max-value').val(getValue(maxValue));
        }

        // Force the maxValue not to go below the minValue.
        if (minValue > maxValue) {
          maxValue = minValue;
          $rangeNumber.find('.max-value').val(getValue(maxValue));
        }

        // If value is not changed then don't proceed.
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
      });
      $body.on('keydown', rangeNumberSelectors, function (e) {
        if ('Enter' === e.key) {
          $(this).trigger('change');
        }
      });
    },
    handleDateInputFilters: function handleDateInputFilters() {
      $body.on('change', '.wcapf-date-input .date-input', function () {
        var $filter = $(this).closest('.wcapf-date-input');
        var isRange = $filter.data('is-range');
        var filterUrl = '';

        // Clear any previously set timer before setting a fresh one
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
        $(this).closest('.wcapf-filter-item').toggleClass('item-active');

        // https://stackoverflow.com/a/5839924
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
      }

      // Prevent the auto submission of the orderby form.
      $body.on('submit', wcapf_params.orderby_form, function () {
        return false;
      });

      // Handle the filter request via ajax when the orderby value is changed.
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
      }

      // noinspection JSUnresolvedReference
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
        var options = _objectSpread({}, defaults);

        // If hierarchy enabled then we show the selected options.
        if ($this.hasClass('has-hierarchy')) {
          options['display_selected_options'] = true;
        } else {
          options['display_selected_options'] = wcapf_params.combobox_display_selected_options;
        }

        // Enable templating when showing count.
        if ($this.hasClass('with-count')) {
          options['templateResult'] = templateResult;
          options['templateSelection'] = templateSelection;
        }

        // Disable search box.
        if (!$this.data('enable-search')) {
          options['disable_search'] = true;
        }
        $this.chosenWCAPF(options);
      });

      // Attach chosen for default orderby.
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
        var safeStep = isNaN(step) || step <= 0 ? 1 : step;
        noUiSlider.create(slider, {
          start: [minValue, maxValue],
          step: safeStep,
          connect: true,
          cssPrefix: 'wcapf-noui-',
          range: {
            'min': rangeMinValue,
            'max': rangeMinValue === rangeMaxValue ? rangeMinValue + safeStep : rangeMaxValue
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
          var _maxValue = parseFloat(values[1]);

          // If value is not changed then don't proceed.
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
        var isDragging = false;
        slider.noUiSlider.on('start', function () {
          isDragging = true;
        });
        slider.noUiSlider.on('end', function () {
          isDragging = false;
          filterProductsAccordingToSlider(slider.noUiSlider.get());
        });
        slider.noUiSlider.on('change', function (values) {
          if (isDragging) {
            return;
          }

          // Keyboard interaction — debounce to avoid a request on every key press.
          clearTimeout($item.data('timer'));
          $item.data('timer', setTimeout(function () {
            $item.removeData('timer');
            filterProductsAccordingToSlider(values);
          }, delay));
        });
        $minValue.on('change', function () {
          var val = parseFloat($(this).val());
          slider.noUiSlider.set([isNaN(val) ? rangeMinValue : val, null]);
          filterProductsAccordingToSlider(slider.noUiSlider.get());
        });
        $minValue.on('keydown', function (e) {
          if ('Enter' === e.key) {
            $(this).trigger('change');
          }
        });
        $maxValue.on('change', function () {
          var val = parseFloat($(this).val());
          slider.noUiSlider.set([null, isNaN(val) ? rangeMaxValue : val]);
          filterProductsAccordingToSlider(slider.noUiSlider.get());
        });
        $maxValue.on('keydown', function (e) {
          if ('Enter' === e.key) {
            $(this).trigger('change');
          }
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
        var identifier = 'data-wcapf-tooltip-' + tooltipPosition;

        // noinspection JSUnresolvedReference
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
    handleFormSubmit: function handleFormSubmit() {
      $body.on('submit', '.wcapf-form', function (e) {
        e.preventDefault();
      });
    },
    initPopState: function initPopState() {
      if (wcapf_params.reload_on_back && wcapf_params.found_wcapf) {
        history.replaceState({
          wcapf: true
        }, '', window.location);

        // Handle the popstate event(browser's back/forward)
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
  if ('scrollRestoration' in history) {
    // history.scrollRestoration = 'manual';
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
  WCAPF.handleFormSubmit();

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
  };

  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJ1dGlscy5qcyJdLCJuYW1lcyI6WyJ3Y2FwZl9wYXJhbXMiLCIkIiwid2luZG93IiwiX2RlbGF5IiwicGFyc2VJbnQiLCJmaWx0ZXJfaW5wdXRfZGVsYXkiLCJkZWxheSIsImlzUHJvIiwid2NhcGZfcHJvIiwiJGJvZHkiLCIkZG9jdW1lbnQiLCJkb2N1bWVudCIsImluc3RhbmNlSWRzIiwiZGVmYXVsdE9yZGVyQnlFbGVtZW50Iiwib3JkZXJieV9mb3JtIiwib3JkZXJieV9lbGVtZW50IiwiZWFjaCIsImlkIiwiZGF0YSIsInB1c2giLCJ0aXBweUluc3RhbmNlcyIsIldDQVBGIiwiaGFuZGxlRmlsdGVyQWNjb3JkaW9uIiwidG9nZ2xlQWNjb3JkaW9uIiwiJGVsIiwicHJlc3NlZCIsImF0dHIiLCIkZmlsdGVySW5uZXIiLCJjbG9zZXN0IiwiY2hpbGRyZW4iLCJlbmFibGVfYW5pbWF0aW9uX2Zvcl9maWx0ZXJfYWNjb3JkaW9uIiwic2xpZGVUb2dnbGUiLCJmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsInRvZ2dsZSIsIm9uIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsIiR0cmlnZ2VyIiwiZmluZCIsImhhbmRsZUhpZXJhcmNoeVRvZ2dsZSIsIiRjaGlsZCIsImVuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24iLCJoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsImtleSIsInByZXZlbnREZWZhdWx0IiwiaGFuZGxlU29mdExpbWl0IiwidG9nZ2xlRmlsdGVyT3B0aW9ucyIsIiRsaXN0V3JhcHBlciIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJoYW5kbGVTZWFyY2hGaWx0ZXJPcHRpb25zIiwiJHRoYXQiLCIkaW5uZXIiLCIkZmlsdGVyIiwic29mdExpbWl0RW5hYmxlZCIsImhhc0NsYXNzIiwic29mdExpbWl0VG9nZ2xlIiwibm9SZXN1bHRzIiwidmlzaWJsZU9wdGlvbnMiLCJrZXl3b3JkIiwidmFsIiwibGVuZ3RoIiwiaW5kZXgiLCIkZmlsdGVySXRlbSIsInJlbW92ZUF0dHIiLCJ0ZXh0IiwiaGlkZSIsImxhYmVsIiwidG9TdHJpbmciLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwic2hvdyIsIiRzZWFyY2hCb3giLCIkaW5wdXQiLCJ0cmlnZ2VyIiwiJHdyYXBwZXIiLCJmaWx0ZXJVUkwiLCJjbGVhckZpbHRlclVSTCIsInVybCIsInJlcGxhY2UiLCJyZXF1ZXN0RmlsdGVyIiwidXBkYXRlUHJvZHVjdHNDb3VudFJlc3VsdCIsIiRyZXNwb25zZSIsIiRjb250YWluZXIiLCJzaG9wX2xvb3BfY29udGFpbmVyIiwic2VsZWN0b3IiLCJuZXdDb3VudCIsImh0bWwiLCJoYXMiLCJzY3JvbGxUbyIsInNjcm9sbF93aW5kb3ciLCJzY3JvbGxGb3IiLCJzY3JvbGxfd2luZG93X2ZvciIsImlzTW9iaWxlIiwiaXNfbW9iaWxlIiwicHJvY2VlZCIsImFkanVzdGluZ09mZnNldCIsIm9mZnNldCIsInNjcm9sbF90b190b3Bfb2Zmc2V0IiwiY29udGFpbmVyIiwibm90X2ZvdW5kX2NvbnRhaW5lciIsInNjcm9sbF93aW5kb3dfY3VzdG9tX2VsZW1lbnQiLCJ0b3AiLCJzdG9wIiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsInNjcm9sbF90b190b3Bfc3BlZWQiLCJzY3JvbGxfdG9fdG9wX2Vhc2luZyIsImJlZm9yZUZldGNoaW5nUHJvZHVjdHMiLCJ0cmlnZ2VyZWRCeSIsInNjcm9sbF93aW5kb3dfd2hlbiIsImRlc3Ryb3lUaXBweUluc3RhbmNlcyIsInVzZV90aXBweWpzIiwiZm9yRWFjaCIsImluc3RhbmNlIiwiZGVzdHJveSIsImJlZm9yZVVwZGF0aW5nUHJvZHVjdHMiLCJhZnRlclVwZGF0aW5nUHJvZHVjdHMiLCJpbml0IiwiY3VzdG9tX3NjcmlwdHMiLCJldmFsIiwiZmlsdGVyUHJvZHVjdHMiLCJhcmd1bWVudHMiLCJ1bmRlZmluZWQiLCJhamF4IiwibG9jYXRpb24iLCJocmVmIiwic3VjY2VzcyIsInJlc3BvbnNlIiwidXBkYXRlX2RvY3VtZW50X3RpdGxlIiwidGl0bGUiLCJmaWx0ZXIiLCJfbG9vcCIsIl9pbnN0YW5jZUlkcyIsIl9pIiwiaW5zdGFuY2VJZCIsIiRpbnN0YW5jZSIsIl9pbnN0YW5jZSIsInByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUiLCJ0b2dnbGVTZWxlY3RvciIsImNvbmNhdCIsInByZXNlcnZlX3NvZnRfbGltaXRfc3RhdGUiLCJfaHRtbCIsIiRzaG9wTG9vcENvbnRhaW5lciIsIiRub3RGb3VuZENvbnRhaW5lciIsImRpc2FibGVfYWpheCIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJ3Y2FwZiIsImhhbmRsZU51bWJlcklucHV0RmlsdGVycyIsInJhbmdlTnVtYmVyU2VsZWN0b3JzIiwiJGl0ZW0iLCIkcmFuZ2VOdW1iZXIiLCJmb3JtYXROdW1iZXJzIiwicmFuZ2VNaW5WYWx1ZSIsInBhcnNlRmxvYXQiLCJyYW5nZU1heFZhbHVlIiwib2xkTWluVmFsdWUiLCJvbGRNYXhWYWx1ZSIsImRlY2ltYWxQbGFjZXMiLCJ0aG91c2FuZFNlcGFyYXRvciIsImRlY2ltYWxTZXBhcmF0b3IiLCJnZXRWYWx1ZSIsImZsb2F0VmFsdWUiLCJudW1iZXJGb3JtYXQiLCJtaW5WYWx1ZSIsIm1heFZhbHVlIiwiaXNOYU4iLCJoYW5kbGVEYXRlSW5wdXRGaWx0ZXJzIiwiaXNSYW5nZSIsImZpbHRlclVybCIsImNsZWFyVGltZW91dCIsImZyb20iLCJ0byIsInNldFRpbWVvdXQiLCJyZW1vdmVEYXRhIiwiaGFuZGxlTGlzdEZpbHRlcnMiLCJuYXRpdmVJbnB1dHMiLCJ0b2dnbGVDbGFzcyIsImN1c3RvbVJhZGlvU2VsZWN0b3IiLCJub3QiLCJwcm9wIiwiaGFuZGxlRHJvcGRvd25GaWx0ZXJzIiwiJHNlbGVjdCIsInZhbHVlcyIsImhhbmRsZVBhZ2luYXRpb24iLCJlbmFibGVfcGFnaW5hdGlvbl92aWFfYWpheCIsInBhZ2luYXRpb25fY29udGFpbmVyIiwiX3NlbGVjdG9ycyIsInNwbGl0Iiwic2VsZWN0b3JzIiwiam9pbiIsImhhbmRsZURlZmF1bHRPcmRlcmJ5Iiwic29ydGluZ19jb250cm9sIiwib3JkZXIiLCJVUkwiLCJzZWFyY2hQYXJhbXMiLCJzZXQiLCJnZXRPcmRlckJ5VXJsIiwiaGFuZGxlQ2xlYXJGaWx0ZXIiLCJoYW5kbGVGaWx0ZXJUb29sdGlwIiwidGlwcHkiLCJwbGFjZW1lbnQiLCJjb250ZW50IiwicmVmZXJlbmNlIiwiZ2V0QXR0cmlidXRlIiwiYWxsb3dIVE1MIiwiaW5pdENvbWJvYm94IiwialF1ZXJ5IiwiY2hvc2VuV0NBUEYiLCJ0ZW1wbGF0ZVJlc3VsdCIsInRlbXBsYXRlU2VsZWN0aW9uIiwiY291bnQiLCJkZWZhdWx0cyIsImluaGVyaXRfc2VsZWN0X2NsYXNzZXMiLCJpbmhlcml0X29wdGlvbl9jbGFzc2VzIiwibm9fcmVzdWx0c190ZXh0IiwiY29tYm9ib3hfbm9fcmVzdWx0c190ZXh0Iiwib3B0aW9uc19ub25lX3RleHQiLCJjb21ib2JveF9vcHRpb25zX25vbmVfdGV4dCIsInNlYXJjaF9jb250YWlucyIsInNlYXJjaF9pbl92YWx1ZXMiLCJpc19ydGwiLCIkdGhpcyIsIm9wdGlvbnMiLCJfb2JqZWN0U3ByZWFkIiwiY29tYm9ib3hfZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zIiwiYXR0YWNoX2NvbWJvYm94X29uX3NvcnRpbmciLCJkaXNhYmxlU2VhcmNoIiwic2VhcmNoX2JveF9pbl9kZWZhdWx0X29yZGVyYnkiLCJpbml0UmFuZ2VTbGlkZXIiLCJub1VpU2xpZGVyIiwiJHNsaWRlciIsInNsaWRlcklkIiwiZGlzcGxheVZhbHVlc0FzIiwic3RlcCIsIiRtaW5WYWx1ZSIsIiRtYXhWYWx1ZSIsInNsaWRlciIsImdldEVsZW1lbnRCeUlkIiwic2FmZVN0ZXAiLCJjcmVhdGUiLCJzdGFydCIsImNvbm5lY3QiLCJjc3NQcmVmaXgiLCJyYW5nZSIsImZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIiLCJfbWluVmFsdWUiLCJfbWF4VmFsdWUiLCJpc0RyYWdnaW5nIiwiZ2V0IiwiaW5pdERhdGVwaWNrZXIiLCJkYXRlcGlja2VyIiwiJHdjYXBmRGF0ZUZpbHRlciIsImZvcm1hdCIsInllYXJEcm9wZG93biIsIm1vbnRoRHJvcGRvd24iLCIkZnJvbSIsIiR0byIsImRhdGVGb3JtYXQiLCJjaGFuZ2VZZWFyIiwiY2hhbmdlTW9udGgiLCJpbml0RmlsdGVyT3B0aW9uVG9vbHRpcCIsInRvb2x0aXBQb3NpdGlvbnMiLCJ0b29sdGlwUG9zaXRpb24iLCJpZGVudGlmaWVyIiwiaW5zdGFuY2VzIiwiaGFuZGxlRm9ybVN1Ym1pdCIsImluaXRQb3BTdGF0ZSIsInJlbG9hZF9vbl9iYWNrIiwiZm91bmRfd2NhcGYiLCJyZXBsYWNlU3RhdGUiLCJhZGRFdmVudExpc3RlbmVyIiwic3RhdGUiLCJoYXNPd25Qcm9wZXJ0eSIsIm51bWJlciIsImRlY2ltYWxzIiwiZGVjX3BvaW50IiwidGhvdXNhbmRzX3NlcCIsIm4iLCJpc0Zpbml0ZSIsInByZWMiLCJNYXRoIiwiYWJzIiwic2VwIiwiZGVjIiwicyIsInRvRml4ZWRGaXgiLCJrIiwicG93Iiwicm91bmQiLCJBcnJheSIsImNsZWFuVXJsIiwicGFnZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFNQSxZQUFZLEdBQUdBLFlBQVksSUFBSTtFQUNwQyxRQUFRLEVBQUUsRUFBRTtFQUNaLG9CQUFvQixFQUFFLEVBQUU7RUFDeEIsc0JBQXNCLEVBQUUsRUFBRTtFQUMxQixtQ0FBbUMsRUFBRSxFQUFFO0VBQ3ZDLDBCQUEwQixFQUFFLEVBQUU7RUFDOUIsNEJBQTRCLEVBQUUsRUFBRTtFQUNoQywrQkFBK0IsRUFBRSxFQUFFO0VBQ25DLG9DQUFvQyxFQUFFLEVBQUU7RUFDeEMs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QUFJLEdBQUdLLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQ2pPLE1BQU0sR0FBRyxDQUFFLENBQUMsQ0FBQ2tJLElBQUksQ0FBRSxHQUFJLENBQUM7RUFDNUQ7RUFFQSxPQUFPK0YsQ0FBQyxDQUFDL0YsSUFBSSxDQUFFOEYsR0FBSSxDQUFDO0FBQ3JCO0FBRUEsU0FBU08sUUFBUUEsQ0FBRXROLEdBQUcsRUFBRztFQUN4QixPQUFPQSxHQUFHLENBQUNDLE9BQU8sQ0FBRSxNQUFNLEVBQUUsR0FBSSxDQUFDO0FBQ2xDO0FBRUEsU0FBU3VILGFBQWFBLENBQUV4SCxHQUFHLEVBQUc7RUFDN0IsSUFBTXVOLEtBQUssR0FBR25TLFFBQVEsQ0FBRTRFLEdBQUcsQ0FBQ0MsT0FBTyxDQUFFLGtCQUFrQixFQUFFLElBQUssQ0FBRSxDQUFDO0VBRWpFLElBQUtzTixLQUFLLEVBQUc7SUFDWnZOLEdBQUcsR0FBR0EsR0FBRyxDQUFDQyxPQUFPLENBQUUsZUFBZSxFQUFFLEVBQUcsQ0FBQztFQUN6QztFQUVBLE9BQU9xTixRQUFRLENBQUV0TixHQUFJLENBQUM7QUFDdkIiLCJmaWxlIjoid2MtYWpheC1wcm9kdWN0LWZpbHRlci1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgbWFpbiBqcyBmaWxlLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL3B1YmxpYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhblxuICovXG5cbmNvbnN0IHdjYXBmX3BhcmFtcyA9IHdjYXBmX3BhcmFtcyB8fCB7XG5cdCdpc19ydGwnOiAnJyxcblx0J2ZpbHRlcl9pbnB1dF9kZWxheSc6ICcnLFxuXHQna2V5d29yZF9maWx0ZXJfZGVsYXknOiAnJyxcblx0J2NvbWJvYm94X2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucyc6ICcnLFxuXHQnY29tYm9ib3hfbm9fcmVzdWx0c190ZXh0JzogJycsXG5cdCdjb21ib2JveF9vcHRpb25zX25vbmVfdGV4dCc6ICcnLFxuXHQnc2VhcmNoX2JveF9pbl9kZWZhdWx0X29yZGVyYnknOiAnJyxcblx0J3ByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUnOiAnJyxcblx0J3ByZXNlcnZlX3NvZnRfbGltaXRfc3RhdGUnOiAnJyxcblx0J2VuYWJsZV9hbmltYXRpb25fZm9yX2ZpbHRlcl9hY2NvcmRpb24nOiAnJyxcblx0J2ZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkJzogJycsXG5cdCdmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmcnOiAnJyxcblx0J2VuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24nOiAnJyxcblx0J2hpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkJzogJycsXG5cdCdoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmcnOiAnJyxcblx0J3Njcm9sbF90b190b3Bfc3BlZWQnOiAnJyxcblx0J3Njcm9sbF90b190b3BfZWFzaW5nJzogJycsXG5cdCdpc19tb2JpbGUnOiAnJyxcblx0J3JlbG9hZF9vbl9iYWNrJzogJycsXG5cdCdmb3VuZF93Y2FwZic6ICcnLFxuXHQnd2NhcGZfcHJvJzogJycsXG5cdCd1cGRhdGVfZG9jdW1lbnRfdGl0bGUnOiAnJyxcblx0J3VzZV90aXBweWpzJzogJycsXG5cdCdzaG9wX2xvb3BfY29udGFpbmVyJzogJycsXG5cdCdub3RfZm91bmRfY29udGFpbmVyJzogJycsXG5cdCdwYWdpbmF0aW9uX2NvbnRhaW5lcic6ICcnLFxuXHQnb3JkZXJieV9mb3JtJzogJycsXG5cdCdvcmRlcmJ5X2VsZW1lbnQnOiAnJyxcblx0J2Rpc2FibGVfYWpheCc6ICcnLFxuXHQnZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXgnOiAnJyxcblx0J3NvcnRpbmdfY29udHJvbCc6ICcnLFxuXHQnYXR0YWNoX2NvbWJvYm94X29uX3NvcnRpbmcnOiAnJyxcblx0J2xvYWRpbmdfYW5pbWF0aW9uJzogJycsXG5cdCdzY3JvbGxfd2luZG93JzogJycsXG5cdCdzY3JvbGxfd2luZG93X2Zvcic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd193aGVuJzogJycsXG5cdCdzY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50JzogJycsXG5cdCdzY3JvbGxfb24nOiAnJyxcblx0J3Njcm9sbF90b190b3Bfb2Zmc2V0JzogJycsXG5cdCdkaXNhYmxlX3Njcm9sbF9hbmltYXRpb24nOiAnJyxcblx0J21vcmVfc2VsZWN0b3JzJzogJycsXG5cdCdjdXN0b21fc2NyaXB0cyc6ICcnLFxufTtcblxuKCBmdW5jdGlvbiggJCwgd2luZG93ICkge1xuXG5cdGNvbnN0IF9kZWxheSA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuZmlsdGVyX2lucHV0X2RlbGF5ICk7XG5cdGNvbnN0IGRlbGF5ICA9IF9kZWxheSA+PSAwID8gX2RlbGF5IDogMzAwO1xuXG5cdGNvbnN0IGlzUHJvID0gd2NhcGZfcGFyYW1zLndjYXBmX3BybztcblxuXHRjb25zdCAkYm9keSAgICAgPSAkKCAnYm9keScgKTtcblx0Y29uc3QgJGRvY3VtZW50ID0gJCggZG9jdW1lbnQgKTtcblxuXHRjb25zdCBpbnN0YW5jZUlkcyA9IFtdO1xuXG5cdGNvbnN0IGRlZmF1bHRPcmRlckJ5RWxlbWVudCA9IHdjYXBmX3BhcmFtcy5vcmRlcmJ5X2Zvcm0gKyAnICcgKyB3Y2FwZl9wYXJhbXMub3JkZXJieV9lbGVtZW50O1xuXG5cdCQoICcud2NhcGYtZmlsdGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IGlkID0gJCggdGhpcyApLmRhdGEoICdpZCcgKTtcblxuXHRcdGlmICggISBpZCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpbnN0YW5jZUlkcy5wdXNoKCBpZCApO1xuXHR9ICk7XG5cblx0d2luZG93LnRpcHB5SW5zdGFuY2VzID0gW107XG5cblx0d2luZG93LldDQVBGID0gd2luZG93LldDQVBGIHx8IHt9O1xuXG5cdHdpbmRvdy5XQ0FQRiA9IHtcblx0XHRoYW5kbGVGaWx0ZXJBY2NvcmRpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgdG9nZ2xlQWNjb3JkaW9uID0gKCAkZWwgKSA9PiB7XG5cdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYWNjb3JkaW9uIGlzIG9wZW5lZFxuXHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLWV4cGFuZGVkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0Ly8gQ2hhbmdlIGFyaWEtZXhwYW5kZWQgdG8gdGhlIG9wcG9zaXRlIHN0YXRlXG5cdFx0XHRcdCRlbC5hdHRyKCAnYXJpYS1leHBhbmRlZCcsICEgcHJlc3NlZCApO1xuXG5cdFx0XHRcdGNvbnN0ICRmaWx0ZXJJbm5lciA9ICRlbC5jbG9zZXN0KCAnLndjYXBmLWZpbHRlcicgKS5jaGlsZHJlbiggJy53Y2FwZi1maWx0ZXItaW5uZXInICk7XG5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX2FuaW1hdGlvbl9mb3JfZmlsdGVyX2FjY29yZGlvbiApIHtcblx0XHRcdFx0XHQkZmlsdGVySW5uZXIuc2xpZGVUb2dnbGUoXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQsXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkZmlsdGVySW5uZXIudG9nZ2xlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdCRib2R5Lm9uKCAnY2xpY2snLCAnLndjYXBmLWZpbHRlci1hY2NvcmRpb24tdHJpZ2dlcicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdCRib2R5Lm9uKCAnY2xpY2snLCAnLndjYXBmLWZpbHRlci10aXRsZS5oYXMtYWNjb3JkaW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0cmlnZ2VyID0gJCggdGhpcyApLmZpbmQoICcud2NhcGYtZmlsdGVyLWFjY29yZGlvbi10cmlnZ2VyJyApO1xuXG5cdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJHRyaWdnZXIgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZUhpZXJhcmNoeVRvZ2dsZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCB0b2dnbGVBY2NvcmRpb24gPSAoICRlbCApID0+IHtcblx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBidXR0b24gaXMgcHJlc3NlZFxuXHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLXByZXNzZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHQvLyBDaGFuZ2UgYXJpYS1wcmVzc2VkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuXHRcdFx0XHQkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICEgcHJlc3NlZCApO1xuXG5cdFx0XHRcdGNvbnN0ICRjaGlsZCA9ICRlbC5jbG9zZXN0KCAnbGknICkuY2hpbGRyZW4oICd1bCcgKTtcblxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uICkge1xuXHRcdFx0XHRcdCRjaGlsZC5zbGlkZVRvZ2dsZShcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5oaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCxcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5oaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmdcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRjaGlsZC50b2dnbGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0JGJvZHlcblx0XHRcdFx0Lm9uKCAnY2xpY2snLCAnLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkKCB0aGlzICkgKTtcblx0XHRcdFx0fSApXG5cdFx0XHRcdC5vbiggJ2tleWRvd24nLCAnLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0aWYgKCBlLmtleSA9PT0gJyAnIHx8IGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnU3BhY2ViYXInICkge1xuXHRcdFx0XHRcdFx0Ly8gUHJldmVudCB0aGUgZGVmYXVsdCBhY3Rpb24gdG8gc3RvcCBzY3JvbGxpbmcgd2hlbiBzcGFjZSBpcyBwcmVzc2VkXG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVTb2Z0TGltaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgdG9nZ2xlRmlsdGVyT3B0aW9ucyA9ICggJGVsICkgPT4ge1xuXHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGJ1dHRvbiBpcyBwcmVzc2VkXG5cdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdC8vIENoYW5nZSBhcmlhLXByZXNzZWQgdG8gdGhlIG9wcG9zaXRlIHN0YXRlXG5cdFx0XHRcdCRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJywgISBwcmVzc2VkICk7XG5cblx0XHRcdFx0Y29uc3QgJGxpc3RXcmFwcGVyID0gJGVsLmNsb3Nlc3QoICcud2NhcGYtbGlzdC13cmFwcGVyJyApO1xuXG5cdFx0XHRcdGlmICggcHJlc3NlZCApIHtcblx0XHRcdFx0XHQkbGlzdFdyYXBwZXIucmVtb3ZlQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRsaXN0V3JhcHBlci5hZGRDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdCRib2R5XG5cdFx0XHRcdC5vbiggJ2NsaWNrJywgJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0b2dnbGVGaWx0ZXJPcHRpb25zKCAkKCB0aGlzICkgKTtcblx0XHRcdFx0fSApXG5cdFx0XHRcdC5vbiggJ2tleWRvd24nLCAnLndjYXBmLXNvZnQtbGltaXQtdHJpZ2dlcicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdGlmICggZS5rZXkgPT09ICcgJyB8fCBlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJ1NwYWNlYmFyJyApIHtcblx0XHRcdFx0XHRcdC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgYWN0aW9uIHRvIHN0b3Agc2Nyb2xsaW5nIHdoZW4gc3BhY2UgaXMgcHJlc3NlZFxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0XHR0b2dnbGVGaWx0ZXJPcHRpb25zKCAkKCB0aGlzICkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZVNlYXJjaEZpbHRlck9wdGlvbnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdpbnB1dCcsICcud2NhcGYtc2VhcmNoLWJveCBpbnB1dFt0eXBlPVwidGV4dFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkdGhhdCAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCAkaW5uZXIgID0gJHRoYXQuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXItaW5uZXInICk7XG5cdFx0XHRcdGNvbnN0ICRmaWx0ZXIgPSAkaW5uZXIuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXInICk7XG5cblx0XHRcdFx0Y29uc3Qgc29mdExpbWl0RW5hYmxlZCA9ICRmaWx0ZXIuaGFzQ2xhc3MoICdoYXMtc29mdC1saW1pdCcgKTtcblx0XHRcdFx0Y29uc3Qgc29mdExpbWl0VG9nZ2xlICA9ICRmaWx0ZXIuZmluZCggJy53Y2FwZi1zb2Z0LWxpbWl0LXdyYXBwZXInICk7XG5cdFx0XHRcdGNvbnN0IG5vUmVzdWx0cyAgICAgICAgPSAkZmlsdGVyLmZpbmQoICcud2NhcGYtbm8tcmVzdWx0cy10ZXh0JyApO1xuXHRcdFx0XHRjb25zdCB2aXNpYmxlT3B0aW9ucyAgID0gcGFyc2VJbnQoICRmaWx0ZXIuYXR0ciggJ2RhdGEtdmlzaWJsZS1vcHRpb25zJyApICk7XG5cblx0XHRcdFx0Y29uc3Qga2V5d29yZCA9ICR0aGF0LnZhbCgpO1xuXG5cdFx0XHRcdGlmICggISBrZXl3b3JkLmxlbmd0aCApIHtcblx0XHRcdFx0XHRsZXQgaW5kZXggPSAwO1xuXHRcdFx0XHRcdCRmaWx0ZXIucmVtb3ZlQ2xhc3MoICdzZWFyY2gtYWN0aXZlJyApO1xuXG5cdFx0XHRcdFx0JC5lYWNoKCAkaW5uZXIuZmluZCggJy53Y2FwZi1maWx0ZXItb3B0aW9ucyA+IGxpJyApLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGluZGV4Kys7XG5cblx0XHRcdFx0XHRcdGNvbnN0ICRmaWx0ZXJJdGVtID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICdrZXl3b3JkLW1hdGNoZWQnICk7XG5cblx0XHRcdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCBpbmRleCA+IHZpc2libGVPcHRpb25zICkge1xuXHRcdFx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLmFkZENsYXNzKCAnd2NhcGYtZmlsdGVyLW9wdGlvbi1oaWRkZW4nICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRcdHNvZnRMaW1pdFRvZ2dsZS5yZW1vdmVBdHRyKCAnc3R5bGUnICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bm9SZXN1bHRzLmNoaWxkcmVuKCAnc3BhbicgKS50ZXh0KCAnJyApO1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5oaWRlKCk7XG5cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgaW5kZXggPSAwO1xuXHRcdFx0XHQkZmlsdGVyLmFkZENsYXNzKCAnc2VhcmNoLWFjdGl2ZScgKTtcblxuXHRcdFx0XHQkLmVhY2goICRpbm5lci5maW5kKCAnLndjYXBmLWZpbHRlci1vcHRpb25zID4gbGknICksIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0ICRmaWx0ZXJJdGVtID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdGNvbnN0IGxhYmVsICAgICAgID0gJGZpbHRlckl0ZW0uZmluZCggJy53Y2FwZi1maWx0ZXItaXRlbS1sYWJlbCcgKS5kYXRhKCAnbGFiZWwnICk7XG5cblx0XHRcdFx0XHRpZiAoIGxhYmVsLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygga2V5d29yZC50b0xvd2VyQ2FzZSgpICkgKSB7XG5cdFx0XHRcdFx0XHRpbmRleCsrO1xuXG5cdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5hZGRDbGFzcyggJ2tleXdvcmQtbWF0Y2hlZCcgKTtcblxuXHRcdFx0XHRcdFx0aWYgKCBzb2Z0TGltaXRFbmFibGVkICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIGluZGV4ID4gdmlzaWJsZU9wdGlvbnMgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0uYWRkQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5yZW1vdmVDbGFzcyggJ3djYXBmLWZpbHRlci1vcHRpb24taGlkZGVuJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLnJlbW92ZUNsYXNzKCAna2V5d29yZC1tYXRjaGVkJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRpZiAoIGluZGV4IDw9IHZpc2libGVPcHRpb25zICkge1xuXHRcdFx0XHRcdFx0c29mdExpbWl0VG9nZ2xlLmhpZGUoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c29mdExpbWl0VG9nZ2xlLnNob3coKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIDAgPT09IGluZGV4ICkge1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5jaGlsZHJlbiggJ3NwYW4nICkudGV4dCgga2V5d29yZCApO1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bm9SZXN1bHRzLmNoaWxkcmVuKCAnc3BhbicgKS50ZXh0KCAnJyApO1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtc2VhcmNoLWJveCAud2NhcGYtY2xlYXItc3RhdGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRoYXQgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgJHNlYXJjaEJveCA9ICR0aGF0LmNsb3Nlc3QoICcud2NhcGYtc2VhcmNoLWJveCcgKTtcblx0XHRcdFx0Y29uc3QgJGlucHV0ICAgICA9ICRzZWFyY2hCb3guZmluZCggJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXHRcdFx0XHRjb25zdCAkZmlsdGVyICAgID0gJHNlYXJjaEJveC5jbG9zZXN0KCAnLndjYXBmLWZpbHRlcicgKTtcblxuXHRcdFx0XHQkaW5wdXQudmFsKCAnJyApO1xuXHRcdFx0XHQkaW5wdXQudHJpZ2dlciggJ2lucHV0JyApO1xuXG5cdFx0XHRcdGlmICggJGZpbHRlci5oYXNDbGFzcyggJ3djYXBmLWZpbHRlci1rZXl3b3JkJyApICkge1xuXHRcdFx0XHRcdCRpbnB1dC50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgJy53Y2FwZi1maWx0ZXIta2V5d29yZCBpbnB1dFt0eXBlPVwidGV4dFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkdGhhdCAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgJHdyYXBwZXIgPSAkdGhhdC5jbG9zZXN0KCAnLndjYXBmLWtleXdvcmQtZmlsdGVyLXdyYXBwZXInICk7XG5cdFx0XHRcdGNvbnN0IGtleXdvcmQgID0gJHRoYXQudmFsKCk7XG5cblx0XHRcdFx0Y29uc3QgZmlsdGVyVVJMICAgICAgPSAkd3JhcHBlci5kYXRhKCAnZmlsdGVyLXVybCcgKTtcblx0XHRcdFx0Y29uc3QgY2xlYXJGaWx0ZXJVUkwgPSAkd3JhcHBlci5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKTtcblxuXHRcdFx0XHRjb25zdCB1cmwgPSBrZXl3b3JkLmxlbmd0aCA/IGZpbHRlclVSTC5yZXBsYWNlKCAnJXMnLCBrZXl3b3JkICkgOiBjbGVhckZpbHRlclVSTDtcblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JGJvZHkub24oICdrZXlkb3duJywgJy53Y2FwZi1maWx0ZXIta2V5d29yZCBpbnB1dFt0eXBlPVwidGV4dFwiXScsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRpZiAoICdFbnRlcicgPT09IGUua2V5ICkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHR1cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0OiBmdW5jdGlvbiggJHJlc3BvbnNlICkge1xuXHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRjb25zdCBzZWxlY3RvciAgID0gJy53b29jb21tZXJjZS1yZXN1bHQtY291bnQnO1xuXHRcdFx0Y29uc3QgbmV3Q291bnQgICA9ICRyZXNwb25zZS5maW5kKCBzZWxlY3RvciApLmh0bWwoKTtcblxuXHRcdFx0JGJvZHkuZmluZCggc2VsZWN0b3IgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGVsID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdGlmICggISAkY29udGFpbmVyLmhhcyggJGVsICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdCRlbC5odG1sKCBuZXdDb3VudCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRzY3JvbGxUbzogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICdub25lJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc2Nyb2xsRm9yID0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfZm9yO1xuXHRcdFx0Y29uc3QgaXNNb2JpbGUgID0gd2NhcGZfcGFyYW1zLmlzX21vYmlsZTtcblx0XHRcdGxldCBwcm9jZWVkICAgICA9IGZhbHNlO1xuXG5cdFx0XHRpZiAoICdtb2JpbGUnID09PSBzY3JvbGxGb3IgJiYgaXNNb2JpbGUgKSB7XG5cdFx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmICggJ2Rlc2t0b3AnID09PSBzY3JvbGxGb3IgJiYgISBpc01vYmlsZSApIHtcblx0XHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0XHR9IGVsc2UgaWYgKCAnYm90aCcgPT09IHNjcm9sbEZvciApIHtcblx0XHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISBwcm9jZWVkICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCBhZGp1c3RpbmdPZmZzZXQgPSAwLCBvZmZzZXQgPSAwO1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX29mZnNldCApIHtcblx0XHRcdFx0YWRqdXN0aW5nT2Zmc2V0ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX29mZnNldCApO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgY29udGFpbmVyO1xuXG5cdFx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lcjtcblx0XHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lcjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAnY3VzdG9tJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRcdGNvbnRhaW5lciA9IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50O1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCAkY29udGFpbmVyID0gJCggY29udGFpbmVyICk7XG5cblx0XHRcdGlmICggJGNvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdG9mZnNldCA9ICRjb250YWluZXIub2Zmc2V0KCkudG9wIC0gYWRqdXN0aW5nT2Zmc2V0O1xuXG5cdFx0XHRcdGlmICggb2Zmc2V0IDwgMCApIHtcblx0XHRcdFx0XHRvZmZzZXQgPSAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JCggJ2h0bWwsIGJvZHknICkuc3RvcCgpLmFuaW1hdGUoXG5cdFx0XHRcdFx0eyBzY3JvbGxUb3A6IG9mZnNldCB9LFxuXHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX3NwZWVkLFxuXHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX2Vhc2luZ1xuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Ly8gVGhpbmdzIGFyZSBkb25lIGJlZm9yZSBmZXRjaGluZyB0aGUgcHJvZHVjdHMgbGlrZSBzaG93aW5nIHRoZSBsb2FkaW5nIGluZGljYXRvci5cblx0XHRiZWZvcmVGZXRjaGluZ1Byb2R1Y3RzOiBmdW5jdGlvbiggdHJpZ2dlcmVkQnkgKSB7XG5cdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLWxvYWRlcicgKS5hZGRDbGFzcyggJ2lzLWFjdGl2ZScgKTtcblxuXHRcdFx0aWYgKCAhIGlzUHJvICYmICdpbW1lZGlhdGVseScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X3doZW4gKSB7XG5cdFx0XHRcdFdDQVBGLnNjcm9sbFRvKCk7XG5cdFx0XHR9XG5cblx0XHRcdCRkb2N1bWVudC50cmlnZ2VyKCAnd2NhcGZfYmVmb3JlX2ZldGNoaW5nX3Byb2R1Y3RzJywgWyB0cmlnZ2VyZWRCeSBdICk7XG5cdFx0fSxcblx0XHRkZXN0cm95VGlwcHlJbnN0YW5jZXM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMudXNlX3RpcHB5anMgKSB7XG5cdFx0XHRcdC8vIEBzb3VyY2UgaHR0cHM6Ly9naXRodWIuY29tL2F0b21pa3MvdGlwcHlqcy9pc3N1ZXMvNDczXG5cdFx0XHRcdHRpcHB5SW5zdGFuY2VzLmZvckVhY2goIGluc3RhbmNlID0+IHtcblx0XHRcdFx0XHRpbnN0YW5jZS5kZXN0cm95KCk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdFx0dGlwcHlJbnN0YW5jZXMubGVuZ3RoID0gMDsgLy8gY2xlYXIgaXRcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8vIFRoaW5ncyBhcmUgZG9uZSBiZWZvcmUgdXBkYXRpbmcgdGhlIHByb2R1Y3RzIGxpa2UgaGlkaW5nIHRoZSBsb2FkaW5nIGluZGljYXRvci5cblx0XHRiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzOiBmdW5jdGlvbiggJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSApIHtcblx0XHRcdCRib2R5LmZpbmQoICcud2NhcGYtbG9hZGVyJyApLnJlbW92ZUNsYXNzKCAnaXMtYWN0aXZlJyApO1xuXG5cdFx0XHQvLyBNYXliZSBnb29kIGZvciBwZXJmb3JtYW5jZS5cblx0XHRcdFdDQVBGLmRlc3Ryb3lUaXBweUluc3RhbmNlcygpO1xuXG5cdFx0XHQkZG9jdW1lbnQudHJpZ2dlciggJ3djYXBmX2JlZm9yZV91cGRhdGluZ19wcm9kdWN0cycsIFsgJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSBdICk7XG5cdFx0fSxcblx0XHRhZnRlclVwZGF0aW5nUHJvZHVjdHM6IGZ1bmN0aW9uKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICkge1xuXHRcdFx0V0NBUEYudXBkYXRlUHJvZHVjdHNDb3VudFJlc3VsdCggJHJlc3BvbnNlICk7XG5cblx0XHRcdC8vIFJlaW5pdGlhbGl6ZSB3Y2FwZi5cblx0XHRcdFdDQVBGLmluaXQoKTtcblxuXHRcdFx0aWYgKCAhIGlzUHJvICYmICdhZnRlcicgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X3doZW4gKSB7XG5cdFx0XHRcdFdDQVBGLnNjcm9sbFRvKCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRyaWdnZXIgZXZlbnRzLlxuXHRcdFx0JCggZG9jdW1lbnQgKS50cmlnZ2VyKCAncmVhZHknICk7XG5cdFx0XHQkKCB3aW5kb3cgKS50cmlnZ2VyKCAnc2Nyb2xsJyApO1xuXHRcdFx0JCggd2luZG93ICkudHJpZ2dlciggJ3Jlc2l6ZScgKTtcblxuXHRcdFx0Ly8gQTMgTGF6eSBMb2FkIHN1cHBvcnQuXG5cdFx0XHQkKCB3aW5kb3cgKS50cmlnZ2VyKCAnbGF6eXNob3cnICk7XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmN1c3RvbV9zY3JpcHRzICkge1xuXHRcdFx0XHRldmFsKCB3Y2FwZl9wYXJhbXMuY3VzdG9tX3NjcmlwdHMgKTtcblx0XHRcdH1cblxuXHRcdFx0JGRvY3VtZW50LnRyaWdnZXIoICd3Y2FwZl9hZnRlcl91cGRhdGluZ19wcm9kdWN0cycsIFsgJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSBdICk7XG5cdFx0fSxcblx0XHRmaWx0ZXJQcm9kdWN0czogZnVuY3Rpb24oIHRyaWdnZXJlZEJ5ID0gJ2ZpbHRlcicgKSB7XG5cdFx0XHRXQ0FQRi5iZWZvcmVGZXRjaGluZ1Byb2R1Y3RzKCB0cmlnZ2VyZWRCeSApO1xuXG5cdFx0XHQkLmFqYXgoIHtcblx0XHRcdFx0dXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0XHRcdGNvbnN0ICRyZXNwb25zZSA9ICQoIHJlc3BvbnNlICk7XG5cblx0XHRcdFx0XHRXQ0FQRi5iZWZvcmVVcGRhdGluZ1Byb2R1Y3RzKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICk7XG5cblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBVcGRhdGUgZG9jdW1lbnQgdGl0bGUuXG5cdFx0XHRcdFx0ICpcblx0XHRcdFx0XHQgKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS83NTk5NTYyXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMudXBkYXRlX2RvY3VtZW50X3RpdGxlICkge1xuXHRcdFx0XHRcdFx0ZG9jdW1lbnQudGl0bGUgPSAkcmVzcG9uc2UuZmlsdGVyKCAndGl0bGUnICkudGV4dCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgaW5zdGFuY2VzLlxuXHRcdFx0XHRcdGZvciAoIGNvbnN0IGlkIG9mIGluc3RhbmNlSWRzICkge1xuXHRcdFx0XHRcdFx0Y29uc3QgaW5zdGFuY2VJZCA9ICdbZGF0YS1pZD1cIicgKyBpZCArICdcIl0nO1xuXHRcdFx0XHRcdFx0Y29uc3QgJGluc3RhbmNlICA9ICQoIGluc3RhbmNlSWQgKTtcblx0XHRcdFx0XHRcdGNvbnN0ICRpbm5lciAgICAgPSAkaW5zdGFuY2UuZmluZCggJy53Y2FwZi1maWx0ZXItaW5uZXInICk7XG5cdFx0XHRcdFx0XHRjb25zdCBfaW5zdGFuY2UgID0gJHJlc3BvbnNlLmZpbmQoIGluc3RhbmNlSWQgKTtcblxuXHRcdFx0XHRcdFx0Ly8gUHJlc2VydmUgaGllcmFyY2h5IGFjY29yZGlvbiBzdGF0ZS5cblx0XHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJGluc3RhbmNlLmhhc0NsYXNzKCAnaGFzLWhpZXJhcmNoeS1hY2NvcmRpb24nICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JGluc3RhbmNlLmZpbmQoICcud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCAkZWwgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBpZCAgPSAkZWwuZGF0YSggJ2lkJyApO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCB0b2dnbGVTZWxlY3RvciA9IGAud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGVbZGF0YS1pZD1cIiR7IGlkIH1cIl1gO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGFjY29yZGlvbiBpcyBvcGVuZWRcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIHByZXNzZWQgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCB0b2dnbGVTZWxlY3RvciApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAndHJ1ZScgKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICkuc2hvdygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICdmYWxzZScgKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICkuaGlkZSgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBQcmVzZXJ2ZSBzb2Z0IGxpbWl0IHN0YXRlLlxuXHRcdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucHJlc2VydmVfc29mdF9saW1pdF9zdGF0ZSApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkaW5zdGFuY2UuaGFzQ2xhc3MoICdoYXMtc29mdC1saW1pdCcgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCAkbGlzdFdyYXBwZXIgPSAkaW5zdGFuY2UuZmluZCggJy53Y2FwZi1saXN0LXdyYXBwZXInICk7XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAoICRsaXN0V3JhcHBlci5oYXNDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1saXN0LXdyYXBwZXInICkuYWRkQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJyApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAndHJ1ZScgKTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtbGlzdC13cmFwcGVyJyApLnJlbW92ZUNsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLXNvZnQtbGltaXQtdHJpZ2dlcicgKS5hdHRyKCAnYXJpYS1wcmVzc2VkJywgJ2ZhbHNlJyApO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRjb25zdCBfaHRtbCA9IF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLWZpbHRlci1pbm5lcicgKS5odG1sKCk7XG5cblx0XHRcdFx0XHRcdC8vIEZpbmFsbHkgdXBkYXRlIHRoZSBpbnN0YW5jZS5cblx0XHRcdFx0XHRcdCRpbm5lci5odG1sKCBfaHRtbCApO1xuXG5cdFx0XHRcdFx0XHQvLyBSZW1vdmUgc2VhcmNoLWFjdGl2ZSBmcm9tIGFueSBzZWFyY2ggYm94IHdob3NlIGlucHV0IGlzIG5vdyBlbXB0eS5cblx0XHRcdFx0XHRcdCRpbnN0YW5jZS5maW5kKCAnLndjYXBmLXNlYXJjaC1ib3gud2l0aC1jcm9zcyBpbnB1dFt0eXBlPVwidGV4dFwiXScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAhICQoIHRoaXMgKS52YWwoKSApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXInICkucmVtb3ZlQ2xhc3MoICdzZWFyY2gtYWN0aXZlJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0XHRcdCRpbnN0YW5jZS50cmlnZ2VyKCAnd2NhcGYtZmlsdGVyLXVwZGF0ZWQnLCBbIF9pbnN0YW5jZSBdICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBhY3RpdmUgZmlsdGVycyBhbmQgcmVzZXQgZmlsdGVycy5cblx0XHRcdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLWFjdGl2ZS1maWx0ZXJzLCAud2NhcGYtcmVzZXQtZmlsdGVycycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGNvbnN0ICR0aGF0ICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0XHRjb25zdCBpbnN0YW5jZUlkID0gJ1tkYXRhLWlkPVwiJyArICR0aGF0LmRhdGEoICdpZCcgKSArICdcIl0nO1xuXG5cdFx0XHRcdFx0XHQkdGhhdC5odG1sKCAkcmVzcG9uc2UuZmluZCggaW5zdGFuY2VJZCApLmh0bWwoKSApO1xuXHRcdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRcdC8vIFJlcGxhY2Ugb2xkIHNob3AgbG9vcCB3aXRoIG5ldyBvbmUuXG5cdFx0XHRcdFx0Y29uc3QgJHNob3BMb29wQ29udGFpbmVyID0gJHJlc3BvbnNlLmZpbmQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRcdFx0Y29uc3QgJG5vdEZvdW5kQ29udGFpbmVyID0gJHJlc3BvbnNlLmZpbmQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICk7XG5cblx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyID09PSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRXQ0FQRi5hZnRlclVwZGF0aW5nUHJvZHVjdHMoICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0cmVxdWVzdEZpbHRlcjogZnVuY3Rpb24oIHVybCwgdHJpZ2dlcmVkQnkgPSAnZmlsdGVyJyApIHtcblx0XHRcdGlmICggISB1cmwgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZGlzYWJsZV9hamF4ICkge1xuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IHVybDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7IHdjYXBmOiB0cnVlIH0sICcnLCB1cmwgKTtcblxuXHRcdFx0XHRXQ0FQRi5maWx0ZXJQcm9kdWN0cyggdHJpZ2dlcmVkQnkgKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGhhbmRsZU51bWJlcklucHV0RmlsdGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCByYW5nZU51bWJlclNlbGVjdG9ycyA9ICcud2NhcGYtcmFuZ2UtbnVtYmVyIC5taW4tdmFsdWUsIC53Y2FwZi1yYW5nZS1udW1iZXIgLm1heC12YWx1ZSc7XG5cblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgcmFuZ2VOdW1iZXJTZWxlY3RvcnMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRjb25zdCAkcmFuZ2VOdW1iZXIgICAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtcmFuZ2UtbnVtYmVyJyApO1xuXHRcdFx0XHRjb25zdCBmb3JtYXROdW1iZXJzICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1mb3JtYXQtbnVtYmVycycgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBvbGRNaW5WYWx1ZSAgICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgb2xkTWF4VmFsdWUgICAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWRlY2ltYWwtcGxhY2VzJyApO1xuXHRcdFx0XHRjb25zdCB0aG91c2FuZFNlcGFyYXRvciA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS10aG91c2FuZC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXG5cdFx0XHRcdGNvbnN0IGdldFZhbHVlID0gKCBmbG9hdFZhbHVlICkgPT4ge1xuXHRcdFx0XHRcdGlmICggZm9ybWF0TnVtYmVycyApIHtcblx0XHRcdFx0XHRcdHJldHVybiBudW1iZXJGb3JtYXQoIGZsb2F0VmFsdWUsIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIGZsb2F0VmFsdWU7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0bGV0IG1pblZhbHVlID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCgpICk7XG5cdFx0XHRcdGxldCBtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoKSApO1xuXG5cdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRcdGlmICggaXNOYU4oIG1pblZhbHVlICkgKSB7XG5cdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdFx0aWYgKCBpc05hTiggbWF4VmFsdWUgKSApIHtcblx0XHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSByYW5nZU1pblZhbHVlLlxuXHRcdFx0XHRpZiAoIG1pblZhbHVlIDwgcmFuZ2VNaW5WYWx1ZSApIHtcblx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA+IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRcdGlmICggbWF4VmFsdWUgPiByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSBtaW5WYWx1ZS5cblx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA+IG1heFZhbHVlICkge1xuXHRcdFx0XHRcdG1heFZhbHVlID0gbWluVmFsdWU7XG5cblx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSWYgdmFsdWUgaXMgbm90IGNoYW5nZWQgdGhlbiBkb24ndCBwcm9jZWVkLlxuXHRcdFx0XHRpZiAoIG1pblZhbHVlID09PSBvbGRNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gb2xkTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHQvLyBSZW1vdmUgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICRyYW5nZU51bWJlci5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIEFkZCByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0Y29uc3QgdXJsID0gJHJhbmdlTnVtYmVyLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIG1pblZhbHVlICkucmVwbGFjZSggJyUycycsIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0JGJvZHkub24oICdrZXlkb3duJywgcmFuZ2VOdW1iZXJTZWxlY3RvcnMsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRpZiAoICdFbnRlcicgPT09IGUua2V5ICkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVEYXRlSW5wdXRGaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgJy53Y2FwZi1kYXRlLWlucHV0IC5kYXRlLWlucHV0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWx0ZXIgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXHRcdFx0XHRjb25zdCBpc1JhbmdlID0gJGZpbHRlci5kYXRhKCAnaXMtcmFuZ2UnICk7XG5cblx0XHRcdFx0bGV0IGZpbHRlclVybCA9ICcnO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRmaWx0ZXIuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0aWYgKCBpc1JhbmdlICkge1xuXHRcdFx0XHRcdGNvbnN0IGZyb20gPSAkZmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApLnZhbCgpO1xuXHRcdFx0XHRcdGNvbnN0IHRvICAgPSAkZmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKS52YWwoKTtcblxuXHRcdFx0XHRcdGlmICggZnJvbSAmJiB0byApIHtcblx0XHRcdFx0XHRcdGZpbHRlclVybCA9ICRmaWx0ZXIuZGF0YSggJ3VybCcgKS5yZXBsYWNlKCAnJTFzJywgZnJvbSApLnJlcGxhY2UoICclMnMnLCB0byApO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoICEgZnJvbSAmJiAhIHRvICkge1xuXHRcdFx0XHRcdFx0ZmlsdGVyVXJsID0gJGZpbHRlci5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc3QgZnJvbSA9ICRmaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICkudmFsKCk7XG5cblx0XHRcdFx0XHRpZiAoIGZyb20gKSB7XG5cdFx0XHRcdFx0XHRmaWx0ZXJVcmwgPSAkZmlsdGVyLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyVzJywgZnJvbSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRmaWx0ZXJVcmwgPSAkZmlsdGVyLmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggZmlsdGVyVXJsICkge1xuXHRcdFx0XHRcdCRmaWx0ZXIuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkZmlsdGVyLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggZmlsdGVyVXJsICk7XG5cdFx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVMaXN0RmlsdGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCBuYXRpdmVJbnB1dHMgPSAnLmxpc3QtdHlwZS1uYXRpdmUgW3R5cGU9XCJjaGVja2JveFwiXSwnICtcblx0XHRcdFx0Jy5saXN0LXR5cGUtbmF0aXZlIFt0eXBlPVwicmFkaW9cIl0sJyArXG5cdFx0XHRcdCcubGlzdC10eXBlLWN1c3RvbS1jaGVja2JveCBbdHlwZT1cImNoZWNrYm94XCJdJztcblxuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCBuYXRpdmVJbnB1dHMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXItaXRlbScgKS50b2dnbGVDbGFzcyggJ2l0ZW0tYWN0aXZlJyApO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5kYXRhKCAndXJsJyApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGNvbnN0IGN1c3RvbVJhZGlvU2VsZWN0b3IgPSAnLmxpc3QtdHlwZS1jdXN0b20tcmFkaW8nO1xuXG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsIGN1c3RvbVJhZGlvU2VsZWN0b3IgKyAnIFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyLWl0ZW0nICkudG9nZ2xlQ2xhc3MoICdpdGVtLWFjdGl2ZScgKTtcblxuXHRcdFx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTgzOTkyNFxuXHRcdFx0XHQkKCB0aGlzIClcblx0XHRcdFx0XHQuY2xvc2VzdCggY3VzdG9tUmFkaW9TZWxlY3RvciApXG5cdFx0XHRcdFx0LmZpbmQoICcud2NhcGYtZmlsdGVyLWl0ZW0uaXRlbS1hY3RpdmUgW3R5cGU9XCJjaGVja2JveFwiXScgKVxuXHRcdFx0XHRcdC5ub3QoIHRoaXMgKVxuXHRcdFx0XHRcdC5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlIClcblx0XHRcdFx0XHQuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXItaXRlbScgKVxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcyggJ2l0ZW0tYWN0aXZlJyApO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5kYXRhKCAndXJsJyApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVEcm9wZG93bkZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCAnLndjYXBmLWRyb3Bkb3duLXdyYXBwZXIgc2VsZWN0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRzZWxlY3QgICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCB2YWx1ZXMgICAgICAgICA9ICRzZWxlY3QudmFsKCk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlclVSTCAgICAgID0gJHNlbGVjdC5kYXRhKCAndXJsJyApO1xuXHRcdFx0XHRjb25zdCBjbGVhckZpbHRlclVSTCA9ICRzZWxlY3QuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICk7XG5cdFx0XHRcdGxldCB1cmw7XG5cblx0XHRcdFx0aWYgKCB2YWx1ZXMubGVuZ3RoICkge1xuXHRcdFx0XHRcdHVybCA9IGZpbHRlclVSTC5yZXBsYWNlKCAnJXMnLCB2YWx1ZXMudG9TdHJpbmcoKSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHVybCA9IGNsZWFyRmlsdGVyVVJMO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVQYWdpbmF0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4ICYmIHdjYXBmX3BhcmFtcy5wYWdpbmF0aW9uX2NvbnRhaW5lciApIHtcblx0XHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRcdGNvbnN0IF9zZWxlY3RvcnMgPSB3Y2FwZl9wYXJhbXMucGFnaW5hdGlvbl9jb250YWluZXIuc3BsaXQoICcsJyApO1xuXHRcdFx0XHRjb25zdCBzZWxlY3RvcnMgID0gW107XG5cblx0XHRcdFx0X3NlbGVjdG9ycy5mb3JFYWNoKCBzZWxlY3RvciA9PiB7XG5cdFx0XHRcdFx0aWYgKCBzZWxlY3RvciApIHtcblx0XHRcdFx0XHRcdHNlbGVjdG9ycy5wdXNoKCBzZWxlY3RvciArICcgYScgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRjb25zdCBzZWxlY3RvciA9IHNlbGVjdG9ycy5qb2luKCAnLCcgKTtcblxuXHRcdFx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdCRjb250YWluZXIub24oICdjbGljaycsIHNlbGVjdG9yLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgaHJlZiA9ICQoIHRoaXMgKS5hdHRyKCAnaHJlZicgKTtcblxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggaHJlZiwgJ3BhZ2luYXRlJyApO1xuXHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aGFuZGxlRGVmYXVsdE9yZGVyYnk6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5zb3J0aW5nX2NvbnRyb2wgKSB7XG5cdFx0XHRcdC8vIFN1Ym1pdCB0aGUgb3JkZXJieSBmb3JtIHdoZW4gdmFsdWUgaXMgY2hhbmdlZC5cblx0XHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCBkZWZhdWx0T3JkZXJCeUVsZW1lbnQsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5jbG9zZXN0KCAnZm9ybScgKS50cmlnZ2VyKCAnc3VibWl0JyApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBQcmV2ZW50IHRoZSBhdXRvIHN1Ym1pc3Npb24gb2YgdGhlIG9yZGVyYnkgZm9ybS5cblx0XHRcdCRib2R5Lm9uKCAnc3VibWl0Jywgd2NhcGZfcGFyYW1zLm9yZGVyYnlfZm9ybSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCB2aWEgYWpheCB3aGVuIHRoZSBvcmRlcmJ5IHZhbHVlIGlzIGNoYW5nZWQuXG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsIGRlZmF1bHRPcmRlckJ5RWxlbWVudCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0IG9yZGVyID0gJCggdGhpcyApLnZhbCgpO1xuXG5cdFx0XHRcdGNvbnN0IHVybCA9IG5ldyBVUkwoIHdpbmRvdy5sb2NhdGlvbiApO1xuXHRcdFx0XHR1cmwuc2VhcmNoUGFyYW1zLnNldCggJ29yZGVyYnknLCBvcmRlciApO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIGdldE9yZGVyQnlVcmwoIHVybC5ocmVmICkgKTtcblxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVDbGVhckZpbHRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHQkYm9keS5vbiggJ2NsaWNrJywgJy53Y2FwZi1maWx0ZXItY2xlYXItYnRuJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJCggdGhpcyApLmF0dHIoICdkYXRhLWNsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZUZpbHRlclRvb2x0aXA6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZFJlZmVyZW5jZVxuXHRcdFx0aWYgKCAnZnVuY3Rpb24nICE9PSB0eXBlb2YgdGlwcHkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy51c2VfdGlwcHlqcyApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkUmVmZXJlbmNlXG5cdFx0XHR0aXBweSggJy53Y2FwZi1maWx0ZXItdG9vbHRpcCcsIHtcblx0XHRcdFx0cGxhY2VtZW50OiAndG9wJyxcblx0XHRcdFx0Y29udGVudCggcmVmZXJlbmNlICkge1xuXHRcdFx0XHRcdHJldHVybiByZWZlcmVuY2UuZ2V0QXR0cmlidXRlKCAnZGF0YS1jb250ZW50JyApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRhbGxvd0hUTUw6IHRydWUsXG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRpbml0Q29tYm9ib3g6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAhIGpRdWVyeSgpLmNob3NlbldDQVBGICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHRlbXBsYXRlUmVzdWx0ID0gKCB0ZXh0LCBkYXRhICkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdCc8c3Bhbj4nICsgdGV4dCArICc8L3NwYW4+Jyxcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJ3Y2FwZi1jb3VudFwiPicgKyBkYXRhWyAnY291bnRNYXJrdXAnIF0gKyAnPC9zcGFuPicsXG5cdFx0XHRcdF0uam9pbiggJycgKTtcblx0XHRcdH07XG5cblx0XHRcdGNvbnN0IHRlbXBsYXRlU2VsZWN0aW9uID0gKCB0ZXh0LCBkYXRhICkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cIndjYXBmLWNvdW50LScgKyBkYXRhLmNvdW50ICsgJ1wiPicgKyB0ZXh0ICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cIndjYXBmLWNvdW50IHdjYXBmLWNvdW50LScgKyBkYXRhLmNvdW50ICsgJ1wiPicgKyBkYXRhWyAnY291bnRNYXJrdXAnIF0gKyAnPC9zcGFuPicsXG5cdFx0XHRcdF0uam9pbiggJycgKTtcblx0XHRcdH07XG5cblx0XHRcdGNvbnN0IGRlZmF1bHRzID0ge1xuXHRcdFx0XHRpbmhlcml0X3NlbGVjdF9jbGFzc2VzOiB0cnVlLFxuXHRcdFx0XHRpbmhlcml0X29wdGlvbl9jbGFzc2VzOiB0cnVlLFxuXHRcdFx0XHRub19yZXN1bHRzX3RleHQ6IHdjYXBmX3BhcmFtcy5jb21ib2JveF9ub19yZXN1bHRzX3RleHQsXG5cdFx0XHRcdG9wdGlvbnNfbm9uZV90ZXh0OiB3Y2FwZl9wYXJhbXMuY29tYm9ib3hfb3B0aW9uc19ub25lX3RleHQsXG5cdFx0XHRcdHNlYXJjaF9jb250YWluczogdHJ1ZSwgLy8gTWF0Y2ggZnJvbSBhbnl3aGVyZSBpbiBzdHJpbmcuXG5cdFx0XHRcdHNlYXJjaF9pbl92YWx1ZXM6IHRydWUsIC8vIFNlYXJjaCBpbiB2YWx1ZXMgYWxzby5cblx0XHRcdH07XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmlzX3J0bCApIHtcblx0XHRcdFx0ZGVmYXVsdHNbICdydGwnIF0gPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLWNob3NlbicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRoaXMgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHsgLi4uZGVmYXVsdHMgfTtcblxuXHRcdFx0XHQvLyBJZiBoaWVyYXJjaHkgZW5hYmxlZCB0aGVuIHdlIHNob3cgdGhlIHNlbGVjdGVkIG9wdGlvbnMuXG5cdFx0XHRcdGlmICggJHRoaXMuaGFzQ2xhc3MoICdoYXMtaGllcmFyY2h5JyApICkge1xuXHRcdFx0XHRcdG9wdGlvbnNbICdkaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMnIF0gPSB0cnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG9wdGlvbnNbICdkaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMnIF0gPSB3Y2FwZl9wYXJhbXMuY29tYm9ib3hfZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gRW5hYmxlIHRlbXBsYXRpbmcgd2hlbiBzaG93aW5nIGNvdW50LlxuXHRcdFx0XHRpZiAoICR0aGlzLmhhc0NsYXNzKCAnd2l0aC1jb3VudCcgKSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAndGVtcGxhdGVSZXN1bHQnIF0gICAgPSB0ZW1wbGF0ZVJlc3VsdDtcblx0XHRcdFx0XHRvcHRpb25zWyAndGVtcGxhdGVTZWxlY3Rpb24nIF0gPSB0ZW1wbGF0ZVNlbGVjdGlvbjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIERpc2FibGUgc2VhcmNoIGJveC5cblx0XHRcdFx0aWYgKCAhICR0aGlzLmRhdGEoICdlbmFibGUtc2VhcmNoJyApICkge1xuXHRcdFx0XHRcdG9wdGlvbnNbICdkaXNhYmxlX3NlYXJjaCcgXSA9IHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkdGhpcy5jaG9zZW5XQ0FQRiggb3B0aW9ucyApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBBdHRhY2ggY2hvc2VuIGZvciBkZWZhdWx0IG9yZGVyYnkuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5hdHRhY2hfY29tYm9ib3hfb25fc29ydGluZyApIHtcblx0XHRcdFx0bGV0IGRpc2FibGVTZWFyY2ggPSB0cnVlO1xuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnNlYXJjaF9ib3hfaW5fZGVmYXVsdF9vcmRlcmJ5ICkge1xuXHRcdFx0XHRcdGRpc2FibGVTZWFyY2ggPSBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7IC4uLmRlZmF1bHRzIH07XG5cblx0XHRcdFx0b3B0aW9uc1sgJ2Rpc2FibGVfc2VhcmNoJyBdID0gZGlzYWJsZVNlYXJjaDtcblxuXHRcdFx0XHQkYm9keS5maW5kKCBkZWZhdWx0T3JkZXJCeUVsZW1lbnQgKS5jaG9zZW5XQ0FQRiggb3B0aW9ucyApO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aW5pdFJhbmdlU2xpZGVyOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCRib2R5LmZpbmQoICcud2NhcGYtcmFuZ2Utc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkaXRlbSAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCAkc2xpZGVyID0gJGl0ZW0uZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKTtcblxuXHRcdFx0XHRjb25zdCBzbGlkZXJJZCAgICAgICAgICA9ICRzbGlkZXIuYXR0ciggJ2lkJyApO1xuXHRcdFx0XHRjb25zdCBkaXNwbGF5VmFsdWVzQXMgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRpc3BsYXktdmFsdWVzLWFzJyApO1xuXHRcdFx0XHRjb25zdCBmb3JtYXROdW1iZXJzICAgICA9ICRpdGVtLmF0dHIoICdkYXRhLWZvcm1hdC1udW1iZXJzJyApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1pblZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBzdGVwICAgICAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXN0ZXAnICkgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFBsYWNlcyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRcdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkaXRlbS5hdHRyKCAnZGF0YS10aG91c2FuZC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IG1pblZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IG1heFZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0ICRtaW5WYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5taW4tdmFsdWUnICk7XG5cdFx0XHRcdGNvbnN0ICRtYXhWYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5tYXgtdmFsdWUnICk7XG5cblx0XHRcdFx0Y29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIHNsaWRlcklkICk7XG5cblx0XHRcdFx0Y29uc3Qgc2FmZVN0ZXAgPSBpc05hTiggc3RlcCApIHx8IHN0ZXAgPD0gMCA/IDEgOiBzdGVwO1xuXG5cdFx0XHRcdG5vVWlTbGlkZXIuY3JlYXRlKCBzbGlkZXIsIHtcblx0XHRcdFx0XHRzdGFydDogWyBtaW5WYWx1ZSwgbWF4VmFsdWUgXSxcblx0XHRcdFx0XHRzdGVwOiBzYWZlU3RlcCxcblx0XHRcdFx0XHRjb25uZWN0OiB0cnVlLFxuXHRcdFx0XHRcdGNzc1ByZWZpeDogJ3djYXBmLW5vdWktJyxcblx0XHRcdFx0XHRyYW5nZToge1xuXHRcdFx0XHRcdFx0J21pbic6IHJhbmdlTWluVmFsdWUsXG5cdFx0XHRcdFx0XHQnbWF4JzogcmFuZ2VNaW5WYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSA/IHJhbmdlTWluVmFsdWUgKyBzYWZlU3RlcCA6IHJhbmdlTWF4VmFsdWUsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICd1cGRhdGUnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHRcdGxldCBtaW5WYWx1ZTtcblx0XHRcdFx0XHRsZXQgbWF4VmFsdWU7XG5cblx0XHRcdFx0XHRpZiAoIGZvcm1hdE51bWJlcnMgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IG51bWJlckZvcm1hdCggdmFsdWVzWyAwIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IG51bWJlckZvcm1hdCggdmFsdWVzWyAxIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAwIF0gKTtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoICdwbGFpbl90ZXh0JyA9PT0gZGlzcGxheVZhbHVlc0FzICkge1xuXHRcdFx0XHRcdFx0JG1pblZhbHVlLmh0bWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0XHQkbWF4VmFsdWUuaHRtbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JG1pblZhbHVlLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHRcdCRtYXhWYWx1ZS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICkge1xuXHRcdFx0XHRcdGNvbnN0IF9taW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0Y29uc3QgX21heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblxuXHRcdFx0XHRcdC8vIElmIHZhbHVlIGlzIG5vdCBjaGFuZ2VkIHRoZW4gZG9uJ3QgcHJvY2VlZC5cblx0XHRcdFx0XHRpZiAoIF9taW5WYWx1ZSA9PT0gbWluVmFsdWUgJiYgX21heFZhbHVlID09PSBtYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIF9taW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBfbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHQvLyBSZW1vdmUgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJGl0ZW0uZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdGNvbnN0IHVybCA9ICRpdGVtLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIF9taW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBfbWF4VmFsdWUgKTtcblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCBpc0RyYWdnaW5nID0gZmFsc2U7XG5cblx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICdzdGFydCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlzRHJhZ2dpbmcgPSB0cnVlO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICdlbmQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRpc0RyYWdnaW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHRpZiAoIGlzRHJhZ2dpbmcgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gS2V5Ym9hcmQgaW50ZXJhY3Rpb24g4oCUIGRlYm91bmNlIHRvIGF2b2lkIGEgcmVxdWVzdCBvbiBldmVyeSBrZXkgcHJlc3MuXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICk7XG5cdFx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0JG1pblZhbHVlLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgdmFsID0gcGFyc2VGbG9hdCggJCggdGhpcyApLnZhbCgpICk7XG5cdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIGlzTmFOKCB2YWwgKSA/IHJhbmdlTWluVmFsdWUgOiB2YWwsIG51bGwgXSApO1xuXHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkbWluVmFsdWUub24oICdrZXlkb3duJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0aWYgKCAnRW50ZXInID09PSBlLmtleSApIHtcblx0XHRcdFx0XHRcdCQoIHRoaXMgKS50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtYXhWYWx1ZS5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0IHZhbCA9IHBhcnNlRmxvYXQoICQoIHRoaXMgKS52YWwoKSApO1xuXHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBudWxsLCBpc05hTiggdmFsICkgPyByYW5nZU1heFZhbHVlIDogdmFsIF0gKTtcblx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0JG1heFZhbHVlLm9uKCAna2V5ZG93bicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdGlmICggJ0VudGVyJyA9PT0gZS5rZXkgKSB7XG5cdFx0XHRcdFx0XHQkKCB0aGlzICkudHJpZ2dlciggJ2NoYW5nZScgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXREYXRlcGlja2VyOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggISBqUXVlcnkoKS5kYXRlcGlja2VyICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0ICR3Y2FwZkRhdGVGaWx0ZXIgPSAkYm9keS5maW5kKCAnLndjYXBmLWRhdGUtaW5wdXQnICk7XG5cblx0XHRcdGNvbnN0IGZvcm1hdCAgICAgICAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtZm9ybWF0JyApO1xuXHRcdFx0Y29uc3QgeWVhckRyb3Bkb3duICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1waWNrZXIteWVhci1kcm9wZG93bicgKTtcblx0XHRcdGNvbnN0IG1vbnRoRHJvcGRvd24gPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtcGlja2VyLW1vbnRoLWRyb3Bkb3duJyApO1xuXG5cdFx0XHRjb25zdCAkZnJvbSA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICk7XG5cdFx0XHRjb25zdCAkdG8gICA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLXRvLWlucHV0JyApO1xuXG5cdFx0XHQkZnJvbS5kYXRlcGlja2VyKCB7XG5cdFx0XHRcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdFx0Y2hhbmdlWWVhcjogeWVhckRyb3Bkb3duLFxuXHRcdFx0XHRjaGFuZ2VNb250aDogbW9udGhEcm9wZG93bixcblx0XHRcdH0gKTtcblxuXHRcdFx0JHRvLmRhdGVwaWNrZXIoIHtcblx0XHRcdFx0ZGF0ZUZvcm1hdDogZm9ybWF0LFxuXHRcdFx0XHRjaGFuZ2VZZWFyOiB5ZWFyRHJvcGRvd24sXG5cdFx0XHRcdGNoYW5nZU1vbnRoOiBtb250aERyb3Bkb3duLFxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aW5pdEZpbHRlck9wdGlvblRvb2x0aXA6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZFJlZmVyZW5jZVxuXHRcdFx0aWYgKCAnZnVuY3Rpb24nICE9PSB0eXBlb2YgdGlwcHkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy51c2VfdGlwcHlqcyApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB0b29sdGlwUG9zaXRpb25zID0gWyAndG9wJywgJ3JpZ2h0JywgJ2JvdHRvbScsICdsZWZ0JyBdO1xuXG5cdFx0XHR0b29sdGlwUG9zaXRpb25zLmZvckVhY2goIGZ1bmN0aW9uKCB0b29sdGlwUG9zaXRpb24gKSB7XG5cdFx0XHRcdGNvbnN0IGlkZW50aWZpZXIgPSAnZGF0YS13Y2FwZi10b29sdGlwLScgKyB0b29sdGlwUG9zaXRpb247XG5cblx0XHRcdFx0Ly8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZFJlZmVyZW5jZVxuXHRcdFx0XHRjb25zdCBpbnN0YW5jZXMgPSB0aXBweSggJ1snICsgaWRlbnRpZmllciArICddJywge1xuXHRcdFx0XHRcdHBsYWNlbWVudDogdG9vbHRpcFBvc2l0aW9uLFxuXHRcdFx0XHRcdGNvbnRlbnQoIHJlZmVyZW5jZSApIHtcblx0XHRcdFx0XHRcdHJldHVybiByZWZlcmVuY2UuZ2V0QXR0cmlidXRlKCBpZGVudGlmaWVyICk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRhbGxvd0hUTUw6IHRydWUsXG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHR3aW5kb3cudGlwcHlJbnN0YW5jZXMgPSB0aXBweUluc3RhbmNlcy5jb25jYXQoIGluc3RhbmNlcyApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRXQ0FQRi5pbml0Q29tYm9ib3goKTtcblx0XHRcdFdDQVBGLmluaXRSYW5nZVNsaWRlcigpO1xuXHRcdFx0V0NBUEYuaW5pdERhdGVwaWNrZXIoKTtcblx0XHRcdFdDQVBGLmluaXRGaWx0ZXJPcHRpb25Ub29sdGlwKCk7XG5cdFx0fSxcblx0XHRoYW5kbGVGb3JtU3VibWl0OiBmdW5jdGlvbigpIHtcblx0XHRcdCRib2R5Lm9uKCAnc3VibWl0JywgJy53Y2FwZi1mb3JtJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXRQb3BTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5yZWxvYWRfb25fYmFjayAmJiB3Y2FwZl9wYXJhbXMuZm91bmRfd2NhcGYgKSB7XG5cdFx0XHRcdGhpc3RvcnkucmVwbGFjZVN0YXRlKCB7IHdjYXBmOiB0cnVlIH0sICcnLCB3aW5kb3cubG9jYXRpb24gKTtcblxuXHRcdFx0XHQvLyBIYW5kbGUgdGhlIHBvcHN0YXRlIGV2ZW50KGJyb3dzZXIncyBiYWNrL2ZvcndhcmQpXG5cdFx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAncG9wc3RhdGUnLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRpZiAoIG51bGwgIT09IGUuc3RhdGUgJiYgZS5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSggJ3djYXBmJyApICkge1xuXHRcdFx0XHRcdFx0V0NBUEYuZmlsdGVyUHJvZHVjdHMoICdwb3BzdGF0ZScgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIEVuYWJsZSBpdCBpZiBuZWNlc3NhcnkuXG5cdCAqXG5cdCAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzMzMDA0OTE3XG5cdCAqL1xuXHRpZiAoICdzY3JvbGxSZXN0b3JhdGlvbicgaW4gaGlzdG9yeSApIHtcblx0XHQvLyBoaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uID0gJ21hbnVhbCc7XG5cdH1cblxufSggalF1ZXJ5LCB3aW5kb3cgKSApO1xuXG4oIGZ1bmN0aW9uKCAkLCBXQ0FQRiApIHtcblxuXHRXQ0FQRi5pbml0KCk7XG5cdFdDQVBGLmluaXRQb3BTdGF0ZSgpO1xuXG5cdFdDQVBGLmhhbmRsZUZpbHRlckFjY29yZGlvbigpO1xuXHRXQ0FQRi5oYW5kbGVIaWVyYXJjaHlUb2dnbGUoKTtcblx0V0NBUEYuaGFuZGxlU29mdExpbWl0KCk7XG5cdFdDQVBGLmhhbmRsZVNlYXJjaEZpbHRlck9wdGlvbnMoKTtcblxuXHRXQ0FQRi5oYW5kbGVMaXN0RmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVEcm9wZG93bkZpbHRlcnMoKTtcblx0V0NBUEYuaGFuZGxlTnVtYmVySW5wdXRGaWx0ZXJzKCk7XG5cdFdDQVBGLmhhbmRsZURhdGVJbnB1dEZpbHRlcnMoKTtcblx0V0NBUEYuaGFuZGxlUGFnaW5hdGlvbigpO1xuXHRXQ0FQRi5oYW5kbGVEZWZhdWx0T3JkZXJieSgpO1xuXG5cdFdDQVBGLmhhbmRsZUNsZWFyRmlsdGVyKCk7XG5cblx0V0NBUEYuaGFuZGxlRmlsdGVyVG9vbHRpcCgpO1xuXG5cdFdDQVBGLmhhbmRsZUZvcm1TdWJtaXQoKTtcblxuXHQvKipcblx0ICogTWFrZSBpdCBjb21wYXRpYmxlIHdpdGggb3RoZXIgcGx1Z2lucy5cblx0ICovXG5cdCQoIGRvY3VtZW50ICkub24oICd3Y2FwZl9hZnRlcl91cGRhdGluZ19wcm9kdWN0cycsIGZ1bmN0aW9uKCkge1xuXHRcdC8vIHdvby12YXJpYXRpb24tc3dhdGNoZXNcblx0XHQkKCBkb2N1bWVudCApLnRyaWdnZXIoICd3b29fdmFyaWF0aW9uX3N3YXRjaGVzX3Byb19pbml0JyApO1xuXHR9ICk7XG5cbn0oIGpRdWVyeSwgd2luZG93LldDQVBGICkgKTtcbiIsIi8qKlxuICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzQxNDE4MTNcbiAqXG4gKiBAcGFyYW0gbnVtYmVyXG4gKiBAcGFyYW0gZGVjaW1hbHNcbiAqIEBwYXJhbSBkZWNfcG9pbnRcbiAqIEBwYXJhbSB0aG91c2FuZHNfc2VwXG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gbnVtYmVyRm9ybWF0KCBudW1iZXIsIGRlY2ltYWxzLCBkZWNfcG9pbnQsIHRob3VzYW5kc19zZXAgKSB7XG5cdC8vIFN0cmlwIGFsbCBjaGFyYWN0ZXJzIGJ1dCBudW1lcmljYWwgb25lcy5cblx0bnVtYmVyID0gKCBudW1iZXIgKyAnJyApLnJlcGxhY2UoIC9bXlxcZCtcXC1FZS5dL2csICcnICk7XG5cblx0Y29uc3QgbiAgICA9ICEgaXNGaW5pdGUoICtudW1iZXIgKSA/IDAgOiArbnVtYmVyO1xuXHRjb25zdCBwcmVjID0gISBpc0Zpbml0ZSggK2RlY2ltYWxzICkgPyAwIDogTWF0aC5hYnMoIGRlY2ltYWxzICk7XG5cdGNvbnN0IHNlcCAgPSAoIHR5cGVvZiB0aG91c2FuZHNfc2VwID09PSAndW5kZWZpbmVkJyApID8gJywnIDogdGhvdXNhbmRzX3NlcDtcblx0Y29uc3QgZGVjICA9ICggdHlwZW9mIGRlY19wb2ludCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcuJyA6IGRlY19wb2ludDtcblxuXHRsZXQgcztcblxuXHRjb25zdCB0b0ZpeGVkRml4ID0gZnVuY3Rpb24oIG4sIHByZWMgKSB7XG5cdFx0Y29uc3QgayA9IE1hdGgucG93KCAxMCwgcHJlYyApO1xuXHRcdHJldHVybiAnJyArIE1hdGgucm91bmQoIG4gKiBrICkgLyBrO1xuXHR9O1xuXG5cdC8vIEZpeCBmb3IgSUUgcGFyc2VGbG9hdCgwLjU1KS50b0ZpeGVkKDApID0gMDtcblx0cyA9ICggcHJlYyA/IHRvRml4ZWRGaXgoIG4sIHByZWMgKSA6ICcnICsgTWF0aC5yb3VuZCggbiApICkuc3BsaXQoICcuJyApO1xuXG5cdGlmICggc1sgMCBdLmxlbmd0aCA+IDMgKSB7XG5cdFx0c1sgMCBdID0gc1sgMCBdLnJlcGxhY2UoIC9cXEIoPz0oPzpcXGR7M30pKyg/IVxcZCkpL2csIHNlcCApO1xuXHR9XG5cblx0aWYgKCAoIHNbIDEgXSB8fCAnJyApLmxlbmd0aCA8IHByZWMgKSB7XG5cdFx0c1sgMSBdID0gc1sgMSBdIHx8ICcnO1xuXHRcdHNbIDEgXSArPSBuZXcgQXJyYXkoIHByZWMgLSBzWyAxIF0ubGVuZ3RoICsgMSApLmpvaW4oICcwJyApO1xuXHR9XG5cblx0cmV0dXJuIHMuam9pbiggZGVjICk7XG59XG5cbmZ1bmN0aW9uIGNsZWFuVXJsKCB1cmwgKSB7XG5cdHJldHVybiB1cmwucmVwbGFjZSggLyUyQy9nLCAnLCcgKTtcbn1cblxuZnVuY3Rpb24gZ2V0T3JkZXJCeVVybCggdXJsICkge1xuXHRjb25zdCBwYWdlZCA9IHBhcnNlSW50KCB1cmwucmVwbGFjZSggLy4rXFwvcGFnZVxcLyhcXGQrKSsvLCAnJDEnICkgKTtcblxuXHRpZiAoIHBhZ2VkICkge1xuXHRcdHVybCA9IHVybC5yZXBsYWNlKCAvcGFnZVxcLyhcXGQrKVxcLy8sICcnICk7XG5cdH1cblxuXHRyZXR1cm4gY2xlYW5VcmwoIHVybCApO1xufVxuIl19
