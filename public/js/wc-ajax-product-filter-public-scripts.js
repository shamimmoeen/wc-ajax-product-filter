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
  'filter_input_delay': '',
  'chosen_lib_search_threshold': '',
  'preserve_hierarchy_accordion_state': '',
  'enable_animation_for_hierarchy_accordion': '',
  'hierarchy_accordion_animation_speed': '',
  'hierarchy_accordion_animation_easing': '',
  'loading_overlay_options': '',
  'scroll_to_top_speed': '',
  'scroll_to_top_easing': '',
  'is_mobile': '',
  'disable_inputs_while_fetching_results': '',
  'apply_filters_on_browser_history_change': '',
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
  'scroll_to_top_offset': ''
};
jQuery(document).ready(function ($) {
  var $body = $('body');
  var rangeValuesSeparator = '~';

  var _delay = parseInt(wcapf_params.filter_input_delay);

  var delay = _delay >= 0 ? _delay : 800; // Store fields' id and filter information.

  var fields = {};
  var $wcapfSingleFilters = $('.wcapf-single-filter');
  var $wcapfNavFilters = $('.wcapf-nav-filter');
  var $wcapfNumberRangeFilters = $('.wcapf-number-range-filter');
  var $wcapfDateFilters = $('.wcapf-date-range-filter');
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

    $wcapfNavFilters.find('.wcapf-chosen-select').each(function () {
      var $this = $(this);
      var options = {};
      var noResultsMessage = $this.attr('data-no-results-message');

      if (noResultsMessage) {
        options['no_results_text'] = noResultsMessage;
      }

      var searchThreshold = parseInt(wcapf_params.chosen_lib_search_threshold);

      if (searchThreshold) {
        options['disable_search_threshold'] = searchThreshold;
      }

      $this.chosen(options);
    });
  }

  initChosen(); // Initialize hierarchy accordion.

  function initHierarchyAccordion() {
    $wcapfNavFilters.find('.hierarchy-accordion-toggle').on('click', function () {
      var $this = $(this);
      var $child = $this.parent('li').children('ul');
      $this.toggleClass('active');

      if (wcapf_params.enable_animation_for_hierarchy_accordion) {
        $child.slideToggle(wcapf_params.hierarchy_accordion_animation_speed, wcapf_params.hierarchy_accordion_animation_easing);
      } else {
        $child.toggle();
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

    $wcapfNumberRangeFilters.find('.wcapf-range-slider').each(function () {
      var $item = $(this);
      var filterKey = $item.attr('data-filter-key');
      var $slider = $item.find('.wcapf-noui-slider'); // If slider is already initialized then don't reinitialize again.

      if ($slider.hasClass('wcapf-noui-target')) {
        return;
      }

      var sliderId = $slider.attr('id');
      var displayValuesAs = $item.attr('data-display-values-as');
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
        var minValue = number_format(values[0], decimalPlaces, decimalSeparator, thousandSeparator);
        var maxValue = number_format(values[1], decimalPlaces, decimalSeparator, thousandSeparator);

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
        $body.trigger('wcapf-nouislider-before-filter-products', [$item, values]);
        var minValue = parseFloat(values[0]);
        var maxValue = parseFloat(values[1]);

        if (minValue === rangeMinValue && maxValue === rangeMaxValue) {
          var query = removeQueryStringParameter(filterKey);
          history.pushState({}, '', query);
        } else {
          var filterValString = minValue + rangeValuesSeparator + maxValue;
          updateQueryStringParameter(filterKey, filterValString);
        }

        filterProducts();
        $body.trigger('wcapf-nouislider-after-filter-products', [$item, values]);
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

    var $wcapfDateFilter = $wcapfDateFilters.find('.wcapf-date-input');
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
    }

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
    var selectors = '.wcapf-labeled-nav .item, .wcapf-active-filters .item';
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
    var selector = wcapf_params.pagination_container + ' a';

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
  } // Handle the filter request for list field.


  $wcapfNavFilters.on('change', '.wcapf-layered-nav [type="checkbox"], .wcapf-layered-nav [type="radio"]', function (event) {
    event.preventDefault();
    var $item = $(this);
    var filterValue = $item.val();
    handleFilterRequest($item, filterValue);
  }); // Handle the filter request for labeled item.

  $wcapfNavFilters.on('click', '.wcapf-labeled-nav .item:not(.disabled)', function (event) {
    event.preventDefault();
    var $item = $(this);
    var filterValue = $item.attr('data-value');
    handleFilterRequest($item, filterValue);
  }); // Handle the filter request for display type select fields.

  $wcapfNavFilters.on('change', 'select', function (event) {
    event.preventDefault();
    var $item = $(this);
    var filterValue = $item.val();
    var $field = $item.closest('.wcapf-single-filter');
    var fieldID = $field.attr('data-id');
    var fieldData = fields[fieldID];
    var filterKey = fieldData.filterKey;

    if (!filterValue.length) {
      var query = removeQueryStringParameter(filterKey);
      history.pushState({}, '', query);
    } else {
      var filterValString = filterValue.toString();
      updateQueryStringParameter(filterKey, filterValString);
    }

    filterProducts();
  });
  /**
   * Handle the filter request for range number.
   */

  var rangeNumberSelectors = '.wcapf-range-number .min-value, .wcapf-range-number .max-value';
  $wcapfNumberRangeFilters.on('input', rangeNumberSelectors, function (event) {
    event.preventDefault();
    var $item = $(this); // Clear any previously set timer before setting a fresh one

    clearTimeout($item.data('timer'));
    $item.data('timer', setTimeout(function () {
      $item.removeData('timer');
      var $rangeNumber = $item.closest('.wcapf-range-number');
      var filterKey = $rangeNumber.attr('data-filter-key');
      var rangeMinValue = $rangeNumber.attr('data-range-min-value');
      var rangeMaxValue = $rangeNumber.attr('data-range-max-value');
      var minValue = $rangeNumber.find('.min-value').val();
      var maxValue = $rangeNumber.find('.max-value').val(); // Force the minValue not to be empty.

      if (!minValue.length) {
        minValue = rangeMinValue;
        $rangeNumber.find('.min-value').val(minValue);
      } // Force the maxValue not to be empty.


      if (!maxValue.length) {
        maxValue = rangeMaxValue;
        $rangeNumber.find('.max-value').val(maxValue);
      } // Force the minValue not to go below the rangeMinValue.


      if (parseFloat(minValue) < parseFloat(rangeMinValue)) {
        minValue = rangeMinValue;
        $rangeNumber.find('.min-value').val(minValue);
      } // Force the minValue not to go up the rangeMaxValue.


      if (parseFloat(minValue) > parseFloat(rangeMaxValue)) {
        minValue = rangeMaxValue;
        $rangeNumber.find('.min-value').val(minValue);
      } // Force the maxValue not to go up the rangeMaxValue.


      if (parseFloat(maxValue) > parseFloat(rangeMaxValue)) {
        maxValue = rangeMaxValue;
        $rangeNumber.find('.max-value').val(maxValue);
      } // Force the maxValue not to go below the minValue.


      if (parseFloat(minValue) > parseFloat(maxValue)) {
        maxValue = minValue;
        $rangeNumber.find('.max-value').val(maxValue);
      }

      if (minValue === rangeMinValue && maxValue === rangeMaxValue) {
        var query = removeQueryStringParameter(filterKey);
        history.pushState({}, '', query);
      } else {
        var filterValString = minValue + rangeValuesSeparator + maxValue;
        updateQueryStringParameter(filterKey, filterValString);
      }

      filterProducts();
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
  });
  $body.on('wcapf-run-filter-products', function (e, forceReRender) {
    filterProducts(forceReRender);
  });

  if ($(wcapf_params.shop_loop_container).length || $(wcapf_params.not_found_container).length) {
    if (wcapf_params.apply_filters_on_browser_history_change) {
      $(window).bind('popstate', function () {
        filterProducts(true);
      });
    }
  }
  /**
   * Make it compatible with other plugins.
   */


  $body.on('wcapf_after_updating_products', function () {
    // woo-variation-swatches
    $(document).trigger('woo_variation_swatches_pro_init');
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbHRlci1mb3JtLmpzIl0sIm5hbWVzIjpbIndjYXBmX3BhcmFtcyIsImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwiJGJvZHkiLCJyYW5nZVZhbHVlc1NlcGFyYXRvciIsIl9kZWxheSIsInBhcnNlSW50IiwiZmlsdGVyX2lucHV0X2RlbGF5IiwiZGVsYXkiLCJmaWVsZHMiLCIkd2NhcGZTaW5nbGVGaWx0ZXJzIiwiJHdjYXBmTmF2RmlsdGVycyIsIiR3Y2FwZk51bWJlclJhbmdlRmlsdGVycyIsIiR3Y2FwZkRhdGVGaWx0ZXJzIiwiZWFjaCIsIiRmaWVsZCIsImlkIiwiYXR0ciIsIiR3cmFwcGVyIiwiZmluZCIsImZpbHRlcktleSIsIm11bHRpcGxlRmlsdGVyIiwiaW5pdENob3NlbiIsImNob3NlbiIsIiR0aGlzIiwib3B0aW9ucyIsIm5vUmVzdWx0c01lc3NhZ2UiLCJzZWFyY2hUaHJlc2hvbGQiLCJjaG9zZW5fbGliX3NlYXJjaF90aHJlc2hvbGQiLCJpbml0SGllcmFyY2h5QWNjb3JkaW9uIiwib24iLCIkY2hpbGQiLCJwYXJlbnQiLCJjaGlsZHJlbiIsInRvZ2dsZUNsYXNzIiwiZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbiIsInNsaWRlVG9nZ2xlIiwiaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQiLCJoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmciLCJ0b2dnbGUiLCJudW1iZXJfZm9ybWF0IiwibnVtYmVyIiwiZGVjaW1hbHMiLCJkZWNfcG9pbnQiLCJ0aG91c2FuZHNfc2VwIiwicmVwbGFjZSIsIm4iLCJpc0Zpbml0ZSIsInByZWMiLCJNYXRoIiwiYWJzIiwic2VwIiwiZGVjIiwicyIsInRvRml4ZWRGaXgiLCJrIiwicG93Iiwicm91bmQiLCJzcGxpdCIsImxlbmd0aCIsIkFycmF5Iiwiam9pbiIsImluaXROb1VJU2xpZGVyIiwibm9VaVNsaWRlciIsIiRpdGVtIiwiJHNsaWRlciIsImhhc0NsYXNzIiwic2xpZGVySWQiLCJkaXNwbGF5VmFsdWVzQXMiLCJyYW5nZU1pblZhbHVlIiwicGFyc2VGbG9hdCIsInJhbmdlTWF4VmFsdWUiLCJzdGVwIiwiZGVjaW1hbFBsYWNlcyIsInRob3VzYW5kU2VwYXJhdG9yIiwiZGVjaW1hbFNlcGFyYXRvciIsIm1pblZhbHVlIiwibWF4VmFsdWUiLCIkbWluVmFsdWUiLCIkbWF4VmFsdWUiLCJzbGlkZXIiLCJnZXRFbGVtZW50QnlJZCIsImNyZWF0ZSIsInN0YXJ0IiwiY29ubmVjdCIsImNzc1ByZWZpeCIsInJhbmdlIiwidmFsdWVzIiwiaHRtbCIsInZhbCIsInRyaWdnZXIiLCJmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyIiwicXVlcnkiLCJyZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJmaWx0ZXJWYWxTdHJpbmciLCJ1cGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciIsImZpbHRlclByb2R1Y3RzIiwiY2xlYXJUaW1lb3V0IiwiZGF0YSIsInNldFRpbWVvdXQiLCJyZW1vdmVEYXRhIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsIiRpbnB1dCIsInNldCIsImdldCIsImZpbHRlckJ5RGF0ZSIsIiR3Y2FwZkRhdGVGaWx0ZXIiLCJjbG9zZXN0IiwiaXNSYW5nZSIsImZpbHRlclZhbHVlIiwicnVuRmlsdGVyIiwiZnJvbSIsInRvIiwiaW5pdERhdGVwaWNrZXIiLCJkYXRlcGlja2VyIiwiZm9ybWF0IiwieWVhckRyb3Bkb3duIiwibW9udGhEcm9wZG93biIsIiRmcm9tIiwiJHRvIiwiZGF0ZUZvcm1hdCIsImNoYW5nZVllYXIiLCJjaGFuZ2VNb250aCIsImluaXREZWZhdWx0T3JkZXJCeSIsImF0dGFjaF9jaG9zZW5fb25fc29ydGluZyIsInNvcnRpbmdfY29udHJvbCIsIiRvcmRlcmluZ0Zvcm0iLCJzdWJtaXQiLCJlIiwib3JkZXIiLCJmaWx0ZXJfa2V5IiwidXBkYXRlUHJvZHVjdHNDb3VudFJlc3VsdCIsIiRyZXN1bHRzIiwic2VsZWN0b3IiLCJzaG9wX2xvb3BfY29udGFpbmVyIiwibmV3UHJvZHVjdENvdW50Iiwic2hvd0xvYWRpbmdBbmltYXRpb24iLCJsb2FkaW5nX2FuaW1hdGlvbiIsIkxvYWRpbmdPdmVybGF5IiwibG9hZGluZ19vdmVybGF5X29wdGlvbnMiLCJkaXNhYmxlTm9VaVNsaWRlcnMiLCJlbGVtZW50Iiwic2V0QXR0cmlidXRlIiwiZGlzYWJsZUxhYmVscyIsInNlbGVjdG9ycyIsImFkZENsYXNzIiwiZGlzYWJsZUlucHV0cyIsImRpc2FibGVfaW5wdXRzX3doaWxlX2ZldGNoaW5nX3Jlc3VsdHMiLCJpbnB1dHMiLCJlbmFibGVOb1VpU2xpZGVycyIsInJlbW92ZUF0dHJpYnV0ZSIsImVuYWJsZUlucHV0cyIsInJlbW92ZUF0dHIiLCJyZXNldExvYWRpbmdBbmltYXRpb24iLCJzY3JvbGxUbyIsInNjcm9sbF93aW5kb3ciLCJzY3JvbGxGb3IiLCJzY3JvbGxfd2luZG93X2ZvciIsImlzTW9iaWxlIiwiaXNfbW9iaWxlIiwicHJvY2VlZCIsImFkanVzdGluZ09mZnNldCIsIm9mZnNldCIsInNjcm9sbF90b190b3Bfb2Zmc2V0IiwiY29udGFpbmVyIiwibm90X2ZvdW5kX2NvbnRhaW5lciIsInNjcm9sbF93aW5kb3dfY3VzdG9tX2VsZW1lbnQiLCIkY29udGFpbmVyIiwidG9wIiwic3RvcCIsImFuaW1hdGUiLCJzY3JvbGxUb3AiLCJzY3JvbGxfdG9fdG9wX3NwZWVkIiwic2Nyb2xsX3RvX3RvcF9lYXNpbmciLCJiZWZvcmVGZXRjaGluZ1Byb2R1Y3RzIiwic2Nyb2xsX3dpbmRvd193aGVuIiwiYmVmb3JlVXBkYXRpbmdQcm9kdWN0cyIsImFmdGVyVXBkYXRpbmdQcm9kdWN0cyIsImZvcmNlUmVSZW5kZXIiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCIkZGF0YSIsImZpZWxkSUQiLCIkaW5uZXIiLCJfZmllbGQiLCJmaWVsZENsYXNzZXMiLCJwcmVzZXJ2ZV9oaWVyYXJjaHlfYWNjb3JkaW9uX3N0YXRlIiwiaXRlbVZhbHVlIiwidG9nZ2xlU2VsZWN0b3IiLCJ1bFNlbGVjdG9yIiwiX2NsYXNzZXMiLCJzaG93IiwiX2h0bWwiLCJzb2Z0TGltaXRTZWxlY3RvciIsInRyaW0iLCIkc2hvcExvb3BDb250YWluZXIiLCIkbm90Rm91bmRDb250YWluZXIiLCJnZXRVcmxWYXJzIiwidXJsIiwidmFycyIsImhhc2giLCJyZXBsYWNlQWxsIiwiaGFzaGVzIiwic2xpY2UiLCJpbmRleE9mIiwiaExlbmd0aCIsImkiLCJmaXhQYWdpbmF0aW9uIiwicGFyYW1zIiwiY3VycmVudFBhZ2VJblVybCIsImN1cnJlbnRQYWdlSW5QYXJhbXMiLCJrZXkiLCJ2YWx1ZSIsInB1c2hIaXN0b3J5IiwicmUiLCJSZWdFeHAiLCJzZXBhcmF0b3IiLCJ1cmxXaXRoUXVlcnkiLCJtYXRjaCIsIm9sZFBhcmFtcyIsIm9sZFBhcmFtc0xlbmd0aCIsIk9iamVjdCIsImtleXMiLCJzdGFydFBvc2l0aW9uIiwiZmlsdGVyS2V5UG9zaXRpb24iLCJjbGVhblVybCIsImNsZWFuUXVlcnkiLCJuZXdQYXJhbXMiLCJtYWtlUGFyYW1ldGVycyIsImZvcmNlUmVyZW5kZXIiLCJ2YWx1ZVNlcGFyYXRvciIsIm5leHRWYWx1ZXMiLCJlbXB0eVZhbHVlIiwicHJldlZhbHVlcyIsInByZXZWYWx1ZXNBcnJheSIsImZvdW5kIiwiaW5BcnJheSIsInNwbGljZSIsInB1c2giLCJzaW5nbGVGaWx0ZXIiLCJlbmFibGVfcGFnaW5hdGlvbl92aWFfYWpheCIsInBhZ2luYXRpb25fY29udGFpbmVyIiwiaGFuZGxlRmlsdGVyUmVxdWVzdCIsImZpZWxkRGF0YSIsInRvU3RyaW5nIiwicmFuZ2VOdW1iZXJTZWxlY3RvcnMiLCIkcmFuZ2VOdW1iZXIiLCJyZXNldEZpbHRlcnMiLCIkYnV0dG9uIiwiX2ZpbHRlcktleXMiLCJmaWx0ZXJLZXlzIiwicHJldlVybCIsIm5ld1VybCIsImFwcGx5X2ZpbHRlcnNfb25fYnJv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R0FBR0MsMEJBQTBCLENBQUV6RSxTQUFGLENBQXhDO0FBQ0EwRSxJQUFBQSxPQUFPLENBQUNDLFNBQVIsQ0FBbUIsRUFBbkIsRUFBdUIsRUFBdkIsRUFBMkJILEtBQTNCO0FBRUFNLElBQUFBLGNBQWMsQ0FBRSxJQUFGLENBQWQ7QUFDQSxHQVZEO0FBWUEvRixFQUFBQSxLQUFLLENBQUMyQixFQUFOLENBQVUsMkJBQVYsRUFBdUMsVUFBVXFHLENBQVYsRUFBYWtELGFBQWIsRUFBNkI7QUFDbkVuRixJQUFBQSxjQUFjLENBQUVtRixhQUFGLENBQWQ7QUFDQSxHQUZEOztBQUlBLE1BQUtuTCxDQUFDLENBQUVKLFlBQVksQ0FBQzJJLG1CQUFmLENBQUQsQ0FBc0M5RSxNQUF0QyxJQUFnRHpELENBQUMsQ0FBRUosWUFBWSxDQUFDMEssbUJBQWYsQ0FBRCxDQUFzQzdHLE1BQTNGLEVBQW9HO0FBQ25HLFFBQUs3RCxZQUFZLENBQUNtUSx1Q0FBbEIsRUFBNEQ7QUFDM0QvUCxNQUFBQSxDQUFDLENBQUVvTCxNQUFGLENBQUQsQ0FBWTRFLElBQVosQ0FBa0IsVUFBbEIsRUFBOEIsWUFBVztBQUN4Q2hLLFFBQUFBLGNBQWMsQ0FBRSxJQUFGLENBQWQ7QUFDQSxPQUZEO0FBR0E7QUFDRDtBQUVEO0FBQ0Q7QUFDQTs7O0FBQ0MvRixFQUFBQSxLQUFLLENBQUMyQixFQUFOLENBQVUsK0JBQVYsRUFBMkMsWUFBVztBQUNyRDtBQUNBNUIsSUFBQUEsQ0FBQyxDQUFFRixRQUFGLENBQUQsQ0FBYzBGLE9BQWQsQ0FBdUIsaUNBQXZCO0FBQ0EsR0FIRDtBQUlBLENBampDRCIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLXB1YmxpYy1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgZnJvbnRlbmQgZmlsdGVyIGZvcm0uXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvcHVibGljL3NyYy9qc1xuICogQGF1dGhvciAgICAgd3B0b29scy5pb1xuICovXG5cbmNvbnN0IHdjYXBmX3BhcmFtcyA9IHdjYXBmX3BhcmFtcyB8fCB7XG5cdCdmaWx0ZXJfaW5wdXRfZGVsYXknOiAnJyxcblx0J2Nob3Nlbl9saWJfc2VhcmNoX3RocmVzaG9sZCc6ICcnLFxuXHQncHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSc6ICcnLFxuXHQnZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbic6ICcnLFxuXHQnaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQnOiAnJyxcblx0J2hpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyc6ICcnLFxuXHQnbG9hZGluZ19vdmVybGF5X29wdGlvbnMnOiAnJyxcblx0J3Njcm9sbF90b190b3Bfc3BlZWQnOiAnJyxcblx0J3Njcm9sbF90b190b3BfZWFzaW5nJzogJycsXG5cdCdpc19tb2JpbGUnOiAnJyxcblx0J2Rpc2FibGVfaW5wdXRzX3doaWxlX2ZldGNoaW5nX3Jlc3VsdHMnOiAnJyxcblx0J2FwcGx5X2ZpbHRlcnNfb25fYnJvd3Nlcl9oaXN0b3J5X2NoYW5nZSc6ICcnLFxuXHQnc2hvcF9sb29wX2NvbnRhaW5lcic6ICcnLFxuXHQnbm90X2ZvdW5kX2NvbnRhaW5lcic6ICcnLFxuXHQnZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXgnOiAnJyxcblx0J3BhZ2luYXRpb25fY29udGFpbmVyJzogJycsXG5cdCdzb3J0aW5nX2NvbnRyb2wnOiAnJyxcblx0J2F0dGFjaF9jaG9zZW5fb25fc29ydGluZyc6ICcnLFxuXHQnbG9hZGluZ19hbmltYXRpb24nOiAnJyxcblx0J3Njcm9sbF93aW5kb3cnOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfZm9yJzogJycsXG5cdCdzY3JvbGxfd2luZG93X3doZW4nOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfY3VzdG9tX2VsZW1lbnQnOiAnJyxcblx0J3Njcm9sbF90b190b3Bfb2Zmc2V0JzogJycsXG59O1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0ICRib2R5ID0gJCggJ2JvZHknICk7XG5cblx0Y29uc3QgcmFuZ2VWYWx1ZXNTZXBhcmF0b3IgPSAnfic7XG5cblx0Y29uc3QgX2RlbGF5ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5maWx0ZXJfaW5wdXRfZGVsYXkgKTtcblx0Y29uc3QgZGVsYXkgID0gX2RlbGF5ID49IDAgPyBfZGVsYXkgOiA4MDA7XG5cblx0Ly8gU3RvcmUgZmllbGRzJyBpZCBhbmQgZmlsdGVyIGluZm9ybWF0aW9uLlxuXHRjb25zdCBmaWVsZHMgPSB7fTtcblxuXHRjb25zdCAkd2NhcGZTaW5nbGVGaWx0ZXJzICAgICAgPSAkKCAnLndjYXBmLXNpbmdsZS1maWx0ZXInICk7XG5cdGNvbnN0ICR3Y2FwZk5hdkZpbHRlcnMgICAgICAgICA9ICQoICcud2NhcGYtbmF2LWZpbHRlcicgKTtcblx0Y29uc3QgJHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzID0gJCggJy53Y2FwZi1udW1iZXItcmFuZ2UtZmlsdGVyJyApO1xuXHRjb25zdCAkd2NhcGZEYXRlRmlsdGVycyAgICAgICAgPSAkKCAnLndjYXBmLWRhdGUtcmFuZ2UtZmlsdGVyJyApO1xuXG5cdCR3Y2FwZlNpbmdsZUZpbHRlcnMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgaWQgICAgICAgICAgICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtaWQnICk7XG5cdFx0Y29uc3QgJHdyYXBwZXIgICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1maWVsZC1pbm5lciA+IGRpdicgKTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICA9ICR3cmFwcGVyLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0Y29uc3QgbXVsdGlwbGVGaWx0ZXIgPSBwYXJzZUludCggJHdyYXBwZXIuYXR0ciggJ2RhdGEtbXVsdGlwbGUtZmlsdGVyJyApICk7XG5cblx0XHRmaWVsZHNbIGlkIF0gPSB7XG5cdFx0XHRmaWx0ZXJLZXk6IGZpbHRlcktleSxcblx0XHRcdG11bHRpcGxlRmlsdGVyOiBtdWx0aXBsZUZpbHRlclxuXHRcdH07XG5cdH0gKTtcblxuXHQvLyBJbml0aWFsaXplIGpRdWVyeSBjaG9zZW4gbGlicmFyeS5cblx0ZnVuY3Rpb24gaW5pdENob3NlbigpIHtcblx0XHRpZiAoICEgalF1ZXJ5KCkuY2hvc2VuICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCR3Y2FwZk5hdkZpbHRlcnMuZmluZCggJy53Y2FwZi1jaG9zZW4tc2VsZWN0JyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgICA9ICQoIHRoaXMgKTtcblx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7fTtcblxuXHRcdFx0Y29uc3Qgbm9SZXN1bHRzTWVzc2FnZSA9ICR0aGlzLmF0dHIoICdkYXRhLW5vLXJlc3VsdHMtbWVzc2FnZScgKTtcblxuXHRcdFx0aWYgKCBub1Jlc3VsdHNNZXNzYWdlICkge1xuXHRcdFx0XHRvcHRpb25zWyAnbm9fcmVzdWx0c190ZXh0JyBdID0gbm9SZXN1bHRzTWVzc2FnZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc2VhcmNoVGhyZXNob2xkID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5jaG9zZW5fbGliX3NlYXJjaF90aHJlc2hvbGQgKTtcblxuXHRcdFx0aWYgKCBzZWFyY2hUaHJlc2hvbGQgKSB7XG5cdFx0XHRcdG9wdGlvbnNbICdkaXNhYmxlX3NlYXJjaF90aHJlc2hvbGQnIF0gPSBzZWFyY2hUaHJlc2hvbGQ7XG5cdFx0XHR9XG5cblx0XHRcdCR0aGlzLmNob3Nlbiggb3B0aW9ucyApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGluaXRDaG9zZW4oKTtcblxuXHQvLyBJbml0aWFsaXplIGhpZXJhcmNoeSBhY2NvcmRpb24uXG5cdGZ1bmN0aW9uIGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKSB7XG5cdFx0JHdjYXBmTmF2RmlsdGVycy5maW5kKCAnLmhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJyApLm9uKCAnY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzICA9ICQoIHRoaXMgKTtcblx0XHRcdGNvbnN0ICRjaGlsZCA9ICR0aGlzLnBhcmVudCggJ2xpJyApLmNoaWxkcmVuKCAndWwnICk7XG5cblx0XHRcdCR0aGlzLnRvZ2dsZUNsYXNzKCAnYWN0aXZlJyApO1xuXG5cdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5lbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uICkge1xuXHRcdFx0XHQkY2hpbGQuc2xpZGVUb2dnbGUoXG5cdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkLFxuXHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5oaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmdcblx0XHRcdFx0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRjaGlsZC50b2dnbGUoKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRpbml0SGllcmFyY2h5QWNjb3JkaW9uKCk7XG5cblx0LyoqXG5cdCAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM0MTQxODEzXG5cdCAqXG5cdCAqIEBwYXJhbSBudW1iZXJcblx0ICogQHBhcmFtIGRlY2ltYWxzXG5cdCAqIEBwYXJhbSBkZWNfcG9pbnRcblx0ICogQHBhcmFtIHRob3VzYW5kc19zZXBcblx0ICpcblx0ICogQHJldHVybnMge3N0cmluZ31cblx0ICovXG5cdGZ1bmN0aW9uIG51bWJlcl9mb3JtYXQoIG51bWJlciwgZGVjaW1hbHMsIGRlY19wb2ludCwgdGhvdXNhbmRzX3NlcCApIHtcblx0XHQvLyBTdHJpcCBhbGwgY2hhcmFjdGVycyBidXQgbnVtZXJpY2FsIG9uZXMuXG5cdFx0bnVtYmVyID0gKCBudW1iZXIgKyAnJyApLnJlcGxhY2UoIC9bXlxcZCtcXC1FZS5dL2csICcnICk7XG5cblx0XHRjb25zdCBuICAgID0gISBpc0Zpbml0ZSggK251bWJlciApID8gMCA6ICtudW1iZXI7XG5cdFx0Y29uc3QgcHJlYyA9ICEgaXNGaW5pdGUoICtkZWNpbWFscyApID8gMCA6IE1hdGguYWJzKCBkZWNpbWFscyApO1xuXHRcdGNvbnN0IHNlcCAgPSAoIHR5cGVvZiB0aG91c2FuZHNfc2VwID09PSAndW5kZWZpbmVkJyApID8gJywnIDogdGhvdXNhbmRzX3NlcDtcblx0XHRjb25zdCBkZWMgID0gKCB0eXBlb2YgZGVjX3BvaW50ID09PSAndW5kZWZpbmVkJyApID8gJy4nIDogZGVjX3BvaW50O1xuXG5cdFx0bGV0IHM7XG5cblx0XHRjb25zdCB0b0ZpeGVkRml4ID0gZnVuY3Rpb24oIG4sIHByZWMgKSB7XG5cdFx0XHRjb25zdCBrID0gTWF0aC5wb3coIDEwLCBwcmVjICk7XG5cdFx0XHRyZXR1cm4gJycgKyBNYXRoLnJvdW5kKCBuICogayApIC8gaztcblx0XHR9O1xuXG5cdFx0Ly8gRml4IGZvciBJRSBwYXJzZUZsb2F0KDAuNTUpLnRvRml4ZWQoMCkgPSAwO1xuXHRcdHMgPSAoIHByZWMgPyB0b0ZpeGVkRml4KCBuLCBwcmVjICkgOiAnJyArIE1hdGgucm91bmQoIG4gKSApLnNwbGl0KCAnLicgKTtcblxuXHRcdGlmICggc1sgMCBdLmxlbmd0aCA+IDMgKSB7XG5cdFx0XHRzWyAwIF0gPSBzWyAwIF0ucmVwbGFjZSggL1xcQig/PSg/OlxcZHszfSkrKD8hXFxkKSkvZywgc2VwICk7XG5cdFx0fVxuXG5cdFx0aWYgKCAoIHNbIDEgXSB8fCAnJyApLmxlbmd0aCA8IHByZWMgKSB7XG5cdFx0XHRzWyAxIF0gPSBzWyAxIF0gfHwgJyc7XG5cdFx0XHRzWyAxIF0gKz0gbmV3IEFycmF5KCBwcmVjIC0gc1sgMSBdLmxlbmd0aCArIDEgKS5qb2luKCAnMCcgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcy5qb2luKCBkZWMgKTtcblx0fVxuXG5cdC8vIEluaXRpYWxpemUgbm9VSVNsaWRlci5cblx0ZnVuY3Rpb24gaW5pdE5vVUlTbGlkZXIoKSB7XG5cdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG5vVWlTbGlkZXIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzLmZpbmQoICcud2NhcGYtcmFuZ2Utc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdGNvbnN0IGZpbHRlcktleSA9ICRpdGVtLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0XHRjb25zdCAkc2xpZGVyICAgPSAkaXRlbS5maW5kKCAnLndjYXBmLW5vdWktc2xpZGVyJyApO1xuXG5cdFx0XHQvLyBJZiBzbGlkZXIgaXMgYWxyZWFkeSBpbml0aWFsaXplZCB0aGVuIGRvbid0IHJlaW5pdGlhbGl6ZSBhZ2Fpbi5cblx0XHRcdGlmICggJHNsaWRlci5oYXNDbGFzcyggJ3djYXBmLW5vdWktdGFyZ2V0JyApICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHNsaWRlcklkICAgICAgICAgID0gJHNsaWRlci5hdHRyKCAnaWQnICk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VmFsdWVzQXMgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRpc3BsYXktdmFsdWVzLWFzJyApO1xuXHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICkgKTtcblx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRjb25zdCBzdGVwICAgICAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXN0ZXAnICkgKTtcblx0XHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1wbGFjZXMnICk7XG5cdFx0XHRjb25zdCB0aG91c2FuZFNlcGFyYXRvciA9ICRpdGVtLmF0dHIoICdkYXRhLXRob3VzYW5kLXNlcGFyYXRvcicgKTtcblx0XHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1zZXBhcmF0b3InICk7XG5cdFx0XHRjb25zdCBtaW5WYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0Y29uc3QgbWF4VmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdGNvbnN0ICRtaW5WYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5taW4tdmFsdWUnICk7XG5cdFx0XHRjb25zdCAkbWF4VmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWF4LXZhbHVlJyApO1xuXG5cdFx0XHRjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggc2xpZGVySWQgKTtcblxuXHRcdFx0bm9VaVNsaWRlci5jcmVhdGUoIHNsaWRlciwge1xuXHRcdFx0XHRzdGFydDogWyBtaW5WYWx1ZSwgbWF4VmFsdWUgXSxcblx0XHRcdFx0c3RlcCxcblx0XHRcdFx0Y29ubmVjdDogdHJ1ZSxcblx0XHRcdFx0Y3NzUHJlZml4OiAnd2NhcGYtbm91aS0nLFxuXHRcdFx0XHRyYW5nZToge1xuXHRcdFx0XHRcdCdtaW4nOiByYW5nZU1pblZhbHVlLFxuXHRcdFx0XHRcdCdtYXgnOiByYW5nZU1heFZhbHVlLFxuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAndXBkYXRlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0Y29uc3QgbWluVmFsdWUgPSBudW1iZXJfZm9ybWF0KCB2YWx1ZXNbIDAgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSBudW1iZXJfZm9ybWF0KCB2YWx1ZXNbIDEgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblxuXHRcdFx0XHRpZiAoICdwbGFpbl90ZXh0JyA9PT0gZGlzcGxheVZhbHVlc0FzICkge1xuXHRcdFx0XHRcdCRtaW5WYWx1ZS5odG1sKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdCRtYXhWYWx1ZS5odG1sKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRtaW5WYWx1ZS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0JG1heFZhbHVlLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1ub3Vpc2xpZGVyLXVwZGF0ZScsIFsgJGl0ZW0sIHZhbHVlcyBdICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGZ1bmN0aW9uIGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApIHtcblx0XHRcdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmLW5vdWlzbGlkZXItYmVmb3JlLWZpbHRlci1wcm9kdWN0cycsIFsgJGl0ZW0sIHZhbHVlcyBdICk7XG5cblx0XHRcdFx0Y29uc3QgbWluVmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDAgXSApO1xuXHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMSBdICk7XG5cblx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRjb25zdCBxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IGZpbHRlclZhbFN0cmluZyA9IG1pblZhbHVlICsgcmFuZ2VWYWx1ZXNTZXBhcmF0b3IgKyBtYXhWYWx1ZTtcblx0XHRcdFx0XHR1cGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWxTdHJpbmcgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZpbHRlclByb2R1Y3RzKCk7XG5cblx0XHRcdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmLW5vdWlzbGlkZXItYWZ0ZXItZmlsdGVyLXByb2R1Y3RzJywgWyAkaXRlbSwgdmFsdWVzIF0gKTtcblx0XHRcdH1cblxuXHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICdjaGFuZ2UnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHQkaXRlbS5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKTtcblx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQkbWluVmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGlucHV0LmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdCRpbnB1dC5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0Y29uc3QgbWluVmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5zZXQoIFsgbWluVmFsdWUsIG51bGwgXSApO1xuXG5cdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQkbWF4VmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGlucHV0LmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdCRpbnB1dC5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5zZXQoIFsgbnVsbCwgbWF4VmFsdWUgXSApO1xuXG5cdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGluaXROb1VJU2xpZGVyKCk7XG5cblx0ZnVuY3Rpb24gZmlsdGVyQnlEYXRlKCAkaW5wdXQgKSB7XG5cdFx0Y29uc3QgJHdjYXBmRGF0ZUZpbHRlciA9ICRpbnB1dC5jbG9zZXN0KCAnLndjYXBmLWRhdGUtaW5wdXQnICk7XG5cdFx0Y29uc3QgZmlsdGVyS2V5ICAgICAgICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRjb25zdCBpc1JhbmdlICAgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1pcy1yYW5nZScgKTtcblxuXHRcdGxldCBmaWx0ZXJWYWx1ZSA9ICcnO1xuXHRcdGxldCBydW5GaWx0ZXIgICA9IGZhbHNlO1xuXG5cdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0Y2xlYXJUaW1lb3V0KCAkd2NhcGZEYXRlRmlsdGVyLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0aWYgKCBpc1JhbmdlICkge1xuXHRcdFx0Y29uc3QgZnJvbSA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICkudmFsKCk7XG5cdFx0XHRjb25zdCB0byAgID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtdG8taW5wdXQnICkudmFsKCk7XG5cblx0XHRcdGlmICggZnJvbSAmJiB0byApIHtcblx0XHRcdFx0ZmlsdGVyVmFsdWUgPSBmcm9tICsgcmFuZ2VWYWx1ZXNTZXBhcmF0b3IgKyB0bztcblx0XHRcdFx0cnVuRmlsdGVyICAgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGlmICggISBmcm9tICYmICEgdG8gKSB7XG5cdFx0XHRcdHJ1bkZpbHRlciA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoIGZyb20gKSB7XG5cdFx0XHRcdGZpbHRlclZhbHVlID0gZnJvbTtcblx0XHRcdFx0cnVuRmlsdGVyICAgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cnVuRmlsdGVyID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIHJ1bkZpbHRlciApIHtcblx0XHRcdCR3Y2FwZkRhdGVGaWx0ZXIuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCR3Y2FwZkRhdGVGaWx0ZXIucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdGlmICggZmlsdGVyVmFsdWUgKSB7XG5cdFx0XHRcdFx0dXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zdCBxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZmlsdGVyUHJvZHVjdHMoKTtcblx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBpbml0RGF0ZXBpY2tlcigpIHtcblx0XHRpZiAoICEgalF1ZXJ5KCkuZGF0ZXBpY2tlciApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCAkd2NhcGZEYXRlRmlsdGVyID0gJHdjYXBmRGF0ZUZpbHRlcnMuZmluZCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXG5cdFx0Y29uc3QgZm9ybWF0ICAgICAgICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1mb3JtYXQnICk7XG5cdFx0Y29uc3QgeWVhckRyb3Bkb3duICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1waWNrZXIteWVhci1kcm9wZG93bicgKTtcblx0XHRjb25zdCBtb250aERyb3Bkb3duID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLXBpY2tlci1tb250aC1kcm9wZG93bicgKTtcblxuXHRcdGNvbnN0ICRmcm9tID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKTtcblx0XHRjb25zdCAkdG8gICA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLXRvLWlucHV0JyApO1xuXG5cdFx0JGZyb20uZGF0ZXBpY2tlcigge1xuXHRcdFx0ZGF0ZUZvcm1hdDogZm9ybWF0LFxuXHRcdFx0Y2hhbmdlWWVhcjogeWVhckRyb3Bkb3duLFxuXHRcdFx0Y2hhbmdlTW9udGg6IG1vbnRoRHJvcGRvd24sXG5cdFx0fSApO1xuXG5cdFx0JHRvLmRhdGVwaWNrZXIoIHtcblx0XHRcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdGNoYW5nZU1vbnRoOiBtb250aERyb3Bkb3duLFxuXHRcdH0gKTtcblxuXHRcdCRmcm9tLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRmaWx0ZXJCeURhdGUoICRpbnB1dCApO1xuXHRcdH0gKTtcblxuXHRcdCR0by5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0ZmlsdGVyQnlEYXRlKCAkaW5wdXQgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRpbml0RGF0ZXBpY2tlcigpO1xuXG5cdGZ1bmN0aW9uIGluaXREZWZhdWx0T3JkZXJCeSgpIHtcblx0XHQvLyBBdHRhY2ggY2hvc2VuLlxuXHRcdGlmICggd2NhcGZfcGFyYW1zLmF0dGFjaF9jaG9zZW5fb25fc29ydGluZyApIHtcblx0XHRcdGlmICggalF1ZXJ5KCkuY2hvc2VuICkge1xuXHRcdFx0XHQkYm9keS5maW5kKCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nIHNlbGVjdC5vcmRlcmJ5JyApLmNob3Nlbigge1xuXHRcdFx0XHRcdCdkaXNhYmxlX3NlYXJjaF90aHJlc2hvbGQnOiAxNSxcblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICggISB3Y2FwZl9wYXJhbXMuc29ydGluZ19jb250cm9sICkge1xuXHRcdFx0JGJvZHkuZmluZCggJy53b29jb21tZXJjZS1vcmRlcmluZycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJG9yZGVyaW5nRm9ybSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHQkb3JkZXJpbmdGb3JtLm9uKCAnY2hhbmdlJywgJ3NlbGVjdC5vcmRlcmJ5JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JG9yZGVyaW5nRm9ybS5zdWJtaXQoKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JGJvZHkuZmluZCggJy53b29jb21tZXJjZS1vcmRlcmluZycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRvcmRlcmluZ0Zvcm0gPSAkKCB0aGlzICk7XG5cblx0XHRcdCRvcmRlcmluZ0Zvcm0ub24oICdzdWJtaXQnLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQkb3JkZXJpbmdGb3JtLm9uKCAnY2hhbmdlJywgJ3NlbGVjdC5vcmRlcmJ5JywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCBvcmRlciAgICAgID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJfa2V5ID0gJ29yZGVyYnknO1xuXG5cdFx0XHRcdHVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJfa2V5LCBvcmRlciApO1xuXHRcdFx0XHRmaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGluaXREZWZhdWx0T3JkZXJCeSgpO1xuXG5cdGZ1bmN0aW9uIHVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQoICRyZXN1bHRzICkge1xuXHRcdGNvbnN0IHNlbGVjdG9yID0gJy53b29jb21tZXJjZS1yZXN1bHQtY291bnQnO1xuXG5cdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmZpbmQoIHNlbGVjdG9yICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IG5ld1Byb2R1Y3RDb3VudCA9ICRyZXN1bHRzLmZpbmQoIHNlbGVjdG9yICkuaHRtbCgpO1xuXG5cdFx0JGJvZHkuZmluZCggc2VsZWN0b3IgKS5odG1sKCBuZXdQcm9kdWN0Q291bnQgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNob3dMb2FkaW5nQW5pbWF0aW9uKCkge1xuXHRcdGlmICggISB3Y2FwZl9wYXJhbXMubG9hZGluZ19hbmltYXRpb24gKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JC5Mb2FkaW5nT3ZlcmxheSggJ3Nob3cnLCB3Y2FwZl9wYXJhbXMubG9hZGluZ19vdmVybGF5X29wdGlvbnMgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGRpc2FibGVOb1VpU2xpZGVycygpIHtcblx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMuZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbiggZSwgZWxlbWVudCApIHtcblx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKCAnZGlzYWJsZWQnLCB0cnVlICk7XG5cdFx0fSApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzYWJsZUxhYmVscygpIHtcblx0XHRjb25zdCBzZWxlY3RvcnMgPSAnLndjYXBmLWxhYmVsZWQtbmF2IC5pdGVtLCAud2NhcGYtYWN0aXZlLWZpbHRlcnMgLml0ZW0nO1xuXG5cdFx0JHdjYXBmU2luZ2xlRmlsdGVycy5maW5kKCBzZWxlY3RvcnMgKS5hZGRDbGFzcyggJ2Rpc2FibGVkJyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzYWJsZUlucHV0cygpIHtcblx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLmRpc2FibGVfaW5wdXRzX3doaWxlX2ZldGNoaW5nX3Jlc3VsdHMgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgaW5wdXRzID0gJ2lucHV0LCBzZWxlY3QnO1xuXG5cdFx0JHdjYXBmU2luZ2xlRmlsdGVycy5maW5kKCBpbnB1dHMgKS5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0JHdjYXBmU2luZ2xlRmlsdGVycy5maW5kKCBpbnB1dHMgKS50cmlnZ2VyKCAnY2hvc2VuOnVwZGF0ZWQnICk7XG5cblx0XHRkaXNhYmxlTm9VaVNsaWRlcnMoKTtcblx0XHRkaXNhYmxlTGFiZWxzKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBlbmFibGVOb1VpU2xpZGVycygpIHtcblx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMuZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbiggZSwgZWxlbWVudCApIHtcblx0XHRcdGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCAnZGlzYWJsZWQnICk7XG5cdFx0fSApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZW5hYmxlSW5wdXRzKCkge1xuXHRcdGlmICggISB3Y2FwZl9wYXJhbXMuZGlzYWJsZV9pbnB1dHNfd2hpbGVfZmV0Y2hpbmdfcmVzdWx0cyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpbnB1dHMgPSAnaW5wdXQnO1xuXG5cdFx0JHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzLmZpbmQoIGlucHV0cyApLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHQkd2NhcGZEYXRlRmlsdGVycy5maW5kKCBpbnB1dHMgKS5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cblx0XHRlbmFibGVOb1VpU2xpZGVycygpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVzZXRMb2FkaW5nQW5pbWF0aW9uKCkge1xuXHRcdGlmICggISB3Y2FwZl9wYXJhbXMubG9hZGluZ19hbmltYXRpb24gKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JC5Mb2FkaW5nT3ZlcmxheSggJ2hpZGUnICk7XG5cdH1cblxuXHRmdW5jdGlvbiBzY3JvbGxUbygpIHtcblx0XHRpZiAoICdub25lJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3Qgc2Nyb2xsRm9yID0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfZm9yO1xuXHRcdGNvbnN0IGlzTW9iaWxlICA9IHdjYXBmX3BhcmFtcy5pc19tb2JpbGU7XG5cdFx0bGV0IHByb2NlZWQgICAgID0gZmFsc2U7XG5cblx0XHRpZiAoICdtb2JpbGUnID09PSBzY3JvbGxGb3IgJiYgaXNNb2JpbGUgKSB7XG5cdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKCAnZGVza3RvcCcgPT09IHNjcm9sbEZvciAmJiAhIGlzTW9iaWxlICkge1xuXHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0fSBlbHNlIGlmICggJ2JvdGgnID09PSBzY3JvbGxGb3IgKSB7XG5cdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAoICEgcHJvY2VlZCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgYWRqdXN0aW5nT2Zmc2V0LCBvZmZzZXQ7XG5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX29mZnNldCApIHtcblx0XHRcdGFkanVzdGluZ09mZnNldCA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKTtcblx0XHR9XG5cblx0XHRsZXQgY29udGFpbmVyO1xuXG5cdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdGNvbnRhaW5lciA9IHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyO1xuXHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXI7XG5cdFx0fVxuXG5cdFx0aWYgKCAnY3VzdG9tJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudDtcblx0XHR9XG5cblx0XHRjb25zdCAkY29udGFpbmVyID0gJCggY29udGFpbmVyICk7XG5cblx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0b2Zmc2V0ID0gJGNvbnRhaW5lci5vZmZzZXQoKS50b3AgLSBhZGp1c3RpbmdPZmZzZXQ7XG5cblx0XHRcdGlmICggb2Zmc2V0IDwgMCApIHtcblx0XHRcdFx0b2Zmc2V0ID0gMDtcblx0XHRcdH1cblxuXHRcdFx0JCggJ2h0bWwsIGJvZHknICkuc3RvcCgpLmFuaW1hdGUoXG5cdFx0XHRcdHsgc2Nyb2xsVG9wOiBvZmZzZXQgfSxcblx0XHRcdFx0d2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfc3BlZWQsXG5cdFx0XHRcdHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX2Vhc2luZ1xuXHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHQvLyBUaGluZ3MgYXJlIGRvbmUgYmVmb3JlIGZldGNoaW5nIHRoZSBwcm9kdWN0cyBsaWtlIHNob3dpbmcgYSBsb2FkaW5nIGluZGljYXRvci5cblx0ZnVuY3Rpb24gYmVmb3JlRmV0Y2hpbmdQcm9kdWN0cygpIHtcblx0XHRkaXNhYmxlSW5wdXRzKCk7XG5cdFx0c2hvd0xvYWRpbmdBbmltYXRpb24oKTtcblxuXHRcdGlmICggJ2ltbWVkaWF0ZWx5JyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfd2hlbiApIHtcblx0XHRcdHNjcm9sbFRvKCk7XG5cdFx0fVxuXG5cdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2JlZm9yZV9mZXRjaGluZ19wcm9kdWN0cycgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGJlZm9yZVVwZGF0aW5nUHJvZHVjdHMoICRyZXN1bHRzICkge1xuXHRcdHJlc2V0TG9hZGluZ0FuaW1hdGlvbigpO1xuXG5cdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2JlZm9yZV91cGRhdGluZ19wcm9kdWN0cycsIFsgJHJlc3VsdHMgXSApO1xuXHR9XG5cblx0Ly8gVGhpbmdzIGFyZSBkb25lIGFmdGVyIGFwcGx5aW5nIHRoZSBmaWx0ZXIgbGlrZSBzY3JvbGwgdG8gdG9wLlxuXHRmdW5jdGlvbiBhZnRlclVwZGF0aW5nUHJvZHVjdHMoICRyZXN1bHRzICkge1xuXHRcdGluaXRDaG9zZW4oKTtcblx0XHRpbml0SGllcmFyY2h5QWNjb3JkaW9uKCk7XG5cdFx0aW5pdE5vVUlTbGlkZXIoKTtcblx0XHRpbml0RGF0ZXBpY2tlcigpO1xuXHRcdGluaXREZWZhdWx0T3JkZXJCeSgpO1xuXHRcdHVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQoICRyZXN1bHRzICk7XG5cdFx0ZW5hYmxlSW5wdXRzKCk7XG5cblx0XHRpZiAoICdhZnRlcicgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X3doZW4gKSB7XG5cdFx0XHRzY3JvbGxUbygpO1xuXHRcdH1cblxuXHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9hZnRlcl91cGRhdGluZ19wcm9kdWN0cycsIFsgJHJlc3VsdHMgXSApO1xuXHR9XG5cblx0Ly8gVGhlIG1haW4gZmlsdGVyIGZ1bmN0aW9uLlxuXHRmdW5jdGlvbiBmaWx0ZXJQcm9kdWN0cyggZm9yY2VSZVJlbmRlciA9IGZhbHNlICkge1xuXHRcdGJlZm9yZUZldGNoaW5nUHJvZHVjdHMoKTtcblxuXHRcdCQuZ2V0KCB3aW5kb3cubG9jYXRpb24uaHJlZiwgZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRjb25zdCAkZGF0YSA9ICQoIGRhdGEgKTtcblxuXHRcdFx0Ly8gUmVwbGFjZSB0aGUgZmllbGRzJyBkYXRhIHdpdGggbmV3IGRhdGEuXG5cdFx0XHQkLmVhY2goIGZpZWxkcywgZnVuY3Rpb24oIGlkICkge1xuXHRcdFx0XHRjb25zdCBmaWVsZElEICAgID0gJ1tkYXRhLWlkPVwiJyArIGlkICsgJ1wiXSc7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkKCBmaWVsZElEICk7XG5cdFx0XHRcdGNvbnN0ICRpbm5lciAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1maWVsZC1pbm5lcicgKTtcblx0XHRcdFx0Y29uc3QgX2ZpZWxkICAgICA9ICRkYXRhLmZpbmQoIGZpZWxkSUQgKTtcblx0XHRcdFx0bGV0IGZpZWxkQ2xhc3NlcyA9ICQoIF9maWVsZCApLmF0dHIoICdjbGFzcycgKTtcblxuXHRcdFx0XHQvLyBQcmVzZXJ2ZSBoaWVyYXJjaHkgYWNjb3JkaW9uIHN0YXRlLlxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5wcmVzZXJ2ZV9oaWVyYXJjaHlfYWNjb3JkaW9uX3N0YXRlICkge1xuXHRcdFx0XHRcdGlmICggJGZpZWxkLmhhc0NsYXNzKCAnaGllcmFyY2h5LWFjY29yZGlvbicgKSApIHtcblx0XHRcdFx0XHRcdCRmaWVsZC5maW5kKCAnLmhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlLmFjdGl2ZScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgaXRlbVZhbHVlICAgICAgPSAkKCB0aGlzICkucGFyZW50KCkuY2hpbGRyZW4oICdpbnB1dCcgKS52YWwoKTtcblx0XHRcdFx0XHRcdFx0Y29uc3QgdG9nZ2xlU2VsZWN0b3IgPSAnaW5wdXRbdmFsdWU9XCInICsgaXRlbVZhbHVlICsgJ1wiXSB+IC5oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZSc7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHVsU2VsZWN0b3IgICAgID0gJ2lucHV0W3ZhbHVlPVwiJyArIGl0ZW1WYWx1ZSArICdcIl0gfiB1bCc7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IF9jbGFzc2VzICAgICAgID0gJ2hpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlIGFjdGl2ZSc7XG5cblx0XHRcdFx0XHRcdFx0X2ZpZWxkLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuYXR0ciggJ2NsYXNzJywgX2NsYXNzZXMgKTtcblx0XHRcdFx0XHRcdFx0X2ZpZWxkLmZpbmQoIHVsU2VsZWN0b3IgKS5zaG93KCk7XG5cdFx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgX2h0bWwgPSBfZmllbGQuZmluZCggJy53Y2FwZi1maWVsZC1pbm5lcicgKS5odG1sKCk7XG5cblx0XHRcdFx0Ly8gU2hvdyBzb2Z0IGxpbWl0IGl0ZW1zLlxuXHRcdFx0XHRjb25zdCBzb2Z0TGltaXRTZWxlY3RvciA9ICdzaG93LWhpZGRlbi1pdGVtcyc7XG5cblx0XHRcdFx0aWYgKCAkZmllbGQuaGFzQ2xhc3MoIHNvZnRMaW1pdFNlbGVjdG9yICkgKSB7XG5cdFx0XHRcdFx0aWYgKCAhIF9maWVsZC5oYXNDbGFzcyggc29mdExpbWl0U2VsZWN0b3IgKSApIHtcblx0XHRcdFx0XHRcdGZpZWxkQ2xhc3NlcyArPSAnICcgKyBzb2Z0TGltaXRTZWxlY3Rvcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZmllbGRDbGFzc2VzID0gZmllbGRDbGFzc2VzLnJlcGxhY2UoIHNvZnRMaW1pdFNlbGVjdG9yLCAnJyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBmaWVsZCdzIGNsYXNzLlxuXHRcdFx0XHQkZmllbGQuYXR0ciggJ2NsYXNzJywgZmllbGRDbGFzc2VzLnRyaW0oKSApO1xuXG5cdFx0XHRcdC8vIFdoZW4gY2FsbGVkIGZyb20gaGlzdG9yeSBiYWNrIG9yIGZvcndhcmQgcmVxdWVzdCB0aGVuIHJlcmVuZGVyIGFsbCBmaWVsZHMuXG5cdFx0XHRcdGlmICggZm9yY2VSZVJlbmRlciApIHtcblxuXHRcdFx0XHRcdC8vIHVwZGF0ZSBmaWVsZFxuXHRcdFx0XHRcdCRpbm5lci5odG1sKCBfaHRtbCApO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHQvLyBTZWxlY3RpdmVseSByZXJlbmRlciB0aGUgZmllbGRzLlxuXHRcdFx0XHRcdGlmICggJGZpZWxkLmhhc0NsYXNzKCAnd2NhcGYtbmF2LWZpbHRlcicgKSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gdXBkYXRlIGZpZWxkXG5cdFx0XHRcdFx0XHQkaW5uZXIuaHRtbCggX2h0bWwgKTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0JGZpZWxkLnRyaWdnZXIoICd3Y2FwZi1maWVsZC11cGRhdGVkJywgWyBfZmllbGQgXSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzKCAkZGF0YSApO1xuXG5cdFx0XHQvLyBSZXBsYWNlIG9sZCBzaG9wIGxvb3Agd2l0aCBuZXcgb25lLlxuXHRcdFx0Y29uc3QgJHNob3BMb29wQ29udGFpbmVyID0gJGRhdGEuZmluZCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdGNvbnN0ICRub3RGb3VuZENvbnRhaW5lciA9ICRkYXRhLmZpbmQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICk7XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgPT09IHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkge1xuXHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICggJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRhZnRlclVwZGF0aW5nUHJvZHVjdHMoICRkYXRhICk7XG5cdFx0fSApO1xuXHR9XG5cblx0Ly8gVVJMIFBhcnNlclxuXHRmdW5jdGlvbiBnZXRVcmxWYXJzKCB1cmwgKSB7XG5cdFx0bGV0IHZhcnMgPSB7fSwgaGFzaDtcblxuXHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHR1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHR9XG5cblx0XHR1cmwgPSB1cmwucmVwbGFjZUFsbCggJyUyQycsICcsJyApO1xuXG5cdFx0Y29uc3QgaGFzaGVzICA9IHVybC5zbGljZSggdXJsLmluZGV4T2YoICc/JyApICsgMSApLnNwbGl0KCAnJicgKTtcblx0XHRjb25zdCBoTGVuZ3RoID0gaGFzaGVzLmxlbmd0aDtcblxuXHRcdGZvciAoIGxldCBpID0gMDsgaSA8IGhMZW5ndGg7IGkrKyApIHtcblx0XHRcdGhhc2ggPSBoYXNoZXNbIGkgXS5zcGxpdCggJz0nICk7XG5cblx0XHRcdHZhcnNbIGhhc2hbIDAgXSBdID0gaGFzaFsgMSBdO1xuXHRcdH1cblxuXHRcdHJldHVybiB2YXJzO1xuXHR9XG5cblx0Ly8gZXZlcnl0aW1lIHdlIGFwcGx5IHRoZSBmaWx0ZXIgd2Ugc2V0IHRoZSBjdXJyZW50IHBhZ2UgdG8gMVxuXHRmdW5jdGlvbiBmaXhQYWdpbmF0aW9uKCkge1xuXHRcdGxldCB1cmwgICAgICAgICAgICAgICAgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRjb25zdCBwYXJhbXMgICAgICAgICAgID0gZ2V0VXJsVmFycyggdXJsICk7XG5cdFx0Y29uc3QgY3VycmVudFBhZ2VJblVybCA9IHBhcnNlSW50KCB1cmwucmVwbGFjZSggLy4rXFwvcGFnZVxcLyhcXGQrKSsvLCAnJDEnICkgKTtcblxuXHRcdGlmICggY3VycmVudFBhZ2VJblVybCApIHtcblx0XHRcdGlmICggY3VycmVudFBhZ2VJblVybCA+IDEgKSB7XG5cdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCAvcGFnZVxcLyhcXGQrKS8sICdwYWdlLzEnICk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICggdHlwZW9mIHBhcmFtc1sgJ3BhZ2VkJyBdICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdGNvbnN0IGN1cnJlbnRQYWdlSW5QYXJhbXMgPSBwYXJzZUludCggcGFyYW1zWyAncGFnZWQnIF0gKTtcblxuXHRcdFx0aWYgKCBjdXJyZW50UGFnZUluUGFyYW1zID4gMSApIHtcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoICdwYWdlZD0nICsgY3VycmVudFBhZ2VJblBhcmFtcywgJ3BhZ2VkPTEnICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHVybDtcblx0fVxuXG5cdC8vIHVwZGF0ZSBxdWVyeSBzdHJpbmcgZm9yIGNhdGVnb3JpZXMsIG1ldGEgZXRjLi5cblx0ZnVuY3Rpb24gdXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGtleSwgdmFsdWUsIHB1c2hIaXN0b3J5LCB1cmwgKSB7XG5cdFx0aWYgKCB0eXBlb2YgcHVzaEhpc3RvcnkgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0cHVzaEhpc3RvcnkgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHR1cmwgPSBmaXhQYWdpbmF0aW9uKCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmUgICAgICAgID0gbmV3IFJlZ0V4cCggJyhbPyZdKScgKyBrZXkgKyAnPS4qPygmfCQpJywgJ2knICk7XG5cdFx0Y29uc3Qgc2VwYXJhdG9yID0gdXJsLmluZGV4T2YoICc/JyApICE9PSAtMSA/ICcmJyA6ICc/Jztcblx0XHRsZXQgdXJsV2l0aFF1ZXJ5O1xuXG5cdFx0aWYgKCB1cmwubWF0Y2goIHJlICkgKSB7XG5cdFx0XHR1cmxXaXRoUXVlcnkgPSB1cmwucmVwbGFjZSggcmUsICckMScgKyBrZXkgKyAnPScgKyB2YWx1ZSArICckMicgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dXJsV2l0aFF1ZXJ5ID0gdXJsICsgc2VwYXJhdG9yICsga2V5ICsgJz0nICsgdmFsdWU7XG5cdFx0fVxuXG5cdFx0aWYgKCBwdXNoSGlzdG9yeSA9PT0gdHJ1ZSApIHtcblx0XHRcdHJldHVybiBoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCB1cmxXaXRoUXVlcnkgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHVybFdpdGhRdWVyeTtcblx0XHR9XG5cdH1cblxuXHQvLyByZW1vdmUgcGFyYW1ldGVyIGZyb20gdXJsXG5cdGZ1bmN0aW9uIHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIHVybCApIHtcblx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0dXJsID0gZml4UGFnaW5hdGlvbigpO1xuXHRcdH1cblxuXHRcdGNvbnN0IG9sZFBhcmFtcyAgICAgICAgID0gZ2V0VXJsVmFycyggdXJsICk7XG5cdFx0Y29uc3Qgb2xkUGFyYW1zTGVuZ3RoICAgPSBPYmplY3Qua2V5cyggb2xkUGFyYW1zICkubGVuZ3RoO1xuXHRcdGNvbnN0IHN0YXJ0UG9zaXRpb24gICAgID0gdXJsLmluZGV4T2YoICc/JyApO1xuXHRcdGNvbnN0IGZpbHRlcktleVBvc2l0aW9uID0gdXJsLmluZGV4T2YoIGZpbHRlcktleSApO1xuXHRcdGxldCBjbGVhblVybCwgY2xlYW5RdWVyeTtcblxuXHRcdGlmICggb2xkUGFyYW1zTGVuZ3RoID4gMSApIHtcblx0XHRcdGlmICggKCBmaWx0ZXJLZXlQb3NpdGlvbiAtIHN0YXJ0UG9zaXRpb24gKSA+IDEgKSB7XG5cdFx0XHRcdGNsZWFuVXJsID0gdXJsLnJlcGxhY2UoICcmJyArIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0sICcnICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjbGVhblVybCA9IHVybC5yZXBsYWNlKCBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdICsgJyYnLCAnJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBuZXdQYXJhbXMgPSBjbGVhblVybC5zcGxpdCggJz8nICk7XG5cdFx0XHRjbGVhblF1ZXJ5ICAgICAgPSAnPycgKyBuZXdQYXJhbXNbIDEgXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y2xlYW5RdWVyeSA9IHVybC5yZXBsYWNlKCAnPycgKyBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdLCAnJyApO1xuXHRcdH1cblxuXHRcdHJldHVybiBjbGVhblF1ZXJ5O1xuXHR9XG5cblx0Ly8gdGFrZSB0aGUga2V5IGFuZCB2YWx1ZSBhbmQgbWFrZSBxdWVyeVxuXHRmdW5jdGlvbiBtYWtlUGFyYW1ldGVycyggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSwgZm9yY2VSZXJlbmRlciA9IGZhbHNlLCB1cmwgKSB7XG5cdFx0Y29uc3QgdmFsdWVTZXBhcmF0b3IgPSAnLCc7XG5cblx0XHRsZXQgcGFyYW1zLCBuZXh0VmFsdWVzLCBlbXB0eVZhbHVlID0gZmFsc2U7XG5cblx0XHRpZiAoIHR5cGVvZiB1cmwgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0cGFyYW1zID0gZ2V0VXJsVmFycyggdXJsICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBhcmFtcyA9IGdldFVybFZhcnMoKTtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGVvZiBwYXJhbXNbIGZpbHRlcktleSBdICE9ICd1bmRlZmluZWQnICkge1xuXHRcdFx0Y29uc3QgcHJldlZhbHVlcyAgICAgID0gcGFyYW1zWyBmaWx0ZXJLZXkgXTtcblx0XHRcdGNvbnN0IHByZXZWYWx1ZXNBcnJheSA9IHByZXZWYWx1ZXMuc3BsaXQoIHZhbHVlU2VwYXJhdG9yICk7XG5cblx0XHRcdGlmICggcHJldlZhbHVlcy5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRjb25zdCBmb3VuZCA9ICQuaW5BcnJheSggZmlsdGVyVmFsdWUsIHByZXZWYWx1ZXNBcnJheSApO1xuXG5cdFx0XHRcdGlmICggZm91bmQgPj0gMCApIHtcblx0XHRcdFx0XHQvLyBFbGVtZW50IHdhcyBmb3VuZCwgcmVtb3ZlIGl0LlxuXHRcdFx0XHRcdHByZXZWYWx1ZXNBcnJheS5zcGxpY2UoIGZvdW5kLCAxICk7XG5cblx0XHRcdFx0XHRpZiAoIHByZXZWYWx1ZXNBcnJheS5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRcdFx0XHRlbXB0eVZhbHVlID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gRWxlbWVudCB3YXMgbm90IGZvdW5kLCBhZGQgaXQuXG5cdFx0XHRcdFx0cHJldlZhbHVlc0FycmF5LnB1c2goIGZpbHRlclZhbHVlICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHByZXZWYWx1ZXNBcnJheS5sZW5ndGggPiAxICkge1xuXHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBwcmV2VmFsdWVzQXJyYXkuam9pbiggdmFsdWVTZXBhcmF0b3IgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRuZXh0VmFsdWVzID0gcHJldlZhbHVlc0FycmF5O1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRuZXh0VmFsdWVzID0gZmlsdGVyVmFsdWU7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdG5leHRWYWx1ZXMgPSBmaWx0ZXJWYWx1ZTtcblx0XHR9XG5cblx0XHQvLyB1cGRhdGUgdXJsIGFuZCBxdWVyeSBzdHJpbmdcblx0XHRpZiAoICEgZW1wdHlWYWx1ZSApIHtcblx0XHRcdHVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIG5leHRWYWx1ZXMgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgcXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdH1cblxuXHRcdGZpbHRlclByb2R1Y3RzKCBmb3JjZVJlcmVuZGVyICk7XG5cdH1cblxuXHRmdW5jdGlvbiBzaW5nbGVGaWx0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKSB7XG5cdFx0Y29uc3QgcGFyYW1zID0gZ2V0VXJsVmFycygpO1xuXHRcdGxldCBxdWVyeTtcblxuXHRcdGlmICggdHlwZW9mIHBhcmFtc1sgZmlsdGVyS2V5IF0gIT09ICd1bmRlZmluZWQnICYmIHBhcmFtc1sgZmlsdGVyS2V5IF0gPT09IGZpbHRlclZhbHVlICkge1xuXHRcdFx0cXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHF1ZXJ5ID0gdXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIGZhbHNlICk7XG5cdFx0fVxuXG5cdFx0Ly8gdXBkYXRlIHVybFxuXHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRmaWx0ZXJQcm9kdWN0cygpO1xuXHR9XG5cblx0Ly8gSGFuZGxlIHRoZSBwYWdpbmF0aW9uIHJlcXVlc3QgdmlhIGFqYXguXG5cdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4ICYmIHdjYXBmX3BhcmFtcy5wYWdpbmF0aW9uX2NvbnRhaW5lciApIHtcblx0XHRjb25zdCAkY29udGFpbmVyID0gJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRjb25zdCBzZWxlY3RvciAgID0gd2NhcGZfcGFyYW1zLnBhZ2luYXRpb25fY29udGFpbmVyICsgJyBhJztcblxuXHRcdGlmICggJGNvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHQkY29udGFpbmVyLm9uKCAnY2xpY2snLCBzZWxlY3RvciwgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCBsb2NhdGlvbiA9ICQoIHRoaXMgKS5hdHRyKCAnaHJlZicgKTtcblxuXHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBsb2NhdGlvbiApO1xuXG5cdFx0XHRcdGZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSB0aGUgY29tbW9uIGZpbHRlciByZXF1ZXN0cy5cblx0ZnVuY3Rpb24gaGFuZGxlRmlsdGVyUmVxdWVzdCggJGl0ZW0sIGZpbHRlclZhbHVlICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1zaW5nbGUtZmlsdGVyJyApO1xuXHRcdGNvbnN0IGZpZWxkSUQgICAgICAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdGNvbnN0IGZpZWxkRGF0YSAgICAgID0gZmllbGRzWyBmaWVsZElEIF07XG5cdFx0Y29uc3QgZmlsdGVyS2V5ICAgICAgPSBmaWVsZERhdGEuZmlsdGVyS2V5O1xuXHRcdGNvbnN0IG11bHRpcGxlRmlsdGVyID0gZmllbGREYXRhLm11bHRpcGxlRmlsdGVyO1xuXG5cdFx0aWYgKCAhIGZpbHRlcktleSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoICEgZmlsdGVyVmFsdWUubGVuZ3RoICkge1xuXHRcdFx0Y29uc3QgcXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0XHRmaWx0ZXJQcm9kdWN0cygpO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCBtdWx0aXBsZUZpbHRlciApIHtcblx0XHRcdG1ha2VQYXJhbWV0ZXJzKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNpbmdsZUZpbHRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdH1cblx0fVxuXG5cdC8vIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGxpc3QgZmllbGQuXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oXG5cdFx0J2NoYW5nZScsXG5cdFx0Jy53Y2FwZi1sYXllcmVkLW5hdiBbdHlwZT1cImNoZWNrYm94XCJdLCAud2NhcGYtbGF5ZXJlZC1uYXYgW3R5cGU9XCJyYWRpb1wiXScsXG5cdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0Y29uc3QgJGl0ZW0gICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLnZhbCgpO1xuXG5cdFx0XHRoYW5kbGVGaWx0ZXJSZXF1ZXN0KCAkaXRlbSwgZmlsdGVyVmFsdWUgKTtcblx0XHR9XG5cdCk7XG5cblx0Ly8gSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgbGFiZWxlZCBpdGVtLlxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKCAnY2xpY2snLCAnLndjYXBmLWxhYmVsZWQtbmF2IC5pdGVtOm5vdCguZGlzYWJsZWQpJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLmF0dHIoICdkYXRhLXZhbHVlJyApO1xuXG5cdFx0aGFuZGxlRmlsdGVyUmVxdWVzdCggJGl0ZW0sIGZpbHRlclZhbHVlICk7XG5cdH0gKTtcblxuXHQvLyBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciBkaXNwbGF5IHR5cGUgc2VsZWN0IGZpZWxkcy5cblx0JHdjYXBmTmF2RmlsdGVycy5vbiggJ2NoYW5nZScsICdzZWxlY3QnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRpdGVtICAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGZpbHRlclZhbHVlID0gJGl0ZW0udmFsKCk7XG5cblx0XHRjb25zdCAkZmllbGQgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXNpbmdsZS1maWx0ZXInICk7XG5cdFx0Y29uc3QgZmllbGRJRCAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdGNvbnN0IGZpZWxkRGF0YSA9IGZpZWxkc1sgZmllbGRJRCBdO1xuXHRcdGNvbnN0IGZpbHRlcktleSA9IGZpZWxkRGF0YS5maWx0ZXJLZXk7XG5cblx0XHRpZiAoICEgZmlsdGVyVmFsdWUubGVuZ3RoICkge1xuXHRcdFx0Y29uc3QgcXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBmaWx0ZXJWYWxTdHJpbmcgPSBmaWx0ZXJWYWx1ZS50b1N0cmluZygpO1xuXHRcdFx0dXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsU3RyaW5nICk7XG5cdFx0fVxuXG5cdFx0ZmlsdGVyUHJvZHVjdHMoKTtcblx0fSApO1xuXG5cdC8qKlxuXHQgKiBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciByYW5nZSBudW1iZXIuXG5cdCAqL1xuXHRjb25zdCByYW5nZU51bWJlclNlbGVjdG9ycyA9ICcud2NhcGYtcmFuZ2UtbnVtYmVyIC5taW4tdmFsdWUsIC53Y2FwZi1yYW5nZS1udW1iZXIgLm1heC12YWx1ZSc7XG5cblx0JHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzLm9uKCAnaW5wdXQnLCByYW5nZU51bWJlclNlbGVjdG9ycywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdGNsZWFyVGltZW91dCggJGl0ZW0uZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHQkaXRlbS5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdCRpdGVtLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0Y29uc3QgJHJhbmdlTnVtYmVyICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtcmFuZ2UtbnVtYmVyJyApO1xuXHRcdFx0Y29uc3QgZmlsdGVyS2V5ICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICk7XG5cdFx0XHRjb25zdCByYW5nZU1heFZhbHVlID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKTtcblx0XHRcdGxldCBtaW5WYWx1ZSAgICAgICAgPSAkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCk7XG5cdFx0XHRsZXQgbWF4VmFsdWUgICAgICAgID0gJHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCgpO1xuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0aWYgKCAhIG1pblZhbHVlLmxlbmd0aCApIHtcblx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRpZiAoICEgbWF4VmFsdWUubGVuZ3RoICkge1xuXHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgcmFuZ2VNaW5WYWx1ZS5cblx0XHRcdGlmICggcGFyc2VGbG9hdCggbWluVmFsdWUgKSA8IHBhcnNlRmxvYXQoIHJhbmdlTWluVmFsdWUgKSApIHtcblx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG1pblZhbHVlICkgPiBwYXJzZUZsb2F0KCByYW5nZU1heFZhbHVlICkgKSB7XG5cdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBtaW5WYWx1ZSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIHVwIHRoZSByYW5nZU1heFZhbHVlLlxuXHRcdFx0aWYgKCBwYXJzZUZsb2F0KCBtYXhWYWx1ZSApID4gcGFyc2VGbG9hdCggcmFuZ2VNYXhWYWx1ZSApICkge1xuXHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgbWluVmFsdWUuXG5cdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG1pblZhbHVlICkgPiBwYXJzZUZsb2F0KCBtYXhWYWx1ZSApICkge1xuXHRcdFx0XHRtYXhWYWx1ZSA9IG1pblZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgZmlsdGVyVmFsU3RyaW5nID0gbWluVmFsdWUgKyByYW5nZVZhbHVlc1NlcGFyYXRvciArIG1heFZhbHVlO1xuXHRcdFx0XHR1cGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWxTdHJpbmcgKTtcblx0XHRcdH1cblxuXHRcdFx0ZmlsdGVyUHJvZHVjdHMoKTtcblx0XHR9LCBkZWxheSApICk7XG5cdH0gKTtcblxuXHQvLyBIYW5kbGUgcmVtb3ZpbmcgdGhlIGFjdGl2ZSBmaWx0ZXJzLlxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKCAnY2xpY2snLCAnLndjYXBmLWFjdGl2ZS1maWx0ZXJzIC5pdGVtOm5vdCguZGlzYWJsZWQpJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgICA9ICRpdGVtLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0Y29uc3QgZmlsdGVyVmFsdWUgPSAkaXRlbS5hdHRyKCAnZGF0YS12YWx1ZScgKTtcblxuXHRcdG1ha2VQYXJhbWV0ZXJzKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlLCB0cnVlICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiByZXNldEZpbHRlcnMoICRidXR0b24gKSB7XG5cdFx0Y29uc3QgX2ZpbHRlcktleXMgPSAkYnV0dG9uLmF0dHIoICdkYXRhLWtleXMnICk7XG5cblx0XHRpZiAoICEgX2ZpbHRlcktleXMgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZmlsdGVyS2V5cyA9IF9maWx0ZXJLZXlzLnNwbGl0KCAnLCcgKTtcblxuXHRcdGxldCBxdWVyeSA9ICcnO1xuXG5cdFx0JC5lYWNoKCBmaWx0ZXJLZXlzLCBmdW5jdGlvbiggaSwgZmlsdGVyS2V5ICkge1xuXHRcdFx0aWYgKCBxdWVyeSApIHtcblx0XHRcdFx0cXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBxdWVyeSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Ly8gRW1wdHkgcXVlcnkgY2F1c2VzIGlzc3VlKGRvZXNuJ3QgcmVtb3ZlIHRoZSBmaWx0ZXIga2V5cyBmcm9tIHRoZSB1cmwpLFxuXHRcdC8vIHRoaXMgaXMgd2h5IHdlIGFyZSBzZXR0aW5nIHRoZSBwYWdlIHVybCBhcyBxdWVyeS5cblx0XHRpZiAoICEgcXVlcnkgKSB7XG5cdFx0XHRjb25zdCBwcmV2VXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0XHRjb25zdCBuZXdVcmwgID0gcHJldlVybC5zcGxpdCggJz8nICk7XG5cblx0XHRcdHF1ZXJ5ID0gbmV3VXJsWyAwIF07XG5cdFx0fVxuXG5cdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdGZpbHRlclByb2R1Y3RzKCB0cnVlICk7XG5cdH1cblxuXHQvLyBDbGVhci9SZXNldCBhbGwgZmlsdGVycy5cblx0JGJvZHkub24oICd3Y2FwZi1yZXNldC1maWx0ZXJzJywgZnVuY3Rpb24oIGUsICRidXR0b24gKSB7XG5cdFx0cmVzZXRGaWx0ZXJzKCAkYnV0dG9uICk7XG5cdH0gKTtcblxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKCAnY2xpY2snLCAnLndjYXBmLXJlc2V0LWZpbHRlcnMtYnRuJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkYnV0dG9uID0gJCggdGhpcyApO1xuXG5cdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmLXJlc2V0LWZpbHRlcnMnLCBbICRidXR0b24gXSApO1xuXHR9ICk7XG5cblx0JHdjYXBmU2luZ2xlRmlsdGVycy5vbiggJ3djYXBmLWNsZWFyLWZpbHRlcicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBmaWVsZElEICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtaWQnICk7XG5cdFx0Y29uc3QgZmllbGREYXRhID0gZmllbGRzWyBmaWVsZElEIF07XG5cdFx0Y29uc3QgZmlsdGVyS2V5ID0gZmllbGREYXRhLmZpbHRlcktleTtcblxuXHRcdGNvbnN0IHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRmaWx0ZXJQcm9kdWN0cyggdHJ1ZSApO1xuXHR9ICk7XG5cblx0JGJvZHkub24oICd3Y2FwZi1ydW4tZmlsdGVyLXByb2R1Y3RzJywgZnVuY3Rpb24oIGUsIGZvcmNlUmVSZW5kZXIgKSB7XG5cdFx0ZmlsdGVyUHJvZHVjdHMoIGZvcmNlUmVSZW5kZXIgKTtcblx0fSApO1xuXG5cdGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5sZW5ndGggfHwgJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuYXBwbHlfZmlsdGVyc19vbl9icm93c2VyX2hpc3RvcnlfY2hhbmdlICkge1xuXHRcdFx0JCggd2luZG93ICkuYmluZCggJ3BvcHN0YXRlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGZpbHRlclByb2R1Y3RzKCB0cnVlICk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIE1ha2UgaXQgY29tcGF0aWJsZSB3aXRoIG90aGVyIHBsdWdpbnMuXG5cdCAqL1xuXHQkYm9keS5vbiggJ3djYXBmX2FmdGVyX3VwZGF0aW5nX3Byb2R1Y3RzJywgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gd29vLXZhcmlhdGlvbi1zd2F0Y2hlc1xuXHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggJ3dvb192YXJpYXRpb25fc3dhdGNoZXNfcHJvX2luaXQnICk7XG5cdH0gKTtcbn0gKTtcbiJdfQ==
