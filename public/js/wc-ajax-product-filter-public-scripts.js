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

        var minValue = parseFloat(values[0]);
        var maxValue = parseFloat(values[1]);
        console.log('minValue', minValue, $item);
        console.log('maxValue', maxValue, $item);

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
    }

    window.location.href = url; // TODO: Filter the products conditionally.
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbHRlci1mb3JtLmpzIl0sIm5hbWVzIjpbIndjYXBmX3BhcmFtcyIsImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwiJGJvZHkiLCJyYW5nZVZhbHVlc1NlcGFyYXRvciIsIl9kZWxheSIsInBhcnNlSW50IiwiZmlsdGVyX2lucHV0X2RlbGF5IiwiZGVsYXkiLCJmaWVsZHMiLCJ3Y2FwZlNpbmdsZUZpbHRlclNlbGVjdG9yIiwid2NhcGZOYXZGaWx0ZXJTZWxlY3RvciIsIndjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJTZWxlY3RvciIsIndjYXBmRGF0ZUZpbHRlclNlbGVjdG9yIiwiJHdjYXBmU2luZ2xlRmlsdGVycyIsIiR3Y2FwZk5hdkZpbHRlcnMiLCIkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMiLCIkd2NhcGZEYXRlRmlsdGVycyIsImVhY2giLCIkZmllbGQiLCJpZCIsImF0dHIiLCIkd3JhcHBlciIsImZpbmQiLCJmaWx0ZXJLZXkiLCJtdWx0aXBsZUZpbHRlciIsImluaXRDaG9zZW4iLCJjaG9zZW4iLCIkcm9vdCIsImZvcl9wcmV2aWV3IiwiJHRoaXMiLCJvcHRpb25zIiwibm9SZXN1bHRzTWVzc2FnZSIsInNlYXJjaFRocmVzaG9sZCIsImNob3Nlbl9saWJfc2VhcmNoX3RocmVzaG9sZCIsImluaXRIaWVyYXJjaHlBY2NvcmRpb24iLCJvbiIsIiRjaGlsZCIsInBhcmVudCIsImNoaWxkcmVuIiwidG9nZ2xlQ2xhc3MiLCJlbmFibGVfYW5pbWF0aW9uX2Zvcl9oaWVyYXJjaHlfYWNjb3JkaW9uIiwic2xpZGVUb2dnbGUiLCJoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9zcGVlZCIsImhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZyIsInRvZ2dsZSIsIm51bWJlcl9mb3JtYXQiLCJudW1iZXIiLCJkZWNpbWFscyIsImRlY19wb2ludCIsInRob3VzYW5kc19zZXAiLCJyZXBsYWNlIiwibiIsImlzRmluaXRlIiwicHJlYyIsIk1hdGgiLCJhYnMiLCJzZXAiLCJkZWMiLCJzIiwidG9GaXhlZEZpeCIsImsiLCJwb3ciLCJyb3VuZCIsInNwbGl0IiwibGVuZ3RoIiwiQXJyYXkiLCJqb2luIiwiaW5pdE5vVUlTbGlkZXIiLCJub1VpU2xpZGVyIiwiJGl0ZW0iLCIkc2xpZGVyIiwiaGFzQ2xhc3MiLCJzbGlkZXJJZCIsImRpc3BsYXlWYWx1ZXNBcyIsInJhbmdlTWluVmFsdWUiLCJwYXJzZUZsb2F0IiwicmFuZ2VNYXhWYWx1ZSIsInN0ZXAiLCJkZWNpbWFsUGxhY2VzIiwidGhvdXNhbmRTZXBhcmF0b3IiLCJkZWNpbWFsU2VwYXJhdG9yIiwibWluVmFsdWUiLCJtYXhWYWx1ZSIsIiRtaW5WYWx1ZSIsIiRtYXhWYWx1ZSIsInNsaWRlciIsImdldEVsZW1lbnRCeUlkIiwiY3JlYXRlIiwic3RhcnQiLCJjb25uZWN0IiwiY3NzUHJlZml4IiwicmFuZ2UiLCJ2YWx1ZXMiLCJodG1sIiwidmFsIiwidHJpZ2dlciIsImZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIiLCJjb25zb2xlIiwibG9nIiwicmVxdWVzdEZpbHRlciIsImRhdGEiLCJ1cmwiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwicmVtb3ZlRGF0YSIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCIkaW5wdXQiLCJzZXQiLCJnZXQiLCJmaWx0ZXJCeURhdGUiLCIkd2NhcGZEYXRlRmlsdGVyIiwiY2xvc2VzdCIsImlzUmFuZ2UiLCJmaWx0ZXJWYWx1ZSIsInJ1bkZpbHRlciIsImZyb20iLCJ0byIsInVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyIiwicXVlcnkiLCJyZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJmaWx0ZXJQcm9kdWN0cyIsImluaXREYXRlcGlja2VyIiwiZGF0ZXBpY2tlciIsImZvcm1hdCIsInllYXJEcm9wZG93biIsIm1vbnRoRHJvcGRvd24iLCIkZnJvbSIsIiR0byIsImRhdGVGb3JtYXQiLCJjaGFuZ2VZZWFyIiwiY2hhbmdlTW9udGgiLCJpbml0RGVmYXVsdE9yZGVyQnkiLCJhdHRhY2hfY2hvc2VuX29uX3NvcnRpbmciLCJzb3J0aW5nX2NvbnRyb2wiLCIkb3JkZXJpbmdGb3JtIiwic3VibWl0IiwiZSIsIm9yZGVyIiwiZmlsdGVyX2tleSIsInVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQiLCIkcmVzdWx0cyIsInNlbGVjdG9yIiwic2hvcF9sb29wX2NvbnRhaW5lciIsIm5ld1Byb2R1Y3RDb3VudCIsInNob3dMb2FkaW5nQW5pbWF0aW9uIiwibG9hZGluZ19hbmltYXRpb24iLCJMb2FkaW5nT3ZlcmxheSIsImxvYWRpbmdfb3ZlcmxheV9vcHRpb25zIiwiZGlzYWJsZU5vVWlTbGlkZXJzIiwiZWxlbWVudCIsInNldEF0dHJpYnV0ZSIsImRpc2FibGVMYWJlbHMiLCJzZWxlY3RvcnMiLCJhZGRDbGFzcyIsImRpc2FibGVJbnB1dHMiLCJkaXNhYmxlX2lucHV0c193aGlsZV9mZXRjaGluZ19yZXN1bHRzIiwiaW5wdXRzIiwiZW5hYmxlTm9VaVNsaWRlcnMiLCJyZW1vdmVBdHRyaWJ1dGUiLCJlbmFibGVJbnB1dHMiLCJyZW1vdmVBdHRyIiwicmVzZXRMb2FkaW5nQW5pbWF0aW9uIiwic2Nyb2xsVG8iLCJzY3JvbGxfd2luZG93Iiwic2Nyb2xsRm9yIiwic2Nyb2xsX3dpbmRvd19mb3IiLCJpc01vYmlsZSIsImlzX21vYmlsZSIsInByb2NlZWQiLCJhZGp1c3RpbmdPZmZzZXQiLCJvZmZzZXQiLCJzY3JvbGxfdG9fdG9wX29mZnNldCIsImNvbnRhaW5lciIsIm5vdF9mb3VuZF9jb250YWluZXIiLCJzY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50IiwiJGNvbnRhaW5lciIsInRvcCIsInN0b3AiLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwic2Nyb2xsX3RvX3RvcF9zcGVlZCIsInNjcm9sbF90b190b3BfZWFzaW5nIiwiYmVmb3JlRmV0Y2hpbmdQcm9kdWN0cyIsInNjcm9sbF93aW5kb3dfd2hlbiIsImJlZm9yZVVwZGF0aW5nUHJvZHVjdHMiLCJhZnRlclVwZGF0aW5nUHJvZHVjdHMiLCJmb3JjZVJlUmVuZGVyIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiJGRhdGEiLCJmaWVsZElEIiwiJGlubmVyIiwiX2ZpZWxkIiwiZmllbGRDbGFzc2VzIiwicHJlc2VydmVfaGllcmFyY2h5X2FjY29yZGlvbl9zdGF0ZSIsIml0ZW1WYWx1ZSIsInRvZ2dsZVNlbGVjdG9yIiwidWxTZWxlY3RvciIsIl9jbGFzc2VzIiwic2hvdyIsIl9odG1sIiwic29mdExpbWl0U2VsZWN0b3IiLCJ0cmltIiwiJHNob3BMb29wQ29udGFpbmVyIiwiJG5vdEZvdW5kQ29udGFpbmVyIiwiZ2V0VXJsVmFycyIsInZhcnMiLCJoYXNoIiwicmVwbGFjZUFsbCIsImhhc2hlcyIsInNsaWNlIiwiaW5kZXhPZiIsImhMZW5ndGgiLCJpIiwiZml4UGFnaW5hdGlvbiIsInBhcmFtcyIsImN1cnJlbnRQYWdlSW5VcmwiLCJjdXJyZW50UGFnZUluUGFyYW1zIiwia2V5IiwidmFsdWUiLCJwdXNoSGlzdG9yeSIsInJlIiwiUmVnRXhwIiwic2VwYXJhdG9yIiwidXJsV2l0aFF1ZXJ5IiwibWF0Y2giLCJvbGRQYXJhbXMiLCJvbGRQYXJhbXNMZW5ndGgiLCJPYmplY3QiLCJrZXlzIiwic3RhcnRQb3NpdGlvbiIsImZpbHRlcktleVBvc2l0aW9uIiwiY2xlYW5VcmwiLCJjbGVhblF1ZXJ5IiwibmV3UGFyYW1zIiwibWFrZVBhcmFtZXRlcnMiLCJmb3JjZVJlcmVuZGVyIiwidmFsdWVTZXBhcmF0b3IiLCJuZXh0VmFsdWVzIiwiZW1wdHlWYWx1ZSIsInByZXZWYWx1ZXMiLCJwcmV2VmFsdWVzQXJyYXkiLCJmb3VuZCIsImluQXJyYXkiLCJzcGxpY2UiLCJwdXNoIiwic2luZ2xlRmlsdGVyIiwiZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXgiLCJwYWdpbmF0aW9uX2NvbnRhaW5lciIsImhhbmRsZUZpbHRlclJlcXVlc3QiLCJmaWVsZERhdGEiLCIkc2VsZWN0IiwiZmlsdGVyVVJMIiwiY2xlYXJGaWx0ZXJVUkwiLCJ0b1N0cmluZyIsInJhbmdlTnVtYmVyU2VsZWN0b3JzIiwiJHJhbmdlTnVtYmVyIiwiZmlsdGVyVmFsU3RyaW5nIiwicmVzZXRGaWx0ZXJzIiwiJGJ1dHRvbiIsIl9maWx0ZXJLZXlzIiwiZmlsdGVyS2V5cyIsInByZXZVcmwiLCJuZXdVcmwiLCJhcHBseV9maWx0ZXJzX29uX2Jyb3dzZXJfaGlzdG9yeV9jaGFuZ2UiLCJiaW5kIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSxZQUFZLEdBQUdBLFlBQVksSUFBSTtBQUNwQyx3QkFBc0IsRUFEYztBQUVwQyxpQ0FBK0IsRUFGSztBQUdwQyx3Q0FBc0MsRUFIRjtBQUlwQyw4Q0FBNEMsRUFKUjtBQUtwQyx5Q0FBdUMsRUFMSDtBQU1wQywwQ0FBd0MsRUFOSjtBQU9wQyw2QkFBMkIsRUFQUztBQVFwQyx5QkFBdUIsRUFSYTtBQVNwQywwQkFBd0IsRUFUWTtBQVVwQyxlQUFhLEVBVnVCO0FBV3BDLDJDQUF5QyxFQVhMO0FBWXBDLDZDQUEyQyxFQVpQO0FBYXBDLHlCQUF1QixFQWJhO0FBY3BDLHlCQUF1QixFQWRhO0FBZXBDLGdDQUE4QixFQWZNO0FBZ0JwQywwQkFBd0IsRUFoQlk7QUFpQnBDLHFCQUFtQixFQWpCaUI7QUFrQnBDLDhCQUE0QixFQWxCUTtBQW1CcEMsdUJBQXFCLEVBbkJlO0FBb0JwQyxtQkFBaUIsRUFwQm1CO0FBcUJwQyx1QkFBcUIsRUFyQmU7QUFzQnBDLHdCQUFzQixFQXRCYztBQXVCcEMsa0NBQWdDLEVBdkJJO0FBd0JwQywwQkFBd0IsRUF4Qlk7QUF5QnBDLGlCQUFlO0FBekJxQixDQUFyQztBQTRCQUMsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVDLENBQVYsRUFBYztBQUV2QyxNQUFNQyxLQUFLLEdBQUdELENBQUMsQ0FBRSxNQUFGLENBQWY7QUFFQSxNQUFNRSxvQkFBb0IsR0FBRyxHQUE3Qjs7QUFFQSxNQUFNQyxNQUFNLEdBQUdDLFFBQVEsQ0FBRVIsWUFBWSxDQUFDUyxrQkFBZixDQUF2Qjs7QUFDQSxNQUFNQyxLQUFLLEdBQUlILE1BQU0sSUFBSSxDQUFWLEdBQWNBLE1BQWQsR0FBdUIsR0FBdEMsQ0FQdUMsQ0FTdkM7O0FBQ0EsTUFBTUksTUFBTSxHQUFHLEVBQWY7QUFFQSxNQUFNQyx5QkFBeUIsR0FBUSxzQkFBdkM7QUFDQSxNQUFNQyxzQkFBc0IsR0FBVyxtQkFBdkM7QUFDQSxNQUFNQyw4QkFBOEIsR0FBRyw0QkFBdkM7QUFDQSxNQUFNQyx1QkFBdUIsR0FBVSwwQkFBdkM7QUFFQSxNQUFNQyxtQkFBbUIsR0FBUVosQ0FBQyxDQUFFUSx5QkFBRixDQUFsQztBQUNBLE1BQU1LLGdCQUFnQixHQUFXYixDQUFDLENBQUVTLHNCQUFGLENBQWxDO0FBQ0EsTUFBTUssd0JBQXdCLEdBQUdkLENBQUMsQ0FBRVUsOEJBQUYsQ0FBbEM7QUFDQSxNQUFNSyxpQkFBaUIsR0FBVWYsQ0FBQyxDQUFFVyx1QkFBRixDQUFsQztBQUVBQyxFQUFBQSxtQkFBbUIsQ0FBQ0ksSUFBcEIsQ0FBMEIsWUFBVztBQUNwQyxRQUFNQyxNQUFNLEdBQVdqQixDQUFDLENBQUUsSUFBRixDQUF4QjtBQUNBLFFBQU1rQixFQUFFLEdBQWVELE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLFNBQWIsQ0FBdkI7QUFDQSxRQUFNQyxRQUFRLEdBQVNILE1BQU0sQ0FBQ0ksSUFBUCxDQUFhLDBCQUFiLENBQXZCO0FBQ0EsUUFBTUMsU0FBUyxHQUFRRixRQUFRLENBQUNELElBQVQsQ0FBZSxpQkFBZixDQUF2QjtBQUNBLFFBQU1JLGNBQWMsR0FBR25CLFFBQVEsQ0FBRWdCLFFBQVEsQ0FBQ0QsSUFBVCxDQUFlLHNCQUFmLENBQUYsQ0FBL0I7QUFFQVosSUFBQUEsTUFBTSxDQUFFVyxFQUFGLENBQU4sR0FBZTtBQUNkSSxNQUFBQSxTQUFTLEVBQUVBLFNBREc7QUFFZEMsTUFBQUEsY0FBYyxFQUFFQTtBQUZGLEtBQWY7QUFJQSxHQVhELEVBdEJ1QyxDQW1DdkM7O0FBQ0EsV0FBU0MsVUFBVCxHQUFzQjtBQUNyQixRQUFLLENBQUUzQixNQUFNLEdBQUc0QixNQUFoQixFQUF5QjtBQUN4QjtBQUNBOztBQUVELFFBQUlDLEtBQUo7O0FBRUEsUUFBSzlCLFlBQVksQ0FBQytCLFdBQWxCLEVBQWdDO0FBQy9CRCxNQUFBQSxLQUFLLEdBQUcxQixDQUFDLENBQUVTLHNCQUFGLENBQVQ7QUFDQSxLQUZELE1BRU87QUFDTmlCLE1BQUFBLEtBQUssR0FBR2IsZ0JBQVI7QUFDQTs7QUFFRGEsSUFBQUEsS0FBSyxDQUFDTCxJQUFOLENBQVksc0JBQVosRUFBcUNMLElBQXJDLENBQTJDLFlBQVc7QUFDckQsVUFBTVksS0FBSyxHQUFLNUIsQ0FBQyxDQUFFLElBQUYsQ0FBakI7QUFDQSxVQUFNNkIsT0FBTyxHQUFHLEVBQWhCO0FBRUEsVUFBTUMsZ0JBQWdCLEdBQUdGLEtBQUssQ0FBQ1QsSUFBTixDQUFZLHlCQUFaLENBQXpCOztBQUVBLFVBQUtXLGdCQUFMLEVBQXdCO0FBQ3ZCRCxRQUFBQSxPQUFPLENBQUUsaUJBQUYsQ0FBUCxHQUErQkMsZ0JBQS9CO0FBQ0E7O0FBRUQsVUFBTUMsZUFBZSxHQUFHM0IsUUFBUSxDQUFFUixZQUFZLENBQUNvQywyQkFBZixDQUFoQzs7QUFFQSxVQUFLRCxlQUFMLEVBQXVCO0FBQ3RCRixRQUFBQSxPQUFPLENBQUUsMEJBQUYsQ0FBUCxHQUF3Q0UsZUFBeEM7QUFDQTs7QUFFREgsTUFBQUEsS0FBSyxDQUFDSCxNQUFOLENBQWNJLE9BQWQ7QUFDQSxLQWpCRDtBQWtCQTs7QUFFREwsRUFBQUEsVUFBVSxHQXJFNkIsQ0F1RXZDOztBQUNBLFdBQVNTLHNCQUFULEdBQWtDO0FBQ2pDLFFBQUlQLEtBQUo7O0FBRUEsUUFBSzlCLFlBQVksQ0FBQytCLFdBQWxCLEVBQWdDO0FBQy9CRCxNQUFBQSxLQUFLLEdBQUcxQixDQUFDLENBQUVTLHNCQUFGLENBQVQ7QUFDQSxLQUZELE1BRU87QUFDTmlCLE1BQUFBLEtBQUssR0FBR2IsZ0JBQVI7QUFDQTs7QUFFRGEsSUFBQUEsS0FBSyxDQUFDTCxJQUFOLENBQVksNkJBQVosRUFBNENhLEVBQTVDLENBQWdELE9BQWhELEVBQXlELFlBQVc7QUFDbkUsVUFBTU4sS0FBSyxHQUFJNUIsQ0FBQyxDQUFFLElBQUYsQ0FBaEI7QUFDQSxVQUFNbUMsTUFBTSxHQUFHUCxLQUFLLENBQUNRLE1BQU4sQ0FBYyxJQUFkLEVBQXFCQyxRQUFyQixDQUErQixJQUEvQixDQUFmO0FBRUFULE1BQUFBLEtBQUssQ0FBQ1UsV0FBTixDQUFtQixRQUFuQjs7QUFFQSxVQUFLMUMsWUFBWSxDQUFDMkMsd0NBQWxCLEVBQTZEO0FBQzVESixRQUFBQSxNQUFNLENBQUNLLFdBQVAsQ0FDQzVDLFlBQVksQ0FBQzZDLG1DQURkLEVBRUM3QyxZQUFZLENBQUM4QyxvQ0FGZDtBQUlBLE9BTEQsTUFLTztBQUNOUCxRQUFBQSxNQUFNLENBQUNRLE1BQVA7QUFDQTtBQUNELEtBZEQ7QUFlQTs7QUFFRFYsRUFBQUEsc0JBQXNCO0FBRXRCO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNDLFdBQVNXLGFBQVQsQ0FBd0JDLE1BQXhCLEVBQWdDQyxRQUFoQyxFQUEwQ0MsU0FBMUMsRUFBcURDLGFBQXJELEVBQXFFO0FBQ3BFO0FBQ0FILElBQUFBLE1BQU0sR0FBRyxDQUFFQSxNQUFNLEdBQUcsRUFBWCxFQUFnQkksT0FBaEIsQ0FBeUIsY0FBekIsRUFBeUMsRUFBekMsQ0FBVDtBQUVBLFFBQU1DLENBQUMsR0FBTSxDQUFFQyxRQUFRLENBQUUsQ0FBQ04sTUFBSCxDQUFWLEdBQXdCLENBQXhCLEdBQTRCLENBQUNBLE1BQTFDO0FBQ0EsUUFBTU8sSUFBSSxHQUFHLENBQUVELFFBQVEsQ0FBRSxDQUFDTCxRQUFILENBQVYsR0FBMEIsQ0FBMUIsR0FBOEJPLElBQUksQ0FBQ0MsR0FBTCxDQUFVUixRQUFWLENBQTNDO0FBQ0EsUUFBTVMsR0FBRyxHQUFNLE9BQU9QLGFBQVAsS0FBeUIsV0FBM0IsR0FBMkMsR0FBM0MsR0FBaURBLGFBQTlEO0FBQ0EsUUFBTVEsR0FBRyxHQUFNLE9BQU9ULFNBQVAsS0FBcUIsV0FBdkIsR0FBdUMsR0FBdkMsR0FBNkNBLFNBQTFEO0FBRUEsUUFBSVUsQ0FBSjs7QUFFQSxRQUFNQyxVQUFVLEdBQUcsU0FBYkEsVUFBYSxDQUFVUixDQUFWLEVBQWFFLElBQWIsRUFBb0I7QUFDdEMsVUFBTU8sQ0FBQyxHQUFHTixJQUFJLENBQUNPLEdBQUwsQ0FBVSxFQUFWLEVBQWNSLElBQWQsQ0FBVjtBQUNBLGFBQU8sS0FBS0MsSUFBSSxDQUFDUSxLQUFMLENBQVlYLENBQUMsR0FBR1MsQ0FBaEIsSUFBc0JBLENBQWxDO0FBQ0EsS0FIRCxDQVhvRSxDQWdCcEU7OztBQUNBRixJQUFBQSxDQUFDLEdBQUcsQ0FBRUwsSUFBSSxHQUFHTSxVQUFVLENBQUVSLENBQUYsRUFBS0UsSUFBTCxDQUFiLEdBQTJCLEtBQUtDLElBQUksQ0FBQ1EsS0FBTCxDQUFZWCxDQUFaLENBQXRDLEVBQXdEWSxLQUF4RCxDQUErRCxHQUEvRCxDQUFKOztBQUVBLFFBQUtMLENBQUMsQ0FBRSxDQUFGLENBQUQsQ0FBT00sTUFBUCxHQUFnQixDQUFyQixFQUF5QjtBQUN4Qk4sTUFBQUEsQ0FBQyxDQUFFLENBQUYsQ0FBRCxHQUFTQSxDQUFDLENBQUUsQ0FBRixDQUFELENBQU9SLE9BQVAsQ0FBZ0IseUJBQWhCLEVBQTJDTSxHQUEzQyxDQUFUO0FBQ0E7O0FBRUQsUUFBSyxDQUFFRSxDQUFDLENBQUUsQ0FBRixDQUFELElBQVUsRUFBWixFQUFpQk0sTUFBakIsR0FBMEJYLElBQS9CLEVBQXNDO0FBQ3JDSyxNQUFBQSxDQUFDLENBQUUsQ0FBRixDQUFELEdBQVNBLENBQUMsQ0FBRSxDQUFGLENBQUQsSUFBVSxFQUFuQjtBQUNBQSxNQUFBQSxDQUFDLENBQUUsQ0FBRixDQUFELElBQVUsSUFBSU8sS0FBSixDQUFXWixJQUFJLEdBQUdLLENBQUMsQ0FBRSxDQUFGLENBQUQsQ0FBT00sTUFBZCxHQUF1QixDQUFsQyxFQUFzQ0UsSUFBdEMsQ0FBNEMsR0FBNUMsQ0FBVjtBQUNBOztBQUVELFdBQU9SLENBQUMsQ0FBQ1EsSUFBRixDQUFRVCxHQUFSLENBQVA7QUFDQSxHQTNJc0MsQ0E2SXZDOzs7QUFDQSxXQUFTVSxjQUFULEdBQTBCO0FBQ3pCLFFBQUssZ0JBQWdCLE9BQU9DLFVBQTVCLEVBQXlDO0FBQ3hDO0FBQ0E7O0FBRUQsUUFBSXpDLEtBQUo7O0FBRUEsUUFBSzlCLFlBQVksQ0FBQytCLFdBQWxCLEVBQWdDO0FBQy9CRCxNQUFBQSxLQUFLLEdBQUcxQixDQUFDLENBQUVVLDhCQUFGLENBQVQ7QUFDQSxLQUZELE1BRU87QUFDTmdCLE1BQUFBLEtBQUssR0FBR1osd0JBQVI7QUFDQTs7QUFFRFksSUFBQUEsS0FBSyxDQUFDTCxJQUFOLENBQVkscUJBQVosRUFBb0NMLElBQXBDLENBQTBDLFlBQVc7QUFDcEQsVUFBTW9ELEtBQUssR0FBR3BFLENBQUMsQ0FBRSxJQUFGLENBQWY7QUFFQSxVQUFNc0IsU0FBUyxHQUFHOEMsS0FBSyxDQUFDakQsSUFBTixDQUFZLGlCQUFaLENBQWxCO0FBQ0EsVUFBTWtELE9BQU8sR0FBS0QsS0FBSyxDQUFDL0MsSUFBTixDQUFZLG9CQUFaLENBQWxCLENBSm9ELENBTXBEOztBQUNBLFVBQUtnRCxPQUFPLENBQUNDLFFBQVIsQ0FBa0IsbUJBQWxCLENBQUwsRUFBK0M7QUFDOUM7QUFDQTs7QUFFRCxVQUFNQyxRQUFRLEdBQVlGLE9BQU8sQ0FBQ2xELElBQVIsQ0FBYyxJQUFkLENBQTFCO0FBQ0EsVUFBTXFELGVBQWUsR0FBS0osS0FBSyxDQUFDakQsSUFBTixDQUFZLHdCQUFaLENBQTFCO0FBQ0EsVUFBTXNELGFBQWEsR0FBT0MsVUFBVSxDQUFFTixLQUFLLENBQUNqRCxJQUFOLENBQVksc0JBQVosQ0FBRixDQUFwQztBQUNBLFVBQU13RCxhQUFhLEdBQU9ELFVBQVUsQ0FBRU4sS0FBSyxDQUFDakQsSUFBTixDQUFZLHNCQUFaLENBQUYsQ0FBcEM7QUFDQSxVQUFNeUQsSUFBSSxHQUFnQkYsVUFBVSxDQUFFTixLQUFLLENBQUNqRCxJQUFOLENBQVksV0FBWixDQUFGLENBQXBDO0FBQ0EsVUFBTTBELGFBQWEsR0FBT1QsS0FBSyxDQUFDakQsSUFBTixDQUFZLHFCQUFaLENBQTFCO0FBQ0EsVUFBTTJELGlCQUFpQixHQUFHVixLQUFLLENBQUNqRCxJQUFOLENBQVkseUJBQVosQ0FBMUI7QUFDQSxVQUFNNEQsZ0JBQWdCLEdBQUlYLEtBQUssQ0FBQ2pELElBQU4sQ0FBWSx3QkFBWixDQUExQjtBQUNBLFVBQU02RCxRQUFRLEdBQVlOLFVBQVUsQ0FBRU4sS0FBSyxDQUFDakQsSUFBTixDQUFZLGdCQUFaLENBQUYsQ0FBcEM7QUFDQSxVQUFNOEQsUUFBUSxHQUFZUCxVQUFVLENBQUVOLEtBQUssQ0FBQ2pELElBQU4sQ0FBWSxnQkFBWixDQUFGLENBQXBDO0FBQ0EsVUFBTStELFNBQVMsR0FBV2QsS0FBSyxDQUFDL0MsSUFBTixDQUFZLFlBQVosQ0FBMUI7QUFDQSxVQUFNOEQsU0FBUyxHQUFXZixLQUFLLENBQUMvQyxJQUFOLENBQVksWUFBWixDQUExQjtBQUVBLFVBQU0rRCxNQUFNLEdBQUd0RixRQUFRLENBQUN1RixjQUFULENBQXlCZCxRQUF6QixDQUFmO0FBRUFKLE1BQUFBLFVBQVUsQ0FBQ21CLE1BQVgsQ0FBbUJGLE1BQW5CLEVBQTJCO0FBQzFCRyxRQUFBQSxLQUFLLEVBQUUsQ0FBRVAsUUFBRixFQUFZQyxRQUFaLENBRG1CO0FBRTFCTCxRQUFBQSxJQUFJLEVBQUpBLElBRjBCO0FBRzFCWSxRQUFBQSxPQUFPLEVBQUUsSUFIaUI7QUFJMUJDLFFBQUFBLFNBQVMsRUFBRSxhQUplO0FBSzFCQyxRQUFBQSxLQUFLLEVBQUU7QUFDTixpQkFBT2pCLGFBREQ7QUFFTixpQkFBT0U7QUFGRDtBQUxtQixPQUEzQjtBQVdBUyxNQUFBQSxNQUFNLENBQUNqQixVQUFQLENBQWtCakMsRUFBbEIsQ0FBc0IsUUFBdEIsRUFBZ0MsVUFBVXlELE1BQVYsRUFBbUI7QUFDbEQsWUFBTVgsUUFBUSxHQUFHcEMsYUFBYSxDQUFFK0MsTUFBTSxDQUFFLENBQUYsQ0FBUixFQUFlZCxhQUFmLEVBQThCRSxnQkFBOUIsRUFBZ0RELGlCQUFoRCxDQUE5QjtBQUNBLFlBQU1HLFFBQVEsR0FBR3JDLGFBQWEsQ0FBRStDLE1BQU0sQ0FBRSxDQUFGLENBQVIsRUFBZWQsYUFBZixFQUE4QkUsZ0JBQTlCLEVBQWdERCxpQkFBaEQsQ0FBOUI7O0FBRUEsWUFBSyxpQkFBaUJOLGVBQXRCLEVBQXdDO0FBQ3ZDVSxVQUFBQSxTQUFTLENBQUNVLElBQVYsQ0FBZ0JaLFFBQWhCO0FBQ0FHLFVBQUFBLFNBQVMsQ0FBQ1MsSUFBVixDQUFnQlgsUUFBaEI7QUFDQSxTQUhELE1BR087QUFDTkMsVUFBQUEsU0FBUyxDQUFDVyxHQUFWLENBQWViLFFBQWY7QUFDQUcsVUFBQUEsU0FBUyxDQUFDVSxHQUFWLENBQWVaLFFBQWY7QUFDQTs7QUFFRGhGLFFBQUFBLEtBQUssQ0FBQzZGLE9BQU4sQ0FBZSx5QkFBZixFQUEwQyxDQUFFMUIsS0FBRixFQUFTdUIsTUFBVCxDQUExQztBQUNBLE9BYkQ7O0FBZUEsZUFBU0ksK0JBQVQsQ0FBMENKLE1BQTFDLEVBQW1EO0FBQ2xELFlBQUsvRixZQUFZLENBQUMrQixXQUFsQixFQUFnQztBQUMvQjtBQUNBOztBQUVELFlBQU1xRCxRQUFRLEdBQUdOLFVBQVUsQ0FBRWlCLE1BQU0sQ0FBRSxDQUFGLENBQVIsQ0FBM0I7QUFDQSxZQUFNVixRQUFRLEdBQUdQLFVBQVUsQ0FBRWlCLE1BQU0sQ0FBRSxDQUFGLENBQVIsQ0FBM0I7QUFFQUssUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQWEsVUFBYixFQUF5QmpCLFFBQXpCLEVBQW1DWixLQUFuQztBQUNBNEIsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQWEsVUFBYixFQUF5QmhCLFFBQXpCLEVBQW1DYixLQUFuQzs7QUFFQSxZQUFLWSxRQUFRLEtBQUtQLGFBQWIsSUFBOEJRLFFBQVEsS0FBS04sYUFBaEQsRUFBZ0U7QUFDL0Q7QUFDQXVCLFVBQUFBLGFBQWEsQ0FBRTlCLEtBQUssQ0FBQytCLElBQU4sQ0FBWSxrQkFBWixDQUFGLENBQWI7QUFDQSxTQUhELE1BR087QUFDTjtBQUNBLGNBQU1DLEdBQUcsR0FBR2hDLEtBQUssQ0FBQytCLElBQU4sQ0FBWSxLQUFaLEVBQW9CbEQsT0FBcEIsQ0FBNkIsS0FBN0IsRUFBb0MrQixRQUFwQyxFQUErQy9CLE9BQS9DLENBQXdELEtBQXhELEVBQStEZ0MsUUFBL0QsQ0FBWjtBQUNBaUIsVUFBQUEsYUFBYSxDQUFFRSxHQUFGLENBQWI7QUFDQTtBQUNEOztBQUVEaEIsTUFBQUEsTUFBTSxDQUFDakIsVUFBUCxDQUFrQmpDLEVBQWxCLENBQXNCLFFBQXRCLEVBQWdDLFVBQVV5RCxNQUFWLEVBQW1CO0FBQ2xEO0FBQ0FVLFFBQUFBLFlBQVksQ0FBRWpDLEtBQUssQ0FBQytCLElBQU4sQ0FBWSxPQUFaLENBQUYsQ0FBWjtBQUVBL0IsUUFBQUEsS0FBSyxDQUFDK0IsSUFBTixDQUFZLE9BQVosRUFBcUJHLFVBQVUsQ0FBRSxZQUFXO0FBQzNDbEMsVUFBQUEsS0FBSyxDQUFDbUMsVUFBTixDQUFrQixPQUFsQjtBQUVBUixVQUFBQSwrQkFBK0IsQ0FBRUosTUFBRixDQUEvQjtBQUNBLFNBSjhCLEVBSTVCckYsS0FKNEIsQ0FBL0I7QUFLQSxPQVREO0FBV0E0RSxNQUFBQSxTQUFTLENBQUNoRCxFQUFWLENBQWMsT0FBZCxFQUF1QixVQUFVc0UsS0FBVixFQUFrQjtBQUN4Q0EsUUFBQUEsS0FBSyxDQUFDQyxjQUFOO0FBRUEsWUFBTUMsTUFBTSxHQUFHMUcsQ0FBQyxDQUFFLElBQUYsQ0FBaEIsQ0FId0MsQ0FLeEM7O0FBQ0FxRyxRQUFBQSxZQUFZLENBQUVLLE1BQU0sQ0FBQ1AsSUFBUCxDQUFhLE9BQWIsQ0FBRixDQUFaO0FBRUFPLFFBQUFBLE1BQU0sQ0FBQ1AsSUFBUCxDQUFhLE9BQWIsRUFBc0JHLFVBQVUsQ0FBRSxZQUFXO0FBQzVDSSxVQUFBQSxNQUFNLENBQUNILFVBQVAsQ0FBbUIsT0FBbkI7QUFFQSxjQUFNdkIsUUFBUSxHQUFHMEIsTUFBTSxDQUFDYixHQUFQLEVBQWpCO0FBRUFULFVBQUFBLE1BQU0sQ0FBQ2pCLFVBQVAsQ0FBa0J3QyxHQUFsQixDQUF1QixDQUFFM0IsUUFBRixFQUFZLElBQVosQ0FBdkI7QUFFQWUsVUFBQUEsK0JBQStCLENBQUVYLE1BQU0sQ0FBQ2pCLFVBQVAsQ0FBa0J5QyxHQUFsQixFQUFGLENBQS9CO0FBQ0EsU0FSK0IsRUFRN0J0RyxLQVI2QixDQUFoQztBQVNBLE9BakJEO0FBbUJBNkUsTUFBQUEsU0FBUyxDQUFDakQsRUFBVixDQUFjLE9BQWQsRUFBdUIsVUFBVXNFLEtBQVYsRUFBa0I7QUFDeENBLFFBQUFBLEtBQUssQ0FBQ0MsY0FBTjtBQUVBLFlBQU1DLE1BQU0sR0FBRzFHLENBQUMsQ0FBRSxJQUFGLENBQWhCLENBSHdDLENBS3hDOztBQUNBcUcsUUFBQUEsWUFBWSxDQUFFSyxNQUFNLENBQUNQLElBQVAsQ0FBYSxPQUFiLENBQUYsQ0FBWjtBQUVBTyxRQUFBQSxNQUFNLENBQUNQLElBQVAsQ0FBYSxPQUFiLEVBQXNCRyxVQUFVLENBQUUsWUFBVztBQUM1Q0ksVUFBQUEsTUFBTSxDQUFDSCxVQUFQLENBQW1CLE9BQW5CO0FBRUEsY0FBTXRCLFFBQVEsR0FBR3lCLE1BQU0sQ0FBQ2IsR0FBUCxFQUFqQjtBQUVBVCxVQUFBQSxNQUFNLENBQUNqQixVQUFQLENBQWtCd0MsR0FBbEIsQ0FBdUIsQ0FBRSxJQUFGLEVBQVExQixRQUFSLENBQXZCO0FBRUFjLFVBQUFBLCtCQUErQixDQUFFWCxNQUFNLENBQUNqQixVQUFQLENBQWtCeUMsR0FBbEIsRUFBRixDQUEvQjtBQUNBLFNBUitCLEVBUTdCdEcsS0FSNkIsQ0FBaEM7QUFTQSxPQWpCRDtBQWtCQSxLQXpIRDtBQTBIQTs7QUFFRDRELEVBQUFBLGNBQWM7O0FBRWQsV0FBUzJDLFlBQVQsQ0FBdUJILE1BQXZCLEVBQWdDO0FBQy9CLFFBQUs5RyxZQUFZLENBQUMrQixXQUFsQixFQUFnQztBQUMvQjtBQUNBOztBQUVELFFBQU1tRixnQkFBZ0IsR0FBR0osTUFBTSxDQUFDSyxPQUFQLENBQWdCLG1CQUFoQixDQUF6QjtBQUNBLFFBQU16RixTQUFTLEdBQVV3RixnQkFBZ0IsQ0FBQzNGLElBQWpCLENBQXVCLGlCQUF2QixDQUF6QjtBQUNBLFFBQU02RixPQUFPLEdBQVlGLGdCQUFnQixDQUFDM0YsSUFBakIsQ0FBdUIsZUFBdkIsQ0FBekI7QUFFQSxRQUFJOEYsV0FBVyxHQUFHLEVBQWxCO0FBQ0EsUUFBSUMsU0FBUyxHQUFLLEtBQWxCLENBVitCLENBWS9COztBQUNBYixJQUFBQSxZQUFZLENBQUVTLGdCQUFnQixDQUFDWCxJQUFqQixDQUF1QixPQUF2QixDQUFGLENBQVo7O0FBRUEsUUFBS2EsT0FBTCxFQUFlO0FBQ2QsVUFBTUcsSUFBSSxHQUFHTCxnQkFBZ0IsQ0FBQ3pGLElBQWpCLENBQXVCLGtCQUF2QixFQUE0Q3dFLEdBQTVDLEVBQWI7QUFDQSxVQUFNdUIsRUFBRSxHQUFLTixnQkFBZ0IsQ0FBQ3pGLElBQWpCLENBQXVCLGdCQUF2QixFQUEwQ3dFLEdBQTFDLEVBQWI7O0FBRUEsVUFBS3NCLElBQUksSUFBSUMsRUFBYixFQUFrQjtBQUNqQkgsUUFBQUEsV0FBVyxHQUFHRSxJQUFJLEdBQUdqSCxvQkFBUCxHQUE4QmtILEVBQTVDO0FBQ0FGLFFBQUFBLFNBQVMsR0FBSyxJQUFkO0FBQ0EsT0FIRCxNQUdPLElBQUssQ0FBRUMsSUFBRixJQUFVLENBQUVDLEVBQWpCLEVBQXNCO0FBQzVCRixRQUFBQSxTQUFTLEdBQUcsSUFBWjtBQUNBO0FBQ0QsS0FWRCxNQVVPO0FBQ04sVUFBTUMsS0FBSSxHQUFHTCxnQkFBZ0IsQ0FBQ3pGLElBQWpCLENBQXVCLGtCQUF2QixFQUE0Q3dFLEdBQTVDLEVBQWI7O0FBRUEsVUFBS3NCLEtBQUwsRUFBWTtBQUNYRixRQUFBQSxXQUFXLEdBQUdFLEtBQWQ7QUFDQUQsUUFBQUEsU0FBUyxHQUFLLElBQWQ7QUFDQSxPQUhELE1BR087QUFDTkEsUUFBQUEsU0FBUyxHQUFHLElBQVo7QUFDQTtBQUNEOztBQUVELFFBQUtBLFNBQUwsRUFBaUI7QUFDaEJKLE1BQUFBLGdCQUFnQixDQUFDWCxJQUFqQixDQUF1QixPQUF2QixFQUFnQ0csVUFBVSxDQUFFLFlBQVc7QUFDdERRLFFBQUFBLGdCQUFnQixDQUFDUCxVQUFqQixDQUE2QixPQUE3Qjs7QUFFQSxZQUFLVSxXQUFMLEVBQW1CO0FBQ2xCSSxVQUFBQSwwQkFBMEIsQ0FBRS9GLFNBQUYsRUFBYTJGLFdBQWIsQ0FBMUI7QUFDQSxTQUZELE1BRU87QUFDTixjQUFNSyxLQUFLLEdBQUdDLDBCQUEwQixDQUFFakcsU0FBRixDQUF4QztBQUNBa0csVUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCSCxLQUEzQjtBQUNBOztBQUVESSxRQUFBQSxjQUFjO0FBQ2QsT0FYeUMsRUFXdkNwSCxLQVh1QyxDQUExQztBQVlBO0FBQ0Q7O0FBRUQsV0FBU3FILGNBQVQsR0FBMEI7QUFDekIsUUFBSyxDQUFFOUgsTUFBTSxHQUFHK0gsVUFBaEIsRUFBNkI7QUFDNUI7QUFDQTs7QUFFRCxRQUFJbEcsS0FBSjs7QUFFQSxRQUFLOUIsWUFBWSxDQUFDK0IsV0FBbEIsRUFBZ0M7QUFDL0JELE1BQUFBLEtBQUssR0FBRzFCLENBQUMsQ0FBRVcsdUJBQUYsQ0FBVDtBQUNBLEtBRkQsTUFFTztBQUNOZSxNQUFBQSxLQUFLLEdBQUdYLGlCQUFSO0FBQ0E7O0FBRUQsUUFBTStGLGdCQUFnQixHQUFHcEYsS0FBSyxDQUFDTCxJQUFOLENBQVksbUJBQVosQ0FBekI7QUFFQSxRQUFNd0csTUFBTSxHQUFVZixnQkFBZ0IsQ0FBQzNGLElBQWpCLENBQXVCLGtCQUF2QixDQUF0QjtBQUNBLFFBQU0yRyxZQUFZLEdBQUloQixnQkFBZ0IsQ0FBQzNGLElBQWpCLENBQXVCLGdDQUF2QixDQUF0QjtBQUNBLFFBQU00RyxhQUFhLEdBQUdqQixnQkFBZ0IsQ0FBQzNGLElBQWpCLENBQXVCLGlDQUF2QixDQUF0QjtBQUVBLFFBQU02RyxLQUFLLEdBQUdsQixnQkFBZ0IsQ0FBQ3pGLElBQWpCLENBQXVCLGtCQUF2QixDQUFkO0FBQ0EsUUFBTTRHLEdBQUcsR0FBS25CLGdCQUFnQixDQUFDekYsSUFBakIsQ0FBdUIsZ0JBQXZCLENBQWQ7QUFFQTJHLElBQUFBLEtBQUssQ0FBQ0osVUFBTixDQUFrQjtBQUNqQk0sTUFBQUEsVUFBVSxFQUFFTCxNQURLO0FBRWpCTSxNQUFBQSxVQUFVLEVBQUVMLFlBRks7QUFHakJNLE1BQUFBLFdBQVcsRUFBRUw7QUFISSxLQUFsQjtBQU1BRSxJQUFBQSxHQUFHLENBQUNMLFVBQUosQ0FBZ0I7QUFDZk0sTUFBQUEsVUFBVSxFQUFFTCxNQURHO0FBRWZNLE1BQUFBLFVBQVUsRUFBRUwsWUFGRztBQUdmTSxNQUFBQSxXQUFXLEVBQUVMO0FBSEUsS0FBaEI7QUFNQUMsSUFBQUEsS0FBSyxDQUFDOUYsRUFBTixDQUFVLFFBQVYsRUFBb0IsWUFBVztBQUM5QixVQUFNd0UsTUFBTSxHQUFHMUcsQ0FBQyxDQUFFLElBQUYsQ0FBaEI7QUFDQTZHLE1BQUFBLFlBQVksQ0FBRUgsTUFBRixDQUFaO0FBQ0EsS0FIRDtBQUtBdUIsSUFBQUEsR0FBRyxDQUFDL0YsRUFBSixDQUFRLFFBQVIsRUFBa0IsWUFBVztBQUM1QixVQUFNd0UsTUFBTSxHQUFHMUcsQ0FBQyxDQUFFLElBQUYsQ0FBaEI7QUFDQTZHLE1BQUFBLFlBQVksQ0FBRUgsTUFBRixDQUFaO0FBQ0EsS0FIRDtBQUlBOztBQUVEaUIsRUFBQUEsY0FBYzs7QUFFZCxXQUFTVSxrQkFBVCxHQUE4QjtBQUM3QjtBQUNBLFFBQUt6SSxZQUFZLENBQUMwSSx3QkFBbEIsRUFBNkM7QUFDNUMsVUFBS3pJLE1BQU0sR0FBRzRCLE1BQWQsRUFBdUI7QUFDdEJ4QixRQUFBQSxLQUFLLENBQUNvQixJQUFOLENBQVksc0NBQVosRUFBcURJLE1BQXJELENBQTZEO0FBQzVELHNDQUE0QjtBQURnQyxTQUE3RDtBQUdBO0FBQ0Q7O0FBRUQsUUFBSyxDQUFFN0IsWUFBWSxDQUFDMkksZUFBcEIsRUFBc0M7QUFDckN0SSxNQUFBQSxLQUFLLENBQUNvQixJQUFOLENBQVksdUJBQVosRUFBc0NMLElBQXRDLENBQTRDLFlBQVc7QUFDdEQsWUFBTXdILGFBQWEsR0FBR3hJLENBQUMsQ0FBRSxJQUFGLENBQXZCO0FBRUF3SSxRQUFBQSxhQUFhLENBQUN0RyxFQUFkLENBQWtCLFFBQWxCLEVBQTRCLGdCQUE1QixFQUE4QyxZQUFXO0FBQ3hEc0csVUFBQUEsYUFBYSxDQUFDQyxNQUFkO0FBQ0EsU0FGRDtBQUdBLE9BTkQ7QUFRQTtBQUNBLEtBcEI0QixDQXNCN0I7OztBQUNBeEksSUFBQUEsS0FBSyxDQUFDb0IsSUFBTixDQUFZLHVCQUFaLEVBQXNDTCxJQUF0QyxDQUE0QyxZQUFXO0FBQ3RELFVBQU13SCxhQUFhLEdBQUd4SSxDQUFDLENBQUUsSUFBRixDQUF2QjtBQUVBd0ksTUFBQUEsYUFBYSxDQUFDdEcsRUFBZCxDQUFrQixRQUFsQixFQUE0QixVQUFVd0csQ0FBVixFQUFjO0FBQ3pDQSxRQUFBQSxDQUFDLENBQUNqQyxjQUFGO0FBQ0EsT0FGRDtBQUlBK0IsTUFBQUEsYUFBYSxDQUFDdEcsRUFBZCxDQUFrQixRQUFsQixFQUE0QixnQkFBNUIsRUFBOEMsVUFBVXdHLENBQVYsRUFBYztBQUMzREEsUUFBQUEsQ0FBQyxDQUFDakMsY0FBRjtBQUVBLFlBQU1rQyxLQUFLLEdBQVEzSSxDQUFDLENBQUUsSUFBRixDQUFELENBQVU2RixHQUFWLEVBQW5CO0FBQ0EsWUFBTStDLFVBQVUsR0FBRyxTQUFuQjtBQUVBdkIsUUFBQUEsMEJBQTBCLENBQUV1QixVQUFGLEVBQWNELEtBQWQsQ0FBMUI7QUFDQWpCLFFBQUFBLGNBQWM7QUFDZCxPQVJEO0FBU0EsS0FoQkQ7QUFpQkE7O0FBRURXLEVBQUFBLGtCQUFrQjs7QUFFbEIsV0FBU1EseUJBQVQsQ0FBb0NDLFFBQXBDLEVBQStDO0FBQzlDLFFBQU1DLFFBQVEsR0FBRywyQkFBakI7O0FBRUEsUUFBSy9JLENBQUMsQ0FBRUosWUFBWSxDQUFDb0osbUJBQWYsQ0FBRCxDQUFzQzNILElBQXRDLENBQTRDMEgsUUFBNUMsRUFBdURoRixNQUE1RCxFQUFxRTtBQUNwRTtBQUNBOztBQUVELFFBQU1rRixlQUFlLEdBQUdILFFBQVEsQ0FBQ3pILElBQVQsQ0FBZTBILFFBQWYsRUFBMEJuRCxJQUExQixFQUF4QjtBQUVBM0YsSUFBQUEsS0FBSyxDQUFDb0IsSUFBTixDQUFZMEgsUUFBWixFQUF1Qm5ELElBQXZCLENBQTZCcUQsZUFBN0I7QUFDQTs7QUFFRCxXQUFTQyxvQkFBVCxHQUFnQztBQUMvQixRQUFLLENBQUV0SixZQUFZLENBQUN1SixpQkFBcEIsRUFBd0M7QUFDdkM7QUFDQTs7QUFFRG5KLElBQUFBLENBQUMsQ0FBQ29KLGNBQUYsQ0FBa0IsTUFBbEIsRUFBMEJ4SixZQUFZLENBQUN5Six1QkFBdkM7QUFDQTs7QUFFRCxXQUFTQyxrQkFBVCxHQUE4QjtBQUM3QixRQUFLLGdCQUFnQixPQUFPbkYsVUFBNUIsRUFBeUM7QUFDeEM7QUFDQTs7QUFFRHJELElBQUFBLHdCQUF3QixDQUFDTyxJQUF6QixDQUErQixvQkFBL0IsRUFBc0RMLElBQXRELENBQTRELFVBQVUwSCxDQUFWLEVBQWFhLE9BQWIsRUFBdUI7QUFDbEZBLE1BQUFBLE9BQU8sQ0FBQ0MsWUFBUixDQUFzQixVQUF0QixFQUFrQyxJQUFsQztBQUNBLEtBRkQ7QUFHQTs7QUFFRCxXQUFTQyxhQUFULEdBQXlCO0FBQ3hCLFFBQU1DLFNBQVMsR0FBRyx1REFBbEI7QUFFQTlJLElBQUFBLG1CQUFtQixDQUFDUyxJQUFwQixDQUEwQnFJLFNBQTFCLEVBQXNDQyxRQUF0QyxDQUFnRCxVQUFoRDtBQUNBOztBQUVELFdBQVNDLGFBQVQsR0FBeUI7QUFDeEIsUUFBSyxDQUFFaEssWUFBWSxDQUFDaUsscUNBQXBCLEVBQTREO0FBQzNEO0FBQ0E7O0FBRUQsUUFBTUMsTUFBTSxHQUFHLGVBQWY7QUFFQWxKLElBQUFBLG1CQUFtQixDQUFDUyxJQUFwQixDQUEwQnlJLE1BQTFCLEVBQW1DM0ksSUFBbkMsQ0FBeUMsVUFBekMsRUFBcUQsVUFBckQ7QUFDQVAsSUFBQUEsbUJBQW1CLENBQUNTLElBQXBCLENBQTBCeUksTUFBMUIsRUFBbUNoRSxPQUFuQyxDQUE0QyxnQkFBNUM7QUFFQXdELElBQUFBLGtCQUFrQjtBQUNsQkcsSUFBQUEsYUFBYTtBQUNiOztBQUVELFdBQVNNLGlCQUFULEdBQTZCO0FBQzVCLFFBQUssZ0JBQWdCLE9BQU81RixVQUE1QixFQUF5QztBQUN4QztBQUNBOztBQUVEckQsSUFBQUEsd0JBQXdCLENBQUNPLElBQXpCLENBQStCLG9CQUEvQixFQUFzREwsSUFBdEQsQ0FBNEQsVUFBVTBILENBQVYsRUFBYWEsT0FBYixFQUF1QjtBQUNsRkEsTUFBQUEsT0FBTyxDQUFDUyxlQUFSLENBQXlCLFVBQXpCO0FBQ0EsS0FGRDtBQUdBOztBQUVELFdBQVNDLFlBQVQsR0FBd0I7QUFDdkIsUUFBSyxDQUFFckssWUFBWSxDQUFDaUsscUNBQXBCLEVBQTREO0FBQzNEO0FBQ0E7O0FBRUQsUUFBTUMsTUFBTSxHQUFHLE9BQWY7QUFFQWhKLElBQUFBLHdCQUF3QixDQUFDTyxJQUF6QixDQUErQnlJLE1BQS9CLEVBQXdDSSxVQUF4QyxDQUFvRCxVQUFwRDtBQUNBbkosSUFBQUEsaUJBQWlCLENBQUNNLElBQWxCLENBQXdCeUksTUFBeEIsRUFBaUNJLFVBQWpDLENBQTZDLFVBQTdDO0FBRUFILElBQUFBLGlCQUFpQjtBQUNqQjs7QUFFRCxXQUFTSSxxQkFBVCxHQUFpQztBQUNoQyxRQUFLLENBQUV2SyxZQUFZLENBQUN1SixpQkFBcEIsRUFBd0M7QUFDdkM7QUFDQTs7QUFFRG5KLElBQUFBLENBQUMsQ0FBQ29KLGNBQUYsQ0FBa0IsTUFBbEI7QUFDQTs7QUFFRCxXQUFTZ0IsUUFBVCxHQUFvQjtBQUNuQixRQUFLLFdBQVd4SyxZQUFZLENBQUN5SyxhQUE3QixFQUE2QztBQUM1QztBQUNBOztBQUVELFFBQU1DLFNBQVMsR0FBRzFLLFlBQVksQ0FBQzJLLGlCQUEvQjtBQUNBLFFBQU1DLFFBQVEsR0FBSTVLLFlBQVksQ0FBQzZLLFNBQS9CO0FBQ0EsUUFBSUMsT0FBTyxHQUFPLEtBQWxCOztBQUVBLFFBQUssYUFBYUosU0FBYixJQUEwQkUsUUFBL0IsRUFBMEM7QUFDekNFLE1BQUFBLE9BQU8sR0FBRyxJQUFWO0FBQ0EsS0FGRCxNQUVPLElBQUssY0FBY0osU0FBZCxJQUEyQixDQUFFRSxRQUFsQyxFQUE2QztBQUNuREUsTUFBQUEsT0FBTyxHQUFHLElBQVY7QUFDQSxLQUZNLE1BRUEsSUFBSyxXQUFXSixTQUFoQixFQUE0QjtBQUNsQ0ksTUFBQUEsT0FBTyxHQUFHLElBQVY7QUFDQTs7QUFFRCxRQUFLLENBQUVBLE9BQVAsRUFBaUI7QUFDaEI7QUFDQTs7QUFFRCxRQUFJQyxlQUFKLEVBQXFCQyxNQUFyQjs7QUFFQSxRQUFLaEwsWUFBWSxDQUFDaUwsb0JBQWxCLEVBQXlDO0FBQ3hDRixNQUFBQSxlQUFlLEdBQUd2SyxRQUFRLENBQUVSLFlBQVksQ0FBQ2lMLG9CQUFmLENBQTFCO0FBQ0E7O0FBRUQsUUFBSUMsU0FBSjs7QUFFQSxRQUFLOUssQ0FBQyxDQUFFSixZQUFZLENBQUNvSixtQkFBZixDQUFELENBQXNDakYsTUFBM0MsRUFBb0Q7QUFDbkQrRyxNQUFBQSxTQUFTLEdBQUdsTCxZQUFZLENBQUNvSixtQkFBekI7QUFDQSxLQUZELE1BRU8sSUFBS2hKLENBQUMsQ0FBRUosWUFBWSxDQUFDbUwsbUJBQWYsQ0FBRCxDQUFzQ2hILE1BQTNDLEVBQW9EO0FBQzFEK0csTUFBQUEsU0FBUyxHQUFHbEwsWUFBWSxDQUFDbUwsbUJBQXpCO0FBQ0E7O0FBRUQsUUFBSyxhQUFhbkwsWUFBWSxDQUFDeUssYUFBL0IsRUFBK0M7QUFDOUNTLE1BQUFBLFNBQVMsR0FBR2xMLFlBQVksQ0FBQ29MLDRCQUF6QjtBQUNBOztBQUVELFFBQU1DLFVBQVUsR0FBR2pMLENBQUMsQ0FBRThLLFNBQUYsQ0FBcEI7O0FBRUEsUUFBS0csVUFBVSxDQUFDbEgsTUFBaEIsRUFBeUI7QUFDeEI2RyxNQUFBQSxNQUFNLEdBQUdLLFVBQVUsQ0FBQ0wsTUFBWCxHQUFvQk0sR0FBcEIsR0FBMEJQLGVBQW5DOztBQUVBLFVBQUtDLE1BQU0sR0FBRyxDQUFkLEVBQWtCO0FBQ2pCQSxRQUFBQSxNQUFNLEdBQUcsQ0FBVDtBQUNBOztBQUVENUssTUFBQUEsQ0FBQyxDQUFFLFlBQUYsQ0FBRCxDQUFrQm1MLElBQWxCLEdBQXlCQyxPQUF6QixDQUNDO0FBQUVDLFFBQUFBLFNBQVMsRUFBRVQ7QUFBYixPQURELEVBRUNoTCxZQUFZLENBQUMwTCxtQkFGZCxFQUdDMUwsWUFBWSxDQUFDMkwsb0JBSGQ7QUFLQTtBQUNELEdBL2lCc0MsQ0FpakJ2Qzs7O0FBQ0EsV0FBU0Msc0JBQVQsR0FBa0M7QUFDakM1QixJQUFBQSxhQUFhO0FBQ2JWLElBQUFBLG9CQUFvQjs7QUFFcEIsUUFBSyxrQkFBa0J0SixZQUFZLENBQUM2TCxrQkFBcEMsRUFBeUQ7QUFDeERyQixNQUFBQSxRQUFRO0FBQ1I7O0FBRURuSyxJQUFBQSxLQUFLLENBQUM2RixPQUFOLENBQWUsZ0NBQWY7QUFDQTs7QUFFRCxXQUFTNEYsc0JBQVQsQ0FBaUM1QyxRQUFqQyxFQUE0QztBQUMzQ3FCLElBQUFBLHFCQUFxQjtBQUVyQmxLLElBQUFBLEtBQUssQ0FBQzZGLE9BQU4sQ0FBZSxnQ0FBZixFQUFpRCxDQUFFZ0QsUUFBRixDQUFqRDtBQUNBLEdBamtCc0MsQ0Fta0J2Qzs7O0FBQ0EsV0FBUzZDLHFCQUFULENBQWdDN0MsUUFBaEMsRUFBMkM7QUFDMUN0SCxJQUFBQSxVQUFVO0FBQ1ZTLElBQUFBLHNCQUFzQjtBQUN0QmlDLElBQUFBLGNBQWM7QUFDZHlELElBQUFBLGNBQWM7QUFDZFUsSUFBQUEsa0JBQWtCO0FBQ2xCUSxJQUFBQSx5QkFBeUIsQ0FBRUMsUUFBRixDQUF6QjtBQUNBbUIsSUFBQUEsWUFBWTs7QUFFWixRQUFLLFlBQVlySyxZQUFZLENBQUM2TCxrQkFBOUIsRUFBbUQ7QUFDbERyQixNQUFBQSxRQUFRO0FBQ1I7O0FBRURuSyxJQUFBQSxLQUFLLENBQUM2RixPQUFOLENBQWUsK0JBQWYsRUFBZ0QsQ0FBRWdELFFBQUYsQ0FBaEQ7QUFDQSxHQWxsQnNDLENBb2xCdkM7OztBQUNBLFdBQVNwQixjQUFULEdBQWlEO0FBQUEsUUFBeEJrRSxhQUF3Qix1RUFBUixLQUFROztBQUNoRCxRQUFLaE0sWUFBWSxDQUFDK0IsV0FBbEIsRUFBZ0M7QUFDL0I7QUFDQTs7QUFFRDZKLElBQUFBLHNCQUFzQjtBQUV0QnhMLElBQUFBLENBQUMsQ0FBQzRHLEdBQUYsQ0FBT2lGLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsSUFBdkIsRUFBNkIsVUFBVTVGLElBQVYsRUFBaUI7QUFDN0MsVUFBTTZGLEtBQUssR0FBR2hNLENBQUMsQ0FBRW1HLElBQUYsQ0FBZixDQUQ2QyxDQUc3Qzs7QUFDQW5HLE1BQUFBLENBQUMsQ0FBQ2dCLElBQUYsQ0FBUVQsTUFBUixFQUFnQixVQUFVVyxFQUFWLEVBQWU7QUFDOUIsWUFBTStLLE9BQU8sR0FBTSxlQUFlL0ssRUFBZixHQUFvQixJQUF2QztBQUNBLFlBQU1ELE1BQU0sR0FBT2pCLENBQUMsQ0FBRWlNLE9BQUYsQ0FBcEI7QUFDQSxZQUFNQyxNQUFNLEdBQU9qTCxNQUFNLENBQUNJLElBQVAsQ0FBYSxvQkFBYixDQUFuQjs7QUFDQSxZQUFNOEssTUFBTSxHQUFPSCxLQUFLLENBQUMzSyxJQUFOLENBQVk0SyxPQUFaLENBQW5COztBQUNBLFlBQUlHLFlBQVksR0FBR3BNLENBQUMsQ0FBRW1NLE1BQUYsQ0FBRCxDQUFZaEwsSUFBWixDQUFrQixPQUFsQixDQUFuQixDQUw4QixDQU85Qjs7QUFDQSxZQUFLdkIsWUFBWSxDQUFDeU0sa0NBQWxCLEVBQXVEO0FBQ3RELGNBQUtwTCxNQUFNLENBQUNxRCxRQUFQLENBQWlCLHFCQUFqQixDQUFMLEVBQWdEO0FBQy9DckQsWUFBQUEsTUFBTSxDQUFDSSxJQUFQLENBQWEsb0NBQWIsRUFBb0RMLElBQXBELENBQTBELFlBQVc7QUFDcEUsa0JBQU1zTCxTQUFTLEdBQVF0TSxDQUFDLENBQUUsSUFBRixDQUFELENBQVVvQyxNQUFWLEdBQW1CQyxRQUFuQixDQUE2QixPQUE3QixFQUF1Q3dELEdBQXZDLEVBQXZCO0FBQ0Esa0JBQU0wRyxjQUFjLEdBQUcsa0JBQWtCRCxTQUFsQixHQUE4QixrQ0FBckQ7QUFDQSxrQkFBTUUsVUFBVSxHQUFPLGtCQUFrQkYsU0FBbEIsR0FBOEIsU0FBckQ7QUFDQSxrQkFBTUcsUUFBUSxHQUFTLG1DQUF2Qjs7QUFFQU4sY0FBQUEsTUFBTSxDQUFDOUssSUFBUCxDQUFha0wsY0FBYixFQUE4QnBMLElBQTlCLENBQW9DLE9BQXBDLEVBQTZDc0wsUUFBN0M7O0FBQ0FOLGNBQUFBLE1BQU0sQ0FBQzlLLElBQVAsQ0FBYW1MLFVBQWIsRUFBMEJFLElBQTFCO0FBQ0EsYUFSRDtBQVNBO0FBQ0Q7O0FBRUQsWUFBTUMsS0FBSyxHQUFHUixNQUFNLENBQUM5SyxJQUFQLENBQWEsb0JBQWIsRUFBb0N1RSxJQUFwQyxFQUFkLENBdEI4QixDQXdCOUI7OztBQUNBLFlBQU1nSCxpQkFBaUIsR0FBRyxtQkFBMUI7O0FBRUEsWUFBSzNMLE1BQU0sQ0FBQ3FELFFBQVAsQ0FBaUJzSSxpQkFBakIsQ0FBTCxFQUE0QztBQUMzQyxjQUFLLENBQUVULE1BQU0sQ0FBQzdILFFBQVAsQ0FBaUJzSSxpQkFBakIsQ0FBUCxFQUE4QztBQUM3Q1IsWUFBQUEsWUFBWSxJQUFJLE1BQU1RLGlCQUF0QjtBQUNBO0FBQ0QsU0FKRCxNQUlPO0FBQ05SLFVBQUFBLFlBQVksR0FBR0EsWUFBWSxDQUFDbkosT0FBYixDQUFzQjJKLGlCQUF0QixFQUF5QyxFQUF6QyxDQUFmO0FBQ0EsU0FqQzZCLENBbUM5Qjs7O0FBQ0EzTCxRQUFBQSxNQUFNLENBQUNFLElBQVAsQ0FBYSxPQUFiLEVBQXNCaUwsWUFBWSxDQUFDUyxJQUFiLEVBQXRCLEVBcEM4QixDQXNDOUI7O0FBQ0EsWUFBS2pCLGFBQUwsRUFBcUI7QUFFcEI7QUFDQU0sVUFBQUEsTUFBTSxDQUFDdEcsSUFBUCxDQUFhK0csS0FBYjtBQUVBLFNBTEQsTUFLTztBQUVOO0FBQ0EsY0FBSzFMLE1BQU0sQ0FBQ3FELFFBQVAsQ0FBaUIsa0JBQWpCLENBQUwsRUFBNkM7QUFFNUM7QUFDQTRILFlBQUFBLE1BQU0sQ0FBQ3RHLElBQVAsQ0FBYStHLEtBQWI7QUFFQTtBQUVEOztBQUVEMUwsUUFBQUEsTUFBTSxDQUFDNkUsT0FBUCxDQUFnQixxQkFBaEIsRUFBdUMsQ0FBRXFHLE1BQUYsQ0FBdkM7QUFDQSxPQXpERDtBQTJEQVQsTUFBQUEsc0JBQXNCLENBQUVNLEtBQUYsQ0FBdEIsQ0EvRDZDLENBaUU3Qzs7QUFDQSxVQUFNYyxrQkFBa0IsR0FBR2QsS0FBSyxDQUFDM0ssSUFBTixDQUFZekIsWUFBWSxDQUFDb0osbUJBQXpCLENBQTNCO0FBQ0EsVUFBTStELGtCQUFrQixHQUFHZixLQUFLLENBQUMzSyxJQUFOLENBQVl6QixZQUFZLENBQUNtTCxtQkFBekIsQ0FBM0I7O0FBRUEsVUFBS25MLFlBQVksQ0FBQ29KLG1CQUFiLEtBQXFDcEosWUFBWSxDQUFDbUwsbUJBQXZELEVBQTZFO0FBQzVFL0ssUUFBQUEsQ0FBQyxDQUFFSixZQUFZLENBQUNvSixtQkFBZixDQUFELENBQXNDcEQsSUFBdEMsQ0FBNENrSCxrQkFBa0IsQ0FBQ2xILElBQW5CLEVBQTVDO0FBQ0EsT0FGRCxNQUVPO0FBQ04sWUFBSzVGLENBQUMsQ0FBRUosWUFBWSxDQUFDbUwsbUJBQWYsQ0FBRCxDQUFzQ2hILE1BQTNDLEVBQW9EO0FBQ25ELGNBQUsrSSxrQkFBa0IsQ0FBQy9JLE1BQXhCLEVBQWlDO0FBQ2hDL0QsWUFBQUEsQ0FBQyxDQUFFSixZQUFZLENBQUNtTCxtQkFBZixDQUFELENBQXNDbkYsSUFBdEMsQ0FBNENrSCxrQkFBa0IsQ0FBQ2xILElBQW5CLEVBQTVDO0FBQ0EsV0FGRCxNQUVPLElBQUttSCxrQkFBa0IsQ0FBQ2hKLE1BQXhCLEVBQWlDO0FBQ3ZDL0QsWUFBQUEsQ0FBQyxDQUFFSixZQUFZLENBQUNtTCxtQkFBZixDQUFELENBQXNDbkYsSUFBdEMsQ0FBNENtSCxrQkFBa0IsQ0FBQ25ILElBQW5CLEVBQTVDO0FBQ0E7QUFDRCxTQU5ELE1BTU8sSUFBSzVGLENBQUMsQ0FBRUosWUFBWSxDQUFDb0osbUJBQWYsQ0FBRCxDQUFzQ2pGLE1BQTNDLEVBQW9EO0FBQzFELGNBQUsrSSxrQkFBa0IsQ0FBQy9JLE1BQXhCLEVBQWlDO0FBQ2hDL0QsWUFBQUEsQ0FBQyxDQUFFSixZQUFZLENBQUNvSixtQkFBZixDQUFELENBQXNDcEQsSUFBdEMsQ0FBNENrSCxrQkFBa0IsQ0FBQ2xILElBQW5CLEVBQTVDO0FBQ0EsV0FGRCxNQUVPLElBQUttSCxrQkFBa0IsQ0FBQ2hKLE1BQXhCLEVBQWlDO0FBQ3ZDL0QsWUFBQUEsQ0FBQyxDQUFFSixZQUFZLENBQUNvSixtQkFBZixDQUFELENBQXNDcEQsSUFBdEMsQ0FBNENtSCxrQkFBa0IsQ0FBQ25ILElBQW5CLEVBQTVDO0FBQ0E7QUFDRDtBQUNEOztBQUVEK0YsTUFBQUEscUJBQXFCLENBQUVLLEtBQUYsQ0FBckI7QUFDQSxLQXhGRDtBQXlGQSxHQXJyQnNDLENBdXJCdkM7OztBQUNBLFdBQVNnQixVQUFULENBQXFCNUcsR0FBckIsRUFBMkI7QUFDMUIsUUFBSTZHLElBQUksR0FBRyxFQUFYO0FBQUEsUUFBZUMsSUFBZjs7QUFFQSxRQUFLLE9BQU85RyxHQUFQLEtBQWUsV0FBcEIsRUFBa0M7QUFDakNBLE1BQUFBLEdBQUcsR0FBR3lGLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsSUFBdEI7QUFDQTs7QUFFRDNGLElBQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDK0csVUFBSixDQUFnQixLQUFoQixFQUF1QixHQUF2QixDQUFOO0FBRUEsUUFBTUMsTUFBTSxHQUFJaEgsR0FBRyxDQUFDaUgsS0FBSixDQUFXakgsR0FBRyxDQUFDa0gsT0FBSixDQUFhLEdBQWIsSUFBcUIsQ0FBaEMsRUFBb0N4SixLQUFwQyxDQUEyQyxHQUEzQyxDQUFoQjtBQUNBLFFBQU15SixPQUFPLEdBQUdILE1BQU0sQ0FBQ3JKLE1BQXZCOztBQUVBLFNBQU0sSUFBSXlKLENBQUMsR0FBRyxDQUFkLEVBQWlCQSxDQUFDLEdBQUdELE9BQXJCLEVBQThCQyxDQUFDLEVBQS9CLEVBQW9DO0FBQ25DTixNQUFBQSxJQUFJLEdBQUdFLE1BQU0sQ0FBRUksQ0FBRixDQUFOLENBQVkxSixLQUFaLENBQW1CLEdBQW5CLENBQVA7QUFFQW1KLE1BQUFBLElBQUksQ0FBRUMsSUFBSSxDQUFFLENBQUYsQ0FBTixDQUFKLEdBQW9CQSxJQUFJLENBQUUsQ0FBRixDQUF4QjtBQUNBOztBQUVELFdBQU9ELElBQVA7QUFDQSxHQTNzQnNDLENBNnNCdkM7OztBQUNBLFdBQVNRLGFBQVQsR0FBeUI7QUFDeEIsUUFBSXJILEdBQUcsR0FBa0J5RixNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLElBQXpDO0FBQ0EsUUFBTTJCLE1BQU0sR0FBYVYsVUFBVSxDQUFFNUcsR0FBRixDQUFuQztBQUNBLFFBQU11SCxnQkFBZ0IsR0FBR3ZOLFFBQVEsQ0FBRWdHLEdBQUcsQ0FBQ25ELE9BQUosQ0FBYSxrQkFBYixFQUFpQyxJQUFqQyxDQUFGLENBQWpDOztBQUVBLFFBQUswSyxnQkFBTCxFQUF3QjtBQUN2QixVQUFLQSxnQkFBZ0IsR0FBRyxDQUF4QixFQUE0QjtBQUMzQnZILFFBQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDbkQsT0FBSixDQUFhLGFBQWIsRUFBNEIsUUFBNUIsQ0FBTjtBQUNBO0FBQ0QsS0FKRCxNQUlPLElBQUssT0FBT3lLLE1BQU0sQ0FBRSxPQUFGLENBQWIsS0FBNkIsV0FBbEMsRUFBZ0Q7QUFDdEQsVUFBTUUsbUJBQW1CLEdBQUd4TixRQUFRLENBQUVzTixNQUFNLENBQUUsT0FBRixDQUFSLENBQXBDOztBQUVBLFVBQUtFLG1CQUFtQixHQUFHLENBQTNCLEVBQStCO0FBQzlCeEgsUUFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUNuRCxPQUFKLENBQWEsV0FBVzJLLG1CQUF4QixFQUE2QyxTQUE3QyxDQUFOO0FBQ0E7QUFDRDs7QUFFRCxXQUFPeEgsR0FBUDtBQUNBLEdBaHVCc0MsQ0FrdUJ2Qzs7O0FBQ0EsV0FBU2lCLDBCQUFULENBQXFDd0csR0FBckMsRUFBMENDLEtBQTFDLEVBQWlEQyxXQUFqRCxFQUE4RDNILEdBQTlELEVBQW9FO0FBQ25FLFFBQUssT0FBTzJILFdBQVAsS0FBdUIsV0FBNUIsRUFBMEM7QUFDekNBLE1BQUFBLFdBQVcsR0FBRyxJQUFkO0FBQ0E7O0FBRUQsUUFBSyxPQUFPM0gsR0FBUCxLQUFlLFdBQXBCLEVBQWtDO0FBQ2pDQSxNQUFBQSxHQUFHLEdBQUdxSCxhQUFhLEVBQW5CO0FBQ0E7O0FBRUQsUUFBTU8sRUFBRSxHQUFVLElBQUlDLE1BQUosQ0FBWSxXQUFXSixHQUFYLEdBQWlCLFdBQTdCLEVBQTBDLEdBQTFDLENBQWxCO0FBQ0EsUUFBTUssU0FBUyxHQUFHOUgsR0FBRyxDQUFDa0gsT0FBSixDQUFhLEdBQWIsTUFBdUIsQ0FBQyxDQUF4QixHQUE0QixHQUE1QixHQUFrQyxHQUFwRDtBQUNBLFFBQUlhLFlBQUo7O0FBRUEsUUFBSy9ILEdBQUcsQ0FBQ2dJLEtBQUosQ0FBV0osRUFBWCxDQUFMLEVBQXVCO0FBQ3RCRyxNQUFBQSxZQUFZLEdBQUcvSCxHQUFHLENBQUNuRCxPQUFKLENBQWErSyxFQUFiLEVBQWlCLE9BQU9ILEdBQVAsR0FBYSxHQUFiLEdBQW1CQyxLQUFuQixHQUEyQixJQUE1QyxDQUFmO0FBQ0EsS0FGRCxNQUVPO0FBQ05LLE1BQUFBLFlBQVksR0FBRy9ILEdBQUcsR0FBRzhILFNBQU4sR0FBa0JMLEdBQWxCLEdBQXdCLEdBQXhCLEdBQThCQyxLQUE3QztBQUNBOztBQUVELFFBQUtDLFdBQVcsS0FBSyxJQUFyQixFQUE0QjtBQUMzQixhQUFPdkcsT0FBTyxDQUFDQyxTQUFSLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCMEcsWUFBM0IsQ0FBUDtBQUNBLEtBRkQsTUFFTztBQUNOLGFBQU9BLFlBQVA7QUFDQTtBQUNELEdBM3ZCc0MsQ0E2dkJ2Qzs7O0FBQ0EsV0FBUzVHLDBCQUFULENBQXFDakcsU0FBckMsRUFBZ0Q4RSxHQUFoRCxFQUFzRDtBQUNyRCxRQUFLLE9BQU9BLEdBQVAsS0FBZSxXQUFwQixFQUFrQztBQUNqQ0EsTUFBQUEsR0FBRyxHQUFHcUgsYUFBYSxFQUFuQjtBQUNBOztBQUVELFFBQU1ZLFNBQVMsR0FBV3JCLFVBQVUsQ0FBRTVHLEdBQUYsQ0FBcEM7QUFDQSxRQUFNa0ksZUFBZSxHQUFLQyxNQUFNLENBQUNDLElBQVAsQ0FBYUgsU0FBYixFQUF5QnRLLE1BQW5EO0FBQ0EsUUFBTTBLLGFBQWEsR0FBT3JJLEdBQUcsQ0FBQ2tILE9BQUosQ0FBYSxHQUFiLENBQTFCO0FBQ0EsUUFBTW9CLGlCQUFpQixHQUFHdEksR0FBRyxDQUFDa0gsT0FBSixDQUFhaE0sU0FBYixDQUExQjtBQUNBLFFBQUlxTixRQUFKLEVBQWNDLFVBQWQ7O0FBRUEsUUFBS04sZUFBZSxHQUFHLENBQXZCLEVBQTJCO0FBQzFCLFVBQU9JLGlCQUFpQixHQUFHRCxhQUF0QixHQUF3QyxDQUE3QyxFQUFpRDtBQUNoREUsUUFBQUEsUUFBUSxHQUFHdkksR0FBRyxDQUFDbkQsT0FBSixDQUFhLE1BQU0zQixTQUFOLEdBQWtCLEdBQWxCLEdBQXdCK00sU0FBUyxDQUFFL00sU0FBRixDQUE5QyxFQUE2RCxFQUE3RCxDQUFYO0FBQ0EsT0FGRCxNQUVPO0FBQ05xTixRQUFBQSxRQUFRLEdBQUd2SSxHQUFHLENBQUNuRCxPQUFKLENBQWEzQixTQUFTLEdBQUcsR0FBWixHQUFrQitNLFNBQVMsQ0FBRS9NLFNBQUYsQ0FBM0IsR0FBMkMsR0FBeEQsRUFBNkQsRUFBN0QsQ0FBWDtBQUNBOztBQUVELFVBQU11TixTQUFTLEdBQUdGLFFBQVEsQ0FBQzdLLEtBQVQsQ0FBZ0IsR0FBaEIsQ0FBbEI7QUFDQThLLE1BQUFBLFVBQVUsR0FBUSxNQUFNQyxTQUFTLENBQUUsQ0FBRixDQUFqQztBQUNBLEtBVEQsTUFTTztBQUNORCxNQUFBQSxVQUFVLEdBQUd4SSxHQUFHLENBQUNuRCxPQUFKLENBQWEsTUFBTTNCLFNBQU4sR0FBa0IsR0FBbEIsR0FBd0IrTSxTQUFTLENBQUUvTSxTQUFGLENBQTlDLEVBQTZELEVBQTdELENBQWI7QUFDQTs7QUFFRCxXQUFPc04sVUFBUDtBQUNBLEdBdnhCc0MsQ0F5eEJ2Qzs7O0FBQ0EsV0FBU0UsY0FBVCxDQUF5QnhOLFNBQXpCLEVBQW9DMkYsV0FBcEMsRUFBOEU7QUFBQSxRQUE3QjhILGFBQTZCLHVFQUFiLEtBQWE7QUFBQSxRQUFOM0ksR0FBTTtBQUM3RSxRQUFNNEksY0FBYyxHQUFHLEdBQXZCO0FBRUEsUUFBSXRCLE1BQUo7QUFBQSxRQUFZdUIsVUFBWjtBQUFBLFFBQXdCQyxVQUFVLEdBQUcsS0FBckM7O0FBRUEsUUFBSyxPQUFPOUksR0FBUCxLQUFlLFdBQXBCLEVBQWtDO0FBQ2pDc0gsTUFBQUEsTUFBTSxHQUFHVixVQUFVLENBQUU1RyxHQUFGLENBQW5CO0FBQ0EsS0FGRCxNQUVPO0FBQ05zSCxNQUFBQSxNQUFNLEdBQUdWLFVBQVUsRUFBbkI7QUFDQTs7QUFFRCxRQUFLLE9BQU9VLE1BQU0sQ0FBRXBNLFNBQUYsQ0FBYixJQUE4QixXQUFuQyxFQUFpRDtBQUNoRCxVQUFNNk4sVUFBVSxHQUFRekIsTUFBTSxDQUFFcE0sU0FBRixDQUE5QjtBQUNBLFVBQU04TixlQUFlLEdBQUdELFVBQVUsQ0FBQ3JMLEtBQVgsQ0FBa0JrTCxjQUFsQixDQUF4Qjs7QUFFQSxVQUFLRyxVQUFVLENBQUNwTCxNQUFYLEdBQW9CLENBQXpCLEVBQTZCO0FBQzVCLFlBQU1zTCxLQUFLLEdBQUdyUCxDQUFDLENBQUNzUCxPQUFGLENBQVdySSxXQUFYLEVBQXdCbUksZUFBeEIsQ0FBZDs7QUFFQSxZQUFLQyxLQUFLLElBQUksQ0FBZCxFQUFrQjtBQUNqQjtBQUNBRCxVQUFBQSxlQUFlLENBQUNHLE1BQWhCLENBQXdCRixLQUF4QixFQUErQixDQUEvQjs7QUFFQSxjQUFLRCxlQUFlLENBQUNyTCxNQUFoQixLQUEyQixDQUFoQyxFQUFvQztBQUNuQ21MLFlBQUFBLFVBQVUsR0FBRyxJQUFiO0FBQ0E7QUFDRCxTQVBELE1BT087QUFDTjtBQUNBRSxVQUFBQSxlQUFlLENBQUNJLElBQWhCLENBQXNCdkksV0FBdEI7QUFDQTs7QUFFRCxZQUFLbUksZUFBZSxDQUFDckwsTUFBaEIsR0FBeUIsQ0FBOUIsRUFBa0M7QUFDakNrTCxVQUFBQSxVQUFVLEdBQUdHLGVBQWUsQ0FBQ25MLElBQWhCLENBQXNCK0ssY0FBdEIsQ0FBYjtBQUNBLFNBRkQsTUFFTztBQUNOQyxVQUFBQSxVQUFVLEdBQUdHLGVBQWI7QUFDQTtBQUNELE9BcEJELE1Bb0JPO0FBQ05ILFFBQUFBLFVBQVUsR0FBR2hJLFdBQWI7QUFDQTtBQUNELEtBM0JELE1BMkJPO0FBQ05nSSxNQUFBQSxVQUFVLEdBQUdoSSxXQUFiO0FBQ0EsS0F4QzRFLENBMEM3RTs7O0FBQ0EsUUFBSyxDQUFFaUksVUFBUCxFQUFvQjtBQUNuQjdILE1BQUFBLDBCQUEwQixDQUFFL0YsU0FBRixFQUFhMk4sVUFBYixDQUExQjtBQUNBLEtBRkQsTUFFTztBQUNOLFVBQU0zSCxLQUFLLEdBQUdDLDBCQUEwQixDQUFFakcsU0FBRixDQUF4QztBQUNBa0csTUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCSCxLQUEzQjtBQUNBOztBQUVESSxJQUFBQSxjQUFjLENBQUVxSCxhQUFGLENBQWQ7QUFDQTs7QUFFRCxXQUFTVSxZQUFULENBQXVCbk8sU0FBdkIsRUFBa0MyRixXQUFsQyxFQUFnRDtBQUMvQyxRQUFNeUcsTUFBTSxHQUFHVixVQUFVLEVBQXpCO0FBQ0EsUUFBSTFGLEtBQUo7O0FBRUEsUUFBSyxPQUFPb0csTUFBTSxDQUFFcE0sU0FBRixDQUFiLEtBQStCLFdBQS9CLElBQThDb00sTUFBTSxDQUFFcE0sU0FBRixDQUFOLEtBQXdCMkYsV0FBM0UsRUFBeUY7QUFDeEZLLE1BQUFBLEtBQUssR0FBR0MsMEJBQTBCLENBQUVqRyxTQUFGLENBQWxDO0FBQ0EsS0FGRCxNQUVPO0FBQ05nRyxNQUFBQSxLQUFLLEdBQUdELDBCQUEwQixDQUFFL0YsU0FBRixFQUFhMkYsV0FBYixFQUEwQixLQUExQixDQUFsQztBQUNBLEtBUjhDLENBVS9DOzs7QUFDQU8sSUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCSCxLQUEzQjtBQUVBSSxJQUFBQSxjQUFjO0FBQ2QsR0E3MUJzQyxDQSsxQnZDOzs7QUFDQSxNQUFLOUgsWUFBWSxDQUFDOFAsMEJBQWIsSUFBMkM5UCxZQUFZLENBQUMrUCxvQkFBN0QsRUFBb0Y7QUFDbkYsUUFBTTFFLFVBQVUsR0FBR2pMLENBQUMsQ0FBRUosWUFBWSxDQUFDb0osbUJBQWYsQ0FBcEI7QUFDQSxRQUFNRCxRQUFRLEdBQUtuSixZQUFZLENBQUMrUCxvQkFBYixHQUFvQyxJQUF2RCxDQUZtRixDQUluRjs7QUFDQSxRQUFLMUUsVUFBVSxDQUFDbEgsTUFBaEIsRUFBeUI7QUFDeEJrSCxNQUFBQSxVQUFVLENBQUMvSSxFQUFYLENBQWUsT0FBZixFQUF3QjZHLFFBQXhCLEVBQWtDLFVBQVVMLENBQVYsRUFBYztBQUMvQ0EsUUFBQUEsQ0FBQyxDQUFDakMsY0FBRjtBQUVBLFlBQU1xRixRQUFRLEdBQUc5TCxDQUFDLENBQUUsSUFBRixDQUFELENBQVVtQixJQUFWLENBQWdCLE1BQWhCLENBQWpCO0FBRUFxRyxRQUFBQSxPQUFPLENBQUNDLFNBQVIsQ0FBbUIsRUFBbkIsRUFBdUIsRUFBdkIsRUFBMkJxRSxRQUEzQjtBQUVBcEUsUUFBQUEsY0FBYztBQUNkLE9BUkQ7QUFTQTtBQUNELEdBaDNCc0MsQ0FrM0J2Qzs7O0FBQ0EsV0FBU2tJLG1CQUFULENBQThCeEwsS0FBOUIsRUFBcUM2QyxXQUFyQyxFQUFtRDtBQUNsRCxRQUFNaEcsTUFBTSxHQUFXbUQsS0FBSyxDQUFDMkMsT0FBTixDQUFlLHNCQUFmLENBQXZCO0FBQ0EsUUFBTWtGLE9BQU8sR0FBVWhMLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLFNBQWIsQ0FBdkI7QUFDQSxRQUFNME8sU0FBUyxHQUFRdFAsTUFBTSxDQUFFMEwsT0FBRixDQUE3QjtBQUNBLFFBQU0zSyxTQUFTLEdBQVF1TyxTQUFTLENBQUN2TyxTQUFqQztBQUNBLFFBQU1DLGNBQWMsR0FBR3NPLFNBQVMsQ0FBQ3RPLGNBQWpDOztBQUVBLFFBQUssQ0FBRUQsU0FBUCxFQUFtQjtBQUNsQjtBQUNBOztBQUVELFFBQUssQ0FBRTJGLFdBQVcsQ0FBQ2xELE1BQW5CLEVBQTRCO0FBQzNCLFVBQU11RCxLQUFLLEdBQUdDLDBCQUEwQixDQUFFakcsU0FBRixDQUF4QztBQUNBa0csTUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCSCxLQUEzQjtBQUVBSSxNQUFBQSxjQUFjO0FBRWQ7QUFDQTs7QUFFRCxRQUFLbkcsY0FBTCxFQUFzQjtBQUNyQnVOLE1BQUFBLGNBQWMsQ0FBRXhOLFNBQUYsRUFBYTJGLFdBQWIsQ0FBZDtBQUNBLEtBRkQsTUFFTztBQUNOd0ksTUFBQUEsWUFBWSxDQUFFbk8sU0FBRixFQUFhMkYsV0FBYixDQUFaO0FBQ0E7QUFDRDs7QUFFRCxXQUFTZixhQUFULENBQXdCRSxHQUF4QixFQUE4QjtBQUM3QixRQUFLLENBQUVBLEdBQVAsRUFBYTtBQUNaO0FBQ0E7O0FBRUR5RixJQUFBQSxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLElBQWhCLEdBQXVCM0YsR0FBdkIsQ0FMNkIsQ0FPN0I7QUFDQTtBQUNBLEdBdjVCc0MsQ0F5NUJ2Qzs7O0FBQ0F2RixFQUFBQSxnQkFBZ0IsQ0FBQ3FCLEVBQWpCLENBQ0MsUUFERCxFQUVDLHlFQUZELEVBR0MsVUFBVXNFLEtBQVYsRUFBa0I7QUFDakJBLElBQUFBLEtBQUssQ0FBQ0MsY0FBTjtBQUVBLFFBQU1yQyxLQUFLLEdBQUdwRSxDQUFDLENBQUUsSUFBRixDQUFmO0FBRUFrRyxJQUFBQSxhQUFhLENBQUU5QixLQUFLLENBQUMrQixJQUFOLENBQVksS0FBWixDQUFGLENBQWI7QUFDQSxHQVRGLEVBMTVCdUMsQ0FzNkJ2Qzs7QUFDQXRGLEVBQUFBLGdCQUFnQixDQUFDcUIsRUFBakIsQ0FBcUIsT0FBckIsRUFBOEIseUNBQTlCLEVBQXlFLFVBQVVzRSxLQUFWLEVBQWtCO0FBQzFGQSxJQUFBQSxLQUFLLENBQUNDLGNBQU47QUFFQSxRQUFNckMsS0FBSyxHQUFHcEUsQ0FBQyxDQUFFLElBQUYsQ0FBZjtBQUVBa0csSUFBQUEsYUFBYSxDQUFFOUIsS0FBSyxDQUFDK0IsSUFBTixDQUFZLEtBQVosQ0FBRixDQUFiO0FBQ0EsR0FORCxFQXY2QnVDLENBKzZCdkM7O0FBQ0F0RixFQUFBQSxnQkFBZ0IsQ0FBQ3FCLEVBQWpCLENBQXFCLFFBQXJCLEVBQStCLFFBQS9CLEVBQXlDLFVBQVVzRSxLQUFWLEVBQWtCO0FBQzFEQSxJQUFBQSxLQUFLLENBQUNDLGNBQU47QUFFQSxRQUFNcUosT0FBTyxHQUFVOVAsQ0FBQyxDQUFFLElBQUYsQ0FBeEI7QUFDQSxRQUFNMkYsTUFBTSxHQUFXbUssT0FBTyxDQUFDakssR0FBUixFQUF2QjtBQUNBLFFBQU1rSyxTQUFTLEdBQVFELE9BQU8sQ0FBQzNKLElBQVIsQ0FBYyxLQUFkLENBQXZCO0FBQ0EsUUFBTTZKLGNBQWMsR0FBR0YsT0FBTyxDQUFDM0osSUFBUixDQUFjLGtCQUFkLENBQXZCO0FBQ0EsUUFBSUMsR0FBSjs7QUFFQSxRQUFLVCxNQUFNLENBQUM1QixNQUFaLEVBQXFCO0FBQ3BCcUMsTUFBQUEsR0FBRyxHQUFHMkosU0FBUyxDQUFDOU0sT0FBVixDQUFtQixJQUFuQixFQUF5QjBDLE1BQU0sQ0FBQ3NLLFFBQVAsRUFBekIsQ0FBTjtBQUNBLEtBRkQsTUFFTztBQUNON0osTUFBQUEsR0FBRyxHQUFHNEosY0FBTjtBQUNBOztBQUVEOUosSUFBQUEsYUFBYSxDQUFFRSxHQUFGLENBQWI7QUFDQSxHQWhCRDtBQWtCQTtBQUNEO0FBQ0E7O0FBQ0MsTUFBTThKLG9CQUFvQixHQUFHLGdFQUE3QjtBQUVBcFAsRUFBQUEsd0JBQXdCLENBQUNvQixFQUF6QixDQUE2QixPQUE3QixFQUFzQ2dPLG9CQUF0QyxFQUE0RCxVQUFVMUosS0FBVixFQUFrQjtBQUM3RUEsSUFBQUEsS0FBSyxDQUFDQyxjQUFOO0FBRUEsUUFBTXJDLEtBQUssR0FBR3BFLENBQUMsQ0FBRSxJQUFGLENBQWYsQ0FINkUsQ0FLN0U7O0FBQ0FxRyxJQUFBQSxZQUFZLENBQUVqQyxLQUFLLENBQUMrQixJQUFOLENBQVksT0FBWixDQUFGLENBQVo7QUFFQS9CLElBQUFBLEtBQUssQ0FBQytCLElBQU4sQ0FBWSxPQUFaLEVBQXFCRyxVQUFVLENBQUUsWUFBVztBQUMzQ2xDLE1BQUFBLEtBQUssQ0FBQ21DLFVBQU4sQ0FBa0IsT0FBbEI7QUFFQSxVQUFNNEosWUFBWSxHQUFJL0wsS0FBSyxDQUFDMkMsT0FBTixDQUFlLHFCQUFmLENBQXRCO0FBQ0EsVUFBTXpGLFNBQVMsR0FBTzZPLFlBQVksQ0FBQ2hQLElBQWIsQ0FBbUIsaUJBQW5CLENBQXRCO0FBQ0EsVUFBTXNELGFBQWEsR0FBRzBMLFlBQVksQ0FBQ2hQLElBQWIsQ0FBbUIsc0JBQW5CLENBQXRCO0FBQ0EsVUFBTXdELGFBQWEsR0FBR3dMLFlBQVksQ0FBQ2hQLElBQWIsQ0FBbUIsc0JBQW5CLENBQXRCO0FBQ0EsVUFBSTZELFFBQVEsR0FBVW1MLFlBQVksQ0FBQzlPLElBQWIsQ0FBbUIsWUFBbkIsRUFBa0N3RSxHQUFsQyxFQUF0QjtBQUNBLFVBQUlaLFFBQVEsR0FBVWtMLFlBQVksQ0FBQzlPLElBQWIsQ0FBbUIsWUFBbkIsRUFBa0N3RSxHQUFsQyxFQUF0QixDQVIyQyxDQVUzQzs7QUFDQSxVQUFLLENBQUViLFFBQVEsQ0FBQ2pCLE1BQWhCLEVBQXlCO0FBQ3hCaUIsUUFBQUEsUUFBUSxHQUFHUCxhQUFYO0FBRUEwTCxRQUFBQSxZQUFZLENBQUM5TyxJQUFiLENBQW1CLFlBQW5CLEVBQWtDd0UsR0FBbEMsQ0FBdUNiLFFBQXZDO0FBQ0EsT0FmMEMsQ0FpQjNDOzs7QUFDQSxVQUFLLENBQUVDLFFBQVEsQ0FBQ2xCLE1BQWhCLEVBQXlCO0FBQ3hCa0IsUUFBQUEsUUFBUSxHQUFHTixhQUFYO0FBRUF3TCxRQUFBQSxZQUFZLENBQUM5TyxJQUFiLENBQW1CLFlBQW5CLEVBQWtDd0UsR0FBbEMsQ0FBdUNaLFFBQXZDO0FBQ0EsT0F0QjBDLENBd0IzQzs7O0FBQ0EsVUFBS1AsVUFBVSxDQUFFTSxRQUFGLENBQVYsR0FBeUJOLFVBQVUsQ0FBRUQsYUFBRixDQUF4QyxFQUE0RDtBQUMzRE8sUUFBQUEsUUFBUSxHQUFHUCxhQUFYO0FBRUEwTCxRQUFBQSxZQUFZLENBQUM5TyxJQUFiLENBQW1CLFlBQW5CLEVBQWtDd0UsR0FBbEMsQ0FBdUNiLFFBQXZDO0FBQ0EsT0E3QjBDLENBK0IzQzs7O0FBQ0EsVUFBS04sVUFBVSxDQUFFTSxRQUFGLENBQVYsR0FBeUJOLFVBQVUsQ0FBRUMsYUFBRixDQUF4QyxFQUE0RDtBQUMzREssUUFBQUEsUUFBUSxHQUFHTCxhQUFYO0FBRUF3TCxRQUFBQSxZQUFZLENBQUM5TyxJQUFiLENBQW1CLFlBQW5CLEVBQWtDd0UsR0FBbEMsQ0FBdUNiLFFBQXZDO0FBQ0EsT0FwQzBDLENBc0MzQzs7O0FBQ0EsVUFBS04sVUFBVSxDQUFFTyxRQUFGLENBQVYsR0FBeUJQLFVBQVUsQ0FBRUMsYUFBRixDQUF4QyxFQUE0RDtBQUMzRE0sUUFBQUEsUUFBUSxHQUFHTixhQUFYO0FBRUF3TCxRQUFBQSxZQUFZLENBQUM5TyxJQUFiLENBQW1CLFlBQW5CLEVBQWtDd0UsR0FBbEMsQ0FBdUNaLFFBQXZDO0FBQ0EsT0EzQzBDLENBNkMzQzs7O0FBQ0EsVUFBS1AsVUFBVSxDQUFFTSxRQUFGLENBQVYsR0FBeUJOLFVBQVUsQ0FBRU8sUUFBRixDQUF4QyxFQUF1RDtBQUN0REEsUUFBQUEsUUFBUSxHQUFHRCxRQUFYO0FBRUFtTCxRQUFBQSxZQUFZLENBQUM5TyxJQUFiLENBQW1CLFlBQW5CLEVBQWtDd0UsR0FBbEMsQ0FBdUNaLFFBQXZDO0FBQ0E7O0FBRUQsVUFBS0QsUUFBUSxLQUFLUCxhQUFiLElBQThCUSxRQUFRLEtBQUtOLGFBQWhELEVBQWdFO0FBQy9ELFlBQU0yQyxLQUFLLEdBQUdDLDBCQUEwQixDQUFFakcsU0FBRixDQUF4QztBQUNBa0csUUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCSCxLQUEzQjtBQUNBLE9BSEQsTUFHTztBQUNOLFlBQU04SSxlQUFlLEdBQUdwTCxRQUFRLEdBQUc5RSxvQkFBWCxHQUFrQytFLFFBQTFEO0FBQ0FvQyxRQUFBQSwwQkFBMEIsQ0FBRS9GLFNBQUYsRUFBYThPLGVBQWIsQ0FBMUI7QUFDQTs7QUFFRDFJLE1BQUFBLGNBQWM7QUFDZCxLQTdEOEIsRUE2RDVCcEgsS0E3RDRCLENBQS9CO0FBOERBLEdBdEVELEVBdjhCdUMsQ0ErZ0N2Qzs7QUFDQU8sRUFBQUEsZ0JBQWdCLENBQUNxQixFQUFqQixDQUFxQixPQUFyQixFQUE4Qiw0Q0FBOUIsRUFBNEUsVUFBVXNFLEtBQVYsRUFBa0I7QUFDN0ZBLElBQUFBLEtBQUssQ0FBQ0MsY0FBTjtBQUVBLFFBQU1yQyxLQUFLLEdBQVNwRSxDQUFDLENBQUUsSUFBRixDQUFyQjtBQUNBLFFBQU1zQixTQUFTLEdBQUs4QyxLQUFLLENBQUNqRCxJQUFOLENBQVksaUJBQVosQ0FBcEI7QUFDQSxRQUFNOEYsV0FBVyxHQUFHN0MsS0FBSyxDQUFDakQsSUFBTixDQUFZLFlBQVosQ0FBcEI7QUFFQTJOLElBQUFBLGNBQWMsQ0FBRXhOLFNBQUYsRUFBYTJGLFdBQWIsRUFBMEIsSUFBMUIsQ0FBZDtBQUNBLEdBUkQ7O0FBVUEsV0FBU29KLFlBQVQsQ0FBdUJDLE9BQXZCLEVBQWlDO0FBQ2hDLFFBQU1DLFdBQVcsR0FBR0QsT0FBTyxDQUFDblAsSUFBUixDQUFjLFdBQWQsQ0FBcEI7O0FBRUEsUUFBSyxDQUFFb1AsV0FBUCxFQUFxQjtBQUNwQjtBQUNBOztBQUVELFFBQU1DLFVBQVUsR0FBR0QsV0FBVyxDQUFDek0sS0FBWixDQUFtQixHQUFuQixDQUFuQjs7QUFFQSxRQUFJd0QsS0FBSyxHQUFHLEVBQVo7QUFFQXRILElBQUFBLENBQUMsQ0FBQ2dCLElBQUYsQ0FBUXdQLFVBQVIsRUFBb0IsVUFBVWhELENBQVYsRUFBYWxNLFNBQWIsRUFBeUI7QUFDNUMsVUFBS2dHLEtBQUwsRUFBYTtBQUNaQSxRQUFBQSxLQUFLLEdBQUdDLDBCQUEwQixDQUFFakcsU0FBRixFQUFhZ0csS0FBYixDQUFsQztBQUNBLE9BRkQsTUFFTztBQUNOQSxRQUFBQSxLQUFLLEdBQUdDLDBCQUEwQixDQUFFakcsU0FBRixDQUFsQztBQUNBO0FBQ0QsS0FORCxFQVhnQyxDQW1CaEM7QUFDQTs7QUFDQSxRQUFLLENBQUVnRyxLQUFQLEVBQWU7QUFDZCxVQUFNbUosT0FBTyxHQUFHNUUsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxJQUFoQztBQUNBLFVBQU0yRSxNQUFNLEdBQUlELE9BQU8sQ0FBQzNNLEtBQVIsQ0FBZSxHQUFmLENBQWhCO0FBRUF3RCxNQUFBQSxLQUFLLEdBQUdvSixNQUFNLENBQUUsQ0FBRixDQUFkO0FBQ0E7O0FBRURsSixJQUFBQSxPQUFPLENBQUNDLFNBQVIsQ0FBbUIsRUFBbkIsRUFBdUIsRUFBdkIsRUFBMkJILEtBQTNCO0FBRUFJLElBQUFBLGNBQWMsQ0FBRSxJQUFGLENBQWQ7QUFDQSxHQXpqQ3NDLENBMmpDdkM7OztBQUNBekgsRUFBQUEsS0FBSyxDQUFDaUMsRUFBTixDQUFVLHFCQUFWLEVBQWlDLFVBQVV3RyxDQUFWLEVBQWE0SCxPQUFiLEVBQXVCO0FBQ3ZERCxJQUFBQSxZQUFZLENBQUVDLE9BQUYsQ0FBWjtBQUNBLEdBRkQ7QUFJQXJRLEVBQUFBLEtBQUssQ0FBQ2lDLEVBQU4sQ0FBVSxPQUFWLEVBQW1CLDBCQUFuQixFQUErQyxZQUFXO0FBQ3pELFFBQU1vTyxPQUFPLEdBQUd0USxDQUFDLENBQUUsSUFBRixDQUFqQjtBQUVBcVEsSUFBQUEsWUFBWSxDQUFFQyxPQUFGLENBQVo7QUFDQSxHQUpEO0FBTUF6UCxFQUFBQSxnQkFBZ0IsQ0FBQ3FCLEVBQWpCLENBQXFCLE9BQXJCLEVBQThCLDBCQUE5QixFQUEwRCxVQUFVc0UsS0FBVixFQUFrQjtBQUMzRUEsSUFBQUEsS0FBSyxDQUFDQyxjQUFOO0FBRUEsUUFBTTZKLE9BQU8sR0FBR3RRLENBQUMsQ0FBRSxJQUFGLENBQWpCO0FBRUFDLElBQUFBLEtBQUssQ0FBQzZGLE9BQU4sQ0FBZSxxQkFBZixFQUFzQyxDQUFFd0ssT0FBRixDQUF0QztBQUNBLEdBTkQ7QUFRQTFQLEVBQUFBLG1CQUFtQixDQUFDc0IsRUFBcEIsQ0FBd0Isb0JBQXhCLEVBQThDLFlBQVc7QUFDeEQsUUFBTWpCLE1BQU0sR0FBTWpCLENBQUMsQ0FBRSxJQUFGLENBQW5CO0FBQ0EsUUFBTWlNLE9BQU8sR0FBS2hMLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLFNBQWIsQ0FBbEI7QUFDQSxRQUFNME8sU0FBUyxHQUFHdFAsTUFBTSxDQUFFMEwsT0FBRixDQUF4QjtBQUNBLFFBQU0zSyxTQUFTLEdBQUd1TyxTQUFTLENBQUN2TyxTQUE1QjtBQUVBLFFBQU1nRyxLQUFLLEdBQUdDLDBCQUEwQixDQUFFakcsU0FBRixDQUF4QztBQUNBa0csSUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCSCxLQUEzQjtBQUVBSSxJQUFBQSxjQUFjLENBQUUsSUFBRixDQUFkO0FBQ0EsR0FWRCxFQTlrQ3VDLENBMGxDdkM7O0FBQ0EsTUFBSzFILENBQUMsQ0FBRUosWUFBWSxDQUFDb0osbUJBQWYsQ0FBRCxDQUFzQ2pGLE1BQXRDLElBQWdEL0QsQ0FBQyxDQUFFSixZQUFZLENBQUNtTCxtQkFBZixDQUFELENBQXNDaEgsTUFBM0YsRUFBb0c7QUFDbkcsUUFBS25FLFlBQVksQ0FBQytRLHVDQUFsQixFQUE0RDtBQUMzRDNRLE1BQUFBLENBQUMsQ0FBRTZMLE1BQUYsQ0FBRCxDQUFZK0UsSUFBWixDQUFrQixVQUFsQixFQUE4QixZQUFXO0FBQ3hDbEosUUFBQUEsY0FBYyxDQUFFLElBQUYsQ0FBZDtBQUNBLE9BRkQ7QUFHQTtBQUNELEdBam1Dc0MsQ0FtbUN2Qzs7O0FBQ0F6SCxFQUFBQSxLQUFLLENBQUNpQyxFQUFOLENBQVUsMkJBQVYsRUFBdUMsVUFBVXdHLENBQVYsRUFBYWtELGFBQWIsRUFBNkI7QUFDbkVsRSxJQUFBQSxjQUFjLENBQUVrRSxhQUFGLENBQWQ7QUFDQSxHQUZELEVBcG1DdUMsQ0F3bUN2Qzs7QUFDQTNMLEVBQUFBLEtBQUssQ0FBQ2lDLEVBQU4sQ0FBVSxxQkFBVixFQUFpQyxZQUFXO0FBQzNDVixJQUFBQSxVQUFVO0FBQ1ZTLElBQUFBLHNCQUFzQjtBQUN0QmlDLElBQUFBLGNBQWM7QUFDZHlELElBQUFBLGNBQWM7QUFDZCxHQUxEO0FBT0E7QUFDRDtBQUNBOztBQUNDMUgsRUFBQUEsS0FBSyxDQUFDaUMsRUFBTixDQUFVLCtCQUFWLEVBQTJDLFlBQVc7QUFDckQ7QUFDQWxDLElBQUFBLENBQUMsQ0FBRUYsUUFBRixDQUFELENBQWNnRyxPQUFkLENBQXVCLGlDQUF2QjtBQUNBLEdBSEQ7QUFJQSxDQXZuQ0QiLCJmaWxlIjoid2MtYWpheC1wcm9kdWN0LWZpbHRlci1wdWJsaWMtc2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIGZyb250ZW5kIGZpbHRlciBmb3JtLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL3B1YmxpYy9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5jb25zdCB3Y2FwZl9wYXJhbXMgPSB3Y2FwZl9wYXJhbXMgfHwge1xuXHQnZmlsdGVyX2lucHV0X2RlbGF5JzogJycsXG5cdCdjaG9zZW5fbGliX3NlYXJjaF90aHJlc2hvbGQnOiAnJyxcblx0J3ByZXNlcnZlX2hpZXJhcmNoeV9hY2NvcmRpb25fc3RhdGUnOiAnJyxcblx0J2VuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24nOiAnJyxcblx0J2hpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX3NwZWVkJzogJycsXG5cdCdoaWVyYXJjaHlfYWNjb3JkaW9uX2FuaW1hdGlvbl9lYXNpbmcnOiAnJyxcblx0J2xvYWRpbmdfb3ZlcmxheV9vcHRpb25zJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX3NwZWVkJzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX2Vhc2luZyc6ICcnLFxuXHQnaXNfbW9iaWxlJzogJycsXG5cdCdkaXNhYmxlX2lucHV0c193aGlsZV9mZXRjaGluZ19yZXN1bHRzJzogJycsXG5cdCdhcHBseV9maWx0ZXJzX29uX2Jyb3dzZXJfaGlzdG9yeV9jaGFuZ2UnOiAnJyxcblx0J3Nob3BfbG9vcF9jb250YWluZXInOiAnJyxcblx0J25vdF9mb3VuZF9jb250YWluZXInOiAnJyxcblx0J2VuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4JzogJycsXG5cdCdwYWdpbmF0aW9uX2NvbnRhaW5lcic6ICcnLFxuXHQnc29ydGluZ19jb250cm9sJzogJycsXG5cdCdhdHRhY2hfY2hvc2VuX29uX3NvcnRpbmcnOiAnJyxcblx0J2xvYWRpbmdfYW5pbWF0aW9uJzogJycsXG5cdCdzY3JvbGxfd2luZG93JzogJycsXG5cdCdzY3JvbGxfd2luZG93X2Zvcic6ICcnLFxuXHQnc2Nyb2xsX3dpbmRvd193aGVuJzogJycsXG5cdCdzY3JvbGxfd2luZG93X2N1c3RvbV9lbGVtZW50JzogJycsXG5cdCdzY3JvbGxfdG9fdG9wX29mZnNldCc6ICcnLFxuXHQnZm9yX3ByZXZpZXcnOiAnJyxcbn07XG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgJGJvZHkgPSAkKCAnYm9keScgKTtcblxuXHRjb25zdCByYW5nZVZhbHVlc1NlcGFyYXRvciA9ICd+JztcblxuXHRjb25zdCBfZGVsYXkgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLmZpbHRlcl9pbnB1dF9kZWxheSApO1xuXHRjb25zdCBkZWxheSAgPSBfZGVsYXkgPj0gMCA/IF9kZWxheSA6IDgwMDtcblxuXHQvLyBTdG9yZSBmaWVsZHMnIGlkIGFuZCBmaWx0ZXIgaW5mb3JtYXRpb24uXG5cdGNvbnN0IGZpZWxkcyA9IHt9O1xuXG5cdGNvbnN0IHdjYXBmU2luZ2xlRmlsdGVyU2VsZWN0b3IgICAgICA9ICcud2NhcGYtc2luZ2xlLWZpbHRlcic7XG5cdGNvbnN0IHdjYXBmTmF2RmlsdGVyU2VsZWN0b3IgICAgICAgICA9ICcud2NhcGYtbmF2LWZpbHRlcic7XG5cdGNvbnN0IHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJTZWxlY3RvciA9ICcud2NhcGYtbnVtYmVyLXJhbmdlLWZpbHRlcic7XG5cdGNvbnN0IHdjYXBmRGF0ZUZpbHRlclNlbGVjdG9yICAgICAgICA9ICcud2NhcGYtZGF0ZS1yYW5nZS1maWx0ZXInO1xuXG5cdGNvbnN0ICR3Y2FwZlNpbmdsZUZpbHRlcnMgICAgICA9ICQoIHdjYXBmU2luZ2xlRmlsdGVyU2VsZWN0b3IgKTtcblx0Y29uc3QgJHdjYXBmTmF2RmlsdGVycyAgICAgICAgID0gJCggd2NhcGZOYXZGaWx0ZXJTZWxlY3RvciApO1xuXHRjb25zdCAkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMgPSAkKCB3Y2FwZk51bWJlclJhbmdlRmlsdGVyU2VsZWN0b3IgKTtcblx0Y29uc3QgJHdjYXBmRGF0ZUZpbHRlcnMgICAgICAgID0gJCggd2NhcGZEYXRlRmlsdGVyU2VsZWN0b3IgKTtcblxuXHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGlkICAgICAgICAgICAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdGNvbnN0ICR3cmFwcGVyICAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZmllbGQtaW5uZXIgPiBkaXYnICk7XG5cdFx0Y29uc3QgZmlsdGVyS2V5ICAgICAgPSAkd3JhcHBlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdGNvbnN0IG11bHRpcGxlRmlsdGVyID0gcGFyc2VJbnQoICR3cmFwcGVyLmF0dHIoICdkYXRhLW11bHRpcGxlLWZpbHRlcicgKSApO1xuXG5cdFx0ZmllbGRzWyBpZCBdID0ge1xuXHRcdFx0ZmlsdGVyS2V5OiBmaWx0ZXJLZXksXG5cdFx0XHRtdWx0aXBsZUZpbHRlcjogbXVsdGlwbGVGaWx0ZXJcblx0XHR9O1xuXHR9ICk7XG5cblx0Ly8gSW5pdGlhbGl6ZSBqUXVlcnkgY2hvc2VuIGxpYnJhcnkuXG5cdGZ1bmN0aW9uIGluaXRDaG9zZW4oKSB7XG5cdFx0aWYgKCAhIGpRdWVyeSgpLmNob3NlbiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgJHJvb3Q7XG5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5mb3JfcHJldmlldyApIHtcblx0XHRcdCRyb290ID0gJCggd2NhcGZOYXZGaWx0ZXJTZWxlY3RvciApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkcm9vdCA9ICR3Y2FwZk5hdkZpbHRlcnM7XG5cdFx0fVxuXG5cdFx0JHJvb3QuZmluZCggJy53Y2FwZi1jaG9zZW4tc2VsZWN0JyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgICA9ICQoIHRoaXMgKTtcblx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7fTtcblxuXHRcdFx0Y29uc3Qgbm9SZXN1bHRzTWVzc2FnZSA9ICR0aGlzLmF0dHIoICdkYXRhLW5vLXJlc3VsdHMtbWVzc2FnZScgKTtcblxuXHRcdFx0aWYgKCBub1Jlc3VsdHNNZXNzYWdlICkge1xuXHRcdFx0XHRvcHRpb25zWyAnbm9fcmVzdWx0c190ZXh0JyBdID0gbm9SZXN1bHRzTWVzc2FnZTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc2VhcmNoVGhyZXNob2xkID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5jaG9zZW5fbGliX3NlYXJjaF90aHJlc2hvbGQgKTtcblxuXHRcdFx0aWYgKCBzZWFyY2hUaHJlc2hvbGQgKSB7XG5cdFx0XHRcdG9wdGlvbnNbICdkaXNhYmxlX3NlYXJjaF90aHJlc2hvbGQnIF0gPSBzZWFyY2hUaHJlc2hvbGQ7XG5cdFx0XHR9XG5cblx0XHRcdCR0aGlzLmNob3Nlbiggb3B0aW9ucyApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGluaXRDaG9zZW4oKTtcblxuXHQvLyBJbml0aWFsaXplIGhpZXJhcmNoeSBhY2NvcmRpb24uXG5cdGZ1bmN0aW9uIGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKSB7XG5cdFx0bGV0ICRyb290O1xuXG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZm9yX3ByZXZpZXcgKSB7XG5cdFx0XHQkcm9vdCA9ICQoIHdjYXBmTmF2RmlsdGVyU2VsZWN0b3IgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHJvb3QgPSAkd2NhcGZOYXZGaWx0ZXJzO1xuXHRcdH1cblxuXHRcdCRyb290LmZpbmQoICcuaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnICkub24oICdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgID0gJCggdGhpcyApO1xuXHRcdFx0Y29uc3QgJGNoaWxkID0gJHRoaXMucGFyZW50KCAnbGknICkuY2hpbGRyZW4oICd1bCcgKTtcblxuXHRcdFx0JHRoaXMudG9nZ2xlQ2xhc3MoICdhY3RpdmUnICk7XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9hbmltYXRpb25fZm9yX2hpZXJhcmNoeV9hY2NvcmRpb24gKSB7XG5cdFx0XHRcdCRjaGlsZC5zbGlkZVRvZ2dsZShcblx0XHRcdFx0XHR3Y2FwZl9wYXJhbXMuaGllcmFyY2h5X2FjY29yZGlvbl9hbmltYXRpb25fc3BlZWQsXG5cdFx0XHRcdFx0d2NhcGZfcGFyYW1zLmhpZXJhcmNoeV9hY2NvcmRpb25fYW5pbWF0aW9uX2Vhc2luZ1xuXHRcdFx0XHQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGNoaWxkLnRvZ2dsZSgpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKTtcblxuXHQvKipcblx0ICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzQxNDE4MTNcblx0ICpcblx0ICogQHBhcmFtIG51bWJlclxuXHQgKiBAcGFyYW0gZGVjaW1hbHNcblx0ICogQHBhcmFtIGRlY19wb2ludFxuXHQgKiBAcGFyYW0gdGhvdXNhbmRzX3NlcFxuXHQgKlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfVxuXHQgKi9cblx0ZnVuY3Rpb24gbnVtYmVyX2Zvcm1hdCggbnVtYmVyLCBkZWNpbWFscywgZGVjX3BvaW50LCB0aG91c2FuZHNfc2VwICkge1xuXHRcdC8vIFN0cmlwIGFsbCBjaGFyYWN0ZXJzIGJ1dCBudW1lcmljYWwgb25lcy5cblx0XHRudW1iZXIgPSAoIG51bWJlciArICcnICkucmVwbGFjZSggL1teXFxkK1xcLUVlLl0vZywgJycgKTtcblxuXHRcdGNvbnN0IG4gICAgPSAhIGlzRmluaXRlKCArbnVtYmVyICkgPyAwIDogK251bWJlcjtcblx0XHRjb25zdCBwcmVjID0gISBpc0Zpbml0ZSggK2RlY2ltYWxzICkgPyAwIDogTWF0aC5hYnMoIGRlY2ltYWxzICk7XG5cdFx0Y29uc3Qgc2VwICA9ICggdHlwZW9mIHRob3VzYW5kc19zZXAgPT09ICd1bmRlZmluZWQnICkgPyAnLCcgOiB0aG91c2FuZHNfc2VwO1xuXHRcdGNvbnN0IGRlYyAgPSAoIHR5cGVvZiBkZWNfcG9pbnQgPT09ICd1bmRlZmluZWQnICkgPyAnLicgOiBkZWNfcG9pbnQ7XG5cblx0XHRsZXQgcztcblxuXHRcdGNvbnN0IHRvRml4ZWRGaXggPSBmdW5jdGlvbiggbiwgcHJlYyApIHtcblx0XHRcdGNvbnN0IGsgPSBNYXRoLnBvdyggMTAsIHByZWMgKTtcblx0XHRcdHJldHVybiAnJyArIE1hdGgucm91bmQoIG4gKiBrICkgLyBrO1xuXHRcdH07XG5cblx0XHQvLyBGaXggZm9yIElFIHBhcnNlRmxvYXQoMC41NSkudG9GaXhlZCgwKSA9IDA7XG5cdFx0cyA9ICggcHJlYyA/IHRvRml4ZWRGaXgoIG4sIHByZWMgKSA6ICcnICsgTWF0aC5yb3VuZCggbiApICkuc3BsaXQoICcuJyApO1xuXG5cdFx0aWYgKCBzWyAwIF0ubGVuZ3RoID4gMyApIHtcblx0XHRcdHNbIDAgXSA9IHNbIDAgXS5yZXBsYWNlKCAvXFxCKD89KD86XFxkezN9KSsoPyFcXGQpKS9nLCBzZXAgKTtcblx0XHR9XG5cblx0XHRpZiAoICggc1sgMSBdIHx8ICcnICkubGVuZ3RoIDwgcHJlYyApIHtcblx0XHRcdHNbIDEgXSA9IHNbIDEgXSB8fCAnJztcblx0XHRcdHNbIDEgXSArPSBuZXcgQXJyYXkoIHByZWMgLSBzWyAxIF0ubGVuZ3RoICsgMSApLmpvaW4oICcwJyApO1xuXHRcdH1cblxuXHRcdHJldHVybiBzLmpvaW4oIGRlYyApO1xuXHR9XG5cblx0Ly8gSW5pdGlhbGl6ZSBub1VJU2xpZGVyLlxuXHRmdW5jdGlvbiBpbml0Tm9VSVNsaWRlcigpIHtcblx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgJHJvb3Q7XG5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5mb3JfcHJldmlldyApIHtcblx0XHRcdCRyb290ID0gJCggd2NhcGZOdW1iZXJSYW5nZUZpbHRlclNlbGVjdG9yICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRyb290ID0gJHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzO1xuXHRcdH1cblxuXHRcdCRyb290LmZpbmQoICcud2NhcGYtcmFuZ2Utc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdGNvbnN0IGZpbHRlcktleSA9ICRpdGVtLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0XHRjb25zdCAkc2xpZGVyICAgPSAkaXRlbS5maW5kKCAnLndjYXBmLW5vdWktc2xpZGVyJyApO1xuXG5cdFx0XHQvLyBJZiBzbGlkZXIgaXMgYWxyZWFkeSBpbml0aWFsaXplZCB0aGVuIGRvbid0IHJlaW5pdGlhbGl6ZSBhZ2Fpbi5cblx0XHRcdGlmICggJHNsaWRlci5oYXNDbGFzcyggJ3djYXBmLW5vdWktdGFyZ2V0JyApICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHNsaWRlcklkICAgICAgICAgID0gJHNsaWRlci5hdHRyKCAnaWQnICk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VmFsdWVzQXMgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRpc3BsYXktdmFsdWVzLWFzJyApO1xuXHRcdFx0Y29uc3QgcmFuZ2VNaW5WYWx1ZSAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1yYW5nZS1taW4tdmFsdWUnICkgKTtcblx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRjb25zdCBzdGVwICAgICAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXN0ZXAnICkgKTtcblx0XHRcdGNvbnN0IGRlY2ltYWxQbGFjZXMgICAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1wbGFjZXMnICk7XG5cdFx0XHRjb25zdCB0aG91c2FuZFNlcGFyYXRvciA9ICRpdGVtLmF0dHIoICdkYXRhLXRob3VzYW5kLXNlcGFyYXRvcicgKTtcblx0XHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1zZXBhcmF0b3InICk7XG5cdFx0XHRjb25zdCBtaW5WYWx1ZSAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0Y29uc3QgbWF4VmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdGNvbnN0ICRtaW5WYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5taW4tdmFsdWUnICk7XG5cdFx0XHRjb25zdCAkbWF4VmFsdWUgICAgICAgICA9ICRpdGVtLmZpbmQoICcubWF4LXZhbHVlJyApO1xuXG5cdFx0XHRjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggc2xpZGVySWQgKTtcblxuXHRcdFx0bm9VaVNsaWRlci5jcmVhdGUoIHNsaWRlciwge1xuXHRcdFx0XHRzdGFydDogWyBtaW5WYWx1ZSwgbWF4VmFsdWUgXSxcblx0XHRcdFx0c3RlcCxcblx0XHRcdFx0Y29ubmVjdDogdHJ1ZSxcblx0XHRcdFx0Y3NzUHJlZml4OiAnd2NhcGYtbm91aS0nLFxuXHRcdFx0XHRyYW5nZToge1xuXHRcdFx0XHRcdCdtaW4nOiByYW5nZU1pblZhbHVlLFxuXHRcdFx0XHRcdCdtYXgnOiByYW5nZU1heFZhbHVlLFxuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAndXBkYXRlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0Y29uc3QgbWluVmFsdWUgPSBudW1iZXJfZm9ybWF0KCB2YWx1ZXNbIDAgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSBudW1iZXJfZm9ybWF0KCB2YWx1ZXNbIDEgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblxuXHRcdFx0XHRpZiAoICdwbGFpbl90ZXh0JyA9PT0gZGlzcGxheVZhbHVlc0FzICkge1xuXHRcdFx0XHRcdCRtaW5WYWx1ZS5odG1sKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdCRtYXhWYWx1ZS5odG1sKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRtaW5WYWx1ZS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0JG1heFZhbHVlLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1ub3Vpc2xpZGVyLXVwZGF0ZScsIFsgJGl0ZW0sIHZhbHVlcyBdICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGZ1bmN0aW9uIGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApIHtcblx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZm9yX3ByZXZpZXcgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgbWluVmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDAgXSApO1xuXHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMSBdICk7XG5cblx0XHRcdFx0Y29uc29sZS5sb2coICdtaW5WYWx1ZScsIG1pblZhbHVlLCAkaXRlbSApO1xuXHRcdFx0XHRjb25zb2xlLmxvZyggJ21heFZhbHVlJywgbWF4VmFsdWUsICRpdGVtICk7XG5cblx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHQvLyBSZW1vdmUgcmFuZ2UgZmlsdGVyLlxuXHRcdFx0XHRcdHJlcXVlc3RGaWx0ZXIoICRpdGVtLmRhdGEoICdjbGVhci1maWx0ZXItdXJsJyApICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gQWRkIHJhbmdlIGZpbHRlci5cblx0XHRcdFx0XHRjb25zdCB1cmwgPSAkaXRlbS5kYXRhKCAndXJsJyApLnJlcGxhY2UoICclMXMnLCBtaW5WYWx1ZSApLnJlcGxhY2UoICclMnMnLCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdHJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGl0ZW0uZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICk7XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JG1pblZhbHVlLm9uKCAnaW5wdXQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG1pblZhbHVlLCBudWxsIF0gKTtcblxuXHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0JG1heFZhbHVlLm9uKCAnaW5wdXQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGlucHV0LnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG51bGwsIG1heFZhbHVlIF0gKTtcblxuXHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHNsaWRlci5ub1VpU2xpZGVyLmdldCgpICk7XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cblxuXHRpbml0Tm9VSVNsaWRlcigpO1xuXG5cdGZ1bmN0aW9uIGZpbHRlckJ5RGF0ZSggJGlucHV0ICkge1xuXHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICR3Y2FwZkRhdGVGaWx0ZXIgPSAkaW5wdXQuY2xvc2VzdCggJy53Y2FwZi1kYXRlLWlucHV0JyApO1xuXHRcdGNvbnN0IGZpbHRlcktleSAgICAgICAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0Y29uc3QgaXNSYW5nZSAgICAgICAgICA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtaXMtcmFuZ2UnICk7XG5cblx0XHRsZXQgZmlsdGVyVmFsdWUgPSAnJztcblx0XHRsZXQgcnVuRmlsdGVyICAgPSBmYWxzZTtcblxuXHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IHNldCB0aW1lciBiZWZvcmUgc2V0dGluZyBhIGZyZXNoIG9uZVxuXHRcdGNsZWFyVGltZW91dCggJHdjYXBmRGF0ZUZpbHRlci5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdGlmICggaXNSYW5nZSApIHtcblx0XHRcdGNvbnN0IGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgdG8gICA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLXRvLWlucHV0JyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoIGZyb20gJiYgdG8gKSB7XG5cdFx0XHRcdGZpbHRlclZhbHVlID0gZnJvbSArIHJhbmdlVmFsdWVzU2VwYXJhdG9yICsgdG87XG5cdFx0XHRcdHJ1bkZpbHRlciAgID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSBpZiAoICEgZnJvbSAmJiAhIHRvICkge1xuXHRcdFx0XHRydW5GaWx0ZXIgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBmcm9tID0gJHdjYXBmRGF0ZUZpbHRlci5maW5kKCAnLmRhdGUtZnJvbS1pbnB1dCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCBmcm9tICkge1xuXHRcdFx0XHRmaWx0ZXJWYWx1ZSA9IGZyb207XG5cdFx0XHRcdHJ1bkZpbHRlciAgID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJ1bkZpbHRlciA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCBydW5GaWx0ZXIgKSB7XG5cdFx0XHQkd2NhcGZEYXRlRmlsdGVyLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkd2NhcGZEYXRlRmlsdGVyLnJlbW92ZURhdGEoICd0aW1lcicgKTtcblxuXHRcdFx0XHRpZiAoIGZpbHRlclZhbHVlICkge1xuXHRcdFx0XHRcdHVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc3QgcXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHR9LCBkZWxheSApICk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdERhdGVwaWNrZXIoKSB7XG5cdFx0aWYgKCAhIGpRdWVyeSgpLmRhdGVwaWNrZXIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0ICRyb290O1xuXG5cdFx0aWYgKCB3Y2FwZl9wYXJhbXMuZm9yX3ByZXZpZXcgKSB7XG5cdFx0XHQkcm9vdCA9ICQoIHdjYXBmRGF0ZUZpbHRlclNlbGVjdG9yICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRyb290ID0gJHdjYXBmRGF0ZUZpbHRlcnM7XG5cdFx0fVxuXG5cdFx0Y29uc3QgJHdjYXBmRGF0ZUZpbHRlciA9ICRyb290LmZpbmQoICcud2NhcGYtZGF0ZS1pbnB1dCcgKTtcblxuXHRcdGNvbnN0IGZvcm1hdCAgICAgICAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtZm9ybWF0JyApO1xuXHRcdGNvbnN0IHllYXJEcm9wZG93biAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtcGlja2VyLXllYXItZHJvcGRvd24nICk7XG5cdFx0Y29uc3QgbW9udGhEcm9wZG93biA9ICR3Y2FwZkRhdGVGaWx0ZXIuYXR0ciggJ2RhdGEtZGF0ZS1waWNrZXItbW9udGgtZHJvcGRvd24nICk7XG5cblx0XHRjb25zdCAkZnJvbSA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLWZyb20taW5wdXQnICk7XG5cdFx0Y29uc3QgJHRvICAgPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKTtcblxuXHRcdCRmcm9tLmRhdGVwaWNrZXIoIHtcblx0XHRcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdGNoYW5nZU1vbnRoOiBtb250aERyb3Bkb3duLFxuXHRcdH0gKTtcblxuXHRcdCR0by5kYXRlcGlja2VyKCB7XG5cdFx0XHRkYXRlRm9ybWF0OiBmb3JtYXQsXG5cdFx0XHRjaGFuZ2VZZWFyOiB5ZWFyRHJvcGRvd24sXG5cdFx0XHRjaGFuZ2VNb250aDogbW9udGhEcm9wZG93bixcblx0XHR9ICk7XG5cblx0XHQkZnJvbS5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0ZmlsdGVyQnlEYXRlKCAkaW5wdXQgKTtcblx0XHR9ICk7XG5cblx0XHQkdG8ub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblx0XHRcdGZpbHRlckJ5RGF0ZSggJGlucHV0ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aW5pdERhdGVwaWNrZXIoKTtcblxuXHRmdW5jdGlvbiBpbml0RGVmYXVsdE9yZGVyQnkoKSB7XG5cdFx0Ly8gQXR0YWNoIGNob3Nlbi5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5hdHRhY2hfY2hvc2VuX29uX3NvcnRpbmcgKSB7XG5cdFx0XHRpZiAoIGpRdWVyeSgpLmNob3NlbiApIHtcblx0XHRcdFx0JGJvZHkuZmluZCggJy53b29jb21tZXJjZS1vcmRlcmluZyBzZWxlY3Qub3JkZXJieScgKS5jaG9zZW4oIHtcblx0XHRcdFx0XHQnZGlzYWJsZV9zZWFyY2hfdGhyZXNob2xkJzogMTUsXG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLnNvcnRpbmdfY29udHJvbCApIHtcblx0XHRcdCRib2R5LmZpbmQoICcud29vY29tbWVyY2Utb3JkZXJpbmcnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRvcmRlcmluZ0Zvcm0gPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0JG9yZGVyaW5nRm9ybS5vbiggJ2NoYW5nZScsICdzZWxlY3Qub3JkZXJieScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRvcmRlcmluZ0Zvcm0uc3VibWl0KCk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIHRvZG86IGNoZWNrIGlmIGFqYXggZGlzYWJsZWQuXG5cdFx0JGJvZHkuZmluZCggJy53b29jb21tZXJjZS1vcmRlcmluZycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRvcmRlcmluZ0Zvcm0gPSAkKCB0aGlzICk7XG5cblx0XHRcdCRvcmRlcmluZ0Zvcm0ub24oICdzdWJtaXQnLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQkb3JkZXJpbmdGb3JtLm9uKCAnY2hhbmdlJywgJ3NlbGVjdC5vcmRlcmJ5JywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCBvcmRlciAgICAgID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJfa2V5ID0gJ29yZGVyYnknO1xuXG5cdFx0XHRcdHVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJfa2V5LCBvcmRlciApO1xuXHRcdFx0XHRmaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGluaXREZWZhdWx0T3JkZXJCeSgpO1xuXG5cdGZ1bmN0aW9uIHVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQoICRyZXN1bHRzICkge1xuXHRcdGNvbnN0IHNlbGVjdG9yID0gJy53b29jb21tZXJjZS1yZXN1bHQtY291bnQnO1xuXG5cdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmZpbmQoIHNlbGVjdG9yICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IG5ld1Byb2R1Y3RDb3VudCA9ICRyZXN1bHRzLmZpbmQoIHNlbGVjdG9yICkuaHRtbCgpO1xuXG5cdFx0JGJvZHkuZmluZCggc2VsZWN0b3IgKS5odG1sKCBuZXdQcm9kdWN0Q291bnQgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNob3dMb2FkaW5nQW5pbWF0aW9uKCkge1xuXHRcdGlmICggISB3Y2FwZl9wYXJhbXMubG9hZGluZ19hbmltYXRpb24gKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JC5Mb2FkaW5nT3ZlcmxheSggJ3Nob3cnLCB3Y2FwZl9wYXJhbXMubG9hZGluZ19vdmVybGF5X29wdGlvbnMgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGRpc2FibGVOb1VpU2xpZGVycygpIHtcblx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMuZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbiggZSwgZWxlbWVudCApIHtcblx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKCAnZGlzYWJsZWQnLCB0cnVlICk7XG5cdFx0fSApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzYWJsZUxhYmVscygpIHtcblx0XHRjb25zdCBzZWxlY3RvcnMgPSAnLndjYXBmLWxhYmVsZWQtbmF2IC5pdGVtLCAud2NhcGYtYWN0aXZlLWZpbHRlcnMgLml0ZW0nO1xuXG5cdFx0JHdjYXBmU2luZ2xlRmlsdGVycy5maW5kKCBzZWxlY3RvcnMgKS5hZGRDbGFzcyggJ2Rpc2FibGVkJyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzYWJsZUlucHV0cygpIHtcblx0XHRpZiAoICEgd2NhcGZfcGFyYW1zLmRpc2FibGVfaW5wdXRzX3doaWxlX2ZldGNoaW5nX3Jlc3VsdHMgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgaW5wdXRzID0gJ2lucHV0LCBzZWxlY3QnO1xuXG5cdFx0JHdjYXBmU2luZ2xlRmlsdGVycy5maW5kKCBpbnB1dHMgKS5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0JHdjYXBmU2luZ2xlRmlsdGVycy5maW5kKCBpbnB1dHMgKS50cmlnZ2VyKCAnY2hvc2VuOnVwZGF0ZWQnICk7XG5cblx0XHRkaXNhYmxlTm9VaVNsaWRlcnMoKTtcblx0XHRkaXNhYmxlTGFiZWxzKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBlbmFibGVOb1VpU2xpZGVycygpIHtcblx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMuZmluZCggJy53Y2FwZi1ub3VpLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbiggZSwgZWxlbWVudCApIHtcblx0XHRcdGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCAnZGlzYWJsZWQnICk7XG5cdFx0fSApO1xuXHR9XG5cblx0ZnVuY3Rpb24gZW5hYmxlSW5wdXRzKCkge1xuXHRcdGlmICggISB3Y2FwZl9wYXJhbXMuZGlzYWJsZV9pbnB1dHNfd2hpbGVfZmV0Y2hpbmdfcmVzdWx0cyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpbnB1dHMgPSAnaW5wdXQnO1xuXG5cdFx0JHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzLmZpbmQoIGlucHV0cyApLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHQkd2NhcGZEYXRlRmlsdGVycy5maW5kKCBpbnB1dHMgKS5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cblx0XHRlbmFibGVOb1VpU2xpZGVycygpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVzZXRMb2FkaW5nQW5pbWF0aW9uKCkge1xuXHRcdGlmICggISB3Y2FwZl9wYXJhbXMubG9hZGluZ19hbmltYXRpb24gKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0JC5Mb2FkaW5nT3ZlcmxheSggJ2hpZGUnICk7XG5cdH1cblxuXHRmdW5jdGlvbiBzY3JvbGxUbygpIHtcblx0XHRpZiAoICdub25lJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3Qgc2Nyb2xsRm9yID0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfZm9yO1xuXHRcdGNvbnN0IGlzTW9iaWxlICA9IHdjYXBmX3BhcmFtcy5pc19tb2JpbGU7XG5cdFx0bGV0IHByb2NlZWQgICAgID0gZmFsc2U7XG5cblx0XHRpZiAoICdtb2JpbGUnID09PSBzY3JvbGxGb3IgJiYgaXNNb2JpbGUgKSB7XG5cdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKCAnZGVza3RvcCcgPT09IHNjcm9sbEZvciAmJiAhIGlzTW9iaWxlICkge1xuXHRcdFx0cHJvY2VlZCA9IHRydWU7XG5cdFx0fSBlbHNlIGlmICggJ2JvdGgnID09PSBzY3JvbGxGb3IgKSB7XG5cdFx0XHRwcm9jZWVkID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAoICEgcHJvY2VlZCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgYWRqdXN0aW5nT2Zmc2V0LCBvZmZzZXQ7XG5cblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX29mZnNldCApIHtcblx0XHRcdGFkanVzdGluZ09mZnNldCA9IHBhcnNlSW50KCB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3RvX3RvcF9vZmZzZXQgKTtcblx0XHR9XG5cblx0XHRsZXQgY29udGFpbmVyO1xuXG5cdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdGNvbnRhaW5lciA9IHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyO1xuXHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0Y29udGFpbmVyID0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXI7XG5cdFx0fVxuXG5cdFx0aWYgKCAnY3VzdG9tJyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3cgKSB7XG5cdFx0XHRjb250YWluZXIgPSB3Y2FwZl9wYXJhbXMuc2Nyb2xsX3dpbmRvd19jdXN0b21fZWxlbWVudDtcblx0XHR9XG5cblx0XHRjb25zdCAkY29udGFpbmVyID0gJCggY29udGFpbmVyICk7XG5cblx0XHRpZiAoICRjb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0b2Zmc2V0ID0gJGNvbnRhaW5lci5vZmZzZXQoKS50b3AgLSBhZGp1c3RpbmdPZmZzZXQ7XG5cblx0XHRcdGlmICggb2Zmc2V0IDwgMCApIHtcblx0XHRcdFx0b2Zmc2V0ID0gMDtcblx0XHRcdH1cblxuXHRcdFx0JCggJ2h0bWwsIGJvZHknICkuc3RvcCgpLmFuaW1hdGUoXG5cdFx0XHRcdHsgc2Nyb2xsVG9wOiBvZmZzZXQgfSxcblx0XHRcdFx0d2NhcGZfcGFyYW1zLnNjcm9sbF90b190b3Bfc3BlZWQsXG5cdFx0XHRcdHdjYXBmX3BhcmFtcy5zY3JvbGxfdG9fdG9wX2Vhc2luZ1xuXHRcdFx0KTtcblx0XHR9XG5cdH1cblxuXHQvLyBUaGluZ3MgYXJlIGRvbmUgYmVmb3JlIGZldGNoaW5nIHRoZSBwcm9kdWN0cyBsaWtlIHNob3dpbmcgYSBsb2FkaW5nIGluZGljYXRvci5cblx0ZnVuY3Rpb24gYmVmb3JlRmV0Y2hpbmdQcm9kdWN0cygpIHtcblx0XHRkaXNhYmxlSW5wdXRzKCk7XG5cdFx0c2hvd0xvYWRpbmdBbmltYXRpb24oKTtcblxuXHRcdGlmICggJ2ltbWVkaWF0ZWx5JyA9PT0gd2NhcGZfcGFyYW1zLnNjcm9sbF93aW5kb3dfd2hlbiApIHtcblx0XHRcdHNjcm9sbFRvKCk7XG5cdFx0fVxuXG5cdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2JlZm9yZV9mZXRjaGluZ19wcm9kdWN0cycgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGJlZm9yZVVwZGF0aW5nUHJvZHVjdHMoICRyZXN1bHRzICkge1xuXHRcdHJlc2V0TG9hZGluZ0FuaW1hdGlvbigpO1xuXG5cdFx0JGJvZHkudHJpZ2dlciggJ3djYXBmX2JlZm9yZV91cGRhdGluZ19wcm9kdWN0cycsIFsgJHJlc3VsdHMgXSApO1xuXHR9XG5cblx0Ly8gVGhpbmdzIGFyZSBkb25lIGFmdGVyIGFwcGx5aW5nIHRoZSBmaWx0ZXIgbGlrZSBzY3JvbGwgdG8gdG9wLlxuXHRmdW5jdGlvbiBhZnRlclVwZGF0aW5nUHJvZHVjdHMoICRyZXN1bHRzICkge1xuXHRcdGluaXRDaG9zZW4oKTtcblx0XHRpbml0SGllcmFyY2h5QWNjb3JkaW9uKCk7XG5cdFx0aW5pdE5vVUlTbGlkZXIoKTtcblx0XHRpbml0RGF0ZXBpY2tlcigpO1xuXHRcdGluaXREZWZhdWx0T3JkZXJCeSgpO1xuXHRcdHVwZGF0ZVByb2R1Y3RzQ291bnRSZXN1bHQoICRyZXN1bHRzICk7XG5cdFx0ZW5hYmxlSW5wdXRzKCk7XG5cblx0XHRpZiAoICdhZnRlcicgPT09IHdjYXBmX3BhcmFtcy5zY3JvbGxfd2luZG93X3doZW4gKSB7XG5cdFx0XHRzY3JvbGxUbygpO1xuXHRcdH1cblxuXHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZl9hZnRlcl91cGRhdGluZ19wcm9kdWN0cycsIFsgJHJlc3VsdHMgXSApO1xuXHR9XG5cblx0Ly8gVGhlIG1haW4gZmlsdGVyIGZ1bmN0aW9uLlxuXHRmdW5jdGlvbiBmaWx0ZXJQcm9kdWN0cyggZm9yY2VSZVJlbmRlciA9IGZhbHNlICkge1xuXHRcdGlmICggd2NhcGZfcGFyYW1zLmZvcl9wcmV2aWV3ICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGJlZm9yZUZldGNoaW5nUHJvZHVjdHMoKTtcblxuXHRcdCQuZ2V0KCB3aW5kb3cubG9jYXRpb24uaHJlZiwgZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRjb25zdCAkZGF0YSA9ICQoIGRhdGEgKTtcblxuXHRcdFx0Ly8gUmVwbGFjZSB0aGUgZmllbGRzJyBkYXRhIHdpdGggbmV3IGRhdGEuXG5cdFx0XHQkLmVhY2goIGZpZWxkcywgZnVuY3Rpb24oIGlkICkge1xuXHRcdFx0XHRjb25zdCBmaWVsZElEICAgID0gJ1tkYXRhLWlkPVwiJyArIGlkICsgJ1wiXSc7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkKCBmaWVsZElEICk7XG5cdFx0XHRcdGNvbnN0ICRpbm5lciAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1maWVsZC1pbm5lcicgKTtcblx0XHRcdFx0Y29uc3QgX2ZpZWxkICAgICA9ICRkYXRhLmZpbmQoIGZpZWxkSUQgKTtcblx0XHRcdFx0bGV0IGZpZWxkQ2xhc3NlcyA9ICQoIF9maWVsZCApLmF0dHIoICdjbGFzcycgKTtcblxuXHRcdFx0XHQvLyBQcmVzZXJ2ZSBoaWVyYXJjaHkgYWNjb3JkaW9uIHN0YXRlLlxuXHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5wcmVzZXJ2ZV9oaWVyYXJjaHlfYWNjb3JkaW9uX3N0YXRlICkge1xuXHRcdFx0XHRcdGlmICggJGZpZWxkLmhhc0NsYXNzKCAnaGllcmFyY2h5LWFjY29yZGlvbicgKSApIHtcblx0XHRcdFx0XHRcdCRmaWVsZC5maW5kKCAnLmhpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlLmFjdGl2ZScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgaXRlbVZhbHVlICAgICAgPSAkKCB0aGlzICkucGFyZW50KCkuY2hpbGRyZW4oICdpbnB1dCcgKS52YWwoKTtcblx0XHRcdFx0XHRcdFx0Y29uc3QgdG9nZ2xlU2VsZWN0b3IgPSAnaW5wdXRbdmFsdWU9XCInICsgaXRlbVZhbHVlICsgJ1wiXSB+IC5oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZSc7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHVsU2VsZWN0b3IgICAgID0gJ2lucHV0W3ZhbHVlPVwiJyArIGl0ZW1WYWx1ZSArICdcIl0gfiB1bCc7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IF9jbGFzc2VzICAgICAgID0gJ2hpZXJhcmNoeS1hY2NvcmRpb24tdG9nZ2xlIGFjdGl2ZSc7XG5cblx0XHRcdFx0XHRcdFx0X2ZpZWxkLmZpbmQoIHRvZ2dsZVNlbGVjdG9yICkuYXR0ciggJ2NsYXNzJywgX2NsYXNzZXMgKTtcblx0XHRcdFx0XHRcdFx0X2ZpZWxkLmZpbmQoIHVsU2VsZWN0b3IgKS5zaG93KCk7XG5cdFx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgX2h0bWwgPSBfZmllbGQuZmluZCggJy53Y2FwZi1maWVsZC1pbm5lcicgKS5odG1sKCk7XG5cblx0XHRcdFx0Ly8gU2hvdyBzb2Z0IGxpbWl0IGl0ZW1zLlxuXHRcdFx0XHRjb25zdCBzb2Z0TGltaXRTZWxlY3RvciA9ICdzaG93LWhpZGRlbi1pdGVtcyc7XG5cblx0XHRcdFx0aWYgKCAkZmllbGQuaGFzQ2xhc3MoIHNvZnRMaW1pdFNlbGVjdG9yICkgKSB7XG5cdFx0XHRcdFx0aWYgKCAhIF9maWVsZC5oYXNDbGFzcyggc29mdExpbWl0U2VsZWN0b3IgKSApIHtcblx0XHRcdFx0XHRcdGZpZWxkQ2xhc3NlcyArPSAnICcgKyBzb2Z0TGltaXRTZWxlY3Rvcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZmllbGRDbGFzc2VzID0gZmllbGRDbGFzc2VzLnJlcGxhY2UoIHNvZnRMaW1pdFNlbGVjdG9yLCAnJyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBmaWVsZCdzIGNsYXNzLlxuXHRcdFx0XHQkZmllbGQuYXR0ciggJ2NsYXNzJywgZmllbGRDbGFzc2VzLnRyaW0oKSApO1xuXG5cdFx0XHRcdC8vIFdoZW4gY2FsbGVkIGZyb20gaGlzdG9yeSBiYWNrIG9yIGZvcndhcmQgcmVxdWVzdCB0aGVuIHJlcmVuZGVyIGFsbCBmaWVsZHMuXG5cdFx0XHRcdGlmICggZm9yY2VSZVJlbmRlciApIHtcblxuXHRcdFx0XHRcdC8vIHVwZGF0ZSBmaWVsZFxuXHRcdFx0XHRcdCRpbm5lci5odG1sKCBfaHRtbCApO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHQvLyBTZWxlY3RpdmVseSByZXJlbmRlciB0aGUgZmllbGRzLlxuXHRcdFx0XHRcdGlmICggJGZpZWxkLmhhc0NsYXNzKCAnd2NhcGYtbmF2LWZpbHRlcicgKSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gdXBkYXRlIGZpZWxkXG5cdFx0XHRcdFx0XHQkaW5uZXIuaHRtbCggX2h0bWwgKTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0JGZpZWxkLnRyaWdnZXIoICd3Y2FwZi1maWVsZC11cGRhdGVkJywgWyBfZmllbGQgXSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRiZWZvcmVVcGRhdGluZ1Byb2R1Y3RzKCAkZGF0YSApO1xuXG5cdFx0XHQvLyBSZXBsYWNlIG9sZCBzaG9wIGxvb3Agd2l0aCBuZXcgb25lLlxuXHRcdFx0Y29uc3QgJHNob3BMb29wQ29udGFpbmVyID0gJGRhdGEuZmluZCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdGNvbnN0ICRub3RGb3VuZENvbnRhaW5lciA9ICRkYXRhLmZpbmQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICk7XG5cblx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgPT09IHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkge1xuXHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICggJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRhZnRlclVwZGF0aW5nUHJvZHVjdHMoICRkYXRhICk7XG5cdFx0fSApO1xuXHR9XG5cblx0Ly8gVVJMIFBhcnNlclxuXHRmdW5jdGlvbiBnZXRVcmxWYXJzKCB1cmwgKSB7XG5cdFx0bGV0IHZhcnMgPSB7fSwgaGFzaDtcblxuXHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHR1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHR9XG5cblx0XHR1cmwgPSB1cmwucmVwbGFjZUFsbCggJyUyQycsICcsJyApO1xuXG5cdFx0Y29uc3QgaGFzaGVzICA9IHVybC5zbGljZSggdXJsLmluZGV4T2YoICc/JyApICsgMSApLnNwbGl0KCAnJicgKTtcblx0XHRjb25zdCBoTGVuZ3RoID0gaGFzaGVzLmxlbmd0aDtcblxuXHRcdGZvciAoIGxldCBpID0gMDsgaSA8IGhMZW5ndGg7IGkrKyApIHtcblx0XHRcdGhhc2ggPSBoYXNoZXNbIGkgXS5zcGxpdCggJz0nICk7XG5cblx0XHRcdHZhcnNbIGhhc2hbIDAgXSBdID0gaGFzaFsgMSBdO1xuXHRcdH1cblxuXHRcdHJldHVybiB2YXJzO1xuXHR9XG5cblx0Ly8gZXZlcnl0aW1lIHdlIGFwcGx5IHRoZSBmaWx0ZXIgd2Ugc2V0IHRoZSBjdXJyZW50IHBhZ2UgdG8gMVxuXHRmdW5jdGlvbiBmaXhQYWdpbmF0aW9uKCkge1xuXHRcdGxldCB1cmwgICAgICAgICAgICAgICAgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRjb25zdCBwYXJhbXMgICAgICAgICAgID0gZ2V0VXJsVmFycyggdXJsICk7XG5cdFx0Y29uc3QgY3VycmVudFBhZ2VJblVybCA9IHBhcnNlSW50KCB1cmwucmVwbGFjZSggLy4rXFwvcGFnZVxcLyhcXGQrKSsvLCAnJDEnICkgKTtcblxuXHRcdGlmICggY3VycmVudFBhZ2VJblVybCApIHtcblx0XHRcdGlmICggY3VycmVudFBhZ2VJblVybCA+IDEgKSB7XG5cdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCAvcGFnZVxcLyhcXGQrKS8sICdwYWdlLzEnICk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICggdHlwZW9mIHBhcmFtc1sgJ3BhZ2VkJyBdICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdGNvbnN0IGN1cnJlbnRQYWdlSW5QYXJhbXMgPSBwYXJzZUludCggcGFyYW1zWyAncGFnZWQnIF0gKTtcblxuXHRcdFx0aWYgKCBjdXJyZW50UGFnZUluUGFyYW1zID4gMSApIHtcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoICdwYWdlZD0nICsgY3VycmVudFBhZ2VJblBhcmFtcywgJ3BhZ2VkPTEnICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHVybDtcblx0fVxuXG5cdC8vIHVwZGF0ZSBxdWVyeSBzdHJpbmcgZm9yIGNhdGVnb3JpZXMsIG1ldGEgZXRjLi5cblx0ZnVuY3Rpb24gdXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGtleSwgdmFsdWUsIHB1c2hIaXN0b3J5LCB1cmwgKSB7XG5cdFx0aWYgKCB0eXBlb2YgcHVzaEhpc3RvcnkgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0cHVzaEhpc3RvcnkgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHR1cmwgPSBmaXhQYWdpbmF0aW9uKCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmUgICAgICAgID0gbmV3IFJlZ0V4cCggJyhbPyZdKScgKyBrZXkgKyAnPS4qPygmfCQpJywgJ2knICk7XG5cdFx0Y29uc3Qgc2VwYXJhdG9yID0gdXJsLmluZGV4T2YoICc/JyApICE9PSAtMSA/ICcmJyA6ICc/Jztcblx0XHRsZXQgdXJsV2l0aFF1ZXJ5O1xuXG5cdFx0aWYgKCB1cmwubWF0Y2goIHJlICkgKSB7XG5cdFx0XHR1cmxXaXRoUXVlcnkgPSB1cmwucmVwbGFjZSggcmUsICckMScgKyBrZXkgKyAnPScgKyB2YWx1ZSArICckMicgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dXJsV2l0aFF1ZXJ5ID0gdXJsICsgc2VwYXJhdG9yICsga2V5ICsgJz0nICsgdmFsdWU7XG5cdFx0fVxuXG5cdFx0aWYgKCBwdXNoSGlzdG9yeSA9PT0gdHJ1ZSApIHtcblx0XHRcdHJldHVybiBoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCB1cmxXaXRoUXVlcnkgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHVybFdpdGhRdWVyeTtcblx0XHR9XG5cdH1cblxuXHQvLyByZW1vdmUgcGFyYW1ldGVyIGZyb20gdXJsXG5cdGZ1bmN0aW9uIHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIHVybCApIHtcblx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0dXJsID0gZml4UGFnaW5hdGlvbigpO1xuXHRcdH1cblxuXHRcdGNvbnN0IG9sZFBhcmFtcyAgICAgICAgID0gZ2V0VXJsVmFycyggdXJsICk7XG5cdFx0Y29uc3Qgb2xkUGFyYW1zTGVuZ3RoICAgPSBPYmplY3Qua2V5cyggb2xkUGFyYW1zICkubGVuZ3RoO1xuXHRcdGNvbnN0IHN0YXJ0UG9zaXRpb24gICAgID0gdXJsLmluZGV4T2YoICc/JyApO1xuXHRcdGNvbnN0IGZpbHRlcktleVBvc2l0aW9uID0gdXJsLmluZGV4T2YoIGZpbHRlcktleSApO1xuXHRcdGxldCBjbGVhblVybCwgY2xlYW5RdWVyeTtcblxuXHRcdGlmICggb2xkUGFyYW1zTGVuZ3RoID4gMSApIHtcblx0XHRcdGlmICggKCBmaWx0ZXJLZXlQb3NpdGlvbiAtIHN0YXJ0UG9zaXRpb24gKSA+IDEgKSB7XG5cdFx0XHRcdGNsZWFuVXJsID0gdXJsLnJlcGxhY2UoICcmJyArIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0sICcnICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjbGVhblVybCA9IHVybC5yZXBsYWNlKCBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdICsgJyYnLCAnJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBuZXdQYXJhbXMgPSBjbGVhblVybC5zcGxpdCggJz8nICk7XG5cdFx0XHRjbGVhblF1ZXJ5ICAgICAgPSAnPycgKyBuZXdQYXJhbXNbIDEgXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y2xlYW5RdWVyeSA9IHVybC5yZXBsYWNlKCAnPycgKyBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdLCAnJyApO1xuXHRcdH1cblxuXHRcdHJldHVybiBjbGVhblF1ZXJ5O1xuXHR9XG5cblx0Ly8gdGFrZSB0aGUga2V5IGFuZCB2YWx1ZSBhbmQgbWFrZSBxdWVyeVxuXHRmdW5jdGlvbiBtYWtlUGFyYW1ldGVycyggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSwgZm9yY2VSZXJlbmRlciA9IGZhbHNlLCB1cmwgKSB7XG5cdFx0Y29uc3QgdmFsdWVTZXBhcmF0b3IgPSAnLCc7XG5cblx0XHRsZXQgcGFyYW1zLCBuZXh0VmFsdWVzLCBlbXB0eVZhbHVlID0gZmFsc2U7XG5cblx0XHRpZiAoIHR5cGVvZiB1cmwgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0cGFyYW1zID0gZ2V0VXJsVmFycyggdXJsICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBhcmFtcyA9IGdldFVybFZhcnMoKTtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGVvZiBwYXJhbXNbIGZpbHRlcktleSBdICE9ICd1bmRlZmluZWQnICkge1xuXHRcdFx0Y29uc3QgcHJldlZhbHVlcyAgICAgID0gcGFyYW1zWyBmaWx0ZXJLZXkgXTtcblx0XHRcdGNvbnN0IHByZXZWYWx1ZXNBcnJheSA9IHByZXZWYWx1ZXMuc3BsaXQoIHZhbHVlU2VwYXJhdG9yICk7XG5cblx0XHRcdGlmICggcHJldlZhbHVlcy5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRjb25zdCBmb3VuZCA9ICQuaW5BcnJheSggZmlsdGVyVmFsdWUsIHByZXZWYWx1ZXNBcnJheSApO1xuXG5cdFx0XHRcdGlmICggZm91bmQgPj0gMCApIHtcblx0XHRcdFx0XHQvLyBFbGVtZW50IHdhcyBmb3VuZCwgcmVtb3ZlIGl0LlxuXHRcdFx0XHRcdHByZXZWYWx1ZXNBcnJheS5zcGxpY2UoIGZvdW5kLCAxICk7XG5cblx0XHRcdFx0XHRpZiAoIHByZXZWYWx1ZXNBcnJheS5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRcdFx0XHRlbXB0eVZhbHVlID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gRWxlbWVudCB3YXMgbm90IGZvdW5kLCBhZGQgaXQuXG5cdFx0XHRcdFx0cHJldlZhbHVlc0FycmF5LnB1c2goIGZpbHRlclZhbHVlICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHByZXZWYWx1ZXNBcnJheS5sZW5ndGggPiAxICkge1xuXHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBwcmV2VmFsdWVzQXJyYXkuam9pbiggdmFsdWVTZXBhcmF0b3IgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRuZXh0VmFsdWVzID0gcHJldlZhbHVlc0FycmF5O1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRuZXh0VmFsdWVzID0gZmlsdGVyVmFsdWU7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdG5leHRWYWx1ZXMgPSBmaWx0ZXJWYWx1ZTtcblx0XHR9XG5cblx0XHQvLyB1cGRhdGUgdXJsIGFuZCBxdWVyeSBzdHJpbmdcblx0XHRpZiAoICEgZW1wdHlWYWx1ZSApIHtcblx0XHRcdHVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIG5leHRWYWx1ZXMgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgcXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdH1cblxuXHRcdGZpbHRlclByb2R1Y3RzKCBmb3JjZVJlcmVuZGVyICk7XG5cdH1cblxuXHRmdW5jdGlvbiBzaW5nbGVGaWx0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKSB7XG5cdFx0Y29uc3QgcGFyYW1zID0gZ2V0VXJsVmFycygpO1xuXHRcdGxldCBxdWVyeTtcblxuXHRcdGlmICggdHlwZW9mIHBhcmFtc1sgZmlsdGVyS2V5IF0gIT09ICd1bmRlZmluZWQnICYmIHBhcmFtc1sgZmlsdGVyS2V5IF0gPT09IGZpbHRlclZhbHVlICkge1xuXHRcdFx0cXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHF1ZXJ5ID0gdXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIGZhbHNlICk7XG5cdFx0fVxuXG5cdFx0Ly8gdXBkYXRlIHVybFxuXHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRmaWx0ZXJQcm9kdWN0cygpO1xuXHR9XG5cblx0Ly8gSGFuZGxlIHRoZSBwYWdpbmF0aW9uIHJlcXVlc3QgdmlhIGFqYXguXG5cdGlmICggd2NhcGZfcGFyYW1zLmVuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4ICYmIHdjYXBmX3BhcmFtcy5wYWdpbmF0aW9uX2NvbnRhaW5lciApIHtcblx0XHRjb25zdCAkY29udGFpbmVyID0gJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRjb25zdCBzZWxlY3RvciAgID0gd2NhcGZfcGFyYW1zLnBhZ2luYXRpb25fY29udGFpbmVyICsgJyBhJztcblxuXHRcdC8vIHRvZG86IGNoZWNrIGlmIGFqYXggZGlzYWJsZWQuXG5cdFx0aWYgKCAkY29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdCRjb250YWluZXIub24oICdjbGljaycsIHNlbGVjdG9yLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0IGxvY2F0aW9uID0gJCggdGhpcyApLmF0dHIoICdocmVmJyApO1xuXG5cdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIGxvY2F0aW9uICk7XG5cblx0XHRcdFx0ZmlsdGVyUHJvZHVjdHMoKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cdH1cblxuXHQvLyBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIHRoZSBjb21tb24gZmlsdGVyIHJlcXVlc3RzLlxuXHRmdW5jdGlvbiBoYW5kbGVGaWx0ZXJSZXF1ZXN0KCAkaXRlbSwgZmlsdGVyVmFsdWUgKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXNpbmdsZS1maWx0ZXInICk7XG5cdFx0Y29uc3QgZmllbGRJRCAgICAgICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtaWQnICk7XG5cdFx0Y29uc3QgZmllbGREYXRhICAgICAgPSBmaWVsZHNbIGZpZWxkSUQgXTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICA9IGZpZWxkRGF0YS5maWx0ZXJLZXk7XG5cdFx0Y29uc3QgbXVsdGlwbGVGaWx0ZXIgPSBmaWVsZERhdGEubXVsdGlwbGVGaWx0ZXI7XG5cblx0XHRpZiAoICEgZmlsdGVyS2V5ICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICggISBmaWx0ZXJWYWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRjb25zdCBxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRcdGZpbHRlclByb2R1Y3RzKCk7XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIG11bHRpcGxlRmlsdGVyICkge1xuXHRcdFx0bWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2luZ2xlRmlsdGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gcmVxdWVzdEZpbHRlciggdXJsICkge1xuXHRcdGlmICggISB1cmwgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmw7XG5cblx0XHQvLyBUT0RPOiBGaWx0ZXIgdGhlIHByb2R1Y3RzIGNvbmRpdGlvbmFsbHkuXG5cdFx0Ly8gZmlsdGVyUHJvZHVjdHMoKTtcblx0fVxuXG5cdC8vIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGxpc3QgZmllbGQuXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oXG5cdFx0J2NoYW5nZScsXG5cdFx0Jy53Y2FwZi1sYXllcmVkLW5hdiBbdHlwZT1cImNoZWNrYm94XCJdLCAud2NhcGYtbGF5ZXJlZC1uYXYgW3R5cGU9XCJyYWRpb1wiXScsXG5cdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdHJlcXVlc3RGaWx0ZXIoICRpdGVtLmRhdGEoICd1cmwnICkgKTtcblx0XHR9XG5cdCk7XG5cblx0Ly8gSGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgbGFiZWxlZCBpdGVtLlxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKCAnY2xpY2snLCAnLndjYXBmLWxhYmVsZWQtbmF2IC5pdGVtOm5vdCguZGlzYWJsZWQpJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdHJlcXVlc3RGaWx0ZXIoICRpdGVtLmRhdGEoICd1cmwnICkgKTtcblx0fSApO1xuXG5cdC8vIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGRpc3BsYXkgdHlwZSBzZWxlY3QgZmllbGRzLlxuXHQkd2NhcGZOYXZGaWx0ZXJzLm9uKCAnY2hhbmdlJywgJ3NlbGVjdCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgJHNlbGVjdCAgICAgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgdmFsdWVzICAgICAgICAgPSAkc2VsZWN0LnZhbCgpO1xuXHRcdGNvbnN0IGZpbHRlclVSTCAgICAgID0gJHNlbGVjdC5kYXRhKCAndXJsJyApO1xuXHRcdGNvbnN0IGNsZWFyRmlsdGVyVVJMID0gJHNlbGVjdC5kYXRhKCAnY2xlYXItZmlsdGVyLXVybCcgKTtcblx0XHRsZXQgdXJsO1xuXG5cdFx0aWYgKCB2YWx1ZXMubGVuZ3RoICkge1xuXHRcdFx0dXJsID0gZmlsdGVyVVJMLnJlcGxhY2UoICclcycsIHZhbHVlcy50b1N0cmluZygpICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHVybCA9IGNsZWFyRmlsdGVyVVJMO1xuXHRcdH1cblxuXHRcdHJlcXVlc3RGaWx0ZXIoIHVybCApO1xuXHR9ICk7XG5cblx0LyoqXG5cdCAqIEhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIHJhbmdlIG51bWJlci5cblx0ICovXG5cdGNvbnN0IHJhbmdlTnVtYmVyU2VsZWN0b3JzID0gJy53Y2FwZi1yYW5nZS1udW1iZXIgLm1pbi12YWx1ZSwgLndjYXBmLXJhbmdlLW51bWJlciAubWF4LXZhbHVlJztcblxuXHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMub24oICdpbnB1dCcsIHJhbmdlTnVtYmVyU2VsZWN0b3JzLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRpdGVtID0gJCggdGhpcyApO1xuXG5cdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRjb25zdCAkcmFuZ2VOdW1iZXIgID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1yYW5nZS1udW1iZXInICk7XG5cdFx0XHRjb25zdCBmaWx0ZXJLZXkgICAgID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0XHRjb25zdCByYW5nZU1pblZhbHVlID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKTtcblx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApO1xuXHRcdFx0bGV0IG1pblZhbHVlICAgICAgICA9ICRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoKTtcblx0XHRcdGxldCBtYXhWYWx1ZSAgICAgICAgPSAkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCk7XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRpZiAoICEgbWluVmFsdWUubGVuZ3RoICkge1xuXHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdGlmICggISBtYXhWYWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSByYW5nZU1pblZhbHVlLlxuXHRcdFx0aWYgKCBwYXJzZUZsb2F0KCBtaW5WYWx1ZSApIDwgcGFyc2VGbG9hdCggcmFuZ2VNaW5WYWx1ZSApICkge1xuXHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdGlmICggcGFyc2VGbG9hdCggbWluVmFsdWUgKSA+IHBhcnNlRmxvYXQoIHJhbmdlTWF4VmFsdWUgKSApIHtcblx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG1heFZhbHVlICkgPiBwYXJzZUZsb2F0KCByYW5nZU1heFZhbHVlICkgKSB7XG5cdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblxuXHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGdvIGJlbG93IHRoZSBtaW5WYWx1ZS5cblx0XHRcdGlmICggcGFyc2VGbG9hdCggbWluVmFsdWUgKSA+IHBhcnNlRmxvYXQoIG1heFZhbHVlICkgKSB7XG5cdFx0XHRcdG1heFZhbHVlID0gbWluVmFsdWU7XG5cblx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0Y29uc3QgcXVlcnkgPSByZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJWYWxTdHJpbmcgPSBtaW5WYWx1ZSArIHJhbmdlVmFsdWVzU2VwYXJhdG9yICsgbWF4VmFsdWU7XG5cdFx0XHRcdHVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbFN0cmluZyApO1xuXHRcdFx0fVxuXG5cdFx0XHRmaWx0ZXJQcm9kdWN0cygpO1xuXHRcdH0sIGRlbGF5ICkgKTtcblx0fSApO1xuXG5cdC8vIEhhbmRsZSByZW1vdmluZyB0aGUgYWN0aXZlIGZpbHRlcnMuXG5cdCR3Y2FwZk5hdkZpbHRlcnMub24oICdjbGljaycsICcud2NhcGYtYWN0aXZlLWZpbHRlcnMgLml0ZW06bm90KC5kaXNhYmxlZCknLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRpdGVtICAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGZpbHRlcktleSAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLmF0dHIoICdkYXRhLXZhbHVlJyApO1xuXG5cdFx0bWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIHRydWUgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHJlc2V0RmlsdGVycyggJGJ1dHRvbiApIHtcblx0XHRjb25zdCBfZmlsdGVyS2V5cyA9ICRidXR0b24uYXR0ciggJ2RhdGEta2V5cycgKTtcblxuXHRcdGlmICggISBfZmlsdGVyS2V5cyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBmaWx0ZXJLZXlzID0gX2ZpbHRlcktleXMuc3BsaXQoICcsJyApO1xuXG5cdFx0bGV0IHF1ZXJ5ID0gJyc7XG5cblx0XHQkLmVhY2goIGZpbHRlcktleXMsIGZ1bmN0aW9uKCBpLCBmaWx0ZXJLZXkgKSB7XG5cdFx0XHRpZiAoIHF1ZXJ5ICkge1xuXHRcdFx0XHRxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIHF1ZXJ5ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHQvLyBFbXB0eSBxdWVyeSBjYXVzZXMgaXNzdWUoZG9lc24ndCByZW1vdmUgdGhlIGZpbHRlciBrZXlzIGZyb20gdGhlIHVybCksXG5cdFx0Ly8gdGhpcyBpcyB3aHkgd2UgYXJlIHNldHRpbmcgdGhlIHBhZ2UgdXJsIGFzIHF1ZXJ5LlxuXHRcdGlmICggISBxdWVyeSApIHtcblx0XHRcdGNvbnN0IHByZXZVcmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRcdGNvbnN0IG5ld1VybCAgPSBwcmV2VXJsLnNwbGl0KCAnPycgKTtcblxuXHRcdFx0cXVlcnkgPSBuZXdVcmxbIDAgXTtcblx0XHR9XG5cblx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0ZmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0fVxuXG5cdC8vIENsZWFyL1Jlc2V0IGFsbCBmaWx0ZXJzLlxuXHQkYm9keS5vbiggJ3djYXBmLXJlc2V0LWZpbHRlcnMnLCBmdW5jdGlvbiggZSwgJGJ1dHRvbiApIHtcblx0XHRyZXNldEZpbHRlcnMoICRidXR0b24gKTtcblx0fSApO1xuXG5cdCRib2R5Lm9uKCAnY2xpY2snLCAnLndjYXBmLXJlc2V0LWZpbHRlcnMtYnRuJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGJ1dHRvbiA9ICQoIHRoaXMgKTtcblxuXHRcdHJlc2V0RmlsdGVycyggJGJ1dHRvbiApO1xuXHR9ICk7XG5cblx0JHdjYXBmTmF2RmlsdGVycy5vbiggJ2NsaWNrJywgJy53Y2FwZi1yZXNldC1maWx0ZXJzLWJ0bicsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgJGJ1dHRvbiA9ICQoIHRoaXMgKTtcblxuXHRcdCRib2R5LnRyaWdnZXIoICd3Y2FwZi1yZXNldC1maWx0ZXJzJywgWyAkYnV0dG9uIF0gKTtcblx0fSApO1xuXG5cdCR3Y2FwZlNpbmdsZUZpbHRlcnMub24oICd3Y2FwZi1jbGVhci1maWx0ZXInLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgZmllbGRJRCAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdGNvbnN0IGZpZWxkRGF0YSA9IGZpZWxkc1sgZmllbGRJRCBdO1xuXHRcdGNvbnN0IGZpbHRlcktleSA9IGZpZWxkRGF0YS5maWx0ZXJLZXk7XG5cblx0XHRjb25zdCBxdWVyeSA9IHJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0ZmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0fSApO1xuXG5cdC8vIFJ1biBhamF4IGZpbHRlciB3aGVuIGJyb3dzZXIgaGlzdG9yeSBjaGFuZ2VzICh1c2VyIGdvZXMgYmFjayBvciBmb3J3YXJkKS5cblx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCB8fCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRpZiAoIHdjYXBmX3BhcmFtcy5hcHBseV9maWx0ZXJzX29uX2Jyb3dzZXJfaGlzdG9yeV9jaGFuZ2UgKSB7XG5cdFx0XHQkKCB3aW5kb3cgKS5iaW5kKCAncG9wc3RhdGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cdH1cblxuXHQvLyBUaGUgaG9vayB0aGF0IG1hbnVhbGx5IHJ1biB0aGUgYWpheCBmaWx0ZXJzIChjYW4gYmUgdXNlZnVsIGZvciBvdGhlciBwbHVnaW5zKS5cblx0JGJvZHkub24oICd3Y2FwZi1ydW4tZmlsdGVyLXByb2R1Y3RzJywgZnVuY3Rpb24oIGUsIGZvcmNlUmVSZW5kZXIgKSB7XG5cdFx0ZmlsdGVyUHJvZHVjdHMoIGZvcmNlUmVSZW5kZXIgKTtcblx0fSApO1xuXG5cdC8vIFRoZSBob29rIHRoYXQgcmVpbml0aWFsaXplIHRoZSBmaWx0ZXIgd2lkZ2V0cyAodG8gc2hvdyB0aGUgcHJldmlldyBpbiB0aGUgYmFja2VuZCkuXG5cdCRib2R5Lm9uKCAnaW5pdF9maWx0ZXJfd2lkZ2V0cycsIGZ1bmN0aW9uKCkge1xuXHRcdGluaXRDaG9zZW4oKTtcblx0XHRpbml0SGllcmFyY2h5QWNjb3JkaW9uKCk7XG5cdFx0aW5pdE5vVUlTbGlkZXIoKTtcblx0XHRpbml0RGF0ZXBpY2tlcigpO1xuXHR9ICk7XG5cblx0LyoqXG5cdCAqIE1ha2UgaXQgY29tcGF0aWJsZSB3aXRoIG90aGVyIHBsdWdpbnMuXG5cdCAqL1xuXHQkYm9keS5vbiggJ3djYXBmX2FmdGVyX3VwZGF0aW5nX3Byb2R1Y3RzJywgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gd29vLXZhcmlhdGlvbi1zd2F0Y2hlc1xuXHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggJ3dvb192YXJpYXRpb25fc3dhdGNoZXNfcHJvX2luaXQnICk7XG5cdH0gKTtcbn0gKTtcbiJdfQ==
