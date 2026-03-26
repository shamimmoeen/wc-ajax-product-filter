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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJ1dGlscy5qcyJdLCJuYW1lcyI6WyJ3Y2FwZl9wYXJhbXMiLCIkIiwid2luZG93IiwiX2RlbGF5IiwicGFyc2VJbnQiLCJmaWx0ZXJfaW5wdXRfZGVsYXkiLCJkZWxheSIsImlzUHJvIiwid2NhcGZfcHJvIiwiJGJvZHkiLCIkZG9jdW1lbnQiLCJkb2N1bWVudCIsImluc3RhbmNlSWRzIiwiZGVmYXVsdE9yZGVyQnlFbGVtZW50Iiwib3JkZXJieV9mb3JtIiwib3JkZXJieV9lbGVtZW50IiwiZWFjaCIsImlkIiwiZGF0YSIsInB1c2giLCJ0aXBweUluc3RhbmNlcyIsIldDQVBGIiwiaGFuZGxlRmlsdGVyQWNjb3JkaW9uIiwidG9nZ2xlQWNjb3JkaW9uIiwiJGVsIiwicHJlc3NlZCIsImF0dHIiLCIkZmlsdGVySW5uZXIiLCJjbG9zZXN0IiwiY2hpbGRyZW4iLCJlbmFibGVfYW5pbWF0aW9uX2Zvcl9maWx0ZXJfYWNjb3JkaW9uIiwic2xpZGVUb2dnbGUiLCJmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsInRvZ2dsZSIsIm9uIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsIiR0cmlnZ2VyIiwiZmluZCIsImhhbmRsZUhpZXJhcmNoeVRvZ2dsZSIsIiRjaGlsZCIsImVuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24iLCJoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsImtleSIsInByZXZlbnREZWZhdWx0IiwiaGFuZGxlU29mdExpbWl0IiwidG9nZ2xlRmlsdGVyT3B0aW9ucyIsIiRsaXN0V3JhcHBlciIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJoYW5kbGVTZWFyY2hGaWx0ZXJPcHRpb25zIiwiJHRoYXQiLCIkaW5uZXIiLCIkZmlsdGVyIiwic29mdExpbWl0RW5hYmxlZCIsImhhc0NsYXNzIiwic29mdExpbWl0VG9nZ2xlIiwibm9SZXN1bHRzIiwidmlzaWJsZU9wdGlvbnMiLCJrZXl3b3JkIiwidmFsIiwibGVuZ3RoIiwiaW5kZXgiLCIkZmlsdGVySXRlbSIsInJlbW92ZUF0dHIiLCJ0ZXh0IiwiaGlkZSIsImxhYmVsIiwidG9TdHJpbmciLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwic2hvdyIsIiRzZWFyY2hCb3giLCIkaW5wdXQiLCJ0cmlnZ2VyIiwiJHdyYXBwZXIiLCJmaWx0ZXJVUkwiLCJjbGVhckZpbHRlclVSTCIsInVybCIsInJlcGxhY2UiLCJyZXF1ZXN0RmlsdGVyIiwidXBkYXRlUHJvZHVjdHNDb3VudFJlc3VsdCIsIiRyZXNwb25zZSIsIiRjb250YWluZXIiLCJzaG9wX2xvb3BfY29udGFpbmVyIiwic2VsZWN0b3IiLCJuZXdDb3VudCIsImh0bWwiLCJoYXMiLCJzY3JvbGxUbyIsInNjcm9sbF93aW5kb3ciLCJzY3JvbGxGb3IiLCJzY3JvbGxfd2luZG93X2ZvciIsImlzTW9iaWxlIiwiaXNfbW9iaWxlIiwicHJvY2VlZCIsImFkanVzdGluZ09mZnNldCIsIm9mZnNldCIsInNjcm9sbF90b190b3Bfb2Zmc2V0IiwiY29udGFpbmVyIiwibm90X2ZvdW5kX2NvbnRhaW5lciIsInNjcm9sbF93aW5kb3dfY3VzdG9tX2VsZW1lbnQiLCJ0b3AiLCJzdG9wIiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsInNjcm9sbF90b190b3Bfc3BlZWQiLCJzY3JvbGxfdG9fdG9wX2Vhc2luZyIsImJlZm9yZUZldGNoaW5nUHJvZHVjdHMiLCJ0cmlnZ2VyZWRCeSIsInNjcm9sbF93aW5kb3dfd2hlbiIsImRlc3Ryb3lUaXBweUluc3RhbmNlcyIsInVzZV90aXBweWpzIiwiZm9yRWFjaCIsImluc3RhbmNlIiwiZGVzdHJveSIsImJlZm9yZVVwZGF0aW5nUHJvZHVjdHMiLCJhZnRlclVwZGF0aW5nUHJvZHVjdHMiLCJpbml0IiwiY3VzdG9tX3NjcmlwdHMiLCJldmFsIiwiZmlsdGVyUHJvZHVjdHMiLCJhcmd1bWVudHMiLCJ1bmRlZmluZWQiLCJhamF4IiwibG9jYXRpb24iLCJocmVmIiwic3VjY2VzcyIsInJlc3BvbnNlIiwidXBkYXRlX2RvY3VtZW50X3RpdGxlIiwidGl0bGUiLCJmaWx0ZXIiLCJfbG9vcCIsIl9pbnN0YW5jZUlkcyIsIl9pIiwiaW5zdGFuY2VJZCIsIiRpbnN0YW5jZSIsIl9pbnN0YW5jZSIsInByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUiLCJ0b2dnbGVTZWxlY3RvciIsImNvbmNhdCIsInByZXNlcnZlX3NvZnRfbGltaXRfc3RhdGUiLCJfaHRtbCIsIiRzaG9wTG9vcENvbnRhaW5lciIsIiRub3RGb3VuZENvbnRhaW5lciIsImRpc2FibGVfYWpheCIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJ3Y2FwZiIsImhhbmRsZU51bWJlcklucHV0RmlsdGVycyIsInJhbmdlTnVtYmVyU2VsZWN0b3JzIiwiJGl0ZW0iLCIkcmFuZ2VOdW1iZXIiLCJmb3JtYXROdW1iZXJzIiwicmFuZ2VNaW5WYWx1ZSIsInBhcnNlRmxvYXQiLCJyYW5nZU1heFZhbHVlIiwib2xkTWluVmFsdWUiLCJvbGRNYXhWYWx1ZSIsImRlY2ltYWxQbGFjZXMiLCJ0aG91c2FuZFNlcGFyYXRvciIsImRlY2ltYWxTZXBhcmF0b3IiLCJnZXRWYWx1ZSIsImZsb2F0VmFsdWUiLCJudW1iZXJGb3JtYXQiLCJtaW5WYWx1ZSIsIm1heFZhbHVlIiwiaXNOYU4iLCJoYW5kbGVMaXN0RmlsdGVycyIsIm5hdGl2ZUlucHV0cyIsInRvZ2dsZUNsYXNzIiwiY3VzdG9tUmFkaW9TZWxlY3RvciIsIm5vdCIsInByb3AiLCJoYW5kbGVEcm9wZG93bkZpbHRlcnMiLCIkc2VsZWN0IiwidmFsdWVzIiwiaGFuZGxlUGFnaW5hdGlvbiIsImVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4IiwicGFnaW5hdGlvbl9jb250YWluZXIiLCJfc2VsZWN0b3JzIiwic3BsaXQiLCJzZWxlY3RvcnMiLCJqb2luIiwiaGFuZGxlRGVmYXVsdE9yZGVyYnkiLCJzb3J0aW5nX2NvbnRyb2wiLCJvcmRlciIsIlVSTCIsInNlYXJjaFBhcmFtcyIsInNldCIsImdldE9yZGVyQnlVcmwiLCJoYW5kbGVDbGVhckZpbHRlciIsImhhbmRsZUZpbHRlclRvb2x0aXAiLCJ0aXBweSIsInBsYWNlbWVudCIsImNvbnRlbnQiLCJyZWZlcmVuY2UiLCJnZXRBdHRyaWJ1dGUiLCJhbGxvd0hUTUwiLCJpbml0Q29tYm9ib3giLCJqUXVlcnkiLCJjaG9zZW5XQ0FQRiIsInRlbXBsYXRlUmVzdWx0IiwidGVtcGxhdGVTZWxlY3Rpb24iLCJjb3VudCIsImRlZmF1bHRzIiwiaW5oZXJpdF9zZWxlY3RfY2xhc3NlcyIsImluaGVyaXRfb3B0aW9uX2NsYXNzZXMiLCJub19yZXN1bHRzX3RleHQiLCJjb21ib2JveF9ub19yZXN1bHRzX3RleHQiLCJvcHRpb25zX25vbmVfdGV4dCIsImNvbWJvYm94X29wdGlvbnNfbm9uZV90ZXh0Iiwic2VhcmNoX2NvbnRhaW5zIiwic2VhcmNoX2luX3ZhbHVlcyIsImlzX3J0bCIsIiR0aGlzIiwib3B0aW9ucyIsIl9vYmplY3RTcHJlYWQiLCJjb21ib2JveF9kaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMiLCJhdHRhY2hfY29tYm9ib3hfb25fc29ydGluZyIsImRpc2FibGVTZWFyY2giLCJzZWFyY2hfYm94X2luX2RlZmF1bHRfb3JkZXJieSIsImluaXRSYW5nZVNsaWRlciIsIm5vVWlTbGlkZXIiLCIkc2xpZGVyIiwic2xpZGVySWQiLCJkaXNwbGF5VmFsdWVzQXMiLCJzdGVwIiwiJG1pblZhbHVlIiwiJG1heFZhbHVlIiwic2xpZGVyIiwiZ2V0RWxlbWVudEJ5SWQiLCJzYWZlU3RlcCIsImNyZWF0ZSIsInN0YXJ0IiwiY29ubmVjdCIsImNzc1ByZWZpeCIsInJhbmdlIiwiZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciIsIl9taW5WYWx1ZSIsIl9tYXhWYWx1ZSIsImlzRHJhZ2dpbmciLCJnZXQiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwicmVtb3ZlRGF0YSIsImluaXRGaWx0ZXJPcHRpb25Ub29sdGlwIiwidG9vbHRpcFBvc2l0aW9ucyIsInRvb2x0aXBQb3NpdGlvbiIsImlkZW50aWZpZXIiLCJpbnN0YW5jZXMiLCJoYW5kbGVGb3JtU3VibWl0IiwiaW5pdFBvcFN0YXRlIiwicmVsb2FkX29uX2JhY2siLCJmb3VuZF93Y2FwZiIsInJlcGxhY2VTdGF0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJzdGF0ZSIsImhhc093blByb3BlcnR5IiwibnVtYmVyIiwiZGVjaW1hbHMiLCJkZWNfcG9pbnQiLCJ0aG91c2FuZHNfc2VwIiwibiIsImlzRmluaXRlIiwicHJlYyIsIk1hdGgiLCJhYnMiLCJzZXAiLCJkZWMiLCJzIiwidG9GaXhlZEZpeCIsImsiLCJwb3ciLCJyb3VuZCIsIkFycmF5IiwiY2xlYW5VcmwiLCJwYWdlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQU1BLFlBQVksR0FBR0EsWUFBWSxJQUFJO0VBQ3BDLFFBQVEsRUFBRSxFQUFFO0VBQ1osb0JBQW9CLEVBQUUsRUFBRTtFQUN4QixzQkFBc0IsRUFBRSxFQUFFO0VBQzFCLG1DQUFtQyxFQUFFLEVBQUU7RUFDdkMsMEJBQTBCLEVBQUUsRUFBRTtFQUM5Qiw0QkFBNEIsRUFBRSxFQUFFO0VBQ2hDLCtCQUErQixFQUFFLEVBQUU7RUFDbkMsb0NBQW9DLEVBQUUsRUFBRTtFQUN4QywyQkFBMkIsRUFBRSxFQUFFO0VBQy9CLHVDQUF1QyxFQUFFLEVBQUU7RUFDM0Msa0NBQWtDLEVBQUUsRUFBRTtFQUN0QyxtQ0FBbUMsRUFBRSxFQUFFO0VBQ3ZDLDBDQUEwQyxFQUFFLEVBQUU7RUFDOUMscUNBQXFDLEVBQUUsRUFBRTtFQUN6QyxzQ0FBc0MsRUFBRSxFQUFFO0VBQzFDLHFCQUFxQixFQUFFLEVBQUU7RUFDekIsc0JBQXNCLEVBQUUsRUFBRTtF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cU0sUUFBUSxDQUFFdE0sR0FBSSxDQUFDO0FBQ3ZCIiwiZmlsZSI6IndjLWFqYXgtcHJvZHVjdC1maWx0ZXItc2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIG1haW4ganMgZmlsZS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9wdWJsaWMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW5cbiAqL1xuXG5jb25zdCB3Y2FwZl9wYXJhbXMgPSB3Y2FwZl9wYXJhbXMgfHwge1xuXHQnaXNfcnRsJzogJycsXG5cdCdmaWx0ZXJfaW5wdXRfZGVsYXknOiAnJyxcblx0J2tleXdvcmRfZmlsdGVyX2RlbGF5JzogJycsXG5cdCdjb21ib2JveF9kaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMnOiAnJyxcblx0J2NvbWJvYm94X25vX3Jlc3VsdHNfdGV4dCc6ICcnLFxuXHQnY29tYm9ib3hfb3B0aW9uc19ub25lX3RleHQnOiAnJyxcblx0J3NlYXJjaF9ib3hfaW5fZGVmYXVsdF9vcmRlcmJ5JzogJycsXG5cdCdwcmVzZXJ2ZV9oaWVyYXJjaHlfYWNjb3JkaW9uX3N0YXRlJzogJycsXG5cdCdwcmVzZXJ2ZV9zb2Z0X2xpbWl0X3N0YXRlJzogJycsXG5cdCdlbmFibGVfYW5pbWF0aW9uX2Zvcl9maWx0ZXJfYWNjb3JkaW9uJzogJycsXG5cdCdmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCc6ICcnLFxuXHQnZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nJzogJycsXG5cdCdlbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uJzogJycsXG5cdCdoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCc6ICcnLFxuXHQnaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX3NwZWVkJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX2Vhc2luZyc6ICcnLFxuXHQnaXNfbW9iaWxlJzogJycsXG5cdCdyZWxvYWRfb25fYmFjayc6ICcnLFxuXHQnZm91bmRfd2NhcGYnOiAnJyxcblx0J3djYXBmX3Bybyc6ICcnLFxuXHQndXBkYXRlX2RvY3VtZW50X3RpdGxlJzogJycsXG5cdCd1c2VfdGlwcHlqcyc6ICcnLFxuXHQnc2hvcF9sb29wX2NvbnRhaW5lcic6ICcnLFxuXHQnbm90X2ZvdW5kX2NvbnRhaW5lcic6ICcnLFxuXHQncGFnaW5hdGlvbl9jb250YWluZXInOiAnJyxcblx0J29yZGVyYnlfZm9ybSc6ICcnLFxuXHQnb3JkZXJieV9lbGVtZW50JzogJycsXG5cdCdkaXNhYmxlX2FqYXgnOiAnJyxcblx0J2VuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4JzogJycsXG5cdCdzb3J0aW5nX2NvbnRyb2wnOiAnJyxcblx0J2F0dGFjaF9jb21ib2JveF9vbl9zb3J0aW5nJzogJycsXG5cdCdsb2FkaW5nX2FuaW1hdGlvbic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvdyc6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd19mb3InOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfd2hlbic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudCc6ICcnLFxuXHQnc2Nyb2xsX29uJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX29mZnNldCc6ICcnLFxuXHQnZGlzYWJsZV9zY3JvbGxfYW5pbWF0aW9uJzogJycsXG5cdCdtb3JlX3NlbGVjdG9ycyc6ICcnLFxuXHQnY3VzdG9tX3NjcmlwdHMnOiAnJyxcbn07XG5cbiggZnVuY3Rpb24oICQsIHdpbmRvdyApIHtcblxuXHRjb25zdCBfZGVsYXkgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLmZpbHRlcl9pbnB1dF9kZWxheSApO1xuXHRjb25zdCBkZWxheSAgPSBfZGVsYXkgPj0gMCA/IF9kZWxheSA6IDMwMDtcblxuXHRjb25zdCBpc1BybyA9IHdjYXBmX3BhcmFtcy53Y2FwZl9wcm87XG5cblx0Y29uc3QgJGJvZHkgICAgID0gJCggJ2JvZHknICk7XG5cdGNvbnN0ICRkb2N1bWVudCA9ICQoIGRvY3VtZW50ICk7XG5cblx0Y29uc3QgaW5zdGFuY2VJZHMgPSBbXTtcblxuXHRjb25zdCBkZWZhdWx0T3JkZXJCeUVsZW1lbnQgPSB3Y2FwZl9wYXJhbXMub3JkZXJieV9mb3JtICsgJyAnICsgd2NhcGZfcGFyYW1zLm9yZGVyYnlfZWxlbWVudDtcblxuXHQkKCAnLndjYXBmLWZpbHRlcicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCBpZCA9ICQoIHRoaXMgKS5kYXRhKCAnaWQnICk7XG5cblx0XHRpZiAoICEgaWQgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aW5zdGFuY2VJZHMucHVzaCggaWQgKTtcblx0fSApO1xuXG5cdHdpbmRvdy50aXBweUluc3RhbmNlcyA9IFtdO1xuXG5cdHdpbmRvdy5XQ0FQRiA9IHdpbmRvdy5XQ0FQRiB8fCB7fTtcblxuXHR3aW5kb3cuV0NBUEYgPSB7XG5cdFx0aGFuZGxlRmlsdGVyQWNjb3JkaW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHRvZ2dsZUFjY29yZGlvbiA9ICggJGVsICkgPT4ge1xuXHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGFjY29yZGlvbiBpcyBvcGVuZWRcblx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1leHBhbmRlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdC8vIENoYW5nZSBhcmlhLWV4cGFuZGVkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuXHRcdFx0XHQkZWwuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAhIHByZXNzZWQgKTtcblxuXHRcdFx0XHRjb25zdCAkZmlsdGVySW5uZXIgPSAkZWwuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXInICkuY2hpbGRyZW4oICcud2NhcGYtZmlsdGVyLWlubmVyJyApO1xuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9hbmltYXRpb25fZm9yX2ZpbHRlcl9hY2NvcmRpb24gKSB7XG5cdFx0XHRcdFx0JGZpbHRlcklubmVyLnNsaWRlVG9nZ2xlKFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkLFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZ1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JGZpbHRlcklubmVyLnRvZ2dsZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHQkYm9keS5vbiggJ2NsaWNrJywgJy53Y2FwZi1maWx0ZXItYWNjb3JkaW9uLXRyaWdnZXInLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQkYm9keS5vbiggJ2NsaWNrJywgJy53Y2FwZi1maWx0ZXItdGl0bGUuaGFzLWFjY29yZGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkdHJpZ2dlciA9ICQoIHRoaXMgKS5maW5kKCAnLndjYXBmLWZpbHRlci1hY2NvcmRpb24tdHJpZ2dlcicgKTtcblxuXHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICR0cmlnZ2VyICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVIaWVyYXJjaHlUb2dnbGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgdG9nZ2xlQWNjb3JkaW9uID0gKCAkZWwgKSA9PiB7XG5cdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYnV0dG9uIGlzIHByZXNzZWRcblx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0Ly8gQ2hhbmdlIGFyaWEtcHJlc3NlZCB0byB0aGUgb3Bwb3NpdGUgc3RhdGVcblx0XHRcdFx0JGVsLmF0dHIoICdhcmlhLXByZXNzZWQnLCAhIHByZXNzZWQgKTtcblxuXHRcdFx0XHRjb25zdCAkY2hpbGQgPSAkZWwuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICk7XG5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbiApIHtcblx0XHRcdFx0XHQkY2hpbGQuc2xpZGVUb2dnbGUoXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQsXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkY2hpbGQudG9nZ2xlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdCRib2R5XG5cdFx0XHRcdC5vbiggJ2NsaWNrJywgJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0XHRcdH0gKVxuXHRcdFx0XHQub24oICdrZXlkb3duJywgJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdGlmICggZS5rZXkgPT09ICcgJyB8fCBlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJ1NwYWNlYmFyJyApIHtcblx0XHRcdFx0XHRcdC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgYWN0aW9uIHRvIHN0b3Agc2Nyb2xsaW5nIHdoZW4gc3BhY2UgaXMgcHJlc3NlZFxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlU29mdExpbWl0OiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHRvZ2dsZUZpbHRlck9wdGlvbnMgPSAoICRlbCApID0+IHtcblx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBidXR0b24gaXMgcHJlc3NlZFxuXHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLXByZXNzZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHQvLyBDaGFuZ2UgYXJpYS1wcmVzc2VkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuXHRcdFx0XHQkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICEgcHJlc3NlZCApO1xuXG5cdFx0XHRcdGNvbnN0ICRsaXN0V3JhcHBlciA9ICRlbC5jbG9zZXN0KCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKTtcblxuXHRcdFx0XHRpZiAoIHByZXNzZWQgKSB7XG5cdFx0XHRcdFx0JGxpc3RXcmFwcGVyLnJlbW92ZUNsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkbGlzdFdyYXBwZXIuYWRkQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHQkYm9keVxuXHRcdFx0XHQub24oICdjbGljaycsICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dG9nZ2xlRmlsdGVyT3B0aW9ucyggJCggdGhpcyApICk7XG5cdFx0XHRcdH0gKVxuXHRcdFx0XHQub24oICdrZXlkb3duJywgJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRpZiAoIGUua2V5ID09PSAnICcgfHwgZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICdTcGFjZWJhcicgKSB7XG5cdFx0XHRcdFx0XHQvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvbiB0byBzdG9wIHNjcm9sbGluZyB3aGVuIHNwYWNlIGlzIHByZXNzZWRcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdFx0dG9nZ2xlRmlsdGVyT3B0aW9ucyggJCggdGhpcyApICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVTZWFyY2hGaWx0ZXJPcHRpb25zOiBmdW5jdGlvbigpIHtcblx0XHRcdCRib2R5Lm9uKCAnaW5wdXQnLCAnLndjYXBmLXNlYXJjaC1ib3ggaW5wdXRbdHlwZT1cInRleHRcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRoYXQgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgJGlubmVyICA9ICR0aGF0LmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyLWlubmVyJyApO1xuXHRcdFx0XHRjb25zdCAkZmlsdGVyID0gJGlubmVyLmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyJyApO1xuXG5cdFx0XHRcdGNvbnN0IHNvZnRMaW1pdEVuYWJsZWQgPSAkZmlsdGVyLmhhc0NsYXNzKCAnaGFzLXNvZnQtbGltaXQnICk7XG5cdFx0XHRcdGNvbnN0IHNvZnRMaW1pdFRvZ2dsZSAgPSAkZmlsdGVyLmZpbmQoICcud2NhcGYtc29mdC1saW1pdC13cmFwcGVyJyApO1xuXHRcdFx0XHRjb25zdCBub1Jlc3VsdHMgICAgICAgID0gJGZpbHRlci5maW5kKCAnLndjYXBmLW5vLXJlc3VsdHMtdGV4dCcgKTtcblx0XHRcdFx0Y29uc3QgdmlzaWJsZU9wdGlvbnMgICA9IHBhcnNlSW50KCAkZmlsdGVyLmF0dHIoICdkYXRhLXZpc2libGUtb3B0aW9ucycgKSApO1xuXG5cdFx0XHRcdGNvbnN0IGtleXdvcmQgPSAkdGhhdC52YWwoKTtcblxuXHRcdFx0XHRpZiAoICEga2V5d29yZC5sZW5ndGggKSB7XG5cdFx0XHRcdFx0bGV0IGluZGV4ID0gMDtcblx0XHRcdFx0XHQkZmlsdGVyLnJlbW92ZUNsYXNzKCAnc2VhcmNoLWFjdGl2ZScgKTtcblxuXHRcdFx0XHRcdCQuZWFjaCggJGlubmVyLmZpbmQoICcud2NhcGYtZmlsdGVyLW9wdGlvbnMgPiBsaScgKSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRpbmRleCsrO1xuXG5cdFx0XHRcdFx0XHRjb25zdCAkZmlsdGVySXRlbSA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLnJlbW92ZUNsYXNzKCAna2V5d29yZC1tYXRjaGVkJyApO1xuXG5cdFx0XHRcdFx0XHRpZiAoIHNvZnRMaW1pdEVuYWJsZWQgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggaW5kZXggPiB2aXNpYmxlT3B0aW9ucyApIHtcblx0XHRcdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5hZGRDbGFzcyggJ3djYXBmLWZpbHRlci1vcHRpb24taGlkZGVuJyApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLnJlbW92ZUNsYXNzKCAnd2NhcGYtZmlsdGVyLW9wdGlvbi1oaWRkZW4nICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0XHRpZiAoIHNvZnRMaW1pdEVuYWJsZWQgKSB7XG5cdFx0XHRcdFx0XHRzb2Z0TGltaXRUb2dnbGUucmVtb3ZlQXR0ciggJ3N0eWxlJyApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdG5vUmVzdWx0cy5jaGlsZHJlbiggJ3NwYW4nICkudGV4dCggJycgKTtcblx0XHRcdFx0XHRub1Jlc3VsdHMuaGlkZSgpO1xuXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IGluZGV4ID0gMDtcblx0XHRcdFx0JGZpbHRlci5hZGRDbGFzcyggJ3NlYXJjaC1hY3RpdmUnICk7XG5cblx0XHRcdFx0JC5lYWNoKCAkaW5uZXIuZmluZCggJy53Y2FwZi1maWx0ZXItb3B0aW9ucyA+IGxpJyApLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCAkZmlsdGVySXRlbSA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRjb25zdCBsYWJlbCAgICAgICA9ICRmaWx0ZXJJdGVtLmZpbmQoICcud2NhcGYtZmlsdGVyLWl0ZW0tbGFiZWwnICkuZGF0YSggJ2xhYmVsJyApO1xuXG5cdFx0XHRcdFx0aWYgKCBsYWJlbC50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoIGtleXdvcmQudG9Mb3dlckNhc2UoKSApICkge1xuXHRcdFx0XHRcdFx0aW5kZXgrKztcblxuXHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0uYWRkQ2xhc3MoICdrZXl3b3JkLW1hdGNoZWQnICk7XG5cblx0XHRcdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCBpbmRleCA+IHZpc2libGVPcHRpb25zICkge1xuXHRcdFx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLmFkZENsYXNzKCAnd2NhcGYtZmlsdGVyLW9wdGlvbi1oaWRkZW4nICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5yZW1vdmVDbGFzcyggJ2tleXdvcmQtbWF0Y2hlZCcgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRpZiAoIHNvZnRMaW1pdEVuYWJsZWQgKSB7XG5cdFx0XHRcdFx0aWYgKCBpbmRleCA8PSB2aXNpYmxlT3B0aW9ucyApIHtcblx0XHRcdFx0XHRcdHNvZnRMaW1pdFRvZ2dsZS5oaWRlKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHNvZnRMaW1pdFRvZ2dsZS5zaG93KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCAwID09PSBpbmRleCApIHtcblx0XHRcdFx0XHRub1Jlc3VsdHMuY2hpbGRyZW4oICdzcGFuJyApLnRleHQoIGtleXdvcmQgKTtcblx0XHRcdFx0XHRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5jaGlsZHJlbiggJ3NwYW4nICkudGV4dCggJycgKTtcblx0XHRcdFx0XHRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdCRib2R5Lm9uKCAnY2xpY2snLCAnLndjYXBmLXNlYXJjaC1ib3ggLndjYXBmLWNsZWFyLXN0YXRlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0aGF0ICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0ICRzZWFyY2hCb3ggPSAkdGhhdC5jbG9zZXN0KCAnLndjYXBmLXNlYXJjaC1ib3gnICk7XG5cdFx0XHRcdGNvbnN0ICRpbnB1dCAgICAgPSAkc2VhcmNoQm94LmZpbmQoICdpbnB1dFt0eXBlPVwidGV4dFwiXScgKTtcblx0XHRcdFx0Y29uc3QgJGZpbHRlciAgICA9ICRzZWFyY2hCb3guY2xvc2VzdCggJy53Y2FwZi1maWx0ZXInICk7XG5cblx0XHRcdFx0JGlucHV0LnZhbCggJycgKTtcblx0XHRcdFx0JGlucHV0LnRyaWdnZXIoICdpbnB1dCcgKTtcblxuXHRcdFx0XHRpZiAoICRmaWx0ZXIuaGFzQ2xhc3MoICd3Y2FwZi1maWx0ZXIta2V5d29yZCcgKSApIHtcblx0XHRcdFx0XHQkaW5wdXQudHJpZ2dlciggJ2NoYW5nZScgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsICcud2NhcGYtZmlsdGVyLWtleXdvcmQgaW5wdXRbdHlwZT1cInRleHRcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRoYXQgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0ICR3cmFwcGVyID0gJHRoYXQuY2xvc2VzdCggJy53Y2FwZi1rZXl3b3JkLWZpbHRlci13cmFwcGVyJyApO1xuXHRcdFx0XHRjb25zdCBrZXl3b3JkICA9ICR0aGF0LnZhbCgpO1xuXG5cdFx0XHRcdGNvbnN0IGZpbHRlclVSTCAgICAgID0gJHdyYXBwZXIuZGF0YSggJ2ZpbHRlci11cmwnICk7XG5cdFx0XHRcdGNvbnN0IGNsZWFyRmlsdGVyVVJMID0gJHdyYXBwZXIuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICk7XG5cblx0XHRcdFx0Y29uc3QgdXJsID0ga2V5d29yZC5sZW5ndGggPyBmaWx0ZXJVUkwucmVwbGFjZSggJyVzJywga2V5d29yZCApIDogY2xlYXJGaWx0ZXJVUkw7XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdCRib2R5Lm9uKCAna2V5ZG93bicsICcud2NhcGYtZmlsdGVyLWtleXdvcmQgaW5wdXRbdHlwZT1cInRleHRcIl0nLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0aWYgKCAnRW50ZXInID09PSBlLmtleSApIHtcblx0XHRcdFx0XHQkKCB0aGlzICkudHJpZ2dlciggJ2NoYW5nZScgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0dXBkYXRlUHJvZHVjdHNDb3VudFJlc3VsdDogZnVuY3Rpb24oICRyZXNwb25zZSApIHtcblx0XHRcdGNvbnN0ICRjb250YWluZXIgPSAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3IgICA9ICcud29vY29tbWVyY2UtcmVzdWx0LWNvdW50Jztcblx0XHRcdGNvbnN0IG5ld0NvdW50ICAgPSAkcmVzcG9uc2UuZmluZCggc2VsZWN0b3IgKS5odG1sKCk7XG5cblx0XHRcdCRib2R5LmZpbmQoIHNlbGVjdG9yICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRlbCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRpZiAoICEgJGNvbnRhaW5lci5oYXMoICRlbCApLmxlbmd0aCApIHtcblx0XHRcdFx0XHQkZWwuaHRtbCggbmV3Q291bnQgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0c2Nyb2xsVG86IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAnbm9uZScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHNjcm9sbEZvciA9IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X2Zvcjtcblx0XHRcdGNvbnN0IGlzTW9iaWxlICA9IHdjYXBmX3BhcmFtcy5pc19tb2JpbGU7XG5cdFx0XHRsZXQgcHJvY2VlZCAgICAgPSBmYWxzZTtcblxuXHRcdFx0aWYgKCAnbW9iaWxlJyA9PT0gc2Nyb2xsRm9yICYmIGlzTW9iaWxlICkge1xuXHRcdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSBpZiAoICdkZXNrdG9wJyA9PT0gc2Nyb2xsRm9yICYmICEgaXNNb2JpbGUgKSB7XG5cdFx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmICggJ2JvdGgnID09PSBzY3JvbGxGb3IgKSB7XG5cdFx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgcHJvY2VlZCApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgYWRqdXN0aW5nT2Zmc2V0ID0gMCwgb2Zmc2V0ID0gMDtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKSB7XG5cdFx0XHRcdGFkanVzdGluZ09mZnNldCA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGNvbnRhaW5lcjtcblxuXHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXI7XG5cdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXI7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggJ2N1c3RvbScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93ICkge1xuXHRcdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudDtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIGNvbnRhaW5lciApO1xuXG5cdFx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRvZmZzZXQgPSAkY29udGFpbmVyLm9mZnNldCgpLnRvcCAtIGFkanVzdGluZ09mZnNldDtcblxuXHRcdFx0XHRpZiAoIG9mZnNldCA8IDAgKSB7XG5cdFx0XHRcdFx0b2Zmc2V0ID0gMDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCQoICdodG1sLCBib2R5JyApLnN0b3AoKS5hbmltYXRlKFxuXHRcdFx0XHRcdHsgc2Nyb2xsVG9wOiBvZmZzZXQgfSxcblx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9zcGVlZCxcblx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9lYXNpbmdcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8vIFRoaW5ncyBhcmUgZG9uZSBiZWZvcmUgZmV0Y2hpbmcgdGhlIHByb2R1Y3RzIGxpa2Ugc2hvd2luZyB0aGUgbG9hZGluZyBpbmRpY2F0b3IuXG5cdFx0YmVmb3JlRmV0Y2hpbmdQcm9kdWN0czogZnVuY3Rpb24oIHRyaWdnZXJlZEJ5ICkge1xuXHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1sb2FkZXInICkuYWRkQ2xhc3MoICdpcy1hY3RpdmUnICk7XG5cblx0XHRcdGlmICggISBpc1BybyAmJiAnaW1tZWRpYXRlbHknID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd193aGVuICkge1xuXHRcdFx0XHRXQ0FQRi5zY3JvbGxUbygpO1xuXHRcdFx0fVxuXG5cdFx0XHQkZG9jdW1lbnQudHJpZ2dlciggJ3djYXBmX2JlZm9yZV9mZXRjaGluZ19wcm9kdWN0cycsIFsgdHJpZ2dlcmVkQnkgXSApO1xuXHRcdH0sXG5cdFx0ZGVzdHJveVRpcHB5SW5zdGFuY2VzOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnVzZV90aXBweWpzICkge1xuXHRcdFx0XHQvLyBAc291cmNlIGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9taWtzL3RpcHB5anMvaXNzdWVzLzQ3M1xuXHRcdFx0XHR0aXBweUluc3RhbmNlcy5mb3JFYWNoKCBpbnN0YW5jZSA9PiB7XG5cdFx0XHRcdFx0aW5zdGFuY2UuZGVzdHJveSgpO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHRcdHRpcHB5SW5zdGFuY2VzLmxlbmd0aCA9IDA7IC8vIGNsZWFyIGl0XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvLyBUaGluZ3MgYXJlIGRvbmUgYmVmb3JlIHVwZGF0aW5nIHRoZSBwcm9kdWN0cyBsaWtlIGhpZGluZyB0aGUgbG9hZGluZyBpbmRpY2F0b3IuXG5cdFx0YmVmb3JlVXBkYXRpbmdQcm9kdWN0czogZnVuY3Rpb24oICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgKSB7XG5cdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLWxvYWRlcicgKS5yZW1vdmVDbGFzcyggJ2lzLWFjdGl2ZScgKTtcblxuXHRcdFx0Ly8gTWF5YmUgZ29vZCBmb3IgcGVyZm9ybWFuY2UuXG5cdFx0XHRXQ0FQRi5kZXN0cm95VGlwcHlJbnN0YW5jZXMoKTtcblxuXHRcdFx0JGRvY3VtZW50LnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfdXBkYXRpbmdfcHJvZHVjdHMnLCBbICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgXSApO1xuXHRcdH0sXG5cdFx0YWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzOiBmdW5jdGlvbiggJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSApIHtcblx0XHRcdFdDQVBGLnVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQoICRyZXNwb25zZSApO1xuXG5cdFx0XHQvLyBSZWluaXRpYWxpemUgd2NhcGYuXG5cdFx0XHRXQ0FQRi5pbml0KCk7XG5cblx0XHRcdGlmICggISBpc1BybyAmJiAnYWZ0ZXInID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd193aGVuICkge1xuXHRcdFx0XHRXQ0FQRi5zY3JvbGxUbygpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUcmlnZ2VyIGV2ZW50cy5cblx0XHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggJ3JlYWR5JyApO1xuXHRcdFx0JCggd2luZG93ICkudHJpZ2dlciggJ3Njcm9sbCcgKTtcblx0XHRcdCQoIHdpbmRvdyApLnRyaWdnZXIoICdyZXNpemUnICk7XG5cblx0XHRcdC8vIEEzIExhenkgTG9hZCBzdXBwb3J0LlxuXHRcdFx0JCggd2luZG93ICkudHJpZ2dlciggJ2xhenlzaG93JyApO1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5jdXN0b21fc2NyaXB0cyApIHtcblx0XHRcdFx0ZXZhbCggd2NhcGZfcGFyYW1zLmN1c3RvbV9zY3JpcHRzICk7XG5cdFx0XHR9XG5cblx0XHRcdCRkb2N1bWVudC50cmlnZ2VyKCAnd2NhcGZfYWZ0ZXJfdXBkYXRpbmdfcHJvZHVjdHMnLCBbICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgXSApO1xuXHRcdH0sXG5cdFx0ZmlsdGVyUHJvZHVjdHM6IGZ1bmN0aW9uKCB0cmlnZ2VyZWRCeSA9ICdmaWx0ZXInICkge1xuXHRcdFx0V0NBUEYuYmVmb3JlRmV0Y2hpbmdQcm9kdWN0cyggdHJpZ2dlcmVkQnkgKTtcblxuXHRcdFx0JC5hamF4KCB7XG5cdFx0XHRcdHVybDogd2luZG93LmxvY2F0aW9uLmhyZWYsXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdFx0XHRjb25zdCAkcmVzcG9uc2UgPSAkKCByZXNwb25zZSApO1xuXG5cdFx0XHRcdFx0V0NBUEYuYmVmb3JlVXBkYXRpbmdQcm9kdWN0cyggJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSApO1xuXG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogVXBkYXRlIGRvY3VtZW50IHRpdGxlLlxuXHRcdFx0XHRcdCAqXG5cdFx0XHRcdFx0ICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNzU5OTU2MlxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnVwZGF0ZV9kb2N1bWVudF90aXRsZSApIHtcblx0XHRcdFx0XHRcdGRvY3VtZW50LnRpdGxlID0gJHJlc3BvbnNlLmZpbHRlciggJ3RpdGxlJyApLnRleHQoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBVcGRhdGUgdGhlIGluc3RhbmNlcy5cblx0XHRcdFx0XHRmb3IgKCBjb25zdCBpZCBvZiBpbnN0YW5jZUlkcyApIHtcblx0XHRcdFx0XHRcdGNvbnN0IGluc3RhbmNlSWQgPSAnW2RhdGEtaWQ9XCInICsgaWQgKyAnXCJdJztcblx0XHRcdFx0XHRcdGNvbnN0ICRpbnN0YW5jZSAgPSAkKCBpbnN0YW5jZUlkICk7XG5cdFx0XHRcdFx0XHRjb25zdCAkaW5uZXIgICAgID0gJGluc3RhbmNlLmZpbmQoICcud2NhcGYtZmlsdGVyLWlubmVyJyApO1xuXHRcdFx0XHRcdFx0Y29uc3QgX2luc3RhbmNlICA9ICRyZXNwb25zZS5maW5kKCBpbnN0YW5jZUlkICk7XG5cblx0XHRcdFx0XHRcdC8vIFByZXNlcnZlIGhpZXJhcmNoeSBhY2NvcmRpb24gc3RhdGUuXG5cdFx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5wcmVzZXJ2ZV9oaWVyYXJjaHlfYWNjb3JkaW9uX3N0YXRlICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRpbnN0YW5jZS5oYXNDbGFzcyggJ2hhcy1oaWVyYXJjaHktYWNjb3JkaW9uJyApICkge1xuXHRcdFx0XHRcdFx0XHRcdCRpbnN0YW5jZS5maW5kKCAnLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgJGVsID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgaWQgID0gJGVsLmRhdGEoICdpZCcgKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgdG9nZ2xlU2VsZWN0b3IgPSBgLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlW2RhdGEtaWQ9XCIkeyBpZCB9XCJdYDtcblxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBhY2NvcmRpb24gaXMgb3BlbmVkXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLXByZXNzZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCBwcmVzc2VkICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5hdHRyKCAnYXJpYS1wcmVzc2VkJywgJ3RydWUnICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCB0b2dnbGVTZWxlY3RvciApLmNsb3Nlc3QoICdsaScgKS5jaGlsZHJlbiggJ3VsJyApLnNob3coKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCB0b2dnbGVTZWxlY3RvciApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAnZmFsc2UnICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCB0b2dnbGVTZWxlY3RvciApLmNsb3Nlc3QoICdsaScgKS5jaGlsZHJlbiggJ3VsJyApLmhpZGUoKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gUHJlc2VydmUgc29mdCBsaW1pdCBzdGF0ZS5cblx0XHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnByZXNlcnZlX3NvZnRfbGltaXRfc3RhdGUgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJGluc3RhbmNlLmhhc0NsYXNzKCAnaGFzLXNvZnQtbGltaXQnICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgJGxpc3RXcmFwcGVyID0gJGluc3RhbmNlLmZpbmQoICcud2NhcGYtbGlzdC13cmFwcGVyJyApO1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCAkbGlzdFdyYXBwZXIuaGFzQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtbGlzdC13cmFwcGVyJyApLmFkZENsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLXNvZnQtbGltaXQtdHJpZ2dlcicgKS5hdHRyKCAnYXJpYS1wcmVzc2VkJywgJ3RydWUnICk7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKS5yZW1vdmVDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICdmYWxzZScgKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Y29uc3QgX2h0bWwgPSBfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1maWx0ZXItaW5uZXInICkuaHRtbCgpO1xuXG5cdFx0XHRcdFx0XHQvLyBGaW5hbGx5IHVwZGF0ZSB0aGUgaW5zdGFuY2UuXG5cdFx0XHRcdFx0XHQkaW5uZXIuaHRtbCggX2h0bWwgKTtcblxuXHRcdFx0XHRcdFx0Ly8gUmVtb3ZlIHNlYXJjaC1hY3RpdmUgZnJvbSBhbnkgc2VhcmNoIGJveCB3aG9zZSBpbnB1dCBpcyBub3cgZW1wdHkuXG5cdFx0XHRcdFx0XHQkaW5zdGFuY2UuZmluZCggJy53Y2FwZi1zZWFyY2gtYm94LndpdGgtY3Jvc3MgaW5wdXRbdHlwZT1cInRleHRcIl0nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggISAkKCB0aGlzICkudmFsKCkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyJyApLnJlbW92ZUNsYXNzKCAnc2VhcmNoLWFjdGl2ZScgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdFx0XHQkaW5zdGFuY2UudHJpZ2dlciggJ3djYXBmLWZpbHRlci11cGRhdGVkJywgWyBfaW5zdGFuY2UgXSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgYWN0aXZlIGZpbHRlcnMgYW5kIHJlc2V0IGZpbHRlcnMuXG5cdFx0XHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1hY3RpdmUtZmlsdGVycywgLndjYXBmLXJlc2V0LWZpbHRlcnMnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRjb25zdCAkdGhhdCAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdFx0Y29uc3QgaW5zdGFuY2VJZCA9ICdbZGF0YS1pZD1cIicgKyAkdGhhdC5kYXRhKCAnaWQnICkgKyAnXCJdJztcblxuXHRcdFx0XHRcdFx0JHRoYXQuaHRtbCggJHJlc3BvbnNlLmZpbmQoIGluc3RhbmNlSWQgKS5odG1sKCkgKTtcblx0XHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0XHQvLyBSZXBsYWNlIG9sZCBzaG9wIGxvb3Agd2l0aCBuZXcgb25lLlxuXHRcdFx0XHRcdGNvbnN0ICRzaG9wTG9vcENvbnRhaW5lciA9ICRyZXNwb25zZS5maW5kKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0XHRcdGNvbnN0ICRub3RGb3VuZENvbnRhaW5lciA9ICRyZXNwb25zZS5maW5kKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApO1xuXG5cdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciA9PT0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0V0NBUEYuYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdHJlcXVlc3RGaWx0ZXI6IGZ1bmN0aW9uKCB1cmwsIHRyaWdnZXJlZEJ5ID0gJ2ZpbHRlcicgKSB7XG5cdFx0XHRpZiAoICEgdXJsICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmRpc2FibGVfYWpheCApIHtcblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmw7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSggeyB3Y2FwZjogdHJ1ZSB9LCAnJywgdXJsICk7XG5cblx0XHRcdFx0V0NBUEYuZmlsdGVyUHJvZHVjdHMoIHRyaWdnZXJlZEJ5ICk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRoYW5kbGVOdW1iZXJJbnB1dEZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgcmFuZ2VOdW1iZXJTZWxlY3RvcnMgPSAnLndjYXBmLXJhbmdlLW51bWJlciAubWluLXZhbHVlLCAud2NhcGYtcmFuZ2UtbnVtYmVyIC5tYXgtdmFsdWUnO1xuXG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsIHJhbmdlTnVtYmVyU2VsZWN0b3JzLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Y29uc3QgJHJhbmdlTnVtYmVyICAgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXJhbmdlLW51bWJlcicgKTtcblx0XHRcdFx0Y29uc3QgZm9ybWF0TnVtYmVycyAgICAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZm9ybWF0LW51bWJlcnMnICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgb2xkTWluVmFsdWUgICAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IG9sZE1heFZhbHVlICAgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsUGxhY2VzICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRcdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1kZWNpbWFsLXNlcGFyYXRvcicgKTtcblxuXHRcdFx0XHRjb25zdCBnZXRWYWx1ZSA9ICggZmxvYXRWYWx1ZSApID0+IHtcblx0XHRcdFx0XHRpZiAoIGZvcm1hdE51bWJlcnMgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVtYmVyRm9ybWF0KCBmbG9hdFZhbHVlLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBmbG9hdFZhbHVlO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGxldCBtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoKSApO1xuXHRcdFx0XHRsZXQgbWF4VmFsdWUgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCkgKTtcblxuXHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0XHRpZiAoIGlzTmFOKCBtaW5WYWx1ZSApICkge1xuXHRcdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNaW5WYWx1ZTtcblxuXHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRcdGlmICggaXNOYU4oIG1heFZhbHVlICkgKSB7XG5cdFx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgcmFuZ2VNaW5WYWx1ZS5cblx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA8IHJhbmdlTWluVmFsdWUgKSB7XG5cdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRcdGlmICggbWluVmFsdWUgPiByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0XHRpZiAoIG1heFZhbHVlID4gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgbWluVmFsdWUuXG5cdFx0XHRcdGlmICggbWluVmFsdWUgPiBtYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRtYXhWYWx1ZSA9IG1pblZhbHVlO1xuXG5cdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIElmIHZhbHVlIGlzIG5vdCBjaGFuZ2VkIHRoZW4gZG9uJ3QgcHJvY2VlZC5cblx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gb2xkTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IG9sZE1heFZhbHVlICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0Ly8gUmVtb3ZlIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkcmFuZ2VOdW1iZXIuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBBZGQgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdGNvbnN0IHVybCA9ICRyYW5nZU51bWJlci5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclMXMnLCBtaW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdCRib2R5Lm9uKCAna2V5ZG93bicsIHJhbmdlTnVtYmVyU2VsZWN0b3JzLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0aWYgKCAnRW50ZXInID09PSBlLmtleSApIHtcblx0XHRcdFx0XHQkKCB0aGlzICkudHJpZ2dlciggJ2NoYW5nZScgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlTGlzdEZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgbmF0aXZlSW5wdXRzID0gJy5saXN0LXR5cGUtbmF0aXZlIFt0eXBlPVwiY2hlY2tib3hcIl0sJyArXG5cdFx0XHRcdCcubGlzdC10eXBlLW5hdGl2ZSBbdHlwZT1cInJhZGlvXCJdLCcgK1xuXHRcdFx0XHQnLmxpc3QtdHlwZS1jdXN0b20tY2hlY2tib3ggW3R5cGU9XCJjaGVja2JveFwiXSc7XG5cblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgbmF0aXZlSW5wdXRzLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyLWl0ZW0nICkudG9nZ2xlQ2xhc3MoICdpdGVtLWFjdGl2ZScgKTtcblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkKCB0aGlzICkuZGF0YSggJ3VybCcgKSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRjb25zdCBjdXN0b21SYWRpb1NlbGVjdG9yID0gJy5saXN0LXR5cGUtY3VzdG9tLXJhZGlvJztcblxuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCBjdXN0b21SYWRpb1NlbGVjdG9yICsgJyBbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZpbHRlci1pdGVtJyApLnRvZ2dsZUNsYXNzKCAnaXRlbS1hY3RpdmUnICk7XG5cblx0XHRcdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzU4Mzk5MjRcblx0XHRcdFx0JCggdGhpcyApXG5cdFx0XHRcdFx0LmNsb3Nlc3QoIGN1c3RvbVJhZGlvU2VsZWN0b3IgKVxuXHRcdFx0XHRcdC5maW5kKCAnLndjYXBmLWZpbHRlci1pdGVtLml0ZW0tYWN0aXZlIFt0eXBlPVwiY2hlY2tib3hcIl0nIClcblx0XHRcdFx0XHQubm90KCB0aGlzIClcblx0XHRcdFx0XHQucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApXG5cdFx0XHRcdFx0LmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyLWl0ZW0nIClcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoICdpdGVtLWFjdGl2ZScgKTtcblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkKCB0aGlzICkuZGF0YSggJ3VybCcgKSApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlRHJvcGRvd25GaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgJy53Y2FwZi1kcm9wZG93bi13cmFwcGVyIHNlbGVjdCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkc2VsZWN0ICAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgdmFsdWVzICAgICAgICAgPSAkc2VsZWN0LnZhbCgpO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJVUkwgICAgICA9ICRzZWxlY3QuZGF0YSggJ3VybCcgKTtcblx0XHRcdFx0Y29uc3QgY2xlYXJGaWx0ZXJVUkwgPSAkc2VsZWN0LmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApO1xuXHRcdFx0XHRsZXQgdXJsO1xuXG5cdFx0XHRcdGlmICggdmFsdWVzLmxlbmd0aCApIHtcblx0XHRcdFx0XHR1cmwgPSBmaWx0ZXJVUkwucmVwbGFjZSggJyVzJywgdmFsdWVzLnRvU3RyaW5nKCkgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR1cmwgPSBjbGVhckZpbHRlclVSTDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlUGFnaW5hdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfcGFnaW5hdGlvbl92aWFfYWpheCAmJiB3Y2FwZl9wYXJhbXMucGFnaW5hdGlvbl9jb250YWluZXIgKSB7XG5cdFx0XHRcdGNvbnN0ICRjb250YWluZXIgPSAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0XHRjb25zdCBfc2VsZWN0b3JzID0gd2NhcGZfcGFyYW1zLnBhZ2luYXRpb25fY29udGFpbmVyLnNwbGl0KCAnLCcgKTtcblx0XHRcdFx0Y29uc3Qgc2VsZWN0b3JzICA9IFtdO1xuXG5cdFx0XHRcdF9zZWxlY3RvcnMuZm9yRWFjaCggc2VsZWN0b3IgPT4ge1xuXHRcdFx0XHRcdGlmICggc2VsZWN0b3IgKSB7XG5cdFx0XHRcdFx0XHRzZWxlY3RvcnMucHVzaCggc2VsZWN0b3IgKyAnIGEnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0Y29uc3Qgc2VsZWN0b3IgPSBzZWxlY3RvcnMuam9pbiggJywnICk7XG5cblx0XHRcdFx0aWYgKCAkY29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHQkY29udGFpbmVyLm9uKCAnY2xpY2snLCBzZWxlY3RvciwgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IGhyZWYgPSAkKCB0aGlzICkuYXR0ciggJ2hyZWYnICk7XG5cblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIGhyZWYsICdwYWdpbmF0ZScgKTtcblx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdGhhbmRsZURlZmF1bHRPcmRlcmJ5OiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMuc29ydGluZ19jb250cm9sICkge1xuXHRcdFx0XHQvLyBTdWJtaXQgdGhlIG9yZGVyYnkgZm9ybSB3aGVuIHZhbHVlIGlzIGNoYW5nZWQuXG5cdFx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgZGVmYXVsdE9yZGVyQnlFbGVtZW50LCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKCB0aGlzICkuY2xvc2VzdCggJ2Zvcm0nICkudHJpZ2dlciggJ3N1Ym1pdCcgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUHJldmVudCB0aGUgYXV0byBzdWJtaXNzaW9uIG9mIHRoZSBvcmRlcmJ5IGZvcm0uXG5cdFx0XHQkYm9keS5vbiggJ3N1Ym1pdCcsIHdjYXBmX3BhcmFtcy5vcmRlcmJ5X2Zvcm0sIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgdmlhIGFqYXggd2hlbiB0aGUgb3JkZXJieSB2YWx1ZSBpcyBjaGFuZ2VkLlxuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCBkZWZhdWx0T3JkZXJCeUVsZW1lbnQsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBvcmRlciA9ICQoIHRoaXMgKS52YWwoKTtcblxuXHRcdFx0XHRjb25zdCB1cmwgPSBuZXcgVVJMKCB3aW5kb3cubG9jYXRpb24gKTtcblx0XHRcdFx0dXJsLnNlYXJjaFBhcmFtcy5zZXQoICdvcmRlcmJ5Jywgb3JkZXIgKTtcblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCBnZXRPcmRlckJ5VXJsKCB1cmwuaHJlZiApICk7XG5cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlQ2xlYXJGaWx0ZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtZmlsdGVyLWNsZWFyLWJ0bicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5hdHRyKCAnZGF0YS1jbGVhci1maWx0ZXItdXJsJyApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVGaWx0ZXJUb29sdGlwOiBmdW5jdGlvbigpIHtcblx0XHRcdC8vIG5vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRSZWZlcmVuY2Vcblx0XHRcdGlmICggJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHRpcHB5ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMudXNlX3RpcHB5anMgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZFJlZmVyZW5jZVxuXHRcdFx0dGlwcHkoICcud2NhcGYtZmlsdGVyLXRvb2x0aXAnLCB7XG5cdFx0XHRcdHBsYWNlbWVudDogJ3RvcCcsXG5cdFx0XHRcdGNvbnRlbnQoIHJlZmVyZW5jZSApIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSggJ2RhdGEtY29udGVudCcgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0YWxsb3dIVE1MOiB0cnVlLFxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aW5pdENvbWJvYm94OiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggISBqUXVlcnkoKS5jaG9zZW5XQ0FQRiApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB0ZW1wbGF0ZVJlc3VsdCA9ICggdGV4dCwgZGF0YSApID0+IHtcblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQnPHNwYW4+JyArIHRleHQgKyAnPC9zcGFuPicsXG5cdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwid2NhcGYtY291bnRcIj4nICsgZGF0YVsgJ2NvdW50TWFya3VwJyBdICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRdLmpvaW4oICcnICk7XG5cdFx0XHR9O1xuXG5cdFx0XHRjb25zdCB0ZW1wbGF0ZVNlbGVjdGlvbiA9ICggdGV4dCwgZGF0YSApID0+IHtcblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJ3Y2FwZi1jb3VudC0nICsgZGF0YS5jb3VudCArICdcIj4nICsgdGV4dCArICc8L3NwYW4+Jyxcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJ3Y2FwZi1jb3VudCB3Y2FwZi1jb3VudC0nICsgZGF0YS5jb3VudCArICdcIj4nICsgZGF0YVsgJ2NvdW50TWFya3VwJyBdICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRdLmpvaW4oICcnICk7XG5cdFx0XHR9O1xuXG5cdFx0XHRjb25zdCBkZWZhdWx0cyA9IHtcblx0XHRcdFx0aW5oZXJpdF9zZWxlY3RfY2xhc3NlczogdHJ1ZSxcblx0XHRcdFx0aW5oZXJpdF9vcHRpb25fY2xhc3NlczogdHJ1ZSxcblx0XHRcdFx0bm9fcmVzdWx0c190ZXh0OiB3Y2FwZl9wYXJhbXMuY29tYm9ib3hfbm9fcmVzdWx0c190ZXh0LFxuXHRcdFx0XHRvcHRpb25zX25vbmVfdGV4dDogd2NhcGZfcGFyYW1zLmNvbWJvYm94X29wdGlvbnNfbm9uZV90ZXh0LFxuXHRcdFx0XHRzZWFyY2hfY29udGFpbnM6IHRydWUsIC8vIE1hdGNoIGZyb20gYW55d2hlcmUgaW4gc3RyaW5nLlxuXHRcdFx0XHRzZWFyY2hfaW5fdmFsdWVzOiB0cnVlLCAvLyBTZWFyY2ggaW4gdmFsdWVzIGFsc28uXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5pc19ydGwgKSB7XG5cdFx0XHRcdGRlZmF1bHRzWyAncnRsJyBdID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1jaG9zZW4nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0aGlzICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7IC4uLmRlZmF1bHRzIH07XG5cblx0XHRcdFx0Ly8gSWYgaGllcmFyY2h5IGVuYWJsZWQgdGhlbiB3ZSBzaG93IHRoZSBzZWxlY3RlZCBvcHRpb25zLlxuXHRcdFx0XHRpZiAoICR0aGlzLmhhc0NsYXNzKCAnaGFzLWhpZXJhcmNoeScgKSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJyBdID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJyBdID0gd2NhcGZfcGFyYW1zLmNvbWJvYm94X2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEVuYWJsZSB0ZW1wbGF0aW5nIHdoZW4gc2hvd2luZyBjb3VudC5cblx0XHRcdFx0aWYgKCAkdGhpcy5oYXNDbGFzcyggJ3dpdGgtY291bnQnICkgKSB7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ3RlbXBsYXRlUmVzdWx0JyBdICAgID0gdGVtcGxhdGVSZXN1bHQ7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ3RlbXBsYXRlU2VsZWN0aW9uJyBdID0gdGVtcGxhdGVTZWxlY3Rpb247XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBEaXNhYmxlIHNlYXJjaCBib3guXG5cdFx0XHRcdGlmICggISAkdGhpcy5kYXRhKCAnZW5hYmxlLXNlYXJjaCcgKSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnZGlzYWJsZV9zZWFyY2gnIF0gPSB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JHRoaXMuY2hvc2VuV0NBUEYoIG9wdGlvbnMgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gQXR0YWNoIGNob3NlbiBmb3IgZGVmYXVsdCBvcmRlcmJ5LlxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuYXR0YWNoX2NvbWJvYm94X29uX3NvcnRpbmcgKSB7XG5cdFx0XHRcdGxldCBkaXNhYmxlU2VhcmNoID0gdHJ1ZTtcblxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zZWFyY2hfYm94X2luX2RlZmF1bHRfb3JkZXJieSApIHtcblx0XHRcdFx0XHRkaXNhYmxlU2VhcmNoID0gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0cyB9O1xuXG5cdFx0XHRcdG9wdGlvbnNbICdkaXNhYmxlX3NlYXJjaCcgXSA9IGRpc2FibGVTZWFyY2g7XG5cblx0XHRcdFx0JGJvZHkuZmluZCggZGVmYXVsdE9yZGVyQnlFbGVtZW50ICkuY2hvc2VuV0NBUEYoIG9wdGlvbnMgKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGluaXRSYW5nZVNsaWRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLXJhbmdlLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGl0ZW0gICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgJHNsaWRlciA9ICRpdGVtLmZpbmQoICcud2NhcGYtbm91aS1zbGlkZXInICk7XG5cblx0XHRcdFx0Y29uc3Qgc2xpZGVySWQgICAgICAgICAgPSAkc2xpZGVyLmF0dHIoICdpZCcgKTtcblx0XHRcdFx0Y29uc3QgZGlzcGxheVZhbHVlc0FzICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kaXNwbGF5LXZhbHVlcy1hcycgKTtcblx0XHRcdFx0Y29uc3QgZm9ybWF0TnVtYmVycyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1mb3JtYXQtbnVtYmVycycgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgc3RlcCAgICAgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1zdGVwJyApICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1wbGFjZXMnICk7XG5cdFx0XHRcdGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gJGl0ZW0uYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBtaW5WYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBtYXhWYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCAkbWluVmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWluLXZhbHVlJyApO1xuXHRcdFx0XHRjb25zdCAkbWF4VmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWF4LXZhbHVlJyApO1xuXG5cdFx0XHRcdGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBzbGlkZXJJZCApO1xuXG5cdFx0XHRcdGNvbnN0IHNhZmVTdGVwID0gaXNOYU4oIHN0ZXAgKSB8fCBzdGVwIDw9IDAgPyAxIDogc3RlcDtcblxuXHRcdFx0XHRub1VpU2xpZGVyLmNyZWF0ZSggc2xpZGVyLCB7XG5cdFx0XHRcdFx0c3RhcnQ6IFsgbWluVmFsdWUsIG1heFZhbHVlIF0sXG5cdFx0XHRcdFx0c3RlcDogc2FmZVN0ZXAsXG5cdFx0XHRcdFx0Y29ubmVjdDogdHJ1ZSxcblx0XHRcdFx0XHRjc3NQcmVmaXg6ICd3Y2FwZi1ub3VpLScsXG5cdFx0XHRcdFx0cmFuZ2U6IHtcblx0XHRcdFx0XHRcdCdtaW4nOiByYW5nZU1pblZhbHVlLFxuXHRcdFx0XHRcdFx0J21heCc6IHJhbmdlTWluVmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgPyByYW5nZU1pblZhbHVlICsgc2FmZVN0ZXAgOiByYW5nZU1heFZhbHVlLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAndXBkYXRlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHRsZXQgbWluVmFsdWU7XG5cdFx0XHRcdFx0bGV0IG1heFZhbHVlO1xuXG5cdFx0XHRcdFx0aWYgKCBmb3JtYXROdW1iZXJzICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSBudW1iZXJGb3JtYXQoIHZhbHVlc1sgMCBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSBudW1iZXJGb3JtYXQoIHZhbHVlc1sgMSBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMSBdICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCAncGxhaW5fdGV4dCcgPT09IGRpc3BsYXlWYWx1ZXNBcyApIHtcblx0XHRcdFx0XHRcdCRtaW5WYWx1ZS5odG1sKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdFx0JG1heFZhbHVlLmh0bWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRtaW5WYWx1ZS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0XHQkbWF4VmFsdWUudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApIHtcblx0XHRcdFx0XHRjb25zdCBfbWluVmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDAgXSApO1xuXHRcdFx0XHRcdGNvbnN0IF9tYXhWYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMSBdICk7XG5cblx0XHRcdFx0XHQvLyBJZiB2YWx1ZSBpcyBub3QgY2hhbmdlZCB0aGVuIGRvbid0IHByb2NlZWQuXG5cdFx0XHRcdFx0aWYgKCBfbWluVmFsdWUgPT09IG1pblZhbHVlICYmIF9tYXhWYWx1ZSA9PT0gbWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBfbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgX21heFZhbHVlID09PSByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0Ly8gUmVtb3ZlIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICRpdGVtLmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIEFkZCByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0XHRjb25zdCB1cmwgPSAkaXRlbS5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclMXMnLCBfbWluVmFsdWUgKS5yZXBsYWNlKCAnJTJzJywgX21heFZhbHVlICk7XG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgaXNEcmFnZ2luZyA9IGZhbHNlO1xuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAnc3RhcnQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRpc0RyYWdnaW5nID0gdHJ1ZTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAnZW5kJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0aXNEcmFnZ2luZyA9IGZhbHNlO1xuXHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdFx0aWYgKCBpc0RyYWdnaW5nICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEtleWJvYXJkIGludGVyYWN0aW9uIOKAlCBkZWJvdW5jZSB0byBhdm9pZCBhIHJlcXVlc3Qgb24gZXZlcnkga2V5IHByZXNzLlxuXHRcdFx0XHRcdGNsZWFyVGltZW91dCggJGl0ZW0uZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaXRlbS5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCRpdGVtLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtaW5WYWx1ZS5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0IHZhbCA9IHBhcnNlRmxvYXQoICQoIHRoaXMgKS52YWwoKSApO1xuXHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBpc05hTiggdmFsICkgPyByYW5nZU1pblZhbHVlIDogdmFsLCBudWxsIF0gKTtcblx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0JG1pblZhbHVlLm9uKCAna2V5ZG93bicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdGlmICggJ0VudGVyJyA9PT0gZS5rZXkgKSB7XG5cdFx0XHRcdFx0XHQkKCB0aGlzICkudHJpZ2dlciggJ2NoYW5nZScgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkbWF4VmFsdWUub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCB2YWwgPSBwYXJzZUZsb2F0KCAkKCB0aGlzICkudmFsKCkgKTtcblx0XHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5zZXQoIFsgbnVsbCwgaXNOYU4oIHZhbCApID8gcmFuZ2VNYXhWYWx1ZSA6IHZhbCBdICk7XG5cdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtYXhWYWx1ZS5vbiggJ2tleWRvd24nLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRpZiAoICdFbnRlcicgPT09IGUua2V5ICkge1xuXHRcdFx0XHRcdFx0JCggdGhpcyApLnRyaWdnZXIoICdjaGFuZ2UnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRpbml0RmlsdGVyT3B0aW9uVG9vbHRpcDogZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkUmVmZXJlbmNlXG5cdFx0XHRpZiAoICdmdW5jdGlvbicgIT09IHR5cGVvZiB0aXBweSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLnVzZV90aXBweWpzICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHRvb2x0aXBQb3NpdGlvbnMgPSBbICd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2xlZnQnIF07XG5cblx0XHRcdHRvb2x0aXBQb3NpdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oIHRvb2x0aXBQb3NpdGlvbiApIHtcblx0XHRcdFx0Y29uc3QgaWRlbnRpZmllciA9ICdkYXRhLXdjYXBmLXRvb2x0aXAtJyArIHRvb2x0aXBQb3NpdGlvbjtcblxuXHRcdFx0XHQvLyBub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkUmVmZXJlbmNlXG5cdFx0XHRcdGNvbnN0IGluc3RhbmNlcyA9IHRpcHB5KCAnWycgKyBpZGVudGlmaWVyICsgJ10nLCB7XG5cdFx0XHRcdFx0cGxhY2VtZW50OiB0b29sdGlwUG9zaXRpb24sXG5cdFx0XHRcdFx0Y29udGVudCggcmVmZXJlbmNlICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJlZmVyZW5jZS5nZXRBdHRyaWJ1dGUoIGlkZW50aWZpZXIgKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGFsbG93SFRNTDogdHJ1ZSxcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHdpbmRvdy50aXBweUluc3RhbmNlcyA9IHRpcHB5SW5zdGFuY2VzLmNvbmNhdCggaW5zdGFuY2VzICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHRcdFdDQVBGLmluaXRDb21ib2JveCgpO1xuXHRcdFx0V0NBUEYuaW5pdFJhbmdlU2xpZGVyKCk7XG5cdFx0XHRXQ0FQRi5pbml0RmlsdGVyT3B0aW9uVG9vbHRpcCgpO1xuXHRcdH0sXG5cdFx0aGFuZGxlRm9ybVN1Ym1pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHQkYm9keS5vbiggJ3N1Ym1pdCcsICcud2NhcGYtZm9ybScsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRpbml0UG9wU3RhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucmVsb2FkX29uX2JhY2sgJiYgd2NhcGZfcGFyYW1zLmZvdW5kX3djYXBmICkge1xuXHRcdFx0XHRoaXN0b3J5LnJlcGxhY2VTdGF0ZSggeyB3Y2FwZjogdHJ1ZSB9LCAnJywgd2luZG93LmxvY2F0aW9uICk7XG5cblx0XHRcdFx0Ly8gSGFuZGxlIHRoZSBwb3BzdGF0ZSBldmVudChicm93c2VyJ3MgYmFjay9mb3J3YXJkKVxuXHRcdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3BvcHN0YXRlJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0aWYgKCBudWxsICE9PSBlLnN0YXRlICYmIGUuc3RhdGUuaGFzT3duUHJvcGVydHkoICd3Y2FwZicgKSApIHtcblx0XHRcdFx0XHRcdFdDQVBGLmZpbHRlclByb2R1Y3RzKCAncG9wc3RhdGUnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBFbmFibGUgaXQgaWYgbmVjZXNzYXJ5LlxuXHQgKlxuXHQgKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zMzAwNDkxN1xuXHQgKi9cblx0aWYgKCAnc2Nyb2xsUmVzdG9yYXRpb24nIGluIGhpc3RvcnkgKSB7XG5cdFx0Ly8gaGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvbiA9ICdtYW51YWwnO1xuXHR9XG5cbn0oIGpRdWVyeSwgd2luZG93ICkgKTtcblxuKCBmdW5jdGlvbiggJCwgV0NBUEYgKSB7XG5cblx0V0NBUEYuaW5pdCgpO1xuXHRXQ0FQRi5pbml0UG9wU3RhdGUoKTtcblxuXHRXQ0FQRi5oYW5kbGVGaWx0ZXJBY2NvcmRpb24oKTtcblx0V0NBUEYuaGFuZGxlSGllcmFyY2h5VG9nZ2xlKCk7XG5cdFdDQVBGLmhhbmRsZVNvZnRMaW1pdCgpO1xuXHRXQ0FQRi5oYW5kbGVTZWFyY2hGaWx0ZXJPcHRpb25zKCk7XG5cblx0V0NBUEYuaGFuZGxlTGlzdEZpbHRlcnMoKTtcblx0V0NBUEYuaGFuZGxlRHJvcGRvd25GaWx0ZXJzKCk7XG5cdFdDQVBGLmhhbmRsZU51bWJlcklucHV0RmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVQYWdpbmF0aW9uKCk7XG5cdFdDQVBGLmhhbmRsZURlZmF1bHRPcmRlcmJ5KCk7XG5cblx0V0NBUEYuaGFuZGxlQ2xlYXJGaWx0ZXIoKTtcblxuXHRXQ0FQRi5oYW5kbGVGaWx0ZXJUb29sdGlwKCk7XG5cblx0V0NBUEYuaGFuZGxlRm9ybVN1Ym1pdCgpO1xuXG5cdC8qKlxuXHQgKiBNYWtlIGl0IGNvbXBhdGlibGUgd2l0aCBvdGhlciBwbHVnaW5zLlxuXHQgKi9cblx0JCggZG9jdW1lbnQgKS5vbiggJ3djYXBmX2FmdGVyX3VwZGF0aW5nX3Byb2R1Y3RzJywgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gd29vLXZhcmlhdGlvbi1zd2F0Y2hlc1xuXHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggJ3dvb192YXJpYXRpb25fc3dhdGNoZXNfcHJvX2luaXQnICk7XG5cdH0gKTtcblxufSggalF1ZXJ5LCB3aW5kb3cuV0NBUEYgKSApO1xuIiwiLyoqXG4gKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNDE0MTgxM1xuICpcbiAqIEBwYXJhbSBudW1iZXJcbiAqIEBwYXJhbSBkZWNpbWFsc1xuICogQHBhcmFtIGRlY19wb2ludFxuICogQHBhcmFtIHRob3VzYW5kc19zZXBcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBudW1iZXJGb3JtYXQoIG51bWJlciwgZGVjaW1hbHMsIGRlY19wb2ludCwgdGhvdXNhbmRzX3NlcCApIHtcblx0Ly8gU3RyaXAgYWxsIGNoYXJhY3RlcnMgYnV0IG51bWVyaWNhbCBvbmVzLlxuXHRudW1iZXIgPSAoIG51bWJlciArICcnICkucmVwbGFjZSggL1teXFxkK1xcLUVlLl0vZywgJycgKTtcblxuXHRjb25zdCBuICAgID0gISBpc0Zpbml0ZSggK251bWJlciApID8gMCA6ICtudW1iZXI7XG5cdGNvbnN0IHByZWMgPSAhIGlzRmluaXRlKCArZGVjaW1hbHMgKSA/IDAgOiBNYXRoLmFicyggZGVjaW1hbHMgKTtcblx0Y29uc3Qgc2VwICA9ICggdHlwZW9mIHRob3VzYW5kc19zZXAgPT09ICd1bmRlZmluZWQnICkgPyAnLCcgOiB0aG91c2FuZHNfc2VwO1xuXHRjb25zdCBkZWMgID0gKCB0eXBlb2YgZGVjX3BvaW50ID09PSAndW5kZWZpbmVkJyApID8gJy4nIDogZGVjX3BvaW50O1xuXG5cdGxldCBzO1xuXG5cdGNvbnN0IHRvRml4ZWRGaXggPSBmdW5jdGlvbiggbiwgcHJlYyApIHtcblx0XHRjb25zdCBrID0gTWF0aC5wb3coIDEwLCBwcmVjICk7XG5cdFx0cmV0dXJuICcnICsgTWF0aC5yb3VuZCggbiAqIGsgKSAvIGs7XG5cdH07XG5cblx0Ly8gRml4IGZvciBJRSBwYXJzZUZsb2F0KDAuNTUpLnRvRml4ZWQoMCkgPSAwO1xuXHRzID0gKCBwcmVjID8gdG9GaXhlZEZpeCggbiwgcHJlYyApIDogJycgKyBNYXRoLnJvdW5kKCBuICkgKS5zcGxpdCggJy4nICk7XG5cblx0aWYgKCBzWyAwIF0ubGVuZ3RoID4gMyApIHtcblx0XHRzWyAwIF0gPSBzWyAwIF0ucmVwbGFjZSggL1xcQig/PSg/OlxcZHszfSkrKD8hXFxkKSkvZywgc2VwICk7XG5cdH1cblxuXHRpZiAoICggc1sgMSBdIHx8ICcnICkubGVuZ3RoIDwgcHJlYyApIHtcblx0XHRzWyAxIF0gPSBzWyAxIF0gfHwgJyc7XG5cdFx0c1sgMSBdICs9IG5ldyBBcnJheSggcHJlYyAtIHNbIDEgXS5sZW5ndGggKyAxICkuam9pbiggJzAnICk7XG5cdH1cblxuXHRyZXR1cm4gcy5qb2luKCBkZWMgKTtcbn1cblxuZnVuY3Rpb24gY2xlYW5VcmwoIHVybCApIHtcblx0cmV0dXJuIHVybC5yZXBsYWNlKCAvJTJDL2csICcsJyApO1xufVxuXG5mdW5jdGlvbiBnZXRPcmRlckJ5VXJsKCB1cmwgKSB7XG5cdGNvbnN0IHBhZ2VkID0gcGFyc2VJbnQoIHVybC5yZXBsYWNlKCAvLitcXC9wYWdlXFwvKFxcZCspKy8sICckMScgKSApO1xuXG5cdGlmICggcGFnZWQgKSB7XG5cdFx0dXJsID0gdXJsLnJlcGxhY2UoIC9wYWdlXFwvKFxcZCspXFwvLywgJycgKTtcblx0fVxuXG5cdHJldHVybiBjbGVhblVybCggdXJsICk7XG59XG4iXX0=
