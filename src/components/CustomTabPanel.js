/**
 * @wordpress/components '^19.16.0'
 * @wordpress/scripts '^23.5.0'
 */

/**
 * External dependencies
 */
import classnames from 'classnames';
import { partial, find } from 'lodash';

/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { NavigableMenu, Button } from '@wordpress/components';

const noop = () => {};

const TabButton = ({
	tabId,
	onClick,
	isDisabled,
	children,
	selected,
	...rest
}) => (
	<Button
		role='tab'
		tabIndex={selected ? null : -1}
		aria-selected={selected}
		id={tabId}
		onClick={onClick}
		disabled={isDisabled}
		{...rest}
	>
		{children}
	</Button>
);

export default function CustomTabPanel({
	className,
	children,
	tabs,
	initialTabName,
	orientation = 'horizontal',
	activeClass = 'is-active',
	onSelect = noop,
}) {
	const instanceId = useInstanceId(CustomTabPanel, 'tab-panel');
	const [selected, setSelected] = useState(null);

	const handleClick = (tabKey) => {
		setSelected(tabKey);
		onSelect(tabKey);
	};

	const onNavigate = (childIndex, child) => {
		child.click();
	};
	const selectedTab = find(tabs, { name: selected });
	const selectedId = `${instanceId}-${selectedTab?.name ?? 'none'}`;

	useEffect(() => {
		const newSelectedTab = find(tabs, { name: selected });
		if (!newSelectedTab) {
			setSelected(
				initialTabName || (tabs.length > 0 ? tabs[0].name : null)
			);
		}
	}, [tabs]);

	return (
		<div className={className}>
			<NavigableMenu
				role='tablist'
				orientation={orientation}
				onNavigate={onNavigate}
				className='components-tab-panel__tabs'
			>
				{tabs.map((tab) => (
					<TabButton
						className={classnames(
							'components-tab-panel__tabs-item',
							tab.className,
							{
								[activeClass]: tab.name === selected,
							}
						)}
						tabId={`${instanceId}-${tab.name}`}
						aria-controls={`${instanceId}-${tab.name}-view`}
						selected={tab.name === selected}
						key={tab.name}
						onClick={partial(handleClick, tab.name)}
						isDisabled={tab.isDisabled}
					>
						{tab.title}
					</TabButton>
				))}
			</NavigableMenu>
			{selectedTab && (
				<div
					key={selectedId}
					aria-labelledby={selectedId}
					role='tabpanel'
					id={`${selectedId}-view`}
					className='components-tab-panel__tab-content'
				>
					{children(selectedTab)}
				</div>
			)}
		</div>
	);
}
