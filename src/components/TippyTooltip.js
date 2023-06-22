import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Icon } from '@wordpress/components';
import { TooltipIcon } from './SVGIcons';

const TippyTooltip = ({ content }) => {
	return (
		<Tippy content={content} className='__tippy_tooltip'>
			<span className='__help_info'>
				<Icon icon={TooltipIcon} size={16} />
			</span>
		</Tippy>
	);
};

export default TippyTooltip;
