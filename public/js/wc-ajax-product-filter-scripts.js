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
  var _keywordFilterDelay = parseInt(wcapf_params.keyword_filter_delay);
  var keywordFilterDelay = _keywordFilterDelay >= 0 ? _keywordFilterDelay : 100;
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
        if ($filter.hasClass('wcapf-filter-keyword')) {
          $input.trigger('change');
        } else {
          $input.trigger('input');
        }
      });
      $body.on('change', '.wcapf-filter-keyword input[type="text"]', function () {
        var $that = $(this);
        var $wrapper = $that.closest('.wcapf-keyword-filter-wrapper');
        var keyword = $that.val();

        // Clear any previously set timer before setting a fresh one
        clearTimeout($that.data('timer'));
        var filterURL = $wrapper.data('filter-url');
        var clearFilterURL = $wrapper.data('clear-filter-url');
        var url;
        if (keyword.length) {
          url = filterURL.replace('%s', keyword);
        } else {
          url = clearFilterURL;
        }
        $that.data('timer', setTimeout(function () {
          WCAPF.requestFilter(url);
        }, keywordFilterDelay));
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
        var decimalSeparator = $rangeNumber.attr('data-decimal-separator');

        // Clear any previously set timer before setting a fresh one
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
        }, delay));
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
        slider.noUiSlider.on('change', function (values) {
          // Clear any previously set timer before setting a fresh one
          clearTimeout($item.data('timer'));
          $item.data('timer', setTimeout(function () {
            $item.removeData('timer');
            filterProductsAccordingToSlider(values);
          }, delay));
        });
        $minValue.on('input', function () {
          var $input = $(this);

          // Clear any previously set timer before setting a fresh one
          clearTimeout($input.data('timer'));
          $input.data('timer', setTimeout(function () {
            $input.removeData('timer');
            var minValue = $input.val();
            slider.noUiSlider.set([minValue, null]);
            filterProductsAccordingToSlider(slider.noUiSlider.get());
          }, delay));
        });
        $maxValue.on('input', function () {
          var $input = $(this);

          // Clear any previously set timer before setting a fresh one
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJ1dGlscy5qcyJdLCJuYW1lcyI6WyJ3Y2FwZl9wYXJhbXMiLCIkIiwid2luZG93IiwiX2RlbGF5IiwicGFyc2VJbnQiLCJmaWx0ZXJfaW5wdXRfZGVsYXkiLCJkZWxheSIsIl9rZXl3b3JkRmlsdGVyRGVsYXkiLCJrZXl3b3JkX2ZpbHRlcl9kZWxheSIsImtleXdvcmRGaWx0ZXJEZWxheSIsImlzUHJvIiwid2NhcGZfcHJvIiwiJGJvZHkiLCIkZG9jdW1lbnQiLCJkb2N1bWVudCIsImluc3RhbmNlSWRzIiwiZGVmYXVsdE9yZGVyQnlFbGVtZW50Iiwib3JkZXJieV9mb3JtIiwib3JkZXJieV9lbGVtZW50IiwiZWFjaCIsImlkIiwiZGF0YSIsInB1c2giLCJ0aXBweUluc3RhbmNlcyIsIldDQVBGIiwiaGFuZGxlRmlsdGVyQWNjb3JkaW9uIiwidG9nZ2xlQWNjb3JkaW9uIiwiJGVsIiwicHJlc3NlZCIsImF0dHIiLCIkZmlsdGVySW5uZXIiLCJjbG9zZXN0IiwiY2hpbGRyZW4iLCJlbmFibGVfYW5pbWF0aW9uX2Zvcl9maWx0ZXJfYWNjb3JkaW9uIiwic2xpZGVUb2dnbGUiLCJmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsInRvZ2dsZSIsIm9uIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsIiR0cmlnZ2VyIiwiZmluZCIsImhhbmRsZUhpZXJhcmNoeVRvZ2dsZSIsIiRjaGlsZCIsImVuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24iLCJoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsImtleSIsInByZXZlbnREZWZhdWx0IiwiaGFuZGxlU29mdExpbWl0IiwidG9nZ2xlRmlsdGVyT3B0aW9ucyIsIiRsaXN0V3JhcHBlciIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJoYW5kbGVTZWFyY2hGaWx0ZXJPcHRpb25zIiwiJHRoYXQiLCIkaW5uZXIiLCIkZmlsdGVyIiwic29mdExpbWl0RW5hYmxlZCIsImhhc0NsYXNzIiwic29mdExpbWl0VG9nZ2xlIiwibm9SZXN1bHRzIiwidmlzaWJsZU9wdGlvbnMiLCJrZXl3b3JkIiwidmFsIiwibGVuZ3RoIiwiaW5kZXgiLCIkZmlsdGVySXRlbSIsInJlbW92ZUF0dHIiLCJ0ZXh0IiwiaGlkZSIsImxhYmVsIiwidG9TdHJpbmciLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwic2hvdyIsIiRzZWFyY2hCb3giLCIkaW5wdXQiLCJ0cmlnZ2VyIiwiJHdyYXBwZXIiLCJjbGVhclRpbWVvdXQiLCJmaWx0ZXJVUkwiLCJjbGVhckZpbHRlclVSTCIsInVybCIsInJlcGxhY2UiLCJzZXRUaW1lb3V0IiwicmVxdWVzdEZpbHRlciIsInVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQiLCIkcmVzcG9uc2UiLCIkY29udGFpbmVyIiwic2hvcF9sb29wX2NvbnRhaW5lciIsInNlbGVjdG9yIiwibmV3Q291bnQiLCJodG1sIiwiaGFzIiwic2Nyb2xsVG8iLCJzY3JvbGxfd2luZG93Iiwic2Nyb2xsRm9yIiwic2Nyb2xsX3dpbmRvd19mb3IiLCJpc01vYmlsZSIsImlzX21vYmlsZSIsInByb2NlZWQiLCJhZGp1c3RpbmdPZmZzZXQiLCJvZmZzZXQiLCJzY3JvbGxfdG9fdG9wX29mZnNldCIsImNvbnRhaW5lciIsIm5vdF9mb3VuZF9jb250YWluZXIiLCJzY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50IiwidG9wIiwic3RvcCIsImFuaW1hdGUiLCJzY3JvbGxUb3AiLCJzY3JvbGxfdG9fdG9wX3NwZWVkIiwic2Nyb2xsX3RvX3RvcF9lYXNpbmciLCJiZWZvcmVGZXRjaGluZ1Byb2R1Y3RzIiwidHJpZ2dlcmVkQnkiLCJzY3JvbGxfd2luZG93X3doZW4iLCJkZXN0cm95VGlwcHlJbnN0YW5jZXMiLCJ1c2VfdGlwcHlqcyIsImZvckVhY2giLCJpbnN0YW5jZSIsImRlc3Ryb3kiLCJiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzIiwiYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzIiwiaW5pdCIsImN1c3RvbV9zY3JpcHRzIiwiZXZhbCIsImZpbHRlclByb2R1Y3RzIiwiYXJndW1lbnRzIiwidW5kZWZpbmVkIiwiYWpheCIsImxvY2F0aW9uIiwiaHJlZiIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsInVwZGF0ZV9kb2N1bWVudF90aXRsZSIsInRpdGxlIiwiZmlsdGVyIiwiX2xvb3AiLCJfaW5zdGFuY2VJZHMiLCJfaSIsImluc3RhbmNlSWQiLCIkaW5zdGFuY2UiLCJfaW5zdGFuY2UiLCJwcmVzZXJ2ZV9oaWVyYXJjaHlfYWNjb3JkaW9uX3N0YXRlIiwidG9nZ2xlU2VsZWN0b3IiLCJjb25jYXQiLCJwcmVzZXJ2ZV9zb2Z0X2xpbWl0X3N0YXRlIiwiX2h0bWwiLCIkc2hvcExvb3BDb250YWluZXIiLCIkbm90Rm91bmRDb250YWluZXIiLCJkaXNhYmxlX2FqYXgiLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwid2NhcGYiLCJoYW5kbGVOdW1iZXJJbnB1dEZpbHRlcnMiLCJyYW5nZU51bWJlclNlbGVjdG9ycyIsIiRpdGVtIiwiJHJhbmdlTnVtYmVyIiwiZm9ybWF0TnVtYmVycyIsInJhbmdlTWluVmFsdWUiLCJwYXJzZUZsb2F0IiwicmFuZ2VNYXhWYWx1ZSIsIm9sZE1pblZhbHVlIiwib2xkTWF4VmFsdWUiLCJkZWNpbWFsUGxhY2VzIiwidGhvdXNhbmRTZXBhcmF0b3IiLCJkZWNpbWFsU2VwYXJhdG9yIiwiZ2V0VmFsdWUiLCJmbG9hdFZhbHVlIiwibnVtYmVyRm9ybWF0IiwicmVtb3ZlRGF0YSIsIm1pblZhbHVlIiwibWF4VmFsdWUiLCJpc05hTiIsImhhbmRsZURhdGVJbnB1dEZpbHRlcnMiLCJpc1JhbmdlIiwiZmlsdGVyVXJsIiwiZnJvbSIsInRvIiwiaGFuZGxlTGlzdEZpbHRlcnMiLCJuYXRpdmVJbnB1dHMiLCJ0b2dnbGVDbGFzcyIsImN1c3RvbVJhZGlvU2VsZWN0b3IiLCJub3QiLCJwcm9wIiwiaGFuZGxlRHJvcGRvd25GaWx0ZXJzIiwiJHNlbGVjdCIsInZhbHVlcyIsImhhbmRsZVBhZ2luYXRpb24iLCJlbmFibGVfcGFnaW5hdGlvbl92aWFfYWpheCIsInBhZ2luYXRpb25fY29udGFpbmVyIiwiX3NlbGVjdG9ycyIsInNwbGl0Iiwic2VsZWN0b3JzIiwiam9pbiIsImhhbmRsZURlZmF1bHRPcmRlcmJ5Iiwic29ydGluZ19jb250cm9sIiwib3JkZXIiLCJVUkwiLCJzZWFyY2hQYXJhbXMiLCJzZXQiLCJnZXRPcmRlckJ5VXJsIiwiaGFuZGxlQ2xlYXJGaWx0ZXIiLCJoYW5kbGVGaWx0ZXJUb29sdGlwIiwidGlwcHkiLCJwbGFjZW1lbnQiLCJjb250ZW50IiwicmVmZXJlbmNlIiwiZ2V0QXR0cmlidXRlIiwiYWxsb3dIVE1MIiwiaW5pdENvbWJvYm94IiwialF1ZXJ5IiwiY2hvc2VuV0NBUEYiLCJ0ZW1wbGF0ZVJlc3VsdCIsInRlbXBsYXRlU2VsZWN0aW9uIiwiY291bnQiLCJkZWZhdWx0cyIsImluaGVyaXRfc2VsZWN0X2NsYXNzZXMiLCJpbmhlcml0X29wdGlvbl9jbGFzc2VzIiwibm9fcmVzdWx0c190ZXh0IiwiY29tYm9ib3hfbm9fcmVzdWx0c190ZXh0Iiwib3B0aW9uc19ub25lX3RleHQiLCJjb21ib2JveF9vcHRpb25zX25vbmVfdGV4dCIsInNlYXJjaF9jb250YWlucyIsInNlYXJjaF9pbl92YWx1ZXMiLCJpc19ydGwiLCIkdGhpcyIsIm9wdGlvbnMiLCJfb2JqZWN0U3ByZWFkIiwiY29tYm9ib3hfZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zIiwiYXR0YWNoX2NvbWJvYm94X29uX3NvcnRpbmciLCJkaXNhYmxlU2VhcmNoIiwic2VhcmNoX2JveF9pbl9kZWZhdWx0X29yZGVyYnkiLCJpbml0UmFuZ2VTbGlkZXIiLCJub1VpU2xpZGVyIiwiJHNsaWRlciIsInNsaWRlcklkIiwiZGlzcGxheVZhbHVlc0FzIiwic3RlcCIsIiRtaW5WYWx1ZSIsIiRtYXhWYWx1ZSIsInNsaWRlciIsImdldEVsZW1lbnRCeUlkIiwiY3JlYXRlIiwic3RhcnQiLCJjb25uZWN0IiwiY3NzUHJlZml4IiwicmFuZ2UiLCJmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyIiwiX21pblZhbHVlIiwiX21heFZhbHVlIiwiZ2V0IiwiaW5pdERhdGVwaWNrZXIiLCJkYXRlcGlja2VyIiwiJHdjYXBmRGF0ZUZpbHRlciIsImZvcm1hdCIsInllYXJEcm9wZG93biIsIm1vbnRoRHJvcGRvd24iLCIkZnJvbSIsIiR0byIsImRhdGVGb3JtYXQiLCJjaGFuZ2VZZWFyIiwiY2hhbmdlTW9udGgiLCJpbml0RmlsdGVyT3B0aW9uVG9vbHRpcCIsInRvb2x0aXBQb3NpdGlvbnMiLCJ0b29sdGlwUG9zaXRpb24iLCJpZGVudGlmaWVyIiwiaW5zdGFuY2VzIiwiaGFuZGxlRm9ybVN1Ym1pdCIsImluaXRQb3BTdGF0ZSIsInJlbG9hZF9vbl9iYWNrIiwiZm91bmRfd2NhcGYiLCJyZXBsYWNlU3RhdGUiLCJhZGRFdmVudExpc3RlbmVyIiwic3RhdGUiLCJoYXNPd25Qcm9wZXJ0eSIsIm51bWJlciIsImRlY2ltYWxzIiwiZGVjX3BvaW50IiwidGhvdXNhbmRzX3NlcCIsIm4iLCJpc0Zpbml0ZSIsInByZWMiLCJNYXRoIiwiYWJzIiwic2VwIiwiZGVjIiwicyIsInRvRml4ZWRGaXgiLCJrIiwicG93Iiwicm91bmQiLCJBcnJheSIsImNsZWFuVXJsIiwicGFnZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFNQSxZQUFZLEdBQUdBLFlBQVksSUFBSTtFQUNwQyxRQUFRLEVBQUUsRUFBRTtFQUNaLG9CQUFvQixFQUFFLEVBQUU7RUFDeEIsc0JBQXNCLEVBQUUsRUFBRTtFQUMxQixtQ0FBbUMsRUFBRSxFQUFFO0VBQ3ZDLDBCQUEwQixFQUFFLEVBQUU7RUFDOUIsNEJBQTRCLEVBQUUsRUFBRTtFQUNoQywrQkFBK0IsRUFBRSxFQUFFO0VBQ25DLG9DQUFvQyxFQUFFLEVBQUU7RUFDeEMsMkJBQTJCLEVBQUUsRUFBRTtFQUMvQix1Q0FBdUMsRUFBRSxFQUFFO0VBQzNDLGtDQUFrQyxFQUFFLEVBQUU7RUFDdEMsbUNBQW1DLEVBQUUsRUFBRTtFQUN2QywwQ0FBMEMsRUFBRSxFQUFFO0VBQzlDLHFDQUFxQyxFQUFFLEVBQUU7RUFDekMsc0NBQXNDLEVBQUUsRUFBRTtFQUMxQyxxQkFBcUIsRUFBRSxFQUFFO0VBQ3pCLHNCQUFzQixFQUFFLEVBQUU7RUFDMUIsV0FBVyxFQUFFLEVBQUU7RUFDZixnQkFBZ0IsRUFBRSxFQUFFO0VBQ3BCLGFBQWEsRUFBRSxFQUFFO0VBQ2pCLFdBQVcsRUFBRSxFQUFFO0VBQ2YsdUJBQXVCLEVBQUUsRUFBRTtFQUMzQixhQUFhLEVBQUUsRUFBRTtFQUNqQixxQkFBcUIsRUFBRSxFQUFFO0VBQ3pCLHFCQUFxQixFQUFFLEVBQUU7RUFDekIsc0JBQXNCLEVBQUUsRUFBRTtFQUMxQixjQUFjLEVBQUUsRUFBRTtFQUNsQixpQkFBaUIsRUFBRSxFQUFFO0VBQ3JCLGNBQWMsRUFBRSxFQUFFO0VBQ2xCLDRCQUE0QixFQUFFLEVBQUU7RUFDaEMsaUJBQWlCLEVBQUUsRUFBRTtFQUNyQiw0QkFBNEIsRUFBRSxFQUFFO0VBQ2hDLG1CQUFtQixFQUFFLEVBQUU7RUFDdkIsZUFBZSxFQUFFLEVBQUU7RUFDbkIsbUJBQW1CLEVBQUUsRUFBRTtFQUN2QixvQkFBb0IsRUFBRSxFQUFFO0VBQ3hCLDhCQUE4QixFQUFFLEVBQUU7RUFDbEMsV0FBVyxFQUFFLEVBQUU7RUFDZixzQkFBc0IsRUFBRSxFQUFFO0VBQzFCLDBCQUEwQixFQUFFLEVBQUU7RUFDOUIsZ0JBQWdCLEVBQUUsRUFBRTtFQUNwQixnQkFBZ0IsRUFBRTtBQUNuQixDQUFDO0FBRUMsV0FBVUMsQ0FBQyxFQUFFQyxNQUFNLEVBQUc7RUFFdkIsSUFBTUMsTUFBTSxHQUFHQyxRQUFRLENBQUVKLFlBQVksQ0FBQ0ssa0JBQW1CLENBQUM7RUFDMUQsSUFBTUMsS0FBSyxHQUFJSCxNQUFNLElBQUksQ0FBQyxHQUFHQSxNQUFNLEdBQUcsR0FBRztFQUV6QyxJQUFNSSxtQkFBbUIsR0FBR0gsUUFBUSxDQUFFSixZQUFZLENBQUNRLG9CQUFxQixDQUFDO0VBQ3pFLElBQU1DLGtCQUFrQixHQUFJRixtQkFBbUIsSUFBSSxDQUFDLEdBQUdBLG1CQUFtQixHQUFHLEdBQUc7RUFFaEYsSUFBTUcsS0FBSyxHQUFHVixZQUFZLENBQUNXLFNBQVM7RUFFcEMsSUFBTUMsS0FBSyxHQUFPWCxDQUFDLENBQUUsTUFBTyxDQUFDO0VBQzdCLElBQU1ZLFNBQVMsR0FBR1osQ0FBQyxDQUFFYSxRQUFTLENBQUM7RUFFL0IsSUFBTUMsV0FBVyxHQUFHLEVBQUU7RUFFdEIsSUFBTUMscUJBQXFCLEdBQUdoQixZQUFZLENBQUNpQixZQUFZLEdBQUcsR0FBRyxHQUFHakIsWUFBWSxDQUFDa0IsZUFBZTtFQUU1RmpCLENBQUMsQ0FBRSxlQUFnQixDQUFDLENBQUNrQixJQUFJLENBQUUsWUFBVztJQUNyQyxJQUFNQyxFQUFFLEdBQUduQixDQUFDLENBQUUsSUFBSyxDQUFDLENBQUNvQixJQUFJLENBQUUsSUFBSyxDQUFDO0lBRWpDLElBQUssQ0FBRUQsRUFBRSxFQUFHO01BQ1g7SUFDRDtJQUVBTCxXQUFXLENBQUNPLElBQUksQ0FBRUYsRUFBRyxDQUFDO0VBQ3ZCLENBQUUsQ0FBQztFQUVIbEIsTUFBTSxDQUFDcUIsY0FBYyxHQUFHLEVBQUU7RUFFMUJyQixNQUFNLENBQUNzQixLQUFLLEdBQUd0QixNQUFNLENBQUNzQixLQUFLLElBQUksQ0FBQyxDQUFDO0VBRWpDdEIsTUFBTSxDQUFDc0IsS0FBSyxHQUFHO0lBQ2RDLHFCQUFxQixFQUFFLFNBQXZCQSxxQkFBcUJBLENBQUEsRUFBYTtNQUNqQyxJQUFNQyxlQUFlLEdBQUcsU0FBbEJBLGVBQWVBLENBQUtDLEdBQUcsRUFBTTtRQUNsQztRQUNBLElBQU1DLE9BQU8sR0FBR0QsR0FBRyxDQUFDRSxJQUFJLENBQUUsZUFBZ0IsQ0FBQyxLQUFLLE1BQU07O1FBRXREO1FBQ0FGLEdBQUcsQ0FBQ0UsSUFBSSxDQUFFLGVBQWUsRUFBRSxDQUFFRCxPQUFRLENBQUM7UUFFdEMsSUFBTUUsWUFBWSxHQUFHSCxHQUFHLENBQUNJLE9BQU8sQ0FBRSxlQUFnQixDQUFDLENBQUNDLFFBQVEsQ0FBRSxxQkFBc0IsQ0FBQztRQUVyRixJQUFLaEMsWUFBWSxDQUFDaUMscUNBQXFDLEVBQUc7VUFDekRILFlBQVksQ0FBQ0ksV0FBVyxDQUN2QmxDLFlBQVksQ0FBQ21DLGdDQUFnQyxFQUM3Q25DLFlBQVksQ0FBQ29DLGlDQUNkLENBQUM7UUFDRixDQUFDLE1BQU07VUFDTk4sWUFBWSxDQUFDTyxNQUFNLENBQUMsQ0FBQztRQUN0QjtNQUNELENBQUM7TUFFRHpCLEtBQUssQ0FBQzBCLEVBQUUsQ0FBRSxPQUFPLEVBQUUsaUNBQWlDLEVBQUUsVUFBVUMsQ0FBQyxFQUFHO1FBQ25FQSxDQUFDLENBQUNDLGVBQWUsQ0FBQyxDQUFDO1FBRW5CZCxlQUFlLENBQUV6QixDQUFDLENBQUUsSUFBSyxDQUFFLENBQUM7TUFDN0IsQ0FBRSxDQUFDO01BRUhXLEtBQUssQ0FBQzBCLEVBQUUsQ0FBRSxPQUFPLEVBQUUsbUNBQW1DLEVBQUUsWUFBVztRQUNsRSxJQUFNRyxRQUFRLEdBQUd4QyxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUN5QyxJQUFJLENBQUUsaUNBQWtDLENBQUM7UUFFcEVoQixlQUFlLENBQUVlLFFBQVMsQ0FBQztNQUM1QixDQUFFLENBQUM7SUFDSixDQUFDO0lBQ0RFLHFCQUFxQixFQUFFLFNBQXZCQSxxQkFBcUJBLENBQUEsRUFBYTtNQUNqQyxJQUFNakIsZUFBZSxHQUFHLFNBQWxCQSxlQUFlQSxDQUFLQyxHQUFHLEVBQU07UUFDbEM7UUFDQSxJQUFNQyxPQUFPLEdBQUdELEdBQUcsQ0FBQ0UsSUFBSSxDQUFFLGNBQWUsQ0FBQyxLQUFLLE1BQU07O1FBRXJEO1FBQ0FGLEdBQUcsQ0FBQ0UsSUFBSSxDQUFFLGNBQWMsRUFBRSxDQUFFRCxPQUFRLENBQUM7UUFFckMsSUFBTWdCLE1BQU0sR0FBR2pCLEdBQUcsQ0FBQ0ksT0FBTyxDQUFFLElBQUssQ0FBQyxDQUFDQyxRQUFRLENBQUUsSUFBSyxDQUFDO1FBRW5ELElBQUtoQyxZQUFZLENBQUM2Qyx3Q0FBd0MsRUFBRztVQUM1REQsTUFBTSxDQUFDVixXQUFXLENBQ2pCbEMsWUFBWSxDQUFDOEMsbUNBQW1DLEVBQ2hEOUMsWUFBWSxDQUFDK0Msb0NBQ2QsQ0FBQztRQUNGLENBQUMsTUFBTTtVQUNOSCxNQUFNLENBQUNQLE1BQU0sQ0FBQyxDQUFDO1FBQ2hCO01BQ0QsQ0FBQztNQUVEekIsS0FBSyxDQUNIMEIsRUFBRSxDQUFFLE9BQU8sRUFBRSxtQ0FBbUMsRUFBRSxZQUFXO1FBQzdEWixlQUFlLENBQUV6QixDQUFDLENBQUUsSUFBSyxDQUFFLENBQUM7TUFDN0IsQ0FBRSxDQUFDLENBQ0ZxQyxFQUFFLENBQUUsU0FBUyxFQUFFLG1DQUFtQyxFQUFFLFVBQVVDLENBQUMsRUFBRztRQUNsRSxJQUFLQSxDQUFDLENBQUNTLEdBQUcsS0FBSyxHQUFHLElBQUlULENBQUMsQ0FBQ1MsR0FBRyxLQUFLLE9BQU8sSUFBSVQsQ0FBQyxDQUFDUyxHQUFHLEtBQUssVUFBVSxFQUFHO1VBQ2pFO1VBQ0FULENBQUMsQ0FBQ1UsY0FBYyxDQUFDLENBQUM7VUFFbEJ2QixlQUFlLENBQUV6QixDQUFDLENBQUUsSUFBSyxDQUFFLENBQUM7UUFDN0I7TUFDRCxDQUFFLENBQUM7SUFDTCxDQUFDO0lBQ0RpRCxlQUFlLEVBQUUsU0FBakJBLGVBQWVBLENBQUEsRUFBYTtNQUMzQixJQUFNQyxtQkFBbUIsR0FBRyxTQUF0QkEsbUJBQW1CQSxDQUFLeEIsR0FBRyxFQUFNO1FBQ3RDO1FBQ0EsSUFBTUMsT0FBTyxHQUFHRCxHQUFHLENBQUNFLElBQUksQ0FBRSxjQUFlLENBQUMsS0FBSyxNQUFNOztRQUVyRDtRQUNBRixHQUFHLENBQUNFLElBQUksQ0FBRSxjQUFjLEVBQUUsQ0FBRUQsT0FBUSxDQUFDO1FBRXJDLElBQU13QixZQUFZLEdBQUd6QixHQUFHLENBQUNJLE9BQU8sQ0FBRSxxQkFBc0IsQ0FBQztRQUV6RCxJQUFLSCxPQUFPLEVBQUc7VUFDZHdCLFlBQVksQ0FBQ0MsV0FBVyxDQUFFLHFCQUFzQixDQUFDO1FBQ2xELENBQUMsTUFBTTtVQUNORCxZQUFZLENBQUNFLFFBQVEsQ0FBRSxxQkFBc0IsQ0FBQztRQUMvQztNQUNELENBQUM7TUFFRDFDLEtBQUssQ0FDSDBCLEVBQUUsQ0FBRSxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsWUFBVztRQUNyRGEsbUJBQW1CLENBQUVsRCxDQUFDLENBQUUsSUFBSyxDQUFFLENBQUM7TUFDakMsQ0FBRSxDQUFDLENBQ0ZxQyxFQUFFLENBQUUsU0FBUyxFQUFFLDJCQUEyQixFQUFFLFVBQVVDLENBQUMsRUFBRztRQUMxRCxJQUFLQSxDQUFDLENBQUNTLEdBQUcsS0FBSyxHQUFHLElBQUlULENBQUMsQ0FBQ1MsR0FBRyxLQUFLLE9BQU8sSUFBSVQsQ0FBQyxDQUFDUyxHQUFHLEtBQUssVUFBVSxFQUFHO1VBQ2pFO1VBQ0FULENBQUMsQ0FBQ1UsY0FBYyxDQUFDLENBQUM7VUFFbEJFLG1CQUFtQixDQUFFbEQsQ0FBQyxDQUFFLElBQUssQ0FBRSxDQUFDO1FBQ2pDO01BQ0QsQ0FBRSxDQUFDO0lBQ0wsQ0FBQztJQUNEc0QseUJBQXlCLEVBQUUsU0FBM0JBLHlCQUF5QkEsQ0FBQSxFQUFhO01BQ3JDM0MsS0FBSyxDQUFDMEIsRUFBRSxDQUFFLE9BQU8sRUFBRSxzQ0FBc0MsRUFBRSxZQUFXO1FBQ3JFLElBQU1rQixLQUFLLEdBQUt2RCxDQUFDLENBQUUsSUFBSyxDQUFDO1FBQ3pCLElBQU13RCxNQUFNLEdBQUlELEtBQUssQ0FBQ3pCLE9BQU8sQ0FBRSxxQkFBc0IsQ0FBQztRQUN0RCxJQUFNMkIsT0FBTyxHQUFHRCxNQUFNLENBQUMxQixPQUFPLENBQUUsZUFBZ0IsQ0FBQztRQUVqRCxJQUFNNEIsZ0JBQWdCLEdBQUdELE9BQU8sQ0FBQ0UsUUFBUSxDQUFFLGdCQUFpQixDQUFDO1FBQzdELElBQU1DLGVBQWUsR0FBSUgsT0FBTyxDQUFDaEIsSUFBSSxDQUFFLDJCQUE0QixDQUFDO1FBQ3BFLElBQU1vQixTQUFTLEdBQVVKLE9BQU8sQ0FBQ2hCLElBQUksQ0FBRSx3QkFBeUIsQ0FBQztRQUNqRSxJQUFNcUIsY0FBYyxHQUFLM0QsUUFBUSxDQUFFc0QsT0FBTyxDQUFDN0IsSUFBSSxDQUFFLHNCQUF1QixDQUFFLENBQUM7UUFFM0UsSUFBTW1DLE9BQU8sR0FBR1IsS0FBSyxDQUFDUyxHQUFHLENBQUMsQ0FBQztRQUUzQixJQUFLLENBQUVELE9BQU8sQ0FBQ0UsTUFBTSxFQUFHO1VBQ3ZCLElBQUlDLE1BQUssR0FBRyxDQUFDO1VBQ2JULE9BQU8sQ0FBQ0wsV0FBVyxDQUFFLGVBQWdCLENBQUM7VUFFdENwRCxDQUFDLENBQUNrQixJQUFJLENBQUVzQyxNQUFNLENBQUNmLElBQUksQ0FBRSw0QkFBNkIsQ0FBQyxFQUFFLFlBQVc7WUFDL0R5QixNQUFLLEVBQUU7WUFFUCxJQUFNQyxXQUFXLEdBQUduRSxDQUFDLENBQUUsSUFBSyxDQUFDO1lBQzdCbUUsV0FBVyxDQUFDZixXQUFXLENBQUUsaUJBQWtCLENBQUM7WUFFNUMsSUFBS00sZ0JBQWdCLEVBQUc7Y0FDdkIsSUFBS1EsTUFBSyxHQUFHSixjQUFjLEVBQUc7Z0JBQzdCSyxXQUFXLENBQUNkLFFBQVEsQ0FBRSw0QkFBNkIsQ0FBQztjQUNyRCxDQUFDLE1BQU07Z0JBQ05jLFdBQVcsQ0FBQ2YsV0FBVyxDQUFFLDRCQUE2QixDQUFDO2NBQ3hEO1lBQ0Q7VUFDRCxDQUFFLENBQUM7VUFFSCxJQUFLTSxnQkFBZ0IsRUFBRztZQUN2QkUsZUFBZSxDQUFDUSxVQUFVLENBQUUsT0FBUSxDQUFDO1VBQ3RDO1VBRUFQLFNBQVMsQ0FBQzlCLFFBQVEsQ0FBRSxNQUFPLENBQUMsQ0FBQ3NDLElBQUksQ0FBRSxFQUFHLENBQUM7VUFDdkNSLFNBQVMsQ0FBQ1MsSUFBSSxDQUFDLENBQUM7VUFFaEI7UUFDRDtRQUVBLElBQUlKLEtBQUssR0FBRyxDQUFDO1FBQ2JULE9BQU8sQ0FBQ0osUUFBUSxDQUFFLGVBQWdCLENBQUM7UUFFbkNyRCxDQUFDLENBQUNrQixJQUFJLENBQUVzQyxNQUFNLENBQUNmLElBQUksQ0FBRSw0QkFBNkIsQ0FBQyxFQUFFLFlBQVc7VUFDL0QsSUFBTTBCLFdBQVcsR0FBR25FLENBQUMsQ0FBRSxJQUFLLENBQUM7VUFDN0IsSUFBTXVFLEtBQUssR0FBU0osV0FBVyxDQUFDMUIsSUFBSSxDQUFFLDBCQUEyQixDQUFDLENBQUNyQixJQUFJLENBQUUsT0FBUSxDQUFDO1VBRWxGLElBQUttRCxLQUFLLENBQUNDLFFBQVEsQ0FBQyxDQUFDLENBQUNDLFdBQVcsQ0FBQyxDQUFDLENBQUNDLFFBQVEsQ0FBRVgsT0FBTyxDQUFDVSxXQUFXLENBQUMsQ0FBRSxDQUFDLEVBQUc7WUFDdkVQLEtBQUssRUFBRTtZQUVQQyxXQUFXLENBQUNkLFFBQVEsQ0FBRSxpQkFBa0IsQ0FBQztZQUV6QyxJQUFLSyxnQkFBZ0IsRUFBRztjQUN2QixJQUFLUSxLQUFLLEdBQUdKLGNBQWMsRUFBRztnQkFDN0JLLFdBQVcsQ0FBQ2QsUUFBUSxDQUFFLDRCQUE2QixDQUFDO2NBQ3JELENBQUMsTUFBTTtnQkFDTmMsV0FBVyxDQUFDZixXQUFXLENBQUUsNEJBQTZCLENBQUM7Y0FDeEQ7WUFDRDtVQUNELENBQUMsTUFBTTtZQUNOZSxXQUFXLENBQUNmLFdBQVcsQ0FBRSxpQkFBa0IsQ0FBQztVQUM3QztRQUNELENBQUUsQ0FBQztRQUVILElBQUtNLGdCQUFnQixFQUFHO1VBQ3ZCLElBQUtRLEtBQUssSUFBSUosY0FBYyxFQUFHO1lBQzlCRixlQUFlLENBQUNVLElBQUksQ0FBQyxDQUFDO1VBQ3ZCLENBQUMsTUFBTTtZQUNOVixlQUFlLENBQUNlLElBQUksQ0FBQyxDQUFDO1VBQ3ZCO1FBQ0Q7UUFFQSxJQUFLLENBQUMsS0FBS1QsS0FBSyxFQUFHO1VBQ2xCTCxTQUFTLENBQUM5QixRQUFRLENBQUUsTUFBTyxDQUFDLENBQUNzQyxJQUFJLENBQUVOLE9BQVEsQ0FBQztVQUM1Q0YsU0FBUyxDQUFDYyxJQUFJLENBQUMsQ0FBQztRQUNqQixDQUFDLE1BQU07VUFDTmQsU0FBUyxDQUFDOUIsUUFBUSxDQUFFLE1BQU8sQ0FBQyxDQUFDc0MsSUFBSSxDQUFFLEVBQUcsQ0FBQztVQUN2Q1IsU0FBUyxDQUFDUyxJQUFJLENBQUMsQ0FBQztRQUNqQjtNQUNELENBQUUsQ0FBQztNQUVIM0QsS0FBSyxDQUFDMEIsRUFBRSxDQUFFLE9BQU8sRUFBRSxzQ0FBc0MsRUFBRSxZQUFXO1FBQ3JFLElBQU1rQixLQUFLLEdBQVF2RCxDQUFDLENBQUUsSUFBSyxDQUFDO1FBQzVCLElBQU00RSxVQUFVLEdBQUdyQixLQUFLLENBQUN6QixPQUFPLENBQUUsbUJBQW9CLENBQUM7UUFDdkQsSUFBTStDLE1BQU0sR0FBT0QsVUFBVSxDQUFDbkMsSUFBSSxDQUFFLG9CQUFxQixDQUFDO1FBQzFELElBQU1nQixPQUFPLEdBQU1tQixVQUFVLENBQUM5QyxPQUFPLENBQUUsZUFBZ0IsQ0FBQztRQUV4RCtDLE1BQU0sQ0FBQ2IsR0FBRyxDQUFFLEVBQUcsQ0FBQztRQUVoQixJQUFLUCxPQUFPLENBQUNFLFFBQVEsQ0FBRSxzQkFBdUIsQ0FBQyxFQUFHO1VBQ2pEa0IsTUFBTSxDQUFDQyxPQUFPLENBQUUsUUFBUyxDQUFDO1FBQzNCLENBQUMsTUFBTTtVQUNORCxNQUFNLENBQUNDLE9BQU8sQ0FBRSxPQUFRLENBQUM7UUFDMUI7TUFDRCxDQUFFLENBQUM7TUFFSG5FLEtBQUssQ0FBQzBCLEVBQUUsQ0FBRSxRQUFRLEVBQUUsMENBQTBDLEVBQUUsWUFBVztRQUMxRSxJQUFNa0IsS0FBSyxHQUFNdkQsQ0FBQyxDQUFFLElBQUssQ0FBQztRQUMxQixJQUFNK0UsUUFBUSxHQUFHeEIsS0FBSyxDQUFDekIsT0FBTyxDQUFFLCtCQUFnQyxDQUFDO1FBQ2pFLElBQU1pQyxPQUFPLEdBQUlSLEtBQUssQ0FBQ1MsR0FBRyxDQUFDLENBQUM7O1FBRTVCO1FBQ0FnQixZQUFZLENBQUV6QixLQUFLLENBQUNuQyxJQUFJLENBQUUsT0FBUSxDQUFFLENBQUM7UUFFckMsSUFBTTZELFNBQVMsR0FBUUYsUUFBUSxDQUFDM0QsSUFBSSxDQUFFLFlBQWEsQ0FBQztRQUNwRCxJQUFNOEQsY0FBYyxHQUFHSCxRQUFRLENBQUMzRCxJQUFJLENBQUUsa0JBQW1CLENBQUM7UUFDMUQsSUFBSStELEdBQUc7UUFFUCxJQUFLcEIsT0FBTyxDQUFDRSxNQUFNLEVBQUc7VUFDckJrQixHQUFHLEdBQUdGLFNBQVMsQ0FBQ0csT0FBTyxDQUFFLElBQUksRUFBRXJCLE9BQVEsQ0FBQztRQUN6QyxDQUFDLE1BQU07VUFDTm9CLEdBQUcsR0FBR0QsY0FBYztRQUNyQjtRQUVBM0IsS0FBSyxDQUFDbkMsSUFBSSxDQUFFLE9BQU8sRUFBRWlFLFVBQVUsQ0FBRSxZQUFXO1VBQzNDOUQsS0FBSyxDQUFDK0QsYUFBYSxDQUFFSCxHQUFJLENBQUM7UUFDM0IsQ0FBQyxFQUFFM0Usa0JBQW1CLENBQUUsQ0FBQztNQUMxQixDQUFFLENBQUM7SUFDSixDQUFDO0lBQ0QrRSx5QkFBeUIsRUFBRSxTQUEzQkEseUJBQXlCQSxDQUFZQyxTQUFTLEVBQUc7TUFDaEQsSUFBTUMsVUFBVSxHQUFHekYsQ0FBQyxDQUFFRCxZQUFZLENBQUMyRixtQkFBb0IsQ0FBQztNQUN4RCxJQUFNQyxRQUFRLEdBQUssMkJBQTJCO01BQzlDLElBQU1DLFFBQVEsR0FBS0osU0FBUyxDQUFDL0MsSUFBSSxDQUFFa0QsUUFBUyxDQUFDLENBQUNFLElBQUksQ0FBQyxDQUFDO01BRXBEbEYsS0FBSyxDQUFDOEIsSUFBSSxDQUFFa0QsUUFBUyxDQUFDLENBQUN6RSxJQUFJLENBQUUsWUFBVztRQUN2QyxJQUFNUSxHQUFHLEdBQUcxQixDQUFDLENBQUUsSUFBSyxDQUFDO1FBRXJCLElBQUssQ0FBRXlGLFVBQVUsQ0FBQ0ssR0FBRyxDQUFFcEUsR0FBSSxDQUFDLENBQUN1QyxNQUFNLEVBQUc7VUFDckN2QyxHQUFHLENBQUNtRSxJQUFJLENBQUVELFFBQVMsQ0FBQztRQUNyQjtNQUNELENBQUUsQ0FBQztJQUNKLENBQUM7SUFDREcsUUFBUSxFQUFFLFNBQVZBLFFBQVFBLENBQUEsRUFBYTtNQUNwQixJQUFLLE1BQU0sS0FBS2hHLFlBQVksQ0FBQ2lHLGFBQWEsRUFBRztRQUM1QztNQUNEO01BRUEsSUFBTUMsU0FBUyxHQUFHbEcsWUFBWSxDQUFDbUcsaUJBQWlCO01BQ2hELElBQU1DLFFBQVEsR0FBSXBHLFlBQVksQ0FBQ3FHLFNBQVM7TUFDeEMsSUFBSUMsT0FBTyxHQUFPLEtBQUs7TUFFdkIsSUFBSyxRQUFRLEtBQUtKLFNBQVMsSUFBSUUsUUFBUSxFQUFHO1FBQ3pDRSxPQUFPLEdBQUcsSUFBSTtNQUNmLENBQUMsTUFBTSxJQUFLLFNBQVMsS0FBS0osU0FBUyxJQUFJLENBQUVFLFFBQVEsRUFBRztRQUNuREUsT0FBTyxHQUFHLElBQUk7TUFDZixDQUFDLE1BQU0sSUFBSyxNQUFNLEtBQUtKLFNBQVMsRUFBRztRQUNsQ0ksT0FBTyxHQUFHLElBQUk7TUFDZjtNQUVBLElBQUssQ0FBRUEsT0FBTyxFQUFHO1FBQ2hCO01BQ0Q7TUFFQSxJQUFJQyxlQUFlLEdBQUcsQ0FBQztRQUFFQyxNQUFNLEdBQUcsQ0FBQztNQUVuQyxJQUFLeEcsWUFBWSxDQUFDeUcsb0JBQW9CLEVBQUc7UUFDeENGLGVBQWUsR0FBR25HLFFBQVEsQ0FBRUosWUFBWSxDQUFDeUcsb0JBQXFCLENBQUM7TUFDaEU7TUFFQSxJQUFJQyxTQUFTO01BRWIsSUFBS3pHLENBQUMsQ0FBRUQsWUFBWSxDQUFDMkYsbUJBQW9CLENBQUMsQ0FBQ3pCLE1BQU0sRUFBRztRQUNuRHdDLFNBQVMsR0FBRzFHLFlBQVksQ0FBQzJGLG1CQUFtQjtNQUM3QyxDQUFDLE1BQU0sSUFBSzFGLENBQUMsQ0FBRUQsWUFBWSxDQUFDMkcsbUJBQW9CLENBQUMsQ0FBQ3pDLE1BQU0sRUFBRztRQUMxRHdDLFNBQVMsR0FBRzFHLFlBQVksQ0FBQzJHLG1CQUFtQjtNQUM3QztNQUVBLElBQUssUUFBUSxLQUFLM0csWUFBWSxDQUFDaUcsYUFBYSxFQUFHO1FBQzlDUyxTQUFTLEdBQUcxRyxZQUFZLENBQUM0Ryw0QkFBNEI7TUFDdEQ7TUFFQSxJQUFNbEIsVUFBVSxHQUFHekYsQ0FBQyxDQUFFeUcsU0FBVSxDQUFDO01BRWpDLElBQUtoQixVQUFVLENBQUN4QixNQUFNLEVBQUc7UUFDeEJzQyxNQUFNLEdBQUdkLFVBQVUsQ0FBQ2MsTUFBTSxDQUFDLENBQUMsQ0FBQ0ssR0FBRyxHQUFHTixlQUFlO1FBRWxELElBQUtDLE1BQU0sR0FBRyxDQUFDLEVBQUc7VUFDakJBLE1BQU0sR0FBRyxDQUFDO1FBQ1g7UUFFQXZHLENBQUMsQ0FBRSxZQUFhLENBQUMsQ0FBQzZHLElBQUksQ0FBQyxDQUFDLENBQUNDLE9BQU8sQ0FDL0I7VUFBRUMsU0FBUyxFQUFFUjtRQUFPLENBQUMsRUFDckJ4RyxZQUFZLENBQUNpSCxtQkFBbUIsRUFDaENqSCxZQUFZLENBQUNrSCxvQkFDZCxDQUFDO01BQ0Y7SUFDRCxDQUFDO0lBQ0Q7SUFDQUMsc0JBQXNCLEVBQUUsU0FBeEJBLHNCQUFzQkEsQ0FBWUMsV0FBVyxFQUFHO01BQy9DeEcsS0FBSyxDQUFDOEIsSUFBSSxDQUFFLGVBQWdCLENBQUMsQ0FBQ1ksUUFBUSxDQUFFLFdBQVksQ0FBQztNQUVyRCxJQUFLLENBQUU1QyxLQUFLLElBQUksYUFBYSxLQUFLVixZQUFZLENBQUNxSCxrQkFBa0IsRUFBRztRQUNuRTdGLEtBQUssQ0FBQ3dFLFFBQVEsQ0FBQyxDQUFDO01BQ2pCO01BRUFuRixTQUFTLENBQUNrRSxPQUFPLENBQUUsZ0NBQWdDLEVBQUUsQ0FBRXFDLFdBQVcsQ0FBRyxDQUFDO0lBQ3ZFLENBQUM7SUFDREUscUJBQXFCLEVBQUUsU0FBdkJBLHFCQUFxQkEsQ0FBQSxFQUFhO01BQ2pDLElBQUt0SCxZQUFZLENBQUN1SCxXQUFXLEVBQUc7UUFDL0I7UUFDQWhHLGNBQWMsQ0FBQ2lHLE9BQU8sQ0FBRSxVQUFBQyxRQUFRLEVBQUk7VUFDbkNBLFFBQVEsQ0FBQ0MsT0FBTyxDQUFDLENBQUM7UUFDbkIsQ0FBRSxDQUFDO1FBQ0huRyxjQUFjLENBQUMyQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7TUFDNUI7SUFDRCxDQUFDO0lBQ0Q7SUFDQXlELHNCQUFzQixFQUFFLFNBQXhCQSxzQkFBc0JBLENBQVlsQyxTQUFTLEVBQUUyQixXQUFXLEVBQUc7TUFDMUR4RyxLQUFLLENBQUM4QixJQUFJLENBQUUsZUFBZ0IsQ0FBQyxDQUFDVyxXQUFXLENBQUUsV0FBWSxDQUFDOztNQUV4RDtNQUNBN0IsS0FBSyxDQUFDOEYscUJBQXFCLENBQUMsQ0FBQztNQUU3QnpHLFNBQVMsQ0FBQ2tFLE9BQU8sQ0FBRSxnQ0FBZ0MsRUFBRSxDQUFFVSxTQUFTLEVBQUUyQixXQUFXLENBQUcsQ0FBQztJQUNsRixDQUFDO0lBQ0RRLHFCQUFxQixFQUFFLFNBQXZCQSxxQkFBcUJBLENBQVluQyxTQUFTLEVBQUUyQixXQUFXLEVBQUc7TUFDekQ1RixLQUFLLENBQUNnRSx5QkFBeUIsQ0FBRUMsU0FBVSxDQUFDOztNQUU1QztNQUNBakUsS0FBSyxDQUFDcUcsSUFBSSxDQUFDLENBQUM7TUFFWixJQUFLLENBQUVuSCxLQUFLLElBQUksT0FBTyxLQUFLVixZQUFZLENBQUNxSCxrQkFBa0IsRUFBRztRQUM3RDdGLEtBQUssQ0FBQ3dFLFFBQVEsQ0FBQyxDQUFDO01BQ2pCOztNQUVBO01BQ0EvRixDQUFDLENBQUVhLFFBQVMsQ0FBQyxDQUFDaUUsT0FBTyxDQUFFLE9BQVEsQ0FBQztNQUNoQzlFLENBQUMsQ0FBRUMsTUFBTyxDQUFDLENBQUM2RSxPQUFPLENBQUUsUUFBUyxDQUFDO01BQy9COUUsQ0FBQyxDQUFFQyxNQUFPLENBQUMsQ0FBQzZFLE9BQU8sQ0FBRSxRQUFTLENBQUM7O01BRS9CO01BQ0E5RSxDQUFDLENBQUVDLE1BQU8sQ0FBQyxDQUFDNkUsT0FBTyxDQUFFLFVBQVcsQ0FBQztNQUVqQyxJQUFLL0UsWUFBWSxDQUFDOEgsY0FBYyxFQUFHO1FBQ2xDQyxJQUFJLENBQUUvSCxZQUFZLENBQUM4SCxjQUFlLENBQUM7TUFDcEM7TUFFQWpILFNBQVMsQ0FBQ2tFLE9BQU8sQ0FBRSwrQkFBK0IsRUFBRSxDQUFFVSxTQUFTLEVBQUUyQixXQUFXLENBQUcsQ0FBQztJQUNqRixDQUFDO0lBQ0RZLGNBQWMsRUFBRSxTQUFoQkEsY0FBY0EsQ0FBQSxFQUFxQztNQUFBLElBQXpCWixXQUFXLEdBQUFhLFNBQUEsQ0FBQS9ELE1BQUEsUUFBQStELFNBQUEsUUFBQUMsU0FBQSxHQUFBRCxTQUFBLE1BQUcsUUFBUTtNQUMvQ3pHLEtBQUssQ0FBQzJGLHNCQUFzQixDQUFFQyxXQUFZLENBQUM7TUFFM0NuSCxDQUFDLENBQUNrSSxJQUFJLENBQUU7UUFDUC9DLEdBQUcsRUFBRWxGLE1BQU0sQ0FBQ2tJLFFBQVEsQ0FBQ0MsSUFBSTtRQUN6QkMsT0FBTyxFQUFFLFNBQVRBLE9BQU9BLENBQVlDLFFBQVEsRUFBRztVQUM3QixJQUFNOUMsU0FBUyxHQUFHeEYsQ0FBQyxDQUFFc0ksUUFBUyxDQUFDO1VBRS9CL0csS0FBSyxDQUFDbUcsc0JBQXNCLENBQUVsQyxTQUFTLEVBQUUyQixXQUFZLENBQUM7O1VBRXREO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7VUFDSyxJQUFLcEgsWUFBWSxDQUFDd0kscUJBQXFCLEVBQUc7WUFDekMxSCxRQUFRLENBQUMySCxLQUFLLEdBQUdoRCxTQUFTLENBQUNpRCxNQUFNLENBQUUsT0FBUSxDQUFDLENBQUNwRSxJQUFJLENBQUMsQ0FBQztVQUNwRDs7VUFFQTtVQUFBLElBQUFxRSxLQUFBLFlBQUFBLE1BQUEsRUFDZ0M7WUFBMUIsSUFBTXZILEVBQUUsR0FBQXdILFlBQUEsQ0FBQUMsRUFBQTtZQUNiLElBQU1DLFVBQVUsR0FBRyxZQUFZLEdBQUcxSCxFQUFFLEdBQUcsSUFBSTtZQUMzQyxJQUFNMkgsU0FBUyxHQUFJOUksQ0FBQyxDQUFFNkksVUFBVyxDQUFDO1lBQ2xDLElBQU1yRixNQUFNLEdBQU9zRixTQUFTLENBQUNyRyxJQUFJLENBQUUscUJBQXNCLENBQUM7WUFDMUQsSUFBTXNHLFNBQVMsR0FBSXZELFNBQVMsQ0FBQy9DLElBQUksQ0FBRW9HLFVBQVcsQ0FBQzs7WUFFL0M7WUFDQSxJQUFLOUksWUFBWSxDQUFDaUosa0NBQWtDLEVBQUc7Y0FDdEQsSUFBS0YsU0FBUyxDQUFDbkYsUUFBUSxDQUFFLHlCQUEwQixDQUFDLEVBQUc7Z0JBQ3REbUYsU0FBUyxDQUFDckcsSUFBSSxDQUFFLG1DQUFvQyxDQUFDLENBQUN2QixJQUFJLENBQUUsWUFBVztrQkFDdEUsSUFBTVEsR0FBRyxHQUFHMUIsQ0FBQyxDQUFFLElBQUssQ0FBQztrQkFDckIsSUFBTW1CLEVBQUUsR0FBSU8sR0FBRyxDQUFDTixJQUFJLENBQUUsSUFBSyxDQUFDO2tCQUU1QixJQUFNNkgsY0FBYyxrREFBQUMsTUFBQSxDQUFrRC9ILEVBQUUsUUFBSzs7a0JBRTdFO2tCQUNBLElBQU1RLE9BQU8sR0FBR0QsR0FBRyxDQUFDRSxJQUFJLENBQUUsY0FBZSxDQUFDLEtBQUssTUFBTTtrQkFFckQsSUFBS0QsT0FBTyxFQUFHO29CQUNkb0gsU0FBUyxDQUFDdEcsSUFBSSxDQUFFd0csY0FBZSxDQUFDLENBQUNySCxJQUFJLENBQUUsY0FBYyxFQUFFLE1BQU8sQ0FBQztvQkFDL0RtSCxTQUFTLENBQUN0RyxJQUFJLENBQUV3RyxjQUFlLENBQUMsQ0FBQ25ILE9BQU8sQ0FBRSxJQUFLLENBQUMsQ0FBQ0MsUUFBUSxDQUFFLElBQUssQ0FBQyxDQUFDNEMsSUFBSSxDQUFDLENBQUM7a0JBQ3pFLENBQUMsTUFBTTtvQkFDTm9FLFNBQVMsQ0FBQ3RHLElBQUksQ0FBRXdHLGNBQWUsQ0FBQyxDQUFDckgsSUFBSSxDQUFFLGNBQWMsRUFBRSxPQUFRLENBQUM7b0JBQ2hFbUgsU0FBUyxDQUFDdEcsSUFBSSxDQUFFd0csY0FBZSxDQUFDLENBQUNuSCxPQUFPLENBQUUsSUFBSyxDQUFDLENBQUNDLFFBQVEsQ0FBRSxJQUFLLENBQUMsQ0FBQ3VDLElBQUksQ0FBQyxDQUFDO2tCQUN6RTtnQkFDRCxDQUFFLENBQUM7Y0FDSjtZQUNEOztZQUVBO1lBQ0EsSUFBS3ZFLFlBQVksQ0FBQ29KLHlCQUF5QixFQUFHO2NBQzdDLElBQUtMLFNBQVMsQ0FBQ25GLFFBQVEsQ0FBRSxnQkFBaUIsQ0FBQyxFQUFHO2dCQUM3QyxJQUFNUixZQUFZLEdBQUcyRixTQUFTLENBQUNyRyxJQUFJLENBQUUscUJBQXNCLENBQUM7Z0JBRTVELElBQUtVLFlBQVksQ0FBQ1EsUUFBUSxDQUFFLHFCQUFzQixDQUFDLEVBQUc7a0JBQ3JEb0YsU0FBUyxDQUFDdEcsSUFBSSxDQUFFLHFCQUFzQixDQUFDLENBQUNZLFFBQVEsQ0FBRSxxQkFBc0IsQ0FBQztrQkFDekUwRixTQUFTLENBQUN0RyxJQUFJLENBQUUsMkJBQTRCLENBQUMsQ0FBQ2IsSUFBSSxDQUFFLGNBQWMsRUFBRSxNQUFPLENBQUM7Z0JBQzdFLENBQUMsTUFBTTtrQkFDTm1ILFNBQVMsQ0FBQ3RHLElBQUksQ0FBRSxxQkFBc0IsQ0FBQyxDQUFDVyxXQUFXLENBQUUscUJBQXNCLENBQUM7a0JBQzVFMkYsU0FBUyxDQUFDdEcsSUFBSSxDQUFFLDJCQUE0QixDQUFDLENBQUNiLElBQUksQ0FBRSxjQUFjLEVBQUUsT0FBUSxDQUFDO2dCQUM5RTtjQUNEO1lBQ0Q7WUFFQSxJQUFNd0gsS0FBSyxHQUFHTCxTQUFTLENBQUN0RyxJQUFJLENBQUUscUJBQXNCLENBQUMsQ0FBQ29ELElBQUksQ0FBQyxDQUFDOztZQUU1RDtZQUNBckMsTUFBTSxDQUFDcUMsSUFBSSxDQUFFdUQsS0FBTSxDQUFDO1lBRXBCTixTQUFTLENBQUNoRSxPQUFPLENBQUUsc0JBQXNCLEVBQUUsQ0FBRWlFLFNBQVMsQ0FBRyxDQUFDO1VBQzNELENBQUM7VUFsREQsU0FBQUgsRUFBQSxNQUFBRCxZQUFBLEdBQWtCN0gsV0FBVyxFQUFBOEgsRUFBQSxHQUFBRCxZQUFBLENBQUExRSxNQUFBLEVBQUEyRSxFQUFBO1lBQUFGLEtBQUE7VUFBQTs7VUFvRDdCO1VBQ0EvSCxLQUFLLENBQUM4QixJQUFJLENBQUUsNkNBQThDLENBQUMsQ0FBQ3ZCLElBQUksQ0FBRSxZQUFXO1lBQzVFLElBQU1xQyxLQUFLLEdBQVF2RCxDQUFDLENBQUUsSUFBSyxDQUFDO1lBQzVCLElBQU02SSxVQUFVLEdBQUcsWUFBWSxHQUFHdEYsS0FBSyxDQUFDbkMsSUFBSSxDQUFFLElBQUssQ0FBQyxHQUFHLElBQUk7WUFFM0RtQyxLQUFLLENBQUNzQyxJQUFJLENBQUVMLFNBQVMsQ0FBQy9DLElBQUksQ0FBRW9HLFVBQVcsQ0FBQyxDQUFDaEQsSUFBSSxDQUFDLENBQUUsQ0FBQztVQUNsRCxDQUFFLENBQUM7O1VBRUg7VUFDQSxJQUFNd0Qsa0JBQWtCLEdBQUc3RCxTQUFTLENBQUMvQyxJQUFJLENBQUUxQyxZQUFZLENBQUMyRixtQkFBb0IsQ0FBQztVQUM3RSxJQUFNNEQsa0JBQWtCLEdBQUc5RCxTQUFTLENBQUMvQyxJQUFJLENBQUUxQyxZQUFZLENBQUMyRyxtQkFBb0IsQ0FBQztVQUU3RSxJQUFLM0csWUFBWSxDQUFDMkYsbUJBQW1CLEtBQUszRixZQUFZLENBQUMyRyxtQkFBbUIsRUFBRztZQUM1RTFHLENBQUMsQ0FBRUQsWUFBWSxDQUFDMkYsbUJBQW9CLENBQUMsQ0FBQ0csSUFBSSxDQUFFd0Qsa0JBQWtCLENBQUN4RCxJQUFJLENBQUMsQ0FBRSxDQUFDO1VBQ3hFLENBQUMsTUFBTTtZQUNOLElBQUs3RixDQUFDLENBQUVELFlBQVksQ0FBQzJHLG1CQUFvQixDQUFDLENBQUN6QyxNQUFNLEVBQUc7Y0FDbkQsSUFBS29GLGtCQUFrQixDQUFDcEYsTUFBTSxFQUFHO2dCQUNoQ2pFLENBQUMsQ0FBRUQsWUFBWSxDQUFDMkcsbUJBQW9CLENBQUMsQ0FBQ2IsSUFBSSxDQUFFd0Qsa0JBQWtCLENBQUN4RCxJQUFJLENBQUMsQ0FBRSxDQUFDO2NBQ3hFLENBQUMsTUFBTSxJQUFLeUQsa0JBQWtCLENBQUNyRixNQUFNLEVBQUc7Z0JBQ3ZDakUsQ0FBQyxDQUFFRCxZQUFZLENBQUMyRyxtQkFBb0IsQ0FBQyxDQUFDYixJQUFJLENBQUV5RCxrQkFBa0IsQ0FBQ3pELElBQUksQ0FBQyxDQUFFLENBQUM7Y0FDeEU7WUFDRCxDQUFDLE1BQU0sSUFBSzdGLENBQUMsQ0FBRUQsWUFBWSxDQUFDMkYsbUJBQW9CLENBQUMsQ0FBQ3pCLE1BQU0sRUFBRztjQUMxRCxJQUFLb0Ysa0JBQWtCLENBQUNwRixNQUFNLEVBQUc7Z0JBQ2hDakUsQ0FBQyxDQUFFRCxZQUFZLENBQUMyRixtQkFBb0IsQ0FBQyxDQUFDRyxJQUFJLENBQUV3RCxrQkFBa0IsQ0FBQ3hELElBQUksQ0FBQyxDQUFFLENBQUM7Y0FDeEUsQ0FBQyxNQUFNLElBQUt5RCxrQkFBa0IsQ0FBQ3JGLE1BQU0sRUFBRztnQkFDdkNqRSxDQUFDLENBQUVELFlBQVksQ0FBQzJGLG1CQUFvQixDQUFDLENBQUNHLElBQUksQ0FBRXlELGtCQUFrQixDQUFDekQsSUFBSSxDQUFDLENBQUUsQ0FBQztjQUN4RTtZQUNEO1VBQ0Q7VUFFQXRFLEtBQUssQ0FBQ29HLHFCQUFxQixDQUFFbkMsU0FBUyxFQUFFMkIsV0FBWSxDQUFDO1FBQ3REO01BQ0QsQ0FBRSxDQUFDO0lBQ0osQ0FBQztJQUNEN0IsYUFBYSxFQUFFLFNBQWZBLGFBQWFBLENBQVlILEdBQUcsRUFBMkI7TUFBQSxJQUF6QmdDLFdBQVcsR0FBQWEsU0FBQSxDQUFBL0QsTUFBQSxRQUFBK0QsU0FBQSxRQUFBQyxTQUFBLEdBQUFELFNBQUEsTUFBRyxRQUFRO01BQ25ELElBQUssQ0FBRTdDLEdBQUcsRUFBRztRQUNaO01BQ0Q7TUFFQSxJQUFLcEYsWUFBWSxDQUFDd0osWUFBWSxFQUFHO1FBQ2hDdEosTUFBTSxDQUFDa0ksUUFBUSxDQUFDQyxJQUFJLEdBQUdqRCxHQUFHO01BQzNCLENBQUMsTUFBTTtRQUNOcUUsT0FBTyxDQUFDQyxTQUFTLENBQUU7VUFBRUMsS0FBSyxFQUFFO1FBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRXZFLEdBQUksQ0FBQztRQUU3QzVELEtBQUssQ0FBQ3dHLGNBQWMsQ0FBRVosV0FBWSxDQUFDO01BQ3BDO0lBQ0QsQ0FBQztJQUNEd0Msd0JBQXdCLEVBQUUsU0FBMUJBLHdCQUF3QkEsQ0FBQSxFQUFhO01BQ3BDLElBQU1DLG9CQUFvQixHQUFHLGdFQUFnRTtNQUU3RmpKLEtBQUssQ0FBQzBCLEVBQUUsQ0FBRSxPQUFPLEVBQUV1SCxvQkFBb0IsRUFBRSxZQUFXO1FBQ25ELElBQU1DLEtBQUssR0FBRzdKLENBQUMsQ0FBRSxJQUFLLENBQUM7UUFFdkIsSUFBTThKLFlBQVksR0FBUUQsS0FBSyxDQUFDL0gsT0FBTyxDQUFFLHFCQUFzQixDQUFDO1FBQ2hFLElBQU1pSSxhQUFhLEdBQU9ELFlBQVksQ0FBQ2xJLElBQUksQ0FBRSxxQkFBc0IsQ0FBQztRQUNwRSxJQUFNb0ksYUFBYSxHQUFPQyxVQUFVLENBQUVILFlBQVksQ0FBQ2xJLElBQUksQ0FBRSxzQkFBdUIsQ0FBRSxDQUFDO1FBQ25GLElBQU1zSSxhQUFhLEdBQU9ELFVBQVUsQ0FBRUgsWUFBWSxDQUFDbEksSUFBSSxDQUFFLHNCQUF1QixDQUFFLENBQUM7UUFDbkYsSUFBTXVJLFdBQVcsR0FBU0YsVUFBVSxDQUFFSCxZQUFZLENBQUNsSSxJQUFJLENBQUUsZ0JBQWlCLENBQUUsQ0FBQztRQUM3RSxJQUFNd0ksV0FBVyxHQUFTSCxVQUFVLENBQUVILFlBQVksQ0FBQ2xJLElBQUksQ0FBRSxnQkFBaUIsQ0FBRSxDQUFDO1FBQzdFLElBQU15SSxhQUFhLEdBQU9QLFlBQVksQ0FBQ2xJLElBQUksQ0FBRSxxQkFBc0IsQ0FBQztRQUNwRSxJQUFNMEksaUJBQWlCLEdBQUdSLFlBQVksQ0FBQ2xJLElBQUksQ0FBRSx5QkFBMEIsQ0FBQztRQUN4RSxJQUFNMkksZ0JBQWdCLEdBQUlULFlBQVksQ0FBQ2xJLElBQUksQ0FBRSx3QkFBeUIsQ0FBQzs7UUFFdkU7UUFDQW9ELFlBQVksQ0FBRTZFLEtBQUssQ0FBQ3pJLElBQUksQ0FBRSxPQUFRLENBQUUsQ0FBQztRQUVyQyxJQUFNb0osUUFBUSxHQUFHLFNBQVhBLFFBQVFBLENBQUtDLFVBQVUsRUFBTTtVQUNsQyxJQUFLVixhQUFhLEVBQUc7WUFDcEIsT0FBT1csWUFBWSxDQUFFRCxVQUFVLEVBQUVKLGFBQWEsRUFBRUUsZ0JBQWdCLEVBQUVELGlCQUFrQixDQUFDO1VBQ3RGO1VBRUEsT0FBT0csVUFBVTtRQUNsQixDQUFDO1FBRURaLEtBQUssQ0FBQ3pJLElBQUksQ0FBRSxPQUFPLEVBQUVpRSxVQUFVLENBQUUsWUFBVztVQUMzQ3dFLEtBQUssQ0FBQ2MsVUFBVSxDQUFFLE9BQVEsQ0FBQztVQUUzQixJQUFJQyxRQUFRLEdBQUdYLFVBQVUsQ0FBRUgsWUFBWSxDQUFDckgsSUFBSSxDQUFFLFlBQWEsQ0FBQyxDQUFDdUIsR0FBRyxDQUFDLENBQUUsQ0FBQztVQUNwRSxJQUFJNkcsUUFBUSxHQUFHWixVQUFVLENBQUVILFlBQVksQ0FBQ3JILElBQUksQ0FBRSxZQUFhLENBQUMsQ0FBQ3VCLEdBQUcsQ0FBQyxDQUFFLENBQUM7O1VBRXBFO1VBQ0EsSUFBSzhHLEtBQUssQ0FBRUYsUUFBUyxDQUFDLEVBQUc7WUFDeEJBLFFBQVEsR0FBR1osYUFBYTtZQUV4QkYsWUFBWSxDQUFDckgsSUFBSSxDQUFFLFlBQWEsQ0FBQyxDQUFDdUIsR0FBRyxDQUFFd0csUUFBUSxDQUFFSSxRQUFTLENBQUUsQ0FBQztVQUM5RCxDQUFDLE1BQU07WUFDTmQsWUFBWSxDQUFDckgsSUFBSSxDQUFFLFlBQWEsQ0FBQyxDQUFDdUIsR0FBRyxDQUFFd0csUUFBUSxDQUFFSSxRQUFTLENBQUUsQ0FBQztVQUM5RDs7VUFFQTtVQUNBLElBQUtFLEtBQUssQ0FBRUQsUUFBUyxDQUFDLEVBQUc7WUFDeEJBLFFBQVEsR0FBR1gsYUFBYTtZQUV4QkosWUFBWSxDQUFDckgsSUFBSSxDQUFFLFlBQWEsQ0FBQyxDQUFDdUIsR0FBRyxDQUFFd0csUUFBUSxDQUFFSyxRQUFTLENBQUUsQ0FBQztVQUM5RCxDQUFDLE1BQU07WUFDTmYsWUFBWSxDQUFDckgsSUFBSSxDQUFFLFlBQWEsQ0FBQyxDQUFDdUIsR0FBRyxDQUFFd0csUUFBUSxDQUFFSyxRQUFTLENBQUUsQ0FBQztVQUM5RDs7VUFFQTtVQUNBLElBQUtELFFBQVEsR0FBR1osYUFBYSxFQUFHO1lBQy9CWSxRQUFRLEdBQUdaLGFBQWE7WUFFeEJGLFlBQVksQ0FBQ3JILElBQUksQ0FBRSxZQUFhLENBQUMsQ0FBQ3VCLEdBQUcsQ0FBRXdHLFFBQVEsQ0FBRUksUUFBUyxDQUFFLENBQUM7VUFDOUQ7O1VBRUE7VUFDQSxJQUFLQSxRQUFRLEdBQUdWLGFBQWEsRUFBRztZQUMvQlUsUUFBUSxHQUFHVixhQUFhO1lBRXhCSixZQUFZLENBQUNySCxJQUFJLENBQUUsWUFBYSxDQUFDLENBQUN1QixHQUFHLENBQUV3RyxRQUFRLENBQUVJLFFBQVMsQ0FBRSxDQUFDO1VBQzlEOztVQUVBO1VBQ0EsSUFBS0MsUUFBUSxHQUFHWCxhQUFhLEVBQUc7WUFDL0JXLFFBQVEsR0FBR1gsYUFBYTtZQUV4QkosWUFBWSxDQUFDckgsSUFBSSxDQUFFLFlBQWEsQ0FBQyxDQUFDdUIsR0FBRyxDQUFFd0csUUFBUSxDQUFFSyxRQUFTLENBQUUsQ0FBQztVQUM5RDs7VUFFQTtVQUNBLElBQUtELFFBQVEsR0FBR0MsUUFBUSxFQUFHO1lBQzFCQSxRQUFRLEdBQUdELFFBQVE7WUFFbkJkLFlBQVksQ0FBQ3JILElBQUksQ0FBRSxZQUFhLENBQUMsQ0FBQ3VCLEdBQUcsQ0FBRXdHLFFBQVEsQ0FBRUssUUFBUyxDQUFFLENBQUM7VUFDOUQ7O1VBRUE7VUFDQSxJQUFLRCxRQUFRLEtBQUtULFdBQVcsSUFBSVUsUUFBUSxLQUFLVCxXQUFXLEVBQUc7WUFDM0Q7VUFDRDtVQUVBLElBQUtRLFFBQVEsS0FBS1osYUFBYSxJQUFJYSxRQUFRLEtBQUtYLGFBQWEsRUFBRztZQUMvRDtZQUNBM0ksS0FBSyxDQUFDK0QsYUFBYSxDQUFFd0UsWUFBWSxDQUFDMUksSUFBSSxDQUFFLGtCQUFtQixDQUFFLENBQUM7VUFDL0QsQ0FBQyxNQUFNO1lBQ047WUFDQSxJQUFNK0QsR0FBRyxHQUFHMkUsWUFBWSxDQUFDMUksSUFBSSxDQUFFLEtBQU0sQ0FBQyxDQUFDZ0UsT0FBTyxDQUFFLEtBQUssRUFBRXdGLFFBQVMsQ0FBQyxDQUFDeEYsT0FBTyxDQUFFLEtBQUssRUFBRXlGLFFBQVMsQ0FBQztZQUM1RnRKLEtBQUssQ0FBQytELGFBQWEsQ0FBRUgsR0FBSSxDQUFDO1VBQzNCO1FBQ0QsQ0FBQyxFQUFFOUUsS0FBTSxDQUFFLENBQUM7TUFDYixDQUFFLENBQUM7SUFDSixDQUFDO0lBQ0QwSyxzQkFBc0IsRUFBRSxTQUF4QkEsc0JBQXNCQSxDQUFBLEVBQWE7TUFDbENwSyxLQUFLLENBQUMwQixFQUFFLENBQUUsUUFBUSxFQUFFLCtCQUErQixFQUFFLFlBQVc7UUFDL0QsSUFBTW9CLE9BQU8sR0FBR3pELENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQzhCLE9BQU8sQ0FBRSxtQkFBb0IsQ0FBQztRQUN4RCxJQUFNa0osT0FBTyxHQUFHdkgsT0FBTyxDQUFDckMsSUFBSSxDQUFFLFVBQVcsQ0FBQztRQUUxQyxJQUFJNkosU0FBUyxHQUFHLEVBQUU7O1FBRWxCO1FBQ0FqRyxZQUFZLENBQUV2QixPQUFPLENBQUNyQyxJQUFJLENBQUUsT0FBUSxDQUFFLENBQUM7UUFFdkMsSUFBSzRKLE9BQU8sRUFBRztVQUNkLElBQU1FLElBQUksR0FBR3pILE9BQU8sQ0FBQ2hCLElBQUksQ0FBRSxrQkFBbUIsQ0FBQyxDQUFDdUIsR0FBRyxDQUFDLENBQUM7VUFDckQsSUFBTW1ILEVBQUUsR0FBSzFILE9BQU8sQ0FBQ2hCLElBQUksQ0FBRSxnQkFBaUIsQ0FBQyxDQUFDdUIsR0FBRyxDQUFDLENBQUM7VUFFbkQsSUFBS2tILElBQUksSUFBSUMsRUFBRSxFQUFHO1lBQ2pCRixTQUFTLEdBQUd4SCxPQUFPLENBQUNyQyxJQUFJLENBQUUsS0FBTSxDQUFDLENBQUNnRSxPQUFPLENBQUUsS0FBSyxFQUFFOEYsSUFBSyxDQUFDLENBQUM5RixPQUFPLENBQUUsS0FBSyxFQUFFK0YsRUFBRyxDQUFDO1VBQzlFLENBQUMsTUFBTSxJQUFLLENBQUVELElBQUksSUFBSSxDQUFFQyxFQUFFLEVBQUc7WUFDNUJGLFNBQVMsR0FBR3hILE9BQU8sQ0FBQ3JDLElBQUksQ0FBRSxrQkFBbUIsQ0FBQztVQUMvQztRQUNELENBQUMsTUFBTTtVQUNOLElBQU04SixLQUFJLEdBQUd6SCxPQUFPLENBQUNoQixJQUFJLENBQUUsa0JBQW1CLENBQUMsQ0FBQ3VCLEdBQUcsQ0FBQyxDQUFDO1VBRXJELElBQUtrSCxLQUFJLEVBQUc7WUFDWEQsU0FBUyxHQUFHeEgsT0FBTyxDQUFDckMsSUFBSSxDQUFFLEtBQU0sQ0FBQyxDQUFDZ0UsT0FBTyxDQUFFLElBQUksRUFBRThGLEtBQUssQ0FBQztVQUN4RCxDQUFDLE1BQU07WUFDTkQsU0FBUyxHQUFHeEgsT0FBTyxDQUFDckMsSUFBSSxDQUFFLGtCQUFtQixDQUFDO1VBQy9DO1FBQ0Q7UUFFQSxJQUFLNkosU0FBUyxFQUFHO1VBQ2hCeEgsT0FBTyxDQUFDckMsSUFBSSxDQUFFLE9BQU8sRUFBRWlFLFVBQVUsQ0FBRSxZQUFXO1lBQzdDNUIsT0FBTyxDQUFDa0gsVUFBVSxDQUFFLE9BQVEsQ0FBQztZQUU3QnBKLEtBQUssQ0FBQytELGFBQWEsQ0FBRTJGLFNBQVUsQ0FBQztVQUNqQyxDQUFDLEVBQUU1SyxLQUFNLENBQUUsQ0FBQztRQUNiO01BQ0QsQ0FBRSxDQUFDO0lBQ0osQ0FBQztJQUNEK0ssaUJBQWlCLEVBQUUsU0FBbkJBLGlCQUFpQkEsQ0FBQSxFQUFhO01BQzdCLElBQU1DLFlBQVksR0FBRyxzQ0FBc0MsR0FDMUQsbUNBQW1DLEdBQ25DLDhDQUE4QztNQUUvQzFLLEtBQUssQ0FBQzBCLEVBQUUsQ0FBRSxRQUFRLEVBQUVnSixZQUFZLEVBQUUsWUFBVztRQUM1Q3JMLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQzhCLE9BQU8sQ0FBRSxvQkFBcUIsQ0FBQyxDQUFDd0osV0FBVyxDQUFFLGFBQWMsQ0FBQztRQUV0RS9KLEtBQUssQ0FBQytELGFBQWEsQ0FBRXRGLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQ29CLElBQUksQ0FBRSxLQUFNLENBQUUsQ0FBQztNQUMvQyxDQUFFLENBQUM7TUFFSCxJQUFNbUssbUJBQW1CLEdBQUcseUJBQXlCO01BRXJENUssS0FBSyxDQUFDMEIsRUFBRSxDQUFFLFFBQVEsRUFBRWtKLG1CQUFtQixHQUFHLG9CQUFvQixFQUFFLFlBQVc7UUFDMUV2TCxDQUFDLENBQUUsSUFBSyxDQUFDLENBQUM4QixPQUFPLENBQUUsb0JBQXFCLENBQUMsQ0FBQ3dKLFdBQVcsQ0FBRSxhQUFjLENBQUM7O1FBRXRFO1FBQ0F0TCxDQUFDLENBQUUsSUFBSyxDQUFDLENBQ1A4QixPQUFPLENBQUV5SixtQkFBb0IsQ0FBQyxDQUM5QjlJLElBQUksQ0FBRSxrREFBbUQsQ0FBQyxDQUMxRCtJLEdBQUcsQ0FBRSxJQUFLLENBQUMsQ0FDWEMsSUFBSSxDQUFFLFNBQVMsRUFBRSxLQUFNLENBQUMsQ0FDeEIzSixPQUFPLENBQUUsb0JBQXFCLENBQUMsQ0FDL0JzQixXQUFXLENBQUUsYUFBYyxDQUFDO1FBRTlCN0IsS0FBSyxDQUFDK0QsYUFBYSxDQUFFdEYsQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDb0IsSUFBSSxDQUFFLEtBQU0sQ0FBRSxDQUFDO01BQy9DLENBQUUsQ0FBQztJQUNKLENBQUM7SUFDRHNLLHFCQUFxQixFQUFFLFNBQXZCQSxxQkFBcUJBLENBQUEsRUFBYTtNQUNqQy9LLEtBQUssQ0FBQzBCLEVBQUUsQ0FBRSxRQUFRLEVBQUUsZ0NBQWdDLEVBQUUsWUFBVztRQUNoRSxJQUFNc0osT0FBTyxHQUFVM0wsQ0FBQyxDQUFFLElBQUssQ0FBQztRQUNoQyxJQUFNNEwsTUFBTSxHQUFXRCxPQUFPLENBQUMzSCxHQUFHLENBQUMsQ0FBQztRQUNwQyxJQUFNaUIsU0FBUyxHQUFRMEcsT0FBTyxDQUFDdkssSUFBSSxDQUFFLEtBQU0sQ0FBQztRQUM1QyxJQUFNOEQsY0FBYyxHQUFHeUcsT0FBTyxDQUFDdkssSUFBSSxDQUFFLGtCQUFtQixDQUFDO1FBQ3pELElBQUkrRCxHQUFHO1FBRVAsSUFBS3lHLE1BQU0sQ0FBQzNILE1BQU0sRUFBRztVQUNwQmtCLEdBQUcsR0FBR0YsU0FBUyxDQUFDRyxPQUFPLENBQUUsSUFBSSxFQUFFd0csTUFBTSxDQUFDcEgsUUFBUSxDQUFDLENBQUUsQ0FBQztRQUNuRCxDQUFDLE1BQU07VUFDTlcsR0FBRyxHQUFHRCxjQUFjO1FBQ3JCO1FBRUEzRCxLQUFLLENBQUMrRCxhQUFhLENBQUVILEdBQUksQ0FBQztNQUMzQixDQUFFLENBQUM7SUFDSixDQUFDO0lBQ0QwRyxnQkFBZ0IsRUFBRSxTQUFsQkEsZ0JBQWdCQSxDQUFBLEVBQWE7TUFDNUIsSUFBSzlMLFlBQVksQ0FBQytMLDBCQUEwQixJQUFJL0wsWUFBWSxDQUFDZ00sb0JBQW9CLEVBQUc7UUFDbkYsSUFBTXRHLFVBQVUsR0FBR3pGLENBQUMsQ0FBRUQsWUFBWSxDQUFDMkYsbUJBQW9CLENBQUM7UUFDeEQsSUFBTXNHLFVBQVUsR0FBR2pNLFlBQVksQ0FBQ2dNLG9CQUFvQixDQUFDRSxLQUFLLENBQUUsR0FBSSxDQUFDO1FBQ2pFLElBQU1DLFNBQVMsR0FBSSxFQUFFO1FBRXJCRixVQUFVLENBQUN6RSxPQUFPLENBQUUsVUFBQTVCLFFBQVEsRUFBSTtVQUMvQixJQUFLQSxRQUFRLEVBQUc7WUFDZnVHLFNBQVMsQ0FBQzdLLElBQUksQ0FBRXNFLFFBQVEsR0FBRyxJQUFLLENBQUM7VUFDbEM7UUFDRCxDQUFFLENBQUM7UUFFSCxJQUFNQSxRQUFRLEdBQUd1RyxTQUFTLENBQUNDLElBQUksQ0FBRSxHQUFJLENBQUM7UUFFdEMsSUFBSzFHLFVBQVUsQ0FBQ3hCLE1BQU0sRUFBRztVQUN4QndCLFVBQVUsQ0FBQ3BELEVBQUUsQ0FBRSxPQUFPLEVBQUVzRCxRQUFRLEVBQUUsVUFBVXJELENBQUMsRUFBRztZQUMvQ0EsQ0FBQyxDQUFDVSxjQUFjLENBQUMsQ0FBQztZQUVsQixJQUFNb0YsSUFBSSxHQUFHcEksQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDNEIsSUFBSSxDQUFFLE1BQU8sQ0FBQztZQUVyQ0wsS0FBSyxDQUFDK0QsYUFBYSxDQUFFOEMsSUFBSSxFQUFFLFVBQVcsQ0FBQztVQUN4QyxDQUFFLENBQUM7UUFDSjtNQUNEO0lBQ0QsQ0FBQztJQUNEZ0Usb0JBQW9CLEVBQUUsU0FBdEJBLG9CQUFvQkEsQ0FBQSxFQUFhO01BQ2hDLElBQUssQ0FBRXJNLFlBQVksQ0FBQ3NNLGVBQWUsRUFBRztRQUNyQztRQUNBMUwsS0FBSyxDQUFDMEIsRUFBRSxDQUFFLFFBQVEsRUFBRXRCLHFCQUFxQixFQUFFLFlBQVc7VUFDckRmLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQzhCLE9BQU8sQ0FBRSxNQUFPLENBQUMsQ0FBQ2dELE9BQU8sQ0FBRSxRQUFTLENBQUM7UUFDaEQsQ0FBRSxDQUFDO1FBRUg7TUFDRDs7TUFFQTtNQUNBbkUsS0FBSyxDQUFDMEIsRUFBRSxDQUFFLFFBQVEsRUFBRXRDLFlBQVksQ0FBQ2lCLFlBQVksRUFBRSxZQUFXO1FBQ3pELE9BQU8sS0FBSztNQUNiLENBQUUsQ0FBQzs7TUFFSDtNQUNBTCxLQUFLLENBQUMwQixFQUFFLENBQUUsUUFBUSxFQUFFdEIscUJBQXFCLEVBQUUsWUFBVztRQUNyRCxJQUFNdUwsS0FBSyxHQUFHdE0sQ0FBQyxDQUFFLElBQUssQ0FBQyxDQUFDZ0UsR0FBRyxDQUFDLENBQUM7UUFFN0IsSUFBTW1CLEdBQUcsR0FBRyxJQUFJb0gsR0FBRyxDQUFFdE0sTUFBTSxDQUFDa0ksUUFBUyxDQUFDO1FBQ3RDaEQsR0FBRyxDQUFDcUgsWUFBWSxDQUFDQyxHQUFHLENBQUUsU0FBUyxFQUFFSCxLQUFNLENBQUM7UUFFeEMvSyxLQUFLLENBQUMrRCxhQUFhLENBQUVvSCxhQUFhLENBQUV2SCxHQUFHLENBQUNpRCxJQUFLLENBQUUsQ0FBQztRQUVoRCxPQUFPLEtBQUs7TUFDYixDQUFFLENBQUM7SUFDSixDQUFDO0lBQ0R1RSxpQkFBaUIsRUFBRSxTQUFuQkEsaUJBQWlCQSxDQUFBLEVBQWE7TUFDN0JoTSxLQUFLLENBQUMwQixFQUFFLENBQUUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLFVBQVVDLENBQUMsRUFBRztRQUMzREEsQ0FBQyxDQUFDQyxlQUFlLENBQUMsQ0FBQztRQUVuQmhCLEtBQUssQ0FBQytELGFBQWEsQ0FBRXRGLENBQUMsQ0FBRSxJQUFLLENBQUMsQ0FBQzRCLElBQUksQ0FBRSx1QkFBd0IsQ0FBRSxDQUFDO01BQ2pFLENBQUUsQ0FBQztJQUNKLENBQUM7SUFDRGdMLG1CQUFtQixFQUFFLFNBQXJCQSxtQkFBbUJBLENBQUEsRUFBYTtNQUMvQjtNQUNBLElBQUssVUFBVSxLQUFLLE9BQU9DLEtBQUssRUFBRztRQUNsQztNQUNEO01BRUEsSUFBSyxDQUFFOU0sWUFBWSxDQUFDdUgsV0FBVyxFQUFHO1FBQ2pDO01BQ0Q7O01BRUE7TUFDQXVGLEtBQUssQ0FBRSx1QkFBdUIsRUFBRTtRQUMvQkMsU0FBUyxFQUFFLEtBQUs7UUFDaEJDLE9BQU8sV0FBUEEsT0FBT0EsQ0FBRUMsU0FBUyxFQUFHO1VBQ3BCLE9BQU9BLFNBQVMsQ0FBQ0MsWUFBWSxDQUFFLGNBQWUsQ0FBQztRQUNoRCxDQUFDO1FBQ0RDLFNBQVMsRUFBRTtNQUNaLENBQUUsQ0FBQztJQUNKLENBQUM7SUFDREMsWUFBWSxFQUFFLFNBQWRBLFlBQVlBLENBQUEsRUFBYTtNQUN4QixJQUFLLENBQUVDLE1BQU0sQ0FBQyxDQUFDLENBQUNDLFdBQVcsRUFBRztRQUM3QjtNQUNEO01BRUEsSUFBTUMsY0FBYyxHQUFHLFNBQWpCQSxjQUFjQSxDQUFLakosSUFBSSxFQUFFakQsSUFBSSxFQUFNO1FBQ3hDLE9BQU8sQ0FDTixRQUFRLEdBQUdpRCxJQUFJLEdBQUcsU0FBUyxFQUMzQiw0QkFBNEIsR0FBR2pELElBQUksQ0FBRSxhQUFhLENBQUUsR0FBRyxTQUFTLENBQ2hFLENBQUMrSyxJQUFJLENBQUUsRUFBRyxDQUFDO01BQ2IsQ0FBQztNQUVELElBQU1vQixpQkFBaUIsR0FBRyxTQUFwQkEsaUJBQWlCQSxDQUFLbEosSUFBSSxFQUFFakQsSUFBSSxFQUFNO1FBQzNDLE9BQU8sQ0FDTiwyQkFBMkIsR0FBR0EsSUFBSSxDQUFDb00sS0FBSyxHQUFHLElBQUksR0FBR25KLElBQUksR0FBRyxTQUFTLEVBQ2xFLHVDQUF1QyxHQUFHakQsSUFBSSxDQUFDb00sS0FBSyxHQUFHLElBQUksR0FBR3BNLElBQUksQ0FBRSxhQUFhLENBQUUsR0FBRyxTQUFTLENBQy9GLENBQUMrSyxJQUFJLENBQUUsRUFBRyxDQUFDO01BQ2IsQ0FBQztNQUVELElBQU1zQixRQUFRLEdBQUc7UUFDaEJDLHNCQUFzQixFQUFFLElBQUk7UUFDNUJDLHNCQUFzQixFQUFFLElBQUk7UUFDNUJDLGVBQWUsRUFBRTdOLFlBQVksQ0FBQzhOLHdCQUF3QjtRQUN0REMsaUJBQWlCLEVBQUUvTixZQUFZLENBQUNnTywwQkFBMEI7UUFDMURDLGVBQWUsRUFBRSxJQUFJO1FBQUU7UUFDdkJDLGdCQUFnQixFQUFFLElBQUksQ0FBRTtNQUN6QixDQUFDO01BRUQsSUFBS2xPLFlBQVksQ0FBQ21PLE1BQU0sRUFBRztRQUMxQlQsUUFBUSxDQUFFLEtBQUssQ0FBRSxHQUFHLElBQUk7TUFDekI7TUFFQTlNLEtBQUssQ0FBQzhCLElBQUksQ0FBRSxlQUFnQixDQUFDLENBQUN2QixJQUFJLENBQUUsWUFBVztRQUM5QyxJQUFNaU4sS0FBSyxHQUFLbk8sQ0FBQyxDQUFFLElBQUssQ0FBQztRQUN6QixJQUFNb08sT0FBTyxHQUFBQyxhQUFBLEtBQVFaLFFBQVEsQ0FBRTs7UUFFL0I7UUFDQSxJQUFLVSxLQUFLLENBQUN4SyxRQUFRLENBQUUsZUFBZ0IsQ0FBQyxFQUFHO1VBQ3hDeUssT0FBTyxDQUFFLDBCQUEwQixDQUFFLEdBQUcsSUFBSTtRQUM3QyxDQUFDLE1BQU07VUFDTkEsT0FBTyxDQUFFLDBCQUEwQixDQUFFLEdBQUdyTyxZQUFZLENBQUN1TyxpQ0FBaUM7UUFDdkY7O1FBRUE7UUFDQSxJQUFLSCxLQUFLLENBQUN4SyxRQUFRLENBQUUsWUFBYSxDQUFDLEVBQUc7VUFDckN5SyxPQUFPLENBQUUsZ0JBQWdCLENBQUUsR0FBTWQsY0FBYztVQUMvQ2MsT0FBTyxDQUFFLG1CQUFtQixDQUFFLEdBQUdiLGlCQUFpQjtRQUNuRDs7UUFFQTtRQUNBLElBQUssQ0FBRVksS0FBSyxDQUFDL00sSUFBSSxDQUFFLGVBQWdCLENBQUMsRUFBRztVQUN0Q2dOLE9BQU8sQ0FBRSxnQkFBZ0IsQ0FBRSxHQUFHLElBQUk7UUFDbkM7UUFFQUQsS0FBSyxDQUFDZCxXQUFXLENBQUVlLE9BQVEsQ0FBQztNQUM3QixDQUFFLENBQUM7O01BRUg7TUFDQSxJQUFLck8sWUFBWSxDQUFDd08sMEJBQTBCLEVBQUc7UUFDOUMsSUFBSUMsYUFBYSxHQUFHLElBQUk7UUFFeEIsSUFBS3pPLFlBQVksQ0FBQzBPLDZCQUE2QixFQUFHO1VBQ2pERCxhQUFhLEdBQUcsS0FBSztRQUN0QjtRQUVBLElBQU1KLE9BQU8sR0FBQUMsYUFBQSxLQUFRWixRQUFRLENBQUU7UUFFL0JXLE9BQU8sQ0FBRSxnQkFBZ0IsQ0FBRSxHQUFHSSxhQUFhO1FBRTNDN04sS0FBSyxDQUFDOEIsSUFBSSxDQUFFMUIscUJBQXNCLENBQUMsQ0FBQ3NNLFdBQVcsQ0FBRWUsT0FBUSxDQUFDO01BQzNEO0lBQ0QsQ0FBQztJQUNETSxlQUFlLEVBQUUsU0FBakJBLGVBQWVBLENBQUEsRUFBYTtNQUMzQixJQUFLLFdBQVcsS0FBSyxPQUFPQyxVQUFVLEVBQUc7UUFDeEM7TUFDRDtNQUVBaE8sS0FBSyxDQUFDOEIsSUFBSSxDQUFFLHFCQUFzQixDQUFDLENBQUN2QixJQUFJLENBQUUsWUFBVztRQUNwRCxJQUFNMkksS0FBSyxHQUFLN0osQ0FBQyxDQUFFLElBQUssQ0FBQztRQUN6QixJQUFNNE8sT0FBTyxHQUFHL0UsS0FBSyxDQUFDcEgsSUFBSSxDQUFFLG9CQUFxQixDQUFDO1FBRWxELElBQU1vTSxRQUFRLEdBQVlELE9BQU8sQ0FBQ2hOLElBQUksQ0FBRSxJQUFLLENBQUM7UUFDOUMsSUFBTWtOLGVBQWUsR0FBS2pGLEtBQUssQ0FBQ2pJLElBQUksQ0FBRSx3QkFBeUIsQ0FBQztRQUNoRSxJQUFNbUksYUFBYSxHQUFPRixLQUFLLENBQUNqSSxJQUFJLENBQUUscUJBQXNCLENBQUM7UUFDN0QsSUFBTW9JLGFBQWEsR0FBT0MsVUFBVSxDQUFFSixLQUFLLENBQUNqSSxJQUFJLENBQUUsc0JBQXVCLENBQUUsQ0FBQztRQUM1RSxJQUFNc0ksYUFBYSxHQUFPRCxVQUFVLENBQUVKLEtBQUssQ0FBQ2pJLElBQUksQ0FBRSxzQkFBdUIsQ0FBRSxDQUFDO1FBQzVFLElBQU1tTixJQUFJLEdBQWdCOUUsVUFBVSxDQUFFSixLQUFLLENBQUNqSSxJQUFJLENBQUUsV0FBWSxDQUFFLENBQUM7UUFDakUsSUFBTXlJLGFBQWEsR0FBT1IsS0FBSyxDQUFDakksSUFBSSxDQUFFLHFCQUFzQixDQUFDO1FBQzdELElBQU0wSSxpQkFBaUIsR0FBR1QsS0FBSyxDQUFDakksSUFBSSxDQUFFLHlCQUEwQixDQUFDO1FBQ2pFLElBQU0ySSxnQkFBZ0IsR0FBSVYsS0FBSyxDQUFDakksSUFBSSxDQUFFLHdCQUF5QixDQUFDO1FBQ2hFLElBQU1nSixRQUFRLEdBQVlYLFVBQVUsQ0FBRUosS0FBSyxDQUFDakksSUFBSSxDQUFFLGdCQUFpQixDQUFFLENBQUM7UUFDdEUsSUFBTWlKLFFBQVEsR0FBWVosVUFBVSxDQUFFSixLQUFLLENBQUNqSSxJQUFJLENBQUUsZ0JBQWlCLENBQUUsQ0FBQztRQUN0RSxJQUFNb04sU0FBUyxHQUFXbkYsS0FBSyxDQUFDcEgsSUFBSSxDQUFFLFlBQWEsQ0FBQztRQUNwRCxJQUFNd00sU0FBUyxHQUFXcEYsS0FBSyxDQUFDcEgsSUFBSSxDQUFFLFlBQWEsQ0FBQztRQUVwRCxJQUFNeU0sTUFBTSxHQUFHck8sUUFBUSxDQUFDc08sY0FBYyxDQUFFTixRQUFTLENBQUM7UUFFbERGLFVBQVUsQ0FBQ1MsTUFBTSxDQUFFRixNQUFNLEVBQUU7VUFDMUJHLEtBQUssRUFBRSxDQUFFekUsUUFBUSxFQUFFQyxRQUFRLENBQUU7VUFDN0JrRSxJQUFJLEVBQUpBLElBQUk7VUFDSk8sT0FBTyxFQUFFLElBQUk7VUFDYkMsU0FBUyxFQUFFLGFBQWE7VUFDeEJDLEtBQUssRUFBRTtZQUNOLEtBQUssRUFBRXhGLGFBQWE7WUFDcEIsS0FBSyxFQUFFRTtVQUNSO1FBQ0QsQ0FBRSxDQUFDO1FBRUhnRixNQUFNLENBQUNQLFVBQVUsQ0FBQ3RNLEVBQUUsQ0FBRSxRQUFRLEVBQUUsVUFBVXVKLE1BQU0sRUFBRztVQUNsRCxJQUFJaEIsUUFBUTtVQUNaLElBQUlDLFFBQVE7VUFFWixJQUFLZCxhQUFhLEVBQUc7WUFDcEJhLFFBQVEsR0FBR0YsWUFBWSxDQUFFa0IsTUFBTSxDQUFFLENBQUMsQ0FBRSxFQUFFdkIsYUFBYSxFQUFFRSxnQkFBZ0IsRUFBRUQsaUJBQWtCLENBQUM7WUFDMUZPLFFBQVEsR0FBR0gsWUFBWSxDQUFFa0IsTUFBTSxDQUFFLENBQUMsQ0FBRSxFQUFFdkIsYUFBYSxFQUFFRSxnQkFBZ0IsRUFBRUQsaUJBQWtCLENBQUM7VUFDM0YsQ0FBQyxNQUFNO1lBQ05NLFFBQVEsR0FBR1gsVUFBVSxDQUFFMkIsTUFBTSxDQUFFLENBQUMsQ0FBRyxDQUFDO1lBQ3BDZixRQUFRLEdBQUdaLFVBQVUsQ0FBRTJCLE1BQU0sQ0FBRSxDQUFDLENBQUcsQ0FBQztVQUNyQztVQUVBLElBQUssWUFBWSxLQUFLa0QsZUFBZSxFQUFHO1lBQ3ZDRSxTQUFTLENBQUNuSixJQUFJLENBQUUrRSxRQUFTLENBQUM7WUFDMUJxRSxTQUFTLENBQUNwSixJQUFJLENBQUVnRixRQUFTLENBQUM7VUFDM0IsQ0FBQyxNQUFNO1lBQ05tRSxTQUFTLENBQUNoTCxHQUFHLENBQUU0RyxRQUFTLENBQUM7WUFDekJxRSxTQUFTLENBQUNqTCxHQUFHLENBQUU2RyxRQUFTLENBQUM7VUFDMUI7UUFDRCxDQUFFLENBQUM7UUFFSCxTQUFTNEUsK0JBQStCQSxDQUFFN0QsTUFBTSxFQUFHO1VBQ2xELElBQU04RCxTQUFTLEdBQUd6RixVQUFVLENBQUUyQixNQUFNLENBQUUsQ0FBQyxDQUFHLENBQUM7VUFDM0MsSUFBTStELFNBQVMsR0FBRzFGLFVBQVUsQ0FBRTJCLE1BQU0sQ0FBRSxDQUFDLENBQUcsQ0FBQzs7VUFFM0M7VUFDQSxJQUFLOEQsU0FBUyxLQUFLOUUsUUFBUSxJQUFJK0UsU0FBUyxLQUFLOUUsUUFBUSxFQUFHO1lBQ3ZEO1VBQ0Q7VUFFQSxJQUFLNkUsU0FBUyxLQUFLMUYsYUFBYSxJQUFJMkYsU0FBUyxLQUFLekYsYUFBYSxFQUFHO1lBQ2pFO1lBQ0EzSSxLQUFLLENBQUMrRCxhQUFhLENBQUV1RSxLQUFLLENBQUN6SSxJQUFJLENBQUUsa0JBQW1CLENBQUUsQ0FBQztVQUN4RCxDQUFDLE1BQU07WUFDTjtZQUNBLElBQU0rRCxHQUFHLEdBQUcwRSxLQUFLLENBQUN6SSxJQUFJLENBQUUsS0FBTSxDQUFDLENBQUNnRSxPQUFPLENBQUUsS0FBSyxFQUFFc0ssU0FBVSxDQUFDLENBQUN0SyxPQUFPLENBQUUsS0FBSyxFQUFFdUssU0FBVSxDQUFDO1lBQ3ZGcE8sS0FBSyxDQUFDK0QsYUFBYSxDQUFFSCxHQUFJLENBQUM7VUFDM0I7UUFDRDtRQUVBK0osTUFBTSxDQUFDUCxVQUFVLENBQUN0TSxFQUFFLENBQUUsUUFBUSxFQUFFLFVBQVV1SixNQUFNLEVBQUc7VUFDbEQ7VUFDQTVHLFlBQVksQ0FBRTZFLEtBQUssQ0FBQ3pJLElBQUksQ0FBRSxPQUFRLENBQUUsQ0FBQztVQUVyQ3lJLEtBQUssQ0FBQ3pJLElBQUksQ0FBRSxPQUFPLEVBQUVpRSxVQUFVLENBQUUsWUFBVztZQUMzQ3dFLEtBQUssQ0FBQ2MsVUFBVSxDQUFFLE9BQVEsQ0FBQztZQUUzQjhFLCtCQUErQixDQUFFN0QsTUFBTyxDQUFDO1VBQzFDLENBQUMsRUFBRXZMLEtBQU0sQ0FBRSxDQUFDO1FBQ2IsQ0FBRSxDQUFDO1FBRUgyTyxTQUFTLENBQUMzTSxFQUFFLENBQUUsT0FBTyxFQUFFLFlBQVc7VUFDakMsSUFBTXdDLE1BQU0sR0FBRzdFLENBQUMsQ0FBRSxJQUFLLENBQUM7O1VBRXhCO1VBQ0FnRixZQUFZLENBQUVILE1BQU0sQ0FBQ3pELElBQUksQ0FBRSxPQUFRLENBQUUsQ0FBQztVQUV0Q3lELE1BQU0sQ0FBQ3pELElBQUksQ0FBRSxPQUFPLEVBQUVpRSxVQUFVLENBQUUsWUFBVztZQUM1Q1IsTUFBTSxDQUFDOEYsVUFBVSxDQUFFLE9BQVEsQ0FBQztZQUU1QixJQUFNQyxRQUFRLEdBQUcvRixNQUFNLENBQUNiLEdBQUcsQ0FBQyxDQUFDO1lBRTdCa0wsTUFBTSxDQUFDUCxVQUFVLENBQUNsQyxHQUFHLENBQUUsQ0FBRTdCLFFBQVEsRUFBRSxJQUFJLENBQUcsQ0FBQztZQUUzQzZFLCtCQUErQixDQUFFUCxNQUFNLENBQUNQLFVBQVUsQ0FBQ2lCLEdBQUcsQ0FBQyxDQUFFLENBQUM7VUFDM0QsQ0FBQyxFQUFFdlAsS0FBTSxDQUFFLENBQUM7UUFDYixDQUFFLENBQUM7UUFFSDRPLFNBQVMsQ0FBQzVNLEVBQUUsQ0FBRSxPQUFPLEVBQUUsWUFBVztVQUNqQyxJQUFNd0MsTUFBTSxHQUFHN0UsQ0FBQyxDQUFFLElBQUssQ0FBQzs7VUFFeEI7VUFDQWdGLFlBQVksQ0FBRUgsTUFBTSxDQUFDekQsSUFBSSxDQUFFLE9BQVEsQ0FBRSxDQUFDO1VBRXRDeUQsTUFBTSxDQUFDekQsSUFBSSxDQUFFLE9BQU8sRUFBRWlFLFVBQVUsQ0FBRSxZQUFXO1lBQzVDUixNQUFNLENBQUM4RixVQUFVLENBQUUsT0FBUSxDQUFDO1lBRTVCLElBQU1FLFFBQVEsR0FBR2hHLE1BQU0sQ0FBQ2IsR0FBRyxDQUFDLENBQUM7WUFFN0JrTCxNQUFNLENBQUNQLFVBQVUsQ0FBQ2xDLEdBQUcsQ0FBRSxDQUFFLElBQUksRUFBRTVCLFFBQVEsQ0FBRyxDQUFDO1lBRTNDNEUsK0JBQStCLENBQUVQLE1BQU0sQ0FBQ1AsVUFBVSxDQUFDaUIsR0FBRyxDQUFDLENBQUUsQ0FBQztVQUMzRCxDQUFDLEVBQUV2UCxLQUFNLENBQUUsQ0FBQztRQUNiLENBQUUsQ0FBQztNQUNKLENBQUUsQ0FBQztJQUNKLENBQUM7SUFDRHdQLGNBQWMsRUFBRSxTQUFoQkEsY0FBY0EsQ0FBQSxFQUFhO01BQzFCLElBQUssQ0FBRXpDLE1BQU0sQ0FBQyxDQUFDLENBQUMwQyxVQUFVLEVBQUc7UUFDNUI7TUFDRDtNQUVBLElBQU1DLGdCQUFnQixHQUFHcFAsS0FBSyxDQUFDOEIsSUFBSSxDQUFFLG1CQUFvQixDQUFDO01BRTFELElBQU11TixNQUFNLEdBQVVELGdCQUFnQixDQUFDbk8sSUFBSSxDQUFFLGtCQUFtQixDQUFDO01BQ2pFLElBQU1xTyxZQUFZLEdBQUlGLGdCQUFnQixDQUFDbk8sSUFBSSxDQUFFLGdDQUFpQyxDQUFDO01BQy9FLElBQU1zTyxhQUFhLEdBQUdILGdCQUFnQixDQUFDbk8sSUFBSSxDQUFFLGlDQUFrQyxDQUFDO01BRWhGLElBQU11TyxLQUFLLEdBQUdKLGdCQUFnQixDQUFDdE4sSUFBSSxDQUFFLGtCQUFtQixDQUFDO01BQ3pELElBQU0yTixHQUFHLEdBQUtMLGdCQUFnQixDQUFDdE4sSUFBSSxDQUFFLGdCQUFpQixDQUFDO01BRXZEME4sS0FBSyxDQUFDTCxVQUFVLENBQUU7UUFDakJPLFVBQVUsRUFBRUwsTUFBTTtRQUNsQk0sVUFBVSxFQUFFTCxZQUFZO1FBQ3hCTSxXQUFXLEVBQUVMO01BQ2QsQ0FBRSxDQUFDO01BRUhFLEdBQUcsQ0FBQ04sVUFBVSxDQUFFO1FBQ2ZPLFVBQVUsRUFBRUwsTUFBTTtRQUNsQk0sVUFBVSxFQUFFTCxZQUFZO1FBQ3hCTSxXQUFXLEVBQUVMO01BQ2QsQ0FBRSxDQUFDO0lBQ0osQ0FBQztJQUNETSx1QkFBdUIsRUFBRSxTQUF6QkEsdUJBQXVCQSxDQUFBLEVBQWE7TUFDbkM7TUFDQSxJQUFLLFVBQVUsS0FBSyxPQUFPM0QsS0FBSyxFQUFHO1FBQ2xDO01BQ0Q7TUFFQSxJQUFLLENBQUU5TSxZQUFZLENBQUN1SCxXQUFXLEVBQUc7UUFDakM7TUFDRDtNQUVBLElBQU1tSixnQkFBZ0IsR0FBRyxDQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBRTtNQUU3REEsZ0JBQWdCLENBQUNsSixPQUFPLENBQUUsVUFBVW1KLGVBQWUsRUFBRztRQUNyRCxJQUFNQyxVQUFVLEdBQUcscUJBQXFCLEdBQUdELGVBQWU7O1FBRTFEO1FBQ0EsSUFBTUUsU0FBUyxHQUFHL0QsS0FBSyxDQUFFLEdBQUcsR0FBRzhELFVBQVUsR0FBRyxHQUFHLEVBQUU7VUFDaEQ3RCxTQUFTLEVBQUU0RCxlQUFlO1VBQzFCM0QsT0FBTyxXQUFQQSxPQUFPQSxDQUFFQyxTQUFTLEVBQUc7WUFDcEIsT0FBT0EsU0FBUyxDQUFDQyxZQUFZLENBQUUwRCxVQUFXLENBQUM7VUFDNUMsQ0FBQztVQUNEekQsU0FBUyxFQUFFO1FBQ1osQ0FBRSxDQUFDO1FBRUhqTixNQUFNLENBQUNxQixjQUFjLEdBQUdBLGNBQWMsQ0FBQzRILE1BQU0sQ0FBRTBILFNBQVUsQ0FBQztNQUMzRCxDQUFFLENBQUM7SUFDSixDQUFDO0lBQ0RoSixJQUFJLEVBQUUsU0FBTkEsSUFBSUEsQ0FBQSxFQUFhO01BQ2hCckcsS0FBSyxDQUFDNEwsWUFBWSxDQUFDLENBQUM7TUFDcEI1TCxLQUFLLENBQUNtTixlQUFlLENBQUMsQ0FBQztNQUN2Qm5OLEtBQUssQ0FBQ3NPLGNBQWMsQ0FBQyxDQUFDO01BQ3RCdE8sS0FBSyxDQUFDaVAsdUJBQXVCLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBQ0RLLGdCQUFnQixFQUFFLFNBQWxCQSxnQkFBZ0JBLENBQUEsRUFBYTtNQUM1QmxRLEtBQUssQ0FBQzBCLEVBQUUsQ0FBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLFVBQVVDLENBQUMsRUFBRztRQUNoREEsQ0FBQyxDQUFDVSxjQUFjLENBQUMsQ0FBQztNQUNuQixDQUFFLENBQUM7SUFDSixDQUFDO0lBQ0Q4TixZQUFZLEVBQUUsU0FBZEEsWUFBWUEsQ0FBQSxFQUFhO01BQ3hCLElBQUsvUSxZQUFZLENBQUNnUixjQUFjLElBQUloUixZQUFZLENBQUNpUixXQUFXLEVBQUc7UUFDOUR4SCxPQUFPLENBQUN5SCxZQUFZLENBQUU7VUFBRXZILEtBQUssRUFBRTtRQUFLLENBQUMsRUFBRSxFQUFFLEVBQUV6SixNQUFNLENBQUNrSSxRQUFTLENBQUM7O1FBRTVEO1FBQ0FsSSxNQUFNLENBQUNpUixnQkFBZ0IsQ0FBRSxVQUFVLEVBQUUsVUFBVTVPLENBQUMsRUFBRztVQUNsRCxJQUFLLElBQUksS0FBS0EsQ0FBQyxDQUFDNk8sS0FBSyxJQUFJN08sQ0FBQyxDQUFDNk8sS0FBSyxDQUFDQyxjQUFjLENBQUUsT0FBUSxDQUFDLEVBQUc7WUFDNUQ3UCxLQUFLLENBQUN3RyxjQUFjLENBQUUsVUFBVyxDQUFDO1VBQ25DO1FBQ0QsQ0FBRSxDQUFDO01BQ0o7SUFDRDtFQUNELENBQUM7O0VBRUQ7QUFDRDtBQUNBO0FBQ0E7QUFDQTtFQUNDLElBQUssbUJBQW1CLElBQUl5QixPQUFPLEVBQUc7SUFDckM7RUFBQTtBQUdGLENBQUMsRUFBRTRELE1BQU0sRUFBRW5OLE1BQU8sQ0FBQztBQUVqQixXQUFVRCxDQUFDLEVBQUV1QixLQUFLLEVBQUc7RUFFdEJBLEtBQUssQ0FBQ3FHLElBQUksQ0FBQyxDQUFDO0VBQ1pyRyxLQUFLLENBQUN1UCxZQUFZLENBQUMsQ0FBQztFQUVwQnZQLEtBQUssQ0FBQ0MscUJBQXFCLENBQUMsQ0FBQztFQUM3QkQsS0FBSyxDQUFDbUIscUJBQXFCLENBQUMsQ0FBQztFQUM3Qm5CLEtBQUssQ0FBQzBCLGVBQWUsQ0FBQyxDQUFDO0VBQ3ZCMUIsS0FBSyxDQUFDK0IseUJBQXlCLENBQUMsQ0FBQztFQUVqQy9CLEtBQUssQ0FBQzZKLGlCQUFpQixDQUFDLENBQUM7RUFDekI3SixLQUFLLENBQUNtSyxxQkFBcUIsQ0FBQyxDQUFDO0VBQzdCbkssS0FBSyxDQUFDb0ksd0JBQXdCLENBQUMsQ0FBQztFQUNoQ3BJLEtBQUssQ0FBQ3dKLHNCQUFzQixDQUFDLENBQUM7RUFDOUJ4SixLQUFLLENBQUNzSyxnQkFBZ0IsQ0FBQyxDQUFDO0VBQ3hCdEssS0FBSyxDQUFDNkssb0JBQW9CLENBQUMsQ0FBQztFQUU1QjdLLEtBQUssQ0FBQ29MLGlCQUFpQixDQUFDLENBQUM7RUFFekJwTCxLQUFLLENBQUNxTCxtQkFBbUIsQ0FBQyxDQUFDO0VBRTNCckwsS0FBSyxDQUFDc1AsZ0JBQWdCLENBQUMsQ0FBQzs7RUFFeEI7QUFDRDtBQUNBO0VBQ0M3USxDQUFDLENBQUVhLFFBQVMsQ0FBQyxDQUFDd0IsRUFBRSxDQUFFLCtCQUErQixFQUFFLFlBQVc7SUFDN0Q7SUFDQXJDLENBQUMsQ0FBRWEsUUFBUyxDQUFDLENBQUNpRSxPQUFPLENBQUUsaUNBQWtDLENBQUM7RUFDM0QsQ0FBRSxDQUFDO0FBRUosQ0FBQyxFQUFFc0ksTUFBTSxFQUFFbk4sTUFBTSxDQUFDc0IsS0FBTSxDQUFDOzs7QUN2bEN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVNtSixZQUFZQSxDQUFFMkcsTUFBTSxFQUFFQyxRQUFRLEVBQUVDLFNBQVMsRUFBRUMsYUFBYSxFQUFHO0VBQ25FO0VBQ0FILE1BQU0sR0FBRyxDQUFFQSxNQUFNLEdBQUcsRUFBRSxFQUFHak0sT0FBTyxDQUFFLGNBQWMsRUFBRSxFQUFHLENBQUM7RUFFdEQsSUFBTXFNLENBQUMsR0FBTSxDQUFFQyxRQUFRLENBQUUsQ0FBQ0wsTUFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUNBLE1BQU07RUFDaEQsSUFBTU0sSUFBSSxHQUFHLENBQUVELFFBQVEsQ0FBRSxDQUFDSixRQUFTLENBQUMsR0FBRyxDQUFDLEdBQUdNLElBQUksQ0FBQ0MsR0FBRyxDQUFFUCxRQUFTLENBQUM7RUFDL0QsSUFBTVEsR0FBRyxHQUFNLE9BQU9OLGFBQWEsS0FBSyxXQUFXLEdBQUssR0FBRyxHQUFHQSxhQUFhO0VBQzNFLElBQU1PLEdBQUcsR0FBTSxPQUFPUixTQUFTLEtBQUssV0FBVyxHQUFLLEdBQUcsR0FBR0EsU0FBUztFQUVuRSxJQUFJUyxDQUFDO0VBRUwsSUFBTUMsVUFBVSxHQUFHLFNBQWJBLFVBQVVBLENBQWFSLENBQUMsRUFBRUUsSUFBSSxFQUFHO0lBQ3RDLElBQU1PLENBQUMsR0FBR04sSUFBSSxDQUFDTyxHQUFHLENBQUUsRUFBRSxFQUFFUixJQUFLLENBQUM7SUFDOUIsT0FBTyxFQUFFLEdBQUdDLElBQUksQ0FBQ1EsS0FBSyxDQUFFWCxDQUFDLEdBQUdTLENBQUUsQ0FBQyxHQUFHQSxDQUFDO0VBQ3BDLENBQUM7O0VBRUQ7RUFDQUYsQ0FBQyxHQUFHLENBQUVMLElBQUksR0FBR00sVUFBVSxDQUFFUixDQUFDLEVBQUVFLElBQUssQ0FBQyxHQUFHLEVBQUUsR0FBR0MsSUFBSSxDQUFDUSxLQUFLLENBQUVYLENBQUUsQ0FBQyxFQUFHeEYsS0FBSyxDQUFFLEdBQUksQ0FBQztFQUV4RSxJQUFLK0YsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDL04sTUFBTSxHQUFHLENBQUMsRUFBRztJQUN4QitOLENBQUMsQ0FBRSxDQUFDLENBQUUsR0FBR0EsQ0FBQyxDQUFFLENBQUMsQ0FBRSxDQUFDNU0sT0FBTyxDQUFFLHlCQUF5QixFQUFFME0sR0FBSSxDQUFDO0VBQzFEO0VBRUEsSUFBSyxDQUFFRSxDQUFDLENBQUUsQ0FBQyxDQUFFLElBQUksRUFBRSxFQUFHL04sTUFBTSxHQUFHME4sSUFBSSxFQUFHO0lBQ3JDSyxDQUFDLENBQUUsQ0FBQyxDQUFFLEdBQUdBLENBQUMsQ0FBRSxDQUFDLENBQUUsSUFBSSxFQUFFO0lBQ3JCQSxDQUFDLENBQUUsQ0FBQyxDQUFFLElBQUksSUFBSUssS0FBSyxDQUFFVixJQUFJLEdBQUdLLENBQUMsQ0FBRSxDQUFDLENBQUUsQ0FBQy9OLE1BQU0sR0FBRyxDQUFFLENBQUMsQ0FBQ2tJLElBQUksQ0FBRSxHQUFJLENBQUM7RUFDNUQ7RUFFQSxPQUFPNkYsQ0FBQyxDQUFDN0YsSUFBSSxDQUFFNEYsR0FBSSxDQUFDO0FBQ3JCO0FBRUEsU0FBU08sUUFBUUEsQ0FBRW5OLEdBQUcsRUFBRztFQUN4QixPQUFPQSxHQUFHLENBQUNDLE9BQU8sQ0FBRSxNQUFNLEVBQUUsR0FBSSxDQUFDO0FBQ2xDO0FBRUEsU0FBU3NILGFBQWFBLENBQUV2SCxHQUFHLEVBQUc7RUFDN0IsSUFBTW9OLEtBQUssR0FBR3BTLFFBQVEsQ0FBRWdGLEdBQUcsQ0FBQ0MsT0FBTyxDQUFFLGtCQUFrQixFQUFFLElBQUssQ0FBRSxDQUFDO0VBRWpFLElBQUttTixLQUFLLEVBQUc7SUFDWnBOLEdBQUcsR0FBR0EsR0FBRyxDQUFDQyxPQUFPLENBQUUsZUFBZSxFQUFFLEVBQUcsQ0FBQztFQUN6QztFQUVBLE9BQU9rTixRQUFRLENBQUVuTixHQUFJLENBQUM7QUFDdkIiLCJmaWxlIjoid2MtYWpheC1wcm9kdWN0LWZpbHRlci1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgbWFpbiBqcyBmaWxlLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL3B1YmxpYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhblxuICovXG5cbmNvbnN0IHdjYXBmX3BhcmFtcyA9IHdjYXBmX3BhcmFtcyB8fCB7XG5cdCdpc19ydGwnOiAnJyxcblx0J2ZpbHRlcl9pbnB1dF9kZWxheSc6ICcnLFxuXHQna2V5d29yZF9maWx0ZXJfZGVsYXknOiAnJyxcblx0J2NvbWJvYm94X2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucyc6ICcnLFxuXHQnY29tYm9ib3hfbm9fcmVzdWx0c190ZXh0JzogJycsXG5cdCdjb21ib2JveF9vcHRpb25zX25vbmVfdGV4dCc6ICcnLFxuXHQnc2VhcmNoX2JveF9pbl9kZWZhdWx0X29yZGVyYnknOiAnJyxcblx0J3ByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUnOiAnJyxcblx0J3ByZXNlcnZlX3NvZnRfbGltaXRfc3RhdGUnOiAnJyxcblx0J2VuYWJsZV9hbmltYXRpb25fZm9yX2ZpbHRlcl9hY2NvcmRpb24nOiAnJyxcblx0J2ZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkJzogJycsXG5cdCdmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmcnOiAnJyxcblx0J2VuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24nOiAnJyxcblx0J2hpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkJzogJycsXG5cdCdoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmcnOiAnJyxcblx0J3Njcm9sbF90b190b3Bfc3BlZWQnOiAnJyxcblx0J3Njcm9sbF90b190b3BfZWFzaW5nJzogJycsXG5cdCdpc19tb2JpbGUnOiAnJyxcblx0J3JlbG9hZF9vbl9iYWNrJzogJycsXG5cdCdmb3VuZF93Y2FwZic6ICcnLFxuXHQnd2NhcGZfcHJvJzogJycsXG5cdCd1cGRhdGVfZG9jdW1lbnRfdGl0bGUnOiAnJyxcblx0J3VzZV90aXBweWpzJzogJycsXG5cdCdzaG9wX2xvb3BfY29udGFpbmVyJzogJycsXG5cdCdub3RfZm91bmRfY29udGFpbmVyJzogJycsXG5cdCdwYWdpbmF0aW9uX2NvbnRhaW5lcic6ICcnLFxuXHQnb3JkZXJieV9mb3JtJzogJycsXG5cdCdvcmRlcmJ5X2VsZW1lbnQnOiAnJyxcblx0J2Rpc2FibGVfYWpheCc6ICcnLFxuXHQnZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXgnOiAnJyxcblx0J3NvcnRpbmdfY29udHJvbCc6ICcnLFxuXHQnYXR0YWNoX2NvbWJvYm94X29uX3NvcnRpbmcnOiAnJyxcblx0J2xvYWRpbmdfYW5pbWF0aW9uJzogJycsXG5cdCdzY3JvbGxfd2luZG93JzogJycsXG5cdCdzY3JvbGxfd2luZG93X2Zvcic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd193aGVuJzogJycsXG5cdCdzY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50JzogJycsXG5cdCdzY3JvbGxfb24nOiAnJyxcblx0J3Njcm9sbF90b190b3Bfb2Zmc2V0JzogJycsXG5cdCdkaXNhYmxlX3Njcm9sbF9hbmltYXRpb24nOiAnJyxcblx0J21vcmVfc2VsZWN0b3JzJzogJycsXG5cdCdjdXN0b21fc2NyaXB0cyc6ICcnLFxufTtcblxuKCBmdW5jdGlvbiggJCwgd2luZG93ICkge1xuXG5cdGNvbnN0IF9kZWxheSA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuZmlsdGVyX2lucHV0X2RlbGF5ICk7XG5cdGNvbnN0IGRlbGF5ICA9IF9kZWxheSA+PSAwID8gX2RlbGF5IDogMzAwO1xuXG5cdGNvbnN0IF9rZXl3b3JkRmlsdGVyRGVsYXkgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLmtleXdvcmRfZmlsdGVyX2RlbGF5ICk7XG5cdGNvbnN0IGtleXdvcmRGaWx0ZXJEZWxheSAgPSBfa2V5d29yZEZpbHRlckRlbGF5ID49IDAgPyBfa2V5d29yZEZpbHRlckRlbGF5IDogMTAwO1xuXG5cdGNvbnN0IGlzUHJvID0gd2NhcGZfcGFyYW1zLndjYXBmX3BybztcblxuXHRjb25zdCAkYm9keSAgICAgPSAkKCAnYm9keScgKTtcblx0Y29uc3QgJGRvY3VtZW50ID0gJCggZG9jdW1lbnQgKTtcblxuXHRjb25zdCBpbnN0YW5jZUlkcyA9IFtdO1xuXG5cdGNvbnN0IGRlZmF1bHRPcmRlckJ5RWxlbWVudCA9IHdjYXBmX3BhcmFtcy5vcmRlcmJ5X2Zvcm0gKyAnICcgKyB3Y2FwZl9wYXJhbXMub3JkZXJieV9lbGVtZW50O1xuXG5cdCQoICcud2NhcGYtZmlsdGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IGlkID0gJCggdGhpcyApLmRhdGEoICdpZCcgKTtcblxuXHRcdGlmICggISBpZCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpbnN0YW5jZUlkcy5wdXNoKCBpZCApO1xuXHR9ICk7XG5cblx0d2luZG93LnRpcHB5SW5zdGFuY2VzID0gW107XG5cblx0d2luZG93LldDQVBGID0gd2luZG93LldDQVBGIHx8IHt9O1xuXG5cdHdpbmRvdy5XQ0FQRiA9IHtcblx0XHRoYW5kbGVGaWx0ZXJBY2NvcmRpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgdG9nZ2xlQWNjb3JkaW9uID0gKCAkZWwgKSA9PiB7XG5cdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYWNjb3JkaW9uIGlzIG9wZW5lZFxuXHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLWV4cGFuZGVkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0Ly8gQ2hhbmdlIGFyaWEtZXhwYW5kZWQgdG8gdGhlIG9wcG9zaXRlIHN0YXRlXG5cdFx0XHRcdCRlbC5hdHRyKCAnYXJpYS1leHBhbmRlZCcsICEgcHJlc3NlZCApO1xuXG5cdFx0XHRcdGNvbnN0ICRmaWx0ZXJJbm5lciA9ICRlbC5jbG9zZXN0KCAnLndjYXBmLWZpbHRlcicgKS5jaGlsZHJlbiggJy53Y2FwZi1maWx0ZXItaW5uZXInICk7XG5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX2FuaW1hdGlvbl9mb3JfZmlsdGVyX2FjY29yZGlvbiApIHtcblx0XHRcdFx0XHQkZmlsdGVySW5uZXIuc2xpZGVUb2dnbGUoXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQsXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkZmlsdGVySW5uZXIudG9nZ2xlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdCRib2R5Lm9uKCAnY2xpY2snLCAnLndjYXBmLWZpbHRlci1hY2NvcmRpb24tdHJpZ2dlcicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdCRib2R5Lm9uKCAnY2xpY2snLCAnLndjYXBmLWZpbHRlci10aXRsZS5oYXMtYWNjb3JkaW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0cmlnZ2VyID0gJCggdGhpcyApLmZpbmQoICcud2NhcGYtZmlsdGVyLWFjY29yZGlvbi10cmlnZ2VyJyApO1xuXG5cdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJHRyaWdnZXIgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZUhpZXJhcmNoeVRvZ2dsZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCB0b2dnbGVBY2NvcmRpb24gPSAoICRlbCApID0+IHtcblx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBidXR0b24gaXMgcHJlc3NlZFxuXHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLXByZXNzZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHQvLyBDaGFuZ2UgYXJpYS1wcmVzc2VkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuXHRcdFx0XHQkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICEgcHJlc3NlZCApO1xuXG5cdFx0XHRcdGNvbnN0ICRjaGlsZCA9ICRlbC5jbG9zZXN0KCAnbGknICkuY2hpbGRyZW4oICd1bCcgKTtcblxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uICkge1xuXHRcdFx0XHRcdCRjaGlsZC5zbGlkZVRvZ2dsZShcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5oaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCxcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5oaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmdcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRjaGlsZC50b2dnbGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0JGJvZHlcblx0XHRcdFx0Lm9uKCAnY2xpY2snLCAnLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkKCB0aGlzICkgKTtcblx0XHRcdFx0fSApXG5cdFx0XHRcdC5vbiggJ2tleWRvd24nLCAnLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0aWYgKCBlLmtleSA9PT0gJyAnIHx8IGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnU3BhY2ViYXInICkge1xuXHRcdFx0XHRcdFx0Ly8gUHJldmVudCB0aGUgZGVmYXVsdCBhY3Rpb24gdG8gc3RvcCBzY3JvbGxpbmcgd2hlbiBzcGFjZSBpcyBwcmVzc2VkXG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVTb2Z0TGltaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgdG9nZ2xlRmlsdGVyT3B0aW9ucyA9ICggJGVsICkgPT4ge1xuXHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGJ1dHRvbiBpcyBwcmVzc2VkXG5cdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdC8vIENoYW5nZSBhcmlhLXByZXNzZWQgdG8gdGhlIG9wcG9zaXRlIHN0YXRlXG5cdFx0XHRcdCRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJywgISBwcmVzc2VkICk7XG5cblx0XHRcdFx0Y29uc3QgJGxpc3RXcmFwcGVyID0gJGVsLmNsb3Nlc3QoICcud2NhcGYtbGlzdC13cmFwcGVyJyApO1xuXG5cdFx0XHRcdGlmICggcHJlc3NlZCApIHtcblx0XHRcdFx0XHQkbGlzdFdyYXBwZXIucmVtb3ZlQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRsaXN0V3JhcHBlci5hZGRDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdCRib2R5XG5cdFx0XHRcdC5vbiggJ2NsaWNrJywgJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0b2dnbGVGaWx0ZXJPcHRpb25zKCAkKCB0aGlzICkgKTtcblx0XHRcdFx0fSApXG5cdFx0XHRcdC5vbiggJ2tleWRvd24nLCAnLndjYXBmLXNvZnQtbGltaXQtdHJpZ2dlcicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdGlmICggZS5rZXkgPT09ICcgJyB8fCBlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJ1NwYWNlYmFyJyApIHtcblx0XHRcdFx0XHRcdC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgYWN0aW9uIHRvIHN0b3Agc2Nyb2xsaW5nIHdoZW4gc3BhY2UgaXMgcHJlc3NlZFxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0XHR0b2dnbGVGaWx0ZXJPcHRpb25zKCAkKCB0aGlzICkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZVNlYXJjaEZpbHRlck9wdGlvbnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdpbnB1dCcsICcud2NhcGYtc2VhcmNoLWJveCBpbnB1dFt0eXBlPVwidGV4dFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkdGhhdCAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCAkaW5uZXIgID0gJHRoYXQuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXItaW5uZXInICk7XG5cdFx0XHRcdGNvbnN0ICRmaWx0ZXIgPSAkaW5uZXIuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXInICk7XG5cblx0XHRcdFx0Y29uc3Qgc29mdExpbWl0RW5hYmxlZCA9ICRmaWx0ZXIuaGFzQ2xhc3MoICdoYXMtc29mdC1saW1pdCcgKTtcblx0XHRcdFx0Y29uc3Qgc29mdExpbWl0VG9nZ2xlICA9ICRmaWx0ZXIuZmluZCggJy53Y2FwZi1zb2Z0LWxpbWl0LXdyYXBwZXInICk7XG5cdFx0XHRcdGNvbnN0IG5vUmVzdWx0cyAgICAgICAgPSAkZmlsdGVyLmZpbmQoICcud2NhcGYtbm8tcmVzdWx0cy10ZXh0JyApO1xuXHRcdFx0XHRjb25zdCB2aXNpYmxlT3B0aW9ucyAgID0gcGFyc2VJbnQoICRmaWx0ZXIuYXR0ciggJ2RhdGEtdmlzaWJsZS1vcHRpb25zJyApICk7XG5cblx0XHRcdFx0Y29uc3Qga2V5d29yZCA9ICR0aGF0LnZhbCgpO1xuXG5cdFx0XHRcdGlmICggISBrZXl3b3JkLmxlbmd0aCApIHtcblx0XHRcdFx0XHRsZXQgaW5kZXggPSAwO1xuXHRcdFx0XHRcdCRmaWx0ZXIucmVtb3ZlQ2xhc3MoICdzZWFyY2gtYWN0aXZlJyApO1xuXG5cdFx0XHRcdFx0JC5lYWNoKCAkaW5uZXIuZmluZCggJy53Y2FwZi1maWx0ZXItb3B0aW9ucyA+IGxpJyApLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGluZGV4Kys7XG5cblx0XHRcdFx0XHRcdGNvbnN0ICRmaWx0ZXJJdGVtID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICdrZXl3b3JkLW1hdGNoZWQnICk7XG5cblx0XHRcdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCBpbmRleCA+IHZpc2libGVPcHRpb25zICkge1xuXHRcdFx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLmFkZENsYXNzKCAnd2NhcGYtZmlsdGVyLW9wdGlvbi1oaWRkZW4nICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRcdHNvZnRMaW1pdFRvZ2dsZS5yZW1vdmVBdHRyKCAnc3R5bGUnICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bm9SZXN1bHRzLmNoaWxkcmVuKCAnc3BhbicgKS50ZXh0KCAnJyApO1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5oaWRlKCk7XG5cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgaW5kZXggPSAwO1xuXHRcdFx0XHQkZmlsdGVyLmFkZENsYXNzKCAnc2VhcmNoLWFjdGl2ZScgKTtcblxuXHRcdFx0XHQkLmVhY2goICRpbm5lci5maW5kKCAnLndjYXBmLWZpbHRlci1vcHRpb25zID4gbGknICksIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0ICRmaWx0ZXJJdGVtID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdGNvbnN0IGxhYmVsICAgICAgID0gJGZpbHRlckl0ZW0uZmluZCggJy53Y2FwZi1maWx0ZXItaXRlbS1sYWJlbCcgKS5kYXRhKCAnbGFiZWwnICk7XG5cblx0XHRcdFx0XHRpZiAoIGxhYmVsLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygga2V5d29yZC50b0xvd2VyQ2FzZSgpICkgKSB7XG5cdFx0XHRcdFx0XHRpbmRleCsrO1xuXG5cdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5hZGRDbGFzcyggJ2tleXdvcmQtbWF0Y2hlZCcgKTtcblxuXHRcdFx0XHRcdFx0aWYgKCBzb2Z0TGltaXRFbmFibGVkICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIGluZGV4ID4gdmlzaWJsZU9wdGlvbnMgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0uYWRkQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5yZW1vdmVDbGFzcyggJ3djYXBmLWZpbHRlci1vcHRpb24taGlkZGVuJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLnJlbW92ZUNsYXNzKCAna2V5d29yZC1tYXRjaGVkJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRpZiAoIGluZGV4IDw9IHZpc2libGVPcHRpb25zICkge1xuXHRcdFx0XHRcdFx0c29mdExpbWl0VG9nZ2xlLmhpZGUoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c29mdExpbWl0VG9nZ2xlLnNob3coKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIDAgPT09IGluZGV4ICkge1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5jaGlsZHJlbiggJ3NwYW4nICkudGV4dCgga2V5d29yZCApO1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bm9SZXN1bHRzLmNoaWxkcmVuKCAnc3BhbicgKS50ZXh0KCAnJyApO1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtc2VhcmNoLWJveCAud2NhcGYtY2xlYXItc3RhdGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRoYXQgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgJHNlYXJjaEJveCA9ICR0aGF0LmNsb3Nlc3QoICcud2NhcGYtc2VhcmNoLWJveCcgKTtcblx0XHRcdFx0Y29uc3QgJGlucHV0ICAgICA9ICRzZWFyY2hCb3guZmluZCggJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXHRcdFx0XHRjb25zdCAkZmlsdGVyICAgID0gJHNlYXJjaEJveC5jbG9zZXN0KCAnLndjYXBmLWZpbHRlcicgKTtcblxuXHRcdFx0XHQkaW5wdXQudmFsKCAnJyApO1xuXG5cdFx0XHRcdGlmICggJGZpbHRlci5oYXNDbGFzcyggJ3djYXBmLWZpbHRlci1rZXl3b3JkJyApICkge1xuXHRcdFx0XHRcdCRpbnB1dC50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRpbnB1dC50cmlnZ2VyKCAnaW5wdXQnICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCAnLndjYXBmLWZpbHRlci1rZXl3b3JkIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0aGF0ICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCAkd3JhcHBlciA9ICR0aGF0LmNsb3Nlc3QoICcud2NhcGYta2V5d29yZC1maWx0ZXItd3JhcHBlcicgKTtcblx0XHRcdFx0Y29uc3Qga2V5d29yZCAgPSAkdGhhdC52YWwoKTtcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkdGhhdC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRjb25zdCBmaWx0ZXJVUkwgICAgICA9ICR3cmFwcGVyLmRhdGEoICdmaWx0ZXItdXJsJyApO1xuXHRcdFx0XHRjb25zdCBjbGVhckZpbHRlclVSTCA9ICR3cmFwcGVyLmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApO1xuXHRcdFx0XHRsZXQgdXJsO1xuXG5cdFx0XHRcdGlmICgga2V5d29yZC5sZW5ndGggKSB7XG5cdFx0XHRcdFx0dXJsID0gZmlsdGVyVVJMLnJlcGxhY2UoICclcycsIGtleXdvcmQgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR1cmwgPSBjbGVhckZpbHRlclVSTDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCR0aGF0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0XHR9LCBrZXl3b3JkRmlsdGVyRGVsYXkgKSApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0dXBkYXRlUHJvZHVjdHNDb3VudFJlc3VsdDogZnVuY3Rpb24oICRyZXNwb25zZSApIHtcblx0XHRcdGNvbnN0ICRjb250YWluZXIgPSAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3IgICA9ICcud29vY29tbWVyY2UtcmVzdWx0LWNvdW50Jztcblx0XHRcdGNvbnN0IG5ld0NvdW50ICAgPSAkcmVzcG9uc2UuZmluZCggc2VsZWN0b3IgKS5odG1sKCk7XG5cblx0XHRcdCRib2R5LmZpbmQoIHNlbGVjdG9yICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRlbCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRpZiAoICEgJGNvbnRhaW5lci5oYXMoICRlbCApLmxlbmd0aCApIHtcblx0XHRcdFx0XHQkZWwuaHRtbCggbmV3Q291bnQgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0c2Nyb2xsVG86IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAnbm9uZScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHNjcm9sbEZvciA9IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X2Zvcjtcblx0XHRcdGNvbnN0IGlzTW9iaWxlICA9IHdjYXBmX3BhcmFtcy5pc19tb2JpbGU7XG5cdFx0XHRsZXQgcHJvY2VlZCAgICAgPSBmYWxzZTtcblxuXHRcdFx0aWYgKCAnbW9iaWxlJyA9PT0gc2Nyb2xsRm9yICYmIGlzTW9iaWxlICkge1xuXHRcdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSBpZiAoICdkZXNrdG9wJyA9PT0gc2Nyb2xsRm9yICYmICEgaXNNb2JpbGUgKSB7XG5cdFx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmICggJ2JvdGgnID09PSBzY3JvbGxGb3IgKSB7XG5cdFx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgcHJvY2VlZCApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgYWRqdXN0aW5nT2Zmc2V0ID0gMCwgb2Zmc2V0ID0gMDtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKSB7XG5cdFx0XHRcdGFkanVzdGluZ09mZnNldCA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGNvbnRhaW5lcjtcblxuXHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXI7XG5cdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXI7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggJ2N1c3RvbScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93ICkge1xuXHRcdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudDtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIGNvbnRhaW5lciApO1xuXG5cdFx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRvZmZzZXQgPSAkY29udGFpbmVyLm9mZnNldCgpLnRvcCAtIGFkanVzdGluZ09mZnNldDtcblxuXHRcdFx0XHRpZiAoIG9mZnNldCA8IDAgKSB7XG5cdFx0XHRcdFx0b2Zmc2V0ID0gMDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCQoICdodG1sLCBib2R5JyApLnN0b3AoKS5hbmltYXRlKFxuXHRcdFx0XHRcdHsgc2Nyb2xsVG9wOiBvZmZzZXQgfSxcblx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9zcGVlZCxcblx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9lYXNpbmdcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8vIFRoaW5ncyBhcmUgZG9uZSBiZWZvcmUgZmV0Y2hpbmcgdGhlIHByb2R1Y3RzIGxpa2Ugc2hvd2luZyB0aGUgbG9hZGluZyBpbmRpY2F0b3IuXG5cdFx0YmVmb3JlRmV0Y2hpbmdQcm9kdWN0czogZnVuY3Rpb24oIHRyaWdnZXJlZEJ5ICkge1xuXHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1sb2FkZXInICkuYWRkQ2xhc3MoICdpcy1hY3RpdmUnICk7XG5cblx0XHRcdGlmICggISBpc1BybyAmJiAnaW1tZWRpYXRlbHknID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd193aGVuICkge1xuXHRcdFx0XHRXQ0FQRi5zY3JvbGxUbygpO1xuXHRcdFx0fVxuXG5cdFx0XHQkZG9jdW1lbnQudHJpZ2dlciggJ3djYXBmX2JlZm9yZV9mZXRjaGluZ19wcm9kdWN0cycsIFsgdHJpZ2dlcmVkQnkgXSApO1xuXHRcdH0sXG5cdFx0ZGVzdHJveVRpcHB5SW5zdGFuY2VzOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnVzZV90aXBweWpzICkge1xuXHRcdFx0XHQvLyBAc291cmNlIGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9taWtzL3RpcHB5anMvaXNzdWVzLzQ3M1xuXHRcdFx0XHR0aXBweUluc3RhbmNlcy5mb3JFYWNoKCBpbnN0YW5jZSA9PiB7XG5cdFx0XHRcdFx0aW5zdGFuY2UuZGVzdHJveSgpO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHRcdHRpcHB5SW5zdGFuY2VzLmxlbmd0aCA9IDA7IC8vIGNsZWFyIGl0XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvLyBUaGluZ3MgYXJlIGRvbmUgYmVmb3JlIHVwZGF0aW5nIHRoZSBwcm9kdWN0cyBsaWtlIGhpZGluZyB0aGUgbG9hZGluZyBpbmRpY2F0b3IuXG5cdFx0YmVmb3JlVXBkYXRpbmdQcm9kdWN0czogZnVuY3Rpb24oICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgKSB7XG5cdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLWxvYWRlcicgKS5yZW1vdmVDbGFzcyggJ2lzLWFjdGl2ZScgKTtcblxuXHRcdFx0Ly8gTWF5YmUgZ29vZCBmb3IgcGVyZm9ybWFuY2UuXG5cdFx0XHRXQ0FQRi5kZXN0cm95VGlwcHlJbnN0YW5jZXMoKTtcblxuXHRcdFx0JGRvY3VtZW50LnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfdXBkYXRpbmdfcHJvZHVjdHMnLCBbICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgXSApO1xuXHRcdH0sXG5cdFx0YWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzOiBmdW5jdGlvbiggJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSApIHtcblx0XHRcdFdDQVBGLnVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQoICRyZXNwb25zZSApO1xuXG5cdFx0XHQvLyBSZWluaXRpYWxpemUgd2NhcGYuXG5cdFx0XHRXQ0FQRi5pbml0KCk7XG5cblx0XHRcdGlmICggISBpc1BybyAmJiAnYWZ0ZXInID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd193aGVuICkge1xuXHRcdFx0XHRXQ0FQRi5zY3JvbGxUbygpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUcmlnZ2VyIGV2ZW50cy5cblx0XHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggJ3JlYWR5JyApO1xuXHRcdFx0JCggd2luZG93ICkudHJpZ2dlciggJ3Njcm9sbCcgKTtcblx0XHRcdCQoIHdpbmRvdyApLnRyaWdnZXIoICdyZXNpemUnICk7XG5cblx0XHRcdC8vIEEzIExhenkgTG9hZCBzdXBwb3J0LlxuXHRcdFx0JCggd2luZG93ICkudHJpZ2dlciggJ2xhenlzaG93JyApO1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5jdXN0b21fc2NyaXB0cyApIHtcblx0XHRcdFx0ZXZhbCggd2NhcGZfcGFyYW1zLmN1c3RvbV9zY3JpcHRzICk7XG5cdFx0XHR9XG5cblx0XHRcdCRkb2N1bWVudC50cmlnZ2VyKCAnd2NhcGZfYWZ0ZXJfdXBkYXRpbmdfcHJvZHVjdHMnLCBbICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgXSApO1xuXHRcdH0sXG5cdFx0ZmlsdGVyUHJvZHVjdHM6IGZ1bmN0aW9uKCB0cmlnZ2VyZWRCeSA9ICdmaWx0ZXInICkge1xuXHRcdFx0V0NBUEYuYmVmb3JlRmV0Y2hpbmdQcm9kdWN0cyggdHJpZ2dlcmVkQnkgKTtcblxuXHRcdFx0JC5hamF4KCB7XG5cdFx0XHRcdHVybDogd2luZG93LmxvY2F0aW9uLmhyZWYsXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdFx0XHRjb25zdCAkcmVzcG9uc2UgPSAkKCByZXNwb25zZSApO1xuXG5cdFx0XHRcdFx0V0NBUEYuYmVmb3JlVXBkYXRpbmdQcm9kdWN0cyggJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSApO1xuXG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogVXBkYXRlIGRvY3VtZW50IHRpdGxlLlxuXHRcdFx0XHRcdCAqXG5cdFx0XHRcdFx0ICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNzU5OTU2MlxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnVwZGF0ZV9kb2N1bWVudF90aXRsZSApIHtcblx0XHRcdFx0XHRcdGRvY3VtZW50LnRpdGxlID0gJHJlc3BvbnNlLmZpbHRlciggJ3RpdGxlJyApLnRleHQoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBVcGRhdGUgdGhlIGluc3RhbmNlcy5cblx0XHRcdFx0XHRmb3IgKCBjb25zdCBpZCBvZiBpbnN0YW5jZUlkcyApIHtcblx0XHRcdFx0XHRcdGNvbnN0IGluc3RhbmNlSWQgPSAnW2RhdGEtaWQ9XCInICsgaWQgKyAnXCJdJztcblx0XHRcdFx0XHRcdGNvbnN0ICRpbnN0YW5jZSAgPSAkKCBpbnN0YW5jZUlkICk7XG5cdFx0XHRcdFx0XHRjb25zdCAkaW5uZXIgICAgID0gJGluc3RhbmNlLmZpbmQoICcud2NhcGYtZmlsdGVyLWlubmVyJyApO1xuXHRcdFx0XHRcdFx0Y29uc3QgX2luc3RhbmNlICA9ICRyZXNwb25zZS5maW5kKCBpbnN0YW5jZUlkICk7XG5cblx0XHRcdFx0XHRcdC8vIFByZXNlcnZlIGhpZXJhcmNoeSBhY2NvcmRpb24gc3RhdGUuXG5cdFx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5wcmVzZXJ2ZV9oaWVyYXJjaHlfYWNjb3JkaW9uX3N0YXRlICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRpbnN0YW5jZS5oYXNDbGFzcyggJ2hhcy1oaWVyYXJjaHktYWNjb3JkaW9uJyApICkge1xuXHRcdFx0XHRcdFx0XHRcdCRpbnN0YW5jZS5maW5kKCAnLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgJGVsID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgaWQgID0gJGVsLmRhdGEoICdpZCcgKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgdG9nZ2xlU2VsZWN0b3IgPSBgLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlW2RhdGEtaWQ9XCIkeyBpZCB9XCJdYDtcblxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBhY2NvcmRpb24gaXMgb3BlbmVkXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLXByZXNzZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCBwcmVzc2VkICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5hdHRyKCAnYXJpYS1wcmVzc2VkJywgJ3RydWUnICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCB0b2dnbGVTZWxlY3RvciApLmNsb3Nlc3QoICdsaScgKS5jaGlsZHJlbiggJ3VsJyApLnNob3coKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCB0b2dnbGVTZWxlY3RvciApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAnZmFsc2UnICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCB0b2dnbGVTZWxlY3RvciApLmNsb3Nlc3QoICdsaScgKS5jaGlsZHJlbiggJ3VsJyApLmhpZGUoKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gUHJlc2VydmUgc29mdCBsaW1pdCBzdGF0ZS5cblx0XHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnByZXNlcnZlX3NvZnRfbGltaXRfc3RhdGUgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJGluc3RhbmNlLmhhc0NsYXNzKCAnaGFzLXNvZnQtbGltaXQnICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgJGxpc3RXcmFwcGVyID0gJGluc3RhbmNlLmZpbmQoICcud2NhcGYtbGlzdC13cmFwcGVyJyApO1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCAkbGlzdFdyYXBwZXIuaGFzQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtbGlzdC13cmFwcGVyJyApLmFkZENsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLXNvZnQtbGltaXQtdHJpZ2dlcicgKS5hdHRyKCAnYXJpYS1wcmVzc2VkJywgJ3RydWUnICk7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKS5yZW1vdmVDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICdmYWxzZScgKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Y29uc3QgX2h0bWwgPSBfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1maWx0ZXItaW5uZXInICkuaHRtbCgpO1xuXG5cdFx0XHRcdFx0XHQvLyBGaW5hbGx5IHVwZGF0ZSB0aGUgaW5zdGFuY2UuXG5cdFx0XHRcdFx0XHQkaW5uZXIuaHRtbCggX2h0bWwgKTtcblxuXHRcdFx0XHRcdFx0JGluc3RhbmNlLnRyaWdnZXIoICd3Y2FwZi1maWx0ZXItdXBkYXRlZCcsIFsgX2luc3RhbmNlIF0gKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBVcGRhdGUgdGhlIGFjdGl2ZSBmaWx0ZXJzIGFuZCByZXNldCBmaWx0ZXJzLlxuXHRcdFx0XHRcdCRib2R5LmZpbmQoICcud2NhcGYtYWN0aXZlLWZpbHRlcnMsIC53Y2FwZi1yZXNldC1maWx0ZXJzJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0Y29uc3QgJHRoYXQgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRcdGNvbnN0IGluc3RhbmNlSWQgPSAnW2RhdGEtaWQ9XCInICsgJHRoYXQuZGF0YSggJ2lkJyApICsgJ1wiXSc7XG5cblx0XHRcdFx0XHRcdCR0aGF0Lmh0bWwoICRyZXNwb25zZS5maW5kKCBpbnN0YW5jZUlkICkuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdFx0Ly8gUmVwbGFjZSBvbGQgc2hvcCBsb29wIHdpdGggbmV3IG9uZS5cblx0XHRcdFx0XHRjb25zdCAkc2hvcExvb3BDb250YWluZXIgPSAkcmVzcG9uc2UuZmluZCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdFx0XHRjb25zdCAkbm90Rm91bmRDb250YWluZXIgPSAkcmVzcG9uc2UuZmluZCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKTtcblxuXHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgPT09IHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGlmICggJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJHNob3BMb29wQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmh0bWwoICRub3RGb3VuZENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJHNob3BMb29wQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRub3RGb3VuZENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFdDQVBGLmFmdGVyVXBkYXRpbmdQcm9kdWN0cyggJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRyZXF1ZXN0RmlsdGVyOiBmdW5jdGlvbiggdXJsLCB0cmlnZ2VyZWRCeSA9ICdmaWx0ZXInICkge1xuXHRcdFx0aWYgKCAhIHVybCApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5kaXNhYmxlX2FqYXggKSB7XG5cdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJsO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHsgd2NhcGY6IHRydWUgfSwgJycsIHVybCApO1xuXG5cdFx0XHRcdFdDQVBGLmZpbHRlclByb2R1Y3RzKCB0cmlnZ2VyZWRCeSApO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aGFuZGxlTnVtYmVySW5wdXRGaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHJhbmdlTnVtYmVyU2VsZWN0b3JzID0gJy53Y2FwZi1yYW5nZS1udW1iZXIgLm1pbi12YWx1ZSwgLndjYXBmLXJhbmdlLW51bWJlciAubWF4LXZhbHVlJztcblxuXHRcdFx0JGJvZHkub24oICdpbnB1dCcsIHJhbmdlTnVtYmVyU2VsZWN0b3JzLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Y29uc3QgJHJhbmdlTnVtYmVyICAgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXJhbmdlLW51bWJlcicgKTtcblx0XHRcdFx0Y29uc3QgZm9ybWF0TnVtYmVycyAgICAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZm9ybWF0LW51bWJlcnMnICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgb2xkTWluVmFsdWUgICAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IG9sZE1heFZhbHVlICAgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsUGxhY2VzICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRcdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1kZWNpbWFsLXNlcGFyYXRvcicgKTtcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRjb25zdCBnZXRWYWx1ZSA9ICggZmxvYXRWYWx1ZSApID0+IHtcblx0XHRcdFx0XHRpZiAoIGZvcm1hdE51bWJlcnMgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVtYmVyRm9ybWF0KCBmbG9hdFZhbHVlLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBmbG9hdFZhbHVlO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpdGVtLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGxldCBtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoKSApO1xuXHRcdFx0XHRcdGxldCBtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoKSApO1xuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdFx0XHRpZiAoIGlzTmFOKCBtaW5WYWx1ZSApICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRcdFx0aWYgKCBpc05hTiggbWF4VmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSByYW5nZU1pblZhbHVlLlxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPCByYW5nZU1pblZhbHVlICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA+IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdFx0XHRpZiAoIG1heFZhbHVlID4gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSBtaW5WYWx1ZS5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID4gbWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IG1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIElmIHZhbHVlIGlzIG5vdCBjaGFuZ2VkIHRoZW4gZG9uJ3QgcHJvY2VlZC5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID09PSBvbGRNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gb2xkTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdC8vIFJlbW92ZSByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkcmFuZ2VOdW1iZXIuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdGNvbnN0IHVybCA9ICRyYW5nZU51bWJlci5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclMXMnLCBtaW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVEYXRlSW5wdXRGaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgJy53Y2FwZi1kYXRlLWlucHV0IC5kYXRlLWlucHV0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWx0ZXIgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXHRcdFx0XHRjb25zdCBpc1JhbmdlID0gJGZpbHRlci5kYXRhKCAnaXMtcmFuZ2UnICk7XG5cblx0XHRcdFx0bGV0IGZpbHRlclVybCA9ICcnO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRmaWx0ZXIuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0aWYgKCBpc1JhbmdlICkge1xuXHRcdFx0XHRcdGNvbnN0IGZyb20gPSAkZmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApLnZhbCgpO1xuXHRcdFx0XHRcdGNvbnN0IHRvICAgPSAkZmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKS52YWwoKTtcblxuXHRcdFx0XHRcdGlmICggZnJvbSAmJiB0byApIHtcblx0XHRcdFx0XHRcdGZpbHRlclVybCA9ICRmaWx0ZXIuZGF0YSggJ3VybCcgKS5yZXBsYWNlKCAnJTFzJywgZnJvbSApLnJlcGxhY2UoICclMnMnLCB0byApO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoICEgZnJvbSAmJiAhIHRvICkge1xuXHRcdFx0XHRcdFx0ZmlsdGVyVXJsID0gJGZpbHRlci5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc3QgZnJvbSA9ICRmaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICkudmFsKCk7XG5cblx0XHRcdFx0XHRpZiAoIGZyb20gKSB7XG5cdFx0XHRcdFx0XHRmaWx0ZXJVcmwgPSAkZmlsdGVyLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyVzJywgZnJvbSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRmaWx0ZXJVcmwgPSAkZmlsdGVyLmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggZmlsdGVyVXJsICkge1xuXHRcdFx0XHRcdCRmaWx0ZXIuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkZmlsdGVyLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggZmlsdGVyVXJsICk7XG5cdFx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVMaXN0RmlsdGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCBuYXRpdmVJbnB1dHMgPSAnLmxpc3QtdHlwZS1uYXRpdmUgW3R5cGU9XCJjaGVja2JveFwiXSwnICtcblx0XHRcdFx0Jy5saXN0LXR5cGUtbmF0aXZlIFt0eXBlPVwicmFkaW9cIl0sJyArXG5cdFx0XHRcdCcubGlzdC10eXBlLWN1c3RvbS1jaGVja2JveCBbdHlwZT1cImNoZWNrYm94XCJdJztcblxuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCBuYXRpdmVJbnB1dHMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXItaXRlbScgKS50b2dnbGVDbGFzcyggJ2l0ZW0tYWN0aXZlJyApO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5kYXRhKCAndXJsJyApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGNvbnN0IGN1c3RvbVJhZGlvU2VsZWN0b3IgPSAnLmxpc3QtdHlwZS1jdXN0b20tcmFkaW8nO1xuXG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsIGN1c3RvbVJhZGlvU2VsZWN0b3IgKyAnIFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyLWl0ZW0nICkudG9nZ2xlQ2xhc3MoICdpdGVtLWFjdGl2ZScgKTtcblxuXHRcdFx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTgzOTkyNFxuXHRcdFx0XHQkKCB0aGlzIClcblx0XHRcdFx0XHQuY2xvc2VzdCggY3VzdG9tUmFkaW9TZWxlY3RvciApXG5cdFx0XHRcdFx0LmZpbmQoICcud2NhcGYtZmlsdGVyLWl0ZW0uaXRlbS1hY3RpdmUgW3R5cGU9XCJjaGVja2JveFwiXScgKVxuXHRcdFx0XHRcdC5ub3QoIHRoaXMgKVxuXHRcdFx0XHRcdC5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlIClcblx0XHRcdFx0XHQuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXItaXRlbScgKVxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcyggJ2l0ZW0tYWN0aXZlJyApO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5kYXRhKCAndXJsJyApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVEcm9wZG93bkZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCAnLndjYXBmLWRyb3Bkb3duLXdyYXBwZXIgc2VsZWN0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRzZWxlY3QgICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCB2YWx1ZXMgICAgICAgICA9ICRzZWxlY3QudmFsKCk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlclVSTCAgICAgID0gJHNlbGVjdC5kYXRhKCAndXJsJyApO1xuXHRcdFx0XHRjb25zdCBjbGVhckZpbHRlclVSTCA9ICRzZWxlY3QuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICk7XG5cdFx0XHRcdGxldCB1cmw7XG5cblx0XHRcdFx0aWYgKCB2YWx1ZXMubGVuZ3RoICkge1xuXHRcdFx0XHRcdHVybCA9IGZpbHRlclVSTC5yZXBsYWNlKCAnJXMnLCB2YWx1ZXMudG9TdHJpbmcoKSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHVybCA9IGNsZWFyRmlsdGVyVVJMO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVQYWdpbmF0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4ICYmIHdjYXBmX3BhcmFtcy5wYWdpbmF0aW9uX2NvbnRhaW5lciApIHtcblx0XHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRcdGNvbnN0IF9zZWxlY3RvcnMgPSB3Y2FwZl9wYXJhbXMucGFnaW5hdGlvbl9jb250YWluZXIuc3BsaXQoICcsJyApO1xuXHRcdFx0XHRjb25zdCBzZWxlY3RvcnMgID0gW107XG5cblx0XHRcdFx0X3NlbGVjdG9ycy5mb3JFYWNoKCBzZWxlY3RvciA9PiB7XG5cdFx0XHRcdFx0aWYgKCBzZWxlY3RvciApIHtcblx0XHRcdFx0XHRcdHNlbGVjdG9ycy5wdXNoKCBzZWxlY3RvciArICcgYScgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRjb25zdCBzZWxlY3RvciA9IHNlbGVjdG9ycy5qb2luKCAnLCcgKTtcblxuXHRcdFx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdCRjb250YWluZXIub24oICdjbGljaycsIHNlbGVjdG9yLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgaHJlZiA9ICQoIHRoaXMgKS5hdHRyKCAnaHJlZicgKTtcblxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggaHJlZiwgJ3BhZ2luYXRlJyApO1xuXHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aGFuZGxlRGVmYXVsdE9yZGVyYnk6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5zb3J0aW5nX2NvbnRyb2wgKSB7XG5cdFx0XHRcdC8vIFN1Ym1pdCB0aGUgb3JkZXJieSBmb3JtIHdoZW4gdmFsdWUgaXMgY2hhbmdlZC5cblx0XHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCBkZWZhdWx0T3JkZXJCeUVsZW1lbnQsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5jbG9zZXN0KCAnZm9ybScgKS50cmlnZ2VyKCAnc3VibWl0JyApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBQcmV2ZW50IHRoZSBhdXRvIHN1Ym1pc3Npb24gb2YgdGhlIG9yZGVyYnkgZm9ybS5cblx0XHRcdCRib2R5Lm9uKCAnc3VibWl0Jywgd2NhcGZfcGFyYW1zLm9yZGVyYnlfZm9ybSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCB2aWEgYWpheCB3aGVuIHRoZSBvcmRlcmJ5IHZhbHVlIGlzIGNoYW5nZWQuXG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsIGRlZmF1bHRPcmRlckJ5RWxlbWVudCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0IG9yZGVyID0gJCggdGhpcyApLnZhbCgpO1xuXG5cdFx0XHRcdGNvbnN0IHVybCA9IG5ldyBVUkwoIHdpbmRvdy5sb2NhdGlvbiApO1xuXHRcdFx0XHR1cmwuc2VhcmNoUGFyYW1zLnNldCggJ29yZGVyYnknLCBvcmRlciApO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIGdldE9yZGVyQnlVcmwoIHVybC5ocmVmICkgKTtcblxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVDbGVhckZpbHRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHQkYm9keS5vbiggJ2NsaWNrJywgJy53Y2FwZi1maWx0ZXItY2xlYXItYnRuJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJCggdGhpcyApLmF0dHIoICdkYXRhLWNsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZUZpbHRlclRvb2x0aXA6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZFJlZmVyZW5jZVxuXHRcdFx0aWYgKCAnZnVuY3Rpb24nICE9PSB0eXBlb2YgdGlwcHkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy51c2VfdGlwcHlqcyApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkUmVmZXJlbmNlXG5cdFx0XHR0aXBweSggJy53Y2FwZi1maWx0ZXItdG9vbHRpcCcsIHtcblx0XHRcdFx0cGxhY2VtZW50OiAndG9wJyxcblx0XHRcdFx0Y29udGVudCggcmVmZXJlbmNlICkge1xuXHRcdFx0XHRcdHJldHVybiByZWZlcmVuY2UuZ2V0QXR0cmlidXRlKCAnZGF0YS1jb250ZW50JyApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRhbGxvd0hUTUw6IHRydWUsXG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRpbml0Q29tYm9ib3g6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAhIGpRdWVyeSgpLmNob3NlbldDQVBGICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHRlbXBsYXRlUmVzdWx0ID0gKCB0ZXh0LCBkYXRhICkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdCc8c3Bhbj4nICsgdGV4dCArICc8L3NwYW4+Jyxcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJ3Y2FwZi1jb3VudFwiPicgKyBkYXRhWyAnY291bnRNYXJrdXAnIF0gKyAnPC9zcGFuPicsXG5cdFx0XHRcdF0uam9pbiggJycgKTtcblx0XHRcdH07XG5cblx0XHRcdGNvbnN0IHRlbXBsYXRlU2VsZWN0aW9uID0gKCB0ZXh0LCBkYXRhICkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cIndjYXBmLWNvdW50LScgKyBkYXRhLmNvdW50ICsgJ1wiPicgKyB0ZXh0ICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cIndjYXBmLWNvdW50IHdjYXBmLWNvdW50LScgKyBkYXRhLmNvdW50ICsgJ1wiPicgKyBkYXRhWyAnY291bnRNYXJrdXAnIF0gKyAnPC9zcGFuPicsXG5cdFx0XHRcdF0uam9pbiggJycgKTtcblx0XHRcdH07XG5cblx0XHRcdGNvbnN0IGRlZmF1bHRzID0ge1xuXHRcdFx0XHRpbmhlcml0X3NlbGVjdF9jbGFzc2VzOiB0cnVlLFxuXHRcdFx0XHRpbmhlcml0X29wdGlvbl9jbGFzc2VzOiB0cnVlLFxuXHRcdFx0XHRub19yZXN1bHRzX3RleHQ6IHdjYXBmX3BhcmFtcy5jb21ib2JveF9ub19yZXN1bHRzX3RleHQsXG5cdFx0XHRcdG9wdGlvbnNfbm9uZV90ZXh0OiB3Y2FwZl9wYXJhbXMuY29tYm9ib3hfb3B0aW9uc19ub25lX3RleHQsXG5cdFx0XHRcdHNlYXJjaF9jb250YWluczogdHJ1ZSwgLy8gTWF0Y2ggZnJvbSBhbnl3aGVyZSBpbiBzdHJpbmcuXG5cdFx0XHRcdHNlYXJjaF9pbl92YWx1ZXM6IHRydWUsIC8vIFNlYXJjaCBpbiB2YWx1ZXMgYWxzby5cblx0XHRcdH07XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmlzX3J0bCApIHtcblx0XHRcdFx0ZGVmYXVsdHNbICdydGwnIF0gPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLWNob3NlbicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRoaXMgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHsgLi4uZGVmYXVsdHMgfTtcblxuXHRcdFx0XHQvLyBJZiBoaWVyYXJjaHkgZW5hYmxlZCB0aGVuIHdlIHNob3cgdGhlIHNlbGVjdGVkIG9wdGlvbnMuXG5cdFx0XHRcdGlmICggJHRoaXMuaGFzQ2xhc3MoICdoYXMtaGllcmFyY2h5JyApICkge1xuXHRcdFx0XHRcdG9wdGlvbnNbICdkaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMnIF0gPSB0cnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG9wdGlvbnNbICdkaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMnIF0gPSB3Y2FwZl9wYXJhbXMuY29tYm9ib3hfZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gRW5hYmxlIHRlbXBsYXRpbmcgd2hlbiBzaG93aW5nIGNvdW50LlxuXHRcdFx0XHRpZiAoICR0aGlzLmhhc0NsYXNzKCAnd2l0aC1jb3VudCcgKSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAndGVtcGxhdGVSZXN1bHQnIF0gICAgPSB0ZW1wbGF0ZVJlc3VsdDtcblx0XHRcdFx0XHRvcHRpb25zWyAndGVtcGxhdGVTZWxlY3Rpb24nIF0gPSB0ZW1wbGF0ZVNlbGVjdGlvbjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIERpc2FibGUgc2VhcmNoIGJveC5cblx0XHRcdFx0aWYgKCAhICR0aGlzLmRhdGEoICdlbmFibGUtc2VhcmNoJyApICkge1xuXHRcdFx0XHRcdG9wdGlvbnNbICdkaXNhYmxlX3NlYXJjaCcgXSA9IHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkdGhpcy5jaG9zZW5XQ0FQRiggb3B0aW9ucyApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBBdHRhY2ggY2hvc2VuIGZvciBkZWZhdWx0IG9yZGVyYnkuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5hdHRhY2hfY29tYm9ib3hfb25fc29ydGluZyApIHtcblx0XHRcdFx0bGV0IGRpc2FibGVTZWFyY2ggPSB0cnVlO1xuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnNlYXJjaF9ib3hfaW5fZGVmYXVsdF9vcmRlcmJ5ICkge1xuXHRcdFx0XHRcdGRpc2FibGVTZWFyY2ggPSBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7IC4uLmRlZmF1bHRzIH07XG5cblx0XHRcdFx0b3B0aW9uc1sgJ2Rpc2FibGVfc2VhcmNoJyBdID0gZGlzYWJsZVNlYXJjaDtcblxuXHRcdFx0XHQkYm9keS5maW5kKCBkZWZhdWx0T3JkZXJCeUVsZW1lbnQgKS5jaG9zZW5XQ0FQRiggb3B0aW9ucyApO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aW5pdFJhbmdlU2xpZGVyOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCRib2R5LmZpbmQoICcud2NhcGYtcmFuZ2Utc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkaXRlbSAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCAkc2xpZGVyID0gJGl0ZW0uZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKTtcblxuXHRcdFx0XHRjb25zdCBzbGlkZXJJZCAgICAgICAgICA9ICRzbGlkZXIuYXR0ciggJ2lkJyApO1xuXHRcdFx0XHRjb25zdCBkaXNwbGF5VmFsdWVzQXMgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRpc3BsYXktdmFsdWVzLWFzJyApO1xuXHRcdFx0XHRjb25zdCBmb3JtYXROdW1iZXJzICAgICA9ICRpdGVtLmF0dHIoICdkYXRhLWZvcm1hdC1udW1iZXJzJyApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1pblZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBzdGVwICAgICAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXN0ZXAnICkgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFBsYWNlcyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRcdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkaXRlbS5hdHRyKCAnZGF0YS10aG91c2FuZC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IG1pblZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IG1heFZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0ICRtaW5WYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5taW4tdmFsdWUnICk7XG5cdFx0XHRcdGNvbnN0ICRtYXhWYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5tYXgtdmFsdWUnICk7XG5cblx0XHRcdFx0Y29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIHNsaWRlcklkICk7XG5cblx0XHRcdFx0bm9VaVNsaWRlci5jcmVhdGUoIHNsaWRlciwge1xuXHRcdFx0XHRcdHN0YXJ0OiBbIG1pblZhbHVlLCBtYXhWYWx1ZSBdLFxuXHRcdFx0XHRcdHN0ZXAsXG5cdFx0XHRcdFx0Y29ubmVjdDogdHJ1ZSxcblx0XHRcdFx0XHRjc3NQcmVmaXg6ICd3Y2FwZi1ub3VpLScsXG5cdFx0XHRcdFx0cmFuZ2U6IHtcblx0XHRcdFx0XHRcdCdtaW4nOiByYW5nZU1pblZhbHVlLFxuXHRcdFx0XHRcdFx0J21heCc6IHJhbmdlTWF4VmFsdWUsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICd1cGRhdGUnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHRcdGxldCBtaW5WYWx1ZTtcblx0XHRcdFx0XHRsZXQgbWF4VmFsdWU7XG5cblx0XHRcdFx0XHRpZiAoIGZvcm1hdE51bWJlcnMgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IG51bWJlckZvcm1hdCggdmFsdWVzWyAwIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IG51bWJlckZvcm1hdCggdmFsdWVzWyAxIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAwIF0gKTtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoICdwbGFpbl90ZXh0JyA9PT0gZGlzcGxheVZhbHVlc0FzICkge1xuXHRcdFx0XHRcdFx0JG1pblZhbHVlLmh0bWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0XHQkbWF4VmFsdWUuaHRtbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JG1pblZhbHVlLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHRcdCRtYXhWYWx1ZS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICkge1xuXHRcdFx0XHRcdGNvbnN0IF9taW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0Y29uc3QgX21heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblxuXHRcdFx0XHRcdC8vIElmIHZhbHVlIGlzIG5vdCBjaGFuZ2VkIHRoZW4gZG9uJ3QgcHJvY2VlZC5cblx0XHRcdFx0XHRpZiAoIF9taW5WYWx1ZSA9PT0gbWluVmFsdWUgJiYgX21heFZhbHVlID09PSBtYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIF9taW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBfbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHQvLyBSZW1vdmUgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJGl0ZW0uZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdGNvbnN0IHVybCA9ICRpdGVtLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIF9taW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBfbWF4VmFsdWUgKTtcblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtaW5WYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG1pblZhbHVlLCBudWxsIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkbWF4VmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRcdGNsZWFyVGltZW91dCggJGlucHV0LmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBudWxsLCBtYXhWYWx1ZSBdICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRpbml0RGF0ZXBpY2tlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgalF1ZXJ5KCkuZGF0ZXBpY2tlciApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCAkd2NhcGZEYXRlRmlsdGVyID0gJGJvZHkuZmluZCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXG5cdFx0XHRjb25zdCBmb3JtYXQgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLWZvcm1hdCcgKTtcblx0XHRcdGNvbnN0IHllYXJEcm9wZG93biAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtcGlja2VyLXllYXItZHJvcGRvd24nICk7XG5cdFx0XHRjb25zdCBtb250aERyb3Bkb3duID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLXBpY2tlci1tb250aC1kcm9wZG93bicgKTtcblxuXHRcdFx0Y29uc3QgJGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApO1xuXHRcdFx0Y29uc3QgJHRvICAgPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKTtcblxuXHRcdFx0JGZyb20uZGF0ZXBpY2tlcigge1xuXHRcdFx0XHRkYXRlRm9ybWF0OiBmb3JtYXQsXG5cdFx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdFx0Y2hhbmdlTW9udGg6IG1vbnRoRHJvcGRvd24sXG5cdFx0XHR9ICk7XG5cblx0XHRcdCR0by5kYXRlcGlja2VyKCB7XG5cdFx0XHRcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdFx0Y2hhbmdlWWVhcjogeWVhckRyb3Bkb3duLFxuXHRcdFx0XHRjaGFuZ2VNb250aDogbW9udGhEcm9wZG93bixcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXRGaWx0ZXJPcHRpb25Ub29sdGlwOiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRSZWZlcmVuY2Vcblx0XHRcdGlmICggJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHRpcHB5ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMudXNlX3RpcHB5anMgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgdG9vbHRpcFBvc2l0aW9ucyA9IFsgJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCcgXTtcblxuXHRcdFx0dG9vbHRpcFBvc2l0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbiggdG9vbHRpcFBvc2l0aW9uICkge1xuXHRcdFx0XHRjb25zdCBpZGVudGlmaWVyID0gJ2RhdGEtd2NhcGYtdG9vbHRpcC0nICsgdG9vbHRpcFBvc2l0aW9uO1xuXG5cdFx0XHRcdC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRSZWZlcmVuY2Vcblx0XHRcdFx0Y29uc3QgaW5zdGFuY2VzID0gdGlwcHkoICdbJyArIGlkZW50aWZpZXIgKyAnXScsIHtcblx0XHRcdFx0XHRwbGFjZW1lbnQ6IHRvb2x0aXBQb3NpdGlvbixcblx0XHRcdFx0XHRjb250ZW50KCByZWZlcmVuY2UgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSggaWRlbnRpZmllciApO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0YWxsb3dIVE1MOiB0cnVlLFxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0d2luZG93LnRpcHB5SW5zdGFuY2VzID0gdGlwcHlJbnN0YW5jZXMuY29uY2F0KCBpbnN0YW5jZXMgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0V0NBUEYuaW5pdENvbWJvYm94KCk7XG5cdFx0XHRXQ0FQRi5pbml0UmFuZ2VTbGlkZXIoKTtcblx0XHRcdFdDQVBGLmluaXREYXRlcGlja2VyKCk7XG5cdFx0XHRXQ0FQRi5pbml0RmlsdGVyT3B0aW9uVG9vbHRpcCgpO1xuXHRcdH0sXG5cdFx0aGFuZGxlRm9ybVN1Ym1pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHQkYm9keS5vbiggJ3N1Ym1pdCcsICcud2NhcGYtZm9ybScsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRpbml0UG9wU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucmVsb2FkX29uX2JhY2sgJiYgd2NhcGZfcGFyYW1zLmZvdW5kX3djYXBmICkge1xuXHRcdFx0XHRoaXN0b3J5LnJlcGxhY2VTdGF0ZSggeyB3Y2FwZjogdHJ1ZSB9LCAnJywgd2luZG93LmxvY2F0aW9uICk7XG5cblx0XHRcdFx0Ly8gSGFuZGxlIHRoZSBwb3BzdGF0ZSBldmVudChicm93c2VyJ3MgYmFjay9mb3J3YXJkKVxuXHRcdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3BvcHN0YXRlJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0aWYgKCBudWxsICE9PSBlLnN0YXRlICYmIGUuc3RhdGUuaGFzT3duUHJvcGVydHkoICd3Y2FwZicgKSApIHtcblx0XHRcdFx0XHRcdFdDQVBGLmZpbHRlclByb2R1Y3RzKCAncG9wc3RhdGUnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBFbmFibGUgaXQgaWYgbmVjZXNzYXJ5LlxuXHQgKlxuXHQgKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zMzAwNDkxN1xuXHQgKi9cblx0aWYgKCAnc2Nyb2xsUmVzdG9yYXRpb24nIGluIGhpc3RvcnkgKSB7XG5cdFx0Ly8gaGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvbiA9ICdtYW51YWwnO1xuXHR9XG5cbn0oIGpRdWVyeSwgd2luZG93ICkgKTtcblxuKCBmdW5jdGlvbiggJCwgV0NBUEYgKSB7XG5cblx0V0NBUEYuaW5pdCgpO1xuXHRXQ0FQRi5pbml0UG9wU3RhdGUoKTtcblxuXHRXQ0FQRi5oYW5kbGVGaWx0ZXJBY2NvcmRpb24oKTtcblx0V0NBUEYuaGFuZGxlSGllcmFyY2h5VG9nZ2xlKCk7XG5cdFdDQVBGLmhhbmRsZVNvZnRMaW1pdCgpO1xuXHRXQ0FQRi5oYW5kbGVTZWFyY2hGaWx0ZXJPcHRpb25zKCk7XG5cblx0V0NBUEYuaGFuZGxlTGlzdEZpbHRlcnMoKTtcblx0V0NBUEYuaGFuZGxlRHJvcGRvd25GaWx0ZXJzKCk7XG5cdFdDQVBGLmhhbmRsZU51bWJlcklucHV0RmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVEYXRlSW5wdXRGaWx0ZXJzKCk7XG5cdFdDQVBGLmhhbmRsZVBhZ2luYXRpb24oKTtcblx0V0NBUEYuaGFuZGxlRGVmYXVsdE9yZGVyYnkoKTtcblxuXHRXQ0FQRi5oYW5kbGVDbGVhckZpbHRlcigpO1xuXG5cdFdDQVBGLmhhbmRsZUZpbHRlclRvb2x0aXAoKTtcblxuXHRXQ0FQRi5oYW5kbGVGb3JtU3VibWl0KCk7XG5cblx0LyoqXG5cdCAqIE1ha2UgaXQgY29tcGF0aWJsZSB3aXRoIG90aGVyIHBsdWdpbnMuXG5cdCAqL1xuXHQkKCBkb2N1bWVudCApLm9uKCAnd2NhcGZfYWZ0ZXJfdXBkYXRpbmdfcHJvZHVjdHMnLCBmdW5jdGlvbigpIHtcblx0XHQvLyB3b28tdmFyaWF0aW9uLXN3YXRjaGVzXG5cdFx0JCggZG9jdW1lbnQgKS50cmlnZ2VyKCAnd29vX3ZhcmlhdGlvbl9zd2F0Y2hlc19wcm9faW5pdCcgKTtcblx0fSApO1xuXG59KCBqUXVlcnksIHdpbmRvdy5XQ0FQRiApICk7XG4iLCIvKipcbiAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM0MTQxODEzXG4gKlxuICogQHBhcmFtIG51bWJlclxuICogQHBhcmFtIGRlY2ltYWxzXG4gKiBAcGFyYW0gZGVjX3BvaW50XG4gKiBAcGFyYW0gdGhvdXNhbmRzX3NlcFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIG51bWJlckZvcm1hdCggbnVtYmVyLCBkZWNpbWFscywgZGVjX3BvaW50LCB0aG91c2FuZHNfc2VwICkge1xuXHQvLyBTdHJpcCBhbGwgY2hhcmFjdGVycyBidXQgbnVtZXJpY2FsIG9uZXMuXG5cdG51bWJlciA9ICggbnVtYmVyICsgJycgKS5yZXBsYWNlKCAvW15cXGQrXFwtRWUuXS9nLCAnJyApO1xuXG5cdGNvbnN0IG4gICAgPSAhIGlzRmluaXRlKCArbnVtYmVyICkgPyAwIDogK251bWJlcjtcblx0Y29uc3QgcHJlYyA9ICEgaXNGaW5pdGUoICtkZWNpbWFscyApID8gMCA6IE1hdGguYWJzKCBkZWNpbWFscyApO1xuXHRjb25zdCBzZXAgID0gKCB0eXBlb2YgdGhvdXNhbmRzX3NlcCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcsJyA6IHRob3VzYW5kc19zZXA7XG5cdGNvbnN0IGRlYyAgPSAoIHR5cGVvZiBkZWNfcG9pbnQgPT09ICd1bmRlZmluZWQnICkgPyAnLicgOiBkZWNfcG9pbnQ7XG5cblx0bGV0IHM7XG5cblx0Y29uc3QgdG9GaXhlZEZpeCA9IGZ1bmN0aW9uKCBuLCBwcmVjICkge1xuXHRcdGNvbnN0IGsgPSBNYXRoLnBvdyggMTAsIHByZWMgKTtcblx0XHRyZXR1cm4gJycgKyBNYXRoLnJvdW5kKCBuICogayApIC8gaztcblx0fTtcblxuXHQvLyBGaXggZm9yIElFIHBhcnNlRmxvYXQoMC41NSkudG9GaXhlZCgwKSA9IDA7XG5cdHMgPSAoIHByZWMgPyB0b0ZpeGVkRml4KCBuLCBwcmVjICkgOiAnJyArIE1hdGgucm91bmQoIG4gKSApLnNwbGl0KCAnLicgKTtcblxuXHRpZiAoIHNbIDAgXS5sZW5ndGggPiAzICkge1xuXHRcdHNbIDAgXSA9IHNbIDAgXS5yZXBsYWNlKCAvXFxCKD89KD86XFxkezN9KSsoPyFcXGQpKS9nLCBzZXAgKTtcblx0fVxuXG5cdGlmICggKCBzWyAxIF0gfHwgJycgKS5sZW5ndGggPCBwcmVjICkge1xuXHRcdHNbIDEgXSA9IHNbIDEgXSB8fCAnJztcblx0XHRzWyAxIF0gKz0gbmV3IEFycmF5KCBwcmVjIC0gc1sgMSBdLmxlbmd0aCArIDEgKS5qb2luKCAnMCcgKTtcblx0fVxuXG5cdHJldHVybiBzLmpvaW4oIGRlYyApO1xufVxuXG5mdW5jdGlvbiBjbGVhblVybCggdXJsICkge1xuXHRyZXR1cm4gdXJsLnJlcGxhY2UoIC8lMkMvZywgJywnICk7XG59XG5cbmZ1bmN0aW9uIGdldE9yZGVyQnlVcmwoIHVybCApIHtcblx0Y29uc3QgcGFnZWQgPSBwYXJzZUludCggdXJsLnJlcGxhY2UoIC8uK1xcL3BhZ2VcXC8oXFxkKykrLywgJyQxJyApICk7XG5cblx0aWYgKCBwYWdlZCApIHtcblx0XHR1cmwgPSB1cmwucmVwbGFjZSggL3BhZ2VcXC8oXFxkKylcXC8vLCAnJyApO1xuXHR9XG5cblx0cmV0dXJuIGNsZWFuVXJsKCB1cmwgKTtcbn1cbiJdfQ==
