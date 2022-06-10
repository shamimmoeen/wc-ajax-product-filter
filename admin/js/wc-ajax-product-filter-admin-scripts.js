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
  var fieldInput = '[name]:not(.manual_options):not(.field_key)';
  var fieldStates = {};
  var typesHavingSeparateFieldKeys = {
    'attribute': '.wcapf-form-sub-field-taxonomy select',
    'custom-taxonomy': '.wcapf-form-sub-field-taxonomy select',
    'post-meta': '.wcapf-form-sub-field-meta_key select',
    'post-property': '.wcapf-form-sub-field-post_property select'
  };

  function storeFieldState() {
    var fieldType = fieldWrapper.find('#field_data').attr('data-field-type');

    if (!fieldType) {
      return;
    }

    var fieldValues = {};
    fieldWrapper.find(fieldInput).each(function () {
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
    }); // Handle filter keys.

    if (fieldWrapper.find('.field_key').length) {
      if (fieldType in typesHavingSeparateFieldKeys) {
        var $fieldKeyInput = fieldWrapper.find(typesHavingSeparateFieldKeys[fieldType]);
        var fieldKeyFor = $fieldKeyInput.val();
        var fieldKeys = {};

        if (fieldKeyFor) {
          fieldKeys[fieldKeyFor] = fieldKeyFor;
        } else {
          fieldKeys['default'] = fieldWrapper.find('.field_key').val();
        }

        fieldValues['field_key'] = fieldKeys;
      } else {
        fieldValues['field_key'] = fieldWrapper.find('.field_key').val();
      }
    } // Handle manual options.


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

    if ($elm.hasClass('field_key')) {
      if (fieldType in typesHavingSeparateFieldKeys) {
        var $fieldKeyInput = fieldWrapper.find(typesHavingSeparateFieldKeys[fieldType]);
        var fieldKeyFor = $fieldKeyInput.val();

        if (fieldKeyFor) {
          fieldState['field_key'][fieldKeyFor] = value;
        } else {
          fieldState['field_key']['default'] = value;
        }
      } else {
        fieldState['field_key'] = fieldWrapper.find('.field_key').val();
      }
    } else if ($elm.hasClass('manual_options')) {
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
    fieldWrapper.find(fieldInput).each(function () {
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
    }); // Process filter keys.

    var $filterKey = fieldWrapper.find('.field_key');

    if ($filterKey.length) {
      if (fieldType in typesHavingSeparateFieldKeys) {
        var $fieldKeyInput = fieldWrapper.find(typesHavingSeparateFieldKeys[fieldType]);
        var fieldKeyFor = $fieldKeyInput.val();

        if (fieldKeyFor) {
          $filterKey.val(fieldState['field_key'][fieldKeyFor]);
        } else {
          $filterKey.val(fieldState['field_key']['default']);
        }
      } else {
        $filterKey.val(fieldState['field_key']);
      }
    } // Process the manual options.


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
  }); // Update the filter key.

  fieldWrapper.on('after_toggle_request', function (e, handler, fieldKeyFor, $field) {
    if (Object.values(typesHavingSeparateFieldKeys).includes(handler)) {
      var fieldType = $field.closest('[data-field-type]').attr('data-field-type');
      var fieldState = fieldStates[fieldType];
      var fieldKeys = fieldState['field_key'];
      var $fieldKey = $field.find('.wcapf-form-sub-field-field_key input[type="text"]');
      var defaultKey = $fieldKey.attr('data-default-field-key');

      var _fieldKey;

      if (!fieldKeyFor) {
        fieldKeyFor = 'default';
        _fieldKey = defaultKey;
      } else {
        // Prepend dash to avoid conflicting with the registered taxonomies and post types.
        _fieldKey = '_' + fieldKeyFor;
      }

      var fieldKey;

      if (fieldKeyFor in fieldKeys) {
        fieldKey = fieldKeys[fieldKeyFor];
      } else {
        fieldKey = _fieldKey;
      }

      $fieldKey.val(fieldKey).trigger('change');
    }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbS1hcHBlYXJhbmNlLWZpZWxkcy5qcyIsImRpc3BsYXktdHlwZS1maWVsZHMuanMiLCJmaWVsZC1tZXRhLWJveC5qcyIsIm1hbnVhbC1vcHRpb25zLXRhYmxlLmpzIiwibnVtYmVyLXVpLW9wdGlvbnMuanMiLCJwcm9kdWN0LXN0YXR1cy10YWJsZS5qcyIsInRvZ2dsZVZpc2liaWxpdHkuanMiXSwibmFtZXMiOlsialF1ZXJ5IiwiZG9jdW1lbnQiLCJyZWFkeSIsIiQiLCJmaWVsZFdyYXBwZXIiLCJvbiIsImUiLCJoYW5kbGVyIiwidmFsdWUiLCIkZmllbGQiLCIkcXVlcnlUeXBlIiwiZmluZCIsInZhbGlkRGlzcGxheVR5cGVzIiwiaW5jbHVkZXMiLCIkbXVsdGlwbGVGaWx0ZXIiLCJpcyIsInNob3ciLCJoaWRlIiwiJGRpc3BsYXlUeXBlIiwiZGlzcGxheVR5cGUiLCJ2YWwiLCIkbm9SZXN1bHRzIiwiJGFsbEl0ZW1zTGFiZWwiLCJ1c2VDaG9zZW4iLCJmaWVsZElucHV0IiwiZmllbGRTdGF0ZXMiLCJ0eXBlc0hhdmluZ1NlcGFyYXRlRmllbGRLZXlzIiwic3RvcmVGaWVsZFN0YXRlIiwiZmllbGRUeXBlIiwiYXR0ciIsImZpZWxkVmFsdWVzIiwiZWFjaCIsIiRpbnB1dCIsInR5cGUiLCJuYW1lIiwibGVuZ3RoIiwiJGZpZWxkS2V5SW5wdXQiLCJmaWVsZEtleUZvciIsImZpZWxkS2V5cyIsIm1hbnVhbE9wdGlvbnMiLCJ1cGRhdGVGaWVsZFN0YXRlIiwiJGVsbSIsImZpZWxkU3RhdGUiLCJoYXNDbGFzcyIsIm1hbnVhbF9vcHRpb25zIiwiJHRoaXMiLCJhcHBseUZpZWxkU3RhdGUiLCJyZW1vdmVBdHRyIiwiJGZpbHRlcktleSIsInJhd09wdGlvbnMiLCJpbnB1dE5hbWUiLCJyYXciLCIkcmF3SW5wdXQiLCJKU09OIiwicGFyc2UiLCJkZWNvZGVVUklDb21wb25lbnQiLCJ0YWJsZUlkZW50aWZpZXIiLCJyb3dUZW1wbGF0ZUlkIiwicm93c0lkZW50aWZpZXIiLCJyb3dJZGVudGlmaWVyIiwiJHRhYmxlIiwiJHJvd3MiLCJpIiwib3B0aW9uIiwidGVtcGxhdGUiLCJ3cCIsInJvd0RlZmF1bHRPcHRpb25zIiwicmVuZGVyZWQiLCJhcHBlbmQiLCIkbGFzdFJvdyIsImxhc3QiLCJhZGRDbGFzcyIsInRyaWdnZXIiLCJfZmllbGRUeXBlIiwiZmllbGROYW1lIiwiZmllbGREYXRhV3JhcHBlciIsImZpZWxkTmFtZVdyYXBwZXIiLCJmaWVsZEluc2lkZSIsInJlbW92ZUNsYXNzIiwiaHRtbCIsIk9iamVjdCIsInZhbHVlcyIsImNsb3Nlc3QiLCIkZmllbGRLZXkiLCJkZWZhdWx0S2V5IiwiX2ZpZWxkS2V5IiwiZmllbGRLZXkiLCJpbml0TWFudWFsT3B0aW9uc1RhYmxlIiwidmFsdWVJZGVudGlmaWVyIiwiZmllbGRJZGVudGlmaWVyIiwiaW5pdFNvcnRhYmxlVGFibGUiLCIkc2VsZWN0b3IiLCJzb3J0YWJsZSIsIm9wYWNpdHkiLCJyZXZlcnQiLCJjdXJzb3IiLCJheGlzIiwiaGFuZGxlIiwicGxhY2Vob2xkZXIiLCJ1cGRhdGUiLCJ0YXJnZXQiLCJ0cmlnZ2VyT3B0aW9uc0NoYW5nZSIsImRpc2FibGVTZWxlY3Rpb24iLCJ0YWJsZVJvd3NJZGVudGlmaWVyIiwiJHZhbHVlSG9sZGVyIiwiX3Jvd3MiLCJfaXRlbSIsIiRpdGVtIiwib2JqIiwiZmllbGRJbmRleCIsImZpZWxkIiwicHVzaCIsInJhd1ZhbHVlcyIsImVuY29kZVVSSUNvbXBvbmVudCIsInN0cmluZ2lmeSIsInRyaWdnZXJSZW1vdmVPcHRpb24iLCIkb3B0aW9uc1RhYmxlIiwidGFibGVSb3dzIiwiY2hpbGRyZW4iLCJyZW1vdmVCdG5JZGVudGlmaWVyIiwicmVtb3ZlIiwiY2xlYXJPcHRpb25zQnRuSWRlbnRpZmllciIsImVtcHR5IiwiYWRkT3B0aW9uQnRuSWRlbnRpZmllciIsInRleHRGaWVsZHNJZGVudGlmaWVyIiwic2VsZWN0RmllbGRzSWRlbnRpZmllciIsInRhYmxlSWQiLCJ0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkIiwiJHRleHRGaWVsZCIsInRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQiLCJkZXBlbmRhbnREYXRhIiwiX2hhbmRsZVRvZ2dsZVJlcXVlc3QiLCJkYXRhIiwiY3VycmVudFNlbGVjdG9yIiwiaGFuZGxlclR5cGUiLCJkZXBlbmRhbnQiLCJfdmFsdWUiLCJpZCIsImQiLCJ2YWxpZFZhbHVlcyIsImhhbmRsZVRvZ2dsZVJlcXVlc3QiLCIkaGFuZGxlciIsIl90aGlzIiwic2V0dXBGaWVsZCIsImluaXRhbCIsImV2ZW50Il0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUEsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVDLENBQVYsRUFBYztBQUV2QyxNQUFNQyxZQUFZLEdBQUdELENBQUMsQ0FBRSx1QkFBRixDQUF0QjtBQUVBQyxFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUIsc0JBQWpCLEVBQXlDLFVBQVVDLENBQVYsRUFBYUMsT0FBYixFQUFzQkMsS0FBdEIsRUFBNkJDLE1BQTdCLEVBQXNDO0FBQzlFLFFBQUssZ0RBQWdERixPQUFyRCxFQUErRDtBQUM5RCxVQUFNRyxVQUFVLEdBQVVELE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLGtDQUFiLENBQTFCO0FBQ0EsVUFBTUMsaUJBQWlCLEdBQUcsQ0FBRSxPQUFGLEVBQVcsT0FBWCxFQUFvQixPQUFwQixDQUExQjs7QUFFQSxVQUFLQSxpQkFBaUIsQ0FBQ0MsUUFBbEIsQ0FBNEJMLEtBQTVCLENBQUwsRUFBMkM7QUFDMUMsWUFBTU0sZUFBZSxHQUFHTCxNQUFNLENBQUNFLElBQVAsQ0FBYSxvREFBYixDQUF4Qjs7QUFFQSxZQUFLRyxlQUFlLENBQUNDLEVBQWhCLENBQW9CLFVBQXBCLENBQUwsRUFBd0M7QUFDdkNMLFVBQUFBLFVBQVUsQ0FBQ00sSUFBWDtBQUNBLFNBRkQsTUFFTztBQUNOTixVQUFBQSxVQUFVLENBQUNP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QWYsQ0FBbkI7QUFDQSxTQUpEOztBQU1BLFlBQUssQ0FBRXJJLENBQUMsQ0FBRUMsWUFBRixDQUFELENBQWtCdUMsUUFBbEIsQ0FBNEIsUUFBNUIsQ0FBUCxFQUFnRDtBQUMvQ3hDLFVBQUFBLENBQUMsQ0FBRUMsWUFBRixDQUFELENBQWtCbUUsUUFBbEIsQ0FBNEIsUUFBNUI7QUFFQW5FLFVBQUFBLFlBQVksQ0FBQ29FLE9BQWIsQ0FBc0IsYUFBdEI7QUFDQTtBQUNEO0FBQ0QsS0FuQkQ7QUFvQkE7O0FBRUR1RSxFQUFBQSxVQUFVLENBQUUsSUFBRixDQUFWO0FBRUEzSSxFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUIsYUFBakIsRUFBZ0MsWUFBVztBQUMxQztBQUNBMEksSUFBQUEsVUFBVTtBQUNWLEdBSEQ7QUFLQSxDQXZZRCIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLWFkbWluLXNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIERpc3BsYXkgdHlwZSBmaWVsZHMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkcXVlcnlUeXBlICAgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXF1ZXJ5X3R5cGUnICk7XG5cdFx0XHRjb25zdCB2YWxpZERpc3BsYXlUeXBlcyA9IFsgJ2xhYmVsJywgJ2NvbG9yJywgJ2ltYWdlJyBdO1xuXG5cdFx0XHRpZiAoIHZhbGlkRGlzcGxheVR5cGVzLmluY2x1ZGVzKCB2YWx1ZSApICkge1xuXHRcdFx0XHRjb25zdCAkbXVsdGlwbGVGaWx0ZXIgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfbXVsdGlwbGVfZmlsdGVyIGlucHV0JyApO1xuXG5cdFx0XHRcdGlmICggJG11bHRpcGxlRmlsdGVyLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRcdFx0JHF1ZXJ5VHlwZS5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHF1ZXJ5VHlwZS5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfbXVsdGlwbGVfZmlsdGVyIGlucHV0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRxdWVyeVR5cGUgICAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtcXVlcnlfdHlwZScgKTtcblx0XHRcdGNvbnN0ICRkaXNwbGF5VHlwZSAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlUeXBlICAgICAgID0gJGRpc3BsYXlUeXBlLnZhbCgpO1xuXHRcdFx0Y29uc3QgdmFsaWREaXNwbGF5VHlwZXMgPSBbICdsYWJlbCcsICdjb2xvcicsICdpbWFnZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZERpc3BsYXlUeXBlcy5pbmNsdWRlcyggZGlzcGxheVR5cGUgKSApIHtcblx0XHRcdFx0aWYgKCAnMScgPT09IHZhbHVlICkge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogRGlzcGxheSB0eXBlIGZpZWxkcy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblxuXHQvLyBPdmVycmlkZSBuby1yZXN1bHRzLW1lc3NhZ2UsIGFsbC1pdGVtcy1sYWJlbCBmaWVsZCdzIHRvZ2dsZSB2aXNpYmlsaXR5IHdoZW4gdGV4dCBkaXNwbGF5IHR5cGUgaXMgY2hhbmdlZC5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0XHRjb25zdCAkYWxsSXRlbXNMYWJlbCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRcdGNvbnN0IHVzZUNob3NlbiAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcgKS5pcyggJzpjaGVja2VkJyApO1xuXG5cdFx0XHRpZiAoIHVzZUNob3NlbiAmJiAoICdzZWxlY3QnID09PSB2YWx1ZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgKSApIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAoICdyYWRpbycgPT09IHZhbHVlIHx8ICdzZWxlY3QnID09PSB2YWx1ZSApIHx8ICggJ211bHRpLXNlbGVjdCcgPT09IHZhbHVlICYmIHVzZUNob3NlbiApICkge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gT3ZlcnJpZGUgbm8tcmVzdWx0cy1tZXNzYWdlLCBhbGwtaXRlbXMtbGFiZWwgZmllbGQncyB0b2dnbGUgdmlzaWJpbGl0eSB3aGVuIHRleHQgdXNlIGNob3NlbiBpcyBjaGFuZ2VkLlxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScgKTtcblx0XHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyApO1xuXHRcdFx0Y29uc3QgZGlzcGxheVR5cGUgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoICcxJyA9PT0gdmFsdWUgJiYgKCAnc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgfHwgJ211bHRpLXNlbGVjdCcgPT09IGRpc3BsYXlUeXBlICkgKSB7XG5cdFx0XHRcdCRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChcblx0XHRcdFx0KCAnMScgPT09IHZhbHVlICYmICdtdWx0aS1zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0XHRcdHx8ICggJ3JhZGlvJyA9PT0gZGlzcGxheVR5cGUgfHwgJ3NlbGVjdCcgPT09IGRpc3BsYXlUeXBlIClcblx0XHRcdCkge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogRmllbGQgbWV0YSBib3guXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cdGNvbnN0IGZpZWxkSW5wdXQgICA9ICdbbmFtZV06bm90KC5tYW51YWxfb3B0aW9ucyk6bm90KC5maWVsZF9rZXkpJztcblx0Y29uc3QgZmllbGRTdGF0ZXMgID0ge307XG5cblx0Y29uc3QgdHlwZXNIYXZpbmdTZXBhcmF0ZUZpZWxkS2V5cyA9IHtcblx0XHQnYXR0cmlidXRlJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10YXhvbm9teSBzZWxlY3QnLFxuXHRcdCdjdXN0b20tdGF4b25vbXknOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRheG9ub215IHNlbGVjdCcsXG5cdFx0J3Bvc3QtbWV0YSc6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWV0YV9rZXkgc2VsZWN0Jyxcblx0XHQncG9zdC1wcm9wZXJ0eSc6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcG9zdF9wcm9wZXJ0eSBzZWxlY3QnLFxuXHR9O1xuXG5cdGZ1bmN0aW9uIHN0b3JlRmllbGRTdGF0ZSgpIHtcblx0XHRjb25zdCBmaWVsZFR5cGUgPSBmaWVsZFdyYXBwZXIuZmluZCggJyNmaWVsZF9kYXRhJyApLmF0dHIoICdkYXRhLWZpZWxkLXR5cGUnICk7XG5cblx0XHRpZiAoICEgZmllbGRUeXBlICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZpZWxkVmFsdWVzID0ge307XG5cblx0XHRmaWVsZFdyYXBwZXIuZmluZCggZmllbGRJbnB1dCApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0Y29uc3QgdHlwZSAgID0gJGlucHV0LmF0dHIoICd0eXBlJyApO1xuXHRcdFx0Y29uc3QgbmFtZSAgID0gJGlucHV0LmF0dHIoICduYW1lJyApO1xuXHRcdFx0Y29uc3QgdmFsdWUgID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRpZiAoICdjaGVja2JveCcgPT09IHR5cGUgfHwgJ3JhZGlvJyA9PT0gdHlwZSApIHtcblx0XHRcdFx0aWYgKCAkaW5wdXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdFx0XHRmaWVsZFZhbHVlc1sgbmFtZSBdID0gdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZpZWxkVmFsdWVzWyBuYW1lIF0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHQvLyBIYW5kbGUgZmlsdGVyIGtleXMuXG5cdFx0aWYgKCBmaWVsZFdyYXBwZXIuZmluZCggJy5maWVsZF9rZXknICkubGVuZ3RoICkge1xuXHRcdFx0aWYgKCBmaWVsZFR5cGUgaW4gdHlwZXNIYXZpbmdTZXBhcmF0ZUZpZWxkS2V5cyApIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkS2V5SW5wdXQgPSBmaWVsZFdyYXBwZXIuZmluZCggdHlwZXNIYXZpbmdTZXBhcmF0ZUZpZWxkS2V5c1sgZmllbGRUeXBlIF0gKTtcblx0XHRcdFx0Y29uc3QgZmllbGRLZXlGb3IgICAgPSAkZmllbGRLZXlJbnB1dC52YWwoKTtcblxuXHRcdFx0XHRjb25zdCBmaWVsZEtleXMgPSB7fTtcblxuXHRcdFx0XHRpZiAoIGZpZWxkS2V5Rm9yICkge1xuXHRcdFx0XHRcdGZpZWxkS2V5c1sgZmllbGRLZXlGb3IgXSA9IGZpZWxkS2V5Rm9yO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGZpZWxkS2V5c1sgJ2RlZmF1bHQnIF0gPSBmaWVsZFdyYXBwZXIuZmluZCggJy5maWVsZF9rZXknICkudmFsKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmaWVsZFZhbHVlc1sgJ2ZpZWxkX2tleScgXSA9IGZpZWxkS2V5cztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZpZWxkVmFsdWVzWyAnZmllbGRfa2V5JyBdID0gZmllbGRXcmFwcGVyLmZpbmQoICcuZmllbGRfa2V5JyApLnZhbCgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIEhhbmRsZSBtYW51YWwgb3B0aW9ucy5cblx0XHRjb25zdCBtYW51YWxPcHRpb25zID0ge307XG5cblx0XHRmaWVsZFdyYXBwZXIuZmluZCggJy5tYW51YWxfb3B0aW9ucycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblx0XHRcdGNvbnN0IG5hbWUgICA9ICRpbnB1dC5hdHRyKCAnbmFtZScgKTtcblxuXHRcdFx0bWFudWFsT3B0aW9uc1sgbmFtZSBdID0gJGlucHV0LnZhbCgpO1xuXHRcdH0gKTtcblxuXHRcdGZpZWxkVmFsdWVzWyAnbWFudWFsX29wdGlvbnMnIF0gPSBtYW51YWxPcHRpb25zO1xuXG5cdFx0ZmllbGRTdGF0ZXNbIGZpZWxkVHlwZSBdID0gZmllbGRWYWx1ZXM7XG5cdH1cblxuXHRmdW5jdGlvbiB1cGRhdGVGaWVsZFN0YXRlKCAkZWxtICkge1xuXHRcdGNvbnN0IGZpZWxkVHlwZSAgPSBmaWVsZFdyYXBwZXIuZmluZCggJyNmaWVsZF9kYXRhJyApLmF0dHIoICdkYXRhLWZpZWxkLXR5cGUnICk7XG5cdFx0Y29uc3QgZmllbGRTdGF0ZSA9IGZpZWxkU3RhdGVzWyBmaWVsZFR5cGUgXTtcblxuXHRcdGNvbnN0IG5hbWUgID0gJGVsbS5hdHRyKCAnbmFtZScgKTtcblx0XHRjb25zdCB0eXBlICA9ICRlbG0uYXR0ciggJ3R5cGUnICk7XG5cdFx0Y29uc3QgdmFsdWUgPSAkZWxtLnZhbCgpO1xuXG5cdFx0aWYgKCAkZWxtLmhhc0NsYXNzKCAnZmllbGRfa2V5JyApICkge1xuXHRcdFx0aWYgKCBmaWVsZFR5cGUgaW4gdHlwZXNIYXZpbmdTZXBhcmF0ZUZpZWxkS2V5cyApIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkS2V5SW5wdXQgPSBmaWVsZFdyYXBwZXIuZmluZCggdHlwZXNIYXZpbmdTZXBhcmF0ZUZpZWxkS2V5c1sgZmllbGRUeXBlIF0gKTtcblx0XHRcdFx0Y29uc3QgZmllbGRLZXlGb3IgICAgPSAkZmllbGRLZXlJbnB1dC52YWwoKTtcblxuXHRcdFx0XHRpZiAoIGZpZWxkS2V5Rm9yICkge1xuXHRcdFx0XHRcdGZpZWxkU3RhdGVbICdmaWVsZF9rZXknIF1bIGZpZWxkS2V5Rm9yIF0gPSB2YWx1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRmaWVsZFN0YXRlWyAnZmllbGRfa2V5JyBdWyAnZGVmYXVsdCcgXSA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmaWVsZFN0YXRlWyAnZmllbGRfa2V5JyBdID0gZmllbGRXcmFwcGVyLmZpbmQoICcuZmllbGRfa2V5JyApLnZhbCgpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoICRlbG0uaGFzQ2xhc3MoICdtYW51YWxfb3B0aW9ucycgKSApIHtcblx0XHRcdGNvbnN0IG1hbnVhbF9vcHRpb25zID0gZmllbGRTdGF0ZVsgJ21hbnVhbF9vcHRpb25zJyBdIHx8IHt9O1xuXG5cdFx0XHRtYW51YWxfb3B0aW9uc1sgbmFtZSBdID0gdmFsdWU7XG5cblx0XHRcdGZpZWxkU3RhdGVbICdtYW51YWxfb3B0aW9ucycgXSA9IG1hbnVhbF9vcHRpb25zO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoICdjaGVja2JveCcgPT09IHR5cGUgfHwgJ3JhZGlvJyA9PT0gdHlwZSApIHtcblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gZmllbGRXcmFwcGVyLmZpbmQoICdbbmFtZT1cIicgKyBuYW1lICsgJ1wiXScgKTtcblxuXHRcdFx0XHRpZiAoICRpbnB1dC5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0XHRcdGZpZWxkU3RhdGVbIG5hbWUgXSA9IHZhbHVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGRlbGV0ZSBmaWVsZFN0YXRlWyBuYW1lIF07XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZpZWxkU3RhdGVbIG5hbWUgXSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFN0b3JlIHRoZSBpbml0aWFsIGZpZWxkIHN0YXRlLlxuXHRzdG9yZUZpZWxkU3RhdGUoKTtcblxuXHRmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lXScgKS5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0dXBkYXRlRmllbGRTdGF0ZSggJHRoaXMgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIGFwcGx5RmllbGRTdGF0ZSggZmllbGRUeXBlICkge1xuXHRcdGNvbnN0IGZpZWxkU3RhdGUgPSBmaWVsZFN0YXRlc1sgZmllbGRUeXBlIF07XG5cblx0XHRmaWVsZFdyYXBwZXIuZmluZCggZmllbGRJbnB1dCApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0Y29uc3QgdHlwZSAgID0gJGlucHV0LmF0dHIoICd0eXBlJyApO1xuXHRcdFx0Y29uc3QgbmFtZSAgID0gJGlucHV0LmF0dHIoICduYW1lJyApO1xuXHRcdFx0Y29uc3QgdmFsdWUgID0gZmllbGRTdGF0ZVsgbmFtZSBdO1xuXG5cdFx0XHRpZiAoICdjaGVja2JveCcgPT09IHR5cGUgfHwgJ3JhZGlvJyA9PT0gdHlwZSApIHtcblx0XHRcdFx0aWYgKCBuYW1lIGluIGZpZWxkU3RhdGUgKSB7XG5cdFx0XHRcdFx0Ly8gQWRkICdjaGVja2VkJyBhdHRyaWJ1dGUuXG5cdFx0XHRcdFx0ZmllbGRXcmFwcGVyXG5cdFx0XHRcdFx0XHQuZmluZCggJ1tuYW1lPVwiJyArIG5hbWUgKyAnXCJdW3ZhbHVlPVwiJyArIHZhbHVlICsgJ1wiXScgKVxuXHRcdFx0XHRcdFx0LmF0dHIoICdjaGVja2VkJywgJ2NoZWNrZWQnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gUmVtb3ZlICdjaGVja2VkJyBhdHRyaWJ1dGUuXG5cdFx0XHRcdFx0ZmllbGRXcmFwcGVyLmZpbmQoICdbbmFtZT1cIicgKyBuYW1lICsgJ1wiXScgKS5yZW1vdmVBdHRyKCAnY2hlY2tlZCcgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGlucHV0LnZhbCggdmFsdWUgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHQvLyBQcm9jZXNzIGZpbHRlciBrZXlzLlxuXHRcdGNvbnN0ICRmaWx0ZXJLZXkgPSBmaWVsZFdyYXBwZXIuZmluZCggJy5maWVsZF9rZXknICk7XG5cblx0XHRpZiAoICRmaWx0ZXJLZXkubGVuZ3RoICkge1xuXHRcdFx0aWYgKCBmaWVsZFR5cGUgaW4gdHlwZXNIYXZpbmdTZXBhcmF0ZUZpZWxkS2V5cyApIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkS2V5SW5wdXQgPSBmaWVsZFdyYXBwZXIuZmluZCggdHlwZXNIYXZpbmdTZXBhcmF0ZUZpZWxkS2V5c1sgZmllbGRUeXBlIF0gKTtcblx0XHRcdFx0Y29uc3QgZmllbGRLZXlGb3IgICAgPSAkZmllbGRLZXlJbnB1dC52YWwoKTtcblxuXHRcdFx0XHRpZiAoIGZpZWxkS2V5Rm9yICkge1xuXHRcdFx0XHRcdCRmaWx0ZXJLZXkudmFsKCBmaWVsZFN0YXRlWyAnZmllbGRfa2V5JyBdWyBmaWVsZEtleUZvciBdICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JGZpbHRlcktleS52YWwoIGZpZWxkU3RhdGVbICdmaWVsZF9rZXknIF1bICdkZWZhdWx0JyBdICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRmaWx0ZXJLZXkudmFsKCBmaWVsZFN0YXRlWyAnZmllbGRfa2V5JyBdICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gUHJvY2VzcyB0aGUgbWFudWFsIG9wdGlvbnMuXG5cdFx0aWYgKCAnbWFudWFsX29wdGlvbnMnIGluIGZpZWxkU3RhdGUgKSB7XG5cdFx0XHRjb25zdCByYXdPcHRpb25zID0gZmllbGRTdGF0ZVsgJ21hbnVhbF9vcHRpb25zJyBdO1xuXG5cdFx0XHQkLmVhY2goIHJhd09wdGlvbnMsIGZ1bmN0aW9uKCBpbnB1dE5hbWUsIHJhdyApIHtcblx0XHRcdFx0Y29uc3QgJHJhd0lucHV0ID0gZmllbGRXcmFwcGVyLmZpbmQoICdbbmFtZT1cIicgKyBpbnB1dE5hbWUgKyAnXCJdJyApO1xuXG5cdFx0XHRcdCRyYXdJbnB1dC52YWwoIHJhdyApO1xuXG5cdFx0XHRcdGNvbnN0IG1hbnVhbE9wdGlvbnMgPSBKU09OLnBhcnNlKCBkZWNvZGVVUklDb21wb25lbnQoIHJhdyApICk7XG5cblx0XHRcdFx0aWYgKCAhIG1hbnVhbE9wdGlvbnMubGVuZ3RoICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IHRhYmxlSWRlbnRpZmllciA9ICRyYXdJbnB1dC5hdHRyKCAnZGF0YS10YWJsZScgKTtcblx0XHRcdFx0Y29uc3Qgcm93VGVtcGxhdGVJZCAgID0gJHJhd0lucHV0LmF0dHIoICdkYXRhLXRtcGwnICk7XG5cblx0XHRcdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0XHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgcm93VGVtcGxhdGVJZCApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCByb3dzSWRlbnRpZmllciA9ICcuZmllbGQtdGFibGUtYm9keS1yb3dzJztcblx0XHRcdFx0Y29uc3Qgcm93SWRlbnRpZmllciAgPSAnLnJvdy1pdGVtJztcblxuXHRcdFx0XHRjb25zdCAkdGFibGUgPSBmaWVsZFdyYXBwZXIuZmluZCggdGFibGVJZGVudGlmaWVyICk7XG5cdFx0XHRcdGNvbnN0ICRyb3dzICA9ICR0YWJsZS5maW5kKCByb3dzSWRlbnRpZmllciApO1xuXG5cdFx0XHRcdCQuZWFjaCggbWFudWFsT3B0aW9ucywgZnVuY3Rpb24oIGksIG9wdGlvbiApIHtcblx0XHRcdFx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCByb3dUZW1wbGF0ZUlkICk7XG5cblx0XHRcdFx0XHRsZXQgcm93RGVmYXVsdE9wdGlvbnMgPSB7fTtcblxuXHRcdFx0XHRcdGlmICggJy5tYW51YWwtb3B0aW9ucy10YWJsZScgPT09IHRhYmxlSWRlbnRpZmllciApIHtcblx0XHRcdFx0XHRcdHJvd0RlZmF1bHRPcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0XHQndmFsdWUnOiAnJyxcblx0XHRcdFx0XHRcdFx0J2xhYmVsJzogJycsXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHJvd0RlZmF1bHRPcHRpb25zICk7XG5cblx0XHRcdFx0XHQkcm93cy5hcHBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHRcdFx0XHRjb25zdCAkbGFzdFJvdyA9ICRyb3dzLmZpbmQoIHJvd0lkZW50aWZpZXIgKS5sYXN0KCk7XG5cblx0XHRcdFx0XHQkbGFzdFJvdy5maW5kKCAnW2RhdGEtbmFtZV0nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRcdGNvbnN0IG5hbWUgID0gJHRoaXMuYXR0ciggJ2RhdGEtbmFtZScgKTtcblx0XHRcdFx0XHRcdGNvbnN0IHZhbHVlID0gb3B0aW9uWyBuYW1lIF07XG5cblx0XHRcdFx0XHRcdCR0aGlzLnZhbCggdmFsdWUgKTtcblxuXHRcdFx0XHRcdFx0aWYgKCAnaW1hZ2VfdXJsJyA9PT0gbmFtZSAmJiB2YWx1ZSApIHtcblx0XHRcdFx0XHRcdFx0JGxhc3RSb3cuZmluZCggJy53cC1pbWFnZS1waWNrZXItY29udGFpbmVyJyApLmFkZENsYXNzKCAnYWN0aXZlJyApO1xuXHRcdFx0XHRcdFx0XHQkbGFzdFJvdy5maW5kKCAnaW1nJyApLmF0dHIoICdzcmMnLCB2YWx1ZSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCR0YWJsZS5hZGRDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRjb25zdCAkZmllbGQgPSBmaWVsZFdyYXBwZXIuZmluZCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0XHRmaWVsZFdyYXBwZXIudHJpZ2dlciggJ25ld19vcHRpb25fYWRkZWQnLCBbICRmaWVsZCBdICk7XG5cdFx0fVxuXHR9XG5cblx0JCggJyNhdmFpbGFibGVfZmllbGRzJyApLm9uKCAnY2hhbmdlJywgJ1tuYW1lPVwiX2FjdGl2ZV9maWVsZFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzICAgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgX2ZpZWxkVHlwZSA9ICR0aGlzLnZhbCgpO1xuXHRcdGNvbnN0IGZpZWxkTmFtZSAgPSAkdGhpcy5hdHRyKCAnZGF0YS1maWVsZC1uYW1lJyApO1xuXG5cdFx0aWYgKCAhIF9maWVsZFR5cGUgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZmllbGRUeXBlID0gJ3djYXBmLWZvcm0tZmllbGQtJyArIF9maWVsZFR5cGU7XG5cblx0XHQvLyBCYWlsIG91dCBpZiBubyB0bXBsIGZvdW5kIGZvciB0aGUgdHlwZS5cblx0XHRpZiAoICEgalF1ZXJ5KCAnI3RtcGwtJyArIGZpZWxkVHlwZSApLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSAgICAgICAgID0gd3AudGVtcGxhdGUoIGZpZWxkVHlwZSApO1xuXHRcdGNvbnN0IHJlbmRlcmVkICAgICAgICAgPSB0ZW1wbGF0ZSgpO1xuXHRcdGNvbnN0IGZpZWxkRGF0YVdyYXBwZXIgPSBmaWVsZFdyYXBwZXIuZmluZCggJyNmaWVsZF9kYXRhJyApO1xuXHRcdGNvbnN0IGZpZWxkTmFtZVdyYXBwZXIgPSBmaWVsZFdyYXBwZXIuZmluZCggJy5wb3N0Ym94LWhlYWRlciBoMicgKTtcblx0XHRjb25zdCBmaWVsZEluc2lkZSAgICAgID0gZmllbGRXcmFwcGVyLmZpbmQoICcuaW5zaWRlJyApO1xuXG5cdFx0ZmllbGRXcmFwcGVyLnJlbW92ZUNsYXNzKCAnaGlkZGVuJyApO1xuXG5cdFx0ZmllbGREYXRhV3JhcHBlci5hdHRyKCAnZGF0YS1maWVsZC10eXBlJywgX2ZpZWxkVHlwZSApO1xuXHRcdGZpZWxkTmFtZVdyYXBwZXIuaHRtbCggZmllbGROYW1lICk7XG5cdFx0ZmllbGRJbnNpZGUuaHRtbCggcmVuZGVyZWQgKTtcblxuXHRcdC8vIElmIGFscmVhZHkgZm91bmQgdGhlIGZpZWxkIHN0YXRlIHRoZW4gYXBwbHkgaXQsIG90aGVyd2lzZSBzdG9yZSBpdC5cblx0XHRpZiAoIF9maWVsZFR5cGUgaW4gZmllbGRTdGF0ZXMgKSB7XG5cdFx0XHRhcHBseUZpZWxkU3RhdGUoIF9maWVsZFR5cGUgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3RvcmVGaWVsZFN0YXRlKCk7XG5cdFx0fVxuXG5cdFx0ZmllbGRXcmFwcGVyLnRyaWdnZXIoICdmaWVsZF9hZGRlZCcgKTtcblxuXHRcdGZpZWxkV3JhcHBlci5maW5kKCAnW25hbWVdJyApLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0dXBkYXRlRmllbGRTdGF0ZSggJHRoaXMgKTtcblx0XHR9ICk7XG5cdH0gKTtcblxuXHQvLyBVcGRhdGUgdGhlIGZpbHRlciBrZXkuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIGZpZWxkS2V5Rm9yLCAkZmllbGQgKSB7XG5cdFx0aWYgKCBPYmplY3QudmFsdWVzKCB0eXBlc0hhdmluZ1NlcGFyYXRlRmllbGRLZXlzICkuaW5jbHVkZXMoIGhhbmRsZXIgKSApIHtcblx0XHRcdGNvbnN0IGZpZWxkVHlwZSAgPSAkZmllbGQuY2xvc2VzdCggJ1tkYXRhLWZpZWxkLXR5cGVdJyApLmF0dHIoICdkYXRhLWZpZWxkLXR5cGUnICk7XG5cdFx0XHRjb25zdCBmaWVsZFN0YXRlID0gZmllbGRTdGF0ZXNbIGZpZWxkVHlwZSBdO1xuXHRcdFx0Y29uc3QgZmllbGRLZXlzICA9IGZpZWxkU3RhdGVbICdmaWVsZF9rZXknIF07XG5cblx0XHRcdGNvbnN0ICRmaWVsZEtleSAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1maWVsZF9rZXkgaW5wdXRbdHlwZT1cInRleHRcIl0nICk7XG5cdFx0XHRjb25zdCBkZWZhdWx0S2V5ID0gJGZpZWxkS2V5LmF0dHIoICdkYXRhLWRlZmF1bHQtZmllbGQta2V5JyApO1xuXHRcdFx0bGV0IF9maWVsZEtleTtcblxuXHRcdFx0aWYgKCAhIGZpZWxkS2V5Rm9yICkge1xuXHRcdFx0XHRmaWVsZEtleUZvciA9ICdkZWZhdWx0Jztcblx0XHRcdFx0X2ZpZWxkS2V5ICAgPSBkZWZhdWx0S2V5O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gUHJlcGVuZCBkYXNoIHRvIGF2b2lkIGNvbmZsaWN0aW5nIHdpdGggdGhlIHJlZ2lzdGVyZWQgdGF4b25vbWllcyBhbmQgcG9zdCB0eXBlcy5cblx0XHRcdFx0X2ZpZWxkS2V5ID0gJ18nICsgZmllbGRLZXlGb3I7XG5cdFx0XHR9XG5cblx0XHRcdGxldCBmaWVsZEtleTtcblxuXHRcdFx0aWYgKCBmaWVsZEtleUZvciBpbiBmaWVsZEtleXMgKSB7XG5cdFx0XHRcdGZpZWxkS2V5ID0gZmllbGRLZXlzWyBmaWVsZEtleUZvciBdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZmllbGRLZXkgPSBfZmllbGRLZXk7XG5cdFx0XHR9XG5cblx0XHRcdCRmaWVsZEtleS52YWwoIGZpZWxkS2V5ICkudHJpZ2dlciggJ2NoYW5nZScgKTtcblx0XHR9XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBNYW51YWwgT3B0aW9ucycgdGFibGUgZnVuY3Rpb24uXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG4vKipcbiAqIEBwYXJhbSB0YWJsZUlkZW50aWZpZXJcbiAqIEBwYXJhbSB2YWx1ZUlkZW50aWZpZXJcbiAqIEBwYXJhbSByb3dUZW1wbGF0ZUlkXG4gKiBAcGFyYW0gcm93RGVmYXVsdE9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gaW5pdE1hbnVhbE9wdGlvbnNUYWJsZSggdGFibGVJZGVudGlmaWVyLCB2YWx1ZUlkZW50aWZpZXIsIHJvd1RlbXBsYXRlSWQsIHJvd0RlZmF1bHRPcHRpb25zID0ge30gKSB7XG5cdGNvbnN0ICQgPSBqUXVlcnk7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblxuXHRjb25zdCBmaWVsZElkZW50aWZpZXIgPSAnLndjYXBmLWZvcm0tZmllbGQnO1xuXHRjb25zdCByb3dzSWRlbnRpZmllciAgPSAnLmZpZWxkLXRhYmxlLWJvZHktcm93cyc7XG5cdGNvbnN0IHJvd0lkZW50aWZpZXIgICA9ICcucm93LWl0ZW0nO1xuXG5cdGZ1bmN0aW9uIGluaXRTb3J0YWJsZVRhYmxlKCAkc2VsZWN0b3IgKSB7XG5cdFx0JHNlbGVjdG9yLnNvcnRhYmxlKCB7XG5cdFx0XHRvcGFjaXR5OiAwLjgsXG5cdFx0XHRyZXZlcnQ6IGZhbHNlLFxuXHRcdFx0Y3Vyc29yOiAnbW92ZScsXG5cdFx0XHRheGlzOiAneScsXG5cdFx0XHRoYW5kbGU6ICcubW92ZS1vcHRpb25zLWhhbmRsZXInLFxuXHRcdFx0cGxhY2Vob2xkZXI6ICd3aWRnZXQtcGxhY2Vob2xkZXInLFxuXHRcdFx0dXBkYXRlOiBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkID0gJCggZS50YXJnZXQgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRcdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHRcdFx0fVxuXHRcdH0gKS5kaXNhYmxlU2VsZWN0aW9uKCk7XG5cdH1cblxuXHRjb25zdCB0YWJsZVJvd3NJZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAnICsgcm93c0lkZW50aWZpZXI7XG5cblx0Ly8gSW5pdCB0aGUgc29ydGFibGUgdGFibGUgYWZ0ZXIgcGFnZSBsb2Fkcy5cblx0aW5pdFNvcnRhYmxlVGFibGUoIGZpZWxkV3JhcHBlci5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkgKTtcblxuXHQvLyBJbml0IHRoZSBzb3J0YWJsZSB0YWJsZSBhZnRlciB0aGUgZmllbGQgaXMgYWRkZWQuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0aW5pdFNvcnRhYmxlVGFibGUoICQoIGZpZWxkV3JhcHBlci5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkgKSApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gdHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApIHtcblx0XHRjb25zdCAkdmFsdWVIb2xkZXIgPSAkZmllbGQuZmluZCggdmFsdWVJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgICAgID0gJGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKTtcblx0XHRjb25zdCBfcm93cyAgICAgICAgPSBbXTtcblxuXHRcdCRyb3dzLmZpbmQoICcucm93LWl0ZW0nICkuZWFjaCggZnVuY3Rpb24oIGksIF9pdGVtICkge1xuXHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCBfaXRlbSApO1xuXHRcdFx0Y29uc3Qgb2JqICAgPSB7fTtcblxuXHRcdFx0JGl0ZW0uZmluZCggJ1tkYXRhLW5hbWVdJyApLmVhY2goIGZ1bmN0aW9uKCBmaWVsZEluZGV4LCBmaWVsZCApIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkID0gJCggZmllbGQgKTtcblx0XHRcdFx0Y29uc3QgbmFtZSAgID0gJGZpZWxkLmF0dHIoICdkYXRhLW5hbWUnICk7XG5cblx0XHRcdFx0b2JqWyBuYW1lIF0gPSAkZmllbGQudmFsKCk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdF9yb3dzLnB1c2goIG9iaiApO1xuXHRcdH0gKTtcblxuXHRcdGNvbnN0IHJhd1ZhbHVlcyA9IGVuY29kZVVSSUNvbXBvbmVudCggSlNPTi5zdHJpbmdpZnkoIF9yb3dzICkgKTtcblx0XHQkdmFsdWVIb2xkZXIudmFsKCByYXdWYWx1ZXMgKS50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gdHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICkge1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggdGFibGVJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgdGFibGVSb3dzICAgICA9ICRmaWVsZC5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkuY2hpbGRyZW4oKTtcblxuXHRcdGlmICggMiA+IHRhYmxlUm93cy5sZW5ndGggKSB7XG5cdFx0XHQkb3B0aW9uc1RhYmxlLnJlbW92ZUNsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmVtb3ZlIE9wdGlvblxuXHRjb25zdCByZW1vdmVCdG5JZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAucmVtb3ZlLW9wdGlvbic7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnY2xpY2snLCByZW1vdmVCdG5JZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkaXRlbSAgPSAkKCB0aGlzICkuY2xvc2VzdCggcm93SWRlbnRpZmllciApO1xuXHRcdGNvbnN0ICRmaWVsZCA9ICRpdGVtLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICk7XG5cblx0XHQkaXRlbS5yZW1vdmUoKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIENsZWFyIEFsbCBPcHRpb25zXG5cdGNvbnN0IGNsZWFyT3B0aW9uc0J0bklkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnIC5jbGVhci1vcHRpb25zJztcblxuXHRmaWVsZFdyYXBwZXIub24oICdjbGljaycsIGNsZWFyT3B0aW9uc0J0bklkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdCRmaWVsZC5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICkuZW1wdHkoKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApO1xuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIEFkZCBOZXcgT3B0aW9uXG5cdGNvbnN0IGFkZE9wdGlvbkJ0bklkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnIC5hZGQtb3B0aW9uJztcblxuXHRmaWVsZFdyYXBwZXIub24oICdjbGljaycsIGFkZE9wdGlvbkJ0bklkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgcm93VGVtcGxhdGVJZCApLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCByb3dUZW1wbGF0ZUlkICk7XG5cdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSggcm93RGVmYXVsdE9wdGlvbnMgKTtcblx0XHRjb25zdCAkdGFibGUgICA9ICRmaWVsZC5maW5kKCB0YWJsZUlkZW50aWZpZXIgKTtcblx0XHRjb25zdCAkcm93cyAgICA9ICRmaWVsZC5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICk7XG5cblx0XHQkcm93cy5hcHBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cblx0XHRmaWVsZFdyYXBwZXIudHJpZ2dlciggJ25ld19vcHRpb25fYWRkZWQnLCBbICRmaWVsZCBdICk7XG5cblx0XHRpZiAoICEgJHRhYmxlLmhhc0NsYXNzKCAnaGFzLW9wdGlvbnMnICkgKSB7XG5cdFx0XHQkdGFibGUuYWRkQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH0gKTtcblxuXHQvLyBUcmlnZ2VyIG9wdGlvbnMgY2hhbmdlIHdoZW4gdGhlIHRleHQgZmllbGRzIGdldCBjaGFuZ2VkLlxuXHRjb25zdCB0ZXh0RmllbGRzSWRlbnRpZmllciA9IHRhYmxlUm93c0lkZW50aWZpZXIgKyAnIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJztcblxuXHRmaWVsZFdyYXBwZXIub24oICdpbnB1dCcsIHRleHRGaWVsZHNJZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBUcmlnZ2VyIG9wdGlvbnMgY2hhbmdlIHdoZW4gdGhlIHNlbGVjdCBmaWVsZHMgZ2V0IGNoYW5nZWQuXG5cdGxldCBzZWxlY3RGaWVsZHNJZGVudGlmaWVyID0gdGFibGVSb3dzSWRlbnRpZmllciArICcgc2VsZWN0JztcblxuXHRmaWVsZFdyYXBwZXIub24oICdjaGFuZ2UnLCBzZWxlY3RGaWVsZHNJZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBUcmlnZ2VyIG9wdGlvbnMgY2hhbmdlIHdoZW4gdmFsdWUgaXMgYWRkZWQgZnJvbSBtb2RhbC5cblx0ZmllbGRXcmFwcGVyLm9uKCAndHJpZ2dlcl9vcHRpb25zX3RhYmxlJywgZnVuY3Rpb24oIGUsIHRhYmxlSWQsICRmaWVsZCApIHtcblx0XHRpZiAoIHRhYmxlSWQgPT09IHRhYmxlSWRlbnRpZmllciApIHtcblx0XHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0XHR9XG5cdH0gKTtcblxufVxuIiwiLyoqXG4gKiBUaGUgbnVtYmVyIHVpIG9wdGlvbnMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0LyoqXG5cdCAqIFRvZ2dsZSBkaXNhYmxlZCBhdHRyaWJ1dGUgb2YgbWluLXZhbHVlIGZpZWxkIGZvciBudW1iZXIgdHlwZS5cblx0ICovXG5cdGZ1bmN0aW9uIHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICRlbG0gKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICA9ICRlbG0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICR0ZXh0RmllbGQgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWUgaW5wdXRbdHlwZT1cInRleHRcIl0nICk7XG5cblx0XHRpZiAoICRlbG0uaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdCR0ZXh0RmllbGQuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkdGV4dEZpZWxkLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHR9XG5cdH1cblxuXHRmaWVsZFdyYXBwZXIub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdGZpZWxkV3JhcHBlci5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0dG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJHRoaXMgKTtcblx0XHR9ICk7XG5cdH0gKTtcblxuXHRmaWVsZFdyYXBwZXIub24oXG5cdFx0J2NsaWNrJyxcblx0XHQnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fVxuXHQpO1xuXG5cdC8qKlxuXHQgKiBUb2dnbGUgZGlzYWJsZWQgYXR0cmlidXRlIG9mIG1heC12YWx1ZSBmaWVsZCBmb3IgbnVtYmVyIHR5cGUuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkZWxtICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkdGV4dEZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXG5cdFx0aWYgKCAkZWxtLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHQkdGV4dEZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHRleHRGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHRmaWVsZFdyYXBwZXIuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fSApO1xuXHR9ICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKFxuXHRcdCdjbGljaycsXG5cdFx0Jy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0XHR0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHRcdH1cblx0KTtcblxufSApO1xuIiwiLyoqXG4gKiBUaGUgcHJvZHVjdCBzdGF0dXMgZmllbGQuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXG5cdGNvbnN0IHRhYmxlSWRlbnRpZmllciA9ICcucHJvZHVjdC1zdGF0dXMtb3B0aW9ucy10YWJsZSc7XG5cdGNvbnN0IHZhbHVlSWRlbnRpZmllciA9ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcHJvZHVjdF9zdGF0dXNfb3B0aW9ucyBpbnB1dCc7XG5cdGNvbnN0IHJvd1RlbXBsYXRlSWQgICA9ICd3Y2FwZi1wcm9kdWN0LXN0YXR1cy1vcHRpb24nO1xuXG5cdGluaXRNYW51YWxPcHRpb25zVGFibGUoIHRhYmxlSWRlbnRpZmllciwgdmFsdWVJZGVudGlmaWVyLCByb3dUZW1wbGF0ZUlkICk7XG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIHRvZ2dsZSB2aXNpYmlsaXR5IHNjcmlwdHMuXG4gKlxuICogTk9URTogVGhlc2Ugc2NyaXB0cyBtdXN0IGJlIGxvY2F0ZWQgYXQgdGhlIHZlcnkgYm90dG9tIG9mIHRoZSBjb21iaW5lZCBzY3JpcHRzLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdGNvbnN0IGRlcGVuZGFudERhdGEgPSBbXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXZhbHVlX3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5pbnB1dC10eXBlLXRleHQtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0ZXh0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5pbnB1dC10eXBlLW51bWJlci1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ251bWJlcicgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS1kYXRlLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnZGF0ZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcudmFsdWUtZGVjaW1hbC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ251bWJlcicgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcXVlcnlfdHlwZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY2hlY2tib3gnLCAnbXVsdGktc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhZGlvJywgJ3NlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnc2VsZWN0JywgJ211bHRpLXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaGllcmFyY2hpY2FsLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY2hlY2tib3gnLCAncmFkaW8nLCAnc2VsZWN0JywgJ211bHRpLXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2NhdGVnb3J5X2ltYWdlcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW1hZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9tdWx0aXBsZV9maWx0ZXInLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2xhYmVsJywgJ2NvbG9yJywgJ2ltYWdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5jb2x1bW4tZ3JvdXAtY3VzdG9tX2FwcGVhcmFuY2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NvbG9yJywgJ2ltYWdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWhpZXJhcmNoaWNhbCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfaGllcmFyY2h5X2FjY29yZGlvbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfZGVjaW1hbCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV9kZWNpbWFsX3BsYWNlcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZ2V0X29wdGlvbnMgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuY29sdW1uLWdyb3VwLW1ldGFfa2V5X21hbnVhbF9vcHRpb25zJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdtYW51YWxfZW50cnknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2xpZGVyX2Rpc3BsYXlfdmFsdWVzX2FzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsaWduX3ZhbHVlc19hdF90aGVfZW5kJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NlbGVjdF9hbGxfaXRlbXNfbGFiZWwnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3VzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXInLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2hvd19jb3VudCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JywgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfaGlkZV9lbXB0eScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JywgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItZGVjaW1hbC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NsaWRlcicsICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnLCAncmFuZ2VfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZ2V0X29wdGlvbnMgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLWF1dG9tYXRpYy1vcHRpb25zJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdhdXRvbWF0aWNhbGx5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItbWFudWFsLW9wdGlvbnMtdGFibGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ21hbnVhbF9lbnRyeScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGF0ZV9kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5kYXRlLXRvLXVpLW9wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2lucHV0X2RhdGVfcmFuZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRhdGVfZm9ybWF0Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbnB1dF9kYXRlJywgJ2lucHV0X2RhdGVfcmFuZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3F1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2NoZWNrYm94JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9zZWxlY3RfYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9yYWRpbycsICd0aW1lX3BlcmlvZF9zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3VzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX3NlbGVjdCcsICd0aW1lX3BlcmlvZF9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfZW5hYmxlX211bHRpcGxlX2ZpbHRlcicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3Nob3dfY291bnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2NoZWNrYm94JywgJ3RpbWVfcGVyaW9kX3JhZGlvJywgJ3RpbWVfcGVyaW9kX3NlbGVjdCcsICd0aW1lX3BlcmlvZF9tdWx0aXNlbGVjdCcsICd0aW1lX3BlcmlvZF9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfaGlkZV9lbXB0eScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfY2hlY2tib3gnLCAndGltZV9wZXJpb2RfcmFkaW8nLCAndGltZV9wZXJpb2Rfc2VsZWN0JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JywgJ3RpbWVfcGVyaW9kX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF91c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9zb2Z0X2xpbWl0IGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNvZnRfbGltaXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2VuYWJsZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGF4b25vbXkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtY3VzdG9tLXRheG9ub215IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1ldGFfa2V5IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBvc3RfcHJvcGVydHkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfb3B0aW9ucyBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBhcmVudF90ZXJtJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjaGlsZCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfdmFsdWVzX2J5X2lkJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbmNsdWRlJywgJ2V4Y2x1ZGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9hY2NvcmRpb24gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWNjb3JkaW9uX2RlZmF1bHRfc3RhdGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3llcycgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2NhdGVnb3J5X2ltYWdlcyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNob3dfaWZfZW1wdHkgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW1wdHlfZmlsdGVyX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdF07XG5cblx0ZnVuY3Rpb24gX2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgPSBjdXJyZW50U2VsZWN0b3IuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0IGhhbmRsZXIgICAgID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0Y29uc3QgaGFuZGxlclR5cGUgPSBkYXRhWyAnaGFuZGxlclR5cGUnIF07XG5cdFx0Y29uc3QgZGVwZW5kYW50ICAgPSBkYXRhWyAnZGVwZW5kYW50JyBdO1xuXG5cdFx0bGV0IF92YWx1ZSA9IHZhbHVlO1xuXG5cdFx0aWYgKCAnY2hlY2tib3gnID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9IGN1cnJlbnRTZWxlY3Rvci5pcyggJzpjaGVja2VkJyApID8gJzEnIDogJzAnO1xuXHRcdH1cblxuXHRcdGlmICggJ3JhZGlvJyA9PT0gaGFuZGxlclR5cGUgKSB7XG5cdFx0XHRfdmFsdWUgPSAkZmllbGQuZmluZCggaGFuZGxlciArICc6Y2hlY2tlZCcgKS52YWwoKTtcblx0XHR9XG5cblx0XHQkLmVhY2goIGRlcGVuZGFudCwgZnVuY3Rpb24oIGlkLCBkICkge1xuXHRcdFx0Y29uc3QgJHNlbGVjdG9yICAgPSAkZmllbGQuZmluZCggZFsgJ3NlbGVjdG9yJyBdICk7XG5cdFx0XHRjb25zdCB2YWxpZFZhbHVlcyA9IGRbICd2YWx1ZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZFZhbHVlcy5pbmNsdWRlcyggX3ZhbHVlICkgKSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc2VsZWN0b3IuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBbIGhhbmRsZXIsIF92YWx1ZSwgJGZpZWxkIF0gKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0aWYgKCBudWxsID09PSBjdXJyZW50U2VsZWN0b3IgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyICA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdFx0Y29uc3QgJGhhbmRsZXIgPSAkKCBoYW5kbGVyICk7XG5cblx0XHRcdCQuZWFjaCggJGhhbmRsZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IF92YWx1ZSA9IF90aGlzLnZhbCgpO1xuXHRcdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgX3RoaXMsIF92YWx1ZSApO1xuXHRcdFx0fSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNldHVwRmllbGQoIGluaXRhbCA9IGZhbHNlICkge1xuXHRcdCQuZWFjaCggZGVwZW5kYW50RGF0YSwgZnVuY3Rpb24oIGksIGRhdGEgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0XHRjb25zdCBldmVudCAgID0gZGF0YVsgJ2V2ZW50JyBdO1xuXG5cdFx0XHRoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBudWxsLCBudWxsICk7XG5cblx0XHRcdGlmICggaW5pdGFsICkge1xuXHRcdFx0XHRmaWVsZFdyYXBwZXIub24oIGV2ZW50LCBoYW5kbGVyLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0Y29uc3QgX3ZhbHVlID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHRcdGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIF90aGlzLCBfdmFsdWUgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGlmICggISAkKCBmaWVsZFdyYXBwZXIgKS5oYXNDbGFzcyggJ2xvYWRlZCcgKSApIHtcblx0XHRcdFx0XHQkKCBmaWVsZFdyYXBwZXIgKS5hZGRDbGFzcyggJ2xvYWRlZCcgKTtcblxuXHRcdFx0XHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnZmllbGRfYWRkZWQnICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRzZXR1cEZpZWxkKCB0cnVlICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHQvLyBUb2dnbGUgdGhlIHZpc2liaWxpdHkgb2Ygc3ViZmllbGRzLlxuXHRcdHNldHVwRmllbGQoKTtcblx0fSApO1xuXG59ICk7XG4iXX0=
