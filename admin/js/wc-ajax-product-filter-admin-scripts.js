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
var fieldStates = {};
jQuery(document).ready(function ($) {
  var fieldWrapper = $('#chosen_field_wrapper');

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

      if ('checkbox' === type || 'radio' === type) {
        if ($input.is(':checked')) {
          fieldValues[name] = $input.val();
        }
      } else {
        fieldValues[name] = $input.val();
      }
    });

    if (fieldWrapper.find('.manual_options')) {
      var raw = fieldWrapper.find('.manual_options').val();

      if (raw) {
        fieldValues['manual_options'] = raw;
      }
    }

    fieldStates[fieldType] = fieldValues;
  } // Store the initial field state.


  storeFieldState();
  fieldWrapper.find('[name]').on('change', function () {
    storeFieldState();
  });

  function applyFieldState(fieldType) {
    var fieldState = fieldStates[fieldType];
    fieldWrapper.find('[name]').each(function () {
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
      var raw = fieldState['manual_options'];

      if (!raw) {
        return;
      }

      var $rawInput = fieldWrapper.find('.manual_options');
      $rawInput.val(raw);
      var manualOptions = JSON.parse(decodeURIComponent(raw));

      if (!manualOptions) {
        return;
      }

      var tableIdentifier = $rawInput.attr('data-table');
      var rowTemplateId = $rawInput.attr('data-tmpl'); // Bail out if no tmpl found for the type.

      if (!jQuery('#tmpl-' + rowTemplateId).length) {
        return;
      }

      var fieldIdentifier = '.wcapf-form-field';
      var rowsIdentifier = '.field-table-body-rows';
      var rowIdentifier = '.row-item';
      var $field = fieldWrapper.find(fieldIdentifier);
      var $table = $field.find(tableIdentifier);
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
      storeFieldState();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbS1hcHBlYXJhbmNlLWZpZWxkcy5qcyIsImRpc3BsYXktdHlwZS1maWVsZHMuanMiLCJmaWVsZC1tZXRhLWJveC5qcyIsIm1hbnVhbC1vcHRpb25zLXRhYmxlLmpzIiwibnVtYmVyLXVpLW9wdGlvbnMuanMiLCJwcm9kdWN0LXN0YXR1cy10YWJsZS5qcyIsInRheG9ub215LWRlZmF1bHQtZmllbGQta2V5LmpzIiwidG9nZ2xlVmlzaWJpbGl0eS5qcyJdLCJuYW1lcyI6WyJqUXVlcnkiLCJkb2N1bWVudCIsInJlYWR5IiwiJCIsImZpZWxkV3JhcHBlciIsIm9uIiwiZSIsImhhbmRsZXIiLCJ2YWx1ZSIsIiRmaWVsZCIsIiRxdWVyeVR5cGUiLCJmaW5kIiwidmFsaWREaXNwbGF5VHlwZXMiLCJpbmNsdWRlcyIsIiRtdWx0aXBsZUZpbHRlciIsImlzIiwic2hvdyIsImhpZGUiLCIkZGlzcGxheVR5cGUiLCJkaXNwbGF5VHlwZSIsInZhbCIsIiRub1Jlc3VsdHMiLCIkYWxsSXRlbXNMYWJlbCIsInVzZUNob3NlbiIsImZpZWxkU3RhdGVzIiwic3RvcmVGaWVsZFN0YXRlIiwiZmllbGRUeXBlIiwiYXR0ciIsImZpZWxkVmFsdWVzIiwiZWFjaCIsIiRpbnB1dCIsInR5cGUiLCJuYW1lIiwicmF3IiwiYXBwbHlGaWVsZFN0YXRlIiwiZmllbGRTdGF0ZSIsInJlbW92ZUF0dHIiLCIkcmF3SW5wdXQiLCJtYW51YWxPcHRpb25zIiwiSlNPTiIsInBhcnNlIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwidGFibGVJZGVudGlmaWVyIiwicm93VGVtcGxhdGVJZCIsImxlbmd0aCIsImZpZWxkSWRlbnRpZmllciIsInJvd3NJZGVudGlmaWVyIiwicm93SWRlbnRpZmllciIsIiR0YWJsZSIsIiRyb3dzIiwiaSIsIm9wdGlvbiIsInRlbXBsYXRlIiwid3AiLCJyb3dEZWZhdWx0T3B0aW9ucyIsInJlbmRlcmVkIiwiYXBwZW5kIiwiJGxhc3RSb3ciLCJsYXN0IiwiJHRoaXMiLCJhZGRDbGFzcyIsInRyaWdnZXIiLCJfZmllbGRUeXBlIiwiZmllbGROYW1lIiwiZmllbGREYXRhV3JhcHBlciIsImZpZWxkTmFtZVdyYXBwZXIiLCJmaWVsZEluc2lkZSIsInJlbW92ZUNsYXNzIiwiaHRtbCIsImluaXRNYW51YWxPcHRpb25zVGFibGUiLCJ2YWx1ZUlkZW50aWZpZXIiLCJpbml0U29ydGFibGVUYWJsZSIsIiRzZWxlY3RvciIsInNvcnRhYmxlIiwib3BhY2l0eSIsInJldmVydCIsImN1cnNvciIsImF4aXMiLCJoYW5kbGUiLCJwbGFjZWhvbGRlciIsInVwZGF0ZSIsInRhcmdldCIsImNsb3Nlc3QiLCJ0cmlnZ2VyT3B0aW9uc0NoYW5nZSIsImRpc2FibGVTZWxlY3Rpb24iLCJ0YWJsZVJvd3NJZGVudGlmaWVyIiwiJHZhbHVlSG9sZGVyIiwiX3Jvd3MiLCJfaXRlbSIsIiRpdGVtIiwib2JqIiwiZmllbGRJbmRleCIsImZpZWxkIiwicHVzaCIsInJhd1ZhbHVlcyIsImVuY29kZVVSSUNvbXBvbmVudCIsInN0cmluZ2lmeSIsInRyaWdnZXJSZW1vdmVPcHRpb24iLCIkb3B0aW9uc1RhYmxlIiwidGFibGVSb3dzIiwiY2hpbGRyZW4iLCJyZW1vdmVCdG5JZGVudGlmaWVyIiwicmVtb3ZlIiwiY2xlYXJPcHRpb25zQnRuSWRlbnRpZmllciIsImVtcHR5IiwiYWRkT3B0aW9uQnRuSWRlbnRpZmllciIsImhhc0NsYXNzIiwidGV4dEZpZWxkc0lkZW50aWZpZXIiLCJzZWxlY3RGaWVsZHNJZGVudGlmaWVyIiwidGFibGVJZCIsInRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQiLCIkZWxtIiwiJHRleHRGaWVsZCIsInRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQiLCIkZmllbGRLZXkiLCJkZXBlbmRhbnREYXRhIiwiX2hhbmRsZVRvZ2dsZVJlcXVlc3QiLCJkYXRhIiwiY3VycmVudFNlbGVjdG9yIiwiaGFuZGxlclR5cGUiLCJkZXBlbmRhbnQiLCJfdmFsdWUiLCJpZCIsImQiLCJ2YWxpZFZhbHVlcyIsImhhbmRsZVRvZ2dsZVJlcXVlc3QiLCIkaGFuZGxlciIsIl90aGlzIiwic2V0dXBGaWVsZCIsImluaXRhbCIsImV2ZW50Il0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUEsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVDLENBQVYsRUFBYztBQUV2QyxNQUFNQyxZQUFZLEdBQUdELENBQUMsQ0FBRSx1QkFBRixDQUF0QjtBQUVBQyxFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUIsc0JBQWpCLEVBQXlDLFVBQVVDLENBQVYsRUFBYUMsT0FBYixFQUFzQkMsS0FBdEIsRUFBNkJDLE1BQTdCLEVBQXNDO0FBQzlFLFFBQUssZ0RBQWdERixPQUFyRCxFQUErRDtBQUM5RCxVQUFNRyxVQUFVLEdBQVVELE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLGtDQUFiLENBQTFCO0FBQ0EsVUFBTUMsaUJBQWlCLEdBQUcsQ0FBRSxPQUFGLEVBQVcsT0FBWCxFQUFvQixPQUFwQixDQUExQjs7QUFFQSxVQUFLQSxpQkFBaUIsQ0FBQ0MsUUFBbEIsQ0FBNEJMLEtBQTVCLENBQUwsRUFBMkM7QUFDMUMsWUFBTU0sZUFBZSxHQUFHTCxNQUFNLENBQUNFLElBQVAsQ0FBYSxvREFBYixDQUF4Qjs7QUFFQSxZQUFLRyxlQUFlLENBQUNDLEVBQWhCLENBQW9CLFVBQXBCLENBQUwsRUFBd0M7QUFDdkNMLFVBQUFBLFVBQVUsQ0FBQ00sSUFBWDtBQUNBLFNBRkQsTUFFTztBQUNOTixVQUFBQSxVQUFVLENBQUNPLElBQVg7QUFDQTtBQUNEO0FBQ0Q7QUFDRCxHQWZEO0FBaUJBYixFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUIsc0JBQWpCLEVBQXlDLFVBQVVDLENBQVYsRUFBYUMsT0FBYixFQUFzQkMsS0FBdEIsRUFBNkJDLE1BQTdCLEVBQXNDO0FBQzlFLFFBQUsseURBQXlERixPQUE5RCxFQUF3RTtBQUN2RSxVQUFNRyxVQUFVLEdB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QVYsRUFBZjs7QUFDQXlHLFVBQUFBLG1CQUFtQixDQUFFUixJQUFGLEVBQVFVLEtBQVIsRUFBZU4sTUFBZixDQUFuQjtBQUNBLFNBSkQ7O0FBTUEsWUFBSyxDQUFFdEgsQ0FBQyxDQUFFQyxZQUFGLENBQUQsQ0FBa0JzRyxRQUFsQixDQUE0QixRQUE1QixDQUFQLEVBQWdEO0FBQy9DdkcsVUFBQUEsQ0FBQyxDQUFFQyxZQUFGLENBQUQsQ0FBa0J3RCxRQUFsQixDQUE0QixRQUE1QjtBQUVBeEQsVUFBQUEsWUFBWSxDQUFDeUQsT0FBYixDQUFzQixhQUF0QjtBQUNBO0FBQ0Q7QUFDRCxLQW5CRDtBQW9CQTs7QUFFRG1FLEVBQUFBLFVBQVUsQ0FBRSxJQUFGLENBQVY7QUFFQTVILEVBQUFBLFlBQVksQ0FBQ0MsRUFBYixDQUFpQixhQUFqQixFQUFnQyxZQUFXO0FBQzFDO0FBQ0EySCxJQUFBQSxVQUFVO0FBQ1YsR0FIRDtBQUtBLENBdllEIiwiZmlsZSI6IndjLWFqYXgtcHJvZHVjdC1maWx0ZXItYWRtaW4tc2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRGlzcGxheSB0eXBlIGZpZWxkcy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRxdWVyeVR5cGUgICAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtcXVlcnlfdHlwZScgKTtcblx0XHRcdGNvbnN0IHZhbGlkRGlzcGxheVR5cGVzID0gWyAnbGFiZWwnLCAnY29sb3InLCAnaW1hZ2UnIF07XG5cblx0XHRcdGlmICggdmFsaWREaXNwbGF5VHlwZXMuaW5jbHVkZXMoIHZhbHVlICkgKSB7XG5cdFx0XHRcdGNvbnN0ICRtdWx0aXBsZUZpbHRlciA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnICk7XG5cblx0XHRcdFx0aWYgKCAkbXVsdGlwbGVGaWx0ZXIuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdFx0XHQkcXVlcnlUeXBlLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkcXVlcnlUeXBlLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJHF1ZXJ5VHlwZSAgICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1xdWVyeV90eXBlJyApO1xuXHRcdFx0Y29uc3QgJGRpc3BsYXlUeXBlICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyApO1xuXHRcdFx0Y29uc3QgZGlzcGxheVR5cGUgICAgICAgPSAkZGlzcGxheVR5cGUudmFsKCk7XG5cdFx0XHRjb25zdCB2YWxpZERpc3BsYXlUeXBlcyA9IFsgJ2xhYmVsJywgJ2NvbG9yJywgJ2ltYWdlJyBdO1xuXG5cdFx0XHRpZiAoIHZhbGlkRGlzcGxheVR5cGVzLmluY2x1ZGVzKCBkaXNwbGF5VHlwZSApICkge1xuXHRcdFx0XHRpZiAoICcxJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHRcdFx0JHF1ZXJ5VHlwZS5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHF1ZXJ5VHlwZS5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBEaXNwbGF5IHR5cGUgZmllbGRzLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdC8vIE92ZXJyaWRlIG5vLXJlc3VsdHMtbWVzc2FnZSwgYWxsLWl0ZW1zLWxhYmVsIGZpZWxkJ3MgdG9nZ2xlIHZpc2liaWxpdHkgd2hlbiB0ZXh0IGRpc3BsYXkgdHlwZSBpcyBjaGFuZ2VkLlxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScgKTtcblx0XHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyApO1xuXHRcdFx0Y29uc3QgdXNlQ2hvc2VuICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0JyApLmlzKCAnOmNoZWNrZWQnICk7XG5cblx0XHRcdGlmICggdXNlQ2hvc2VuICYmICggJ3NlbGVjdCcgPT09IHZhbHVlIHx8ICdtdWx0aS1zZWxlY3QnID09PSB2YWx1ZSApICkge1xuXHRcdFx0XHQkbm9SZXN1bHRzLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICggJ3JhZGlvJyA9PT0gdmFsdWUgfHwgJ3NlbGVjdCcgPT09IHZhbHVlICkgfHwgKCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgJiYgdXNlQ2hvc2VuICkgKSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHQvLyBPdmVycmlkZSBuby1yZXN1bHRzLW1lc3NhZ2UsIGFsbC1pdGVtcy1sYWJlbCBmaWVsZCdzIHRvZ2dsZSB2aXNpYmlsaXR5IHdoZW4gdGV4dCB1c2UgY2hvc2VuIGlzIGNoYW5nZWQuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJG5vUmVzdWx0cyAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VHlwZSAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnICkudmFsKCk7XG5cblx0XHRcdGlmICggJzEnID09PSB2YWx1ZSAmJiAoICdzZWxlY3QnID09PSBkaXNwbGF5VHlwZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKSApIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKFxuXHRcdFx0XHQoICcxJyA9PT0gdmFsdWUgJiYgJ211bHRpLXNlbGVjdCcgPT09IGRpc3BsYXlUeXBlIClcblx0XHRcdFx0fHwgKCAncmFkaW8nID09PSBkaXNwbGF5VHlwZSB8fCAnc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKVxuXHRcdFx0KSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBGaWVsZCBtZXRhIGJveC5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmNvbnN0IGZpZWxkU3RhdGVzID0ge307XG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblxuXHRmdW5jdGlvbiBzdG9yZUZpZWxkU3RhdGUoKSB7XG5cdFx0Y29uc3QgZmllbGRUeXBlID0gZmllbGRXcmFwcGVyLmZpbmQoICcjZmllbGRfZGF0YScgKS5hdHRyKCAnZGF0YS1maWVsZC10eXBlJyApO1xuXG5cdFx0aWYgKCAhIGZpZWxkVHlwZSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBmaWVsZFZhbHVlcyA9IHt9O1xuXG5cdFx0ZmllbGRXcmFwcGVyLmZpbmQoICdbbmFtZV06bm90KC5tYW51YWxfb3B0aW9ucyknICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCB0eXBlICAgPSAkaW5wdXQuYXR0ciggJ3R5cGUnICk7XG5cdFx0XHRjb25zdCBuYW1lICAgPSAkaW5wdXQuYXR0ciggJ25hbWUnICk7XG5cblx0XHRcdGlmICggJ2NoZWNrYm94JyA9PT0gdHlwZSB8fCAncmFkaW8nID09PSB0eXBlICkge1xuXHRcdFx0XHRpZiAoICRpbnB1dC5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0XHRcdGZpZWxkVmFsdWVzWyBuYW1lIF0gPSAkaW5wdXQudmFsKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZpZWxkVmFsdWVzWyBuYW1lIF0gPSAkaW5wdXQudmFsKCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0aWYgKCBmaWVsZFdyYXBwZXIuZmluZCggJy5tYW51YWxfb3B0aW9ucycgKSApIHtcblx0XHRcdGNvbnN0IHJhdyA9IGZpZWxkV3JhcHBlci5maW5kKCAnLm1hbnVhbF9vcHRpb25zJyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoIHJhdyApIHtcblx0XHRcdFx0ZmllbGRWYWx1ZXNbICdtYW51YWxfb3B0aW9ucycgXSA9IHJhdztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmaWVsZFN0YXRlc1sgZmllbGRUeXBlIF0gPSBmaWVsZFZhbHVlcztcblx0fVxuXG5cdC8vIFN0b3JlIHRoZSBpbml0aWFsIGZpZWxkIHN0YXRlLlxuXHRzdG9yZUZpZWxkU3RhdGUoKTtcblxuXHRmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lXScgKS5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdHN0b3JlRmllbGRTdGF0ZSgpO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gYXBwbHlGaWVsZFN0YXRlKCBmaWVsZFR5cGUgKSB7XG5cdFx0Y29uc3QgZmllbGRTdGF0ZSA9IGZpZWxkU3RhdGVzWyBmaWVsZFR5cGUgXTtcblxuXHRcdGZpZWxkV3JhcHBlci5maW5kKCAnW25hbWVdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0Y29uc3QgdHlwZSAgID0gJGlucHV0LmF0dHIoICd0eXBlJyApO1xuXHRcdFx0Y29uc3QgbmFtZSAgID0gJGlucHV0LmF0dHIoICduYW1lJyApO1xuXHRcdFx0Y29uc3QgdmFsdWUgID0gZmllbGRTdGF0ZVsgbmFtZSBdO1xuXG5cdFx0XHRpZiAoICdjaGVja2JveCcgPT09IHR5cGUgfHwgJ3JhZGlvJyA9PT0gdHlwZSApIHtcblx0XHRcdFx0aWYgKCBuYW1lIGluIGZpZWxkU3RhdGUgKSB7XG5cdFx0XHRcdFx0Ly8gQWRkICdjaGVja2VkJyBhdHRyaWJ1dGUuXG5cdFx0XHRcdFx0ZmllbGRXcmFwcGVyXG5cdFx0XHRcdFx0XHQuZmluZCggJ1tuYW1lPVwiJyArIG5hbWUgKyAnXCJdW3ZhbHVlPVwiJyArIHZhbHVlICsgJ1wiXScgKVxuXHRcdFx0XHRcdFx0LmF0dHIoICdjaGVja2VkJywgJ2NoZWNrZWQnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gUmVtb3ZlICdjaGVja2VkJyBhdHRyaWJ1dGUuXG5cdFx0XHRcdFx0ZmllbGRXcmFwcGVyLmZpbmQoICdbbmFtZT1cIicgKyBuYW1lICsgJ1wiXScgKS5yZW1vdmVBdHRyKCAnY2hlY2tlZCcgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGlucHV0LnZhbCggdmFsdWUgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHQvLyBQcm9jZXNzIHRoZSBtYW51YWwgb3B0aW9ucy5cblx0XHRpZiAoICdtYW51YWxfb3B0aW9ucycgaW4gZmllbGRTdGF0ZSApIHtcblx0XHRcdGNvbnN0IHJhdyA9IGZpZWxkU3RhdGVbICdtYW51YWxfb3B0aW9ucycgXTtcblxuXHRcdFx0aWYgKCAhIHJhdyApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCAkcmF3SW5wdXQgPSBmaWVsZFdyYXBwZXIuZmluZCggJy5tYW51YWxfb3B0aW9ucycgKTtcblxuXHRcdFx0JHJhd0lucHV0LnZhbCggcmF3ICk7XG5cblx0XHRcdGNvbnN0IG1hbnVhbE9wdGlvbnMgPSBKU09OLnBhcnNlKCBkZWNvZGVVUklDb21wb25lbnQoIHJhdyApICk7XG5cblx0XHRcdGlmICggISBtYW51YWxPcHRpb25zICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHRhYmxlSWRlbnRpZmllciA9ICRyYXdJbnB1dC5hdHRyKCAnZGF0YS10YWJsZScgKTtcblx0XHRcdGNvbnN0IHJvd1RlbXBsYXRlSWQgICA9ICRyYXdJbnB1dC5hdHRyKCAnZGF0YS10bXBsJyApO1xuXG5cdFx0XHQvLyBCYWlsIG91dCBpZiBubyB0bXBsIGZvdW5kIGZvciB0aGUgdHlwZS5cblx0XHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgcm93VGVtcGxhdGVJZCApLmxlbmd0aCApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBmaWVsZElkZW50aWZpZXIgPSAnLndjYXBmLWZvcm0tZmllbGQnO1xuXHRcdFx0Y29uc3Qgcm93c0lkZW50aWZpZXIgID0gJy5maWVsZC10YWJsZS1ib2R5LXJvd3MnO1xuXHRcdFx0Y29uc3Qgcm93SWRlbnRpZmllciAgID0gJy5yb3ctaXRlbSc7XG5cblx0XHRcdGNvbnN0ICRmaWVsZCA9IGZpZWxkV3JhcHBlci5maW5kKCBmaWVsZElkZW50aWZpZXIgKTtcblx0XHRcdGNvbnN0ICR0YWJsZSA9ICRmaWVsZC5maW5kKCB0YWJsZUlkZW50aWZpZXIgKTtcblx0XHRcdGNvbnN0ICRyb3dzICA9ICR0YWJsZS5maW5kKCByb3dzSWRlbnRpZmllciApO1xuXG5cdFx0XHQkLmVhY2goIG1hbnVhbE9wdGlvbnMsIGZ1bmN0aW9uKCBpLCBvcHRpb24gKSB7XG5cdFx0XHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIHJvd1RlbXBsYXRlSWQgKTtcblxuXHRcdFx0XHRsZXQgcm93RGVmYXVsdE9wdGlvbnMgPSB7fTtcblxuXHRcdFx0XHRpZiAoICcubWFudWFsLW9wdGlvbnMtdGFibGUnID09PSB0YWJsZUlkZW50aWZpZXIgKSB7XG5cdFx0XHRcdFx0cm93RGVmYXVsdE9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0XHQndmFsdWUnOiAnJyxcblx0XHRcdFx0XHRcdCdsYWJlbCc6ICcnLFxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCByb3dEZWZhdWx0T3B0aW9ucyApO1xuXG5cdFx0XHRcdCRyb3dzLmFwcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdFx0XHRjb25zdCAkbGFzdFJvdyA9ICRyb3dzLmZpbmQoIHJvd0lkZW50aWZpZXIgKS5sYXN0KCk7XG5cblx0XHRcdFx0JGxhc3RSb3cuZmluZCggJ1tkYXRhLW5hbWVdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdGNvbnN0IG5hbWUgID0gJHRoaXMuYXR0ciggJ2RhdGEtbmFtZScgKTtcblx0XHRcdFx0XHRjb25zdCB2YWx1ZSA9IG9wdGlvblsgbmFtZSBdO1xuXG5cdFx0XHRcdFx0JHRoaXMudmFsKCB2YWx1ZSApO1xuXG5cdFx0XHRcdFx0aWYgKCAnaW1hZ2VfdXJsJyA9PT0gbmFtZSAmJiB2YWx1ZSApIHtcblx0XHRcdFx0XHRcdCRsYXN0Um93LmZpbmQoICcud3AtaW1hZ2UtcGlja2VyLWNvbnRhaW5lcicgKS5hZGRDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHRcdFx0XHRcdCRsYXN0Um93LmZpbmQoICdpbWcnICkuYXR0ciggJ3NyYycsIHZhbHVlICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdCR0YWJsZS5hZGRDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXG5cdFx0XHRmaWVsZFdyYXBwZXIudHJpZ2dlciggJ25ld19vcHRpb25fYWRkZWQnLCBbICRmaWVsZCBdICk7XG5cdFx0fVxuXHR9XG5cblx0JCggJyNhdmFpbGFibGVfZmllbGRzJyApLm9uKCAnY2hhbmdlJywgJ1tuYW1lPVwiX2FjdGl2ZV9maWVsZFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzICAgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgX2ZpZWxkVHlwZSA9ICR0aGlzLnZhbCgpO1xuXHRcdGNvbnN0IGZpZWxkTmFtZSAgPSAkdGhpcy5hdHRyKCAnZGF0YS1maWVsZC1uYW1lJyApO1xuXG5cdFx0aWYgKCAhIF9maWVsZFR5cGUgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZmllbGRUeXBlID0gJ3djYXBmLWZvcm0tZmllbGQtJyArIF9maWVsZFR5cGU7XG5cblx0XHQvLyBCYWlsIG91dCBpZiBubyB0bXBsIGZvdW5kIGZvciB0aGUgdHlwZS5cblx0XHRpZiAoICEgalF1ZXJ5KCAnI3RtcGwtJyArIGZpZWxkVHlwZSApLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSAgICAgICAgID0gd3AudGVtcGxhdGUoIGZpZWxkVHlwZSApO1xuXHRcdGNvbnN0IHJlbmRlcmVkICAgICAgICAgPSB0ZW1wbGF0ZSgpO1xuXHRcdGNvbnN0IGZpZWxkRGF0YVdyYXBwZXIgPSBmaWVsZFdyYXBwZXIuZmluZCggJyNmaWVsZF9kYXRhJyApO1xuXHRcdGNvbnN0IGZpZWxkTmFtZVdyYXBwZXIgPSBmaWVsZFdyYXBwZXIuZmluZCggJy5wb3N0Ym94LWhlYWRlciBoMicgKTtcblx0XHRjb25zdCBmaWVsZEluc2lkZSAgICAgID0gZmllbGRXcmFwcGVyLmZpbmQoICcuaW5zaWRlJyApO1xuXG5cdFx0ZmllbGRXcmFwcGVyLnJlbW92ZUNsYXNzKCAnaGlkZGVuJyApO1xuXG5cdFx0ZmllbGREYXRhV3JhcHBlci5hdHRyKCAnZGF0YS1maWVsZC10eXBlJywgX2ZpZWxkVHlwZSApO1xuXHRcdGZpZWxkTmFtZVdyYXBwZXIuaHRtbCggZmllbGROYW1lICk7XG5cdFx0ZmllbGRJbnNpZGUuaHRtbCggcmVuZGVyZWQgKTtcblxuXHRcdC8vIElmIGFscmVhZHkgZm91bmQgdGhlIGZpZWxkIHN0YXRlIHRoZW4gYXBwbHkgaXQsIG90aGVyd2lzZSBzdG9yZSBpdC5cblx0XHRpZiAoIF9maWVsZFR5cGUgaW4gZmllbGRTdGF0ZXMgKSB7XG5cdFx0XHRhcHBseUZpZWxkU3RhdGUoIF9maWVsZFR5cGUgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3RvcmVGaWVsZFN0YXRlKCk7XG5cdFx0fVxuXG5cdFx0ZmllbGRXcmFwcGVyLnRyaWdnZXIoICdmaWVsZF9hZGRlZCcgKTtcblxuXHRcdGZpZWxkV3JhcHBlci5maW5kKCAnW25hbWVdJyApLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRzdG9yZUZpZWxkU3RhdGUoKTtcblx0XHR9ICk7XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBNYW51YWwgT3B0aW9ucycgdGFibGUgZnVuY3Rpb24uXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG4vKipcbiAqIEBwYXJhbSB0YWJsZUlkZW50aWZpZXJcbiAqIEBwYXJhbSB2YWx1ZUlkZW50aWZpZXJcbiAqIEBwYXJhbSByb3dUZW1wbGF0ZUlkXG4gKiBAcGFyYW0gcm93RGVmYXVsdE9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gaW5pdE1hbnVhbE9wdGlvbnNUYWJsZSggdGFibGVJZGVudGlmaWVyLCB2YWx1ZUlkZW50aWZpZXIsIHJvd1RlbXBsYXRlSWQsIHJvd0RlZmF1bHRPcHRpb25zID0ge30gKSB7XG5cdGNvbnN0ICQgPSBqUXVlcnk7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblxuXHRjb25zdCBmaWVsZElkZW50aWZpZXIgPSAnLndjYXBmLWZvcm0tZmllbGQnO1xuXHRjb25zdCByb3dzSWRlbnRpZmllciAgPSAnLmZpZWxkLXRhYmxlLWJvZHktcm93cyc7XG5cdGNvbnN0IHJvd0lkZW50aWZpZXIgICA9ICcucm93LWl0ZW0nO1xuXG5cdGZ1bmN0aW9uIGluaXRTb3J0YWJsZVRhYmxlKCAkc2VsZWN0b3IgKSB7XG5cdFx0JHNlbGVjdG9yLnNvcnRhYmxlKCB7XG5cdFx0XHRvcGFjaXR5OiAwLjgsXG5cdFx0XHRyZXZlcnQ6IGZhbHNlLFxuXHRcdFx0Y3Vyc29yOiAnbW92ZScsXG5cdFx0XHRheGlzOiAneScsXG5cdFx0XHRoYW5kbGU6ICcubW92ZS1vcHRpb25zLWhhbmRsZXInLFxuXHRcdFx0cGxhY2Vob2xkZXI6ICd3aWRnZXQtcGxhY2Vob2xkZXInLFxuXHRcdFx0dXBkYXRlOiBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkID0gJCggZS50YXJnZXQgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRcdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHRcdFx0fVxuXHRcdH0gKS5kaXNhYmxlU2VsZWN0aW9uKCk7XG5cdH1cblxuXHRjb25zdCB0YWJsZVJvd3NJZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAnICsgcm93c0lkZW50aWZpZXI7XG5cblx0Ly8gSW5pdCB0aGUgc29ydGFibGUgdGFibGUgYWZ0ZXIgcGFnZSBsb2Fkcy5cblx0aW5pdFNvcnRhYmxlVGFibGUoIGZpZWxkV3JhcHBlci5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkgKTtcblxuXHQvLyBJbml0IHRoZSBzb3J0YWJsZSB0YWJsZSBhZnRlciB0aGUgZmllbGQgaXMgYWRkZWQuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0aW5pdFNvcnRhYmxlVGFibGUoICQoIGZpZWxkV3JhcHBlci5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkgKSApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gdHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApIHtcblx0XHRjb25zdCAkdmFsdWVIb2xkZXIgPSAkZmllbGQuZmluZCggdmFsdWVJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgICAgID0gJGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKTtcblx0XHRjb25zdCBfcm93cyAgICAgICAgPSBbXTtcblxuXHRcdCRyb3dzLmZpbmQoICcucm93LWl0ZW0nICkuZWFjaCggZnVuY3Rpb24oIGksIF9pdGVtICkge1xuXHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCBfaXRlbSApO1xuXHRcdFx0Y29uc3Qgb2JqICAgPSB7fTtcblxuXHRcdFx0JGl0ZW0uZmluZCggJ1tkYXRhLW5hbWVdJyApLmVhY2goIGZ1bmN0aW9uKCBmaWVsZEluZGV4LCBmaWVsZCApIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkID0gJCggZmllbGQgKTtcblx0XHRcdFx0Y29uc3QgbmFtZSAgID0gJGZpZWxkLmF0dHIoICdkYXRhLW5hbWUnICk7XG5cblx0XHRcdFx0b2JqWyBuYW1lIF0gPSAkZmllbGQudmFsKCk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdF9yb3dzLnB1c2goIG9iaiApO1xuXHRcdH0gKTtcblxuXHRcdGNvbnN0IHJhd1ZhbHVlcyA9IGVuY29kZVVSSUNvbXBvbmVudCggSlNPTi5zdHJpbmdpZnkoIF9yb3dzICkgKTtcblx0XHQkdmFsdWVIb2xkZXIudmFsKCByYXdWYWx1ZXMgKS50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gdHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICkge1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggdGFibGVJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgdGFibGVSb3dzICAgICA9ICRmaWVsZC5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkuY2hpbGRyZW4oKTtcblxuXHRcdGlmICggMiA+IHRhYmxlUm93cy5sZW5ndGggKSB7XG5cdFx0XHQkb3B0aW9uc1RhYmxlLnJlbW92ZUNsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmVtb3ZlIE9wdGlvblxuXHRjb25zdCByZW1vdmVCdG5JZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAucmVtb3ZlLW9wdGlvbic7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnY2xpY2snLCByZW1vdmVCdG5JZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkaXRlbSAgPSAkKCB0aGlzICkuY2xvc2VzdCggcm93SWRlbnRpZmllciApO1xuXHRcdGNvbnN0ICRmaWVsZCA9ICRpdGVtLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICk7XG5cblx0XHQkaXRlbS5yZW1vdmUoKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIENsZWFyIEFsbCBPcHRpb25zXG5cdGNvbnN0IGNsZWFyT3B0aW9uc0J0bklkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnIC5jbGVhci1vcHRpb25zJztcblxuXHRmaWVsZFdyYXBwZXIub24oICdjbGljaycsIGNsZWFyT3B0aW9uc0J0bklkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdCRmaWVsZC5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkuZW1wdHkoKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApO1xuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIEFkZCBOZXcgT3B0aW9uXG5cdGNvbnN0IGFkZE9wdGlvbkJ0bklkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnIC5hZGQtb3B0aW9uJztcblxuXHRmaWVsZFdyYXBwZXIub24oICdjbGljaycsIGFkZE9wdGlvbkJ0bklkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgcm93VGVtcGxhdGVJZCApLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCByb3dUZW1wbGF0ZUlkICk7XG5cdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSggcm93RGVmYXVsdE9wdGlvbnMgKTtcblx0XHRjb25zdCAkdGFibGUgICA9ICRmaWVsZC5maW5kKCB0YWJsZUlkZW50aWZpZXIgKTtcblx0XHRjb25zdCAkcm93cyAgICA9ICRmaWVsZC5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICk7XG5cblx0XHQkcm93cy5hcHBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cblx0XHRmaWVsZFdyYXBwZXIudHJpZ2dlciggJ25ld19vcHRpb25fYWRkZWQnLCBbICRmaWVsZCBdICk7XG5cblx0XHRpZiAoICEgJHRhYmxlLmhhc0NsYXNzKCAnaGFzLW9wdGlvbnMnICkgKSB7XG5cdFx0XHQkdGFibGUuYWRkQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH0gKTtcblxuXHQvLyBUcmlnZ2VyIG9wdGlvbnMgY2hhbmdlIHdoZW4gdGhlIHRleHQgZmllbGRzIGdldCBjaGFuZ2VkLlxuXHRjb25zdCB0ZXh0RmllbGRzSWRlbnRpZmllciA9IHRhYmxlUm93c0lkZW50aWZpZXIgKyAnIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJztcblxuXHRmaWVsZFdyYXBwZXIub24oICdpbnB1dCcsIHRleHRGaWVsZHNJZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBUcmlnZ2VyIG9wdGlvbnMgY2hhbmdlIHdoZW4gdGhlIHNlbGVjdCBmaWVsZHMgZ2V0IGNoYW5nZWQuXG5cdGxldCBzZWxlY3RGaWVsZHNJZGVudGlmaWVyID0gdGFibGVSb3dzSWRlbnRpZmllciArICcgc2VsZWN0JztcblxuXHRmaWVsZFdyYXBwZXIub24oICdjaGFuZ2UnLCBzZWxlY3RGaWVsZHNJZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBUcmlnZ2VyIG9wdGlvbnMgY2hhbmdlIHdoZW4gdmFsdWUgaXMgYWRkZWQgZnJvbSBtb2RhbC5cblx0ZmllbGRXcmFwcGVyLm9uKCAndHJpZ2dlcl9vcHRpb25zX3RhYmxlJywgZnVuY3Rpb24oIGUsIHRhYmxlSWQsICRmaWVsZCApIHtcblx0XHRpZiAoIHRhYmxlSWQgPT09IHRhYmxlSWRlbnRpZmllciApIHtcblx0XHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0XHR9XG5cdH0gKTtcblxufVxuIiwiLyoqXG4gKiBUaGUgbnVtYmVyIHVpIG9wdGlvbnMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0LyoqXG5cdCAqIFRvZ2dsZSBkaXNhYmxlZCBhdHRyaWJ1dGUgb2YgbWluLXZhbHVlIGZpZWxkIGZvciBudW1iZXIgdHlwZS5cblx0ICovXG5cdGZ1bmN0aW9uIHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICRlbG0gKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICA9ICRlbG0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICR0ZXh0RmllbGQgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWUgaW5wdXRbdHlwZT1cInRleHRcIl0nICk7XG5cblx0XHRpZiAoICRlbG0uaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdCR0ZXh0RmllbGQuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkdGV4dEZpZWxkLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHR9XG5cdH1cblxuXHRmaWVsZFdyYXBwZXIub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdGZpZWxkV3JhcHBlci5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0dG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJHRoaXMgKTtcblx0XHR9ICk7XG5cdH0gKTtcblxuXHRmaWVsZFdyYXBwZXIub24oXG5cdFx0J2NsaWNrJyxcblx0XHQnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fVxuXHQpO1xuXG5cdC8qKlxuXHQgKiBUb2dnbGUgZGlzYWJsZWQgYXR0cmlidXRlIG9mIG1heC12YWx1ZSBmaWVsZCBmb3IgbnVtYmVyIHR5cGUuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkZWxtICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkdGV4dEZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXG5cdFx0aWYgKCAkZWxtLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHQkdGV4dEZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHRleHRGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHRmaWVsZFdyYXBwZXIuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fSApO1xuXHR9ICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKFxuXHRcdCdjbGljaycsXG5cdFx0Jy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0XHR0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHRcdH1cblx0KTtcblxufSApO1xuIiwiLyoqXG4gKiBUaGUgcHJvZHVjdCBzdGF0dXMgZmllbGQuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXG5cdGNvbnN0IHRhYmxlSWRlbnRpZmllciA9ICcucHJvZHVjdC1zdGF0dXMtb3B0aW9ucy10YWJsZSc7XG5cdGNvbnN0IHZhbHVlSWRlbnRpZmllciA9ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcHJvZHVjdF9zdGF0dXNfb3B0aW9ucyBpbnB1dCc7XG5cdGNvbnN0IHJvd1RlbXBsYXRlSWQgICA9ICd3Y2FwZi1wcm9kdWN0LXN0YXR1cy1vcHRpb24nO1xuXG5cdGluaXRNYW51YWxPcHRpb25zVGFibGUoIHRhYmxlSWRlbnRpZmllciwgdmFsdWVJZGVudGlmaWVyLCByb3dUZW1wbGF0ZUlkICk7XG5cbn0gKTtcbiIsIi8qKlxuICogVGF4b25vbXkncyBkZWZhdWx0IGZpZWxkIGtleS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10YXhvbm9teSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJGZpZWxkS2V5ID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZmllbGRfa2V5JyApO1xuXG5cdFx0XHQvLyBQcmVwZW5kIGRhc2ggdG8gYXZvaWQgY29uZmxpY3Rpbmcgd2l0aCB0aGUgcmVnaXN0ZXJlZCB0YXhvbm9taWVzLlxuXHRcdFx0aWYgKCB2YWx1ZSApIHtcblx0XHRcdFx0dmFsdWUgPSAnXycgKyB2YWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0JGZpZWxkS2V5LmZpbmQoICdpbnB1dFt0eXBlPVwidGV4dFwiXScgKS52YWwoIHZhbHVlICk7XG5cdFx0fVxuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIHRvZ2dsZSB2aXNpYmlsaXR5IHNjcmlwdHMuXG4gKlxuICogTk9URTogVGhlc2Ugc2NyaXB0cyBtdXN0IGJlIGxvY2F0ZWQgYXQgdGhlIHZlcnkgYm90dG9tIG9mIHRoZSBjb21iaW5lZCBzY3JpcHRzLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdGNvbnN0IGRlcGVuZGFudERhdGEgPSBbXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXZhbHVlX3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5pbnB1dC10eXBlLXRleHQtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0ZXh0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5pbnB1dC10eXBlLW51bWJlci1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ251bWJlcicgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS1kYXRlLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnZGF0ZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcudmFsdWUtZGVjaW1hbC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ251bWJlcicgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcXVlcnlfdHlwZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY2hlY2tib3gnLCAnbXVsdGktc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhZGlvJywgJ3NlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnc2VsZWN0JywgJ211bHRpLXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaGllcmFyY2hpY2FsLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY2hlY2tib3gnLCAncmFkaW8nLCAnc2VsZWN0JywgJ211bHRpLXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2NhdGVnb3J5X2ltYWdlcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW1hZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9tdWx0aXBsZV9maWx0ZXInLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2xhYmVsJywgJ2NvbG9yJywgJ2ltYWdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5jb2x1bW4tZ3JvdXAtY3VzdG9tX2FwcGVhcmFuY2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NvbG9yJywgJ2ltYWdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWhpZXJhcmNoaWNhbCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfaGllcmFyY2h5X2FjY29yZGlvbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfZGVjaW1hbCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV9kZWNpbWFsX3BsYWNlcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZ2V0X29wdGlvbnMgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuY29sdW1uLWdyb3VwLW1ldGFfa2V5X21hbnVhbF9vcHRpb25zJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdtYW51YWxfZW50cnknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2xpZGVyX2Rpc3BsYXlfdmFsdWVzX2FzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsaWduX3ZhbHVlc19hdF90aGVfZW5kJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NlbGVjdF9hbGxfaXRlbXNfbGFiZWwnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3VzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXInLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2hvd19jb3VudCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JywgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfaGlkZV9lbXB0eScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JywgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItZGVjaW1hbC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NsaWRlcicsICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnLCAncmFuZ2VfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZ2V0X29wdGlvbnMgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLWF1dG9tYXRpYy1vcHRpb25zJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdhdXRvbWF0aWNhbGx5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItbWFudWFsLW9wdGlvbnMtdGFibGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ21hbnVhbF9lbnRyeScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGF0ZV9kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5kYXRlLXRvLXVpLW9wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2lucHV0X2RhdGVfcmFuZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRhdGVfZm9ybWF0Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbnB1dF9kYXRlJywgJ2lucHV0X2RhdGVfcmFuZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3F1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2NoZWNrYm94JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9zZWxlY3RfYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9yYWRpbycsICd0aW1lX3BlcmlvZF9zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3VzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX3NlbGVjdCcsICd0aW1lX3BlcmlvZF9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfZW5hYmxlX211bHRpcGxlX2ZpbHRlcicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3Nob3dfY291bnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2NoZWNrYm94JywgJ3RpbWVfcGVyaW9kX3JhZGlvJywgJ3RpbWVfcGVyaW9kX3NlbGVjdCcsICd0aW1lX3BlcmlvZF9tdWx0aXNlbGVjdCcsICd0aW1lX3BlcmlvZF9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfaGlkZV9lbXB0eScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfY2hlY2tib3gnLCAndGltZV9wZXJpb2RfcmFkaW8nLCAndGltZV9wZXJpb2Rfc2VsZWN0JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JywgJ3RpbWVfcGVyaW9kX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF91c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9zb2Z0X2xpbWl0IGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNvZnRfbGltaXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2VuYWJsZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGF4b25vbXkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtY3VzdG9tLXRheG9ub215IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1ldGFfa2V5IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBvc3RfcHJvcGVydHkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfb3B0aW9ucyBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBhcmVudF90ZXJtJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjaGlsZCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfdmFsdWVzX2J5X2lkJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbmNsdWRlJywgJ2V4Y2x1ZGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9hY2NvcmRpb24gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWNjb3JkaW9uX2RlZmF1bHRfc3RhdGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3llcycgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2NhdGVnb3J5X2ltYWdlcyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNob3dfaWZfZW1wdHkgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW1wdHlfZmlsdGVyX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdF07XG5cblx0ZnVuY3Rpb24gX2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgPSBjdXJyZW50U2VsZWN0b3IuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0IGhhbmRsZXIgICAgID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0Y29uc3QgaGFuZGxlclR5cGUgPSBkYXRhWyAnaGFuZGxlclR5cGUnIF07XG5cdFx0Y29uc3QgZGVwZW5kYW50ICAgPSBkYXRhWyAnZGVwZW5kYW50JyBdO1xuXG5cdFx0bGV0IF92YWx1ZSA9IHZhbHVlO1xuXG5cdFx0aWYgKCAnY2hlY2tib3gnID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9IGN1cnJlbnRTZWxlY3Rvci5pcyggJzpjaGVja2VkJyApID8gJzEnIDogJzAnO1xuXHRcdH1cblxuXHRcdGlmICggJ3JhZGlvJyA9PT0gaGFuZGxlclR5cGUgKSB7XG5cdFx0XHRfdmFsdWUgPSAkZmllbGQuZmluZCggaGFuZGxlciArICc6Y2hlY2tlZCcgKS52YWwoKTtcblx0XHR9XG5cblx0XHQkLmVhY2goIGRlcGVuZGFudCwgZnVuY3Rpb24oIGlkLCBkICkge1xuXHRcdFx0Y29uc3QgJHNlbGVjdG9yICAgPSAkZmllbGQuZmluZCggZFsgJ3NlbGVjdG9yJyBdICk7XG5cdFx0XHRjb25zdCB2YWxpZFZhbHVlcyA9IGRbICd2YWx1ZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZFZhbHVlcy5pbmNsdWRlcyggX3ZhbHVlICkgKSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc2VsZWN0b3IuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBbIGhhbmRsZXIsIF92YWx1ZSwgJGZpZWxkIF0gKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0aWYgKCBudWxsID09PSBjdXJyZW50U2VsZWN0b3IgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyICA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdFx0Y29uc3QgJGhhbmRsZXIgPSAkKCBoYW5kbGVyICk7XG5cblx0XHRcdCQuZWFjaCggJGhhbmRsZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IF92YWx1ZSA9IF90aGlzLnZhbCgpO1xuXHRcdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgX3RoaXMsIF92YWx1ZSApO1xuXHRcdFx0fSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNldHVwRmllbGQoIGluaXRhbCA9IGZhbHNlICkge1xuXHRcdCQuZWFjaCggZGVwZW5kYW50RGF0YSwgZnVuY3Rpb24oIGksIGRhdGEgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0XHRjb25zdCBldmVudCAgID0gZGF0YVsgJ2V2ZW50JyBdO1xuXG5cdFx0XHRoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBudWxsLCBudWxsICk7XG5cblx0XHRcdGlmICggaW5pdGFsICkge1xuXHRcdFx0XHRmaWVsZFdyYXBwZXIub24oIGV2ZW50LCBoYW5kbGVyLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0Y29uc3QgX3ZhbHVlID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHRcdGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIF90aGlzLCBfdmFsdWUgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGlmICggISAkKCBmaWVsZFdyYXBwZXIgKS5oYXNDbGFzcyggJ2xvYWRlZCcgKSApIHtcblx0XHRcdFx0XHQkKCBmaWVsZFdyYXBwZXIgKS5hZGRDbGFzcyggJ2xvYWRlZCcgKTtcblxuXHRcdFx0XHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnZmllbGRfYWRkZWQnICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRzZXR1cEZpZWxkKCB0cnVlICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHQvLyBUb2dnbGUgdGhlIHZpc2liaWxpdHkgb2Ygc3ViZmllbGRzLlxuXHRcdHNldHVwRmllbGQoKTtcblx0fSApO1xuXG59ICk7XG4iXX0=
