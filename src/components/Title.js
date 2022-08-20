import {
	Button,
	Flex,
	FlexItem,
	Icon,
	TextControl,
} from '@wordpress/components';
import { removeParam } from './utils';

const Title = ({ label, value, handleChange }) => {
	const link = removeParam('id', window.location.search);

	return (
		<Flex justify={'normal'} align={'end'}>
			<div className='__back_button_wrapper'>
				<Button href={link}>
					<Icon
						icon={
							<svg
								id='__back_button_svg'
								width='16px'
								height='16px'
								viewBox='0 0 512.006 512.006'
							>
								<g>
									<g>
										<path d='M388.419,475.59L168.834,256.005L388.418,36.421c8.341-8.341,8.341-21.824,0-30.165s-21.824-8.341-30.165,0    L123.586,240.923c-8.341,8.341-8.341,21.824,0,30.165l234.667,234.667c4.16,4.16,9.621,6.251,15.083,6.251    c5.461,0,10.923-2.091,15.083-6.251C396.76,497.414,396.76,483.931,388.419,475.59z' />
									</g>
								</g>
								<g></g>
								<g></g>
								<g></g>
								<g></g>
								<g></g>
								<g></g>
								<g></g>
								<g></g>
								<g></g>
								<g></g>
								<g></g>
								<g></g>
								<g></g>
								<g></g>
								<g></g>
							</svg>
						}
						size={56}
						className='__back_button'
					/>
				</Button>
			</div>
			<FlexItem style={{ flex: 1 }}>
				<TextControl
					label={label}
					value={value}
					onChange={(value) => handleChange(value)}
					className={'__title'}
				/>
			</FlexItem>
		</Flex>
	);
};

export default Title;
