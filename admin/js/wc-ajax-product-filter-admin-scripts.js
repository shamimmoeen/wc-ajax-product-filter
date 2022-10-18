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
 * Filter form meta box.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     wptools.io
 */
jQuery(document).ready(function ($) {
  var formData = $('#form_data');
  var $dropdown = $('#available-filters-dropdown');
  var $addFilterBtn = $('#add-filter-to-form-btn');
  $dropdown.on('change', function () {
    var $this = $(this);
    var value = $this.val();

    if (value) {
      $addFilterBtn.removeAttr('disabled');
    } else {
      $addFilterBtn.attr('disabled', 'disabled');
    }
  });
  /**
   * Add filter to form.
   */

  $addFilterBtn.on('click', function () {
    var $selected = $dropdown.find('option:selected');
    var filterId = $selected.val();

    if (!filterId.length) {
      return;
    }

    var filterTitle = $selected.attr('data-title');
    var filterKey = $selected.attr('data-filter-key');
    var editLink = $selected.attr('data-edit-link');
    var template = wp.template('wcapf-filter-form-item');
    var rendered = template({
      title: filterTitle,
      id: filterId,
      key: filterKey,
      edit_link: editLink
    });
    formData.find('#filter-form-items').prepend(rendered);
    $dropdown.prop('selectedIndex', 0);
    $dropdown.find('option[value="' + filterId + '"]').attr('disabled', 'disabled');
    $dropdown.trigger('change');
  });
  /**
   * Make the filters sortable.
   */

  function sortable(identifier) {
    var container = $(identifier);
    container.sortable({
      opacity: 0.8,
      revert: false,
      cursor: 'move',
      axis: 'y',
      handle: '.widget-top',
      cancel: '.widget-title-action',
      items: '.widget',
      placeholder: 'widget-placeholder'
    });
  }

  sortable('#form_data');
  /**
   * Remove the field.
   */

  function removeField() {
    var widget = $(this).closest('.widget');
    var filterId = widget.find('.filter-id').val();
    $(widget).slideUp('fast', function () {
      $dropdown.find('option[value="' + filterId + '"]').removeAttr('disabled');
      widget.remove();
    });
  }

  formData.on('click', '.widget-control-remove', removeField);
  /**
   * Toggle accordion default state.
   */

  $('#enable_accordion').on('change', function () {
    var $fields = $('.accordion-default-state');

    if ('yes' === $(this).val()) {
      $fields.removeClass('disabled');
    } else {
      $fields.addClass('disabled');
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
 * Meta box common scripts.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     wptools.io
 */
jQuery(document).ready(function ($) {
  /**
   * Meta box nav.
   */
  var $metaBoxNavItem = $('#meta-box-nav-tab .nav-tab');
  $metaBoxNavItem.on('click', function () {
    var $this = $(this);
    var identifier = $this.attr('data-for');
    var $content = $('.tab-' + identifier);
    $metaBoxNavItem.removeClass('nav-tab-active');
    $this.addClass('nav-tab-active');
    $('.tab-content').hide();
    $content.show();
  });
  /**
   * Toggle visibility rules.
   */

  $('#enable_visibility_rules').on('change', function () {
    var $fields = $('.visibility-rules-field');

    if ($(this).is(':checked')) {
      $fields.removeClass('disabled');
    } else {
      $fields.addClass('disabled');
    }
  });
});
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
"use strict";

/**
 * Visibility rules.
 *
 * @since      3.1.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     wptools.io
 */
jQuery(document).ready(function ($) {
  var $visibilityRules = $('.visibility-rules'); // Change the value dropdown according to the selected rule.

  $visibilityRules.on('change', '.rule', function () {
    var _this = $(this);

    var rule = _this.val();

    var $row = _this.closest('tr');

    $row.find('.value select').removeClass('active');
    $row.find('.for-' + rule).addClass('active');
    $visibilityRules.trigger('visibility_rules_changed');
  }); // Add and clause.

  $visibilityRules.on('click', '.add-and-clause-btn', function () {
    var _this = $(this);

    var andClauses = _this.closest('tbody');

    var lastAndClause = andClauses.children().last().clone();
    lastAndClause.find('select.rule').prop('selectedIndex', 0);
    lastAndClause.find('select.operator').prop('selectedIndex', 0);
    lastAndClause.find('.value select').removeClass('active');
    lastAndClause.find('.value select:first-child').addClass('active');
    andClauses.append(lastAndClause);
    $visibilityRules.trigger('visibility_rules_changed');
  }); // Adds a new rule group

  $visibilityRules.on('click', '.add-new-rule-btn', function () {
    var _this = $(this);

    var visibilityRules = _this.closest('.visibility-rules');

    var visibilityRulesGroup = visibilityRules.find('.visibility-rules-group');
    var lastVisibilityRulesGroup = visibilityRulesGroup.children().last().clone();
    var lastVisibilityRule = lastVisibilityRulesGroup.find('tbody').children().last().clone();
    lastVisibilityRule.find('select.rule').prop('selectedIndex', 0);
    lastVisibilityRule.find('select.operator').prop('selectedIndex', 0);
    lastVisibilityRule.find('.value select').removeClass('active');
    lastVisibilityRule.find('.value select:first-child').addClass('active');
    lastVisibilityRulesGroup.find('tbody').html(lastVisibilityRule);
    visibilityRulesGroup.append(lastVisibilityRulesGroup);
    $visibilityRules.trigger('visibility_rules_changed');
  }); // Removes a rule group

  $visibilityRules.on('click', '.remove-single-line-rule-btn', function () {
    var _this = $(this);

    var rulesGroup = _this.closest('.visibility-rules-group');

    var singleLineRule = _this.closest('.single-line-rule');

    var tbody = _this.closest('tbody');

    var tr = _this.closest('tr');

    var canRemoveFromTBody = false;
    var canRemoveFromGroup = false;

    if (tbody.children().length > 1) {
      canRemoveFromTBody = true;
    }

    if (rulesGroup.children().length > 1) {
      canRemoveFromGroup = true;
    }

    if (!canRemoveFromTBody && !canRemoveFromGroup) {
      return;
    }

    tr.remove();

    if (!tbody.children().length) {
      singleLineRule.remove();
    }

    $visibilityRules.trigger('visibility_rules_changed');
  });
  $visibilityRules.on('change', '.operator, .value select', function () {
    $visibilityRules.trigger('visibility_rules_changed');
  }); // Gets the visibility rules(and, or clauses)  as array.

  function getVisibilityRules() {
    var singleLineRules = $visibilityRules.find('.single-line-rule');
    var rules = [];
    singleLineRules.each(function (key, singleLineRule) {
      var tbody = $(singleLineRule).find('tbody');
      var andClauses = [];
      tbody.children().each(function (index, _andClause) {
        var andClause = $(_andClause);
        var rule = andClause.find('select.rule').val();
        var operator = andClause.find('select.operator').val();
        var value = andClause.find('.value select.active').val();
        andClauses.push([rule, operator, value]);
      });
      rules.push(andClauses);
    });
    return rules;
  }

  $visibilityRules.on('visibility_rules_changed', function () {
    var rules = getVisibilityRules();
    var rawValues = encodeURIComponent(JSON.stringify(rules));
    $('#visibility_rules').val(rawValues);
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbS1hcHBlYXJhbmNlLWZpZWxkcy5qcyIsImRpc3BsYXktdHlwZS1maWVsZHMuanMiLCJmaWVsZC1tZXRhLWJveC5qcyIsImZpbHRlci1mb3JtLW1ldGEtYm94LmpzIiwibWFudWFsLW9wdGlvbnMtdGFibGUuanMiLCJtZXRhLWJveC1jb21tb24uanMiLCJudW1iZXItdWktb3B0aW9ucy5qcyIsInBsdWdpbi1zZXR0aW5ncy5qcyIsInByb2R1Y3Qtc3RhdHVzLXRhYmxlLmpzIiwidG9nZ2xlVmlzaWJpbGl0eS5qcyIsInZpc2liaWxpdHktcnVsZXMuanMiXSwibmFtZXMiOlsialF1ZXJ5IiwiZG9jdW1lbnQiLCJyZWFkeSIsIiQiLCJmaWVsZFdyYXBwZXIiLCJvbiIsImUiLCJoYW5kbGVyIiwidmFsdWUiLCIkZmllbGQiLCIkcXVlcnlUeXBlIiwiZmluZCIsInZhbGlkRGlzcGxheVR5cGVzIiwiaW5jbHVkZXMiLCIkbXVsdGlwbGVGaWx0ZXIiLCJpcyIsInNob3ciLCJoaWRlIiwiJGRpc3BsYXlUeXBlIiwiZGlzcGxheVR5cGUiLCJ2YWwiLCIkaHJGaWVsZHMiLCIkaGllcmFyY2hpY2FsIiwidXNlSGllcmFyY2hpY2FsIiwiJGhyQWNjb3JkaW9uIiwiJG5vUmVzdWx0cyIsIiRhbGxJdGVtc0xhYmVsIiwidXNlQ2hvc2VuIiwiZmllbGRJbnB1dCIsImZpZWxkU3RhdGVzIiwic3RvcmVGaWVsZFN0YXRlIiwiZmllbGRUeXBlIiwiYXR0ciIsImZpZWxkVmFsdWVzIiwiZWFjaCIsIiRpbnB1dCIsInR5cGUiLCJuYW1lIiwibWFudWFsT3B0aW9ucyIsInVwZGF0ZUZpZWxkU3RhdGUiLCIkZWxtIiwiZmllbGRTdGF0ZSIsImhhc0NsYXNzIiwibWFudWFsX29wdGlvbnMiLCIkdGhpcyIsImFwcGx5RmllbGRTdGF0ZSIsInJlbW92ZUF0dHIiLCJyYXdPcHRpb25zIiwiaW5wdXROYW1lIiwicmF3IiwiJHJhd0lucHV0IiwiSlNPTiIsInBhcnNlIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwibGVuZ3RoIiwidGFibGVJZGVudGlmaWVyIiwicm93VGVtcGxhdGVJZCIsInJvd3NJZGVudGlmaWVyIiwicm93SWRlbnRpZmllciIsIiR0YWJsZSIsIiRyb3dzIiwiaSIsIm9wdGlvbiIsInRlbXBsYXRlIiwid3AiLCJyb3dEZWZhdWx0T3B0aW9ucyIsInJlbmRlcmVkIiwiYXBwZW5kIiwiJGxhc3RSb3ciLCJsYXN0IiwiYWRkQ2xhc3MiLCJ0cmlnZ2VyIiwiX2ZpZWxkVHlwZSIsImZpZWxkTmFtZSIsImZpZWxkRGF0YVdyYXBwZXIiLCJmaWVsZE5hbWVXcmFwcGVyIiwiZmllbGRJbnNpZGUiLCJyZW1vdmVDbGFzcyIsImh0bWwiLCJmb3JtRGF0YSIsIiRkcm9wZG93biIsIiRhZGRGaWx0ZXJCdG4iLCIkc2VsZWN0ZWQiLCJmaWx0ZXJJZCIsImZpbHRlclRpdGxlIiwiZmlsdGVyS2V5IiwiZWRpdExpbmsiLCJ0aXRsZSIsImlkIiwia2V5IiwiZWRpdF9saW5rIiwicHJlcGVuZCIsInByb3AiLCJzb3J0YWJsZSIsImlkZW50aWZpZXIiLCJjb250YWluZXIiLCJvcGFjaXR5IiwicmV2ZXJ0IiwiY3Vyc29yIiwiYXhpcyIsImhhbmRsZSIsImNhbmNlbCIsIml0ZW1zIiwicGxhY2Vob2xkZXIiLCJyZW1vdmVGaWVsZCIsIndpZGdldCIsImNsb3Nlc3QiLCJzbGlkZVVwIiwicmVtb3ZlIiwiJGZpZWxkcyIsImluaXRNYW51YWxPcHRpb25zVGFibGUiLCJ2YWx1ZUlkZW50aWZpZXIiLCJmaWVsZElkZW50aWZpZXIiLCJpbml0U29ydGFibGVUYWJsZSIsIiRzZWxlY3RvciIsInVwZGF0ZSIsInRhcmdldCIsInRyaWdnZXJPcHRpb25zQ2hhbmdlIiwiZGlzYWJsZVNlbGVjdGlvbiIsInRhYmxlUm93c0lkZW50aWZpZXIiLCIkdmFsdWVIb2xkZXIiLCJfcm93cyIsIl9pdGVtIiwiJGl0ZW0iLCJvYmoiLCJmaWVsZEluZGV4IiwiZmllbGQiLCJwdXNoIiwicmF3VmFsdWVzIiwiZW5jb2RlVVJJQ29tcG9uZW50Iiwic3RyaW5naWZ5IiwidHJpZ2dlclJlbW92ZU9wdGlvbiIsIiRvcHRpb25zVGFibGUiLCJ0YWJsZVJvd3MiLCJjaGlsZHJlbiIsInJlbW92ZUJ0bklkZW50aWZpZXIiLCJjbGVhck9wdGlvbnNCdG5JZGVudGlmaWVyIiwiZW1wdHkiLCJhZGRPcHRpb25CdG5JZGVudGlmaWVyIiwidGV4dEZpZWxkc0lkZW50aWZpZXIiLCJzZWxlY3RGaWVsZHNJZGVudGlmaWVyIiwidGFibGVJZCIsIiRtZXRhQm94TmF2SXRlbSIsIiRjb250ZW50IiwidG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCIsIiR0ZXh0RmllbGQiLCJ0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkIiwiY2xpY2siLCJwcmV2ZW50RGVmYXVsdCIsIiRidXR0b24iLCIkd3JhcHBlciIsIm1vZGFsVGl0bGUiLCJpbWFnZSIsIm1lZGlhIiwibXVsdGlwbGUiLCJvcGVuIiwidXBsb2FkZWRJbWFnZSIsInN0YXRlIiwiZ2V0IiwiZmlyc3QiLCJpbWFnZURhdGEiLCJ0b0pTT04iLCJpbWFnZVVybCIsInVybCIsInRvZ2dsZUxvYWRpbmdJbWFnZSIsIiRlbmFibGVMb2FkaW5nT3ZlcmxheSIsImVuYWJsZUxvYWRpbmdPdmVybGF5IiwiX2VuYWJsZUxvYWRpbmdPdmVybGF5IiwiZW5hYmxlUGFnaW5hdGlvbiIsIiRlbmFibGVQYWdpbmF0aW9uIiwiZW5hYmxlUGFnaW5hdGlvbk9uTG9hZCIsIl9lbmFibGVQYWdpbmF0aW9uIiwic2Nyb2xsV2luZG93IiwiZGVwZW5kZW50RmllbGRzIiwiJHNjcm9sbFdpbmRvdyIsImRlcGVuZGFudERhdGEiLCJfaGFuZGxlVG9nZ2xlUmVxdWVzdCIsImRhdGEiLCJjdXJyZW50U2VsZWN0b3IiLCJoYW5kbGVyVHlwZSIsImRlcGVuZGFudCIsIl92YWx1ZSIsImQiLCJ2YWxpZFZhbHVlcyIsImhhbmRsZVRvZ2dsZVJlcXVlc3QiLCIkaGFuZGxlciIsIl90aGlzIiwic2V0dXBGaWVsZCIsImluaXRhbCIsImV2ZW50IiwiJHZpc2liaWxpdHlSdWxlcyIsInJ1bGUiLCIkcm93IiwiYW5kQ2xhdXNlcyIsImxhc3RBbmRDbGF1c2UiLCJjbG9uZSIsInZpc2liaWxpdHlSdWxlcyIsInZpc2liaWxpdHlSdWxlc0dyb3VwIiwibGFzdFZpc2liaWxpdHlSdWxlc0dyb3VwIiwibGFzdFZpc2liaWxpdHlSdWxlIiwicnVsZXNHcm91cCIsInNpbmdsZUxpbmVSdWxlIiwidGJvZHkiLCJ0ciIsImNhblJlbW92ZUZyb21UQm9keSIsImNhblJlbW92ZUZyb21Hcm91cCIsImdldFZpc2liaWxpdHlSdWxlcyIsInNpbmdsZUxpbmVSdWxlcyIsInJ1bGVzIiwiaW5kZXgiLCJfYW5kQ2xhdXNlIiwiYW5kQ2xhdXNlIiwib3BlcmF0b3IiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQSxNQUFNLENBQUVDLFFBQUYsQ0FBTixDQUFtQkMsS0FBbkIsQ0FBMEIsVUFBVUMsQ0FBVixFQUFjO0FBRXZDLE1BQU1DLFlBQVksR0FBR0QsQ0FBQyxDQUFFLHVCQUFGLENBQXRCO0FBRUFDLEVBQUFBLFlBQVksQ0FBQ0MsRUFBYixDQUFpQixzQkFBakIsRUFBeUMsVUFBVUMsQ0FBVixFQUFhQyxPQUFiLEVBQXNCQyxLQUF0QixFQUE2QkMsTUFBN0IsRUFBc0M7QUFDOUUsUUFBSyxnREFBZ0RGLE9BQXJELEVBQStEO0FBQzlELFVBQU1HLFVBQVUsR0FBVUQsTUFBTSxDQUFDRSxJQUFQLENBQWEsa0NBQWIsQ0FBMUI7QUFDQSxVQUFNQyxpQkFBaUIsR0FBRyxDQUFFLE9BQUYsRUFBVyxPQUFYLEVBQW9CLE9BQXBCLENBQTFCOztBQUVBLFVBQUtBLGlCQUFpQixDQUFDQyxRQUFsQixDQUE0QkwsS0FBNUIsQ0FBTCxFQUEyQztBQUMxQyxZQUFNTSxlQUFlLEdBQUdMLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLG9EQUFiLENBQXhCOztBQUVBLFlBQUtHLGVBQWUsQ0FBQ0MsRUFBaEIsQ0FBb0Is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QVo7QUFDQSxLQWREO0FBZ0JBLFdBQU9lLEtBQVA7QUFDQTs7QUFFRGxCLEVBQUFBLGdCQUFnQixDQUFDekwsRUFBakIsQ0FBcUIsMEJBQXJCLEVBQWlELFlBQVc7QUFDM0QsUUFBTTJNLEtBQUssR0FBT0Ysa0JBQWtCLEVBQXBDO0FBQ0EsUUFBTTlFLFNBQVMsR0FBR0Msa0JBQWtCLENBQUU5RSxJQUFJLENBQUMrRSxTQUFMLENBQWdCOEUsS0FBaEIsQ0FBRixDQUFwQztBQUVBN00sSUFBQUEsQ0FBQyxDQUFFLG1CQUFGLENBQUQsQ0FBeUJpQixHQUF6QixDQUE4QjRHLFNBQTlCO0FBQ0EsR0FMRDtBQU9BLENBdEhEIiwiZmlsZSI6IndjLWFqYXgtcHJvZHVjdC1maWx0ZXItYWRtaW4tc2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRGlzcGxheSB0eXBlIGZpZWxkcy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkcXVlcnlUeXBlICAgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXF1ZXJ5X3R5cGUnICk7XG5cdFx0XHRjb25zdCB2YWxpZERpc3BsYXlUeXBlcyA9IFsgJ2xhYmVsJywgJ2NvbG9yJywgJ2ltYWdlJyBdO1xuXG5cdFx0XHRpZiAoIHZhbGlkRGlzcGxheVR5cGVzLmluY2x1ZGVzKCB2YWx1ZSApICkge1xuXHRcdFx0XHRjb25zdCAkbXVsdGlwbGVGaWx0ZXIgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfbXVsdGlwbGVfZmlsdGVyIGlucHV0JyApO1xuXG5cdFx0XHRcdGlmICggJG11bHRpcGxlRmlsdGVyLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRcdFx0JHF1ZXJ5VHlwZS5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHF1ZXJ5VHlwZS5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfbXVsdGlwbGVfZmlsdGVyIGlucHV0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRxdWVyeVR5cGUgICAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtcXVlcnlfdHlwZScgKTtcblx0XHRcdGNvbnN0ICRkaXNwbGF5VHlwZSAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlUeXBlICAgICAgID0gJGRpc3BsYXlUeXBlLnZhbCgpO1xuXHRcdFx0Y29uc3QgdmFsaWREaXNwbGF5VHlwZXMgPSBbICdsYWJlbCcsICdjb2xvcicsICdpbWFnZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZERpc3BsYXlUeXBlcy5pbmNsdWRlcyggZGlzcGxheVR5cGUgKSApIHtcblx0XHRcdFx0aWYgKCAnMScgPT09IHZhbHVlICkge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogRGlzcGxheSB0eXBlIGZpZWxkcy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0Ly8gSGllcmFyY2hpY2FsIGZpZWxkJ3MgdG9nZ2xlIHZpc2liaWxpdHkgd2hlbiB0ZXh0IGRpc3BsYXkgdHlwZSBpcyBjaGFuZ2VkLlxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRockZpZWxkcyAgICAgICA9ICRmaWVsZC5maW5kKCAnLmhpZXJhcmNoaWNhbC1maWVsZHMnICk7XG5cdFx0XHRjb25zdCAkaGllcmFyY2hpY2FsICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1oaWVyYXJjaGljYWwnICk7XG5cdFx0XHRjb25zdCB1c2VIaWVyYXJjaGljYWwgPSAkaGllcmFyY2hpY2FsLmZpbmQoICdpbnB1dCcgKS5pcyggJzpjaGVja2VkJyApO1xuXHRcdFx0Y29uc3QgJGhyQWNjb3JkaW9uICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX2hpZXJhcmNoeV9hY2NvcmRpb24nICk7XG5cblx0XHRcdGlmICggJ2NoZWNrYm94JyA9PT0gdmFsdWUgfHwgJ3JhZGlvJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHRcdCRockZpZWxkcy5zaG93KCk7XG5cblx0XHRcdFx0aWYgKCB1c2VIaWVyYXJjaGljYWwgKSB7XG5cdFx0XHRcdFx0JGhyQWNjb3JkaW9uLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkaHJBY2NvcmRpb24uaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKCAnc2VsZWN0JyA9PT0gdmFsdWUgfHwgJ211bHRpLXNlbGVjdCcgPT09IHZhbHVlICkge1xuXHRcdFx0XHQkaHJGaWVsZHMuc2hvdygpO1xuXHRcdFx0XHQkaHJBY2NvcmRpb24uaGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGhyRmllbGRzLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHQvLyBIaWVyYXJjaGljYWwgYWNjb3JkaW9uIGZpZWxkIHRvZ2dsZSB2aXNpYmlsaXR5IHdoZW4gc2hvdyBoaWVyYXJjaHkgaXMgY2hhbmdlZC5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtaGllcmFyY2hpY2FsIGlucHV0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0IGRpc3BsYXlUeXBlICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnICkudmFsKCk7XG5cdFx0XHRjb25zdCAkaHJBY2NvcmRpb24gPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfaGllcmFyY2h5X2FjY29yZGlvbicgKTtcblxuXHRcdFx0aWYgKCAnMScgPT09IHZhbHVlICkge1xuXHRcdFx0XHRpZiAoICdjaGVja2JveCcgPT09IGRpc3BsYXlUeXBlIHx8ICdyYWRpbycgPT09IGRpc3BsYXlUeXBlICkge1xuXHRcdFx0XHRcdCRockFjY29yZGlvbi5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JGhyQWNjb3JkaW9uLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGhyQWNjb3JkaW9uLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHQvLyBPdmVycmlkZSBuby1yZXN1bHRzLW1lc3NhZ2UsIGFsbC1pdGVtcy1sYWJlbCBmaWVsZCdzIHRvZ2dsZSB2aXNpYmlsaXR5IHdoZW4gdGV4dCBkaXNwbGF5IHR5cGUgaXMgY2hhbmdlZC5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0XHRjb25zdCAkYWxsSXRlbXNMYWJlbCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRcdGNvbnN0IHVzZUNob3NlbiAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcgKS5pcyggJzpjaGVja2VkJyApO1xuXG5cdFx0XHRpZiAoIHVzZUNob3NlbiAmJiAoICdzZWxlY3QnID09PSB2YWx1ZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgKSApIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAoICdyYWRpbycgPT09IHZhbHVlIHx8ICdzZWxlY3QnID09PSB2YWx1ZSApIHx8ICggJ211bHRpLXNlbGVjdCcgPT09IHZhbHVlICYmIHVzZUNob3NlbiApICkge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gT3ZlcnJpZGUgbm8tcmVzdWx0cy1tZXNzYWdlLCBhbGwtaXRlbXMtbGFiZWwgZmllbGQncyB0b2dnbGUgdmlzaWJpbGl0eSB3aGVuIHRleHQgdXNlIGNob3NlbiBpcyBjaGFuZ2VkLlxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScgKTtcblx0XHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyApO1xuXHRcdFx0Y29uc3QgZGlzcGxheVR5cGUgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoICcxJyA9PT0gdmFsdWUgJiYgKCAnc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgfHwgJ211bHRpLXNlbGVjdCcgPT09IGRpc3BsYXlUeXBlICkgKSB7XG5cdFx0XHRcdCRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChcblx0XHRcdFx0KCAnMScgPT09IHZhbHVlICYmICdtdWx0aS1zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0XHRcdHx8ICggJ3JhZGlvJyA9PT0gZGlzcGxheVR5cGUgfHwgJ3NlbGVjdCcgPT09IGRpc3BsYXlUeXBlIClcblx0XHRcdCkge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogRmllbGQgbWV0YSBib3guXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICB3cHRvb2xzLmlvXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXHRjb25zdCBmaWVsZElucHV0ICAgPSAnW25hbWVdOm5vdCgubWFudWFsX29wdGlvbnMpJztcblx0Y29uc3QgZmllbGRTdGF0ZXMgID0ge307XG5cblx0ZnVuY3Rpb24gc3RvcmVGaWVsZFN0YXRlKCkge1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9IGZpZWxkV3JhcHBlci5maW5kKCAnI2ZpZWxkX2RhdGEnICkuYXR0ciggJ2RhdGEtZmllbGQtdHlwZScgKTtcblxuXHRcdGlmICggISBmaWVsZFR5cGUgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZmllbGRWYWx1ZXMgPSB7fTtcblxuXHRcdGZpZWxkV3JhcHBlci5maW5kKCBmaWVsZElucHV0ICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCB0eXBlICAgPSAkaW5wdXQuYXR0ciggJ3R5cGUnICk7XG5cdFx0XHRjb25zdCBuYW1lICAgPSAkaW5wdXQuYXR0ciggJ25hbWUnICk7XG5cdFx0XHRjb25zdCB2YWx1ZSAgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdGlmICggJ2NoZWNrYm94JyA9PT0gdHlwZSB8fCAncmFkaW8nID09PSB0eXBlICkge1xuXHRcdFx0XHRpZiAoICRpbnB1dC5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0XHRcdGZpZWxkVmFsdWVzWyBuYW1lIF0gPSB2YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZmllbGRWYWx1ZXNbIG5hbWUgXSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdC8vIEhhbmRsZSBtYW51YWwgb3B0aW9ucy5cblx0XHRjb25zdCBtYW51YWxPcHRpb25zID0ge307XG5cblx0XHRmaWVsZFdyYXBwZXIuZmluZCggJy5tYW51YWxfb3B0aW9ucycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblx0XHRcdGNvbnN0IG5hbWUgICA9ICRpbnB1dC5hdHRyKCAnbmFtZScgKTtcblxuXHRcdFx0bWFudWFsT3B0aW9uc1sgbmFtZSBdID0gJGlucHV0LnZhbCgpO1xuXHRcdH0gKTtcblxuXHRcdGZpZWxkVmFsdWVzWyAnbWFudWFsX29wdGlvbnMnIF0gPSBtYW51YWxPcHRpb25zO1xuXG5cdFx0ZmllbGRTdGF0ZXNbIGZpZWxkVHlwZSBdID0gZmllbGRWYWx1ZXM7XG5cdH1cblxuXHRmdW5jdGlvbiB1cGRhdGVGaWVsZFN0YXRlKCAkZWxtICkge1xuXHRcdGNvbnN0IGZpZWxkVHlwZSAgPSBmaWVsZFdyYXBwZXIuZmluZCggJyNmaWVsZF9kYXRhJyApLmF0dHIoICdkYXRhLWZpZWxkLXR5cGUnICk7XG5cdFx0Y29uc3QgZmllbGRTdGF0ZSA9IGZpZWxkU3RhdGVzWyBmaWVsZFR5cGUgXTtcblxuXHRcdGNvbnN0IG5hbWUgID0gJGVsbS5hdHRyKCAnbmFtZScgKTtcblx0XHRjb25zdCB0eXBlICA9ICRlbG0uYXR0ciggJ3R5cGUnICk7XG5cdFx0Y29uc3QgdmFsdWUgPSAkZWxtLnZhbCgpO1xuXG5cdFx0aWYgKCAkZWxtLmhhc0NsYXNzKCAnbWFudWFsX29wdGlvbnMnICkgKSB7XG5cdFx0XHRjb25zdCBtYW51YWxfb3B0aW9ucyA9IGZpZWxkU3RhdGVbICdtYW51YWxfb3B0aW9ucycgXSB8fCB7fTtcblxuXHRcdFx0bWFudWFsX29wdGlvbnNbIG5hbWUgXSA9IHZhbHVlO1xuXG5cdFx0XHRmaWVsZFN0YXRlWyAnbWFudWFsX29wdGlvbnMnIF0gPSBtYW51YWxfb3B0aW9ucztcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKCAnY2hlY2tib3gnID09PSB0eXBlIHx8ICdyYWRpbycgPT09IHR5cGUgKSB7XG5cdFx0XHRcdGNvbnN0ICRpbnB1dCA9IGZpZWxkV3JhcHBlci5maW5kKCAnW25hbWU9XCInICsgbmFtZSArICdcIl0nICk7XG5cblx0XHRcdFx0aWYgKCAkaW5wdXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdFx0XHRmaWVsZFN0YXRlWyBuYW1lIF0gPSB2YWx1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRkZWxldGUgZmllbGRTdGF0ZVsgbmFtZSBdO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmaWVsZFN0YXRlWyBuYW1lIF0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBTdG9yZSB0aGUgaW5pdGlhbCBmaWVsZCBzdGF0ZS5cblx0c3RvcmVGaWVsZFN0YXRlKCk7XG5cblx0ZmllbGRXcmFwcGVyLmZpbmQoICdbbmFtZV0nICkub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdHVwZGF0ZUZpZWxkU3RhdGUoICR0aGlzICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiBhcHBseUZpZWxkU3RhdGUoIGZpZWxkVHlwZSApIHtcblx0XHRjb25zdCBmaWVsZFN0YXRlID0gZmllbGRTdGF0ZXNbIGZpZWxkVHlwZSBdO1xuXG5cdFx0ZmllbGRXcmFwcGVyLmZpbmQoIGZpZWxkSW5wdXQgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblx0XHRcdGNvbnN0IHR5cGUgICA9ICRpbnB1dC5hdHRyKCAndHlwZScgKTtcblx0XHRcdGNvbnN0IG5hbWUgICA9ICRpbnB1dC5hdHRyKCAnbmFtZScgKTtcblx0XHRcdGNvbnN0IHZhbHVlICA9IGZpZWxkU3RhdGVbIG5hbWUgXTtcblxuXHRcdFx0aWYgKCAnY2hlY2tib3gnID09PSB0eXBlIHx8ICdyYWRpbycgPT09IHR5cGUgKSB7XG5cdFx0XHRcdGlmICggbmFtZSBpbiBmaWVsZFN0YXRlICkge1xuXHRcdFx0XHRcdC8vIEFkZCAnY2hlY2tlZCcgYXR0cmlidXRlLlxuXHRcdFx0XHRcdGZpZWxkV3JhcHBlclxuXHRcdFx0XHRcdFx0LmZpbmQoICdbbmFtZT1cIicgKyBuYW1lICsgJ1wiXVt2YWx1ZT1cIicgKyB2YWx1ZSArICdcIl0nIClcblx0XHRcdFx0XHRcdC5hdHRyKCAnY2hlY2tlZCcsICdjaGVja2VkJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIFJlbW92ZSAnY2hlY2tlZCcgYXR0cmlidXRlLlxuXHRcdFx0XHRcdGZpZWxkV3JhcHBlci5maW5kKCAnW25hbWU9XCInICsgbmFtZSArICdcIl0nICkucmVtb3ZlQXR0ciggJ2NoZWNrZWQnICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRpbnB1dC52YWwoIHZhbHVlICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Ly8gUHJvY2VzcyB0aGUgbWFudWFsIG9wdGlvbnMuXG5cdFx0aWYgKCAnbWFudWFsX29wdGlvbnMnIGluIGZpZWxkU3RhdGUgKSB7XG5cdFx0XHRjb25zdCByYXdPcHRpb25zID0gZmllbGRTdGF0ZVsgJ21hbnVhbF9vcHRpb25zJyBdO1xuXG5cdFx0XHQkLmVhY2goIHJhd09wdGlvbnMsIGZ1bmN0aW9uKCBpbnB1dE5hbWUsIHJhdyApIHtcblx0XHRcdFx0Y29uc3QgJHJhd0lucHV0ID0gZmllbGRXcmFwcGVyLmZpbmQoICdbbmFtZT1cIicgKyBpbnB1dE5hbWUgKyAnXCJdJyApO1xuXG5cdFx0XHRcdCRyYXdJbnB1dC52YWwoIHJhdyApO1xuXG5cdFx0XHRcdGNvbnN0IG1hbnVhbE9wdGlvbnMgPSBKU09OLnBhcnNlKCBkZWNvZGVVUklDb21wb25lbnQoIHJhdyApICk7XG5cblx0XHRcdFx0aWYgKCAhIG1hbnVhbE9wdGlvbnMubGVuZ3RoICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IHRhYmxlSWRlbnRpZmllciA9ICRyYXdJbnB1dC5hdHRyKCAnZGF0YS10YWJsZScgKTtcblx0XHRcdFx0Y29uc3Qgcm93VGVtcGxhdGVJZCAgID0gJHJhd0lucHV0LmF0dHIoICdkYXRhLXRtcGwnICk7XG5cblx0XHRcdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0XHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgcm93VGVtcGxhdGVJZCApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCByb3dzSWRlbnRpZmllciA9ICcuZmllbGQtdGFibGUtYm9keS1yb3dzJztcblx0XHRcdFx0Y29uc3Qgcm93SWRlbnRpZmllciAgPSAnLnJvdy1pdGVtJztcblxuXHRcdFx0XHRjb25zdCAkdGFibGUgPSBmaWVsZFdyYXBwZXIuZmluZCggdGFibGVJZGVudGlmaWVyICk7XG5cdFx0XHRcdGNvbnN0ICRyb3dzICA9ICR0YWJsZS5maW5kKCByb3dzSWRlbnRpZmllciApO1xuXG5cdFx0XHRcdCQuZWFjaCggbWFudWFsT3B0aW9ucywgZnVuY3Rpb24oIGksIG9wdGlvbiApIHtcblx0XHRcdFx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCByb3dUZW1wbGF0ZUlkICk7XG5cblx0XHRcdFx0XHRsZXQgcm93RGVmYXVsdE9wdGlvbnMgPSB7fTtcblxuXHRcdFx0XHRcdGlmICggJy5tYW51YWwtb3B0aW9ucy10YWJsZScgPT09IHRhYmxlSWRlbnRpZmllciApIHtcblx0XHRcdFx0XHRcdHJvd0RlZmF1bHRPcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0XHQndmFsdWUnOiAnJyxcblx0XHRcdFx0XHRcdFx0J2xhYmVsJzogJycsXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHJvd0RlZmF1bHRPcHRpb25zICk7XG5cblx0XHRcdFx0XHQkcm93cy5hcHBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHRcdFx0XHRjb25zdCAkbGFzdFJvdyA9ICRyb3dzLmZpbmQoIHJvd0lkZW50aWZpZXIgKS5sYXN0KCk7XG5cblx0XHRcdFx0XHQkbGFzdFJvdy5maW5kKCAnW2RhdGEtbmFtZV0nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRcdGNvbnN0IG5hbWUgID0gJHRoaXMuYXR0ciggJ2RhdGEtbmFtZScgKTtcblx0XHRcdFx0XHRcdGNvbnN0IHZhbHVlID0gb3B0aW9uWyBuYW1lIF07XG5cblx0XHRcdFx0XHRcdCR0aGlzLnZhbCggdmFsdWUgKTtcblxuXHRcdFx0XHRcdFx0aWYgKCAnaW1hZ2VfdXJsJyA9PT0gbmFtZSAmJiB2YWx1ZSApIHtcblx0XHRcdFx0XHRcdFx0JGxhc3RSb3cuZmluZCggJy53cC1pbWFnZS1waWNrZXItY29udGFpbmVyJyApLmFkZENsYXNzKCAnYWN0aXZlJyApO1xuXHRcdFx0XHRcdFx0XHQkbGFzdFJvdy5maW5kKCAnaW1nJyApLmF0dHIoICdzcmMnLCB2YWx1ZSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCR0YWJsZS5hZGRDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRjb25zdCAkZmllbGQgPSBmaWVsZFdyYXBwZXIuZmluZCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0XHRmaWVsZFdyYXBwZXIudHJpZ2dlciggJ25ld19vcHRpb25fYWRkZWQnLCBbICRmaWVsZCBdICk7XG5cdFx0fVxuXHR9XG5cblx0JCggJyNhdmFpbGFibGVfZmllbGRzJyApLm9uKCAnY2hhbmdlJywgJ1tuYW1lPVwiX2FjdGl2ZV9maWVsZFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzICAgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgX2ZpZWxkVHlwZSA9ICR0aGlzLnZhbCgpO1xuXHRcdGNvbnN0IGZpZWxkTmFtZSAgPSAkdGhpcy5hdHRyKCAnZGF0YS1maWVsZC1uYW1lJyApO1xuXG5cdFx0aWYgKCAhIF9maWVsZFR5cGUgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZmllbGRUeXBlID0gJ3djYXBmLWZvcm0tZmllbGQtJyArIF9maWVsZFR5cGU7XG5cblx0XHQvLyBCYWlsIG91dCBpZiBubyB0bXBsIGZvdW5kIGZvciB0aGUgdHlwZS5cblx0XHRpZiAoICEgalF1ZXJ5KCAnI3RtcGwtJyArIGZpZWxkVHlwZSApLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSAgICAgICAgID0gd3AudGVtcGxhdGUoIGZpZWxkVHlwZSApO1xuXHRcdGNvbnN0IHJlbmRlcmVkICAgICAgICAgPSB0ZW1wbGF0ZSgpO1xuXHRcdGNvbnN0IGZpZWxkRGF0YVdyYXBwZXIgPSBmaWVsZFdyYXBwZXIuZmluZCggJyNmaWVsZF9kYXRhJyApO1xuXHRcdGNvbnN0IGZpZWxkTmFtZVdyYXBwZXIgPSBmaWVsZFdyYXBwZXIuZmluZCggJy5wb3N0Ym94LWhlYWRlciBoMicgKTtcblx0XHRjb25zdCBmaWVsZEluc2lkZSAgICAgID0gZmllbGRXcmFwcGVyLmZpbmQoICcuaW5zaWRlJyApO1xuXG5cdFx0ZmllbGRXcmFwcGVyLnJlbW92ZUNsYXNzKCAnaGlkZGVuJyApO1xuXG5cdFx0ZmllbGREYXRhV3JhcHBlci5hdHRyKCAnZGF0YS1maWVsZC10eXBlJywgX2ZpZWxkVHlwZSApO1xuXHRcdGZpZWxkTmFtZVdyYXBwZXIuaHRtbCggZmllbGROYW1lICk7XG5cdFx0ZmllbGRJbnNpZGUuaHRtbCggcmVuZGVyZWQgKTtcblxuXHRcdC8vIElmIGFscmVhZHkgZm91bmQgdGhlIGZpZWxkIHN0YXRlIHRoZW4gYXBwbHkgaXQsIG90aGVyd2lzZSBzdG9yZSBpdC5cblx0XHRpZiAoIF9maWVsZFR5cGUgaW4gZmllbGRTdGF0ZXMgKSB7XG5cdFx0XHRhcHBseUZpZWxkU3RhdGUoIF9maWVsZFR5cGUgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3RvcmVGaWVsZFN0YXRlKCk7XG5cdFx0fVxuXG5cdFx0ZmllbGRXcmFwcGVyLnRyaWdnZXIoICdmaWVsZF9hZGRlZCcgKTtcblxuXHRcdGZpZWxkV3JhcHBlci5maW5kKCAnW25hbWVdJyApLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0dXBkYXRlRmllbGRTdGF0ZSggJHRoaXMgKTtcblx0XHR9ICk7XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBGaWx0ZXIgZm9ybSBtZXRhIGJveC5cbiAqXG4gKiBAc2luY2UgICAgICAzLjEuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZvcm1EYXRhICAgICAgPSAkKCAnI2Zvcm1fZGF0YScgKTtcblx0Y29uc3QgJGRyb3Bkb3duICAgICA9ICQoICcjYXZhaWxhYmxlLWZpbHRlcnMtZHJvcGRvd24nICk7XG5cdGNvbnN0ICRhZGRGaWx0ZXJCdG4gPSAkKCAnI2FkZC1maWx0ZXItdG8tZm9ybS1idG4nICk7XG5cblx0JGRyb3Bkb3duLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgdmFsdWUgPSAkdGhpcy52YWwoKTtcblxuXHRcdGlmICggdmFsdWUgKSB7XG5cdFx0XHQkYWRkRmlsdGVyQnRuLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JGFkZEZpbHRlckJ0bi5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0LyoqXG5cdCAqIEFkZCBmaWx0ZXIgdG8gZm9ybS5cblx0ICovXG5cdCRhZGRGaWx0ZXJCdG4ub24oICdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRzZWxlY3RlZCA9ICRkcm9wZG93bi5maW5kKCAnb3B0aW9uOnNlbGVjdGVkJyApO1xuXHRcdGNvbnN0IGZpbHRlcklkICA9ICRzZWxlY3RlZC52YWwoKTtcblxuXHRcdGlmICggISBmaWx0ZXJJZC5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZmlsdGVyVGl0bGUgPSAkc2VsZWN0ZWQuYXR0ciggJ2RhdGEtdGl0bGUnICk7XG5cdFx0Y29uc3QgZmlsdGVyS2V5ICAgPSAkc2VsZWN0ZWQuYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblx0XHRjb25zdCBlZGl0TGluayAgICA9ICRzZWxlY3RlZC5hdHRyKCAnZGF0YS1lZGl0LWxpbmsnICk7XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCAnd2NhcGYtZmlsdGVyLWZvcm0taXRlbScgKTtcblx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCB7IHRpdGxlOiBmaWx0ZXJUaXRsZSwgaWQ6IGZpbHRlcklkLCBrZXk6IGZpbHRlcktleSwgZWRpdF9saW5rOiBlZGl0TGluayB9ICk7XG5cblx0XHRmb3JtRGF0YS5maW5kKCAnI2ZpbHRlci1mb3JtLWl0ZW1zJyApLnByZXBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHQkZHJvcGRvd24ucHJvcCggJ3NlbGVjdGVkSW5kZXgnLCAwICk7XG5cdFx0JGRyb3Bkb3duLmZpbmQoICdvcHRpb25bdmFsdWU9XCInICsgZmlsdGVySWQgKyAnXCJdJyApLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHQkZHJvcGRvd24udHJpZ2dlciggJ2NoYW5nZScgKTtcblx0fSApO1xuXG5cdC8qKlxuXHQgKiBNYWtlIHRoZSBmaWx0ZXJzIHNvcnRhYmxlLlxuXHQgKi9cblx0ZnVuY3Rpb24gc29ydGFibGUoIGlkZW50aWZpZXIgKSB7XG5cdFx0Y29uc3QgY29udGFpbmVyID0gJCggaWRlbnRpZmllciApO1xuXG5cdFx0Y29udGFpbmVyLnNvcnRhYmxlKFxuXHRcdFx0e1xuXHRcdFx0XHRvcGFjaXR5OiAwLjgsXG5cdFx0XHRcdHJldmVydDogZmFsc2UsXG5cdFx0XHRcdGN1cnNvcjogJ21vdmUnLFxuXHRcdFx0XHRheGlzOiAneScsXG5cdFx0XHRcdGhhbmRsZTogJy53aWRnZXQtdG9wJyxcblx0XHRcdFx0Y2FuY2VsOiAnLndpZGdldC10aXRsZS1hY3Rpb24nLFxuXHRcdFx0XHRpdGVtczogJy53aWRnZXQnLFxuXHRcdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHR9XG5cdFx0KTtcblx0fVxuXG5cdHNvcnRhYmxlKCAnI2Zvcm1fZGF0YScgKTtcblxuXHQvKipcblx0ICogUmVtb3ZlIHRoZSBmaWVsZC5cblx0ICovXG5cdGZ1bmN0aW9uIHJlbW92ZUZpZWxkKCkge1xuXHRcdGNvbnN0IHdpZGdldCAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2lkZ2V0JyApO1xuXHRcdGNvbnN0IGZpbHRlcklkID0gd2lkZ2V0LmZpbmQoICcuZmlsdGVyLWlkJyApLnZhbCgpO1xuXG5cdFx0JCggd2lkZ2V0ICkuc2xpZGVVcChcblx0XHRcdCdmYXN0Jyxcblx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkZHJvcGRvd24uZmluZCggJ29wdGlvblt2YWx1ZT1cIicgKyBmaWx0ZXJJZCArICdcIl0nICkucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdFx0XHR3aWRnZXQucmVtb3ZlKCk7XG5cdFx0XHR9XG5cdFx0KTtcblx0fVxuXG5cdGZvcm1EYXRhLm9uKCAnY2xpY2snLCAnLndpZGdldC1jb250cm9sLXJlbW92ZScsIHJlbW92ZUZpZWxkICk7XG5cblx0LyoqXG5cdCAqIFRvZ2dsZSBhY2NvcmRpb24gZGVmYXVsdCBzdGF0ZS5cblx0ICovXG5cdCQoICcjZW5hYmxlX2FjY29yZGlvbicgKS5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZHMgPSAkKCAnLmFjY29yZGlvbi1kZWZhdWx0LXN0YXRlJyApO1xuXG5cdFx0aWYgKCAneWVzJyA9PT0gJCggdGhpcyApLnZhbCgpICkge1xuXHRcdFx0JGZpZWxkcy5yZW1vdmVDbGFzcyggJ2Rpc2FibGVkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkZmllbGRzLmFkZENsYXNzKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogTWFudWFsIE9wdGlvbnMnIHRhYmxlIGZ1bmN0aW9uLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgd3B0b29scy5pb1xuICovXG5cbi8qKlxuICogQHBhcmFtIHRhYmxlSWRlbnRpZmllclxuICogQHBhcmFtIHZhbHVlSWRlbnRpZmllclxuICogQHBhcmFtIHJvd1RlbXBsYXRlSWRcbiAqIEBwYXJhbSByb3dEZWZhdWx0T3B0aW9uc1xuICovXG5mdW5jdGlvbiBpbml0TWFudWFsT3B0aW9uc1RhYmxlKCB0YWJsZUlkZW50aWZpZXIsIHZhbHVlSWRlbnRpZmllciwgcm93VGVtcGxhdGVJZCwgcm93RGVmYXVsdE9wdGlvbnMgPSB7fSApIHtcblx0Y29uc3QgJCA9IGpRdWVyeTtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdGNvbnN0IGZpZWxkSWRlbnRpZmllciA9ICcud2NhcGYtZm9ybS1maWVsZCc7XG5cdGNvbnN0IHJvd3NJZGVudGlmaWVyICA9ICcuZmllbGQtdGFibGUtYm9keS1yb3dzJztcblx0Y29uc3Qgcm93SWRlbnRpZmllciAgID0gJy5yb3ctaXRlbSc7XG5cblx0ZnVuY3Rpb24gaW5pdFNvcnRhYmxlVGFibGUoICRzZWxlY3RvciApIHtcblx0XHQkc2VsZWN0b3Iuc29ydGFibGUoIHtcblx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdHJldmVydDogZmFsc2UsXG5cdFx0XHRjdXJzb3I6ICdtb3ZlJyxcblx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdGhhbmRsZTogJy5tb3ZlLW9wdGlvbnMtaGFuZGxlcicsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHR1cGRhdGU6IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBlLnRhcmdldCApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdFx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdFx0XHR9XG5cdFx0fSApLmRpc2FibGVTZWxlY3Rpb24oKTtcblx0fVxuXG5cdGNvbnN0IHRhYmxlUm93c0lkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnICcgKyByb3dzSWRlbnRpZmllcjtcblxuXHQvLyBJbml0IHRoZSBzb3J0YWJsZSB0YWJsZSBhZnRlciBwYWdlIGxvYWRzLlxuXHRpbml0U29ydGFibGVUYWJsZSggZmllbGRXcmFwcGVyLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKSApO1xuXG5cdC8vIEluaXQgdGhlIHNvcnRhYmxlIHRhYmxlIGFmdGVyIHRoZSBmaWVsZCBpcyBhZGRlZC5cblx0ZmllbGRXcmFwcGVyLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHRpbml0U29ydGFibGVUYWJsZSggJCggZmllbGRXcmFwcGVyLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKSApICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICkge1xuXHRcdGNvbnN0ICR2YWx1ZUhvbGRlciA9ICRmaWVsZC5maW5kKCB2YWx1ZUlkZW50aWZpZXIgKTtcblx0XHRjb25zdCAkcm93cyAgICAgICAgPSAkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApO1xuXHRcdGNvbnN0IF9yb3dzICAgICAgICA9IFtdO1xuXG5cdFx0JHJvd3MuZmluZCggJy5yb3ctaXRlbScgKS5lYWNoKCBmdW5jdGlvbiggaSwgX2l0ZW0gKSB7XG5cdFx0XHRjb25zdCAkaXRlbSA9ICQoIF9pdGVtICk7XG5cdFx0XHRjb25zdCBvYmogICA9IHt9O1xuXG5cdFx0XHQkaXRlbS5maW5kKCAnW2RhdGEtbmFtZV0nICkuZWFjaCggZnVuY3Rpb24oIGZpZWxkSW5kZXgsIGZpZWxkICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBmaWVsZCApO1xuXHRcdFx0XHRjb25zdCBuYW1lICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtbmFtZScgKTtcblxuXHRcdFx0XHRvYmpbIG5hbWUgXSA9ICRmaWVsZC52YWwoKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0X3Jvd3MucHVzaCggb2JqICk7XG5cdFx0fSApO1xuXG5cdFx0Y29uc3QgcmF3VmFsdWVzID0gZW5jb2RlVVJJQ29tcG9uZW50KCBKU09OLnN0cmluZ2lmeSggX3Jvd3MgKSApO1xuXHRcdCR2YWx1ZUhvbGRlci52YWwoIHJhd1ZhbHVlcyApLnRyaWdnZXIoICdjaGFuZ2UnICk7XG5cdH1cblxuXHRmdW5jdGlvbiB0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCB0YWJsZUlkZW50aWZpZXIgKTtcblx0XHRjb25zdCB0YWJsZVJvd3MgICAgID0gJGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKS5jaGlsZHJlbigpO1xuXG5cdFx0aWYgKCAyID4gdGFibGVSb3dzLmxlbmd0aCApIHtcblx0XHRcdCRvcHRpb25zVGFibGUucmVtb3ZlQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH1cblxuXHQvLyBSZW1vdmUgT3B0aW9uXG5cdGNvbnN0IHJlbW92ZUJ0bklkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnIC5yZW1vdmUtb3B0aW9uJztcblxuXHRmaWVsZFdyYXBwZXIub24oICdjbGljaycsIHJlbW92ZUJ0bklkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRpdGVtICA9ICQoIHRoaXMgKS5jbG9zZXN0KCByb3dJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgJGZpZWxkID0gJGl0ZW0uY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKTtcblxuXHRcdCRpdGVtLnJlbW92ZSgpO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQ2xlYXIgQWxsIE9wdGlvbnNcblx0Y29uc3QgY2xlYXJPcHRpb25zQnRuSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgLmNsZWFyLW9wdGlvbnMnO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2NsaWNrJywgY2xlYXJPcHRpb25zQnRuSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0JGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKS5lbXB0eSgpO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICk7XG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQWRkIE5ldyBPcHRpb25cblx0Y29uc3QgYWRkT3B0aW9uQnRuSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgLmFkZC1vcHRpb24nO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2NsaWNrJywgYWRkT3B0aW9uQnRuSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyByb3dUZW1wbGF0ZUlkICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIHJvd1RlbXBsYXRlSWQgKTtcblx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCByb3dEZWZhdWx0T3B0aW9ucyApO1xuXHRcdGNvbnN0ICR0YWJsZSAgID0gJGZpZWxkLmZpbmQoIHRhYmxlSWRlbnRpZmllciApO1xuXHRcdGNvbnN0ICRyb3dzICAgID0gJGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKTtcblxuXHRcdCRyb3dzLmFwcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblxuXHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnbmV3X29wdGlvbl9hZGRlZCcsIFsgJGZpZWxkIF0gKTtcblxuXHRcdGlmICggISAkdGFibGUuaGFzQ2xhc3MoICdoYXMtb3B0aW9ucycgKSApIHtcblx0XHRcdCR0YWJsZS5hZGRDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fSApO1xuXG5cdC8vIFRyaWdnZXIgb3B0aW9ucyBjaGFuZ2Ugd2hlbiB0aGUgdGV4dCBmaWVsZHMgZ2V0IGNoYW5nZWQuXG5cdGNvbnN0IHRleHRGaWVsZHNJZGVudGlmaWVyID0gdGFibGVSb3dzSWRlbnRpZmllciArICcgaW5wdXRbdHlwZT1cInRleHRcIl0nO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2lucHV0JywgdGV4dEZpZWxkc0lkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIFRyaWdnZXIgb3B0aW9ucyBjaGFuZ2Ugd2hlbiB0aGUgc2VsZWN0IGZpZWxkcyBnZXQgY2hhbmdlZC5cblx0bGV0IHNlbGVjdEZpZWxkc0lkZW50aWZpZXIgPSB0YWJsZVJvd3NJZGVudGlmaWVyICsgJyBzZWxlY3QnO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2NoYW5nZScsIHNlbGVjdEZpZWxkc0lkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIFRyaWdnZXIgb3B0aW9ucyBjaGFuZ2Ugd2hlbiB2YWx1ZSBpcyBhZGRlZCBmcm9tIG1vZGFsLlxuXHRmaWVsZFdyYXBwZXIub24oICd0cmlnZ2VyX29wdGlvbnNfdGFibGUnLCBmdW5jdGlvbiggZSwgdGFibGVJZCwgJGZpZWxkICkge1xuXHRcdGlmICggdGFibGVJZCA9PT0gdGFibGVJZGVudGlmaWVyICkge1xuXHRcdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHRcdH1cblx0fSApO1xuXG59XG4iLCIvKipcbiAqIE1ldGEgYm94IGNvbW1vbiBzY3JpcHRzLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMS4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgd3B0b29scy5pb1xuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0LyoqXG5cdCAqIE1ldGEgYm94IG5hdi5cblx0ICovXG5cdGNvbnN0ICRtZXRhQm94TmF2SXRlbSA9ICQoICcjbWV0YS1ib3gtbmF2LXRhYiAubmF2LXRhYicgKTtcblxuXHQkbWV0YUJveE5hdkl0ZW0ub24oICdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzICAgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgaWRlbnRpZmllciA9ICR0aGlzLmF0dHIoICdkYXRhLWZvcicgKTtcblx0XHRjb25zdCAkY29udGVudCAgID0gJCggJy50YWItJyArIGlkZW50aWZpZXIgKTtcblxuXHRcdCRtZXRhQm94TmF2SXRlbS5yZW1vdmVDbGFzcyggJ25hdi10YWItYWN0aXZlJyApO1xuXHRcdCR0aGlzLmFkZENsYXNzKCAnbmF2LXRhYi1hY3RpdmUnICk7XG5cblx0XHQkKCAnLnRhYi1jb250ZW50JyApLmhpZGUoKTtcblx0XHQkY29udGVudC5zaG93KCk7XG5cdH0gKTtcblxuXHQvKipcblx0ICogVG9nZ2xlIHZpc2liaWxpdHkgcnVsZXMuXG5cdCAqL1xuXHQkKCAnI2VuYWJsZV92aXNpYmlsaXR5X3J1bGVzJyApLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkcyA9ICQoICcudmlzaWJpbGl0eS1ydWxlcy1maWVsZCcgKTtcblxuXHRcdGlmICggJCggdGhpcyApLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHQkZmllbGRzLnJlbW92ZUNsYXNzKCAnZGlzYWJsZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRmaWVsZHMuYWRkQ2xhc3MoICdkaXNhYmxlZCcgKTtcblx0XHR9XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBUaGUgbnVtYmVyIHVpIG9wdGlvbnMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICB3cHRvb2xzLmlvXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdC8qKlxuXHQgKiBUb2dnbGUgZGlzYWJsZWQgYXR0cmlidXRlIG9mIG1pbi12YWx1ZSBmaWVsZCBmb3IgbnVtYmVyIHR5cGUuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkKCAkZWxtICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkdGV4dEZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXG5cdFx0aWYgKCAkZWxtLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHQkdGV4dEZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHRleHRGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHRmaWVsZFdyYXBwZXIuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fSApO1xuXHR9ICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKFxuXHRcdCdjbGljaycsXG5cdFx0Jy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0XHR0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHRcdH1cblx0KTtcblxuXHQvKipcblx0ICogVG9nZ2xlIGRpc2FibGVkIGF0dHJpYnV0ZSBvZiBtYXgtdmFsdWUgZmllbGQgZm9yIG51bWJlciB0eXBlLlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCggJGVsbSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgID0gJGVsbS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJHRleHRGaWVsZCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZSBpbnB1dFt0eXBlPVwidGV4dFwiXScgKTtcblxuXHRcdGlmICggJGVsbS5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0JHRleHRGaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCR0ZXh0RmllbGQucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdH1cblx0fVxuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0ZmllbGRXcmFwcGVyLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0XHR0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHRcdH0gKTtcblx0fSApO1xuXG5cdGZpZWxkV3JhcHBlci5vbihcblx0XHQnY2xpY2snLFxuXHRcdCcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0dG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCggJHRoaXMgKTtcblx0XHR9XG5cdCk7XG5cbn0gKTtcbiIsIi8qKlxuICogUGx1Z2luIHNldHRpbmdzIGZvcm0uXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICB3cHRvb2xzLmlvXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRpZiAoICEgJCggJ2JvZHknICkuaGFzQ2xhc3MoICd3Y2FwZi1maWx0ZXJfcGFnZV93Y2FwZi1zZXR0aW5ncycgKSApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvLyBNZWRpYSB1cGxvYWRlci5cblx0JCggJy51cGxvYWQtaW1hZ2UtYnV0dG9uJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRjb25zdCAkYnV0dG9uICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0ICR3cmFwcGVyICAgPSAkYnV0dG9uLmNsb3Nlc3QoICcubWVkaWEtdXBsb2FkJyApO1xuXHRcdGNvbnN0IG1vZGFsVGl0bGUgPSAkYnV0dG9uLmF0dHIoICdkYXRhLW1vZGFsLXRpdGxlJyApO1xuXG5cdFx0Y29uc3QgaW1hZ2UgPSB3cC5tZWRpYSggeyB0aXRsZTogbW9kYWxUaXRsZSwgbXVsdGlwbGU6IGZhbHNlIH0gKVxuXHRcdFx0Lm9wZW4oKVxuXHRcdFx0Lm9uKCAnc2VsZWN0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0IHVwbG9hZGVkSW1hZ2UgPSBpbWFnZS5zdGF0ZSgpLmdldCggJ3NlbGVjdGlvbicgKS5maXJzdCgpO1xuXHRcdFx0XHRjb25zdCBpbWFnZURhdGEgICAgID0gdXBsb2FkZWRJbWFnZS50b0pTT04oKTtcblx0XHRcdFx0Y29uc3QgaW1hZ2VVcmwgICAgICA9IGltYWdlRGF0YS51cmw7XG5cblx0XHRcdFx0JHdyYXBwZXIuZmluZCggJy5pbWFnZS1pZCcgKS52YWwoIGltYWdlRGF0YS5pZCApO1xuXHRcdFx0XHQkd3JhcHBlci5maW5kKCAnLmltYWdlLXNyYycgKS5hdHRyKCAnc3JjJywgaW1hZ2VVcmwgKTtcblx0XHRcdFx0JHdyYXBwZXIucmVtb3ZlQ2xhc3MoICduby1pbWFnZScgKTtcblx0XHRcdH0gKTtcblx0fSApO1xuXG5cdCQoICcucmVtb3ZlLWltYWdlLWJ1dHRvbicgKS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgJGJ1dHRvbiAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgJHdyYXBwZXIgPSAkYnV0dG9uLmNsb3Nlc3QoICcubWVkaWEtdXBsb2FkJyApO1xuXG5cdFx0JHdyYXBwZXIuZmluZCggJy5pbWFnZS1pZCcgKS52YWwoICcnICk7XG5cdFx0JHdyYXBwZXIuZmluZCggJy5pbWFnZS1zcmMnICkuYXR0ciggJ3NyYycsICcnICk7XG5cdFx0JHdyYXBwZXIuYWRkQ2xhc3MoICduby1pbWFnZScgKTtcblx0fSApO1xuXG5cdC8vIFRvZ2dsZSBsb2FkaW5nIGltYWdlIGZpZWxkLlxuXHRmdW5jdGlvbiB0b2dnbGVMb2FkaW5nSW1hZ2UoIHZhbHVlICkge1xuXHRcdGNvbnN0ICRzZWxlY3RvciA9ICQoICcuc2V0dGluZ3MtdGFibGUtbG9hZGluZ19pbWFnZScgKTtcblxuXHRcdGlmICggdmFsdWUgKSB7XG5cdFx0XHQkc2VsZWN0b3Iuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkc2VsZWN0b3IuaGlkZSgpO1xuXHRcdH1cblx0fVxuXG5cdGNvbnN0ICRlbmFibGVMb2FkaW5nT3ZlcmxheSA9ICQoICcjbG9hZGluZ19hbmltYXRpb24nICk7XG5cblx0bGV0IGVuYWJsZUxvYWRpbmdPdmVybGF5ID0gZmFsc2U7XG5cblx0aWYgKCAkZW5hYmxlTG9hZGluZ092ZXJsYXkuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRlbmFibGVMb2FkaW5nT3ZlcmxheSA9IHRydWU7XG5cdH1cblxuXHR0b2dnbGVMb2FkaW5nSW1hZ2UoIGVuYWJsZUxvYWRpbmdPdmVybGF5ICk7XG5cblx0JGVuYWJsZUxvYWRpbmdPdmVybGF5Lm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0bGV0IF9lbmFibGVMb2FkaW5nT3ZlcmxheSA9IGZhbHNlO1xuXG5cdFx0aWYgKCAkKCB0aGlzICkuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdF9lbmFibGVMb2FkaW5nT3ZlcmxheSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0dG9nZ2xlTG9hZGluZ0ltYWdlKCBfZW5hYmxlTG9hZGluZ092ZXJsYXkgKTtcblx0fSApO1xuXG5cdC8vIFRvZ2dsZSBwYWdpbmF0aW9uIGZpZWxkcy5cblx0ZnVuY3Rpb24gZW5hYmxlUGFnaW5hdGlvbiggdmFsdWUgKSB7XG5cdFx0Y29uc3QgJHNlbGVjdG9yID0gJCggJy5zZXR0aW5ncy10YWJsZS1wYWdpbmF0aW9uX2NvbnRhaW5lcicgKTtcblxuXHRcdGlmICggdmFsdWUgKSB7XG5cdFx0XHQkc2VsZWN0b3Iuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkc2VsZWN0b3IuaGlkZSgpO1xuXHRcdH1cblx0fVxuXG5cdGNvbnN0ICRlbmFibGVQYWdpbmF0aW9uID0gJCggJyNlbmFibGVfcGFnaW5hdGlvbl92aWFfYWpheCcgKTtcblxuXHRsZXQgZW5hYmxlUGFnaW5hdGlvbk9uTG9hZCA9IGZhbHNlO1xuXG5cdGlmICggJGVuYWJsZVBhZ2luYXRpb24uaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRlbmFibGVQYWdpbmF0aW9uT25Mb2FkID0gdHJ1ZTtcblx0fVxuXG5cdGVuYWJsZVBhZ2luYXRpb24oIGVuYWJsZVBhZ2luYXRpb25PbkxvYWQgKTtcblxuXHQkZW5hYmxlUGFnaW5hdGlvbi5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdGxldCBfZW5hYmxlUGFnaW5hdGlvbiA9IGZhbHNlO1xuXG5cdFx0aWYgKCAkKCB0aGlzICkuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdF9lbmFibGVQYWdpbmF0aW9uID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRlbmFibGVQYWdpbmF0aW9uKCBfZW5hYmxlUGFnaW5hdGlvbiApO1xuXHR9ICk7XG5cblx0Ly8gVG9nZ2xlIHNjcm9sbCB3aW5kb3cgZmllbGRzLlxuXHRmdW5jdGlvbiBzY3JvbGxXaW5kb3coIHZhbHVlICkge1xuXHRcdGNvbnN0IGRlcGVuZGVudEZpZWxkcyA9ICcuc2Nyb2xsLXdpbmRvdy1kZXBlbmRlbnQtZmllbGRzLCcgK1xuXHRcdFx0Jy5zY3JvbGwtd2luZG93LWN1c3RvbS1lbGVtZW50LWlucHV0LCcgK1xuXHRcdFx0Jy5zZXR0aW5ncy10YWJsZS1zY3JvbGxfdG9fdG9wX29mZnNldCc7XG5cblx0XHRpZiAoICdub25lJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHQkKCBkZXBlbmRlbnRGaWVsZHMgKS5oaWRlKCk7XG5cdFx0fSBlbHNlIGlmICggJ3Jlc3VsdHMnID09PSB2YWx1ZSApIHtcblx0XHRcdCQoICcuc2Nyb2xsLXdpbmRvdy1kZXBlbmRlbnQtZmllbGRzLCAuc2V0dGluZ3MtdGFibGUtc2Nyb2xsX3RvX3RvcF9vZmZzZXQnICkuc2hvdygpO1xuXHRcdFx0JCggJy5zY3JvbGwtd2luZG93LWN1c3RvbS1lbGVtZW50LWlucHV0JyApLmhpZGUoKTtcblx0XHR9IGVsc2UgaWYgKCAnY3VzdG9tJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHQkKCAnLnNjcm9sbC13aW5kb3ctZGVwZW5kZW50LWZpZWxkcywgLnNldHRpbmdzLXRhYmxlLXNjcm9sbF90b190b3Bfb2Zmc2V0JyApLnNob3coKTtcblx0XHRcdCQoICcuc2Nyb2xsLXdpbmRvdy1jdXN0b20tZWxlbWVudC1pbnB1dCcgKS5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCQoIGRlcGVuZGVudEZpZWxkcyApLnNob3coKTtcblx0XHR9XG5cdH1cblxuXHRjb25zdCAkc2Nyb2xsV2luZG93ID0gJCggJyNzY3JvbGxfd2luZG93JyApO1xuXG5cdHNjcm9sbFdpbmRvdyggJHNjcm9sbFdpbmRvdy52YWwoKSApO1xuXG5cdCRzY3JvbGxXaW5kb3cub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCB2YWx1ZSA9ICQoIHRoaXMgKS52YWwoKTtcblxuXHRcdHNjcm9sbFdpbmRvdyggdmFsdWUgKTtcblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIFRoZSBwcm9kdWN0IHN0YXR1cyBmaWVsZC5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXG5cdGNvbnN0IHRhYmxlSWRlbnRpZmllciA9ICcucHJvZHVjdC1zdGF0dXMtb3B0aW9ucy10YWJsZSc7XG5cdGNvbnN0IHZhbHVlSWRlbnRpZmllciA9ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcHJvZHVjdF9zdGF0dXNfb3B0aW9ucyBpbnB1dCc7XG5cdGNvbnN0IHJvd1RlbXBsYXRlSWQgICA9ICd3Y2FwZi1wcm9kdWN0LXN0YXR1cy1vcHRpb24nO1xuXG5cdGluaXRNYW51YWxPcHRpb25zVGFibGUoIHRhYmxlSWRlbnRpZmllciwgdmFsdWVJZGVudGlmaWVyLCByb3dUZW1wbGF0ZUlkICk7XG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIHRvZ2dsZSB2aXNpYmlsaXR5IHNjcmlwdHMuXG4gKlxuICogTk9URTogVGhlc2Ugc2NyaXB0cyBtdXN0IGJlIGxvY2F0ZWQgYXQgdGhlIHZlcnkgYm90dG9tIG9mIHRoZSBjb21iaW5lZCBzY3JpcHRzLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgd3B0b29scy5pb1xuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblxuXHRjb25zdCBkZXBlbmRhbnREYXRhID0gW1xuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS10ZXh0LWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGV4dCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS1udW1iZXItZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdudW1iZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtZGF0ZS1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2RhdGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLnZhbHVlLWRlY2ltYWwtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdudW1iZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXF1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NoZWNrYm94JywgJ211bHRpLXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYWRpbycsICdzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3NlbGVjdCcsICdtdWx0aS1zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jYXRlZ29yeV9pbWFnZXMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2ltYWdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfbXVsdGlwbGVfZmlsdGVyJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdsYWJlbCcsICdjb2xvcicsICdpbWFnZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuY29sdW1uLWdyb3VwLWN1c3RvbV9hcHBlYXJhbmNlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjb2xvcicsICdpbWFnZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1oaWVyYXJjaGljYWwgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXZhbHVlX2RlY2ltYWwgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfZGVjaW1hbF9wbGFjZXMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWdldF9vcHRpb25zIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmNvbHVtbi1ncm91cC1tZXRhX2tleV9tYW51YWxfb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbWFudWFsX2VudHJ5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NsaWRlcl9kaXNwbGF5X3ZhbHVlc19hcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGlnbl92YWx1ZXNfYXRfdGhlX2VuZCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfcXVlcnlfdHlwZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zZWxlY3RfYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9lbmFibGVfbXVsdGlwbGVfZmlsdGVyJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3Nob3dfY291bnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcsICdyYW5nZV9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2hpZGVfZW1wdHknLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcsICdyYW5nZV9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLWRlY2ltYWwtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInLCAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JywgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfdXNlX2Nob3NlbiBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2dldF9vcHRpb25zIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1hdXRvbWF0aWMtb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnYXV0b21hdGljYWxseScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdtYW51YWxfZW50cnknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRhdGVfZGlzcGxheV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuZGF0ZS10by11aS1vcHRpb25zJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbnB1dF9kYXRlX3JhbmdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kYXRlX2Zvcm1hdCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5wdXRfZGF0ZScsICdpbnB1dF9kYXRlX3JhbmdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1zaG93X2RhdGVfaW5wdXRzX2lubGluZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5wdXRfZGF0ZV9yYW5nZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuZGF0ZS1waWNrZXItZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbnB1dF9kYXRlJywgJ2lucHV0X2RhdGVfcmFuZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3F1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2NoZWNrYm94JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9zZWxlY3RfYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9yYWRpbycsICd0aW1lX3BlcmlvZF9zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3VzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX3NlbGVjdCcsICd0aW1lX3BlcmlvZF9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfZW5hYmxlX211bHRpcGxlX2ZpbHRlcicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3Nob3dfY291bnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2NoZWNrYm94JywgJ3RpbWVfcGVyaW9kX3JhZGlvJywgJ3RpbWVfcGVyaW9kX3NlbGVjdCcsICd0aW1lX3BlcmlvZF9tdWx0aXNlbGVjdCcsICd0aW1lX3BlcmlvZF9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfaGlkZV9lbXB0eScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfY2hlY2tib3gnLCAndGltZV9wZXJpb2RfcmFkaW8nLCAndGltZV9wZXJpb2Rfc2VsZWN0JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JywgJ3RpbWVfcGVyaW9kX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF91c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9zb2Z0X2xpbWl0IGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNvZnRfbGltaXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRheG9ub215IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWN1c3RvbS10YXhvbm9teSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tZXRhX2tleSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1wb3N0X3Byb3BlcnR5IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWxpbWl0X29wdGlvbnMgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1wYXJlbnRfdGVybScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY2hpbGQnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWxpbWl0X3ZhbHVlc19ieV9pZCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5jbHVkZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZXhjbHVkZV92YWx1ZXNfaWQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2V4Y2x1ZGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWluY2x1ZGVfdXNlcl9yb2xlcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndXNlcl9yb2xlcycgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX2FjY29yZGlvbiBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hY2NvcmRpb25fZGVmYXVsdF9zdGF0ZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2NhdGVnb3J5X2ltYWdlcyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9jbGVhcl9hbGxfYnV0dG9uIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmNsZWFyLWFsbC1idXR0b24tZmllbGRzLXN0YXJ0Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1zaG93X2lmX2VtcHR5IGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVtcHR5X2ZpbHRlcl9tZXNzYWdlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1zaG93X3RpdGxlIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1vdmVfY2xlYXJfYWxsX2J1dHRvbl9pbl90aXRsZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtb3JkZXJfdGVybXNfYnkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWN0aXZlX2ZpbHRlcnNfbGF5b3V0IGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLnNpbXBsZS1sYXlvdXQtc29mdC1maWVsZHMtc3RhcnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3NpbXBsZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuZXh0ZW5kZWQtbGF5b3V0LXNvZnQtZmllbGRzLXN0YXJ0Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdleHRlbmRlZCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX3NvZnRfbGltaXRfZm9yX2V4dGVuZGVkX2xheW91dCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1zb2Z0X2xpbWl0X2Zvcl9leHRlbmRlZF9sYXlvdXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV90b29sdGlwIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNob3dfY291bnRfaW5fdG9vbHRpcCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdG9vbHRpcF9wb3NpdGlvbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XTtcblxuXHRmdW5jdGlvbiBfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgICA9IGN1cnJlbnRTZWxlY3Rvci5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgaGFuZGxlciAgICAgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRjb25zdCBoYW5kbGVyVHlwZSA9IGRhdGFbICdoYW5kbGVyVHlwZScgXTtcblx0XHRjb25zdCBkZXBlbmRhbnQgICA9IGRhdGFbICdkZXBlbmRhbnQnIF07XG5cblx0XHRsZXQgX3ZhbHVlID0gdmFsdWU7XG5cblx0XHRpZiAoICdjaGVja2JveCcgPT09IGhhbmRsZXJUeXBlICkge1xuXHRcdFx0X3ZhbHVlID0gY3VycmVudFNlbGVjdG9yLmlzKCAnOmNoZWNrZWQnICkgPyAnMScgOiAnMCc7XG5cdFx0fVxuXG5cdFx0aWYgKCAncmFkaW8nID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9ICRmaWVsZC5maW5kKCBoYW5kbGVyICsgJzpjaGVja2VkJyApLnZhbCgpO1xuXHRcdH1cblxuXHRcdCQuZWFjaCggZGVwZW5kYW50LCBmdW5jdGlvbiggaWQsIGQgKSB7XG5cdFx0XHRjb25zdCAkc2VsZWN0b3IgICA9ICRmaWVsZC5maW5kKCBkWyAnc2VsZWN0b3InIF0gKTtcblx0XHRcdGNvbnN0IHZhbGlkVmFsdWVzID0gZFsgJ3ZhbHVlJyBdO1xuXG5cdFx0XHRpZiAoIHZhbGlkVmFsdWVzLmluY2x1ZGVzKCBfdmFsdWUgKSApIHtcblx0XHRcdFx0JHNlbGVjdG9yLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0ZmllbGRXcmFwcGVyLnRyaWdnZXIoICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIFsgaGFuZGxlciwgX3ZhbHVlLCAkZmllbGQgXSApO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApIHtcblx0XHRpZiAoIG51bGwgPT09IGN1cnJlbnRTZWxlY3RvciApIHtcblx0XHRcdGNvbnN0IGhhbmRsZXIgID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0XHRjb25zdCAkaGFuZGxlciA9ICQoIGhhbmRsZXIgKTtcblxuXHRcdFx0JC5lYWNoKCAkaGFuZGxlciwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0IF90aGlzICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgX3ZhbHVlID0gX3RoaXMudmFsKCk7XG5cdFx0XHRcdF9oYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBfdGhpcywgX3ZhbHVlICk7XG5cdFx0XHR9ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdF9oYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBjdXJyZW50U2VsZWN0b3IsIHZhbHVlICk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2V0dXBGaWVsZCggaW5pdGFsID0gZmFsc2UgKSB7XG5cdFx0JC5lYWNoKCBkZXBlbmRhbnREYXRhLCBmdW5jdGlvbiggaSwgZGF0YSApIHtcblx0XHRcdGNvbnN0IGhhbmRsZXIgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRcdGNvbnN0IGV2ZW50ICAgPSBkYXRhWyAnZXZlbnQnIF07XG5cblx0XHRcdGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIG51bGwsIG51bGwgKTtcblxuXHRcdFx0aWYgKCBpbml0YWwgKSB7XG5cdFx0XHRcdGZpZWxkV3JhcHBlci5vbiggZXZlbnQsIGhhbmRsZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGNvbnN0IF90aGlzICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRjb25zdCBfdmFsdWUgPSAkKCB0aGlzICkudmFsKCk7XG5cdFx0XHRcdFx0aGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgX3RoaXMsIF92YWx1ZSApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0aWYgKCAhICQoIGZpZWxkV3JhcHBlciApLmhhc0NsYXNzKCAnbG9hZGVkJyApICkge1xuXHRcdFx0XHRcdCQoIGZpZWxkV3JhcHBlciApLmFkZENsYXNzKCAnbG9hZGVkJyApO1xuXG5cdFx0XHRcdFx0ZmllbGRXcmFwcGVyLnRyaWdnZXIoICdmaWVsZF9hZGRlZCcgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdHNldHVwRmllbGQoIHRydWUgKTtcblxuXHRmaWVsZFdyYXBwZXIub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdC8vIFRvZ2dsZSB0aGUgdmlzaWJpbGl0eSBvZiBzdWJmaWVsZHMuXG5cdFx0c2V0dXBGaWVsZCgpO1xuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogVmlzaWJpbGl0eSBydWxlcy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjEuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0ICR2aXNpYmlsaXR5UnVsZXMgPSAkKCAnLnZpc2liaWxpdHktcnVsZXMnICk7XG5cblx0Ly8gQ2hhbmdlIHRoZSB2YWx1ZSBkcm9wZG93biBhY2NvcmRpbmcgdG8gdGhlIHNlbGVjdGVkIHJ1bGUuXG5cdCR2aXNpYmlsaXR5UnVsZXMub24oICdjaGFuZ2UnLCAnLnJ1bGUnLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCBfdGhpcyA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBydWxlICA9IF90aGlzLnZhbCgpO1xuXHRcdGNvbnN0ICRyb3cgID0gX3RoaXMuY2xvc2VzdCggJ3RyJyApO1xuXG5cdFx0JHJvdy5maW5kKCAnLnZhbHVlIHNlbGVjdCcgKS5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHQkcm93LmZpbmQoICcuZm9yLScgKyBydWxlICkuYWRkQ2xhc3MoICdhY3RpdmUnICk7XG5cblx0XHQkdmlzaWJpbGl0eVJ1bGVzLnRyaWdnZXIoICd2aXNpYmlsaXR5X3J1bGVzX2NoYW5nZWQnICk7XG5cdH0gKTtcblxuXHQvLyBBZGQgYW5kIGNsYXVzZS5cblx0JHZpc2liaWxpdHlSdWxlcy5vbiggJ2NsaWNrJywgJy5hZGQtYW5kLWNsYXVzZS1idG4nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCBfdGhpcyAgICAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGFuZENsYXVzZXMgICAgPSBfdGhpcy5jbG9zZXN0KCAndGJvZHknICk7XG5cdFx0Y29uc3QgbGFzdEFuZENsYXVzZSA9IGFuZENsYXVzZXMuY2hpbGRyZW4oKS5sYXN0KCkuY2xvbmUoKTtcblxuXHRcdGxhc3RBbmRDbGF1c2UuZmluZCggJ3NlbGVjdC5ydWxlJyApLnByb3AoICdzZWxlY3RlZEluZGV4JywgMCApO1xuXHRcdGxhc3RBbmRDbGF1c2UuZmluZCggJ3NlbGVjdC5vcGVyYXRvcicgKS5wcm9wKCAnc2VsZWN0ZWRJbmRleCcsIDAgKTtcblx0XHRsYXN0QW5kQ2xhdXNlLmZpbmQoICcudmFsdWUgc2VsZWN0JyApLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdGxhc3RBbmRDbGF1c2UuZmluZCggJy52YWx1ZSBzZWxlY3Q6Zmlyc3QtY2hpbGQnICkuYWRkQ2xhc3MoICdhY3RpdmUnICk7XG5cblx0XHRhbmRDbGF1c2VzLmFwcGVuZCggbGFzdEFuZENsYXVzZSApO1xuXG5cdFx0JHZpc2liaWxpdHlSdWxlcy50cmlnZ2VyKCAndmlzaWJpbGl0eV9ydWxlc19jaGFuZ2VkJyApO1xuXHR9ICk7XG5cblx0Ly8gQWRkcyBhIG5ldyBydWxlIGdyb3VwXG5cdCR2aXNpYmlsaXR5UnVsZXMub24oICdjbGljaycsICcuYWRkLW5ldy1ydWxlLWJ0bicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IF90aGlzICAgICAgICAgICAgICAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCB2aXNpYmlsaXR5UnVsZXMgICAgICAgICAgPSBfdGhpcy5jbG9zZXN0KCAnLnZpc2liaWxpdHktcnVsZXMnICk7XG5cdFx0Y29uc3QgdmlzaWJpbGl0eVJ1bGVzR3JvdXAgICAgID0gdmlzaWJpbGl0eVJ1bGVzLmZpbmQoICcudmlzaWJpbGl0eS1ydWxlcy1ncm91cCcgKTtcblx0XHRjb25zdCBsYXN0VmlzaWJpbGl0eVJ1bGVzR3JvdXAgPSB2aXNpYmlsaXR5UnVsZXNHcm91cC5jaGlsZHJlbigpLmxhc3QoKS5jbG9uZSgpO1xuXHRcdGNvbnN0IGxhc3RWaXNpYmlsaXR5UnVsZSAgICAgICA9IGxhc3RWaXNpYmlsaXR5UnVsZXNHcm91cC5maW5kKCAndGJvZHknICkuY2hpbGRyZW4oKS5sYXN0KCkuY2xvbmUoKTtcblxuXHRcdGxhc3RWaXNpYmlsaXR5UnVsZS5maW5kKCAnc2VsZWN0LnJ1bGUnICkucHJvcCggJ3NlbGVjdGVkSW5kZXgnLCAwICk7XG5cdFx0bGFzdFZpc2liaWxpdHlSdWxlLmZpbmQoICdzZWxlY3Qub3BlcmF0b3InICkucHJvcCggJ3NlbGVjdGVkSW5kZXgnLCAwICk7XG5cdFx0bGFzdFZpc2liaWxpdHlSdWxlLmZpbmQoICcudmFsdWUgc2VsZWN0JyApLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdGxhc3RWaXNpYmlsaXR5UnVsZS5maW5kKCAnLnZhbHVlIHNlbGVjdDpmaXJzdC1jaGlsZCcgKS5hZGRDbGFzcyggJ2FjdGl2ZScgKTtcblxuXHRcdGxhc3RWaXNpYmlsaXR5UnVsZXNHcm91cC5maW5kKCAndGJvZHknICkuaHRtbCggbGFzdFZpc2liaWxpdHlSdWxlICk7XG5cdFx0dmlzaWJpbGl0eVJ1bGVzR3JvdXAuYXBwZW5kKCBsYXN0VmlzaWJpbGl0eVJ1bGVzR3JvdXAgKTtcblxuXHRcdCR2aXNpYmlsaXR5UnVsZXMudHJpZ2dlciggJ3Zpc2liaWxpdHlfcnVsZXNfY2hhbmdlZCcgKTtcblx0fSApO1xuXG5cdC8vIFJlbW92ZXMgYSBydWxlIGdyb3VwXG5cdCR2aXNpYmlsaXR5UnVsZXMub24oICdjbGljaycsICcucmVtb3ZlLXNpbmdsZS1saW5lLXJ1bGUtYnRuJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgX3RoaXMgICAgICAgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgcnVsZXNHcm91cCAgICAgPSBfdGhpcy5jbG9zZXN0KCAnLnZpc2liaWxpdHktcnVsZXMtZ3JvdXAnICk7XG5cdFx0Y29uc3Qgc2luZ2xlTGluZVJ1bGUgPSBfdGhpcy5jbG9zZXN0KCAnLnNpbmdsZS1saW5lLXJ1bGUnICk7XG5cdFx0Y29uc3QgdGJvZHkgICAgICAgICAgPSBfdGhpcy5jbG9zZXN0KCAndGJvZHknICk7XG5cdFx0Y29uc3QgdHIgICAgICAgICAgICAgPSBfdGhpcy5jbG9zZXN0KCAndHInICk7XG5cblx0XHRsZXQgY2FuUmVtb3ZlRnJvbVRCb2R5ID0gZmFsc2U7XG5cdFx0bGV0IGNhblJlbW92ZUZyb21Hcm91cCA9IGZhbHNlO1xuXG5cdFx0aWYgKCB0Ym9keS5jaGlsZHJlbigpLmxlbmd0aCA+IDEgKSB7XG5cdFx0XHRjYW5SZW1vdmVGcm9tVEJvZHkgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICggcnVsZXNHcm91cC5jaGlsZHJlbigpLmxlbmd0aCA+IDEgKSB7XG5cdFx0XHRjYW5SZW1vdmVGcm9tR3JvdXAgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICggISBjYW5SZW1vdmVGcm9tVEJvZHkgJiYgISBjYW5SZW1vdmVGcm9tR3JvdXAgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dHIucmVtb3ZlKCk7XG5cblx0XHRpZiAoICEgdGJvZHkuY2hpbGRyZW4oKS5sZW5ndGggKSB7XG5cdFx0XHRzaW5nbGVMaW5lUnVsZS5yZW1vdmUoKTtcblx0XHR9XG5cblx0XHQkdmlzaWJpbGl0eVJ1bGVzLnRyaWdnZXIoICd2aXNpYmlsaXR5X3J1bGVzX2NoYW5nZWQnICk7XG5cdH0gKTtcblxuXHQkdmlzaWJpbGl0eVJ1bGVzLm9uKCAnY2hhbmdlJywgJy5vcGVyYXRvciwgLnZhbHVlIHNlbGVjdCcsIGZ1bmN0aW9uKCkge1xuXHRcdCR2aXNpYmlsaXR5UnVsZXMudHJpZ2dlciggJ3Zpc2liaWxpdHlfcnVsZXNfY2hhbmdlZCcgKTtcblx0fSApO1xuXG5cdC8vIEdldHMgdGhlIHZpc2liaWxpdHkgcnVsZXMoYW5kLCBvciBjbGF1c2VzKSAgYXMgYXJyYXkuXG5cdGZ1bmN0aW9uIGdldFZpc2liaWxpdHlSdWxlcygpIHtcblx0XHRjb25zdCBzaW5nbGVMaW5lUnVsZXMgPSAkdmlzaWJpbGl0eVJ1bGVzLmZpbmQoICcuc2luZ2xlLWxpbmUtcnVsZScgKTtcblx0XHRjb25zdCBydWxlcyAgICAgICAgICAgPSBbXTtcblxuXHRcdHNpbmdsZUxpbmVSdWxlcy5lYWNoKCBmdW5jdGlvbigga2V5LCBzaW5nbGVMaW5lUnVsZSApIHtcblx0XHRcdGNvbnN0IHRib2R5ICAgICAgPSAkKCBzaW5nbGVMaW5lUnVsZSApLmZpbmQoICd0Ym9keScgKTtcblx0XHRcdGNvbnN0IGFuZENsYXVzZXMgPSBbXTtcblxuXHRcdFx0dGJvZHkuY2hpbGRyZW4oKS5lYWNoKCBmdW5jdGlvbiggaW5kZXgsIF9hbmRDbGF1c2UgKSB7XG5cdFx0XHRcdGNvbnN0IGFuZENsYXVzZSA9ICQoIF9hbmRDbGF1c2UgKTtcblx0XHRcdFx0Y29uc3QgcnVsZSAgICAgID0gYW5kQ2xhdXNlLmZpbmQoICdzZWxlY3QucnVsZScgKS52YWwoKTtcblx0XHRcdFx0Y29uc3Qgb3BlcmF0b3IgID0gYW5kQ2xhdXNlLmZpbmQoICdzZWxlY3Qub3BlcmF0b3InICkudmFsKCk7XG5cdFx0XHRcdGNvbnN0IHZhbHVlICAgICA9IGFuZENsYXVzZS5maW5kKCAnLnZhbHVlIHNlbGVjdC5hY3RpdmUnICkudmFsKCk7XG5cblx0XHRcdFx0YW5kQ2xhdXNlcy5wdXNoKCBbIHJ1bGUsIG9wZXJhdG9yLCB2YWx1ZSBdICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdHJ1bGVzLnB1c2goIGFuZENsYXVzZXMgKTtcblx0XHR9ICk7XG5cblx0XHRyZXR1cm4gcnVsZXM7XG5cdH1cblxuXHQkdmlzaWJpbGl0eVJ1bGVzLm9uKCAndmlzaWJpbGl0eV9ydWxlc19jaGFuZ2VkJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgcnVsZXMgICAgID0gZ2V0VmlzaWJpbGl0eVJ1bGVzKCk7XG5cdFx0Y29uc3QgcmF3VmFsdWVzID0gZW5jb2RlVVJJQ29tcG9uZW50KCBKU09OLnN0cmluZ2lmeSggcnVsZXMgKSApO1xuXG5cdFx0JCggJyN2aXNpYmlsaXR5X3J1bGVzJyApLnZhbCggcmF3VmFsdWVzICk7XG5cdH0gKTtcblxufSApO1xuIl19
