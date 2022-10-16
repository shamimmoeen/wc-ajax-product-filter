import { Spinner } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import axios from 'axios';

const FilterPreview = () => {
	const [preview, setPreview] = useState('');
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		axios
			.get(wcapf_admin_params.ajaxurl, {
				params: { action: 'get_filter_preview' },
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
				</h3>
				{isLoading ? (
					<Spinner />
				) : (
					// <div dangerouslySetInnerHTML={{ __html: preview }}></div>
					<div>
						<div
							className='wcapf-single-filter wcapf-nav-filter wcapf-attribute-filter'
							data-id='62'
						>
							<h4 className='wcapf-field-title'>Color</h4>
							<div className='wcapf-field-inner'>
								<div
									className='wcapf-layered-nav display-type-checkbox show-count'
									data-multiple-filter='1'
									data-filter-key='_color'
								>
									<ul>
										<li>
											<input
												type='checkbox'
												id='_color-input-62-18'
												name='_color[]'
												value='18'
											/>
											<label htmlFor='_color-input-62-18'>
												<span>Blue</span>
												<span className='count'>5</span>
											</label>
										</li>
										<li>
											<input
												type='checkbox'
												id='_color-input-62-28'
												name='_color[]'
												value='28'
											/>
											<label htmlFor='_color-input-62-28'>
												<span>Gray</span>
												<span className='count'>3</span>
											</label>
										</li>
										<li>
											<input
												type='checkbox'
												id='_color-input-62-23'
												name='_color[]'
												value='23'
											/>
											<label htmlFor='_color-input-62-23'>
												<span>Green</span>
												<span className='count'>3</span>
											</label>
										</li>
										<li>
											<input
												type='checkbox'
												id='_color-input-62-24'
												name='_color[]'
												value='24'
											/>
											<label htmlFor='_color-input-62-24'>
												<span>Red</span>
												<span className='count'>4</span>
											</label>
										</li>
										<li>
											<input
												type='checkbox'
												id='_color-input-62-29'
												name='_color[]'
												value='29'
											/>
											<label htmlFor='_color-input-62-29'>
												<span>Yellow</span>
												<span className='count'>1</span>
											</label>
										</li>
									</ul>
								</div>
							</div>
						</div>
						{/* <p>
							Contrary to popular belief, Lorem Ipsum is not
							simply random text. It has roots in a piece of
							classical Latin literature from 45 BC, making it
							over 2000 years old. Richard McClintock, a Latin
							professor at Hampden-Sydney College in Virginia,
							looked up one of the more obscure Latin words,
							consectetur, from a Lorem Ipsum passage, and going
							through the cites of the word in classical
							literature, discovered the undoubtable source. Lorem
							Ipsum comes from sections 1.10.32 and 1.10.33 of "de
							Finibus Bonorum et Malorum" (The Extremes of Good
							and Evil) by Cicero, written in 45 BC. This book is
							a treatise on the theory of ethics, very popular
							during the Renaissance. The first line of Lorem
							Ipsum, "Lorem ipsum dolor sit amet..", comes from a
							line in section 1.10.32. The standard chunk of Lorem
							Ipsum used since the 1500s is reproduced below for
							those interested. Sections 1.10.32 and 1.10.33 from
							"de Finibus Bonorum et Malorum" by Cicero are also
							reproduced in their exact original form, accompanied
							by English versions from the 1914 translation by H.
							Rackham.
						</p>
						<p>
							Contrary to popular belief, Lorem Ipsum is not
							simply random text. It has roots in a piece of
							classical Latin literature from 45 BC, making it
							over 2000 years old. Richard McClintock, a Latin
							professor at Hampden-Sydney College in Virginia,
							looked up one of the more obscure Latin words,
							consectetur, from a Lorem Ipsum passage, and going
							through the cites of the word in classical
							literature, discovered the undoubtable source. Lorem
							Ipsum comes from sections 1.10.32 and 1.10.33 of "de
							Finibus Bonorum et Malorum" (The Extremes of Good
							and Evil) by Cicero, written in 45 BC. This book is
							a treatise on the theory of ethics, very popular
							during the Renaissance. The first line of Lorem
							Ipsum, "Lorem ipsum dolor sit amet..", comes from a
							line in section 1.10.32. The standard chunk of Lorem
							Ipsum used since the 1500s is reproduced below for
							those interested. Sections 1.10.32 and 1.10.33 from
							"de Finibus Bonorum et Malorum" by Cicero are also
							reproduced in their exact original form, accompanied
							by English versions from the 1914 translation by H.
							Rackham.
						</p> */}
					</div>
				)}
			</div>
			<div className={'__overlay'}></div>
		</div>
	);
};

export default FilterPreview;
