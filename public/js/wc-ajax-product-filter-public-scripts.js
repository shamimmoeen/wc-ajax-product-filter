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
  'scroll_to_top_offset': '',
  'for_preview': ''
};
jQuery(document).ready(function ($) {
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
    var $root;

    if (wcapf_params.for_preview) {
      $root = $(wcapfNavFilterSelector);
    } else {
      $root = $wcapfNavFilters;
    }

    $root.find('.hierarchy-accordion-toggle').on('click', function () {
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

    var $root;

    if (wcapf_params.for_preview) {
      $root = $(wcapfNumberRangeFilterSelector);
    } else {
      $root = $wcapfNumberRangeFilters;
    }

    $root.find('.wcapf-range-slider').each(function () {
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
        if (wcapf_params.for_preview) {
          return;
        }

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbHRlci1mb3JtLmpzIl0sIm5hbWVzIjpbIndjYXBmX3BhcmFtcyIsImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwiJGJvZHkiLCJyYW5nZVZhbHVlc1NlcGFyYXRvciIsIl9kZWxheSIsInBhcnNlSW50IiwiZmlsdGVyX2lucHV0X2RlbGF5IiwiZGVsYXkiLCJmaWVsZHMiLCJ3Y2FwZlNpbmdsZUZpbHRlclNlbGVjdG9yIiwid2NhcGZOYXZGaWx0ZXJTZWxlY3RvciIsIndjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJTZWxlY3RvciIsIndjYXBmRGF0ZUZpbHRlclNlbGVjdG9yIiwiJHdjYXBmU2luZ2xlRmlsdGVycyIsIiR3Y2FwZk5hdkZpbHRlcnMiLCIkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMiLCIkd2NhcGZEYXRlRmlsdGVycyIsImVhY2giLCIkZmllbGQiLCJpZCIsImF0dHIiLCIkd3JhcHBlciIsImZpbmQiLCJmaWx0ZXJLZXkiLCJtdWx0aXBsZUZpbHRlciIsImluaXRDaG9zZW4iLCJjaG9zZW4iLCIkcm9vdCIsImZvcl9wcmV2aWV3IiwiJHRoaXMiLCJvcHRpb25zIiwibm9SZXN1bHRzTWVzc2FnZSIsInNlYXJjaFRocmVzaG9sZCIsImNob3Nlbl9saWJfc2VhcmNoX3RocmVzaG9sZCIsImluaXRIaWVyYXJjaHlBY2NvcmRpb24iLCJvbiIsIiRjaGlsZCIsInBhcmVudCIsImNoaWxkcmVuIiwidG9nZ2xlQ2xhc3MiLCJlbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uIiwic2xpZGVUb2dnbGUiLCJoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsInRvZ2dsZSIsIm51bWJlcl9mb3JtYXQiLCJudW1iZXIiLCJkZWNpbWFscyIsImRlY19wb2ludCIsInRob3VzYW5kc19zZXAiLCJyZXBsYWNlIiwibiIsImlzRmluaXRlIiwicHJlYyIsIk1hdGgiLCJhYnMiLCJzZXAiLCJkZWMiLCJzIiwidG9GaXhlZEZpeCIsImsiLCJwb3ciLCJyb3VuZCIsInNwbGl0IiwibGVuZ3RoIiwiQXJyYXkiLCJqb2luIiwiaW5pdE5vVUlTbGlkZXIiLCJub1VpU2xpZGVyIiwiJGl0ZW0iLCIkc2xpZGVyIiwiaGFzQ2xhc3MiLCJzbGlkZXJJZCIsImRpc3BsYXlWYWx1ZXNBcyIsInJhbmdlTWluVmFsdWUiLCJwYXJzZUZsb2F0IiwicmFuZ2VNYXhWYWx1ZSIsInN0ZXAiLCJkZWNpbWFsUGxhY2VzIiwidGhvdXNhbmRTZXBhcmF0b3IiLCJkZWNpbWFsU2VwYXJhdG9yIiwibWluVmFsdWUiLCJtYXhWYWx1ZSIsIiRtaW5WYWx1ZSIsIiRtYXhWYWx1ZSIsInNsaWRlciIsImdldEVsZW1lbnRCeUlkIiwiY3JlYXRlIiwic3RhcnQiLCJjb25uZWN0IiwiY3NzUHJlZml4IiwicmFuZ2UiLCJ2YWx1ZXMiLCJodG1sIiwidmFsIiwidHJpZ2dlciIsImZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIiLCJxdWVyeSIsInJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsImZpbHRlclZhbFN0cmluZyIsInVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyIiwiZmlsdGVyUHJvZHVjdHMiLCJjbGVhclRpbWVvdXQiLCJkYXRhIiwic2V0VGltZW91dCIsInJlbW92ZURhdGEiLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwiJGlucHV0Iiwic2V0IiwiZ2V0IiwiZmlsdGVyQnlEYXRlIiwiJHdjYXBmRGF0ZUZpbHRlciIsImNsb3Nlc3QiLCJpc1JhbmdlIiwiZmlsdGVyVmFsdWUiLCJydW5GaWx0ZXIiLCJmcm9tIiwidG8iLCJpbml0RGF0ZXBpY2tlciIsImRhdGVwaWNrZXIiLCJmb3JtYXQiLCJ5ZWFyRHJvcGRvd24iLCJtb250aERyb3Bkb3duIiwiJGZyb20iLCIkdG8iLCJkYXRlRm9ybWF0IiwiY2hhbmdlWWVhciIsImNoYW5nZU1vbnRoIiwiaW5pdERlZmF1bHRPcmRlckJ5IiwiYXR0YWNoX2Nob3Nlbl9vbl9zb3J0aW5nIiwic29ydGluZ19jb250cm9sIiwiJG9yZGVyaW5nRm9ybSIsInN1Ym1pdCIsImUiLCJvcmRlciIsImZpbHRlcl9rZXkiLCJ1cGRhdGVQcm9kdWN0c0NvdW50UmVzdWx0IiwiJHJlc3VsdHMiLCJzZWxlY3RvciIsInNob3BfbG9vcF9jb250YWluZXIiLCJuZXdQcm9kdWN0Q291bnQiLCJzaG93TG9hZGluZ0FuaW1hdGlvbiIsImxvYWRpbmdfYW5pbWF0aW9uIiwiTG9hZGluZ092ZXJsYXkiLCJsb2FkaW5nX292ZXJsYXlfb3B0aW9ucyIsImRpc2FibGVOb1VpU2xpZGVycyIsImVsZW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJkaXNhYmxlTGFiZWxzIiwic2VsZWN0b3JzIiwiYWRkQ2xhc3MiLCJkaXNhYmxlSW5wdXRzIiwiZGlzYWJsZV9pbnB1dHNfd2hpbGVfZmV0Y2hpbmdfcmVzdWx0cyIsImlucHV0cyIsImVuYWJsZU5vVWlTbGlkZXJzIiwicmVtb3ZlQXR0cmlidXRlIiwiZW5hYmxlSW5wdXRzIiwicmVtb3ZlQXR0ciIsInJlc2V0TG9hZGluZ0FuaW1hdGlvbiIsInNjcm9sbFRvIiwic2Nyb2xsX3dpbmRvdyIsInNjcm9sbEZvciIsInNjcm9sbF93aW5kb3dfZm9yIiwiaXNNb2JpbGUiLCJpc19tb2JpbGUiLCJwcm9jZWVkIiwiYWRqdXN0aW5nT2Zmc2V0Iiwib2Zmc2V0Iiwic2Nyb2xsX3RvX3RvcF9vZmZzZXQiLCJjb250YWluZXIiLCJub3RfZm91bmRfY29udGFpbmVyIiwic2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudCIsIiRjb250YWluZXIiLCJ0b3AiLCJzdG9wIiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsInNjcm9sbF90b190b3Bfc3BlZWQiLCJzY3JvbGxfdG9fdG9wX2Vhc2luZyIsImJlZm9yZUZldGNoaW5nUHJvZHVjdHMiLCJzY3JvbGxfd2luZG93X3doZW4iLCJiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzIiwiYWZ0ZXJVcGRhdGluZ1Byb2R1Y3RzIiwiZm9yY2VSZVJlbmRlciIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsIiRkYXRhIiwiZmllbGRJRCIsIiRpbm5lciIsIl9maWVsZCIsImZpZWxkQ2xhc3NlcyIsInByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUiLCJpdGVtVmFsdWUiLCJ0b2dnbGVTZWxlY3RvciIsInVsU2VsZWN0b3IiLCJfY2xhc3NlcyIsInNob3ciLCJfaHRtbCIsInNvZnRMaW1pdFNlbGVjdG9yIiwidHJpbSIsIiRzaG9wTG9vcENvbnRhaW5lciIsIiRub3RGb3VuZENvbnRhaW5lciIsImdldFVybFZhcnMiLCJ1cmwiLCJ2YXJzIiwiaGFzaCIsInJlcGxhY2VBbGwiLCJoYXNoZXMiLCJzbGljZSIsImluZGV4T2YiLCJoTGVuZ3RoIiwiaSIsImZpeFBhZ2luYXRpb24iLCJwYXJhbXMiLCJjdXJyZW50UGFnZUluVXJsIiwiY3VycmVudFBhZ2VJblBhcmFtcyIsImtleSIsInZhbHVlIiwicHVzaEhpc3RvcnkiLCJyZSIsIlJlZ0V4cCIsInNlcGFyYXRvciIsInVybFdpdGhRdWVyeSIsIm1hdGNoIiwib2xkUGFyYW1zIiwib2xkUGFyYW1zTGVuZ3RoIiwiT2JqZWN0Iiwia2V5cyIsInN0YXJ0UG9zaXRpb24iLCJmaWx0ZXJLZXlQb3NpdGlvbiIsImNsZWFuVXJsIiwiY2xlYW5RdWVyeSIsIm5ld1BhcmFtcyIsIm1ha2VQYXJhbWV0ZXJzIiwiZm9yY2VSZXJlbmRlciIsInZhbHVlU2VwYXJhdG9yIiwibmV4dFZhbHVlcyIsImVtcHR5VmFsdWUiLCJwcmV2VmFsdWVzIiwicHJldlZhbHVlc0FycmF5IiwiZm91bmQiLCJpbkFycmF5Iiwic3BsaWNlIiwicHVzaCIsInNpbmdsZUZpbHRlciIsImVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4IiwicGFnaW5hdGlvbl9jb250YWluZXIiLCJoYW5kbGVGaWx0ZXJSZXF1ZXN0IiwiZmllbGREYXRhIiwidG9TdHJpbmciLCJyYW5nZU51bWJlclNlbGVjdG9ycyIsIiRyYW5nZU51bWJlciIsInJlc2V0RmlsdGVycyIsIiRidXR0b24iLCJfZmlsdGVyS2V5cyIsImZpbHRlcktleXMiLCJwcmV2VXJsIiwibmV3VXJsIiwiYXBwbHlfZmlsdGVyc19vbl9icm93c2VyX2hpc3RvcnlfY2hhbmdlIiwiYmluZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsWUFBWSxHQUFHQSxZQUFZLElBQUk7QUFDcEMsd0JBQXNCLEVBRGM7QUFFcEMsaUNBQStCLEVBRks7QUFHcEMsd0NBQXNDLEVBSEY7QUFJcEMsOENBQTRDLEVBSlI7QUFLcEMseUNBQXVDLEVBTEg7QUFNcEMsMENBQXdDLEVBTko7QUFPcEMsNkJBQTJCLEVBUFM7QUFRcEMseUJBQXVCLEVBUmE7QUFTcEMsMEJBQXdCLEVBVFk7QUFVcEMsZUFBYSxFQVZ1QjtBQVdwQywyQ0FBeUMsRUFYTDtBQVlwQyw2Q0FBMkMsRUFaUDtBQWFwQyx5QkFBdUIsRUFiYTtBQWNwQyx5QkFBdUIsRUFkYTtBQWVwQyxnQ0FBOEIsRUFmTTtBQWdCcEMsMEJBQXdCLEVBaEJZO0FBaUJwQyxxQkFBbUIsRUFqQmlCO0FBa0JwQyw4QkFBNEIsRUFsQlE7QUFtQnBDLHVCQUFxQixFQW5CZTtBQW9CcEMsbUJBQWlCLEVBcEJtQjtBQXFCcEMsdUJBQXFCLEVBckJlO0FBc0JwQyx3QkFBc0IsRUF0QmM7QUF1QnBDLGtDQUFnQyxFQXZCSTtBQXdCcEMsMEJBQXdCLEVBeEJZO0FBeUJwQyxpQkFBZTtBQXpCcUIsQ0FBckM7QUE0QkFDLE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixVQUFVQyxDQUFWLEVBQWM7QUFFdkMsTUFBTUMsS0FBSyxHQUFHRCxDQUFDLENBQUUsTUFBRixDQUFmO0FBRUEsTUFBTUUsb0JBQW9CLEdBQUcsR0FBN0I7O0FBRUEsTUFBTUMsTUFBTSxHQUFHQyxRQUFRLENBQUVSLFlBQVks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TixDQUFVLHFCQUFWLEVBQWlDLFlBQVc7QUFDM0NWLElBQUFBLFVBQVU7QUFDVlMsSUFBQUEsc0JBQXNCO0FBQ3RCaUMsSUFBQUEsY0FBYztBQUNkc0QsSUFBQUEsY0FBYztBQUNkLEdBTEQ7QUFPQTtBQUNEO0FBQ0E7O0FBQ0N2SCxFQUFBQSxLQUFLLENBQUNpQyxFQUFOLENBQVUsK0JBQVYsRUFBMkMsWUFBVztBQUNyRDtBQUNBbEMsSUFBQUEsQ0FBQyxDQUFFRixRQUFGLENBQUQsQ0FBY2dHLE9BQWQsQ0FBdUIsaUNBQXZCO0FBQ0EsR0FIRDtBQUlBLENBbG5DRCIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLXB1YmxpYy1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgZnJvbnRlbmQgZmlsdGVyIGZvcm0uXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvcHVibGljL3NyYy9qc1xuICogQGF1dGhvciAgICAgd3B0b29scy5pb1xuICovXG5cbmNvbnN0IHdjYXBmX3BhcmFtcyA9IHdjYXBmX3BhcmFtcyB8fCB7XG5cdCdmaWx0ZXJfaW5wdXRfZGVsYXknOiAnJyxcblx0J2Nob3Nlbl9saWJfc2VhcmNoX3RocmVzaG9sZCc6ICcnLFxuXHQncHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSc6ICcnLFxuXHQnZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbic6ICcnLFxuXHQnaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQnOiAnJyxcblx0J2hpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyc6ICcnLFxuXHQnbG9hZGluZ19vdmVybGF5X29wdGlvbnMnOiAnJyxcblx0J3Njcm9sbF90b190b3Bfc3BlZWQnOiAnJyxcblx0J3Njcm9sbF90b190b3BfZWFzaW5nJzogJycsXG5cdCdpc19tb2JpbGUnOiAnJyxcblx0J2Rpc2FibGVfaW5wdXRzX3doaWxlX2ZldGNoaW5nX3Jlc3VsdHMnOiAnJyxcblx0J2FwcGx5X2ZpbHRlcnNfb25fYnJvd3Nlcl9oaXN0b3J5X2NoYW5nZSc6ICcnLFxuXHQnc2hvcF9sb29wX2NvbnRhaW5lcic6ICcnLFxuXHQnbm90X2ZvdW5kX2NvbnRhaW5lcic6ICcnLFxuXHQnZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXgnOiAnJyxcblx0J3BhZ2luYXRpb25fY29udGFpbmVyJzogJycsXG5cdCdzb3J0aW5nX2NvbnRyb2wnOiAnJyxcblx0J2F0dGFjaF9jaG9zZW5fb25fc29ydGluZyc6ICcnLFxuXHQnbG9hZGluZ19hbmltYXRpb24nOiAnJyxcblx0J3Njcm9sbF93aW5kb3cnOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfZm9yJzogJycsXG5cdCdzY3JvbGxfd2luZG93X3doZW4nOiAnJyxcblx0J3Njcm9sbF93aW5kb3dfY3VzdG9tX2VsZW1lbnQnOiAnJyxcblx0J3Njcm9sbF90b190b3Bfb2Zmc2V0JzogJycsXG5cdCdmb3JfcHJldmlldyc6ICcnLFxufTtcblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCAkYm9keSA9ICQoICdib2R5JyApO1xuXG5cdGNvbnN0IHJhbmdlVmFsdWVzU2VwYXJhdG9yID0gJ34nO1xuXG5cdGNvbnN0IF9kZWxheSA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuZmlsdGVyX2lucHV0X2RlbGF5ICk7XG5cdGNvbnN0IGRlbGF5ICA9IF9kZWxheSA+PSAwID8gX2RlbGF5IDogODAwO1xuXG5cdC8vIFN0b3JlIGZpZWxkcycgaWQgYW5kIGZpbHRlciBpbmZvcm1hdGlvbi5cblx0Y29uc3QgZmllbGRzID0ge307XG5cblx0Y29uc3Qgd2NhcGZTaW5nbGVGaWx0ZXJTZWxlY3RvciAgICAgID0gJy53Y2FwZi1zaW5nbGUtZmlsdGVyJztcblx0Y29uc3Qgd2NhcGZOYXZGaWx0ZXJTZWxlY3RvciAgICAgICAgID0gJy53Y2FwZi1uYXYtZmlsdGVyJztcblx0Y29uc3Qgd2NhcGZOdW1iZXJSYW5nZUZpbHRlclNlbGVjdG9yID0gJy53Y2FwZi1udW1iZXItcmFuZ2UtZmlsdGVyJztcblx0Y29uc3Qgd2NhcGZEYXRlRmlsdGVyU2VsZWN0b3IgICAgICAgID0gJy53Y2FwZi1kYXRlLXJhbmdlLWZpbHRlcic7XG5cblx0Y29uc3QgJHdjYXBmU2luZ2xlRmlsdGVycyAgICAgID0gJCggd2NhcGZTaW5nbGVGaWx0ZXJTZWxlY3RvciApO1xuXHRjb25zdCAkd2NhcGZOYXZGaWx0ZXJzICAgICAgICAgPSAkKCB3Y2FwZk5hdkZpbHRlclNlbGVjdG9yICk7XG5cdGNvbnN0ICR3Y2FwZk51bWJlclJhbmdlRmlsdGVycyA9ICQoIHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJTZWxlY3RvciApO1xuXHRjb25zdCAkd2NhcGZEYXRlRmlsdGVycyAgICAgICAgPSAkKCB3Y2FwZkRhdGVGaWx0ZXJTZWxlY3RvciApO1xuXG5cdCR3Y2FwZlNpbmdsZUZpbHRlcnMuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgaWQgICAgICAgICAgICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtaWQnICk7XG5cdFx0Y29uc3QgJHdyYXBwZXIgICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1maWVsZC1pbm5lciA+IGRpdicgKTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICA9ICR3cmFwcGVyLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0Y29uc3QgbXVsdGlwbGVGaWx0ZXIgPSBwYXJzZUludCggJHdyYXBwZXIuYXR0ciggJ2RhdGEtbXVsdGlwbGUtZmlsdGVyJyApICk7XG5cblx0XHRmaWVsZHNbIGlkIF0gPSB7XG5cdFx0XHRmaWx0ZXJLZXk6IGZpbHRlcktleSxcblx0XHRcdG11bHRpcGxlRmlsdGVyOiBtdWx0aXBsZUZpbHRlclxuXHRcdH07XG5cdH0gKTtcblxuXHQvLyBJbml0aWFsaXplIGpRdWVyeSBjaG9zZW4gbGlicmFyeS5cblx0ZnVuY3Rpb24gaW5pdENob3NlbigpIHtcblx0XHRpZiAoICEgalF1ZXJ5KCkuY2hvc2VuICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCAkcm9vdDtcblxuXHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0JHJvb3QgPSAkKCB3Y2FwZk5hdkZpbHRlclNlbGVjdG9yICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRyb290ID0gJHdjYXBmTmF2RmlsdGVycztcblx0XHR9XG5cblx0XHQkcm9vdC5maW5kKCAnLndjYXBmLWNob3Nlbi1zZWxlY3QnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyAgID0gJCggdGhpcyApO1xuXHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHt9O1xuXG5cdFx0XHRjb25zdCBub1Jlc3VsdHNNZXNzYWdlID0gJHRoaXMuYXR0ciggJ2RhdGEtbm8tcmVzdWx0cy1tZXNzYWdlJyApO1xuXG5cdFx0XHRpZiAoIG5vUmVzdWx0c01lc3NhZ2UgKSB7XG5cdFx0XHRcdG9wdGlvbnNbICdub19yZXN1bHRzX3RleHQnIF0gPSBub1Jlc3VsdHNNZXNzYWdlO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBzZWFyY2hUaHJlc2hvbGQgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLmNob3Nlbl9saWJfc2VhcmNoX3RocmVzaG9sZCApO1xuXG5cdFx0XHRpZiAoIHNlYXJjaFRocmVzaG9sZCApIHtcblx0XHRcdFx0b3B0aW9uc1sgJ2Rpc2FibGVfc2VhcmNoX3RocmVzaG9sZCcgXSA9IHNlYXJjaFRocmVzaG9sZDtcblx0XHRcdH1cblxuXHRcdFx0JHRoaXMuY2hvc2VuKCBvcHRpb25zICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdENob3NlbigpO1xuXG5cdC8vIEluaXRpYWxpemUgaGllcmFyY2h5IGFjY29yZGlvbi5cblx0ZnVuY3Rpb24gaW5pdEhpZXJhcmNoeUFjY29yZGlvbigpIHtcblx0XHRsZXQgJHJvb3Q7XG5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5mb3JfcHJldmlldyApIHtcblx0XHRcdCRyb290ID0gJCggd2NhcGZOYXZGaWx0ZXJTZWxlY3RvciApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkcm9vdCA9ICR3Y2FwZk5hdkZpbHRlcnM7XG5cdFx0fVxuXG5cdFx0JHJvb3QuZmluZCggJy5oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScgKS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCAkY2hpbGQgPSAkdGhpcy5wYXJlbnQoICdsaScgKS5jaGlsZHJlbiggJ3VsJyApO1xuXG5cdFx0XHQkdGhpcy50b2dnbGVDbGFzcyggJ2FjdGl2ZScgKTtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX2FuaW1hdGlvbl9mb3JfaGllcmFyY2h5X2FjY29yZGlvbiApIHtcblx0XHRcdFx0JGNoaWxkLnNsaWRlVG9nZ2xlKFxuXHRcdFx0XHRcdHdjYXBmX3BhcmFtcy5oaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCxcblx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fZWFzaW5nXG5cdFx0XHRcdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkY2hpbGQudG9nZ2xlKCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdEhpZXJhcmNoeUFjY29yZGlvbigpO1xuXG5cdC8qKlxuXHQgKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNDE0MTgxM1xuXHQgKlxuXHQgKiBAcGFyYW0gbnVtYmVyXG5cdCAqIEBwYXJhbSBkZWNpbWFsc1xuXHQgKiBAcGFyYW0gZGVjX3BvaW50XG5cdCAqIEBwYXJhbSB0aG91c2FuZHNfc2VwXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9XG5cdCAqL1xuXHRmdW5jdGlvbiBudW1iZXJfZm9ybWF0KCBudW1iZXIsIGRlY2ltYWxzLCBkZWNfcG9pbnQsIHRob3VzYW5kc19zZXAgKSB7XG5cdFx0Ly8gU3RyaXAgYWxsIGNoYXJhY3RlcnMgYnV0IG51bWVyaWNhbCBvbmVzLlxuXHRcdG51bWJlciA9ICggbnVtYmVyICsgJycgKS5yZXBsYWNlKCAvW15cXGQrXFwtRWUuXS9nLCAnJyApO1xuXG5cdFx0Y29uc3QgbiAgICA9ICEgaXNGaW5pdGUoICtudW1iZXIgKSA/IDAgOiArbnVtYmVyO1xuXHRcdGNvbnN0IHByZWMgPSAhIGlzRmluaXRlKCArZGVjaW1hbHMgKSA/IDAgOiBNYXRoLmFicyggZGVjaW1hbHMgKTtcblx0XHRjb25zdCBzZXAgID0gKCB0eXBlb2YgdGhvdXNhbmRzX3NlcCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcsJyA6IHRob3VzYW5kc19zZXA7XG5cdFx0Y29uc3QgZGVjICA9ICggdHlwZW9mIGRlY19wb2ludCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcuJyA6IGRlY19wb2ludDtcblxuXHRcdGxldCBzO1xuXG5cdFx0Y29uc3QgdG9GaXhlZEZpeCA9IGZ1bmN0aW9uKCBuLCBwcmVjICkge1xuXHRcdFx0Y29uc3QgayA9IE1hdGgucG93KCAxMCwgcHJlYyApO1xuXHRcdFx0cmV0dXJuICcnICsgTWF0aC5yb3VuZCggbiAqIGsgKSAvIGs7XG5cdFx0fTtcblxuXHRcdC8vIEZpeCBmb3IgSUUgcGFyc2VGbG9hdCgwLjU1KS50b0ZpeGVkKDApID0gMDtcblx0XHRzID0gKCBwcmVjID8gdG9GaXhlZEZpeCggbiwgcHJlYyApIDogJycgKyBNYXRoLnJvdW5kKCBuICkgKS5zcGxpdCggJy4nICk7XG5cblx0XHRpZiAoIHNbIDAgXS5sZW5ndGggPiAzICkge1xuXHRcdFx0c1sgMCBdID0gc1sgMCBdLnJlcGxhY2UoIC9cXEIoPz0oPzpcXGR7M30pKyg/IVxcZCkpL2csIHNlcCApO1xuXHRcdH1cblxuXHRcdGlmICggKCBzWyAxIF0gfHwgJycgKS5sZW5ndGggPCBwcmVjICkge1xuXHRcdFx0c1sgMSBdID0gc1sgMSBdIHx8ICcnO1xuXHRcdFx0c1sgMSBdICs9IG5ldyBBcnJheSggcHJlYyAtIHNbIDEgXS5sZW5ndGggKyAxICkuam9pbiggJzAnICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHMuam9pbiggZGVjICk7XG5cdH1cblxuXHQvLyBJbml0aWFsaXplIG5vVUlTbGlkZXIuXG5cdGZ1bmN0aW9uIGluaXROb1VJU2xpZGVyKCkge1xuXHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCAkcm9vdDtcblxuXHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0JHJvb3QgPSAkKCB3Y2FwZk51bWJlclJhbmdlRmlsdGVyU2VsZWN0b3IgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHJvb3QgPSAkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnM7XG5cdFx0fVxuXG5cdFx0JHJvb3QuZmluZCggJy53Y2FwZi1yYW5nZS1zbGlkZXInICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0Y29uc3QgZmlsdGVyS2V5ID0gJGl0ZW0uYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRcdGNvbnN0ICRzbGlkZXIgICA9ICRpdGVtLmZpbmQoICcud2NhcGYtbm91aS1zbGlkZXInICk7XG5cblx0XHRcdC8vIElmIHNsaWRlciBpcyBhbHJlYWR5IGluaXRpYWxpemVkIHRoZW4gZG9uJ3QgcmVpbml0aWFsaXplIGFnYWluLlxuXHRcdFx0aWYgKCAkc2xpZGVyLmhhc0NsYXNzKCAnd2NhcGYtbm91aS10YXJnZXQnICkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc2xpZGVySWQgICAgICAgICAgPSAkc2xpZGVyLmF0dHIoICdpZCcgKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlWYWx1ZXNBcyAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGlzcGxheS12YWx1ZXMtYXMnICk7XG5cdFx0XHRjb25zdCByYW5nZU1pblZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0Y29uc3QgcmFuZ2VNYXhWYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdGNvbnN0IHN0ZXAgICAgICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtc3RlcCcgKSApO1xuXHRcdFx0Y29uc3QgZGVjaW1hbFBsYWNlcyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRcdGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gJGl0ZW0uYXR0ciggJ2RhdGEtdGhvdXNhbmQtc2VwYXJhdG9yJyApO1xuXHRcdFx0Y29uc3QgZGVjaW1hbFNlcGFyYXRvciAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXNlcGFyYXRvcicgKTtcblx0XHRcdGNvbnN0IG1pblZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWluLXZhbHVlJyApICk7XG5cdFx0XHRjb25zdCBtYXhWYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1heC12YWx1ZScgKSApO1xuXHRcdFx0Y29uc3QgJG1pblZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1pbi12YWx1ZScgKTtcblx0XHRcdGNvbnN0ICRtYXhWYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5tYXgtdmFsdWUnICk7XG5cblx0XHRcdGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBzbGlkZXJJZCApO1xuXG5cdFx0XHRub1VpU2xpZGVyLmNyZWF0ZSggc2xpZGVyLCB7XG5cdFx0XHRcdHN0YXJ0OiBbIG1pblZhbHVlLCBtYXhWYWx1ZSBdLFxuXHRcdFx0XHRzdGVwLFxuXHRcdFx0XHRjb25uZWN0OiB0cnVlLFxuXHRcdFx0XHRjc3NQcmVmaXg6ICd3Y2FwZi1ub3VpLScsXG5cdFx0XHRcdHJhbmdlOiB7XG5cdFx0XHRcdFx0J21pbic6IHJhbmdlTWluVmFsdWUsXG5cdFx0XHRcdFx0J21heCc6IHJhbmdlTWF4VmFsdWUsXG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oICd1cGRhdGUnLCBmdW5jdGlvbiggdmFsdWVzICkge1xuXHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9IG51bWJlcl9mb3JtYXQoIHZhbHVlc1sgMCBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9IG51bWJlcl9mb3JtYXQoIHZhbHVlc1sgMSBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXG5cdFx0XHRcdGlmICggJ3BsYWluX3RleHQnID09PSBkaXNwbGF5VmFsdWVzQXMgKSB7XG5cdFx0XHRcdFx0JG1pblZhbHVlLmh0bWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0JG1heFZhbHVlLmh0bWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JG1pblZhbHVlLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHQkbWF4VmFsdWUudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmLW5vdWlzbGlkZXItdXBkYXRlJywgWyAkaXRlbSwgdmFsdWVzIF0gKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0ZnVuY3Rpb24gZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICkge1xuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5mb3JfcHJldmlldyApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGYtbm91aXNsaWRlci1iZWZvcmUtZmlsdGVyLXByb2R1Y3RzJywgWyAkaXRlbSwgdmFsdWVzIF0gKTtcblxuXHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAxIF0gKTtcblxuXHRcdFx0XHRpZiAoIG1pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIG1heFZhbHVlID09PSByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc3QgZmlsdGVyVmFsU3RyaW5nID0gbWluVmFsdWUgKyByYW5nZVZhbHVlc1NlcGFyYXRvciArIG1heFZhbHVlO1xuXHRcdFx0XHRcdHVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbFN0cmluZyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZmlsdGVyUHJvZHVjdHMoKTtcblxuXHRcdFx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGYtbm91aXNsaWRlci1hZnRlci1maWx0ZXItcHJvZHVjdHMnLCBbICRpdGVtLCB2YWx1ZXMgXSApO1xuXHRcdFx0fVxuXG5cdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpdGVtLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApO1xuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdCRtaW5WYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBtaW5WYWx1ZSwgbnVsbCBdICk7XG5cblx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdCRtYXhWYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0JGlucHV0LmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCggWyBudWxsLCBtYXhWYWx1ZSBdICk7XG5cblx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdE5vVUlTbGlkZXIoKTtcblxuXHRmdW5jdGlvbiBmaWx0ZXJCeURhdGUoICRpbnB1dCApIHtcblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5mb3JfcHJldmlldyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCAkd2NhcGZEYXRlRmlsdGVyID0gJGlucHV0LmNsb3Nlc3QoICcud2NhcGYtZGF0ZS1pbnB1dCcgKTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdGNvbnN0IGlzUmFuZ2UgICAgICAgICAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWlzLXJhbmdlJyApO1xuXG5cdFx0bGV0IGZpbHRlclZhbHVlID0gJyc7XG5cdFx0bGV0IHJ1bkZpbHRlciAgID0gZmFsc2U7XG5cblx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRjbGVhclRpbWVvdXQoICR3Y2FwZkRhdGVGaWx0ZXIuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRpZiAoIGlzUmFuZ2UgKSB7XG5cdFx0XHRjb25zdCBmcm9tID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKS52YWwoKTtcblx0XHRcdGNvbnN0IHRvICAgPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCBmcm9tICYmIHRvICkge1xuXHRcdFx0XHRmaWx0ZXJWYWx1ZSA9IGZyb20gKyByYW5nZVZhbHVlc1NlcGFyYXRvciArIHRvO1xuXHRcdFx0XHRydW5GaWx0ZXIgICA9IHRydWU7XG5cdFx0XHR9IGVsc2UgaWYgKCAhIGZyb20gJiYgISB0byApIHtcblx0XHRcdFx0cnVuRmlsdGVyID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgZnJvbSA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICkudmFsKCk7XG5cblx0XHRcdGlmICggZnJvbSApIHtcblx0XHRcdFx0ZmlsdGVyVmFsdWUgPSBmcm9tO1xuXHRcdFx0XHRydW5GaWx0ZXIgICA9IHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRydW5GaWx0ZXIgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICggcnVuRmlsdGVyICkge1xuXHRcdFx0JHdjYXBmRGF0ZUZpbHRlci5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JHdjYXBmRGF0ZUZpbHRlci5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0aWYgKCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRcdFx0XHR1cGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGluaXREYXRlcGlja2VyKCkge1xuXHRcdGlmICggISBqUXVlcnkoKS5kYXRlcGlja2VyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCAkcm9vdDtcblxuXHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0JHJvb3QgPSAkKCB3Y2FwZkRhdGVGaWx0ZXJTZWxlY3RvciApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkcm9vdCA9ICR3Y2FwZkRhdGVGaWx0ZXJzO1xuXHRcdH1cblxuXHRcdGNvbnN0ICR3Y2FwZkRhdGVGaWx0ZXIgPSAkcm9vdC5maW5kKCAnLndjYXBmLWRhdGUtaW5wdXQnICk7XG5cblx0XHRjb25zdCBmb3JtYXQgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLWZvcm1hdCcgKTtcblx0XHRjb25zdCB5ZWFyRHJvcGRvd24gID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLXBpY2tlci15ZWFyLWRyb3Bkb3duJyApO1xuXHRcdGNvbnN0IG1vbnRoRHJvcGRvd24gPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtcGlja2VyLW1vbnRoLWRyb3Bkb3duJyApO1xuXG5cdFx0Y29uc3QgJGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApO1xuXHRcdGNvbnN0ICR0byAgID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtdG8taW5wdXQnICk7XG5cblx0XHQkZnJvbS5kYXRlcGlja2VyKCB7XG5cdFx0XHRkYXRlRm9ybWF0OiBmb3JtYXQsXG5cdFx0XHRjaGFuZ2VZZWFyOiB5ZWFyRHJvcGRvd24sXG5cdFx0XHRjaGFuZ2VNb250aDogbW9udGhEcm9wZG93bixcblx0XHR9ICk7XG5cblx0XHQkdG8uZGF0ZXBpY2tlcigge1xuXHRcdFx0ZGF0ZUZvcm1hdDogZm9ybWF0LFxuXHRcdFx0Y2hhbmdlWWVhcjogeWVhckRyb3Bkb3duLFxuXHRcdFx0Y2hhbmdlTW9udGg6IG1vbnRoRHJvcGRvd24sXG5cdFx0fSApO1xuXG5cdFx0JGZyb20ub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblx0XHRcdGZpbHRlckJ5RGF0ZSggJGlucHV0ICk7XG5cdFx0fSApO1xuXG5cdFx0JHRvLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRmaWx0ZXJCeURhdGUoICRpbnB1dCApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGluaXREYXRlcGlja2VyKCk7XG5cblx0ZnVuY3Rpb24gaW5pdERlZmF1bHRPcmRlckJ5KCkge1xuXHRcdC8vIEF0dGFjaCBjaG9zZW4uXG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuYXR0YWNoX2Nob3Nlbl9vbl9zb3J0aW5nICkge1xuXHRcdFx0aWYgKCBqUXVlcnkoKS5jaG9zZW4gKSB7XG5cdFx0XHRcdCRib2R5LmZpbmQoICcud29vY29tbWVyY2Utb3JkZXJpbmcgc2VsZWN0Lm9yZGVyYnknICkuY2hvc2VuKCB7XG5cdFx0XHRcdFx0J2Rpc2FibGVfc2VhcmNoX3RocmVzaG9sZCc6IDE1LFxuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5zb3J0aW5nX2NvbnRyb2wgKSB7XG5cdFx0XHQkYm9keS5maW5kKCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkb3JkZXJpbmdGb3JtID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdCRvcmRlcmluZ0Zvcm0ub24oICdjaGFuZ2UnLCAnc2VsZWN0Lm9yZGVyYnknLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkb3JkZXJpbmdGb3JtLnN1Ym1pdCgpO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkYm9keS5maW5kKCAnLndvb2NvbW1lcmNlLW9yZGVyaW5nJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJG9yZGVyaW5nRm9ybSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0JG9yZGVyaW5nRm9ybS5vbiggJ3N1Ym1pdCcsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdCRvcmRlcmluZ0Zvcm0ub24oICdjaGFuZ2UnLCAnc2VsZWN0Lm9yZGVyYnknLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0IG9yZGVyICAgICAgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlcl9rZXkgPSAnb3JkZXJieSc7XG5cblx0XHRcdFx0dXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcl9rZXksIG9yZGVyICk7XG5cdFx0XHRcdGZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdERlZmF1bHRPcmRlckJ5KCk7XG5cblx0ZnVuY3Rpb24gdXBkYXRlUHJvZHVjdHNDb3VudFJlc3VsdCggJHJlc3VsdHMgKSB7XG5cdFx0Y29uc3Qgc2VsZWN0b3IgPSAnLndvb2NvbW1lcmNlLXJlc3VsdC1jb3VudCc7XG5cblx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuZmluZCggc2VsZWN0b3IgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgbmV3UHJvZHVjdENvdW50ID0gJHJlc3VsdHMuZmluZCggc2VsZWN0b3IgKS5odG1sKCk7XG5cblx0XHQkYm9keS5maW5kKCBzZWxlY3RvciApLmh0bWwoIG5ld1Byb2R1Y3RDb3VudCApO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2hvd0xvYWRpbmdBbmltYXRpb24oKSB7XG5cdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5sb2FkaW5nX2FuaW1hdGlvbiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkLkxvYWRpbmdPdmVybGF5KCAnc2hvdycsIHdjYXBmX3BhcmFtcy5sb2FkaW5nX292ZXJsYXlfb3B0aW9ucyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzYWJsZU5vVWlTbGlkZXJzKCkge1xuXHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCR3Y2FwZk51bWJlclJhbmdlRmlsdGVycy5maW5kKCAnLndjYXBmLW5vdWktc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCBlLCBlbGVtZW50ICkge1xuXHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoICdkaXNhYmxlZCcsIHRydWUgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNhYmxlTGFiZWxzKCkge1xuXHRcdGNvbnN0IHNlbGVjdG9ycyA9ICcud2NhcGYtbGFiZWxlZC1uYXYgLml0ZW0sIC53Y2FwZi1hY3RpdmUtZmlsdGVycyAuaXRlbSc7XG5cblx0XHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmZpbmQoIHNlbGVjdG9ycyApLmFkZENsYXNzKCAnZGlzYWJsZWQnICk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNhYmxlSW5wdXRzKCkge1xuXHRcdGlmICggISB3Y2FwZl9wYXJhbXMuZGlzYWJsZV9pbnB1dHNfd2hpbGVfZmV0Y2hpbmdfcmVzdWx0cyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpbnB1dHMgPSAnaW5wdXQsIHNlbGVjdCc7XG5cblx0XHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmZpbmQoIGlucHV0cyApLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmZpbmQoIGlucHV0cyApLnRyaWdnZXIoICdjaG9zZW46dXBkYXRlZCcgKTtcblxuXHRcdGRpc2FibGVOb1VpU2xpZGVycygpO1xuXHRcdGRpc2FibGVMYWJlbHMoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGVuYWJsZU5vVWlTbGlkZXJzKCkge1xuXHRcdGlmICggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBub1VpU2xpZGVyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCR3Y2FwZk51bWJlclJhbmdlRmlsdGVycy5maW5kKCAnLndjYXBmLW5vdWktc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCBlLCBlbGVtZW50ICkge1xuXHRcdFx0ZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoICdkaXNhYmxlZCcgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRmdW5jdGlvbiBlbmFibGVJbnB1dHMoKSB7XG5cdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5kaXNhYmxlX2lucHV0c193aGlsZV9mZXRjaGluZ19yZXN1bHRzICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGlucHV0cyA9ICdpbnB1dCc7XG5cblx0XHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMuZmluZCggaW5wdXRzICkucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdCR3Y2FwZkRhdGVGaWx0ZXJzLmZpbmQoIGlucHV0cyApLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblxuXHRcdGVuYWJsZU5vVWlTbGlkZXJzKCk7XG5cdH1cblxuXHRmdW5jdGlvbiByZXNldExvYWRpbmdBbmltYXRpb24oKSB7XG5cdFx0aWYgKCAhIHdjYXBmX3BhcmFtcy5sb2FkaW5nX2FuaW1hdGlvbiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkLkxvYWRpbmdPdmVybGF5KCAnaGlkZScgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNjcm9sbFRvKCkge1xuXHRcdGlmICggJ25vbmUnID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvdyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBzY3JvbGxGb3IgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19mb3I7XG5cdFx0Y29uc3QgaXNNb2JpbGUgID0gd2NhcGZfcGFyYW1zLmlzX21vYmlsZTtcblx0XHRsZXQgcHJvY2VlZCAgICAgPSBmYWxzZTtcblxuXHRcdGlmICggJ21vYmlsZScgPT09IHNjcm9sbEZvciAmJiBpc01vYmlsZSApIHtcblx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdH0gZWxzZSBpZiAoICdkZXNrdG9wJyA9PT0gc2Nyb2xsRm9yICYmICEgaXNNb2JpbGUgKSB7XG5cdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKCAnYm90aCcgPT09IHNjcm9sbEZvciApIHtcblx0XHRcdHByb2NlZWQgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICggISBwcm9jZWVkICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCBhZGp1c3RpbmdPZmZzZXQsIG9mZnNldDtcblxuXHRcdGlmICggd2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfb2Zmc2V0ICkge1xuXHRcdFx0YWRqdXN0aW5nT2Zmc2V0ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX29mZnNldCApO1xuXHRcdH1cblxuXHRcdGxldCBjb250YWluZXI7XG5cblx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXI7XG5cdFx0fSBlbHNlIGlmICggJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lcjtcblx0XHR9XG5cblx0XHRpZiAoICdjdXN0b20nID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvdyApIHtcblx0XHRcdGNvbnRhaW5lciA9IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50O1xuXHRcdH1cblxuXHRcdGNvbnN0ICRjb250YWluZXIgPSAkKCBjb250YWluZXIgKTtcblxuXHRcdGlmICggJGNvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRvZmZzZXQgPSAkY29udGFpbmVyLm9mZnNldCgpLnRvcCAtIGFkanVzdGluZ09mZnNldDtcblxuXHRcdFx0aWYgKCBvZmZzZXQgPCAwICkge1xuXHRcdFx0XHRvZmZzZXQgPSAwO1xuXHRcdFx0fVxuXG5cdFx0XHQkKCAnaHRtbCwgYm9keScgKS5zdG9wKCkuYW5pbWF0ZShcblx0XHRcdFx0eyBzY3JvbGxUb3A6IG9mZnNldCB9LFxuXHRcdFx0XHR3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9zcGVlZCxcblx0XHRcdFx0d2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3BfZWFzaW5nXG5cdFx0XHQpO1xuXHRcdH1cblx0fVxuXG5cdC8vIFRoaW5ncyBhcmUgZG9uZSBiZWZvcmUgZmV0Y2hpbmcgdGhlIHByb2R1Y3RzIGxpa2Ugc2hvd2luZyBhIGxvYWRpbmcgaW5kaWNhdG9yLlxuXHRmdW5jdGlvbiBiZWZvcmVGZXRjaGluZ1Byb2R1Y3RzKCkge1xuXHRcdGRpc2FibGVJbnB1dHMoKTtcblx0XHRzaG93TG9hZGluZ0FuaW1hdGlvbigpO1xuXG5cdFx0aWYgKCAnaW1tZWRpYXRlbHknID09PSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd193aGVuICkge1xuXHRcdFx0c2Nyb2xsVG8oKTtcblx0XHR9XG5cblx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGZfYmVmb3JlX2ZldGNoaW5nX3Byb2R1Y3RzJyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gYmVmb3JlVXBkYXRpbmdQcm9kdWN0cyggJHJlc3VsdHMgKSB7XG5cdFx0cmVzZXRMb2FkaW5nQW5pbWF0aW9uKCk7XG5cblx0XHQkYm9keS50cmlnZ2VyKCAnd2NhcGZfYmVmb3JlX3VwZGF0aW5nX3Byb2R1Y3RzJywgWyAkcmVzdWx0cyBdICk7XG5cdH1cblxuXHQvLyBUaGluZ3MgYXJlIGRvbmUgYWZ0ZXIgYXBwbHlpbmcgdGhlIGZpbHRlciBsaWtlIHNjcm9sbCB0byB0b3AuXG5cdGZ1bmN0aW9uIGFmdGVyVXBkYXRpbmdQcm9kdWN0cyggJHJlc3VsdHMgKSB7XG5cdFx0aW5pdENob3NlbigpO1xuXHRcdGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKTtcblx0XHRpbml0Tm9VSVNsaWRlcigpO1xuXHRcdGluaXREYXRlcGlja2VyKCk7XG5cdFx0aW5pdERlZmF1bHRPcmRlckJ5KCk7XG5cdFx0dXBkYXRlUHJvZHVjdHNDb3VudFJlc3VsdCggJHJlc3VsdHMgKTtcblx0XHRlbmFibGVJbnB1dHMoKTtcblxuXHRcdGlmICggJ2FmdGVyJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfd2hlbiApIHtcblx0XHRcdHNjcm9sbFRvKCk7XG5cdFx0fVxuXG5cdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2FmdGVyX3VwZGF0aW5nX3Byb2R1Y3RzJywgWyAkcmVzdWx0cyBdICk7XG5cdH1cblxuXHQvLyBUaGUgbWFpbiBmaWx0ZXIgZnVuY3Rpb24uXG5cdGZ1bmN0aW9uIGZpbHRlclByb2R1Y3RzKCBmb3JjZVJlUmVuZGVyID0gZmFsc2UgKSB7XG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZm9yX3ByZXZpZXcgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0YmVmb3JlRmV0Y2hpbmdQcm9kdWN0cygpO1xuXG5cdFx0JC5nZXQoIHdpbmRvdy5sb2NhdGlvbi5ocmVmLCBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdGNvbnN0ICRkYXRhID0gJCggZGF0YSApO1xuXG5cdFx0XHQvLyBSZXBsYWNlIHRoZSBmaWVsZHMnIGRhdGEgd2l0aCBuZXcgZGF0YS5cblx0XHRcdCQuZWFjaCggZmllbGRzLCBmdW5jdGlvbiggaWQgKSB7XG5cdFx0XHRcdGNvbnN0IGZpZWxkSUQgICAgPSAnW2RhdGEtaWQ9XCInICsgaWQgKyAnXCJdJztcblx0XHRcdFx0Y29uc3QgJGZpZWxkICAgICA9ICQoIGZpZWxkSUQgKTtcblx0XHRcdFx0Y29uc3QgJGlubmVyICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZpZWxkLWlubmVyJyApO1xuXHRcdFx0XHRjb25zdCBfZmllbGQgICAgID0gJGRhdGEuZmluZCggZmllbGRJRCApO1xuXHRcdFx0XHRsZXQgZmllbGRDbGFzc2VzID0gJCggX2ZpZWxkICkuYXR0ciggJ2NsYXNzJyApO1xuXG5cdFx0XHRcdC8vIFByZXNlcnZlIGhpZXJhcmNoeSBhY2NvcmRpb24gc3RhdGUuXG5cdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUgKSB7XG5cdFx0XHRcdFx0aWYgKCAkZmllbGQuaGFzQ2xhc3MoICdoaWVyYXJjaHktYWNjb3JkaW9uJyApICkge1xuXHRcdFx0XHRcdFx0JGZpZWxkLmZpbmQoICcuaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUuYWN0aXZlJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBpdGVtVmFsdWUgICAgICA9ICQoIHRoaXMgKS5wYXJlbnQoKS5jaGlsZHJlbiggJ2lucHV0JyApLnZhbCgpO1xuXHRcdFx0XHRcdFx0XHRjb25zdCB0b2dnbGVTZWxlY3RvciA9ICdpbnB1dFt2YWx1ZT1cIicgKyBpdGVtVmFsdWUgKyAnXCJdIH4gLmhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlJztcblx0XHRcdFx0XHRcdFx0Y29uc3QgdWxTZWxlY3RvciAgICAgPSAnaW5wdXRbdmFsdWU9XCInICsgaXRlbVZhbHVlICsgJ1wiXSB+IHVsJztcblx0XHRcdFx0XHRcdFx0Y29uc3QgX2NsYXNzZXMgICAgICAgPSAnaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUgYWN0aXZlJztcblxuXHRcdFx0XHRcdFx0XHRfZmllbGQuZmluZCggdG9nZ2xlU2VsZWN0b3IgKS5hdHRyKCAnY2xhc3MnLCBfY2xhc3NlcyApO1xuXHRcdFx0XHRcdFx0XHRfZmllbGQuZmluZCggdWxTZWxlY3RvciApLnNob3coKTtcblx0XHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBfaHRtbCA9IF9maWVsZC5maW5kKCAnLndjYXBmLWZpZWxkLWlubmVyJyApLmh0bWwoKTtcblxuXHRcdFx0XHQvLyBTaG93IHNvZnQgbGltaXQgaXRlbXMuXG5cdFx0XHRcdGNvbnN0IHNvZnRMaW1pdFNlbGVjdG9yID0gJ3Nob3ctaGlkZGVuLWl0ZW1zJztcblxuXHRcdFx0XHRpZiAoICRmaWVsZC5oYXNDbGFzcyggc29mdExpbWl0U2VsZWN0b3IgKSApIHtcblx0XHRcdFx0XHRpZiAoICEgX2ZpZWxkLmhhc0NsYXNzKCBzb2Z0TGltaXRTZWxlY3RvciApICkge1xuXHRcdFx0XHRcdFx0ZmllbGRDbGFzc2VzICs9ICcgJyArIHNvZnRMaW1pdFNlbGVjdG9yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRmaWVsZENsYXNzZXMgPSBmaWVsZENsYXNzZXMucmVwbGFjZSggc29mdExpbWl0U2VsZWN0b3IsICcnICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBVcGRhdGUgdGhlIGZpZWxkJ3MgY2xhc3MuXG5cdFx0XHRcdCRmaWVsZC5hdHRyKCAnY2xhc3MnLCBmaWVsZENsYXNzZXMudHJpbSgpICk7XG5cblx0XHRcdFx0Ly8gV2hlbiBjYWxsZWQgZnJvbSBoaXN0b3J5IGJhY2sgb3IgZm9yd2FyZCByZXF1ZXN0IHRoZW4gcmVyZW5kZXIgYWxsIGZpZWxkcy5cblx0XHRcdFx0aWYgKCBmb3JjZVJlUmVuZGVyICkge1xuXG5cdFx0XHRcdFx0Ly8gdXBkYXRlIGZpZWxkXG5cdFx0XHRcdFx0JGlubmVyLmh0bWwoIF9odG1sICk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdC8vIFNlbGVjdGl2ZWx5IHJlcmVuZGVyIHRoZSBmaWVsZHMuXG5cdFx0XHRcdFx0aWYgKCAkZmllbGQuaGFzQ2xhc3MoICd3Y2FwZi1uYXYtZmlsdGVyJyApICkge1xuXG5cdFx0XHRcdFx0XHQvLyB1cGRhdGUgZmllbGRcblx0XHRcdFx0XHRcdCRpbm5lci5odG1sKCBfaHRtbCApO1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkZmllbGQudHJpZ2dlciggJ3djYXBmLWZpZWxkLXVwZGF0ZWQnLCBbIF9maWVsZCBdICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGJlZm9yZVVwZGF0aW5nUHJvZHVjdHMoICRkYXRhICk7XG5cblx0XHRcdC8vIFJlcGxhY2Ugb2xkIHNob3AgbG9vcCB3aXRoIG5ldyBvbmUuXG5cdFx0XHRjb25zdCAkc2hvcExvb3BDb250YWluZXIgPSAkZGF0YS5maW5kKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0Y29uc3QgJG5vdEZvdW5kQ29udGFpbmVyID0gJGRhdGEuZmluZCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKTtcblxuXHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciA9PT0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKSB7XG5cdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGFmdGVyVXBkYXRpbmdQcm9kdWN0cyggJGRhdGEgKTtcblx0XHR9ICk7XG5cdH1cblxuXHQvLyBVUkwgUGFyc2VyXG5cdGZ1bmN0aW9uIGdldFVybFZhcnMoIHVybCApIHtcblx0XHRsZXQgdmFycyA9IHt9LCBoYXNoO1xuXG5cdFx0aWYgKCB0eXBlb2YgdXJsID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdH1cblxuXHRcdHVybCA9IHVybC5yZXBsYWNlQWxsKCAnJTJDJywgJywnICk7XG5cblx0XHRjb25zdCBoYXNoZXMgID0gdXJsLnNsaWNlKCB1cmwuaW5kZXhPZiggJz8nICkgKyAxICkuc3BsaXQoICcmJyApO1xuXHRcdGNvbnN0IGhMZW5ndGggPSBoYXNoZXMubGVuZ3RoO1xuXG5cdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgaExlbmd0aDsgaSsrICkge1xuXHRcdFx0aGFzaCA9IGhhc2hlc1sgaSBdLnNwbGl0KCAnPScgKTtcblxuXHRcdFx0dmFyc1sgaGFzaFsgMCBdIF0gPSBoYXNoWyAxIF07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHZhcnM7XG5cdH1cblxuXHQvLyBldmVyeXRpbWUgd2UgYXBwbHkgdGhlIGZpbHRlciB3ZSBzZXQgdGhlIGN1cnJlbnQgcGFnZSB0byAxXG5cdGZ1bmN0aW9uIGZpeFBhZ2luYXRpb24oKSB7XG5cdFx0bGV0IHVybCAgICAgICAgICAgICAgICA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdGNvbnN0IHBhcmFtcyAgICAgICAgICAgPSBnZXRVcmxWYXJzKCB1cmwgKTtcblx0XHRjb25zdCBjdXJyZW50UGFnZUluVXJsID0gcGFyc2VJbnQoIHVybC5yZXBsYWNlKCAvLitcXC9wYWdlXFwvKFxcZCspKy8sICckMScgKSApO1xuXG5cdFx0aWYgKCBjdXJyZW50UGFnZUluVXJsICkge1xuXHRcdFx0aWYgKCBjdXJyZW50UGFnZUluVXJsID4gMSApIHtcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoIC9wYWdlXFwvKFxcZCspLywgJ3BhZ2UvMScgKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKCB0eXBlb2YgcGFyYW1zWyAncGFnZWQnIF0gIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0Y29uc3QgY3VycmVudFBhZ2VJblBhcmFtcyA9IHBhcnNlSW50KCBwYXJhbXNbICdwYWdlZCcgXSApO1xuXG5cdFx0XHRpZiAoIGN1cnJlbnRQYWdlSW5QYXJhbXMgPiAxICkge1xuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSggJ3BhZ2VkPScgKyBjdXJyZW50UGFnZUluUGFyYW1zLCAncGFnZWQ9MScgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdXJsO1xuXHR9XG5cblx0Ly8gdXBkYXRlIHF1ZXJ5IHN0cmluZyBmb3IgY2F0ZWdvcmllcywgbWV0YSBldGMuLlxuXHRmdW5jdGlvbiB1cGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlcigga2V5LCB2YWx1ZSwgcHVzaEhpc3RvcnksIHVybCApIHtcblx0XHRpZiAoIHR5cGVvZiBwdXNoSGlzdG9yeSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRwdXNoSGlzdG9yeSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKCB0eXBlb2YgdXJsID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHVybCA9IGZpeFBhZ2luYXRpb24oKTtcblx0XHR9XG5cblx0XHRjb25zdCByZSAgICAgICAgPSBuZXcgUmVnRXhwKCAnKFs/Jl0pJyArIGtleSArICc9Lio/KCZ8JCknLCAnaScgKTtcblx0XHRjb25zdCBzZXBhcmF0b3IgPSB1cmwuaW5kZXhPZiggJz8nICkgIT09IC0xID8gJyYnIDogJz8nO1xuXHRcdGxldCB1cmxXaXRoUXVlcnk7XG5cblx0XHRpZiAoIHVybC5tYXRjaCggcmUgKSApIHtcblx0XHRcdHVybFdpdGhRdWVyeSA9IHVybC5yZXBsYWNlKCByZSwgJyQxJyArIGtleSArICc9JyArIHZhbHVlICsgJyQyJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR1cmxXaXRoUXVlcnkgPSB1cmwgKyBzZXBhcmF0b3IgKyBrZXkgKyAnPScgKyB2YWx1ZTtcblx0XHR9XG5cblx0XHRpZiAoIHB1c2hIaXN0b3J5ID09PSB0cnVlICkge1xuXHRcdFx0cmV0dXJuIGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHVybFdpdGhRdWVyeSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdXJsV2l0aFF1ZXJ5O1xuXHRcdH1cblx0fVxuXG5cdC8vIHJlbW92ZSBwYXJhbWV0ZXIgZnJvbSB1cmxcblx0ZnVuY3Rpb24gcmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgdXJsICkge1xuXHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHR1cmwgPSBmaXhQYWdpbmF0aW9uKCk7XG5cdFx0fVxuXG5cdFx0Y29uc3Qgb2xkUGFyYW1zICAgICAgICAgPSBnZXRVcmxWYXJzKCB1cmwgKTtcblx0XHRjb25zdCBvbGRQYXJhbXNMZW5ndGggICA9IE9iamVjdC5rZXlzKCBvbGRQYXJhbXMgKS5sZW5ndGg7XG5cdFx0Y29uc3Qgc3RhcnRQb3NpdGlvbiAgICAgPSB1cmwuaW5kZXhPZiggJz8nICk7XG5cdFx0Y29uc3QgZmlsdGVyS2V5UG9zaXRpb24gPSB1cmwuaW5kZXhPZiggZmlsdGVyS2V5ICk7XG5cdFx0bGV0IGNsZWFuVXJsLCBjbGVhblF1ZXJ5O1xuXG5cdFx0aWYgKCBvbGRQYXJhbXNMZW5ndGggPiAxICkge1xuXHRcdFx0aWYgKCAoIGZpbHRlcktleVBvc2l0aW9uIC0gc3RhcnRQb3NpdGlvbiApID4gMSApIHtcblx0XHRcdFx0Y2xlYW5VcmwgPSB1cmwucmVwbGFjZSggJyYnICsgZmlsdGVyS2V5ICsgJz0nICsgb2xkUGFyYW1zWyBmaWx0ZXJLZXkgXSwgJycgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNsZWFuVXJsID0gdXJsLnJlcGxhY2UoIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0gKyAnJicsICcnICk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG5ld1BhcmFtcyA9IGNsZWFuVXJsLnNwbGl0KCAnPycgKTtcblx0XHRcdGNsZWFuUXVlcnkgICAgICA9ICc/JyArIG5ld1BhcmFtc1sgMSBdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjbGVhblF1ZXJ5ID0gdXJsLnJlcGxhY2UoICc/JyArIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0sICcnICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNsZWFuUXVlcnk7XG5cdH1cblxuXHQvLyB0YWtlIHRoZSBrZXkgYW5kIHZhbHVlIGFuZCBtYWtlIHF1ZXJ5XG5cdGZ1bmN0aW9uIG1ha2VQYXJhbWV0ZXJzKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlLCBmb3JjZVJlcmVuZGVyID0gZmFsc2UsIHVybCApIHtcblx0XHRjb25zdCB2YWx1ZVNlcGFyYXRvciA9ICcsJztcblxuXHRcdGxldCBwYXJhbXMsIG5leHRWYWx1ZXMsIGVtcHR5VmFsdWUgPSBmYWxzZTtcblxuXHRcdGlmICggdHlwZW9mIHVybCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRwYXJhbXMgPSBnZXRVcmxWYXJzKCB1cmwgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cGFyYW1zID0gZ2V0VXJsVmFycygpO1xuXHRcdH1cblxuXHRcdGlmICggdHlwZW9mIHBhcmFtc1sgZmlsdGVyS2V5IF0gIT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRjb25zdCBwcmV2VmFsdWVzICAgICAgPSBwYXJhbXNbIGZpbHRlcktleSBdO1xuXHRcdFx0Y29uc3QgcHJldlZhbHVlc0FycmF5ID0gcHJldlZhbHVlcy5zcGxpdCggdmFsdWVTZXBhcmF0b3IgKTtcblxuXHRcdFx0aWYgKCBwcmV2VmFsdWVzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdGNvbnN0IGZvdW5kID0gJC5pbkFycmF5KCBmaWx0ZXJWYWx1ZSwgcHJldlZhbHVlc0FycmF5ICk7XG5cblx0XHRcdFx0aWYgKCBmb3VuZCA+PSAwICkge1xuXHRcdFx0XHRcdC8vIEVsZW1lbnQgd2FzIGZvdW5kLCByZW1vdmUgaXQuXG5cdFx0XHRcdFx0cHJldlZhbHVlc0FycmF5LnNwbGljZSggZm91bmQsIDEgKTtcblxuXHRcdFx0XHRcdGlmICggcHJldlZhbHVlc0FycmF5Lmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdFx0XHRcdGVtcHR5VmFsdWUgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBFbGVtZW50IHdhcyBub3QgZm91bmQsIGFkZCBpdC5cblx0XHRcdFx0XHRwcmV2VmFsdWVzQXJyYXkucHVzaCggZmlsdGVyVmFsdWUgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggcHJldlZhbHVlc0FycmF5Lmxlbmd0aCA+IDEgKSB7XG5cdFx0XHRcdFx0bmV4dFZhbHVlcyA9IHByZXZWYWx1ZXNBcnJheS5qb2luKCB2YWx1ZVNlcGFyYXRvciApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBwcmV2VmFsdWVzQXJyYXk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5leHRWYWx1ZXMgPSBmaWx0ZXJWYWx1ZTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0bmV4dFZhbHVlcyA9IGZpbHRlclZhbHVlO1xuXHRcdH1cblxuXHRcdC8vIHVwZGF0ZSB1cmwgYW5kIHF1ZXJ5IHN0cmluZ1xuXHRcdGlmICggISBlbXB0eVZhbHVlICkge1xuXHRcdFx0dXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgbmV4dFZhbHVlcyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0fVxuXG5cdFx0ZmlsdGVyUHJvZHVjdHMoIGZvcmNlUmVyZW5kZXIgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNpbmdsZUZpbHRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRjb25zdCBwYXJhbXMgPSBnZXRVcmxWYXJzKCk7XG5cdFx0bGV0IHF1ZXJ5O1xuXG5cdFx0aWYgKCB0eXBlb2YgcGFyYW1zWyBmaWx0ZXJLZXkgXSAhPT0gJ3VuZGVmaW5lZCcgJiYgcGFyYW1zWyBmaWx0ZXJLZXkgXSA9PT0gZmlsdGVyVmFsdWUgKSB7XG5cdFx0XHRxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cXVlcnkgPSB1cGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSwgZmFsc2UgKTtcblx0XHR9XG5cblx0XHQvLyB1cGRhdGUgdXJsXG5cdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdGZpbHRlclByb2R1Y3RzKCk7XG5cdH1cblxuXHQvLyBIYW5kbGUgdGhlIHBhZ2luYXRpb24gcmVxdWVzdCB2aWEgYWpheC5cblx0aWYgKCB3Y2FwZl9wYXJhbXMuZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXggJiYgd2NhcGZfcGFyYW1zLnBhZ2luYXRpb25fY29udGFpbmVyICkge1xuXHRcdGNvbnN0ICRjb250YWluZXIgPSAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdGNvbnN0IHNlbGVjdG9yICAgPSB3Y2FwZl9wYXJhbXMucGFnaW5hdGlvbl9jb250YWluZXIgKyAnIGEnO1xuXG5cdFx0aWYgKCAkY29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdCRjb250YWluZXIub24oICdjbGljaycsIHNlbGVjdG9yLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0IGxvY2F0aW9uID0gJCggdGhpcyApLmF0dHIoICdocmVmJyApO1xuXG5cdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIGxvY2F0aW9uICk7XG5cblx0XHRcdFx0ZmlsdGVyUHJvZHVjdHMoKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cdH1cblxuXHQvLyBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIHRoZSBjb21tb24gZmlsdGVyIHJlcXVlc3RzLlxuXHRmdW5jdGlvbiBoYW5kbGVGaWx0ZXJSZXF1ZXN0KCAkaXRlbSwgZmlsdGVyVmFsdWUgKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXNpbmdsZS1maWx0ZXInICk7XG5cdFx0Y29uc3QgZmllbGRJRCAgICAgICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtaWQnICk7XG5cdFx0Y29uc3QgZmllbGREYXRhICAgICAgPSBmaWVsZHNbIGZpZWxkSUQgXTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICA9IGZpZWxkRGF0YS5maWx0ZXJLZXk7XG5cdFx0Y29uc3QgbXVsdGlwbGVGaWx0ZXIgPSBmaWVsZERhdGEubXVsdGlwbGVGaWx0ZXI7XG5cblx0XHRpZiAoICEgZmlsdGVyS2V5ICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICggISBmaWx0ZXJWYWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRjb25zdCBxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRcdGZpbHRlclByb2R1Y3RzKCk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIG11bHRpcGxlRmlsdGVyICkge1xuXHRcdFx0bWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2luZ2xlRmlsdGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgbGlzdCBmaWVsZC5cblx0JHdjYXBmTmF2RmlsdGVycy5vbihcblx0XHQnY2hhbmdlJyxcblx0XHQnLndjYXBmLWxheWVyZWQtbmF2IFt0eXBlPVwiY2hlY2tib3hcIl0sIC53Y2FwZi1sYXllcmVkLW5hdiBbdHlwZT1cInJhZGlvXCJdJyxcblx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdGNvbnN0IGZpbHRlclZhbHVlID0gJGl0ZW0udmFsKCk7XG5cblx0XHRcdGhhbmRsZUZpbHRlclJlcXVlc3QoICRpdGVtLCBmaWx0ZXJWYWx1ZSApO1xuXHRcdH1cblx0KTtcblxuXHQvLyBIYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciBsYWJlbGVkIGl0ZW0uXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oICdjbGljaycsICcud2NhcGYtbGFiZWxlZC1uYXYgLml0ZW06bm90KC5kaXNhYmxlZCknLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRpdGVtICAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGZpbHRlclZhbHVlID0gJGl0ZW0uYXR0ciggJ2RhdGEtdmFsdWUnICk7XG5cblx0XHRoYW5kbGVGaWx0ZXJSZXF1ZXN0KCAkaXRlbSwgZmlsdGVyVmFsdWUgKTtcblx0fSApO1xuXG5cdC8vIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGRpc3BsYXkgdHlwZSBzZWxlY3QgZmllbGRzLlxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKCAnY2hhbmdlJywgJ3NlbGVjdCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgJGl0ZW0gICAgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgZmlsdGVyVmFsdWUgPSAkaXRlbS52YWwoKTtcblxuXHRcdGNvbnN0ICRmaWVsZCAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtc2luZ2xlLWZpbHRlcicgKTtcblx0XHRjb25zdCBmaWVsZElEICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtaWQnICk7XG5cdFx0Y29uc3QgZmllbGREYXRhID0gZmllbGRzWyBmaWVsZElEIF07XG5cdFx0Y29uc3QgZmlsdGVyS2V5ID0gZmllbGREYXRhLmZpbHRlcktleTtcblxuXHRcdGlmICggISBmaWx0ZXJWYWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRjb25zdCBxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGZpbHRlclZhbFN0cmluZyA9IGZpbHRlclZhbHVlLnRvU3RyaW5nKCk7XG5cdFx0XHR1cGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWxTdHJpbmcgKTtcblx0XHR9XG5cblx0XHRmaWx0ZXJQcm9kdWN0cygpO1xuXHR9ICk7XG5cblx0LyoqXG5cdCAqIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIHJhbmdlIG51bWJlci5cblx0ICovXG5cdGNvbnN0IHJhbmdlTnVtYmVyU2VsZWN0b3JzID0gJy53Y2FwZi1yYW5nZS1udW1iZXIgLm1pbi12YWx1ZSwgLndjYXBmLXJhbmdlLW51bWJlciAubWF4LXZhbHVlJztcblxuXHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMub24oICdpbnB1dCcsIHJhbmdlTnVtYmVyU2VsZWN0b3JzLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRpdGVtID0gJCggdGhpcyApO1xuXG5cdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRjb25zdCAkcmFuZ2VOdW1iZXIgID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1yYW5nZS1udW1iZXInICk7XG5cdFx0XHRjb25zdCBmaWx0ZXJLZXkgICAgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0XHRjb25zdCByYW5nZU1pblZhbHVlID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKTtcblx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApO1xuXHRcdFx0bGV0IG1pblZhbHVlICAgICAgICA9ICRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoKTtcblx0XHRcdGxldCBtYXhWYWx1ZSAgICAgICAgPSAkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCk7XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRpZiAoICEgbWluVmFsdWUubGVuZ3RoICkge1xuXHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdGlmICggISBtYXhWYWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSByYW5nZU1pblZhbHVlLlxuXHRcdFx0aWYgKCBwYXJzZUZsb2F0KCBtaW5WYWx1ZSApIDwgcGFyc2VGbG9hdCggcmFuZ2VNaW5WYWx1ZSApICkge1xuXHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdGlmICggcGFyc2VGbG9hdCggbWluVmFsdWUgKSA+IHBhcnNlRmxvYXQoIHJhbmdlTWF4VmFsdWUgKSApIHtcblx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG1heFZhbHVlICkgPiBwYXJzZUZsb2F0KCByYW5nZU1heFZhbHVlICkgKSB7XG5cdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSBtaW5WYWx1ZS5cblx0XHRcdGlmICggcGFyc2VGbG9hdCggbWluVmFsdWUgKSA+IHBhcnNlRmxvYXQoIG1heFZhbHVlICkgKSB7XG5cdFx0XHRcdG1heFZhbHVlID0gbWluVmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0Y29uc3QgcXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJWYWxTdHJpbmcgPSBtaW5WYWx1ZSArIHJhbmdlVmFsdWVzU2VwYXJhdG9yICsgbWF4VmFsdWU7XG5cdFx0XHRcdHVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbFN0cmluZyApO1xuXHRcdFx0fVxuXG5cdFx0XHRmaWx0ZXJQcm9kdWN0cygpO1xuXHRcdH0sIGRlbGF5ICkgKTtcblx0fSApO1xuXG5cdC8vIEhhbmRsZSByZW1vdmluZyB0aGUgYWN0aXZlIGZpbHRlcnMuXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oICdjbGljaycsICcud2NhcGYtYWN0aXZlLWZpbHRlcnMgLml0ZW06bm90KC5kaXNhYmxlZCknLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRpdGVtICAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGZpbHRlcktleSAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLmF0dHIoICdkYXRhLXZhbHVlJyApO1xuXG5cdFx0bWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIHRydWUgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHJlc2V0RmlsdGVycyggJGJ1dHRvbiApIHtcblx0XHRjb25zdCBfZmlsdGVyS2V5cyA9ICRidXR0b24uYXR0ciggJ2RhdGEta2V5cycgKTtcblxuXHRcdGlmICggISBfZmlsdGVyS2V5cyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBmaWx0ZXJLZXlzID0gX2ZpbHRlcktleXMuc3BsaXQoICcsJyApO1xuXG5cdFx0bGV0IHF1ZXJ5ID0gJyc7XG5cblx0XHQkLmVhY2goIGZpbHRlcktleXMsIGZ1bmN0aW9uKCBpLCBmaWx0ZXJLZXkgKSB7XG5cdFx0XHRpZiAoIHF1ZXJ5ICkge1xuXHRcdFx0XHRxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIHF1ZXJ5ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHQvLyBFbXB0eSBxdWVyeSBjYXVzZXMgaXNzdWUoZG9lc24ndCByZW1vdmUgdGhlIGZpbHRlciBrZXlzIGZyb20gdGhlIHVybCksXG5cdFx0Ly8gdGhpcyBpcyB3aHkgd2UgYXJlIHNldHRpbmcgdGhlIHBhZ2UgdXJsIGFzIHF1ZXJ5LlxuXHRcdGlmICggISBxdWVyeSApIHtcblx0XHRcdGNvbnN0IHByZXZVcmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRcdGNvbnN0IG5ld1VybCAgPSBwcmV2VXJsLnNwbGl0KCAnPycgKTtcblxuXHRcdFx0cXVlcnkgPSBuZXdVcmxbIDAgXTtcblx0XHR9XG5cblx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0ZmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0fVxuXG5cdC8vIENsZWFyL1Jlc2V0IGFsbCBmaWx0ZXJzLlxuXHQkYm9keS5vbiggJ3djYXBmLXJlc2V0LWZpbHRlcnMnLCBmdW5jdGlvbiggZSwgJGJ1dHRvbiApIHtcblx0XHRyZXNldEZpbHRlcnMoICRidXR0b24gKTtcblx0fSApO1xuXG5cdCRib2R5Lm9uKCAnY2xpY2snLCAnLndjYXBmLXJlc2V0LWZpbHRlcnMtYnRuJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGJ1dHRvbiA9ICQoIHRoaXMgKTtcblxuXHRcdHJlc2V0RmlsdGVycyggJGJ1dHRvbiApO1xuXHR9ICk7XG5cblx0JHdjYXBmTmF2RmlsdGVycy5vbiggJ2NsaWNrJywgJy53Y2FwZi1yZXNldC1maWx0ZXJzLWJ0bicsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgJGJ1dHRvbiA9ICQoIHRoaXMgKTtcblxuXHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1yZXNldC1maWx0ZXJzJywgWyAkYnV0dG9uIF0gKTtcblx0fSApO1xuXG5cdCR3Y2FwZlNpbmdsZUZpbHRlcnMub24oICd3Y2FwZi1jbGVhci1maWx0ZXInLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgZmllbGRJRCAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdGNvbnN0IGZpZWxkRGF0YSA9IGZpZWxkc1sgZmllbGRJRCBdO1xuXHRcdGNvbnN0IGZpbHRlcktleSA9IGZpZWxkRGF0YS5maWx0ZXJLZXk7XG5cblx0XHRjb25zdCBxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0ZmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0fSApO1xuXG5cdC8vIFJ1biBhamF4IGZpbHRlciB3aGVuIGJyb3dzZXIgaGlzdG9yeSBjaGFuZ2VzICh1c2VyIGdvZXMgYmFjayBvciBmb3J3YXJkKS5cblx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCB8fCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5hcHBseV9maWx0ZXJzX29uX2Jyb3dzZXJfaGlzdG9yeV9jaGFuZ2UgKSB7XG5cdFx0XHQkKCB3aW5kb3cgKS5iaW5kKCAncG9wc3RhdGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cdH1cblxuXHQvLyBUaGUgaG9vayB0aGF0IG1hbnVhbGx5IHJ1biB0aGUgYWpheCBmaWx0ZXJzIChjYW4gYmUgdXNlZnVsIGZvciBvdGhlciBwbHVnaW5zKS5cblx0JGJvZHkub24oICd3Y2FwZi1ydW4tZmlsdGVyLXByb2R1Y3RzJywgZnVuY3Rpb24oIGUsIGZvcmNlUmVSZW5kZXIgKSB7XG5cdFx0ZmlsdGVyUHJvZHVjdHMoIGZvcmNlUmVSZW5kZXIgKTtcblx0fSApO1xuXG5cdC8vIFRoZSBob29rIHRoYXQgcmVpbml0aWFsaXplIHRoZSBmaWx0ZXIgd2lkZ2V0cyAodG8gc2hvdyB0aGUgcHJldmlldyBpbiB0aGUgYmFja2VuZCkuXG5cdCRib2R5Lm9uKCAnaW5pdF9maWx0ZXJfd2lkZ2V0cycsIGZ1bmN0aW9uKCkge1xuXHRcdGluaXRDaG9zZW4oKTtcblx0XHRpbml0SGllcmFyY2h5QWNjb3JkaW9uKCk7XG5cdFx0aW5pdE5vVUlTbGlkZXIoKTtcblx0XHRpbml0RGF0ZXBpY2tlcigpO1xuXHR9ICk7XG5cblx0LyoqXG5cdCAqIE1ha2UgaXQgY29tcGF0aWJsZSB3aXRoIG90aGVyIHBsdWdpbnMuXG5cdCAqL1xuXHQkYm9keS5vbiggJ3djYXBmX2FmdGVyX3VwZGF0aW5nX3Byb2R1Y3RzJywgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gd29vLXZhcmlhdGlvbi1zd2F0Y2hlc1xuXHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggJ3dvb192YXJpYXRpb25fc3dhdGNoZXNfcHJvX2luaXQnICk7XG5cdH0gKTtcbn0gKTtcbiJdfQ==
