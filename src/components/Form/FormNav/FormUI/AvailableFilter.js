import { __, sprintf } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { Icon, plus, reset } from '@wordpress/icons';
import classnames from 'classnames';

const AvailableFilter = ({ item, handleToggleAddFilter, forModal }) => {
	const classes = classnames('__item', { active: 'added' === item.status });

	let button;

	if (forModal) {
		button = (
			<Button variant='secondary'>
				<Icon icon={'added' === item.status ? reset : plus} size={20} />
			</Button>
		);
	} else {
		button = (
			<Button variant='secondary' disabled={'added' === item.status}>
				<Icon icon={plus} size={20} />
			</Button>
		);
	}

	return (
		<div className={classes} onClick={() => handleToggleAddFilter(item)}>
			<div>
				<span className='__post_title'>{item.title}</span>
				<span className='__post_id'>
					{sprintf(__('ID: %d', 'wc-ajax-product-filter'), item.id)}
				</span>
			</div>
			<div className='__btn_wrapper'>{button}</div>
		</div>
	);
};

export default AvailableFilter;
