import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { useForm } from '../FormContext';
import useFormData from '../useFormData';
import axios from 'axios';
import { find, pick, omit, isEmpty } from 'lodash';
import {
	removeCopiedToClipboardNotice,
	itemSavedSuccessNotice,
	itemSavedErrorNotice,
	removeItemSavedNotices,
	removeFilterDeletedNotices,
} from '../../notices';
import Title from './Title';
import PublishModal from '../../Modals/PublishModal';
import { GENERIC_ERROR_MESSAGE, foundProVersion } from '../../utils';
import {
	getFilterKeyError,
	filterDefaultData,
	termsProOrderByOptions,
	taxonomyProLimitByOptions,
	authorProOrderByOptions,
	metaValuesProOrderByOptions,
	proFilterTypes,
	proFilterComponents,
} from '../utils';
import { defaultFormSettings, proVisibilityOptions } from '../../utilsForForm';

const WCAPF_PRO = foundProVersion();

const FormTitle = () => {
	const { state, dispatch } = useForm();
	const { setDirty } = useFormData(state, dispatch);

	const [publishModalOpen, setPublishModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const {
		isDirty,
		title,
		formId,
		filterKeys,
		currentTab,
		accordionStates,
		formFilters,
		formSettings,
	} = state;

	useEffect(() => {
		if (!isDirty) {
			return;
		}

		removeItemSavedNotices();
		removeFilterDeletedNotices();
	}, [isDirty]);

	const handleTitleChange = (value) => {
		if (title === value) {
			return;
		}

		dispatch({ type: 'SET_TITLE', payload: value });

		setDirty();
	};

	const handleOpenPublishModal = () => {
		removeItemSavedNotices();

		setPublishModalOpen(true);
	};

	const handleClosePublishModal = () => {
		removeCopiedToClipboardNotice();

		setPublishModalOpen(false);
	};

	const formFiltersAreValid = () => {
		dispatch({ type: 'SET_ERROR', payload: '' });

		const validatedFormFilters = [];
		const invalidFormFilters = [];
		let isValid = true;

		const proTypes = proFilterTypes();
		const proComponents = proFilterComponents();

		for (let index = 0; index < formFilters.length; index++) {
			const formFilter = formFilters[index];

			const isPro =
				proTypes.includes(formFilter['type']) ||
				proComponents.includes(formFilter['component']);

			if (!WCAPF_PRO && isPro) {
				continue;
			}

			const _formFilter = omit(formFilter, [
				'type_error',
				'meta_key_error',
				'field_key_error',
				'field_key_error_',
			]);

			let dataRequired = false;

			if (isEmpty(_formFilter['type'])) {
				dataRequired = true;

				_formFilter['type_error'] = __(
					'Filter type is required.',
					'wc-ajax-product-filter'
				);
			}

			if (
				'post-meta' === _formFilter['type'] &&
				isEmpty(_formFilter['meta_key'])
			) {
				dataRequired = true;

				_formFilter['meta_key_error'] = __(
					'Meta key is required.',
					'wc-ajax-product-filter'
				);
			}

			const filterKeyError = getFilterKeyError(
				filterKeys,
				formFilter,
				formFilters,
				index
			);

			if (filterKeyError) {
				dataRequired = true;

				_formFilter['field_key_error'] = filterKeyError;
			}

			if (dataRequired) {
				invalidFormFilters.push(index);
				isValid = false;
			}

			validatedFormFilters.push(_formFilter);
		}

		if (!isValid) {
			const newStates = accordionStates.map((isExpanded, index) => {
				if (invalidFormFilters.includes(index)) {
					return true;
				} else if (isExpanded) {
					return false;
				}

				return isExpanded;
			});

			dispatch({ type: 'SET_ACCORDION_STATES', payload: newStates });
		}

		dispatch({ type: 'SET_FORM_FILTERS', payload: validatedFormFilters });

		if (!isValid) {
			dispatch({
				type: 'SET_ERROR',
				payload: GENERIC_ERROR_MESSAGE,
			});

			if ('filters' !== currentTab) {
				dispatch({ type: 'SET_CURRENT_TAB', payload: 'filters' });
			}
		}

		return { isValid, validatedFormFilters };
	};

	const sanitizedFormFilters = (validatedFormFilters) => {
		const filters = [];

		validatedFormFilters.forEach((_filter) => {
			const filter = omit(_filter, ['isNew', 'uniqueIndex']);

			filters.push(filter);
		});

		if (WCAPF_PRO) {
			return filters;
		}

		const sanitizedFilters = [];

		filters.forEach((filter) => {
			const proData = [
				'grid_columns',
				'swatch_with_text',
				'get_options',
				'manual_options',
				'parent_term',
				'direct_child_only',
				'number_range_enable_multiple_filter',
				'number_range_query_type',
				'number_range_select_all_items_label',
				'number_range_show_count',
				'number_get_options',
				'number_manual_options',
				'value_type',
				'value_decimal',
				'value_decimal_places',
				'date_input_format',
				'time_period_enable_multiple_filter',
				'time_period_query_type',
				'time_period_select_all_items_label',
				'time_period_show_count',
				'time_period_options',
				'options_order_type',
				'search_field_placeholder',
				'visibility_rules',
			];

			const proTextDisplayTypes = ['color', 'image', 'hierarchy-select'];

			const proNumberDisplayTypes = [
				'range_checkbox',
				'range_radio',
				'range_select',
				'range_multiselect',
				'range_label',
			];

			const proDateDisplayTypes = [
				'time_period_checkbox',
				'time_period_radio',
				'time_period_select',
				'time_period_multiselect',
				'time_period_label',
			];

			if (proTextDisplayTypes.includes(filter['display_type'])) {
				proData.push('display_type');
			}

			if (proNumberDisplayTypes.includes(filter['number_display_type'])) {
				proData.push('number_display_type');
			}

			if (proDateDisplayTypes.includes(filter['date_display_type'])) {
				proData.push('date_display_type');
			}

			if (termsProOrderByOptions().includes(filter['order_terms_by'])) {
				proData.push('order_terms_by');
			}

			if (taxonomyProLimitByOptions().includes(filter['limit_options'])) {
				proData.push('limit_options');
			}

			if (
				metaValuesProOrderByOptions().includes(
					filter['options_order_by']
				)
			) {
				proData.push('options_order_by');
			}

			if (
				authorProOrderByOptions().includes(
					filter['post_author_order_by']
				)
			) {
				proData.push('post_author_order_by');
			}

			if ('grid' === filter['native_display_type_layout']) {
				proData.push('native_display_type_layout');
			}

			if ('grid' === filter['custom_display_type_layout']) {
				proData.push('custom_display_type_layout');
			}

			const defaultData = pick(filterDefaultData(), proData);

			const sanitized = { ...filter, ...defaultData };

			sanitizedFilters.push(sanitized);
		});

		return sanitizedFilters;
	};

	const sanitizedFormSettings = () => {
		if (WCAPF_PRO) {
			return formSettings;
		}

		const proSettings = [
			'form_locations',
			'priority',
			'form_layout',
			'columns_per_row',
			'show_form_on_top_of_products',
			'filter_mode',
			'show_clear_btn',
		];

		const proVisibilityOptionKeys = proVisibilityOptions.map(
			(option) => option.value
		);

		if (proVisibilityOptionKeys.includes(formSettings['form_visibility'])) {
			proSettings.push('form_visibility');
		}

		const defaultSettings = pick(defaultFormSettings(), proSettings);

		return { ...formSettings, ...defaultSettings };
	};

	const handleSaveForm = () => {
		removeItemSavedNotices();

		const { isValid, validatedFormFilters } = formFiltersAreValid();

		if (!isValid) {
			return;
		}

		const sanitizedFilters = sanitizedFormFilters(validatedFormFilters);
		const sanitizedSettings = sanitizedFormSettings();

		setLoading(true);

		const formData = new FormData();

		formData.append('action', 'wcapf_save_form');
		formData.append('form_title', title);
		formData.append('form_id', formId);
		formData.append('form_filters', JSON.stringify(sanitizedFilters));
		formData.append('form_settings', JSON.stringify(sanitizedSettings));

		axios
			.post(wcapf_admin_params.ajaxurl, formData)
			.then((res) => {
				setLoading(false);

				const {
					data: { data, success },
				} = res;

				if (success) {
					dispatch({
						type: 'SET_FILTER_KEYS',
						payload: data.filter_keys,
					});

					dispatch({
						type: 'SET_FORM_FILTERS',
						payload: data.form_filters,
					});

					dispatch({
						type: 'SET_FORM_SETTINGS',
						payload: data.form_settings,
					});

					dispatch({ type: 'SET_DIRTY', payload: false });

					wcapf_admin_params.dirty = false;

					itemSavedSuccessNotice(
						__('Form saved successfully', 'wc-ajax-product-filter')
					);
				} else if (data.errors) {
					dispatch({
						type: 'SET_ERROR',
						payload: GENERIC_ERROR_MESSAGE,
					});

					const errorsData = data['errors'];

					console.log(errorsData); // TODO: Remove.

					const formFiltersWithErrors = formFilters.map(
						(formFilter, index) => {
							const error = find(errorsData, { order: index });

							if (error) {
								const { key, message } = error;

								return {
									...formFilter,
									[key]: message,
									// Reset client side errors.
									type_error: '',
									meta_key_error: '',
									field_key_error: '',
								};
							}

							return formFilter;
						}
					);

					dispatch({
						type: 'SET_FORM_FILTERS',
						payload: formFiltersWithErrors,
					});

					const newStates = accordionStates.map(
						(isExpanded, index) => {
							const error = find(errorsData, { order: index });

							if (error) {
								return true;
							} else if (isExpanded) {
								return false;
							}

							return isExpanded;
						}
					);

					dispatch({
						type: 'SET_ACCORDION_STATES',
						payload: newStates,
					});

					if ('filters' !== currentTab) {
						dispatch({
							type: 'SET_CURRENT_TAB',
							payload: 'filters',
						});
					}
				} else {
					itemSavedErrorNotice(data);
				}
			})
			.catch((err) => {
				console.log(err);

				setLoading(false);

				itemSavedErrorNotice(err.message);
			});
	};

	const handleSubmit = () => {
		if (isDirty) {
			handleSaveForm();
		} else {
			handleOpenPublishModal();
		}
	};

	return (
		<>
			<Title
				loading={loading}
				handleTitleChange={handleTitleChange}
				handleSubmit={handleSubmit}
			/>

			<PublishModal
				isOpen={publishModalOpen}
				closeModal={handleClosePublishModal}
			/>
		</>
	);
};

export default FormTitle;
