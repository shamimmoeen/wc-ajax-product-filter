const EditorPreview = () => {
	return (
		<div className={ 'editor-preview' }>
			<div className={ '__inner' }>
				<div className="wcapf-single-filter wcapf-nav-filter wcapf-attribute-filter" data-id="66-242">
					<div className="wcapf-field-heading with-accordion"><h4 className="wcapf-field-title">Color</h4>
						<span className="wcapf-accordion-toggle-wrapper"><span className="wcapf-accordion-toggle"
																			   role="button" tabIndex="0"></span></span>
					</div>
					<div className="wcapf-field-inner">
						<div className="wcapf-layered-nav display-type-checkbox show-count" data-multiple-filter="1"
							 data-filter-key="_weight">
							<ul>
								<li><input type="checkbox" id="_weight-input-237-242-2.5" name="_weight[]"
										   value="2.5" /><label
									htmlFor="_weight-input-237-242-2.5"><span>2.5 kg</span><span
									className="count">2</span></label></li>
								<li><input type="checkbox" id="_weight-input-237-242-3" name="_weight[]"
										   value="3" /><label htmlFor="_weight-input-237-242-3"><span>3 kg</span><span
									className="count">0</span></label></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div className={ '__overlay' }></div>
		</div>
	);
};

export default EditorPreview;
