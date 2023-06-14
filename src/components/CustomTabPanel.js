/**
 * External dependencies
 */
import classnames from 'classnames';
import { partial, noop, find } from 'lodash';

/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { Button, NavigableMenu } from '@wordpress/components';

const TabButton = ({ tabId, onClick, children, selected, ...rest }) => (
	<Button
		role='tab'
		tabIndex={selected ? null : -1}
		aria-selected={selected}
		id={tabId}
		onClick={onClick}
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
	currentTab,
	onChangeTab,
}) {
	const instanceId = useInstanceId(CustomTabPanel, 'tab-panel');

	const handleClick = (tabKey) => {
		onChangeTab(tabKey);
		onSelect(tabKey);
	};

	const onNavigate = (childIndex, child) => {
		child.click();
	};
	const selectedTab = find(tabs, { name: currentTab });
	const selectedId = `${instanceId}-${selectedTab?.name ?? 'none'}`;

	useEffect(() => {
		const newSelectedTab = find(tabs, { name: currentTab });

		if (!newSelectedTab) {
			const _selected =
				initialTabName || (tabs.length > 0 ? tabs[0].name : null);

			onChangeTab(_selected);
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
								[activeClass]: tab.name === currentTab,
							}
						)}
						tabId={`${instanceId}-${tab.name}`}
						aria-controls={`${instanceId}-${tab.name}-view`}
						selected={tab.name === currentTab}
						key={tab.name}
						onClick={partial(handleClick, tab.name)}
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
