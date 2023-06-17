import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Icon } from '@wordpress/components';
import { tooltipIcon } from './SVGIcons';

const TippyTooltip = ({ content }) => {
	return (
		<Tippy content={content} className='__tippy_tooltip'>
			<span className='__help_info'>
				<Icon icon={tooltipIcon} size={16} />
			</span>
		</Tippy>
	);
};

export default TippyTooltip;
