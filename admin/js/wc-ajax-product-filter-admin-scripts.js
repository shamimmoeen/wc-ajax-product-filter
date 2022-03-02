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
  }); // Toggle soft limit fields when display type is changed.

  $searchForm.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-display_type select' === handler) {
      var $softLimitFields = $field.find('.soft-limit-fields');
      var $valueTypeField = $field.find('.wcapf-form-sub-field-value_type select');
      var valueType = $valueTypeField.val();
      var displayTypes = ['checkbox', 'radio'];

      if ($valueTypeField.length) {
        if ('text' === valueType) {
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
  }); // Toggle soft limit fields when number display type is changed.

  $searchForm.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-number_display_type select' === handler) {
      var $softLimitFields = $field.find('.soft-limit-fields');
      var $valueTypeField = $field.find('.wcapf-form-sub-field-value_type select');
      var valueType = $valueTypeField.val();
      var displayTypes = ['range_checkbox', 'range_radio'];

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
      var $numberDisplayTypeField = $field.find('.wcapf-form-sub-field-number_display_type select');
      var numberDisplayType = $numberDisplayTypeField.val();
      var numberDisplayTypes = ['range_checkbox', 'range_radio'];
      var $textDisplayTypeField = $field.find('.wcapf-form-sub-field-display_type select');
      var textDisplayType = $textDisplayTypeField.val();
      var textDisplayTypes = ['checkbox', 'radio'];

      if ('number' === value) {
        if (numberDisplayTypes.includes(numberDisplayType)) {
          $softLimitFields.show();
        } else {
          $softLimitFields.hide();
        }
      } else if ('text' === value) {
        if (textDisplayTypes.includes(textDisplayType)) {
          $softLimitFields.show();
        } else {
          $softLimitFields.hide();
        }
      } else if ('date' === value) {
        $softLimitFields.hide();
      } else {
        $softLimitFields.hide();
      }
    }
  }); // Set the value type when post property changed.

  $searchForm.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-post_property select' === handler) {
      var $valueType = $field.find('.wcapf-form-sub-field-value_type select');
      var params = window['wcapf_admin_params'];
      var postPropertyData = params['post_property_data'];

      if (!postPropertyData) {
        return;
      }

      var valueType = postPropertyData[value];

      if (!valueType) {
        valueType = '';
      }

      $valueType.val(valueType).change();
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
  }, {
    'handler': '.wcapf-form-sub-field-post_property select',
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBvc3QtbWV0YS1vcHRpb25zLmpzIiwic2VhcmNoLWZvcm0tZmllbGQuanMiLCJzZWFyY2gtZm9ybS5qcyJdLCJuYW1lcyI6WyJqUXVlcnkiLCJkb2N1bWVudCIsInJlYWR5IiwiJCIsIiRzZWFyY2hGb3JtIiwib24iLCJlIiwiaGFuZGxlciIsInZhbHVlIiwiJGZpZWxkIiwicGFyYW1zIiwid2luZG93IiwiaGllcmFyY2hpY2FsRGF0YSIsImlzSGllcmFyY2hpY2FsIiwiJGRlcGVuZGFudEZpZWxkcyIsImZpbmQiLCJzaG93IiwiaGlkZSIsImluaXRTb3J0YWJsZUZvck1hbnVhbE9wdGlvbnMiLCIkc2VsZWN0b3IiLCJzb3J0YWJsZSIsIm9wYWNpdHkiLCJyZXZlcnQiLCJjdXJzb3IiLCJheGlzIiwiaGFuZGxlIiwicGxhY2Vob2xkZXIiLCJ1cGRhdGUiLCJ0YXJnZXQiLCJjbG9zZXN0IiwidHJpZ2dlck1hbnVhbE9wdGlvbnNDaGFuZ2UiLCJkaXNhYmxlU2VsZWN0aW9uIiwidWkiLCJpdGVtIiwidHJpZ2dlclJlbW92ZU9wdGlvbiIsIiRvcHRpb25zVGFibGUiLCJ0YWJsZVJvd3MiLCJjaGlsZHJlbiIsImxlbmd0aCIsInJlbW92ZUNsYXNzIiwiJGl0ZW0iLCJyZW1vdmUiLCJlbXB0eSIsImZpZWxkVHlwZSIsInRlbXBsYXRlIiwid3AiLCJyZW5kZXJlZCIsImxhYmVsIiwiJHdyYXBwZXIiLCIkcm93cyIsImFwcGVuZCIsImhhc0NsYXNzIiwiYWRkQ2xhc3MiLCIkcG9zdE1ldGFPcHRpb25zTW9kYWwiLCIkbm9LZXlGb3VuZE1lc3NhZ2UiLCIkcG9zdE1ldGFNb2RhbExvYWRlciIsIiRwb3N0TWV0YU9wdGlvbnMiLCIkcG9zdE1ldGFNb2RhbEZvb3RlciIsInBvc3RNZXRhT3B0aW9uc01vZGFsSW5zdGFuY2UiLCJyZW1vZGFsIiwiaGFzaFRyYWNraW5nIiwiJHBvc3RNZXRhRmllbGQiLCJyZXNldFBvc3RNZXRhTW9kYWwiLCJodG1sIiwicHJvcCIsIiRpbnB1dE1ldGFLZXkiLCJtZXRhS2V5IiwidmFsIiwib3BlbiIsIm9rQ2FsbGJhY2siLCJyZXNwb25zZSIsImVyckNhbGxiYWNrIiwibWVzc2FnZSIsImNvbnNvbGUiLCJsb2ciLCJmb3JtRGF0YSIsImtleSIsImFjdGlvbiIsImFqYXgiLCJwb3N0IiwiZG9uZSIsImZhaWwiLCIkdmFsdWVIb2xkZXIiLCJfcm93cyIsImVhY2giLCJpIiwiX2l0ZW0iLCJwdXNoIiwicmF3VmFsdWVzIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiSlNPTiIsInN0cmluZ2lmeSIsIiRvcHRpb25zIiwiaXNSZXBsYWNlIiwicm93cyIsImlzIiwiaW5wdXQiLCIkaW5wdXQiLCJjbG9zZSIsIiRzZWxlY3RFbG0iLCJvcmRlckJ5IiwiZGVwZW5kYW50T3B0aW9ucyIsImF0dHIiLCJjaGFuZ2UiLCJyZW1vdmVBdHRyIiwiZGlzYWJsZU9yZGVyQnlPcHRpb25zIiwiJGVsbSIsIiRvcmRlckRpcmVjdGlvbkZpZWxkIiwiJG9yZGVyVHlwZUZpZWxkIiwiJHRoaXMiLCJpbml0U29ydGFibGVGb3JOdW1iZXJNYW51YWxPcHRpb25zIiwidHJpZ2dlck51bWJlck1hbnVhbE9wdGlvbnNDaGFuZ2UiLCJ0cmlnZ2VyUmVtb3ZlTnVtYmVyT3B0aW9uIiwibWluX3ZhbHVlIiwibWF4X3ZhbHVlIiwiJGdldE9wdGlvbnMiLCIkYXV0b09wdGlvbnMiLCIkbWFudWFsT3B0aW9uc1RhYmxlIiwiZGlzcGxheVR5cGUiLCJ0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkIiwiJHRleHRGaWVsZCIsInRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQiLCIkc29mdExpbWl0RmllbGRzIiwiJHZhbHVlVHlwZUZpZWxkIiwidmFsdWVUeXBlIiwiZGlzcGxheVR5cGVzIiwiaW5jbHVkZXMiLCIkbnVtYmVyRGlzcGxheVR5cGVGaWVsZCIsIm51bWJlckRpc3BsYXlUeXBlIiwibnVtYmVyRGlzcGxheVR5cGVzIiwiJHRleHREaXNwbGF5VHlwZUZpZWxkIiwidGV4dERpc3BsYXlUeXBlIiwidGV4dERpc3BsYXlUeXBlcyIsIiR2YWx1ZVR5cGUiLCJwb3N0UHJvcGVydHlEYXRhIiwiZGVwZW5kYW50RGF0YSIsIl90cmlnZ2VySW5wdXRUeXBlVGV4dERpc3BsYXlUeXBlQ2hhbmdlIiwiJG5vUmVzdWx0cyIsIiRhbGxJdGVtc0xhYmVsIiwidXNlQ2hvc2VuIiwiX3RyaWdnZXJJbnB1dFR5cGVOdW1iZXJEaXNwbGF5VHlwZUNoYW5nZSIsIl90cmlnZ2VySW5wdXRUeXBlVGV4dFVzZVNlbGVjdENoYW5nZSIsIl90cmlnZ2VySW5wdXRUeXBlTnVtYmVyVXNlU2VsZWN0Q2hhbmdlIiwiX2hhbmRsZVRvZ2dsZVJlcXVlc3QiLCJkYXRhIiwiY3VycmVudFNlbGVjdG9yIiwiaGFuZGxlclR5cGUiLCJkZXBlbmRhbnQiLCJfdmFsdWUiLCJpZCIsImQiLCJ2YWxpZFZhbHVlcyIsInRyaWdnZXIiLCJoYW5kbGVUb2dnbGVSZXF1ZXN0IiwiJGhhbmRsZXIiLCJfdGhpcyIsInNldHVwU2VhcmNoRm9ybSIsImluaXRhbCIsImV2ZW50IiwidG90YWxGaWVsZEluc3RhbmNlcyIsInNlYXJjaEZvcm0iLCJyZW1vdmVQbGFjZWhvbGRlciIsInVuaXF1ZUlkIiwiZWxlbWVudHMiLCJlbGVtZW50Iiwib2xkVmFsdWUiLCJuZXdWYWx1ZSIsInJlcGxhY2UiLCJpbnNlcnRGaWVsZFN1YkZpZWxkcyIsInR5cGUiLCJwYXJzZUludCIsIndyYXBwZXIiLCJwcmVwZW5kIiwidXBkYXRlRmllbGRzUG9zaXRpb24iLCJpbnB1dHMiLCJuYkVsZW1zIiwiaWR4IiwibWFrZUZpZWxkUmVhZHkiLCJ0b2dnbGVCdG4iLCJpZGVudGlmaWVyIiwiY29udGFpbmVyIiwiY2FuY2VsIiwiaXRlbXMiLCJjb25uZWN0V2l0aCIsInN0b3AiLCJzdGFydCIsImFwcGVuZFRvIiwicGFyZW50Iiwib25EcmFnU3RhcnQiLCJvbkRyYWdTdG9wIiwiZHJhZ2dhYmxlIiwiY29ubmVjdFRvU29ydGFibGUiLCJoZWxwZXIiLCJ0b2dnbGVGaWVsZCIsIndpZGdldCIsImluc2lkZSIsImlzRXhwYW5kIiwidG9nZ2xlRXhwYW5kIiwic2xpZGVUb2dnbGUiLCJ0b2dnbGVDbGFzcyIsImZvY3VzRmllbGQiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImZvY3VzIiwicmVtb3ZlRmllbGQiLCJzbGlkZVVwIiwiaW5pdGlhbEZvcm1TdGF0ZSIsInNlcmlhbGl6ZUFycmF5Iiwic2hvd01lc3NhZ2UiLCJzbGlkZURvd24iLCJzZXRUaW1lb3V0Iiwic2F2ZUZvcm0iLCJidXR0b24iXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQSxNQUFNLENBQUVDLFFBQUYsQ0FBTixDQUFtQkMsS0FBbkIsQ0FBMEIsVUFBVUMsQ0FBVixFQUFjO0FBRXZDLE1BQU1DLFdBQVcsR0FBR0QsQ0FBQyxDQUFFLGNBQUYsQ0FBckI7QUFFQUMsRUFBQUEsV0FBVyxDQUFDQyxFQUFaLENBQWdCLHNCQUFoQixFQUF3QyxVQUFVQyxDQUFWLEVBQWFDLE9BQWIsRUFBc0JDLEtBQXRCLEVBQTZCQyxNQUE3QixFQUFzQztBQUM3RSxRQUFLLG1EQUFtREYsT0FBeEQsRUFBa0U7QUFDakUsVUFBTUcsTUFBTSxHQUFhQyxNQUFNLENBQUUsb0JBQUYsQ0FBL0I7QUFDQSxVQUFNQyxnQkFBZ0IsR0FBR0YsTUFBTSxDQUFFLDRCQUFGLENBQS9COztBQUVBLFVBQUssQ0FBRUUsZ0JBQVAsRUFBMEI7QUFDekI7QUFDQTs7QUFFRCxVQUFNQyxjQUFjLEdBQUtELGdCQUFnQixDQUFFSixLQUFGLENBQXpDO0FBQ0EsVUFBTU0sZ0JBQWdCLEdBQUdMLE1BQU0sQ0FBQ00sSUFBUCxDQUN4Qiw4RUFEd0IsQ0FBekI7O0FBSUEsVUFBS0YsY0FBTCxFQUFzQjtBQUNyQkMsUUFBQUEsZ0JBQWdCLENBQUNFLElBQWpCO0FBQ0EsT0FGRCxNQUVPO0FBQ05GLFFBQUFBLGdCQUFnQixDQUFDRyxJQUFqQjtBQUNBO0FBQ0Q7QUFDRCxHQXBCRDs7QUFzQkEsV0FB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QUFtQixVQUFuQixFQUQ4QixDQUc5Qjs7QUFDQXNHLElBQUFBLGdCQUFnQixHQUFHbkksUUFBbkI7QUFFQXFJLElBQUFBLFdBQVcsQ0FBRXhJLE9BQUYsQ0FBWDtBQUNBOztBQUVELFdBQVNELFdBQVQsQ0FBc0JDLE9BQXRCLEVBQWdDO0FBQy9CNEksSUFBQUEsTUFBTSxDQUFDNUcsVUFBUCxDQUFtQixVQUFuQjtBQUNBd0csSUFBQUEsV0FBVyxDQUFFeEksT0FBRixFQUFXLE9BQVgsQ0FBWDtBQUNBLEdBbEJrQixDQW9CbkI7OztBQUNBM0IsRUFBQUEsRUFBRSxDQUFDaUMsSUFBSCxDQUFRQyxJQUFSLENBQWNKLFFBQWQsRUFBeUJLLElBQXpCLENBQStCWCxVQUEvQixFQUE0Q1ksSUFBNUMsQ0FBa0RWLFdBQWxEO0FBQ0E7O0FBRUR2RSxNQUFNLENBQUUsc0JBQUYsQ0FBTixDQUFpQ0ssRUFBakMsQ0FBcUMsT0FBckMsRUFBOEMsUUFBOUMsRUFBd0Q4TSxRQUF4RDtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoid2MtYWpheC1wcm9kdWN0LWZpbHRlci1hZG1pbi1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgcG9zdCBtZXRhIGZpZWxkLlxuICpcbiAqIEBzaW5jZSAgICAgIDEuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLXByb1xuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci1wcm8vYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0ICRzZWFyY2hGb3JtID0gJCggJyNzZWFyY2gtZm9ybScgKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWN1c3RvbS10YXhvbm9teSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgcGFyYW1zICAgICAgICAgICA9IHdpbmRvd1sgJ3djYXBmX2FkbWluX3BhcmFtcycgXTtcblx0XHRcdGNvbnN0IGhpZXJhcmNoaWNhbERhdGEgPSBwYXJhbXNbICd0YXhvbm9teV9oaWVyYXJjaGljYWxfZGF0YScgXTtcblxuXHRcdFx0aWYgKCAhIGhpZXJhcmNoaWNhbERhdGEgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaXNIaWVyYXJjaGljYWwgICA9IGhpZXJhcmNoaWNhbERhdGFbIHZhbHVlIF07XG5cdFx0XHRjb25zdCAkZGVwZW5kYW50RmllbGRzID0gJGZpZWxkLmZpbmQoXG5cdFx0XHRcdCcud2NhcGYtZm9ybS1zdWItZmllbGQtaGllcmFyY2hpY2FsLCAud2NhcGYtZm9ybS1zdWItZmllbGQtc2hvd19jaGlsZHJlbl9vbmx5J1xuXHRcdFx0KTtcblxuXHRcdFx0aWYgKCBpc0hpZXJhcmNoaWNhbCApIHtcblx0XHRcdFx0JGRlcGVuZGFudEZpZWxkcy5zaG93KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkZGVwZW5kYW50RmllbGRzLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHRmdW5jdGlvbiBpbml0U29ydGFibGVGb3JNYW51YWxPcHRpb25zKCAkc2VsZWN0b3IgKSB7XG5cdFx0JHNlbGVjdG9yLnNvcnRhYmxlKCB7XG5cdFx0XHRvcGFjaXR5OiAwLjgsXG5cdFx0XHRyZXZlcnQ6IGZhbHNlLFxuXHRcdFx0Y3Vyc29yOiAnbW92ZScsXG5cdFx0XHRheGlzOiAneScsXG5cdFx0XHRoYW5kbGU6ICcubW92ZS1vcHRpb25zLWhhbmRsZXInLFxuXHRcdFx0cGxhY2Vob2xkZXI6ICd3aWRnZXQtcGxhY2Vob2xkZXInLFxuXHRcdFx0dXBkYXRlOiBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkID0gJCggZS50YXJnZXQgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRcdFx0dHJpZ2dlck1hbnVhbE9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHRcdFx0fVxuXHRcdH0gKS5kaXNhYmxlU2VsZWN0aW9uKCk7XG5cdH1cblxuXHQvLyBTb3J0IE1hbnVhbCBPcHRpb25zXG5cdGluaXRTb3J0YWJsZUZvck1hbnVhbE9wdGlvbnMoICRzZWFyY2hGb3JtLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUgLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnZmllbGRfYWRkZWQnLCBmdW5jdGlvbiggZSwgdWkgKSB7XG5cdFx0Ly8gSW5pdCBTb3J0YWJsZSBmb3IgdGhlIG1hbnVhbCBvcHRpb25zLlxuXHRcdGluaXRTb3J0YWJsZUZvck1hbnVhbE9wdGlvbnMoICQoIHVpLml0ZW0uZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkgKSApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gdHJpZ2dlclJlbW92ZU9wdGlvbiggJGZpZWxkICkge1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblx0XHRjb25zdCB0YWJsZVJvd3MgICAgID0gJG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKS5jaGlsZHJlbigpO1xuXG5cdFx0aWYgKCAyID4gdGFibGVSb3dzLmxlbmd0aCApIHtcblx0XHRcdCRvcHRpb25zVGFibGUucmVtb3ZlQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH1cblxuXHQvLyBSZW1vdmUgU2luZ2xlIE9wdGlvblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5yZW1vdmUtb3B0aW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGl0ZW0gID0gJCggdGhpcyApLmNsb3Nlc3QoICcuaXRlbScgKTtcblx0XHRjb25zdCAkZmllbGQgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKTtcblxuXHRcdCRpdGVtLnJlbW92ZSgpO1xuXG5cdFx0dHJpZ2dlck1hbnVhbE9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQ2xlYXIgQWxsIE9wdGlvbnNcblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcuY2xlYXItYWxsLW9wdGlvbnMnLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgICAgICAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cblx0XHQkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApLmVtcHR5KCk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKTtcblxuXHRcdHRyaWdnZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIEFkZCBOZXcgT3B0aW9uXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmFkZC1vcHRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCBmaWVsZFR5cGUgPSAnd2NhcGYtcG9zdC1tZXRhLW9wdGlvbic7XG5cblx0XHQvLyBCYWlsIG91dCBpZiBubyB0bXBsIGZvdW5kIGZvciB0aGUgdHlwZS5cblx0XHRpZiAoICEgalF1ZXJ5KCAnI3RtcGwtJyArIGZpZWxkVHlwZSApLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggZmllbGRUeXBlICk7XG5cdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSggeyB2YWx1ZTogJycsIGxhYmVsOiAnJyB9ICk7XG5cdFx0Y29uc3QgJHdyYXBwZXIgPSAkZmllbGQuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblx0XHRjb25zdCAkcm93cyAgICA9ICR3cmFwcGVyLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApO1xuXG5cdFx0JHJvd3MuYXBwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0aWYgKCAhICR3cmFwcGVyLmhhc0NsYXNzKCAnaGFzLW9wdGlvbnMnICkgKSB7XG5cdFx0XHQkd3JhcHBlci5hZGRDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fSApO1xuXG5cdGNvbnN0ICRwb3N0TWV0YU9wdGlvbnNNb2RhbCA9ICQoICcucG9zdC1tZXRhLW9wdGlvbnMtbW9kYWwnICk7XG5cdGNvbnN0ICRub0tleUZvdW5kTWVzc2FnZSAgICA9ICRwb3N0TWV0YU9wdGlvbnNNb2RhbC5maW5kKCAnLm5vLWtleS1mb3VuZC1tZXNzYWdlJyApO1xuXHRjb25zdCAkcG9zdE1ldGFNb2RhbExvYWRlciAgPSAkcG9zdE1ldGFPcHRpb25zTW9kYWwuZmluZCggJy5wb3N0LW1ldGEtb3B0aW9ucy1sb2FkZXInICk7XG5cdGNvbnN0ICRwb3N0TWV0YU9wdGlvbnMgICAgICA9ICRwb3N0TWV0YU9wdGlvbnNNb2RhbC5maW5kKCAnLnBvc3QtbWV0YS1vcHRpb25zJyApO1xuXHRjb25zdCAkcG9zdE1ldGFNb2RhbEZvb3RlciAgPSAkcG9zdE1ldGFPcHRpb25zTW9kYWwuZmluZCggJy53Y2FwZi1tb2RhbC1mb290ZXInICk7XG5cblx0Y29uc3QgcG9zdE1ldGFPcHRpb25zTW9kYWxJbnN0YW5jZSA9ICRwb3N0TWV0YU9wdGlvbnNNb2RhbC5yZW1vZGFsKCB7XG5cdFx0aGFzaFRyYWNraW5nOiBmYWxzZSxcblx0fSApO1xuXG5cdGxldCAkcG9zdE1ldGFGaWVsZCA9IG51bGw7XG5cblx0ZnVuY3Rpb24gcmVzZXRQb3N0TWV0YU1vZGFsKCkge1xuXHRcdCRwb3N0TWV0YU9wdGlvbnMuaHRtbCggJycgKTtcblx0XHQkcG9zdE1ldGFNb2RhbExvYWRlci5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHQkbm9LZXlGb3VuZE1lc3NhZ2UucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0JHBvc3RNZXRhTW9kYWxGb290ZXIucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0JHBvc3RNZXRhT3B0aW9uc01vZGFsLmZpbmQoICcucmVwbGFjZS1jdXJyZW50LW9wdGlvbnMnICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHR9XG5cblx0Ly8gQnJvd3NlIFZhbHVlc1xuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5icm93c2UtdmFsdWVzJywgZnVuY3Rpb24oKSB7XG5cdFx0cmVzZXRQb3N0TWV0YU1vZGFsKCk7XG5cblx0XHRjb25zdCAkZmllbGQgICAgICAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkaW5wdXRNZXRhS2V5ID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWV0YV9rZXkgc2VsZWN0JyApO1xuXHRcdGNvbnN0IG1ldGFLZXkgICAgICAgPSAkaW5wdXRNZXRhS2V5LnZhbCgpO1xuXG5cdFx0aWYgKCAhIG1ldGFLZXkgKSB7XG5cdFx0XHQkbm9LZXlGb3VuZE1lc3NhZ2UuYWRkQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRub0tleUZvdW5kTWVzc2FnZS5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHR9XG5cblx0XHRwb3N0TWV0YU9wdGlvbnNNb2RhbEluc3RhbmNlLm9wZW4oKTtcblx0XHQkcG9zdE1ldGFGaWVsZCA9ICRmaWVsZDtcblxuXHRcdGlmICggISBtZXRhS2V5ICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIFNob3cgdGhlIGxvYWRpbmcgYW5pbWF0aW9uLlxuXHRcdCRwb3N0TWV0YU1vZGFsTG9hZGVyLmFkZENsYXNzKCAnYWN0aXZlJyApO1xuXG5cdFx0LyoqXG5cdFx0ICogQWpheCdzIHN1Y2Nlc3MgZnVuY3Rpb24uXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gcmVzcG9uc2Vcblx0XHQgKi9cblx0XHRmdW5jdGlvbiBva0NhbGxiYWNrKCByZXNwb25zZSApIHtcblx0XHRcdC8vIEhpZGUgdGhlIGxvYWRpbmcgYW5pbWF0aW9uLlxuXHRcdFx0JHBvc3RNZXRhTW9kYWxMb2FkZXIucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0XHQkcG9zdE1ldGFNb2RhbEZvb3Rlci5hZGRDbGFzcyggJ2FjdGl2ZScgKTtcblxuXHRcdFx0JHBvc3RNZXRhT3B0aW9ucy5odG1sKCByZXNwb25zZSApO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIEFqYXgncyBlcnJvciBmdW5jdGlvbi5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSBtZXNzYWdlXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gZXJyQ2FsbGJhY2soIG1lc3NhZ2UgKSB7XG5cdFx0XHRjb25zb2xlLmxvZyggJ2Vycm9yJywgbWVzc2FnZSApO1xuXG5cdFx0XHQvLyBIaWRlIHRoZSBsb2FkaW5nIGFuaW1hdGlvbi5cblx0XHRcdCRwb3N0TWV0YU1vZGFsTG9hZGVyLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZvcm1EYXRhID0ge1xuXHRcdFx0a2V5OiBtZXRhS2V5LFxuXHRcdFx0YWN0aW9uOiAnd2NhcGZfZ2V0X21ldGFfb3B0aW9ucycsXG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzU5MTgxMjUyXG5cdFx0d3AuYWpheC5wb3N0KCBmb3JtRGF0YSApLmRvbmUoIG9rQ2FsbGJhY2sgKS5mYWlsKCBlcnJDYWxsYmFjayApO1xuXHR9ICk7XG5cblx0LyoqXG5cdCAqIFJlc2V0IHRoZSBwb3N0IG1ldGEgb3B0aW9uJ3MgbW9kYWwgd2hlbiBtb2RhbCBnZXRzIGNsb3NlZC5cblx0ICovXG5cdCQoIGRvY3VtZW50ICkub24oICdjbG9zZWQnLCAkcG9zdE1ldGFPcHRpb25zTW9kYWwsIGZ1bmN0aW9uKCkge1xuXHRcdHJlc2V0UG9zdE1ldGFNb2RhbCgpO1xuXHRcdCRwb3N0TWV0YUZpZWxkID0gbnVsbDtcblx0fSApO1xuXG5cdC8vIFVuc2VsZWN0IGFsbCB2YWx1ZXMuXG5cdCRwb3N0TWV0YU9wdGlvbnNNb2RhbC5vbiggJ2NsaWNrJywgJy5zZWxlY3Qtbm9uZScsIGZ1bmN0aW9uKCkge1xuXHRcdCRwb3N0TWV0YU9wdGlvbnMuZmluZCggJ1t0eXBlPVwiY2hlY2tib3hcIl0nICkucHJvcCggJ2NoZWNrZWQnLCBmYWxzZSApO1xuXHR9ICk7XG5cblx0Ly8gU2VsZWN0IGFsbCB2YWx1ZXMuXG5cdCRwb3N0TWV0YU9wdGlvbnNNb2RhbC5vbiggJ2NsaWNrJywgJy5zZWxlY3QtYWxsJywgZnVuY3Rpb24oKSB7XG5cdFx0JHBvc3RNZXRhT3B0aW9ucy5maW5kKCAnW3R5cGU9XCJjaGVja2JveFwiXScgKS5wcm9wKCAnY2hlY2tlZCcsIHRydWUgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHRyaWdnZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkcG9zdE1ldGFGaWVsZCApIHtcblx0XHRjb25zdCAkdmFsdWVIb2xkZXIgID0gJHBvc3RNZXRhRmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYW51YWxfb3B0aW9ucyBpbnB1dCcgKTtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJHBvc3RNZXRhRmllbGQuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblx0XHRjb25zdCAkcm93cyAgICAgICAgID0gJG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKTtcblx0XHRjb25zdCBfcm93cyAgICAgICAgID0gW107XG5cblx0XHQkcm93cy5maW5kKCAnLml0ZW0nICkuZWFjaCggZnVuY3Rpb24oIGksIF9pdGVtICkge1xuXHRcdFx0Y29uc3QgJGl0ZW0gPSAkKCBfaXRlbSApO1xuXHRcdFx0Y29uc3QgdmFsdWUgPSAkaXRlbS5maW5kKCAnLm9wdGlvbl92YWx1ZScgKS52YWwoKTtcblx0XHRcdGNvbnN0IGxhYmVsID0gJGl0ZW0uZmluZCggJy5vcHRpb25fbGFiZWwnICkudmFsKCk7XG5cblx0XHRcdGlmICggdmFsdWUgJiYgbGFiZWwgKSB7XG5cdFx0XHRcdF9yb3dzLnB1c2goIFsgdmFsdWUsIGxhYmVsIF0gKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHRjb25zdCByYXdWYWx1ZXMgPSBlbmNvZGVVUklDb21wb25lbnQoIEpTT04uc3RyaW5naWZ5KCBfcm93cyApICk7XG5cdFx0JHZhbHVlSG9sZGVyLnZhbCggcmF3VmFsdWVzICk7XG5cdH1cblxuXHQvLyBBZGQgc2VsZWN0ZWQgb3B0aW9ucy5cblx0JHBvc3RNZXRhT3B0aW9uc01vZGFsLm9uKCAnY2xpY2snLCAnLmFkZC1vcHRpb25zJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJG9wdGlvbnMgPSAkcG9zdE1ldGFPcHRpb25zLmZpbmQoICdbdHlwZT1cImNoZWNrYm94XCJdJyApO1xuXHRcdGxldCBpc1JlcGxhY2UgID0gZmFsc2U7XG5cdFx0bGV0IHJvd3MgICAgICAgPSAnJztcblxuXHRcdGlmICggJHBvc3RNZXRhTW9kYWxGb290ZXIuZmluZCggJy5yZXBsYWNlLWN1cnJlbnQtb3B0aW9ucycgKS5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0aXNSZXBsYWNlID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAoICRvcHRpb25zICkge1xuXHRcdFx0Y29uc3QgZmllbGRUeXBlID0gJ3djYXBmLXBvc3QtbWV0YS1vcHRpb24nO1xuXG5cdFx0XHQkLmVhY2goICRvcHRpb25zLCBmdW5jdGlvbiggaSwgaW5wdXQgKSB7XG5cdFx0XHRcdGNvbnN0ICRpbnB1dCA9ICQoIGlucHV0ICk7XG5cdFx0XHRcdGNvbnN0IHZhbHVlICA9ICRpbnB1dC52YWwoKTtcblxuXHRcdFx0XHRpZiAoICRpbnB1dC5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0XHRcdGNvbnN0IHRlbXBsYXRlID0gd3AudGVtcGxhdGUoIGZpZWxkVHlwZSApO1xuXHRcdFx0XHRcdGNvbnN0IHJlbmRlcmVkID0gdGVtcGxhdGUoIHsgdmFsdWUsIGxhYmVsOiB2YWx1ZSB9ICk7XG5cblx0XHRcdFx0XHRyb3dzICs9IHJlbmRlcmVkO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0aWYgKCByb3dzICkge1xuXHRcdFx0Y29uc3QgJHdyYXBwZXIgPSAkcG9zdE1ldGFGaWVsZC5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdFx0Y29uc3QgJHJvd3MgICAgPSAkd3JhcHBlci5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKTtcblxuXHRcdFx0aWYgKCBpc1JlcGxhY2UgKSB7XG5cdFx0XHRcdCRyb3dzLmh0bWwoIHJvd3MgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRyb3dzLmFwcGVuZCggcm93cyApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgJHdyYXBwZXIuaGFzQ2xhc3MoICdoYXMtb3B0aW9ucycgKSApIHtcblx0XHRcdFx0JHdyYXBwZXIuYWRkQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHRcdH1cblxuXHRcdFx0dHJpZ2dlck1hbnVhbE9wdGlvbnNDaGFuZ2UoICRwb3N0TWV0YUZpZWxkICk7XG5cdFx0fVxuXG5cdFx0cG9zdE1ldGFPcHRpb25zTW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1nZXRfb3B0aW9ucyBpbnB1dCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkc2VsZWN0RWxtICAgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtb3B0aW9uc19vcmRlcl9ieSBzZWxlY3QnICk7XG5cdFx0XHRjb25zdCBvcmRlckJ5ICAgICAgICAgID0gJHNlbGVjdEVsbS52YWwoKTtcblx0XHRcdGNvbnN0IGRlcGVuZGFudE9wdGlvbnMgPSAnb3B0aW9uW3ZhbHVlPVwibGFiZWxcIl0nO1xuXG5cdFx0XHRpZiAoICdhdXRvbWF0aWNhbGx5JyA9PT0gdmFsdWUgKSB7XG5cdFx0XHRcdCRzZWxlY3RFbG0uY2hpbGRyZW4oIGRlcGVuZGFudE9wdGlvbnMgKS5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cblx0XHRcdFx0aWYgKCAnbGFiZWwnID09PSBvcmRlckJ5ICkge1xuXHRcdFx0XHRcdCRzZWxlY3RFbG0ucHJvcCggJ3NlbGVjdGVkSW5kZXgnLCAxICkuY2hhbmdlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzZWxlY3RFbG0uY2hpbGRyZW4oIGRlcGVuZGFudE9wdGlvbnMgKS5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0ZnVuY3Rpb24gZGlzYWJsZU9yZGVyQnlPcHRpb25zKCAkZWxtICkge1xuXHRcdGNvbnN0IHZhbHVlICAgICAgICAgICAgICAgID0gJGVsbS52YWwoKTtcblx0XHRjb25zdCAkd3JhcHBlciAgICAgICAgICAgICA9ICRlbG0uY2xvc2VzdCggJy53Y2FwZi1wb3N0LW1ldGEtb3JkZXItb3B0aW9ucy1maWVsZCcgKTtcblx0XHRjb25zdCAkb3JkZXJEaXJlY3Rpb25GaWVsZCA9ICR3cmFwcGVyLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtb3B0aW9uc19vcmRlcl9kaXIgc2VsZWN0JyApO1xuXHRcdGNvbnN0ICRvcmRlclR5cGVGaWVsZCAgICAgID0gJHdyYXBwZXIuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1vcHRpb25zX29yZGVyX3R5cGUgc2VsZWN0JyApO1xuXG5cdFx0aWYgKCAnbm9uZScgPT09IHZhbHVlICkge1xuXHRcdFx0JG9yZGVyRGlyZWN0aW9uRmllbGQuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdFx0JG9yZGVyVHlwZUZpZWxkLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JG9yZGVyRGlyZWN0aW9uRmllbGQucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdFx0JG9yZGVyVHlwZUZpZWxkLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHR9XG5cdH1cblxuXHQkc2VhcmNoRm9ybS5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW9wdGlvbnNfb3JkZXJfYnkgc2VsZWN0JyApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0ZGlzYWJsZU9yZGVyQnlPcHRpb25zKCAkdGhpcyApO1xuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdjaGFuZ2UnLCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW9wdGlvbnNfb3JkZXJfYnkgc2VsZWN0JywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRkaXNhYmxlT3JkZXJCeU9wdGlvbnMoICR0aGlzICk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2lucHV0JywgJy5tYW51YWwtb3B0aW9ucy10YWJsZSBpbnB1dFt0eXBlPVwidGV4dFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHR0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvKipcblx0ICogVmFsdWUgdHlwZSAnTnVtYmVyJ1xuXHQgKi9cblxuXHRmdW5jdGlvbiBpbml0U29ydGFibGVGb3JOdW1iZXJNYW51YWxPcHRpb25zKCAkc2VsZWN0b3IgKSB7XG5cdFx0JHNlbGVjdG9yLnNvcnRhYmxlKCB7XG5cdFx0XHRvcGFjaXR5OiAwLjgsXG5cdFx0XHRyZXZlcnQ6IGZhbHNlLFxuXHRcdFx0Y3Vyc29yOiAnbW92ZScsXG5cdFx0XHRheGlzOiAneScsXG5cdFx0XHRoYW5kbGU6ICcubW92ZS1vcHRpb25zLWhhbmRsZXInLFxuXHRcdFx0cGxhY2Vob2xkZXI6ICd3aWRnZXQtcGxhY2Vob2xkZXInLFxuXHRcdFx0dXBkYXRlOiBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkID0gJCggZS50YXJnZXQgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRcdFx0dHJpZ2dlck51bWJlck1hbnVhbE9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHRcdFx0fVxuXHRcdH0gKS5kaXNhYmxlU2VsZWN0aW9uKCk7XG5cdH1cblxuXHQvLyBTb3J0IE51bWJlciBNYW51YWwgT3B0aW9uc1xuXHRpbml0U29ydGFibGVGb3JOdW1iZXJNYW51YWxPcHRpb25zKCAkc2VhcmNoRm9ybS5maW5kKCAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZSAubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCBlLCB1aSApIHtcblx0XHQvLyBJbml0IFNvcnRhYmxlIGZvciB0aGUgbnVtYmVyIG1hbnVhbCBvcHRpb25zLlxuXHRcdGluaXRTb3J0YWJsZUZvck51bWJlck1hbnVhbE9wdGlvbnMoICQoIHVpLml0ZW0uZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkgKSApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gdHJpZ2dlclJlbW92ZU51bWJlck9wdGlvbiggJGZpZWxkICkge1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggJy5udW1iZXItbWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgdGFibGVSb3dzICAgICA9ICRvcHRpb25zVGFibGUuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkuY2hpbGRyZW4oKTtcblxuXHRcdGlmICggMiA+IHRhYmxlUm93cy5sZW5ndGggKSB7XG5cdFx0XHQkb3B0aW9uc1RhYmxlLnJlbW92ZUNsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gdHJpZ2dlck51bWJlck1hbnVhbE9wdGlvbnNDaGFuZ2UoICRwb3N0TWV0YUZpZWxkICkge1xuXHRcdGNvbnN0ICR2YWx1ZUhvbGRlciAgPSAkcG9zdE1ldGFGaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9tYW51YWxfb3B0aW9ucyBpbnB1dCcgKTtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJHBvc3RNZXRhRmllbGQuZmluZCggJy5udW1iZXItbWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgICAgICA9ICRvcHRpb25zVGFibGUuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICk7XG5cdFx0Y29uc3QgX3Jvd3MgICAgICAgICA9IFtdO1xuXG5cdFx0JHJvd3MuZmluZCggJy5pdGVtJyApLmVhY2goIGZ1bmN0aW9uKCBpLCBfaXRlbSApIHtcblx0XHRcdGNvbnN0ICRpdGVtICAgICA9ICQoIF9pdGVtICk7XG5cdFx0XHRjb25zdCBtaW5fdmFsdWUgPSAkaXRlbS5maW5kKCAnLm9wdGlvbl9taW5fdmFsdWUnICkudmFsKCk7XG5cdFx0XHRjb25zdCBtYXhfdmFsdWUgPSAkaXRlbS5maW5kKCAnLm9wdGlvbl9tYXhfdmFsdWUnICkudmFsKCk7XG5cdFx0XHRjb25zdCBsYWJlbCAgICAgPSAkaXRlbS5maW5kKCAnLm9wdGlvbl9sYWJlbCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCBtaW5fdmFsdWUgJiYgbWF4X3ZhbHVlICYmIGxhYmVsICkge1xuXHRcdFx0XHRfcm93cy5wdXNoKCBbIG1pbl92YWx1ZSwgbWF4X3ZhbHVlLCBsYWJlbCBdICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Y29uc3QgcmF3VmFsdWVzID0gZW5jb2RlVVJJQ29tcG9uZW50KCBKU09OLnN0cmluZ2lmeSggX3Jvd3MgKSApO1xuXHRcdCR2YWx1ZUhvbGRlci52YWwoIHJhd1ZhbHVlcyApO1xuXHR9XG5cblx0Ly8gUmVtb3ZlIFNpbmdsZSBOdW1iZXIgT3B0aW9uXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLnJlbW92ZS1udW1iZXItb3B0aW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGl0ZW0gID0gJCggdGhpcyApLmNsb3Nlc3QoICcuaXRlbScgKTtcblx0XHRjb25zdCAkZmllbGQgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlTnVtYmVyT3B0aW9uKCAkZmllbGQgKTtcblxuXHRcdCRpdGVtLnJlbW92ZSgpO1xuXG5cdFx0dHJpZ2dlck51bWJlck1hbnVhbE9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQ2xlYXIgQWxsIE9wdGlvbnNcblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcuY2xlYXItYWxsLW51bWJlci1vcHRpb25zJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICAgICA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblxuXHRcdCRvcHRpb25zVGFibGUuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkuZW1wdHkoKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVOdW1iZXJPcHRpb24oICRmaWVsZCApO1xuXG5cdFx0dHJpZ2dlck51bWJlck1hbnVhbE9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQWRkIE5ldyBPcHRpb25cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcuYWRkLW51bWJlci1vcHRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCBmaWVsZFR5cGUgPSAnd2NhcGYtcG9zdC1tZXRhLXR5cGUtbnVtYmVyLW9wdGlvbic7XG5cblx0XHQvLyBCYWlsIG91dCBpZiBubyB0bXBsIGZvdW5kIGZvciB0aGUgdHlwZS5cblx0XHRpZiAoICEgalF1ZXJ5KCAnI3RtcGwtJyArIGZpZWxkVHlwZSApLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggZmllbGRUeXBlICk7XG5cdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSggeyB2YWx1ZTogJycsIGxhYmVsOiAnJyB9ICk7XG5cdFx0Y29uc3QgJHdyYXBwZXIgPSAkZmllbGQuZmluZCggJy5udW1iZXItbWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgPSAkd3JhcHBlci5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKTtcblxuXHRcdCRyb3dzLmFwcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdGlmICggISAkd3JhcHBlci5oYXNDbGFzcyggJ2hhcy1vcHRpb25zJyApICkge1xuXHRcdFx0JHdyYXBwZXIuYWRkQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2lucHV0JywgJy5udW1iZXItbWFudWFsLW9wdGlvbnMtdGFibGUgaW5wdXRbdHlwZT1cInRleHRcIl0nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0dHJpZ2dlck51bWJlck1hbnVhbE9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkZ2V0T3B0aW9ucyAgICAgICAgID0gJGZpZWxkLmZpbmQoICcubnVtYmVyLWdldC1vcHRpb25zJyApO1xuXHRcdFx0Y29uc3QgJGF1dG9PcHRpb25zICAgICAgICA9ICRmaWVsZC5maW5kKCAnLm51bWJlci1hdXRvbWF0aWMtb3B0aW9ucycgKTtcblx0XHRcdGNvbnN0ICRtYW51YWxPcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggJy5udW1iZXItbWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0XHRjb25zdCAkZWxtICAgICAgICAgICAgICAgID0gJGZpZWxkLmZpbmQoIGhhbmRsZXIgKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlUeXBlICAgICAgICAgPSAkZWxtLnZhbCgpO1xuXG5cdFx0XHRpZiAoICdyYW5nZV9zbGlkZXInID09PSBkaXNwbGF5VHlwZSB8fCAncmFuZ2VfbnVtYmVyJyA9PT0gZGlzcGxheVR5cGUgKSB7XG5cdFx0XHRcdCRnZXRPcHRpb25zLmhpZGUoKTtcblx0XHRcdFx0JG1hbnVhbE9wdGlvbnNUYWJsZS5hZGRDbGFzcyggJ2ZvcmNlLWhpZGUnICk7XG5cdFx0XHRcdCRhdXRvT3B0aW9ucy5hZGRDbGFzcyggJ2ZvcmNlLXNob3cnICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkZ2V0T3B0aW9ucy5zaG93KCk7XG5cdFx0XHRcdCRtYW51YWxPcHRpb25zVGFibGUucmVtb3ZlQ2xhc3MoICdmb3JjZS1oaWRlJyApO1xuXHRcdFx0XHQkYXV0b09wdGlvbnMucmVtb3ZlQ2xhc3MoICdmb3JjZS1zaG93JyApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdGZ1bmN0aW9uIHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICRlbG0gKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICA9ICRlbG0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICR0ZXh0RmllbGQgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWUgaW5wdXRbdHlwZT1cInRleHRcIl0nICk7XG5cblx0XHRpZiAoICRlbG0uaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdCR0ZXh0RmllbGQuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkdGV4dEZpZWxkLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHR9XG5cdH1cblxuXHQkc2VhcmNoRm9ybS5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHR0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0dG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJHRoaXMgKTtcblx0fSApO1xuXG5cdGZ1bmN0aW9uIHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICRlbG0gKSB7XG5cdFx0Y29uc3QgJGZpZWxkICAgICA9ICRlbG0uY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICR0ZXh0RmllbGQgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWUgaW5wdXRbdHlwZT1cInRleHRcIl0nICk7XG5cblx0XHRpZiAoICRlbG0uaXMoICc6Y2hlY2tlZCcgKSApIHtcblx0XHRcdCR0ZXh0RmllbGQuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkdGV4dEZpZWxkLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHR9XG5cdH1cblxuXHQkc2VhcmNoRm9ybS5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZV9hdXRvX2RldGVjdCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHR0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzID0gJCggdGhpcyApO1xuXG5cdFx0dG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCggJHRoaXMgKTtcblx0fSApO1xuXG5cdC8vIFRvZ2dsZSBzb2Z0IGxpbWl0IGZpZWxkcyB3aGVuIGRpc3BsYXkgdHlwZSBpcyBjaGFuZ2VkLlxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJHNvZnRMaW1pdEZpZWxkcyA9ICRmaWVsZC5maW5kKCAnLnNvZnQtbGltaXQtZmllbGRzJyApO1xuXHRcdFx0Y29uc3QgJHZhbHVlVHlwZUZpZWxkICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXZhbHVlX3R5cGUgc2VsZWN0JyApO1xuXHRcdFx0Y29uc3QgdmFsdWVUeXBlICAgICAgICA9ICR2YWx1ZVR5cGVGaWVsZC52YWwoKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlUeXBlcyAgICAgPSBbICdjaGVja2JveCcsICdyYWRpbycgXTtcblxuXHRcdFx0aWYgKCAkdmFsdWVUeXBlRmllbGQubGVuZ3RoICkge1xuXHRcdFx0XHRpZiAoICd0ZXh0JyA9PT0gdmFsdWVUeXBlICkge1xuXHRcdFx0XHRcdGlmICggZGlzcGxheVR5cGVzLmluY2x1ZGVzKCB2YWx1ZSApICkge1xuXHRcdFx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5zaG93KCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdCRzb2Z0TGltaXRGaWVsZHMuaGlkZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCBkaXNwbGF5VHlwZXMuaW5jbHVkZXMoIHZhbHVlICkgKSB7XG5cdFx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHQvLyBUb2dnbGUgc29mdCBsaW1pdCBmaWVsZHMgd2hlbiBudW1iZXIgZGlzcGxheSB0eXBlIGlzIGNoYW5nZWQuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2Rpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJHNvZnRMaW1pdEZpZWxkcyA9ICRmaWVsZC5maW5kKCAnLnNvZnQtbGltaXQtZmllbGRzJyApO1xuXHRcdFx0Y29uc3QgJHZhbHVlVHlwZUZpZWxkICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXZhbHVlX3R5cGUgc2VsZWN0JyApO1xuXHRcdFx0Y29uc3QgdmFsdWVUeXBlICAgICAgICA9ICR2YWx1ZVR5cGVGaWVsZC52YWwoKTtcblx0XHRcdGNvbnN0IGRpc3BsYXlUeXBlcyAgICAgPSBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycgXTtcblxuXHRcdFx0aWYgKCAkdmFsdWVUeXBlRmllbGQubGVuZ3RoICkge1xuXHRcdFx0XHRpZiAoICdudW1iZXInID09PSB2YWx1ZVR5cGUgKSB7XG5cdFx0XHRcdFx0aWYgKCBkaXNwbGF5VHlwZXMuaW5jbHVkZXMoIHZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHQkc29mdExpbWl0RmllbGRzLnNob3coKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5oaWRlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoIGRpc3BsYXlUeXBlcy5pbmNsdWRlcyggdmFsdWUgKSApIHtcblx0XHRcdFx0XHQkc29mdExpbWl0RmllbGRzLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkc29mdExpbWl0RmllbGRzLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdC8vIFRvZ2dsZSBzb2Z0IGxpbWl0IGZpZWxkcyB3aGVuIHZhbHVlIHR5cGUgaXMgY2hhbmdlZC5cblx0JHNlYXJjaEZvcm0ub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkc29mdExpbWl0RmllbGRzID0gJGZpZWxkLmZpbmQoICcuc29mdC1saW1pdC1maWVsZHMnICk7XG5cblx0XHRcdGNvbnN0ICRudW1iZXJEaXNwbGF5VHlwZUZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2Rpc3BsYXlfdHlwZSBzZWxlY3QnICk7XG5cdFx0XHRjb25zdCBudW1iZXJEaXNwbGF5VHlwZSAgICAgICA9ICRudW1iZXJEaXNwbGF5VHlwZUZpZWxkLnZhbCgpO1xuXHRcdFx0Y29uc3QgbnVtYmVyRGlzcGxheVR5cGVzICAgICAgPSBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycgXTtcblxuXHRcdFx0Y29uc3QgJHRleHREaXNwbGF5VHlwZUZpZWxkID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgKTtcblx0XHRcdGNvbnN0IHRleHREaXNwbGF5VHlwZSAgICAgICA9ICR0ZXh0RGlzcGxheVR5cGVGaWVsZC52YWwoKTtcblx0XHRcdGNvbnN0IHRleHREaXNwbGF5VHlwZXMgICAgICA9IFsgJ2NoZWNrYm94JywgJ3JhZGlvJyBdO1xuXG5cdFx0XHRpZiAoICdudW1iZXInID09PSB2YWx1ZSApIHtcblx0XHRcdFx0aWYgKCBudW1iZXJEaXNwbGF5VHlwZXMuaW5jbHVkZXMoIG51bWJlckRpc3BsYXlUeXBlICkgKSB7XG5cdFx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoICd0ZXh0JyA9PT0gdmFsdWUgKSB7XG5cdFx0XHRcdGlmICggdGV4dERpc3BsYXlUeXBlcy5pbmNsdWRlcyggdGV4dERpc3BsYXlUeXBlICkgKSB7XG5cdFx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoICdkYXRlJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHRcdCRzb2Z0TGltaXRGaWVsZHMuaGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gU2V0IHRoZSB2YWx1ZSB0eXBlIHdoZW4gcG9zdCBwcm9wZXJ0eSBjaGFuZ2VkLlxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBvc3RfcHJvcGVydHkgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICR2YWx1ZVR5cGUgICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV90eXBlIHNlbGVjdCcgKTtcblx0XHRcdGNvbnN0IHBhcmFtcyAgICAgICAgICAgPSB3aW5kb3dbICd3Y2FwZl9hZG1pbl9wYXJhbXMnIF07XG5cdFx0XHRjb25zdCBwb3N0UHJvcGVydHlEYXRhID0gcGFyYW1zWyAncG9zdF9wcm9wZXJ0eV9kYXRhJyBdO1xuXG5cdFx0XHRpZiAoICEgcG9zdFByb3BlcnR5RGF0YSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgdmFsdWVUeXBlID0gcG9zdFByb3BlcnR5RGF0YVsgdmFsdWUgXTtcblxuXHRcdFx0aWYgKCAhIHZhbHVlVHlwZSApIHtcblx0XHRcdFx0dmFsdWVUeXBlID0gJyc7XG5cdFx0XHR9XG5cblx0XHRcdCR2YWx1ZVR5cGUudmFsKCB2YWx1ZVR5cGUgKS5jaGFuZ2UoKTtcblx0XHR9XG5cdH0gKTtcblxufSApO1xuIiwiLyoqXG4gKiBUaGUgc2VhcmNoIGZvcm0gZmllbGQuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0ICRzZWFyY2hGb3JtID0gJCggJyNzZWFyY2gtZm9ybScgKTtcblxuXHRjb25zdCBkZXBlbmRhbnREYXRhID0gW1xuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC12YWx1ZV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS10ZXh0LWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAndGV4dCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuaW5wdXQtdHlwZS1udW1iZXItZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdudW1iZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtZGF0ZS1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2RhdGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXF1ZXJ5X3R5cGUnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2NoZWNrYm94JywgJ211bHRpLXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYWRpbycsICdzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3NlbGVjdCcsICdtdWx0aS1zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZ2V0X29wdGlvbnMgaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3JhZGlvJyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcuY29sdW1uLWdyb3VwLW1ldGFfa2V5X21hbnVhbF9vcHRpb25zJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdtYW51YWxfZW50cnknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2xpZGVyX2Rpc3BsYXlfdmFsdWVzX2FzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NlbGVjdF9hbGxfaXRlbXNfbGFiZWwnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3VzZV9jaG9zZW4nLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3Nob3dfY291bnQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2hpZGVfZW1wdHknLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLWRlY2ltYWwtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zbGlkZXInLCAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfcmFkaW8nLCAncmFuZ2Vfc2VsZWN0JywgJ3JhbmdlX211bHRpc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfdXNlX2Nob3NlbiBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnY2hlY2tib3gnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnMScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX2dldF9vcHRpb25zIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1hdXRvbWF0aWMtb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnYXV0b21hdGljYWxseScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdtYW51YWxfZW50cnknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRhdGVfaW5wdXRfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmRhdGUtdG8tdWktb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfZGF0ZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfdGVybXMgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1wYXJlbnRfdGVybScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY2hpbGQnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWxpbWl0X3Rlcm1zX2J5X2lkJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbmNsdWRlJywgJ2V4Y2x1ZGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9zb2Z0X2xpbWl0IGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNvZnRfbGltaXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2VuYWJsZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtY3VzdG9tLXRheG9ub215IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBvc3RfcHJvcGVydHkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XTtcblxuXHRmdW5jdGlvbiBfdHJpZ2dlcklucHV0VHlwZVRleHREaXNwbGF5VHlwZUNoYW5nZSggdmFsdWUsICRmaWVsZCApIHtcblx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0Y29uc3QgdXNlQ2hvc2VuICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0JyApLmlzKCAnOmNoZWNrZWQnICk7XG5cblx0XHRpZiAoIHVzZUNob3NlbiAmJiAoICdzZWxlY3QnID09PSB2YWx1ZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgKSApIHtcblx0XHRcdCRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHR9XG5cblx0XHRpZiAoICggJ3JhZGlvJyA9PT0gdmFsdWUgfHwgJ3NlbGVjdCcgPT09IHZhbHVlICkgfHwgKCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgJiYgdXNlQ2hvc2VuICkgKSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBfdHJpZ2dlcklucHV0VHlwZU51bWJlckRpc3BsYXlUeXBlQ2hhbmdlKCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2VsZWN0X2FsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRjb25zdCB1c2VDaG9zZW4gICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuIGlucHV0JyApLmlzKCAnOmNoZWNrZWQnICk7XG5cblx0XHRpZiAoIHVzZUNob3NlbiAmJiAoICdyYW5nZV9zZWxlY3QnID09PSB2YWx1ZSB8fCAncmFuZ2VfbXVsdGlzZWxlY3QnID09PSB2YWx1ZSApICkge1xuXHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdH1cblxuXHRcdGlmICggKCAncmFuZ2VfcmFkaW8nID09PSB2YWx1ZSB8fCAncmFuZ2Vfc2VsZWN0JyA9PT0gdmFsdWUgKSB8fCAoICdyYW5nZV9tdWx0aXNlbGVjdCcgPT09IHZhbHVlICYmIHVzZUNob3NlbiApICkge1xuXHRcdFx0JGFsbEl0ZW1zTGFiZWwuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gX3RyaWdnZXJJbnB1dFR5cGVUZXh0VXNlU2VsZWN0Q2hhbmdlKCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScgKTtcblx0XHRjb25zdCAkYWxsSXRlbXNMYWJlbCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRjb25zdCBkaXNwbGF5VHlwZSAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnICkudmFsKCk7XG5cblx0XHRpZiAoICcxJyA9PT0gdmFsdWUgJiYgKCAnc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgfHwgJ211bHRpLXNlbGVjdCcgPT09IGRpc3BsYXlUeXBlICkgKSB7XG5cdFx0XHQkbm9SZXN1bHRzLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0fVxuXG5cdFx0aWYgKFxuXHRcdFx0KCAnMScgPT09IHZhbHVlICYmICdtdWx0aS1zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0XHR8fCAoICdyYWRpbycgPT09IGRpc3BsYXlUeXBlIHx8ICdzZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0KSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBfdHJpZ2dlcklucHV0VHlwZU51bWJlclVzZVNlbGVjdENoYW5nZSggdmFsdWUsICRmaWVsZCApIHtcblx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NlbGVjdF9hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0Y29uc3QgZGlzcGxheVR5cGUgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcgKS52YWwoKTtcblxuXHRcdGlmICggJzEnID09PSB2YWx1ZSAmJiAoICdyYW5nZV9zZWxlY3QnID09PSBkaXNwbGF5VHlwZSB8fCAncmFuZ2VfbXVsdGlzZWxlY3QnID09PSBkaXNwbGF5VHlwZSApICkge1xuXHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdH1cblxuXHRcdGlmIChcblx0XHRcdCggJzEnID09PSB2YWx1ZSAmJiAncmFuZ2VfbXVsdGlzZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0XHR8fCAoICdyYW5nZV9yYWRpbycgPT09IGRpc3BsYXlUeXBlIHx8ICdyYW5nZV9zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0KSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgICA9IGN1cnJlbnRTZWxlY3Rvci5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgaGFuZGxlciAgICAgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRjb25zdCBoYW5kbGVyVHlwZSA9IGRhdGFbICdoYW5kbGVyVHlwZScgXTtcblx0XHRjb25zdCBkZXBlbmRhbnQgICA9IGRhdGFbICdkZXBlbmRhbnQnIF07XG5cblx0XHRsZXQgX3ZhbHVlID0gdmFsdWU7XG5cblx0XHRpZiAoICdjaGVja2JveCcgPT09IGhhbmRsZXJUeXBlICkge1xuXHRcdFx0X3ZhbHVlID0gY3VycmVudFNlbGVjdG9yLmlzKCAnOmNoZWNrZWQnICkgPyAnMScgOiAnMCc7XG5cdFx0fVxuXG5cdFx0aWYgKCAncmFkaW8nID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9ICRmaWVsZC5maW5kKCBoYW5kbGVyICsgJzpjaGVja2VkJyApLnZhbCgpO1xuXHRcdH1cblxuXHRcdCQuZWFjaCggZGVwZW5kYW50LCBmdW5jdGlvbiggaWQsIGQgKSB7XG5cdFx0XHRjb25zdCAkc2VsZWN0b3IgICA9ICRmaWVsZC5maW5kKCBkWyAnc2VsZWN0b3InIF0gKTtcblx0XHRcdGNvbnN0IHZhbGlkVmFsdWVzID0gZFsgJ3ZhbHVlJyBdO1xuXG5cdFx0XHRpZiAoIHZhbGlkVmFsdWVzLmluY2x1ZGVzKCBfdmFsdWUgKSApIHtcblx0XHRcdFx0JHNlbGVjdG9yLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0X3RyaWdnZXJJbnB1dFR5cGVUZXh0RGlzcGxheVR5cGVDaGFuZ2UoIF92YWx1ZSwgJGZpZWxkICk7XG5cdFx0fVxuXG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0X3RyaWdnZXJJbnB1dFR5cGVUZXh0VXNlU2VsZWN0Q2hhbmdlKCBfdmFsdWUsICRmaWVsZCApO1xuXHRcdH1cblxuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRfdHJpZ2dlcklucHV0VHlwZU51bWJlckRpc3BsYXlUeXBlQ2hhbmdlKCBfdmFsdWUsICRmaWVsZCApO1xuXHRcdH1cblxuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfdXNlX2Nob3NlbiBpbnB1dCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRfdHJpZ2dlcklucHV0VHlwZU51bWJlclVzZVNlbGVjdENoYW5nZSggX3ZhbHVlLCAkZmllbGQgKTtcblx0XHR9XG5cblx0XHQkc2VhcmNoRm9ybS50cmlnZ2VyKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBbIGhhbmRsZXIsIF92YWx1ZSwgJGZpZWxkIF0gKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0aWYgKCBudWxsID09PSBjdXJyZW50U2VsZWN0b3IgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyICA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdFx0Y29uc3QgJGhhbmRsZXIgPSAkKCBoYW5kbGVyICk7XG5cblx0XHRcdCQuZWFjaCggJGhhbmRsZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IF92YWx1ZSA9IF90aGlzLnZhbCgpO1xuXHRcdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgX3RoaXMsIF92YWx1ZSApO1xuXHRcdFx0fSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNldHVwU2VhcmNoRm9ybSggaW5pdGFsID0gZmFsc2UgKSB7XG5cdFx0JC5lYWNoKCBkZXBlbmRhbnREYXRhLCBmdW5jdGlvbiggaSwgZGF0YSApIHtcblx0XHRcdGNvbnN0IGhhbmRsZXIgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRcdGNvbnN0IGV2ZW50ICAgPSBkYXRhWyAnZXZlbnQnIF07XG5cblx0XHRcdGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIG51bGwsIG51bGwgKTtcblxuXHRcdFx0aWYgKCBpbml0YWwgKSB7XG5cdFx0XHRcdCRzZWFyY2hGb3JtLm9uKCBldmVudCwgaGFuZGxlciwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgX3RoaXMgID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdGNvbnN0IF92YWx1ZSA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0XHRoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBfdGhpcywgX3ZhbHVlICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRzZXR1cFNlYXJjaEZvcm0oIHRydWUgKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gVG9nZ2xlIHRoZSB2aXNpYmlsaXR5IG9mIHN1YmZpZWxkcy5cblx0XHRzZXR1cFNlYXJjaEZvcm0oKTtcblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIFRoZSBzZWFyY2ggZm9ybS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmNvbnN0IHRvdGFsRmllbGRJbnN0YW5jZXMgPSBqUXVlcnkoICcjdG90YWxfZmllbGRfaW5zdGFuY2VzJyApO1xuXG5jb25zdCBzZWFyY2hGb3JtID0galF1ZXJ5KCAnI3NlYXJjaC1mb3JtJyApO1xuXG4vKipcbiAqIEFzc2lnbiBhIHVuaXF1ZSBpZCBieSByZXBsYWNpbmcgdGhlIHBsYWNlaG9sZGVyIGlkLlxuICovXG5mdW5jdGlvbiByZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIGVsZW1lbnRzLCBhdHRyICkge1xuXHRlbGVtZW50cy5lYWNoKFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgZWxlbWVudCA9IGpRdWVyeSggdGhpcyApO1xuXG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IGVsZW1lbnQuYXR0ciggYXR0ciApO1xuXHRcdFx0Y29uc3QgbmV3VmFsdWUgPSBvbGRWYWx1ZS5yZXBsYWNlKCAnJSUnLCB1bmlxdWVJZCApO1xuXG5cdFx0XHRlbGVtZW50LmF0dHIoIGF0dHIsIG5ld1ZhbHVlICk7XG5cdFx0fVxuXHQpO1xufVxuXG4vKipcbiAqIEluc2VydCB0aGUgZmllbGQncyBzdWJmaWVsZHMuXG4gKi9cbmZ1bmN0aW9uIGluc2VydEZpZWxkU3ViRmllbGRzKCB1aSApIHtcblx0Ly8gSW5zZXJ0IHRoZSBmaWVsZCdzIHN1YmZpZWxkcyBpZiBub3QgYWxyZWFkeSBpbnNlcnRlZC5cblx0aWYgKCAhIHVpLml0ZW0uaGFzQ2xhc3MoICdzdWItZmllbGRzLXJlYWR5JyApICkge1xuXHRcdGNvbnN0IHR5cGUgICAgICA9IHVpLml0ZW0uYXR0ciggJ2RhdGEtZmllbGQtdHlwZScgKTtcblx0XHRjb25zdCB1bmlxdWVJZCAgPSBwYXJzZUludCggdG90YWxGaWVsZEluc3RhbmNlcy52YWwoKSApO1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1mb3JtLWZpZWxkLScgKyB0eXBlO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gSW5jcmVtZW50IHRoZSB2YWx1ZSBvZiB0b3RhbCBmaWVsZCBpbnN0YW5jZXMuXG5cdFx0dG90YWxGaWVsZEluc3RhbmNlcy52YWwoIHVuaXF1ZUlkICsgMSApO1xuXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggZmllbGRUeXBlICk7XG5cdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSgpO1xuXHRcdGNvbnN0IHdyYXBwZXIgID0gdWkuaXRlbS5maW5kKCAnLndpZGdldC1jb250ZW50JyApO1xuXG5cdFx0d3JhcHBlci5wcmVwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBmb3IgYXR0cmlidXRlcyBvZiB0aGUgbGFiZWxzLlxuXHRcdHJlbW92ZVBsYWNlaG9sZGVyKCB1bmlxdWVJZCwgdWkuaXRlbS5maW5kKCAnbGFiZWxbZm9yXj1cIndjYXBmLWlucHV0LVwiXScgKSwgJ2ZvcicgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgaWRzIG9mIHRoZSBpbnB1dCBlbGVtZW50cy5cblx0XHRyZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIHVpLml0ZW0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtXCJdJyApLCAnaWQnICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIG5hbWVzIG9mIHRoZSBpbnB1dCBlbGVtZW50cy5cblx0XHRyZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIHVpLml0ZW0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtXCJdJyApLCAnbmFtZScgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgcG9zaXRpb24gdmFsdWUuXG5cdFx0cmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCB1aS5pdGVtLmZpbmQoICcqW2lkXj1cIndjYXBmLWlucHV0LXBvc2l0aW9uLVwiXScgKSwgJ3ZhbHVlJyApO1xuXG5cdFx0dWkuaXRlbS5hZGRDbGFzcyggJ3N1Yi1maWVsZHMtcmVhZHknICk7XG5cblx0XHRzZWFyY2hGb3JtLnRyaWdnZXIoICdmaWVsZF9hZGRlZCcsIFsgdWkgXSApO1xuXHR9XG59XG5cbi8qKlxuICogVXBkYXRlIHRoZSBmb3JtIGZpZWxkJ3MgcG9zaXRpb24gYWZ0ZXIgc29ydC5cbiAqXG4gKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNDczNjc3NVxuICovXG5mdW5jdGlvbiB1cGRhdGVGaWVsZHNQb3NpdGlvbigpIHtcblx0Y29uc3QgaW5wdXRzICA9IHNlYXJjaEZvcm0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtcG9zaXRpb24tXCJdJyApO1xuXHRjb25zdCBuYkVsZW1zID0gaW5wdXRzLmxlbmd0aDtcblxuXHRpbnB1dHMuZWFjaChcblx0XHRmdW5jdGlvbiggaWR4ICkge1xuXHRcdFx0alF1ZXJ5KCB0aGlzICkudmFsKCBuYkVsZW1zIC0gKCBuYkVsZW1zIC0gaWR4ICkgKTtcblx0XHR9XG5cdCk7XG59XG5cbi8qKlxuICogTWFrZSB0aGUgZmllbGQgcmVhZHksIHJlbW92ZSBzdHlsZXMgY29tZXMgZnJvbSBqcXVlcnktdWktc29ydGFibGUgcGx1Z2luLCBpbnNlcnQgdGhlIGZpZWxkJ3Mgc3ViZmllbGRzIGV0Yy5cbiAqL1xuZnVuY3Rpb24gbWFrZUZpZWxkUmVhZHkoIGUsIHVpICkge1xuXHQvLyBSZW1vdmUgc3R5bGVzIGNvbWVzIGZyb20ganF1ZXJ5LXVpLXNvcnRhYmxlIHBsdWdpbi5cblx0dWkuaXRlbS5yZW1vdmVBdHRyKCAnc3R5bGUnICk7XG5cblx0aW5zZXJ0RmllbGRTdWJGaWVsZHMoIHVpICk7XG5cblx0dXBkYXRlRmllbGRzUG9zaXRpb24oKTtcblxuXHRjb25zdCB0b2dnbGVCdG4gPSB1aS5pdGVtLmZpbmQoICcud2lkZ2V0LWFjdGlvbicgKTtcblxuXHQvLyBFeHBhbmQgdGhlIGZvcm0gZmllbGQgYWZ0ZXIgc29ydC5cblx0aWYgKCAnZmFsc2UnID09PSB0b2dnbGVCdG4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnICkgKSB7XG5cdFx0dG9nZ2xlQnRuLnRyaWdnZXIoICdjbGljaycgKTtcblx0fVxufVxuXG4vKipcbiAqIEluc3RhbnRpYXRlIHNvcnRhYmxlIGZvciB0aGUgZm9ybSBmaWVsZHMuXG4gKi9cbmZ1bmN0aW9uIHNvcnRhYmxlKCBpZGVudGlmaWVyICkge1xuXHRjb25zdCBjb250YWluZXIgPSBqUXVlcnkoIGlkZW50aWZpZXIgKTtcblxuXHRjb250YWluZXIuc29ydGFibGUoXG5cdFx0e1xuXHRcdFx0b3BhY2l0eTogMC44LFxuXHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdGN1cnNvcjogJ21vdmUnLFxuXHRcdFx0YXhpczogJ3knLFxuXHRcdFx0aGFuZGxlOiAnLndpZGdldC10b3AnLFxuXHRcdFx0Y2FuY2VsOiAnLndpZGdldC10aXRsZS1hY3Rpb24nLFxuXHRcdFx0aXRlbXM6ICcud2lkZ2V0Jyxcblx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdGNvbm5lY3RXaXRoOiAnI3NlYXJjaC1mb3JtLXdyYXBwZXInLFxuXHRcdFx0c3RvcDogbWFrZUZpZWxkUmVhZHksXG5cdFx0XHRzdGFydDogZnVuY3Rpb24oIGUsIHVpICkge1xuXHRcdFx0XHQvLyBJZiBpdCBpcyBnZXR0aW5nIGFwcGVuZGVkIHRvIHRoZSB3cm9uZyBwbGFjZSwgdGhlbiBmb3JjZSBpdCBpbnRvIHRoZSByaWdodCBjb250YWluZXIuXG5cdFx0XHRcdHVpLnBsYWNlaG9sZGVyLmFwcGVuZFRvKCB1aS5wbGFjZWhvbGRlci5wYXJlbnQoKS5maW5kKCAnLmluc2lkZSAjc2VhcmNoLWZvcm0td3JhcHBlcicgKSApO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcbn1cblxuc29ydGFibGUoICcjc2VhcmNoLWZvcm0nICk7XG5cbi8qKlxuICogUnVuIGZ1bmN0aW9uIHdoZW4gZHJhZyBzdGFydHMuXG4gKi9cbmZ1bmN0aW9uIG9uRHJhZ1N0YXJ0KCkge1xuXHRzZWFyY2hGb3JtLmFkZENsYXNzKCAndWktZHJvcC1hY3RpdmUnICk7XG59XG5cbi8qKlxuICogUnVuIGZ1bmN0aW9uIGF0IGRyYWcgc3RvcC5cbiAqL1xuZnVuY3Rpb24gb25EcmFnU3RvcCgpIHtcblx0c2VhcmNoRm9ybS5yZW1vdmVDbGFzcyggJ3VpLWRyb3AtYWN0aXZlJyApO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemUgZHJhZ2dhYmxlIGZvciB0aGUgZm9ybSBmaWVsZHMuXG4gKi9cbmpRdWVyeSggJyNhdmFpbGFibGUtZmllbGRzIC53aWRnZXQnICkuZHJhZ2dhYmxlKFxuXHR7XG5cdFx0Y29ubmVjdFRvU29ydGFibGU6ICcjc2VhcmNoLWZvcm0nLFxuXHRcdGhlbHBlcjogJ2Nsb25lJyxcblx0XHRzdGFydDogb25EcmFnU3RhcnQsXG5cdFx0c3RvcDogb25EcmFnU3RvcCxcblx0fVxuKTtcblxuLyoqXG4gKiBUb2dnbGUgdGhlIGZvcm0gZmllbGQuXG4gKi9cbmZ1bmN0aW9uIHRvZ2dsZUZpZWxkKCBlICkge1xuXHRjb25zdCB0YXJnZXQgICAgICAgPSBlLnRhcmdldDtcblx0Y29uc3Qgd2lkZ2V0ICAgICAgID0galF1ZXJ5KCB0aGlzICkuY2xvc2VzdCggJy53aWRnZXQnICk7XG5cdGNvbnN0IHRvZ2dsZUJ0biAgICA9IHdpZGdldC5maW5kKCAnLndpZGdldC1hY3Rpb24nICk7XG5cdGNvbnN0IGluc2lkZSAgICAgICA9IHdpZGdldC5jaGlsZHJlbiggJy53aWRnZXQtaW5zaWRlJyApO1xuXHRjb25zdCBpc0V4cGFuZCAgICAgPSB0b2dnbGVCdG4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnICk7XG5cdGNvbnN0IHRvZ2dsZUV4cGFuZCA9ICd0cnVlJyA9PT0gaXNFeHBhbmQgPyAnZmFsc2UnIDogJ3RydWUnO1xuXG5cdHRvZ2dsZUJ0bi5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIHRvZ2dsZUV4cGFuZCApO1xuXHRqUXVlcnkoIGluc2lkZSApLnNsaWRlVG9nZ2xlKFxuXHRcdCdmYXN0Jyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdHdpZGdldC50b2dnbGVDbGFzcyggJ29wZW4nICk7XG5cdFx0XHRzZWFyY2hGb3JtLnRyaWdnZXIoICd3aWRnZXQtY2xvc2VkJywgWyB0YXJnZXQgXSApO1xuXHRcdH1cblx0KTtcbn1cblxuc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53aWRnZXQtdG9wJywgdG9nZ2xlRmllbGQgKTtcbnNlYXJjaEZvcm0ub24oICdjbGljaycsICcud2lkZ2V0LWNvbnRyb2wtY2xvc2UnLCB0b2dnbGVGaWVsZCApO1xuXG4vKipcbiAqIEZvY3VzIHRoZSBmb3JtIGZpZWxkJ3MgZXhwYW5kIGJ1dHRvbi5cbiAqL1xuZnVuY3Rpb24gZm9jdXNGaWVsZCggZSwgdGFyZ2V0ICkge1xuXHRpZiAoIHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoICd3aWRnZXQtY29udHJvbC1jbG9zZScgKSApIHtcblx0XHRjb25zdCB3aWRnZXQgPSBqUXVlcnkoIHRhcmdldCApLmNsb3Nlc3QoICcud2lkZ2V0JyApO1xuXHRcdGNvbnN0IGFjdGlvbiA9IHdpZGdldC5maW5kKCAnLndpZGdldC1hY3Rpb24nICk7XG5cblx0XHRhY3Rpb24uYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICkuZm9jdXMoKTtcblx0fVxufVxuXG5zZWFyY2hGb3JtLm9uKCAnd2lkZ2V0LWNsb3NlZCcsIGZvY3VzRmllbGQgKTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGZpZWxkLlxuICovXG5mdW5jdGlvbiByZW1vdmVGaWVsZCgpIHtcblx0Y29uc3Qgd2lkZ2V0ID0galF1ZXJ5KCB0aGlzICkuY2xvc2VzdCggJy53aWRnZXQnICk7XG5cblx0alF1ZXJ5KCB3aWRnZXQgKS5zbGlkZVVwKFxuXHRcdCdmYXN0Jyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdHdpZGdldC5yZW1vdmUoKTtcblx0XHRcdHVwZGF0ZUZpZWxkc1Bvc2l0aW9uKCk7XG5cdFx0fVxuXHQpO1xufVxuXG5zZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLndpZGdldC1jb250cm9sLXJlbW92ZScsIHJlbW92ZUZpZWxkICk7XG5cbi8qKlxuICogU3RvcmUgdGhlIGluaXRpYWwgZm9ybSBkYXRhIGludG8gYSB2YXJpYWJsZSBzbyB0aGF0IHdlIGNhbiBjb21wYXJlIGl0IHdoZW4gbGVhdmluZyB0aGUgcGFnZS5cbiAqL1xubGV0IGluaXRpYWxGb3JtU3RhdGUgPSBzZWFyY2hGb3JtLnNlcmlhbGl6ZUFycmF5KCk7XG5cbi8qKlxuICogU2hvdyBtZXNzYWdlIGFmdGVyIGZvcm0gc3VibWlzc2lvbi5cbiAqL1xuZnVuY3Rpb24gc2hvd01lc3NhZ2UoIG1lc3NhZ2UsIHR5cGUgPSAnc3VjY2VzcycgKSB7XG5cdGNvbnN0IGVsZW1lbnQgPSBqUXVlcnkoICc8cCBjbGFzcz1cIicgKyB0eXBlICsgJ1wiPicgKyBtZXNzYWdlICsgJzwvcD4nICk7XG5cdGNvbnN0IHdyYXBwZXIgPSBqUXVlcnkoICcud2NhcGYtbWVzc2FnZS13cmFwcGVyJyApO1xuXG5cdGlmICggISB3cmFwcGVyLmlzKCAnOmVtcHR5JyApICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGpRdWVyeSggd3JhcHBlciApLmh0bWwoIGVsZW1lbnQgKS5zbGlkZURvd24oICdmYXN0JyApO1xuXG5cdHNldFRpbWVvdXQoXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkoIHdyYXBwZXIgKS5zbGlkZVVwKCAnZmFzdCcgKTtcblx0XHRcdHdyYXBwZXIuaHRtbCggJycgKTtcblx0XHR9LFxuXHRcdDMwMDBcblx0KTtcbn1cblxuLyoqXG4gKiBTYXZlIHRoZSBzZWFyY2ggZm9ybS5cbiAqL1xuZnVuY3Rpb24gc2F2ZUZvcm0oKSB7XG5cdGNvbnN0IGJ1dHRvbiAgID0galF1ZXJ5KCB0aGlzICk7XG5cdGNvbnN0IGZvcm1EYXRhID0gc2VhcmNoRm9ybS5zZXJpYWxpemVBcnJheSgpO1xuXG5cdGJ1dHRvbi5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cblx0ZnVuY3Rpb24gb2tDYWxsYmFjayggbWVzc2FnZSApIHtcblx0XHRidXR0b24ucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBpbml0aWFsIGZvcm0gZGF0YSBhZnRlciBzdWNjZXNzZnVsbHkgc2F2aW5nIHRoZSBmb3JtLlxuXHRcdGluaXRpYWxGb3JtU3RhdGUgPSBmb3JtRGF0YTtcblxuXHRcdHNob3dNZXNzYWdlKCBtZXNzYWdlICk7XG5cdH1cblxuXHRmdW5jdGlvbiBlcnJDYWxsYmFjayggbWVzc2FnZSApIHtcblx0XHRidXR0b24ucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdHNob3dNZXNzYWdlKCBtZXNzYWdlLCAnZXJyb3InICk7XG5cdH1cblxuXHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTkxODEyNTJcblx0d3AuYWpheC5wb3N0KCBmb3JtRGF0YSApLmRvbmUoIG9rQ2FsbGJhY2sgKS5mYWlsKCBlcnJDYWxsYmFjayApO1xufVxuXG5qUXVlcnkoICcjcG9zdGJveC1jb250YWluZXItMScgKS5vbiggJ2NsaWNrJywgJ2J1dHRvbicsIHNhdmVGb3JtICk7XG5cbi8qKlxuICogU2hvdyBhbGVydCBvbiBsZWF2ZSBpZiB0aGUgZm9ybSBpcyBkaXJ0eS5cbiAqXG4gKiBUT0RPOiBVbmNvbW1lbnQgdGhpcy5cbiAqL1xuLy8gd2luZG93Lm9uYmVmb3JldW5sb2FkID0gZnVuY3Rpb24oKSB7XG4vLyBcdGNvbnN0IG5ld0Zvcm1TdGF0ZSA9IHNlYXJjaEZvcm0uc2VyaWFsaXplQXJyYXkoKTtcbi8vXG4vLyBcdGNvbnN0IGlzRm9ybURpcnR5ID0gISBfLmlzRXF1YWwoIG5ld0Zvcm1TdGF0ZSwgaW5pdGlhbEZvcm1TdGF0ZSApO1xuLy9cbi8vIFx0aWYgKCBpc0Zvcm1EaXJ0eSApIHtcbi8vIFx0XHRyZXR1cm4gJyc7XG4vLyBcdH1cbi8vIH07XG4iXX0=
