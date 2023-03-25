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
  'shop_loop_container': '',
  'not_found_container': '',
  'pagination_container': '',
  'enable_pagination_via_ajax': '',
  'sorting_control': '',
  'attach_chosen_on_sorting': '',
  'loading_animation': '',
  'scroll_window': '',
  'scroll_window_for': '',
  'scroll_window_when': '',
  'scroll_window_custom_element': '',
  'scroll_to_top_offset': '',
  'disable_scroll_animation': '',
  'more_selectors': '',
  'custom_scripts': ''
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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

      if (wcapf_params.custom_scripts) {
        eval(wcapf_params.custom_scripts);
      }

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

      var defaults = {
        inherit_select_classes: true,
        inherit_option_classes: true,
        no_results_text: wcapf_params.chosen_no_results_text,
        options_none_text: wcapf_params.chosen_options_none_text,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbHRlci1mb3JtLmpzIiwicmVmYWN0b3JlZC5qcyIsInV0aWxzLmpzIl0sIm5hbWVzIjpbIndjYXBmX3BhcmFtcyIsImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwiJGJvZHkiLCJyYW5nZVZhbHVlc1NlcGFyYXRvciIsIl9kZWxheSIsInBhcnNlSW50IiwiZmlsdGVyX2lucHV0X2RlbGF5IiwiZGVsYXkiLCJmaWVsZHMiLCJ3Y2FwZlNpbmdsZUZpbHRlclNlbGVjdG9yIiwid2NhcGZOYXZGaWx0ZXJTZWxlY3RvciIsIndjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJTZWxlY3RvciIsIndjYXBmRGF0ZUZpbHRlclNlbGVjdG9yIiwiJHdjYXBmU2luZ2xlRmlsdGVycyIsIiR3Y2FwZk5hdkZpbHRlcnMiLCIkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMiLCIkd2NhcGZEYXRlRmlsdGVycyIsImVhY2giLCIkZmllbGQiLCJpZCIsImF0dHIiLCIkd3JhcHBlciIsImZpbmQiLCJmaWx0ZXJLZXkiLCJtdWx0aXBsZUZpbHRlciIsImluaXRDaG9zZW4iLCJjaG9zZW4iLCIkcm9vdCIsImZvcl9wcmV2aWV3IiwiJHRoaXMiLCJvcHRpb25zIiwiaW5oZXJpdF9zZWxlY3RfY2xhc3NlcyIsImluaGVyaXRfb3B0aW9uX2NsYXNzZXMiLCJpc19ydGwiLCJub1Jlc3VsdHNNZXNzYWdlIiwic2VhcmNoVGhyZXNob2xkIiwiY2hvc2VuX2xpYl9zZWFyY2hfdGhyZXNob2xkIiwiaW5pdEhpZXJhcmNoeUFjY29yZGlvbiIsInRvZ2dsZUFjY29yZGlvbiIsIiRlbCIsInByZXNzZWQiLCIkY2hpbGQiLCJjbG9zZXN0IiwiY2hpbGRyZW4iLCJlbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uIiwic2xpZGVUb2dnbGUiLCJoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsInRvZ2dsZSIsIm9uIiwiZSIsImtleSIsInByZXZlbnREZWZhdWx0IiwibnVtYmVyX2Zvcm1hdCIsIm51bWJlciIsImRlY2ltYWxzIiwiZGVjX3BvaW50IiwidGhvdXNhbmRzX3NlcCIsInJlcGxhY2UiLCJuIiwiaXNGaW5pdGUiLCJwcmVjIiwiTWF0aCIsImFicyIsInNlcCIsImRlYyIsInMiLCJ0b0ZpeGVkRml4IiwiayIsInBvdyIsInJvdW5kIiwic3BsaXQiLCJsZW5ndGgiLCJBcnJheSIsImpvaW4iLCJpbml0Tm9VSVNsaWRlciIsIm5vVWlTbGlkZXIiLCIkaXRlbSIsIiRzbGlkZXIiLCJoYXNDbGFzcyIsInNsaWRlcklkIiwiZGlzcGxheVZhbHVlc0FzIiwiZm9ybWF0TnVtYmVycyIsInJhbmdlTWluVmFsdWUiLCJwYXJzZUZsb2F0IiwicmFuZ2VNYXhWYWx1ZSIsInN0ZXAiLCJkZWNpbWFsUGxhY2VzIiwidGhvdXNhbmRTZXBhcmF0b3IiLCJkZWNpbWFsU2VwYXJhdG9yIiwibWluVmFsdWUiLCJtYXhWYWx1ZSIsIiRtaW5WYWx1ZSIsIiRtYXhWYWx1ZSIsInNsaWRlciIsImdldEVsZW1lbnRCeUlkIiwiY3JlYXRlIiwic3RhcnQiLCJjb25uZWN0IiwiY3NzUHJlZml4IiwicmFuZ2UiLCJ2YWx1ZXMiLCJodG1sIiwidmFsIiwidHJpZ2dlciIsImZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIiLCJyZXF1ZXN0RmlsdGVyIiwiZGF0YSIsInVybCIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJyZW1vdmVEYXRhIiwiZXZlbnQiLCIkaW5wdXQiLCJzZXQiLCJnZXQiLCJmaWx0ZXJCeURhdGUiLCIkd2NhcGZEYXRlRmlsdGVyIiwiaXNSYW5nZSIsImZpbHRlclZhbHVlIiwicnVuRmlsdGVyIiwiZnJvbSIsInRvIiwidXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIiLCJxdWVyeSIsInJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsImZpbHRlclByb2R1Y3RzIiwiaW5pdERhdGVwaWNrZXIiLCJkYXRlcGlja2VyIiwiZm9ybWF0IiwieWVhckRyb3Bkb3duIiwibW9udGhEcm9wZG93biIsIiRmcm9tIiwiJHRvIiwiZGF0ZUZvcm1hdCIsImNoYW5nZVllYXIiLCJjaGFuZ2VNb250aCIsImluaXREZWZhdWx0T3JkZXJCeSIsImF0dGFjaF9jaG9zZW5fb25fc29ydGluZyIsInNvcnRpbmdfY29udHJvbCIsIiRvcmRlcmluZ0Zvcm0iLCJzdWJtaXQiLCJvcmRlciIsImZpbHRlcl9rZXkiLCJ1cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0IiwiJHJlc3VsdHMiLCJzZWxlY3RvciIsInNob3BfbG9vcF9jb250YWluZXIiLCJuZXdQcm9kdWN0Q291bnQiLCJzaG93TG9hZGluZ0FuaW1hdGlvbiIsImxvYWRpbmdfYW5pbWF0aW9uIiwiTG9hZGluZ092ZXJsYXkiLCJsb2FkaW5nX292ZXJsYXlfb3B0aW9ucyIsImRpc2FibGVOb1VpU2xpZGVycyIsImVsZW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJkaXNhYmxlTGFiZWxzIiwic2VsZWN0b3JzIiwiYWRkQ2xhc3MiLCJkaXNhYmxlSW5wdXRzIiwiZGlzYWJsZV9pbnB1dHNfd2hpbGVfZmV0Y2hpbmdfcmVzdWx0cyIsImlucHV0cyIsImVuYWJsZU5vVWlTbGlkZXJzIiwicmVtb3ZlQXR0cmlidXRlIiwiZW5hYmxlSW5wdXRzIiwicmVtb3ZlQXR0ciIsInJlc2V0TG9hZGluZ0FuaW1hdGlvbiIsInNjcm9sbFRvIiwic2Nyb2xsX3dpbmRvdyIsInNjcm9sbEZvciIsInNjcm9sbF93aW5kb3dfZm9yIiwiaXNNb2JpbGUiLCJpc19tb2JpbGUiLCJwcm9jZWVkIiwiYWRqdXN0aW5nT2Zmc2V0Iiwib2Zmc2V0Iiwic2Nyb2xsX3RvX3RvcF9vZmZzZXQiLCJjb250YWluZXIiLCJub3RfZm91bmRfY29udGFpbmVyIiwic2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudCIsIiRjb250YWluZXIiLCJ0b3AiLCJzdG9wIiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsInNjcm9sbF90b190b3Bfc3BlZWQiLCJzY3JvbGxfdG9fdG9wX2Vhc2luZyIsImJlZm9yZUZldGNoaW5nUHJvZHVjdHMiLCJzY3JvbGxfd2luZG93X3doZW4iLCJiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzIiwiYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzIiwiZm9yY2VSZVJlbmRlciIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsIiRkYXRhIiwiZmllbGRJRCIsIiRpbm5lciIsIl9maWVsZCIsImZpZWxkQ2xhc3NlcyIsInByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUiLCJpdGVtVmFsdWUiLCJwYXJlbnQiLCJ0b2dnbGVTZWxlY3RvciIsInVsU2VsZWN0b3IiLCJfY2xhc3NlcyIsInNob3ciLCJfaHRtbCIsInNvZnRMaW1pdFNlbGVjdG9yIiwidHJpbSIsIiRzaG9wTG9vcENvbnRhaW5lciIsIiRub3RGb3VuZENvbnRhaW5lciIsImdldFVybFZhcnMiLCJ2YXJzIiwiaGFzaCIsInJlcGxhY2VBbGwiLCJoYXNoZXMiLCJzbGljZSIsImluZGV4T2YiLCJoTGVuZ3RoIiwiaSIsImZpeFBhZ2luYXRpb24iLCJwYXJhbXMiLCJjdXJyZW50UGFnZUluVXJsIiwiY3VycmVudFBhZ2VJblBhcmFtcyIsInZhbHVlIiwicHVzaEhpc3RvcnkiLCJyZSIsIlJlZ0V4cCIsInNlcGFyYXRvciIsInVybFdpdGhRdWVyeSIsIm1hdGNoIiwib2xkUGFyYW1zIiwib2xkUGFyYW1zTGVuZ3RoIiwiT2JqZWN0Iiwia2V5cyIsInN0YXJ0UG9zaXRpb24iLCJmaWx0ZXJLZXlQb3NpdGlvbiIsImNsZWFuVXJsIiwiY2xlYW5RdWVyeSIsIm5ld1BhcmFtcyIsIm1ha2VQYXJhbWV0ZXJzIiwiZm9yY2VSZXJlbmRlciIsInZhbHVlU2VwYXJhdG9yIiwibmV4dFZhbHVlcyIsImVtcHR5VmFsdWUiLCJwcmV2VmFsdWVzIiwicHJldlZhbHVlc0FycmF5IiwiZm91bmQiLCJpbkFycmF5Iiwic3BsaWNlIiwicHVzaCIsInNpbmdsZUZpbHRlciIsImVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4IiwicGFnaW5hdGlvbl9jb250YWluZXIiLCJoYW5kbGVGaWx0ZXJSZXF1ZXN0IiwiZmllbGREYXRhIiwiJHNlbGVjdCIsImZpbHRlclVSTCIsImNsZWFyRmlsdGVyVVJMIiwidG9TdHJpbmciLCJyYW5nZU51bWJlclNlbGVjdG9ycyIsIiRyYW5nZU51bWJlciIsImdldFZhbHVlIiwiZmxvYXRWYWx1ZSIsImlzTmFOIiwicmVzZXRGaWx0ZXJzIiwiJGJ1dHRvbiIsIl9maWx0ZXJLZXlzIiwiZmlsdGVyS2V5cyIsInByZXZVcmwiLCJuZXdVcmwiLCJhcHBseV9maWx0ZXJzX29uX2Jyb3dzZXJfaGlzdG9yeV9jaGFuZ2UiLCJiaW5kIiwiaW5zdGFuY2VJZHMiLCJmb2N1c2VkRWxtIiwidGlwcHlJbnN0YW5jZXMiLCJXQ0FQRiIsImhhbmRsZUZpbHRlckFjY29yZGlvbiIsIiRmaWx0ZXJJbm5lciIsImVuYWJsZV9hbmltYXRpb25fZm9yX2ZpbHRlcl9hY2NvcmRpb24iLCJmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsInN0b3BQcm9wYWdhdGlvbiIsIiR0cmlnZ2VyIiwiaGFuZGxlSGllcmFyY2h5VG9nZ2xlIiwiaGFuZGxlU29mdExpbWl0IiwidG9nZ2xlRmlsdGVyT3B0aW9ucyIsIiRsaXN0V3JhcHBlciIsInJlbW92ZUNsYXNzIiwiaGFuZGxlU2VhcmNoRmlsdGVyT3B0aW9ucyIsIiR0aGF0IiwiJGZpbHRlciIsInNvZnRMaW1pdEVuYWJsZWQiLCJzb2Z0TGltaXRUb2dnbGUiLCJub1Jlc3VsdHMiLCJ2aXNpYmxlT3B0aW9ucyIsImtleXdvcmQiLCJpbmRleCIsIiRmaWx0ZXJJdGVtIiwidGV4dCIsImhpZGUiLCJsYWJlbCIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCIkcmVzcG9uc2UiLCJuZXdDb3VudCIsImhhcyIsInRyaWdnZXJlZEJ5IiwiYWxsb3dlZCIsInNjcm9sbFdoZW4iLCJkaXNhYmxlX3Njcm9sbF9hbmltYXRpb24iLCJhY3RpdmVFbGVtZW50IiwiaW1tZWRpYXRlX3Njcm9sbF9vbl9wYWdpbmF0ZSIsImRlc3Ryb3lUaXBweUluc3RhbmNlcyIsInVzZV90aXBweWpzIiwiZm9yRWFjaCIsImluc3RhbmNlIiwiZGVzdHJveSIsInJlc3RvcmVfZm9jdXNfYWZ0ZXJfZmlsdGVyaW5nIiwiYm9keSIsImZvY3VzIiwiaW5pdCIsImN1c3RvbV9zY3JpcHRzIiwiZXZhbCIsImFqYXgiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJ1cGRhdGVfZG9jdW1lbnRfdGl0bGUiLCJ0aXRsZSIsImZpbHRlciIsImluc3RhbmNlSWQiLCIkaW5zdGFuY2UiLCJfaW5zdGFuY2UiLCJwcmVzZXJ2ZV9zb2Z0X2xpbWl0X3N0YXRlIiwiaG9zdG5hbWUiLCJ3Y2FwZiIsImhhbmRsZU51bWJlcklucHV0RmlsdGVycyIsIm9sZE1pblZhbHVlIiwib2xkTWF4VmFsdWUiLCJudW1iZXJGb3JtYXQiLCJoYW5kbGVMaXN0RmlsdGVycyIsIm5hdGl2ZUlucHV0cyIsInRvZ2dsZUNsYXNzIiwiY3VzdG9tUmFkaW9TZWxlY3RvciIsIm5vdCIsInByb3AiLCJoYW5kbGVEcm9wZG93bkZpbHRlcnMiLCJoYW5kbGVQYWdpbmF0aW9uIiwiX3NlbGVjdG9ycyIsImhhbmRsZURlZmF1bHRPcmRlcmJ5IiwiVVJMIiwic2VhcmNoUGFyYW1zIiwiZ2V0T3JkZXJCeVVybCIsImhhbmRsZUNsZWFyRmlsdGVyIiwiaGFuZGxlRmlsdGVyVG9vbHRpcCIsInRpcHB5IiwicGxhY2VtZW50IiwiY29udGVudCIsInJlZmVyZW5jZSIsImdldEF0dHJpYnV0ZSIsImFsbG93SFRNTCIsImluaXRDb21ib2JveCIsImNob3NlbldDQVBGIiwidGVtcGxhdGVSZXN1bHQiLCJ0ZW1wbGF0ZVNlbGVjdGlvbiIsImNvdW50IiwiZGVmYXVsdHMiLCJub19yZXN1bHRzX3RleHQiLCJjaG9zZW5fbm9fcmVzdWx0c190ZXh0Iiwib3B0aW9uc19ub25lX3RleHQiLCJjaG9zZW5fb3B0aW9uc19ub25lX3RleHQiLCJzZWFyY2hfY29udGFpbnMiLCJzZWFyY2hfaW5fdmFsdWVzIiwiY2hvc2VuX2Rpc3BsYXlfc2VsZWN0ZWRfb3B0aW9ucyIsImRpc2FibGVTZWFyY2giLCJzZWFyY2hfYm94X2luX2RlZmF1bHRfb3JkZXJieSIsImluaXRSYW5nZVNsaWRlciIsIl9taW5WYWx1ZSIsIl9tYXhWYWx1ZSIsImluaXRGaWx0ZXJPcHRpb25Ub29sdGlwIiwidG9vbHRpcFBvc2l0aW9ucyIsInRvb2x0aXBQb3NpdGlvbiIsImlkZW50aWZpZXIiLCJpbnN0YW5jZXMiLCJjb25jYXQiLCJpbml0UG9wU3RhdGUiLCJyZWxvYWRfb25fYmFjayIsImZvdW5kX3djYXBmIiwicmVwbGFjZVN0YXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInN0YXRlIiwiaGFzT3duUHJvcGVydHkiLCJwYWdlZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsWUFBWSxHQUFHQSxZQUFZLElBQUk7QUFDcEMsWUFBVSxFQUQwQjtBQUVwQyx3QkFBc0IsRUFGYztBQUdwQyxxQ0FBbUMsRUFIQztBQUlwQyw0QkFBMEIsRUFKVTtBQUtwQyw4QkFBNEIsRUFMUTtBQU1wQyxtQ0FBaUMsRUFORztBQU9wQyx3Q0FBc0MsRUFQRjtBQVFwQywrQkFBNkIsRUFSTztBQVNwQywyQ0FBeUMsRUFUTDtBQVVwQyxzQ0FBb0MsRUFWQTtBQVdwQyx1Q0FBcUMsRUFYRDtBQVlwQyw4Q0FBNEMsRUFaUjtBQWFwQyx5Q0FBdUMsRUFiSDtBQWNwQywwQ0FBd0MsRUFkSjtBQWVwQyxtQ0FBaUMsRUFmRztBQWdCcEMsNkJBQTJCLEVBaEJTO0FBaUJwQyx5QkFBdUIsRUFqQmE7QUFrQnBDLDBCQUF3QixFQWxCWTtBQW1CcEMsa0NBQWdDLEVBbkJJO0FBb0JwQyxlQUFhLEVBcEJ1QjtBQXFCcEMsb0JB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QUFDLENBQUUsQ0FBRixDQUFELEdBQVNBLENBQUMsQ0FBRSxDQUFGLENBQUQsSUFBVSxFQUFuQjtBQUNBQSxJQUFBQSxDQUFDLENBQUUsQ0FBRixDQUFELElBQVUsSUFBSU8sS0FBSixDQUFXWixJQUFJLEdBQUdLLENBQUMsQ0FBRSxDQUFGLENBQUQsQ0FBT00sTUFBZCxHQUF1QixDQUFsQyxFQUFzQ0UsSUFBdEMsQ0FBNEMsR0FBNUMsQ0FBVjtBQUNBOztBQUVELFNBQU9SLENBQUMsQ0FBQ1EsSUFBRixDQUFRVCxHQUFSLENBQVA7QUFDQTs7QUFFRCxTQUFTK0ssUUFBVCxDQUFtQnBJLEdBQW5CLEVBQXlCO0FBQ3hCLFNBQU9BLEdBQUcsQ0FBQ2xELE9BQUosQ0FBYSxNQUFiLEVBQXFCLEdBQXJCLENBQVA7QUFDQTs7QUFFRCxTQUFTeVMsYUFBVCxDQUF3QnZQLEdBQXhCLEVBQThCO0FBQzdCLE1BQU0rUixLQUFLLEdBQUd0WSxRQUFRLENBQUV1RyxHQUFHLENBQUNsRCxPQUFKLENBQWEsa0JBQWIsRUFBaUMsSUFBakMsQ0FBRixDQUF0Qjs7QUFFQSxNQUFLaVYsS0FBTCxFQUFhO0FBQ1ovUixJQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ2xELE9BQUosQ0FBYSxlQUFiLEVBQThCLEVBQTlCLENBQU47QUFDQTs7QUFFRCxTQUFPc0wsUUFBUSxDQUFFcEksR0FBRixDQUFmO0FBQ0EiLCJmaWxlIjoid2MtYWpheC1wcm9kdWN0LWZpbHRlci1wdWJsaWMtc2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIGZyb250ZW5kIGZpbHRlciBmb3JtLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL3B1YmxpYy9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5jb25zdCB3Y2FwZl9wYXJhbXMgPSB3Y2FwZl9wYXJhbXMgfHwge1xuXHQnaXNfcnRsJzogJycsXG5cdCdmaWx0ZXJfaW5wdXRfZGVsYXknOiAnJyxcblx0J2Nob3Nlbl9kaXNwbGF5X3NlbGVjdGVkX29wdGlvbnMnOiAnJyxcblx0J2Nob3Nlbl9ub19yZXN1bHRzX3RleHQnOiAnJyxcblx0J2Nob3Nlbl9vcHRpb25zX25vbmVfdGV4dCc6ICcnLFxuXHQnc2VhcmNoX2JveF9pbl9kZWZhdWx0X29yZGVyYnknOiAnJyxcblx0J3ByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUnOiAnJyxcblx0J3ByZXNlcnZlX3NvZnRfbGltaXRfc3RhdGUnOiAnJyxcblx0J2VuYWJsZV9hbmltYXRpb25fZm9yX2ZpbHRlcl9hY2NvcmRpb24nOiAnJyxcblx0J2ZpbHRlcl9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkJzogJycsXG5cdCdmaWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmcnOiAnJyxcblx0J2VuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24nOiAnJyxcblx0J2hpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkJzogJycsXG5cdCdoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmcnOiAnJyxcblx0J3Jlc3RvcmVfZm9jdXNfYWZ0ZXJfZmlsdGVyaW5nJzogJycsXG5cdCdsb2FkaW5nX292ZXJsYXlfb3B0aW9ucyc6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9zcGVlZCc6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9lYXNpbmcnOiAnJyxcblx0J2ltbWVkaWF0ZV9zY3JvbGxfb25fcGFnaW5hdGUnOiAnJyxcblx0J2lzX21vYmlsZSc6ICcnLFxuXHQncmVsb2FkX29uX2JhY2snOiAnJyxcblx0J2ZvdW5kX3djYXBmJzogJycsXG5cdCd1cGRhdGVfZG9jdW1lbnRfdGl0bGUnOiAnJyxcblx0J3VzZV90aXBweWpzJzogJycsXG5cdCdzaG9wX2xvb3BfY29udGFpbmVyJzogJycsXG5cdCdub3RfZm91bmRfY29udGFpbmVyJzogJycsXG5cdCdwYWdpbmF0aW9uX2NvbnRhaW5lcic6ICcnLFxuXHQnZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXgnOiAnJyxcblx0J3NvcnRpbmdfY29udHJvbCc6ICcnLFxuXHQnYXR0YWNoX2Nob3Nlbl9vbl9zb3J0aW5nJzogJycsXG5cdCdsb2FkaW5nX2FuaW1hdGlvbic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvdyc6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd19mb3InOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfd2hlbic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudCc6ICcnLFxuXHQnc2Nyb2xsX3RvX3RvcF9vZmZzZXQnOiAnJyxcblx0J2Rpc2FibGVfc2Nyb2xsX2FuaW1hdGlvbic6ICcnLFxuXHQnbW9yZV9zZWxlY3RvcnMnOiAnJyxcblx0J2N1c3RvbV9zY3JpcHRzJzogJycsXG59O1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdHJldHVybjtcblxuXHRjb25zdCAkYm9keSA9ICQoICdib2R5JyApO1xuXG5cdGNvbnN0IHJhbmdlVmFsdWVzU2VwYXJhdG9yID0gJ34nO1xuXG5cdGNvbnN0IF9kZWxheSA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuZmlsdGVyX2lucHV0X2RlbGF5ICk7XG5cdGNvbnN0IGRlbGF5ICA9IF9kZWxheSA+PSAwID8gX2RlbGF5IDogODAwO1xuXG5cdC8vIFN0b3JlIGZpZWxkcycgaWQgYW5kIGZpbHRlciBpbmZvcm1hdGlvbi5cblx0Y29uc3QgZmllbGRzID0ge307XG5cblx0Y29uc3Qgd2NhcGZTaW5nbGVGaWx0ZXJTZWxlY3RvciAgICAgID0gJy53Y2FwZi1zaW5nbGUtZmlsdGVyJztcblx0Y29uc3Qgd2NhcGZOYXZGaWx0ZXJTZWxlY3RvciAgICAgICAgID0gJy53Y2FwZi1uYXYtZmlsdGVyJztcblx0Y29uc3Qgd2NhcGZOdW1iZXJSYW5nZUZpbHRlclNlbGVjdG9yID0gJy53Y2FwZi1udW1iZXItcmFuZ2UtZmlsdGVyJztcblx0Y29uc3Qgd2NhcGZEYXRlRmlsdGVyU2VsZWN0b3IgICAgICAgID0gJy53Y2FwZi1kYXRlLXJhbmdlLWZpbHRlcic7XG5cblx0Y29uc3QgJHdjYXBmU2luZ2xlRmlsdGVycyAgICAgID0gJCggd2NhcGZTaW5nbGVGaWx0ZXJTZWxlY3RvciApO1xuXHRjb25zdCAkd2NhcGZOYXZGaWx0ZXJzICAgICAgICAgPSAkKCB3Y2FwZk5hdkZpbHRlclNlbGVjdG9yICk7XG5cdGNvbnN0ICR3Y2FwZk51bWJlclJhbmdlRmlsdGVycyA9ICQoIHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJTZWxlY3RvciApO1xuXHRjb25zdCAkd2NhcGZEYXRlRmlsdGVycyAgICAgICAgPSAkKCB3Y2FwZkRhdGVGaWx0ZXJTZWxlY3RvciApO1xuXG5cdCR3Y2FwZlNpbmdsZUZpbHRlcnMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgaWQgICAgICAgICAgICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtaWQnICk7XG5cdFx0Y29uc3QgJHdyYXBwZXIgICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1maWVsZC1pbm5lciA+IGRpdicgKTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICA9ICR3cmFwcGVyLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0Y29uc3QgbXVsdGlwbGVGaWx0ZXIgPSBwYXJzZUludCggJHdyYXBwZXIuYXR0ciggJ2RhdGEtbXVsdGlwbGUtZmlsdGVyJyApICk7XG5cblx0XHRmaWVsZHNbIGlkIF0gPSB7XG5cdFx0XHRmaWx0ZXJLZXk6IGZpbHRlcktleSxcblx0XHRcdG11bHRpcGxlRmlsdGVyOiBtdWx0aXBsZUZpbHRlclxuXHRcdH07XG5cdH0gKTtcblxuXHQvLyBJbml0aWFsaXplIGpRdWVyeSBjaG9zZW4gbGlicmFyeS5cblx0ZnVuY3Rpb24gaW5pdENob3NlbigpIHtcblx0XHRpZiAoICEgalF1ZXJ5KCkuY2hvc2VuICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCAkcm9vdDtcblxuXHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0JHJvb3QgPSAkKCB3Y2FwZk5hdkZpbHRlclNlbGVjdG9yICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRyb290ID0gJHdjYXBmTmF2RmlsdGVycztcblx0XHR9XG5cblx0XHQkcm9vdC5maW5kKCAnLndjYXBmLWNob3Nlbi1zZWxlY3QnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyAgID0gJCggdGhpcyApO1xuXHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHtcblx0XHRcdFx0aW5oZXJpdF9zZWxlY3RfY2xhc3NlczogdHJ1ZSxcblx0XHRcdFx0aW5oZXJpdF9vcHRpb25fY2xhc3NlczogdHJ1ZSxcblx0XHRcdH07XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmlzX3J0bCApIHtcblx0XHRcdFx0b3B0aW9uc1sgJ3J0bCcgXSA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG5vUmVzdWx0c01lc3NhZ2UgPSAkdGhpcy5hdHRyKCAnZGF0YS1uby1yZXN1bHRzLW1lc3NhZ2UnICk7XG5cblx0XHRcdGlmICggbm9SZXN1bHRzTWVzc2FnZSApIHtcblx0XHRcdFx0b3B0aW9uc1sgJ25vX3Jlc3VsdHNfdGV4dCcgXSA9IG5vUmVzdWx0c01lc3NhZ2U7XG5cdFx0XHR9XG5cblx0XHRcdC8vIG9wdGlvbnNbICdkaXNhYmxlX3NlYXJjaCcgXSA9IHRydWU7XG5cblx0XHRcdGNvbnN0IHNlYXJjaFRocmVzaG9sZCA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuY2hvc2VuX2xpYl9zZWFyY2hfdGhyZXNob2xkICk7XG5cblx0XHRcdGlmICggc2VhcmNoVGhyZXNob2xkICkge1xuXHRcdFx0XHQvLyBvcHRpb25zWyAnZGlzYWJsZV9zZWFyY2hfdGhyZXNob2xkJyBdID0gc2VhcmNoVGhyZXNob2xkO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBvcHRpb25zWyAnZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJyBdID0gZmFsc2U7XG5cblx0XHRcdC8vIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiAyMFxuXG5cdFx0XHQvLyBvcHRpb25zWydtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCddID0gLTE7XG5cblx0XHRcdCR0aGlzLmNob3Nlbiggb3B0aW9ucyApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGluaXRDaG9zZW4oKTtcblxuXHQvLyBJbml0aWFsaXplIGhpZXJhcmNoeSBhY2NvcmRpb24uXG5cdGZ1bmN0aW9uIGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKSB7XG5cdFx0bGV0ICRyb290O1xuXG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZm9yX3ByZXZpZXcgKSB7XG5cdFx0XHQkcm9vdCA9ICQoIHdjYXBmTmF2RmlsdGVyU2VsZWN0b3IgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHJvb3QgPSAkd2NhcGZOYXZGaWx0ZXJzO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRvZ2dsZUFjY29yZGlvbiggJGVsICkge1xuXHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBidXR0b24gaXMgcHJlc3NlZFxuXHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdC8vIENoYW5nZSBhcmlhLXByZXNzZWQgdG8gdGhlIG9wcG9zaXRlIHN0YXRlXG5cdFx0XHQkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICEgcHJlc3NlZCApO1xuXG5cdFx0XHRjb25zdCAkY2hpbGQgPSAkZWwuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICk7XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24gKSB7XG5cdFx0XHRcdCRjaGlsZC5zbGlkZVRvZ2dsZShcblx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQsXG5cdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZ1xuXHRcdFx0XHQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGNoaWxkLnRvZ2dsZSgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdCRyb290LmZpbmQoICcud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnICkub24oICdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkKCB0aGlzICkgKTtcblx0XHR9ICk7XG5cblx0XHQkcm9vdC5maW5kKCAnLndjYXBmLWhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJyApLm9uKCAna2V5ZG93bicsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0aWYgKCBlLmtleSA9PT0gJyAnIHx8IGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnU3BhY2ViYXInICkge1xuXHRcdFx0XHQvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvbiB0byBzdG9wIHNjcm9sbGluZyB3aGVuIHNwYWNlIGlzIHByZXNzZWRcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdHRvZ2dsZUFjY29yZGlvbiggJCggdGhpcyApICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdEhpZXJhcmNoeUFjY29yZGlvbigpO1xuXG5cdC8qKlxuXHQgKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNDE0MTgxM1xuXHQgKlxuXHQgKiBAcGFyYW0gbnVtYmVyXG5cdCAqIEBwYXJhbSBkZWNpbWFsc1xuXHQgKiBAcGFyYW0gZGVjX3BvaW50XG5cdCAqIEBwYXJhbSB0aG91c2FuZHNfc2VwXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9XG5cdCAqL1xuXHRmdW5jdGlvbiBudW1iZXJfZm9ybWF0KCBudW1iZXIsIGRlY2ltYWxzLCBkZWNfcG9pbnQsIHRob3VzYW5kc19zZXAgKSB7XG5cdFx0Ly8gU3RyaXAgYWxsIGNoYXJhY3RlcnMgYnV0IG51bWVyaWNhbCBvbmVzLlxuXHRcdG51bWJlciA9ICggbnVtYmVyICsgJycgKS5yZXBsYWNlKCAvW15cXGQrXFwtRWUuXS9nLCAnJyApO1xuXG5cdFx0Y29uc3QgbiAgICA9ICEgaXNGaW5pdGUoICtudW1iZXIgKSA/IDAgOiArbnVtYmVyO1xuXHRcdGNvbnN0IHByZWMgPSAhIGlzRmluaXRlKCArZGVjaW1hbHMgKSA/IDAgOiBNYXRoLmFicyggZGVjaW1hbHMgKTtcblx0XHRjb25zdCBzZXAgID0gKCB0eXBlb2YgdGhvdXNhbmRzX3NlcCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcsJyA6IHRob3VzYW5kc19zZXA7XG5cdFx0Y29uc3QgZGVjICA9ICggdHlwZW9mIGRlY19wb2ludCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcuJyA6IGRlY19wb2ludDtcblxuXHRcdGxldCBzO1xuXG5cdFx0Y29uc3QgdG9GaXhlZEZpeCA9IGZ1bmN0aW9uKCBuLCBwcmVjICkge1xuXHRcdFx0Y29uc3QgayA9IE1hdGgucG93KCAxMCwgcHJlYyApO1xuXHRcdFx0cmV0dXJuICcnICsgTWF0aC5yb3VuZCggbiAqIGsgKSAvIGs7XG5cdFx0fTtcblxuXHRcdC8vIEZpeCBmb3IgSUUgcGFyc2VGbG9hdCgwLjU1KS50b0ZpeGVkKDApID0gMDtcblx0XHRzID0gKCBwcmVjID8gdG9GaXhlZEZpeCggbiwgcHJlYyApIDogJycgKyBNYXRoLnJvdW5kKCBuICkgKS5zcGxpdCggJy4nICk7XG5cblx0XHRpZiAoIHNbIDAgXS5sZW5ndGggPiAzICkge1xuXHRcdFx0c1sgMCBdID0gc1sgMCBdLnJlcGxhY2UoIC9cXEIoPz0oPzpcXGR7M30pKyg/IVxcZCkpL2csIHNlcCApO1xuXHRcdH1cblxuXHRcdGlmICggKCBzWyAxIF0gfHwgJycgKS5sZW5ndGggPCBwcmVjICkge1xuXHRcdFx0c1sgMSBdID0gc1sgMSBdIHx8ICcnO1xuXHRcdFx0c1sgMSBdICs9IG5ldyBBcnJheSggcHJlYyAtIHNbIDEgXS5sZW5ndGggKyAxICkuam9pbiggJzAnICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHMuam9pbiggZGVjICk7XG5cdH1cblxuXHQvLyBJbml0aWFsaXplIG5vVUlTbGlkZXIuXG5cdGZ1bmN0aW9uIGluaXROb1VJU2xpZGVyKCkge1xuXHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCAkcm9vdDtcblxuXHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0JHJvb3QgPSAkKCB3Y2FwZk51bWJlclJhbmdlRmlsdGVyU2VsZWN0b3IgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHJvb3QgPSAkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnM7XG5cdFx0fVxuXG5cdFx0JHJvb3QuZmluZCggJy53Y2FwZi1yYW5nZS1zbGlkZXInICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0Ly8gVE9ETzogUmVtb3ZlIGZpbHRlciBrZXkuXG5cdFx0XHRjb25zdCBmaWx0ZXJLZXkgPSAkaXRlbS5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0Y29uc3QgJHNsaWRlciAgID0gJGl0ZW0uZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKTtcblxuXHRcdFx0Ly8gSWYgc2xpZGVyIGlzIGFscmVhZHkgaW5pdGlhbGl6ZWQgdGhlbiBkb24ndCByZWluaXRpYWxpemUgYWdhaW4uXG5cdFx0XHRpZiAoICRzbGlkZXIuaGFzQ2xhc3MoICd3Y2FwZi1ub3VpLXRhcmdldCcgKSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzbGlkZXJJZCAgICAgICAgICA9ICRzbGlkZXIuYXR0ciggJ2lkJyApO1xuXHRcdFx0Y29uc3QgZGlzcGxheVZhbHVlc0FzICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kaXNwbGF5LXZhbHVlcy1hcycgKTtcblx0XHRcdGNvbnN0IGZvcm1hdE51bWJlcnMgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZm9ybWF0LW51bWJlcnMnICk7XG5cdFx0XHRjb25zdCByYW5nZU1pblZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdGNvbnN0IHN0ZXAgICAgICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtc3RlcCcgKSApO1xuXHRcdFx0Y29uc3QgZGVjaW1hbFBsYWNlcyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRcdGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gJGl0ZW0uYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdFx0Y29uc3QgZGVjaW1hbFNlcGFyYXRvciAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXNlcGFyYXRvcicgKTtcblx0XHRcdGNvbnN0IG1pblZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWluLXZhbHVlJyApICk7XG5cdFx0XHRjb25zdCBtYXhWYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1heC12YWx1ZScgKSApO1xuXHRcdFx0Y29uc3QgJG1pblZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1pbi12YWx1ZScgKTtcblx0XHRcdGNvbnN0ICRtYXhWYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5tYXgtdmFsdWUnICk7XG5cblx0XHRcdGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBzbGlkZXJJZCApO1xuXG5cdFx0XHRub1VpU2xpZGVyLmNyZWF0ZSggc2xpZGVyLCB7XG5cdFx0XHRcdHN0YXJ0OiBbIG1pblZhbHVlLCBtYXhWYWx1ZSBdLFxuXHRcdFx0XHRzdGVwLFxuXHRcdFx0XHRjb25uZWN0OiB0cnVlLFxuXHRcdFx0XHRjc3NQcmVmaXg6ICd3Y2FwZi1ub3VpLScsXG5cdFx0XHRcdHJhbmdlOiB7XG5cdFx0XHRcdFx0J21pbic6IHJhbmdlTWluVmFsdWUsXG5cdFx0XHRcdFx0J21heCc6IHJhbmdlTWF4VmFsdWUsXG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICd1cGRhdGUnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHRsZXQgbWluVmFsdWU7XG5cdFx0XHRcdGxldCBtYXhWYWx1ZTtcblxuXHRcdFx0XHRpZiAoIGZvcm1hdE51bWJlcnMgKSB7XG5cdFx0XHRcdFx0bWluVmFsdWUgPSBudW1iZXJfZm9ybWF0KCB2YWx1ZXNbIDAgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0XHRtYXhWYWx1ZSA9IG51bWJlcl9mb3JtYXQoIHZhbHVlc1sgMSBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1pblZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAwIF0gKTtcblx0XHRcdFx0XHRtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMSBdICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoICdwbGFpbl90ZXh0JyA9PT0gZGlzcGxheVZhbHVlc0FzICkge1xuXHRcdFx0XHRcdCRtaW5WYWx1ZS5odG1sKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdCRtYXhWYWx1ZS5odG1sKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRtaW5WYWx1ZS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0JG1heFZhbHVlLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1ub3Vpc2xpZGVyLXVwZGF0ZScsIFsgJGl0ZW0sIHZhbHVlcyBdICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGZ1bmN0aW9uIGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApIHtcblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZm9yX3ByZXZpZXcgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgbWluVmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDAgXSApO1xuXHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMSBdICk7XG5cblx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHQvLyBSZW1vdmUgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdHJlcXVlc3RGaWx0ZXIoICRpdGVtLmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRjb25zdCB1cmwgPSAkaXRlbS5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclMXMnLCBtaW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdHJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGl0ZW0uZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICk7XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JG1pblZhbHVlLm9uKCAnaW5wdXQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG1pblZhbHVlLCBudWxsIF0gKTtcblxuXHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JG1heFZhbHVlLm9uKCAnaW5wdXQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG51bGwsIG1heFZhbHVlIF0gKTtcblxuXHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cblxuXHRpbml0Tm9VSVNsaWRlcigpO1xuXG5cdGZ1bmN0aW9uIGZpbHRlckJ5RGF0ZSggJGlucHV0ICkge1xuXHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICR3Y2FwZkRhdGVGaWx0ZXIgPSAkaW5wdXQuY2xvc2VzdCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXHRcdGNvbnN0IGZpbHRlcktleSAgICAgICAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0Y29uc3QgaXNSYW5nZSAgICAgICAgICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtaXMtcmFuZ2UnICk7XG5cblx0XHRsZXQgZmlsdGVyVmFsdWUgPSAnJztcblx0XHRsZXQgcnVuRmlsdGVyICAgPSBmYWxzZTtcblxuXHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdGNsZWFyVGltZW91dCggJHdjYXBmRGF0ZUZpbHRlci5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdGlmICggaXNSYW5nZSApIHtcblx0XHRcdGNvbnN0IGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgdG8gICA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLXRvLWlucHV0JyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoIGZyb20gJiYgdG8gKSB7XG5cdFx0XHRcdGZpbHRlclZhbHVlID0gZnJvbSArIHJhbmdlVmFsdWVzU2VwYXJhdG9yICsgdG87XG5cdFx0XHRcdHJ1bkZpbHRlciAgID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSBpZiAoICEgZnJvbSAmJiAhIHRvICkge1xuXHRcdFx0XHRydW5GaWx0ZXIgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBmcm9tID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCBmcm9tICkge1xuXHRcdFx0XHRmaWx0ZXJWYWx1ZSA9IGZyb207XG5cdFx0XHRcdHJ1bkZpbHRlciAgID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJ1bkZpbHRlciA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCBydW5GaWx0ZXIgKSB7XG5cdFx0XHQkd2NhcGZEYXRlRmlsdGVyLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkd2NhcGZEYXRlRmlsdGVyLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRpZiAoIGZpbHRlclZhbHVlICkge1xuXHRcdFx0XHRcdHVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc3QgcXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHR9LCBkZWxheSApICk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdERhdGVwaWNrZXIoKSB7XG5cdFx0aWYgKCAhIGpRdWVyeSgpLmRhdGVwaWNrZXIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0ICRyb290O1xuXG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZm9yX3ByZXZpZXcgKSB7XG5cdFx0XHQkcm9vdCA9ICQoIHdjYXBmRGF0ZUZpbHRlclNlbGVjdG9yICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRyb290ID0gJHdjYXBmRGF0ZUZpbHRlcnM7XG5cdFx0fVxuXG5cdFx0Y29uc3QgJHdjYXBmRGF0ZUZpbHRlciA9ICRyb290LmZpbmQoICcud2NhcGYtZGF0ZS1pbnB1dCcgKTtcblxuXHRcdGNvbnN0IGZvcm1hdCAgICAgICAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtZm9ybWF0JyApO1xuXHRcdGNvbnN0IHllYXJEcm9wZG93biAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtcGlja2VyLXllYXItZHJvcGRvd24nICk7XG5cdFx0Y29uc3QgbW9udGhEcm9wZG93biA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1waWNrZXItbW9udGgtZHJvcGRvd24nICk7XG5cblx0XHRjb25zdCAkZnJvbSA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICk7XG5cdFx0Y29uc3QgJHRvICAgPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKTtcblxuXHRcdCRmcm9tLmRhdGVwaWNrZXIoIHtcblx0XHRcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdGNoYW5nZU1vbnRoOiBtb250aERyb3Bkb3duLFxuXHRcdH0gKTtcblxuXHRcdCR0by5kYXRlcGlja2VyKCB7XG5cdFx0XHRkYXRlRm9ybWF0OiBmb3JtYXQsXG5cdFx0XHRjaGFuZ2VZZWFyOiB5ZWFyRHJvcGRvd24sXG5cdFx0XHRjaGFuZ2VNb250aDogbW9udGhEcm9wZG93bixcblx0XHR9ICk7XG5cblx0XHQkZnJvbS5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0ZmlsdGVyQnlEYXRlKCAkaW5wdXQgKTtcblx0XHR9ICk7XG5cblx0XHQkdG8ub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblx0XHRcdGZpbHRlckJ5RGF0ZSggJGlucHV0ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdERhdGVwaWNrZXIoKTtcblxuXHRmdW5jdGlvbiBpbml0RGVmYXVsdE9yZGVyQnkoKSB7XG5cdFx0Ly8gQXR0YWNoIGNob3Nlbi5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5hdHRhY2hfY2hvc2VuX29uX3NvcnRpbmcgKSB7XG5cdFx0XHRpZiAoIGpRdWVyeSgpLmNob3NlbiApIHtcblx0XHRcdFx0JGJvZHkuZmluZCggJy53b29jb21tZXJjZS1vcmRlcmluZyBzZWxlY3Qub3JkZXJieScgKS5jaG9zZW4oIHtcblx0XHRcdFx0XHQnZGlzYWJsZV9zZWFyY2hfdGhyZXNob2xkJzogMTUsXG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLnNvcnRpbmdfY29udHJvbCApIHtcblx0XHRcdCRib2R5LmZpbmQoICcud29vY29tbWVyY2Utb3JkZXJpbmcnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRvcmRlcmluZ0Zvcm0gPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0JG9yZGVyaW5nRm9ybS5vbiggJ2NoYW5nZScsICdzZWxlY3Qub3JkZXJieScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRvcmRlcmluZ0Zvcm0uc3VibWl0KCk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIHRvZG86IGNoZWNrIGlmIGFqYXggZGlzYWJsZWQuXG5cdFx0JGJvZHkuZmluZCggJy53b29jb21tZXJjZS1vcmRlcmluZycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRvcmRlcmluZ0Zvcm0gPSAkKCB0aGlzICk7XG5cblx0XHRcdCRvcmRlcmluZ0Zvcm0ub24oICdzdWJtaXQnLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQkb3JkZXJpbmdGb3JtLm9uKCAnY2hhbmdlJywgJ3NlbGVjdC5vcmRlcmJ5JywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCBvcmRlciAgICAgID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJfa2V5ID0gJ29yZGVyYnknO1xuXG5cdFx0XHRcdHVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJfa2V5LCBvcmRlciApO1xuXHRcdFx0XHRmaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGluaXREZWZhdWx0T3JkZXJCeSgpO1xuXG5cdGZ1bmN0aW9uIHVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQoICRyZXN1bHRzICkge1xuXHRcdGNvbnN0IHNlbGVjdG9yID0gJy53b29jb21tZXJjZS1yZXN1bHQtY291bnQnO1xuXG5cdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmZpbmQoIHNlbGVjdG9yICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IG5ld1Byb2R1Y3RDb3VudCA9ICRyZXN1bHRzLmZpbmQoIHNlbGVjdG9yICkuaHRtbCgpO1xuXG5cdFx0JGJvZHkuZmluZCggc2VsZWN0b3IgKS5odG1sKCBuZXdQcm9kdWN0Q291bnQgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNob3dMb2FkaW5nQW5pbWF0aW9uKCkge1xuXHRcdGlmICggISB3Y2FwZl9wYXJhbXMubG9hZGluZ19hbmltYXRpb24gKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JC5Mb2FkaW5nT3ZlcmxheSggJ3Nob3cnLCB3Y2FwZl9wYXJhbXMubG9hZGluZ19vdmVybGF5X29wdGlvbnMgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGRpc2FibGVOb1VpU2xpZGVycygpIHtcblx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMuZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbiggZSwgZWxlbWVudCApIHtcblx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKCAnZGlzYWJsZWQnLCB0cnVlICk7XG5cdFx0fSApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzYWJsZUxhYmVscygpIHtcblx0XHRjb25zdCBzZWxlY3RvcnMgPSAnLndjYXBmLWxhYmVsZWQtbmF2IC5pdGVtLCAud2NhcGYtYWN0aXZlLWZpbHRlcnMgLml0ZW0nO1xuXG5cdFx0Ly8gVE9ETzogQWRkIGRpc2FibGVkIGF0dHJpYnV0ZS5cblx0XHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmZpbmQoIHNlbGVjdG9ycyApLmFkZENsYXNzKCAnZGlzYWJsZWQnICk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNhYmxlSW5wdXRzKCkge1xuXHRcdGlmICggISB3Y2FwZl9wYXJhbXMuZGlzYWJsZV9pbnB1dHNfd2hpbGVfZmV0Y2hpbmdfcmVzdWx0cyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpbnB1dHMgPSAnaW5wdXQsIHNlbGVjdCc7XG5cblx0XHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmZpbmQoIGlucHV0cyApLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmZpbmQoIGlucHV0cyApLnRyaWdnZXIoICdjaG9zZW46dXBkYXRlZCcgKTtcblxuXHRcdGRpc2FibGVOb1VpU2xpZGVycygpO1xuXHRcdGRpc2FibGVMYWJlbHMoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGVuYWJsZU5vVWlTbGlkZXJzKCkge1xuXHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCR3Y2FwZk51bWJlclJhbmdlRmlsdGVycy5maW5kKCAnLndjYXBmLW5vdWktc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCBlLCBlbGVtZW50ICkge1xuXHRcdFx0ZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoICdkaXNhYmxlZCcgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRmdW5jdGlvbiBlbmFibGVJbnB1dHMoKSB7XG5cdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5kaXNhYmxlX2lucHV0c193aGlsZV9mZXRjaGluZ19yZXN1bHRzICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGlucHV0cyA9ICdpbnB1dCc7XG5cblx0XHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMuZmluZCggaW5wdXRzICkucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdCR3Y2FwZkRhdGVGaWx0ZXJzLmZpbmQoIGlucHV0cyApLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblxuXHRcdGVuYWJsZU5vVWlTbGlkZXJzKCk7XG5cdH1cblxuXHRmdW5jdGlvbiByZXNldExvYWRpbmdBbmltYXRpb24oKSB7XG5cdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5sb2FkaW5nX2FuaW1hdGlvbiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkLkxvYWRpbmdPdmVybGF5KCAnaGlkZScgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNjcm9sbFRvKCkge1xuXHRcdGlmICggJ25vbmUnID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvdyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBzY3JvbGxGb3IgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19mb3I7XG5cdFx0Y29uc3QgaXNNb2JpbGUgID0gd2NhcGZfcGFyYW1zLmlzX21vYmlsZTtcblx0XHRsZXQgcHJvY2VlZCAgICAgPSBmYWxzZTtcblxuXHRcdGlmICggJ21vYmlsZScgPT09IHNjcm9sbEZvciAmJiBpc01vYmlsZSApIHtcblx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdH0gZWxzZSBpZiAoICdkZXNrdG9wJyA9PT0gc2Nyb2xsRm9yICYmICEgaXNNb2JpbGUgKSB7XG5cdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKCAnYm90aCcgPT09IHNjcm9sbEZvciApIHtcblx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICggISBwcm9jZWVkICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCBhZGp1c3RpbmdPZmZzZXQsIG9mZnNldDtcblxuXHRcdGlmICggd2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfb2Zmc2V0ICkge1xuXHRcdFx0YWRqdXN0aW5nT2Zmc2V0ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX29mZnNldCApO1xuXHRcdH1cblxuXHRcdGxldCBjb250YWluZXI7XG5cblx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXI7XG5cdFx0fSBlbHNlIGlmICggJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lcjtcblx0XHR9XG5cblx0XHRpZiAoICdjdXN0b20nID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvdyApIHtcblx0XHRcdGNvbnRhaW5lciA9IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50O1xuXHRcdH1cblxuXHRcdGNvbnN0ICRjb250YWluZXIgPSAkKCBjb250YWluZXIgKTtcblxuXHRcdGlmICggJGNvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRvZmZzZXQgPSAkY29udGFpbmVyLm9mZnNldCgpLnRvcCAtIGFkanVzdGluZ09mZnNldDtcblxuXHRcdFx0aWYgKCBvZmZzZXQgPCAwICkge1xuXHRcdFx0XHRvZmZzZXQgPSAwO1xuXHRcdFx0fVxuXG5cdFx0XHQkKCAnaHRtbCwgYm9keScgKS5zdG9wKCkuYW5pbWF0ZShcblx0XHRcdFx0eyBzY3JvbGxUb3A6IG9mZnNldCB9LFxuXHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9zcGVlZCxcblx0XHRcdFx0d2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3BfZWFzaW5nXG5cdFx0XHQpO1xuXHRcdH1cblx0fVxuXG5cdC8vIFRoaW5ncyBhcmUgZG9uZSBiZWZvcmUgZmV0Y2hpbmcgdGhlIHByb2R1Y3RzIGxpa2Ugc2hvd2luZyBhIGxvYWRpbmcgaW5kaWNhdG9yLlxuXHRmdW5jdGlvbiBiZWZvcmVGZXRjaGluZ1Byb2R1Y3RzKCkge1xuXHRcdGRpc2FibGVJbnB1dHMoKTtcblx0XHRzaG93TG9hZGluZ0FuaW1hdGlvbigpO1xuXG5cdFx0aWYgKCAnaW1tZWRpYXRlbHknID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd193aGVuICkge1xuXHRcdFx0c2Nyb2xsVG8oKTtcblx0XHR9XG5cblx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGZfYmVmb3JlX2ZldGNoaW5nX3Byb2R1Y3RzJyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gYmVmb3JlVXBkYXRpbmdQcm9kdWN0cyggJHJlc3VsdHMgKSB7XG5cdFx0cmVzZXRMb2FkaW5nQW5pbWF0aW9uKCk7XG5cblx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGZfYmVmb3JlX3VwZGF0aW5nX3Byb2R1Y3RzJywgWyAkcmVzdWx0cyBdICk7XG5cdH1cblxuXHQvLyBUaGluZ3MgYXJlIGRvbmUgYWZ0ZXIgYXBwbHlpbmcgdGhlIGZpbHRlciBsaWtlIHNjcm9sbCB0byB0b3AuXG5cdGZ1bmN0aW9uIGFmdGVyVXBkYXRpbmdQcm9kdWN0cyggJHJlc3VsdHMgKSB7XG5cdFx0aW5pdENob3NlbigpO1xuXHRcdGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKTtcblx0XHRpbml0Tm9VSVNsaWRlcigpO1xuXHRcdGluaXREYXRlcGlja2VyKCk7XG5cdFx0aW5pdERlZmF1bHRPcmRlckJ5KCk7XG5cdFx0dXBkYXRlUHJvZHVjdHNDb3VudFJlc3VsdCggJHJlc3VsdHMgKTtcblx0XHRlbmFibGVJbnB1dHMoKTtcblxuXHRcdGlmICggJ2FmdGVyJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfd2hlbiApIHtcblx0XHRcdHNjcm9sbFRvKCk7XG5cdFx0fVxuXG5cdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2FmdGVyX3VwZGF0aW5nX3Byb2R1Y3RzJywgWyAkcmVzdWx0cyBdICk7XG5cdH1cblxuXHQvLyBUaGUgbWFpbiBmaWx0ZXIgZnVuY3Rpb24uXG5cdGZ1bmN0aW9uIGZpbHRlclByb2R1Y3RzKCBmb3JjZVJlUmVuZGVyID0gZmFsc2UgKSB7XG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZm9yX3ByZXZpZXcgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0YmVmb3JlRmV0Y2hpbmdQcm9kdWN0cygpO1xuXG5cdFx0JC5nZXQoIHdpbmRvdy5sb2NhdGlvbi5ocmVmLCBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdGNvbnN0ICRkYXRhID0gJCggZGF0YSApO1xuXG5cdFx0XHQvLyBSZXBsYWNlIHRoZSBmaWVsZHMnIGRhdGEgd2l0aCBuZXcgZGF0YS5cblx0XHRcdCQuZWFjaCggZmllbGRzLCBmdW5jdGlvbiggaWQgKSB7XG5cdFx0XHRcdGNvbnN0IGZpZWxkSUQgICAgPSAnW2RhdGEtaWQ9XCInICsgaWQgKyAnXCJdJztcblx0XHRcdFx0Y29uc3QgJGZpZWxkICAgICA9ICQoIGZpZWxkSUQgKTtcblx0XHRcdFx0Y29uc3QgJGlubmVyICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZpZWxkLWlubmVyJyApO1xuXHRcdFx0XHRjb25zdCBfZmllbGQgICAgID0gJGRhdGEuZmluZCggZmllbGRJRCApO1xuXHRcdFx0XHRsZXQgZmllbGRDbGFzc2VzID0gJCggX2ZpZWxkICkuYXR0ciggJ2NsYXNzJyApO1xuXG5cdFx0XHRcdC8vIFByZXNlcnZlIGhpZXJhcmNoeSBhY2NvcmRpb24gc3RhdGUuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUgKSB7XG5cdFx0XHRcdFx0aWYgKCAkZmllbGQuaGFzQ2xhc3MoICdoaWVyYXJjaHktYWNjb3JkaW9uJyApICkge1xuXHRcdFx0XHRcdFx0JGZpZWxkLmZpbmQoICcuaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUuYWN0aXZlJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBpdGVtVmFsdWUgICAgICA9ICQoIHRoaXMgKS5wYXJlbnQoKS5jaGlsZHJlbiggJ2lucHV0JyApLnZhbCgpO1xuXHRcdFx0XHRcdFx0XHRjb25zdCB0b2dnbGVTZWxlY3RvciA9ICdpbnB1dFt2YWx1ZT1cIicgKyBpdGVtVmFsdWUgKyAnXCJdIH4gLmhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJztcblx0XHRcdFx0XHRcdFx0Y29uc3QgdWxTZWxlY3RvciAgICAgPSAnaW5wdXRbdmFsdWU9XCInICsgaXRlbVZhbHVlICsgJ1wiXSB+IHVsJztcblx0XHRcdFx0XHRcdFx0Y29uc3QgX2NsYXNzZXMgICAgICAgPSAnaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUgYWN0aXZlJztcblxuXHRcdFx0XHRcdFx0XHRfZmllbGQuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5hdHRyKCAnY2xhc3MnLCBfY2xhc3NlcyApO1xuXHRcdFx0XHRcdFx0XHRfZmllbGQuZmluZCggdWxTZWxlY3RvciApLnNob3coKTtcblx0XHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBfaHRtbCA9IF9maWVsZC5maW5kKCAnLndjYXBmLWZpZWxkLWlubmVyJyApLmh0bWwoKTtcblxuXHRcdFx0XHQvLyBTaG93IHNvZnQgbGltaXQgaXRlbXMuXG5cdFx0XHRcdGNvbnN0IHNvZnRMaW1pdFNlbGVjdG9yID0gJ3Nob3ctaGlkZGVuLWl0ZW1zJztcblxuXHRcdFx0XHRpZiAoICRmaWVsZC5oYXNDbGFzcyggc29mdExpbWl0U2VsZWN0b3IgKSApIHtcblx0XHRcdFx0XHRpZiAoICEgX2ZpZWxkLmhhc0NsYXNzKCBzb2Z0TGltaXRTZWxlY3RvciApICkge1xuXHRcdFx0XHRcdFx0ZmllbGRDbGFzc2VzICs9ICcgJyArIHNvZnRMaW1pdFNlbGVjdG9yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRmaWVsZENsYXNzZXMgPSBmaWVsZENsYXNzZXMucmVwbGFjZSggc29mdExpbWl0U2VsZWN0b3IsICcnICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBVcGRhdGUgdGhlIGZpZWxkJ3MgY2xhc3MuXG5cdFx0XHRcdCRmaWVsZC5hdHRyKCAnY2xhc3MnLCBmaWVsZENsYXNzZXMudHJpbSgpICk7XG5cblx0XHRcdFx0Ly8gV2hlbiBjYWxsZWQgZnJvbSBoaXN0b3J5IGJhY2sgb3IgZm9yd2FyZCByZXF1ZXN0IHRoZW4gcmVyZW5kZXIgYWxsIGZpZWxkcy5cblx0XHRcdFx0aWYgKCBmb3JjZVJlUmVuZGVyICkge1xuXG5cdFx0XHRcdFx0Ly8gdXBkYXRlIGZpZWxkXG5cdFx0XHRcdFx0JGlubmVyLmh0bWwoIF9odG1sICk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdC8vIFNlbGVjdGl2ZWx5IHJlcmVuZGVyIHRoZSBmaWVsZHMuXG5cdFx0XHRcdFx0aWYgKCAkZmllbGQuaGFzQ2xhc3MoICd3Y2FwZi1uYXYtZmlsdGVyJyApICkge1xuXG5cdFx0XHRcdFx0XHQvLyB1cGRhdGUgZmllbGRcblx0XHRcdFx0XHRcdCRpbm5lci5odG1sKCBfaHRtbCApO1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkZmllbGQudHJpZ2dlciggJ3djYXBmLWZpZWxkLXVwZGF0ZWQnLCBbIF9maWVsZCBdICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGJlZm9yZVVwZGF0aW5nUHJvZHVjdHMoICRkYXRhICk7XG5cblx0XHRcdC8vIFJlcGxhY2Ugb2xkIHNob3AgbG9vcCB3aXRoIG5ldyBvbmUuXG5cdFx0XHRjb25zdCAkc2hvcExvb3BDb250YWluZXIgPSAkZGF0YS5maW5kKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0Y29uc3QgJG5vdEZvdW5kQ29udGFpbmVyID0gJGRhdGEuZmluZCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKTtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciA9PT0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKSB7XG5cdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGFmdGVyVXBkYXRpbmdQcm9kdWN0cyggJGRhdGEgKTtcblx0XHR9ICk7XG5cdH1cblxuXHQvLyBVUkwgUGFyc2VyXG5cdGZ1bmN0aW9uIGdldFVybFZhcnMoIHVybCApIHtcblx0XHRsZXQgdmFycyA9IHt9LCBoYXNoO1xuXG5cdFx0aWYgKCB0eXBlb2YgdXJsID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdH1cblxuXHRcdHVybCA9IHVybC5yZXBsYWNlQWxsKCAnJTJDJywgJywnICk7XG5cblx0XHRjb25zdCBoYXNoZXMgID0gdXJsLnNsaWNlKCB1cmwuaW5kZXhPZiggJz8nICkgKyAxICkuc3BsaXQoICcmJyApO1xuXHRcdGNvbnN0IGhMZW5ndGggPSBoYXNoZXMubGVuZ3RoO1xuXG5cdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgaExlbmd0aDsgaSsrICkge1xuXHRcdFx0aGFzaCA9IGhhc2hlc1sgaSBdLnNwbGl0KCAnPScgKTtcblxuXHRcdFx0dmFyc1sgaGFzaFsgMCBdIF0gPSBoYXNoWyAxIF07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHZhcnM7XG5cdH1cblxuXHQvLyBldmVyeXRpbWUgd2UgYXBwbHkgdGhlIGZpbHRlciB3ZSBzZXQgdGhlIGN1cnJlbnQgcGFnZSB0byAxXG5cdGZ1bmN0aW9uIGZpeFBhZ2luYXRpb24oKSB7XG5cdFx0bGV0IHVybCAgICAgICAgICAgICAgICA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdGNvbnN0IHBhcmFtcyAgICAgICAgICAgPSBnZXRVcmxWYXJzKCB1cmwgKTtcblx0XHRjb25zdCBjdXJyZW50UGFnZUluVXJsID0gcGFyc2VJbnQoIHVybC5yZXBsYWNlKCAvLitcXC9wYWdlXFwvKFxcZCspKy8sICckMScgKSApO1xuXG5cdFx0aWYgKCBjdXJyZW50UGFnZUluVXJsICkge1xuXHRcdFx0aWYgKCBjdXJyZW50UGFnZUluVXJsID4gMSApIHtcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoIC9wYWdlXFwvKFxcZCspLywgJ3BhZ2UvMScgKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKCB0eXBlb2YgcGFyYW1zWyAncGFnZWQnIF0gIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0Y29uc3QgY3VycmVudFBhZ2VJblBhcmFtcyA9IHBhcnNlSW50KCBwYXJhbXNbICdwYWdlZCcgXSApO1xuXG5cdFx0XHRpZiAoIGN1cnJlbnRQYWdlSW5QYXJhbXMgPiAxICkge1xuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSggJ3BhZ2VkPScgKyBjdXJyZW50UGFnZUluUGFyYW1zLCAncGFnZWQ9MScgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdXJsO1xuXHR9XG5cblx0Ly8gdXBkYXRlIHF1ZXJ5IHN0cmluZyBmb3IgY2F0ZWdvcmllcywgbWV0YSBldGMuLlxuXHRmdW5jdGlvbiB1cGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlcigga2V5LCB2YWx1ZSwgcHVzaEhpc3RvcnksIHVybCApIHtcblx0XHRpZiAoIHR5cGVvZiBwdXNoSGlzdG9yeSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRwdXNoSGlzdG9yeSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKCB0eXBlb2YgdXJsID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHVybCA9IGZpeFBhZ2luYXRpb24oKTtcblx0XHR9XG5cblx0XHRjb25zdCByZSAgICAgICAgPSBuZXcgUmVnRXhwKCAnKFs/Jl0pJyArIGtleSArICc9Lio/KCZ8JCknLCAnaScgKTtcblx0XHRjb25zdCBzZXBhcmF0b3IgPSB1cmwuaW5kZXhPZiggJz8nICkgIT09IC0xID8gJyYnIDogJz8nO1xuXHRcdGxldCB1cmxXaXRoUXVlcnk7XG5cblx0XHRpZiAoIHVybC5tYXRjaCggcmUgKSApIHtcblx0XHRcdHVybFdpdGhRdWVyeSA9IHVybC5yZXBsYWNlKCByZSwgJyQxJyArIGtleSArICc9JyArIHZhbHVlICsgJyQyJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR1cmxXaXRoUXVlcnkgPSB1cmwgKyBzZXBhcmF0b3IgKyBrZXkgKyAnPScgKyB2YWx1ZTtcblx0XHR9XG5cblx0XHRpZiAoIHB1c2hIaXN0b3J5ID09PSB0cnVlICkge1xuXHRcdFx0cmV0dXJuIGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHVybFdpdGhRdWVyeSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdXJsV2l0aFF1ZXJ5O1xuXHRcdH1cblx0fVxuXG5cdC8vIHJlbW92ZSBwYXJhbWV0ZXIgZnJvbSB1cmxcblx0ZnVuY3Rpb24gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgdXJsICkge1xuXHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHR1cmwgPSBmaXhQYWdpbmF0aW9uKCk7XG5cdFx0fVxuXG5cdFx0Y29uc3Qgb2xkUGFyYW1zICAgICAgICAgPSBnZXRVcmxWYXJzKCB1cmwgKTtcblx0XHRjb25zdCBvbGRQYXJhbXNMZW5ndGggICA9IE9iamVjdC5rZXlzKCBvbGRQYXJhbXMgKS5sZW5ndGg7XG5cdFx0Y29uc3Qgc3RhcnRQb3NpdGlvbiAgICAgPSB1cmwuaW5kZXhPZiggJz8nICk7XG5cdFx0Y29uc3QgZmlsdGVyS2V5UG9zaXRpb24gPSB1cmwuaW5kZXhPZiggZmlsdGVyS2V5ICk7XG5cdFx0bGV0IGNsZWFuVXJsLCBjbGVhblF1ZXJ5O1xuXG5cdFx0aWYgKCBvbGRQYXJhbXNMZW5ndGggPiAxICkge1xuXHRcdFx0aWYgKCAoIGZpbHRlcktleVBvc2l0aW9uIC0gc3RhcnRQb3NpdGlvbiApID4gMSApIHtcblx0XHRcdFx0Y2xlYW5VcmwgPSB1cmwucmVwbGFjZSggJyYnICsgZmlsdGVyS2V5ICsgJz0nICsgb2xkUGFyYW1zWyBmaWx0ZXJLZXkgXSwgJycgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNsZWFuVXJsID0gdXJsLnJlcGxhY2UoIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0gKyAnJicsICcnICk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG5ld1BhcmFtcyA9IGNsZWFuVXJsLnNwbGl0KCAnPycgKTtcblx0XHRcdGNsZWFuUXVlcnkgICAgICA9ICc/JyArIG5ld1BhcmFtc1sgMSBdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjbGVhblF1ZXJ5ID0gdXJsLnJlcGxhY2UoICc/JyArIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0sICcnICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNsZWFuUXVlcnk7XG5cdH1cblxuXHQvLyB0YWtlIHRoZSBrZXkgYW5kIHZhbHVlIGFuZCBtYWtlIHF1ZXJ5XG5cdGZ1bmN0aW9uIG1ha2VQYXJhbWV0ZXJzKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlLCBmb3JjZVJlcmVuZGVyID0gZmFsc2UsIHVybCApIHtcblx0XHRjb25zdCB2YWx1ZVNlcGFyYXRvciA9ICcsJztcblxuXHRcdGxldCBwYXJhbXMsIG5leHRWYWx1ZXMsIGVtcHR5VmFsdWUgPSBmYWxzZTtcblxuXHRcdGlmICggdHlwZW9mIHVybCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRwYXJhbXMgPSBnZXRVcmxWYXJzKCB1cmwgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cGFyYW1zID0gZ2V0VXJsVmFycygpO1xuXHRcdH1cblxuXHRcdGlmICggdHlwZW9mIHBhcmFtc1sgZmlsdGVyS2V5IF0gIT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRjb25zdCBwcmV2VmFsdWVzICAgICAgPSBwYXJhbXNbIGZpbHRlcktleSBdO1xuXHRcdFx0Y29uc3QgcHJldlZhbHVlc0FycmF5ID0gcHJldlZhbHVlcy5zcGxpdCggdmFsdWVTZXBhcmF0b3IgKTtcblxuXHRcdFx0aWYgKCBwcmV2VmFsdWVzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdGNvbnN0IGZvdW5kID0gJC5pbkFycmF5KCBmaWx0ZXJWYWx1ZSwgcHJldlZhbHVlc0FycmF5ICk7XG5cblx0XHRcdFx0aWYgKCBmb3VuZCA+PSAwICkge1xuXHRcdFx0XHRcdC8vIEVsZW1lbnQgd2FzIGZvdW5kLCByZW1vdmUgaXQuXG5cdFx0XHRcdFx0cHJldlZhbHVlc0FycmF5LnNwbGljZSggZm91bmQsIDEgKTtcblxuXHRcdFx0XHRcdGlmICggcHJldlZhbHVlc0FycmF5Lmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdFx0XHRcdGVtcHR5VmFsdWUgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBFbGVtZW50IHdhcyBub3QgZm91bmQsIGFkZCBpdC5cblx0XHRcdFx0XHRwcmV2VmFsdWVzQXJyYXkucHVzaCggZmlsdGVyVmFsdWUgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggcHJldlZhbHVlc0FycmF5Lmxlbmd0aCA+IDEgKSB7XG5cdFx0XHRcdFx0bmV4dFZhbHVlcyA9IHByZXZWYWx1ZXNBcnJheS5qb2luKCB2YWx1ZVNlcGFyYXRvciApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBwcmV2VmFsdWVzQXJyYXk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5leHRWYWx1ZXMgPSBmaWx0ZXJWYWx1ZTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0bmV4dFZhbHVlcyA9IGZpbHRlclZhbHVlO1xuXHRcdH1cblxuXHRcdC8vIHVwZGF0ZSB1cmwgYW5kIHF1ZXJ5IHN0cmluZ1xuXHRcdGlmICggISBlbXB0eVZhbHVlICkge1xuXHRcdFx0dXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgbmV4dFZhbHVlcyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0fVxuXG5cdFx0ZmlsdGVyUHJvZHVjdHMoIGZvcmNlUmVyZW5kZXIgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNpbmdsZUZpbHRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRjb25zdCBwYXJhbXMgPSBnZXRVcmxWYXJzKCk7XG5cdFx0bGV0IHF1ZXJ5O1xuXG5cdFx0aWYgKCB0eXBlb2YgcGFyYW1zWyBmaWx0ZXJLZXkgXSAhPT0gJ3VuZGVmaW5lZCcgJiYgcGFyYW1zWyBmaWx0ZXJLZXkgXSA9PT0gZmlsdGVyVmFsdWUgKSB7XG5cdFx0XHRxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cXVlcnkgPSB1cGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSwgZmFsc2UgKTtcblx0XHR9XG5cblx0XHQvLyB1cGRhdGUgdXJsXG5cdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdGZpbHRlclByb2R1Y3RzKCk7XG5cdH1cblxuXHQvLyBIYW5kbGUgdGhlIHBhZ2luYXRpb24gcmVxdWVzdCB2aWEgYWpheC5cblx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXggJiYgd2NhcGZfcGFyYW1zLnBhZ2luYXRpb25fY29udGFpbmVyICkge1xuXHRcdGNvbnN0ICRjb250YWluZXIgPSAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdGNvbnN0IHNlbGVjdG9yICAgPSB3Y2FwZl9wYXJhbXMucGFnaW5hdGlvbl9jb250YWluZXIgKyAnIGEnO1xuXG5cdFx0Ly8gdG9kbzogY2hlY2sgaWYgYWpheCBkaXNhYmxlZC5cblx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0JGNvbnRhaW5lci5vbiggJ2NsaWNrJywgc2VsZWN0b3IsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgbG9jYXRpb24gPSAkKCB0aGlzICkuYXR0ciggJ2hyZWYnICk7XG5cblx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgbG9jYXRpb24gKTtcblxuXHRcdFx0XHRmaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0fSApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgdGhlIGNvbW1vbiBmaWx0ZXIgcmVxdWVzdHMuXG5cdGZ1bmN0aW9uIGhhbmRsZUZpbHRlclJlcXVlc3QoICRpdGVtLCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgICAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtc2luZ2xlLWZpbHRlcicgKTtcblx0XHRjb25zdCBmaWVsZElEICAgICAgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRjb25zdCBmaWVsZERhdGEgICAgICA9IGZpZWxkc1sgZmllbGRJRCBdO1xuXHRcdGNvbnN0IGZpbHRlcktleSAgICAgID0gZmllbGREYXRhLmZpbHRlcktleTtcblx0XHRjb25zdCBtdWx0aXBsZUZpbHRlciA9IGZpZWxkRGF0YS5tdWx0aXBsZUZpbHRlcjtcblxuXHRcdGlmICggISBmaWx0ZXJLZXkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCAhIGZpbHRlclZhbHVlLmxlbmd0aCApIHtcblx0XHRcdGNvbnN0IHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdFx0ZmlsdGVyUHJvZHVjdHMoKTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICggbXVsdGlwbGVGaWx0ZXIgKSB7XG5cdFx0XHRtYWtlUGFyYW1ldGVycyggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzaW5nbGVGaWx0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiByZXF1ZXN0RmlsdGVyKCB1cmwgKSB7XG5cdFx0aWYgKCAhIHVybCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHVybDtcblxuXHRcdC8vIFRPRE86IEZpbHRlciB0aGUgcHJvZHVjdHMgY29uZGl0aW9uYWxseS5cblx0XHQvLyBmaWx0ZXJQcm9kdWN0cygpO1xuXHR9XG5cblx0Ly8gSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgbGlzdCBmaWVsZC5cblx0JHdjYXBmTmF2RmlsdGVycy5vbihcblx0XHQnY2hhbmdlJyxcblx0XHQnLndjYXBmLWxheWVyZWQtbmF2IFt0eXBlPVwiY2hlY2tib3hcIl0sIC53Y2FwZi1sYXllcmVkLW5hdiBbdHlwZT1cInJhZGlvXCJdJyxcblx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0cmVxdWVzdEZpbHRlciggJGl0ZW0uZGF0YSggJ3VybCcgKSApO1xuXHRcdH1cblx0KTtcblxuXHQvLyBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciBsYWJlbGVkIGl0ZW0uXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oICdjbGljaycsICcud2NhcGYtbGFiZWxlZC1uYXYgLml0ZW06bm90KC5kaXNhYmxlZCknLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRpdGVtID0gJCggdGhpcyApO1xuXG5cdFx0cmVxdWVzdEZpbHRlciggJGl0ZW0uZGF0YSggJ3VybCcgKSApO1xuXHR9ICk7XG5cblx0Ly8gSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgZGlzcGxheSB0eXBlIHNlbGVjdCBmaWVsZHMuXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oICdjaGFuZ2UnLCAnc2VsZWN0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkc2VsZWN0ICAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCB2YWx1ZXMgICAgICAgICA9ICRzZWxlY3QudmFsKCk7XG5cdFx0Y29uc3QgZmlsdGVyVVJMICAgICAgPSAkc2VsZWN0LmRhdGEoICd1cmwnICk7XG5cdFx0Y29uc3QgY2xlYXJGaWx0ZXJVUkwgPSAkc2VsZWN0LmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApO1xuXHRcdGxldCB1cmw7XG5cblx0XHRpZiAoIHZhbHVlcy5sZW5ndGggKSB7XG5cdFx0XHR1cmwgPSBmaWx0ZXJVUkwucmVwbGFjZSggJyVzJywgdmFsdWVzLnRvU3RyaW5nKCkgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dXJsID0gY2xlYXJGaWx0ZXJVUkw7XG5cdFx0fVxuXG5cdFx0cmVxdWVzdEZpbHRlciggdXJsICk7XG5cdH0gKTtcblxuXHQvKipcblx0ICogSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgcmFuZ2UgbnVtYmVyLlxuXHQgKi9cblx0Y29uc3QgcmFuZ2VOdW1iZXJTZWxlY3RvcnMgPSAnLndjYXBmLXJhbmdlLW51bWJlciAubWluLXZhbHVlLCAud2NhcGYtcmFuZ2UtbnVtYmVyIC5tYXgtdmFsdWUnO1xuXG5cdC8vIFRPRE86IE1heWJlIHVzZSAnY2hhbmdlJyBldmVudC5cblx0JHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzLm9uKCAnaW5wdXQnLCByYW5nZU51bWJlclNlbGVjdG9ycywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdGNvbnN0ICRyYW5nZU51bWJlciAgICAgID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1yYW5nZS1udW1iZXInICk7XG5cdFx0Y29uc3QgZm9ybWF0TnVtYmVycyAgICAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZm9ybWF0LW51bWJlcnMnICk7XG5cdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApICk7XG5cdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApICk7XG5cdFx0Y29uc3QgZGVjaW1hbFBsYWNlcyAgICAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZGVjaW1hbC1wbGFjZXMnICk7XG5cdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWRlY2ltYWwtc2VwYXJhdG9yJyApO1xuXG5cdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdGZ1bmN0aW9uIGdldFZhbHVlKCBmbG9hdFZhbHVlICkge1xuXHRcdFx0aWYgKCBmb3JtYXROdW1iZXJzICkge1xuXHRcdFx0XHRyZXR1cm4gbnVtYmVyX2Zvcm1hdCggZmxvYXRWYWx1ZSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZsb2F0VmFsdWU7XG5cdFx0fVxuXG5cdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdGxldCBtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoKSApO1xuXHRcdFx0bGV0IG1heFZhbHVlID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCgpICk7XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRpZiAoIGlzTmFOKCBtaW5WYWx1ZSApICkge1xuXHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1pblZhbHVlICkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRpZiAoIGlzTmFOKCBtYXhWYWx1ZSApICkge1xuXHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gYmVsb3cgdGhlIHJhbmdlTWluVmFsdWUuXG5cdFx0XHRpZiAoIG1pblZhbHVlIDwgcmFuZ2VNaW5WYWx1ZSApIHtcblx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRpZiAoIG1pblZhbHVlID4gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRpZiAoIG1heFZhbHVlID4gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gZ28gYmVsb3cgdGhlIG1pblZhbHVlLlxuXHRcdFx0aWYgKCBtaW5WYWx1ZSA+IG1heFZhbHVlICkge1xuXHRcdFx0XHRtYXhWYWx1ZSA9IG1pblZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtYXhWYWx1ZSApICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdC8vIFJlbW92ZSByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdHJlcXVlc3RGaWx0ZXIoICRyYW5nZU51bWJlci5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0Y29uc3QgdXJsID0gJHJhbmdlTnVtYmVyLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIG1pblZhbHVlICkucmVwbGFjZSggJyUycycsIG1heFZhbHVlICk7XG5cdFx0XHRcdHJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0fVxuXHRcdH0sIGRlbGF5ICkgKTtcblx0fSApO1xuXG5cdC8vIEhhbmRsZSByZW1vdmluZyB0aGUgYWN0aXZlIGZpbHRlcnMuXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oICdjbGljaycsICcud2NhcGYtYWN0aXZlLWZpbHRlcnMgLml0ZW06bm90KC5kaXNhYmxlZCknLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRpdGVtICAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGZpbHRlcktleSAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLmF0dHIoICdkYXRhLXZhbHVlJyApO1xuXG5cdFx0bWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIHRydWUgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHJlc2V0RmlsdGVycyggJGJ1dHRvbiApIHtcblx0XHRjb25zdCBfZmlsdGVyS2V5cyA9ICRidXR0b24uYXR0ciggJ2RhdGEta2V5cycgKTtcblxuXHRcdGlmICggISBfZmlsdGVyS2V5cyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBmaWx0ZXJLZXlzID0gX2ZpbHRlcktleXMuc3BsaXQoICcsJyApO1xuXG5cdFx0bGV0IHF1ZXJ5ID0gJyc7XG5cblx0XHQkLmVhY2goIGZpbHRlcktleXMsIGZ1bmN0aW9uKCBpLCBmaWx0ZXJLZXkgKSB7XG5cdFx0XHRpZiAoIHF1ZXJ5ICkge1xuXHRcdFx0XHRxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIHF1ZXJ5ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHQvLyBFbXB0eSBxdWVyeSBjYXVzZXMgaXNzdWUoZG9lc24ndCByZW1vdmUgdGhlIGZpbHRlciBrZXlzIGZyb20gdGhlIHVybCksXG5cdFx0Ly8gdGhpcyBpcyB3aHkgd2UgYXJlIHNldHRpbmcgdGhlIHBhZ2UgdXJsIGFzIHF1ZXJ5LlxuXHRcdGlmICggISBxdWVyeSApIHtcblx0XHRcdGNvbnN0IHByZXZVcmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRcdGNvbnN0IG5ld1VybCAgPSBwcmV2VXJsLnNwbGl0KCAnPycgKTtcblxuXHRcdFx0cXVlcnkgPSBuZXdVcmxbIDAgXTtcblx0XHR9XG5cblx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0ZmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0fVxuXG5cdC8vIENsZWFyL1Jlc2V0IGFsbCBmaWx0ZXJzLlxuXHQkYm9keS5vbiggJ3djYXBmLXJlc2V0LWZpbHRlcnMnLCBmdW5jdGlvbiggZSwgJGJ1dHRvbiApIHtcblx0XHRyZXNldEZpbHRlcnMoICRidXR0b24gKTtcblx0fSApO1xuXG5cdCRib2R5Lm9uKCAnY2xpY2snLCAnLndjYXBmLXJlc2V0LWZpbHRlcnMtYnRuJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGJ1dHRvbiA9ICQoIHRoaXMgKTtcblxuXHRcdHJlc2V0RmlsdGVycyggJGJ1dHRvbiApO1xuXHR9ICk7XG5cblx0JHdjYXBmTmF2RmlsdGVycy5vbiggJ2NsaWNrJywgJy53Y2FwZi1yZXNldC1maWx0ZXJzLWJ0bicsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgJGJ1dHRvbiA9ICQoIHRoaXMgKTtcblxuXHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1yZXNldC1maWx0ZXJzJywgWyAkYnV0dG9uIF0gKTtcblx0fSApO1xuXG5cdCR3Y2FwZlNpbmdsZUZpbHRlcnMub24oICd3Y2FwZi1jbGVhci1maWx0ZXInLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgZmllbGRJRCAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdGNvbnN0IGZpZWxkRGF0YSA9IGZpZWxkc1sgZmllbGRJRCBdO1xuXHRcdGNvbnN0IGZpbHRlcktleSA9IGZpZWxkRGF0YS5maWx0ZXJLZXk7XG5cblx0XHRjb25zdCBxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0ZmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0fSApO1xuXG5cdC8vIFJ1biBhamF4IGZpbHRlciB3aGVuIGJyb3dzZXIgaGlzdG9yeSBjaGFuZ2VzICh1c2VyIGdvZXMgYmFjayBvciBmb3J3YXJkKS5cblx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCB8fCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5hcHBseV9maWx0ZXJzX29uX2Jyb3dzZXJfaGlzdG9yeV9jaGFuZ2UgKSB7XG5cdFx0XHQkKCB3aW5kb3cgKS5iaW5kKCAncG9wc3RhdGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cdH1cblxuXHQvLyBUaGUgaG9vayB0aGF0IG1hbnVhbGx5IHJ1biB0aGUgYWpheCBmaWx0ZXJzIChjYW4gYmUgdXNlZnVsIGZvciBvdGhlciBwbHVnaW5zKS5cblx0JGJvZHkub24oICd3Y2FwZi1ydW4tZmlsdGVyLXByb2R1Y3RzJywgZnVuY3Rpb24oIGUsIGZvcmNlUmVSZW5kZXIgKSB7XG5cdFx0ZmlsdGVyUHJvZHVjdHMoIGZvcmNlUmVSZW5kZXIgKTtcblx0fSApO1xuXG5cdC8vIFRoZSBob29rIHRoYXQgcmVpbml0aWFsaXplIHRoZSBmaWx0ZXIgd2lkZ2V0cyAodG8gc2hvdyB0aGUgcHJldmlldyBpbiB0aGUgYmFja2VuZCkuXG5cdCRib2R5Lm9uKCAnaW5pdF9maWx0ZXJfd2lkZ2V0cycsIGZ1bmN0aW9uKCkge1xuXHRcdGluaXRDaG9zZW4oKTtcblx0XHRpbml0SGllcmFyY2h5QWNjb3JkaW9uKCk7XG5cdFx0aW5pdE5vVUlTbGlkZXIoKTtcblx0XHRpbml0RGF0ZXBpY2tlcigpO1xuXHR9ICk7XG5cblx0LyoqXG5cdCAqIE1ha2UgaXQgY29tcGF0aWJsZSB3aXRoIG90aGVyIHBsdWdpbnMuXG5cdCAqL1xuXHQkYm9keS5vbiggJ3djYXBmX2FmdGVyX3VwZGF0aW5nX3Byb2R1Y3RzJywgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gd29vLXZhcmlhdGlvbi1zd2F0Y2hlc1xuXHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggJ3dvb192YXJpYXRpb25fc3dhdGNoZXNfcHJvX2luaXQnICk7XG5cdH0gKTtcbn0gKTtcbiIsIiggZnVuY3Rpb24oICQsIHdpbmRvdyApIHtcblxuXHRjb25zdCBfZGVsYXkgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLmZpbHRlcl9pbnB1dF9kZWxheSApO1xuXHRjb25zdCBkZWxheSAgPSBfZGVsYXkgPj0gMCA/IF9kZWxheSA6IDgwMDtcblxuXHRjb25zdCAkYm9keSA9ICQoICdib2R5JyApO1xuXG5cdGNvbnN0IGluc3RhbmNlSWRzID0gW107XG5cblx0JCggJy53Y2FwZi1maWx0ZXInICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgaWQgPSAkKCB0aGlzICkuZGF0YSggJ2lkJyApO1xuXG5cdFx0aWYgKCAhIGlkICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGluc3RhbmNlSWRzLnB1c2goIGlkICk7XG5cdH0gKTtcblxuXHRsZXQgZm9jdXNlZEVsbTtcblxuXHR3aW5kb3cudGlwcHlJbnN0YW5jZXMgPSBbXTtcblxuXHR3aW5kb3cuV0NBUEYgPSB3aW5kb3cuV0NBUEYgfHwge307XG5cblx0d2luZG93LldDQVBGID0ge1xuXHRcdGhhbmRsZUZpbHRlckFjY29yZGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCB0b2dnbGVBY2NvcmRpb24gPSAoICRlbCApID0+IHtcblx0XHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBhY2NvcmRpb24gaXMgb3BlbmVkXG5cdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtZXhwYW5kZWQnICkgPT09ICd0cnVlJztcblxuXHRcdFx0XHQvLyBDaGFuZ2UgYXJpYS1leHBhbmRlZCB0byB0aGUgb3Bwb3NpdGUgc3RhdGVcblx0XHRcdFx0JGVsLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgISBwcmVzc2VkICk7XG5cblx0XHRcdFx0Y29uc3QgJGZpbHRlcklubmVyID0gJGVsLmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyJyApLmNoaWxkcmVuKCAnLndjYXBmLWZpbHRlci1pbm5lcicgKTtcblxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfYW5pbWF0aW9uX2Zvcl9maWx0ZXJfYWNjb3JkaW9uICkge1xuXHRcdFx0XHRcdCRmaWx0ZXJJbm5lci5zbGlkZVRvZ2dsZShcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5maWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCxcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5maWx0ZXJfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmdcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRmaWx0ZXJJbm5lci50b2dnbGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtZmlsdGVyLWFjY29yZGlvbi10cmlnZ2VyJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkKCB0aGlzICkgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JGJvZHkub24oICdjbGljaycsICcud2NhcGYtZmlsdGVyLXRpdGxlLmhhcy1hY2NvcmRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRyaWdnZXIgPSAkKCB0aGlzICkuZmluZCggJy53Y2FwZi1maWx0ZXItYWNjb3JkaW9uLXRyaWdnZXInICk7XG5cblx0XHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkdHJpZ2dlciApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlSGllcmFyY2h5VG9nZ2xlOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHRvZ2dsZUFjY29yZGlvbiA9ICggJGVsICkgPT4ge1xuXHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGJ1dHRvbiBpcyBwcmVzc2VkXG5cdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdC8vIENoYW5nZSBhcmlhLXByZXNzZWQgdG8gdGhlIG9wcG9zaXRlIHN0YXRlXG5cdFx0XHRcdCRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJywgISBwcmVzc2VkICk7XG5cblx0XHRcdFx0Y29uc3QgJGNoaWxkID0gJGVsLmNsb3Nlc3QoICdsaScgKS5jaGlsZHJlbiggJ3VsJyApO1xuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24gKSB7XG5cdFx0XHRcdFx0JGNoaWxkLnNsaWRlVG9nZ2xlKFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkLFxuXHRcdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZ1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JGNoaWxkLnRvZ2dsZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHQkYm9keVxuXHRcdFx0XHQub24oICdjbGljaycsICcud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0b2dnbGVBY2NvcmRpb24oICQoIHRoaXMgKSApO1xuXHRcdFx0XHR9IClcblx0XHRcdFx0Lm9uKCAna2V5ZG93bicsICcud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRpZiAoIGUua2V5ID09PSAnICcgfHwgZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICdTcGFjZWJhcicgKSB7XG5cdFx0XHRcdFx0XHQvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvbiB0byBzdG9wIHNjcm9sbGluZyB3aGVuIHNwYWNlIGlzIHByZXNzZWRcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdFx0dG9nZ2xlQWNjb3JkaW9uKCAkKCB0aGlzICkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZVNvZnRMaW1pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCB0b2dnbGVGaWx0ZXJPcHRpb25zID0gKCAkZWwgKSA9PiB7XG5cdFx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgYnV0dG9uIGlzIHByZXNzZWRcblx0XHRcdFx0Y29uc3QgcHJlc3NlZCA9ICRlbC5hdHRyKCAnYXJpYS1wcmVzc2VkJyApID09PSAndHJ1ZSc7XG5cblx0XHRcdFx0Ly8gQ2hhbmdlIGFyaWEtcHJlc3NlZCB0byB0aGUgb3Bwb3NpdGUgc3RhdGVcblx0XHRcdFx0JGVsLmF0dHIoICdhcmlhLXByZXNzZWQnLCAhIHByZXNzZWQgKTtcblxuXHRcdFx0XHRjb25zdCAkbGlzdFdyYXBwZXIgPSAkZWwuY2xvc2VzdCggJy53Y2FwZi1saXN0LXdyYXBwZXInICk7XG5cblx0XHRcdFx0aWYgKCBwcmVzc2VkICkge1xuXHRcdFx0XHRcdCRsaXN0V3JhcHBlci5yZW1vdmVDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JGxpc3RXcmFwcGVyLmFkZENsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0JGJvZHlcblx0XHRcdFx0Lm9uKCAnY2xpY2snLCAnLndjYXBmLXNvZnQtbGltaXQtdHJpZ2dlcicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHRvZ2dsZUZpbHRlck9wdGlvbnMoICQoIHRoaXMgKSApO1xuXHRcdFx0XHR9IClcblx0XHRcdFx0Lm9uKCAna2V5ZG93bicsICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdFx0aWYgKCBlLmtleSA9PT0gJyAnIHx8IGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnU3BhY2ViYXInICkge1xuXHRcdFx0XHRcdFx0Ly8gUHJldmVudCB0aGUgZGVmYXVsdCBhY3Rpb24gdG8gc3RvcCBzY3JvbGxpbmcgd2hlbiBzcGFjZSBpcyBwcmVzc2VkXG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRcdHRvZ2dsZUZpbHRlck9wdGlvbnMoICQoIHRoaXMgKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlU2VhcmNoRmlsdGVyT3B0aW9uczogZnVuY3Rpb24oKSB7XG5cdFx0XHQkYm9keS5vbiggJ2lucHV0JywgJy53Y2FwZi1zZWFyY2gtYm94IGlucHV0W3R5cGU9XCJ0ZXh0XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0aGF0ICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0ICRpbm5lciAgPSAkdGhhdC5jbG9zZXN0KCAnLndjYXBmLWZpbHRlci1pbm5lcicgKTtcblx0XHRcdFx0Y29uc3QgJGZpbHRlciA9ICRpbm5lci5jbG9zZXN0KCAnLndjYXBmLWZpbHRlcicgKTtcblxuXHRcdFx0XHRjb25zdCBzb2Z0TGltaXRFbmFibGVkID0gJGZpbHRlci5oYXNDbGFzcyggJ2hhcy1zb2Z0LWxpbWl0JyApO1xuXHRcdFx0XHRjb25zdCBzb2Z0TGltaXRUb2dnbGUgID0gJGZpbHRlci5maW5kKCAnLndjYXBmLXNvZnQtbGltaXQtd3JhcHBlcicgKTtcblx0XHRcdFx0Y29uc3Qgbm9SZXN1bHRzICAgICAgICA9ICRmaWx0ZXIuZmluZCggJy53Y2FwZi1uby1yZXN1bHRzLXRleHQnICk7XG5cdFx0XHRcdGNvbnN0IHZpc2libGVPcHRpb25zICAgPSBwYXJzZUludCggJGZpbHRlci5hdHRyKCAnZGF0YS12aXNpYmxlLW9wdGlvbnMnICkgKTtcblxuXHRcdFx0XHRjb25zdCBrZXl3b3JkID0gJHRoYXQudmFsKCk7XG5cblx0XHRcdFx0aWYgKCAhIGtleXdvcmQubGVuZ3RoICkge1xuXHRcdFx0XHRcdGxldCBpbmRleCA9IDA7XG5cdFx0XHRcdFx0JGZpbHRlci5yZW1vdmVDbGFzcyggJ3NlYXJjaC1hY3RpdmUnICk7XG5cblx0XHRcdFx0XHQkLmVhY2goICRpbm5lci5maW5kKCAnLndjYXBmLWZpbHRlci1vcHRpb25zID4gbGknICksIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0aW5kZXgrKztcblxuXHRcdFx0XHRcdFx0Y29uc3QgJGZpbHRlckl0ZW0gPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5yZW1vdmVDbGFzcyggJ2tleXdvcmQtbWF0Y2hlZCcgKTtcblxuXHRcdFx0XHRcdFx0aWYgKCBzb2Z0TGltaXRFbmFibGVkICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIGluZGV4ID4gdmlzaWJsZU9wdGlvbnMgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0uYWRkQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5yZW1vdmVDbGFzcyggJ3djYXBmLWZpbHRlci1vcHRpb24taGlkZGVuJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdFx0aWYgKCBzb2Z0TGltaXRFbmFibGVkICkge1xuXHRcdFx0XHRcdFx0c29mdExpbWl0VG9nZ2xlLnJlbW92ZUF0dHIoICdzdHlsZScgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRub1Jlc3VsdHMuY2hpbGRyZW4oICdzcGFuJyApLnRleHQoICcnICk7XG5cdFx0XHRcdFx0bm9SZXN1bHRzLmhpZGUoKTtcblxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCBpbmRleCA9IDA7XG5cdFx0XHRcdCRmaWx0ZXIuYWRkQ2xhc3MoICdzZWFyY2gtYWN0aXZlJyApO1xuXG5cdFx0XHRcdCQuZWFjaCggJGlubmVyLmZpbmQoICcud2NhcGYtZmlsdGVyLW9wdGlvbnMgPiBsaScgKSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGZpbHRlckl0ZW0gPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0Y29uc3QgbGFiZWwgICAgICAgPSAkZmlsdGVySXRlbS5maW5kKCAnLndjYXBmLWZpbHRlci1pdGVtLWxhYmVsJyApLmRhdGEoICdsYWJlbCcgKTtcblxuXHRcdFx0XHRcdGlmICggbGFiZWwudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygga2V5d29yZC50b0xvd2VyQ2FzZSgpICkgKSB7XG5cdFx0XHRcdFx0XHRpbmRleCsrO1xuXG5cdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5hZGRDbGFzcyggJ2tleXdvcmQtbWF0Y2hlZCcgKTtcblxuXHRcdFx0XHRcdFx0aWYgKCBzb2Z0TGltaXRFbmFibGVkICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIGluZGV4ID4gdmlzaWJsZU9wdGlvbnMgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JGZpbHRlckl0ZW0uYWRkQ2xhc3MoICd3Y2FwZi1maWx0ZXItb3B0aW9uLWhpZGRlbicgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHQkZmlsdGVySXRlbS5yZW1vdmVDbGFzcyggJ3djYXBmLWZpbHRlci1vcHRpb24taGlkZGVuJyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRmaWx0ZXJJdGVtLnJlbW92ZUNsYXNzKCAna2V5d29yZC1tYXRjaGVkJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGlmICggc29mdExpbWl0RW5hYmxlZCApIHtcblx0XHRcdFx0XHRpZiAoIGluZGV4IDw9IHZpc2libGVPcHRpb25zICkge1xuXHRcdFx0XHRcdFx0c29mdExpbWl0VG9nZ2xlLmhpZGUoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c29mdExpbWl0VG9nZ2xlLnNob3coKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIDAgPT09IGluZGV4ICkge1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5jaGlsZHJlbiggJ3NwYW4nICkudGV4dCgga2V5d29yZCApO1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bm9SZXN1bHRzLmNoaWxkcmVuKCAnc3BhbicgKS50ZXh0KCAnJyApO1xuXHRcdFx0XHRcdG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdHVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQ6IGZ1bmN0aW9uKCAkcmVzcG9uc2UgKSB7XG5cdFx0XHRjb25zdCAkY29udGFpbmVyID0gJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdGNvbnN0IHNlbGVjdG9yICAgPSAnLndvb2NvbW1lcmNlLXJlc3VsdC1jb3VudCc7XG5cdFx0XHRjb25zdCBuZXdDb3VudCAgID0gJHJlc3BvbnNlLmZpbmQoIHNlbGVjdG9yICkuaHRtbCgpO1xuXG5cdFx0XHQkYm9keS5maW5kKCBzZWxlY3RvciApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkZWwgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0aWYgKCAhICRjb250YWluZXIuaGFzKCAkZWwgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0JGVsLmh0bWwoIG5ld0NvdW50ICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdHNob3dMb2FkaW5nQW5pbWF0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggISB3Y2FwZl9wYXJhbXMubG9hZGluZ19hbmltYXRpb24gKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0JC5Mb2FkaW5nT3ZlcmxheSggJ3Nob3cnLCB3Y2FwZl9wYXJhbXMubG9hZGluZ19vdmVybGF5X29wdGlvbnMgKTtcblx0XHR9LFxuXHRcdHJlc2V0TG9hZGluZ0FuaW1hdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLmxvYWRpbmdfYW5pbWF0aW9uICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCQuTG9hZGluZ092ZXJsYXkoICdoaWRlJyApO1xuXHRcdH0sXG5cdFx0c2Nyb2xsVG86IGZ1bmN0aW9uKCB0cmlnZ2VyZWRCeSApIHtcblx0XHRcdGlmICggJ25vbmUnID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvdyApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBhbGxvd2VkICAgID0gW107XG5cdFx0XHRjb25zdCBzY3JvbGxXaGVuID0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfd2hlbjtcblxuXHRcdFx0aWYgKCAnYWxsJyA9PT0gc2Nyb2xsV2hlbiApIHtcblx0XHRcdFx0YWxsb3dlZC5wdXNoKCAnZmlsdGVyJyApO1xuXHRcdFx0XHRhbGxvd2VkLnB1c2goICdwYWdpbmF0ZScgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFsbG93ZWQucHVzaCggc2Nyb2xsV2hlbiApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgYWxsb3dlZC5pbmNsdWRlcyggdHJpZ2dlcmVkQnkgKSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzY3JvbGxGb3IgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19mb3I7XG5cdFx0XHRjb25zdCBpc01vYmlsZSAgPSB3Y2FwZl9wYXJhbXMuaXNfbW9iaWxlO1xuXHRcdFx0bGV0IHByb2NlZWQgICAgID0gZmFsc2U7XG5cblx0XHRcdGlmICggJ21vYmlsZScgPT09IHNjcm9sbEZvciAmJiBpc01vYmlsZSApIHtcblx0XHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0XHR9IGVsc2UgaWYgKCAnZGVza3RvcCcgPT09IHNjcm9sbEZvciAmJiAhIGlzTW9iaWxlICkge1xuXHRcdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSBpZiAoICdib3RoJyA9PT0gc2Nyb2xsRm9yICkge1xuXHRcdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhIHByb2NlZWQgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGFkanVzdGluZ09mZnNldCwgb2Zmc2V0O1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX29mZnNldCApIHtcblx0XHRcdFx0YWRqdXN0aW5nT2Zmc2V0ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX29mZnNldCApO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgY29udGFpbmVyO1xuXG5cdFx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lcjtcblx0XHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lcjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAnY3VzdG9tJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRcdGNvbnRhaW5lciA9IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50O1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCAkY29udGFpbmVyID0gJCggY29udGFpbmVyICk7XG5cblx0XHRcdGlmICggJGNvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdG9mZnNldCA9ICRjb250YWluZXIub2Zmc2V0KCkudG9wIC0gYWRqdXN0aW5nT2Zmc2V0O1xuXG5cdFx0XHRcdGlmICggb2Zmc2V0IDwgMCApIHtcblx0XHRcdFx0XHRvZmZzZXQgPSAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZGlzYWJsZV9zY3JvbGxfYW5pbWF0aW9uICkge1xuXHRcdFx0XHRcdHdpbmRvdy5zY3JvbGxUbyggeyB0b3A6IG9mZnNldCB9ICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JCggJ2h0bWwsIGJvZHknICkuc3RvcCgpLmFuaW1hdGUoXG5cdFx0XHRcdFx0XHR7IHNjcm9sbFRvcDogb2Zmc2V0IH0sXG5cdFx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9zcGVlZCxcblx0XHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX2Vhc2luZ1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdC8vIFRoaW5ncyBhcmUgZG9uZSBiZWZvcmUgZmV0Y2hpbmcgdGhlIHByb2R1Y3RzIGxpa2Ugc2hvd2luZyB0aGUgbG9hZGluZyBpbmRpY2F0b3IuXG5cdFx0YmVmb3JlRmV0Y2hpbmdQcm9kdWN0czogZnVuY3Rpb24oIHRyaWdnZXJlZEJ5ICkge1xuXHRcdFx0Ly8gVHJhY2sgdGhlIGN1cnJlbnQgZWxlbWVudCBmb2N1cy5cblx0XHRcdGZvY3VzZWRFbG0gPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXG5cdFx0XHRXQ0FQRi5zaG93TG9hZGluZ0FuaW1hdGlvbigpO1xuXG5cdFx0XHQvLyBTY3JvbGwgaW50byB2aWV3IG9uIHBhZ2luYXRlLlxuXHRcdFx0aWYgKCAncGFnaW5hdGUnID09PSB0cmlnZ2VyZWRCeSAmJiB3Y2FwZl9wYXJhbXMuaW1tZWRpYXRlX3Njcm9sbF9vbl9wYWdpbmF0ZSApIHtcblx0XHRcdFx0V0NBUEYuc2Nyb2xsVG8oIHRyaWdnZXJlZEJ5ICk7XG5cdFx0XHR9XG5cblx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfZmV0Y2hpbmdfcHJvZHVjdHMnLCBbIHRyaWdnZXJlZEJ5IF0gKTtcblx0XHR9LFxuXHRcdGRlc3Ryb3lUaXBweUluc3RhbmNlczogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy51c2VfdGlwcHlqcyApIHtcblx0XHRcdFx0Ly8gQHNvdXJjZSBodHRwczovL2dpdGh1Yi5jb20vYXRvbWlrcy90aXBweWpzL2lzc3Vlcy80NzNcblx0XHRcdFx0dGlwcHlJbnN0YW5jZXMuZm9yRWFjaCggaW5zdGFuY2UgPT4ge1xuXHRcdFx0XHRcdGluc3RhbmNlLmRlc3Ryb3koKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0XHR0aXBweUluc3RhbmNlcy5sZW5ndGggPSAwOyAvLyBjbGVhciBpdFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Ly8gVGhpbmdzIGFyZSBkb25lIGJlZm9yZSB1cGRhdGluZyB0aGUgcHJvZHVjdHMgbGlrZSBoaWRpbmcgdGhlIGxvYWRpbmcgaW5kaWNhdG9yLlxuXHRcdGJlZm9yZVVwZGF0aW5nUHJvZHVjdHM6IGZ1bmN0aW9uKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICkge1xuXHRcdFx0V0NBUEYucmVzZXRMb2FkaW5nQW5pbWF0aW9uKCk7XG5cblx0XHRcdC8vIE1heWJlIGdvb2QgZm9yIHBlcmZvcm1hbmNlLlxuXHRcdFx0V0NBUEYuZGVzdHJveVRpcHB5SW5zdGFuY2VzKCk7XG5cblx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfdXBkYXRpbmdfcHJvZHVjdHMnLCBbICRyZXNwb25zZSwgdHJpZ2dlcmVkQnkgXSApO1xuXHRcdH0sXG5cdFx0YWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzOiBmdW5jdGlvbiggJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSApIHtcblx0XHRcdFdDQVBGLnVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQoICRyZXNwb25zZSApO1xuXG5cdFx0XHQvLyBSZXN0b3JlIHRoZSBmb2N1cyAoTWF5YmUgcmVzdG9yaW5nIHRoZSBmb2N1cyBpbiBtb2JpbGUgZGV2aWNlIGlzbid0IGdvb2QpLlxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucmVzdG9yZV9mb2N1c19hZnRlcl9maWx0ZXJpbmcgJiYgISB3Y2FwZl9wYXJhbXMuaXNfbW9iaWxlICkge1xuXHRcdFx0XHRpZiAoIGRvY3VtZW50LmJvZHkgIT09IGZvY3VzZWRFbG0gKSB7XG5cdFx0XHRcdFx0aWYgKCBmb2N1c2VkRWxtLmlkICkge1xuXHRcdFx0XHRcdFx0JCggYCMkeyBmb2N1c2VkRWxtLmlkIH1gICkuZm9jdXMoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVpbml0aWFsaXplIHdjYXBmLlxuXHRcdFx0V0NBUEYuaW5pdCgpO1xuXG5cdFx0XHQvLyBTY3JvbGwgaW50byB2aWV3LlxuXHRcdFx0aWYgKCAncGFnaW5hdGUnID09PSB0cmlnZ2VyZWRCeSAmJiB3Y2FwZl9wYXJhbXMuaW1tZWRpYXRlX3Njcm9sbF9vbl9wYWdpbmF0ZSApIHtcblx0XHRcdFx0Ly8gRG8gbm90aGluZyBiZWNhdXNlIGl0IGFscmVhZHkgaGFwcGVuZWQuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRXQ0FQRi5zY3JvbGxUbyggdHJpZ2dlcmVkQnkgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVHJpZ2dlciBldmVudHMuXG5cdFx0XHQkKCBkb2N1bWVudCApLnRyaWdnZXIoICdyZWFkeScgKTtcblx0XHRcdCQoIHdpbmRvdyApLnRyaWdnZXIoICdzY3JvbGwnICk7XG5cdFx0XHQkKCB3aW5kb3cgKS50cmlnZ2VyKCAncmVzaXplJyApO1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5jdXN0b21fc2NyaXB0cyApIHtcblx0XHRcdFx0ZXZhbCggd2NhcGZfcGFyYW1zLmN1c3RvbV9zY3JpcHRzICk7XG5cdFx0XHR9XG5cblx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9hZnRlcl91cGRhdGluZ19wcm9kdWN0cycsIFsgJHJlc3BvbnNlLCB0cmlnZ2VyZWRCeSBdICk7XG5cdFx0fSxcblx0XHRmaWx0ZXJQcm9kdWN0czogZnVuY3Rpb24oIHRyaWdnZXJlZEJ5ID0gJ2ZpbHRlcicgKSB7XG5cdFx0XHRXQ0FQRi5iZWZvcmVGZXRjaGluZ1Byb2R1Y3RzKCB0cmlnZ2VyZWRCeSApO1xuXG5cdFx0XHQkLmFqYXgoIHtcblx0XHRcdFx0dXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0XHRcdGNvbnN0ICRyZXNwb25zZSA9ICQoIHJlc3BvbnNlICk7XG5cblx0XHRcdFx0XHRXQ0FQRi5iZWZvcmVVcGRhdGluZ1Byb2R1Y3RzKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICk7XG5cblx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHQgKiBVcGRhdGUgZG9jdW1lbnQgdGl0bGUuXG5cdFx0XHRcdFx0ICpcblx0XHRcdFx0XHQgKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS83NTk5NTYyXG5cdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMudXBkYXRlX2RvY3VtZW50X3RpdGxlICkge1xuXHRcdFx0XHRcdFx0ZG9jdW1lbnQudGl0bGUgPSAkcmVzcG9uc2UuZmlsdGVyKCAndGl0bGUnICkudGV4dCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgaW5zdGFuY2VzLlxuXHRcdFx0XHRcdGZvciAoIGNvbnN0IGlkIG9mIGluc3RhbmNlSWRzICkge1xuXHRcdFx0XHRcdFx0Y29uc3QgaW5zdGFuY2VJZCA9ICdbZGF0YS1pZD1cIicgKyBpZCArICdcIl0nO1xuXHRcdFx0XHRcdFx0Y29uc3QgJGluc3RhbmNlICA9ICQoIGluc3RhbmNlSWQgKTtcblx0XHRcdFx0XHRcdGNvbnN0ICRpbm5lciAgICAgPSAkaW5zdGFuY2UuZmluZCggJy53Y2FwZi1maWx0ZXItaW5uZXInICk7XG5cdFx0XHRcdFx0XHRjb25zdCBfaW5zdGFuY2UgID0gJHJlc3BvbnNlLmZpbmQoIGluc3RhbmNlSWQgKTtcblxuXHRcdFx0XHRcdFx0Ly8gUHJlc2VydmUgaGllcmFyY2h5IGFjY29yZGlvbiBzdGF0ZS5cblx0XHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUgKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJGluc3RhbmNlLmhhc0NsYXNzKCAnaGFzLWhpZXJhcmNoeS1hY2NvcmRpb24nICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0JGluc3RhbmNlLmZpbmQoICcud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCAkZWwgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBpZCAgPSAkZWwuZGF0YSggJ2lkJyApO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCB0b2dnbGVTZWxlY3RvciA9IGAud2NhcGYtaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGVbZGF0YS1pZD1cIiR7IGlkIH1cIl1gO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgdGhlIGFjY29yZGlvbiBpcyBvcGVuZWRcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHByZXNzZWQgPSAkZWwuYXR0ciggJ2FyaWEtcHJlc3NlZCcgKSA9PT0gJ3RydWUnO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIHByZXNzZWQgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCB0b2dnbGVTZWxlY3RvciApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAndHJ1ZScgKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICkuc2hvdygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuYXR0ciggJ2FyaWEtcHJlc3NlZCcsICdmYWxzZScgKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuY2xvc2VzdCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICkuaGlkZSgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBQcmVzZXJ2ZSBzb2Z0IGxpbWl0IHN0YXRlLlxuXHRcdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMucHJlc2VydmVfc29mdF9saW1pdF9zdGF0ZSApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkaW5zdGFuY2UuaGFzQ2xhc3MoICdoYXMtc29mdC1saW1pdCcgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCAkbGlzdFdyYXBwZXIgPSAkaW5zdGFuY2UuZmluZCggJy53Y2FwZi1saXN0LXdyYXBwZXInICk7XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAoICRsaXN0V3JhcHBlci5oYXNDbGFzcyggJ3Nob3ctaGlkZGVuLW9wdGlvbnMnICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRfaW5zdGFuY2UuZmluZCggJy53Y2FwZi1saXN0LXdyYXBwZXInICkuYWRkQ2xhc3MoICdzaG93LWhpZGRlbi1vcHRpb25zJyApO1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtc29mdC1saW1pdC10cmlnZ2VyJyApLmF0dHIoICdhcmlhLXByZXNzZWQnLCAndHJ1ZScgKTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0X2luc3RhbmNlLmZpbmQoICcud2NhcGYtbGlzdC13cmFwcGVyJyApLnJlbW92ZUNsYXNzKCAnc2hvdy1oaWRkZW4tb3B0aW9ucycgKTtcblx0XHRcdFx0XHRcdFx0XHRcdF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLXNvZnQtbGltaXQtdHJpZ2dlcicgKS5hdHRyKCAnYXJpYS1wcmVzc2VkJywgJ2ZhbHNlJyApO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRjb25zdCBfaHRtbCA9IF9pbnN0YW5jZS5maW5kKCAnLndjYXBmLWZpbHRlci1pbm5lcicgKS5odG1sKCk7XG5cblx0XHRcdFx0XHRcdC8vIEZpbmFsbHkgdXBkYXRlIHRoZSBpbnN0YW5jZS5cblx0XHRcdFx0XHRcdCRpbm5lci5odG1sKCBfaHRtbCApO1xuXG5cdFx0XHRcdFx0XHQkaW5zdGFuY2UudHJpZ2dlciggJ3djYXBmLWZpbHRlci11cGRhdGVkJywgWyBfaW5zdGFuY2UgXSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgYWN0aXZlIGZpbHRlcnMgYW5kIHJlc2V0IGZpbHRlcnMuXG5cdFx0XHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1hY3RpdmUtZmlsdGVycywgLndjYXBmLXJlc2V0LWZpbHRlcnMnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRjb25zdCAkdGhhdCAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdFx0Y29uc3QgaW5zdGFuY2VJZCA9ICdbZGF0YS1pZD1cIicgKyAkdGhhdC5kYXRhKCAnaWQnICkgKyAnXCJdJztcblxuXHRcdFx0XHRcdFx0JHRoYXQuaHRtbCggJHJlc3BvbnNlLmZpbmQoIGluc3RhbmNlSWQgKS5odG1sKCkgKTtcblx0XHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0XHQvLyBSZXBsYWNlIG9sZCBzaG9wIGxvb3Agd2l0aCBuZXcgb25lLlxuXHRcdFx0XHRcdGNvbnN0ICRzaG9wTG9vcENvbnRhaW5lciA9ICRyZXNwb25zZS5maW5kKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0XHRcdGNvbnN0ICRub3RGb3VuZENvbnRhaW5lciA9ICRyZXNwb25zZS5maW5kKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApO1xuXG5cdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciA9PT0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0V0NBUEYuYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzKCAkcmVzcG9uc2UsIHRyaWdnZXJlZEJ5ICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdHJlcXVlc3RGaWx0ZXI6IGZ1bmN0aW9uKCB1cmwsIHRyaWdnZXJlZEJ5ID0gJ2ZpbHRlcicgKSB7XG5cdFx0XHRpZiAoICEgdXJsICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGhvc3RuYW1lID0gbG9jYXRpb24uaG9zdG5hbWU7XG5cblx0XHRcdC8vIFRPRE86IFJlbW92ZSBmcm9tIHByb2R1Y3Rpb24gYnVpbGQuXG5cdFx0XHRpZiAoICdsb2NhbGhvc3QnID09PSBob3N0bmFtZSApIHtcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoICdodHRwOi8vd2NmaWx0ZXItMi50ZXN0JywgJy8vbG9jYWxob3N0OjMwMDEnICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJsO1xuXG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSggeyB3Y2FwZjogdHJ1ZSB9LCAnJywgdXJsICk7XG5cblx0XHRcdFdDQVBGLmZpbHRlclByb2R1Y3RzKCB0cmlnZ2VyZWRCeSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlTnVtYmVySW5wdXRGaWx0ZXJzOiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHJhbmdlTnVtYmVyU2VsZWN0b3JzID0gJy53Y2FwZi1yYW5nZS1udW1iZXIgLm1pbi12YWx1ZSwgLndjYXBmLXJhbmdlLW51bWJlciAubWF4LXZhbHVlJztcblxuXHRcdFx0JGJvZHkub24oICdpbnB1dCcsIHJhbmdlTnVtYmVyU2VsZWN0b3JzLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Y29uc3QgJHJhbmdlTnVtYmVyICAgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXJhbmdlLW51bWJlcicgKTtcblx0XHRcdFx0Y29uc3QgZm9ybWF0TnVtYmVycyAgICAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZm9ybWF0LW51bWJlcnMnICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3Qgb2xkTWluVmFsdWUgICAgICAgPSBwYXJzZUZsb2F0KCAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IG9sZE1heFZhbHVlICAgICAgID0gcGFyc2VGbG9hdCggJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsUGxhY2VzICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRcdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsU2VwYXJhdG9yICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1kZWNpbWFsLXNlcGFyYXRvcicgKTtcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRjb25zdCBnZXRWYWx1ZSA9ICggZmxvYXRWYWx1ZSApID0+IHtcblx0XHRcdFx0XHRpZiAoIGZvcm1hdE51bWJlcnMgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVtYmVyRm9ybWF0KCBmbG9hdFZhbHVlLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBmbG9hdFZhbHVlO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpdGVtLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGxldCBtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoKSApO1xuXHRcdFx0XHRcdGxldCBtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoICRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoKSApO1xuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdFx0XHRpZiAoIGlzTmFOKCBtaW5WYWx1ZSApICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRcdFx0aWYgKCBpc05hTiggbWF4VmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSByYW5nZU1pblZhbHVlLlxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPCByYW5nZU1pblZhbHVlICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWluVmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA+IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIGdldFZhbHVlKCBtaW5WYWx1ZSApICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdFx0XHRpZiAoIG1heFZhbHVlID4gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggZ2V0VmFsdWUoIG1heFZhbHVlICkgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSBtaW5WYWx1ZS5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID4gbWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IG1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBnZXRWYWx1ZSggbWF4VmFsdWUgKSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIElmIHZhbHVlIGlzIG5vdCBjaGFuZ2VkIHRoZW4gZG9uJ3QgcHJvY2VlZC5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID09PSBvbGRNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gb2xkTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdC8vIFJlbW92ZSByYW5nZSBmaWx0ZXIuXG5cdFx0XHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkcmFuZ2VOdW1iZXIuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdGNvbnN0IHVybCA9ICRyYW5nZU51bWJlci5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclMXMnLCBtaW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVMaXN0RmlsdGVyczogZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCBuYXRpdmVJbnB1dHMgPSAnLmxpc3QtdHlwZS1uYXRpdmUgW3R5cGU9XCJjaGVja2JveFwiXSwnICtcblx0XHRcdFx0Jy5saXN0LXR5cGUtbmF0aXZlIFt0eXBlPVwicmFkaW9cIl0sJyArXG5cdFx0XHRcdCcubGlzdC10eXBlLWN1c3RvbS1jaGVja2JveCBbdHlwZT1cImNoZWNrYm94XCJdJztcblxuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCBuYXRpdmVJbnB1dHMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXItaXRlbScgKS50b2dnbGVDbGFzcyggJ2l0ZW0tYWN0aXZlJyApO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5kYXRhKCAndXJsJyApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGNvbnN0IGN1c3RvbVJhZGlvU2VsZWN0b3IgPSAnLmxpc3QtdHlwZS1jdXN0b20tcmFkaW8nO1xuXG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsIGN1c3RvbVJhZGlvU2VsZWN0b3IgKyAnIFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZmlsdGVyLWl0ZW0nICkudG9nZ2xlQ2xhc3MoICdpdGVtLWFjdGl2ZScgKTtcblxuXHRcdFx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTgzOTkyNFxuXHRcdFx0XHQkKCB0aGlzIClcblx0XHRcdFx0XHQuY2xvc2VzdCggY3VzdG9tUmFkaW9TZWxlY3RvciApXG5cdFx0XHRcdFx0LmZpbmQoICcud2NhcGYtZmlsdGVyLWl0ZW0uaXRlbS1hY3RpdmUgW3R5cGU9XCJjaGVja2JveFwiXScgKVxuXHRcdFx0XHRcdC5ub3QoIHRoaXMgKVxuXHRcdFx0XHRcdC5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlIClcblx0XHRcdFx0XHQuY2xvc2VzdCggJy53Y2FwZi1maWx0ZXItaXRlbScgKVxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcyggJ2l0ZW0tYWN0aXZlJyApO1xuXG5cdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoICQoIHRoaXMgKS5kYXRhKCAndXJsJyApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVEcm9wZG93bkZpbHRlcnM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCAnLndjYXBmLWRyb3Bkb3duLXdyYXBwZXIgc2VsZWN0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRzZWxlY3QgICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCB2YWx1ZXMgICAgICAgICA9ICRzZWxlY3QudmFsKCk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlclVSTCAgICAgID0gJHNlbGVjdC5kYXRhKCAndXJsJyApO1xuXHRcdFx0XHRjb25zdCBjbGVhckZpbHRlclVSTCA9ICRzZWxlY3QuZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICk7XG5cdFx0XHRcdGxldCB1cmw7XG5cblx0XHRcdFx0aWYgKCB2YWx1ZXMubGVuZ3RoICkge1xuXHRcdFx0XHRcdHVybCA9IGZpbHRlclVSTC5yZXBsYWNlKCAnJXMnLCB2YWx1ZXMudG9TdHJpbmcoKSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHVybCA9IGNsZWFyRmlsdGVyVVJMO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggdXJsICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRoYW5kbGVQYWdpbmF0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4ICYmIHdjYXBmX3BhcmFtcy5wYWdpbmF0aW9uX2NvbnRhaW5lciApIHtcblx0XHRcdFx0Y29uc3QgJGNvbnRhaW5lciA9ICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRcdGNvbnN0IF9zZWxlY3RvcnMgPSB3Y2FwZl9wYXJhbXMucGFnaW5hdGlvbl9jb250YWluZXIuc3BsaXQoICcsJyApO1xuXHRcdFx0XHRjb25zdCBzZWxlY3RvcnMgID0gW107XG5cblx0XHRcdFx0X3NlbGVjdG9ycy5mb3JFYWNoKCBzZWxlY3RvciA9PiB7XG5cdFx0XHRcdFx0aWYgKCBzZWxlY3RvciApIHtcblx0XHRcdFx0XHRcdHNlbGVjdG9ycy5wdXNoKCBzZWxlY3RvciArICcgYScgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRjb25zdCBzZWxlY3RvciA9IHNlbGVjdG9ycy5qb2luKCAnLCcgKTtcblxuXHRcdFx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdCRjb250YWluZXIub24oICdjbGljaycsIHNlbGVjdG9yLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgaHJlZiA9ICQoIHRoaXMgKS5hdHRyKCAnaHJlZicgKTtcblxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggaHJlZiwgJ3BhZ2luYXRlJyApO1xuXHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aGFuZGxlRGVmYXVsdE9yZGVyYnk6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5zb3J0aW5nX2NvbnRyb2wgKSB7XG5cdFx0XHRcdC8vIFN1Ym1pdCB0aGUgb3JkZXJieSBmb3JtIHdoZW4gdmFsdWUgaXMgY2hhbmdlZC5cblx0XHRcdFx0JGJvZHkub24oICdjaGFuZ2UnLCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nIHNlbGVjdC5vcmRlcmJ5JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCggdGhpcyApLmNsb3Nlc3QoICdmb3JtJyApLnRyaWdnZXIoICdzdWJtaXQnICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFByZXZlbnQgdGhlIGF1dG8gc3VibWlzc2lvbiBvZiB0aGUgb3JkZXJieSBmb3JtLlxuXHRcdFx0JGJvZHkub24oICdzdWJtaXQnLCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCB2aWEgYWpheCB3aGVuIHRoZSBvcmRlcmJ5IHZhbHVlIGlzIGNoYW5nZWQuXG5cdFx0XHQkYm9keS5vbiggJ2NoYW5nZScsICcud29vY29tbWVyY2Utb3JkZXJpbmcgc2VsZWN0Lm9yZGVyYnknLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3Qgb3JkZXIgPSAkKCB0aGlzICkudmFsKCk7XG5cblx0XHRcdFx0Y29uc3QgdXJsID0gbmV3IFVSTCggd2luZG93LmxvY2F0aW9uICk7XG5cdFx0XHRcdHVybC5zZWFyY2hQYXJhbXMuc2V0KCAnb3JkZXJieScsIG9yZGVyICk7XG5cblx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggZ2V0T3JkZXJCeVVybCggdXJsLmhyZWYgKSApO1xuXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGhhbmRsZUNsZWFyRmlsdGVyOiBmdW5jdGlvbigpIHtcblx0XHRcdCRib2R5Lm9uKCAnY2xpY2snLCAnLndjYXBmLWZpbHRlci1jbGVhci1idG4nLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0XHRXQ0FQRi5yZXF1ZXN0RmlsdGVyKCAkKCB0aGlzICkuYXR0ciggJ2RhdGEtY2xlYXItZmlsdGVyLXVybCcgKSApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aGFuZGxlRmlsdGVyVG9vbHRpcDogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICdmdW5jdGlvbicgIT09IHR5cGVvZiB0aXBweSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLnVzZV90aXBweWpzICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRpcHB5KCAnLndjYXBmLWZpbHRlci10b29sdGlwJywge1xuXHRcdFx0XHRwbGFjZW1lbnQ6ICd0b3AnLFxuXHRcdFx0XHRjb250ZW50KCByZWZlcmVuY2UgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlZmVyZW5jZS5nZXRBdHRyaWJ1dGUoICdkYXRhLWNvbnRlbnQnICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGFsbG93SFRNTDogdHJ1ZSxcblx0XHRcdH0gKTtcblx0XHR9LFxuXHRcdGluaXRDb21ib2JveDogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICEgalF1ZXJ5KCkuY2hvc2VuV0NBUEYgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgdGVtcGxhdGVSZXN1bHQgPSAoIHRleHQsIGRhdGEgKSA9PiB7XG5cdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0JzxzcGFuPicgKyB0ZXh0ICsgJzwvc3Bhbj4nLFxuXHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cIndjYXBmLWNvdW50XCI+JyArIGRhdGFbICdjb3VudE1hcmt1cCcgXSArICc8L3NwYW4+Jyxcblx0XHRcdFx0XS5qb2luKCAnJyApO1xuXHRcdFx0fTtcblxuXHRcdFx0Y29uc3QgdGVtcGxhdGVTZWxlY3Rpb24gPSAoIHRleHQsIGRhdGEgKSA9PiB7XG5cdFx0XHRcdHJldHVybiBbXG5cdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwid2NhcGYtY291bnQtJyArIGRhdGEuY291bnQgKyAnXCI+JyArIHRleHQgKyAnPC9zcGFuPicsXG5cdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwid2NhcGYtY291bnQgd2NhcGYtY291bnQtJyArIGRhdGEuY291bnQgKyAnXCI+JyArIGRhdGFbICdjb3VudE1hcmt1cCcgXSArICc8L3NwYW4+Jyxcblx0XHRcdFx0XS5qb2luKCAnJyApO1xuXHRcdFx0fTtcblxuXHRcdFx0Y29uc3QgZGVmYXVsdHMgPSB7XG5cdFx0XHRcdGluaGVyaXRfc2VsZWN0X2NsYXNzZXM6IHRydWUsXG5cdFx0XHRcdGluaGVyaXRfb3B0aW9uX2NsYXNzZXM6IHRydWUsXG5cdFx0XHRcdG5vX3Jlc3VsdHNfdGV4dDogd2NhcGZfcGFyYW1zLmNob3Nlbl9ub19yZXN1bHRzX3RleHQsXG5cdFx0XHRcdG9wdGlvbnNfbm9uZV90ZXh0OiB3Y2FwZl9wYXJhbXMuY2hvc2VuX29wdGlvbnNfbm9uZV90ZXh0LFxuXHRcdFx0XHRzZWFyY2hfY29udGFpbnM6IHRydWUsIC8vIE1hdGNoIGZyb20gYW55d2hlcmUgaW4gc3RyaW5nLlxuXHRcdFx0XHRzZWFyY2hfaW5fdmFsdWVzOiB0cnVlLCAvLyBTZWFyY2ggaW4gdmFsdWVzIGFsc28uXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5pc19ydGwgKSB7XG5cdFx0XHRcdGRlZmF1bHRzWyAncnRsJyBdID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1jaG9zZW4nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0aGlzICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7IC4uLmRlZmF1bHRzIH07XG5cblx0XHRcdFx0Ly8gSWYgaGllcmFyY2h5IGVuYWJsZWQgdGhlbiB3ZSBzaG93IHRoZSBzZWxlY3RlZCBvcHRpb25zLlxuXHRcdFx0XHRpZiAoICR0aGlzLmhhc0NsYXNzKCAnaGFzLWhpZXJhcmNoeScgKSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJyBdID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnZGlzcGxheV9zZWxlY3RlZF9vcHRpb25zJyBdID0gd2NhcGZfcGFyYW1zLmNob3Nlbl9kaXNwbGF5X3NlbGVjdGVkX29wdGlvbnM7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBFbmFibGUgdGVtcGxhdGluZyB3aGVuIHNob3dpbmcgY291bnQuXG5cdFx0XHRcdGlmICggJHRoaXMuaGFzQ2xhc3MoICd3aXRoLWNvdW50JyApICkge1xuXHRcdFx0XHRcdG9wdGlvbnNbICd0ZW1wbGF0ZVJlc3VsdCcgXSAgICA9IHRlbXBsYXRlUmVzdWx0O1xuXHRcdFx0XHRcdG9wdGlvbnNbICd0ZW1wbGF0ZVNlbGVjdGlvbicgXSA9IHRlbXBsYXRlU2VsZWN0aW9uO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gRGlzYWJsZSBzZWFyY2ggYm94LlxuXHRcdFx0XHRpZiAoICEgJHRoaXMuZGF0YSggJ2VuYWJsZS1zZWFyY2gnICkgKSB7XG5cdFx0XHRcdFx0b3B0aW9uc1sgJ2Rpc2FibGVfc2VhcmNoJyBdID0gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCR0aGlzLmNob3NlbldDQVBGKCBvcHRpb25zICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIEF0dGFjaCBjaG9zZW4gZm9yIGRlZmF1bHQgb3JkZXJieS5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmF0dGFjaF9jaG9zZW5fb25fc29ydGluZyApIHtcblx0XHRcdFx0bGV0IGRpc2FibGVTZWFyY2ggPSB0cnVlO1xuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnNlYXJjaF9ib3hfaW5fZGVmYXVsdF9vcmRlcmJ5ICkge1xuXHRcdFx0XHRcdGRpc2FibGVTZWFyY2ggPSBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7IC4uLmRlZmF1bHRzIH07XG5cblx0XHRcdFx0b3B0aW9uc1sgJ2Rpc2FibGVfc2VhcmNoJyBdID0gZGlzYWJsZVNlYXJjaDtcblxuXHRcdFx0XHQkYm9keS5maW5kKCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nIHNlbGVjdC5vcmRlcmJ5JyApLmNob3NlbldDQVBGKCBvcHRpb25zICk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRpbml0UmFuZ2VTbGlkZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG5vVWlTbGlkZXIgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0JGJvZHkuZmluZCggJy53Y2FwZi1yYW5nZS1zbGlkZXInICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRpdGVtICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0ICRzbGlkZXIgPSAkaXRlbS5maW5kKCAnLndjYXBmLW5vdWktc2xpZGVyJyApO1xuXG5cdFx0XHRcdGNvbnN0IHNsaWRlcklkICAgICAgICAgID0gJHNsaWRlci5hdHRyKCAnaWQnICk7XG5cdFx0XHRcdGNvbnN0IGRpc3BsYXlWYWx1ZXNBcyAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGlzcGxheS12YWx1ZXMtYXMnICk7XG5cdFx0XHRcdGNvbnN0IGZvcm1hdE51bWJlcnMgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZm9ybWF0LW51bWJlcnMnICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IHN0ZXAgICAgICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtc3RlcCcgKSApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsUGxhY2VzICAgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtcGxhY2VzJyApO1xuXHRcdFx0XHRjb25zdCB0aG91c2FuZFNlcGFyYXRvciA9ICRpdGVtLmF0dHIoICdkYXRhLXRob3VzYW5kLXNlcGFyYXRvcicgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFNlcGFyYXRvciAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXNlcGFyYXRvcicgKTtcblx0XHRcdFx0Y29uc3QgbWluVmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgJG1pblZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1pbi12YWx1ZScgKTtcblx0XHRcdFx0Y29uc3QgJG1heFZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1heC12YWx1ZScgKTtcblxuXHRcdFx0XHRjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggc2xpZGVySWQgKTtcblxuXHRcdFx0XHRub1VpU2xpZGVyLmNyZWF0ZSggc2xpZGVyLCB7XG5cdFx0XHRcdFx0c3RhcnQ6IFsgbWluVmFsdWUsIG1heFZhbHVlIF0sXG5cdFx0XHRcdFx0c3RlcCxcblx0XHRcdFx0XHRjb25uZWN0OiB0cnVlLFxuXHRcdFx0XHRcdGNzc1ByZWZpeDogJ3djYXBmLW5vdWktJyxcblx0XHRcdFx0XHRyYW5nZToge1xuXHRcdFx0XHRcdFx0J21pbic6IHJhbmdlTWluVmFsdWUsXG5cdFx0XHRcdFx0XHQnbWF4JzogcmFuZ2VNYXhWYWx1ZSxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ3VwZGF0ZScsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdFx0bGV0IG1pblZhbHVlO1xuXHRcdFx0XHRcdGxldCBtYXhWYWx1ZTtcblxuXHRcdFx0XHRcdGlmICggZm9ybWF0TnVtYmVycyApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gbnVtYmVyRm9ybWF0KCB2YWx1ZXNbIDAgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gbnVtYmVyRm9ybWF0KCB2YWx1ZXNbIDEgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDAgXSApO1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDEgXSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggJ3BsYWluX3RleHQnID09PSBkaXNwbGF5VmFsdWVzQXMgKSB7XG5cdFx0XHRcdFx0XHQkbWluVmFsdWUuaHRtbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHRcdCRtYXhWYWx1ZS5odG1sKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkbWluVmFsdWUudmFsKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdFx0JG1heFZhbHVlLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGYtbm91aXNsaWRlci11cGRhdGUnLCBbICRpdGVtLCB2YWx1ZXMgXSApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICkge1xuXHRcdFx0XHRcdGNvbnN0IF9taW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0Y29uc3QgX21heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblxuXHRcdFx0XHRcdC8vIElmIHZhbHVlIGlzIG5vdCBjaGFuZ2VkIHRoZW4gZG9uJ3QgcHJvY2VlZC5cblx0XHRcdFx0XHRpZiAoIF9taW5WYWx1ZSA9PT0gbWluVmFsdWUgJiYgX21heFZhbHVlID09PSBtYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIF9taW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBfbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHQvLyBSZW1vdmUgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdFx0V0NBUEYucmVxdWVzdEZpbHRlciggJGl0ZW0uZGF0YSggJ2NsZWFyLWZpbHRlci11cmwnICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRcdGNvbnN0IHVybCA9ICRpdGVtLmRhdGEoICd1cmwnICkucmVwbGFjZSggJyUxcycsIF9taW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBfbWF4VmFsdWUgKTtcblx0XHRcdFx0XHRcdFdDQVBGLnJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtaW5WYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG1pblZhbHVlLCBudWxsIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkbWF4VmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRcdGNsZWFyVGltZW91dCggJGlucHV0LmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBudWxsLCBtYXhWYWx1ZSBdICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblx0XHRpbml0RmlsdGVyT3B0aW9uVG9vbHRpcDogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoICdmdW5jdGlvbicgIT09IHR5cGVvZiB0aXBweSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLnVzZV90aXBweWpzICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHRvb2x0aXBQb3NpdGlvbnMgPSBbICd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2xlZnQnIF07XG5cblx0XHRcdHRvb2x0aXBQb3NpdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oIHRvb2x0aXBQb3NpdGlvbiApIHtcblx0XHRcdFx0Y29uc3QgaWRlbnRpZmllciA9ICdkYXRhLXdjYXBmLXRvb2x0aXAtJyArIHRvb2x0aXBQb3NpdGlvbjtcblxuXHRcdFx0XHRjb25zdCBpbnN0YW5jZXMgPSB0aXBweSggJ1snICsgaWRlbnRpZmllciArICddJywge1xuXHRcdFx0XHRcdHBsYWNlbWVudDogdG9vbHRpcFBvc2l0aW9uLFxuXHRcdFx0XHRcdGNvbnRlbnQoIHJlZmVyZW5jZSApIHtcblx0XHRcdFx0XHRcdHJldHVybiByZWZlcmVuY2UuZ2V0QXR0cmlidXRlKCBpZGVudGlmaWVyICk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRhbGxvd0hUTUw6IHRydWUsXG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHR3aW5kb3cudGlwcHlJbnN0YW5jZXMgPSB0aXBweUluc3RhbmNlcy5jb25jYXQoIGluc3RhbmNlcyApO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRXQ0FQRi5pbml0Q29tYm9ib3goKTtcblx0XHRcdFdDQVBGLmluaXRSYW5nZVNsaWRlcigpO1xuXHRcdFx0V0NBUEYuaW5pdEZpbHRlck9wdGlvblRvb2x0aXAoKTtcblx0XHR9LFxuXHRcdGluaXRQb3BTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5yZWxvYWRfb25fYmFjayAmJiB3Y2FwZl9wYXJhbXMuZm91bmRfd2NhcGYgKSB7XG5cdFx0XHRcdGhpc3RvcnkucmVwbGFjZVN0YXRlKCB7IHdjYXBmOiB0cnVlIH0sICcnLCB3aW5kb3cubG9jYXRpb24gKTtcblxuXHRcdFx0XHQvLyBIYW5kbGUgdGhlIHBvcHN0YXRlIGV2ZW50KGJyb3dzZXIncyBiYWNrL2ZvcndhcmQpXG5cdFx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAncG9wc3RhdGUnLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRpZiAoIG51bGwgIT09IGUuc3RhdGUgJiYgZS5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSggJ3djYXBmJyApICkge1xuXHRcdFx0XHRcdFx0V0NBUEYuZmlsdGVyUHJvZHVjdHMoICdwb3BzdGF0ZScgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0LyoqXG5cdCAqIEVuYWJsZSBpdCBpZiBuZWNlc3NhcnkuXG5cdCAqXG5cdCAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzMzMDA0OTE3XG5cdCAqL1xuXHRpZiAoICdzY3JvbGxSZXN0b3JhdGlvbicgaW4gaGlzdG9yeSApIHtcblx0XHQvLyBoaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uID0gJ21hbnVhbCc7XG5cdH1cblxufSggalF1ZXJ5LCB3aW5kb3cgKSApO1xuXG4oIGZ1bmN0aW9uKCAkLCBXQ0FQRiApIHtcblxuXHRXQ0FQRi5pbml0KCk7XG5cdFdDQVBGLmluaXRQb3BTdGF0ZSgpO1xuXG5cdFdDQVBGLmhhbmRsZUZpbHRlckFjY29yZGlvbigpO1xuXHRXQ0FQRi5oYW5kbGVIaWVyYXJjaHlUb2dnbGUoKTtcblx0V0NBUEYuaGFuZGxlU29mdExpbWl0KCk7XG5cdFdDQVBGLmhhbmRsZVNlYXJjaEZpbHRlck9wdGlvbnMoKTtcblxuXHRXQ0FQRi5oYW5kbGVMaXN0RmlsdGVycygpO1xuXHRXQ0FQRi5oYW5kbGVEcm9wZG93bkZpbHRlcnMoKTtcblx0V0NBUEYuaGFuZGxlTnVtYmVySW5wdXRGaWx0ZXJzKCk7XG5cdFdDQVBGLmhhbmRsZVBhZ2luYXRpb24oKTtcblx0V0NBUEYuaGFuZGxlRGVmYXVsdE9yZGVyYnkoKTtcblxuXHRXQ0FQRi5oYW5kbGVDbGVhckZpbHRlcigpO1xuXG5cdFdDQVBGLmhhbmRsZUZpbHRlclRvb2x0aXAoKTtcblxufSggalF1ZXJ5LCB3aW5kb3cuV0NBUEYgKSApO1xuIiwiLyoqXG4gKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNDE0MTgxM1xuICpcbiAqIEBwYXJhbSBudW1iZXJcbiAqIEBwYXJhbSBkZWNpbWFsc1xuICogQHBhcmFtIGRlY19wb2ludFxuICogQHBhcmFtIHRob3VzYW5kc19zZXBcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBudW1iZXJGb3JtYXQoIG51bWJlciwgZGVjaW1hbHMsIGRlY19wb2ludCwgdGhvdXNhbmRzX3NlcCApIHtcblx0Ly8gU3RyaXAgYWxsIGNoYXJhY3RlcnMgYnV0IG51bWVyaWNhbCBvbmVzLlxuXHRudW1iZXIgPSAoIG51bWJlciArICcnICkucmVwbGFjZSggL1teXFxkK1xcLUVlLl0vZywgJycgKTtcblxuXHRjb25zdCBuICAgID0gISBpc0Zpbml0ZSggK251bWJlciApID8gMCA6ICtudW1iZXI7XG5cdGNvbnN0IHByZWMgPSAhIGlzRmluaXRlKCArZGVjaW1hbHMgKSA/IDAgOiBNYXRoLmFicyggZGVjaW1hbHMgKTtcblx0Y29uc3Qgc2VwICA9ICggdHlwZW9mIHRob3VzYW5kc19zZXAgPT09ICd1bmRlZmluZWQnICkgPyAnLCcgOiB0aG91c2FuZHNfc2VwO1xuXHRjb25zdCBkZWMgID0gKCB0eXBlb2YgZGVjX3BvaW50ID09PSAndW5kZWZpbmVkJyApID8gJy4nIDogZGVjX3BvaW50O1xuXG5cdGxldCBzO1xuXG5cdGNvbnN0IHRvRml4ZWRGaXggPSBmdW5jdGlvbiggbiwgcHJlYyApIHtcblx0XHRjb25zdCBrID0gTWF0aC5wb3coIDEwLCBwcmVjICk7XG5cdFx0cmV0dXJuICcnICsgTWF0aC5yb3VuZCggbiAqIGsgKSAvIGs7XG5cdH07XG5cblx0Ly8gRml4IGZvciBJRSBwYXJzZUZsb2F0KDAuNTUpLnRvRml4ZWQoMCkgPSAwO1xuXHRzID0gKCBwcmVjID8gdG9GaXhlZEZpeCggbiwgcHJlYyApIDogJycgKyBNYXRoLnJvdW5kKCBuICkgKS5zcGxpdCggJy4nICk7XG5cblx0aWYgKCBzWyAwIF0ubGVuZ3RoID4gMyApIHtcblx0XHRzWyAwIF0gPSBzWyAwIF0ucmVwbGFjZSggL1xcQig/PSg/OlxcZHszfSkrKD8hXFxkKSkvZywgc2VwICk7XG5cdH1cblxuXHRpZiAoICggc1sgMSBdIHx8ICcnICkubGVuZ3RoIDwgcHJlYyApIHtcblx0XHRzWyAxIF0gPSBzWyAxIF0gfHwgJyc7XG5cdFx0c1sgMSBdICs9IG5ldyBBcnJheSggcHJlYyAtIHNbIDEgXS5sZW5ndGggKyAxICkuam9pbiggJzAnICk7XG5cdH1cblxuXHRyZXR1cm4gcy5qb2luKCBkZWMgKTtcbn1cblxuZnVuY3Rpb24gY2xlYW5VcmwoIHVybCApIHtcblx0cmV0dXJuIHVybC5yZXBsYWNlKCAvJTJDL2csICcsJyApO1xufVxuXG5mdW5jdGlvbiBnZXRPcmRlckJ5VXJsKCB1cmwgKSB7XG5cdGNvbnN0IHBhZ2VkID0gcGFyc2VJbnQoIHVybC5yZXBsYWNlKCAvLitcXC9wYWdlXFwvKFxcZCspKy8sICckMScgKSApO1xuXG5cdGlmICggcGFnZWQgKSB7XG5cdFx0dXJsID0gdXJsLnJlcGxhY2UoIC9wYWdlXFwvKFxcZCspXFwvLywgJycgKTtcblx0fVxuXG5cdHJldHVybiBjbGVhblVybCggdXJsICk7XG59XG4iXX0=
