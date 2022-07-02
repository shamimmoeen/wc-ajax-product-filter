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
  var fieldWrapper = $('#chosen_field_wrapper'); // Hierarchical field's toggle visibility when text display type is changed.

  fieldWrapper.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-display_type select' === handler) {
      var $hrFields = $field.find('.hierarchical-fields');
      var $hierarchical = $field.find('.wcapf-form-sub-field-hierarchical');
      var useHierarchical = $hierarchical.find('input').is(':checked');
      var $hrAccordion = $field.find('.wcapf-form-sub-field-enable_hierarchy_accordion');

      if ('checkbox' === value || 'radio' === value) {
        $hrFields.show();

        if (useHierarchical) {
          $hrAccordion.show();
        } else {
          $hrAccordion.hide();
        }
      } else if ('select' === value || 'multi-select' === value) {
        $hrFields.show();
        $hrAccordion.hide();
      } else {
        $hrFields.hide();
      }
    }
  }); // Hierarchical accordion field toggle visibility when show hierarchy is changed.

  fieldWrapper.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-hierarchical input' === handler) {
      var displayType = $field.find('.wcapf-form-sub-field-display_type select').val();
      var $hrAccordion = $field.find('.wcapf-form-sub-field-enable_hierarchy_accordion');

      if ('1' === value) {
        if ('checkbox' === displayType || 'radio' === displayType) {
          $hrAccordion.show();
        } else {
          $hrAccordion.hide();
        }
      } else {
        $hrAccordion.hide();
      }
    }
  }); // Override no-results-message, all-items-label field's toggle visibility when text display type is changed.

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
  var fieldInput = '[name]:not(.manual_options)';
  var fieldStates = {};

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
    }); // Handle manual options.

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
 * Plugin settings form.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function ($) {
  if (!$('body').hasClass('wcapf-filter_page_wcapf-settings')) {
    return;
  } // Toggle pagination fields.


  function enablePagination(value) {
    var $selector = $('.settings-table-pagination_container');

    if (value) {
      $selector.show();
    } else {
      $selector.hide();
    }
  }

  var $enablePagination = $('#enable_pagination_via_ajax');
  var enablePaginationOnLoad = false;

  if ($enablePagination.is(':checked')) {
    enablePaginationOnLoad = true;
  }

  enablePagination(enablePaginationOnLoad);
  $enablePagination.on('change', function () {
    var _enablePagination = false;

    if ($(this).is(':checked')) {
      _enablePagination = true;
    }

    enablePagination(_enablePagination);
  }); // Toggle scroll window fields.

  function scrollWindow(value) {
    var dependentFields = '.scroll-window-dependent-fields,' + '.scroll-window-custom-element-input,' + '.settings-table-scroll_to_top_offset';

    if ('none' === value) {
      $(dependentFields).hide();
    } else if ('results' === value) {
      $('.scroll-window-dependent-fields, .settings-table-scroll_to_top_offset').show();
      $('.scroll-window-custom-element-input').hide();
    } else if ('custom' === value) {
      $('.scroll-window-custom-element-input').show();
    } else {
      $(dependentFields).show();
    }
  }

  var $scrollWindow = $('#scroll_window');
  scrollWindow($scrollWindow.val());
  $scrollWindow.on('change', function () {
    var value = $(this).val();
    scrollWindow(value);
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
    'event': 'change'
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
      'selector': '.wcapf-form-sub-field-show_date_inputs_inline',
      'value': ['input_date_range']
    }, {
      'selector': '.date-picker-fields',
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
    'handlerType': 'checkbox',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-soft_limit',
      'value': ['1']
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
      'value': ['include']
    }, {
      'selector': '.wcapf-form-sub-field-exclude_values_id',
      'value': ['exclude']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-enable_accordion input',
    'handlerType': 'checkbox',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-accordion_default_state',
      'value': ['1']
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
    'handler': '.wcapf-form-sub-field-enable_clear_all_button input',
    'handlerType': 'checkbox',
    'event': 'change',
    'dependant': [{
      'selector': '.clear-all-button-fields-start',
      'value': ['1']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-show_if_empty input',
    'handlerType': 'checkbox',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-empty_filter_message',
      'value': ['1']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-show_title input',
    'handlerType': 'checkbox',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-move_clear_all_button_in_title',
      'value': ['1']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-order_terms_by select',
    'handlerType': 'select',
    'event': 'change'
  }, {
    'handler': '.wcapf-form-sub-field-active_filters_layout input',
    'handlerType': 'radio',
    'event': 'change',
    'dependant': [{
      'selector': '.simple-layout-soft-fields-start',
      'value': ['simple']
    }, {
      'selector': '.extended-layout-soft-fields-start',
      'value': ['extended']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-enable_soft_limit_for_extended_layout input',
    'handlerType': 'checkbox',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-soft_limit_for_extended_layout',
      'value': ['1']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-enable_tooltip input',
    'handlerType': 'checkbox',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-show_count_in_tooltip',
      'value': ['1']
    }, {
      'selector': '.wcapf-form-sub-field-tooltip_position',
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbS1hcHBlYXJhbmNlLWZpZWxkcy5qcyIsImRpc3BsYXktdHlwZS1maWVsZHMuanMiLCJmaWVsZC1tZXRhLWJveC5qcyIsIm1hbnVhbC1vcHRpb25zLXRhYmxlLmpzIiwibnVtYmVyLXVpLW9wdGlvbnMuanMiLCJwbHVnaW4tc2V0dGluZ3MuanMiLCJwcm9kdWN0LXN0YXR1cy10YWJsZS5qcyIsInRvZ2dsZVZpc2liaWxpdHkuanMiXSwibmFtZXMiOlsialF1ZXJ5IiwiZG9jdW1lbnQiLCJyZWFkeSIsIiQiLCJmaWVsZFdyYXBwZXIiLCJvbiIsImUiLCJoYW5kbGVyIiwidmFsdWUiLCIkZmllbGQiLCIkcXVlcnlUeXBlIiwiZmluZCIsInZhbGlkRGlzcGxheVR5cGVzIiwiaW5jbHVkZXMiLCIkbXVsdGlwbGVGaWx0ZXIiLCJpcyIsInNob3ciLCJoaWRlIiwiJGRpc3BsYXlUeXBlIiwiZGlzcGxheVR5cGUiLCJ2YWwiLCIkaHJGaWVsZHMiLCIkaGllcmFyY2hpY2FsIiwidXNlSGllcmFyY2hpY2FsIiwiJGhyQWNjb3JkaW9uIiwiJG5vUmVzdWx0cyIsIiRhbGxJdGVtc0xhYmVsIiwidXNlQ2hvc2VuIiwiZmllbGRJbnB1dCIsImZpZWxkU3RhdGVzIiwic3RvcmVGaWVsZFN0YXRlIiwiZmllbGRUeXBlIiwiYXR0ciIsImZpZWxkVmFsdWVzIiwiZWFjaCIsIiRpbnB1dCIsInR5cGUiLCJuYW1lIiwibWFudWFsT3B0aW9ucyIsInVwZGF0ZUZpZWxkU3RhdGUiLCIkZWxtIiwiZmllbGRTdGF0ZSIsImhhc0NsYXNzIiwibWFudWFsX29wdGlvbnMiLCIkdGhpcyIsImFwcGx5RmllbGRTdGF0ZSIsInJlbW92ZUF0dHIiLCJyYXdPcHRpb25zIiwiaW5wdXROYW1lIiwicmF3IiwiJHJhd0lucHV0IiwiSlNPTiIsInBhcnNlIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwibGVuZ3RoIiwidGFibGVJZGVudGlmaWVyIiwicm93VGVtcGxhdGVJZCIsInJvd3NJZGVudGlmaWVyIiwicm93SWRlbnRpZmllciIsIiR0YWJsZSIsIiRyb3dzIiwiaSIsIm9wdGlvbiIsInRlbXBsYXRlIiwid3AiLCJyb3dEZWZhdWx0T3B0aW9ucyIsInJlbmRlcmVkIiwiYXBwZW5kIiwiJGxhc3RSb3ciLCJsYXN0IiwiYWRkQ2xhc3MiLCJ0cmlnZ2VyIiwiX2ZpZWxkVHlwZSIsImZpZWxkTmFtZSIsImZpZWxkRGF0YVdyYXBwZXIiLCJmaWVsZE5hbWVXcmFwcGVyIiwiZmllbGRJbnNpZGUiLCJyZW1vdmVDbGFzcyIsImh0bWwiLCJpbml0TWFudWFsT3B0aW9uc1RhYmxlIiwidmFsdWVJZGVudGlmaWVyIiwiZmllbGRJZGVudGlmaWVyIiwiaW5pdFNvcnRhYmxlVGFibGUiLCIkc2VsZWN0b3IiLCJzb3J0YWJsZSIsIm9wYWNpdHkiLCJyZXZlcnQiLCJjdXJzb3IiLCJheGlzIiwiaGFuZGxlIiwicGxhY2Vob2xkZXIiLCJ1cGRhdGUiLCJ0YXJnZXQiLCJjbG9zZXN0IiwidHJpZ2dlck9wdGlvbnNDaGFuZ2UiLCJkaXNhYmxlU2VsZWN0aW9uIiwidGFibGVSb3dzSWRlbnRpZmllciIsIiR2YWx1ZUhvbGRlciIsIl9yb3dzIiwiX2l0ZW0iLCIkaXRlbSIsIm9iaiIsImZpZWxkSW5kZXgiLCJmaWVsZCIsInB1c2giLCJyYXdWYWx1ZXMiLCJlbmNvZGVVUklDb21wb25lbnQiLCJzdHJpbmdpZnkiLCJ0cmlnZ2VyUmVtb3ZlT3B0aW9uIiwiJG9wdGlvbnNUYWJsZSIsInRhYmxlUm93cyIsImNoaWxkcmVuIiwicmVtb3ZlQnRuSWRlbnRpZmllciIsInJlbW92ZSIsImNsZWFyT3B0aW9uc0J0bklkZW50aWZpZXIiLCJlbXB0eSIsImFkZE9wdGlvbkJ0bklkZW50aWZpZXIiLCJ0ZXh0RmllbGRzSWRlbnRpZmllciIsInNlbGVjdEZpZWxkc0lkZW50aWZpZXIiLCJ0YWJsZUlkIiwidG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCIsIiR0ZXh0RmllbGQiLCJ0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkIiwiZW5hYmxlUGFnaW5hdGlvbiIsIiRlbmFibGVQYWdpbmF0aW9uIiwiZW5hYmxlUGFnaW5hdGlvbk9uTG9hZCIsIl9lbmFibGVQYWdpbmF0aW9uIiwic2Nyb2xsV2luZG93IiwiZGVwZW5kZW50RmllbGRzIiwiJHNjcm9sbFdpbmRvdyIsImRlcGVuZGFudERhdGEiLCJfaGFuZGxlVG9nZ2xlUmVxdWVzdCIsImRhdGEiLCJjdXJyZW50U2VsZWN0b3IiLCJoYW5kbGVyVHlwZSIsImRlcGVuZGFudCIsIl92YWx1ZSIsImlkIiwiZCIsInZhbGlkVmFsdWVzIiwiaGFuZGxlVG9nZ2xlUmVxdWVzdCIsIiRoYW5kbGVyIiwiX3RoaXMiLCJzZXR1cEZpZWxkIiwiaW5pdGFsIiwiZXZlbnQiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQSxNQUFNLENBQUVDLFFBQUYsQ0FBTixDQUFtQkMsS0FBbkIsQ0FBMEIsVUFBVUMsQ0FBVixFQUFjO0FBRXZDLE1BQU1DLFlBQVksR0FBR0QsQ0FBQyxDQUFFLHVCQUFGLENBQXRCO0FBRUFDLEVBQUFBLFlBQVksQ0FBQ0MsRUFBYixDQUFpQixzQkFBakIsRUFBeUMsVUFBVUMsQ0FBVixFQUFhQyxPQUFiLEVBQXNCQyxLQUF0QixFQUE2QkMsTUFBN0IsRUFBc0M7QUFDOUUsUUFBSyxnREFBZ0RGLE9BQXJELEVBQStEO0FBQzlELFVBQU1HLFVBQVUsR0FBVUQsTUFBTSxDQUFDRSxJQUFQLENBQWEsa0NBQWIsQ0FBMUI7QUFDQSxVQUFNQyxpQkFBaUIsR0FBRyxDQUFFLE9BQUYsRUFBVyxPQUFYLEVBQW9CLE9BQXBCLENBQTFCOztBQUVBLFVBQUtBLGlCQUFpQixDQUFDQyxRQUFsQixDQUE0QkwsS0FBNUIsQ0FBTCxFQUEyQztBQUMxQyxZQUFNTSxlQUFlLEdBQUdMLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLG9EQUFiLENBQXhCOztBQUVBLFlBQUtHLGVBQWUsQ0FBQ0MsRUFBaEIsQ0FBb0IsVUFBcEIsQ0FBTCxFQUF3QztBQUN2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QixFQUFpQyxZQUFXO0FBQzNDLGNBQU11SSxLQUFLLEdBQUkzSSxDQUFDLENBQUUsSUFBRixDQUFoQjs7QUFDQSxjQUFNcUksTUFBTSxHQUFHckksQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVaUIsR0FBVixFQUFmOztBQUNBd0gsVUFBQUEsbUJBQW1CLENBQUVSLElBQUYsRUFBUVUsS0FBUixFQUFlTixNQUFmLENBQW5CO0FBQ0EsU0FKRDs7QUFNQSxZQUFLLENBQUVySSxDQUFDLENBQUVDLFlBQUYsQ0FBRCxDQUFrQnNDLFFBQWxCLENBQTRCLFFBQTVCLENBQVAsRUFBZ0Q7QUFDL0N2QyxVQUFBQSxDQUFDLENBQUVDLFlBQUYsQ0FBRCxDQUFrQmtFLFFBQWxCLENBQTRCLFFBQTVCO0FBRUFsRSxVQUFBQSxZQUFZLENBQUNtRSxPQUFiLENBQXNCLGFBQXRCO0FBQ0E7QUFDRDtBQUNELEtBbkJEO0FBb0JBOztBQUVEd0UsRUFBQUEsVUFBVSxDQUFFLElBQUYsQ0FBVjtBQUVBM0ksRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLGFBQWpCLEVBQWdDLFlBQVc7QUFDMUM7QUFDQTBJLElBQUFBLFVBQVU7QUFDVixHQUhEO0FBS0EsQ0E3Y0QiLCJmaWxlIjoid2MtYWpheC1wcm9kdWN0LWZpbHRlci1hZG1pbi1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBEaXNwbGF5IHR5cGUgZmllbGRzLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJHF1ZXJ5VHlwZSAgICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1xdWVyeV90eXBlJyApO1xuXHRcdFx0Y29uc3QgdmFsaWREaXNwbGF5VHlwZXMgPSBbICdsYWJlbCcsICdjb2xvcicsICdpbWFnZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZERpc3BsYXlUeXBlcy5pbmNsdWRlcyggdmFsdWUgKSApIHtcblx0XHRcdFx0Y29uc3QgJG11bHRpcGxlRmlsdGVyID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcgKTtcblxuXHRcdFx0XHRpZiAoICRtdWx0aXBsZUZpbHRlci5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkcXVlcnlUeXBlICAgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXF1ZXJ5X3R5cGUnICk7XG5cdFx0XHRjb25zdCAkZGlzcGxheVR5cGUgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnICk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VHlwZSAgICAgICA9ICRkaXNwbGF5VHlwZS52YWwoKTtcblx0XHRcdGNvbnN0IHZhbGlkRGlzcGxheVR5cGVzID0gWyAnbGFiZWwnLCAnY29sb3InLCAnaW1hZ2UnIF07XG5cblx0XHRcdGlmICggdmFsaWREaXNwbGF5VHlwZXMuaW5jbHVkZXMoIGRpc3BsYXlUeXBlICkgKSB7XG5cdFx0XHRcdGlmICggJzEnID09PSB2YWx1ZSApIHtcblx0XHRcdFx0XHQkcXVlcnlUeXBlLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkcXVlcnlUeXBlLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIERpc3BsYXkgdHlwZSBmaWVsZHMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0Ly8gSGllcmFyY2hpY2FsIGZpZWxkJ3MgdG9nZ2xlIHZpc2liaWxpdHkgd2hlbiB0ZXh0IGRpc3BsYXkgdHlwZSBpcyBjaGFuZ2VkLlxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRockZpZWxkcyAgICAgICA9ICRmaWVsZC5maW5kKCAnLmhpZXJhcmNoaWNhbC1maWVsZHMnICk7XG5cdFx0XHRjb25zdCAkaGllcmFyY2hpY2FsICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1oaWVyYXJjaGljYWwnICk7XG5cdFx0XHRjb25zdCB1c2VIaWVyYXJjaGljYWwgPSAkaGllcmFyY2hpY2FsLmZpbmQoICdpbnB1dCcgKS5pcyggJzpjaGVja2VkJyApO1xuXHRcdFx0Y29uc3QgJGhyQWNjb3JkaW9uICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX2hpZXJhcmNoeV9hY2NvcmRpb24nICk7XG5cblx0XHRcdGlmICggJ2NoZWNrYm94JyA9PT0gdmFsdWUgfHwgJ3JhZGlvJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHRcdCRockZpZWxkcy5zaG93KCk7XG5cblx0XHRcdFx0aWYgKCB1c2VIaWVyYXJjaGljYWwgKSB7XG5cdFx0XHRcdFx0JGhyQWNjb3JkaW9uLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkaHJBY2NvcmRpb24uaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKCAnc2VsZWN0JyA9PT0gdmFsdWUgfHwgJ211bHRpLXNlbGVjdCcgPT09IHZhbHVlICkge1xuXHRcdFx0XHQkaHJGaWVsZHMuc2hvdygpO1xuXHRcdFx0XHQkaHJBY2NvcmRpb24uaGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGhyRmllbGRzLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHQvLyBIaWVyYXJjaGljYWwgYWNjb3JkaW9uIGZpZWxkIHRvZ2dsZSB2aXNpYmlsaXR5IHdoZW4gc2hvdyBoaWVyYXJjaHkgaXMgY2hhbmdlZC5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtaGllcmFyY2hpY2FsIGlucHV0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0IGRpc3BsYXlUeXBlICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnICkudmFsKCk7XG5cdFx0XHRjb25zdCAkaHJBY2NvcmRpb24gPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfaGllcmFyY2h5X2FjY29yZGlvbicgKTtcblxuXHRcdFx0aWYgKCAnMScgPT09IHZhbHVlICkge1xuXHRcdFx0XHRpZiAoICdjaGVja2JveCcgPT09IGRpc3BsYXlUeXBlIHx8ICdyYWRpbycgPT09IGRpc3BsYXlUeXBlICkge1xuXHRcdFx0XHRcdCRockFjY29yZGlvbi5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JGhyQWNjb3JkaW9uLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGhyQWNjb3JkaW9uLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHQvLyBPdmVycmlkZSBuby1yZXN1bHRzLW1lc3NhZ2UsIGFsbC1pdGVtcy1sYWJlbCBmaWVsZCdzIHRvZ2dsZSB2aXNpYmlsaXR5IHdoZW4gdGV4dCBkaXNwbGF5IHR5cGUgaXMgY2hhbmdlZC5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0XHRjb25zdCAkYWxsSXRlbXNMYWJlbCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRcdGNvbnN0IHVzZUNob3NlbiAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcgKS5pcyggJzpjaGVja2VkJyApO1xuXG5cdFx0XHRpZiAoIHVzZUNob3NlbiAmJiAoICdzZWxlY3QnID09PSB2YWx1ZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgKSApIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAoICdyYWRpbycgPT09IHZhbHVlIHx8ICdzZWxlY3QnID09PSB2YWx1ZSApIHx8ICggJ211bHRpLXNlbGVjdCcgPT09IHZhbHVlICYmIHVzZUNob3NlbiApICkge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gT3ZlcnJpZGUgbm8tcmVzdWx0cy1tZXNzYWdlLCBhbGwtaXRlbXMtbGFiZWwgZmllbGQncyB0b2dnbGUgdmlzaWJpbGl0eSB3aGVuIHRleHQgdXNlIGNob3NlbiBpcyBjaGFuZ2VkLlxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScgKTtcblx0XHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyApO1xuXHRcdFx0Y29uc3QgZGlzcGxheVR5cGUgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoICcxJyA9PT0gdmFsdWUgJiYgKCAnc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgfHwgJ211bHRpLXNlbGVjdCcgPT09IGRpc3BsYXlUeXBlICkgKSB7XG5cdFx0XHRcdCRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChcblx0XHRcdFx0KCAnMScgPT09IHZhbHVlICYmICdtdWx0aS1zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0XHRcdHx8ICggJ3JhZGlvJyA9PT0gZGlzcGxheVR5cGUgfHwgJ3NlbGVjdCcgPT09IGRpc3BsYXlUeXBlIClcblx0XHRcdCkge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogRmllbGQgbWV0YSBib3guXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cdGNvbnN0IGZpZWxkSW5wdXQgICA9ICdbbmFtZV06bm90KC5tYW51YWxfb3B0aW9ucyknO1xuXHRjb25zdCBmaWVsZFN0YXRlcyAgPSB7fTtcblxuXHRmdW5jdGlvbiBzdG9yZUZpZWxkU3RhdGUoKSB7XG5cdFx0Y29uc3QgZmllbGRUeXBlID0gZmllbGRXcmFwcGVyLmZpbmQoICcjZmllbGRfZGF0YScgKS5hdHRyKCAnZGF0YS1maWVsZC10eXBlJyApO1xuXG5cdFx0aWYgKCAhIGZpZWxkVHlwZSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBmaWVsZFZhbHVlcyA9IHt9O1xuXG5cdFx0ZmllbGRXcmFwcGVyLmZpbmQoIGZpZWxkSW5wdXQgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblx0XHRcdGNvbnN0IHR5cGUgICA9ICRpbnB1dC5hdHRyKCAndHlwZScgKTtcblx0XHRcdGNvbnN0IG5hbWUgICA9ICRpbnB1dC5hdHRyKCAnbmFtZScgKTtcblx0XHRcdGNvbnN0IHZhbHVlICA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0aWYgKCAnY2hlY2tib3gnID09PSB0eXBlIHx8ICdyYWRpbycgPT09IHR5cGUgKSB7XG5cdFx0XHRcdGlmICggJGlucHV0LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRcdFx0ZmllbGRWYWx1ZXNbIG5hbWUgXSA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmaWVsZFZhbHVlc1sgbmFtZSBdID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Ly8gSGFuZGxlIG1hbnVhbCBvcHRpb25zLlxuXHRcdGNvbnN0IG1hbnVhbE9wdGlvbnMgPSB7fTtcblxuXHRcdGZpZWxkV3JhcHBlci5maW5kKCAnLm1hbnVhbF9vcHRpb25zJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0Y29uc3QgbmFtZSAgID0gJGlucHV0LmF0dHIoICduYW1lJyApO1xuXG5cdFx0XHRtYW51YWxPcHRpb25zWyBuYW1lIF0gPSAkaW5wdXQudmFsKCk7XG5cdFx0fSApO1xuXG5cdFx0ZmllbGRWYWx1ZXNbICdtYW51YWxfb3B0aW9ucycgXSA9IG1hbnVhbE9wdGlvbnM7XG5cblx0XHRmaWVsZFN0YXRlc1sgZmllbGRUeXBlIF0gPSBmaWVsZFZhbHVlcztcblx0fVxuXG5cdGZ1bmN0aW9uIHVwZGF0ZUZpZWxkU3RhdGUoICRlbG0gKSB7XG5cdFx0Y29uc3QgZmllbGRUeXBlICA9IGZpZWxkV3JhcHBlci5maW5kKCAnI2ZpZWxkX2RhdGEnICkuYXR0ciggJ2RhdGEtZmllbGQtdHlwZScgKTtcblx0XHRjb25zdCBmaWVsZFN0YXRlID0gZmllbGRTdGF0ZXNbIGZpZWxkVHlwZSBdO1xuXG5cdFx0Y29uc3QgbmFtZSAgPSAkZWxtLmF0dHIoICduYW1lJyApO1xuXHRcdGNvbnN0IHR5cGUgID0gJGVsbS5hdHRyKCAndHlwZScgKTtcblx0XHRjb25zdCB2YWx1ZSA9ICRlbG0udmFsKCk7XG5cblx0XHRpZiAoICRlbG0uaGFzQ2xhc3MoICdtYW51YWxfb3B0aW9ucycgKSApIHtcblx0XHRcdGNvbnN0IG1hbnVhbF9vcHRpb25zID0gZmllbGRTdGF0ZVsgJ21hbnVhbF9vcHRpb25zJyBdIHx8IHt9O1xuXG5cdFx0XHRtYW51YWxfb3B0aW9uc1sgbmFtZSBdID0gdmFsdWU7XG5cblx0XHRcdGZpZWxkU3RhdGVbICdtYW51YWxfb3B0aW9ucycgXSA9IG1hbnVhbF9vcHRpb25zO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoICdjaGVja2JveCcgPT09IHR5cGUgfHwgJ3JhZGlvJyA9PT0gdHlwZSApIHtcblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gZmllbGRXcmFwcGVyLmZpbmQoICdbbmFtZT1cIicgKyBuYW1lICsgJ1wiXScgKTtcblxuXHRcdFx0XHRpZiAoICRpbnB1dC5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0XHRcdGZpZWxkU3RhdGVbIG5hbWUgXSA9IHZhbHVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGRlbGV0ZSBmaWVsZFN0YXRlWyBuYW1lIF07XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZpZWxkU3RhdGVbIG5hbWUgXSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFN0b3JlIHRoZSBpbml0aWFsIGZpZWxkIHN0YXRlLlxuXHRzdG9yZUZpZWxkU3RhdGUoKTtcblxuXHRmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lXScgKS5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0dXBkYXRlRmllbGRTdGF0ZSggJHRoaXMgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIGFwcGx5RmllbGRTdGF0ZSggZmllbGRUeXBlICkge1xuXHRcdGNvbnN0IGZpZWxkU3RhdGUgPSBmaWVsZFN0YXRlc1sgZmllbGRUeXBlIF07XG5cblx0XHRmaWVsZFdyYXBwZXIuZmluZCggZmllbGRJbnB1dCApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0Y29uc3QgdHlwZSAgID0gJGlucHV0LmF0dHIoICd0eXBlJyApO1xuXHRcdFx0Y29uc3QgbmFtZSAgID0gJGlucHV0LmF0dHIoICduYW1lJyApO1xuXHRcdFx0Y29uc3QgdmFsdWUgID0gZmllbGRTdGF0ZVsgbmFtZSBdO1xuXG5cdFx0XHRpZiAoICdjaGVja2JveCcgPT09IHR5cGUgfHwgJ3JhZGlvJyA9PT0gdHlwZSApIHtcblx0XHRcdFx0aWYgKCBuYW1lIGluIGZpZWxkU3RhdGUgKSB7XG5cdFx0XHRcdFx0Ly8gQWRkICdjaGVja2VkJyBhdHRyaWJ1dGUuXG5cdFx0XHRcdFx0ZmllbGRXcmFwcGVyXG5cdFx0XHRcdFx0XHQuZmluZCggJ1tuYW1lPVwiJyArIG5hbWUgKyAnXCJdW3ZhbHVlPVwiJyArIHZhbHVlICsgJ1wiXScgKVxuXHRcdFx0XHRcdFx0LmF0dHIoICdjaGVja2VkJywgJ2NoZWNrZWQnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gUmVtb3ZlICdjaGVja2VkJyBhdHRyaWJ1dGUuXG5cdFx0XHRcdFx0ZmllbGRXcmFwcGVyLmZpbmQoICdbbmFtZT1cIicgKyBuYW1lICsgJ1wiXScgKS5yZW1vdmVBdHRyKCAnY2hlY2tlZCcgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGlucHV0LnZhbCggdmFsdWUgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHQvLyBQcm9jZXNzIHRoZSBtYW51YWwgb3B0aW9ucy5cblx0XHRpZiAoICdtYW51YWxfb3B0aW9ucycgaW4gZmllbGRTdGF0ZSApIHtcblx0XHRcdGNvbnN0IHJhd09wdGlvbnMgPSBmaWVsZFN0YXRlWyAnbWFudWFsX29wdGlvbnMnIF07XG5cblx0XHRcdCQuZWFjaCggcmF3T3B0aW9ucywgZnVuY3Rpb24oIGlucHV0TmFtZSwgcmF3ICkge1xuXHRcdFx0XHRjb25zdCAkcmF3SW5wdXQgPSBmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lPVwiJyArIGlucHV0TmFtZSArICdcIl0nICk7XG5cblx0XHRcdFx0JHJhd0lucHV0LnZhbCggcmF3ICk7XG5cblx0XHRcdFx0Y29uc3QgbWFudWFsT3B0aW9ucyA9IEpTT04ucGFyc2UoIGRlY29kZVVSSUNvbXBvbmVudCggcmF3ICkgKTtcblxuXHRcdFx0XHRpZiAoICEgbWFudWFsT3B0aW9ucy5sZW5ndGggKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgdGFibGVJZGVudGlmaWVyID0gJHJhd0lucHV0LmF0dHIoICdkYXRhLXRhYmxlJyApO1xuXHRcdFx0XHRjb25zdCByb3dUZW1wbGF0ZUlkICAgPSAkcmF3SW5wdXQuYXR0ciggJ2RhdGEtdG1wbCcgKTtcblxuXHRcdFx0XHQvLyBCYWlsIG91dCBpZiBubyB0bXBsIGZvdW5kIGZvciB0aGUgdHlwZS5cblx0XHRcdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyByb3dUZW1wbGF0ZUlkICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IHJvd3NJZGVudGlmaWVyID0gJy5maWVsZC10YWJsZS1ib2R5LXJvd3MnO1xuXHRcdFx0XHRjb25zdCByb3dJZGVudGlmaWVyICA9ICcucm93LWl0ZW0nO1xuXG5cdFx0XHRcdGNvbnN0ICR0YWJsZSA9IGZpZWxkV3JhcHBlci5maW5kKCB0YWJsZUlkZW50aWZpZXIgKTtcblx0XHRcdFx0Y29uc3QgJHJvd3MgID0gJHRhYmxlLmZpbmQoIHJvd3NJZGVudGlmaWVyICk7XG5cblx0XHRcdFx0JC5lYWNoKCBtYW51YWxPcHRpb25zLCBmdW5jdGlvbiggaSwgb3B0aW9uICkge1xuXHRcdFx0XHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIHJvd1RlbXBsYXRlSWQgKTtcblxuXHRcdFx0XHRcdGxldCByb3dEZWZhdWx0T3B0aW9ucyA9IHt9O1xuXG5cdFx0XHRcdFx0aWYgKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyA9PT0gdGFibGVJZGVudGlmaWVyICkge1xuXHRcdFx0XHRcdFx0cm93RGVmYXVsdE9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0XHRcdCd2YWx1ZSc6ICcnLFxuXHRcdFx0XHRcdFx0XHQnbGFiZWwnOiAnJyxcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSggcm93RGVmYXVsdE9wdGlvbnMgKTtcblxuXHRcdFx0XHRcdCRyb3dzLmFwcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdFx0XHRcdGNvbnN0ICRsYXN0Um93ID0gJHJvd3MuZmluZCggcm93SWRlbnRpZmllciApLmxhc3QoKTtcblxuXHRcdFx0XHRcdCRsYXN0Um93LmZpbmQoICdbZGF0YS1uYW1lXScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdFx0Y29uc3QgbmFtZSAgPSAkdGhpcy5hdHRyKCAnZGF0YS1uYW1lJyApO1xuXHRcdFx0XHRcdFx0Y29uc3QgdmFsdWUgPSBvcHRpb25bIG5hbWUgXTtcblxuXHRcdFx0XHRcdFx0JHRoaXMudmFsKCB2YWx1ZSApO1xuXG5cdFx0XHRcdFx0XHRpZiAoICdpbWFnZV91cmwnID09PSBuYW1lICYmIHZhbHVlICkge1xuXHRcdFx0XHRcdFx0XHQkbGFzdFJvdy5maW5kKCAnLndwLWltYWdlLXBpY2tlci1jb250YWluZXInICkuYWRkQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0XHRcdFx0XHRcdCRsYXN0Um93LmZpbmQoICdpbWcnICkuYXR0ciggJ3NyYycsIHZhbHVlICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0JHRhYmxlLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGNvbnN0ICRmaWVsZCA9IGZpZWxkV3JhcHBlci5maW5kKCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnbmV3X29wdGlvbl9hZGRlZCcsIFsgJGZpZWxkIF0gKTtcblx0XHR9XG5cdH1cblxuXHQkKCAnI2F2YWlsYWJsZV9maWVsZHMnICkub24oICdjaGFuZ2UnLCAnW25hbWU9XCJfYWN0aXZlX2ZpZWxkXCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBfZmllbGRUeXBlID0gJHRoaXMudmFsKCk7XG5cdFx0Y29uc3QgZmllbGROYW1lICA9ICR0aGlzLmF0dHIoICdkYXRhLWZpZWxkLW5hbWUnICk7XG5cblx0XHRpZiAoICEgX2ZpZWxkVHlwZSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBmaWVsZFR5cGUgPSAnd2NhcGYtZm9ybS1maWVsZC0nICsgX2ZpZWxkVHlwZTtcblxuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgZmllbGRUeXBlICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IHRlbXBsYXRlICAgICAgICAgPSB3cC50ZW1wbGF0ZSggZmllbGRUeXBlICk7XG5cdFx0Y29uc3QgcmVuZGVyZWQgICAgICAgICA9IHRlbXBsYXRlKCk7XG5cdFx0Y29uc3QgZmllbGREYXRhV3JhcHBlciA9IGZpZWxkV3JhcHBlci5maW5kKCAnI2ZpZWxkX2RhdGEnICk7XG5cdFx0Y29uc3QgZmllbGROYW1lV3JhcHBlciA9IGZpZWxkV3JhcHBlci5maW5kKCAnLnBvc3Rib3gtaGVhZGVyIGgyJyApO1xuXHRcdGNvbnN0IGZpZWxkSW5zaWRlICAgICAgPSBmaWVsZFdyYXBwZXIuZmluZCggJy5pbnNpZGUnICk7XG5cblx0XHRmaWVsZFdyYXBwZXIucmVtb3ZlQ2xhc3MoICdoaWRkZW4nICk7XG5cblx0XHRmaWVsZERhdGFXcmFwcGVyLmF0dHIoICdkYXRhLWZpZWxkLXR5cGUnLCBfZmllbGRUeXBlICk7XG5cdFx0ZmllbGROYW1lV3JhcHBlci5odG1sKCBmaWVsZE5hbWUgKTtcblx0XHRmaWVsZEluc2lkZS5odG1sKCByZW5kZXJlZCApO1xuXG5cdFx0Ly8gSWYgYWxyZWFkeSBmb3VuZCB0aGUgZmllbGQgc3RhdGUgdGhlbiBhcHBseSBpdCwgb3RoZXJ3aXNlIHN0b3JlIGl0LlxuXHRcdGlmICggX2ZpZWxkVHlwZSBpbiBmaWVsZFN0YXRlcyApIHtcblx0XHRcdGFwcGx5RmllbGRTdGF0ZSggX2ZpZWxkVHlwZSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdG9yZUZpZWxkU3RhdGUoKTtcblx0XHR9XG5cblx0XHRmaWVsZFdyYXBwZXIudHJpZ2dlciggJ2ZpZWxkX2FkZGVkJyApO1xuXG5cdFx0ZmllbGRXcmFwcGVyLmZpbmQoICdbbmFtZV0nICkub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0XHR1cGRhdGVGaWVsZFN0YXRlKCAkdGhpcyApO1xuXHRcdH0gKTtcblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIE1hbnVhbCBPcHRpb25zJyB0YWJsZSBmdW5jdGlvbi5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbi8qKlxuICogQHBhcmFtIHRhYmxlSWRlbnRpZmllclxuICogQHBhcmFtIHZhbHVlSWRlbnRpZmllclxuICogQHBhcmFtIHJvd1RlbXBsYXRlSWRcbiAqIEBwYXJhbSByb3dEZWZhdWx0T3B0aW9uc1xuICovXG5mdW5jdGlvbiBpbml0TWFudWFsT3B0aW9uc1RhYmxlKCB0YWJsZUlkZW50aWZpZXIsIHZhbHVlSWRlbnRpZmllciwgcm93VGVtcGxhdGVJZCwgcm93RGVmYXVsdE9wdGlvbnMgPSB7fSApIHtcblx0Y29uc3QgJCA9IGpRdWVyeTtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdGNvbnN0IGZpZWxkSWRlbnRpZmllciA9ICcud2NhcGYtZm9ybS1maWVsZCc7XG5cdGNvbnN0IHJvd3NJZGVudGlmaWVyICA9ICcuZmllbGQtdGFibGUtYm9keS1yb3dzJztcblx0Y29uc3Qgcm93SWRlbnRpZmllciAgID0gJy5yb3ctaXRlbSc7XG5cblx0ZnVuY3Rpb24gaW5pdFNvcnRhYmxlVGFibGUoICRzZWxlY3RvciApIHtcblx0XHQkc2VsZWN0b3Iuc29ydGFibGUoIHtcblx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdHJldmVydDogZmFsc2UsXG5cdFx0XHRjdXJzb3I6ICdtb3ZlJyxcblx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdGhhbmRsZTogJy5tb3ZlLW9wdGlvbnMtaGFuZGxlcicsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHR1cGRhdGU6IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBlLnRhcmdldCApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdFx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdFx0XHR9XG5cdFx0fSApLmRpc2FibGVTZWxlY3Rpb24oKTtcblx0fVxuXG5cdGNvbnN0IHRhYmxlUm93c0lkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnICcgKyByb3dzSWRlbnRpZmllcjtcblxuXHQvLyBJbml0IHRoZSBzb3J0YWJsZSB0YWJsZSBhZnRlciBwYWdlIGxvYWRzLlxuXHRpbml0U29ydGFibGVUYWJsZSggZmllbGRXcmFwcGVyLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKSApO1xuXG5cdC8vIEluaXQgdGhlIHNvcnRhYmxlIHRhYmxlIGFmdGVyIHRoZSBmaWVsZCBpcyBhZGRlZC5cblx0ZmllbGRXcmFwcGVyLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHRpbml0U29ydGFibGVUYWJsZSggJCggZmllbGRXcmFwcGVyLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKSApICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICkge1xuXHRcdGNvbnN0ICR2YWx1ZUhvbGRlciA9ICRmaWVsZC5maW5kKCB2YWx1ZUlkZW50aWZpZXIgKTtcblx0XHRjb25zdCAkcm93cyAgICAgICAgPSAkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApO1xuXHRcdGNvbnN0IF9yb3dzICAgICAgICA9IFtdO1xuXG5cdFx0JHJvd3MuZmluZCggJy5yb3ctaXRlbScgKS5lYWNoKCBmdW5jdGlvbiggaSwgX2l0ZW0gKSB7XG5cdFx0XHRjb25zdCAkaXRlbSA9ICQoIF9pdGVtICk7XG5cdFx0XHRjb25zdCBvYmogICA9IHt9O1xuXG5cdFx0XHQkaXRlbS5maW5kKCAnW2RhdGEtbmFtZV0nICkuZWFjaCggZnVuY3Rpb24oIGZpZWxkSW5kZXgsIGZpZWxkICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBmaWVsZCApO1xuXHRcdFx0XHRjb25zdCBuYW1lICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtbmFtZScgKTtcblxuXHRcdFx0XHRvYmpbIG5hbWUgXSA9ICRmaWVsZC52YWwoKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0X3Jvd3MucHVzaCggb2JqICk7XG5cdFx0fSApO1xuXG5cdFx0Y29uc3QgcmF3VmFsdWVzID0gZW5jb2RlVVJJQ29tcG9uZW50KCBKU09OLnN0cmluZ2lmeSggX3Jvd3MgKSApO1xuXHRcdCR2YWx1ZUhvbGRlci52YWwoIHJhd1ZhbHVlcyApLnRyaWdnZXIoICdjaGFuZ2UnICk7XG5cdH1cblxuXHRmdW5jdGlvbiB0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCB0YWJsZUlkZW50aWZpZXIgKTtcblx0XHRjb25zdCB0YWJsZVJvd3MgICAgID0gJGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKS5jaGlsZHJlbigpO1xuXG5cdFx0aWYgKCAyID4gdGFibGVSb3dzLmxlbmd0aCApIHtcblx0XHRcdCRvcHRpb25zVGFibGUucmVtb3ZlQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH1cblxuXHQvLyBSZW1vdmUgT3B0aW9uXG5cdGNvbnN0IHJlbW92ZUJ0bklkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnIC5yZW1vdmUtb3B0aW9uJztcblxuXHRmaWVsZFdyYXBwZXIub24oICdjbGljaycsIHJlbW92ZUJ0bklkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRpdGVtICA9ICQoIHRoaXMgKS5jbG9zZXN0KCByb3dJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgJGZpZWxkID0gJGl0ZW0uY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKTtcblxuXHRcdCRpdGVtLnJlbW92ZSgpO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQ2xlYXIgQWxsIE9wdGlvbnNcblx0Y29uc3QgY2xlYXJPcHRpb25zQnRuSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgLmNsZWFyLW9wdGlvbnMnO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2NsaWNrJywgY2xlYXJPcHRpb25zQnRuSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0JGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKS5lbXB0eSgpO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICk7XG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQWRkIE5ldyBPcHRpb25cblx0Y29uc3QgYWRkT3B0aW9uQnRuSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgLmFkZC1vcHRpb24nO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2NsaWNrJywgYWRkT3B0aW9uQnRuSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyByb3dUZW1wbGF0ZUlkICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIHJvd1RlbXBsYXRlSWQgKTtcblx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCByb3dEZWZhdWx0T3B0aW9ucyApO1xuXHRcdGNvbnN0ICR0YWJsZSAgID0gJGZpZWxkLmZpbmQoIHRhYmxlSWRlbnRpZmllciApO1xuXHRcdGNvbnN0ICRyb3dzICAgID0gJGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKTtcblxuXHRcdCRyb3dzLmFwcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblxuXHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnbmV3X29wdGlvbl9hZGRlZCcsIFsgJGZpZWxkIF0gKTtcblxuXHRcdGlmICggISAkdGFibGUuaGFzQ2xhc3MoICdoYXMtb3B0aW9ucycgKSApIHtcblx0XHRcdCR0YWJsZS5hZGRDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fSApO1xuXG5cdC8vIFRyaWdnZXIgb3B0aW9ucyBjaGFuZ2Ugd2hlbiB0aGUgdGV4dCBmaWVsZHMgZ2V0IGNoYW5nZWQuXG5cdGNvbnN0IHRleHRGaWVsZHNJZGVudGlmaWVyID0gdGFibGVSb3dzSWRlbnRpZmllciArICcgaW5wdXRbdHlwZT1cInRleHRcIl0nO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2lucHV0JywgdGV4dEZpZWxkc0lkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIFRyaWdnZXIgb3B0aW9ucyBjaGFuZ2Ugd2hlbiB0aGUgc2VsZWN0IGZpZWxkcyBnZXQgY2hhbmdlZC5cblx0bGV0IHNlbGVjdEZpZWxkc0lkZW50aWZpZXIgPSB0YWJsZVJvd3NJZGVudGlmaWVyICsgJyBzZWxlY3QnO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2NoYW5nZScsIHNlbGVjdEZpZWxkc0lkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIFRyaWdnZXIgb3B0aW9ucyBjaGFuZ2Ugd2hlbiB2YWx1ZSBpcyBhZGRlZCBmcm9tIG1vZGFsLlxuXHRmaWVsZFdyYXBwZXIub24oICd0cmlnZ2VyX29wdGlvbnNfdGFibGUnLCBmdW5jdGlvbiggZSwgdGFibGVJZCwgJGZpZWxkICkge1xuXHRcdGlmICggdGFibGVJZCA9PT0gdGFibGVJZGVudGlmaWVyICkge1xuXHRcdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHRcdH1cblx0fSApO1xuXG59XG4iLCIvKipcbiAqIFRoZSBudW1iZXIgdWkgb3B0aW9ucy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblxuXHQvKipcblx0ICogVG9nZ2xlIGRpc2FibGVkIGF0dHJpYnV0ZSBvZiBtaW4tdmFsdWUgZmllbGQgZm9yIG51bWJlciB0eXBlLlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJGVsbSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgID0gJGVsbS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJHRleHRGaWVsZCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZSBpbnB1dFt0eXBlPVwidGV4dFwiXScgKTtcblxuXHRcdGlmICggJGVsbS5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0JHRleHRGaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCR0ZXh0RmllbGQucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdH1cblx0fVxuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0ZmllbGRXcmFwcGVyLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0XHR0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHRcdH0gKTtcblx0fSApO1xuXG5cdGZpZWxkV3JhcHBlci5vbihcblx0XHQnY2xpY2snLFxuXHRcdCcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0dG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJHRoaXMgKTtcblx0XHR9XG5cdCk7XG5cblx0LyoqXG5cdCAqIFRvZ2dsZSBkaXNhYmxlZCBhdHRyaWJ1dGUgb2YgbWF4LXZhbHVlIGZpZWxkIGZvciBudW1iZXIgdHlwZS5cblx0ICovXG5cdGZ1bmN0aW9uIHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICRlbG0gKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICA9ICRlbG0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICR0ZXh0RmllbGQgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWUgaW5wdXRbdHlwZT1cInRleHRcIl0nICk7XG5cblx0XHRpZiAoICRlbG0uaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdCR0ZXh0RmllbGQuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkdGV4dEZpZWxkLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHR9XG5cdH1cblxuXHRmaWVsZFdyYXBwZXIub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdGZpZWxkV3JhcHBlci5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0dG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCggJHRoaXMgKTtcblx0XHR9ICk7XG5cdH0gKTtcblxuXHRmaWVsZFdyYXBwZXIub24oXG5cdFx0J2NsaWNrJyxcblx0XHQnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fVxuXHQpO1xuXG59ICk7XG4iLCIvKipcbiAqIFBsdWdpbiBzZXR0aW5ncyBmb3JtLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRpZiAoICEgJCggJ2JvZHknICkuaGFzQ2xhc3MoICd3Y2FwZi1maWx0ZXJfcGFnZV93Y2FwZi1zZXR0aW5ncycgKSApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvLyBUb2dnbGUgcGFnaW5hdGlvbiBmaWVsZHMuXG5cdGZ1bmN0aW9uIGVuYWJsZVBhZ2luYXRpb24oIHZhbHVlICkge1xuXHRcdGNvbnN0ICRzZWxlY3RvciA9ICQoICcuc2V0dGluZ3MtdGFibGUtcGFnaW5hdGlvbl9jb250YWluZXInICk7XG5cblx0XHRpZiAoIHZhbHVlICkge1xuXHRcdFx0JHNlbGVjdG9yLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHNlbGVjdG9yLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRjb25zdCAkZW5hYmxlUGFnaW5hdGlvbiA9ICQoICcjZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXgnICk7XG5cblx0bGV0IGVuYWJsZVBhZ2luYXRpb25PbkxvYWQgPSBmYWxzZTtcblxuXHRpZiAoICRlbmFibGVQYWdpbmF0aW9uLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0ZW5hYmxlUGFnaW5hdGlvbk9uTG9hZCA9IHRydWU7XG5cdH1cblxuXHRlbmFibGVQYWdpbmF0aW9uKCBlbmFibGVQYWdpbmF0aW9uT25Mb2FkICk7XG5cblx0JGVuYWJsZVBhZ2luYXRpb24ub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRsZXQgX2VuYWJsZVBhZ2luYXRpb24gPSBmYWxzZTtcblxuXHRcdGlmICggJCggdGhpcyApLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRfZW5hYmxlUGFnaW5hdGlvbiA9IHRydWU7XG5cdFx0fVxuXG5cdFx0ZW5hYmxlUGFnaW5hdGlvbiggX2VuYWJsZVBhZ2luYXRpb24gKTtcblx0fSApO1xuXG5cdC8vIFRvZ2dsZSBzY3JvbGwgd2luZG93IGZpZWxkcy5cblx0ZnVuY3Rpb24gc2Nyb2xsV2luZG93KCB2YWx1ZSApIHtcblx0XHRjb25zdCBkZXBlbmRlbnRGaWVsZHMgPSAnLnNjcm9sbC13aW5kb3ctZGVwZW5kZW50LWZpZWxkcywnICtcblx0XHRcdCcuc2Nyb2xsLXdpbmRvdy1jdXN0b20tZWxlbWVudC1pbnB1dCwnICtcblx0XHRcdCcuc2V0dGluZ3MtdGFibGUtc2Nyb2xsX3RvX3RvcF9vZmZzZXQnO1xuXG5cdFx0aWYgKCAnbm9uZScgPT09IHZhbHVlICkge1xuXHRcdFx0JCggZGVwZW5kZW50RmllbGRzICkuaGlkZSgpO1xuXHRcdH0gZWxzZSBpZiAoICdyZXN1bHRzJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHQkKCAnLnNjcm9sbC13aW5kb3ctZGVwZW5kZW50LWZpZWxkcywgLnNldHRpbmdzLXRhYmxlLXNjcm9sbF90b190b3Bfb2Zmc2V0JyApLnNob3coKTtcblx0XHRcdCQoICcuc2Nyb2xsLXdpbmRvdy1jdXN0b20tZWxlbWVudC1pbnB1dCcgKS5oaWRlKCk7XG5cdFx0fSBlbHNlIGlmICggJ2N1c3RvbScgPT09IHZhbHVlICkge1xuXHRcdFx0JCggJy5zY3JvbGwtd2luZG93LWN1c3RvbS1lbGVtZW50LWlucHV0JyApLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JCggZGVwZW5kZW50RmllbGRzICkuc2hvdygpO1xuXHRcdH1cblx0fVxuXG5cdGNvbnN0ICRzY3JvbGxXaW5kb3cgPSAkKCAnI3Njcm9sbF93aW5kb3cnICk7XG5cblx0c2Nyb2xsV2luZG93KCAkc2Nyb2xsV2luZG93LnZhbCgpICk7XG5cblx0JHNjcm9sbFdpbmRvdy5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IHZhbHVlID0gJCggdGhpcyApLnZhbCgpO1xuXG5cdFx0c2Nyb2xsV2luZG93KCB2YWx1ZSApO1xuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIHByb2R1Y3Qgc3RhdHVzIGZpZWxkLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcblxuXHRjb25zdCB0YWJsZUlkZW50aWZpZXIgPSAnLnByb2R1Y3Qtc3RhdHVzLW9wdGlvbnMtdGFibGUnO1xuXHRjb25zdCB2YWx1ZUlkZW50aWZpZXIgPSAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXByb2R1Y3Rfc3RhdHVzX29wdGlvbnMgaW5wdXQnO1xuXHRjb25zdCByb3dUZW1wbGF0ZUlkICAgPSAnd2NhcGYtcHJvZHVjdC1zdGF0dXMtb3B0aW9uJztcblxuXHRpbml0TWFudWFsT3B0aW9uc1RhYmxlKCB0YWJsZUlkZW50aWZpZXIsIHZhbHVlSWRlbnRpZmllciwgcm93VGVtcGxhdGVJZCApO1xuXG59ICk7XG4iLCIvKipcbiAqIFRoZSB0b2dnbGUgdmlzaWJpbGl0eSBzY3JpcHRzLlxuICpcbiAqIE5PVEU6IFRoZXNlIHNjcmlwdHMgbXVzdCBiZSBsb2NhdGVkIGF0IHRoZSB2ZXJ5IGJvdHRvbSBvZiB0aGUgY29tYmluZWQgc2NyaXB0cy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblxuXHRjb25zdCBkZXBlbmRhbnREYXRhID0gW1xuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS10ZXh0LWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGV4dCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS1udW1iZXItZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdudW1iZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtZGF0ZS1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2RhdGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLnZhbHVlLWRlY2ltYWwtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdudW1iZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXF1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NoZWNrYm94JywgJ211bHRpLXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYWRpbycsICdzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3NlbGVjdCcsICdtdWx0aS1zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jYXRlZ29yeV9pbWFnZXMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2ltYWdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfbXVsdGlwbGVfZmlsdGVyJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdsYWJlbCcsICdjb2xvcicsICdpbWFnZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuY29sdW1uLWdyb3VwLWN1c3RvbV9hcHBlYXJhbmNlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjb2xvcicsICdpbWFnZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1oaWVyYXJjaGljYWwgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXZhbHVlX2RlY2ltYWwgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfZGVjaW1hbF9wbGFjZXMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWdldF9vcHRpb25zIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmNvbHVtbi1ncm91cC1tZXRhX2tleV9tYW51YWxfb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbWFudWFsX2VudHJ5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NsaWRlcl9kaXNwbGF5X3ZhbHVlc19hcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGlnbl92YWx1ZXNfYXRfdGhlX2VuZCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfcXVlcnlfdHlwZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zZWxlY3RfYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9lbmFibGVfbXVsdGlwbGVfZmlsdGVyJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3Nob3dfY291bnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcsICdyYW5nZV9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2hpZGVfZW1wdHknLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcsICdyYW5nZV9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLWRlY2ltYWwtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInLCAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JywgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfdXNlX2Nob3NlbiBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2dldF9vcHRpb25zIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1hdXRvbWF0aWMtb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnYXV0b21hdGljYWxseScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdtYW51YWxfZW50cnknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRhdGVfZGlzcGxheV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuZGF0ZS10by11aS1vcHRpb25zJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbnB1dF9kYXRlX3JhbmdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kYXRlX2Zvcm1hdCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5wdXRfZGF0ZScsICdpbnB1dF9kYXRlX3JhbmdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1zaG93X2RhdGVfaW5wdXRzX2lubGluZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5wdXRfZGF0ZV9yYW5nZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuZGF0ZS1waWNrZXItZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbnB1dF9kYXRlJywgJ2lucHV0X2RhdGVfcmFuZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3F1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2NoZWNrYm94JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9zZWxlY3RfYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9yYWRpbycsICd0aW1lX3BlcmlvZF9zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3VzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX3NlbGVjdCcsICd0aW1lX3BlcmlvZF9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfZW5hYmxlX211bHRpcGxlX2ZpbHRlcicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3Nob3dfY291bnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2NoZWNrYm94JywgJ3RpbWVfcGVyaW9kX3JhZGlvJywgJ3RpbWVfcGVyaW9kX3NlbGVjdCcsICd0aW1lX3BlcmlvZF9tdWx0aXNlbGVjdCcsICd0aW1lX3BlcmlvZF9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfaGlkZV9lbXB0eScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfY2hlY2tib3gnLCAndGltZV9wZXJpb2RfcmFkaW8nLCAndGltZV9wZXJpb2Rfc2VsZWN0JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JywgJ3RpbWVfcGVyaW9kX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF91c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9zb2Z0X2xpbWl0IGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNvZnRfbGltaXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRheG9ub215IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWN1c3RvbS10YXhvbm9teSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tZXRhX2tleSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1wb3N0X3Byb3BlcnR5IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWxpbWl0X29wdGlvbnMgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1wYXJlbnRfdGVybScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY2hpbGQnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWxpbWl0X3ZhbHVlc19ieV9pZCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5jbHVkZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZXhjbHVkZV92YWx1ZXNfaWQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2V4Y2x1ZGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9hY2NvcmRpb24gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWNjb3JkaW9uX2RlZmF1bHRfc3RhdGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jYXRlZ29yeV9pbWFnZXMgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9lbmFibGVfbXVsdGlwbGVfZmlsdGVyIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9lbmFibGVfbXVsdGlwbGVfZmlsdGVyIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfY2xlYXJfYWxsX2J1dHRvbiBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5jbGVhci1hbGwtYnV0dG9uLWZpZWxkcy1zdGFydCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtc2hvd19pZl9lbXB0eSBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbXB0eV9maWx0ZXJfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtc2hvd190aXRsZSBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tb3ZlX2NsZWFyX2FsbF9idXR0b25faW5fdGl0bGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW9yZGVyX3Rlcm1zX2J5IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFjdGl2ZV9maWx0ZXJzX2xheW91dCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5zaW1wbGUtbGF5b3V0LXNvZnQtZmllbGRzLXN0YXJ0Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdzaW1wbGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmV4dGVuZGVkLWxheW91dC1zb2Z0LWZpZWxkcy1zdGFydCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnZXh0ZW5kZWQnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9zb2Z0X2xpbWl0X2Zvcl9leHRlbmRlZF9sYXlvdXQgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtc29mdF9saW1pdF9mb3JfZXh0ZW5kZWRfbGF5b3V0Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfdG9vbHRpcCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1zaG93X2NvdW50X2luX3Rvb2x0aXAnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRvb2x0aXBfcG9zaXRpb24nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdF07XG5cblx0ZnVuY3Rpb24gX2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgPSBjdXJyZW50U2VsZWN0b3IuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0IGhhbmRsZXIgICAgID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0Y29uc3QgaGFuZGxlclR5cGUgPSBkYXRhWyAnaGFuZGxlclR5cGUnIF07XG5cdFx0Y29uc3QgZGVwZW5kYW50ICAgPSBkYXRhWyAnZGVwZW5kYW50JyBdO1xuXG5cdFx0bGV0IF92YWx1ZSA9IHZhbHVlO1xuXG5cdFx0aWYgKCAnY2hlY2tib3gnID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9IGN1cnJlbnRTZWxlY3Rvci5pcyggJzpjaGVja2VkJyApID8gJzEnIDogJzAnO1xuXHRcdH1cblxuXHRcdGlmICggJ3JhZGlvJyA9PT0gaGFuZGxlclR5cGUgKSB7XG5cdFx0XHRfdmFsdWUgPSAkZmllbGQuZmluZCggaGFuZGxlciArICc6Y2hlY2tlZCcgKS52YWwoKTtcblx0XHR9XG5cblx0XHQkLmVhY2goIGRlcGVuZGFudCwgZnVuY3Rpb24oIGlkLCBkICkge1xuXHRcdFx0Y29uc3QgJHNlbGVjdG9yICAgPSAkZmllbGQuZmluZCggZFsgJ3NlbGVjdG9yJyBdICk7XG5cdFx0XHRjb25zdCB2YWxpZFZhbHVlcyA9IGRbICd2YWx1ZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZFZhbHVlcy5pbmNsdWRlcyggX3ZhbHVlICkgKSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc2VsZWN0b3IuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBbIGhhbmRsZXIsIF92YWx1ZSwgJGZpZWxkIF0gKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0aWYgKCBudWxsID09PSBjdXJyZW50U2VsZWN0b3IgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyICA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdFx0Y29uc3QgJGhhbmRsZXIgPSAkKCBoYW5kbGVyICk7XG5cblx0XHRcdCQuZWFjaCggJGhhbmRsZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IF92YWx1ZSA9IF90aGlzLnZhbCgpO1xuXHRcdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgX3RoaXMsIF92YWx1ZSApO1xuXHRcdFx0fSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNldHVwRmllbGQoIGluaXRhbCA9IGZhbHNlICkge1xuXHRcdCQuZWFjaCggZGVwZW5kYW50RGF0YSwgZnVuY3Rpb24oIGksIGRhdGEgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0XHRjb25zdCBldmVudCAgID0gZGF0YVsgJ2V2ZW50JyBdO1xuXG5cdFx0XHRoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBudWxsLCBudWxsICk7XG5cblx0XHRcdGlmICggaW5pdGFsICkge1xuXHRcdFx0XHRmaWVsZFdyYXBwZXIub24oIGV2ZW50LCBoYW5kbGVyLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0Y29uc3QgX3ZhbHVlID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHRcdGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIF90aGlzLCBfdmFsdWUgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGlmICggISAkKCBmaWVsZFdyYXBwZXIgKS5oYXNDbGFzcyggJ2xvYWRlZCcgKSApIHtcblx0XHRcdFx0XHQkKCBmaWVsZFdyYXBwZXIgKS5hZGRDbGFzcyggJ2xvYWRlZCcgKTtcblxuXHRcdFx0XHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnZmllbGRfYWRkZWQnICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRzZXR1cEZpZWxkKCB0cnVlICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHQvLyBUb2dnbGUgdGhlIHZpc2liaWxpdHkgb2Ygc3ViZmllbGRzLlxuXHRcdHNldHVwRmllbGQoKTtcblx0fSApO1xuXG59ICk7XG4iXX0=
