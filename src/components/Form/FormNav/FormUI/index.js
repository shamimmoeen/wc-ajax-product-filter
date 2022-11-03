import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { ReactSortable } from 'react-sortablejs';
import { isEmpty } from 'lodash';
import { useForm } from '../../FormContext';
import useFormData from '../../useFormData';
import FormFilter from './FormFilter';
import AvailableFilters from './AvailableFilters';
import Header from './Header';

const FormUI = () => {
	const { state, dispatch } = useForm();
	const { setDirty } = useFormData(state, dispatch);

	const [addFilterActive, setAddFilterActive] = useState(false);

	const { formFilters, availableFilters } = state;

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

	const handleRemoveFilters = () => {
		dispatch({
			type: 'SET_FORM_FILTERS',
			payload: [],
		});

		setDirty();
	};

	return (
		<>
			{isEmpty(availableFilters) ? (
				<p className='__no_filters_found description'>
					{__(
						'No filters found, create some filters before starting the form.',
						'wc-ajax-product-filter'
					)}
				</p>
			) : (
				<div className='__filters_drop_zone'>
					<Header
						searchFilterActive={addFilterActive}
						setSearchFilterActive={setAddFilterActive}
					/>

					{addFilterActive && <AvailableFilters />}

					{isEmpty(formFilters) ? (
						<p className='description'>
							{__(
								'The form is empty. Click on the plus button to start adding filters.',
								'wc-ajax-product-filter'
							)}
						</p>
					) : (
						<>
							<ReactSortable
								list={formFilters}
								setList={setFormFilters}
								direction={'vertical'}
								handle='.__drag_handler'
								onSort={setDirty}
								className='__form_filters'
							>
								{formFilters.map((item) => (
									<FormFilter key={item.id} data={item} />
								))}
							</ReactSortable>

							<Button
								variant='tertiary'
								isDestructive
								onClick={handleRemoveFilters}
								className='__remove_all_btn'
							>
								{__('Remove All', 'wc-ajax-product-filter')}
							</Button>
						</>
					)}
				</div>
			)}
		</>
	);
};

export default FormUI;
