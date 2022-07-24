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
   * Filter nav tab.
   */
  var $filterNavTab = $('#filter-nav-tab');
  var $filterNavTabItem = $('#filter-nav-tab .nav-tab');
  $filterNavTabItem.on('click', function () {
    var $this = $(this);
    var identifier = $this.attr('data-for');
    var $content = $('.tab-' + identifier);
    $filterNavTabItem.removeClass('nav-tab-active');
    $filterNavTab.attr('data-active-nav', identifier);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbS1hcHBlYXJhbmNlLWZpZWxkcy5qcyIsImRpc3BsYXktdHlwZS1maWVsZHMuanMiLCJmaWVsZC1tZXRhLWJveC5qcyIsImZpbHRlci1mb3JtLW1ldGEtYm94LmpzIiwibWFudWFsLW9wdGlvbnMtdGFibGUuanMiLCJtZXRhLWJveC1jb21tb24uanMiLCJudW1iZXItdWktb3B0aW9ucy5qcyIsInBsdWdpbi1zZXR0aW5ncy5qcyIsInByb2R1Y3Qtc3RhdHVzLXRhYmxlLmpzIiwidG9nZ2xlVmlzaWJpbGl0eS5qcyIsInZpc2liaWxpdHktcnVsZXMuanMiXSwibmFtZXMiOlsialF1ZXJ5IiwiZG9jdW1lbnQiLCJyZWFkeSIsIiQiLCJmaWVsZFdyYXBwZXIiLCJvbiIsImUiLCJoYW5kbGVyIiwidmFsdWUiLCIkZmllbGQiLCIkcXVlcnlUeXBlIiwiZmluZCIsInZhbGlkRGlzcGxheVR5cGVzIiwiaW5jbHVkZXMiLCIkbXVsdGlwbGVGaWx0ZXIiLCJpcyIsInNob3ciLCJoaWRlIiwiJGRpc3BsYXlUeXBlIiwiZGlzcGxheVR5cGUiLCJ2YWwiLCIkaHJGaWVsZHMiLCIkaGllcmFyY2hpY2FsIiwidXNlSGllcmFyY2hpY2FsIiwiJGhyQWNjb3JkaW9uIiwiJG5vUmVzdWx0cyIsIiRhbGxJdGVtc0xhYmVsIiwidXNlQ2hvc2VuIiwiZmllbGRJbnB1dCIsImZpZWxkU3RhdGVzIiwic3RvcmVGaWVsZFN0YXRlIiwiZmllbGRUeXBlIiwiYXR0ciIsImZpZWxkVmFsdWVzIiwiZWFjaCIsIiRpbnB1dCIsInR5cGUiLCJuYW1lIiwibWFudWFsT3B0aW9ucyIsInVwZGF0ZUZpZWxkU3RhdGUiLCIkZWxtIiwiZmllbGRTdGF0ZSIsImhhc0NsYXNzIiwibWFudWFsX29wdGlvbnMiLCIkdGhpcyIsImFwcGx5RmllbGRTdGF0ZSIsInJlbW92ZUF0dHIiLCJyYXdPcHRpb25zIiwiaW5wdXROYW1lIiwicmF3IiwiJHJhd0lucHV0IiwiSlNPTiIsInBhcnNlIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwibGVuZ3RoIiwidGFibGVJZGVudGlmaWVyIiwicm93VGVtcGxhdGVJZCIsInJvd3NJZGVudGlmaWVyIiwicm93SWRlbnRpZmllciIsIiR0YWJsZSIsIiRyb3dzIiwiaSIsIm9wdGlvbiIsInRlbXBsYXRlIiwid3AiLCJyb3dEZWZhdWx0T3B0aW9ucyIsInJlbmRlcmVkIiwiYXBwZW5kIiwiJGxhc3RSb3ciLCJsYXN0IiwiYWRkQ2xhc3MiLCJ0cmlnZ2VyIiwiX2ZpZWxkVHlwZSIsImZpZWxkTmFtZSIsImZpZWxkRGF0YVdyYXBwZXIiLCJmaWVsZE5hbWVXcmFwcGVyIiwiZmllbGRJbnNpZGUiLCJyZW1vdmVDbGFzcyIsImh0bWwiLCJmb3JtRGF0YSIsIiRkcm9wZG93biIsIiRhZGRGaWx0ZXJCdG4iLCIkc2VsZWN0ZWQiLCJmaWx0ZXJJZCIsImZpbHRlclRpdGxlIiwiZmlsdGVyS2V5IiwiZWRpdExpbmsiLCJ0aXRsZSIsImlkIiwia2V5IiwiZWRpdF9saW5rIiwicHJlcGVuZCIsInByb3AiLCJzb3J0YWJsZSIsImlkZW50aWZpZXIiLCJjb250YWluZXIiLCJvcGFjaXR5IiwicmV2ZXJ0IiwiY3Vyc29yIiwiYXhpcyIsImhhbmRsZSIsImNhbmNlbCIsIml0ZW1zIiwicGxhY2Vob2xkZXIiLCJyZW1vdmVGaWVsZCIsIndpZGdldCIsImNsb3Nlc3QiLCJzbGlkZVVwIiwicmVtb3ZlIiwiaW5pdE1hbnVhbE9wdGlvbnNUYWJsZSIsInZhbHVlSWRlbnRpZmllciIsImZpZWxkSWRlbnRpZmllciIsImluaXRTb3J0YWJsZVRhYmxlIiwiJHNlbGVjdG9yIiwidXBkYXRlIiwidGFyZ2V0IiwidHJpZ2dlck9wdGlvbnNDaGFuZ2UiLCJkaXNhYmxlU2VsZWN0aW9uIiwidGFibGVSb3dzSWRlbnRpZmllciIsIiR2YWx1ZUhvbGRlciIsIl9yb3dzIiwiX2l0ZW0iLCIkaXRlbSIsIm9iaiIsImZpZWxkSW5kZXgiLCJmaWVsZCIsInB1c2giLCJyYXdWYWx1ZXMiLCJlbmNvZGVVUklDb21wb25lbnQiLCJzdHJpbmdpZnkiLCJ0cmlnZ2VyUmVtb3ZlT3B0aW9uIiwiJG9wdGlvbnNUYWJsZSIsInRhYmxlUm93cyIsImNoaWxkcmVuIiwicmVtb3ZlQnRuSWRlbnRpZmllciIsImNsZWFyT3B0aW9uc0J0bklkZW50aWZpZXIiLCJlbXB0eSIsImFkZE9wdGlvbkJ0bklkZW50aWZpZXIiLCJ0ZXh0RmllbGRzSWRlbnRpZmllciIsInNlbGVjdEZpZWxkc0lkZW50aWZpZXIiLCJ0YWJsZUlkIiwiJGZpbHRlck5hdlRhYiIsIiRmaWx0ZXJOYXZUYWJJdGVtIiwiJGNvbnRlbnQiLCIkZmllbGRzIiwidG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCIsIiR0ZXh0RmllbGQiLCJ0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkIiwiY2xpY2siLCJwcmV2ZW50RGVmYXVsdCIsIiRidXR0b24iLCIkd3JhcHBlciIsIm1vZGFsVGl0bGUiLCJpbWFnZSIsIm1lZGlhIiwibXVsdGlwbGUiLCJvcGVuIiwidXBsb2FkZWRJbWFnZSIsInN0YXRlIiwiZ2V0IiwiZmlyc3QiLCJpbWFnZURhdGEiLCJ0b0pTT04iLCJ0aHVtYm5haWwiLCJzaXplcyIsImltYWdlVXJsIiwidXJsIiwidG9nZ2xlTG9hZGluZ0ltYWdlIiwiJGVuYWJsZUxvYWRpbmdPdmVybGF5IiwiZW5hYmxlTG9hZGluZ092ZXJsYXkiLCJfZW5hYmxlTG9hZGluZ092ZXJsYXkiLCJlbmFibGVQYWdpbmF0aW9uIiwiJGVuYWJsZVBhZ2luYXRpb24iLCJlbmFibGVQYWdpbmF0aW9uT25Mb2FkIiwiX2VuYWJsZVBhZ2luYXRpb24iLCJzY3JvbGxXaW5kb3ciLCJkZXBlbmRlbnRGaWVsZHMiLCIkc2Nyb2xsV2luZG93IiwiZGVwZW5kYW50RGF0YSIsIl9oYW5kbGVUb2dnbGVSZXF1ZXN0IiwiZGF0YSIsImN1cnJlbnRTZWxlY3RvciIsImhhbmRsZXJUeXBlIiwiZGVwZW5kYW50IiwiX3ZhbHVlIiwiZCIsInZhbGlkVmFsdWVzIiwiaGFuZGxlVG9nZ2xlUmVxdWVzdCIsIiRoYW5kbGVyIiwiX3RoaXMiLCJzZXR1cEZpZWxkIiwiaW5pdGFsIiwiZXZlbnQiLCIkdmlzaWJpbGl0eVJ1bGVzIiwicnVsZSIsIiRyb3ciLCJhbmRDbGF1c2VzIiwibGFzdEFuZENsYXVzZSIsImNsb25lIiwidmlzaWJpbGl0eVJ1bGVzIiwidmlzaWJpbGl0eVJ1bGVzR3JvdXAiLCJsYXN0VmlzaWJpbGl0eVJ1bGVzR3JvdXAiLCJsYXN0VmlzaWJpbGl0eVJ1bGUiLCJydWxlc0dyb3VwIiwic2luZ2xlTGluZVJ1bGUiLCJ0Ym9keSIsInRyIiwiY2FuUmVtb3ZlRnJvbVRCb2R5IiwiY2FuUmVtb3ZlRnJvbUdyb3VwIiwiZ2V0VmlzaWJpbGl0eVJ1bGVzIiwic2luZ2xlTGluZVJ1bGVzIiwicnVsZXMiLCJpbmRleCIsIl9hbmRDbGF1c2UiLCJhbmRDbGF1c2UiLCJvcGVyYXRvciJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixVQUFVQyxDQUFWLEVBQWM7QUFFdkMsTUFBTUMsWUFBWSxHQUFHRCxDQUFDLENBQUUsdUJBQUYsQ0FBdEI7QUFFQUMsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLHNCQUFqQixFQUF5QyxVQUFVQyxDQUFWLEVBQWFDLE9BQWIsRUFBc0JDLEtBQXRCLEVBQTZCQyxNQUE3QixFQUFzQztBQUM5RSxRQUFLLGdEQUFnREYsT0FBckQsRUFBK0Q7QUFDOUQsVUFBTUcsVUFBVSxHQUFVRCxNQUFNLENBQUNFLElBQVAsQ0FBYSxrQ0FBYixDQUExQjtBQUNBLFVBQU1DLGlCQUFpQixHQUFHLENBQUUsT0FBRixFQUFXLE9BQVgsRUFBb0IsT0FBcEIsQ0FBMUI7O0FBRUEsVUFBS0EsaUJBQWlCLENBQUNDLFFBQWxCLENBQTRCTCxLQUE1QixDQUFMLEVBQTJDO0FBQzFDLFlBQU1NLGVBQWUsR0FBR0wsTUFBTSxDQUFDRSxJQUFQLENBQWEsb0RBQWIsQ0FBeEI7O0FBRUEsWUFBS0csZUFBZSxDQUFDQyxFQUFoQixDQUFvQixVQUFwQixDQUFMLEVBQXdDO0FBQ3ZDTCxVQUFBQSxVQUFVLENBQUNNLElBQVg7QUFDQSxTQUZELE1BRU87QUFDTk4sVUFBQUEsVUFBVSxDQUFDTyxJQUFYO0FBQ0E7QUFDRDtBQUNEO0FBQ0QsR0FmRDtBQWlCQWIsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLHNCQUFqQixFQUF5QyxVQUFVQyxDQUFWLEVBQWFDLE9BQWIsRUFBc0JDLEtBQXRCLEVBQTZCQyxNQUE3QixFQUFzQztBQUM5RSxRQUFLLHlEQUF5REYsT0FBOUQsRUFBd0U7QUFDdkUsVUFBTUcsVUFBVSxHQUFVRCxNQUFNLENBQUNFLElBQVAsQ0FBYSxrQ0FBYixDQUExQjtBQUNBLFVBQU1PLFlBQVksR0FBUVQsTUFBTSxDQUFDRSxJQUFQLENBQWEsMkNBQWIsQ0FBMUI7QUFDQSxVQUFNUSxXQUFXLEdBQVNELFlBQVksQ0FBQ0UsR0FBYixFQUExQjtBQUNBLFVBQU1SLGlCQUFpQixHQUFHLENBQUUsT0FBRixFQUFXLE9BQVgsRUFBb0IsT0FBcEIsQ0FBMUI7O0FBRUEsVUFBS0EsaUJBQWlCLENBQUNDLFFBQWxCLENBQTRCTSxXQUE1QixDQUFMLEVBQWlEO0FBQ2hELFlBQUssUUFBUVgsS0FBYixFQUFxQjtBQUNwQkUsVUFBQUEsVUFBVSxDQUFDTSxJQUFYO0FBQ0EsU0FGRCxNQUVPO0FBQ05OLFVBQUFBLFVBQVUsQ0FBQ08sSUFBWDtBQUNBO0FBQ0Q7QUFDRDtBQUNELEdBZkQ7QUFpQkEsQ0F0Q0Q7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQWpCLE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixVQUFVQyxDQUFWLEVBQWM7QUFFdkMsTUFBTUMsWUFBWSxHQUFHRCxDQUFDLENBQUUsdUJBQUYsQ0FBdEIsQ0FGdUMsQ0FJdkM7O0FBQ0FDLEVBQUFBLFlBQVksQ0FBQ0MsRUFBYixDQUFpQixzQkFBakIsRUFBeUMsVUFBVUMsQ0FBVixFQUFhQyxPQUFiLEVBQXNCQyxLQUF0QixFQUE2QkMsTUFBN0IsRUFBc0M7QUFDOUUsUUFBSyxnREFBZ0RGLE9BQXJELEVBQStEO0FBQzlELFVBQU1jLFNBQVMsR0FBU1osTUFBTSxDQUFDRSxJQUFQLENBQWEsc0JBQWIsQ0FBeEI7QUFDQSxVQUFNVyxhQUFhLEdBQUtiLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLG9DQUFiLENBQXhCO0FBQ0EsVUFBTVksZUFBZSxHQUFHRCxhQUFhLENBQUNYLElBQWQsQ0FBb0IsT0FBcEIsRUFBOEJJLEVBQTlCLENBQWtDLFVBQWxDLENBQXhCO0FBQ0EsVUFBTVMsWUFBWSxHQUFNZixNQUFNLENBQUNFLElBQVAsQ0FBYSxrREFBYixDQUF4Qjs7QUFFQSxVQUFLLGVBQWVILEtBQWYsSUFBd0IsWUFBWUEsS0FBekMsRUFBaUQ7QUFDaERhLFFBQUFBLFNBQVMsQ0FBQ0wsSUFBVjs7QUFFQSxZQUFLTyxlQUFMLEVBQXVCO0FBQ3RCQyxVQUFBQSxZQUFZLENBQUNSLElBQWI7QUFDQSxTQUZELE1BRU87QUFDTlEsVUFBQUEsWUFBWSxDQUFDUCxJQUFiO0FBQ0E7QUFDRCxPQVJELE1BUU8sSUFBSyxhQUFhVCxLQUFiLElBQXNCLG1CQUFtQkEsS0FBOUMsRUFBc0Q7QUFDNURhLFFBQUFBLFNBQVMsQ0FBQ0wsSUFBVjtBQUNBUSxRQUFBQSxZQUFZLENBQUNQLElBQWI7QUFDQSxPQUhNLE1BR0E7QUFDTkksUUFBQUEsU0FBUyxDQUFDSixJQUFWO0FBQ0E7QUFDRDtBQUNELEdBdEJELEVBTHVDLENBNkJ2Qzs7QUFDQWIsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLHNCQUFqQixFQUF5QyxVQUFVQyxDQUFWLEVBQWFDLE9BQWIsRUFBc0JDLEtBQXRCLEVBQTZCQyxNQUE3QixFQUFzQztBQUM5RSxRQUFLLCtDQUErQ0YsT0FBcEQsRUFBOEQ7QUFDN0QsVUFBTVksV0FBVyxHQUFJVixNQUFNLENBQUNFLElBQVAsQ0FBYSwyQ0FBYixFQUEyRFMsR0FBM0QsRUFBckI7QUFDQSxVQUFNSSxZQUFZLEdBQUdmLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLGtEQUFiLENBQXJCOztBQUVBLFVBQUssUUFBUUgsS0FBYixFQUFxQjtBQUNwQixZQUFLLGVBQWVXLFdBQWYsSUFBOEIsWUFBWUEsV0FBL0MsRUFBNkQ7QUFDNURLLFVBQUFBLFlBQVksQ0FBQ1IsSUFBYjtBQUNBLFNBRkQsTUFFTztBQUNOUSxVQUFBQSxZQUFZLENBQUNQLElBQWI7QUFDQTtBQUNELE9BTkQsTUFNTztBQUNOTyxRQUFBQSxZQUFZLENBQUNQLElBQWI7QUFDQTtBQUNEO0FBQ0QsR0FmRCxFQTlCdUMsQ0ErQ3ZDOztBQUNBYixFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUIsc0JBQWpCLEVBQXlDLFVBQVVDLENBQVYsRUFBYUMsT0FBYixFQUFzQkMsS0FBdEIsRUFBNkJDLE1BQTdCLEVBQXNDO0FBQzlFLFFBQUssZ0RBQWdERixPQUFyRCxFQUErRDtBQUM5RCxVQUFNa0IsVUFBVSxHQUFPaEIsTUFBTSxDQUFDRSxJQUFQLENBQWEsaURBQWIsQ0FBdkI7QUFDQSxVQUFNZSxjQUFjLEdBQUdqQixNQUFNLENBQUNFLElBQVAsQ0FBYSx1Q0FBYixDQUF2QjtBQUNBLFVBQU1nQixTQUFTLEdBQVFsQixNQUFNLENBQUNFLElBQVAsQ0FBYSx3Q0FBYixFQUF3REksRUFBeEQsQ0FBNEQsVUFBNUQsQ0FBdkI7O0FBRUEsVUFBS1ksU0FBUyxLQUFNLGFBQWFuQixLQUFiLElBQXNCLG1CQUFtQkEsS0FBL0MsQ0FBZCxFQUF1RTtBQUN0RWlCLFFBQUFBLFVBQVUsQ0FBQ1QsSUFBWDtBQUNBLE9BRkQsTUFFTztBQUNOUyxRQUFBQSxVQUFVLENBQUNSLElBQVg7QUFDQTs7QUFFRCxVQUFPLFlBQVlULEtBQVosSUFBcUIsYUFBYUEsS0FBcEMsSUFBaUQsbUJBQW1CQSxLQUFuQixJQUE0Qm1CLFNBQWxGLEVBQWdHO0FBQy9GRCxRQUFBQSxjQUFjLENBQUNWLElBQWY7QUFDQSxPQUZELE1BRU87QUFDTlUsUUFBQUEsY0FBYyxDQUFDVCxJQUFmO0FBQ0E7QUFDRDtBQUNELEdBbEJELEVBaER1QyxDQW9FdkM7O0FBQ0FiLEVBQUFBLFlBQVksQ0FBQ0MsRUFBYixDQUFpQixzQkFBakIsRUFBeUMsVUFBVUMsQ0FBVixFQUFhQyxPQUFiLEVBQXNCQyxLQUF0QixFQUE2QkMsTUFBN0IsRUFBc0M7QUFDOUUsUUFBSyw2Q0FBNkNGLE9BQWxELEVBQTREO0FBQzNELFVBQU1rQixVQUFVLEdBQU9oQixNQUFNLENBQUNFLElBQVAsQ0FBYSxpREFBYixDQUF2QjtBQUNBLFVBQU1lLGNBQWMsR0FBR2pCLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLHVDQUFiLENBQXZCO0FBQ0EsVUFBTVEsV0FBVyxHQUFNVixNQUFNLENBQUNFLElBQVAsQ0FBYSwyQ0FBYixFQUEyRFMsR0FBM0QsRUFBdkI7O0FBRUEsVUFBSyxRQUFRWixLQUFSLEtBQW1CLGFBQWFXLFdBQWIsSUFBNEIsbUJBQW1CQSxXQUFsRSxDQUFMLEVBQXVGO0FBQ3RGTSxRQUFBQSxVQUFVLENBQUNULElBQVg7QUFDQSxPQUZELE1BRU87QUFDTlMsUUFBQUEsVUFBVSxDQUFDUixJQUFYO0FBQ0E7O0FBRUQsVUFDRyxRQUFRVCxLQUFSLElBQWlCLG1CQUFtQlcsV0FBdEMsSUFDSyxZQUFZQSxXQUFaLElBQTJCLGFBQWFBLFdBRjlDLEVBR0U7QUFDRE8sUUFBQUEsY0FBYyxDQUFDVixJQUFmO0FBQ0EsT0FMRCxNQUtPO0FBQ05VLFFBQUFBLGNBQWMsQ0FBQ1QsSUFBZjtBQUNBO0FBQ0Q7QUFDRCxHQXJCRDtBQXVCQSxDQTVGRDs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBakIsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVDLENBQVYsRUFBYztBQUV2QyxNQUFNQyxZQUFZLEdBQUdELENBQUMsQ0FBRSx1QkFBRixDQUF0QjtBQUNBLE1BQU15QixVQUFVLEdBQUssNkJBQXJCO0FBQ0EsTUFBTUMsV0FBVyxHQUFJLEVBQXJCOztBQUVBLFdBQVNDLGVBQVQsR0FBMkI7QUFDMUIsUUFBTUMsU0FBUyxHQUFHM0IsWUFBWSxDQUFDTyxJQUFiLENBQW1CLGFBQW5CLEVBQW1DcUIsSUFBbkMsQ0FBeUMsaUJBQXpDLENBQWxCOztBQUVBLFFBQUssQ0FBRUQsU0FBUCxFQUFtQjtBQUNsQjtBQUNBOztBQUVELFFBQU1FLFdBQVcsR0FBRyxFQUFwQjtBQUVBN0IsSUFBQUEsWUFBWSxDQUFDTyxJQUFiLENBQW1CaUIsVUFBbkIsRUFBZ0NNLElBQWhDLENBQXNDLFlBQVc7QUFDaEQsVUFBTUMsTUFBTSxHQUFHaEMsQ0FBQyxDQUFFLElBQUYsQ0FBaEI7QUFDQSxVQUFNaUMsSUFBSSxHQUFLRCxNQUFNLENBQUNILElBQVAsQ0FBYSxNQUFiLENBQWY7QUFDQSxVQUFNSyxJQUFJLEdBQUtGLE1BQU0sQ0FBQ0gsSUFBUCxDQUFhLE1BQWIsQ0FBZjtBQUNBLFVBQU14QixLQUFLLEdBQUkyQixNQUFNLENBQUNmLEdBQVAsRUFBZjs7QUFFQSxVQUFLLGVBQWVnQixJQUFmLElBQXVCLFlBQVlBLElBQXhDLEVBQStDO0FBQzlDLFlBQUtELE1BQU0sQ0FBQ3BCLEVBQVAsQ0FBVyxVQUFYLENBQUwsRUFBK0I7QUFDOUJrQixVQUFBQSxXQUFXLENBQUVJLElBQUYsQ0FBWCxHQUFzQjdCLEtBQXRCO0FBQ0E7QUFDRCxPQUpELE1BSU87QUFDTnlCLFFBQUFBLFdBQVcsQ0FBRUksSUFBRixDQUFYLEdBQXNCN0IsS0FBdEI7QUFDQTtBQUNELEtBYkQsRUFUMEIsQ0F3QjFCOztBQUNBLFFBQU04QixhQUFhLEdBQUcsRUFBdEI7QUFFQWxDLElBQUFBLFlBQVksQ0FBQ08sSUFBYixDQUFtQixpQkFBbkIsRUFBdUN1QixJQUF2QyxDQUE2QyxZQUFXO0FBQ3ZELFVBQU1DLE1BQU0sR0FBR2hDLENBQUMsQ0FBRSxJQUFGLENBQWhCO0FBQ0EsVUFBTWtDLElBQUksR0FBS0YsTUFBTSxDQUFDSCxJQUFQLENBQWEsTUFBYixDQUFmO0FBRUFNLE1BQUFBLGFBQWEsQ0FBRUQsSUFBRixDQUFiLEdBQXdCRixNQUFNLENBQUNmLEdBQVAsRUFBeEI7QUFDQSxLQUxEO0FBT0FhLElBQUFBLFdBQVcsQ0FBRSxnQkFBRixDQUFYLEdBQWtDSyxhQUFsQztBQUVBVCxJQUFBQSxXQUFXLENBQUVFLFNBQUYsQ0FBWCxHQUEyQkUsV0FBM0I7QUFDQTs7QUFFRCxXQUFTTSxnQkFBVCxDQUEyQkMsSUFBM0IsRUFBa0M7QUFDakMsUUFBTVQsU0FBUyxHQUFJM0IsWUFBWSxDQUFDTyxJQUFiLENBQW1CLGFBQW5CLEVBQW1DcUIsSUFBbkMsQ0FBeUMsaUJBQXpDLENBQW5CO0FBQ0EsUUFBTVMsVUFBVSxHQUFHWixXQUFXLENBQUVFLFNBQUYsQ0FBOUI7QUFFQSxRQUFNTSxJQUFJLEdBQUlHLElBQUksQ0FBQ1IsSUFBTCxDQUFXLE1BQVgsQ0FBZDtBQUNBLFFBQU1JLElBQUksR0FBSUksSUFBSSxDQUFDUixJQUFMLENBQVcsTUFBWCxDQUFkO0FBQ0EsUUFBTXhCLEtBQUssR0FBR2dDLElBQUksQ0FBQ3BCLEdBQUwsRUFBZDs7QUFFQSxRQUFLb0IsSUFBSSxDQUFDRSxRQUFMLENBQWUsZ0JBQWYsQ0FBTCxFQUF5QztBQUN4QyxVQUFNQyxjQUFjLEdBQUdGLFVBQVUsQ0FBRSxnQkFBRixDQUFWLElBQWtDLEVBQXpEO0FBRUFFLE1BQUFBLGNBQWMsQ0FBRU4sSUFBRixDQUFkLEdBQXlCN0IsS0FBekI7QUFFQWlDLE1BQUFBLFVBQVUsQ0FBRSxnQkFBRixDQUFWLEdBQWlDRSxjQUFqQztBQUNBLEtBTkQsTUFNTztBQUNOLFVBQUssZUFBZVAsSUFBZixJQUF1QixZQUFZQSxJQUF4QyxFQUErQztBQUM5QyxZQUFNRCxNQUFNLEdBQUcvQixZQUFZLENBQUNPLElBQWIsQ0FBbUIsWUFBWTBCLElBQVosR0FBbUIsSUFBdEMsQ0FBZjs7QUFFQSxZQUFLRixNQUFNLENBQUNwQixFQUFQLENBQVcsVUFBWCxDQUFMLEVBQStCO0FBQzlCMEIsVUFBQUEsVUFBVSxDQUFFSixJQUFGLENBQVYsR0FBcUI3QixLQUFyQjtBQUNBLFNBRkQsTUFFTztBQUNOLGlCQUFPaUMsVUFBVSxDQUFFSixJQUFGLENBQWpCO0FBQ0E7QUFDRCxPQVJELE1BUU87QUFDTkksUUFBQUEsVUFBVSxDQUFFSixJQUFGLENBQVYsR0FBcUI3QixLQUFyQjtBQUNBO0FBQ0Q7QUFDRCxHQXhFc0MsQ0EwRXZDOzs7QUFDQXNCLEVBQUFBLGVBQWU7QUFFZjFCLEVBQUFBLFlBQVksQ0FBQ08sSUFBYixDQUFtQixRQUFuQixFQUE4Qk4sRUFBOUIsQ0FBa0MsUUFBbEMsRUFBNEMsWUFBVztBQUN0RCxRQUFNdUMsS0FBSyxHQUFHekMsQ0FBQyxDQUFFLElBQUYsQ0FBZjtBQUVBb0MsSUFBQUEsZ0JBQWdCLENBQUVLLEtBQUYsQ0FBaEI7QUFDQSxHQUpEOztBQU1BLFdBQVNDLGVBQVQsQ0FBMEJkLFNBQTFCLEVBQXNDO0FBQ3JDLFFBQU1VLFVBQVUsR0FBR1osV0FBVyxDQUFFRSxTQUFGLENBQTlCO0FBRUEzQixJQUFBQSxZQUFZLENBQUNPLElBQWIsQ0FBbUJpQixVQUFuQixFQUFnQ00sSUFBaEMsQ0FBc0MsWUFBVztBQUNoRCxVQUFNQyxNQUFNLEdBQUdoQyxDQUFDLENBQUUsSUFBRixDQUFoQjtBQUNBLFVBQU1pQyxJQUFJLEdBQUtELE1BQU0sQ0FBQ0gsSUFBUCxDQUFhLE1BQWIsQ0FBZjtBQUNBLFVBQU1LLElBQUksR0FBS0YsTUFBTSxDQUFDSCxJQUFQLENBQWEsTUFBYixDQUFmO0FBQ0EsVUFBTXhCLEtBQUssR0FBSWlDLFVBQVUsQ0FBRUosSUFBRixDQUF6Qjs7QUFFQSxVQUFLLGVBQWVELElBQWYsSUFBdUIsWUFBWUEsSUFBeEMsRUFBK0M7QUFDOUMsWUFBS0MsSUFBSSxJQUFJSSxVQUFiLEVBQTBCO0FBQ3pCO0FBQ0FyQyxVQUFBQSxZQUFZLENBQ1ZPLElBREYsQ0FDUSxZQUFZMEIsSUFBWixHQUFtQixZQUFuQixHQUFrQzdCLEtBQWxDLEdBQTBDLElBRGxELEVBRUV3QixJQUZGLENBRVEsU0FGUixFQUVtQixTQUZuQjtBQUdBLFNBTEQsTUFLTztBQUNOO0FBQ0E1QixVQUFBQSxZQUFZLENBQUNPLElBQWIsQ0FBbUIsWUFBWTBCLElBQVosR0FBbUIsSUFBdEMsRUFBNkNTLFVBQTdDLENBQXlELFNBQXpEO0FBQ0E7QUFDRCxPQVZELE1BVU87QUFDTlgsUUFBQUEsTUFBTSxDQUFDZixHQUFQLENBQVlaLEtBQVo7QUFDQTtBQUNELEtBbkJELEVBSHFDLENBd0JyQzs7QUFDQSxRQUFLLG9CQUFvQmlDLFVBQXpCLEVBQXNDO0FBQ3JDLFVBQU1NLFVBQVUsR0FBR04sVUFBVSxDQUFFLGdCQUFGLENBQTdCO0FBRUF0QyxNQUFBQSxDQUFDLENBQUMrQixJQUFGLENBQVFhLFVBQVIsRUFBb0IsVUFBVUMsU0FBVixFQUFxQkMsR0FBckIsRUFBMkI7QUFDOUMsWUFBTUMsU0FBUyxHQUFHOUMsWUFBWSxDQUFDTyxJQUFiLENBQW1CLFlBQVlxQyxTQUFaLEdBQXdCLElBQTNDLENBQWxCO0FBRUFFLFFBQUFBLFNBQVMsQ0FBQzlCLEdBQVYsQ0FBZTZCLEdBQWY7QUFFQSxZQUFNWCxhQUFhLEdBQUdhLElBQUksQ0FBQ0MsS0FBTCxDQUFZQyxrQkFBa0IsQ0FBRUosR0FBRixDQUE5QixDQUF0Qjs7QUFFQSxZQUFLLENBQUVYLGFBQWEsQ0FBQ2dCLE1BQXJCLEVBQThCO0FBQzdCO0FBQ0E7O0FBRUQsWUFBTUMsZUFBZSxHQUFHTCxTQUFTLENBQUNsQixJQUFWLENBQWdCLFlBQWhCLENBQXhCO0FBQ0EsWUFBTXdCLGFBQWEsR0FBS04sU0FBUyxDQUFDbEIsSUFBVixDQUFnQixXQUFoQixDQUF4QixDQVo4QyxDQWM5Qzs7QUFDQSxZQUFLLENBQUVoQyxNQUFNLENBQUUsV0FBV3dELGFBQWIsQ0FBTixDQUFtQ0YsTUFBMUMsRUFBbUQ7QUFDbEQ7QUFDQTs7QUFFRCxZQUFNRyxjQUFjLEdBQUcsd0JBQXZCO0FBQ0EsWUFBTUMsYUFBYSxHQUFJLFdBQXZCO0FBRUEsWUFBTUMsTUFBTSxHQUFHdkQsWUFBWSxDQUFDTyxJQUFiLENBQW1CNEMsZUFBbkIsQ0FBZjtBQUNBLFlBQU1LLEtBQUssR0FBSUQsTUFBTSxDQUFDaEQsSUFBUCxDQUFhOEMsY0FBYixDQUFmO0FBRUF0RCxRQUFBQSxDQUFDLENBQUMrQixJQUFGLENBQVFJLGFBQVIsRUFBdUIsVUFBVXVCLENBQVYsRUFBYUMsTUFBYixFQUFzQjtBQUM1QyxjQUFNQyxRQUFRLEdBQUdDLEVBQUUsQ0FBQ0QsUUFBSCxDQUFhUCxhQUFiLENBQWpCO0FBRUEsY0FBSVMsaUJBQWlCLEdBQUcsRUFBeEI7O0FBRUEsY0FBSyw0QkFBNEJWLGVBQWpDLEVBQW1EO0FBQ2xEVSxZQUFBQSxpQkFBaUIsR0FBRztBQUNuQix1QkFBUyxFQURVO0FBRW5CLHVCQUFTO0FBRlUsYUFBcEI7QUFJQTs7QUFFRCxjQUFNQyxRQUFRLEdBQUdILFFBQVEsQ0FBRUUsaUJBQUYsQ0FBekI7QUFFQUwsVUFBQUEsS0FBSyxDQUFDTyxNQUFOLENBQWNELFFBQWQ7QUFFQSxjQUFNRSxRQUFRLEdBQUdSLEtBQUssQ0FBQ2pELElBQU4sQ0FBWStDLGFBQVosRUFBNEJXLElBQTVCLEVBQWpCO0FBRUFELFVBQUFBLFFBQVEsQ0FBQ3pELElBQVQsQ0FBZSxhQUFmLEVBQStCdUIsSUFBL0IsQ0FBcUMsWUFBVztBQUMvQyxnQkFBTVUsS0FBSyxHQUFHekMsQ0FBQyxDQUFFLElBQUYsQ0FBZjtBQUNBLGdCQUFNa0MsSUFBSSxHQUFJTyxLQUFLLENBQUNaLElBQU4sQ0FBWSxXQUFaLENBQWQ7QUFDQSxnQkFBTXhCLEtBQUssR0FBR3NELE1BQU0sQ0FBRXpCLElBQUYsQ0FBcEI7QUFFQU8sWUFBQUEsS0FBSyxDQUFDeEIsR0FBTixDQUFXWixLQUFYOztBQUVBLGdCQUFLLGdCQUFnQjZCLElBQWhCLElBQXdCN0IsS0FBN0IsRUFBcUM7QUFDcEM0RCxjQUFBQSxRQUFRLENBQUN6RCxJQUFULENBQWUsNEJBQWYsRUFBOEMyRCxRQUE5QyxDQUF3RCxRQUF4RDtBQUNBRixjQUFBQSxRQUFRLENBQUN6RCxJQUFULENBQWUsS0FBZixFQUF1QnFCLElBQXZCLENBQTZCLEtBQTdCLEVBQW9DeEIsS0FBcEM7QUFDQTtBQUNELFdBWEQ7QUFZQSxTQTlCRDtBQWdDQW1ELFFBQUFBLE1BQU0sQ0FBQ1csUUFBUCxDQUFpQixhQUFqQjtBQUNBLE9BMUREO0FBNERBLFVBQU03RCxNQUFNLEdBQUdMLFlBQVksQ0FBQ08sSUFBYixDQUFtQixtQkFBbkIsQ0FBZjtBQUVBUCxNQUFBQSxZQUFZLENBQUNtRSxPQUFiLENBQXNCLGtCQUF0QixFQUEwQyxDQUFFOUQsTUFBRixDQUExQztBQUNBO0FBQ0Q7O0FBRUROLEVBQUFBLENBQUMsQ0FBRSxtQkFBRixDQUFELENBQXlCRSxFQUF6QixDQUE2QixRQUE3QixFQUF1Qyx3QkFBdkMsRUFBaUUsWUFBVztBQUMzRSxRQUFNdUMsS0FBSyxHQUFRekMsQ0FBQyxDQUFFLElBQUYsQ0FBcEI7O0FBQ0EsUUFBTXFFLFVBQVUsR0FBRzVCLEtBQUssQ0FBQ3hCLEdBQU4sRUFBbkI7O0FBQ0EsUUFBTXFELFNBQVMsR0FBSTdCLEtBQUssQ0FBQ1osSUFBTixDQUFZLGlCQUFaLENBQW5COztBQUVBLFFBQUssQ0FBRXdDLFVBQVAsRUFBb0I7QUFDbkI7QUFDQTs7QUFFRCxRQUFNekMsU0FBUyxHQUFHLHNCQUFzQnlDLFVBQXhDLENBVDJFLENBVzNFOztBQUNBLFFBQUssQ0FBRXhFLE1BQU0sQ0FBRSxXQUFXK0IsU0FBYixDQUFOLENBQStCdUIsTUFBdEMsRUFBK0M7QUFDOUM7QUFDQTs7QUFFRCxRQUFNUyxRQUFRLEdBQVdDLEVBQUUsQ0FBQ0QsUUFBSCxDQUFhaEMsU0FBYixDQUF6QjtBQUNBLFFBQU1tQyxRQUFRLEdBQVdILFFBQVEsRUFBakM7QUFDQSxRQUFNVyxnQkFBZ0IsR0FBR3RFLFlBQVksQ0FBQ08sSUFBYixDQUFtQixhQUFuQixDQUF6QjtBQUNBLFFBQU1nRSxnQkFBZ0IsR0FBR3ZFLFlBQVksQ0FBQ08sSUFBYixDQUFtQixvQkFBbkIsQ0FBekI7QUFDQSxRQUFNaUUsV0FBVyxHQUFReEUsWUFBWSxDQUFDTyxJQUFiLENBQW1CLFNBQW5CLENBQXpCO0FBRUFQLElBQUFBLFlBQVksQ0FBQ3lFLFdBQWIsQ0FBMEIsUUFBMUI7QUFFQUgsSUFBQUEsZ0JBQWdCLENBQUMxQyxJQUFqQixDQUF1QixpQkFBdkIsRUFBMEN3QyxVQUExQztBQUNBRyxJQUFBQSxnQkFBZ0IsQ0FBQ0csSUFBakIsQ0FBdUJMLFNBQXZCO0FBQ0FHLElBQUFBLFdBQVcsQ0FBQ0UsSUFBWixDQUFrQlosUUFBbEIsRUExQjJFLENBNEIzRTs7QUFDQSxRQUFLTSxVQUFVLElBQUkzQyxXQUFuQixFQUFpQztBQUNoQ2dCLE1BQUFBLGVBQWUsQ0FBRTJCLFVBQUYsQ0FBZjtBQUNBLEtBRkQsTUFFTztBQUNOMUMsTUFBQUEsZUFBZTtBQUNmOztBQUVEMUIsSUFBQUEsWUFBWSxDQUFDbUUsT0FBYixDQUFzQixhQUF0QjtBQUVBbkUsSUFBQUEsWUFBWSxDQUFDTyxJQUFiLENBQW1CLFFBQW5CLEVBQThCTixFQUE5QixDQUFrQyxRQUFsQyxFQUE0QyxZQUFXO0FBQ3RELFVBQU11QyxLQUFLLEdBQUd6QyxDQUFDLENBQUUsSUFBRixDQUFmO0FBRUFvQyxNQUFBQSxnQkFBZ0IsQ0FBRUssS0FBRixDQUFoQjtBQUNBLEtBSkQ7QUFLQSxHQTFDRDtBQTRDQSxDQTdORDs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBNUMsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVDLENBQVYsRUFBYztBQUV2QyxNQUFNNEUsUUFBUSxHQUFRNUUsQ0FBQyxDQUFFLFlBQUYsQ0FBdkI7QUFDQSxNQUFNNkUsU0FBUyxHQUFPN0UsQ0FBQyxDQUFFLDZCQUFGLENBQXZCO0FBQ0EsTUFBTThFLGFBQWEsR0FBRzlFLENBQUMsQ0FBRSx5QkFBRixDQUF2QjtBQUVBNkUsRUFBQUEsU0FBUyxDQUFDM0UsRUFBVixDQUFjLFFBQWQsRUFBd0IsWUFBVztBQUNsQyxRQUFNdUMsS0FBSyxHQUFHekMsQ0FBQyxDQUFFLElBQUYsQ0FBZjtBQUNBLFFBQU1LLEtBQUssR0FBR29DLEtBQUssQ0FBQ3hCLEdBQU4sRUFBZDs7QUFFQSxRQUFLWixLQUFMLEVBQWE7QUFDWnlFLE1BQUFBLGFBQWEsQ0FBQ25DLFVBQWQsQ0FBMEIsVUFBMUI7QUFDQSxLQUZELE1BRU87QUFDTm1DLE1BQUFBLGFBQWEsQ0FBQ2pELElBQWQsQ0FBb0IsVUFBcEIsRUFBZ0MsVUFBaEM7QUFDQTtBQUNELEdBVEQ7QUFXQTtBQUNEO0FBQ0E7O0FBQ0NpRCxFQUFBQSxhQUFhLENBQUM1RSxFQUFkLENBQWtCLE9BQWxCLEVBQTJCLFlBQVc7QUFDckMsUUFBTTZFLFNBQVMsR0FBR0YsU0FBUyxDQUFDckUsSUFBVixDQUFnQixpQkFBaEIsQ0FBbEI7QUFDQSxRQUFNd0UsUUFBUSxHQUFJRCxTQUFTLENBQUM5RCxHQUFWLEVBQWxCOztBQUVBLFFBQUssQ0FBRStELFFBQVEsQ0FBQzdCLE1BQWhCLEVBQXlCO0FBQ3hCO0FBQ0E7O0FBRUQsUUFBTThCLFdBQVcsR0FBR0YsU0FBUyxDQUFDbEQsSUFBVixDQUFnQixZQUFoQixDQUFwQjtBQUNBLFFBQU1xRCxTQUFTLEdBQUtILFNBQVMsQ0FBQ2xELElBQVYsQ0FBZ0IsaUJBQWhCLENBQXBCO0FBQ0EsUUFBTXNELFFBQVEsR0FBTUosU0FBUyxDQUFDbEQsSUFBVixDQUFnQixnQkFBaEIsQ0FBcEI7QUFFQSxRQUFNK0IsUUFBUSxHQUFHQyxFQUFFLENBQUNELFFBQUgsQ0FBYSx3QkFBYixDQUFqQjtBQUNBLFFBQU1HLFFBQVEsR0FBR0gsUUFBUSxDQUFFO0FBQUV3QixNQUFBQSxLQUFLLEVBQUVILFdBQVQ7QUFBc0JJLE1BQUFBLEVBQUUsRUFBRUwsUUFBMUI7QUFBb0NNLE1BQUFBLEdBQUcsRUFBRUosU0FBekM7QUFBb0RLLE1BQUFBLFNBQVMsRUFBRUo7QUFBL0QsS0FBRixDQUF6QjtBQUVBUCxJQUFBQSxRQUFRLENBQUNwRSxJQUFULENBQWUsb0JBQWYsRUFBc0NnRixPQUF0QyxDQUErQ3pCLFFBQS9DO0FBRUFjLElBQUFBLFNBQVMsQ0FBQ1ksSUFBVixDQUFnQixlQUFoQixFQUFpQyxDQUFqQztBQUNBWixJQUFBQSxTQUFTLENBQUNyRSxJQUFWLENBQWdCLG1CQUFtQndFLFFBQW5CLEdBQThCLElBQTlDLEVBQXFEbkQsSUFBckQsQ0FBMkQsVUFBM0QsRUFBdUUsVUFBdkU7QUFDQWdELElBQUFBLFNBQVMsQ0FBQ1QsT0FBVixDQUFtQixRQUFuQjtBQUNBLEdBcEJEO0FBc0JBO0FBQ0Q7QUFDQTs7QUFDQyxXQUFTc0IsUUFBVCxDQUFtQkMsVUFBbkIsRUFBZ0M7QUFDL0IsUUFBTUMsU0FBUyxHQUFHNUYsQ0FBQyxDQUFFMkYsVUFBRixDQUFuQjtBQUVBQyxJQUFBQSxTQUFTLENBQUNGLFFBQVYsQ0FDQztBQUNDRyxNQUFBQSxPQUFPLEVBQUUsR0FEVjtBQUVDQyxNQUFBQSxNQUFNLEVBQUUsS0FGVDtBQUdDQyxNQUFBQSxNQUFNLEVBQUUsTUFIVDtBQUlDQyxNQUFBQSxJQUFJLEVBQUUsR0FKUDtBQUtDQyxNQUFBQSxNQUFNLEVBQUUsYUFMVDtBQU1DQyxNQUFBQSxNQUFNLEVBQUUsc0JBTlQ7QUFPQ0MsTUFBQUEsS0FBSyxFQUFFLFNBUFI7QUFRQ0MsTUFBQUEsV0FBVyxFQUFFO0FBUmQsS0FERDtBQVlBOztBQUVEVixFQUFBQSxRQUFRLENBQUUsWUFBRixDQUFSO0FBRUE7QUFDRDtBQUNBOztBQUNDLFdBQVNXLFdBQVQsR0FBdUI7QUFDdEIsUUFBTUMsTUFBTSxHQUFLdEcsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVdUcsT0FBVixDQUFtQixTQUFuQixDQUFqQjtBQUNBLFFBQU12QixRQUFRLEdBQUdzQixNQUFNLENBQUM5RixJQUFQLENBQWEsWUFBYixFQUE0QlMsR0FBNUIsRUFBakI7QUFFQWpCLElBQUFBLENBQUMsQ0FBRXNHLE1BQUYsQ0FBRCxDQUFZRSxPQUFaLENBQ0MsTUFERCxFQUVDLFlBQVc7QUFDVjNCLE1BQUFBLFNBQVMsQ0FBQ3JFLElBQVYsQ0FBZ0IsbUJBQW1Cd0UsUUFBbkIsR0FBOEIsSUFBOUMsRUFBcURyQyxVQUFyRCxDQUFpRSxVQUFqRTtBQUNBMkQsTUFBQUEsTUFBTSxDQUFDRyxNQUFQO0FBQ0EsS0FMRjtBQU9BOztBQUVEN0IsRUFBQUEsUUFBUSxDQUFDMUUsRUFBVCxDQUFhLE9BQWIsRUFBc0Isd0JBQXRCLEVBQWdEbUcsV0FBaEQ7QUFFQSxDQWxGRDs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTSyxzQkFBVCxDQUFpQ3RELGVBQWpDLEVBQWtEdUQsZUFBbEQsRUFBbUV0RCxhQUFuRSxFQUEyRztBQUFBLE1BQXpCUyxpQkFBeUIsdUVBQUwsRUFBSztBQUMxRyxNQUFNOUQsQ0FBQyxHQUFHSCxNQUFWO0FBRUEsTUFBTUksWUFBWSxHQUFHRCxDQUFDLENBQUUsdUJBQUYsQ0FBdEI7QUFFQSxNQUFNNEcsZUFBZSxHQUFHLG1CQUF4QjtBQUNBLE1BQU10RCxjQUFjLEdBQUksd0JBQXhCO0FBQ0EsTUFBTUMsYUFBYSxHQUFLLFdBQXhCOztBQUVBLFdBQVNzRCxpQkFBVCxDQUE0QkMsU0FBNUIsRUFBd0M7QUFDdkNBLElBQUFBLFNBQVMsQ0FBQ3BCLFFBQVYsQ0FBb0I7QUFDbkJHLE1BQUFBLE9BQU8sRUFBRSxHQURVO0FBRW5CQyxNQUFBQSxNQUFNLEVBQUUsS0FGVztBQUduQkMsTUFBQUEsTUFBTSxFQUFFLE1BSFc7QUFJbkJDLE1BQUFBLElBQUksRUFBRSxHQUphO0FBS25CQyxNQUFBQSxNQUFNLEVBQUUsdUJBTFc7QUFNbkJHLE1BQUFBLFdBQVcsRUFBRSxvQkFOTTtBQU9uQlcsTUFBQUEsTUFBTSxFQUFFLGdCQUFVNUcsQ0FBVixFQUFjO0FBQ3JCLFlBQU1HLE1BQU0sR0FBR04sQ0FBQyxDQUFFRyxDQUFDLENBQUM2RyxNQUFKLENBQUQsQ0FBY1QsT0FBZCxDQUF1QixtQkFBdkIsQ0FBZjtBQUVBVSxRQUFBQSxvQkFBb0IsQ0FBRTNHLE1BQUYsQ0FBcEI7QUFDQTtBQVhrQixLQUFwQixFQVlJNEcsZ0JBWko7QUFhQTs7QUFFRCxNQUFNQyxtQkFBbUIsR0FBRy9ELGVBQWUsR0FBRyxHQUFsQixHQUF3QkUsY0FBcEQsQ0F6QjBHLENBMkIxRzs7QUFDQXVELEVBQUFBLGlCQUFpQixDQUFFNUcsWUFBWSxDQUFDTyxJQUFiLENBQW1CMkcsbUJBQW5CLENBQUYsQ0FBakIsQ0E1QjBHLENBOEIxRzs7QUFDQWxILEVBQUFBLFlBQVksQ0FBQ0MsRUFBYixDQUFpQixhQUFqQixFQUFnQyxZQUFXO0FBQzFDMkcsSUFBQUEsaUJBQWlCLENBQUU3RyxDQUFDLENBQUVDLFlBQVksQ0FBQ08sSUFBYixDQUFtQjJHLG1CQUFuQixDQUFGLENBQUgsQ0FBakI7QUFDQSxHQUZEOztBQUlBLFdBQVNGLG9CQUFULENBQStCM0csTUFBL0IsRUFBd0M7QUFDdkMsUUFBTThHLFlBQVksR0FBRzlHLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhbUcsZUFBYixDQUFyQjtBQUNBLFFBQU1sRCxLQUFLLEdBQVVuRCxNQUFNLENBQUNFLElBQVAsQ0FBYTJHLG1CQUFiLENBQXJCO0FBQ0EsUUFBTUUsS0FBSyxHQUFVLEVBQXJCO0FBRUE1RCxJQUFBQSxLQUFLLENBQUNqRCxJQUFOLENBQVksV0FBWixFQUEwQnVCLElBQTFCLENBQWdDLFVBQVUyQixDQUFWLEVBQWE0RCxLQUFiLEVBQXFCO0FBQ3BELFVBQU1DLEtBQUssR0FBR3ZILENBQUMsQ0FBRXNILEtBQUYsQ0FBZjtBQUNBLFVBQU1FLEdBQUcsR0FBSyxFQUFkO0FBRUFELE1BQUFBLEtBQUssQ0FBQy9HLElBQU4sQ0FBWSxhQUFaLEVBQTRCdUIsSUFBNUIsQ0FBa0MsVUFBVTBGLFVBQVYsRUFBc0JDLEtBQXRCLEVBQThCO0FBQy9ELFlBQU1wSCxNQUFNLEdBQUdOLENBQUMsQ0FBRTBILEtBQUYsQ0FBaEI7QUFDQSxZQUFNeEYsSUFBSSxHQUFLNUIsTUFBTSxDQUFDdUIsSUFBUCxDQUFhLFdBQWIsQ0FBZjtBQUVBMkYsUUFBQUEsR0FBRyxDQUFFdEYsSUFBRixDQUFILEdBQWM1QixNQUFNLENBQUNXLEdBQVAsRUFBZDtBQUNBLE9BTEQ7O0FBT0FvRyxNQUFBQSxLQUFLLENBQUNNLElBQU4sQ0FBWUgsR0FBWjtBQUNBLEtBWkQ7QUFjQSxRQUFNSSxTQUFTLEdBQUdDLGtCQUFrQixDQUFFN0UsSUFBSSxDQUFDOEUsU0FBTCxDQUFnQlQsS0FBaEIsQ0FBRixDQUFwQztBQUNBRCxJQUFBQSxZQUFZLENBQUNuRyxHQUFiLENBQWtCMkcsU0FBbEIsRUFBOEJ4RCxPQUE5QixDQUF1QyxRQUF2QztBQUNBOztBQUVELFdBQVMyRCxtQkFBVCxDQUE4QnpILE1BQTlCLEVBQXVDO0FBQ3RDLFFBQU0wSCxhQUFhLEdBQUcxSCxNQUFNLENBQUNFLElBQVAsQ0FBYTRDLGVBQWIsQ0FBdEI7QUFDQSxRQUFNNkUsU0FBUyxHQUFPM0gsTUFBTSxDQUFDRSxJQUFQLENBQWEyRyxtQkFBYixFQUFtQ2UsUUFBbkMsRUFBdEI7O0FBRUEsUUFBSyxJQUFJRCxTQUFTLENBQUM5RSxNQUFuQixFQUE0QjtBQUMzQjZFLE1BQUFBLGFBQWEsQ0FBQ3RELFdBQWQsQ0FBMkIsYUFBM0I7QUFDQTtBQUNELEdBakV5RyxDQW1FMUc7OztBQUNBLE1BQU15RCxtQkFBbUIsR0FBRy9FLGVBQWUsR0FBRyxpQkFBOUM7QUFFQW5ELEVBQUFBLFlBQVksQ0FBQ0MsRUFBYixDQUFpQixPQUFqQixFQUEwQmlJLG1CQUExQixFQUErQyxZQUFXO0FBQ3pELFFBQU1aLEtBQUssR0FBSXZILENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVXVHLE9BQVYsQ0FBbUJoRCxhQUFuQixDQUFmO0FBQ0EsUUFBTWpELE1BQU0sR0FBR2lILEtBQUssQ0FBQ2hCLE9BQU4sQ0FBZUssZUFBZixDQUFmO0FBRUFtQixJQUFBQSxtQkFBbUIsQ0FBRXpILE1BQUYsQ0FBbkI7QUFFQWlILElBQUFBLEtBQUssQ0FBQ2QsTUFBTjtBQUVBUSxJQUFBQSxvQkFBb0IsQ0FBRTNHLE1BQUYsQ0FBcEI7QUFDQSxHQVRELEVBdEUwRyxDQWlGMUc7O0FBQ0EsTUFBTThILHlCQUF5QixHQUFHaEYsZUFBZSxHQUFHLGlCQUFwRDtBQUVBbkQsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLE9BQWpCLEVBQTBCa0kseUJBQTFCLEVBQXFELFlBQVc7QUFDL0QsUUFBTTlILE1BQU0sR0FBR04sQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVdUcsT0FBVixDQUFtQkssZUFBbkIsQ0FBZjtBQUVBdEcsSUFBQUEsTUFBTSxDQUFDRSxJQUFQLENBQWEyRyxtQkFBYixFQUFtQ2tCLEtBQW5DO0FBRUFOLElBQUFBLG1CQUFtQixDQUFFekgsTUFBRixDQUFuQjtBQUNBMkcsSUFBQUEsb0JBQW9CLENBQUUzRyxNQUFGLENBQXBCO0FBQ0EsR0FQRCxFQXBGMEcsQ0E2RjFHOztBQUNBLE1BQU1nSSxzQkFBc0IsR0FBR2xGLGVBQWUsR0FBRyxjQUFqRDtBQUVBbkQsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLE9BQWpCLEVBQTBCb0ksc0JBQTFCLEVBQWtELFlBQVc7QUFDNUQ7QUFDQSxRQUFLLENBQUV6SSxNQUFNLENBQUUsV0FBV3dELGFBQWIsQ0FBTixDQUFtQ0YsTUFBMUMsRUFBbUQ7QUFDbEQ7QUFDQTs7QUFFRCxRQUFNN0MsTUFBTSxHQUFHTixDQUFDLENBQUUsSUFBRixDQUFELENBQVV1RyxPQUFWLENBQW1CSyxlQUFuQixDQUFmO0FBRUEsUUFBTWhELFFBQVEsR0FBR0MsRUFBRSxDQUFDRCxRQUFILENBQWFQLGFBQWIsQ0FBakI7QUFDQSxRQUFNVSxRQUFRLEdBQUdILFFBQVEsQ0FBRUUsaUJBQUYsQ0FBekI7QUFDQSxRQUFNTixNQUFNLEdBQUtsRCxNQUFNLENBQUNFLElBQVAsQ0FBYTRDLGVBQWIsQ0FBakI7QUFDQSxRQUFNSyxLQUFLLEdBQU1uRCxNQUFNLENBQUNFLElBQVAsQ0FBYTJHLG1CQUFiLENBQWpCO0FBRUExRCxJQUFBQSxLQUFLLENBQUNPLE1BQU4sQ0FBY0QsUUFBZDtBQUVBa0QsSUFBQUEsb0JBQW9CLENBQUUzRyxNQUFGLENBQXBCO0FBRUFMLElBQUFBLFlBQVksQ0FBQ21FLE9BQWIsQ0FBc0Isa0JBQXRCLEVBQTBDLENBQUU5RCxNQUFGLENBQTFDOztBQUVBLFFBQUssQ0FBRWtELE1BQU0sQ0FBQ2pCLFFBQVAsQ0FBaUIsYUFBakIsQ0FBUCxFQUEwQztBQUN6Q2lCLE1BQUFBLE1BQU0sQ0FBQ1csUUFBUCxDQUFpQixhQUFqQjtBQUNBO0FBQ0QsR0F0QkQsRUFoRzBHLENBd0gxRzs7QUFDQSxNQUFNb0Usb0JBQW9CLEdBQUdwQixtQkFBbUIsR0FBRyxxQkFBbkQ7QUFFQWxILEVBQUFBLFlBQVksQ0FBQ0MsRUFBYixDQUFpQixPQUFqQixFQUEwQnFJLG9CQUExQixFQUFnRCxZQUFXO0FBQzFELFFBQU1qSSxNQUFNLEdBQUdOLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVXVHLE9BQVYsQ0FBbUJLLGVBQW5CLENBQWY7QUFFQUssSUFBQUEsb0JBQW9CLENBQUUzRyxNQUFGLENBQXBCO0FBQ0EsR0FKRCxFQTNIMEcsQ0FpSTFHOztBQUNBLE1BQUlrSSxzQkFBc0IsR0FBR3JCLG1CQUFtQixHQUFHLFNBQW5EO0FBRUFsSCxFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUIsUUFBakIsRUFBMkJzSSxzQkFBM0IsRUFBbUQsWUFBVztBQUM3RCxRQUFNbEksTUFBTSxHQUFHTixDQUFDLENBQUUsSUFBRixDQUFELENBQVV1RyxPQUFWLENBQW1CSyxlQUFuQixDQUFmO0FBRUFLLElBQUFBLG9CQUFvQixDQUFFM0csTUFBRixDQUFwQjtBQUNBLEdBSkQsRUFwSTBHLENBMEkxRzs7QUFDQUwsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLHVCQUFqQixFQUEwQyxVQUFVQyxDQUFWLEVBQWFzSSxPQUFiLEVBQXNCbkksTUFBdEIsRUFBK0I7QUFDeEUsUUFBS21JLE9BQU8sS0FBS3JGLGVBQWpCLEVBQW1DO0FBQ2xDNkQsTUFBQUEsb0JBQW9CLENBQUUzRyxNQUFGLENBQXBCO0FBQ0E7QUFDRCxHQUpEO0FBTUE7OztBQ2hLRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFULE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixVQUFVQyxDQUFWLEVBQWM7QUFFdkM7QUFDRDtBQUNBO0FBQ0MsTUFBTTBJLGFBQWEsR0FBTzFJLENBQUMsQ0FBRSxpQkFBRixDQUEzQjtBQUNBLE1BQU0ySSxpQkFBaUIsR0FBRzNJLENBQUMsQ0FBRSwwQkFBRixDQUEzQjtBQUVBMkksRUFBQUEsaUJBQWlCLENBQUN6SSxFQUFsQixDQUFzQixPQUF0QixFQUErQixZQUFXO0FBQ3pDLFFBQU11QyxLQUFLLEdBQVF6QyxDQUFDLENBQUUsSUFBRixDQUFwQjtBQUNBLFFBQU0yRixVQUFVLEdBQUdsRCxLQUFLLENBQUNaLElBQU4sQ0FBWSxVQUFaLENBQW5CO0FBQ0EsUUFBTStHLFFBQVEsR0FBSzVJLENBQUMsQ0FBRSxVQUFVMkYsVUFBWixDQUFwQjtBQUVBZ0QsSUFBQUEsaUJBQWlCLENBQUNqRSxXQUFsQixDQUErQixnQkFBL0I7QUFDQWdFLElBQUFBLGFBQWEsQ0FBQzdHLElBQWQsQ0FBb0IsaUJBQXBCLEVBQXVDOEQsVUFBdkM7QUFDQWxELElBQUFBLEtBQUssQ0FBQzBCLFFBQU4sQ0FBZ0IsZ0JBQWhCO0FBRUFuRSxJQUFBQSxDQUFDLENBQUUsY0FBRixDQUFELENBQW9CYyxJQUFwQjtBQUNBOEgsSUFBQUEsUUFBUSxDQUFDL0gsSUFBVDtBQUNBLEdBWEQ7QUFhQTtBQUNEO0FBQ0E7O0FBQ0NiLEVBQUFBLENBQUMsQ0FBRSwwQkFBRixDQUFELENBQWdDRSxFQUFoQyxDQUFvQyxRQUFwQyxFQUE4QyxZQUFXO0FBQ3hELFFBQU0ySSxPQUFPLEdBQUc3SSxDQUFDLENBQUUseUJBQUYsQ0FBakI7O0FBRUEsUUFBS0EsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVWSxFQUFWLENBQWMsVUFBZCxDQUFMLEVBQWtDO0FBQ2pDaUksTUFBQUEsT0FBTyxDQUFDbkUsV0FBUixDQUFxQixVQUFyQjtBQUNBLEtBRkQsTUFFTztBQUNObUUsTUFBQUEsT0FBTyxDQUFDMUUsUUFBUixDQUFrQixVQUFsQjtBQUNBO0FBQ0QsR0FSRDtBQVVBLENBbENEOzs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUF0RSxNQUFNLENBQUVDLFFBQUYsQ0FBTixDQUFtQkMsS0FBbkIsQ0FBMEIsVUFBVUMsQ0FBVixFQUFjO0FBRXZDLE1BQU1DLFlBQVksR0FBR0QsQ0FBQyxDQUFFLHVCQUFGLENBQXRCO0FBRUE7QUFDRDtBQUNBOztBQUNDLFdBQVM4SSx5QkFBVCxDQUFvQ3pHLElBQXBDLEVBQTJDO0FBQzFDLFFBQU0vQixNQUFNLEdBQU8rQixJQUFJLENBQUNrRSxPQUFMLENBQWMsbUJBQWQsQ0FBbkI7QUFDQSxRQUFNd0MsVUFBVSxHQUFHekksTUFBTSxDQUFDRSxJQUFQLENBQWEsb0RBQWIsQ0FBbkI7O0FBRUEsUUFBSzZCLElBQUksQ0FBQ3pCLEVBQUwsQ0FBUyxVQUFULENBQUwsRUFBNkI7QUFDNUJtSSxNQUFBQSxVQUFVLENBQUNsSCxJQUFYLENBQWlCLFVBQWpCLEVBQTZCLFVBQTdCO0FBQ0EsS0FGRCxNQUVPO0FBQ05rSCxNQUFBQSxVQUFVLENBQUNwRyxVQUFYLENBQXVCLFVBQXZCO0FBQ0E7QUFDRDs7QUFFRDFDLEVBQUFBLFlBQVksQ0FBQ0MsRUFBYixDQUFpQixhQUFqQixFQUFnQyxZQUFXO0FBQzFDRCxJQUFBQSxZQUFZLENBQUNPLElBQWIsQ0FBbUIsb0VBQW5CLEVBQTBGdUIsSUFBMUYsQ0FBZ0csWUFBVztBQUMxRyxVQUFNVSxLQUFLLEdBQUd6QyxDQUFDLENBQUUsSUFBRixDQUFmO0FBRUE4SSxNQUFBQSx5QkFBeUIsQ0FBRXJHLEtBQUYsQ0FBekI7QUFDQSxLQUpEO0FBS0EsR0FORDtBQVFBeEMsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQ0MsT0FERCxFQUVDLG9FQUZELEVBR0MsWUFBVztBQUNWLFFBQU11QyxLQUFLLEdBQUd6QyxDQUFDLENBQUUsSUFBRixDQUFmO0FBRUE4SSxJQUFBQSx5QkFBeUIsQ0FBRXJHLEtBQUYsQ0FBekI7QUFDQSxHQVBGO0FBVUE7QUFDRDtBQUNBOztBQUNDLFdBQVN1Ryx5QkFBVCxDQUFvQzNHLElBQXBDLEVBQTJDO0FBQzFDLFFBQU0vQixNQUFNLEdBQU8rQixJQUFJLENBQUNrRSxPQUFMLENBQWMsbUJBQWQsQ0FBbkI7QUFDQSxRQUFNd0MsVUFBVSxHQUFHekksTUFBTSxDQUFDRSxJQUFQLENBQWEsb0RBQWIsQ0FBbkI7O0FBRUEsUUFBSzZCLElBQUksQ0FBQ3pCLEVBQUwsQ0FBUyxVQUFULENBQUwsRUFBNkI7QUFDNUJtSSxNQUFBQSxVQUFVLENBQUNsSCxJQUFYLENBQWlCLFVBQWpCLEVBQTZCLFVBQTdCO0FBQ0EsS0FGRCxNQUVPO0FBQ05rSCxNQUFBQSxVQUFVLENBQUNwRyxVQUFYLENBQXVCLFVBQXZCO0FBQ0E7QUFDRDs7QUFFRDFDLEVBQUFBLFlBQVksQ0FBQ0MsRUFBYixDQUFpQixhQUFqQixFQUFnQyxZQUFXO0FBQzFDRCxJQUFBQSxZQUFZLENBQUNPLElBQWIsQ0FBbUIsb0VBQW5CLEVBQTBGdUIsSUFBMUYsQ0FBZ0csWUFBVztBQUMxRyxVQUFNVSxLQUFLLEdBQUd6QyxDQUFDLENBQUUsSUFBRixDQUFmO0FBRUFnSixNQUFBQSx5QkFBeUIsQ0FBRXZHLEtBQUYsQ0FBekI7QUFDQSxLQUpEO0FBS0EsR0FORDtBQVFBeEMsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQ0MsT0FERCxFQUVDLG9FQUZELEVBR0MsWUFBVztBQUNWLFFBQU11QyxLQUFLLEdBQUd6QyxDQUFDLENBQUUsSUFBRixDQUFmO0FBRUFnSixJQUFBQSx5QkFBeUIsQ0FBRXZHLEtBQUYsQ0FBekI7QUFDQSxHQVBGO0FBVUEsQ0FwRUQ7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTVDLE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixVQUFVQyxDQUFWLEVBQWM7QUFFdkMsTUFBSyxDQUFFQSxDQUFDLENBQUUsTUFBRixDQUFELENBQVl1QyxRQUFaLENBQXNCLGtDQUF0QixDQUFQLEVBQW9FO0FBQ25FO0FBQ0EsR0FKc0MsQ0FNdkM7OztBQUNBdkMsRUFBQUEsQ0FBQyxDQUFFLHNCQUFGLENBQUQsQ0FBNEJpSixLQUE1QixDQUFtQyxVQUFVOUksQ0FBVixFQUFjO0FBQ2hEQSxJQUFBQSxDQUFDLENBQUMrSSxjQUFGO0FBRUEsUUFBTUMsT0FBTyxHQUFNbkosQ0FBQyxDQUFFLElBQUYsQ0FBcEI7QUFDQSxRQUFNb0osUUFBUSxHQUFLRCxPQUFPLENBQUM1QyxPQUFSLENBQWlCLGVBQWpCLENBQW5CO0FBQ0EsUUFBTThDLFVBQVUsR0FBR0YsT0FBTyxDQUFDdEgsSUFBUixDQUFjLGtCQUFkLENBQW5CO0FBRUEsUUFBTXlILEtBQUssR0FBR3pGLEVBQUUsQ0FBQzBGLEtBQUgsQ0FBVTtBQUFFbkUsTUFBQUEsS0FBSyxFQUFFaUUsVUFBVDtBQUFxQkcsTUFBQUEsUUFBUSxFQUFFO0FBQS9CLEtBQVYsRUFDWkMsSUFEWSxHQUVadkosRUFGWSxDQUVSLFFBRlEsRUFFRSxZQUFXO0FBQ3pCLFVBQU13SixhQUFhLEdBQUdKLEtBQUssQ0FBQ0ssS0FBTixHQUFjQyxHQUFkLENBQW1CLFdBQW5CLEVBQWlDQyxLQUFqQyxFQUF0QjtBQUNBLFVBQU1DLFNBQVMsR0FBT0osYUFBYSxDQUFDSyxNQUFkLEVBQXRCO0FBRUEsVUFBUUMsU0FBUixHQUFzQkYsU0FBUyxDQUFDRyxLQUFoQyxDQUFRRCxTQUFSO0FBQ0EsVUFBSUUsUUFBSjs7QUFFQSxVQUFLRixTQUFMLEVBQWlCO0FBQ2hCRSxRQUFBQSxRQUFRLEdBQUdKLFNBQVMsQ0FBQ0csS0FBVixDQUFnQkQsU0FBaEIsQ0FBMEJHLEdBQXJDO0FBQ0EsT0FGRCxNQUVPO0FBQ05ELFFBQUFBLFFBQVEsR0FBR0osU0FBUyxDQUFDSyxHQUFyQjtBQUNBOztBQUVEZixNQUFBQSxRQUFRLENBQUM1SSxJQUFULENBQWUsV0FBZixFQUE2QlMsR0FBN0IsQ0FBa0M2SSxTQUFTLENBQUN6RSxFQUE1QztBQUNBK0QsTUFBQUEsUUFBUSxDQUFDNUksSUFBVCxDQUFlLFlBQWYsRUFBOEJxQixJQUE5QixDQUFvQyxLQUFwQyxFQUEyQ3FJLFFBQTNDO0FBQ0FkLE1BQUFBLFFBQVEsQ0FBQzFFLFdBQVQsQ0FBc0IsVUFBdEI7QUFDQSxLQWxCWSxDQUFkO0FBbUJBLEdBMUJEO0FBNEJBMUUsRUFBQUEsQ0FBQyxDQUFFLHNCQUFGLENBQUQsQ0FBNEJFLEVBQTVCLENBQWdDLE9BQWhDLEVBQXlDLFVBQVVDLENBQVYsRUFBYztBQUN0REEsSUFBQUEsQ0FBQyxDQUFDK0ksY0FBRjtBQUVBLFFBQU1DLE9BQU8sR0FBSW5KLENBQUMsQ0FBRSxJQUFGLENBQWxCO0FBQ0EsUUFBTW9KLFFBQVEsR0FBR0QsT0FBTyxDQUFDNUMsT0FBUixDQUFpQixlQUFqQixDQUFqQjtBQUVBNkMsSUFBQUEsUUFBUSxDQUFDNUksSUFBVCxDQUFlLFdBQWYsRUFBNkJTLEdBQTdCLENBQWtDLEVBQWxDO0FBQ0FtSSxJQUFBQSxRQUFRLENBQUM1SSxJQUFULENBQWUsWUFBZixFQUE4QnFCLElBQTlCLENBQW9DLEtBQXBDLEVBQTJDLEVBQTNDO0FBQ0F1SCxJQUFBQSxRQUFRLENBQUNqRixRQUFULENBQW1CLFVBQW5CO0FBQ0EsR0FURCxFQW5DdUMsQ0E4Q3ZDOztBQUNBLFdBQVNpRyxrQkFBVCxDQUE2Qi9KLEtBQTdCLEVBQXFDO0FBQ3BDLFFBQU15RyxTQUFTLEdBQUc5RyxDQUFDLENBQUUsK0JBQUYsQ0FBbkI7O0FBRUEsUUFBS0ssS0FBTCxFQUFhO0FBQ1p5RyxNQUFBQSxTQUFTLENBQUNqRyxJQUFWO0FBQ0EsS0FGRCxNQUVPO0FBQ05pRyxNQUFBQSxTQUFTLENBQUNoRyxJQUFWO0FBQ0E7QUFDRDs7QUFFRCxNQUFNdUoscUJBQXFCLEdBQUdySyxDQUFDLENBQUUsb0JBQUYsQ0FBL0I7QUFFQSxNQUFJc0ssb0JBQW9CLEdBQUcsS0FBM0I7O0FBRUEsTUFBS0QscUJBQXFCLENBQUN6SixFQUF0QixDQUEwQixVQUExQixDQUFMLEVBQThDO0FBQzdDMEosSUFBQUEsb0JBQW9CLEdBQUcsSUFBdkI7QUFDQTs7QUFFREYsRUFBQUEsa0JBQWtCLENBQUVFLG9CQUFGLENBQWxCO0FBRUFELEVBQUFBLHFCQUFxQixDQUFDbkssRUFBdEIsQ0FBMEIsUUFBMUIsRUFBb0MsWUFBVztBQUM5QyxRQUFJcUsscUJBQXFCLEdBQUcsS0FBNUI7O0FBRUEsUUFBS3ZLLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVVksRUFBVixDQUFjLFVBQWQsQ0FBTCxFQUFrQztBQUNqQzJKLE1BQUFBLHFCQUFxQixHQUFHLElBQXhCO0FBQ0E7O0FBRURILElBQUFBLGtCQUFrQixDQUFFRyxxQkFBRixDQUFsQjtBQUNBLEdBUkQsRUFuRXVDLENBNkV2Qzs7QUFDQSxXQUFTQyxnQkFBVCxDQUEyQm5LLEtBQTNCLEVBQW1DO0FBQ2xDLFFBQU15RyxTQUFTLEdBQUc5RyxDQUFDLENBQUUsc0NBQUYsQ0FBbkI7O0FBRUEsUUFBS0ssS0FBTCxFQUFhO0FBQ1p5RyxNQUFBQSxTQUFTLENBQUNqRyxJQUFWO0FBQ0EsS0FGRCxNQUVPO0FBQ05pRyxNQUFBQSxTQUFTLENBQUNoRyxJQUFWO0FBQ0E7QUFDRDs7QUFFRCxNQUFNMkosaUJBQWlCLEdBQUd6SyxDQUFDLENBQUUsNkJBQUYsQ0FBM0I7QUFFQSxNQUFJMEssc0JBQXNCLEdBQUcsS0FBN0I7O0FBRUEsTUFBS0QsaUJBQWlCLENBQUM3SixFQUFsQixDQUFzQixVQUF0QixDQUFMLEVBQTBDO0FBQ3pDOEosSUFBQUEsc0JBQXNCLEdBQUcsSUFBekI7QUFDQTs7QUFFREYsRUFBQUEsZ0JBQWdCLENBQUVFLHNCQUFGLENBQWhCO0FBRUFELEVBQUFBLGlCQUFpQixDQUFDdkssRUFBbEIsQ0FBc0IsUUFBdEIsRUFBZ0MsWUFBVztBQUMxQyxRQUFJeUssaUJBQWlCLEdBQUcsS0FBeEI7O0FBRUEsUUFBSzNLLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVVksRUFBVixDQUFjLFVBQWQsQ0FBTCxFQUFrQztBQUNqQytKLE1BQUFBLGlCQUFpQixHQUFHLElBQXBCO0FBQ0E7O0FBRURILElBQUFBLGdCQUFnQixDQUFFRyxpQkFBRixDQUFoQjtBQUNBLEdBUkQsRUFsR3VDLENBNEd2Qzs7QUFDQSxXQUFTQyxZQUFULENBQXVCdkssS0FBdkIsRUFBK0I7QUFDOUIsUUFBTXdLLGVBQWUsR0FBRyxxQ0FDdkIsc0NBRHVCLEdBRXZCLHNDQUZEOztBQUlBLFFBQUssV0FBV3hLLEtBQWhCLEVBQXdCO0FBQ3ZCTCxNQUFBQSxDQUFDLENBQUU2SyxlQUFGLENBQUQsQ0FBcUIvSixJQUFyQjtBQUNBLEtBRkQsTUFFTyxJQUFLLGNBQWNULEtBQW5CLEVBQTJCO0FBQ2pDTCxNQUFBQSxDQUFDLENBQUUsdUVBQUYsQ0FBRCxDQUE2RWEsSUFBN0U7QUFDQWIsTUFBQUEsQ0FBQyxDQUFFLHFDQUFGLENBQUQsQ0FBMkNjLElBQTNDO0FBQ0EsS0FITSxNQUdBLElBQUssYUFBYVQsS0FBbEIsRUFBMEI7QUFDaENMLE1BQUFBLENBQUMsQ0FBRSx1RUFBRixDQUFELENBQTZFYSxJQUE3RTtBQUNBYixNQUFBQSxDQUFDLENBQUUscUNBQUYsQ0FBRCxDQUEyQ2EsSUFBM0M7QUFDQSxLQUhNLE1BR0E7QUFDTmIsTUFBQUEsQ0FBQyxDQUFFNkssZUFBRixDQUFELENBQXFCaEssSUFBckI7QUFDQTtBQUNEOztBQUVELE1BQU1pSyxhQUFhLEdBQUc5SyxDQUFDLENBQUUsZ0JBQUYsQ0FBdkI7QUFFQTRLLEVBQUFBLFlBQVksQ0FBRUUsYUFBYSxDQUFDN0osR0FBZCxFQUFGLENBQVo7QUFFQTZKLEVBQUFBLGFBQWEsQ0FBQzVLLEVBQWQsQ0FBa0IsUUFBbEIsRUFBNEIsWUFBVztBQUN0QyxRQUFNRyxLQUFLLEdBQUdMLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVWlCLEdBQVYsRUFBZDtBQUVBMkosSUFBQUEsWUFBWSxDQUFFdkssS0FBRixDQUFaO0FBQ0EsR0FKRDtBQU1BLENBeklEOzs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFSLE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixZQUFXO0FBRXBDLE1BQU1xRCxlQUFlLEdBQUcsK0JBQXhCO0FBQ0EsTUFBTXVELGVBQWUsR0FBRyxvREFBeEI7QUFDQSxNQUFNdEQsYUFBYSxHQUFLLDZCQUF4QjtBQUVBcUQsRUFBQUEsc0JBQXNCLENBQUV0RCxlQUFGLEVBQW1CdUQsZUFBbkIsRUFBb0N0RCxhQUFwQyxDQUF0QjtBQUVBLENBUkQ7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUF4RCxNQUFNLENBQUVDLFFBQUYsQ0FBTixDQUFtQkMsS0FBbkIsQ0FBMEIsVUFBVUMsQ0FBVixFQUFjO0FBRXZDLE1BQU1DLFlBQVksR0FBR0QsQ0FBQyxDQUFFLHVCQUFGLENBQXRCO0FBRUEsTUFBTStLLGFBQWEsR0FBRyxDQUNyQjtBQUNDLGVBQVcseUNBRFo7QUFFQyxtQkFBZSxRQUZoQjtBQUdDLGFBQVMsUUFIVjtBQUlDLGlCQUFhLENBQ1o7QUFDQyxrQkFBWSx5QkFEYjtBQUVDLGVBQVMsQ0FBRSxNQUFGO0FBRlYsS0FEWSxFQUtaO0FBQ0Msa0JBQVksMkJBRGI7QUFFQyxlQUFTLENBQUUsUUFBRjtBQUZWLEtBTFksRUFTWjtBQUNDLGtCQUFZLHlCQURiO0FBRUMsZUFBUyxDQUFFLE1BQUY7QUFGVixLQVRZLEVBYVo7QUFDQyxrQkFBWSx1QkFEYjtBQUVDLGVBQVMsQ0FBRSxRQUFGO0FBRlYsS0FiWTtBQUpkLEdBRHFCLEVBd0JyQjtBQUNDLGVBQVcsMkNBRFo7QUFFQyxtQkFBZSxRQUZoQjtBQUdDLGFBQVMsUUFIVjtBQUlDLGlCQUFhLENBQ1o7QUFDQyxrQkFBWSxrQ0FEYjtBQUVDLGVBQVMsQ0FBRSxVQUFGLEVBQWMsY0FBZDtBQUZWLEtBRFksRUFLWjtBQUNDLGtCQUFZLHVDQURiO0FBRUMsZUFBUyxDQUFFLE9BQUYsRUFBVyxRQUFYO0FBRlYsS0FMWSxFQVNaO0FBQ0Msa0JBQVksa0NBRGI7QUFFQyxlQUFTLENBQUUsUUFBRixFQUFZLGNBQVo7QUFGVixLQVRZLEVBYVo7QUFDQyxrQkFBWSwyQ0FEYjtBQUVDLGVBQVMsQ0FBRSxPQUFGO0FBRlYsS0FiWSxFQWlCWjtBQUNDLGtCQUFZLDhDQURiO0FBRUMsZUFBUyxDQUFFLE9BQUYsRUFBVyxPQUFYLEVBQW9CLE9BQXBCO0FBRlYsS0FqQlksRUFxQlo7QUFDQyxrQkFBWSxpQ0FEYjtBQUVDLGVBQVMsQ0FBRSxPQUFGLEVBQVcsT0FBWDtBQUZWLEtBckJZO0FBSmQsR0F4QnFCLEVBdURyQjtBQUNDLGVBQVcsd0NBRFo7QUFFQyxtQkFBZSxVQUZoQjtBQUdDLGFBQVMsUUFIVjtBQUlDLGlCQUFhLENBQ1o7QUFDQyxrQkFBWSxpREFEYjtBQUVDLGVBQVMsQ0FBRSxHQUFGO0FBRlYsS0FEWTtBQUpkLEdBdkRxQixFQWtFckI7QUFDQyxlQUFXLDBDQURaO0FBRUMsbUJBQWUsVUFGaEI7QUFHQyxhQUFTO0FBSFYsR0FsRXFCLEVBdUVyQjtBQUNDLGVBQVcsMkNBRFo7QUFFQyxtQkFBZSxVQUZoQjtBQUdDLGFBQVMsUUFIVjtBQUlDLGlCQUFhLENBQ1o7QUFDQyxrQkFBWSw0Q0FEYjtBQUVDLGVBQVMsQ0FBRSxHQUFGO0FBRlYsS0FEWTtBQUpkLEdBdkVxQixFQWtGckI7QUFDQyxlQUFXLHlDQURaO0FBRUMsbUJBQWUsT0FGaEI7QUFHQyxhQUFTLFFBSFY7QUFJQyxpQkFBYSxDQUNaO0FBQ0Msa0JBQVksdUNBRGI7QUFFQyxlQUFTLENBQUUsY0FBRjtBQUZWLEtBRFk7QUFKZCxHQWxGcUIsRUE2RnJCO0FBQ0MsZUFBVyxrREFEWjtBQUVDLG1CQUFlLFFBRmhCO0FBR0MsYUFBUyxRQUhWO0FBSUMsaUJBQWEsQ0FDWjtBQUNDLGtCQUFZLDZEQURiO0FBRUMsZUFBUyxDQUFFLGNBQUY7QUFGVixLQURZLEVBS1o7QUFDQyxrQkFBWSwrQ0FEYjtBQUVDLGVBQVMsQ0FBRSxjQUFGO0FBRlYsS0FMWSxFQVNaO0FBQ0Msa0JBQVksK0NBRGI7QUFFQyxlQUFTLENBQUUsZ0JBQUYsRUFBb0IsbUJBQXBCO0FBRlYsS0FUWSxFQWFaO0FBQ0Msa0JBQVksMkRBRGI7QUFFQyxlQUFTLENBQUUsYUFBRixFQUFpQixjQUFqQjtBQUZWLEtBYlksRUFpQlo7QUFDQyxrQkFBWSwrQ0FEYjtBQUVDLGVBQVMsQ0FBRSxjQUFGLEVBQWtCLG1CQUFsQjtBQUZWLEtBakJZLEVBcUJaO0FBQ0Msa0JBQVksMkRBRGI7QUFFQyxlQUFTLENBQUUsYUFBRjtBQUZWLEtBckJZLEVBeUJaO0FBQ0Msa0JBQVksK0NBRGI7QUFFQyxlQUFTLENBQUUsZ0JBQUYsRUFBb0IsYUFBcEIsRUFBbUMsY0FBbkMsRUFBbUQsbUJBQW5ELEVBQXdFLGFBQXhFO0FBRlYsS0F6QlksRUE2Qlo7QUFDQyxrQkFBWSwrQ0FEYjtBQUVDLGVBQVMsQ0FBRSxnQkFBRixFQUFvQixhQUFwQixFQUFtQyxjQUFuQyxFQUFtRCxtQkFBbkQsRUFBd0UsYUFBeEU7QUFGVixLQTdCWSxFQWlDWjtBQUNDLGtCQUFZLHdCQURiO0FBRUMsZUFBUyxDQUFFLGNBQUYsRUFBa0IsZ0JBQWxCLEVBQW9DLGFBQXBDLEVBQW1ELGNBQW5ELEVBQW1FLG1CQUFuRSxFQUF3RixhQUF4RjtBQUZWLEtBakNZO0FBSmQsR0E3RnFCLEVBd0lyQjtBQUNDLGVBQVcscURBRFo7QUFFQyxtQkFBZSxVQUZoQjtBQUdDLGFBQVMsUUFIVjtBQUlDLGlCQUFhLENBQ1o7QUFDQyxrQkFBWSw4REFEYjtBQUVDLGVBQVMsQ0FBRSxHQUFGO0FBRlYsS0FEWTtBQUpkLEdBeElxQixFQW1KckI7QUFDQyxlQUFXLGdEQURaO0FBRUMsbUJBQWUsT0FGaEI7QUFHQyxhQUFTLFFBSFY7QUFJQyxpQkFBYSxDQUNaO0FBQ0Msa0JBQVksMkJBRGI7QUFFQyxlQUFTLENBQUUsZUFBRjtBQUZWLEtBRFksRUFLWjtBQUNDLGtCQUFZLDhCQURiO0FBRUMsZUFBUyxDQUFFLGNBQUY7QUFGVixLQUxZO0FBSmQsR0FuSnFCLEVBa0tyQjtBQUNDLGVBQVcsZ0RBRFo7QUFFQyxtQkFBZSxRQUZoQjtBQUdDLGFBQVMsUUFIVjtBQUlDLGlCQUFhLENBQ1o7QUFDQyxrQkFBWSxxQkFEYjtBQUVDLGVBQVMsQ0FBRSxrQkFBRjtBQUZWLEtBRFksRUFLWjtBQUNDLGtCQUFZLG1DQURiO0FBRUMsZUFBUyxDQUFFLFlBQUYsRUFBZ0Isa0JBQWhCO0FBRlYsS0FMWSxFQVNaO0FBQ0Msa0JBQVksK0NBRGI7QUFFQyxlQUFTLENBQUUsa0JBQUY7QUFGVixLQVRZLEVBYVo7QUFDQyxrQkFBWSxxQkFEYjtBQUVDLGVBQVMsQ0FBRSxZQUFGLEVBQWdCLGtCQUFoQjtBQUZWLEtBYlksRUFpQlo7QUFDQyxrQkFBWSw4Q0FEYjtBQUVDLGVBQVMsQ0FBRSxzQkFBRixFQUEwQix5QkFBMUI7QUFGVixLQWpCWSxFQXFCWjtBQUNDLGtCQUFZLDBEQURiO0FBRUMsZUFBUyxDQUFFLG1CQUFGLEVBQXVCLG9CQUF2QjtBQUZWLEtBckJZLEVBeUJaO0FBQ0Msa0JBQVksOENBRGI7QUFFQyxlQUFTLENBQUUsb0JBQUYsRUFBd0IseUJBQXhCO0FBRlYsS0F6QlksRUE2Qlo7QUFDQyxrQkFBWSwwREFEYjtBQUVDLGVBQVMsQ0FBRSxtQkFBRjtBQUZWLEtBN0JZLEVBaUNaO0FBQ0Msa0JBQVksOENBRGI7QUFFQyxlQUFTLENBQUUsc0JBQUYsRUFBMEIsbUJBQTFCLEVBQStDLG9CQUEvQyxFQUFxRSx5QkFBckUsRUFBZ0csbUJBQWhHO0FBRlYsS0FqQ1ksRUFxQ1o7QUFDQyxrQkFBWSw4Q0FEYjtBQUVDLGVBQVMsQ0FBRSxzQkFBRixFQUEwQixtQkFBMUIsRUFBK0Msb0JBQS9DLEVBQXFFLHlCQUFyRSxFQUFnRyxtQkFBaEc7QUFGVixLQXJDWTtBQUpkLEdBbEtxQixFQWlOckI7QUFDQyxlQUFXLG9EQURaO0FBRUMsbUJBQWUsVUFGaEI7QUFHQyxhQUFTLFFBSFY7QUFJQyxpQkFBYSxDQUNaO0FBQ0Msa0JBQVksNkRBRGI7QUFFQyxlQUFTLENBQUUsR0FBRjtBQUZWLEtBRFk7QUFKZCxHQWpOcUIsRUE0TnJCO0FBQ0MsZUFBVywrQ0FEWjtBQUVDLG1CQUFlLFVBRmhCO0FBR0MsYUFBUyxRQUhWO0FBSUMsaUJBQWEsQ0FDWjtBQUNDLGtCQUFZLGtDQURiO0FBRUMsZUFBUyxDQUFFLEdBQUY7QUFGVixLQURZO0FBSmQsR0E1TnFCLEVBdU9yQjtBQUNDLGVBQVcsdUNBRFo7QUFFQyxtQkFBZSxRQUZoQjtBQUdDLGFBQVM7QUFIVixHQXZPcUIsRUE0T3JCO0FBQ0MsZUFBVyw4Q0FEWjtBQUVDLG1CQUFlLFFBRmhCO0FBR0MsYUFBUztBQUhWLEdBNU9xQixFQWlQckI7QUFDQyxlQUFXLHVDQURaO0FBRUMsbUJBQWUsUUFGaEI7QUFHQyxhQUFTO0FBSFYsR0FqUHFCLEVBc1ByQjtBQUNDLGVBQVcsNENBRFo7QUFFQyxtQkFBZSxRQUZoQjtBQUdDLGFBQVM7QUFIVixHQXRQcUIsRUEyUHJCO0FBQ0MsZUFBVyw0Q0FEWjtBQUVDLG1CQUFlLFFBRmhCO0FBR0MsYUFBUyxRQUhWO0FBSUMsaUJBQWEsQ0FDWjtBQUNDLGtCQUFZLG1DQURiO0FBRUMsZUFBUyxDQUFFLE9BQUY7QUFGVixLQURZLEVBS1o7QUFDQyxrQkFBWSwwQ0FEYjtBQUVDLGVBQVMsQ0FBRSxTQUFGO0FBRlYsS0FMWSxFQVNaO0FBQ0Msa0JBQVkseUNBRGI7QUFFQyxlQUFTLENBQUUsU0FBRjtBQUZWLEtBVFk7QUFKZCxHQTNQcUIsRUE4UXJCO0FBQ0MsZUFBVyw4Q0FEWjtBQUVDLG1CQUFlLFVBRmhCO0FBR0MsYUFBUyxRQUhWO0FBSUMsaUJBQWEsQ0FDWjtBQUNDLGtCQUFZLCtDQURiO0FBRUMsZUFBUyxDQUFFLEdBQUY7QUFGVixLQURZO0FBSmQsR0E5UXFCLEVBeVJyQjtBQUNDLGVBQVcsb0RBRFo7QUFFQyxtQkFBZSxVQUZoQjtBQUdDLGFBQVM7QUFIVixHQXpScUIsRUE4UnJCO0FBQ0MsZUFBVyxpREFEWjtBQUVDLG1CQUFlLFVBRmhCO0FBR0MsYUFBUztBQUhWLEdBOVJxQixFQW1TckI7QUFDQyxlQUFXLGlFQURaO0FBRUMsbUJBQWUsVUFGaEI7QUFHQyxhQUFTO0FBSFYsR0FuU3FCLEVBd1NyQjtBQUNDLGVBQVcsZ0VBRFo7QUFFQyxtQkFBZSxVQUZoQjtBQUdDLGFBQVM7QUFIVixHQXhTcUIsRUE2U3JCO0FBQ0MsZUFBVyxxREFEWjtBQUVDLG1CQUFlLFVBRmhCO0FBR0MsYUFBUyxRQUhWO0FBSUMsaUJBQWEsQ0FDWjtBQUNDLGtCQUFZLGdDQURiO0FBRUMsZUFBUyxDQUFFLEdBQUY7QUFGVixLQURZO0FBSmQsR0E3U3FCLEVBd1RyQjtBQUNDLGVBQVcsMkNBRFo7QUFFQyxtQkFBZSxVQUZoQjtBQUdDLGFBQVMsUUFIVjtBQUlDLGlCQUFhLENBQ1o7QUFDQyxrQkFBWSw0Q0FEYjtBQUVDLGVBQVMsQ0FBRSxHQUFGO0FBRlYsS0FEWTtBQUpkLEdBeFRxQixFQW1VckI7QUFDQyxlQUFXLHdDQURaO0FBRUMsbUJBQWUsVUFGaEI7QUFHQyxhQUFTLFFBSFY7QUFJQyxpQkFBYSxDQUNaO0FBQ0Msa0JBQVksc0RBRGI7QUFFQyxlQUFTLENBQUUsR0FBRjtBQUZWLEtBRFk7QUFKZCxHQW5VcUIsRUE4VXJCO0FBQ0MsZUFBVyw2Q0FEWjtBQUVDLG1CQUFlLFFBRmhCO0FBR0MsYUFBUztBQUhWLEdBOVVxQixFQW1WckI7QUFDQyxlQUFXLG1EQURaO0FBRUMsbUJBQWUsT0FGaEI7QUFHQyxhQUFTLFFBSFY7QUFJQyxpQkFBYSxDQUNaO0FBQ0Msa0JBQVksa0NBRGI7QUFFQyxlQUFTLENBQUUsUUFBRjtBQUZWLEtBRFksRUFLWjtBQUNDLGtCQUFZLG9DQURiO0FBRUMsZUFBUyxDQUFFLFVBQUY7QUFGVixLQUxZO0FBSmQsR0FuVnFCLEVBa1dyQjtBQUNDLGVBQVcsbUVBRFo7QUFFQyxtQkFBZSxVQUZoQjtBQUdDLGFBQVMsUUFIVjtBQUlDLGlCQUFhLENBQ1o7QUFDQyxrQkFBWSxzREFEYjtBQUVDLGVBQVMsQ0FBRSxHQUFGO0FBRlYsS0FEWTtBQUpkLEdBbFdxQixFQTZXckI7QUFDQyxlQUFXLDRDQURaO0FBRUMsbUJBQWUsVUFGaEI7QUFHQyxhQUFTLFFBSFY7QUFJQyxpQkFBYSxDQUNaO0FBQ0Msa0JBQVksNkNBRGI7QUFFQyxlQUFTLENBQUUsR0FBRjtBQUZWLEtBRFksRUFLWjtBQUNDLGtCQUFZLHdDQURiO0FBRUMsZUFBUyxDQUFFLEdBQUY7QUFGVixLQUxZO0FBSmQsR0E3V3FCLENBQXRCOztBQThYQSxXQUFTQyxvQkFBVCxDQUErQkMsSUFBL0IsRUFBcUNDLGVBQXJDLEVBQXNEN0ssS0FBdEQsRUFBOEQ7QUFDN0QsUUFBTUMsTUFBTSxHQUFRNEssZUFBZSxDQUFDM0UsT0FBaEIsQ0FBeUIsbUJBQXpCLENBQXBCO0FBQ0EsUUFBTW5HLE9BQU8sR0FBTzZLLElBQUksQ0FBRSxTQUFGLENBQXhCO0FBQ0EsUUFBTUUsV0FBVyxHQUFHRixJQUFJLENBQUUsYUFBRixDQUF4QjtBQUNBLFFBQU1HLFNBQVMsR0FBS0gsSUFBSSxDQUFFLFdBQUYsQ0FBeEI7QUFFQSxRQUFJSSxNQUFNLEdBQUdoTCxLQUFiOztBQUVBLFFBQUssZUFBZThLLFdBQXBCLEVBQWtDO0FBQ2pDRSxNQUFBQSxNQUFNLEdBQUdILGVBQWUsQ0FBQ3RLLEVBQWhCLENBQW9CLFVBQXBCLElBQW1DLEdBQW5DLEdBQXlDLEdBQWxEO0FBQ0E7O0FBRUQsUUFBSyxZQUFZdUssV0FBakIsRUFBK0I7QUFDOUJFLE1BQUFBLE1BQU0sR0FBRy9LLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhSixPQUFPLEdBQUcsVUFBdkIsRUFBb0NhLEdBQXBDLEVBQVQ7QUFDQTs7QUFFRGpCLElBQUFBLENBQUMsQ0FBQytCLElBQUYsQ0FBUXFKLFNBQVIsRUFBbUIsVUFBVS9GLEVBQVYsRUFBY2lHLENBQWQsRUFBa0I7QUFDcEMsVUFBTXhFLFNBQVMsR0FBS3hHLE1BQU0sQ0FBQ0UsSUFBUCxDQUFhOEssQ0FBQyxDQUFFLFVBQUYsQ0FBZCxDQUFwQjtBQUNBLFVBQU1DLFdBQVcsR0FBR0QsQ0FBQyxDQUFFLE9BQUYsQ0FBckI7O0FBRUEsVUFBS0MsV0FBVyxDQUFDN0ssUUFBWixDQUFzQjJLLE1BQXRCLENBQUwsRUFBc0M7QUFDckN2RSxRQUFBQSxTQUFTLENBQUNqRyxJQUFWO0FBQ0EsT0FGRCxNQUVPO0FBQ05pRyxRQUFBQSxTQUFTLENBQUNoRyxJQUFWO0FBQ0E7QUFDRCxLQVREO0FBV0FiLElBQUFBLFlBQVksQ0FBQ21FLE9BQWIsQ0FBc0Isc0JBQXRCLEVBQThDLENBQUVoRSxPQUFGLEVBQVdpTCxNQUFYLEVBQW1CL0ssTUFBbkIsQ0FBOUM7QUFDQTs7QUFFRCxXQUFTa0wsbUJBQVQsQ0FBOEJQLElBQTlCLEVBQW9DQyxlQUFwQyxFQUFxRDdLLEtBQXJELEVBQTZEO0FBQzVELFFBQUssU0FBUzZLLGVBQWQsRUFBZ0M7QUFDL0IsVUFBTTlLLE9BQU8sR0FBSTZLLElBQUksQ0FBRSxTQUFGLENBQXJCO0FBQ0EsVUFBTVEsUUFBUSxHQUFHekwsQ0FBQyxDQUFFSSxPQUFGLENBQWxCO0FBRUFKLE1BQUFBLENBQUMsQ0FBQytCLElBQUYsQ0FBUTBKLFFBQVIsRUFBa0IsWUFBVztBQUM1QixZQUFNQyxLQUFLLEdBQUkxTCxDQUFDLENBQUUsSUFBRixDQUFoQjs7QUFDQSxZQUFNcUwsTUFBTSxHQUFHSyxLQUFLLENBQUN6SyxHQUFOLEVBQWY7O0FBQ0ErSixRQUFBQSxvQkFBb0IsQ0FBRUMsSUFBRixFQUFRUyxLQUFSLEVBQWVMLE1BQWYsQ0FBcEI7QUFDQSxPQUpEO0FBS0EsS0FURCxNQVNPO0FBQ05MLE1BQUFBLG9CQUFvQixDQUFFQyxJQUFGLEVBQVFDLGVBQVIsRUFBeUI3SyxLQUF6QixDQUFwQjtBQUNBO0FBQ0Q7O0FBRUQsV0FBU3NMLFVBQVQsR0FBc0M7QUFBQSxRQUFqQkMsTUFBaUIsdUVBQVIsS0FBUTtBQUNyQzVMLElBQUFBLENBQUMsQ0FBQytCLElBQUYsQ0FBUWdKLGFBQVIsRUFBdUIsVUFBVXJILENBQVYsRUFBYXVILElBQWIsRUFBb0I7QUFDMUMsVUFBTTdLLE9BQU8sR0FBRzZLLElBQUksQ0FBRSxTQUFGLENBQXBCO0FBQ0EsVUFBTVksS0FBSyxHQUFLWixJQUFJLENBQUUsT0FBRixDQUFwQjtBQUVBTyxNQUFBQSxtQkFBbUIsQ0FBRVAsSUFBRixFQUFRLElBQVIsRUFBYyxJQUFkLENBQW5COztBQUVBLFVBQUtXLE1BQUwsRUFBYztBQUNiM0wsUUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCMkwsS0FBakIsRUFBd0J6TCxPQUF4QixFQUFpQyxZQUFXO0FBQzNDLGNBQU1zTCxLQUFLLEdBQUkxTCxDQUFDLENBQUUsSUFBRixDQUFoQjs7QUFDQSxjQUFNcUwsTUFBTSxHQUFHckwsQ0FBQyxDQUFFLElBQUYsQ0FBRCxDQUFVaUIsR0FBVixFQUFmOztBQUNBdUssVUFBQUEsbUJBQW1CLENBQUVQLElBQUYsRUFBUVMsS0FBUixFQUFlTCxNQUFmLENBQW5CO0FBQ0EsU0FKRDs7QUFNQSxZQUFLLENBQUVyTCxDQUFDLENBQUVDLFlBQUYsQ0FBRCxDQUFrQnNDLFFBQWxCLENBQTRCLFFBQTVCLENBQVAsRUFBZ0Q7QUFDL0N2QyxVQUFBQSxDQUFDLENBQUVDLFlBQUYsQ0FBRCxDQUFrQmtFLFFBQWxCLENBQTRCLFFBQTVCO0FBRUFsRSxVQUFBQSxZQUFZLENBQUNtRSxPQUFiLENBQXNCLGFBQXRCO0FBQ0E7QUFDRDtBQUNELEtBbkJEO0FBb0JBOztBQUVEdUgsRUFBQUEsVUFBVSxDQUFFLElBQUYsQ0FBVjtBQUVBMUwsRUFBQUEsWUFBWSxDQUFDQyxFQUFiLENBQWlCLGFBQWpCLEVBQWdDLFlBQVc7QUFDMUM7QUFDQXlMLElBQUFBLFVBQVU7QUFDVixHQUhEO0FBS0EsQ0E3Y0Q7OztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTlMLE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixVQUFVQyxDQUFWLEVBQWM7QUFFdkMsTUFBTThMLGdCQUFnQixHQUFHOUwsQ0FBQyxDQUFFLG1CQUFGLENBQTFCLENBRnVDLENBSXZDOztBQUNBOEwsRUFBQUEsZ0JBQWdCLENBQUM1TCxFQUFqQixDQUFxQixRQUFyQixFQUErQixPQUEvQixFQUF3QyxZQUFXO0FBQ2xELFFBQU13TCxLQUFLLEdBQUcxTCxDQUFDLENBQUUsSUFBRixDQUFmOztBQUNBLFFBQU0rTCxJQUFJLEdBQUlMLEtBQUssQ0FBQ3pLLEdBQU4sRUFBZDs7QUFDQSxRQUFNK0ssSUFBSSxHQUFJTixLQUFLLENBQUNuRixPQUFOLENBQWUsSUFBZixDQUFkOztBQUVBeUYsSUFBQUEsSUFBSSxDQUFDeEwsSUFBTCxDQUFXLGVBQVgsRUFBNkJrRSxXQUE3QixDQUEwQyxRQUExQztBQUNBc0gsSUFBQUEsSUFBSSxDQUFDeEwsSUFBTCxDQUFXLFVBQVV1TCxJQUFyQixFQUE0QjVILFFBQTVCLENBQXNDLFFBQXRDO0FBRUEySCxJQUFBQSxnQkFBZ0IsQ0FBQzFILE9BQWpCLENBQTBCLDBCQUExQjtBQUNBLEdBVEQsRUFMdUMsQ0FnQnZDOztBQUNBMEgsRUFBQUEsZ0JBQWdCLENBQUM1TCxFQUFqQixDQUFxQixPQUFyQixFQUE4QixxQkFBOUIsRUFBcUQsWUFBVztBQUMvRCxRQUFNd0wsS0FBSyxHQUFXMUwsQ0FBQyxDQUFFLElBQUYsQ0FBdkI7O0FBQ0EsUUFBTWlNLFVBQVUsR0FBTVAsS0FBSyxDQUFDbkYsT0FBTixDQUFlLE9BQWYsQ0FBdEI7O0FBQ0EsUUFBTTJGLGFBQWEsR0FBR0QsVUFBVSxDQUFDL0QsUUFBWCxHQUFzQmhFLElBQXRCLEdBQTZCaUksS0FBN0IsRUFBdEI7QUFFQUQsSUFBQUEsYUFBYSxDQUFDMUwsSUFBZCxDQUFvQixhQUFwQixFQUFvQ2lGLElBQXBDLENBQTBDLGVBQTFDLEVBQTJELENBQTNEO0FBQ0F5RyxJQUFBQSxhQUFhLENBQUMxTCxJQUFkLENBQW9CLGlCQUFwQixFQUF3Q2lGLElBQXhDLENBQThDLGVBQTlDLEVBQStELENBQS9EO0FBQ0F5RyxJQUFBQSxhQUFhLENBQUMxTCxJQUFkLENBQW9CLGVBQXBCLEVBQXNDa0UsV0FBdEMsQ0FBbUQsUUFBbkQ7QUFDQXdILElBQUFBLGFBQWEsQ0FBQzFMLElBQWQsQ0FBb0IsMkJBQXBCLEVBQWtEMkQsUUFBbEQsQ0FBNEQsUUFBNUQ7QUFFQThILElBQUFBLFVBQVUsQ0FBQ2pJLE1BQVgsQ0FBbUJrSSxhQUFuQjtBQUVBSixJQUFBQSxnQkFBZ0IsQ0FBQzFILE9BQWpCLENBQTBCLDBCQUExQjtBQUNBLEdBYkQsRUFqQnVDLENBZ0N2Qzs7QUFDQTBILEVBQUFBLGdCQUFnQixDQUFDNUwsRUFBakIsQ0FBcUIsT0FBckIsRUFBOEIsbUJBQTlCLEVBQW1ELFlBQVc7QUFDN0QsUUFBTXdMLEtBQUssR0FBc0IxTCxDQUFDLENBQUUsSUFBRixDQUFsQzs7QUFDQSxRQUFNb00sZUFBZSxHQUFZVixLQUFLLENBQUNuRixPQUFOLENBQWUsbUJBQWYsQ0FBakM7O0FBQ0EsUUFBTThGLG9CQUFvQixHQUFPRCxlQUFlLENBQUM1TCxJQUFoQixDQUFzQix5QkFBdEIsQ0FBakM7QUFDQSxRQUFNOEwsd0JBQXdCLEdBQUdELG9CQUFvQixDQUFDbkUsUUFBckIsR0FBZ0NoRSxJQUFoQyxHQUF1Q2lJLEtBQXZDLEVBQWpDO0FBQ0EsUUFBTUksa0JBQWtCLEdBQVNELHdCQUF3QixDQUFDOUwsSUFBekIsQ0FBK0IsT0FBL0IsRUFBeUMwSCxRQUF6QyxHQUFvRGhFLElBQXBELEdBQTJEaUksS0FBM0QsRUFBakM7QUFFQUksSUFBQUEsa0JBQWtCLENBQUMvTCxJQUFuQixDQUF5QixhQUF6QixFQUF5Q2lGLElBQXpDLENBQStDLGVBQS9DLEVBQWdFLENBQWhFO0FBQ0E4RyxJQUFBQSxrQkFBa0IsQ0FBQy9MLElBQW5CLENBQXlCLGlCQUF6QixFQUE2Q2lGLElBQTdDLENBQW1ELGVBQW5ELEVBQW9FLENBQXBFO0FBQ0E4RyxJQUFBQSxrQkFBa0IsQ0FBQy9MLElBQW5CLENBQXlCLGVBQXpCLEVBQTJDa0UsV0FBM0MsQ0FBd0QsUUFBeEQ7QUFDQTZILElBQUFBLGtCQUFrQixDQUFDL0wsSUFBbkIsQ0FBeUIsMkJBQXpCLEVBQXVEMkQsUUFBdkQsQ0FBaUUsUUFBakU7QUFFQW1JLElBQUFBLHdCQUF3QixDQUFDOUwsSUFBekIsQ0FBK0IsT0FBL0IsRUFBeUNtRSxJQUF6QyxDQUErQzRILGtCQUEvQztBQUNBRixJQUFBQSxvQkFBb0IsQ0FBQ3JJLE1BQXJCLENBQTZCc0ksd0JBQTdCO0FBRUFSLElBQUFBLGdCQUFnQixDQUFDMUgsT0FBakIsQ0FBMEIsMEJBQTFCO0FBQ0EsR0FoQkQsRUFqQ3VDLENBbUR2Qzs7QUFDQTBILEVBQUFBLGdCQUFnQixDQUFDNUwsRUFBakIsQ0FBcUIsT0FBckIsRUFBOEIsOEJBQTlCLEVBQThELFlBQVc7QUFDeEUsUUFBTXdMLEtBQUssR0FBWTFMLENBQUMsQ0FBRSxJQUFGLENBQXhCOztBQUNBLFFBQU13TSxVQUFVLEdBQU9kLEtBQUssQ0FBQ25GLE9BQU4sQ0FBZSx5QkFBZixDQUF2Qjs7QUFDQSxRQUFNa0csY0FBYyxHQUFHZixLQUFLLENBQUNuRixPQUFOLENBQWUsbUJBQWYsQ0FBdkI7O0FBQ0EsUUFBTW1HLEtBQUssR0FBWWhCLEtBQUssQ0FBQ25GLE9BQU4sQ0FBZSxPQUFmLENBQXZCOztBQUNBLFFBQU1vRyxFQUFFLEdBQWVqQixLQUFLLENBQUNuRixPQUFOLENBQWUsSUFBZixDQUF2Qjs7QUFFQSxRQUFJcUcsa0JBQWtCLEdBQUcsS0FBekI7QUFDQSxRQUFJQyxrQkFBa0IsR0FBRyxLQUF6Qjs7QUFFQSxRQUFLSCxLQUFLLENBQUN4RSxRQUFOLEdBQWlCL0UsTUFBakIsR0FBMEIsQ0FBL0IsRUFBbUM7QUFDbEN5SixNQUFBQSxrQkFBa0IsR0FBRyxJQUFyQjtBQUNBOztBQUVELFFBQUtKLFVBQVUsQ0FBQ3RFLFFBQVgsR0FBc0IvRSxNQUF0QixHQUErQixDQUFwQyxFQUF3QztBQUN2QzBKLE1BQUFBLGtCQUFrQixHQUFHLElBQXJCO0FBQ0E7O0FBRUQsUUFBSyxDQUFFRCxrQkFBRixJQUF3QixDQUFFQyxrQkFBL0IsRUFBb0Q7QUFDbkQ7QUFDQTs7QUFFREYsSUFBQUEsRUFBRSxDQUFDbEcsTUFBSDs7QUFFQSxRQUFLLENBQUVpRyxLQUFLLENBQUN4RSxRQUFOLEdBQWlCL0UsTUFBeEIsRUFBaUM7QUFDaENzSixNQUFBQSxjQUFjLENBQUNoRyxNQUFmO0FBQ0E7O0FBRURxRixJQUFBQSxnQkFBZ0IsQ0FBQzFILE9BQWpCLENBQTBCLDBCQUExQjtBQUNBLEdBN0JEO0FBK0JBMEgsRUFBQUEsZ0JBQWdCLENBQUM1TCxFQUFqQixDQUFxQixRQUFyQixFQUErQiwwQkFBL0IsRUFBMkQsWUFBVztBQUNyRTRMLElBQUFBLGdCQUFnQixDQUFDMUgsT0FBakIsQ0FBMEIsMEJBQTFCO0FBQ0EsR0FGRCxFQW5GdUMsQ0F1RnZDOztBQUNBLFdBQVMwSSxrQkFBVCxHQUE4QjtBQUM3QixRQUFNQyxlQUFlLEdBQUdqQixnQkFBZ0IsQ0FBQ3RMLElBQWpCLENBQXVCLG1CQUF2QixDQUF4QjtBQUNBLFFBQU13TSxLQUFLLEdBQWEsRUFBeEI7QUFFQUQsSUFBQUEsZUFBZSxDQUFDaEwsSUFBaEIsQ0FBc0IsVUFBVXVELEdBQVYsRUFBZW1ILGNBQWYsRUFBZ0M7QUFDckQsVUFBTUMsS0FBSyxHQUFRMU0sQ0FBQyxDQUFFeU0sY0FBRixDQUFELENBQW9Cak0sSUFBcEIsQ0FBMEIsT0FBMUIsQ0FBbkI7QUFDQSxVQUFNeUwsVUFBVSxHQUFHLEVBQW5CO0FBRUFTLE1BQUFBLEtBQUssQ0FBQ3hFLFFBQU4sR0FBaUJuRyxJQUFqQixDQUF1QixVQUFVa0wsS0FBVixFQUFpQkMsVUFBakIsRUFBOEI7QUFDcEQsWUFBTUMsU0FBUyxHQUFHbk4sQ0FBQyxDQUFFa04sVUFBRixDQUFuQjtBQUNBLFlBQU1uQixJQUFJLEdBQVFvQixTQUFTLENBQUMzTSxJQUFWLENBQWdCLGFBQWhCLEVBQWdDUyxHQUFoQyxFQUFsQjtBQUNBLFlBQU1tTSxRQUFRLEdBQUlELFNBQVMsQ0FBQzNNLElBQVYsQ0FBZ0IsaUJBQWhCLEVBQW9DUyxHQUFwQyxFQUFsQjtBQUNBLFlBQU1aLEtBQUssR0FBTzhNLFNBQVMsQ0FBQzNNLElBQVYsQ0FBZ0Isc0JBQWhCLEVBQXlDUyxHQUF6QyxFQUFsQjtBQUVBZ0wsUUFBQUEsVUFBVSxDQUFDdEUsSUFBWCxDQUFpQixDQUFFb0UsSUFBRixFQUFRcUIsUUFBUixFQUFrQi9NLEtBQWxCLENBQWpCO0FBQ0EsT0FQRDtBQVNBMk0sTUFBQUEsS0FBSyxDQUFDckYsSUFBTixDQUFZc0UsVUFBWjtBQUNBLEtBZEQ7QUFnQkEsV0FBT2UsS0FBUDtBQUNBOztBQUVEbEIsRUFBQUEsZ0JBQWdCLENBQUM1TCxFQUFqQixDQUFxQiwwQkFBckIsRUFBaUQsWUFBVztBQUMzRCxRQUFNOE0sS0FBSyxHQUFPRixrQkFBa0IsRUFBcEM7QUFDQSxRQUFNbEYsU0FBUyxHQUFHQyxrQkFBa0IsQ0FBRTdFLElBQUksQ0FBQzhFLFNBQUwsQ0FBZ0JrRixLQUFoQixDQUFGLENBQXBDO0FBRUFoTixJQUFBQSxDQUFDLENBQUUsbUJBQUYsQ0FBRCxDQUF5QmlCLEdBQXpCLENBQThCMkcsU0FBOUI7QUFDQSxHQUxEO0FBT0EsQ0F0SEQiLCJmaWxlIjoid2MtYWpheC1wcm9kdWN0LWZpbHRlci1hZG1pbi1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBEaXNwbGF5IHR5cGUgZmllbGRzLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgd3B0b29scy5pb1xuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRxdWVyeVR5cGUgICAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtcXVlcnlfdHlwZScgKTtcblx0XHRcdGNvbnN0IHZhbGlkRGlzcGxheVR5cGVzID0gWyAnbGFiZWwnLCAnY29sb3InLCAnaW1hZ2UnIF07XG5cblx0XHRcdGlmICggdmFsaWREaXNwbGF5VHlwZXMuaW5jbHVkZXMoIHZhbHVlICkgKSB7XG5cdFx0XHRcdGNvbnN0ICRtdWx0aXBsZUZpbHRlciA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnICk7XG5cblx0XHRcdFx0aWYgKCAkbXVsdGlwbGVGaWx0ZXIuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdFx0XHQkcXVlcnlUeXBlLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkcXVlcnlUeXBlLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJHF1ZXJ5VHlwZSAgICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1xdWVyeV90eXBlJyApO1xuXHRcdFx0Y29uc3QgJGRpc3BsYXlUeXBlICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyApO1xuXHRcdFx0Y29uc3QgZGlzcGxheVR5cGUgICAgICAgPSAkZGlzcGxheVR5cGUudmFsKCk7XG5cdFx0XHRjb25zdCB2YWxpZERpc3BsYXlUeXBlcyA9IFsgJ2xhYmVsJywgJ2NvbG9yJywgJ2ltYWdlJyBdO1xuXG5cdFx0XHRpZiAoIHZhbGlkRGlzcGxheVR5cGVzLmluY2x1ZGVzKCBkaXNwbGF5VHlwZSApICkge1xuXHRcdFx0XHRpZiAoICcxJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHRcdFx0JHF1ZXJ5VHlwZS5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHF1ZXJ5VHlwZS5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBEaXNwbGF5IHR5cGUgZmllbGRzLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgd3B0b29scy5pb1xuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblxuXHQvLyBIaWVyYXJjaGljYWwgZmllbGQncyB0b2dnbGUgdmlzaWJpbGl0eSB3aGVuIHRleHQgZGlzcGxheSB0eXBlIGlzIGNoYW5nZWQuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJGhyRmllbGRzICAgICAgID0gJGZpZWxkLmZpbmQoICcuaGllcmFyY2hpY2FsLWZpZWxkcycgKTtcblx0XHRcdGNvbnN0ICRoaWVyYXJjaGljYWwgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWhpZXJhcmNoaWNhbCcgKTtcblx0XHRcdGNvbnN0IHVzZUhpZXJhcmNoaWNhbCA9ICRoaWVyYXJjaGljYWwuZmluZCggJ2lucHV0JyApLmlzKCAnOmNoZWNrZWQnICk7XG5cdFx0XHRjb25zdCAkaHJBY2NvcmRpb24gICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfaGllcmFyY2h5X2FjY29yZGlvbicgKTtcblxuXHRcdFx0aWYgKCAnY2hlY2tib3gnID09PSB2YWx1ZSB8fCAncmFkaW8nID09PSB2YWx1ZSApIHtcblx0XHRcdFx0JGhyRmllbGRzLnNob3coKTtcblxuXHRcdFx0XHRpZiAoIHVzZUhpZXJhcmNoaWNhbCApIHtcblx0XHRcdFx0XHQkaHJBY2NvcmRpb24uc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRockFjY29yZGlvbi5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoICdzZWxlY3QnID09PSB2YWx1ZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgKSB7XG5cdFx0XHRcdCRockZpZWxkcy5zaG93KCk7XG5cdFx0XHRcdCRockFjY29yZGlvbi5oaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkaHJGaWVsZHMuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdC8vIEhpZXJhcmNoaWNhbCBhY2NvcmRpb24gZmllbGQgdG9nZ2xlIHZpc2liaWxpdHkgd2hlbiBzaG93IGhpZXJhcmNoeSBpcyBjaGFuZ2VkLlxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1oaWVyYXJjaGljYWwgaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgZGlzcGxheVR5cGUgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgKS52YWwoKTtcblx0XHRcdGNvbnN0ICRockFjY29yZGlvbiA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9oaWVyYXJjaHlfYWNjb3JkaW9uJyApO1xuXG5cdFx0XHRpZiAoICcxJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHRcdGlmICggJ2NoZWNrYm94JyA9PT0gZGlzcGxheVR5cGUgfHwgJ3JhZGlvJyA9PT0gZGlzcGxheVR5cGUgKSB7XG5cdFx0XHRcdFx0JGhyQWNjb3JkaW9uLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkaHJBY2NvcmRpb24uaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkaHJBY2NvcmRpb24uaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdC8vIE92ZXJyaWRlIG5vLXJlc3VsdHMtbWVzc2FnZSwgYWxsLWl0ZW1zLWxhYmVsIGZpZWxkJ3MgdG9nZ2xlIHZpc2liaWxpdHkgd2hlbiB0ZXh0IGRpc3BsYXkgdHlwZSBpcyBjaGFuZ2VkLlxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScgKTtcblx0XHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyApO1xuXHRcdFx0Y29uc3QgdXNlQ2hvc2VuICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0JyApLmlzKCAnOmNoZWNrZWQnICk7XG5cblx0XHRcdGlmICggdXNlQ2hvc2VuICYmICggJ3NlbGVjdCcgPT09IHZhbHVlIHx8ICdtdWx0aS1zZWxlY3QnID09PSB2YWx1ZSApICkge1xuXHRcdFx0XHQkbm9SZXN1bHRzLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICggJ3JhZGlvJyA9PT0gdmFsdWUgfHwgJ3NlbGVjdCcgPT09IHZhbHVlICkgfHwgKCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgJiYgdXNlQ2hvc2VuICkgKSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHQvLyBPdmVycmlkZSBuby1yZXN1bHRzLW1lc3NhZ2UsIGFsbC1pdGVtcy1sYWJlbCBmaWVsZCdzIHRvZ2dsZSB2aXNpYmlsaXR5IHdoZW4gdGV4dCB1c2UgY2hvc2VuIGlzIGNoYW5nZWQuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJG5vUmVzdWx0cyAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VHlwZSAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnICkudmFsKCk7XG5cblx0XHRcdGlmICggJzEnID09PSB2YWx1ZSAmJiAoICdzZWxlY3QnID09PSBkaXNwbGF5VHlwZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKSApIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKFxuXHRcdFx0XHQoICcxJyA9PT0gdmFsdWUgJiYgJ211bHRpLXNlbGVjdCcgPT09IGRpc3BsYXlUeXBlIClcblx0XHRcdFx0fHwgKCAncmFkaW8nID09PSBkaXNwbGF5VHlwZSB8fCAnc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKVxuXHRcdFx0KSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBGaWVsZCBtZXRhIGJveC5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cdGNvbnN0IGZpZWxkSW5wdXQgICA9ICdbbmFtZV06bm90KC5tYW51YWxfb3B0aW9ucyknO1xuXHRjb25zdCBmaWVsZFN0YXRlcyAgPSB7fTtcblxuXHRmdW5jdGlvbiBzdG9yZUZpZWxkU3RhdGUoKSB7XG5cdFx0Y29uc3QgZmllbGRUeXBlID0gZmllbGRXcmFwcGVyLmZpbmQoICcjZmllbGRfZGF0YScgKS5hdHRyKCAnZGF0YS1maWVsZC10eXBlJyApO1xuXG5cdFx0aWYgKCAhIGZpZWxkVHlwZSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBmaWVsZFZhbHVlcyA9IHt9O1xuXG5cdFx0ZmllbGRXcmFwcGVyLmZpbmQoIGZpZWxkSW5wdXQgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblx0XHRcdGNvbnN0IHR5cGUgICA9ICRpbnB1dC5hdHRyKCAndHlwZScgKTtcblx0XHRcdGNvbnN0IG5hbWUgICA9ICRpbnB1dC5hdHRyKCAnbmFtZScgKTtcblx0XHRcdGNvbnN0IHZhbHVlICA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0aWYgKCAnY2hlY2tib3gnID09PSB0eXBlIHx8ICdyYWRpbycgPT09IHR5cGUgKSB7XG5cdFx0XHRcdGlmICggJGlucHV0LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRcdFx0ZmllbGRWYWx1ZXNbIG5hbWUgXSA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmaWVsZFZhbHVlc1sgbmFtZSBdID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Ly8gSGFuZGxlIG1hbnVhbCBvcHRpb25zLlxuXHRcdGNvbnN0IG1hbnVhbE9wdGlvbnMgPSB7fTtcblxuXHRcdGZpZWxkV3JhcHBlci5maW5kKCAnLm1hbnVhbF9vcHRpb25zJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0Y29uc3QgbmFtZSAgID0gJGlucHV0LmF0dHIoICduYW1lJyApO1xuXG5cdFx0XHRtYW51YWxPcHRpb25zWyBuYW1lIF0gPSAkaW5wdXQudmFsKCk7XG5cdFx0fSApO1xuXG5cdFx0ZmllbGRWYWx1ZXNbICdtYW51YWxfb3B0aW9ucycgXSA9IG1hbnVhbE9wdGlvbnM7XG5cblx0XHRmaWVsZFN0YXRlc1sgZmllbGRUeXBlIF0gPSBmaWVsZFZhbHVlcztcblx0fVxuXG5cdGZ1bmN0aW9uIHVwZGF0ZUZpZWxkU3RhdGUoICRlbG0gKSB7XG5cdFx0Y29uc3QgZmllbGRUeXBlICA9IGZpZWxkV3JhcHBlci5maW5kKCAnI2ZpZWxkX2RhdGEnICkuYXR0ciggJ2RhdGEtZmllbGQtdHlwZScgKTtcblx0XHRjb25zdCBmaWVsZFN0YXRlID0gZmllbGRTdGF0ZXNbIGZpZWxkVHlwZSBdO1xuXG5cdFx0Y29uc3QgbmFtZSAgPSAkZWxtLmF0dHIoICduYW1lJyApO1xuXHRcdGNvbnN0IHR5cGUgID0gJGVsbS5hdHRyKCAndHlwZScgKTtcblx0XHRjb25zdCB2YWx1ZSA9ICRlbG0udmFsKCk7XG5cblx0XHRpZiAoICRlbG0uaGFzQ2xhc3MoICdtYW51YWxfb3B0aW9ucycgKSApIHtcblx0XHRcdGNvbnN0IG1hbnVhbF9vcHRpb25zID0gZmllbGRTdGF0ZVsgJ21hbnVhbF9vcHRpb25zJyBdIHx8IHt9O1xuXG5cdFx0XHRtYW51YWxfb3B0aW9uc1sgbmFtZSBdID0gdmFsdWU7XG5cblx0XHRcdGZpZWxkU3RhdGVbICdtYW51YWxfb3B0aW9ucycgXSA9IG1hbnVhbF9vcHRpb25zO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoICdjaGVja2JveCcgPT09IHR5cGUgfHwgJ3JhZGlvJyA9PT0gdHlwZSApIHtcblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gZmllbGRXcmFwcGVyLmZpbmQoICdbbmFtZT1cIicgKyBuYW1lICsgJ1wiXScgKTtcblxuXHRcdFx0XHRpZiAoICRpbnB1dC5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0XHRcdGZpZWxkU3RhdGVbIG5hbWUgXSA9IHZhbHVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGRlbGV0ZSBmaWVsZFN0YXRlWyBuYW1lIF07XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZpZWxkU3RhdGVbIG5hbWUgXSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFN0b3JlIHRoZSBpbml0aWFsIGZpZWxkIHN0YXRlLlxuXHRzdG9yZUZpZWxkU3RhdGUoKTtcblxuXHRmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lXScgKS5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0dXBkYXRlRmllbGRTdGF0ZSggJHRoaXMgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIGFwcGx5RmllbGRTdGF0ZSggZmllbGRUeXBlICkge1xuXHRcdGNvbnN0IGZpZWxkU3RhdGUgPSBmaWVsZFN0YXRlc1sgZmllbGRUeXBlIF07XG5cblx0XHRmaWVsZFdyYXBwZXIuZmluZCggZmllbGRJbnB1dCApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0Y29uc3QgdHlwZSAgID0gJGlucHV0LmF0dHIoICd0eXBlJyApO1xuXHRcdFx0Y29uc3QgbmFtZSAgID0gJGlucHV0LmF0dHIoICduYW1lJyApO1xuXHRcdFx0Y29uc3QgdmFsdWUgID0gZmllbGRTdGF0ZVsgbmFtZSBdO1xuXG5cdFx0XHRpZiAoICdjaGVja2JveCcgPT09IHR5cGUgfHwgJ3JhZGlvJyA9PT0gdHlwZSApIHtcblx0XHRcdFx0aWYgKCBuYW1lIGluIGZpZWxkU3RhdGUgKSB7XG5cdFx0XHRcdFx0Ly8gQWRkICdjaGVja2VkJyBhdHRyaWJ1dGUuXG5cdFx0XHRcdFx0ZmllbGRXcmFwcGVyXG5cdFx0XHRcdFx0XHQuZmluZCggJ1tuYW1lPVwiJyArIG5hbWUgKyAnXCJdW3ZhbHVlPVwiJyArIHZhbHVlICsgJ1wiXScgKVxuXHRcdFx0XHRcdFx0LmF0dHIoICdjaGVja2VkJywgJ2NoZWNrZWQnICk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gUmVtb3ZlICdjaGVja2VkJyBhdHRyaWJ1dGUuXG5cdFx0XHRcdFx0ZmllbGRXcmFwcGVyLmZpbmQoICdbbmFtZT1cIicgKyBuYW1lICsgJ1wiXScgKS5yZW1vdmVBdHRyKCAnY2hlY2tlZCcgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGlucHV0LnZhbCggdmFsdWUgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHQvLyBQcm9jZXNzIHRoZSBtYW51YWwgb3B0aW9ucy5cblx0XHRpZiAoICdtYW51YWxfb3B0aW9ucycgaW4gZmllbGRTdGF0ZSApIHtcblx0XHRcdGNvbnN0IHJhd09wdGlvbnMgPSBmaWVsZFN0YXRlWyAnbWFudWFsX29wdGlvbnMnIF07XG5cblx0XHRcdCQuZWFjaCggcmF3T3B0aW9ucywgZnVuY3Rpb24oIGlucHV0TmFtZSwgcmF3ICkge1xuXHRcdFx0XHRjb25zdCAkcmF3SW5wdXQgPSBmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lPVwiJyArIGlucHV0TmFtZSArICdcIl0nICk7XG5cblx0XHRcdFx0JHJhd0lucHV0LnZhbCggcmF3ICk7XG5cblx0XHRcdFx0Y29uc3QgbWFudWFsT3B0aW9ucyA9IEpTT04ucGFyc2UoIGRlY29kZVVSSUNvbXBvbmVudCggcmF3ICkgKTtcblxuXHRcdFx0XHRpZiAoICEgbWFudWFsT3B0aW9ucy5sZW5ndGggKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgdGFibGVJZGVudGlmaWVyID0gJHJhd0lucHV0LmF0dHIoICdkYXRhLXRhYmxlJyApO1xuXHRcdFx0XHRjb25zdCByb3dUZW1wbGF0ZUlkICAgPSAkcmF3SW5wdXQuYXR0ciggJ2RhdGEtdG1wbCcgKTtcblxuXHRcdFx0XHQvLyBCYWlsIG91dCBpZiBubyB0bXBsIGZvdW5kIGZvciB0aGUgdHlwZS5cblx0XHRcdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyByb3dUZW1wbGF0ZUlkICkubGVuZ3RoICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IHJvd3NJZGVudGlmaWVyID0gJy5maWVsZC10YWJsZS1ib2R5LXJvd3MnO1xuXHRcdFx0XHRjb25zdCByb3dJZGVudGlmaWVyICA9ICcucm93LWl0ZW0nO1xuXG5cdFx0XHRcdGNvbnN0ICR0YWJsZSA9IGZpZWxkV3JhcHBlci5maW5kKCB0YWJsZUlkZW50aWZpZXIgKTtcblx0XHRcdFx0Y29uc3QgJHJvd3MgID0gJHRhYmxlLmZpbmQoIHJvd3NJZGVudGlmaWVyICk7XG5cblx0XHRcdFx0JC5lYWNoKCBtYW51YWxPcHRpb25zLCBmdW5jdGlvbiggaSwgb3B0aW9uICkge1xuXHRcdFx0XHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIHJvd1RlbXBsYXRlSWQgKTtcblxuXHRcdFx0XHRcdGxldCByb3dEZWZhdWx0T3B0aW9ucyA9IHt9O1xuXG5cdFx0XHRcdFx0aWYgKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyA9PT0gdGFibGVJZGVudGlmaWVyICkge1xuXHRcdFx0XHRcdFx0cm93RGVmYXVsdE9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0XHRcdCd2YWx1ZSc6ICcnLFxuXHRcdFx0XHRcdFx0XHQnbGFiZWwnOiAnJyxcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSggcm93RGVmYXVsdE9wdGlvbnMgKTtcblxuXHRcdFx0XHRcdCRyb3dzLmFwcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdFx0XHRcdGNvbnN0ICRsYXN0Um93ID0gJHJvd3MuZmluZCggcm93SWRlbnRpZmllciApLmxhc3QoKTtcblxuXHRcdFx0XHRcdCRsYXN0Um93LmZpbmQoICdbZGF0YS1uYW1lXScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdFx0Y29uc3QgbmFtZSAgPSAkdGhpcy5hdHRyKCAnZGF0YS1uYW1lJyApO1xuXHRcdFx0XHRcdFx0Y29uc3QgdmFsdWUgPSBvcHRpb25bIG5hbWUgXTtcblxuXHRcdFx0XHRcdFx0JHRoaXMudmFsKCB2YWx1ZSApO1xuXG5cdFx0XHRcdFx0XHRpZiAoICdpbWFnZV91cmwnID09PSBuYW1lICYmIHZhbHVlICkge1xuXHRcdFx0XHRcdFx0XHQkbGFzdFJvdy5maW5kKCAnLndwLWltYWdlLXBpY2tlci1jb250YWluZXInICkuYWRkQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0XHRcdFx0XHRcdCRsYXN0Um93LmZpbmQoICdpbWcnICkuYXR0ciggJ3NyYycsIHZhbHVlICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0JHRhYmxlLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGNvbnN0ICRmaWVsZCA9IGZpZWxkV3JhcHBlci5maW5kKCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnbmV3X29wdGlvbl9hZGRlZCcsIFsgJGZpZWxkIF0gKTtcblx0XHR9XG5cdH1cblxuXHQkKCAnI2F2YWlsYWJsZV9maWVsZHMnICkub24oICdjaGFuZ2UnLCAnW25hbWU9XCJfYWN0aXZlX2ZpZWxkXCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBfZmllbGRUeXBlID0gJHRoaXMudmFsKCk7XG5cdFx0Y29uc3QgZmllbGROYW1lICA9ICR0aGlzLmF0dHIoICdkYXRhLWZpZWxkLW5hbWUnICk7XG5cblx0XHRpZiAoICEgX2ZpZWxkVHlwZSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBmaWVsZFR5cGUgPSAnd2NhcGYtZm9ybS1maWVsZC0nICsgX2ZpZWxkVHlwZTtcblxuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgZmllbGRUeXBlICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IHRlbXBsYXRlICAgICAgICAgPSB3cC50ZW1wbGF0ZSggZmllbGRUeXBlICk7XG5cdFx0Y29uc3QgcmVuZGVyZWQgICAgICAgICA9IHRlbXBsYXRlKCk7XG5cdFx0Y29uc3QgZmllbGREYXRhV3JhcHBlciA9IGZpZWxkV3JhcHBlci5maW5kKCAnI2ZpZWxkX2RhdGEnICk7XG5cdFx0Y29uc3QgZmllbGROYW1lV3JhcHBlciA9IGZpZWxkV3JhcHBlci5maW5kKCAnLnBvc3Rib3gtaGVhZGVyIGgyJyApO1xuXHRcdGNvbnN0IGZpZWxkSW5zaWRlICAgICAgPSBmaWVsZFdyYXBwZXIuZmluZCggJy5pbnNpZGUnICk7XG5cblx0XHRmaWVsZFdyYXBwZXIucmVtb3ZlQ2xhc3MoICdoaWRkZW4nICk7XG5cblx0XHRmaWVsZERhdGFXcmFwcGVyLmF0dHIoICdkYXRhLWZpZWxkLXR5cGUnLCBfZmllbGRUeXBlICk7XG5cdFx0ZmllbGROYW1lV3JhcHBlci5odG1sKCBmaWVsZE5hbWUgKTtcblx0XHRmaWVsZEluc2lkZS5odG1sKCByZW5kZXJlZCApO1xuXG5cdFx0Ly8gSWYgYWxyZWFkeSBmb3VuZCB0aGUgZmllbGQgc3RhdGUgdGhlbiBhcHBseSBpdCwgb3RoZXJ3aXNlIHN0b3JlIGl0LlxuXHRcdGlmICggX2ZpZWxkVHlwZSBpbiBmaWVsZFN0YXRlcyApIHtcblx0XHRcdGFwcGx5RmllbGRTdGF0ZSggX2ZpZWxkVHlwZSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdG9yZUZpZWxkU3RhdGUoKTtcblx0XHR9XG5cblx0XHRmaWVsZFdyYXBwZXIudHJpZ2dlciggJ2ZpZWxkX2FkZGVkJyApO1xuXG5cdFx0ZmllbGRXcmFwcGVyLmZpbmQoICdbbmFtZV0nICkub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0XHR1cGRhdGVGaWVsZFN0YXRlKCAkdGhpcyApO1xuXHRcdH0gKTtcblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIEZpbHRlciBmb3JtIG1ldGEgYm94LlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMS4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgd3B0b29scy5pb1xuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZm9ybURhdGEgICAgICA9ICQoICcjZm9ybV9kYXRhJyApO1xuXHRjb25zdCAkZHJvcGRvd24gICAgID0gJCggJyNhdmFpbGFibGUtZmlsdGVycy1kcm9wZG93bicgKTtcblx0Y29uc3QgJGFkZEZpbHRlckJ0biA9ICQoICcjYWRkLWZpbHRlci10by1mb3JtLWJ0bicgKTtcblxuXHQkZHJvcGRvd24ub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCB2YWx1ZSA9ICR0aGlzLnZhbCgpO1xuXG5cdFx0aWYgKCB2YWx1ZSApIHtcblx0XHRcdCRhZGRGaWx0ZXJCdG4ucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkYWRkRmlsdGVyQnRuLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHR9XG5cdH0gKTtcblxuXHQvKipcblx0ICogQWRkIGZpbHRlciB0byBmb3JtLlxuXHQgKi9cblx0JGFkZEZpbHRlckJ0bi5vbiggJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHNlbGVjdGVkID0gJGRyb3Bkb3duLmZpbmQoICdvcHRpb246c2VsZWN0ZWQnICk7XG5cdFx0Y29uc3QgZmlsdGVySWQgID0gJHNlbGVjdGVkLnZhbCgpO1xuXG5cdFx0aWYgKCAhIGZpbHRlcklkLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBmaWx0ZXJUaXRsZSA9ICRzZWxlY3RlZC5hdHRyKCAnZGF0YS10aXRsZScgKTtcblx0XHRjb25zdCBmaWx0ZXJLZXkgICA9ICRzZWxlY3RlZC5hdHRyKCAnZGF0YS1maWx0ZXIta2V5JyApO1xuXHRcdGNvbnN0IGVkaXRMaW5rICAgID0gJHNlbGVjdGVkLmF0dHIoICdkYXRhLWVkaXQtbGluaycgKTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoICd3Y2FwZi1maWx0ZXItZm9ybS1pdGVtJyApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHsgdGl0bGU6IGZpbHRlclRpdGxlLCBpZDogZmlsdGVySWQsIGtleTogZmlsdGVyS2V5LCBlZGl0X2xpbms6IGVkaXRMaW5rIH0gKTtcblxuXHRcdGZvcm1EYXRhLmZpbmQoICcjZmlsdGVyLWZvcm0taXRlbXMnICkucHJlcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdCRkcm9wZG93bi5wcm9wKCAnc2VsZWN0ZWRJbmRleCcsIDAgKTtcblx0XHQkZHJvcGRvd24uZmluZCggJ29wdGlvblt2YWx1ZT1cIicgKyBmaWx0ZXJJZCArICdcIl0nICkuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdCRkcm9wZG93bi50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHR9ICk7XG5cblx0LyoqXG5cdCAqIE1ha2UgdGhlIGZpbHRlcnMgc29ydGFibGUuXG5cdCAqL1xuXHRmdW5jdGlvbiBzb3J0YWJsZSggaWRlbnRpZmllciApIHtcblx0XHRjb25zdCBjb250YWluZXIgPSAkKCBpZGVudGlmaWVyICk7XG5cblx0XHRjb250YWluZXIuc29ydGFibGUoXG5cdFx0XHR7XG5cdFx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdFx0Y3Vyc29yOiAnbW92ZScsXG5cdFx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdFx0aGFuZGxlOiAnLndpZGdldC10b3AnLFxuXHRcdFx0XHRjYW5jZWw6ICcud2lkZ2V0LXRpdGxlLWFjdGlvbicsXG5cdFx0XHRcdGl0ZW1zOiAnLndpZGdldCcsXG5cdFx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdH1cblx0XHQpO1xuXHR9XG5cblx0c29ydGFibGUoICcjZm9ybV9kYXRhJyApO1xuXG5cdC8qKlxuXHQgKiBSZW1vdmUgdGhlIGZpZWxkLlxuXHQgKi9cblx0ZnVuY3Rpb24gcmVtb3ZlRmllbGQoKSB7XG5cdFx0Y29uc3Qgd2lkZ2V0ICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53aWRnZXQnICk7XG5cdFx0Y29uc3QgZmlsdGVySWQgPSB3aWRnZXQuZmluZCggJy5maWx0ZXItaWQnICkudmFsKCk7XG5cblx0XHQkKCB3aWRnZXQgKS5zbGlkZVVwKFxuXHRcdFx0J2Zhc3QnLFxuXHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCRkcm9wZG93bi5maW5kKCAnb3B0aW9uW3ZhbHVlPVwiJyArIGZpbHRlcklkICsgJ1wiXScgKS5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0XHRcdHdpZGdldC5yZW1vdmUoKTtcblx0XHRcdH1cblx0XHQpO1xuXHR9XG5cblx0Zm9ybURhdGEub24oICdjbGljaycsICcud2lkZ2V0LWNvbnRyb2wtcmVtb3ZlJywgcmVtb3ZlRmllbGQgKTtcblxufSApO1xuIiwiLyoqXG4gKiBNYW51YWwgT3B0aW9ucycgdGFibGUgZnVuY3Rpb24uXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICB3cHRvb2xzLmlvXG4gKi9cblxuLyoqXG4gKiBAcGFyYW0gdGFibGVJZGVudGlmaWVyXG4gKiBAcGFyYW0gdmFsdWVJZGVudGlmaWVyXG4gKiBAcGFyYW0gcm93VGVtcGxhdGVJZFxuICogQHBhcmFtIHJvd0RlZmF1bHRPcHRpb25zXG4gKi9cbmZ1bmN0aW9uIGluaXRNYW51YWxPcHRpb25zVGFibGUoIHRhYmxlSWRlbnRpZmllciwgdmFsdWVJZGVudGlmaWVyLCByb3dUZW1wbGF0ZUlkLCByb3dEZWZhdWx0T3B0aW9ucyA9IHt9ICkge1xuXHRjb25zdCAkID0galF1ZXJ5O1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0Y29uc3QgZmllbGRJZGVudGlmaWVyID0gJy53Y2FwZi1mb3JtLWZpZWxkJztcblx0Y29uc3Qgcm93c0lkZW50aWZpZXIgID0gJy5maWVsZC10YWJsZS1ib2R5LXJvd3MnO1xuXHRjb25zdCByb3dJZGVudGlmaWVyICAgPSAnLnJvdy1pdGVtJztcblxuXHRmdW5jdGlvbiBpbml0U29ydGFibGVUYWJsZSggJHNlbGVjdG9yICkge1xuXHRcdCRzZWxlY3Rvci5zb3J0YWJsZSgge1xuXHRcdFx0b3BhY2l0eTogMC44LFxuXHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdGN1cnNvcjogJ21vdmUnLFxuXHRcdFx0YXhpczogJ3knLFxuXHRcdFx0aGFuZGxlOiAnLm1vdmUtb3B0aW9ucy1oYW5kbGVyJyxcblx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdHVwZGF0ZTogZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCA9ICQoIGUudGFyZ2V0ICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0XHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0XHRcdH1cblx0XHR9ICkuZGlzYWJsZVNlbGVjdGlvbigpO1xuXHR9XG5cblx0Y29uc3QgdGFibGVSb3dzSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgJyArIHJvd3NJZGVudGlmaWVyO1xuXG5cdC8vIEluaXQgdGhlIHNvcnRhYmxlIHRhYmxlIGFmdGVyIHBhZ2UgbG9hZHMuXG5cdGluaXRTb3J0YWJsZVRhYmxlKCBmaWVsZFdyYXBwZXIuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApICk7XG5cblx0Ly8gSW5pdCB0aGUgc29ydGFibGUgdGFibGUgYWZ0ZXIgdGhlIGZpZWxkIGlzIGFkZGVkLlxuXHRmaWVsZFdyYXBwZXIub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdGluaXRTb3J0YWJsZVRhYmxlKCAkKCBmaWVsZFdyYXBwZXIuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApICkgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJHZhbHVlSG9sZGVyID0gJGZpZWxkLmZpbmQoIHZhbHVlSWRlbnRpZmllciApO1xuXHRcdGNvbnN0ICRyb3dzICAgICAgICA9ICRmaWVsZC5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgX3Jvd3MgICAgICAgID0gW107XG5cblx0XHQkcm93cy5maW5kKCAnLnJvdy1pdGVtJyApLmVhY2goIGZ1bmN0aW9uKCBpLCBfaXRlbSApIHtcblx0XHRcdGNvbnN0ICRpdGVtID0gJCggX2l0ZW0gKTtcblx0XHRcdGNvbnN0IG9iaiAgID0ge307XG5cblx0XHRcdCRpdGVtLmZpbmQoICdbZGF0YS1uYW1lXScgKS5lYWNoKCBmdW5jdGlvbiggZmllbGRJbmRleCwgZmllbGQgKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCA9ICQoIGZpZWxkICk7XG5cdFx0XHRcdGNvbnN0IG5hbWUgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1uYW1lJyApO1xuXG5cdFx0XHRcdG9ialsgbmFtZSBdID0gJGZpZWxkLnZhbCgpO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRfcm93cy5wdXNoKCBvYmogKTtcblx0XHR9ICk7XG5cblx0XHRjb25zdCByYXdWYWx1ZXMgPSBlbmNvZGVVUklDb21wb25lbnQoIEpTT04uc3RyaW5naWZ5KCBfcm93cyApICk7XG5cdFx0JHZhbHVlSG9sZGVyLnZhbCggcmF3VmFsdWVzICkudHJpZ2dlciggJ2NoYW5nZScgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApIHtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoIHRhYmxlSWRlbnRpZmllciApO1xuXHRcdGNvbnN0IHRhYmxlUm93cyAgICAgPSAkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApLmNoaWxkcmVuKCk7XG5cblx0XHRpZiAoIDIgPiB0YWJsZVJvd3MubGVuZ3RoICkge1xuXHRcdFx0JG9wdGlvbnNUYWJsZS5yZW1vdmVDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJlbW92ZSBPcHRpb25cblx0Y29uc3QgcmVtb3ZlQnRuSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgLnJlbW92ZS1vcHRpb24nO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2NsaWNrJywgcmVtb3ZlQnRuSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGl0ZW0gID0gJCggdGhpcyApLmNsb3Nlc3QoIHJvd0lkZW50aWZpZXIgKTtcblx0XHRjb25zdCAkZmllbGQgPSAkaXRlbS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApO1xuXG5cdFx0JGl0ZW0ucmVtb3ZlKCk7XG5cblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBDbGVhciBBbGwgT3B0aW9uc1xuXHRjb25zdCBjbGVhck9wdGlvbnNCdG5JZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAuY2xlYXItb3B0aW9ucyc7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnY2xpY2snLCBjbGVhck9wdGlvbnNCdG5JZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHQkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApLmVtcHR5KCk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKTtcblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBBZGQgTmV3IE9wdGlvblxuXHRjb25zdCBhZGRPcHRpb25CdG5JZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAuYWRkLW9wdGlvbic7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnY2xpY2snLCBhZGRPcHRpb25CdG5JZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHQvLyBCYWlsIG91dCBpZiBubyB0bXBsIGZvdW5kIGZvciB0aGUgdHlwZS5cblx0XHRpZiAoICEgalF1ZXJ5KCAnI3RtcGwtJyArIHJvd1RlbXBsYXRlSWQgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggcm93VGVtcGxhdGVJZCApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHJvd0RlZmF1bHRPcHRpb25zICk7XG5cdFx0Y29uc3QgJHRhYmxlICAgPSAkZmllbGQuZmluZCggdGFibGVJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgPSAkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApO1xuXG5cdFx0JHJvd3MuYXBwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXG5cdFx0ZmllbGRXcmFwcGVyLnRyaWdnZXIoICduZXdfb3B0aW9uX2FkZGVkJywgWyAkZmllbGQgXSApO1xuXG5cdFx0aWYgKCAhICR0YWJsZS5oYXNDbGFzcyggJ2hhcy1vcHRpb25zJyApICkge1xuXHRcdFx0JHRhYmxlLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gVHJpZ2dlciBvcHRpb25zIGNoYW5nZSB3aGVuIHRoZSB0ZXh0IGZpZWxkcyBnZXQgY2hhbmdlZC5cblx0Y29uc3QgdGV4dEZpZWxkc0lkZW50aWZpZXIgPSB0YWJsZVJvd3NJZGVudGlmaWVyICsgJyBpbnB1dFt0eXBlPVwidGV4dFwiXSc7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnaW5wdXQnLCB0ZXh0RmllbGRzSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gVHJpZ2dlciBvcHRpb25zIGNoYW5nZSB3aGVuIHRoZSBzZWxlY3QgZmllbGRzIGdldCBjaGFuZ2VkLlxuXHRsZXQgc2VsZWN0RmllbGRzSWRlbnRpZmllciA9IHRhYmxlUm93c0lkZW50aWZpZXIgKyAnIHNlbGVjdCc7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnY2hhbmdlJywgc2VsZWN0RmllbGRzSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gVHJpZ2dlciBvcHRpb25zIGNoYW5nZSB3aGVuIHZhbHVlIGlzIGFkZGVkIGZyb20gbW9kYWwuXG5cdGZpZWxkV3JhcHBlci5vbiggJ3RyaWdnZXJfb3B0aW9uc190YWJsZScsIGZ1bmN0aW9uKCBlLCB0YWJsZUlkLCAkZmllbGQgKSB7XG5cdFx0aWYgKCB0YWJsZUlkID09PSB0YWJsZUlkZW50aWZpZXIgKSB7XG5cdFx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdFx0fVxuXHR9ICk7XG5cbn1cbiIsIi8qKlxuICogTWV0YSBib3ggY29tbW9uIHNjcmlwdHMuXG4gKlxuICogQHNpbmNlICAgICAgMy4xLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICB3cHRvb2xzLmlvXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHQvKipcblx0ICogRmlsdGVyIG5hdiB0YWIuXG5cdCAqL1xuXHRjb25zdCAkZmlsdGVyTmF2VGFiICAgICA9ICQoICcjZmlsdGVyLW5hdi10YWInICk7XG5cdGNvbnN0ICRmaWx0ZXJOYXZUYWJJdGVtID0gJCggJyNmaWx0ZXItbmF2LXRhYiAubmF2LXRhYicgKTtcblxuXHQkZmlsdGVyTmF2VGFiSXRlbS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBpZGVudGlmaWVyID0gJHRoaXMuYXR0ciggJ2RhdGEtZm9yJyApO1xuXHRcdGNvbnN0ICRjb250ZW50ICAgPSAkKCAnLnRhYi0nICsgaWRlbnRpZmllciApO1xuXG5cdFx0JGZpbHRlck5hdlRhYkl0ZW0ucmVtb3ZlQ2xhc3MoICduYXYtdGFiLWFjdGl2ZScgKTtcblx0XHQkZmlsdGVyTmF2VGFiLmF0dHIoICdkYXRhLWFjdGl2ZS1uYXYnLCBpZGVudGlmaWVyICk7XG5cdFx0JHRoaXMuYWRkQ2xhc3MoICduYXYtdGFiLWFjdGl2ZScgKTtcblxuXHRcdCQoICcudGFiLWNvbnRlbnQnICkuaGlkZSgpO1xuXHRcdCRjb250ZW50LnNob3coKTtcblx0fSApO1xuXG5cdC8qKlxuXHQgKiBUb2dnbGUgdmlzaWJpbGl0eSBydWxlcy5cblx0ICovXG5cdCQoICcjZW5hYmxlX3Zpc2liaWxpdHlfcnVsZXMnICkub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGRzID0gJCggJy52aXNpYmlsaXR5LXJ1bGVzLWZpZWxkJyApO1xuXG5cdFx0aWYgKCAkKCB0aGlzICkuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdCRmaWVsZHMucmVtb3ZlQ2xhc3MoICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JGZpZWxkcy5hZGRDbGFzcyggJ2Rpc2FibGVkJyApO1xuXHRcdH1cblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIFRoZSBudW1iZXIgdWkgb3B0aW9ucy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0LyoqXG5cdCAqIFRvZ2dsZSBkaXNhYmxlZCBhdHRyaWJ1dGUgb2YgbWluLXZhbHVlIGZpZWxkIGZvciBudW1iZXIgdHlwZS5cblx0ICovXG5cdGZ1bmN0aW9uIHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICRlbG0gKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICA9ICRlbG0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICR0ZXh0RmllbGQgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWUgaW5wdXRbdHlwZT1cInRleHRcIl0nICk7XG5cblx0XHRpZiAoICRlbG0uaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdCR0ZXh0RmllbGQuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkdGV4dEZpZWxkLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHR9XG5cdH1cblxuXHRmaWVsZFdyYXBwZXIub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdGZpZWxkV3JhcHBlci5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0dG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJHRoaXMgKTtcblx0XHR9ICk7XG5cdH0gKTtcblxuXHRmaWVsZFdyYXBwZXIub24oXG5cdFx0J2NsaWNrJyxcblx0XHQnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fVxuXHQpO1xuXG5cdC8qKlxuXHQgKiBUb2dnbGUgZGlzYWJsZWQgYXR0cmlidXRlIG9mIG1heC12YWx1ZSBmaWVsZCBmb3IgbnVtYmVyIHR5cGUuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkZWxtICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkdGV4dEZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXG5cdFx0aWYgKCAkZWxtLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHQkdGV4dEZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHRleHRGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHRmaWVsZFdyYXBwZXIuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fSApO1xuXHR9ICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKFxuXHRcdCdjbGljaycsXG5cdFx0Jy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0XHR0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHRcdH1cblx0KTtcblxufSApO1xuIiwiLyoqXG4gKiBQbHVnaW4gc2V0dGluZ3MgZm9ybS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGlmICggISAkKCAnYm9keScgKS5oYXNDbGFzcyggJ3djYXBmLWZpbHRlcl9wYWdlX3djYXBmLXNldHRpbmdzJyApICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIE1lZGlhIHVwbG9hZGVyLlxuXHQkKCAnLnVwbG9hZC1pbWFnZS1idXR0b24nICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRidXR0b24gICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgJHdyYXBwZXIgICA9ICRidXR0b24uY2xvc2VzdCggJy5tZWRpYS11cGxvYWQnICk7XG5cdFx0Y29uc3QgbW9kYWxUaXRsZSA9ICRidXR0b24uYXR0ciggJ2RhdGEtbW9kYWwtdGl0bGUnICk7XG5cblx0XHRjb25zdCBpbWFnZSA9IHdwLm1lZGlhKCB7IHRpdGxlOiBtb2RhbFRpdGxlLCBtdWx0aXBsZTogZmFsc2UgfSApXG5cdFx0XHQub3BlbigpXG5cdFx0XHQub24oICdzZWxlY3QnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgdXBsb2FkZWRJbWFnZSA9IGltYWdlLnN0YXRlKCkuZ2V0KCAnc2VsZWN0aW9uJyApLmZpcnN0KCk7XG5cdFx0XHRcdGNvbnN0IGltYWdlRGF0YSAgICAgPSB1cGxvYWRlZEltYWdlLnRvSlNPTigpO1xuXG5cdFx0XHRcdGNvbnN0IHsgdGh1bWJuYWlsIH0gPSBpbWFnZURhdGEuc2l6ZXM7XG5cdFx0XHRcdGxldCBpbWFnZVVybDtcblxuXHRcdFx0XHRpZiAoIHRodW1ibmFpbCApIHtcblx0XHRcdFx0XHRpbWFnZVVybCA9IGltYWdlRGF0YS5zaXplcy50aHVtYm5haWwudXJsO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGltYWdlVXJsID0gaW1hZ2VEYXRhLnVybDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCR3cmFwcGVyLmZpbmQoICcuaW1hZ2UtaWQnICkudmFsKCBpbWFnZURhdGEuaWQgKTtcblx0XHRcdFx0JHdyYXBwZXIuZmluZCggJy5pbWFnZS1zcmMnICkuYXR0ciggJ3NyYycsIGltYWdlVXJsICk7XG5cdFx0XHRcdCR3cmFwcGVyLnJlbW92ZUNsYXNzKCAnbm8taW1hZ2UnICk7XG5cdFx0XHR9ICk7XG5cdH0gKTtcblxuXHQkKCAnLnJlbW92ZS1pbWFnZS1idXR0b24nICkub24oICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRidXR0b24gID0gJCggdGhpcyApO1xuXHRcdGNvbnN0ICR3cmFwcGVyID0gJGJ1dHRvbi5jbG9zZXN0KCAnLm1lZGlhLXVwbG9hZCcgKTtcblxuXHRcdCR3cmFwcGVyLmZpbmQoICcuaW1hZ2UtaWQnICkudmFsKCAnJyApO1xuXHRcdCR3cmFwcGVyLmZpbmQoICcuaW1hZ2Utc3JjJyApLmF0dHIoICdzcmMnLCAnJyApO1xuXHRcdCR3cmFwcGVyLmFkZENsYXNzKCAnbm8taW1hZ2UnICk7XG5cdH0gKTtcblxuXHQvLyBUb2dnbGUgbG9hZGluZyBpbWFnZSBmaWVsZC5cblx0ZnVuY3Rpb24gdG9nZ2xlTG9hZGluZ0ltYWdlKCB2YWx1ZSApIHtcblx0XHRjb25zdCAkc2VsZWN0b3IgPSAkKCAnLnNldHRpbmdzLXRhYmxlLWxvYWRpbmdfaW1hZ2UnICk7XG5cblx0XHRpZiAoIHZhbHVlICkge1xuXHRcdFx0JHNlbGVjdG9yLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHNlbGVjdG9yLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRjb25zdCAkZW5hYmxlTG9hZGluZ092ZXJsYXkgPSAkKCAnI2xvYWRpbmdfYW5pbWF0aW9uJyApO1xuXG5cdGxldCBlbmFibGVMb2FkaW5nT3ZlcmxheSA9IGZhbHNlO1xuXG5cdGlmICggJGVuYWJsZUxvYWRpbmdPdmVybGF5LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0ZW5hYmxlTG9hZGluZ092ZXJsYXkgPSB0cnVlO1xuXHR9XG5cblx0dG9nZ2xlTG9hZGluZ0ltYWdlKCBlbmFibGVMb2FkaW5nT3ZlcmxheSApO1xuXG5cdCRlbmFibGVMb2FkaW5nT3ZlcmxheS5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdGxldCBfZW5hYmxlTG9hZGluZ092ZXJsYXkgPSBmYWxzZTtcblxuXHRcdGlmICggJCggdGhpcyApLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRfZW5hYmxlTG9hZGluZ092ZXJsYXkgPSB0cnVlO1xuXHRcdH1cblxuXHRcdHRvZ2dsZUxvYWRpbmdJbWFnZSggX2VuYWJsZUxvYWRpbmdPdmVybGF5ICk7XG5cdH0gKTtcblxuXHQvLyBUb2dnbGUgcGFnaW5hdGlvbiBmaWVsZHMuXG5cdGZ1bmN0aW9uIGVuYWJsZVBhZ2luYXRpb24oIHZhbHVlICkge1xuXHRcdGNvbnN0ICRzZWxlY3RvciA9ICQoICcuc2V0dGluZ3MtdGFibGUtcGFnaW5hdGlvbl9jb250YWluZXInICk7XG5cblx0XHRpZiAoIHZhbHVlICkge1xuXHRcdFx0JHNlbGVjdG9yLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHNlbGVjdG9yLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRjb25zdCAkZW5hYmxlUGFnaW5hdGlvbiA9ICQoICcjZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXgnICk7XG5cblx0bGV0IGVuYWJsZVBhZ2luYXRpb25PbkxvYWQgPSBmYWxzZTtcblxuXHRpZiAoICRlbmFibGVQYWdpbmF0aW9uLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0ZW5hYmxlUGFnaW5hdGlvbk9uTG9hZCA9IHRydWU7XG5cdH1cblxuXHRlbmFibGVQYWdpbmF0aW9uKCBlbmFibGVQYWdpbmF0aW9uT25Mb2FkICk7XG5cblx0JGVuYWJsZVBhZ2luYXRpb24ub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRsZXQgX2VuYWJsZVBhZ2luYXRpb24gPSBmYWxzZTtcblxuXHRcdGlmICggJCggdGhpcyApLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRfZW5hYmxlUGFnaW5hdGlvbiA9IHRydWU7XG5cdFx0fVxuXG5cdFx0ZW5hYmxlUGFnaW5hdGlvbiggX2VuYWJsZVBhZ2luYXRpb24gKTtcblx0fSApO1xuXG5cdC8vIFRvZ2dsZSBzY3JvbGwgd2luZG93IGZpZWxkcy5cblx0ZnVuY3Rpb24gc2Nyb2xsV2luZG93KCB2YWx1ZSApIHtcblx0XHRjb25zdCBkZXBlbmRlbnRGaWVsZHMgPSAnLnNjcm9sbC13aW5kb3ctZGVwZW5kZW50LWZpZWxkcywnICtcblx0XHRcdCcuc2Nyb2xsLXdpbmRvdy1jdXN0b20tZWxlbWVudC1pbnB1dCwnICtcblx0XHRcdCcuc2V0dGluZ3MtdGFibGUtc2Nyb2xsX3RvX3RvcF9vZmZzZXQnO1xuXG5cdFx0aWYgKCAnbm9uZScgPT09IHZhbHVlICkge1xuXHRcdFx0JCggZGVwZW5kZW50RmllbGRzICkuaGlkZSgpO1xuXHRcdH0gZWxzZSBpZiAoICdyZXN1bHRzJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHQkKCAnLnNjcm9sbC13aW5kb3ctZGVwZW5kZW50LWZpZWxkcywgLnNldHRpbmdzLXRhYmxlLXNjcm9sbF90b190b3Bfb2Zmc2V0JyApLnNob3coKTtcblx0XHRcdCQoICcuc2Nyb2xsLXdpbmRvdy1jdXN0b20tZWxlbWVudC1pbnB1dCcgKS5oaWRlKCk7XG5cdFx0fSBlbHNlIGlmICggJ2N1c3RvbScgPT09IHZhbHVlICkge1xuXHRcdFx0JCggJy5zY3JvbGwtd2luZG93LWRlcGVuZGVudC1maWVsZHMsIC5zZXR0aW5ncy10YWJsZS1zY3JvbGxfdG9fdG9wX29mZnNldCcgKS5zaG93KCk7XG5cdFx0XHQkKCAnLnNjcm9sbC13aW5kb3ctY3VzdG9tLWVsZW1lbnQtaW5wdXQnICkuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkKCBkZXBlbmRlbnRGaWVsZHMgKS5zaG93KCk7XG5cdFx0fVxuXHR9XG5cblx0Y29uc3QgJHNjcm9sbFdpbmRvdyA9ICQoICcjc2Nyb2xsX3dpbmRvdycgKTtcblxuXHRzY3JvbGxXaW5kb3coICRzY3JvbGxXaW5kb3cudmFsKCkgKTtcblxuXHQkc2Nyb2xsV2luZG93Lm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgdmFsdWUgPSAkKCB0aGlzICkudmFsKCk7XG5cblx0XHRzY3JvbGxXaW5kb3coIHZhbHVlICk7XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBUaGUgcHJvZHVjdCBzdGF0dXMgZmllbGQuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICB3cHRvb2xzLmlvXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcblxuXHRjb25zdCB0YWJsZUlkZW50aWZpZXIgPSAnLnByb2R1Y3Qtc3RhdHVzLW9wdGlvbnMtdGFibGUnO1xuXHRjb25zdCB2YWx1ZUlkZW50aWZpZXIgPSAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXByb2R1Y3Rfc3RhdHVzX29wdGlvbnMgaW5wdXQnO1xuXHRjb25zdCByb3dUZW1wbGF0ZUlkICAgPSAnd2NhcGYtcHJvZHVjdC1zdGF0dXMtb3B0aW9uJztcblxuXHRpbml0TWFudWFsT3B0aW9uc1RhYmxlKCB0YWJsZUlkZW50aWZpZXIsIHZhbHVlSWRlbnRpZmllciwgcm93VGVtcGxhdGVJZCApO1xuXG59ICk7XG4iLCIvKipcbiAqIFRoZSB0b2dnbGUgdmlzaWJpbGl0eSBzY3JpcHRzLlxuICpcbiAqIE5PVEU6IFRoZXNlIHNjcmlwdHMgbXVzdCBiZSBsb2NhdGVkIGF0IHRoZSB2ZXJ5IGJvdHRvbSBvZiB0aGUgY29tYmluZWQgc2NyaXB0cy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0Y29uc3QgZGVwZW5kYW50RGF0YSA9IFtcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtdGV4dC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RleHQnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtbnVtYmVyLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbnVtYmVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5pbnB1dC10eXBlLWRhdGUtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdkYXRlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy52YWx1ZS1kZWNpbWFsLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbnVtYmVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjaGVja2JveCcsICdtdWx0aS1zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFkaW8nLCAnc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdzZWxlY3QnLCAnbXVsdGktc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2F0ZWdvcnlfaW1hZ2VzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbWFnZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlcicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbGFiZWwnLCAnY29sb3InLCAnaW1hZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmNvbHVtbi1ncm91cC1jdXN0b21fYXBwZWFyYW5jZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY29sb3InLCAnaW1hZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtaGllcmFyY2hpY2FsIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV9kZWNpbWFsIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXZhbHVlX2RlY2ltYWxfcGxhY2VzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1nZXRfb3B0aW9ucyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5jb2x1bW4tZ3JvdXAtbWV0YV9rZXlfbWFudWFsX29wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ21hbnVhbF9lbnRyeScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2Rpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zbGlkZXJfZGlzcGxheV92YWx1ZXNfYXMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NsaWRlcicgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxpZ25fdmFsdWVzX2F0X3RoZV9lbmQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NsaWRlcicgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3F1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2VsZWN0X2FsbF9pdGVtc19sYWJlbCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfdXNlX2Nob3NlbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfZW5hYmxlX211bHRpcGxlX2ZpbHRlcicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zaG93X2NvdW50Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnLCAncmFuZ2VfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9oaWRlX2VtcHR5Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnLCAncmFuZ2VfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1kZWNpbWFsLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJywgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcsICdyYW5nZV9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3VzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9nZXRfb3B0aW9ucyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItYXV0b21hdGljLW9wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2F1dG9tYXRpY2FsbHknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbWFudWFsX2VudHJ5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kYXRlX2Rpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmRhdGUtdG8tdWktb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5wdXRfZGF0ZV9yYW5nZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGF0ZV9mb3JtYXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2lucHV0X2RhdGUnLCAnaW5wdXRfZGF0ZV9yYW5nZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtc2hvd19kYXRlX2lucHV0c19pbmxpbmUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2lucHV0X2RhdGVfcmFuZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmRhdGUtcGlja2VyLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5wdXRfZGF0ZScsICdpbnB1dF9kYXRlX3JhbmdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9jaGVja2JveCcsICd0aW1lX3BlcmlvZF9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2Rfc2VsZWN0X2FsbF9pdGVtc19sYWJlbCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfcmFkaW8nLCAndGltZV9wZXJpb2Rfc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF91c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9zZWxlY3QnLCAndGltZV9wZXJpb2RfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXInLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9zaG93X2NvdW50Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9jaGVja2JveCcsICd0aW1lX3BlcmlvZF9yYWRpbycsICd0aW1lX3BlcmlvZF9zZWxlY3QnLCAndGltZV9wZXJpb2RfbXVsdGlzZWxlY3QnLCAndGltZV9wZXJpb2RfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2hpZGVfZW1wdHknLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2NoZWNrYm94JywgJ3RpbWVfcGVyaW9kX3JhZGlvJywgJ3RpbWVfcGVyaW9kX3NlbGVjdCcsICd0aW1lX3BlcmlvZF9tdWx0aXNlbGVjdCcsICd0aW1lX3BlcmlvZF9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfdXNlX2Nob3NlbiBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfc29mdF9saW1pdCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1zb2Z0X2xpbWl0Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10YXhvbm9teSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jdXN0b20tdGF4b25vbXkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWV0YV9rZXkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcG9zdF9wcm9wZXJ0eSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1saW1pdF9vcHRpb25zIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcGFyZW50X3Rlcm0nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NoaWxkJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1saW1pdF92YWx1ZXNfYnlfaWQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2luY2x1ZGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWV4Y2x1ZGVfdmFsdWVzX2lkJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdleGNsdWRlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfYWNjb3JkaW9uIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFjY29yZGlvbl9kZWZhdWx0X3N0YXRlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfbXVsdGlwbGVfZmlsdGVyIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2F0ZWdvcnlfaW1hZ2VzIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX2NsZWFyX2FsbF9idXR0b24gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuY2xlYXItYWxsLWJ1dHRvbi1maWVsZHMtc3RhcnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNob3dfaWZfZW1wdHkgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW1wdHlfZmlsdGVyX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNob3dfdGl0bGUgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbW92ZV9jbGVhcl9hbGxfYnV0dG9uX2luX3RpdGxlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1vcmRlcl90ZXJtc19ieSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hY3RpdmVfZmlsdGVyc19sYXlvdXQgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuc2ltcGxlLWxheW91dC1zb2Z0LWZpZWxkcy1zdGFydCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnc2ltcGxlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5leHRlbmRlZC1sYXlvdXQtc29mdC1maWVsZHMtc3RhcnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2V4dGVuZGVkJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfc29mdF9saW1pdF9mb3JfZXh0ZW5kZWRfbGF5b3V0IGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNvZnRfbGltaXRfZm9yX2V4dGVuZGVkX2xheW91dCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX3Rvb2x0aXAgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtc2hvd19jb3VudF9pbl90b29sdGlwJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10b29sdGlwX3Bvc2l0aW9uJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRdO1xuXG5cdGZ1bmN0aW9uIF9oYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBjdXJyZW50U2VsZWN0b3IsIHZhbHVlICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgID0gY3VycmVudFNlbGVjdG9yLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCBoYW5kbGVyICAgICA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdGNvbnN0IGhhbmRsZXJUeXBlID0gZGF0YVsgJ2hhbmRsZXJUeXBlJyBdO1xuXHRcdGNvbnN0IGRlcGVuZGFudCAgID0gZGF0YVsgJ2RlcGVuZGFudCcgXTtcblxuXHRcdGxldCBfdmFsdWUgPSB2YWx1ZTtcblxuXHRcdGlmICggJ2NoZWNrYm94JyA9PT0gaGFuZGxlclR5cGUgKSB7XG5cdFx0XHRfdmFsdWUgPSBjdXJyZW50U2VsZWN0b3IuaXMoICc6Y2hlY2tlZCcgKSA/ICcxJyA6ICcwJztcblx0XHR9XG5cblx0XHRpZiAoICdyYWRpbycgPT09IGhhbmRsZXJUeXBlICkge1xuXHRcdFx0X3ZhbHVlID0gJGZpZWxkLmZpbmQoIGhhbmRsZXIgKyAnOmNoZWNrZWQnICkudmFsKCk7XG5cdFx0fVxuXG5cdFx0JC5lYWNoKCBkZXBlbmRhbnQsIGZ1bmN0aW9uKCBpZCwgZCApIHtcblx0XHRcdGNvbnN0ICRzZWxlY3RvciAgID0gJGZpZWxkLmZpbmQoIGRbICdzZWxlY3RvcicgXSApO1xuXHRcdFx0Y29uc3QgdmFsaWRWYWx1ZXMgPSBkWyAndmFsdWUnIF07XG5cblx0XHRcdGlmICggdmFsaWRWYWx1ZXMuaW5jbHVkZXMoIF92YWx1ZSApICkge1xuXHRcdFx0XHQkc2VsZWN0b3Iuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHNlbGVjdG9yLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHRmaWVsZFdyYXBwZXIudHJpZ2dlciggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgWyBoYW5kbGVyLCBfdmFsdWUsICRmaWVsZCBdICk7XG5cdH1cblxuXHRmdW5jdGlvbiBoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBjdXJyZW50U2VsZWN0b3IsIHZhbHVlICkge1xuXHRcdGlmICggbnVsbCA9PT0gY3VycmVudFNlbGVjdG9yICkge1xuXHRcdFx0Y29uc3QgaGFuZGxlciAgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRcdGNvbnN0ICRoYW5kbGVyID0gJCggaGFuZGxlciApO1xuXG5cdFx0XHQkLmVhY2goICRoYW5kbGVyLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgX3RoaXMgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBfdmFsdWUgPSBfdGhpcy52YWwoKTtcblx0XHRcdFx0X2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIF90aGlzLCBfdmFsdWUgKTtcblx0XHRcdH0gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0X2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBzZXR1cEZpZWxkKCBpbml0YWwgPSBmYWxzZSApIHtcblx0XHQkLmVhY2goIGRlcGVuZGFudERhdGEsIGZ1bmN0aW9uKCBpLCBkYXRhICkge1xuXHRcdFx0Y29uc3QgaGFuZGxlciA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdFx0Y29uc3QgZXZlbnQgICA9IGRhdGFbICdldmVudCcgXTtcblxuXHRcdFx0aGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgbnVsbCwgbnVsbCApO1xuXG5cdFx0XHRpZiAoIGluaXRhbCApIHtcblx0XHRcdFx0ZmllbGRXcmFwcGVyLm9uKCBldmVudCwgaGFuZGxlciwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgX3RoaXMgID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdGNvbnN0IF92YWx1ZSA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0XHRoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBfdGhpcywgX3ZhbHVlICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRpZiAoICEgJCggZmllbGRXcmFwcGVyICkuaGFzQ2xhc3MoICdsb2FkZWQnICkgKSB7XG5cdFx0XHRcdFx0JCggZmllbGRXcmFwcGVyICkuYWRkQ2xhc3MoICdsb2FkZWQnICk7XG5cblx0XHRcdFx0XHRmaWVsZFdyYXBwZXIudHJpZ2dlciggJ2ZpZWxkX2FkZGVkJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0c2V0dXBGaWVsZCggdHJ1ZSApO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gVG9nZ2xlIHRoZSB2aXNpYmlsaXR5IG9mIHN1YmZpZWxkcy5cblx0XHRzZXR1cEZpZWxkKCk7XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBWaXNpYmlsaXR5IHJ1bGVzLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMS4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgd3B0b29scy5pb1xuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgJHZpc2liaWxpdHlSdWxlcyA9ICQoICcudmlzaWJpbGl0eS1ydWxlcycgKTtcblxuXHQvLyBDaGFuZ2UgdGhlIHZhbHVlIGRyb3Bkb3duIGFjY29yZGluZyB0byB0aGUgc2VsZWN0ZWQgcnVsZS5cblx0JHZpc2liaWxpdHlSdWxlcy5vbiggJ2NoYW5nZScsICcucnVsZScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IF90aGlzID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IHJ1bGUgID0gX3RoaXMudmFsKCk7XG5cdFx0Y29uc3QgJHJvdyAgPSBfdGhpcy5jbG9zZXN0KCAndHInICk7XG5cblx0XHQkcm93LmZpbmQoICcudmFsdWUgc2VsZWN0JyApLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdCRyb3cuZmluZCggJy5mb3ItJyArIHJ1bGUgKS5hZGRDbGFzcyggJ2FjdGl2ZScgKTtcblxuXHRcdCR2aXNpYmlsaXR5UnVsZXMudHJpZ2dlciggJ3Zpc2liaWxpdHlfcnVsZXNfY2hhbmdlZCcgKTtcblx0fSApO1xuXG5cdC8vIEFkZCBhbmQgY2xhdXNlLlxuXHQkdmlzaWJpbGl0eVJ1bGVzLm9uKCAnY2xpY2snLCAnLmFkZC1hbmQtY2xhdXNlLWJ0bicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IF90aGlzICAgICAgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgYW5kQ2xhdXNlcyAgICA9IF90aGlzLmNsb3Nlc3QoICd0Ym9keScgKTtcblx0XHRjb25zdCBsYXN0QW5kQ2xhdXNlID0gYW5kQ2xhdXNlcy5jaGlsZHJlbigpLmxhc3QoKS5jbG9uZSgpO1xuXG5cdFx0bGFzdEFuZENsYXVzZS5maW5kKCAnc2VsZWN0LnJ1bGUnICkucHJvcCggJ3NlbGVjdGVkSW5kZXgnLCAwICk7XG5cdFx0bGFzdEFuZENsYXVzZS5maW5kKCAnc2VsZWN0Lm9wZXJhdG9yJyApLnByb3AoICdzZWxlY3RlZEluZGV4JywgMCApO1xuXHRcdGxhc3RBbmRDbGF1c2UuZmluZCggJy52YWx1ZSBzZWxlY3QnICkucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0bGFzdEFuZENsYXVzZS5maW5kKCAnLnZhbHVlIHNlbGVjdDpmaXJzdC1jaGlsZCcgKS5hZGRDbGFzcyggJ2FjdGl2ZScgKTtcblxuXHRcdGFuZENsYXVzZXMuYXBwZW5kKCBsYXN0QW5kQ2xhdXNlICk7XG5cblx0XHQkdmlzaWJpbGl0eVJ1bGVzLnRyaWdnZXIoICd2aXNpYmlsaXR5X3J1bGVzX2NoYW5nZWQnICk7XG5cdH0gKTtcblxuXHQvLyBBZGRzIGEgbmV3IHJ1bGUgZ3JvdXBcblx0JHZpc2liaWxpdHlSdWxlcy5vbiggJ2NsaWNrJywgJy5hZGQtbmV3LXJ1bGUtYnRuJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgX3RoaXMgICAgICAgICAgICAgICAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IHZpc2liaWxpdHlSdWxlcyAgICAgICAgICA9IF90aGlzLmNsb3Nlc3QoICcudmlzaWJpbGl0eS1ydWxlcycgKTtcblx0XHRjb25zdCB2aXNpYmlsaXR5UnVsZXNHcm91cCAgICAgPSB2aXNpYmlsaXR5UnVsZXMuZmluZCggJy52aXNpYmlsaXR5LXJ1bGVzLWdyb3VwJyApO1xuXHRcdGNvbnN0IGxhc3RWaXNpYmlsaXR5UnVsZXNHcm91cCA9IHZpc2liaWxpdHlSdWxlc0dyb3VwLmNoaWxkcmVuKCkubGFzdCgpLmNsb25lKCk7XG5cdFx0Y29uc3QgbGFzdFZpc2liaWxpdHlSdWxlICAgICAgID0gbGFzdFZpc2liaWxpdHlSdWxlc0dyb3VwLmZpbmQoICd0Ym9keScgKS5jaGlsZHJlbigpLmxhc3QoKS5jbG9uZSgpO1xuXG5cdFx0bGFzdFZpc2liaWxpdHlSdWxlLmZpbmQoICdzZWxlY3QucnVsZScgKS5wcm9wKCAnc2VsZWN0ZWRJbmRleCcsIDAgKTtcblx0XHRsYXN0VmlzaWJpbGl0eVJ1bGUuZmluZCggJ3NlbGVjdC5vcGVyYXRvcicgKS5wcm9wKCAnc2VsZWN0ZWRJbmRleCcsIDAgKTtcblx0XHRsYXN0VmlzaWJpbGl0eVJ1bGUuZmluZCggJy52YWx1ZSBzZWxlY3QnICkucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0bGFzdFZpc2liaWxpdHlSdWxlLmZpbmQoICcudmFsdWUgc2VsZWN0OmZpcnN0LWNoaWxkJyApLmFkZENsYXNzKCAnYWN0aXZlJyApO1xuXG5cdFx0bGFzdFZpc2liaWxpdHlSdWxlc0dyb3VwLmZpbmQoICd0Ym9keScgKS5odG1sKCBsYXN0VmlzaWJpbGl0eVJ1bGUgKTtcblx0XHR2aXNpYmlsaXR5UnVsZXNHcm91cC5hcHBlbmQoIGxhc3RWaXNpYmlsaXR5UnVsZXNHcm91cCApO1xuXG5cdFx0JHZpc2liaWxpdHlSdWxlcy50cmlnZ2VyKCAndmlzaWJpbGl0eV9ydWxlc19jaGFuZ2VkJyApO1xuXHR9ICk7XG5cblx0Ly8gUmVtb3ZlcyBhIHJ1bGUgZ3JvdXBcblx0JHZpc2liaWxpdHlSdWxlcy5vbiggJ2NsaWNrJywgJy5yZW1vdmUtc2luZ2xlLWxpbmUtcnVsZS1idG4nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCBfdGhpcyAgICAgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCBydWxlc0dyb3VwICAgICA9IF90aGlzLmNsb3Nlc3QoICcudmlzaWJpbGl0eS1ydWxlcy1ncm91cCcgKTtcblx0XHRjb25zdCBzaW5nbGVMaW5lUnVsZSA9IF90aGlzLmNsb3Nlc3QoICcuc2luZ2xlLWxpbmUtcnVsZScgKTtcblx0XHRjb25zdCB0Ym9keSAgICAgICAgICA9IF90aGlzLmNsb3Nlc3QoICd0Ym9keScgKTtcblx0XHRjb25zdCB0ciAgICAgICAgICAgICA9IF90aGlzLmNsb3Nlc3QoICd0cicgKTtcblxuXHRcdGxldCBjYW5SZW1vdmVGcm9tVEJvZHkgPSBmYWxzZTtcblx0XHRsZXQgY2FuUmVtb3ZlRnJvbUdyb3VwID0gZmFsc2U7XG5cblx0XHRpZiAoIHRib2R5LmNoaWxkcmVuKCkubGVuZ3RoID4gMSApIHtcblx0XHRcdGNhblJlbW92ZUZyb21UQm9keSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKCBydWxlc0dyb3VwLmNoaWxkcmVuKCkubGVuZ3RoID4gMSApIHtcblx0XHRcdGNhblJlbW92ZUZyb21Hcm91cCA9IHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKCAhIGNhblJlbW92ZUZyb21UQm9keSAmJiAhIGNhblJlbW92ZUZyb21Hcm91cCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0ci5yZW1vdmUoKTtcblxuXHRcdGlmICggISB0Ym9keS5jaGlsZHJlbigpLmxlbmd0aCApIHtcblx0XHRcdHNpbmdsZUxpbmVSdWxlLnJlbW92ZSgpO1xuXHRcdH1cblxuXHRcdCR2aXNpYmlsaXR5UnVsZXMudHJpZ2dlciggJ3Zpc2liaWxpdHlfcnVsZXNfY2hhbmdlZCcgKTtcblx0fSApO1xuXG5cdCR2aXNpYmlsaXR5UnVsZXMub24oICdjaGFuZ2UnLCAnLm9wZXJhdG9yLCAudmFsdWUgc2VsZWN0JywgZnVuY3Rpb24oKSB7XG5cdFx0JHZpc2liaWxpdHlSdWxlcy50cmlnZ2VyKCAndmlzaWJpbGl0eV9ydWxlc19jaGFuZ2VkJyApO1xuXHR9ICk7XG5cblx0Ly8gR2V0cyB0aGUgdmlzaWJpbGl0eSBydWxlcyhhbmQsIG9yIGNsYXVzZXMpICBhcyBhcnJheS5cblx0ZnVuY3Rpb24gZ2V0VmlzaWJpbGl0eVJ1bGVzKCkge1xuXHRcdGNvbnN0IHNpbmdsZUxpbmVSdWxlcyA9ICR2aXNpYmlsaXR5UnVsZXMuZmluZCggJy5zaW5nbGUtbGluZS1ydWxlJyApO1xuXHRcdGNvbnN0IHJ1bGVzICAgICAgICAgICA9IFtdO1xuXG5cdFx0c2luZ2xlTGluZVJ1bGVzLmVhY2goIGZ1bmN0aW9uKCBrZXksIHNpbmdsZUxpbmVSdWxlICkge1xuXHRcdFx0Y29uc3QgdGJvZHkgICAgICA9ICQoIHNpbmdsZUxpbmVSdWxlICkuZmluZCggJ3Rib2R5JyApO1xuXHRcdFx0Y29uc3QgYW5kQ2xhdXNlcyA9IFtdO1xuXG5cdFx0XHR0Ym9keS5jaGlsZHJlbigpLmVhY2goIGZ1bmN0aW9uKCBpbmRleCwgX2FuZENsYXVzZSApIHtcblx0XHRcdFx0Y29uc3QgYW5kQ2xhdXNlID0gJCggX2FuZENsYXVzZSApO1xuXHRcdFx0XHRjb25zdCBydWxlICAgICAgPSBhbmRDbGF1c2UuZmluZCggJ3NlbGVjdC5ydWxlJyApLnZhbCgpO1xuXHRcdFx0XHRjb25zdCBvcGVyYXRvciAgPSBhbmRDbGF1c2UuZmluZCggJ3NlbGVjdC5vcGVyYXRvcicgKS52YWwoKTtcblx0XHRcdFx0Y29uc3QgdmFsdWUgICAgID0gYW5kQ2xhdXNlLmZpbmQoICcudmFsdWUgc2VsZWN0LmFjdGl2ZScgKS52YWwoKTtcblxuXHRcdFx0XHRhbmRDbGF1c2VzLnB1c2goIFsgcnVsZSwgb3BlcmF0b3IsIHZhbHVlIF0gKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0cnVsZXMucHVzaCggYW5kQ2xhdXNlcyApO1xuXHRcdH0gKTtcblxuXHRcdHJldHVybiBydWxlcztcblx0fVxuXG5cdCR2aXNpYmlsaXR5UnVsZXMub24oICd2aXNpYmlsaXR5X3J1bGVzX2NoYW5nZWQnLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCBydWxlcyAgICAgPSBnZXRWaXNpYmlsaXR5UnVsZXMoKTtcblx0XHRjb25zdCByYXdWYWx1ZXMgPSBlbmNvZGVVUklDb21wb25lbnQoIEpTT04uc3RyaW5naWZ5KCBydWxlcyApICk7XG5cblx0XHQkKCAnI3Zpc2liaWxpdHlfcnVsZXMnICkudmFsKCByYXdWYWx1ZXMgKTtcblx0fSApO1xuXG59ICk7XG4iXX0=
