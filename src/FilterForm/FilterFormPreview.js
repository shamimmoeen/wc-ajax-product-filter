import { Spinner } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import axios from 'axios';

const EditorPreview = () => {
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
				<h3
					style={{
						fontSize: 24,
						fontWeight: 400,
						borderBottom: '1px solid #ddd',
						paddingBottom: '.8em',
					}}
				>
					{__('Preview', 'wc-ajax-product-filter	')}
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

export default EditorPreview;
