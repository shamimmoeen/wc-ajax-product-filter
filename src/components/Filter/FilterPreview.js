import { Spinner } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import axios from 'axios';
import { useFilter } from './FilterContext';

const FilterPreview = () => {
	const {
		state: { isLoading, title, filterId, activeFilterData, loadPreview },
	} = useFilter();

	const [preview, setPreview] = useState('');
	const [previewLoading, setPreviewLoading] = useState(true);

	useEffect(() => {
		if (isLoading) {
			return;
		}

		// Don't reload the preview after the filter is saved.
		if (!loadPreview) {
			return;
		}

		setPreviewLoading(true);

		const formData = new FormData();

		formData.append('action', 'wcapf_get_filter_preview');
		formData.append('filter_title', title);
		formData.append('filter_id', filterId);
		formData.append('filter_data', JSON.stringify(activeFilterData));

		const controller = new AbortController();

		axios
			.post(wcapf_admin_params.ajaxurl, formData, {
				signal: controller.signal,
			})
			.then((res) => {
				const {
					data: { data },
				} = res;

				setPreview(data);
				setPreviewLoading(false);
			})
			.catch((err) => {
				if (axios.isCancel(err)) {
					return 'axios request cancelled';
				}

				console.log(err);
				setPreviewLoading(false);
			});

		// cleanup function
		return () => {
			controller.abort();
		};
	}, [isLoading, title, activeFilterData]);

	return (
		<div className={'editor-preview'}>
			<div className={'__inner'}>
				<h3 className='__title'>
					{__('Preview', 'wc-ajax-product-filter	')}
				</h3>
				{previewLoading ? (
					<Spinner />
				) : (
					<div dangerouslySetInnerHTML={{ __html: preview }}></div>
				)}
			</div>
			<div className={'__overlay'}></div>
		</div>
	);
};

export default FilterPreview;
