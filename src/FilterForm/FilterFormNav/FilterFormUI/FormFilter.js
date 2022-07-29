import { __ } from '@wordpress/i18n';
import { Button, Flex, FlexItem } from '@wordpress/components';
import { useState, useRef } from '@wordpress/element';
import { Icon, dragHandle, chevronDown, chevronUp } from '@wordpress/icons';

const FormFilter = ({ data }) => {
	const [expanded, setExpanded] = useState(false);
	const toggleRef = useRef('');

	function toggleExpand(focus = false) {
		const _expanded = !expanded;
		setExpanded(_expanded);

		if (focus) {
			toggleRef.current.focus();
		}
	}

	const toggleIcon = expanded ? chevronUp : chevronDown;

	function deleteFilter() {
		console.log('delete the filter item');
	}

	return (
		<div className={'__fz_item'}>
			<div
				className='top'
				style={{ display: 'flex', padding: '10px 15px' }}
			>
				<Flex justify={''}>
					<FlexItem
						style={{ display: 'inline-flex', alignItems: 'center' }}
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
					<Button
						isSmall={true}
						onClick={() => toggleExpand()}
						ref={toggleRef}
						style={{ borderRadius: '100%' }}
					>
						<Icon icon={toggleIcon} />
					</Button>
				</FlexItem>
			</div>
			{expanded ? (
				<div
					className='inside'
					style={{ padding: 15, borderTop: '1px solid #c3c4c7' }}
				>
					Display Type
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
						<button
							type='button'
							className='button-link'
							style={{ fontSize: 13 }}
							onClick={() => toggleExpand(true)}
						>
							{__('Done', 'wc-ajax-product-filter')}
						</button>
					</div>
				</div>
			) : (
				''
			)}
		</div>
	);
};

export default FormFilter;
