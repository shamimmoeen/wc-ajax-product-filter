"use strict";

/**
 * The post meta field.
 *
 * @since      1.0.0
 * @package    wc-ajax-product-filter-pro
 * @subpackage wc-ajax-product-filter-pro/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function ($) {
  var $searchForm = $('#search-form');

  function initSortableForManualOptions($selector) {
    $selector.sortable({
      opacity: 0.8,
      revert: false,
      cursor: 'move',
      axis: 'y',
      handle: '.move-options-handler',
      placeholder: 'widget-placeholder',
      update: function update(e) {
        var $field = $(e.target).closest('.wcapf-form-field');
        triggerManualOptionsChange($field);
      }
    }).disableSelection();
  } // Sort Manual Options


  initSortableForManualOptions($searchForm.find('.manual-options-table-body-rows'));
  $searchForm.on('field_added', function (e, ui) {
    // Init Sortable for the manual options.
    initSortableForManualOptions($(ui.item.find('.manual-options-table-body-rows')));
  });

  function triggerRemoveOption($field) {
    var $optionsTable = $field.find('.manual-options-table');
    var tableRows = $optionsTable.find('.manual-options-table-body-rows').children();

    if (2 > tableRows.length) {
      $optionsTable.removeClass('has-options');
    }
  } // Remove Single Option


  $searchForm.on('click', '.remove-option', function () {
    var $item = $(this).closest('.item');
    var $field = $item.closest('.wcapf-form-field');
    triggerRemoveOption($field);
    $item.remove();
    triggerManualOptionsChange($field);
  }); // Clear All Options

  $searchForm.on('click', '.clear-all-options', function () {
    var $field = $(this).closest('.wcapf-form-field');
    var $optionsTable = $field.find('.manual-options-table');
    $optionsTable.find('.manual-options-table-body-rows').empty();
    triggerRemoveOption($field);
    triggerManualOptionsChange($field);
  }); // Add New Option

  $searchForm.on('click', '.add-option', function () {
    var fieldType = 'wcapf-post-meta-option'; // Bail out if no tmpl found for the type.

    if (!jQuery('#tmpl-' + fieldType).length) {
      return;
    }

    var $field = $(this).closest('.wcapf-form-field');
    var template = wp.template(fieldType);
    var rendered = template({
      value: '',
      label: ''
    });
    var $wrapper = $field.find('.manual-options-table');
    var $rows = $wrapper.find('.manual-options-table-body-rows');
    $rows.append(rendered);

    if (!$wrapper.hasClass('has-options')) {
      $wrapper.addClass('has-options');
    }
  });
  var $postMetaOptionsModal = $('.post-meta-options-modal');
  var $noKeyFoundMessage = $postMetaOptionsModal.find('.no-key-found-message');
  var $postMetaModalLoader = $postMetaOptionsModal.find('.post-meta-options-loader');
  var $postMetaOptions = $postMetaOptionsModal.find('.post-meta-options');
  var $postMetaModalFooter = $postMetaOptionsModal.find('.wcapf-modal-footer');
  var postMetaOptionsModalInstance = $postMetaOptionsModal.remodal({
    hashTracking: false
  });
  var $postMetaField = null;

  function resetPostMetaModal() {
    $postMetaOptions.html('');
    $postMetaModalLoader.removeClass('active');
    $noKeyFoundMessage.removeClass('active');
    $postMetaModalFooter.removeClass('active');
    $postMetaOptionsModal.find('.replace-current-options').prop('checked', false);
  } // Browse Values


  $searchForm.on('click', '.browse-values', function () {
    resetPostMetaModal();
    var $field = $(this).closest('.wcapf-form-field');
    var $inputMetaKey = $field.find('.wcapf-form-sub-field-meta_key select');
    var metaKey = $inputMetaKey.val();

    if (!metaKey) {
      $noKeyFoundMessage.addClass('active');
    } else {
      $noKeyFoundMessage.removeClass('active');
    }

    postMetaOptionsModalInstance.open();
    $postMetaField = $field;

    if (!metaKey) {
      return;
    } // Show the loading animation.


    $postMetaModalLoader.addClass('active');
    /**
     * Ajax's success function.
     *
     * @param response
     */

    function okCallback(response) {
      // Hide the loading animation.
      $postMetaModalLoader.removeClass('active');
      $postMetaModalFooter.addClass('active');
      $postMetaOptions.html(response);
    }
    /**
     * Ajax's error function.
     *
     * @param message
     */


    function errCallback(message) {
      console.log('error', message); // Hide the loading animation.

      $postMetaModalLoader.removeClass('active');
    }

    var formData = {
      key: metaKey,
      action: 'wcapf_get_meta_options'
    }; // https://stackoverflow.com/a/59181252

    wp.ajax.post(formData).done(okCallback).fail(errCallback);
  });
  /**
   * Reset the post meta option's modal when modal gets closed.
   */

  $(document).on('closed', $postMetaOptionsModal, function () {
    resetPostMetaModal();
    $postMetaField = null;
  }); // Unselect all values.

  $postMetaOptionsModal.on('click', '.select-none', function () {
    $postMetaOptions.find('[type="checkbox"]').prop('checked', false);
  }); // Select all values.

  $postMetaOptionsModal.on('click', '.select-all', function () {
    $postMetaOptions.find('[type="checkbox"]').prop('checked', true);
  });

  function triggerManualOptionsChange($postMetaField) {
    var $valueHolder = $postMetaField.find('.wcapf-form-sub-field-manual_options input');
    var $optionsTable = $postMetaField.find('.manual-options-table');
    var $rows = $optionsTable.find('.manual-options-table-body-rows');
    var _rows = [];
    $rows.find('.item').each(function (i, _item) {
      var $item = $(_item);
      var value = $item.find('.option_value').val();
      var label = $item.find('.option_label').val();

      if (value && label) {
        _rows.push([value, label]);
      }
    });
    var rawValues = encodeURIComponent(JSON.stringify(_rows));
    $valueHolder.val(rawValues);
  } // Add selected options.


  $postMetaOptionsModal.on('click', '.add-options', function () {
    var $options = $postMetaOptions.find('[type="checkbox"]');
    var isReplace = false;
    var rows = '';

    if ($postMetaModalFooter.find('.replace-current-options').is(':checked')) {
      isReplace = true;
    }

    if ($options) {
      var fieldType = 'wcapf-post-meta-option';
      $.each($options, function (i, input) {
        var $input = $(input);
        var value = $input.val();

        if ($input.is(':checked')) {
          var template = wp.template(fieldType);
          var rendered = template({
            value: value,
            label: value
          });
          rows += rendered;
        }
      });
    }

    if (rows) {
      var $wrapper = $postMetaField.find('.manual-options-table');
      var $rows = $wrapper.find('.manual-options-table-body-rows');

      if (isReplace) {
        $rows.html(rows);
      } else {
        $rows.append(rows);
      }

      if (!$wrapper.hasClass('has-options')) {
        $wrapper.addClass('has-options');
      }

      triggerManualOptionsChange($postMetaField);
    }

    postMetaOptionsModalInstance.close();
  });
  $searchForm.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-get_options input' === handler) {
      var $selectElm = $field.find('.wcapf-form-sub-field-options_order_by select');
      var orderBy = $selectElm.val();
      var dependantOptions = 'option[value="label"]';

      if ('automatically' === value) {
        $selectElm.children(dependantOptions).attr('disabled', 'disabled');

        if ('label' === orderBy) {
          $selectElm.prop('selectedIndex', 1).change();
        }
      } else {
        $selectElm.children(dependantOptions).removeAttr('disabled');
      }
    }
  });
  $searchForm.on('input', '.manual-options-table input[type="text"]', function () {
    var $field = $(this).closest('.wcapf-form-field');
    triggerManualOptionsChange($field);
  });
  /**
   * Value type 'Number'
   */

  function triggerRemoveNumberOption($field) {
    var $optionsTable = $field.find('.number-manual-options-table');
    var tableRows = $optionsTable.find('.manual-options-table-body-rows').children();

    if (2 > tableRows.length) {
      $optionsTable.removeClass('has-options');
    }
  }

  function triggerNumberManualOptionsChange($postMetaField) {
    var $valueHolder = $postMetaField.find('.wcapf-form-sub-field-number_manual_options input');
    var $optionsTable = $postMetaField.find('.number-manual-options-table');
    var $rows = $optionsTable.find('.manual-options-table-body-rows');
    var _rows = [];
    $rows.find('.item').each(function (i, _item) {
      var $item = $(_item);
      var min_value = $item.find('.option_min_value').val();
      var max_value = $item.find('.option_max_value').val();
      var label = $item.find('.option_label').val();

      if (min_value && max_value && label) {
        _rows.push([min_value, max_value, label]);
      }
    });
    var rawValues = encodeURIComponent(JSON.stringify(_rows));
    $valueHolder.val(rawValues);
  } // Remove Single Number Option


  $searchForm.on('click', '.remove-number-option', function () {
    var $item = $(this).closest('.item');
    var $field = $item.closest('.wcapf-form-field');
    triggerRemoveNumberOption($field);
    $item.remove();
    triggerNumberManualOptionsChange($field);
  }); // Clear All Options

  $searchForm.on('click', '.clear-all-number-options', function () {
    var $field = $(this).closest('.wcapf-form-field');
    var $optionsTable = $field.find('.number-manual-options-table');
    $optionsTable.find('.manual-options-table-body-rows').empty();
    triggerRemoveNumberOption($field);
    triggerNumberManualOptionsChange($field);
  }); // Add New Option

  $searchForm.on('click', '.add-number-option', function () {
    var fieldType = 'wcapf-post-meta-type-number-option'; // Bail out if no tmpl found for the type.

    if (!jQuery('#tmpl-' + fieldType).length) {
      return;
    }

    var $field = $(this).closest('.wcapf-form-field');
    var template = wp.template(fieldType);
    var rendered = template({
      value: '',
      label: ''
    });
    var $wrapper = $field.find('.number-manual-options-table');
    var $rows = $wrapper.find('.manual-options-table-body-rows');
    $rows.append(rendered);

    if (!$wrapper.hasClass('has-options')) {
      $wrapper.addClass('has-options');
    }
  });
  $searchForm.on('input', '.number-manual-options-table input[type="text"]', function () {
    var $field = $(this).closest('.wcapf-form-field');
    triggerNumberManualOptionsChange($field);
  });
  $searchForm.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-number_display_type select' === handler) {
      var $getOptions = $field.find('.wcapf-form-sub-field-number_get_options');
      var $autoOptions = $field.find('.number-automatic-options');
      var $manualOptions = $field.find('.number-manual-options-table');
      var $elm = $field.find(handler);
      var displayType = $elm.val();

      if ('range_slider' === displayType || 'range_number' === displayType) {
        $getOptions.hide();
        $manualOptions.addClass('force-hide');
        $autoOptions.addClass('force-show');
      } else {
        $getOptions.show();
        $manualOptions.removeClass('force-hide');
        $autoOptions.removeClass('force-show');
      }
    }
  });
  $searchForm.on('click', '.wcapf-form-sub-field-min_value_auto_detect input[type="checkbox"]', function () {
    var $this = $(this);
    var $field = $this.closest('.wcapf-form-field');
    var $textField = $field.find('.wcapf-form-sub-field-min_value input[type="text"]');

    if ($this.is(':checked')) {
      $textField.attr('disabled', 'disabled');
    } else {
      $textField.removeAttr('disabled');
    }
  });
  $searchForm.on('click', '.wcapf-form-sub-field-max_value_auto_detect input[type="checkbox"]', function () {
    var $this = $(this);
    var $field = $this.closest('.wcapf-form-field');
    var $textField = $field.find('.wcapf-form-sub-field-max_value input[type="text"]');

    if ($this.is(':checked')) {
      $textField.attr('disabled', 'disabled');
    } else {
      $textField.removeAttr('disabled');
    }
  });
});
"use strict";

/**
 * The search form field.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function ($) {
  var $searchForm = $('#search-form');
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
    'handler': '.wcapf-form-sub-field-get_options input',
    'handlerType': 'radio',
    'event': 'change',
    'dependant': [{
      'selector': '.manual-options-table',
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
      'selector': '.number-decimal-fields',
      'value': ['range_slider', 'range_checkbox', 'range_radio', 'range_select', 'range_multiselect']
    }, {
      'selector': '.wcapf-form-sub-field-number_range_checkbox_query_type',
      'value': ['range_checkbox', 'range_multiselect']
    }, {
      'selector': '.wcapf-form-sub-field-number_range_select_all_items_label',
      'value': ['range_radio', 'range_select']
    }, {
      'selector': '.wcapf-form-sub-field-number_range_use_chosen',
      'value': ['range_select', 'range_multiselect']
    }, {
      'selector': '.number_range_col2_sub_fields',
      'value': ['range_checkbox', 'range_radio', 'range_select', 'range_multiselect']
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
  }];

  function _triggerInputTypeTextDisplayTypeChange(value, $field) {
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

  function _triggerInputTypeNumberDisplayTypeChange(value, $field) {
    var $noResults = $field.find('.wcapf-form-sub-field-number_range_chosen_no_results_message');
    var $allItemsLabel = $field.find('.wcapf-form-sub-field-number_range_select_all_items_label');
    var useChosen = $field.find('.wcapf-form-sub-field-number_range_use_chosen input').is(':checked');

    if (useChosen && ('range_select' === value || 'range_multiselect' === value)) {
      $noResults.show();
    } else {
      $noResults.hide();
    }

    if ('range_radio' === value || 'range_select' === value || 'range_multiselect' === value && useChosen) {
      $allItemsLabel.show();
    } else {
      $allItemsLabel.hide();
    }
  }

  function _triggerInputTypeTextUseSelectChange(value, $field) {
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

  function _triggerInputTypeNumberUseSelectChange(value, $field) {
    var $noResults = $field.find('.wcapf-form-sub-field-number_range_chosen_no_results_message');
    var $allItemsLabel = $field.find('.wcapf-form-sub-field-number_range_select_all_items_label');
    var displayType = $field.find('.wcapf-form-sub-field-number_display_type select').val();

    if ('1' === value && ('range_select' === displayType || 'range_multiselect' === displayType)) {
      $noResults.show();
    } else {
      $noResults.hide();
    }

    if ('1' === value && 'range_multiselect' === displayType || 'range_radio' === displayType || 'range_select' === displayType) {
      $allItemsLabel.show();
    } else {
      $allItemsLabel.hide();
    }
  }

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

    if ('.wcapf-form-sub-field-display_type select' === handler) {
      _triggerInputTypeTextDisplayTypeChange(_value, $field);
    }

    if ('.wcapf-form-sub-field-use_chosen input' === handler) {
      _triggerInputTypeTextUseSelectChange(_value, $field);
    }

    if ('.wcapf-form-sub-field-number_display_type select' === handler) {
      _triggerInputTypeNumberDisplayTypeChange(_value, $field);
    }

    if ('.wcapf-form-sub-field-number_range_use_chosen input' === handler) {
      _triggerInputTypeNumberUseSelectChange(_value, $field);
    }

    $searchForm.trigger('after_toggle_request', [handler, _value, $field]);
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

  function setupSearchForm() {
    var inital = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    $.each(dependantData, function (i, data) {
      var handler = data['handler'];
      var event = data['event'];
      handleToggleRequest(data, null, null);

      if (inital) {
        $searchForm.on(event, handler, function () {
          var _this = $(this);

          var _value = $(this).val();

          handleToggleRequest(data, _this, _value);
        });
      }
    });
  }

  setupSearchForm(true);
  $searchForm.on('field_added', function () {
    // Toggle the visibility of subfields.
    setupSearchForm();
  });
});
"use strict";

/**
 * The search form.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
var totalFieldInstances = jQuery('#total_field_instances');
var searchForm = jQuery('#search-form');
/**
 * Assign a unique id by replacing the placeholder id.
 */

function removePlaceholder(uniqueId, elements, attr) {
  elements.each(function () {
    var element = jQuery(this);
    var oldValue = element.attr(attr);
    var newValue = oldValue.replace('%%', uniqueId);
    element.attr(attr, newValue);
  });
}
/**
 * Insert the field's subfields.
 */


function insertFieldSubFields(ui) {
  // Insert the field's subfields if not already inserted.
  if (!ui.item.hasClass('sub-fields-ready')) {
    var type = ui.item.attr('data-field-type');
    var uniqueId = parseInt(totalFieldInstances.val());
    var fieldType = 'wcapf-form-field-' + type; // Bail out if no tmpl found for the type.

    if (!jQuery('#tmpl-' + fieldType).length) {
      return;
    } // Increment the value of total field instances.


    totalFieldInstances.val(uniqueId + 1);
    var template = wp.template(fieldType);
    var rendered = template();
    var wrapper = ui.item.find('.widget-content');
    wrapper.prepend(rendered); // Update the for attributes of the labels.

    removePlaceholder(uniqueId, ui.item.find('label[for^="wcapf-input-"]'), 'for'); // Update the ids of the input elements.

    removePlaceholder(uniqueId, ui.item.find('*[id^="wcapf-input-"]'), 'id'); // Update the names of the input elements.

    removePlaceholder(uniqueId, ui.item.find('*[id^="wcapf-input-"]'), 'name'); // Update the position value.

    removePlaceholder(uniqueId, ui.item.find('*[id^="wcapf-input-position-"]'), 'value');
    ui.item.addClass('sub-fields-ready');
    searchForm.trigger('field_added', [ui]);
  }
}
/**
 * Update the form field's position after sort.
 *
 * @source https://stackoverflow.com/a/14736775
 */


function updateFieldsPosition() {
  var inputs = searchForm.find('*[id^="wcapf-input-position-"]');
  var nbElems = inputs.length;
  inputs.each(function (idx) {
    jQuery(this).val(nbElems - (nbElems - idx));
  });
}
/**
 * Make the field ready, remove styles comes from jquery-ui-sortable plugin, insert the field's subfields etc.
 */


function makeFieldReady(e, ui) {
  // Remove styles comes from jquery-ui-sortable plugin.
  ui.item.removeAttr('style');
  insertFieldSubFields(ui);
  updateFieldsPosition();
  var toggleBtn = ui.item.find('.widget-action'); // Expand the form field after sort.

  if ('false' === toggleBtn.attr('aria-expanded')) {
    toggleBtn.trigger('click');
  }
}
/**
 * Instantiate sortable for the form fields.
 */


function sortable(identifier) {
  var container = jQuery(identifier);
  container.sortable({
    opacity: 0.8,
    revert: false,
    cursor: 'move',
    axis: 'y',
    handle: '.widget-top',
    cancel: '.widget-title-action',
    items: '.widget',
    placeholder: 'widget-placeholder',
    connectWith: '#search-form-wrapper',
    stop: makeFieldReady,
    start: function start(e, ui) {
      // If it is getting appended to the wrong place, then force it into the right container.
      ui.placeholder.appendTo(ui.placeholder.parent().find('.inside #search-form-wrapper'));
    }
  });
}

sortable('#search-form');
/**
 * Run function when drag starts.
 */

function onDragStart() {
  searchForm.addClass('ui-drop-active');
}
/**
 * Run function at drag stop.
 */


function onDragStop() {
  searchForm.removeClass('ui-drop-active');
}
/**
 * Initialize draggable for the form fields.
 */


jQuery('#available-fields .widget').draggable({
  connectToSortable: '#search-form',
  helper: 'clone',
  start: onDragStart,
  stop: onDragStop
});
/**
 * Toggle the form field.
 */

function toggleField(e) {
  var target = e.target;
  var widget = jQuery(this).closest('.widget');
  var toggleBtn = widget.find('.widget-action');
  var inside = widget.children('.widget-inside');
  var isExpand = toggleBtn.attr('aria-expanded');
  var toggleExpand = 'true' === isExpand ? 'false' : 'true';
  toggleBtn.attr('aria-expanded', toggleExpand);
  jQuery(inside).slideToggle('fast', function () {
    widget.toggleClass('open');
    searchForm.trigger('widget-closed', [target]);
  });
}

searchForm.on('click', '.widget-top', toggleField);
searchForm.on('click', '.widget-control-close', toggleField);
/**
 * Focus the form field's expand button.
 */

function focusField(e, target) {
  if (target.classList.contains('widget-control-close')) {
    var widget = jQuery(target).closest('.widget');
    var action = widget.find('.widget-action');
    action.attr('aria-expanded', 'false').focus();
  }
}

searchForm.on('widget-closed', focusField);
/**
 * Remove the field.
 */

function removeField() {
  var widget = jQuery(this).closest('.widget');
  jQuery(widget).slideUp('fast', function () {
    widget.remove();
    updateFieldsPosition();
  });
}

searchForm.on('click', '.widget-control-remove', removeField);
/**
 * Store the initial form data into a variable so that we can compare it when leaving the page.
 */

var initialFormState = searchForm.serializeArray();
/**
 * Show message after form submission.
 */

function showMessage(message) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'success';
  var element = jQuery('<p class="' + type + '">' + message + '</p>');
  var wrapper = jQuery('.wcapf-message-wrapper');

  if (!wrapper.is(':empty')) {
    return;
  }

  jQuery(wrapper).html(element).slideDown('fast');
  setTimeout(function () {
    jQuery(wrapper).slideUp('fast');
    wrapper.html('');
  }, 3000);
}
/**
 * Save the search form.
 */


function saveForm() {
  var button = jQuery(this);
  var formData = searchForm.serializeArray();
  button.attr('disabled', 'disabled');

  function okCallback(message) {
    button.removeAttr('disabled'); // Update the initial form data after successfully saving the form.

    initialFormState = formData;
    showMessage(message);
  }

  function errCallback(message) {
    button.removeAttr('disabled');
    showMessage(message, 'error');
  } // https://stackoverflow.com/a/59181252


  wp.ajax.post(formData).done(okCallback).fail(errCallback);
}

jQuery('#postbox-container-1').on('click', 'button', saveForm);
/**
 * Show alert on leave if the form is dirty.
 *
 * TODO: Uncomment this.
 */
// window.onbeforeunload = function() {
// 	const newFormState = searchForm.serializeArray();
//
// 	const isFormDirty = ! _.isEqual( newFormState, initialFormState );
//
// 	if ( isFormDirty ) {
// 		return '';
// 	}
// };
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBvc3QtbWV0YS1vcHRpb25zLmpzIiwic2VhcmNoLWZvcm0tZmllbGQuanMiLCJzZWFyY2gtZm9ybS5qcyJdLCJuYW1lcyI6WyJqUXVlcnkiLCJkb2N1bWVudCIsInJlYWR5IiwiJCIsIiRzZWFyY2hGb3JtIiwiaW5pdFNvcnRhYmxlRm9yTWFudWFsT3B0aW9ucyIsIiRzZWxlY3RvciIsInNvcnRhYmxlIiwib3BhY2l0eSIsInJldmVydCIsImN1cnNvciIsImF4aXMiLCJoYW5kbGUiLCJwbGFjZWhvbGRlciIsInVwZGF0ZSIsImUiLCIkZmllbGQiLCJ0YXJnZXQiLCJjbG9zZXN0IiwidHJpZ2dlck1hbnVhbE9wdGlvbnNDaGFuZ2UiLCJkaXNhYmxlU2VsZWN0aW9uIiwiZmluZCIsIm9uIiwidWkiLCJpdGVtIiwidHJpZ2dlclJlbW92ZU9wdGlvbiIsIiRvcHRpb25zVGFibGUiLCJ0YWJsZVJvd3MiLCJjaGlsZHJlbiIsImxlbmd0aCIsInJlbW92ZUNsYXNzIiwiJGl0ZW0iLCJyZW1vdmUiLCJlbXB0eSIsImZpZWxkVHlwZSIsInRlbXBsYXRlIiwid3AiLCJyZW5kZXJlZCIsInZhbHVlIiwibGFiZWwiLCIkd3JhcHBlciIsIiRyb3dzIiwiYXBwZW5kIiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsIiRwb3N0TWV0YU9wdGlvbnNNb2RhbCIsIiRub0tleUZvdW5kTWVzc2FnZSIsIiRwb3N0TWV0YU1vZGFsTG9hZGVyIiwiJHBvc3RNZXRhT3B0aW9ucyIsIiRwb3N0TWV0YU1vZGFsRm9vdGVyIiwicG9zdE1ldGFPcHRpb25zTW9kYWxJbnN0YW5jZSIsInJlbW9kYWwiLCJoYXNoVHJhY2tpbmciLCIkcG9zdE1ldGFGaWVsZCIsInJlc2V0UG9zdE1ldGFNb2RhbCIsImh0bWwiLCJwcm9wIiwiJGlucHV0TWV0YUtleSIsIm1ldGFLZXkiLCJ2YWwiLCJvcGVuIiwib2tDYWxsYmFjayIsInJlc3BvbnNlIiwiZXJyQ2FsbGJhY2siLCJtZXNzYWdlIiwiY29uc29sZSIsImxvZyIsImZvcm1EYXRhIiwia2V5IiwiYWN0aW9uIiwiYWpheCIsInBvc3QiLCJkb25lIiwiZmFpbCIsIiR2YWx1ZUhvbGRlciIsIl9yb3dzIiwiZWFjaCIsImkiLCJfaXRlbSIsInB1c2giLCJyYXdWYWx1ZXMiLCJlbmNvZGVVUklDb21wb25lbnQiLCJKU09OIiwic3RyaW5naWZ5IiwiJG9wdGlvbnMiLCJpc1JlcGxhY2UiLCJyb3dzIiwiaXMiLCJpbnB1dCIsIiRpbnB1dCIsImNsb3NlIiwiaGFuZGxlciIsIiRzZWxlY3RFbG0iLCJvcmRlckJ5IiwiZGVwZW5kYW50T3B0aW9ucyIsImF0dHIiLCJjaGFuZ2UiLCJyZW1vdmVBdHRyIiwidHJpZ2dlclJlbW92ZU51bWJlck9wdGlvbiIsInRyaWdnZXJOdW1iZXJNYW51YWxPcHRpb25zQ2hhbmdlIiwibWluX3ZhbHVlIiwibWF4X3ZhbHVlIiwiJGdldE9wdGlvbnMiLCIkYXV0b09wdGlvbnMiLCIkbWFudWFsT3B0aW9ucyIsIiRlbG0iLCJkaXNwbGF5VHlwZSIsImhpZGUiLCJzaG93IiwiJHRoaXMiLCIkdGV4dEZpZWxkIiwiZGVwZW5kYW50RGF0YSIsIl90cmlnZ2VySW5wdXRUeXBlVGV4dERpc3BsYXlUeXBlQ2hhbmdlIiwiJG5vUmVzdWx0cyIsIiRhbGxJdGVtc0xhYmVsIiwidXNlQ2hvc2VuIiwiX3RyaWdnZXJJbnB1dFR5cGVOdW1iZXJEaXNwbGF5VHlwZUNoYW5nZSIsIl90cmlnZ2VySW5wdXRUeXBlVGV4dFVzZVNlbGVjdENoYW5nZSIsIl90cmlnZ2VySW5wdXRUeXBlTnVtYmVyVXNlU2VsZWN0Q2hhbmdlIiwiX2hhbmRsZVRvZ2dsZVJlcXVlc3QiLCJkYXRhIiwiY3VycmVudFNlbGVjdG9yIiwiaGFuZGxlclR5cGUiLCJkZXBlbmRhbnQiLCJfdmFsdWUiLCJpZCIsImQiLCJ2YWxpZFZhbHVlcyIsImluY2x1ZGVzIiwidHJpZ2dlciIsImhhbmRsZVRvZ2dsZVJlcXVlc3QiLCIkaGFuZGxlciIsIl90aGlzIiwic2V0dXBTZWFyY2hGb3JtIiwiaW5pdGFsIiwiZXZlbnQiLCJ0b3RhbEZpZWxkSW5zdGFuY2VzIiwic2VhcmNoRm9ybSIsInJlbW92ZVBsYWNlaG9sZGVyIiwidW5pcXVlSWQiLCJlbGVtZW50cyIsImVsZW1lbnQiLCJvbGRWYWx1ZSIsIm5ld1ZhbHVlIiwicmVwbGFjZSIsImluc2VydEZpZWxkU3ViRmllbGRzIiwidHlwZSIsInBhcnNlSW50Iiwid3JhcHBlciIsInByZXBlbmQiLCJ1cGRhdGVGaWVsZHNQb3NpdGlvbiIsImlucHV0cyIsIm5iRWxlbXMiLCJpZHgiLCJtYWtlRmllbGRSZWFkeSIsInRvZ2dsZUJ0biIsImlkZW50aWZpZXIiLCJjb250YWluZXIiLCJjYW5jZWwiLCJpdGVtcyIsImNvbm5lY3RXaXRoIiwic3RvcCIsInN0YXJ0IiwiYXBwZW5kVG8iLCJwYXJlbnQiLCJvbkRyYWdTdGFydCIsIm9uRHJhZ1N0b3AiLCJkcmFnZ2FibGUiLCJjb25uZWN0VG9Tb3J0YWJsZSIsImhlbHBlciIsInRvZ2dsZUZpZWxkIiwid2lkZ2V0IiwiaW5zaWRlIiwiaXNFeHBhbmQiLCJ0b2dnbGVFeHBhbmQiLCJzbGlkZVRvZ2dsZSIsInRvZ2dsZUNsYXNzIiwiZm9jdXNGaWVsZCIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiZm9jdXMiLCJyZW1vdmVGaWVsZCIsInNsaWRlVXAiLCJpbml0aWFsRm9ybVN0YXRlIiwic2VyaWFsaXplQXJyYXkiLCJzaG93TWVzc2FnZSIsInNsaWRlRG93biIsInNldFRpbWVvdXQiLCJzYXZlRm9ybSIsImJ1dHRvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLE1BQU0sQ0FBRUMsUUFBRixDQUFOLENBQW1CQyxLQUFuQixDQUEwQixVQUFVQyxDQUFWLEVBQWM7QUFFdkMsTUFBTUMsV0FBVyxHQUFHRCxDQUFDLENBQUUsY0FBRixDQUFyQjs7QUFFQSxXQUFTRSw0QkFBVCxDQUF1Q0MsU0FBdkMsRUFBbUQ7QUFDbERBLElBQUFBLFNBQVMsQ0FBQ0Ms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dWN0LWZpbHRlci1hZG1pbi1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgcG9zdCBtZXRhIGZpZWxkLlxuICpcbiAqIEBzaW5jZSAgICAgIDEuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLXByb1xuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci1wcm8vYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0ICRzZWFyY2hGb3JtID0gJCggJyNzZWFyY2gtZm9ybScgKTtcblxuXHRmdW5jdGlvbiBpbml0U29ydGFibGVGb3JNYW51YWxPcHRpb25zKCAkc2VsZWN0b3IgKSB7XG5cdFx0JHNlbGVjdG9yLnNvcnRhYmxlKCB7XG5cdFx0XHRvcGFjaXR5OiAwLjgsXG5cdFx0XHRyZXZlcnQ6IGZhbHNlLFxuXHRcdFx0Y3Vyc29yOiAnbW92ZScsXG5cdFx0XHRheGlzOiAneScsXG5cdFx0XHRoYW5kbGU6ICcubW92ZS1vcHRpb25zLWhhbmRsZXInLFxuXHRcdFx0cGxhY2Vob2xkZXI6ICd3aWRnZXQtcGxhY2Vob2xkZXInLFxuXHRcdFx0dXBkYXRlOiBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkID0gJCggZS50YXJnZXQgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRcdFx0dHJpZ2dlck1hbnVhbE9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHRcdFx0fVxuXHRcdH0gKS5kaXNhYmxlU2VsZWN0aW9uKCk7XG5cdH1cblxuXHQvLyBTb3J0IE1hbnVhbCBPcHRpb25zXG5cdGluaXRTb3J0YWJsZUZvck1hbnVhbE9wdGlvbnMoICRzZWFyY2hGb3JtLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCBlLCB1aSApIHtcblx0XHQvLyBJbml0IFNvcnRhYmxlIGZvciB0aGUgbWFudWFsIG9wdGlvbnMuXG5cdFx0aW5pdFNvcnRhYmxlRm9yTWFudWFsT3B0aW9ucyggJCggdWkuaXRlbS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKSApICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0IHRhYmxlUm93cyAgICAgPSAkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApLmNoaWxkcmVuKCk7XG5cblx0XHRpZiAoIDIgPiB0YWJsZVJvd3MubGVuZ3RoICkge1xuXHRcdFx0JG9wdGlvbnNUYWJsZS5yZW1vdmVDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJlbW92ZSBTaW5nbGUgT3B0aW9uXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLnJlbW92ZS1vcHRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkaXRlbSAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5pdGVtJyApO1xuXHRcdGNvbnN0ICRmaWVsZCA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApO1xuXG5cdFx0JGl0ZW0ucmVtb3ZlKCk7XG5cblx0XHR0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBDbGVhciBBbGwgT3B0aW9uc1xuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5jbGVhci1hbGwtb3B0aW9ucycsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblxuXHRcdCRvcHRpb25zVGFibGUuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkuZW1wdHkoKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApO1xuXG5cdFx0dHJpZ2dlck1hbnVhbE9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQWRkIE5ldyBPcHRpb25cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcuYWRkLW9wdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1wb3N0LW1ldGEtb3B0aW9uJztcblxuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgZmllbGRUeXBlICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCB7IHZhbHVlOiAnJywgbGFiZWw6ICcnIH0gKTtcblx0XHRjb25zdCAkd3JhcHBlciA9ICRmaWVsZC5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0ICRyb3dzICAgID0gJHdyYXBwZXIuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICk7XG5cblx0XHQkcm93cy5hcHBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHRpZiAoICEgJHdyYXBwZXIuaGFzQ2xhc3MoICdoYXMtb3B0aW9ucycgKSApIHtcblx0XHRcdCR3cmFwcGVyLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0Y29uc3QgJHBvc3RNZXRhT3B0aW9uc01vZGFsID0gJCggJy5wb3N0LW1ldGEtb3B0aW9ucy1tb2RhbCcgKTtcblx0Y29uc3QgJG5vS2V5Rm91bmRNZXNzYWdlICAgID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLmZpbmQoICcubm8ta2V5LWZvdW5kLW1lc3NhZ2UnICk7XG5cdGNvbnN0ICRwb3N0TWV0YU1vZGFsTG9hZGVyICA9ICRwb3N0TWV0YU9wdGlvbnNNb2RhbC5maW5kKCAnLnBvc3QtbWV0YS1vcHRpb25zLWxvYWRlcicgKTtcblx0Y29uc3QgJHBvc3RNZXRhT3B0aW9ucyAgICAgID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLmZpbmQoICcucG9zdC1tZXRhLW9wdGlvbnMnICk7XG5cdGNvbnN0ICRwb3N0TWV0YU1vZGFsRm9vdGVyICA9ICRwb3N0TWV0YU9wdGlvbnNNb2RhbC5maW5kKCAnLndjYXBmLW1vZGFsLWZvb3RlcicgKTtcblxuXHRjb25zdCBwb3N0TWV0YU9wdGlvbnNNb2RhbEluc3RhbmNlID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLnJlbW9kYWwoIHtcblx0XHRoYXNoVHJhY2tpbmc6IGZhbHNlLFxuXHR9ICk7XG5cblx0bGV0ICRwb3N0TWV0YUZpZWxkID0gbnVsbDtcblxuXHRmdW5jdGlvbiByZXNldFBvc3RNZXRhTW9kYWwoKSB7XG5cdFx0JHBvc3RNZXRhT3B0aW9ucy5odG1sKCAnJyApO1xuXHRcdCRwb3N0TWV0YU1vZGFsTG9hZGVyLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdCRub0tleUZvdW5kTWVzc2FnZS5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHQkcG9zdE1ldGFNb2RhbEZvb3Rlci5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHQkcG9zdE1ldGFPcHRpb25zTW9kYWwuZmluZCggJy5yZXBsYWNlLWN1cnJlbnQtb3B0aW9ucycgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdH1cblxuXHQvLyBCcm93c2UgVmFsdWVzXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmJyb3dzZS12YWx1ZXMnLCBmdW5jdGlvbigpIHtcblx0XHRyZXNldFBvc3RNZXRhTW9kYWwoKTtcblxuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICRpbnB1dE1ldGFLZXkgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tZXRhX2tleSBzZWxlY3QnICk7XG5cdFx0Y29uc3QgbWV0YUtleSAgICAgICA9ICRpbnB1dE1ldGFLZXkudmFsKCk7XG5cblx0XHRpZiAoICEgbWV0YUtleSApIHtcblx0XHRcdCRub0tleUZvdW5kTWVzc2FnZS5hZGRDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JG5vS2V5Rm91bmRNZXNzYWdlLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdH1cblxuXHRcdHBvc3RNZXRhT3B0aW9uc01vZGFsSW5zdGFuY2Uub3BlbigpO1xuXHRcdCRwb3N0TWV0YUZpZWxkID0gJGZpZWxkO1xuXG5cdFx0aWYgKCAhIG1ldGFLZXkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gU2hvdyB0aGUgbG9hZGluZyBhbmltYXRpb24uXG5cdFx0JHBvc3RNZXRhTW9kYWxMb2FkZXIuYWRkQ2xhc3MoICdhY3RpdmUnICk7XG5cblx0XHQvKipcblx0XHQgKiBBamF4J3Mgc3VjY2VzcyBmdW5jdGlvbi5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSByZXNwb25zZVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIG9rQ2FsbGJhY2soIHJlc3BvbnNlICkge1xuXHRcdFx0Ly8gSGlkZSB0aGUgbG9hZGluZyBhbmltYXRpb24uXG5cdFx0XHQkcG9zdE1ldGFNb2RhbExvYWRlci5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHRcdCRwb3N0TWV0YU1vZGFsRm9vdGVyLmFkZENsYXNzKCAnYWN0aXZlJyApO1xuXG5cdFx0XHQkcG9zdE1ldGFPcHRpb25zLmh0bWwoIHJlc3BvbnNlICk7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogQWpheCdzIGVycm9yIGZ1bmN0aW9uLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIG1lc3NhZ2Vcblx0XHQgKi9cblx0XHRmdW5jdGlvbiBlcnJDYWxsYmFjayggbWVzc2FnZSApIHtcblx0XHRcdGNvbnNvbGUubG9nKCAnZXJyb3InLCBtZXNzYWdlICk7XG5cblx0XHRcdC8vIEhpZGUgdGhlIGxvYWRpbmcgYW5pbWF0aW9uLlxuXHRcdFx0JHBvc3RNZXRhTW9kYWxMb2FkZXIucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgZm9ybURhdGEgPSB7XG5cdFx0XHRrZXk6IG1ldGFLZXksXG5cdFx0XHRhY3Rpb246ICd3Y2FwZl9nZXRfbWV0YV9vcHRpb25zJyxcblx0XHR9XG5cblx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTkxODEyNTJcblx0XHR3cC5hamF4LnBvc3QoIGZvcm1EYXRhICkuZG9uZSggb2tDYWxsYmFjayApLmZhaWwoIGVyckNhbGxiYWNrICk7XG5cdH0gKTtcblxuXHQvKipcblx0ICogUmVzZXQgdGhlIHBvc3QgbWV0YSBvcHRpb24ncyBtb2RhbCB3aGVuIG1vZGFsIGdldHMgY2xvc2VkLlxuXHQgKi9cblx0JCggZG9jdW1lbnQgKS5vbiggJ2Nsb3NlZCcsICRwb3N0TWV0YU9wdGlvbnNNb2RhbCwgZnVuY3Rpb24oKSB7XG5cdFx0cmVzZXRQb3N0TWV0YU1vZGFsKCk7XG5cdFx0JHBvc3RNZXRhRmllbGQgPSBudWxsO1xuXHR9ICk7XG5cblx0Ly8gVW5zZWxlY3QgYWxsIHZhbHVlcy5cblx0JHBvc3RNZXRhT3B0aW9uc01vZGFsLm9uKCAnY2xpY2snLCAnLnNlbGVjdC1ub25lJywgZnVuY3Rpb24oKSB7XG5cdFx0JHBvc3RNZXRhT3B0aW9ucy5maW5kKCAnW3R5cGU9XCJjaGVja2JveFwiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdH0gKTtcblxuXHQvLyBTZWxlY3QgYWxsIHZhbHVlcy5cblx0JHBvc3RNZXRhT3B0aW9uc01vZGFsLm9uKCAnY2xpY2snLCAnLnNlbGVjdC1hbGwnLCBmdW5jdGlvbigpIHtcblx0XHQkcG9zdE1ldGFPcHRpb25zLmZpbmQoICdbdHlwZT1cImNoZWNrYm94XCJdJyApLnByb3AoICdjaGVja2VkJywgdHJ1ZSApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gdHJpZ2dlck1hbnVhbE9wdGlvbnNDaGFuZ2UoICRwb3N0TWV0YUZpZWxkICkge1xuXHRcdGNvbnN0ICR2YWx1ZUhvbGRlciAgPSAkcG9zdE1ldGFGaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1hbnVhbF9vcHRpb25zIGlucHV0JyApO1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkcG9zdE1ldGFGaWVsZC5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0ICRyb3dzICAgICAgICAgPSAkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApO1xuXHRcdGNvbnN0IF9yb3dzICAgICAgICAgPSBbXTtcblxuXHRcdCRyb3dzLmZpbmQoICcuaXRlbScgKS5lYWNoKCBmdW5jdGlvbiggaSwgX2l0ZW0gKSB7XG5cdFx0XHRjb25zdCAkaXRlbSA9ICQoIF9pdGVtICk7XG5cdFx0XHRjb25zdCB2YWx1ZSA9ICRpdGVtLmZpbmQoICcub3B0aW9uX3ZhbHVlJyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgbGFiZWwgPSAkaXRlbS5maW5kKCAnLm9wdGlvbl9sYWJlbCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCB2YWx1ZSAmJiBsYWJlbCApIHtcblx0XHRcdFx0X3Jvd3MucHVzaCggWyB2YWx1ZSwgbGFiZWwgXSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGNvbnN0IHJhd1ZhbHVlcyA9IGVuY29kZVVSSUNvbXBvbmVudCggSlNPTi5zdHJpbmdpZnkoIF9yb3dzICkgKTtcblx0XHQkdmFsdWVIb2xkZXIudmFsKCByYXdWYWx1ZXMgKTtcblx0fVxuXG5cdC8vIEFkZCBzZWxlY3RlZCBvcHRpb25zLlxuXHQkcG9zdE1ldGFPcHRpb25zTW9kYWwub24oICdjbGljaycsICcuYWRkLW9wdGlvbnMnLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkb3B0aW9ucyA9ICRwb3N0TWV0YU9wdGlvbnMuZmluZCggJ1t0eXBlPVwiY2hlY2tib3hcIl0nICk7XG5cdFx0bGV0IGlzUmVwbGFjZSAgPSBmYWxzZTtcblx0XHRsZXQgcm93cyAgICAgICA9ICcnO1xuXG5cdFx0aWYgKCAkcG9zdE1ldGFNb2RhbEZvb3Rlci5maW5kKCAnLnJlcGxhY2UtY3VycmVudC1vcHRpb25zJyApLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRpc1JlcGxhY2UgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICggJG9wdGlvbnMgKSB7XG5cdFx0XHRjb25zdCBmaWVsZFR5cGUgPSAnd2NhcGYtcG9zdC1tZXRhLW9wdGlvbic7XG5cblx0XHRcdCQuZWFjaCggJG9wdGlvbnMsIGZ1bmN0aW9uKCBpLCBpbnB1dCApIHtcblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggaW5wdXQgKTtcblx0XHRcdFx0Y29uc3QgdmFsdWUgID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdGlmICggJGlucHV0LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRcdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggZmllbGRUeXBlICk7XG5cdFx0XHRcdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSggeyB2YWx1ZSwgbGFiZWw6IHZhbHVlIH0gKTtcblxuXHRcdFx0XHRcdHJvd3MgKz0gcmVuZGVyZWQ7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpZiAoIHJvd3MgKSB7XG5cdFx0XHRjb25zdCAkd3JhcHBlciA9ICRwb3N0TWV0YUZpZWxkLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0XHRjb25zdCAkcm93cyAgICA9ICR3cmFwcGVyLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApO1xuXG5cdFx0XHRpZiAoIGlzUmVwbGFjZSApIHtcblx0XHRcdFx0JHJvd3MuaHRtbCggcm93cyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHJvd3MuYXBwZW5kKCByb3dzICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISAkd3JhcHBlci5oYXNDbGFzcyggJ2hhcy1vcHRpb25zJyApICkge1xuXHRcdFx0XHQkd3JhcHBlci5hZGRDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdFx0fVxuXG5cdFx0XHR0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJHBvc3RNZXRhRmllbGQgKTtcblx0XHR9XG5cblx0XHRwb3N0TWV0YU9wdGlvbnNNb2RhbEluc3RhbmNlLmNsb3NlKCk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWdldF9vcHRpb25zIGlucHV0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRzZWxlY3RFbG0gICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1vcHRpb25zX29yZGVyX2J5IHNlbGVjdCcgKTtcblx0XHRcdGNvbnN0IG9yZGVyQnkgICAgICAgICAgPSAkc2VsZWN0RWxtLnZhbCgpO1xuXHRcdFx0Y29uc3QgZGVwZW5kYW50T3B0aW9ucyA9ICdvcHRpb25bdmFsdWU9XCJsYWJlbFwiXSc7XG5cblx0XHRcdGlmICggJ2F1dG9tYXRpY2FsbHknID09PSB2YWx1ZSApIHtcblx0XHRcdFx0JHNlbGVjdEVsbS5jaGlsZHJlbiggZGVwZW5kYW50T3B0aW9ucyApLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblxuXHRcdFx0XHRpZiAoICdsYWJlbCcgPT09IG9yZGVyQnkgKSB7XG5cdFx0XHRcdFx0JHNlbGVjdEVsbS5wcm9wKCAnc2VsZWN0ZWRJbmRleCcsIDEgKS5jaGFuZ2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHNlbGVjdEVsbS5jaGlsZHJlbiggZGVwZW5kYW50T3B0aW9ucyApLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2lucHV0JywgJy5tYW51YWwtb3B0aW9ucy10YWJsZSBpbnB1dFt0eXBlPVwidGV4dFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHR0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvKipcblx0ICogVmFsdWUgdHlwZSAnTnVtYmVyJ1xuXHQgKi9cblxuXHRmdW5jdGlvbiB0cmlnZ2VyUmVtb3ZlTnVtYmVyT3B0aW9uKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblx0XHRjb25zdCB0YWJsZVJvd3MgICAgID0gJG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKS5jaGlsZHJlbigpO1xuXG5cdFx0aWYgKCAyID4gdGFibGVSb3dzLmxlbmd0aCApIHtcblx0XHRcdCRvcHRpb25zVGFibGUucmVtb3ZlQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiB0cmlnZ2VyTnVtYmVyTWFudWFsT3B0aW9uc0NoYW5nZSggJHBvc3RNZXRhRmllbGQgKSB7XG5cdFx0Y29uc3QgJHZhbHVlSG9sZGVyICA9ICRwb3N0TWV0YUZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX21hbnVhbF9vcHRpb25zIGlucHV0JyApO1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkcG9zdE1ldGFGaWVsZC5maW5kKCAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblx0XHRjb25zdCAkcm93cyAgICAgICAgID0gJG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKTtcblx0XHRjb25zdCBfcm93cyAgICAgICAgID0gW107XG5cblx0XHQkcm93cy5maW5kKCAnLml0ZW0nICkuZWFjaCggZnVuY3Rpb24oIGksIF9pdGVtICkge1xuXHRcdFx0Y29uc3QgJGl0ZW0gICAgID0gJCggX2l0ZW0gKTtcblx0XHRcdGNvbnN0IG1pbl92YWx1ZSA9ICRpdGVtLmZpbmQoICcub3B0aW9uX21pbl92YWx1ZScgKS52YWwoKTtcblx0XHRcdGNvbnN0IG1heF92YWx1ZSA9ICRpdGVtLmZpbmQoICcub3B0aW9uX21heF92YWx1ZScgKS52YWwoKTtcblx0XHRcdGNvbnN0IGxhYmVsICAgICA9ICRpdGVtLmZpbmQoICcub3B0aW9uX2xhYmVsJyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoIG1pbl92YWx1ZSAmJiBtYXhfdmFsdWUgJiYgbGFiZWwgKSB7XG5cdFx0XHRcdF9yb3dzLnB1c2goIFsgbWluX3ZhbHVlLCBtYXhfdmFsdWUsIGxhYmVsIF0gKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHRjb25zdCByYXdWYWx1ZXMgPSBlbmNvZGVVUklDb21wb25lbnQoIEpTT04uc3RyaW5naWZ5KCBfcm93cyApICk7XG5cdFx0JHZhbHVlSG9sZGVyLnZhbCggcmF3VmFsdWVzICk7XG5cdH1cblxuXHQvLyBSZW1vdmUgU2luZ2xlIE51bWJlciBPcHRpb25cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcucmVtb3ZlLW51bWJlci1vcHRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkaXRlbSAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5pdGVtJyApO1xuXHRcdGNvbnN0ICRmaWVsZCA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVOdW1iZXJPcHRpb24oICRmaWVsZCApO1xuXG5cdFx0JGl0ZW0ucmVtb3ZlKCk7XG5cblx0XHR0cmlnZ2VyTnVtYmVyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBDbGVhciBBbGwgT3B0aW9uc1xuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5jbGVhci1hbGwtbnVtYmVyLW9wdGlvbnMnLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgICAgICAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXG5cdFx0JG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKS5lbXB0eSgpO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU51bWJlck9wdGlvbiggJGZpZWxkICk7XG5cblx0XHR0cmlnZ2VyTnVtYmVyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBBZGQgTmV3IE9wdGlvblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5hZGQtbnVtYmVyLW9wdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1wb3N0LW1ldGEtdHlwZS1udW1iZXItb3B0aW9uJztcblxuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgZmllbGRUeXBlICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCB7IHZhbHVlOiAnJywgbGFiZWw6ICcnIH0gKTtcblx0XHRjb25zdCAkd3JhcHBlciA9ICRmaWVsZC5maW5kKCAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblx0XHRjb25zdCAkcm93cyAgICA9ICR3cmFwcGVyLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApO1xuXG5cdFx0JHJvd3MuYXBwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0aWYgKCAhICR3cmFwcGVyLmhhc0NsYXNzKCAnaGFzLW9wdGlvbnMnICkgKSB7XG5cdFx0XHQkd3JhcHBlci5hZGRDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnaW5wdXQnLCAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZSBpbnB1dFt0eXBlPVwidGV4dFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHR0cmlnZ2VyTnVtYmVyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRnZXRPcHRpb25zICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2dldF9vcHRpb25zJyApO1xuXHRcdFx0Y29uc3QgJGF1dG9PcHRpb25zICAgPSAkZmllbGQuZmluZCggJy5udW1iZXItYXV0b21hdGljLW9wdGlvbnMnICk7XG5cdFx0XHRjb25zdCAkbWFudWFsT3B0aW9ucyA9ICRmaWVsZC5maW5kKCAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblx0XHRcdGNvbnN0ICRlbG0gICAgICAgICAgID0gJGZpZWxkLmZpbmQoIGhhbmRsZXIgKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlUeXBlICAgID0gJGVsbS52YWwoKTtcblxuXHRcdFx0aWYgKCAncmFuZ2Vfc2xpZGVyJyA9PT0gZGlzcGxheVR5cGUgfHwgJ3JhbmdlX251bWJlcicgPT09IGRpc3BsYXlUeXBlICkge1xuXHRcdFx0XHQkZ2V0T3B0aW9ucy5oaWRlKCk7XG5cdFx0XHRcdCRtYW51YWxPcHRpb25zLmFkZENsYXNzKCAnZm9yY2UtaGlkZScgKTtcblx0XHRcdFx0JGF1dG9PcHRpb25zLmFkZENsYXNzKCAnZm9yY2Utc2hvdycgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRnZXRPcHRpb25zLnNob3coKTtcblx0XHRcdFx0JG1hbnVhbE9wdGlvbnMucmVtb3ZlQ2xhc3MoICdmb3JjZS1oaWRlJyApO1xuXHRcdFx0XHQkYXV0b09wdGlvbnMucmVtb3ZlQ2xhc3MoICdmb3JjZS1zaG93JyApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyAgICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgPSAkdGhpcy5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJHRleHRGaWVsZCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZSBpbnB1dFt0eXBlPVwidGV4dFwiXScgKTtcblxuXHRcdGlmICggJHRoaXMuaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdCR0ZXh0RmllbGQuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkdGV4dEZpZWxkLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHR9XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgICAgICA9ICQoIHRoaXMgKTtcblx0XHRjb25zdCAkZmllbGQgICAgID0gJHRoaXMuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICR0ZXh0RmllbGQgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWUgaW5wdXRbdHlwZT1cInRleHRcIl0nICk7XG5cblx0XHRpZiAoICR0aGlzLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHQkdGV4dEZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JHRleHRGaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0fVxuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIHNlYXJjaCBmb3JtIGZpZWxkLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCAkc2VhcmNoRm9ybSA9ICQoICcjc2VhcmNoLWZvcm0nICk7XG5cblx0Y29uc3QgZGVwZW5kYW50RGF0YSA9IFtcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtdGV4dC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RleHQnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtbnVtYmVyLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbnVtYmVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjaGVja2JveCcsICdtdWx0aS1zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFkaW8nLCAnc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdzZWxlY3QnLCAnbXVsdGktc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWdldF9vcHRpb25zIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdtYW51YWxfZW50cnknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2xpZGVyX2Rpc3BsYXlfdmFsdWVzX2FzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1kZWNpbWFsLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJywgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2NoZWNrYm94X3F1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2VsZWN0X2FsbF9pdGVtc19sYWJlbCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfdXNlX2Nob3NlbicsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXJfcmFuZ2VfY29sMl9zdWJfZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICcxJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZ2V0X29wdGlvbnMgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLWF1dG9tYXRpYy1vcHRpb25zJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdhdXRvbWF0aWNhbGx5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItbWFudWFsLW9wdGlvbnMtdGFibGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ21hbnVhbF9lbnRyeScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XTtcblxuXHRmdW5jdGlvbiBfdHJpZ2dlcklucHV0VHlwZVRleHREaXNwbGF5VHlwZUNoYW5nZSggdmFsdWUsICRmaWVsZCApIHtcblx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0Y29uc3QgdXNlQ2hvc2VuICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0JyApLmlzKCAnOmNoZWNrZWQnICk7XG5cblx0XHRpZiAoIHVzZUNob3NlbiAmJiAoICdzZWxlY3QnID09PSB2YWx1ZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgKSApIHtcblx0XHRcdCRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHR9XG5cblx0XHRpZiAoICggJ3JhZGlvJyA9PT0gdmFsdWUgfHwgJ3NlbGVjdCcgPT09IHZhbHVlICkgfHwgKCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgJiYgdXNlQ2hvc2VuICkgKSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBfdHJpZ2dlcklucHV0VHlwZU51bWJlckRpc3BsYXlUeXBlQ2hhbmdlKCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2VsZWN0X2FsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRjb25zdCB1c2VDaG9zZW4gICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuIGlucHV0JyApLmlzKCAnOmNoZWNrZWQnICk7XG5cblx0XHRpZiAoIHVzZUNob3NlbiAmJiAoICdyYW5nZV9zZWxlY3QnID09PSB2YWx1ZSB8fCAncmFuZ2VfbXVsdGlzZWxlY3QnID09PSB2YWx1ZSApICkge1xuXHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdH1cblxuXHRcdGlmICggKCAncmFuZ2VfcmFkaW8nID09PSB2YWx1ZSB8fCAncmFuZ2Vfc2VsZWN0JyA9PT0gdmFsdWUgKSB8fCAoICdyYW5nZV9tdWx0aXNlbGVjdCcgPT09IHZhbHVlICYmIHVzZUNob3NlbiApICkge1xuXHRcdFx0JGFsbEl0ZW1zTGFiZWwuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gX3RyaWdnZXJJbnB1dFR5cGVUZXh0VXNlU2VsZWN0Q2hhbmdlKCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScgKTtcblx0XHRjb25zdCAkYWxsSXRlbXNMYWJlbCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRjb25zdCBkaXNwbGF5VHlwZSAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnICkudmFsKCk7XG5cblx0XHRpZiAoICcxJyA9PT0gdmFsdWUgJiYgKCAnc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgfHwgJ211bHRpLXNlbGVjdCcgPT09IGRpc3BsYXlUeXBlICkgKSB7XG5cdFx0XHQkbm9SZXN1bHRzLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0fVxuXG5cdFx0aWYgKFxuXHRcdFx0KCAnMScgPT09IHZhbHVlICYmICdtdWx0aS1zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0XHR8fCAoICdyYWRpbycgPT09IGRpc3BsYXlUeXBlIHx8ICdzZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0KSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBfdHJpZ2dlcklucHV0VHlwZU51bWJlclVzZVNlbGVjdENoYW5nZSggdmFsdWUsICRmaWVsZCApIHtcblx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NlbGVjdF9hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0Y29uc3QgZGlzcGxheVR5cGUgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcgKS52YWwoKTtcblxuXHRcdGlmICggJzEnID09PSB2YWx1ZSAmJiAoICdyYW5nZV9zZWxlY3QnID09PSBkaXNwbGF5VHlwZSB8fCAncmFuZ2VfbXVsdGlzZWxlY3QnID09PSBkaXNwbGF5VHlwZSApICkge1xuXHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdH1cblxuXHRcdGlmIChcblx0XHRcdCggJzEnID09PSB2YWx1ZSAmJiAncmFuZ2VfbXVsdGlzZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0XHR8fCAoICdyYW5nZV9yYWRpbycgPT09IGRpc3BsYXlUeXBlIHx8ICdyYW5nZV9zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0KSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgICA9IGN1cnJlbnRTZWxlY3Rvci5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgaGFuZGxlciAgICAgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRjb25zdCBoYW5kbGVyVHlwZSA9IGRhdGFbICdoYW5kbGVyVHlwZScgXTtcblx0XHRjb25zdCBkZXBlbmRhbnQgICA9IGRhdGFbICdkZXBlbmRhbnQnIF07XG5cblx0XHRsZXQgX3ZhbHVlID0gdmFsdWU7XG5cblx0XHRpZiAoICdjaGVja2JveCcgPT09IGhhbmRsZXJUeXBlICkge1xuXHRcdFx0X3ZhbHVlID0gY3VycmVudFNlbGVjdG9yLmlzKCAnOmNoZWNrZWQnICkgPyAnMScgOiAnMCc7XG5cdFx0fVxuXG5cdFx0aWYgKCAncmFkaW8nID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9ICRmaWVsZC5maW5kKCBoYW5kbGVyICsgJzpjaGVja2VkJyApLnZhbCgpO1xuXHRcdH1cblxuXHRcdCQuZWFjaCggZGVwZW5kYW50LCBmdW5jdGlvbiggaWQsIGQgKSB7XG5cdFx0XHRjb25zdCAkc2VsZWN0b3IgICA9ICRmaWVsZC5maW5kKCBkWyAnc2VsZWN0b3InIF0gKTtcblx0XHRcdGNvbnN0IHZhbGlkVmFsdWVzID0gZFsgJ3ZhbHVlJyBdO1xuXG5cdFx0XHRpZiAoIHZhbGlkVmFsdWVzLmluY2x1ZGVzKCBfdmFsdWUgKSApIHtcblx0XHRcdFx0JHNlbGVjdG9yLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0X3RyaWdnZXJJbnB1dFR5cGVUZXh0RGlzcGxheVR5cGVDaGFuZ2UoIF92YWx1ZSwgJGZpZWxkICk7XG5cdFx0fVxuXG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0X3RyaWdnZXJJbnB1dFR5cGVUZXh0VXNlU2VsZWN0Q2hhbmdlKCBfdmFsdWUsICRmaWVsZCApO1xuXHRcdH1cblxuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRfdHJpZ2dlcklucHV0VHlwZU51bWJlckRpc3BsYXlUeXBlQ2hhbmdlKCBfdmFsdWUsICRmaWVsZCApO1xuXHRcdH1cblxuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfdXNlX2Nob3NlbiBpbnB1dCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRfdHJpZ2dlcklucHV0VHlwZU51bWJlclVzZVNlbGVjdENoYW5nZSggX3ZhbHVlLCAkZmllbGQgKTtcblx0XHR9XG5cblx0XHQkc2VhcmNoRm9ybS50cmlnZ2VyKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBbIGhhbmRsZXIsIF92YWx1ZSwgJGZpZWxkIF0gKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0aWYgKCBudWxsID09PSBjdXJyZW50U2VsZWN0b3IgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyICA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdFx0Y29uc3QgJGhhbmRsZXIgPSAkKCBoYW5kbGVyICk7XG5cblx0XHRcdCQuZWFjaCggJGhhbmRsZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IF92YWx1ZSA9IF90aGlzLnZhbCgpO1xuXHRcdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgX3RoaXMsIF92YWx1ZSApO1xuXHRcdFx0fSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNldHVwU2VhcmNoRm9ybSggaW5pdGFsID0gZmFsc2UgKSB7XG5cdFx0JC5lYWNoKCBkZXBlbmRhbnREYXRhLCBmdW5jdGlvbiggaSwgZGF0YSApIHtcblx0XHRcdGNvbnN0IGhhbmRsZXIgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRcdGNvbnN0IGV2ZW50ICAgPSBkYXRhWyAnZXZlbnQnIF07XG5cblx0XHRcdGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIG51bGwsIG51bGwgKTtcblxuXHRcdFx0aWYgKCBpbml0YWwgKSB7XG5cdFx0XHRcdCRzZWFyY2hGb3JtLm9uKCBldmVudCwgaGFuZGxlciwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgX3RoaXMgID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdGNvbnN0IF92YWx1ZSA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0XHRoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBfdGhpcywgX3ZhbHVlICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRzZXR1cFNlYXJjaEZvcm0oIHRydWUgKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gVG9nZ2xlIHRoZSB2aXNpYmlsaXR5IG9mIHN1YmZpZWxkcy5cblx0XHRzZXR1cFNlYXJjaEZvcm0oKTtcblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIFRoZSBzZWFyY2ggZm9ybS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmNvbnN0IHRvdGFsRmllbGRJbnN0YW5jZXMgPSBqUXVlcnkoICcjdG90YWxfZmllbGRfaW5zdGFuY2VzJyApO1xuXG5jb25zdCBzZWFyY2hGb3JtID0galF1ZXJ5KCAnI3NlYXJjaC1mb3JtJyApO1xuXG4vKipcbiAqIEFzc2lnbiBhIHVuaXF1ZSBpZCBieSByZXBsYWNpbmcgdGhlIHBsYWNlaG9sZGVyIGlkLlxuICovXG5mdW5jdGlvbiByZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIGVsZW1lbnRzLCBhdHRyICkge1xuXHRlbGVtZW50cy5lYWNoKFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgZWxlbWVudCA9IGpRdWVyeSggdGhpcyApO1xuXG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IGVsZW1lbnQuYXR0ciggYXR0ciApO1xuXHRcdFx0Y29uc3QgbmV3VmFsdWUgPSBvbGRWYWx1ZS5yZXBsYWNlKCAnJSUnLCB1bmlxdWVJZCApO1xuXG5cdFx0XHRlbGVtZW50LmF0dHIoIGF0dHIsIG5ld1ZhbHVlICk7XG5cdFx0fVxuXHQpO1xufVxuXG4vKipcbiAqIEluc2VydCB0aGUgZmllbGQncyBzdWJmaWVsZHMuXG4gKi9cbmZ1bmN0aW9uIGluc2VydEZpZWxkU3ViRmllbGRzKCB1aSApIHtcblx0Ly8gSW5zZXJ0IHRoZSBmaWVsZCdzIHN1YmZpZWxkcyBpZiBub3QgYWxyZWFkeSBpbnNlcnRlZC5cblx0aWYgKCAhIHVpLml0ZW0uaGFzQ2xhc3MoICdzdWItZmllbGRzLXJlYWR5JyApICkge1xuXHRcdGNvbnN0IHR5cGUgICAgICA9IHVpLml0ZW0uYXR0ciggJ2RhdGEtZmllbGQtdHlwZScgKTtcblx0XHRjb25zdCB1bmlxdWVJZCAgPSBwYXJzZUludCggdG90YWxGaWVsZEluc3RhbmNlcy52YWwoKSApO1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1mb3JtLWZpZWxkLScgKyB0eXBlO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gSW5jcmVtZW50IHRoZSB2YWx1ZSBvZiB0b3RhbCBmaWVsZCBpbnN0YW5jZXMuXG5cdFx0dG90YWxGaWVsZEluc3RhbmNlcy52YWwoIHVuaXF1ZUlkICsgMSApO1xuXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggZmllbGRUeXBlICk7XG5cdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSgpO1xuXHRcdGNvbnN0IHdyYXBwZXIgID0gdWkuaXRlbS5maW5kKCAnLndpZGdldC1jb250ZW50JyApO1xuXG5cdFx0d3JhcHBlci5wcmVwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBmb3IgYXR0cmlidXRlcyBvZiB0aGUgbGFiZWxzLlxuXHRcdHJlbW92ZVBsYWNlaG9sZGVyKCB1bmlxdWVJZCwgdWkuaXRlbS5maW5kKCAnbGFiZWxbZm9yXj1cIndjYXBmLWlucHV0LVwiXScgKSwgJ2ZvcicgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgaWRzIG9mIHRoZSBpbnB1dCBlbGVtZW50cy5cblx0XHRyZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIHVpLml0ZW0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtXCJdJyApLCAnaWQnICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIG5hbWVzIG9mIHRoZSBpbnB1dCBlbGVtZW50cy5cblx0XHRyZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIHVpLml0ZW0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtXCJdJyApLCAnbmFtZScgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgcG9zaXRpb24gdmFsdWUuXG5cdFx0cmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCB1aS5pdGVtLmZpbmQoICcqW2lkXj1cIndjYXBmLWlucHV0LXBvc2l0aW9uLVwiXScgKSwgJ3ZhbHVlJyApO1xuXG5cdFx0dWkuaXRlbS5hZGRDbGFzcyggJ3N1Yi1maWVsZHMtcmVhZHknICk7XG5cblx0XHRzZWFyY2hGb3JtLnRyaWdnZXIoICdmaWVsZF9hZGRlZCcsIFsgdWkgXSApO1xuXHR9XG59XG5cbi8qKlxuICogVXBkYXRlIHRoZSBmb3JtIGZpZWxkJ3MgcG9zaXRpb24gYWZ0ZXIgc29ydC5cbiAqXG4gKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNDczNjc3NVxuICovXG5mdW5jdGlvbiB1cGRhdGVGaWVsZHNQb3NpdGlvbigpIHtcblx0Y29uc3QgaW5wdXRzICA9IHNlYXJjaEZvcm0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtcG9zaXRpb24tXCJdJyApO1xuXHRjb25zdCBuYkVsZW1zID0gaW5wdXRzLmxlbmd0aDtcblxuXHRpbnB1dHMuZWFjaChcblx0XHRmdW5jdGlvbiggaWR4ICkge1xuXHRcdFx0alF1ZXJ5KCB0aGlzICkudmFsKCBuYkVsZW1zIC0gKCBuYkVsZW1zIC0gaWR4ICkgKTtcblx0XHR9XG5cdCk7XG59XG5cbi8qKlxuICogTWFrZSB0aGUgZmllbGQgcmVhZHksIHJlbW92ZSBzdHlsZXMgY29tZXMgZnJvbSBqcXVlcnktdWktc29ydGFibGUgcGx1Z2luLCBpbnNlcnQgdGhlIGZpZWxkJ3Mgc3ViZmllbGRzIGV0Yy5cbiAqL1xuZnVuY3Rpb24gbWFrZUZpZWxkUmVhZHkoIGUsIHVpICkge1xuXHQvLyBSZW1vdmUgc3R5bGVzIGNvbWVzIGZyb20ganF1ZXJ5LXVpLXNvcnRhYmxlIHBsdWdpbi5cblx0dWkuaXRlbS5yZW1vdmVBdHRyKCAnc3R5bGUnICk7XG5cblx0aW5zZXJ0RmllbGRTdWJGaWVsZHMoIHVpICk7XG5cblx0dXBkYXRlRmllbGRzUG9zaXRpb24oKTtcblxuXHRjb25zdCB0b2dnbGVCdG4gPSB1aS5pdGVtLmZpbmQoICcud2lkZ2V0LWFjdGlvbicgKTtcblxuXHQvLyBFeHBhbmQgdGhlIGZvcm0gZmllbGQgYWZ0ZXIgc29ydC5cblx0aWYgKCAnZmFsc2UnID09PSB0b2dnbGVCdG4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnICkgKSB7XG5cdFx0dG9nZ2xlQnRuLnRyaWdnZXIoICdjbGljaycgKTtcblx0fVxufVxuXG4vKipcbiAqIEluc3RhbnRpYXRlIHNvcnRhYmxlIGZvciB0aGUgZm9ybSBmaWVsZHMuXG4gKi9cbmZ1bmN0aW9uIHNvcnRhYmxlKCBpZGVudGlmaWVyICkge1xuXHRjb25zdCBjb250YWluZXIgPSBqUXVlcnkoIGlkZW50aWZpZXIgKTtcblxuXHRjb250YWluZXIuc29ydGFibGUoXG5cdFx0e1xuXHRcdFx0b3BhY2l0eTogMC44LFxuXHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdGN1cnNvcjogJ21vdmUnLFxuXHRcdFx0YXhpczogJ3knLFxuXHRcdFx0aGFuZGxlOiAnLndpZGdldC10b3AnLFxuXHRcdFx0Y2FuY2VsOiAnLndpZGdldC10aXRsZS1hY3Rpb24nLFxuXHRcdFx0aXRlbXM6ICcud2lkZ2V0Jyxcblx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdGNvbm5lY3RXaXRoOiAnI3NlYXJjaC1mb3JtLXdyYXBwZXInLFxuXHRcdFx0c3RvcDogbWFrZUZpZWxkUmVhZHksXG5cdFx0XHRzdGFydDogZnVuY3Rpb24oIGUsIHVpICkge1xuXHRcdFx0XHQvLyBJZiBpdCBpcyBnZXR0aW5nIGFwcGVuZGVkIHRvIHRoZSB3cm9uZyBwbGFjZSwgdGhlbiBmb3JjZSBpdCBpbnRvIHRoZSByaWdodCBjb250YWluZXIuXG5cdFx0XHRcdHVpLnBsYWNlaG9sZGVyLmFwcGVuZFRvKCB1aS5wbGFjZWhvbGRlci5wYXJlbnQoKS5maW5kKCAnLmluc2lkZSAjc2VhcmNoLWZvcm0td3JhcHBlcicgKSApO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcbn1cblxuc29ydGFibGUoICcjc2VhcmNoLWZvcm0nICk7XG5cbi8qKlxuICogUnVuIGZ1bmN0aW9uIHdoZW4gZHJhZyBzdGFydHMuXG4gKi9cbmZ1bmN0aW9uIG9uRHJhZ1N0YXJ0KCkge1xuXHRzZWFyY2hGb3JtLmFkZENsYXNzKCAndWktZHJvcC1hY3RpdmUnICk7XG59XG5cbi8qKlxuICogUnVuIGZ1bmN0aW9uIGF0IGRyYWcgc3RvcC5cbiAqL1xuZnVuY3Rpb24gb25EcmFnU3RvcCgpIHtcblx0c2VhcmNoRm9ybS5yZW1vdmVDbGFzcyggJ3VpLWRyb3AtYWN0aXZlJyApO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemUgZHJhZ2dhYmxlIGZvciB0aGUgZm9ybSBmaWVsZHMuXG4gKi9cbmpRdWVyeSggJyNhdmFpbGFibGUtZmllbGRzIC53aWRnZXQnICkuZHJhZ2dhYmxlKFxuXHR7XG5cdFx0Y29ubmVjdFRvU29ydGFibGU6ICcjc2VhcmNoLWZvcm0nLFxuXHRcdGhlbHBlcjogJ2Nsb25lJyxcblx0XHRzdGFydDogb25EcmFnU3RhcnQsXG5cdFx0c3RvcDogb25EcmFnU3RvcCxcblx0fVxuKTtcblxuLyoqXG4gKiBUb2dnbGUgdGhlIGZvcm0gZmllbGQuXG4gKi9cbmZ1bmN0aW9uIHRvZ2dsZUZpZWxkKCBlICkge1xuXHRjb25zdCB0YXJnZXQgICAgICAgPSBlLnRhcmdldDtcblx0Y29uc3Qgd2lkZ2V0ICAgICAgID0galF1ZXJ5KCB0aGlzICkuY2xvc2VzdCggJy53aWRnZXQnICk7XG5cdGNvbnN0IHRvZ2dsZUJ0biAgICA9IHdpZGdldC5maW5kKCAnLndpZGdldC1hY3Rpb24nICk7XG5cdGNvbnN0IGluc2lkZSAgICAgICA9IHdpZGdldC5jaGlsZHJlbiggJy53aWRnZXQtaW5zaWRlJyApO1xuXHRjb25zdCBpc0V4cGFuZCAgICAgPSB0b2dnbGVCdG4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnICk7XG5cdGNvbnN0IHRvZ2dsZUV4cGFuZCA9ICd0cnVlJyA9PT0gaXNFeHBhbmQgPyAnZmFsc2UnIDogJ3RydWUnO1xuXG5cdHRvZ2dsZUJ0bi5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIHRvZ2dsZUV4cGFuZCApO1xuXHRqUXVlcnkoIGluc2lkZSApLnNsaWRlVG9nZ2xlKFxuXHRcdCdmYXN0Jyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdHdpZGdldC50b2dnbGVDbGFzcyggJ29wZW4nICk7XG5cdFx0XHRzZWFyY2hGb3JtLnRyaWdnZXIoICd3aWRnZXQtY2xvc2VkJywgWyB0YXJnZXQgXSApO1xuXHRcdH1cblx0KTtcbn1cblxuc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53aWRnZXQtdG9wJywgdG9nZ2xlRmllbGQgKTtcbnNlYXJjaEZvcm0ub24oICdjbGljaycsICcud2lkZ2V0LWNvbnRyb2wtY2xvc2UnLCB0b2dnbGVGaWVsZCApO1xuXG4vKipcbiAqIEZvY3VzIHRoZSBmb3JtIGZpZWxkJ3MgZXhwYW5kIGJ1dHRvbi5cbiAqL1xuZnVuY3Rpb24gZm9jdXNGaWVsZCggZSwgdGFyZ2V0ICkge1xuXHRpZiAoIHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoICd3aWRnZXQtY29udHJvbC1jbG9zZScgKSApIHtcblx0XHRjb25zdCB3aWRnZXQgPSBqUXVlcnkoIHRhcmdldCApLmNsb3Nlc3QoICcud2lkZ2V0JyApO1xuXHRcdGNvbnN0IGFjdGlvbiA9IHdpZGdldC5maW5kKCAnLndpZGdldC1hY3Rpb24nICk7XG5cblx0XHRhY3Rpb24uYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICkuZm9jdXMoKTtcblx0fVxufVxuXG5zZWFyY2hGb3JtLm9uKCAnd2lkZ2V0LWNsb3NlZCcsIGZvY3VzRmllbGQgKTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGZpZWxkLlxuICovXG5mdW5jdGlvbiByZW1vdmVGaWVsZCgpIHtcblx0Y29uc3Qgd2lkZ2V0ID0galF1ZXJ5KCB0aGlzICkuY2xvc2VzdCggJy53aWRnZXQnICk7XG5cblx0alF1ZXJ5KCB3aWRnZXQgKS5zbGlkZVVwKFxuXHRcdCdmYXN0Jyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdHdpZGdldC5yZW1vdmUoKTtcblx0XHRcdHVwZGF0ZUZpZWxkc1Bvc2l0aW9uKCk7XG5cdFx0fVxuXHQpO1xufVxuXG5zZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLndpZGdldC1jb250cm9sLXJlbW92ZScsIHJlbW92ZUZpZWxkICk7XG5cbi8qKlxuICogU3RvcmUgdGhlIGluaXRpYWwgZm9ybSBkYXRhIGludG8gYSB2YXJpYWJsZSBzbyB0aGF0IHdlIGNhbiBjb21wYXJlIGl0IHdoZW4gbGVhdmluZyB0aGUgcGFnZS5cbiAqL1xubGV0IGluaXRpYWxGb3JtU3RhdGUgPSBzZWFyY2hGb3JtLnNlcmlhbGl6ZUFycmF5KCk7XG5cbi8qKlxuICogU2hvdyBtZXNzYWdlIGFmdGVyIGZvcm0gc3VibWlzc2lvbi5cbiAqL1xuZnVuY3Rpb24gc2hvd01lc3NhZ2UoIG1lc3NhZ2UsIHR5cGUgPSAnc3VjY2VzcycgKSB7XG5cdGNvbnN0IGVsZW1lbnQgPSBqUXVlcnkoICc8cCBjbGFzcz1cIicgKyB0eXBlICsgJ1wiPicgKyBtZXNzYWdlICsgJzwvcD4nICk7XG5cdGNvbnN0IHdyYXBwZXIgPSBqUXVlcnkoICcud2NhcGYtbWVzc2FnZS13cmFwcGVyJyApO1xuXG5cdGlmICggISB3cmFwcGVyLmlzKCAnOmVtcHR5JyApICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGpRdWVyeSggd3JhcHBlciApLmh0bWwoIGVsZW1lbnQgKS5zbGlkZURvd24oICdmYXN0JyApO1xuXG5cdHNldFRpbWVvdXQoXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkoIHdyYXBwZXIgKS5zbGlkZVVwKCAnZmFzdCcgKTtcblx0XHRcdHdyYXBwZXIuaHRtbCggJycgKTtcblx0XHR9LFxuXHRcdDMwMDBcblx0KTtcbn1cblxuLyoqXG4gKiBTYXZlIHRoZSBzZWFyY2ggZm9ybS5cbiAqL1xuZnVuY3Rpb24gc2F2ZUZvcm0oKSB7XG5cdGNvbnN0IGJ1dHRvbiAgID0galF1ZXJ5KCB0aGlzICk7XG5cdGNvbnN0IGZvcm1EYXRhID0gc2VhcmNoRm9ybS5zZXJpYWxpemVBcnJheSgpO1xuXG5cdGJ1dHRvbi5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cblx0ZnVuY3Rpb24gb2tDYWxsYmFjayggbWVzc2FnZSApIHtcblx0XHRidXR0b24ucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBpbml0aWFsIGZvcm0gZGF0YSBhZnRlciBzdWNjZXNzZnVsbHkgc2F2aW5nIHRoZSBmb3JtLlxuXHRcdGluaXRpYWxGb3JtU3RhdGUgPSBmb3JtRGF0YTtcblxuXHRcdHNob3dNZXNzYWdlKCBtZXNzYWdlICk7XG5cdH1cblxuXHRmdW5jdGlvbiBlcnJDYWxsYmFjayggbWVzc2FnZSApIHtcblx0XHRidXR0b24ucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdHNob3dNZXNzYWdlKCBtZXNzYWdlLCAnZXJyb3InICk7XG5cdH1cblxuXHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTkxODEyNTJcblx0d3AuYWpheC5wb3N0KCBmb3JtRGF0YSApLmRvbmUoIG9rQ2FsbGJhY2sgKS5mYWlsKCBlcnJDYWxsYmFjayApO1xufVxuXG5qUXVlcnkoICcjcG9zdGJveC1jb250YWluZXItMScgKS5vbiggJ2NsaWNrJywgJ2J1dHRvbicsIHNhdmVGb3JtICk7XG5cbi8qKlxuICogU2hvdyBhbGVydCBvbiBsZWF2ZSBpZiB0aGUgZm9ybSBpcyBkaXJ0eS5cbiAqXG4gKiBUT0RPOiBVbmNvbW1lbnQgdGhpcy5cbiAqL1xuLy8gd2luZG93Lm9uYmVmb3JldW5sb2FkID0gZnVuY3Rpb24oKSB7XG4vLyBcdGNvbnN0IG5ld0Zvcm1TdGF0ZSA9IHNlYXJjaEZvcm0uc2VyaWFsaXplQXJyYXkoKTtcbi8vXG4vLyBcdGNvbnN0IGlzRm9ybURpcnR5ID0gISBfLmlzRXF1YWwoIG5ld0Zvcm1TdGF0ZSwgaW5pdGlhbEZvcm1TdGF0ZSApO1xuLy9cbi8vIFx0aWYgKCBpc0Zvcm1EaXJ0eSApIHtcbi8vIFx0XHRyZXR1cm4gJyc7XG4vLyBcdH1cbi8vIH07XG4iXX0=
