"use strict";

/**
 * The frontend filter form.
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
  'chosen_lib_search_threshold': '',
  // todo
  'preserve_hierarchy_accordion_state': '',
  'preserve_soft_limit_state': '',
  'enable_animation_for_filter_accordion': '',
  'filter_accordion_animation_speed': '',
  'filter_accordion_animation_easing': '',
  'enable_animation_for_hierarchy_accordion': '',
  'hierarchy_accordion_animation_speed': '',
  'hierarchy_accordion_animation_easing': '',
  'restore_focus_after_filtering': '',
  'loading_overlay_options': '',
  'scroll_to_top_speed': '',
  'scroll_to_top_easing': '',
  'immediate_scroll_on_paginate': '',
  'is_mobile': '',
  'use_tippyjs': '',
  'shop_loop_container': '',
  'not_found_container': '',
  'enable_pagination_via_ajax': '',
  'pagination_container': '',
  'sorting_control': '',
  'attach_chosen_on_sorting': '',
  'loading_animation': '',
  'scroll_window': '',
  'scroll_window_for': '',
  'scroll_window_when': '',
  'scroll_window_custom_element': '',
  'scroll_to_top_offset': '',
  'disable_scroll_animation': '',
  'for_preview': ''
};
jQuery(document).ready(function ($) {
  return;
  var $body = $('body');
  var rangeValuesSeparator = '~';

  var _delay = parseInt(wcapf_params.filter_input_delay);

  var delay = _delay >= 0 ? _delay : 800; // Store fields' id and filter information.

  var fields = {};
  var wcapfSingleFilterSelector = '.wcapf-single-filter';
  var wcapfNavFilterSelector = '.wcapf-nav-filter';
  var wcapfNumberRangeFilterSelector = '.wcapf-number-range-filter';
  var wcapfDateFilterSelector = '.wcapf-date-range-filter';
  var $wcapfSingleFilters = $(wcapfSingleFilterSelector);
  var $wcapfNavFilters = $(wcapfNavFilterSelector);
  var $wcapfNumberRangeFilters = $(wcapfNumberRangeFilterSelector);
  var $wcapfDateFilters = $(wcapfDateFilterSelector);
  $wcapfSingleFilters.each(function () {
    var $field = $(this);
    var id = $field.attr('data-id');
    var $wrapper = $field.find('.wcapf-field-inner > div');
    var filterKey = $wrapper.attr('data-filter-key');
    var multipleFilter = parseInt($wrapper.attr('data-multiple-filter'));
    fields[id] = {
      filterKey: filterKey,
      multipleFilter: multipleFilter
    };
  }); // Initialize jQuery chosen library.

  function initChosen() {
    if (!jQuery().chosen) {
      return;
    }

    var $root;

    if (wcapf_params.for_preview) {
      $root = $(wcapfNavFilterSelector);
    } else {
      $root = $wcapfNavFilters;
    }

    $root.find('.wcapf-chosen-select').each(function () {
      var $this = $(this);
      var options = {
        inherit_select_classes: true,
        inherit_option_classes: true
      };

      if (wcapf_params.is_rtl) {
        options['rtl'] = true;
      }

      var noResultsMessage = $this.attr('data-no-results-message');

      if (noResultsMessage) {
        options['no_results_text'] = noResultsMessage;
      } // options[ 'disable_search' ] = true;


      var searchThreshold = parseInt(wcapf_params.chosen_lib_search_threshold);

      if (searchThreshold) {// options[ 'disable_search_threshold' ] = searchThreshold;
      } // options[ 'display_selected_options' ] = false;
      // minimumResultsForSearch: 20
      // options['minimumResultsForSearch'] = -1;


      $this.chosen(options);
    });
  }

  initChosen(); // Initialize hierarchy accordion.

  function initHierarchyAccordion() {
    var $root;

    if (wcapf_params.for_preview) {
      $root = $(wcapfNavFilterSelector);
    } else {
      $root = $wcapfNavFilters;
    }

    function toggleAccordion($el) {
      // Check to see if the button is pressed
      var pressed = $el.attr('aria-pressed') === 'true'; // Change aria-pressed to the opposite state

      $el.attr('aria-pressed', !pressed);
      var $child = $el.closest('li').children('ul');

      if (wcapf_params.enable_animation_for_hierarchy_accordion) {
        $child.slideToggle(wcapf_params.hierarchy_accordion_animation_speed, wcapf_params.hierarchy_accordion_animation_easing);
      } else {
        $child.toggle();
      }
    }

    $root.find('.wcapf-hierarchy-accordion-toggle').on('click', function () {
      toggleAccordion($(this));
    });
    $root.find('.wcapf-hierarchy-accordion-toggle').on('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Spacebar') {
        // Prevent the default action to stop scrolling when space is pressed
        e.preventDefault();
        toggleAccordion($(this));
      }
    });
  }

  initHierarchyAccordion();
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

  function number_format(number, decimals, dec_point, thousands_sep) {
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
  } // Initialize noUISlider.


  function initNoUISlider() {
    if ('undefined' === typeof noUiSlider) {
      return;
    }

    var $root;

    if (wcapf_params.for_preview) {
      $root = $(wcapfNumberRangeFilterSelector);
    } else {
      $root = $wcapfNumberRangeFilters;
    }

    $root.find('.wcapf-range-slider').each(function () {
      var $item = $(this); // TODO: Remove filter key.

      var filterKey = $item.attr('data-filter-key');
      var $slider = $item.find('.wcapf-noui-slider'); // If slider is already initialized then don't reinitialize again.

      if ($slider.hasClass('wcapf-noui-target')) {
        return;
      }

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
          minValue = number_format(values[0], decimalPlaces, decimalSeparator, thousandSeparator);
          maxValue = number_format(values[1], decimalPlaces, decimalSeparator, thousandSeparator);
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
        if (wcapf_params.for_preview) {
          return;
        }

        var minValue = parseFloat(values[0]);
        var maxValue = parseFloat(values[1]);

        if (minValue === rangeMinValue && maxValue === rangeMaxValue) {
          // Remove range filter.
          requestFilter($item.data('clear-filter-url'));
        } else {
          // Add range filter.
          var url = $item.data('url').replace('%1s', minValue).replace('%2s', maxValue);
          requestFilter(url);
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
      $minValue.on('input', function (event) {
        event.preventDefault();
        var $input = $(this); // Clear any previously set timer before setting a fresh one

        clearTimeout($input.data('timer'));
        $input.data('timer', setTimeout(function () {
          $input.removeData('timer');
          var minValue = $input.val();
          slider.noUiSlider.set([minValue, null]);
          filterProductsAccordingToSlider(slider.noUiSlider.get());
        }, delay));
      });
      $maxValue.on('input', function (event) {
        event.preventDefault();
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
  }

  initNoUISlider();

  function filterByDate($input) {
    if (wcapf_params.for_preview) {
      return;
    }

    var $wcapfDateFilter = $input.closest('.wcapf-date-input');
    var filterKey = $wcapfDateFilter.attr('data-filter-key');
    var isRange = $wcapfDateFilter.attr('data-is-range');
    var filterValue = '';
    var runFilter = false; // Clear any previously set timer before setting a fresh one

    clearTimeout($wcapfDateFilter.data('timer'));

    if (isRange) {
      var from = $wcapfDateFilter.find('.date-from-input').val();
      var to = $wcapfDateFilter.find('.date-to-input').val();

      if (from && to) {
        filterValue = from + rangeValuesSeparator + to;
        runFilter = true;
      } else if (!from && !to) {
        runFilter = true;
      }
    } else {
      var _from = $wcapfDateFilter.find('.date-from-input').val();

      if (_from) {
        filterValue = _from;
        runFilter = true;
      } else {
        runFilter = true;
      }
    }

    if (runFilter) {
      $wcapfDateFilter.data('timer', setTimeout(function () {
        $wcapfDateFilter.removeData('timer');

        if (filterValue) {
          updateQueryStringParameter(filterKey, filterValue);
        } else {
          var query = removeQueryStringParameter(filterKey);
          history.pushState({}, '', query);
        }

        filterProducts();
      }, delay));
    }
  }

  function initDatepicker() {
    if (!jQuery().datepicker) {
      return;
    }

    var $root;

    if (wcapf_params.for_preview) {
      $root = $(wcapfDateFilterSelector);
    } else {
      $root = $wcapfDateFilters;
    }

    var $wcapfDateFilter = $root.find('.wcapf-date-input');
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
    $from.on('change', function () {
      var $input = $(this);
      filterByDate($input);
    });
    $to.on('change', function () {
      var $input = $(this);
      filterByDate($input);
    });
  }

  initDatepicker();

  function initDefaultOrderBy() {
    // Attach chosen.
    if (wcapf_params.attach_chosen_on_sorting) {
      if (jQuery().chosen) {
        $body.find('.woocommerce-ordering select.orderby').chosen({
          'disable_search_threshold': 15
        });
      }
    }

    if (!wcapf_params.sorting_control) {
      $body.find('.woocommerce-ordering').each(function () {
        var $orderingForm = $(this);
        $orderingForm.on('change', 'select.orderby', function () {
          $orderingForm.submit();
        });
      });
      return;
    } // todo: check if ajax disabled.


    $body.find('.woocommerce-ordering').each(function () {
      var $orderingForm = $(this);
      $orderingForm.on('submit', function (e) {
        e.preventDefault();
      });
      $orderingForm.on('change', 'select.orderby', function (e) {
        e.preventDefault();
        var order = $(this).val();
        var filter_key = 'orderby';
        updateQueryStringParameter(filter_key, order);
        filterProducts();
      });
    });
  }

  initDefaultOrderBy();

  function updateProductsCountResult($results) {
    var selector = '.woocommerce-result-count';

    if ($(wcapf_params.shop_loop_container).find(selector).length) {
      return;
    }

    var newProductCount = $results.find(selector).html();
    $body.find(selector).html(newProductCount);
  }

  function showLoadingAnimation() {
    if (!wcapf_params.loading_animation) {
      return;
    }

    $.LoadingOverlay('show', wcapf_params.loading_overlay_options);
  }

  function disableNoUiSliders() {
    if ('undefined' === typeof noUiSlider) {
      return;
    }

    $wcapfNumberRangeFilters.find('.wcapf-noui-slider').each(function (e, element) {
      element.setAttribute('disabled', true);
    });
  }

  function disableLabels() {
    var selectors = '.wcapf-labeled-nav .item, .wcapf-active-filters .item'; // TODO: Add disabled attribute.

    $wcapfSingleFilters.find(selectors).addClass('disabled');
  }

  function disableInputs() {
    if (!wcapf_params.disable_inputs_while_fetching_results) {
      return;
    }

    var inputs = 'input, select';
    $wcapfSingleFilters.find(inputs).attr('disabled', 'disabled');
    $wcapfSingleFilters.find(inputs).trigger('chosen:updated');
    disableNoUiSliders();
    disableLabels();
  }

  function enableNoUiSliders() {
    if ('undefined' === typeof noUiSlider) {
      return;
    }

    $wcapfNumberRangeFilters.find('.wcapf-noui-slider').each(function (e, element) {
      element.removeAttribute('disabled');
    });
  }

  function enableInputs() {
    if (!wcapf_params.disable_inputs_while_fetching_results) {
      return;
    }

    var inputs = 'input';
    $wcapfNumberRangeFilters.find(inputs).removeAttr('disabled');
    $wcapfDateFilters.find(inputs).removeAttr('disabled');
    enableNoUiSliders();
  }

  function resetLoadingAnimation() {
    if (!wcapf_params.loading_animation) {
      return;
    }

    $.LoadingOverlay('hide');
  }

  function scrollTo() {
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

      $('html, body').stop().animate({
        scrollTop: offset
      }, wcapf_params.scroll_to_top_speed, wcapf_params.scroll_to_top_easing);
    }
  } // Things are done before fetching the products like showing a loading indicator.


  function beforeFetchingProducts() {
    disableInputs();
    showLoadingAnimation();

    if ('immediately' === wcapf_params.scroll_window_when) {
      scrollTo();
    }

    $body.trigger('wcapf_before_fetching_products');
  }

  function beforeUpdatingProducts($results) {
    resetLoadingAnimation();
    $body.trigger('wcapf_before_updating_products', [$results]);
  } // Things are done after applying the filter like scroll to top.


  function afterUpdatingProducts($results) {
    initChosen();
    initHierarchyAccordion();
    initNoUISlider();
    initDatepicker();
    initDefaultOrderBy();
    updateProductsCountResult($results);
    enableInputs();

    if ('after' === wcapf_params.scroll_window_when) {
      scrollTo();
    }

    $body.trigger('wcapf_after_updating_products', [$results]);
  } // The main filter function.


  function filterProducts() {
    var forceReRender = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (wcapf_params.for_preview) {
      return;
    }

    beforeFetchingProducts();
    $.get(window.location.href, function (data) {
      var $data = $(data); // Replace the fields' data with new data.

      $.each(fields, function (id) {
        var fieldID = '[data-id="' + id + '"]';
        var $field = $(fieldID);
        var $inner = $field.find('.wcapf-field-inner');

        var _field = $data.find(fieldID);

        var fieldClasses = $(_field).attr('class'); // Preserve hierarchy accordion state.

        if (wcapf_params.preserve_hierarchy_accordion_state) {
          if ($field.hasClass('hierarchy-accordion')) {
            $field.find('.hierarchy-accordion-toggle.active').each(function () {
              var itemValue = $(this).parent().children('input').val();
              var toggleSelector = 'input[value="' + itemValue + '"] ~ .hierarchy-accordion-toggle';
              var ulSelector = 'input[value="' + itemValue + '"] ~ ul';
              var _classes = 'hierarchy-accordion-toggle active';

              _field.find(toggleSelector).attr('class', _classes);

              _field.find(ulSelector).show();
            });
          }
        }

        var _html = _field.find('.wcapf-field-inner').html(); // Show soft limit items.


        var softLimitSelector = 'show-hidden-items';

        if ($field.hasClass(softLimitSelector)) {
          if (!_field.hasClass(softLimitSelector)) {
            fieldClasses += ' ' + softLimitSelector;
          }
        } else {
          fieldClasses = fieldClasses.replace(softLimitSelector, '');
        } // Update the field's class.


        $field.attr('class', fieldClasses.trim()); // When called from history back or forward request then rerender all fields.

        if (forceReRender) {
          // update field
          $inner.html(_html);
        } else {
          // Selectively rerender the fields.
          if ($field.hasClass('wcapf-nav-filter')) {
            // update field
            $inner.html(_html);
          }
        }

        $field.trigger('wcapf-field-updated', [_field]);
      });
      beforeUpdatingProducts($data); // Replace old shop loop with new one.

      var $shopLoopContainer = $data.find(wcapf_params.shop_loop_container);
      var $notFoundContainer = $data.find(wcapf_params.not_found_container);

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

      afterUpdatingProducts($data);
    });
  } // URL Parser


  function getUrlVars(url) {
    var vars = {},
        hash;

    if (typeof url === 'undefined') {
      url = window.location.href;
    }

    url = url.replaceAll('%2C', ',');
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    var hLength = hashes.length;

    for (var i = 0; i < hLength; i++) {
      hash = hashes[i].split('=');
      vars[hash[0]] = hash[1];
    }

    return vars;
  } // everytime we apply the filter we set the current page to 1


  function fixPagination() {
    var url = window.location.href;
    var params = getUrlVars(url);
    var currentPageInUrl = parseInt(url.replace(/.+\/page\/(\d+)+/, '$1'));

    if (currentPageInUrl) {
      if (currentPageInUrl > 1) {
        url = url.replace(/page\/(\d+)/, 'page/1');
      }
    } else if (typeof params['paged'] !== 'undefined') {
      var currentPageInParams = parseInt(params['paged']);

      if (currentPageInParams > 1) {
        url = url.replace('paged=' + currentPageInParams, 'paged=1');
      }
    }

    return url;
  } // update query string for categories, meta etc..


  function updateQueryStringParameter(key, value, pushHistory, url) {
    if (typeof pushHistory === 'undefined') {
      pushHistory = true;
    }

    if (typeof url === 'undefined') {
      url = fixPagination();
    }

    var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
    var separator = url.indexOf('?') !== -1 ? '&' : '?';
    var urlWithQuery;

    if (url.match(re)) {
      urlWithQuery = url.replace(re, '$1' + key + '=' + value + '$2');
    } else {
      urlWithQuery = url + separator + key + '=' + value;
    }

    if (pushHistory === true) {
      return history.pushState({}, '', urlWithQuery);
    } else {
      return urlWithQuery;
    }
  } // remove parameter from url


  function removeQueryStringParameter(filterKey, url) {
    if (typeof url === 'undefined') {
      url = fixPagination();
    }

    var oldParams = getUrlVars(url);
    var oldParamsLength = Object.keys(oldParams).length;
    var startPosition = url.indexOf('?');
    var filterKeyPosition = url.indexOf(filterKey);
    var cleanUrl, cleanQuery;

    if (oldParamsLength > 1) {
      if (filterKeyPosition - startPosition > 1) {
        cleanUrl = url.replace('&' + filterKey + '=' + oldParams[filterKey], '');
      } else {
        cleanUrl = url.replace(filterKey + '=' + oldParams[filterKey] + '&', '');
      }

      var newParams = cleanUrl.split('?');
      cleanQuery = '?' + newParams[1];
    } else {
      cleanQuery = url.replace('?' + filterKey + '=' + oldParams[filterKey], '');
    }

    return cleanQuery;
  } // take the key and value and make query


  function makeParameters(filterKey, filterValue) {
    var forceRerender = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var url = arguments.length > 3 ? arguments[3] : undefined;
    var valueSeparator = ',';
    var params,
        nextValues,
        emptyValue = false;

    if (typeof url !== 'undefined') {
      params = getUrlVars(url);
    } else {
      params = getUrlVars();
    }

    if (typeof params[filterKey] != 'undefined') {
      var prevValues = params[filterKey];
      var prevValuesArray = prevValues.split(valueSeparator);

      if (prevValues.length > 0) {
        var found = $.inArray(filterValue, prevValuesArray);

        if (found >= 0) {
          // Element was found, remove it.
          prevValuesArray.splice(found, 1);

          if (prevValuesArray.length === 0) {
            emptyValue = true;
          }
        } else {
          // Element was not found, add it.
          prevValuesArray.push(filterValue);
        }

        if (prevValuesArray.length > 1) {
          nextValues = prevValuesArray.join(valueSeparator);
        } else {
          nextValues = prevValuesArray;
        }
      } else {
        nextValues = filterValue;
      }
    } else {
      nextValues = filterValue;
    } // update url and query string


    if (!emptyValue) {
      updateQueryStringParameter(filterKey, nextValues);
    } else {
      var query = removeQueryStringParameter(filterKey);
      history.pushState({}, '', query);
    }

    filterProducts(forceRerender);
  }

  function singleFilter(filterKey, filterValue) {
    var params = getUrlVars();
    var query;

    if (typeof params[filterKey] !== 'undefined' && params[filterKey] === filterValue) {
      query = removeQueryStringParameter(filterKey);
    } else {
      query = updateQueryStringParameter(filterKey, filterValue, false);
    } // update url


    history.pushState({}, '', query);
    filterProducts();
  } // Handle the pagination request via ajax.


  if (wcapf_params.enable_pagination_via_ajax && wcapf_params.pagination_container) {
    var $container = $(wcapf_params.shop_loop_container);
    var selector = wcapf_params.pagination_container + ' a'; // todo: check if ajax disabled.

    if ($container.length) {
      $container.on('click', selector, function (e) {
        e.preventDefault();
        var location = $(this).attr('href');
        history.pushState({}, '', location);
        filterProducts();
      });
    }
  } // The function to handle the common filter requests.


  function handleFilterRequest($item, filterValue) {
    var $field = $item.closest('.wcapf-single-filter');
    var fieldID = $field.attr('data-id');
    var fieldData = fields[fieldID];
    var filterKey = fieldData.filterKey;
    var multipleFilter = fieldData.multipleFilter;

    if (!filterKey) {
      return;
    }

    if (!filterValue.length) {
      var query = removeQueryStringParameter(filterKey);
      history.pushState({}, '', query);
      filterProducts();
      return;
    }

    if (multipleFilter) {
      makeParameters(filterKey, filterValue);
    } else {
      singleFilter(filterKey, filterValue);
    }
  }

  function requestFilter(url) {
    if (!url) {
      return;
    } // window.location.href = url;
    // TODO: Filter the products conditionally.
    // filterProducts();

  } // Handle the filter request for list field.


  $wcapfNavFilters.on('change', '.wcapf-layered-nav [type="checkbox"], .wcapf-layered-nav [type="radio"]', function (event) {
    event.preventDefault();
    var $item = $(this);
    requestFilter($item.data('url'));
  }); // Handle the filter request for labeled item.

  $wcapfNavFilters.on('click', '.wcapf-labeled-nav .item:not(.disabled)', function (event) {
    event.preventDefault();
    var $item = $(this);
    requestFilter($item.data('url'));
  }); // Handle the filter request for display type select fields.

  $wcapfNavFilters.on('change', 'select', function (event) {
    event.preventDefault();
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

    requestFilter(url);
  });
  /**
   * Handle the filter request for range number.
   */

  var rangeNumberSelectors = '.wcapf-range-number .min-value, .wcapf-range-number .max-value'; // TODO: Maybe use 'change' event.

  $wcapfNumberRangeFilters.on('input', rangeNumberSelectors, function (event) {
    event.preventDefault();
    var $item = $(this);
    var $rangeNumber = $item.closest('.wcapf-range-number');
    var formatNumbers = $rangeNumber.attr('data-format-numbers');
    var rangeMinValue = parseFloat($rangeNumber.attr('data-range-min-value'));
    var rangeMaxValue = parseFloat($rangeNumber.attr('data-range-max-value'));
    var decimalPlaces = $rangeNumber.attr('data-decimal-places');
    var thousandSeparator = $rangeNumber.attr('data-thousand-separator');
    var decimalSeparator = $rangeNumber.attr('data-decimal-separator'); // Clear any previously set timer before setting a fresh one

    clearTimeout($item.data('timer'));

    function getValue(floatValue) {
      if (formatNumbers) {
        return number_format(floatValue, decimalPlaces, decimalSeparator, thousandSeparator);
      }

      return floatValue;
    }

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
      }

      if (minValue === rangeMinValue && maxValue === rangeMaxValue) {
        // Remove range filter.
        requestFilter($rangeNumber.data('clear-filter-url'));
      } else {
        // Add range filter.
        var url = $rangeNumber.data('url').replace('%1s', minValue).replace('%2s', maxValue);
        requestFilter(url);
      }
    }, delay));
  }); // Handle removing the active filters.

  $wcapfNavFilters.on('click', '.wcapf-active-filters .item:not(.disabled)', function (event) {
    event.preventDefault();
    var $item = $(this);
    var filterKey = $item.attr('data-filter-key');
    var filterValue = $item.attr('data-value');
    makeParameters(filterKey, filterValue, true);
  });

  function resetFilters($button) {
    var _filterKeys = $button.attr('data-keys');

    if (!_filterKeys) {
      return;
    }

    var filterKeys = _filterKeys.split(',');

    var query = '';
    $.each(filterKeys, function (i, filterKey) {
      if (query) {
        query = removeQueryStringParameter(filterKey, query);
      } else {
        query = removeQueryStringParameter(filterKey);
      }
    }); // Empty query causes issue(doesn't remove the filter keys from the url),
    // this is why we are setting the page url as query.

    if (!query) {
      var prevUrl = window.location.href;
      var newUrl = prevUrl.split('?');
      query = newUrl[0];
    }

    history.pushState({}, '', query);
    filterProducts(true);
  } // Clear/Reset all filters.


  $body.on('wcapf-reset-filters', function (e, $button) {
    resetFilters($button);
  });
  $body.on('click', '.wcapf-reset-filters-btn', function () {
    var $button = $(this);
    resetFilters($button);
  });
  $wcapfNavFilters.on('click', '.wcapf-reset-filters-btn', function (event) {
    event.preventDefault();
    var $button = $(this);
    $body.trigger('wcapf-reset-filters', [$button]);
  });
  $wcapfSingleFilters.on('wcapf-clear-filter', function () {
    var $field = $(this);
    var fieldID = $field.attr('data-id');
    var fieldData = fields[fieldID];
    var filterKey = fieldData.filterKey;
    var query = removeQueryStringParameter(filterKey);
    history.pushState({}, '', query);
    filterProducts(true);
  }); // Run ajax filter when browser history changes (user goes back or forward).

  if ($(wcapf_params.shop_loop_container).length || $(wcapf_params.not_found_container).length) {
    if (wcapf_params.apply_filters_on_browser_history_change) {
      $(window).bind('popstate', function () {
        filterProducts(true);
      });
    }
  } // The hook that manually run the ajax filters (can be useful for other plugins).


  $body.on('wcapf-run-filter-products', function (e, forceReRender) {
    filterProducts(forceReRender);
  }); // The hook that reinitialize the filter widgets (to show the preview in the backend).

  $body.on('init_filter_widgets', function () {
    initChosen();
    initHierarchyAccordion();
    initNoUISlider();
    initDatepicker();
  });
  /**
   * Make it compatible with other plugins.
   */

  $body.on('wcapf_after_updating_products', function () {
    // woo-variation-swatches
    $(document).trigger('woo_variation_swatches_pro_init');
  });
});
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

(function ($, window) {
  var _delay = parseInt(wcapf_params.filter_input_delay);

  var delay = _delay >= 0 ? _delay : 800;
  var $body = $('body');
  var instanceIds = [];
  $('.wcapf-filter').each(function () {
    instanceIds.push($(this).data('id'));
  });
  var focusedElm;
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
      $body.on('input', '.wcapf-search-box input[type="text"]', function (e) {
        var $that = $(this);
        var $inner = $that.closest('.wcapf-filter-inner');
        var $filter = $inner.closest('.wcapf-filter');
        var keyword = $that.val();

        if (!keyword.length) {
          $filter.removeClass('search-active');
          $.each($inner.find('.wcapf-filter-options > li'), function () {
            $(this).removeClass('keyword-matched');
          });
          return;
        }

        $filter.addClass('search-active');
        $.each($inner.find('.wcapf-filter-options > li'), function () {
          var $filterItem = $(this);
          var label = $filterItem.find('.wcapf-filter-item-label').data('label');

          if (label.toLowerCase().includes(keyword.toLowerCase())) {
            $filterItem.addClass('keyword-matched');
          } else {
            $filterItem.removeClass('keyword-matched');
          }
        });
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
    showLoadingAnimation: function showLoadingAnimation() {
      if (!wcapf_params.loading_animation) {
        return;
      }

      $.LoadingOverlay('show', wcapf_params.loading_overlay_options);
    },
    resetLoadingAnimation: function resetLoadingAnimation() {
      if (!wcapf_params.loading_animation) {
        return;
      }

      $.LoadingOverlay('hide');
    },
    scrollTo: function scrollTo(triggeredBy) {
      if ('none' === wcapf_params.scroll_window) {
        return;
      }

      var allowed = [];
      var scrollWhen = wcapf_params.scroll_window_when;

      if ('all' === scrollWhen) {
        allowed.push('filter');
        allowed.push('paginate');
      } else {
        allowed.push(scrollWhen);
      }

      if (!allowed.includes(triggeredBy)) {
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
      WCAPF.showLoadingAnimation(); // Scroll into view on paginate.

      if ('paginate' === triggeredBy && wcapf_params.immediate_scroll_on_paginate) {
        WCAPF.scrollTo(triggeredBy);
      }

      $body.trigger('wcapf_before_fetching_products', [triggeredBy]);
    },
    // Things are done before updating the products like hiding the loading indicator.
    beforeUpdatingProducts: function beforeUpdatingProducts($response, triggeredBy) {
      WCAPF.resetLoadingAnimation();
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


      WCAPF.init(); // Scroll into view.

      if ('paginate' === triggeredBy && wcapf_params.immediate_scroll_on_paginate) {// Do nothing because it already happened.
      } else {
        WCAPF.scrollTo(triggeredBy);
      } // Trigger events.


      $(document).trigger('ready');
      $(window).trigger('scroll');
      $(window).trigger('resize');
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

          document.title = $response.filter('title').text(); // Update the instances.

          var _iterator = _createForOfIteratorHelper(instanceIds),
              _step;

          try {
            var _loop = function _loop() {
              var id = _step.value;
              var instanceId = '[data-id="' + id + '"]';
              var $instance = $(instanceId);
              var $inner = $instance.find('.wcapf-filter-inner');

              var _instance = $response.find(instanceId);

              var _instanceClasses = $(_instance).attr('class'); // Preserve hierarchy accordion state.


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
              } // Update clear filter button url.


              var clearBtnSelector = '.wcapf-filter-clear-btn';

              var clearFilterUrl = _instance.find(clearBtnSelector).attr('data-clear-filter-url');

              $instance.find(clearBtnSelector).attr('data-clear-filter-url', clearFilterUrl); // Update the instance classes.

              $instance.attr('class', _instanceClasses.trim());

              var _html = _instance.find('.wcapf-filter-inner').html(); // Finally update the instance.


              $inner.html(_html);
              $instance.trigger('wcapf-filter-updated', [_instance]);
            };

            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              _loop();
            } // Replace old shop loop with new one.

          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

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
      } // window.location.href = url;


      history.pushState({
        wcapf: true
      }, '', url);
      WCAPF.filterProducts(triggeredBy);
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
    handleListFilters: function handleListFilters() {
      var nativeInputs = '.list-type-native [type="checkbox"],' + '.list-type-native [type="radio"],' + '.list-type-custom-checkbox [type="checkbox"]';
      $body.on('change', nativeInputs, function () {
        WCAPF.requestFilter($(this).data('url'));
      });
      var customRadioSelector = '.list-type-custom-radio';
      $body.on('change', customRadioSelector + ' [type="checkbox"]', function () {
        // https://stackoverflow.com/a/5839924
        $(this).closest(customRadioSelector).find('[type="checkbox"]').not(this).prop('checked', false);
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
        var selector = wcapf_params.pagination_container + ' a';

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
    handleResetFilters: function handleResetFilters() {
      $body.on('click', '.wcapf-reset-filters-btn', function () {
        console.log('reset all filters');
      });
    },
    // TODO: Move to pro
    handleClearFilter: function handleClearFilter() {
      $body.on('click', '.wcapf-filter-clear-btn', function (e) {
        e.stopPropagation();
        WCAPF.requestFilter($(this).attr('data-clear-filter-url'));
      }).on('keydown', '.wcapf-filter-clear-btn', function (e) {
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'Spacebar') {
          // Prevent the default action to stop scrolling when space is pressed
          e.preventDefault();
          e.stopPropagation();
          WCAPF.requestFilter($(this).attr('data-clear-filter-url'));
        }
      });
    },
    handleFilterTooltip: function handleFilterTooltip() {
      if ('function' !== typeof tippy) {
        return;
      }

      if (!wcapf_params.use_tippyjs) {
        return;
      }

      tippy('.wcapf-filter-tooltip', {
        placement: 'top',
        content: function content(reference) {
          var title = reference.getAttribute('data-content');
          reference.removeAttribute('title');
          return title;
        },
        allowHTML: true
      });
    },
    initCombobox: function initCombobox() {
      if (!jQuery().chosenWCAPF) {
        return;
      }

      var options = {
        inherit_select_classes: true,
        inherit_option_classes: true,
        no_results_text: wcapf_params.chosen_no_results_text,
        options_none_text: wcapf_params.chosen_options_none_text
      };

      if (wcapf_params.is_rtl) {
        options['rtl'] = true;
      }

      $body.find('.wcapf-chosen').each(function () {
        var $this = $(this); // If hierarchy enabled then we show the selected options.

        if ($this.hasClass('has-hierarchy')) {
          options['display_selected_options'] = true;
        } else {
          options['display_selected_options'] = wcapf_params.chosen_display_selected_options;
        }

        $this.chosenWCAPF(options);
      }); // Attach chosen for default orderby.

      if (wcapf_params.attach_chosen_on_sorting) {
        var disableSearch = true;

        if (wcapf_params.search_box_in_default_orderby) {
          disableSearch = false;
        }

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
    init: function init() {
      WCAPF.initCombobox();
      WCAPF.initRangeSlider();
    }
  }; // Handle the popstate event(browser's back/forward)

  window.addEventListener('popstate', function (e) {
    if (null !== e.state && e.state.hasOwnProperty('wcapf')) {
      WCAPF.filterProducts('popstate');
    }
  }); // @source https://stackoverflow.com/a/33004917

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
})(jQuery, window);

(function ($, WCAPF) {
  WCAPF.init();
  WCAPF.handleFilterAccordion();
  WCAPF.handleHierarchyToggle();
  WCAPF.handleSoftLimit();
  WCAPF.handleSearchFilterOptions();
  WCAPF.handleListFilters();
  WCAPF.handleDropdownFilters();
  WCAPF.handleNumberInputFilters();
  WCAPF.handlePagination();
  WCAPF.handleDefaultOrderby();
  WCAPF.handleResetFilters();
  WCAPF.handleClearFilter();
  WCAPF.handleFilterTooltip();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbHRlci1mb3JtLmpzIiwicmVmYWN0b3JlZC5qcyIsInV0aWxzLmpzIl0sIm5hbWVzIjpbIndjYXBmX3BhcmFtcyIsImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwiJGJvZHkiLCJyYW5nZVZhbHVlc1NlcGFyYXRvciIsIl9kZWxheSIsInBhcnNlSW50IiwiZmlsdGVyX2lucHV0X2RlbGF5IiwiZGVsYXkiLCJmaWVsZHMiLCJ3Y2FwZlNpbmdsZUZpbHRlclNlbGVjdG9yIiwid2NhcGZOYXZGaWx0ZXJTZWxlY3RvciIsIndjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJTZWxlY3RvciIsIndjYXBmRGF0ZUZpbHRlclNlbGVjdG9yIiwiJHdjYXBmU2luZ2xlRmlsdGVycyIsIiR3Y2FwZk5hdkZpbHRlcnMiLCIkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMiLCIkd2NhcGZEYXRlRmlsdGVycyIsImVhY2giLCIkZmllbGQiLCJpZCIsImF0dHIiLCIkd3JhcHBlciIsImZpbmQiLCJmaWx0ZXJLZXkiLCJtdWx0aXBsZUZpbHRlciIsImluaXRDaG9zZW4iLCJjaG9zZW4iLCIkcm9vdCIsImZvcl9wcmV2aWV3IiwiJHRoaXMiLCJvcHRpb25zIiwiaW5oZXJpdF9zZWxlY3RfY2xhc3NlcyIsImluaGVyaXRfb3B0aW9uX2NsYXNzZXMiLCJpc19ydGwiLCJub1Jlc3VsdHNNZXNzYWdlIiwic2VhcmNoVGhyZXNob2xkIiwiY2hvc2VuX2xpYl9zZWFyY2hfdGhyZXNob2xkIiwiaW5pdEhpZXJhcmNoeUFjY29yZGlvbiIsInRvZ2dsZUFjY29yZGlvbiIsIiRlbCIsInByZXNzZWQiLCIkY2hpbGQiLCJjbG9zZXN0IiwiY2hpbGRyZW4iLCJlbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uIiwic2xpZGVUb2dnbGUiLCJoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsInRvZ2dsZSIsIm9uIiwiZSIsImtleSIsInByZXZlbnREZWZhdWx0IiwibnVtYmVyX2Zvcm1hdCIsIm51bWJlciIsImRlY2ltYWxzIiwiZGVjX3BvaW50IiwidGhvdXNhbmRzX3NlcCIsInJlcGxhY2UiLCJuIiwiaXNGaW5pdGUiLCJwcmVjIiwiTWF0aCIsImFicyIsInNlcCIsImRlYyIsInMiLCJ0b0ZpeGVkRml4IiwiayIsInBvdyIsInJvdW5kIiwic3BsaXQiLCJsZW5ndGgiLCJBcnJheSIsImpvaW4iLCJpbml0Tm9VSVNsaWRlciIsIm5vVWlTbGlkZXIiLCIkaXRlbSIsIiRzbGlkZXIiLCJoYXNDbGFzcyIsInNsaWRlcklkIiwiZGlzcGxheVZhbHVlc0FzIiwiZm9ybWF0TnVtYmVycyIsInJhbmdlTWluVmFsdWUiLCJwYXJzZUZsb2F0IiwicmFuZ2VNYXhWYWx1ZSIsInN0ZXAiLCJkZWNpbWFsUGxhY2VzIiwidGhvdXNhbmRTZXBhcmF0b3IiLCJkZWNpbWFsU2VwYXJhdG9yIiwibWluVmFsdWUiLCJtYXhWYWx1ZSIsIiRtaW5WYWx1ZSIsIiRtYXhWYWx1ZSIsInNsaWRlciIsImdldEVsZW1lbnRCeUlkIiwiY3JlYXRlIiwic3RhcnQiLCJjb25uZWN0IiwiY3NzUHJlZml4IiwicmFuZ2UiLCJ2YWx1ZXMiLCJodG1sIiwidmFsIiwidHJpZ2dlciIsImZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIiLCJyZXF1ZXN0RmlsdGVyIiwiZGF0YSIsInVybCIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJyZW1vdmVEYXRhIiwiZXZlbnQiLCIkaW5wdXQiLCJzZXQiLCJnZXQiLCJmaWx0ZXJCeURhdGUiLCIkd2NhcGZEYXRlRmlsdGVyIiwiaXNSYW5nZSIsImZpbHRlclZhbHVlIiwicnVuRmlsdGVyIiwiZnJvbSIsInRvIiwidXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIiLCJxdWVyeSIsInJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsImZpbHRlclByb2R1Y3RzIiwiaW5pdERhdGVwaWNrZXIiLCJkYXRlcGlja2VyIiwiZm9ybWF0IiwieWVhckRyb3Bkb3duIiwibW9udGhEcm9wZG93biIsIiRmcm9tIiwiJHRvIiwiZGF0ZUZvcm1hdCIsImNoYW5nZVllYXIiLCJjaGFuZ2VNb250aCIsImluaXREZWZhdWx0T3JkZXJCeSIsImF0dGFjaF9jaG9zZW5fb25fc29ydGluZyIsInNvcnRpbmdfY29udHJvbCIsIiRvcmRlcmluZ0Zvcm0iLCJzdWJtaXQiLCJvcmRlciIsImZpbHRlcl9rZXkiLCJ1cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0IiwiJHJlc3VsdHMiLCJzZWxlY3RvciIsInNob3BfbG9vcF9jb250YWluZXIiLCJuZXdQcm9kdWN0Q291bnQiLCJzaG93TG9hZGluZ0FuaW1hdGlvbiIsImxvYWRpbmdfYW5pbWF0aW9uIiwiTG9hZGluZ092ZXJsYXkiLCJsb2FkaW5nX292ZXJsYXlfb3B0aW9ucyIsImRpc2FibGVOb1VpU2xpZGVycyIsImVsZW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJkaXNhYmxlTGFiZWxzIiwic2VsZWN0b3JzIiwiYWRkQ2xhc3MiLCJkaXNhYmxlSW5wdXRzIiwiZGlzYWJsZV9pbnB1dHNfd2hpbGVfZmV0Y2hpbmdfcmVzdWx0cyIsImlucHV0cyIsImVuYWJsZU5vVWlTbGlkZXJzIiwicmVtb3ZlQXR0cmlidXRlIiwiZW5hYmxlSW5wdXRzIiwicmVtb3ZlQXR0ciIsInJlc2V0TG9hZGluZ0FuaW1hdGlvbiIsInNjcm9sbFRvIiwic2Nyb2xsX3dpbmRvdyIsInNjcm9sbEZvciIsInNjcm9sbF93aW5kb3dfZm9yIiwiaXNNb2JpbGUiLCJpc19tb2JpbGUiLCJwcm9jZWVkIiwiYWRqdXN0aW5nT2Zmc2V0Iiwib2Zmc2V0Iiwic2Nyb2xsX3RvX3RvcF9vZmZzZXQiLCJjb250YWluZXIiLCJub3RfZm91bmRfY29udGFpbmVyIiwic2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudCIsIiRjb250YWluZXIiLCJ0b3AiLCJzdG9wIiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsInNjcm9sbF90b190b3Bfc3BlZWQiLCJzY3JvbGxfdG9fdG9wX2Vhc2luZyIsImJlZm9yZUZldGNoaW5nUHJvZHVjdHMiLCJzY3JvbGxfd2luZG93X3doZW4iLCJiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzIiwiYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzIiwiZm9yY2VSZVJlbmRlciIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsIiRkYXRhIiwiZmllbGRJRCIsIiRpbm5lciIsIl9maWVsZCIsImZpZWxkQ2xhc3NlcyIsInByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUiLCJpdGVtVmFsdWUiLCJwYXJlbnQiLCJ0b2dnbGVTZWxlY3RvciIsInVsU2VsZWN0b3IiLCJfY2xhc3NlcyIsInNob3ciLCJfaHRtbCIsInNvZnRMaW1pdFNlbGVjdG9yIiwidHJpbSIsIiRzaG9wTG9vcENvbnRhaW5lciIsIiRub3RGb3VuZENvbnRhaW5lciIsImdldFVybFZhcnMiLCJ2YXJzIiwiaGFzaCIsInJlcGxhY2VBbGwiLCJoYXNoZXMiLCJzbGljZSIsImluZGV4T2YiLCJoTGVuZ3RoIiwiaSIsImZpeFBhZ2luYXRpb24iLCJwYXJhbXMiLCJjdXJyZW50UGFnZUluVXJsIiwiY3VycmVudFBhZ2VJblBhcmFtcyIsInZhbHVlIiwicHVzaEhpc3RvcnkiLCJyZSIsIlJlZ0V4cCIsInNlcGFyYXRvciIsInVybFdpdGhRdWVyeSIsIm1hdGNoIiwib2xkUGFyYW1zIiwib2xkUGFyYW1zTGVuZ3RoIiwiT2JqZWN0Iiwia2V5cyIsInN0YXJ0UG9zaXRpb24iLCJmaWx0ZXJLZXlQb3NpdGlvbiIsImNsZWFuVXJsIiwiY2xlYW5RdWVyeSIsIm5ld1BhcmFtcyIsIm1ha2VQYXJhbWV0ZXJzIiwiZm9yY2VSZXJlbmRlciIsInZhbHVlU2VwYXJhdG9yIiwibmV4dFZhbHVlcyIsImVtcHR5VmFsdWUiLCJwcmV2VmFsdWVzIiwicHJldlZhbHVlc0FycmF5IiwiZm91bmQiLCJpbkFycmF5Iiwic3BsaWNlIiwicHVzaCIsInNpbmdsZUZpbHRlciIsImVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4IiwicGFnaW5hdGlvbl9jb250YWluZXIiLCJoYW5kbGVGaWx0ZXJSZXF1ZXN0IiwiZmllbGREYXRhIiwiJHNlbGVjdCIsImZpbHRlclVSTCIsImNsZWFyRmlsdGVyVVJMIiwidG9TdHJpbmciLCJyYW5nZU51bWJlclNlbGVjdG9ycyIsIiRyYW5nZU51bWJlciIsImdldFZhbHVlIiwiZmxvYXRWYWx1ZSIsImlzTmFOIiwicmVzZXRGaWx0ZXJzIiwiJGJ1dHRvbiIsIl9maWx0ZXJLZXlzIiwiZmlsdGVyS2V5cyIsInByZXZVcmwiLCJuZXdVcmwiLCJhcHBseV9maWx0ZXJzX29uX2Jyb3dzZXJfaGlzdG9yeV9jaGFuZ2UiLCJiaW5kIiwiaW5zdGFuY2VJZHMiLCJmb2N1c2VkRWxtIiwiV0NBUEYiLCJoYW5kbGVGaWx0ZXJBY2NvcmRpb24iLCIkZmlsdGVySW5uZXIiLCJlbmFibGVfYW5pbWF0aW9uX2Zvcl9maWx0ZXJfYWNjb3JkaW9uIiwiZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQiLCJmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmciLCJzdG9wUHJvcGFnYXRpb24iLCIkdHJpZ2dlciIsImhhbmRsZUhpZXJhcmNoeVRvZ2dsZSIsImhhbmRsZVNvZnRMaW1pdCIsInRvZ2dsZUZpbHRlck9wdGlvbnMiLCIkbGlzdFdyYXBwZXIiLCJyZW1vdmVDbGFzcyIsImhhbmRsZVNlYXJjaEZpbHRlck9wdGlvbnMiLCIkdGhhdCIsIiRmaWx0ZXIiLCJrZXl3b3JkIiwiJGZpbHRlckl0ZW0iLCJsYWJlbCIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCIkcmVzcG9uc2UiLCJuZXdDb3VudCIsImhhcyIsInRyaWdnZXJlZEJ5IiwiYWxsb3dlZCIsInNjcm9sbFdoZW4iLCJkaXNhYmxlX3Njcm9sbF9hbmltYXRpb24iLCJhY3RpdmVFbGVtZW50IiwiaW1tZWRpYXRlX3Njcm9sbF9vbl9wYWdpbmF0ZSIsInJlc3RvcmVfZm9jdXNfYWZ0ZXJfZmlsdGVyaW5nIiwiYm9keSIsImZvY3VzIiwiaW5pdCIsImFqYXgiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJ0aXRsZSIsImZpbHRlciIsInRleHQiLCJpbnN0YW5jZUlkIiwiJGluc3RhbmNlIiwiX2luc3RhbmNlIiwiX2luc3RhbmNlQ2xhc3NlcyIsImhpZGUiLCJwcmVzZXJ2ZV9zb2Z0X2xpbWl0X3N0YXRlIiwiY2xlYXJCdG5TZWxlY3RvciIsImNsZWFyRmlsdGVyVXJsIiwiaG9zdG5hbWUiLCJ3Y2FwZiIsImhhbmRsZU51bWJlcklucHV0RmlsdGVycyIsIm9sZE1pblZhbHVlIiwib2xkTWF4VmFsdWUiLCJudW1iZXJGb3JtYXQiLCJoYW5kbGVMaXN0RmlsdGVycyIsIm5hdGl2ZUlucHV0cyIsImN1c3RvbVJhZGlvU2VsZWN0b3IiLCJub3QiLCJwcm9wIiwiaGFuZGxlRHJvcGRvd25GaWx0ZXJzIiwiaGFuZGxlUGFnaW5hdGlvbiIsImhhbmRsZURlZmF1bHRPcmRlcmJ5IiwiVVJMIiwic2VhcmNoUGFyYW1zIiwiZ2V0T3JkZXJCeVVybCIsImhhbmRsZVJlc2V0RmlsdGVycyIsImNvbnNvbGUiLCJsb2ciLCJoYW5kbGVDbGVhckZpbHRlciIsImhhbmRsZUZpbHRlclRvb2x0aXAiLCJ0aXBweSIsInVzZV90aXBweWpzIiwicGxhY2VtZW50IiwiY29udGVudCIsInJlZmVyZW5jZSIsImdldEF0dHJpYnV0ZSIsImFsbG93SFRNTCIsImluaXRDb21ib2JveCIsImNob3NlbldDQVBGIiwibm9fcmVzdWx0c190ZXh0IiwiY2hvc2VuX25vX3Jlc3VsdHNfdGV4dCIsIm9wdGlvbnNfbm9uZV90ZXh0IiwiY2hvc2VuX29wdGlvbnNfbm9uZV90ZXh0IiwiY2hvc2VuX2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucyIsImRpc2FibGVTZWFyY2giLCJzZWFyY2hfYm94X2luX2RlZmF1bHRfb3JkZXJieSIsImluaXRSYW5nZVNsaWRlciIsIl9taW5WYWx1ZSIsIl9tYXhWYWx1ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJzdGF0ZSIsImhhc093blByb3BlcnR5Iiwic2Nyb2xsUmVzdG9yYXRpb24iLCJwYWdlZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsWUFBWSxHQUFHQSxZQUFZLElBQUk7QUFDcEMsWUFBVSxFQUQwQjtBQUVwQyx3QkFBc0IsRUFGYztBQUdwQyxxQ0FBbUMsRUFIQztBQUlwQyw0QkFBMEIsRUFKVTtBQUtwQyw4QkFBNEIsRUFMUTtBQU1wQyxtQ0FBaUMsRUFORztBQU9wQyxpQ0FBK0IsRUFQSztBQU9EO0FBQ25DLHdDQUFzQyxFQVJGO0FBU3BDLCtCQUE2QixFQVRPO0FBVXBDLDJDQUF5QyxFQVZMO0FBV3BDLHNDQUFvQyxFQVhBO0FBWXBDLHVDQUFxQyxFQVpEO0FBYXBDLDhDQUE0QyxFQWJSO0FBY3BDLHlDQUF1QyxFQWRIO0FBZXBDLDBDQUF3QyxFQWZKO0FBZ0JwQyxtQ0FBaUMsRUFoQkc7QUFpQnBDLDZCQUEyQixFQWpCUztBQWtCcEMseUJBQXVCLEVBbEJhO0FBbUJwQywwQkFBd0IsRUFuQlk7QUFvQnBDLGtDQUFnQyxFQXBCSTtBQXFCcEMsZUFBYSxFQXJCdUI7QUFzQnBDLGlCQUFlLEVBdEJxQjtBQXVCcEMseUJBQXVCLEVBdkJhO0FBd0JwQyx5QkFBdUIsRUF4QmE7QUF5QnBDLGdDQUE4QixFQXpCTTtBQTBCcEMsMEJBQXdCLEVBMUJZO0FBMkJwQyxxQkFBbUIsRUEzQmlCO0FBNEJwQyw4QkFBNEIsRUE1QlE7QUE2QnBDLHVCQUFxQixFQTdCZTtBQThCcEMsbUJBQWlCLEVBOUJtQjtBQStCcEMsdUJBQXFCLEVBL0JlO0FBZ0NwQyx3QkFBc0IsRUFoQ2M7QUFpQ3BDLGtDQUFnQyxFQWpDSTtBQWtDcEMsMEJBQXdCLEVBbENZO0FBbUNwQyw4QkFBNEIsRUFuQ1E7QUFvQ3BDLGlCQUFlO0FBcENxQixDQUFyQztBQXVDQUMsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtB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QXNDRSxJQUF0QyxDQUE0QyxHQUE1QyxDQUFWO0FBQ0E7O0FBRUQsU0FBT1IsQ0FBQyxDQUFDUSxJQUFGLENBQVFULEdBQVIsQ0FBUDtBQUNBOztBQUVELFNBQVMrSyxRQUFULENBQW1CcEksR0FBbkIsRUFBeUI7QUFDeEIsU0FBT0EsR0FBRyxDQUFDbEQsT0FBSixDQUFhLE1BQWIsRUFBcUIsR0FBckIsQ0FBUDtBQUNBOztBQUVELFNBQVM0UixhQUFULENBQXdCMU8sR0FBeEIsRUFBOEI7QUFDN0IsTUFBTXVRLEtBQUssR0FBRzlXLFFBQVEsQ0FBRXVHLEdBQUcsQ0FBQ2xELE9BQUosQ0FBYSxrQkFBYixFQUFpQyxJQUFqQyxDQUFGLENBQXRCOztBQUVBLE1BQUt5VCxLQUFMLEVBQWE7QUFDWnZRLElBQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDbEQsT0FBSixDQUFhLGVBQWIsRUFBOEIsRUFBOUIsQ0FBTjtBQUNBOztBQUVELFNBQU9zTCxRQUFRLENBQUVwSSxHQUFGLENBQWY7QUFDQSIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLXB1YmxpYy1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgZnJvbnRlbmQgZmlsdGVyIGZvcm0uXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvcHVibGljL3NyYy9qc1xuICogQGF1dGhvciAgICAgd3B0b29scy5pb1xuICovXG5cbmNvbnN0IHdjYXBmX3BhcmFtcyA9IHdjYXBmX3BhcmFtcyB8fCB7XG5cdCdpc19ydGwnOiAnJyxcblx0J2ZpbHRlcl9pbnB1dF9kZWxheSc6ICcnLFxuXHQnY2hvc2VuX2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucyc6ICcnLFxuXHQnY2hvc2VuX25vX3Jlc3VsdHNfdGV4dCc6ICcnLFxuXHQnY2hvc2VuX29wdGlvbnNfbm9uZV90ZXh0JzogJycsXG5cdCdzZWFyY2hfYm94X2luX2RlZmF1bHRfb3JkZXJieSc6ICcnLFxuXHQnY2hvc2VuX2xpYl9zZWFyY2hfdGhyZXNob2xkJzogJycsIC8vIHRvZG9cblx0J3ByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUnOiAnJyxcblx0J3ByZXNlcnZlX3NvZnRfbGltaXRfc3RhdGUnOiAnJyxcblx0J2VuYWJsZV9hbmltYXRpb25fZm9yX2ZpbHRlcl9hY2NvcmRpb24nOiAnJyxcblx0J2ZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkJzogJycsXG5cdCdmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmcnOiAnJyxcblx0J2VuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24nOiAnJyxcblx0J2hpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkJzogJycsXG5cdCdoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmcnOiAnJyxcblx0J3Jlc3RvcmVfZm9jdXNfYWZ0ZXJfZmlsdGVyaW5nJzogJycsXG5cdCdsb2FkaW5nX292ZXJsYXlfb3B0aW9ucyc6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9zcGVlZCc6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9lYXNpbmcnOiAnJyxcblx0J2ltbWVkaWF0ZV9zY3JvbGxfb25fcGFnaW5hdGUnOiAnJyxcblx0J2lzX21vYmlsZSc6ICcnLFxuXHQndXNlX3RpcHB5anMnOiAnJyxcblx0J3Nob3BfbG9vcF9jb250YWluZXInOiAnJyxcblx0J25vdF9mb3VuZF9jb250YWluZXInOiAnJyxcblx0J2VuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4JzogJycsXG5cdCdwYWdpbmF0aW9uX2NvbnRhaW5lcic6ICcnLFxuXHQnc29ydGluZ19jb250cm9sJzogJycsXG5cdCdhdHRhY2hfY2hvc2VuX29uX3NvcnRpbmcnOiAnJyxcblx0J2xvYWRpbmdfYW5pbWF0aW9uJzogJycsXG5cdCdzY3JvbGxfd2luZG93JzogJycsXG5cdCdzY3JvbGxfd2luZG93X2Zvcic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd193aGVuJzogJycsXG5cdCdzY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50JzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX29mZnNldCc6ICcnLFxuXHQnZGlzYWJsZV9zY3JvbGxfYW5pbWF0aW9uJzogJycsXG5cdCdmb3JfcHJldmlldyc6ICcnLFxufTtcblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRyZXR1cm47XG5cblx0Y29uc3QgJGJvZHkgPSAkKCAnYm9keScgKTtcblxuXHRjb25zdCByYW5nZVZhbHVlc1NlcGFyYXRvciA9ICd+JztcblxuXHRjb25zdCBfZGVsYXkgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLmZpbHRlcl9pbnB1dF9kZWxheSApO1xuXHRjb25zdCBkZWxheSAgPSBfZGVsYXkgPj0gMCA/IF9kZWxheSA6IDgwMDtcblxuXHQvLyBTdG9yZSBmaWVsZHMnIGlkIGFuZCBmaWx0ZXIgaW5mb3JtYXRpb24uXG5cdGNvbnN0IGZpZWxkcyA9IHt9O1xuXG5cdGNvbnN0IHdjYXBmU2luZ2xlRmlsdGVyU2VsZWN0b3IgICAgICA9ICcud2NhcGYtc2luZ2xlLWZpbHRlcic7XG5cdGNvbnN0IHdjYXBmTmF2RmlsdGVyU2VsZWN0b3IgICAgICAgICA9ICcud2NhcGYtbmF2LWZpbHRlcic7XG5cdGNvbnN0IHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJTZWxlY3RvciA9ICcud2NhcGYtbnVtYmVyLXJhbmdlLWZpbHRlcic7XG5cdGNvbnN0IHdjYXBmRGF0ZUZpbHRlclNlbGVjdG9yICAgICAgICA9ICcud2NhcGYtZGF0ZS1yYW5nZS1maWx0ZXInO1xuXG5cdGNvbnN0ICR3Y2FwZlNpbmdsZUZpbHRlcnMgICAgICA9ICQoIHdjYXBmU2luZ2xlRmlsdGVyU2VsZWN0b3IgKTtcblx0Y29uc3QgJHdjYXBmTmF2RmlsdGVycyAgICAgICAgID0gJCggd2NhcGZOYXZGaWx0ZXJTZWxlY3RvciApO1xuXHRjb25zdCAkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMgPSAkKCB3Y2FwZk51bWJlclJhbmdlRmlsdGVyU2VsZWN0b3IgKTtcblx0Y29uc3QgJHdjYXBmRGF0ZUZpbHRlcnMgICAgICAgID0gJCggd2NhcGZEYXRlRmlsdGVyU2VsZWN0b3IgKTtcblxuXHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGlkICAgICAgICAgICAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdGNvbnN0ICR3cmFwcGVyICAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZmllbGQtaW5uZXIgPiBkaXYnICk7XG5cdFx0Y29uc3QgZmlsdGVyS2V5ICAgICAgPSAkd3JhcHBlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdGNvbnN0IG11bHRpcGxlRmlsdGVyID0gcGFyc2VJbnQoICR3cmFwcGVyLmF0dHIoICdkYXRhLW11bHRpcGxlLWZpbHRlcicgKSApO1xuXG5cdFx0ZmllbGRzWyBpZCBdID0ge1xuXHRcdFx0ZmlsdGVyS2V5OiBmaWx0ZXJLZXksXG5cdFx0XHRtdWx0aXBsZUZpbHRlcjogbXVsdGlwbGVGaWx0ZXJcblx0XHR9O1xuXHR9ICk7XG5cblx0Ly8gSW5pdGlhbGl6ZSBqUXVlcnkgY2hvc2VuIGxpYnJhcnkuXG5cdGZ1bmN0aW9uIGluaXRDaG9zZW4oKSB7XG5cdFx0aWYgKCAhIGpRdWVyeSgpLmNob3NlbiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgJHJvb3Q7XG5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5mb3JfcHJldmlldyApIHtcblx0XHRcdCRyb290ID0gJCggd2NhcGZOYXZGaWx0ZXJTZWxlY3RvciApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkcm9vdCA9ICR3Y2FwZk5hdkZpbHRlcnM7XG5cdFx0fVxuXG5cdFx0JHJvb3QuZmluZCggJy53Y2FwZi1jaG9zZW4tc2VsZWN0JyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgICA9ICQoIHRoaXMgKTtcblx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7XG5cdFx0XHRcdGluaGVyaXRfc2VsZWN0X2NsYXNzZXM6IHRydWUsXG5cdFx0XHRcdGluaGVyaXRfb3B0aW9uX2NsYXNzZXM6IHRydWUsXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5pc19ydGwgKSB7XG5cdFx0XHRcdG9wdGlvbnNbICdydGwnIF0gPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBub1Jlc3VsdHNNZXNzYWdlID0gJHRoaXMuYXR0ciggJ2RhdGEtbm8tcmVzdWx0cy1tZXNzYWdlJyApO1xuXG5cdFx0XHRpZiAoIG5vUmVzdWx0c01lc3NhZ2UgKSB7XG5cdFx0XHRcdG9wdGlvbnNbICdub19yZXN1bHRzX3RleHQnIF0gPSBub1Jlc3VsdHNNZXNzYWdlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBvcHRpb25zWyAnZGlzYWJsZV9zZWFyY2gnIF0gPSB0cnVlO1xuXG5cdFx0XHRjb25zdCBzZWFyY2hUaHJlc2hvbGQgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLmNob3Nlbl9saWJfc2VhcmNoX3RocmVzaG9sZCApO1xuXG5cdFx0XHRpZiAoIHNlYXJjaFRocmVzaG9sZCApIHtcblx0XHRcdFx0Ly8gb3B0aW9uc1sgJ2Rpc2FibGVfc2VhcmNoX3RocmVzaG9sZCcgXSA9IHNlYXJjaFRocmVzaG9sZDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gb3B0aW9uc1sgJ2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucycgXSA9IGZhbHNlO1xuXG5cdFx0XHQvLyBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogMjBcblxuXHRcdFx0Ly8gb3B0aW9uc1snbWluaW11bVJlc3VsdHNGb3JTZWFyY2gnXSA9IC0xO1xuXG5cdFx0XHQkdGhpcy5jaG9zZW4oIG9wdGlvbnMgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRpbml0Q2hvc2VuKCk7XG5cblx0Ly8gSW5pdGlhbGl6ZSBoaWVyYXJjaHkgYWNjb3JkaW9uLlxuXHRmdW5jdGlvbiBpbml0SGllcmFyY2h5QWNjb3JkaW9uKCkge1xuXHRcdGxldCAkcm9vdDtcblxuXHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0JHJvb3QgPSAkKCB3Y2FwZk5hdkZpbHRlclNlbGVjdG9yICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRyb290ID0gJHdjYXBmTmF2RmlsdGVycztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVBY2NvcmRpb24oICRlbCApIHtcblx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYnV0dG9uIGlzIHByZXNzZWRcblx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHQvLyBDaGFuZ2UgYXJpYS1wcmVzc2VkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuXHRcdFx0JGVsLmF0dHIoICdhcmlhLXByZXNzZWQnLCAhIHByZXNzZWQgKTtcblxuXHRcdFx0Y29uc3QgJGNoaWxkID0gJGVsLmNsb3Nlc3QoICdsaScgKS5jaGlsZHJlbiggJ3VsJyApO1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uICkge1xuXHRcdFx0XHQkY2hpbGQuc2xpZGVUb2dnbGUoXG5cdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkLFxuXHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5oaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmdcblx0XHRcdFx0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRjaGlsZC50b2dnbGUoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQkcm9vdC5maW5kKCAnLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJyApLm9uKCAnY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0fSApO1xuXG5cdFx0JHJvb3QuZmluZCggJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScgKS5vbiggJ2tleWRvd24nLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGlmICggZS5rZXkgPT09ICcgJyB8fCBlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJ1NwYWNlYmFyJyApIHtcblx0XHRcdFx0Ly8gUHJldmVudCB0aGUgZGVmYXVsdCBhY3Rpb24gdG8gc3RvcCBzY3JvbGxpbmcgd2hlbiBzcGFjZSBpcyBwcmVzc2VkXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKTtcblxuXHQvKipcblx0ICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzQxNDE4MTNcblx0ICpcblx0ICogQHBhcmFtIG51bWJlclxuXHQgKiBAcGFyYW0gZGVjaW1hbHNcblx0ICogQHBhcmFtIGRlY19wb2ludFxuXHQgKiBAcGFyYW0gdGhvdXNhbmRzX3NlcFxuXHQgKlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfVxuXHQgKi9cblx0ZnVuY3Rpb24gbnVtYmVyX2Zvcm1hdCggbnVtYmVyLCBkZWNpbWFscywgZGVjX3BvaW50LCB0aG91c2FuZHNfc2VwICkge1xuXHRcdC8vIFN0cmlwIGFsbCBjaGFyYWN0ZXJzIGJ1dCBudW1lcmljYWwgb25lcy5cblx0XHRudW1iZXIgPSAoIG51bWJlciArICcnICkucmVwbGFjZSggL1teXFxkK1xcLUVlLl0vZywgJycgKTtcblxuXHRcdGNvbnN0IG4gICAgPSAhIGlzRmluaXRlKCArbnVtYmVyICkgPyAwIDogK251bWJlcjtcblx0XHRjb25zdCBwcmVjID0gISBpc0Zpbml0ZSggK2RlY2ltYWxzICkgPyAwIDogTWF0aC5hYnMoIGRlY2ltYWxzICk7XG5cdFx0Y29uc3Qgc2VwICA9ICggdHlwZW9mIHRob3VzYW5kc19zZXAgPT09ICd1bmRlZmluZWQnICkgPyAnLCcgOiB0aG91c2FuZHNfc2VwO1xuXHRcdGNvbnN0IGRlYyAgPSAoIHR5cGVvZiBkZWNfcG9pbnQgPT09ICd1bmRlZmluZWQnICkgPyAnLicgOiBkZWNfcG9pbnQ7XG5cblx0XHRsZXQgcztcblxuXHRcdGNvbnN0IHRvRml4ZWRGaXggPSBmdW5jdGlvbiggbiwgcHJlYyApIHtcblx0XHRcdGNvbnN0IGsgPSBNYXRoLnBvdyggMTAsIHByZWMgKTtcblx0XHRcdHJldHVybiAnJyArIE1hdGgucm91bmQoIG4gKiBrICkgLyBrO1xuXHRcdH07XG5cblx0XHQvLyBGaXggZm9yIElFIHBhcnNlRmxvYXQoMC41NSkudG9GaXhlZCgwKSA9IDA7XG5cdFx0cyA9ICggcHJlYyA/IHRvRml4ZWRGaXgoIG4sIHByZWMgKSA6ICcnICsgTWF0aC5yb3VuZCggbiApICkuc3BsaXQoICcuJyApO1xuXG5cdFx0aWYgKCBzWyAwIF0ubGVuZ3RoID4gMyApIHtcblx0XHRcdHNbIDAgXSA9IHNbIDAgXS5yZXBsYWNlKCAvXFxCKD89KD86XFxkezN9KSsoPyFcXGQpKS9nLCBzZXAgKTtcblx0XHR9XG5cblx0XHRpZiAoICggc1sgMSBdIHx8ICcnICkubGVuZ3RoIDwgcHJlYyApIHtcblx0XHRcdHNbIDEgXSA9IHNbIDEgXSB8fCAnJztcblx0XHRcdHNbIDEgXSArPSBuZXcgQXJyYXkoIHByZWMgLSBzWyAxIF0ubGVuZ3RoICsgMSApLmpvaW4oICcwJyApO1xuXHRcdH1cblxuXHRcdHJldHVybiBzLmpvaW4oIGRlYyApO1xuXHR9XG5cblx0Ly8gSW5pdGlhbGl6ZSBub1VJU2xpZGVyLlxuXHRmdW5jdGlvbiBpbml0Tm9VSVNsaWRlcigpIHtcblx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgJHJvb3Q7XG5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5mb3JfcHJldmlldyApIHtcblx0XHRcdCRyb290ID0gJCggd2NhcGZOdW1iZXJSYW5nZUZpbHRlclNlbGVjdG9yICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRyb290ID0gJHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzO1xuXHRcdH1cblxuXHRcdCRyb290LmZpbmQoICcud2NhcGYtcmFuZ2Utc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdC8vIFRPRE86IFJlbW92ZSBmaWx0ZXIga2V5LlxuXHRcdFx0Y29uc3QgZmlsdGVyS2V5ID0gJGl0ZW0uYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRcdGNvbnN0ICRzbGlkZXIgICA9ICRpdGVtLmZpbmQoICcud2NhcGYtbm91aS1zbGlkZXInICk7XG5cblx0XHRcdC8vIElmIHNsaWRlciBpcyBhbHJlYWR5IGluaXRpYWxpemVkIHRoZW4gZG9uJ3QgcmVpbml0aWFsaXplIGFnYWluLlxuXHRcdFx0aWYgKCAkc2xpZGVyLmhhc0NsYXNzKCAnd2NhcGYtbm91aS10YXJnZXQnICkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc2xpZGVySWQgICAgICAgICAgPSAkc2xpZGVyLmF0dHIoICdpZCcgKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlWYWx1ZXNBcyAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGlzcGxheS12YWx1ZXMtYXMnICk7XG5cdFx0XHRjb25zdCBmb3JtYXROdW1iZXJzICAgICA9ICRpdGVtLmF0dHIoICdkYXRhLWZvcm1hdC1udW1iZXJzJyApO1xuXHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICkgKTtcblx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRjb25zdCBzdGVwICAgICAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXN0ZXAnICkgKTtcblx0XHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1wbGFjZXMnICk7XG5cdFx0XHRjb25zdCB0aG91c2FuZFNlcGFyYXRvciA9ICRpdGVtLmF0dHIoICdkYXRhLXRob3VzYW5kLXNlcGFyYXRvcicgKTtcblx0XHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1zZXBhcmF0b3InICk7XG5cdFx0XHRjb25zdCBtaW5WYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0Y29uc3QgbWF4VmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdGNvbnN0ICRtaW5WYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5taW4tdmFsdWUnICk7XG5cdFx0XHRjb25zdCAkbWF4VmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWF4LXZhbHVlJyApO1xuXG5cdFx0XHRjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggc2xpZGVySWQgKTtcblxuXHRcdFx0bm9VaVNsaWRlci5jcmVhdGUoIHNsaWRlciwge1xuXHRcdFx0XHRzdGFydDogWyBtaW5WYWx1ZSwgbWF4VmFsdWUgXSxcblx0XHRcdFx0c3RlcCxcblx0XHRcdFx0Y29ubmVjdDogdHJ1ZSxcblx0XHRcdFx0Y3NzUHJlZml4OiAnd2NhcGYtbm91aS0nLFxuXHRcdFx0XHRyYW5nZToge1xuXHRcdFx0XHRcdCdtaW4nOiByYW5nZU1pblZhbHVlLFxuXHRcdFx0XHRcdCdtYXgnOiByYW5nZU1heFZhbHVlLFxuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAndXBkYXRlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0bGV0IG1pblZhbHVlO1xuXHRcdFx0XHRsZXQgbWF4VmFsdWU7XG5cblx0XHRcdFx0aWYgKCBmb3JtYXROdW1iZXJzICkge1xuXHRcdFx0XHRcdG1pblZhbHVlID0gbnVtYmVyX2Zvcm1hdCggdmFsdWVzWyAwIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0bWF4VmFsdWUgPSBudW1iZXJfZm9ybWF0KCB2YWx1ZXNbIDEgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0bWF4VmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDEgXSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCAncGxhaW5fdGV4dCcgPT09IGRpc3BsYXlWYWx1ZXNBcyApIHtcblx0XHRcdFx0XHQkbWluVmFsdWUuaHRtbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHQkbWF4VmFsdWUuaHRtbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkbWluVmFsdWUudmFsKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdCRtYXhWYWx1ZS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGYtbm91aXNsaWRlci11cGRhdGUnLCBbICRpdGVtLCB2YWx1ZXMgXSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRmdW5jdGlvbiBmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAwIF0gKTtcblx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDEgXSApO1xuXG5cdFx0XHRcdGlmICggbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0Ly8gUmVtb3ZlIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRyZXF1ZXN0RmlsdGVyKCAkaXRlbS5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIEFkZCByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0Y29uc3QgdXJsID0gJGl0ZW0uZGF0YSggJ3VybCcgKS5yZXBsYWNlKCAnJTFzJywgbWluVmFsdWUgKS5yZXBsYWNlKCAnJTJzJywgbWF4VmFsdWUgKTtcblx0XHRcdFx0XHRyZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpdGVtLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApO1xuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdCRtaW5WYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBtaW5WYWx1ZSwgbnVsbCBdICk7XG5cblx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdCRtYXhWYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBudWxsLCBtYXhWYWx1ZSBdICk7XG5cblx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdE5vVUlTbGlkZXIoKTtcblxuXHRmdW5jdGlvbiBmaWx0ZXJCeURhdGUoICRpbnB1dCApIHtcblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5mb3JfcHJldmlldyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCAkd2NhcGZEYXRlRmlsdGVyID0gJGlucHV0LmNsb3Nlc3QoICcud2NhcGYtZGF0ZS1pbnB1dCcgKTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdGNvbnN0IGlzUmFuZ2UgICAgICAgICAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWlzLXJhbmdlJyApO1xuXG5cdFx0bGV0IGZpbHRlclZhbHVlID0gJyc7XG5cdFx0bGV0IHJ1bkZpbHRlciAgID0gZmFsc2U7XG5cblx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRjbGVhclRpbWVvdXQoICR3Y2FwZkRhdGVGaWx0ZXIuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRpZiAoIGlzUmFuZ2UgKSB7XG5cdFx0XHRjb25zdCBmcm9tID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKS52YWwoKTtcblx0XHRcdGNvbnN0IHRvICAgPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCBmcm9tICYmIHRvICkge1xuXHRcdFx0XHRmaWx0ZXJWYWx1ZSA9IGZyb20gKyByYW5nZVZhbHVlc1NlcGFyYXRvciArIHRvO1xuXHRcdFx0XHRydW5GaWx0ZXIgICA9IHRydWU7XG5cdFx0XHR9IGVsc2UgaWYgKCAhIGZyb20gJiYgISB0byApIHtcblx0XHRcdFx0cnVuRmlsdGVyID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgZnJvbSA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICkudmFsKCk7XG5cblx0XHRcdGlmICggZnJvbSApIHtcblx0XHRcdFx0ZmlsdGVyVmFsdWUgPSBmcm9tO1xuXHRcdFx0XHRydW5GaWx0ZXIgICA9IHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRydW5GaWx0ZXIgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICggcnVuRmlsdGVyICkge1xuXHRcdFx0JHdjYXBmRGF0ZUZpbHRlci5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JHdjYXBmRGF0ZUZpbHRlci5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0aWYgKCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRcdFx0XHR1cGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGluaXREYXRlcGlja2VyKCkge1xuXHRcdGlmICggISBqUXVlcnkoKS5kYXRlcGlja2VyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCAkcm9vdDtcblxuXHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0JHJvb3QgPSAkKCB3Y2FwZkRhdGVGaWx0ZXJTZWxlY3RvciApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkcm9vdCA9ICR3Y2FwZkRhdGVGaWx0ZXJzO1xuXHRcdH1cblxuXHRcdGNvbnN0ICR3Y2FwZkRhdGVGaWx0ZXIgPSAkcm9vdC5maW5kKCAnLndjYXBmLWRhdGUtaW5wdXQnICk7XG5cblx0XHRjb25zdCBmb3JtYXQgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLWZvcm1hdCcgKTtcblx0XHRjb25zdCB5ZWFyRHJvcGRvd24gID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLXBpY2tlci15ZWFyLWRyb3Bkb3duJyApO1xuXHRcdGNvbnN0IG1vbnRoRHJvcGRvd24gPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtcGlja2VyLW1vbnRoLWRyb3Bkb3duJyApO1xuXG5cdFx0Y29uc3QgJGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApO1xuXHRcdGNvbnN0ICR0byAgID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtdG8taW5wdXQnICk7XG5cblx0XHQkZnJvbS5kYXRlcGlja2VyKCB7XG5cdFx0XHRkYXRlRm9ybWF0OiBmb3JtYXQsXG5cdFx0XHRjaGFuZ2VZZWFyOiB5ZWFyRHJvcGRvd24sXG5cdFx0XHRjaGFuZ2VNb250aDogbW9udGhEcm9wZG93bixcblx0XHR9ICk7XG5cblx0XHQkdG8uZGF0ZXBpY2tlcigge1xuXHRcdFx0ZGF0ZUZvcm1hdDogZm9ybWF0LFxuXHRcdFx0Y2hhbmdlWWVhcjogeWVhckRyb3Bkb3duLFxuXHRcdFx0Y2hhbmdlTW9udGg6IG1vbnRoRHJvcGRvd24sXG5cdFx0fSApO1xuXG5cdFx0JGZyb20ub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblx0XHRcdGZpbHRlckJ5RGF0ZSggJGlucHV0ICk7XG5cdFx0fSApO1xuXG5cdFx0JHRvLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRmaWx0ZXJCeURhdGUoICRpbnB1dCApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGluaXREYXRlcGlja2VyKCk7XG5cblx0ZnVuY3Rpb24gaW5pdERlZmF1bHRPcmRlckJ5KCkge1xuXHRcdC8vIEF0dGFjaCBjaG9zZW4uXG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuYXR0YWNoX2Nob3Nlbl9vbl9zb3J0aW5nICkge1xuXHRcdFx0aWYgKCBqUXVlcnkoKS5jaG9zZW4gKSB7XG5cdFx0XHRcdCRib2R5LmZpbmQoICcud29vY29tbWVyY2Utb3JkZXJpbmcgc2VsZWN0Lm9yZGVyYnknICkuY2hvc2VuKCB7XG5cdFx0XHRcdFx0J2Rpc2FibGVfc2VhcmNoX3RocmVzaG9sZCc6IDE1LFxuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5zb3J0aW5nX2NvbnRyb2wgKSB7XG5cdFx0XHQkYm9keS5maW5kKCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkb3JkZXJpbmdGb3JtID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdCRvcmRlcmluZ0Zvcm0ub24oICdjaGFuZ2UnLCAnc2VsZWN0Lm9yZGVyYnknLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkb3JkZXJpbmdGb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyB0b2RvOiBjaGVjayBpZiBhamF4IGRpc2FibGVkLlxuXHRcdCRib2R5LmZpbmQoICcud29vY29tbWVyY2Utb3JkZXJpbmcnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkb3JkZXJpbmdGb3JtID0gJCggdGhpcyApO1xuXG5cdFx0XHQkb3JkZXJpbmdGb3JtLm9uKCAnc3VibWl0JywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JG9yZGVyaW5nRm9ybS5vbiggJ2NoYW5nZScsICdzZWxlY3Qub3JkZXJieScsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3Qgb3JkZXIgICAgICA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyX2tleSA9ICdvcmRlcmJ5JztcblxuXHRcdFx0XHR1cGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyX2tleSwgb3JkZXIgKTtcblx0XHRcdFx0ZmlsdGVyUHJvZHVjdHMoKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cblxuXHRpbml0RGVmYXVsdE9yZGVyQnkoKTtcblxuXHRmdW5jdGlvbiB1cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0KCAkcmVzdWx0cyApIHtcblx0XHRjb25zdCBzZWxlY3RvciA9ICcud29vY29tbWVyY2UtcmVzdWx0LWNvdW50JztcblxuXHRcdGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5maW5kKCBzZWxlY3RvciApLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBuZXdQcm9kdWN0Q291bnQgPSAkcmVzdWx0cy5maW5kKCBzZWxlY3RvciApLmh0bWwoKTtcblxuXHRcdCRib2R5LmZpbmQoIHNlbGVjdG9yICkuaHRtbCggbmV3UHJvZHVjdENvdW50ICk7XG5cdH1cblxuXHRmdW5jdGlvbiBzaG93TG9hZGluZ0FuaW1hdGlvbigpIHtcblx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLmxvYWRpbmdfYW5pbWF0aW9uICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCQuTG9hZGluZ092ZXJsYXkoICdzaG93Jywgd2NhcGZfcGFyYW1zLmxvYWRpbmdfb3ZlcmxheV9vcHRpb25zICk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNhYmxlTm9VaVNsaWRlcnMoKSB7XG5cdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG5vVWlTbGlkZXIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzLmZpbmQoICcud2NhcGYtbm91aS1zbGlkZXInICkuZWFjaCggZnVuY3Rpb24oIGUsIGVsZW1lbnQgKSB7XG5cdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZSggJ2Rpc2FibGVkJywgdHJ1ZSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGRpc2FibGVMYWJlbHMoKSB7XG5cdFx0Y29uc3Qgc2VsZWN0b3JzID0gJy53Y2FwZi1sYWJlbGVkLW5hdiAuaXRlbSwgLndjYXBmLWFjdGl2ZS1maWx0ZXJzIC5pdGVtJztcblxuXHRcdC8vIFRPRE86IEFkZCBkaXNhYmxlZCBhdHRyaWJ1dGUuXG5cdFx0JHdjYXBmU2luZ2xlRmlsdGVycy5maW5kKCBzZWxlY3RvcnMgKS5hZGRDbGFzcyggJ2Rpc2FibGVkJyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzYWJsZUlucHV0cygpIHtcblx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLmRpc2FibGVfaW5wdXRzX3doaWxlX2ZldGNoaW5nX3Jlc3VsdHMgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgaW5wdXRzID0gJ2lucHV0LCBzZWxlY3QnO1xuXG5cdFx0JHdjYXBmU2luZ2xlRmlsdGVycy5maW5kKCBpbnB1dHMgKS5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0JHdjYXBmU2luZ2xlRmlsdGVycy5maW5kKCBpbnB1dHMgKS50cmlnZ2VyKCAnY2hvc2VuOnVwZGF0ZWQnICk7XG5cblx0XHRkaXNhYmxlTm9VaVNsaWRlcnMoKTtcblx0XHRkaXNhYmxlTGFiZWxzKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBlbmFibGVOb1VpU2xpZGVycygpIHtcblx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMuZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbiggZSwgZWxlbWVudCApIHtcblx0XHRcdGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCAnZGlzYWJsZWQnICk7XG5cdFx0fSApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZW5hYmxlSW5wdXRzKCkge1xuXHRcdGlmICggISB3Y2FwZl9wYXJhbXMuZGlzYWJsZV9pbnB1dHNfd2hpbGVfZmV0Y2hpbmdfcmVzdWx0cyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpbnB1dHMgPSAnaW5wdXQnO1xuXG5cdFx0JHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzLmZpbmQoIGlucHV0cyApLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHQkd2NhcGZEYXRlRmlsdGVycy5maW5kKCBpbnB1dHMgKS5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cblx0XHRlbmFibGVOb1VpU2xpZGVycygpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVzZXRMb2FkaW5nQW5pbWF0aW9uKCkge1xuXHRcdGlmICggISB3Y2FwZl9wYXJhbXMubG9hZGluZ19hbmltYXRpb24gKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JC5Mb2FkaW5nT3ZlcmxheSggJ2hpZGUnICk7XG5cdH1cblxuXHRmdW5jdGlvbiBzY3JvbGxUbygpIHtcblx0XHRpZiAoICdub25lJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3Qgc2Nyb2xsRm9yID0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfZm9yO1xuXHRcdGNvbnN0IGlzTW9iaWxlICA9IHdjYXBmX3BhcmFtcy5pc19tb2JpbGU7XG5cdFx0bGV0IHByb2NlZWQgICAgID0gZmFsc2U7XG5cblx0XHRpZiAoICdtb2JpbGUnID09PSBzY3JvbGxGb3IgJiYgaXNNb2JpbGUgKSB7XG5cdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKCAnZGVza3RvcCcgPT09IHNjcm9sbEZvciAmJiAhIGlzTW9iaWxlICkge1xuXHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0fSBlbHNlIGlmICggJ2JvdGgnID09PSBzY3JvbGxGb3IgKSB7XG5cdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAoICEgcHJvY2VlZCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgYWRqdXN0aW5nT2Zmc2V0LCBvZmZzZXQ7XG5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX29mZnNldCApIHtcblx0XHRcdGFkanVzdGluZ09mZnNldCA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKTtcblx0XHR9XG5cblx0XHRsZXQgY29udGFpbmVyO1xuXG5cdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdGNvbnRhaW5lciA9IHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyO1xuXHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXI7XG5cdFx0fVxuXG5cdFx0aWYgKCAnY3VzdG9tJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudDtcblx0XHR9XG5cblx0XHRjb25zdCAkY29udGFpbmVyID0gJCggY29udGFpbmVyICk7XG5cblx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0b2Zmc2V0ID0gJGNvbnRhaW5lci5vZmZzZXQoKS50b3AgLSBhZGp1c3RpbmdPZmZzZXQ7XG5cblx0XHRcdGlmICggb2Zmc2V0IDwgMCApIHtcblx0XHRcdFx0b2Zmc2V0ID0gMDtcblx0XHRcdH1cblxuXHRcdFx0JCggJ2h0bWwsIGJvZHknICkuc3RvcCgpLmFuaW1hdGUoXG5cdFx0XHRcdHsgc2Nyb2xsVG9wOiBvZmZzZXQgfSxcblx0XHRcdFx0d2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfc3BlZWQsXG5cdFx0XHRcdHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX2Vhc2luZ1xuXHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHQvLyBUaGluZ3MgYXJlIGRvbmUgYmVmb3JlIGZldGNoaW5nIHRoZSBwcm9kdWN0cyBsaWtlIHNob3dpbmcgYSBsb2FkaW5nIGluZGljYXRvci5cblx0ZnVuY3Rpb24gYmVmb3JlRmV0Y2hpbmdQcm9kdWN0cygpIHtcblx0XHRkaXNhYmxlSW5wdXRzKCk7XG5cdFx0c2hvd0xvYWRpbmdBbmltYXRpb24oKTtcblxuXHRcdGlmICggJ2ltbWVkaWF0ZWx5JyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfd2hlbiApIHtcblx0XHRcdHNjcm9sbFRvKCk7XG5cdFx0fVxuXG5cdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2JlZm9yZV9mZXRjaGluZ19wcm9kdWN0cycgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGJlZm9yZVVwZGF0aW5nUHJvZHVjdHMoICRyZXN1bHRzICkge1xuXHRcdHJlc2V0TG9hZGluZ0FuaW1hdGlvbigpO1xuXG5cdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2JlZm9yZV91cGRhdGluZ19wcm9kdWN0cycsIFsgJHJlc3VsdHMgXSApO1xuXHR9XG5cblx0Ly8gVGhpbmdzIGFyZSBkb25lIGFmdGVyIGFwcGx5aW5nIHRoZSBmaWx0ZXIgbGlrZSBzY3JvbGwgdG8gdG9wLlxuXHRmdW5jdGlvbiBhZnRlclVwZGF0aW5nUHJvZHVjdHMoICRyZXN1bHRzICkge1xuXHRcdGluaXRDaG9zZW4oKTtcblx0XHRpbml0SGllcmFyY2h5QWNjb3JkaW9uKCk7XG5cdFx0aW5pdE5vVUlTbGlkZXIoKTtcblx0XHRpbml0RGF0ZXBpY2tlcigpO1xuXHRcdGluaXREZWZhdWx0T3JkZXJCeSgpO1xuXHRcdHVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQoICRyZXN1bHRzICk7XG5cdFx0ZW5hYmxlSW5wdXRzKCk7XG5cblx0XHRpZiAoICdhZnRlcicgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X3doZW4gKSB7XG5cdFx0XHRzY3JvbGxUbygpO1xuXHRcdH1cblxuXHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9hZnRlcl91cGRhdGluZ19wcm9kdWN0cycsIFsgJHJlc3VsdHMgXSApO1xuXHR9XG5cblx0Ly8gVGhlIG1haW4gZmlsdGVyIGZ1bmN0aW9uLlxuXHRmdW5jdGlvbiBmaWx0ZXJQcm9kdWN0cyggZm9yY2VSZVJlbmRlciA9IGZhbHNlICkge1xuXHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGJlZm9yZUZldGNoaW5nUHJvZHVjdHMoKTtcblxuXHRcdCQuZ2V0KCB3aW5kb3cubG9jYXRpb24uaHJlZiwgZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRjb25zdCAkZGF0YSA9ICQoIGRhdGEgKTtcblxuXHRcdFx0Ly8gUmVwbGFjZSB0aGUgZmllbGRzJyBkYXRhIHdpdGggbmV3IGRhdGEuXG5cdFx0XHQkLmVhY2goIGZpZWxkcywgZnVuY3Rpb24oIGlkICkge1xuXHRcdFx0XHRjb25zdCBmaWVsZElEICAgID0gJ1tkYXRhLWlkPVwiJyArIGlkICsgJ1wiXSc7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkKCBmaWVsZElEICk7XG5cdFx0XHRcdGNvbnN0ICRpbm5lciAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1maWVsZC1pbm5lcicgKTtcblx0XHRcdFx0Y29uc3QgX2ZpZWxkICAgICA9ICRkYXRhLmZpbmQoIGZpZWxkSUQgKTtcblx0XHRcdFx0bGV0IGZpZWxkQ2xhc3NlcyA9ICQoIF9maWVsZCApLmF0dHIoICdjbGFzcycgKTtcblxuXHRcdFx0XHQvLyBQcmVzZXJ2ZSBoaWVyYXJjaHkgYWNjb3JkaW9uIHN0YXRlLlxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5wcmVzZXJ2ZV9oaWVyYXJjaHlfYWNjb3JkaW9uX3N0YXRlICkge1xuXHRcdFx0XHRcdGlmICggJGZpZWxkLmhhc0NsYXNzKCAnaGllcmFyY2h5LWFjY29yZGlvbicgKSApIHtcblx0XHRcdFx0XHRcdCRmaWVsZC5maW5kKCAnLmhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlLmFjdGl2ZScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgaXRlbVZhbHVlICAgICAgPSAkKCB0aGlzICkucGFyZW50KCkuY2hpbGRyZW4oICdpbnB1dCcgKS52YWwoKTtcblx0XHRcdFx0XHRcdFx0Y29uc3QgdG9nZ2xlU2VsZWN0b3IgPSAnaW5wdXRbdmFsdWU9XCInICsgaXRlbVZhbHVlICsgJ1wiXSB+IC5oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZSc7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHVsU2VsZWN0b3IgICAgID0gJ2lucHV0W3ZhbHVlPVwiJyArIGl0ZW1WYWx1ZSArICdcIl0gfiB1bCc7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IF9jbGFzc2VzICAgICAgID0gJ2hpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlIGFjdGl2ZSc7XG5cblx0XHRcdFx0XHRcdFx0X2ZpZWxkLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuYXR0ciggJ2NsYXNzJywgX2NsYXNzZXMgKTtcblx0XHRcdFx0XHRcdFx0X2ZpZWxkLmZpbmQoIHVsU2VsZWN0b3IgKS5zaG93KCk7XG5cdFx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgX2h0bWwgPSBfZmllbGQuZmluZCggJy53Y2FwZi1maWVsZC1pbm5lcicgKS5odG1sKCk7XG5cblx0XHRcdFx0Ly8gU2hvdyBzb2Z0IGxpbWl0IGl0ZW1zLlxuXHRcdFx0XHRjb25zdCBzb2Z0TGltaXRTZWxlY3RvciA9ICdzaG93LWhpZGRlbi1pdGVtcyc7XG5cblx0XHRcdFx0aWYgKCAkZmllbGQuaGFzQ2xhc3MoIHNvZnRMaW1pdFNlbGVjdG9yICkgKSB7XG5cdFx0XHRcdFx0aWYgKCAhIF9maWVsZC5oYXNDbGFzcyggc29mdExpbWl0U2VsZWN0b3IgKSApIHtcblx0XHRcdFx0XHRcdGZpZWxkQ2xhc3NlcyArPSAnICcgKyBzb2Z0TGltaXRTZWxlY3Rvcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZmllbGRDbGFzc2VzID0gZmllbGRDbGFzc2VzLnJlcGxhY2UoIHNvZnRMaW1pdFNlbGVjdG9yLCAnJyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBmaWVsZCdzIGNsYXNzLlxuXHRcdFx0XHQkZmllbGQuYXR0ciggJ2NsYXNzJywgZmllbGRDbGFzc2VzLnRyaW0oKSApO1xuXG5cdFx0XHRcdC8vIFdoZW4gY2FsbGVkIGZyb20gaGlzdG9yeSBiYWNrIG9yIGZvcndhcmQgcmVxdWVzdCB0aGVuIHJlcmVuZGVyIGFsbCBmaWVsZHMuXG5cdFx0XHRcdGlmICggZm9yY2VSZVJlbmRlciApIHtcblxuXHRcdFx0XHRcdC8vIHVwZGF0ZSBmaWVsZFxuXHRcdFx0XHRcdCRpbm5lci5odG1sKCBfaHRtbCApO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHQvLyBTZWxlY3RpdmVseSByZXJlbmRlciB0aGUgZmllbGRzLlxuXHRcdFx0XHRcdGlmICggJGZpZWxkLmhhc0NsYXNzKCAnd2NhcGYtbmF2LWZpbHRlcicgKSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gdXBkYXRlIGZpZWxkXG5cdFx0XHRcdFx0XHQkaW5uZXIuaHRtbCggX2h0bWwgKTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0JGZpZWxkLnRyaWdnZXIoICd3Y2FwZi1maWVsZC11cGRhdGVkJywgWyBfZmllbGQgXSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzKCAkZGF0YSApO1xuXG5cdFx0XHQvLyBSZXBsYWNlIG9sZCBzaG9wIGxvb3Agd2l0aCBuZXcgb25lLlxuXHRcdFx0Y29uc3QgJHNob3BMb29wQ29udGFpbmVyID0gJGRhdGEuZmluZCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdGNvbnN0ICRub3RGb3VuZENvbnRhaW5lciA9ICRkYXRhLmZpbmQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICk7XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgPT09IHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkge1xuXHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICggJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRhZnRlclVwZGF0aW5nUHJvZHVjdHMoICRkYXRhICk7XG5cdFx0fSApO1xuXHR9XG5cblx0Ly8gVVJMIFBhcnNlclxuXHRmdW5jdGlvbiBnZXRVcmxWYXJzKCB1cmwgKSB7XG5cdFx0bGV0IHZhcnMgPSB7fSwgaGFzaDtcblxuXHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHR1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHR9XG5cblx0XHR1cmwgPSB1cmwucmVwbGFjZUFsbCggJyUyQycsICcsJyApO1xuXG5cdFx0Y29uc3QgaGFzaGVzICA9IHVybC5zbGljZSggdXJsLmluZGV4T2YoICc/JyApICsgMSApLnNwbGl0KCAnJicgKTtcblx0XHRjb25zdCBoTGVuZ3RoID0gaGFzaGVzLmxlbmd0aDtcblxuXHRcdGZvciAoIGxldCBpID0gMDsgaSA8IGhMZW5ndGg7IGkrKyApIHtcblx0XHRcdGhhc2ggPSBoYXNoZXNbIGkgXS5zcGxpdCggJz0nICk7XG5cblx0XHRcdHZhcnNbIGhhc2hbIDAgXSBdID0gaGFzaFsgMSBdO1xuXHRcdH1cblxuXHRcdHJldHVybiB2YXJzO1xuXHR9XG5cblx0Ly8gZXZlcnl0aW1lIHdlIGFwcGx5IHRoZSBmaWx0ZXIgd2Ugc2V0IHRoZSBjdXJyZW50IHBhZ2UgdG8gMVxuXHRmdW5jdGlvbiBmaXhQYWdpbmF0aW9uKCkge1xuXHRcdGxldCB1cmwgICAgICAgICAgICAgICAgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRjb25zdCBwYXJhbXMgICAgICAgICAgID0gZ2V0VXJsVmFycyggdXJsICk7XG5cdFx0Y29uc3QgY3VycmVudFBhZ2VJblVybCA9IHBhcnNlSW50KCB1cmwucmVwbGFjZSggLy4rXFwvcGFnZVxcLyhcXGQrKSsvLCAnJDEnICkgKTtcblxuXHRcdGlmICggY3VycmVudFBhZ2VJblVybCApIHtcblx0XHRcdGlmICggY3VycmVudFBhZ2VJblVybCA+IDEgKSB7XG5cdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCAvcGFnZVxcLyhcXGQrKS8sICdwYWdlLzEnICk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICggdHlwZW9mIHBhcmFtc1sgJ3BhZ2VkJyBdICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdGNvbnN0IGN1cnJlbnRQYWdlSW5QYXJhbXMgPSBwYXJzZUludCggcGFyYW1zWyAncGFnZWQnIF0gKTtcblxuXHRcdFx0aWYgKCBjdXJyZW50UGFnZUluUGFyYW1zID4gMSApIHtcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoICdwYWdlZD0nICsgY3VycmVudFBhZ2VJblBhcmFtcywgJ3BhZ2VkPTEnICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHVybDtcblx0fVxuXG5cdC8vIHVwZGF0ZSBxdWVyeSBzdHJpbmcgZm9yIGNhdGVnb3JpZXMsIG1ldGEgZXRjLi5cblx0ZnVuY3Rpb24gdXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGtleSwgdmFsdWUsIHB1c2hIaXN0b3J5LCB1cmwgKSB7XG5cdFx0aWYgKCB0eXBlb2YgcHVzaEhpc3RvcnkgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0cHVzaEhpc3RvcnkgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHR1cmwgPSBmaXhQYWdpbmF0aW9uKCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmUgICAgICAgID0gbmV3IFJlZ0V4cCggJyhbPyZdKScgKyBrZXkgKyAnPS4qPygmfCQpJywgJ2knICk7XG5cdFx0Y29uc3Qgc2VwYXJhdG9yID0gdXJsLmluZGV4T2YoICc/JyApICE9PSAtMSA/ICcmJyA6ICc/Jztcblx0XHRsZXQgdXJsV2l0aFF1ZXJ5O1xuXG5cdFx0aWYgKCB1cmwubWF0Y2goIHJlICkgKSB7XG5cdFx0XHR1cmxXaXRoUXVlcnkgPSB1cmwucmVwbGFjZSggcmUsICckMScgKyBrZXkgKyAnPScgKyB2YWx1ZSArICckMicgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dXJsV2l0aFF1ZXJ5ID0gdXJsICsgc2VwYXJhdG9yICsga2V5ICsgJz0nICsgdmFsdWU7XG5cdFx0fVxuXG5cdFx0aWYgKCBwdXNoSGlzdG9yeSA9PT0gdHJ1ZSApIHtcblx0XHRcdHJldHVybiBoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCB1cmxXaXRoUXVlcnkgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHVybFdpdGhRdWVyeTtcblx0XHR9XG5cdH1cblxuXHQvLyByZW1vdmUgcGFyYW1ldGVyIGZyb20gdXJsXG5cdGZ1bmN0aW9uIHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIHVybCApIHtcblx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0dXJsID0gZml4UGFnaW5hdGlvbigpO1xuXHRcdH1cblxuXHRcdGNvbnN0IG9sZFBhcmFtcyAgICAgICAgID0gZ2V0VXJsVmFycyggdXJsICk7XG5cdFx0Y29uc3Qgb2xkUGFyYW1zTGVuZ3RoICAgPSBPYmplY3Qua2V5cyggb2xkUGFyYW1zICkubGVuZ3RoO1xuXHRcdGNvbnN0IHN0YXJ0UG9zaXRpb24gICAgID0gdXJsLmluZGV4T2YoICc/JyApO1xuXHRcdGNvbnN0IGZpbHRlcktleVBvc2l0aW9uID0gdXJsLmluZGV4T2YoIGZpbHRlcktleSApO1xuXHRcdGxldCBjbGVhblVybCwgY2xlYW5RdWVyeTtcblxuXHRcdGlmICggb2xkUGFyYW1zTGVuZ3RoID4gMSApIHtcblx0XHRcdGlmICggKCBmaWx0ZXJLZXlQb3NpdGlvbiAtIHN0YXJ0UG9zaXRpb24gKSA+IDEgKSB7XG5cdFx0XHRcdGNsZWFuVXJsID0gdXJsLnJlcGxhY2UoICcmJyArIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0sICcnICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjbGVhblVybCA9IHVybC5yZXBsYWNlKCBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdICsgJyYnLCAnJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBuZXdQYXJhbXMgPSBjbGVhblVybC5zcGxpdCggJz8nICk7XG5cdFx0XHRjbGVhblF1ZXJ5ICAgICAgPSAnPycgKyBuZXdQYXJhbXNbIDEgXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y2xlYW5RdWVyeSA9IHVybC5yZXBsYWNlKCAnPycgKyBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdLCAnJyApO1xuXHRcdH1cblxuXHRcdHJldHVybiBjbGVhblF1ZXJ5O1xuXHR9XG5cblx0Ly8gdGFrZSB0aGUga2V5IGFuZCB2YWx1ZSBhbmQgbWFrZSBxdWVyeVxuXHRmdW5jdGlvbiBtYWtlUGFyYW1ldGVycyggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSwgZm9yY2VSZXJlbmRlciA9IGZhbHNlLCB1cmwgKSB7XG5cdFx0Y29uc3QgdmFsdWVTZXBhcmF0b3IgPSAnLCc7XG5cblx0XHRsZXQgcGFyYW1zLCBuZXh0VmFsdWVzLCBlbXB0eVZhbHVlID0gZmFsc2U7XG5cblx0XHRpZiAoIHR5cGVvZiB1cmwgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0cGFyYW1zID0gZ2V0VXJsVmFycyggdXJsICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBhcmFtcyA9IGdldFVybFZhcnMoKTtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGVvZiBwYXJhbXNbIGZpbHRlcktleSBdICE9ICd1bmRlZmluZWQnICkge1xuXHRcdFx0Y29uc3QgcHJldlZhbHVlcyAgICAgID0gcGFyYW1zWyBmaWx0ZXJLZXkgXTtcblx0XHRcdGNvbnN0IHByZXZWYWx1ZXNBcnJheSA9IHByZXZWYWx1ZXMuc3BsaXQoIHZhbHVlU2VwYXJhdG9yICk7XG5cblx0XHRcdGlmICggcHJldlZhbHVlcy5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRjb25zdCBmb3VuZCA9ICQuaW5BcnJheSggZmlsdGVyVmFsdWUsIHByZXZWYWx1ZXNBcnJheSApO1xuXG5cdFx0XHRcdGlmICggZm91bmQgPj0gMCApIHtcblx0XHRcdFx0XHQvLyBFbGVtZW50IHdhcyBmb3VuZCwgcmVtb3ZlIGl0LlxuXHRcdFx0XHRcdHByZXZWYWx1ZXNBcnJheS5zcGxpY2UoIGZvdW5kLCAxICk7XG5cblx0XHRcdFx0XHRpZiAoIHByZXZWYWx1ZXNBcnJheS5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRcdFx0XHRlbXB0eVZhbHVlID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gRWxlbWVudCB3YXMgbm90IGZvdW5kLCBhZGQgaXQuXG5cdFx0XHRcdFx0cHJldlZhbHVlc0FycmF5LnB1c2goIGZpbHRlclZhbHVlICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHByZXZWYWx1ZXNBcnJheS5sZW5ndGggPiAxICkge1xuXHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBwcmV2VmFsdWVzQXJyYXkuam9pbiggdmFsdWVTZXBhcmF0b3IgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRuZXh0VmFsdWVzID0gcHJldlZhbHVlc0FycmF5O1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRuZXh0VmFsdWVzID0gZmlsdGVyVmFsdWU7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdG5leHRWYWx1ZXMgPSBmaWx0ZXJWYWx1ZTtcblx0XHR9XG5cblx0XHQvLyB1cGRhdGUgdXJsIGFuZCBxdWVyeSBzdHJpbmdcblx0XHRpZiAoICEgZW1wdHlWYWx1ZSApIHtcblx0XHRcdHVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIG5leHRWYWx1ZXMgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgcXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdH1cblxuXHRcdGZpbHRlclByb2R1Y3RzKCBmb3JjZVJlcmVuZGVyICk7XG5cdH1cblxuXHRmdW5jdGlvbiBzaW5nbGVGaWx0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKSB7XG5cdFx0Y29uc3QgcGFyYW1zID0gZ2V0VXJsVmFycygpO1xuXHRcdGxldCBxdWVyeTtcblxuXHRcdGlmICggdHlwZW9mIHBhcmFtc1sgZmlsdGVyS2V5IF0gIT09ICd1bmRlZmluZWQnICYmIHBhcmFtc1sgZmlsdGVyS2V5IF0gPT09IGZpbHRlclZhbHVlICkge1xuXHRcdFx0cXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHF1ZXJ5ID0gdXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIGZhbHNlICk7XG5cdFx0fVxuXG5cdFx0Ly8gdXBkYXRlIHVybFxuXHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRmaWx0ZXJQcm9kdWN0cygpO1xuXHR9XG5cblx0Ly8gSGFuZGxlIHRoZSBwYWdpbmF0aW9uIHJlcXVlc3QgdmlhIGFqYXguXG5cdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4ICYmIHdjYXBmX3BhcmFtcy5wYWdpbmF0aW9uX2NvbnRhaW5lciApIHtcblx0XHRjb25zdCAkY29udGFpbmVyID0gJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRjb25zdCBzZWxlY3RvciAgID0gd2NhcGZfcGFyYW1zLnBhZ2luYXRpb25fY29udGFpbmVyICsgJyBhJztcblxuXHRcdC8vIHRvZG86IGNoZWNrIGlmIGFqYXggZGlzYWJsZWQuXG5cdFx0aWYgKCAkY29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdCRjb250YWluZXIub24oICdjbGljaycsIHNlbGVjdG9yLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0IGxvY2F0aW9uID0gJCggdGhpcyApLmF0dHIoICdocmVmJyApO1xuXG5cdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIGxvY2F0aW9uICk7XG5cblx0XHRcdFx0ZmlsdGVyUHJvZHVjdHMoKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cdH1cblxuXHQvLyBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIHRoZSBjb21tb24gZmlsdGVyIHJlcXVlc3RzLlxuXHRmdW5jdGlvbiBoYW5kbGVGaWx0ZXJSZXF1ZXN0KCAkaXRlbSwgZmlsdGVyVmFsdWUgKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXNpbmdsZS1maWx0ZXInICk7XG5cdFx0Y29uc3QgZmllbGRJRCAgICAgICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtaWQnICk7XG5cdFx0Y29uc3QgZmllbGREYXRhICAgICAgPSBmaWVsZHNbIGZpZWxkSUQgXTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICA9IGZpZWxkRGF0YS5maWx0ZXJLZXk7XG5cdFx0Y29uc3QgbXVsdGlwbGVGaWx0ZXIgPSBmaWVsZERhdGEubXVsdGlwbGVGaWx0ZXI7XG5cblx0XHRpZiAoICEgZmlsdGVyS2V5ICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICggISBmaWx0ZXJWYWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRjb25zdCBxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRcdGZpbHRlclByb2R1Y3RzKCk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIG11bHRpcGxlRmlsdGVyICkge1xuXHRcdFx0bWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2luZ2xlRmlsdGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gcmVxdWVzdEZpbHRlciggdXJsICkge1xuXHRcdGlmICggISB1cmwgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gd2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmw7XG5cblx0XHQvLyBUT0RPOiBGaWx0ZXIgdGhlIHByb2R1Y3RzIGNvbmRpdGlvbmFsbHkuXG5cdFx0Ly8gZmlsdGVyUHJvZHVjdHMoKTtcblx0fVxuXG5cdC8vIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGxpc3QgZmllbGQuXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oXG5cdFx0J2NoYW5nZScsXG5cdFx0Jy53Y2FwZi1sYXllcmVkLW5hdiBbdHlwZT1cImNoZWNrYm94XCJdLCAud2NhcGYtbGF5ZXJlZC1uYXYgW3R5cGU9XCJyYWRpb1wiXScsXG5cdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdHJlcXVlc3RGaWx0ZXIoICRpdGVtLmRhdGEoICd1cmwnICkgKTtcblx0XHR9XG5cdCk7XG5cblx0Ly8gSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgbGFiZWxlZCBpdGVtLlxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKCAnY2xpY2snLCAnLndjYXBmLWxhYmVsZWQtbmF2IC5pdGVtOm5vdCguZGlzYWJsZWQpJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdHJlcXVlc3RGaWx0ZXIoICRpdGVtLmRhdGEoICd1cmwnICkgKTtcblx0fSApO1xuXG5cdC8vIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGRpc3BsYXkgdHlwZSBzZWxlY3QgZmllbGRzLlxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKCAnY2hhbmdlJywgJ3NlbGVjdCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgJHNlbGVjdCAgICAgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgdmFsdWVzICAgICAgICAgPSAkc2VsZWN0LnZhbCgpO1xuXHRcdGNvbnN0IGZpbHRlclVSTCAgICAgID0gJHNlbGVjdC5kYXRhKCAndXJsJyApO1xuXHRcdGNvbnN0IGNsZWFyRmlsdGVyVVJMID0gJHNlbGVjdC5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKTtcblx0XHRsZXQgdXJsO1xuXG5cdFx0aWYgKCB2YWx1ZXMubGVuZ3RoICkge1xuXHRcdFx0dXJsID0gZmlsdGVyVVJMLnJlcGxhY2UoICclcycsIHZhbHVlcy50b1N0cmluZygpICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHVybCA9IGNsZWFyRmlsdGVyVVJMO1xuXHRcdH1cblxuXHRcdHJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHR9ICk7XG5cblx0LyoqXG5cdCAqIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIHJhbmdlIG51bWJlci5cblx0ICovXG5cdGNvbnN0IHJhbmdlTnVtYmVyU2VsZWN0b3JzID0gJy53Y2FwZi1yYW5nZS1udW1iZXIgLm1pbi12YWx1ZSwgLndjYXBmLXJhbmdlLW51bWJlciAubWF4LXZhbHVlJztcblxuXHQvLyBUT0RPOiBNYXliZSB1c2UgJ2NoYW5nZScgZXZlbnQuXG5cdCR3Y2FwZk51bWJlclJhbmdlRmlsdGVycy5vbiggJ2lucHV0JywgcmFuZ2VOdW1iZXJTZWxlY3RvcnMsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRjb25zdCAkcmFuZ2VOdW1iZXIgICAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtcmFuZ2UtbnVtYmVyJyApO1xuXHRcdGNvbnN0IGZvcm1hdE51bWJlcnMgICAgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWZvcm1hdC1udW1iZXJzJyApO1xuXHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWRlY2ltYWwtcGxhY2VzJyApO1xuXHRcdGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXRob3VzYW5kLXNlcGFyYXRvcicgKTtcblx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1kZWNpbWFsLXNlcGFyYXRvcicgKTtcblxuXHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdGNsZWFyVGltZW91dCggJGl0ZW0uZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRmdW5jdGlvbiBnZXRWYWx1ZSggZmxvYXRWYWx1ZSApIHtcblx0XHRcdGlmICggZm9ybWF0TnVtYmVycyApIHtcblx0XHRcdFx0cmV0dXJuIG51bWJlcl9mb3JtYXQoIGZsb2F0VmFsdWUsIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmbG9hdFZhbHVlO1xuXHRcdH1cblxuXHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRsZXQgbWluVmFsdWUgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCkgKTtcblx0XHRcdGxldCBtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoKSApO1xuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0aWYgKCBpc05hTiggbWluVmFsdWUgKSApIHtcblx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0aWYgKCBpc05hTiggbWF4VmFsdWUgKSApIHtcblx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSByYW5nZU1pblZhbHVlLlxuXHRcdFx0aWYgKCBtaW5WYWx1ZSA8IHJhbmdlTWluVmFsdWUgKSB7XG5cdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNaW5WYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0aWYgKCBtaW5WYWx1ZSA+IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0aWYgKCBtYXhWYWx1ZSA+IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSBtaW5WYWx1ZS5cblx0XHRcdGlmICggbWluVmFsdWUgPiBtYXhWYWx1ZSApIHtcblx0XHRcdFx0bWF4VmFsdWUgPSBtaW5WYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIG1pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIG1heFZhbHVlID09PSByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHQvLyBSZW1vdmUgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRyZXF1ZXN0RmlsdGVyKCAkcmFuZ2VOdW1iZXIuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEFkZCByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdGNvbnN0IHVybCA9ICRyYW5nZU51bWJlci5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclMXMnLCBtaW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRyZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0XHRcdH1cblx0XHR9LCBkZWxheSApICk7XG5cdH0gKTtcblxuXHQvLyBIYW5kbGUgcmVtb3ZpbmcgdGhlIGFjdGl2ZSBmaWx0ZXJzLlxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKCAnY2xpY2snLCAnLndjYXBmLWFjdGl2ZS1maWx0ZXJzIC5pdGVtOm5vdCguZGlzYWJsZWQpJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgICA9ICRpdGVtLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0Y29uc3QgZmlsdGVyVmFsdWUgPSAkaXRlbS5hdHRyKCAnZGF0YS12YWx1ZScgKTtcblxuXHRcdG1ha2VQYXJhbWV0ZXJzKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlLCB0cnVlICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiByZXNldEZpbHRlcnMoICRidXR0b24gKSB7XG5cdFx0Y29uc3QgX2ZpbHRlcktleXMgPSAkYnV0dG9uLmF0dHIoICdkYXRhLWtleXMnICk7XG5cblx0XHRpZiAoICEgX2ZpbHRlcktleXMgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZmlsdGVyS2V5cyA9IF9maWx0ZXJLZXlzLnNwbGl0KCAnLCcgKTtcblxuXHRcdGxldCBxdWVyeSA9ICcnO1xuXG5cdFx0JC5lYWNoKCBmaWx0ZXJLZXlzLCBmdW5jdGlvbiggaSwgZmlsdGVyS2V5ICkge1xuXHRcdFx0aWYgKCBxdWVyeSApIHtcblx0XHRcdFx0cXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBxdWVyeSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Ly8gRW1wdHkgcXVlcnkgY2F1c2VzIGlzc3VlKGRvZXNuJ3QgcmVtb3ZlIHRoZSBmaWx0ZXIga2V5cyBmcm9tIHRoZSB1cmwpLFxuXHRcdC8vIHRoaXMgaXMgd2h5IHdlIGFyZSBzZXR0aW5nIHRoZSBwYWdlIHVybCBhcyBxdWVyeS5cblx0XHRpZiAoICEgcXVlcnkgKSB7XG5cdFx0XHRjb25zdCBwcmV2VXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0XHRjb25zdCBuZXdVcmwgID0gcHJldlVybC5zcGxpdCggJz8nICk7XG5cblx0XHRcdHF1ZXJ5ID0gbmV3VXJsWyAwIF07XG5cdFx0fVxuXG5cdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdGZpbHRlclByb2R1Y3RzKCB0cnVlICk7XG5cdH1cblxuXHQvLyBDbGVhci9SZXNldCBhbGwgZmlsdGVycy5cblx0JGJvZHkub24oICd3Y2FwZi1yZXNldC1maWx0ZXJzJywgZnVuY3Rpb24oIGUsICRidXR0b24gKSB7XG5cdFx0cmVzZXRGaWx0ZXJzKCAkYnV0dG9uICk7XG5cdH0gKTtcblxuXHQkYm9keS5vbiggJ2NsaWNrJywgJy53Y2FwZi1yZXNldC1maWx0ZXJzLWJ0bicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRidXR0b24gPSAkKCB0aGlzICk7XG5cblx0XHRyZXNldEZpbHRlcnMoICRidXR0b24gKTtcblx0fSApO1xuXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oICdjbGljaycsICcud2NhcGYtcmVzZXQtZmlsdGVycy1idG4nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRidXR0b24gPSAkKCB0aGlzICk7XG5cblx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGYtcmVzZXQtZmlsdGVycycsIFsgJGJ1dHRvbiBdICk7XG5cdH0gKTtcblxuXHQkd2NhcGZTaW5nbGVGaWx0ZXJzLm9uKCAnd2NhcGYtY2xlYXItZmlsdGVyJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGZpZWxkSUQgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRjb25zdCBmaWVsZERhdGEgPSBmaWVsZHNbIGZpZWxkSUQgXTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgPSBmaWVsZERhdGEuZmlsdGVyS2V5O1xuXG5cdFx0Y29uc3QgcXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdGZpbHRlclByb2R1Y3RzKCB0cnVlICk7XG5cdH0gKTtcblxuXHQvLyBSdW4gYWpheCBmaWx0ZXIgd2hlbiBicm93c2VyIGhpc3RvcnkgY2hhbmdlcyAodXNlciBnb2VzIGJhY2sgb3IgZm9yd2FyZCkuXG5cdGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5sZW5ndGggfHwgJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuYXBwbHlfZmlsdGVyc19vbl9icm93c2VyX2hpc3RvcnlfY2hhbmdlICkge1xuXHRcdFx0JCggd2luZG93ICkuYmluZCggJ3BvcHN0YXRlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGZpbHRlclByb2R1Y3RzKCB0cnVlICk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gVGhlIGhvb2sgdGhhdCBtYW51YWxseSBydW4gdGhlIGFqYXggZmlsdGVycyAoY2FuIGJlIHVzZWZ1bCBmb3Igb3RoZXIgcGx1Z2lucykuXG5cdCRib2R5Lm9uKCAnd2NhcGYtcnVuLWZpbHRlci1wcm9kdWN0cycsIGZ1bmN0aW9uKCBlLCBmb3JjZVJlUmVuZGVyICkge1xuXHRcdGZpbHRlclByb2R1Y3RzKCBmb3JjZVJlUmVuZGVyICk7XG5cdH0gKTtcblxuXHQvLyBUaGUgaG9vayB0aGF0IHJlaW5pdGlhbGl6ZSB0aGUgZmlsdGVyIHdpZGdldHMgKHRvIHNob3cgdGhlIHByZXZpZXcgaW4gdGhlIGJhY2tlbmQpLlxuXHQkYm9keS5vbiggJ2luaXRfZmlsdGVyX3dpZGdldHMnLCBmdW5jdGlvbigpIHtcblx0XHRpbml0Q2hvc2VuKCk7XG5cdFx0aW5pdEhpZXJhcmNoeUFjY29yZGlvbigpO1xuXHRcdGluaXROb1VJU2xpZGVyKCk7XG5cdFx0aW5pdERhdGVwaWNrZXIoKTtcblx0fSApO1xuXG5cdC8qKlxuXHQgKiBNYWtlIGl0IGNvbXBhdGlibGUgd2l0aCBvdGhlciBwbHVnaW5zLlxuXHQgKi9cblx0JGJvZHkub24oICd3Y2FwZl9hZnRlcl91cGRhdGluZ19wcm9kdWN0cycsIGZ1bmN0aW9uKCkge1xuXHRcdC8vIHdvby12YXJpYXRpb24tc3dhdGNoZXNcblx0XHQkKCBkb2N1bWVudCApLnRyaWdnZXIoICd3b29fdmFyaWF0aW9uX3N3YXRjaGVzX3Byb19pbml0JyApO1xuXHR9ICk7XG59ICk7XG4iLCIoIGZ1bmN0aW9uKCAkLCB3aW5kb3cgKSB7XG5cblx0Y29uc3QgX2RlbGF5ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5maWx0ZXJfaW5wdXRfZGVsYXkgKTtcblx0Y29uc3QgZGVsYXkgID0gX2RlbGF5ID49IDAgPyBfZGVsYXkgOiA4MDA7XG5cblx0Y29uc3QgJGJvZHkgPSAkKCAnYm9keScgKTtcblxuXHRjb25zdCBpbnN0YW5jZUlkcyA9IFtdO1xuXG5cdCQoICcud2NhcGYtZmlsdGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGluc3RhbmNlSWRzLnB1c2goICQoIHRoaXMgKS5kYXRhKCAnaWQnICkgKTtcblx0fSApO1xuXG5cdGxldCBmb2N1c2VkRWxtO1xuXG5cdHdpbmRvdy5XQ0FQRiA9IHdpbmRvdy5XQ0FQRiB8fCB7fTtcblxuXHR3aW5kb3cuV0NBUEYgPSB7XG5cdFx0aGFuZGxlRmlsdGVyQWNjb3JkaW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHRvZ2dsZUFjY29yZGlvbiA9ICggJGVsICkgPT4ge1xuXHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGFjY29yZGlvbiBpcyBvcGVuZWRcblx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1leHBhbmRlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdC8vIENoYW5nZSBhcmlhLWV4cGFuZGVkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuXHRcdFx0XHQkZWwuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAhIHByZXNzZWQgKTtcblxuXHRcdFx0XHRjb25zdCAkZmlsdGVySW5uZXIgPSAkZWwuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXInICkuY2hpbGRyZW4oICcud2NhcGYtZmlsdGVyLWlubmVyJyApO1xuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9hbmltYXRpb25fZm9yX2ZpbHRlcl9hY2NvcmRpb24gKSB7XG5cdFx0XHRcdFx0JGZpbHRlcklubmVyLnNsaWRlVG9nZ2xlKFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkLFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZ1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JGZpbHRlcklubmVyLnRvZ2dsZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHQkYm9keS5vbiggJ2NsaWNrJywgJy53Y2FwZi1maWx0ZXItYWNjb3JkaW9uLXRyaWdnZXInLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQkYm9keS5vbiggJ2NsaWNrJywgJy53Y2FwZi1maWx0ZXItdGl0bGUuaGFzLWFjY29yZGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkdHJpZ2dlciA9ICQoIHRoaXMgKS5maW5kKCAnLndjYXBmLWZpbHRlci1hY2NvcmRpb24tdHJpZ2dlcicgKTtcblxuXHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICR0cmlnZ2VyICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVIaWVyYXJjaHlUb2dnbGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgdG9nZ2xlQWNjb3JkaW9uID0gKCAkZWwgKSA9PiB7XG5cdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYnV0dG9uIGlzIHByZXNzZWRcblx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0Ly8gQ2hhbmdlIGFyaWEtcHJlc3NlZCB0byB0aGUgb3Bwb3NpdGUgc3RhdGVcblx0XHRcdFx0JGVsLmF0dHIoICdhcmlhLXByZXNzZWQnLCAhIHByZXNzZWQgKTtcblxuXHRcdFx0XHRjb25zdCAkY2hpbGQgPSAkZWwuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICk7XG5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbiApIHtcblx0XHRcdFx0XHQkY2hpbGQuc2xpZGVUb2dnbGUoXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQsXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkY2hpbGQudG9nZ2xlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdCRib2R5XG5cdFx0XHRcdC5vbiggJ2NsaWNrJywgJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0XHRcdH0gKVxuXHRcdFx0XHQub24oICdrZXlkb3duJywgJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdGlmICggZS5rZXkgPT09ICcgJyB8fCBlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJ1NwYWNlYmFyJyApIHtcblx0XHRcdFx0XHRcdC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgYWN0aW9uIHRvIHN0b3Agc2Nyb2xsaW5nIHdoZW4gc3BhY2UgaXMgcHJlc3NlZFxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlU29mdExpbWl0OiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHRvZ2dsZUZpbHRlck9wdGlvbnMgPSAoICRlbCApID0+IHtcblx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBidXR0b24gaXMgcHJlc3NlZFxuXHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLXByZXNzZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHQvLyBDaGFuZ2UgYXJpYS1wcmVzc2VkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuXHRcdFx0XHQkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICEgcHJlc3NlZCApO1xuXG5cdFx0XHRcdGNvbnN0ICRsaXN0V3JhcHBlciA9ICRlbC5jbG9zZXN0KCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKTtcblxuXHRcdFx0XHRpZiAoIHByZXNzZWQgKSB7XG5cdFx0XHRcdFx0JGxpc3RXcmFwcGVyLnJlbW92ZUNsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkbGlzdFdyYXBwZXIuYWRkQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHQkYm9keVxuXHRcdFx0XHQub24oICdjbGljaycsICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dG9nZ2xlRmlsdGVyT3B0aW9ucyggJCggdGhpcyApICk7XG5cdFx0XHRcdH0gKVxuXHRcdFx0XHQub24oICdrZXlkb3duJywgJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRpZiAoIGUua2V5ID09PSAnICcgfHwgZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICdTcGFjZWJhcicgKSB7XG5cdFx0XHRcdFx0XHQvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvbiB0byBzdG9wIHNjcm9sbGluZyB3aGVuIHNwYWNlIGlzIHByZXNzZWRcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdFx0dG9nZ2xlRmlsdGVyT3B0aW9ucyggJCggdGhpcyApICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVTZWFyY2hGaWx0ZXJPcHRpb25zOiBmdW5jdGlvbigpIHtcblx0XHRcdCRib2R5Lm9uKCAnaW5wdXQnLCAnLndjYXBmLXNlYXJjaC1ib3ggaW5wdXRbdHlwZT1cInRleHRcIl0nLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0Y29uc3QgJHRoYXQgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgJGlubmVyICA9ICR0aGF0LmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyLWlubmVyJyApO1xuXHRcdFx0XHRjb25zdCAkZmlsdGVyID0gJGlubmVyLmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyJyApO1xuXG5cdFx0XHRcdGNvbnN0IGtleXdvcmQgPSAkdGhhdC52YWwoKTtcblxuXHRcdFx0XHRpZiAoICEga2V5d29yZC5sZW5ndGggKSB7XG5cdFx0XHRcdFx0JGZpbHRlci5yZW1vdmVDbGFzcyggJ3NlYXJjaC1hY3RpdmUnICk7XG5cblx0XHRcdFx0XHQkLmVhY2goICRpbm5lci5maW5kKCAnLndjYXBmLWZpbHRlci1vcHRpb25zID4gbGknICksIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JCggdGhpcyApLnJlbW92ZUNsYXNzKCAna2V5d29yZC1tYXRjaGVkJyApO1xuXHRcdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCRmaWx0ZXIuYWRkQ2xhc3MoICdzZWFyY2gtYWN0aXZlJyApO1xuXG5cdFx0XHRcdCQuZWFjaCggJGlubmVyLmZpbmQoICcud2NhcGYtZmlsdGVyLW9wdGlvbnMgPiBsaScgKSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGZpbHRlckl0ZW0gPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0Y29uc3QgbGFiZWwgICAgICAgPSAkZmlsdGVySXRlbS5maW5kKCAnLndjYXBmLWZpbHRlci1pdGVtLWxhYmVsJyApLmRhdGEoICdsYWJlbCcgKTtcblxuXHRcdFx0XHRcdGlmICggbGFiZWwudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygga2V5d29yZC50b0xvd2VyQ2FzZSgpICkgKSB7XG5cdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5hZGRDbGFzcyggJ2tleXdvcmQtbWF0Y2hlZCcgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICdrZXl3b3JkLW1hdGNoZWQnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHR1cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0OiBmdW5jdGlvbiggJHJlc3BvbnNlICkge1xuXHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRjb25zdCBzZWxlY3RvciAgID0gJy53b29jb21tZXJjZS1yZXN1bHQtY291bnQnO1xuXHRcdFx0Y29uc3QgbmV3Q291bnQgICA9ICRyZXNwb25zZS5maW5kKCBzZWxlY3RvciApLmh0bWwoKTtcblxuXHRcdFx0JGJvZHkuZmluZCggc2VsZWN0b3IgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGVsID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdGlmICggISAkY29udGFpbmVyLmhhcyggJGVsICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdCRlbC5odG1sKCBuZXdDb3VudCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRzaG93TG9hZGluZ0FuaW1hdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLmxvYWRpbmdfYW5pbWF0aW9uICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCQuTG9hZGluZ092ZXJsYXkoICdzaG93Jywgd2NhcGZfcGFyYW1zLmxvYWRpbmdfb3ZlcmxheV9vcHRpb25zICk7XG5cdFx0fSxcblx0XHRyZXNldExvYWRpbmdBbmltYXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5sb2FkaW5nX2FuaW1hdGlvbiApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQkLkxvYWRpbmdPdmVybGF5KCAnaGlkZScgKTtcblx0XHR9LFxuXHRcdHNjcm9sbFRvOiBmdW5jdGlvbiggdHJpZ2dlcmVkQnkgKSB7XG5cdFx0XHRpZiAoICdub25lJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgYWxsb3dlZCAgICA9IFtdO1xuXHRcdFx0Y29uc3Qgc2Nyb2xsV2hlbiA9IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X3doZW47XG5cblx0XHRcdGlmICggJ2FsbCcgPT09IHNjcm9sbFdoZW4gKSB7XG5cdFx0XHRcdGFsbG93ZWQucHVzaCggJ2ZpbHRlcicgKTtcblx0XHRcdFx0YWxsb3dlZC5wdXNoKCAncGFnaW5hdGUnICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhbGxvd2VkLnB1c2goIHNjcm9sbFdoZW4gKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhIGFsbG93ZWQuaW5jbHVkZXMoIHRyaWdnZXJlZEJ5ICkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc2Nyb2xsRm9yID0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfZm9yO1xuXHRcdFx0Y29uc3QgaXNNb2JpbGUgID0gd2NhcGZfcGFyYW1zLmlzX21vYmlsZTtcblx0XHRcdGxldCBwcm9jZWVkICAgICA9IGZhbHNlO1xuXG5cdFx0XHRpZiAoICdtb2JpbGUnID09PSBzY3JvbGxGb3IgJiYgaXNNb2JpbGUgKSB7XG5cdFx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmICggJ2Rlc2t0b3AnID09PSBzY3JvbGxGb3IgJiYgISBpc01vYmlsZSApIHtcblx0XHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0XHR9IGVsc2UgaWYgKCAnYm90aCcgPT09IHNjcm9sbEZvciApIHtcblx0XHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISBwcm9jZWVkICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCBhZGp1c3RpbmdPZmZzZXQsIG9mZnNldDtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKSB7XG5cdFx0XHRcdGFkanVzdGluZ09mZnNldCA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGNvbnRhaW5lcjtcblxuXHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXI7XG5cdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXI7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggJ2N1c3RvbScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93ICkge1xuXHRcdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudDtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIGNvbnRhaW5lciApO1xuXG5cdFx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRvZmZzZXQgPSAkY29udGFpbmVyLm9mZnNldCgpLnRvcCAtIGFkanVzdGluZ09mZnNldDtcblxuXHRcdFx0XHRpZiAoIG9mZnNldCA8IDAgKSB7XG5cdFx0XHRcdFx0b2Zmc2V0ID0gMDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmRpc2FibGVfc2Nyb2xsX2FuaW1hdGlvbiApIHtcblx0XHRcdFx0XHR3aW5kb3cuc2Nyb2xsVG8oIHsgdG9wOiBvZmZzZXQgfSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCQoICdodG1sLCBib2R5JyApLnN0b3AoKS5hbmltYXRlKFxuXHRcdFx0XHRcdFx0eyBzY3JvbGxUb3A6IG9mZnNldCB9LFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfc3BlZWQsXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9lYXNpbmdcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvLyBUaGluZ3MgYXJlIGRvbmUgYmVmb3JlIGZldGNoaW5nIHRoZSBwcm9kdWN0cyBsaWtlIHNob3dpbmcgdGhlIGxvYWRpbmcgaW5kaWNhdG9yLlxuXHRcdGJlZm9yZUZldGNoaW5nUHJvZHVjdHM6IGZ1bmN0aW9uKCB0cmlnZ2VyZWRCeSApIHtcblx0XHRcdC8vIFRyYWNrIHRoZSBjdXJyZW50IGVsZW1lbnQgZm9jdXMuXG5cdFx0XHRmb2N1c2VkRWxtID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcblxuXHRcdFx0V0NBUEYuc2hvd0xvYWRpbmdBbmltYXRpb24oKTtcblxuXHRcdFx0Ly8gU2Nyb2xsIGludG8gdmlldyBvbiBwYWdpbmF0ZS5cblx0XHRcdGlmICggJ3BhZ2luYXRlJyA9PT0gdHJpZ2dlcmVkQnkgJiYgd2NhcGZfcGFyYW1zLmltbWVkaWF0ZV9zY3JvbGxfb25fcGFnaW5hdGUgKSB7XG5cdFx0XHRcdFdDQVBGLnNjcm9sbFRvKCB0cmlnZ2VyZWRCeSApO1xuXHRcdFx0fVxuXG5cdFx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGZfYmVmb3JlX2ZldGNoaW5nX3Byb2R1Y3RzJywgWyB0cmlnZ2VyZWRCeSBdICk7XG5cdFx0fSxcblx0XHQvLyBUaGluZ3MgYXJlIGRvbmUgYmVmb3JlIHVwZGF0aW5nIHRoZSBwcm9kdWN0cyBsaWtlIGhpZGluZyB0aGUgbG9hZGluZyBpbmRpY2F0b3IuXG5cdFx0YmVmb3JlVXBkYXRpbmdQcm9kdWN0czogZnVuY3Rpb24oICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgKSB7XG5cdFx0XHRXQ0FQRi5yZXNldExvYWRpbmdBbmltYXRpb24oKTtcblxuXHRcdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2JlZm9yZV91cGRhdGluZ19wcm9kdWN0cycsIFsgJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSBdICk7XG5cdFx0fSxcblx0XHRhZnRlclVwZGF0aW5nUHJvZHVjdHM6IGZ1bmN0aW9uKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICkge1xuXHRcdFx0V0NBUEYudXBkYXRlUHJvZHVjdHNDb3VudFJlc3VsdCggJHJlc3BvbnNlICk7XG5cblx0XHRcdC8vIFJlc3RvcmUgdGhlIGZvY3VzIChNYXliZSByZXN0b3JpbmcgdGhlIGZvY3VzIGluIG1vYmlsZSBkZXZpY2UgaXNuJ3QgZ29vZCkuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5yZXN0b3JlX2ZvY3VzX2FmdGVyX2ZpbHRlcmluZyAmJiAhIHdjYXBmX3BhcmFtcy5pc19tb2JpbGUgKSB7XG5cdFx0XHRcdGlmICggZG9jdW1lbnQuYm9keSAhPT0gZm9jdXNlZEVsbSApIHtcblx0XHRcdFx0XHRpZiAoIGZvY3VzZWRFbG0uaWQgKSB7XG5cdFx0XHRcdFx0XHQkKCBgIyR7IGZvY3VzZWRFbG0uaWQgfWAgKS5mb2N1cygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZWluaXRpYWxpemUgd2NhcGYuXG5cdFx0XHRXQ0FQRi5pbml0KCk7XG5cblx0XHRcdC8vIFNjcm9sbCBpbnRvIHZpZXcuXG5cdFx0XHRpZiAoICdwYWdpbmF0ZScgPT09IHRyaWdnZXJlZEJ5ICYmIHdjYXBmX3BhcmFtcy5pbW1lZGlhdGVfc2Nyb2xsX29uX3BhZ2luYXRlICkge1xuXHRcdFx0XHQvLyBEbyBub3RoaW5nIGJlY2F1c2UgaXQgYWxyZWFkeSBoYXBwZW5lZC5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFdDQVBGLnNjcm9sbFRvKCB0cmlnZ2VyZWRCeSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUcmlnZ2VyIGV2ZW50cy5cblx0XHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggJ3JlYWR5JyApO1xuXHRcdFx0JCggd2luZG93ICkudHJpZ2dlciggJ3Njcm9sbCcgKTtcblx0XHRcdCQoIHdpbmRvdyApLnRyaWdnZXIoICdyZXNpemUnICk7XG5cblx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9hZnRlcl91cGRhdGluZ19wcm9kdWN0cycsIFsgJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSBdICk7XG5cdFx0fSxcblx0XHRmaWx0ZXJQcm9kdWN0czogZnVuY3Rpb24oIHRyaWdnZXJlZEJ5ID0gJ2ZpbHRlcicgKSB7XG5cdFx0XHRXQ0FQRi5iZWZvcmVGZXRjaGluZ1Byb2R1Y3RzKCB0cmlnZ2VyZWRCeSApO1xuXG5cdFx0XHQkLmFqYXgoIHtcblx0XHRcdFx0dXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0XHRcdGNvbnN0ICRyZXNwb25zZSA9ICQoIHJlc3BvbnNlICk7XG5cblx0XHRcdFx0XHRXQ0FQRi5iZWZvcmVVcGRhdGluZ1Byb2R1Y3RzKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICk7XG5cblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBVcGRhdGUgZG9jdW1lbnQgdGl0bGUuXG5cdFx0XHRcdFx0ICpcblx0XHRcdFx0XHQgKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS83NTk5NTYyXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0ZG9jdW1lbnQudGl0bGUgPSAkcmVzcG9uc2UuZmlsdGVyKCAndGl0bGUnICkudGV4dCgpO1xuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBpbnN0YW5jZXMuXG5cdFx0XHRcdFx0Zm9yICggY29uc3QgaWQgb2YgaW5zdGFuY2VJZHMgKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBpbnN0YW5jZUlkICAgICA9ICdbZGF0YS1pZD1cIicgKyBpZCArICdcIl0nO1xuXHRcdFx0XHRcdFx0Y29uc3QgJGluc3RhbmNlICAgICAgPSAkKCBpbnN0YW5jZUlkICk7XG5cdFx0XHRcdFx0XHRjb25zdCAkaW5uZXIgICAgICAgICA9ICRpbnN0YW5jZS5maW5kKCAnLndjYXBmLWZpbHRlci1pbm5lcicgKTtcblx0XHRcdFx0XHRcdGNvbnN0IF9pbnN0YW5jZSAgICAgID0gJHJlc3BvbnNlLmZpbmQoIGluc3RhbmNlSWQgKTtcblx0XHRcdFx0XHRcdGxldCBfaW5zdGFuY2VDbGFzc2VzID0gJCggX2luc3RhbmNlICkuYXR0ciggJ2NsYXNzJyApO1xuXG5cdFx0XHRcdFx0XHQvLyBQcmVzZXJ2ZSBoaWVyYXJjaHkgYWNjb3JkaW9uIHN0YXRlLlxuXHRcdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkaW5zdGFuY2UuaGFzQ2xhc3MoICdoYXMtaGllcmFyY2h5LWFjY29yZGlvbicgKSApIHtcblx0XHRcdFx0XHRcdFx0XHQkaW5zdGFuY2UuZmluZCggJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0ICRlbCA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IGlkICA9ICRlbC5kYXRhKCAnaWQnICk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHRvZ2dsZVNlbGVjdG9yID0gYC53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZVtkYXRhLWlkPVwiJHsgaWQgfVwiXWA7XG5cblx0XHRcdFx0XHRcdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYWNjb3JkaW9uIGlzIG9wZW5lZFxuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGlmICggcHJlc3NlZCApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICd0cnVlJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5jbG9zZXN0KCAnbGknICkuY2hpbGRyZW4oICd1bCcgKS5zaG93KCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5hdHRyKCAnYXJpYS1wcmVzc2VkJywgJ2ZhbHNlJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5jbG9zZXN0KCAnbGknICkuY2hpbGRyZW4oICd1bCcgKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIFByZXNlcnZlIHNvZnQgbGltaXQgc3RhdGUuXG5cdFx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5wcmVzZXJ2ZV9zb2Z0X2xpbWl0X3N0YXRlICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRpbnN0YW5jZS5oYXNDbGFzcyggJ2hhcy1zb2Z0LWxpbWl0JyApICkge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0ICRsaXN0V3JhcHBlciA9ICRpbnN0YW5jZS5maW5kKCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKTtcblxuXHRcdFx0XHRcdFx0XHRcdGlmICggJGxpc3RXcmFwcGVyLmhhc0NsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKS5hZGRDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICd0cnVlJyApO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1saXN0LXdyYXBwZXInICkucmVtb3ZlQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJyApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAnZmFsc2UnICk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIFVwZGF0ZSBjbGVhciBmaWx0ZXIgYnV0dG9uIHVybC5cblx0XHRcdFx0XHRcdGNvbnN0IGNsZWFyQnRuU2VsZWN0b3IgPSAnLndjYXBmLWZpbHRlci1jbGVhci1idG4nO1xuXHRcdFx0XHRcdFx0Y29uc3QgY2xlYXJGaWx0ZXJVcmwgICA9IF9pbnN0YW5jZS5maW5kKCBjbGVhckJ0blNlbGVjdG9yICkuYXR0ciggJ2RhdGEtY2xlYXItZmlsdGVyLXVybCcgKTtcblx0XHRcdFx0XHRcdCRpbnN0YW5jZS5maW5kKCBjbGVhckJ0blNlbGVjdG9yICkuYXR0ciggJ2RhdGEtY2xlYXItZmlsdGVyLXVybCcsIGNsZWFyRmlsdGVyVXJsICk7XG5cblx0XHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgaW5zdGFuY2UgY2xhc3Nlcy5cblx0XHRcdFx0XHRcdCRpbnN0YW5jZS5hdHRyKCAnY2xhc3MnLCBfaW5zdGFuY2VDbGFzc2VzLnRyaW0oKSApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBfaHRtbCA9IF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLWZpbHRlci1pbm5lcicgKS5odG1sKCk7XG5cblx0XHRcdFx0XHRcdC8vIEZpbmFsbHkgdXBkYXRlIHRoZSBpbnN0YW5jZS5cblx0XHRcdFx0XHRcdCRpbm5lci5odG1sKCBfaHRtbCApO1xuXG5cdFx0XHRcdFx0XHQkaW5zdGFuY2UudHJpZ2dlciggJ3djYXBmLWZpbHRlci11cGRhdGVkJywgWyBfaW5zdGFuY2UgXSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFJlcGxhY2Ugb2xkIHNob3AgbG9vcCB3aXRoIG5ldyBvbmUuXG5cdFx0XHRcdFx0Y29uc3QgJHNob3BMb29wQ29udGFpbmVyID0gJHJlc3BvbnNlLmZpbmQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRcdFx0Y29uc3QgJG5vdEZvdW5kQ29udGFpbmVyID0gJHJlc3BvbnNlLmZpbmQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICk7XG5cblx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyID09PSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRXQ0FQRi5hZnRlclVwZGF0aW5nUHJvZHVjdHMoICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0cmVxdWVzdEZpbHRlcjogZnVuY3Rpb24oIHVybCwgdHJpZ2dlcmVkQnkgPSAnZmlsdGVyJyApIHtcblx0XHRcdGlmICggISB1cmwgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaG9zdG5hbWUgPSBsb2NhdGlvbi5ob3N0bmFtZTtcblxuXHRcdFx0Ly8gVE9ETzogUmVtb3ZlIGZyb20gcHJvZHVjdGlvbiBidWlsZC5cblx0XHRcdGlmICggJ2xvY2FsaG9zdCcgPT09IGhvc3RuYW1lICkge1xuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSggJ2h0dHA6Ly93Y2ZpbHRlci0yLnRlc3QnLCAnLy9sb2NhbGhvc3Q6MzAwMScgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gd2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmw7XG5cblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7IHdjYXBmOiB0cnVlIH0sICcnLCB1cmwgKTtcblxuXHRcdFx0V0NBUEYuZmlsdGVyUHJvZHVjdHMoIHRyaWdnZXJlZEJ5ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVOdW1iZXJJbnB1dEZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgcmFuZ2VOdW1iZXJTZWxlY3RvcnMgPSAnLndjYXBmLXJhbmdlLW51bWJlciAubWluLXZhbHVlLCAud2NhcGYtcmFuZ2UtbnVtYmVyIC5tYXgtdmFsdWUnO1xuXG5cdFx0XHQkYm9keS5vbiggJ2lucHV0JywgcmFuZ2VOdW1iZXJTZWxlY3RvcnMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRjb25zdCAkcmFuZ2VOdW1iZXIgICAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtcmFuZ2UtbnVtYmVyJyApO1xuXHRcdFx0XHRjb25zdCBmb3JtYXROdW1iZXJzICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1mb3JtYXQtbnVtYmVycycgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBvbGRNaW5WYWx1ZSAgICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgb2xkTWF4VmFsdWUgICAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWRlY2ltYWwtcGxhY2VzJyApO1xuXHRcdFx0XHRjb25zdCB0aG91c2FuZFNlcGFyYXRvciA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS10aG91c2FuZC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdGNvbnN0IGdldFZhbHVlID0gKCBmbG9hdFZhbHVlICkgPT4ge1xuXHRcdFx0XHRcdGlmICggZm9ybWF0TnVtYmVycyApIHtcblx0XHRcdFx0XHRcdHJldHVybiBudW1iZXJGb3JtYXQoIGZsb2F0VmFsdWUsIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIGZsb2F0VmFsdWU7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0bGV0IG1pblZhbHVlID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCgpICk7XG5cdFx0XHRcdFx0bGV0IG1heFZhbHVlID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCgpICk7XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0XHRcdGlmICggaXNOYU4oIG1pblZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdFx0XHRpZiAoIGlzTmFOKCBtYXhWYWx1ZSApICkge1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gYmVsb3cgdGhlIHJhbmdlTWluVmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA8IHJhbmdlTWluVmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID4gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0XHRcdGlmICggbWF4VmFsdWUgPiByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gZ28gYmVsb3cgdGhlIG1pblZhbHVlLlxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPiBtYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gbWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gSWYgdmFsdWUgaXMgbm90IGNoYW5nZWQgdGhlbiBkb24ndCBwcm9jZWVkLlxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPT09IG9sZE1pblZhbHVlICYmIG1heFZhbHVlID09PSBvbGRNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIG1heFZhbHVlID09PSByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0Ly8gUmVtb3ZlIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICRyYW5nZU51bWJlci5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBBZGQgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0Y29uc3QgdXJsID0gJHJhbmdlTnVtYmVyLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIG1pblZhbHVlICkucmVwbGFjZSggJyUycycsIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZUxpc3RGaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IG5hdGl2ZUlucHV0cyA9ICcubGlzdC10eXBlLW5hdGl2ZSBbdHlwZT1cImNoZWNrYm94XCJdLCcgK1xuXHRcdFx0XHQnLmxpc3QtdHlwZS1uYXRpdmUgW3R5cGU9XCJyYWRpb1wiXSwnICtcblx0XHRcdFx0Jy5saXN0LXR5cGUtY3VzdG9tLWNoZWNrYm94IFt0eXBlPVwiY2hlY2tib3hcIl0nO1xuXG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsIG5hdGl2ZUlucHV0cywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5kYXRhKCAndXJsJyApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGNvbnN0IGN1c3RvbVJhZGlvU2VsZWN0b3IgPSAnLmxpc3QtdHlwZS1jdXN0b20tcmFkaW8nO1xuXG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsIGN1c3RvbVJhZGlvU2VsZWN0b3IgKyAnIFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzU4Mzk5MjRcblx0XHRcdFx0JCggdGhpcyApXG5cdFx0XHRcdFx0LmNsb3Nlc3QoIGN1c3RvbVJhZGlvU2VsZWN0b3IgKVxuXHRcdFx0XHRcdC5maW5kKCAnW3R5cGU9XCJjaGVja2JveFwiXScgKS5ub3QoIHRoaXMgKVxuXHRcdFx0XHRcdC5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJCggdGhpcyApLmRhdGEoICd1cmwnICkgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZURyb3Bkb3duRmlsdGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsICcud2NhcGYtZHJvcGRvd24td3JhcHBlciBzZWxlY3QnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHNlbGVjdCAgICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IHZhbHVlcyAgICAgICAgID0gJHNlbGVjdC52YWwoKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyVVJMICAgICAgPSAkc2VsZWN0LmRhdGEoICd1cmwnICk7XG5cdFx0XHRcdGNvbnN0IGNsZWFyRmlsdGVyVVJMID0gJHNlbGVjdC5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKTtcblx0XHRcdFx0bGV0IHVybDtcblxuXHRcdFx0XHRpZiAoIHZhbHVlcy5sZW5ndGggKSB7XG5cdFx0XHRcdFx0dXJsID0gZmlsdGVyVVJMLnJlcGxhY2UoICclcycsIHZhbHVlcy50b1N0cmluZygpICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dXJsID0gY2xlYXJGaWx0ZXJVUkw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZVBhZ2luYXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXggJiYgd2NhcGZfcGFyYW1zLnBhZ2luYXRpb25fY29udGFpbmVyICkge1xuXHRcdFx0XHRjb25zdCAkY29udGFpbmVyID0gJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdFx0Y29uc3Qgc2VsZWN0b3IgICA9IHdjYXBmX3BhcmFtcy5wYWdpbmF0aW9uX2NvbnRhaW5lciArICcgYSc7XG5cblx0XHRcdFx0aWYgKCAkY29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHQkY29udGFpbmVyLm9uKCAnY2xpY2snLCBzZWxlY3RvciwgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IGhyZWYgPSAkKCB0aGlzICkuYXR0ciggJ2hyZWYnICk7XG5cblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIGhyZWYsICdwYWdpbmF0ZScgKTtcblx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdGhhbmRsZURlZmF1bHRPcmRlcmJ5OiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMuc29ydGluZ19jb250cm9sICkge1xuXHRcdFx0XHQvLyBTdWJtaXQgdGhlIG9yZGVyYnkgZm9ybSB3aGVuIHZhbHVlIGlzIGNoYW5nZWQuXG5cdFx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgJy53b29jb21tZXJjZS1vcmRlcmluZyBzZWxlY3Qub3JkZXJieScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5jbG9zZXN0KCAnZm9ybScgKS50cmlnZ2VyKCAnc3VibWl0JyApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBQcmV2ZW50IHRoZSBhdXRvIHN1Ym1pc3Npb24gb2YgdGhlIG9yZGVyYnkgZm9ybS5cblx0XHRcdCRib2R5Lm9uKCAnc3VibWl0JywgJy53b29jb21tZXJjZS1vcmRlcmluZycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgdmlhIGFqYXggd2hlbiB0aGUgb3JkZXJieSB2YWx1ZSBpcyBjaGFuZ2VkLlxuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nIHNlbGVjdC5vcmRlcmJ5JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0IG9yZGVyID0gJCggdGhpcyApLnZhbCgpO1xuXG5cdFx0XHRcdGNvbnN0IHVybCA9IG5ldyBVUkwoIHdpbmRvdy5sb2NhdGlvbiApO1xuXHRcdFx0XHR1cmwuc2VhcmNoUGFyYW1zLnNldCggJ29yZGVyYnknLCBvcmRlciApO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIGdldE9yZGVyQnlVcmwoIHVybC5ocmVmICkgKTtcblxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVSZXNldEZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtcmVzZXQtZmlsdGVycy1idG4nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coICdyZXNldCBhbGwgZmlsdGVycycgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdC8vIFRPRE86IE1vdmUgdG8gcHJvXG5cdFx0aGFuZGxlQ2xlYXJGaWx0ZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHlcblx0XHRcdFx0Lm9uKCAnY2xpY2snLCAnLndjYXBmLWZpbHRlci1jbGVhci1idG4nLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJCggdGhpcyApLmF0dHIoICdkYXRhLWNsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdFx0fSApXG5cdFx0XHRcdC5vbiggJ2tleWRvd24nLCAnLndjYXBmLWZpbHRlci1jbGVhci1idG4nLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRpZiAoIGUua2V5ID09PSAnICcgfHwgZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICdTcGFjZWJhcicgKSB7XG5cdFx0XHRcdFx0XHQvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvbiB0byBzdG9wIHNjcm9sbGluZyB3aGVuIHNwYWNlIGlzIHByZXNzZWRcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5hdHRyKCAnZGF0YS1jbGVhci1maWx0ZXItdXJsJyApICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVGaWx0ZXJUb29sdGlwOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHRpcHB5ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMudXNlX3RpcHB5anMgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGlwcHkoICcud2NhcGYtZmlsdGVyLXRvb2x0aXAnLCB7XG5cdFx0XHRcdHBsYWNlbWVudDogJ3RvcCcsXG5cdFx0XHRcdGNvbnRlbnQoIHJlZmVyZW5jZSApIHtcblx0XHRcdFx0XHRjb25zdCB0aXRsZSA9IHJlZmVyZW5jZS5nZXRBdHRyaWJ1dGUoICdkYXRhLWNvbnRlbnQnICk7XG5cblx0XHRcdFx0XHRyZWZlcmVuY2UucmVtb3ZlQXR0cmlidXRlKCAndGl0bGUnICk7XG5cblx0XHRcdFx0XHRyZXR1cm4gdGl0bGU7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGFsbG93SFRNTDogdHJ1ZSxcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXRDb21ib2JveDogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgalF1ZXJ5KCkuY2hvc2VuV0NBUEYgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHtcblx0XHRcdFx0aW5oZXJpdF9zZWxlY3RfY2xhc3NlczogdHJ1ZSxcblx0XHRcdFx0aW5oZXJpdF9vcHRpb25fY2xhc3NlczogdHJ1ZSxcblx0XHRcdFx0bm9fcmVzdWx0c190ZXh0OiB3Y2FwZl9wYXJhbXMuY2hvc2VuX25vX3Jlc3VsdHNfdGV4dCxcblx0XHRcdFx0b3B0aW9uc19ub25lX3RleHQ6IHdjYXBmX3BhcmFtcy5jaG9zZW5fb3B0aW9uc19ub25lX3RleHQsXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5pc19ydGwgKSB7XG5cdFx0XHRcdG9wdGlvbnNbICdydGwnIF0gPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLWNob3NlbicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Ly8gSWYgaGllcmFyY2h5IGVuYWJsZWQgdGhlbiB3ZSBzaG93IHRoZSBzZWxlY3RlZCBvcHRpb25zLlxuXHRcdFx0XHRpZiAoICR0aGlzLmhhc0NsYXNzKCAnaGFzLWhpZXJhcmNoeScgKSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJyBdID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJyBdID0gd2NhcGZfcGFyYW1zLmNob3Nlbl9kaXNwbGF5X3NlbGVjdGVkX29wdGlvbnM7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkdGhpcy5jaG9zZW5XQ0FQRiggb3B0aW9ucyApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBBdHRhY2ggY2hvc2VuIGZvciBkZWZhdWx0IG9yZGVyYnkuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5hdHRhY2hfY2hvc2VuX29uX3NvcnRpbmcgKSB7XG5cdFx0XHRcdGxldCBkaXNhYmxlU2VhcmNoID0gdHJ1ZTtcblxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zZWFyY2hfYm94X2luX2RlZmF1bHRfb3JkZXJieSApIHtcblx0XHRcdFx0XHRkaXNhYmxlU2VhcmNoID0gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRvcHRpb25zWyAnZGlzYWJsZV9zZWFyY2gnIF0gPSBkaXNhYmxlU2VhcmNoO1xuXG5cdFx0XHRcdCRib2R5LmZpbmQoICcud29vY29tbWVyY2Utb3JkZXJpbmcgc2VsZWN0Lm9yZGVyYnknICkuY2hvc2VuV0NBUEYoIG9wdGlvbnMgKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGluaXRSYW5nZVNsaWRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLXJhbmdlLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGl0ZW0gICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgJHNsaWRlciA9ICRpdGVtLmZpbmQoICcud2NhcGYtbm91aS1zbGlkZXInICk7XG5cblx0XHRcdFx0Y29uc3Qgc2xpZGVySWQgICAgICAgICAgPSAkc2xpZGVyLmF0dHIoICdpZCcgKTtcblx0XHRcdFx0Y29uc3QgZGlzcGxheVZhbHVlc0FzICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kaXNwbGF5LXZhbHVlcy1hcycgKTtcblx0XHRcdFx0Y29uc3QgZm9ybWF0TnVtYmVycyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1mb3JtYXQtbnVtYmVycycgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgc3RlcCAgICAgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1zdGVwJyApICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1wbGFjZXMnICk7XG5cdFx0XHRcdGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gJGl0ZW0uYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBtaW5WYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBtYXhWYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCAkbWluVmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWluLXZhbHVlJyApO1xuXHRcdFx0XHRjb25zdCAkbWF4VmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWF4LXZhbHVlJyApO1xuXG5cdFx0XHRcdGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBzbGlkZXJJZCApO1xuXG5cdFx0XHRcdG5vVWlTbGlkZXIuY3JlYXRlKCBzbGlkZXIsIHtcblx0XHRcdFx0XHRzdGFydDogWyBtaW5WYWx1ZSwgbWF4VmFsdWUgXSxcblx0XHRcdFx0XHRzdGVwLFxuXHRcdFx0XHRcdGNvbm5lY3Q6IHRydWUsXG5cdFx0XHRcdFx0Y3NzUHJlZml4OiAnd2NhcGYtbm91aS0nLFxuXHRcdFx0XHRcdHJhbmdlOiB7XG5cdFx0XHRcdFx0XHQnbWluJzogcmFuZ2VNaW5WYWx1ZSxcblx0XHRcdFx0XHRcdCdtYXgnOiByYW5nZU1heFZhbHVlLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAndXBkYXRlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHRsZXQgbWluVmFsdWU7XG5cdFx0XHRcdFx0bGV0IG1heFZhbHVlO1xuXG5cdFx0XHRcdFx0aWYgKCBmb3JtYXROdW1iZXJzICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSBudW1iZXJGb3JtYXQoIHZhbHVlc1sgMCBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSBudW1iZXJGb3JtYXQoIHZhbHVlc1sgMSBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMSBdICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCAncGxhaW5fdGV4dCcgPT09IGRpc3BsYXlWYWx1ZXNBcyApIHtcblx0XHRcdFx0XHRcdCRtaW5WYWx1ZS5odG1sKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdFx0JG1heFZhbHVlLmh0bWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRtaW5WYWx1ZS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0XHQkbWF4VmFsdWUudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1ub3Vpc2xpZGVyLXVwZGF0ZScsIFsgJGl0ZW0sIHZhbHVlcyBdICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRmdW5jdGlvbiBmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdFx0Y29uc3QgX21pblZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAwIF0gKTtcblx0XHRcdFx0XHRjb25zdCBfbWF4VmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDEgXSApO1xuXG5cdFx0XHRcdFx0Ly8gSWYgdmFsdWUgaXMgbm90IGNoYW5nZWQgdGhlbiBkb24ndCBwcm9jZWVkLlxuXHRcdFx0XHRcdGlmICggX21pblZhbHVlID09PSBtaW5WYWx1ZSAmJiBfbWF4VmFsdWUgPT09IG1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggX21pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIF9tYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdC8vIFJlbW92ZSByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkaXRlbS5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBBZGQgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0Y29uc3QgdXJsID0gJGl0ZW0uZGF0YSggJ3VybCcgKS5yZXBsYWNlKCAnJTFzJywgX21pblZhbHVlICkucmVwbGFjZSggJyUycycsIF9tYXhWYWx1ZSApO1xuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICdjaGFuZ2UnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0JG1pblZhbHVlLm9uKCAnaW5wdXQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRcdCRpbnB1dC5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5zZXQoIFsgbWluVmFsdWUsIG51bGwgXSApO1xuXG5cdFx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtYXhWYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG51bGwsIG1heFZhbHVlIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0V0NBUEYuaW5pdENvbWJvYm94KCk7XG5cdFx0XHRXQ0FQRi5pbml0UmFuZ2VTbGlkZXIoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gSGFuZGxlIHRoZSBwb3BzdGF0ZSBldmVudChicm93c2VyJ3MgYmFjay9mb3J3YXJkKVxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3BvcHN0YXRlJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0aWYgKCBudWxsICE9PSBlLnN0YXRlICYmIGUuc3RhdGUuaGFzT3duUHJvcGVydHkoICd3Y2FwZicgKSApIHtcblx0XHRcdFdDQVBGLmZpbHRlclByb2R1Y3RzKCAncG9wc3RhdGUnICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzMwMDQ5MTdcblx0aWYgKCAnc2Nyb2xsUmVzdG9yYXRpb24nIGluIGhpc3RvcnkgKSB7XG5cdFx0aGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvbiA9ICdtYW51YWwnO1xuXHR9XG5cbn0oIGpRdWVyeSwgd2luZG93ICkgKTtcblxuKCBmdW5jdGlvbiggJCwgV0NBUEYgKSB7XG5cblx0V0NBUEYuaW5pdCgpO1xuXG5cdFdDQVBGLmhhbmRsZUZpbHRlckFjY29yZGlvbigpO1xuXHRXQ0FQRi5oYW5kbGVIaWVyYXJjaHlUb2dnbGUoKTtcblx0V0NBUEYuaGFuZGxlU29mdExpbWl0KCk7XG5cdFdDQVBGLmhhbmRsZVNlYXJjaEZpbHRlck9wdGlvbnMoKTtcblxuXHRXQ0FQRi5oYW5kbGVMaXN0RmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVEcm9wZG93bkZpbHRlcnMoKTtcblx0V0NBUEYuaGFuZGxlTnVtYmVySW5wdXRGaWx0ZXJzKCk7XG5cdFdDQVBGLmhhbmRsZVBhZ2luYXRpb24oKTtcblx0V0NBUEYuaGFuZGxlRGVmYXVsdE9yZGVyYnkoKTtcblxuXHRXQ0FQRi5oYW5kbGVSZXNldEZpbHRlcnMoKTtcblx0V0NBUEYuaGFuZGxlQ2xlYXJGaWx0ZXIoKTtcblxuXHRXQ0FQRi5oYW5kbGVGaWx0ZXJUb29sdGlwKCk7XG5cbn0oIGpRdWVyeSwgd2luZG93LldDQVBGICkgKTtcbiIsIi8qKlxuICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzQxNDE4MTNcbiAqXG4gKiBAcGFyYW0gbnVtYmVyXG4gKiBAcGFyYW0gZGVjaW1hbHNcbiAqIEBwYXJhbSBkZWNfcG9pbnRcbiAqIEBwYXJhbSB0aG91c2FuZHNfc2VwXG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gbnVtYmVyRm9ybWF0KCBudW1iZXIsIGRlY2ltYWxzLCBkZWNfcG9pbnQsIHRob3VzYW5kc19zZXAgKSB7XG5cdC8vIFN0cmlwIGFsbCBjaGFyYWN0ZXJzIGJ1dCBudW1lcmljYWwgb25lcy5cblx0bnVtYmVyID0gKCBudW1iZXIgKyAnJyApLnJlcGxhY2UoIC9bXlxcZCtcXC1FZS5dL2csICcnICk7XG5cblx0Y29uc3QgbiAgICA9ICEgaXNGaW5pdGUoICtudW1iZXIgKSA/IDAgOiArbnVtYmVyO1xuXHRjb25zdCBwcmVjID0gISBpc0Zpbml0ZSggK2RlY2ltYWxzICkgPyAwIDogTWF0aC5hYnMoIGRlY2ltYWxzICk7XG5cdGNvbnN0IHNlcCAgPSAoIHR5cGVvZiB0aG91c2FuZHNfc2VwID09PSAndW5kZWZpbmVkJyApID8gJywnIDogdGhvdXNhbmRzX3NlcDtcblx0Y29uc3QgZGVjICA9ICggdHlwZW9mIGRlY19wb2ludCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcuJyA6IGRlY19wb2ludDtcblxuXHRsZXQgcztcblxuXHRjb25zdCB0b0ZpeGVkRml4ID0gZnVuY3Rpb24oIG4sIHByZWMgKSB7XG5cdFx0Y29uc3QgayA9IE1hdGgucG93KCAxMCwgcHJlYyApO1xuXHRcdHJldHVybiAnJyArIE1hdGgucm91bmQoIG4gKiBrICkgLyBrO1xuXHR9O1xuXG5cdC8vIEZpeCBmb3IgSUUgcGFyc2VGbG9hdCgwLjU1KS50b0ZpeGVkKDApID0gMDtcblx0cyA9ICggcHJlYyA/IHRvRml4ZWRGaXgoIG4sIHByZWMgKSA6ICcnICsgTWF0aC5yb3VuZCggbiApICkuc3BsaXQoICcuJyApO1xuXG5cdGlmICggc1sgMCBdLmxlbmd0aCA+IDMgKSB7XG5cdFx0c1sgMCBdID0gc1sgMCBdLnJlcGxhY2UoIC9cXEIoPz0oPzpcXGR7M30pKyg/IVxcZCkpL2csIHNlcCApO1xuXHR9XG5cblx0aWYgKCAoIHNbIDEgXSB8fCAnJyApLmxlbmd0aCA8IHByZWMgKSB7XG5cdFx0c1sgMSBdID0gc1sgMSBdIHx8ICcnO1xuXHRcdHNbIDEgXSArPSBuZXcgQXJyYXkoIHByZWMgLSBzWyAxIF0ubGVuZ3RoICsgMSApLmpvaW4oICcwJyApO1xuXHR9XG5cblx0cmV0dXJuIHMuam9pbiggZGVjICk7XG59XG5cbmZ1bmN0aW9uIGNsZWFuVXJsKCB1cmwgKSB7XG5cdHJldHVybiB1cmwucmVwbGFjZSggLyUyQy9nLCAnLCcgKTtcbn1cblxuZnVuY3Rpb24gZ2V0T3JkZXJCeVVybCggdXJsICkge1xuXHRjb25zdCBwYWdlZCA9IHBhcnNlSW50KCB1cmwucmVwbGFjZSggLy4rXFwvcGFnZVxcLyhcXGQrKSsvLCAnJDEnICkgKTtcblxuXHRpZiAoIHBhZ2VkICkge1xuXHRcdHVybCA9IHVybC5yZXBsYWNlKCAvcGFnZVxcLyhcXGQrKVxcLy8sICcnICk7XG5cdH1cblxuXHRyZXR1cm4gY2xlYW5VcmwoIHVybCApO1xufVxuIl19
