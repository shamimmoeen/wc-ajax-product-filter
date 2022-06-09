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
  var fieldStates = {};

  function storeFieldState() {
    var fieldType = fieldWrapper.find('#field_data').attr('data-field-type');

    if (!fieldType) {
      return;
    }

    var fieldValues = {};
    fieldWrapper.find('[name]:not(.manual_options)').each(function () {
      var $input = $(this);
      var type = $input.attr('type');
      var name = $input.attr('name');
      var value = $input.val();

      if ('checkbox' === type || 'radio' === type) {
        if ($input.is(':checked')) {
          fieldValues[name] = value;
        }
      } else {
        fieldValues[name] = value;
      }
    });
    var manualOptions = {};
    fieldWrapper.find('.manual_options').each(function () {
      var $input = $(this);
      var name = $input.attr('name');
      manualOptions[name] = $input.val();
    });
    fieldValues['manual_options'] = manualOptions;
    fieldStates[fieldType] = fieldValues;
  }

  function updateFieldState($elm) {
    var fieldType = fieldWrapper.find('#field_data').attr('data-field-type');
    var fieldState = fieldStates[fieldType];
    var name = $elm.attr('name');
    var type = $elm.attr('type');
    var value = $elm.val();

    if ($elm.hasClass('manual_options')) {
      var manual_options = fieldState['manual_options'] || {};
      manual_options[name] = value;
      fieldState['manual_options'] = manual_options;
    } else {
      if ('checkbox' === type || 'radio' === type) {
        var $input = fieldWrapper.find('[name="' + name + '"]');

        if ($input.is(':checked')) {
          fieldState[name] = value;
        } else {
          delete fieldState[name];
        }
      } else {
        fieldState[name] = value;
      }
    }
  } // Store the initial field state.


  storeFieldState();
  fieldWrapper.find('[name]').on('change', function () {
    var $this = $(this);
    updateFieldState($this);
  });

  function applyFieldState(fieldType) {
    var fieldState = fieldStates[fieldType];
    fieldWrapper.find('[name]:not(.manual_options)').each(function () {
      var $input = $(this);
      var type = $input.attr('type');
      var name = $input.attr('name');
      var value = fieldState[name];

      if ('checkbox' === type || 'radio' === type) {
        if (name in fieldState) {
          // Add 'checked' attribute.
          fieldWrapper.find('[name="' + name + '"][value="' + value + '"]').attr('checked', 'checked');
        } else {
          // Remove 'checked' attribute.
          fieldWrapper.find('[name="' + name + '"]').removeAttr('checked');
        }
      } else {
        $input.val(value);
      }
    }); // Process the manual options.

    if ('manual_options' in fieldState) {
      var rawOptions = fieldState['manual_options'];
      $.each(rawOptions, function (inputName, raw) {
        var $rawInput = fieldWrapper.find('[name="' + inputName + '"]');
        $rawInput.val(raw);
        var manualOptions = JSON.parse(decodeURIComponent(raw));

        if (!manualOptions.length) {
          return;
        }

        var tableIdentifier = $rawInput.attr('data-table');
        var rowTemplateId = $rawInput.attr('data-tmpl'); // Bail out if no tmpl found for the type.

        if (!jQuery('#tmpl-' + rowTemplateId).length) {
          return;
        }

        var rowsIdentifier = '.field-table-body-rows';
        var rowIdentifier = '.row-item';
        var $table = fieldWrapper.find(tableIdentifier);
        var $rows = $table.find(rowsIdentifier);
        $.each(manualOptions, function (i, option) {
          var template = wp.template(rowTemplateId);
          var rowDefaultOptions = {};

          if ('.manual-options-table' === tableIdentifier) {
            rowDefaultOptions = {
              'value': '',
              'label': ''
            };
          }

          var rendered = template(rowDefaultOptions);
          $rows.append(rendered);
          var $lastRow = $rows.find(rowIdentifier).last();
          $lastRow.find('[data-name]').each(function () {
            var $this = $(this);
            var name = $this.attr('data-name');
            var value = option[name];
            $this.val(value);

            if ('image_url' === name && value) {
              $lastRow.find('.wp-image-picker-container').addClass('active');
              $lastRow.find('img').attr('src', value);
            }
          });
        });
        $table.addClass('has-options');
      });
      var $field = fieldWrapper.find('.wcapf-form-field');
      fieldWrapper.trigger('new_option_added', [$field]);
    }
  }

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
    fieldInside.html(rendered); // If already found the field state then apply it, otherwise store it.

    if (_fieldType in fieldStates) {
      applyFieldState(_fieldType);
    } else {
      storeFieldState();
    }

    fieldWrapper.trigger('field_added');
    fieldWrapper.find('[name]').on('change', function () {
      var $this = $(this);
      updateFieldState($this);
    });
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
    $valueHolder.val(rawValues).trigger('change');
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

  fieldWrapper.on('field_added', function () {
    fieldWrapper.find('.wcapf-form-sub-field-min_value_auto_detect input[type="checkbox"]').each(function () {
      var $this = $(this);
      toggleNumberMinValueField($this);
    });
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

  fieldWrapper.on('field_added', function () {
    fieldWrapper.find('.wcapf-form-sub-field-max_value_auto_detect input[type="checkbox"]').each(function () {
      var $this = $(this);
      toggleNumberMaxValueField($this);
    });
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
      'selector': '.wcapf-form-sub-field-align_values_at_the_end',
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
  }, {
    'handler': '.wcapf-form-sub-field-show_if_empty input',
    'handlerType': 'checkbox',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-empty_filter_message',
      'value': ['1']
    }]
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

        if (!$(fieldWrapper).hasClass('loaded')) {
          $(fieldWrapper).addClass('loaded');
          fieldWrapper.trigger('field_added');
        }
      }
    });
  }

  setupField(true);
  fieldWrapper.on('field_added', function () {
    // Toggle the visibility of subfields.
    setupField();
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbS1hcHBlYXJhbmNlLWZpZWxkcy5qcyIsImRpc3BsYXktdHlwZS1maWVsZHMuanMiLCJmaWVsZC1tZXRhLWJveC5qcyIsIm1hbnVhbC1vcHRpb25zLXRhYmxlLmpzIiwibnVtYmVyLXVpLW9wdGlvbnMuanMiLCJwcm9kdWN0LXN0YXR1cy10YWJsZS5qcyIsInRheG9ub215LWRlZmF1bHQtZmllbGQta2V5LmpzIiwidG9nZ2xlVmlzaWJpbGl0eS5qcyJdLCJuYW1lcyI6WyJqUXVlcnkiLCJkb2N1bWVudCIsInJlYWR5IiwiJCIsImZpZWxkV3JhcHBlciIsIm9uIiwiZSIsImhhbmRsZXIiLCJ2YWx1ZSIsIiRmaWVsZCIsIiRxdWVyeVR5cGUiLCJmaW5kIiwidmFsaWREaXNwbGF5VHlwZXMiLCJpbmNsdWRlcyIsIiRtdWx0aXBsZUZpbHRlciIsImlzIiwic2hvdyIsImhpZGUiLCIkZGlzcGxheVR5cGUiLCJkaXNwbGF5VHlwZSIsInZhbCIsIiRub1Jlc3VsdHMiLCIkYWxsSXRlbXNMYWJlbCIsInVzZUNob3NlbiIsImZpZWxkU3RhdGVzIiwic3RvcmVGaWVsZFN0YXRlIiwiZmllbGRUeXBlIiwiYXR0ciIsImZpZWxkVmFsdWVzIiwiZWFjaCIsIiRpbnB1dCIsInR5cGUiLCJuYW1lIiwibWFudWFsT3B0aW9ucyIsInVwZGF0ZUZpZWxkU3RhdGUiLCIkZWxtIiwiZmllbGRTdGF0ZSIsImhhc0NsYXNzIiwibWFudWFsX29wdGlvbnMiLCIkdGhpcyIsImFwcGx5RmllbGRTdGF0ZSIsInJlbW92ZUF0dHIiLCJyYXdPcHRpb25zIiwiaW5wdXROYW1lIiwicmF3IiwiJHJhd0lucHV0IiwiSlNPTiIsInBhcnNlIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwibGVuZ3RoIiwidGFibGVJZGVudGlmaWVyIiwicm93VGVtcGxhdGVJZCIsInJvd3NJZGVudGlmaWVyIiwicm93SWRlbnRpZmllciIsIiR0YWJsZSIsIiRyb3dzIiwiaSIsIm9wdGlvbiIsInRlbXBsYXRlIiwid3AiLCJyb3dEZWZhdWx0T3B0aW9ucyIsInJlbmRlcmVkIiwiYXBwZW5kIiwiJGxhc3RSb3ciLCJsYXN0IiwiYWRkQ2xhc3MiLCJ0cmlnZ2VyIiwiX2ZpZWxkVHlwZSIsImZpZWxkTmFtZSIsImZpZWxkRGF0YVdyYXBwZXIiLCJmaWVsZE5hbWVXcmFwcGVyIiwiZmllbGRJbnNpZGUiLCJyZW1vdmVDbGFzcyIsImh0bWwiLCJpbml0TWFudWFsT3B0aW9uc1RhYmxlIiwidmFsdWVJZGVudGlmaWVyIiwiZmllbGRJZGVudGlmaWVyIiwiaW5pdFNvcnRhYmxlVGFibGUiLCIkc2VsZWN0b3IiLCJzb3J0YWJsZSIsIm9wYWNpdHkiLCJyZXZlcnQiLCJjdXJzb3IiLCJheGlzIiwiaGFuZGxlIiwicGxhY2Vob2xkZXIiLCJ1cGRhdGUiLCJ0YXJnZXQiLCJjbG9zZXN0IiwidHJpZ2dlck9wdGlvbnNDaGFuZ2UiLCJkaXNhYmxlU2VsZWN0aW9uIiwidGFibGVSb3dzSWRlbnRpZmllciIsIiR2YWx1ZUhvbGRlciIsIl9yb3dzIiwiX2l0ZW0iLCIkaXRlbSIsIm9iaiIsImZpZWxkSW5kZXgiLCJmaWVsZCIsInB1c2giLCJyYXdWYWx1ZXMiLCJlbmNvZGVVUklDb21wb25lbnQiLCJzdHJpbmdpZnkiLCJ0cmlnZ2VyUmVtb3ZlT3B0aW9uIiwiJG9wdGlvbnNUYWJsZSIsInRhYmxlUm93cyIsImNoaWxkcmVuIiwicmVtb3ZlQnRuSWRlbnRpZmllciIsInJlbW92ZSIsImNsZWFyT3B0aW9uc0J0bklkZW50aWZpZXIiLCJlbXB0eSIsImFkZE9wdGlvbkJ0bklkZW50aWZpZXIiLCJ0ZXh0RmllbGRzSWRlbnRpZmllciIsInNlbGVjdEZpZWxkc0lkZW50aWZpZXIiLCJ0YWJsZUlkIiwidG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCIsIiR0ZXh0RmllbGQiLCJ0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkIiwiJGZpZWxkS2V5IiwiZGVwZW5kYW50RGF0YSIsIl9oYW5kbGVUb2dnbGVSZXF1ZXN0IiwiZGF0YSIsImN1cnJlbnRTZWxlY3RvciIsImhhbmRsZXJUeXBlIiwiZGVwZW5kYW50IiwiX3ZhbHVlIiwiaWQiLCJkIiwidmFsaWRWYWx1ZXMiLCJoYW5kbGVUb2dnbGVSZXF1ZXN0IiwiJGhhbmRsZXIiLCJfdGhpcyIsInNldHVwRmllbGQiLCJpbml0YWwiLCJldmVudCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixVQUFVQyxDQUFWLEVBQWM7QUFFdkMsTUFBTUMsWUFBWSxHQUFHRCxDQUFDLENBQUUsdUJBQUYsQ0FBdEI7QUFFQUMsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLHNCQUFqQixFQUF5QyxVQUFVQyxDQUFWLEVBQWFDLE9BQWIsRUFBc0JDLEtBQXRCLEVBQTZCQyxNQUE3QixFQUFzQztBQUM5RSxRQUFLLGdEQUFnREYsT0FBckQsRUFBK0Q7QUFDOUQsVUFBTUcsVUFBVSxHQUFVRCxNQUFNLENBQUNFLElBQVAsQ0FBYSxrQ0FBYixDQUExQjtBQUNBLFVBQU1DLGlCQUFpQixHQUFHLENBQUUsT0FBRixFQUFXLE9BQVgsRUFBb0IsT0FBcEIsQ0FBMUI7O0FBRUEsVUFBS0EsaUJBQWlCLENBQUNDLFFBQWxCLENBQTRCTCxLQUE1QixDQUFMLEVBQTJDO0FBQzFDLFlBQU1NLGVBQWUsR0FBR0wsTUFBTSxDQUFDRSxJQUFQLENBQWEsb0RBQWIsQ0FBeEI7O0FBRUEsWUFBS0csZUFBZSxDQUFDQyxFQUFoQixDQUFvQixVQUFwQixDQUFMLEVBQXdDO0FBQ3ZDTCxVQUFBQSxVQUFVLENBQUNNLElBQVg7QUFDQSxTQUZELE1BRU87QUFDTk4sVUFBQUEsVUFBVSxDQUFDTyxJQUFYO0FBQ0E7QUFDRDtBQUNEO0FBQ0QsR0FmRDtBQWlCQWIsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLHNCQUFqQixFQUF5QyxVQUFVQyxDQUFWLEVBQWFDLE9BQWIsRUFBc0JDLEtBQXRCLEVBQTZCQyxN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LElBQWIsRUFBb0I7QUFDMUMsVUFBTWxILE9BQU8sR0FBR2tILElBQUksQ0FBRSxTQUFGLENBQXBCO0FBQ0EsVUFBTWEsS0FBSyxHQUFLYixJQUFJLENBQUUsT0FBRixDQUFwQjtBQUVBUSxNQUFBQSxtQkFBbUIsQ0FBRVIsSUFBRixFQUFRLElBQVIsRUFBYyxJQUFkLENBQW5COztBQUVBLFVBQUtZLE1BQUwsRUFBYztBQUNiakksUUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCaUksS0FBakIsRUFBd0IvSCxPQUF4QixFQUFpQyxZQUFXO0FBQzNDLGNBQU00SCxLQUFLLEdBQUloSSxDQUFDLENBQUUsSUFBRixDQUFoQjs7QUFDQSxjQUFNMEgsTUFBTSxHQUFHMUgsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVaUIsR0FBVixFQUFmOztBQUNBNkcsVUFBQUEsbUJBQW1CLENBQUVSLElBQUYsRUFBUVUsS0FBUixFQUFlTixNQUFmLENBQW5CO0FBQ0EsU0FKRDs7QUFNQSxZQUFLLENBQUUxSCxDQUFDLENBQUVDLFlBQUYsQ0FBRCxDQUFrQmlDLFFBQWxCLENBQTRCLFFBQTVCLENBQVAsRUFBZ0Q7QUFDL0NsQyxVQUFBQSxDQUFDLENBQUVDLFlBQUYsQ0FBRCxDQUFrQjZELFFBQWxCLENBQTRCLFFBQTVCO0FBRUE3RCxVQUFBQSxZQUFZLENBQUM4RCxPQUFiLENBQXNCLGFBQXRCO0FBQ0E7QUFDRDtBQUNELEtBbkJEO0FBb0JBOztBQUVEa0UsRUFBQUEsVUFBVSxDQUFFLElBQUYsQ0FBVjtBQUVBaEksRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLGFBQWpCLEVBQWdDLFlBQVc7QUFDMUM7QUFDQStILElBQUFBLFVBQVU7QUFDVixHQUhEO0FBS0EsQ0F2WUQiLCJmaWxlIjoid2MtYWpheC1wcm9kdWN0LWZpbHRlci1hZG1pbi1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBEaXNwbGF5IHR5cGUgZmllbGRzLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJHF1ZXJ5VHlwZSAgICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1xdWVyeV90eXBlJyApO1xuXHRcdFx0Y29uc3QgdmFsaWREaXNwbGF5VHlwZXMgPSBbICdsYWJlbCcsICdjb2xvcicsICdpbWFnZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZERpc3BsYXlUeXBlcy5pbmNsdWRlcyggdmFsdWUgKSApIHtcblx0XHRcdFx0Y29uc3QgJG11bHRpcGxlRmlsdGVyID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcgKTtcblxuXHRcdFx0XHRpZiAoICRtdWx0aXBsZUZpbHRlci5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkcXVlcnlUeXBlICAgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXF1ZXJ5X3R5cGUnICk7XG5cdFx0XHRjb25zdCAkZGlzcGxheVR5cGUgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnICk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VHlwZSAgICAgICA9ICRkaXNwbGF5VHlwZS52YWwoKTtcblx0XHRcdGNvbnN0IHZhbGlkRGlzcGxheVR5cGVzID0gWyAnbGFiZWwnLCAnY29sb3InLCAnaW1hZ2UnIF07XG5cblx0XHRcdGlmICggdmFsaWREaXNwbGF5VHlwZXMuaW5jbHVkZXMoIGRpc3BsYXlUeXBlICkgKSB7XG5cdFx0XHRcdGlmICggJzEnID09PSB2YWx1ZSApIHtcblx0XHRcdFx0XHQkcXVlcnlUeXBlLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkcXVlcnlUeXBlLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIERpc3BsYXkgdHlwZSBmaWVsZHMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0Ly8gT3ZlcnJpZGUgbm8tcmVzdWx0cy1tZXNzYWdlLCBhbGwtaXRlbXMtbGFiZWwgZmllbGQncyB0b2dnbGUgdmlzaWJpbGl0eSB3aGVuIHRleHQgZGlzcGxheSB0eXBlIGlzIGNoYW5nZWQuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJG5vUmVzdWx0cyAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0XHRjb25zdCB1c2VDaG9zZW4gICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnICkuaXMoICc6Y2hlY2tlZCcgKTtcblxuXHRcdFx0aWYgKCB1c2VDaG9zZW4gJiYgKCAnc2VsZWN0JyA9PT0gdmFsdWUgfHwgJ211bHRpLXNlbGVjdCcgPT09IHZhbHVlICkgKSB7XG5cdFx0XHRcdCRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggKCAncmFkaW8nID09PSB2YWx1ZSB8fCAnc2VsZWN0JyA9PT0gdmFsdWUgKSB8fCAoICdtdWx0aS1zZWxlY3QnID09PSB2YWx1ZSAmJiB1c2VDaG9zZW4gKSApIHtcblx0XHRcdFx0JGFsbEl0ZW1zTGFiZWwuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGFsbEl0ZW1zTGFiZWwuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdC8vIE92ZXJyaWRlIG5vLXJlc3VsdHMtbWVzc2FnZSwgYWxsLWl0ZW1zLWxhYmVsIGZpZWxkJ3MgdG9nZ2xlIHZpc2liaWxpdHkgd2hlbiB0ZXh0IHVzZSBjaG9zZW4gaXMgY2hhbmdlZC5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0XHRjb25zdCAkYWxsSXRlbXNMYWJlbCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlUeXBlICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCAnMScgPT09IHZhbHVlICYmICggJ3NlbGVjdCcgPT09IGRpc3BsYXlUeXBlIHx8ICdtdWx0aS1zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApICkge1xuXHRcdFx0XHQkbm9SZXN1bHRzLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoXG5cdFx0XHRcdCggJzEnID09PSB2YWx1ZSAmJiAnbXVsdGktc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKVxuXHRcdFx0XHR8fCAoICdyYWRpbycgPT09IGRpc3BsYXlUeXBlIHx8ICdzZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0XHQpIHtcblx0XHRcdFx0JGFsbEl0ZW1zTGFiZWwuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGFsbEl0ZW1zTGFiZWwuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIEZpZWxkIG1ldGEgYm94LlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXHRjb25zdCBmaWVsZFN0YXRlcyAgPSB7fTtcblxuXHRmdW5jdGlvbiBzdG9yZUZpZWxkU3RhdGUoKSB7XG5cdFx0Y29uc3QgZmllbGRUeXBlID0gZmllbGRXcmFwcGVyLmZpbmQoICcjZmllbGRfZGF0YScgKS5hdHRyKCAnZGF0YS1maWVsZC10eXBlJyApO1xuXG5cdFx0aWYgKCAhIGZpZWxkVHlwZSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBmaWVsZFZhbHVlcyA9IHt9O1xuXG5cdFx0ZmllbGRXcmFwcGVyLmZpbmQoICdbbmFtZV06bm90KC5tYW51YWxfb3B0aW9ucyknICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCB0eXBlICAgPSAkaW5wdXQuYXR0ciggJ3R5cGUnICk7XG5cdFx0XHRjb25zdCBuYW1lICAgPSAkaW5wdXQuYXR0ciggJ25hbWUnICk7XG5cdFx0XHRjb25zdCB2YWx1ZSAgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdGlmICggJ2NoZWNrYm94JyA9PT0gdHlwZSB8fCAncmFkaW8nID09PSB0eXBlICkge1xuXHRcdFx0XHRpZiAoICRpbnB1dC5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0XHRcdGZpZWxkVmFsdWVzWyBuYW1lIF0gPSB2YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZmllbGRWYWx1ZXNbIG5hbWUgXSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGNvbnN0IG1hbnVhbE9wdGlvbnMgPSB7fTtcblxuXHRcdGZpZWxkV3JhcHBlci5maW5kKCAnLm1hbnVhbF9vcHRpb25zJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0Y29uc3QgbmFtZSAgID0gJGlucHV0LmF0dHIoICduYW1lJyApO1xuXG5cdFx0XHRtYW51YWxPcHRpb25zWyBuYW1lIF0gPSAkaW5wdXQudmFsKCk7XG5cdFx0fSApO1xuXG5cdFx0ZmllbGRWYWx1ZXNbICdtYW51YWxfb3B0aW9ucycgXSA9IG1hbnVhbE9wdGlvbnM7XG5cblx0XHRmaWVsZFN0YXRlc1sgZmllbGRUeXBlIF0gPSBmaWVsZFZhbHVlcztcblx0fVxuXG5cdGZ1bmN0aW9uIHVwZGF0ZUZpZWxkU3RhdGUoICRlbG0gKSB7XG5cdFx0Y29uc3QgZmllbGRUeXBlICA9IGZpZWxkV3JhcHBlci5maW5kKCAnI2ZpZWxkX2RhdGEnICkuYXR0ciggJ2RhdGEtZmllbGQtdHlwZScgKTtcblx0XHRjb25zdCBmaWVsZFN0YXRlID0gZmllbGRTdGF0ZXNbIGZpZWxkVHlwZSBdO1xuXG5cdFx0Y29uc3QgbmFtZSAgPSAkZWxtLmF0dHIoICduYW1lJyApO1xuXHRcdGNvbnN0IHR5cGUgID0gJGVsbS5hdHRyKCAndHlwZScgKTtcblx0XHRjb25zdCB2YWx1ZSA9ICRlbG0udmFsKCk7XG5cblx0XHRpZiAoICRlbG0uaGFzQ2xhc3MoICdtYW51YWxfb3B0aW9ucycgKSApIHtcblx0XHRcdGNvbnN0IG1hbnVhbF9vcHRpb25zID0gZmllbGRTdGF0ZVsgJ21hbnVhbF9vcHRpb25zJyBdIHx8IHt9O1xuXG5cdFx0XHRtYW51YWxfb3B0aW9uc1sgbmFtZSBdID0gdmFsdWU7XG5cblx0XHRcdGZpZWxkU3RhdGVbICdtYW51YWxfb3B0aW9ucycgXSA9IG1hbnVhbF9vcHRpb25zO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoICdjaGVja2JveCcgPT09IHR5cGUgfHwgJ3JhZGlvJyA9PT0gdHlwZSApIHtcblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gZmllbGRXcmFwcGVyLmZpbmQoICdbbmFtZT1cIicgKyBuYW1lICsgJ1wiXScgKTtcblxuXHRcdFx0XHRpZiAoICRpbnB1dC5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0XHRcdGZpZWxkU3RhdGVbIG5hbWUgXSA9IHZhbHVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGRlbGV0ZSBmaWVsZFN0YXRlWyBuYW1lIF07XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZpZWxkU3RhdGVbIG5hbWUgXSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFN0b3JlIHRoZSBpbml0aWFsIGZpZWxkIHN0YXRlLlxuXHRzdG9yZUZpZWxkU3RhdGUoKTtcblxuXHRmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lXScgKS5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0dXBkYXRlRmllbGRTdGF0ZSggJHRoaXMgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIGFwcGx5RmllbGRTdGF0ZSggZmllbGRUeXBlICkge1xuXHRcdGNvbnN0IGZpZWxkU3RhdGUgPSBmaWVsZFN0YXRlc1sgZmllbGRUeXBlIF07XG5cblx0XHRmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lXTpub3QoLm1hbnVhbF9vcHRpb25zKScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblx0XHRcdGNvbnN0IHR5cGUgICA9ICRpbnB1dC5hdHRyKCAndHlwZScgKTtcblx0XHRcdGNvbnN0IG5hbWUgICA9ICRpbnB1dC5hdHRyKCAnbmFtZScgKTtcblx0XHRcdGNvbnN0IHZhbHVlICA9IGZpZWxkU3RhdGVbIG5hbWUgXTtcblxuXHRcdFx0aWYgKCAnY2hlY2tib3gnID09PSB0eXBlIHx8ICdyYWRpbycgPT09IHR5cGUgKSB7XG5cdFx0XHRcdGlmICggbmFtZSBpbiBmaWVsZFN0YXRlICkge1xuXHRcdFx0XHRcdC8vIEFkZCAnY2hlY2tlZCcgYXR0cmlidXRlLlxuXHRcdFx0XHRcdGZpZWxkV3JhcHBlclxuXHRcdFx0XHRcdFx0LmZpbmQoICdbbmFtZT1cIicgKyBuYW1lICsgJ1wiXVt2YWx1ZT1cIicgKyB2YWx1ZSArICdcIl0nIClcblx0XHRcdFx0XHRcdC5hdHRyKCAnY2hlY2tlZCcsICdjaGVja2VkJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIFJlbW92ZSAnY2hlY2tlZCcgYXR0cmlidXRlLlxuXHRcdFx0XHRcdGZpZWxkV3JhcHBlci5maW5kKCAnW25hbWU9XCInICsgbmFtZSArICdcIl0nICkucmVtb3ZlQXR0ciggJ2NoZWNrZWQnICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRpbnB1dC52YWwoIHZhbHVlICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Ly8gUHJvY2VzcyB0aGUgbWFudWFsIG9wdGlvbnMuXG5cdFx0aWYgKCAnbWFudWFsX29wdGlvbnMnIGluIGZpZWxkU3RhdGUgKSB7XG5cdFx0XHRjb25zdCByYXdPcHRpb25zID0gZmllbGRTdGF0ZVsgJ21hbnVhbF9vcHRpb25zJyBdO1xuXG5cdFx0XHQkLmVhY2goIHJhd09wdGlvbnMsIGZ1bmN0aW9uKCBpbnB1dE5hbWUsIHJhdyApIHtcblx0XHRcdFx0Y29uc3QgJHJhd0lucHV0ID0gZmllbGRXcmFwcGVyLmZpbmQoICdbbmFtZT1cIicgKyBpbnB1dE5hbWUgKyAnXCJdJyApO1xuXG5cdFx0XHRcdCRyYXdJbnB1dC52YWwoIHJhdyApO1xuXG5cdFx0XHRcdGNvbnN0IG1hbnVhbE9wdGlvbnMgPSBKU09OLnBhcnNlKCBkZWNvZGVVUklDb21wb25lbnQoIHJhdyApICk7XG5cblx0XHRcdFx0aWYgKCAhIG1hbnVhbE9wdGlvbnMubGVuZ3RoICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IHRhYmxlSWRlbnRpZmllciA9ICRyYXdJbnB1dC5hdHRyKCAnZGF0YS10YWJsZScgKTtcblx0XHRcdFx0Y29uc3Qgcm93VGVtcGxhdGVJZCAgID0gJHJhd0lucHV0LmF0dHIoICdkYXRhLXRtcGwnICk7XG5cblx0XHRcdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0XHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgcm93VGVtcGxhdGVJZCApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCByb3dzSWRlbnRpZmllciA9ICcuZmllbGQtdGFibGUtYm9keS1yb3dzJztcblx0XHRcdFx0Y29uc3Qgcm93SWRlbnRpZmllciAgPSAnLnJvdy1pdGVtJztcblxuXHRcdFx0XHRjb25zdCAkdGFibGUgPSBmaWVsZFdyYXBwZXIuZmluZCggdGFibGVJZGVudGlmaWVyICk7XG5cdFx0XHRcdGNvbnN0ICRyb3dzICA9ICR0YWJsZS5maW5kKCByb3dzSWRlbnRpZmllciApO1xuXG5cdFx0XHRcdCQuZWFjaCggbWFudWFsT3B0aW9ucywgZnVuY3Rpb24oIGksIG9wdGlvbiApIHtcblx0XHRcdFx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCByb3dUZW1wbGF0ZUlkICk7XG5cblx0XHRcdFx0XHRsZXQgcm93RGVmYXVsdE9wdGlvbnMgPSB7fTtcblxuXHRcdFx0XHRcdGlmICggJy5tYW51YWwtb3B0aW9ucy10YWJsZScgPT09IHRhYmxlSWRlbnRpZmllciApIHtcblx0XHRcdFx0XHRcdHJvd0RlZmF1bHRPcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0XHQndmFsdWUnOiAnJyxcblx0XHRcdFx0XHRcdFx0J2xhYmVsJzogJycsXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHJvd0RlZmF1bHRPcHRpb25zICk7XG5cblx0XHRcdFx0XHQkcm93cy5hcHBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHRcdFx0XHRjb25zdCAkbGFzdFJvdyA9ICRyb3dzLmZpbmQoIHJvd0lkZW50aWZpZXIgKS5sYXN0KCk7XG5cblx0XHRcdFx0XHQkbGFzdFJvdy5maW5kKCAnW2RhdGEtbmFtZV0nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRcdGNvbnN0IG5hbWUgID0gJHRoaXMuYXR0ciggJ2RhdGEtbmFtZScgKTtcblx0XHRcdFx0XHRcdGNvbnN0IHZhbHVlID0gb3B0aW9uWyBuYW1lIF07XG5cblx0XHRcdFx0XHRcdCR0aGlzLnZhbCggdmFsdWUgKTtcblxuXHRcdFx0XHRcdFx0aWYgKCAnaW1hZ2VfdXJsJyA9PT0gbmFtZSAmJiB2YWx1ZSApIHtcblx0XHRcdFx0XHRcdFx0JGxhc3RSb3cuZmluZCggJy53cC1pbWFnZS1waWNrZXItY29udGFpbmVyJyApLmFkZENsYXNzKCAnYWN0aXZlJyApO1xuXHRcdFx0XHRcdFx0XHQkbGFzdFJvdy5maW5kKCAnaW1nJyApLmF0dHIoICdzcmMnLCB2YWx1ZSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCR0YWJsZS5hZGRDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRjb25zdCAkZmllbGQgPSBmaWVsZFdyYXBwZXIuZmluZCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0XHRmaWVsZFdyYXBwZXIudHJpZ2dlciggJ25ld19vcHRpb25fYWRkZWQnLCBbICRmaWVsZCBdICk7XG5cdFx0fVxuXHR9XG5cblx0JCggJyNhdmFpbGFibGVfZmllbGRzJyApLm9uKCAnY2hhbmdlJywgJ1tuYW1lPVwiX2FjdGl2ZV9maWVsZFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzICAgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgX2ZpZWxkVHlwZSA9ICR0aGlzLnZhbCgpO1xuXHRcdGNvbnN0IGZpZWxkTmFtZSAgPSAkdGhpcy5hdHRyKCAnZGF0YS1maWVsZC1uYW1lJyApO1xuXG5cdFx0aWYgKCAhIF9maWVsZFR5cGUgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZmllbGRUeXBlID0gJ3djYXBmLWZvcm0tZmllbGQtJyArIF9maWVsZFR5cGU7XG5cblx0XHQvLyBCYWlsIG91dCBpZiBubyB0bXBsIGZvdW5kIGZvciB0aGUgdHlwZS5cblx0XHRpZiAoICEgalF1ZXJ5KCAnI3RtcGwtJyArIGZpZWxkVHlwZSApLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSAgICAgICAgID0gd3AudGVtcGxhdGUoIGZpZWxkVHlwZSApO1xuXHRcdGNvbnN0IHJlbmRlcmVkICAgICAgICAgPSB0ZW1wbGF0ZSgpO1xuXHRcdGNvbnN0IGZpZWxkRGF0YVdyYXBwZXIgPSBmaWVsZFdyYXBwZXIuZmluZCggJyNmaWVsZF9kYXRhJyApO1xuXHRcdGNvbnN0IGZpZWxkTmFtZVdyYXBwZXIgPSBmaWVsZFdyYXBwZXIuZmluZCggJy5wb3N0Ym94LWhlYWRlciBoMicgKTtcblx0XHRjb25zdCBmaWVsZEluc2lkZSAgICAgID0gZmllbGRXcmFwcGVyLmZpbmQoICcuaW5zaWRlJyApO1xuXG5cdFx0ZmllbGRXcmFwcGVyLnJlbW92ZUNsYXNzKCAnaGlkZGVuJyApO1xuXG5cdFx0ZmllbGREYXRhV3JhcHBlci5hdHRyKCAnZGF0YS1maWVsZC10eXBlJywgX2ZpZWxkVHlwZSApO1xuXHRcdGZpZWxkTmFtZVdyYXBwZXIuaHRtbCggZmllbGROYW1lICk7XG5cdFx0ZmllbGRJbnNpZGUuaHRtbCggcmVuZGVyZWQgKTtcblxuXHRcdC8vIElmIGFscmVhZHkgZm91bmQgdGhlIGZpZWxkIHN0YXRlIHRoZW4gYXBwbHkgaXQsIG90aGVyd2lzZSBzdG9yZSBpdC5cblx0XHRpZiAoIF9maWVsZFR5cGUgaW4gZmllbGRTdGF0ZXMgKSB7XG5cdFx0XHRhcHBseUZpZWxkU3RhdGUoIF9maWVsZFR5cGUgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3RvcmVGaWVsZFN0YXRlKCk7XG5cdFx0fVxuXG5cdFx0ZmllbGRXcmFwcGVyLnRyaWdnZXIoICdmaWVsZF9hZGRlZCcgKTtcblxuXHRcdGZpZWxkV3JhcHBlci5maW5kKCAnW25hbWVdJyApLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0dXBkYXRlRmllbGRTdGF0ZSggJHRoaXMgKTtcblx0XHR9ICk7XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBNYW51YWwgT3B0aW9ucycgdGFibGUgZnVuY3Rpb24uXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG4vKipcbiAqIEBwYXJhbSB0YWJsZUlkZW50aWZpZXJcbiAqIEBwYXJhbSB2YWx1ZUlkZW50aWZpZXJcbiAqIEBwYXJhbSByb3dUZW1wbGF0ZUlkXG4gKiBAcGFyYW0gcm93RGVmYXVsdE9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gaW5pdE1hbnVhbE9wdGlvbnNUYWJsZSggdGFibGVJZGVudGlmaWVyLCB2YWx1ZUlkZW50aWZpZXIsIHJvd1RlbXBsYXRlSWQsIHJvd0RlZmF1bHRPcHRpb25zID0ge30gKSB7XG5cdGNvbnN0ICQgPSBqUXVlcnk7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblxuXHRjb25zdCBmaWVsZElkZW50aWZpZXIgPSAnLndjYXBmLWZvcm0tZmllbGQnO1xuXHRjb25zdCByb3dzSWRlbnRpZmllciAgPSAnLmZpZWxkLXRhYmxlLWJvZHktcm93cyc7XG5cdGNvbnN0IHJvd0lkZW50aWZpZXIgICA9ICcucm93LWl0ZW0nO1xuXG5cdGZ1bmN0aW9uIGluaXRTb3J0YWJsZVRhYmxlKCAkc2VsZWN0b3IgKSB7XG5cdFx0JHNlbGVjdG9yLnNvcnRhYmxlKCB7XG5cdFx0XHRvcGFjaXR5OiAwLjgsXG5cdFx0XHRyZXZlcnQ6IGZhbHNlLFxuXHRcdFx0Y3Vyc29yOiAnbW92ZScsXG5cdFx0XHRheGlzOiAneScsXG5cdFx0XHRoYW5kbGU6ICcubW92ZS1vcHRpb25zLWhhbmRsZXInLFxuXHRcdFx0cGxhY2Vob2xkZXI6ICd3aWRnZXQtcGxhY2Vob2xkZXInLFxuXHRcdFx0dXBkYXRlOiBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkID0gJCggZS50YXJnZXQgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRcdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHRcdFx0fVxuXHRcdH0gKS5kaXNhYmxlU2VsZWN0aW9uKCk7XG5cdH1cblxuXHRjb25zdCB0YWJsZVJvd3NJZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAnICsgcm93c0lkZW50aWZpZXI7XG5cblx0Ly8gSW5pdCB0aGUgc29ydGFibGUgdGFibGUgYWZ0ZXIgcGFnZSBsb2Fkcy5cblx0aW5pdFNvcnRhYmxlVGFibGUoIGZpZWxkV3JhcHBlci5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkgKTtcblxuXHQvLyBJbml0IHRoZSBzb3J0YWJsZSB0YWJsZSBhZnRlciB0aGUgZmllbGQgaXMgYWRkZWQuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0aW5pdFNvcnRhYmxlVGFibGUoICQoIGZpZWxkV3JhcHBlci5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkgKSApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gdHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApIHtcblx0XHRjb25zdCAkdmFsdWVIb2xkZXIgPSAkZmllbGQuZmluZCggdmFsdWVJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgICAgID0gJGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKTtcblx0XHRjb25zdCBfcm93cyAgICAgICAgPSBbXTtcblxuXHRcdCRyb3dzLmZpbmQoICcucm93LWl0ZW0nICkuZWFjaCggZnVuY3Rpb24oIGksIF9pdGVtICkge1xuXHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCBfaXRlbSApO1xuXHRcdFx0Y29uc3Qgb2JqICAgPSB7fTtcblxuXHRcdFx0JGl0ZW0uZmluZCggJ1tkYXRhLW5hbWVdJyApLmVhY2goIGZ1bmN0aW9uKCBmaWVsZEluZGV4LCBmaWVsZCApIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkID0gJCggZmllbGQgKTtcblx0XHRcdFx0Y29uc3QgbmFtZSAgID0gJGZpZWxkLmF0dHIoICdkYXRhLW5hbWUnICk7XG5cblx0XHRcdFx0b2JqWyBuYW1lIF0gPSAkZmllbGQudmFsKCk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdF9yb3dzLnB1c2goIG9iaiApO1xuXHRcdH0gKTtcblxuXHRcdGNvbnN0IHJhd1ZhbHVlcyA9IGVuY29kZVVSSUNvbXBvbmVudCggSlNPTi5zdHJpbmdpZnkoIF9yb3dzICkgKTtcblx0XHQkdmFsdWVIb2xkZXIudmFsKCByYXdWYWx1ZXMgKS50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gdHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICkge1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggdGFibGVJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgdGFibGVSb3dzICAgICA9ICRmaWVsZC5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkuY2hpbGRyZW4oKTtcblxuXHRcdGlmICggMiA+IHRhYmxlUm93cy5sZW5ndGggKSB7XG5cdFx0XHQkb3B0aW9uc1RhYmxlLnJlbW92ZUNsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmVtb3ZlIE9wdGlvblxuXHRjb25zdCByZW1vdmVCdG5JZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAucmVtb3ZlLW9wdGlvbic7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnY2xpY2snLCByZW1vdmVCdG5JZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkaXRlbSAgPSAkKCB0aGlzICkuY2xvc2VzdCggcm93SWRlbnRpZmllciApO1xuXHRcdGNvbnN0ICRmaWVsZCA9ICRpdGVtLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICk7XG5cblx0XHQkaXRlbS5yZW1vdmUoKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIENsZWFyIEFsbCBPcHRpb25zXG5cdGNvbnN0IGNsZWFyT3B0aW9uc0J0bklkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnIC5jbGVhci1vcHRpb25zJztcblxuXHRmaWVsZFdyYXBwZXIub24oICdjbGljaycsIGNsZWFyT3B0aW9uc0J0bklkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdCRmaWVsZC5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkuZW1wdHkoKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApO1xuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIEFkZCBOZXcgT3B0aW9uXG5cdGNvbnN0IGFkZE9wdGlvbkJ0bklkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnIC5hZGQtb3B0aW9uJztcblxuXHRmaWVsZFdyYXBwZXIub24oICdjbGljaycsIGFkZE9wdGlvbkJ0bklkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgcm93VGVtcGxhdGVJZCApLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCByb3dUZW1wbGF0ZUlkICk7XG5cdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSggcm93RGVmYXVsdE9wdGlvbnMgKTtcblx0XHRjb25zdCAkdGFibGUgICA9ICRmaWVsZC5maW5kKCB0YWJsZUlkZW50aWZpZXIgKTtcblx0XHRjb25zdCAkcm93cyAgICA9ICRmaWVsZC5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICk7XG5cblx0XHQkcm93cy5hcHBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cblx0XHRmaWVsZFdyYXBwZXIudHJpZ2dlciggJ25ld19vcHRpb25fYWRkZWQnLCBbICRmaWVsZCBdICk7XG5cblx0XHRpZiAoICEgJHRhYmxlLmhhc0NsYXNzKCAnaGFzLW9wdGlvbnMnICkgKSB7XG5cdFx0XHQkdGFibGUuYWRkQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH0gKTtcblxuXHQvLyBUcmlnZ2VyIG9wdGlvbnMgY2hhbmdlIHdoZW4gdGhlIHRleHQgZmllbGRzIGdldCBjaGFuZ2VkLlxuXHRjb25zdCB0ZXh0RmllbGRzSWRlbnRpZmllciA9IHRhYmxlUm93c0lkZW50aWZpZXIgKyAnIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJztcblxuXHRmaWVsZFdyYXBwZXIub24oICdpbnB1dCcsIHRleHRGaWVsZHNJZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBUcmlnZ2VyIG9wdGlvbnMgY2hhbmdlIHdoZW4gdGhlIHNlbGVjdCBmaWVsZHMgZ2V0IGNoYW5nZWQuXG5cdGxldCBzZWxlY3RGaWVsZHNJZGVudGlmaWVyID0gdGFibGVSb3dzSWRlbnRpZmllciArICcgc2VsZWN0JztcblxuXHRmaWVsZFdyYXBwZXIub24oICdjaGFuZ2UnLCBzZWxlY3RGaWVsZHNJZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBUcmlnZ2VyIG9wdGlvbnMgY2hhbmdlIHdoZW4gdmFsdWUgaXMgYWRkZWQgZnJvbSBtb2RhbC5cblx0ZmllbGRXcmFwcGVyLm9uKCAndHJpZ2dlcl9vcHRpb25zX3RhYmxlJywgZnVuY3Rpb24oIGUsIHRhYmxlSWQsICRmaWVsZCApIHtcblx0XHRpZiAoIHRhYmxlSWQgPT09IHRhYmxlSWRlbnRpZmllciApIHtcblx0XHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0XHR9XG5cdH0gKTtcblxufVxuIiwiLyoqXG4gKiBUaGUgbnVtYmVyIHVpIG9wdGlvbnMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0LyoqXG5cdCAqIFRvZ2dsZSBkaXNhYmxlZCBhdHRyaWJ1dGUgb2YgbWluLXZhbHVlIGZpZWxkIGZvciBudW1iZXIgdHlwZS5cblx0ICovXG5cdGZ1bmN0aW9uIHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICRlbG0gKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICA9ICRlbG0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICR0ZXh0RmllbGQgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWUgaW5wdXRbdHlwZT1cInRleHRcIl0nICk7XG5cblx0XHRpZiAoICRlbG0uaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdCR0ZXh0RmllbGQuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkdGV4dEZpZWxkLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHR9XG5cdH1cblxuXHRmaWVsZFdyYXBwZXIub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdGZpZWxkV3JhcHBlci5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0dG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJHRoaXMgKTtcblx0XHR9ICk7XG5cdH0gKTtcblxuXHRmaWVsZFdyYXBwZXIub24oXG5cdFx0J2NsaWNrJyxcblx0XHQnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fVxuXHQpO1xuXG5cdC8qKlxuXHQgKiBUb2dnbGUgZGlzYWJsZWQgYXR0cmlidXRlIG9mIG1heC12YWx1ZSBmaWVsZCBmb3IgbnVtYmVyIHR5cGUuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkZWxtICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkdGV4dEZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXG5cdFx0aWYgKCAkZWxtLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHQkdGV4dEZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHRleHRGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHRmaWVsZFdyYXBwZXIuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fSApO1xuXHR9ICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKFxuXHRcdCdjbGljaycsXG5cdFx0Jy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0XHR0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHRcdH1cblx0KTtcblxufSApO1xuIiwiLyoqXG4gKiBUaGUgcHJvZHVjdCBzdGF0dXMgZmllbGQuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXG5cdGNvbnN0IHRhYmxlSWRlbnRpZmllciA9ICcucHJvZHVjdC1zdGF0dXMtb3B0aW9ucy10YWJsZSc7XG5cdGNvbnN0IHZhbHVlSWRlbnRpZmllciA9ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcHJvZHVjdF9zdGF0dXNfb3B0aW9ucyBpbnB1dCc7XG5cdGNvbnN0IHJvd1RlbXBsYXRlSWQgICA9ICd3Y2FwZi1wcm9kdWN0LXN0YXR1cy1vcHRpb24nO1xuXG5cdGluaXRNYW51YWxPcHRpb25zVGFibGUoIHRhYmxlSWRlbnRpZmllciwgdmFsdWVJZGVudGlmaWVyLCByb3dUZW1wbGF0ZUlkICk7XG5cbn0gKTtcbiIsIi8qKlxuICogVGF4b25vbXkncyBkZWZhdWx0IGZpZWxkIGtleS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10YXhvbm9teSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJGZpZWxkS2V5ID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZmllbGRfa2V5JyApO1xuXG5cdFx0XHQvLyBQcmVwZW5kIGRhc2ggdG8gYXZvaWQgY29uZmxpY3Rpbmcgd2l0aCB0aGUgcmVnaXN0ZXJlZCB0YXhvbm9taWVzLlxuXHRcdFx0aWYgKCB2YWx1ZSApIHtcblx0XHRcdFx0dmFsdWUgPSAnXycgKyB2YWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0JGZpZWxkS2V5LmZpbmQoICdpbnB1dFt0eXBlPVwidGV4dFwiXScgKS52YWwoIHZhbHVlICk7XG5cdFx0fVxuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIHRvZ2dsZSB2aXNpYmlsaXR5IHNjcmlwdHMuXG4gKlxuICogTk9URTogVGhlc2Ugc2NyaXB0cyBtdXN0IGJlIGxvY2F0ZWQgYXQgdGhlIHZlcnkgYm90dG9tIG9mIHRoZSBjb21iaW5lZCBzY3JpcHRzLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdGNvbnN0IGRlcGVuZGFudERhdGEgPSBbXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXZhbHVlX3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5pbnB1dC10eXBlLXRleHQtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0ZXh0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5pbnB1dC10eXBlLW51bWJlci1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ251bWJlcicgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS1kYXRlLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnZGF0ZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcudmFsdWUtZGVjaW1hbC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ251bWJlcicgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcXVlcnlfdHlwZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY2hlY2tib3gnLCAnbXVsdGktc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhZGlvJywgJ3NlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnc2VsZWN0JywgJ211bHRpLXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaGllcmFyY2hpY2FsLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY2hlY2tib3gnLCAncmFkaW8nLCAnc2VsZWN0JywgJ211bHRpLXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2NhdGVnb3J5X2ltYWdlcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW1hZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9tdWx0aXBsZV9maWx0ZXInLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2xhYmVsJywgJ2NvbG9yJywgJ2ltYWdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5jb2x1bW4tZ3JvdXAtY3VzdG9tX2FwcGVhcmFuY2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NvbG9yJywgJ2ltYWdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWhpZXJhcmNoaWNhbCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfaGllcmFyY2h5X2FjY29yZGlvbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfZGVjaW1hbCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV9kZWNpbWFsX3BsYWNlcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZ2V0X29wdGlvbnMgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuY29sdW1uLWdyb3VwLW1ldGFfa2V5X21hbnVhbF9vcHRpb25zJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdtYW51YWxfZW50cnknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2xpZGVyX2Rpc3BsYXlfdmFsdWVzX2FzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsaWduX3ZhbHVlc19hdF90aGVfZW5kJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NlbGVjdF9hbGxfaXRlbXNfbGFiZWwnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3VzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXInLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2hvd19jb3VudCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JywgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfaGlkZV9lbXB0eScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JywgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItZGVjaW1hbC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NsaWRlcicsICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnLCAncmFuZ2VfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZ2V0X29wdGlvbnMgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLWF1dG9tYXRpYy1vcHRpb25zJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdhdXRvbWF0aWNhbGx5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItbWFudWFsLW9wdGlvbnMtdGFibGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ21hbnVhbF9lbnRyeScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGF0ZV9kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5kYXRlLXRvLXVpLW9wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2lucHV0X2RhdGVfcmFuZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRhdGVfZm9ybWF0Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbnB1dF9kYXRlJywgJ2lucHV0X2RhdGVfcmFuZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3F1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2NoZWNrYm94JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9zZWxlY3RfYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9yYWRpbycsICd0aW1lX3BlcmlvZF9zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3VzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX3NlbGVjdCcsICd0aW1lX3BlcmlvZF9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfZW5hYmxlX211bHRpcGxlX2ZpbHRlcicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3Nob3dfY291bnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2NoZWNrYm94JywgJ3RpbWVfcGVyaW9kX3JhZGlvJywgJ3RpbWVfcGVyaW9kX3NlbGVjdCcsICd0aW1lX3BlcmlvZF9tdWx0aXNlbGVjdCcsICd0aW1lX3BlcmlvZF9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfaGlkZV9lbXB0eScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfY2hlY2tib3gnLCAndGltZV9wZXJpb2RfcmFkaW8nLCAndGltZV9wZXJpb2Rfc2VsZWN0JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JywgJ3RpbWVfcGVyaW9kX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF91c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9zb2Z0X2xpbWl0IGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNvZnRfbGltaXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2VuYWJsZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGF4b25vbXkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtY3VzdG9tLXRheG9ub215IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1ldGFfa2V5IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBvc3RfcHJvcGVydHkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfb3B0aW9ucyBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBhcmVudF90ZXJtJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjaGlsZCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfdmFsdWVzX2J5X2lkJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbmNsdWRlJywgJ2V4Y2x1ZGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9hY2NvcmRpb24gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWNjb3JkaW9uX2RlZmF1bHRfc3RhdGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3llcycgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2NhdGVnb3J5X2ltYWdlcyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNob3dfaWZfZW1wdHkgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW1wdHlfZmlsdGVyX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdF07XG5cblx0ZnVuY3Rpb24gX2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgPSBjdXJyZW50U2VsZWN0b3IuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0IGhhbmRsZXIgICAgID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0Y29uc3QgaGFuZGxlclR5cGUgPSBkYXRhWyAnaGFuZGxlclR5cGUnIF07XG5cdFx0Y29uc3QgZGVwZW5kYW50ICAgPSBkYXRhWyAnZGVwZW5kYW50JyBdO1xuXG5cdFx0bGV0IF92YWx1ZSA9IHZhbHVlO1xuXG5cdFx0aWYgKCAnY2hlY2tib3gnID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9IGN1cnJlbnRTZWxlY3Rvci5pcyggJzpjaGVja2VkJyApID8gJzEnIDogJzAnO1xuXHRcdH1cblxuXHRcdGlmICggJ3JhZGlvJyA9PT0gaGFuZGxlclR5cGUgKSB7XG5cdFx0XHRfdmFsdWUgPSAkZmllbGQuZmluZCggaGFuZGxlciArICc6Y2hlY2tlZCcgKS52YWwoKTtcblx0XHR9XG5cblx0XHQkLmVhY2goIGRlcGVuZGFudCwgZnVuY3Rpb24oIGlkLCBkICkge1xuXHRcdFx0Y29uc3QgJHNlbGVjdG9yICAgPSAkZmllbGQuZmluZCggZFsgJ3NlbGVjdG9yJyBdICk7XG5cdFx0XHRjb25zdCB2YWxpZFZhbHVlcyA9IGRbICd2YWx1ZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZFZhbHVlcy5pbmNsdWRlcyggX3ZhbHVlICkgKSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc2VsZWN0b3IuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBbIGhhbmRsZXIsIF92YWx1ZSwgJGZpZWxkIF0gKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0aWYgKCBudWxsID09PSBjdXJyZW50U2VsZWN0b3IgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyICA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdFx0Y29uc3QgJGhhbmRsZXIgPSAkKCBoYW5kbGVyICk7XG5cblx0XHRcdCQuZWFjaCggJGhhbmRsZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IF92YWx1ZSA9IF90aGlzLnZhbCgpO1xuXHRcdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgX3RoaXMsIF92YWx1ZSApO1xuXHRcdFx0fSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNldHVwRmllbGQoIGluaXRhbCA9IGZhbHNlICkge1xuXHRcdCQuZWFjaCggZGVwZW5kYW50RGF0YSwgZnVuY3Rpb24oIGksIGRhdGEgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0XHRjb25zdCBldmVudCAgID0gZGF0YVsgJ2V2ZW50JyBdO1xuXG5cdFx0XHRoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBudWxsLCBudWxsICk7XG5cblx0XHRcdGlmICggaW5pdGFsICkge1xuXHRcdFx0XHRmaWVsZFdyYXBwZXIub24oIGV2ZW50LCBoYW5kbGVyLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0Y29uc3QgX3ZhbHVlID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHRcdGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIF90aGlzLCBfdmFsdWUgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGlmICggISAkKCBmaWVsZFdyYXBwZXIgKS5oYXNDbGFzcyggJ2xvYWRlZCcgKSApIHtcblx0XHRcdFx0XHQkKCBmaWVsZFdyYXBwZXIgKS5hZGRDbGFzcyggJ2xvYWRlZCcgKTtcblxuXHRcdFx0XHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnZmllbGRfYWRkZWQnICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRzZXR1cEZpZWxkKCB0cnVlICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHQvLyBUb2dnbGUgdGhlIHZpc2liaWxpdHkgb2Ygc3ViZmllbGRzLlxuXHRcdHNldHVwRmllbGQoKTtcblx0fSApO1xuXG59ICk7XG4iXX0=
