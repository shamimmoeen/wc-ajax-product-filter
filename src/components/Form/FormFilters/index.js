import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button, Flex, Icon } from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { ReactSortable } from 'react-sortablejs';
import { isEmpty, uniqueId } from 'lodash';
import { useForm } from '../FormContext';
import useFormData from '../useFormData';
import Filter from './Filter';
import NoFiltersFound from './NoFiltersFound';
import { newFilterData } from '../utils';

const FormFilters = () => {
	const { state, dispatch } = useForm();
	const { setDirty } = useFormData(state, dispatch);

	const [addFilterIndex, setAddFilterIndex] = useState(1);

	const { formFilters } = state;

	const setFormFilters = (_formFilters, sortable, store) => {
		if (!sortable) {
			return;
		}

		if (!store.dragging) {
			return;
		}

		dispatch({
			type: 'SET_FORM_FILTERS',
			payload: _formFilters,
		});
	};

	const addFilter = () => {
		const newFilter = newFilterData(addFilterIndex);

		const _formFilters = [...formFilters, newFilter];

		dispatch({
			type: 'SET_FORM_FILTERS',
			payload: _formFilters,
		});

		setDirty();

		setAddFilterIndex((old) => old + 1);
	};

	const handleRemoveFilter = (index) => {
		const _formFilters = [...formFilters];
		_formFilters.splice(index, 1);

		dispatch({
			type: 'SET_FORM_FILTERS',
			payload: _formFilters,
		});

		setDirty();
	};

	return (
		<div className='__filters_drop_zone'>
			{isEmpty(formFilters) ? (
				<NoFiltersFound addFilter={addFilter} />
			) : (
				<>
					<div className='__filters_list_header'>
						<div className='__title'>
							{__('Title', 'wc-ajax-product-filter')}
						</div>
						<div className='__type'>
							{__('Type', 'wc-ajax-product-filter')}
						</div>
						<div className='__key'>
							{__('Key', 'wc-ajax-product-filter')}
						</div>
						<div className='__display'>
							{__('Display', 'wc-ajax-product-filter')}
						</div>
					</div>

					<ReactSortable
						list={formFilters}
						setList={setFormFilters}
						direction={'vertical'}
						handle='.__drag_handler'
						onSort={setDirty}
						className='__form_filters'
					>
						{formFilters.map((filter, index) => {
							if (filter.isNew) {
								return (
									<Filter
										key={filter.uniqueIndex}
										index={index}
										filter={filter}
										handleRemoveFilter={handleRemoveFilter}
										initialExpand
									/>
								);
							} else {
								return (
									<Filter
										key={uniqueId()}
										index={index}
										filter={filter}
										handleRemoveFilter={handleRemoveFilter}
									/>
								);
							}
						})}
					</ReactSortable>

					<Flex justify={'flex-end'}>
						<Button
							variant='secondary'
							className='__add_filter_btn'
							onClick={addFilter}
						>
							<Icon icon={plus} />
							{__('Add Filter')}
						</Button>
					</Flex>
				</>
			)}
		</div>
	);
};

export default FormFilters;
