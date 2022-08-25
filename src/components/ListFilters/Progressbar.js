const Progressbar = ({ width }) => {
	const _style = width ? { width: `${width}%` } : {};

	return (
		<div className='__progressbar'>
			<div className='__progress'>
				<div
					className='__progress-bar __progress-bar-striped __progress-bar-animated'
					role='progressbar'
					aria-valuemin='0'
					aria-valuemax='100'
					style={_style}
				></div>
			</div>
		</div>
	);
};

export default Progressbar;
