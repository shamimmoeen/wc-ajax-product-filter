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
  'reload_on_back': '',
  'found_wcapf': '',
  'update_document_title': '',
  'use_tippyjs': '',
  'for_preview': '',
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
  'more_selectors': ''
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

          if (label.toLowerCase().includes(keyword.toLowerCase())) {
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
        $(this).closest(customRadioSelector).find('.wcapf-filter-item:not(.current-tax-item):not(.active-as-ancestor) [type="checkbox"]').not(this).prop('checked', false);
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
        search_contains: true,
        // Match from anywhere in string.
        search_in_values: true // Search in values also.

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
  WCAPF.handlePagination();
  WCAPF.handleDefaultOrderby();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbHRlci1mb3JtLmpzIiwicmVmYWN0b3JlZC5qcyIsInV0aWxzLmpzIl0sIm5hbWVzIjpbIndjYXBmX3BhcmFtcyIsImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwiJGJvZHkiLCJyYW5nZVZhbHVlc1NlcGFyYXRvciIsIl9kZWxheSIsInBhcnNlSW50IiwiZmlsdGVyX2lucHV0X2RlbGF5IiwiZGVsYXkiLCJmaWVsZHMiLCJ3Y2FwZlNpbmdsZUZpbHRlclNlbGVjdG9yIiwid2NhcGZOYXZGaWx0ZXJTZWxlY3RvciIsIndjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJTZWxlY3RvciIsIndjYXBmRGF0ZUZpbHRlclNlbGVjdG9yIiwiJHdjYXBmU2luZ2xlRmlsdGVycyIsIiR3Y2FwZk5hdkZpbHRlcnMiLCIkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMiLCIkd2NhcGZEYXRlRmlsdGVycyIsImVhY2giLCIkZmllbGQiLCJpZCIsImF0dHIiLCIkd3JhcHBlciIsImZpbmQiLCJmaWx0ZXJLZXkiLCJtdWx0aXBsZUZpbHRlciIsImluaXRDaG9zZW4iLCJjaG9zZW4iLCIkcm9vdCIsImZvcl9wcmV2aWV3IiwiJHRoaXMiLCJvcHRpb25zIiwiaW5oZXJpdF9zZWxlY3RfY2xhc3NlcyIsImluaGVyaXRfb3B0aW9uX2NsYXNzZXMiLCJpc19ydGwiLCJub1Jlc3VsdHNNZXNzYWdlIiwic2VhcmNoVGhyZXNob2xkIiwiY2hvc2VuX2xpYl9zZWFyY2hfdGhyZXNob2xkIiwiaW5pdEhpZXJhcmNoeUFjY29yZGlvbiIsInRvZ2dsZUFjY29yZGlvbiIsIiRlbCIsInByZXNzZWQiLCIkY2hpbGQiLCJjbG9zZXN0IiwiY2hpbGRyZW4iLCJlbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uIiwic2xpZGVUb2dnbGUiLCJoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsInRvZ2dsZSIsIm9uIiwiZSIsImtleSIsInByZXZlbnREZWZhdWx0IiwibnVtYmVyX2Zvcm1hdCIsIm51bWJlciIsImRlY2ltYWxzIiwiZGVjX3BvaW50IiwidGhvdXNhbmRzX3NlcCIsInJlcGxhY2UiLCJuIiwiaXNGaW5pdGUiLCJwcmVjIiwiTWF0aCIsImFicyIsInNlcCIsImRlYyIsInMiLCJ0b0ZpeGVkRml4IiwiayIsInBvdyIsInJvdW5kIiwic3BsaXQiLCJsZW5ndGgiLCJBcnJheSIsImpvaW4iLCJpbml0Tm9VSVNsaWRlciIsIm5vVWlTbGlkZXIiLCIkaXRlbSIsIiRzbGlkZXIiLCJoYXNDbGFzcyIsInNsaWRlcklkIiwiZGlzcGxheVZhbHVlc0FzIiwiZm9ybWF0TnVtYmVycyIsInJhbmdlTWluVmFsdWUiLCJwYXJzZUZsb2F0IiwicmFuZ2VNYXhWYWx1ZSIsInN0ZXAiLCJkZWNpbWFsUGxhY2VzIiwidGhvdXNhbmRTZXBhcmF0b3IiLCJkZWNpbWFsU2VwYXJhdG9yIiwibWluVmFsdWUiLCJtYXhWYWx1ZSIsIiRtaW5WYWx1ZSIsIiRtYXhWYWx1ZSIsInNsaWRlciIsImdldEVsZW1lbnRCeUlkIiwiY3JlYXRlIiwic3RhcnQiLCJjb25uZWN0IiwiY3NzUHJlZml4IiwicmFuZ2UiLCJ2YWx1ZXMiLCJodG1sIiwidmFsIiwidHJpZ2dlciIsImZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIiLCJyZXF1ZXN0RmlsdGVyIiwiZGF0YSIsInVybCIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJyZW1vdmVEYXRhIiwiZXZlbnQiLCIkaW5wdXQiLCJzZXQiLCJnZXQiLCJmaWx0ZXJCeURhdGUiLCIkd2NhcGZEYXRlRmlsdGVyIiwiaXNSYW5nZSIsImZpbHRlclZhbHVlIiwicnVuRmlsdGVyIiwiZnJvbSIsInRvIiwidXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIiLCJxdWVyeSIsInJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsImZpbHRlclByb2R1Y3RzIiwiaW5pdERhdGVwaWNrZXIiLCJkYXRlcGlja2VyIiwiZm9ybWF0IiwieWVhckRyb3Bkb3duIiwibW9udGhEcm9wZG93biIsIiRmcm9tIiwiJHRvIiwiZGF0ZUZvcm1hdCIsImNoYW5nZVllYXIiLCJjaGFuZ2VNb250aCIsImluaXREZWZhdWx0T3JkZXJCeSIsImF0dGFjaF9jaG9zZW5fb25fc29ydGluZyIsInNvcnRpbmdfY29udHJvbCIsIiRvcmRlcmluZ0Zvcm0iLCJzdWJtaXQiLCJvcmRlciIsImZpbHRlcl9rZXkiLCJ1cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0IiwiJHJlc3VsdHMiLCJzZWxlY3RvciIsInNob3BfbG9vcF9jb250YWluZXIiLCJuZXdQcm9kdWN0Q291bnQiLCJzaG93TG9hZGluZ0FuaW1hdGlvbiIsImxvYWRpbmdfYW5pbWF0aW9uIiwiTG9hZGluZ092ZXJsYXkiLCJsb2FkaW5nX292ZXJsYXlfb3B0aW9ucyIsImRpc2FibGVOb1VpU2xpZGVycyIsImVsZW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJkaXNhYmxlTGFiZWxzIiwic2VsZWN0b3JzIiwiYWRkQ2xhc3MiLCJkaXNhYmxlSW5wdXRzIiwiZGlzYWJsZV9pbnB1dHNfd2hpbGVfZmV0Y2hpbmdfcmVzdWx0cyIsImlucHV0cyIsImVuYWJsZU5vVWlTbGlkZXJzIiwicmVtb3ZlQXR0cmlidXRlIiwiZW5hYmxlSW5wdXRzIiwicmVtb3ZlQXR0ciIsInJlc2V0TG9hZGluZ0FuaW1hdGlvbiIsInNjcm9sbFRvIiwic2Nyb2xsX3dpbmRvdyIsInNjcm9sbEZvciIsInNjcm9sbF93aW5kb3dfZm9yIiwiaXNNb2JpbGUiLCJpc19tb2JpbGUiLCJwcm9jZWVkIiwiYWRqdXN0aW5nT2Zmc2V0Iiwib2Zmc2V0Iiwic2Nyb2xsX3RvX3RvcF9vZmZzZXQiLCJjb250YWluZXIiLCJub3RfZm91bmRfY29udGFpbmVyIiwic2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudCIsIiRjb250YWluZXIiLCJ0b3AiLCJzdG9wIiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsInNjcm9sbF90b190b3Bfc3BlZWQiLCJzY3JvbGxfdG9fdG9wX2Vhc2luZyIsImJlZm9yZUZldGNoaW5nUHJvZHVjdHMiLCJzY3JvbGxfd2luZG93X3doZW4iLCJiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzIiwiYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzIiwiZm9yY2VSZVJlbmRlciIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsIiRkYXRhIiwiZmllbGRJRCIsIiRpbm5lciIsIl9maWVsZCIsImZpZWxkQ2xhc3NlcyIsInByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUiLCJpdGVtVmFsdWUiLCJwYXJlbnQiLCJ0b2dnbGVTZWxlY3RvciIsInVsU2VsZWN0b3IiLCJfY2xhc3NlcyIsInNob3ciLCJfaHRtbCIsInNvZnRMaW1pdFNlbGVjdG9yIiwidHJpbSIsIiRzaG9wTG9vcENvbnRhaW5lciIsIiRub3RGb3VuZENvbnRhaW5lciIsImdldFVybFZhcnMiLCJ2YXJzIiwiaGFzaCIsInJlcGxhY2VBbGwiLCJoYXNoZXMiLCJzbGljZSIsImluZGV4T2YiLCJoTGVuZ3RoIiwiaSIsImZpeFBhZ2luYXRpb24iLCJwYXJhbXMiLCJjdXJyZW50UGFnZUluVXJsIiwiY3VycmVudFBhZ2VJblBhcmFtcyIsInZhbHVlIiwicHVzaEhpc3RvcnkiLCJyZSIsIlJlZ0V4cCIsInNlcGFyYXRvciIsInVybFdpdGhRdWVyeSIsIm1hdGNoIiwib2xkUGFyYW1zIiwib2xkUGFyYW1zTGVuZ3RoIiwiT2JqZWN0Iiwia2V5cyIsInN0YXJ0UG9zaXRpb24iLCJmaWx0ZXJLZXlQb3NpdGlvbiIsImNsZWFuVXJsIiwiY2xlYW5RdWVyeSIsIm5ld1BhcmFtcyIsIm1ha2VQYXJhbWV0ZXJzIiwiZm9yY2VSZXJlbmRlciIsInZhbHVlU2VwYXJhdG9yIiwibmV4dFZhbHVlcyIsImVtcHR5VmFsdWUiLCJwcmV2VmFsdWVzIiwicHJldlZhbHVlc0FycmF5IiwiZm91bmQiLCJpbkFycmF5Iiwic3BsaWNlIiwicHVzaCIsInNpbmdsZUZpbHRlciIsImVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4IiwicGFnaW5hdGlvbl9jb250YWluZXIiLCJoYW5kbGVGaWx0ZXJSZXF1ZXN0IiwiZmllbGREYXRhIiwiJHNlbGVjdCIsImZpbHRlclVSTCIsImNsZWFyRmlsdGVyVVJMIiwidG9TdHJpbmciLCJyYW5nZU51bWJlclNlbGVjdG9ycyIsIiRyYW5nZU51bWJlciIsImdldFZhbHVlIiwiZmxvYXRWYWx1ZSIsImlzTmFOIiwicmVzZXRGaWx0ZXJzIiwiJGJ1dHRvbiIsIl9maWx0ZXJLZXlzIiwiZmlsdGVyS2V5cyIsInByZXZVcmwiLCJuZXdVcmwiLCJhcHBseV9maWx0ZXJzX29uX2Jyb3dzZXJfaGlzdG9yeV9jaGFuZ2UiLCJiaW5kIiwiaW5zdGFuY2VJZHMiLCJmb2N1c2VkRWxtIiwidGlwcHlJbnN0YW5jZXMiLCJXQ0FQRiIsImhhbmRsZUZpbHRlckFjY29yZGlvbiIsIiRmaWx0ZXJJbm5lciIsImVuYWJsZV9hbmltYXRpb25fZm9yX2ZpbHRlcl9hY2NvcmRpb24iLCJmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsInN0b3BQcm9wYWdhdGlvbiIsIiR0cmlnZ2VyIiwiaGFuZGxlSGllcmFyY2h5VG9nZ2xlIiwiaGFuZGxlU29mdExpbWl0IiwidG9nZ2xlRmlsdGVyT3B0aW9ucyIsIiRsaXN0V3JhcHBlciIsInJlbW92ZUNsYXNzIiwiaGFuZGxlU2VhcmNoRmlsdGVyT3B0aW9ucyIsIiR0aGF0IiwiJGZpbHRlciIsInNvZnRMaW1pdEVuYWJsZWQiLCJzb2Z0TGltaXRUb2dnbGUiLCJub1Jlc3VsdHMiLCJ2aXNpYmxlT3B0aW9ucyIsImtleXdvcmQiLCJpbmRleCIsIiRmaWx0ZXJJdGVtIiwidGV4dCIsImhpZGUiLCJsYWJlbCIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCIkcmVzcG9uc2UiLCJuZXdDb3VudCIsImhhcyIsInRyaWdnZXJlZEJ5IiwiYWxsb3dlZCIsInNjcm9sbFdoZW4iLCJkaXNhYmxlX3Njcm9sbF9hbmltYXRpb24iLCJhY3RpdmVFbGVtZW50IiwiaW1tZWRpYXRlX3Njcm9sbF9vbl9wYWdpbmF0ZSIsImRlc3Ryb3lUaXBweUluc3RhbmNlcyIsInVzZV90aXBweWpzIiwiZm9yRWFjaCIsImluc3RhbmNlIiwiZGVzdHJveSIsInJlc3RvcmVfZm9jdXNfYWZ0ZXJfZmlsdGVyaW5nIiwiYm9keSIsImZvY3VzIiwiaW5pdCIsImFqYXgiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJ1cGRhdGVfZG9jdW1lbnRfdGl0bGUiLCJ0aXRsZSIsImZpbHRlciIsImluc3RhbmNlSWQiLCIkaW5zdGFuY2UiLCJfaW5zdGFuY2UiLCJwcmVzZXJ2ZV9zb2Z0X2xpbWl0X3N0YXRlIiwiaG9zdG5hbWUiLCJ3Y2FwZiIsImhhbmRsZU51bWJlcklucHV0RmlsdGVycyIsIm9sZE1pblZhbHVlIiwib2xkTWF4VmFsdWUiLCJudW1iZXJGb3JtYXQiLCJoYW5kbGVMaXN0RmlsdGVycyIsIm5hdGl2ZUlucHV0cyIsImN1c3RvbVJhZGlvU2VsZWN0b3IiLCJub3QiLCJwcm9wIiwiaGFuZGxlRHJvcGRvd25GaWx0ZXJzIiwiaGFuZGxlUGFnaW5hdGlvbiIsIl9zZWxlY3RvcnMiLCJoYW5kbGVEZWZhdWx0T3JkZXJieSIsIlVSTCIsInNlYXJjaFBhcmFtcyIsImdldE9yZGVyQnlVcmwiLCJoYW5kbGVDbGVhckZpbHRlciIsImhhbmRsZUZpbHRlclRvb2x0aXAiLCJ0aXBweSIsInBsYWNlbWVudCIsImNvbnRlbnQiLCJyZWZlcmVuY2UiLCJnZXRBdHRyaWJ1dGUiLCJhbGxvd0hUTUwiLCJpbml0Q29tYm9ib3giLCJjaG9zZW5XQ0FQRiIsInRlbXBsYXRlUmVzdWx0IiwidGVtcGxhdGVTZWxlY3Rpb24iLCJjb3VudCIsIm5vX3Jlc3VsdHNfdGV4dCIsImNob3Nlbl9ub19yZXN1bHRzX3RleHQiLCJvcHRpb25zX25vbmVfdGV4dCIsImNob3Nlbl9vcHRpb25zX25vbmVfdGV4dCIsInNlYXJjaF9jb250YWlucyIsInNlYXJjaF9pbl92YWx1ZXMiLCJjaG9zZW5fZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zIiwiZGlzYWJsZVNlYXJjaCIsInNlYXJjaF9ib3hfaW5fZGVmYXVsdF9vcmRlcmJ5IiwiaW5pdFJhbmdlU2xpZGVyIiwiX21pblZhbHVlIiwiX21heFZhbHVlIiwiaW5pdEZpbHRlck9wdGlvblRvb2x0aXAiLCJ0b29sdGlwUG9zaXRpb25zIiwidG9vbHRpcFBvc2l0aW9uIiwiaWRlbnRpZmllciIsImluc3RhbmNlcyIsImNvbmNhdCIsImluaXRQb3BTdGF0ZSIsInJlbG9hZF9vbl9iYWNrIiwiZm91bmRfd2NhcGYiLCJyZXBsYWNlU3RhdGUiLCJhZGRFdmVudExpc3RlbmVyIiwic3RhdGUiLCJoYXNPd25Qcm9wZXJ0eSIsInBhZ2VkIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSxZQUFZLEdBQUdBLFlBQVksSUFBSTtBQUNwQyxZQUFVLEVBRDBCO0FBRXBDLHdCQUFzQixFQUZjO0FBR3BDLHFDQUFtQyxFQUhDO0FBSXBDLDRCQUEwQixFQUpVO0FBS3BDLDhCQUE0QixFQUxRO0FBTXBDLG1DQUFpQyxFQU5HO0FBT3BDLHdDQUFzQyxFQVBGO0FBUXBDLCtCQUE2QixFQVJPO0FBU3BDLDJDQUF5QyxFQVRMO0FBVXBDLHNDQUFvQyxFQVZBO0FBV3BDLHVDQUFxQyxFQVhEO0FBWXBDLDhDQUE0QyxFQVpSO0FBYXBDLHlDQUF1QyxFQWJIO0FBY3BDLDBDQUF3QyxFQWRKO0FBZXBDLG1DQUFpQyxFQWZHO0FBZ0JwQyw2QkFBMkIsRUFoQlM7QUFpQnBDLHlCQUF1QixFQWpCYTtBQWtCcEMsMEJBQXdCLEVBbEJZO0FBbUJwQyxrQ0FBZ0MsRUFuQkk7QUFvQnBDLGVBQWEsRUFwQnVCO0FBcUJwQyxvQkFBa0IsRUFyQmtCO0FBc0JwQyxpQkFBZSxFQXRCcUI7QUF1QnBDLDJCQUF5QixFQXZC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QSxNQUFLNlUsS0FBTCxFQUFhO0FBQ1ozUixJQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ2xELE9BQUosQ0FBYSxlQUFiLEVBQThCLEVBQTlCLENBQU47QUFDQTs7QUFFRCxTQUFPc0wsUUFBUSxDQUFFcEksR0FBRixDQUFmO0FBQ0EiLCJmaWxlIjoid2MtYWpheC1wcm9kdWN0LWZpbHRlci1wdWJsaWMtc2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIGZyb250ZW5kIGZpbHRlciBmb3JtLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL3B1YmxpYy9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5jb25zdCB3Y2FwZl9wYXJhbXMgPSB3Y2FwZl9wYXJhbXMgfHwge1xuXHQnaXNfcnRsJzogJycsXG5cdCdmaWx0ZXJfaW5wdXRfZGVsYXknOiAnJyxcblx0J2Nob3Nlbl9kaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMnOiAnJyxcblx0J2Nob3Nlbl9ub19yZXN1bHRzX3RleHQnOiAnJyxcblx0J2Nob3Nlbl9vcHRpb25zX25vbmVfdGV4dCc6ICcnLFxuXHQnc2VhcmNoX2JveF9pbl9kZWZhdWx0X29yZGVyYnknOiAnJyxcblx0J3ByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUnOiAnJyxcblx0J3ByZXNlcnZlX3NvZnRfbGltaXRfc3RhdGUnOiAnJyxcblx0J2VuYWJsZV9hbmltYXRpb25fZm9yX2ZpbHRlcl9hY2NvcmRpb24nOiAnJyxcblx0J2ZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkJzogJycsXG5cdCdmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmcnOiAnJyxcblx0J2VuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24nOiAnJyxcblx0J2hpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkJzogJycsXG5cdCdoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmcnOiAnJyxcblx0J3Jlc3RvcmVfZm9jdXNfYWZ0ZXJfZmlsdGVyaW5nJzogJycsXG5cdCdsb2FkaW5nX292ZXJsYXlfb3B0aW9ucyc6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9zcGVlZCc6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9lYXNpbmcnOiAnJyxcblx0J2ltbWVkaWF0ZV9zY3JvbGxfb25fcGFnaW5hdGUnOiAnJyxcblx0J2lzX21vYmlsZSc6ICcnLFxuXHQncmVsb2FkX29uX2JhY2snOiAnJyxcblx0J2ZvdW5kX3djYXBmJzogJycsXG5cdCd1cGRhdGVfZG9jdW1lbnRfdGl0bGUnOiAnJyxcblx0J3VzZV90aXBweWpzJzogJycsXG5cdCdmb3JfcHJldmlldyc6ICcnLFxuXHQnc2hvcF9sb29wX2NvbnRhaW5lcic6ICcnLFxuXHQnbm90X2ZvdW5kX2NvbnRhaW5lcic6ICcnLFxuXHQnZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXgnOiAnJyxcblx0J3BhZ2luYXRpb25fY29udGFpbmVyJzogJycsXG5cdCdzb3J0aW5nX2NvbnRyb2wnOiAnJyxcblx0J2F0dGFjaF9jaG9zZW5fb25fc29ydGluZyc6ICcnLFxuXHQnbG9hZGluZ19hbmltYXRpb24nOiAnJyxcblx0J3Njcm9sbF93aW5kb3cnOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfZm9yJzogJycsXG5cdCdzY3JvbGxfd2luZG93X3doZW4nOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfY3VzdG9tX2VsZW1lbnQnOiAnJyxcblx0J3Njcm9sbF90b190b3Bfb2Zmc2V0JzogJycsXG5cdCdkaXNhYmxlX3Njcm9sbF9hbmltYXRpb24nOiAnJyxcblx0J21vcmVfc2VsZWN0b3JzJzogJycsXG59O1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdHJldHVybjtcblxuXHRjb25zdCAkYm9keSA9ICQoICdib2R5JyApO1xuXG5cdGNvbnN0IHJhbmdlVmFsdWVzU2VwYXJhdG9yID0gJ34nO1xuXG5cdGNvbnN0IF9kZWxheSA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuZmlsdGVyX2lucHV0X2RlbGF5ICk7XG5cdGNvbnN0IGRlbGF5ICA9IF9kZWxheSA+PSAwID8gX2RlbGF5IDogODAwO1xuXG5cdC8vIFN0b3JlIGZpZWxkcycgaWQgYW5kIGZpbHRlciBpbmZvcm1hdGlvbi5cblx0Y29uc3QgZmllbGRzID0ge307XG5cblx0Y29uc3Qgd2NhcGZTaW5nbGVGaWx0ZXJTZWxlY3RvciAgICAgID0gJy53Y2FwZi1zaW5nbGUtZmlsdGVyJztcblx0Y29uc3Qgd2NhcGZOYXZGaWx0ZXJTZWxlY3RvciAgICAgICAgID0gJy53Y2FwZi1uYXYtZmlsdGVyJztcblx0Y29uc3Qgd2NhcGZOdW1iZXJSYW5nZUZpbHRlclNlbGVjdG9yID0gJy53Y2FwZi1udW1iZXItcmFuZ2UtZmlsdGVyJztcblx0Y29uc3Qgd2NhcGZEYXRlRmlsdGVyU2VsZWN0b3IgICAgICAgID0gJy53Y2FwZi1kYXRlLXJhbmdlLWZpbHRlcic7XG5cblx0Y29uc3QgJHdjYXBmU2luZ2xlRmlsdGVycyAgICAgID0gJCggd2NhcGZTaW5nbGVGaWx0ZXJTZWxlY3RvciApO1xuXHRjb25zdCAkd2NhcGZOYXZGaWx0ZXJzICAgICAgICAgPSAkKCB3Y2FwZk5hdkZpbHRlclNlbGVjdG9yICk7XG5cdGNvbnN0ICR3Y2FwZk51bWJlclJhbmdlRmlsdGVycyA9ICQoIHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJTZWxlY3RvciApO1xuXHRjb25zdCAkd2NhcGZEYXRlRmlsdGVycyAgICAgICAgPSAkKCB3Y2FwZkRhdGVGaWx0ZXJTZWxlY3RvciApO1xuXG5cdCR3Y2FwZlNpbmdsZUZpbHRlcnMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgaWQgICAgICAgICAgICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtaWQnICk7XG5cdFx0Y29uc3QgJHdyYXBwZXIgICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1maWVsZC1pbm5lciA+IGRpdicgKTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICA9ICR3cmFwcGVyLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0Y29uc3QgbXVsdGlwbGVGaWx0ZXIgPSBwYXJzZUludCggJHdyYXBwZXIuYXR0ciggJ2RhdGEtbXVsdGlwbGUtZmlsdGVyJyApICk7XG5cblx0XHRmaWVsZHNbIGlkIF0gPSB7XG5cdFx0XHRmaWx0ZXJLZXk6IGZpbHRlcktleSxcblx0XHRcdG11bHRpcGxlRmlsdGVyOiBtdWx0aXBsZUZpbHRlclxuXHRcdH07XG5cdH0gKTtcblxuXHQvLyBJbml0aWFsaXplIGpRdWVyeSBjaG9zZW4gbGlicmFyeS5cblx0ZnVuY3Rpb24gaW5pdENob3NlbigpIHtcblx0XHRpZiAoICEgalF1ZXJ5KCkuY2hvc2VuICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCAkcm9vdDtcblxuXHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0JHJvb3QgPSAkKCB3Y2FwZk5hdkZpbHRlclNlbGVjdG9yICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRyb290ID0gJHdjYXBmTmF2RmlsdGVycztcblx0XHR9XG5cblx0XHQkcm9vdC5maW5kKCAnLndjYXBmLWNob3Nlbi1zZWxlY3QnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyAgID0gJCggdGhpcyApO1xuXHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHtcblx0XHRcdFx0aW5oZXJpdF9zZWxlY3RfY2xhc3NlczogdHJ1ZSxcblx0XHRcdFx0aW5oZXJpdF9vcHRpb25fY2xhc3NlczogdHJ1ZSxcblx0XHRcdH07XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmlzX3J0bCApIHtcblx0XHRcdFx0b3B0aW9uc1sgJ3J0bCcgXSA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG5vUmVzdWx0c01lc3NhZ2UgPSAkdGhpcy5hdHRyKCAnZGF0YS1uby1yZXN1bHRzLW1lc3NhZ2UnICk7XG5cblx0XHRcdGlmICggbm9SZXN1bHRzTWVzc2FnZSApIHtcblx0XHRcdFx0b3B0aW9uc1sgJ25vX3Jlc3VsdHNfdGV4dCcgXSA9IG5vUmVzdWx0c01lc3NhZ2U7XG5cdFx0XHR9XG5cblx0XHRcdC8vIG9wdGlvbnNbICdkaXNhYmxlX3NlYXJjaCcgXSA9IHRydWU7XG5cblx0XHRcdGNvbnN0IHNlYXJjaFRocmVzaG9sZCA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuY2hvc2VuX2xpYl9zZWFyY2hfdGhyZXNob2xkICk7XG5cblx0XHRcdGlmICggc2VhcmNoVGhyZXNob2xkICkge1xuXHRcdFx0XHQvLyBvcHRpb25zWyAnZGlzYWJsZV9zZWFyY2hfdGhyZXNob2xkJyBdID0gc2VhcmNoVGhyZXNob2xkO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBvcHRpb25zWyAnZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJyBdID0gZmFsc2U7XG5cblx0XHRcdC8vIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiAyMFxuXG5cdFx0XHQvLyBvcHRpb25zWydtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCddID0gLTE7XG5cblx0XHRcdCR0aGlzLmNob3Nlbiggb3B0aW9ucyApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGluaXRDaG9zZW4oKTtcblxuXHQvLyBJbml0aWFsaXplIGhpZXJhcmNoeSBhY2NvcmRpb24uXG5cdGZ1bmN0aW9uIGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKSB7XG5cdFx0bGV0ICRyb290O1xuXG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZm9yX3ByZXZpZXcgKSB7XG5cdFx0XHQkcm9vdCA9ICQoIHdjYXBmTmF2RmlsdGVyU2VsZWN0b3IgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHJvb3QgPSAkd2NhcGZOYXZGaWx0ZXJzO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUFjY29yZGlvbiggJGVsICkge1xuXHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBidXR0b24gaXMgcHJlc3NlZFxuXHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdC8vIENoYW5nZSBhcmlhLXByZXNzZWQgdG8gdGhlIG9wcG9zaXRlIHN0YXRlXG5cdFx0XHQkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICEgcHJlc3NlZCApO1xuXG5cdFx0XHRjb25zdCAkY2hpbGQgPSAkZWwuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICk7XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24gKSB7XG5cdFx0XHRcdCRjaGlsZC5zbGlkZVRvZ2dsZShcblx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQsXG5cdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZ1xuXHRcdFx0XHQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGNoaWxkLnRvZ2dsZSgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdCRyb290LmZpbmQoICcud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnICkub24oICdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkKCB0aGlzICkgKTtcblx0XHR9ICk7XG5cblx0XHQkcm9vdC5maW5kKCAnLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJyApLm9uKCAna2V5ZG93bicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0aWYgKCBlLmtleSA9PT0gJyAnIHx8IGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnU3BhY2ViYXInICkge1xuXHRcdFx0XHQvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvbiB0byBzdG9wIHNjcm9sbGluZyB3aGVuIHNwYWNlIGlzIHByZXNzZWRcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdEhpZXJhcmNoeUFjY29yZGlvbigpO1xuXG5cdC8qKlxuXHQgKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNDE0MTgxM1xuXHQgKlxuXHQgKiBAcGFyYW0gbnVtYmVyXG5cdCAqIEBwYXJhbSBkZWNpbWFsc1xuXHQgKiBAcGFyYW0gZGVjX3BvaW50XG5cdCAqIEBwYXJhbSB0aG91c2FuZHNfc2VwXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9XG5cdCAqL1xuXHRmdW5jdGlvbiBudW1iZXJfZm9ybWF0KCBudW1iZXIsIGRlY2ltYWxzLCBkZWNfcG9pbnQsIHRob3VzYW5kc19zZXAgKSB7XG5cdFx0Ly8gU3RyaXAgYWxsIGNoYXJhY3RlcnMgYnV0IG51bWVyaWNhbCBvbmVzLlxuXHRcdG51bWJlciA9ICggbnVtYmVyICsgJycgKS5yZXBsYWNlKCAvW15cXGQrXFwtRWUuXS9nLCAnJyApO1xuXG5cdFx0Y29uc3QgbiAgICA9ICEgaXNGaW5pdGUoICtudW1iZXIgKSA/IDAgOiArbnVtYmVyO1xuXHRcdGNvbnN0IHByZWMgPSAhIGlzRmluaXRlKCArZGVjaW1hbHMgKSA/IDAgOiBNYXRoLmFicyggZGVjaW1hbHMgKTtcblx0XHRjb25zdCBzZXAgID0gKCB0eXBlb2YgdGhvdXNhbmRzX3NlcCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcsJyA6IHRob3VzYW5kc19zZXA7XG5cdFx0Y29uc3QgZGVjICA9ICggdHlwZW9mIGRlY19wb2ludCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcuJyA6IGRlY19wb2ludDtcblxuXHRcdGxldCBzO1xuXG5cdFx0Y29uc3QgdG9GaXhlZEZpeCA9IGZ1bmN0aW9uKCBuLCBwcmVjICkge1xuXHRcdFx0Y29uc3QgayA9IE1hdGgucG93KCAxMCwgcHJlYyApO1xuXHRcdFx0cmV0dXJuICcnICsgTWF0aC5yb3VuZCggbiAqIGsgKSAvIGs7XG5cdFx0fTtcblxuXHRcdC8vIEZpeCBmb3IgSUUgcGFyc2VGbG9hdCgwLjU1KS50b0ZpeGVkKDApID0gMDtcblx0XHRzID0gKCBwcmVjID8gdG9GaXhlZEZpeCggbiwgcHJlYyApIDogJycgKyBNYXRoLnJvdW5kKCBuICkgKS5zcGxpdCggJy4nICk7XG5cblx0XHRpZiAoIHNbIDAgXS5sZW5ndGggPiAzICkge1xuXHRcdFx0c1sgMCBdID0gc1sgMCBdLnJlcGxhY2UoIC9cXEIoPz0oPzpcXGR7M30pKyg/IVxcZCkpL2csIHNlcCApO1xuXHRcdH1cblxuXHRcdGlmICggKCBzWyAxIF0gfHwgJycgKS5sZW5ndGggPCBwcmVjICkge1xuXHRcdFx0c1sgMSBdID0gc1sgMSBdIHx8ICcnO1xuXHRcdFx0c1sgMSBdICs9IG5ldyBBcnJheSggcHJlYyAtIHNbIDEgXS5sZW5ndGggKyAxICkuam9pbiggJzAnICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHMuam9pbiggZGVjICk7XG5cdH1cblxuXHQvLyBJbml0aWFsaXplIG5vVUlTbGlkZXIuXG5cdGZ1bmN0aW9uIGluaXROb1VJU2xpZGVyKCkge1xuXHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCAkcm9vdDtcblxuXHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0JHJvb3QgPSAkKCB3Y2FwZk51bWJlclJhbmdlRmlsdGVyU2VsZWN0b3IgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHJvb3QgPSAkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnM7XG5cdFx0fVxuXG5cdFx0JHJvb3QuZmluZCggJy53Y2FwZi1yYW5nZS1zbGlkZXInICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0Ly8gVE9ETzogUmVtb3ZlIGZpbHRlciBrZXkuXG5cdFx0XHRjb25zdCBmaWx0ZXJLZXkgPSAkaXRlbS5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0Y29uc3QgJHNsaWRlciAgID0gJGl0ZW0uZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKTtcblxuXHRcdFx0Ly8gSWYgc2xpZGVyIGlzIGFscmVhZHkgaW5pdGlhbGl6ZWQgdGhlbiBkb24ndCByZWluaXRpYWxpemUgYWdhaW4uXG5cdFx0XHRpZiAoICRzbGlkZXIuaGFzQ2xhc3MoICd3Y2FwZi1ub3VpLXRhcmdldCcgKSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzbGlkZXJJZCAgICAgICAgICA9ICRzbGlkZXIuYXR0ciggJ2lkJyApO1xuXHRcdFx0Y29uc3QgZGlzcGxheVZhbHVlc0FzICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kaXNwbGF5LXZhbHVlcy1hcycgKTtcblx0XHRcdGNvbnN0IGZvcm1hdE51bWJlcnMgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZm9ybWF0LW51bWJlcnMnICk7XG5cdFx0XHRjb25zdCByYW5nZU1pblZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdGNvbnN0IHN0ZXAgICAgICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtc3RlcCcgKSApO1xuXHRcdFx0Y29uc3QgZGVjaW1hbFBsYWNlcyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRcdGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gJGl0ZW0uYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdFx0Y29uc3QgZGVjaW1hbFNlcGFyYXRvciAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXNlcGFyYXRvcicgKTtcblx0XHRcdGNvbnN0IG1pblZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWluLXZhbHVlJyApICk7XG5cdFx0XHRjb25zdCBtYXhWYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1heC12YWx1ZScgKSApO1xuXHRcdFx0Y29uc3QgJG1pblZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1pbi12YWx1ZScgKTtcblx0XHRcdGNvbnN0ICRtYXhWYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5tYXgtdmFsdWUnICk7XG5cblx0XHRcdGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBzbGlkZXJJZCApO1xuXG5cdFx0XHRub1VpU2xpZGVyLmNyZWF0ZSggc2xpZGVyLCB7XG5cdFx0XHRcdHN0YXJ0OiBbIG1pblZhbHVlLCBtYXhWYWx1ZSBdLFxuXHRcdFx0XHRzdGVwLFxuXHRcdFx0XHRjb25uZWN0OiB0cnVlLFxuXHRcdFx0XHRjc3NQcmVmaXg6ICd3Y2FwZi1ub3VpLScsXG5cdFx0XHRcdHJhbmdlOiB7XG5cdFx0XHRcdFx0J21pbic6IHJhbmdlTWluVmFsdWUsXG5cdFx0XHRcdFx0J21heCc6IHJhbmdlTWF4VmFsdWUsXG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICd1cGRhdGUnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHRsZXQgbWluVmFsdWU7XG5cdFx0XHRcdGxldCBtYXhWYWx1ZTtcblxuXHRcdFx0XHRpZiAoIGZvcm1hdE51bWJlcnMgKSB7XG5cdFx0XHRcdFx0bWluVmFsdWUgPSBudW1iZXJfZm9ybWF0KCB2YWx1ZXNbIDAgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0XHRtYXhWYWx1ZSA9IG51bWJlcl9mb3JtYXQoIHZhbHVlc1sgMSBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1pblZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAwIF0gKTtcblx0XHRcdFx0XHRtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMSBdICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoICdwbGFpbl90ZXh0JyA9PT0gZGlzcGxheVZhbHVlc0FzICkge1xuXHRcdFx0XHRcdCRtaW5WYWx1ZS5odG1sKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdCRtYXhWYWx1ZS5odG1sKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRtaW5WYWx1ZS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0JG1heFZhbHVlLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1ub3Vpc2xpZGVyLXVwZGF0ZScsIFsgJGl0ZW0sIHZhbHVlcyBdICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGZ1bmN0aW9uIGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApIHtcblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZm9yX3ByZXZpZXcgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgbWluVmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDAgXSApO1xuXHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMSBdICk7XG5cblx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHQvLyBSZW1vdmUgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdHJlcXVlc3RGaWx0ZXIoICRpdGVtLmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRjb25zdCB1cmwgPSAkaXRlbS5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclMXMnLCBtaW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdHJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGl0ZW0uZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICk7XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JG1pblZhbHVlLm9uKCAnaW5wdXQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG1pblZhbHVlLCBudWxsIF0gKTtcblxuXHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JG1heFZhbHVlLm9uKCAnaW5wdXQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG51bGwsIG1heFZhbHVlIF0gKTtcblxuXHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cblxuXHRpbml0Tm9VSVNsaWRlcigpO1xuXG5cdGZ1bmN0aW9uIGZpbHRlckJ5RGF0ZSggJGlucHV0ICkge1xuXHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICR3Y2FwZkRhdGVGaWx0ZXIgPSAkaW5wdXQuY2xvc2VzdCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXHRcdGNvbnN0IGZpbHRlcktleSAgICAgICAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0Y29uc3QgaXNSYW5nZSAgICAgICAgICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtaXMtcmFuZ2UnICk7XG5cblx0XHRsZXQgZmlsdGVyVmFsdWUgPSAnJztcblx0XHRsZXQgcnVuRmlsdGVyICAgPSBmYWxzZTtcblxuXHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdGNsZWFyVGltZW91dCggJHdjYXBmRGF0ZUZpbHRlci5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdGlmICggaXNSYW5nZSApIHtcblx0XHRcdGNvbnN0IGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgdG8gICA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLXRvLWlucHV0JyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoIGZyb20gJiYgdG8gKSB7XG5cdFx0XHRcdGZpbHRlclZhbHVlID0gZnJvbSArIHJhbmdlVmFsdWVzU2VwYXJhdG9yICsgdG87XG5cdFx0XHRcdHJ1bkZpbHRlciAgID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSBpZiAoICEgZnJvbSAmJiAhIHRvICkge1xuXHRcdFx0XHRydW5GaWx0ZXIgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBmcm9tID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCBmcm9tICkge1xuXHRcdFx0XHRmaWx0ZXJWYWx1ZSA9IGZyb207XG5cdFx0XHRcdHJ1bkZpbHRlciAgID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJ1bkZpbHRlciA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCBydW5GaWx0ZXIgKSB7XG5cdFx0XHQkd2NhcGZEYXRlRmlsdGVyLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkd2NhcGZEYXRlRmlsdGVyLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRpZiAoIGZpbHRlclZhbHVlICkge1xuXHRcdFx0XHRcdHVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc3QgcXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHR9LCBkZWxheSApICk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdERhdGVwaWNrZXIoKSB7XG5cdFx0aWYgKCAhIGpRdWVyeSgpLmRhdGVwaWNrZXIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0ICRyb290O1xuXG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZm9yX3ByZXZpZXcgKSB7XG5cdFx0XHQkcm9vdCA9ICQoIHdjYXBmRGF0ZUZpbHRlclNlbGVjdG9yICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRyb290ID0gJHdjYXBmRGF0ZUZpbHRlcnM7XG5cdFx0fVxuXG5cdFx0Y29uc3QgJHdjYXBmRGF0ZUZpbHRlciA9ICRyb290LmZpbmQoICcud2NhcGYtZGF0ZS1pbnB1dCcgKTtcblxuXHRcdGNvbnN0IGZvcm1hdCAgICAgICAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtZm9ybWF0JyApO1xuXHRcdGNvbnN0IHllYXJEcm9wZG93biAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtcGlja2VyLXllYXItZHJvcGRvd24nICk7XG5cdFx0Y29uc3QgbW9udGhEcm9wZG93biA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1waWNrZXItbW9udGgtZHJvcGRvd24nICk7XG5cblx0XHRjb25zdCAkZnJvbSA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICk7XG5cdFx0Y29uc3QgJHRvICAgPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKTtcblxuXHRcdCRmcm9tLmRhdGVwaWNrZXIoIHtcblx0XHRcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdGNoYW5nZU1vbnRoOiBtb250aERyb3Bkb3duLFxuXHRcdH0gKTtcblxuXHRcdCR0by5kYXRlcGlja2VyKCB7XG5cdFx0XHRkYXRlRm9ybWF0OiBmb3JtYXQsXG5cdFx0XHRjaGFuZ2VZZWFyOiB5ZWFyRHJvcGRvd24sXG5cdFx0XHRjaGFuZ2VNb250aDogbW9udGhEcm9wZG93bixcblx0XHR9ICk7XG5cblx0XHQkZnJvbS5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0ZmlsdGVyQnlEYXRlKCAkaW5wdXQgKTtcblx0XHR9ICk7XG5cblx0XHQkdG8ub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblx0XHRcdGZpbHRlckJ5RGF0ZSggJGlucHV0ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdERhdGVwaWNrZXIoKTtcblxuXHRmdW5jdGlvbiBpbml0RGVmYXVsdE9yZGVyQnkoKSB7XG5cdFx0Ly8gQXR0YWNoIGNob3Nlbi5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5hdHRhY2hfY2hvc2VuX29uX3NvcnRpbmcgKSB7XG5cdFx0XHRpZiAoIGpRdWVyeSgpLmNob3NlbiApIHtcblx0XHRcdFx0JGJvZHkuZmluZCggJy53b29jb21tZXJjZS1vcmRlcmluZyBzZWxlY3Qub3JkZXJieScgKS5jaG9zZW4oIHtcblx0XHRcdFx0XHQnZGlzYWJsZV9zZWFyY2hfdGhyZXNob2xkJzogMTUsXG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLnNvcnRpbmdfY29udHJvbCApIHtcblx0XHRcdCRib2R5LmZpbmQoICcud29vY29tbWVyY2Utb3JkZXJpbmcnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRvcmRlcmluZ0Zvcm0gPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0JG9yZGVyaW5nRm9ybS5vbiggJ2NoYW5nZScsICdzZWxlY3Qub3JkZXJieScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRvcmRlcmluZ0Zvcm0uc3VibWl0KCk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIHRvZG86IGNoZWNrIGlmIGFqYXggZGlzYWJsZWQuXG5cdFx0JGJvZHkuZmluZCggJy53b29jb21tZXJjZS1vcmRlcmluZycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRvcmRlcmluZ0Zvcm0gPSAkKCB0aGlzICk7XG5cblx0XHRcdCRvcmRlcmluZ0Zvcm0ub24oICdzdWJtaXQnLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQkb3JkZXJpbmdGb3JtLm9uKCAnY2hhbmdlJywgJ3NlbGVjdC5vcmRlcmJ5JywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCBvcmRlciAgICAgID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJfa2V5ID0gJ29yZGVyYnknO1xuXG5cdFx0XHRcdHVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJfa2V5LCBvcmRlciApO1xuXHRcdFx0XHRmaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGluaXREZWZhdWx0T3JkZXJCeSgpO1xuXG5cdGZ1bmN0aW9uIHVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQoICRyZXN1bHRzICkge1xuXHRcdGNvbnN0IHNlbGVjdG9yID0gJy53b29jb21tZXJjZS1yZXN1bHQtY291bnQnO1xuXG5cdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmZpbmQoIHNlbGVjdG9yICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IG5ld1Byb2R1Y3RDb3VudCA9ICRyZXN1bHRzLmZpbmQoIHNlbGVjdG9yICkuaHRtbCgpO1xuXG5cdFx0JGJvZHkuZmluZCggc2VsZWN0b3IgKS5odG1sKCBuZXdQcm9kdWN0Q291bnQgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNob3dMb2FkaW5nQW5pbWF0aW9uKCkge1xuXHRcdGlmICggISB3Y2FwZl9wYXJhbXMubG9hZGluZ19hbmltYXRpb24gKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JC5Mb2FkaW5nT3ZlcmxheSggJ3Nob3cnLCB3Y2FwZl9wYXJhbXMubG9hZGluZ19vdmVybGF5X29wdGlvbnMgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGRpc2FibGVOb1VpU2xpZGVycygpIHtcblx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMuZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbiggZSwgZWxlbWVudCApIHtcblx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKCAnZGlzYWJsZWQnLCB0cnVlICk7XG5cdFx0fSApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzYWJsZUxhYmVscygpIHtcblx0XHRjb25zdCBzZWxlY3RvcnMgPSAnLndjYXBmLWxhYmVsZWQtbmF2IC5pdGVtLCAud2NhcGYtYWN0aXZlLWZpbHRlcnMgLml0ZW0nO1xuXG5cdFx0Ly8gVE9ETzogQWRkIGRpc2FibGVkIGF0dHJpYnV0ZS5cblx0XHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmZpbmQoIHNlbGVjdG9ycyApLmFkZENsYXNzKCAnZGlzYWJsZWQnICk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNhYmxlSW5wdXRzKCkge1xuXHRcdGlmICggISB3Y2FwZl9wYXJhbXMuZGlzYWJsZV9pbnB1dHNfd2hpbGVfZmV0Y2hpbmdfcmVzdWx0cyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpbnB1dHMgPSAnaW5wdXQsIHNlbGVjdCc7XG5cblx0XHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmZpbmQoIGlucHV0cyApLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmZpbmQoIGlucHV0cyApLnRyaWdnZXIoICdjaG9zZW46dXBkYXRlZCcgKTtcblxuXHRcdGRpc2FibGVOb1VpU2xpZGVycygpO1xuXHRcdGRpc2FibGVMYWJlbHMoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGVuYWJsZU5vVWlTbGlkZXJzKCkge1xuXHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCR3Y2FwZk51bWJlclJhbmdlRmlsdGVycy5maW5kKCAnLndjYXBmLW5vdWktc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCBlLCBlbGVtZW50ICkge1xuXHRcdFx0ZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoICdkaXNhYmxlZCcgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRmdW5jdGlvbiBlbmFibGVJbnB1dHMoKSB7XG5cdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5kaXNhYmxlX2lucHV0c193aGlsZV9mZXRjaGluZ19yZXN1bHRzICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGlucHV0cyA9ICdpbnB1dCc7XG5cblx0XHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMuZmluZCggaW5wdXRzICkucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdCR3Y2FwZkRhdGVGaWx0ZXJzLmZpbmQoIGlucHV0cyApLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblxuXHRcdGVuYWJsZU5vVWlTbGlkZXJzKCk7XG5cdH1cblxuXHRmdW5jdGlvbiByZXNldExvYWRpbmdBbmltYXRpb24oKSB7XG5cdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5sb2FkaW5nX2FuaW1hdGlvbiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkLkxvYWRpbmdPdmVybGF5KCAnaGlkZScgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNjcm9sbFRvKCkge1xuXHRcdGlmICggJ25vbmUnID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvdyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBzY3JvbGxGb3IgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19mb3I7XG5cdFx0Y29uc3QgaXNNb2JpbGUgID0gd2NhcGZfcGFyYW1zLmlzX21vYmlsZTtcblx0XHRsZXQgcHJvY2VlZCAgICAgPSBmYWxzZTtcblxuXHRcdGlmICggJ21vYmlsZScgPT09IHNjcm9sbEZvciAmJiBpc01vYmlsZSApIHtcblx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdH0gZWxzZSBpZiAoICdkZXNrdG9wJyA9PT0gc2Nyb2xsRm9yICYmICEgaXNNb2JpbGUgKSB7XG5cdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKCAnYm90aCcgPT09IHNjcm9sbEZvciApIHtcblx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICggISBwcm9jZWVkICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCBhZGp1c3RpbmdPZmZzZXQsIG9mZnNldDtcblxuXHRcdGlmICggd2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfb2Zmc2V0ICkge1xuXHRcdFx0YWRqdXN0aW5nT2Zmc2V0ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX29mZnNldCApO1xuXHRcdH1cblxuXHRcdGxldCBjb250YWluZXI7XG5cblx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXI7XG5cdFx0fSBlbHNlIGlmICggJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lcjtcblx0XHR9XG5cblx0XHRpZiAoICdjdXN0b20nID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvdyApIHtcblx0XHRcdGNvbnRhaW5lciA9IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50O1xuXHRcdH1cblxuXHRcdGNvbnN0ICRjb250YWluZXIgPSAkKCBjb250YWluZXIgKTtcblxuXHRcdGlmICggJGNvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRvZmZzZXQgPSAkY29udGFpbmVyLm9mZnNldCgpLnRvcCAtIGFkanVzdGluZ09mZnNldDtcblxuXHRcdFx0aWYgKCBvZmZzZXQgPCAwICkge1xuXHRcdFx0XHRvZmZzZXQgPSAwO1xuXHRcdFx0fVxuXG5cdFx0XHQkKCAnaHRtbCwgYm9keScgKS5zdG9wKCkuYW5pbWF0ZShcblx0XHRcdFx0eyBzY3JvbGxUb3A6IG9mZnNldCB9LFxuXHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9zcGVlZCxcblx0XHRcdFx0d2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3BfZWFzaW5nXG5cdFx0XHQpO1xuXHRcdH1cblx0fVxuXG5cdC8vIFRoaW5ncyBhcmUgZG9uZSBiZWZvcmUgZmV0Y2hpbmcgdGhlIHByb2R1Y3RzIGxpa2Ugc2hvd2luZyBhIGxvYWRpbmcgaW5kaWNhdG9yLlxuXHRmdW5jdGlvbiBiZWZvcmVGZXRjaGluZ1Byb2R1Y3RzKCkge1xuXHRcdGRpc2FibGVJbnB1dHMoKTtcblx0XHRzaG93TG9hZGluZ0FuaW1hdGlvbigpO1xuXG5cdFx0aWYgKCAnaW1tZWRpYXRlbHknID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd193aGVuICkge1xuXHRcdFx0c2Nyb2xsVG8oKTtcblx0XHR9XG5cblx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGZfYmVmb3JlX2ZldGNoaW5nX3Byb2R1Y3RzJyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gYmVmb3JlVXBkYXRpbmdQcm9kdWN0cyggJHJlc3VsdHMgKSB7XG5cdFx0cmVzZXRMb2FkaW5nQW5pbWF0aW9uKCk7XG5cblx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGZfYmVmb3JlX3VwZGF0aW5nX3Byb2R1Y3RzJywgWyAkcmVzdWx0cyBdICk7XG5cdH1cblxuXHQvLyBUaGluZ3MgYXJlIGRvbmUgYWZ0ZXIgYXBwbHlpbmcgdGhlIGZpbHRlciBsaWtlIHNjcm9sbCB0byB0b3AuXG5cdGZ1bmN0aW9uIGFmdGVyVXBkYXRpbmdQcm9kdWN0cyggJHJlc3VsdHMgKSB7XG5cdFx0aW5pdENob3NlbigpO1xuXHRcdGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKTtcblx0XHRpbml0Tm9VSVNsaWRlcigpO1xuXHRcdGluaXREYXRlcGlja2VyKCk7XG5cdFx0aW5pdERlZmF1bHRPcmRlckJ5KCk7XG5cdFx0dXBkYXRlUHJvZHVjdHNDb3VudFJlc3VsdCggJHJlc3VsdHMgKTtcblx0XHRlbmFibGVJbnB1dHMoKTtcblxuXHRcdGlmICggJ2FmdGVyJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfd2hlbiApIHtcblx0XHRcdHNjcm9sbFRvKCk7XG5cdFx0fVxuXG5cdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2FmdGVyX3VwZGF0aW5nX3Byb2R1Y3RzJywgWyAkcmVzdWx0cyBdICk7XG5cdH1cblxuXHQvLyBUaGUgbWFpbiBmaWx0ZXIgZnVuY3Rpb24uXG5cdGZ1bmN0aW9uIGZpbHRlclByb2R1Y3RzKCBmb3JjZVJlUmVuZGVyID0gZmFsc2UgKSB7XG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZm9yX3ByZXZpZXcgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0YmVmb3JlRmV0Y2hpbmdQcm9kdWN0cygpO1xuXG5cdFx0JC5nZXQoIHdpbmRvdy5sb2NhdGlvbi5ocmVmLCBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdGNvbnN0ICRkYXRhID0gJCggZGF0YSApO1xuXG5cdFx0XHQvLyBSZXBsYWNlIHRoZSBmaWVsZHMnIGRhdGEgd2l0aCBuZXcgZGF0YS5cblx0XHRcdCQuZWFjaCggZmllbGRzLCBmdW5jdGlvbiggaWQgKSB7XG5cdFx0XHRcdGNvbnN0IGZpZWxkSUQgICAgPSAnW2RhdGEtaWQ9XCInICsgaWQgKyAnXCJdJztcblx0XHRcdFx0Y29uc3QgJGZpZWxkICAgICA9ICQoIGZpZWxkSUQgKTtcblx0XHRcdFx0Y29uc3QgJGlubmVyICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZpZWxkLWlubmVyJyApO1xuXHRcdFx0XHRjb25zdCBfZmllbGQgICAgID0gJGRhdGEuZmluZCggZmllbGRJRCApO1xuXHRcdFx0XHRsZXQgZmllbGRDbGFzc2VzID0gJCggX2ZpZWxkICkuYXR0ciggJ2NsYXNzJyApO1xuXG5cdFx0XHRcdC8vIFByZXNlcnZlIGhpZXJhcmNoeSBhY2NvcmRpb24gc3RhdGUuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUgKSB7XG5cdFx0XHRcdFx0aWYgKCAkZmllbGQuaGFzQ2xhc3MoICdoaWVyYXJjaHktYWNjb3JkaW9uJyApICkge1xuXHRcdFx0XHRcdFx0JGZpZWxkLmZpbmQoICcuaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUuYWN0aXZlJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBpdGVtVmFsdWUgICAgICA9ICQoIHRoaXMgKS5wYXJlbnQoKS5jaGlsZHJlbiggJ2lucHV0JyApLnZhbCgpO1xuXHRcdFx0XHRcdFx0XHRjb25zdCB0b2dnbGVTZWxlY3RvciA9ICdpbnB1dFt2YWx1ZT1cIicgKyBpdGVtVmFsdWUgKyAnXCJdIH4gLmhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJztcblx0XHRcdFx0XHRcdFx0Y29uc3QgdWxTZWxlY3RvciAgICAgPSAnaW5wdXRbdmFsdWU9XCInICsgaXRlbVZhbHVlICsgJ1wiXSB+IHVsJztcblx0XHRcdFx0XHRcdFx0Y29uc3QgX2NsYXNzZXMgICAgICAgPSAnaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUgYWN0aXZlJztcblxuXHRcdFx0XHRcdFx0XHRfZmllbGQuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5hdHRyKCAnY2xhc3MnLCBfY2xhc3NlcyApO1xuXHRcdFx0XHRcdFx0XHRfZmllbGQuZmluZCggdWxTZWxlY3RvciApLnNob3coKTtcblx0XHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBfaHRtbCA9IF9maWVsZC5maW5kKCAnLndjYXBmLWZpZWxkLWlubmVyJyApLmh0bWwoKTtcblxuXHRcdFx0XHQvLyBTaG93IHNvZnQgbGltaXQgaXRlbXMuXG5cdFx0XHRcdGNvbnN0IHNvZnRMaW1pdFNlbGVjdG9yID0gJ3Nob3ctaGlkZGVuLWl0ZW1zJztcblxuXHRcdFx0XHRpZiAoICRmaWVsZC5oYXNDbGFzcyggc29mdExpbWl0U2VsZWN0b3IgKSApIHtcblx0XHRcdFx0XHRpZiAoICEgX2ZpZWxkLmhhc0NsYXNzKCBzb2Z0TGltaXRTZWxlY3RvciApICkge1xuXHRcdFx0XHRcdFx0ZmllbGRDbGFzc2VzICs9ICcgJyArIHNvZnRMaW1pdFNlbGVjdG9yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRmaWVsZENsYXNzZXMgPSBmaWVsZENsYXNzZXMucmVwbGFjZSggc29mdExpbWl0U2VsZWN0b3IsICcnICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBVcGRhdGUgdGhlIGZpZWxkJ3MgY2xhc3MuXG5cdFx0XHRcdCRmaWVsZC5hdHRyKCAnY2xhc3MnLCBmaWVsZENsYXNzZXMudHJpbSgpICk7XG5cblx0XHRcdFx0Ly8gV2hlbiBjYWxsZWQgZnJvbSBoaXN0b3J5IGJhY2sgb3IgZm9yd2FyZCByZXF1ZXN0IHRoZW4gcmVyZW5kZXIgYWxsIGZpZWxkcy5cblx0XHRcdFx0aWYgKCBmb3JjZVJlUmVuZGVyICkge1xuXG5cdFx0XHRcdFx0Ly8gdXBkYXRlIGZpZWxkXG5cdFx0XHRcdFx0JGlubmVyLmh0bWwoIF9odG1sICk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdC8vIFNlbGVjdGl2ZWx5IHJlcmVuZGVyIHRoZSBmaWVsZHMuXG5cdFx0XHRcdFx0aWYgKCAkZmllbGQuaGFzQ2xhc3MoICd3Y2FwZi1uYXYtZmlsdGVyJyApICkge1xuXG5cdFx0XHRcdFx0XHQvLyB1cGRhdGUgZmllbGRcblx0XHRcdFx0XHRcdCRpbm5lci5odG1sKCBfaHRtbCApO1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkZmllbGQudHJpZ2dlciggJ3djYXBmLWZpZWxkLXVwZGF0ZWQnLCBbIF9maWVsZCBdICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGJlZm9yZVVwZGF0aW5nUHJvZHVjdHMoICRkYXRhICk7XG5cblx0XHRcdC8vIFJlcGxhY2Ugb2xkIHNob3AgbG9vcCB3aXRoIG5ldyBvbmUuXG5cdFx0XHRjb25zdCAkc2hvcExvb3BDb250YWluZXIgPSAkZGF0YS5maW5kKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0Y29uc3QgJG5vdEZvdW5kQ29udGFpbmVyID0gJGRhdGEuZmluZCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKTtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciA9PT0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKSB7XG5cdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGFmdGVyVXBkYXRpbmdQcm9kdWN0cyggJGRhdGEgKTtcblx0XHR9ICk7XG5cdH1cblxuXHQvLyBVUkwgUGFyc2VyXG5cdGZ1bmN0aW9uIGdldFVybFZhcnMoIHVybCApIHtcblx0XHRsZXQgdmFycyA9IHt9LCBoYXNoO1xuXG5cdFx0aWYgKCB0eXBlb2YgdXJsID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdH1cblxuXHRcdHVybCA9IHVybC5yZXBsYWNlQWxsKCAnJTJDJywgJywnICk7XG5cblx0XHRjb25zdCBoYXNoZXMgID0gdXJsLnNsaWNlKCB1cmwuaW5kZXhPZiggJz8nICkgKyAxICkuc3BsaXQoICcmJyApO1xuXHRcdGNvbnN0IGhMZW5ndGggPSBoYXNoZXMubGVuZ3RoO1xuXG5cdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgaExlbmd0aDsgaSsrICkge1xuXHRcdFx0aGFzaCA9IGhhc2hlc1sgaSBdLnNwbGl0KCAnPScgKTtcblxuXHRcdFx0dmFyc1sgaGFzaFsgMCBdIF0gPSBoYXNoWyAxIF07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHZhcnM7XG5cdH1cblxuXHQvLyBldmVyeXRpbWUgd2UgYXBwbHkgdGhlIGZpbHRlciB3ZSBzZXQgdGhlIGN1cnJlbnQgcGFnZSB0byAxXG5cdGZ1bmN0aW9uIGZpeFBhZ2luYXRpb24oKSB7XG5cdFx0bGV0IHVybCAgICAgICAgICAgICAgICA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdGNvbnN0IHBhcmFtcyAgICAgICAgICAgPSBnZXRVcmxWYXJzKCB1cmwgKTtcblx0XHRjb25zdCBjdXJyZW50UGFnZUluVXJsID0gcGFyc2VJbnQoIHVybC5yZXBsYWNlKCAvLitcXC9wYWdlXFwvKFxcZCspKy8sICckMScgKSApO1xuXG5cdFx0aWYgKCBjdXJyZW50UGFnZUluVXJsICkge1xuXHRcdFx0aWYgKCBjdXJyZW50UGFnZUluVXJsID4gMSApIHtcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoIC9wYWdlXFwvKFxcZCspLywgJ3BhZ2UvMScgKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKCB0eXBlb2YgcGFyYW1zWyAncGFnZWQnIF0gIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0Y29uc3QgY3VycmVudFBhZ2VJblBhcmFtcyA9IHBhcnNlSW50KCBwYXJhbXNbICdwYWdlZCcgXSApO1xuXG5cdFx0XHRpZiAoIGN1cnJlbnRQYWdlSW5QYXJhbXMgPiAxICkge1xuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSggJ3BhZ2VkPScgKyBjdXJyZW50UGFnZUluUGFyYW1zLCAncGFnZWQ9MScgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdXJsO1xuXHR9XG5cblx0Ly8gdXBkYXRlIHF1ZXJ5IHN0cmluZyBmb3IgY2F0ZWdvcmllcywgbWV0YSBldGMuLlxuXHRmdW5jdGlvbiB1cGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlcigga2V5LCB2YWx1ZSwgcHVzaEhpc3RvcnksIHVybCApIHtcblx0XHRpZiAoIHR5cGVvZiBwdXNoSGlzdG9yeSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRwdXNoSGlzdG9yeSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKCB0eXBlb2YgdXJsID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHVybCA9IGZpeFBhZ2luYXRpb24oKTtcblx0XHR9XG5cblx0XHRjb25zdCByZSAgICAgICAgPSBuZXcgUmVnRXhwKCAnKFs/Jl0pJyArIGtleSArICc9Lio/KCZ8JCknLCAnaScgKTtcblx0XHRjb25zdCBzZXBhcmF0b3IgPSB1cmwuaW5kZXhPZiggJz8nICkgIT09IC0xID8gJyYnIDogJz8nO1xuXHRcdGxldCB1cmxXaXRoUXVlcnk7XG5cblx0XHRpZiAoIHVybC5tYXRjaCggcmUgKSApIHtcblx0XHRcdHVybFdpdGhRdWVyeSA9IHVybC5yZXBsYWNlKCByZSwgJyQxJyArIGtleSArICc9JyArIHZhbHVlICsgJyQyJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR1cmxXaXRoUXVlcnkgPSB1cmwgKyBzZXBhcmF0b3IgKyBrZXkgKyAnPScgKyB2YWx1ZTtcblx0XHR9XG5cblx0XHRpZiAoIHB1c2hIaXN0b3J5ID09PSB0cnVlICkge1xuXHRcdFx0cmV0dXJuIGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHVybFdpdGhRdWVyeSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdXJsV2l0aFF1ZXJ5O1xuXHRcdH1cblx0fVxuXG5cdC8vIHJlbW92ZSBwYXJhbWV0ZXIgZnJvbSB1cmxcblx0ZnVuY3Rpb24gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgdXJsICkge1xuXHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHR1cmwgPSBmaXhQYWdpbmF0aW9uKCk7XG5cdFx0fVxuXG5cdFx0Y29uc3Qgb2xkUGFyYW1zICAgICAgICAgPSBnZXRVcmxWYXJzKCB1cmwgKTtcblx0XHRjb25zdCBvbGRQYXJhbXNMZW5ndGggICA9IE9iamVjdC5rZXlzKCBvbGRQYXJhbXMgKS5sZW5ndGg7XG5cdFx0Y29uc3Qgc3RhcnRQb3NpdGlvbiAgICAgPSB1cmwuaW5kZXhPZiggJz8nICk7XG5cdFx0Y29uc3QgZmlsdGVyS2V5UG9zaXRpb24gPSB1cmwuaW5kZXhPZiggZmlsdGVyS2V5ICk7XG5cdFx0bGV0IGNsZWFuVXJsLCBjbGVhblF1ZXJ5O1xuXG5cdFx0aWYgKCBvbGRQYXJhbXNMZW5ndGggPiAxICkge1xuXHRcdFx0aWYgKCAoIGZpbHRlcktleVBvc2l0aW9uIC0gc3RhcnRQb3NpdGlvbiApID4gMSApIHtcblx0XHRcdFx0Y2xlYW5VcmwgPSB1cmwucmVwbGFjZSggJyYnICsgZmlsdGVyS2V5ICsgJz0nICsgb2xkUGFyYW1zWyBmaWx0ZXJLZXkgXSwgJycgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNsZWFuVXJsID0gdXJsLnJlcGxhY2UoIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0gKyAnJicsICcnICk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG5ld1BhcmFtcyA9IGNsZWFuVXJsLnNwbGl0KCAnPycgKTtcblx0XHRcdGNsZWFuUXVlcnkgICAgICA9ICc/JyArIG5ld1BhcmFtc1sgMSBdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjbGVhblF1ZXJ5ID0gdXJsLnJlcGxhY2UoICc/JyArIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0sICcnICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNsZWFuUXVlcnk7XG5cdH1cblxuXHQvLyB0YWtlIHRoZSBrZXkgYW5kIHZhbHVlIGFuZCBtYWtlIHF1ZXJ5XG5cdGZ1bmN0aW9uIG1ha2VQYXJhbWV0ZXJzKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlLCBmb3JjZVJlcmVuZGVyID0gZmFsc2UsIHVybCApIHtcblx0XHRjb25zdCB2YWx1ZVNlcGFyYXRvciA9ICcsJztcblxuXHRcdGxldCBwYXJhbXMsIG5leHRWYWx1ZXMsIGVtcHR5VmFsdWUgPSBmYWxzZTtcblxuXHRcdGlmICggdHlwZW9mIHVybCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRwYXJhbXMgPSBnZXRVcmxWYXJzKCB1cmwgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cGFyYW1zID0gZ2V0VXJsVmFycygpO1xuXHRcdH1cblxuXHRcdGlmICggdHlwZW9mIHBhcmFtc1sgZmlsdGVyS2V5IF0gIT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRjb25zdCBwcmV2VmFsdWVzICAgICAgPSBwYXJhbXNbIGZpbHRlcktleSBdO1xuXHRcdFx0Y29uc3QgcHJldlZhbHVlc0FycmF5ID0gcHJldlZhbHVlcy5zcGxpdCggdmFsdWVTZXBhcmF0b3IgKTtcblxuXHRcdFx0aWYgKCBwcmV2VmFsdWVzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdGNvbnN0IGZvdW5kID0gJC5pbkFycmF5KCBmaWx0ZXJWYWx1ZSwgcHJldlZhbHVlc0FycmF5ICk7XG5cblx0XHRcdFx0aWYgKCBmb3VuZCA+PSAwICkge1xuXHRcdFx0XHRcdC8vIEVsZW1lbnQgd2FzIGZvdW5kLCByZW1vdmUgaXQuXG5cdFx0XHRcdFx0cHJldlZhbHVlc0FycmF5LnNwbGljZSggZm91bmQsIDEgKTtcblxuXHRcdFx0XHRcdGlmICggcHJldlZhbHVlc0FycmF5Lmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdFx0XHRcdGVtcHR5VmFsdWUgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBFbGVtZW50IHdhcyBub3QgZm91bmQsIGFkZCBpdC5cblx0XHRcdFx0XHRwcmV2VmFsdWVzQXJyYXkucHVzaCggZmlsdGVyVmFsdWUgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggcHJldlZhbHVlc0FycmF5Lmxlbmd0aCA+IDEgKSB7XG5cdFx0XHRcdFx0bmV4dFZhbHVlcyA9IHByZXZWYWx1ZXNBcnJheS5qb2luKCB2YWx1ZVNlcGFyYXRvciApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBwcmV2VmFsdWVzQXJyYXk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5leHRWYWx1ZXMgPSBmaWx0ZXJWYWx1ZTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0bmV4dFZhbHVlcyA9IGZpbHRlclZhbHVlO1xuXHRcdH1cblxuXHRcdC8vIHVwZGF0ZSB1cmwgYW5kIHF1ZXJ5IHN0cmluZ1xuXHRcdGlmICggISBlbXB0eVZhbHVlICkge1xuXHRcdFx0dXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgbmV4dFZhbHVlcyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0fVxuXG5cdFx0ZmlsdGVyUHJvZHVjdHMoIGZvcmNlUmVyZW5kZXIgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNpbmdsZUZpbHRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRjb25zdCBwYXJhbXMgPSBnZXRVcmxWYXJzKCk7XG5cdFx0bGV0IHF1ZXJ5O1xuXG5cdFx0aWYgKCB0eXBlb2YgcGFyYW1zWyBmaWx0ZXJLZXkgXSAhPT0gJ3VuZGVmaW5lZCcgJiYgcGFyYW1zWyBmaWx0ZXJLZXkgXSA9PT0gZmlsdGVyVmFsdWUgKSB7XG5cdFx0XHRxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cXVlcnkgPSB1cGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSwgZmFsc2UgKTtcblx0XHR9XG5cblx0XHQvLyB1cGRhdGUgdXJsXG5cdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdGZpbHRlclByb2R1Y3RzKCk7XG5cdH1cblxuXHQvLyBIYW5kbGUgdGhlIHBhZ2luYXRpb24gcmVxdWVzdCB2aWEgYWpheC5cblx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXggJiYgd2NhcGZfcGFyYW1zLnBhZ2luYXRpb25fY29udGFpbmVyICkge1xuXHRcdGNvbnN0ICRjb250YWluZXIgPSAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdGNvbnN0IHNlbGVjdG9yICAgPSB3Y2FwZl9wYXJhbXMucGFnaW5hdGlvbl9jb250YWluZXIgKyAnIGEnO1xuXG5cdFx0Ly8gdG9kbzogY2hlY2sgaWYgYWpheCBkaXNhYmxlZC5cblx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0JGNvbnRhaW5lci5vbiggJ2NsaWNrJywgc2VsZWN0b3IsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgbG9jYXRpb24gPSAkKCB0aGlzICkuYXR0ciggJ2hyZWYnICk7XG5cblx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgbG9jYXRpb24gKTtcblxuXHRcdFx0XHRmaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0fSApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgdGhlIGNvbW1vbiBmaWx0ZXIgcmVxdWVzdHMuXG5cdGZ1bmN0aW9uIGhhbmRsZUZpbHRlclJlcXVlc3QoICRpdGVtLCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgICAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtc2luZ2xlLWZpbHRlcicgKTtcblx0XHRjb25zdCBmaWVsZElEICAgICAgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRjb25zdCBmaWVsZERhdGEgICAgICA9IGZpZWxkc1sgZmllbGRJRCBdO1xuXHRcdGNvbnN0IGZpbHRlcktleSAgICAgID0gZmllbGREYXRhLmZpbHRlcktleTtcblx0XHRjb25zdCBtdWx0aXBsZUZpbHRlciA9IGZpZWxkRGF0YS5tdWx0aXBsZUZpbHRlcjtcblxuXHRcdGlmICggISBmaWx0ZXJLZXkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCAhIGZpbHRlclZhbHVlLmxlbmd0aCApIHtcblx0XHRcdGNvbnN0IHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdFx0ZmlsdGVyUHJvZHVjdHMoKTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICggbXVsdGlwbGVGaWx0ZXIgKSB7XG5cdFx0XHRtYWtlUGFyYW1ldGVycyggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzaW5nbGVGaWx0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiByZXF1ZXN0RmlsdGVyKCB1cmwgKSB7XG5cdFx0aWYgKCAhIHVybCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHVybDtcblxuXHRcdC8vIFRPRE86IEZpbHRlciB0aGUgcHJvZHVjdHMgY29uZGl0aW9uYWxseS5cblx0XHQvLyBmaWx0ZXJQcm9kdWN0cygpO1xuXHR9XG5cblx0Ly8gSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgbGlzdCBmaWVsZC5cblx0JHdjYXBmTmF2RmlsdGVycy5vbihcblx0XHQnY2hhbmdlJyxcblx0XHQnLndjYXBmLWxheWVyZWQtbmF2IFt0eXBlPVwiY2hlY2tib3hcIl0sIC53Y2FwZi1sYXllcmVkLW5hdiBbdHlwZT1cInJhZGlvXCJdJyxcblx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0cmVxdWVzdEZpbHRlciggJGl0ZW0uZGF0YSggJ3VybCcgKSApO1xuXHRcdH1cblx0KTtcblxuXHQvLyBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciBsYWJlbGVkIGl0ZW0uXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oICdjbGljaycsICcud2NhcGYtbGFiZWxlZC1uYXYgLml0ZW06bm90KC5kaXNhYmxlZCknLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRpdGVtID0gJCggdGhpcyApO1xuXG5cdFx0cmVxdWVzdEZpbHRlciggJGl0ZW0uZGF0YSggJ3VybCcgKSApO1xuXHR9ICk7XG5cblx0Ly8gSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgZGlzcGxheSB0eXBlIHNlbGVjdCBmaWVsZHMuXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oICdjaGFuZ2UnLCAnc2VsZWN0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkc2VsZWN0ICAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCB2YWx1ZXMgICAgICAgICA9ICRzZWxlY3QudmFsKCk7XG5cdFx0Y29uc3QgZmlsdGVyVVJMICAgICAgPSAkc2VsZWN0LmRhdGEoICd1cmwnICk7XG5cdFx0Y29uc3QgY2xlYXJGaWx0ZXJVUkwgPSAkc2VsZWN0LmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApO1xuXHRcdGxldCB1cmw7XG5cblx0XHRpZiAoIHZhbHVlcy5sZW5ndGggKSB7XG5cdFx0XHR1cmwgPSBmaWx0ZXJVUkwucmVwbGFjZSggJyVzJywgdmFsdWVzLnRvU3RyaW5nKCkgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dXJsID0gY2xlYXJGaWx0ZXJVUkw7XG5cdFx0fVxuXG5cdFx0cmVxdWVzdEZpbHRlciggdXJsICk7XG5cdH0gKTtcblxuXHQvKipcblx0ICogSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgcmFuZ2UgbnVtYmVyLlxuXHQgKi9cblx0Y29uc3QgcmFuZ2VOdW1iZXJTZWxlY3RvcnMgPSAnLndjYXBmLXJhbmdlLW51bWJlciAubWluLXZhbHVlLCAud2NhcGYtcmFuZ2UtbnVtYmVyIC5tYXgtdmFsdWUnO1xuXG5cdC8vIFRPRE86IE1heWJlIHVzZSAnY2hhbmdlJyBldmVudC5cblx0JHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzLm9uKCAnaW5wdXQnLCByYW5nZU51bWJlclNlbGVjdG9ycywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdGNvbnN0ICRyYW5nZU51bWJlciAgICAgID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1yYW5nZS1udW1iZXInICk7XG5cdFx0Y29uc3QgZm9ybWF0TnVtYmVycyAgICAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZm9ybWF0LW51bWJlcnMnICk7XG5cdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApICk7XG5cdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApICk7XG5cdFx0Y29uc3QgZGVjaW1hbFBsYWNlcyAgICAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZGVjaW1hbC1wbGFjZXMnICk7XG5cdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXG5cdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdGZ1bmN0aW9uIGdldFZhbHVlKCBmbG9hdFZhbHVlICkge1xuXHRcdFx0aWYgKCBmb3JtYXROdW1iZXJzICkge1xuXHRcdFx0XHRyZXR1cm4gbnVtYmVyX2Zvcm1hdCggZmxvYXRWYWx1ZSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZsb2F0VmFsdWU7XG5cdFx0fVxuXG5cdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdGxldCBtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoKSApO1xuXHRcdFx0bGV0IG1heFZhbHVlID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCgpICk7XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRpZiAoIGlzTmFOKCBtaW5WYWx1ZSApICkge1xuXHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRpZiAoIGlzTmFOKCBtYXhWYWx1ZSApICkge1xuXHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gYmVsb3cgdGhlIHJhbmdlTWluVmFsdWUuXG5cdFx0XHRpZiAoIG1pblZhbHVlIDwgcmFuZ2VNaW5WYWx1ZSApIHtcblx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRpZiAoIG1pblZhbHVlID4gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRpZiAoIG1heFZhbHVlID4gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gZ28gYmVsb3cgdGhlIG1pblZhbHVlLlxuXHRcdFx0aWYgKCBtaW5WYWx1ZSA+IG1heFZhbHVlICkge1xuXHRcdFx0XHRtYXhWYWx1ZSA9IG1pblZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdC8vIFJlbW92ZSByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdHJlcXVlc3RGaWx0ZXIoICRyYW5nZU51bWJlci5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0Y29uc3QgdXJsID0gJHJhbmdlTnVtYmVyLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIG1pblZhbHVlICkucmVwbGFjZSggJyUycycsIG1heFZhbHVlICk7XG5cdFx0XHRcdHJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0fVxuXHRcdH0sIGRlbGF5ICkgKTtcblx0fSApO1xuXG5cdC8vIEhhbmRsZSByZW1vdmluZyB0aGUgYWN0aXZlIGZpbHRlcnMuXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oICdjbGljaycsICcud2NhcGYtYWN0aXZlLWZpbHRlcnMgLml0ZW06bm90KC5kaXNhYmxlZCknLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRpdGVtICAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGZpbHRlcktleSAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLmF0dHIoICdkYXRhLXZhbHVlJyApO1xuXG5cdFx0bWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIHRydWUgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHJlc2V0RmlsdGVycyggJGJ1dHRvbiApIHtcblx0XHRjb25zdCBfZmlsdGVyS2V5cyA9ICRidXR0b24uYXR0ciggJ2RhdGEta2V5cycgKTtcblxuXHRcdGlmICggISBfZmlsdGVyS2V5cyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBmaWx0ZXJLZXlzID0gX2ZpbHRlcktleXMuc3BsaXQoICcsJyApO1xuXG5cdFx0bGV0IHF1ZXJ5ID0gJyc7XG5cblx0XHQkLmVhY2goIGZpbHRlcktleXMsIGZ1bmN0aW9uKCBpLCBmaWx0ZXJLZXkgKSB7XG5cdFx0XHRpZiAoIHF1ZXJ5ICkge1xuXHRcdFx0XHRxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIHF1ZXJ5ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHQvLyBFbXB0eSBxdWVyeSBjYXVzZXMgaXNzdWUoZG9lc24ndCByZW1vdmUgdGhlIGZpbHRlciBrZXlzIGZyb20gdGhlIHVybCksXG5cdFx0Ly8gdGhpcyBpcyB3aHkgd2UgYXJlIHNldHRpbmcgdGhlIHBhZ2UgdXJsIGFzIHF1ZXJ5LlxuXHRcdGlmICggISBxdWVyeSApIHtcblx0XHRcdGNvbnN0IHByZXZVcmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRcdGNvbnN0IG5ld1VybCAgPSBwcmV2VXJsLnNwbGl0KCAnPycgKTtcblxuXHRcdFx0cXVlcnkgPSBuZXdVcmxbIDAgXTtcblx0XHR9XG5cblx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0ZmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0fVxuXG5cdC8vIENsZWFyL1Jlc2V0IGFsbCBmaWx0ZXJzLlxuXHQkYm9keS5vbiggJ3djYXBmLXJlc2V0LWZpbHRlcnMnLCBmdW5jdGlvbiggZSwgJGJ1dHRvbiApIHtcblx0XHRyZXNldEZpbHRlcnMoICRidXR0b24gKTtcblx0fSApO1xuXG5cdCRib2R5Lm9uKCAnY2xpY2snLCAnLndjYXBmLXJlc2V0LWZpbHRlcnMtYnRuJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGJ1dHRvbiA9ICQoIHRoaXMgKTtcblxuXHRcdHJlc2V0RmlsdGVycyggJGJ1dHRvbiApO1xuXHR9ICk7XG5cblx0JHdjYXBmTmF2RmlsdGVycy5vbiggJ2NsaWNrJywgJy53Y2FwZi1yZXNldC1maWx0ZXJzLWJ0bicsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgJGJ1dHRvbiA9ICQoIHRoaXMgKTtcblxuXHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1yZXNldC1maWx0ZXJzJywgWyAkYnV0dG9uIF0gKTtcblx0fSApO1xuXG5cdCR3Y2FwZlNpbmdsZUZpbHRlcnMub24oICd3Y2FwZi1jbGVhci1maWx0ZXInLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgZmllbGRJRCAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdGNvbnN0IGZpZWxkRGF0YSA9IGZpZWxkc1sgZmllbGRJRCBdO1xuXHRcdGNvbnN0IGZpbHRlcktleSA9IGZpZWxkRGF0YS5maWx0ZXJLZXk7XG5cblx0XHRjb25zdCBxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0ZmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0fSApO1xuXG5cdC8vIFJ1biBhamF4IGZpbHRlciB3aGVuIGJyb3dzZXIgaGlzdG9yeSBjaGFuZ2VzICh1c2VyIGdvZXMgYmFjayBvciBmb3J3YXJkKS5cblx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCB8fCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5hcHBseV9maWx0ZXJzX29uX2Jyb3dzZXJfaGlzdG9yeV9jaGFuZ2UgKSB7XG5cdFx0XHQkKCB3aW5kb3cgKS5iaW5kKCAncG9wc3RhdGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cdH1cblxuXHQvLyBUaGUgaG9vayB0aGF0IG1hbnVhbGx5IHJ1biB0aGUgYWpheCBmaWx0ZXJzIChjYW4gYmUgdXNlZnVsIGZvciBvdGhlciBwbHVnaW5zKS5cblx0JGJvZHkub24oICd3Y2FwZi1ydW4tZmlsdGVyLXByb2R1Y3RzJywgZnVuY3Rpb24oIGUsIGZvcmNlUmVSZW5kZXIgKSB7XG5cdFx0ZmlsdGVyUHJvZHVjdHMoIGZvcmNlUmVSZW5kZXIgKTtcblx0fSApO1xuXG5cdC8vIFRoZSBob29rIHRoYXQgcmVpbml0aWFsaXplIHRoZSBmaWx0ZXIgd2lkZ2V0cyAodG8gc2hvdyB0aGUgcHJldmlldyBpbiB0aGUgYmFja2VuZCkuXG5cdCRib2R5Lm9uKCAnaW5pdF9maWx0ZXJfd2lkZ2V0cycsIGZ1bmN0aW9uKCkge1xuXHRcdGluaXRDaG9zZW4oKTtcblx0XHRpbml0SGllcmFyY2h5QWNjb3JkaW9uKCk7XG5cdFx0aW5pdE5vVUlTbGlkZXIoKTtcblx0XHRpbml0RGF0ZXBpY2tlcigpO1xuXHR9ICk7XG5cblx0LyoqXG5cdCAqIE1ha2UgaXQgY29tcGF0aWJsZSB3aXRoIG90aGVyIHBsdWdpbnMuXG5cdCAqL1xuXHQkYm9keS5vbiggJ3djYXBmX2FmdGVyX3VwZGF0aW5nX3Byb2R1Y3RzJywgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gd29vLXZhcmlhdGlvbi1zd2F0Y2hlc1xuXHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggJ3dvb192YXJpYXRpb25fc3dhdGNoZXNfcHJvX2luaXQnICk7XG5cdH0gKTtcbn0gKTtcbiIsIiggZnVuY3Rpb24oICQsIHdpbmRvdyApIHtcblxuXHRjb25zdCBfZGVsYXkgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLmZpbHRlcl9pbnB1dF9kZWxheSApO1xuXHRjb25zdCBkZWxheSAgPSBfZGVsYXkgPj0gMCA/IF9kZWxheSA6IDgwMDtcblxuXHRjb25zdCAkYm9keSA9ICQoICdib2R5JyApO1xuXG5cdGNvbnN0IGluc3RhbmNlSWRzID0gW107XG5cblx0JCggJy53Y2FwZi1maWx0ZXInICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgaWQgPSAkKCB0aGlzICkuZGF0YSggJ2lkJyApO1xuXG5cdFx0aWYgKCAhIGlkICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGluc3RhbmNlSWRzLnB1c2goIGlkICk7XG5cdH0gKTtcblxuXHRsZXQgZm9jdXNlZEVsbTtcblxuXHR3aW5kb3cudGlwcHlJbnN0YW5jZXMgPSBbXTtcblxuXHR3aW5kb3cuV0NBUEYgPSB3aW5kb3cuV0NBUEYgfHwge307XG5cblx0d2luZG93LldDQVBGID0ge1xuXHRcdGhhbmRsZUZpbHRlckFjY29yZGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCB0b2dnbGVBY2NvcmRpb24gPSAoICRlbCApID0+IHtcblx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBhY2NvcmRpb24gaXMgb3BlbmVkXG5cdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtZXhwYW5kZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHQvLyBDaGFuZ2UgYXJpYS1leHBhbmRlZCB0byB0aGUgb3Bwb3NpdGUgc3RhdGVcblx0XHRcdFx0JGVsLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgISBwcmVzc2VkICk7XG5cblx0XHRcdFx0Y29uc3QgJGZpbHRlcklubmVyID0gJGVsLmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyJyApLmNoaWxkcmVuKCAnLndjYXBmLWZpbHRlci1pbm5lcicgKTtcblxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfYW5pbWF0aW9uX2Zvcl9maWx0ZXJfYWNjb3JkaW9uICkge1xuXHRcdFx0XHRcdCRmaWx0ZXJJbm5lci5zbGlkZVRvZ2dsZShcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5maWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCxcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5maWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmdcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRmaWx0ZXJJbm5lci50b2dnbGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtZmlsdGVyLWFjY29yZGlvbi10cmlnZ2VyJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkKCB0aGlzICkgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtZmlsdGVyLXRpdGxlLmhhcy1hY2NvcmRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRyaWdnZXIgPSAkKCB0aGlzICkuZmluZCggJy53Y2FwZi1maWx0ZXItYWNjb3JkaW9uLXRyaWdnZXInICk7XG5cblx0XHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkdHJpZ2dlciApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlSGllcmFyY2h5VG9nZ2xlOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHRvZ2dsZUFjY29yZGlvbiA9ICggJGVsICkgPT4ge1xuXHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGJ1dHRvbiBpcyBwcmVzc2VkXG5cdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdC8vIENoYW5nZSBhcmlhLXByZXNzZWQgdG8gdGhlIG9wcG9zaXRlIHN0YXRlXG5cdFx0XHRcdCRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJywgISBwcmVzc2VkICk7XG5cblx0XHRcdFx0Y29uc3QgJGNoaWxkID0gJGVsLmNsb3Nlc3QoICdsaScgKS5jaGlsZHJlbiggJ3VsJyApO1xuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24gKSB7XG5cdFx0XHRcdFx0JGNoaWxkLnNsaWRlVG9nZ2xlKFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkLFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZ1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JGNoaWxkLnRvZ2dsZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHQkYm9keVxuXHRcdFx0XHQub24oICdjbGljaycsICcud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdFx0XHR9IClcblx0XHRcdFx0Lm9uKCAna2V5ZG93bicsICcud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRpZiAoIGUua2V5ID09PSAnICcgfHwgZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICdTcGFjZWJhcicgKSB7XG5cdFx0XHRcdFx0XHQvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvbiB0byBzdG9wIHNjcm9sbGluZyB3aGVuIHNwYWNlIGlzIHByZXNzZWRcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkKCB0aGlzICkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZVNvZnRMaW1pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCB0b2dnbGVGaWx0ZXJPcHRpb25zID0gKCAkZWwgKSA9PiB7XG5cdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYnV0dG9uIGlzIHByZXNzZWRcblx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0Ly8gQ2hhbmdlIGFyaWEtcHJlc3NlZCB0byB0aGUgb3Bwb3NpdGUgc3RhdGVcblx0XHRcdFx0JGVsLmF0dHIoICdhcmlhLXByZXNzZWQnLCAhIHByZXNzZWQgKTtcblxuXHRcdFx0XHRjb25zdCAkbGlzdFdyYXBwZXIgPSAkZWwuY2xvc2VzdCggJy53Y2FwZi1saXN0LXdyYXBwZXInICk7XG5cblx0XHRcdFx0aWYgKCBwcmVzc2VkICkge1xuXHRcdFx0XHRcdCRsaXN0V3JhcHBlci5yZW1vdmVDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JGxpc3RXcmFwcGVyLmFkZENsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0JGJvZHlcblx0XHRcdFx0Lm9uKCAnY2xpY2snLCAnLndjYXBmLXNvZnQtbGltaXQtdHJpZ2dlcicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRvZ2dsZUZpbHRlck9wdGlvbnMoICQoIHRoaXMgKSApO1xuXHRcdFx0XHR9IClcblx0XHRcdFx0Lm9uKCAna2V5ZG93bicsICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0aWYgKCBlLmtleSA9PT0gJyAnIHx8IGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnU3BhY2ViYXInICkge1xuXHRcdFx0XHRcdFx0Ly8gUHJldmVudCB0aGUgZGVmYXVsdCBhY3Rpb24gdG8gc3RvcCBzY3JvbGxpbmcgd2hlbiBzcGFjZSBpcyBwcmVzc2VkXG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRcdHRvZ2dsZUZpbHRlck9wdGlvbnMoICQoIHRoaXMgKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlU2VhcmNoRmlsdGVyT3B0aW9uczogZnVuY3Rpb24oKSB7XG5cdFx0XHQkYm9keS5vbiggJ2lucHV0JywgJy53Y2FwZi1zZWFyY2gtYm94IGlucHV0W3R5cGU9XCJ0ZXh0XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0aGF0ICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0ICRpbm5lciAgPSAkdGhhdC5jbG9zZXN0KCAnLndjYXBmLWZpbHRlci1pbm5lcicgKTtcblx0XHRcdFx0Y29uc3QgJGZpbHRlciA9ICRpbm5lci5jbG9zZXN0KCAnLndjYXBmLWZpbHRlcicgKTtcblxuXHRcdFx0XHRjb25zdCBzb2Z0TGltaXRFbmFibGVkID0gJGZpbHRlci5oYXNDbGFzcyggJ2hhcy1zb2Z0LWxpbWl0JyApO1xuXHRcdFx0XHRjb25zdCBzb2Z0TGltaXRUb2dnbGUgID0gJGZpbHRlci5maW5kKCAnLndjYXBmLXNvZnQtbGltaXQtd3JhcHBlcicgKTtcblx0XHRcdFx0Y29uc3Qgbm9SZXN1bHRzICAgICAgICA9ICRmaWx0ZXIuZmluZCggJy53Y2FwZi1uby1yZXN1bHRzLXRleHQnICk7XG5cdFx0XHRcdGNvbnN0IHZpc2libGVPcHRpb25zICAgPSBwYXJzZUludCggJGZpbHRlci5hdHRyKCAnZGF0YS12aXNpYmxlLW9wdGlvbnMnICkgKTtcblxuXHRcdFx0XHRjb25zdCBrZXl3b3JkID0gJHRoYXQudmFsKCk7XG5cblx0XHRcdFx0aWYgKCAhIGtleXdvcmQubGVuZ3RoICkge1xuXHRcdFx0XHRcdGxldCBpbmRleCA9IDA7XG5cdFx0XHRcdFx0JGZpbHRlci5yZW1vdmVDbGFzcyggJ3NlYXJjaC1hY3RpdmUnICk7XG5cblx0XHRcdFx0XHQkLmVhY2goICRpbm5lci5maW5kKCAnLndjYXBmLWZpbHRlci1vcHRpb25zID4gbGknICksIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0aW5kZXgrKztcblxuXHRcdFx0XHRcdFx0Y29uc3QgJGZpbHRlckl0ZW0gPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5yZW1vdmVDbGFzcyggJ2tleXdvcmQtbWF0Y2hlZCcgKTtcblxuXHRcdFx0XHRcdFx0aWYgKCBzb2Z0TGltaXRFbmFibGVkICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIGluZGV4ID4gdmlzaWJsZU9wdGlvbnMgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0uYWRkQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5yZW1vdmVDbGFzcyggJ3djYXBmLWZpbHRlci1vcHRpb24taGlkZGVuJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdFx0aWYgKCBzb2Z0TGltaXRFbmFibGVkICkge1xuXHRcdFx0XHRcdFx0c29mdExpbWl0VG9nZ2xlLnJlbW92ZUF0dHIoICdzdHlsZScgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRub1Jlc3VsdHMuY2hpbGRyZW4oICdzcGFuJyApLnRleHQoICcnICk7XG5cdFx0XHRcdFx0bm9SZXN1bHRzLmhpZGUoKTtcblxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCBpbmRleCA9IDA7XG5cdFx0XHRcdCRmaWx0ZXIuYWRkQ2xhc3MoICdzZWFyY2gtYWN0aXZlJyApO1xuXG5cdFx0XHRcdCQuZWFjaCggJGlubmVyLmZpbmQoICcud2NhcGYtZmlsdGVyLW9wdGlvbnMgPiBsaScgKSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGZpbHRlckl0ZW0gPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0Y29uc3QgbGFiZWwgICAgICAgPSAkZmlsdGVySXRlbS5maW5kKCAnLndjYXBmLWZpbHRlci1pdGVtLWxhYmVsJyApLmRhdGEoICdsYWJlbCcgKTtcblxuXHRcdFx0XHRcdGlmICggbGFiZWwudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygga2V5d29yZC50b0xvd2VyQ2FzZSgpICkgKSB7XG5cdFx0XHRcdFx0XHRpbmRleCsrO1xuXG5cdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5hZGRDbGFzcyggJ2tleXdvcmQtbWF0Y2hlZCcgKTtcblxuXHRcdFx0XHRcdFx0aWYgKCBzb2Z0TGltaXRFbmFibGVkICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIGluZGV4ID4gdmlzaWJsZU9wdGlvbnMgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0uYWRkQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5yZW1vdmVDbGFzcyggJ3djYXBmLWZpbHRlci1vcHRpb24taGlkZGVuJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLnJlbW92ZUNsYXNzKCAna2V5d29yZC1tYXRjaGVkJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRpZiAoIGluZGV4IDw9IHZpc2libGVPcHRpb25zICkge1xuXHRcdFx0XHRcdFx0c29mdExpbWl0VG9nZ2xlLmhpZGUoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c29mdExpbWl0VG9nZ2xlLnNob3coKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIDAgPT09IGluZGV4ICkge1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5jaGlsZHJlbiggJ3NwYW4nICkudGV4dCgga2V5d29yZCApO1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bm9SZXN1bHRzLmNoaWxkcmVuKCAnc3BhbicgKS50ZXh0KCAnJyApO1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdHVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQ6IGZ1bmN0aW9uKCAkcmVzcG9uc2UgKSB7XG5cdFx0XHRjb25zdCAkY29udGFpbmVyID0gJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdGNvbnN0IHNlbGVjdG9yICAgPSAnLndvb2NvbW1lcmNlLXJlc3VsdC1jb3VudCc7XG5cdFx0XHRjb25zdCBuZXdDb3VudCAgID0gJHJlc3BvbnNlLmZpbmQoIHNlbGVjdG9yICkuaHRtbCgpO1xuXG5cdFx0XHQkYm9keS5maW5kKCBzZWxlY3RvciApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkZWwgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0aWYgKCAhICRjb250YWluZXIuaGFzKCAkZWwgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0JGVsLmh0bWwoIG5ld0NvdW50ICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdHNob3dMb2FkaW5nQW5pbWF0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMubG9hZGluZ19hbmltYXRpb24gKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0JC5Mb2FkaW5nT3ZlcmxheSggJ3Nob3cnLCB3Y2FwZl9wYXJhbXMubG9hZGluZ19vdmVybGF5X29wdGlvbnMgKTtcblx0XHR9LFxuXHRcdHJlc2V0TG9hZGluZ0FuaW1hdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLmxvYWRpbmdfYW5pbWF0aW9uICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCQuTG9hZGluZ092ZXJsYXkoICdoaWRlJyApO1xuXHRcdH0sXG5cdFx0c2Nyb2xsVG86IGZ1bmN0aW9uKCB0cmlnZ2VyZWRCeSApIHtcblx0XHRcdGlmICggJ25vbmUnID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvdyApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBhbGxvd2VkICAgID0gW107XG5cdFx0XHRjb25zdCBzY3JvbGxXaGVuID0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfd2hlbjtcblxuXHRcdFx0aWYgKCAnYWxsJyA9PT0gc2Nyb2xsV2hlbiApIHtcblx0XHRcdFx0YWxsb3dlZC5wdXNoKCAnZmlsdGVyJyApO1xuXHRcdFx0XHRhbGxvd2VkLnB1c2goICdwYWdpbmF0ZScgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFsbG93ZWQucHVzaCggc2Nyb2xsV2hlbiApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgYWxsb3dlZC5pbmNsdWRlcyggdHJpZ2dlcmVkQnkgKSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzY3JvbGxGb3IgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19mb3I7XG5cdFx0XHRjb25zdCBpc01vYmlsZSAgPSB3Y2FwZl9wYXJhbXMuaXNfbW9iaWxlO1xuXHRcdFx0bGV0IHByb2NlZWQgICAgID0gZmFsc2U7XG5cblx0XHRcdGlmICggJ21vYmlsZScgPT09IHNjcm9sbEZvciAmJiBpc01vYmlsZSApIHtcblx0XHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0XHR9IGVsc2UgaWYgKCAnZGVza3RvcCcgPT09IHNjcm9sbEZvciAmJiAhIGlzTW9iaWxlICkge1xuXHRcdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSBpZiAoICdib3RoJyA9PT0gc2Nyb2xsRm9yICkge1xuXHRcdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhIHByb2NlZWQgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGFkanVzdGluZ09mZnNldCwgb2Zmc2V0O1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX29mZnNldCApIHtcblx0XHRcdFx0YWRqdXN0aW5nT2Zmc2V0ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX29mZnNldCApO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgY29udGFpbmVyO1xuXG5cdFx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lcjtcblx0XHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lcjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAnY3VzdG9tJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRcdGNvbnRhaW5lciA9IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50O1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCAkY29udGFpbmVyID0gJCggY29udGFpbmVyICk7XG5cblx0XHRcdGlmICggJGNvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdG9mZnNldCA9ICRjb250YWluZXIub2Zmc2V0KCkudG9wIC0gYWRqdXN0aW5nT2Zmc2V0O1xuXG5cdFx0XHRcdGlmICggb2Zmc2V0IDwgMCApIHtcblx0XHRcdFx0XHRvZmZzZXQgPSAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZGlzYWJsZV9zY3JvbGxfYW5pbWF0aW9uICkge1xuXHRcdFx0XHRcdHdpbmRvdy5zY3JvbGxUbyggeyB0b3A6IG9mZnNldCB9ICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JCggJ2h0bWwsIGJvZHknICkuc3RvcCgpLmFuaW1hdGUoXG5cdFx0XHRcdFx0XHR7IHNjcm9sbFRvcDogb2Zmc2V0IH0sXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9zcGVlZCxcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX2Vhc2luZ1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdC8vIFRoaW5ncyBhcmUgZG9uZSBiZWZvcmUgZmV0Y2hpbmcgdGhlIHByb2R1Y3RzIGxpa2Ugc2hvd2luZyB0aGUgbG9hZGluZyBpbmRpY2F0b3IuXG5cdFx0YmVmb3JlRmV0Y2hpbmdQcm9kdWN0czogZnVuY3Rpb24oIHRyaWdnZXJlZEJ5ICkge1xuXHRcdFx0Ly8gVHJhY2sgdGhlIGN1cnJlbnQgZWxlbWVudCBmb2N1cy5cblx0XHRcdGZvY3VzZWRFbG0gPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXG5cdFx0XHRXQ0FQRi5zaG93TG9hZGluZ0FuaW1hdGlvbigpO1xuXG5cdFx0XHQvLyBTY3JvbGwgaW50byB2aWV3IG9uIHBhZ2luYXRlLlxuXHRcdFx0aWYgKCAncGFnaW5hdGUnID09PSB0cmlnZ2VyZWRCeSAmJiB3Y2FwZl9wYXJhbXMuaW1tZWRpYXRlX3Njcm9sbF9vbl9wYWdpbmF0ZSApIHtcblx0XHRcdFx0V0NBUEYuc2Nyb2xsVG8oIHRyaWdnZXJlZEJ5ICk7XG5cdFx0XHR9XG5cblx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfZmV0Y2hpbmdfcHJvZHVjdHMnLCBbIHRyaWdnZXJlZEJ5IF0gKTtcblx0XHR9LFxuXHRcdGRlc3Ryb3lUaXBweUluc3RhbmNlczogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy51c2VfdGlwcHlqcyApIHtcblx0XHRcdFx0Ly8gQHNvdXJjZSBodHRwczovL2dpdGh1Yi5jb20vYXRvbWlrcy90aXBweWpzL2lzc3Vlcy80NzNcblx0XHRcdFx0dGlwcHlJbnN0YW5jZXMuZm9yRWFjaCggaW5zdGFuY2UgPT4ge1xuXHRcdFx0XHRcdGluc3RhbmNlLmRlc3Ryb3koKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0XHR0aXBweUluc3RhbmNlcy5sZW5ndGggPSAwOyAvLyBjbGVhciBpdFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Ly8gVGhpbmdzIGFyZSBkb25lIGJlZm9yZSB1cGRhdGluZyB0aGUgcHJvZHVjdHMgbGlrZSBoaWRpbmcgdGhlIGxvYWRpbmcgaW5kaWNhdG9yLlxuXHRcdGJlZm9yZVVwZGF0aW5nUHJvZHVjdHM6IGZ1bmN0aW9uKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICkge1xuXHRcdFx0V0NBUEYucmVzZXRMb2FkaW5nQW5pbWF0aW9uKCk7XG5cblx0XHRcdC8vIE1heWJlIGdvb2QgZm9yIHBlcmZvcm1hbmNlLlxuXHRcdFx0V0NBUEYuZGVzdHJveVRpcHB5SW5zdGFuY2VzKCk7XG5cblx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfdXBkYXRpbmdfcHJvZHVjdHMnLCBbICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgXSApO1xuXHRcdH0sXG5cdFx0YWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzOiBmdW5jdGlvbiggJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSApIHtcblx0XHRcdFdDQVBGLnVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQoICRyZXNwb25zZSApO1xuXG5cdFx0XHQvLyBSZXN0b3JlIHRoZSBmb2N1cyAoTWF5YmUgcmVzdG9yaW5nIHRoZSBmb2N1cyBpbiBtb2JpbGUgZGV2aWNlIGlzbid0IGdvb2QpLlxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucmVzdG9yZV9mb2N1c19hZnRlcl9maWx0ZXJpbmcgJiYgISB3Y2FwZl9wYXJhbXMuaXNfbW9iaWxlICkge1xuXHRcdFx0XHRpZiAoIGRvY3VtZW50LmJvZHkgIT09IGZvY3VzZWRFbG0gKSB7XG5cdFx0XHRcdFx0aWYgKCBmb2N1c2VkRWxtLmlkICkge1xuXHRcdFx0XHRcdFx0JCggYCMkeyBmb2N1c2VkRWxtLmlkIH1gICkuZm9jdXMoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVpbml0aWFsaXplIHdjYXBmLlxuXHRcdFx0V0NBUEYuaW5pdCgpO1xuXG5cdFx0XHQvLyBTY3JvbGwgaW50byB2aWV3LlxuXHRcdFx0aWYgKCAncGFnaW5hdGUnID09PSB0cmlnZ2VyZWRCeSAmJiB3Y2FwZl9wYXJhbXMuaW1tZWRpYXRlX3Njcm9sbF9vbl9wYWdpbmF0ZSApIHtcblx0XHRcdFx0Ly8gRG8gbm90aGluZyBiZWNhdXNlIGl0IGFscmVhZHkgaGFwcGVuZWQuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRXQ0FQRi5zY3JvbGxUbyggdHJpZ2dlcmVkQnkgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVHJpZ2dlciBldmVudHMuXG5cdFx0XHQkKCBkb2N1bWVudCApLnRyaWdnZXIoICdyZWFkeScgKTtcblx0XHRcdCQoIHdpbmRvdyApLnRyaWdnZXIoICdzY3JvbGwnICk7XG5cdFx0XHQkKCB3aW5kb3cgKS50cmlnZ2VyKCAncmVzaXplJyApO1xuXG5cdFx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGZfYWZ0ZXJfdXBkYXRpbmdfcHJvZHVjdHMnLCBbICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgXSApO1xuXHRcdH0sXG5cdFx0ZmlsdGVyUHJvZHVjdHM6IGZ1bmN0aW9uKCB0cmlnZ2VyZWRCeSA9ICdmaWx0ZXInICkge1xuXHRcdFx0V0NBUEYuYmVmb3JlRmV0Y2hpbmdQcm9kdWN0cyggdHJpZ2dlcmVkQnkgKTtcblxuXHRcdFx0JC5hamF4KCB7XG5cdFx0XHRcdHVybDogd2luZG93LmxvY2F0aW9uLmhyZWYsXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdFx0XHRjb25zdCAkcmVzcG9uc2UgPSAkKCByZXNwb25zZSApO1xuXG5cdFx0XHRcdFx0V0NBUEYuYmVmb3JlVXBkYXRpbmdQcm9kdWN0cyggJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSApO1xuXG5cdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0ICogVXBkYXRlIGRvY3VtZW50IHRpdGxlLlxuXHRcdFx0XHRcdCAqXG5cdFx0XHRcdFx0ICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNzU5OTU2MlxuXHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnVwZGF0ZV9kb2N1bWVudF90aXRsZSApIHtcblx0XHRcdFx0XHRcdGRvY3VtZW50LnRpdGxlID0gJHJlc3BvbnNlLmZpbHRlciggJ3RpdGxlJyApLnRleHQoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBVcGRhdGUgdGhlIGluc3RhbmNlcy5cblx0XHRcdFx0XHRmb3IgKCBjb25zdCBpZCBvZiBpbnN0YW5jZUlkcyApIHtcblx0XHRcdFx0XHRcdGNvbnN0IGluc3RhbmNlSWQgPSAnW2RhdGEtaWQ9XCInICsgaWQgKyAnXCJdJztcblx0XHRcdFx0XHRcdGNvbnN0ICRpbnN0YW5jZSAgPSAkKCBpbnN0YW5jZUlkICk7XG5cdFx0XHRcdFx0XHRjb25zdCAkaW5uZXIgICAgID0gJGluc3RhbmNlLmZpbmQoICcud2NhcGYtZmlsdGVyLWlubmVyJyApO1xuXHRcdFx0XHRcdFx0Y29uc3QgX2luc3RhbmNlICA9ICRyZXNwb25zZS5maW5kKCBpbnN0YW5jZUlkICk7XG5cblx0XHRcdFx0XHRcdC8vIFByZXNlcnZlIGhpZXJhcmNoeSBhY2NvcmRpb24gc3RhdGUuXG5cdFx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5wcmVzZXJ2ZV9oaWVyYXJjaHlfYWNjb3JkaW9uX3N0YXRlICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRpbnN0YW5jZS5oYXNDbGFzcyggJ2hhcy1oaWVyYXJjaHktYWNjb3JkaW9uJyApICkge1xuXHRcdFx0XHRcdFx0XHRcdCRpbnN0YW5jZS5maW5kKCAnLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgJGVsID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgaWQgID0gJGVsLmRhdGEoICdpZCcgKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgdG9nZ2xlU2VsZWN0b3IgPSBgLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlW2RhdGEtaWQ9XCIkeyBpZCB9XCJdYDtcblxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBhY2NvcmRpb24gaXMgb3BlbmVkXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBwcmVzc2VkID0gJGVsLmF0dHIoICdhcmlhLXByZXNzZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCBwcmVzc2VkICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5hdHRyKCAnYXJpYS1wcmVzc2VkJywgJ3RydWUnICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCB0b2dnbGVTZWxlY3RvciApLmNsb3Nlc3QoICdsaScgKS5jaGlsZHJlbiggJ3VsJyApLnNob3coKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCB0b2dnbGVTZWxlY3RvciApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAnZmFsc2UnICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCB0b2dnbGVTZWxlY3RvciApLmNsb3Nlc3QoICdsaScgKS5jaGlsZHJlbiggJ3VsJyApLmhpZGUoKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gUHJlc2VydmUgc29mdCBsaW1pdCBzdGF0ZS5cblx0XHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnByZXNlcnZlX3NvZnRfbGltaXRfc3RhdGUgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJGluc3RhbmNlLmhhc0NsYXNzKCAnaGFzLXNvZnQtbGltaXQnICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgJGxpc3RXcmFwcGVyID0gJGluc3RhbmNlLmZpbmQoICcud2NhcGYtbGlzdC13cmFwcGVyJyApO1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCAkbGlzdFdyYXBwZXIuaGFzQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtbGlzdC13cmFwcGVyJyApLmFkZENsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLXNvZnQtbGltaXQtdHJpZ2dlcicgKS5hdHRyKCAnYXJpYS1wcmVzc2VkJywgJ3RydWUnICk7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLWxpc3Qtd3JhcHBlcicgKS5yZW1vdmVDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1zb2Z0LWxpbWl0LXRyaWdnZXInICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICdmYWxzZScgKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Y29uc3QgX2h0bWwgPSBfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1maWx0ZXItaW5uZXInICkuaHRtbCgpO1xuXG5cdFx0XHRcdFx0XHQvLyBGaW5hbGx5IHVwZGF0ZSB0aGUgaW5zdGFuY2UuXG5cdFx0XHRcdFx0XHQkaW5uZXIuaHRtbCggX2h0bWwgKTtcblxuXHRcdFx0XHRcdFx0JGluc3RhbmNlLnRyaWdnZXIoICd3Y2FwZi1maWx0ZXItdXBkYXRlZCcsIFsgX2luc3RhbmNlIF0gKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBVcGRhdGUgdGhlIGFjdGl2ZSBmaWx0ZXJzIGFuZCByZXNldCBmaWx0ZXJzLlxuXHRcdFx0XHRcdCRib2R5LmZpbmQoICcud2NhcGYtYWN0aXZlLWZpbHRlcnMsIC53Y2FwZi1yZXNldC1maWx0ZXJzJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0Y29uc3QgJHRoYXQgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRcdGNvbnN0IGluc3RhbmNlSWQgPSAnW2RhdGEtaWQ9XCInICsgJHRoYXQuZGF0YSggJ2lkJyApICsgJ1wiXSc7XG5cblx0XHRcdFx0XHRcdCR0aGF0Lmh0bWwoICRyZXNwb25zZS5maW5kKCBpbnN0YW5jZUlkICkuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdFx0Ly8gUmVwbGFjZSBvbGQgc2hvcCBsb29wIHdpdGggbmV3IG9uZS5cblx0XHRcdFx0XHRjb25zdCAkc2hvcExvb3BDb250YWluZXIgPSAkcmVzcG9uc2UuZmluZCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdFx0XHRjb25zdCAkbm90Rm91bmRDb250YWluZXIgPSAkcmVzcG9uc2UuZmluZCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKTtcblxuXHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgPT09IHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGlmICggJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJHNob3BMb29wQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmh0bWwoICRub3RGb3VuZENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJHNob3BMb29wQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRub3RGb3VuZENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFdDQVBGLmFmdGVyVXBkYXRpbmdQcm9kdWN0cyggJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRyZXF1ZXN0RmlsdGVyOiBmdW5jdGlvbiggdXJsLCB0cmlnZ2VyZWRCeSA9ICdmaWx0ZXInICkge1xuXHRcdFx0aWYgKCAhIHVybCApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBob3N0bmFtZSA9IGxvY2F0aW9uLmhvc3RuYW1lO1xuXG5cdFx0XHQvLyBUT0RPOiBSZW1vdmUgZnJvbSBwcm9kdWN0aW9uIGJ1aWxkLlxuXHRcdFx0aWYgKCAnbG9jYWxob3N0JyA9PT0gaG9zdG5hbWUgKSB7XG5cdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCAnaHR0cDovL3djZmlsdGVyLTIudGVzdCcsICcvL2xvY2FsaG9zdDozMDAxJyApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHVybDtcblxuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHsgd2NhcGY6IHRydWUgfSwgJycsIHVybCApO1xuXG5cdFx0XHRXQ0FQRi5maWx0ZXJQcm9kdWN0cyggdHJpZ2dlcmVkQnkgKTtcblx0XHR9LFxuXHRcdGhhbmRsZU51bWJlcklucHV0RmlsdGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCByYW5nZU51bWJlclNlbGVjdG9ycyA9ICcud2NhcGYtcmFuZ2UtbnVtYmVyIC5taW4tdmFsdWUsIC53Y2FwZi1yYW5nZS1udW1iZXIgLm1heC12YWx1ZSc7XG5cblx0XHRcdCRib2R5Lm9uKCAnaW5wdXQnLCByYW5nZU51bWJlclNlbGVjdG9ycywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRpdGVtID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdGNvbnN0ICRyYW5nZU51bWJlciAgICAgID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1yYW5nZS1udW1iZXInICk7XG5cdFx0XHRcdGNvbnN0IGZvcm1hdE51bWJlcnMgICAgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWZvcm1hdC1udW1iZXJzJyApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1pblZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IG9sZE1pblZhbHVlICAgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBvbGRNYXhWYWx1ZSAgICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFBsYWNlcyAgICAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZGVjaW1hbC1wbGFjZXMnICk7XG5cdFx0XHRcdGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXRob3VzYW5kLXNlcGFyYXRvcicgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFNlcGFyYXRvciAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZGVjaW1hbC1zZXBhcmF0b3InICk7XG5cblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGl0ZW0uZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0Y29uc3QgZ2V0VmFsdWUgPSAoIGZsb2F0VmFsdWUgKSA9PiB7XG5cdFx0XHRcdFx0aWYgKCBmb3JtYXROdW1iZXJzICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG51bWJlckZvcm1hdCggZmxvYXRWYWx1ZSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gZmxvYXRWYWx1ZTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQkaXRlbS5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRsZXQgbWluVmFsdWUgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCkgKTtcblx0XHRcdFx0XHRsZXQgbWF4VmFsdWUgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCkgKTtcblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRcdFx0aWYgKCBpc05hTiggbWluVmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNaW5WYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0XHRcdGlmICggaXNOYU4oIG1heFZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgcmFuZ2VNaW5WYWx1ZS5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlIDwgcmFuZ2VNaW5WYWx1ZSApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNaW5WYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPiByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBtYXhWYWx1ZSA+IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgbWluVmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA+IG1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSBtaW5WYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBJZiB2YWx1ZSBpcyBub3QgY2hhbmdlZCB0aGVuIGRvbid0IHByb2NlZWQuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gb2xkTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IG9sZE1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHQvLyBSZW1vdmUgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJHJhbmdlTnVtYmVyLmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIEFkZCByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0XHRjb25zdCB1cmwgPSAkcmFuZ2VOdW1iZXIuZGF0YSggJ3VybCcgKS5yZXBsYWNlKCAnJTFzJywgbWluVmFsdWUgKS5yZXBsYWNlKCAnJTJzJywgbWF4VmFsdWUgKTtcblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlTGlzdEZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgbmF0aXZlSW5wdXRzID0gJy5saXN0LXR5cGUtbmF0aXZlIFt0eXBlPVwiY2hlY2tib3hcIl0sJyArXG5cdFx0XHRcdCcubGlzdC10eXBlLW5hdGl2ZSBbdHlwZT1cInJhZGlvXCJdLCcgK1xuXHRcdFx0XHQnLmxpc3QtdHlwZS1jdXN0b20tY2hlY2tib3ggW3R5cGU9XCJjaGVja2JveFwiXSc7XG5cblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgbmF0aXZlSW5wdXRzLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJCggdGhpcyApLmRhdGEoICd1cmwnICkgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Y29uc3QgY3VzdG9tUmFkaW9TZWxlY3RvciA9ICcubGlzdC10eXBlLWN1c3RvbS1yYWRpbyc7XG5cblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgY3VzdG9tUmFkaW9TZWxlY3RvciArICcgW3R5cGU9XCJjaGVja2JveFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTgzOTkyNFxuXHRcdFx0XHQkKCB0aGlzIClcblx0XHRcdFx0XHQuY2xvc2VzdCggY3VzdG9tUmFkaW9TZWxlY3RvciApXG5cdFx0XHRcdFx0LmZpbmQoICcud2NhcGYtZmlsdGVyLWl0ZW06bm90KC5jdXJyZW50LXRheC1pdGVtKTpub3QoLmFjdGl2ZS1hcy1hbmNlc3RvcikgW3R5cGU9XCJjaGVja2JveFwiXScgKVxuXHRcdFx0XHRcdC5ub3QoIHRoaXMgKVxuXHRcdFx0XHRcdC5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJCggdGhpcyApLmRhdGEoICd1cmwnICkgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZURyb3Bkb3duRmlsdGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsICcud2NhcGYtZHJvcGRvd24td3JhcHBlciBzZWxlY3QnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHNlbGVjdCAgICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IHZhbHVlcyAgICAgICAgID0gJHNlbGVjdC52YWwoKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyVVJMICAgICAgPSAkc2VsZWN0LmRhdGEoICd1cmwnICk7XG5cdFx0XHRcdGNvbnN0IGNsZWFyRmlsdGVyVVJMID0gJHNlbGVjdC5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKTtcblx0XHRcdFx0bGV0IHVybDtcblxuXHRcdFx0XHRpZiAoIHZhbHVlcy5sZW5ndGggKSB7XG5cdFx0XHRcdFx0dXJsID0gZmlsdGVyVVJMLnJlcGxhY2UoICclcycsIHZhbHVlcy50b1N0cmluZygpICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dXJsID0gY2xlYXJGaWx0ZXJVUkw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCB1cmwgKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZVBhZ2luYXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXggJiYgd2NhcGZfcGFyYW1zLnBhZ2luYXRpb25fY29udGFpbmVyICkge1xuXHRcdFx0XHRjb25zdCAkY29udGFpbmVyID0gJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdFx0Y29uc3QgX3NlbGVjdG9ycyA9IHdjYXBmX3BhcmFtcy5wYWdpbmF0aW9uX2NvbnRhaW5lci5zcGxpdCggJywnICk7XG5cdFx0XHRcdGNvbnN0IHNlbGVjdG9ycyAgPSBbXTtcblxuXHRcdFx0XHRfc2VsZWN0b3JzLmZvckVhY2goIHNlbGVjdG9yID0+IHtcblx0XHRcdFx0XHRpZiAoIHNlbGVjdG9yICkge1xuXHRcdFx0XHRcdFx0c2VsZWN0b3JzLnB1c2goIHNlbGVjdG9yICsgJyBhJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGNvbnN0IHNlbGVjdG9yID0gc2VsZWN0b3JzLmpvaW4oICcsJyApO1xuXG5cdFx0XHRcdGlmICggJGNvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0JGNvbnRhaW5lci5vbiggJ2NsaWNrJywgc2VsZWN0b3IsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBocmVmID0gJCggdGhpcyApLmF0dHIoICdocmVmJyApO1xuXG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCBocmVmLCAncGFnaW5hdGUnICk7XG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRoYW5kbGVEZWZhdWx0T3JkZXJieTogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLnNvcnRpbmdfY29udHJvbCApIHtcblx0XHRcdFx0Ly8gU3VibWl0IHRoZSBvcmRlcmJ5IGZvcm0gd2hlbiB2YWx1ZSBpcyBjaGFuZ2VkLlxuXHRcdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsICcud29vY29tbWVyY2Utb3JkZXJpbmcgc2VsZWN0Lm9yZGVyYnknLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKCB0aGlzICkuY2xvc2VzdCggJ2Zvcm0nICkudHJpZ2dlciggJ3N1Ym1pdCcgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUHJldmVudCB0aGUgYXV0byBzdWJtaXNzaW9uIG9mIHRoZSBvcmRlcmJ5IGZvcm0uXG5cdFx0XHQkYm9keS5vbiggJ3N1Ym1pdCcsICcud29vY29tbWVyY2Utb3JkZXJpbmcnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IHZpYSBhamF4IHdoZW4gdGhlIG9yZGVyYnkgdmFsdWUgaXMgY2hhbmdlZC5cblx0XHRcdCRib2R5Lm9uKCAnY2hhbmdlJywgJy53b29jb21tZXJjZS1vcmRlcmluZyBzZWxlY3Qub3JkZXJieScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBvcmRlciA9ICQoIHRoaXMgKS52YWwoKTtcblxuXHRcdFx0XHRjb25zdCB1cmwgPSBuZXcgVVJMKCB3aW5kb3cubG9jYXRpb24gKTtcblx0XHRcdFx0dXJsLnNlYXJjaFBhcmFtcy5zZXQoICdvcmRlcmJ5Jywgb3JkZXIgKTtcblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCBnZXRPcmRlckJ5VXJsKCB1cmwuaHJlZiApICk7XG5cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlQ2xlYXJGaWx0ZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtZmlsdGVyLWNsZWFyLWJ0bicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5hdHRyKCAnZGF0YS1jbGVhci1maWx0ZXItdXJsJyApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVGaWx0ZXJUb29sdGlwOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHRpcHB5ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMudXNlX3RpcHB5anMgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dGlwcHkoICcud2NhcGYtZmlsdGVyLXRvb2x0aXAnLCB7XG5cdFx0XHRcdHBsYWNlbWVudDogJ3RvcCcsXG5cdFx0XHRcdGNvbnRlbnQoIHJlZmVyZW5jZSApIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSggJ2RhdGEtY29udGVudCcgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0YWxsb3dIVE1MOiB0cnVlLFxuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aW5pdENvbWJvYm94OiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggISBqUXVlcnkoKS5jaG9zZW5XQ0FQRiApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB0ZW1wbGF0ZVJlc3VsdCA9ICggdGV4dCwgZGF0YSApID0+IHtcblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQnPHNwYW4+JyArIHRleHQgKyAnPC9zcGFuPicsXG5cdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwid2NhcGYtY291bnRcIj4nICsgZGF0YVsgJ2NvdW50TWFya3VwJyBdICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRdLmpvaW4oICcnICk7XG5cdFx0XHR9O1xuXG5cdFx0XHRjb25zdCB0ZW1wbGF0ZVNlbGVjdGlvbiA9ICggdGV4dCwgZGF0YSApID0+IHtcblx0XHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJ3Y2FwZi1jb3VudC0nICsgZGF0YS5jb3VudCArICdcIj4nICsgdGV4dCArICc8L3NwYW4+Jyxcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJ3Y2FwZi1jb3VudCB3Y2FwZi1jb3VudC0nICsgZGF0YS5jb3VudCArICdcIj4nICsgZGF0YVsgJ2NvdW50TWFya3VwJyBdICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRdLmpvaW4oICcnICk7XG5cdFx0XHR9O1xuXG5cdFx0XHRjb25zdCBvcHRpb25zID0ge1xuXHRcdFx0XHRpbmhlcml0X3NlbGVjdF9jbGFzc2VzOiB0cnVlLFxuXHRcdFx0XHRpbmhlcml0X29wdGlvbl9jbGFzc2VzOiB0cnVlLFxuXHRcdFx0XHRub19yZXN1bHRzX3RleHQ6IHdjYXBmX3BhcmFtcy5jaG9zZW5fbm9fcmVzdWx0c190ZXh0LFxuXHRcdFx0XHRvcHRpb25zX25vbmVfdGV4dDogd2NhcGZfcGFyYW1zLmNob3Nlbl9vcHRpb25zX25vbmVfdGV4dCxcblx0XHRcdFx0c2VhcmNoX2NvbnRhaW5zOiB0cnVlLCAvLyBNYXRjaCBmcm9tIGFueXdoZXJlIGluIHN0cmluZy5cblx0XHRcdFx0c2VhcmNoX2luX3ZhbHVlczogdHJ1ZSwgLy8gU2VhcmNoIGluIHZhbHVlcyBhbHNvLlxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuaXNfcnRsICkge1xuXHRcdFx0XHRvcHRpb25zWyAncnRsJyBdID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1jaG9zZW4nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdC8vIElmIGhpZXJhcmNoeSBlbmFibGVkIHRoZW4gd2Ugc2hvdyB0aGUgc2VsZWN0ZWQgb3B0aW9ucy5cblx0XHRcdFx0aWYgKCAkdGhpcy5oYXNDbGFzcyggJ2hhcy1oaWVyYXJjaHknICkgKSB7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucycgXSA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucycgXSA9IHdjYXBmX3BhcmFtcy5jaG9zZW5fZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gRW5hYmxlIHRlbXBsYXRpbmcgd2hlbiBzaG93aW5nIGNvdW50LlxuXHRcdFx0XHRpZiAoICR0aGlzLmhhc0NsYXNzKCAnd2l0aC1jb3VudCcgKSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAndGVtcGxhdGVSZXN1bHQnIF0gICAgPSB0ZW1wbGF0ZVJlc3VsdDtcblx0XHRcdFx0XHRvcHRpb25zWyAndGVtcGxhdGVTZWxlY3Rpb24nIF0gPSB0ZW1wbGF0ZVNlbGVjdGlvbjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIERpc2FibGUgc2VhcmNoIGJveC5cblx0XHRcdFx0aWYgKCAhICR0aGlzLmRhdGEoICdlbmFibGUtc2VhcmNoJyApICkge1xuXHRcdFx0XHRcdG9wdGlvbnNbICdkaXNhYmxlX3NlYXJjaCcgXSA9IHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkdGhpcy5jaG9zZW5XQ0FQRiggb3B0aW9ucyApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBBdHRhY2ggY2hvc2VuIGZvciBkZWZhdWx0IG9yZGVyYnkuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5hdHRhY2hfY2hvc2VuX29uX3NvcnRpbmcgKSB7XG5cdFx0XHRcdGxldCBkaXNhYmxlU2VhcmNoID0gdHJ1ZTtcblxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zZWFyY2hfYm94X2luX2RlZmF1bHRfb3JkZXJieSApIHtcblx0XHRcdFx0XHRkaXNhYmxlU2VhcmNoID0gZmFsc2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRvcHRpb25zWyAnZGlzYWJsZV9zZWFyY2gnIF0gPSBkaXNhYmxlU2VhcmNoO1xuXG5cdFx0XHRcdCRib2R5LmZpbmQoICcud29vY29tbWVyY2Utb3JkZXJpbmcgc2VsZWN0Lm9yZGVyYnknICkuY2hvc2VuV0NBUEYoIG9wdGlvbnMgKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGluaXRSYW5nZVNsaWRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQkYm9keS5maW5kKCAnLndjYXBmLXJhbmdlLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGl0ZW0gICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgJHNsaWRlciA9ICRpdGVtLmZpbmQoICcud2NhcGYtbm91aS1zbGlkZXInICk7XG5cblx0XHRcdFx0Y29uc3Qgc2xpZGVySWQgICAgICAgICAgPSAkc2xpZGVyLmF0dHIoICdpZCcgKTtcblx0XHRcdFx0Y29uc3QgZGlzcGxheVZhbHVlc0FzICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kaXNwbGF5LXZhbHVlcy1hcycgKTtcblx0XHRcdFx0Y29uc3QgZm9ybWF0TnVtYmVycyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1mb3JtYXQtbnVtYmVycycgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgc3RlcCAgICAgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1zdGVwJyApICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1wbGFjZXMnICk7XG5cdFx0XHRcdGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gJGl0ZW0uYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBtaW5WYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBtYXhWYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCAkbWluVmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWluLXZhbHVlJyApO1xuXHRcdFx0XHRjb25zdCAkbWF4VmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWF4LXZhbHVlJyApO1xuXG5cdFx0XHRcdGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBzbGlkZXJJZCApO1xuXG5cdFx0XHRcdG5vVWlTbGlkZXIuY3JlYXRlKCBzbGlkZXIsIHtcblx0XHRcdFx0XHRzdGFydDogWyBtaW5WYWx1ZSwgbWF4VmFsdWUgXSxcblx0XHRcdFx0XHRzdGVwLFxuXHRcdFx0XHRcdGNvbm5lY3Q6IHRydWUsXG5cdFx0XHRcdFx0Y3NzUHJlZml4OiAnd2NhcGYtbm91aS0nLFxuXHRcdFx0XHRcdHJhbmdlOiB7XG5cdFx0XHRcdFx0XHQnbWluJzogcmFuZ2VNaW5WYWx1ZSxcblx0XHRcdFx0XHRcdCdtYXgnOiByYW5nZU1heFZhbHVlLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAndXBkYXRlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHRsZXQgbWluVmFsdWU7XG5cdFx0XHRcdFx0bGV0IG1heFZhbHVlO1xuXG5cdFx0XHRcdFx0aWYgKCBmb3JtYXROdW1iZXJzICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSBudW1iZXJGb3JtYXQoIHZhbHVlc1sgMCBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSBudW1iZXJGb3JtYXQoIHZhbHVlc1sgMSBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMSBdICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCAncGxhaW5fdGV4dCcgPT09IGRpc3BsYXlWYWx1ZXNBcyApIHtcblx0XHRcdFx0XHRcdCRtaW5WYWx1ZS5odG1sKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdFx0JG1heFZhbHVlLmh0bWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRtaW5WYWx1ZS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0XHQkbWF4VmFsdWUudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1ub3Vpc2xpZGVyLXVwZGF0ZScsIFsgJGl0ZW0sIHZhbHVlcyBdICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRmdW5jdGlvbiBmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdFx0Y29uc3QgX21pblZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAwIF0gKTtcblx0XHRcdFx0XHRjb25zdCBfbWF4VmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDEgXSApO1xuXG5cdFx0XHRcdFx0Ly8gSWYgdmFsdWUgaXMgbm90IGNoYW5nZWQgdGhlbiBkb24ndCBwcm9jZWVkLlxuXHRcdFx0XHRcdGlmICggX21pblZhbHVlID09PSBtaW5WYWx1ZSAmJiBfbWF4VmFsdWUgPT09IG1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggX21pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIF9tYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdC8vIFJlbW92ZSByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkaXRlbS5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBBZGQgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0Y29uc3QgdXJsID0gJGl0ZW0uZGF0YSggJ3VybCcgKS5yZXBsYWNlKCAnJTFzJywgX21pblZhbHVlICkucmVwbGFjZSggJyUycycsIF9tYXhWYWx1ZSApO1xuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICdjaGFuZ2UnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0JG1pblZhbHVlLm9uKCAnaW5wdXQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRcdCRpbnB1dC5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5zZXQoIFsgbWluVmFsdWUsIG51bGwgXSApO1xuXG5cdFx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtYXhWYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG51bGwsIG1heFZhbHVlIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXRGaWx0ZXJPcHRpb25Ub29sdGlwOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHRpcHB5ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMudXNlX3RpcHB5anMgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgdG9vbHRpcFBvc2l0aW9ucyA9IFsgJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCcgXTtcblxuXHRcdFx0dG9vbHRpcFBvc2l0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbiggdG9vbHRpcFBvc2l0aW9uICkge1xuXHRcdFx0XHRjb25zdCBpZGVudGlmaWVyID0gJ2RhdGEtd2NhcGYtdG9vbHRpcC0nICsgdG9vbHRpcFBvc2l0aW9uO1xuXG5cdFx0XHRcdGNvbnN0IGluc3RhbmNlcyA9IHRpcHB5KCAnWycgKyBpZGVudGlmaWVyICsgJ10nLCB7XG5cdFx0XHRcdFx0cGxhY2VtZW50OiB0b29sdGlwUG9zaXRpb24sXG5cdFx0XHRcdFx0Y29udGVudCggcmVmZXJlbmNlICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJlZmVyZW5jZS5nZXRBdHRyaWJ1dGUoIGlkZW50aWZpZXIgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHR3aW5kb3cudGlwcHlJbnN0YW5jZXMgPSB0aXBweUluc3RhbmNlcy5jb25jYXQoIGluc3RhbmNlcyApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRXQ0FQRi5pbml0Q29tYm9ib3goKTtcblx0XHRcdFdDQVBGLmluaXRSYW5nZVNsaWRlcigpO1xuXHRcdFx0V0NBUEYuaW5pdEZpbHRlck9wdGlvblRvb2x0aXAoKTtcblx0XHR9LFxuXHRcdGluaXRQb3BTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5yZWxvYWRfb25fYmFjayAmJiB3Y2FwZl9wYXJhbXMuZm91bmRfd2NhcGYgKSB7XG5cdFx0XHRcdGhpc3RvcnkucmVwbGFjZVN0YXRlKCB7IHdjYXBmOiB0cnVlIH0sICcnLCB3aW5kb3cubG9jYXRpb24gKTtcblxuXHRcdFx0XHQvLyBIYW5kbGUgdGhlIHBvcHN0YXRlIGV2ZW50KGJyb3dzZXIncyBiYWNrL2ZvcndhcmQpXG5cdFx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAncG9wc3RhdGUnLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRpZiAoIG51bGwgIT09IGUuc3RhdGUgJiYgZS5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSggJ3djYXBmJyApICkge1xuXHRcdFx0XHRcdFx0V0NBUEYuZmlsdGVyUHJvZHVjdHMoICdwb3BzdGF0ZScgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIEVuYWJsZSBpdCBpZiBuZWNlc3NhcnkuXG5cdCAqXG5cdCAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzMzMDA0OTE3XG5cdCAqL1xuXHRpZiAoICdzY3JvbGxSZXN0b3JhdGlvbicgaW4gaGlzdG9yeSApIHtcblx0XHQvLyBoaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uID0gJ21hbnVhbCc7XG5cdH1cblxufSggalF1ZXJ5LCB3aW5kb3cgKSApO1xuXG4oIGZ1bmN0aW9uKCAkLCBXQ0FQRiApIHtcblxuXHRXQ0FQRi5pbml0KCk7XG5cdFdDQVBGLmluaXRQb3BTdGF0ZSgpO1xuXG5cdFdDQVBGLmhhbmRsZUZpbHRlckFjY29yZGlvbigpO1xuXHRXQ0FQRi5oYW5kbGVIaWVyYXJjaHlUb2dnbGUoKTtcblx0V0NBUEYuaGFuZGxlU29mdExpbWl0KCk7XG5cdFdDQVBGLmhhbmRsZVNlYXJjaEZpbHRlck9wdGlvbnMoKTtcblxuXHRXQ0FQRi5oYW5kbGVMaXN0RmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVEcm9wZG93bkZpbHRlcnMoKTtcblx0V0NBUEYuaGFuZGxlTnVtYmVySW5wdXRGaWx0ZXJzKCk7XG5cdFdDQVBGLmhhbmRsZVBhZ2luYXRpb24oKTtcblx0V0NBUEYuaGFuZGxlRGVmYXVsdE9yZGVyYnkoKTtcblxuXHRXQ0FQRi5oYW5kbGVDbGVhckZpbHRlcigpO1xuXG5cdFdDQVBGLmhhbmRsZUZpbHRlclRvb2x0aXAoKTtcblxufSggalF1ZXJ5LCB3aW5kb3cuV0NBUEYgKSApO1xuIiwiLyoqXG4gKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNDE0MTgxM1xuICpcbiAqIEBwYXJhbSBudW1iZXJcbiAqIEBwYXJhbSBkZWNpbWFsc1xuICogQHBhcmFtIGRlY19wb2ludFxuICogQHBhcmFtIHRob3VzYW5kc19zZXBcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBudW1iZXJGb3JtYXQoIG51bWJlciwgZGVjaW1hbHMsIGRlY19wb2ludCwgdGhvdXNhbmRzX3NlcCApIHtcblx0Ly8gU3RyaXAgYWxsIGNoYXJhY3RlcnMgYnV0IG51bWVyaWNhbCBvbmVzLlxuXHRudW1iZXIgPSAoIG51bWJlciArICcnICkucmVwbGFjZSggL1teXFxkK1xcLUVlLl0vZywgJycgKTtcblxuXHRjb25zdCBuICAgID0gISBpc0Zpbml0ZSggK251bWJlciApID8gMCA6ICtudW1iZXI7XG5cdGNvbnN0IHByZWMgPSAhIGlzRmluaXRlKCArZGVjaW1hbHMgKSA/IDAgOiBNYXRoLmFicyggZGVjaW1hbHMgKTtcblx0Y29uc3Qgc2VwICA9ICggdHlwZW9mIHRob3VzYW5kc19zZXAgPT09ICd1bmRlZmluZWQnICkgPyAnLCcgOiB0aG91c2FuZHNfc2VwO1xuXHRjb25zdCBkZWMgID0gKCB0eXBlb2YgZGVjX3BvaW50ID09PSAndW5kZWZpbmVkJyApID8gJy4nIDogZGVjX3BvaW50O1xuXG5cdGxldCBzO1xuXG5cdGNvbnN0IHRvRml4ZWRGaXggPSBmdW5jdGlvbiggbiwgcHJlYyApIHtcblx0XHRjb25zdCBrID0gTWF0aC5wb3coIDEwLCBwcmVjICk7XG5cdFx0cmV0dXJuICcnICsgTWF0aC5yb3VuZCggbiAqIGsgKSAvIGs7XG5cdH07XG5cblx0Ly8gRml4IGZvciBJRSBwYXJzZUZsb2F0KDAuNTUpLnRvRml4ZWQoMCkgPSAwO1xuXHRzID0gKCBwcmVjID8gdG9GaXhlZEZpeCggbiwgcHJlYyApIDogJycgKyBNYXRoLnJvdW5kKCBuICkgKS5zcGxpdCggJy4nICk7XG5cblx0aWYgKCBzWyAwIF0ubGVuZ3RoID4gMyApIHtcblx0XHRzWyAwIF0gPSBzWyAwIF0ucmVwbGFjZSggL1xcQig/PSg/OlxcZHszfSkrKD8hXFxkKSkvZywgc2VwICk7XG5cdH1cblxuXHRpZiAoICggc1sgMSBdIHx8ICcnICkubGVuZ3RoIDwgcHJlYyApIHtcblx0XHRzWyAxIF0gPSBzWyAxIF0gfHwgJyc7XG5cdFx0c1sgMSBdICs9IG5ldyBBcnJheSggcHJlYyAtIHNbIDEgXS5sZW5ndGggKyAxICkuam9pbiggJzAnICk7XG5cdH1cblxuXHRyZXR1cm4gcy5qb2luKCBkZWMgKTtcbn1cblxuZnVuY3Rpb24gY2xlYW5VcmwoIHVybCApIHtcblx0cmV0dXJuIHVybC5yZXBsYWNlKCAvJTJDL2csICcsJyApO1xufVxuXG5mdW5jdGlvbiBnZXRPcmRlckJ5VXJsKCB1cmwgKSB7XG5cdGNvbnN0IHBhZ2VkID0gcGFyc2VJbnQoIHVybC5yZXBsYWNlKCAvLitcXC9wYWdlXFwvKFxcZCspKy8sICckMScgKSApO1xuXG5cdGlmICggcGFnZWQgKSB7XG5cdFx0dXJsID0gdXJsLnJlcGxhY2UoIC9wYWdlXFwvKFxcZCspXFwvLywgJycgKTtcblx0fVxuXG5cdHJldHVybiBjbGVhblVybCggdXJsICk7XG59XG4iXX0=
