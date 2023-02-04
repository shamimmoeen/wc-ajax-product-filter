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
  'update_document_title': '',
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


              var clearBtnSelector = '.wcapf-filter-title .wcapf-filter-clear-btn';

              var clearFilterUrl = _instance.find(clearBtnSelector).attr('data-clear-filter-url');

              $instance.find(clearBtnSelector).attr('data-clear-filter-url', clearFilterUrl); // Update the instance classes.

              $instance.attr('class', _instanceClasses.trim());

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

  if ('scrollRestoration' in history) {// TODO: Maybe use conditionally.
    // history.scrollRestoration = 'manual';
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbHRlci1mb3JtLmpzIiwicmVmYWN0b3JlZC5qcyIsInV0aWxzLmpzIl0sIm5hbWVzIjpbIndjYXBmX3BhcmFtcyIsImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwiJGJvZHkiLCJyYW5nZVZhbHVlc1NlcGFyYXRvciIsIl9kZWxheSIsInBhcnNlSW50IiwiZmlsdGVyX2lucHV0X2RlbGF5IiwiZGVsYXkiLCJmaWVsZHMiLCJ3Y2FwZlNpbmdsZUZpbHRlclNlbGVjdG9yIiwid2NhcGZOYXZGaWx0ZXJTZWxlY3RvciIsIndjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJTZWxlY3RvciIsIndjYXBmRGF0ZUZpbHRlclNlbGVjdG9yIiwiJHdjYXBmU2luZ2xlRmlsdGVycyIsIiR3Y2FwZk5hdkZpbHRlcnMiLCIkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMiLCIkd2NhcGZEYXRlRmlsdGVycyIsImVhY2giLCIkZmllbGQiLCJpZCIsImF0dHIiLCIkd3JhcHBlciIsImZpbmQiLCJmaWx0ZXJLZXkiLCJtdWx0aXBsZUZpbHRlciIsImluaXRDaG9zZW4iLCJjaG9zZW4iLCIkcm9vdCIsImZvcl9wcmV2aWV3IiwiJHRoaXMiLCJvcHRpb25zIiwiaW5oZXJpdF9zZWxlY3RfY2xhc3NlcyIsImluaGVyaXRfb3B0aW9uX2NsYXNzZXMiLCJpc19ydGwiLCJub1Jlc3VsdHNNZXNzYWdlIiwic2VhcmNoVGhyZXNob2xkIiwiY2hvc2VuX2xpYl9zZWFyY2hfdGhyZXNob2xkIiwiaW5pdEhpZXJhcmNoeUFjY29yZGlvbiIsInRvZ2dsZUFjY29yZGlvbiIsIiRlbCIsInByZXNzZWQiLCIkY2hpbGQiLCJjbG9zZXN0IiwiY2hpbGRyZW4iLCJlbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uIiwic2xpZGVUb2dnbGUiLCJoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsInRvZ2dsZSIsIm9uIiwiZSIsImtleSIsInByZXZlbnREZWZhdWx0IiwibnVtYmVyX2Zvcm1hdCIsIm51bWJlciIsImRlY2ltYWxzIiwiZGVjX3BvaW50IiwidGhvdXNhbmRzX3NlcCIsInJlcGxhY2UiLCJuIiwiaXNGaW5pdGUiLCJwcmVjIiwiTWF0aCIsImFicyIsInNlcCIsImRlYyIsInMiLCJ0b0ZpeGVkRml4IiwiayIsInBvdyIsInJvdW5kIiwic3BsaXQiLCJsZW5ndGgiLCJBcnJheSIsImpvaW4iLCJpbml0Tm9VSVNsaWRlciIsIm5vVWlTbGlkZXIiLCIkaXRlbSIsIiRzbGlkZXIiLCJoYXNDbGFzcyIsInNsaWRlcklkIiwiZGlzcGxheVZhbHVlc0FzIiwiZm9ybWF0TnVtYmVycyIsInJhbmdlTWluVmFsdWUiLCJwYXJzZUZsb2F0IiwicmFuZ2VNYXhWYWx1ZSIsInN0ZXAiLCJkZWNpbWFsUGxhY2VzIiwidGhvdXNhbmRTZXBhcmF0b3IiLCJkZWNpbWFsU2VwYXJhdG9yIiwibWluVmFsdWUiLCJtYXhWYWx1ZSIsIiRtaW5WYWx1ZSIsIiRtYXhWYWx1ZSIsInNsaWRlciIsImdldEVsZW1lbnRCeUlkIiwiY3JlYXRlIiwic3RhcnQiLCJjb25uZWN0IiwiY3NzUHJlZml4IiwicmFuZ2UiLCJ2YWx1ZXMiLCJodG1sIiwidmFsIiwidHJpZ2dlciIsImZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIiLCJyZXF1ZXN0RmlsdGVyIiwiZGF0YSIsInVybCIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJyZW1vdmVEYXRhIiwiZXZlbnQiLCIkaW5wdXQiLCJzZXQiLCJnZXQiLCJmaWx0ZXJCeURhdGUiLCIkd2NhcGZEYXRlRmlsdGVyIiwiaXNSYW5nZSIsImZpbHRlclZhbHVlIiwicnVuRmlsdGVyIiwiZnJvbSIsInRvIiwidXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIiLCJxdWVyeSIsInJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsImZpbHRlclByb2R1Y3RzIiwiaW5pdERhdGVwaWNrZXIiLCJkYXRlcGlja2VyIiwiZm9ybWF0IiwieWVhckRyb3Bkb3duIiwibW9udGhEcm9wZG93biIsIiRmcm9tIiwiJHRvIiwiZGF0ZUZvcm1hdCIsImNoYW5nZVllYXIiLCJjaGFuZ2VNb250aCIsImluaXREZWZhdWx0T3JkZXJCeSIsImF0dGFjaF9jaG9zZW5fb25fc29ydGluZyIsInNvcnRpbmdfY29udHJvbCIsIiRvcmRlcmluZ0Zvcm0iLCJzdWJtaXQiLCJvcmRlciIsImZpbHRlcl9rZXkiLCJ1cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0IiwiJHJlc3VsdHMiLCJzZWxlY3RvciIsInNob3BfbG9vcF9jb250YWluZXIiLCJuZXdQcm9kdWN0Q291bnQiLCJzaG93TG9hZGluZ0FuaW1hdGlvbiIsImxvYWRpbmdfYW5pbWF0aW9uIiwiTG9hZGluZ092ZXJsYXkiLCJsb2FkaW5nX292ZXJsYXlfb3B0aW9ucyIsImRpc2FibGVOb1VpU2xpZGVycyIsImVsZW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJkaXNhYmxlTGFiZWxzIiwic2VsZWN0b3JzIiwiYWRkQ2xhc3MiLCJkaXNhYmxlSW5wdXRzIiwiZGlzYWJsZV9pbnB1dHNfd2hpbGVfZmV0Y2hpbmdfcmVzdWx0cyIsImlucHV0cyIsImVuYWJsZU5vVWlTbGlkZXJzIiwicmVtb3ZlQXR0cmlidXRlIiwiZW5hYmxlSW5wdXRzIiwicmVtb3ZlQXR0ciIsInJlc2V0TG9hZGluZ0FuaW1hdGlvbiIsInNjcm9sbFRvIiwic2Nyb2xsX3dpbmRvdyIsInNjcm9sbEZvciIsInNjcm9sbF93aW5kb3dfZm9yIiwiaXNNb2JpbGUiLCJpc19tb2JpbGUiLCJwcm9jZWVkIiwiYWRqdXN0aW5nT2Zmc2V0Iiwib2Zmc2V0Iiwic2Nyb2xsX3RvX3RvcF9vZmZzZXQiLCJjb250YWluZXIiLCJub3RfZm91bmRfY29udGFpbmVyIiwic2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudCIsIiRjb250YWluZXIiLCJ0b3AiLCJzdG9wIiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsInNjcm9sbF90b190b3Bfc3BlZWQiLCJzY3JvbGxfdG9fdG9wX2Vhc2luZyIsImJlZm9yZUZldGNoaW5nUHJvZHVjdHMiLCJzY3JvbGxfd2luZG93X3doZW4iLCJiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzIiwiYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzIiwiZm9yY2VSZVJlbmRlciIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsIiRkYXRhIiwiZmllbGRJRCIsIiRpbm5lciIsIl9maWVsZCIsImZpZWxkQ2xhc3NlcyIsInByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUiLCJpdGVtVmFsdWUiLCJwYXJlbnQiLCJ0b2dnbGVTZWxlY3RvciIsInVsU2VsZWN0b3IiLCJfY2xhc3NlcyIsInNob3ciLCJfaHRtbCIsInNvZnRMaW1pdFNlbGVjdG9yIiwidHJpbSIsIiRzaG9wTG9vcENvbnRhaW5lciIsIiRub3RGb3VuZENvbnRhaW5lciIsImdldFVybFZhcnMiLCJ2YXJzIiwiaGFzaCIsInJlcGxhY2VBbGwiLCJoYXNoZXMiLCJzbGljZSIsImluZGV4T2YiLCJoTGVuZ3RoIiwiaSIsImZpeFBhZ2luYXRpb24iLCJwYXJhbXMiLCJjdXJyZW50UGFnZUluVXJsIiwiY3VycmVudFBhZ2VJblBhcmFtcyIsInZhbHVlIiwicHVzaEhpc3RvcnkiLCJyZSIsIlJlZ0V4cCIsInNlcGFyYXRvciIsInVybFdpdGhRdWVyeSIsIm1hdGNoIiwib2xkUGFyYW1zIiwib2xkUGFyYW1zTGVuZ3RoIiwiT2JqZWN0Iiwia2V5cyIsInN0YXJ0UG9zaXRpb24iLCJmaWx0ZXJLZXlQb3NpdGlvbiIsImNsZWFuVXJsIiwiY2xlYW5RdWVyeSIsIm5ld1BhcmFtcyIsIm1ha2VQYXJhbWV0ZXJzIiwiZm9yY2VSZXJlbmRlciIsInZhbHVlU2VwYXJhdG9yIiwibmV4dFZhbHVlcyIsImVtcHR5VmFsdWUiLCJwcmV2VmFsdWVzIiwicHJldlZhbHVlc0FycmF5IiwiZm91bmQiLCJpbkFycmF5Iiwic3BsaWNlIiwicHVzaCIsInNpbmdsZUZpbHRlciIsImVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4IiwicGFnaW5hdGlvbl9jb250YWluZXIiLCJoYW5kbGVGaWx0ZXJSZXF1ZXN0IiwiZmllbGREYXRhIiwiJHNlbGVjdCIsImZpbHRlclVSTCIsImNsZWFyRmlsdGVyVVJMIiwidG9TdHJpbmciLCJyYW5nZU51bWJlclNlbGVjdG9ycyIsIiRyYW5nZU51bWJlciIsImdldFZhbHVlIiwiZmxvYXRWYWx1ZSIsImlzTmFOIiwicmVzZXRGaWx0ZXJzIiwiJGJ1dHRvbiIsIl9maWx0ZXJLZXlzIiwiZmlsdGVyS2V5cyIsInByZXZVcmwiLCJuZXdVcmwiLCJhcHBseV9maWx0ZXJzX29uX2Jyb3dzZXJfaGlzdG9yeV9jaGFuZ2UiLCJiaW5kIiwiaW5zdGFuY2VJZHMiLCJmb2N1c2VkRWxtIiwidGlwcHlJbnN0YW5jZXMiLCJXQ0FQRiIsImhhbmRsZUZpbHRlckFjY29yZGlvbiIsIiRmaWx0ZXJJbm5lciIsImVuYWJsZV9hbmltYXRpb25fZm9yX2ZpbHRlcl9hY2NvcmRpb24iLCJmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsInN0b3BQcm9wYWdhdGlvbiIsIiR0cmlnZ2VyIiwiaGFuZGxlSGllcmFyY2h5VG9nZ2xlIiwiaGFuZGxlU29mdExpbWl0IiwidG9nZ2xlRmlsdGVyT3B0aW9ucyIsIiRsaXN0V3JhcHBlciIsInJlbW92ZUNsYXNzIiwiaGFuZGxlU2VhcmNoRmlsdGVyT3B0aW9ucyIsIiR0aGF0IiwiJGZpbHRlciIsInNvZnRMaW1pdEVuYWJsZWQiLCJzb2Z0TGltaXRUb2dnbGUiLCJ2aXNpYmxlT3B0aW9ucyIsImtleXdvcmQiLCJpbmRleCIsIiRmaWx0ZXJJdGVtIiwibGFiZWwiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwiaGlkZSIsIiRyZXNwb25zZSIsIm5ld0NvdW50IiwiaGFzIiwidHJpZ2dlcmVkQnkiLCJhbGxvd2VkIiwic2Nyb2xsV2hlbiIsImRpc2FibGVfc2Nyb2xsX2FuaW1hdGlvbiIsImFjdGl2ZUVsZW1lbnQiLCJpbW1lZGlhdGVfc2Nyb2xsX29uX3BhZ2luYXRlIiwiZGVzdHJveVRpcHB5SW5zdGFuY2VzIiwidXNlX3RpcHB5anMiLCJmb3JFYWNoIiwiaW5zdGFuY2UiLCJkZXN0cm95IiwicmVzdG9yZV9mb2N1c19hZnRlcl9maWx0ZXJpbmciLCJib2R5IiwiZm9jdXMiLCJpbml0IiwiYWpheCIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsInVwZGF0ZV9kb2N1bWVudF90aXRsZSIsInRpdGxlIiwiZmlsdGVyIiwidGV4dCIsImluc3RhbmNlSWQiLCIkaW5zdGFuY2UiLCJfaW5zdGFuY2UiLCJfaW5zdGFuY2VDbGFzc2VzIiwicHJlc2VydmVfc29mdF9saW1pdF9zdGF0ZSIsImNsZWFyQnRuU2VsZWN0b3IiLCJjbGVhckZpbHRlclVybCIsImhvc3RuYW1lIiwid2NhcGYiLCJoYW5kbGVOdW1iZXJJbnB1dEZpbHRlcnMiLCJvbGRNaW5WYWx1ZSIsIm9sZE1heFZhbHVlIiwibnVtYmVyRm9ybWF0IiwiaGFuZGxlTGlzdEZpbHRlcnMiLCJuYXRpdmVJbnB1dHMiLCJjdXN0b21SYWRpb1NlbGVjdG9yIiwibm90IiwicHJvcCIsImhhbmRsZURyb3Bkb3duRmlsdGVycyIsImhhbmRsZVBhZ2luYXRpb24iLCJoYW5kbGVEZWZhdWx0T3JkZXJieSIsIlVSTCIsInNlYXJjaFBhcmFtcyIsImdldE9yZGVyQnlVcmwiLCJoYW5kbGVSZXNldEZpbHRlcnMiLCJjb25zb2xlIiwibG9nIiwiaGFuZGxlQ2xlYXJGaWx0ZXIiLCJoYW5kbGVGaWx0ZXJUb29sdGlwIiwidGlwcHkiLCJwbGFjZW1lbnQiLCJjb250ZW50IiwicmVmZXJlbmNlIiwiZ2V0QXR0cmlidXRlIiwiYWxsb3dIVE1MIiwiaW5pdENvbWJvYm94IiwiY2hvc2VuV0NBUEYiLCJ0ZW1wbGF0ZVJlc3VsdCIsInRlbXBsYXRlU2VsZWN0aW9uIiwiY291bnQiLCJub19yZXN1bHRzX3RleHQiLCJjaG9zZW5fbm9fcmVzdWx0c190ZXh0Iiwib3B0aW9uc19ub25lX3RleHQiLCJjaG9zZW5fb3B0aW9uc19ub25lX3RleHQiLCJzZWFyY2hfY29udGFpbnMiLCJjaG9zZW5fZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zIiwiZGlzYWJsZVNlYXJjaCIsInNlYXJjaF9ib3hfaW5fZGVmYXVsdF9vcmRlcmJ5IiwiaW5pdFJhbmdlU2xpZGVyIiwiX21pblZhbHVlIiwiX21heFZhbHVlIiwiaW5pdEZpbHRlck9wdGlvblRvb2x0aXAiLCJ0b29sdGlwUG9zaXRpb25zIiwidG9vbHRpcFBvc2l0aW9uIiwiaWRlbnRpZmllciIsImluc3RhbmNlcyIsImNvbmNhdCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzdGF0ZSIsImhhc093blByb3BlcnR5IiwicGFnZWQiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLFlBQVksR0FBR0EsWUFBWSxJQUFJO0FBQ3BDLFlBQVUsRUFEMEI7QUFFcEMsd0JBQXNCLEVBRmM7QUFHcEMscUNBQW1DLEVBSEM7QUFJcEMsNEJBQTBCLEVBSlU7QUFLcEMsOEJBQTRCLEVBTFE7QUFNcEMsbUNBQWlDLEVBTkc7QUFPcEMsaUNBQStCLEVBUEs7QUFPRDtBQUNuQyx3Q0FBc0MsRUFSRjtBQVNwQywrQkFBNkIsRUFUTztBQVVwQywyQ0FBeUMsRUFWTDtBQVdwQyxzQ0FBb0MsRUFYQTtBQVlwQyx1Q0FBcUMsRUFaRDtBQWFwQyw4Q0FBNEMsRUFiUjtBQWNwQyx5Q0FBdUMsRUFkSDtBQWVwQywwQ0FBd0MsRUFmSjtBQWdCcEMsbUNBQWlDLEVBaEJHO0FBaUJwQyw2QkFBMkIsRUFqQlM7QUFrQnBDLHlCQUF1QixFQWxCYTtBQW1CcEMsMEJBQXdCLEVBbkJZO0FBb0JwQyxrQ0FBZ0MsRUFwQkk7QUFxQnBDLGVBQWEsRUFyQnVCO0FBc0JwQyxpQkFBZSxFQXRCcUI7QUF1QnBDLHlCQUF1QixFQXZCYTtBQXdCcEMs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RixDQUFELENBQU9NLE1BQWQsR0FBdUIsQ0FBbEMsRUFBc0NFLElBQXRDLENBQTRDLEdBQTVDLENBQVY7QUFDQTs7QUFFRCxTQUFPUixDQUFDLENBQUNRLElBQUYsQ0FBUVQsR0FBUixDQUFQO0FBQ0E7O0FBRUQsU0FBUytLLFFBQVQsQ0FBbUJwSSxHQUFuQixFQUF5QjtBQUN4QixTQUFPQSxHQUFHLENBQUNsRCxPQUFKLENBQWEsTUFBYixFQUFxQixHQUFyQixDQUFQO0FBQ0E7O0FBRUQsU0FBU3VTLGFBQVQsQ0FBd0JyUCxHQUF4QixFQUE4QjtBQUM3QixNQUFNMFIsS0FBSyxHQUFHalksUUFBUSxDQUFFdUcsR0FBRyxDQUFDbEQsT0FBSixDQUFhLGtCQUFiLEVBQWlDLElBQWpDLENBQUYsQ0FBdEI7O0FBRUEsTUFBSzRVLEtBQUwsRUFBYTtBQUNaMVIsSUFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUNsRCxPQUFKLENBQWEsZUFBYixFQUE4QixFQUE5QixDQUFOO0FBQ0E7O0FBRUQsU0FBT3NMLFFBQVEsQ0FBRXBJLEdBQUYsQ0FBZjtBQUNBIiwiZmlsZSI6IndjLWFqYXgtcHJvZHVjdC1maWx0ZXItcHVibGljLXNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSBmcm9udGVuZCBmaWx0ZXIgZm9ybS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9wdWJsaWMvc3JjL2pzXG4gKiBAYXV0aG9yICAgICB3cHRvb2xzLmlvXG4gKi9cblxuY29uc3Qgd2NhcGZfcGFyYW1zID0gd2NhcGZfcGFyYW1zIHx8IHtcblx0J2lzX3J0bCc6ICcnLFxuXHQnZmlsdGVyX2lucHV0X2RlbGF5JzogJycsXG5cdCdjaG9zZW5fZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJzogJycsXG5cdCdjaG9zZW5fbm9fcmVzdWx0c190ZXh0JzogJycsXG5cdCdjaG9zZW5fb3B0aW9uc19ub25lX3RleHQnOiAnJyxcblx0J3NlYXJjaF9ib3hfaW5fZGVmYXVsdF9vcmRlcmJ5JzogJycsXG5cdCdjaG9zZW5fbGliX3NlYXJjaF90aHJlc2hvbGQnOiAnJywgLy8gdG9kb1xuXHQncHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSc6ICcnLFxuXHQncHJlc2VydmVfc29mdF9saW1pdF9zdGF0ZSc6ICcnLFxuXHQnZW5hYmxlX2FuaW1hdGlvbl9mb3JfZmlsdGVyX2FjY29yZGlvbic6ICcnLFxuXHQnZmlsdGVyX2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQnOiAnJyxcblx0J2ZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyc6ICcnLFxuXHQnZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbic6ICcnLFxuXHQnaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQnOiAnJyxcblx0J2hpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyc6ICcnLFxuXHQncmVzdG9yZV9mb2N1c19hZnRlcl9maWx0ZXJpbmcnOiAnJyxcblx0J2xvYWRpbmdfb3ZlcmxheV9vcHRpb25zJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX3NwZWVkJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX2Vhc2luZyc6ICcnLFxuXHQnaW1tZWRpYXRlX3Njcm9sbF9vbl9wYWdpbmF0ZSc6ICcnLFxuXHQnaXNfbW9iaWxlJzogJycsXG5cdCd1c2VfdGlwcHlqcyc6ICcnLFxuXHQnc2hvcF9sb29wX2NvbnRhaW5lcic6ICcnLFxuXHQnbm90X2ZvdW5kX2NvbnRhaW5lcic6ICcnLFxuXHQnZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXgnOiAnJyxcblx0J3BhZ2luYXRpb25fY29udGFpbmVyJzogJycsXG5cdCdzb3J0aW5nX2NvbnRyb2wnOiAnJyxcblx0J2F0dGFjaF9jaG9zZW5fb25fc29ydGluZyc6ICcnLFxuXHQnbG9hZGluZ19hbmltYXRpb24nOiAnJyxcblx0J3Njcm9sbF93aW5kb3cnOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfZm9yJzogJycsXG5cdCdzY3JvbGxfd2luZG93X3doZW4nOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfY3VzdG9tX2VsZW1lbnQnOiAnJyxcblx0J3Njcm9sbF90b190b3Bfb2Zmc2V0JzogJycsXG5cdCdkaXNhYmxlX3Njcm9sbF9hbmltYXRpb24nOiAnJyxcblx0J3VwZGF0ZV9kb2N1bWVudF90aXRsZSc6ICcnLFxuXHQnZm9yX3ByZXZpZXcnOiAnJyxcbn07XG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0cmV0dXJuO1xuXG5cdGNvbnN0ICRib2R5ID0gJCggJ2JvZHknICk7XG5cblx0Y29uc3QgcmFuZ2VWYWx1ZXNTZXBhcmF0b3IgPSAnfic7XG5cblx0Y29uc3QgX2RlbGF5ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5maWx0ZXJfaW5wdXRfZGVsYXkgKTtcblx0Y29uc3QgZGVsYXkgID0gX2RlbGF5ID49IDAgPyBfZGVsYXkgOiA4MDA7XG5cblx0Ly8gU3RvcmUgZmllbGRzJyBpZCBhbmQgZmlsdGVyIGluZm9ybWF0aW9uLlxuXHRjb25zdCBmaWVsZHMgPSB7fTtcblxuXHRjb25zdCB3Y2FwZlNpbmdsZUZpbHRlclNlbGVjdG9yICAgICAgPSAnLndjYXBmLXNpbmdsZS1maWx0ZXInO1xuXHRjb25zdCB3Y2FwZk5hdkZpbHRlclNlbGVjdG9yICAgICAgICAgPSAnLndjYXBmLW5hdi1maWx0ZXInO1xuXHRjb25zdCB3Y2FwZk51bWJlclJhbmdlRmlsdGVyU2VsZWN0b3IgPSAnLndjYXBmLW51bWJlci1yYW5nZS1maWx0ZXInO1xuXHRjb25zdCB3Y2FwZkRhdGVGaWx0ZXJTZWxlY3RvciAgICAgICAgPSAnLndjYXBmLWRhdGUtcmFuZ2UtZmlsdGVyJztcblxuXHRjb25zdCAkd2NhcGZTaW5nbGVGaWx0ZXJzICAgICAgPSAkKCB3Y2FwZlNpbmdsZUZpbHRlclNlbGVjdG9yICk7XG5cdGNvbnN0ICR3Y2FwZk5hdkZpbHRlcnMgICAgICAgICA9ICQoIHdjYXBmTmF2RmlsdGVyU2VsZWN0b3IgKTtcblx0Y29uc3QgJHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzID0gJCggd2NhcGZOdW1iZXJSYW5nZUZpbHRlclNlbGVjdG9yICk7XG5cdGNvbnN0ICR3Y2FwZkRhdGVGaWx0ZXJzICAgICAgICA9ICQoIHdjYXBmRGF0ZUZpbHRlclNlbGVjdG9yICk7XG5cblx0JHdjYXBmU2luZ2xlRmlsdGVycy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgICAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBpZCAgICAgICAgICAgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRjb25zdCAkd3JhcHBlciAgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZpZWxkLWlubmVyID4gZGl2JyApO1xuXHRcdGNvbnN0IGZpbHRlcktleSAgICAgID0gJHdyYXBwZXIuYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRjb25zdCBtdWx0aXBsZUZpbHRlciA9IHBhcnNlSW50KCAkd3JhcHBlci5hdHRyKCAnZGF0YS1tdWx0aXBsZS1maWx0ZXInICkgKTtcblxuXHRcdGZpZWxkc1sgaWQgXSA9IHtcblx0XHRcdGZpbHRlcktleTogZmlsdGVyS2V5LFxuXHRcdFx0bXVsdGlwbGVGaWx0ZXI6IG11bHRpcGxlRmlsdGVyXG5cdFx0fTtcblx0fSApO1xuXG5cdC8vIEluaXRpYWxpemUgalF1ZXJ5IGNob3NlbiBsaWJyYXJ5LlxuXHRmdW5jdGlvbiBpbml0Q2hvc2VuKCkge1xuXHRcdGlmICggISBqUXVlcnkoKS5jaG9zZW4gKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0ICRyb290O1xuXG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZm9yX3ByZXZpZXcgKSB7XG5cdFx0XHQkcm9vdCA9ICQoIHdjYXBmTmF2RmlsdGVyU2VsZWN0b3IgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHJvb3QgPSAkd2NhcGZOYXZGaWx0ZXJzO1xuXHRcdH1cblxuXHRcdCRyb290LmZpbmQoICcud2NhcGYtY2hvc2VuLXNlbGVjdCcgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzICAgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCBvcHRpb25zID0ge1xuXHRcdFx0XHRpbmhlcml0X3NlbGVjdF9jbGFzc2VzOiB0cnVlLFxuXHRcdFx0XHRpbmhlcml0X29wdGlvbl9jbGFzc2VzOiB0cnVlLFxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuaXNfcnRsICkge1xuXHRcdFx0XHRvcHRpb25zWyAncnRsJyBdID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgbm9SZXN1bHRzTWVzc2FnZSA9ICR0aGlzLmF0dHIoICdkYXRhLW5vLXJlc3VsdHMtbWVzc2FnZScgKTtcblxuXHRcdFx0aWYgKCBub1Jlc3VsdHNNZXNzYWdlICkge1xuXHRcdFx0XHRvcHRpb25zWyAnbm9fcmVzdWx0c190ZXh0JyBdID0gbm9SZXN1bHRzTWVzc2FnZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gb3B0aW9uc1sgJ2Rpc2FibGVfc2VhcmNoJyBdID0gdHJ1ZTtcblxuXHRcdFx0Y29uc3Qgc2VhcmNoVGhyZXNob2xkID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5jaG9zZW5fbGliX3NlYXJjaF90aHJlc2hvbGQgKTtcblxuXHRcdFx0aWYgKCBzZWFyY2hUaHJlc2hvbGQgKSB7XG5cdFx0XHRcdC8vIG9wdGlvbnNbICdkaXNhYmxlX3NlYXJjaF90aHJlc2hvbGQnIF0gPSBzZWFyY2hUaHJlc2hvbGQ7XG5cdFx0XHR9XG5cblx0XHRcdC8vIG9wdGlvbnNbICdkaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMnIF0gPSBmYWxzZTtcblxuXHRcdFx0Ly8gbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IDIwXG5cblx0XHRcdC8vIG9wdGlvbnNbJ21pbmltdW1SZXN1bHRzRm9yU2VhcmNoJ10gPSAtMTtcblxuXHRcdFx0JHRoaXMuY2hvc2VuKCBvcHRpb25zICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdENob3NlbigpO1xuXG5cdC8vIEluaXRpYWxpemUgaGllcmFyY2h5IGFjY29yZGlvbi5cblx0ZnVuY3Rpb24gaW5pdEhpZXJhcmNoeUFjY29yZGlvbigpIHtcblx0XHRsZXQgJHJvb3Q7XG5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5mb3JfcHJldmlldyApIHtcblx0XHRcdCRyb290ID0gJCggd2NhcGZOYXZGaWx0ZXJTZWxlY3RvciApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkcm9vdCA9ICR3Y2FwZk5hdkZpbHRlcnM7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdG9nZ2xlQWNjb3JkaW9uKCAkZWwgKSB7XG5cdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGJ1dHRvbiBpcyBwcmVzc2VkXG5cdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLXByZXNzZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0Ly8gQ2hhbmdlIGFyaWEtcHJlc3NlZCB0byB0aGUgb3Bwb3NpdGUgc3RhdGVcblx0XHRcdCRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJywgISBwcmVzc2VkICk7XG5cblx0XHRcdGNvbnN0ICRjaGlsZCA9ICRlbC5jbG9zZXN0KCAnbGknICkuY2hpbGRyZW4oICd1bCcgKTtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbiApIHtcblx0XHRcdFx0JGNoaWxkLnNsaWRlVG9nZ2xlKFxuXHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5oaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCxcblx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nXG5cdFx0XHRcdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkY2hpbGQudG9nZ2xlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0JHJvb3QuZmluZCggJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScgKS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdH0gKTtcblxuXHRcdCRyb290LmZpbmQoICcud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnICkub24oICdrZXlkb3duJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRpZiAoIGUua2V5ID09PSAnICcgfHwgZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICdTcGFjZWJhcicgKSB7XG5cdFx0XHRcdC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgYWN0aW9uIHRvIHN0b3Agc2Nyb2xsaW5nIHdoZW4gc3BhY2UgaXMgcHJlc3NlZFxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkKCB0aGlzICkgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRpbml0SGllcmFyY2h5QWNjb3JkaW9uKCk7XG5cblx0LyoqXG5cdCAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM0MTQxODEzXG5cdCAqXG5cdCAqIEBwYXJhbSBudW1iZXJcblx0ICogQHBhcmFtIGRlY2ltYWxzXG5cdCAqIEBwYXJhbSBkZWNfcG9pbnRcblx0ICogQHBhcmFtIHRob3VzYW5kc19zZXBcblx0ICpcblx0ICogQHJldHVybnMge3N0cmluZ31cblx0ICovXG5cdGZ1bmN0aW9uIG51bWJlcl9mb3JtYXQoIG51bWJlciwgZGVjaW1hbHMsIGRlY19wb2ludCwgdGhvdXNhbmRzX3NlcCApIHtcblx0XHQvLyBTdHJpcCBhbGwgY2hhcmFjdGVycyBidXQgbnVtZXJpY2FsIG9uZXMuXG5cdFx0bnVtYmVyID0gKCBudW1iZXIgKyAnJyApLnJlcGxhY2UoIC9bXlxcZCtcXC1FZS5dL2csICcnICk7XG5cblx0XHRjb25zdCBuICAgID0gISBpc0Zpbml0ZSggK251bWJlciApID8gMCA6ICtudW1iZXI7XG5cdFx0Y29uc3QgcHJlYyA9ICEgaXNGaW5pdGUoICtkZWNpbWFscyApID8gMCA6IE1hdGguYWJzKCBkZWNpbWFscyApO1xuXHRcdGNvbnN0IHNlcCAgPSAoIHR5cGVvZiB0aG91c2FuZHNfc2VwID09PSAndW5kZWZpbmVkJyApID8gJywnIDogdGhvdXNhbmRzX3NlcDtcblx0XHRjb25zdCBkZWMgID0gKCB0eXBlb2YgZGVjX3BvaW50ID09PSAndW5kZWZpbmVkJyApID8gJy4nIDogZGVjX3BvaW50O1xuXG5cdFx0bGV0IHM7XG5cblx0XHRjb25zdCB0b0ZpeGVkRml4ID0gZnVuY3Rpb24oIG4sIHByZWMgKSB7XG5cdFx0XHRjb25zdCBrID0gTWF0aC5wb3coIDEwLCBwcmVjICk7XG5cdFx0XHRyZXR1cm4gJycgKyBNYXRoLnJvdW5kKCBuICogayApIC8gaztcblx0XHR9O1xuXG5cdFx0Ly8gRml4IGZvciBJRSBwYXJzZUZsb2F0KDAuNTUpLnRvRml4ZWQoMCkgPSAwO1xuXHRcdHMgPSAoIHByZWMgPyB0b0ZpeGVkRml4KCBuLCBwcmVjICkgOiAnJyArIE1hdGgucm91bmQoIG4gKSApLnNwbGl0KCAnLicgKTtcblxuXHRcdGlmICggc1sgMCBdLmxlbmd0aCA+IDMgKSB7XG5cdFx0XHRzWyAwIF0gPSBzWyAwIF0ucmVwbGFjZSggL1xcQig/PSg/OlxcZHszfSkrKD8hXFxkKSkvZywgc2VwICk7XG5cdFx0fVxuXG5cdFx0aWYgKCAoIHNbIDEgXSB8fCAnJyApLmxlbmd0aCA8IHByZWMgKSB7XG5cdFx0XHRzWyAxIF0gPSBzWyAxIF0gfHwgJyc7XG5cdFx0XHRzWyAxIF0gKz0gbmV3IEFycmF5KCBwcmVjIC0gc1sgMSBdLmxlbmd0aCArIDEgKS5qb2luKCAnMCcgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcy5qb2luKCBkZWMgKTtcblx0fVxuXG5cdC8vIEluaXRpYWxpemUgbm9VSVNsaWRlci5cblx0ZnVuY3Rpb24gaW5pdE5vVUlTbGlkZXIoKSB7XG5cdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG5vVWlTbGlkZXIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0ICRyb290O1xuXG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZm9yX3ByZXZpZXcgKSB7XG5cdFx0XHQkcm9vdCA9ICQoIHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJTZWxlY3RvciApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkcm9vdCA9ICR3Y2FwZk51bWJlclJhbmdlRmlsdGVycztcblx0XHR9XG5cblx0XHQkcm9vdC5maW5kKCAnLndjYXBmLXJhbmdlLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRpdGVtID0gJCggdGhpcyApO1xuXG5cdFx0XHQvLyBUT0RPOiBSZW1vdmUgZmlsdGVyIGtleS5cblx0XHRcdGNvbnN0IGZpbHRlcktleSA9ICRpdGVtLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0XHRjb25zdCAkc2xpZGVyICAgPSAkaXRlbS5maW5kKCAnLndjYXBmLW5vdWktc2xpZGVyJyApO1xuXG5cdFx0XHQvLyBJZiBzbGlkZXIgaXMgYWxyZWFkeSBpbml0aWFsaXplZCB0aGVuIGRvbid0IHJlaW5pdGlhbGl6ZSBhZ2Fpbi5cblx0XHRcdGlmICggJHNsaWRlci5oYXNDbGFzcyggJ3djYXBmLW5vdWktdGFyZ2V0JyApICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHNsaWRlcklkICAgICAgICAgID0gJHNsaWRlci5hdHRyKCAnaWQnICk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VmFsdWVzQXMgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRpc3BsYXktdmFsdWVzLWFzJyApO1xuXHRcdFx0Y29uc3QgZm9ybWF0TnVtYmVycyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1mb3JtYXQtbnVtYmVycycgKTtcblx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApICk7XG5cdFx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdFx0Y29uc3Qgc3RlcCAgICAgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1zdGVwJyApICk7XG5cdFx0XHRjb25zdCBkZWNpbWFsUGxhY2VzICAgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtcGxhY2VzJyApO1xuXHRcdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkaXRlbS5hdHRyKCAnZGF0YS10aG91c2FuZC1zZXBhcmF0b3InICk7XG5cdFx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXHRcdFx0Y29uc3QgbWluVmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1taW4tdmFsdWUnICkgKTtcblx0XHRcdGNvbnN0IG1heFZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRjb25zdCAkbWluVmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWluLXZhbHVlJyApO1xuXHRcdFx0Y29uc3QgJG1heFZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1heC12YWx1ZScgKTtcblxuXHRcdFx0Y29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIHNsaWRlcklkICk7XG5cblx0XHRcdG5vVWlTbGlkZXIuY3JlYXRlKCBzbGlkZXIsIHtcblx0XHRcdFx0c3RhcnQ6IFsgbWluVmFsdWUsIG1heFZhbHVlIF0sXG5cdFx0XHRcdHN0ZXAsXG5cdFx0XHRcdGNvbm5lY3Q6IHRydWUsXG5cdFx0XHRcdGNzc1ByZWZpeDogJ3djYXBmLW5vdWktJyxcblx0XHRcdFx0cmFuZ2U6IHtcblx0XHRcdFx0XHQnbWluJzogcmFuZ2VNaW5WYWx1ZSxcblx0XHRcdFx0XHQnbWF4JzogcmFuZ2VNYXhWYWx1ZSxcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXG5cdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ3VwZGF0ZScsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdGxldCBtaW5WYWx1ZTtcblx0XHRcdFx0bGV0IG1heFZhbHVlO1xuXG5cdFx0XHRcdGlmICggZm9ybWF0TnVtYmVycyApIHtcblx0XHRcdFx0XHRtaW5WYWx1ZSA9IG51bWJlcl9mb3JtYXQoIHZhbHVlc1sgMCBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdG1heFZhbHVlID0gbnVtYmVyX2Zvcm1hdCggdmFsdWVzWyAxIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWluVmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDAgXSApO1xuXHRcdFx0XHRcdG1heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggJ3BsYWluX3RleHQnID09PSBkaXNwbGF5VmFsdWVzQXMgKSB7XG5cdFx0XHRcdFx0JG1pblZhbHVlLmh0bWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0JG1heFZhbHVlLmh0bWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JG1pblZhbHVlLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHQkbWF4VmFsdWUudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmLW5vdWlzbGlkZXItdXBkYXRlJywgWyAkaXRlbSwgdmFsdWVzIF0gKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0ZnVuY3Rpb24gZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICkge1xuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5mb3JfcHJldmlldyApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblxuXHRcdFx0XHRpZiAoIG1pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIG1heFZhbHVlID09PSByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdC8vIFJlbW92ZSByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0cmVxdWVzdEZpbHRlciggJGl0ZW0uZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBBZGQgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdGNvbnN0IHVybCA9ICRpdGVtLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIG1pblZhbHVlICkucmVwbGFjZSggJyUycycsIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0cmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICdjaGFuZ2UnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHQkaXRlbS5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKTtcblx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQkbWluVmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGlucHV0LmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdCRpbnB1dC5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0Y29uc3QgbWluVmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5zZXQoIFsgbWluVmFsdWUsIG51bGwgXSApO1xuXG5cdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQkbWF4VmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGlucHV0LmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdCRpbnB1dC5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5zZXQoIFsgbnVsbCwgbWF4VmFsdWUgXSApO1xuXG5cdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGluaXROb1VJU2xpZGVyKCk7XG5cblx0ZnVuY3Rpb24gZmlsdGVyQnlEYXRlKCAkaW5wdXQgKSB7XG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZm9yX3ByZXZpZXcgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJHdjYXBmRGF0ZUZpbHRlciA9ICRpbnB1dC5jbG9zZXN0KCAnLndjYXBmLWRhdGUtaW5wdXQnICk7XG5cdFx0Y29uc3QgZmlsdGVyS2V5ICAgICAgICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRjb25zdCBpc1JhbmdlICAgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1pcy1yYW5nZScgKTtcblxuXHRcdGxldCBmaWx0ZXJWYWx1ZSA9ICcnO1xuXHRcdGxldCBydW5GaWx0ZXIgICA9IGZhbHNlO1xuXG5cdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0Y2xlYXJUaW1lb3V0KCAkd2NhcGZEYXRlRmlsdGVyLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0aWYgKCBpc1JhbmdlICkge1xuXHRcdFx0Y29uc3QgZnJvbSA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICkudmFsKCk7XG5cdFx0XHRjb25zdCB0byAgID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtdG8taW5wdXQnICkudmFsKCk7XG5cblx0XHRcdGlmICggZnJvbSAmJiB0byApIHtcblx0XHRcdFx0ZmlsdGVyVmFsdWUgPSBmcm9tICsgcmFuZ2VWYWx1ZXNTZXBhcmF0b3IgKyB0bztcblx0XHRcdFx0cnVuRmlsdGVyICAgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmICggISBmcm9tICYmICEgdG8gKSB7XG5cdFx0XHRcdHJ1bkZpbHRlciA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoIGZyb20gKSB7XG5cdFx0XHRcdGZpbHRlclZhbHVlID0gZnJvbTtcblx0XHRcdFx0cnVuRmlsdGVyICAgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cnVuRmlsdGVyID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIHJ1bkZpbHRlciApIHtcblx0XHRcdCR3Y2FwZkRhdGVGaWx0ZXIuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCR3Y2FwZkRhdGVGaWx0ZXIucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdGlmICggZmlsdGVyVmFsdWUgKSB7XG5cdFx0XHRcdFx0dXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zdCBxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZmlsdGVyUHJvZHVjdHMoKTtcblx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBpbml0RGF0ZXBpY2tlcigpIHtcblx0XHRpZiAoICEgalF1ZXJ5KCkuZGF0ZXBpY2tlciApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgJHJvb3Q7XG5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5mb3JfcHJldmlldyApIHtcblx0XHRcdCRyb290ID0gJCggd2NhcGZEYXRlRmlsdGVyU2VsZWN0b3IgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHJvb3QgPSAkd2NhcGZEYXRlRmlsdGVycztcblx0XHR9XG5cblx0XHRjb25zdCAkd2NhcGZEYXRlRmlsdGVyID0gJHJvb3QuZmluZCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXG5cdFx0Y29uc3QgZm9ybWF0ICAgICAgICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1mb3JtYXQnICk7XG5cdFx0Y29uc3QgeWVhckRyb3Bkb3duICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1waWNrZXIteWVhci1kcm9wZG93bicgKTtcblx0XHRjb25zdCBtb250aERyb3Bkb3duID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLXBpY2tlci1tb250aC1kcm9wZG93bicgKTtcblxuXHRcdGNvbnN0ICRmcm9tID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKTtcblx0XHRjb25zdCAkdG8gICA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLXRvLWlucHV0JyApO1xuXG5cdFx0JGZyb20uZGF0ZXBpY2tlcigge1xuXHRcdFx0ZGF0ZUZvcm1hdDogZm9ybWF0LFxuXHRcdFx0Y2hhbmdlWWVhcjogeWVhckRyb3Bkb3duLFxuXHRcdFx0Y2hhbmdlTW9udGg6IG1vbnRoRHJvcGRvd24sXG5cdFx0fSApO1xuXG5cdFx0JHRvLmRhdGVwaWNrZXIoIHtcblx0XHRcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdGNoYW5nZU1vbnRoOiBtb250aERyb3Bkb3duLFxuXHRcdH0gKTtcblxuXHRcdCRmcm9tLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRmaWx0ZXJCeURhdGUoICRpbnB1dCApO1xuXHRcdH0gKTtcblxuXHRcdCR0by5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0ZmlsdGVyQnlEYXRlKCAkaW5wdXQgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRpbml0RGF0ZXBpY2tlcigpO1xuXG5cdGZ1bmN0aW9uIGluaXREZWZhdWx0T3JkZXJCeSgpIHtcblx0XHQvLyBBdHRhY2ggY2hvc2VuLlxuXHRcdGlmICggd2NhcGZfcGFyYW1zLmF0dGFjaF9jaG9zZW5fb25fc29ydGluZyApIHtcblx0XHRcdGlmICggalF1ZXJ5KCkuY2hvc2VuICkge1xuXHRcdFx0XHQkYm9keS5maW5kKCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nIHNlbGVjdC5vcmRlcmJ5JyApLmNob3Nlbigge1xuXHRcdFx0XHRcdCdkaXNhYmxlX3NlYXJjaF90aHJlc2hvbGQnOiAxNSxcblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICggISB3Y2FwZl9wYXJhbXMuc29ydGluZ19jb250cm9sICkge1xuXHRcdFx0JGJvZHkuZmluZCggJy53b29jb21tZXJjZS1vcmRlcmluZycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJG9yZGVyaW5nRm9ybSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHQkb3JkZXJpbmdGb3JtLm9uKCAnY2hhbmdlJywgJ3NlbGVjdC5vcmRlcmJ5JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JG9yZGVyaW5nRm9ybS5zdWJtaXQoKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gdG9kbzogY2hlY2sgaWYgYWpheCBkaXNhYmxlZC5cblx0XHQkYm9keS5maW5kKCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJG9yZGVyaW5nRm9ybSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0JG9yZGVyaW5nRm9ybS5vbiggJ3N1Ym1pdCcsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdCRvcmRlcmluZ0Zvcm0ub24oICdjaGFuZ2UnLCAnc2VsZWN0Lm9yZGVyYnknLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0IG9yZGVyICAgICAgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlcl9rZXkgPSAnb3JkZXJieSc7XG5cblx0XHRcdFx0dXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcl9rZXksIG9yZGVyICk7XG5cdFx0XHRcdGZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdERlZmF1bHRPcmRlckJ5KCk7XG5cblx0ZnVuY3Rpb24gdXBkYXRlUHJvZHVjdHNDb3VudFJlc3VsdCggJHJlc3VsdHMgKSB7XG5cdFx0Y29uc3Qgc2VsZWN0b3IgPSAnLndvb2NvbW1lcmNlLXJlc3VsdC1jb3VudCc7XG5cblx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuZmluZCggc2VsZWN0b3IgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgbmV3UHJvZHVjdENvdW50ID0gJHJlc3VsdHMuZmluZCggc2VsZWN0b3IgKS5odG1sKCk7XG5cblx0XHQkYm9keS5maW5kKCBzZWxlY3RvciApLmh0bWwoIG5ld1Byb2R1Y3RDb3VudCApO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2hvd0xvYWRpbmdBbmltYXRpb24oKSB7XG5cdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5sb2FkaW5nX2FuaW1hdGlvbiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkLkxvYWRpbmdPdmVybGF5KCAnc2hvdycsIHdjYXBmX3BhcmFtcy5sb2FkaW5nX292ZXJsYXlfb3B0aW9ucyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzYWJsZU5vVWlTbGlkZXJzKCkge1xuXHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCR3Y2FwZk51bWJlclJhbmdlRmlsdGVycy5maW5kKCAnLndjYXBmLW5vdWktc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCBlLCBlbGVtZW50ICkge1xuXHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoICdkaXNhYmxlZCcsIHRydWUgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNhYmxlTGFiZWxzKCkge1xuXHRcdGNvbnN0IHNlbGVjdG9ycyA9ICcud2NhcGYtbGFiZWxlZC1uYXYgLml0ZW0sIC53Y2FwZi1hY3RpdmUtZmlsdGVycyAuaXRlbSc7XG5cblx0XHQvLyBUT0RPOiBBZGQgZGlzYWJsZWQgYXR0cmlidXRlLlxuXHRcdCR3Y2FwZlNpbmdsZUZpbHRlcnMuZmluZCggc2VsZWN0b3JzICkuYWRkQ2xhc3MoICdkaXNhYmxlZCcgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGRpc2FibGVJbnB1dHMoKSB7XG5cdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5kaXNhYmxlX2lucHV0c193aGlsZV9mZXRjaGluZ19yZXN1bHRzICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGlucHV0cyA9ICdpbnB1dCwgc2VsZWN0JztcblxuXHRcdCR3Y2FwZlNpbmdsZUZpbHRlcnMuZmluZCggaW5wdXRzICkuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdCR3Y2FwZlNpbmdsZUZpbHRlcnMuZmluZCggaW5wdXRzICkudHJpZ2dlciggJ2Nob3Nlbjp1cGRhdGVkJyApO1xuXG5cdFx0ZGlzYWJsZU5vVWlTbGlkZXJzKCk7XG5cdFx0ZGlzYWJsZUxhYmVscygpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZW5hYmxlTm9VaVNsaWRlcnMoKSB7XG5cdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG5vVWlTbGlkZXIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzLmZpbmQoICcud2NhcGYtbm91aS1zbGlkZXInICkuZWFjaCggZnVuY3Rpb24oIGUsIGVsZW1lbnQgKSB7XG5cdFx0XHRlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSggJ2Rpc2FibGVkJyApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGVuYWJsZUlucHV0cygpIHtcblx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLmRpc2FibGVfaW5wdXRzX3doaWxlX2ZldGNoaW5nX3Jlc3VsdHMgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgaW5wdXRzID0gJ2lucHV0JztcblxuXHRcdCR3Y2FwZk51bWJlclJhbmdlRmlsdGVycy5maW5kKCBpbnB1dHMgKS5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0JHdjYXBmRGF0ZUZpbHRlcnMuZmluZCggaW5wdXRzICkucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXG5cdFx0ZW5hYmxlTm9VaVNsaWRlcnMoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHJlc2V0TG9hZGluZ0FuaW1hdGlvbigpIHtcblx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLmxvYWRpbmdfYW5pbWF0aW9uICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCQuTG9hZGluZ092ZXJsYXkoICdoaWRlJyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2Nyb2xsVG8oKSB7XG5cdFx0aWYgKCAnbm9uZScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93ICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IHNjcm9sbEZvciA9IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X2Zvcjtcblx0XHRjb25zdCBpc01vYmlsZSAgPSB3Y2FwZl9wYXJhbXMuaXNfbW9iaWxlO1xuXHRcdGxldCBwcm9jZWVkICAgICA9IGZhbHNlO1xuXG5cdFx0aWYgKCAnbW9iaWxlJyA9PT0gc2Nyb2xsRm9yICYmIGlzTW9iaWxlICkge1xuXHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0fSBlbHNlIGlmICggJ2Rlc2t0b3AnID09PSBzY3JvbGxGb3IgJiYgISBpc01vYmlsZSApIHtcblx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdH0gZWxzZSBpZiAoICdib3RoJyA9PT0gc2Nyb2xsRm9yICkge1xuXHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKCAhIHByb2NlZWQgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0IGFkanVzdGluZ09mZnNldCwgb2Zmc2V0O1xuXG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKSB7XG5cdFx0XHRhZGp1c3RpbmdPZmZzZXQgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfb2Zmc2V0ICk7XG5cdFx0fVxuXG5cdFx0bGV0IGNvbnRhaW5lcjtcblxuXHRcdGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lcjtcblx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdGNvbnRhaW5lciA9IHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyO1xuXHRcdH1cblxuXHRcdGlmICggJ2N1c3RvbScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93ICkge1xuXHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfY3VzdG9tX2VsZW1lbnQ7XG5cdFx0fVxuXG5cdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIGNvbnRhaW5lciApO1xuXG5cdFx0aWYgKCAkY29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdG9mZnNldCA9ICRjb250YWluZXIub2Zmc2V0KCkudG9wIC0gYWRqdXN0aW5nT2Zmc2V0O1xuXG5cdFx0XHRpZiAoIG9mZnNldCA8IDAgKSB7XG5cdFx0XHRcdG9mZnNldCA9IDA7XG5cdFx0XHR9XG5cblx0XHRcdCQoICdodG1sLCBib2R5JyApLnN0b3AoKS5hbmltYXRlKFxuXHRcdFx0XHR7IHNjcm9sbFRvcDogb2Zmc2V0IH0sXG5cdFx0XHRcdHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX3NwZWVkLFxuXHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9lYXNpbmdcblx0XHRcdCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gVGhpbmdzIGFyZSBkb25lIGJlZm9yZSBmZXRjaGluZyB0aGUgcHJvZHVjdHMgbGlrZSBzaG93aW5nIGEgbG9hZGluZyBpbmRpY2F0b3IuXG5cdGZ1bmN0aW9uIGJlZm9yZUZldGNoaW5nUHJvZHVjdHMoKSB7XG5cdFx0ZGlzYWJsZUlucHV0cygpO1xuXHRcdHNob3dMb2FkaW5nQW5pbWF0aW9uKCk7XG5cblx0XHRpZiAoICdpbW1lZGlhdGVseScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X3doZW4gKSB7XG5cdFx0XHRzY3JvbGxUbygpO1xuXHRcdH1cblxuXHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfZmV0Y2hpbmdfcHJvZHVjdHMnICk7XG5cdH1cblxuXHRmdW5jdGlvbiBiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzKCAkcmVzdWx0cyApIHtcblx0XHRyZXNldExvYWRpbmdBbmltYXRpb24oKTtcblxuXHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfdXBkYXRpbmdfcHJvZHVjdHMnLCBbICRyZXN1bHRzIF0gKTtcblx0fVxuXG5cdC8vIFRoaW5ncyBhcmUgZG9uZSBhZnRlciBhcHBseWluZyB0aGUgZmlsdGVyIGxpa2Ugc2Nyb2xsIHRvIHRvcC5cblx0ZnVuY3Rpb24gYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzKCAkcmVzdWx0cyApIHtcblx0XHRpbml0Q2hvc2VuKCk7XG5cdFx0aW5pdEhpZXJhcmNoeUFjY29yZGlvbigpO1xuXHRcdGluaXROb1VJU2xpZGVyKCk7XG5cdFx0aW5pdERhdGVwaWNrZXIoKTtcblx0XHRpbml0RGVmYXVsdE9yZGVyQnkoKTtcblx0XHR1cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0KCAkcmVzdWx0cyApO1xuXHRcdGVuYWJsZUlucHV0cygpO1xuXG5cdFx0aWYgKCAnYWZ0ZXInID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd193aGVuICkge1xuXHRcdFx0c2Nyb2xsVG8oKTtcblx0XHR9XG5cblx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGZfYWZ0ZXJfdXBkYXRpbmdfcHJvZHVjdHMnLCBbICRyZXN1bHRzIF0gKTtcblx0fVxuXG5cdC8vIFRoZSBtYWluIGZpbHRlciBmdW5jdGlvbi5cblx0ZnVuY3Rpb24gZmlsdGVyUHJvZHVjdHMoIGZvcmNlUmVSZW5kZXIgPSBmYWxzZSApIHtcblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5mb3JfcHJldmlldyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRiZWZvcmVGZXRjaGluZ1Byb2R1Y3RzKCk7XG5cblx0XHQkLmdldCggd2luZG93LmxvY2F0aW9uLmhyZWYsIGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdFx0Y29uc3QgJGRhdGEgPSAkKCBkYXRhICk7XG5cblx0XHRcdC8vIFJlcGxhY2UgdGhlIGZpZWxkcycgZGF0YSB3aXRoIG5ldyBkYXRhLlxuXHRcdFx0JC5lYWNoKCBmaWVsZHMsIGZ1bmN0aW9uKCBpZCApIHtcblx0XHRcdFx0Y29uc3QgZmllbGRJRCAgICA9ICdbZGF0YS1pZD1cIicgKyBpZCArICdcIl0nO1xuXHRcdFx0XHRjb25zdCAkZmllbGQgICAgID0gJCggZmllbGRJRCApO1xuXHRcdFx0XHRjb25zdCAkaW5uZXIgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZmllbGQtaW5uZXInICk7XG5cdFx0XHRcdGNvbnN0IF9maWVsZCAgICAgPSAkZGF0YS5maW5kKCBmaWVsZElEICk7XG5cdFx0XHRcdGxldCBmaWVsZENsYXNzZXMgPSAkKCBfZmllbGQgKS5hdHRyKCAnY2xhc3MnICk7XG5cblx0XHRcdFx0Ly8gUHJlc2VydmUgaGllcmFyY2h5IGFjY29yZGlvbiBzdGF0ZS5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSApIHtcblx0XHRcdFx0XHRpZiAoICRmaWVsZC5oYXNDbGFzcyggJ2hpZXJhcmNoeS1hY2NvcmRpb24nICkgKSB7XG5cdFx0XHRcdFx0XHQkZmllbGQuZmluZCggJy5oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZS5hY3RpdmUnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGl0ZW1WYWx1ZSAgICAgID0gJCggdGhpcyApLnBhcmVudCgpLmNoaWxkcmVuKCAnaW5wdXQnICkudmFsKCk7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHRvZ2dsZVNlbGVjdG9yID0gJ2lucHV0W3ZhbHVlPVwiJyArIGl0ZW1WYWx1ZSArICdcIl0gfiAuaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnO1xuXHRcdFx0XHRcdFx0XHRjb25zdCB1bFNlbGVjdG9yICAgICA9ICdpbnB1dFt2YWx1ZT1cIicgKyBpdGVtVmFsdWUgKyAnXCJdIH4gdWwnO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBfY2xhc3NlcyAgICAgICA9ICdoaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZSBhY3RpdmUnO1xuXG5cdFx0XHRcdFx0XHRcdF9maWVsZC5maW5kKCB0b2dnbGVTZWxlY3RvciApLmF0dHIoICdjbGFzcycsIF9jbGFzc2VzICk7XG5cdFx0XHRcdFx0XHRcdF9maWVsZC5maW5kKCB1bFNlbGVjdG9yICkuc2hvdygpO1xuXHRcdFx0XHRcdFx0fSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IF9odG1sID0gX2ZpZWxkLmZpbmQoICcud2NhcGYtZmllbGQtaW5uZXInICkuaHRtbCgpO1xuXG5cdFx0XHRcdC8vIFNob3cgc29mdCBsaW1pdCBpdGVtcy5cblx0XHRcdFx0Y29uc3Qgc29mdExpbWl0U2VsZWN0b3IgPSAnc2hvdy1oaWRkZW4taXRlbXMnO1xuXG5cdFx0XHRcdGlmICggJGZpZWxkLmhhc0NsYXNzKCBzb2Z0TGltaXRTZWxlY3RvciApICkge1xuXHRcdFx0XHRcdGlmICggISBfZmllbGQuaGFzQ2xhc3MoIHNvZnRMaW1pdFNlbGVjdG9yICkgKSB7XG5cdFx0XHRcdFx0XHRmaWVsZENsYXNzZXMgKz0gJyAnICsgc29mdExpbWl0U2VsZWN0b3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGZpZWxkQ2xhc3NlcyA9IGZpZWxkQ2xhc3Nlcy5yZXBsYWNlKCBzb2Z0TGltaXRTZWxlY3RvciwgJycgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFVwZGF0ZSB0aGUgZmllbGQncyBjbGFzcy5cblx0XHRcdFx0JGZpZWxkLmF0dHIoICdjbGFzcycsIGZpZWxkQ2xhc3Nlcy50cmltKCkgKTtcblxuXHRcdFx0XHQvLyBXaGVuIGNhbGxlZCBmcm9tIGhpc3RvcnkgYmFjayBvciBmb3J3YXJkIHJlcXVlc3QgdGhlbiByZXJlbmRlciBhbGwgZmllbGRzLlxuXHRcdFx0XHRpZiAoIGZvcmNlUmVSZW5kZXIgKSB7XG5cblx0XHRcdFx0XHQvLyB1cGRhdGUgZmllbGRcblx0XHRcdFx0XHQkaW5uZXIuaHRtbCggX2h0bWwgKTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0Ly8gU2VsZWN0aXZlbHkgcmVyZW5kZXIgdGhlIGZpZWxkcy5cblx0XHRcdFx0XHRpZiAoICRmaWVsZC5oYXNDbGFzcyggJ3djYXBmLW5hdi1maWx0ZXInICkgKSB7XG5cblx0XHRcdFx0XHRcdC8vIHVwZGF0ZSBmaWVsZFxuXHRcdFx0XHRcdFx0JGlubmVyLmh0bWwoIF9odG1sICk7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdCRmaWVsZC50cmlnZ2VyKCAnd2NhcGYtZmllbGQtdXBkYXRlZCcsIFsgX2ZpZWxkIF0gKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0YmVmb3JlVXBkYXRpbmdQcm9kdWN0cyggJGRhdGEgKTtcblxuXHRcdFx0Ly8gUmVwbGFjZSBvbGQgc2hvcCBsb29wIHdpdGggbmV3IG9uZS5cblx0XHRcdGNvbnN0ICRzaG9wTG9vcENvbnRhaW5lciA9ICRkYXRhLmZpbmQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRjb25zdCAkbm90Rm91bmRDb250YWluZXIgPSAkZGF0YS5maW5kKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApO1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyID09PSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApIHtcblx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdGlmICggJHNob3BMb29wQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmh0bWwoICRub3RGb3VuZENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdGlmICggJHNob3BMb29wQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRub3RGb3VuZENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0YWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzKCAkZGF0YSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8vIFVSTCBQYXJzZXJcblx0ZnVuY3Rpb24gZ2V0VXJsVmFycyggdXJsICkge1xuXHRcdGxldCB2YXJzID0ge30sIGhhc2g7XG5cblx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0dXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0fVxuXG5cdFx0dXJsID0gdXJsLnJlcGxhY2VBbGwoICclMkMnLCAnLCcgKTtcblxuXHRcdGNvbnN0IGhhc2hlcyAgPSB1cmwuc2xpY2UoIHVybC5pbmRleE9mKCAnPycgKSArIDEgKS5zcGxpdCggJyYnICk7XG5cdFx0Y29uc3QgaExlbmd0aCA9IGhhc2hlcy5sZW5ndGg7XG5cblx0XHRmb3IgKCBsZXQgaSA9IDA7IGkgPCBoTGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRoYXNoID0gaGFzaGVzWyBpIF0uc3BsaXQoICc9JyApO1xuXG5cdFx0XHR2YXJzWyBoYXNoWyAwIF0gXSA9IGhhc2hbIDEgXTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdmFycztcblx0fVxuXG5cdC8vIGV2ZXJ5dGltZSB3ZSBhcHBseSB0aGUgZmlsdGVyIHdlIHNldCB0aGUgY3VycmVudCBwYWdlIHRvIDFcblx0ZnVuY3Rpb24gZml4UGFnaW5hdGlvbigpIHtcblx0XHRsZXQgdXJsICAgICAgICAgICAgICAgID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0Y29uc3QgcGFyYW1zICAgICAgICAgICA9IGdldFVybFZhcnMoIHVybCApO1xuXHRcdGNvbnN0IGN1cnJlbnRQYWdlSW5VcmwgPSBwYXJzZUludCggdXJsLnJlcGxhY2UoIC8uK1xcL3BhZ2VcXC8oXFxkKykrLywgJyQxJyApICk7XG5cblx0XHRpZiAoIGN1cnJlbnRQYWdlSW5VcmwgKSB7XG5cdFx0XHRpZiAoIGN1cnJlbnRQYWdlSW5VcmwgPiAxICkge1xuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSggL3BhZ2VcXC8oXFxkKykvLCAncGFnZS8xJyApO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoIHR5cGVvZiBwYXJhbXNbICdwYWdlZCcgXSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRjb25zdCBjdXJyZW50UGFnZUluUGFyYW1zID0gcGFyc2VJbnQoIHBhcmFtc1sgJ3BhZ2VkJyBdICk7XG5cblx0XHRcdGlmICggY3VycmVudFBhZ2VJblBhcmFtcyA+IDEgKSB7XG5cdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCAncGFnZWQ9JyArIGN1cnJlbnRQYWdlSW5QYXJhbXMsICdwYWdlZD0xJyApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB1cmw7XG5cdH1cblxuXHQvLyB1cGRhdGUgcXVlcnkgc3RyaW5nIGZvciBjYXRlZ29yaWVzLCBtZXRhIGV0Yy4uXG5cdGZ1bmN0aW9uIHVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBrZXksIHZhbHVlLCBwdXNoSGlzdG9yeSwgdXJsICkge1xuXHRcdGlmICggdHlwZW9mIHB1c2hIaXN0b3J5ID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHB1c2hIaXN0b3J5ID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0dXJsID0gZml4UGFnaW5hdGlvbigpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHJlICAgICAgICA9IG5ldyBSZWdFeHAoICcoWz8mXSknICsga2V5ICsgJz0uKj8oJnwkKScsICdpJyApO1xuXHRcdGNvbnN0IHNlcGFyYXRvciA9IHVybC5pbmRleE9mKCAnPycgKSAhPT0gLTEgPyAnJicgOiAnPyc7XG5cdFx0bGV0IHVybFdpdGhRdWVyeTtcblxuXHRcdGlmICggdXJsLm1hdGNoKCByZSApICkge1xuXHRcdFx0dXJsV2l0aFF1ZXJ5ID0gdXJsLnJlcGxhY2UoIHJlLCAnJDEnICsga2V5ICsgJz0nICsgdmFsdWUgKyAnJDInICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHVybFdpdGhRdWVyeSA9IHVybCArIHNlcGFyYXRvciArIGtleSArICc9JyArIHZhbHVlO1xuXHRcdH1cblxuXHRcdGlmICggcHVzaEhpc3RvcnkgPT09IHRydWUgKSB7XG5cdFx0XHRyZXR1cm4gaGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgdXJsV2l0aFF1ZXJ5ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB1cmxXaXRoUXVlcnk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gcmVtb3ZlIHBhcmFtZXRlciBmcm9tIHVybFxuXHRmdW5jdGlvbiByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCB1cmwgKSB7XG5cdFx0aWYgKCB0eXBlb2YgdXJsID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHVybCA9IGZpeFBhZ2luYXRpb24oKTtcblx0XHR9XG5cblx0XHRjb25zdCBvbGRQYXJhbXMgICAgICAgICA9IGdldFVybFZhcnMoIHVybCApO1xuXHRcdGNvbnN0IG9sZFBhcmFtc0xlbmd0aCAgID0gT2JqZWN0LmtleXMoIG9sZFBhcmFtcyApLmxlbmd0aDtcblx0XHRjb25zdCBzdGFydFBvc2l0aW9uICAgICA9IHVybC5pbmRleE9mKCAnPycgKTtcblx0XHRjb25zdCBmaWx0ZXJLZXlQb3NpdGlvbiA9IHVybC5pbmRleE9mKCBmaWx0ZXJLZXkgKTtcblx0XHRsZXQgY2xlYW5VcmwsIGNsZWFuUXVlcnk7XG5cblx0XHRpZiAoIG9sZFBhcmFtc0xlbmd0aCA+IDEgKSB7XG5cdFx0XHRpZiAoICggZmlsdGVyS2V5UG9zaXRpb24gLSBzdGFydFBvc2l0aW9uICkgPiAxICkge1xuXHRcdFx0XHRjbGVhblVybCA9IHVybC5yZXBsYWNlKCAnJicgKyBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdLCAnJyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2xlYW5VcmwgPSB1cmwucmVwbGFjZSggZmlsdGVyS2V5ICsgJz0nICsgb2xkUGFyYW1zWyBmaWx0ZXJLZXkgXSArICcmJywgJycgKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgbmV3UGFyYW1zID0gY2xlYW5Vcmwuc3BsaXQoICc/JyApO1xuXHRcdFx0Y2xlYW5RdWVyeSAgICAgID0gJz8nICsgbmV3UGFyYW1zWyAxIF07XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNsZWFuUXVlcnkgPSB1cmwucmVwbGFjZSggJz8nICsgZmlsdGVyS2V5ICsgJz0nICsgb2xkUGFyYW1zWyBmaWx0ZXJLZXkgXSwgJycgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gY2xlYW5RdWVyeTtcblx0fVxuXG5cdC8vIHRha2UgdGhlIGtleSBhbmQgdmFsdWUgYW5kIG1ha2UgcXVlcnlcblx0ZnVuY3Rpb24gbWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIGZvcmNlUmVyZW5kZXIgPSBmYWxzZSwgdXJsICkge1xuXHRcdGNvbnN0IHZhbHVlU2VwYXJhdG9yID0gJywnO1xuXG5cdFx0bGV0IHBhcmFtcywgbmV4dFZhbHVlcywgZW1wdHlWYWx1ZSA9IGZhbHNlO1xuXG5cdFx0aWYgKCB0eXBlb2YgdXJsICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHBhcmFtcyA9IGdldFVybFZhcnMoIHVybCApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwYXJhbXMgPSBnZXRVcmxWYXJzKCk7XG5cdFx0fVxuXG5cdFx0aWYgKCB0eXBlb2YgcGFyYW1zWyBmaWx0ZXJLZXkgXSAhPSAndW5kZWZpbmVkJyApIHtcblx0XHRcdGNvbnN0IHByZXZWYWx1ZXMgICAgICA9IHBhcmFtc1sgZmlsdGVyS2V5IF07XG5cdFx0XHRjb25zdCBwcmV2VmFsdWVzQXJyYXkgPSBwcmV2VmFsdWVzLnNwbGl0KCB2YWx1ZVNlcGFyYXRvciApO1xuXG5cdFx0XHRpZiAoIHByZXZWYWx1ZXMubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0Y29uc3QgZm91bmQgPSAkLmluQXJyYXkoIGZpbHRlclZhbHVlLCBwcmV2VmFsdWVzQXJyYXkgKTtcblxuXHRcdFx0XHRpZiAoIGZvdW5kID49IDAgKSB7XG5cdFx0XHRcdFx0Ly8gRWxlbWVudCB3YXMgZm91bmQsIHJlbW92ZSBpdC5cblx0XHRcdFx0XHRwcmV2VmFsdWVzQXJyYXkuc3BsaWNlKCBmb3VuZCwgMSApO1xuXG5cdFx0XHRcdFx0aWYgKCBwcmV2VmFsdWVzQXJyYXkubGVuZ3RoID09PSAwICkge1xuXHRcdFx0XHRcdFx0ZW1wdHlWYWx1ZSA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIEVsZW1lbnQgd2FzIG5vdCBmb3VuZCwgYWRkIGl0LlxuXHRcdFx0XHRcdHByZXZWYWx1ZXNBcnJheS5wdXNoKCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBwcmV2VmFsdWVzQXJyYXkubGVuZ3RoID4gMSApIHtcblx0XHRcdFx0XHRuZXh0VmFsdWVzID0gcHJldlZhbHVlc0FycmF5LmpvaW4oIHZhbHVlU2VwYXJhdG9yICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bmV4dFZhbHVlcyA9IHByZXZWYWx1ZXNBcnJheTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bmV4dFZhbHVlcyA9IGZpbHRlclZhbHVlO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRuZXh0VmFsdWVzID0gZmlsdGVyVmFsdWU7XG5cdFx0fVxuXG5cdFx0Ly8gdXBkYXRlIHVybCBhbmQgcXVlcnkgc3RyaW5nXG5cdFx0aWYgKCAhIGVtcHR5VmFsdWUgKSB7XG5cdFx0XHR1cGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBuZXh0VmFsdWVzICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHR9XG5cblx0XHRmaWx0ZXJQcm9kdWN0cyggZm9yY2VSZXJlbmRlciApO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2luZ2xlRmlsdGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICkge1xuXHRcdGNvbnN0IHBhcmFtcyA9IGdldFVybFZhcnMoKTtcblx0XHRsZXQgcXVlcnk7XG5cblx0XHRpZiAoIHR5cGVvZiBwYXJhbXNbIGZpbHRlcktleSBdICE9PSAndW5kZWZpbmVkJyAmJiBwYXJhbXNbIGZpbHRlcktleSBdID09PSBmaWx0ZXJWYWx1ZSApIHtcblx0XHRcdHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRxdWVyeSA9IHVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlLCBmYWxzZSApO1xuXHRcdH1cblxuXHRcdC8vIHVwZGF0ZSB1cmxcblx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0ZmlsdGVyUHJvZHVjdHMoKTtcblx0fVxuXG5cdC8vIEhhbmRsZSB0aGUgcGFnaW5hdGlvbiByZXF1ZXN0IHZpYSBhamF4LlxuXHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfcGFnaW5hdGlvbl92aWFfYWpheCAmJiB3Y2FwZl9wYXJhbXMucGFnaW5hdGlvbl9jb250YWluZXIgKSB7XG5cdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0Y29uc3Qgc2VsZWN0b3IgICA9IHdjYXBmX3BhcmFtcy5wYWdpbmF0aW9uX2NvbnRhaW5lciArICcgYSc7XG5cblx0XHQvLyB0b2RvOiBjaGVjayBpZiBhamF4IGRpc2FibGVkLlxuXHRcdGlmICggJGNvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHQkY29udGFpbmVyLm9uKCAnY2xpY2snLCBzZWxlY3RvciwgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCBsb2NhdGlvbiA9ICQoIHRoaXMgKS5hdHRyKCAnaHJlZicgKTtcblxuXHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBsb2NhdGlvbiApO1xuXG5cdFx0XHRcdGZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSB0aGUgY29tbW9uIGZpbHRlciByZXF1ZXN0cy5cblx0ZnVuY3Rpb24gaGFuZGxlRmlsdGVyUmVxdWVzdCggJGl0ZW0sIGZpbHRlclZhbHVlICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1zaW5nbGUtZmlsdGVyJyApO1xuXHRcdGNvbnN0IGZpZWxkSUQgICAgICAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdGNvbnN0IGZpZWxkRGF0YSAgICAgID0gZmllbGRzWyBmaWVsZElEIF07XG5cdFx0Y29uc3QgZmlsdGVyS2V5ICAgICAgPSBmaWVsZERhdGEuZmlsdGVyS2V5O1xuXHRcdGNvbnN0IG11bHRpcGxlRmlsdGVyID0gZmllbGREYXRhLm11bHRpcGxlRmlsdGVyO1xuXG5cdFx0aWYgKCAhIGZpbHRlcktleSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoICEgZmlsdGVyVmFsdWUubGVuZ3RoICkge1xuXHRcdFx0Y29uc3QgcXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0XHRmaWx0ZXJQcm9kdWN0cygpO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCBtdWx0aXBsZUZpbHRlciApIHtcblx0XHRcdG1ha2VQYXJhbWV0ZXJzKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNpbmdsZUZpbHRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHJlcXVlc3RGaWx0ZXIoIHVybCApIHtcblx0XHRpZiAoICEgdXJsICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJsO1xuXG5cdFx0Ly8gVE9ETzogRmlsdGVyIHRoZSBwcm9kdWN0cyBjb25kaXRpb25hbGx5LlxuXHRcdC8vIGZpbHRlclByb2R1Y3RzKCk7XG5cdH1cblxuXHQvLyBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciBsaXN0IGZpZWxkLlxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKFxuXHRcdCdjaGFuZ2UnLFxuXHRcdCcud2NhcGYtbGF5ZXJlZC1uYXYgW3R5cGU9XCJjaGVja2JveFwiXSwgLndjYXBmLWxheWVyZWQtbmF2IFt0eXBlPVwicmFkaW9cIl0nLFxuXHRcdGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGNvbnN0ICRpdGVtID0gJCggdGhpcyApO1xuXG5cdFx0XHRyZXF1ZXN0RmlsdGVyKCAkaXRlbS5kYXRhKCAndXJsJyApICk7XG5cdFx0fVxuXHQpO1xuXG5cdC8vIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGxhYmVsZWQgaXRlbS5cblx0JHdjYXBmTmF2RmlsdGVycy5vbiggJ2NsaWNrJywgJy53Y2FwZi1sYWJlbGVkLW5hdiAuaXRlbTpub3QoLmRpc2FibGVkKScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRyZXF1ZXN0RmlsdGVyKCAkaXRlbS5kYXRhKCAndXJsJyApICk7XG5cdH0gKTtcblxuXHQvLyBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciBkaXNwbGF5IHR5cGUgc2VsZWN0IGZpZWxkcy5cblx0JHdjYXBmTmF2RmlsdGVycy5vbiggJ2NoYW5nZScsICdzZWxlY3QnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRzZWxlY3QgICAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IHZhbHVlcyAgICAgICAgID0gJHNlbGVjdC52YWwoKTtcblx0XHRjb25zdCBmaWx0ZXJVUkwgICAgICA9ICRzZWxlY3QuZGF0YSggJ3VybCcgKTtcblx0XHRjb25zdCBjbGVhckZpbHRlclVSTCA9ICRzZWxlY3QuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICk7XG5cdFx0bGV0IHVybDtcblxuXHRcdGlmICggdmFsdWVzLmxlbmd0aCApIHtcblx0XHRcdHVybCA9IGZpbHRlclVSTC5yZXBsYWNlKCAnJXMnLCB2YWx1ZXMudG9TdHJpbmcoKSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR1cmwgPSBjbGVhckZpbHRlclVSTDtcblx0XHR9XG5cblx0XHRyZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0fSApO1xuXG5cdC8qKlxuXHQgKiBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciByYW5nZSBudW1iZXIuXG5cdCAqL1xuXHRjb25zdCByYW5nZU51bWJlclNlbGVjdG9ycyA9ICcud2NhcGYtcmFuZ2UtbnVtYmVyIC5taW4tdmFsdWUsIC53Y2FwZi1yYW5nZS1udW1iZXIgLm1heC12YWx1ZSc7XG5cblx0Ly8gVE9ETzogTWF5YmUgdXNlICdjaGFuZ2UnIGV2ZW50LlxuXHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMub24oICdpbnB1dCcsIHJhbmdlTnVtYmVyU2VsZWN0b3JzLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRpdGVtID0gJCggdGhpcyApO1xuXG5cdFx0Y29uc3QgJHJhbmdlTnVtYmVyICAgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXJhbmdlLW51bWJlcicgKTtcblx0XHRjb25zdCBmb3JtYXROdW1iZXJzICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1mb3JtYXQtbnVtYmVycycgKTtcblx0XHRjb25zdCByYW5nZU1pblZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICkgKTtcblx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRjb25zdCBkZWNpbWFsUGxhY2VzICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRjb25zdCB0aG91c2FuZFNlcGFyYXRvciA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS10aG91c2FuZC1zZXBhcmF0b3InICk7XG5cdFx0Y29uc3QgZGVjaW1hbFNlcGFyYXRvciAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZGVjaW1hbC1zZXBhcmF0b3InICk7XG5cblx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0ZnVuY3Rpb24gZ2V0VmFsdWUoIGZsb2F0VmFsdWUgKSB7XG5cdFx0XHRpZiAoIGZvcm1hdE51bWJlcnMgKSB7XG5cdFx0XHRcdHJldHVybiBudW1iZXJfZm9ybWF0KCBmbG9hdFZhbHVlLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZmxvYXRWYWx1ZTtcblx0XHR9XG5cblx0XHQkaXRlbS5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdCRpdGVtLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0bGV0IG1pblZhbHVlID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCgpICk7XG5cdFx0XHRsZXQgbWF4VmFsdWUgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCkgKTtcblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdGlmICggaXNOYU4oIG1pblZhbHVlICkgKSB7XG5cdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNaW5WYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdGlmICggaXNOYU4oIG1heFZhbHVlICkgKSB7XG5cdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgcmFuZ2VNaW5WYWx1ZS5cblx0XHRcdGlmICggbWluVmFsdWUgPCByYW5nZU1pblZhbHVlICkge1xuXHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdGlmICggbWluVmFsdWUgPiByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdGlmICggbWF4VmFsdWUgPiByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgbWluVmFsdWUuXG5cdFx0XHRpZiAoIG1pblZhbHVlID4gbWF4VmFsdWUgKSB7XG5cdFx0XHRcdG1heFZhbHVlID0gbWluVmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0Ly8gUmVtb3ZlIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0cmVxdWVzdEZpbHRlciggJHJhbmdlTnVtYmVyLmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBBZGQgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRjb25zdCB1cmwgPSAkcmFuZ2VOdW1iZXIuZGF0YSggJ3VybCcgKS5yZXBsYWNlKCAnJTFzJywgbWluVmFsdWUgKS5yZXBsYWNlKCAnJTJzJywgbWF4VmFsdWUgKTtcblx0XHRcdFx0cmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHR9XG5cdFx0fSwgZGVsYXkgKSApO1xuXHR9ICk7XG5cblx0Ly8gSGFuZGxlIHJlbW92aW5nIHRoZSBhY3RpdmUgZmlsdGVycy5cblx0JHdjYXBmTmF2RmlsdGVycy5vbiggJ2NsaWNrJywgJy53Y2FwZi1hY3RpdmUtZmlsdGVycyAuaXRlbTpub3QoLmRpc2FibGVkKScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgJGl0ZW0gICAgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgZmlsdGVyS2V5ICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdGNvbnN0IGZpbHRlclZhbHVlID0gJGl0ZW0uYXR0ciggJ2RhdGEtdmFsdWUnICk7XG5cblx0XHRtYWtlUGFyYW1ldGVycyggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSwgdHJ1ZSApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gcmVzZXRGaWx0ZXJzKCAkYnV0dG9uICkge1xuXHRcdGNvbnN0IF9maWx0ZXJLZXlzID0gJGJ1dHRvbi5hdHRyKCAnZGF0YS1rZXlzJyApO1xuXG5cdFx0aWYgKCAhIF9maWx0ZXJLZXlzICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZpbHRlcktleXMgPSBfZmlsdGVyS2V5cy5zcGxpdCggJywnICk7XG5cblx0XHRsZXQgcXVlcnkgPSAnJztcblxuXHRcdCQuZWFjaCggZmlsdGVyS2V5cywgZnVuY3Rpb24oIGksIGZpbHRlcktleSApIHtcblx0XHRcdGlmICggcXVlcnkgKSB7XG5cdFx0XHRcdHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgcXVlcnkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdC8vIEVtcHR5IHF1ZXJ5IGNhdXNlcyBpc3N1ZShkb2Vzbid0IHJlbW92ZSB0aGUgZmlsdGVyIGtleXMgZnJvbSB0aGUgdXJsKSxcblx0XHQvLyB0aGlzIGlzIHdoeSB3ZSBhcmUgc2V0dGluZyB0aGUgcGFnZSB1cmwgYXMgcXVlcnkuXG5cdFx0aWYgKCAhIHF1ZXJ5ICkge1xuXHRcdFx0Y29uc3QgcHJldlVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdFx0Y29uc3QgbmV3VXJsICA9IHByZXZVcmwuc3BsaXQoICc/JyApO1xuXG5cdFx0XHRxdWVyeSA9IG5ld1VybFsgMCBdO1xuXHRcdH1cblxuXHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRmaWx0ZXJQcm9kdWN0cyggdHJ1ZSApO1xuXHR9XG5cblx0Ly8gQ2xlYXIvUmVzZXQgYWxsIGZpbHRlcnMuXG5cdCRib2R5Lm9uKCAnd2NhcGYtcmVzZXQtZmlsdGVycycsIGZ1bmN0aW9uKCBlLCAkYnV0dG9uICkge1xuXHRcdHJlc2V0RmlsdGVycyggJGJ1dHRvbiApO1xuXHR9ICk7XG5cblx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtcmVzZXQtZmlsdGVycy1idG4nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkYnV0dG9uID0gJCggdGhpcyApO1xuXG5cdFx0cmVzZXRGaWx0ZXJzKCAkYnV0dG9uICk7XG5cdH0gKTtcblxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKCAnY2xpY2snLCAnLndjYXBmLXJlc2V0LWZpbHRlcnMtYnRuJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkYnV0dG9uID0gJCggdGhpcyApO1xuXG5cdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmLXJlc2V0LWZpbHRlcnMnLCBbICRidXR0b24gXSApO1xuXHR9ICk7XG5cblx0JHdjYXBmU2luZ2xlRmlsdGVycy5vbiggJ3djYXBmLWNsZWFyLWZpbHRlcicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBmaWVsZElEICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtaWQnICk7XG5cdFx0Y29uc3QgZmllbGREYXRhID0gZmllbGRzWyBmaWVsZElEIF07XG5cdFx0Y29uc3QgZmlsdGVyS2V5ID0gZmllbGREYXRhLmZpbHRlcktleTtcblxuXHRcdGNvbnN0IHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRmaWx0ZXJQcm9kdWN0cyggdHJ1ZSApO1xuXHR9ICk7XG5cblx0Ly8gUnVuIGFqYXggZmlsdGVyIHdoZW4gYnJvd3NlciBoaXN0b3J5IGNoYW5nZXMgKHVzZXIgZ29lcyBiYWNrIG9yIGZvcndhcmQpLlxuXHRpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoIHx8ICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdGlmICggd2NhcGZfcGFyYW1zLmFwcGx5X2ZpbHRlcnNfb25fYnJvd3Nlcl9oaXN0b3J5X2NoYW5nZSApIHtcblx0XHRcdCQoIHdpbmRvdyApLmJpbmQoICdwb3BzdGF0ZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRmaWx0ZXJQcm9kdWN0cyggdHJ1ZSApO1xuXHRcdFx0fSApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFRoZSBob29rIHRoYXQgbWFudWFsbHkgcnVuIHRoZSBhamF4IGZpbHRlcnMgKGNhbiBiZSB1c2VmdWwgZm9yIG90aGVyIHBsdWdpbnMpLlxuXHQkYm9keS5vbiggJ3djYXBmLXJ1bi1maWx0ZXItcHJvZHVjdHMnLCBmdW5jdGlvbiggZSwgZm9yY2VSZVJlbmRlciApIHtcblx0XHRmaWx0ZXJQcm9kdWN0cyggZm9yY2VSZVJlbmRlciApO1xuXHR9ICk7XG5cblx0Ly8gVGhlIGhvb2sgdGhhdCByZWluaXRpYWxpemUgdGhlIGZpbHRlciB3aWRnZXRzICh0byBzaG93IHRoZSBwcmV2aWV3IGluIHRoZSBiYWNrZW5kKS5cblx0JGJvZHkub24oICdpbml0X2ZpbHRlcl93aWRnZXRzJywgZnVuY3Rpb24oKSB7XG5cdFx0aW5pdENob3NlbigpO1xuXHRcdGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKTtcblx0XHRpbml0Tm9VSVNsaWRlcigpO1xuXHRcdGluaXREYXRlcGlja2VyKCk7XG5cdH0gKTtcblxuXHQvKipcblx0ICogTWFrZSBpdCBjb21wYXRpYmxlIHdpdGggb3RoZXIgcGx1Z2lucy5cblx0ICovXG5cdCRib2R5Lm9uKCAnd2NhcGZfYWZ0ZXJfdXBkYXRpbmdfcHJvZHVjdHMnLCBmdW5jdGlvbigpIHtcblx0XHQvLyB3b28tdmFyaWF0aW9uLXN3YXRjaGVzXG5cdFx0JCggZG9jdW1lbnQgKS50cmlnZ2VyKCAnd29vX3ZhcmlhdGlvbl9zd2F0Y2hlc19wcm9faW5pdCcgKTtcblx0fSApO1xufSApO1xuIiwiKCBmdW5jdGlvbiggJCwgd2luZG93ICkge1xuXG5cdGNvbnN0IF9kZWxheSA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuZmlsdGVyX2lucHV0X2RlbGF5ICk7XG5cdGNvbnN0IGRlbGF5ICA9IF9kZWxheSA+PSAwID8gX2RlbGF5IDogODAwO1xuXG5cdGNvbnN0ICRib2R5ID0gJCggJ2JvZHknICk7XG5cblx0Y29uc3QgaW5zdGFuY2VJZHMgPSBbXTtcblxuXHQkKCAnLndjYXBmLWZpbHRlcicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCBpZCA9ICQoIHRoaXMgKS5kYXRhKCAnaWQnICk7XG5cblx0XHRpZiAoICEgaWQgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aW5zdGFuY2VJZHMucHVzaCggaWQgKTtcblx0fSApO1xuXG5cdGxldCBmb2N1c2VkRWxtO1xuXG5cdHdpbmRvdy50aXBweUluc3RhbmNlcyA9IFtdO1xuXG5cdHdpbmRvdy5XQ0FQRiA9IHdpbmRvdy5XQ0FQRiB8fCB7fTtcblxuXHR3aW5kb3cuV0NBUEYgPSB7XG5cdFx0aGFuZGxlRmlsdGVyQWNjb3JkaW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHRvZ2dsZUFjY29yZGlvbiA9ICggJGVsICkgPT4ge1xuXHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGFjY29yZGlvbiBpcyBvcGVuZWRcblx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1leHBhbmRlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdC8vIENoYW5nZSBhcmlhLWV4cGFuZGVkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuXHRcdFx0XHQkZWwuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAhIHByZXNzZWQgKTtcblxuXHRcdFx0XHRjb25zdCAkZmlsdGVySW5uZXIgPSAkZWwuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXInICkuY2hpbGRyZW4oICcud2NhcGYtZmlsdGVyLWlubmVyJyApO1xuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9hbmltYXRpb25fZm9yX2ZpbHRlcl9hY2NvcmRpb24gKSB7XG5cdFx0XHRcdFx0JGZpbHRlcklubmVyLnNsaWRlVG9nZ2xlKFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkLFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZ1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JGZpbHRlcklubmVyLnRvZ2dsZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHQkYm9keS5vbiggJ2NsaWNrJywgJy53Y2FwZi1maWx0ZXItYWNjb3JkaW9uLXRyaWdnZXInLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQkYm9keS5vbiggJ2NsaWNrJywgJy53Y2FwZi1maWx0ZXItdGl0bGUuaGFzLWFjY29yZGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkdHJpZ2dlciA9ICQoIHRoaXMgKS5maW5kKCAnLndjYXBmLWZpbHRlci1hY2NvcmRpb24tdHJpZ2dlcicgKTtcblxuXHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICR0cmlnZ2VyICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVIaWVyYXJjaHlUb2dnbGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgdG9nZ2xlQWNjb3JkaW9uID0gKCAkZWwgKSA9PiB7XG5cdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYnV0dG9uIGlzIHByZXNzZWRcblx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0Ly8gQ2hhbmdlIGFyaWEtcHJlc3NlZCB0byB0aGUgb3Bwb3NpdGUgc3RhdGVcblx0XHRcdFx0JGVsLmF0dHIoICdhcmlhLXByZXNzZWQnLCAhIHByZXNzZWQgKTtcblxuXHRcdFx0XHRjb25zdCAkY2hpbGQgPSAkZWwuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICk7XG5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbiApIHtcblx0XHRcdFx0XHQkY2hpbGQuc2xpZGVUb2dnbGUoXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQsXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkY2hpbGQudG9nZ2xlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdCRib2R5XG5cdFx0XHRcdC5vbiggJ2NsaWNrJywgJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0XHRcdH0gKVxuXHRcdFx0XHQub24oICdrZXlkb3duJywgJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdGlmICggZS5rZXkgPT09ICcgJyB8fCBlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJ1NwYWNlYmFyJyApIHtcblx0XHRcdFx0XHRcdC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgYWN0aW9uIHRvIHN0b3Agc2Nyb2xsaW5nIHdoZW4gc3BhY2UgaXMgcHJlc3NlZFxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlU29mdExpbWl0OiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHRvZ2dsZUZpbHRlck9wdGlvbnMgPSAoICRlbCApID0+IHtcblx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBidXR0b24gaXMgcHJlc3NlZFxuXHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLXByZXNzZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHQvLyBDaGFuZ2UgYXJpYS1wcmVzc2VkIHRvIHRoZSBvcHBvc2l0ZSBzdGF0ZVxuXHRcdFx0XHQkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICEgcHJlc3NlZCApO1xuXG5cdFx0XHRcdGNvbnN0ICRsaXN0V3JhcHBlciA9ICRlbC5jbG9zZXN0KCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKTtcblxuXHRcdFx0XHRpZiAoIHByZXNzZWQgKSB7XG5cdFx0XHRcdFx0JGxpc3RXcmFwcGVyLnJlbW92ZUNsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkbGlzdFdyYXBwZXIuYWRkQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHQkYm9keVxuXHRcdFx0XHQub24oICdjbGljaycsICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dG9nZ2xlRmlsdGVyT3B0aW9ucyggJCggdGhpcyApICk7XG5cdFx0XHRcdH0gKVxuXHRcdFx0XHQub24oICdrZXlkb3duJywgJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRpZiAoIGUua2V5ID09PSAnICcgfHwgZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICdTcGFjZWJhcicgKSB7XG5cdFx0XHRcdFx0XHQvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvbiB0byBzdG9wIHNjcm9sbGluZyB3aGVuIHNwYWNlIGlzIHByZXNzZWRcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdFx0dG9nZ2xlRmlsdGVyT3B0aW9ucyggJCggdGhpcyApICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVTZWFyY2hGaWx0ZXJPcHRpb25zOiBmdW5jdGlvbigpIHtcblx0XHRcdCRib2R5Lm9uKCAnaW5wdXQnLCAnLndjYXBmLXNlYXJjaC1ib3ggaW5wdXRbdHlwZT1cInRleHRcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRoYXQgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgJGlubmVyICA9ICR0aGF0LmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyLWlubmVyJyApO1xuXHRcdFx0XHRjb25zdCAkZmlsdGVyID0gJGlubmVyLmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyJyApO1xuXG5cdFx0XHRcdGNvbnN0IHNvZnRMaW1pdEVuYWJsZWQgPSAkZmlsdGVyLmhhc0NsYXNzKCAnaGFzLXNvZnQtbGltaXQnICk7XG5cdFx0XHRcdGNvbnN0IHNvZnRMaW1pdFRvZ2dsZSAgPSAkZmlsdGVyLmZpbmQoICcud2NhcGYtc29mdC1saW1pdC13cmFwcGVyJyApO1xuXHRcdFx0XHRjb25zdCB2aXNpYmxlT3B0aW9ucyAgID0gcGFyc2VJbnQoICRmaWx0ZXIuYXR0ciggJ2RhdGEtdmlzaWJsZS1vcHRpb25zJyApICk7XG5cblx0XHRcdFx0Y29uc3Qga2V5d29yZCA9ICR0aGF0LnZhbCgpO1xuXG5cdFx0XHRcdGlmICggISBrZXl3b3JkLmxlbmd0aCApIHtcblx0XHRcdFx0XHRsZXQgaW5kZXggPSAwO1xuXHRcdFx0XHRcdCRmaWx0ZXIucmVtb3ZlQ2xhc3MoICdzZWFyY2gtYWN0aXZlJyApO1xuXG5cdFx0XHRcdFx0JC5lYWNoKCAkaW5uZXIuZmluZCggJy53Y2FwZi1maWx0ZXItb3B0aW9ucyA+IGxpJyApLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGluZGV4Kys7XG5cblx0XHRcdFx0XHRcdGNvbnN0ICRmaWx0ZXJJdGVtID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICdrZXl3b3JkLW1hdGNoZWQnICk7XG5cblx0XHRcdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCBpbmRleCA+IHZpc2libGVPcHRpb25zICkge1xuXHRcdFx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLmFkZENsYXNzKCAnd2NhcGYtZmlsdGVyLW9wdGlvbi1oaWRkZW4nICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRcdHNvZnRMaW1pdFRvZ2dsZS5yZW1vdmVBdHRyKCAnc3R5bGUnICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IGluZGV4ID0gMDtcblx0XHRcdFx0JGZpbHRlci5hZGRDbGFzcyggJ3NlYXJjaC1hY3RpdmUnICk7XG5cblx0XHRcdFx0JC5lYWNoKCAkaW5uZXIuZmluZCggJy53Y2FwZi1maWx0ZXItb3B0aW9ucyA+IGxpJyApLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCAkZmlsdGVySXRlbSA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRjb25zdCBsYWJlbCAgICAgICA9ICRmaWx0ZXJJdGVtLmZpbmQoICcud2NhcGYtZmlsdGVyLWl0ZW0tbGFiZWwnICkuZGF0YSggJ2xhYmVsJyApO1xuXG5cdFx0XHRcdFx0aWYgKCBsYWJlbC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCBrZXl3b3JkLnRvTG93ZXJDYXNlKCkgKSApIHtcblx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLmFkZENsYXNzKCAna2V5d29yZC1tYXRjaGVkJyApO1xuXG5cdFx0XHRcdFx0XHRpZiAoIHNvZnRMaW1pdEVuYWJsZWQgKSB7XG5cdFx0XHRcdFx0XHRcdGluZGV4Kys7XG5cblx0XHRcdFx0XHRcdFx0aWYgKCBpbmRleCA+IHZpc2libGVPcHRpb25zICkge1xuXHRcdFx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLmFkZENsYXNzKCAnd2NhcGYtZmlsdGVyLW9wdGlvbi1oaWRkZW4nICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0ucmVtb3ZlQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5yZW1vdmVDbGFzcyggJ2tleXdvcmQtbWF0Y2hlZCcgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRpZiAoIHNvZnRMaW1pdEVuYWJsZWQgKSB7XG5cdFx0XHRcdFx0aWYgKCBpbmRleCA8PSB2aXNpYmxlT3B0aW9ucyApIHtcblx0XHRcdFx0XHRcdHNvZnRMaW1pdFRvZ2dsZS5oaWRlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHR1cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0OiBmdW5jdGlvbiggJHJlc3BvbnNlICkge1xuXHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRjb25zdCBzZWxlY3RvciAgID0gJy53b29jb21tZXJjZS1yZXN1bHQtY291bnQnO1xuXHRcdFx0Y29uc3QgbmV3Q291bnQgICA9ICRyZXNwb25zZS5maW5kKCBzZWxlY3RvciApLmh0bWwoKTtcblxuXHRcdFx0JGJvZHkuZmluZCggc2VsZWN0b3IgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGVsID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdGlmICggISAkY29udGFpbmVyLmhhcyggJGVsICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdCRlbC5odG1sKCBuZXdDb3VudCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRzaG93TG9hZGluZ0FuaW1hdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLmxvYWRpbmdfYW5pbWF0aW9uICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCQuTG9hZGluZ092ZXJsYXkoICdzaG93Jywgd2NhcGZfcGFyYW1zLmxvYWRpbmdfb3ZlcmxheV9vcHRpb25zICk7XG5cdFx0fSxcblx0XHRyZXNldExvYWRpbmdBbmltYXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5sb2FkaW5nX2FuaW1hdGlvbiApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQkLkxvYWRpbmdPdmVybGF5KCAnaGlkZScgKTtcblx0XHR9LFxuXHRcdHNjcm9sbFRvOiBmdW5jdGlvbiggdHJpZ2dlcmVkQnkgKSB7XG5cdFx0XHRpZiAoICdub25lJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgYWxsb3dlZCAgICA9IFtdO1xuXHRcdFx0Y29uc3Qgc2Nyb2xsV2hlbiA9IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X3doZW47XG5cblx0XHRcdGlmICggJ2FsbCcgPT09IHNjcm9sbFdoZW4gKSB7XG5cdFx0XHRcdGFsbG93ZWQucHVzaCggJ2ZpbHRlcicgKTtcblx0XHRcdFx0YWxsb3dlZC5wdXNoKCAncGFnaW5hdGUnICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhbGxvd2VkLnB1c2goIHNjcm9sbFdoZW4gKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhIGFsbG93ZWQuaW5jbHVkZXMoIHRyaWdnZXJlZEJ5ICkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc2Nyb2xsRm9yID0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfZm9yO1xuXHRcdFx0Y29uc3QgaXNNb2JpbGUgID0gd2NhcGZfcGFyYW1zLmlzX21vYmlsZTtcblx0XHRcdGxldCBwcm9jZWVkICAgICA9IGZhbHNlO1xuXG5cdFx0XHRpZiAoICdtb2JpbGUnID09PSBzY3JvbGxGb3IgJiYgaXNNb2JpbGUgKSB7XG5cdFx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmICggJ2Rlc2t0b3AnID09PSBzY3JvbGxGb3IgJiYgISBpc01vYmlsZSApIHtcblx0XHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0XHR9IGVsc2UgaWYgKCAnYm90aCcgPT09IHNjcm9sbEZvciApIHtcblx0XHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISBwcm9jZWVkICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCBhZGp1c3RpbmdPZmZzZXQsIG9mZnNldDtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKSB7XG5cdFx0XHRcdGFkanVzdGluZ09mZnNldCA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGNvbnRhaW5lcjtcblxuXHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXI7XG5cdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXI7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggJ2N1c3RvbScgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93ICkge1xuXHRcdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudDtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIGNvbnRhaW5lciApO1xuXG5cdFx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRvZmZzZXQgPSAkY29udGFpbmVyLm9mZnNldCgpLnRvcCAtIGFkanVzdGluZ09mZnNldDtcblxuXHRcdFx0XHRpZiAoIG9mZnNldCA8IDAgKSB7XG5cdFx0XHRcdFx0b2Zmc2V0ID0gMDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmRpc2FibGVfc2Nyb2xsX2FuaW1hdGlvbiApIHtcblx0XHRcdFx0XHR3aW5kb3cuc2Nyb2xsVG8oIHsgdG9wOiBvZmZzZXQgfSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCQoICdodG1sLCBib2R5JyApLnN0b3AoKS5hbmltYXRlKFxuXHRcdFx0XHRcdFx0eyBzY3JvbGxUb3A6IG9mZnNldCB9LFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfc3BlZWQsXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9lYXNpbmdcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvLyBUaGluZ3MgYXJlIGRvbmUgYmVmb3JlIGZldGNoaW5nIHRoZSBwcm9kdWN0cyBsaWtlIHNob3dpbmcgdGhlIGxvYWRpbmcgaW5kaWNhdG9yLlxuXHRcdGJlZm9yZUZldGNoaW5nUHJvZHVjdHM6IGZ1bmN0aW9uKCB0cmlnZ2VyZWRCeSApIHtcblx0XHRcdC8vIFRyYWNrIHRoZSBjdXJyZW50IGVsZW1lbnQgZm9jdXMuXG5cdFx0XHRmb2N1c2VkRWxtID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcblxuXHRcdFx0V0NBUEYuc2hvd0xvYWRpbmdBbmltYXRpb24oKTtcblxuXHRcdFx0Ly8gU2Nyb2xsIGludG8gdmlldyBvbiBwYWdpbmF0ZS5cblx0XHRcdGlmICggJ3BhZ2luYXRlJyA9PT0gdHJpZ2dlcmVkQnkgJiYgd2NhcGZfcGFyYW1zLmltbWVkaWF0ZV9zY3JvbGxfb25fcGFnaW5hdGUgKSB7XG5cdFx0XHRcdFdDQVBGLnNjcm9sbFRvKCB0cmlnZ2VyZWRCeSApO1xuXHRcdFx0fVxuXG5cdFx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGZfYmVmb3JlX2ZldGNoaW5nX3Byb2R1Y3RzJywgWyB0cmlnZ2VyZWRCeSBdICk7XG5cdFx0fSxcblx0XHRkZXN0cm95VGlwcHlJbnN0YW5jZXM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMudXNlX3RpcHB5anMgKSB7XG5cdFx0XHRcdC8vIEBzb3VyY2UgaHR0cHM6Ly9naXRodWIuY29tL2F0b21pa3MvdGlwcHlqcy9pc3N1ZXMvNDczXG5cdFx0XHRcdHRpcHB5SW5zdGFuY2VzLmZvckVhY2goIGluc3RhbmNlID0+IHtcblx0XHRcdFx0XHRpbnN0YW5jZS5kZXN0cm95KCk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdFx0dGlwcHlJbnN0YW5jZXMubGVuZ3RoID0gMDsgLy8gY2xlYXIgaXRcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8vIFRoaW5ncyBhcmUgZG9uZSBiZWZvcmUgdXBkYXRpbmcgdGhlIHByb2R1Y3RzIGxpa2UgaGlkaW5nIHRoZSBsb2FkaW5nIGluZGljYXRvci5cblx0XHRiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzOiBmdW5jdGlvbiggJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSApIHtcblx0XHRcdFdDQVBGLnJlc2V0TG9hZGluZ0FuaW1hdGlvbigpO1xuXG5cdFx0XHQvLyBNYXliZSBnb29kIGZvciBwZXJmb3JtYW5jZS5cblx0XHRcdFdDQVBGLmRlc3Ryb3lUaXBweUluc3RhbmNlcygpO1xuXG5cdFx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGZfYmVmb3JlX3VwZGF0aW5nX3Byb2R1Y3RzJywgWyAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5IF0gKTtcblx0XHR9LFxuXHRcdGFmdGVyVXBkYXRpbmdQcm9kdWN0czogZnVuY3Rpb24oICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgKSB7XG5cdFx0XHRXQ0FQRi51cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0KCAkcmVzcG9uc2UgKTtcblxuXHRcdFx0Ly8gUmVzdG9yZSB0aGUgZm9jdXMgKE1heWJlIHJlc3RvcmluZyB0aGUgZm9jdXMgaW4gbW9iaWxlIGRldmljZSBpc24ndCBnb29kKS5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnJlc3RvcmVfZm9jdXNfYWZ0ZXJfZmlsdGVyaW5nICYmICEgd2NhcGZfcGFyYW1zLmlzX21vYmlsZSApIHtcblx0XHRcdFx0aWYgKCBkb2N1bWVudC5ib2R5ICE9PSBmb2N1c2VkRWxtICkge1xuXHRcdFx0XHRcdGlmICggZm9jdXNlZEVsbS5pZCApIHtcblx0XHRcdFx0XHRcdCQoIGAjJHsgZm9jdXNlZEVsbS5pZCB9YCApLmZvY3VzKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlaW5pdGlhbGl6ZSB3Y2FwZi5cblx0XHRcdFdDQVBGLmluaXQoKTtcblxuXHRcdFx0Ly8gU2Nyb2xsIGludG8gdmlldy5cblx0XHRcdGlmICggJ3BhZ2luYXRlJyA9PT0gdHJpZ2dlcmVkQnkgJiYgd2NhcGZfcGFyYW1zLmltbWVkaWF0ZV9zY3JvbGxfb25fcGFnaW5hdGUgKSB7XG5cdFx0XHRcdC8vIERvIG5vdGhpbmcgYmVjYXVzZSBpdCBhbHJlYWR5IGhhcHBlbmVkLlxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0V0NBUEYuc2Nyb2xsVG8oIHRyaWdnZXJlZEJ5ICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRyaWdnZXIgZXZlbnRzLlxuXHRcdFx0JCggZG9jdW1lbnQgKS50cmlnZ2VyKCAncmVhZHknICk7XG5cdFx0XHQkKCB3aW5kb3cgKS50cmlnZ2VyKCAnc2Nyb2xsJyApO1xuXHRcdFx0JCggd2luZG93ICkudHJpZ2dlciggJ3Jlc2l6ZScgKTtcblxuXHRcdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2FmdGVyX3VwZGF0aW5nX3Byb2R1Y3RzJywgWyAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5IF0gKTtcblx0XHR9LFxuXHRcdGZpbHRlclByb2R1Y3RzOiBmdW5jdGlvbiggdHJpZ2dlcmVkQnkgPSAnZmlsdGVyJyApIHtcblx0XHRcdFdDQVBGLmJlZm9yZUZldGNoaW5nUHJvZHVjdHMoIHRyaWdnZXJlZEJ5ICk7XG5cblx0XHRcdCQuYWpheCgge1xuXHRcdFx0XHR1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHRcdFx0Y29uc3QgJHJlc3BvbnNlID0gJCggcmVzcG9uc2UgKTtcblxuXHRcdFx0XHRcdFdDQVBGLmJlZm9yZVVwZGF0aW5nUHJvZHVjdHMoICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgKTtcblxuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIFVwZGF0ZSBkb2N1bWVudCB0aXRsZS5cblx0XHRcdFx0XHQgKlxuXHRcdFx0XHRcdCAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzc1OTk1NjJcblx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy51cGRhdGVfZG9jdW1lbnRfdGl0bGUgKSB7XG5cdFx0XHRcdFx0XHRkb2N1bWVudC50aXRsZSA9ICRyZXNwb25zZS5maWx0ZXIoICd0aXRsZScgKS50ZXh0KCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBpbnN0YW5jZXMuXG5cdFx0XHRcdFx0Zm9yICggY29uc3QgaWQgb2YgaW5zdGFuY2VJZHMgKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBpbnN0YW5jZUlkICAgICA9ICdbZGF0YS1pZD1cIicgKyBpZCArICdcIl0nO1xuXHRcdFx0XHRcdFx0Y29uc3QgJGluc3RhbmNlICAgICAgPSAkKCBpbnN0YW5jZUlkICk7XG5cdFx0XHRcdFx0XHRjb25zdCAkaW5uZXIgICAgICAgICA9ICRpbnN0YW5jZS5maW5kKCAnLndjYXBmLWZpbHRlci1pbm5lcicgKTtcblx0XHRcdFx0XHRcdGNvbnN0IF9pbnN0YW5jZSAgICAgID0gJHJlc3BvbnNlLmZpbmQoIGluc3RhbmNlSWQgKTtcblx0XHRcdFx0XHRcdGxldCBfaW5zdGFuY2VDbGFzc2VzID0gJCggX2luc3RhbmNlICkuYXR0ciggJ2NsYXNzJyApO1xuXG5cdFx0XHRcdFx0XHQvLyBQcmVzZXJ2ZSBoaWVyYXJjaHkgYWNjb3JkaW9uIHN0YXRlLlxuXHRcdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkaW5zdGFuY2UuaGFzQ2xhc3MoICdoYXMtaGllcmFyY2h5LWFjY29yZGlvbicgKSApIHtcblx0XHRcdFx0XHRcdFx0XHQkaW5zdGFuY2UuZmluZCggJy53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0ICRlbCA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IGlkICA9ICRlbC5kYXRhKCAnaWQnICk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHRvZ2dsZVNlbGVjdG9yID0gYC53Y2FwZi1oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZVtkYXRhLWlkPVwiJHsgaWQgfVwiXWA7XG5cblx0XHRcdFx0XHRcdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYWNjb3JkaW9uIGlzIG9wZW5lZFxuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGlmICggcHJlc3NlZCApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICd0cnVlJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5jbG9zZXN0KCAnbGknICkuY2hpbGRyZW4oICd1bCcgKS5zaG93KCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5hdHRyKCAnYXJpYS1wcmVzc2VkJywgJ2ZhbHNlJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5jbG9zZXN0KCAnbGknICkuY2hpbGRyZW4oICd1bCcgKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIFByZXNlcnZlIHNvZnQgbGltaXQgc3RhdGUuXG5cdFx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5wcmVzZXJ2ZV9zb2Z0X2xpbWl0X3N0YXRlICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRpbnN0YW5jZS5oYXNDbGFzcyggJ2hhcy1zb2Z0LWxpbWl0JyApICkge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0ICRsaXN0V3JhcHBlciA9ICRpbnN0YW5jZS5maW5kKCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKTtcblxuXHRcdFx0XHRcdFx0XHRcdGlmICggJGxpc3RXcmFwcGVyLmhhc0NsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKS5hZGRDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICd0cnVlJyApO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1saXN0LXdyYXBwZXInICkucmVtb3ZlQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJyApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAnZmFsc2UnICk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIFVwZGF0ZSBjbGVhciBmaWx0ZXIgYnV0dG9uIHVybC5cblx0XHRcdFx0XHRcdGNvbnN0IGNsZWFyQnRuU2VsZWN0b3IgPSAnLndjYXBmLWZpbHRlci10aXRsZSAud2NhcGYtZmlsdGVyLWNsZWFyLWJ0bic7XG5cdFx0XHRcdFx0XHRjb25zdCBjbGVhckZpbHRlclVybCAgID0gX2luc3RhbmNlLmZpbmQoIGNsZWFyQnRuU2VsZWN0b3IgKS5hdHRyKCAnZGF0YS1jbGVhci1maWx0ZXItdXJsJyApO1xuXHRcdFx0XHRcdFx0JGluc3RhbmNlLmZpbmQoIGNsZWFyQnRuU2VsZWN0b3IgKS5hdHRyKCAnZGF0YS1jbGVhci1maWx0ZXItdXJsJywgY2xlYXJGaWx0ZXJVcmwgKTtcblxuXHRcdFx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBpbnN0YW5jZSBjbGFzc2VzLlxuXHRcdFx0XHRcdFx0JGluc3RhbmNlLmF0dHIoICdjbGFzcycsIF9pbnN0YW5jZUNsYXNzZXMudHJpbSgpICk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IF9odG1sID0gX2luc3RhbmNlLmZpbmQoICcud2NhcGYtZmlsdGVyLWlubmVyJyApLmh0bWwoKTtcblxuXHRcdFx0XHRcdFx0Ly8gRmluYWxseSB1cGRhdGUgdGhlIGluc3RhbmNlLlxuXHRcdFx0XHRcdFx0JGlubmVyLmh0bWwoIF9odG1sICk7XG5cblx0XHRcdFx0XHRcdCRpbnN0YW5jZS50cmlnZ2VyKCAnd2NhcGYtZmlsdGVyLXVwZGF0ZWQnLCBbIF9pbnN0YW5jZSBdICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBhY3RpdmUgZmlsdGVycyBhbmQgcmVzZXQgZmlsdGVycy5cblx0XHRcdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLWFjdGl2ZS1maWx0ZXJzLCAud2NhcGYtcmVzZXQtZmlsdGVycycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGNvbnN0ICR0aGF0ICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0XHRjb25zdCBpbnN0YW5jZUlkID0gJ1tkYXRhLWlkPVwiJyArICR0aGF0LmRhdGEoICdpZCcgKSArICdcIl0nO1xuXG5cdFx0XHRcdFx0XHQkdGhhdC5odG1sKCAkcmVzcG9uc2UuZmluZCggaW5zdGFuY2VJZCApLmh0bWwoKSApO1xuXHRcdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRcdC8vIFJlcGxhY2Ugb2xkIHNob3AgbG9vcCB3aXRoIG5ldyBvbmUuXG5cdFx0XHRcdFx0Y29uc3QgJHNob3BMb29wQ29udGFpbmVyID0gJHJlc3BvbnNlLmZpbmQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRcdFx0Y29uc3QgJG5vdEZvdW5kQ29udGFpbmVyID0gJHJlc3BvbnNlLmZpbmQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICk7XG5cblx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyID09PSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRXQ0FQRi5hZnRlclVwZGF0aW5nUHJvZHVjdHMoICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0cmVxdWVzdEZpbHRlcjogZnVuY3Rpb24oIHVybCwgdHJpZ2dlcmVkQnkgPSAnZmlsdGVyJyApIHtcblx0XHRcdGlmICggISB1cmwgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaG9zdG5hbWUgPSBsb2NhdGlvbi5ob3N0bmFtZTtcblxuXHRcdFx0Ly8gVE9ETzogUmVtb3ZlIGZyb20gcHJvZHVjdGlvbiBidWlsZC5cblx0XHRcdGlmICggJ2xvY2FsaG9zdCcgPT09IGhvc3RuYW1lICkge1xuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSggJ2h0dHA6Ly93Y2ZpbHRlci0yLnRlc3QnLCAnLy9sb2NhbGhvc3Q6MzAwMScgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gd2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmw7XG5cblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7IHdjYXBmOiB0cnVlIH0sICcnLCB1cmwgKTtcblxuXHRcdFx0V0NBUEYuZmlsdGVyUHJvZHVjdHMoIHRyaWdnZXJlZEJ5ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVOdW1iZXJJbnB1dEZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgcmFuZ2VOdW1iZXJTZWxlY3RvcnMgPSAnLndjYXBmLXJhbmdlLW51bWJlciAubWluLXZhbHVlLCAud2NhcGYtcmFuZ2UtbnVtYmVyIC5tYXgtdmFsdWUnO1xuXG5cdFx0XHQkYm9keS5vbiggJ2lucHV0JywgcmFuZ2VOdW1iZXJTZWxlY3RvcnMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRjb25zdCAkcmFuZ2VOdW1iZXIgICAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtcmFuZ2UtbnVtYmVyJyApO1xuXHRcdFx0XHRjb25zdCBmb3JtYXROdW1iZXJzICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1mb3JtYXQtbnVtYmVycycgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBvbGRNaW5WYWx1ZSAgICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgb2xkTWF4VmFsdWUgICAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWRlY2ltYWwtcGxhY2VzJyApO1xuXHRcdFx0XHRjb25zdCB0aG91c2FuZFNlcGFyYXRvciA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS10aG91c2FuZC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdGNvbnN0IGdldFZhbHVlID0gKCBmbG9hdFZhbHVlICkgPT4ge1xuXHRcdFx0XHRcdGlmICggZm9ybWF0TnVtYmVycyApIHtcblx0XHRcdFx0XHRcdHJldHVybiBudW1iZXJGb3JtYXQoIGZsb2F0VmFsdWUsIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIGZsb2F0VmFsdWU7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0bGV0IG1pblZhbHVlID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCgpICk7XG5cdFx0XHRcdFx0bGV0IG1heFZhbHVlID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCgpICk7XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0XHRcdGlmICggaXNOYU4oIG1pblZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdFx0XHRpZiAoIGlzTmFOKCBtYXhWYWx1ZSApICkge1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gYmVsb3cgdGhlIHJhbmdlTWluVmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA8IHJhbmdlTWluVmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID4gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0XHRcdGlmICggbWF4VmFsdWUgPiByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gZ28gYmVsb3cgdGhlIG1pblZhbHVlLlxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPiBtYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gbWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gSWYgdmFsdWUgaXMgbm90IGNoYW5nZWQgdGhlbiBkb24ndCBwcm9jZWVkLlxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPT09IG9sZE1pblZhbHVlICYmIG1heFZhbHVlID09PSBvbGRNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIG1heFZhbHVlID09PSByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0Ly8gUmVtb3ZlIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICRyYW5nZU51bWJlci5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBBZGQgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0Y29uc3QgdXJsID0gJHJhbmdlTnVtYmVyLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIG1pblZhbHVlICkucmVwbGFjZSggJyUycycsIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZUxpc3RGaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IG5hdGl2ZUlucHV0cyA9ICcubGlzdC10eXBlLW5hdGl2ZSBbdHlwZT1cImNoZWNrYm94XCJdLCcgK1xuXHRcdFx0XHQnLmxpc3QtdHlwZS1uYXRpdmUgW3R5cGU9XCJyYWRpb1wiXSwnICtcblx0XHRcdFx0Jy5saXN0LXR5cGUtY3VzdG9tLWNoZWNrYm94IFt0eXBlPVwiY2hlY2tib3hcIl0nO1xuXG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsIG5hdGl2ZUlucHV0cywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5kYXRhKCAndXJsJyApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGNvbnN0IGN1c3RvbVJhZGlvU2VsZWN0b3IgPSAnLmxpc3QtdHlwZS1jdXN0b20tcmFkaW8nO1xuXG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsIGN1c3RvbVJhZGlvU2VsZWN0b3IgKyAnIFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzU4Mzk5MjRcblx0XHRcdFx0JCggdGhpcyApXG5cdFx0XHRcdFx0LmNsb3Nlc3QoIGN1c3RvbVJhZGlvU2VsZWN0b3IgKVxuXHRcdFx0XHRcdC5maW5kKCAnW3R5cGU9XCJjaGVja2JveFwiXScgKS5ub3QoIHRoaXMgKVxuXHRcdFx0XHRcdC5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJCggdGhpcyApLmRhdGEoICd1cmwnICkgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZURyb3Bkb3duRmlsdGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsICcud2NhcGYtZHJvcGRvd24td3JhcHBlciBzZWxlY3QnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHNlbGVjdCAgICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IHZhbHVlcyAgICAgICAgID0gJHNlbGVjdC52YWwoKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyVVJMICAgICAgPSAkc2VsZWN0LmRhdGEoICd1cmwnICk7XG5cdFx0XHRcdGNvbnN0IGNsZWFyRmlsdGVyVVJMID0gJHNlbGVjdC5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKTtcblx0XHRcdFx0bGV0IHVybDtcblxuXHRcdFx0XHRpZiAoIHZhbHVlcy5sZW5ndGggKSB7XG5cdFx0XHRcdFx0dXJsID0gZmlsdGVyVVJMLnJlcGxhY2UoICclcycsIHZhbHVlcy50b1N0cmluZygpICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dXJsID0gY2xlYXJGaWx0ZXJVUkw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZVBhZ2luYXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXggJiYgd2NhcGZfcGFyYW1zLnBhZ2luYXRpb25fY29udGFpbmVyICkge1xuXHRcdFx0XHRjb25zdCAkY29udGFpbmVyID0gJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdFx0Y29uc3Qgc2VsZWN0b3IgICA9IHdjYXBmX3BhcmFtcy5wYWdpbmF0aW9uX2NvbnRhaW5lciArICcgYSc7XG5cblx0XHRcdFx0aWYgKCAkY29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHQkY29udGFpbmVyLm9uKCAnY2xpY2snLCBzZWxlY3RvciwgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IGhyZWYgPSAkKCB0aGlzICkuYXR0ciggJ2hyZWYnICk7XG5cblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIGhyZWYsICdwYWdpbmF0ZScgKTtcblx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdGhhbmRsZURlZmF1bHRPcmRlcmJ5OiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMuc29ydGluZ19jb250cm9sICkge1xuXHRcdFx0XHQvLyBTdWJtaXQgdGhlIG9yZGVyYnkgZm9ybSB3aGVuIHZhbHVlIGlzIGNoYW5nZWQuXG5cdFx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgJy53b29jb21tZXJjZS1vcmRlcmluZyBzZWxlY3Qub3JkZXJieScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5jbG9zZXN0KCAnZm9ybScgKS50cmlnZ2VyKCAnc3VibWl0JyApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBQcmV2ZW50IHRoZSBhdXRvIHN1Ym1pc3Npb24gb2YgdGhlIG9yZGVyYnkgZm9ybS5cblx0XHRcdCRib2R5Lm9uKCAnc3VibWl0JywgJy53b29jb21tZXJjZS1vcmRlcmluZycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgdmlhIGFqYXggd2hlbiB0aGUgb3JkZXJieSB2YWx1ZSBpcyBjaGFuZ2VkLlxuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nIHNlbGVjdC5vcmRlcmJ5JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0IG9yZGVyID0gJCggdGhpcyApLnZhbCgpO1xuXG5cdFx0XHRcdGNvbnN0IHVybCA9IG5ldyBVUkwoIHdpbmRvdy5sb2NhdGlvbiApO1xuXHRcdFx0XHR1cmwuc2VhcmNoUGFyYW1zLnNldCggJ29yZGVyYnknLCBvcmRlciApO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIGdldE9yZGVyQnlVcmwoIHVybC5ocmVmICkgKTtcblxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVSZXNldEZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtcmVzZXQtZmlsdGVycy1idG4nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coICdyZXNldCBhbGwgZmlsdGVycycgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdC8vIFRPRE86IE1vdmUgdG8gcHJvXG5cdFx0aGFuZGxlQ2xlYXJGaWx0ZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtZmlsdGVyLWNsZWFyLWJ0bicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5hdHRyKCAnZGF0YS1jbGVhci1maWx0ZXItdXJsJyApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVGaWx0ZXJUb29sdGlwOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHRpcHB5ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMudXNlX3RpcHB5anMgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGlwcHkoICcud2NhcGYtZmlsdGVyLXRvb2x0aXAnLCB7XG5cdFx0XHRcdHBsYWNlbWVudDogJ3RvcCcsXG5cdFx0XHRcdGNvbnRlbnQoIHJlZmVyZW5jZSApIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSggJ2RhdGEtY29udGVudCcgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0YWxsb3dIVE1MOiB0cnVlLFxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aW5pdENvbWJvYm94OiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggISBqUXVlcnkoKS5jaG9zZW5XQ0FQRiApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB0ZW1wbGF0ZVJlc3VsdCA9ICggdGV4dCwgZGF0YSApID0+IHtcblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQnPHNwYW4+JyArIHRleHQgKyAnPC9zcGFuPicsXG5cdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwid2NhcGYtY291bnRcIj4nICsgZGF0YVsgJ2NvdW50TWFya3VwJyBdICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRdLmpvaW4oICcnICk7XG5cdFx0XHR9O1xuXG5cdFx0XHRjb25zdCB0ZW1wbGF0ZVNlbGVjdGlvbiA9ICggdGV4dCwgZGF0YSApID0+IHtcblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJ3Y2FwZi1jb3VudC0nICsgZGF0YS5jb3VudCArICdcIj4nICsgdGV4dCArICc8L3NwYW4+Jyxcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJ3Y2FwZi1jb3VudCB3Y2FwZi1jb3VudC0nICsgZGF0YS5jb3VudCArICdcIj4nICsgZGF0YVsgJ2NvdW50TWFya3VwJyBdICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRdLmpvaW4oICcnICk7XG5cdFx0XHR9O1xuXG5cdFx0XHRjb25zdCBvcHRpb25zID0ge1xuXHRcdFx0XHRpbmhlcml0X3NlbGVjdF9jbGFzc2VzOiB0cnVlLFxuXHRcdFx0XHRpbmhlcml0X29wdGlvbl9jbGFzc2VzOiB0cnVlLFxuXHRcdFx0XHRub19yZXN1bHRzX3RleHQ6IHdjYXBmX3BhcmFtcy5jaG9zZW5fbm9fcmVzdWx0c190ZXh0LFxuXHRcdFx0XHRvcHRpb25zX25vbmVfdGV4dDogd2NhcGZfcGFyYW1zLmNob3Nlbl9vcHRpb25zX25vbmVfdGV4dCxcblx0XHRcdFx0c2VhcmNoX2NvbnRhaW5zOiB0cnVlLCAvLyBNYXRjaCBmcm9tIGFueXdoZXJlIGluIHN0cmluZy5cblx0XHRcdH07XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmlzX3J0bCApIHtcblx0XHRcdFx0b3B0aW9uc1sgJ3J0bCcgXSA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdCRib2R5LmZpbmQoICcud2NhcGYtY2hvc2VuJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHQvLyBJZiBoaWVyYXJjaHkgZW5hYmxlZCB0aGVuIHdlIHNob3cgdGhlIHNlbGVjdGVkIG9wdGlvbnMuXG5cdFx0XHRcdGlmICggJHRoaXMuaGFzQ2xhc3MoICdoYXMtaGllcmFyY2h5JyApICkge1xuXHRcdFx0XHRcdG9wdGlvbnNbICdkaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMnIF0gPSB0cnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG9wdGlvbnNbICdkaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMnIF0gPSB3Y2FwZl9wYXJhbXMuY2hvc2VuX2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEVuYWJsZSB0ZW1wbGF0aW5nIHdoZW4gc2hvd2luZyBjb3VudC5cblx0XHRcdFx0aWYgKCAkdGhpcy5oYXNDbGFzcyggJ3dpdGgtY291bnQnICkgKSB7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ3RlbXBsYXRlUmVzdWx0JyBdICAgID0gdGVtcGxhdGVSZXN1bHQ7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ3RlbXBsYXRlU2VsZWN0aW9uJyBdID0gdGVtcGxhdGVTZWxlY3Rpb247XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkdGhpcy5jaG9zZW5XQ0FQRiggb3B0aW9ucyApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBBdHRhY2ggY2hvc2VuIGZvciBkZWZhdWx0IG9yZGVyYnkuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5hdHRhY2hfY2hvc2VuX29uX3NvcnRpbmcgKSB7XG5cdFx0XHRcdGxldCBkaXNhYmxlU2VhcmNoID0gdHJ1ZTtcblxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zZWFyY2hfYm94X2luX2RlZmF1bHRfb3JkZXJieSApIHtcblx0XHRcdFx0XHRkaXNhYmxlU2VhcmNoID0gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRvcHRpb25zWyAnZGlzYWJsZV9zZWFyY2gnIF0gPSBkaXNhYmxlU2VhcmNoO1xuXG5cdFx0XHRcdCRib2R5LmZpbmQoICcud29vY29tbWVyY2Utb3JkZXJpbmcgc2VsZWN0Lm9yZGVyYnknICkuY2hvc2VuV0NBUEYoIG9wdGlvbnMgKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGluaXRSYW5nZVNsaWRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLXJhbmdlLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGl0ZW0gICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgJHNsaWRlciA9ICRpdGVtLmZpbmQoICcud2NhcGYtbm91aS1zbGlkZXInICk7XG5cblx0XHRcdFx0Y29uc3Qgc2xpZGVySWQgICAgICAgICAgPSAkc2xpZGVyLmF0dHIoICdpZCcgKTtcblx0XHRcdFx0Y29uc3QgZGlzcGxheVZhbHVlc0FzICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kaXNwbGF5LXZhbHVlcy1hcycgKTtcblx0XHRcdFx0Y29uc3QgZm9ybWF0TnVtYmVycyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1mb3JtYXQtbnVtYmVycycgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgc3RlcCAgICAgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1zdGVwJyApICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1wbGFjZXMnICk7XG5cdFx0XHRcdGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gJGl0ZW0uYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBtaW5WYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBtYXhWYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCAkbWluVmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWluLXZhbHVlJyApO1xuXHRcdFx0XHRjb25zdCAkbWF4VmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWF4LXZhbHVlJyApO1xuXG5cdFx0XHRcdGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBzbGlkZXJJZCApO1xuXG5cdFx0XHRcdG5vVWlTbGlkZXIuY3JlYXRlKCBzbGlkZXIsIHtcblx0XHRcdFx0XHRzdGFydDogWyBtaW5WYWx1ZSwgbWF4VmFsdWUgXSxcblx0XHRcdFx0XHRzdGVwLFxuXHRcdFx0XHRcdGNvbm5lY3Q6IHRydWUsXG5cdFx0XHRcdFx0Y3NzUHJlZml4OiAnd2NhcGYtbm91aS0nLFxuXHRcdFx0XHRcdHJhbmdlOiB7XG5cdFx0XHRcdFx0XHQnbWluJzogcmFuZ2VNaW5WYWx1ZSxcblx0XHRcdFx0XHRcdCdtYXgnOiByYW5nZU1heFZhbHVlLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAndXBkYXRlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHRsZXQgbWluVmFsdWU7XG5cdFx0XHRcdFx0bGV0IG1heFZhbHVlO1xuXG5cdFx0XHRcdFx0aWYgKCBmb3JtYXROdW1iZXJzICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSBudW1iZXJGb3JtYXQoIHZhbHVlc1sgMCBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSBudW1iZXJGb3JtYXQoIHZhbHVlc1sgMSBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMSBdICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCAncGxhaW5fdGV4dCcgPT09IGRpc3BsYXlWYWx1ZXNBcyApIHtcblx0XHRcdFx0XHRcdCRtaW5WYWx1ZS5odG1sKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdFx0JG1heFZhbHVlLmh0bWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRtaW5WYWx1ZS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0XHQkbWF4VmFsdWUudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1ub3Vpc2xpZGVyLXVwZGF0ZScsIFsgJGl0ZW0sIHZhbHVlcyBdICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRmdW5jdGlvbiBmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdFx0Y29uc3QgX21pblZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAwIF0gKTtcblx0XHRcdFx0XHRjb25zdCBfbWF4VmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDEgXSApO1xuXG5cdFx0XHRcdFx0Ly8gSWYgdmFsdWUgaXMgbm90IGNoYW5nZWQgdGhlbiBkb24ndCBwcm9jZWVkLlxuXHRcdFx0XHRcdGlmICggX21pblZhbHVlID09PSBtaW5WYWx1ZSAmJiBfbWF4VmFsdWUgPT09IG1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggX21pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIF9tYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdC8vIFJlbW92ZSByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkaXRlbS5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBBZGQgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0Y29uc3QgdXJsID0gJGl0ZW0uZGF0YSggJ3VybCcgKS5yZXBsYWNlKCAnJTFzJywgX21pblZhbHVlICkucmVwbGFjZSggJyUycycsIF9tYXhWYWx1ZSApO1xuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICdjaGFuZ2UnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0JG1pblZhbHVlLm9uKCAnaW5wdXQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRcdCRpbnB1dC5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5zZXQoIFsgbWluVmFsdWUsIG51bGwgXSApO1xuXG5cdFx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtYXhWYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG51bGwsIG1heFZhbHVlIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXRGaWx0ZXJPcHRpb25Ub29sdGlwOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHRpcHB5ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMudXNlX3RpcHB5anMgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgdG9vbHRpcFBvc2l0aW9ucyA9IFsgJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCcgXTtcblxuXHRcdFx0dG9vbHRpcFBvc2l0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbiggdG9vbHRpcFBvc2l0aW9uICkge1xuXHRcdFx0XHRjb25zdCBpZGVudGlmaWVyID0gJ2RhdGEtd2NhcGYtdG9vbHRpcC0nICsgdG9vbHRpcFBvc2l0aW9uO1xuXG5cdFx0XHRcdGNvbnN0IGluc3RhbmNlcyA9IHRpcHB5KCAnWycgKyBpZGVudGlmaWVyICsgJ10nLCB7XG5cdFx0XHRcdFx0cGxhY2VtZW50OiB0b29sdGlwUG9zaXRpb24sXG5cdFx0XHRcdFx0Y29udGVudCggcmVmZXJlbmNlICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJlZmVyZW5jZS5nZXRBdHRyaWJ1dGUoIGlkZW50aWZpZXIgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHR3aW5kb3cudGlwcHlJbnN0YW5jZXMgPSB0aXBweUluc3RhbmNlcy5jb25jYXQoIGluc3RhbmNlcyApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRXQ0FQRi5pbml0Q29tYm9ib3goKTtcblx0XHRcdFdDQVBGLmluaXRSYW5nZVNsaWRlcigpO1xuXHRcdFx0V0NBUEYuaW5pdEZpbHRlck9wdGlvblRvb2x0aXAoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gSGFuZGxlIHRoZSBwb3BzdGF0ZSBldmVudChicm93c2VyJ3MgYmFjay9mb3J3YXJkKVxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3BvcHN0YXRlJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0aWYgKCBudWxsICE9PSBlLnN0YXRlICYmIGUuc3RhdGUuaGFzT3duUHJvcGVydHkoICd3Y2FwZicgKSApIHtcblx0XHRcdFdDQVBGLmZpbHRlclByb2R1Y3RzKCAncG9wc3RhdGUnICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzMwMDQ5MTdcblx0aWYgKCAnc2Nyb2xsUmVzdG9yYXRpb24nIGluIGhpc3RvcnkgKSB7XG5cdFx0Ly8gVE9ETzogTWF5YmUgdXNlIGNvbmRpdGlvbmFsbHkuXG5cdFx0Ly8gaGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvbiA9ICdtYW51YWwnO1xuXHR9XG5cbn0oIGpRdWVyeSwgd2luZG93ICkgKTtcblxuKCBmdW5jdGlvbiggJCwgV0NBUEYgKSB7XG5cblx0V0NBUEYuaW5pdCgpO1xuXG5cdFdDQVBGLmhhbmRsZUZpbHRlckFjY29yZGlvbigpO1xuXHRXQ0FQRi5oYW5kbGVIaWVyYXJjaHlUb2dnbGUoKTtcblx0V0NBUEYuaGFuZGxlU29mdExpbWl0KCk7XG5cdFdDQVBGLmhhbmRsZVNlYXJjaEZpbHRlck9wdGlvbnMoKTtcblxuXHRXQ0FQRi5oYW5kbGVMaXN0RmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVEcm9wZG93bkZpbHRlcnMoKTtcblx0V0NBUEYuaGFuZGxlTnVtYmVySW5wdXRGaWx0ZXJzKCk7XG5cdFdDQVBGLmhhbmRsZVBhZ2luYXRpb24oKTtcblx0V0NBUEYuaGFuZGxlRGVmYXVsdE9yZGVyYnkoKTtcblxuXHRXQ0FQRi5oYW5kbGVSZXNldEZpbHRlcnMoKTtcblx0V0NBUEYuaGFuZGxlQ2xlYXJGaWx0ZXIoKTtcblxuXHRXQ0FQRi5oYW5kbGVGaWx0ZXJUb29sdGlwKCk7XG5cbn0oIGpRdWVyeSwgd2luZG93LldDQVBGICkgKTtcbiIsIi8qKlxuICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzQxNDE4MTNcbiAqXG4gKiBAcGFyYW0gbnVtYmVyXG4gKiBAcGFyYW0gZGVjaW1hbHNcbiAqIEBwYXJhbSBkZWNfcG9pbnRcbiAqIEBwYXJhbSB0aG91c2FuZHNfc2VwXG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gbnVtYmVyRm9ybWF0KCBudW1iZXIsIGRlY2ltYWxzLCBkZWNfcG9pbnQsIHRob3VzYW5kc19zZXAgKSB7XG5cdC8vIFN0cmlwIGFsbCBjaGFyYWN0ZXJzIGJ1dCBudW1lcmljYWwgb25lcy5cblx0bnVtYmVyID0gKCBudW1iZXIgKyAnJyApLnJlcGxhY2UoIC9bXlxcZCtcXC1FZS5dL2csICcnICk7XG5cblx0Y29uc3QgbiAgICA9ICEgaXNGaW5pdGUoICtudW1iZXIgKSA/IDAgOiArbnVtYmVyO1xuXHRjb25zdCBwcmVjID0gISBpc0Zpbml0ZSggK2RlY2ltYWxzICkgPyAwIDogTWF0aC5hYnMoIGRlY2ltYWxzICk7XG5cdGNvbnN0IHNlcCAgPSAoIHR5cGVvZiB0aG91c2FuZHNfc2VwID09PSAndW5kZWZpbmVkJyApID8gJywnIDogdGhvdXNhbmRzX3NlcDtcblx0Y29uc3QgZGVjICA9ICggdHlwZW9mIGRlY19wb2ludCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcuJyA6IGRlY19wb2ludDtcblxuXHRsZXQgcztcblxuXHRjb25zdCB0b0ZpeGVkRml4ID0gZnVuY3Rpb24oIG4sIHByZWMgKSB7XG5cdFx0Y29uc3QgayA9IE1hdGgucG93KCAxMCwgcHJlYyApO1xuXHRcdHJldHVybiAnJyArIE1hdGgucm91bmQoIG4gKiBrICkgLyBrO1xuXHR9O1xuXG5cdC8vIEZpeCBmb3IgSUUgcGFyc2VGbG9hdCgwLjU1KS50b0ZpeGVkKDApID0gMDtcblx0cyA9ICggcHJlYyA/IHRvRml4ZWRGaXgoIG4sIHByZWMgKSA6ICcnICsgTWF0aC5yb3VuZCggbiApICkuc3BsaXQoICcuJyApO1xuXG5cdGlmICggc1sgMCBdLmxlbmd0aCA+IDMgKSB7XG5cdFx0c1sgMCBdID0gc1sgMCBdLnJlcGxhY2UoIC9cXEIoPz0oPzpcXGR7M30pKyg/IVxcZCkpL2csIHNlcCApO1xuXHR9XG5cblx0aWYgKCAoIHNbIDEgXSB8fCAnJyApLmxlbmd0aCA8IHByZWMgKSB7XG5cdFx0c1sgMSBdID0gc1sgMSBdIHx8ICcnO1xuXHRcdHNbIDEgXSArPSBuZXcgQXJyYXkoIHByZWMgLSBzWyAxIF0ubGVuZ3RoICsgMSApLmpvaW4oICcwJyApO1xuXHR9XG5cblx0cmV0dXJuIHMuam9pbiggZGVjICk7XG59XG5cbmZ1bmN0aW9uIGNsZWFuVXJsKCB1cmwgKSB7XG5cdHJldHVybiB1cmwucmVwbGFjZSggLyUyQy9nLCAnLCcgKTtcbn1cblxuZnVuY3Rpb24gZ2V0T3JkZXJCeVVybCggdXJsICkge1xuXHRjb25zdCBwYWdlZCA9IHBhcnNlSW50KCB1cmwucmVwbGFjZSggLy4rXFwvcGFnZVxcLyhcXGQrKSsvLCAnJDEnICkgKTtcblxuXHRpZiAoIHBhZ2VkICkge1xuXHRcdHVybCA9IHVybC5yZXBsYWNlKCAvcGFnZVxcLyhcXGQrKVxcLy8sICcnICk7XG5cdH1cblxuXHRyZXR1cm4gY2xlYW5VcmwoIHVybCApO1xufVxuIl19
