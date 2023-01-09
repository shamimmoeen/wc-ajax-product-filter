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
  'update_title_tag': '',
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

          return;
        }

        var index = 0;
        $filter.addClass('search-active');
        $.each($inner.find('.wcapf-filter-options > li'), function () {
          var $filterItem = $(this);
          var label = $filterItem.find('.wcapf-filter-item-label').data('label');

          if (label.toLowerCase().includes(keyword.toLowerCase())) {
            $filterItem.addClass('keyword-matched');

            if (softLimitEnabled) {
              index++;

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
          }
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
      WCAPF.resetLoadingAnimation(); // Maybe good for performance.

      WCAPF.destroyTippyInstances();
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

          if (wcapf_params.update_title_tag) {
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

      var options = {
        inherit_select_classes: true,
        inherit_option_classes: true,
        no_results_text: wcapf_params.chosen_no_results_text,
        options_none_text: wcapf_params.chosen_options_none_text,
        search_contains: true // Match from anywhere in string.

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
        } // Enable templating when showing count.


        if ($this.hasClass('with-count')) {
          options['templateResult'] = templateResult;
          options['templateSelection'] = templateSelection;
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
    initFilterOptionTooltip: function initFilterOptionTooltip() {
      if ('function' !== typeof tippy) {
        return;
      }

      if (!wcapf_params.use_tippyjs) {
        return;
      }

      var tooltipPositions = ['top', 'right', 'bottom', 'left'];
      tooltipPositions.forEach(function (tooltipPosition) {
        var identifier = 'data-wcapf-tooltip-' + tooltipPosition;
        var instances = tippy('[' + identifier + ']', {
          placement: tooltipPosition,
          content: function content(reference) {
            return reference.getAttribute(identifier);
          }
        });
        window.tippyInstances = tippyInstances.concat(instances);
      });
    },
    init: function init() {
      WCAPF.initCombobox();
      WCAPF.initRangeSlider();
      WCAPF.initFilterOptionTooltip();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbHRlci1mb3JtLmpzIiwicmVmYWN0b3JlZC5qcyIsInV0aWxzLmpzIl0sIm5hbWVzIjpbIndjYXBmX3BhcmFtcyIsImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwiJGJvZHkiLCJyYW5nZVZhbHVlc1NlcGFyYXRvciIsIl9kZWxheSIsInBhcnNlSW50IiwiZmlsdGVyX2lucHV0X2RlbGF5IiwiZGVsYXkiLCJmaWVsZHMiLCJ3Y2FwZlNpbmdsZUZpbHRlclNlbGVjdG9yIiwid2NhcGZOYXZGaWx0ZXJTZWxlY3RvciIsIndjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJTZWxlY3RvciIsIndjYXBmRGF0ZUZpbHRlclNlbGVjdG9yIiwiJHdjYXBmU2luZ2xlRmlsdGVycyIsIiR3Y2FwZk5hdkZpbHRlcnMiLCIkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMiLCIkd2NhcGZEYXRlRmlsdGVycyIsImVhY2giLCIkZmllbGQiLCJpZCIsImF0dHIiLCIkd3JhcHBlciIsImZpbmQiLCJmaWx0ZXJLZXkiLCJtdWx0aXBsZUZpbHRlciIsImluaXRDaG9zZW4iLCJjaG9zZW4iLCIkcm9vdCIsImZvcl9wcmV2aWV3IiwiJHRoaXMiLCJvcHRpb25zIiwiaW5oZXJpdF9zZWxlY3RfY2xhc3NlcyIsImluaGVyaXRfb3B0aW9uX2NsYXNzZXMiLCJpc19ydGwiLCJub1Jlc3VsdHNNZXNzYWdlIiwic2VhcmNoVGhyZXNob2xkIiwiY2hvc2VuX2xpYl9zZWFyY2hfdGhyZXNob2xkIiwiaW5pdEhpZXJhcmNoeUFjY29yZGlvbiIsInRvZ2dsZUFjY29yZGlvbiIsIiRlbCIsInByZXNzZWQiLCIkY2hpbGQiLCJjbG9zZXN0IiwiY2hpbGRyZW4iLCJlbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uIiwic2xpZGVUb2dnbGUiLCJoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsInRvZ2dsZSIsIm9uIiwiZSIsImtleSIsInByZXZlbnREZWZhdWx0IiwibnVtYmVyX2Zvcm1hdCIsIm51bWJlciIsImRlY2ltYWxzIiwiZGVjX3BvaW50IiwidGhvdXNhbmRzX3NlcCIsInJlcGxhY2UiLCJuIiwiaXNGaW5pdGUiLCJwcmVjIiwiTWF0aCIsImFicyIsInNlcCIsImRlYyIsInMiLCJ0b0ZpeGVkRml4IiwiayIsInBvdyIsInJvdW5kIiwic3BsaXQiLCJsZW5ndGgiLCJBcnJheSIsImpvaW4iLCJpbml0Tm9VSVNsaWRlciIsIm5vVWlTbGlkZXIiLCIkaXRlbSIsIiRzbGlkZXIiLCJoYXNDbGFzcyIsInNsaWRlcklkIiwiZGlzcGxheVZhbHVlc0FzIiwiZm9ybWF0TnVtYmVycyIsInJhbmdlTWluVmFsdWUiLCJwYXJzZUZsb2F0IiwicmFuZ2VNYXhWYWx1ZSIsInN0ZXAiLCJkZWNpbWFsUGxhY2VzIiwidGhvdXNhbmRTZXBhcmF0b3IiLCJkZWNpbWFsU2VwYXJhdG9yIiwibWluVmFsdWUiLCJtYXhWYWx1ZSIsIiRtaW5WYWx1ZSIsIiRtYXhWYWx1ZSIsInNsaWRlciIsImdldEVsZW1lbnRCeUlkIiwiY3JlYXRlIiwic3RhcnQiLCJjb25uZWN0IiwiY3NzUHJlZml4IiwicmFuZ2UiLCJ2YWx1ZXMiLCJodG1sIiwidmFsIiwidHJpZ2dlciIsImZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIiLCJyZXF1ZXN0RmlsdGVyIiwiZGF0YSIsInVybCIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJyZW1vdmVEYXRhIiwiZXZlbnQiLCIkaW5wdXQiLCJzZXQiLCJnZXQiLCJmaWx0ZXJCeURhdGUiLCIkd2NhcGZEYXRlRmlsdGVyIiwiaXNSYW5nZSIsImZpbHRlclZhbHVlIiwicnVuRmlsdGVyIiwiZnJvbSIsInRvIiwidXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIiLCJxdWVyeSIsInJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsImZpbHRlclByb2R1Y3RzIiwiaW5pdERhdGVwaWNrZXIiLCJkYXRlcGlja2VyIiwiZm9ybWF0IiwieWVhckRyb3Bkb3duIiwibW9udGhEcm9wZG93biIsIiRmcm9tIiwiJHRvIiwiZGF0ZUZvcm1hdCIsImNoYW5nZVllYXIiLCJjaGFuZ2VNb250aCIsImluaXREZWZhdWx0T3JkZXJCeSIsImF0dGFjaF9jaG9zZW5fb25fc29ydGluZyIsInNvcnRpbmdfY29udHJvbCIsIiRvcmRlcmluZ0Zvcm0iLCJzdWJtaXQiLCJvcmRlciIsImZpbHRlcl9rZXkiLCJ1cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0IiwiJHJlc3VsdHMiLCJzZWxlY3RvciIsInNob3BfbG9vcF9jb250YWluZXIiLCJuZXdQcm9kdWN0Q291bnQiLCJzaG93TG9hZGluZ0FuaW1hdGlvbiIsImxvYWRpbmdfYW5pbWF0aW9uIiwiTG9hZGluZ092ZXJsYXkiLCJsb2FkaW5nX292ZXJsYXlfb3B0aW9ucyIsImRpc2FibGVOb1VpU2xpZGVycyIsImVsZW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJkaXNhYmxlTGFiZWxzIiwic2VsZWN0b3JzIiwiYWRkQ2xhc3MiLCJkaXNhYmxlSW5wdXRzIiwiZGlzYWJsZV9pbnB1dHNfd2hpbGVfZmV0Y2hpbmdfcmVzdWx0cyIsImlucHV0cyIsImVuYWJsZU5vVWlTbGlkZXJzIiwicmVtb3ZlQXR0cmlidXRlIiwiZW5hYmxlSW5wdXRzIiwicmVtb3ZlQXR0ciIsInJlc2V0TG9hZGluZ0FuaW1hdGlvbiIsInNjcm9sbFRvIiwic2Nyb2xsX3dpbmRvdyIsInNjcm9sbEZvciIsInNjcm9sbF93aW5kb3dfZm9yIiwiaXNNb2JpbGUiLCJpc19tb2JpbGUiLCJwcm9jZWVkIiwiYWRqdXN0aW5nT2Zmc2V0Iiwib2Zmc2V0Iiwic2Nyb2xsX3RvX3RvcF9vZmZzZXQiLCJjb250YWluZXIiLCJub3RfZm91bmRfY29udGFpbmVyIiwic2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudCIsIiRjb250YWluZXIiLCJ0b3AiLCJzdG9wIiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsInNjcm9sbF90b190b3Bfc3BlZWQiLCJzY3JvbGxfdG9fdG9wX2Vhc2luZyIsImJlZm9yZUZldGNoaW5nUHJvZHVjdHMiLCJzY3JvbGxfd2luZG93X3doZW4iLCJiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzIiwiYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzIiwiZm9yY2VSZVJlbmRlciIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsIiRkYXRhIiwiZmllbGRJRCIsIiRpbm5lciIsIl9maWVsZCIsImZpZWxkQ2xhc3NlcyIsInByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUiLCJpdGVtVmFsdWUiLCJwYXJlbnQiLCJ0b2dnbGVTZWxlY3RvciIsInVsU2VsZWN0b3IiLCJfY2xhc3NlcyIsInNob3ciLCJfaHRtbCIsInNvZnRMaW1pdFNlbGVjdG9yIiwidHJpbSIsIiRzaG9wTG9vcENvbnRhaW5lciIsIiRub3RGb3VuZENvbnRhaW5lciIsImdldFVybFZhcnMiLCJ2YXJzIiwiaGFzaCIsInJlcGxhY2VBbGwiLCJoYXNoZXMiLCJzbGljZSIsImluZGV4T2YiLCJoTGVuZ3RoIiwiaSIsImZpeFBhZ2luYXRpb24iLCJwYXJhbXMiLCJjdXJyZW50UGFnZUluVXJsIiwiY3VycmVudFBhZ2VJblBhcmFtcyIsInZhbHVlIiwicHVzaEhpc3RvcnkiLCJyZSIsIlJlZ0V4cCIsInNlcGFyYXRvciIsInVybFdpdGhRdWVyeSIsIm1hdGNoIiwib2xkUGFyYW1zIiwib2xkUGFyYW1zTGVuZ3RoIiwiT2JqZWN0Iiwia2V5cyIsInN0YXJ0UG9zaXRpb24iLCJmaWx0ZXJLZXlQb3NpdGlvbiIsImNsZWFuVXJsIiwiY2xlYW5RdWVyeSIsIm5ld1BhcmFtcyIsIm1ha2VQYXJhbWV0ZXJzIiwiZm9yY2VSZXJlbmRlciIsInZhbHVlU2VwYXJhdG9yIiwibmV4dFZhbHVlcyIsImVtcHR5VmFsdWUiLCJwcmV2VmFsdWVzIiwicHJldlZhbHVlc0FycmF5IiwiZm91bmQiLCJpbkFycmF5Iiwic3BsaWNlIiwicHVzaCIsInNpbmdsZUZpbHRlciIsImVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4IiwicGFnaW5hdGlvbl9jb250YWluZXIiLCJoYW5kbGVGaWx0ZXJSZXF1ZXN0IiwiZmllbGREYXRhIiwiJHNlbGVjdCIsImZpbHRlclVSTCIsImNsZWFyRmlsdGVyVVJMIiwidG9TdHJpbmciLCJyYW5nZU51bWJlclNlbGVjdG9ycyIsIiRyYW5nZU51bWJlciIsImdldFZhbHVlIiwiZmxvYXRWYWx1ZSIsImlzTmFOIiwicmVzZXRGaWx0ZXJzIiwiJGJ1dHRvbiIsIl9maWx0ZXJLZXlzIiwiZmlsdGVyS2V5cyIsInByZXZVcmwiLCJuZXdVcmwiLCJhcHBseV9maWx0ZXJzX29uX2Jyb3dzZXJfaGlzdG9yeV9jaGFuZ2UiLCJiaW5kIiwiaW5zdGFuY2VJZHMiLCJmb2N1c2VkRWxtIiwidGlwcHlJbnN0YW5jZXMiLCJXQ0FQRiIsImhhbmRsZUZpbHRlckFjY29yZGlvbiIsIiRmaWx0ZXJJbm5lciIsImVuYWJsZV9hbmltYXRpb25fZm9yX2ZpbHRlcl9hY2NvcmRpb24iLCJmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsInN0b3BQcm9wYWdhdGlvbiIsIiR0cmlnZ2VyIiwiaGFuZGxlSGllcmFyY2h5VG9nZ2xlIiwiaGFuZGxlU29mdExpbWl0IiwidG9nZ2xlRmlsdGVyT3B0aW9ucyIsIiRsaXN0V3JhcHBlciIsInJlbW92ZUNsYXNzIiwiaGFuZGxlU2VhcmNoRmlsdGVyT3B0aW9ucyIsIiR0aGF0IiwiJGZpbHRlciIsInNvZnRMaW1pdEVuYWJsZWQiLCJzb2Z0TGltaXRUb2dnbGUiLCJ2aXNpYmxlT3B0aW9ucyIsImtleXdvcmQiLCJpbmRleCIsIiRmaWx0ZXJJdGVtIiwibGFiZWwiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiaGlkZSIsIiRyZXNwb25zZSIsIm5ld0NvdW50IiwiaGFzIiwidHJpZ2dlcmVkQnkiLCJhbGxvd2VkIiwic2Nyb2xsV2hlbiIsImRpc2FibGVfc2Nyb2xsX2FuaW1hdGlvbiIsImFjdGl2ZUVsZW1lbnQiLCJpbW1lZGlhdGVfc2Nyb2xsX29uX3BhZ2luYXRlIiwiZGVzdHJveVRpcHB5SW5zdGFuY2VzIiwidXNlX3RpcHB5anMiLCJmb3JFYWNoIiwiaW5zdGFuY2UiLCJkZXN0cm95IiwicmVzdG9yZV9mb2N1c19hZnRlcl9maWx0ZXJpbmciLCJib2R5IiwiZm9jdXMiLCJpbml0IiwiYWpheCIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsInVwZGF0ZV90aXRsZV90YWciLCJ0aXRsZSIsImZpbHRlciIsInRleHQiLCJpbnN0YW5jZUlkIiwiJGluc3RhbmNlIiwiX2luc3RhbmNlIiwiX2luc3RhbmNlQ2xhc3NlcyIsInByZXNlcnZlX3NvZnRfbGltaXRfc3RhdGUiLCJjbGVhckJ0blNlbGVjdG9yIiwiY2xlYXJGaWx0ZXJVcmwiLCJob3N0bmFtZSIsIndjYXBmIiwiaGFuZGxlTnVtYmVySW5wdXRGaWx0ZXJzIiwib2xkTWluVmFsdWUiLCJvbGRNYXhWYWx1ZSIsIm51bWJlckZvcm1hdCIsImhhbmRsZUxpc3RGaWx0ZXJzIiwibmF0aXZlSW5wdXRzIiwiY3VzdG9tUmFkaW9TZWxlY3RvciIsIm5vdCIsInByb3AiLCJoYW5kbGVEcm9wZG93bkZpbHRlcnMiLCJoYW5kbGVQYWdpbmF0aW9uIiwiaGFuZGxlRGVmYXVsdE9yZGVyYnkiLCJVUkwiLCJzZWFyY2hQYXJhbXMiLCJnZXRPcmRlckJ5VXJsIiwiaGFuZGxlUmVzZXRGaWx0ZXJzIiwiY29uc29sZSIsImxvZyIsImhhbmRsZUNsZWFyRmlsdGVyIiwiaGFuZGxlRmlsdGVyVG9vbHRpcCIsInRpcHB5IiwicGxhY2VtZW50IiwiY29udGVudCIsInJlZmVyZW5jZSIsImdldEF0dHJpYnV0ZSIsImFsbG93SFRNTCIsImluaXRDb21ib2JveCIsImNob3NlbldDQVBGIiwidGVtcGxhdGVSZXN1bHQiLCJ0ZW1wbGF0ZVNlbGVjdGlvbiIsImNvdW50Iiwibm9fcmVzdWx0c190ZXh0IiwiY2hvc2VuX25vX3Jlc3VsdHNfdGV4dCIsIm9wdGlvbnNfbm9uZV90ZXh0IiwiY2hvc2VuX29wdGlvbnNfbm9uZV90ZXh0Iiwic2VhcmNoX2NvbnRhaW5zIiwiY2hvc2VuX2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucyIsImRpc2FibGVTZWFyY2giLCJzZWFyY2hfYm94X2luX2RlZmF1bHRfb3JkZXJieSIsImluaXRSYW5nZVNsaWRlciIsIl9taW5WYWx1ZSIsIl9tYXhWYWx1ZSIsImluaXRGaWx0ZXJPcHRpb25Ub29sdGlwIiwidG9vbHRpcFBvc2l0aW9ucyIsInRvb2x0aXBQb3NpdGlvbiIsImlkZW50aWZpZXIiLCJpbnN0YW5jZXMiLCJjb25jYXQiLCJhZGRFdmVudExpc3RlbmVyIiwic3RhdGUiLCJoYXNPd25Qcm9wZXJ0eSIsInNjcm9sbFJlc3RvcmF0aW9uIiwicGFnZWQiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLFlBQVksR0FBR0EsWUFBWSxJQUFJO0FBQ3BDLFlBQVUsRUFEMEI7QUFFcEMsd0JBQXNCLEVBRmM7QUFHcEMscUNBQW1DLEVBSEM7QUFJcEMsNEJBQTBCLEVBSlU7QUFLcEMsOEJBQTRCLEVBTFE7QUFNcEMsbUNBQWlDLEVBTkc7QUFPcEMsaUNBQStCLEVBUEs7QUFPRDtBQUNuQyx3Q0FBc0MsRUFSRjtBQVNwQywrQkFBNkIsRUFUTztBQVVwQywyQ0FBeUMsRUFWTDtBQVdwQyxzQ0FBb0MsRUFYQTtBQVlwQyx1Q0FBcUMsRUFaRDtBQWFwQyw4Q0FBNEMsRUFiUjtBQWNwQyx5Q0FBdUMsRUFkSDtBQWVwQywwQ0FBd0MsRUFmSjtBQWdCcEMsbUNBQWlDLEVBaEJHO0FBaUJwQyw2QkFBMkIsRUFqQlM7QUFrQnBDLHlCQUF1QixFQWxCYTtBQW1CcEMsMEJBQXdCLEVBbkJZO0FBb0JwQyxrQ0FBZ0MsRUFwQkk7QUFxQnBDLGVBQWEsRUFyQnVCO0FBc0JwQyxpQkFBZSxFQXRCcUI7QUF1QnBDLHlCQUF1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R0ssQ0FBQyxDQUFFLENBQUYsQ0FBRCxDQUFPTSxNQUFkLEdBQXVCLENBQWxDLEVBQXNDRSxJQUF0QyxDQUE0QyxHQUE1QyxDQUFWO0FBQ0E7O0FBRUQsU0FBT1IsQ0FBQyxDQUFDUSxJQUFGLENBQVFULEdBQVIsQ0FBUDtBQUNBOztBQUVELFNBQVMrSyxRQUFULENBQW1CcEksR0FBbkIsRUFBeUI7QUFDeEIsU0FBT0EsR0FBRyxDQUFDbEQsT0FBSixDQUFhLE1BQWIsRUFBcUIsR0FBckIsQ0FBUDtBQUNBOztBQUVELFNBQVN1UyxhQUFULENBQXdCclAsR0FBeEIsRUFBOEI7QUFDN0IsTUFBTTJSLEtBQUssR0FBR2xZLFFBQVEsQ0FBRXVHLEdBQUcsQ0FBQ2xELE9BQUosQ0FBYSxrQkFBYixFQUFpQyxJQUFqQyxDQUFGLENBQXRCOztBQUVBLE1BQUs2VSxLQUFMLEVBQWE7QUFDWjNSLElBQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDbEQsT0FBSixDQUFhLGVBQWIsRUFBOEIsRUFBOUIsQ0FBTjtBQUNBOztBQUVELFNBQU9zTCxRQUFRLENBQUVwSSxHQUFGLENBQWY7QUFDQSIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLXB1YmxpYy1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgZnJvbnRlbmQgZmlsdGVyIGZvcm0uXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvcHVibGljL3NyYy9qc1xuICogQGF1dGhvciAgICAgd3B0b29scy5pb1xuICovXG5cbmNvbnN0IHdjYXBmX3BhcmFtcyA9IHdjYXBmX3BhcmFtcyB8fCB7XG5cdCdpc19ydGwnOiAnJyxcblx0J2ZpbHRlcl9pbnB1dF9kZWxheSc6ICcnLFxuXHQnY2hvc2VuX2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucyc6ICcnLFxuXHQnY2hvc2VuX25vX3Jlc3VsdHNfdGV4dCc6ICcnLFxuXHQnY2hvc2VuX29wdGlvbnNfbm9uZV90ZXh0JzogJycsXG5cdCdzZWFyY2hfYm94X2luX2RlZmF1bHRfb3JkZXJieSc6ICcnLFxuXHQnY2hvc2VuX2xpYl9zZWFyY2hfdGhyZXNob2xkJzogJycsIC8vIHRvZG9cblx0J3ByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUnOiAnJyxcblx0J3ByZXNlcnZlX3NvZnRfbGltaXRfc3RhdGUnOiAnJyxcblx0J2VuYWJsZV9hbmltYXRpb25fZm9yX2ZpbHRlcl9hY2NvcmRpb24nOiAnJyxcblx0J2ZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkJzogJycsXG5cdCdmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmcnOiAnJyxcblx0J2VuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24nOiAnJyxcblx0J2hpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkJzogJycsXG5cdCdoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmcnOiAnJyxcblx0J3Jlc3RvcmVfZm9jdXNfYWZ0ZXJfZmlsdGVyaW5nJzogJycsXG5cdCdsb2FkaW5nX292ZXJsYXlfb3B0aW9ucyc6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9zcGVlZCc6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9lYXNpbmcnOiAnJyxcblx0J2ltbWVkaWF0ZV9zY3JvbGxfb25fcGFnaW5hdGUnOiAnJyxcblx0J2lzX21vYmlsZSc6ICcnLFxuXHQndXNlX3RpcHB5anMnOiAnJyxcblx0J3Nob3BfbG9vcF9jb250YWluZXInOiAnJyxcblx0J25vdF9mb3VuZF9jb250YWluZXInOiAnJyxcblx0J2VuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4JzogJycsXG5cdCdwYWdpbmF0aW9uX2NvbnRhaW5lcic6ICcnLFxuXHQnc29ydGluZ19jb250cm9sJzogJycsXG5cdCdhdHRhY2hfY2hvc2VuX29uX3NvcnRpbmcnOiAnJyxcblx0J2xvYWRpbmdfYW5pbWF0aW9uJzogJycsXG5cdCdzY3JvbGxfd2luZG93JzogJycsXG5cdCdzY3JvbGxfd2luZG93X2Zvcic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd193aGVuJzogJycsXG5cdCdzY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50JzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX29mZnNldCc6ICcnLFxuXHQnZGlzYWJsZV9zY3JvbGxfYW5pbWF0aW9uJzogJycsXG5cdCd1cGRhdGVfdGl0bGVfdGFnJzogJycsXG5cdCdmb3JfcHJldmlldyc6ICcnLFxufTtcblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRyZXR1cm47XG5cblx0Y29uc3QgJGJvZHkgPSAkKCAnYm9keScgKTtcblxuXHRjb25zdCByYW5nZVZhbHVlc1NlcGFyYXRvciA9ICd+JztcblxuXHRjb25zdCBfZGVsYXkgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLmZpbHRlcl9pbnB1dF9kZWxheSApO1xuXHRjb25zdCBkZWxheSAgPSBfZGVsYXkgPj0gMCA/IF9kZWxheSA6IDgwMDtcblxuXHQvLyBTdG9yZSBmaWVsZHMnIGlkIGFuZCBmaWx0ZXIgaW5mb3JtYXRpb24uXG5cdGNvbnN0IGZpZWxkcyA9IHt9O1xuXG5cdGNvbnN0IHdjYXBmU2luZ2xlRmlsdGVyU2VsZWN0b3IgICAgICA9ICcud2NhcGYtc2luZ2xlLWZpbHRlcic7XG5cdGNvbnN0IHdjYXBmTmF2RmlsdGVyU2VsZWN0b3IgICAgICAgICA9ICcud2NhcGYtbmF2LWZpbHRlcic7XG5cdGNvbnN0IHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJTZWxlY3RvciA9ICcud2NhcGYtbnVtYmVyLXJhbmdlLWZpbHRlcic7XG5cdGNvbnN0IHdjYXBmRGF0ZUZpbHRlclNlbGVjdG9yICAgICAgICA9ICcud2NhcGYtZGF0ZS1yYW5nZS1maWx0ZXInO1xuXG5cdGNvbnN0ICR3Y2FwZlNpbmdsZUZpbHRlcnMgICAgICA9ICQoIHdjYXBmU2luZ2xlRmlsdGVyU2VsZWN0b3IgKTtcblx0Y29uc3QgJHdjYXBmTmF2RmlsdGVycyAgICAgICAgID0gJCggd2NhcGZOYXZGaWx0ZXJTZWxlY3RvciApO1xuXHRjb25zdCAkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMgPSAkKCB3Y2FwZk51bWJlclJhbmdlRmlsdGVyU2VsZWN0b3IgKTtcblx0Y29uc3QgJHdjYXBmRGF0ZUZpbHRlcnMgICAgICAgID0gJCggd2NhcGZEYXRlRmlsdGVyU2VsZWN0b3IgKTtcblxuXHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGlkICAgICAgICAgICAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdGNvbnN0ICR3cmFwcGVyICAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZmllbGQtaW5uZXIgPiBkaXYnICk7XG5cdFx0Y29uc3QgZmlsdGVyS2V5ICAgICAgPSAkd3JhcHBlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdGNvbnN0IG11bHRpcGxlRmlsdGVyID0gcGFyc2VJbnQoICR3cmFwcGVyLmF0dHIoICdkYXRhLW11bHRpcGxlLWZpbHRlcicgKSApO1xuXG5cdFx0ZmllbGRzWyBpZCBdID0ge1xuXHRcdFx0ZmlsdGVyS2V5OiBmaWx0ZXJLZXksXG5cdFx0XHRtdWx0aXBsZUZpbHRlcjogbXVsdGlwbGVGaWx0ZXJcblx0XHR9O1xuXHR9ICk7XG5cblx0Ly8gSW5pdGlhbGl6ZSBqUXVlcnkgY2hvc2VuIGxpYnJhcnkuXG5cdGZ1bmN0aW9uIGluaXRDaG9zZW4oKSB7XG5cdFx0aWYgKCAhIGpRdWVyeSgpLmNob3NlbiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgJHJvb3Q7XG5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5mb3JfcHJldmlldyApIHtcblx0XHRcdCRyb290ID0gJCggd2NhcGZOYXZGaWx0ZXJTZWxlY3RvciApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkcm9vdCA9ICR3Y2FwZk5hdkZpbHRlcnM7XG5cdFx0fVxuXG5cdFx0JHJvb3QuZmluZCggJy53Y2FwZi1jaG9zZW4tc2VsZWN0JyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgICA9ICQoIHRoaXMgKTtcblx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7XG5cdFx0XHRcdGluaGVyaXRfc2VsZWN0X2NsYXNzZXM6IHRydWUsXG5cdFx0XHRcdGluaGVyaXRfb3B0aW9uX2NsYXNzZXM6IHRydWUsXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5pc19ydGwgKSB7XG5cdFx0XHRcdG9wdGlvbnNbICdydGwnIF0gPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBub1Jlc3VsdHNNZXNzYWdlID0gJHRoaXMuYXR0ciggJ2RhdGEtbm8tcmVzdWx0cy1tZXNzYWdlJyApO1xuXG5cdFx0XHRpZiAoIG5vUmVzdWx0c01lc3NhZ2UgKSB7XG5cdFx0XHRcdG9wdGlvbnNbICdub19yZXN1bHRzX3RleHQnIF0gPSBub1Jlc3VsdHNNZXNzYWdlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBvcHRpb25zWyAnZGlzYWJsZV9zZWFyY2gnIF0gPSB0cnVlO1xuXG5cdFx0XHRjb25zdCBzZWFyY2hUaHJlc2hvbGQgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLmNob3Nlbl9saWJfc2VhcmNoX3RocmVzaG9sZCApO1xuXG5cdFx0XHRpZiAoIHNlYXJjaFRocmVzaG9sZCApIHtcblx0XHRcdFx0Ly8gb3B0aW9uc1sgJ2Rpc2FibGVfc2VhcmNoX3RocmVzaG9sZCcgXSA9IHNlYXJjaFRocmVzaG9sZDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gb3B0aW9uc1sgJ2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucycgXSA9IGZhbHNlO1xuXG5cdFx0XHQvLyBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogMjBcblxuXHRcdFx0Ly8gb3B0aW9uc1snbWluaW11bVJlc3VsdHNGb3JTZWFyY2gnXSA9IC0xO1xuXG5cdFx0XHQkdGhpcy5jaG9zZW4oIG9wdGlvbnMgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRpbml0Q2hvc2VuKCk7XG5cblx0Ly8gSW5pdGlhbGl6ZSBoaWVyYXJjaHkgYWNjb3JkaW9uLlxuXHRmdW5jdGlvbiBpbml0SGllcmFyY2h5QWNjb3JkaW9uKCkge1xuXHRcdGxldCAkcm9vdDtcblxuXHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0JHJvb3QgPSAkKCB3Y2FwZk5hdkZpbHRlclNlbGVjdG9yICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRyb290ID0gJHdjYXBmTmF2RmlsdGVycztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0b2dnbGVBY2NvcmRpb24oICRlbCApIHtcblx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYnV0dG9uIGlzIHByZXNzZWRcblx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHQvLyBDaGFuZ2UgYXJpYS1wcmVzc2VkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuXHRcdFx0JGVsLmF0dHIoICdhcmlhLXByZXNzZWQnLCAhIHByZXNzZWQgKTtcblxuXHRcdFx0Y29uc3QgJGNoaWxkID0gJGVsLmNsb3Nlc3QoICdsaScgKS5jaGlsZHJlbiggJ3VsJyApO1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uICkge1xuXHRcdFx0XHQkY2hpbGQuc2xpZGVUb2dnbGUoXG5cdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkLFxuXHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5oaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmdcblx0XHRcdFx0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRjaGlsZC50b2dnbGUoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQkcm9vdC5maW5kKCAnLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJyApLm9uKCAnY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0fSApO1xuXG5cdFx0JHJvb3QuZmluZCggJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScgKS5vbiggJ2tleWRvd24nLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdGlmICggZS5rZXkgPT09ICcgJyB8fCBlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJ1NwYWNlYmFyJyApIHtcblx0XHRcdFx0Ly8gUHJldmVudCB0aGUgZGVmYXVsdCBhY3Rpb24gdG8gc3RvcCBzY3JvbGxpbmcgd2hlbiBzcGFjZSBpcyBwcmVzc2VkXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKTtcblxuXHQvKipcblx0ICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzQxNDE4MTNcblx0ICpcblx0ICogQHBhcmFtIG51bWJlclxuXHQgKiBAcGFyYW0gZGVjaW1hbHNcblx0ICogQHBhcmFtIGRlY19wb2ludFxuXHQgKiBAcGFyYW0gdGhvdXNhbmRzX3NlcFxuXHQgKlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfVxuXHQgKi9cblx0ZnVuY3Rpb24gbnVtYmVyX2Zvcm1hdCggbnVtYmVyLCBkZWNpbWFscywgZGVjX3BvaW50LCB0aG91c2FuZHNfc2VwICkge1xuXHRcdC8vIFN0cmlwIGFsbCBjaGFyYWN0ZXJzIGJ1dCBudW1lcmljYWwgb25lcy5cblx0XHRudW1iZXIgPSAoIG51bWJlciArICcnICkucmVwbGFjZSggL1teXFxkK1xcLUVlLl0vZywgJycgKTtcblxuXHRcdGNvbnN0IG4gICAgPSAhIGlzRmluaXRlKCArbnVtYmVyICkgPyAwIDogK251bWJlcjtcblx0XHRjb25zdCBwcmVjID0gISBpc0Zpbml0ZSggK2RlY2ltYWxzICkgPyAwIDogTWF0aC5hYnMoIGRlY2ltYWxzICk7XG5cdFx0Y29uc3Qgc2VwICA9ICggdHlwZW9mIHRob3VzYW5kc19zZXAgPT09ICd1bmRlZmluZWQnICkgPyAnLCcgOiB0aG91c2FuZHNfc2VwO1xuXHRcdGNvbnN0IGRlYyAgPSAoIHR5cGVvZiBkZWNfcG9pbnQgPT09ICd1bmRlZmluZWQnICkgPyAnLicgOiBkZWNfcG9pbnQ7XG5cblx0XHRsZXQgcztcblxuXHRcdGNvbnN0IHRvRml4ZWRGaXggPSBmdW5jdGlvbiggbiwgcHJlYyApIHtcblx0XHRcdGNvbnN0IGsgPSBNYXRoLnBvdyggMTAsIHByZWMgKTtcblx0XHRcdHJldHVybiAnJyArIE1hdGgucm91bmQoIG4gKiBrICkgLyBrO1xuXHRcdH07XG5cblx0XHQvLyBGaXggZm9yIElFIHBhcnNlRmxvYXQoMC41NSkudG9GaXhlZCgwKSA9IDA7XG5cdFx0cyA9ICggcHJlYyA/IHRvRml4ZWRGaXgoIG4sIHByZWMgKSA6ICcnICsgTWF0aC5yb3VuZCggbiApICkuc3BsaXQoICcuJyApO1xuXG5cdFx0aWYgKCBzWyAwIF0ubGVuZ3RoID4gMyApIHtcblx0XHRcdHNbIDAgXSA9IHNbIDAgXS5yZXBsYWNlKCAvXFxCKD89KD86XFxkezN9KSsoPyFcXGQpKS9nLCBzZXAgKTtcblx0XHR9XG5cblx0XHRpZiAoICggc1sgMSBdIHx8ICcnICkubGVuZ3RoIDwgcHJlYyApIHtcblx0XHRcdHNbIDEgXSA9IHNbIDEgXSB8fCAnJztcblx0XHRcdHNbIDEgXSArPSBuZXcgQXJyYXkoIHByZWMgLSBzWyAxIF0ubGVuZ3RoICsgMSApLmpvaW4oICcwJyApO1xuXHRcdH1cblxuXHRcdHJldHVybiBzLmpvaW4oIGRlYyApO1xuXHR9XG5cblx0Ly8gSW5pdGlhbGl6ZSBub1VJU2xpZGVyLlxuXHRmdW5jdGlvbiBpbml0Tm9VSVNsaWRlcigpIHtcblx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgJHJvb3Q7XG5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5mb3JfcHJldmlldyApIHtcblx0XHRcdCRyb290ID0gJCggd2NhcGZOdW1iZXJSYW5nZUZpbHRlclNlbGVjdG9yICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRyb290ID0gJHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzO1xuXHRcdH1cblxuXHRcdCRyb290LmZpbmQoICcud2NhcGYtcmFuZ2Utc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdC8vIFRPRE86IFJlbW92ZSBmaWx0ZXIga2V5LlxuXHRcdFx0Y29uc3QgZmlsdGVyS2V5ID0gJGl0ZW0uYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRcdGNvbnN0ICRzbGlkZXIgICA9ICRpdGVtLmZpbmQoICcud2NhcGYtbm91aS1zbGlkZXInICk7XG5cblx0XHRcdC8vIElmIHNsaWRlciBpcyBhbHJlYWR5IGluaXRpYWxpemVkIHRoZW4gZG9uJ3QgcmVpbml0aWFsaXplIGFnYWluLlxuXHRcdFx0aWYgKCAkc2xpZGVyLmhhc0NsYXNzKCAnd2NhcGYtbm91aS10YXJnZXQnICkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc2xpZGVySWQgICAgICAgICAgPSAkc2xpZGVyLmF0dHIoICdpZCcgKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlWYWx1ZXNBcyAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGlzcGxheS12YWx1ZXMtYXMnICk7XG5cdFx0XHRjb25zdCBmb3JtYXROdW1iZXJzICAgICA9ICRpdGVtLmF0dHIoICdkYXRhLWZvcm1hdC1udW1iZXJzJyApO1xuXHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICkgKTtcblx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRjb25zdCBzdGVwICAgICAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXN0ZXAnICkgKTtcblx0XHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1wbGFjZXMnICk7XG5cdFx0XHRjb25zdCB0aG91c2FuZFNlcGFyYXRvciA9ICRpdGVtLmF0dHIoICdkYXRhLXRob3VzYW5kLXNlcGFyYXRvcicgKTtcblx0XHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1zZXBhcmF0b3InICk7XG5cdFx0XHRjb25zdCBtaW5WYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0Y29uc3QgbWF4VmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdGNvbnN0ICRtaW5WYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5taW4tdmFsdWUnICk7XG5cdFx0XHRjb25zdCAkbWF4VmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWF4LXZhbHVlJyApO1xuXG5cdFx0XHRjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggc2xpZGVySWQgKTtcblxuXHRcdFx0bm9VaVNsaWRlci5jcmVhdGUoIHNsaWRlciwge1xuXHRcdFx0XHRzdGFydDogWyBtaW5WYWx1ZSwgbWF4VmFsdWUgXSxcblx0XHRcdFx0c3RlcCxcblx0XHRcdFx0Y29ubmVjdDogdHJ1ZSxcblx0XHRcdFx0Y3NzUHJlZml4OiAnd2NhcGYtbm91aS0nLFxuXHRcdFx0XHRyYW5nZToge1xuXHRcdFx0XHRcdCdtaW4nOiByYW5nZU1pblZhbHVlLFxuXHRcdFx0XHRcdCdtYXgnOiByYW5nZU1heFZhbHVlLFxuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAndXBkYXRlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0bGV0IG1pblZhbHVlO1xuXHRcdFx0XHRsZXQgbWF4VmFsdWU7XG5cblx0XHRcdFx0aWYgKCBmb3JtYXROdW1iZXJzICkge1xuXHRcdFx0XHRcdG1pblZhbHVlID0gbnVtYmVyX2Zvcm1hdCggdmFsdWVzWyAwIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0bWF4VmFsdWUgPSBudW1iZXJfZm9ybWF0KCB2YWx1ZXNbIDEgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0bWF4VmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDEgXSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCAncGxhaW5fdGV4dCcgPT09IGRpc3BsYXlWYWx1ZXNBcyApIHtcblx0XHRcdFx0XHQkbWluVmFsdWUuaHRtbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHQkbWF4VmFsdWUuaHRtbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkbWluVmFsdWUudmFsKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdCRtYXhWYWx1ZS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGYtbm91aXNsaWRlci11cGRhdGUnLCBbICRpdGVtLCB2YWx1ZXMgXSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRmdW5jdGlvbiBmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAwIF0gKTtcblx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDEgXSApO1xuXG5cdFx0XHRcdGlmICggbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0Ly8gUmVtb3ZlIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRyZXF1ZXN0RmlsdGVyKCAkaXRlbS5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIEFkZCByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0Y29uc3QgdXJsID0gJGl0ZW0uZGF0YSggJ3VybCcgKS5yZXBsYWNlKCAnJTFzJywgbWluVmFsdWUgKS5yZXBsYWNlKCAnJTJzJywgbWF4VmFsdWUgKTtcblx0XHRcdFx0XHRyZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpdGVtLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApO1xuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdCRtaW5WYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBtaW5WYWx1ZSwgbnVsbCBdICk7XG5cblx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdCRtYXhWYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBudWxsLCBtYXhWYWx1ZSBdICk7XG5cblx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdE5vVUlTbGlkZXIoKTtcblxuXHRmdW5jdGlvbiBmaWx0ZXJCeURhdGUoICRpbnB1dCApIHtcblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5mb3JfcHJldmlldyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCAkd2NhcGZEYXRlRmlsdGVyID0gJGlucHV0LmNsb3Nlc3QoICcud2NhcGYtZGF0ZS1pbnB1dCcgKTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdGNvbnN0IGlzUmFuZ2UgICAgICAgICAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWlzLXJhbmdlJyApO1xuXG5cdFx0bGV0IGZpbHRlclZhbHVlID0gJyc7XG5cdFx0bGV0IHJ1bkZpbHRlciAgID0gZmFsc2U7XG5cblx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRjbGVhclRpbWVvdXQoICR3Y2FwZkRhdGVGaWx0ZXIuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRpZiAoIGlzUmFuZ2UgKSB7XG5cdFx0XHRjb25zdCBmcm9tID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKS52YWwoKTtcblx0XHRcdGNvbnN0IHRvICAgPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCBmcm9tICYmIHRvICkge1xuXHRcdFx0XHRmaWx0ZXJWYWx1ZSA9IGZyb20gKyByYW5nZVZhbHVlc1NlcGFyYXRvciArIHRvO1xuXHRcdFx0XHRydW5GaWx0ZXIgICA9IHRydWU7XG5cdFx0XHR9IGVsc2UgaWYgKCAhIGZyb20gJiYgISB0byApIHtcblx0XHRcdFx0cnVuRmlsdGVyID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgZnJvbSA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICkudmFsKCk7XG5cblx0XHRcdGlmICggZnJvbSApIHtcblx0XHRcdFx0ZmlsdGVyVmFsdWUgPSBmcm9tO1xuXHRcdFx0XHRydW5GaWx0ZXIgICA9IHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRydW5GaWx0ZXIgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICggcnVuRmlsdGVyICkge1xuXHRcdFx0JHdjYXBmRGF0ZUZpbHRlci5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JHdjYXBmRGF0ZUZpbHRlci5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0aWYgKCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRcdFx0XHR1cGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGluaXREYXRlcGlja2VyKCkge1xuXHRcdGlmICggISBqUXVlcnkoKS5kYXRlcGlja2VyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCAkcm9vdDtcblxuXHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0JHJvb3QgPSAkKCB3Y2FwZkRhdGVGaWx0ZXJTZWxlY3RvciApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkcm9vdCA9ICR3Y2FwZkRhdGVGaWx0ZXJzO1xuXHRcdH1cblxuXHRcdGNvbnN0ICR3Y2FwZkRhdGVGaWx0ZXIgPSAkcm9vdC5maW5kKCAnLndjYXBmLWRhdGUtaW5wdXQnICk7XG5cblx0XHRjb25zdCBmb3JtYXQgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLWZvcm1hdCcgKTtcblx0XHRjb25zdCB5ZWFyRHJvcGRvd24gID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLXBpY2tlci15ZWFyLWRyb3Bkb3duJyApO1xuXHRcdGNvbnN0IG1vbnRoRHJvcGRvd24gPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtcGlja2VyLW1vbnRoLWRyb3Bkb3duJyApO1xuXG5cdFx0Y29uc3QgJGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApO1xuXHRcdGNvbnN0ICR0byAgID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtdG8taW5wdXQnICk7XG5cblx0XHQkZnJvbS5kYXRlcGlja2VyKCB7XG5cdFx0XHRkYXRlRm9ybWF0OiBmb3JtYXQsXG5cdFx0XHRjaGFuZ2VZZWFyOiB5ZWFyRHJvcGRvd24sXG5cdFx0XHRjaGFuZ2VNb250aDogbW9udGhEcm9wZG93bixcblx0XHR9ICk7XG5cblx0XHQkdG8uZGF0ZXBpY2tlcigge1xuXHRcdFx0ZGF0ZUZvcm1hdDogZm9ybWF0LFxuXHRcdFx0Y2hhbmdlWWVhcjogeWVhckRyb3Bkb3duLFxuXHRcdFx0Y2hhbmdlTW9udGg6IG1vbnRoRHJvcGRvd24sXG5cdFx0fSApO1xuXG5cdFx0JGZyb20ub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblx0XHRcdGZpbHRlckJ5RGF0ZSggJGlucHV0ICk7XG5cdFx0fSApO1xuXG5cdFx0JHRvLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRmaWx0ZXJCeURhdGUoICRpbnB1dCApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGluaXREYXRlcGlja2VyKCk7XG5cblx0ZnVuY3Rpb24gaW5pdERlZmF1bHRPcmRlckJ5KCkge1xuXHRcdC8vIEF0dGFjaCBjaG9zZW4uXG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuYXR0YWNoX2Nob3Nlbl9vbl9zb3J0aW5nICkge1xuXHRcdFx0aWYgKCBqUXVlcnkoKS5jaG9zZW4gKSB7XG5cdFx0XHRcdCRib2R5LmZpbmQoICcud29vY29tbWVyY2Utb3JkZXJpbmcgc2VsZWN0Lm9yZGVyYnknICkuY2hvc2VuKCB7XG5cdFx0XHRcdFx0J2Rpc2FibGVfc2VhcmNoX3RocmVzaG9sZCc6IDE1LFxuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5zb3J0aW5nX2NvbnRyb2wgKSB7XG5cdFx0XHQkYm9keS5maW5kKCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkb3JkZXJpbmdGb3JtID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdCRvcmRlcmluZ0Zvcm0ub24oICdjaGFuZ2UnLCAnc2VsZWN0Lm9yZGVyYnknLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkb3JkZXJpbmdGb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyB0b2RvOiBjaGVjayBpZiBhamF4IGRpc2FibGVkLlxuXHRcdCRib2R5LmZpbmQoICcud29vY29tbWVyY2Utb3JkZXJpbmcnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkb3JkZXJpbmdGb3JtID0gJCggdGhpcyApO1xuXG5cdFx0XHQkb3JkZXJpbmdGb3JtLm9uKCAnc3VibWl0JywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JG9yZGVyaW5nRm9ybS5vbiggJ2NoYW5nZScsICdzZWxlY3Qub3JkZXJieScsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3Qgb3JkZXIgICAgICA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyX2tleSA9ICdvcmRlcmJ5JztcblxuXHRcdFx0XHR1cGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyX2tleSwgb3JkZXIgKTtcblx0XHRcdFx0ZmlsdGVyUHJvZHVjdHMoKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cblxuXHRpbml0RGVmYXVsdE9yZGVyQnkoKTtcblxuXHRmdW5jdGlvbiB1cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0KCAkcmVzdWx0cyApIHtcblx0XHRjb25zdCBzZWxlY3RvciA9ICcud29vY29tbWVyY2UtcmVzdWx0LWNvdW50JztcblxuXHRcdGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5maW5kKCBzZWxlY3RvciApLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBuZXdQcm9kdWN0Q291bnQgPSAkcmVzdWx0cy5maW5kKCBzZWxlY3RvciApLmh0bWwoKTtcblxuXHRcdCRib2R5LmZpbmQoIHNlbGVjdG9yICkuaHRtbCggbmV3UHJvZHVjdENvdW50ICk7XG5cdH1cblxuXHRmdW5jdGlvbiBzaG93TG9hZGluZ0FuaW1hdGlvbigpIHtcblx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLmxvYWRpbmdfYW5pbWF0aW9uICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCQuTG9hZGluZ092ZXJsYXkoICdzaG93Jywgd2NhcGZfcGFyYW1zLmxvYWRpbmdfb3ZlcmxheV9vcHRpb25zICk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNhYmxlTm9VaVNsaWRlcnMoKSB7XG5cdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG5vVWlTbGlkZXIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzLmZpbmQoICcud2NhcGYtbm91aS1zbGlkZXInICkuZWFjaCggZnVuY3Rpb24oIGUsIGVsZW1lbnQgKSB7XG5cdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZSggJ2Rpc2FibGVkJywgdHJ1ZSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGRpc2FibGVMYWJlbHMoKSB7XG5cdFx0Y29uc3Qgc2VsZWN0b3JzID0gJy53Y2FwZi1sYWJlbGVkLW5hdiAuaXRlbSwgLndjYXBmLWFjdGl2ZS1maWx0ZXJzIC5pdGVtJztcblxuXHRcdC8vIFRPRE86IEFkZCBkaXNhYmxlZCBhdHRyaWJ1dGUuXG5cdFx0JHdjYXBmU2luZ2xlRmlsdGVycy5maW5kKCBzZWxlY3RvcnMgKS5hZGRDbGFzcyggJ2Rpc2FibGVkJyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzYWJsZUlucHV0cygpIHtcblx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLmRpc2FibGVfaW5wdXRzX3doaWxlX2ZldGNoaW5nX3Jlc3VsdHMgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgaW5wdXRzID0gJ2lucHV0LCBzZWxlY3QnO1xuXG5cdFx0JHdjYXBmU2luZ2xlRmlsdGVycy5maW5kKCBpbnB1dHMgKS5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0JHdjYXBmU2luZ2xlRmlsdGVycy5maW5kKCBpbnB1dHMgKS50cmlnZ2VyKCAnY2hvc2VuOnVwZGF0ZWQnICk7XG5cblx0XHRkaXNhYmxlTm9VaVNsaWRlcnMoKTtcblx0XHRkaXNhYmxlTGFiZWxzKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBlbmFibGVOb1VpU2xpZGVycygpIHtcblx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMuZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbiggZSwgZWxlbWVudCApIHtcblx0XHRcdGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCAnZGlzYWJsZWQnICk7XG5cdFx0fSApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZW5hYmxlSW5wdXRzKCkge1xuXHRcdGlmICggISB3Y2FwZl9wYXJhbXMuZGlzYWJsZV9pbnB1dHNfd2hpbGVfZmV0Y2hpbmdfcmVzdWx0cyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpbnB1dHMgPSAnaW5wdXQnO1xuXG5cdFx0JHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzLmZpbmQoIGlucHV0cyApLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHQkd2NhcGZEYXRlRmlsdGVycy5maW5kKCBpbnB1dHMgKS5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cblx0XHRlbmFibGVOb1VpU2xpZGVycygpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVzZXRMb2FkaW5nQW5pbWF0aW9uKCkge1xuXHRcdGlmICggISB3Y2FwZl9wYXJhbXMubG9hZGluZ19hbmltYXRpb24gKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JC5Mb2FkaW5nT3ZlcmxheSggJ2hpZGUnICk7XG5cdH1cblxuXHRmdW5jdGlvbiBzY3JvbGxUbygpIHtcblx0XHRpZiAoICdub25lJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3Qgc2Nyb2xsRm9yID0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfZm9yO1xuXHRcdGNvbnN0IGlzTW9iaWxlICA9IHdjYXBmX3BhcmFtcy5pc19tb2JpbGU7XG5cdFx0bGV0IHByb2NlZWQgICAgID0gZmFsc2U7XG5cblx0XHRpZiAoICdtb2JpbGUnID09PSBzY3JvbGxGb3IgJiYgaXNNb2JpbGUgKSB7XG5cdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKCAnZGVza3RvcCcgPT09IHNjcm9sbEZvciAmJiAhIGlzTW9iaWxlICkge1xuXHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0fSBlbHNlIGlmICggJ2JvdGgnID09PSBzY3JvbGxGb3IgKSB7XG5cdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAoICEgcHJvY2VlZCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgYWRqdXN0aW5nT2Zmc2V0LCBvZmZzZXQ7XG5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX29mZnNldCApIHtcblx0XHRcdGFkanVzdGluZ09mZnNldCA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKTtcblx0XHR9XG5cblx0XHRsZXQgY29udGFpbmVyO1xuXG5cdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdGNvbnRhaW5lciA9IHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyO1xuXHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXI7XG5cdFx0fVxuXG5cdFx0aWYgKCAnY3VzdG9tJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudDtcblx0XHR9XG5cblx0XHRjb25zdCAkY29udGFpbmVyID0gJCggY29udGFpbmVyICk7XG5cblx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0b2Zmc2V0ID0gJGNvbnRhaW5lci5vZmZzZXQoKS50b3AgLSBhZGp1c3RpbmdPZmZzZXQ7XG5cblx0XHRcdGlmICggb2Zmc2V0IDwgMCApIHtcblx0XHRcdFx0b2Zmc2V0ID0gMDtcblx0XHRcdH1cblxuXHRcdFx0JCggJ2h0bWwsIGJvZHknICkuc3RvcCgpLmFuaW1hdGUoXG5cdFx0XHRcdHsgc2Nyb2xsVG9wOiBvZmZzZXQgfSxcblx0XHRcdFx0d2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfc3BlZWQsXG5cdFx0XHRcdHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX2Vhc2luZ1xuXHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHQvLyBUaGluZ3MgYXJlIGRvbmUgYmVmb3JlIGZldGNoaW5nIHRoZSBwcm9kdWN0cyBsaWtlIHNob3dpbmcgYSBsb2FkaW5nIGluZGljYXRvci5cblx0ZnVuY3Rpb24gYmVmb3JlRmV0Y2hpbmdQcm9kdWN0cygpIHtcblx0XHRkaXNhYmxlSW5wdXRzKCk7XG5cdFx0c2hvd0xvYWRpbmdBbmltYXRpb24oKTtcblxuXHRcdGlmICggJ2ltbWVkaWF0ZWx5JyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfd2hlbiApIHtcblx0XHRcdHNjcm9sbFRvKCk7XG5cdFx0fVxuXG5cdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2JlZm9yZV9mZXRjaGluZ19wcm9kdWN0cycgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGJlZm9yZVVwZGF0aW5nUHJvZHVjdHMoICRyZXN1bHRzICkge1xuXHRcdHJlc2V0TG9hZGluZ0FuaW1hdGlvbigpO1xuXG5cdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2JlZm9yZV91cGRhdGluZ19wcm9kdWN0cycsIFsgJHJlc3VsdHMgXSApO1xuXHR9XG5cblx0Ly8gVGhpbmdzIGFyZSBkb25lIGFmdGVyIGFwcGx5aW5nIHRoZSBmaWx0ZXIgbGlrZSBzY3JvbGwgdG8gdG9wLlxuXHRmdW5jdGlvbiBhZnRlclVwZGF0aW5nUHJvZHVjdHMoICRyZXN1bHRzICkge1xuXHRcdGluaXRDaG9zZW4oKTtcblx0XHRpbml0SGllcmFyY2h5QWNjb3JkaW9uKCk7XG5cdFx0aW5pdE5vVUlTbGlkZXIoKTtcblx0XHRpbml0RGF0ZXBpY2tlcigpO1xuXHRcdGluaXREZWZhdWx0T3JkZXJCeSgpO1xuXHRcdHVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQoICRyZXN1bHRzICk7XG5cdFx0ZW5hYmxlSW5wdXRzKCk7XG5cblx0XHRpZiAoICdhZnRlcicgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X3doZW4gKSB7XG5cdFx0XHRzY3JvbGxUbygpO1xuXHRcdH1cblxuXHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9hZnRlcl91cGRhdGluZ19wcm9kdWN0cycsIFsgJHJlc3VsdHMgXSApO1xuXHR9XG5cblx0Ly8gVGhlIG1haW4gZmlsdGVyIGZ1bmN0aW9uLlxuXHRmdW5jdGlvbiBmaWx0ZXJQcm9kdWN0cyggZm9yY2VSZVJlbmRlciA9IGZhbHNlICkge1xuXHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGJlZm9yZUZldGNoaW5nUHJvZHVjdHMoKTtcblxuXHRcdCQuZ2V0KCB3aW5kb3cubG9jYXRpb24uaHJlZiwgZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRjb25zdCAkZGF0YSA9ICQoIGRhdGEgKTtcblxuXHRcdFx0Ly8gUmVwbGFjZSB0aGUgZmllbGRzJyBkYXRhIHdpdGggbmV3IGRhdGEuXG5cdFx0XHQkLmVhY2goIGZpZWxkcywgZnVuY3Rpb24oIGlkICkge1xuXHRcdFx0XHRjb25zdCBmaWVsZElEICAgID0gJ1tkYXRhLWlkPVwiJyArIGlkICsgJ1wiXSc7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkKCBmaWVsZElEICk7XG5cdFx0XHRcdGNvbnN0ICRpbm5lciAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1maWVsZC1pbm5lcicgKTtcblx0XHRcdFx0Y29uc3QgX2ZpZWxkICAgICA9ICRkYXRhLmZpbmQoIGZpZWxkSUQgKTtcblx0XHRcdFx0bGV0IGZpZWxkQ2xhc3NlcyA9ICQoIF9maWVsZCApLmF0dHIoICdjbGFzcycgKTtcblxuXHRcdFx0XHQvLyBQcmVzZXJ2ZSBoaWVyYXJjaHkgYWNjb3JkaW9uIHN0YXRlLlxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5wcmVzZXJ2ZV9oaWVyYXJjaHlfYWNjb3JkaW9uX3N0YXRlICkge1xuXHRcdFx0XHRcdGlmICggJGZpZWxkLmhhc0NsYXNzKCAnaGllcmFyY2h5LWFjY29yZGlvbicgKSApIHtcblx0XHRcdFx0XHRcdCRmaWVsZC5maW5kKCAnLmhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlLmFjdGl2ZScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgaXRlbVZhbHVlICAgICAgPSAkKCB0aGlzICkucGFyZW50KCkuY2hpbGRyZW4oICdpbnB1dCcgKS52YWwoKTtcblx0XHRcdFx0XHRcdFx0Y29uc3QgdG9nZ2xlU2VsZWN0b3IgPSAnaW5wdXRbdmFsdWU9XCInICsgaXRlbVZhbHVlICsgJ1wiXSB+IC5oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZSc7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHVsU2VsZWN0b3IgICAgID0gJ2lucHV0W3ZhbHVlPVwiJyArIGl0ZW1WYWx1ZSArICdcIl0gfiB1bCc7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IF9jbGFzc2VzICAgICAgID0gJ2hpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlIGFjdGl2ZSc7XG5cblx0XHRcdFx0XHRcdFx0X2ZpZWxkLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuYXR0ciggJ2NsYXNzJywgX2NsYXNzZXMgKTtcblx0XHRcdFx0XHRcdFx0X2ZpZWxkLmZpbmQoIHVsU2VsZWN0b3IgKS5zaG93KCk7XG5cdFx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgX2h0bWwgPSBfZmllbGQuZmluZCggJy53Y2FwZi1maWVsZC1pbm5lcicgKS5odG1sKCk7XG5cblx0XHRcdFx0Ly8gU2hvdyBzb2Z0IGxpbWl0IGl0ZW1zLlxuXHRcdFx0XHRjb25zdCBzb2Z0TGltaXRTZWxlY3RvciA9ICdzaG93LWhpZGRlbi1pdGVtcyc7XG5cblx0XHRcdFx0aWYgKCAkZmllbGQuaGFzQ2xhc3MoIHNvZnRMaW1pdFNlbGVjdG9yICkgKSB7XG5cdFx0XHRcdFx0aWYgKCAhIF9maWVsZC5oYXNDbGFzcyggc29mdExpbWl0U2VsZWN0b3IgKSApIHtcblx0XHRcdFx0XHRcdGZpZWxkQ2xhc3NlcyArPSAnICcgKyBzb2Z0TGltaXRTZWxlY3Rvcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZmllbGRDbGFzc2VzID0gZmllbGRDbGFzc2VzLnJlcGxhY2UoIHNvZnRMaW1pdFNlbGVjdG9yLCAnJyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBmaWVsZCdzIGNsYXNzLlxuXHRcdFx0XHQkZmllbGQuYXR0ciggJ2NsYXNzJywgZmllbGRDbGFzc2VzLnRyaW0oKSApO1xuXG5cdFx0XHRcdC8vIFdoZW4gY2FsbGVkIGZyb20gaGlzdG9yeSBiYWNrIG9yIGZvcndhcmQgcmVxdWVzdCB0aGVuIHJlcmVuZGVyIGFsbCBmaWVsZHMuXG5cdFx0XHRcdGlmICggZm9yY2VSZVJlbmRlciApIHtcblxuXHRcdFx0XHRcdC8vIHVwZGF0ZSBmaWVsZFxuXHRcdFx0XHRcdCRpbm5lci5odG1sKCBfaHRtbCApO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHQvLyBTZWxlY3RpdmVseSByZXJlbmRlciB0aGUgZmllbGRzLlxuXHRcdFx0XHRcdGlmICggJGZpZWxkLmhhc0NsYXNzKCAnd2NhcGYtbmF2LWZpbHRlcicgKSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gdXBkYXRlIGZpZWxkXG5cdFx0XHRcdFx0XHQkaW5uZXIuaHRtbCggX2h0bWwgKTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0JGZpZWxkLnRyaWdnZXIoICd3Y2FwZi1maWVsZC11cGRhdGVkJywgWyBfZmllbGQgXSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzKCAkZGF0YSApO1xuXG5cdFx0XHQvLyBSZXBsYWNlIG9sZCBzaG9wIGxvb3Agd2l0aCBuZXcgb25lLlxuXHRcdFx0Y29uc3QgJHNob3BMb29wQ29udGFpbmVyID0gJGRhdGEuZmluZCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdGNvbnN0ICRub3RGb3VuZENvbnRhaW5lciA9ICRkYXRhLmZpbmQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICk7XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgPT09IHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkge1xuXHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICggJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRhZnRlclVwZGF0aW5nUHJvZHVjdHMoICRkYXRhICk7XG5cdFx0fSApO1xuXHR9XG5cblx0Ly8gVVJMIFBhcnNlclxuXHRmdW5jdGlvbiBnZXRVcmxWYXJzKCB1cmwgKSB7XG5cdFx0bGV0IHZhcnMgPSB7fSwgaGFzaDtcblxuXHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHR1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHR9XG5cblx0XHR1cmwgPSB1cmwucmVwbGFjZUFsbCggJyUyQycsICcsJyApO1xuXG5cdFx0Y29uc3QgaGFzaGVzICA9IHVybC5zbGljZSggdXJsLmluZGV4T2YoICc/JyApICsgMSApLnNwbGl0KCAnJicgKTtcblx0XHRjb25zdCBoTGVuZ3RoID0gaGFzaGVzLmxlbmd0aDtcblxuXHRcdGZvciAoIGxldCBpID0gMDsgaSA8IGhMZW5ndGg7IGkrKyApIHtcblx0XHRcdGhhc2ggPSBoYXNoZXNbIGkgXS5zcGxpdCggJz0nICk7XG5cblx0XHRcdHZhcnNbIGhhc2hbIDAgXSBdID0gaGFzaFsgMSBdO1xuXHRcdH1cblxuXHRcdHJldHVybiB2YXJzO1xuXHR9XG5cblx0Ly8gZXZlcnl0aW1lIHdlIGFwcGx5IHRoZSBmaWx0ZXIgd2Ugc2V0IHRoZSBjdXJyZW50IHBhZ2UgdG8gMVxuXHRmdW5jdGlvbiBmaXhQYWdpbmF0aW9uKCkge1xuXHRcdGxldCB1cmwgICAgICAgICAgICAgICAgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRjb25zdCBwYXJhbXMgICAgICAgICAgID0gZ2V0VXJsVmFycyggdXJsICk7XG5cdFx0Y29uc3QgY3VycmVudFBhZ2VJblVybCA9IHBhcnNlSW50KCB1cmwucmVwbGFjZSggLy4rXFwvcGFnZVxcLyhcXGQrKSsvLCAnJDEnICkgKTtcblxuXHRcdGlmICggY3VycmVudFBhZ2VJblVybCApIHtcblx0XHRcdGlmICggY3VycmVudFBhZ2VJblVybCA+IDEgKSB7XG5cdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCAvcGFnZVxcLyhcXGQrKS8sICdwYWdlLzEnICk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICggdHlwZW9mIHBhcmFtc1sgJ3BhZ2VkJyBdICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdGNvbnN0IGN1cnJlbnRQYWdlSW5QYXJhbXMgPSBwYXJzZUludCggcGFyYW1zWyAncGFnZWQnIF0gKTtcblxuXHRcdFx0aWYgKCBjdXJyZW50UGFnZUluUGFyYW1zID4gMSApIHtcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoICdwYWdlZD0nICsgY3VycmVudFBhZ2VJblBhcmFtcywgJ3BhZ2VkPTEnICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHVybDtcblx0fVxuXG5cdC8vIHVwZGF0ZSBxdWVyeSBzdHJpbmcgZm9yIGNhdGVnb3JpZXMsIG1ldGEgZXRjLi5cblx0ZnVuY3Rpb24gdXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGtleSwgdmFsdWUsIHB1c2hIaXN0b3J5LCB1cmwgKSB7XG5cdFx0aWYgKCB0eXBlb2YgcHVzaEhpc3RvcnkgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0cHVzaEhpc3RvcnkgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHR1cmwgPSBmaXhQYWdpbmF0aW9uKCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmUgICAgICAgID0gbmV3IFJlZ0V4cCggJyhbPyZdKScgKyBrZXkgKyAnPS4qPygmfCQpJywgJ2knICk7XG5cdFx0Y29uc3Qgc2VwYXJhdG9yID0gdXJsLmluZGV4T2YoICc/JyApICE9PSAtMSA/ICcmJyA6ICc/Jztcblx0XHRsZXQgdXJsV2l0aFF1ZXJ5O1xuXG5cdFx0aWYgKCB1cmwubWF0Y2goIHJlICkgKSB7XG5cdFx0XHR1cmxXaXRoUXVlcnkgPSB1cmwucmVwbGFjZSggcmUsICckMScgKyBrZXkgKyAnPScgKyB2YWx1ZSArICckMicgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dXJsV2l0aFF1ZXJ5ID0gdXJsICsgc2VwYXJhdG9yICsga2V5ICsgJz0nICsgdmFsdWU7XG5cdFx0fVxuXG5cdFx0aWYgKCBwdXNoSGlzdG9yeSA9PT0gdHJ1ZSApIHtcblx0XHRcdHJldHVybiBoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCB1cmxXaXRoUXVlcnkgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHVybFdpdGhRdWVyeTtcblx0XHR9XG5cdH1cblxuXHQvLyByZW1vdmUgcGFyYW1ldGVyIGZyb20gdXJsXG5cdGZ1bmN0aW9uIHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIHVybCApIHtcblx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0dXJsID0gZml4UGFnaW5hdGlvbigpO1xuXHRcdH1cblxuXHRcdGNvbnN0IG9sZFBhcmFtcyAgICAgICAgID0gZ2V0VXJsVmFycyggdXJsICk7XG5cdFx0Y29uc3Qgb2xkUGFyYW1zTGVuZ3RoICAgPSBPYmplY3Qua2V5cyggb2xkUGFyYW1zICkubGVuZ3RoO1xuXHRcdGNvbnN0IHN0YXJ0UG9zaXRpb24gICAgID0gdXJsLmluZGV4T2YoICc/JyApO1xuXHRcdGNvbnN0IGZpbHRlcktleVBvc2l0aW9uID0gdXJsLmluZGV4T2YoIGZpbHRlcktleSApO1xuXHRcdGxldCBjbGVhblVybCwgY2xlYW5RdWVyeTtcblxuXHRcdGlmICggb2xkUGFyYW1zTGVuZ3RoID4gMSApIHtcblx0XHRcdGlmICggKCBmaWx0ZXJLZXlQb3NpdGlvbiAtIHN0YXJ0UG9zaXRpb24gKSA+IDEgKSB7XG5cdFx0XHRcdGNsZWFuVXJsID0gdXJsLnJlcGxhY2UoICcmJyArIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0sICcnICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjbGVhblVybCA9IHVybC5yZXBsYWNlKCBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdICsgJyYnLCAnJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBuZXdQYXJhbXMgPSBjbGVhblVybC5zcGxpdCggJz8nICk7XG5cdFx0XHRjbGVhblF1ZXJ5ICAgICAgPSAnPycgKyBuZXdQYXJhbXNbIDEgXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y2xlYW5RdWVyeSA9IHVybC5yZXBsYWNlKCAnPycgKyBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdLCAnJyApO1xuXHRcdH1cblxuXHRcdHJldHVybiBjbGVhblF1ZXJ5O1xuXHR9XG5cblx0Ly8gdGFrZSB0aGUga2V5IGFuZCB2YWx1ZSBhbmQgbWFrZSBxdWVyeVxuXHRmdW5jdGlvbiBtYWtlUGFyYW1ldGVycyggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSwgZm9yY2VSZXJlbmRlciA9IGZhbHNlLCB1cmwgKSB7XG5cdFx0Y29uc3QgdmFsdWVTZXBhcmF0b3IgPSAnLCc7XG5cblx0XHRsZXQgcGFyYW1zLCBuZXh0VmFsdWVzLCBlbXB0eVZhbHVlID0gZmFsc2U7XG5cblx0XHRpZiAoIHR5cGVvZiB1cmwgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0cGFyYW1zID0gZ2V0VXJsVmFycyggdXJsICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBhcmFtcyA9IGdldFVybFZhcnMoKTtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGVvZiBwYXJhbXNbIGZpbHRlcktleSBdICE9ICd1bmRlZmluZWQnICkge1xuXHRcdFx0Y29uc3QgcHJldlZhbHVlcyAgICAgID0gcGFyYW1zWyBmaWx0ZXJLZXkgXTtcblx0XHRcdGNvbnN0IHByZXZWYWx1ZXNBcnJheSA9IHByZXZWYWx1ZXMuc3BsaXQoIHZhbHVlU2VwYXJhdG9yICk7XG5cblx0XHRcdGlmICggcHJldlZhbHVlcy5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRjb25zdCBmb3VuZCA9ICQuaW5BcnJheSggZmlsdGVyVmFsdWUsIHByZXZWYWx1ZXNBcnJheSApO1xuXG5cdFx0XHRcdGlmICggZm91bmQgPj0gMCApIHtcblx0XHRcdFx0XHQvLyBFbGVtZW50IHdhcyBmb3VuZCwgcmVtb3ZlIGl0LlxuXHRcdFx0XHRcdHByZXZWYWx1ZXNBcnJheS5zcGxpY2UoIGZvdW5kLCAxICk7XG5cblx0XHRcdFx0XHRpZiAoIHByZXZWYWx1ZXNBcnJheS5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRcdFx0XHRlbXB0eVZhbHVlID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gRWxlbWVudCB3YXMgbm90IGZvdW5kLCBhZGQgaXQuXG5cdFx0XHRcdFx0cHJldlZhbHVlc0FycmF5LnB1c2goIGZpbHRlclZhbHVlICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHByZXZWYWx1ZXNBcnJheS5sZW5ndGggPiAxICkge1xuXHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBwcmV2VmFsdWVzQXJyYXkuam9pbiggdmFsdWVTZXBhcmF0b3IgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRuZXh0VmFsdWVzID0gcHJldlZhbHVlc0FycmF5O1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRuZXh0VmFsdWVzID0gZmlsdGVyVmFsdWU7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdG5leHRWYWx1ZXMgPSBmaWx0ZXJWYWx1ZTtcblx0XHR9XG5cblx0XHQvLyB1cGRhdGUgdXJsIGFuZCBxdWVyeSBzdHJpbmdcblx0XHRpZiAoICEgZW1wdHlWYWx1ZSApIHtcblx0XHRcdHVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIG5leHRWYWx1ZXMgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgcXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdH1cblxuXHRcdGZpbHRlclByb2R1Y3RzKCBmb3JjZVJlcmVuZGVyICk7XG5cdH1cblxuXHRmdW5jdGlvbiBzaW5nbGVGaWx0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKSB7XG5cdFx0Y29uc3QgcGFyYW1zID0gZ2V0VXJsVmFycygpO1xuXHRcdGxldCBxdWVyeTtcblxuXHRcdGlmICggdHlwZW9mIHBhcmFtc1sgZmlsdGVyS2V5IF0gIT09ICd1bmRlZmluZWQnICYmIHBhcmFtc1sgZmlsdGVyS2V5IF0gPT09IGZpbHRlclZhbHVlICkge1xuXHRcdFx0cXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHF1ZXJ5ID0gdXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIGZhbHNlICk7XG5cdFx0fVxuXG5cdFx0Ly8gdXBkYXRlIHVybFxuXHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRmaWx0ZXJQcm9kdWN0cygpO1xuXHR9XG5cblx0Ly8gSGFuZGxlIHRoZSBwYWdpbmF0aW9uIHJlcXVlc3QgdmlhIGFqYXguXG5cdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4ICYmIHdjYXBmX3BhcmFtcy5wYWdpbmF0aW9uX2NvbnRhaW5lciApIHtcblx0XHRjb25zdCAkY29udGFpbmVyID0gJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRjb25zdCBzZWxlY3RvciAgID0gd2NhcGZfcGFyYW1zLnBhZ2luYXRpb25fY29udGFpbmVyICsgJyBhJztcblxuXHRcdC8vIHRvZG86IGNoZWNrIGlmIGFqYXggZGlzYWJsZWQuXG5cdFx0aWYgKCAkY29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdCRjb250YWluZXIub24oICdjbGljaycsIHNlbGVjdG9yLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0IGxvY2F0aW9uID0gJCggdGhpcyApLmF0dHIoICdocmVmJyApO1xuXG5cdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIGxvY2F0aW9uICk7XG5cblx0XHRcdFx0ZmlsdGVyUHJvZHVjdHMoKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cdH1cblxuXHQvLyBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIHRoZSBjb21tb24gZmlsdGVyIHJlcXVlc3RzLlxuXHRmdW5jdGlvbiBoYW5kbGVGaWx0ZXJSZXF1ZXN0KCAkaXRlbSwgZmlsdGVyVmFsdWUgKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXNpbmdsZS1maWx0ZXInICk7XG5cdFx0Y29uc3QgZmllbGRJRCAgICAgICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtaWQnICk7XG5cdFx0Y29uc3QgZmllbGREYXRhICAgICAgPSBmaWVsZHNbIGZpZWxkSUQgXTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICA9IGZpZWxkRGF0YS5maWx0ZXJLZXk7XG5cdFx0Y29uc3QgbXVsdGlwbGVGaWx0ZXIgPSBmaWVsZERhdGEubXVsdGlwbGVGaWx0ZXI7XG5cblx0XHRpZiAoICEgZmlsdGVyS2V5ICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICggISBmaWx0ZXJWYWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRjb25zdCBxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRcdGZpbHRlclByb2R1Y3RzKCk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIG11bHRpcGxlRmlsdGVyICkge1xuXHRcdFx0bWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2luZ2xlRmlsdGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gcmVxdWVzdEZpbHRlciggdXJsICkge1xuXHRcdGlmICggISB1cmwgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gd2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmw7XG5cblx0XHQvLyBUT0RPOiBGaWx0ZXIgdGhlIHByb2R1Y3RzIGNvbmRpdGlvbmFsbHkuXG5cdFx0Ly8gZmlsdGVyUHJvZHVjdHMoKTtcblx0fVxuXG5cdC8vIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGxpc3QgZmllbGQuXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oXG5cdFx0J2NoYW5nZScsXG5cdFx0Jy53Y2FwZi1sYXllcmVkLW5hdiBbdHlwZT1cImNoZWNrYm94XCJdLCAud2NhcGYtbGF5ZXJlZC1uYXYgW3R5cGU9XCJyYWRpb1wiXScsXG5cdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdHJlcXVlc3RGaWx0ZXIoICRpdGVtLmRhdGEoICd1cmwnICkgKTtcblx0XHR9XG5cdCk7XG5cblx0Ly8gSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgbGFiZWxlZCBpdGVtLlxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKCAnY2xpY2snLCAnLndjYXBmLWxhYmVsZWQtbmF2IC5pdGVtOm5vdCguZGlzYWJsZWQpJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdHJlcXVlc3RGaWx0ZXIoICRpdGVtLmRhdGEoICd1cmwnICkgKTtcblx0fSApO1xuXG5cdC8vIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGRpc3BsYXkgdHlwZSBzZWxlY3QgZmllbGRzLlxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKCAnY2hhbmdlJywgJ3NlbGVjdCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgJHNlbGVjdCAgICAgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgdmFsdWVzICAgICAgICAgPSAkc2VsZWN0LnZhbCgpO1xuXHRcdGNvbnN0IGZpbHRlclVSTCAgICAgID0gJHNlbGVjdC5kYXRhKCAndXJsJyApO1xuXHRcdGNvbnN0IGNsZWFyRmlsdGVyVVJMID0gJHNlbGVjdC5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKTtcblx0XHRsZXQgdXJsO1xuXG5cdFx0aWYgKCB2YWx1ZXMubGVuZ3RoICkge1xuXHRcdFx0dXJsID0gZmlsdGVyVVJMLnJlcGxhY2UoICclcycsIHZhbHVlcy50b1N0cmluZygpICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHVybCA9IGNsZWFyRmlsdGVyVVJMO1xuXHRcdH1cblxuXHRcdHJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHR9ICk7XG5cblx0LyoqXG5cdCAqIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIHJhbmdlIG51bWJlci5cblx0ICovXG5cdGNvbnN0IHJhbmdlTnVtYmVyU2VsZWN0b3JzID0gJy53Y2FwZi1yYW5nZS1udW1iZXIgLm1pbi12YWx1ZSwgLndjYXBmLXJhbmdlLW51bWJlciAubWF4LXZhbHVlJztcblxuXHQvLyBUT0RPOiBNYXliZSB1c2UgJ2NoYW5nZScgZXZlbnQuXG5cdCR3Y2FwZk51bWJlclJhbmdlRmlsdGVycy5vbiggJ2lucHV0JywgcmFuZ2VOdW1iZXJTZWxlY3RvcnMsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRjb25zdCAkcmFuZ2VOdW1iZXIgICAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtcmFuZ2UtbnVtYmVyJyApO1xuXHRcdGNvbnN0IGZvcm1hdE51bWJlcnMgICAgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWZvcm1hdC1udW1iZXJzJyApO1xuXHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWRlY2ltYWwtcGxhY2VzJyApO1xuXHRcdGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXRob3VzYW5kLXNlcGFyYXRvcicgKTtcblx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1kZWNpbWFsLXNlcGFyYXRvcicgKTtcblxuXHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdGNsZWFyVGltZW91dCggJGl0ZW0uZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRmdW5jdGlvbiBnZXRWYWx1ZSggZmxvYXRWYWx1ZSApIHtcblx0XHRcdGlmICggZm9ybWF0TnVtYmVycyApIHtcblx0XHRcdFx0cmV0dXJuIG51bWJlcl9mb3JtYXQoIGZsb2F0VmFsdWUsIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmbG9hdFZhbHVlO1xuXHRcdH1cblxuXHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRsZXQgbWluVmFsdWUgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCkgKTtcblx0XHRcdGxldCBtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoKSApO1xuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0aWYgKCBpc05hTiggbWluVmFsdWUgKSApIHtcblx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0aWYgKCBpc05hTiggbWF4VmFsdWUgKSApIHtcblx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSByYW5nZU1pblZhbHVlLlxuXHRcdFx0aWYgKCBtaW5WYWx1ZSA8IHJhbmdlTWluVmFsdWUgKSB7XG5cdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNaW5WYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0aWYgKCBtaW5WYWx1ZSA+IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0aWYgKCBtYXhWYWx1ZSA+IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSBtaW5WYWx1ZS5cblx0XHRcdGlmICggbWluVmFsdWUgPiBtYXhWYWx1ZSApIHtcblx0XHRcdFx0bWF4VmFsdWUgPSBtaW5WYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIG1pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIG1heFZhbHVlID09PSByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHQvLyBSZW1vdmUgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRyZXF1ZXN0RmlsdGVyKCAkcmFuZ2VOdW1iZXIuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIEFkZCByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdGNvbnN0IHVybCA9ICRyYW5nZU51bWJlci5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclMXMnLCBtaW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRyZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0XHRcdH1cblx0XHR9LCBkZWxheSApICk7XG5cdH0gKTtcblxuXHQvLyBIYW5kbGUgcmVtb3ZpbmcgdGhlIGFjdGl2ZSBmaWx0ZXJzLlxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKCAnY2xpY2snLCAnLndjYXBmLWFjdGl2ZS1maWx0ZXJzIC5pdGVtOm5vdCguZGlzYWJsZWQpJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgICA9ICRpdGVtLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0Y29uc3QgZmlsdGVyVmFsdWUgPSAkaXRlbS5hdHRyKCAnZGF0YS12YWx1ZScgKTtcblxuXHRcdG1ha2VQYXJhbWV0ZXJzKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlLCB0cnVlICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiByZXNldEZpbHRlcnMoICRidXR0b24gKSB7XG5cdFx0Y29uc3QgX2ZpbHRlcktleXMgPSAkYnV0dG9uLmF0dHIoICdkYXRhLWtleXMnICk7XG5cblx0XHRpZiAoICEgX2ZpbHRlcktleXMgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZmlsdGVyS2V5cyA9IF9maWx0ZXJLZXlzLnNwbGl0KCAnLCcgKTtcblxuXHRcdGxldCBxdWVyeSA9ICcnO1xuXG5cdFx0JC5lYWNoKCBmaWx0ZXJLZXlzLCBmdW5jdGlvbiggaSwgZmlsdGVyS2V5ICkge1xuXHRcdFx0aWYgKCBxdWVyeSApIHtcblx0XHRcdFx0cXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBxdWVyeSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Ly8gRW1wdHkgcXVlcnkgY2F1c2VzIGlzc3VlKGRvZXNuJ3QgcmVtb3ZlIHRoZSBmaWx0ZXIga2V5cyBmcm9tIHRoZSB1cmwpLFxuXHRcdC8vIHRoaXMgaXMgd2h5IHdlIGFyZSBzZXR0aW5nIHRoZSBwYWdlIHVybCBhcyBxdWVyeS5cblx0XHRpZiAoICEgcXVlcnkgKSB7XG5cdFx0XHRjb25zdCBwcmV2VXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0XHRjb25zdCBuZXdVcmwgID0gcHJldlVybC5zcGxpdCggJz8nICk7XG5cblx0XHRcdHF1ZXJ5ID0gbmV3VXJsWyAwIF07XG5cdFx0fVxuXG5cdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdGZpbHRlclByb2R1Y3RzKCB0cnVlICk7XG5cdH1cblxuXHQvLyBDbGVhci9SZXNldCBhbGwgZmlsdGVycy5cblx0JGJvZHkub24oICd3Y2FwZi1yZXNldC1maWx0ZXJzJywgZnVuY3Rpb24oIGUsICRidXR0b24gKSB7XG5cdFx0cmVzZXRGaWx0ZXJzKCAkYnV0dG9uICk7XG5cdH0gKTtcblxuXHQkYm9keS5vbiggJ2NsaWNrJywgJy53Y2FwZi1yZXNldC1maWx0ZXJzLWJ0bicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRidXR0b24gPSAkKCB0aGlzICk7XG5cblx0XHRyZXNldEZpbHRlcnMoICRidXR0b24gKTtcblx0fSApO1xuXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oICdjbGljaycsICcud2NhcGYtcmVzZXQtZmlsdGVycy1idG4nLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRidXR0b24gPSAkKCB0aGlzICk7XG5cblx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGYtcmVzZXQtZmlsdGVycycsIFsgJGJ1dHRvbiBdICk7XG5cdH0gKTtcblxuXHQkd2NhcGZTaW5nbGVGaWx0ZXJzLm9uKCAnd2NhcGYtY2xlYXItZmlsdGVyJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGZpZWxkSUQgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRjb25zdCBmaWVsZERhdGEgPSBmaWVsZHNbIGZpZWxkSUQgXTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgPSBmaWVsZERhdGEuZmlsdGVyS2V5O1xuXG5cdFx0Y29uc3QgcXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdGZpbHRlclByb2R1Y3RzKCB0cnVlICk7XG5cdH0gKTtcblxuXHQvLyBSdW4gYWpheCBmaWx0ZXIgd2hlbiBicm93c2VyIGhpc3RvcnkgY2hhbmdlcyAodXNlciBnb2VzIGJhY2sgb3IgZm9yd2FyZCkuXG5cdGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5sZW5ndGggfHwgJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuYXBwbHlfZmlsdGVyc19vbl9icm93c2VyX2hpc3RvcnlfY2hhbmdlICkge1xuXHRcdFx0JCggd2luZG93ICkuYmluZCggJ3BvcHN0YXRlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGZpbHRlclByb2R1Y3RzKCB0cnVlICk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gVGhlIGhvb2sgdGhhdCBtYW51YWxseSBydW4gdGhlIGFqYXggZmlsdGVycyAoY2FuIGJlIHVzZWZ1bCBmb3Igb3RoZXIgcGx1Z2lucykuXG5cdCRib2R5Lm9uKCAnd2NhcGYtcnVuLWZpbHRlci1wcm9kdWN0cycsIGZ1bmN0aW9uKCBlLCBmb3JjZVJlUmVuZGVyICkge1xuXHRcdGZpbHRlclByb2R1Y3RzKCBmb3JjZVJlUmVuZGVyICk7XG5cdH0gKTtcblxuXHQvLyBUaGUgaG9vayB0aGF0IHJlaW5pdGlhbGl6ZSB0aGUgZmlsdGVyIHdpZGdldHMgKHRvIHNob3cgdGhlIHByZXZpZXcgaW4gdGhlIGJhY2tlbmQpLlxuXHQkYm9keS5vbiggJ2luaXRfZmlsdGVyX3dpZGdldHMnLCBmdW5jdGlvbigpIHtcblx0XHRpbml0Q2hvc2VuKCk7XG5cdFx0aW5pdEhpZXJhcmNoeUFjY29yZGlvbigpO1xuXHRcdGluaXROb1VJU2xpZGVyKCk7XG5cdFx0aW5pdERhdGVwaWNrZXIoKTtcblx0fSApO1xuXG5cdC8qKlxuXHQgKiBNYWtlIGl0IGNvbXBhdGlibGUgd2l0aCBvdGhlciBwbHVnaW5zLlxuXHQgKi9cblx0JGJvZHkub24oICd3Y2FwZl9hZnRlcl91cGRhdGluZ19wcm9kdWN0cycsIGZ1bmN0aW9uKCkge1xuXHRcdC8vIHdvby12YXJpYXRpb24tc3dhdGNoZXNcblx0XHQkKCBkb2N1bWVudCApLnRyaWdnZXIoICd3b29fdmFyaWF0aW9uX3N3YXRjaGVzX3Byb19pbml0JyApO1xuXHR9ICk7XG59ICk7XG4iLCIoIGZ1bmN0aW9uKCAkLCB3aW5kb3cgKSB7XG5cblx0Y29uc3QgX2RlbGF5ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5maWx0ZXJfaW5wdXRfZGVsYXkgKTtcblx0Y29uc3QgZGVsYXkgID0gX2RlbGF5ID49IDAgPyBfZGVsYXkgOiA4MDA7XG5cblx0Y29uc3QgJGJvZHkgPSAkKCAnYm9keScgKTtcblxuXHRjb25zdCBpbnN0YW5jZUlkcyA9IFtdO1xuXG5cdCQoICcud2NhcGYtZmlsdGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGluc3RhbmNlSWRzLnB1c2goICQoIHRoaXMgKS5kYXRhKCAnaWQnICkgKTtcblx0fSApO1xuXG5cdGxldCBmb2N1c2VkRWxtO1xuXG5cdHdpbmRvdy50aXBweUluc3RhbmNlcyA9IFtdO1xuXG5cdHdpbmRvdy5XQ0FQRiA9IHdpbmRvdy5XQ0FQRiB8fCB7fTtcblxuXHR3aW5kb3cuV0NBUEYgPSB7XG5cdFx0aGFuZGxlRmlsdGVyQWNjb3JkaW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHRvZ2dsZUFjY29yZGlvbiA9ICggJGVsICkgPT4ge1xuXHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGFjY29yZGlvbiBpcyBvcGVuZWRcblx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1leHBhbmRlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdC8vIENoYW5nZSBhcmlhLWV4cGFuZGVkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuXHRcdFx0XHQkZWwuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAhIHByZXNzZWQgKTtcblxuXHRcdFx0XHRjb25zdCAkZmlsdGVySW5uZXIgPSAkZWwuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXInICkuY2hpbGRyZW4oICcud2NhcGYtZmlsdGVyLWlubmVyJyApO1xuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9hbmltYXRpb25fZm9yX2ZpbHRlcl9hY2NvcmRpb24gKSB7XG5cdFx0XHRcdFx0JGZpbHRlcklubmVyLnNsaWRlVG9nZ2xlKFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkLFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZ1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JGZpbHRlcklubmVyLnRvZ2dsZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHQkYm9keS5vbiggJ2NsaWNrJywgJy53Y2FwZi1maWx0ZXItYWNjb3JkaW9uLXRyaWdnZXInLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQkYm9keS5vbiggJ2NsaWNrJywgJy53Y2FwZi1maWx0ZXItdGl0bGUuaGFzLWFjY29yZGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkdHJpZ2dlciA9ICQoIHRoaXMgKS5maW5kKCAnLndjYXBmLWZpbHRlci1hY2NvcmRpb24tdHJpZ2dlcicgKTtcblxuXHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICR0cmlnZ2VyICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVIaWVyYXJjaHlUb2dnbGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgdG9nZ2xlQWNjb3JkaW9uID0gKCAkZWwgKSA9PiB7XG5cdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYnV0dG9uIGlzIHByZXNzZWRcblx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0Ly8gQ2hhbmdlIGFyaWEtcHJlc3NlZCB0byB0aGUgb3Bwb3NpdGUgc3RhdGVcblx0XHRcdFx0JGVsLmF0dHIoICdhcmlhLXByZXNzZWQnLCAhIHByZXNzZWQgKTtcblxuXHRcdFx0XHRjb25zdCAkY2hpbGQgPSAkZWwuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICk7XG5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbiApIHtcblx0XHRcdFx0XHQkY2hpbGQuc2xpZGVUb2dnbGUoXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQsXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkY2hpbGQudG9nZ2xlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdCRib2R5XG5cdFx0XHRcdC5vbiggJ2NsaWNrJywgJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0XHRcdH0gKVxuXHRcdFx0XHQub24oICdrZXlkb3duJywgJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdGlmICggZS5rZXkgPT09ICcgJyB8fCBlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJ1NwYWNlYmFyJyApIHtcblx0XHRcdFx0XHRcdC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgYWN0aW9uIHRvIHN0b3Agc2Nyb2xsaW5nIHdoZW4gc3BhY2UgaXMgcHJlc3NlZFxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlU29mdExpbWl0OiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHRvZ2dsZUZpbHRlck9wdGlvbnMgPSAoICRlbCApID0+IHtcblx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBidXR0b24gaXMgcHJlc3NlZFxuXHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLXByZXNzZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHQvLyBDaGFuZ2UgYXJpYS1wcmVzc2VkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuXHRcdFx0XHQkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICEgcHJlc3NlZCApO1xuXG5cdFx0XHRcdGNvbnN0ICRsaXN0V3JhcHBlciA9ICRlbC5jbG9zZXN0KCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKTtcblxuXHRcdFx0XHRpZiAoIHByZXNzZWQgKSB7XG5cdFx0XHRcdFx0JGxpc3RXcmFwcGVyLnJlbW92ZUNsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkbGlzdFdyYXBwZXIuYWRkQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHQkYm9keVxuXHRcdFx0XHQub24oICdjbGljaycsICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dG9nZ2xlRmlsdGVyT3B0aW9ucyggJCggdGhpcyApICk7XG5cdFx0XHRcdH0gKVxuXHRcdFx0XHQub24oICdrZXlkb3duJywgJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRpZiAoIGUua2V5ID09PSAnICcgfHwgZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICdTcGFjZWJhcicgKSB7XG5cdFx0XHRcdFx0XHQvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvbiB0byBzdG9wIHNjcm9sbGluZyB3aGVuIHNwYWNlIGlzIHByZXNzZWRcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdFx0dG9nZ2xlRmlsdGVyT3B0aW9ucyggJCggdGhpcyApICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVTZWFyY2hGaWx0ZXJPcHRpb25zOiBmdW5jdGlvbigpIHtcblx0XHRcdCRib2R5Lm9uKCAnaW5wdXQnLCAnLndjYXBmLXNlYXJjaC1ib3ggaW5wdXRbdHlwZT1cInRleHRcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRoYXQgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgJGlubmVyICA9ICR0aGF0LmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyLWlubmVyJyApO1xuXHRcdFx0XHRjb25zdCAkZmlsdGVyID0gJGlubmVyLmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyJyApO1xuXG5cdFx0XHRcdGNvbnN0IHNvZnRMaW1pdEVuYWJsZWQgPSAkZmlsdGVyLmhhc0NsYXNzKCAnaGFzLXNvZnQtbGltaXQnICk7XG5cdFx0XHRcdGNvbnN0IHNvZnRMaW1pdFRvZ2dsZSAgPSAkZmlsdGVyLmZpbmQoICcud2NhcGYtc29mdC1saW1pdC13cmFwcGVyJyApO1xuXHRcdFx0XHRjb25zdCB2aXNpYmxlT3B0aW9ucyAgID0gcGFyc2VJbnQoICRmaWx0ZXIuYXR0ciggJ2RhdGEtdmlzaWJsZS1vcHRpb25zJyApICk7XG5cblx0XHRcdFx0Y29uc3Qga2V5d29yZCA9ICR0aGF0LnZhbCgpO1xuXG5cdFx0XHRcdGlmICggISBrZXl3b3JkLmxlbmd0aCApIHtcblx0XHRcdFx0XHRsZXQgaW5kZXggPSAwO1xuXHRcdFx0XHRcdCRmaWx0ZXIucmVtb3ZlQ2xhc3MoICdzZWFyY2gtYWN0aXZlJyApO1xuXG5cdFx0XHRcdFx0JC5lYWNoKCAkaW5uZXIuZmluZCggJy53Y2FwZi1maWx0ZXItb3B0aW9ucyA+IGxpJyApLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGluZGV4Kys7XG5cblx0XHRcdFx0XHRcdGNvbnN0ICRmaWx0ZXJJdGVtID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICdrZXl3b3JkLW1hdGNoZWQnICk7XG5cblx0XHRcdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCBpbmRleCA+IHZpc2libGVPcHRpb25zICkge1xuXHRcdFx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLmFkZENsYXNzKCAnd2NhcGYtZmlsdGVyLW9wdGlvbi1oaWRkZW4nICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRcdHNvZnRMaW1pdFRvZ2dsZS5yZW1vdmVBdHRyKCAnc3R5bGUnICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IGluZGV4ID0gMDtcblx0XHRcdFx0JGZpbHRlci5hZGRDbGFzcyggJ3NlYXJjaC1hY3RpdmUnICk7XG5cblx0XHRcdFx0JC5lYWNoKCAkaW5uZXIuZmluZCggJy53Y2FwZi1maWx0ZXItb3B0aW9ucyA+IGxpJyApLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCAkZmlsdGVySXRlbSA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRjb25zdCBsYWJlbCAgICAgICA9ICRmaWx0ZXJJdGVtLmZpbmQoICcud2NhcGYtZmlsdGVyLWl0ZW0tbGFiZWwnICkuZGF0YSggJ2xhYmVsJyApO1xuXG5cdFx0XHRcdFx0aWYgKCBsYWJlbC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCBrZXl3b3JkLnRvTG93ZXJDYXNlKCkgKSApIHtcblx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLmFkZENsYXNzKCAna2V5d29yZC1tYXRjaGVkJyApO1xuXG5cdFx0XHRcdFx0XHRpZiAoIHNvZnRMaW1pdEVuYWJsZWQgKSB7XG5cdFx0XHRcdFx0XHRcdGluZGV4Kys7XG5cblx0XHRcdFx0XHRcdFx0aWYgKCBpbmRleCA+IHZpc2libGVPcHRpb25zICkge1xuXHRcdFx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLmFkZENsYXNzKCAnd2NhcGYtZmlsdGVyLW9wdGlvbi1oaWRkZW4nICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5yZW1vdmVDbGFzcyggJ2tleXdvcmQtbWF0Y2hlZCcgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRpZiAoIHNvZnRMaW1pdEVuYWJsZWQgKSB7XG5cdFx0XHRcdFx0aWYgKCBpbmRleCA8PSB2aXNpYmxlT3B0aW9ucyApIHtcblx0XHRcdFx0XHRcdHNvZnRMaW1pdFRvZ2dsZS5oaWRlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHR1cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0OiBmdW5jdGlvbiggJHJlc3BvbnNlICkge1xuXHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRjb25zdCBzZWxlY3RvciAgID0gJy53b29jb21tZXJjZS1yZXN1bHQtY291bnQnO1xuXHRcdFx0Y29uc3QgbmV3Q291bnQgICA9ICRyZXNwb25zZS5maW5kKCBzZWxlY3RvciApLmh0bWwoKTtcblxuXHRcdFx0JGJvZHkuZmluZCggc2VsZWN0b3IgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGVsID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdGlmICggISAkY29udGFpbmVyLmhhcyggJGVsICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdCRlbC5odG1sKCBuZXdDb3VudCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRzaG93TG9hZGluZ0FuaW1hdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLmxvYWRpbmdfYW5pbWF0aW9uICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCQuTG9hZGluZ092ZXJsYXkoICdzaG93Jywgd2NhcGZfcGFyYW1zLmxvYWRpbmdfb3ZlcmxheV9vcHRpb25zICk7XG5cdFx0fSxcblx0XHRyZXNldExvYWRpbmdBbmltYXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5sb2FkaW5nX2FuaW1hdGlvbiApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQkLkxvYWRpbmdPdmVybGF5KCAnaGlkZScgKTtcblx0XHR9LFxuXHRcdHNjcm9sbFRvOiBmdW5jdGlvbiggdHJpZ2dlcmVkQnkgKSB7XG5cdFx0XHRpZiAoICdub25lJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgYWxsb3dlZCAgICA9IFtdO1xuXHRcdFx0Y29uc3Qgc2Nyb2xsV2hlbiA9IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X3doZW47XG5cblx0XHRcdGlmICggJ2FsbCcgPT09IHNjcm9sbFdoZW4gKSB7XG5cdFx0XHRcdGFsbG93ZWQucHVzaCggJ2ZpbHRlcicgKTtcblx0XHRcdFx0YWxsb3dlZC5wdXNoKCAncGFnaW5hdGUnICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhbGxvd2VkLnB1c2goIHNjcm9sbFdoZW4gKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhIGFsbG93ZWQuaW5jbHVkZXMoIHRyaWdnZXJlZEJ5ICkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc2Nyb2xsRm9yID0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfZm9yO1xuXHRcdFx0Y29uc3QgaXNNb2JpbGUgID0gd2NhcGZfcGFyYW1zLmlzX21vYmlsZTtcblx0XHRcdGxldCBwcm9jZWVkICAgICA9IGZhbHNlO1xuXG5cdFx0XHRpZiAoICdtb2JpbGUnID09PSBzY3JvbGxGb3IgJiYgaXNNb2JpbGUgKSB7XG5cdFx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmICggJ2Rlc2t0b3AnID09PSBzY3JvbGxGb3IgJiYgISBpc01vYmlsZSApIHtcblx0XHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0XHR9IGVsc2UgaWYgKCAnYm90aCcgPT09IHNjcm9sbEZvciApIHtcblx0XHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISBwcm9jZWVkICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCBhZGp1c3RpbmdPZmZzZXQsIG9mZnNldDtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKSB7XG5cdFx0XHRcdGFkanVzdGluZ09mZnNldCA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGNvbnRhaW5lcjtcblxuXHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXI7XG5cdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXI7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggJ2N1c3RvbScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93ICkge1xuXHRcdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudDtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIGNvbnRhaW5lciApO1xuXG5cdFx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRvZmZzZXQgPSAkY29udGFpbmVyLm9mZnNldCgpLnRvcCAtIGFkanVzdGluZ09mZnNldDtcblxuXHRcdFx0XHRpZiAoIG9mZnNldCA8IDAgKSB7XG5cdFx0XHRcdFx0b2Zmc2V0ID0gMDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmRpc2FibGVfc2Nyb2xsX2FuaW1hdGlvbiApIHtcblx0XHRcdFx0XHR3aW5kb3cuc2Nyb2xsVG8oIHsgdG9wOiBvZmZzZXQgfSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCQoICdodG1sLCBib2R5JyApLnN0b3AoKS5hbmltYXRlKFxuXHRcdFx0XHRcdFx0eyBzY3JvbGxUb3A6IG9mZnNldCB9LFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfc3BlZWQsXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9lYXNpbmdcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvLyBUaGluZ3MgYXJlIGRvbmUgYmVmb3JlIGZldGNoaW5nIHRoZSBwcm9kdWN0cyBsaWtlIHNob3dpbmcgdGhlIGxvYWRpbmcgaW5kaWNhdG9yLlxuXHRcdGJlZm9yZUZldGNoaW5nUHJvZHVjdHM6IGZ1bmN0aW9uKCB0cmlnZ2VyZWRCeSApIHtcblx0XHRcdC8vIFRyYWNrIHRoZSBjdXJyZW50IGVsZW1lbnQgZm9jdXMuXG5cdFx0XHRmb2N1c2VkRWxtID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcblxuXHRcdFx0V0NBUEYuc2hvd0xvYWRpbmdBbmltYXRpb24oKTtcblxuXHRcdFx0Ly8gU2Nyb2xsIGludG8gdmlldyBvbiBwYWdpbmF0ZS5cblx0XHRcdGlmICggJ3BhZ2luYXRlJyA9PT0gdHJpZ2dlcmVkQnkgJiYgd2NhcGZfcGFyYW1zLmltbWVkaWF0ZV9zY3JvbGxfb25fcGFnaW5hdGUgKSB7XG5cdFx0XHRcdFdDQVBGLnNjcm9sbFRvKCB0cmlnZ2VyZWRCeSApO1xuXHRcdFx0fVxuXG5cdFx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGZfYmVmb3JlX2ZldGNoaW5nX3Byb2R1Y3RzJywgWyB0cmlnZ2VyZWRCeSBdICk7XG5cdFx0fSxcblx0XHRkZXN0cm95VGlwcHlJbnN0YW5jZXM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMudXNlX3RpcHB5anMgKSB7XG5cdFx0XHRcdC8vIEBzb3VyY2UgaHR0cHM6Ly9naXRodWIuY29tL2F0b21pa3MvdGlwcHlqcy9pc3N1ZXMvNDczXG5cdFx0XHRcdHRpcHB5SW5zdGFuY2VzLmZvckVhY2goIGluc3RhbmNlID0+IHtcblx0XHRcdFx0XHRpbnN0YW5jZS5kZXN0cm95KCk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdFx0dGlwcHlJbnN0YW5jZXMubGVuZ3RoID0gMDsgLy8gY2xlYXIgaXRcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8vIFRoaW5ncyBhcmUgZG9uZSBiZWZvcmUgdXBkYXRpbmcgdGhlIHByb2R1Y3RzIGxpa2UgaGlkaW5nIHRoZSBsb2FkaW5nIGluZGljYXRvci5cblx0XHRiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzOiBmdW5jdGlvbiggJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSApIHtcblx0XHRcdFdDQVBGLnJlc2V0TG9hZGluZ0FuaW1hdGlvbigpO1xuXG5cdFx0XHQvLyBNYXliZSBnb29kIGZvciBwZXJmb3JtYW5jZS5cblx0XHRcdFdDQVBGLmRlc3Ryb3lUaXBweUluc3RhbmNlcygpO1xuXG5cdFx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGZfYmVmb3JlX3VwZGF0aW5nX3Byb2R1Y3RzJywgWyAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5IF0gKTtcblx0XHR9LFxuXHRcdGFmdGVyVXBkYXRpbmdQcm9kdWN0czogZnVuY3Rpb24oICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgKSB7XG5cdFx0XHRXQ0FQRi51cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0KCAkcmVzcG9uc2UgKTtcblxuXHRcdFx0Ly8gUmVzdG9yZSB0aGUgZm9jdXMgKE1heWJlIHJlc3RvcmluZyB0aGUgZm9jdXMgaW4gbW9iaWxlIGRldmljZSBpc24ndCBnb29kKS5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnJlc3RvcmVfZm9jdXNfYWZ0ZXJfZmlsdGVyaW5nICYmICEgd2NhcGZfcGFyYW1zLmlzX21vYmlsZSApIHtcblx0XHRcdFx0aWYgKCBkb2N1bWVudC5ib2R5ICE9PSBmb2N1c2VkRWxtICkge1xuXHRcdFx0XHRcdGlmICggZm9jdXNlZEVsbS5pZCApIHtcblx0XHRcdFx0XHRcdCQoIGAjJHsgZm9jdXNlZEVsbS5pZCB9YCApLmZvY3VzKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlaW5pdGlhbGl6ZSB3Y2FwZi5cblx0XHRcdFdDQVBGLmluaXQoKTtcblxuXHRcdFx0Ly8gU2Nyb2xsIGludG8gdmlldy5cblx0XHRcdGlmICggJ3BhZ2luYXRlJyA9PT0gdHJpZ2dlcmVkQnkgJiYgd2NhcGZfcGFyYW1zLmltbWVkaWF0ZV9zY3JvbGxfb25fcGFnaW5hdGUgKSB7XG5cdFx0XHRcdC8vIERvIG5vdGhpbmcgYmVjYXVzZSBpdCBhbHJlYWR5IGhhcHBlbmVkLlxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0V0NBUEYuc2Nyb2xsVG8oIHRyaWdnZXJlZEJ5ICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRyaWdnZXIgZXZlbnRzLlxuXHRcdFx0JCggZG9jdW1lbnQgKS50cmlnZ2VyKCAncmVhZHknICk7XG5cdFx0XHQkKCB3aW5kb3cgKS50cmlnZ2VyKCAnc2Nyb2xsJyApO1xuXHRcdFx0JCggd2luZG93ICkudHJpZ2dlciggJ3Jlc2l6ZScgKTtcblxuXHRcdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2FmdGVyX3VwZGF0aW5nX3Byb2R1Y3RzJywgWyAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5IF0gKTtcblx0XHR9LFxuXHRcdGZpbHRlclByb2R1Y3RzOiBmdW5jdGlvbiggdHJpZ2dlcmVkQnkgPSAnZmlsdGVyJyApIHtcblx0XHRcdFdDQVBGLmJlZm9yZUZldGNoaW5nUHJvZHVjdHMoIHRyaWdnZXJlZEJ5ICk7XG5cblx0XHRcdCQuYWpheCgge1xuXHRcdFx0XHR1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHRcdFx0Y29uc3QgJHJlc3BvbnNlID0gJCggcmVzcG9uc2UgKTtcblxuXHRcdFx0XHRcdFdDQVBGLmJlZm9yZVVwZGF0aW5nUHJvZHVjdHMoICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgKTtcblxuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIFVwZGF0ZSBkb2N1bWVudCB0aXRsZS5cblx0XHRcdFx0XHQgKlxuXHRcdFx0XHRcdCAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzc1OTk1NjJcblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy51cGRhdGVfdGl0bGVfdGFnICkge1xuXHRcdFx0XHRcdFx0ZG9jdW1lbnQudGl0bGUgPSAkcmVzcG9uc2UuZmlsdGVyKCAndGl0bGUnICkudGV4dCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgaW5zdGFuY2VzLlxuXHRcdFx0XHRcdGZvciAoIGNvbnN0IGlkIG9mIGluc3RhbmNlSWRzICkge1xuXHRcdFx0XHRcdFx0Y29uc3QgaW5zdGFuY2VJZCAgICAgPSAnW2RhdGEtaWQ9XCInICsgaWQgKyAnXCJdJztcblx0XHRcdFx0XHRcdGNvbnN0ICRpbnN0YW5jZSAgICAgID0gJCggaW5zdGFuY2VJZCApO1xuXHRcdFx0XHRcdFx0Y29uc3QgJGlubmVyICAgICAgICAgPSAkaW5zdGFuY2UuZmluZCggJy53Y2FwZi1maWx0ZXItaW5uZXInICk7XG5cdFx0XHRcdFx0XHRjb25zdCBfaW5zdGFuY2UgICAgICA9ICRyZXNwb25zZS5maW5kKCBpbnN0YW5jZUlkICk7XG5cdFx0XHRcdFx0XHRsZXQgX2luc3RhbmNlQ2xhc3NlcyA9ICQoIF9pbnN0YW5jZSApLmF0dHIoICdjbGFzcycgKTtcblxuXHRcdFx0XHRcdFx0Ly8gUHJlc2VydmUgaGllcmFyY2h5IGFjY29yZGlvbiBzdGF0ZS5cblx0XHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJGluc3RhbmNlLmhhc0NsYXNzKCAnaGFzLWhpZXJhcmNoeS1hY2NvcmRpb24nICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JGluc3RhbmNlLmZpbmQoICcud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCAkZWwgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBpZCAgPSAkZWwuZGF0YSggJ2lkJyApO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCB0b2dnbGVTZWxlY3RvciA9IGAud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGVbZGF0YS1pZD1cIiR7IGlkIH1cIl1gO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGFjY29yZGlvbiBpcyBvcGVuZWRcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIHByZXNzZWQgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCB0b2dnbGVTZWxlY3RvciApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAndHJ1ZScgKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICkuc2hvdygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICdmYWxzZScgKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICkuaGlkZSgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBQcmVzZXJ2ZSBzb2Z0IGxpbWl0IHN0YXRlLlxuXHRcdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucHJlc2VydmVfc29mdF9saW1pdF9zdGF0ZSApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkaW5zdGFuY2UuaGFzQ2xhc3MoICdoYXMtc29mdC1saW1pdCcgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCAkbGlzdFdyYXBwZXIgPSAkaW5zdGFuY2UuZmluZCggJy53Y2FwZi1saXN0LXdyYXBwZXInICk7XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAoICRsaXN0V3JhcHBlci5oYXNDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1saXN0LXdyYXBwZXInICkuYWRkQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJyApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAndHJ1ZScgKTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtbGlzdC13cmFwcGVyJyApLnJlbW92ZUNsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLXNvZnQtbGltaXQtdHJpZ2dlcicgKS5hdHRyKCAnYXJpYS1wcmVzc2VkJywgJ2ZhbHNlJyApO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBVcGRhdGUgY2xlYXIgZmlsdGVyIGJ1dHRvbiB1cmwuXG5cdFx0XHRcdFx0XHRjb25zdCBjbGVhckJ0blNlbGVjdG9yID0gJy53Y2FwZi1maWx0ZXItY2xlYXItYnRuJztcblx0XHRcdFx0XHRcdGNvbnN0IGNsZWFyRmlsdGVyVXJsICAgPSBfaW5zdGFuY2UuZmluZCggY2xlYXJCdG5TZWxlY3RvciApLmF0dHIoICdkYXRhLWNsZWFyLWZpbHRlci11cmwnICk7XG5cdFx0XHRcdFx0XHQkaW5zdGFuY2UuZmluZCggY2xlYXJCdG5TZWxlY3RvciApLmF0dHIoICdkYXRhLWNsZWFyLWZpbHRlci11cmwnLCBjbGVhckZpbHRlclVybCApO1xuXG5cdFx0XHRcdFx0XHQvLyBVcGRhdGUgdGhlIGluc3RhbmNlIGNsYXNzZXMuXG5cdFx0XHRcdFx0XHQkaW5zdGFuY2UuYXR0ciggJ2NsYXNzJywgX2luc3RhbmNlQ2xhc3Nlcy50cmltKCkgKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgX2h0bWwgPSBfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1maWx0ZXItaW5uZXInICkuaHRtbCgpO1xuXG5cdFx0XHRcdFx0XHQvLyBGaW5hbGx5IHVwZGF0ZSB0aGUgaW5zdGFuY2UuXG5cdFx0XHRcdFx0XHQkaW5uZXIuaHRtbCggX2h0bWwgKTtcblxuXHRcdFx0XHRcdFx0JGluc3RhbmNlLnRyaWdnZXIoICd3Y2FwZi1maWx0ZXItdXBkYXRlZCcsIFsgX2luc3RhbmNlIF0gKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBSZXBsYWNlIG9sZCBzaG9wIGxvb3Agd2l0aCBuZXcgb25lLlxuXHRcdFx0XHRcdGNvbnN0ICRzaG9wTG9vcENvbnRhaW5lciA9ICRyZXNwb25zZS5maW5kKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0XHRcdGNvbnN0ICRub3RGb3VuZENvbnRhaW5lciA9ICRyZXNwb25zZS5maW5kKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApO1xuXG5cdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciA9PT0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0V0NBUEYuYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdHJlcXVlc3RGaWx0ZXI6IGZ1bmN0aW9uKCB1cmwsIHRyaWdnZXJlZEJ5ID0gJ2ZpbHRlcicgKSB7XG5cdFx0XHRpZiAoICEgdXJsICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGhvc3RuYW1lID0gbG9jYXRpb24uaG9zdG5hbWU7XG5cblx0XHRcdC8vIFRPRE86IFJlbW92ZSBmcm9tIHByb2R1Y3Rpb24gYnVpbGQuXG5cdFx0XHRpZiAoICdsb2NhbGhvc3QnID09PSBob3N0bmFtZSApIHtcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoICdodHRwOi8vd2NmaWx0ZXItMi50ZXN0JywgJy8vbG9jYWxob3N0OjMwMDEnICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJsO1xuXG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSggeyB3Y2FwZjogdHJ1ZSB9LCAnJywgdXJsICk7XG5cblx0XHRcdFdDQVBGLmZpbHRlclByb2R1Y3RzKCB0cmlnZ2VyZWRCeSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlTnVtYmVySW5wdXRGaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHJhbmdlTnVtYmVyU2VsZWN0b3JzID0gJy53Y2FwZi1yYW5nZS1udW1iZXIgLm1pbi12YWx1ZSwgLndjYXBmLXJhbmdlLW51bWJlciAubWF4LXZhbHVlJztcblxuXHRcdFx0JGJvZHkub24oICdpbnB1dCcsIHJhbmdlTnVtYmVyU2VsZWN0b3JzLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Y29uc3QgJHJhbmdlTnVtYmVyICAgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXJhbmdlLW51bWJlcicgKTtcblx0XHRcdFx0Y29uc3QgZm9ybWF0TnVtYmVycyAgICAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZm9ybWF0LW51bWJlcnMnICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgb2xkTWluVmFsdWUgICAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IG9sZE1heFZhbHVlICAgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsUGxhY2VzICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRcdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1kZWNpbWFsLXNlcGFyYXRvcicgKTtcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRjb25zdCBnZXRWYWx1ZSA9ICggZmxvYXRWYWx1ZSApID0+IHtcblx0XHRcdFx0XHRpZiAoIGZvcm1hdE51bWJlcnMgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVtYmVyRm9ybWF0KCBmbG9hdFZhbHVlLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBmbG9hdFZhbHVlO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpdGVtLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGxldCBtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoKSApO1xuXHRcdFx0XHRcdGxldCBtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoKSApO1xuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdFx0XHRpZiAoIGlzTmFOKCBtaW5WYWx1ZSApICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRcdFx0aWYgKCBpc05hTiggbWF4VmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSByYW5nZU1pblZhbHVlLlxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPCByYW5nZU1pblZhbHVlICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA+IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdFx0XHRpZiAoIG1heFZhbHVlID4gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSBtaW5WYWx1ZS5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID4gbWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IG1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIElmIHZhbHVlIGlzIG5vdCBjaGFuZ2VkIHRoZW4gZG9uJ3QgcHJvY2VlZC5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID09PSBvbGRNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gb2xkTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdC8vIFJlbW92ZSByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkcmFuZ2VOdW1iZXIuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdGNvbnN0IHVybCA9ICRyYW5nZU51bWJlci5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclMXMnLCBtaW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVMaXN0RmlsdGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCBuYXRpdmVJbnB1dHMgPSAnLmxpc3QtdHlwZS1uYXRpdmUgW3R5cGU9XCJjaGVja2JveFwiXSwnICtcblx0XHRcdFx0Jy5saXN0LXR5cGUtbmF0aXZlIFt0eXBlPVwicmFkaW9cIl0sJyArXG5cdFx0XHRcdCcubGlzdC10eXBlLWN1c3RvbS1jaGVja2JveCBbdHlwZT1cImNoZWNrYm94XCJdJztcblxuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCBuYXRpdmVJbnB1dHMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkKCB0aGlzICkuZGF0YSggJ3VybCcgKSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRjb25zdCBjdXN0b21SYWRpb1NlbGVjdG9yID0gJy5saXN0LXR5cGUtY3VzdG9tLXJhZGlvJztcblxuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCBjdXN0b21SYWRpb1NlbGVjdG9yICsgJyBbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81ODM5OTI0XG5cdFx0XHRcdCQoIHRoaXMgKVxuXHRcdFx0XHRcdC5jbG9zZXN0KCBjdXN0b21SYWRpb1NlbGVjdG9yIClcblx0XHRcdFx0XHQuZmluZCggJ1t0eXBlPVwiY2hlY2tib3hcIl0nICkubm90KCB0aGlzIClcblx0XHRcdFx0XHQucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5kYXRhKCAndXJsJyApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVEcm9wZG93bkZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCAnLndjYXBmLWRyb3Bkb3duLXdyYXBwZXIgc2VsZWN0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRzZWxlY3QgICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCB2YWx1ZXMgICAgICAgICA9ICRzZWxlY3QudmFsKCk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlclVSTCAgICAgID0gJHNlbGVjdC5kYXRhKCAndXJsJyApO1xuXHRcdFx0XHRjb25zdCBjbGVhckZpbHRlclVSTCA9ICRzZWxlY3QuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICk7XG5cdFx0XHRcdGxldCB1cmw7XG5cblx0XHRcdFx0aWYgKCB2YWx1ZXMubGVuZ3RoICkge1xuXHRcdFx0XHRcdHVybCA9IGZpbHRlclVSTC5yZXBsYWNlKCAnJXMnLCB2YWx1ZXMudG9TdHJpbmcoKSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHVybCA9IGNsZWFyRmlsdGVyVVJMO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVQYWdpbmF0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4ICYmIHdjYXBmX3BhcmFtcy5wYWdpbmF0aW9uX2NvbnRhaW5lciApIHtcblx0XHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRcdGNvbnN0IHNlbGVjdG9yICAgPSB3Y2FwZl9wYXJhbXMucGFnaW5hdGlvbl9jb250YWluZXIgKyAnIGEnO1xuXG5cdFx0XHRcdGlmICggJGNvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0JGNvbnRhaW5lci5vbiggJ2NsaWNrJywgc2VsZWN0b3IsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBocmVmID0gJCggdGhpcyApLmF0dHIoICdocmVmJyApO1xuXG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCBocmVmLCAncGFnaW5hdGUnICk7XG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRoYW5kbGVEZWZhdWx0T3JkZXJieTogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLnNvcnRpbmdfY29udHJvbCApIHtcblx0XHRcdFx0Ly8gU3VibWl0IHRoZSBvcmRlcmJ5IGZvcm0gd2hlbiB2YWx1ZSBpcyBjaGFuZ2VkLlxuXHRcdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsICcud29vY29tbWVyY2Utb3JkZXJpbmcgc2VsZWN0Lm9yZGVyYnknLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKCB0aGlzICkuY2xvc2VzdCggJ2Zvcm0nICkudHJpZ2dlciggJ3N1Ym1pdCcgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUHJldmVudCB0aGUgYXV0byBzdWJtaXNzaW9uIG9mIHRoZSBvcmRlcmJ5IGZvcm0uXG5cdFx0XHQkYm9keS5vbiggJ3N1Ym1pdCcsICcud29vY29tbWVyY2Utb3JkZXJpbmcnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IHZpYSBhamF4IHdoZW4gdGhlIG9yZGVyYnkgdmFsdWUgaXMgY2hhbmdlZC5cblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgJy53b29jb21tZXJjZS1vcmRlcmluZyBzZWxlY3Qub3JkZXJieScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBvcmRlciA9ICQoIHRoaXMgKS52YWwoKTtcblxuXHRcdFx0XHRjb25zdCB1cmwgPSBuZXcgVVJMKCB3aW5kb3cubG9jYXRpb24gKTtcblx0XHRcdFx0dXJsLnNlYXJjaFBhcmFtcy5zZXQoICdvcmRlcmJ5Jywgb3JkZXIgKTtcblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCBnZXRPcmRlckJ5VXJsKCB1cmwuaHJlZiApICk7XG5cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlUmVzZXRGaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdCRib2R5Lm9uKCAnY2xpY2snLCAnLndjYXBmLXJlc2V0LWZpbHRlcnMtYnRuJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCAncmVzZXQgYWxsIGZpbHRlcnMnICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHQvLyBUT0RPOiBNb3ZlIHRvIHByb1xuXHRcdGhhbmRsZUNsZWFyRmlsdGVyOiBmdW5jdGlvbigpIHtcblx0XHRcdCRib2R5XG5cdFx0XHRcdC5vbiggJ2NsaWNrJywgJy53Y2FwZi1maWx0ZXItY2xlYXItYnRuJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5hdHRyKCAnZGF0YS1jbGVhci1maWx0ZXItdXJsJyApICk7XG5cdFx0XHRcdH0gKVxuXHRcdFx0XHQub24oICdrZXlkb3duJywgJy53Y2FwZi1maWx0ZXItY2xlYXItYnRuJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0aWYgKCBlLmtleSA9PT0gJyAnIHx8IGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnU3BhY2ViYXInICkge1xuXHRcdFx0XHRcdFx0Ly8gUHJldmVudCB0aGUgZGVmYXVsdCBhY3Rpb24gdG8gc3RvcCBzY3JvbGxpbmcgd2hlbiBzcGFjZSBpcyBwcmVzc2VkXG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkKCB0aGlzICkuYXR0ciggJ2RhdGEtY2xlYXItZmlsdGVyLXVybCcgKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlRmlsdGVyVG9vbHRpcDogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICdmdW5jdGlvbicgIT09IHR5cGVvZiB0aXBweSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLnVzZV90aXBweWpzICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRpcHB5KCAnLndjYXBmLWZpbHRlci10b29sdGlwJywge1xuXHRcdFx0XHRwbGFjZW1lbnQ6ICd0b3AnLFxuXHRcdFx0XHRjb250ZW50KCByZWZlcmVuY2UgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlZmVyZW5jZS5nZXRBdHRyaWJ1dGUoICdkYXRhLWNvbnRlbnQnICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGFsbG93SFRNTDogdHJ1ZSxcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXRDb21ib2JveDogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgalF1ZXJ5KCkuY2hvc2VuV0NBUEYgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgdGVtcGxhdGVSZXN1bHQgPSAoIHRleHQsIGRhdGEgKSA9PiB7XG5cdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0JzxzcGFuPicgKyB0ZXh0ICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cIndjYXBmLWNvdW50XCI+JyArIGRhdGFbICdjb3VudE1hcmt1cCcgXSArICc8L3NwYW4+Jyxcblx0XHRcdFx0XS5qb2luKCAnJyApO1xuXHRcdFx0fTtcblxuXHRcdFx0Y29uc3QgdGVtcGxhdGVTZWxlY3Rpb24gPSAoIHRleHQsIGRhdGEgKSA9PiB7XG5cdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwid2NhcGYtY291bnQtJyArIGRhdGEuY291bnQgKyAnXCI+JyArIHRleHQgKyAnPC9zcGFuPicsXG5cdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwid2NhcGYtY291bnQgd2NhcGYtY291bnQtJyArIGRhdGEuY291bnQgKyAnXCI+JyArIGRhdGFbICdjb3VudE1hcmt1cCcgXSArICc8L3NwYW4+Jyxcblx0XHRcdFx0XS5qb2luKCAnJyApO1xuXHRcdFx0fTtcblxuXHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHtcblx0XHRcdFx0aW5oZXJpdF9zZWxlY3RfY2xhc3NlczogdHJ1ZSxcblx0XHRcdFx0aW5oZXJpdF9vcHRpb25fY2xhc3NlczogdHJ1ZSxcblx0XHRcdFx0bm9fcmVzdWx0c190ZXh0OiB3Y2FwZl9wYXJhbXMuY2hvc2VuX25vX3Jlc3VsdHNfdGV4dCxcblx0XHRcdFx0b3B0aW9uc19ub25lX3RleHQ6IHdjYXBmX3BhcmFtcy5jaG9zZW5fb3B0aW9uc19ub25lX3RleHQsXG5cdFx0XHRcdHNlYXJjaF9jb250YWluczogdHJ1ZSwgLy8gTWF0Y2ggZnJvbSBhbnl3aGVyZSBpbiBzdHJpbmcuXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5pc19ydGwgKSB7XG5cdFx0XHRcdG9wdGlvbnNbICdydGwnIF0gPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLWNob3NlbicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Ly8gSWYgaGllcmFyY2h5IGVuYWJsZWQgdGhlbiB3ZSBzaG93IHRoZSBzZWxlY3RlZCBvcHRpb25zLlxuXHRcdFx0XHRpZiAoICR0aGlzLmhhc0NsYXNzKCAnaGFzLWhpZXJhcmNoeScgKSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJyBdID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJyBdID0gd2NhcGZfcGFyYW1zLmNob3Nlbl9kaXNwbGF5X3NlbGVjdGVkX29wdGlvbnM7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBFbmFibGUgdGVtcGxhdGluZyB3aGVuIHNob3dpbmcgY291bnQuXG5cdFx0XHRcdGlmICggJHRoaXMuaGFzQ2xhc3MoICd3aXRoLWNvdW50JyApICkge1xuXHRcdFx0XHRcdG9wdGlvbnNbICd0ZW1wbGF0ZVJlc3VsdCcgXSAgICA9IHRlbXBsYXRlUmVzdWx0O1xuXHRcdFx0XHRcdG9wdGlvbnNbICd0ZW1wbGF0ZVNlbGVjdGlvbicgXSA9IHRlbXBsYXRlU2VsZWN0aW9uO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JHRoaXMuY2hvc2VuV0NBUEYoIG9wdGlvbnMgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gQXR0YWNoIGNob3NlbiBmb3IgZGVmYXVsdCBvcmRlcmJ5LlxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuYXR0YWNoX2Nob3Nlbl9vbl9zb3J0aW5nICkge1xuXHRcdFx0XHRsZXQgZGlzYWJsZVNlYXJjaCA9IHRydWU7XG5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2VhcmNoX2JveF9pbl9kZWZhdWx0X29yZGVyYnkgKSB7XG5cdFx0XHRcdFx0ZGlzYWJsZVNlYXJjaCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0b3B0aW9uc1sgJ2Rpc2FibGVfc2VhcmNoJyBdID0gZGlzYWJsZVNlYXJjaDtcblxuXHRcdFx0XHQkYm9keS5maW5kKCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nIHNlbGVjdC5vcmRlcmJ5JyApLmNob3NlbldDQVBGKCBvcHRpb25zICk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRpbml0UmFuZ2VTbGlkZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG5vVWlTbGlkZXIgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1yYW5nZS1zbGlkZXInICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRpdGVtICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0ICRzbGlkZXIgPSAkaXRlbS5maW5kKCAnLndjYXBmLW5vdWktc2xpZGVyJyApO1xuXG5cdFx0XHRcdGNvbnN0IHNsaWRlcklkICAgICAgICAgID0gJHNsaWRlci5hdHRyKCAnaWQnICk7XG5cdFx0XHRcdGNvbnN0IGRpc3BsYXlWYWx1ZXNBcyAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGlzcGxheS12YWx1ZXMtYXMnICk7XG5cdFx0XHRcdGNvbnN0IGZvcm1hdE51bWJlcnMgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZm9ybWF0LW51bWJlcnMnICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IHN0ZXAgICAgICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtc3RlcCcgKSApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsUGxhY2VzICAgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtcGxhY2VzJyApO1xuXHRcdFx0XHRjb25zdCB0aG91c2FuZFNlcGFyYXRvciA9ICRpdGVtLmF0dHIoICdkYXRhLXRob3VzYW5kLXNlcGFyYXRvcicgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFNlcGFyYXRvciAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXNlcGFyYXRvcicgKTtcblx0XHRcdFx0Y29uc3QgbWluVmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgJG1pblZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1pbi12YWx1ZScgKTtcblx0XHRcdFx0Y29uc3QgJG1heFZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1heC12YWx1ZScgKTtcblxuXHRcdFx0XHRjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggc2xpZGVySWQgKTtcblxuXHRcdFx0XHRub1VpU2xpZGVyLmNyZWF0ZSggc2xpZGVyLCB7XG5cdFx0XHRcdFx0c3RhcnQ6IFsgbWluVmFsdWUsIG1heFZhbHVlIF0sXG5cdFx0XHRcdFx0c3RlcCxcblx0XHRcdFx0XHRjb25uZWN0OiB0cnVlLFxuXHRcdFx0XHRcdGNzc1ByZWZpeDogJ3djYXBmLW5vdWktJyxcblx0XHRcdFx0XHRyYW5nZToge1xuXHRcdFx0XHRcdFx0J21pbic6IHJhbmdlTWluVmFsdWUsXG5cdFx0XHRcdFx0XHQnbWF4JzogcmFuZ2VNYXhWYWx1ZSxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ3VwZGF0ZScsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdFx0bGV0IG1pblZhbHVlO1xuXHRcdFx0XHRcdGxldCBtYXhWYWx1ZTtcblxuXHRcdFx0XHRcdGlmICggZm9ybWF0TnVtYmVycyApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gbnVtYmVyRm9ybWF0KCB2YWx1ZXNbIDAgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gbnVtYmVyRm9ybWF0KCB2YWx1ZXNbIDEgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDAgXSApO1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDEgXSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggJ3BsYWluX3RleHQnID09PSBkaXNwbGF5VmFsdWVzQXMgKSB7XG5cdFx0XHRcdFx0XHQkbWluVmFsdWUuaHRtbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHRcdCRtYXhWYWx1ZS5odG1sKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkbWluVmFsdWUudmFsKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdFx0JG1heFZhbHVlLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGYtbm91aXNsaWRlci11cGRhdGUnLCBbICRpdGVtLCB2YWx1ZXMgXSApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICkge1xuXHRcdFx0XHRcdGNvbnN0IF9taW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0Y29uc3QgX21heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblxuXHRcdFx0XHRcdC8vIElmIHZhbHVlIGlzIG5vdCBjaGFuZ2VkIHRoZW4gZG9uJ3QgcHJvY2VlZC5cblx0XHRcdFx0XHRpZiAoIF9taW5WYWx1ZSA9PT0gbWluVmFsdWUgJiYgX21heFZhbHVlID09PSBtYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIF9taW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBfbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHQvLyBSZW1vdmUgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJGl0ZW0uZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdGNvbnN0IHVybCA9ICRpdGVtLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIF9taW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBfbWF4VmFsdWUgKTtcblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtaW5WYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG1pblZhbHVlLCBudWxsIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkbWF4VmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRcdGNsZWFyVGltZW91dCggJGlucHV0LmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBudWxsLCBtYXhWYWx1ZSBdICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRpbml0RmlsdGVyT3B0aW9uVG9vbHRpcDogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICdmdW5jdGlvbicgIT09IHR5cGVvZiB0aXBweSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLnVzZV90aXBweWpzICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHRvb2x0aXBQb3NpdGlvbnMgPSBbICd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2xlZnQnIF07XG5cblx0XHRcdHRvb2x0aXBQb3NpdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oIHRvb2x0aXBQb3NpdGlvbiApIHtcblx0XHRcdFx0Y29uc3QgaWRlbnRpZmllciA9ICdkYXRhLXdjYXBmLXRvb2x0aXAtJyArIHRvb2x0aXBQb3NpdGlvbjtcblxuXHRcdFx0XHRjb25zdCBpbnN0YW5jZXMgPSB0aXBweSggJ1snICsgaWRlbnRpZmllciArICddJywge1xuXHRcdFx0XHRcdHBsYWNlbWVudDogdG9vbHRpcFBvc2l0aW9uLFxuXHRcdFx0XHRcdGNvbnRlbnQoIHJlZmVyZW5jZSApIHtcblx0XHRcdFx0XHRcdHJldHVybiByZWZlcmVuY2UuZ2V0QXR0cmlidXRlKCBpZGVudGlmaWVyICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0d2luZG93LnRpcHB5SW5zdGFuY2VzID0gdGlwcHlJbnN0YW5jZXMuY29uY2F0KCBpbnN0YW5jZXMgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0V0NBUEYuaW5pdENvbWJvYm94KCk7XG5cdFx0XHRXQ0FQRi5pbml0UmFuZ2VTbGlkZXIoKTtcblx0XHRcdFdDQVBGLmluaXRGaWx0ZXJPcHRpb25Ub29sdGlwKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEhhbmRsZSB0aGUgcG9wc3RhdGUgZXZlbnQoYnJvd3NlcidzIGJhY2svZm9yd2FyZClcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdwb3BzdGF0ZScsIGZ1bmN0aW9uKCBlICkge1xuXHRcdGlmICggbnVsbCAhPT0gZS5zdGF0ZSAmJiBlLnN0YXRlLmhhc093blByb3BlcnR5KCAnd2NhcGYnICkgKSB7XG5cdFx0XHRXQ0FQRi5maWx0ZXJQcm9kdWN0cyggJ3BvcHN0YXRlJyApO1xuXHRcdH1cblx0fSApO1xuXG5cdC8vIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzMzMDA0OTE3XG5cdGlmICggJ3Njcm9sbFJlc3RvcmF0aW9uJyBpbiBoaXN0b3J5ICkge1xuXHRcdGhpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb24gPSAnbWFudWFsJztcblx0fVxuXG59KCBqUXVlcnksIHdpbmRvdyApICk7XG5cbiggZnVuY3Rpb24oICQsIFdDQVBGICkge1xuXG5cdFdDQVBGLmluaXQoKTtcblxuXHRXQ0FQRi5oYW5kbGVGaWx0ZXJBY2NvcmRpb24oKTtcblx0V0NBUEYuaGFuZGxlSGllcmFyY2h5VG9nZ2xlKCk7XG5cdFdDQVBGLmhhbmRsZVNvZnRMaW1pdCgpO1xuXHRXQ0FQRi5oYW5kbGVTZWFyY2hGaWx0ZXJPcHRpb25zKCk7XG5cblx0V0NBUEYuaGFuZGxlTGlzdEZpbHRlcnMoKTtcblx0V0NBUEYuaGFuZGxlRHJvcGRvd25GaWx0ZXJzKCk7XG5cdFdDQVBGLmhhbmRsZU51bWJlcklucHV0RmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVQYWdpbmF0aW9uKCk7XG5cdFdDQVBGLmhhbmRsZURlZmF1bHRPcmRlcmJ5KCk7XG5cblx0V0NBUEYuaGFuZGxlUmVzZXRGaWx0ZXJzKCk7XG5cdFdDQVBGLmhhbmRsZUNsZWFyRmlsdGVyKCk7XG5cblx0V0NBUEYuaGFuZGxlRmlsdGVyVG9vbHRpcCgpO1xuXG59KCBqUXVlcnksIHdpbmRvdy5XQ0FQRiApICk7XG4iLCIvKipcbiAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM0MTQxODEzXG4gKlxuICogQHBhcmFtIG51bWJlclxuICogQHBhcmFtIGRlY2ltYWxzXG4gKiBAcGFyYW0gZGVjX3BvaW50XG4gKiBAcGFyYW0gdGhvdXNhbmRzX3NlcFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIG51bWJlckZvcm1hdCggbnVtYmVyLCBkZWNpbWFscywgZGVjX3BvaW50LCB0aG91c2FuZHNfc2VwICkge1xuXHQvLyBTdHJpcCBhbGwgY2hhcmFjdGVycyBidXQgbnVtZXJpY2FsIG9uZXMuXG5cdG51bWJlciA9ICggbnVtYmVyICsgJycgKS5yZXBsYWNlKCAvW15cXGQrXFwtRWUuXS9nLCAnJyApO1xuXG5cdGNvbnN0IG4gICAgPSAhIGlzRmluaXRlKCArbnVtYmVyICkgPyAwIDogK251bWJlcjtcblx0Y29uc3QgcHJlYyA9ICEgaXNGaW5pdGUoICtkZWNpbWFscyApID8gMCA6IE1hdGguYWJzKCBkZWNpbWFscyApO1xuXHRjb25zdCBzZXAgID0gKCB0eXBlb2YgdGhvdXNhbmRzX3NlcCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcsJyA6IHRob3VzYW5kc19zZXA7XG5cdGNvbnN0IGRlYyAgPSAoIHR5cGVvZiBkZWNfcG9pbnQgPT09ICd1bmRlZmluZWQnICkgPyAnLicgOiBkZWNfcG9pbnQ7XG5cblx0bGV0IHM7XG5cblx0Y29uc3QgdG9GaXhlZEZpeCA9IGZ1bmN0aW9uKCBuLCBwcmVjICkge1xuXHRcdGNvbnN0IGsgPSBNYXRoLnBvdyggMTAsIHByZWMgKTtcblx0XHRyZXR1cm4gJycgKyBNYXRoLnJvdW5kKCBuICogayApIC8gaztcblx0fTtcblxuXHQvLyBGaXggZm9yIElFIHBhcnNlRmxvYXQoMC41NSkudG9GaXhlZCgwKSA9IDA7XG5cdHMgPSAoIHByZWMgPyB0b0ZpeGVkRml4KCBuLCBwcmVjICkgOiAnJyArIE1hdGgucm91bmQoIG4gKSApLnNwbGl0KCAnLicgKTtcblxuXHRpZiAoIHNbIDAgXS5sZW5ndGggPiAzICkge1xuXHRcdHNbIDAgXSA9IHNbIDAgXS5yZXBsYWNlKCAvXFxCKD89KD86XFxkezN9KSsoPyFcXGQpKS9nLCBzZXAgKTtcblx0fVxuXG5cdGlmICggKCBzWyAxIF0gfHwgJycgKS5sZW5ndGggPCBwcmVjICkge1xuXHRcdHNbIDEgXSA9IHNbIDEgXSB8fCAnJztcblx0XHRzWyAxIF0gKz0gbmV3IEFycmF5KCBwcmVjIC0gc1sgMSBdLmxlbmd0aCArIDEgKS5qb2luKCAnMCcgKTtcblx0fVxuXG5cdHJldHVybiBzLmpvaW4oIGRlYyApO1xufVxuXG5mdW5jdGlvbiBjbGVhblVybCggdXJsICkge1xuXHRyZXR1cm4gdXJsLnJlcGxhY2UoIC8lMkMvZywgJywnICk7XG59XG5cbmZ1bmN0aW9uIGdldE9yZGVyQnlVcmwoIHVybCApIHtcblx0Y29uc3QgcGFnZWQgPSBwYXJzZUludCggdXJsLnJlcGxhY2UoIC8uK1xcL3BhZ2VcXC8oXFxkKykrLywgJyQxJyApICk7XG5cblx0aWYgKCBwYWdlZCApIHtcblx0XHR1cmwgPSB1cmwucmVwbGFjZSggL3BhZ2VcXC8oXFxkKylcXC8vLCAnJyApO1xuXHR9XG5cblx0cmV0dXJuIGNsZWFuVXJsKCB1cmwgKTtcbn1cbiJdfQ==
