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
  var $wcapfTermFilters = $('.wcapf-ajax-term-filter');
  $wcapfTermFilters.each(function () {
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

    $wcapfTermFilters.find('.wcapf-chosen-select').each(function () {
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
    $wcapfTermFilters.find('.hierarchy-accordion-toggle').on('click', function () {
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
    $wcapfSingleFilters.find('.wcapf-range-slider').each(function () {
      var $item = $(this);
      var filterKey = $item.attr('data-filter-key');
      var $slider = $item.find('.wcapf-noui-slider');
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
    $('body').trigger('wcapf_before_update');
  } // scroll to top


  function wcapfAfterUpdate() {
    initChosen();
    initHierarchyAccordion();
    $('body').trigger('wcapf_after_update');
  } // filter the products


  function wcapfFilterProducts() {
    wcapfBeforeUpdate();
    $.get(window.location.href, function (data) {
      var $data = $(data);
      var $shopLoopContainer = $data.find(wcapf_params.shop_loop_container);
      var $notFoundContainer = $data.find(wcapf_params.not_found_container); // replace fields' data with new data

      $.each(fields, function (id) {
        var fieldID = '[data-id="' + id + '"]';
        var $field = $(fieldID);

        var _field = $data.find(fieldID);

        var fieldClass = $(_field).attr('class'); // update class

        $field.attr('class', fieldClass); // update field

        $field.html(_field.html());
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


  $wcapfTermFilters.on('change', '.wcapf-layered-nav [type="checkbox"], .wcapf-layered-nav [type="radio"]', function (event) {
    event.preventDefault();
    var $item = $(this);
    var filterValue = $item.val();
    handleFilterRequest($item, filterValue);
  }); // TODO: Use a combination of label, checkbox and radio
  // handle the filter request for labeled item

  $wcapfTermFilters.on('click', '.wcapf-labeled-nav .item', function (event) {
    event.preventDefault();
    var $item = $(this);
    var filterValue = $item.attr('data-value');
    handleFilterRequest($item, filterValue);
  }); // handle the filter request for display type select fields

  $wcapfTermFilters.on('change', 'select', function (event) {
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

  $wcapfSingleFilters.on('input', '.wcapf-range-number .min-value, .wcapf-range-number .max-value', function (event) {
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
      var maxValue = $rangeNumber.find('.max-value').val();

      if (!minValue.length) {
        minValue = rangeMinValue;
      }

      if (!maxValue.length) {
        maxValue = rangeMaxValue;
      }

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
    wcapfFilterProducts();
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNob3Nlbi5qcyIsImZpbHRlci1mb3JtLmpzIl0sIm5hbWVzIjpbImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwid2NhcGZfcGFyYW1zIiwiX2RlbGF5IiwicGFyc2VJbnQiLCJmaWx0ZXJfaW5wdXRfZGVsYXkiLCJkZWxheSIsImZpZWxkcyIsIiR3Y2FwZlNpbmdsZUZpbHRlcnMiLCIkd2NhcGZUZXJtRmlsdGVycyIsImVhY2giLCIkZmllbGQiLCJpZCIsImF0dHIiLCIkd3JhcHBlciIsImNoaWxkcmVuIiwiZmlsdGVyS2V5IiwibXVsdGlwbGVGaWx0ZXIiLCJpbml0Q2hvc2VuIiwiY2hvc2VuIiwiZmluZCIsIiR0aGlzIiwib3B0aW9ucyIsIm5vUmVzdWx0c01lc3NhZ2UiLCJpbml0SGllcmFyY2h5QWNjb3JkaW9uIiwib24iLCJ0b2dnbGVDbGFzcyIsIm51bWJlcl9mb3JtYXQiLCJudW1iZXIiLCJkZWNpbWFscyIsImRlY19wb2ludCIsInRob3VzYW5kc19zZXAiLCJyZXBsYWNlIiwibiIsImlzRmluaXRlIiwicHJlYyIsIk1hdGgiLCJhYnMiLCJzZXAiLCJkZWMiLCJzIiwidG9GaXhlZEZpeCIsImsiLCJwb3ciLCJyb3VuZCIsInNwbGl0IiwibGVuZ3RoIiwiQXJyYXkiLCJqb2luIiwiaW5pdE5vVUlTbGlkZXIiLCIkaXRlbSIsIiRzbGlkZXIiLCJzbGlkZXJJZCIsImRpc3BsYXlWYWx1ZXNBcyIsInJhbmdlTWluVmFsdWUiLCJwYXJzZUZsb2F0IiwicmFuZ2VNYXhWYWx1ZSIsInN0ZXAiLCJkZWNpbWFsUGxhY2VzIiwidGhvdXNhbmRTZXBhcmF0b3IiLCJkZWNpbWFsU2VwYXJhdG9yIiwibWluVmFsdWUiLCJtYXhWYWx1ZSIsIiRtaW5WYWx1ZSIsIiRtYXhWYWx1ZSIsIm5vVWlTbGlkZXIiLCJzbGlkZXIiLCJnZXRFbGVtZW50QnlJZCIsImNyZWF0ZSIsInN0YXJ0IiwiY29ubmVjdCIsInJhbmdlIiwidmFsdWVzIiwiaHRtbCIsInZhbCIsImZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIiLCJxdWVyeSIsIndjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIiLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwiZmlsdGVyVmFsU3RyaW5nIiwid2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciIsIndjYXBmRmlsdGVyUHJvZHVjdHMiLCJjbGVhclRpbWVvdXQiLCJkYXRhIiwic2V0VGltZW91dCIsInJlbW92ZURhdGEiLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwiJGlucHV0Iiwic2V0IiwiZ2V0Iiwid2NhcGZCZWZvcmVVcGRhdGUiLCJ0cmlnZ2VyIiwid2NhcGZBZnRlclVwZGF0ZSIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsIiRkYXRhIiwiJHNob3BMb29wQ29udGFpbmVyIiwic2hvcF9sb29wX2NvbnRhaW5lciIsIiRub3RGb3VuZENvbnRhaW5lciIsIm5vdF9mb3VuZF9jb250YWluZXIiLCJmaWVsZElEIiwiX2ZpZWxkIiwiZmllbGRDbGFzcyIsImN1c3RvbV9zY3JpcHRzIiwiZXZhbCIsIndjYXBmR2V0VXJsVmFycyIsInVybCIsInZhcnMiLCJoYXNoIiwiaGFzaGVzIiwic2xpY2UiLCJpbmRleE9mIiwiaExlbmd0aCIsImkiLCJ3Y2FwZkZpeFBhZ2luYXRpb24iLCJwYXJhbXMiLCJjdXJyZW50UGFnZUluVXJsIiwiY3VycmVudFBhZ2VJblBhcmFtcyIsImtleSIsInZhbHVlIiwicHVzaEhpc3RvcnkiLCJyZSIsIlJlZ0V4cCIsInNlcGFyYXRvciIsInVybFdpdGhRdWVyeSIsIm1hdGNoIiwib2xkUGFyYW1zIiwib2xkUGFyYW1zTGVuZ3RoIiwiT2JqZWN0Iiwia2V5cyIsInN0YXJ0UG9zaXRpb24iLCJmaWx0ZXJLZXlQb3NpdGlvbiIsImNsZWFuVXJsIiwiY2xlYW5RdWVyeSIsIm5ld1BhcmFtcyIsIndjYXBmTWFrZVBhcmFtZXRlcnMiLCJmaWx0ZXJWYWx1ZSIsIm5leHRWYWx1ZXMiLCJlbXB0eVZhbHVlIiwicHJldlZhbHVlcyIsInByZXZWYWx1ZXNBcnJheSIsImZvdW5kIiwiaW5BcnJheSIsInNwbGljZSIsInB1c2giLCJ3Y2FwZlNpbmdsZUZpbHRlciIsImhhbmRsZUZpbHRlclJlcXVlc3QiLCJjbG9zZXN0IiwiZmllbGREYXRhIiwidG9TdHJpbmciLCIkcmFuZ2VOdW1iZXIiLCJiaW5kIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUEsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVDLENBQVYsRUFBYyxDQUl2QyxDQUpEOzs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUMsWUFBWSxHQUFHQSxZQUFZLElBQUk7QUFDcEMsd0JBQXNCLEVBRGM7QUFFcEMseUJBQXVCLEVBRmE7QUFHcEMseUJBQXVCLEVBSGE7QUFJcEMsMEJBQXdCLEVBSlk7QUFJUjtBQUM1QixxQkFBbUIsRUFMaUI7QUFLYjtBQUN2QixtQkFBaUIsRUFObUI7QUFNZjtBQUNyQiwwQkFBd0IsRUFQWTtBQU9SO0FBQzVCLG9CQUFrQjtBQVJrQixDQUFyQztBQVdBSixNQUFNLENBQUVDLFFBQUYsQ0FBTixDQUFtQkMsS0FBbkIsQ0FDQyxVQUFVQyxDQUFWLEVBQWM7QUFFYjtBQUNBLE1BQUssT0FBT0MsWUFBUCxLQUF3QixXQUE3QixFQUEyQztBQUMxQyxXQUFPLEtBQVA7QUFDQTs7QUFFRCxNQUFNQyxNQUFNLEdBQUdDLFFBQVEsQ0FBRUYsWUFBWSxDQUFDRyxrQkFBZixDQUF2Qjs7QUFDQSxNQUFNQyxLQUFLLEdBQUlILE1BQU0sSUFBSSxDQUFWLEdBQWNBLE1BQWQsR0FBdUIsR0FBdEMsQ0FSYSxDQVViOztBQUNBLE1BQU1JLE1BQU0sR0FBRyxFQUFmO0FBRUEsTUFBTUMsbUJBQW1CLEdBQUdQLENBQUMsQ0FBRSxzQkFBRixDQUE3QjtBQUNBLE1BQU1RLGlCQUFpQixHQUFLUixDQUFDLENBQUUseUJB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QUFoQixFQUF5QjtBQUN4QmdCLFFBQUFBLFFBQVEsR0FBR04sYUFBWDtBQUNBOztBQUVELFVBQUtELFVBQVUsQ0FBRU0sUUFBRixDQUFWLEdBQXlCTixVQUFVLENBQUVPLFFBQUYsQ0FBeEMsRUFBdUQ7QUFDdERBLFFBQUFBLFFBQVEsR0FBR0QsUUFBWDtBQUVBNEYsUUFBQUEsWUFBWSxDQUFDckksSUFBYixDQUFtQixZQUFuQixFQUFrQ3NELEdBQWxDLENBQXVDWixRQUF2QztBQUNBOztBQUVELFVBQUtELFFBQVEsS0FBS1AsYUFBYixJQUE4QlEsUUFBUSxLQUFLTixhQUFoRCxFQUFnRTtBQUMvRCxZQUFNb0IsS0FBSyxHQUFHQywrQkFBK0IsQ0FBRTdELFNBQUYsQ0FBN0M7QUFDQThELFFBQUFBLE9BQU8sQ0FBQ0MsU0FBUixDQUFtQixFQUFuQixFQUF1QixFQUF2QixFQUEyQkgsS0FBM0I7QUFDQSxPQUhELE1BR087QUFDTixZQUFNSSxlQUFlLEdBQUduQixRQUFRLEdBQUcsR0FBWCxHQUFpQkMsUUFBekM7QUFDQW1CLFFBQUFBLCtCQUErQixDQUFFakUsU0FBRixFQUFhZ0UsZUFBYixDQUEvQjtBQUNBLE9BOUIwQyxDQWdDM0M7OztBQUNBRSxNQUFBQSxtQkFBbUI7QUFDbkIsS0FsQzhCLEVBa0M1QjVFLEtBbEM0QixDQUEvQjtBQW1DQSxHQTlDRixFQXppQmEsQ0EwbEJiOztBQUNBTCxFQUFBQSxDQUFDLENBQUU4RixNQUFGLENBQUQsQ0FBWTJELElBQVosQ0FBa0IsVUFBbEIsRUFBOEIsWUFBVztBQUN4QztBQUNBeEUsSUFBQUEsbUJBQW1CO0FBQ25CLEdBSEQ7QUFLQSxDQWptQkYiLCJmaWxlIjoid2MtYWpheC1wcm9kdWN0LWZpbHRlci1wdWJsaWMtc2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRGlzcGxheSB0eXBlIGZpZWxkcy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblxuXG59ICk7XG4iLCIvKipcbiAqIFRoZSBmcm9udGVuZCBmaWx0ZXIgZm9ybS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9wdWJsaWMvc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5jb25zdCB3Y2FwZl9wYXJhbXMgPSB3Y2FwZl9wYXJhbXMgfHwge1xuXHQnZmlsdGVyX2lucHV0X2RlbGF5JzogJycsXG5cdCdzaG9wX2xvb3BfY29udGFpbmVyJzogJycsXG5cdCdub3RfZm91bmRfY29udGFpbmVyJzogJycsXG5cdCdwYWdpbmF0aW9uX2NvbnRhaW5lcic6ICcnLCAvLyB0b2RvXG5cdCdzb3J0aW5nX2NvbnRyb2wnOiAnJywgLy8gdG9kb1xuXHQnc2Nyb2xsX3RvX3RvcCc6ICcnLCAvLyB0b2RvXG5cdCdzY3JvbGxfdG9fdG9wX29mZnNldCc6ICcnLCAvLyB0b2RvXG5cdCdjdXN0b21fc2NyaXB0cyc6ICcnLFxufTtcblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KFxuXHRmdW5jdGlvbiggJCApIHtcblxuXHRcdC8vIHJldHVybiBmYWxzZSBpZiB3Y2FwZl9wYXJhbXMgdmFyaWFibGUgaXMgbm90IGZvdW5kXG5cdFx0aWYgKCB0eXBlb2Ygd2NhcGZfcGFyYW1zID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRjb25zdCBfZGVsYXkgPSBwYXJzZUludCggd2NhcGZfcGFyYW1zLmZpbHRlcl9pbnB1dF9kZWxheSApO1xuXHRcdGNvbnN0IGRlbGF5ICA9IF9kZWxheSA+PSAwID8gX2RlbGF5IDogODAwO1xuXG5cdFx0Ly8gc3RvcmUgZmllbGRzJyBpZCBhbmQgZmlsdGVyIGluZm9ybWF0aW9uXG5cdFx0Y29uc3QgZmllbGRzID0ge307XG5cblx0XHRjb25zdCAkd2NhcGZTaW5nbGVGaWx0ZXJzID0gJCggJy53Y2FwZi1zaW5nbGUtZmlsdGVyJyApO1xuXHRcdGNvbnN0ICR3Y2FwZlRlcm1GaWx0ZXJzICAgPSAkKCAnLndjYXBmLWFqYXgtdGVybS1maWx0ZXInICk7XG5cblx0XHQkd2NhcGZUZXJtRmlsdGVycy5lYWNoKFxuXHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCAgICAgICAgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBpZCAgICAgICAgICAgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1pZCcgKTtcblx0XHRcdFx0Y29uc3QgJHdyYXBwZXIgICAgICAgPSAkZmllbGQuY2hpbGRyZW4oICdkaXYnICk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlcktleSAgICAgID0gJHdyYXBwZXIuYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRcdFx0Y29uc3QgbXVsdGlwbGVGaWx0ZXIgPSBwYXJzZUludCggJHdyYXBwZXIuYXR0ciggJ2RhdGEtbXVsdGlwbGUtZmlsdGVyJyApICk7XG5cblx0XHRcdFx0ZmllbGRzWyBpZCBdID0ge1xuXHRcdFx0XHRcdGZpbHRlcktleTogZmlsdGVyS2V5LFxuXHRcdFx0XHRcdG11bHRpcGxlRmlsdGVyOiBtdWx0aXBsZUZpbHRlclxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHQvLyBJbml0aWFsaXplIGpRdWVyeSBjaG9zZW4gbGlicmFyeVxuXHRcdGZ1bmN0aW9uIGluaXRDaG9zZW4oKSB7XG5cdFx0XHRpZiAoICEgalF1ZXJ5KCkuY2hvc2VuICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdCR3Y2FwZlRlcm1GaWx0ZXJzLmZpbmQoICcud2NhcGYtY2hvc2VuLXNlbGVjdCcgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJHRoaXMgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3Qgb3B0aW9ucyA9IHt9O1xuXG5cdFx0XHRcdGNvbnN0IG5vUmVzdWx0c01lc3NhZ2UgPSAkdGhpcy5hdHRyKCAnZGF0YS1uby1yZXN1bHRzLW1lc3NhZ2UnICk7XG5cblx0XHRcdFx0aWYgKCBub1Jlc3VsdHNNZXNzYWdlICkge1xuXHRcdFx0XHRcdG9wdGlvbnNbICdub19yZXN1bHRzX3RleHQnIF0gPSBub1Jlc3VsdHNNZXNzYWdlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JHRoaXMuY2hvc2VuKCBvcHRpb25zICk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0aW5pdENob3NlbigpO1xuXG5cdFx0Ly8gSW5pdGlhbGl6ZSBoaWVyYXJjaHkgYWNjb3JkaW9uXG5cdFx0ZnVuY3Rpb24gaW5pdEhpZXJhcmNoeUFjY29yZGlvbigpIHtcblx0XHRcdCR3Y2FwZlRlcm1GaWx0ZXJzLmZpbmQoICcuaGllcmFyY2h5LWFjY29yZGlvbi10b2dnbGUnICkub24oICdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKCB0aGlzICkudG9nZ2xlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0aW5pdEhpZXJhcmNoeUFjY29yZGlvbigpO1xuXG5cdFx0LyoqXG5cdFx0ICogQHNvdXJjZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzQxNDE4MTNcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSBudW1iZXJcblx0XHQgKiBAcGFyYW0gZGVjaW1hbHNcblx0XHQgKiBAcGFyYW0gZGVjX3BvaW50XG5cdFx0ICogQHBhcmFtIHRob3VzYW5kc19zZXBcblx0XHQgKlxuXHRcdCAqIEByZXR1cm5zIHtzdHJpbmd9XG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gbnVtYmVyX2Zvcm1hdCggbnVtYmVyLCBkZWNpbWFscywgZGVjX3BvaW50LCB0aG91c2FuZHNfc2VwICkge1xuXHRcdFx0Ly8gU3RyaXAgYWxsIGNoYXJhY3RlcnMgYnV0IG51bWVyaWNhbCBvbmVzLlxuXHRcdFx0bnVtYmVyID0gKCBudW1iZXIgKyAnJyApLnJlcGxhY2UoIC9bXjAtOStcXC1FZS5dL2csICcnICk7XG5cblx0XHRcdGNvbnN0IG4gICAgPSAhIGlzRmluaXRlKCArbnVtYmVyICkgPyAwIDogK251bWJlcjtcblx0XHRcdGNvbnN0IHByZWMgPSAhIGlzRmluaXRlKCArZGVjaW1hbHMgKSA/IDAgOiBNYXRoLmFicyggZGVjaW1hbHMgKTtcblx0XHRcdGNvbnN0IHNlcCAgPSAoIHR5cGVvZiB0aG91c2FuZHNfc2VwID09PSAndW5kZWZpbmVkJyApID8gJywnIDogdGhvdXNhbmRzX3NlcDtcblx0XHRcdGNvbnN0IGRlYyAgPSAoIHR5cGVvZiBkZWNfcG9pbnQgPT09ICd1bmRlZmluZWQnICkgPyAnLicgOiBkZWNfcG9pbnQ7XG5cblx0XHRcdGxldCBzO1xuXG5cdFx0XHRjb25zdCB0b0ZpeGVkRml4ID0gZnVuY3Rpb24oIG4sIHByZWMgKSB7XG5cdFx0XHRcdGNvbnN0IGsgPSBNYXRoLnBvdyggMTAsIHByZWMgKTtcblx0XHRcdFx0cmV0dXJuICcnICsgTWF0aC5yb3VuZCggbiAqIGsgKSAvIGs7XG5cdFx0XHR9O1xuXG5cdFx0XHQvLyBGaXggZm9yIElFIHBhcnNlRmxvYXQoMC41NSkudG9GaXhlZCgwKSA9IDA7XG5cdFx0XHRzID0gKCBwcmVjID8gdG9GaXhlZEZpeCggbiwgcHJlYyApIDogJycgKyBNYXRoLnJvdW5kKCBuICkgKS5zcGxpdCggJy4nICk7XG5cblx0XHRcdGlmICggc1sgMCBdLmxlbmd0aCA+IDMgKSB7XG5cdFx0XHRcdHNbIDAgXSA9IHNbIDAgXS5yZXBsYWNlKCAvXFxCKD89KD86XFxkezN9KSsoPyFcXGQpKS9nLCBzZXAgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAoIHNbIDEgXSB8fCAnJyApLmxlbmd0aCA8IHByZWMgKSB7XG5cdFx0XHRcdHNbIDEgXSA9IHNbIDEgXSB8fCAnJztcblx0XHRcdFx0c1sgMSBdICs9IG5ldyBBcnJheSggcHJlYyAtIHNbIDEgXS5sZW5ndGggKyAxICkuam9pbiggJzAnICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBzLmpvaW4oIGRlYyApO1xuXHRcdH1cblxuXHRcdC8vIEluaXRpYWxpemUgbm9VSVNsaWRlclxuXHRcdGZ1bmN0aW9uIGluaXROb1VJU2xpZGVyKCkge1xuXHRcdFx0JHdjYXBmU2luZ2xlRmlsdGVycy5maW5kKCAnLndjYXBmLXJhbmdlLXNsaWRlcicgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0Y29uc3QgZmlsdGVyS2V5ICAgICAgICAgPSAkaXRlbS5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0XHRjb25zdCAkc2xpZGVyICAgICAgICAgICA9ICRpdGVtLmZpbmQoICcud2NhcGYtbm91aS1zbGlkZXInICk7XG5cdFx0XHRcdGNvbnN0IHNsaWRlcklkICAgICAgICAgID0gJHNsaWRlci5hdHRyKCAnaWQnICk7XG5cdFx0XHRcdGNvbnN0IGRpc3BsYXlWYWx1ZXNBcyAgID0gJGl0ZW0uYXR0ciggJ2RhdGEtZGlzcGxheS12YWx1ZXMtYXMnICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApICk7XG5cdFx0XHRcdGNvbnN0IHN0ZXAgICAgICAgICAgICAgID0gcGFyc2VGbG9hdCggJGl0ZW0uYXR0ciggJ2RhdGEtc3RlcCcgKSApO1xuXHRcdFx0XHRjb25zdCBkZWNpbWFsUGxhY2VzICAgICA9ICRpdGVtLmF0dHIoICdkYXRhLWRlY2ltYWwtcGxhY2VzJyApO1xuXHRcdFx0XHRjb25zdCB0aG91c2FuZFNlcGFyYXRvciA9ICRpdGVtLmF0dHIoICdkYXRhLXRob3VzYW5kLXNlcGFyYXRvcicgKTtcblx0XHRcdFx0Y29uc3QgZGVjaW1hbFNlcGFyYXRvciAgPSAkaXRlbS5hdHRyKCAnZGF0YS1kZWNpbWFsLXNlcGFyYXRvcicgKTtcblx0XHRcdFx0Y29uc3QgbWluVmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1taW4tdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgbWF4VmFsdWUgICAgICAgICAgPSBwYXJzZUZsb2F0KCAkaXRlbS5hdHRyKCAnZGF0YS1tYXgtdmFsdWUnICkgKTtcblx0XHRcdFx0Y29uc3QgJG1pblZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1pbi12YWx1ZScgKTtcblx0XHRcdFx0Y29uc3QgJG1heFZhbHVlICAgICAgICAgPSAkaXRlbS5maW5kKCAnLm1heC12YWx1ZScgKTtcblxuXHRcdFx0XHRpZiAoICd1bmRlZmluZWQnID09PSB0eXBlb2Ygbm9VaVNsaWRlciApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggc2xpZGVySWQgKTtcblxuXHRcdFx0XHRub1VpU2xpZGVyLmNyZWF0ZSggc2xpZGVyLCB7XG5cdFx0XHRcdFx0c3RhcnQ6IFsgbWluVmFsdWUsIG1heFZhbHVlIF0sXG5cdFx0XHRcdFx0c3RlcCxcblx0XHRcdFx0XHRjb25uZWN0OiB0cnVlLFxuXHRcdFx0XHRcdHJhbmdlOiB7XG5cdFx0XHRcdFx0XHQnbWluJzogcmFuZ2VNaW5WYWx1ZSxcblx0XHRcdFx0XHRcdCdtYXgnOiByYW5nZU1heFZhbHVlLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAndXBkYXRlJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHRjb25zdCBtaW5WYWx1ZSA9IG51bWJlcl9mb3JtYXQoIHZhbHVlc1sgMCBdLCBkZWNpbWFsUGxhY2VzLCBkZWNpbWFsU2VwYXJhdG9yLCB0aG91c2FuZFNlcGFyYXRvciApO1xuXHRcdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gbnVtYmVyX2Zvcm1hdCggdmFsdWVzWyAxIF0sIGRlY2ltYWxQbGFjZXMsIGRlY2ltYWxTZXBhcmF0b3IsIHRob3VzYW5kU2VwYXJhdG9yICk7XG5cblx0XHRcdFx0XHRpZiAoICdwbGFpbl90ZXh0JyA9PT0gZGlzcGxheVZhbHVlc0FzICkge1xuXHRcdFx0XHRcdFx0JG1pblZhbHVlLmh0bWwoIG1pblZhbHVlICk7XG5cdFx0XHRcdFx0XHQkbWF4VmFsdWUuaHRtbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JG1pblZhbHVlLnZhbCggbWluVmFsdWUgKTtcblx0XHRcdFx0XHRcdCRtYXhWYWx1ZS52YWwoIG1heFZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0ZnVuY3Rpb24gZmlsdGVyUHJvZHVjdHNBY2NvcmRpbmdUb1NsaWRlciggdmFsdWVzICkge1xuXHRcdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gcGFyc2VGbG9hdCggdmFsdWVzWyAwIF0gKTtcblx0XHRcdFx0XHRjb25zdCBtYXhWYWx1ZSA9IHBhcnNlRmxvYXQoIHZhbHVlc1sgMSBdICk7XG5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIG1heFZhbHVlID09PSByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGNvbnN0IGZpbHRlclZhbFN0cmluZyA9IG1pblZhbHVlICsgJysnICsgbWF4VmFsdWU7XG5cdFx0XHRcdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbFN0cmluZyApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNsaWRlci5ub1VpU2xpZGVyLm9uKCAnZW5kJywgZnVuY3Rpb24oIHZhbHVlcyApIHtcblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpdGVtLmRhdGEoICd0aW1lcicgKSApO1xuXG5cdFx0XHRcdFx0JGl0ZW0uZGF0YSggJ3RpbWVyJywgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGZpbHRlclByb2R1Y3RzQWNjb3JkaW5nVG9TbGlkZXIoIHZhbHVlcyApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtaW5WYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRcdCRpbnB1dC5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IG1pblZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5zZXQoIFsgbWluVmFsdWUsIG51bGwgXSApO1xuXG5cdFx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCRtYXhWYWx1ZS5vbiggJ2lucHV0JywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cblx0XHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoICRpbnB1dC5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHRcdCRpbnB1dC5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCRpbnB1dC5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IG1heFZhbHVlID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdFx0XHRzbGlkZXIubm9VaVNsaWRlci5zZXQoIFsgbnVsbCwgbWF4VmFsdWUgXSApO1xuXG5cdFx0XHRcdFx0XHRmaWx0ZXJQcm9kdWN0c0FjY29yZGluZ1RvU2xpZGVyKCBzbGlkZXIubm9VaVNsaWRlci5nZXQoKSApO1xuXHRcdFx0XHRcdH0sIGRlbGF5ICkgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdGluaXROb1VJU2xpZGVyKCk7XG5cblx0XHQvLyBzaG93IGEgbG9hZGluZyBpbmRpY2F0b3Jcblx0XHRmdW5jdGlvbiB3Y2FwZkJlZm9yZVVwZGF0ZSgpIHtcblx0XHRcdCQoICdib2R5JyApLnRyaWdnZXIoICd3Y2FwZl9iZWZvcmVfdXBkYXRlJyApO1xuXHRcdH1cblxuXHRcdC8vIHNjcm9sbCB0byB0b3Bcblx0XHRmdW5jdGlvbiB3Y2FwZkFmdGVyVXBkYXRlKCkge1xuXHRcdFx0aW5pdENob3NlbigpO1xuXHRcdFx0aW5pdEhpZXJhcmNoeUFjY29yZGlvbigpO1xuXG5cdFx0XHQkKCAnYm9keScgKS50cmlnZ2VyKCAnd2NhcGZfYWZ0ZXJfdXBkYXRlJyApO1xuXHRcdH1cblxuXHRcdC8vIGZpbHRlciB0aGUgcHJvZHVjdHNcblx0XHRmdW5jdGlvbiB3Y2FwZkZpbHRlclByb2R1Y3RzKCkge1xuXHRcdFx0d2NhcGZCZWZvcmVVcGRhdGUoKTtcblxuXHRcdFx0JC5nZXQoXG5cdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuXHRcdFx0XHRmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdFx0XHRjb25zdCAkZGF0YSA9ICQoIGRhdGEgKTtcblxuXHRcdFx0XHRcdGNvbnN0ICRzaG9wTG9vcENvbnRhaW5lciA9ICRkYXRhLmZpbmQoIHdjYXBmX3BhcmFtcy5zaG9wX2xvb3BfY29udGFpbmVyICk7XG5cdFx0XHRcdFx0Y29uc3QgJG5vdEZvdW5kQ29udGFpbmVyID0gJGRhdGEuZmluZCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKTtcblxuXHRcdFx0XHRcdC8vIHJlcGxhY2UgZmllbGRzJyBkYXRhIHdpdGggbmV3IGRhdGFcblx0XHRcdFx0XHQkLmVhY2goXG5cdFx0XHRcdFx0XHRmaWVsZHMsXG5cdFx0XHRcdFx0XHRmdW5jdGlvbiggaWQgKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGZpZWxkSUQgICAgPSAnW2RhdGEtaWQ9XCInICsgaWQgKyAnXCJdJztcblx0XHRcdFx0XHRcdFx0Y29uc3QgJGZpZWxkICAgICA9ICQoIGZpZWxkSUQgKTtcblx0XHRcdFx0XHRcdFx0Y29uc3QgX2ZpZWxkICAgICA9ICRkYXRhLmZpbmQoIGZpZWxkSUQgKTtcblx0XHRcdFx0XHRcdFx0Y29uc3QgZmllbGRDbGFzcyA9ICQoIF9maWVsZCApLmF0dHIoICdjbGFzcycgKTtcblxuXHRcdFx0XHRcdFx0XHQvLyB1cGRhdGUgY2xhc3Ncblx0XHRcdFx0XHRcdFx0JGZpZWxkLmF0dHIoICdjbGFzcycsIGZpZWxkQ2xhc3MgKTtcblxuXHRcdFx0XHRcdFx0XHQvLyB1cGRhdGUgZmllbGRcblx0XHRcdFx0XHRcdFx0JGZpZWxkLmh0bWwoIF9maWVsZC5odG1sKCkgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0Ly8gcmVwbGFjZSBvbGQgc2hvcCBsb29wIHdpdGggbmV3IG9uZVxuXHRcdFx0XHRcdGlmICggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgPT09IHdjYXBmX3BhcmFtcy5ub3RfZm91bmRfY29udGFpbmVyICkge1xuXHRcdFx0XHRcdFx0JCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5odG1sKCAkc2hvcExvb3BDb250YWluZXIuaHRtbCgpICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGlmICggJCggd2NhcGZfcGFyYW1zLm5vdF9mb3VuZF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJHNob3BMb29wQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMubm90X2ZvdW5kX2NvbnRhaW5lciApLmh0bWwoICRub3RGb3VuZENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICggJCggd2NhcGZfcGFyYW1zLnNob3BfbG9vcF9jb250YWluZXIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggJHNob3BMb29wQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRzaG9wTG9vcENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICggJG5vdEZvdW5kQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0XHQkKCB3Y2FwZl9wYXJhbXMuc2hvcF9sb29wX2NvbnRhaW5lciApLmh0bWwoICRub3RGb3VuZENvbnRhaW5lci5odG1sKCkgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHdjYXBmQWZ0ZXJVcGRhdGUoKTtcblxuXHRcdFx0XHRcdC8vIHRvZG9cblx0XHRcdFx0XHQvLyByZWluaXRpYWxpemUgb3JkZXJpbmdcblx0XHRcdFx0XHQvLyB3Y2FwZkluaXRPcmRlcigpO1xuXG5cdFx0XHRcdFx0Ly8gdG9kb1xuXHRcdFx0XHRcdC8vIHJlaW5pdGlhbGl6ZSBkcm9wZG93biBmaWx0ZXJcblx0XHRcdFx0XHQvLyB3Y2FwZkRyb3BEb3duRmlsdGVyKCk7XG5cblx0XHRcdFx0XHQvLyBydW4gc2NyaXB0cyBhZnRlciBzaG9wIGxvb3AgdW5kYXRlZFxuXHRcdFx0XHRcdGlmICggdHlwZW9mIHdjYXBmX3BhcmFtcy5jdXN0b21fc2NyaXB0cyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2NhcGZfcGFyYW1zLmN1c3RvbV9zY3JpcHRzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0XHRldmFsKCB3Y2FwZl9wYXJhbXMuY3VzdG9tX3NjcmlwdHMgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0Ly8gVVJMIFBhcnNlclxuXHRcdGZ1bmN0aW9uIHdjYXBmR2V0VXJsVmFycyggdXJsICkge1xuXHRcdFx0bGV0IHZhcnMgPSB7fSwgaGFzaDtcblxuXHRcdFx0aWYgKCB0eXBlb2YgdXJsID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0dXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGhhc2hlcyAgPSB1cmwuc2xpY2UoIHVybC5pbmRleE9mKCAnPycgKSArIDEgKS5zcGxpdCggJyYnICk7XG5cdFx0XHRjb25zdCBoTGVuZ3RoID0gaGFzaGVzLmxlbmd0aDtcblxuXHRcdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgaExlbmd0aDsgaSsrICkge1xuXHRcdFx0XHRoYXNoID0gaGFzaGVzWyBpIF0uc3BsaXQoICc9JyApO1xuXG5cdFx0XHRcdHZhcnNbIGhhc2hbIDAgXSBdID0gaGFzaFsgMSBdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdmFycztcblx0XHR9XG5cblx0XHQvLyBldmVyeXRpbWUgd2UgYXBwbHkgdGhlIGZpbHRlciB3ZSBzZXQgdGhlIGN1cnJlbnQgcGFnZSB0byAxXG5cdFx0ZnVuY3Rpb24gd2NhcGZGaXhQYWdpbmF0aW9uKCkge1xuXHRcdFx0bGV0IHVybCAgICAgICAgICAgICAgICA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXHRcdFx0Y29uc3QgcGFyYW1zICAgICAgICAgICA9IHdjYXBmR2V0VXJsVmFycyggdXJsICk7XG5cdFx0XHRjb25zdCBjdXJyZW50UGFnZUluVXJsID0gcGFyc2VJbnQoIHVybC5yZXBsYWNlKCAvLitcXC9wYWdlXFwvKFxcZCspKy8sICckMScgKSApO1xuXG5cdFx0XHRpZiAoIGN1cnJlbnRQYWdlSW5VcmwgKSB7XG5cdFx0XHRcdGlmICggY3VycmVudFBhZ2VJblVybCA+IDEgKSB7XG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoIC9wYWdlXFwvKFxcZCspLywgJ3BhZ2UvMScgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICggdHlwZW9mIHBhcmFtc1sgJ3BhZ2VkJyBdICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0Y29uc3QgY3VycmVudFBhZ2VJblBhcmFtcyA9IHBhcnNlSW50KCBwYXJhbXNbICdwYWdlZCcgXSApO1xuXG5cdFx0XHRcdGlmICggY3VycmVudFBhZ2VJblBhcmFtcyA+IDEgKSB7XG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoICdwYWdlZD0nICsgY3VycmVudFBhZ2VJblBhcmFtcywgJ3BhZ2VkPTEnICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHVybDtcblx0XHR9XG5cblx0XHQvLyB1cGRhdGUgcXVlcnkgc3RyaW5nIGZvciBjYXRlZ29yaWVzLCBtZXRhIGV0Yy4uXG5cdFx0ZnVuY3Rpb24gd2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlcigga2V5LCB2YWx1ZSwgcHVzaEhpc3RvcnksIHVybCApIHtcblx0XHRcdGlmICggdHlwZW9mIHB1c2hIaXN0b3J5ID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0cHVzaEhpc3RvcnkgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIHR5cGVvZiB1cmwgPT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHR1cmwgPSB3Y2FwZkZpeFBhZ2luYXRpb24oKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgcmUgICAgICAgID0gbmV3IFJlZ0V4cCggJyhbPyZdKScgKyBrZXkgKyAnPS4qPygmfCQpJywgJ2knICk7XG5cdFx0XHRjb25zdCBzZXBhcmF0b3IgPSB1cmwuaW5kZXhPZiggJz8nICkgIT09IC0xID8gJyYnIDogJz8nO1xuXHRcdFx0bGV0IHVybFdpdGhRdWVyeTtcblxuXHRcdFx0aWYgKCB1cmwubWF0Y2goIHJlICkgKSB7XG5cdFx0XHRcdHVybFdpdGhRdWVyeSA9IHVybC5yZXBsYWNlKCByZSwgJyQxJyArIGtleSArICc9JyArIHZhbHVlICsgJyQyJyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dXJsV2l0aFF1ZXJ5ID0gdXJsICsgc2VwYXJhdG9yICsga2V5ICsgJz0nICsgdmFsdWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggcHVzaEhpc3RvcnkgPT09IHRydWUgKSB7XG5cdFx0XHRcdHJldHVybiBoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCB1cmxXaXRoUXVlcnkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB1cmxXaXRoUXVlcnk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gcmVtb3ZlIHBhcmFtZXRlciBmcm9tIHVybFxuXHRcdGZ1bmN0aW9uIHdjYXBmUmVtb3ZlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgdXJsICkge1xuXHRcdFx0aWYgKCB0eXBlb2YgdXJsID09PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdFx0dXJsID0gd2NhcGZGaXhQYWdpbmF0aW9uKCk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IG9sZFBhcmFtcyAgICAgICAgID0gd2NhcGZHZXRVcmxWYXJzKCB1cmwgKTtcblx0XHRcdGNvbnN0IG9sZFBhcmFtc0xlbmd0aCAgID0gT2JqZWN0LmtleXMoIG9sZFBhcmFtcyApLmxlbmd0aDtcblx0XHRcdGNvbnN0IHN0YXJ0UG9zaXRpb24gICAgID0gdXJsLmluZGV4T2YoICc/JyApO1xuXHRcdFx0Y29uc3QgZmlsdGVyS2V5UG9zaXRpb24gPSB1cmwuaW5kZXhPZiggZmlsdGVyS2V5ICk7XG5cdFx0XHRsZXQgY2xlYW5VcmwsIGNsZWFuUXVlcnk7XG5cblx0XHRcdGlmICggb2xkUGFyYW1zTGVuZ3RoID4gMSApIHtcblx0XHRcdFx0aWYgKCAoIGZpbHRlcktleVBvc2l0aW9uIC0gc3RhcnRQb3NpdGlvbiApID4gMSApIHtcblx0XHRcdFx0XHRjbGVhblVybCA9IHVybC5yZXBsYWNlKCAnJicgKyBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdLCAnJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNsZWFuVXJsID0gdXJsLnJlcGxhY2UoIGZpbHRlcktleSArICc9JyArIG9sZFBhcmFtc1sgZmlsdGVyS2V5IF0gKyAnJicsICcnICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCBuZXdQYXJhbXMgPSBjbGVhblVybC5zcGxpdCggJz8nICk7XG5cdFx0XHRcdGNsZWFuUXVlcnkgICAgICA9ICc/JyArIG5ld1BhcmFtc1sgMSBdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2xlYW5RdWVyeSA9IHVybC5yZXBsYWNlKCAnPycgKyBmaWx0ZXJLZXkgKyAnPScgKyBvbGRQYXJhbXNbIGZpbHRlcktleSBdLCAnJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gY2xlYW5RdWVyeTtcblx0XHR9XG5cblx0XHQvLyB0YWtlIHRoZSBrZXkgYW5kIHZhbHVlIGFuZCBtYWtlIHF1ZXJ5XG5cdFx0ZnVuY3Rpb24gd2NhcGZNYWtlUGFyYW1ldGVycyggZmlsdGVyS2V5LCBmaWx0ZXJWYWx1ZSwgdXJsICkge1xuXHRcdFx0bGV0IHBhcmFtcywgbmV4dFZhbHVlcywgZW1wdHlWYWx1ZSA9IGZhbHNlO1xuXG5cdFx0XHRpZiAoIHR5cGVvZiB1cmwgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0XHRwYXJhbXMgPSB3Y2FwZkdldFVybFZhcnMoIHVybCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cGFyYW1zID0gd2NhcGZHZXRVcmxWYXJzKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggdHlwZW9mIHBhcmFtc1sgZmlsdGVyS2V5IF0gIT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRcdGNvbnN0IHByZXZWYWx1ZXMgICAgICA9IHBhcmFtc1sgZmlsdGVyS2V5IF07XG5cdFx0XHRcdGNvbnN0IHByZXZWYWx1ZXNBcnJheSA9IHByZXZWYWx1ZXMuc3BsaXQoICcsJyApO1xuXG5cdFx0XHRcdGlmICggcHJldlZhbHVlcy5sZW5ndGggPiAwICkge1xuXHRcdFx0XHRcdGNvbnN0IGZvdW5kID0gJC5pbkFycmF5KCBmaWx0ZXJWYWx1ZSwgcHJldlZhbHVlc0FycmF5ICk7XG5cblx0XHRcdFx0XHRpZiAoIGZvdW5kID49IDAgKSB7XG5cdFx0XHRcdFx0XHQvLyBFbGVtZW50IHdhcyBmb3VuZCwgcmVtb3ZlIGl0LlxuXHRcdFx0XHRcdFx0cHJldlZhbHVlc0FycmF5LnNwbGljZSggZm91bmQsIDEgKTtcblxuXHRcdFx0XHRcdFx0aWYgKCBwcmV2VmFsdWVzQXJyYXkubGVuZ3RoID09PSAwICkge1xuXHRcdFx0XHRcdFx0XHRlbXB0eVZhbHVlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gRWxlbWVudCB3YXMgbm90IGZvdW5kLCBhZGQgaXQuXG5cdFx0XHRcdFx0XHRwcmV2VmFsdWVzQXJyYXkucHVzaCggZmlsdGVyVmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIHByZXZWYWx1ZXNBcnJheS5sZW5ndGggPiAxICkge1xuXHRcdFx0XHRcdFx0bmV4dFZhbHVlcyA9IHByZXZWYWx1ZXNBcnJheS5qb2luKCAnLCcgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bmV4dFZhbHVlcyA9IHByZXZWYWx1ZXNBcnJheTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bmV4dFZhbHVlcyA9IGZpbHRlclZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRuZXh0VmFsdWVzID0gZmlsdGVyVmFsdWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHVwZGF0ZSB1cmwgYW5kIHF1ZXJ5IHN0cmluZ1xuXHRcdFx0aWYgKCAhIGVtcHR5VmFsdWUgKSB7XG5cdFx0XHRcdHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgbmV4dFZhbHVlcyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0aGlzdG9yeS5wdXNoU3RhdGUoIHt9LCAnJywgcXVlcnkgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gd2NhcGZTaW5nbGVGaWx0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKSB7XG5cdFx0XHRjb25zdCBwYXJhbXMgPSB3Y2FwZkdldFVybFZhcnMoKTtcblx0XHRcdGxldCBxdWVyeTtcblxuXHRcdFx0aWYgKCB0eXBlb2YgcGFyYW1zWyBmaWx0ZXJLZXkgXSAhPT0gJ3VuZGVmaW5lZCcgJiYgcGFyYW1zWyBmaWx0ZXJLZXkgXSA9PT0gZmlsdGVyVmFsdWUgKSB7XG5cdFx0XHRcdHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRxdWVyeSA9IHdjYXBmVXBkYXRlUXVlcnlTdHJpbmdQYXJhbWV0ZXIoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUsIGZhbHNlICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHVwZGF0ZSB1cmxcblx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0d2NhcGZGaWx0ZXJQcm9kdWN0cygpO1xuXHRcdH1cblxuXHRcdC8vIFRoZSBtYWluIGZ1bmN0aW9uIHRvIGhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3Rcblx0XHRmdW5jdGlvbiBoYW5kbGVGaWx0ZXJSZXF1ZXN0KCAkaXRlbSwgZmlsdGVyVmFsdWUgKSB7XG5cdFx0XHRjb25zdCAkZmllbGQgICAgICAgICA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtc2luZ2xlLWZpbHRlcicgKTtcblx0XHRcdGNvbnN0IGZpZWxkSUQgICAgICAgID0gJGZpZWxkLmF0dHIoICdkYXRhLWlkJyApO1xuXHRcdFx0Y29uc3QgZmllbGREYXRhICAgICAgPSBmaWVsZHNbIGZpZWxkSUQgXTtcblx0XHRcdGNvbnN0IGZpbHRlcktleSAgICAgID0gZmllbGREYXRhLmZpbHRlcktleTtcblx0XHRcdGNvbnN0IG11bHRpcGxlRmlsdGVyID0gZmllbGREYXRhLm11bHRpcGxlRmlsdGVyO1xuXG5cdFx0XHRpZiAoICEgZmlsdGVyS2V5ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISBmaWx0ZXJWYWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gd2NhcGZSZW1vdmVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5ICk7XG5cdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cblx0XHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggbXVsdGlwbGVGaWx0ZXIgKSB7XG5cdFx0XHRcdHdjYXBmTWFrZVBhcmFtZXRlcnMoIGZpbHRlcktleSwgZmlsdGVyVmFsdWUgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdjYXBmU2luZ2xlRmlsdGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbHVlICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gaGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgbGlzdCBmaWVsZHNcblx0XHQkd2NhcGZUZXJtRmlsdGVycy5vbihcblx0XHRcdCdjaGFuZ2UnLFxuXHRcdFx0Jy53Y2FwZi1sYXllcmVkLW5hdiBbdHlwZT1cImNoZWNrYm94XCJdLCAud2NhcGYtbGF5ZXJlZC1uYXYgW3R5cGU9XCJyYWRpb1wiXScsXG5cdFx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGl0ZW0gICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlclZhbHVlID0gJGl0ZW0udmFsKCk7XG5cblx0XHRcdFx0aGFuZGxlRmlsdGVyUmVxdWVzdCggJGl0ZW0sIGZpbHRlclZhbHVlICk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdC8vIFRPRE86IFVzZSBhIGNvbWJpbmF0aW9uIG9mIGxhYmVsLCBjaGVja2JveCBhbmQgcmFkaW9cblx0XHQvLyBoYW5kbGUgdGhlIGZpbHRlciByZXF1ZXN0IGZvciBsYWJlbGVkIGl0ZW1cblx0XHQkd2NhcGZUZXJtRmlsdGVycy5vbihcblx0XHRcdCdjbGljaycsXG5cdFx0XHQnLndjYXBmLWxhYmVsZWQtbmF2IC5pdGVtJyxcblx0XHRcdGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkaXRlbSAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgZmlsdGVyVmFsdWUgPSAkaXRlbS5hdHRyKCAnZGF0YS12YWx1ZScgKTtcblxuXHRcdFx0XHRoYW5kbGVGaWx0ZXJSZXF1ZXN0KCAkaXRlbSwgZmlsdGVyVmFsdWUgKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0Ly8gaGFuZGxlIHRoZSBmaWx0ZXIgcmVxdWVzdCBmb3IgZGlzcGxheSB0eXBlIHNlbGVjdCBmaWVsZHNcblx0XHQkd2NhcGZUZXJtRmlsdGVycy5vbihcblx0XHRcdCdjaGFuZ2UnLFxuXHRcdFx0J3NlbGVjdCcsXG5cdFx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0Y29uc3QgJGl0ZW0gICAgICAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IGZpbHRlclZhbHVlID0gJGl0ZW0udmFsKCk7XG5cblx0XHRcdFx0Y29uc3QgJGZpZWxkICAgID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1zaW5nbGUtZmlsdGVyJyApO1xuXHRcdFx0XHRjb25zdCBmaWVsZElEICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtaWQnICk7XG5cdFx0XHRcdGNvbnN0IGZpZWxkRGF0YSA9IGZpZWxkc1sgZmllbGRJRCBdO1xuXHRcdFx0XHRjb25zdCBmaWx0ZXJLZXkgPSBmaWVsZERhdGEuZmlsdGVyS2V5O1xuXG5cdFx0XHRcdGlmICggISBmaWx0ZXJWYWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0XHRoaXN0b3J5LnB1c2hTdGF0ZSgge30sICcnLCBxdWVyeSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IGZpbHRlclZhbFN0cmluZyA9IGZpbHRlclZhbHVlLnRvU3RyaW5nKCk7XG5cdFx0XHRcdFx0d2NhcGZVcGRhdGVRdWVyeVN0cmluZ1BhcmFtZXRlciggZmlsdGVyS2V5LCBmaWx0ZXJWYWxTdHJpbmcgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdC8vIGhhbmRsZSB0aGUgZmlsdGVyIHJlcXVlc3QgZm9yIHJhbmdlIG51bWJlclxuXHRcdCR3Y2FwZlNpbmdsZUZpbHRlcnMub24oXG5cdFx0XHQnaW5wdXQnLFxuXHRcdFx0Jy53Y2FwZi1yYW5nZS1udW1iZXIgLm1pbi12YWx1ZSwgLndjYXBmLXJhbmdlLW51bWJlciAubWF4LXZhbHVlJyxcblx0XHRcdGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRjb25zdCAkaXRlbSA9ICQoIHRoaXMgKTtcblxuXHRcdFx0XHQvLyBDbGVhciBhbnkgcHJldmlvdXNseSBzZXQgdGltZXIgYmVmb3JlIHNldHRpbmcgYSBmcmVzaCBvbmVcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCAkaXRlbS5kYXRhKCAndGltZXInICkgKTtcblxuXHRcdFx0XHQkaXRlbS5kYXRhKCAndGltZXInLCBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkaXRlbS5yZW1vdmVEYXRhKCAndGltZXInICk7XG5cblx0XHRcdFx0XHRjb25zdCAkcmFuZ2VOdW1iZXIgID0gJGl0ZW0uY2xvc2VzdCggJy53Y2FwZi1yYW5nZS1udW1iZXInICk7XG5cdFx0XHRcdFx0Y29uc3QgZmlsdGVyS2V5ICAgICA9ICRyYW5nZU51bWJlci5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdFx0XHRcdGNvbnN0IHJhbmdlTWluVmFsdWUgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWluLXZhbHVlJyApO1xuXHRcdFx0XHRcdGNvbnN0IHJhbmdlTWF4VmFsdWUgPSAkcmFuZ2VOdW1iZXIuYXR0ciggJ2RhdGEtcmFuZ2UtbWF4LXZhbHVlJyApO1xuXHRcdFx0XHRcdGxldCBtaW5WYWx1ZSAgICAgICAgPSAkcmFuZ2VOdW1iZXIuZmluZCggJy5taW4tdmFsdWUnICkudmFsKCk7XG5cdFx0XHRcdFx0bGV0IG1heFZhbHVlICAgICAgICA9ICRyYW5nZU51bWJlci5maW5kKCAnLm1heC12YWx1ZScgKS52YWwoKTtcblxuXHRcdFx0XHRcdGlmICggISBtaW5WYWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRtaW5WYWx1ZSA9IHJhbmdlTWluVmFsdWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCAhIG1heFZhbHVlLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdG1heFZhbHVlID0gcmFuZ2VNYXhWYWx1ZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIHBhcnNlRmxvYXQoIG1pblZhbHVlICkgPiBwYXJzZUZsb2F0KCBtYXhWYWx1ZSApICkge1xuXHRcdFx0XHRcdFx0bWF4VmFsdWUgPSBtaW5WYWx1ZTtcblxuXHRcdFx0XHRcdFx0JHJhbmdlTnVtYmVyLmZpbmQoICcubWF4LXZhbHVlJyApLnZhbCggbWF4VmFsdWUgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoIG1pblZhbHVlID09PSByYW5nZU1pblZhbHVlICYmIG1heFZhbHVlID09PSByYW5nZU1heFZhbHVlICkge1xuXHRcdFx0XHRcdFx0Y29uc3QgcXVlcnkgPSB3Y2FwZlJlbW92ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXkgKTtcblx0XHRcdFx0XHRcdGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgJycsIHF1ZXJ5ICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGNvbnN0IGZpbHRlclZhbFN0cmluZyA9IG1pblZhbHVlICsgJysnICsgbWF4VmFsdWU7XG5cdFx0XHRcdFx0XHR3Y2FwZlVwZGF0ZVF1ZXJ5U3RyaW5nUGFyYW1ldGVyKCBmaWx0ZXJLZXksIGZpbHRlclZhbFN0cmluZyApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIGZpbHRlciBwcm9kdWN0c1xuXHRcdFx0XHRcdHdjYXBmRmlsdGVyUHJvZHVjdHMoKTtcblx0XHRcdFx0fSwgZGVsYXkgKSApO1xuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHQvLyBoaXN0b3J5IGJhY2sgYW5kIGZvcndhcmQgcmVxdWVzdCBoYW5kbGluZ1xuXHRcdCQoIHdpbmRvdyApLmJpbmQoICdwb3BzdGF0ZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gZmlsdGVyIHByb2R1Y3RzXG5cdFx0XHR3Y2FwZkZpbHRlclByb2R1Y3RzKCk7XG5cdFx0fSApO1xuXG5cdH1cbik7XG4iXX0=
