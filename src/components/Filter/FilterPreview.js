import {
	Card,
	CardBody,
	CardHeader,
	Icon,
	Notice,
	Spinner,
	Tooltip,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import axios from 'axios';
import ProFeaturesCard from '../ProFeaturesCard';
import { useFilter } from './FilterContext';

const previewTooltip = __(
	'This is for demonstration purposes only and may not look same in the frontend.',
	'wc-ajax-product-filter'
);

const accordionAnimation = wcapf_params.enable_animation_for_accordion;
const previewWrapperClass = accordionAnimation
	? 'wcapf-accordion-with-animation'
	: '';

const FilterPreview = () => {
	const {
		state: {
			title,
			filterId,
			activeFilterData,
			loadPreview,
			filterStatus,
			filterPreview,
		},
	} = useFilter();

	const [preview, setPreview] = useState('');
	const [initialLoading, setInitialLoading] = useState(true);
	const [previewLoading, setPreviewLoading] = useState(false);

	const { type, message } = filterStatus;
	const noticeType = 'data-missing' === type ? 'info' : 'error';

	useEffect(() => {
		if (!filterPreview) {
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
				setInitialLoading(false);
				setPreviewLoading(false);

				jQuery('body').trigger('init_filter_widgets');
			})
			.catch((err) => {
				if (axios.isCancel(err)) {
					return 'axios request cancelled';
				}

				setInitialLoading(false);
				setPreviewLoading(false);

				console.log(err);
			});

		// cleanup function
		return () => {
			controller.abort();
		};
	}, [filterPreview]);

	return (
		<>
			{'pro-feature' === type ? (
				<ProFeaturesCard />
			) : (
				<Card className='__preview_card'>
					<CardHeader>
						<h2>
							{__('Preview', 'wc-ajax-product-filter')}
							<Tooltip text={previewTooltip}>
								<span className='__preview_note'>
									<Icon icon={'editor-help'} />
								</span>
							</Tooltip>
						</h2>
						{previewLoading && !initialLoading && <Spinner />}
					</CardHeader>
					<CardBody>
						{message ? (
							<Notice status={noticeType} isDismissible={false}>
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
						)}
					</CardBody>
				</Card>
			)}
		</>
	);
};

export default FilterPreview;
