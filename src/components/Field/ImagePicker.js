import { Button, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { MediaUpload } from '@wordpress/media-utils';
import { cancelCircleFilled } from '@wordpress/icons';
import { proTag } from '../utils';

const ALLOWED_MEDIA_TYPES = ['image'];

const ImagePickerField = ({ imageId, imageUrl, onChange, onClear }) => {
	return (
		<MediaUpload
			onSelect={(media) => onChange(media)}
			allowedTypes={ALLOWED_MEDIA_TYPES}
			value={imageId}
			render={({ open }) => {
				if (imageId) {
					return (
						<div className='__image_picker_group'>
							<Button
								variant='secondary'
								className='__thumbnail'
								onClick={open}
							>
								<span
									style={{
										backgroundImage: `url(${imageUrl})`,
									}}
								></span>
							</Button>
							<button
								className='button-link button-link-delete'
								onClick={onClear}
							>
								<Icon icon={cancelCircleFilled} size={20} />
							</button>
						</div>
					);
				} else {
					return (
						<Button
							className='__image_picker_button'
							variant='secondary'
							onClick={open}
						>
							{__('Select Image', 'wc-ajax-product-filter')}
						</Button>
					);
				}
			}}
		/>
	);
};

const ImagePicker = ({
	label,
	id,
	imageId,
	imageUrl,
	onChange,
	onClear,
	description,
	isPro,
	renderAsFormField = true,
}) => {
	if (renderAsFormField) {
		return (
			<div className='__form_control __image_picker'>
				<div className='__inner'>
					<div className='__label'>
						<label htmlFor={id}>
							{label}
							{proTag(isPro)}
						</label>
					</div>

					<div className='__wrapper'>
						<div className='__input_wrapper'>
							<ImagePickerField
								imageId={imageId}
								imageUrl={imageUrl}
								onChange={onChange}
								onClear={onClear}
							/>
						</div>
					</div>
				</div>

				{description && <p className='description'>{description}</p>}
			</div>
		);
	} else {
		return (
			<ImagePickerField
				imageId={imageId}
				imageUrl={imageUrl}
				onChange={onChange}
				onClear={onClear}
			/>
		);
	}
};

export default ImagePicker;
