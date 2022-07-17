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
    var template = wp.template('wcapf-filter-form-item');
    var rendered = template({
      title: filterTitle,
      id: filterId,
      key: filterKey
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
   * Toggle the filter.
   */

  function toggleFilter(e) {
    var target = e.target;
    var widget = $(this).closest('.widget');
    var toggleBtn = widget.find('.widget-action');
    var inside = widget.children('.widget-inside');
    var isExpand = toggleBtn.attr('aria-expanded');
    var toggleExpand = 'true' === isExpand ? 'false' : 'true';
    toggleBtn.attr('aria-expanded', toggleExpand);
    $(inside).slideToggle('fast', function () {
      widget.toggleClass('open');
      formData.trigger('widget-closed', [target]);
    });
  }

  formData.on('click', '.widget-top', toggleFilter);
  formData.on('click', '.widget-control-close', toggleFilter);
  /**
   * Focus the form field's expand button.
   */

  function focusField(e, target) {
    if (target.classList.contains('widget-control-close')) {
      var widget = $(target).closest('.widget');
      var action = widget.find('.widget-action');
      action.attr('aria-expanded', 'false').focus();
    }
  }

  formData.on('widget-closed', focusField);
  /**
   * Remove the field.
   */

  function removeField() {
    var widget = $(this).closest('.widget');
    $(widget).slideUp('fast', function () {
      widget.remove();
    });
  }

  formData.on('click', '.widget-control-remove', removeField);
  /**
   * Filter form menu.
   */

  var $filterFormNavItem = $('.filter-form-menu .nav-tab');
  $filterFormNavItem.on('click', function () {
    var $this = $(this);
    var $content = $('.tab-' + $this.attr('data-for'));
    $filterFormNavItem.removeClass('nav-tab-active');
    $this.addClass('nav-tab-active');
    $('.tab-content').hide();
    $content.show();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbS1hcHBlYXJhbmNlLWZpZWxkcy5qcyIsImRpc3BsYXktdHlwZS1maWVsZHMuanMiLCJmaWVsZC1tZXRhLWJveC5qcyIsImZpbHRlci1mb3JtLW1ldGEtYm94LmpzIiwibWFudWFsLW9wdGlvbnMtdGFibGUuanMiLCJudW1iZXItdWktb3B0aW9ucy5qcyIsInBsdWdpbi1zZXR0aW5ncy5qcyIsInByb2R1Y3Qtc3RhdHVzLXRhYmxlLmpzIiwidG9nZ2xlVmlzaWJpbGl0eS5qcyJdLCJuYW1lcyI6WyJqUXVlcnkiLCJkb2N1bWVudCIsInJlYWR5IiwiJCIsImZpZWxkV3JhcHBlciIsIm9uIiwiZSIsImhhbmRsZXIiLCJ2YWx1ZSIsIiRmaWVsZCIsIiRxdWVyeVR5cGUiLCJmaW5kIiwidmFsaWREaXNwbGF5VHlwZXMiLCJpbmNsdWRlcyIsIiRtdWx0aXBsZUZpbHRlciIsImlzIiwic2hvdyIsImhpZGUiLCIkZGlzcGxheVR5cGUiLCJkaXNwbGF5VHlwZSIsInZhbCIsIiRockZpZWxkcyIsIiRoaWVyYXJjaGljYWwiLCJ1c2VIaWVyYXJjaGljYWwiLCIkaHJBY2NvcmRpb24iLCIkbm9SZXN1bHRzIiwiJGFsbEl0ZW1zTGFiZWwiLCJ1c2VDaG9zZW4iLCJmaWVsZElucHV0IiwiZmllbGRTdGF0ZXMiLCJzdG9yZUZpZWxkU3RhdGUiLCJmaWVsZFR5cGUiLCJhdHRyIiwiZmllbGRWYWx1ZXMiLCJlYWNoIiwiJGlucHV0IiwidHlwZSIsIm5hbWUiLCJtYW51YWxPcHRpb25zIiwidXBkYXRlRmllbGRTdGF0ZSIsIiRlbG0iLCJmaWVsZFN0YXRlIiwiaGFzQ2xhc3MiLCJtYW51YWxfb3B0aW9ucyIsIiR0aGlzIiwiYXBwbHlGaWVsZFN0YXRlIiwicmVtb3ZlQXR0ciIsInJhd09wdGlvbnMiLCJpbnB1dE5hbWUiLCJyYXciLCIkcmF3SW5wdXQiLCJKU09OIiwicGFyc2UiLCJkZWNvZGVVUklDb21wb25lbnQiLCJsZW5ndGgiLCJ0YWJsZUlkZW50aWZpZXIiLCJyb3dUZW1wbGF0ZUlkIiwicm93c0lkZW50aWZpZXIiLCJyb3dJZGVudGlmaWVyIiwiJHRhYmxlIiwiJHJvd3MiLCJpIiwib3B0aW9uIiwidGVtcGxhdGUiLCJ3cCIsInJvd0RlZmF1bHRPcHRpb25zIiwicmVuZGVyZWQiLCJhcHBlbmQiLCIkbGFzdFJvdyIsImxhc3QiLCJhZGRDbGFzcyIsInRyaWdnZXIiLCJfZmllbGRUeXBlIiwiZmllbGROYW1lIiwiZmllbGREYXRhV3JhcHBlciIsImZpZWxkTmFtZVdyYXBwZXIiLCJmaWVsZEluc2lkZSIsInJlbW92ZUNsYXNzIiwiaHRtbCIsImZvcm1EYXRhIiwiJGRyb3Bkb3duIiwiJGFkZEZpbHRlckJ0biIsIiRzZWxlY3RlZCIsImZpbHRlcklkIiwiZmlsdGVyVGl0bGUiLCJmaWx0ZXJLZXkiLCJ0aXRsZSIsImlkIiwia2V5IiwicHJlcGVuZCIsInByb3AiLCJzb3J0YWJsZSIsImlkZW50aWZpZXIiLCJjb250YWluZXIiLCJvcGFjaXR5IiwicmV2ZXJ0IiwiY3Vyc29yIiwiYXhpcyIsImhhbmRsZSIsImNhbmNlbCIsIml0ZW1zIiwicGxhY2Vob2xkZXIiLCJ0b2dnbGVGaWx0ZXIiLCJ0YXJnZXQiLCJ3aWRnZXQiLCJjbG9zZXN0IiwidG9nZ2xlQnRuIiwiaW5zaWRlIiwiY2hpbGRyZW4iLCJpc0V4cGFuZCIsInRvZ2dsZUV4cGFuZCIsInNsaWRlVG9nZ2xlIiwidG9nZ2xlQ2xhc3MiLCJmb2N1c0ZpZWxkIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJhY3Rpb24iLCJmb2N1cyIsInJlbW92ZUZpZWxkIiwic2xpZGVVcCIsInJlbW92ZSIsIiRmaWx0ZXJGb3JtTmF2SXRlbSIsIiRjb250ZW50IiwiaW5pdE1hbnVhbE9wdGlvbnNUYWJsZSIsInZhbHVlSWRlbnRpZmllciIsImZpZWxkSWRlbnRpZmllciIsImluaXRTb3J0YWJsZVRhYmxlIiwiJHNlbGVjdG9yIiwidXBkYXRlIiwidHJpZ2dlck9wdGlvbnNDaGFuZ2UiLCJkaXNhYmxlU2VsZWN0aW9uIiwidGFibGVSb3dzSWRlbnRpZmllciIsIiR2YWx1ZUhvbGRlciIsIl9yb3dzIiwiX2l0ZW0iLCIkaXRlbSIsIm9iaiIsImZpZWxkSW5kZXgiLCJmaWVsZCIsInB1c2giLCJyYXdWYWx1ZXMiLCJlbmNvZGVVUklDb21wb25lbnQiLCJzdHJpbmdpZnkiLCJ0cmlnZ2VyUmVtb3ZlT3B0aW9uIiwiJG9wdGlvbnNUYWJsZSIsInRhYmxlUm93cyIsInJlbW92ZUJ0bklkZW50aWZpZXIiLCJjbGVhck9wdGlvbnNCdG5JZGVudGlmaWVyIiwiZW1wdHkiLCJhZGRPcHRpb25CdG5JZGVudGlmaWVyIiwidGV4dEZpZWxkc0lkZW50aWZpZXIiLCJzZWxlY3RGaWVsZHNJZGVudGlmaWVyIiwidGFibGVJZCIsInRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQiLCIkdGV4dEZpZWxkIiwidG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCIsImNsaWNrIiwicHJldmVudERlZmF1bHQiLCIkYnV0dG9uIiwiJHdyYXBwZXIiLCJtb2RhbFRpdGxlIiwiaW1hZ2UiLCJtZWRpYSIsIm11bHRpcGxlIiwib3BlbiIsInVwbG9hZGVkSW1hZ2UiLCJzdGF0ZSIsImdldCIsImZpcnN0IiwiaW1hZ2VEYXRhIiwidG9KU09OIiwidGh1bWJuYWlsIiwic2l6ZXMiLCJpbWFnZVVybCIsInVybCIsInRvZ2dsZUxvYWRpbmdJbWFnZSIsIiRlbmFibGVMb2FkaW5nT3ZlcmxheSIsImVuYWJsZUxvYWRpbmdPdmVybGF5IiwiX2VuYWJsZUxvYWRpbmdPdmVybGF5IiwiZW5hYmxlUGFnaW5hdGlvbiIsIiRlbmFibGVQYWdpbmF0aW9uIiwiZW5hYmxlUGFnaW5hdGlvbk9uTG9hZCIsIl9lbmFibGVQYWdpbmF0aW9uIiwic2Nyb2xsV2luZG93IiwiZGVwZW5kZW50RmllbGRzIiwiJHNjcm9sbFdpbmRvdyIsImRlcGVuZGFudERhdGEiLCJfaGFuZGxlVG9nZ2xlUmVxdWVzdCIsImRhdGEiLCJjdXJyZW50U2VsZWN0b3IiLCJoYW5kbGVyVHlwZSIsImRlcGVuZGFudCIsIl92YWx1ZSIsImQiLCJ2YWxpZFZhbHVlcyIsImhhbmRsZVRvZ2dsZVJlcXVlc3QiLCIkaGFuZGxlciIsIl90aGlzIiwic2V0dXBGaWVsZCIsImluaXRhbCIsImV2ZW50Il0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUEsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVDLENBQVYsRUFBYztBQUV2QyxNQUFNQyxZQUFZLEdBQUdELENBQUMsQ0FBRSx1QkFBRixDQUF0QjtBQUVBQyxFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUIsc0JBQWpCLEVBQXlDLFVBQVVDLENBQVYsRUFBYUMsT0FBYixFQUFzQkMsS0FBdEIsRUFBNkJDLE1BQTdCLEVBQXNDO0FBQzlFLFFBQUssZ0RBQWdERixPQUFyRCxFQUErRDtBQUM5RCxVQUFNRyxVQUFVLEdBQVVELE1BQU0sQ0FBQ0UsSUFBUCxDQUFhLGtDQUFiLENBQTFCO0FBQ0EsVUFBTUMsaUJBQWlCLEdBQUcsQ0FBRSxPQUFGLEVBQVcsT0FBWCxFQUFvQixPQUFwQixDQUExQjs7QUFFQSxVQUFLQSxpQkFBaUIsQ0FBQ0MsUUFBbEIsQ0FBNEJMLEtBQTVCLENBQUwsRUFBMkM7QUFDMUMsWUFBTU0sZUFBZSxHQUFHTCxNQUFNLENBQUNFLElBQVAsQ0FBYSxvREFBYixDQUF4Qjs7QUFFQSxZQUFLRyxlQUFlLENBQUNDLEVBQWhCLENBQW9CLFVBQXBCLENBQUwsRUFBd0M7QUFDdkNMLFVBQUFBLFVBQVUsQ0FBQ00sSUFBWDtBQUNBLFNBRkQsTUFFTztBQUNOTixVQUFBQSxVQUFVLENBQUNPLElBQVg7QUFDQTtBQUNEO0FBQ0Q7QUFDRCxHQWZEO0FBaUJBYixFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUIsc0JBQWpCLEVBQXlDLFVBQVVDLENBQVYsRUFBYUMsT0FBYixFQUFzQkMsS0FBdEIsRUFBNkJDLE1BQTdCLEVBQXNDO0FBQzlFLFFBQUsseURBQXlERixPQUE5RCxFQUF3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RUFBUSxJQUFSLEVBQWMsSUFBZCxDQUFuQjs7QUFFQSxVQUFLVyxNQUFMLEVBQWM7QUFDYm5NLFFBQUFBLFlBQVksQ0FBQ0MsRUFBYixDQUFpQm1NLEtBQWpCLEVBQXdCak0sT0FBeEIsRUFBaUMsWUFBVztBQUMzQyxjQUFNOEwsS0FBSyxHQUFJbE0sQ0FBQyxDQUFFLElBQUYsQ0FBaEI7O0FBQ0EsY0FBTTZMLE1BQU0sR0FBRzdMLENBQUMsQ0FBRSxJQUFGLENBQUQsQ0FBVWlCLEdBQVYsRUFBZjs7QUFDQStLLFVBQUFBLG1CQUFtQixDQUFFUCxJQUFGLEVBQVFTLEtBQVIsRUFBZUwsTUFBZixDQUFuQjtBQUNBLFNBSkQ7O0FBTUEsWUFBSyxDQUFFN0wsQ0FBQyxDQUFFQyxZQUFGLENBQUQsQ0FBa0JzQyxRQUFsQixDQUE0QixRQUE1QixDQUFQLEVBQWdEO0FBQy9DdkMsVUFBQUEsQ0FBQyxDQUFFQyxZQUFGLENBQUQsQ0FBa0JrRSxRQUFsQixDQUE0QixRQUE1QjtBQUVBbEUsVUFBQUEsWUFBWSxDQUFDbUUsT0FBYixDQUFzQixhQUF0QjtBQUNBO0FBQ0Q7QUFDRCxLQW5CRDtBQW9CQTs7QUFFRCtILEVBQUFBLFVBQVUsQ0FBRSxJQUFGLENBQVY7QUFFQWxNLEVBQUFBLFlBQVksQ0FBQ0MsRUFBYixDQUFpQixhQUFqQixFQUFnQyxZQUFXO0FBQzFDO0FBQ0FpTSxJQUFBQSxVQUFVO0FBQ1YsR0FIRDtBQUtBLENBN2NEIiwiZmlsZSI6IndjLWFqYXgtcHJvZHVjdC1maWx0ZXItYWRtaW4tc2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRGlzcGxheSB0eXBlIGZpZWxkcy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkcXVlcnlUeXBlICAgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXF1ZXJ5X3R5cGUnICk7XG5cdFx0XHRjb25zdCB2YWxpZERpc3BsYXlUeXBlcyA9IFsgJ2xhYmVsJywgJ2NvbG9yJywgJ2ltYWdlJyBdO1xuXG5cdFx0XHRpZiAoIHZhbGlkRGlzcGxheVR5cGVzLmluY2x1ZGVzKCB2YWx1ZSApICkge1xuXHRcdFx0XHRjb25zdCAkbXVsdGlwbGVGaWx0ZXIgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfbXVsdGlwbGVfZmlsdGVyIGlucHV0JyApO1xuXG5cdFx0XHRcdGlmICggJG11bHRpcGxlRmlsdGVyLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRcdFx0JHF1ZXJ5VHlwZS5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHF1ZXJ5VHlwZS5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfbXVsdGlwbGVfZmlsdGVyIGlucHV0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRxdWVyeVR5cGUgICAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtcXVlcnlfdHlwZScgKTtcblx0XHRcdGNvbnN0ICRkaXNwbGF5VHlwZSAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlUeXBlICAgICAgID0gJGRpc3BsYXlUeXBlLnZhbCgpO1xuXHRcdFx0Y29uc3QgdmFsaWREaXNwbGF5VHlwZXMgPSBbICdsYWJlbCcsICdjb2xvcicsICdpbWFnZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZERpc3BsYXlUeXBlcy5pbmNsdWRlcyggZGlzcGxheVR5cGUgKSApIHtcblx0XHRcdFx0aWYgKCAnMScgPT09IHZhbHVlICkge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogRGlzcGxheSB0eXBlIGZpZWxkcy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0Ly8gSGllcmFyY2hpY2FsIGZpZWxkJ3MgdG9nZ2xlIHZpc2liaWxpdHkgd2hlbiB0ZXh0IGRpc3BsYXkgdHlwZSBpcyBjaGFuZ2VkLlxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRockZpZWxkcyAgICAgICA9ICRmaWVsZC5maW5kKCAnLmhpZXJhcmNoaWNhbC1maWVsZHMnICk7XG5cdFx0XHRjb25zdCAkaGllcmFyY2hpY2FsICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1oaWVyYXJjaGljYWwnICk7XG5cdFx0XHRjb25zdCB1c2VIaWVyYXJjaGljYWwgPSAkaGllcmFyY2hpY2FsLmZpbmQoICdpbnB1dCcgKS5pcyggJzpjaGVja2VkJyApO1xuXHRcdFx0Y29uc3QgJGhyQWNjb3JkaW9uICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX2hpZXJhcmNoeV9hY2NvcmRpb24nICk7XG5cblx0XHRcdGlmICggJ2NoZWNrYm94JyA9PT0gdmFsdWUgfHwgJ3JhZGlvJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHRcdCRockZpZWxkcy5zaG93KCk7XG5cblx0XHRcdFx0aWYgKCB1c2VIaWVyYXJjaGljYWwgKSB7XG5cdFx0XHRcdFx0JGhyQWNjb3JkaW9uLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkaHJBY2NvcmRpb24uaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKCAnc2VsZWN0JyA9PT0gdmFsdWUgfHwgJ211bHRpLXNlbGVjdCcgPT09IHZhbHVlICkge1xuXHRcdFx0XHQkaHJGaWVsZHMuc2hvdygpO1xuXHRcdFx0XHQkaHJBY2NvcmRpb24uaGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGhyRmllbGRzLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHQvLyBIaWVyYXJjaGljYWwgYWNjb3JkaW9uIGZpZWxkIHRvZ2dsZSB2aXNpYmlsaXR5IHdoZW4gc2hvdyBoaWVyYXJjaHkgaXMgY2hhbmdlZC5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtaGllcmFyY2hpY2FsIGlucHV0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0IGRpc3BsYXlUeXBlICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnICkudmFsKCk7XG5cdFx0XHRjb25zdCAkaHJBY2NvcmRpb24gPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfaGllcmFyY2h5X2FjY29yZGlvbicgKTtcblxuXHRcdFx0aWYgKCAnMScgPT09IHZhbHVlICkge1xuXHRcdFx0XHRpZiAoICdjaGVja2JveCcgPT09IGRpc3BsYXlUeXBlIHx8ICdyYWRpbycgPT09IGRpc3BsYXlUeXBlICkge1xuXHRcdFx0XHRcdCRockFjY29yZGlvbi5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JGhyQWNjb3JkaW9uLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGhyQWNjb3JkaW9uLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHQvLyBPdmVycmlkZSBuby1yZXN1bHRzLW1lc3NhZ2UsIGFsbC1pdGVtcy1sYWJlbCBmaWVsZCdzIHRvZ2dsZSB2aXNpYmlsaXR5IHdoZW4gdGV4dCBkaXNwbGF5IHR5cGUgaXMgY2hhbmdlZC5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0XHRjb25zdCAkYWxsSXRlbXNMYWJlbCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRcdGNvbnN0IHVzZUNob3NlbiAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcgKS5pcyggJzpjaGVja2VkJyApO1xuXG5cdFx0XHRpZiAoIHVzZUNob3NlbiAmJiAoICdzZWxlY3QnID09PSB2YWx1ZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgKSApIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCAoICdyYWRpbycgPT09IHZhbHVlIHx8ICdzZWxlY3QnID09PSB2YWx1ZSApIHx8ICggJ211bHRpLXNlbGVjdCcgPT09IHZhbHVlICYmIHVzZUNob3NlbiApICkge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gT3ZlcnJpZGUgbm8tcmVzdWx0cy1tZXNzYWdlLCBhbGwtaXRlbXMtbGFiZWwgZmllbGQncyB0b2dnbGUgdmlzaWJpbGl0eSB3aGVuIHRleHQgdXNlIGNob3NlbiBpcyBjaGFuZ2VkLlxuXHRmaWVsZFdyYXBwZXIub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScgKTtcblx0XHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyApO1xuXHRcdFx0Y29uc3QgZGlzcGxheVR5cGUgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoICcxJyA9PT0gdmFsdWUgJiYgKCAnc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgfHwgJ211bHRpLXNlbGVjdCcgPT09IGRpc3BsYXlUeXBlICkgKSB7XG5cdFx0XHRcdCRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChcblx0XHRcdFx0KCAnMScgPT09IHZhbHVlICYmICdtdWx0aS1zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0XHRcdHx8ICggJ3JhZGlvJyA9PT0gZGlzcGxheVR5cGUgfHwgJ3NlbGVjdCcgPT09IGRpc3BsYXlUeXBlIClcblx0XHRcdCkge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogRmllbGQgbWV0YSBib3guXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICB3cHRvb2xzLmlvXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXHRjb25zdCBmaWVsZElucHV0ICAgPSAnW25hbWVdOm5vdCgubWFudWFsX29wdGlvbnMpJztcblx0Y29uc3QgZmllbGRTdGF0ZXMgID0ge307XG5cblx0ZnVuY3Rpb24gc3RvcmVGaWVsZFN0YXRlKCkge1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9IGZpZWxkV3JhcHBlci5maW5kKCAnI2ZpZWxkX2RhdGEnICkuYXR0ciggJ2RhdGEtZmllbGQtdHlwZScgKTtcblxuXHRcdGlmICggISBmaWVsZFR5cGUgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZmllbGRWYWx1ZXMgPSB7fTtcblxuXHRcdGZpZWxkV3JhcHBlci5maW5kKCBmaWVsZElucHV0ICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCB0eXBlICAgPSAkaW5wdXQuYXR0ciggJ3R5cGUnICk7XG5cdFx0XHRjb25zdCBuYW1lICAgPSAkaW5wdXQuYXR0ciggJ25hbWUnICk7XG5cdFx0XHRjb25zdCB2YWx1ZSAgPSAkaW5wdXQudmFsKCk7XG5cblx0XHRcdGlmICggJ2NoZWNrYm94JyA9PT0gdHlwZSB8fCAncmFkaW8nID09PSB0eXBlICkge1xuXHRcdFx0XHRpZiAoICRpbnB1dC5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0XHRcdGZpZWxkVmFsdWVzWyBuYW1lIF0gPSB2YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZmllbGRWYWx1ZXNbIG5hbWUgXSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdC8vIEhhbmRsZSBtYW51YWwgb3B0aW9ucy5cblx0XHRjb25zdCBtYW51YWxPcHRpb25zID0ge307XG5cblx0XHRmaWVsZFdyYXBwZXIuZmluZCggJy5tYW51YWxfb3B0aW9ucycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblx0XHRcdGNvbnN0IG5hbWUgICA9ICRpbnB1dC5hdHRyKCAnbmFtZScgKTtcblxuXHRcdFx0bWFudWFsT3B0aW9uc1sgbmFtZSBdID0gJGlucHV0LnZhbCgpO1xuXHRcdH0gKTtcblxuXHRcdGZpZWxkVmFsdWVzWyAnbWFudWFsX29wdGlvbnMnIF0gPSBtYW51YWxPcHRpb25zO1xuXG5cdFx0ZmllbGRTdGF0ZXNbIGZpZWxkVHlwZSBdID0gZmllbGRWYWx1ZXM7XG5cdH1cblxuXHRmdW5jdGlvbiB1cGRhdGVGaWVsZFN0YXRlKCAkZWxtICkge1xuXHRcdGNvbnN0IGZpZWxkVHlwZSAgPSBmaWVsZFdyYXBwZXIuZmluZCggJyNmaWVsZF9kYXRhJyApLmF0dHIoICdkYXRhLWZpZWxkLXR5cGUnICk7XG5cdFx0Y29uc3QgZmllbGRTdGF0ZSA9IGZpZWxkU3RhdGVzWyBmaWVsZFR5cGUgXTtcblxuXHRcdGNvbnN0IG5hbWUgID0gJGVsbS5hdHRyKCAnbmFtZScgKTtcblx0XHRjb25zdCB0eXBlICA9ICRlbG0uYXR0ciggJ3R5cGUnICk7XG5cdFx0Y29uc3QgdmFsdWUgPSAkZWxtLnZhbCgpO1xuXG5cdFx0aWYgKCAkZWxtLmhhc0NsYXNzKCAnbWFudWFsX29wdGlvbnMnICkgKSB7XG5cdFx0XHRjb25zdCBtYW51YWxfb3B0aW9ucyA9IGZpZWxkU3RhdGVbICdtYW51YWxfb3B0aW9ucycgXSB8fCB7fTtcblxuXHRcdFx0bWFudWFsX29wdGlvbnNbIG5hbWUgXSA9IHZhbHVlO1xuXG5cdFx0XHRmaWVsZFN0YXRlWyAnbWFudWFsX29wdGlvbnMnIF0gPSBtYW51YWxfb3B0aW9ucztcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKCAnY2hlY2tib3gnID09PSB0eXBlIHx8ICdyYWRpbycgPT09IHR5cGUgKSB7XG5cdFx0XHRcdGNvbnN0ICRpbnB1dCA9IGZpZWxkV3JhcHBlci5maW5kKCAnW25hbWU9XCInICsgbmFtZSArICdcIl0nICk7XG5cblx0XHRcdFx0aWYgKCAkaW5wdXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdFx0XHRmaWVsZFN0YXRlWyBuYW1lIF0gPSB2YWx1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRkZWxldGUgZmllbGRTdGF0ZVsgbmFtZSBdO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmaWVsZFN0YXRlWyBuYW1lIF0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBTdG9yZSB0aGUgaW5pdGlhbCBmaWVsZCBzdGF0ZS5cblx0c3RvcmVGaWVsZFN0YXRlKCk7XG5cblx0ZmllbGRXcmFwcGVyLmZpbmQoICdbbmFtZV0nICkub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdHVwZGF0ZUZpZWxkU3RhdGUoICR0aGlzICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiBhcHBseUZpZWxkU3RhdGUoIGZpZWxkVHlwZSApIHtcblx0XHRjb25zdCBmaWVsZFN0YXRlID0gZmllbGRTdGF0ZXNbIGZpZWxkVHlwZSBdO1xuXG5cdFx0ZmllbGRXcmFwcGVyLmZpbmQoIGZpZWxkSW5wdXQgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIHRoaXMgKTtcblx0XHRcdGNvbnN0IHR5cGUgICA9ICRpbnB1dC5hdHRyKCAndHlwZScgKTtcblx0XHRcdGNvbnN0IG5hbWUgICA9ICRpbnB1dC5hdHRyKCAnbmFtZScgKTtcblx0XHRcdGNvbnN0IHZhbHVlICA9IGZpZWxkU3RhdGVbIG5hbWUgXTtcblxuXHRcdFx0aWYgKCAnY2hlY2tib3gnID09PSB0eXBlIHx8ICdyYWRpbycgPT09IHR5cGUgKSB7XG5cdFx0XHRcdGlmICggbmFtZSBpbiBmaWVsZFN0YXRlICkge1xuXHRcdFx0XHRcdC8vIEFkZCAnY2hlY2tlZCcgYXR0cmlidXRlLlxuXHRcdFx0XHRcdGZpZWxkV3JhcHBlclxuXHRcdFx0XHRcdFx0LmZpbmQoICdbbmFtZT1cIicgKyBuYW1lICsgJ1wiXVt2YWx1ZT1cIicgKyB2YWx1ZSArICdcIl0nIClcblx0XHRcdFx0XHRcdC5hdHRyKCAnY2hlY2tlZCcsICdjaGVja2VkJyApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIFJlbW92ZSAnY2hlY2tlZCcgYXR0cmlidXRlLlxuXHRcdFx0XHRcdGZpZWxkV3JhcHBlci5maW5kKCAnW25hbWU9XCInICsgbmFtZSArICdcIl0nICkucmVtb3ZlQXR0ciggJ2NoZWNrZWQnICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRpbnB1dC52YWwoIHZhbHVlICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Ly8gUHJvY2VzcyB0aGUgbWFudWFsIG9wdGlvbnMuXG5cdFx0aWYgKCAnbWFudWFsX29wdGlvbnMnIGluIGZpZWxkU3RhdGUgKSB7XG5cdFx0XHRjb25zdCByYXdPcHRpb25zID0gZmllbGRTdGF0ZVsgJ21hbnVhbF9vcHRpb25zJyBdO1xuXG5cdFx0XHQkLmVhY2goIHJhd09wdGlvbnMsIGZ1bmN0aW9uKCBpbnB1dE5hbWUsIHJhdyApIHtcblx0XHRcdFx0Y29uc3QgJHJhd0lucHV0ID0gZmllbGRXcmFwcGVyLmZpbmQoICdbbmFtZT1cIicgKyBpbnB1dE5hbWUgKyAnXCJdJyApO1xuXG5cdFx0XHRcdCRyYXdJbnB1dC52YWwoIHJhdyApO1xuXG5cdFx0XHRcdGNvbnN0IG1hbnVhbE9wdGlvbnMgPSBKU09OLnBhcnNlKCBkZWNvZGVVUklDb21wb25lbnQoIHJhdyApICk7XG5cblx0XHRcdFx0aWYgKCAhIG1hbnVhbE9wdGlvbnMubGVuZ3RoICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IHRhYmxlSWRlbnRpZmllciA9ICRyYXdJbnB1dC5hdHRyKCAnZGF0YS10YWJsZScgKTtcblx0XHRcdFx0Y29uc3Qgcm93VGVtcGxhdGVJZCAgID0gJHJhd0lucHV0LmF0dHIoICdkYXRhLXRtcGwnICk7XG5cblx0XHRcdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0XHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgcm93VGVtcGxhdGVJZCApLmxlbmd0aCApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCByb3dzSWRlbnRpZmllciA9ICcuZmllbGQtdGFibGUtYm9keS1yb3dzJztcblx0XHRcdFx0Y29uc3Qgcm93SWRlbnRpZmllciAgPSAnLnJvdy1pdGVtJztcblxuXHRcdFx0XHRjb25zdCAkdGFibGUgPSBmaWVsZFdyYXBwZXIuZmluZCggdGFibGVJZGVudGlmaWVyICk7XG5cdFx0XHRcdGNvbnN0ICRyb3dzICA9ICR0YWJsZS5maW5kKCByb3dzSWRlbnRpZmllciApO1xuXG5cdFx0XHRcdCQuZWFjaCggbWFudWFsT3B0aW9ucywgZnVuY3Rpb24oIGksIG9wdGlvbiApIHtcblx0XHRcdFx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCByb3dUZW1wbGF0ZUlkICk7XG5cblx0XHRcdFx0XHRsZXQgcm93RGVmYXVsdE9wdGlvbnMgPSB7fTtcblxuXHRcdFx0XHRcdGlmICggJy5tYW51YWwtb3B0aW9ucy10YWJsZScgPT09IHRhYmxlSWRlbnRpZmllciApIHtcblx0XHRcdFx0XHRcdHJvd0RlZmF1bHRPcHRpb25zID0ge1xuXHRcdFx0XHRcdFx0XHQndmFsdWUnOiAnJyxcblx0XHRcdFx0XHRcdFx0J2xhYmVsJzogJycsXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHJvd0RlZmF1bHRPcHRpb25zICk7XG5cblx0XHRcdFx0XHQkcm93cy5hcHBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHRcdFx0XHRjb25zdCAkbGFzdFJvdyA9ICRyb3dzLmZpbmQoIHJvd0lkZW50aWZpZXIgKS5sYXN0KCk7XG5cblx0XHRcdFx0XHQkbGFzdFJvdy5maW5kKCAnW2RhdGEtbmFtZV0nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblx0XHRcdFx0XHRcdGNvbnN0IG5hbWUgID0gJHRoaXMuYXR0ciggJ2RhdGEtbmFtZScgKTtcblx0XHRcdFx0XHRcdGNvbnN0IHZhbHVlID0gb3B0aW9uWyBuYW1lIF07XG5cblx0XHRcdFx0XHRcdCR0aGlzLnZhbCggdmFsdWUgKTtcblxuXHRcdFx0XHRcdFx0aWYgKCAnaW1hZ2VfdXJsJyA9PT0gbmFtZSAmJiB2YWx1ZSApIHtcblx0XHRcdFx0XHRcdFx0JGxhc3RSb3cuZmluZCggJy53cC1pbWFnZS1waWNrZXItY29udGFpbmVyJyApLmFkZENsYXNzKCAnYWN0aXZlJyApO1xuXHRcdFx0XHRcdFx0XHQkbGFzdFJvdy5maW5kKCAnaW1nJyApLmF0dHIoICdzcmMnLCB2YWx1ZSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdCR0YWJsZS5hZGRDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRjb25zdCAkZmllbGQgPSBmaWVsZFdyYXBwZXIuZmluZCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0XHRmaWVsZFdyYXBwZXIudHJpZ2dlciggJ25ld19vcHRpb25fYWRkZWQnLCBbICRmaWVsZCBdICk7XG5cdFx0fVxuXHR9XG5cblx0JCggJyNhdmFpbGFibGVfZmllbGRzJyApLm9uKCAnY2hhbmdlJywgJ1tuYW1lPVwiX2FjdGl2ZV9maWVsZFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzICAgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgX2ZpZWxkVHlwZSA9ICR0aGlzLnZhbCgpO1xuXHRcdGNvbnN0IGZpZWxkTmFtZSAgPSAkdGhpcy5hdHRyKCAnZGF0YS1maWVsZC1uYW1lJyApO1xuXG5cdFx0aWYgKCAhIF9maWVsZFR5cGUgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZmllbGRUeXBlID0gJ3djYXBmLWZvcm0tZmllbGQtJyArIF9maWVsZFR5cGU7XG5cblx0XHQvLyBCYWlsIG91dCBpZiBubyB0bXBsIGZvdW5kIGZvciB0aGUgdHlwZS5cblx0XHRpZiAoICEgalF1ZXJ5KCAnI3RtcGwtJyArIGZpZWxkVHlwZSApLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSAgICAgICAgID0gd3AudGVtcGxhdGUoIGZpZWxkVHlwZSApO1xuXHRcdGNvbnN0IHJlbmRlcmVkICAgICAgICAgPSB0ZW1wbGF0ZSgpO1xuXHRcdGNvbnN0IGZpZWxkRGF0YVdyYXBwZXIgPSBmaWVsZFdyYXBwZXIuZmluZCggJyNmaWVsZF9kYXRhJyApO1xuXHRcdGNvbnN0IGZpZWxkTmFtZVdyYXBwZXIgPSBmaWVsZFdyYXBwZXIuZmluZCggJy5wb3N0Ym94LWhlYWRlciBoMicgKTtcblx0XHRjb25zdCBmaWVsZEluc2lkZSAgICAgID0gZmllbGRXcmFwcGVyLmZpbmQoICcuaW5zaWRlJyApO1xuXG5cdFx0ZmllbGRXcmFwcGVyLnJlbW92ZUNsYXNzKCAnaGlkZGVuJyApO1xuXG5cdFx0ZmllbGREYXRhV3JhcHBlci5hdHRyKCAnZGF0YS1maWVsZC10eXBlJywgX2ZpZWxkVHlwZSApO1xuXHRcdGZpZWxkTmFtZVdyYXBwZXIuaHRtbCggZmllbGROYW1lICk7XG5cdFx0ZmllbGRJbnNpZGUuaHRtbCggcmVuZGVyZWQgKTtcblxuXHRcdC8vIElmIGFscmVhZHkgZm91bmQgdGhlIGZpZWxkIHN0YXRlIHRoZW4gYXBwbHkgaXQsIG90aGVyd2lzZSBzdG9yZSBpdC5cblx0XHRpZiAoIF9maWVsZFR5cGUgaW4gZmllbGRTdGF0ZXMgKSB7XG5cdFx0XHRhcHBseUZpZWxkU3RhdGUoIF9maWVsZFR5cGUgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3RvcmVGaWVsZFN0YXRlKCk7XG5cdFx0fVxuXG5cdFx0ZmllbGRXcmFwcGVyLnRyaWdnZXIoICdmaWVsZF9hZGRlZCcgKTtcblxuXHRcdGZpZWxkV3JhcHBlci5maW5kKCAnW25hbWVdJyApLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0dXBkYXRlRmllbGRTdGF0ZSggJHRoaXMgKTtcblx0XHR9ICk7XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBGaWx0ZXIgZm9ybSBtZXRhIGJveC5cbiAqXG4gKiBAc2luY2UgICAgICAzLjEuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZvcm1EYXRhICAgICAgPSAkKCAnI2Zvcm1fZGF0YScgKTtcblx0Y29uc3QgJGRyb3Bkb3duICAgICA9ICQoICcjYXZhaWxhYmxlLWZpbHRlcnMtZHJvcGRvd24nICk7XG5cdGNvbnN0ICRhZGRGaWx0ZXJCdG4gPSAkKCAnI2FkZC1maWx0ZXItdG8tZm9ybS1idG4nICk7XG5cblx0JGRyb3Bkb3duLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgdmFsdWUgPSAkdGhpcy52YWwoKTtcblxuXHRcdGlmICggdmFsdWUgKSB7XG5cdFx0XHQkYWRkRmlsdGVyQnRuLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JGFkZEZpbHRlckJ0bi5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0LyoqXG5cdCAqIEFkZCBmaWx0ZXIgdG8gZm9ybS5cblx0ICovXG5cdCRhZGRGaWx0ZXJCdG4ub24oICdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRzZWxlY3RlZCA9ICRkcm9wZG93bi5maW5kKCAnb3B0aW9uOnNlbGVjdGVkJyApO1xuXHRcdGNvbnN0IGZpbHRlcklkICA9ICRzZWxlY3RlZC52YWwoKTtcblxuXHRcdGlmICggISBmaWx0ZXJJZC5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgZmlsdGVyVGl0bGUgPSAkc2VsZWN0ZWQuYXR0ciggJ2RhdGEtdGl0bGUnICk7XG5cdFx0Y29uc3QgZmlsdGVyS2V5ICAgPSAkc2VsZWN0ZWQuYXR0ciggJ2RhdGEtZmlsdGVyLWtleScgKTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoICd3Y2FwZi1maWx0ZXItZm9ybS1pdGVtJyApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHsgdGl0bGU6IGZpbHRlclRpdGxlLCBpZDogZmlsdGVySWQsIGtleTogZmlsdGVyS2V5IH0gKTtcblxuXHRcdGZvcm1EYXRhLmZpbmQoICcjZmlsdGVyLWZvcm0taXRlbXMnICkucHJlcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdCRkcm9wZG93bi5wcm9wKCAnc2VsZWN0ZWRJbmRleCcsIDAgKTtcblx0XHQkZHJvcGRvd24uZmluZCggJ29wdGlvblt2YWx1ZT1cIicgKyBmaWx0ZXJJZCArICdcIl0nICkuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdCRkcm9wZG93bi50cmlnZ2VyKCAnY2hhbmdlJyApO1xuXHR9ICk7XG5cblx0LyoqXG5cdCAqIE1ha2UgdGhlIGZpbHRlcnMgc29ydGFibGUuXG5cdCAqL1xuXHRmdW5jdGlvbiBzb3J0YWJsZSggaWRlbnRpZmllciApIHtcblx0XHRjb25zdCBjb250YWluZXIgPSAkKCBpZGVudGlmaWVyICk7XG5cblx0XHRjb250YWluZXIuc29ydGFibGUoXG5cdFx0XHR7XG5cdFx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdFx0Y3Vyc29yOiAnbW92ZScsXG5cdFx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdFx0aGFuZGxlOiAnLndpZGdldC10b3AnLFxuXHRcdFx0XHRjYW5jZWw6ICcud2lkZ2V0LXRpdGxlLWFjdGlvbicsXG5cdFx0XHRcdGl0ZW1zOiAnLndpZGdldCcsXG5cdFx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdH1cblx0XHQpO1xuXHR9XG5cblx0c29ydGFibGUoICcjZm9ybV9kYXRhJyApO1xuXG5cdC8qKlxuXHQgKiBUb2dnbGUgdGhlIGZpbHRlci5cblx0ICovXG5cdGZ1bmN0aW9uIHRvZ2dsZUZpbHRlciggZSApIHtcblx0XHRjb25zdCB0YXJnZXQgICAgICAgPSBlLnRhcmdldDtcblx0XHRjb25zdCB3aWRnZXQgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53aWRnZXQnICk7XG5cdFx0Y29uc3QgdG9nZ2xlQnRuICAgID0gd2lkZ2V0LmZpbmQoICcud2lkZ2V0LWFjdGlvbicgKTtcblx0XHRjb25zdCBpbnNpZGUgICAgICAgPSB3aWRnZXQuY2hpbGRyZW4oICcud2lkZ2V0LWluc2lkZScgKTtcblx0XHRjb25zdCBpc0V4cGFuZCAgICAgPSB0b2dnbGVCdG4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnICk7XG5cdFx0Y29uc3QgdG9nZ2xlRXhwYW5kID0gJ3RydWUnID09PSBpc0V4cGFuZCA/ICdmYWxzZScgOiAndHJ1ZSc7XG5cblx0XHR0b2dnbGVCdG4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCB0b2dnbGVFeHBhbmQgKTtcblx0XHQkKCBpbnNpZGUgKS5zbGlkZVRvZ2dsZShcblx0XHRcdCdmYXN0Jyxcblx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR3aWRnZXQudG9nZ2xlQ2xhc3MoICdvcGVuJyApO1xuXHRcdFx0XHRmb3JtRGF0YS50cmlnZ2VyKCAnd2lkZ2V0LWNsb3NlZCcsIFsgdGFyZ2V0IF0gKTtcblx0XHRcdH1cblx0XHQpO1xuXHR9XG5cblx0Zm9ybURhdGEub24oICdjbGljaycsICcud2lkZ2V0LXRvcCcsIHRvZ2dsZUZpbHRlciApO1xuXHRmb3JtRGF0YS5vbiggJ2NsaWNrJywgJy53aWRnZXQtY29udHJvbC1jbG9zZScsIHRvZ2dsZUZpbHRlciApO1xuXG5cdC8qKlxuXHQgKiBGb2N1cyB0aGUgZm9ybSBmaWVsZCdzIGV4cGFuZCBidXR0b24uXG5cdCAqL1xuXHRmdW5jdGlvbiBmb2N1c0ZpZWxkKCBlLCB0YXJnZXQgKSB7XG5cdFx0aWYgKCB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCAnd2lkZ2V0LWNvbnRyb2wtY2xvc2UnICkgKSB7XG5cdFx0XHRjb25zdCB3aWRnZXQgPSAkKCB0YXJnZXQgKS5jbG9zZXN0KCAnLndpZGdldCcgKTtcblx0XHRcdGNvbnN0IGFjdGlvbiA9IHdpZGdldC5maW5kKCAnLndpZGdldC1hY3Rpb24nICk7XG5cblx0XHRcdGFjdGlvbi5hdHRyKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKS5mb2N1cygpO1xuXHRcdH1cblx0fVxuXG5cdGZvcm1EYXRhLm9uKCAnd2lkZ2V0LWNsb3NlZCcsIGZvY3VzRmllbGQgKTtcblxuXHQvKipcblx0ICogUmVtb3ZlIHRoZSBmaWVsZC5cblx0ICovXG5cdGZ1bmN0aW9uIHJlbW92ZUZpZWxkKCkge1xuXHRcdGNvbnN0IHdpZGdldCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndpZGdldCcgKTtcblxuXHRcdCQoIHdpZGdldCApLnNsaWRlVXAoXG5cdFx0XHQnZmFzdCcsXG5cdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0d2lkZ2V0LnJlbW92ZSgpO1xuXHRcdFx0fVxuXHRcdCk7XG5cdH1cblxuXHRmb3JtRGF0YS5vbiggJ2NsaWNrJywgJy53aWRnZXQtY29udHJvbC1yZW1vdmUnLCByZW1vdmVGaWVsZCApO1xuXG5cdC8qKlxuXHQgKiBGaWx0ZXIgZm9ybSBtZW51LlxuXHQgKi9cblx0Y29uc3QgJGZpbHRlckZvcm1OYXZJdGVtID0gJCggJy5maWx0ZXItZm9ybS1tZW51IC5uYXYtdGFiJyApO1xuXG5cdCRmaWx0ZXJGb3JtTmF2SXRlbS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgJGNvbnRlbnQgPSAkKCAnLnRhYi0nICsgJHRoaXMuYXR0ciggJ2RhdGEtZm9yJyApICk7XG5cblx0XHQkZmlsdGVyRm9ybU5hdkl0ZW0ucmVtb3ZlQ2xhc3MoICduYXYtdGFiLWFjdGl2ZScgKTtcblx0XHQkdGhpcy5hZGRDbGFzcyggJ25hdi10YWItYWN0aXZlJyApO1xuXG5cdFx0JCggJy50YWItY29udGVudCcgKS5oaWRlKCk7XG5cdFx0JGNvbnRlbnQuc2hvdygpO1xuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogTWFudWFsIE9wdGlvbnMnIHRhYmxlIGZ1bmN0aW9uLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgd3B0b29scy5pb1xuICovXG5cbi8qKlxuICogQHBhcmFtIHRhYmxlSWRlbnRpZmllclxuICogQHBhcmFtIHZhbHVlSWRlbnRpZmllclxuICogQHBhcmFtIHJvd1RlbXBsYXRlSWRcbiAqIEBwYXJhbSByb3dEZWZhdWx0T3B0aW9uc1xuICovXG5mdW5jdGlvbiBpbml0TWFudWFsT3B0aW9uc1RhYmxlKCB0YWJsZUlkZW50aWZpZXIsIHZhbHVlSWRlbnRpZmllciwgcm93VGVtcGxhdGVJZCwgcm93RGVmYXVsdE9wdGlvbnMgPSB7fSApIHtcblx0Y29uc3QgJCA9IGpRdWVyeTtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdGNvbnN0IGZpZWxkSWRlbnRpZmllciA9ICcud2NhcGYtZm9ybS1maWVsZCc7XG5cdGNvbnN0IHJvd3NJZGVudGlmaWVyICA9ICcuZmllbGQtdGFibGUtYm9keS1yb3dzJztcblx0Y29uc3Qgcm93SWRlbnRpZmllciAgID0gJy5yb3ctaXRlbSc7XG5cblx0ZnVuY3Rpb24gaW5pdFNvcnRhYmxlVGFibGUoICRzZWxlY3RvciApIHtcblx0XHQkc2VsZWN0b3Iuc29ydGFibGUoIHtcblx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdHJldmVydDogZmFsc2UsXG5cdFx0XHRjdXJzb3I6ICdtb3ZlJyxcblx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdGhhbmRsZTogJy5tb3ZlLW9wdGlvbnMtaGFuZGxlcicsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHR1cGRhdGU6IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBlLnRhcmdldCApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdFx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdFx0XHR9XG5cdFx0fSApLmRpc2FibGVTZWxlY3Rpb24oKTtcblx0fVxuXG5cdGNvbnN0IHRhYmxlUm93c0lkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnICcgKyByb3dzSWRlbnRpZmllcjtcblxuXHQvLyBJbml0IHRoZSBzb3J0YWJsZSB0YWJsZSBhZnRlciBwYWdlIGxvYWRzLlxuXHRpbml0U29ydGFibGVUYWJsZSggZmllbGRXcmFwcGVyLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKSApO1xuXG5cdC8vIEluaXQgdGhlIHNvcnRhYmxlIHRhYmxlIGFmdGVyIHRoZSBmaWVsZCBpcyBhZGRlZC5cblx0ZmllbGRXcmFwcGVyLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHRpbml0U29ydGFibGVUYWJsZSggJCggZmllbGRXcmFwcGVyLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKSApICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICkge1xuXHRcdGNvbnN0ICR2YWx1ZUhvbGRlciA9ICRmaWVsZC5maW5kKCB2YWx1ZUlkZW50aWZpZXIgKTtcblx0XHRjb25zdCAkcm93cyAgICAgICAgPSAkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApO1xuXHRcdGNvbnN0IF9yb3dzICAgICAgICA9IFtdO1xuXG5cdFx0JHJvd3MuZmluZCggJy5yb3ctaXRlbScgKS5lYWNoKCBmdW5jdGlvbiggaSwgX2l0ZW0gKSB7XG5cdFx0XHRjb25zdCAkaXRlbSA9ICQoIF9pdGVtICk7XG5cdFx0XHRjb25zdCBvYmogICA9IHt9O1xuXG5cdFx0XHQkaXRlbS5maW5kKCAnW2RhdGEtbmFtZV0nICkuZWFjaCggZnVuY3Rpb24oIGZpZWxkSW5kZXgsIGZpZWxkICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBmaWVsZCApO1xuXHRcdFx0XHRjb25zdCBuYW1lICAgPSAkZmllbGQuYXR0ciggJ2RhdGEtbmFtZScgKTtcblxuXHRcdFx0XHRvYmpbIG5hbWUgXSA9ICRmaWVsZC52YWwoKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0X3Jvd3MucHVzaCggb2JqICk7XG5cdFx0fSApO1xuXG5cdFx0Y29uc3QgcmF3VmFsdWVzID0gZW5jb2RlVVJJQ29tcG9uZW50KCBKU09OLnN0cmluZ2lmeSggX3Jvd3MgKSApO1xuXHRcdCR2YWx1ZUhvbGRlci52YWwoIHJhd1ZhbHVlcyApLnRyaWdnZXIoICdjaGFuZ2UnICk7XG5cdH1cblxuXHRmdW5jdGlvbiB0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCB0YWJsZUlkZW50aWZpZXIgKTtcblx0XHRjb25zdCB0YWJsZVJvd3MgICAgID0gJGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKS5jaGlsZHJlbigpO1xuXG5cdFx0aWYgKCAyID4gdGFibGVSb3dzLmxlbmd0aCApIHtcblx0XHRcdCRvcHRpb25zVGFibGUucmVtb3ZlQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH1cblxuXHQvLyBSZW1vdmUgT3B0aW9uXG5cdGNvbnN0IHJlbW92ZUJ0bklkZW50aWZpZXIgPSB0YWJsZUlkZW50aWZpZXIgKyAnIC5yZW1vdmUtb3B0aW9uJztcblxuXHRmaWVsZFdyYXBwZXIub24oICdjbGljaycsIHJlbW92ZUJ0bklkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRpdGVtICA9ICQoIHRoaXMgKS5jbG9zZXN0KCByb3dJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgJGZpZWxkID0gJGl0ZW0uY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKTtcblxuXHRcdCRpdGVtLnJlbW92ZSgpO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQ2xlYXIgQWxsIE9wdGlvbnNcblx0Y29uc3QgY2xlYXJPcHRpb25zQnRuSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgLmNsZWFyLW9wdGlvbnMnO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2NsaWNrJywgY2xlYXJPcHRpb25zQnRuSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0JGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKS5lbXB0eSgpO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICk7XG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQWRkIE5ldyBPcHRpb25cblx0Y29uc3QgYWRkT3B0aW9uQnRuSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgLmFkZC1vcHRpb24nO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2NsaWNrJywgYWRkT3B0aW9uQnRuSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyByb3dUZW1wbGF0ZUlkICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIHJvd1RlbXBsYXRlSWQgKTtcblx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCByb3dEZWZhdWx0T3B0aW9ucyApO1xuXHRcdGNvbnN0ICR0YWJsZSAgID0gJGZpZWxkLmZpbmQoIHRhYmxlSWRlbnRpZmllciApO1xuXHRcdGNvbnN0ICRyb3dzICAgID0gJGZpZWxkLmZpbmQoIHRhYmxlUm93c0lkZW50aWZpZXIgKTtcblxuXHRcdCRyb3dzLmFwcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblxuXHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnbmV3X29wdGlvbl9hZGRlZCcsIFsgJGZpZWxkIF0gKTtcblxuXHRcdGlmICggISAkdGFibGUuaGFzQ2xhc3MoICdoYXMtb3B0aW9ucycgKSApIHtcblx0XHRcdCR0YWJsZS5hZGRDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fSApO1xuXG5cdC8vIFRyaWdnZXIgb3B0aW9ucyBjaGFuZ2Ugd2hlbiB0aGUgdGV4dCBmaWVsZHMgZ2V0IGNoYW5nZWQuXG5cdGNvbnN0IHRleHRGaWVsZHNJZGVudGlmaWVyID0gdGFibGVSb3dzSWRlbnRpZmllciArICcgaW5wdXRbdHlwZT1cInRleHRcIl0nO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2lucHV0JywgdGV4dEZpZWxkc0lkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIFRyaWdnZXIgb3B0aW9ucyBjaGFuZ2Ugd2hlbiB0aGUgc2VsZWN0IGZpZWxkcyBnZXQgY2hhbmdlZC5cblx0bGV0IHNlbGVjdEZpZWxkc0lkZW50aWZpZXIgPSB0YWJsZVJvd3NJZGVudGlmaWVyICsgJyBzZWxlY3QnO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2NoYW5nZScsIHNlbGVjdEZpZWxkc0lkZW50aWZpZXIsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIFRyaWdnZXIgb3B0aW9ucyBjaGFuZ2Ugd2hlbiB2YWx1ZSBpcyBhZGRlZCBmcm9tIG1vZGFsLlxuXHRmaWVsZFdyYXBwZXIub24oICd0cmlnZ2VyX29wdGlvbnNfdGFibGUnLCBmdW5jdGlvbiggZSwgdGFibGVJZCwgJGZpZWxkICkge1xuXHRcdGlmICggdGFibGVJZCA9PT0gdGFibGVJZGVudGlmaWVyICkge1xuXHRcdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHRcdH1cblx0fSApO1xuXG59XG4iLCIvKipcbiAqIFRoZSBudW1iZXIgdWkgb3B0aW9ucy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0LyoqXG5cdCAqIFRvZ2dsZSBkaXNhYmxlZCBhdHRyaWJ1dGUgb2YgbWluLXZhbHVlIGZpZWxkIGZvciBudW1iZXIgdHlwZS5cblx0ICovXG5cdGZ1bmN0aW9uIHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICRlbG0gKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICA9ICRlbG0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICR0ZXh0RmllbGQgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWUgaW5wdXRbdHlwZT1cInRleHRcIl0nICk7XG5cblx0XHRpZiAoICRlbG0uaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdCR0ZXh0RmllbGQuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkdGV4dEZpZWxkLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHR9XG5cdH1cblxuXHRmaWVsZFdyYXBwZXIub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdGZpZWxkV3JhcHBlci5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0dG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJHRoaXMgKTtcblx0XHR9ICk7XG5cdH0gKTtcblxuXHRmaWVsZFdyYXBwZXIub24oXG5cdFx0J2NsaWNrJyxcblx0XHQnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fVxuXHQpO1xuXG5cdC8qKlxuXHQgKiBUb2dnbGUgZGlzYWJsZWQgYXR0cmlidXRlIG9mIG1heC12YWx1ZSBmaWVsZCBmb3IgbnVtYmVyIHR5cGUuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkZWxtICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkZWxtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkdGV4dEZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJyApO1xuXG5cdFx0aWYgKCAkZWxtLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHQkdGV4dEZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHRleHRGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHRmaWVsZFdyYXBwZXIuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fSApO1xuXHR9ICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKFxuXHRcdCdjbGljaycsXG5cdFx0Jy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0XHR0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHRcdH1cblx0KTtcblxufSApO1xuIiwiLyoqXG4gKiBQbHVnaW4gc2V0dGluZ3MgZm9ybS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGlmICggISAkKCAnYm9keScgKS5oYXNDbGFzcyggJ3djYXBmLWZpbHRlcl9wYWdlX3djYXBmLXNldHRpbmdzJyApICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIE1lZGlhIHVwbG9hZGVyLlxuXHQkKCAnLnVwbG9hZC1pbWFnZS1idXR0b24nICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRidXR0b24gICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgJHdyYXBwZXIgICA9ICRidXR0b24uY2xvc2VzdCggJy5tZWRpYS11cGxvYWQnICk7XG5cdFx0Y29uc3QgbW9kYWxUaXRsZSA9ICRidXR0b24uYXR0ciggJ2RhdGEtbW9kYWwtdGl0bGUnICk7XG5cblx0XHRjb25zdCBpbWFnZSA9IHdwLm1lZGlhKCB7IHRpdGxlOiBtb2RhbFRpdGxlLCBtdWx0aXBsZTogZmFsc2UgfSApXG5cdFx0XHQub3BlbigpXG5cdFx0XHQub24oICdzZWxlY3QnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgdXBsb2FkZWRJbWFnZSA9IGltYWdlLnN0YXRlKCkuZ2V0KCAnc2VsZWN0aW9uJyApLmZpcnN0KCk7XG5cdFx0XHRcdGNvbnN0IGltYWdlRGF0YSAgICAgPSB1cGxvYWRlZEltYWdlLnRvSlNPTigpO1xuXG5cdFx0XHRcdGNvbnN0IHsgdGh1bWJuYWlsIH0gPSBpbWFnZURhdGEuc2l6ZXM7XG5cdFx0XHRcdGxldCBpbWFnZVVybDtcblxuXHRcdFx0XHRpZiAoIHRodW1ibmFpbCApIHtcblx0XHRcdFx0XHRpbWFnZVVybCA9IGltYWdlRGF0YS5zaXplcy50aHVtYm5haWwudXJsO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGltYWdlVXJsID0gaW1hZ2VEYXRhLnVybDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCR3cmFwcGVyLmZpbmQoICcuaW1hZ2UtaWQnICkudmFsKCBpbWFnZURhdGEuaWQgKTtcblx0XHRcdFx0JHdyYXBwZXIuZmluZCggJy5pbWFnZS1zcmMnICkuYXR0ciggJ3NyYycsIGltYWdlVXJsICk7XG5cdFx0XHRcdCR3cmFwcGVyLnJlbW92ZUNsYXNzKCAnbm8taW1hZ2UnICk7XG5cdFx0XHR9ICk7XG5cdH0gKTtcblxuXHQkKCAnLnJlbW92ZS1pbWFnZS1idXR0b24nICkub24oICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGNvbnN0ICRidXR0b24gID0gJCggdGhpcyApO1xuXHRcdGNvbnN0ICR3cmFwcGVyID0gJGJ1dHRvbi5jbG9zZXN0KCAnLm1lZGlhLXVwbG9hZCcgKTtcblxuXHRcdCR3cmFwcGVyLmZpbmQoICcuaW1hZ2UtaWQnICkudmFsKCAnJyApO1xuXHRcdCR3cmFwcGVyLmZpbmQoICcuaW1hZ2Utc3JjJyApLmF0dHIoICdzcmMnLCAnJyApO1xuXHRcdCR3cmFwcGVyLmFkZENsYXNzKCAnbm8taW1hZ2UnICk7XG5cdH0gKTtcblxuXHQvLyBUb2dnbGUgbG9hZGluZyBpbWFnZSBmaWVsZC5cblx0ZnVuY3Rpb24gdG9nZ2xlTG9hZGluZ0ltYWdlKCB2YWx1ZSApIHtcblx0XHRjb25zdCAkc2VsZWN0b3IgPSAkKCAnLnNldHRpbmdzLXRhYmxlLWxvYWRpbmdfaW1hZ2UnICk7XG5cblx0XHRpZiAoIHZhbHVlICkge1xuXHRcdFx0JHNlbGVjdG9yLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHNlbGVjdG9yLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRjb25zdCAkZW5hYmxlTG9hZGluZ092ZXJsYXkgPSAkKCAnI2xvYWRpbmdfYW5pbWF0aW9uJyApO1xuXG5cdGxldCBlbmFibGVMb2FkaW5nT3ZlcmxheSA9IGZhbHNlO1xuXG5cdGlmICggJGVuYWJsZUxvYWRpbmdPdmVybGF5LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0ZW5hYmxlTG9hZGluZ092ZXJsYXkgPSB0cnVlO1xuXHR9XG5cblx0dG9nZ2xlTG9hZGluZ0ltYWdlKCBlbmFibGVMb2FkaW5nT3ZlcmxheSApO1xuXG5cdCRlbmFibGVMb2FkaW5nT3ZlcmxheS5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdGxldCBfZW5hYmxlTG9hZGluZ092ZXJsYXkgPSBmYWxzZTtcblxuXHRcdGlmICggJCggdGhpcyApLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRfZW5hYmxlTG9hZGluZ092ZXJsYXkgPSB0cnVlO1xuXHRcdH1cblxuXHRcdHRvZ2dsZUxvYWRpbmdJbWFnZSggX2VuYWJsZUxvYWRpbmdPdmVybGF5ICk7XG5cdH0gKTtcblxuXHQvLyBUb2dnbGUgcGFnaW5hdGlvbiBmaWVsZHMuXG5cdGZ1bmN0aW9uIGVuYWJsZVBhZ2luYXRpb24oIHZhbHVlICkge1xuXHRcdGNvbnN0ICRzZWxlY3RvciA9ICQoICcuc2V0dGluZ3MtdGFibGUtcGFnaW5hdGlvbl9jb250YWluZXInICk7XG5cblx0XHRpZiAoIHZhbHVlICkge1xuXHRcdFx0JHNlbGVjdG9yLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHNlbGVjdG9yLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRjb25zdCAkZW5hYmxlUGFnaW5hdGlvbiA9ICQoICcjZW5hYmxlX3BhZ2luYXRpb25fdmlhX2FqYXgnICk7XG5cblx0bGV0IGVuYWJsZVBhZ2luYXRpb25PbkxvYWQgPSBmYWxzZTtcblxuXHRpZiAoICRlbmFibGVQYWdpbmF0aW9uLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0ZW5hYmxlUGFnaW5hdGlvbk9uTG9hZCA9IHRydWU7XG5cdH1cblxuXHRlbmFibGVQYWdpbmF0aW9uKCBlbmFibGVQYWdpbmF0aW9uT25Mb2FkICk7XG5cblx0JGVuYWJsZVBhZ2luYXRpb24ub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRsZXQgX2VuYWJsZVBhZ2luYXRpb24gPSBmYWxzZTtcblxuXHRcdGlmICggJCggdGhpcyApLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRfZW5hYmxlUGFnaW5hdGlvbiA9IHRydWU7XG5cdFx0fVxuXG5cdFx0ZW5hYmxlUGFnaW5hdGlvbiggX2VuYWJsZVBhZ2luYXRpb24gKTtcblx0fSApO1xuXG5cdC8vIFRvZ2dsZSBzY3JvbGwgd2luZG93IGZpZWxkcy5cblx0ZnVuY3Rpb24gc2Nyb2xsV2luZG93KCB2YWx1ZSApIHtcblx0XHRjb25zdCBkZXBlbmRlbnRGaWVsZHMgPSAnLnNjcm9sbC13aW5kb3ctZGVwZW5kZW50LWZpZWxkcywnICtcblx0XHRcdCcuc2Nyb2xsLXdpbmRvdy1jdXN0b20tZWxlbWVudC1pbnB1dCwnICtcblx0XHRcdCcuc2V0dGluZ3MtdGFibGUtc2Nyb2xsX3RvX3RvcF9vZmZzZXQnO1xuXG5cdFx0aWYgKCAnbm9uZScgPT09IHZhbHVlICkge1xuXHRcdFx0JCggZGVwZW5kZW50RmllbGRzICkuaGlkZSgpO1xuXHRcdH0gZWxzZSBpZiAoICdyZXN1bHRzJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHQkKCAnLnNjcm9sbC13aW5kb3ctZGVwZW5kZW50LWZpZWxkcywgLnNldHRpbmdzLXRhYmxlLXNjcm9sbF90b190b3Bfb2Zmc2V0JyApLnNob3coKTtcblx0XHRcdCQoICcuc2Nyb2xsLXdpbmRvdy1jdXN0b20tZWxlbWVudC1pbnB1dCcgKS5oaWRlKCk7XG5cdFx0fSBlbHNlIGlmICggJ2N1c3RvbScgPT09IHZhbHVlICkge1xuXHRcdFx0JCggJy5zY3JvbGwtd2luZG93LWRlcGVuZGVudC1maWVsZHMsIC5zZXR0aW5ncy10YWJsZS1zY3JvbGxfdG9fdG9wX29mZnNldCcgKS5zaG93KCk7XG5cdFx0XHQkKCAnLnNjcm9sbC13aW5kb3ctY3VzdG9tLWVsZW1lbnQtaW5wdXQnICkuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkKCBkZXBlbmRlbnRGaWVsZHMgKS5zaG93KCk7XG5cdFx0fVxuXHR9XG5cblx0Y29uc3QgJHNjcm9sbFdpbmRvdyA9ICQoICcjc2Nyb2xsX3dpbmRvdycgKTtcblxuXHRzY3JvbGxXaW5kb3coICRzY3JvbGxXaW5kb3cudmFsKCkgKTtcblxuXHQkc2Nyb2xsV2luZG93Lm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgdmFsdWUgPSAkKCB0aGlzICkudmFsKCk7XG5cblx0XHRzY3JvbGxXaW5kb3coIHZhbHVlICk7XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBUaGUgcHJvZHVjdCBzdGF0dXMgZmllbGQuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICB3cHRvb2xzLmlvXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcblxuXHRjb25zdCB0YWJsZUlkZW50aWZpZXIgPSAnLnByb2R1Y3Qtc3RhdHVzLW9wdGlvbnMtdGFibGUnO1xuXHRjb25zdCB2YWx1ZUlkZW50aWZpZXIgPSAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXByb2R1Y3Rfc3RhdHVzX29wdGlvbnMgaW5wdXQnO1xuXHRjb25zdCByb3dUZW1wbGF0ZUlkICAgPSAnd2NhcGYtcHJvZHVjdC1zdGF0dXMtb3B0aW9uJztcblxuXHRpbml0TWFudWFsT3B0aW9uc1RhYmxlKCB0YWJsZUlkZW50aWZpZXIsIHZhbHVlSWRlbnRpZmllciwgcm93VGVtcGxhdGVJZCApO1xuXG59ICk7XG4iLCIvKipcbiAqIFRoZSB0b2dnbGUgdmlzaWJpbGl0eSBzY3JpcHRzLlxuICpcbiAqIE5PVEU6IFRoZXNlIHNjcmlwdHMgbXVzdCBiZSBsb2NhdGVkIGF0IHRoZSB2ZXJ5IGJvdHRvbSBvZiB0aGUgY29tYmluZWQgc2NyaXB0cy5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0Y29uc3QgZGVwZW5kYW50RGF0YSA9IFtcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtdGV4dC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RleHQnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtbnVtYmVyLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbnVtYmVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5pbnB1dC10eXBlLWRhdGUtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdkYXRlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy52YWx1ZS1kZWNpbWFsLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbnVtYmVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjaGVja2JveCcsICdtdWx0aS1zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFkaW8nLCAnc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdzZWxlY3QnLCAnbXVsdGktc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2F0ZWdvcnlfaW1hZ2VzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbWFnZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlcicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbGFiZWwnLCAnY29sb3InLCAnaW1hZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmNvbHVtbi1ncm91cC1jdXN0b21fYXBwZWFyYW5jZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY29sb3InLCAnaW1hZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtaGllcmFyY2hpY2FsIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV9kZWNpbWFsIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXZhbHVlX2RlY2ltYWxfcGxhY2VzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1nZXRfb3B0aW9ucyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5jb2x1bW4tZ3JvdXAtbWV0YV9rZXlfbWFudWFsX29wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ21hbnVhbF9lbnRyeScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2Rpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zbGlkZXJfZGlzcGxheV92YWx1ZXNfYXMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NsaWRlcicgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxpZ25fdmFsdWVzX2F0X3RoZV9lbmQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NsaWRlcicgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3F1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2VsZWN0X2FsbF9pdGVtc19sYWJlbCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfdXNlX2Nob3NlbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfZW5hYmxlX211bHRpcGxlX2ZpbHRlcicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zaG93X2NvdW50Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnLCAncmFuZ2VfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9oaWRlX2VtcHR5Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnLCAncmFuZ2VfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1kZWNpbWFsLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJywgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcsICdyYW5nZV9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3VzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9nZXRfb3B0aW9ucyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItYXV0b21hdGljLW9wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2F1dG9tYXRpY2FsbHknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbWFudWFsX2VudHJ5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kYXRlX2Rpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmRhdGUtdG8tdWktb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5wdXRfZGF0ZV9yYW5nZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGF0ZV9mb3JtYXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2lucHV0X2RhdGUnLCAnaW5wdXRfZGF0ZV9yYW5nZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtc2hvd19kYXRlX2lucHV0c19pbmxpbmUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2lucHV0X2RhdGVfcmFuZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmRhdGUtcGlja2VyLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5wdXRfZGF0ZScsICdpbnB1dF9kYXRlX3JhbmdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9jaGVja2JveCcsICd0aW1lX3BlcmlvZF9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2Rfc2VsZWN0X2FsbF9pdGVtc19sYWJlbCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfcmFkaW8nLCAndGltZV9wZXJpb2Rfc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF91c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9zZWxlY3QnLCAndGltZV9wZXJpb2RfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2VuYWJsZV9tdWx0aXBsZV9maWx0ZXInLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9zaG93X2NvdW50Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9jaGVja2JveCcsICd0aW1lX3BlcmlvZF9yYWRpbycsICd0aW1lX3BlcmlvZF9zZWxlY3QnLCAndGltZV9wZXJpb2RfbXVsdGlzZWxlY3QnLCAndGltZV9wZXJpb2RfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2hpZGVfZW1wdHknLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2NoZWNrYm94JywgJ3RpbWVfcGVyaW9kX3JhZGlvJywgJ3RpbWVfcGVyaW9kX3NlbGVjdCcsICd0aW1lX3BlcmlvZF9tdWx0aXNlbGVjdCcsICd0aW1lX3BlcmlvZF9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfdXNlX2Nob3NlbiBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfc29mdF9saW1pdCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1zb2Z0X2xpbWl0Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10YXhvbm9teSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jdXN0b20tdGF4b25vbXkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWV0YV9rZXkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcG9zdF9wcm9wZXJ0eSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1saW1pdF9vcHRpb25zIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcGFyZW50X3Rlcm0nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NoaWxkJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1saW1pdF92YWx1ZXNfYnlfaWQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2luY2x1ZGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWV4Y2x1ZGVfdmFsdWVzX2lkJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdleGNsdWRlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfYWNjb3JkaW9uIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFjY29yZGlvbl9kZWZhdWx0X3N0YXRlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfbXVsdGlwbGVfZmlsdGVyIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2F0ZWdvcnlfaW1hZ2VzIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX2NsZWFyX2FsbF9idXR0b24gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuY2xlYXItYWxsLWJ1dHRvbi1maWVsZHMtc3RhcnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNob3dfaWZfZW1wdHkgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW1wdHlfZmlsdGVyX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNob3dfdGl0bGUgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbW92ZV9jbGVhcl9hbGxfYnV0dG9uX2luX3RpdGxlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1vcmRlcl90ZXJtc19ieSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hY3RpdmVfZmlsdGVyc19sYXlvdXQgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuc2ltcGxlLWxheW91dC1zb2Z0LWZpZWxkcy1zdGFydCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnc2ltcGxlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5leHRlbmRlZC1sYXlvdXQtc29mdC1maWVsZHMtc3RhcnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2V4dGVuZGVkJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfc29mdF9saW1pdF9mb3JfZXh0ZW5kZWRfbGF5b3V0IGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNvZnRfbGltaXRfZm9yX2V4dGVuZGVkX2xheW91dCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX3Rvb2x0aXAgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtc2hvd19jb3VudF9pbl90b29sdGlwJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10b29sdGlwX3Bvc2l0aW9uJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRdO1xuXG5cdGZ1bmN0aW9uIF9oYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBjdXJyZW50U2VsZWN0b3IsIHZhbHVlICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgID0gY3VycmVudFNlbGVjdG9yLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCBoYW5kbGVyICAgICA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdGNvbnN0IGhhbmRsZXJUeXBlID0gZGF0YVsgJ2hhbmRsZXJUeXBlJyBdO1xuXHRcdGNvbnN0IGRlcGVuZGFudCAgID0gZGF0YVsgJ2RlcGVuZGFudCcgXTtcblxuXHRcdGxldCBfdmFsdWUgPSB2YWx1ZTtcblxuXHRcdGlmICggJ2NoZWNrYm94JyA9PT0gaGFuZGxlclR5cGUgKSB7XG5cdFx0XHRfdmFsdWUgPSBjdXJyZW50U2VsZWN0b3IuaXMoICc6Y2hlY2tlZCcgKSA/ICcxJyA6ICcwJztcblx0XHR9XG5cblx0XHRpZiAoICdyYWRpbycgPT09IGhhbmRsZXJUeXBlICkge1xuXHRcdFx0X3ZhbHVlID0gJGZpZWxkLmZpbmQoIGhhbmRsZXIgKyAnOmNoZWNrZWQnICkudmFsKCk7XG5cdFx0fVxuXG5cdFx0JC5lYWNoKCBkZXBlbmRhbnQsIGZ1bmN0aW9uKCBpZCwgZCApIHtcblx0XHRcdGNvbnN0ICRzZWxlY3RvciAgID0gJGZpZWxkLmZpbmQoIGRbICdzZWxlY3RvcicgXSApO1xuXHRcdFx0Y29uc3QgdmFsaWRWYWx1ZXMgPSBkWyAndmFsdWUnIF07XG5cblx0XHRcdGlmICggdmFsaWRWYWx1ZXMuaW5jbHVkZXMoIF92YWx1ZSApICkge1xuXHRcdFx0XHQkc2VsZWN0b3Iuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHNlbGVjdG9yLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHRmaWVsZFdyYXBwZXIudHJpZ2dlciggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgWyBoYW5kbGVyLCBfdmFsdWUsICRmaWVsZCBdICk7XG5cdH1cblxuXHRmdW5jdGlvbiBoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBjdXJyZW50U2VsZWN0b3IsIHZhbHVlICkge1xuXHRcdGlmICggbnVsbCA9PT0gY3VycmVudFNlbGVjdG9yICkge1xuXHRcdFx0Y29uc3QgaGFuZGxlciAgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRcdGNvbnN0ICRoYW5kbGVyID0gJCggaGFuZGxlciApO1xuXG5cdFx0XHQkLmVhY2goICRoYW5kbGVyLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgX3RoaXMgID0gJCggdGhpcyApO1xuXHRcdFx0XHRjb25zdCBfdmFsdWUgPSBfdGhpcy52YWwoKTtcblx0XHRcdFx0X2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIF90aGlzLCBfdmFsdWUgKTtcblx0XHRcdH0gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0X2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBzZXR1cEZpZWxkKCBpbml0YWwgPSBmYWxzZSApIHtcblx0XHQkLmVhY2goIGRlcGVuZGFudERhdGEsIGZ1bmN0aW9uKCBpLCBkYXRhICkge1xuXHRcdFx0Y29uc3QgaGFuZGxlciA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdFx0Y29uc3QgZXZlbnQgICA9IGRhdGFbICdldmVudCcgXTtcblxuXHRcdFx0aGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgbnVsbCwgbnVsbCApO1xuXG5cdFx0XHRpZiAoIGluaXRhbCApIHtcblx0XHRcdFx0ZmllbGRXcmFwcGVyLm9uKCBldmVudCwgaGFuZGxlciwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgX3RoaXMgID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdGNvbnN0IF92YWx1ZSA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0XHRoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBfdGhpcywgX3ZhbHVlICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRpZiAoICEgJCggZmllbGRXcmFwcGVyICkuaGFzQ2xhc3MoICdsb2FkZWQnICkgKSB7XG5cdFx0XHRcdFx0JCggZmllbGRXcmFwcGVyICkuYWRkQ2xhc3MoICdsb2FkZWQnICk7XG5cblx0XHRcdFx0XHRmaWVsZFdyYXBwZXIudHJpZ2dlciggJ2ZpZWxkX2FkZGVkJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0c2V0dXBGaWVsZCggdHJ1ZSApO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gVG9nZ2xlIHRoZSB2aXNpYmlsaXR5IG9mIHN1YmZpZWxkcy5cblx0XHRzZXR1cEZpZWxkKCk7XG5cdH0gKTtcblxufSApO1xuIl19
