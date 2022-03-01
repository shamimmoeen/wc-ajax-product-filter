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
  $searchForm.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-custom-taxonomy select' === handler) {
      var params = window['wcapf_admin_params'];
      var hierarchicalData = params['taxonomy_hierarchical_data'];

      if (!hierarchicalData) {
        return;
      }

      var isHierarchical = hierarchicalData[value];
      var $dependantFields = $field.find('.wcapf-form-sub-field-hierarchical, .wcapf-form-sub-field-show_children_only');

      if (isHierarchical) {
        $dependantFields.show();
      } else {
        $dependantFields.hide();
      }
    }
  });

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


  initSortableForManualOptions($searchForm.find('.manual-options-table .manual-options-table-body-rows'));
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

  function disableOrderByOptions($elm) {
    var value = $elm.val();
    var $wrapper = $elm.closest('.wcapf-post-meta-order-options-field');
    var $orderDirectionField = $wrapper.find('.wcapf-form-sub-field-options_order_dir select');
    var $orderTypeField = $wrapper.find('.wcapf-form-sub-field-options_order_type select');

    if ('none' === value) {
      $orderDirectionField.attr('disabled', 'disabled');
      $orderTypeField.attr('disabled', 'disabled');
    } else {
      $orderDirectionField.removeAttr('disabled');
      $orderTypeField.removeAttr('disabled');
    }
  }

  $searchForm.find('.wcapf-form-sub-field-options_order_by select').each(function () {
    var $this = $(this);
    disableOrderByOptions($this);
  });
  $searchForm.on('change', '.wcapf-form-sub-field-options_order_by select', function () {
    var $this = $(this);
    disableOrderByOptions($this);
  });
  $searchForm.on('input', '.manual-options-table input[type="text"]', function () {
    var $field = $(this).closest('.wcapf-form-field');
    triggerManualOptionsChange($field);
  });
  /**
   * Value type 'Number'
   */

  function initSortableForNumberManualOptions($selector) {
    $selector.sortable({
      opacity: 0.8,
      revert: false,
      cursor: 'move',
      axis: 'y',
      handle: '.move-options-handler',
      placeholder: 'widget-placeholder',
      update: function update(e) {
        var $field = $(e.target).closest('.wcapf-form-field');
        triggerNumberManualOptionsChange($field);
      }
    }).disableSelection();
  } // Sort Number Manual Options


  initSortableForNumberManualOptions($searchForm.find('.number-manual-options-table .manual-options-table-body-rows'));
  $searchForm.on('field_added', function (e, ui) {
    // Init Sortable for the number manual options.
    initSortableForNumberManualOptions($(ui.item.find('.manual-options-table-body-rows')));
  });

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
      var $getOptions = $field.find('.number-get-options');
      var $autoOptions = $field.find('.number-automatic-options');
      var $manualOptionsTable = $field.find('.number-manual-options-table');
      var $elm = $field.find(handler);
      var displayType = $elm.val();

      if ('range_slider' === displayType || 'range_number' === displayType) {
        $getOptions.hide();
        $manualOptionsTable.addClass('force-hide');
        $autoOptions.addClass('force-show');
      } else {
        $getOptions.show();
        $manualOptionsTable.removeClass('force-hide');
        $autoOptions.removeClass('force-show');
      }
    }
  });

  function toggleNumberMinValueField($elm) {
    var $field = $elm.closest('.wcapf-form-field');
    var $textField = $field.find('.wcapf-form-sub-field-min_value input[type="text"]');

    if ($elm.is(':checked')) {
      $textField.attr('disabled', 'disabled');
    } else {
      $textField.removeAttr('disabled');
    }
  }

  $searchForm.find('.wcapf-form-sub-field-min_value_auto_detect input[type="checkbox"]').each(function () {
    var $this = $(this);
    toggleNumberMinValueField($this);
  });
  $searchForm.on('click', '.wcapf-form-sub-field-min_value_auto_detect input[type="checkbox"]', function () {
    var $this = $(this);
    toggleNumberMinValueField($this);
  });

  function toggleNumberMaxValueField($elm) {
    var $field = $elm.closest('.wcapf-form-field');
    var $textField = $field.find('.wcapf-form-sub-field-max_value input[type="text"]');

    if ($elm.is(':checked')) {
      $textField.attr('disabled', 'disabled');
    } else {
      $textField.removeAttr('disabled');
    }
  }

  $searchForm.find('.wcapf-form-sub-field-max_value_auto_detect input[type="checkbox"]').each(function () {
    var $this = $(this);
    toggleNumberMaxValueField($this);
  });
  $searchForm.on('click', '.wcapf-form-sub-field-max_value_auto_detect input[type="checkbox"]', function () {
    var $this = $(this);
    toggleNumberMaxValueField($this);
  }); // Toggle soft limit fields when number display type is changed.

  $searchForm.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-number_display_type select' === handler) {
      var $softLimitFields = $field.find('.soft-limit-fields');
      var $valueTypeField = $field.find('.wcapf-form-sub-field-value_type select');
      var valueType = $valueTypeField.val();
      var displayTypes = ['range_checkbox', 'range_radio', 'range_select', 'range_multiselect'];

      if ($valueTypeField.length) {
        if ('number' === valueType) {
          if (displayTypes.includes(value)) {
            $softLimitFields.show();
          } else {
            $softLimitFields.hide();
          }
        }
      } else {
        if (displayTypes.includes(value)) {
          $softLimitFields.show();
        } else {
          $softLimitFields.hide();
        }
      }
    }
  }); // Toggle soft limit fields when value type is changed.

  $searchForm.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-value_type select' === handler) {
      var $softLimitFields = $field.find('.soft-limit-fields');
      var $displayTypeField = $field.find('.wcapf-form-sub-field-number_display_type select');
      var displayType = $displayTypeField.val();
      var displayTypes = ['range_checkbox', 'range_radio', 'range_select', 'range_multiselect'];

      if ('number' === value) {
        if (displayTypes.includes(displayType)) {
          $softLimitFields.show();
        } else {
          $softLimitFields.hide();
        }
      } else if ('text' === value) {
        $softLimitFields.show();
      } else if ('date' === value) {
        $softLimitFields.hide();
      }
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
    }, {
      'selector': '.input-type-date-fields',
      'value': ['date']
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
      'selector': '.wcapf-form-sub-field-number_range_query_type',
      'value': ['range_checkbox', 'range_multiselect']
    }, {
      'selector': '.wcapf-form-sub-field-number_range_select_all_items_label',
      'value': ['range_radio', 'range_select']
    }, {
      'selector': '.wcapf-form-sub-field-number_range_use_chosen',
      'value': ['range_select', 'range_multiselect']
    }, {
      'selector': '.wcapf-form-sub-field-number_range_show_count',
      'value': ['range_checkbox', 'range_radio', 'range_select', 'range_multiselect']
    }, {
      'selector': '.wcapf-form-sub-field-number_range_hide_empty',
      'value': ['range_checkbox', 'range_radio', 'range_select', 'range_multiselect']
    }, {
      'selector': '.number-decimal-fields',
      'value': ['range_slider', 'range_checkbox', 'range_radio', 'range_select', 'range_multiselect']
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
    'handler': '.wcapf-form-sub-field-date_input_type select',
    'handlerType': 'select',
    'event': 'change',
    'dependant': [{
      'selector': '.date-to-ui-options',
      'value': ['range_date']
    }]
  }, {
    'handler': '.wcapf-form-sub-field-limit_terms select',
    'handlerType': 'select',
    'event': 'change',
    'dependant': [{
      'selector': '.wcapf-form-sub-field-parent_term',
      'value': ['child']
    }, {
      'selector': '.wcapf-form-sub-field-limit_terms_by_id',
      'value': ['include', 'exclude']
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
    'handler': '.wcapf-form-sub-field-custom-taxonomy select',
    'handlerType': 'select',
    'event': 'change'
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBvc3QtbWV0YS1vcHRpb25zLmpzIiwic2VhcmNoLWZvcm0tZmllbGQuanMiLCJzZWFyY2gtZm9ybS5qcyJdLCJuYW1lcyI6WyJqUXVlcnkiLCJkb2N1bWVudCIsInJlYWR5IiwiJCIsIiRzZWFyY2hGb3JtIiwib24iLCJlIiwiaGFuZGxlciIsInZhbHVlIiwiJGZpZWxkIiwicGFyYW1zIiwid2luZG93IiwiaGllcmFyY2hpY2FsRGF0YSIsImlzSGllcmFyY2hpY2FsIiwiJGRlcGVuZGFudEZpZWxkcyIsImZpbmQiLCJzaG93IiwiaGlkZSIsImluaXRTb3J0YWJsZUZvck1hbnVhbE9wdGlvbnMiLCIkc2VsZWN0b3IiLCJzb3J0YWJsZSIsIm9wYWNpdHkiLCJyZXZlcnQiLCJjdXJzb3IiLCJheGlzIiwiaGFuZGxlIiwicGxhY2Vob2xkZXIiLCJ1cGRhdGUiLCJ0YXJnZXQiLCJjbG9zZXN0IiwidHJpZ2dlck1hbnVhbE9wdGlvbnNDaGFuZ2UiLCJkaXNhYmxlU2VsZWN0aW9uIiwidWkiLCJpdGVtIiwidHJpZ2dlclJlbW92ZU9wdGlvbiIsIiRvcHRpb25zVGFibGUiLCJ0YWJsZVJvd3MiLCJjaGlsZHJlbiIsImxlbmd0aCIsInJlbW92ZUNsYXNzIiwiJGl0ZW0iLCJyZW1vdmUiLCJlbXB0eSIsImZpZWxkVHlwZSIsInRlbXBsYXRlIiwid3AiLCJyZW5kZXJlZCIsImxhYmVsIiwiJHdyYXBwZXIiLCIkcm93cyIsImFwcGVuZCIsImhhc0NsYXNzIiwiYWRkQ2xhc3MiLCIkcG9zdE1ldGFPcHRpb25zTW9kYWwiLCIkbm9LZXlGb3VuZE1lc3NhZ2UiLCIkcG9zdE1ldGFNb2RhbExvYWRlciIsIiRwb3N0TWV0YU9wdGlvbnMiLCIkcG9zdE1ldGFNb2RhbEZvb3RlciIsInBvc3RNZXRhT3B0aW9uc01vZGFsSW5zdGFuY2UiLCJyZW1vZGFsIiwiaGFzaFRyYWNraW5nIiwiJHBvc3RNZXRhRmllbGQiLCJyZXNldFBvc3RNZXRhTW9kYWwiLCJodG1sIiwicHJvcCIsIiRpbnB1dE1ldGFLZXkiLCJtZXRhS2V5IiwidmFsIiwib3BlbiIsIm9rQ2FsbGJhY2siLCJyZXNwb25zZSIsImVyckNhbGxiYWNrIiwibWVzc2FnZSIsImNvbnNvbGUiLCJsb2ciLCJmb3JtRGF0YSIsImtleSIsImFjdGlvbiIsImFqYXgiLCJwb3N0IiwiZG9uZSIsImZhaWwiLCIkdmFsdWVIb2xkZXIiLCJfcm93cyIsImVhY2giLCJpIiwiX2l0ZW0iLCJwdXNoIiwicmF3VmFsdWVzIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiSlNPTiIsInN0cmluZ2lmeSIsIiRvcHRpb25zIiwiaXNSZXBsYWNlIiwicm93cyIsImlzIiwiaW5wdXQiLCIkaW5wdXQiLCJjbG9zZSIsIiRzZWxlY3RFbG0iLCJvcmRlckJ5IiwiZGVwZW5kYW50T3B0aW9ucyIsImF0dHIiLCJjaGFuZ2UiLCJyZW1vdmVBdHRyIiwiZGlzYWJsZU9yZGVyQnlPcHRpb25zIiwiJGVsbSIsIiRvcmRlckRpcmVjdGlvbkZpZWxkIiwiJG9yZGVyVHlwZUZpZWxkIiwiJHRoaXMiLCJpbml0U29ydGFibGVGb3JOdW1iZXJNYW51YWxPcHRpb25zIiwidHJpZ2dlck51bWJlck1hbnVhbE9wdGlvbnNDaGFuZ2UiLCJ0cmlnZ2VyUmVtb3ZlTnVtYmVyT3B0aW9uIiwibWluX3ZhbHVlIiwibWF4X3ZhbHVlIiwiJGdldE9wdGlvbnMiLCIkYXV0b09wdGlvbnMiLCIkbWFudWFsT3B0aW9uc1RhYmxlIiwiZGlzcGxheVR5cGUiLCJ0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkIiwiJHRleHRGaWVsZCIsInRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQiLCIkc29mdExpbWl0RmllbGRzIiwiJHZhbHVlVHlwZUZpZWxkIiwidmFsdWVUeXBlIiwiZGlzcGxheVR5cGVzIiwiaW5jbHVkZXMiLCIkZGlzcGxheVR5cGVGaWVsZCIsImRlcGVuZGFudERhdGEiLCJfdHJpZ2dlcklucHV0VHlwZVRleHREaXNwbGF5VHlwZUNoYW5nZSIsIiRub1Jlc3VsdHMiLCIkYWxsSXRlbXNMYWJlbCIsInVzZUNob3NlbiIsIl90cmlnZ2VySW5wdXRUeXBlTnVtYmVyRGlzcGxheVR5cGVDaGFuZ2UiLCJfdHJpZ2dlcklucHV0VHlwZVRleHRVc2VTZWxlY3RDaGFuZ2UiLCJfdHJpZ2dlcklucHV0VHlwZU51bWJlclVzZVNlbGVjdENoYW5nZSIsIl9oYW5kbGVUb2dnbGVSZXF1ZXN0IiwiZGF0YSIsImN1cnJlbnRTZWxlY3RvciIsImhhbmRsZXJUeXBlIiwiZGVwZW5kYW50IiwiX3ZhbHVlIiwiaWQiLCJkIiwidmFsaWRWYWx1ZXMiLCJ0cmlnZ2VyIiwiaGFuZGxlVG9nZ2xlUmVxdWVzdCIsIiRoYW5kbGVyIiwiX3RoaXMiLCJzZXR1cFNlYXJjaEZvcm0iLCJpbml0YWwiLCJldmVudCIsInRvdGFsRmllbGRJbnN0YW5jZXMiLCJzZWFyY2hGb3JtIiwicmVtb3ZlUGxhY2Vob2xkZXIiLCJ1bmlxdWVJZCIsImVsZW1lbnRzIiwiZWxlbWVudCIsIm9sZFZhbHVlIiwibmV3VmFsdWUiLCJyZXBsYWNlIiwiaW5zZXJ0RmllbGRTdWJGaWVsZHMiLCJ0eXBlIiwicGFyc2VJbnQiLCJ3cmFwcGVyIiwicHJlcGVuZCIsInVwZGF0ZUZpZWxkc1Bvc2l0aW9uIiwiaW5wdXRzIiwibmJFbGVtcyIsImlkeCIsIm1ha2VGaWVsZFJlYWR5IiwidG9nZ2xlQnRuIiwiaWRlbnRpZmllciIsImNvbnRhaW5lciIsImNhbmNlbCIsIml0ZW1zIiwiY29ubmVjdFdpdGgiLCJzdG9wIiwic3RhcnQiLCJhcHBlbmRUbyIsInBhcmVudCIsIm9uRHJhZ1N0YXJ0Iiwib25EcmFnU3RvcCIsImRyYWdnYWJsZSIsImNvbm5lY3RUb1NvcnRhYmxlIiwiaGVscGVyIiwidG9nZ2xlRmllbGQiLCJ3aWRnZXQiLCJpbnNpZGUiLCJpc0V4cGFuZCIsInRvZ2dsZUV4cGFuZCIsInNsaWRlVG9nZ2xlIiwidG9nZ2xlQ2xhc3MiLCJmb2N1c0ZpZWxkIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJmb2N1cyIsInJlbW92ZUZpZWxkIiwic2xpZGVVcCIsImluaXRpYWxGb3JtU3RhdGUiLCJzZXJpYWxpemVBcnJheSIsInNob3dNZXNzYWdlIiwic2xpZGVEb3duIiwic2V0VGltZW91dCIsInNhdmVGb3JtIiwiYnV0dG9uIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUEsTUFBTSxDQUFFQyxRQUFGLENBQU4sQ0FBbUJDLEtBQW5CLENBQTBCLFVBQVVDLENBQVYsRUFBYztBQUV2QyxNQUFNQyxXQUFXLEdBQUdELENBQUMsQ0FBRSxjQUFGLENBQXJCO0FBRUFDLEVBQUFBLFdBQVcsQ0FBQ0MsRUFBWixDQUFnQixzQkFBaEIsRUFBd0MsVUFBVUMsQ0FBVixFQUFhQyxPQUFiLEVBQXNCQyxLQUF0QixFQUE2QkMsTUFBN0IsRUFBc0M7QUFDN0UsUUFBSyxtREFBbURGLE9BQXhELEVBQWtFO0FBQ2pFLFVBQU1HLE1BQU0sR0FBYUMsTUFBTSxDQUFFLG9CQUFGLENBQS9CO0FBQ0EsVUFBTUMsZ0JBQWdCLEdBQUdGLE1BQU0sQ0FBRSw0QkFBRixDQUEvQjs7QUFFQSxVQUFLLENBQUVFLGdCQUFQLEVBQTBCO0FBQ3pCO0FBQ0E7O0FBRUQsVUFBTUMsY0FBYyxHQUFLRCxnQkFBZ0IsQ0FBRUosS0FBRixDQUF6QztBQUNBLFVBQU1NLGdCQUFnQixHQUFHTCxNQUFNLENBQUNNLElBQVAsQ0FDeEIsOEVBRHdCLENBQXpCOztBQUlBLFVBQUtGLGNBQUwsRUFBc0I7QUFDckJDLFFBQUFBLGdCQUFnQixDQUFDRSxJQUFqQjtBQUNBLE9BRkQsTUFFTztBQUNORixRQUFBQSxnQkFBZ0IsQ0FBQ0csSUFBakI7QUFDQTtBQUNEO0FBQ0QsR0FwQkQ7O0FBc0JBLFdBQVNDLDRCQUFULENBQXVDQyxTQUF2QyxFQUFtRDtBQUNsREEsSUFBQUEsU0FBUyxDQUFDQyxRQUFWLENBQW9CO0FBQ25CQyxNQUFBQSxPQUFPLEVBQUUsR0FEVTtBQUVuQkMsTUFBQUEsTUFBTSxFQUFFLEtBRlc7QUFHbkJDLE1BQUFBLE1BQU0sRUFB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QUFxQkcsT0FBckIsRUFBK0I7QUFDOUJxSSxJQUFBQSxNQUFNLENBQUNyRyxVQUFQLENBQW1CLFVBQW5CLEVBRDhCLENBRzlCOztBQUNBK0YsSUFBQUEsZ0JBQWdCLEdBQUc1SCxRQUFuQjtBQUVBOEgsSUFBQUEsV0FBVyxDQUFFakksT0FBRixDQUFYO0FBQ0E7O0FBRUQsV0FBU0QsV0FBVCxDQUFzQkMsT0FBdEIsRUFBZ0M7QUFDL0JxSSxJQUFBQSxNQUFNLENBQUNyRyxVQUFQLENBQW1CLFVBQW5CO0FBQ0FpRyxJQUFBQSxXQUFXLENBQUVqSSxPQUFGLEVBQVcsT0FBWCxDQUFYO0FBQ0EsR0FsQmtCLENBb0JuQjs7O0FBQ0EzQixFQUFBQSxFQUFFLENBQUNpQyxJQUFILENBQVFDLElBQVIsQ0FBY0osUUFBZCxFQUF5QkssSUFBekIsQ0FBK0JYLFVBQS9CLEVBQTRDWSxJQUE1QyxDQUFrRFYsV0FBbEQ7QUFDQTs7QUFFRHZFLE1BQU0sQ0FBRSxzQkFBRixDQUFOLENBQWlDSyxFQUFqQyxDQUFxQyxPQUFyQyxFQUE4QyxRQUE5QyxFQUF3RHVNLFFBQXhEO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJ3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLWFkbWluLXNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSBwb3N0IG1ldGEgZmllbGQuXG4gKlxuICogQHNpbmNlICAgICAgMS4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXItcHJvXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLXByby9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgJHNlYXJjaEZvcm0gPSAkKCAnI3NlYXJjaC1mb3JtJyApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtY3VzdG9tLXRheG9ub215IHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCBwYXJhbXMgICAgICAgICAgID0gd2luZG93WyAnd2NhcGZfYWRtaW5fcGFyYW1zJyBdO1xuXHRcdFx0Y29uc3QgaGllcmFyY2hpY2FsRGF0YSA9IHBhcmFtc1sgJ3RheG9ub215X2hpZXJhcmNoaWNhbF9kYXRhJyBdO1xuXG5cdFx0XHRpZiAoICEgaGllcmFyY2hpY2FsRGF0YSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBpc0hpZXJhcmNoaWNhbCAgID0gaGllcmFyY2hpY2FsRGF0YVsgdmFsdWUgXTtcblx0XHRcdGNvbnN0ICRkZXBlbmRhbnRGaWVsZHMgPSAkZmllbGQuZmluZChcblx0XHRcdFx0Jy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1oaWVyYXJjaGljYWwsIC53Y2FwZi1mb3JtLXN1Yi1maWVsZC1zaG93X2NoaWxkcmVuX29ubHknXG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAoIGlzSGllcmFyY2hpY2FsICkge1xuXHRcdFx0XHQkZGVwZW5kYW50RmllbGRzLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRkZXBlbmRhbnRGaWVsZHMuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdGZ1bmN0aW9uIGluaXRTb3J0YWJsZUZvck1hbnVhbE9wdGlvbnMoICRzZWxlY3RvciApIHtcblx0XHQkc2VsZWN0b3Iuc29ydGFibGUoIHtcblx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdHJldmVydDogZmFsc2UsXG5cdFx0XHRjdXJzb3I6ICdtb3ZlJyxcblx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdGhhbmRsZTogJy5tb3ZlLW9wdGlvbnMtaGFuZGxlcicsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHR1cGRhdGU6IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBlLnRhcmdldCApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdFx0XHR0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdFx0XHR9XG5cdFx0fSApLmRpc2FibGVTZWxlY3Rpb24oKTtcblx0fVxuXG5cdC8vIFNvcnQgTWFudWFsIE9wdGlvbnNcblx0aW5pdFNvcnRhYmxlRm9yTWFudWFsT3B0aW9ucyggJHNlYXJjaEZvcm0uZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZSAubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCBlLCB1aSApIHtcblx0XHQvLyBJbml0IFNvcnRhYmxlIGZvciB0aGUgbWFudWFsIG9wdGlvbnMuXG5cdFx0aW5pdFNvcnRhYmxlRm9yTWFudWFsT3B0aW9ucyggJCggdWkuaXRlbS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKSApICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0IHRhYmxlUm93cyAgICAgPSAkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApLmNoaWxkcmVuKCk7XG5cblx0XHRpZiAoIDIgPiB0YWJsZVJvd3MubGVuZ3RoICkge1xuXHRcdFx0JG9wdGlvbnNUYWJsZS5yZW1vdmVDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJlbW92ZSBTaW5nbGUgT3B0aW9uXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLnJlbW92ZS1vcHRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkaXRlbSAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5pdGVtJyApO1xuXHRcdGNvbnN0ICRmaWVsZCA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApO1xuXG5cdFx0JGl0ZW0ucmVtb3ZlKCk7XG5cblx0XHR0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBDbGVhciBBbGwgT3B0aW9uc1xuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5jbGVhci1hbGwtb3B0aW9ucycsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblxuXHRcdCRvcHRpb25zVGFibGUuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkuZW1wdHkoKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApO1xuXG5cdFx0dHJpZ2dlck1hbnVhbE9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQWRkIE5ldyBPcHRpb25cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcuYWRkLW9wdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1wb3N0LW1ldGEtb3B0aW9uJztcblxuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgZmllbGRUeXBlICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCB7IHZhbHVlOiAnJywgbGFiZWw6ICcnIH0gKTtcblx0XHRjb25zdCAkd3JhcHBlciA9ICRmaWVsZC5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0ICRyb3dzICAgID0gJHdyYXBwZXIuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICk7XG5cblx0XHQkcm93cy5hcHBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHRpZiAoICEgJHdyYXBwZXIuaGFzQ2xhc3MoICdoYXMtb3B0aW9ucycgKSApIHtcblx0XHRcdCR3cmFwcGVyLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0Y29uc3QgJHBvc3RNZXRhT3B0aW9uc01vZGFsID0gJCggJy5wb3N0LW1ldGEtb3B0aW9ucy1tb2RhbCcgKTtcblx0Y29uc3QgJG5vS2V5Rm91bmRNZXNzYWdlICAgID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLmZpbmQoICcubm8ta2V5LWZvdW5kLW1lc3NhZ2UnICk7XG5cdGNvbnN0ICRwb3N0TWV0YU1vZGFsTG9hZGVyICA9ICRwb3N0TWV0YU9wdGlvbnNNb2RhbC5maW5kKCAnLnBvc3QtbWV0YS1vcHRpb25zLWxvYWRlcicgKTtcblx0Y29uc3QgJHBvc3RNZXRhT3B0aW9ucyAgICAgID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLmZpbmQoICcucG9zdC1tZXRhLW9wdGlvbnMnICk7XG5cdGNvbnN0ICRwb3N0TWV0YU1vZGFsRm9vdGVyICA9ICRwb3N0TWV0YU9wdGlvbnNNb2RhbC5maW5kKCAnLndjYXBmLW1vZGFsLWZvb3RlcicgKTtcblxuXHRjb25zdCBwb3N0TWV0YU9wdGlvbnNNb2RhbEluc3RhbmNlID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLnJlbW9kYWwoIHtcblx0XHRoYXNoVHJhY2tpbmc6IGZhbHNlLFxuXHR9ICk7XG5cblx0bGV0ICRwb3N0TWV0YUZpZWxkID0gbnVsbDtcblxuXHRmdW5jdGlvbiByZXNldFBvc3RNZXRhTW9kYWwoKSB7XG5cdFx0JHBvc3RNZXRhT3B0aW9ucy5odG1sKCAnJyApO1xuXHRcdCRwb3N0TWV0YU1vZGFsTG9hZGVyLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdCRub0tleUZvdW5kTWVzc2FnZS5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHQkcG9zdE1ldGFNb2RhbEZvb3Rlci5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHQkcG9zdE1ldGFPcHRpb25zTW9kYWwuZmluZCggJy5yZXBsYWNlLWN1cnJlbnQtb3B0aW9ucycgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdH1cblxuXHQvLyBCcm93c2UgVmFsdWVzXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmJyb3dzZS12YWx1ZXMnLCBmdW5jdGlvbigpIHtcblx0XHRyZXNldFBvc3RNZXRhTW9kYWwoKTtcblxuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICRpbnB1dE1ldGFLZXkgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tZXRhX2tleSBzZWxlY3QnICk7XG5cdFx0Y29uc3QgbWV0YUtleSAgICAgICA9ICRpbnB1dE1ldGFLZXkudmFsKCk7XG5cblx0XHRpZiAoICEgbWV0YUtleSApIHtcblx0XHRcdCRub0tleUZvdW5kTWVzc2FnZS5hZGRDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JG5vS2V5Rm91bmRNZXNzYWdlLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdH1cblxuXHRcdHBvc3RNZXRhT3B0aW9uc01vZGFsSW5zdGFuY2Uub3BlbigpO1xuXHRcdCRwb3N0TWV0YUZpZWxkID0gJGZpZWxkO1xuXG5cdFx0aWYgKCAhIG1ldGFLZXkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gU2hvdyB0aGUgbG9hZGluZyBhbmltYXRpb24uXG5cdFx0JHBvc3RNZXRhTW9kYWxMb2FkZXIuYWRkQ2xhc3MoICdhY3RpdmUnICk7XG5cblx0XHQvKipcblx0XHQgKiBBamF4J3Mgc3VjY2VzcyBmdW5jdGlvbi5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSByZXNwb25zZVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIG9rQ2FsbGJhY2soIHJlc3BvbnNlICkge1xuXHRcdFx0Ly8gSGlkZSB0aGUgbG9hZGluZyBhbmltYXRpb24uXG5cdFx0XHQkcG9zdE1ldGFNb2RhbExvYWRlci5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHRcdCRwb3N0TWV0YU1vZGFsRm9vdGVyLmFkZENsYXNzKCAnYWN0aXZlJyApO1xuXG5cdFx0XHQkcG9zdE1ldGFPcHRpb25zLmh0bWwoIHJlc3BvbnNlICk7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogQWpheCdzIGVycm9yIGZ1bmN0aW9uLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIG1lc3NhZ2Vcblx0XHQgKi9cblx0XHRmdW5jdGlvbiBlcnJDYWxsYmFjayggbWVzc2FnZSApIHtcblx0XHRcdGNvbnNvbGUubG9nKCAnZXJyb3InLCBtZXNzYWdlICk7XG5cblx0XHRcdC8vIEhpZGUgdGhlIGxvYWRpbmcgYW5pbWF0aW9uLlxuXHRcdFx0JHBvc3RNZXRhTW9kYWxMb2FkZXIucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgZm9ybURhdGEgPSB7XG5cdFx0XHRrZXk6IG1ldGFLZXksXG5cdFx0XHRhY3Rpb246ICd3Y2FwZl9nZXRfbWV0YV9vcHRpb25zJyxcblx0XHR9XG5cblx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTkxODEyNTJcblx0XHR3cC5hamF4LnBvc3QoIGZvcm1EYXRhICkuZG9uZSggb2tDYWxsYmFjayApLmZhaWwoIGVyckNhbGxiYWNrICk7XG5cdH0gKTtcblxuXHQvKipcblx0ICogUmVzZXQgdGhlIHBvc3QgbWV0YSBvcHRpb24ncyBtb2RhbCB3aGVuIG1vZGFsIGdldHMgY2xvc2VkLlxuXHQgKi9cblx0JCggZG9jdW1lbnQgKS5vbiggJ2Nsb3NlZCcsICRwb3N0TWV0YU9wdGlvbnNNb2RhbCwgZnVuY3Rpb24oKSB7XG5cdFx0cmVzZXRQb3N0TWV0YU1vZGFsKCk7XG5cdFx0JHBvc3RNZXRhRmllbGQgPSBudWxsO1xuXHR9ICk7XG5cblx0Ly8gVW5zZWxlY3QgYWxsIHZhbHVlcy5cblx0JHBvc3RNZXRhT3B0aW9uc01vZGFsLm9uKCAnY2xpY2snLCAnLnNlbGVjdC1ub25lJywgZnVuY3Rpb24oKSB7XG5cdFx0JHBvc3RNZXRhT3B0aW9ucy5maW5kKCAnW3R5cGU9XCJjaGVja2JveFwiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdH0gKTtcblxuXHQvLyBTZWxlY3QgYWxsIHZhbHVlcy5cblx0JHBvc3RNZXRhT3B0aW9uc01vZGFsLm9uKCAnY2xpY2snLCAnLnNlbGVjdC1hbGwnLCBmdW5jdGlvbigpIHtcblx0XHQkcG9zdE1ldGFPcHRpb25zLmZpbmQoICdbdHlwZT1cImNoZWNrYm94XCJdJyApLnByb3AoICdjaGVja2VkJywgdHJ1ZSApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gdHJpZ2dlck1hbnVhbE9wdGlvbnNDaGFuZ2UoICRwb3N0TWV0YUZpZWxkICkge1xuXHRcdGNvbnN0ICR2YWx1ZUhvbGRlciAgPSAkcG9zdE1ldGFGaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1hbnVhbF9vcHRpb25zIGlucHV0JyApO1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkcG9zdE1ldGFGaWVsZC5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0ICRyb3dzICAgICAgICAgPSAkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApO1xuXHRcdGNvbnN0IF9yb3dzICAgICAgICAgPSBbXTtcblxuXHRcdCRyb3dzLmZpbmQoICcuaXRlbScgKS5lYWNoKCBmdW5jdGlvbiggaSwgX2l0ZW0gKSB7XG5cdFx0XHRjb25zdCAkaXRlbSA9ICQoIF9pdGVtICk7XG5cdFx0XHRjb25zdCB2YWx1ZSA9ICRpdGVtLmZpbmQoICcub3B0aW9uX3ZhbHVlJyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgbGFiZWwgPSAkaXRlbS5maW5kKCAnLm9wdGlvbl9sYWJlbCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCB2YWx1ZSAmJiBsYWJlbCApIHtcblx0XHRcdFx0X3Jvd3MucHVzaCggWyB2YWx1ZSwgbGFiZWwgXSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGNvbnN0IHJhd1ZhbHVlcyA9IGVuY29kZVVSSUNvbXBvbmVudCggSlNPTi5zdHJpbmdpZnkoIF9yb3dzICkgKTtcblx0XHQkdmFsdWVIb2xkZXIudmFsKCByYXdWYWx1ZXMgKTtcblx0fVxuXG5cdC8vIEFkZCBzZWxlY3RlZCBvcHRpb25zLlxuXHQkcG9zdE1ldGFPcHRpb25zTW9kYWwub24oICdjbGljaycsICcuYWRkLW9wdGlvbnMnLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkb3B0aW9ucyA9ICRwb3N0TWV0YU9wdGlvbnMuZmluZCggJ1t0eXBlPVwiY2hlY2tib3hcIl0nICk7XG5cdFx0bGV0IGlzUmVwbGFjZSAgPSBmYWxzZTtcblx0XHRsZXQgcm93cyAgICAgICA9ICcnO1xuXG5cdFx0aWYgKCAkcG9zdE1ldGFNb2RhbEZvb3Rlci5maW5kKCAnLnJlcGxhY2UtY3VycmVudC1vcHRpb25zJyApLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRpc1JlcGxhY2UgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICggJG9wdGlvbnMgKSB7XG5cdFx0XHRjb25zdCBmaWVsZFR5cGUgPSAnd2NhcGYtcG9zdC1tZXRhLW9wdGlvbic7XG5cblx0XHRcdCQuZWFjaCggJG9wdGlvbnMsIGZ1bmN0aW9uKCBpLCBpbnB1dCApIHtcblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggaW5wdXQgKTtcblx0XHRcdFx0Y29uc3QgdmFsdWUgID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdGlmICggJGlucHV0LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRcdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggZmllbGRUeXBlICk7XG5cdFx0XHRcdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSggeyB2YWx1ZSwgbGFiZWw6IHZhbHVlIH0gKTtcblxuXHRcdFx0XHRcdHJvd3MgKz0gcmVuZGVyZWQ7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpZiAoIHJvd3MgKSB7XG5cdFx0XHRjb25zdCAkd3JhcHBlciA9ICRwb3N0TWV0YUZpZWxkLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0XHRjb25zdCAkcm93cyAgICA9ICR3cmFwcGVyLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApO1xuXG5cdFx0XHRpZiAoIGlzUmVwbGFjZSApIHtcblx0XHRcdFx0JHJvd3MuaHRtbCggcm93cyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHJvd3MuYXBwZW5kKCByb3dzICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISAkd3JhcHBlci5oYXNDbGFzcyggJ2hhcy1vcHRpb25zJyApICkge1xuXHRcdFx0XHQkd3JhcHBlci5hZGRDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdFx0fVxuXG5cdFx0XHR0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJHBvc3RNZXRhRmllbGQgKTtcblx0XHR9XG5cblx0XHRwb3N0TWV0YU9wdGlvbnNNb2RhbEluc3RhbmNlLmNsb3NlKCk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWdldF9vcHRpb25zIGlucHV0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRzZWxlY3RFbG0gICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1vcHRpb25zX29yZGVyX2J5IHNlbGVjdCcgKTtcblx0XHRcdGNvbnN0IG9yZGVyQnkgICAgICAgICAgPSAkc2VsZWN0RWxtLnZhbCgpO1xuXHRcdFx0Y29uc3QgZGVwZW5kYW50T3B0aW9ucyA9ICdvcHRpb25bdmFsdWU9XCJsYWJlbFwiXSc7XG5cblx0XHRcdGlmICggJ2F1dG9tYXRpY2FsbHknID09PSB2YWx1ZSApIHtcblx0XHRcdFx0JHNlbGVjdEVsbS5jaGlsZHJlbiggZGVwZW5kYW50T3B0aW9ucyApLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblxuXHRcdFx0XHRpZiAoICdsYWJlbCcgPT09IG9yZGVyQnkgKSB7XG5cdFx0XHRcdFx0JHNlbGVjdEVsbS5wcm9wKCAnc2VsZWN0ZWRJbmRleCcsIDEgKS5jaGFuZ2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHNlbGVjdEVsbS5jaGlsZHJlbiggZGVwZW5kYW50T3B0aW9ucyApLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHRmdW5jdGlvbiBkaXNhYmxlT3JkZXJCeU9wdGlvbnMoICRlbG0gKSB7XG5cdFx0Y29uc3QgdmFsdWUgICAgICAgICAgICAgICAgPSAkZWxtLnZhbCgpO1xuXHRcdGNvbnN0ICR3cmFwcGVyICAgICAgICAgICAgID0gJGVsbS5jbG9zZXN0KCAnLndjYXBmLXBvc3QtbWV0YS1vcmRlci1vcHRpb25zLWZpZWxkJyApO1xuXHRcdGNvbnN0ICRvcmRlckRpcmVjdGlvbkZpZWxkID0gJHdyYXBwZXIuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1vcHRpb25zX29yZGVyX2RpciBzZWxlY3QnICk7XG5cdFx0Y29uc3QgJG9yZGVyVHlwZUZpZWxkICAgICAgPSAkd3JhcHBlci5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW9wdGlvbnNfb3JkZXJfdHlwZSBzZWxlY3QnICk7XG5cblx0XHRpZiAoICdub25lJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHQkb3JkZXJEaXJlY3Rpb25GaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0XHQkb3JkZXJUeXBlRmllbGQuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkb3JkZXJEaXJlY3Rpb25GaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0XHQkb3JkZXJUeXBlRmllbGQucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdH1cblx0fVxuXG5cdCRzZWFyY2hGb3JtLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtb3B0aW9uc19vcmRlcl9ieSBzZWxlY3QnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRkaXNhYmxlT3JkZXJCeU9wdGlvbnMoICR0aGlzICk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NoYW5nZScsICcud2NhcGYtZm9ybS1zdWItZmllbGQtb3B0aW9uc19vcmRlcl9ieSBzZWxlY3QnLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdGRpc2FibGVPcmRlckJ5T3B0aW9ucyggJHRoaXMgKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnaW5wdXQnLCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdHRyaWdnZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8qKlxuXHQgKiBWYWx1ZSB0eXBlICdOdW1iZXInXG5cdCAqL1xuXG5cdGZ1bmN0aW9uIGluaXRTb3J0YWJsZUZvck51bWJlck1hbnVhbE9wdGlvbnMoICRzZWxlY3RvciApIHtcblx0XHQkc2VsZWN0b3Iuc29ydGFibGUoIHtcblx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdHJldmVydDogZmFsc2UsXG5cdFx0XHRjdXJzb3I6ICdtb3ZlJyxcblx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdGhhbmRsZTogJy5tb3ZlLW9wdGlvbnMtaGFuZGxlcicsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHR1cGRhdGU6IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBlLnRhcmdldCApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdFx0XHR0cmlnZ2VyTnVtYmVyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdFx0XHR9XG5cdFx0fSApLmRpc2FibGVTZWxlY3Rpb24oKTtcblx0fVxuXG5cdC8vIFNvcnQgTnVtYmVyIE1hbnVhbCBPcHRpb25zXG5cdGluaXRTb3J0YWJsZUZvck51bWJlck1hbnVhbE9wdGlvbnMoICRzZWFyY2hGb3JtLmZpbmQoICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlIC5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkgKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oIGUsIHVpICkge1xuXHRcdC8vIEluaXQgU29ydGFibGUgZm9yIHRoZSBudW1iZXIgbWFudWFsIG9wdGlvbnMuXG5cdFx0aW5pdFNvcnRhYmxlRm9yTnVtYmVyTWFudWFsT3B0aW9ucyggJCggdWkuaXRlbS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKSApICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyUmVtb3ZlTnVtYmVyT3B0aW9uKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblx0XHRjb25zdCB0YWJsZVJvd3MgICAgID0gJG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKS5jaGlsZHJlbigpO1xuXG5cdFx0aWYgKCAyID4gdGFibGVSb3dzLmxlbmd0aCApIHtcblx0XHRcdCRvcHRpb25zVGFibGUucmVtb3ZlQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiB0cmlnZ2VyTnVtYmVyTWFudWFsT3B0aW9uc0NoYW5nZSggJHBvc3RNZXRhRmllbGQgKSB7XG5cdFx0Y29uc3QgJHZhbHVlSG9sZGVyICA9ICRwb3N0TWV0YUZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX21hbnVhbF9vcHRpb25zIGlucHV0JyApO1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkcG9zdE1ldGFGaWVsZC5maW5kKCAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblx0XHRjb25zdCAkcm93cyAgICAgICAgID0gJG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKTtcblx0XHRjb25zdCBfcm93cyAgICAgICAgID0gW107XG5cblx0XHQkcm93cy5maW5kKCAnLml0ZW0nICkuZWFjaCggZnVuY3Rpb24oIGksIF9pdGVtICkge1xuXHRcdFx0Y29uc3QgJGl0ZW0gICAgID0gJCggX2l0ZW0gKTtcblx0XHRcdGNvbnN0IG1pbl92YWx1ZSA9ICRpdGVtLmZpbmQoICcub3B0aW9uX21pbl92YWx1ZScgKS52YWwoKTtcblx0XHRcdGNvbnN0IG1heF92YWx1ZSA9ICRpdGVtLmZpbmQoICcub3B0aW9uX21heF92YWx1ZScgKS52YWwoKTtcblx0XHRcdGNvbnN0IGxhYmVsICAgICA9ICRpdGVtLmZpbmQoICcub3B0aW9uX2xhYmVsJyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoIG1pbl92YWx1ZSAmJiBtYXhfdmFsdWUgJiYgbGFiZWwgKSB7XG5cdFx0XHRcdF9yb3dzLnB1c2goIFsgbWluX3ZhbHVlLCBtYXhfdmFsdWUsIGxhYmVsIF0gKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHRjb25zdCByYXdWYWx1ZXMgPSBlbmNvZGVVUklDb21wb25lbnQoIEpTT04uc3RyaW5naWZ5KCBfcm93cyApICk7XG5cdFx0JHZhbHVlSG9sZGVyLnZhbCggcmF3VmFsdWVzICk7XG5cdH1cblxuXHQvLyBSZW1vdmUgU2luZ2xlIE51bWJlciBPcHRpb25cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcucmVtb3ZlLW51bWJlci1vcHRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkaXRlbSAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5pdGVtJyApO1xuXHRcdGNvbnN0ICRmaWVsZCA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVOdW1iZXJPcHRpb24oICRmaWVsZCApO1xuXG5cdFx0JGl0ZW0ucmVtb3ZlKCk7XG5cblx0XHR0cmlnZ2VyTnVtYmVyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBDbGVhciBBbGwgT3B0aW9uc1xuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5jbGVhci1hbGwtbnVtYmVyLW9wdGlvbnMnLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgICAgICAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXG5cdFx0JG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKS5lbXB0eSgpO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU51bWJlck9wdGlvbiggJGZpZWxkICk7XG5cblx0XHR0cmlnZ2VyTnVtYmVyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBBZGQgTmV3IE9wdGlvblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5hZGQtbnVtYmVyLW9wdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1wb3N0LW1ldGEtdHlwZS1udW1iZXItb3B0aW9uJztcblxuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgZmllbGRUeXBlICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCB7IHZhbHVlOiAnJywgbGFiZWw6ICcnIH0gKTtcblx0XHRjb25zdCAkd3JhcHBlciA9ICRmaWVsZC5maW5kKCAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblx0XHRjb25zdCAkcm93cyAgICA9ICR3cmFwcGVyLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApO1xuXG5cdFx0JHJvd3MuYXBwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0aWYgKCAhICR3cmFwcGVyLmhhc0NsYXNzKCAnaGFzLW9wdGlvbnMnICkgKSB7XG5cdFx0XHQkd3JhcHBlci5hZGRDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnaW5wdXQnLCAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZSBpbnB1dFt0eXBlPVwidGV4dFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHR0cmlnZ2VyTnVtYmVyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRnZXRPcHRpb25zICAgICAgICAgPSAkZmllbGQuZmluZCggJy5udW1iZXItZ2V0LW9wdGlvbnMnICk7XG5cdFx0XHRjb25zdCAkYXV0b09wdGlvbnMgICAgICAgID0gJGZpZWxkLmZpbmQoICcubnVtYmVyLWF1dG9tYXRpYy1vcHRpb25zJyApO1xuXHRcdFx0Y29uc3QgJG1hbnVhbE9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblx0XHRcdGNvbnN0ICRlbG0gICAgICAgICAgICAgICAgPSAkZmllbGQuZmluZCggaGFuZGxlciApO1xuXHRcdFx0Y29uc3QgZGlzcGxheVR5cGUgICAgICAgICA9ICRlbG0udmFsKCk7XG5cblx0XHRcdGlmICggJ3JhbmdlX3NsaWRlcicgPT09IGRpc3BsYXlUeXBlIHx8ICdyYW5nZV9udW1iZXInID09PSBkaXNwbGF5VHlwZSApIHtcblx0XHRcdFx0JGdldE9wdGlvbnMuaGlkZSgpO1xuXHRcdFx0XHQkbWFudWFsT3B0aW9uc1RhYmxlLmFkZENsYXNzKCAnZm9yY2UtaGlkZScgKTtcblx0XHRcdFx0JGF1dG9PcHRpb25zLmFkZENsYXNzKCAnZm9yY2Utc2hvdycgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRnZXRPcHRpb25zLnNob3coKTtcblx0XHRcdFx0JG1hbnVhbE9wdGlvbnNUYWJsZS5yZW1vdmVDbGFzcyggJ2ZvcmNlLWhpZGUnICk7XG5cdFx0XHRcdCRhdXRvT3B0aW9ucy5yZW1vdmVDbGFzcyggJ2ZvcmNlLXNob3cnICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0ZnVuY3Rpb24gdG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJGVsbSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgID0gJGVsbS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJHRleHRGaWVsZCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZSBpbnB1dFt0eXBlPVwidGV4dFwiXScgKTtcblxuXHRcdGlmICggJGVsbS5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0JHRleHRGaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCR0ZXh0RmllbGQucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdH1cblx0fVxuXG5cdCRzZWFyY2hGb3JtLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICR0aGlzICk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHR0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gdG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCggJGVsbSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgID0gJGVsbS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJHRleHRGaWVsZCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZSBpbnB1dFt0eXBlPVwidGV4dFwiXScgKTtcblxuXHRcdGlmICggJGVsbS5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0JHRleHRGaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCR0ZXh0RmllbGQucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdH1cblx0fVxuXG5cdCRzZWFyY2hGb3JtLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICR0aGlzICk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHR0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHR9ICk7XG5cblx0Ly8gVG9nZ2xlIHNvZnQgbGltaXQgZmllbGRzIHdoZW4gbnVtYmVyIGRpc3BsYXkgdHlwZSBpcyBjaGFuZ2VkLlxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRzb2Z0TGltaXRGaWVsZHMgPSAkZmllbGQuZmluZCggJy5zb2Z0LWxpbWl0LWZpZWxkcycgKTtcblx0XHRcdGNvbnN0ICR2YWx1ZVR5cGVGaWVsZCAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV90eXBlIHNlbGVjdCcgKTtcblx0XHRcdGNvbnN0IHZhbHVlVHlwZSAgICAgICAgPSAkdmFsdWVUeXBlRmllbGQudmFsKCk7XG5cdFx0XHRjb25zdCBkaXNwbGF5VHlwZXMgICAgID0gWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JyBdO1xuXG5cdFx0XHRpZiAoICR2YWx1ZVR5cGVGaWVsZC5sZW5ndGggKSB7XG5cdFx0XHRcdGlmICggJ251bWJlcicgPT09IHZhbHVlVHlwZSApIHtcblx0XHRcdFx0XHRpZiAoIGRpc3BsYXlUeXBlcy5pbmNsdWRlcyggdmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdCRzb2Z0TGltaXRGaWVsZHMuc2hvdygpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkc29mdExpbWl0RmllbGRzLmhpZGUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICggZGlzcGxheVR5cGVzLmluY2x1ZGVzKCB2YWx1ZSApICkge1xuXHRcdFx0XHRcdCRzb2Z0TGltaXRGaWVsZHMuc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRzb2Z0TGltaXRGaWVsZHMuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gVG9nZ2xlIHNvZnQgbGltaXQgZmllbGRzIHdoZW4gdmFsdWUgdHlwZSBpcyBjaGFuZ2VkLlxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXZhbHVlX3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRzb2Z0TGltaXRGaWVsZHMgID0gJGZpZWxkLmZpbmQoICcuc29mdC1saW1pdC1maWVsZHMnICk7XG5cdFx0XHRjb25zdCAkZGlzcGxheVR5cGVGaWVsZCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9kaXNwbGF5X3R5cGUgc2VsZWN0JyApO1xuXHRcdFx0Y29uc3QgZGlzcGxheVR5cGUgICAgICAgPSAkZGlzcGxheVR5cGVGaWVsZC52YWwoKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlUeXBlcyAgICAgID0gWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JyBdO1xuXG5cdFx0XHRpZiAoICdudW1iZXInID09PSB2YWx1ZSApIHtcblx0XHRcdFx0aWYgKCBkaXNwbGF5VHlwZXMuaW5jbHVkZXMoIGRpc3BsYXlUeXBlICkgKSB7XG5cdFx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoICd0ZXh0JyA9PT0gdmFsdWUgKSB7XG5cdFx0XHRcdCRzb2Z0TGltaXRGaWVsZHMuc2hvdygpO1xuXHRcdFx0fSBlbHNlIGlmICggJ2RhdGUnID09PSB2YWx1ZSApIHtcblx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIHNlYXJjaCBmb3JtIGZpZWxkLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCAkc2VhcmNoRm9ybSA9ICQoICcjc2VhcmNoLWZvcm0nICk7XG5cblx0Y29uc3QgZGVwZW5kYW50RGF0YSA9IFtcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtdGV4dC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RleHQnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtbnVtYmVyLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbnVtYmVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5pbnB1dC10eXBlLWRhdGUtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdkYXRlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjaGVja2JveCcsICdtdWx0aS1zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFkaW8nLCAnc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdzZWxlY3QnLCAnbXVsdGktc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWdldF9vcHRpb25zIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmNvbHVtbi1ncm91cC1tZXRhX2tleV9tYW51YWxfb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbWFudWFsX2VudHJ5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NsaWRlcl9kaXNwbGF5X3ZhbHVlc19hcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfcXVlcnlfdHlwZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zZWxlY3RfYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zaG93X2NvdW50Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9oaWRlX2VtcHR5Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1kZWNpbWFsLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJywgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3VzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9nZXRfb3B0aW9ucyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItYXV0b21hdGljLW9wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2F1dG9tYXRpY2FsbHknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbWFudWFsX2VudHJ5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kYXRlX2lucHV0X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5kYXRlLXRvLXVpLW9wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2RhdGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWxpbWl0X3Rlcm1zIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtcGFyZW50X3Rlcm0nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NoaWxkJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1saW1pdF90ZXJtc19ieV9pZCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5jbHVkZScsICdleGNsdWRlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1lbmFibGVfc29mdF9saW1pdCBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1zb2Z0X2xpbWl0Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdlbmFibGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWN1c3RvbS10YXhvbm9teSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHR9LFxuXHRdO1xuXG5cdGZ1bmN0aW9uIF90cmlnZ2VySW5wdXRUeXBlVGV4dERpc3BsYXlUeXBlQ2hhbmdlKCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScgKTtcblx0XHRjb25zdCAkYWxsSXRlbXNMYWJlbCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRjb25zdCB1c2VDaG9zZW4gICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnICkuaXMoICc6Y2hlY2tlZCcgKTtcblxuXHRcdGlmICggdXNlQ2hvc2VuICYmICggJ3NlbGVjdCcgPT09IHZhbHVlIHx8ICdtdWx0aS1zZWxlY3QnID09PSB2YWx1ZSApICkge1xuXHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdH1cblxuXHRcdGlmICggKCAncmFkaW8nID09PSB2YWx1ZSB8fCAnc2VsZWN0JyA9PT0gdmFsdWUgKSB8fCAoICdtdWx0aS1zZWxlY3QnID09PSB2YWx1ZSAmJiB1c2VDaG9zZW4gKSApIHtcblx0XHRcdCRhbGxJdGVtc0xhYmVsLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JGFsbEl0ZW1zTGFiZWwuaGlkZSgpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIF90cmlnZ2VySW5wdXRUeXBlTnVtYmVyRGlzcGxheVR5cGVDaGFuZ2UoIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG5vUmVzdWx0cyAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScgKTtcblx0XHRjb25zdCAkYWxsSXRlbXNMYWJlbCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zZWxlY3RfYWxsX2l0ZW1zX2xhYmVsJyApO1xuXHRcdGNvbnN0IHVzZUNob3NlbiAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3VzZV9jaG9zZW4gaW5wdXQnICkuaXMoICc6Y2hlY2tlZCcgKTtcblxuXHRcdGlmICggdXNlQ2hvc2VuICYmICggJ3JhbmdlX3NlbGVjdCcgPT09IHZhbHVlIHx8ICdyYW5nZV9tdWx0aXNlbGVjdCcgPT09IHZhbHVlICkgKSB7XG5cdFx0XHQkbm9SZXN1bHRzLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0fVxuXG5cdFx0aWYgKCAoICdyYW5nZV9yYWRpbycgPT09IHZhbHVlIHx8ICdyYW5nZV9zZWxlY3QnID09PSB2YWx1ZSApIHx8ICggJ3JhbmdlX211bHRpc2VsZWN0JyA9PT0gdmFsdWUgJiYgdXNlQ2hvc2VuICkgKSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBfdHJpZ2dlcklucHV0VHlwZVRleHRVc2VTZWxlY3RDaGFuZ2UoIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG5vUmVzdWx0cyAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyApO1xuXHRcdGNvbnN0IGRpc3BsYXlUeXBlICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgKS52YWwoKTtcblxuXHRcdGlmICggJzEnID09PSB2YWx1ZSAmJiAoICdzZWxlY3QnID09PSBkaXNwbGF5VHlwZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgKSApIHtcblx0XHRcdCRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHR9XG5cblx0XHRpZiAoXG5cdFx0XHQoICcxJyA9PT0gdmFsdWUgJiYgJ211bHRpLXNlbGVjdCcgPT09IGRpc3BsYXlUeXBlIClcblx0XHRcdHx8ICggJ3JhZGlvJyA9PT0gZGlzcGxheVR5cGUgfHwgJ3NlbGVjdCcgPT09IGRpc3BsYXlUeXBlIClcblx0XHQpIHtcblx0XHRcdCRhbGxJdGVtc0xhYmVsLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JGFsbEl0ZW1zTGFiZWwuaGlkZSgpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIF90cmlnZ2VySW5wdXRUeXBlTnVtYmVyVXNlU2VsZWN0Q2hhbmdlKCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2VsZWN0X2FsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRjb25zdCBkaXNwbGF5VHlwZSAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9kaXNwbGF5X3R5cGUgc2VsZWN0JyApLnZhbCgpO1xuXG5cdFx0aWYgKCAnMScgPT09IHZhbHVlICYmICggJ3JhbmdlX3NlbGVjdCcgPT09IGRpc3BsYXlUeXBlIHx8ICdyYW5nZV9tdWx0aXNlbGVjdCcgPT09IGRpc3BsYXlUeXBlICkgKSB7XG5cdFx0XHQkbm9SZXN1bHRzLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0fVxuXG5cdFx0aWYgKFxuXHRcdFx0KCAnMScgPT09IHZhbHVlICYmICdyYW5nZV9tdWx0aXNlbGVjdCcgPT09IGRpc3BsYXlUeXBlIClcblx0XHRcdHx8ICggJ3JhbmdlX3JhZGlvJyA9PT0gZGlzcGxheVR5cGUgfHwgJ3JhbmdlX3NlbGVjdCcgPT09IGRpc3BsYXlUeXBlIClcblx0XHQpIHtcblx0XHRcdCRhbGxJdGVtc0xhYmVsLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JGFsbEl0ZW1zTGFiZWwuaGlkZSgpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIF9oYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBjdXJyZW50U2VsZWN0b3IsIHZhbHVlICkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgID0gY3VycmVudFNlbGVjdG9yLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCBoYW5kbGVyICAgICA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdGNvbnN0IGhhbmRsZXJUeXBlID0gZGF0YVsgJ2hhbmRsZXJUeXBlJyBdO1xuXHRcdGNvbnN0IGRlcGVuZGFudCAgID0gZGF0YVsgJ2RlcGVuZGFudCcgXTtcblxuXHRcdGxldCBfdmFsdWUgPSB2YWx1ZTtcblxuXHRcdGlmICggJ2NoZWNrYm94JyA9PT0gaGFuZGxlclR5cGUgKSB7XG5cdFx0XHRfdmFsdWUgPSBjdXJyZW50U2VsZWN0b3IuaXMoICc6Y2hlY2tlZCcgKSA/ICcxJyA6ICcwJztcblx0XHR9XG5cblx0XHRpZiAoICdyYWRpbycgPT09IGhhbmRsZXJUeXBlICkge1xuXHRcdFx0X3ZhbHVlID0gJGZpZWxkLmZpbmQoIGhhbmRsZXIgKyAnOmNoZWNrZWQnICkudmFsKCk7XG5cdFx0fVxuXG5cdFx0JC5lYWNoKCBkZXBlbmRhbnQsIGZ1bmN0aW9uKCBpZCwgZCApIHtcblx0XHRcdGNvbnN0ICRzZWxlY3RvciAgID0gJGZpZWxkLmZpbmQoIGRbICdzZWxlY3RvcicgXSApO1xuXHRcdFx0Y29uc3QgdmFsaWRWYWx1ZXMgPSBkWyAndmFsdWUnIF07XG5cblx0XHRcdGlmICggdmFsaWRWYWx1ZXMuaW5jbHVkZXMoIF92YWx1ZSApICkge1xuXHRcdFx0XHQkc2VsZWN0b3Iuc2hvdygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHNlbGVjdG9yLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRfdHJpZ2dlcklucHV0VHlwZVRleHREaXNwbGF5VHlwZUNoYW5nZSggX3ZhbHVlLCAkZmllbGQgKTtcblx0XHR9XG5cblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdXNlX2Nob3NlbiBpbnB1dCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRfdHJpZ2dlcklucHV0VHlwZVRleHRVc2VTZWxlY3RDaGFuZ2UoIF92YWx1ZSwgJGZpZWxkICk7XG5cdFx0fVxuXG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdF90cmlnZ2VySW5wdXRUeXBlTnVtYmVyRGlzcGxheVR5cGVDaGFuZ2UoIF92YWx1ZSwgJGZpZWxkICk7XG5cdFx0fVxuXG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuIGlucHV0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdF90cmlnZ2VySW5wdXRUeXBlTnVtYmVyVXNlU2VsZWN0Q2hhbmdlKCBfdmFsdWUsICRmaWVsZCApO1xuXHRcdH1cblxuXHRcdCRzZWFyY2hGb3JtLnRyaWdnZXIoICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIFsgaGFuZGxlciwgX3ZhbHVlLCAkZmllbGQgXSApO1xuXHR9XG5cblx0ZnVuY3Rpb24gaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApIHtcblx0XHRpZiAoIG51bGwgPT09IGN1cnJlbnRTZWxlY3RvciApIHtcblx0XHRcdGNvbnN0IGhhbmRsZXIgID0gZGF0YVsgJ2hhbmRsZXInIF07XG5cdFx0XHRjb25zdCAkaGFuZGxlciA9ICQoIGhhbmRsZXIgKTtcblxuXHRcdFx0JC5lYWNoKCAkaGFuZGxlciwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGNvbnN0IF90aGlzICA9ICQoIHRoaXMgKTtcblx0XHRcdFx0Y29uc3QgX3ZhbHVlID0gX3RoaXMudmFsKCk7XG5cdFx0XHRcdF9oYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBfdGhpcywgX3ZhbHVlICk7XG5cdFx0XHR9ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdF9oYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBjdXJyZW50U2VsZWN0b3IsIHZhbHVlICk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2V0dXBTZWFyY2hGb3JtKCBpbml0YWwgPSBmYWxzZSApIHtcblx0XHQkLmVhY2goIGRlcGVuZGFudERhdGEsIGZ1bmN0aW9uKCBpLCBkYXRhICkge1xuXHRcdFx0Y29uc3QgaGFuZGxlciA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdFx0Y29uc3QgZXZlbnQgICA9IGRhdGFbICdldmVudCcgXTtcblxuXHRcdFx0aGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgbnVsbCwgbnVsbCApO1xuXG5cdFx0XHRpZiAoIGluaXRhbCApIHtcblx0XHRcdFx0JHNlYXJjaEZvcm0ub24oIGV2ZW50LCBoYW5kbGVyLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdFx0Y29uc3QgX3ZhbHVlID0gJCggdGhpcyApLnZhbCgpO1xuXHRcdFx0XHRcdGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIF90aGlzLCBfdmFsdWUgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdHNldHVwU2VhcmNoRm9ybSggdHJ1ZSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbigpIHtcblx0XHQvLyBUb2dnbGUgdGhlIHZpc2liaWxpdHkgb2Ygc3ViZmllbGRzLlxuXHRcdHNldHVwU2VhcmNoRm9ybSgpO1xuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIHNlYXJjaCBmb3JtLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxuY29uc3QgdG90YWxGaWVsZEluc3RhbmNlcyA9IGpRdWVyeSggJyN0b3RhbF9maWVsZF9pbnN0YW5jZXMnICk7XG5cbmNvbnN0IHNlYXJjaEZvcm0gPSBqUXVlcnkoICcjc2VhcmNoLWZvcm0nICk7XG5cbi8qKlxuICogQXNzaWduIGEgdW5pcXVlIGlkIGJ5IHJlcGxhY2luZyB0aGUgcGxhY2Vob2xkZXIgaWQuXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZVBsYWNlaG9sZGVyKCB1bmlxdWVJZCwgZWxlbWVudHMsIGF0dHIgKSB7XG5cdGVsZW1lbnRzLmVhY2goXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCBlbGVtZW50ID0galF1ZXJ5KCB0aGlzICk7XG5cblx0XHRcdGNvbnN0IG9sZFZhbHVlID0gZWxlbWVudC5hdHRyKCBhdHRyICk7XG5cdFx0XHRjb25zdCBuZXdWYWx1ZSA9IG9sZFZhbHVlLnJlcGxhY2UoICclJScsIHVuaXF1ZUlkICk7XG5cblx0XHRcdGVsZW1lbnQuYXR0ciggYXR0ciwgbmV3VmFsdWUgKTtcblx0XHR9XG5cdCk7XG59XG5cbi8qKlxuICogSW5zZXJ0IHRoZSBmaWVsZCdzIHN1YmZpZWxkcy5cbiAqL1xuZnVuY3Rpb24gaW5zZXJ0RmllbGRTdWJGaWVsZHMoIHVpICkge1xuXHQvLyBJbnNlcnQgdGhlIGZpZWxkJ3Mgc3ViZmllbGRzIGlmIG5vdCBhbHJlYWR5IGluc2VydGVkLlxuXHRpZiAoICEgdWkuaXRlbS5oYXNDbGFzcyggJ3N1Yi1maWVsZHMtcmVhZHknICkgKSB7XG5cdFx0Y29uc3QgdHlwZSAgICAgID0gdWkuaXRlbS5hdHRyKCAnZGF0YS1maWVsZC10eXBlJyApO1xuXHRcdGNvbnN0IHVuaXF1ZUlkICA9IHBhcnNlSW50KCB0b3RhbEZpZWxkSW5zdGFuY2VzLnZhbCgpICk7XG5cdFx0Y29uc3QgZmllbGRUeXBlID0gJ3djYXBmLWZvcm0tZmllbGQtJyArIHR5cGU7XG5cblx0XHQvLyBCYWlsIG91dCBpZiBubyB0bXBsIGZvdW5kIGZvciB0aGUgdHlwZS5cblx0XHRpZiAoICEgalF1ZXJ5KCAnI3RtcGwtJyArIGZpZWxkVHlwZSApLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBJbmNyZW1lbnQgdGhlIHZhbHVlIG9mIHRvdGFsIGZpZWxkIGluc3RhbmNlcy5cblx0XHR0b3RhbEZpZWxkSW5zdGFuY2VzLnZhbCggdW5pcXVlSWQgKyAxICk7XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCk7XG5cdFx0Y29uc3Qgd3JhcHBlciAgPSB1aS5pdGVtLmZpbmQoICcud2lkZ2V0LWNvbnRlbnQnICk7XG5cblx0XHR3cmFwcGVyLnByZXBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIGZvciBhdHRyaWJ1dGVzIG9mIHRoZSBsYWJlbHMuXG5cdFx0cmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCB1aS5pdGVtLmZpbmQoICdsYWJlbFtmb3JePVwid2NhcGYtaW5wdXQtXCJdJyApLCAnZm9yJyApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBpZHMgb2YgdGhlIGlucHV0IGVsZW1lbnRzLlxuXHRcdHJlbW92ZVBsYWNlaG9sZGVyKCB1bmlxdWVJZCwgdWkuaXRlbS5maW5kKCAnKltpZF49XCJ3Y2FwZi1pbnB1dC1cIl0nICksICdpZCcgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgbmFtZXMgb2YgdGhlIGlucHV0IGVsZW1lbnRzLlxuXHRcdHJlbW92ZVBsYWNlaG9sZGVyKCB1bmlxdWVJZCwgdWkuaXRlbS5maW5kKCAnKltpZF49XCJ3Y2FwZi1pbnB1dC1cIl0nICksICduYW1lJyApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBwb3NpdGlvbiB2YWx1ZS5cblx0XHRyZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIHVpLml0ZW0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtcG9zaXRpb24tXCJdJyApLCAndmFsdWUnICk7XG5cblx0XHR1aS5pdGVtLmFkZENsYXNzKCAnc3ViLWZpZWxkcy1yZWFkeScgKTtcblxuXHRcdHNlYXJjaEZvcm0udHJpZ2dlciggJ2ZpZWxkX2FkZGVkJywgWyB1aSBdICk7XG5cdH1cbn1cblxuLyoqXG4gKiBVcGRhdGUgdGhlIGZvcm0gZmllbGQncyBwb3NpdGlvbiBhZnRlciBzb3J0LlxuICpcbiAqIEBzb3VyY2UgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE0NzM2Nzc1XG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZUZpZWxkc1Bvc2l0aW9uKCkge1xuXHRjb25zdCBpbnB1dHMgID0gc2VhcmNoRm9ybS5maW5kKCAnKltpZF49XCJ3Y2FwZi1pbnB1dC1wb3NpdGlvbi1cIl0nICk7XG5cdGNvbnN0IG5iRWxlbXMgPSBpbnB1dHMubGVuZ3RoO1xuXG5cdGlucHV0cy5lYWNoKFxuXHRcdGZ1bmN0aW9uKCBpZHggKSB7XG5cdFx0XHRqUXVlcnkoIHRoaXMgKS52YWwoIG5iRWxlbXMgLSAoIG5iRWxlbXMgLSBpZHggKSApO1xuXHRcdH1cblx0KTtcbn1cblxuLyoqXG4gKiBNYWtlIHRoZSBmaWVsZCByZWFkeSwgcmVtb3ZlIHN0eWxlcyBjb21lcyBmcm9tIGpxdWVyeS11aS1zb3J0YWJsZSBwbHVnaW4sIGluc2VydCB0aGUgZmllbGQncyBzdWJmaWVsZHMgZXRjLlxuICovXG5mdW5jdGlvbiBtYWtlRmllbGRSZWFkeSggZSwgdWkgKSB7XG5cdC8vIFJlbW92ZSBzdHlsZXMgY29tZXMgZnJvbSBqcXVlcnktdWktc29ydGFibGUgcGx1Z2luLlxuXHR1aS5pdGVtLnJlbW92ZUF0dHIoICdzdHlsZScgKTtcblxuXHRpbnNlcnRGaWVsZFN1YkZpZWxkcyggdWkgKTtcblxuXHR1cGRhdGVGaWVsZHNQb3NpdGlvbigpO1xuXG5cdGNvbnN0IHRvZ2dsZUJ0biA9IHVpLml0ZW0uZmluZCggJy53aWRnZXQtYWN0aW9uJyApO1xuXG5cdC8vIEV4cGFuZCB0aGUgZm9ybSBmaWVsZCBhZnRlciBzb3J0LlxuXHRpZiAoICdmYWxzZScgPT09IHRvZ2dsZUJ0bi5hdHRyKCAnYXJpYS1leHBhbmRlZCcgKSApIHtcblx0XHR0b2dnbGVCdG4udHJpZ2dlciggJ2NsaWNrJyApO1xuXHR9XG59XG5cbi8qKlxuICogSW5zdGFudGlhdGUgc29ydGFibGUgZm9yIHRoZSBmb3JtIGZpZWxkcy5cbiAqL1xuZnVuY3Rpb24gc29ydGFibGUoIGlkZW50aWZpZXIgKSB7XG5cdGNvbnN0IGNvbnRhaW5lciA9IGpRdWVyeSggaWRlbnRpZmllciApO1xuXG5cdGNvbnRhaW5lci5zb3J0YWJsZShcblx0XHR7XG5cdFx0XHRvcGFjaXR5OiAwLjgsXG5cdFx0XHRyZXZlcnQ6IGZhbHNlLFxuXHRcdFx0Y3Vyc29yOiAnbW92ZScsXG5cdFx0XHRheGlzOiAneScsXG5cdFx0XHRoYW5kbGU6ICcud2lkZ2V0LXRvcCcsXG5cdFx0XHRjYW5jZWw6ICcud2lkZ2V0LXRpdGxlLWFjdGlvbicsXG5cdFx0XHRpdGVtczogJy53aWRnZXQnLFxuXHRcdFx0cGxhY2Vob2xkZXI6ICd3aWRnZXQtcGxhY2Vob2xkZXInLFxuXHRcdFx0Y29ubmVjdFdpdGg6ICcjc2VhcmNoLWZvcm0td3JhcHBlcicsXG5cdFx0XHRzdG9wOiBtYWtlRmllbGRSZWFkeSxcblx0XHRcdHN0YXJ0OiBmdW5jdGlvbiggZSwgdWkgKSB7XG5cdFx0XHRcdC8vIElmIGl0IGlzIGdldHRpbmcgYXBwZW5kZWQgdG8gdGhlIHdyb25nIHBsYWNlLCB0aGVuIGZvcmNlIGl0IGludG8gdGhlIHJpZ2h0IGNvbnRhaW5lci5cblx0XHRcdFx0dWkucGxhY2Vob2xkZXIuYXBwZW5kVG8oIHVpLnBsYWNlaG9sZGVyLnBhcmVudCgpLmZpbmQoICcuaW5zaWRlICNzZWFyY2gtZm9ybS13cmFwcGVyJyApICk7XG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xufVxuXG5zb3J0YWJsZSggJyNzZWFyY2gtZm9ybScgKTtcblxuLyoqXG4gKiBSdW4gZnVuY3Rpb24gd2hlbiBkcmFnIHN0YXJ0cy5cbiAqL1xuZnVuY3Rpb24gb25EcmFnU3RhcnQoKSB7XG5cdHNlYXJjaEZvcm0uYWRkQ2xhc3MoICd1aS1kcm9wLWFjdGl2ZScgKTtcbn1cblxuLyoqXG4gKiBSdW4gZnVuY3Rpb24gYXQgZHJhZyBzdG9wLlxuICovXG5mdW5jdGlvbiBvbkRyYWdTdG9wKCkge1xuXHRzZWFyY2hGb3JtLnJlbW92ZUNsYXNzKCAndWktZHJvcC1hY3RpdmUnICk7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBkcmFnZ2FibGUgZm9yIHRoZSBmb3JtIGZpZWxkcy5cbiAqL1xualF1ZXJ5KCAnI2F2YWlsYWJsZS1maWVsZHMgLndpZGdldCcgKS5kcmFnZ2FibGUoXG5cdHtcblx0XHRjb25uZWN0VG9Tb3J0YWJsZTogJyNzZWFyY2gtZm9ybScsXG5cdFx0aGVscGVyOiAnY2xvbmUnLFxuXHRcdHN0YXJ0OiBvbkRyYWdTdGFydCxcblx0XHRzdG9wOiBvbkRyYWdTdG9wLFxuXHR9XG4pO1xuXG4vKipcbiAqIFRvZ2dsZSB0aGUgZm9ybSBmaWVsZC5cbiAqL1xuZnVuY3Rpb24gdG9nZ2xlRmllbGQoIGUgKSB7XG5cdGNvbnN0IHRhcmdldCAgICAgICA9IGUudGFyZ2V0O1xuXHRjb25zdCB3aWRnZXQgICAgICAgPSBqUXVlcnkoIHRoaXMgKS5jbG9zZXN0KCAnLndpZGdldCcgKTtcblx0Y29uc3QgdG9nZ2xlQnRuICAgID0gd2lkZ2V0LmZpbmQoICcud2lkZ2V0LWFjdGlvbicgKTtcblx0Y29uc3QgaW5zaWRlICAgICAgID0gd2lkZ2V0LmNoaWxkcmVuKCAnLndpZGdldC1pbnNpZGUnICk7XG5cdGNvbnN0IGlzRXhwYW5kICAgICA9IHRvZ2dsZUJ0bi5hdHRyKCAnYXJpYS1leHBhbmRlZCcgKTtcblx0Y29uc3QgdG9nZ2xlRXhwYW5kID0gJ3RydWUnID09PSBpc0V4cGFuZCA/ICdmYWxzZScgOiAndHJ1ZSc7XG5cblx0dG9nZ2xlQnRuLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgdG9nZ2xlRXhwYW5kICk7XG5cdGpRdWVyeSggaW5zaWRlICkuc2xpZGVUb2dnbGUoXG5cdFx0J2Zhc3QnLFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0d2lkZ2V0LnRvZ2dsZUNsYXNzKCAnb3BlbicgKTtcblx0XHRcdHNlYXJjaEZvcm0udHJpZ2dlciggJ3dpZGdldC1jbG9zZWQnLCBbIHRhcmdldCBdICk7XG5cdFx0fVxuXHQpO1xufVxuXG5zZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLndpZGdldC10b3AnLCB0b2dnbGVGaWVsZCApO1xuc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53aWRnZXQtY29udHJvbC1jbG9zZScsIHRvZ2dsZUZpZWxkICk7XG5cbi8qKlxuICogRm9jdXMgdGhlIGZvcm0gZmllbGQncyBleHBhbmQgYnV0dG9uLlxuICovXG5mdW5jdGlvbiBmb2N1c0ZpZWxkKCBlLCB0YXJnZXQgKSB7XG5cdGlmICggdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyggJ3dpZGdldC1jb250cm9sLWNsb3NlJyApICkge1xuXHRcdGNvbnN0IHdpZGdldCA9IGpRdWVyeSggdGFyZ2V0ICkuY2xvc2VzdCggJy53aWRnZXQnICk7XG5cdFx0Y29uc3QgYWN0aW9uID0gd2lkZ2V0LmZpbmQoICcud2lkZ2V0LWFjdGlvbicgKTtcblxuXHRcdGFjdGlvbi5hdHRyKCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScgKS5mb2N1cygpO1xuXHR9XG59XG5cbnNlYXJjaEZvcm0ub24oICd3aWRnZXQtY2xvc2VkJywgZm9jdXNGaWVsZCApO1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZmllbGQuXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUZpZWxkKCkge1xuXHRjb25zdCB3aWRnZXQgPSBqUXVlcnkoIHRoaXMgKS5jbG9zZXN0KCAnLndpZGdldCcgKTtcblxuXHRqUXVlcnkoIHdpZGdldCApLnNsaWRlVXAoXG5cdFx0J2Zhc3QnLFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0d2lkZ2V0LnJlbW92ZSgpO1xuXHRcdFx0dXBkYXRlRmllbGRzUG9zaXRpb24oKTtcblx0XHR9XG5cdCk7XG59XG5cbnNlYXJjaEZvcm0ub24oICdjbGljaycsICcud2lkZ2V0LWNvbnRyb2wtcmVtb3ZlJywgcmVtb3ZlRmllbGQgKTtcblxuLyoqXG4gKiBTdG9yZSB0aGUgaW5pdGlhbCBmb3JtIGRhdGEgaW50byBhIHZhcmlhYmxlIHNvIHRoYXQgd2UgY2FuIGNvbXBhcmUgaXQgd2hlbiBsZWF2aW5nIHRoZSBwYWdlLlxuICovXG5sZXQgaW5pdGlhbEZvcm1TdGF0ZSA9IHNlYXJjaEZvcm0uc2VyaWFsaXplQXJyYXkoKTtcblxuLyoqXG4gKiBTaG93IG1lc3NhZ2UgYWZ0ZXIgZm9ybSBzdWJtaXNzaW9uLlxuICovXG5mdW5jdGlvbiBzaG93TWVzc2FnZSggbWVzc2FnZSwgdHlwZSA9ICdzdWNjZXNzJyApIHtcblx0Y29uc3QgZWxlbWVudCA9IGpRdWVyeSggJzxwIGNsYXNzPVwiJyArIHR5cGUgKyAnXCI+JyArIG1lc3NhZ2UgKyAnPC9wPicgKTtcblx0Y29uc3Qgd3JhcHBlciA9IGpRdWVyeSggJy53Y2FwZi1tZXNzYWdlLXdyYXBwZXInICk7XG5cblx0aWYgKCAhIHdyYXBwZXIuaXMoICc6ZW1wdHknICkgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0alF1ZXJ5KCB3cmFwcGVyICkuaHRtbCggZWxlbWVudCApLnNsaWRlRG93biggJ2Zhc3QnICk7XG5cblx0c2V0VGltZW91dChcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdGpRdWVyeSggd3JhcHBlciApLnNsaWRlVXAoICdmYXN0JyApO1xuXHRcdFx0d3JhcHBlci5odG1sKCAnJyApO1xuXHRcdH0sXG5cdFx0MzAwMFxuXHQpO1xufVxuXG4vKipcbiAqIFNhdmUgdGhlIHNlYXJjaCBmb3JtLlxuICovXG5mdW5jdGlvbiBzYXZlRm9ybSgpIHtcblx0Y29uc3QgYnV0dG9uICAgPSBqUXVlcnkoIHRoaXMgKTtcblx0Y29uc3QgZm9ybURhdGEgPSBzZWFyY2hGb3JtLnNlcmlhbGl6ZUFycmF5KCk7XG5cblx0YnV0dG9uLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblxuXHRmdW5jdGlvbiBva0NhbGxiYWNrKCBtZXNzYWdlICkge1xuXHRcdGJ1dHRvbi5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIGluaXRpYWwgZm9ybSBkYXRhIGFmdGVyIHN1Y2Nlc3NmdWxseSBzYXZpbmcgdGhlIGZvcm0uXG5cdFx0aW5pdGlhbEZvcm1TdGF0ZSA9IGZvcm1EYXRhO1xuXG5cdFx0c2hvd01lc3NhZ2UoIG1lc3NhZ2UgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGVyckNhbGxiYWNrKCBtZXNzYWdlICkge1xuXHRcdGJ1dHRvbi5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0c2hvd01lc3NhZ2UoIG1lc3NhZ2UsICdlcnJvcicgKTtcblx0fVxuXG5cdC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81OTE4MTI1MlxuXHR3cC5hamF4LnBvc3QoIGZvcm1EYXRhICkuZG9uZSggb2tDYWxsYmFjayApLmZhaWwoIGVyckNhbGxiYWNrICk7XG59XG5cbmpRdWVyeSggJyNwb3N0Ym94LWNvbnRhaW5lci0xJyApLm9uKCAnY2xpY2snLCAnYnV0dG9uJywgc2F2ZUZvcm0gKTtcblxuLyoqXG4gKiBTaG93IGFsZXJ0IG9uIGxlYXZlIGlmIHRoZSBmb3JtIGlzIGRpcnR5LlxuICpcbiAqIFRPRE86IFVuY29tbWVudCB0aGlzLlxuICovXG4vLyB3aW5kb3cub25iZWZvcmV1bmxvYWQgPSBmdW5jdGlvbigpIHtcbi8vIFx0Y29uc3QgbmV3Rm9ybVN0YXRlID0gc2VhcmNoRm9ybS5zZXJpYWxpemVBcnJheSgpO1xuLy9cbi8vIFx0Y29uc3QgaXNGb3JtRGlydHkgPSAhIF8uaXNFcXVhbCggbmV3Rm9ybVN0YXRlLCBpbml0aWFsRm9ybVN0YXRlICk7XG4vL1xuLy8gXHRpZiAoIGlzRm9ybURpcnR5ICkge1xuLy8gXHRcdHJldHVybiAnJztcbi8vIFx0fVxuLy8gfTtcbiJdfQ==
