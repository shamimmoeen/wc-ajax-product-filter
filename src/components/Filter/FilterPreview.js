import {
	Card,
	CardBody,
	CardHeader,
	Notice,
	Spinner,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import axios from 'axios';
import { useFilter } from './FilterContext';
import { getTableData, isFilterReady } from './utils';

const accordionAnimation = wcapf_params.enable_animation_for_accordion;
const previewWrapperClass = accordionAnimation
	? 'wcapf-accordion-with-animation'
	: '';

const FilterPreview = () => {
	const {
		state: { isLoading, title, filterId, activeFilterData, loadPreview },
	} = useFilter();

	const [notice, setNotice] = useState('');
	const [preview, setPreview] = useState('');
	const [previewLoading, setPreviewLoading] = useState(false);

	useEffect(() => {
		if (isLoading) {
			return;
		}

		// Don't reload the preview after the filter is saved.
		if (!loadPreview) {
			return;
		}

		const message = isFilterReady(title, activeFilterData);

		if (message) {
			setNotice(message);
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
				setNotice('');

				jQuery('body').trigger('init_filter_widgets');
			})
			.catch((err) => {
				if (axios.isCancel(err)) {
					return 'axios request cancelled';
				}

				setPreviewLoading(false);
				setNotice('');

				console.log(err);
			});

		// cleanup function
		return () => {
			controller.abort();
		};
	}, [isLoading, title, activeFilterData]);

	return (
		<Card className='__preview_card'>
			<CardHeader>
				<h2>{__('Preview', 'wc-ajax-product-filter')}</h2>
				{previewLoading && <Spinner />}
			</CardHeader>
			<CardBody>
				{notice ? (
					<Notice status='info' isDismissible={false}>
						{notice}
					</Notice>
				) : (
					<div
						className={previewWrapperClass}
						dangerouslySetInnerHTML={{ __html: preview }}
					/>
				)}
			</CardBody>
		</Card>
	);
};

export default FilterPreview;
