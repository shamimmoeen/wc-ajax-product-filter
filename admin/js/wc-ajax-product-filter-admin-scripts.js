"use strict";

/**
 * Display type fields.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function ($) {
  var fieldWrapper = $('#chosen_field_wrapper');
  fieldWrapper.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-display_type select' === handler) {
      var $queryType = $field.find('.wcapf-form-sub-field-query_type');
      var validDisplayTypes = ['label', 'color', 'image'];

      if (validDisplayTypes.includes(value)) {
        var $multipleFilter = $field.find('.wcapf-form-sub-field-enable_multiple_filter input');

        if ($multipleFilter.is(':checked')) {
          $queryType.show();
        } else {
          $queryType.hide();
        }
      }
    }
  });
  fieldWrapper.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-enable_multiple_filter input' === handler) {
      var $queryType = $field.find('.wcapf-form-sub-field-query_type');
      var $displayType = $field.find('.wcapf-form-sub-field-display_type select');
      var displayType = $displayType.val();
      var validDisplayTypes = ['label', 'color', 'image'];

      if (validDisplayTypes.includes(displayType)) {
        if ('1' === value) {
          $queryType.show();
        } else {
          $queryType.hide();
        }
      }
    }
  });
});
"use strict";

/**
 * Display type fields.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function ($) {
  var fieldWrapper = $('#chosen_field_wrapper'); // Override no-results-message, all-items-label field's toggle visibility when text display type is changed.

  fieldWrapper.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-display_type select' === handler) {
      var $noResults = $field.find('.wcapf-form-sub-field-chosen_no_results_message');
      var $allItemsLabel = $field.find('.wcapf-form-sub-field-all_items_label');
      var useChosen = $field.find('.wcapf-form-sub-field-use_chosen input').is(':checked');

      if (useChosen && ('select' === value || 'multi-select' === value)) {
        $noResults.show();
      } else {
        $noResults.hide();
      }

      if ('radio' === value || 'select' === value || 'multi-select' === value && useChosen) {
        $allItemsLabel.show();
      } else {
        $allItemsLabel.hide();
      }
    }
  }); // Override no-results-message, all-items-label field's toggle visibility when text use chosen is changed.

  fieldWrapper.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-use_chosen input' === handler) {
      var $noResults = $field.find('.wcapf-form-sub-field-chosen_no_results_message');
      var $allItemsLabel = $field.find('.wcapf-form-sub-field-all_items_label');
      var displayType = $field.find('.wcapf-form-sub-field-display_type select').val();

      if ('1' === value && ('select' === displayType || 'multi-select' === displayType)) {
        $noResults.show();
      } else {
        $noResults.hide();
      }

      if ('1' === value && 'multi-select' === displayType || 'radio' === displayType || 'select' === displayType) {
        $allItemsLabel.show();
      } else {
        $allItemsLabel.hide();
      }
    }
  });
});
"use strict";

/**
 * Field meta box.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function ($) {
  var fieldWrapper = $('#chosen_field_wrapper');
  $('#available_fields').on('change', '[name="_active_field"]', function () {
    var $this = $(this);

    var _fieldType = $this.val();

    var fieldName = $this.attr('data-field-name');

    if (!_fieldType) {
      return;
    }

    var fieldType = 'wcapf-form-field-' + _fieldType; // Bail out if no tmpl found for the type.

    if (!jQuery('#tmpl-' + fieldType).length) {
      return;
    }

    var template = wp.template(fieldType);
    var rendered = template();
    var fieldDataWrapper = fieldWrapper.find('#field_data');
    var fieldNameWrapper = fieldWrapper.find('.postbox-header h2');
    var fieldInside = fieldWrapper.find('.inside');
    fieldWrapper.removeClass('hidden');
    fieldDataWrapper.attr('data-field-type', _fieldType);
    fieldNameWrapper.html(fieldName);
    fieldInside.html(rendered);
    fieldWrapper.trigger('field_added');
  });
});
"use strict";

/**
 * Field meta box.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function ($) {
  function generateProductPrices($form, data) {
    var $progressWrapper = $form.find('.progress-stat'),
        $progressbar = $progressWrapper.find('.progressbar > div'),
        $progressCount = $progressWrapper.find('.count'),
        $progressTotal = $progressWrapper.find('.total'),
        $submitBtn = $form.find('.button'),
        $successMessage = $form.find('.success-message'),
        $errorMessage = $form.find('.error-message');
    var wcapf_params = window['wcapf_admin_params'];
    var ajaxurl = wcapf_params['ajaxurl'];
    $.ajax({
      url: ajaxurl,
      type: 'POST',
      dataType: 'json',
      data: data,
      success: function success(response) {
        var message = response.message;
        var _data = response.data;
        var status = _data['status'];
        var page = _data['page'];
        var count = _data['count'];
        var percentage = _data['percentage'];
        var totalProducts = _data['total_products'];

        if (response.success === 'true') {
          $progressCount.html(count);
          $progressbar.css('width', percentage + '%');

          if (!$progressWrapper.hasClass('active')) {
            $progressWrapper.addClass('active');
          }

          if (status === 'incomplete') {
            $progressTotal.html(totalProducts);
            data['page'] = page;
            data['count'] = count;
            generateProductPrices($form, data);
          } else {
            setTimeout(function () {
              $progressWrapper.removeClass('active');
              $progressbar.css('width', '0');
              $submitBtn.removeAttr('disabled');
              $successMessage.html(message);
            }, 1500);
          }
        } else {
          $submitBtn.removeAttr('disabled');
          $errorMessage.html(message);
        }
      }
    }).fail(function (response) {
      $progressWrapper.removeClass('active');
      $progressbar.css('width', '0');
      $submitBtn.removeAttr('disabled');

      if (window.console && window.console.log) {
        console.log(response);
      }
    });
  }

  $('.wrap').on('submit', '#generate-product-prices', function (e) {
    e.preventDefault();
    var $form = $(this),
        $progressWrapper = $form.find('.progress-stat'),
        $progressbar = $progressWrapper.find('.progressbar > div'),
        $submitBtn = $form.find('.button'),
        $successMessage = $form.find('.success-message'),
        $errorMessage = $form.find('.error-message'),
        data = $form.serializeObject();
    $progressbar.css('width', '0');
    $successMessage.html('');
    $errorMessage.html('');
    $submitBtn.attr('disabled', 'disabled');
    generateProductPrices($form, data);
  });
});
"use strict";

/**
 * Manual Options' table function.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */

/**
 * @param tableIdentifier
 * @param valueIdentifier
 * @param rowTemplateId
 * @param rowDefaultOptions
 */
function initManualOptionsTable(tableIdentifier, valueIdentifier, rowTemplateId) {
  var rowDefaultOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var $ = jQuery;
  var fieldWrapper = $('#chosen_field_wrapper');
  var fieldIdentifier = '.wcapf-form-field';
  var rowsIdentifier = '.field-table-body-rows';
  var rowIdentifier = '.row-item';

  function initSortableTable($selector) {
    $selector.sortable({
      opacity: 0.8,
      revert: false,
      cursor: 'move',
      axis: 'y',
      handle: '.move-options-handler',
      placeholder: 'widget-placeholder',
      update: function update(e) {
        var $field = $(e.target).closest('.wcapf-form-field');
        triggerOptionsChange($field);
      }
    }).disableSelection();
  }

  var tableRowsIdentifier = tableIdentifier + ' ' + rowsIdentifier; // Init the sortable table after page loads.

  initSortableTable(fieldWrapper.find(tableRowsIdentifier)); // Init the sortable table after the field is added.

  fieldWrapper.on('field_added', function () {
    initSortableTable($(fieldWrapper.find(tableRowsIdentifier)));
  });

  function triggerOptionsChange($field) {
    var $valueHolder = $field.find(valueIdentifier);
    var $rows = $field.find(tableRowsIdentifier);
    var _rows = [];
    $rows.find('.row-item').each(function (i, _item) {
      var $item = $(_item);
      var obj = {};
      $item.find('[data-name]').each(function (fieldIndex, field) {
        var $field = $(field);
        var name = $field.attr('data-name');
        obj[name] = $field.val();
      });

      _rows.push(obj);
    });
    var rawValues = encodeURIComponent(JSON.stringify(_rows));
    $valueHolder.val(rawValues);
  }

  function triggerRemoveOption($field) {
    var $optionsTable = $field.find(tableIdentifier);
    var tableRows = $field.find(tableRowsIdentifier).children();

    if (2 > tableRows.length) {
      $optionsTable.removeClass('has-options');
    }
  } // Remove Option


  var removeBtnIdentifier = tableIdentifier + ' .remove-option';
  fieldWrapper.on('click', removeBtnIdentifier, function () {
    var $item = $(this).closest(rowIdentifier);
    var $field = $item.closest(fieldIdentifier);
    triggerRemoveOption($field);
    $item.remove();
    triggerOptionsChange($field);
  }); // Clear All Options

  var clearOptionsBtnIdentifier = tableIdentifier + ' .clear-options';
  fieldWrapper.on('click', clearOptionsBtnIdentifier, function () {
    var $field = $(this).closest(fieldIdentifier);
    $field.find(tableRowsIdentifier).empty();
    triggerRemoveOption($field);
    triggerOptionsChange($field);
  }); // Add New Option

  var addOptionBtnIdentifier = tableIdentifier + ' .add-option';
  fieldWrapper.on('click', addOptionBtnIdentifier, function () {
    // Bail out if no tmpl found for the type.
    if (!jQuery('#tmpl-' + rowTemplateId).length) {
      return;
    }

    var $field = $(this).closest(fieldIdentifier);
    var template = wp.template(rowTemplateId);
    var rendered = template(rowDefaultOptions);
    var $table = $field.find(tableIdentifier);
    var $rows = $field.find(tableRowsIdentifier);
    $rows.append(rendered);
    triggerOptionsChange($field);
    fieldWrapper.trigger('new_option_added', [$field]);

    if (!$table.hasClass('has-options')) {
      $table.addClass('has-options');
    }
  }); // Trigger options change when the text fields get changed.

  var textFieldsIdentifier = tableRowsIdentifier + ' input[type="text"]';
  fieldWrapper.on('input', textFieldsIdentifier, function () {
    var $field = $(this).closest(fieldIdentifier);
    triggerOptionsChange($field);
  }); // Trigger options change when the select fields get changed.

  var selectFieldsIdentifier = tableRowsIdentifier + ' select';
  fieldWrapper.on('change', selectFieldsIdentifier, function () {
    var $field = $(this).closest(fieldIdentifier);
    triggerOptionsChange($field);
  }); // Trigger options change when value is added from modal.

  fieldWrapper.on('trigger_options_table', function (e, tableId, $field) {
    if (tableId === tableIdentifier) {
      triggerOptionsChange($field);
    }
  });
}
"use strict";

/**
 * The number ui options.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function ($) {
  var fieldWrapper = $('#chosen_field_wrapper');
  /**
   * Toggle disabled attribute of min-value field for number type.
   */

  function toggleNumberMinValueField($elm) {
    var $field = $elm.closest('.wcapf-form-field');
    var $textField = $field.find('.wcapf-form-sub-field-min_value input[type="text"]');

    if ($elm.is(':checked')) {
      $textField.attr('disabled', 'disabled');
    } else {
      $textField.removeAttr('disabled');
    }
  }

  fieldWrapper.find('.wcapf-form-sub-field-min_value_auto_detect input[type="checkbox"]').each(function () {
    var $this = $(this);
    toggleNumberMinValueField($this);
  });
  fieldWrapper.on('click', '.wcapf-form-sub-field-min_value_auto_detect input[type="checkbox"]', function () {
    var $this = $(this);
    toggleNumberMinValueField($this);
  });
  /**
   * Toggle disabled attribute of max-value field for number type.
   */

  function toggleNumberMaxValueField($elm) {
    var $field = $elm.closest('.wcapf-form-field');
    var $textField = $field.find('.wcapf-form-sub-field-max_value input[type="text"]');

    if ($elm.is(':checked')) {
      $textField.attr('disabled', 'disabled');
    } else {
      $textField.removeAttr('disabled');
    }
  }

  fieldWrapper.find('.wcapf-form-sub-field-max_value_auto_detect input[type="checkbox"]').each(function () {
    var $this = $(this);
    toggleNumberMaxValueField($this);
  });
  fieldWrapper.on('click', '.wcapf-form-sub-field-max_value_auto_detect input[type="checkbox"]', function () {
    var $this = $(this);
    toggleNumberMaxValueField($this);
  });
});
"use strict";

/**
 * The product status field.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function () {
  var tableIdentifier = '.product-status-options-table';
  var valueIdentifier = '.wcapf-form-sub-field-product_status_options input';
  var rowTemplateId = 'wcapf-product-status-option';
  initManualOptionsTable(tableIdentifier, valueIdentifier, rowTemplateId);
});
"use strict";

/**
 * Taxonomy's default field key.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function ($) {
  var fieldWrapper = $('#chosen_field_wrapper');
  fieldWrapper.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-taxonomy select' === handler) {
      var $fieldKey = $field.find('.wcapf-form-sub-field-field_key'); // Prepend dash to avoid conflicting with the registered taxonomies.

      if (value) {
        value = '_' + value;
      }

      $fieldKey.find('input[type="text"]').val(value);
    }
  });
});
"use strict";

/**
 * The toggle visibility scripts.
 *
 * NOTE: These scripts must be located at the very bottom of the combined scripts.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function ($) {
  var fieldWrapper = $('#chosen_field_wrapper');
  var dependantData = [{
    'handler': '.wcapf-form-sub-field-value_type select',
    'handlerType': 'select',
    'event': 'change',
    'dependant': [{
      'selector': '.input-type-text-fields',
      'value': ['text']
    }, {
      'selector': '.input-type-number-fields',
      'value': ['number']
    }, {
      'selector': '.input-type-date-fields',
      'value': ['date']
    }, {
      'selector': '.value-decimal-fields',
      'value': ['number']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-display_type select',
    'handlerType': 'select',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-query_type',
      'value': ['checkbox', 'multi-select']
    }, {
      'selector': '.wcapf-form-sub-field-all_items_label',
      'value': ['radio', 'select']
    }, {
      'selector': '.wcapf-form-sub-field-use_chosen',
      'value': ['select', 'multi-select']
    }, {
      'selector': '.hierarchical-fields',
      'value': ['checkbox', 'radio', 'select', 'multi-select']
    }, {
      'selector': '.wcapf-form-sub-field-use_category_images',
      'value': ['image']
    }, {
      'selector': '.wcapf-form-sub-field-enable_multiple_filter',
      'value': ['label', 'color', 'image']
    }, {
      'selector': '.column-group-custom_appearance',
      'value': ['color', 'image']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-use_chosen input',
    'handlerType': 'checkbox',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-chosen_no_results_message',
      'value': ['1']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-hierarchical input',
    'handlerType': 'checkbox',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-enable_hierarchy_accordion',
      'value': ['1']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-value_decimal input',
    'handlerType': 'checkbox',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-value_decimal_places',
      'value': ['1']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-get_options input',
    'handlerType': 'radio',
    'event': 'change',
    'dependant': [{
      'selector': '.column-group-meta_key_manual_options',
      'value': ['manual_entry']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-number_display_type select',
    'handlerType': 'select',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-number_range_slider_display_values_as',
      'value': ['range_slider']
    }, {
      'selector': '.wcapf-form-sub-field-number_range_query_type',
      'value': ['range_checkbox', 'range_multiselect']
    }, {
      'selector': '.wcapf-form-sub-field-number_range_select_all_items_label',
      'value': ['range_radio', 'range_select']
    }, {
      'selector': '.wcapf-form-sub-field-number_range_use_chosen',
      'value': ['range_select', 'range_multiselect']
    }, {
      'selector': '.wcapf-form-sub-field-number_range_enable_multiple_filter',
      'value': ['range_label']
    }, {
      'selector': '.wcapf-form-sub-field-number_range_show_count',
      'value': ['range_checkbox', 'range_radio', 'range_select', 'range_multiselect', 'range_label']
    }, {
      'selector': '.wcapf-form-sub-field-number_range_hide_empty',
      'value': ['range_checkbox', 'range_radio', 'range_select', 'range_multiselect', 'range_label']
    }, {
      'selector': '.number-decimal-fields',
      'value': ['range_slider', 'range_checkbox', 'range_radio', 'range_select', 'range_multiselect', 'range_label']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-number_range_use_chosen input',
    'handlerType': 'checkbox',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-number_range_chosen_no_results_message',
      'value': ['1']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-number_get_options input',
    'handlerType': 'radio',
    'event': 'change',
    'dependant': [{
      'selector': '.number-automatic-options',
      'value': ['automatically']
    }, {
      'selector': '.number-manual-options-table',
      'value': ['manual_entry']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-date_display_type select',
    'handlerType': 'select',
    'event': 'change',
    'dependant': [{
      'selector': '.date-to-ui-options',
      'value': ['input_date_range']
    }, {
      'selector': '.wcapf-form-sub-field-date_format',
      'value': ['input_date', 'input_date_range']
    }, {
      'selector': '.wcapf-form-sub-field-time_period_query_type',
      'value': ['time_period_checkbox', 'time_period_multiselect']
    }, {
      'selector': '.wcapf-form-sub-field-time_period_select_all_items_label',
      'value': ['time_period_radio', 'time_period_select']
    }, {
      'selector': '.wcapf-form-sub-field-time_period_use_chosen',
      'value': ['time_period_select', 'time_period_multiselect']
    }, {
      'selector': '.wcapf-form-sub-field-time_period_enable_multiple_filter',
      'value': ['time_period_label']
    }, {
      'selector': '.wcapf-form-sub-field-time_period_show_count',
      'value': ['time_period_checkbox', 'time_period_radio', 'time_period_select', 'time_period_multiselect', 'time_period_label']
    }, {
      'selector': '.wcapf-form-sub-field-time_period_hide_empty',
      'value': ['time_period_checkbox', 'time_period_radio', 'time_period_select', 'time_period_multiselect', 'time_period_label']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-time_period_use_chosen input',
    'handlerType': 'checkbox',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-time_period_chosen_no_results_message',
      'value': ['1']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-enable_soft_limit input',
    'handlerType': 'radio',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-soft_limit',
      'value': ['enable']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-taxonomy select',
    'handlerType': 'select',
    'event': 'change'
  }, {
    'handler': '.wcapf-form-sub-field-custom-taxonomy select',
    'handlerType': 'select',
    'event': 'change'
  }, {
    'handler': '.wcapf-form-sub-field-meta_key select',
    'handlerType': 'select',
    'event': 'change'
  }, {
    'handler': '.wcapf-form-sub-field-post_property select',
    'handlerType': 'select',
    'event': 'change'
  }, {
    'handler': '.wcapf-form-sub-field-limit_options select',
    'handlerType': 'select',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-parent_term',
      'value': ['child']
    }, {
      'selector': '.wcapf-form-sub-field-limit_values_by_id',
      'value': ['include', 'exclude']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-enable_accordion input',
    'handlerType': 'radio',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-accordion_default_state',
      'value': ['yes']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-enable_multiple_filter input',
    'handlerType': 'checkbox',
    'event': 'change'
  }, {
    'handler': '.wcapf-form-sub-field-use_category_images input',
    'handlerType': 'checkbox',
    'event': 'change'
  }, {
    'handler': '.wcapf-form-sub-field-number_range_enable_multiple_filter input',
    'handlerType': 'checkbox',
    'event': 'change'
  }, {
    'handler': '.wcapf-form-sub-field-time_period_enable_multiple_filter input',
    'handlerType': 'checkbox',
    'event': 'change'
  }];

  function _handleToggleRequest(data, currentSelector, value) {
    var $field = currentSelector.closest('.wcapf-form-field');
    var handler = data['handler'];
    var handlerType = data['handlerType'];
    var dependant = data['dependant'];
    var _value = value;

    if ('checkbox' === handlerType) {
      _value = currentSelector.is(':checked') ? '1' : '0';
    }

    if ('radio' === handlerType) {
      _value = $field.find(handler + ':checked').val();
    }

    $.each(dependant, function (id, d) {
      var $selector = $field.find(d['selector']);
      var validValues = d['value'];

      if (validValues.includes(_value)) {
        $selector.show();
      } else {
        $selector.hide();
      }
    });
    fieldWrapper.trigger('after_toggle_request', [handler, _value, $field]);
  }

  function handleToggleRequest(data, currentSelector, value) {
    if (null === currentSelector) {
      var handler = data['handler'];
      var $handler = $(handler);
      $.each($handler, function () {
        var _this = $(this);

        var _value = _this.val();

        _handleToggleRequest(data, _this, _value);
      });
    } else {
      _handleToggleRequest(data, currentSelector, value);
    }
  }

  function setupField() {
    var inital = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    $.each(dependantData, function (i, data) {
      var handler = data['handler'];
      var event = data['event'];
      handleToggleRequest(data, null, null);

      if (inital) {
        fieldWrapper.on(event, handler, function () {
          var _this = $(this);

          var _value = $(this).val();

          handleToggleRequest(data, _this, _value);
        });
      }
    });
  }

  setupField(true);
  fieldWrapper.on('field_added', function () {
    // Toggle the visibility of subfields.
    setupField();
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbS1hcHBlYXJhbmNlLWZpZWxkcy5qcyIsImRpc3BsYXktdHlwZS1maWVsZHMuanMiLCJmaWVsZC1tZXRhLWJveC5qcyIsImdlbmVyYXRlLXByb2R1Y3QtcHJpY2VzLmpzIiwibWFudWFsLW9wdGlvbnMtdGFibGUuanMiLCJudW1iZXItdWktb3B0aW9ucy5qcyIsInByb2R1Y3Qtc3RhdHVzLXRhYmxlLmpzIiwidGF4b25vbXktZGVmYXVsdC1maWVsZC1rZXkuanMiLCJ0b2dnbGVWaXNpYmlsaXR5LmpzIl0sIm5hbWVzIjpbImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwiZmllbGRXcmFwcGVyIiwib24iLCJlIiwiaGFuZGxlciIsInZhbHVlIiwiJGZpZWxkIiwiJHF1ZXJ5VHlwZSIsImZpbmQiLCJ2YWxpZERpc3BsYXlUeXBlcyIsImluY2x1ZGVzIiwiJG11bHRpcGxlRmlsdGVyIiwiaXMiLCJzaG93IiwiaGlkZSIsIiRkaXNwbGF5VHlwZSIsImRpc3BsYXlUeXBlIiwidmFsIiwiJG5vUmVzdWx0cyIsIiRhbGxJdGVtc0xhYmVsIiwidXNlQ2hvc2VuIiwiJHRoaXMiLCJfZmllbGRUeXBlIiwiZmllbGROYW1lIiwiYXR0ciIsImZpZWxkVHlwZSIsImxlbmd0aCIsInRlbXBsYXRlIiwid3AiLCJyZW5kZXJlZCIsImZpZWxkRGF0YVdyYXBwZXIiLCJmaWVsZE5hbWVXcmFwcGVyIiwiZmllbGRJbnNpZGUiLCJyZW1vdmVDbGFzcyIsImh0bWwiLCJ0cmlnZ2VyIiwiZ2VuZXJhdGVQcm9kdWN0UHJpY2VzIiwiJGZvcm0iLCJkYXRhIiwiJHByb2dyZXNzV3JhcHBlciIsIiRwcm9ncmVzc2JhciIsIiRwcm9ncmVzc0NvdW50IiwiJHByb2dyZXNzVG90YWwiLCIkc3VibWl0QnRuIiwiJHN1Y2Nlc3NNZXNzYWdlIiwiJGVycm9yTWVzc2FnZSIsIndjYXBmX3BhcmFtcyIsIndpbmRvdyIsImFqYXh1cmwiLCJhamF4IiwidXJsIiwidHlwZSIsImRhdGFUeXBlIiwic3VjY2VzcyIsInJlc3BvbnNlIiwibWVzc2FnZSIsIl9kYXRhIiwic3RhdHVzIiwicGFnZSIsImNvdW50IiwicGVyY2VudGFnZSIsInRvdGFsUHJvZHVjdHMiLCJjc3MiLCJoYXNDbGFzcyIsImFkZENsYXNzIiwic2V0VGltZW91dCIsInJlbW92ZUF0dHIiLCJmYWlsIiwiY29uc29sZSIsImxvZyIsInByZXZlbnREZWZhdWx0Iiwic2VyaWFsaXplT2JqZWN0IiwiaW5pdE1hbnVhbE9wdGlvbnNUYWJsZSIsInRhYmxlSWRlbnRpZmllciIsInZhbHVlSWRlbnRpZmllciIsInJvd1RlbXBsYXRlSWQiLCJyb3dEZWZhdWx0T3B0aW9ucyIsImZpZWxkSWRlbnRpZmllciIsInJvd3NJZGVudGlmaWVyIiwicm93SWRlbnRpZmllciIsImluaXRTb3J0YWJsZVRhYmxlIiwiJHNlbGVjdG9yIiwic29ydGFibGUiLCJvcGFjaXR5IiwicmV2ZXJ0IiwiY3Vyc29yIiwiYXhpcyIsImhhbmRsZSIsInBsYWNlaG9sZGVyIiwidXBkYXRlIiwidGFyZ2V0IiwiY2xvc2VzdCIsInRyaWdnZXJPcHRpb25zQ2hhbmdlIiwiZGlzYWJsZVNlbGVjdGlvbiIsInRhYmxlUm93c0lkZW50aWZpZXIiLCIkdmFsdWVIb2xkZXIiLCIkcm93cyIsIl9yb3dzIiwiZWFjaCIsImkiLCJfaXRlbSIsIiRpdGVtIiwib2JqIiwiZmllbGRJbmRleCIsImZpZWxkIiwibmFtZSIsInB1c2giLCJyYXdWYWx1ZXMiLCJlbmNvZGVVUklDb21wb25lbnQiLCJKU09OIiwic3RyaW5naWZ5IiwidHJpZ2dlclJlbW92ZU9wdGlvbiIsIiRvcHRpb25zVGFibGUiLCJ0YWJsZVJvd3MiLCJjaGlsZHJlbiIsInJlbW92ZUJ0bklkZW50aWZpZXIiLCJyZW1vdmUiLCJjbGVhck9wdGlvbnNCdG5JZGVudGlmaWVyIiwiZW1wdHkiLCJhZGRPcHRpb25CdG5JZGVudGlmaWVyIiwiJHRhYmxlIiwiYXBwZW5kIiwidGV4dEZpZWxkc0lkZW50aWZpZXIiLCJzZWxlY3RGaWVsZHNJZGVudGlmaWVyIiwidGFibGVJZCIsInRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQiLCIkZWxtIiwiJHRleHRGaWVsZCIsInRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQiLCIkZmllbGRLZXkiLCJkZXBlbmRhbnREYXRhIiwiX2hhbmRsZVRvZ2dsZVJlcXVlc3QiLCJjdXJyZW50U2VsZWN0b3IiLCJoYW5kbGVyVHlwZSIsImRlcGVuZGFudCIsIl92YWx1ZSIsImlkIiwiZCIsInZhbGlkVmFsdWVzIiwiaGFuZGxlVG9nZ2xlUmVxdWVzdCIsIiRoYW5kbGVyIiwiX3RoaXMiLCJzZXR1cEZpZWxkIiwiaW5pdGFsIiwiZXZlbnQiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQSxNQUFNLENBQUVDLFFBQUYsQ0FBTixDQUFtQkMsS0FBbkIsQ0FBMEIsVUFBVUMsQ0FBVixFQUFjO0FBRXZDLE1BQU1DLFlBQVksR0FBR0QsQ0FBQyxDQUFFLHVCQUFGLENBQXRCO0FBRUFDLEVBQUFBLFlBQVksQ0FBQ0MsRUFBYixDQUFpQixzQkFBakIsRUFBeUMsVUFBVUMsQ0FBVixFQUFhQyxPQUFiLEVBQXNCQyxLQUF0QixFQUE2QkMsTUFBN0IsRUFBc0M7QUFDOUUsUUFBSyxnREFBZ0RGLE9BQXJELEVBQStEO0FBQzlELFVBQU1HLFVBQVUsR0FBVUQsTUFBTSxDQUFDRSxJQUFQLENBQWEsa0NBQWIsQ0FBMUI7QUFDQSxVQUFNQyxpQkFBaUIsR0FBRyxDQUFFLE9BQUYsRUFBVyxPQUFYLEVBQW9CLE9BQXBCLENBQTFCOztBQUVBLFVBQUtBLGlCQUFpQixDQUFDQyxRQUFsQixDQUE0QkwsS0FBNUIsQ0FBTCxFQUEyQztBQUMxQyxZQUFNTSxlQUFlLEdBQUdMLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLG9EQUFiLENBQXhCOztBQUVBLFlBQUtHLGVBQWUsQ0FBQ0MsRUFBaEIsQ0FBb0IsVUFBcEIsQ0FBTCxFQUF3QztBQUN2Q0wsVUFBQUEsVUFBVSxDQUFD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LENBQUUsSUFBRixDQUFELENBQVVpQixHQUFWLEVBQWY7O0FBQ0EwSCxVQUFBQSxtQkFBbUIsQ0FBRXJHLElBQUYsRUFBUXVHLEtBQVIsRUFBZU4sTUFBZixDQUFuQjtBQUNBLFNBSkQ7QUFLQTtBQUNELEtBYkQ7QUFjQTs7QUFFRE8sRUFBQUEsVUFBVSxDQUFFLElBQUYsQ0FBVjtBQUVBN0ksRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLGFBQWpCLEVBQWdDLFlBQVc7QUFDMUM7QUFDQTRJLElBQUFBLFVBQVU7QUFDVixHQUhEO0FBS0EsQ0FsWEQiLCJmaWxlIjoid2MtYWpheC1wcm9kdWN0LWZpbHRlci1hZG1pbi1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBEaXNwbGF5IHR5cGUgZmllbGRzLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJHF1ZXJ5VHlwZSAgICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1xdWVyeV90eXBlJyApO1xuXHRcdFx0Y29uc3QgdmFsaWREaXNwbGF5VHlwZXMgPSBbICdsYWJlbCcsICdjb2xvcicsICdpbWFnZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZERpc3BsYXlUeXBlcy5pbmNsdWRlcyggdmFsdWUgKSApIHtcblx0XHRcdFx0Y29uc3QgJG11bHRpcGxlRmlsdGVyID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcgKTtcblxuXHRcdFx0XHRpZiAoICRtdWx0aXBsZUZpbHRlci5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkcXVlcnlUeXBlICAgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXF1ZXJ5X3R5cGUnICk7XG5cdFx0XHRjb25zdCAkZGlzcGxheVR5cGUgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnICk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VHlwZSAgICAgICA9ICRkaXNwbGF5VHlwZS52YWwoKTtcblx0XHRcdGNvbnN0IHZhbGlkRGlzcGxheVR5cGVzID0gWyAnbGFiZWwnLCAnY29sb3InLCAnaW1hZ2UnIF07XG5cblx0XHRcdGlmICggdmFsaWREaXNwbGF5VHlwZXMuaW5jbHVkZXMoIGRpc3BsYXlUeXBlICkgKSB7XG5cdFx0XHRcdGlmICggJzEnID09PSB2YWx1ZSApIHtcblx0XHRcdFx0XHQkcXVlcnlUeXBlLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkcXVlcnlUeXBlLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIERpc3BsYXkgdHlwZSBmaWVsZHMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0Ly8gT3ZlcnJpZGUgbm8tcmVzdWx0cy1tZXNzYWdlLCBhbGwtaXRlbXMtbGFiZWwgZmllbGQncyB0b2dnbGUgdmlzaWJpbGl0eSB3aGVuIHRleHQgZGlzcGxheSB0eXBlIGlzIGNoYW5nZWQuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJG5vUmVzdWx0cyAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0XHRjb25zdCB1c2VDaG9zZW4gICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnICkuaXMoICc6Y2hlY2tlZCcgKTtcblxuXHRcdFx0aWYgKCB1c2VDaG9zZW4gJiYgKCAnc2VsZWN0JyA9PT0gdmFsdWUgfHwgJ211bHRpLXNlbGVjdCcgPT09IHZhbHVlICkgKSB7XG5cdFx0XHRcdCRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggKCAncmFkaW8nID09PSB2YWx1ZSB8fCAnc2VsZWN0JyA9PT0gdmFsdWUgKSB8fCAoICdtdWx0aS1zZWxlY3QnID09PSB2YWx1ZSAmJiB1c2VDaG9zZW4gKSApIHtcblx0XHRcdFx0JGFsbEl0ZW1zTGFiZWwuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGFsbEl0ZW1zTGFiZWwuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdC8vIE92ZXJyaWRlIG5vLXJlc3VsdHMtbWVzc2FnZSwgYWxsLWl0ZW1zLWxhYmVsIGZpZWxkJ3MgdG9nZ2xlIHZpc2liaWxpdHkgd2hlbiB0ZXh0IHVzZSBjaG9zZW4gaXMgY2hhbmdlZC5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0XHRjb25zdCAkYWxsSXRlbXNMYWJlbCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlUeXBlICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCAnMScgPT09IHZhbHVlICYmICggJ3NlbGVjdCcgPT09IGRpc3BsYXlUeXBlIHx8ICdtdWx0aS1zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApICkge1xuXHRcdFx0XHQkbm9SZXN1bHRzLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoXG5cdFx0XHRcdCggJzEnID09PSB2YWx1ZSAmJiAnbXVsdGktc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKVxuXHRcdFx0XHR8fCAoICdyYWRpbycgPT09IGRpc3BsYXlUeXBlIHx8ICdzZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0XHQpIHtcblx0XHRcdFx0JGFsbEl0ZW1zTGFiZWwuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGFsbEl0ZW1zTGFiZWwuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIEZpZWxkIG1ldGEgYm94LlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdCQoICcjYXZhaWxhYmxlX2ZpZWxkcycgKS5vbiggJ2NoYW5nZScsICdbbmFtZT1cIl9hY3RpdmVfZmllbGRcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IF9maWVsZFR5cGUgPSAkdGhpcy52YWwoKTtcblx0XHRjb25zdCBmaWVsZE5hbWUgID0gJHRoaXMuYXR0ciggJ2RhdGEtZmllbGQtbmFtZScgKTtcblxuXHRcdGlmICggISBfZmllbGRUeXBlICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1mb3JtLWZpZWxkLScgKyBfZmllbGRUeXBlO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgdGVtcGxhdGUgICAgICAgICA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRjb25zdCByZW5kZXJlZCAgICAgICAgID0gdGVtcGxhdGUoKTtcblx0XHRjb25zdCBmaWVsZERhdGFXcmFwcGVyID0gZmllbGRXcmFwcGVyLmZpbmQoICcjZmllbGRfZGF0YScgKTtcblx0XHRjb25zdCBmaWVsZE5hbWVXcmFwcGVyID0gZmllbGRXcmFwcGVyLmZpbmQoICcucG9zdGJveC1oZWFkZXIgaDInICk7XG5cdFx0Y29uc3QgZmllbGRJbnNpZGUgICAgICA9IGZpZWxkV3JhcHBlci5maW5kKCAnLmluc2lkZScgKTtcblxuXHRcdGZpZWxkV3JhcHBlci5yZW1vdmVDbGFzcyggJ2hpZGRlbicgKTtcblxuXHRcdGZpZWxkRGF0YVdyYXBwZXIuYXR0ciggJ2RhdGEtZmllbGQtdHlwZScsIF9maWVsZFR5cGUgKTtcblx0XHRmaWVsZE5hbWVXcmFwcGVyLmh0bWwoIGZpZWxkTmFtZSApO1xuXHRcdGZpZWxkSW5zaWRlLmh0bWwoIHJlbmRlcmVkICk7XG5cblx0XHRmaWVsZFdyYXBwZXIudHJpZ2dlciggJ2ZpZWxkX2FkZGVkJyApO1xuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogRmllbGQgbWV0YSBib3guXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGZ1bmN0aW9uIGdlbmVyYXRlUHJvZHVjdFByaWNlcyggJGZvcm0sIGRhdGEgKSB7XG5cdFx0Y29uc3QgJHByb2dyZXNzV3JhcHBlciA9ICRmb3JtLmZpbmQoICcucHJvZ3Jlc3Mtc3RhdCcgKSxcblx0XHRcdCAgJHByb2dyZXNzYmFyICAgICA9ICRwcm9ncmVzc1dyYXBwZXIuZmluZCggJy5wcm9ncmVzc2JhciA+IGRpdicgKSxcblx0XHRcdCAgJHByb2dyZXNzQ291bnQgICA9ICRwcm9ncmVzc1dyYXBwZXIuZmluZCggJy5jb3VudCcgKSxcblx0XHRcdCAgJHByb2dyZXNzVG90YWwgICA9ICRwcm9ncmVzc1dyYXBwZXIuZmluZCggJy50b3RhbCcgKSxcblx0XHRcdCAgJHN1Ym1pdEJ0biAgICAgICA9ICRmb3JtLmZpbmQoICcuYnV0dG9uJyApLFxuXHRcdFx0ICAkc3VjY2Vzc01lc3NhZ2UgID0gJGZvcm0uZmluZCggJy5zdWNjZXNzLW1lc3NhZ2UnICksXG5cdFx0XHQgICRlcnJvck1lc3NhZ2UgICAgPSAkZm9ybS5maW5kKCAnLmVycm9yLW1lc3NhZ2UnICk7XG5cblx0XHRjb25zdCB3Y2FwZl9wYXJhbXMgPSB3aW5kb3dbICd3Y2FwZl9hZG1pbl9wYXJhbXMnIF07XG5cdFx0Y29uc3QgYWpheHVybCAgICAgID0gd2NhcGZfcGFyYW1zWyAnYWpheHVybCcgXTtcblxuXHRcdCQuYWpheCgge1xuXHRcdFx0dXJsOiBhamF4dXJsLFxuXHRcdFx0dHlwZTogJ1BPU1QnLFxuXHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHRcdGNvbnN0IG1lc3NhZ2UgICAgICAgPSByZXNwb25zZS5tZXNzYWdlO1xuXHRcdFx0XHRjb25zdCBfZGF0YSAgICAgICAgID0gcmVzcG9uc2UuZGF0YTtcblx0XHRcdFx0Y29uc3Qgc3RhdHVzICAgICAgICA9IF9kYXRhWyAnc3RhdHVzJyBdO1xuXHRcdFx0XHRjb25zdCBwYWdlICAgICAgICAgID0gX2RhdGFbICdwYWdlJyBdO1xuXHRcdFx0XHRjb25zdCBjb3VudCAgICAgICAgID0gX2RhdGFbICdjb3VudCcgXTtcblx0XHRcdFx0Y29uc3QgcGVyY2VudGFnZSAgICA9IF9kYXRhWyAncGVyY2VudGFnZScgXTtcblx0XHRcdFx0Y29uc3QgdG90YWxQcm9kdWN0cyA9IF9kYXRhWyAndG90YWxfcHJvZHVjdHMnIF07XG5cblx0XHRcdFx0aWYgKCByZXNwb25zZS5zdWNjZXNzID09PSAndHJ1ZScgKSB7XG5cdFx0XHRcdFx0JHByb2dyZXNzQ291bnQuaHRtbCggY291bnQgKTtcblx0XHRcdFx0XHQkcHJvZ3Jlc3NiYXIuY3NzKCAnd2lkdGgnLCBwZXJjZW50YWdlICsgJyUnICk7XG5cblx0XHRcdFx0XHRpZiAoICEgJHByb2dyZXNzV3JhcHBlci5oYXNDbGFzcyggJ2FjdGl2ZScgKSApIHtcblx0XHRcdFx0XHRcdCRwcm9ncmVzc1dyYXBwZXIuYWRkQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCBzdGF0dXMgPT09ICdpbmNvbXBsZXRlJyApIHtcblx0XHRcdFx0XHRcdCRwcm9ncmVzc1RvdGFsLmh0bWwoIHRvdGFsUHJvZHVjdHMgKTtcblxuXHRcdFx0XHRcdFx0ZGF0YVsgJ3BhZ2UnIF0gID0gcGFnZTtcblx0XHRcdFx0XHRcdGRhdGFbICdjb3VudCcgXSA9IGNvdW50O1xuXG5cdFx0XHRcdFx0XHRnZW5lcmF0ZVByb2R1Y3RQcmljZXMoICRmb3JtLCBkYXRhICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHQkcHJvZ3Jlc3NXcmFwcGVyLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdFx0XHRcdFx0XHQkcHJvZ3Jlc3NiYXIuY3NzKCAnd2lkdGgnLCAnMCcgKTtcblx0XHRcdFx0XHRcdFx0JHN1Ym1pdEJ0bi5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0XHRcdFx0XHRcdCRzdWNjZXNzTWVzc2FnZS5odG1sKCBtZXNzYWdlICk7XG5cdFx0XHRcdFx0XHR9LCAxNTAwICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRzdWJtaXRCdG4ucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdFx0XHRcdCRlcnJvck1lc3NhZ2UuaHRtbCggbWVzc2FnZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSApLmZhaWwoIGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdCRwcm9ncmVzc1dyYXBwZXIucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0XHQkcHJvZ3Jlc3NiYXIuY3NzKCAnd2lkdGgnLCAnMCcgKTtcblx0XHRcdCRzdWJtaXRCdG4ucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXG5cdFx0XHRpZiAoIHdpbmRvdy5jb25zb2xlICYmIHdpbmRvdy5jb25zb2xlLmxvZyApIHtcblx0XHRcdFx0Y29uc29sZS5sb2coIHJlc3BvbnNlICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0JCggJy53cmFwJyApLm9uKCAnc3VibWl0JywgJyNnZW5lcmF0ZS1wcm9kdWN0LXByaWNlcycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRmb3JtICAgICAgICAgICAgPSAkKCB0aGlzICksXG5cdFx0XHQgICRwcm9ncmVzc1dyYXBwZXIgPSAkZm9ybS5maW5kKCAnLnByb2dyZXNzLXN0YXQnICksXG5cdFx0XHQgICRwcm9ncmVzc2JhciAgICAgPSAkcHJvZ3Jlc3NXcmFwcGVyLmZpbmQoICcucHJvZ3Jlc3NiYXIgPiBkaXYnICksXG5cdFx0XHQgICRzdWJtaXRCdG4gICAgICAgPSAkZm9ybS5maW5kKCAnLmJ1dHRvbicgKSxcblx0XHRcdCAgJHN1Y2Nlc3NNZXNzYWdlICA9ICRmb3JtLmZpbmQoICcuc3VjY2Vzcy1tZXNzYWdlJyApLFxuXHRcdFx0ICAkZXJyb3JNZXNzYWdlICAgID0gJGZvcm0uZmluZCggJy5lcnJvci1tZXNzYWdlJyApLFxuXHRcdFx0ICBkYXRhICAgICAgICAgICAgID0gJGZvcm0uc2VyaWFsaXplT2JqZWN0KCk7XG5cblx0XHQkcHJvZ3Jlc3NiYXIuY3NzKCAnd2lkdGgnLCAnMCcgKTtcblx0XHQkc3VjY2Vzc01lc3NhZ2UuaHRtbCggJycgKTtcblx0XHQkZXJyb3JNZXNzYWdlLmh0bWwoICcnICk7XG5cdFx0JHN1Ym1pdEJ0bi5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cblx0XHRnZW5lcmF0ZVByb2R1Y3RQcmljZXMoICRmb3JtLCBkYXRhICk7XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBNYW51YWwgT3B0aW9ucycgdGFibGUgZnVuY3Rpb24uXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG4vKipcbiAqIEBwYXJhbSB0YWJsZUlkZW50aWZpZXJcbiAqIEBwYXJhbSB2YWx1ZUlkZW50aWZpZXJcbiAqIEBwYXJhbSByb3dUZW1wbGF0ZUlkXG4gKiBAcGFyYW0gcm93RGVmYXVsdE9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gaW5pdE1hbnVhbE9wdGlvbnNUYWJsZSggdGFibGVJZGVudGlmaWVyLCB2YWx1ZUlkZW50aWZpZXIsIHJvd1RlbXBsYXRlSWQsIHJvd0RlZmF1bHRPcHRpb25zID0ge30gKSB7XG5cdGNvbnN0ICQgPSBqUXVlcnk7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblxuXHRjb25zdCBmaWVsZElkZW50aWZpZXIgPSAnLndjYXBmLWZvcm0tZmllbGQnO1xuXHRjb25zdCByb3dzSWRlbnRpZmllciAgPSAnLmZpZWxkLXRhYmxlLWJvZHktcm93cyc7XG5cdGNvbnN0IHJvd0lkZW50aWZpZXIgICA9ICcucm93LWl0ZW0nO1xuXG5cdGZ1bmN0aW9uIGluaXRTb3J0YWJsZVRhYmxlKCAkc2VsZWN0b3IgKSB7XG5cdFx0JHNlbGVjdG9yLnNvcnRhYmxlKCB7XG5cdFx0XHRvcGFjaXR5OiAwLjgsXG5cdFx0XHRyZXZlcnQ6IGZhbHNlLFxuXHRcdFx0Y3Vyc29yOiAnbW92ZScsXG5cdFx0XHRheGlzOiAneScsXG5cdFx0XHRoYW5kbGU6ICcubW92ZS1vcHRpb25zLWhhbmRsZXInLFxuXHRcdFx0cGxhY2Vob2xkZXI6ICd3aWRnZXQtcGxhY2Vob2xkZXInLFxuXHRcdFx0dXBkYXRlOiBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkID0gJCggZS50YXJnZXQgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRcdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHRcdFx0fVxuXHRcdH0gKS5kaXNhYmxlU2VsZWN0aW9uKCk7XG5cdH1cblxuXHRjb25zdCB0YWJsZVJvd3NJZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAnICsgcm93c0lkZW50aWZpZXI7XG5cblx0Ly8gSW5pdCB0aGUgc29ydGFibGUgdGFibGUgYWZ0ZXIgcGFnZSBsb2Fkcy5cblx0aW5pdFNvcnRhYmxlVGFibGUoIGZpZWxkV3JhcHBlci5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkgKTtcblxuXHQvLyBJbml0IHRoZSBzb3J0YWJsZSB0YWJsZSBhZnRlciB0aGUgZmllbGQgaXMgYWRkZWQuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0aW5pdFNvcnRhYmxlVGFibGUoICQoIGZpZWxkV3JhcHBlci5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkgKSApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gdHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApIHtcblx0XHRjb25zdCAkdmFsdWVIb2xkZXIgPSAkZmllbGQuZmluZCggdmFsdWVJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgICAgID0gJGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKTtcblx0XHRjb25zdCBfcm93cyAgICAgICAgPSBbXTtcblxuXHRcdCRyb3dzLmZpbmQoICcucm93LWl0ZW0nICkuZWFjaCggZnVuY3Rpb24oIGksIF9pdGVtICkge1xuXHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCBfaXRlbSApO1xuXHRcdFx0Y29uc3Qgb2JqICAgPSB7fTtcblxuXHRcdFx0JGl0ZW0uZmluZCggJ1tkYXRhLW5hbWVdJyApLmVhY2goIGZ1bmN0aW9uKCBmaWVsZEluZGV4LCBmaWVsZCApIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkID0gJCggZmllbGQgKTtcblx0XHRcdFx0Y29uc3QgbmFtZSAgID0gJGZpZWxkLmF0dHIoICdkYXRhLW5hbWUnICk7XG5cblx0XHRcdFx0b2JqWyBuYW1lIF0gPSAkZmllbGQudmFsKCk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdF9yb3dzLnB1c2goIG9iaiApO1xuXHRcdH0gKTtcblxuXHRcdGNvbnN0IHJhd1ZhbHVlcyA9IGVuY29kZVVSSUNvbXBvbmVudCggSlNPTi5zdHJpbmdpZnkoIF9yb3dzICkgKTtcblx0XHQkdmFsdWVIb2xkZXIudmFsKCByYXdWYWx1ZXMgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApIHtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoIHRhYmxlSWRlbnRpZmllciApO1xuXHRcdGNvbnN0IHRhYmxlUm93cyAgICAgPSAkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApLmNoaWxkcmVuKCk7XG5cblx0XHRpZiAoIDIgPiB0YWJsZVJvd3MubGVuZ3RoICkge1xuXHRcdFx0JG9wdGlvbnNUYWJsZS5yZW1vdmVDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJlbW92ZSBPcHRpb25cblx0Y29uc3QgcmVtb3ZlQnRuSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgLnJlbW92ZS1vcHRpb24nO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2NsaWNrJywgcmVtb3ZlQnRuSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGl0ZW0gID0gJCggdGhpcyApLmNsb3Nlc3QoIHJvd0lkZW50aWZpZXIgKTtcblx0XHRjb25zdCAkZmllbGQgPSAkaXRlbS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApO1xuXG5cdFx0JGl0ZW0ucmVtb3ZlKCk7XG5cblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBDbGVhciBBbGwgT3B0aW9uc1xuXHRjb25zdCBjbGVhck9wdGlvbnNCdG5JZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAuY2xlYXItb3B0aW9ucyc7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnY2xpY2snLCBjbGVhck9wdGlvbnNCdG5JZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHQkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApLmVtcHR5KCk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKTtcblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBBZGQgTmV3IE9wdGlvblxuXHRjb25zdCBhZGRPcHRpb25CdG5JZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAuYWRkLW9wdGlvbic7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnY2xpY2snLCBhZGRPcHRpb25CdG5JZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHQvLyBCYWlsIG91dCBpZiBubyB0bXBsIGZvdW5kIGZvciB0aGUgdHlwZS5cblx0XHRpZiAoICEgalF1ZXJ5KCAnI3RtcGwtJyArIHJvd1RlbXBsYXRlSWQgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggcm93VGVtcGxhdGVJZCApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHJvd0RlZmF1bHRPcHRpb25zICk7XG5cdFx0Y29uc3QgJHRhYmxlICAgPSAkZmllbGQuZmluZCggdGFibGVJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgPSAkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApO1xuXG5cdFx0JHJvd3MuYXBwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXG5cdFx0ZmllbGRXcmFwcGVyLnRyaWdnZXIoICduZXdfb3B0aW9uX2FkZGVkJywgWyAkZmllbGQgXSApO1xuXG5cdFx0aWYgKCAhICR0YWJsZS5oYXNDbGFzcyggJ2hhcy1vcHRpb25zJyApICkge1xuXHRcdFx0JHRhYmxlLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gVHJpZ2dlciBvcHRpb25zIGNoYW5nZSB3aGVuIHRoZSB0ZXh0IGZpZWxkcyBnZXQgY2hhbmdlZC5cblx0Y29uc3QgdGV4dEZpZWxkc0lkZW50aWZpZXIgPSB0YWJsZVJvd3NJZGVudGlmaWVyICsgJyBpbnB1dFt0eXBlPVwidGV4dFwiXSc7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnaW5wdXQnLCB0ZXh0RmllbGRzSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gVHJpZ2dlciBvcHRpb25zIGNoYW5nZSB3aGVuIHRoZSBzZWxlY3QgZmllbGRzIGdldCBjaGFuZ2VkLlxuXHRsZXQgc2VsZWN0RmllbGRzSWRlbnRpZmllciA9IHRhYmxlUm93c0lkZW50aWZpZXIgKyAnIHNlbGVjdCc7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnY2hhbmdlJywgc2VsZWN0RmllbGRzSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gVHJpZ2dlciBvcHRpb25zIGNoYW5nZSB3aGVuIHZhbHVlIGlzIGFkZGVkIGZyb20gbW9kYWwuXG5cdGZpZWxkV3JhcHBlci5vbiggJ3RyaWdnZXJfb3B0aW9uc190YWJsZScsIGZ1bmN0aW9uKCBlLCB0YWJsZUlkLCAkZmllbGQgKSB7XG5cdFx0aWYgKCB0YWJsZUlkID09PSB0YWJsZUlkZW50aWZpZXIgKSB7XG5cdFx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdFx0fVxuXHR9ICk7XG5cbn1cbiIsIi8qKlxuICogVGhlIG51bWJlciB1aSBvcHRpb25zLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdC8qKlxuXHQgKiBUb2dnbGUgZGlzYWJsZWQgYXR0cmlidXRlIG9mIG1pbi12YWx1ZSBmaWVsZCBmb3IgbnVtYmVyIHR5cGUuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkKCAkZWxtICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkdGV4dEZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXG5cdFx0aWYgKCAkZWxtLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHQkdGV4dEZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHRleHRGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0ZmllbGRXcmFwcGVyLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICR0aGlzICk7XG5cdH0gKTtcblxuXHRmaWVsZFdyYXBwZXIub24oXG5cdFx0J2NsaWNrJyxcblx0XHQnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fVxuXHQpO1xuXG5cdC8qKlxuXHQgKiBUb2dnbGUgZGlzYWJsZWQgYXR0cmlidXRlIG9mIG1heC12YWx1ZSBmaWVsZCBmb3IgbnVtYmVyIHR5cGUuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkZWxtICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkdGV4dEZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXG5cdFx0aWYgKCAkZWxtLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHQkdGV4dEZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHRleHRGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0ZmllbGRXcmFwcGVyLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICR0aGlzICk7XG5cdH0gKTtcblxuXHRmaWVsZFdyYXBwZXIub24oXG5cdFx0J2NsaWNrJyxcblx0XHQnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fVxuXHQpO1xuXG59ICk7XG4iLCIvKipcbiAqIFRoZSBwcm9kdWN0IHN0YXR1cyBmaWVsZC5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cblx0Y29uc3QgdGFibGVJZGVudGlmaWVyID0gJy5wcm9kdWN0LXN0YXR1cy1vcHRpb25zLXRhYmxlJztcblx0Y29uc3QgdmFsdWVJZGVudGlmaWVyID0gJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1wcm9kdWN0X3N0YXR1c19vcHRpb25zIGlucHV0Jztcblx0Y29uc3Qgcm93VGVtcGxhdGVJZCAgID0gJ3djYXBmLXByb2R1Y3Qtc3RhdHVzLW9wdGlvbic7XG5cblx0aW5pdE1hbnVhbE9wdGlvbnNUYWJsZSggdGFibGVJZGVudGlmaWVyLCB2YWx1ZUlkZW50aWZpZXIsIHJvd1RlbXBsYXRlSWQgKTtcblxufSApO1xuIiwiLyoqXG4gKiBUYXhvbm9teSdzIGRlZmF1bHQgZmllbGQga2V5LlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRheG9ub215IHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkZmllbGRLZXkgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1maWVsZF9rZXknICk7XG5cblx0XHRcdC8vIFByZXBlbmQgZGFzaCB0byBhdm9pZCBjb25mbGljdGluZyB3aXRoIHRoZSByZWdpc3RlcmVkIHRheG9ub21pZXMuXG5cdFx0XHRpZiAoIHZhbHVlICkge1xuXHRcdFx0XHR2YWx1ZSA9ICdfJyArIHZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHQkZmllbGRLZXkuZmluZCggJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdJyApLnZhbCggdmFsdWUgKTtcblx0XHR9XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBUaGUgdG9nZ2xlIHZpc2liaWxpdHkgc2NyaXB0cy5cbiAqXG4gKiBOT1RFOiBUaGVzZSBzY3JpcHRzIG11c3QgYmUgbG9jYXRlZCBhdCB0aGUgdmVyeSBib3R0b20gb2YgdGhlIGNvbWJpbmVkIHNjcmlwdHMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0Y29uc3QgZGVwZW5kYW50RGF0YSA9IFtcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtdGV4dC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RleHQnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtbnVtYmVyLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbnVtYmVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5pbnB1dC10eXBlLWRhdGUtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdkYXRlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy52YWx1ZS1kZWNpbWFsLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbnVtYmVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjaGVja2JveCcsICdtdWx0aS1zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFkaW8nLCAnc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdzZWxlY3QnLCAnbXVsdGktc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5oaWVyYXJjaGljYWwtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjaGVja2JveCcsICdyYWRpbycsICdzZWxlY3QnLCAnbXVsdGktc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2F0ZWdvcnlfaW1hZ2VzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbWFnZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlcicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbGFiZWwnLCAnY29sb3InLCAnaW1hZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmNvbHVtbi1ncm91cC1jdXN0b21fYXBwZWFyYW5jZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY29sb3InLCAnaW1hZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtaGllcmFyY2hpY2FsIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9oaWVyYXJjaHlfYWNjb3JkaW9uJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV9kZWNpbWFsIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXZhbHVlX2RlY2ltYWxfcGxhY2VzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1nZXRfb3B0aW9ucyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5jb2x1bW4tZ3JvdXAtbWV0YV9rZXlfbWFudWFsX29wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ21hbnVhbF9lbnRyeScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2Rpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zbGlkZXJfZGlzcGxheV92YWx1ZXNfYXMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NsaWRlcicgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3F1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2VsZWN0X2FsbF9pdGVtc19sYWJlbCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfdXNlX2Nob3NlbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfZW5hYmxlX211bHRpcGxlX2ZpbHRlcicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zaG93X2NvdW50Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnLCAncmFuZ2VfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9oaWRlX2VtcHR5Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnLCAncmFuZ2VfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1kZWNpbWFsLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJywgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcsICdyYW5nZV9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3VzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9nZXRfb3B0aW9ucyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItYXV0b21hdGljLW9wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2F1dG9tYXRpY2FsbHknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbWFudWFsX2VudHJ5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kYXRlX2Rpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmRhdGUtdG8tdWktb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5wdXRfZGF0ZV9yYW5nZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGF0ZV9mb3JtYXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2lucHV0X2RhdGUnLCAnaW5wdXRfZGF0ZV9yYW5nZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfcXVlcnlfdHlwZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfY2hlY2tib3gnLCAndGltZV9wZXJpb2RfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3NlbGVjdF9hbGxfaXRlbXNfbGFiZWwnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX3JhZGlvJywgJ3RpbWVfcGVyaW9kX3NlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfdXNlX2Nob3NlbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2Rfc2VsZWN0JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9lbmFibGVfbXVsdGlwbGVfZmlsdGVyJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2Rfc2hvd19jb3VudCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfY2hlY2tib3gnLCAndGltZV9wZXJpb2RfcmFkaW8nLCAndGltZV9wZXJpb2Rfc2VsZWN0JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JywgJ3RpbWVfcGVyaW9kX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9oaWRlX2VtcHR5Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9jaGVja2JveCcsICd0aW1lX3BlcmlvZF9yYWRpbycsICd0aW1lX3BlcmlvZF9zZWxlY3QnLCAndGltZV9wZXJpb2RfbXVsdGlzZWxlY3QnLCAndGltZV9wZXJpb2RfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3VzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX3NvZnRfbGltaXQgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtc29mdF9saW1pdCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnZW5hYmxlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10YXhvbm9teSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jdXN0b20tdGF4b25vbXkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWV0YV9rZXkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcG9zdF9wcm9wZXJ0eSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1saW1pdF9vcHRpb25zIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcGFyZW50X3Rlcm0nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NoaWxkJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1saW1pdF92YWx1ZXNfYnlfaWQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2luY2x1ZGUnLCAnZXhjbHVkZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX2FjY29yZGlvbiBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hY2NvcmRpb25fZGVmYXVsdF9zdGF0ZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAneWVzJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfbXVsdGlwbGVfZmlsdGVyIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2F0ZWdvcnlfaW1hZ2VzIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XTtcblxuXHRmdW5jdGlvbiBfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgICA9IGN1cnJlbnRTZWxlY3Rvci5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgaGFuZGxlciAgICAgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRjb25zdCBoYW5kbGVyVHlwZSA9IGRhdGFbICdoYW5kbGVyVHlwZScgXTtcblx0XHRjb25zdCBkZXBlbmRhbnQgICA9IGRhdGFbICdkZXBlbmRhbnQnIF07XG5cblx0XHRsZXQgX3ZhbHVlID0gdmFsdWU7XG5cblx0XHRpZiAoICdjaGVja2JveCcgPT09IGhhbmRsZXJUeXBlICkge1xuXHRcdFx0X3ZhbHVlID0gY3VycmVudFNlbGVjdG9yLmlzKCAnOmNoZWNrZWQnICkgPyAnMScgOiAnMCc7XG5cdFx0fVxuXG5cdFx0aWYgKCAncmFkaW8nID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9ICRmaWVsZC5maW5kKCBoYW5kbGVyICsgJzpjaGVja2VkJyApLnZhbCgpO1xuXHRcdH1cblxuXHRcdCQuZWFjaCggZGVwZW5kYW50LCBmdW5jdGlvbiggaWQsIGQgKSB7XG5cdFx0XHRjb25zdCAkc2VsZWN0b3IgICA9ICRmaWVsZC5maW5kKCBkWyAnc2VsZWN0b3InIF0gKTtcblx0XHRcdGNvbnN0IHZhbGlkVmFsdWVzID0gZFsgJ3ZhbHVlJyBdO1xuXG5cdFx0XHRpZiAoIHZhbGlkVmFsdWVzLmluY2x1ZGVzKCBfdmFsdWUgKSApIHtcblx0XHRcdFx0JHNlbGVjdG9yLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0ZmllbGRXcmFwcGVyLnRyaWdnZXIoICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIFsgaGFuZGxlciwgX3ZhbHVlLCAkZmllbGQgXSApO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApIHtcblx0XHRpZiAoIG51bGwgPT09IGN1cnJlbnRTZWxlY3RvciApIHtcblx0XHRcdGNvbnN0IGhhbmRsZXIgID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0XHRjb25zdCAkaGFuZGxlciA9ICQoIGhhbmRsZXIgKTtcblxuXHRcdFx0JC5lYWNoKCAkaGFuZGxlciwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0IF90aGlzICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgX3ZhbHVlID0gX3RoaXMudmFsKCk7XG5cdFx0XHRcdF9oYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBfdGhpcywgX3ZhbHVlICk7XG5cdFx0XHR9ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdF9oYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBjdXJyZW50U2VsZWN0b3IsIHZhbHVlICk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2V0dXBGaWVsZCggaW5pdGFsID0gZmFsc2UgKSB7XG5cdFx0JC5lYWNoKCBkZXBlbmRhbnREYXRhLCBmdW5jdGlvbiggaSwgZGF0YSApIHtcblx0XHRcdGNvbnN0IGhhbmRsZXIgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRcdGNvbnN0IGV2ZW50ICAgPSBkYXRhWyAnZXZlbnQnIF07XG5cblx0XHRcdGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIG51bGwsIG51bGwgKTtcblxuXHRcdFx0aWYgKCBpbml0YWwgKSB7XG5cdFx0XHRcdGZpZWxkV3JhcHBlci5vbiggZXZlbnQsIGhhbmRsZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0IF90aGlzICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRjb25zdCBfdmFsdWUgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdFx0aGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgX3RoaXMsIF92YWx1ZSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0c2V0dXBGaWVsZCggdHJ1ZSApO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gVG9nZ2xlIHRoZSB2aXNpYmlsaXR5IG9mIHN1YmZpZWxkcy5cblx0XHRzZXR1cEZpZWxkKCk7XG5cdH0gKTtcblxufSApO1xuIl19
