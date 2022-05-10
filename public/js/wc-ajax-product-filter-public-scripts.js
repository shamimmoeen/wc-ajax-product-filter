"use strict";

/**
 * Display type fields.
 *
 * TODO: Maybe delete.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function ($) {});
"use strict";

/**
 * The frontend filter form.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/public/src/js
 * @author     Mainul Hassan Main
 */
var wcapf_params = wcapf_params || {
  'filter_input_delay': '',
  'shop_loop_container': '',
  'not_found_container': '',
  'pagination_container': '',
  // todo
  'sorting_control': '',
  // todo
  'scroll_to_top': '',
  // todo
  'scroll_to_top_offset': '',
  // todo
  'custom_scripts': ''
};
jQuery(document).ready(function ($) {
  // return false if wcapf_params variable is not found
  if (typeof wcapf_params === 'undefined') {
    return false;
  }

  var _delay = parseInt(wcapf_params.filter_input_delay);

  var delay = _delay >= 0 ? _delay : 800; // store fields' id and filter information

  var fields = {};
  var $wcapfSingleFilters = $('.wcapf-single-filter');
  var $wcapfNavFilters = $('.wcapf-nav-filter');
  var $wcapfNumberRangeFilters = $('.wcapf-number-range-filter');
  $wcapfSingleFilters.each(function () {
    var $field = $(this);
    var id = $field.attr('data-id');
    var $wrapper = $field.children('div');
    var filterKey = $wrapper.attr('data-filter-key');
    var multipleFilter = parseInt($wrapper.attr('data-multiple-filter'));
    fields[id] = {
      filterKey: filterKey,
      multipleFilter: multipleFilter
    };
  }); // Initialize jQuery chosen library

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

      $this.chosen(options);
    });
  }

  initChosen(); // Initialize hierarchy accordion

  function initHierarchyAccordion() {
    $wcapfNavFilters.find('.hierarchy-accordion-toggle').on('click', function () {
      $(this).toggleClass('active');
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
  } // Initialize noUISlider


  function initNoUISlider() {
    $wcapfNumberRangeFilters.find('.wcapf-range-slider').each(function () {
      var $item = $(this);
      var filterKey = $item.attr('data-filter-key');
      var $slider = $item.find('.wcapf-noui-slider'); // If slider is already initialized then don't reinitialize again.

      if ($slider.hasClass('noUi-target')) {
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

      if ('undefined' === typeof noUiSlider) {
        return;
      }

      var slider = document.getElementById(sliderId);
      noUiSlider.create(slider, {
        start: [minValue, maxValue],
        step: step,
        connect: true,
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
      });

      function filterProductsAccordingToSlider(values) {
        var minValue = parseFloat(values[0]);
        var maxValue = parseFloat(values[1]);

        if (minValue === rangeMinValue && maxValue === rangeMaxValue) {
          var query = wcapfRemoveQueryStringParameter(filterKey);
          history.pushState({}, '', query);
        } else {
          var filterValString = minValue + '+' + maxValue;
          wcapfUpdateQueryStringParameter(filterKey, filterValString);
        } // filter products


        wcapfFilterProducts();
      }

      slider.noUiSlider.on('end', function (values) {
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

  initNoUISlider(); // show a loading indicator

  function wcapfBeforeUpdate() {
    $('body').trigger('wcapf_before_update_filters');
  } // scroll to top


  function wcapfAfterUpdate() {
    initChosen();
    initHierarchyAccordion();
    initNoUISlider();
    $('body').trigger('wcapf_after_update_filters');
  } // filter the products


  function wcapfFilterProducts() {
    var forceReRender = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    wcapfBeforeUpdate();
    $.get(window.location.href, function (data) {
      var $data = $(data);
      var $shopLoopContainer = $data.find(wcapf_params.shop_loop_container);
      var $notFoundContainer = $data.find(wcapf_params.not_found_container); // replace fields' data with new data

      $.each(fields, function (id) {
        var fieldID = '[data-id="' + id + '"]';
        var $field = $(fieldID);

        var _field = $data.find(fieldID);

        var fieldClass = $(_field).attr('class'); // When called from history back or forward request then rerender all fields.

        if (forceReRender) {
          // update class
          $field.attr('class', fieldClass); // update field

          $field.html(_field.html());
        } else {
          // Selectively rerender the fields.
          if ($field.hasClass('wcapf-nav-filter')) {
            // update class
            $field.attr('class', fieldClass); // update field

            $field.html(_field.html());
          }
        }
      }); // replace old shop loop with new one

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

      wcapfAfterUpdate(); // todo
      // reinitialize ordering
      // wcapfInitOrder();
      // todo
      // reinitialize dropdown filter
      // wcapfDropDownFilter();
      // run scripts after shop loop undated

      if (typeof wcapf_params.custom_scripts !== 'undefined' && wcapf_params.custom_scripts.length > 0) {
        eval(wcapf_params.custom_scripts);
      }
    });
  } // URL Parser


  function wcapfGetUrlVars(url) {
    var vars = {},
        hash;

    if (typeof url === 'undefined') {
      url = window.location.href;
    }

    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    var hLength = hashes.length;

    for (var i = 0; i < hLength; i++) {
      hash = hashes[i].split('=');
      vars[hash[0]] = hash[1];
    }

    return vars;
  } // everytime we apply the filter we set the current page to 1


  function wcapfFixPagination() {
    var url = window.location.href;
    var params = wcapfGetUrlVars(url);
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


  function wcapfUpdateQueryStringParameter(key, value, pushHistory, url) {
    if (typeof pushHistory === 'undefined') {
      pushHistory = true;
    }

    if (typeof url === 'undefined') {
      url = wcapfFixPagination();
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


  function wcapfRemoveQueryStringParameter(filterKey, url) {
    if (typeof url === 'undefined') {
      url = wcapfFixPagination();
    }

    var oldParams = wcapfGetUrlVars(url);
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


  function wcapfMakeParameters(filterKey, filterValue, url) {
    var params,
        nextValues,
        emptyValue = false;

    if (typeof url !== 'undefined') {
      params = wcapfGetUrlVars(url);
    } else {
      params = wcapfGetUrlVars();
    }

    if (typeof params[filterKey] != 'undefined') {
      var prevValues = params[filterKey];
      var prevValuesArray = prevValues.split(',');

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
          nextValues = prevValuesArray.join(',');
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
      wcapfUpdateQueryStringParameter(filterKey, nextValues);
    } else {
      var query = wcapfRemoveQueryStringParameter(filterKey);
      history.pushState({}, '', query);
    } // filter products


    wcapfFilterProducts();
  }

  function wcapfSingleFilter(filterKey, filterValue) {
    var params = wcapfGetUrlVars();
    var query;

    if (typeof params[filterKey] !== 'undefined' && params[filterKey] === filterValue) {
      query = wcapfRemoveQueryStringParameter(filterKey);
    } else {
      query = wcapfUpdateQueryStringParameter(filterKey, filterValue, false);
    } // update url


    history.pushState({}, '', query); // filter products

    wcapfFilterProducts();
  } // The main function to handle the filter request


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
      var query = wcapfRemoveQueryStringParameter(filterKey);
      history.pushState({}, '', query); // filter products

      wcapfFilterProducts();
      return;
    }

    if (multipleFilter) {
      wcapfMakeParameters(filterKey, filterValue);
    } else {
      wcapfSingleFilter(filterKey, filterValue);
    }
  } // handle the filter request for list fields


  $wcapfNavFilters.on('change', '.wcapf-layered-nav [type="checkbox"], .wcapf-layered-nav [type="radio"]', function (event) {
    event.preventDefault();
    var $item = $(this);
    var filterValue = $item.val();
    handleFilterRequest($item, filterValue);
  }); // TODO: Use a combination of label, checkbox and radio
  // handle the filter request for labeled item

  $wcapfNavFilters.on('click', '.wcapf-labeled-nav .item', function (event) {
    event.preventDefault();
    var $item = $(this);
    var filterValue = $item.attr('data-value');
    handleFilterRequest($item, filterValue);
  }); // handle the filter request for display type select fields

  $wcapfNavFilters.on('change', 'select', function (event) {
    event.preventDefault();
    var $item = $(this);
    var filterValue = $item.val();
    var $field = $item.closest('.wcapf-single-filter');
    var fieldID = $field.attr('data-id');
    var fieldData = fields[fieldID];
    var filterKey = fieldData.filterKey;

    if (!filterValue.length) {
      var query = wcapfRemoveQueryStringParameter(filterKey);
      history.pushState({}, '', query);
    } else {
      var filterValString = filterValue.toString();
      wcapfUpdateQueryStringParameter(filterKey, filterValString);
    } // filter products


    wcapfFilterProducts();
  }); // handle the filter request for range number

  $wcapfNumberRangeFilters.on('input', '.wcapf-range-number .min-value, .wcapf-range-number .max-value', function (event) {
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
        var query = wcapfRemoveQueryStringParameter(filterKey);
        history.pushState({}, '', query);
      } else {
        var filterValString = minValue + '+' + maxValue;
        wcapfUpdateQueryStringParameter(filterKey, filterValString);
      } // filter products


      wcapfFilterProducts();
    }, delay));
  });

  function initDatepicker() {
    var $wcapfDateFilters = $('.wcapf-date-range-filter');
    var $wcapfDateFilter = $wcapfDateFilters.find('.wcapf-date-input');
    var $dateInputs = $wcapfDateFilter.find('.date-input');
    var format = $wcapfDateFilter.attr('data-date-format');
    var yearDropdown = $wcapfDateFilter.attr('data-date-picker-year-dropdown');
    var monthDropdown = $wcapfDateFilter.attr('data-date-picker-month-dropdown');
    var filterKey = $wcapfDateFilter.attr('data-filter-key');
    var isRange = $wcapfDateFilter.attr('data-is-range');
    var rangedValues = [];
    var date;
    var $from = $wcapfDateFilter.find('.date-from-input');
    var $to = $wcapfDateFilter.find('.date-to-input');
    $from.datepicker({
      dateFormat: format,
      changeYear: yearDropdown,
      changeMonth: monthDropdown
    }); // $to.datepicker( {
    // 	dateFormat: format,
    // 	changeYear: yearDropdown,
    // 	changeMonth: monthDropdown,
    // } );
    // $from.on( 'change', function() {
    // 	const from = $( this ).val();
    //
    // 	date = from;
    // 	rangedValues.push( from );
    // 	// console.log( 'changed-from', from );
    // } );
    // $to.on( 'change', function() {
    // 	const to = $( this ).val();
    //
    // 	rangedValues.push( to );
    // 	// console.log( 'changed-to', to );
    // } );
    // if ( isRange ) {
    // 	console.log( 'range', rangedValues );
    // } else {
    // 	console.log( 'not range', date );
    // }
  }

  initDatepicker(); // history back and forward request handling

  $(window).bind('popstate', function () {
    // filter products
    wcapfFilterProducts(true);
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNob3Nlbi5qcyIsImZpbHRlci1mb3JtLmpzIl0sIm5hbWVzIjpbImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwid2NhcGZfcGFyYW1zIiwiX2RlbGF5IiwicGFyc2VJbnQiLCJmaWx0ZXJfaW5wdXRfZGVsYXkiLCJkZWxheSIsImZpZWxkcyIsIiR3Y2FwZlNpbmdsZUZpbHRlcnMiLCIkd2NhcGZOYXZGaWx0ZXJzIiwiJHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzIiwiZWFjaCIsIiRmaWVsZCIsImlkIiwiYXR0ciIsIiR3cmFwcGVyIiwiY2hpbGRyZW4iLCJmaWx0ZXJLZXkiLCJtdWx0aXBsZUZpbHRlciIsImluaXRDaG9zZW4iLCJjaG9zZW4iLCJmaW5kIiwiJHRoaXMiLCJvcHRpb25zIiwibm9SZXN1bHRzTWVzc2FnZSIsImluaXRIaWVyYXJjaHlBY2NvcmRpb24iLCJvbiIsInRvZ2dsZUNsYXNzIiwibnVtYmVyX2Zvcm1hdCIsIm51bWJlciIsImRlY2ltYWxzIiwiZGVjX3BvaW50IiwidGhvdXNhbmRzX3NlcCIsInJlcGxhY2UiLCJuIiwiaXNGaW5pdGUiLCJwcmVjIiwiTWF0aCIsImFicyIsInNlcCIsImRlYyIsInMiLCJ0b0ZpeGVkRml4IiwiayIsInBvdyIsInJvdW5kIiwic3BsaXQiLCJsZW5ndGgiLCJBcnJheSIsImpvaW4iLCJpbml0Tm9VSVNsaWRlciIsIiRpdGVtIiwiJHNsaWRlciIsImhhc0NsYXNzIiwic2xpZGVySWQiLCJkaXNwbGF5VmFsdWVzQXMiLCJyYW5nZU1pblZhbHVlIiwicGFyc2VGbG9hdCIsInJhbmdlTWF4VmFsdWUiLCJzdGVwIiwiZGVjaW1hbFBsYWNlcyIsInRob3VzYW5kU2VwYXJhdG9yIiwiZGVjaW1hbFNlcGFyYXRvciIsIm1pblZhbHVlIiwibWF4VmFsdWUiLCIkbWluVmFsdWUiLCIkbWF4VmFsdWUiLCJub1VpU2xpZGVyIiwic2xpZGVyIiwiZ2V0RWxlbWVudEJ5SWQiLCJjcmVhdGUiLCJzdGFydCIsImNvbm5lY3QiLCJyYW5nZSIsInZhbHVlcyIsImh0bWwiLCJ2YWwiLCJmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyIiwicXVlcnkiLCJ3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsImZpbHRlclZhbFN0cmluZyIsIndjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIiLCJ3Y2FwZkZpbHRlclByb2R1Y3RzIiwiY2xlYXJUaW1lb3V0IiwiZGF0YSIsInNldFRpbWVvdXQiLCJyZW1vdmVEYXRhIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsIiRpbnB1dCIsInNldCIsImdldCIsIndjYXBmQmVmb3JlVXBkYXRlIiwidHJpZ2dlciIsIndjYXBmQWZ0ZXJVcGRhdGUiLCJmb3JjZVJlUmVuZGVyIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiJGRhdGEiLCIkc2hvcExvb3BDb250YWluZXIiLCJzaG9wX2xvb3BfY29udGFpbmVyIiwiJG5vdEZvdW5kQ29udGFpbmVyIiwibm90X2ZvdW5kX2NvbnRhaW5lciIsImZpZWxkSUQiLCJfZmllbGQiLCJmaWVsZENsYXNzIiwiY3VzdG9tX3NjcmlwdHMiLCJldmFsIiwid2NhcGZHZXRVcmxWYXJzIiwidXJsIiwidmFycyIsImhhc2giLCJoYXNoZXMiLCJzbGljZSIsImluZGV4T2YiLCJoTGVuZ3RoIiwiaSIsIndjYXBmRml4UGFnaW5hdGlvbiIsInBhcmFtcyIsImN1cnJlbnRQYWdlSW5VcmwiLCJjdXJyZW50UGFnZUluUGFyYW1zIiwia2V5IiwidmFsdWUiLCJwdXNoSGlzdG9yeSIsInJlIiwiUmVnRXhwIiwic2VwYXJhdG9yIiwidXJsV2l0aFF1ZXJ5IiwibWF0Y2giLCJvbGRQYXJhbXMiLCJvbGRQYXJhbXNMZW5ndGgiLCJPYmplY3QiLCJrZXlzIiwic3RhcnRQb3NpdGlvbiIsImZpbHRlcktleVBvc2l0aW9uIiwiY2xlYW5VcmwiLCJjbGVhblF1ZXJ5IiwibmV3UGFyYW1zIiwid2NhcGZNYWtlUGFyYW1ldGVycyIsImZpbHRlclZhbHVlIiwibmV4dFZhbHVlcyIsImVtcHR5VmFsdWUiLCJwcmV2VmFsdWVzIiwicHJldlZhbHVlc0FycmF5IiwiZm91bmQiLCJpbkFycmF5Iiwic3BsaWNlIiwicHVzaCIsIndjYXBmU2luZ2xlRmlsdGVyIiwiaGFuZGxlRmlsdGVyUmVxdWVzdCIsImNsb3Nlc3QiLCJmaWVsZERhdGEiLCJ0b1N0cmluZyIsIiRyYW5nZU51bWJlciIsImluaXREYXRlcGlja2VyIiwiJHdjYXBmRGF0ZUZpbHRlcnMiLCIkd2NhcGZEYXRlRmlsdGVyIiwiJGRhdGVJbnB1dHMiLCJmb3JtYXQiLCJ5ZWFyRHJvcGRvd24iLCJtb250aERyb3Bkb3duIiwiaXNSYW5nZSIsInJhbmdlZFZhbHVlcyIsImRhdGUiLCIkZnJvbSIsIiR0byIsImRhdGVwaWNrZXIiLCJkYXRlRm9ybWF0IiwiY2hhbmdlWWVhciIsImNoYW5nZU1vbnRoIiwiYmluZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQSxNQUFNLENBQUVDLFFBQUYsQ0FBTixDQUFtQkMsS0FBbkIsQ0FBMEIsVUFBVUMsQ0FBVixFQUFjLENBSXZDLENBSkQ7OztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQyxZQUFZLEdBQUdBLFlBQVksSUFBSTtBQUNwQyx3QkFBc0IsRUFEYztBQUVwQyx5QkFBdUIsRUFGYTtBQUdwQyx5QkFBdUIsRUFIYTtBQUlwQywwQkFBd0IsRUFKWTtBQUlSO0FBQzVCLHFCQUFtQixFQUxpQjtBQUtiO0FBQ3ZCLG1CQUFpQixFQU5tQjtBQU1mO0FBQ3JCLDBCQUF3QixFQVBZO0FBT1I7QUFDNUIsb0JBQWtCO0FBUmtCLENBQXJDO0FBV0FKLE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUNDLFVBQVVDLENBQVYsRUFBYztBQUViO0FBQ0EsTUFBSyxPQUFPQyxZQUFQLEtBQXdC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QUVBa0osSUFBQUEsS0FBSyxDQUFDRSxVQUFOLENBQWtCO0FBQ2pCQyxNQUFBQSxVQUFVLEVBQUVULE1BREs7QUFFakJVLE1BQUFBLFVBQVUsRUFBRVQsWUFGSztBQUdqQlUsTUFBQUEsV0FBVyxFQUFFVDtBQUhJLEtBQWxCLEVBakJ5QixDQXVCekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVETixFQUFBQSxjQUFjLEdBbnNCRCxDQXFzQmI7O0FBQ0E1SixFQUFBQSxDQUFDLENBQUVpRyxNQUFGLENBQUQsQ0FBWTJFLElBQVosQ0FBa0IsVUFBbEIsRUFBOEIsWUFBVztBQUN4QztBQUNBekYsSUFBQUEsbUJBQW1CLENBQUUsSUFBRixDQUFuQjtBQUNBLEdBSEQ7QUFLQSxDQTVzQkYiLCJmaWxlIjoid2MtYWpheC1wcm9kdWN0LWZpbHRlci1wdWJsaWMtc2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRGlzcGxheSB0eXBlIGZpZWxkcy5cbiAqXG4gKiBUT0RPOiBNYXliZSBkZWxldGUuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cblxufSApO1xuIiwiLyoqXG4gKiBUaGUgZnJvbnRlbmQgZmlsdGVyIGZvcm0uXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvcHVibGljL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxuY29uc3Qgd2NhcGZfcGFyYW1zID0gd2NhcGZfcGFyYW1zIHx8IHtcblx0J2ZpbHRlcl9pbnB1dF9kZWxheSc6ICcnLFxuXHQnc2hvcF9sb29wX2NvbnRhaW5lcic6ICcnLFxuXHQnbm90X2ZvdW5kX2NvbnRhaW5lcic6ICcnLFxuXHQncGFnaW5hdGlvbl9jb250YWluZXInOiAnJywgLy8gdG9kb1xuXHQnc29ydGluZ19jb250cm9sJzogJycsIC8vIHRvZG9cblx0J3Njcm9sbF90b190b3AnOiAnJywgLy8gdG9kb1xuXHQnc2Nyb2xsX3RvX3RvcF9vZmZzZXQnOiAnJywgLy8gdG9kb1xuXHQnY3VzdG9tX3NjcmlwdHMnOiAnJyxcbn07XG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeShcblx0ZnVuY3Rpb24oICQgKSB7XG5cblx0XHQvLyByZXR1cm4gZmFsc2UgaWYgd2NhcGZfcGFyYW1zIHZhcmlhYmxlIGlzIG5vdCBmb3VuZFxuXHRcdGlmICggdHlwZW9mIHdjYXBmX3BhcmFtcyA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Y29uc3QgX2RlbGF5ID0gcGFyc2VJbnQoIHdjYXBmX3BhcmFtcy5maWx0ZXJfaW5wdXRfZGVsYXkgKTtcblx0XHRjb25zdCBkZWxheSAgPSBfZGVsYXkgPj0gMCA/IF9kZWxheSA6IDgwMDtcblxuXHRcdC8vIHN0b3JlIGZpZWxkcycgaWQgYW5kIGZpbHRlciBpbmZvcm1hdGlvblxuXHRcdGNvbnN0IGZpZWxkcyA9IHt9O1xuXG5cdFx0Y29uc3QgJHdjYXBmU2luZ2xlRmlsdGVycyAgICAgID0gJCggJy53Y2FwZi1zaW5nbGUtZmlsdGVyJyApO1xuXHRcdGNvbnN0ICR3Y2FwZk5hdkZpbHRlcnMgICAgICAgICA9ICQoICcud2NhcGYtbmF2LWZpbHRlcicgKTtcblx0XHRjb25zdCAkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMgPSAkKCAnLndjYXBmLW51bWJlci1yYW5nZS1maWx0ZXInICk7XG5cblx0XHQkd2NhcGZTaW5nbGVGaWx0ZXJzLmVhY2goXG5cdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkICAgICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IGlkICAgICAgICAgICAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdFx0XHRjb25zdCAkd3JhcHBlciAgICAgICA9ICRmaWVsZC5jaGlsZHJlbiggJ2RpdicgKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyS2V5ICAgICAgPSAkd3JhcHBlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0XHRjb25zdCBtdWx0aXBsZUZpbHRlciA9IHBhcnNlSW50KCAkd3JhcHBlci5hdHRyKCAnZGF0YS1tdWx0aXBsZS1maWx0ZXInICkgKTtcblxuXHRcdFx0XHRmaWVsZHNbIGlkIF0gPSB7XG5cdFx0XHRcdFx0ZmlsdGVyS2V5OiBmaWx0ZXJLZXksXG5cdFx0XHRcdFx0bXVsdGlwbGVGaWx0ZXI6IG11bHRpcGxlRmlsdGVyXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdC8vIEluaXRpYWxpemUgalF1ZXJ5IGNob3NlbiBsaWJyYXJ5XG5cdFx0ZnVuY3Rpb24gaW5pdENob3NlbigpIHtcblx0XHRcdGlmICggISBqUXVlcnkoKS5jaG9zZW4gKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0JHdjYXBmTmF2RmlsdGVycy5maW5kKCAnLndjYXBmLWNob3Nlbi1zZWxlY3QnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICR0aGlzICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IG9wdGlvbnMgPSB7fTtcblxuXHRcdFx0XHRjb25zdCBub1Jlc3VsdHNNZXNzYWdlID0gJHRoaXMuYXR0ciggJ2RhdGEtbm8tcmVzdWx0cy1tZXNzYWdlJyApO1xuXG5cdFx0XHRcdGlmICggbm9SZXN1bHRzTWVzc2FnZSApIHtcblx0XHRcdFx0XHRvcHRpb25zWyAnbm9fcmVzdWx0c190ZXh0JyBdID0gbm9SZXN1bHRzTWVzc2FnZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCR0aGlzLmNob3Nlbiggb3B0aW9ucyApO1xuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdGluaXRDaG9zZW4oKTtcblxuXHRcdC8vIEluaXRpYWxpemUgaGllcmFyY2h5IGFjY29yZGlvblxuXHRcdGZ1bmN0aW9uIGluaXRIaWVyYXJjaHlBY2NvcmRpb24oKSB7XG5cdFx0XHQkd2NhcGZOYXZGaWx0ZXJzLmZpbmQoICcuaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnICkub24oICdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKCB0aGlzICkudG9nZ2xlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0aW5pdEhpZXJhcmNoeUFjY29yZGlvbigpO1xuXG5cdFx0LyoqXG5cdFx0ICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzQxNDE4MTNcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSBudW1iZXJcblx0XHQgKiBAcGFyYW0gZGVjaW1hbHNcblx0XHQgKiBAcGFyYW0gZGVjX3BvaW50XG5cdFx0ICogQHBhcmFtIHRob3VzYW5kc19zZXBcblx0XHQgKlxuXHRcdCAqIEByZXR1cm5zIHtzdHJpbmd9XG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gbnVtYmVyX2Zvcm1hdCggbnVtYmVyLCBkZWNpbWFscywgZGVjX3BvaW50LCB0aG91c2FuZHNfc2VwICkge1xuXHRcdFx0Ly8gU3RyaXAgYWxsIGNoYXJhY3RlcnMgYnV0IG51bWVyaWNhbCBvbmVzLlxuXHRcdFx0bnVtYmVyID0gKCBudW1iZXIgKyAnJyApLnJlcGxhY2UoIC9bXlxcZCtcXC1FZS5dL2csICcnICk7XG5cblx0XHRcdGNvbnN0IG4gICAgPSAhIGlzRmluaXRlKCArbnVtYmVyICkgPyAwIDogK251bWJlcjtcblx0XHRcdGNvbnN0IHByZWMgPSAhIGlzRmluaXRlKCArZGVjaW1hbHMgKSA/IDAgOiBNYXRoLmFicyggZGVjaW1hbHMgKTtcblx0XHRcdGNvbnN0IHNlcCAgPSAoIHR5cGVvZiB0aG91c2FuZHNfc2VwID09PSAndW5kZWZpbmVkJyApID8gJywnIDogdGhvdXNhbmRzX3NlcDtcblx0XHRcdGNvbnN0IGRlYyAgPSAoIHR5cGVvZiBkZWNfcG9pbnQgPT09ICd1bmRlZmluZWQnICkgPyAnLicgOiBkZWNfcG9pbnQ7XG5cblx0XHRcdGxldCBzO1xuXG5cdFx0XHRjb25zdCB0b0ZpeGVkRml4ID0gZnVuY3Rpb24oIG4sIHByZWMgKSB7XG5cdFx0XHRcdGNvbnN0IGsgPSBNYXRoLnBvdyggMTAsIHByZWMgKTtcblx0XHRcdFx0cmV0dXJuICcnICsgTWF0aC5yb3VuZCggbiAqIGsgKSAvIGs7XG5cdFx0XHR9O1xuXG5cdFx0XHQvLyBGaXggZm9yIElFIHBhcnNlRmxvYXQoMC41NSkudG9GaXhlZCgwKSA9IDA7XG5cdFx0XHRzID0gKCBwcmVjID8gdG9GaXhlZEZpeCggbiwgcHJlYyApIDogJycgKyBNYXRoLnJvdW5kKCBuICkgKS5zcGxpdCggJy4nICk7XG5cblx0XHRcdGlmICggc1sgMCBdLmxlbmd0aCA+IDMgKSB7XG5cdFx0XHRcdHNbIDAgXSA9IHNbIDAgXS5yZXBsYWNlKCAvXFxCKD89KD86XFxkezN9KSsoPyFcXGQpKS9nLCBzZXAgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAoIHNbIDEgXSB8fCAnJyApLmxlbmd0aCA8IHByZWMgKSB7XG5cdFx0XHRcdHNbIDEgXSA9IHNbIDEgXSB8fCAnJztcblx0XHRcdFx0c1sgMSBdICs9IG5ldyBBcnJheSggcHJlYyAtIHNbIDEgXS5sZW5ndGggKyAxICkuam9pbiggJzAnICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBzLmpvaW4oIGRlYyApO1xuXHRcdH1cblxuXHRcdC8vIEluaXRpYWxpemUgbm9VSVNsaWRlclxuXHRcdGZ1bmN0aW9uIGluaXROb1VJU2xpZGVyKCkge1xuXHRcdFx0JHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzLmZpbmQoICcud2NhcGYtcmFuZ2Utc2xpZGVyJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHRjb25zdCBmaWx0ZXJLZXkgPSAkaXRlbS5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0XHRjb25zdCAkc2xpZGVyICAgPSAkaXRlbS5maW5kKCAnLndjYXBmLW5vdWktc2xpZGVyJyApO1xuXG5cdFx0XHRcdC8vIElmIHNsaWRlciBpcyBhbHJlYWR5IGluaXRpYWxpemVkIHRoZW4gZG9uJ3QgcmVpbml0aWFsaXplIGFnYWluLlxuXHRcdFx0XHRpZiAoICRzbGlkZXIuaGFzQ2xhc3MoICdub1VpLXRhcmdldCcgKSApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBzbGlkZXJJZCAgICAgICAgICA9ICRzbGlkZXIuYXR0ciggJ2lkJyApO1xuXHRcdFx0XHRjb25zdCBkaXNwbGF5VmFsdWVzQXMgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRpc3BsYXktdmFsdWVzLWFzJyApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1pblZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCByYW5nZU1heFZhbHVlICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKSApO1xuXHRcdFx0XHRjb25zdCBzdGVwICAgICAgICAgICAgICA9IHBhcnNlRmxvYXQoICRpdGVtLmF0dHIoICdkYXRhLXN0ZXAnICkgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFBsYWNlcyAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXBsYWNlcycgKTtcblx0XHRcdFx0Y29uc3QgdGhvdXNhbmRTZXBhcmF0b3IgPSAkaXRlbS5hdHRyKCAnZGF0YS10aG91c2FuZC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IGRlY2ltYWxTZXBhcmF0b3IgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGVjaW1hbC1zZXBhcmF0b3InICk7XG5cdFx0XHRcdGNvbnN0IG1pblZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IG1heFZhbHVlICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0ICRtaW5WYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5taW4tdmFsdWUnICk7XG5cdFx0XHRcdGNvbnN0ICRtYXhWYWx1ZSAgICAgICAgID0gJGl0ZW0uZmluZCggJy5tYXgtdmFsdWUnICk7XG5cblx0XHRcdFx0aWYgKCAndW5kZWZpbmVkJyA9PT0gdHlwZW9mIG5vVWlTbGlkZXIgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIHNsaWRlcklkICk7XG5cblx0XHRcdFx0bm9VaVNsaWRlci5jcmVhdGUoIHNsaWRlciwge1xuXHRcdFx0XHRcdHN0YXJ0OiBbIG1pblZhbHVlLCBtYXhWYWx1ZSBdLFxuXHRcdFx0XHRcdHN0ZXAsXG5cdFx0XHRcdFx0Y29ubmVjdDogdHJ1ZSxcblx0XHRcdFx0XHRyYW5nZToge1xuXHRcdFx0XHRcdFx0J21pbic6IHJhbmdlTWluVmFsdWUsXG5cdFx0XHRcdFx0XHQnbWF4JzogcmFuZ2VNYXhWYWx1ZSxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ3VwZGF0ZScsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdFx0Y29uc3QgbWluVmFsdWUgPSBudW1iZXJfZm9ybWF0KCB2YWx1ZXNbIDAgXSwgZGVjaW1hbFBsYWNlcywgZGVjaW1hbFNlcGFyYXRvciwgdGhvdXNhbmRTZXBhcmF0b3IgKTtcblx0XHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9IG51bWJlcl9mb3JtYXQoIHZhbHVlc1sgMSBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXG5cdFx0XHRcdFx0aWYgKCAncGxhaW5fdGV4dCcgPT09IGRpc3BsYXlWYWx1ZXNBcyApIHtcblx0XHRcdFx0XHRcdCRtaW5WYWx1ZS5odG1sKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdFx0JG1heFZhbHVlLmh0bWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRtaW5WYWx1ZS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0XHQkbWF4VmFsdWUudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApIHtcblx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMCBdICk7XG5cdFx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgPSBwYXJzZUZsb2F0KCB2YWx1ZXNbIDEgXSApO1xuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zdCBmaWx0ZXJWYWxTdHJpbmcgPSBtaW5WYWx1ZSArICcrJyArIG1heFZhbHVlO1xuXHRcdFx0XHRcdFx0d2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWxTdHJpbmcgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5vbiggJ2VuZCcsIGZ1bmN0aW9uKCB2YWx1ZXMgKSB7XG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRcdCRpdGVtLmRhdGEoICd0aW1lcicsIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCB2YWx1ZXMgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkbWluVmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG1pblZhbHVlLCBudWxsIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkbWF4VmFsdWUub24oICdpbnB1dCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaW5wdXQuZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0XHQkaW5wdXQuZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaW5wdXQucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRcdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KCBbIG51bGwsIG1heFZhbHVlIF0gKTtcblxuXHRcdFx0XHRcdFx0ZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggc2xpZGVyLm5vVWlTbGlkZXIuZ2V0KCkgKTtcblx0XHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpbml0Tm9VSVNsaWRlcigpO1xuXG5cdFx0Ly8gc2hvdyBhIGxvYWRpbmcgaW5kaWNhdG9yXG5cdFx0ZnVuY3Rpb24gd2NhcGZCZWZvcmVVcGRhdGUoKSB7XG5cdFx0XHQkKCAnYm9keScgKS50cmlnZ2VyKCAnd2NhcGZfYmVmb3JlX3VwZGF0ZV9maWx0ZXJzJyApO1xuXHRcdH1cblxuXHRcdC8vIHNjcm9sbCB0byB0b3Bcblx0XHRmdW5jdGlvbiB3Y2FwZkFmdGVyVXBkYXRlKCkge1xuXHRcdFx0aW5pdENob3NlbigpO1xuXHRcdFx0aW5pdEhpZXJhcmNoeUFjY29yZGlvbigpO1xuXHRcdFx0aW5pdE5vVUlTbGlkZXIoKTtcblxuXHRcdFx0JCggJ2JvZHknICkudHJpZ2dlciggJ3djYXBmX2FmdGVyX3VwZGF0ZV9maWx0ZXJzJyApO1xuXHRcdH1cblxuXHRcdC8vIGZpbHRlciB0aGUgcHJvZHVjdHNcblx0XHRmdW5jdGlvbiB3Y2FwZkZpbHRlclByb2R1Y3RzKCBmb3JjZVJlUmVuZGVyID0gZmFsc2UgKSB7XG5cdFx0XHR3Y2FwZkJlZm9yZVVwZGF0ZSgpO1xuXG5cdFx0XHQkLmdldChcblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYsXG5cdFx0XHRcdGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdFx0XHRcdGNvbnN0ICRkYXRhID0gJCggZGF0YSApO1xuXG5cdFx0XHRcdFx0Y29uc3QgJHNob3BMb29wQ29udGFpbmVyID0gJGRhdGEuZmluZCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKTtcblx0XHRcdFx0XHRjb25zdCAkbm90Rm91bmRDb250YWluZXIgPSAkZGF0YS5maW5kKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApO1xuXG5cdFx0XHRcdFx0Ly8gcmVwbGFjZSBmaWVsZHMnIGRhdGEgd2l0aCBuZXcgZGF0YVxuXHRcdFx0XHRcdCQuZWFjaChcblx0XHRcdFx0XHRcdGZpZWxkcyxcblx0XHRcdFx0XHRcdGZ1bmN0aW9uKCBpZCApIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgZmllbGRJRCAgICA9ICdbZGF0YS1pZD1cIicgKyBpZCArICdcIl0nO1xuXHRcdFx0XHRcdFx0XHRjb25zdCAkZmllbGQgICAgID0gJCggZmllbGRJRCApO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBfZmllbGQgICAgID0gJGRhdGEuZmluZCggZmllbGRJRCApO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBmaWVsZENsYXNzID0gJCggX2ZpZWxkICkuYXR0ciggJ2NsYXNzJyApO1xuXG5cdFx0XHRcdFx0XHRcdC8vIFdoZW4gY2FsbGVkIGZyb20gaGlzdG9yeSBiYWNrIG9yIGZvcndhcmQgcmVxdWVzdCB0aGVuIHJlcmVuZGVyIGFsbCBmaWVsZHMuXG5cdFx0XHRcdFx0XHRcdGlmICggZm9yY2VSZVJlbmRlciApIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIHVwZGF0ZSBjbGFzc1xuXHRcdFx0XHRcdFx0XHRcdCRmaWVsZC5hdHRyKCAnY2xhc3MnLCBmaWVsZENsYXNzICk7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyB1cGRhdGUgZmllbGRcblx0XHRcdFx0XHRcdFx0XHQkZmllbGQuaHRtbCggX2ZpZWxkLmh0bWwoKSApO1xuXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBTZWxlY3RpdmVseSByZXJlbmRlciB0aGUgZmllbGRzLlxuXHRcdFx0XHRcdFx0XHRcdGlmICggJGZpZWxkLmhhc0NsYXNzKCAnd2NhcGYtbmF2LWZpbHRlcicgKSApIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gdXBkYXRlIGNsYXNzXG5cdFx0XHRcdFx0XHRcdFx0XHQkZmllbGQuYXR0ciggJ2NsYXNzJywgZmllbGRDbGFzcyApO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyB1cGRhdGUgZmllbGRcblx0XHRcdFx0XHRcdFx0XHRcdCRmaWVsZC5odG1sKCBfZmllbGQuaHRtbCgpICk7XG5cblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHQvLyByZXBsYWNlIG9sZCBzaG9wIGxvb3Agd2l0aCBuZXcgb25lXG5cdFx0XHRcdFx0aWYgKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciA9PT0gd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKSB7XG5cdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKCAkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAkc2hvcExvb3BDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAkbm90Rm91bmRDb250YWluZXIubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJG5vdEZvdW5kQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0d2NhcGZBZnRlclVwZGF0ZSgpO1xuXG5cdFx0XHRcdFx0Ly8gdG9kb1xuXHRcdFx0XHRcdC8vIHJlaW5pdGlhbGl6ZSBvcmRlcmluZ1xuXHRcdFx0XHRcdC8vIHdjYXBmSW5pdE9yZGVyKCk7XG5cblx0XHRcdFx0XHQvLyB0b2RvXG5cdFx0XHRcdFx0Ly8gcmVpbml0aWFsaXplIGRyb3Bkb3duIGZpbHRlclxuXHRcdFx0XHRcdC8vIHdjYXBmRHJvcERvd25GaWx0ZXIoKTtcblxuXHRcdFx0XHRcdC8vIHJ1biBzY3JpcHRzIGFmdGVyIHNob3AgbG9vcCB1bmRhdGVkXG5cdFx0XHRcdFx0aWYgKCB0eXBlb2Ygd2NhcGZfcGFyYW1zLmN1c3RvbV9zY3JpcHRzICE9PSAndW5kZWZpbmVkJyAmJiB3Y2FwZl9wYXJhbXMuY3VzdG9tX3NjcmlwdHMubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRcdGV2YWwoIHdjYXBmX3BhcmFtcy5jdXN0b21fc2NyaXB0cyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHQvLyBVUkwgUGFyc2VyXG5cdFx0ZnVuY3Rpb24gd2NhcGZHZXRVcmxWYXJzKCB1cmwgKSB7XG5cdFx0XHRsZXQgdmFycyA9IHt9LCBoYXNoO1xuXG5cdFx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHR1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaGFzaGVzICA9IHVybC5zbGljZSggdXJsLmluZGV4T2YoICc/JyApICsgMSApLnNwbGl0KCAnJicgKTtcblx0XHRcdGNvbnN0IGhMZW5ndGggPSBoYXNoZXMubGVuZ3RoO1xuXG5cdFx0XHRmb3IgKCBsZXQgaSA9IDA7IGkgPCBoTGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdGhhc2ggPSBoYXNoZXNbIGkgXS5zcGxpdCggJz0nICk7XG5cblx0XHRcdFx0dmFyc1sgaGFzaFsgMCBdIF0gPSBoYXNoWyAxIF07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB2YXJzO1xuXHRcdH1cblxuXHRcdC8vIGV2ZXJ5dGltZSB3ZSBhcHBseSB0aGUgZmlsdGVyIHdlIHNldCB0aGUgY3VycmVudCBwYWdlIHRvIDFcblx0XHRmdW5jdGlvbiB3Y2FwZkZpeFBhZ2luYXRpb24oKSB7XG5cdFx0XHRsZXQgdXJsICAgICAgICAgICAgICAgID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0XHRjb25zdCBwYXJhbXMgICAgICAgICAgID0gd2NhcGZHZXRVcmxWYXJzKCB1cmwgKTtcblx0XHRcdGNvbnN0IGN1cnJlbnRQYWdlSW5VcmwgPSBwYXJzZUludCggdXJsLnJlcGxhY2UoIC8uK1xcL3BhZ2VcXC8oXFxkKykrLywgJyQxJyApICk7XG5cblx0XHRcdGlmICggY3VycmVudFBhZ2VJblVybCApIHtcblx0XHRcdFx0aWYgKCBjdXJyZW50UGFnZUluVXJsID4gMSApIHtcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSggL3BhZ2VcXC8oXFxkKykvLCAncGFnZS8xJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKCB0eXBlb2YgcGFyYW1zWyAncGFnZWQnIF0gIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHRjb25zdCBjdXJyZW50UGFnZUluUGFyYW1zID0gcGFyc2VJbnQoIHBhcmFtc1sgJ3BhZ2VkJyBdICk7XG5cblx0XHRcdFx0aWYgKCBjdXJyZW50UGFnZUluUGFyYW1zID4gMSApIHtcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSggJ3BhZ2VkPScgKyBjdXJyZW50UGFnZUluUGFyYW1zLCAncGFnZWQ9MScgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdXJsO1xuXHRcdH1cblxuXHRcdC8vIHVwZGF0ZSBxdWVyeSBzdHJpbmcgZm9yIGNhdGVnb3JpZXMsIG1ldGEgZXRjLi5cblx0XHRmdW5jdGlvbiB3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBrZXksIHZhbHVlLCBwdXNoSGlzdG9yeSwgdXJsICkge1xuXHRcdFx0aWYgKCB0eXBlb2YgcHVzaEhpc3RvcnkgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHRwdXNoSGlzdG9yeSA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdHVybCA9IHdjYXBmRml4UGFnaW5hdGlvbigpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCByZSAgICAgICAgPSBuZXcgUmVnRXhwKCAnKFs/Jl0pJyArIGtleSArICc9Lio/KCZ8JCknLCAnaScgKTtcblx0XHRcdGNvbnN0IHNlcGFyYXRvciA9IHVybC5pbmRleE9mKCAnPycgKSAhPT0gLTEgPyAnJicgOiAnPyc7XG5cdFx0XHRsZXQgdXJsV2l0aFF1ZXJ5O1xuXG5cdFx0XHRpZiAoIHVybC5tYXRjaCggcmUgKSApIHtcblx0XHRcdFx0dXJsV2l0aFF1ZXJ5ID0gdXJsLnJlcGxhY2UoIHJlLCAnJDEnICsga2V5ICsgJz0nICsgdmFsdWUgKyAnJDInICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR1cmxXaXRoUXVlcnkgPSB1cmwgKyBzZXBhcmF0b3IgKyBrZXkgKyAnPScgKyB2YWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBwdXNoSGlzdG9yeSA9PT0gdHJ1ZSApIHtcblx0XHRcdFx0cmV0dXJuIGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHVybFdpdGhRdWVyeSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHVybFdpdGhRdWVyeTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyByZW1vdmUgcGFyYW1ldGVyIGZyb20gdXJsXG5cdFx0ZnVuY3Rpb24gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCB1cmwgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHR1cmwgPSB3Y2FwZkZpeFBhZ2luYXRpb24oKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgb2xkUGFyYW1zICAgICAgICAgPSB3Y2FwZkdldFVybFZhcnMoIHVybCApO1xuXHRcdFx0Y29uc3Qgb2xkUGFyYW1zTGVuZ3RoICAgPSBPYmplY3Qua2V5cyggb2xkUGFyYW1zICkubGVuZ3RoO1xuXHRcdFx0Y29uc3Qgc3RhcnRQb3NpdGlvbiAgICAgPSB1cmwuaW5kZXhPZiggJz8nICk7XG5cdFx0XHRjb25zdCBmaWx0ZXJLZXlQb3NpdGlvbiA9IHVybC5pbmRleE9mKCBmaWx0ZXJLZXkgKTtcblx0XHRcdGxldCBjbGVhblVybCwgY2xlYW5RdWVyeTtcblxuXHRcdFx0aWYgKCBvbGRQYXJhbXNMZW5ndGggPiAxICkge1xuXHRcdFx0XHRpZiAoICggZmlsdGVyS2V5UG9zaXRpb24gLSBzdGFydFBvc2l0aW9uICkgPiAxICkge1xuXHRcdFx0XHRcdGNsZWFuVXJsID0gdXJsLnJlcGxhY2UoICcmJyArIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0sICcnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y2xlYW5VcmwgPSB1cmwucmVwbGFjZSggZmlsdGVyS2V5ICsgJz0nICsgb2xkUGFyYW1zWyBmaWx0ZXJLZXkgXSArICcmJywgJycgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IG5ld1BhcmFtcyA9IGNsZWFuVXJsLnNwbGl0KCAnPycgKTtcblx0XHRcdFx0Y2xlYW5RdWVyeSAgICAgID0gJz8nICsgbmV3UGFyYW1zWyAxIF07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjbGVhblF1ZXJ5ID0gdXJsLnJlcGxhY2UoICc/JyArIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0sICcnICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBjbGVhblF1ZXJ5O1xuXHRcdH1cblxuXHRcdC8vIHRha2UgdGhlIGtleSBhbmQgdmFsdWUgYW5kIG1ha2UgcXVlcnlcblx0XHRmdW5jdGlvbiB3Y2FwZk1ha2VQYXJhbWV0ZXJzKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlLCB1cmwgKSB7XG5cdFx0XHRsZXQgcGFyYW1zLCBuZXh0VmFsdWVzLCBlbXB0eVZhbHVlID0gZmFsc2U7XG5cblx0XHRcdGlmICggdHlwZW9mIHVybCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdHBhcmFtcyA9IHdjYXBmR2V0VXJsVmFycyggdXJsICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwYXJhbXMgPSB3Y2FwZkdldFVybFZhcnMoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCB0eXBlb2YgcGFyYW1zWyBmaWx0ZXJLZXkgXSAhPSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0Y29uc3QgcHJldlZhbHVlcyAgICAgID0gcGFyYW1zWyBmaWx0ZXJLZXkgXTtcblx0XHRcdFx0Y29uc3QgcHJldlZhbHVlc0FycmF5ID0gcHJldlZhbHVlcy5zcGxpdCggJywnICk7XG5cblx0XHRcdFx0aWYgKCBwcmV2VmFsdWVzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0Y29uc3QgZm91bmQgPSAkLmluQXJyYXkoIGZpbHRlclZhbHVlLCBwcmV2VmFsdWVzQXJyYXkgKTtcblxuXHRcdFx0XHRcdGlmICggZm91bmQgPj0gMCApIHtcblx0XHRcdFx0XHRcdC8vIEVsZW1lbnQgd2FzIGZvdW5kLCByZW1vdmUgaXQuXG5cdFx0XHRcdFx0XHRwcmV2VmFsdWVzQXJyYXkuc3BsaWNlKCBmb3VuZCwgMSApO1xuXG5cdFx0XHRcdFx0XHRpZiAoIHByZXZWYWx1ZXNBcnJheS5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRcdFx0XHRcdGVtcHR5VmFsdWUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBFbGVtZW50IHdhcyBub3QgZm91bmQsIGFkZCBpdC5cblx0XHRcdFx0XHRcdHByZXZWYWx1ZXNBcnJheS5wdXNoKCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggcHJldlZhbHVlc0FycmF5Lmxlbmd0aCA+IDEgKSB7XG5cdFx0XHRcdFx0XHRuZXh0VmFsdWVzID0gcHJldlZhbHVlc0FycmF5LmpvaW4oICcsJyApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRuZXh0VmFsdWVzID0gcHJldlZhbHVlc0FycmF5O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRuZXh0VmFsdWVzID0gZmlsdGVyVmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5leHRWYWx1ZXMgPSBmaWx0ZXJWYWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gdXBkYXRlIHVybCBhbmQgcXVlcnkgc3RyaW5nXG5cdFx0XHRpZiAoICEgZW1wdHlWYWx1ZSApIHtcblx0XHRcdFx0d2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBuZXh0VmFsdWVzICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB3Y2FwZlNpbmdsZUZpbHRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRcdGNvbnN0IHBhcmFtcyA9IHdjYXBmR2V0VXJsVmFycygpO1xuXHRcdFx0bGV0IHF1ZXJ5O1xuXG5cdFx0XHRpZiAoIHR5cGVvZiBwYXJhbXNbIGZpbHRlcktleSBdICE9PSAndW5kZWZpbmVkJyAmJiBwYXJhbXNbIGZpbHRlcktleSBdID09PSBmaWx0ZXJWYWx1ZSApIHtcblx0XHRcdFx0cXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHF1ZXJ5ID0gd2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSwgZmFsc2UgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gdXBkYXRlIHVybFxuXHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cdFx0fVxuXG5cdFx0Ly8gVGhlIG1haW4gZnVuY3Rpb24gdG8gaGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdFxuXHRcdGZ1bmN0aW9uIGhhbmRsZUZpbHRlclJlcXVlc3QoICRpdGVtLCBmaWx0ZXJWYWx1ZSApIHtcblx0XHRcdGNvbnN0ICRmaWVsZCAgICAgICAgID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1zaW5nbGUtZmlsdGVyJyApO1xuXHRcdFx0Y29uc3QgZmllbGRJRCAgICAgICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtaWQnICk7XG5cdFx0XHRjb25zdCBmaWVsZERhdGEgICAgICA9IGZpZWxkc1sgZmllbGRJRCBdO1xuXHRcdFx0Y29uc3QgZmlsdGVyS2V5ICAgICAgPSBmaWVsZERhdGEuZmlsdGVyS2V5O1xuXHRcdFx0Y29uc3QgbXVsdGlwbGVGaWx0ZXIgPSBmaWVsZERhdGEubXVsdGlwbGVGaWx0ZXI7XG5cblx0XHRcdGlmICggISBmaWx0ZXJLZXkgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAhIGZpbHRlclZhbHVlLmxlbmd0aCApIHtcblx0XHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblxuXHRcdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBtdWx0aXBsZUZpbHRlciApIHtcblx0XHRcdFx0d2NhcGZNYWtlUGFyYW1ldGVycyggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0d2NhcGZTaW5nbGVGaWx0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBoYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciBsaXN0IGZpZWxkc1xuXHRcdCR3Y2FwZk5hdkZpbHRlcnMub24oXG5cdFx0XHQnY2hhbmdlJyxcblx0XHRcdCcud2NhcGYtbGF5ZXJlZC1uYXYgW3R5cGU9XCJjaGVja2JveFwiXSwgLndjYXBmLWxheWVyZWQtbmF2IFt0eXBlPVwicmFkaW9cIl0nLFxuXHRcdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpdGVtICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLnZhbCgpO1xuXG5cdFx0XHRcdGhhbmRsZUZpbHRlclJlcXVlc3QoICRpdGVtLCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHQvLyBUT0RPOiBVc2UgYSBjb21iaW5hdGlvbiBvZiBsYWJlbCwgY2hlY2tib3ggYW5kIHJhZGlvXG5cdFx0Ly8gaGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgbGFiZWxlZCBpdGVtXG5cdFx0JHdjYXBmTmF2RmlsdGVycy5vbihcblx0XHRcdCdjbGljaycsXG5cdFx0XHQnLndjYXBmLWxhYmVsZWQtbmF2IC5pdGVtJyxcblx0XHRcdGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyVmFsdWUgPSAkaXRlbS5hdHRyKCAnZGF0YS12YWx1ZScgKTtcblxuXHRcdFx0XHRoYW5kbGVGaWx0ZXJSZXF1ZXN0KCAkaXRlbSwgZmlsdGVyVmFsdWUgKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0Ly8gaGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgZGlzcGxheSB0eXBlIHNlbGVjdCBmaWVsZHNcblx0XHQkd2NhcGZOYXZGaWx0ZXJzLm9uKFxuXHRcdFx0J2NoYW5nZScsXG5cdFx0XHQnc2VsZWN0Jyxcblx0XHRcdGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyVmFsdWUgPSAkaXRlbS52YWwoKTtcblxuXHRcdFx0XHRjb25zdCAkZmllbGQgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXNpbmdsZS1maWx0ZXInICk7XG5cdFx0XHRcdGNvbnN0IGZpZWxkSUQgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRcdFx0Y29uc3QgZmllbGREYXRhID0gZmllbGRzWyBmaWVsZElEIF07XG5cdFx0XHRcdGNvbnN0IGZpbHRlcktleSA9IGZpZWxkRGF0YS5maWx0ZXJLZXk7XG5cblx0XHRcdFx0aWYgKCAhIGZpbHRlclZhbHVlLmxlbmd0aCApIHtcblx0XHRcdFx0XHRjb25zdCBxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc3QgZmlsdGVyVmFsU3RyaW5nID0gZmlsdGVyVmFsdWUudG9TdHJpbmcoKTtcblx0XHRcdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbFN0cmluZyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0Ly8gaGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgcmFuZ2UgbnVtYmVyXG5cdFx0JHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzLm9uKFxuXHRcdFx0J2lucHV0Jyxcblx0XHRcdCcud2NhcGYtcmFuZ2UtbnVtYmVyIC5taW4tdmFsdWUsIC53Y2FwZi1yYW5nZS1udW1iZXIgLm1heC12YWx1ZScsXG5cdFx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Ly8gQ2xlYXIgYW55IHByZXZpb3VzbHkgc2V0IHRpbWVyIGJlZm9yZSBzZXR0aW5nIGEgZnJlc2ggb25lXG5cdFx0XHRcdGNsZWFyVGltZW91dCggJGl0ZW0uZGF0YSggJ3RpbWVyJyApICk7XG5cblx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JGl0ZW0ucmVtb3ZlRGF0YSggJ3RpbWVyJyApO1xuXG5cdFx0XHRcdFx0Y29uc3QgJHJhbmdlTnVtYmVyICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtcmFuZ2UtbnVtYmVyJyApO1xuXHRcdFx0XHRcdGNvbnN0IGZpbHRlcktleSAgICAgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRcdFx0XHRjb25zdCByYW5nZU1pblZhbHVlID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1pbi12YWx1ZScgKTtcblx0XHRcdFx0XHRjb25zdCByYW5nZU1heFZhbHVlID0gJHJhbmdlTnVtYmVyLmF0dHIoICdkYXRhLXJhbmdlLW1heC12YWx1ZScgKTtcblx0XHRcdFx0XHRsZXQgbWluVmFsdWUgICAgICAgID0gJHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCgpO1xuXHRcdFx0XHRcdGxldCBtYXhWYWx1ZSAgICAgICAgPSAkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCk7XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWluVmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0XHRcdGlmICggISBtaW5WYWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBiZSBlbXB0eS5cblx0XHRcdFx0XHRpZiAoICEgbWF4VmFsdWUubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gYmVsb3cgdGhlIHJhbmdlTWluVmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBwYXJzZUZsb2F0KCBtaW5WYWx1ZSApIDwgcGFyc2VGbG9hdCggcmFuZ2VNaW5WYWx1ZSApICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBwYXJzZUZsb2F0KCBtaW5WYWx1ZSApID4gcGFyc2VGbG9hdCggcmFuZ2VNYXhWYWx1ZSApICkge1xuXHRcdFx0XHRcdFx0bWluVmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCBtaW5WYWx1ZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gZ28gdXAgdGhlIHJhbmdlTWF4VmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBwYXJzZUZsb2F0KCBtYXhWYWx1ZSApID4gcGFyc2VGbG9hdCggcmFuZ2VNYXhWYWx1ZSApICkge1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSByYW5nZU1heFZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtYXhWYWx1ZSBub3QgdG8gZ28gYmVsb3cgdGhlIG1pblZhbHVlLlxuXHRcdFx0XHRcdGlmICggcGFyc2VGbG9hdCggbWluVmFsdWUgKSA+IHBhcnNlRmxvYXQoIG1heFZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IG1pblZhbHVlO1xuXG5cdFx0XHRcdFx0XHQkcmFuZ2VOdW1iZXIuZmluZCggJy5tYXgtdmFsdWUnICkudmFsKCBtYXhWYWx1ZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggbWluVmFsdWUgPT09IHJhbmdlTWluVmFsdWUgJiYgbWF4VmFsdWUgPT09IHJhbmdlTWF4VmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc3QgZmlsdGVyVmFsU3RyaW5nID0gbWluVmFsdWUgKyAnKycgKyBtYXhWYWx1ZTtcblx0XHRcdFx0XHRcdHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsU3RyaW5nICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0XHR9LCBkZWxheSApICk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdGZ1bmN0aW9uIGluaXREYXRlcGlja2VyKCkge1xuXHRcdFx0Y29uc3QgJHdjYXBmRGF0ZUZpbHRlcnMgPSAkKCAnLndjYXBmLWRhdGUtcmFuZ2UtZmlsdGVyJyApO1xuXHRcdFx0Y29uc3QgJHdjYXBmRGF0ZUZpbHRlciAgPSAkd2NhcGZEYXRlRmlsdGVycy5maW5kKCAnLndjYXBmLWRhdGUtaW5wdXQnICk7XG5cdFx0XHRjb25zdCAkZGF0ZUlucHV0cyAgICAgICA9ICR3Y2FwZkRhdGVGaWx0ZXIuZmluZCggJy5kYXRlLWlucHV0JyApO1xuXG5cdFx0XHRjb25zdCBmb3JtYXQgICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLWZvcm1hdCcgKTtcblx0XHRcdGNvbnN0IHllYXJEcm9wZG93biAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWRhdGUtcGlja2VyLXllYXItZHJvcGRvd24nICk7XG5cdFx0XHRjb25zdCBtb250aERyb3Bkb3duID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1kYXRlLXBpY2tlci1tb250aC1kcm9wZG93bicgKTtcblx0XHRcdGNvbnN0IGZpbHRlcktleSAgICAgPSAkd2NhcGZEYXRlRmlsdGVyLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0XHRjb25zdCBpc1JhbmdlICAgICAgID0gJHdjYXBmRGF0ZUZpbHRlci5hdHRyKCAnZGF0YS1pcy1yYW5nZScgKTtcblxuXHRcdFx0Y29uc3QgcmFuZ2VkVmFsdWVzID0gW107XG5cdFx0XHRsZXQgZGF0ZTtcblxuXHRcdFx0Y29uc3QgJGZyb20gPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS1mcm9tLWlucHV0JyApO1xuXHRcdFx0Y29uc3QgJHRvICAgPSAkd2NhcGZEYXRlRmlsdGVyLmZpbmQoICcuZGF0ZS10by1pbnB1dCcgKTtcblxuXHRcdFx0JGZyb20uZGF0ZXBpY2tlcigge1xuXHRcdFx0XHRkYXRlRm9ybWF0OiBmb3JtYXQsXG5cdFx0XHRcdGNoYW5nZVllYXI6IHllYXJEcm9wZG93bixcblx0XHRcdFx0Y2hhbmdlTW9udGg6IG1vbnRoRHJvcGRvd24sXG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vICR0by5kYXRlcGlja2VyKCB7XG5cdFx0XHQvLyBcdGRhdGVGb3JtYXQ6IGZvcm1hdCxcblx0XHRcdC8vIFx0Y2hhbmdlWWVhcjogeWVhckRyb3Bkb3duLFxuXHRcdFx0Ly8gXHRjaGFuZ2VNb250aDogbW9udGhEcm9wZG93bixcblx0XHRcdC8vIH0gKTtcblxuXHRcdFx0Ly8gJGZyb20ub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdC8vIFx0Y29uc3QgZnJvbSA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdC8vXG5cdFx0XHQvLyBcdGRhdGUgPSBmcm9tO1xuXHRcdFx0Ly8gXHRyYW5nZWRWYWx1ZXMucHVzaCggZnJvbSApO1xuXHRcdFx0Ly8gXHQvLyBjb25zb2xlLmxvZyggJ2NoYW5nZWQtZnJvbScsIGZyb20gKTtcblx0XHRcdC8vIH0gKTtcblxuXHRcdFx0Ly8gJHRvLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBcdGNvbnN0IHRvID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0Ly9cblx0XHRcdC8vIFx0cmFuZ2VkVmFsdWVzLnB1c2goIHRvICk7XG5cdFx0XHQvLyBcdC8vIGNvbnNvbGUubG9nKCAnY2hhbmdlZC10bycsIHRvICk7XG5cdFx0XHQvLyB9ICk7XG5cblx0XHRcdC8vIGlmICggaXNSYW5nZSApIHtcblx0XHRcdC8vIFx0Y29uc29sZS5sb2coICdyYW5nZScsIHJhbmdlZFZhbHVlcyApO1xuXHRcdFx0Ly8gfSBlbHNlIHtcblx0XHRcdC8vIFx0Y29uc29sZS5sb2coICdub3QgcmFuZ2UnLCBkYXRlICk7XG5cdFx0XHQvLyB9XG5cdFx0fVxuXG5cdFx0aW5pdERhdGVwaWNrZXIoKTtcblxuXHRcdC8vIGhpc3RvcnkgYmFjayBhbmQgZm9yd2FyZCByZXF1ZXN0IGhhbmRsaW5nXG5cdFx0JCggd2luZG93ICkuYmluZCggJ3BvcHN0YXRlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoIHRydWUgKTtcblx0XHR9ICk7XG5cblx0fVxuKTtcbiJdfQ==
