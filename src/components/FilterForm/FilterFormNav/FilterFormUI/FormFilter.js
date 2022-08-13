import { __ } from '@wordpress/i18n';
import { Button, ExternalLink, Flex, FlexItem } from '@wordpress/components';
import { useRef, useState } from '@wordpress/element';
import { Icon, dragHandle, chevronDown, chevronUp } from '@wordpress/icons';
import { useFilterForm } from '../../FilterFormContext';

const FormFilter = ({ data }) => {
	const {
		state: { availableFilters, formFilters },
		dispatch,
	} = useFilterForm();

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
		<div className={'__fz_item'}>
			<div
				className='top'
				style={{
					display: 'flex',
					padding: '10px 15px',
					userSelect: 'none',
				}}
				onClick={toggleExpand}
			>
				<Flex justify={''}>
					<FlexItem
						style={{ display: 'inline-flex', alignItems: 'center' }}
						ref={dragHandleRef}
					>
						<Icon
							icon={dragHandle}
							className='__fz_drag_handler'
							style={{ cursor: 'grab' }}
						/>
					</FlexItem>
					<FlexItem
						style={{
							fontSize: '1em',
						}}
					>
						<span style={{ fontWeight: 500 }}>{data.title}</span>
						{data.filterKey ? (
							<span style={{ color: '#646970' }}>
								: {data.filterKey}
							</span>
						) : (
							''
						)}
					</FlexItem>
				</Flex>
				<FlexItem
					style={{ display: 'inline-flex', alignItems: 'center' }}
				>
					<Button isSmall={true} style={{ borderRadius: '100%' }}>
						<Icon icon={toggleIcon} />
					</Button>
				</FlexItem>
			</div>
			{expanded ? (
				<div className='__inner'>
					<div style={{ marginBottom: '1em' }}>
						Override the filter settings
					</div>
					<div style={{ marginTop: 20 }}>
						<button
							type='button'
							className='button-link button-link-delete'
							style={{ fontSize: 13 }}
							onClick={deleteFilter}
						>
							{__('Delete', 'wc-ajax-product-filter')}
						</button>
						{` | `}
						<ExternalLink href={data.editLink}>
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
