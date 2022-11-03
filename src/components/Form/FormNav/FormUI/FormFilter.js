import { sprintf, __ } from '@wordpress/i18n';
import { Button, ExternalLink, Flex, FlexItem } from '@wordpress/components';
import { useRef, useState } from '@wordpress/element';
import { Icon, dragHandle, chevronDown, chevronUp } from '@wordpress/icons';
import { useForm } from '../../FormContext';
import { getEditFilterLink } from '../../../utils';
import Checkbox from '../../../Field/Checkbox';

const FormFilter = ({ data }) => {
	const {
		state: { availableFilters, formFilters },
		dispatch,
	} = useForm();

	const [expanded, setExpanded] = useState(false);
	const dragHandleRef = useRef('');

	const toggleExpand = (e) => {
		if (dragHandleRef.current.contains(e.target)) {
			return;
		}

		const _expanded = !expanded;
		setExpanded(_expanded);
	};

	const toggleIcon = expanded ? chevronUp : chevronDown;

	function deleteFilter() {
		const _availableFilters = availableFilters.map((item) => {
			if (item.id === data.id) {
				item.status = '';
			}

			return item;
		});

		const _formFilters = formFilters.filter((item) => item.id !== data.id);

		dispatch({ type: 'SET_AVAILABLE_FILTERS', payload: _availableFilters });
		dispatch({ type: 'UPDATE_FORM_FILTERS', payload: _formFilters });
		dispatch({ type: 'SET_DIRTY' });
	}

	return (
		<div className='__item'>
			<div className='__top' onClick={toggleExpand}>
				<div className='__tt'>
					<div className='__drag_handle_wrapper' ref={dragHandleRef}>
						<Icon className='__drag_handler' icon={dragHandle} />
					</div>
					<div className='__accordion_title'>
						<span className='__post_title'>{data.title}</span>
						<span className='__post_id'>
							{sprintf(
								__('ID: %d', 'wc-ajax-product-filter'),
								data.id
							)}
						</span>
					</div>
				</div>
				<div className='__accordion_toggle_button'>
					<Button isSmall>
						<Icon icon={toggleIcon} />
					</Button>
				</div>
			</div>
			{expanded ? (
				<div className='__accordion_body'>
					<p className='description __override_info'>
						{__(
							'These settings will override the filter settings.',
							'wc-ajax-product-filter'
						)}
					</p>

					<div className='__filter_settings'>
						<Checkbox
							id={'show_title'}
							label={__('Show Title', 'wc-ajax-product-filter')}
							isChecked={'show_title'}
							onChange={'handleCheckboxChange'}
						/>

						<Checkbox
							id={'show_title'}
							label={__(
								'Enable Accordion',
								'wc-ajax-product-filter'
							)}
							isChecked={'show_title'}
							onChange={'handleCheckboxChange'}
						/>
					</div>

					<div className='__action_buttons'>
						<button
							className='button-link button-link-delete'
							onClick={deleteFilter}
						>
							{__('Remove', 'wc-ajax-product-filter')}
						</button>
						{` | `}
						<ExternalLink href={getEditFilterLink(data.id)}>
							{__('Edit', 'wc-ajax-product-filter')}
						</ExternalLink>
					</div>
				</div>
			) : (
				''
			)}
		</div>
	);
};

export default FormFilter;
