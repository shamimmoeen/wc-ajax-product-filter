import {
	Card,
	CardBody,
	CardHeader,
	Icon,
	Spinner,
	Tooltip,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { help } from '@wordpress/icons';
import axios from 'axios';

const previewTooltip = __(
	'This is for demonstration purposes only',
	'wc-ajax-product-filter'
);

const FormPreview = () => {
	// const [preview, setPreview] = useState('');
	// const [isLoading, setLoading] = useState(true);

	// useEffect(() => {
	// 	axios
	// 		.get(wcapf_admin_params.ajaxurl, {
	// 			params: { action: 'get_filter_form_preview' },
	// 		})
	// 		.then(({ data: { data } }) => {
	// 			setPreview(data);
	// 			setLoading(false);
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 			setLoading(false);
	// 		});
	// }, []);

	return (
		<div className='__preview_card'>
			<div className='__inner'>
				<h2 className='__preview_label'>
					{__('Preview', 'wc-ajax-product-filter')}
				</h2>
				<div className=''>
					The preview will go here
					{/* {message ? (
					<Notice status='info' isDismissible={false}>
						{message}
					</Notice>
				) : (
					<>
						{initialLoading ? (
							<Spinner />
						) : (
							<div
								className={previewWrapperClass}
								dangerouslySetInnerHTML={{
									__html: preview,
								}}
							/>
						)}
					</>
				)} */}
				</div>
			</div>
		</div>

		// <Card className='__preview_card'>
		// 	<CardHeader>
		// 		<h2>
		// 			{__('Preview', 'wc-ajax-product-filter')}
		// 			<Tooltip text={previewTooltip}>
		// 				<span className='__preview_note'>
		// 					<Icon icon={'editor-help'} />
		// 				</span>
		// 			</Tooltip>
		// 		</h2>
		// 		{/* {previewLoading && !initialLoading && <Spinner />} */}
		// 	</CardHeader>
		// 	<CardBody>
		// 		The preview will go here
		// 		{/* {message ? (
		// 			<Notice status='info' isDismissible={false}>
		// 				{message}
		// 			</Notice>
		// 		) : (
		// 			<>
		// 				{initialLoading ? (
		// 					<Spinner />
		// 				) : (
		// 					<div
		// 						className={previewWrapperClass}
		// 						dangerouslySetInnerHTML={{
		// 							__html: preview,
		// 						}}
		// 					/>
		// 				)}
		// 			</>
		// 		)} */}
		// 	</CardBody>
		// </Card>
	);
};

export default FormPreview;
