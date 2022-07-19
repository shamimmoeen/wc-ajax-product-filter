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
   * Filter form menu.
   */

  var $filterFormMenu = $('#filter-form-menu');
  var $filterFormMenuItem = $('#filter-form-menu .nav-tab');
  $filterFormMenuItem.on('click', function () {
    var $this = $(this);
    var identifier = $this.attr('data-for');
    var $content = $('.tab-' + identifier);
    $filterFormMenuItem.removeClass('nav-tab-active');
    $filterFormMenu.attr('data-active-nav', identifier);
    $this.addClass('nav-tab-active');
    $('.tab-content').hide();
    $content.show();
    $(document).trigger('wcapf_filter_form_nav_changed', [identifier]);
  });
  $(document).on('wcapf_filter_form_nav_changed', function (e, identifier) {
    var $visibilityRulesMetaBox = $('#wcapf_visibility_rules');

    if ('general' === identifier) {
      $visibilityRulesMetaBox.removeClass('force-hide');
    } else {
      $visibilityRulesMetaBox.addClass('force-hide');
    }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbS1hcHBlYXJhbmNlLWZpZWxkcy5qcyIsImRpc3BsYXktdHlwZS1maWVsZHMuanMiLCJmaWVsZC1tZXRhLWJveC5qcyIsImZpbHRlci1mb3JtLW1ldGEtYm94LmpzIiwibWFudWFsLW9wdGlvbnMtdGFibGUuanMiLCJudW1iZXItdWktb3B0aW9ucy5qcyIsInBsdWdpbi1zZXR0aW5ncy5qcyIsInByb2R1Y3Qtc3RhdHVzLXRhYmxlLmpzIiwidG9nZ2xlVmlzaWJpbGl0eS5qcyJdLCJuYW1lcyI6WyJqUXVlcnkiLCJkb2N1bWVudCIsInJlYWR5IiwiJCIsImZpZWxkV3JhcHBlciIsIm9uIiwiZSIsImhhbmRsZXIiLCJ2YWx1ZSIsIiRmaWVsZCIsIiRxdWVyeVR5cGUiLCJmaW5kIiwidmFsaWREaXNwbGF5VHlwZXMiLCJpbmNsdWRlcyIsIiRtdWx0aXBsZUZpbHRlciIsImlzIiwic2hvdyIsImhpZGUiLCIkZGlzcGxheVR5cGUiLCJkaXNwbGF5VHlwZSIsInZhbCIsIiRockZpZWxkcyIsIiRoaWVyYXJjaGljYWwiLCJ1c2VIaWVyYXJjaGljYWwiLCIkaHJBY2NvcmRpb24iLCIkbm9SZXN1bHRzIiwiJGFsbEl0ZW1zTGFiZWwiLCJ1c2VDaG9zZW4iLCJmaWVsZElucHV0IiwiZmllbGRTdGF0ZXMiLCJzdG9yZUZpZWxkU3RhdGUiLCJmaWVsZFR5cGUiLCJhdHRyIiwiZmllbGRWYWx1ZXMiLCJlYWNoIiwiJGlucHV0IiwidHlwZSIsIm5hbWUiLCJtYW51YWxPcHRpb25zIiwidXBkYXRlRmllbGRTdGF0ZSIsIiRlbG0iLCJmaWVsZFN0YXRlIiwiaGFzQ2xhc3MiLCJtYW51YWxfb3B0aW9ucyIsIiR0aGlzIiwiYXBwbHlGaWVsZFN0YXRlIiwicmVtb3ZlQXR0ciIsInJhd09wdGlvbnMiLCJpbnB1dE5hbWUiLCJyYXciLCIkcmF3SW5wdXQiLCJKU09OIiwicGFyc2UiLCJkZWNvZGVVUklDb21wb25lbnQiLCJsZW5ndGgiLCJ0YWJsZUlkZW50aWZpZXIiLCJyb3dUZW1wbGF0ZUlkIiwicm93c0lkZW50aWZpZXIiLCJyb3dJZGVudGlmaWVyIiwiJHRhYmxlIiwiJHJvd3MiLCJpIiwib3B0aW9uIiwidGVtcGxhdGUiLCJ3cCIsInJvd0RlZmF1bHRPcHRpb25zIiwicmVuZGVyZWQiLCJhcHBlbmQiLCIkbGFzdFJvdyIsImxhc3QiLCJhZGRDbGFzcyIsInRyaWdnZXIiLCJfZmllbGRUeXBlIiwiZmllbGROYW1lIiwiZmllbGREYXRhV3JhcHBlciIsImZpZWxkTmFtZVdyYXBwZXIiLCJmaWVsZEluc2lkZSIsInJlbW92ZUNsYXNzIiwiaHRtbCIsImZvcm1EYXRhIiwiJGRyb3Bkb3duIiwiJGFkZEZpbHRlckJ0biIsIiRzZWxlY3RlZCIsImZpbHRlcklkIiwiZmlsdGVyVGl0bGUiLCJmaWx0ZXJLZXkiLCJlZGl0TGluayIsInRpdGxlIiwiaWQiLCJrZXkiLCJlZGl0X2xpbmsiLCJwcmVwZW5kIiwicHJvcCIsInNvcnRhYmxlIiwiaWRlbnRpZmllciIsImNvbnRhaW5lciIsIm9wYWNpdHkiLCJyZXZlcnQiLCJjdXJzb3IiLCJheGlzIiwiaGFuZGxlIiwiY2FuY2VsIiwiaXRlbXMiLCJwbGFjZWhvbGRlciIsInJlbW92ZUZpZWxkIiwid2lkZ2V0IiwiY2xvc2VzdCIsInNsaWRlVXAiLCJyZW1vdmUiLCIkZmlsdGVyRm9ybU1lbnUiLCIkZmlsdGVyRm9ybU1lbnVJdGVtIiwiJGNvbnRlbnQiLCIkdmlzaWJpbGl0eVJ1bGVzTWV0YUJveCIsIiRmaWVsZHMiLCJpbml0TWFudWFsT3B0aW9uc1RhYmxlIiwidmFsdWVJZGVudGlmaWVyIiwiZmllbGRJZGVudGlmaWVyIiwiaW5pdFNvcnRhYmxlVGFibGUiLCIkc2VsZWN0b3IiLCJ1cGRhdGUiLCJ0YXJnZXQiLCJ0cmlnZ2VyT3B0aW9uc0NoYW5nZSIsImRpc2FibGVTZWxlY3Rpb24iLCJ0YWJsZVJvd3NJZGVudGlmaWVyIiwiJHZhbHVlSG9sZGVyIiwiX3Jvd3MiLCJfaXRlbSIsIiRpdGVtIiwib2JqIiwiZmllbGRJbmRleCIsImZpZWxkIiwicHVzaCIsInJhd1ZhbHVlcyIsImVuY29kZVVSSUNvbXBvbmVudCIsInN0cmluZ2lmeSIsInRyaWdnZXJSZW1vdmVPcHRpb24iLCIkb3B0aW9uc1RhYmxlIiwidGFibGVSb3dzIiwiY2hpbGRyZW4iLCJyZW1vdmVCdG5JZGVudGlmaWVyIiwiY2xlYXJPcHRpb25zQnRuSWRlbnRpZmllciIsImVtcHR5IiwiYWRkT3B0aW9uQnRuSWRlbnRpZmllciIsInRleHRGaWVsZHNJZGVudGlmaWVyIiwic2VsZWN0RmllbGRzSWRlbnRpZmllciIsInRhYmxlSWQiLCJ0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkIiwiJHRleHRGaWVsZCIsInRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQiLCJjbGljayIsInByZXZlbnREZWZhdWx0IiwiJGJ1dHRvbiIsIiR3cmFwcGVyIiwibW9kYWxUaXRsZSIsImltYWdlIiwibWVkaWEiLCJtdWx0aXBsZSIsIm9wZW4iLCJ1cGxvYWRlZEltYWdlIiwic3RhdGUiLCJnZXQiLCJmaXJzdCIsImltYWdlRGF0YSIsInRvSlNPTiIsInRodW1ibmFpbCIsInNpemVzIiwiaW1hZ2VVcmwiLCJ1cmwiLCJ0b2dnbGVMb2FkaW5nSW1hZ2UiLCIkZW5hYmxlTG9hZGluZ092ZXJsYXkiLCJlbmFibGVMb2FkaW5nT3ZlcmxheSIsIl9lbmFibGVMb2FkaW5nT3ZlcmxheSIsImVuYWJsZVBhZ2luYXRpb24iLCIkZW5hYmxlUGFnaW5hdGlvbiIsImVuYWJsZVBhZ2luYXRpb25PbkxvYWQiLCJfZW5hYmxlUGFnaW5hdGlvbiIsInNjcm9sbFdpbmRvdyIsImRlcGVuZGVudEZpZWxkcyIsIiRzY3JvbGxXaW5kb3ciLCJkZXBlbmRhbnREYXRhIiwiX2hhbmRsZVRvZ2dsZVJlcXVlc3QiLCJkYXRhIiwiY3VycmVudFNlbGVjdG9yIiwiaGFuZGxlclR5cGUiLCJkZXBlbmRhbnQiLCJfdmFsdWUiLCJkIiwidmFsaWRWYWx1ZXMiLCJoYW5kbGVUb2dnbGVSZXF1ZXN0IiwiJGhhbmRsZXIiLCJfdGhp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QUNBLGNBQU1zTCxNQUFNLEdBQUd0TCxDQUFDLENBQUUsSUFBRixDQUFELENBQVVpQixHQUFWLEVBQWY7O0FBQ0F3SyxVQUFBQSxtQkFBbUIsQ0FBRVAsSUFBRixFQUFRUyxLQUFSLEVBQWVMLE1BQWYsQ0FBbkI7QUFDQSxTQUpEOztBQU1BLFlBQUssQ0FBRXRMLENBQUMsQ0FBRUMsWUFBRixDQUFELENBQWtCc0MsUUFBbEIsQ0FBNEIsUUFBNUIsQ0FBUCxFQUFnRDtBQUMvQ3ZDLFVBQUFBLENBQUMsQ0FBRUMsWUFBRixDQUFELENBQWtCa0UsUUFBbEIsQ0FBNEIsUUFBNUI7QUFFQWxFLFVBQUFBLFlBQVksQ0FBQ21FLE9BQWIsQ0FBc0IsYUFBdEI7QUFDQTtBQUNEO0FBQ0QsS0FuQkQ7QUFvQkE7O0FBRUR3SCxFQUFBQSxVQUFVLENBQUUsSUFBRixDQUFWO0FBRUEzTCxFQUFBQSxZQUFZLENBQUNDLEVBQWIsQ0FBaUIsYUFBakIsRUFBZ0MsWUFBVztBQUMxQztBQUNBMEwsSUFBQUEsVUFBVTtBQUNWLEdBSEQ7QUFLQSxDQTdjRCIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLWFkbWluLXNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIERpc3BsYXkgdHlwZSBmaWVsZHMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICB3cHRvb2xzLmlvXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJHF1ZXJ5VHlwZSAgICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1xdWVyeV90eXBlJyApO1xuXHRcdFx0Y29uc3QgdmFsaWREaXNwbGF5VHlwZXMgPSBbICdsYWJlbCcsICdjb2xvcicsICdpbWFnZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZERpc3BsYXlUeXBlcy5pbmNsdWRlcyggdmFsdWUgKSApIHtcblx0XHRcdFx0Y29uc3QgJG11bHRpcGxlRmlsdGVyID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcgKTtcblxuXHRcdFx0XHRpZiAoICRtdWx0aXBsZUZpbHRlci5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRxdWVyeVR5cGUuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX211bHRpcGxlX2ZpbHRlciBpbnB1dCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkcXVlcnlUeXBlICAgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXF1ZXJ5X3R5cGUnICk7XG5cdFx0XHRjb25zdCAkZGlzcGxheVR5cGUgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnICk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VHlwZSAgICAgICA9ICRkaXNwbGF5VHlwZS52YWwoKTtcblx0XHRcdGNvbnN0IHZhbGlkRGlzcGxheVR5cGVzID0gWyAnbGFiZWwnLCAnY29sb3InLCAnaW1hZ2UnIF07XG5cblx0XHRcdGlmICggdmFsaWREaXNwbGF5VHlwZXMuaW5jbHVkZXMoIGRpc3BsYXlUeXBlICkgKSB7XG5cdFx0XHRcdGlmICggJzEnID09PSB2YWx1ZSApIHtcblx0XHRcdFx0XHQkcXVlcnlUeXBlLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkcXVlcnlUeXBlLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIERpc3BsYXkgdHlwZSBmaWVsZHMuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICB3cHRvb2xzLmlvXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmaWVsZFdyYXBwZXIgPSAkKCAnI2Nob3Nlbl9maWVsZF93cmFwcGVyJyApO1xuXG5cdC8vIEhpZXJhcmNoaWNhbCBmaWVsZCdzIHRvZ2dsZSB2aXNpYmlsaXR5IHdoZW4gdGV4dCBkaXNwbGF5IHR5cGUgaXMgY2hhbmdlZC5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkaHJGaWVsZHMgICAgICAgPSAkZmllbGQuZmluZCggJy5oaWVyYXJjaGljYWwtZmllbGRzJyApO1xuXHRcdFx0Y29uc3QgJGhpZXJhcmNoaWNhbCAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtaGllcmFyY2hpY2FsJyApO1xuXHRcdFx0Y29uc3QgdXNlSGllcmFyY2hpY2FsID0gJGhpZXJhcmNoaWNhbC5maW5kKCAnaW5wdXQnICkuaXMoICc6Y2hlY2tlZCcgKTtcblx0XHRcdGNvbnN0ICRockFjY29yZGlvbiAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9oaWVyYXJjaHlfYWNjb3JkaW9uJyApO1xuXG5cdFx0XHRpZiAoICdjaGVja2JveCcgPT09IHZhbHVlIHx8ICdyYWRpbycgPT09IHZhbHVlICkge1xuXHRcdFx0XHQkaHJGaWVsZHMuc2hvdygpO1xuXG5cdFx0XHRcdGlmICggdXNlSGllcmFyY2hpY2FsICkge1xuXHRcdFx0XHRcdCRockFjY29yZGlvbi5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JGhyQWNjb3JkaW9uLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICggJ3NlbGVjdCcgPT09IHZhbHVlIHx8ICdtdWx0aS1zZWxlY3QnID09PSB2YWx1ZSApIHtcblx0XHRcdFx0JGhyRmllbGRzLnNob3coKTtcblx0XHRcdFx0JGhyQWNjb3JkaW9uLmhpZGUoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRockZpZWxkcy5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gSGllcmFyY2hpY2FsIGFjY29yZGlvbiBmaWVsZCB0b2dnbGUgdmlzaWJpbGl0eSB3aGVuIHNob3cgaGllcmFyY2h5IGlzIGNoYW5nZWQuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWhpZXJhcmNoaWNhbCBpbnB1dCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCBkaXNwbGF5VHlwZSAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgJGhyQWNjb3JkaW9uID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZW5hYmxlX2hpZXJhcmNoeV9hY2NvcmRpb24nICk7XG5cblx0XHRcdGlmICggJzEnID09PSB2YWx1ZSApIHtcblx0XHRcdFx0aWYgKCAnY2hlY2tib3gnID09PSBkaXNwbGF5VHlwZSB8fCAncmFkaW8nID09PSBkaXNwbGF5VHlwZSApIHtcblx0XHRcdFx0XHQkaHJBY2NvcmRpb24uc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRockFjY29yZGlvbi5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRockFjY29yZGlvbi5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gT3ZlcnJpZGUgbm8tcmVzdWx0cy1tZXNzYWdlLCBhbGwtaXRlbXMtbGFiZWwgZmllbGQncyB0b2dnbGUgdmlzaWJpbGl0eSB3aGVuIHRleHQgZGlzcGxheSB0eXBlIGlzIGNoYW5nZWQuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJG5vUmVzdWx0cyAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0XHRjb25zdCB1c2VDaG9zZW4gICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnICkuaXMoICc6Y2hlY2tlZCcgKTtcblxuXHRcdFx0aWYgKCB1c2VDaG9zZW4gJiYgKCAnc2VsZWN0JyA9PT0gdmFsdWUgfHwgJ211bHRpLXNlbGVjdCcgPT09IHZhbHVlICkgKSB7XG5cdFx0XHRcdCRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggKCAncmFkaW8nID09PSB2YWx1ZSB8fCAnc2VsZWN0JyA9PT0gdmFsdWUgKSB8fCAoICdtdWx0aS1zZWxlY3QnID09PSB2YWx1ZSAmJiB1c2VDaG9zZW4gKSApIHtcblx0XHRcdFx0JGFsbEl0ZW1zTGFiZWwuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGFsbEl0ZW1zTGFiZWwuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdC8vIE92ZXJyaWRlIG5vLXJlc3VsdHMtbWVzc2FnZSwgYWxsLWl0ZW1zLWxhYmVsIGZpZWxkJ3MgdG9nZ2xlIHZpc2liaWxpdHkgd2hlbiB0ZXh0IHVzZSBjaG9zZW4gaXMgY2hhbmdlZC5cblx0ZmllbGRXcmFwcGVyLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0XHRjb25zdCAkYWxsSXRlbXNMYWJlbCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlUeXBlICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCAnMScgPT09IHZhbHVlICYmICggJ3NlbGVjdCcgPT09IGRpc3BsYXlUeXBlIHx8ICdtdWx0aS1zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApICkge1xuXHRcdFx0XHQkbm9SZXN1bHRzLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoXG5cdFx0XHRcdCggJzEnID09PSB2YWx1ZSAmJiAnbXVsdGktc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKVxuXHRcdFx0XHR8fCAoICdyYWRpbycgPT09IGRpc3BsYXlUeXBlIHx8ICdzZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0XHQpIHtcblx0XHRcdFx0JGFsbEl0ZW1zTGFiZWwuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGFsbEl0ZW1zTGFiZWwuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIEZpZWxkIG1ldGEgYm94LlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgd3B0b29scy5pb1xuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblx0Y29uc3QgZmllbGRJbnB1dCAgID0gJ1tuYW1lXTpub3QoLm1hbnVhbF9vcHRpb25zKSc7XG5cdGNvbnN0IGZpZWxkU3RhdGVzICA9IHt9O1xuXG5cdGZ1bmN0aW9uIHN0b3JlRmllbGRTdGF0ZSgpIHtcblx0XHRjb25zdCBmaWVsZFR5cGUgPSBmaWVsZFdyYXBwZXIuZmluZCggJyNmaWVsZF9kYXRhJyApLmF0dHIoICdkYXRhLWZpZWxkLXR5cGUnICk7XG5cblx0XHRpZiAoICEgZmllbGRUeXBlICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZpZWxkVmFsdWVzID0ge307XG5cblx0XHRmaWVsZFdyYXBwZXIuZmluZCggZmllbGRJbnB1dCApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJGlucHV0ID0gJCggdGhpcyApO1xuXHRcdFx0Y29uc3QgdHlwZSAgID0gJGlucHV0LmF0dHIoICd0eXBlJyApO1xuXHRcdFx0Y29uc3QgbmFtZSAgID0gJGlucHV0LmF0dHIoICduYW1lJyApO1xuXHRcdFx0Y29uc3QgdmFsdWUgID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRpZiAoICdjaGVja2JveCcgPT09IHR5cGUgfHwgJ3JhZGlvJyA9PT0gdHlwZSApIHtcblx0XHRcdFx0aWYgKCAkaW5wdXQuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdFx0XHRmaWVsZFZhbHVlc1sgbmFtZSBdID0gdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZpZWxkVmFsdWVzWyBuYW1lIF0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHQvLyBIYW5kbGUgbWFudWFsIG9wdGlvbnMuXG5cdFx0Y29uc3QgbWFudWFsT3B0aW9ucyA9IHt9O1xuXG5cdFx0ZmllbGRXcmFwcGVyLmZpbmQoICcubWFudWFsX29wdGlvbnMnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCBuYW1lICAgPSAkaW5wdXQuYXR0ciggJ25hbWUnICk7XG5cblx0XHRcdG1hbnVhbE9wdGlvbnNbIG5hbWUgXSA9ICRpbnB1dC52YWwoKTtcblx0XHR9ICk7XG5cblx0XHRmaWVsZFZhbHVlc1sgJ21hbnVhbF9vcHRpb25zJyBdID0gbWFudWFsT3B0aW9ucztcblxuXHRcdGZpZWxkU3RhdGVzWyBmaWVsZFR5cGUgXSA9IGZpZWxkVmFsdWVzO1xuXHR9XG5cblx0ZnVuY3Rpb24gdXBkYXRlRmllbGRTdGF0ZSggJGVsbSApIHtcblx0XHRjb25zdCBmaWVsZFR5cGUgID0gZmllbGRXcmFwcGVyLmZpbmQoICcjZmllbGRfZGF0YScgKS5hdHRyKCAnZGF0YS1maWVsZC10eXBlJyApO1xuXHRcdGNvbnN0IGZpZWxkU3RhdGUgPSBmaWVsZFN0YXRlc1sgZmllbGRUeXBlIF07XG5cblx0XHRjb25zdCBuYW1lICA9ICRlbG0uYXR0ciggJ25hbWUnICk7XG5cdFx0Y29uc3QgdHlwZSAgPSAkZWxtLmF0dHIoICd0eXBlJyApO1xuXHRcdGNvbnN0IHZhbHVlID0gJGVsbS52YWwoKTtcblxuXHRcdGlmICggJGVsbS5oYXNDbGFzcyggJ21hbnVhbF9vcHRpb25zJyApICkge1xuXHRcdFx0Y29uc3QgbWFudWFsX29wdGlvbnMgPSBmaWVsZFN0YXRlWyAnbWFudWFsX29wdGlvbnMnIF0gfHwge307XG5cblx0XHRcdG1hbnVhbF9vcHRpb25zWyBuYW1lIF0gPSB2YWx1ZTtcblxuXHRcdFx0ZmllbGRTdGF0ZVsgJ21hbnVhbF9vcHRpb25zJyBdID0gbWFudWFsX29wdGlvbnM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICggJ2NoZWNrYm94JyA9PT0gdHlwZSB8fCAncmFkaW8nID09PSB0eXBlICkge1xuXHRcdFx0XHRjb25zdCAkaW5wdXQgPSBmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lPVwiJyArIG5hbWUgKyAnXCJdJyApO1xuXG5cdFx0XHRcdGlmICggJGlucHV0LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRcdFx0ZmllbGRTdGF0ZVsgbmFtZSBdID0gdmFsdWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZGVsZXRlIGZpZWxkU3RhdGVbIG5hbWUgXTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZmllbGRTdGF0ZVsgbmFtZSBdID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gU3RvcmUgdGhlIGluaXRpYWwgZmllbGQgc3RhdGUuXG5cdHN0b3JlRmllbGRTdGF0ZSgpO1xuXG5cdGZpZWxkV3JhcHBlci5maW5kKCAnW25hbWVdJyApLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHR1cGRhdGVGaWVsZFN0YXRlKCAkdGhpcyApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gYXBwbHlGaWVsZFN0YXRlKCBmaWVsZFR5cGUgKSB7XG5cdFx0Y29uc3QgZmllbGRTdGF0ZSA9IGZpZWxkU3RhdGVzWyBmaWVsZFR5cGUgXTtcblxuXHRcdGZpZWxkV3JhcHBlci5maW5kKCBmaWVsZElucHV0ICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkaW5wdXQgPSAkKCB0aGlzICk7XG5cdFx0XHRjb25zdCB0eXBlICAgPSAkaW5wdXQuYXR0ciggJ3R5cGUnICk7XG5cdFx0XHRjb25zdCBuYW1lICAgPSAkaW5wdXQuYXR0ciggJ25hbWUnICk7XG5cdFx0XHRjb25zdCB2YWx1ZSAgPSBmaWVsZFN0YXRlWyBuYW1lIF07XG5cblx0XHRcdGlmICggJ2NoZWNrYm94JyA9PT0gdHlwZSB8fCAncmFkaW8nID09PSB0eXBlICkge1xuXHRcdFx0XHRpZiAoIG5hbWUgaW4gZmllbGRTdGF0ZSApIHtcblx0XHRcdFx0XHQvLyBBZGQgJ2NoZWNrZWQnIGF0dHJpYnV0ZS5cblx0XHRcdFx0XHRmaWVsZFdyYXBwZXJcblx0XHRcdFx0XHRcdC5maW5kKCAnW25hbWU9XCInICsgbmFtZSArICdcIl1bdmFsdWU9XCInICsgdmFsdWUgKyAnXCJdJyApXG5cdFx0XHRcdFx0XHQuYXR0ciggJ2NoZWNrZWQnLCAnY2hlY2tlZCcgKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBSZW1vdmUgJ2NoZWNrZWQnIGF0dHJpYnV0ZS5cblx0XHRcdFx0XHRmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lPVwiJyArIG5hbWUgKyAnXCJdJyApLnJlbW92ZUF0dHIoICdjaGVja2VkJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkaW5wdXQudmFsKCB2YWx1ZSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdC8vIFByb2Nlc3MgdGhlIG1hbnVhbCBvcHRpb25zLlxuXHRcdGlmICggJ21hbnVhbF9vcHRpb25zJyBpbiBmaWVsZFN0YXRlICkge1xuXHRcdFx0Y29uc3QgcmF3T3B0aW9ucyA9IGZpZWxkU3RhdGVbICdtYW51YWxfb3B0aW9ucycgXTtcblxuXHRcdFx0JC5lYWNoKCByYXdPcHRpb25zLCBmdW5jdGlvbiggaW5wdXROYW1lLCByYXcgKSB7XG5cdFx0XHRcdGNvbnN0ICRyYXdJbnB1dCA9IGZpZWxkV3JhcHBlci5maW5kKCAnW25hbWU9XCInICsgaW5wdXROYW1lICsgJ1wiXScgKTtcblxuXHRcdFx0XHQkcmF3SW5wdXQudmFsKCByYXcgKTtcblxuXHRcdFx0XHRjb25zdCBtYW51YWxPcHRpb25zID0gSlNPTi5wYXJzZSggZGVjb2RlVVJJQ29tcG9uZW50KCByYXcgKSApO1xuXG5cdFx0XHRcdGlmICggISBtYW51YWxPcHRpb25zLmxlbmd0aCApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCB0YWJsZUlkZW50aWZpZXIgPSAkcmF3SW5wdXQuYXR0ciggJ2RhdGEtdGFibGUnICk7XG5cdFx0XHRcdGNvbnN0IHJvd1RlbXBsYXRlSWQgICA9ICRyYXdJbnB1dC5hdHRyKCAnZGF0YS10bXBsJyApO1xuXG5cdFx0XHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdFx0XHRpZiAoICEgalF1ZXJ5KCAnI3RtcGwtJyArIHJvd1RlbXBsYXRlSWQgKS5sZW5ndGggKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3Qgcm93c0lkZW50aWZpZXIgPSAnLmZpZWxkLXRhYmxlLWJvZHktcm93cyc7XG5cdFx0XHRcdGNvbnN0IHJvd0lkZW50aWZpZXIgID0gJy5yb3ctaXRlbSc7XG5cblx0XHRcdFx0Y29uc3QgJHRhYmxlID0gZmllbGRXcmFwcGVyLmZpbmQoIHRhYmxlSWRlbnRpZmllciApO1xuXHRcdFx0XHRjb25zdCAkcm93cyAgPSAkdGFibGUuZmluZCggcm93c0lkZW50aWZpZXIgKTtcblxuXHRcdFx0XHQkLmVhY2goIG1hbnVhbE9wdGlvbnMsIGZ1bmN0aW9uKCBpLCBvcHRpb24gKSB7XG5cdFx0XHRcdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggcm93VGVtcGxhdGVJZCApO1xuXG5cdFx0XHRcdFx0bGV0IHJvd0RlZmF1bHRPcHRpb25zID0ge307XG5cblx0XHRcdFx0XHRpZiAoICcubWFudWFsLW9wdGlvbnMtdGFibGUnID09PSB0YWJsZUlkZW50aWZpZXIgKSB7XG5cdFx0XHRcdFx0XHRyb3dEZWZhdWx0T3B0aW9ucyA9IHtcblx0XHRcdFx0XHRcdFx0J3ZhbHVlJzogJycsXG5cdFx0XHRcdFx0XHRcdCdsYWJlbCc6ICcnLFxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCByb3dEZWZhdWx0T3B0aW9ucyApO1xuXG5cdFx0XHRcdFx0JHJvd3MuYXBwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0XHRcdFx0Y29uc3QgJGxhc3RSb3cgPSAkcm93cy5maW5kKCByb3dJZGVudGlmaWVyICkubGFzdCgpO1xuXG5cdFx0XHRcdFx0JGxhc3RSb3cuZmluZCggJ1tkYXRhLW5hbWVdJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0XHRjb25zdCBuYW1lICA9ICR0aGlzLmF0dHIoICdkYXRhLW5hbWUnICk7XG5cdFx0XHRcdFx0XHRjb25zdCB2YWx1ZSA9IG9wdGlvblsgbmFtZSBdO1xuXG5cdFx0XHRcdFx0XHQkdGhpcy52YWwoIHZhbHVlICk7XG5cblx0XHRcdFx0XHRcdGlmICggJ2ltYWdlX3VybCcgPT09IG5hbWUgJiYgdmFsdWUgKSB7XG5cdFx0XHRcdFx0XHRcdCRsYXN0Um93LmZpbmQoICcud3AtaW1hZ2UtcGlja2VyLWNvbnRhaW5lcicgKS5hZGRDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHRcdFx0XHRcdFx0JGxhc3RSb3cuZmluZCggJ2ltZycgKS5hdHRyKCAnc3JjJywgdmFsdWUgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQkdGFibGUuYWRkQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Y29uc3QgJGZpZWxkID0gZmllbGRXcmFwcGVyLmZpbmQoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdFx0ZmllbGRXcmFwcGVyLnRyaWdnZXIoICduZXdfb3B0aW9uX2FkZGVkJywgWyAkZmllbGQgXSApO1xuXHRcdH1cblx0fVxuXG5cdCQoICcjYXZhaWxhYmxlX2ZpZWxkcycgKS5vbiggJ2NoYW5nZScsICdbbmFtZT1cIl9hY3RpdmVfZmllbGRcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IF9maWVsZFR5cGUgPSAkdGhpcy52YWwoKTtcblx0XHRjb25zdCBmaWVsZE5hbWUgID0gJHRoaXMuYXR0ciggJ2RhdGEtZmllbGQtbmFtZScgKTtcblxuXHRcdGlmICggISBfZmllbGRUeXBlICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1mb3JtLWZpZWxkLScgKyBfZmllbGRUeXBlO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgdGVtcGxhdGUgICAgICAgICA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRjb25zdCByZW5kZXJlZCAgICAgICAgID0gdGVtcGxhdGUoKTtcblx0XHRjb25zdCBmaWVsZERhdGFXcmFwcGVyID0gZmllbGRXcmFwcGVyLmZpbmQoICcjZmllbGRfZGF0YScgKTtcblx0XHRjb25zdCBmaWVsZE5hbWVXcmFwcGVyID0gZmllbGRXcmFwcGVyLmZpbmQoICcucG9zdGJveC1oZWFkZXIgaDInICk7XG5cdFx0Y29uc3QgZmllbGRJbnNpZGUgICAgICA9IGZpZWxkV3JhcHBlci5maW5kKCAnLmluc2lkZScgKTtcblxuXHRcdGZpZWxkV3JhcHBlci5yZW1vdmVDbGFzcyggJ2hpZGRlbicgKTtcblxuXHRcdGZpZWxkRGF0YVdyYXBwZXIuYXR0ciggJ2RhdGEtZmllbGQtdHlwZScsIF9maWVsZFR5cGUgKTtcblx0XHRmaWVsZE5hbWVXcmFwcGVyLmh0bWwoIGZpZWxkTmFtZSApO1xuXHRcdGZpZWxkSW5zaWRlLmh0bWwoIHJlbmRlcmVkICk7XG5cblx0XHQvLyBJZiBhbHJlYWR5IGZvdW5kIHRoZSBmaWVsZCBzdGF0ZSB0aGVuIGFwcGx5IGl0LCBvdGhlcndpc2Ugc3RvcmUgaXQuXG5cdFx0aWYgKCBfZmllbGRUeXBlIGluIGZpZWxkU3RhdGVzICkge1xuXHRcdFx0YXBwbHlGaWVsZFN0YXRlKCBfZmllbGRUeXBlICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0b3JlRmllbGRTdGF0ZSgpO1xuXHRcdH1cblxuXHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnZmllbGRfYWRkZWQnICk7XG5cblx0XHRmaWVsZFdyYXBwZXIuZmluZCggJ1tuYW1lXScgKS5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHVwZGF0ZUZpZWxkU3RhdGUoICR0aGlzICk7XG5cdFx0fSApO1xuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogRmlsdGVyIGZvcm0gbWV0YSBib3guXG4gKlxuICogQHNpbmNlICAgICAgMy4xLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICB3cHRvb2xzLmlvXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCBmb3JtRGF0YSAgICAgID0gJCggJyNmb3JtX2RhdGEnICk7XG5cdGNvbnN0ICRkcm9wZG93biAgICAgPSAkKCAnI2F2YWlsYWJsZS1maWx0ZXJzLWRyb3Bkb3duJyApO1xuXHRjb25zdCAkYWRkRmlsdGVyQnRuID0gJCggJyNhZGQtZmlsdGVyLXRvLWZvcm0tYnRuJyApO1xuXG5cdCRkcm9wZG93bi5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IHZhbHVlID0gJHRoaXMudmFsKCk7XG5cblx0XHRpZiAoIHZhbHVlICkge1xuXHRcdFx0JGFkZEZpbHRlckJ0bi5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRhZGRGaWx0ZXJCdG4uYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdH1cblx0fSApO1xuXG5cdC8qKlxuXHQgKiBBZGQgZmlsdGVyIHRvIGZvcm0uXG5cdCAqL1xuXHQkYWRkRmlsdGVyQnRuLm9uKCAnY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkc2VsZWN0ZWQgPSAkZHJvcGRvd24uZmluZCggJ29wdGlvbjpzZWxlY3RlZCcgKTtcblx0XHRjb25zdCBmaWx0ZXJJZCAgPSAkc2VsZWN0ZWQudmFsKCk7XG5cblx0XHRpZiAoICEgZmlsdGVySWQubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZpbHRlclRpdGxlID0gJHNlbGVjdGVkLmF0dHIoICdkYXRhLXRpdGxlJyApO1xuXHRcdGNvbnN0IGZpbHRlcktleSAgID0gJHNlbGVjdGVkLmF0dHIoICdkYXRhLWZpbHRlci1rZXknICk7XG5cdFx0Y29uc3QgZWRpdExpbmsgICAgPSAkc2VsZWN0ZWQuYXR0ciggJ2RhdGEtZWRpdC1saW5rJyApO1xuXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggJ3djYXBmLWZpbHRlci1mb3JtLWl0ZW0nICk7XG5cdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSggeyB0aXRsZTogZmlsdGVyVGl0bGUsIGlkOiBmaWx0ZXJJZCwga2V5OiBmaWx0ZXJLZXksIGVkaXRfbGluazogZWRpdExpbmsgfSApO1xuXG5cdFx0Zm9ybURhdGEuZmluZCggJyNmaWx0ZXItZm9ybS1pdGVtcycgKS5wcmVwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0JGRyb3Bkb3duLnByb3AoICdzZWxlY3RlZEluZGV4JywgMCApO1xuXHRcdCRkcm9wZG93bi5maW5kKCAnb3B0aW9uW3ZhbHVlPVwiJyArIGZpbHRlcklkICsgJ1wiXScgKS5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0JGRyb3Bkb3duLnRyaWdnZXIoICdjaGFuZ2UnICk7XG5cdH0gKTtcblxuXHQvKipcblx0ICogTWFrZSB0aGUgZmlsdGVycyBzb3J0YWJsZS5cblx0ICovXG5cdGZ1bmN0aW9uIHNvcnRhYmxlKCBpZGVudGlmaWVyICkge1xuXHRcdGNvbnN0IGNvbnRhaW5lciA9ICQoIGlkZW50aWZpZXIgKTtcblxuXHRcdGNvbnRhaW5lci5zb3J0YWJsZShcblx0XHRcdHtcblx0XHRcdFx0b3BhY2l0eTogMC44LFxuXHRcdFx0XHRyZXZlcnQ6IGZhbHNlLFxuXHRcdFx0XHRjdXJzb3I6ICdtb3ZlJyxcblx0XHRcdFx0YXhpczogJ3knLFxuXHRcdFx0XHRoYW5kbGU6ICcud2lkZ2V0LXRvcCcsXG5cdFx0XHRcdGNhbmNlbDogJy53aWRnZXQtdGl0bGUtYWN0aW9uJyxcblx0XHRcdFx0aXRlbXM6ICcud2lkZ2V0Jyxcblx0XHRcdFx0cGxhY2Vob2xkZXI6ICd3aWRnZXQtcGxhY2Vob2xkZXInLFxuXHRcdFx0fVxuXHRcdCk7XG5cdH1cblxuXHRzb3J0YWJsZSggJyNmb3JtX2RhdGEnICk7XG5cblx0LyoqXG5cdCAqIFJlbW92ZSB0aGUgZmllbGQuXG5cdCAqL1xuXHRmdW5jdGlvbiByZW1vdmVGaWVsZCgpIHtcblx0XHRjb25zdCB3aWRnZXQgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndpZGdldCcgKTtcblx0XHRjb25zdCBmaWx0ZXJJZCA9IHdpZGdldC5maW5kKCAnLmZpbHRlci1pZCcgKS52YWwoKTtcblxuXHRcdCQoIHdpZGdldCApLnNsaWRlVXAoXG5cdFx0XHQnZmFzdCcsXG5cdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0JGRyb3Bkb3duLmZpbmQoICdvcHRpb25bdmFsdWU9XCInICsgZmlsdGVySWQgKyAnXCJdJyApLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHRcdFx0d2lkZ2V0LnJlbW92ZSgpO1xuXHRcdFx0fVxuXHRcdCk7XG5cdH1cblxuXHRmb3JtRGF0YS5vbiggJ2NsaWNrJywgJy53aWRnZXQtY29udHJvbC1yZW1vdmUnLCByZW1vdmVGaWVsZCApO1xuXG5cdC8qKlxuXHQgKiBGaWx0ZXIgZm9ybSBtZW51LlxuXHQgKi9cblx0Y29uc3QgJGZpbHRlckZvcm1NZW51ICAgICA9ICQoICcjZmlsdGVyLWZvcm0tbWVudScgKTtcblx0Y29uc3QgJGZpbHRlckZvcm1NZW51SXRlbSA9ICQoICcjZmlsdGVyLWZvcm0tbWVudSAubmF2LXRhYicgKTtcblxuXHQkZmlsdGVyRm9ybU1lbnVJdGVtLm9uKCAnY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IGlkZW50aWZpZXIgPSAkdGhpcy5hdHRyKCAnZGF0YS1mb3InICk7XG5cdFx0Y29uc3QgJGNvbnRlbnQgICA9ICQoICcudGFiLScgKyBpZGVudGlmaWVyICk7XG5cblx0XHQkZmlsdGVyRm9ybU1lbnVJdGVtLnJlbW92ZUNsYXNzKCAnbmF2LXRhYi1hY3RpdmUnICk7XG5cdFx0JGZpbHRlckZvcm1NZW51LmF0dHIoICdkYXRhLWFjdGl2ZS1uYXYnLCBpZGVudGlmaWVyICk7XG5cdFx0JHRoaXMuYWRkQ2xhc3MoICduYXYtdGFiLWFjdGl2ZScgKTtcblxuXHRcdCQoICcudGFiLWNvbnRlbnQnICkuaGlkZSgpO1xuXHRcdCRjb250ZW50LnNob3coKTtcblxuXHRcdCQoIGRvY3VtZW50ICkudHJpZ2dlciggJ3djYXBmX2ZpbHRlcl9mb3JtX25hdl9jaGFuZ2VkJywgWyBpZGVudGlmaWVyIF0gKTtcblx0fSApO1xuXG5cdCQoIGRvY3VtZW50ICkub24oICd3Y2FwZl9maWx0ZXJfZm9ybV9uYXZfY2hhbmdlZCcsIGZ1bmN0aW9uKCBlLCBpZGVudGlmaWVyICkge1xuXHRcdGNvbnN0ICR2aXNpYmlsaXR5UnVsZXNNZXRhQm94ID0gJCggJyN3Y2FwZl92aXNpYmlsaXR5X3J1bGVzJyApO1xuXG5cdFx0aWYgKCAnZ2VuZXJhbCcgPT09IGlkZW50aWZpZXIgKSB7XG5cdFx0XHQkdmlzaWJpbGl0eVJ1bGVzTWV0YUJveC5yZW1vdmVDbGFzcyggJ2ZvcmNlLWhpZGUnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCR2aXNpYmlsaXR5UnVsZXNNZXRhQm94LmFkZENsYXNzKCAnZm9yY2UtaGlkZScgKTtcblx0XHR9XG5cdH0gKTtcblxuXHQvKipcblx0ICogVG9nZ2xlIHZpc2liaWxpdHkgcnVsZXMuXG5cdCAqL1xuXHQkKCAnI2VuYWJsZV92aXNpYmlsaXR5X3J1bGVzJyApLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkcyA9ICQoICcudmlzaWJpbGl0eS1ydWxlcy1maWVsZCcgKTtcblxuXHRcdGlmICggJCggdGhpcyApLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHQkZmllbGRzLnJlbW92ZUNsYXNzKCAnZGlzYWJsZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRmaWVsZHMuYWRkQ2xhc3MoICdkaXNhYmxlZCcgKTtcblx0XHR9XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBNYW51YWwgT3B0aW9ucycgdGFibGUgZnVuY3Rpb24uXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICB3cHRvb2xzLmlvXG4gKi9cblxuLyoqXG4gKiBAcGFyYW0gdGFibGVJZGVudGlmaWVyXG4gKiBAcGFyYW0gdmFsdWVJZGVudGlmaWVyXG4gKiBAcGFyYW0gcm93VGVtcGxhdGVJZFxuICogQHBhcmFtIHJvd0RlZmF1bHRPcHRpb25zXG4gKi9cbmZ1bmN0aW9uIGluaXRNYW51YWxPcHRpb25zVGFibGUoIHRhYmxlSWRlbnRpZmllciwgdmFsdWVJZGVudGlmaWVyLCByb3dUZW1wbGF0ZUlkLCByb3dEZWZhdWx0T3B0aW9ucyA9IHt9ICkge1xuXHRjb25zdCAkID0galF1ZXJ5O1xuXG5cdGNvbnN0IGZpZWxkV3JhcHBlciA9ICQoICcjY2hvc2VuX2ZpZWxkX3dyYXBwZXInICk7XG5cblx0Y29uc3QgZmllbGRJZGVudGlmaWVyID0gJy53Y2FwZi1mb3JtLWZpZWxkJztcblx0Y29uc3Qgcm93c0lkZW50aWZpZXIgID0gJy5maWVsZC10YWJsZS1ib2R5LXJvd3MnO1xuXHRjb25zdCByb3dJZGVudGlmaWVyICAgPSAnLnJvdy1pdGVtJztcblxuXHRmdW5jdGlvbiBpbml0U29ydGFibGVUYWJsZSggJHNlbGVjdG9yICkge1xuXHRcdCRzZWxlY3Rvci5zb3J0YWJsZSgge1xuXHRcdFx0b3BhY2l0eTogMC44LFxuXHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdGN1cnNvcjogJ21vdmUnLFxuXHRcdFx0YXhpczogJ3knLFxuXHRcdFx0aGFuZGxlOiAnLm1vdmUtb3B0aW9ucy1oYW5kbGVyJyxcblx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdHVwZGF0ZTogZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCA9ICQoIGUudGFyZ2V0ICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0XHRcdHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0XHRcdH1cblx0XHR9ICkuZGlzYWJsZVNlbGVjdGlvbigpO1xuXHR9XG5cblx0Y29uc3QgdGFibGVSb3dzSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgJyArIHJvd3NJZGVudGlmaWVyO1xuXG5cdC8vIEluaXQgdGhlIHNvcnRhYmxlIHRhYmxlIGFmdGVyIHBhZ2UgbG9hZHMuXG5cdGluaXRTb3J0YWJsZVRhYmxlKCBmaWVsZFdyYXBwZXIuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApICk7XG5cblx0Ly8gSW5pdCB0aGUgc29ydGFibGUgdGFibGUgYWZ0ZXIgdGhlIGZpZWxkIGlzIGFkZGVkLlxuXHRmaWVsZFdyYXBwZXIub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdGluaXRTb3J0YWJsZVRhYmxlKCAkKCBmaWVsZFdyYXBwZXIuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApICkgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHRyaWdnZXJPcHRpb25zQ2hhbmdlKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJHZhbHVlSG9sZGVyID0gJGZpZWxkLmZpbmQoIHZhbHVlSWRlbnRpZmllciApO1xuXHRcdGNvbnN0ICRyb3dzICAgICAgICA9ICRmaWVsZC5maW5kKCB0YWJsZVJvd3NJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgX3Jvd3MgICAgICAgID0gW107XG5cblx0XHQkcm93cy5maW5kKCAnLnJvdy1pdGVtJyApLmVhY2goIGZ1bmN0aW9uKCBpLCBfaXRlbSApIHtcblx0XHRcdGNvbnN0ICRpdGVtID0gJCggX2l0ZW0gKTtcblx0XHRcdGNvbnN0IG9iaiAgID0ge307XG5cblx0XHRcdCRpdGVtLmZpbmQoICdbZGF0YS1uYW1lXScgKS5lYWNoKCBmdW5jdGlvbiggZmllbGRJbmRleCwgZmllbGQgKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCA9ICQoIGZpZWxkICk7XG5cdFx0XHRcdGNvbnN0IG5hbWUgICA9ICRmaWVsZC5hdHRyKCAnZGF0YS1uYW1lJyApO1xuXG5cdFx0XHRcdG9ialsgbmFtZSBdID0gJGZpZWxkLnZhbCgpO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRfcm93cy5wdXNoKCBvYmogKTtcblx0XHR9ICk7XG5cblx0XHRjb25zdCByYXdWYWx1ZXMgPSBlbmNvZGVVUklDb21wb25lbnQoIEpTT04uc3RyaW5naWZ5KCBfcm93cyApICk7XG5cdFx0JHZhbHVlSG9sZGVyLnZhbCggcmF3VmFsdWVzICkudHJpZ2dlciggJ2NoYW5nZScgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApIHtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoIHRhYmxlSWRlbnRpZmllciApO1xuXHRcdGNvbnN0IHRhYmxlUm93cyAgICAgPSAkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApLmNoaWxkcmVuKCk7XG5cblx0XHRpZiAoIDIgPiB0YWJsZVJvd3MubGVuZ3RoICkge1xuXHRcdFx0JG9wdGlvbnNUYWJsZS5yZW1vdmVDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJlbW92ZSBPcHRpb25cblx0Y29uc3QgcmVtb3ZlQnRuSWRlbnRpZmllciA9IHRhYmxlSWRlbnRpZmllciArICcgLnJlbW92ZS1vcHRpb24nO1xuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2NsaWNrJywgcmVtb3ZlQnRuSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGl0ZW0gID0gJCggdGhpcyApLmNsb3Nlc3QoIHJvd0lkZW50aWZpZXIgKTtcblx0XHRjb25zdCAkZmllbGQgPSAkaXRlbS5jbG9zZXN0KCBmaWVsZElkZW50aWZpZXIgKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApO1xuXG5cdFx0JGl0ZW0ucmVtb3ZlKCk7XG5cblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBDbGVhciBBbGwgT3B0aW9uc1xuXHRjb25zdCBjbGVhck9wdGlvbnNCdG5JZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAuY2xlYXItb3B0aW9ucyc7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnY2xpY2snLCBjbGVhck9wdGlvbnNCdG5JZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggZmllbGRJZGVudGlmaWVyICk7XG5cblx0XHQkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApLmVtcHR5KCk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKTtcblx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBBZGQgTmV3IE9wdGlvblxuXHRjb25zdCBhZGRPcHRpb25CdG5JZGVudGlmaWVyID0gdGFibGVJZGVudGlmaWVyICsgJyAuYWRkLW9wdGlvbic7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnY2xpY2snLCBhZGRPcHRpb25CdG5JZGVudGlmaWVyLCBmdW5jdGlvbigpIHtcblx0XHQvLyBCYWlsIG91dCBpZiBubyB0bXBsIGZvdW5kIGZvciB0aGUgdHlwZS5cblx0XHRpZiAoICEgalF1ZXJ5KCAnI3RtcGwtJyArIHJvd1RlbXBsYXRlSWQgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggcm93VGVtcGxhdGVJZCApO1xuXHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHJvd0RlZmF1bHRPcHRpb25zICk7XG5cdFx0Y29uc3QgJHRhYmxlICAgPSAkZmllbGQuZmluZCggdGFibGVJZGVudGlmaWVyICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgPSAkZmllbGQuZmluZCggdGFibGVSb3dzSWRlbnRpZmllciApO1xuXG5cdFx0JHJvd3MuYXBwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXG5cdFx0ZmllbGRXcmFwcGVyLnRyaWdnZXIoICduZXdfb3B0aW9uX2FkZGVkJywgWyAkZmllbGQgXSApO1xuXG5cdFx0aWYgKCAhICR0YWJsZS5oYXNDbGFzcyggJ2hhcy1vcHRpb25zJyApICkge1xuXHRcdFx0JHRhYmxlLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gVHJpZ2dlciBvcHRpb25zIGNoYW5nZSB3aGVuIHRoZSB0ZXh0IGZpZWxkcyBnZXQgY2hhbmdlZC5cblx0Y29uc3QgdGV4dEZpZWxkc0lkZW50aWZpZXIgPSB0YWJsZVJvd3NJZGVudGlmaWVyICsgJyBpbnB1dFt0eXBlPVwidGV4dFwiXSc7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnaW5wdXQnLCB0ZXh0RmllbGRzSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gVHJpZ2dlciBvcHRpb25zIGNoYW5nZSB3aGVuIHRoZSBzZWxlY3QgZmllbGRzIGdldCBjaGFuZ2VkLlxuXHRsZXQgc2VsZWN0RmllbGRzSWRlbnRpZmllciA9IHRhYmxlUm93c0lkZW50aWZpZXIgKyAnIHNlbGVjdCc7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnY2hhbmdlJywgc2VsZWN0RmllbGRzSWRlbnRpZmllciwgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoIGZpZWxkSWRlbnRpZmllciApO1xuXG5cdFx0dHJpZ2dlck9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gVHJpZ2dlciBvcHRpb25zIGNoYW5nZSB3aGVuIHZhbHVlIGlzIGFkZGVkIGZyb20gbW9kYWwuXG5cdGZpZWxkV3JhcHBlci5vbiggJ3RyaWdnZXJfb3B0aW9uc190YWJsZScsIGZ1bmN0aW9uKCBlLCB0YWJsZUlkLCAkZmllbGQgKSB7XG5cdFx0aWYgKCB0YWJsZUlkID09PSB0YWJsZUlkZW50aWZpZXIgKSB7XG5cdFx0XHR0cmlnZ2VyT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdFx0fVxuXHR9ICk7XG5cbn1cbiIsIi8qKlxuICogVGhlIG51bWJlciB1aSBvcHRpb25zLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgd3B0b29scy5pb1xuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblxuXHQvKipcblx0ICogVG9nZ2xlIGRpc2FibGVkIGF0dHJpYnV0ZSBvZiBtaW4tdmFsdWUgZmllbGQgZm9yIG51bWJlciB0eXBlLlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJGVsbSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgID0gJGVsbS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJHRleHRGaWVsZCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZSBpbnB1dFt0eXBlPVwidGV4dFwiXScgKTtcblxuXHRcdGlmICggJGVsbS5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0JHRleHRGaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCR0ZXh0RmllbGQucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdH1cblx0fVxuXG5cdGZpZWxkV3JhcHBlci5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0ZmllbGRXcmFwcGVyLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0XHR0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHRcdH0gKTtcblx0fSApO1xuXG5cdGZpZWxkV3JhcHBlci5vbihcblx0XHQnY2xpY2snLFxuXHRcdCcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0dG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJHRoaXMgKTtcblx0XHR9XG5cdCk7XG5cblx0LyoqXG5cdCAqIFRvZ2dsZSBkaXNhYmxlZCBhdHRyaWJ1dGUgb2YgbWF4LXZhbHVlIGZpZWxkIGZvciBudW1iZXIgdHlwZS5cblx0ICovXG5cdGZ1bmN0aW9uIHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICRlbG0gKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICA9ICRlbG0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICR0ZXh0RmllbGQgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWUgaW5wdXRbdHlwZT1cInRleHRcIl0nICk7XG5cblx0XHRpZiAoICRlbG0uaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdCR0ZXh0RmllbGQuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkdGV4dEZpZWxkLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHR9XG5cdH1cblxuXHRmaWVsZFdyYXBwZXIub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCkge1xuXHRcdGZpZWxkV3JhcHBlci5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdFx0dG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCggJHRoaXMgKTtcblx0XHR9ICk7XG5cdH0gKTtcblxuXHRmaWVsZFdyYXBwZXIub24oXG5cdFx0J2NsaWNrJyxcblx0XHQnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRcdHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICR0aGlzICk7XG5cdFx0fVxuXHQpO1xuXG59ICk7XG4iLCIvKipcbiAqIFBsdWdpbiBzZXR0aW5ncyBmb3JtLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgd3B0b29scy5pb1xuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0aWYgKCAhICQoICdib2R5JyApLmhhc0NsYXNzKCAnd2NhcGYtZmlsdGVyX3BhZ2Vfd2NhcGYtc2V0dGluZ3MnICkgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gTWVkaWEgdXBsb2FkZXIuXG5cdCQoICcudXBsb2FkLWltYWdlLWJ1dHRvbicgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgJGJ1dHRvbiAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCAkd3JhcHBlciAgID0gJGJ1dHRvbi5jbG9zZXN0KCAnLm1lZGlhLXVwbG9hZCcgKTtcblx0XHRjb25zdCBtb2RhbFRpdGxlID0gJGJ1dHRvbi5hdHRyKCAnZGF0YS1tb2RhbC10aXRsZScgKTtcblxuXHRcdGNvbnN0IGltYWdlID0gd3AubWVkaWEoIHsgdGl0bGU6IG1vZGFsVGl0bGUsIG11bHRpcGxlOiBmYWxzZSB9IClcblx0XHRcdC5vcGVuKClcblx0XHRcdC5vbiggJ3NlbGVjdCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCB1cGxvYWRlZEltYWdlID0gaW1hZ2Uuc3RhdGUoKS5nZXQoICdzZWxlY3Rpb24nICkuZmlyc3QoKTtcblx0XHRcdFx0Y29uc3QgaW1hZ2VEYXRhICAgICA9IHVwbG9hZGVkSW1hZ2UudG9KU09OKCk7XG5cblx0XHRcdFx0Y29uc3QgeyB0aHVtYm5haWwgfSA9IGltYWdlRGF0YS5zaXplcztcblx0XHRcdFx0bGV0IGltYWdlVXJsO1xuXG5cdFx0XHRcdGlmICggdGh1bWJuYWlsICkge1xuXHRcdFx0XHRcdGltYWdlVXJsID0gaW1hZ2VEYXRhLnNpemVzLnRodW1ibmFpbC51cmw7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aW1hZ2VVcmwgPSBpbWFnZURhdGEudXJsO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0JHdyYXBwZXIuZmluZCggJy5pbWFnZS1pZCcgKS52YWwoIGltYWdlRGF0YS5pZCApO1xuXHRcdFx0XHQkd3JhcHBlci5maW5kKCAnLmltYWdlLXNyYycgKS5hdHRyKCAnc3JjJywgaW1hZ2VVcmwgKTtcblx0XHRcdFx0JHdyYXBwZXIucmVtb3ZlQ2xhc3MoICduby1pbWFnZScgKTtcblx0XHRcdH0gKTtcblx0fSApO1xuXG5cdCQoICcucmVtb3ZlLWltYWdlLWJ1dHRvbicgKS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Y29uc3QgJGJ1dHRvbiAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgJHdyYXBwZXIgPSAkYnV0dG9uLmNsb3Nlc3QoICcubWVkaWEtdXBsb2FkJyApO1xuXG5cdFx0JHdyYXBwZXIuZmluZCggJy5pbWFnZS1pZCcgKS52YWwoICcnICk7XG5cdFx0JHdyYXBwZXIuZmluZCggJy5pbWFnZS1zcmMnICkuYXR0ciggJ3NyYycsICcnICk7XG5cdFx0JHdyYXBwZXIuYWRkQ2xhc3MoICduby1pbWFnZScgKTtcblx0fSApO1xuXG5cdC8vIFRvZ2dsZSBsb2FkaW5nIGltYWdlIGZpZWxkLlxuXHRmdW5jdGlvbiB0b2dnbGVMb2FkaW5nSW1hZ2UoIHZhbHVlICkge1xuXHRcdGNvbnN0ICRzZWxlY3RvciA9ICQoICcuc2V0dGluZ3MtdGFibGUtbG9hZGluZ19pbWFnZScgKTtcblxuXHRcdGlmICggdmFsdWUgKSB7XG5cdFx0XHQkc2VsZWN0b3Iuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkc2VsZWN0b3IuaGlkZSgpO1xuXHRcdH1cblx0fVxuXG5cdGNvbnN0ICRlbmFibGVMb2FkaW5nT3ZlcmxheSA9ICQoICcjbG9hZGluZ19hbmltYXRpb24nICk7XG5cblx0bGV0IGVuYWJsZUxvYWRpbmdPdmVybGF5ID0gZmFsc2U7XG5cblx0aWYgKCAkZW5hYmxlTG9hZGluZ092ZXJsYXkuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRlbmFibGVMb2FkaW5nT3ZlcmxheSA9IHRydWU7XG5cdH1cblxuXHR0b2dnbGVMb2FkaW5nSW1hZ2UoIGVuYWJsZUxvYWRpbmdPdmVybGF5ICk7XG5cblx0JGVuYWJsZUxvYWRpbmdPdmVybGF5Lm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0bGV0IF9lbmFibGVMb2FkaW5nT3ZlcmxheSA9IGZhbHNlO1xuXG5cdFx0aWYgKCAkKCB0aGlzICkuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdF9lbmFibGVMb2FkaW5nT3ZlcmxheSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0dG9nZ2xlTG9hZGluZ0ltYWdlKCBfZW5hYmxlTG9hZGluZ092ZXJsYXkgKTtcblx0fSApO1xuXG5cdC8vIFRvZ2dsZSBwYWdpbmF0aW9uIGZpZWxkcy5cblx0ZnVuY3Rpb24gZW5hYmxlUGFnaW5hdGlvbiggdmFsdWUgKSB7XG5cdFx0Y29uc3QgJHNlbGVjdG9yID0gJCggJy5zZXR0aW5ncy10YWJsZS1wYWdpbmF0aW9uX2NvbnRhaW5lcicgKTtcblxuXHRcdGlmICggdmFsdWUgKSB7XG5cdFx0XHQkc2VsZWN0b3Iuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkc2VsZWN0b3IuaGlkZSgpO1xuXHRcdH1cblx0fVxuXG5cdGNvbnN0ICRlbmFibGVQYWdpbmF0aW9uID0gJCggJyNlbmFibGVfcGFnaW5hdGlvbl92aWFfYWpheCcgKTtcblxuXHRsZXQgZW5hYmxlUGFnaW5hdGlvbk9uTG9hZCA9IGZhbHNlO1xuXG5cdGlmICggJGVuYWJsZVBhZ2luYXRpb24uaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRlbmFibGVQYWdpbmF0aW9uT25Mb2FkID0gdHJ1ZTtcblx0fVxuXG5cdGVuYWJsZVBhZ2luYXRpb24oIGVuYWJsZVBhZ2luYXRpb25PbkxvYWQgKTtcblxuXHQkZW5hYmxlUGFnaW5hdGlvbi5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdGxldCBfZW5hYmxlUGFnaW5hdGlvbiA9IGZhbHNlO1xuXG5cdFx0aWYgKCAkKCB0aGlzICkuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdF9lbmFibGVQYWdpbmF0aW9uID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRlbmFibGVQYWdpbmF0aW9uKCBfZW5hYmxlUGFnaW5hdGlvbiApO1xuXHR9ICk7XG5cblx0Ly8gVG9nZ2xlIHNjcm9sbCB3aW5kb3cgZmllbGRzLlxuXHRmdW5jdGlvbiBzY3JvbGxXaW5kb3coIHZhbHVlICkge1xuXHRcdGNvbnN0IGRlcGVuZGVudEZpZWxkcyA9ICcuc2Nyb2xsLXdpbmRvdy1kZXBlbmRlbnQtZmllbGRzLCcgK1xuXHRcdFx0Jy5zY3JvbGwtd2luZG93LWN1c3RvbS1lbGVtZW50LWlucHV0LCcgK1xuXHRcdFx0Jy5zZXR0aW5ncy10YWJsZS1zY3JvbGxfdG9fdG9wX29mZnNldCc7XG5cblx0XHRpZiAoICdub25lJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHQkKCBkZXBlbmRlbnRGaWVsZHMgKS5oaWRlKCk7XG5cdFx0fSBlbHNlIGlmICggJ3Jlc3VsdHMnID09PSB2YWx1ZSApIHtcblx0XHRcdCQoICcuc2Nyb2xsLXdpbmRvdy1kZXBlbmRlbnQtZmllbGRzLCAuc2V0dGluZ3MtdGFibGUtc2Nyb2xsX3RvX3RvcF9vZmZzZXQnICkuc2hvdygpO1xuXHRcdFx0JCggJy5zY3JvbGwtd2luZG93LWN1c3RvbS1lbGVtZW50LWlucHV0JyApLmhpZGUoKTtcblx0XHR9IGVsc2UgaWYgKCAnY3VzdG9tJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHQkKCAnLnNjcm9sbC13aW5kb3ctZGVwZW5kZW50LWZpZWxkcywgLnNldHRpbmdzLXRhYmxlLXNjcm9sbF90b190b3Bfb2Zmc2V0JyApLnNob3coKTtcblx0XHRcdCQoICcuc2Nyb2xsLXdpbmRvdy1jdXN0b20tZWxlbWVudC1pbnB1dCcgKS5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCQoIGRlcGVuZGVudEZpZWxkcyApLnNob3coKTtcblx0XHR9XG5cdH1cblxuXHRjb25zdCAkc2Nyb2xsV2luZG93ID0gJCggJyNzY3JvbGxfd2luZG93JyApO1xuXG5cdHNjcm9sbFdpbmRvdyggJHNjcm9sbFdpbmRvdy52YWwoKSApO1xuXG5cdCRzY3JvbGxXaW5kb3cub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCB2YWx1ZSA9ICQoIHRoaXMgKS52YWwoKTtcblxuXHRcdHNjcm9sbFdpbmRvdyggdmFsdWUgKTtcblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIFRoZSBwcm9kdWN0IHN0YXR1cyBmaWVsZC5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIHdwdG9vbHMuaW9cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXG5cdGNvbnN0IHRhYmxlSWRlbnRpZmllciA9ICcucHJvZHVjdC1zdGF0dXMtb3B0aW9ucy10YWJsZSc7XG5cdGNvbnN0IHZhbHVlSWRlbnRpZmllciA9ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcHJvZHVjdF9zdGF0dXNfb3B0aW9ucyBpbnB1dCc7XG5cdGNvbnN0IHJvd1RlbXBsYXRlSWQgICA9ICd3Y2FwZi1wcm9kdWN0LXN0YXR1cy1vcHRpb24nO1xuXG5cdGluaXRNYW51YWxPcHRpb25zVGFibGUoIHRhYmxlSWRlbnRpZmllciwgdmFsdWVJZGVudGlmaWVyLCByb3dUZW1wbGF0ZUlkICk7XG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIHRvZ2dsZSB2aXNpYmlsaXR5IHNjcmlwdHMuXG4gKlxuICogTk9URTogVGhlc2Ugc2NyaXB0cyBtdXN0IGJlIGxvY2F0ZWQgYXQgdGhlIHZlcnkgYm90dG9tIG9mIHRoZSBjb21iaW5lZCBzY3JpcHRzLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgd3B0b29scy5pb1xuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgZmllbGRXcmFwcGVyID0gJCggJyNjaG9zZW5fZmllbGRfd3JhcHBlcicgKTtcblxuXHRjb25zdCBkZXBlbmRhbnREYXRhID0gW1xuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS10ZXh0LWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGV4dCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS1udW1iZXItZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdudW1iZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtZGF0ZS1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2RhdGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLnZhbHVlLWRlY2ltYWwtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdudW1iZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXF1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NoZWNrYm94JywgJ211bHRpLXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYWRpbycsICdzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3NlbGVjdCcsICdtdWx0aS1zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jYXRlZ29yeV9pbWFnZXMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2ltYWdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfbXVsdGlwbGVfZmlsdGVyJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdsYWJlbCcsICdjb2xvcicsICdpbWFnZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuY29sdW1uLWdyb3VwLWN1c3RvbV9hcHBlYXJhbmNlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjb2xvcicsICdpbWFnZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1oaWVyYXJjaGljYWwgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXZhbHVlX2RlY2ltYWwgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfZGVjaW1hbF9wbGFjZXMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWdldF9vcHRpb25zIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmNvbHVtbi1ncm91cC1tZXRhX2tleV9tYW51YWxfb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbWFudWFsX2VudHJ5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NsaWRlcl9kaXNwbGF5X3ZhbHVlc19hcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGlnbl92YWx1ZXNfYXRfdGhlX2VuZCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfcXVlcnlfdHlwZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zZWxlY3RfYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9lbmFibGVfbXVsdGlwbGVfZmlsdGVyJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3Nob3dfY291bnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcsICdyYW5nZV9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2hpZGVfZW1wdHknLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcsICdyYW5nZV9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLWRlY2ltYWwtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInLCAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JywgJ3JhbmdlX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfdXNlX2Nob3NlbiBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2dldF9vcHRpb25zIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1hdXRvbWF0aWMtb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnYXV0b21hdGljYWxseScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdtYW51YWxfZW50cnknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRhdGVfZGlzcGxheV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuZGF0ZS10by11aS1vcHRpb25zJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbnB1dF9kYXRlX3JhbmdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kYXRlX2Zvcm1hdCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5wdXRfZGF0ZScsICdpbnB1dF9kYXRlX3JhbmdlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1zaG93X2RhdGVfaW5wdXRzX2lubGluZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5wdXRfZGF0ZV9yYW5nZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuZGF0ZS1waWNrZXItZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbnB1dF9kYXRlJywgJ2lucHV0X2RhdGVfcmFuZ2UnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3F1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2NoZWNrYm94JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9zZWxlY3RfYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICd0aW1lX3BlcmlvZF9yYWRpbycsICd0aW1lX3BlcmlvZF9zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3VzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX3NlbGVjdCcsICd0aW1lX3BlcmlvZF9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfZW5hYmxlX211bHRpcGxlX2ZpbHRlcicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfbGFiZWwnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX3Nob3dfY291bnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RpbWVfcGVyaW9kX2NoZWNrYm94JywgJ3RpbWVfcGVyaW9kX3JhZGlvJywgJ3RpbWVfcGVyaW9kX3NlbGVjdCcsICd0aW1lX3BlcmlvZF9tdWx0aXNlbGVjdCcsICd0aW1lX3BlcmlvZF9sYWJlbCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdGltZV9wZXJpb2RfaGlkZV9lbXB0eScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGltZV9wZXJpb2RfY2hlY2tib3gnLCAndGltZV9wZXJpb2RfcmFkaW8nLCAndGltZV9wZXJpb2Rfc2VsZWN0JywgJ3RpbWVfcGVyaW9kX211bHRpc2VsZWN0JywgJ3RpbWVfcGVyaW9kX2xhYmVsJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF91c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9zb2Z0X2xpbWl0IGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNvZnRfbGltaXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRheG9ub215IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWN1c3RvbS10YXhvbm9teSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tZXRhX2tleSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1wb3N0X3Byb3BlcnR5IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWxpbWl0X29wdGlvbnMgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1wYXJlbnRfdGVybScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY2hpbGQnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWxpbWl0X3ZhbHVlc19ieV9pZCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5jbHVkZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZXhjbHVkZV92YWx1ZXNfaWQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2V4Y2x1ZGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9hY2NvcmRpb24gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWNjb3JkaW9uX2RlZmF1bHRfc3RhdGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9tdWx0aXBsZV9maWx0ZXIgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jYXRlZ29yeV9pbWFnZXMgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9lbmFibGVfbXVsdGlwbGVfZmlsdGVyIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC10aW1lX3BlcmlvZF9lbmFibGVfbXVsdGlwbGVfZmlsdGVyIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfY2xlYXJfYWxsX2J1dHRvbiBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5jbGVhci1hbGwtYnV0dG9uLWZpZWxkcy1zdGFydCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtc2hvd19pZl9lbXB0eSBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbXB0eV9maWx0ZXJfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtc2hvd190aXRsZSBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tb3ZlX2NsZWFyX2FsbF9idXR0b25faW5fdGl0bGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW9yZGVyX3Rlcm1zX2J5IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFjdGl2ZV9maWx0ZXJzX2xheW91dCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5zaW1wbGUtbGF5b3V0LXNvZnQtZmllbGRzLXN0YXJ0Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdzaW1wbGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmV4dGVuZGVkLWxheW91dC1zb2Z0LWZpZWxkcy1zdGFydCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnZXh0ZW5kZWQnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9zb2Z0X2xpbWl0X2Zvcl9leHRlbmRlZF9sYXlvdXQgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtc29mdF9saW1pdF9mb3JfZXh0ZW5kZWRfbGF5b3V0Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfdG9vbHRpcCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1zaG93X2NvdW50X2luX3Rvb2x0aXAnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRvb2x0aXBfcG9zaXRpb24nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdF07XG5cblx0ZnVuY3Rpb24gX2hhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgPSBjdXJyZW50U2VsZWN0b3IuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0IGhhbmRsZXIgICAgID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0Y29uc3QgaGFuZGxlclR5cGUgPSBkYXRhWyAnaGFuZGxlclR5cGUnIF07XG5cdFx0Y29uc3QgZGVwZW5kYW50ICAgPSBkYXRhWyAnZGVwZW5kYW50JyBdO1xuXG5cdFx0bGV0IF92YWx1ZSA9IHZhbHVlO1xuXG5cdFx0aWYgKCAnY2hlY2tib3gnID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9IGN1cnJlbnRTZWxlY3Rvci5pcyggJzpjaGVja2VkJyApID8gJzEnIDogJzAnO1xuXHRcdH1cblxuXHRcdGlmICggJ3JhZGlvJyA9PT0gaGFuZGxlclR5cGUgKSB7XG5cdFx0XHRfdmFsdWUgPSAkZmllbGQuZmluZCggaGFuZGxlciArICc6Y2hlY2tlZCcgKS52YWwoKTtcblx0XHR9XG5cblx0XHQkLmVhY2goIGRlcGVuZGFudCwgZnVuY3Rpb24oIGlkLCBkICkge1xuXHRcdFx0Y29uc3QgJHNlbGVjdG9yICAgPSAkZmllbGQuZmluZCggZFsgJ3NlbGVjdG9yJyBdICk7XG5cdFx0XHRjb25zdCB2YWxpZFZhbHVlcyA9IGRbICd2YWx1ZScgXTtcblxuXHRcdFx0aWYgKCB2YWxpZFZhbHVlcy5pbmNsdWRlcyggX3ZhbHVlICkgKSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc2VsZWN0b3IuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBbIGhhbmRsZXIsIF92YWx1ZSwgJGZpZWxkIF0gKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0aWYgKCBudWxsID09PSBjdXJyZW50U2VsZWN0b3IgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyICA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdFx0Y29uc3QgJGhhbmRsZXIgPSAkKCBoYW5kbGVyICk7XG5cblx0XHRcdCQuZWFjaCggJGhhbmRsZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IF92YWx1ZSA9IF90aGlzLnZhbCgpO1xuXHRcdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgX3RoaXMsIF92YWx1ZSApO1xuXHRcdFx0fSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNldHVwRmllbGQoIGluaXRhbCA9IGZhbHNlICkge1xuXHRcdCQuZWFjaCggZGVwZW5kYW50RGF0YSwgZnVuY3Rpb24oIGksIGRhdGEgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0XHRjb25zdCBldmVudCAgID0gZGF0YVsgJ2V2ZW50JyBdO1xuXG5cdFx0XHRoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBudWxsLCBudWxsICk7XG5cblx0XHRcdGlmICggaW5pdGFsICkge1xuXHRcdFx0XHRmaWVsZFdyYXBwZXIub24oIGV2ZW50LCBoYW5kbGVyLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0Y29uc3QgX3ZhbHVlID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHRcdGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIF90aGlzLCBfdmFsdWUgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGlmICggISAkKCBmaWVsZFdyYXBwZXIgKS5oYXNDbGFzcyggJ2xvYWRlZCcgKSApIHtcblx0XHRcdFx0XHQkKCBmaWVsZFdyYXBwZXIgKS5hZGRDbGFzcyggJ2xvYWRlZCcgKTtcblxuXHRcdFx0XHRcdGZpZWxkV3JhcHBlci50cmlnZ2VyKCAnZmllbGRfYWRkZWQnICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRzZXR1cEZpZWxkKCB0cnVlICk7XG5cblx0ZmllbGRXcmFwcGVyLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHQvLyBUb2dnbGUgdGhlIHZpc2liaWxpdHkgb2Ygc3ViZmllbGRzLlxuXHRcdHNldHVwRmllbGQoKTtcblx0fSApO1xuXG59ICk7XG4iXX0=
