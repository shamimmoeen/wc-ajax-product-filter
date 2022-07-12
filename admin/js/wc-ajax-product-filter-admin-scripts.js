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
      var thumbnail = imageData.sizes.thumbnail;
      var imageUrl;

      if (thumbnail) {
        imageUrl = imageData.sizes.thumbnail.url;
      } else {
        imageUrl = imageData.url;
      }

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbS1hcHBlYXJhbmNlLWZpZWxkcy5qcyIsImRpc3BsYXktdHlwZS1maWVsZHMuanMiLCJmaWVsZC1tZXRhLWJveC5qcyIsIm1hbnVhbC1vcHRpb25zLXRhYmxlLmpzIiwibnVtYmVyLXVpLW9wdGlvbnMuanMiLCJwbHVnaW4tc2V0dGluZ3MuanMiLCJwcm9kdWN0LXN0YXR1cy10YWJsZS5qcyIsInRvZ2dsZVZpc2liaWxpdHkuanMiXSwibmFtZXMiOlsialF1ZXJ5IiwiZG9jdW1lbnQiLCJyZWFkeSIsIiQiLCJmaWVsZFdyYXBwZXIiLCJvbiIsImUiLCJoYW5kbGVyIiwidmFsdWUiLCIkZmllbGQiLCIkcXVlcnlUeXBlIiwiZmluZCIsInZhbGlkRGlzcGxheVR5cGVzIiwiaW5jbHVkZXMiLCIkbXVsdGlwbGVGaWx0ZXIiLCJpcyIsInNob3ciLCJoaWRlIiwiJGRpc3BsYXlUeXBlIiwiZGlzcGxheVR5cGUiLCJ2YWwiLCIkaHJGaWVsZHMiLCIkaGllcmFyY2hpY2FsIiwidXNlSGllcmFyY2hpY2FsIiwiJGhyQWNjb3JkaW9uIiwiJG5vUmVzdWx0cyIsIiRhbGxJdGVtc0xhYmVsIiwidXNlQ2hvc2VuIiwiZmllbGRJbnB1dCIsImZpZWxkU3RhdGVzIiwic3RvcmVGaWVsZFN0YXRlIiwiZmllbGRUeXBlIiwiYXR0ciIsImZpZWxkVmFsdWVzIiwiZWFjaCIsIiRpbnB1dCIsInR5cGUiLCJuYW1lIiwibWFudWFsT3B0aW9ucyIsInVwZGF0ZUZpZWxkU3RhdGUiLCIkZWxtIiwiZmllbGRTdGF0ZSIsImhhc0NsYXNzIiwibWFudWFsX29wdGlvbnMiLCIkdGhpcyIsImFwcGx5RmllbGRTdGF0ZSIsInJlbW92ZUF0dHIiLCJyYXdPcHRpb25zIiwiaW5wdXROYW1lIiwicmF3IiwiJHJhd0lucHV0IiwiSlNPTiIsInBhcnNlIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwibGVuZ3RoIiwidGFibGVJZGVudGlmaWVyIiwicm93VGVtcGxhdGVJZCIsInJvd3NJZGVudGlmaWVyIiwicm93SWRlbnRpZmllciIsIiR0YWJsZSIsIiRyb3dzIiwiaSIsIm9wdGlvbiIsInRlbXBsYXRlIiwid3AiLCJyb3dEZWZhdWx0T3B0aW9ucyIsInJlbmRlcmVkIiwiYXBwZW5kIiwiJGxhc3RSb3ciLCJsYXN0IiwiYWRkQ2xhc3MiLCJ0cmlnZ2VyIiwiX2ZpZWxkVHlwZSIsImZpZWxkTmFtZSIsImZpZWxkRGF0YVdyYXBwZXIiLCJmaWVsZE5hbWVXcmFwcGVyIiwiZmllbGRJbnNpZGUiLCJyZW1vdmVDbGFzcyIsImh0bWwiLCJpbml0TWFudWFsT3B0aW9uc1RhYmxlIiwidmFsdWVJZGVudGlmaWVyIiwiZmllbGRJZGVudGlmaWVyIiwiaW5pdFNvcnRhYmxlVGFibGUiLCIkc2VsZWN0b3IiLCJzb3J0YWJsZSIsIm9wYWNpdHkiLCJyZXZlcnQiLCJjdXJzb3IiLCJheGlzIiwiaGFuZGxlIiwicGxhY2Vob2xkZXIiLCJ1cGRhdGUiLCJ0YXJnZXQiLCJjbG9zZXN0IiwidHJpZ2dlck9wdGlvbnNDaGFuZ2UiLCJkaXNhYmxlU2VsZWN0aW9uIiwidGFibGVSb3dzSWRlbnRpZmllciIsIiR2YWx1ZUhvbGRlciIsIl9yb3dzIiwiX2l0ZW0iLCIkaXRlbSIsIm9iaiIsImZpZWxkSW5kZXgiLCJmaWVsZCIsInB1c2giLCJyYXdWYWx1ZXMiLCJlbmNvZGVVUklDb21wb25lbnQiLCJzdHJpbmdpZnkiLCJ0cmlnZ2VyUmVtb3ZlT3B0aW9uIiwiJG9wdGlvbnNUYWJsZSIsInRhYmxlUm93cyIsImNoaWxkcmVuIiwicmVtb3ZlQnRuSWRlbnRpZmllciIsInJlbW92ZSIsImNsZWFyT3B0aW9uc0J0bklkZW50aWZpZXIiLCJlbXB0eSIsImFkZE9wdGlvbkJ0bklkZW50aWZpZXIiLCJ0ZXh0RmllbGRzSWRlbnRpZmllciIsInNlbGVjdEZpZWxkc0lkZW50aWZpZXIiLCJ0YWJsZUlkIiwidG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCIsIiR0ZXh0RmllbGQiLCJ0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkIiwiY2xpY2siLCJwcmV2ZW50RGVmYXVsdCIsIiRidXR0b24iLCIkd3JhcHBlciIsIm1vZGFsVGl0bGUiLCJpbWFnZSIsIm1lZGlhIiwidGl0bGUiLCJtdWx0aXBsZSIsIm9wZW4iLCJ1cGxvYWRlZEltYWdlIiwic3RhdGUiLCJnZXQiLCJmaXJzdCIsImltYWdlRGF0YSIsInRvSlNPTiIsInRodW1ibmFpbCIsInNpemVzIiwiaW1hZ2VVcmwiLCJ1cmwiLCJpZCIsInRvZ2dsZUxvYWRpbmdJbWFnZSIsIiRlbmFibGVMb2FkaW5nT3ZlcmxheSIsImVuYWJsZUxvYWRpbmdPdmVybGF5IiwiX2VuYWJsZUxvYWRpbmdPdmVybGF5IiwiZW5hYmxlUGFnaW5hdGlvbiIsIiRlbmFibGVQYWdpbmF0aW9uIiwiZW5hYmxlUGFnaW5hdGlvbk9uTG9hZCIsIl9lbmFibGVQYWdpbmF0aW9uIiwic2Nyb2xsV2luZG93IiwiZGVwZW5kZW50RmllbGRzIiwiJHNjcm9sbFdpbmRvdyIsImRlcGVuZGFudERhdGEiLCJfaGFuZGxlVG9nZ2xlUmVxdWVzdCIsImRhdGEiLCJjdXJyZW50U2VsZWN0b3IiLCJoYW5kbGVyVHlwZSIsImRlcGVuZGFudCIsIl92YWx1ZSIsImQiLCJ2YWxpZFZhbHVlcyIsImhhbmRsZVRvZ2dsZVJlcXVlc3QiLCIkaGFuZGxlciIsIl90aGlzIiwic2V0dXBGaWVsZCIsImluaXRhbCIsImV2ZW50Il0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUEsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVDLENBQVYsRUFBYztBQUV2QyxNQUFNQyxZQUFZLEdBQUdELENBQUMsQ0FBRSx1QkFBRixDQUF0QjtBQUVBQyxFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUIsc0JBQWpCLEVBQXlDLFVBQVVDLENBQVYsRUFBYUMsT0FBYixFQUFzQkMsS0FBdEIsRUFBNkJDLE1BQTdCLEVBQXNDO0FBQzlFLFFBQUssZ0RBQWdERixPQUFyRCxFQUErRDtBQUM5RCxVQUFNRyxVQUFVLEdBQVVELE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLGtDQUFiLENBQTFCO0FBQ0EsVUFBTUMsaUJBQWlCLEdBQUcsQ0FBRSxPQUFGLEVBQVcsT0FBWCxFQUFvQixPQUFwQixDQUExQjs7QUFFQSxVQUFLQSxpQkFBaUIsQ0FBQ0MsUUFBbEIsQ0FBNEJMLEtBQTVCLENBQUwsRUFBMkM7QUFDMUMsWUFBTU0sZUFBZSxHQUFHTCxNQUFNLENBQUNFLElBQVAsQ0FBYSxvREFBYixDQUF4Qjs7QUFFQSxZQUFLRyxlQUFlLENBQUNDLEVBQWhCLENBQW9CLFVBQXBCLENBQUwsRUFBd0M7QUFDdkNMLFVBQUFBLFVBQVUsQ0FBQ00sSUFBWDtBQUNBLFNBRkQsTUFFTztBQUNOTixVQUFBQSxVQUFVLENBQUNPLElBQVg7QUFDQTtBQUNEO0FBQ0Q7QUFDRCxHQWZEO0FBaUJBYixFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUIsc0JBQWpCLEVBQXlDLFVBQVVDLENBQVYsRUFBYUMsT0FBYixFQUFzQkMsS0FBdEIsRUFBNkJDLE1BQTdCLEVBQXNDO0FBQzlFLFFBQUsseURBQXlERixPQUE5RCxFQUF3RTtBQUN2RSxVQUFNRyxVQUFVLEdBQVVELE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLGtDQUFiLENBQTFCO0FBQ0EsVUFBTU8sWUFBWSxHQUFRVCxNQUFNLENBQUNFLElBQVAsQ0FBYSwyQ0FBYixDQUExQjtBQUNBLFVBQU1RLFdBQVcsR0FBU0QsWUFBWSxDQUFDRSxHQUFiLEVBQTFCO0FBQ0EsVUFBTVIsaUJBQWlCLEdBQUcsQ0FBRSxPQUFGLEVBQVcsT0FBWCxFQUFvQixPQUFwQixDQUExQjs7QUFFQSxVQUFLQSxpQkFBaUIsQ0FBQ0MsUUFBbEIsQ0FBNEJNLFdBQTVCLENBQUwsRUFBaUQ7QUFDaEQsWUFBSyxRQUFRWCxLQUFiLEVBQXFCO0FBQ3BCRSxVQUFBQSxVQUFVLENBQUNNLElBQVg7QUFDQSxTQUZELE1BRU87QUFDTk4sVUFBQUEsVUFBVSxDQUFDTyxJQUFYO0FBQ0E7QUFDRDtBQUNEO0FBQ0QsR0FmRDtBQWlCQSxDQXRDRDs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBakIsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVDLENBQVYsRUFBYztBQUV2QyxNQUFNQyxZQUFZLEdBQUdELENBQUMsQ0FBRSx1QkFBRixDQUF0QixDQUZ1QyxDQUl2Qzs7QUFDQUMsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLHNCQUFqQixFQUF5QyxVQUFVQyxDQUFWLEVBQWFDLE9BQWIsRUFBc0JDLEtBQXRCLEVBQTZCQyxNQUE3QixFQUFzQztBQUM5RSxRQUFLLGdEQUFnREYsT0FBckQsRUFBK0Q7QUFDOUQsVUFBTWMsU0FBUyxHQUFTWixNQUFNLENBQUNFLElBQVAsQ0FBYSxzQkFBYixDQUF4QjtBQUNBLFVBQU1XLGFBQWEsR0FBS2IsTUFBTSxDQUFDRSxJQUFQLENBQWEsb0NBQWIsQ0FBeEI7QUFDQSxVQUFNWSxlQUFlLEdBQUdELGFBQWEsQ0FBQ1gsSUFBZCxDQUFvQixPQUFwQixFQUE4QkksRUFBOUIsQ0FBa0MsVUFBbEMsQ0FBeEI7QUFDQSxVQUFNUyxZQUFZLEdBQU1mLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLGtEQUFiLENBQXhCOztBQUVBLFVBQUssZUFBZUgsS0FBZixJQUF3QixZQUFZQSxLQUF6QyxFQUFpRDtBQUNoRGEsUUFBQUEsU0FBUyxDQUFDTCxJQUFWOztBQUVBLFlBQUtPLGVBQUwsRUFBdUI7QUFDdEJDLFVBQUFBLFlBQVksQ0FBQ1IsSUFBYjtBQUNBLFNBRkQsTUFFTztBQUNOUSxVQUFBQSxZQUFZLENBQUNQLElBQWI7QUFDQTtBQUNELE9BUkQsTUFRTyxJQUFLLGFBQWFULEtBQWIsSUFBc0IsbUJBQW1CQSxLQUE5QyxFQUFzRDtBQUM1RGEsUUFBQUEsU0FBUyxDQUFDTCxJQUFWO0FBQ0FRLFFBQUFBLFlBQVksQ0FBQ1AsSUFBYjtBQUNBLE9BSE0sTUFHQTtBQUNOSSxRQUFBQSxTQUFTLENBQUNKLElBQVY7QUFDQTtBQUNEO0FBQ0QsR0F0QkQsRUFMdUMsQ0E2QnZDOztBQUNBYixFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUIsc0JBQWpCLEVBQXlDLFVBQVVDLENBQVYsRUFBYUMsT0FBYixFQUFzQkMsS0FBdEIsRUFBNkJDLE1BQTdCLEVBQXNDO0FBQzlFLFFBQUssK0NBQStDRixPQUFwRCxFQUE4RDtBQUM3RCxVQUFNWSxXQUFXLEdBQUlWLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLDJDQUFiLEVBQTJEUyxHQUEzRCxFQUFyQjtBQUNBLFVBQU1JLFlBQVksR0FBR2YsTUFBTSxDQUFDRSxJQUFQLENBQWEsa0RBQWIsQ0FBckI7O0FBRUEsVUFBSyxRQUFRSCxLQUFiLEVBQXFCO0FBQ3BCLFlBQUssZUFBZVcsV0FBZixJQUE4QixZQUFZQSxXQUEvQyxFQUE2RDtBQUM1REssVUFBQUEsWUFBWSxDQUFDUixJQUFiO0FBQ0EsU0FGRCxNQUVPO0FBQ05RLFVBQUFBLFlBQVksQ0FBQ1AsSUFBYjtBQUNBO0FBQ0QsT0FORCxNQU1PO0FBQ05PLFFBQUFBLFlBQVksQ0FBQ1AsSUFBYjtBQUNBO0FBQ0Q7QUFDRCxHQWZELEVBOUJ1QyxDQStDdkM7O0FBQ0FiLEVBQUFBLFlBQVksQ0FBQ0MsRUFBYixDQUFpQixzQkFBakIsRUFBeUMsVUFBVUMsQ0FBVixFQUFhQyxPQUFiLEVBQXNCQyxLQUF0QixFQUE2QkMsTUFBN0IsRUFBc0M7QUFDOUUsUUFBSyxnREFBZ0RGLE9BQXJELEVBQStEO0FBQzlELFVBQU1rQixVQUFVLEdBQU9oQixNQUFNLENBQUNFLElBQVAsQ0FBYSxpREFBYixDQUF2QjtBQUNBLFVBQU1lLGNBQWMsR0FBR2pCLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLHVDQUFiLENBQXZCO0FBQ0EsVUFBTWdCLFNBQVMsR0FBUWxCLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLHdDQUFiLEVBQXdESSxFQUF4RCxDQUE0RCxVQUE1RCxDQUF2Qjs7QUFFQSxVQUFLWSxTQUFTLEtBQU0sYUFBYW5CLEtBQWIsSUFBc0IsbUJBQW1CQSxLQUEvQyxDQUFkLEVBQXVFO0FBQ3RFaUIsUUFBQUEsVUFBVSxDQUFDVCxJQUFYO0FBQ0EsT0FGRCxNQUVPO0FBQ05TLFFBQUFBLFVBQVUsQ0FBQ1IsSUFBWDtBQUNBOztBQUVELFVBQU8sWUFBWVQsS0FBWixJQUFxQixhQUFhQSxLQUFwQyxJQUFpRCxtQkFBbUJBLEtBQW5CLElBQTRCbUIsU0FBbEYsRUFBZ0c7QUFDL0ZELFFBQUFBLGNBQWMsQ0FBQ1YsSUFBZjtBQUNBLE9BRkQsTUFFTztBQUNOVSxRQUFBQSxjQUFjLENBQUNULElBQWY7QUFDQTtBQUNEO0FBQ0QsR0FsQkQsRUFoRHVDLENBb0V2Qzs7QUFDQWIsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLHNCQUFqQixFQUF5QyxVQUFVQyxDQUFWLEVBQWFDLE9BQWIsRUFBc0JDLEtBQXRCLEVBQTZCQyxNQUE3QixFQUFzQztBQUM5RSxRQUFLLDZDQUE2Q0YsT0FBbEQsRUFBNEQ7QUFDM0QsVUFBTWtCLFVBQVUsR0FBT2hCLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLGlEQUFiLENBQXZCO0FBQ0EsVUFBTWUsY0FBYyxHQUFHakIsTUFBTSxDQUFDRSxJQUFQLENBQWEsdUNBQWIsQ0FBdkI7QUFDQSxVQUFNUSxXQUFXLEdBQU1WLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLDJDQUFiLEVBQTJEUyxHQUEzRCxFQUF2Qjs7QUFFQSxVQUFLLFFBQVFaLEtBQVIsS0FBbUIsYUFBYVcsV0FBYixJQUE0QixtQkFBbUJBLFdBQWxFLENBQUwsRUFBdUY7QUFDdEZNLFFBQUFBLFVBQVUsQ0FBQ1QsSUFBWDtBQUNBLE9BRkQsTUFFTztBQUNOUyxRQUFBQSxVQUFVLENBQUNSLElBQVg7QUFDQTs7QUFFRCxVQUNHLFFBQVFULEtBQVIsSUFBaUIsbUJBQW1CVyxXQUF0QyxJQUNLLFlBQVlBLFdBQVosSUFBMkIsYUFBYUEsV0FGOUMsRUFHRTtBQUNETyxRQUFBQSxjQUFjLENBQUNWLElBQWY7QUFDQSxPQUxELE1BS087QUFDTlUsUUFBQUEsY0FBYyxDQUFDVCxJQUFmO0FBQ0E7QUFDRDtBQUNELEdBckJEO0FBdUJBLENBNUZEOzs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFqQixNQUFNLENBQUVDLFFBQUYsQ0FBTixDQUFtQkMsS0FBbkIsQ0FBMEIsVUFBVUMsQ0FBVixFQUFjO0FBRXZDLE1BQU1DLFlBQVksR0FBR0QsQ0FBQyxDQUFFLHVCQUFGLENBQXRCO0FBQ0EsTUFBTXlCLFVBQVUsR0FBSyw2QkFBckI7QUFDQSxNQUFNQyxXQUFXLEdBQUksRUFBckI7O0FBRUEsV0FBU0MsZUFBVCxHQUEyQjtBQUMxQixRQUFNQyxTQUFTLEdBQUczQixZQUFZLENBQUNPLElBQWIsQ0FBbUIsYUFBbkIsRUFBbUNxQixJQUFuQyxDQUF5QyxpQkFBekMsQ0FBbEI7O0FBRUEsUUFBSyxDQUFFRCxTQUFQLEVBQW1CO0FBQ2xCO0FBQ0E7O0FBRUQsUUFBTUUsV0FBVyxHQUFHLEVBQXBCO0FBRUE3QixJQUFBQSxZQUFZLENBQUNPLElBQWIsQ0FBbUJpQixVQUFuQixFQUFnQ00sSUFBaEMsQ0FBc0MsWUFBVztBQUNoRCxVQUFNQyxNQUFNLEdBQUdoQyxDQUFDLENBQUUsSUFBRixDQUFoQjtBQUNBLFVBQU1pQyxJQUFJLEdBQUtELE1BQU0sQ0FBQ0gsSUFBUCxDQUFhLE1BQWIsQ0FBZjtBQUNBLFVBQU1LLElBQUksR0FBS0YsTUFBTSxDQUFDSCxJQUFQLENBQWEsTUFBYixDQUFmO0FBQ0EsVUFBTXhCLEtBQUssR0FBSTJCLE1BQU0sQ0FBQ2YsR0FBUCxFQUFmOztBQUVBLFVBQUssZUFBZWdCLElBQWYsSUFBdUIsWUFBWUEsSUFBeEMsRUFBK0M7QUFDOUMsWUFBS0QsTUFBTSxDQUFDcEIsRUFBUCxDQUFXLFVBQVgsQ0FBTCxFQUErQjtBQUM5QmtCLFVBQUFBLFdBQVcsQ0FBRUksSUFBRixDQUFYLEdBQXNCN0IsS0FBdEI7QUFDQTtBQUNELE9BSkQsTUFJTztBQUNOeUIsUUFBQUEsV0FBVyxDQUFFSSxJQUFGLENBQVgsR0FBc0I3QixLQUF0QjtBQUNBO0FBQ0QsS0FiRCxFQVQwQixDQXdCMUI7O0FBQ0EsUUFBTThCLGFBQWEsR0FBRyxFQUF0QjtBQUVBbEMsSUFBQUEsWUFBWSxDQUFDTyxJQUFiLENBQW1CLGlCQUFuQixFQUF1Q3VCLElBQXZDLENBQTZDLFlBQVc7QUFDdkQsVUFBTUMsTUFBTSxHQUFHaEMsQ0FBQyxDQUFFLElBQUYsQ0FBaEI7QUFDQSxVQUFNa0MsSUFBSSxHQUFLRixNQUFNLENBQUNILElBQVAsQ0FBYSxNQUFiLENBQWY7QUFFQU0sTUFBQUEsYUFBYSxDQUFFRCxJQUFGLENBQWIsR0FBd0JGLE1BQU0sQ0FBQ2YsR0FBUCxFQUF4QjtBQUNBLEtBTEQ7QUFPQWEsSUFBQUEsV0FBVyxDQUFFLGdCQUFGLENBQVgsR0FBa0NLLGFBQWxDO0FBRUFULElBQUFBLFdBQVcsQ0FBRUUsU0FBRixDQUFYLEdBQTJCRSxXQUEzQjtBQUNBOztBQUVELFdBQVNNLGdCQUFULENBQTJCQyxJQUEzQixFQUFrQztBQUNqQyxRQUFNVCxTQUFTLEdBQUkzQixZQUFZLENBQUNPLElBQWIsQ0FBbUIsYUFBbkIsRUFBbUNxQixJQUFuQyxDQUF5QyxpQkFBekMsQ0FBbkI7QUFDQSxRQUFNUyxVQUFVLEdBQUdaLFdBQVcsQ0FBRUUsU0FBRixDQUE5QjtBQUVBLFFBQU1NLElBQUksR0FBSUcsSUFBSSxDQUFDUixJQUFMLENBQVcsTUFBWCxDQUFkO0FBQ0EsUUFBTUksSUFBSSxHQUFJSSxJQUFJLENBQUNSLElBQUwsQ0FBVyxNQUFYLENBQWQ7QUFDQSxRQUFNeEIsS0FBSyxHQUFHZ0MsSUFBSSxDQUFDcEIsR0FBTCxFQUFkOztBQUVBLFFBQUtvQixJQUFJLENBQUNFLFFBQUwsQ0FBZSxnQkFBZixDQUFMLEVBQXlDO0FBQ3hDLFVBQU1DLGNBQWMsR0FBR0YsVUFBVSxDQUFFLGdCQUFGLENBQVYsSUFBa0MsRUFBekQ7QUFFQUUsTUFBQUEsY0FBYyxDQUFFTixJQUFGLENBQWQsR0FBeUI3QixLQUF6QjtBQUVBaUMsTUFBQUEsVUFBVSxDQUFFLGdCQUFGLENBQVYsR0FBaUNFLGNBQWpDO0FBQ0EsS0FORCxNQU1PO0FBQ04sVUFBSyxlQUFlUCxJQUFmLElBQXVCLFlBQVlBLElBQXhDLEVBQStDO0FBQzlDLFlBQU1ELE1BQU0sR0FBRy9CLFlBQVksQ0FBQ08sSUFBYixDQUFtQixZQUFZMEIsSUFBWixHQUFtQixJQUF0QyxDQUFmOztBQUVBLFlBQUtGLE1BQU0sQ0FBQ3BCLEVBQVAsQ0FBVyxVQUFYLENBQUwsRUFBK0I7QUFDOUIwQixVQUFBQSxVQUFVLENBQUVKLElBQUYsQ0FBVixHQUFxQjdCLEtBQXJCO0FBQ0EsU0FGRCxNQUVPO0FBQ04saUJBQU9pQyxVQUFVLENBQUVKLElBQUYsQ0FBakI7QUFDQTtBQUNELE9BUkQsTUFRTztBQUNOSSxRQUFBQSxVQUFVLENBQUVKLElBQUYsQ0FBVixHQUFxQjdCLEtBQXJCO0FBQ0E7QUFDRDtBQUNELEdBeEVzQyxDQTBFdkM7OztBQUNBc0IsRUFBQUEsZUFBZTtBQUVmMUIsRUFBQUEsWUFBWSxDQUFDTyxJQUFiLENBQW1CLFFBQW5CLEVBQThCTixFQUE5QixDQUFrQyxRQUFsQyxFQUE0QyxZQUFXO0FBQ3RELFFBQU11QyxLQUFLLEdBQUd6QyxDQUFDLENBQUUsSUFBRixDQUFmO0FBRUFvQyxJQUFBQSxnQkFBZ0IsQ0FBRUssS0FBRixDQUFoQjtBQUNBLEdBSkQ7O0FBTUEsV0FBU0MsZUFBVCxDQUEwQmQsU0FBMUIsRUFBc0M7QUFDckMsUUFBTVUsVUFBVSxHQUFHWixXQUFXLENBQUVFLFNBQUYsQ0FBOUI7QUFFQTNCLElBQUFBLFlBQVksQ0FBQ08sSUFBYixDQUFtQmlCLFVBQW5CLEVBQWdDTSxJQUFoQyxDQUFzQyxZQUFXO0FBQ2hELFVBQU1DLE1BQU0sR0FBR2hDLENBQUMsQ0FBRSxJQUFGLENBQWhCO0FBQ0EsVUFBTWlDLElBQUksR0FBS0QsTUFBTSxDQUFDSCxJQUFQLENBQWEsTUFBYixDQUFmO0FBQ0EsVUFBTUssSUFBSSxHQUFLRixNQUFNLENBQUNILElBQVAsQ0FBYSxNQUFiLENBQWY7QUFDQSxVQUFNeEIsS0FBSyxHQUFJaUMsVUFBVSxDQUFFSixJQUFGLENBQXpCOztBQUVBLFVBQUssZUFBZUQsSUFBZixJQUF1QixZQUFZQSxJQUF4QyxFQUErQztBQUM5QyxZQUFLQyxJQUFJLElBQUlJLFVBQWIsRUFBMEI7QUFDekI7QUFDQXJDLFVBQUFBLFlBQVksQ0FDVk8sSUFERixDQUNRLFlBQVkwQixJQUFaLEdBQW1CLFlBQW5CLEdBQWtDN0IsS0FBbEMsR0FBMEMsSUFEbEQsRUFFRXdCLElBRkYsQ0FFUSxTQUZSLEVBRW1CLFNBRm5CO0FBR0EsU0FMRCxNQUtPO0FBQ047QUFDQTVCLFVBQUFBLFlBQVksQ0FBQ08sSUFBYixDQUFtQixZQUFZMEIsSUFBWixHQUFtQixJQUF0QyxFQUE2Q1MsVUFBN0MsQ0FBeUQsU0FBekQ7QUFDQTtBQUNELE9BVkQsTUFVTztBQUNOWCxRQUFBQSxNQUFNLENBQUNmLEdBQVAsQ0FBWVosS0FBWjtBQUNBO0FBQ0QsS0FuQkQsRUFIcUMsQ0F3QnJDOztBQUNBLFFBQUssb0JBQW9CaUMsVUFBekIsRUFBc0M7QUFDckMsVUFBTU0sVUFBVSxHQUFHTixVQUFVLENBQUUsZ0JBQUYsQ0FBN0I7QUFFQXRDLE1BQUFBLENBQUMsQ0FBQytCLElBQUYsQ0FBUWEsVUFBUixFQUFvQixVQUFVQyxTQUFWLEVBQXFCQyxHQUFyQixFQUEyQjtBQUM5QyxZQUFNQyxTQUFTLEdBQUc5QyxZQUFZLENBQUNPLElBQWIsQ0FBbUIsWUFBWXFDLFNBQVosR0FBd0IsSUFBM0MsQ0FBbEI7QUFFQUUsUUFBQUEsU0FBUyxDQUFDOUIsR0FBVixDQUFlNkIsR0FBZjtBQUVBLFlBQU1YLGFBQWEsR0FBR2EsSUFBSSxDQUFDQyxLQUFMLENBQVlDLGtCQUFrQixDQUFFSixHQUFGLENBQTlCLENBQXRCOztBQUVBLFlBQUssQ0FBRVgsYUFBYSxDQUFDZ0IsTUFBckIsRUFBOEI7QUFDN0I7QUFDQTs7QUFFRCxZQUFNQyxlQUFlLEdBQUdMLFNBQVMsQ0FBQ2xCLElBQVYsQ0FBZ0IsWUFBaEIsQ0FBeEI7QUFDQSxZQUFNd0IsYUFBYSxHQUFLTixTQUFTLENBQUNsQixJQUFWLENBQWdCLFdBQWhCLENBQXhCLENBWjhDLENBYzlDOztBQUNBLFlBQUssQ0FBRWhDLE1BQU0sQ0FBRSxXQUFXd0QsYUFBYixDQUFOLENBQW1DRixNQUExQyxFQUFtRDtBQUNsRDtBQUNBOztBQUVELFlBQU1HLGNBQWMsR0FBRyx3QkFBdkI7QUFDQSxZQUFNQyxhQUFhLEdBQUksV0FBdkI7QUFFQSxZQUFNQyxNQUFNLEdBQUd2RCxZQUFZLENBQUNPLElBQWIsQ0FBbUI0QyxlQUFuQixDQUFmO0FBQ0EsWUFBTUssS0FBSyxHQUFJRCxNQUFNLENBQUNoRCxJQUFQLENBQWE4QyxjQUFiLENBQWY7QUFFQXRELFFBQUFBLENBQUMsQ0FBQytCLElBQUYsQ0FBUUksYUFBUixFQUF1QixVQUFVdUIsQ0FBVixFQUFhQyxNQUFiLEVBQXNCO0FBQzVDLGNBQU1DLFFBQVEsR0FBR0MsRUFBRSxDQUFDRCxRQUFILENBQWFQLGFBQWIsQ0FBakI7QUFFQSxjQUFJUyxpQkFBaUIsR0FBRyxFQUF4Qjs7QUFFQSxjQUFLLDRCQUE0QlYsZUFBakMsRUFBbUQ7QUFDbERVLFlBQUFBLGlCQUFpQixHQUFHO0FBQ25CLHVCQUFTLEVBRFU7QUFFbkIsdUJBQVM7QUFGVSxhQUFwQjtBQUlBOztBQUVELGNBQU1DLFFBQVEsR0FBR0gsUUFBUSxDQUFFRSxpQkFBRixDQUF6QjtBQUVBTCxVQUFBQSxLQUFLLENBQUNPLE1BQU4sQ0FBY0QsUUFBZDtBQUVBLGNBQU1FLFFBQVEsR0FBR1IsS0FBSyxDQUFDakQsSUFBTixDQUFZK0MsYUFBWixFQUE0QlcsSUFBNUIsRUFBakI7QUFFQUQsVUFBQUEsUUFBUSxDQUFDekQsSUFBVCxDQUFlLGFBQWYsRUFBK0J1QixJQUEvQixDQUFxQyxZQUFXO0FBQy9DLGdCQUFNVSxLQUFLLEdBQUd6QyxDQUFDLENBQUUsSUFBRixDQUFmO0FBQ0EsZ0JBQU1rQyxJQUFJLEdBQUlPLEtBQUssQ0FBQ1osSUFBTixDQUFZLFdBQVosQ0FBZDtBQUNBLGdCQUFNeEIsS0FBSyxHQUFHc0QsTUFBTSxDQUFFekIsSUFBRixDQUFwQjtBQUVBTyxZQUFBQSxLQUFLLENBQUN4QixHQUFOLENBQVdaLEtBQVg7O0FBRUEsZ0JBQUssZ0JBQWdCNkIsSUFBaEIsSUFBd0I3QixLQUE3QixFQUFxQztBQUNwQzRELGNBQUFBLFFBQVEsQ0FBQ3pELElBQVQsQ0FBZSw0QkFBZixFQUE4QzJELFFBQTlDLENBQXdELFFBQXhEO0FBQ0FGLGNBQUFBLFFBQVEsQ0FBQ3pELElBQVQsQ0FBZSxLQUFmLEVBQXVCcUIsSUFBdkIsQ0FBNkIsS0FBN0IsRUFBb0N4QixLQUFwQztBQUNBO0FBQ0QsV0FYRDtBQVlBLFNBOUJEO0FBZ0NBbUQsUUFBQUEsTUFBTSxDQUFDVyxRQUFQLENBQWlCLGFBQWpCO0FBQ0EsT0ExREQ7QUE0REEsVUFBTTdELE1BQU0sR0FBR0wsWUFBWSxDQUFDTyxJQUFiLENBQW1CLG1CQUFuQixDQUFmO0FBRUFQLE1BQUFBLFlBQVksQ0FBQ21FLE9BQWIsQ0FBc0Isa0JBQXRCLEVBQTBDLENBQUU5RCxNQUFGLENBQTFDO0FBQ0E7QUFDRDs7QUFFRE4sRUFBQUEsQ0FBQyxDQUFFLG1CQUFGLENBQUQsQ0FBeUJFLEVBQXpCLENBQTZCLFFBQTdCLEVBQXVDLHdCQUF2QyxFQUFpRSxZQUFXO0FBQzNFLFFBQU11QyxLQUFLLEdBQVF6QyxDQUFDLENBQUUsSUFBRixDQUFwQjs7QUFDQSxRQUFNcUUsVUFBVSxHQUFHNUIsS0FBSyxDQUFDeEIsR0FBTixFQUFuQjs7QUFDQSxRQUFNcUQsU0FBUyxHQUFJN0IsS0FBSyxDQUFDWixJQUFOLENBQVksaUJBQVosQ0FBbkI7O0FBRUEsUUFBSyxDQUFFd0MsVUFBUCxFQUFvQjtBQUNuQjtBQUNBOztBQUVELFFBQU16QyxTQUFTLEdBQUcsc0JBQXNCeUMsVUFBeEMsQ0FUMkUsQ0FXM0U7O0FBQ0EsUUFBSyxDQUFFeEUsTUFBTSxDQUFFLFdBQVcrQixTQUFiLENBQU4sQ0FBK0J1QixNQUF0QyxFQUErQztBQUM5QztBQUNBOztBQUVELFFBQU1TLFFBQVEsR0FBV0MsRUFBRSxDQUFDRCxRQUFILENBQWFoQyxTQUFiLENBQXpCO0FBQ0EsUUFBTW1DLFFBQVEsR0FBV0gsUUFBUSxFQUFqQztBQUNBLFFBQU1XLGdCQUFnQixHQUFHdEUsWUFBWSxDQUFDTyxJQUFiLENBQW1CLGFBQW5CLENBQXpCO0FBQ0EsUUFBTWdFLGdCQUFnQixHQUFHdkUsWUFBWSxDQUFDTyxJQUFiLENBQW1CLG9CQUFuQixDQUF6QjtBQUNBLFFBQU1pRSxXQUFXLEdBQVF4RSxZQUFZLENBQUNPLElBQWIsQ0FBbUIsU0FBbkIsQ0FBekI7QUFFQVAsSUFBQUEsWUFBWSxDQUFDeUUsV0FBYixDQUEwQixRQUExQjtBQUVBSCxJQUFBQSxnQkFBZ0IsQ0FBQzFDLElBQWpCLENBQXVCLGlCQUF2QixFQUEwQ3dDLFVBQTFDO0FBQ0FHLElBQUFBLGdCQUFnQixDQUFDRyxJQUFqQixDQUF1QkwsU0FBdkI7QUFDQUcsSUFBQUEsV0FBVyxDQUFDRSxJQUFaLENBQWtCWixRQUFsQixFQTFCMkUsQ0E0QjNFOztBQUNBLFFBQUtNLFVBQVUsSUFBSTNDLFdBQW5CLEVBQWlDO0FBQ2hDZ0IsTUFBQUEsZUFBZSxDQUFFMkIsVUFBRixDQUFmO0FBQ0EsS0FGRCxNQUVPO0FBQ04xQyxNQUFBQSxlQUFlO0FBQ2Y7O0FBRUQxQixJQUFBQSxZQUFZLENBQUNtRSxPQUFiLENBQXNCLGFBQXRCO0FBRUFuRSxJQUFBQSxZQUFZLENBQUNPLElBQWIsQ0FBbUIsUUFBbkIsRUFBOEJOLEVBQTlCLENBQWtDLFFBQWxDLEVBQTRDLFlBQVc7QUFDdEQsVUFBTXVDLEtBQUssR0FBR3pDLENBQUMsQ0FBRSxJQUFGLENBQWY7QUFFQW9DLE1BQUFBLGdCQUFnQixDQUFFSyxLQUFGLENBQWhCO0FBQ0EsS0FKRDtBQUtBLEdBMUNEO0FBNENBLENBN05EOzs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVNtQyxzQkFBVCxDQUFpQ3hCLGVBQWpDLEVBQWtEeUIsZUFBbEQsRUFBbUV4QixhQUFuRSxFQUEyRztBQUFBLE1BQXpCUyxpQkFBeUIsdUVBQUwsRUFBSztBQUMxRyxNQUFNOUQsQ0FBQyxHQUFHSCxNQUFWO0FBRUEsTUFBTUksWUFBWSxHQUFHRCxDQUFDLENBQUUsdUJBQUYsQ0FBdEI7QUFFQSxNQUFNOEUsZUFBZSxHQUFHLG1CQUF4QjtBQUNBLE1BQU14QixjQUFjLEdBQUksd0JBQXhCO0FBQ0EsTUFBTUMsYUFBYSxHQUFLLFdBQXhCOztBQUVBLFdBQVN3QixpQkFBVCxDQUE0QkMsU0FBNUIsRUFBd0M7QUFDdkNBLElBQUFBLFNBQVMsQ0FBQ0MsUUFBVixDQUFvQjtBQUNuQkMsTUFBQUEsT0FBTyxFQUFFLEdBRFU7QUFFbkJDLE1BQUFBLE1BQU0sRUFBRSxLQUZXO0FBR25CQyxNQUFBQSxNQUFNLEVBQUUsTUFIVztBQUluQkMsTUFBQUEsSUFBSSxFQUFFLEdBSmE7QUFLbkJDLE1BQUFBLE1BQU0sRUFBRSx1QkFMVztBQU1uQkMsTUFBQUEsV0FBVyxFQUFFLG9CQU5NO0FBT25CQyxNQUFBQSxNQUFNLEVBQUUsZ0JBQVVyRixDQUFWLEVBQWM7QUFDckIsWUFBTUcsTUFBTSxHQUFHTixDQUFDLENBQUVHLENBQUMsQ0FBQ3NGLE1BQUosQ0FBRCxDQUFjQyxPQUFkLENBQXVCLG1CQUF2QixDQUFmO0FBRUFDLFFBQUFBLG9CQUFvQixDQUFFckYsTUFBRixDQUFwQjtBQUNBO0FBWGtCLEtBQXBCLEVBWUlzRixnQkFaSjtBQWFBOztBQUVELE1BQU1DLG1CQUFtQixHQUFHekMsZUFBZSxHQUFHLEdBQWxCLEdBQXdCRSxjQUFwRCxDQXpCMEcsQ0EyQjFHOztBQUNBeUIsRUFBQUEsaUJBQWlCLENBQUU5RSxZQUFZLENBQUNPLElBQWIsQ0FBbUJxRixtQkFBbkIsQ0FBRixDQUFqQixDQTVCMEcsQ0E4QjFHOztBQUNBNUYsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLGFBQWpCLEVBQWdDLFlBQVc7QUFDMUM2RSxJQUFBQSxpQkFBaUIsQ0FBRS9FLENBQUMsQ0FBRUMsWUFBWSxDQUFDTyxJQUFiLENBQW1CcUYsbUJBQW5CLENBQUYsQ0FBSCxDQUFqQjtBQUNBLEdBRkQ7O0FBSUEsV0FBU0Ysb0JBQVQsQ0FBK0JyRixNQUEvQixFQUF3QztBQUN2QyxRQUFNd0YsWUFBWSxHQUFHeEYsTUFBTSxDQUFDRSxJQUFQLENBQWFxRSxlQUFiLENBQXJCO0FBQ0EsUUFBTXBCLEtBQUssR0FBVW5ELE1BQU0sQ0FBQ0UsSUFBUCxDQUFhcUYsbUJBQWIsQ0FBckI7QUFDQSxRQUFNRSxLQUFLLEdBQVUsRUFBckI7QUFFQXRDLElBQUFBLEtBQUssQ0FBQ2pELElBQU4sQ0FBWSxXQUFaLEVBQTBCdUIsSUFBMUIsQ0FBZ0MsVUFBVTJCLENBQVYsRUFBYXNDLEtBQWIsRUFBcUI7QUFDcEQsVUFBTUMsS0FBSyxHQUFHakcsQ0FBQyxDQUFFZ0csS0FBRixDQUFmO0FBQ0EsVUFBTUUsR0FBRyxHQUFLLEVBQWQ7QUFFQUQsTUFBQUEsS0FBSyxDQUFDekYsSUFBTixDQUFZLGFBQVosRUFBNEJ1QixJQUE1QixDQUFrQyxVQUFVb0UsVUFBVixFQUFzQkMsS0FBdEIsRUFBOEI7QUFDL0QsWUFBTTlGLE1BQU0sR0FBR04sQ0FBQyxDQUFFb0csS0FBRixDQUFoQjtBQUNBLFlBQU1sRSxJQUFJLEdBQUs1QixNQUFNLENBQUN1QixJQUFQLENBQWEsV0FBYixDQUFmO0FBRUFxRSxRQUFBQSxHQUFHLENBQUVoRSxJQUFGLENBQUgsR0FBYzVCLE1BQU0sQ0FBQ1csR0FBUCxFQUFkO0FBQ0EsT0FMRDs7QUFPQThFLE1BQUFBLEtBQUssQ0FBQ00sSUFBTixDQUFZSCxHQUFaO0FBQ0EsS0FaRDtBQWNBLFFBQU1JLFNBQVMsR0FBR0Msa0JBQWtCLENBQUV2RCxJQUFJLENBQUN3RCxTQUFMLENBQWdCVCxLQUFoQixDQUFGLENBQXBDO0FBQ0FELElBQUFBLFlBQVksQ0FBQzdFLEdBQWIsQ0FBa0JxRixTQUFsQixFQUE4QmxDLE9BQTlCLENBQXVDLFFBQXZDO0FBQ0E7O0FBRUQsV0FBU3FDLG1CQUFULENBQThCbkcsTUFBOUIsRUFBdUM7QUFDdEMsUUFBTW9HLGFBQWEsR0FBR3BHLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhNEMsZUFBYixDQUF0QjtBQUNBLFFBQU11RCxTQUFTLEdBQU9yRyxNQUFNLENBQUNFLElBQVAsQ0FBYXFGLG1CQUFiLEVBQW1DZSxRQUFuQyxFQUF0Qjs7QUFFQSxRQUFLLElBQUlELFNBQVMsQ0FBQ3hELE1BQW5CLEVBQTRCO0FBQzNCdUQsTUFBQUEsYUFBYSxDQUFDaEMsV0FBZCxDQUEyQixhQUEzQjtBQUNBO0FBQ0QsR0FqRXlHLENBbUUxRzs7O0FBQ0EsTUFBTW1DLG1CQUFtQixHQUFHekQsZUFBZSxHQUFHLGlCQUE5QztBQUVBbkQsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLE9BQWpCLEVBQTBCMkcsbUJBQTFCLEVBQStDLFlBQVc7QUFDekQsUUFBTVosS0FBSyxHQUFJakcsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVMEYsT0FBVixDQUFtQm5DLGFBQW5CLENBQWY7QUFDQSxRQUFNakQsTUFBTSxHQUFHMkYsS0FBSyxDQUFDUCxPQUFOLENBQWVaLGVBQWYsQ0FBZjtBQUVBMkIsSUFBQUEsbUJBQW1CLENBQUVuRyxNQUFGLENBQW5CO0FBRUEyRixJQUFBQSxLQUFLLENBQUNhLE1BQU47QUFFQW5CLElBQUFBLG9CQUFvQixDQUFFckYsTUFBRixDQUFwQjtBQUNBLEdBVEQsRUF0RTBHLENBaUYxRzs7QUFDQSxNQUFNeUcseUJBQXlCLEdBQUczRCxlQUFlLEdBQUcsaUJBQXBEO0FBRUFuRCxFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUIsT0FBakIsRUFBMEI2Ryx5QkFBMUIsRUFBcUQsWUFBVztBQUMvRCxRQUFNekcsTUFBTSxHQUFHTixDQUFDLENBQUUsSUFBRixDQUFELENBQVUwRixPQUFWLENBQW1CWixlQUFuQixDQUFmO0FBRUF4RSxJQUFBQSxNQUFNLENBQUNFLElBQVAsQ0FBYXFGLG1CQUFiLEVBQW1DbUIsS0FBbkM7QUFFQVAsSUFBQUEsbUJBQW1CLENBQUVuRyxNQUFGLENBQW5CO0FBQ0FxRixJQUFBQSxvQkFBb0IsQ0FBRXJGLE1BQUYsQ0FBcEI7QUFDQSxHQVBELEVBcEYwRyxDQTZGMUc7O0FBQ0EsTUFBTTJHLHNCQUFzQixHQUFHN0QsZUFBZSxHQUFHLGNBQWpEO0FBRUFuRCxFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUIsT0FBakIsRUFBMEIrRyxzQkFBMUIsRUFBa0QsWUFBVztBQUM1RDtBQUNBLFFBQUssQ0FBRXBILE1BQU0sQ0FBRSxXQUFXd0QsYUFBYixDQUFOLENBQW1DRixNQUExQyxFQUFtRDtBQUNsRDtBQUNBOztBQUVELFFBQU03QyxNQUFNLEdBQUdOLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVTBGLE9BQVYsQ0FBbUJaLGVBQW5CLENBQWY7QUFFQSxRQUFNbEIsUUFBUSxHQUFHQyxFQUFFLENBQUNELFFBQUgsQ0FBYVAsYUFBYixDQUFqQjtBQUNBLFFBQU1VLFFBQVEsR0FBR0gsUUFBUSxDQUFFRSxpQkFBRixDQUF6QjtBQUNBLFFBQU1OLE1BQU0sR0FBS2xELE1BQU0sQ0FBQ0UsSUFBUCxDQUFhNEMsZUFBYixDQUFqQjtBQUNBLFFBQU1LLEtBQUssR0FBTW5ELE1BQU0sQ0FBQ0UsSUFBUCxDQUFhcUYsbUJBQWIsQ0FBakI7QUFFQXBDLElBQUFBLEtBQUssQ0FBQ08sTUFBTixDQUFjRCxRQUFkO0FBRUE0QixJQUFBQSxvQkFBb0IsQ0FBRXJGLE1BQUYsQ0FBcEI7QUFFQUwsSUFBQUEsWUFBWSxDQUFDbUUsT0FBYixDQUFzQixrQkFBdEIsRUFBMEMsQ0FBRTlELE1BQUYsQ0FBMUM7O0FBRUEsUUFBSyxDQUFFa0QsTUFBTSxDQUFDakIsUUFBUCxDQUFpQixhQUFqQixDQUFQLEVBQTBDO0FBQ3pDaUIsTUFBQUEsTUFBTSxDQUFDVyxRQUFQLENBQWlCLGFBQWpCO0FBQ0E7QUFDRCxHQXRCRCxFQWhHMEcsQ0F3SDFHOztBQUNBLE1BQU0rQyxvQkFBb0IsR0FBR3JCLG1CQUFtQixHQUFHLHFCQUFuRDtBQUVBNUYsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLE9BQWpCLEVBQTBCZ0gsb0JBQTFCLEVBQWdELFlBQVc7QUFDMUQsUUFBTTVHLE1BQU0sR0FBR04sQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVMEYsT0FBVixDQUFtQlosZUFBbkIsQ0FBZjtBQUVBYSxJQUFBQSxvQkFBb0IsQ0FBRXJGLE1BQUYsQ0FBcEI7QUFDQSxHQUpELEVBM0gwRyxDQWlJMUc7O0FBQ0EsTUFBSTZHLHNCQUFzQixHQUFHdEIsbUJBQW1CLEdBQUcsU0FBbkQ7QUFFQTVGLEVBQUFBLFlBQVksQ0FBQ0MsRUFBYixDQUFpQixRQUFqQixFQUEyQmlILHNCQUEzQixFQUFtRCxZQUFXO0FBQzdELFFBQU03RyxNQUFNLEdBQUdOLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVTBGLE9BQVYsQ0FBbUJaLGVBQW5CLENBQWY7QUFFQWEsSUFBQUEsb0JBQW9CLENBQUVyRixNQUFGLENBQXBCO0FBQ0EsR0FKRCxFQXBJMEcsQ0EwSTFHOztBQUNBTCxFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUIsdUJBQWpCLEVBQTBDLFVBQVVDLENBQVYsRUFBYWlILE9BQWIsRUFBc0I5RyxNQUF0QixFQUErQjtBQUN4RSxRQUFLOEcsT0FBTyxLQUFLaEUsZUFBakIsRUFBbUM7QUFDbEN1QyxNQUFBQSxvQkFBb0IsQ0FBRXJGLE1BQUYsQ0FBcEI7QUFDQTtBQUNELEdBSkQ7QUFNQTs7O0FDaEtEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQVQsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVDLENBQVYsRUFBYztBQUV2QyxNQUFNQyxZQUFZLEdBQUdELENBQUMsQ0FBRSx1QkFBRixDQUF0QjtBQUVBO0FBQ0Q7QUFDQTs7QUFDQyxXQUFTcUgseUJBQVQsQ0FBb0NoRixJQUFwQyxFQUEyQztBQUMxQyxRQUFNL0IsTUFBTSxHQUFPK0IsSUFBSSxDQUFDcUQsT0FBTCxDQUFjLG1CQUFkLENBQW5CO0FBQ0EsUUFBTTRCLFVBQVUsR0FBR2hILE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLG9EQUFiLENBQW5COztBQUVBLFFBQUs2QixJQUFJLENBQUN6QixFQUFMLENBQVMsVUFBVCxDQUFMLEVBQTZCO0FBQzVCMEcsTUFBQUEsVUFBVSxDQUFDekYsSUFBWCxDQUFpQixVQUFqQixFQUE2QixVQUE3QjtBQUNBLEtBRkQsTUFFTztBQUNOeUYsTUFBQUEsVUFBVSxDQUFDM0UsVUFBWCxDQUF1QixVQUF2QjtBQUNBO0FBQ0Q7O0FBRUQxQyxFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUIsYUFBakIsRUFBZ0MsWUFBVztBQUMxQ0QsSUFBQUEsWUFBWSxDQUFDTyxJQUFiLENBQW1CLG9FQUFuQixFQUEwRnVCLElBQTFGLENBQWdHLFlBQVc7QUFDMUcsVUFBTVUsS0FBSyxHQUFHekMsQ0FBQyxDQUFFLElBQUYsQ0FBZjtBQUVBcUgsTUFBQUEseUJBQXlCLENBQUU1RSxLQUFGLENBQXpCO0FBQ0EsS0FKRDtBQUtBLEdBTkQ7QUFRQXhDLEVBQUFBLFlBQVksQ0FBQ0MsRUFBYixDQUNDLE9BREQsRUFFQyxvRUFGRCxFQUdDLFlBQVc7QUFDVixRQUFNdUMsS0FBSyxHQUFHekMsQ0FBQyxDQUFFLElBQUYsQ0FBZjtBQUVBcUgsSUFBQUEseUJBQXlCLENBQUU1RSxLQUFGLENBQXpCO0FBQ0EsR0FQRjtBQVVBO0FBQ0Q7QUFDQTs7QUFDQyxXQUFTOEUseUJBQVQsQ0FBb0NsRixJQUFwQyxFQUEyQztBQUMxQyxRQUFNL0IsTUFBTSxHQUFPK0IsSUFBSSxDQUFDcUQsT0FBTCxDQUFjLG1CQUFkLENBQW5CO0FBQ0EsUUFBTTRCLFVBQVUsR0FBR2hILE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLG9EQUFiLENBQW5COztBQUVBLFFBQUs2QixJQUFJLENBQUN6QixFQUFMLENBQVMsVUFBVCxDQUFMLEVBQTZCO0FBQzVCMEcsTUFBQUEsVUFBVSxDQUFDekYsSUFBWCxDQUFpQixVQUFqQixFQUE2QixVQUE3QjtBQUNBLEtBRkQsTUFFTztBQUNOeUYsTUFBQUEsVUFBVSxDQUFDM0UsVUFBWCxDQUF1QixVQUF2QjtBQUNBO0FBQ0Q7O0FBRUQxQyxFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUIsYUFBakIsRUFBZ0MsWUFBVztBQUMxQ0QsSUFBQUEsWUFBWSxDQUFDTyxJQUFiLENBQW1CLG9FQUFuQixFQUEwRnVCLElBQTFGLENBQWdHLFlBQVc7QUFDMUcsVUFBTVUsS0FBSyxHQUFHekMsQ0FBQyxDQUFFLElBQUYsQ0FBZjtBQUVBdUgsTUFBQUEseUJBQXlCLENBQUU5RSxLQUFGLENBQXpCO0FBQ0EsS0FKRDtBQUtBLEdBTkQ7QUFRQXhDLEVBQUFBLFlBQVksQ0FBQ0MsRUFBYixDQUNDLE9BREQsRUFFQyxvRUFGRCxFQUdDLFlBQVc7QUFDVixRQUFNdUMsS0FBSyxHQUFHekMsQ0FBQyxDQUFFLElBQUYsQ0FBZjtBQUVBdUgsSUFBQUEseUJBQXlCLENBQUU5RSxLQUFGLENBQXpCO0FBQ0EsR0FQRjtBQVVBLENBcEVEOzs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE1QyxNQUFNLENBQUVDLFFBQUYsQ0FBTixDQUFtQkMsS0FBbkIsQ0FBMEIsVUFBVUMsQ0FBVixFQUFjO0FBRXZDLE1BQUssQ0FBRUEsQ0FBQyxDQUFFLE1BQUYsQ0FBRCxDQUFZdUMsUUFBWixDQUFzQixrQ0FBdEIsQ0FBUCxFQUFvRTtBQUNuRTtBQUNBLEdBSnNDLENBTXZDOzs7QUFDQXZDLEVBQUFBLENBQUMsQ0FBRSxzQkFBRixDQUFELENBQTRCd0gsS0FBNUIsQ0FBbUMsVUFBVXJILENBQVYsRUFBYztBQUNoREEsSUFBQUEsQ0FBQyxDQUFDc0gsY0FBRjtBQUVBLFFBQU1DLE9BQU8sR0FBTTFILENBQUMsQ0FBRSxJQUFGLENBQXBCO0FBQ0EsUUFBTTJILFFBQVEsR0FBS0QsT0FBTyxDQUFDaEMsT0FBUixDQUFpQixlQUFqQixDQUFuQjtBQUNBLFFBQU1rQyxVQUFVLEdBQUdGLE9BQU8sQ0FBQzdGLElBQVIsQ0FBYyxrQkFBZCxDQUFuQjtBQUVBLFFBQU1nRyxLQUFLLEdBQUdoRSxFQUFFLENBQUNpRSxLQUFILENBQVU7QUFBRUMsTUFBQUEsS0FBSyxFQUFFSCxVQUFUO0FBQXFCSSxNQUFBQSxRQUFRLEVBQUU7QUFBL0IsS0FBVixFQUNaQyxJQURZLEdBRVovSCxFQUZZLENBRVIsUUFGUSxFQUVFLFlBQVc7QUFDekIsVUFBTWdJLGFBQWEsR0FBR0wsS0FBSyxDQUFDTSxLQUFOLEdBQWNDLEdBQWQsQ0FBbUIsV0FBbkIsRUFBaUNDLEtBQWpDLEVBQXRCO0FBQ0EsVUFBTUMsU0FBUyxHQUFPSixhQUFhLENBQUNLLE1BQWQsRUFBdEI7QUFFQSxVQUFRQyxTQUFSLEdBQXNCRixTQUFTLENBQUNHLEtBQWhDLENBQVFELFNBQVI7QUFDQSxVQUFJRSxRQUFKOztBQUVBLFVBQUtGLFNBQUwsRUFBaUI7QUFDaEJFLFFBQUFBLFFBQVEsR0FBR0osU0FBUyxDQUFDRyxLQUFWLENBQWdCRCxTQUFoQixDQUEwQkcsR0FBckM7QUFDQSxPQUZELE1BRU87QUFDTkQsUUFBQUEsUUFBUSxHQUFHSixTQUFTLENBQUNLLEdBQXJCO0FBQ0E7O0FBRURoQixNQUFBQSxRQUFRLENBQUNuSCxJQUFULENBQWUsV0FBZixFQUE2QlMsR0FBN0IsQ0FBa0NxSCxTQUFTLENBQUNNLEVBQTVDO0FBQ0FqQixNQUFBQSxRQUFRLENBQUNuSCxJQUFULENBQWUsWUFBZixFQUE4QnFCLElBQTlCLENBQW9DLEtBQXBDLEVBQTJDNkcsUUFBM0M7QUFDQWYsTUFBQUEsUUFBUSxDQUFDakQsV0FBVCxDQUFzQixVQUF0QjtBQUNBLEtBbEJZLENBQWQ7QUFtQkEsR0ExQkQ7QUE0QkExRSxFQUFBQSxDQUFDLENBQUUsc0JBQUYsQ0FBRCxDQUE0QkUsRUFBNUIsQ0FBZ0MsT0FBaEMsRUFBeUMsVUFBVUMsQ0FBVixFQUFjO0FBQ3REQSxJQUFBQSxDQUFDLENBQUNzSCxjQUFGO0FBRUEsUUFBTUMsT0FBTyxHQUFJMUgsQ0FBQyxDQUFFLElBQUYsQ0FBbEI7QUFDQSxRQUFNMkgsUUFBUSxHQUFHRCxPQUFPLENBQUNoQyxPQUFSLENBQWlCLGVBQWpCLENBQWpCO0FBRUFpQyxJQUFBQSxRQUFRLENBQUNuSCxJQUFULENBQWUsV0FBZixFQUE2QlMsR0FBN0IsQ0FBa0MsRUFBbEM7QUFDQTBHLElBQUFBLFFBQVEsQ0FBQ25ILElBQVQsQ0FBZSxZQUFmLEVBQThCcUIsSUFBOUIsQ0FBb0MsS0FBcEMsRUFBMkMsRUFBM0M7QUFDQThGLElBQUFBLFFBQVEsQ0FBQ3hELFFBQVQsQ0FBbUIsVUFBbkI7QUFDQSxHQVRELEVBbkN1QyxDQThDdkM7O0FBQ0EsV0FBUzBFLGtCQUFULENBQTZCeEksS0FBN0IsRUFBcUM7QUFDcEMsUUFBTTJFLFNBQVMsR0FBR2hGLENBQUMsQ0FBRSwrQkFBRixDQUFuQjs7QUFFQSxRQUFLSyxLQUFMLEVBQWE7QUFDWjJFLE1BQUFBLFNBQVMsQ0FBQ25FLElBQVY7QUFDQSxLQUZELE1BRU87QUFDTm1FLE1BQUFBLFNBQVMsQ0FBQ2xFLElBQVY7QUFDQTtBQUNEOztBQUVELE1BQU1nSSxxQkFBcUIsR0FBRzlJLENBQUMsQ0FBRSxvQkFBRixDQUEvQjtBQUVBLE1BQUkrSSxvQkFBb0IsR0FBRyxLQUEzQjs7QUFFQSxNQUFLRCxxQkFBcUIsQ0FBQ2xJLEVBQXRCLENBQTBCLFVBQTFCLENBQUwsRUFBOEM7QUFDN0NtSSxJQUFBQSxvQkFBb0IsR0FBRyxJQUF2QjtBQUNBOztBQUVERixFQUFBQSxrQkFBa0IsQ0FBRUUsb0JBQUYsQ0FBbEI7QUFFQUQsRUFBQUEscUJBQXFCLENBQUM1SSxFQUF0QixDQUEwQixRQUExQixFQUFvQyxZQUFXO0FBQzlDLFFBQUk4SSxxQkFBcUIsR0FBRyxLQUE1Qjs7QUFFQSxRQUFLaEosQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVWSxFQUFWLENBQWMsVUFBZCxDQUFMLEVBQWtDO0FBQ2pDb0ksTUFBQUEscUJBQXFCLEdBQUcsSUFBeEI7QUFDQTs7QUFFREgsSUFBQUEsa0JBQWtCLENBQUVHLHFCQUFGLENBQWxCO0FBQ0EsR0FSRCxFQW5FdUMsQ0E2RXZDOztBQUNBLFdBQVNDLGdCQUFULENBQTJCNUksS0FBM0IsRUFBbUM7QUFDbEMsUUFBTTJFLFNBQVMsR0FBR2hGLENBQUMsQ0FBRSxzQ0FBRixDQUFuQjs7QUFFQSxRQUFLSyxLQUFMLEVBQWE7QUFDWjJFLE1BQUFBLFNBQVMsQ0FBQ25FLElBQVY7QUFDQSxLQUZELE1BRU87QUFDTm1FLE1BQUFBLFNBQVMsQ0FBQ2xFLElBQVY7QUFDQTtBQUNEOztBQUVELE1BQU1vSSxpQkFBaUIsR0FBR2xKLENBQUMsQ0FBRSw2QkFBRixDQUEzQjtBQUVBLE1BQUltSixzQkFBc0IsR0FBRyxLQUE3Qjs7QUFFQSxNQUFLRCxpQkFBaUIsQ0FBQ3RJLEVBQWxCLENBQXNCLFVBQXRCLENBQUwsRUFBMEM7QUFDekN1SSxJQUFBQSxzQkFBc0IsR0FBRyxJQUF6QjtBQUNBOztBQUVERixFQUFBQSxnQkFBZ0IsQ0FBRUUsc0JBQUYsQ0FBaEI7QUFFQUQsRUFBQUEsaUJBQWlCLENBQUNoSixFQUFsQixDQUFzQixRQUF0QixFQUFnQyxZQUFXO0FBQzFDLFFBQUlrSixpQkFBaUIsR0FBRyxLQUF4Qjs7QUFFQSxRQUFLcEosQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVWSxFQUFWLENBQWMsVUFBZCxDQUFMLEVBQWtDO0FBQ2pDd0ksTUFBQUEsaUJBQWlCLEdBQUcsSUFBcEI7QUFDQTs7QUFFREgsSUFBQUEsZ0JBQWdCLENBQUVHLGlCQUFGLENBQWhCO0FBQ0EsR0FSRCxFQWxHdUMsQ0E0R3ZDOztBQUNBLFdBQVNDLFlBQVQsQ0FBdUJoSixLQUF2QixFQUErQjtBQUM5QixRQUFNaUosZUFBZSxHQUFHLHFDQUN2QixzQ0FEdUIsR0FFdkIsc0NBRkQ7O0FBSUEsUUFBSyxXQUFXakosS0FBaEIsRUFBd0I7QUFDdkJMLE1BQUFBLENBQUMsQ0FBRXNKLGVBQUYsQ0FBRCxDQUFxQnhJLElBQXJCO0FBQ0EsS0FGRCxNQUVPLElBQUssY0FBY1QsS0FBbkIsRUFBMkI7QUFDakNMLE1BQUFBLENBQUMsQ0FBRSx1RUFBRixDQUFELENBQTZFYSxJQUE3RTtBQUNBYixNQUFBQSxDQUFDLENBQUUscUNBQUYsQ0FBRCxDQUEyQ2MsSUFBM0M7QUFDQSxLQUhNLE1BR0EsSUFBSyxhQUFhVCxLQUFsQixFQUEwQjtBQUNoQ0wsTUFBQUEsQ0FBQyxDQUFFLHVFQUFGLENBQUQsQ0FBNkVhLElBQTdFO0FBQ0FiLE1BQUFBLENBQUMsQ0FBRSxxQ0FBRixDQUFELENBQTJDYSxJQUEzQztBQUNBLEtBSE0sTUFHQTtBQUNOYixNQUFBQSxDQUFDLENBQUVzSixlQUFGLENBQUQsQ0FBcUJ6SSxJQUFyQjtBQUNBO0FBQ0Q7O0FBRUQsTUFBTTBJLGFBQWEsR0FBR3ZKLENBQUMsQ0FBRSxnQkFBRixDQUF2QjtBQUVBcUosRUFBQUEsWUFBWSxDQUFFRSxhQUFhLENBQUN0SSxHQUFkLEVBQUYsQ0FBWjtBQUVBc0ksRUFBQUEsYUFBYSxDQUFDckosRUFBZCxDQUFrQixRQUFsQixFQUE0QixZQUFXO0FBQ3RDLFFBQU1HLEtBQUssR0FBR0wsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVaUIsR0FBVixFQUFkO0FBRUFvSSxJQUFBQSxZQUFZLENBQUVoSixLQUFGLENBQVo7QUFDQSxHQUpEO0FBTUEsQ0F6SUQ7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQVIsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFlBQVc7QUFFcEMsTUFBTXFELGVBQWUsR0FBRywrQkFBeEI7QUFDQSxNQUFNeUIsZUFBZSxHQUFHLG9EQUF4QjtBQUNBLE1BQU14QixhQUFhLEdBQUssNkJBQXhCO0FBRUF1QixFQUFBQSxzQkFBc0IsQ0FBRXhCLGVBQUYsRUFBbUJ5QixlQUFuQixFQUFvQ3hCLGFBQXBDLENBQXRCO0FBRUEsQ0FSRDs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQXhELE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixVQUFVQyxDQUFWLEVBQWM7QUFFdkMsTUFBTUMsWUFBWSxHQUFHRCxDQUFDLENBQUUsdUJBQUYsQ0FBdEI7QUFFQSxNQUFNd0osYUFBYSxHQUFHLENBQ3JCO0FBQ0MsZUFBVyx5Q0FEWjtBQUVDLG1CQUFlLFFBRmhCO0FBR0MsYUFBUyxRQUhWO0FBSUMsaUJBQWEsQ0FDWjtBQUNDLGtCQUFZLHlCQURiO0FBRUMsZUFBUyxDQUFFLE1BQUY7QUFGVixLQURZLEVBS1o7QUFDQyxrQkFBWSwyQkFEYjtBQUVDLGVBQVMsQ0FBRSxRQUFGO0FBRlYsS0FMWSxFQVNaO0FBQ0Msa0JBQVkseUJBRGI7QUFFQyxlQUFTLENBQUUsTUFBRjtBQUZWLEtBVFksRUFhWjtBQUNDLGtCQUFZLHVCQURiO0FBRUMsZUFBUyxDQUFFLFFBQUY7QUFGVixLQWJZO0FBSmQsR0FEcUIsRUF3QnJCO0FBQ0MsZUFBVywyQ0FEWjtBQUVDLG1CQUFlLFFBRmhCO0FBR0MsYUFBUyxRQUhWO0FBSUMsaUJBQWEsQ0FDWjtBQUNDLGtCQUFZLGtDQURiO0FBRUMsZUFBUyxDQUFFLFVBQUYsRUFBYyxjQUFkO0FBRlYsS0FEWSxFQUtaO0FBQ0Msa0JBQVksdUNBRGI7QUFFQyxlQUFTLENBQUUsT0FBRixFQUFXLFFBQVg7QUFGVixLQUxZLEVBU1o7QUFDQyxrQkFBWSxrQ0FEYjtBQUVDLGVBQVMsQ0FBRSxRQUFGLEVBQVksY0FBWjtBQUZWLEtBVFksRUFhWjtBQUNDLGtCQUFZLDJDQURiO0FBRUMsZUFBUyxDQUFFLE9BQUY7QUFGVixLQWJZLEVBaUJaO0FBQ0Msa0JBQVksOENBRGI7QUFFQyxlQUFTLENBQUUsT0FBRixFQUFXLE9BQVgsRUFBb0IsT0FBcEI7QUFGVixLQWpCWSxFQXFCWjtBQUNDLGtCQUFZLGlDQURiO0FBRUMsZUFBUyxDQUFFLE9BQUYsRUFBVyxPQUFYO0FBRlYsS0FyQlk7QUFKZCxHQXhCcUIsRUF1RHJCO0FBQ0MsZUFBVyx3Q0FEWjtBQUVDLG1CQUFlLFVBRmhCO0FBR0MsYUFBUyxRQUhWO0FBSUMsaUJBQWEsQ0FDWjtBQUNDLGtCQUFZLGlEQURiO0FBRUMsZUFBUyxDQUFFLEdBQUY7QUFGVixLQURZO0FBSmQsR0F2RHFCLEVBa0VyQjtBQUNDLGVBQVcsMENBRFo7QUFFQyxtQkFBZSxVQUZoQjtBQUdDLGFBQVM7QUFIVixHQWxFcUIsRUF1RXJCO0FBQ0MsZUFBVywyQ0FEWjtBQUVDLG1CQUFlLFVBRmhCO0FBR0MsYUFBUyxRQUhWO0FBSUMsaUJBQWEsQ0FDWjtBQUNDLGtCQUFZLDRDQURiO0FBRUMsZUFBUyxDQUFFLEdBQUY7QUFGVixLQURZO0FBSmQsR0F2RXFCLEVBa0ZyQjtBQUNDLGVBQVcseUNBRFo7QUFFQyxtQkFBZSxPQUZoQjtBQUdDLGFBQVMsUUFIVjtBQUlDLGlCQUFhLENBQ1o7QUFDQyxrQkFBWSx1Q0FEYjtBQUVDLGVBQVMsQ0FBRSxjQUFGO0FBRlYsS0FEWTtBQUpkLEdBbEZxQixFQTZGckI7QUFDQyxlQUFXLGtEQURaO0FBRUMsbUJBQWUsUUFGaEI7QUFHQyxhQUFTLFFBSFY7QUFJQyxpQkFBYSxDQUNaO0FBQ0Msa0JBQVksNkRBRGI7QUFFQyxlQUFTLENBQUUsY0FBRjtBQUZWLEtBRFksRUFLWjtBQUNDLGtCQUFZLCtDQURiO0FBRUMsZUFBUyxDQUFFLGNBQUY7QUFGVixLQUxZLEVBU1o7QUFDQyxrQkFBWSwrQ0FEYjtBQUVDLGVBQVMsQ0FBRSxnQkFBRixFQUFvQixtQkFBcEI7QUFGVixLQVRZLEVBYVo7QUFDQyxrQkFBWSwyREFEYjtBQUVDLGVBQVMsQ0FBRSxhQUFGLEVBQWlCLGNBQWpCO0FBRlYsS0FiWSxFQWlCWjtBQUNDLGtCQUFZLCtDQURiO0FBRUMsZUFBUyxDQUFFLGNBQUYsRUFBa0IsbUJBQWxCO0FBRlYsS0FqQlksRUFxQlo7QUFDQyxrQkFBWSwyREFEYjtBQUVDLGVBQVMsQ0FBRSxhQUFGO0FBRlYsS0FyQlksRUF5Qlo7QUFDQyxrQkFBWSwrQ0FEYjtBQUVDLGVBQVMsQ0FBRSxnQkFBRixFQUFvQixhQUFwQixFQUFtQyxjQUFuQyxFQUFtRCxtQkFBbkQsRUFBd0UsYUFBeEU7QUFGVixLQXpCWSxFQTZCWjtBQUNDLGtCQUFZLCtDQURiO0FBRUMsZUFBUyxDQUFFLGdCQUFGLEVBQW9CLGFBQXBCLEVBQW1DLGNBQW5DLEVBQW1ELG1CQUFuRCxFQUF3RSxhQUF4RTtBQUZWLEtBN0JZLEVBaUNaO0FBQ0Msa0JBQVksd0JBRGI7QUFFQyxlQUFTLENBQUUsY0FBRixFQUFrQixnQkFBbEIsRUFBb0MsYUFBcEMsRUFBbUQsY0FBbkQsRUFBbUUsbUJBQW5FLEVBQXdGLGFBQXhGO0FBRlYsS0FqQ1k7QUFKZCxHQTdGcUIsRUF3SXJCO0FBQ0MsZUFBVyxxREFEWjtBQUVDLG1CQUFlLFVBRmhCO0FBR0MsYUFBUyxRQUhWO0FBSUMsaUJBQWEsQ0FDWjtBQUNDLGtCQUFZLDhEQURiO0FBRUMsZUFBUyxDQUFFLEdBQUY7QUFGVixLQURZO0FBSmQsR0F4SXFCLEVBbUpyQjtBQUNDLGVBQVcsZ0RBRFo7QUFFQyxtQkFBZSxPQUZoQjtBQUdDLGFBQVMsUUFIVjtBQUlDLGlCQUFhLENBQ1o7QUFDQyxrQkFBWSwyQkFEYjtBQUVDLGVBQVMsQ0FBRSxlQUFGO0FBRlYsS0FEWSxFQUtaO0FBQ0Msa0JBQVksOEJBRGI7QUFFQyxlQUFTLENBQUUsY0FBRjtBQUZWLEtBTFk7QUFKZCxHQW5KcUIsRUFrS3JCO0FBQ0MsZUFBVyxnREFEWjtBQUVDLG1CQUFlLFFBRmhCO0FBR0MsYUFBUyxRQUhWO0FBSUMsaUJBQWEsQ0FDWjtBQUNDLGtCQUFZLHFCQURiO0FBRUMsZUFBUyxDQUFFLGtCQUFGO0FBRlYsS0FEWSxFQUtaO0FBQ0Msa0JBQVksbUNBRGI7QUFFQyxlQUFTLENBQUUsWUFBRixFQUFnQixrQkFBaEI7QUFGVixLQUxZLEVBU1o7QUFDQyxrQkFBWSwrQ0FEYjtBQUVDLGVBQVMsQ0FBRSxrQkFBRjtBQUZWLEtBVFksRUFhWjtBQUNDLGtCQUFZLHFCQURiO0FBRUMsZUFBUyxDQUFFLFlBQUYsRUFBZ0Isa0JBQWhCO0FBRlYsS0FiWSxFQWlCWjtBQUNDLGtCQUFZLDhDQURiO0FBRUMsZUFBUyxDQUFFLHNCQUFGLEVBQTBCLHlCQUExQjtBQUZWLEtBakJZLEVBcUJaO0FBQ0Msa0JBQVksMERBRGI7QUFFQyxlQUFTLENBQUUsbUJBQUYsRUFBdUIsb0JBQXZCO0FBRlYsS0FyQlksRUF5Qlo7QUFDQyxrQkFBWSw4Q0FEYjtBQUVDLGVBQVMsQ0FBRSxvQkFBRixFQUF3Qix5QkFBeEI7QUFGVixLQXpCWSxFQTZCWjtBQUNDLGtCQUFZLDBEQURiO0FBRUMsZUFBUyxDQUFFLG1CQUFGO0FBRlYsS0E3QlksRUFpQ1o7QUFDQyxrQkFBWSw4Q0FEYjtBQUVDLGVBQVMsQ0FBRSxzQkFBRixFQUEwQixtQkFBMUIsRUFBK0Msb0JBQS9DLEVBQXFFLHlCQUFyRSxFQUFnRyxtQkFBaEc7QUFGVixLQWpDWSxFQXFDWjtBQUNDLGtCQUFZLDhDQURiO0FBRUMsZUFBUyxDQUFFLHNCQUFGLEVBQTBCLG1CQUExQixFQUErQyxvQkFBL0MsRUFBcUUseUJBQXJFLEVBQWdHLG1CQUFoRztBQUZWLEtBckNZO0FBSmQsR0FsS3FCLEVBaU5yQjtBQUNDLGVBQVcsb0RBRFo7QUFFQyxtQkFBZSxVQUZoQjtBQUdDLGFBQVMsUUFIVjtBQUlDLGlCQUFhLENBQ1o7QUFDQyxrQkFBWSw2REFEYjtBQUVDLGVBQVMsQ0FBRSxHQUFGO0FBRlYsS0FEWTtBQUpkLEdBak5xQixFQTROckI7QUFDQyxlQUFXLCtDQURaO0FBRUMsbUJBQWUsVUFGaEI7QUFHQyxhQUFTLFFBSFY7QUFJQyxpQkFBYSxDQUNaO0FBQ0Msa0JBQVksa0NBRGI7QUFFQyxlQUFTLENBQUUsR0FBRjtBQUZWLEtBRFk7QUFKZCxHQTVOcUIsRUF1T3JCO0FBQ0MsZUFBVyx1Q0FEWjtBQUVDLG1CQUFlLFFBRmhCO0FBR0MsYUFBUztBQUhWLEdBdk9xQixFQTRPckI7QUFDQyxlQUFXLDhDQURaO0FBRUMsbUJBQWUsUUFGaEI7QUFHQyxhQUFTO0FBSFYsR0E1T3FCLEVBaVByQjtBQUNDLGVBQVcsdUNBRFo7QUFFQyxtQkFBZSxRQUZoQjtBQUdDLGFBQVM7QUFIVixHQWpQcUIsRUFzUHJCO0FBQ0MsZUFBVyw0Q0FEWjtBQUVDLG1CQUFlLFFBRmhCO0FBR0MsYUFBUztBQUhWLEdBdFBxQixFQTJQckI7QUFDQyxlQUFXLDRDQURaO0FBRUMsbUJBQWUsUUFGaEI7QUFHQyxhQUFTLFFBSFY7QUFJQyxpQkFBYSxDQUNaO0FBQ0Msa0JBQVksbUNBRGI7QUFFQyxlQUFTLENBQUUsT0FBRjtBQUZWLEtBRFksRUFLWjtBQUNDLGtCQUFZLDBDQURiO0FBRUMsZUFBUyxDQUFFLFNBQUY7QUFGVixLQUxZLEVBU1o7QUFDQyxrQkFBWSx5Q0FEYjtBQUVDLGVBQVMsQ0FBRSxTQUFGO0FBRlYsS0FUWTtBQUpkLEdBM1BxQixFQThRckI7QUFDQyxlQUFXLDhDQURaO0FBRUMsbUJBQWUsVUFGaEI7QUFHQyxhQUFTLFFBSFY7QUFJQyxpQkFBYSxDQUNaO0FBQ0Msa0JBQVksK0NBRGI7QUFFQyxlQUFTLENBQUUsR0FBRjtBQUZWLEtBRFk7QUFKZCxHQTlRcUIsRUF5UnJCO0FBQ0MsZUFBVyxvREFEWjtBQUVDLG1CQUFlLFVBRmhCO0FBR0MsYUFBUztBQUhWLEdBelJxQixFQThSckI7QUFDQyxlQUFXLGlEQURaO0FBRUMsbUJBQWUsVUFGaEI7QUFHQyxhQUFTO0FBSFYsR0E5UnFCLEVBbVNyQjtBQUNDLGVBQVcsaUVBRFo7QUFFQyxtQkFBZSxVQUZoQjtBQUdDLGFBQVM7QUFIVixHQW5TcUIsRUF3U3JCO0FBQ0MsZUFBVyxnRUFEWjtBQUVDLG1CQUFlLFVBRmhCO0FBR0MsYUFBUztBQUhWLEdBeFNxQixFQTZTckI7QUFDQyxlQUFXLHFEQURaO0FBRUMsbUJBQWUsVUFGaEI7QUFHQyxhQUFTLFFBSFY7QUFJQyxpQkFBYSxDQUNaO0FBQ0Msa0JBQVksZ0NBRGI7QUFFQyxlQUFTLENBQUUsR0FBRjtBQUZWLEtBRFk7QUFKZCxHQTdTcUIsRUF3VHJCO0FBQ0MsZUFBVywyQ0FEWjtBQUVDLG1CQUFlLFVBRmhCO0FBR0MsYUFBUyxRQUhWO0FBSUMsaUJBQWEsQ0FDWjtBQUNDLGtCQUFZLDRDQURiO0FBRUMsZUFBUyxDQUFFLEdBQUY7QUFGVixLQURZO0FBSmQsR0F4VHFCLEVBbVVyQjtBQUNDLGVBQVcsd0NBRFo7QUFFQyxtQkFBZSxVQUZoQjtBQUdDLGFBQVMsUUFIVjtBQUlDLGlCQUFhLENBQ1o7QUFDQyxrQkFBWSxzREFEYjtBQUVDLGVBQVMsQ0FBRSxHQUFGO0FBRlYsS0FEWTtBQUpkLEdBblVxQixFQThVckI7QUFDQyxlQUFXLDZDQURaO0FBRUMsbUJBQWUsUUFGaEI7QUFHQyxhQUFTO0FBSFYsR0E5VXFCLEVBbVZyQjtBQUNDLGVBQVcsbURBRFo7QUFFQyxtQkFBZSxPQUZoQjtBQUdDLGFBQVMsUUFIVjtBQUlDLGlCQUFhLENBQ1o7QUFDQyxrQkFBWSxrQ0FEYjtBQUVDLGVBQVMsQ0FBRSxRQUFGO0FBRlYsS0FEWSxFQUtaO0FBQ0Msa0JBQVksb0NBRGI7QUFFQyxlQUFTLENBQUUsVUFBRjtBQUZWLEtBTFk7QUFKZCxHQW5WcUIsRUFrV3JCO0FBQ0MsZUFBVyxtRUFEWjtBQUVDLG1CQUFlLFVBRmhCO0FBR0MsYUFBUyxRQUhWO0FBSUMsaUJBQWEsQ0FDWjtBQUNDLGtCQUFZLHNEQURiO0FBRUMsZUFBUyxDQUFFLEdBQUY7QUFGVixLQURZO0FBSmQsR0FsV3FCLEVBNldyQjtBQUNDLGVBQVcsNENBRFo7QUFFQyxtQkFBZSxVQUZoQjtBQUdDLGFBQVMsUUFIVjtBQUlDLGlCQUFhLENBQ1o7QUFDQyxrQkFBWSw2Q0FEYjtBQUVDLGVBQVMsQ0FBRSxHQUFGO0FBRlYsS0FEWSxFQUtaO0FBQ0Msa0JBQVksd0NBRGI7QUFFQyxlQUFTLENBQUUsR0FBRjtBQUZWLEtBTFk7QUFKZCxHQTdXcUIsQ0FBdEI7O0FBOFhBLFdBQVNDLG9CQUFULENBQStCQyxJQUEvQixFQUFxQ0MsZUFBckMsRUFBc0R0SixLQUF0RCxFQUE4RDtBQUM3RCxRQUFNQyxNQUFNLEdBQVFxSixlQUFlLENBQUNqRSxPQUFoQixDQUF5QixtQkFBekIsQ0FBcEI7QUFDQSxRQUFNdEYsT0FBTyxHQUFPc0osSUFBSSxDQUFFLFNBQUYsQ0FBeEI7QUFDQSxRQUFNRSxXQUFXLEdBQUdGLElBQUksQ0FBRSxhQUFGLENBQXhCO0FBQ0EsUUFBTUcsU0FBUyxHQUFLSCxJQUFJLENBQUUsV0FBRixDQUF4QjtBQUVBLFFBQUlJLE1BQU0sR0FBR3pKLEtBQWI7O0FBRUEsUUFBSyxlQUFldUosV0FBcEIsRUFBa0M7QUFDakNFLE1BQUFBLE1BQU0sR0FBR0gsZUFBZSxDQUFDL0ksRUFBaEIsQ0FBb0IsVUFBcEIsSUFBbUMsR0FBbkMsR0FBeUMsR0FBbEQ7QUFDQTs7QUFFRCxRQUFLLFlBQVlnSixXQUFqQixFQUErQjtBQUM5QkUsTUFBQUEsTUFBTSxHQUFHeEosTUFBTSxDQUFDRSxJQUFQLENBQWFKLE9BQU8sR0FBRyxVQUF2QixFQUFvQ2EsR0FBcEMsRUFBVDtBQUNBOztBQUVEakIsSUFBQUEsQ0FBQyxDQUFDK0IsSUFBRixDQUFROEgsU0FBUixFQUFtQixVQUFVakIsRUFBVixFQUFjbUIsQ0FBZCxFQUFrQjtBQUNwQyxVQUFNL0UsU0FBUyxHQUFLMUUsTUFBTSxDQUFDRSxJQUFQLENBQWF1SixDQUFDLENBQUUsVUFBRixDQUFkLENBQXBCO0FBQ0EsVUFBTUMsV0FBVyxHQUFHRCxDQUFDLENBQUUsT0FBRixDQUFyQjs7QUFFQSxVQUFLQyxXQUFXLENBQUN0SixRQUFaLENBQXNCb0osTUFBdEIsQ0FBTCxFQUFzQztBQUNyQzlFLFFBQUFBLFNBQVMsQ0FBQ25FLElBQVY7QUFDQSxPQUZELE1BRU87QUFDTm1FLFFBQUFBLFNBQVMsQ0FBQ2xFLElBQVY7QUFDQTtBQUNELEtBVEQ7QUFXQWIsSUFBQUEsWUFBWSxDQUFDbUUsT0FBYixDQUFzQixzQkFBdEIsRUFBOEMsQ0FBRWhFLE9BQUYsRUFBVzBKLE1BQVgsRUFBbUJ4SixNQUFuQixDQUE5QztBQUNBOztBQUVELFdBQVMySixtQkFBVCxDQUE4QlAsSUFBOUIsRUFBb0NDLGVBQXBDLEVBQXFEdEosS0FBckQsRUFBNkQ7QUFDNUQsUUFBSyxTQUFTc0osZUFBZCxFQUFnQztBQUMvQixVQUFNdkosT0FBTyxHQUFJc0osSUFBSSxDQUFFLFNBQUYsQ0FBckI7QUFDQSxVQUFNUSxRQUFRLEdBQUdsSyxDQUFDLENBQUVJLE9BQUYsQ0FBbEI7QUFFQUosTUFBQUEsQ0FBQyxDQUFDK0IsSUFBRixDQUFRbUksUUFBUixFQUFrQixZQUFXO0FBQzVCLFlBQU1DLEtBQUssR0FBSW5LLENBQUMsQ0FBRSxJQUFGLENBQWhCOztBQUNBLFlBQU04SixNQUFNLEdBQUdLLEtBQUssQ0FBQ2xKLEdBQU4sRUFBZjs7QUFDQXdJLFFBQUFBLG9CQUFvQixDQUFFQyxJQUFGLEVBQVFTLEtBQVIsRUFBZUwsTUFBZixDQUFwQjtBQUNBLE9BSkQ7QUFLQSxLQVRELE1BU087QUFDTkwsTUFBQUEsb0JBQW9CLENBQUVDLElBQUYsRUFBUUMsZUFBUixFQUF5QnRKLEtBQXpCLENBQXBCO0FBQ0E7QUFDRDs7QUFFRCxXQUFTK0osVUFBVCxHQUFzQztBQUFBLFFBQWpCQyxNQUFpQix1RUFBUixLQUFRO0FBQ3JDckssSUFBQUEsQ0FBQyxDQUFDK0IsSUFBRixDQUFReUgsYUFBUixFQUF1QixVQUFVOUYsQ0FBVixFQUFhZ0csSUFBYixFQUFvQjtBQUMxQyxVQUFNdEosT0FBTyxHQUFHc0osSUFBSSxDQUFFLFNBQUYsQ0FBcEI7QUFDQSxVQUFNWSxLQUFLLEdBQUtaLElBQUksQ0FBRSxPQUFGLENBQXBCO0FBRUFPLE1BQUFBLG1CQUFtQixDQUFFUCxJQUFGLEVBQVEsSUFBUixFQUFjLElBQWQsQ0FBbkI7O0FBRUEsVUFBS1csTUFBTCxFQUFjO0FBQ2JwSyxRQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUJvSyxLQUFqQixFQUF3QmxLLE9BQXhCLEVBQWlDLFlBQVc7QUFDM0MsY0FBTStKLEtBQUssR0FBSW5LLENBQUMsQ0FBRSxJQUFGLENBQWhCOztBQUNBLGNBQU04SixNQUFNLEdBQUc5SixDQUFDLENBQUUsSUFBRixDQUFELENBQVVpQixHQUFWLEVBQWY7O0FBQ0FnSixVQUFBQSxtQkFBbUIsQ0FBRVAsSUFBRixFQUFRUyxLQUFSLEVBQWVMLE1BQWYsQ0FBbkI7QUFDQSxTQUpEOztBQU1BLFlBQUssQ0FBRTlKLENBQUMsQ0FBRUMsWUFBRixDQUFELENBQWtCc0MsUUFBbEIsQ0FBNEIsUUFBNUIsQ0FBUCxFQUFnRDtBQUMvQ3ZDLFVBQUFBLENBQUMsQ0FBRUMsWUFBRixDQUFELENBQWtCa0UsUUFBbEIsQ0FBNEIsUUFBNUI7QUFFQWxFLFVBQUFBLFlBQVksQ0FBQ21FLE9BQWIsQ0FBc0IsYUFBdEI7QUFDQTtBQUNEO0FBQ0QsS0FuQkQ7QUFvQkE7O0FBRURnRyxFQUFBQSxVQUFVLENBQUUsSUFBRixDQUFWO0FBRUFuSyxFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUIsYUFBakIsRUFBZ0MsWUFBVztBQUMxQztBQUNBa0ssSUFBQUEsVUFBVTtBQUNWLEdBSEQ7QUFLQSxDQTdjRCIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLWFkbWluLXNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIERpc3BsYXkgdHlwZSBmaWVsZHMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkcXVlcnlUeXBlICAgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXF1ZXJ5X3R5cGUnICk7XG5cdFx0XHRjb25zdCB2YWxpZERpc3BsYXlUeXBlcyA9IFsgJ2xhYmVsJywgJ2NvbG9yJywgJ2ltYWdlJyBdO1xuXG5cdFx0XHRpZiAoIHZhbGlkRGlzcGxheVR5cGVzLmluY2x1ZGVzKCB2YWx1ZSApICkge1xuXHRcdFx0XHRjb25zdCAkbXVsdGlwbGVGaWx0ZXIgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfbXVsdGlwbGVfZmlsdGVyIGlucHV0JyApO1xuXG5cdFx0XHRcdGlmICggJG11bHRpcGxlRmlsdGVyLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRcdFx0JHF1ZXJ5VHlwZS5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHF1ZXJ5VHlwZS5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfbXVsdGlwbGVfZmlsdGVyIGlucHV0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRxdWVyeVR5cGUgICAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtcXVlcnlfdHlwZScgKTtcblx0XHRcdGNvbnN0ICRkaXNwbGF5VHlwZSAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlUeXBlICAgICAgID0gJGRpc3BsYXlUeXBlLnZhbCgpO1xuXHRcdFx0Y29uc3QgdmFsaWREaXNwbGF5VHlwZXMgPSBbICdsYWJlbCcsICdjb2xvcicsICdpbWFnZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZERpc3BsYXlUeXBlcy5pbmNsdWRlcyggZGlzcGxheVR5cGUgKSApIHtcblx0XHRcdFx0aWYgKCAnMScgPT09IHZhbHVlICkge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogRGlzcGxheSB0eXBlIGZpZWxkcy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblxuXHQvLyBIaWVyYXJjaGljYWwgZmllbGQncyB0b2dnbGUgdmlzaWJpbGl0eSB3aGVuIHRleHQgZGlzcGxheSB0eXBlIGlzIGNoYW5nZWQuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJGhyRmllbGRzICAgICAgID0gJGZpZWxkLmZpbmQoICcuaGllcmFyY2hpY2FsLWZpZWxkcycgKTtcblx0XHRcdGNvbnN0ICRoaWVyYXJjaGljYWwgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWhpZXJhcmNoaWNhbCcgKTtcblx0XHRcdGNvbnN0IHVzZUhpZXJhcmNoaWNhbCA9ICRoaWVyYXJjaGljYWwuZmluZCggJ2lucHV0JyApLmlzKCAnOmNoZWNrZWQnICk7XG5cdFx0XHRjb25zdCAkaHJBY2NvcmRpb24gICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfaGllcmFyY2h5X2FjY29yZGlvbicgKTtcblxuXHRcdFx0aWYgKCAnY2hlY2tib3gnID09PSB2YWx1ZSB8fCAncmFkaW8nID09PSB2YWx1ZSApIHtcblx0XHRcdFx0JGhyRmllbGRzLnNob3coKTtcblxuXHRcdFx0XHRpZiAoIHVzZUhpZXJhcmNoaWNhbCApIHtcblx0XHRcdFx0XHQkaHJBY2NvcmRpb24uc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRockFjY29yZGlvbi5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoICdzZWxlY3QnID09PSB2YWx1ZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgKSB7XG5cdFx0XHRcdCRockZpZWxkcy5zaG93KCk7XG5cdFx0XHRcdCRockFjY29yZGlvbi5oaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkaHJGaWVsZHMuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdC8vIEhpZXJhcmNoaWNhbCBhY2NvcmRpb24gZmllbGQgdG9nZ2xlIHZpc2liaWxpdHkgd2hlbiBzaG93IGhpZXJhcmNoeSBpcyBjaGFuZ2VkLlxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1oaWVyYXJjaGljYWwgaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgZGlzcGxheVR5cGUgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgKS52YWwoKTtcblx0XHRcdGNvbnN0ICRockFjY29yZGlvbiA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9oaWVyYXJjaHlfYWNjb3JkaW9uJyApO1xuXG5cdFx0XHRpZiAoICcxJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHRcdGlmICggJ2NoZWNrYm94JyA9PT0gZGlzcGxheVR5cGUgfHwgJ3JhZGlvJyA9PT0gZGlzcGxheVR5cGUgKSB7XG5cdFx0XHRcdFx0JGhyQWNjb3JkaW9uLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkaHJBY2NvcmRpb24uaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkaHJBY2NvcmRpb24uaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdC8vIE92ZXJyaWRlIG5vLXJlc3VsdHMtbWVzc2FnZSwgYWxsLWl0ZW1zLWxhYmVsIGZpZWxkJ3MgdG9nZ2xlIHZpc2liaWxpdHkgd2hlbiB0ZXh0IGRpc3BsYXkgdHlwZSBpcyBjaGFuZ2VkLlxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScgKTtcblx0XHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyApO1xuXHRcdFx0Y29uc3QgdXNlQ2hvc2VuICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0JyApLmlzKCAnOmNoZWNrZWQnICk7XG5cblx0XHRcdGlmICggdXNlQ2hvc2VuICYmICggJ3NlbGVjdCcgPT09IHZhbHVlIHx8ICdtdWx0aS1zZWxlY3QnID09PSB2YWx1ZSApICkge1xuXHRcdFx0XHQkbm9SZXN1bHRzLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICggJ3JhZGlvJyA9PT0gdmFsdWUgfHwgJ3NlbGVjdCcgPT09IHZhbHVlICkgfHwgKCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgJiYgdXNlQ2hvc2VuICkgKSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHQvLyBPdmVycmlkZSBuby1yZXN1bHRzLW1lc3NhZ2UsIGFsbC1pdGVtcy1sYWJlbCBmaWVsZCdzIHRvZ2dsZSB2aXNpYmlsaXR5IHdoZW4gdGV4dCB1c2UgY2hvc2VuIGlzIGNoYW5nZWQuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJG5vUmVzdWx0cyAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VHlwZSAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnICkudmFsKCk7XG5cblx0XHRcdGlmICggJzEnID09PSB2YWx1ZSAmJiAoICdzZWxlY3QnID09PSBkaXNwbGF5VHlwZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKSApIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKFxuXHRcdFx0XHQoICcxJyA9PT0gdmFsdWUgJiYgJ211bHRpLXNlbGVjdCcgPT09IGRpc3BsYXlUeXBlIClcblx0XHRcdFx0fHwgKCAncmFkaW8nID09PSBkaXNwbGF5VHlwZSB8fCAnc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKVxuXHRcdFx0KSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBGaWVsZCBtZXRhIGJveC5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblx0Y29uc3QgZmllbGRJbnB1dCAgID0gJ1tuYW1lXTpub3QoLm1hbnVhbF9vcHRpb25zKSc7XG5cdGNvbnN0IGZpZWxkU3RhdGVzICA9IHt9O1xuXG5cdGZ1bmN0aW9uIHN0b3JlRmllbGRTdGF0ZSgpIHtcblx0XHRjb25zdCBmaWVsZFR5cGUgPSBmaWVsZFdyYXBwZXIuZmluZCggJyNmaWVsZF9kYXRhJyApLmF0dHIoICdkYXRhLWZpZWxkLXR5cGUnICk7XG5cblx0XHRpZiAoICEgZmllbGRUeXBlICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZpZWxkVmFsdWVzID0ge307XG5cblx0XHRmaWVsZFdyYXBwZXIuZmluZCggZmllbGRJbnB1dCApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0Y29uc3QgdHlwZSAgID0gJGlucHV0LmF0dHIoICd0eXBlJyApO1xuXHRcdFx0Y29uc3QgbmFtZSAgID0gJGlucHV0LmF0dHIoICduYW1lJyApO1xuXHRcdFx0Y29uc3QgdmFsdWUgID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRpZiAoICdjaGVja2JveCcgPT09IHR5cGUgfHwgJ3JhZGlvJyA9PT0gdHlwZSApIHtcblx0XHRcdFx0aWYgKCAkaW5wdXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdFx0XHRmaWVsZFZhbHVlc1sgbmFtZSBdID0gdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZpZWxkVmFsdWVzWyBuYW1lIF0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHQvLyBIYW5kbGUgbWFudWFsIG9wdGlvbnMuXG5cdFx0Y29uc3QgbWFudWFsT3B0aW9ucyA9IHt9O1xuXG5cdFx0ZmllbGRXcmFwcGVyLmZpbmQoICcubWFudWFsX29wdGlvbnMnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCBuYW1lICAgPSAkaW5wdXQuYXR0ciggJ25hbWUnICk7XG5cblx0XHRcdG1hbnVhbE9wdGlvbnNbIG5hbWUgXSA9ICRpbnB1dC52YWwoKTtcblx0XHR9ICk7XG5cblx0XHRmaWVsZFZhbHVlc1sgJ21hbnVhbF9vcHRpb25zJyBdID0gbWFudWFsT3B0aW9ucztcblxuXHRcdGZpZWxkU3RhdGVzWyBmaWVsZFR5cGUgXSA9IGZpZWxkVmFsdWVzO1xuXHR9XG5cblx0ZnVuY3Rpb24gdXBkYXRlRmllbGRTdGF0ZSggJGVsbSApIHtcblx0XHRjb25zdCBmaWVsZFR5cGUgID0gZmllbGRXcmFwcGVyLmZpbmQoICcjZmllbGRfZGF0YScgKS5hdHRyKCAnZGF0YS1maWVsZC10eXBlJyApO1xuXHRcdGNvbnN0IGZpZWxkU3RhdGUgPSBmaWVsZFN0YXRlc1sgZmllbGRUeXBlIF07XG5cblx0XHRjb25zdCBuYW1lICA9ICRlbG0uYXR0ciggJ25hbWUnICk7XG5cdFx0Y29uc3QgdHlwZSAgPSAkZWxtLmF0dHIoICd0eXBlJyApO1xuXHRcdGNvbnN0IHZhbHVlID0gJGVsbS52YWwoKTtcblxuXHRcdGlmICggJGVsbS5oYXNDbGFzcyggJ21hbnVhbF9vcHRpb25zJyApICkge1xuXHRcdFx0Y29uc3QgbWFudWFsX29wdGlvbnMgPSBmaWVsZFN0YXRlWyAnbWFudWFsX29wdGlvbnMnIF0gfHwge307XG5cblx0XHRcdG1hbnVhbF9vcHRpb25zWyBuYW1lIF0gPSB2YWx1ZTtcblxuXHRcdFx0ZmllbGRTdGF0ZVsgJ21hbnVhbF9vcHRpb25zJyBdID0gbWFudWFsX29wdGlvbnM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICggJ2NoZWNrYm94JyA9PT0gdHlwZSB8fCAncmFkaW8nID09PSB0eXBlICkge1xuXHRcdFx0XHRjb25zdCAkaW5wdXQgPSBmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lPVwiJyArIG5hbWUgKyAnXCJdJyApO1xuXG5cdFx0XHRcdGlmICggJGlucHV0LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRcdFx0ZmllbGRTdGF0ZVsgbmFtZSBdID0gdmFsdWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZGVsZXRlIGZpZWxkU3RhdGVbIG5hbWUgXTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZmllbGRTdGF0ZVsgbmFtZSBdID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gU3RvcmUgdGhlIGluaXRpYWwgZmllbGQgc3RhdGUuXG5cdHN0b3JlRmllbGRTdGF0ZSgpO1xuXG5cdGZpZWxkV3JhcHBlci5maW5kKCAnW25hbWVdJyApLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHR1cGRhdGVGaWVsZFN0YXRlKCAkdGhpcyApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gYXBwbHlGaWVsZFN0YXRlKCBmaWVsZFR5cGUgKSB7XG5cdFx0Y29uc3QgZmllbGRTdGF0ZSA9IGZpZWxkU3RhdGVzWyBmaWVsZFR5cGUgXTtcblxuXHRcdGZpZWxkV3JhcHBlci5maW5kKCBmaWVsZElucHV0ICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCB0eXBlICAgPSAkaW5wdXQuYXR0ciggJ3R5cGUnICk7XG5cdFx0XHRjb25zdCBuYW1lICAgPSAkaW5wdXQuYXR0ciggJ25hbWUnICk7XG5cdFx0XHRjb25zdCB2YWx1ZSAgPSBmaWVsZFN0YXRlWyBuYW1lIF07XG5cblx0XHRcdGlmICggJ2NoZWNrYm94JyA9PT0gdHlwZSB8fCAncmFkaW8nID09PSB0eXBlICkge1xuXHRcdFx0XHRpZiAoIG5hbWUgaW4gZmllbGRTdGF0ZSApIHtcblx0XHRcdFx0XHQvLyBBZGQgJ2NoZWNrZWQnIGF0dHJpYnV0ZS5cblx0XHRcdFx0XHRmaWVsZFdyYXBwZXJcblx0XHRcdFx0XHRcdC5maW5kKCAnW25hbWU9XCInICsgbmFtZSArICdcIl1bdmFsdWU9XCInICsgdmFsdWUgKyAnXCJdJyApXG5cdFx0XHRcdFx0XHQuYXR0ciggJ2NoZWNrZWQnLCAnY2hlY2tlZCcgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBSZW1vdmUgJ2NoZWNrZWQnIGF0dHJpYnV0ZS5cblx0XHRcdFx0XHRmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lPVwiJyArIG5hbWUgKyAnXCJdJyApLnJlbW92ZUF0dHIoICdjaGVja2VkJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkaW5wdXQudmFsKCB2YWx1ZSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdC8vIFByb2Nlc3MgdGhlIG1hbnVhbCBvcHRpb25zLlxuXHRcdGlmICggJ21hbnVhbF9vcHRpb25zJyBpbiBmaWVsZFN0YXRlICkge1xuXHRcdFx0Y29uc3QgcmF3T3B0aW9ucyA9IGZpZWxkU3RhdGVbICdtYW51YWxfb3B0aW9ucycgXTtcblxuXHRcdFx0JC5lYWNoKCByYXdPcHRpb25zLCBmdW5jdGlvbiggaW5wdXROYW1lLCByYXcgKSB7XG5cdFx0XHRcdGNvbnN0ICRyYXdJbnB1dCA9IGZpZWxkV3JhcHBlci5maW5kKCAnW25hbWU9XCInICsgaW5wdXROYW1lICsgJ1wiXScgKTtcblxuXHRcdFx0XHQkcmF3SW5wdXQudmFsKCByYXcgKTtcblxuXHRcdFx0XHRjb25zdCBtYW51YWxPcHRpb25zID0gSlNPTi5wYXJzZSggZGVjb2RlVVJJQ29tcG9uZW50KCByYXcgKSApO1xuXG5cdFx0XHRcdGlmICggISBtYW51YWxPcHRpb25zLmxlbmd0aCApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCB0YWJsZUlkZW50aWZpZXIgPSAkcmF3SW5wdXQuYXR0ciggJ2RhdGEtdGFibGUnICk7XG5cdFx0XHRcdGNvbnN0IHJvd1RlbXBsYXRlSWQgICA9ICRyYXdJbnB1dC5hdHRyKCAnZGF0YS10bXBsJyApO1xuXG5cdFx0XHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdFx0XHRpZiAoICEgalF1ZXJ5KCAnI3RtcGwtJyArIHJvd1RlbXBsYXRlSWQgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3Qgcm93c0lkZW50aWZpZXIgPSAnLmZpZWxkLXRhYmxlLWJvZHktcm93cyc7XG5cdFx0XHRcdGNvbnN0IHJvd0lkZW50aWZpZXIgID0gJy5yb3ctaXRlbSc7XG5cblx0XHRcdFx0Y29uc3QgJHRhYmxlID0gZmllbGRXcmFwcGVyLmZpbmQoIHRhYmxlSWRlbnRpZmllciApO1xuXHRcdFx0XHRjb25zdCAkcm93cyAgPSAkdGFibGUuZmluZCggcm93c0lkZW50aWZpZXIgKTtcblxuXHRcdFx0XHQkLmVhY2goIG1hbnVhbE9wdGlvbnMsIGZ1bmN0aW9uKCBpLCBvcHRpb24gKSB7XG5cdFx0XHRcdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggcm93VGVtcGxhdGVJZCApO1xuXG5cdFx0XHRcdFx0bGV0IHJvd0RlZmF1bHRPcHRpb25zID0ge307XG5cblx0XHRcdFx0XHRpZiAoICcubWFudWFsLW9wdGlvbnMtdGFibGUnID09PSB0YWJsZUlkZW50aWZpZXIgKSB7XG5cdFx0XHRcdFx0XHRyb3dEZWZhdWx0T3B0aW9ucyA9IHtcblx0XHRcdFx0XHRcdFx0J3ZhbHVlJzogJycsXG5cdFx0XHRcdFx0XHRcdCdsYWJlbCc6ICcnLFxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCByb3dEZWZhdWx0T3B0aW9ucyApO1xuXG5cdFx0XHRcdFx0JHJvd3MuYXBwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0XHRcdFx0Y29uc3QgJGxhc3RSb3cgPSAkcm93cy5maW5kKCByb3dJZGVudGlmaWVyICkubGFzdCgpO1xuXG5cdFx0XHRcdFx0JGxhc3RSb3cuZmluZCggJ1tkYXRhLW5hbWVdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0XHRjb25zdCBuYW1lICA9ICR0aGlzLmF0dHIoICdkYXRhLW5hbWUnICk7XG5cdFx0XHRcdFx0XHRjb25zdCB2YWx1ZSA9IG9wdGlvblsgbmFtZSBdO1xuXG5cdFx0XHRcdFx0XHQkdGhpcy52YWwoIHZhbHVlICk7XG5cblx0XHRcdFx0XHRcdGlmICggJ2ltYWdlX3VybCcgPT09IG5hbWUgJiYgdmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRcdCRsYXN0Um93LmZpbmQoICcud3AtaW1hZ2UtcGlja2VyLWNvbnRhaW5lcicgKS5hZGRDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHRcdFx0XHRcdFx0JGxhc3RSb3cuZmluZCggJ2ltZycgKS5hdHRyKCAnc3JjJywgdmFsdWUgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkdGFibGUuYWRkQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Y29uc3QgJGZpZWxkID0gZmllbGRXcmFwcGVyLmZpbmQoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdFx0ZmllbGRXcmFwcGVyLnRyaWdnZXIoICduZXdfb3B0aW9uX2FkZGVkJywgWyAkZmllbGQgXSApO1xuXHRcdH1cblx0fVxuXG5cdCQoICcjYXZhaWxhYmxlX2ZpZWxkcycgKS5vbiggJ2NoYW5nZScsICdbbmFtZT1cIl9hY3RpdmVfZmllbGRcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IF9maWVsZFR5cGUgPSAkdGhpcy52YWwoKTtcblx0XHRjb25zdCBmaWVsZE5hbWUgID0gJHRoaXMuYXR0ciggJ2RhdGEtZmllbGQtbmFtZScgKTtcblxuXHRcdGlmICggISBfZmllbGRUeXBlICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1mb3JtLWZpZWxkLScgKyBfZmllbGRUeXBlO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgdGVtcGxhdGUgICAgICAgICA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRjb25zdCByZW5kZXJlZCAgICAgICAgID0gdGVtcGxhdGUoKTtcblx0XHRjb25zdCBmaWVsZERhdGFXcmFwcGVyID0gZmllbGRXcmFwcGVyLmZpbmQoICcjZmllbGRfZGF0YScgKTtcblx0XHRjb25zdCBmaWVsZE5hbWVXcmFwcGVyID0gZmllbGRXcmFwcGVyLmZpbmQoICcucG9zdGJveC1oZWFkZXIgaDInICk7XG5cdFx0Y29uc3QgZmllbGRJbnNpZGUgICAgICA9IGZpZWxkV3JhcHBlci5maW5kKCAnLmluc2lkZScgKTtcblxuXHRcdGZpZWxkV3JhcHBlci5yZW1vdmVDbGFzcyggJ2hpZGRlbicgKTtcblxuXHRcdGZpZWxkRGF0YVdyYXBwZXIuYXR0ciggJ2RhdGEtZmllbGQtdHlwZScsIF9maWVsZFR5cGUgKTtcblx0XHRmaWVsZE5hbWVXcmFwcGVyLmh0bWwoIGZpZWxkTmFtZSApO1xuXHRcdGZpZWxkSW5zaWRlLmh0bWwoIHJlbmRlcmVkICk7XG5cblx0XHQvLyBJZiBhbHJlYWR5IGZvdW5kIHRoZSBmaWVsZCBzdGF0ZSB0aGVuIGFwcGx5IGl0LCBvdGhlcndpc2Ugc3RvcmUgaXQuXG5cdFx0aWYgKCBfZmllbGRUeXBlIGluIGZpZWxkU3RhdGVzICkge1xuXHRcdFx0YXBwbHlGaWVsZFN0YXRlKCBfZmllbGRUeXBlICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0b3JlRmllbGRTdGF0ZSgpO1xuXHRcdH1cblxuXHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnZmllbGRfYWRkZWQnICk7XG5cblx0XHRmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lXScgKS5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHVwZGF0ZUZpZWxkU3RhdGUoICR0aGlzICk7XG5cdFx0fSApO1xuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogTWFudWFsIE9wdGlvbnMnIHRhYmxlIGZ1bmN0aW9uLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxuLyoqXG4gKiBAcGFyYW0gdGFibGVJZGVudGlmaWVyXG4gKiBAcGFyYW0gdmFsdWVJZGVudGlmaWVyXG4gKiBAcGFyYW0gcm93VGVtcGxhdGVJZFxuICogQHBhcmFtIHJvd0RlZmF1bHRPcHRpb25zXG4gKi9cbmZ1bmN0aW9uIGluaXRNYW51YWxPcHRpb25zVGFibGUoIHRhYmxlSWRlbnRpZmllciwgdmFsdWVJZGVudGlmaWVyLCByb3dUZW1wbGF0ZUlkLCByb3dEZWZhdWx0T3B0aW9ucyA9IHt9ICkge1xuXHRjb25zdCAkID0galF1ZXJ5O1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0Y29uc3QgZmllbGRJZGVudGlmaWVyID0gJy53Y2FwZi1mb3JtLWZpZWxkJztcblx0Y29uc3Qgcm93c0lkZW50aWZpZXIgID0gJy5maWVsZC10YWJsZS1ib2R5LXJvd3MnO1xuXHRjb25zdCByb3dJZGVudGlmaWVyICAgPSAnLnJvdy1pdGVtJztcblxuXHRmdW5jdGlvbiBpbml0U29ydGFibGVUYWJsZSggJHNlbGVjdG9yICkge1xuXHRcdCRzZWxlY3Rvci5zb3J0YWJsZSgge1xuXHRcdFx0b3BhY2l0eTogMC44LFxuXHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdGN1cnNvcjogJ21vdmUnLFxuXHRcdFx0YXhpczogJ3knLFxuXHRcdFx0aGFuZGxlOiAnLm1vdmUtb3B0aW9ucy1oYW5kbGVyJyxcblx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdHVwZGF0ZTogZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCA9ICQoIGUudGFyZ2V0ICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0XHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0XHRcdH1cblx0XHR9ICkuZGlzYWJsZVNlbGVjdGlvbigpO1xuXHR9XG5cblx0Y29uc3QgdGFibGVSb3dzSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgJyArIHJvd3NJZGVudGlmaWVyO1xuXG5cdC8vIEluaXQgdGhlIHNvcnRhYmxlIHRhYmxlIGFmdGVyIHBhZ2UgbG9hZHMuXG5cdGluaXRTb3J0YWJsZVRhYmxlKCBmaWVsZFdyYXBwZXIuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApICk7XG5cblx0Ly8gSW5pdCB0aGUgc29ydGFibGUgdGFibGUgYWZ0ZXIgdGhlIGZpZWxkIGlzIGFkZGVkLlxuXHRmaWVsZFdyYXBwZXIub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdGluaXRTb3J0YWJsZVRhYmxlKCAkKCBmaWVsZFdyYXBwZXIuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApICkgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJHZhbHVlSG9sZGVyID0gJGZpZWxkLmZpbmQoIHZhbHVlSWRlbnRpZmllciApO1xuXHRcdGNvbnN0ICRyb3dzICAgICAgICA9ICRmaWVsZC5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgX3Jvd3MgICAgICAgID0gW107XG5cblx0XHQkcm93cy5maW5kKCAnLnJvdy1pdGVtJyApLmVhY2goIGZ1bmN0aW9uKCBpLCBfaXRlbSApIHtcblx0XHRcdGNvbnN0ICRpdGVtID0gJCggX2l0ZW0gKTtcblx0XHRcdGNvbnN0IG9iaiAgID0ge307XG5cblx0XHRcdCRpdGVtLmZpbmQoICdbZGF0YS1uYW1lXScgKS5lYWNoKCBmdW5jdGlvbiggZmllbGRJbmRleCwgZmllbGQgKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCA9ICQoIGZpZWxkICk7XG5cdFx0XHRcdGNvbnN0IG5hbWUgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1uYW1lJyApO1xuXG5cdFx0XHRcdG9ialsgbmFtZSBdID0gJGZpZWxkLnZhbCgpO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRfcm93cy5wdXNoKCBvYmogKTtcblx0XHR9ICk7XG5cblx0XHRjb25zdCByYXdWYWx1ZXMgPSBlbmNvZGVVUklDb21wb25lbnQoIEpTT04uc3RyaW5naWZ5KCBfcm93cyApICk7XG5cdFx0JHZhbHVlSG9sZGVyLnZhbCggcmF3VmFsdWVzICkudHJpZ2dlciggJ2NoYW5nZScgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApIHtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoIHRhYmxlSWRlbnRpZmllciApO1xuXHRcdGNvbnN0IHRhYmxlUm93cyAgICAgPSAkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApLmNoaWxkcmVuKCk7XG5cblx0XHRpZiAoIDIgPiB0YWJsZVJvd3MubGVuZ3RoICkge1xuXHRcdFx0JG9wdGlvbnNUYWJsZS5yZW1vdmVDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJlbW92ZSBPcHRpb25cblx0Y29uc3QgcmVtb3ZlQnRuSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgLnJlbW92ZS1vcHRpb24nO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2NsaWNrJywgcmVtb3ZlQnRuSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGl0ZW0gID0gJCggdGhpcyApLmNsb3Nlc3QoIHJvd0lkZW50aWZpZXIgKTtcblx0XHRjb25zdCAkZmllbGQgPSAkaXRlbS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApO1xuXG5cdFx0JGl0ZW0ucmVtb3ZlKCk7XG5cblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBDbGVhciBBbGwgT3B0aW9uc1xuXHRjb25zdCBjbGVhck9wdGlvbnNCdG5JZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAuY2xlYXItb3B0aW9ucyc7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnY2xpY2snLCBjbGVhck9wdGlvbnNCdG5JZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHQkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApLmVtcHR5KCk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKTtcblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBBZGQgTmV3IE9wdGlvblxuXHRjb25zdCBhZGRPcHRpb25CdG5JZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAuYWRkLW9wdGlvbic7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnY2xpY2snLCBhZGRPcHRpb25CdG5JZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHQvLyBCYWlsIG91dCBpZiBubyB0bXBsIGZvdW5kIGZvciB0aGUgdHlwZS5cblx0XHRpZiAoICEgalF1ZXJ5KCAnI3RtcGwtJyArIHJvd1RlbXBsYXRlSWQgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggcm93VGVtcGxhdGVJZCApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHJvd0RlZmF1bHRPcHRpb25zICk7XG5cdFx0Y29uc3QgJHRhYmxlICAgPSAkZmllbGQuZmluZCggdGFibGVJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgPSAkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApO1xuXG5cdFx0JHJvd3MuYXBwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXG5cdFx0ZmllbGRXcmFwcGVyLnRyaWdnZXIoICduZXdfb3B0aW9uX2FkZGVkJywgWyAkZmllbGQgXSApO1xuXG5cdFx0aWYgKCAhICR0YWJsZS5oYXNDbGFzcyggJ2hhcy1vcHRpb25zJyApICkge1xuXHRcdFx0JHRhYmxlLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gVHJpZ2dlciBvcHRpb25zIGNoYW5nZSB3aGVuIHRoZSB0ZXh0IGZpZWxkcyBnZXQgY2hhbmdlZC5cblx0Y29uc3QgdGV4dEZpZWxkc0lkZW50aWZpZXIgPSB0YWJsZVJvd3NJZGVudGlmaWVyICsgJyBpbnB1dFt0eXBlPVwidGV4dFwiXSc7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnaW5wdXQnLCB0ZXh0RmllbGRzSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gVHJpZ2dlciBvcHRpb25zIGNoYW5nZSB3aGVuIHRoZSBzZWxlY3QgZmllbGRzIGdldCBjaGFuZ2VkLlxuXHRsZXQgc2VsZWN0RmllbGRzSWRlbnRpZmllciA9IHRhYmxlUm93c0lkZW50aWZpZXIgKyAnIHNlbGVjdCc7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnY2hhbmdlJywgc2VsZWN0RmllbGRzSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gVHJpZ2dlciBvcHRpb25zIGNoYW5nZSB3aGVuIHZhbHVlIGlzIGFkZGVkIGZyb20gbW9kYWwuXG5cdGZpZWxkV3JhcHBlci5vbiggJ3RyaWdnZXJfb3B0aW9uc190YWJsZScsIGZ1bmN0aW9uKCBlLCB0YWJsZUlkLCAkZmllbGQgKSB7XG5cdFx0aWYgKCB0YWJsZUlkID09PSB0YWJsZUlkZW50aWZpZXIgKSB7XG5cdFx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdFx0fVxuXHR9ICk7XG5cbn1cbiIsIi8qKlxuICogVGhlIG51bWJlciB1aSBvcHRpb25zLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdC8qKlxuXHQgKiBUb2dnbGUgZGlzYWJsZWQgYXR0cmlidXRlIG9mIG1pbi12YWx1ZSBmaWVsZCBmb3IgbnVtYmVyIHR5cGUuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkKCAkZWxtICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkdGV4dEZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXG5cdFx0aWYgKCAkZWxtLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHQkdGV4dEZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHRleHRGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHRmaWVsZFdyYXBwZXIuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fSApO1xuXHR9ICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKFxuXHRcdCdjbGljaycsXG5cdFx0Jy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0XHR0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHRcdH1cblx0KTtcblxuXHQvKipcblx0ICogVG9nZ2xlIGRpc2FibGVkIGF0dHJpYnV0ZSBvZiBtYXgtdmFsdWUgZmllbGQgZm9yIG51bWJlciB0eXBlLlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCggJGVsbSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgID0gJGVsbS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJHRleHRGaWVsZCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZSBpbnB1dFt0eXBlPVwidGV4dFwiXScgKTtcblxuXHRcdGlmICggJGVsbS5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0JHRleHRGaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCR0ZXh0RmllbGQucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdH1cblx0fVxuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0ZmllbGRXcmFwcGVyLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0XHR0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHRcdH0gKTtcblx0fSApO1xuXG5cdGZpZWxkV3JhcHBlci5vbihcblx0XHQnY2xpY2snLFxuXHRcdCcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0dG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCggJHRoaXMgKTtcblx0XHR9XG5cdCk7XG5cbn0gKTtcbiIsIi8qKlxuICogUGx1Z2luIHNldHRpbmdzIGZvcm0uXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGlmICggISAkKCAnYm9keScgKS5oYXNDbGFzcyggJ3djYXBmLWZpbHRlcl9wYWdlX3djYXBmLXNldHRpbmdzJyApICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIE1lZGlhIHVwbG9hZGVyLlxuXHQkKCAnLnVwbG9hZC1pbWFnZS1idXR0b24nICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRidXR0b24gICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgJHdyYXBwZXIgICA9ICRidXR0b24uY2xvc2VzdCggJy5tZWRpYS11cGxvYWQnICk7XG5cdFx0Y29uc3QgbW9kYWxUaXRsZSA9ICRidXR0b24uYXR0ciggJ2RhdGEtbW9kYWwtdGl0bGUnICk7XG5cblx0XHRjb25zdCBpbWFnZSA9IHdwLm1lZGlhKCB7IHRpdGxlOiBtb2RhbFRpdGxlLCBtdWx0aXBsZTogZmFsc2UgfSApXG5cdFx0XHQub3BlbigpXG5cdFx0XHQub24oICdzZWxlY3QnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgdXBsb2FkZWRJbWFnZSA9IGltYWdlLnN0YXRlKCkuZ2V0KCAnc2VsZWN0aW9uJyApLmZpcnN0KCk7XG5cdFx0XHRcdGNvbnN0IGltYWdlRGF0YSAgICAgPSB1cGxvYWRlZEltYWdlLnRvSlNPTigpO1xuXG5cdFx0XHRcdGNvbnN0IHsgdGh1bWJuYWlsIH0gPSBpbWFnZURhdGEuc2l6ZXM7XG5cdFx0XHRcdGxldCBpbWFnZVVybDtcblxuXHRcdFx0XHRpZiAoIHRodW1ibmFpbCApIHtcblx0XHRcdFx0XHRpbWFnZVVybCA9IGltYWdlRGF0YS5zaXplcy50aHVtYm5haWwudXJsO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGltYWdlVXJsID0gaW1hZ2VEYXRhLnVybDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCR3cmFwcGVyLmZpbmQoICcuaW1hZ2UtaWQnICkudmFsKCBpbWFnZURhdGEuaWQgKTtcblx0XHRcdFx0JHdyYXBwZXIuZmluZCggJy5pbWFnZS1zcmMnICkuYXR0ciggJ3NyYycsIGltYWdlVXJsICk7XG5cdFx0XHRcdCR3cmFwcGVyLnJlbW92ZUNsYXNzKCAnbm8taW1hZ2UnICk7XG5cdFx0XHR9ICk7XG5cdH0gKTtcblxuXHQkKCAnLnJlbW92ZS1pbWFnZS1idXR0b24nICkub24oICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRidXR0b24gID0gJCggdGhpcyApO1xuXHRcdGNvbnN0ICR3cmFwcGVyID0gJGJ1dHRvbi5jbG9zZXN0KCAnLm1lZGlhLXVwbG9hZCcgKTtcblxuXHRcdCR3cmFwcGVyLmZpbmQoICcuaW1hZ2UtaWQnICkudmFsKCAnJyApO1xuXHRcdCR3cmFwcGVyLmZpbmQoICcuaW1hZ2Utc3JjJyApLmF0dHIoICdzcmMnLCAnJyApO1xuXHRcdCR3cmFwcGVyLmFkZENsYXNzKCAnbm8taW1hZ2UnICk7XG5cdH0gKTtcblxuXHQvLyBUb2dnbGUgbG9hZGluZyBpbWFnZSBmaWVsZC5cblx0ZnVuY3Rpb24gdG9nZ2xlTG9hZGluZ0ltYWdlKCB2YWx1ZSApIHtcblx0XHRjb25zdCAkc2VsZWN0b3IgPSAkKCAnLnNldHRpbmdzLXRhYmxlLWxvYWRpbmdfaW1hZ2UnICk7XG5cblx0XHRpZiAoIHZhbHVlICkge1xuXHRcdFx0JHNlbGVjdG9yLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHNlbGVjdG9yLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRjb25zdCAkZW5hYmxlTG9hZGluZ092ZXJsYXkgPSAkKCAnI2xvYWRpbmdfYW5pbWF0aW9uJyApO1xuXG5cdGxldCBlbmFibGVMb2FkaW5nT3ZlcmxheSA9IGZhbHNlO1xuXG5cdGlmICggJGVuYWJsZUxvYWRpbmdPdmVybGF5LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0ZW5hYmxlTG9hZGluZ092ZXJsYXkgPSB0cnVlO1xuXHR9XG5cblx0dG9nZ2xlTG9hZGluZ0ltYWdlKCBlbmFibGVMb2FkaW5nT3ZlcmxheSApO1xuXG5cdCRlbmFibGVMb2FkaW5nT3ZlcmxheS5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdGxldCBfZW5hYmxlTG9hZGluZ092ZXJsYXkgPSBmYWxzZTtcblxuXHRcdGlmICggJCggdGhpcyApLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRfZW5hYmxlTG9hZGluZ092ZXJsYXkgPSB0cnVlO1xuXHRcdH1cblxuXHRcdHRvZ2dsZUxvYWRpbmdJbWFnZSggX2VuYWJsZUxvYWRpbmdPdmVybGF5ICk7XG5cdH0gKTtcblxuXHQvLyBUb2dnbGUgcGFnaW5hdGlvbiBmaWVsZHMuXG5cdGZ1bmN0aW9uIGVuYWJsZVBhZ2luYXRpb24oIHZhbHVlICkge1xuXHRcdGNvbnN0ICRzZWxlY3RvciA9ICQoICcuc2V0dGluZ3MtdGFibGUtcGFnaW5hdGlvbl9jb250YWluZXInICk7XG5cblx0XHRpZiAoIHZhbHVlICkge1xuXHRcdFx0JHNlbGVjdG9yLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHNlbGVjdG9yLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRjb25zdCAkZW5hYmxlUGFnaW5hdGlvbiA9ICQoICcjZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXgnICk7XG5cblx0bGV0IGVuYWJsZVBhZ2luYXRpb25PbkxvYWQgPSBmYWxzZTtcblxuXHRpZiAoICRlbmFibGVQYWdpbmF0aW9uLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0ZW5hYmxlUGFnaW5hdGlvbk9uTG9hZCA9IHRydWU7XG5cdH1cblxuXHRlbmFibGVQYWdpbmF0aW9uKCBlbmFibGVQYWdpbmF0aW9uT25Mb2FkICk7XG5cblx0JGVuYWJsZVBhZ2luYXRpb24ub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRsZXQgX2VuYWJsZVBhZ2luYXRpb24gPSBmYWxzZTtcblxuXHRcdGlmICggJCggdGhpcyApLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRfZW5hYmxlUGFnaW5hdGlvbiA9IHRydWU7XG5cdFx0fVxuXG5cdFx0ZW5hYmxlUGFnaW5hdGlvbiggX2VuYWJsZVBhZ2luYXRpb24gKTtcblx0fSApO1xuXG5cdC8vIFRvZ2dsZSBzY3JvbGwgd2luZG93IGZpZWxkcy5cblx0ZnVuY3Rpb24gc2Nyb2xsV2luZG93KCB2YWx1ZSApIHtcblx0XHRjb25zdCBkZXBlbmRlbnRGaWVsZHMgPSAnLnNjcm9sbC13aW5kb3ctZGVwZW5kZW50LWZpZWxkcywnICtcblx0XHRcdCcuc2Nyb2xsLXdpbmRvdy1jdXN0b20tZWxlbWVudC1pbnB1dCwnICtcblx0XHRcdCcuc2V0dGluZ3MtdGFibGUtc2Nyb2xsX3RvX3RvcF9vZmZzZXQnO1xuXG5cdFx0aWYgKCAnbm9uZScgPT09IHZhbHVlICkge1xuXHRcdFx0JCggZGVwZW5kZW50RmllbGRzICkuaGlkZSgpO1xuXHRcdH0gZWxzZSBpZiAoICdyZXN1bHRzJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHQkKCAnLnNjcm9sbC13aW5kb3ctZGVwZW5kZW50LWZpZWxkcywgLnNldHRpbmdzLXRhYmxlLXNjcm9sbF90b190b3Bfb2Zmc2V0JyApLnNob3coKTtcblx0XHRcdCQoICcuc2Nyb2xsLXdpbmRvdy1jdXN0b20tZWxlbWVudC1pbnB1dCcgKS5oaWRlKCk7XG5cdFx0fSBlbHNlIGlmICggJ2N1c3RvbScgPT09IHZhbHVlICkge1xuXHRcdFx0JCggJy5zY3JvbGwtd2luZG93LWRlcGVuZGVudC1maWVsZHMsIC5zZXR0aW5ncy10YWJsZS1zY3JvbGxfdG9fdG9wX29mZnNldCcgKS5zaG93KCk7XG5cdFx0XHQkKCAnLnNjcm9sbC13aW5kb3ctY3VzdG9tLWVsZW1lbnQtaW5wdXQnICkuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkKCBkZXBlbmRlbnRGaWVsZHMgKS5zaG93KCk7XG5cdFx0fVxuXHR9XG5cblx0Y29uc3QgJHNjcm9sbFdpbmRvdyA9ICQoICcjc2Nyb2xsX3dpbmRvdycgKTtcblxuXHRzY3JvbGxXaW5kb3coICRzY3JvbGxXaW5kb3cudmFsKCkgKTtcblxuXHQkc2Nyb2xsV2luZG93Lm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgdmFsdWUgPSAkKCB0aGlzICkudmFsKCk7XG5cblx0XHRzY3JvbGxXaW5kb3coIHZhbHVlICk7XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBUaGUgcHJvZHVjdCBzdGF0dXMgZmllbGQuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXG5cdGNvbnN0IHRhYmxlSWRlbnRpZmllciA9ICcucHJvZHVjdC1zdGF0dXMtb3B0aW9ucy10YWJsZSc7XG5cdGNvbnN0IHZhbHVlSWRlbnRpZmllciA9ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcHJvZHVjdF9zdGF0dXNfb3B0aW9ucyBpbnB1dCc7XG5cdGNvbnN0IHJvd1RlbXBsYXRlSWQgICA9ICd3Y2FwZi1wcm9kdWN0LXN0YXR1cy1vcHRpb24nO1xuXG5cdGluaXRNYW51YWxPcHRpb25zVGFibGUoIHRhYmxlSWRlbnRpZmllciwgdmFsdWVJZGVudGlmaWVyLCByb3dUZW1wbGF0ZUlkICk7XG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIHRvZ2dsZSB2aXNpYmlsaXR5IHNjcmlwdHMuXG4gKlxuICogTk9URTogVGhlc2Ugc2NyaXB0cyBtdXN0IGJlIGxvY2F0ZWQgYXQgdGhlIHZlcnkgYm90dG9tIG9mIHRoZSBjb21iaW5lZCBzY3JpcHRzLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdGNvbnN0IGRlcGVuZGFudERhdGEgPSBbXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXZhbHVlX3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5pbnB1dC10eXBlLXRleHQtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0ZXh0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5pbnB1dC10eXBlLW51bWJlci1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ251bWJlcicgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS1kYXRlLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnZGF0ZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcudmFsdWUtZGVjaW1hbC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ251bWJlcicgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcXVlcnlfdHlwZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY2hlY2tib3gnLCAnbXVsdGktc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhZGlvJywgJ3NlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnc2VsZWN0JywgJ211bHRpLXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2NhdGVnb3J5X2ltYWdlcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW1hZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9tdWx0aXBsZV9maWx0ZXInLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2xhYmVsJywgJ2NvbG9yJywgJ2ltYWdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5jb2x1bW4tZ3JvdXAtY3VzdG9tX2FwcGVhcmFuY2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NvbG9yJywgJ2ltYWdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWhpZXJhcmNoaWNhbCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfZGVjaW1hbCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV9kZWNpbWFsX3BsYWNlcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZ2V0X29wdGlvbnMgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuY29sdW1uLWdyb3VwLW1ldGFfa2V5X21hbnVhbF9vcHRpb25zJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdtYW51YWxfZW50cnknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2xpZGVyX2Rpc3BsYXlfdmFsdWVzX2FzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsaWduX3ZhbHVlc19hdF90aGVfZW5kJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NlbGVjdF9hbGxfaXRlbXNfbGFiZWwnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3VzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXInLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2hvd19jb3VudCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JywgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfaGlkZV9lbXB0eScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JywgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItZGVjaW1hbC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NsaWRlcicsICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnLCAncmFuZ2VfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZ2V0X29wdGlvbnMgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLWF1dG9tYXRpYy1vcHRpb25zJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdhdXRvbWF0aWNhbGx5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItbWFudWFsLW9wdGlvbnMtdGFibGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ21hbnVhbF9lbnRyeScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGF0ZV9kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5kYXRlLXRvLXVpLW9wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2lucHV0X2RhdGVfcmFuZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRhdGVfZm9ybWF0Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbnB1dF9kYXRlJywgJ2lucHV0X2RhdGVfcmFuZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNob3dfZGF0ZV9pbnB1dHNfaW5saW5lJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbnB1dF9kYXRlX3JhbmdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5kYXRlLXBpY2tlci1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2lucHV0X2RhdGUnLCAnaW5wdXRfZGF0ZV9yYW5nZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfcXVlcnlfdHlwZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfY2hlY2tib3gnLCAndGltZV9wZXJpb2RfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3NlbGVjdF9hbGxfaXRlbXNfbGFiZWwnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX3JhZGlvJywgJ3RpbWVfcGVyaW9kX3NlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfdXNlX2Nob3NlbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2Rfc2VsZWN0JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9lbmFibGVfbXVsdGlwbGVfZmlsdGVyJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2Rfc2hvd19jb3VudCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfY2hlY2tib3gnLCAndGltZV9wZXJpb2RfcmFkaW8nLCAndGltZV9wZXJpb2Rfc2VsZWN0JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JywgJ3RpbWVfcGVyaW9kX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9oaWRlX2VtcHR5Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9jaGVja2JveCcsICd0aW1lX3BlcmlvZF9yYWRpbycsICd0aW1lX3BlcmlvZF9zZWxlY3QnLCAndGltZV9wZXJpb2RfbXVsdGlzZWxlY3QnLCAndGltZV9wZXJpb2RfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3VzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX3NvZnRfbGltaXQgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtc29mdF9saW1pdCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGF4b25vbXkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtY3VzdG9tLXRheG9ub215IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1ldGFfa2V5IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBvc3RfcHJvcGVydHkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfb3B0aW9ucyBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBhcmVudF90ZXJtJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjaGlsZCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfdmFsdWVzX2J5X2lkJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbmNsdWRlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1leGNsdWRlX3ZhbHVlc19pZCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnZXhjbHVkZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX2FjY29yZGlvbiBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hY2NvcmRpb25fZGVmYXVsdF9zdGF0ZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2NhdGVnb3J5X2ltYWdlcyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9jbGVhcl9hbGxfYnV0dG9uIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmNsZWFyLWFsbC1idXR0b24tZmllbGRzLXN0YXJ0Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1zaG93X2lmX2VtcHR5IGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVtcHR5X2ZpbHRlcl9tZXNzYWdlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1zaG93X3RpdGxlIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1vdmVfY2xlYXJfYWxsX2J1dHRvbl9pbl90aXRsZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtb3JkZXJfdGVybXNfYnkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWN0aXZlX2ZpbHRlcnNfbGF5b3V0IGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLnNpbXBsZS1sYXlvdXQtc29mdC1maWVsZHMtc3RhcnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3NpbXBsZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuZXh0ZW5kZWQtbGF5b3V0LXNvZnQtZmllbGRzLXN0YXJ0Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdleHRlbmRlZCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX3NvZnRfbGltaXRfZm9yX2V4dGVuZGVkX2xheW91dCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1zb2Z0X2xpbWl0X2Zvcl9leHRlbmRlZF9sYXlvdXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV90b29sdGlwIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNob3dfY291bnRfaW5fdG9vbHRpcCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdG9vbHRpcF9wb3NpdGlvbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XTtcblxuXHRmdW5jdGlvbiBfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgICA9IGN1cnJlbnRTZWxlY3Rvci5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgaGFuZGxlciAgICAgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRjb25zdCBoYW5kbGVyVHlwZSA9IGRhdGFbICdoYW5kbGVyVHlwZScgXTtcblx0XHRjb25zdCBkZXBlbmRhbnQgICA9IGRhdGFbICdkZXBlbmRhbnQnIF07XG5cblx0XHRsZXQgX3ZhbHVlID0gdmFsdWU7XG5cblx0XHRpZiAoICdjaGVja2JveCcgPT09IGhhbmRsZXJUeXBlICkge1xuXHRcdFx0X3ZhbHVlID0gY3VycmVudFNlbGVjdG9yLmlzKCAnOmNoZWNrZWQnICkgPyAnMScgOiAnMCc7XG5cdFx0fVxuXG5cdFx0aWYgKCAncmFkaW8nID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9ICRmaWVsZC5maW5kKCBoYW5kbGVyICsgJzpjaGVja2VkJyApLnZhbCgpO1xuXHRcdH1cblxuXHRcdCQuZWFjaCggZGVwZW5kYW50LCBmdW5jdGlvbiggaWQsIGQgKSB7XG5cdFx0XHRjb25zdCAkc2VsZWN0b3IgICA9ICRmaWVsZC5maW5kKCBkWyAnc2VsZWN0b3InIF0gKTtcblx0XHRcdGNvbnN0IHZhbGlkVmFsdWVzID0gZFsgJ3ZhbHVlJyBdO1xuXG5cdFx0XHRpZiAoIHZhbGlkVmFsdWVzLmluY2x1ZGVzKCBfdmFsdWUgKSApIHtcblx0XHRcdFx0JHNlbGVjdG9yLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0ZmllbGRXcmFwcGVyLnRyaWdnZXIoICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIFsgaGFuZGxlciwgX3ZhbHVlLCAkZmllbGQgXSApO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApIHtcblx0XHRpZiAoIG51bGwgPT09IGN1cnJlbnRTZWxlY3RvciApIHtcblx0XHRcdGNvbnN0IGhhbmRsZXIgID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0XHRjb25zdCAkaGFuZGxlciA9ICQoIGhhbmRsZXIgKTtcblxuXHRcdFx0JC5lYWNoKCAkaGFuZGxlciwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0IF90aGlzICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgX3ZhbHVlID0gX3RoaXMudmFsKCk7XG5cdFx0XHRcdF9oYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBfdGhpcywgX3ZhbHVlICk7XG5cdFx0XHR9ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdF9oYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBjdXJyZW50U2VsZWN0b3IsIHZhbHVlICk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2V0dXBGaWVsZCggaW5pdGFsID0gZmFsc2UgKSB7XG5cdFx0JC5lYWNoKCBkZXBlbmRhbnREYXRhLCBmdW5jdGlvbiggaSwgZGF0YSApIHtcblx0XHRcdGNvbnN0IGhhbmRsZXIgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRcdGNvbnN0IGV2ZW50ICAgPSBkYXRhWyAnZXZlbnQnIF07XG5cblx0XHRcdGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIG51bGwsIG51bGwgKTtcblxuXHRcdFx0aWYgKCBpbml0YWwgKSB7XG5cdFx0XHRcdGZpZWxkV3JhcHBlci5vbiggZXZlbnQsIGhhbmRsZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0IF90aGlzICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRjb25zdCBfdmFsdWUgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdFx0aGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgX3RoaXMsIF92YWx1ZSApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0aWYgKCAhICQoIGZpZWxkV3JhcHBlciApLmhhc0NsYXNzKCAnbG9hZGVkJyApICkge1xuXHRcdFx0XHRcdCQoIGZpZWxkV3JhcHBlciApLmFkZENsYXNzKCAnbG9hZGVkJyApO1xuXG5cdFx0XHRcdFx0ZmllbGRXcmFwcGVyLnRyaWdnZXIoICdmaWVsZF9hZGRlZCcgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdHNldHVwRmllbGQoIHRydWUgKTtcblxuXHRmaWVsZFdyYXBwZXIub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdC8vIFRvZ2dsZSB0aGUgdmlzaWJpbGl0eSBvZiBzdWJmaWVsZHMuXG5cdFx0c2V0dXBGaWVsZCgpO1xuXHR9ICk7XG5cbn0gKTtcbiJdfQ==
