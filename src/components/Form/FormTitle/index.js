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
import { foundProVersion } from '../../utils';
import { getFilterKeyError, filterDefaultData } from '../utils';

const genericErrorMessage = __(
	'Please fix the errors below.',
	'wc-ajax-product-filter'
);

const FormTitle = () => {
	const { state, dispatch } = useForm();
	const { setDirty } = useFormData(state, dispatch);

	const [publishModalId, setPublishModalId] = useState(null);
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

		setPublishModalId(formId);
	};

	const handleClosePublishModal = () => {
		removeCopiedToClipboardNotice();

		setPublishModalId(null);
	};

	const formFiltersAreValid = () => {
		dispatch({ type: 'SET_ERROR', payload: '' });

		const validatedFormFilters = [];
		const invalidFormFilters = [];
		let isValid = true;

		formFilters.forEach((formFilter, index) => {
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
				_formFilter,
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
		});

		const newStates = accordionStates.map((isExpanded, index) => {
			if (invalidFormFilters.includes(index)) {
				return true;
			} else if (isExpanded) {
				return false;
			}

			return isExpanded;
		});

		dispatch({ type: 'SET_ACCORDION_STATES', payload: newStates });

		dispatch({ type: 'SET_FORM_FILTERS', payload: validatedFormFilters });

		if (!isValid) {
			dispatch({
				type: 'SET_ERROR',
				payload: genericErrorMessage,
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

		if (foundProVersion()) {
			return filters;
		}

		const sanitizedFilters = [];

		filters.forEach((filter) => {
			const defaultData = pick(filterDefaultData(), [
				'hierarchical',
				'enable_hierarchy_accordion',
				'get_options',
				'order_terms_by',
				'order_terms_dir',
				'number_get_options',
				'manual_options',
				'number_manual_options',
				'time_period_options',
				'options_order_by',
				'options_order_dir',
				'options_order_type',
			]);

			const sanitized = { ...filter, ...defaultData };

			if ('disable' === sanitized['options_with_no_products']) {
				sanitized['options_with_no_products'] = 'remove';
			}

			if ('soft_limit' === sanitized['enable_reduce_height']) {
				sanitized['enable_reduce_height'] = 'no';
			}

			sanitizedFilters.push(sanitized);
		});

		return sanitizedFilters;
	};

	const handleSaveForm = () => {
		removeItemSavedNotices();

		const { isValid, validatedFormFilters } = formFiltersAreValid();

		if (!isValid) {
			return;
		}

		const sanitized = sanitizedFormFilters(validatedFormFilters);

		setLoading(true);

		const formData = new FormData();

		formData.append('action', 'wcapf_save_form');
		formData.append('form_title', title);
		formData.append('form_id', formId);
		formData.append('form_filters', JSON.stringify(sanitized));
		formData.append('form_settings', JSON.stringify(formSettings));

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

					itemSavedSuccessNotice(
						__('Form saved successfully', 'wc-ajax-product-filter')
					);
				} else if (data.errors) {
					dispatch({
						type: 'SET_ERROR',
						payload: genericErrorMessage,
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
				isOpen={publishModalId}
				closeModal={handleClosePublishModal}
			/>
		</>
	);
};

export default FormTitle;
