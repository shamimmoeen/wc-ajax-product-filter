"use strict";

/**
 * Display type fields.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     wptools.io
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
 * @author     wptools.io
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
 * @author     wptools.io
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
 * @author     wptools.io
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
 * @author     wptools.io
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
 * @author     wptools.io
 */
jQuery(document).ready(function ($) {
  if (!$('body').hasClass('wcapf-filter_page_wcapf-settings')) {
    return;
  } // Media uploader.


  $('.upload-image-button').click(function (e) {
    e.preventDefault();
    var $button = $(this);
    var $wrapper = $button.closest('.media-upload');
    var modalTitle = $button.attr('data-modal-title');
    var image = wp.media({
      title: modalTitle,
      multiple: false
    }).open().on('select', function () {
      var uploadedImage = image.state().get('selection').first();
      var imageData = uploadedImage.toJSON();
      var imageUrl = imageData.url;
      $wrapper.find('.image-id').val(imageData.id);
      $wrapper.find('.image-src').attr('src', imageUrl);
      $wrapper.removeClass('no-image');
    });
  });
  $('.remove-image-button').on('click', function (e) {
    e.preventDefault();
    var $button = $(this);
    var $wrapper = $button.closest('.media-upload');
    $wrapper.find('.image-id').val('');
    $wrapper.find('.image-src').attr('src', '');
    $wrapper.addClass('no-image');
  }); // Toggle loading image field.

  function toggleLoadingImage(value) {
    var $selector = $('.settings-table-loading_image');

    if (value) {
      $selector.show();
    } else {
      $selector.hide();
    }
  }

  var $enableLoadingOverlay = $('#loading_animation');
  var enableLoadingOverlay = false;

  if ($enableLoadingOverlay.is(':checked')) {
    enableLoadingOverlay = true;
  }

  toggleLoadingImage(enableLoadingOverlay);
  $enableLoadingOverlay.on('change', function () {
    var _enableLoadingOverlay = false;

    if ($(this).is(':checked')) {
      _enableLoadingOverlay = true;
    }

    toggleLoadingImage(_enableLoadingOverlay);
  }); // Toggle pagination fields.

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
      $('.scroll-window-dependent-fields, .settings-table-scroll_to_top_offset').show();
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
 * @author     wptools.io
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
 * @author     wptools.io
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
    }, {
      'selector': '.wcapf-form-sub-field-include_user_roles',
      'value': ['user_roles']
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbS1hcHBlYXJhbmNlLWZpZWxkcy5qcyIsImRpc3BsYXktdHlwZS1maWVsZHMuanMiLCJmaWVsZC1tZXRhLWJveC5qcyIsIm1hbnVhbC1vcHRpb25zLXRhYmxlLmpzIiwibnVtYmVyLXVpLW9wdGlvbnMuanMiLCJwbHVnaW4tc2V0dGluZ3MuanMiLCJwcm9kdWN0LXN0YXR1cy10YWJsZS5qcyIsInRvZ2dsZVZpc2liaWxpdHkuanMiXSwibmFtZXMiOlsialF1ZXJ5IiwiZG9jdW1lbnQiLCJyZWFkeSIsIiQiLCJmaWVsZFdyYXBwZXIiLCJvbiIsImUiLCJoYW5kbGVyIiwidmFsdWUiLCIkZmllbGQiLCIkcXVlcnlUeXBlIiwiZmluZCIsInZhbGlkRGlzcGxheVR5cGVzIiwiaW5jbHVkZXMiLCIkbXVsdGlwbGVGaWx0ZXIiLCJpcyIsInNob3ciLCJoaWRlIiwiJGRpc3BsYXlUeXBlIiwiZGlzcGxheVR5cGUiLCJ2YWwiLCIkaHJGaWVsZHMiLCIkaGllcmFyY2hpY2FsIiwidXNlSGllcmFyY2hpY2FsIiwiJGhyQWNjb3JkaW9uIiwiJG5vUmVzdWx0cyIsIiRhbGxJdGVtc0xhYmVsIiwidXNlQ2hvc2VuIiwiZmllbGRJbnB1dCIsImZpZWxkU3RhdGVzIiwic3RvcmVGaWVsZFN0YXRlIiwiZmllbGRUeXBlIiwiYXR0ciIsImZpZWxkVmFsdWVzIiwiZWFjaCIsIiRpbnB1dCIsInR5cGUiLCJuYW1lIiwibWFudWFsT3B0aW9ucyIsInVwZGF0ZUZpZWxkU3RhdGUiLCIkZWxtIiwiZmllbGRTdGF0ZSIsImhhc0NsYXNzIiwibWFudWFsX29wdGlvbnMiLCIkdGhpcyIsImFwcGx5RmllbGRTdGF0ZSIsInJlbW92ZUF0dHIiLCJyYXdPcHRpb25zIiwiaW5wdXROYW1lIiwicmF3IiwiJHJhd0lucHV0IiwiSlNPTiIsInBhcnNlIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwibGVuZ3RoIiwidGFibGVJZGVudGlmaWVyIiwicm93VGVtcGxhdGVJZCIsInJvd3NJZGVudGlmaWVyIiwicm93SWRlbnRpZmllciIsIiR0YWJsZSIsIiRyb3dzIiwiaSIsIm9wdGlvbiIsInRlbXBsYXRlIiwid3AiLCJyb3dEZWZhdWx0T3B0aW9ucyIsInJlbmRlcmVkIiwiYXBwZW5kIiwiJGxhc3RSb3ciLCJsYXN0IiwiYWRkQ2xhc3MiLCJ0cmlnZ2VyIiwiX2ZpZWxkVHlwZSIsImZpZWxkTmFtZSIsImZpZWxkRGF0YVdyYXBwZXIiLCJmaWVsZE5hbWVXcmFwcGVyIiwiZmllbGRJbnNpZGUiLCJyZW1vdmVDbGFzcyIsImh0bWwiLCJpbml0TWFudWFsT3B0aW9uc1RhYmxlIiwidmFsdWVJZGVudGlmaWVyIiwiZmllbGRJZGVudGlmaWVyIiwiaW5pdFNvcnRhYmxlVGFibGUiLCIkc2VsZWN0b3IiLCJzb3J0YWJsZSIsIm9wYWNpdHkiLCJyZXZlcnQiLCJjdXJzb3IiLCJheGlzIiwiaGFuZGxlIiwicGxhY2Vob2xkZXIiLCJ1cGRhdGUiLCJ0YXJnZXQiLCJjbG9zZXN0IiwidHJpZ2dlck9wdGlvbnNDaGFuZ2UiLCJkaXNhYmxlU2VsZWN0aW9uIiwidGFibGVSb3dzSWRlbnRpZmllciIsIiR2YWx1ZUhvbGRlciIsIl9yb3dzIiwiX2l0ZW0iLCIkaXRlbSIsIm9iaiIsImZpZWxkSW5kZXgiLCJmaWVsZCIsInB1c2giLCJyYXdWYWx1ZXMiLCJlbmNvZGVVUklDb21wb25lbnQiLCJzdHJpbmdpZnkiLCJ0cmlnZ2VyUmVtb3ZlT3B0aW9uIiwiJG9wdGlvbnNUYWJsZSIsInRhYmxlUm93cyIsImNoaWxkcmVuIiwicmVtb3ZlQnRuSWRlbnRpZmllciIsInJlbW92ZSIsImNsZWFyT3B0aW9uc0J0bklkZW50aWZpZXIiLCJlbXB0eSIsImFkZE9wdGlvbkJ0bklkZW50aWZpZXIiLCJ0ZXh0RmllbGRzSWRlbnRpZmllciIsInNlbGVjdEZpZWxkc0lkZW50aWZpZXIiLCJ0YWJsZUlkIiwidG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCIsIiR0ZXh0RmllbGQiLCJ0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkIiwiY2xpY2siLCJwcmV2ZW50RGVmYXVsdCIsIiRidXR0b24iLCIkd3JhcHBlciIsIm1vZGFsVGl0bGUiLCJpbWFnZSIsIm1lZGlhIiwidGl0bGUiLCJtdWx0aXBsZSIsIm9wZW4iLCJ1cGxvYWRlZEltYWdlIiwic3RhdGUiLCJnZXQiLCJmaXJzdCIsImltYWdlRGF0YSIsInRvSlNPTiIsImltYWdlVXJsIiwidXJsIiwiaWQiLCJ0b2dnbGVMb2FkaW5nSW1hZ2UiLCIkZW5hYmxlTG9hZGluZ092ZXJsYXkiLCJlbmFibGVMb2FkaW5nT3ZlcmxheSIsIl9lbmFibGVMb2FkaW5nT3ZlcmxheSIsImVuYWJsZVBhZ2luYXRpb24iLCIkZW5hYmxlUGFnaW5hdGlvbiIsImVuYWJsZVBhZ2luYXRpb25PbkxvYWQiLCJfZW5hYmxlUGFnaW5hdGlvbiIsInNjcm9sbFdpbmRvdyIsImRlcGVuZGVudEZpZWxkcyIsIiRzY3JvbGxXaW5kb3ciLCJkZXBlbmRhbnREYXRhIiwiX2hhbmRsZVRvZ2dsZVJlcXVlc3QiLCJkYXRhIiwiY3VycmVudFNlbGVjdG9yIiwiaGFuZGxlclR5cGUiLCJkZXBlbmRhbnQiLCJfdmFsdWUiLCJkIiwidmFsaWRWYWx1ZXMiLCJoYW5kbGVUb2dnbGVSZXF1ZXN0IiwiJGhhbmRsZXIiLCJfdGhpcyIsInNldHVwRmllbGQiLCJpbml0YWwiLCJldmVudCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixVQUFVQyxDQUFWLEVBQWM7QUFFdkMsTUFBTUMsWUFBWSxHQUFHRCxDQUFDLENBQUUsdUJBQUYsQ0FBdEI7QUFFQUMsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLHNCQUFqQixFQUF5QyxVQUFVQyxDQUFWLEVBQWFDLE9BQWIsRUFBc0JDLEtBQXRCLEVBQTZCQyxNQUE3QixFQUFzQztBQUM5RSxRQUFLLGdEQUFnREYsT0FBckQsRUFBK0Q7QUFDOUQsVUFBTUcsVUFBVSxHQUFVRCxNQUFNLENBQUNFLElBQVAsQ0FBYSxrQ0FBYixDQUExQjtBQUNBLFVBQU1DLGlCQUFpQixHQUFHLENBQUUsT0FBRixFQUFXLE9BQVgsRUFBb0IsT0FBcEIsQ0FBMUI7O0FBRUEsVUFBS0EsaUJBQWlCLENBQUNDLFFBQWxCLENBQTRCTCxLQUE1QixDQUFMLEVBQTJDO0FBQzFDLFlBQU1NLGVBQWUsR0FBR0wsTUFBTSxDQUFDRSxJQUFQLENBQWEsb0RBQWIsQ0FBeEI7O0FBRUEsWUFBS0csZUFBZSxDQUFDQyxFQUFoQixDQUFvQixVQUFwQixDQUFMLEVBQXdDO0FBQ3ZDTCxVQUFBQSxVQUFVLENBQUNNLElBQVg7QUFDQSxTQUZELE1BRU87QUFDTk4sVUFBQUEsVUFBVSxDQUFDTyxJQUFYO0FBQ0E7QUFDRDtBQUNEO0FBQ0QsR0FmRDtBQWlCQWIsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLHNCQUFqQixFQUF5QyxVQUFVQyxDQUFWLEVBQWFDLE9BQWIsRUFBc0JDLEtBQXRCLEVBQTZCQyxNQUE3QixFQUFzQztBQUM5RSxRQUFLLHlEQUF5REYsT0FBOUQsRUFBd0U7QUFDdkUsVUFBTUcsVUFBVSxHQUFVRCxNQUFNLENBQUNFLElBQVAsQ0FBYSxrQ0FBYixDQUExQjtBQUNBLFVBQU1PLFlBQVksR0FBUVQsTUFBTSxDQUFDRSxJQUFQLENBQWEsMkNBQWIsQ0FBMUI7QUFDQSxVQUFNUSxXQUFXLEdBQVNELFlBQVksQ0FBQ0UsR0FBYixFQUExQjtBQUNBLFVBQU1SLGlCQUFpQixHQUFHLENBQUUsT0FBRixFQUFXLE9BQVgsRUFBb0IsT0FBcEIsQ0FBMUI7O0FBRUEsVUFBS0EsaUJBQWlCLENBQUNDLFFBQWxCLENBQTRCTSxXQUE1QixDQUFMLEVBQWlEO0FBQ2hELFlBQUssUUFBUVgsS0FBYixFQUFxQjtBQUNwQkUsVUFBQUEsVUFBVSxDQUFDTSxJQUFYO0FBQ0EsU0FGRCxNQUVPO0FBQ05OLFVBQUFBLFVBQVUsQ0FBQ08sSUFBWDtBQUNBO0FBQ0Q7QUFDRDtBQUNELEdBZkQ7QUFpQkEsQ0F0Q0Q7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQWpCLE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixVQUFVQyxDQUFWLEVBQWM7QUFFdkMsTUFBTUMsWUFBWSxHQUFHRCxDQUFDLENBQUUsdUJBQUYsQ0FBdEIsQ0FGdUMsQ0FJdkM7O0FBQ0FDLEVBQUFBLFlBQVksQ0FBQ0MsRUFBYixDQUFpQixzQkFBakIsRUFBeUMsVUFBVUMsQ0FBVixFQUFhQyxPQUFiLEVBQXNCQyxLQUF0QixFQUE2QkMsTUFBN0IsRUFBc0M7QUFDOUUsUUFBSyxnREFBZ0RGLE9BQXJELEVBQStEO0FBQzlELFVBQU1jLFNBQVMsR0FBU1osTUFBTSxDQUFDRSxJQUFQLENBQWEsc0JBQWIsQ0FBeEI7QUFDQSxVQUFNVyxhQUFhLEdBQUtiLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLG9DQUFiLENBQXhCO0FBQ0EsVUFBTVksZUFBZSxHQUFHRCxhQUFhLENBQUNYLElBQWQsQ0FBb0IsT0FBcEIsRUFBOEJJLEVBQTlCLENBQWtDLFVBQWxDLENBQXhCO0FBQ0EsVUFBTVMsWUFBWSxHQUFNZixNQUFNLENBQUNFLElBQVAsQ0FBYSxrREFBYixDQUF4Qjs7QUFFQSxVQUFLLGVBQWVILEtBQWYsSUFBd0IsWUFBWUEsS0FBekMsRUFBaUQ7QUFDaERhLFFBQUFBLFNBQVMsQ0FBQ0wsSUFBVjs7QUFFQSxZQUFLTyxlQUFMLEVBQXVCO0FBQ3RCQyxVQUFBQSxZQUFZLENBQUNSLElBQWI7QUFDQSxTQUZELE1BRU87QUFDTlEsVUFBQUEsWUFBWSxDQUFDUCxJQUFiO0FBQ0E7QUFDRCxPQVJELE1BUU8sSUFBSyxhQUFhVCxLQUFiLElBQXNCLG1CQUFtQkEsS0FBOUMsRUFBc0Q7QUFDNURhLFFBQUFBLFNBQVMsQ0FBQ0wsSUFBVjtBQUNBUSxRQUFBQSxZQUFZLENBQUNQLElBQWI7QUFDQSxPQUhNLE1BR0E7QUFDTkksUUFBQUEsU0FBUyxDQUFDSixJQUFWO0FBQ0E7QUFDRDtBQUNELEdBdEJELEVBTHVDLENBNkJ2Qzs7QUFDQWIsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLHNCQUFqQixFQUF5QyxVQUFVQyxDQUFWLEVBQWFDLE9BQWIsRUFBc0JDLEtBQXRCLEVBQTZCQyxNQUE3QixFQUFzQztBQUM5RSxRQUFLLCtDQUErQ0YsT0FBcEQsRUFBOEQ7QUFDN0QsVUFBTVksV0FBVyxHQUFJVixNQUFNLENBQUNFLElBQVAsQ0FBYSwyQ0FBYixFQUEyRFMsR0FBM0QsRUFBckI7QUFDQSxVQUFNSSxZQUFZLEdBQUdmLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLGtEQUFiLENBQXJCOztBQUVBLFVBQUssUUFBUUgsS0FBYixFQUFxQjtBQUNwQixZQUFLLGVBQWVXLFdBQWYsSUFBOEIsWUFBWUEsV0FBL0MsRUFBNkQ7QUFDNURLLFVBQUFBLFlBQVksQ0FBQ1IsSUFBYjtBQUNBLFNBRkQsTUFFTztBQUNOUSxVQUFBQSxZQUFZLENBQUNQLElBQWI7QUFDQTtBQUNELE9BTkQsTUFNTztBQUNOTyxRQUFBQSxZQUFZLENBQUNQLElBQWI7QUFDQTtBQUNEO0FBQ0QsR0FmRCxFQTlCdUMsQ0ErQ3ZDOztBQUNBYixFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUIsc0JBQWpCLEVBQXlDLFVBQVVDLENBQVYsRUFBYUMsT0FBYixFQUFzQkMsS0FBdEIsRUFBNkJDLE1BQTdCLEVBQXNDO0FBQzlFLFFBQUssZ0RBQWdERixPQUFyRCxFQUErRDtBQUM5RCxVQUFNa0IsVUFBVSxHQUFPaEIsTUFBTSxDQUFDRSxJQUFQLENBQWEsaURBQWIsQ0FBdkI7QUFDQSxVQUFNZSxjQUFjLEdBQUdqQixNQUFNLENBQUNFLElBQVAsQ0FBYSx1Q0FBYixDQUF2QjtBQUNBLFVBQU1nQixTQUFTLEdBQVFsQixNQUFNLENBQUNFLElBQVAsQ0FBYSx3Q0FBYixFQUF3REksRUFBeEQsQ0FBNEQsVUFBNUQsQ0FBdkI7O0FBRUEsVUFBS1ksU0FBUyxLQUFNLGFBQWFuQixLQUFiLElBQXNCLG1CQUFtQkEsS0FBL0MsQ0FBZCxFQUF1RTtBQUN0RWlCLFFBQUFBLFVBQVUsQ0FBQ1QsSUFBWDtBQUNBLE9BRkQsTUFFTztBQUNOUyxRQUFBQSxVQUFVLENBQUNSLElBQVg7QUFDQTs7QUFFRCxVQUFPLFlBQVlULEtBQVosSUFBcUIsYUFBYUEsS0FBcEMsSUFBaUQsbUJBQW1CQSxLQUFuQixJQUE0Qm1CLFNBQWxGLEVBQWdHO0FBQy9GRCxRQUFBQSxjQUFjLENBQUNWLElBQWY7QUFDQSxPQUZELE1BRU87QUFDTlUsUUFBQUEsY0FBYyxDQUFDVCxJQUFmO0FBQ0E7QUFDRDtBQUNELEdBbEJELEVBaER1QyxDQW9FdkM7O0FBQ0FiLEVBQUFBLFlBQVksQ0FBQ0MsRUFBYixDQUFpQixzQkFBakIsRUFBeUMsVUFBVUMsQ0FBVixFQUFhQyxPQUFiLEVBQXNCQyxLQUF0QixFQUE2QkMsTUFBN0IsRUFBc0M7QUFDOUUsUUFBSyw2Q0FBNkNGLE9BQWxELEVBQTREO0FBQzNELFVBQU1rQixVQUFVLEdBQU9oQixNQUFNLENBQUNFLElBQVAsQ0FBYSxpREFBYixDQUF2QjtBQUNBLFVBQU1lLGNBQWMsR0FBR2pCLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLHVDQUFiLENBQXZCO0FBQ0EsVUFBTVEsV0FBVyxHQUFNVixNQUFNLENBQUNFLElBQVAsQ0FBYSwyQ0FBYixFQUEyRFMsR0FBM0QsRUFBdkI7O0FBRUEsVUFBSyxRQUFRWixLQUFSLEtBQW1CLGFBQWFXLFdBQWIsSUFBNEIsbUJBQW1CQSxXQUFsRSxDQUFMLEVBQXVGO0FBQ3RGTSxRQUFBQSxVQUFVLENBQUNULElBQVg7QUFDQSxPQUZELE1BRU87QUFDTlMsUUFBQUEsVUFBVSxDQUFDUixJQUFYO0FBQ0E7O0FBRUQsVUFDRyxRQUFRVCxLQUFSLElBQWlCLG1CQUFtQlcsV0FBdEMsSUFDSyxZQUFZQSxXQUFaLElBQTJCLGFBQWFBLFdBRjlDLEVBR0U7QUFDRE8sUUFBQUEsY0FBYyxDQUFDVixJQUFmO0FBQ0EsT0FMRCxNQUtPO0FBQ05VLFFBQUFBLGNBQWMsQ0FBQ1QsSUFBZjtBQUNBO0FBQ0Q7QUFDRCxHQXJCRDtBQXVCQSxDQTVGRDs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBakIsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVDLENBQVYsRUFBYztBQUV2QyxNQUFNQyxZQUFZLEdBQUdELENBQUMsQ0FBRSx1QkFBRixDQUF0QjtBQUNBLE1BQU15QixVQUFVLEdBQUssNkJBQXJCO0FBQ0EsTUFBTUMsV0FBVyxHQUFJLEVBQXJCOztBQUVBLFdBQVNDLGVBQVQsR0FBMkI7QUFDMUIsUUFBTUMsU0FBUyxHQUFHM0IsWUFBWSxDQUFDTyxJQUFiLENBQW1CLGFBQW5CLEVBQW1DcUIsSUFBbkMsQ0FBeUMsaUJBQXpDLENBQWxCOztBQUVBLFFBQUssQ0FBRUQsU0FBUCxFQUFtQjtBQUNsQjtBQUNBOztBQUVELFFBQU1FLFdBQVcsR0FBRyxFQUFwQjtBQUVBN0IsSUFBQUEsWUFBWSxDQUFDTyxJQUFiLENBQW1CaUIsVUFBbkIsRUFBZ0NNLElBQWhDLENBQXNDLFlBQVc7QUFDaEQsVUFBTUMsTUFBTSxHQUFHaEMsQ0FBQyxDQUFFLElBQUYsQ0FBaEI7QUFDQSxVQUFNaUMsSUFBSSxHQUFLRCxNQUFNLENBQUNILElBQVAsQ0FBYSxNQUFiLENBQWY7QUFDQSxVQUFNSyxJQUFJLEdBQUtGLE1BQU0sQ0FBQ0gsSUFBUCxDQUFhLE1BQWIsQ0FBZjtBQUNBLFVBQU14QixLQUFLLEdBQUkyQixNQUFNLENBQUNmLEdBQVAsRUFBZjs7QUFFQSxVQUFLLGVBQWVnQixJQUFmLElBQXVCLFlBQVlBLElBQXhDLEVBQStDO0FBQzlDLFlBQUtELE1BQU0sQ0FBQ3BCLEVBQVAsQ0FBVyxVQUFYLENBQUwsRUFBK0I7QUFDOUJrQixVQUFBQSxXQUFXLENBQUVJLElBQUYsQ0FBWCxHQUFzQjdCLEtBQXRCO0FBQ0E7QUFDRCxPQUpELE1BSU87QUFDTnlCLFFBQUFBLFdBQVcsQ0FBRUksSUFBRixDQUFYLEdBQXNCN0IsS0FBdEI7QUFDQTtBQUNELEtBYkQsRUFUMEIsQ0F3QjFCOztBQUNBLFFBQU04QixhQUFhLEdBQUcsRUFBdEI7QUFFQWxDLElBQUFBLFlBQVksQ0FBQ08sSUFBYixDQUFtQixpQkFBbkIsRUFBdUN1QixJQUF2QyxDQUE2QyxZQUFXO0FBQ3ZELFVBQU1DLE1BQU0sR0FBR2hDLENBQUMsQ0FBRSxJQUFGLENBQWhCO0FBQ0EsVUFBTWtDLElBQUksR0FBS0YsTUFBTSxDQUFDSCxJQUFQLENBQWEsTUFBYixDQUFmO0FBRUFNLE1BQUFBLGFBQWEsQ0FBRUQsSUFBRixDQUFiLEdBQXdCRixNQUFNLENBQUNmLEdBQVAsRUFBeEI7QUFDQSxLQUxEO0FBT0FhLElBQUFBLFdBQVcsQ0FBRSxnQkFBRixDQUFYLEdBQWtDSyxhQUFsQztBQUVBVCxJQUFBQSxXQUFXLENBQUVFLFNBQUYsQ0FBWCxHQUEyQkUsV0FBM0I7QUFDQTs7QUFFRCxXQUFTTSxnQkFBVCxDQUEyQkMsSUFBM0IsRUFBa0M7QUFDakMsUUFBTVQsU0FBUyxHQUFJM0IsWUFBWSxDQUFDTyxJQUFiLENBQW1CLGFBQW5CLEVBQW1DcUIsSUFBbkMsQ0FBeUMsaUJBQXpDLENBQW5CO0FBQ0EsUUFBTVMsVUFBVSxHQUFHWixXQUFXLENBQUVFLFNBQUYsQ0FBOUI7QUFFQSxRQUFNTSxJQUFJLEdBQUlHLElBQUksQ0FBQ1IsSUFBTCxDQUFXLE1BQVgsQ0FBZDtBQUNBLFFBQU1JLElBQUksR0FBSUksSUFBSSxDQUFDUixJQUFMLENBQVcsTUFBWCxDQUFkO0FBQ0EsUUFBTXhCLEtBQUssR0FBR2dDLElBQUksQ0FBQ3BCLEdBQUwsRUFBZDs7QUFFQSxRQUFLb0IsSUFBSSxDQUFDRSxRQUFMLENBQWUsZ0JBQWYsQ0FBTCxFQUF5QztBQUN4QyxVQUFNQyxjQUFjLEdBQUdGLFVBQVUsQ0FBRSxnQkFBRixDQUFWLElBQWtDLEVBQXpEO0FBRUFFLE1BQUFBLGNBQWMsQ0FBRU4sSUFBRixDQUFkLEdBQXlCN0IsS0FBekI7QUFFQWlDLE1BQUFBLFVBQVUsQ0FBRSxnQkFBRixDQUFWLEdBQWlDRSxjQUFqQztBQUNBLEtBTkQsTUFNTztBQUNOLFVBQUssZUFBZVAsSUFBZixJQUF1QixZQUFZQSxJQUF4QyxFQUErQztBQUM5QyxZQUFNRCxNQUFNLEdBQUcvQixZQUFZLENBQUNPLElBQWIsQ0FBbUIsWUFBWTBCLElBQVosR0FBbUIsSUFBdEMsQ0FBZjs7QUFFQSxZQUFLRixNQUFNLENBQUNwQixFQUFQLENBQVcsVUFBWCxDQUFMLEVBQStCO0FBQzlCMEIsVUFBQUEsVUFBVSxDQUFFSixJQUFGLENBQVYsR0FBcUI3QixLQUFyQjtBQUNBLFNBRkQsTUFFTztBQUNOLGlCQUFPaUMsVUFBVSxDQUFFSixJQUFGLENBQWpCO0FBQ0E7QUFDRCxPQVJELE1BUU87QUFDTkksUUFBQUEsVUFBVSxDQUFFSixJQUFGLENBQVYsR0FBcUI3QixLQUFyQjtBQUNBO0FBQ0Q7QUFDRCxHQXhFc0MsQ0EwRXZDOzs7QUFDQXNCLEVBQUFBLGVBQWU7QUFFZjFCLEVBQUFBLFlBQVksQ0FBQ08sSUFBYixDQUFtQixRQUFuQixFQUE4Qk4sRUFBOUIsQ0FBa0MsUUFBbEMsRUFBNEMsWUFBVztBQUN0RCxRQUFNdUMsS0FBSyxHQUFHekMsQ0FBQyxDQUFFLElBQUYsQ0FBZjtBQUVBb0MsSUFBQUEsZ0JBQWdCLENBQUVLLEtBQUYsQ0FBaEI7QUFDQSxHQUpEOztBQU1BLFdBQVNDLGVBQVQsQ0FBMEJkLFNBQTFCLEVBQXNDO0FBQ3JDLFFBQU1VLFVBQVUsR0FBR1osV0FBVyxDQUFFRSxTQUFGLENBQTlCO0FBRUEzQixJQUFBQSxZQUFZLENBQUNPLElBQWIsQ0FBbUJpQixVQUFuQixFQUFnQ00sSUFBaEMsQ0FBc0MsWUFBVztBQUNoRCxVQUFNQyxNQUFNLEdBQUdoQyxDQUFDLENBQUUsSUFBRixDQUFoQjtBQUNBLFVBQU1pQyxJQUFJLEdBQUtELE1BQU0sQ0FBQ0gsSUFBUCxDQUFhLE1BQWIsQ0FBZjtBQUNBLFVBQU1LLElBQUksR0FBS0YsTUFBTSxDQUFDSCxJQUFQLENBQWEsTUFBYixDQUFmO0FBQ0EsVUFBTXhCLEtBQUssR0FBSWlDLFVBQVUsQ0FBRUosSUFBRixDQUF6Qjs7QUFFQSxVQUFLLGVBQWVELElBQWYsSUFBdUIsWUFBWUEsSUFBeEMsRUFBK0M7QUFDOUMsWUFBS0MsSUFBSSxJQUFJSSxVQUFiLEVBQTBCO0FBQ3pCO0FBQ0FyQyxVQUFBQSxZQUFZLENBQ1ZPLElBREYsQ0FDUSxZQUFZMEIsSUFBWixHQUFtQixZQUFuQixHQUFrQzdCLEtBQWxDLEdBQTBDLElBRGxELEVBRUV3QixJQUZGLENBRVEsU0FGUixFQUVtQixTQUZuQjtBQUdBLFNBTEQsTUFLTztBQUNOO0FBQ0E1QixVQUFBQSxZQUFZLENBQUNPLElBQWIsQ0FBbUIsWUFBWTBCLElBQVosR0FBbUIsSUFBdEMsRUFBNkNTLFVBQTdDLENBQXlELFNBQXpEO0FBQ0E7QUFDRCxPQVZELE1BVU87QUFDTlgsUUFBQUEsTUFBTSxDQUFDZixHQUFQLENBQVlaLEtBQVo7QUFDQTtBQUNELEtBbkJELEVBSHFDLENBd0JyQzs7QUFDQSxRQUFLLG9CQUFvQmlDLFVBQXpCLEVBQXNDO0FBQ3JDLFVBQU1NLFVBQVUsR0FBR04sVUFBVSxDQUFFLGdCQUFGLENBQTdCO0FBRUF0QyxNQUFBQSxDQUFDLENBQUMrQixJQUFGLENBQVFhLFVBQVIsRUFBb0IsVUFBVUMsU0FBVixFQUFxQkMsR0FBckIsRUFBMkI7QUFDOUMsWUFBTUMsU0FBUyxHQUFHOUMsWUFBWSxDQUFDTyxJQUFiLENBQW1CLFlBQVlxQyxTQUFaLEdBQXdCLElBQTNDLENBQWxCO0FBRUFFLFFBQUFBLFNBQVMsQ0FBQzlCLEdBQVYsQ0FBZTZCLEdBQWY7QUFFQSxZQUFNWCxhQUFhLEdBQUdhLElBQUksQ0FBQ0MsS0FBTCxDQUFZQyxrQkFBa0IsQ0FBRUosR0FBRixDQUE5QixDQUF0Qjs7QUFFQSxZQUFLLENBQUVYLGFBQWEsQ0FBQ2dCLE1BQXJCLEVBQThCO0FBQzdCO0FBQ0E7O0FBRUQsWUFBTUMsZUFBZSxHQUFHTCxTQUFTLENBQUNsQixJQUFWLENBQWdCLFlBQWhCLENBQXhCO0FBQ0EsWUFBTXdCLGFBQWEsR0FBS04sU0FBUyxDQUFDbEIsSUFBVixDQUFnQixXQUFoQixDQUF4QixDQVo4QyxDQWM5Qzs7QUFDQSxZQUFLLENBQUVoQyxNQUFNLENBQUUsV0FBV3dELGFBQWIsQ0FBTixDQUFtQ0YsTUFBMUMsRUFBbUQ7QUFDbEQ7QUFDQTs7QUFFRCxZQUFNRyxjQUFjLEdBQUcsd0JBQXZCO0FBQ0EsWUFBTUMsYUFBYSxHQUFJLFdBQXZCO0FBRUEsWUFBTUMsTUFBTSxHQUFHdkQsWUFBWSxDQUFDTyxJQUFiLENBQW1CNEMsZUFBbkIsQ0FBZjtBQUNBLFlBQU1LLEtBQUssR0FBSUQsTUFBTSxDQUFDaEQsSUFBUCxDQUFhOEMsY0FBYixDQUFmO0FBRUF0RCxRQUFBQSxDQUFDLENBQUMrQixJQUFGLENBQVFJLGFBQVIsRUFBdUIsVUFBVXVCLENBQVYsRUFBYUMsTUFBYixFQUFzQjtBQUM1QyxjQUFNQyxRQUFRLEdBQUdDLEVBQUUsQ0FBQ0QsUUFBSCxDQUFhUCxhQUFiLENBQWpCO0FBRUEsY0FBSVMsaUJBQWlCLEdBQUcsRUFBeEI7O0FBRUEsY0FBSyw0QkFBNEJWLGVBQWpDLEVBQW1EO0FBQ2xEVSxZQUFBQSxpQkFBaUIsR0FBRztBQUNuQix1QkFBUyxFQURVO0FBRW5CLHVCQUFTO0FBRlUsYUFBcEI7QUFJQTs7QUFFRCxjQUFNQyxRQUFRLEdBQUdILFFBQVEsQ0FBRUUsaUJBQUYsQ0FBekI7QUFFQUwsVUFBQUEsS0FBSyxDQUFDTyxNQUFOLENBQWNELFFBQWQ7QUFFQSxjQUFNRSxRQUFRLEdBQUdSLEtBQUssQ0FBQ2pELElBQU4sQ0FBWStDLGFBQVosRUFBNEJXLElBQTVCLEVBQWpCO0FBRUFELFVBQUFBLFFBQVEsQ0FBQ3pELElBQVQsQ0FBZSxhQUFmLEVBQStCdUIsSUFBL0IsQ0FBcUMsWUFBVztBQUMvQyxnQkFBTVUsS0FBSyxHQUFHekMsQ0FBQyxDQUFFLElBQUYsQ0FBZjtBQUNBLGdCQUFNa0MsSUFBSSxHQUFJTyxLQUFLLENBQUNaLElBQU4sQ0FBWSxXQUFaLENBQWQ7QUFDQSxnQkFBTXhCLEtBQUssR0FBR3NELE1BQU0sQ0FBRXpCLElBQUYsQ0FBcEI7QUFFQU8sWUFBQUEsS0FBSyxDQUFDeEIsR0FBTixDQUFXWixLQUFYOztBQUVBLGdCQUFLLGdCQUFnQjZCLElBQWhCLElBQXdCN0IsS0FBN0IsRUFBcUM7QUFDcEM0RCxjQUFBQSxRQUFRLENBQUN6RCxJQUFULENBQWUsNEJBQWYsRUFBOEMyRCxRQUE5QyxDQUF3RCxRQUF4RDtBQUNBRixjQUFBQSxRQUFRLENBQUN6RCxJQUFULENBQWUsS0FBZixFQUF1QnFCLElBQXZCLENBQTZCLEtBQTdCLEVBQW9DeEIsS0FBcEM7QUFDQTtBQUNELFdBWEQ7QUFZQSxTQTlCRDtBQWdDQW1ELFFBQUFBLE1BQU0sQ0FBQ1csUUFBUCxDQUFpQixhQUFqQjtBQUNBLE9BMUREO0FBNERBLFVBQU03RCxNQUFNLEdBQUdMLFlBQVksQ0FBQ08sSUFBYixDQUFtQixtQkFBbkIsQ0FBZjtBQUVBUCxNQUFBQSxZQUFZLENBQUNtRSxPQUFiLENBQXNCLGtCQUF0QixFQUEwQyxDQUFFOUQsTUFBRixDQUExQztBQUNBO0FBQ0Q7O0FBRUROLEVBQUFBLENBQUMsQ0FBRSxtQkFBRixDQUFELENBQXlCRSxFQUF6QixDQUE2QixRQUE3QixFQUF1Qyx3QkFBdkMsRUFBaUUsWUFBVztBQUMzRSxRQUFNdUMsS0FBSyxHQUFRekMsQ0FBQyxDQUFFLElBQUYsQ0FBcEI7O0FBQ0EsUUFBTXFFLFVBQVUsR0FBRzVCLEtBQUssQ0FBQ3hCLEdBQU4sRUFBbkI7O0FBQ0EsUUFBTXFELFNBQVMsR0FBSTdCLEtBQUssQ0FBQ1osSUFBTixDQUFZLGlCQUFaLENBQW5COztBQUVBLFFBQUssQ0FBRXdDLFVBQVAsRUFBb0I7QUFDbkI7QUFDQTs7QUFFRCxRQUFNekMsU0FBUyxHQUFHLHNCQUFzQnlDLFVBQXhDLENBVDJFLENBVzNFOztBQUNBLFFBQUssQ0FBRXhFLE1BQU0sQ0FBRSxXQUFXK0IsU0FBYixDQUFOLENBQStCdUIsTUFBdEMsRUFBK0M7QUFDOUM7QUFDQTs7QUFFRCxRQUFNUyxRQUFRLEdBQVdDLEVBQUUsQ0FBQ0QsUUFBSCxDQUFhaEMsU0FBYixDQUF6QjtBQUNBLFFBQU1tQyxRQUFRLEdBQVdILFFBQVEsRUFBakM7QUFDQSxRQUFNVyxnQkFBZ0IsR0FBR3RFLFlBQVksQ0FBQ08sSUFBYixDQUFtQixhQUFuQixDQUF6QjtBQUNBLFFBQU1nRSxnQkFBZ0IsR0FBR3ZFLFlBQVksQ0FBQ08sSUFBYixDQUFtQixvQkFBbkIsQ0FBekI7QUFDQSxRQUFNaUUsV0FBVyxHQUFReEUsWUFBWSxDQUFDTyxJQUFiLENBQW1CLFNBQW5CLENBQXpCO0FBRUFQLElBQUFBLFlBQVksQ0FBQ3lFLFdBQWIsQ0FBMEIsUUFBMUI7QUFFQUgsSUFBQUEsZ0JBQWdCLENBQUMxQyxJQUFqQixDQUF1QixpQkFBdkIsRUFBMEN3QyxVQUExQztBQUNBRyxJQUFBQSxnQkFBZ0IsQ0FBQ0csSUFBakIsQ0FBdUJMLFNBQXZCO0FBQ0FHLElBQUFBLFdBQVcsQ0FBQ0UsSUFBWixDQUFrQlosUUFBbEIsRUExQjJFLENBNEIzRTs7QUFDQSxRQUFLTSxVQUFVLElBQUkzQyxXQUFuQixFQUFpQztBQUNoQ2dCLE1BQUFBLGVBQWUsQ0FBRTJCLFVBQUYsQ0FBZjtBQUNBLEtBRkQsTUFFTztBQUNOMUMsTUFBQUEsZUFBZTtBQUNmOztBQUVEMUIsSUFBQUEsWUFBWSxDQUFDbUUsT0FBYixDQUFzQixhQUF0QjtBQUVBbkUsSUFBQUEsWUFBWSxDQUFDTyxJQUFiLENBQW1CLFFBQW5CLEVBQThCTixFQUE5QixDQUFrQyxRQUFsQyxFQUE0QyxZQUFXO0FBQ3RELFVBQU11QyxLQUFLLEdBQUd6QyxDQUFDLENBQUUsSUFBRixDQUFmO0FBRUFvQyxNQUFBQSxnQkFBZ0IsQ0FBRUssS0FBRixDQUFoQjtBQUNBLEtBSkQ7QUFLQSxHQTFDRDtBQTRDQSxDQTdORDs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTbUMsc0JBQVQsQ0FBaUN4QixlQUFqQyxFQUFrRHlCLGVBQWxELEVBQW1FeEIsYUFBbkUsRUFBMkc7QUFBQSxNQUF6QlMsaUJBQXlCLHVFQUFMLEVBQUs7QUFDMUcsTUFBTTlELENBQUMsR0FBR0gsTUFBVjtBQUVBLE1BQU1JLFlBQVksR0FBR0QsQ0FBQyxDQUFFLHVCQUFGLENBQXRCO0FBRUEsTUFBTThFLGVBQWUsR0FBRyxtQkFBeEI7QUFDQSxNQUFNeEIsY0FBYyxHQUFJLHdCQUF4QjtBQUNBLE1BQU1DLGFBQWEsR0FBSyxXQUF4Qjs7QUFFQSxXQUFTd0IsaUJBQVQsQ0FBNEJDLFNBQTVCLEVBQXdDO0FBQ3ZDQSxJQUFBQSxTQUFTLENBQUNDLFFBQVYsQ0FBb0I7QUFDbkJDLE1BQUFBLE9BQU8sRUFBRSxHQURVO0FBRW5CQyxNQUFBQSxNQUFNLEVBQUUsS0FGVztBQUduQkMsTUFBQUEsTUFBTSxFQUFFLE1BSFc7QUFJbkJDLE1BQUFBLElBQUksRUFBRSxHQUphO0FBS25CQyxNQUFBQSxNQUFNLEVBQUUsdUJBTFc7QUFNbkJDLE1BQUFBLFdBQVcsRUFBRSxvQkFOTTtBQU9uQkMsTUFBQUEsTUFBTSxFQUFFLGdCQUFVckYsQ0FBVixFQUFjO0FBQ3JCLFlBQU1HLE1BQU0sR0FBR04sQ0FBQyxDQUFFRyxDQUFDLENBQUNzRixNQUFKLENBQUQsQ0FBY0MsT0FBZCxDQUF1QixtQkFBdkIsQ0FBZjtBQUVBQyxRQUFBQSxvQkFBb0IsQ0FBRXJGLE1BQUYsQ0FBcEI7QUFDQTtBQVhrQixLQUFwQixFQVlJc0YsZ0JBWko7QUFhQTs7QUFFRCxNQUFNQyxtQkFBbUIsR0FBR3pDLGVBQWUsR0FBRyxHQUFsQixHQUF3QkUsY0FBcEQsQ0F6QjBHLENBMkIxRzs7QUFDQXlCLEVBQUFBLGlCQUFpQixDQUFFOUUsWUFBWSxDQUFDTyxJQUFiLENBQW1CcUYsbUJBQW5CLENBQUYsQ0FBakIsQ0E1QjBHLENBOEIxRzs7QUFDQTVGLEVBQUFBLFlBQVksQ0FBQ0MsRUFBYixDQUFpQixhQUFqQixFQUFnQyxZQUFXO0FBQzFDNkUsSUFBQUEsaUJBQWlCLENBQUUvRSxDQUFDLENBQUVDLFlBQVksQ0FBQ08sSUFBYixDQUFtQnFGLG1CQUFuQixDQUFGLENBQUgsQ0FBakI7QUFDQSxHQUZEOztBQUlBLFdBQVNGLG9CQUFULENBQStCckYsTUFBL0IsRUFBd0M7QUFDdkMsUUFBTXdGLFlBQVksR0FBR3hGLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhcUUsZUFBYixDQUFyQjtBQUNBLFFBQU1wQixLQUFLLEdBQVVuRCxNQUFNLENBQUNFLElBQVAsQ0FBYXFGLG1CQUFiLENBQXJCO0FBQ0EsUUFBTUUsS0FBSyxHQUFVLEVBQXJCO0FBRUF0QyxJQUFBQSxLQUFLLENBQUNqRCxJQUFOLENBQVksV0FBWixFQUEwQnVCLElBQTFCLENBQWdDLFVBQVUyQixDQUFWLEVBQWFzQyxLQUFiLEVBQXFCO0FBQ3BELFVBQU1DLEtBQUssR0FBR2pHLENBQUMsQ0FBRWdHLEtBQUYsQ0FBZjtBQUNBLFVBQU1FLEdBQUcsR0FBSyxFQUFkO0FBRUFELE1BQUFBLEtBQUssQ0FBQ3pGLElBQU4sQ0FBWSxhQUFaLEVBQTRCdUIsSUFBNUIsQ0FBa0MsVUFBVW9FLFVBQVYsRUFBc0JDLEtBQXRCLEVBQThCO0FBQy9ELFlBQU05RixNQUFNLEdBQUdOLENBQUMsQ0FBRW9HLEtBQUYsQ0FBaEI7QUFDQSxZQUFNbEUsSUFBSSxHQUFLNUIsTUFBTSxDQUFDdUIsSUFBUCxDQUFhLFdBQWIsQ0FBZjtBQUVBcUUsUUFBQUEsR0FBRyxDQUFFaEUsSUFBRixDQUFILEdBQWM1QixNQUFNLENBQUNXLEdBQVAsRUFBZDtBQUNBLE9BTEQ7O0FBT0E4RSxNQUFBQSxLQUFLLENBQUNNLElBQU4sQ0FBWUgsR0FBWjtBQUNBLEtBWkQ7QUFjQSxRQUFNSSxTQUFTLEdBQUdDLGtCQUFrQixDQUFFdkQsSUFBSSxDQUFDd0QsU0FBTCxDQUFnQlQsS0FBaEIsQ0FBRixDQUFwQztBQUNBRCxJQUFBQSxZQUFZLENBQUM3RSxHQUFiLENBQWtCcUYsU0FBbEIsRUFBOEJsQyxPQUE5QixDQUF1QyxRQUF2QztBQUNBOztBQUVELFdBQVNxQyxtQkFBVCxDQUE4Qm5HLE1BQTlCLEVBQXVDO0FBQ3RDLFFBQU1vRyxhQUFhLEdBQUdwRyxNQUFNLENBQUNFLElBQVAsQ0FBYTRDLGVBQWIsQ0FBdEI7QUFDQSxRQUFNdUQsU0FBUyxHQUFPckcsTUFBTSxDQUFDRSxJQUFQLENBQWFxRixtQkFBYixFQUFtQ2UsUUFBbkMsRUFBdEI7O0FBRUEsUUFBSyxJQUFJRCxTQUFTLENBQUN4RCxNQUFuQixFQUE0QjtBQUMzQnVELE1BQUFBLGFBQWEsQ0FBQ2hDLFdBQWQsQ0FBMkIsYUFBM0I7QUFDQTtBQUNELEdBakV5RyxDQW1FMUc7OztBQUNBLE1BQU1tQyxtQkFBbUIsR0FBR3pELGVBQWUsR0FBRyxpQkFBOUM7QUFFQW5ELEVBQUFBLFlBQVksQ0FBQ0MsRUFBYixDQUFpQixPQUFqQixFQUEwQjJHLG1CQUExQixFQUErQyxZQUFXO0FBQ3pELFFBQU1aLEtBQUssR0FBSWpHLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVTBGLE9BQVYsQ0FBbUJuQyxhQUFuQixDQUFmO0FBQ0EsUUFBTWpELE1BQU0sR0FBRzJGLEtBQUssQ0FBQ1AsT0FBTixDQUFlWixlQUFmLENBQWY7QUFFQTJCLElBQUFBLG1CQUFtQixDQUFFbkcsTUFBRixDQUFuQjtBQUVBMkYsSUFBQUEsS0FBSyxDQUFDYSxNQUFOO0FBRUFuQixJQUFBQSxvQkFBb0IsQ0FBRXJGLE1BQUYsQ0FBcEI7QUFDQSxHQVRELEVBdEUwRyxDQWlGMUc7O0FBQ0EsTUFBTXlHLHlCQUF5QixHQUFHM0QsZUFBZSxHQUFHLGlCQUFwRDtBQUVBbkQsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLE9BQWpCLEVBQTBCNkcseUJBQTFCLEVBQXFELFlBQVc7QUFDL0QsUUFBTXpHLE1BQU0sR0FBR04sQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVMEYsT0FBVixDQUFtQlosZUFBbkIsQ0FBZjtBQUVBeEUsSUFBQUEsTUFBTSxDQUFDRSxJQUFQLENBQWFxRixtQkFBYixFQUFtQ21CLEtBQW5DO0FBRUFQLElBQUFBLG1CQUFtQixDQUFFbkcsTUFBRixDQUFuQjtBQUNBcUYsSUFBQUEsb0JBQW9CLENBQUVyRixNQUFGLENBQXBCO0FBQ0EsR0FQRCxFQXBGMEcsQ0E2RjFHOztBQUNBLE1BQU0yRyxzQkFBc0IsR0FBRzdELGVBQWUsR0FBRyxjQUFqRDtBQUVBbkQsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLE9BQWpCLEVBQTBCK0csc0JBQTFCLEVBQWtELFlBQVc7QUFDNUQ7QUFDQSxRQUFLLENBQUVwSCxNQUFNLENBQUUsV0FBV3dELGFBQWIsQ0FBTixDQUFtQ0YsTUFBMUMsRUFBbUQ7QUFDbEQ7QUFDQTs7QUFFRCxRQUFNN0MsTUFBTSxHQUFHTixDQUFDLENBQUUsSUFBRixDQUFELENBQVUwRixPQUFWLENBQW1CWixlQUFuQixDQUFmO0FBRUEsUUFBTWxCLFFBQVEsR0FBR0MsRUFBRSxDQUFDRCxRQUFILENBQWFQLGFBQWIsQ0FBakI7QUFDQSxRQUFNVSxRQUFRLEdBQUdILFFBQVEsQ0FBRUUsaUJBQUYsQ0FBekI7QUFDQSxRQUFNTixNQUFNLEdBQUtsRCxNQUFNLENBQUNFLElBQVAsQ0FBYTRDLGVBQWIsQ0FBakI7QUFDQSxRQUFNSyxLQUFLLEdBQU1uRCxNQUFNLENBQUNFLElBQVAsQ0FBYXFGLG1CQUFiLENBQWpCO0FBRUFwQyxJQUFBQSxLQUFLLENBQUNPLE1BQU4sQ0FBY0QsUUFBZDtBQUVBNEIsSUFBQUEsb0JBQW9CLENBQUVyRixNQUFGLENBQXBCO0FBRUFMLElBQUFBLFlBQVksQ0FBQ21FLE9BQWIsQ0FBc0Isa0JBQXRCLEVBQTBDLENBQUU5RCxNQUFGLENBQTFDOztBQUVBLFFBQUssQ0FBRWtELE1BQU0sQ0FBQ2pCLFFBQVAsQ0FBaUIsYUFBakIsQ0FBUCxFQUEwQztBQUN6Q2lCLE1BQUFBLE1BQU0sQ0FBQ1csUUFBUCxDQUFpQixhQUFqQjtBQUNBO0FBQ0QsR0F0QkQsRUFoRzBHLENBd0gxRzs7QUFDQSxNQUFNK0Msb0JBQW9CLEdBQUdyQixtQkFBbUIsR0FBRyxxQkFBbkQ7QUFFQTVGLEVBQUFBLFlBQVksQ0FBQ0MsRUFBYixDQUFpQixPQUFqQixFQUEwQmdILG9CQUExQixFQUFnRCxZQUFXO0FBQzFELFFBQU01RyxNQUFNLEdBQUdOLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVTBGLE9BQVYsQ0FBbUJaLGVBQW5CLENBQWY7QUFFQWEsSUFBQUEsb0JBQW9CLENBQUVyRixNQUFGLENBQXBCO0FBQ0EsR0FKRCxFQTNIMEcsQ0FpSTFHOztBQUNBLE1BQUk2RyxzQkFBc0IsR0FBR3RCLG1CQUFtQixHQUFHLFNBQW5EO0FBRUE1RixFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUIsUUFBakIsRUFBMkJpSCxzQkFBM0IsRUFBbUQsWUFBVztBQUM3RCxRQUFNN0csTUFBTSxHQUFHTixDQUFDLENBQUUsSUFBRixDQUFELENBQVUwRixPQUFWLENBQW1CWixlQUFuQixDQUFmO0FBRUFhLElBQUFBLG9CQUFvQixDQUFFckYsTUFBRixDQUFwQjtBQUNBLEdBSkQsRUFwSTBHLENBMEkxRzs7QUFDQUwsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLHVCQUFqQixFQUEwQyxVQUFVQyxDQUFWLEVBQWFpSCxPQUFiLEVBQXNCOUcsTUFBdEIsRUFBK0I7QUFDeEUsUUFBSzhHLE9BQU8sS0FBS2hFLGVBQWpCLEVBQW1DO0FBQ2xDdUMsTUFBQUEsb0JBQW9CLENBQUVyRixNQUFGLENBQXBCO0FBQ0E7QUFDRCxHQUpEO0FBTUE7OztBQ2hLRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFULE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixVQUFVQyxDQUFWLEVBQWM7QUFFdkMsTUFBTUMsWUFBWSxHQUFHRCxDQUFDLENBQUUsdUJBQUYsQ0FBdEI7QUFFQTtBQUNEO0FBQ0E7O0FBQ0MsV0FBU3FILHlCQUFULENBQW9DaEYsSUFBcEMsRUFBMkM7QUFDMUMsUUFBTS9CLE1BQU0sR0FBTytCLElBQUksQ0FBQ3FELE9BQUwsQ0FBYyxtQkFBZCxDQUFuQjtBQUNBLFFBQU00QixVQUFVLEdBQUdoSCxNQUFNLENBQUNFLElBQVAsQ0FBYSxvREFBYixDQUFuQjs7QUFFQSxRQUFLNkIsSUFBSSxDQUFDekIsRUFBTCxDQUFTLFVBQVQsQ0FBTCxFQUE2QjtBQUM1QjBHLE1BQUFBLFVBQVUsQ0FBQ3pGLElBQVgsQ0FBaUIsVUFBakIsRUFBNkIsVUFBN0I7QUFDQSxLQUZELE1BRU87QUFDTnlGLE1BQUFBLFVBQVUsQ0FBQzNFLFVBQVgsQ0FBdUIsVUFBdkI7QUFDQTtBQUNEOztBQUVEMUMsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLGFBQWpCLEVBQWdDLFlBQVc7QUFDMUNELElBQUFBLFlBQVksQ0FBQ08sSUFBYixDQUFtQixvRUFBbkIsRUFBMEZ1QixJQUExRixDQUFnRyxZQUFXO0FBQzFHLFVBQU1VLEtBQUssR0FBR3pDLENBQUMsQ0FBRSxJQUFGLENBQWY7QUFFQXFILE1BQUFBLHlCQUF5QixDQUFFNUUsS0FBRixDQUF6QjtBQUNBLEtBSkQ7QUFLQSxHQU5EO0FBUUF4QyxFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FDQyxPQURELEVBRUMsb0VBRkQsRUFHQyxZQUFXO0FBQ1YsUUFBTXVDLEtBQUssR0FBR3pDLENBQUMsQ0FBRSxJQUFGLENBQWY7QUFFQXFILElBQUFBLHlCQUF5QixDQUFFNUUsS0FBRixDQUF6QjtBQUNBLEdBUEY7QUFVQTtBQUNEO0FBQ0E7O0FBQ0MsV0FBUzhFLHlCQUFULENBQW9DbEYsSUFBcEMsRUFBMkM7QUFDMUMsUUFBTS9CLE1BQU0sR0FBTytCLElBQUksQ0FBQ3FELE9BQUwsQ0FBYyxtQkFBZCxDQUFuQjtBQUNBLFFBQU00QixVQUFVLEdBQUdoSCxNQUFNLENBQUNFLElBQVAsQ0FBYSxvREFBYixDQUFuQjs7QUFFQSxRQUFLNkIsSUFBSSxDQUFDekIsRUFBTCxDQUFTLFVBQVQsQ0FBTCxFQUE2QjtBQUM1QjBHLE1BQUFBLFVBQVUsQ0FBQ3pGLElBQVgsQ0FBaUIsVUFBakIsRUFBNkIsVUFBN0I7QUFDQSxLQUZELE1BRU87QUFDTnlGLE1BQUFBLFVBQVUsQ0FBQzNFLFVBQVgsQ0FBdUIsVUFBdkI7QUFDQTtBQUNEOztBQUVEMUMsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLGFBQWpCLEVBQWdDLFlBQVc7QUFDMUNELElBQUFBLFlBQVksQ0FBQ08sSUFBYixDQUFtQixvRUFBbkIsRUFBMEZ1QixJQUExRixDQUFnRyxZQUFXO0FBQzFHLFVBQU1VLEtBQUssR0FBR3pDLENBQUMsQ0FBRSxJQUFGLENBQWY7QUFFQXVILE1BQUFBLHlCQUF5QixDQUFFOUUsS0FBRixDQUF6QjtBQUNBLEtBSkQ7QUFLQSxHQU5EO0FBUUF4QyxFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FDQyxPQURELEVBRUMsb0VBRkQsRUFHQyxZQUFXO0FBQ1YsUUFBTXVDLEtBQUssR0FBR3pDLENBQUMsQ0FBRSxJQUFGLENBQWY7QUFFQXVILElBQUFBLHlCQUF5QixDQUFFOUUsS0FBRixDQUF6QjtBQUNBLEdBUEY7QUFVQSxDQXBFRDs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBNUMsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVDLENBQVYsRUFBYztBQUV2QyxNQUFLLENBQUVBLENBQUMsQ0FBRSxNQUFGLENBQUQsQ0FBWXVDLFFBQVosQ0FBc0Isa0NBQXRCLENBQVAsRUFBb0U7QUFDbkU7QUFDQSxHQUpzQyxDQU12Qzs7O0FBQ0F2QyxFQUFBQSxDQUFDLENBQUUsc0JBQUYsQ0FBRCxDQUE0QndILEtBQTVCLENBQW1DLFVBQVVySCxDQUFWLEVBQWM7QUFDaERBLElBQUFBLENBQUMsQ0FBQ3NILGNBQUY7QUFFQSxRQUFNQyxPQUFPLEdBQU0xSCxDQUFDLENBQUUsSUFBRixDQUFwQjtBQUNBLFFBQU0ySCxRQUFRLEdBQUtELE9BQU8sQ0FBQ2hDLE9BQVIsQ0FBaUIsZUFBakIsQ0FBbkI7QUFDQSxRQUFNa0MsVUFBVSxHQUFHRixPQUFPLENBQUM3RixJQUFSLENBQWMsa0JBQWQsQ0FBbkI7QUFFQSxRQUFNZ0csS0FBSyxHQUFHaEUsRUFBRSxDQUFDaUUsS0FBSCxDQUFVO0FBQUVDLE1BQUFBLEtBQUssRUFBRUgsVUFBVDtBQUFxQkksTUFBQUEsUUFBUSxFQUFFO0FBQS9CLEtBQVYsRUFDWkMsSUFEWSxHQUVaL0gsRUFGWSxDQUVSLFFBRlEsRUFFRSxZQUFXO0FBQ3pCLFVBQU1nSSxhQUFhLEdBQUdMLEtBQUssQ0FBQ00sS0FBTixHQUFjQyxHQUFkLENBQW1CLFdBQW5CLEVBQWlDQyxLQUFqQyxFQUF0QjtBQUNBLFVBQU1DLFNBQVMsR0FBT0osYUFBYSxDQUFDSyxNQUFkLEVBQXRCO0FBQ0EsVUFBTUMsUUFBUSxHQUFRRixTQUFTLENBQUNHLEdBQWhDO0FBRUFkLE1BQUFBLFFBQVEsQ0FBQ25ILElBQVQsQ0FBZSxXQUFmLEVBQTZCUyxHQUE3QixDQUFrQ3FILFNBQVMsQ0FBQ0ksRUFBNUM7QUFDQWYsTUFBQUEsUUFBUSxDQUFDbkgsSUFBVCxDQUFlLFlBQWYsRUFBOEJxQixJQUE5QixDQUFvQyxLQUFwQyxFQUEyQzJHLFFBQTNDO0FBQ0FiLE1BQUFBLFFBQVEsQ0FBQ2pELFdBQVQsQ0FBc0IsVUFBdEI7QUFDQSxLQVZZLENBQWQ7QUFXQSxHQWxCRDtBQW9CQTFFLEVBQUFBLENBQUMsQ0FBRSxzQkFBRixDQUFELENBQTRCRSxFQUE1QixDQUFnQyxPQUFoQyxFQUF5QyxVQUFVQyxDQUFWLEVBQWM7QUFDdERBLElBQUFBLENBQUMsQ0FBQ3NILGNBQUY7QUFFQSxRQUFNQyxPQUFPLEdBQUkxSCxDQUFDLENBQUUsSUFBRixDQUFsQjtBQUNBLFFBQU0ySCxRQUFRLEdBQUdELE9BQU8sQ0FBQ2hDLE9BQVIsQ0FBaUIsZUFBakIsQ0FBakI7QUFFQWlDLElBQUFBLFFBQVEsQ0FBQ25ILElBQVQsQ0FBZSxXQUFmLEVBQTZCUyxHQUE3QixDQUFrQyxFQUFsQztBQUNBMEcsSUFBQUEsUUFBUSxDQUFDbkgsSUFBVCxDQUFlLFlBQWYsRUFBOEJxQixJQUE5QixDQUFvQyxLQUFwQyxFQUEyQyxFQUEzQztBQUNBOEYsSUFBQUEsUUFBUSxDQUFDeEQsUUFBVCxDQUFtQixVQUFuQjtBQUNBLEdBVEQsRUEzQnVDLENBc0N2Qzs7QUFDQSxXQUFTd0Usa0JBQVQsQ0FBNkJ0SSxLQUE3QixFQUFxQztBQUNwQyxRQUFNMkUsU0FBUyxHQUFHaEYsQ0FBQyxDQUFFLCtCQUFGLENBQW5COztBQUVBLFFBQUtLLEtBQUwsRUFBYTtBQUNaMkUsTUFBQUEsU0FBUyxDQUFDbkUsSUFBVjtBQUNBLEtBRkQsTUFFTztBQUNObUUsTUFBQUEsU0FBUyxDQUFDbEUsSUFBVjtBQUNBO0FBQ0Q7O0FBRUQsTUFBTThILHFCQUFxQixHQUFHNUksQ0FBQyxDQUFFLG9CQUFGLENBQS9CO0FBRUEsTUFBSTZJLG9CQUFvQixHQUFHLEtBQTNCOztBQUVBLE1BQUtELHFCQUFxQixDQUFDaEksRUFBdEIsQ0FBMEIsVUFBMUIsQ0FBTCxFQUE4QztBQUM3Q2lJLElBQUFBLG9CQUFvQixHQUFHLElBQXZCO0FBQ0E7O0FBRURGLEVBQUFBLGtCQUFrQixDQUFFRSxvQkFBRixDQUFsQjtBQUVBRCxFQUFBQSxxQkFBcUIsQ0FBQzFJLEVBQXRCLENBQTBCLFFBQTFCLEVBQW9DLFlBQVc7QUFDOUMsUUFBSTRJLHFCQUFxQixHQUFHLEtBQTVCOztBQUVBLFFBQUs5SSxDQUFDLENBQUUsSUFBRixDQUFELENBQVVZLEVBQVYsQ0FBYyxVQUFkLENBQUwsRUFBa0M7QUFDakNrSSxNQUFBQSxxQkFBcUIsR0FBRyxJQUF4QjtBQUNBOztBQUVESCxJQUFBQSxrQkFBa0IsQ0FBRUcscUJBQUYsQ0FBbEI7QUFDQSxHQVJELEVBM0R1QyxDQXFFdkM7O0FBQ0EsV0FBU0MsZ0JBQVQsQ0FBMkIxSSxLQUEzQixFQUFtQztBQUNsQyxRQUFNMkUsU0FBUyxHQUFHaEYsQ0FBQyxDQUFFLHNDQUFGLENBQW5COztBQUVBLFFBQUtLLEtBQUwsRUFBYTtBQUNaMkUsTUFBQUEsU0FBUyxDQUFDbkUsSUFBVjtBQUNBLEtBRkQsTUFFTztBQUNObUUsTUFBQUEsU0FBUyxDQUFDbEUsSUFBVjtBQUNBO0FBQ0Q7O0FBRUQsTUFBTWtJLGlCQUFpQixHQUFHaEosQ0FBQyxDQUFFLDZCQUFGLENBQTNCO0FBRUEsTUFBSWlKLHNCQUFzQixHQUFHLEtBQTdCOztBQUVBLE1BQUtELGlCQUFpQixDQUFDcEksRUFBbEIsQ0FBc0IsVUFBdEIsQ0FBTCxFQUEwQztBQUN6Q3FJLElBQUFBLHNCQUFzQixHQUFHLElBQXpCO0FBQ0E7O0FBRURGLEVBQUFBLGdCQUFnQixDQUFFRSxzQkFBRixDQUFoQjtBQUVBRCxFQUFBQSxpQkFBaUIsQ0FBQzlJLEVBQWxCLENBQXNCLFFBQXRCLEVBQWdDLFlBQVc7QUFDMUMsUUFBSWdKLGlCQUFpQixHQUFHLEtBQXhCOztBQUVBLFFBQUtsSixDQUFDLENBQUUsSUFBRixDQUFELENBQVVZLEVBQVYsQ0FBYyxVQUFkLENBQUwsRUFBa0M7QUFDakNzSSxNQUFBQSxpQkFBaUIsR0FBRyxJQUFwQjtBQUNBOztBQUVESCxJQUFBQSxnQkFBZ0IsQ0FBRUcsaUJBQUYsQ0FBaEI7QUFDQSxHQVJELEVBMUZ1QyxDQW9HdkM7O0FBQ0EsV0FBU0MsWUFBVCxDQUF1QjlJLEtBQXZCLEVBQStCO0FBQzlCLFFBQU0rSSxlQUFlLEdBQUcscUNBQ3ZCLHNDQUR1QixHQUV2QixzQ0FGRDs7QUFJQSxRQUFLLFdBQVcvSSxLQUFoQixFQUF3QjtBQUN2QkwsTUFBQUEsQ0FBQyxDQUFFb0osZUFBRixDQUFELENBQXFCdEksSUFBckI7QUFDQSxLQUZELE1BRU8sSUFBSyxjQUFjVCxLQUFuQixFQUEyQjtBQUNqQ0wsTUFBQUEsQ0FBQyxDQUFFLHVFQUFGLENBQUQsQ0FBNkVhLElBQTdFO0FBQ0FiLE1BQUFBLENBQUMsQ0FBRSxxQ0FBRixDQUFELENBQTJDYyxJQUEzQztBQUNBLEtBSE0sTUFHQSxJQUFLLGFBQWFULEtBQWxCLEVBQTBCO0FBQ2hDTCxNQUFBQSxDQUFDLENBQUUsdUVBQUYsQ0FBRCxDQUE2RWEsSUFBN0U7QUFDQWIsTUFBQUEsQ0FBQyxDQUFFLHFDQUFGLENBQUQsQ0FBMkNhLElBQTNDO0FBQ0EsS0FITSxNQUdBO0FBQ05iLE1BQUFBLENBQUMsQ0FBRW9KLGVBQUYsQ0FBRCxDQUFxQnZJLElBQXJCO0FBQ0E7QUFDRDs7QUFFRCxNQUFNd0ksYUFBYSxHQUFHckosQ0FBQyxDQUFFLGdCQUFGLENBQXZCO0FBRUFtSixFQUFBQSxZQUFZLENBQUVFLGFBQWEsQ0FBQ3BJLEdBQWQsRUFBRixDQUFaO0FBRUFvSSxFQUFBQSxhQUFhLENBQUNuSixFQUFkLENBQWtCLFFBQWxCLEVBQTRCLFlBQVc7QUFDdEMsUUFBTUcsS0FBSyxHQUFHTCxDQUFDLENBQUUsSUFBRixDQUFELENBQVVpQixHQUFWLEVBQWQ7QUFFQWtJLElBQUFBLFlBQVksQ0FBRTlJLEtBQUYsQ0FBWjtBQUNBLEdBSkQ7QUFNQSxDQWpJRDs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBUixNQUFNLENBQUVDLFFBQUYsQ0FBTixDQUFtQkMsS0FBbkIsQ0FBMEIsWUFBVztBQUVwQyxNQUFNcUQsZUFBZSxHQUFHLCtCQUF4QjtBQUNBLE1BQU15QixlQUFlLEdBQUcsb0RBQXhCO0FBQ0EsTUFBTXhCLGFBQWEsR0FBSyw2QkFBeEI7QUFFQXVCLEVBQUFBLHNCQUFzQixDQUFFeEIsZUFBRixFQUFtQnlCLGVBQW5CLEVBQW9DeEIsYUFBcEMsQ0FBdEI7QUFFQSxDQVJEOzs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBeEQsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVDLENBQVYsRUFBYztBQUV2QyxNQUFNQyxZQUFZLEdBQUdELENBQUMsQ0FBRSx1QkFBRixDQUF0QjtBQUVBLE1BQU1zSixhQUFhLEdBQUcsQ0FDckI7QUFDQyxlQUFXLHlDQURaO0FBRUMsbUJBQWUsUUFGaEI7QUFHQyxhQUFTLFFBSFY7QUFJQyxpQkFBYSxDQUNaO0FBQ0Msa0JBQVkseUJBRGI7QUFFQyxlQUFTLENBQUUsTUFBRjtBQUZWLEtBRFksRUFLWjtBQUNDLGtCQUFZLDJCQURiO0FBRUMsZUFBUyxDQUFFLFFBQUY7QUFGVixLQUxZLEVBU1o7QUFDQyxrQkFBWSx5QkFEYjtBQUVDLGVBQVMsQ0FBRSxNQUFGO0FBRlYsS0FUWSxFQWFaO0FBQ0Msa0JBQVksdUJBRGI7QUFFQyxlQUFTLENBQUUsUUFBRjtBQUZWLEtBYlk7QUFKZCxHQURxQixFQXdCckI7QUFDQyxlQUFXLDJDQURaO0FBRUMsbUJBQWUsUUFGaEI7QUFHQyxhQUFTLFFBSFY7QUFJQyxpQkFBYSxDQUNaO0FBQ0Msa0JBQVksa0NBRGI7QUFFQyxlQUFTLENBQUUsVUFBRixFQUFjLGNBQWQ7QUFGVixLQURZLEVBS1o7QUFDQyxrQkFBWSx1Q0FEYjtBQUVDLGVBQVMsQ0FBRSxPQUFGLEVBQVcsUUFBWDtBQUZWLEtBTFksRUFTWjtBQUNDLGtCQUFZLGtDQURiO0FBRUMsZUFBUyxDQUFFLFFBQUYsRUFBWSxjQUFaO0FBRlYsS0FUWSxFQWFaO0FBQ0Msa0JBQVksMkNBRGI7QUFFQyxlQUFTLENBQUUsT0FBRjtBQUZWLEtBYlksRUFpQlo7QUFDQyxrQkFBWSw4Q0FEYjtBQUVDLGVBQVMsQ0FBRSxPQUFGLEVBQVcsT0FBWCxFQUFvQixPQUFwQjtBQUZWLEtBakJZLEVBcUJaO0FBQ0Msa0JBQVksaUNBRGI7QUFFQyxlQUFTLENBQUUsT0FBRixFQUFXLE9BQVg7QUFGVixLQXJCWTtBQUpkLEdBeEJxQixFQXVEckI7QUFDQyxlQUFXLHdDQURaO0FBRUMsbUJBQWUsVUFGaEI7QUFHQyxhQUFTLFFBSFY7QUFJQyxpQkFBYSxDQUNaO0FBQ0Msa0JBQVksaURBRGI7QUFFQyxlQUFTLENBQUUsR0FBRjtBQUZWLEtBRFk7QUFKZCxHQXZEcUIsRUFrRXJCO0FBQ0MsZUFBVywwQ0FEWjtBQUVDLG1CQUFlLFVBRmhCO0FBR0MsYUFBUztBQUhWLEdBbEVxQixFQXVFckI7QUFDQyxlQUFXLDJDQURaO0FBRUMsbUJBQWUsVUFGaEI7QUFHQyxhQUFTLFFBSFY7QUFJQyxpQkFBYSxDQUNaO0FBQ0Msa0JBQVksNENBRGI7QUFFQyxlQUFTLENBQUUsR0FBRjtBQUZWLEtBRFk7QUFKZCxHQXZFcUIsRUFrRnJCO0FBQ0MsZUFBVyx5Q0FEWjtBQUVDLG1CQUFlLE9BRmhCO0FBR0MsYUFBUyxRQUhWO0FBSUMsaUJBQWEsQ0FDWjtBQUNDLGtCQUFZLHVDQURiO0FBRUMsZUFBUyxDQUFFLGNBQUY7QUFGVixLQURZO0FBSmQsR0FsRnFCLEVBNkZyQjtBQUNDLGVBQVcsa0RBRFo7QUFFQyxtQkFBZSxRQUZoQjtBQUdDLGFBQVMsUUFIVjtBQUlDLGlCQUFhLENBQ1o7QUFDQyxrQkFBWSw2REFEYjtBQUVDLGVBQVMsQ0FBRSxjQUFGO0FBRlYsS0FEWSxFQUtaO0FBQ0Msa0JBQVksK0NBRGI7QUFFQyxlQUFTLENBQUUsY0FBRjtBQUZWLEtBTFksRUFTWjtBQUNDLGtCQUFZLCtDQURiO0FBRUMsZUFBUyxDQUFFLGdCQUFGLEVBQW9CLG1CQUFwQjtBQUZWLEtBVFksRUFhWjtBQUNDLGtCQUFZLDJEQURiO0FBRUMsZUFBUyxDQUFFLGFBQUYsRUFBaUIsY0FBakI7QUFGVixLQWJZLEVBaUJaO0FBQ0Msa0JBQVksK0NBRGI7QUFFQyxlQUFTLENBQUUsY0FBRixFQUFrQixtQkFBbEI7QUFGVixLQWpCWSxFQXFCWjtBQUNDLGtCQUFZLDJEQURiO0FBRUMsZUFBUyxDQUFFLGFBQUY7QUFGVixLQXJCWSxFQXlCWjtBQUNDLGtCQUFZLCtDQURiO0FBRUMsZUFBUyxDQUFFLGdCQUFGLEVBQW9CLGFBQXBCLEVBQW1DLGNBQW5DLEVBQW1ELG1CQUFuRCxFQUF3RSxhQUF4RTtBQUZWLEtBekJZLEVBNkJaO0FBQ0Msa0JBQVksK0NBRGI7QUFFQyxlQUFTLENBQUUsZ0JBQUYsRUFBb0IsYUFBcEIsRUFBbUMsY0FBbkMsRUFBbUQsbUJBQW5ELEVBQXdFLGFBQXhFO0FBRlYsS0E3QlksRUFpQ1o7QUFDQyxrQkFBWSx3QkFEYjtBQUVDLGVBQVMsQ0FBRSxjQUFGLEVBQWtCLGdCQUFsQixFQUFvQyxhQUFwQyxFQUFtRCxjQUFuRCxFQUFtRSxtQkFBbkUsRUFBd0YsYUFBeEY7QUFGVixLQWpDWTtBQUpkLEdBN0ZxQixFQXdJckI7QUFDQyxlQUFXLHFEQURaO0FBRUMsbUJBQWUsVUFGaEI7QUFHQyxhQUFTLFFBSFY7QUFJQyxpQkFBYSxDQUNaO0FBQ0Msa0JBQVksOERBRGI7QUFFQyxlQUFTLENBQUUsR0FBRjtBQUZWLEtBRFk7QUFKZCxHQXhJcUIsRUFtSnJCO0FBQ0MsZUFBVyxnREFEWjtBQUVDLG1CQUFlLE9BRmhCO0FBR0MsYUFBUyxRQUhWO0FBSUMsaUJBQWEsQ0FDWjtBQUNDLGtCQUFZLDJCQURiO0FBRUMsZUFBUyxDQUFFLGVBQUY7QUFGVixLQURZLEVBS1o7QUFDQyxrQkFBWSw4QkFEYjtBQUVDLGVBQVMsQ0FBRSxjQUFGO0FBRlYsS0FMWTtBQUpkLEdBbkpxQixFQWtLckI7QUFDQyxlQUFXLGdEQURaO0FBRUMsbUJBQWUsUUFGaEI7QUFHQyxhQUFTLFFBSFY7QUFJQyxpQkFBYSxDQUNaO0FBQ0Msa0JBQVkscUJBRGI7QUFFQyxlQUFTLENBQUUsa0JBQUY7QUFGVixLQURZLEVBS1o7QUFDQyxrQkFBWSxtQ0FEYjtBQUVDLGVBQVMsQ0FBRSxZQUFGLEVBQWdCLGtCQUFoQjtBQUZWLEtBTFksRUFTWjtBQUNDLGtCQUFZLCtDQURiO0FBRUMsZUFBUyxDQUFFLGtCQUFGO0FBRlYsS0FUWSxFQWFaO0FBQ0Msa0JBQVkscUJBRGI7QUFFQyxlQUFTLENBQUUsWUFBRixFQUFnQixrQkFBaEI7QUFGVixLQWJZLEVBaUJaO0FBQ0Msa0JBQVksOENBRGI7QUFFQyxlQUFTLENBQUUsc0JBQUYsRUFBMEIseUJBQTFCO0FBRlYsS0FqQlksRUFxQlo7QUFDQyxrQkFBWSwwREFEYjtBQUVDLGVBQVMsQ0FBRSxtQkFBRixFQUF1QixvQkFBdkI7QUFGVixLQXJCWSxFQXlCWjtBQUNDLGtCQUFZLDhDQURiO0FBRUMsZUFBUyxDQUFFLG9CQUFGLEVBQXdCLHlCQUF4QjtBQUZWLEtBekJZLEVBNkJaO0FBQ0Msa0JBQVksMERBRGI7QUFFQyxlQUFTLENBQUUsbUJBQUY7QUFGVixLQTdCWSxFQWlDWjtBQUNDLGtCQUFZLDhDQURiO0FBRUMsZUFBUyxDQUFFLHNCQUFGLEVBQTBCLG1CQUExQixFQUErQyxvQkFBL0MsRUFBcUUseUJBQXJFLEVBQWdHLG1CQUFoRztBQUZWLEtBakNZLEVBcUNaO0FBQ0Msa0JBQVksOENBRGI7QUFFQyxlQUFTLENBQUUsc0JBQUYsRUFBMEIsbUJBQTFCLEVBQStDLG9CQUEvQyxFQUFxRSx5QkFBckUsRUFBZ0csbUJBQWhHO0FBRlYsS0FyQ1k7QUFKZCxHQWxLcUIsRUFpTnJCO0FBQ0MsZUFBVyxvREFEWjtBQUVDLG1CQUFlLFVBRmhCO0FBR0MsYUFBUyxRQUhWO0FBSUMsaUJBQWEsQ0FDWjtBQUNDLGtCQUFZLDZEQURiO0FBRUMsZUFBUyxDQUFFLEdBQUY7QUFGVixLQURZO0FBSmQsR0FqTnFCLEVBNE5yQjtBQUNDLGVBQVcsK0NBRFo7QUFFQyxtQkFBZSxVQUZoQjtBQUdDLGFBQVMsUUFIVjtBQUlDLGlCQUFhLENBQ1o7QUFDQyxrQkFBWSxrQ0FEYjtBQUVDLGVBQVMsQ0FBRSxHQUFGO0FBRlYsS0FEWTtBQUpkLEdBNU5xQixFQXVPckI7QUFDQyxlQUFXLHVDQURaO0FBRUMsbUJBQWUsUUFGaEI7QUFHQyxhQUFTO0FBSFYsR0F2T3FCLEVBNE9yQjtBQUNDLGVBQVcsOENBRFo7QUFFQyxtQkFBZSxRQUZoQjtBQUdDLGFBQVM7QUFIVixHQTVPcUIsRUFpUHJCO0FBQ0MsZUFBVyx1Q0FEWjtBQUVDLG1CQUFlLFFBRmhCO0FBR0MsYUFBUztBQUhWLEdBalBxQixFQXNQckI7QUFDQyxlQUFXLDRDQURaO0FBRUMsbUJBQWUsUUFGaEI7QUFHQyxhQUFTO0FBSFYsR0F0UHFCLEVBMlByQjtBQUNDLGVBQVcsNENBRFo7QUFFQyxtQkFBZSxRQUZoQjtBQUdDLGFBQVMsUUFIVjtBQUlDLGlCQUFhLENBQ1o7QUFDQyxrQkFBWSxtQ0FEYjtBQUVDLGVBQVMsQ0FBRSxPQUFGO0FBRlYsS0FEWSxFQUtaO0FBQ0Msa0JBQVksMENBRGI7QUFFQyxlQUFTLENBQUUsU0FBRjtBQUZWLEtBTFksRUFTWjtBQUNDLGtCQUFZLHlDQURiO0FBRUMsZUFBUyxDQUFFLFNBQUY7QUFGVixLQVRZLEVBYVo7QUFDQyxrQkFBWSwwQ0FEYjtBQUVDLGVBQVMsQ0FBRSxZQUFGO0FBRlYsS0FiWTtBQUpkLEdBM1BxQixFQWtSckI7QUFDQyxlQUFXLDhDQURaO0FBRUMsbUJBQWUsVUFGaEI7QUFHQyxhQUFTLFFBSFY7QUFJQyxpQkFBYSxDQUNaO0FBQ0Msa0JBQVksK0NBRGI7QUFFQyxlQUFTLENBQUUsR0FBRjtBQUZWLEtBRFk7QUFKZCxHQWxScUIsRUE2UnJCO0FBQ0MsZUFBVyxvREFEWjtBQUVDLG1CQUFlLFVBRmhCO0FBR0MsYUFBUztBQUhWLEdBN1JxQixFQWtTckI7QUFDQyxlQUFXLGlEQURaO0FBRUMsbUJBQWUsVUFGaEI7QUFHQyxhQUFTO0FBSFYsR0FsU3FCLEVBdVNyQjtBQUNDLGVBQVcsaUVBRFo7QUFFQyxtQkFBZSxVQUZoQjtBQUdDLGFBQVM7QUFIVixHQXZTcUIsRUE0U3JCO0FBQ0MsZUFBVyxnRUFEWjtBQUVDLG1CQUFlLFVBRmhCO0FBR0MsYUFBUztBQUhWLEdBNVNxQixFQWlUckI7QUFDQyxlQUFXLHFEQURaO0FBRUMsbUJBQWUsVUFGaEI7QUFHQyxhQUFTLFFBSFY7QUFJQyxpQkFBYSxDQUNaO0FBQ0Msa0JBQVksZ0NBRGI7QUFFQyxlQUFTLENBQUUsR0FBRjtBQUZWLEtBRFk7QUFKZCxHQWpUcUIsRUE0VHJCO0FBQ0MsZUFBVywyQ0FEWjtBQUVDLG1CQUFlLFVBRmhCO0FBR0MsYUFBUyxRQUhWO0FBSUMsaUJBQWEsQ0FDWjtBQUNDLGtCQUFZLDRDQURiO0FBRUMsZUFBUyxDQUFFLEdBQUY7QUFGVixLQURZO0FBSmQsR0E1VHFCLEVBdVVyQjtBQUNDLGVBQVcsd0NBRFo7QUFFQyxtQkFBZSxVQUZoQjtBQUdDLGFBQVMsUUFIVjtBQUlDLGlCQUFhLENBQ1o7QUFDQyxrQkFBWSxzREFEYjtBQUVDLGVBQVMsQ0FBRSxHQUFGO0FBRlYsS0FEWTtBQUpkLEdBdlVxQixFQWtWckI7QUFDQyxlQUFXLDZDQURaO0FBRUMsbUJBQWUsUUFGaEI7QUFHQyxhQUFTO0FBSFYsR0FsVnFCLEVBdVZyQjtBQUNDLGVBQVcsbURBRFo7QUFFQyxtQkFBZSxPQUZoQjtBQUdDLGFBQVMsUUFIVjtBQUlDLGlCQUFhLENBQ1o7QUFDQyxrQkFBWSxrQ0FEYjtBQUVDLGVBQVMsQ0FBRSxRQUFGO0FBRlYsS0FEWSxFQUtaO0FBQ0Msa0JBQVksb0NBRGI7QUFFQyxlQUFTLENBQUUsVUFBRjtBQUZWLEtBTFk7QUFKZCxHQXZWcUIsRUFzV3JCO0FBQ0MsZUFBVyxtRUFEWjtBQUVDLG1CQUFlLFVBRmhCO0FBR0MsYUFBUyxRQUhWO0FBSUMsaUJBQWEsQ0FDWjtBQUNDLGtCQUFZLHNEQURiO0FBRUMsZUFBUyxDQUFFLEdBQUY7QUFGVixLQURZO0FBSmQsR0F0V3FCLEVBaVhyQjtBQUNDLGVBQVcsNENBRFo7QUFFQyxtQkFBZSxVQUZoQjtBQUdDLGFBQVMsUUFIVjtBQUlDLGlCQUFhLENBQ1o7QUFDQyxrQkFBWSw2Q0FEYjtBQUVDLGVBQVMsQ0FBRSxHQUFGO0FBRlYsS0FEWSxFQUtaO0FBQ0Msa0JBQVksd0NBRGI7QUFFQyxlQUFTLENBQUUsR0FBRjtBQUZWLEtBTFk7QUFKZCxHQWpYcUIsQ0FBdEI7O0FBa1lBLFdBQVNDLG9CQUFULENBQStCQyxJQUEvQixFQUFxQ0MsZUFBckMsRUFBc0RwSixLQUF0RCxFQUE4RDtBQUM3RCxRQUFNQyxNQUFNLEdBQVFtSixlQUFlLENBQUMvRCxPQUFoQixDQUF5QixtQkFBekIsQ0FBcEI7QUFDQSxRQUFNdEYsT0FBTyxHQUFPb0osSUFBSSxDQUFFLFNBQUYsQ0FBeEI7QUFDQSxRQUFNRSxXQUFXLEdBQUdGLElBQUksQ0FBRSxhQUFGLENBQXhCO0FBQ0EsUUFBTUcsU0FBUyxHQUFLSCxJQUFJLENBQUUsV0FBRixDQUF4QjtBQUVBLFFBQUlJLE1BQU0sR0FBR3ZKLEtBQWI7O0FBRUEsUUFBSyxlQUFlcUosV0FBcEIsRUFBa0M7QUFDakNFLE1BQUFBLE1BQU0sR0FBR0gsZUFBZSxDQUFDN0ksRUFBaEIsQ0FBb0IsVUFBcEIsSUFBbUMsR0FBbkMsR0FBeUMsR0FBbEQ7QUFDQTs7QUFFRCxRQUFLLFlBQVk4SSxXQUFqQixFQUErQjtBQUM5QkUsTUFBQUEsTUFBTSxHQUFHdEosTUFBTSxDQUFDRSxJQUFQLENBQWFKLE9BQU8sR0FBRyxVQUF2QixFQUFvQ2EsR0FBcEMsRUFBVDtBQUNBOztBQUVEakIsSUFBQUEsQ0FBQyxDQUFDK0IsSUFBRixDQUFRNEgsU0FBUixFQUFtQixVQUFVakIsRUFBVixFQUFjbUIsQ0FBZCxFQUFrQjtBQUNwQyxVQUFNN0UsU0FBUyxHQUFLMUUsTUFBTSxDQUFDRSxJQUFQLENBQWFxSixDQUFDLENBQUUsVUFBRixDQUFkLENBQXBCO0FBQ0EsVUFBTUMsV0FBVyxHQUFHRCxDQUFDLENBQUUsT0FBRixDQUFyQjs7QUFFQSxVQUFLQyxXQUFXLENBQUNwSixRQUFaLENBQXNCa0osTUFBdEIsQ0FBTCxFQUFzQztBQUNyQzVFLFFBQUFBLFNBQVMsQ0FBQ25FLElBQVY7QUFDQSxPQUZELE1BRU87QUFDTm1FLFFBQUFBLFNBQVMsQ0FBQ2xFLElBQVY7QUFDQTtBQUNELEtBVEQ7QUFXQWIsSUFBQUEsWUFBWSxDQUFDbUUsT0FBYixDQUFzQixzQkFBdEIsRUFBOEMsQ0FBRWhFLE9BQUYsRUFBV3dKLE1BQVgsRUFBbUJ0SixNQUFuQixDQUE5QztBQUNBOztBQUVELFdBQVN5SixtQkFBVCxDQUE4QlAsSUFBOUIsRUFBb0NDLGVBQXBDLEVBQXFEcEosS0FBckQsRUFBNkQ7QUFDNUQsUUFBSyxTQUFTb0osZUFBZCxFQUFnQztBQUMvQixVQUFNckosT0FBTyxHQUFJb0osSUFBSSxDQUFFLFNBQUYsQ0FBckI7QUFDQSxVQUFNUSxRQUFRLEdBQUdoSyxDQUFDLENBQUVJLE9BQUYsQ0FBbEI7QUFFQUosTUFBQUEsQ0FBQyxDQUFDK0IsSUFBRixDQUFRaUksUUFBUixFQUFrQixZQUFXO0FBQzVCLFlBQU1DLEtBQUssR0FBSWpLLENBQUMsQ0FBRSxJQUFGLENBQWhCOztBQUNBLFlBQU00SixNQUFNLEdBQUdLLEtBQUssQ0FBQ2hKLEdBQU4sRUFBZjs7QUFDQXNJLFFBQUFBLG9CQUFvQixDQUFFQyxJQUFGLEVBQVFTLEtBQVIsRUFBZUwsTUFBZixDQUFwQjtBQUNBLE9BSkQ7QUFLQSxLQVRELE1BU087QUFDTkwsTUFBQUEsb0JBQW9CLENBQUVDLElBQUYsRUFBUUMsZUFBUixFQUF5QnBKLEtBQXpCLENBQXBCO0FBQ0E7QUFDRDs7QUFFRCxXQUFTNkosVUFBVCxHQUFzQztBQUFBLFFBQWpCQyxNQUFpQix1RUFBUixLQUFRO0FBQ3JDbkssSUFBQUEsQ0FBQyxDQUFDK0IsSUFBRixDQUFRdUgsYUFBUixFQUF1QixVQUFVNUYsQ0FBVixFQUFhOEYsSUFBYixFQUFvQjtBQUMxQyxVQUFNcEosT0FBTyxHQUFHb0osSUFBSSxDQUFFLFNBQUYsQ0FBcEI7QUFDQSxVQUFNWSxLQUFLLEdBQUtaLElBQUksQ0FBRSxPQUFGLENBQXBCO0FBRUFPLE1BQUFBLG1CQUFtQixDQUFFUCxJQUFGLEVBQVEsSUFBUixFQUFjLElBQWQsQ0FBbkI7O0FBRUEsVUFBS1csTUFBTCxFQUFjO0FBQ2JsSyxRQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUJrSyxLQUFqQixFQUF3QmhLLE9BQXhCLEVBQWlDLFlBQVc7QUFDM0MsY0FBTTZKLEtBQUssR0FBSWpLLENBQUMsQ0FBRSxJQUFGLENBQWhCOztBQUNBLGNBQU00SixNQUFNLEdBQUc1SixDQUFDLENBQUUsSUFBRixDQUFELENBQVVpQixHQUFWLEVBQWY7O0FBQ0E4SSxVQUFBQSxtQkFBbUIsQ0FBRVAsSUFBRixFQUFRUyxLQUFSLEVBQWVMLE1BQWYsQ0FBbkI7QUFDQSxTQUpEOztBQU1BLFlBQUssQ0FBRTVKLENBQUMsQ0FBRUMsWUFBRixDQUFELENBQWtCc0MsUUFBbEIsQ0FBNEIsUUFBNUIsQ0FBUCxFQUFnRDtBQUMvQ3ZDLFVBQUFBLENBQUMsQ0FBRUMsWUFBRixDQUFELENBQWtCa0UsUUFBbEIsQ0FBNEIsUUFBNUI7QUFFQWxFLFVBQUFBLFlBQVksQ0FBQ21FLE9BQWIsQ0FBc0IsYUFBdEI7QUFDQTtBQUNEO0FBQ0QsS0FuQkQ7QUFvQkE7O0FBRUQ4RixFQUFBQSxVQUFVLENBQUUsSUFBRixDQUFWO0FBRUFqSyxFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUIsYUFBakIsRUFBZ0MsWUFBVztBQUMxQztBQUNBZ0ssSUFBQUEsVUFBVTtBQUNWLEdBSEQ7QUFLQSxDQWpkRCIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLWFkbWluLXNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIERpc3BsYXkgdHlwZSBmaWVsZHMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICB3cHRvb2xzLmlvXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJHF1ZXJ5VHlwZSAgICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1xdWVyeV90eXBlJyApO1xuXHRcdFx0Y29uc3QgdmFsaWREaXNwbGF5VHlwZXMgPSBbICdsYWJlbCcsICdjb2xvcicsICdpbWFnZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZERpc3BsYXlUeXBlcy5pbmNsdWRlcyggdmFsdWUgKSApIHtcblx0XHRcdFx0Y29uc3QgJG11bHRpcGxlRmlsdGVyID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcgKTtcblxuXHRcdFx0XHRpZiAoICRtdWx0aXBsZUZpbHRlci5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkcXVlcnlUeXBlICAgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXF1ZXJ5X3R5cGUnICk7XG5cdFx0XHRjb25zdCAkZGlzcGxheVR5cGUgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnICk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VHlwZSAgICAgICA9ICRkaXNwbGF5VHlwZS52YWwoKTtcblx0XHRcdGNvbnN0IHZhbGlkRGlzcGxheVR5cGVzID0gWyAnbGFiZWwnLCAnY29sb3InLCAnaW1hZ2UnIF07XG5cblx0XHRcdGlmICggdmFsaWREaXNwbGF5VHlwZXMuaW5jbHVkZXMoIGRpc3BsYXlUeXBlICkgKSB7XG5cdFx0XHRcdGlmICggJzEnID09PSB2YWx1ZSApIHtcblx0XHRcdFx0XHQkcXVlcnlUeXBlLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkcXVlcnlUeXBlLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIERpc3BsYXkgdHlwZSBmaWVsZHMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICB3cHRvb2xzLmlvXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdC8vIEhpZXJhcmNoaWNhbCBmaWVsZCdzIHRvZ2dsZSB2aXNpYmlsaXR5IHdoZW4gdGV4dCBkaXNwbGF5IHR5cGUgaXMgY2hhbmdlZC5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkaHJGaWVsZHMgICAgICAgPSAkZmllbGQuZmluZCggJy5oaWVyYXJjaGljYWwtZmllbGRzJyApO1xuXHRcdFx0Y29uc3QgJGhpZXJhcmNoaWNhbCAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtaGllcmFyY2hpY2FsJyApO1xuXHRcdFx0Y29uc3QgdXNlSGllcmFyY2hpY2FsID0gJGhpZXJhcmNoaWNhbC5maW5kKCAnaW5wdXQnICkuaXMoICc6Y2hlY2tlZCcgKTtcblx0XHRcdGNvbnN0ICRockFjY29yZGlvbiAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9oaWVyYXJjaHlfYWNjb3JkaW9uJyApO1xuXG5cdFx0XHRpZiAoICdjaGVja2JveCcgPT09IHZhbHVlIHx8ICdyYWRpbycgPT09IHZhbHVlICkge1xuXHRcdFx0XHQkaHJGaWVsZHMuc2hvdygpO1xuXG5cdFx0XHRcdGlmICggdXNlSGllcmFyY2hpY2FsICkge1xuXHRcdFx0XHRcdCRockFjY29yZGlvbi5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JGhyQWNjb3JkaW9uLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICggJ3NlbGVjdCcgPT09IHZhbHVlIHx8ICdtdWx0aS1zZWxlY3QnID09PSB2YWx1ZSApIHtcblx0XHRcdFx0JGhyRmllbGRzLnNob3coKTtcblx0XHRcdFx0JGhyQWNjb3JkaW9uLmhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRockZpZWxkcy5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gSGllcmFyY2hpY2FsIGFjY29yZGlvbiBmaWVsZCB0b2dnbGUgdmlzaWJpbGl0eSB3aGVuIHNob3cgaGllcmFyY2h5IGlzIGNoYW5nZWQuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWhpZXJhcmNoaWNhbCBpbnB1dCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCBkaXNwbGF5VHlwZSAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgJGhyQWNjb3JkaW9uID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX2hpZXJhcmNoeV9hY2NvcmRpb24nICk7XG5cblx0XHRcdGlmICggJzEnID09PSB2YWx1ZSApIHtcblx0XHRcdFx0aWYgKCAnY2hlY2tib3gnID09PSBkaXNwbGF5VHlwZSB8fCAncmFkaW8nID09PSBkaXNwbGF5VHlwZSApIHtcblx0XHRcdFx0XHQkaHJBY2NvcmRpb24uc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRockFjY29yZGlvbi5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRockFjY29yZGlvbi5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gT3ZlcnJpZGUgbm8tcmVzdWx0cy1tZXNzYWdlLCBhbGwtaXRlbXMtbGFiZWwgZmllbGQncyB0b2dnbGUgdmlzaWJpbGl0eSB3aGVuIHRleHQgZGlzcGxheSB0eXBlIGlzIGNoYW5nZWQuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJG5vUmVzdWx0cyAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0XHRjb25zdCB1c2VDaG9zZW4gICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnICkuaXMoICc6Y2hlY2tlZCcgKTtcblxuXHRcdFx0aWYgKCB1c2VDaG9zZW4gJiYgKCAnc2VsZWN0JyA9PT0gdmFsdWUgfHwgJ211bHRpLXNlbGVjdCcgPT09IHZhbHVlICkgKSB7XG5cdFx0XHRcdCRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggKCAncmFkaW8nID09PSB2YWx1ZSB8fCAnc2VsZWN0JyA9PT0gdmFsdWUgKSB8fCAoICdtdWx0aS1zZWxlY3QnID09PSB2YWx1ZSAmJiB1c2VDaG9zZW4gKSApIHtcblx0XHRcdFx0JGFsbEl0ZW1zTGFiZWwuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGFsbEl0ZW1zTGFiZWwuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdC8vIE92ZXJyaWRlIG5vLXJlc3VsdHMtbWVzc2FnZSwgYWxsLWl0ZW1zLWxhYmVsIGZpZWxkJ3MgdG9nZ2xlIHZpc2liaWxpdHkgd2hlbiB0ZXh0IHVzZSBjaG9zZW4gaXMgY2hhbmdlZC5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0XHRjb25zdCAkYWxsSXRlbXNMYWJlbCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlUeXBlICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCAnMScgPT09IHZhbHVlICYmICggJ3NlbGVjdCcgPT09IGRpc3BsYXlUeXBlIHx8ICdtdWx0aS1zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApICkge1xuXHRcdFx0XHQkbm9SZXN1bHRzLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoXG5cdFx0XHRcdCggJzEnID09PSB2YWx1ZSAmJiAnbXVsdGktc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKVxuXHRcdFx0XHR8fCAoICdyYWRpbycgPT09IGRpc3BsYXlUeXBlIHx8ICdzZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0XHQpIHtcblx0XHRcdFx0JGFsbEl0ZW1zTGFiZWwuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGFsbEl0ZW1zTGFiZWwuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIEZpZWxkIG1ldGEgYm94LlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgd3B0b29scy5pb1xuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblx0Y29uc3QgZmllbGRJbnB1dCAgID0gJ1tuYW1lXTpub3QoLm1hbnVhbF9vcHRpb25zKSc7XG5cdGNvbnN0IGZpZWxkU3RhdGVzICA9IHt9O1xuXG5cdGZ1bmN0aW9uIHN0b3JlRmllbGRTdGF0ZSgpIHtcblx0XHRjb25zdCBmaWVsZFR5cGUgPSBmaWVsZFdyYXBwZXIuZmluZCggJyNmaWVsZF9kYXRhJyApLmF0dHIoICdkYXRhLWZpZWxkLXR5cGUnICk7XG5cblx0XHRpZiAoICEgZmllbGRUeXBlICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZpZWxkVmFsdWVzID0ge307XG5cblx0XHRmaWVsZFdyYXBwZXIuZmluZCggZmllbGRJbnB1dCApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0Y29uc3QgdHlwZSAgID0gJGlucHV0LmF0dHIoICd0eXBlJyApO1xuXHRcdFx0Y29uc3QgbmFtZSAgID0gJGlucHV0LmF0dHIoICduYW1lJyApO1xuXHRcdFx0Y29uc3QgdmFsdWUgID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRpZiAoICdjaGVja2JveCcgPT09IHR5cGUgfHwgJ3JhZGlvJyA9PT0gdHlwZSApIHtcblx0XHRcdFx0aWYgKCAkaW5wdXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdFx0XHRmaWVsZFZhbHVlc1sgbmFtZSBdID0gdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZpZWxkVmFsdWVzWyBuYW1lIF0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHQvLyBIYW5kbGUgbWFudWFsIG9wdGlvbnMuXG5cdFx0Y29uc3QgbWFudWFsT3B0aW9ucyA9IHt9O1xuXG5cdFx0ZmllbGRXcmFwcGVyLmZpbmQoICcubWFudWFsX29wdGlvbnMnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCBuYW1lICAgPSAkaW5wdXQuYXR0ciggJ25hbWUnICk7XG5cblx0XHRcdG1hbnVhbE9wdGlvbnNbIG5hbWUgXSA9ICRpbnB1dC52YWwoKTtcblx0XHR9ICk7XG5cblx0XHRmaWVsZFZhbHVlc1sgJ21hbnVhbF9vcHRpb25zJyBdID0gbWFudWFsT3B0aW9ucztcblxuXHRcdGZpZWxkU3RhdGVzWyBmaWVsZFR5cGUgXSA9IGZpZWxkVmFsdWVzO1xuXHR9XG5cblx0ZnVuY3Rpb24gdXBkYXRlRmllbGRTdGF0ZSggJGVsbSApIHtcblx0XHRjb25zdCBmaWVsZFR5cGUgID0gZmllbGRXcmFwcGVyLmZpbmQoICcjZmllbGRfZGF0YScgKS5hdHRyKCAnZGF0YS1maWVsZC10eXBlJyApO1xuXHRcdGNvbnN0IGZpZWxkU3RhdGUgPSBmaWVsZFN0YXRlc1sgZmllbGRUeXBlIF07XG5cblx0XHRjb25zdCBuYW1lICA9ICRlbG0uYXR0ciggJ25hbWUnICk7XG5cdFx0Y29uc3QgdHlwZSAgPSAkZWxtLmF0dHIoICd0eXBlJyApO1xuXHRcdGNvbnN0IHZhbHVlID0gJGVsbS52YWwoKTtcblxuXHRcdGlmICggJGVsbS5oYXNDbGFzcyggJ21hbnVhbF9vcHRpb25zJyApICkge1xuXHRcdFx0Y29uc3QgbWFudWFsX29wdGlvbnMgPSBmaWVsZFN0YXRlWyAnbWFudWFsX29wdGlvbnMnIF0gfHwge307XG5cblx0XHRcdG1hbnVhbF9vcHRpb25zWyBuYW1lIF0gPSB2YWx1ZTtcblxuXHRcdFx0ZmllbGRTdGF0ZVsgJ21hbnVhbF9vcHRpb25zJyBdID0gbWFudWFsX29wdGlvbnM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICggJ2NoZWNrYm94JyA9PT0gdHlwZSB8fCAncmFkaW8nID09PSB0eXBlICkge1xuXHRcdFx0XHRjb25zdCAkaW5wdXQgPSBmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lPVwiJyArIG5hbWUgKyAnXCJdJyApO1xuXG5cdFx0XHRcdGlmICggJGlucHV0LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRcdFx0ZmllbGRTdGF0ZVsgbmFtZSBdID0gdmFsdWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZGVsZXRlIGZpZWxkU3RhdGVbIG5hbWUgXTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZmllbGRTdGF0ZVsgbmFtZSBdID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gU3RvcmUgdGhlIGluaXRpYWwgZmllbGQgc3RhdGUuXG5cdHN0b3JlRmllbGRTdGF0ZSgpO1xuXG5cdGZpZWxkV3JhcHBlci5maW5kKCAnW25hbWVdJyApLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHR1cGRhdGVGaWVsZFN0YXRlKCAkdGhpcyApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gYXBwbHlGaWVsZFN0YXRlKCBmaWVsZFR5cGUgKSB7XG5cdFx0Y29uc3QgZmllbGRTdGF0ZSA9IGZpZWxkU3RhdGVzWyBmaWVsZFR5cGUgXTtcblxuXHRcdGZpZWxkV3JhcHBlci5maW5kKCBmaWVsZElucHV0ICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCB0eXBlICAgPSAkaW5wdXQuYXR0ciggJ3R5cGUnICk7XG5cdFx0XHRjb25zdCBuYW1lICAgPSAkaW5wdXQuYXR0ciggJ25hbWUnICk7XG5cdFx0XHRjb25zdCB2YWx1ZSAgPSBmaWVsZFN0YXRlWyBuYW1lIF07XG5cblx0XHRcdGlmICggJ2NoZWNrYm94JyA9PT0gdHlwZSB8fCAncmFkaW8nID09PSB0eXBlICkge1xuXHRcdFx0XHRpZiAoIG5hbWUgaW4gZmllbGRTdGF0ZSApIHtcblx0XHRcdFx0XHQvLyBBZGQgJ2NoZWNrZWQnIGF0dHJpYnV0ZS5cblx0XHRcdFx0XHRmaWVsZFdyYXBwZXJcblx0XHRcdFx0XHRcdC5maW5kKCAnW25hbWU9XCInICsgbmFtZSArICdcIl1bdmFsdWU9XCInICsgdmFsdWUgKyAnXCJdJyApXG5cdFx0XHRcdFx0XHQuYXR0ciggJ2NoZWNrZWQnLCAnY2hlY2tlZCcgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBSZW1vdmUgJ2NoZWNrZWQnIGF0dHJpYnV0ZS5cblx0XHRcdFx0XHRmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lPVwiJyArIG5hbWUgKyAnXCJdJyApLnJlbW92ZUF0dHIoICdjaGVja2VkJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkaW5wdXQudmFsKCB2YWx1ZSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdC8vIFByb2Nlc3MgdGhlIG1hbnVhbCBvcHRpb25zLlxuXHRcdGlmICggJ21hbnVhbF9vcHRpb25zJyBpbiBmaWVsZFN0YXRlICkge1xuXHRcdFx0Y29uc3QgcmF3T3B0aW9ucyA9IGZpZWxkU3RhdGVbICdtYW51YWxfb3B0aW9ucycgXTtcblxuXHRcdFx0JC5lYWNoKCByYXdPcHRpb25zLCBmdW5jdGlvbiggaW5wdXROYW1lLCByYXcgKSB7XG5cdFx0XHRcdGNvbnN0ICRyYXdJbnB1dCA9IGZpZWxkV3JhcHBlci5maW5kKCAnW25hbWU9XCInICsgaW5wdXROYW1lICsgJ1wiXScgKTtcblxuXHRcdFx0XHQkcmF3SW5wdXQudmFsKCByYXcgKTtcblxuXHRcdFx0XHRjb25zdCBtYW51YWxPcHRpb25zID0gSlNPTi5wYXJzZSggZGVjb2RlVVJJQ29tcG9uZW50KCByYXcgKSApO1xuXG5cdFx0XHRcdGlmICggISBtYW51YWxPcHRpb25zLmxlbmd0aCApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCB0YWJsZUlkZW50aWZpZXIgPSAkcmF3SW5wdXQuYXR0ciggJ2RhdGEtdGFibGUnICk7XG5cdFx0XHRcdGNvbnN0IHJvd1RlbXBsYXRlSWQgICA9ICRyYXdJbnB1dC5hdHRyKCAnZGF0YS10bXBsJyApO1xuXG5cdFx0XHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdFx0XHRpZiAoICEgalF1ZXJ5KCAnI3RtcGwtJyArIHJvd1RlbXBsYXRlSWQgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3Qgcm93c0lkZW50aWZpZXIgPSAnLmZpZWxkLXRhYmxlLWJvZHktcm93cyc7XG5cdFx0XHRcdGNvbnN0IHJvd0lkZW50aWZpZXIgID0gJy5yb3ctaXRlbSc7XG5cblx0XHRcdFx0Y29uc3QgJHRhYmxlID0gZmllbGRXcmFwcGVyLmZpbmQoIHRhYmxlSWRlbnRpZmllciApO1xuXHRcdFx0XHRjb25zdCAkcm93cyAgPSAkdGFibGUuZmluZCggcm93c0lkZW50aWZpZXIgKTtcblxuXHRcdFx0XHQkLmVhY2goIG1hbnVhbE9wdGlvbnMsIGZ1bmN0aW9uKCBpLCBvcHRpb24gKSB7XG5cdFx0XHRcdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggcm93VGVtcGxhdGVJZCApO1xuXG5cdFx0XHRcdFx0bGV0IHJvd0RlZmF1bHRPcHRpb25zID0ge307XG5cblx0XHRcdFx0XHRpZiAoICcubWFudWFsLW9wdGlvbnMtdGFibGUnID09PSB0YWJsZUlkZW50aWZpZXIgKSB7XG5cdFx0XHRcdFx0XHRyb3dEZWZhdWx0T3B0aW9ucyA9IHtcblx0XHRcdFx0XHRcdFx0J3ZhbHVlJzogJycsXG5cdFx0XHRcdFx0XHRcdCdsYWJlbCc6ICcnLFxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCByb3dEZWZhdWx0T3B0aW9ucyApO1xuXG5cdFx0XHRcdFx0JHJvd3MuYXBwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0XHRcdFx0Y29uc3QgJGxhc3RSb3cgPSAkcm93cy5maW5kKCByb3dJZGVudGlmaWVyICkubGFzdCgpO1xuXG5cdFx0XHRcdFx0JGxhc3RSb3cuZmluZCggJ1tkYXRhLW5hbWVdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0XHRjb25zdCBuYW1lICA9ICR0aGlzLmF0dHIoICdkYXRhLW5hbWUnICk7XG5cdFx0XHRcdFx0XHRjb25zdCB2YWx1ZSA9IG9wdGlvblsgbmFtZSBdO1xuXG5cdFx0XHRcdFx0XHQkdGhpcy52YWwoIHZhbHVlICk7XG5cblx0XHRcdFx0XHRcdGlmICggJ2ltYWdlX3VybCcgPT09IG5hbWUgJiYgdmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRcdCRsYXN0Um93LmZpbmQoICcud3AtaW1hZ2UtcGlja2VyLWNvbnRhaW5lcicgKS5hZGRDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHRcdFx0XHRcdFx0JGxhc3RSb3cuZmluZCggJ2ltZycgKS5hdHRyKCAnc3JjJywgdmFsdWUgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkdGFibGUuYWRkQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Y29uc3QgJGZpZWxkID0gZmllbGRXcmFwcGVyLmZpbmQoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdFx0ZmllbGRXcmFwcGVyLnRyaWdnZXIoICduZXdfb3B0aW9uX2FkZGVkJywgWyAkZmllbGQgXSApO1xuXHRcdH1cblx0fVxuXG5cdCQoICcjYXZhaWxhYmxlX2ZpZWxkcycgKS5vbiggJ2NoYW5nZScsICdbbmFtZT1cIl9hY3RpdmVfZmllbGRcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IF9maWVsZFR5cGUgPSAkdGhpcy52YWwoKTtcblx0XHRjb25zdCBmaWVsZE5hbWUgID0gJHRoaXMuYXR0ciggJ2RhdGEtZmllbGQtbmFtZScgKTtcblxuXHRcdGlmICggISBfZmllbGRUeXBlICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1mb3JtLWZpZWxkLScgKyBfZmllbGRUeXBlO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgdGVtcGxhdGUgICAgICAgICA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRjb25zdCByZW5kZXJlZCAgICAgICAgID0gdGVtcGxhdGUoKTtcblx0XHRjb25zdCBmaWVsZERhdGFXcmFwcGVyID0gZmllbGRXcmFwcGVyLmZpbmQoICcjZmllbGRfZGF0YScgKTtcblx0XHRjb25zdCBmaWVsZE5hbWVXcmFwcGVyID0gZmllbGRXcmFwcGVyLmZpbmQoICcucG9zdGJveC1oZWFkZXIgaDInICk7XG5cdFx0Y29uc3QgZmllbGRJbnNpZGUgICAgICA9IGZpZWxkV3JhcHBlci5maW5kKCAnLmluc2lkZScgKTtcblxuXHRcdGZpZWxkV3JhcHBlci5yZW1vdmVDbGFzcyggJ2hpZGRlbicgKTtcblxuXHRcdGZpZWxkRGF0YVdyYXBwZXIuYXR0ciggJ2RhdGEtZmllbGQtdHlwZScsIF9maWVsZFR5cGUgKTtcblx0XHRmaWVsZE5hbWVXcmFwcGVyLmh0bWwoIGZpZWxkTmFtZSApO1xuXHRcdGZpZWxkSW5zaWRlLmh0bWwoIHJlbmRlcmVkICk7XG5cblx0XHQvLyBJZiBhbHJlYWR5IGZvdW5kIHRoZSBmaWVsZCBzdGF0ZSB0aGVuIGFwcGx5IGl0LCBvdGhlcndpc2Ugc3RvcmUgaXQuXG5cdFx0aWYgKCBfZmllbGRUeXBlIGluIGZpZWxkU3RhdGVzICkge1xuXHRcdFx0YXBwbHlGaWVsZFN0YXRlKCBfZmllbGRUeXBlICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0b3JlRmllbGRTdGF0ZSgpO1xuXHRcdH1cblxuXHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnZmllbGRfYWRkZWQnICk7XG5cblx0XHRmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lXScgKS5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHVwZGF0ZUZpZWxkU3RhdGUoICR0aGlzICk7XG5cdFx0fSApO1xuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogTWFudWFsIE9wdGlvbnMnIHRhYmxlIGZ1bmN0aW9uLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgd3B0b29scy5pb1xuICovXG5cbi8qKlxuICogQHBhcmFtIHRhYmxlSWRlbnRpZmllclxuICogQHBhcmFtIHZhbHVlSWRlbnRpZmllclxuICogQHBhcmFtIHJvd1RlbXBsYXRlSWRcbiAqIEBwYXJhbSByb3dEZWZhdWx0T3B0aW9uc1xuICovXG5mdW5jdGlvbiBpbml0TWFudWFsT3B0aW9uc1RhYmxlKCB0YWJsZUlkZW50aWZpZXIsIHZhbHVlSWRlbnRpZmllciwgcm93VGVtcGxhdGVJZCwgcm93RGVmYXVsdE9wdGlvbnMgPSB7fSApIHtcblx0Y29uc3QgJCA9IGpRdWVyeTtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdGNvbnN0IGZpZWxkSWRlbnRpZmllciA9ICcud2NhcGYtZm9ybS1maWVsZCc7XG5cdGNvbnN0IHJvd3NJZGVudGlmaWVyICA9ICcuZmllbGQtdGFibGUtYm9keS1yb3dzJztcblx0Y29uc3Qgcm93SWRlbnRpZmllciAgID0gJy5yb3ctaXRlbSc7XG5cblx0ZnVuY3Rpb24gaW5pdFNvcnRhYmxlVGFibGUoICRzZWxlY3RvciApIHtcblx0XHQkc2VsZWN0b3Iuc29ydGFibGUoIHtcblx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdHJldmVydDogZmFsc2UsXG5cdFx0XHRjdXJzb3I6ICdtb3ZlJyxcblx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdGhhbmRsZTogJy5tb3ZlLW9wdGlvbnMtaGFuZGxlcicsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHR1cGRhdGU6IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBlLnRhcmdldCApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdFx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdFx0XHR9XG5cdFx0fSApLmRpc2FibGVTZWxlY3Rpb24oKTtcblx0fVxuXG5cdGNvbnN0IHRhYmxlUm93c0lkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnICcgKyByb3dzSWRlbnRpZmllcjtcblxuXHQvLyBJbml0IHRoZSBzb3J0YWJsZSB0YWJsZSBhZnRlciBwYWdlIGxvYWRzLlxuXHRpbml0U29ydGFibGVUYWJsZSggZmllbGRXcmFwcGVyLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKSApO1xuXG5cdC8vIEluaXQgdGhlIHNvcnRhYmxlIHRhYmxlIGFmdGVyIHRoZSBmaWVsZCBpcyBhZGRlZC5cblx0ZmllbGRXcmFwcGVyLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHRpbml0U29ydGFibGVUYWJsZSggJCggZmllbGRXcmFwcGVyLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKSApICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICkge1xuXHRcdGNvbnN0ICR2YWx1ZUhvbGRlciA9ICRmaWVsZC5maW5kKCB2YWx1ZUlkZW50aWZpZXIgKTtcblx0XHRjb25zdCAkcm93cyAgICAgICAgPSAkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApO1xuXHRcdGNvbnN0IF9yb3dzICAgICAgICA9IFtdO1xuXG5cdFx0JHJvd3MuZmluZCggJy5yb3ctaXRlbScgKS5lYWNoKCBmdW5jdGlvbiggaSwgX2l0ZW0gKSB7XG5cdFx0XHRjb25zdCAkaXRlbSA9ICQoIF9pdGVtICk7XG5cdFx0XHRjb25zdCBvYmogICA9IHt9O1xuXG5cdFx0XHQkaXRlbS5maW5kKCAnW2RhdGEtbmFtZV0nICkuZWFjaCggZnVuY3Rpb24oIGZpZWxkSW5kZXgsIGZpZWxkICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBmaWVsZCApO1xuXHRcdFx0XHRjb25zdCBuYW1lICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtbmFtZScgKTtcblxuXHRcdFx0XHRvYmpbIG5hbWUgXSA9ICRmaWVsZC52YWwoKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0X3Jvd3MucHVzaCggb2JqICk7XG5cdFx0fSApO1xuXG5cdFx0Y29uc3QgcmF3VmFsdWVzID0gZW5jb2RlVVJJQ29tcG9uZW50KCBKU09OLnN0cmluZ2lmeSggX3Jvd3MgKSApO1xuXHRcdCR2YWx1ZUhvbGRlci52YWwoIHJhd1ZhbHVlcyApLnRyaWdnZXIoICdjaGFuZ2UnICk7XG5cdH1cblxuXHRmdW5jdGlvbiB0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCB0YWJsZUlkZW50aWZpZXIgKTtcblx0XHRjb25zdCB0YWJsZVJvd3MgICAgID0gJGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKS5jaGlsZHJlbigpO1xuXG5cdFx0aWYgKCAyID4gdGFibGVSb3dzLmxlbmd0aCApIHtcblx0XHRcdCRvcHRpb25zVGFibGUucmVtb3ZlQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH1cblxuXHQvLyBSZW1vdmUgT3B0aW9uXG5cdGNvbnN0IHJlbW92ZUJ0bklkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnIC5yZW1vdmUtb3B0aW9uJztcblxuXHRmaWVsZFdyYXBwZXIub24oICdjbGljaycsIHJlbW92ZUJ0bklkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRpdGVtICA9ICQoIHRoaXMgKS5jbG9zZXN0KCByb3dJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgJGZpZWxkID0gJGl0ZW0uY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKTtcblxuXHRcdCRpdGVtLnJlbW92ZSgpO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQ2xlYXIgQWxsIE9wdGlvbnNcblx0Y29uc3QgY2xlYXJPcHRpb25zQnRuSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgLmNsZWFyLW9wdGlvbnMnO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2NsaWNrJywgY2xlYXJPcHRpb25zQnRuSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0JGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKS5lbXB0eSgpO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICk7XG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQWRkIE5ldyBPcHRpb25cblx0Y29uc3QgYWRkT3B0aW9uQnRuSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgLmFkZC1vcHRpb24nO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2NsaWNrJywgYWRkT3B0aW9uQnRuSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyByb3dUZW1wbGF0ZUlkICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIHJvd1RlbXBsYXRlSWQgKTtcblx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCByb3dEZWZhdWx0T3B0aW9ucyApO1xuXHRcdGNvbnN0ICR0YWJsZSAgID0gJGZpZWxkLmZpbmQoIHRhYmxlSWRlbnRpZmllciApO1xuXHRcdGNvbnN0ICRyb3dzICAgID0gJGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKTtcblxuXHRcdCRyb3dzLmFwcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblxuXHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnbmV3X29wdGlvbl9hZGRlZCcsIFsgJGZpZWxkIF0gKTtcblxuXHRcdGlmICggISAkdGFibGUuaGFzQ2xhc3MoICdoYXMtb3B0aW9ucycgKSApIHtcblx0XHRcdCR0YWJsZS5hZGRDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fSApO1xuXG5cdC8vIFRyaWdnZXIgb3B0aW9ucyBjaGFuZ2Ugd2hlbiB0aGUgdGV4dCBmaWVsZHMgZ2V0IGNoYW5nZWQuXG5cdGNvbnN0IHRleHRGaWVsZHNJZGVudGlmaWVyID0gdGFibGVSb3dzSWRlbnRpZmllciArICcgaW5wdXRbdHlwZT1cInRleHRcIl0nO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2lucHV0JywgdGV4dEZpZWxkc0lkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIFRyaWdnZXIgb3B0aW9ucyBjaGFuZ2Ugd2hlbiB0aGUgc2VsZWN0IGZpZWxkcyBnZXQgY2hhbmdlZC5cblx0bGV0IHNlbGVjdEZpZWxkc0lkZW50aWZpZXIgPSB0YWJsZVJvd3NJZGVudGlmaWVyICsgJyBzZWxlY3QnO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2NoYW5nZScsIHNlbGVjdEZpZWxkc0lkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIFRyaWdnZXIgb3B0aW9ucyBjaGFuZ2Ugd2hlbiB2YWx1ZSBpcyBhZGRlZCBmcm9tIG1vZGFsLlxuXHRmaWVsZFdyYXBwZXIub24oICd0cmlnZ2VyX29wdGlvbnNfdGFibGUnLCBmdW5jdGlvbiggZSwgdGFibGVJZCwgJGZpZWxkICkge1xuXHRcdGlmICggdGFibGVJZCA9PT0gdGFibGVJZGVudGlmaWVyICkge1xuXHRcdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHRcdH1cblx0fSApO1xuXG59XG4iLCIvKipcbiAqIFRoZSBudW1iZXIgdWkgb3B0aW9ucy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0LyoqXG5cdCAqIFRvZ2dsZSBkaXNhYmxlZCBhdHRyaWJ1dGUgb2YgbWluLXZhbHVlIGZpZWxkIGZvciBudW1iZXIgdHlwZS5cblx0ICovXG5cdGZ1bmN0aW9uIHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICRlbG0gKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICA9ICRlbG0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICR0ZXh0RmllbGQgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWUgaW5wdXRbdHlwZT1cInRleHRcIl0nICk7XG5cblx0XHRpZiAoICRlbG0uaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdCR0ZXh0RmllbGQuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkdGV4dEZpZWxkLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHR9XG5cdH1cblxuXHRmaWVsZFdyYXBwZXIub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdGZpZWxkV3JhcHBlci5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0dG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJHRoaXMgKTtcblx0XHR9ICk7XG5cdH0gKTtcblxuXHRmaWVsZFdyYXBwZXIub24oXG5cdFx0J2NsaWNrJyxcblx0XHQnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fVxuXHQpO1xuXG5cdC8qKlxuXHQgKiBUb2dnbGUgZGlzYWJsZWQgYXR0cmlidXRlIG9mIG1heC12YWx1ZSBmaWVsZCBmb3IgbnVtYmVyIHR5cGUuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkZWxtICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkdGV4dEZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXG5cdFx0aWYgKCAkZWxtLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHQkdGV4dEZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHRleHRGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHRmaWVsZFdyYXBwZXIuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fSApO1xuXHR9ICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKFxuXHRcdCdjbGljaycsXG5cdFx0Jy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0XHR0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHRcdH1cblx0KTtcblxufSApO1xuIiwiLyoqXG4gKiBQbHVnaW4gc2V0dGluZ3MgZm9ybS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGlmICggISAkKCAnYm9keScgKS5oYXNDbGFzcyggJ3djYXBmLWZpbHRlcl9wYWdlX3djYXBmLXNldHRpbmdzJyApICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIE1lZGlhIHVwbG9hZGVyLlxuXHQkKCAnLnVwbG9hZC1pbWFnZS1idXR0b24nICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRidXR0b24gICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgJHdyYXBwZXIgICA9ICRidXR0b24uY2xvc2VzdCggJy5tZWRpYS11cGxvYWQnICk7XG5cdFx0Y29uc3QgbW9kYWxUaXRsZSA9ICRidXR0b24uYXR0ciggJ2RhdGEtbW9kYWwtdGl0bGUnICk7XG5cblx0XHRjb25zdCBpbWFnZSA9IHdwLm1lZGlhKCB7IHRpdGxlOiBtb2RhbFRpdGxlLCBtdWx0aXBsZTogZmFsc2UgfSApXG5cdFx0XHQub3BlbigpXG5cdFx0XHQub24oICdzZWxlY3QnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgdXBsb2FkZWRJbWFnZSA9IGltYWdlLnN0YXRlKCkuZ2V0KCAnc2VsZWN0aW9uJyApLmZpcnN0KCk7XG5cdFx0XHRcdGNvbnN0IGltYWdlRGF0YSAgICAgPSB1cGxvYWRlZEltYWdlLnRvSlNPTigpO1xuXHRcdFx0XHRjb25zdCBpbWFnZVVybCAgICAgID0gaW1hZ2VEYXRhLnVybDtcblxuXHRcdFx0XHQkd3JhcHBlci5maW5kKCAnLmltYWdlLWlkJyApLnZhbCggaW1hZ2VEYXRhLmlkICk7XG5cdFx0XHRcdCR3cmFwcGVyLmZpbmQoICcuaW1hZ2Utc3JjJyApLmF0dHIoICdzcmMnLCBpbWFnZVVybCApO1xuXHRcdFx0XHQkd3JhcHBlci5yZW1vdmVDbGFzcyggJ25vLWltYWdlJyApO1xuXHRcdFx0fSApO1xuXHR9ICk7XG5cblx0JCggJy5yZW1vdmUtaW1hZ2UtYnV0dG9uJyApLm9uKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkYnV0dG9uICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCAkd3JhcHBlciA9ICRidXR0b24uY2xvc2VzdCggJy5tZWRpYS11cGxvYWQnICk7XG5cblx0XHQkd3JhcHBlci5maW5kKCAnLmltYWdlLWlkJyApLnZhbCggJycgKTtcblx0XHQkd3JhcHBlci5maW5kKCAnLmltYWdlLXNyYycgKS5hdHRyKCAnc3JjJywgJycgKTtcblx0XHQkd3JhcHBlci5hZGRDbGFzcyggJ25vLWltYWdlJyApO1xuXHR9ICk7XG5cblx0Ly8gVG9nZ2xlIGxvYWRpbmcgaW1hZ2UgZmllbGQuXG5cdGZ1bmN0aW9uIHRvZ2dsZUxvYWRpbmdJbWFnZSggdmFsdWUgKSB7XG5cdFx0Y29uc3QgJHNlbGVjdG9yID0gJCggJy5zZXR0aW5ncy10YWJsZS1sb2FkaW5nX2ltYWdlJyApO1xuXG5cdFx0aWYgKCB2YWx1ZSApIHtcblx0XHRcdCRzZWxlY3Rvci5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRzZWxlY3Rvci5oaWRlKCk7XG5cdFx0fVxuXHR9XG5cblx0Y29uc3QgJGVuYWJsZUxvYWRpbmdPdmVybGF5ID0gJCggJyNsb2FkaW5nX2FuaW1hdGlvbicgKTtcblxuXHRsZXQgZW5hYmxlTG9hZGluZ092ZXJsYXkgPSBmYWxzZTtcblxuXHRpZiAoICRlbmFibGVMb2FkaW5nT3ZlcmxheS5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdGVuYWJsZUxvYWRpbmdPdmVybGF5ID0gdHJ1ZTtcblx0fVxuXG5cdHRvZ2dsZUxvYWRpbmdJbWFnZSggZW5hYmxlTG9hZGluZ092ZXJsYXkgKTtcblxuXHQkZW5hYmxlTG9hZGluZ092ZXJsYXkub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRsZXQgX2VuYWJsZUxvYWRpbmdPdmVybGF5ID0gZmFsc2U7XG5cblx0XHRpZiAoICQoIHRoaXMgKS5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0X2VuYWJsZUxvYWRpbmdPdmVybGF5ID0gdHJ1ZTtcblx0XHR9XG5cblx0XHR0b2dnbGVMb2FkaW5nSW1hZ2UoIF9lbmFibGVMb2FkaW5nT3ZlcmxheSApO1xuXHR9ICk7XG5cblx0Ly8gVG9nZ2xlIHBhZ2luYXRpb24gZmllbGRzLlxuXHRmdW5jdGlvbiBlbmFibGVQYWdpbmF0aW9uKCB2YWx1ZSApIHtcblx0XHRjb25zdCAkc2VsZWN0b3IgPSAkKCAnLnNldHRpbmdzLXRhYmxlLXBhZ2luYXRpb25fY29udGFpbmVyJyApO1xuXG5cdFx0aWYgKCB2YWx1ZSApIHtcblx0XHRcdCRzZWxlY3Rvci5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRzZWxlY3Rvci5oaWRlKCk7XG5cdFx0fVxuXHR9XG5cblx0Y29uc3QgJGVuYWJsZVBhZ2luYXRpb24gPSAkKCAnI2VuYWJsZV9wYWdpbmF0aW9uX3ZpYV9hamF4JyApO1xuXG5cdGxldCBlbmFibGVQYWdpbmF0aW9uT25Mb2FkID0gZmFsc2U7XG5cblx0aWYgKCAkZW5hYmxlUGFnaW5hdGlvbi5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdGVuYWJsZVBhZ2luYXRpb25PbkxvYWQgPSB0cnVlO1xuXHR9XG5cblx0ZW5hYmxlUGFnaW5hdGlvbiggZW5hYmxlUGFnaW5hdGlvbk9uTG9hZCApO1xuXG5cdCRlbmFibGVQYWdpbmF0aW9uLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0bGV0IF9lbmFibGVQYWdpbmF0aW9uID0gZmFsc2U7XG5cblx0XHRpZiAoICQoIHRoaXMgKS5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0X2VuYWJsZVBhZ2luYXRpb24gPSB0cnVlO1xuXHRcdH1cblxuXHRcdGVuYWJsZVBhZ2luYXRpb24oIF9lbmFibGVQYWdpbmF0aW9uICk7XG5cdH0gKTtcblxuXHQvLyBUb2dnbGUgc2Nyb2xsIHdpbmRvdyBmaWVsZHMuXG5cdGZ1bmN0aW9uIHNjcm9sbFdpbmRvdyggdmFsdWUgKSB7XG5cdFx0Y29uc3QgZGVwZW5kZW50RmllbGRzID0gJy5zY3JvbGwtd2luZG93LWRlcGVuZGVudC1maWVsZHMsJyArXG5cdFx0XHQnLnNjcm9sbC13aW5kb3ctY3VzdG9tLWVsZW1lbnQtaW5wdXQsJyArXG5cdFx0XHQnLnNldHRpbmdzLXRhYmxlLXNjcm9sbF90b190b3Bfb2Zmc2V0JztcblxuXHRcdGlmICggJ25vbmUnID09PSB2YWx1ZSApIHtcblx0XHRcdCQoIGRlcGVuZGVudEZpZWxkcyApLmhpZGUoKTtcblx0XHR9IGVsc2UgaWYgKCAncmVzdWx0cycgPT09IHZhbHVlICkge1xuXHRcdFx0JCggJy5zY3JvbGwtd2luZG93LWRlcGVuZGVudC1maWVsZHMsIC5zZXR0aW5ncy10YWJsZS1zY3JvbGxfdG9fdG9wX29mZnNldCcgKS5zaG93KCk7XG5cdFx0XHQkKCAnLnNjcm9sbC13aW5kb3ctY3VzdG9tLWVsZW1lbnQtaW5wdXQnICkuaGlkZSgpO1xuXHRcdH0gZWxzZSBpZiAoICdjdXN0b20nID09PSB2YWx1ZSApIHtcblx0XHRcdCQoICcuc2Nyb2xsLXdpbmRvdy1kZXBlbmRlbnQtZmllbGRzLCAuc2V0dGluZ3MtdGFibGUtc2Nyb2xsX3RvX3RvcF9vZmZzZXQnICkuc2hvdygpO1xuXHRcdFx0JCggJy5zY3JvbGwtd2luZG93LWN1c3RvbS1lbGVtZW50LWlucHV0JyApLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JCggZGVwZW5kZW50RmllbGRzICkuc2hvdygpO1xuXHRcdH1cblx0fVxuXG5cdGNvbnN0ICRzY3JvbGxXaW5kb3cgPSAkKCAnI3Njcm9sbF93aW5kb3cnICk7XG5cblx0c2Nyb2xsV2luZG93KCAkc2Nyb2xsV2luZG93LnZhbCgpICk7XG5cblx0JHNjcm9sbFdpbmRvdy5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IHZhbHVlID0gJCggdGhpcyApLnZhbCgpO1xuXG5cdFx0c2Nyb2xsV2luZG93KCB2YWx1ZSApO1xuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIHByb2R1Y3Qgc3RhdHVzIGZpZWxkLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgd3B0b29scy5pb1xuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cblx0Y29uc3QgdGFibGVJZGVudGlmaWVyID0gJy5wcm9kdWN0LXN0YXR1cy1vcHRpb25zLXRhYmxlJztcblx0Y29uc3QgdmFsdWVJZGVudGlmaWVyID0gJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1wcm9kdWN0X3N0YXR1c19vcHRpb25zIGlucHV0Jztcblx0Y29uc3Qgcm93VGVtcGxhdGVJZCAgID0gJ3djYXBmLXByb2R1Y3Qtc3RhdHVzLW9wdGlvbic7XG5cblx0aW5pdE1hbnVhbE9wdGlvbnNUYWJsZSggdGFibGVJZGVudGlmaWVyLCB2YWx1ZUlkZW50aWZpZXIsIHJvd1RlbXBsYXRlSWQgKTtcblxufSApO1xuIiwiLyoqXG4gKiBUaGUgdG9nZ2xlIHZpc2liaWxpdHkgc2NyaXB0cy5cbiAqXG4gKiBOT1RFOiBUaGVzZSBzY3JpcHRzIG11c3QgYmUgbG9jYXRlZCBhdCB0aGUgdmVyeSBib3R0b20gb2YgdGhlIGNvbWJpbmVkIHNjcmlwdHMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICB3cHRvb2xzLmlvXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdGNvbnN0IGRlcGVuZGFudERhdGEgPSBbXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXZhbHVlX3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5pbnB1dC10eXBlLXRleHQtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0ZXh0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5pbnB1dC10eXBlLW51bWJlci1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ251bWJlcicgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS1kYXRlLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnZGF0ZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcudmFsdWUtZGVjaW1hbC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ251bWJlcicgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcXVlcnlfdHlwZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY2hlY2tib3gnLCAnbXVsdGktc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhZGlvJywgJ3NlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnc2VsZWN0JywgJ211bHRpLXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2NhdGVnb3J5X2ltYWdlcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW1hZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9tdWx0aXBsZV9maWx0ZXInLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2xhYmVsJywgJ2NvbG9yJywgJ2ltYWdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5jb2x1bW4tZ3JvdXAtY3VzdG9tX2FwcGVhcmFuY2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NvbG9yJywgJ2ltYWdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWhpZXJhcmNoaWNhbCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfZGVjaW1hbCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV9kZWNpbWFsX3BsYWNlcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZ2V0X29wdGlvbnMgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuY29sdW1uLWdyb3VwLW1ldGFfa2V5X21hbnVhbF9vcHRpb25zJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdtYW51YWxfZW50cnknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2xpZGVyX2Rpc3BsYXlfdmFsdWVzX2FzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsaWduX3ZhbHVlc19hdF90aGVfZW5kJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NlbGVjdF9hbGxfaXRlbXNfbGFiZWwnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3VzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXInLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2hvd19jb3VudCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JywgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfaGlkZV9lbXB0eScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JywgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItZGVjaW1hbC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NsaWRlcicsICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnLCAncmFuZ2VfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZ2V0X29wdGlvbnMgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLWF1dG9tYXRpYy1vcHRpb25zJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdhdXRvbWF0aWNhbGx5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItbWFudWFsLW9wdGlvbnMtdGFibGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ21hbnVhbF9lbnRyeScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGF0ZV9kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5kYXRlLXRvLXVpLW9wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2lucHV0X2RhdGVfcmFuZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRhdGVfZm9ybWF0Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbnB1dF9kYXRlJywgJ2lucHV0X2RhdGVfcmFuZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNob3dfZGF0ZV9pbnB1dHNfaW5saW5lJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbnB1dF9kYXRlX3JhbmdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5kYXRlLXBpY2tlci1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2lucHV0X2RhdGUnLCAnaW5wdXRfZGF0ZV9yYW5nZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfcXVlcnlfdHlwZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfY2hlY2tib3gnLCAndGltZV9wZXJpb2RfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3NlbGVjdF9hbGxfaXRlbXNfbGFiZWwnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX3JhZGlvJywgJ3RpbWVfcGVyaW9kX3NlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfdXNlX2Nob3NlbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2Rfc2VsZWN0JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9lbmFibGVfbXVsdGlwbGVfZmlsdGVyJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2Rfc2hvd19jb3VudCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfY2hlY2tib3gnLCAndGltZV9wZXJpb2RfcmFkaW8nLCAndGltZV9wZXJpb2Rfc2VsZWN0JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JywgJ3RpbWVfcGVyaW9kX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9oaWRlX2VtcHR5Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9jaGVja2JveCcsICd0aW1lX3BlcmlvZF9yYWRpbycsICd0aW1lX3BlcmlvZF9zZWxlY3QnLCAndGltZV9wZXJpb2RfbXVsdGlzZWxlY3QnLCAndGltZV9wZXJpb2RfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3VzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX3NvZnRfbGltaXQgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtc29mdF9saW1pdCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGF4b25vbXkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtY3VzdG9tLXRheG9ub215IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1ldGFfa2V5IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBvc3RfcHJvcGVydHkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfb3B0aW9ucyBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBhcmVudF90ZXJtJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjaGlsZCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfdmFsdWVzX2J5X2lkJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbmNsdWRlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1leGNsdWRlX3ZhbHVlc19pZCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnZXhjbHVkZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtaW5jbHVkZV91c2VyX3JvbGVzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd1c2VyX3JvbGVzJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfYWNjb3JkaW9uIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFjY29yZGlvbl9kZWZhdWx0X3N0YXRlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfbXVsdGlwbGVfZmlsdGVyIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2F0ZWdvcnlfaW1hZ2VzIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX2NsZWFyX2FsbF9idXR0b24gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuY2xlYXItYWxsLWJ1dHRvbi1maWVsZHMtc3RhcnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNob3dfaWZfZW1wdHkgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW1wdHlfZmlsdGVyX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNob3dfdGl0bGUgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbW92ZV9jbGVhcl9hbGxfYnV0dG9uX2luX3RpdGxlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1vcmRlcl90ZXJtc19ieSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hY3RpdmVfZmlsdGVyc19sYXlvdXQgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuc2ltcGxlLWxheW91dC1zb2Z0LWZpZWxkcy1zdGFydCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnc2ltcGxlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5leHRlbmRlZC1sYXlvdXQtc29mdC1maWVsZHMtc3RhcnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2V4dGVuZGVkJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfc29mdF9saW1pdF9mb3JfZXh0ZW5kZWRfbGF5b3V0IGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNvZnRfbGltaXRfZm9yX2V4dGVuZGVkX2xheW91dCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX3Rvb2x0aXAgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtc2hvd19jb3VudF9pbl90b29sdGlwJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10b29sdGlwX3Bvc2l0aW9uJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRdO1xuXG5cdGZ1bmN0aW9uIF9oYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBjdXJyZW50U2VsZWN0b3IsIHZhbHVlICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgID0gY3VycmVudFNlbGVjdG9yLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCBoYW5kbGVyICAgICA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdGNvbnN0IGhhbmRsZXJUeXBlID0gZGF0YVsgJ2hhbmRsZXJUeXBlJyBdO1xuXHRcdGNvbnN0IGRlcGVuZGFudCAgID0gZGF0YVsgJ2RlcGVuZGFudCcgXTtcblxuXHRcdGxldCBfdmFsdWUgPSB2YWx1ZTtcblxuXHRcdGlmICggJ2NoZWNrYm94JyA9PT0gaGFuZGxlclR5cGUgKSB7XG5cdFx0XHRfdmFsdWUgPSBjdXJyZW50U2VsZWN0b3IuaXMoICc6Y2hlY2tlZCcgKSA/ICcxJyA6ICcwJztcblx0XHR9XG5cblx0XHRpZiAoICdyYWRpbycgPT09IGhhbmRsZXJUeXBlICkge1xuXHRcdFx0X3ZhbHVlID0gJGZpZWxkLmZpbmQoIGhhbmRsZXIgKyAnOmNoZWNrZWQnICkudmFsKCk7XG5cdFx0fVxuXG5cdFx0JC5lYWNoKCBkZXBlbmRhbnQsIGZ1bmN0aW9uKCBpZCwgZCApIHtcblx0XHRcdGNvbnN0ICRzZWxlY3RvciAgID0gJGZpZWxkLmZpbmQoIGRbICdzZWxlY3RvcicgXSApO1xuXHRcdFx0Y29uc3QgdmFsaWRWYWx1ZXMgPSBkWyAndmFsdWUnIF07XG5cblx0XHRcdGlmICggdmFsaWRWYWx1ZXMuaW5jbHVkZXMoIF92YWx1ZSApICkge1xuXHRcdFx0XHQkc2VsZWN0b3Iuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHNlbGVjdG9yLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHRmaWVsZFdyYXBwZXIudHJpZ2dlciggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgWyBoYW5kbGVyLCBfdmFsdWUsICRmaWVsZCBdICk7XG5cdH1cblxuXHRmdW5jdGlvbiBoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBjdXJyZW50U2VsZWN0b3IsIHZhbHVlICkge1xuXHRcdGlmICggbnVsbCA9PT0gY3VycmVudFNlbGVjdG9yICkge1xuXHRcdFx0Y29uc3QgaGFuZGxlciAgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRcdGNvbnN0ICRoYW5kbGVyID0gJCggaGFuZGxlciApO1xuXG5cdFx0XHQkLmVhY2goICRoYW5kbGVyLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgX3RoaXMgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBfdmFsdWUgPSBfdGhpcy52YWwoKTtcblx0XHRcdFx0X2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIF90aGlzLCBfdmFsdWUgKTtcblx0XHRcdH0gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0X2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBzZXR1cEZpZWxkKCBpbml0YWwgPSBmYWxzZSApIHtcblx0XHQkLmVhY2goIGRlcGVuZGFudERhdGEsIGZ1bmN0aW9uKCBpLCBkYXRhICkge1xuXHRcdFx0Y29uc3QgaGFuZGxlciA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdFx0Y29uc3QgZXZlbnQgICA9IGRhdGFbICdldmVudCcgXTtcblxuXHRcdFx0aGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgbnVsbCwgbnVsbCApO1xuXG5cdFx0XHRpZiAoIGluaXRhbCApIHtcblx0XHRcdFx0ZmllbGRXcmFwcGVyLm9uKCBldmVudCwgaGFuZGxlciwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgX3RoaXMgID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdGNvbnN0IF92YWx1ZSA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0XHRoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBfdGhpcywgX3ZhbHVlICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRpZiAoICEgJCggZmllbGRXcmFwcGVyICkuaGFzQ2xhc3MoICdsb2FkZWQnICkgKSB7XG5cdFx0XHRcdFx0JCggZmllbGRXcmFwcGVyICkuYWRkQ2xhc3MoICdsb2FkZWQnICk7XG5cblx0XHRcdFx0XHRmaWVsZFdyYXBwZXIudHJpZ2dlciggJ2ZpZWxkX2FkZGVkJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0c2V0dXBGaWVsZCggdHJ1ZSApO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gVG9nZ2xlIHRoZSB2aXNpYmlsaXR5IG9mIHN1YmZpZWxkcy5cblx0XHRzZXR1cEZpZWxkKCk7XG5cdH0gKTtcblxufSApO1xuIl19
