"use strict";

/**
 * Display type fields.
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
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
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
  }); // history back and forward request handling

  $(window).bind('popstate', function () {
    // filter products
    wcapfFilterProducts(true);
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNob3Nlbi5qcyIsImZpbHRlci1mb3JtLmpzIl0sIm5hbWVzIjpbImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwid2NhcGZfcGFyYW1zIiwiX2RlbGF5IiwicGFyc2VJbnQiLCJmaWx0ZXJfaW5wdXRfZGVsYXkiLCJkZWxheSIsImZpZWxkcyIsIiR3Y2FwZlNpbmdsZUZpbHRlcnMiLCIkd2NhcGZOYXZGaWx0ZXJzIiwiJHdjYXBmTnVtYmVyUmFuZ2VGaWx0ZXJzIiwiZWFjaCIsIiRmaWVsZCIsImlkIiwiYXR0ciIsIiR3cmFwcGVyIiwiY2hpbGRyZW4iLCJmaWx0ZXJLZXkiLCJtdWx0aXBsZUZpbHRlciIsImluaXRDaG9zZW4iLCJjaG9zZW4iLCJmaW5kIiwiJHRoaXMiLCJvcHRpb25zIiwibm9SZXN1bHRzTWVzc2FnZSIsImluaXRIaWVyYXJjaHlBY2NvcmRpb24iLCJvbiIsInRvZ2dsZUNsYXNzIiwibnVtYmVyX2Zvcm1hdCIsIm51bWJlciIsImRlY2ltYWxzIiwiZGVjX3BvaW50IiwidGhvdXNhbmRzX3NlcCIsInJlcGxhY2UiLCJuIiwiaXNGaW5pdGUiLCJwcmVjIiwiTWF0aCIsImFicyIsInNlcCIsImRlYyIsInMiLCJ0b0ZpeGVkRml4IiwiayIsInBvdyIsInJvdW5kIiwic3BsaXQiLCJsZW5ndGgiLCJBcnJheSIsImpvaW4iLCJpbml0Tm9VSVNsaWRlciIsIiRpdGVtIiwiJHNsaWRlciIsImhhc0NsYXNzIiwic2xpZGVySWQiLCJkaXNwbGF5VmFsdWVzQXMiLCJyYW5nZU1pblZhbHVlIiwicGFyc2VGbG9hdCIsInJhbmdlTWF4VmFsdWUiLCJzdGVwIiwiZGVjaW1hbFBsYWNlcyIsInRob3VzYW5kU2VwYXJhdG9yIiwiZGVjaW1hbFNlcGFyYXRvciIsIm1pblZhbHVlIiwibWF4VmFsdWUiLCIkbWluVmFsdWUiLCIkbWF4VmFsdWUiLCJub1VpU2xpZGVyIiwic2xpZGVyIiwiZ2V0RWxlbWVudEJ5SWQiLCJjcmVhdGUiLCJzdGFydCIsImNvbm5lY3QiLCJyYW5nZSIsInZhbHVlcyIsImh0bWwiLCJ2YWwiLCJmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyIiwicXVlcnkiLCJ3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsImZpbHRlclZhbFN0cmluZyIsIndjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIiLCJ3Y2FwZkZpbHRlclByb2R1Y3RzIiwiY2xlYXJUaW1lb3V0IiwiZGF0YSIsInNldFRpbWVvdXQiLCJyZW1vdmVEYXRhIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsIiRpbnB1dCIsInNldCIsImdldCIsIndjYXBmQmVmb3JlVXBkYXRlIiwidHJpZ2dlciIsIndjYXBmQWZ0ZXJVcGRhdGUiLCJmb3JjZVJlUmVuZGVyIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiJGRhdGEiLCIkc2hvcExvb3BDb250YWluZXIiLCJzaG9wX2xvb3BfY29udGFpbmVyIiwiJG5vdEZvdW5kQ29udGFpbmVyIiwibm90X2ZvdW5kX2NvbnRhaW5lciIsImZpZWxkSUQiLCJfZmllbGQiLCJmaWVsZENsYXNzIiwiY3VzdG9tX3NjcmlwdHMiLCJldmFsIiwid2NhcGZHZXRVcmxWYXJzIiwidXJsIiwidmFycyIsImhhc2giLCJoYXNoZXMiLCJzbGljZSIsImluZGV4T2YiLCJoTGVuZ3RoIiwiaSIsIndjYXBmRml4UGFnaW5hdGlvbiIsInBhcmFtcyIsImN1cnJlbnRQYWdlSW5VcmwiLCJjdXJyZW50UGFnZUluUGFyYW1zIiwia2V5IiwidmFsdWUiLCJwdXNoSGlzdG9yeSIsInJlIiwiUmVnRXhwIiwic2VwYXJhdG9yIiwidXJsV2l0aFF1ZXJ5IiwibWF0Y2giLCJvbGRQYXJhbXMiLCJvbGRQYXJhbXNMZW5ndGgiLCJPYmplY3QiLCJrZXlzIiwic3RhcnRQb3NpdGlvbiIsImZpbHRlcktleVBvc2l0aW9uIiwiY2xlYW5VcmwiLCJjbGVhblF1ZXJ5IiwibmV3UGFyYW1zIiwid2NhcGZNYWtlUGFyYW1ldGVycyIsImZpbHRlclZhbHVlIiwibmV4dFZhbHVlcyIsImVtcHR5VmFsdWUiLCJwcmV2VmFsdWVzIiwicHJldlZhbHVlc0FycmF5IiwiZm91bmQiLCJpbkFycmF5Iiwic3BsaWNlIiwicHVzaCIsIndjYXBmU2luZ2xlRmlsdGVyIiwiaGFuZGxlRmlsdGVyUmVxdWVzdCIsImNsb3Nlc3QiLCJmaWVsZERhdGEiLCJ0b1N0cmluZyIsIiRyYW5nZU51bWJlciIsImJpbmQiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQSxNQUFNLENBQUVDLFFBQUYsQ0FBTixDQUFtQkMsS0FBbkIsQ0FBMEIsVUFBVUMsQ0FBVixFQUFjLENBSXZDLENBSkQ7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQyxZQUFZLEdBQUdBLFlBQVksSUFBSTtBQUNwQyx3QkFBc0IsRUFEYztBQUVwQyx5QkFBdUIsRUFGYTtBQUdwQyx5QkFBdUIsRUFIYTtBQUlwQywwQkFBd0IsRUFKWTtBQUlSO0FBQzVCLHFCQUFtQixFQUxpQjtBQUtiO0FBQ3ZCLG1CQUFpQixFQU5tQjtBQU1mO0FBQ3JCLDBCQUF3QixFQVBZO0FBT1I7QUFDNUIsb0JBQWtCO0FBUmtCLENBQXJDO0FBV0FKLE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUNDLFVBQVVDLENBQVYsRUFBYztBQUViO0FBQ0EsTUFBSyxPQUFPQyxZQUFQLEtBQXdCLFdBQTdCLEVBQTJDO0FBQzFDLFdBQU8sS0FBUDtBQUNBOztBQUVELE1BQU1DLE1BQU0sR0FBR0MsUUFBUSxDQUFFRixZQUFZLENBQUNHLGtCQUFmLENBQXZCOztBQUNBLE1BQU1DLEtBQUssR0FBSUgsTUFBTSxJQUFJLENBQVYsR0FBY0EsTUFBZCxHQUF1QixHQUF0QyxDQVJhLENBVWI7O0FBQ0EsTUFBTUksTUFBTSxHQUFHLEVBQWY7QUFFQSxNQUFNQyxtQkFBbUIsR0FBUVAsQ0FBQyxD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QSxHQTFFRixFQW5rQmEsQ0FncEJiOztBQUNBTCxFQUFBQSxDQUFDLENBQUVpRyxNQUFGLENBQUQsQ0FBWTJELElBQVosQ0FBa0IsVUFBbEIsRUFBOEIsWUFBVztBQUN4QztBQUNBekUsSUFBQUEsbUJBQW1CLENBQUUsSUFBRixDQUFuQjtBQUNBLEdBSEQ7QUFLQSxDQXZwQkYiLCJmaWxlIjoid2MtYWpheC1wcm9kdWN0LWZpbHRlci1wdWJsaWMtc2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRGlzcGxheSB0eXBlIGZpZWxkcy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblxuXG59ICk7XG4iLCIvKipcbiAqIFRoZSBmcm9udGVuZCBmaWx0ZXIgZm9ybS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9wdWJsaWMvc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5jb25zdCB3Y2FwZl9wYXJhbXMgPSB3Y2FwZl9wYXJhbXMgfHwge1xuXHQnZmlsdGVyX2lucHV0X2RlbGF5JzogJycsXG5cdCdzaG9wX2xvb3BfY29udGFpbmVyJzogJycsXG5cdCdub3RfZm91bmRfY29udGFpbmVyJzogJycsXG5cdCdwYWdpbmF0aW9uX2NvbnRhaW5lcic6ICcnLCAvLyB0b2RvXG5cdCdzb3J0aW5nX2NvbnRyb2wnOiAnJywgLy8gdG9kb1xuXHQnc2Nyb2xsX3RvX3RvcCc6ICcnLCAvLyB0b2RvXG5cdCdzY3JvbGxfdG9fdG9wX29mZnNldCc6ICcnLCAvLyB0b2RvXG5cdCdjdXN0b21fc2NyaXB0cyc6ICcnLFxufTtcblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KFxuXHRmdW5jdGlvbiggJCApIHtcblxuXHRcdC8vIHJldHVybiBmYWxzZSBpZiB3Y2FwZl9wYXJhbXMgdmFyaWFibGUgaXMgbm90IGZvdW5kXG5cdFx0aWYgKCB0eXBlb2Ygd2NhcGZfcGFyYW1zID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRjb25zdCBfZGVsYXkgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLmZpbHRlcl9pbnB1dF9kZWxheSApO1xuXHRcdGNvbnN0IGRlbGF5ICA9IF9kZWxheSA+PSAwID8gX2RlbGF5IDogODAwO1xuXG5cdFx0Ly8gc3RvcmUgZmllbGRzJyBpZCBhbmQgZmlsdGVyIGluZm9ybWF0aW9uXG5cdFx0Y29uc3QgZmllbGRzID0ge307XG5cblx0XHRjb25zdCAkd2NhcGZTaW5nbGVGaWx0ZXJzICAgICAgPSAkKCAnLndjYXBmLXNpbmdsZS1maWx0ZXInICk7XG5cdFx0Y29uc3QgJHdjYXBmTmF2RmlsdGVycyAgICAgICAgID0gJCggJy53Y2FwZi1uYXYtZmlsdGVyJyApO1xuXHRcdGNvbnN0ICR3Y2FwZk51bWJlclJhbmdlRmlsdGVycyA9ICQoICcud2NhcGYtbnVtYmVyLXJhbmdlLWZpbHRlcicgKTtcblxuXHRcdCR3Y2FwZlNpbmdsZUZpbHRlcnMuZWFjaChcblx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgICAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgaWQgICAgICAgICAgICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtaWQnICk7XG5cdFx0XHRcdGNvbnN0ICR3cmFwcGVyICAgICAgID0gJGZpZWxkLmNoaWxkcmVuKCAnZGl2JyApO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICA9ICR3cmFwcGVyLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0XHRcdGNvbnN0IG11bHRpcGxlRmlsdGVyID0gcGFyc2VJbnQoICR3cmFwcGVyLmF0dHIoICdkYXRhLW11bHRpcGxlLWZpbHRlcicgKSApO1xuXG5cdFx0XHRcdGZpZWxkc1sgaWQgXSA9IHtcblx0XHRcdFx0XHRmaWx0ZXJLZXk6IGZpbHRlcktleSxcblx0XHRcdFx0XHRtdWx0aXBsZUZpbHRlcjogbXVsdGlwbGVGaWx0ZXJcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0Ly8gSW5pdGlhbGl6ZSBqUXVlcnkgY2hvc2VuIGxpYnJhcnlcblx0XHRmdW5jdGlvbiBpbml0Q2hvc2VuKCkge1xuXHRcdFx0aWYgKCAhIGpRdWVyeSgpLmNob3NlbiApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQkd2NhcGZOYXZGaWx0ZXJzLmZpbmQoICcud2NhcGYtY2hvc2VuLXNlbGVjdCcgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRoaXMgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHt9O1xuXG5cdFx0XHRcdGNvbnN0IG5vUmVzdWx0c01lc3NhZ2UgPSAkdGhpcy5hdHRyKCAnZGF0YS1uby1yZXN1bHRzLW1lc3NhZ2UnICk7XG5cblx0XHRcdFx0aWYgKCBub1Jlc3VsdHNNZXNzYWdlICkge1xuXHRcdFx0XHRcdG9wdGlvbnNbICdub19yZXN1bHRzX3RleHQnIF0gPSBub1Jlc3VsdHNNZXNzYWdlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JHRoaXMuY2hvc2VuKCBvcHRpb25zICk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0aW5pdENob3NlbigpO1xuXG5cdFx0Ly8gSW5pdGlhbGl6ZSBoaWVyYXJjaHkgYWNjb3JkaW9uXG5cdFx0ZnVuY3Rpb24gaW5pdEhpZXJhcmNoeUFjY29yZGlvbigpIHtcblx0XHRcdCR3Y2FwZk5hdkZpbHRlcnMuZmluZCggJy5oaWVyYXJjaHktYWNjb3JkaW9uLXRvZ2dsZScgKS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCQoIHRoaXMgKS50b2dnbGVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpbml0SGllcmFyY2h5QWNjb3JkaW9uKCk7XG5cblx0XHQvKipcblx0XHQgKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNDE0MTgxM1xuXHRcdCAqXG5cdFx0ICogQHBhcmFtIG51bWJlclxuXHRcdCAqIEBwYXJhbSBkZWNpbWFsc1xuXHRcdCAqIEBwYXJhbSBkZWNfcG9pbnRcblx0XHQgKiBAcGFyYW0gdGhvdXNhbmRzX3NlcFxuXHRcdCAqXG5cdFx0ICogQHJldHVybnMge3N0cmluZ31cblx0XHQgKi9cblx0XHRmdW5jdGlvbiBudW1iZXJfZm9ybWF0KCBudW1iZXIsIGRlY2ltYWxzLCBkZWNfcG9pbnQsIHRob3VzYW5kc19zZXAgKSB7XG5cdFx0XHQvLyBTdHJpcCBhbGwgY2hhcmFjdGVycyBidXQgbnVtZXJpY2FsIG9uZXMuXG5cdFx0XHRudW1iZXIgPSAoIG51bWJlciArICcnICkucmVwbGFjZSggL1teMC05K1xcLUVlLl0vZywgJycgKTtcblxuXHRcdFx0Y29uc3QgbiAgICA9ICEgaXNGaW5pdGUoICtudW1iZXIgKSA/IDAgOiArbnVtYmVyO1xuXHRcdFx0Y29uc3QgcHJlYyA9ICEgaXNGaW5pdGUoICtkZWNpbWFscyApID8gMCA6IE1hdGguYWJzKCBkZWNpbWFscyApO1xuXHRcdFx0Y29uc3Qgc2VwICA9ICggdHlwZW9mIHRob3VzYW5kc19zZXAgPT09ICd1bmRlZmluZWQnICkgPyAnLCcgOiB0aG91c2FuZHNfc2VwO1xuXHRcdFx0Y29uc3QgZGVjICA9ICggdHlwZW9mIGRlY19wb2ludCA9PT0gJ3VuZGVmaW5lZCcgKSA/ICcuJyA6IGRlY19wb2ludDtcblxuXHRcdFx0bGV0IHM7XG5cblx0XHRcdGNvbnN0IHRvRml4ZWRGaXggPSBmdW5jdGlvbiggbiwgcHJlYyApIHtcblx0XHRcdFx0Y29uc3QgayA9IE1hdGgucG93KCAxMCwgcHJlYyApO1xuXHRcdFx0XHRyZXR1cm4gJycgKyBNYXRoLnJvdW5kKCBuICogayApIC8gaztcblx0XHRcdH07XG5cblx0XHRcdC8vIEZpeCBmb3IgSUUgcGFyc2VGbG9hdCgwLjU1KS50b0ZpeGVkKDApID0gMDtcblx0XHRcdHMgPSAoIHByZWMgPyB0b0ZpeGVkRml4KCBuLCBwcmVjICkgOiAnJyArIE1hdGgucm91bmQoIG4gKSApLnNwbGl0KCAnLicgKTtcblxuXHRcdFx0aWYgKCBzWyAwIF0ubGVuZ3RoID4gMyApIHtcblx0XHRcdFx0c1sgMCBdID0gc1sgMCBdLnJlcGxhY2UoIC9cXEIoPz0oPzpcXGR7M30pKyg/IVxcZCkpL2csIHNlcCApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICggc1sgMSBdIHx8ICcnICkubGVuZ3RoIDwgcHJlYyApIHtcblx0XHRcdFx0c1sgMSBdID0gc1sgMSBdIHx8ICcnO1xuXHRcdFx0XHRzWyAxIF0gKz0gbmV3IEFycmF5KCBwcmVjIC0gc1sgMSBdLmxlbmd0aCArIDEgKS5qb2luKCAnMCcgKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHMuam9pbiggZGVjICk7XG5cdFx0fVxuXG5cdFx0Ly8gSW5pdGlhbGl6ZSBub1VJU2xpZGVyXG5cdFx0ZnVuY3Rpb24gaW5pdE5vVUlTbGlkZXIoKSB7XG5cdFx0XHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMuZmluZCggJy53Y2FwZi1yYW5nZS1zbGlkZXInICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRpdGVtID0gJCggdGhpcyApO1xuXG5cdFx0XHRcdGNvbnN0IGZpbHRlcktleSA9ICRpdGVtLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0XHRcdGNvbnN0ICRzbGlkZXIgICA9ICRpdGVtLmZpbmQoICcud2NhcGYtbm91aS1zbGlkZXInICk7XG5cblx0XHRcdFx0Ly8gSWYgc2xpZGVyIGlzIGFscmVhZHkgaW5pdGlhbGl6ZWQgdGhlbiBkb24ndCByZWluaXRpYWxpemUgYWdhaW4uXG5cdFx0XHRcdGlmICggJHNsaWRlci5oYXNDbGFzcyggJ25vVWktdGFyZ2V0JyApICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IHNsaWRlcklkICAgICAgICAgID0gJHNsaWRlci5hdHRyKCAnaWQnICk7XG5cdFx0XHRcdGNvbnN0IGRpc3BsYXlWYWx1ZXNBcyAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGlzcGxheS12YWx1ZXMtYXMnICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IHN0ZXAgICAgICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtc3RlcCcgKSApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsUGxhY2VzICAgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtcGxhY2VzJyApO1xuXHRcdFx0XHRjb25zdCB0aG91c2FuZFNlcGFyYXRvciA9ICRpdGVtLmF0dHIoICdkYXRhLXRob3VzYW5kLXNlcGFyYXRvcicgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFNlcGFyYXRvciAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXNlcGFyYXRvcicgKTtcblx0XHRcdFx0Y29uc3QgbWluVmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgJG1pblZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1pbi12YWx1ZScgKTtcblx0XHRcdFx0Y29uc3QgJG1heFZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1heC12YWx1ZScgKTtcblxuXHRcdFx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggc2xpZGVySWQgKTtcblxuXHRcdFx0XHRub1VpU2xpZGVyLmNyZWF0ZSggc2xpZGVyLCB7XG5cdFx0XHRcdFx0c3RhcnQ6IFsgbWluVmFsdWUsIG1heFZhbHVlIF0sXG5cdFx0XHRcdFx0c3RlcCxcblx0XHRcdFx0XHRjb25uZWN0OiB0cnVlLFxuXHRcdFx0XHRcdHJhbmdlOiB7XG5cdFx0XHRcdFx0XHQnbWluJzogcmFuZ2VNaW5WYWx1ZSxcblx0XHRcdFx0XHRcdCdtYXgnOiByYW5nZU1heFZhbHVlLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAndXBkYXRlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9IG51bWJlcl9mb3JtYXQoIHZhbHVlc1sgMCBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gbnVtYmVyX2Zvcm1hdCggdmFsdWVzWyAxIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cblx0XHRcdFx0XHRpZiAoICdwbGFpbl90ZXh0JyA9PT0gZGlzcGxheVZhbHVlc0FzICkge1xuXHRcdFx0XHRcdFx0JG1pblZhbHVlLmh0bWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0XHQkbWF4VmFsdWUuaHRtbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JG1pblZhbHVlLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHRcdCRtYXhWYWx1ZS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICkge1xuXHRcdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAwIF0gKTtcblx0XHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMSBdICk7XG5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIG1heFZhbHVlID09PSByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGNvbnN0IGZpbHRlclZhbFN0cmluZyA9IG1pblZhbHVlICsgJysnICsgbWF4VmFsdWU7XG5cdFx0XHRcdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbFN0cmluZyApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAnZW5kJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtaW5WYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRcdCRpbnB1dC5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5zZXQoIFsgbWluVmFsdWUsIG51bGwgXSApO1xuXG5cdFx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtYXhWYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRcdCRpbnB1dC5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5zZXQoIFsgbnVsbCwgbWF4VmFsdWUgXSApO1xuXG5cdFx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdGluaXROb1VJU2xpZGVyKCk7XG5cblx0XHQvLyBzaG93IGEgbG9hZGluZyBpbmRpY2F0b3Jcblx0XHRmdW5jdGlvbiB3Y2FwZkJlZm9yZVVwZGF0ZSgpIHtcblx0XHRcdCQoICdib2R5JyApLnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfdXBkYXRlX2ZpbHRlcnMnICk7XG5cdFx0fVxuXG5cdFx0Ly8gc2Nyb2xsIHRvIHRvcFxuXHRcdGZ1bmN0aW9uIHdjYXBmQWZ0ZXJVcGRhdGUoKSB7XG5cdFx0XHRpbml0Q2hvc2VuKCk7XG5cdFx0XHRpbml0SGllcmFyY2h5QWNjb3JkaW9uKCk7XG5cdFx0XHRpbml0Tm9VSVNsaWRlcigpO1xuXG5cdFx0XHQkKCAnYm9keScgKS50cmlnZ2VyKCAnd2NhcGZfYWZ0ZXJfdXBkYXRlX2ZpbHRlcnMnICk7XG5cdFx0fVxuXG5cdFx0Ly8gZmlsdGVyIHRoZSBwcm9kdWN0c1xuXHRcdGZ1bmN0aW9uIHdjYXBmRmlsdGVyUHJvZHVjdHMoIGZvcmNlUmVSZW5kZXIgPSBmYWxzZSApIHtcblx0XHRcdHdjYXBmQmVmb3JlVXBkYXRlKCk7XG5cblx0XHRcdCQuZ2V0KFxuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZixcblx0XHRcdFx0ZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRcdFx0Y29uc3QgJGRhdGEgPSAkKCBkYXRhICk7XG5cblx0XHRcdFx0XHRjb25zdCAkc2hvcExvb3BDb250YWluZXIgPSAkZGF0YS5maW5kKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApO1xuXHRcdFx0XHRcdGNvbnN0ICRub3RGb3VuZENvbnRhaW5lciA9ICRkYXRhLmZpbmQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICk7XG5cblx0XHRcdFx0XHQvLyByZXBsYWNlIGZpZWxkcycgZGF0YSB3aXRoIG5ldyBkYXRhXG5cdFx0XHRcdFx0JC5lYWNoKFxuXHRcdFx0XHRcdFx0ZmllbGRzLFxuXHRcdFx0XHRcdFx0ZnVuY3Rpb24oIGlkICkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBmaWVsZElEICAgID0gJ1tkYXRhLWlkPVwiJyArIGlkICsgJ1wiXSc7XG5cdFx0XHRcdFx0XHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkKCBmaWVsZElEICk7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IF9maWVsZCAgICAgPSAkZGF0YS5maW5kKCBmaWVsZElEICk7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGZpZWxkQ2xhc3MgPSAkKCBfZmllbGQgKS5hdHRyKCAnY2xhc3MnICk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gV2hlbiBjYWxsZWQgZnJvbSBoaXN0b3J5IGJhY2sgb3IgZm9yd2FyZCByZXF1ZXN0IHRoZW4gcmVyZW5kZXIgYWxsIGZpZWxkcy5cblx0XHRcdFx0XHRcdFx0aWYgKCBmb3JjZVJlUmVuZGVyICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gdXBkYXRlIGNsYXNzXG5cdFx0XHRcdFx0XHRcdFx0JGZpZWxkLmF0dHIoICdjbGFzcycsIGZpZWxkQ2xhc3MgKTtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIHVwZGF0ZSBmaWVsZFxuXHRcdFx0XHRcdFx0XHRcdCRmaWVsZC5odG1sKCBfZmllbGQuaHRtbCgpICk7XG5cblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIFNlbGVjdGl2ZWx5IHJlcmVuZGVyIHRoZSBmaWVsZHMuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCAkZmllbGQuaGFzQ2xhc3MoICd3Y2FwZi1uYXYtZmlsdGVyJyApICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyB1cGRhdGUgY2xhc3Ncblx0XHRcdFx0XHRcdFx0XHRcdCRmaWVsZC5hdHRyKCAnY2xhc3MnLCBmaWVsZENsYXNzICk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdC8vIHVwZGF0ZSBmaWVsZFxuXHRcdFx0XHRcdFx0XHRcdFx0JGZpZWxkLmh0bWwoIF9maWVsZC5odG1sKCkgKTtcblxuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdC8vIHJlcGxhY2Ugb2xkIHNob3AgbG9vcCB3aXRoIG5ldyBvbmVcblx0XHRcdFx0XHRpZiAoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyID09PSB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApIHtcblx0XHRcdFx0XHRcdCQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkuaHRtbCggJHNob3BMb29wQ29udGFpbmVyLmh0bWwoKSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAoICQoIHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICRzaG9wTG9vcENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICRub3RGb3VuZENvbnRhaW5lci5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkbm90Rm91bmRDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR3Y2FwZkFmdGVyVXBkYXRlKCk7XG5cblx0XHRcdFx0XHQvLyB0b2RvXG5cdFx0XHRcdFx0Ly8gcmVpbml0aWFsaXplIG9yZGVyaW5nXG5cdFx0XHRcdFx0Ly8gd2NhcGZJbml0T3JkZXIoKTtcblxuXHRcdFx0XHRcdC8vIHRvZG9cblx0XHRcdFx0XHQvLyByZWluaXRpYWxpemUgZHJvcGRvd24gZmlsdGVyXG5cdFx0XHRcdFx0Ly8gd2NhcGZEcm9wRG93bkZpbHRlcigpO1xuXG5cdFx0XHRcdFx0Ly8gcnVuIHNjcmlwdHMgYWZ0ZXIgc2hvcCBsb29wIHVuZGF0ZWRcblx0XHRcdFx0XHRpZiAoIHR5cGVvZiB3Y2FwZl9wYXJhbXMuY3VzdG9tX3NjcmlwdHMgIT09ICd1bmRlZmluZWQnICYmIHdjYXBmX3BhcmFtcy5jdXN0b21fc2NyaXB0cy5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdFx0ZXZhbCggd2NhcGZfcGFyYW1zLmN1c3RvbV9zY3JpcHRzICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdC8vIFVSTCBQYXJzZXJcblx0XHRmdW5jdGlvbiB3Y2FwZkdldFVybFZhcnMoIHVybCApIHtcblx0XHRcdGxldCB2YXJzID0ge30sIGhhc2g7XG5cblx0XHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBoYXNoZXMgID0gdXJsLnNsaWNlKCB1cmwuaW5kZXhPZiggJz8nICkgKyAxICkuc3BsaXQoICcmJyApO1xuXHRcdFx0Y29uc3QgaExlbmd0aCA9IGhhc2hlcy5sZW5ndGg7XG5cblx0XHRcdGZvciAoIGxldCBpID0gMDsgaSA8IGhMZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0aGFzaCA9IGhhc2hlc1sgaSBdLnNwbGl0KCAnPScgKTtcblxuXHRcdFx0XHR2YXJzWyBoYXNoWyAwIF0gXSA9IGhhc2hbIDEgXTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHZhcnM7XG5cdFx0fVxuXG5cdFx0Ly8gZXZlcnl0aW1lIHdlIGFwcGx5IHRoZSBmaWx0ZXIgd2Ugc2V0IHRoZSBjdXJyZW50IHBhZ2UgdG8gMVxuXHRcdGZ1bmN0aW9uIHdjYXBmRml4UGFnaW5hdGlvbigpIHtcblx0XHRcdGxldCB1cmwgICAgICAgICAgICAgICAgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblx0XHRcdGNvbnN0IHBhcmFtcyAgICAgICAgICAgPSB3Y2FwZkdldFVybFZhcnMoIHVybCApO1xuXHRcdFx0Y29uc3QgY3VycmVudFBhZ2VJblVybCA9IHBhcnNlSW50KCB1cmwucmVwbGFjZSggLy4rXFwvcGFnZVxcLyhcXGQrKSsvLCAnJDEnICkgKTtcblxuXHRcdFx0aWYgKCBjdXJyZW50UGFnZUluVXJsICkge1xuXHRcdFx0XHRpZiAoIGN1cnJlbnRQYWdlSW5VcmwgPiAxICkge1xuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCAvcGFnZVxcLyhcXGQrKS8sICdwYWdlLzEnICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoIHR5cGVvZiBwYXJhbXNbICdwYWdlZCcgXSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdGNvbnN0IGN1cnJlbnRQYWdlSW5QYXJhbXMgPSBwYXJzZUludCggcGFyYW1zWyAncGFnZWQnIF0gKTtcblxuXHRcdFx0XHRpZiAoIGN1cnJlbnRQYWdlSW5QYXJhbXMgPiAxICkge1xuXHRcdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKCAncGFnZWQ9JyArIGN1cnJlbnRQYWdlSW5QYXJhbXMsICdwYWdlZD0xJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB1cmw7XG5cdFx0fVxuXG5cdFx0Ly8gdXBkYXRlIHF1ZXJ5IHN0cmluZyBmb3IgY2F0ZWdvcmllcywgbWV0YSBldGMuLlxuXHRcdGZ1bmN0aW9uIHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGtleSwgdmFsdWUsIHB1c2hIaXN0b3J5LCB1cmwgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiBwdXNoSGlzdG9yeSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdHB1c2hIaXN0b3J5ID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCB0eXBlb2YgdXJsID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0dXJsID0gd2NhcGZGaXhQYWdpbmF0aW9uKCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHJlICAgICAgICA9IG5ldyBSZWdFeHAoICcoWz8mXSknICsga2V5ICsgJz0uKj8oJnwkKScsICdpJyApO1xuXHRcdFx0Y29uc3Qgc2VwYXJhdG9yID0gdXJsLmluZGV4T2YoICc/JyApICE9PSAtMSA/ICcmJyA6ICc/Jztcblx0XHRcdGxldCB1cmxXaXRoUXVlcnk7XG5cblx0XHRcdGlmICggdXJsLm1hdGNoKCByZSApICkge1xuXHRcdFx0XHR1cmxXaXRoUXVlcnkgPSB1cmwucmVwbGFjZSggcmUsICckMScgKyBrZXkgKyAnPScgKyB2YWx1ZSArICckMicgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHVybFdpdGhRdWVyeSA9IHVybCArIHNlcGFyYXRvciArIGtleSArICc9JyArIHZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHB1c2hIaXN0b3J5ID09PSB0cnVlICkge1xuXHRcdFx0XHRyZXR1cm4gaGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgdXJsV2l0aFF1ZXJ5ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdXJsV2l0aFF1ZXJ5O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIHJlbW92ZSBwYXJhbWV0ZXIgZnJvbSB1cmxcblx0XHRmdW5jdGlvbiB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIHVybCApIHtcblx0XHRcdGlmICggdHlwZW9mIHVybCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdHVybCA9IHdjYXBmRml4UGFnaW5hdGlvbigpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBvbGRQYXJhbXMgICAgICAgICA9IHdjYXBmR2V0VXJsVmFycyggdXJsICk7XG5cdFx0XHRjb25zdCBvbGRQYXJhbXNMZW5ndGggICA9IE9iamVjdC5rZXlzKCBvbGRQYXJhbXMgKS5sZW5ndGg7XG5cdFx0XHRjb25zdCBzdGFydFBvc2l0aW9uICAgICA9IHVybC5pbmRleE9mKCAnPycgKTtcblx0XHRcdGNvbnN0IGZpbHRlcktleVBvc2l0aW9uID0gdXJsLmluZGV4T2YoIGZpbHRlcktleSApO1xuXHRcdFx0bGV0IGNsZWFuVXJsLCBjbGVhblF1ZXJ5O1xuXG5cdFx0XHRpZiAoIG9sZFBhcmFtc0xlbmd0aCA+IDEgKSB7XG5cdFx0XHRcdGlmICggKCBmaWx0ZXJLZXlQb3NpdGlvbiAtIHN0YXJ0UG9zaXRpb24gKSA+IDEgKSB7XG5cdFx0XHRcdFx0Y2xlYW5VcmwgPSB1cmwucmVwbGFjZSggJyYnICsgZmlsdGVyS2V5ICsgJz0nICsgb2xkUGFyYW1zWyBmaWx0ZXJLZXkgXSwgJycgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjbGVhblVybCA9IHVybC5yZXBsYWNlKCBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdICsgJyYnLCAnJyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgbmV3UGFyYW1zID0gY2xlYW5Vcmwuc3BsaXQoICc/JyApO1xuXHRcdFx0XHRjbGVhblF1ZXJ5ICAgICAgPSAnPycgKyBuZXdQYXJhbXNbIDEgXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNsZWFuUXVlcnkgPSB1cmwucmVwbGFjZSggJz8nICsgZmlsdGVyS2V5ICsgJz0nICsgb2xkUGFyYW1zWyBmaWx0ZXJLZXkgXSwgJycgKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGNsZWFuUXVlcnk7XG5cdFx0fVxuXG5cdFx0Ly8gdGFrZSB0aGUga2V5IGFuZCB2YWx1ZSBhbmQgbWFrZSBxdWVyeVxuXHRcdGZ1bmN0aW9uIHdjYXBmTWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIHVybCApIHtcblx0XHRcdGxldCBwYXJhbXMsIG5leHRWYWx1ZXMsIGVtcHR5VmFsdWUgPSBmYWxzZTtcblxuXHRcdFx0aWYgKCB0eXBlb2YgdXJsICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0cGFyYW1zID0gd2NhcGZHZXRVcmxWYXJzKCB1cmwgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHBhcmFtcyA9IHdjYXBmR2V0VXJsVmFycygpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHR5cGVvZiBwYXJhbXNbIGZpbHRlcktleSBdICE9ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHRjb25zdCBwcmV2VmFsdWVzICAgICAgPSBwYXJhbXNbIGZpbHRlcktleSBdO1xuXHRcdFx0XHRjb25zdCBwcmV2VmFsdWVzQXJyYXkgPSBwcmV2VmFsdWVzLnNwbGl0KCAnLCcgKTtcblxuXHRcdFx0XHRpZiAoIHByZXZWYWx1ZXMubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRjb25zdCBmb3VuZCA9ICQuaW5BcnJheSggZmlsdGVyVmFsdWUsIHByZXZWYWx1ZXNBcnJheSApO1xuXG5cdFx0XHRcdFx0aWYgKCBmb3VuZCA+PSAwICkge1xuXHRcdFx0XHRcdFx0Ly8gRWxlbWVudCB3YXMgZm91bmQsIHJlbW92ZSBpdC5cblx0XHRcdFx0XHRcdHByZXZWYWx1ZXNBcnJheS5zcGxpY2UoIGZvdW5kLCAxICk7XG5cblx0XHRcdFx0XHRcdGlmICggcHJldlZhbHVlc0FycmF5Lmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdFx0XHRcdFx0ZW1wdHlWYWx1ZSA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIEVsZW1lbnQgd2FzIG5vdCBmb3VuZCwgYWRkIGl0LlxuXHRcdFx0XHRcdFx0cHJldlZhbHVlc0FycmF5LnB1c2goIGZpbHRlclZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBwcmV2VmFsdWVzQXJyYXkubGVuZ3RoID4gMSApIHtcblx0XHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBwcmV2VmFsdWVzQXJyYXkuam9pbiggJywnICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBwcmV2VmFsdWVzQXJyYXk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG5leHRWYWx1ZXMgPSBmaWx0ZXJWYWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bmV4dFZhbHVlcyA9IGZpbHRlclZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyB1cGRhdGUgdXJsIGFuZCBxdWVyeSBzdHJpbmdcblx0XHRcdGlmICggISBlbXB0eVZhbHVlICkge1xuXHRcdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIG5leHRWYWx1ZXMgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHdjYXBmU2luZ2xlRmlsdGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICkge1xuXHRcdFx0Y29uc3QgcGFyYW1zID0gd2NhcGZHZXRVcmxWYXJzKCk7XG5cdFx0XHRsZXQgcXVlcnk7XG5cblx0XHRcdGlmICggdHlwZW9mIHBhcmFtc1sgZmlsdGVyS2V5IF0gIT09ICd1bmRlZmluZWQnICYmIHBhcmFtc1sgZmlsdGVyS2V5IF0gPT09IGZpbHRlclZhbHVlICkge1xuXHRcdFx0XHRxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cXVlcnkgPSB3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlLCBmYWxzZSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyB1cGRhdGUgdXJsXG5cdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0XHR9XG5cblx0XHQvLyBUaGUgbWFpbiBmdW5jdGlvbiB0byBoYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0XG5cdFx0ZnVuY3Rpb24gaGFuZGxlRmlsdGVyUmVxdWVzdCggJGl0ZW0sIGZpbHRlclZhbHVlICkge1xuXHRcdFx0Y29uc3QgJGZpZWxkICAgICAgICAgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLXNpbmdsZS1maWx0ZXInICk7XG5cdFx0XHRjb25zdCBmaWVsZElEICAgICAgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRcdGNvbnN0IGZpZWxkRGF0YSAgICAgID0gZmllbGRzWyBmaWVsZElEIF07XG5cdFx0XHRjb25zdCBmaWx0ZXJLZXkgICAgICA9IGZpZWxkRGF0YS5maWx0ZXJLZXk7XG5cdFx0XHRjb25zdCBtdWx0aXBsZUZpbHRlciA9IGZpZWxkRGF0YS5tdWx0aXBsZUZpbHRlcjtcblxuXHRcdFx0aWYgKCAhIGZpbHRlcktleSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgZmlsdGVyVmFsdWUubGVuZ3RoICkge1xuXHRcdFx0XHRjb25zdCBxdWVyeSA9IHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSApO1xuXHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXG5cdFx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIG11bHRpcGxlRmlsdGVyICkge1xuXHRcdFx0XHR3Y2FwZk1ha2VQYXJhbWV0ZXJzKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR3Y2FwZlNpbmdsZUZpbHRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIGxpc3QgZmllbGRzXG5cdFx0JHdjYXBmTmF2RmlsdGVycy5vbihcblx0XHRcdCdjaGFuZ2UnLFxuXHRcdFx0Jy53Y2FwZi1sYXllcmVkLW5hdiBbdHlwZT1cImNoZWNrYm94XCJdLCAud2NhcGYtbGF5ZXJlZC1uYXYgW3R5cGU9XCJyYWRpb1wiXScsXG5cdFx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGl0ZW0gICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlclZhbHVlID0gJGl0ZW0udmFsKCk7XG5cblx0XHRcdFx0aGFuZGxlRmlsdGVyUmVxdWVzdCggJGl0ZW0sIGZpbHRlclZhbHVlICk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdC8vIFRPRE86IFVzZSBhIGNvbWJpbmF0aW9uIG9mIGxhYmVsLCBjaGVja2JveCBhbmQgcmFkaW9cblx0XHQvLyBoYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciBsYWJlbGVkIGl0ZW1cblx0XHQkd2NhcGZOYXZGaWx0ZXJzLm9uKFxuXHRcdFx0J2NsaWNrJyxcblx0XHRcdCcud2NhcGYtbGFiZWxlZC1uYXYgLml0ZW0nLFxuXHRcdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpdGVtICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLmF0dHIoICdkYXRhLXZhbHVlJyApO1xuXG5cdFx0XHRcdGhhbmRsZUZpbHRlclJlcXVlc3QoICRpdGVtLCBmaWx0ZXJWYWx1ZSApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHQvLyBoYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciBkaXNwbGF5IHR5cGUgc2VsZWN0IGZpZWxkc1xuXHRcdCR3Y2FwZk5hdkZpbHRlcnMub24oXG5cdFx0XHQnY2hhbmdlJyxcblx0XHRcdCdzZWxlY3QnLFxuXHRcdFx0ZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRpdGVtICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJWYWx1ZSA9ICRpdGVtLnZhbCgpO1xuXG5cdFx0XHRcdGNvbnN0ICRmaWVsZCAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtc2luZ2xlLWZpbHRlcicgKTtcblx0XHRcdFx0Y29uc3QgZmllbGRJRCAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdFx0XHRjb25zdCBmaWVsZERhdGEgPSBmaWVsZHNbIGZpZWxkSUQgXTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyS2V5ID0gZmllbGREYXRhLmZpbHRlcktleTtcblxuXHRcdFx0XHRpZiAoICEgZmlsdGVyVmFsdWUubGVuZ3RoICkge1xuXHRcdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zdCBmaWx0ZXJWYWxTdHJpbmcgPSBmaWx0ZXJWYWx1ZS50b1N0cmluZygpO1xuXHRcdFx0XHRcdHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsU3RyaW5nICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHQvLyBoYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciByYW5nZSBudW1iZXJcblx0XHQkd2NhcGZOdW1iZXJSYW5nZUZpbHRlcnMub24oXG5cdFx0XHQnaW5wdXQnLFxuXHRcdFx0Jy53Y2FwZi1yYW5nZS1udW1iZXIgLm1pbi12YWx1ZSwgLndjYXBmLXJhbmdlLW51bWJlciAubWF4LXZhbHVlJyxcblx0XHRcdGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHQkaXRlbS5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRjb25zdCAkcmFuZ2VOdW1iZXIgID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1yYW5nZS1udW1iZXInICk7XG5cdFx0XHRcdFx0Y29uc3QgZmlsdGVyS2V5ICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApO1xuXHRcdFx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApO1xuXHRcdFx0XHRcdGxldCBtaW5WYWx1ZSAgICAgICAgPSAkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCk7XG5cdFx0XHRcdFx0bGV0IG1heFZhbHVlICAgICAgICA9ICRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoKTtcblxuXHRcdFx0XHRcdC8vIEZvcmNlIHRoZSBtaW5WYWx1ZSBub3QgdG8gYmUgZW1wdHkuXG5cdFx0XHRcdFx0aWYgKCAhIG1pblZhbHVlLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdG1pblZhbHVlID0gcmFuZ2VNaW5WYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWluLXZhbHVlJyApLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGb3JjZSB0aGUgbWF4VmFsdWUgbm90IHRvIGJlIGVtcHR5LlxuXHRcdFx0XHRcdGlmICggISBtYXhWYWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgcmFuZ2VNaW5WYWx1ZS5cblx0XHRcdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG1pblZhbHVlICkgPCBwYXJzZUZsb2F0KCByYW5nZU1pblZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1pblZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG1pblZhbHVlICkgPiBwYXJzZUZsb2F0KCByYW5nZU1heFZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1pbi12YWx1ZScgKS52YWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyB1cCB0aGUgcmFuZ2VNYXhWYWx1ZS5cblx0XHRcdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG1heFZhbHVlICkgPiBwYXJzZUZsb2F0KCByYW5nZU1heFZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHRtYXhWYWx1ZSA9IHJhbmdlTWF4VmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgdGhlIG1heFZhbHVlIG5vdCB0byBnbyBiZWxvdyB0aGUgbWluVmFsdWUuXG5cdFx0XHRcdFx0aWYgKCBwYXJzZUZsb2F0KCBtaW5WYWx1ZSApID4gcGFyc2VGbG9hdCggbWF4VmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gbWluVmFsdWU7XG5cblx0XHRcdFx0XHRcdCRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBtaW5WYWx1ZSA9PT0gcmFuZ2VNaW5WYWx1ZSAmJiBtYXhWYWx1ZSA9PT0gcmFuZ2VNYXhWYWx1ZSApIHtcblx0XHRcdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zdCBmaWx0ZXJWYWxTdHJpbmcgPSBtaW5WYWx1ZSArICcrJyArIG1heFZhbHVlO1xuXHRcdFx0XHRcdFx0d2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWxTdHJpbmcgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBmaWx0ZXIgcHJvZHVjdHNcblx0XHRcdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0Ly8gaGlzdG9yeSBiYWNrIGFuZCBmb3J3YXJkIHJlcXVlc3QgaGFuZGxpbmdcblx0XHQkKCB3aW5kb3cgKS5iaW5kKCAncG9wc3RhdGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cyggdHJ1ZSApO1xuXHRcdH0gKTtcblxuXHR9XG4pO1xuIl19
