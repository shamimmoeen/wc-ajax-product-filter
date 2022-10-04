import { Icon, Spinner, Tooltip } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { help } from '@wordpress/icons';
import axios from 'axios';

const FilterFormPreview = () => {
	const [preview, setPreview] = useState('');
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		axios
			.get(wcapf_admin_params.ajaxurl, {
				params: { action: 'get_filter_form_preview' },
			})
			.then(({ data: { data } }) => {
				setPreview(data);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	}, []);

	return (
		<div className={'editor-preview'}>
			<div className={'__inner'}>
				<h3 className='__title'>
					{__('Preview', 'wc-ajax-product-filter	')}
					<Tooltip
						text={__(
							'This is for demonstration purposes only.',
							'wc-ajax-product-filter'
						)}
					>
						<span style={{ marginLeft: 5 }}>
							<Icon icon={help} size={20} />
						</span>
					</Tooltip>
				</h3>
				{isLoading ? (
					<Spinner />
				) : (
					<div dangerouslySetInnerHTML={{ __html: preview }}></div>
				)}
			</div>
			<div className={'__overlay'}></div>
		</div>
	);
};

export default FilterFormPreview;
