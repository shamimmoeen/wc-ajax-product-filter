"use strict";

/**
 * The time since options of date field.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function ($) {
  var $searchForm = $('#search-form');
  $searchForm.on('after_toggle_request', function (e, handler, value, $field) {
    if ('.wcapf-form-sub-field-date_display_type select' === handler) {
      var $dateUIGroup = $field.find('.date-ui-group');
      var $timePeriodGroup = $field.find('.time-period-group');

      if ('input_date' === value || 'input_date_range' === value) {
        $dateUIGroup.show();
        $timePeriodGroup.hide();
      } else {
        $dateUIGroup.hide();
        $timePeriodGroup.show();
      }
    }
  });

  function triggerTimePeriodOptionsChange($field) {
    var $valueHolder = $field.find('.wcapf-form-sub-field-time_period_options input');
    var $optionsTable = $field.find('.time-period-options-table');
    var $rows = $optionsTable.find('.manual-options-table-body-rows');
    var _rows = [];
    $rows.find('.time-period-item').each(function (i, _item) {
      var $item = $(_item);
      var value = $item.find('.option_value').val();
      var label = $item.find('.option_label').val();
      var difference_type = $item.find('.difference_type').val();
      var difference_amount = $item.find('.difference_amount').val();
      var difference_unit = $item.find('.difference_unit').val();

      if (value) {
        _rows.push([value, label, difference_type, difference_amount, difference_unit]);
      }
    });
    var rawValues = encodeURIComponent(JSON.stringify(_rows));
    $valueHolder.val(rawValues);
  }

  function initSortableForTimePeriodOptions($selector) {
    $selector.sortable({
      opacity: 0.8,
      revert: false,
      cursor: 'move',
      axis: 'y',
      handle: '.move-options-handler',
      placeholder: 'widget-placeholder',
      update: function update(e) {
        var $field = $(e.target).closest('.wcapf-form-field');
        triggerTimePeriodOptionsChange($field);
      }
    }).disableSelection();
  } // Sort Manual Options


  initSortableForTimePeriodOptions($searchForm.find('.time-period-options-table .manual-options-table-body-rows'));
  $searchForm.on('field_added', function (e, ui) {
    // Init Sortable for the manual options.
    initSortableForTimePeriodOptions($(ui.item.find('.manual-options-table-body-rows')));
  });

  function triggerRemoveTimePeriodOption($field) {
    var $optionsTable = $field.find('.time-period-options-table');
    var tableRows = $optionsTable.find('.manual-options-table-body-rows').children();

    if (2 > tableRows.length) {
      $optionsTable.removeClass('has-options');
    }
  } // Remove Single Number Option


  $searchForm.on('click', '.remove-time-period-option', function () {
    var $item = $(this).closest('.time-period-item');
    var $field = $item.closest('.wcapf-form-field');
    triggerRemoveTimePeriodOption($field);
    $item.remove();
    triggerTimePeriodOptionsChange($field);
  }); // Clear All Options

  $searchForm.on('click', '.clear-all-time-period-options', function () {
    var $field = $(this).closest('.wcapf-form-field');
    var $optionsTable = $field.find('.time-period-options-table');
    $optionsTable.find('.manual-options-table-body-rows').empty();
    triggerRemoveTimePeriodOption($field);
    triggerTimePeriodOptionsChange($field);
  }); // Add New Option

  $searchForm.on('click', '.add-time-period-option', function () {
    var fieldType = 'wcapf-time-period-option'; // Bail out if no tmpl found for the type.

    if (!jQuery('#tmpl-' + fieldType).length) {
      return;
    }

    var $field = $(this).closest('.wcapf-form-field');
    var options = {
      value: '',
      label: '',
      difference_type: '',
      difference_amount: '1',
      difference_unit: ''
    };
    var template = wp.template(fieldType);
    var rendered = template(options);
    var $wrapper = $field.find('.time-period-options-table');
    var $rows = $wrapper.find('.manual-options-table-body-rows');
    $rows.append(rendered);
    triggerTimePeriodOptionsChange($field);

    if (!$wrapper.hasClass('has-options')) {
      $wrapper.addClass('has-options');
    }
  });
  var rowInputs = '.time-period-options-table input[type="text"],' + ' .time-period-options-table .option_value,' + ' .time-period-options-table .difference_type,' + ' .time-period-options-table .difference_unit';
  $searchForm.on('input', rowInputs, function () {
    var $field = $(this).closest('.wcapf-form-field');
    triggerTimePeriodOptionsChange($field);
  });
  $searchForm.on('change', '.time-period-item .option_value', function () {
    var $periodOption = $(this);
    var periodOption = $periodOption.val();
    var $periodOptionItem = $periodOption.closest('.time-period-item');
    var $customPeriod = $periodOptionItem.find('.custom-time-period');

    if ('custom' === periodOption) {
      $customPeriod.slideDown();
    } else {
      $customPeriod.slideUp();
    }
  });
});
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
 * The product status field.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function ($) {
  var $searchForm = $('#search-form');

  function triggerProductStatusOptionsChange($field) {
    var $valueHolder = $field.find('.wcapf-form-sub-field-product_status_options input');
    var $optionsTable = $field.find('.product-status-options-table');
    var $rows = $optionsTable.find('.manual-options-table-body-rows');
    var _rows = [];
    $rows.find('.item').each(function (i, _item) {
      var $item = $(_item);
      var value = $item.find('.option_value').val();
      var label = $item.find('.option_label').val();

      if (value) {
        _rows.push([value, label]);
      }
    });
    var rawValues = encodeURIComponent(JSON.stringify(_rows));
    $valueHolder.val(rawValues);
  }

  function initSortableForProductStatusOptions($selector) {
    $selector.sortable({
      opacity: 0.8,
      revert: false,
      cursor: 'move',
      axis: 'y',
      handle: '.move-options-handler',
      placeholder: 'widget-placeholder',
      update: function update(e) {
        var $field = $(e.target).closest('.wcapf-form-field');
        triggerProductStatusOptionsChange($field);
      }
    }).disableSelection();
  } // Sort Manual Options


  initSortableForProductStatusOptions($searchForm.find('.product-status-options-table .manual-options-table-body-rows'));
  $searchForm.on('field_added', function (e, ui) {
    // Init Sortable for the manual options.
    initSortableForProductStatusOptions($(ui.item.find('.manual-options-table-body-rows')));
  });

  function triggerRemoveProductStatusOption($field) {
    var $optionsTable = $field.find('.product-status-options-table');
    var tableRows = $optionsTable.find('.manual-options-table-body-rows').children();

    if (2 > tableRows.length) {
      $optionsTable.removeClass('has-options');
    }
  } // Remove Single Number Option


  $searchForm.on('click', '.remove-product-status-option', function () {
    var $item = $(this).closest('.item');
    var $field = $item.closest('.wcapf-form-field');
    triggerRemoveProductStatusOption($field);
    $item.remove();
    triggerProductStatusOptionsChange($field);
  }); // Clear All Options

  $searchForm.on('click', '.clear-all-product-status-options', function () {
    var $field = $(this).closest('.wcapf-form-field');
    var $optionsTable = $field.find('.product-status-options-table');
    $optionsTable.find('.manual-options-table-body-rows').empty();
    triggerRemoveProductStatusOption($field);
    triggerProductStatusOptionsChange($field);
  }); // Add New Option

  $searchForm.on('click', '.add-product-status-option', function () {
    var fieldType = 'wcapf-product-status-option'; // Bail out if no tmpl found for the type.

    if (!jQuery('#tmpl-' + fieldType).length) {
      return;
    }

    var $field = $(this).closest('.wcapf-form-field');
    var template = wp.template(fieldType);
    var rendered = template({
      value: '',
      label: ''
    });
    var $wrapper = $field.find('.product-status-options-table');
    var $rows = $wrapper.find('.manual-options-table-body-rows');
    $rows.append(rendered);
    triggerProductStatusOptionsChange($field);

    if (!$wrapper.hasClass('has-options')) {
      $wrapper.addClass('has-options');
    }
  });
  $searchForm.on('input', '.product-status-options-table input[type="text"]', function () {
    var $field = $(this).closest('.wcapf-form-field');
    triggerProductStatusOptionsChange($field);
  });
  $searchForm.on('change', '.product-status-options-table .option_value', function () {
    var $field = $(this).closest('.wcapf-form-field');
    triggerProductStatusOptionsChange($field);
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
    'handler': '.wcapf-form-sub-field-date_display_type select',
    'handlerType': 'select',
    'event': 'change',
    'dependant': [{
      'selector': '.date-to-ui-options',
      'value': ['input_date_range']
    }, {
      'selector': '.wcapf-form-sub-field-date_format',
      'value': ['input_date', 'input_date_range']
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
"use strict";

/**
 * The product status field.
 *
 * @since      3.0.0
 * @package    wc-ajax-product-filter
 * @subpackage wc-ajax-product-filter/admin/src/js
 * @author     Mainul Hassan Main
 */
jQuery(document).ready(function ($) {
  var $searchForm = $('#search-form');

  function triggerSortByOptionsChange($field) {
    var $valueHolder = $field.find('.wcapf-form-sub-field-sort_by_options input');
    var $optionsTable = $field.find('.sort-by-options-table');
    var $rows = $optionsTable.find('.manual-options-table-body-rows');
    var _rows = [];
    $rows.find('.sort-option-item').each(function (i, _item) {
      var $item = $(_item);
      var value = $item.find('.option_value').val();
      var direction = $item.find('.option_direction').val();
      var label = $item.find('.option_label').val();
      var meta_key = $item.find('.option_meta_key').val();
      var meta_sort_type = $item.find('.option_meta_sort_type').val();

      if (value) {
        _rows.push([value, direction, label, meta_key, meta_sort_type]);
      }
    });
    var rawValues = encodeURIComponent(JSON.stringify(_rows));
    $valueHolder.val(rawValues);
  }

  function initSortableForSortByOptions($selector) {
    $selector.sortable({
      opacity: 0.8,
      revert: false,
      cursor: 'move',
      axis: 'y',
      handle: '.move-options-handler',
      placeholder: 'widget-placeholder',
      update: function update(e) {
        var $field = $(e.target).closest('.wcapf-form-field');
        triggerSortByOptionsChange($field);
      }
    }).disableSelection();
  } // Sort Manual Options


  initSortableForSortByOptions($searchForm.find('.sort-by-options-table .manual-options-table-body-rows'));
  $searchForm.on('field_added', function (e, ui) {
    // Init Sortable for the manual options.
    initSortableForSortByOptions($(ui.item.find('.manual-options-table-body-rows')));
  });

  function triggerRemoveSortByOption($field) {
    var $optionsTable = $field.find('.sort-by-options-table');
    var tableRows = $optionsTable.find('.manual-options-table-body-rows').children();

    if (2 > tableRows.length) {
      $optionsTable.removeClass('has-options');
    }
  } // Remove Single Number Option


  $searchForm.on('click', '.remove-sort-by-option', function () {
    var $item = $(this).closest('.sort-option-item');
    var $field = $item.closest('.wcapf-form-field');
    triggerRemoveSortByOption($field);
    $item.remove();
    triggerSortByOptionsChange($field);
  }); // Clear All Options

  $searchForm.on('click', '.clear-all-sort-by-options', function () {
    var $field = $(this).closest('.wcapf-form-field');
    var $optionsTable = $field.find('.sort-by-options-table');
    $optionsTable.find('.manual-options-table-body-rows').empty();
    triggerRemoveSortByOption($field);
    triggerSortByOptionsChange($field);
  }); // Add New Option

  $searchForm.on('click', '.add-sort-by-option', function () {
    var fieldType = 'wcapf-sort-by-option'; // Bail out if no tmpl found for the type.

    if (!jQuery('#tmpl-' + fieldType).length) {
      return;
    }

    var $field = $(this).closest('.wcapf-form-field');
    var template = wp.template(fieldType);
    var rendered = template({
      value: '',
      direction: '',
      label: ''
    });
    var $wrapper = $field.find('.sort-by-options-table');
    var $rows = $wrapper.find('.manual-options-table-body-rows');
    $rows.append(rendered);
    triggerSortByOptionsChange($field);

    if (!$wrapper.hasClass('has-options')) {
      $wrapper.addClass('has-options');
    }
  });
  var rowInputs = '.sort-by-options-table input[type="text"],' + ' .sort-by-options-table .option_value,' + ' .sort-by-options-table .option_direction,' + ' .sort-by-options-table .option_meta_key,' + ' .sort-by-options-table .option_meta_sort_type';
  $searchForm.on('input', rowInputs, function () {
    var $field = $(this).closest('.wcapf-form-field');
    triggerSortByOptionsChange($field);
  });
  $searchForm.on('change', '.sort-option-item .option_value', function () {
    var $sortOption = $(this);
    var sortOption = $sortOption.val();
    var $sortOptionItem = $sortOption.closest('.sort-option-item');
    var $metaData = $sortOptionItem.find('.meta-data');

    if ('meta_value' === sortOption) {
      $metaData.slideDown();
    } else {
      $metaData.slideUp();
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGUtdGltZS1wZXJpb2Qtb3B0aW9ucy5qcyIsInBvc3QtbWV0YS1vcHRpb25zLmpzIiwicHJvZHVjdC1zdGF0dXMtb3B0aW9ucy5qcyIsInNlYXJjaC1mb3JtLWZpZWxkLmpzIiwic2VhcmNoLWZvcm0uanMiLCJzb3J0LWJ5LW9wdGlvbnMuanMiXSwibmFtZXMiOlsialF1ZXJ5IiwiZG9jdW1lbnQiLCJyZWFkeSIsIiQiLCIkc2VhcmNoRm9ybSIsIm9uIiwiZSIsImhhbmRsZXIiLCJ2YWx1ZSIsIiRmaWVsZCIsIiRkYXRlVUlHcm91cCIsImZpbmQiLCIkdGltZVBlcmlvZEdyb3VwIiwic2hvdyIsImhpZGUiLCJ0cmlnZ2VyVGltZVBlcmlvZE9wdGlvbnNDaGFuZ2UiLCIkdmFsdWVIb2xkZXIiLCIkb3B0aW9uc1RhYmxlIiwiJHJvd3MiLCJfcm93cyIsImVhY2giLCJpIiwiX2l0ZW0iLCIkaXRlbSIsInZhbCIsImxhYmVsIiwiZGlmZmVyZW5jZV90eXBlIiwiZGlmZmVyZW5jZV9hbW91bnQiLCJkaWZmZXJlbmNlX3VuaXQiLCJwdXNoIiwicmF3VmFsdWVzIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiSlNPTiIsInN0cmluZ2lmeSIsImluaXRTb3J0YWJsZUZvclRpbWVQZXJpb2RPcHRpb25zIiwiJHNlbGVjdG9yIiwic29ydGFibGUiLCJvcGFjaXR5IiwicmV2ZXJ0IiwiY3Vyc29yIiwiYXhpcyIsImhhbmRsZSIsInBsYWNlaG9sZGVyIiwidXBkYXRlIiwidGFyZ2V0IiwiY2xvc2VzdCIsImRpc2FibGVTZWxlY3Rpb24iLCJ1aSIsIml0ZW0iLCJ0cmlnZ2VyUmVtb3ZlVGltZVBlcmlvZE9wdGlvbiIsInRhYmxlUm93cyIsImNoaWxkcmVuIiwibGVuZ3RoIiwicmVtb3ZlQ2xhc3MiLCJyZW1vdmUiLCJlbXB0eSIsImZpZWxkVHlwZSIsIm9wdGlvbnMiLCJ0ZW1wbGF0ZSIsIndwIiwicmVuZGVyZWQiLCIkd3JhcHBlciIsImFwcGVuZCIsImhhc0NsYXNzIiwiYWRkQ2xhc3MiLCJyb3dJbnB1dHMiLCIkcGVyaW9kT3B0aW9uIiwicGVyaW9kT3B0aW9uIiwiJHBlcmlvZE9wdGlvbkl0ZW0iLCIkY3VzdG9tUGVyaW9kIiwic2xpZGVEb3duIiwic2xpZGVVcCIsInBhcmFtcyIsIndpbmRvdyIsImhpZXJhcmNoaWNhbERhdGEiLCJpc0hpZXJhcmNoaWNhbCIsIiRkZXBlbmRhbnRGaWVsZHMiLCJpbml0U29ydGFibGVGb3JNYW51YWxPcHRpb25zIiwidHJpZ2dlck1hbnVhbE9wdGlvbnNDaGFuZ2UiLCJ0cmlnZ2VyUmVtb3ZlT3B0aW9uIiwiJHBvc3RNZXRhT3B0aW9uc01vZGFsIiwiJG5vS2V5Rm91bmRNZXNzYWdlIiwiJHBvc3RNZXRhTW9kYWxMb2FkZXIiLCIkcG9zdE1ldGFPcHRpb25zIiwiJHBvc3RNZXRhTW9kYWxGb290ZXIiLCJwb3N0TWV0YU9wdGlvbnNNb2RhbEluc3RhbmNlIiwicmVtb2RhbCIsImhhc2hUcmFja2luZyIsIiRwb3N0TWV0YUZpZWxkIiwicmVzZXRQb3N0TWV0YU1vZGFsIiwiaHRtbCIsInByb3AiLCIkaW5wdXRNZXRhS2V5IiwibWV0YUtleSIsIm9wZW4iLCJva0NhbGxiYWNrIiwicmVzcG9uc2UiLCJlcnJDYWxsYmFjayIsIm1lc3NhZ2UiLCJjb25zb2xlIiwibG9nIiwiZm9ybURhdGEiLCJrZXkiLCJhY3Rpb24iLCJhamF4IiwicG9zdCIsImRvbmUiLCJmYWlsIiwiJG9wdGlvbnMiLCJpc1JlcGxhY2UiLCJyb3dzIiwiaXMiLCJpbnB1dCIsIiRpbnB1dCIsImNsb3NlIiwiJHNlbGVjdEVsbSIsIm9yZGVyQnkiLCJkZXBlbmRhbnRPcHRpb25zIiwiYXR0ciIsImNoYW5nZSIsInJlbW92ZUF0dHIiLCJkaXNhYmxlT3JkZXJCeU9wdGlvbnMiLCIkZWxtIiwiJG9yZGVyRGlyZWN0aW9uRmllbGQiLCIkb3JkZXJUeXBlRmllbGQiLCIkdGhpcyIsImluaXRTb3J0YWJsZUZvck51bWJlck1hbnVhbE9wdGlvbnMiLCJ0cmlnZ2VyTnVtYmVyTWFudWFsT3B0aW9uc0NoYW5nZSIsInRyaWdnZXJSZW1vdmVOdW1iZXJPcHRpb24iLCJtaW5fdmFsdWUiLCJtYXhfdmFsdWUiLCIkZ2V0T3B0aW9ucyIsIiRhdXRvT3B0aW9ucyIsIiRtYW51YWxPcHRpb25zVGFibGUiLCJkaXNwbGF5VHlwZSIsInRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQiLCIkdGV4dEZpZWxkIiwidG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCIsIiRzb2Z0TGltaXRGaWVsZHMiLCIkdmFsdWVUeXBlRmllbGQiLCJ2YWx1ZVR5cGUiLCJkaXNwbGF5VHlwZXMiLCJpbmNsdWRlcyIsIiRudW1iZXJEaXNwbGF5VHlwZUZpZWxkIiwibnVtYmVyRGlzcGxheVR5cGUiLCJudW1iZXJEaXNwbGF5VHlwZXMiLCIkdGV4dERpc3BsYXlUeXBlRmllbGQiLCJ0ZXh0RGlzcGxheVR5cGUiLCJ0ZXh0RGlzcGxheVR5cGVzIiwiJHZhbHVlVHlwZSIsInBvc3RQcm9wZXJ0eURhdGEiLCJ0cmlnZ2VyUHJvZHVjdFN0YXR1c09wdGlvbnNDaGFuZ2UiLCJpbml0U29ydGFibGVGb3JQcm9kdWN0U3RhdHVzT3B0aW9ucyIsInRyaWdnZXJSZW1vdmVQcm9kdWN0U3RhdHVzT3B0aW9uIiwiZGVwZW5kYW50RGF0YSIsIl90cmlnZ2VySW5wdXRUeXBlVGV4dERpc3BsYXlUeXBlQ2hhbmdlIiwiJG5vUmVzdWx0cyIsIiRhbGxJdGVtc0xhYmVsIiwidXNlQ2hvc2VuIiwiX3RyaWdnZXJJbnB1dFR5cGVOdW1iZXJEaXNwbGF5VHlwZUNoYW5nZSIsIl90cmlnZ2VySW5wdXRUeXBlVGV4dFVzZVNlbGVjdENoYW5nZSIsIl90cmlnZ2VySW5wdXRUeXBlTnVtYmVyVXNlU2VsZWN0Q2hhbmdlIiwiX2hhbmRsZVRvZ2dsZVJlcXVlc3QiLCJkYXRhIiwiY3VycmVudFNlbGVjdG9yIiwiaGFuZGxlclR5cGUiLCJkZXBlbmRhbnQiLCJfdmFsdWUiLCJpZCIsImQiLCJ2YWxpZFZhbHVlcyIsInRyaWdnZXIiLCJoYW5kbGVUb2dnbGVSZXF1ZXN0IiwiJGhhbmRsZXIiLCJfdGhpcyIsInNldHVwU2VhcmNoRm9ybSIsImluaXRhbCIsImV2ZW50IiwidG90YWxGaWVsZEluc3RhbmNlcyIsInNlYXJjaEZvcm0iLCJyZW1vdmVQbGFjZWhvbGRlciIsInVuaXF1ZUlkIiwiZWxlbWVudHMiLCJlbGVtZW50Iiwib2xkVmFsdWUiLCJuZXdWYWx1ZSIsInJlcGxhY2UiLCJpbnNlcnRGaWVsZFN1YkZpZWxkcyIsInR5cGUiLCJwYXJzZUludCIsIndyYXBwZXIiLCJwcmVwZW5kIiwidXBkYXRlRmllbGRzUG9zaXRpb24iLCJpbnB1dHMiLCJuYkVsZW1zIiwiaWR4IiwibWFrZUZpZWxkUmVhZHkiLCJ0b2dnbGVCdG4iLCJpZGVudGlmaWVyIiwiY29udGFpbmVyIiwiY2FuY2VsIiwiaXRlbXMiLCJjb25uZWN0V2l0aCIsInN0b3AiLCJzdGFydCIsImFwcGVuZFRvIiwicGFyZW50Iiwib25EcmFnU3RhcnQiLCJvbkRyYWdTdG9wIiwiZHJhZ2dhYmxlIiwiY29ubmVjdFRvU29ydGFibGUiLCJoZWxwZXIiLCJ0b2dnbGVGaWVsZCIsIndpZGdldCIsImluc2lkZSIsImlzRXhwYW5kIiwidG9nZ2xlRXhwYW5kIiwic2xpZGVUb2dnbGUiLCJ0b2dnbGVDbGFzcyIsImZvY3VzRmllbGQiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImZvY3VzIiwicmVtb3ZlRmllbGQiLCJpbml0aWFsRm9ybVN0YXRlIiwic2VyaWFsaXplQXJyYXkiLCJzaG93TWVzc2FnZSIsInNldFRpbWVvdXQiLCJzYXZlRm9ybSIsImJ1dHRvbiIsInRyaWdnZXJTb3J0QnlPcHRpb25zQ2hhbmdlIiwiZGlyZWN0aW9uIiwibWV0YV9rZXkiLCJtZXRhX3NvcnRfdHlwZSIsImluaXRTb3J0YWJsZUZvclNvcnRCeU9wdGlvbnMiLCJ0cmlnZ2VyUmVtb3ZlU29ydEJ5T3B0aW9uIiwiJHNvcnRPcHRpb24iLCJzb3J0T3B0aW9uIiwiJHNvcnRPcHRpb25JdGVtIiwiJG1ldGFEYXRhIl0sIm1hcHBpbmdz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UUFBTXNOLGVBQWUsR0FBR0YsV0FBVyxDQUFDL0wsT0FBWixDQUFxQixtQkFBckIsQ0FBeEI7QUFDQSxRQUFNa00sU0FBUyxHQUFTRCxlQUFlLENBQUNuTyxJQUFoQixDQUFzQixZQUF0QixDQUF4Qjs7QUFFQSxRQUFLLGlCQUFpQmtPLFVBQXRCLEVBQW1DO0FBQ2xDRSxNQUFBQSxTQUFTLENBQUN6SyxTQUFWO0FBQ0EsS0FGRCxNQUVPO0FBQ055SyxNQUFBQSxTQUFTLENBQUN4SyxPQUFWO0FBQ0E7QUFDRCxHQVhEO0FBYUEsQ0F0SUQiLCJmaWxlIjoid2MtYWpheC1wcm9kdWN0LWZpbHRlci1hZG1pbi1zY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgdGltZSBzaW5jZSBvcHRpb25zIG9mIGRhdGUgZmllbGQuXG4gKlxuICogQHNpbmNlICAgICAgMy4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXJcbiAqIEBzdWJwYWNrYWdlIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXIvYWRtaW4vc3JjL2pzXG4gKiBAYXV0aG9yICAgICBNYWludWwgSGFzc2FuIE1haW5cbiAqL1xuXG5qUXVlcnkoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCAkICkge1xuXG5cdGNvbnN0ICRzZWFyY2hGb3JtID0gJCggJyNzZWFyY2gtZm9ybScgKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRhdGVfZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkZGF0ZVVJR3JvdXAgICAgID0gJGZpZWxkLmZpbmQoICcuZGF0ZS11aS1ncm91cCcgKTtcblx0XHRcdGNvbnN0ICR0aW1lUGVyaW9kR3JvdXAgPSAkZmllbGQuZmluZCggJy50aW1lLXBlcmlvZC1ncm91cCcgKTtcblxuXHRcdFx0aWYgKCAnaW5wdXRfZGF0ZScgPT09IHZhbHVlIHx8ICdpbnB1dF9kYXRlX3JhbmdlJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHRcdCRkYXRlVUlHcm91cC5zaG93KCk7XG5cdFx0XHRcdCR0aW1lUGVyaW9kR3JvdXAuaGlkZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGRhdGVVSUdyb3VwLmhpZGUoKTtcblx0XHRcdFx0JHRpbWVQZXJpb2RHcm91cC5zaG93KCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0ZnVuY3Rpb24gdHJpZ2dlclRpbWVQZXJpb2RPcHRpb25zQ2hhbmdlKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJHZhbHVlSG9sZGVyICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXRpbWVfcGVyaW9kX29wdGlvbnMgaW5wdXQnICk7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLnRpbWUtcGVyaW9kLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgICAgICA9ICRvcHRpb25zVGFibGUuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICk7XG5cdFx0Y29uc3QgX3Jvd3MgICAgICAgICA9IFtdO1xuXG5cdFx0JHJvd3MuZmluZCggJy50aW1lLXBlcmlvZC1pdGVtJyApLmVhY2goIGZ1bmN0aW9uKCBpLCBfaXRlbSApIHtcblx0XHRcdGNvbnN0ICRpdGVtICAgICAgICAgICAgID0gJCggX2l0ZW0gKTtcblx0XHRcdGNvbnN0IHZhbHVlICAgICAgICAgICAgID0gJGl0ZW0uZmluZCggJy5vcHRpb25fdmFsdWUnICkudmFsKCk7XG5cdFx0XHRjb25zdCBsYWJlbCAgICAgICAgICAgICA9ICRpdGVtLmZpbmQoICcub3B0aW9uX2xhYmVsJyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgZGlmZmVyZW5jZV90eXBlICAgPSAkaXRlbS5maW5kKCAnLmRpZmZlcmVuY2VfdHlwZScgKS52YWwoKTtcblx0XHRcdGNvbnN0IGRpZmZlcmVuY2VfYW1vdW50ID0gJGl0ZW0uZmluZCggJy5kaWZmZXJlbmNlX2Ftb3VudCcgKS52YWwoKTtcblx0XHRcdGNvbnN0IGRpZmZlcmVuY2VfdW5pdCAgID0gJGl0ZW0uZmluZCggJy5kaWZmZXJlbmNlX3VuaXQnICkudmFsKCk7XG5cblx0XHRcdGlmICggdmFsdWUgKSB7XG5cdFx0XHRcdF9yb3dzLnB1c2goIFsgdmFsdWUsIGxhYmVsLCBkaWZmZXJlbmNlX3R5cGUsIGRpZmZlcmVuY2VfYW1vdW50LCBkaWZmZXJlbmNlX3VuaXQgXSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGNvbnN0IHJhd1ZhbHVlcyA9IGVuY29kZVVSSUNvbXBvbmVudCggSlNPTi5zdHJpbmdpZnkoIF9yb3dzICkgKTtcblx0XHQkdmFsdWVIb2xkZXIudmFsKCByYXdWYWx1ZXMgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXRTb3J0YWJsZUZvclRpbWVQZXJpb2RPcHRpb25zKCAkc2VsZWN0b3IgKSB7XG5cdFx0JHNlbGVjdG9yLnNvcnRhYmxlKCB7XG5cdFx0XHRvcGFjaXR5OiAwLjgsXG5cdFx0XHRyZXZlcnQ6IGZhbHNlLFxuXHRcdFx0Y3Vyc29yOiAnbW92ZScsXG5cdFx0XHRheGlzOiAneScsXG5cdFx0XHRoYW5kbGU6ICcubW92ZS1vcHRpb25zLWhhbmRsZXInLFxuXHRcdFx0cGxhY2Vob2xkZXI6ICd3aWRnZXQtcGxhY2Vob2xkZXInLFxuXHRcdFx0dXBkYXRlOiBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkID0gJCggZS50YXJnZXQgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRcdFx0dHJpZ2dlclRpbWVQZXJpb2RPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0XHRcdH1cblx0XHR9ICkuZGlzYWJsZVNlbGVjdGlvbigpO1xuXHR9XG5cblx0Ly8gU29ydCBNYW51YWwgT3B0aW9uc1xuXHRpbml0U29ydGFibGVGb3JUaW1lUGVyaW9kT3B0aW9ucyggJHNlYXJjaEZvcm0uZmluZCggJy50aW1lLXBlcmlvZC1vcHRpb25zLXRhYmxlIC5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkgKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oIGUsIHVpICkge1xuXHRcdC8vIEluaXQgU29ydGFibGUgZm9yIHRoZSBtYW51YWwgb3B0aW9ucy5cblx0XHRpbml0U29ydGFibGVGb3JUaW1lUGVyaW9kT3B0aW9ucyggJCggdWkuaXRlbS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKSApICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyUmVtb3ZlVGltZVBlcmlvZE9wdGlvbiggJGZpZWxkICkge1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggJy50aW1lLXBlcmlvZC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0IHRhYmxlUm93cyAgICAgPSAkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApLmNoaWxkcmVuKCk7XG5cblx0XHRpZiAoIDIgPiB0YWJsZVJvd3MubGVuZ3RoICkge1xuXHRcdFx0JG9wdGlvbnNUYWJsZS5yZW1vdmVDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJlbW92ZSBTaW5nbGUgTnVtYmVyIE9wdGlvblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5yZW1vdmUtdGltZS1wZXJpb2Qtb3B0aW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGl0ZW0gID0gJCggdGhpcyApLmNsb3Nlc3QoICcudGltZS1wZXJpb2QtaXRlbScgKTtcblx0XHRjb25zdCAkZmllbGQgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlVGltZVBlcmlvZE9wdGlvbiggJGZpZWxkICk7XG5cblx0XHQkaXRlbS5yZW1vdmUoKTtcblxuXHRcdHRyaWdnZXJUaW1lUGVyaW9kT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBDbGVhciBBbGwgT3B0aW9uc1xuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5jbGVhci1hbGwtdGltZS1wZXJpb2Qtb3B0aW9ucycsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggJy50aW1lLXBlcmlvZC1vcHRpb25zLXRhYmxlJyApO1xuXG5cdFx0JG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKS5lbXB0eSgpO1xuXG5cdFx0dHJpZ2dlclJlbW92ZVRpbWVQZXJpb2RPcHRpb24oICRmaWVsZCApO1xuXG5cdFx0dHJpZ2dlclRpbWVQZXJpb2RPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIEFkZCBOZXcgT3B0aW9uXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmFkZC10aW1lLXBlcmlvZC1vcHRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCBmaWVsZFR5cGUgPSAnd2NhcGYtdGltZS1wZXJpb2Qtb3B0aW9uJztcblxuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgZmllbGRUeXBlICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRjb25zdCBvcHRpb25zID0ge1xuXHRcdFx0dmFsdWU6ICcnLFxuXHRcdFx0bGFiZWw6ICcnLFxuXHRcdFx0ZGlmZmVyZW5jZV90eXBlOiAnJyxcblx0XHRcdGRpZmZlcmVuY2VfYW1vdW50OiAnMScsXG5cdFx0XHRkaWZmZXJlbmNlX3VuaXQ6ICcnLFxuXHRcdH07XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCBvcHRpb25zICk7XG5cdFx0Y29uc3QgJHdyYXBwZXIgPSAkZmllbGQuZmluZCggJy50aW1lLXBlcmlvZC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0ICRyb3dzICAgID0gJHdyYXBwZXIuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICk7XG5cblx0XHQkcm93cy5hcHBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHR0cmlnZ2VyVGltZVBlcmlvZE9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXG5cdFx0aWYgKCAhICR3cmFwcGVyLmhhc0NsYXNzKCAnaGFzLW9wdGlvbnMnICkgKSB7XG5cdFx0XHQkd3JhcHBlci5hZGRDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fSApO1xuXG5cdGNvbnN0IHJvd0lucHV0cyA9ICcudGltZS1wZXJpb2Qtb3B0aW9ucy10YWJsZSBpbnB1dFt0eXBlPVwidGV4dFwiXSwnICtcblx0XHQnIC50aW1lLXBlcmlvZC1vcHRpb25zLXRhYmxlIC5vcHRpb25fdmFsdWUsJyArXG5cdFx0JyAudGltZS1wZXJpb2Qtb3B0aW9ucy10YWJsZSAuZGlmZmVyZW5jZV90eXBlLCcgK1xuXHRcdCcgLnRpbWUtcGVyaW9kLW9wdGlvbnMtdGFibGUgLmRpZmZlcmVuY2VfdW5pdCc7XG5cblx0JHNlYXJjaEZvcm0ub24oICdpbnB1dCcsIHJvd0lucHV0cywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdHRyaWdnZXJUaW1lUGVyaW9kT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NoYW5nZScsICcudGltZS1wZXJpb2QtaXRlbSAub3B0aW9uX3ZhbHVlJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHBlcmlvZE9wdGlvbiAgICAgPSAkKCB0aGlzICk7XG5cdFx0Y29uc3QgcGVyaW9kT3B0aW9uICAgICAgPSAkcGVyaW9kT3B0aW9uLnZhbCgpO1xuXHRcdGNvbnN0ICRwZXJpb2RPcHRpb25JdGVtID0gJHBlcmlvZE9wdGlvbi5jbG9zZXN0KCAnLnRpbWUtcGVyaW9kLWl0ZW0nICk7XG5cdFx0Y29uc3QgJGN1c3RvbVBlcmlvZCAgICAgPSAkcGVyaW9kT3B0aW9uSXRlbS5maW5kKCAnLmN1c3RvbS10aW1lLXBlcmlvZCcgKTtcblxuXHRcdGlmICggJ2N1c3RvbScgPT09IHBlcmlvZE9wdGlvbiApIHtcblx0XHRcdCRjdXN0b21QZXJpb2Quc2xpZGVEb3duKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRjdXN0b21QZXJpb2Quc2xpZGVVcCgpO1xuXHRcdH1cblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIFRoZSBwb3N0IG1ldGEgZmllbGQuXG4gKlxuICogQHNpbmNlICAgICAgMS4wLjBcbiAqIEBwYWNrYWdlICAgIHdjLWFqYXgtcHJvZHVjdC1maWx0ZXItcHJvXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyLXByby9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgJHNlYXJjaEZvcm0gPSAkKCAnI3NlYXJjaC1mb3JtJyApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtY3VzdG9tLXRheG9ub215IHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCBwYXJhbXMgICAgICAgICAgID0gd2luZG93WyAnd2NhcGZfYWRtaW5fcGFyYW1zJyBdO1xuXHRcdFx0Y29uc3QgaGllcmFyY2hpY2FsRGF0YSA9IHBhcmFtc1sgJ3RheG9ub215X2hpZXJhcmNoaWNhbF9kYXRhJyBdO1xuXG5cdFx0XHRpZiAoICEgaGllcmFyY2hpY2FsRGF0YSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBpc0hpZXJhcmNoaWNhbCAgID0gaGllcmFyY2hpY2FsRGF0YVsgdmFsdWUgXTtcblx0XHRcdGNvbnN0ICRkZXBlbmRhbnRGaWVsZHMgPSAkZmllbGQuZmluZChcblx0XHRcdFx0Jy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1oaWVyYXJjaGljYWwsIC53Y2FwZi1mb3JtLXN1Yi1maWVsZC1zaG93X2NoaWxkcmVuX29ubHknXG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAoIGlzSGllcmFyY2hpY2FsICkge1xuXHRcdFx0XHQkZGVwZW5kYW50RmllbGRzLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRkZXBlbmRhbnRGaWVsZHMuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdGZ1bmN0aW9uIGluaXRTb3J0YWJsZUZvck1hbnVhbE9wdGlvbnMoICRzZWxlY3RvciApIHtcblx0XHQkc2VsZWN0b3Iuc29ydGFibGUoIHtcblx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdHJldmVydDogZmFsc2UsXG5cdFx0XHRjdXJzb3I6ICdtb3ZlJyxcblx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdGhhbmRsZTogJy5tb3ZlLW9wdGlvbnMtaGFuZGxlcicsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHR1cGRhdGU6IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBlLnRhcmdldCApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdFx0XHR0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdFx0XHR9XG5cdFx0fSApLmRpc2FibGVTZWxlY3Rpb24oKTtcblx0fVxuXG5cdC8vIFNvcnQgTWFudWFsIE9wdGlvbnNcblx0aW5pdFNvcnRhYmxlRm9yTWFudWFsT3B0aW9ucyggJHNlYXJjaEZvcm0uZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZSAubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCBlLCB1aSApIHtcblx0XHQvLyBJbml0IFNvcnRhYmxlIGZvciB0aGUgbWFudWFsIG9wdGlvbnMuXG5cdFx0aW5pdFNvcnRhYmxlRm9yTWFudWFsT3B0aW9ucyggJCggdWkuaXRlbS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKSApICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyUmVtb3ZlT3B0aW9uKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0IHRhYmxlUm93cyAgICAgPSAkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApLmNoaWxkcmVuKCk7XG5cblx0XHRpZiAoIDIgPiB0YWJsZVJvd3MubGVuZ3RoICkge1xuXHRcdFx0JG9wdGlvbnNUYWJsZS5yZW1vdmVDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJlbW92ZSBTaW5nbGUgT3B0aW9uXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLnJlbW92ZS1vcHRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkaXRlbSAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5pdGVtJyApO1xuXHRcdGNvbnN0ICRmaWVsZCA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApO1xuXG5cdFx0JGl0ZW0ucmVtb3ZlKCk7XG5cblx0XHR0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBDbGVhciBBbGwgT3B0aW9uc1xuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5jbGVhci1hbGwtb3B0aW9ucycsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblxuXHRcdCRvcHRpb25zVGFibGUuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkuZW1wdHkoKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVPcHRpb24oICRmaWVsZCApO1xuXG5cdFx0dHJpZ2dlck1hbnVhbE9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQWRkIE5ldyBPcHRpb25cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcuYWRkLW9wdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1wb3N0LW1ldGEtb3B0aW9uJztcblxuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgZmllbGRUeXBlICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCB7IHZhbHVlOiAnJywgbGFiZWw6ICcnIH0gKTtcblx0XHRjb25zdCAkd3JhcHBlciA9ICRmaWVsZC5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0ICRyb3dzICAgID0gJHdyYXBwZXIuZmluZCggJy5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICk7XG5cblx0XHQkcm93cy5hcHBlbmQoIHJlbmRlcmVkICk7XG5cblx0XHRpZiAoICEgJHdyYXBwZXIuaGFzQ2xhc3MoICdoYXMtb3B0aW9ucycgKSApIHtcblx0XHRcdCR3cmFwcGVyLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0Y29uc3QgJHBvc3RNZXRhT3B0aW9uc01vZGFsID0gJCggJy5wb3N0LW1ldGEtb3B0aW9ucy1tb2RhbCcgKTtcblx0Y29uc3QgJG5vS2V5Rm91bmRNZXNzYWdlICAgID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLmZpbmQoICcubm8ta2V5LWZvdW5kLW1lc3NhZ2UnICk7XG5cdGNvbnN0ICRwb3N0TWV0YU1vZGFsTG9hZGVyICA9ICRwb3N0TWV0YU9wdGlvbnNNb2RhbC5maW5kKCAnLnBvc3QtbWV0YS1vcHRpb25zLWxvYWRlcicgKTtcblx0Y29uc3QgJHBvc3RNZXRhT3B0aW9ucyAgICAgID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLmZpbmQoICcucG9zdC1tZXRhLW9wdGlvbnMnICk7XG5cdGNvbnN0ICRwb3N0TWV0YU1vZGFsRm9vdGVyICA9ICRwb3N0TWV0YU9wdGlvbnNNb2RhbC5maW5kKCAnLndjYXBmLW1vZGFsLWZvb3RlcicgKTtcblxuXHRjb25zdCBwb3N0TWV0YU9wdGlvbnNNb2RhbEluc3RhbmNlID0gJHBvc3RNZXRhT3B0aW9uc01vZGFsLnJlbW9kYWwoIHtcblx0XHRoYXNoVHJhY2tpbmc6IGZhbHNlLFxuXHR9ICk7XG5cblx0bGV0ICRwb3N0TWV0YUZpZWxkID0gbnVsbDtcblxuXHRmdW5jdGlvbiByZXNldFBvc3RNZXRhTW9kYWwoKSB7XG5cdFx0JHBvc3RNZXRhT3B0aW9ucy5odG1sKCAnJyApO1xuXHRcdCRwb3N0TWV0YU1vZGFsTG9hZGVyLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdCRub0tleUZvdW5kTWVzc2FnZS5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHQkcG9zdE1ldGFNb2RhbEZvb3Rlci5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHQkcG9zdE1ldGFPcHRpb25zTW9kYWwuZmluZCggJy5yZXBsYWNlLWN1cnJlbnQtb3B0aW9ucycgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdH1cblxuXHQvLyBCcm93c2UgVmFsdWVzXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmJyb3dzZS12YWx1ZXMnLCBmdW5jdGlvbigpIHtcblx0XHRyZXNldFBvc3RNZXRhTW9kYWwoKTtcblxuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICRpbnB1dE1ldGFLZXkgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tZXRhX2tleSBzZWxlY3QnICk7XG5cdFx0Y29uc3QgbWV0YUtleSAgICAgICA9ICRpbnB1dE1ldGFLZXkudmFsKCk7XG5cblx0XHRpZiAoICEgbWV0YUtleSApIHtcblx0XHRcdCRub0tleUZvdW5kTWVzc2FnZS5hZGRDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JG5vS2V5Rm91bmRNZXNzYWdlLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xuXHRcdH1cblxuXHRcdHBvc3RNZXRhT3B0aW9uc01vZGFsSW5zdGFuY2Uub3BlbigpO1xuXHRcdCRwb3N0TWV0YUZpZWxkID0gJGZpZWxkO1xuXG5cdFx0aWYgKCAhIG1ldGFLZXkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gU2hvdyB0aGUgbG9hZGluZyBhbmltYXRpb24uXG5cdFx0JHBvc3RNZXRhTW9kYWxMb2FkZXIuYWRkQ2xhc3MoICdhY3RpdmUnICk7XG5cblx0XHQvKipcblx0XHQgKiBBamF4J3Mgc3VjY2VzcyBmdW5jdGlvbi5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSByZXNwb25zZVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIG9rQ2FsbGJhY2soIHJlc3BvbnNlICkge1xuXHRcdFx0Ly8gSGlkZSB0aGUgbG9hZGluZyBhbmltYXRpb24uXG5cdFx0XHQkcG9zdE1ldGFNb2RhbExvYWRlci5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcblx0XHRcdCRwb3N0TWV0YU1vZGFsRm9vdGVyLmFkZENsYXNzKCAnYWN0aXZlJyApO1xuXG5cdFx0XHQkcG9zdE1ldGFPcHRpb25zLmh0bWwoIHJlc3BvbnNlICk7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogQWpheCdzIGVycm9yIGZ1bmN0aW9uLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIG1lc3NhZ2Vcblx0XHQgKi9cblx0XHRmdW5jdGlvbiBlcnJDYWxsYmFjayggbWVzc2FnZSApIHtcblx0XHRcdGNvbnNvbGUubG9nKCAnZXJyb3InLCBtZXNzYWdlICk7XG5cblx0XHRcdC8vIEhpZGUgdGhlIGxvYWRpbmcgYW5pbWF0aW9uLlxuXHRcdFx0JHBvc3RNZXRhTW9kYWxMb2FkZXIucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgZm9ybURhdGEgPSB7XG5cdFx0XHRrZXk6IG1ldGFLZXksXG5cdFx0XHRhY3Rpb246ICd3Y2FwZl9nZXRfbWV0YV9vcHRpb25zJyxcblx0XHR9XG5cblx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTkxODEyNTJcblx0XHR3cC5hamF4LnBvc3QoIGZvcm1EYXRhICkuZG9uZSggb2tDYWxsYmFjayApLmZhaWwoIGVyckNhbGxiYWNrICk7XG5cdH0gKTtcblxuXHQvKipcblx0ICogUmVzZXQgdGhlIHBvc3QgbWV0YSBvcHRpb24ncyBtb2RhbCB3aGVuIG1vZGFsIGdldHMgY2xvc2VkLlxuXHQgKi9cblx0JCggZG9jdW1lbnQgKS5vbiggJ2Nsb3NlZCcsICRwb3N0TWV0YU9wdGlvbnNNb2RhbCwgZnVuY3Rpb24oKSB7XG5cdFx0cmVzZXRQb3N0TWV0YU1vZGFsKCk7XG5cdFx0JHBvc3RNZXRhRmllbGQgPSBudWxsO1xuXHR9ICk7XG5cblx0Ly8gVW5zZWxlY3QgYWxsIHZhbHVlcy5cblx0JHBvc3RNZXRhT3B0aW9uc01vZGFsLm9uKCAnY2xpY2snLCAnLnNlbGVjdC1ub25lJywgZnVuY3Rpb24oKSB7XG5cdFx0JHBvc3RNZXRhT3B0aW9ucy5maW5kKCAnW3R5cGU9XCJjaGVja2JveFwiXScgKS5wcm9wKCAnY2hlY2tlZCcsIGZhbHNlICk7XG5cdH0gKTtcblxuXHQvLyBTZWxlY3QgYWxsIHZhbHVlcy5cblx0JHBvc3RNZXRhT3B0aW9uc01vZGFsLm9uKCAnY2xpY2snLCAnLnNlbGVjdC1hbGwnLCBmdW5jdGlvbigpIHtcblx0XHQkcG9zdE1ldGFPcHRpb25zLmZpbmQoICdbdHlwZT1cImNoZWNrYm94XCJdJyApLnByb3AoICdjaGVja2VkJywgdHJ1ZSApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gdHJpZ2dlck1hbnVhbE9wdGlvbnNDaGFuZ2UoICRwb3N0TWV0YUZpZWxkICkge1xuXHRcdGNvbnN0ICR2YWx1ZUhvbGRlciAgPSAkcG9zdE1ldGFGaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1hbnVhbF9vcHRpb25zIGlucHV0JyApO1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkcG9zdE1ldGFGaWVsZC5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0ICRyb3dzICAgICAgICAgPSAkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApO1xuXHRcdGNvbnN0IF9yb3dzICAgICAgICAgPSBbXTtcblxuXHRcdCRyb3dzLmZpbmQoICcuaXRlbScgKS5lYWNoKCBmdW5jdGlvbiggaSwgX2l0ZW0gKSB7XG5cdFx0XHRjb25zdCAkaXRlbSA9ICQoIF9pdGVtICk7XG5cdFx0XHRjb25zdCB2YWx1ZSA9ICRpdGVtLmZpbmQoICcub3B0aW9uX3ZhbHVlJyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgbGFiZWwgPSAkaXRlbS5maW5kKCAnLm9wdGlvbl9sYWJlbCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCB2YWx1ZSAmJiBsYWJlbCApIHtcblx0XHRcdFx0X3Jvd3MucHVzaCggWyB2YWx1ZSwgbGFiZWwgXSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGNvbnN0IHJhd1ZhbHVlcyA9IGVuY29kZVVSSUNvbXBvbmVudCggSlNPTi5zdHJpbmdpZnkoIF9yb3dzICkgKTtcblx0XHQkdmFsdWVIb2xkZXIudmFsKCByYXdWYWx1ZXMgKTtcblx0fVxuXG5cdC8vIEFkZCBzZWxlY3RlZCBvcHRpb25zLlxuXHQkcG9zdE1ldGFPcHRpb25zTW9kYWwub24oICdjbGljaycsICcuYWRkLW9wdGlvbnMnLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkb3B0aW9ucyA9ICRwb3N0TWV0YU9wdGlvbnMuZmluZCggJ1t0eXBlPVwiY2hlY2tib3hcIl0nICk7XG5cdFx0bGV0IGlzUmVwbGFjZSAgPSBmYWxzZTtcblx0XHRsZXQgcm93cyAgICAgICA9ICcnO1xuXG5cdFx0aWYgKCAkcG9zdE1ldGFNb2RhbEZvb3Rlci5maW5kKCAnLnJlcGxhY2UtY3VycmVudC1vcHRpb25zJyApLmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRpc1JlcGxhY2UgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICggJG9wdGlvbnMgKSB7XG5cdFx0XHRjb25zdCBmaWVsZFR5cGUgPSAnd2NhcGYtcG9zdC1tZXRhLW9wdGlvbic7XG5cblx0XHRcdCQuZWFjaCggJG9wdGlvbnMsIGZ1bmN0aW9uKCBpLCBpbnB1dCApIHtcblx0XHRcdFx0Y29uc3QgJGlucHV0ID0gJCggaW5wdXQgKTtcblx0XHRcdFx0Y29uc3QgdmFsdWUgID0gJGlucHV0LnZhbCgpO1xuXG5cdFx0XHRcdGlmICggJGlucHV0LmlzKCAnOmNoZWNrZWQnICkgKSB7XG5cdFx0XHRcdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggZmllbGRUeXBlICk7XG5cdFx0XHRcdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSggeyB2YWx1ZSwgbGFiZWw6IHZhbHVlIH0gKTtcblxuXHRcdFx0XHRcdHJvd3MgKz0gcmVuZGVyZWQ7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpZiAoIHJvd3MgKSB7XG5cdFx0XHRjb25zdCAkd3JhcHBlciA9ICRwb3N0TWV0YUZpZWxkLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0XHRjb25zdCAkcm93cyAgICA9ICR3cmFwcGVyLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApO1xuXG5cdFx0XHRpZiAoIGlzUmVwbGFjZSApIHtcblx0XHRcdFx0JHJvd3MuaHRtbCggcm93cyApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHJvd3MuYXBwZW5kKCByb3dzICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISAkd3JhcHBlci5oYXNDbGFzcyggJ2hhcy1vcHRpb25zJyApICkge1xuXHRcdFx0XHQkd3JhcHBlci5hZGRDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdFx0fVxuXG5cdFx0XHR0cmlnZ2VyTWFudWFsT3B0aW9uc0NoYW5nZSggJHBvc3RNZXRhRmllbGQgKTtcblx0XHR9XG5cblx0XHRwb3N0TWV0YU9wdGlvbnNNb2RhbEluc3RhbmNlLmNsb3NlKCk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWdldF9vcHRpb25zIGlucHV0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRzZWxlY3RFbG0gICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1vcHRpb25zX29yZGVyX2J5IHNlbGVjdCcgKTtcblx0XHRcdGNvbnN0IG9yZGVyQnkgICAgICAgICAgPSAkc2VsZWN0RWxtLnZhbCgpO1xuXHRcdFx0Y29uc3QgZGVwZW5kYW50T3B0aW9ucyA9ICdvcHRpb25bdmFsdWU9XCJsYWJlbFwiXSc7XG5cblx0XHRcdGlmICggJ2F1dG9tYXRpY2FsbHknID09PSB2YWx1ZSApIHtcblx0XHRcdFx0JHNlbGVjdEVsbS5jaGlsZHJlbiggZGVwZW5kYW50T3B0aW9ucyApLmF0dHIoICdkaXNhYmxlZCcsICdkaXNhYmxlZCcgKTtcblxuXHRcdFx0XHRpZiAoICdsYWJlbCcgPT09IG9yZGVyQnkgKSB7XG5cdFx0XHRcdFx0JHNlbGVjdEVsbS5wcm9wKCAnc2VsZWN0ZWRJbmRleCcsIDEgKS5jaGFuZ2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHNlbGVjdEVsbS5jaGlsZHJlbiggZGVwZW5kYW50T3B0aW9ucyApLnJlbW92ZUF0dHIoICdkaXNhYmxlZCcgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHRmdW5jdGlvbiBkaXNhYmxlT3JkZXJCeU9wdGlvbnMoICRlbG0gKSB7XG5cdFx0Y29uc3QgdmFsdWUgICAgICAgICAgICAgICAgPSAkZWxtLnZhbCgpO1xuXHRcdGNvbnN0ICR3cmFwcGVyICAgICAgICAgICAgID0gJGVsbS5jbG9zZXN0KCAnLndjYXBmLXBvc3QtbWV0YS1vcmRlci1vcHRpb25zLWZpZWxkJyApO1xuXHRcdGNvbnN0ICRvcmRlckRpcmVjdGlvbkZpZWxkID0gJHdyYXBwZXIuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1vcHRpb25zX29yZGVyX2RpciBzZWxlY3QnICk7XG5cdFx0Y29uc3QgJG9yZGVyVHlwZUZpZWxkICAgICAgPSAkd3JhcHBlci5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW9wdGlvbnNfb3JkZXJfdHlwZSBzZWxlY3QnICk7XG5cblx0XHRpZiAoICdub25lJyA9PT0gdmFsdWUgKSB7XG5cdFx0XHQkb3JkZXJEaXJlY3Rpb25GaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0XHQkb3JkZXJUeXBlRmllbGQuYXR0ciggJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkb3JkZXJEaXJlY3Rpb25GaWVsZC5yZW1vdmVBdHRyKCAnZGlzYWJsZWQnICk7XG5cdFx0XHQkb3JkZXJUeXBlRmllbGQucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdH1cblx0fVxuXG5cdCRzZWFyY2hGb3JtLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtb3B0aW9uc19vcmRlcl9ieSBzZWxlY3QnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHRkaXNhYmxlT3JkZXJCeU9wdGlvbnMoICR0aGlzICk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NoYW5nZScsICcud2NhcGYtZm9ybS1zdWItZmllbGQtb3B0aW9uc19vcmRlcl9ieSBzZWxlY3QnLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdGRpc2FibGVPcmRlckJ5T3B0aW9ucyggJHRoaXMgKTtcblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnaW5wdXQnLCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGZpZWxkID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdHRyaWdnZXJNYW51YWxPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8qKlxuXHQgKiBWYWx1ZSB0eXBlICdOdW1iZXInXG5cdCAqL1xuXG5cdGZ1bmN0aW9uIGluaXRTb3J0YWJsZUZvck51bWJlck1hbnVhbE9wdGlvbnMoICRzZWxlY3RvciApIHtcblx0XHQkc2VsZWN0b3Iuc29ydGFibGUoIHtcblx0XHRcdG9wYWNpdHk6IDAuOCxcblx0XHRcdHJldmVydDogZmFsc2UsXG5cdFx0XHRjdXJzb3I6ICdtb3ZlJyxcblx0XHRcdGF4aXM6ICd5Jyxcblx0XHRcdGhhbmRsZTogJy5tb3ZlLW9wdGlvbnMtaGFuZGxlcicsXG5cdFx0XHRwbGFjZWhvbGRlcjogJ3dpZGdldC1wbGFjZWhvbGRlcicsXG5cdFx0XHR1cGRhdGU6IGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRjb25zdCAkZmllbGQgPSAkKCBlLnRhcmdldCApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdFx0XHR0cmlnZ2VyTnVtYmVyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdFx0XHR9XG5cdFx0fSApLmRpc2FibGVTZWxlY3Rpb24oKTtcblx0fVxuXG5cdC8vIFNvcnQgTnVtYmVyIE1hbnVhbCBPcHRpb25zXG5cdGluaXRTb3J0YWJsZUZvck51bWJlck1hbnVhbE9wdGlvbnMoICRzZWFyY2hGb3JtLmZpbmQoICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlIC5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkgKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oIGUsIHVpICkge1xuXHRcdC8vIEluaXQgU29ydGFibGUgZm9yIHRoZSBudW1iZXIgbWFudWFsIG9wdGlvbnMuXG5cdFx0aW5pdFNvcnRhYmxlRm9yTnVtYmVyTWFudWFsT3B0aW9ucyggJCggdWkuaXRlbS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKSApICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyUmVtb3ZlTnVtYmVyT3B0aW9uKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblx0XHRjb25zdCB0YWJsZVJvd3MgICAgID0gJG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKS5jaGlsZHJlbigpO1xuXG5cdFx0aWYgKCAyID4gdGFibGVSb3dzLmxlbmd0aCApIHtcblx0XHRcdCRvcHRpb25zVGFibGUucmVtb3ZlQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiB0cmlnZ2VyTnVtYmVyTWFudWFsT3B0aW9uc0NoYW5nZSggJHBvc3RNZXRhRmllbGQgKSB7XG5cdFx0Y29uc3QgJHZhbHVlSG9sZGVyICA9ICRwb3N0TWV0YUZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX21hbnVhbF9vcHRpb25zIGlucHV0JyApO1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkcG9zdE1ldGFGaWVsZC5maW5kKCAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblx0XHRjb25zdCAkcm93cyAgICAgICAgID0gJG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKTtcblx0XHRjb25zdCBfcm93cyAgICAgICAgID0gW107XG5cblx0XHQkcm93cy5maW5kKCAnLml0ZW0nICkuZWFjaCggZnVuY3Rpb24oIGksIF9pdGVtICkge1xuXHRcdFx0Y29uc3QgJGl0ZW0gICAgID0gJCggX2l0ZW0gKTtcblx0XHRcdGNvbnN0IG1pbl92YWx1ZSA9ICRpdGVtLmZpbmQoICcub3B0aW9uX21pbl92YWx1ZScgKS52YWwoKTtcblx0XHRcdGNvbnN0IG1heF92YWx1ZSA9ICRpdGVtLmZpbmQoICcub3B0aW9uX21heF92YWx1ZScgKS52YWwoKTtcblx0XHRcdGNvbnN0IGxhYmVsICAgICA9ICRpdGVtLmZpbmQoICcub3B0aW9uX2xhYmVsJyApLnZhbCgpO1xuXG5cdFx0XHRpZiAoIG1pbl92YWx1ZSAmJiBtYXhfdmFsdWUgJiYgbGFiZWwgKSB7XG5cdFx0XHRcdF9yb3dzLnB1c2goIFsgbWluX3ZhbHVlLCBtYXhfdmFsdWUsIGxhYmVsIF0gKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHRjb25zdCByYXdWYWx1ZXMgPSBlbmNvZGVVUklDb21wb25lbnQoIEpTT04uc3RyaW5naWZ5KCBfcm93cyApICk7XG5cdFx0JHZhbHVlSG9sZGVyLnZhbCggcmF3VmFsdWVzICk7XG5cdH1cblxuXHQvLyBSZW1vdmUgU2luZ2xlIE51bWJlciBPcHRpb25cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcucmVtb3ZlLW51bWJlci1vcHRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkaXRlbSAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5pdGVtJyApO1xuXHRcdGNvbnN0ICRmaWVsZCA9ICRpdGVtLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblxuXHRcdHRyaWdnZXJSZW1vdmVOdW1iZXJPcHRpb24oICRmaWVsZCApO1xuXG5cdFx0JGl0ZW0ucmVtb3ZlKCk7XG5cblx0XHR0cmlnZ2VyTnVtYmVyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBDbGVhciBBbGwgT3B0aW9uc1xuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5jbGVhci1hbGwtbnVtYmVyLW9wdGlvbnMnLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkZmllbGQgICAgICAgID0gJCggdGhpcyApLmNsb3Nlc3QoICcud2NhcGYtZm9ybS1maWVsZCcgKTtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoICcubnVtYmVyLW1hbnVhbC1vcHRpb25zLXRhYmxlJyApO1xuXG5cdFx0JG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKS5lbXB0eSgpO1xuXG5cdFx0dHJpZ2dlclJlbW92ZU51bWJlck9wdGlvbiggJGZpZWxkICk7XG5cblx0XHR0cmlnZ2VyTnVtYmVyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBBZGQgTmV3IE9wdGlvblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5hZGQtbnVtYmVyLW9wdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1wb3N0LW1ldGEtdHlwZS1udW1iZXItb3B0aW9uJztcblxuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgZmllbGRUeXBlICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCB7IHZhbHVlOiAnJywgbGFiZWw6ICcnIH0gKTtcblx0XHRjb25zdCAkd3JhcHBlciA9ICRmaWVsZC5maW5kKCAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblx0XHRjb25zdCAkcm93cyAgICA9ICR3cmFwcGVyLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApO1xuXG5cdFx0JHJvd3MuYXBwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0aWYgKCAhICR3cmFwcGVyLmhhc0NsYXNzKCAnaGFzLW9wdGlvbnMnICkgKSB7XG5cdFx0XHQkd3JhcHBlci5hZGRDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fSApO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnaW5wdXQnLCAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZSBpbnB1dFt0eXBlPVwidGV4dFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHR0cmlnZ2VyTnVtYmVyTWFudWFsT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9kaXNwbGF5X3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRnZXRPcHRpb25zICAgICAgICAgPSAkZmllbGQuZmluZCggJy5udW1iZXItZ2V0LW9wdGlvbnMnICk7XG5cdFx0XHRjb25zdCAkYXV0b09wdGlvbnMgICAgICAgID0gJGZpZWxkLmZpbmQoICcubnVtYmVyLWF1dG9tYXRpYy1vcHRpb25zJyApO1xuXHRcdFx0Y29uc3QgJG1hbnVhbE9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScgKTtcblx0XHRcdGNvbnN0ICRlbG0gICAgICAgICAgICAgICAgPSAkZmllbGQuZmluZCggaGFuZGxlciApO1xuXHRcdFx0Y29uc3QgZGlzcGxheVR5cGUgICAgICAgICA9ICRlbG0udmFsKCk7XG5cblx0XHRcdGlmICggJ3JhbmdlX3NsaWRlcicgPT09IGRpc3BsYXlUeXBlIHx8ICdyYW5nZV9udW1iZXInID09PSBkaXNwbGF5VHlwZSApIHtcblx0XHRcdFx0JGdldE9wdGlvbnMuaGlkZSgpO1xuXHRcdFx0XHQkbWFudWFsT3B0aW9uc1RhYmxlLmFkZENsYXNzKCAnZm9yY2UtaGlkZScgKTtcblx0XHRcdFx0JGF1dG9PcHRpb25zLmFkZENsYXNzKCAnZm9yY2Utc2hvdycgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRnZXRPcHRpb25zLnNob3coKTtcblx0XHRcdFx0JG1hbnVhbE9wdGlvbnNUYWJsZS5yZW1vdmVDbGFzcyggJ2ZvcmNlLWhpZGUnICk7XG5cdFx0XHRcdCRhdXRvT3B0aW9ucy5yZW1vdmVDbGFzcyggJ2ZvcmNlLXNob3cnICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0ZnVuY3Rpb24gdG9nZ2xlTnVtYmVyTWluVmFsdWVGaWVsZCggJGVsbSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgID0gJGVsbS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJHRleHRGaWVsZCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1pbl92YWx1ZSBpbnB1dFt0eXBlPVwidGV4dFwiXScgKTtcblxuXHRcdGlmICggJGVsbS5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0JHRleHRGaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCR0ZXh0RmllbGQucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdH1cblx0fVxuXG5cdCRzZWFyY2hGb3JtLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWluX3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdHRvZ2dsZU51bWJlck1pblZhbHVlRmllbGQoICR0aGlzICk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1taW5fdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHR0b2dnbGVOdW1iZXJNaW5WYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHR9ICk7XG5cblx0ZnVuY3Rpb24gdG9nZ2xlTnVtYmVyTWF4VmFsdWVGaWVsZCggJGVsbSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgID0gJGVsbS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgJHRleHRGaWVsZCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW1heF92YWx1ZSBpbnB1dFt0eXBlPVwidGV4dFwiXScgKTtcblxuXHRcdGlmICggJGVsbS5pcyggJzpjaGVja2VkJyApICkge1xuXHRcdFx0JHRleHRGaWVsZC5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCR0ZXh0RmllbGQucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdH1cblx0fVxuXG5cdCRzZWFyY2hGb3JtLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbWF4X3ZhbHVlX2F1dG9fZGV0ZWN0IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCAkdGhpcyA9ICQoIHRoaXMgKTtcblxuXHRcdHRvZ2dsZU51bWJlck1heFZhbHVlRmllbGQoICR0aGlzICk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1tYXhfdmFsdWVfYXV0b19kZXRlY3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKCB0aGlzICk7XG5cblx0XHR0b2dnbGVOdW1iZXJNYXhWYWx1ZUZpZWxkKCAkdGhpcyApO1xuXHR9ICk7XG5cblx0Ly8gVG9nZ2xlIHNvZnQgbGltaXQgZmllbGRzIHdoZW4gZGlzcGxheSB0eXBlIGlzIGNoYW5nZWQuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkc29mdExpbWl0RmllbGRzID0gJGZpZWxkLmZpbmQoICcuc29mdC1saW1pdC1maWVsZHMnICk7XG5cdFx0XHRjb25zdCAkdmFsdWVUeXBlRmllbGQgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfdHlwZSBzZWxlY3QnICk7XG5cdFx0XHRjb25zdCB2YWx1ZVR5cGUgICAgICAgID0gJHZhbHVlVHlwZUZpZWxkLnZhbCgpO1xuXHRcdFx0Y29uc3QgZGlzcGxheVR5cGVzICAgICA9IFsgJ2NoZWNrYm94JywgJ3JhZGlvJyBdO1xuXG5cdFx0XHRpZiAoICR2YWx1ZVR5cGVGaWVsZC5sZW5ndGggKSB7XG5cdFx0XHRcdGlmICggJ3RleHQnID09PSB2YWx1ZVR5cGUgKSB7XG5cdFx0XHRcdFx0aWYgKCBkaXNwbGF5VHlwZXMuaW5jbHVkZXMoIHZhbHVlICkgKSB7XG5cdFx0XHRcdFx0XHQkc29mdExpbWl0RmllbGRzLnNob3coKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5oaWRlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoIGRpc3BsYXlUeXBlcy5pbmNsdWRlcyggdmFsdWUgKSApIHtcblx0XHRcdFx0XHQkc29mdExpbWl0RmllbGRzLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkc29mdExpbWl0RmllbGRzLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdC8vIFRvZ2dsZSBzb2Z0IGxpbWl0IGZpZWxkcyB3aGVuIG51bWJlciBkaXNwbGF5IHR5cGUgaXMgY2hhbmdlZC5cblx0JHNlYXJjaEZvcm0ub24oICdhZnRlcl90b2dnbGVfcmVxdWVzdCcsIGZ1bmN0aW9uKCBlLCBoYW5kbGVyLCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRjb25zdCAkc29mdExpbWl0RmllbGRzID0gJGZpZWxkLmZpbmQoICcuc29mdC1saW1pdC1maWVsZHMnICk7XG5cdFx0XHRjb25zdCAkdmFsdWVUeXBlRmllbGQgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfdHlwZSBzZWxlY3QnICk7XG5cdFx0XHRjb25zdCB2YWx1ZVR5cGUgICAgICAgID0gJHZhbHVlVHlwZUZpZWxkLnZhbCgpO1xuXHRcdFx0Y29uc3QgZGlzcGxheVR5cGVzICAgICA9IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJyBdO1xuXG5cdFx0XHRpZiAoICR2YWx1ZVR5cGVGaWVsZC5sZW5ndGggKSB7XG5cdFx0XHRcdGlmICggJ251bWJlcicgPT09IHZhbHVlVHlwZSApIHtcblx0XHRcdFx0XHRpZiAoIGRpc3BsYXlUeXBlcy5pbmNsdWRlcyggdmFsdWUgKSApIHtcblx0XHRcdFx0XHRcdCRzb2Z0TGltaXRGaWVsZHMuc2hvdygpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQkc29mdExpbWl0RmllbGRzLmhpZGUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICggZGlzcGxheVR5cGVzLmluY2x1ZGVzKCB2YWx1ZSApICkge1xuXHRcdFx0XHRcdCRzb2Z0TGltaXRGaWVsZHMuc2hvdygpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRzb2Z0TGltaXRGaWVsZHMuaGlkZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0Ly8gVG9nZ2xlIHNvZnQgbGltaXQgZmllbGRzIHdoZW4gdmFsdWUgdHlwZSBpcyBjaGFuZ2VkLlxuXHQkc2VhcmNoRm9ybS5vbiggJ2FmdGVyX3RvZ2dsZV9yZXF1ZXN0JywgZnVuY3Rpb24oIGUsIGhhbmRsZXIsIHZhbHVlLCAkZmllbGQgKSB7XG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXZhbHVlX3R5cGUgc2VsZWN0JyA9PT0gaGFuZGxlciApIHtcblx0XHRcdGNvbnN0ICRzb2Z0TGltaXRGaWVsZHMgPSAkZmllbGQuZmluZCggJy5zb2Z0LWxpbWl0LWZpZWxkcycgKTtcblxuXHRcdFx0Y29uc3QgJG51bWJlckRpc3BsYXlUeXBlRmllbGQgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcgKTtcblx0XHRcdGNvbnN0IG51bWJlckRpc3BsYXlUeXBlICAgICAgID0gJG51bWJlckRpc3BsYXlUeXBlRmllbGQudmFsKCk7XG5cdFx0XHRjb25zdCBudW1iZXJEaXNwbGF5VHlwZXMgICAgICA9IFsgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJyBdO1xuXG5cdFx0XHRjb25zdCAkdGV4dERpc3BsYXlUeXBlRmllbGQgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0JyApO1xuXHRcdFx0Y29uc3QgdGV4dERpc3BsYXlUeXBlICAgICAgID0gJHRleHREaXNwbGF5VHlwZUZpZWxkLnZhbCgpO1xuXHRcdFx0Y29uc3QgdGV4dERpc3BsYXlUeXBlcyAgICAgID0gWyAnY2hlY2tib3gnLCAncmFkaW8nIF07XG5cblx0XHRcdGlmICggJ251bWJlcicgPT09IHZhbHVlICkge1xuXHRcdFx0XHRpZiAoIG51bWJlckRpc3BsYXlUeXBlcy5pbmNsdWRlcyggbnVtYmVyRGlzcGxheVR5cGUgKSApIHtcblx0XHRcdFx0XHQkc29mdExpbWl0RmllbGRzLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkc29mdExpbWl0RmllbGRzLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICggJ3RleHQnID09PSB2YWx1ZSApIHtcblx0XHRcdFx0aWYgKCB0ZXh0RGlzcGxheVR5cGVzLmluY2x1ZGVzKCB0ZXh0RGlzcGxheVR5cGUgKSApIHtcblx0XHRcdFx0XHQkc29mdExpbWl0RmllbGRzLnNob3coKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkc29mdExpbWl0RmllbGRzLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICggJ2RhdGUnID09PSB2YWx1ZSApIHtcblx0XHRcdFx0JHNvZnRMaW1pdEZpZWxkcy5oaWRlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkc29mdExpbWl0RmllbGRzLmhpZGUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHQvLyBTZXQgdGhlIHZhbHVlIHR5cGUgd2hlbiBwb3N0IHByb3BlcnR5IGNoYW5nZWQuXG5cdCRzZWFyY2hGb3JtLm9uKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBmdW5jdGlvbiggZSwgaGFuZGxlciwgdmFsdWUsICRmaWVsZCApIHtcblx0XHRpZiAoICcud2NhcGYtZm9ybS1zdWItZmllbGQtcG9zdF9wcm9wZXJ0eSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0Y29uc3QgJHZhbHVlVHlwZSAgICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXZhbHVlX3R5cGUgc2VsZWN0JyApO1xuXHRcdFx0Y29uc3QgcGFyYW1zICAgICAgICAgICA9IHdpbmRvd1sgJ3djYXBmX2FkbWluX3BhcmFtcycgXTtcblx0XHRcdGNvbnN0IHBvc3RQcm9wZXJ0eURhdGEgPSBwYXJhbXNbICdwb3N0X3Byb3BlcnR5X2RhdGEnIF07XG5cblx0XHRcdGlmICggISBwb3N0UHJvcGVydHlEYXRhICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCB2YWx1ZVR5cGUgPSBwb3N0UHJvcGVydHlEYXRhWyB2YWx1ZSBdO1xuXG5cdFx0XHRpZiAoICEgdmFsdWVUeXBlICkge1xuXHRcdFx0XHR2YWx1ZVR5cGUgPSAnJztcblx0XHRcdH1cblxuXHRcdFx0JHZhbHVlVHlwZS52YWwoIHZhbHVlVHlwZSApLmNoYW5nZSgpO1xuXHRcdH1cblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIFRoZSBwcm9kdWN0IHN0YXR1cyBmaWVsZC5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgJHNlYXJjaEZvcm0gPSAkKCAnI3NlYXJjaC1mb3JtJyApO1xuXG5cdGZ1bmN0aW9uIHRyaWdnZXJQcm9kdWN0U3RhdHVzT3B0aW9uc0NoYW5nZSggJGZpZWxkICkge1xuXHRcdGNvbnN0ICR2YWx1ZUhvbGRlciAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1wcm9kdWN0X3N0YXR1c19vcHRpb25zIGlucHV0JyApO1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggJy5wcm9kdWN0LXN0YXR1cy1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0ICRyb3dzICAgICAgICAgPSAkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApO1xuXHRcdGNvbnN0IF9yb3dzICAgICAgICAgPSBbXTtcblxuXHRcdCRyb3dzLmZpbmQoICcuaXRlbScgKS5lYWNoKCBmdW5jdGlvbiggaSwgX2l0ZW0gKSB7XG5cdFx0XHRjb25zdCAkaXRlbSA9ICQoIF9pdGVtICk7XG5cdFx0XHRjb25zdCB2YWx1ZSA9ICRpdGVtLmZpbmQoICcub3B0aW9uX3ZhbHVlJyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgbGFiZWwgPSAkaXRlbS5maW5kKCAnLm9wdGlvbl9sYWJlbCcgKS52YWwoKTtcblxuXHRcdFx0aWYgKCB2YWx1ZSApIHtcblx0XHRcdFx0X3Jvd3MucHVzaCggWyB2YWx1ZSwgbGFiZWwgXSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGNvbnN0IHJhd1ZhbHVlcyA9IGVuY29kZVVSSUNvbXBvbmVudCggSlNPTi5zdHJpbmdpZnkoIF9yb3dzICkgKTtcblx0XHQkdmFsdWVIb2xkZXIudmFsKCByYXdWYWx1ZXMgKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXRTb3J0YWJsZUZvclByb2R1Y3RTdGF0dXNPcHRpb25zKCAkc2VsZWN0b3IgKSB7XG5cdFx0JHNlbGVjdG9yLnNvcnRhYmxlKCB7XG5cdFx0XHRvcGFjaXR5OiAwLjgsXG5cdFx0XHRyZXZlcnQ6IGZhbHNlLFxuXHRcdFx0Y3Vyc29yOiAnbW92ZScsXG5cdFx0XHRheGlzOiAneScsXG5cdFx0XHRoYW5kbGU6ICcubW92ZS1vcHRpb25zLWhhbmRsZXInLFxuXHRcdFx0cGxhY2Vob2xkZXI6ICd3aWRnZXQtcGxhY2Vob2xkZXInLFxuXHRcdFx0dXBkYXRlOiBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0Y29uc3QgJGZpZWxkID0gJCggZS50YXJnZXQgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRcdFx0dHJpZ2dlclByb2R1Y3RTdGF0dXNPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0XHRcdH1cblx0XHR9ICkuZGlzYWJsZVNlbGVjdGlvbigpO1xuXHR9XG5cblx0Ly8gU29ydCBNYW51YWwgT3B0aW9uc1xuXHRpbml0U29ydGFibGVGb3JQcm9kdWN0U3RhdHVzT3B0aW9ucyggJHNlYXJjaEZvcm0uZmluZCggJy5wcm9kdWN0LXN0YXR1cy1vcHRpb25zLXRhYmxlIC5tYW51YWwtb3B0aW9ucy10YWJsZS1ib2R5LXJvd3MnICkgKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oIGUsIHVpICkge1xuXHRcdC8vIEluaXQgU29ydGFibGUgZm9yIHRoZSBtYW51YWwgb3B0aW9ucy5cblx0XHRpbml0U29ydGFibGVGb3JQcm9kdWN0U3RhdHVzT3B0aW9ucyggJCggdWkuaXRlbS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKSApICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyUmVtb3ZlUHJvZHVjdFN0YXR1c09wdGlvbiggJGZpZWxkICkge1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggJy5wcm9kdWN0LXN0YXR1cy1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0IHRhYmxlUm93cyAgICAgPSAkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApLmNoaWxkcmVuKCk7XG5cblx0XHRpZiAoIDIgPiB0YWJsZVJvd3MubGVuZ3RoICkge1xuXHRcdFx0JG9wdGlvbnNUYWJsZS5yZW1vdmVDbGFzcyggJ2hhcy1vcHRpb25zJyApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJlbW92ZSBTaW5nbGUgTnVtYmVyIE9wdGlvblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5yZW1vdmUtcHJvZHVjdC1zdGF0dXMtb3B0aW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGl0ZW0gID0gJCggdGhpcyApLmNsb3Nlc3QoICcuaXRlbScgKTtcblx0XHRjb25zdCAkZmllbGQgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlUHJvZHVjdFN0YXR1c09wdGlvbiggJGZpZWxkICk7XG5cblx0XHQkaXRlbS5yZW1vdmUoKTtcblxuXHRcdHRyaWdnZXJQcm9kdWN0U3RhdHVzT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQvLyBDbGVhciBBbGwgT3B0aW9uc1xuXHQkc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy5jbGVhci1hbGwtcHJvZHVjdC1zdGF0dXMtb3B0aW9ucycsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggJy5wcm9kdWN0LXN0YXR1cy1vcHRpb25zLXRhYmxlJyApO1xuXG5cdFx0JG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKS5lbXB0eSgpO1xuXG5cdFx0dHJpZ2dlclJlbW92ZVByb2R1Y3RTdGF0dXNPcHRpb24oICRmaWVsZCApO1xuXG5cdFx0dHJpZ2dlclByb2R1Y3RTdGF0dXNPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIEFkZCBOZXcgT3B0aW9uXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmFkZC1wcm9kdWN0LXN0YXR1cy1vcHRpb24nLCBmdW5jdGlvbigpIHtcblx0XHRjb25zdCBmaWVsZFR5cGUgPSAnd2NhcGYtcHJvZHVjdC1zdGF0dXMtb3B0aW9uJztcblxuXHRcdC8vIEJhaWwgb3V0IGlmIG5vIHRtcGwgZm91bmQgZm9yIHRoZSB0eXBlLlxuXHRcdGlmICggISBqUXVlcnkoICcjdG1wbC0nICsgZmllbGRUeXBlICkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHRjb25zdCB0ZW1wbGF0ZSA9IHdwLnRlbXBsYXRlKCBmaWVsZFR5cGUgKTtcblx0XHRjb25zdCByZW5kZXJlZCA9IHRlbXBsYXRlKCB7IHZhbHVlOiAnJywgbGFiZWw6ICcnIH0gKTtcblx0XHRjb25zdCAkd3JhcHBlciA9ICRmaWVsZC5maW5kKCAnLnByb2R1Y3Qtc3RhdHVzLW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgPSAkd3JhcHBlci5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKTtcblxuXHRcdCRyb3dzLmFwcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdHRyaWdnZXJQcm9kdWN0U3RhdHVzT3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cblx0XHRpZiAoICEgJHdyYXBwZXIuaGFzQ2xhc3MoICdoYXMtb3B0aW9ucycgKSApIHtcblx0XHRcdCR3cmFwcGVyLmFkZENsYXNzKCAnaGFzLW9wdGlvbnMnICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdpbnB1dCcsICcucHJvZHVjdC1zdGF0dXMtb3B0aW9ucy10YWJsZSBpbnB1dFt0eXBlPVwidGV4dFwiXScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHR0cmlnZ2VyUHJvZHVjdFN0YXR1c09wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdjaGFuZ2UnLCAnLnByb2R1Y3Qtc3RhdHVzLW9wdGlvbnMtdGFibGUgLm9wdGlvbl92YWx1ZScsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHR0cmlnZ2VyUHJvZHVjdFN0YXR1c09wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cbn0gKTtcbiIsIi8qKlxuICogVGhlIHNlYXJjaCBmb3JtIGZpZWxkLlxuICpcbiAqIEBzaW5jZSAgICAgIDMuMC4wXG4gKiBAcGFja2FnZSAgICB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyXG4gKiBAc3VicGFja2FnZSB3Yy1hamF4LXByb2R1Y3QtZmlsdGVyL2FkbWluL3NyYy9qc1xuICogQGF1dGhvciAgICAgTWFpbnVsIEhhc3NhbiBNYWluXG4gKi9cblxualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbiggJCApIHtcblxuXHRjb25zdCAkc2VhcmNoRm9ybSA9ICQoICcjc2VhcmNoLWZvcm0nICk7XG5cblx0Y29uc3QgZGVwZW5kYW50RGF0YSA9IFtcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtdmFsdWVfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtdGV4dC1maWVsZHMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ3RleHQnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmlucHV0LXR5cGUtbnVtYmVyLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbnVtYmVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5pbnB1dC10eXBlLWRhdGUtZmllbGRzJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdkYXRlJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kaXNwbGF5X3R5cGUgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1xdWVyeV90eXBlJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdjaGVja2JveCcsICdtdWx0aS1zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFkaW8nLCAnc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdzZWxlY3QnLCAnbXVsdGktc2VsZWN0JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdjaGVja2JveCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWdldF9vcHRpb25zIGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmNvbHVtbi1ncm91cC1tZXRhX2tleV9tYW51YWxfb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbWFudWFsX2VudHJ5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NsaWRlcl9kaXNwbGF5X3ZhbHVlc19hcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfcXVlcnlfdHlwZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2VfY2hlY2tib3gnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zZWxlY3RfYWxsX2l0ZW1zX2xhYmVsJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9zaG93X2NvdW50Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9oaWRlX2VtcHR5Jyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdyYW5nZV9jaGVja2JveCcsICdyYW5nZV9yYWRpbycsICdyYW5nZV9zZWxlY3QnLCAncmFuZ2VfbXVsdGlzZWxlY3QnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1kZWNpbWFsLWZpZWxkcycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAncmFuZ2Vfc2xpZGVyJywgJ3JhbmdlX2NoZWNrYm94JywgJ3JhbmdlX3JhZGlvJywgJ3JhbmdlX3NlbGVjdCcsICdyYW5nZV9tdWx0aXNlbGVjdCcgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3VzZV9jaG9zZW4gaW5wdXQnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ2NoZWNrYm94Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdFx0J2RlcGVuZGFudCc6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJzEnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9nZXRfb3B0aW9ucyBpbnB1dCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAncmFkaW8nLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy5udW1iZXItYXV0b21hdGljLW9wdGlvbnMnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2F1dG9tYXRpY2FsbHknIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLm51bWJlci1tYW51YWwtb3B0aW9ucy10YWJsZScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnbWFudWFsX2VudHJ5JyBdLFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHtcblx0XHRcdCdoYW5kbGVyJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1kYXRlX2Rpc3BsYXlfdHlwZSBzZWxlY3QnLFxuXHRcdFx0J2hhbmRsZXJUeXBlJzogJ3NlbGVjdCcsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLmRhdGUtdG8tdWktb3B0aW9ucycsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnaW5wdXRfZGF0ZV9yYW5nZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdzZWxlY3Rvcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtZGF0ZV9mb3JtYXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2lucHV0X2RhdGUnLCAnaW5wdXRfZGF0ZV9yYW5nZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtbGltaXRfdGVybXMgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0XHQnZGVwZW5kYW50JzogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0J3NlbGVjdG9yJzogJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1wYXJlbnRfdGVybScsXG5cdFx0XHRcdFx0J3ZhbHVlJzogWyAnY2hpbGQnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWxpbWl0X3Rlcm1zX2J5X2lkJyxcblx0XHRcdFx0XHQndmFsdWUnOiBbICdpbmNsdWRlJywgJ2V4Y2x1ZGUnIF0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWVuYWJsZV9zb2Z0X2xpbWl0IGlucHV0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdyYWRpbycsXG5cdFx0XHQnZXZlbnQnOiAnY2hhbmdlJyxcblx0XHRcdCdkZXBlbmRhbnQnOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQnc2VsZWN0b3InOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNvZnRfbGltaXQnLFxuXHRcdFx0XHRcdCd2YWx1ZSc6IFsgJ2VuYWJsZScgXSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHR7XG5cdFx0XHQnaGFuZGxlcic6ICcud2NhcGYtZm9ybS1zdWItZmllbGQtY3VzdG9tLXRheG9ub215IHNlbGVjdCcsXG5cdFx0XHQnaGFuZGxlclR5cGUnOiAnc2VsZWN0Jyxcblx0XHRcdCdldmVudCc6ICdjaGFuZ2UnLFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0J2hhbmRsZXInOiAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXBvc3RfcHJvcGVydHkgc2VsZWN0Jyxcblx0XHRcdCdoYW5kbGVyVHlwZSc6ICdzZWxlY3QnLFxuXHRcdFx0J2V2ZW50JzogJ2NoYW5nZScsXG5cdFx0fSxcblx0XTtcblxuXHRmdW5jdGlvbiBfdHJpZ2dlcklucHV0VHlwZVRleHREaXNwbGF5VHlwZUNoYW5nZSggdmFsdWUsICRmaWVsZCApIHtcblx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWNob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0Y29uc3QgdXNlQ2hvc2VuICAgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC11c2VfY2hvc2VuIGlucHV0JyApLmlzKCAnOmNoZWNrZWQnICk7XG5cblx0XHRpZiAoIHVzZUNob3NlbiAmJiAoICdzZWxlY3QnID09PSB2YWx1ZSB8fCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgKSApIHtcblx0XHRcdCRub1Jlc3VsdHMuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkbm9SZXN1bHRzLmhpZGUoKTtcblx0XHR9XG5cblx0XHRpZiAoICggJ3JhZGlvJyA9PT0gdmFsdWUgfHwgJ3NlbGVjdCcgPT09IHZhbHVlICkgfHwgKCAnbXVsdGktc2VsZWN0JyA9PT0gdmFsdWUgJiYgdXNlQ2hvc2VuICkgKSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBfdHJpZ2dlcklucHV0VHlwZU51bWJlckRpc3BsYXlUeXBlQ2hhbmdlKCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX2Nob3Nlbl9ub19yZXN1bHRzX21lc3NhZ2UnICk7XG5cdFx0Y29uc3QgJGFsbEl0ZW1zTGFiZWwgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2Vfc2VsZWN0X2FsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRjb25zdCB1c2VDaG9zZW4gICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV91c2VfY2hvc2VuIGlucHV0JyApLmlzKCAnOmNoZWNrZWQnICk7XG5cblx0XHRpZiAoIHVzZUNob3NlbiAmJiAoICdyYW5nZV9zZWxlY3QnID09PSB2YWx1ZSB8fCAncmFuZ2VfbXVsdGlzZWxlY3QnID09PSB2YWx1ZSApICkge1xuXHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdH1cblxuXHRcdGlmICggKCAncmFuZ2VfcmFkaW8nID09PSB2YWx1ZSB8fCAncmFuZ2Vfc2VsZWN0JyA9PT0gdmFsdWUgKSB8fCAoICdyYW5nZV9tdWx0aXNlbGVjdCcgPT09IHZhbHVlICYmIHVzZUNob3NlbiApICkge1xuXHRcdFx0JGFsbEl0ZW1zTGFiZWwuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5oaWRlKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gX3RyaWdnZXJJbnB1dFR5cGVUZXh0VXNlU2VsZWN0Q2hhbmdlKCB2YWx1ZSwgJGZpZWxkICkge1xuXHRcdGNvbnN0ICRub1Jlc3VsdHMgICAgID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtY2hvc2VuX25vX3Jlc3VsdHNfbWVzc2FnZScgKTtcblx0XHRjb25zdCAkYWxsSXRlbXNMYWJlbCA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWFsbF9pdGVtc19sYWJlbCcgKTtcblx0XHRjb25zdCBkaXNwbGF5VHlwZSAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnICkudmFsKCk7XG5cblx0XHRpZiAoICcxJyA9PT0gdmFsdWUgJiYgKCAnc2VsZWN0JyA9PT0gZGlzcGxheVR5cGUgfHwgJ211bHRpLXNlbGVjdCcgPT09IGRpc3BsYXlUeXBlICkgKSB7XG5cdFx0XHQkbm9SZXN1bHRzLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JG5vUmVzdWx0cy5oaWRlKCk7XG5cdFx0fVxuXG5cdFx0aWYgKFxuXHRcdFx0KCAnMScgPT09IHZhbHVlICYmICdtdWx0aS1zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0XHR8fCAoICdyYWRpbycgPT09IGRpc3BsYXlUeXBlIHx8ICdzZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0KSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBfdHJpZ2dlcklucHV0VHlwZU51bWJlclVzZVNlbGVjdENoYW5nZSggdmFsdWUsICRmaWVsZCApIHtcblx0XHRjb25zdCAkbm9SZXN1bHRzICAgICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLW51bWJlcl9yYW5nZV9jaG9zZW5fbm9fcmVzdWx0c19tZXNzYWdlJyApO1xuXHRcdGNvbnN0ICRhbGxJdGVtc0xhYmVsID0gJGZpZWxkLmZpbmQoICcud2NhcGYtZm9ybS1zdWItZmllbGQtbnVtYmVyX3JhbmdlX3NlbGVjdF9hbGxfaXRlbXNfbGFiZWwnICk7XG5cdFx0Y29uc3QgZGlzcGxheVR5cGUgICAgPSAkZmllbGQuZmluZCggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcgKS52YWwoKTtcblxuXHRcdGlmICggJzEnID09PSB2YWx1ZSAmJiAoICdyYW5nZV9zZWxlY3QnID09PSBkaXNwbGF5VHlwZSB8fCAncmFuZ2VfbXVsdGlzZWxlY3QnID09PSBkaXNwbGF5VHlwZSApICkge1xuXHRcdFx0JG5vUmVzdWx0cy5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRub1Jlc3VsdHMuaGlkZSgpO1xuXHRcdH1cblxuXHRcdGlmIChcblx0XHRcdCggJzEnID09PSB2YWx1ZSAmJiAncmFuZ2VfbXVsdGlzZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0XHR8fCAoICdyYW5nZV9yYWRpbycgPT09IGRpc3BsYXlUeXBlIHx8ICdyYW5nZV9zZWxlY3QnID09PSBkaXNwbGF5VHlwZSApXG5cdFx0KSB7XG5cdFx0XHQkYWxsSXRlbXNMYWJlbC5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRhbGxJdGVtc0xhYmVsLmhpZGUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApIHtcblx0XHRjb25zdCAkZmllbGQgICAgICA9IGN1cnJlbnRTZWxlY3Rvci5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cdFx0Y29uc3QgaGFuZGxlciAgICAgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRjb25zdCBoYW5kbGVyVHlwZSA9IGRhdGFbICdoYW5kbGVyVHlwZScgXTtcblx0XHRjb25zdCBkZXBlbmRhbnQgICA9IGRhdGFbICdkZXBlbmRhbnQnIF07XG5cblx0XHRsZXQgX3ZhbHVlID0gdmFsdWU7XG5cblx0XHRpZiAoICdjaGVja2JveCcgPT09IGhhbmRsZXJUeXBlICkge1xuXHRcdFx0X3ZhbHVlID0gY3VycmVudFNlbGVjdG9yLmlzKCAnOmNoZWNrZWQnICkgPyAnMScgOiAnMCc7XG5cdFx0fVxuXG5cdFx0aWYgKCAncmFkaW8nID09PSBoYW5kbGVyVHlwZSApIHtcblx0XHRcdF92YWx1ZSA9ICRmaWVsZC5maW5kKCBoYW5kbGVyICsgJzpjaGVja2VkJyApLnZhbCgpO1xuXHRcdH1cblxuXHRcdCQuZWFjaCggZGVwZW5kYW50LCBmdW5jdGlvbiggaWQsIGQgKSB7XG5cdFx0XHRjb25zdCAkc2VsZWN0b3IgICA9ICRmaWVsZC5maW5kKCBkWyAnc2VsZWN0b3InIF0gKTtcblx0XHRcdGNvbnN0IHZhbGlkVmFsdWVzID0gZFsgJ3ZhbHVlJyBdO1xuXG5cdFx0XHRpZiAoIHZhbGlkVmFsdWVzLmluY2x1ZGVzKCBfdmFsdWUgKSApIHtcblx0XHRcdFx0JHNlbGVjdG9yLnNob3coKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRzZWxlY3Rvci5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLWRpc3BsYXlfdHlwZSBzZWxlY3QnID09PSBoYW5kbGVyICkge1xuXHRcdFx0X3RyaWdnZXJJbnB1dFR5cGVUZXh0RGlzcGxheVR5cGVDaGFuZ2UoIF92YWx1ZSwgJGZpZWxkICk7XG5cdFx0fVxuXG5cdFx0aWYgKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXVzZV9jaG9zZW4gaW5wdXQnID09PSBoYW5kbGVyICkge1xuXHRcdFx0X3RyaWdnZXJJbnB1dFR5cGVUZXh0VXNlU2VsZWN0Q2hhbmdlKCBfdmFsdWUsICRmaWVsZCApO1xuXHRcdH1cblxuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfZGlzcGxheV90eXBlIHNlbGVjdCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRfdHJpZ2dlcklucHV0VHlwZU51bWJlckRpc3BsYXlUeXBlQ2hhbmdlKCBfdmFsdWUsICRmaWVsZCApO1xuXHRcdH1cblxuXHRcdGlmICggJy53Y2FwZi1mb3JtLXN1Yi1maWVsZC1udW1iZXJfcmFuZ2VfdXNlX2Nob3NlbiBpbnB1dCcgPT09IGhhbmRsZXIgKSB7XG5cdFx0XHRfdHJpZ2dlcklucHV0VHlwZU51bWJlclVzZVNlbGVjdENoYW5nZSggX3ZhbHVlLCAkZmllbGQgKTtcblx0XHR9XG5cblx0XHQkc2VhcmNoRm9ybS50cmlnZ2VyKCAnYWZ0ZXJfdG9nZ2xlX3JlcXVlc3QnLCBbIGhhbmRsZXIsIF92YWx1ZSwgJGZpZWxkIF0gKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIGN1cnJlbnRTZWxlY3RvciwgdmFsdWUgKSB7XG5cdFx0aWYgKCBudWxsID09PSBjdXJyZW50U2VsZWN0b3IgKSB7XG5cdFx0XHRjb25zdCBoYW5kbGVyICA9IGRhdGFbICdoYW5kbGVyJyBdO1xuXHRcdFx0Y29uc3QgJGhhbmRsZXIgPSAkKCBoYW5kbGVyICk7XG5cblx0XHRcdCQuZWFjaCggJGhhbmRsZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBfdGhpcyAgPSAkKCB0aGlzICk7XG5cdFx0XHRcdGNvbnN0IF92YWx1ZSA9IF90aGlzLnZhbCgpO1xuXHRcdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgX3RoaXMsIF92YWx1ZSApO1xuXHRcdFx0fSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRfaGFuZGxlVG9nZ2xlUmVxdWVzdCggZGF0YSwgY3VycmVudFNlbGVjdG9yLCB2YWx1ZSApO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNldHVwU2VhcmNoRm9ybSggaW5pdGFsID0gZmFsc2UgKSB7XG5cdFx0JC5lYWNoKCBkZXBlbmRhbnREYXRhLCBmdW5jdGlvbiggaSwgZGF0YSApIHtcblx0XHRcdGNvbnN0IGhhbmRsZXIgPSBkYXRhWyAnaGFuZGxlcicgXTtcblx0XHRcdGNvbnN0IGV2ZW50ICAgPSBkYXRhWyAnZXZlbnQnIF07XG5cblx0XHRcdGhhbmRsZVRvZ2dsZVJlcXVlc3QoIGRhdGEsIG51bGwsIG51bGwgKTtcblxuXHRcdFx0aWYgKCBpbml0YWwgKSB7XG5cdFx0XHRcdCRzZWFyY2hGb3JtLm9uKCBldmVudCwgaGFuZGxlciwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y29uc3QgX3RoaXMgID0gJCggdGhpcyApO1xuXHRcdFx0XHRcdGNvbnN0IF92YWx1ZSA9ICQoIHRoaXMgKS52YWwoKTtcblx0XHRcdFx0XHRoYW5kbGVUb2dnbGVSZXF1ZXN0KCBkYXRhLCBfdGhpcywgX3ZhbHVlICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cdH1cblxuXHRzZXR1cFNlYXJjaEZvcm0oIHRydWUgKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2ZpZWxkX2FkZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gVG9nZ2xlIHRoZSB2aXNpYmlsaXR5IG9mIHN1YmZpZWxkcy5cblx0XHRzZXR1cFNlYXJjaEZvcm0oKTtcblx0fSApO1xuXG59ICk7XG4iLCIvKipcbiAqIFRoZSBzZWFyY2ggZm9ybS5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmNvbnN0IHRvdGFsRmllbGRJbnN0YW5jZXMgPSBqUXVlcnkoICcjdG90YWxfZmllbGRfaW5zdGFuY2VzJyApO1xuXG5jb25zdCBzZWFyY2hGb3JtID0galF1ZXJ5KCAnI3NlYXJjaC1mb3JtJyApO1xuXG4vKipcbiAqIEFzc2lnbiBhIHVuaXF1ZSBpZCBieSByZXBsYWNpbmcgdGhlIHBsYWNlaG9sZGVyIGlkLlxuICovXG5mdW5jdGlvbiByZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIGVsZW1lbnRzLCBhdHRyICkge1xuXHRlbGVtZW50cy5lYWNoKFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgZWxlbWVudCA9IGpRdWVyeSggdGhpcyApO1xuXG5cdFx0XHRjb25zdCBvbGRWYWx1ZSA9IGVsZW1lbnQuYXR0ciggYXR0ciApO1xuXHRcdFx0Y29uc3QgbmV3VmFsdWUgPSBvbGRWYWx1ZS5yZXBsYWNlKCAnJSUnLCB1bmlxdWVJZCApO1xuXG5cdFx0XHRlbGVtZW50LmF0dHIoIGF0dHIsIG5ld1ZhbHVlICk7XG5cdFx0fVxuXHQpO1xufVxuXG4vKipcbiAqIEluc2VydCB0aGUgZmllbGQncyBzdWJmaWVsZHMuXG4gKi9cbmZ1bmN0aW9uIGluc2VydEZpZWxkU3ViRmllbGRzKCB1aSApIHtcblx0Ly8gSW5zZXJ0IHRoZSBmaWVsZCdzIHN1YmZpZWxkcyBpZiBub3QgYWxyZWFkeSBpbnNlcnRlZC5cblx0aWYgKCAhIHVpLml0ZW0uaGFzQ2xhc3MoICdzdWItZmllbGRzLXJlYWR5JyApICkge1xuXHRcdGNvbnN0IHR5cGUgICAgICA9IHVpLml0ZW0uYXR0ciggJ2RhdGEtZmllbGQtdHlwZScgKTtcblx0XHRjb25zdCB1bmlxdWVJZCAgPSBwYXJzZUludCggdG90YWxGaWVsZEluc3RhbmNlcy52YWwoKSApO1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1mb3JtLWZpZWxkLScgKyB0eXBlO1xuXG5cdFx0Ly8gQmFpbCBvdXQgaWYgbm8gdG1wbCBmb3VuZCBmb3IgdGhlIHR5cGUuXG5cdFx0aWYgKCAhIGpRdWVyeSggJyN0bXBsLScgKyBmaWVsZFR5cGUgKS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gSW5jcmVtZW50IHRoZSB2YWx1ZSBvZiB0b3RhbCBmaWVsZCBpbnN0YW5jZXMuXG5cdFx0dG90YWxGaWVsZEluc3RhbmNlcy52YWwoIHVuaXF1ZUlkICsgMSApO1xuXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggZmllbGRUeXBlICk7XG5cdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSgpO1xuXHRcdGNvbnN0IHdyYXBwZXIgID0gdWkuaXRlbS5maW5kKCAnLndpZGdldC1jb250ZW50JyApO1xuXG5cdFx0d3JhcHBlci5wcmVwZW5kKCByZW5kZXJlZCApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBmb3IgYXR0cmlidXRlcyBvZiB0aGUgbGFiZWxzLlxuXHRcdHJlbW92ZVBsYWNlaG9sZGVyKCB1bmlxdWVJZCwgdWkuaXRlbS5maW5kKCAnbGFiZWxbZm9yXj1cIndjYXBmLWlucHV0LVwiXScgKSwgJ2ZvcicgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgaWRzIG9mIHRoZSBpbnB1dCBlbGVtZW50cy5cblx0XHRyZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIHVpLml0ZW0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtXCJdJyApLCAnaWQnICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIG5hbWVzIG9mIHRoZSBpbnB1dCBlbGVtZW50cy5cblx0XHRyZW1vdmVQbGFjZWhvbGRlciggdW5pcXVlSWQsIHVpLml0ZW0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtXCJdJyApLCAnbmFtZScgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgcG9zaXRpb24gdmFsdWUuXG5cdFx0cmVtb3ZlUGxhY2Vob2xkZXIoIHVuaXF1ZUlkLCB1aS5pdGVtLmZpbmQoICcqW2lkXj1cIndjYXBmLWlucHV0LXBvc2l0aW9uLVwiXScgKSwgJ3ZhbHVlJyApO1xuXG5cdFx0dWkuaXRlbS5hZGRDbGFzcyggJ3N1Yi1maWVsZHMtcmVhZHknICk7XG5cblx0XHRzZWFyY2hGb3JtLnRyaWdnZXIoICdmaWVsZF9hZGRlZCcsIFsgdWkgXSApO1xuXHR9XG59XG5cbi8qKlxuICogVXBkYXRlIHRoZSBmb3JtIGZpZWxkJ3MgcG9zaXRpb24gYWZ0ZXIgc29ydC5cbiAqXG4gKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNDczNjc3NVxuICovXG5mdW5jdGlvbiB1cGRhdGVGaWVsZHNQb3NpdGlvbigpIHtcblx0Y29uc3QgaW5wdXRzICA9IHNlYXJjaEZvcm0uZmluZCggJypbaWRePVwid2NhcGYtaW5wdXQtcG9zaXRpb24tXCJdJyApO1xuXHRjb25zdCBuYkVsZW1zID0gaW5wdXRzLmxlbmd0aDtcblxuXHRpbnB1dHMuZWFjaChcblx0XHRmdW5jdGlvbiggaWR4ICkge1xuXHRcdFx0alF1ZXJ5KCB0aGlzICkudmFsKCBuYkVsZW1zIC0gKCBuYkVsZW1zIC0gaWR4ICkgKTtcblx0XHR9XG5cdCk7XG59XG5cbi8qKlxuICogTWFrZSB0aGUgZmllbGQgcmVhZHksIHJlbW92ZSBzdHlsZXMgY29tZXMgZnJvbSBqcXVlcnktdWktc29ydGFibGUgcGx1Z2luLCBpbnNlcnQgdGhlIGZpZWxkJ3Mgc3ViZmllbGRzIGV0Yy5cbiAqL1xuZnVuY3Rpb24gbWFrZUZpZWxkUmVhZHkoIGUsIHVpICkge1xuXHQvLyBSZW1vdmUgc3R5bGVzIGNvbWVzIGZyb20ganF1ZXJ5LXVpLXNvcnRhYmxlIHBsdWdpbi5cblx0dWkuaXRlbS5yZW1vdmVBdHRyKCAnc3R5bGUnICk7XG5cblx0aW5zZXJ0RmllbGRTdWJGaWVsZHMoIHVpICk7XG5cblx0dXBkYXRlRmllbGRzUG9zaXRpb24oKTtcblxuXHRjb25zdCB0b2dnbGVCdG4gPSB1aS5pdGVtLmZpbmQoICcud2lkZ2V0LWFjdGlvbicgKTtcblxuXHQvLyBFeHBhbmQgdGhlIGZvcm0gZmllbGQgYWZ0ZXIgc29ydC5cblx0aWYgKCAnZmFsc2UnID09PSB0b2dnbGVCdG4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnICkgKSB7XG5cdFx0dG9nZ2xlQnRuLnRyaWdnZXIoICdjbGljaycgKTtcblx0fVxufVxuXG4vKipcbiAqIEluc3RhbnRpYXRlIHNvcnRhYmxlIGZvciB0aGUgZm9ybSBmaWVsZHMuXG4gKi9cbmZ1bmN0aW9uIHNvcnRhYmxlKCBpZGVudGlmaWVyICkge1xuXHRjb25zdCBjb250YWluZXIgPSBqUXVlcnkoIGlkZW50aWZpZXIgKTtcblxuXHRjb250YWluZXIuc29ydGFibGUoXG5cdFx0e1xuXHRcdFx0b3BhY2l0eTogMC44LFxuXHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdGN1cnNvcjogJ21vdmUnLFxuXHRcdFx0YXhpczogJ3knLFxuXHRcdFx0aGFuZGxlOiAnLndpZGdldC10b3AnLFxuXHRcdFx0Y2FuY2VsOiAnLndpZGdldC10aXRsZS1hY3Rpb24nLFxuXHRcdFx0aXRlbXM6ICcud2lkZ2V0Jyxcblx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdGNvbm5lY3RXaXRoOiAnI3NlYXJjaC1mb3JtLXdyYXBwZXInLFxuXHRcdFx0c3RvcDogbWFrZUZpZWxkUmVhZHksXG5cdFx0XHRzdGFydDogZnVuY3Rpb24oIGUsIHVpICkge1xuXHRcdFx0XHQvLyBJZiBpdCBpcyBnZXR0aW5nIGFwcGVuZGVkIHRvIHRoZSB3cm9uZyBwbGFjZSwgdGhlbiBmb3JjZSBpdCBpbnRvIHRoZSByaWdodCBjb250YWluZXIuXG5cdFx0XHRcdHVpLnBsYWNlaG9sZGVyLmFwcGVuZFRvKCB1aS5wbGFjZWhvbGRlci5wYXJlbnQoKS5maW5kKCAnLmluc2lkZSAjc2VhcmNoLWZvcm0td3JhcHBlcicgKSApO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcbn1cblxuc29ydGFibGUoICcjc2VhcmNoLWZvcm0nICk7XG5cbi8qKlxuICogUnVuIGZ1bmN0aW9uIHdoZW4gZHJhZyBzdGFydHMuXG4gKi9cbmZ1bmN0aW9uIG9uRHJhZ1N0YXJ0KCkge1xuXHRzZWFyY2hGb3JtLmFkZENsYXNzKCAndWktZHJvcC1hY3RpdmUnICk7XG59XG5cbi8qKlxuICogUnVuIGZ1bmN0aW9uIGF0IGRyYWcgc3RvcC5cbiAqL1xuZnVuY3Rpb24gb25EcmFnU3RvcCgpIHtcblx0c2VhcmNoRm9ybS5yZW1vdmVDbGFzcyggJ3VpLWRyb3AtYWN0aXZlJyApO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemUgZHJhZ2dhYmxlIGZvciB0aGUgZm9ybSBmaWVsZHMuXG4gKi9cbmpRdWVyeSggJyNhdmFpbGFibGUtZmllbGRzIC53aWRnZXQnICkuZHJhZ2dhYmxlKFxuXHR7XG5cdFx0Y29ubmVjdFRvU29ydGFibGU6ICcjc2VhcmNoLWZvcm0nLFxuXHRcdGhlbHBlcjogJ2Nsb25lJyxcblx0XHRzdGFydDogb25EcmFnU3RhcnQsXG5cdFx0c3RvcDogb25EcmFnU3RvcCxcblx0fVxuKTtcblxuLyoqXG4gKiBUb2dnbGUgdGhlIGZvcm0gZmllbGQuXG4gKi9cbmZ1bmN0aW9uIHRvZ2dsZUZpZWxkKCBlICkge1xuXHRjb25zdCB0YXJnZXQgICAgICAgPSBlLnRhcmdldDtcblx0Y29uc3Qgd2lkZ2V0ICAgICAgID0galF1ZXJ5KCB0aGlzICkuY2xvc2VzdCggJy53aWRnZXQnICk7XG5cdGNvbnN0IHRvZ2dsZUJ0biAgICA9IHdpZGdldC5maW5kKCAnLndpZGdldC1hY3Rpb24nICk7XG5cdGNvbnN0IGluc2lkZSAgICAgICA9IHdpZGdldC5jaGlsZHJlbiggJy53aWRnZXQtaW5zaWRlJyApO1xuXHRjb25zdCBpc0V4cGFuZCAgICAgPSB0b2dnbGVCdG4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnICk7XG5cdGNvbnN0IHRvZ2dsZUV4cGFuZCA9ICd0cnVlJyA9PT0gaXNFeHBhbmQgPyAnZmFsc2UnIDogJ3RydWUnO1xuXG5cdHRvZ2dsZUJ0bi5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIHRvZ2dsZUV4cGFuZCApO1xuXHRqUXVlcnkoIGluc2lkZSApLnNsaWRlVG9nZ2xlKFxuXHRcdCdmYXN0Jyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdHdpZGdldC50b2dnbGVDbGFzcyggJ29wZW4nICk7XG5cdFx0XHRzZWFyY2hGb3JtLnRyaWdnZXIoICd3aWRnZXQtY2xvc2VkJywgWyB0YXJnZXQgXSApO1xuXHRcdH1cblx0KTtcbn1cblxuc2VhcmNoRm9ybS5vbiggJ2NsaWNrJywgJy53aWRnZXQtdG9wJywgdG9nZ2xlRmllbGQgKTtcbnNlYXJjaEZvcm0ub24oICdjbGljaycsICcud2lkZ2V0LWNvbnRyb2wtY2xvc2UnLCB0b2dnbGVGaWVsZCApO1xuXG4vKipcbiAqIEZvY3VzIHRoZSBmb3JtIGZpZWxkJ3MgZXhwYW5kIGJ1dHRvbi5cbiAqL1xuZnVuY3Rpb24gZm9jdXNGaWVsZCggZSwgdGFyZ2V0ICkge1xuXHRpZiAoIHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoICd3aWRnZXQtY29udHJvbC1jbG9zZScgKSApIHtcblx0XHRjb25zdCB3aWRnZXQgPSBqUXVlcnkoIHRhcmdldCApLmNsb3Nlc3QoICcud2lkZ2V0JyApO1xuXHRcdGNvbnN0IGFjdGlvbiA9IHdpZGdldC5maW5kKCAnLndpZGdldC1hY3Rpb24nICk7XG5cblx0XHRhY3Rpb24uYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICkuZm9jdXMoKTtcblx0fVxufVxuXG5zZWFyY2hGb3JtLm9uKCAnd2lkZ2V0LWNsb3NlZCcsIGZvY3VzRmllbGQgKTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGZpZWxkLlxuICovXG5mdW5jdGlvbiByZW1vdmVGaWVsZCgpIHtcblx0Y29uc3Qgd2lkZ2V0ID0galF1ZXJ5KCB0aGlzICkuY2xvc2VzdCggJy53aWRnZXQnICk7XG5cblx0alF1ZXJ5KCB3aWRnZXQgKS5zbGlkZVVwKFxuXHRcdCdmYXN0Jyxcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdHdpZGdldC5yZW1vdmUoKTtcblx0XHRcdHVwZGF0ZUZpZWxkc1Bvc2l0aW9uKCk7XG5cdFx0fVxuXHQpO1xufVxuXG5zZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLndpZGdldC1jb250cm9sLXJlbW92ZScsIHJlbW92ZUZpZWxkICk7XG5cbi8qKlxuICogU3RvcmUgdGhlIGluaXRpYWwgZm9ybSBkYXRhIGludG8gYSB2YXJpYWJsZSBzbyB0aGF0IHdlIGNhbiBjb21wYXJlIGl0IHdoZW4gbGVhdmluZyB0aGUgcGFnZS5cbiAqL1xubGV0IGluaXRpYWxGb3JtU3RhdGUgPSBzZWFyY2hGb3JtLnNlcmlhbGl6ZUFycmF5KCk7XG5cbi8qKlxuICogU2hvdyBtZXNzYWdlIGFmdGVyIGZvcm0gc3VibWlzc2lvbi5cbiAqL1xuZnVuY3Rpb24gc2hvd01lc3NhZ2UoIG1lc3NhZ2UsIHR5cGUgPSAnc3VjY2VzcycgKSB7XG5cdGNvbnN0IGVsZW1lbnQgPSBqUXVlcnkoICc8cCBjbGFzcz1cIicgKyB0eXBlICsgJ1wiPicgKyBtZXNzYWdlICsgJzwvcD4nICk7XG5cdGNvbnN0IHdyYXBwZXIgPSBqUXVlcnkoICcud2NhcGYtbWVzc2FnZS13cmFwcGVyJyApO1xuXG5cdGlmICggISB3cmFwcGVyLmlzKCAnOmVtcHR5JyApICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGpRdWVyeSggd3JhcHBlciApLmh0bWwoIGVsZW1lbnQgKS5zbGlkZURvd24oICdmYXN0JyApO1xuXG5cdHNldFRpbWVvdXQoXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRqUXVlcnkoIHdyYXBwZXIgKS5zbGlkZVVwKCAnZmFzdCcgKTtcblx0XHRcdHdyYXBwZXIuaHRtbCggJycgKTtcblx0XHR9LFxuXHRcdDMwMDBcblx0KTtcbn1cblxuLyoqXG4gKiBTYXZlIHRoZSBzZWFyY2ggZm9ybS5cbiAqL1xuZnVuY3Rpb24gc2F2ZUZvcm0oKSB7XG5cdGNvbnN0IGJ1dHRvbiAgID0galF1ZXJ5KCB0aGlzICk7XG5cdGNvbnN0IGZvcm1EYXRhID0gc2VhcmNoRm9ybS5zZXJpYWxpemVBcnJheSgpO1xuXG5cdGJ1dHRvbi5hdHRyKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cblx0ZnVuY3Rpb24gb2tDYWxsYmFjayggbWVzc2FnZSApIHtcblx0XHRidXR0b24ucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBpbml0aWFsIGZvcm0gZGF0YSBhZnRlciBzdWNjZXNzZnVsbHkgc2F2aW5nIHRoZSBmb3JtLlxuXHRcdGluaXRpYWxGb3JtU3RhdGUgPSBmb3JtRGF0YTtcblxuXHRcdHNob3dNZXNzYWdlKCBtZXNzYWdlICk7XG5cdH1cblxuXHRmdW5jdGlvbiBlcnJDYWxsYmFjayggbWVzc2FnZSApIHtcblx0XHRidXR0b24ucmVtb3ZlQXR0ciggJ2Rpc2FibGVkJyApO1xuXHRcdHNob3dNZXNzYWdlKCBtZXNzYWdlLCAnZXJyb3InICk7XG5cdH1cblxuXHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTkxODEyNTJcblx0d3AuYWpheC5wb3N0KCBmb3JtRGF0YSApLmRvbmUoIG9rQ2FsbGJhY2sgKS5mYWlsKCBlcnJDYWxsYmFjayApO1xufVxuXG5qUXVlcnkoICcjcG9zdGJveC1jb250YWluZXItMScgKS5vbiggJ2NsaWNrJywgJ2J1dHRvbicsIHNhdmVGb3JtICk7XG5cbi8qKlxuICogU2hvdyBhbGVydCBvbiBsZWF2ZSBpZiB0aGUgZm9ybSBpcyBkaXJ0eS5cbiAqXG4gKiBUT0RPOiBVbmNvbW1lbnQgdGhpcy5cbiAqL1xuLy8gd2luZG93Lm9uYmVmb3JldW5sb2FkID0gZnVuY3Rpb24oKSB7XG4vLyBcdGNvbnN0IG5ld0Zvcm1TdGF0ZSA9IHNlYXJjaEZvcm0uc2VyaWFsaXplQXJyYXkoKTtcbi8vXG4vLyBcdGNvbnN0IGlzRm9ybURpcnR5ID0gISBfLmlzRXF1YWwoIG5ld0Zvcm1TdGF0ZSwgaW5pdGlhbEZvcm1TdGF0ZSApO1xuLy9cbi8vIFx0aWYgKCBpc0Zvcm1EaXJ0eSApIHtcbi8vIFx0XHRyZXR1cm4gJyc7XG4vLyBcdH1cbi8vIH07XG4iLCIvKipcbiAqIFRoZSBwcm9kdWN0IHN0YXR1cyBmaWVsZC5cbiAqXG4gKiBAc2luY2UgICAgICAzLjAuMFxuICogQHBhY2thZ2UgICAgd2MtYWpheC1wcm9kdWN0LWZpbHRlclxuICogQHN1YnBhY2thZ2Ugd2MtYWpheC1wcm9kdWN0LWZpbHRlci9hZG1pbi9zcmMvanNcbiAqIEBhdXRob3IgICAgIE1haW51bCBIYXNzYW4gTWFpblxuICovXG5cbmpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oICQgKSB7XG5cblx0Y29uc3QgJHNlYXJjaEZvcm0gPSAkKCAnI3NlYXJjaC1mb3JtJyApO1xuXG5cdGZ1bmN0aW9uIHRyaWdnZXJTb3J0QnlPcHRpb25zQ2hhbmdlKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJHZhbHVlSG9sZGVyICA9ICRmaWVsZC5maW5kKCAnLndjYXBmLWZvcm0tc3ViLWZpZWxkLXNvcnRfYnlfb3B0aW9ucyBpbnB1dCcgKTtcblx0XHRjb25zdCAkb3B0aW9uc1RhYmxlID0gJGZpZWxkLmZpbmQoICcuc29ydC1ieS1vcHRpb25zLXRhYmxlJyApO1xuXHRcdGNvbnN0ICRyb3dzICAgICAgICAgPSAkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApO1xuXHRcdGNvbnN0IF9yb3dzICAgICAgICAgPSBbXTtcblxuXHRcdCRyb3dzLmZpbmQoICcuc29ydC1vcHRpb24taXRlbScgKS5lYWNoKCBmdW5jdGlvbiggaSwgX2l0ZW0gKSB7XG5cdFx0XHRjb25zdCAkaXRlbSAgICAgICAgICA9ICQoIF9pdGVtICk7XG5cdFx0XHRjb25zdCB2YWx1ZSAgICAgICAgICA9ICRpdGVtLmZpbmQoICcub3B0aW9uX3ZhbHVlJyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgZGlyZWN0aW9uICAgICAgPSAkaXRlbS5maW5kKCAnLm9wdGlvbl9kaXJlY3Rpb24nICkudmFsKCk7XG5cdFx0XHRjb25zdCBsYWJlbCAgICAgICAgICA9ICRpdGVtLmZpbmQoICcub3B0aW9uX2xhYmVsJyApLnZhbCgpO1xuXHRcdFx0Y29uc3QgbWV0YV9rZXkgICAgICAgPSAkaXRlbS5maW5kKCAnLm9wdGlvbl9tZXRhX2tleScgKS52YWwoKTtcblx0XHRcdGNvbnN0IG1ldGFfc29ydF90eXBlID0gJGl0ZW0uZmluZCggJy5vcHRpb25fbWV0YV9zb3J0X3R5cGUnICkudmFsKCk7XG5cblx0XHRcdGlmICggdmFsdWUgKSB7XG5cdFx0XHRcdF9yb3dzLnB1c2goIFsgdmFsdWUsIGRpcmVjdGlvbiwgbGFiZWwsIG1ldGFfa2V5LCBtZXRhX3NvcnRfdHlwZSBdICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Y29uc3QgcmF3VmFsdWVzID0gZW5jb2RlVVJJQ29tcG9uZW50KCBKU09OLnN0cmluZ2lmeSggX3Jvd3MgKSApO1xuXHRcdCR2YWx1ZUhvbGRlci52YWwoIHJhd1ZhbHVlcyApO1xuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdFNvcnRhYmxlRm9yU29ydEJ5T3B0aW9ucyggJHNlbGVjdG9yICkge1xuXHRcdCRzZWxlY3Rvci5zb3J0YWJsZSgge1xuXHRcdFx0b3BhY2l0eTogMC44LFxuXHRcdFx0cmV2ZXJ0OiBmYWxzZSxcblx0XHRcdGN1cnNvcjogJ21vdmUnLFxuXHRcdFx0YXhpczogJ3knLFxuXHRcdFx0aGFuZGxlOiAnLm1vdmUtb3B0aW9ucy1oYW5kbGVyJyxcblx0XHRcdHBsYWNlaG9sZGVyOiAnd2lkZ2V0LXBsYWNlaG9sZGVyJyxcblx0XHRcdHVwZGF0ZTogZnVuY3Rpb24oIGUgKSB7XG5cdFx0XHRcdGNvbnN0ICRmaWVsZCA9ICQoIGUudGFyZ2V0ICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0XHRcdHRyaWdnZXJTb3J0QnlPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0XHRcdH1cblx0XHR9ICkuZGlzYWJsZVNlbGVjdGlvbigpO1xuXHR9XG5cblx0Ly8gU29ydCBNYW51YWwgT3B0aW9uc1xuXHRpbml0U29ydGFibGVGb3JTb3J0QnlPcHRpb25zKCAkc2VhcmNoRm9ybS5maW5kKCAnLnNvcnQtYnktb3B0aW9ucy10YWJsZSAubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApICk7XG5cblx0JHNlYXJjaEZvcm0ub24oICdmaWVsZF9hZGRlZCcsIGZ1bmN0aW9uKCBlLCB1aSApIHtcblx0XHQvLyBJbml0IFNvcnRhYmxlIGZvciB0aGUgbWFudWFsIG9wdGlvbnMuXG5cdFx0aW5pdFNvcnRhYmxlRm9yU29ydEJ5T3B0aW9ucyggJCggdWkuaXRlbS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKSApICk7XG5cdH0gKTtcblxuXHRmdW5jdGlvbiB0cmlnZ2VyUmVtb3ZlU29ydEJ5T3B0aW9uKCAkZmllbGQgKSB7XG5cdFx0Y29uc3QgJG9wdGlvbnNUYWJsZSA9ICRmaWVsZC5maW5kKCAnLnNvcnQtYnktb3B0aW9ucy10YWJsZScgKTtcblx0XHRjb25zdCB0YWJsZVJvd3MgICAgID0gJG9wdGlvbnNUYWJsZS5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKS5jaGlsZHJlbigpO1xuXG5cdFx0aWYgKCAyID4gdGFibGVSb3dzLmxlbmd0aCApIHtcblx0XHRcdCRvcHRpb25zVGFibGUucmVtb3ZlQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH1cblxuXHQvLyBSZW1vdmUgU2luZ2xlIE51bWJlciBPcHRpb25cblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcucmVtb3ZlLXNvcnQtYnktb3B0aW9uJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJGl0ZW0gID0gJCggdGhpcyApLmNsb3Nlc3QoICcuc29ydC1vcHRpb24taXRlbScgKTtcblx0XHRjb25zdCAkZmllbGQgPSAkaXRlbS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlU29ydEJ5T3B0aW9uKCAkZmllbGQgKTtcblxuXHRcdCRpdGVtLnJlbW92ZSgpO1xuXG5cdFx0dHJpZ2dlclNvcnRCeU9wdGlvbnNDaGFuZ2UoICRmaWVsZCApO1xuXHR9ICk7XG5cblx0Ly8gQ2xlYXIgQWxsIE9wdGlvbnNcblx0JHNlYXJjaEZvcm0ub24oICdjbGljaycsICcuY2xlYXItYWxsLXNvcnQtYnktb3B0aW9ucycsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCAgICAgICAgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXHRcdGNvbnN0ICRvcHRpb25zVGFibGUgPSAkZmllbGQuZmluZCggJy5zb3J0LWJ5LW9wdGlvbnMtdGFibGUnICk7XG5cblx0XHQkb3B0aW9uc1RhYmxlLmZpbmQoICcubWFudWFsLW9wdGlvbnMtdGFibGUtYm9keS1yb3dzJyApLmVtcHR5KCk7XG5cblx0XHR0cmlnZ2VyUmVtb3ZlU29ydEJ5T3B0aW9uKCAkZmllbGQgKTtcblxuXHRcdHRyaWdnZXJTb3J0QnlPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblx0fSApO1xuXG5cdC8vIEFkZCBOZXcgT3B0aW9uXG5cdCRzZWFyY2hGb3JtLm9uKCAnY2xpY2snLCAnLmFkZC1zb3J0LWJ5LW9wdGlvbicsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IGZpZWxkVHlwZSA9ICd3Y2FwZi1zb3J0LWJ5LW9wdGlvbic7XG5cblx0XHQvLyBCYWlsIG91dCBpZiBubyB0bXBsIGZvdW5kIGZvciB0aGUgdHlwZS5cblx0XHRpZiAoICEgalF1ZXJ5KCAnI3RtcGwtJyArIGZpZWxkVHlwZSApLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCAkZmllbGQgPSAkKCB0aGlzICkuY2xvc2VzdCggJy53Y2FwZi1mb3JtLWZpZWxkJyApO1xuXG5cdFx0Y29uc3QgdGVtcGxhdGUgPSB3cC50ZW1wbGF0ZSggZmllbGRUeXBlICk7XG5cdFx0Y29uc3QgcmVuZGVyZWQgPSB0ZW1wbGF0ZSggeyB2YWx1ZTogJycsIGRpcmVjdGlvbjogJycsIGxhYmVsOiAnJyB9ICk7XG5cdFx0Y29uc3QgJHdyYXBwZXIgPSAkZmllbGQuZmluZCggJy5zb3J0LWJ5LW9wdGlvbnMtdGFibGUnICk7XG5cdFx0Y29uc3QgJHJvd3MgICAgPSAkd3JhcHBlci5maW5kKCAnLm1hbnVhbC1vcHRpb25zLXRhYmxlLWJvZHktcm93cycgKTtcblxuXHRcdCRyb3dzLmFwcGVuZCggcmVuZGVyZWQgKTtcblxuXHRcdHRyaWdnZXJTb3J0QnlPcHRpb25zQ2hhbmdlKCAkZmllbGQgKTtcblxuXHRcdGlmICggISAkd3JhcHBlci5oYXNDbGFzcyggJ2hhcy1vcHRpb25zJyApICkge1xuXHRcdFx0JHdyYXBwZXIuYWRkQ2xhc3MoICdoYXMtb3B0aW9ucycgKTtcblx0XHR9XG5cdH0gKTtcblxuXHRjb25zdCByb3dJbnB1dHMgPSAnLnNvcnQtYnktb3B0aW9ucy10YWJsZSBpbnB1dFt0eXBlPVwidGV4dFwiXSwnICtcblx0XHQnIC5zb3J0LWJ5LW9wdGlvbnMtdGFibGUgLm9wdGlvbl92YWx1ZSwnICtcblx0XHQnIC5zb3J0LWJ5LW9wdGlvbnMtdGFibGUgLm9wdGlvbl9kaXJlY3Rpb24sJyArXG5cdFx0JyAuc29ydC1ieS1vcHRpb25zLXRhYmxlIC5vcHRpb25fbWV0YV9rZXksJyArXG5cdFx0JyAuc29ydC1ieS1vcHRpb25zLXRhYmxlIC5vcHRpb25fbWV0YV9zb3J0X3R5cGUnO1xuXG5cdCRzZWFyY2hGb3JtLm9uKCAnaW5wdXQnLCByb3dJbnB1dHMsIGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICRmaWVsZCA9ICQoIHRoaXMgKS5jbG9zZXN0KCAnLndjYXBmLWZvcm0tZmllbGQnICk7XG5cblx0XHR0cmlnZ2VyU29ydEJ5T3B0aW9uc0NoYW5nZSggJGZpZWxkICk7XG5cdH0gKTtcblxuXHQkc2VhcmNoRm9ybS5vbiggJ2NoYW5nZScsICcuc29ydC1vcHRpb24taXRlbSAub3B0aW9uX3ZhbHVlJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHNvcnRPcHRpb24gICAgID0gJCggdGhpcyApO1xuXHRcdGNvbnN0IHNvcnRPcHRpb24gICAgICA9ICRzb3J0T3B0aW9uLnZhbCgpO1xuXHRcdGNvbnN0ICRzb3J0T3B0aW9uSXRlbSA9ICRzb3J0T3B0aW9uLmNsb3Nlc3QoICcuc29ydC1vcHRpb24taXRlbScgKTtcblx0XHRjb25zdCAkbWV0YURhdGEgICAgICAgPSAkc29ydE9wdGlvbkl0ZW0uZmluZCggJy5tZXRhLWRhdGEnICk7XG5cblx0XHRpZiAoICdtZXRhX3ZhbHVlJyA9PT0gc29ydE9wdGlvbiApIHtcblx0XHRcdCRtZXRhRGF0YS5zbGlkZURvd24oKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JG1ldGFEYXRhLnNsaWRlVXAoKTtcblx0XHR9XG5cdH0gKTtcblxufSApO1xuIl19
