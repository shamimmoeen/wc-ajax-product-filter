import { useLayoutEffect, useState } from '@wordpress/element';
import TippyTooltip from '../TippyTooltip';
import { getInputId, proTag } from '../utils';

const InputFieldWithBlur = ({
	inputId,
	id,
	index,
	initialValue,
	onChange,
	type = 'text',
	isDisabled,
	customClass,
	...rest
}) => {
	const [value, setValue] = useState(initialValue);

	useLayoutEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	const handleInputChange = (e) => {
		setValue(e.target.value);
	};

	let classes = 'components-text-control__input';

	if (customClass) {
		classes += ` ${customClass}`;
	}

	return (
		<input
			type={type}
			id={inputId}
			className={classes}
			disabled={isDisabled}
			value={value}
			onChange={handleInputChange}
			onBlur={() => onChange(value, id, index)}
			{...rest}
		/>
	);
};

const InputField = ({
	inputId,
	id,
	index,
	initialValue: value,
	onChange,
	type = 'text',
	isDisabled,
	customClass,
	...rest
}) => {
	let classes = 'components-text-control__input';

	if (customClass) {
		classes += ` ${customClass}`;
	}

	return (
		<input
			type={type}
			id={inputId}
			className={classes}
			disabled={isDisabled}
			value={value}
			onChange={(e) => onChange(e.target.value, id, index)}
			{...rest}
		/>
	);
};

const Text = ({
	label,
	id,
	index = '',
	value,
	onChange,
	description,
	type = 'text',
	renderAsFormField = true,
	isFilterKey = false,
	isDisabled = false,
	tooltip,
	customClass,
	isPro,
	...rest
}) => {
	const inputId = getInputId(id, index);

	if (renderAsFormField) {
		return (
			<div className='__form_control'>
				<div className='__inner'>
					<div className='__label'>
						<label htmlFor={inputId}>
							{label}

							{'field_key' === id && (
								<TippyTooltip
									content={
										<>
											For example, the URL will be
											<br />
											?/color=blue&size=large
											<br />
											where color & size are the filter
											keys.
											<br />
											<br />
											In the PRO version, the URL will be
											<br />
											/color-blue/size-large
										</>
									}
								/>
							)}

							{'search_field_default_placeholder' === id && (
								<TippyTooltip
									content={
										<>
											Applicable when the search box is
											enabled in the list view. This will
											be overridden by the placeholder
											value of the filter itself.
											<br />
											<br />
											Default is "Search"
										</>
									}
								/>
							)}

							{'no_results_text' === id && (
								<TippyTooltip
									content={
										<>
											Applicable when the search box is
											enabled in the list view and
											combobox enabled in the dropdown
											view.
											<br />
											<br />
											Default is "No results for:", for a
											keyword "purple" the text will be
											"No results for: <u>purple</u>"
										</>
									}
								/>
							)}

							{'chosen_no_options_text' === id && (
								<TippyTooltip
									content={
										<>
											Applicable when combobox is enabled
											in the dropdown(multiselect) view
											and all options have been chosen.
											<br />
											<br />
											Default is "No options to choose"
										</>
									}
								/>
							)}

							{'empty_filter_text' === id && (
								<TippyTooltip
									content={
										<>
											Applicable when there is no options
											to filter by or the filter is empty.
											<br />
											<br />
											Default is "N/A"
										</>
									}
								/>
							)}

							{'results_count_markup' === id && (
								<TippyTooltip
									content={
										<>
											Default: Found %d product|Found %d
											products
											<br />
											<br />
											Here two markups are separated by
											the pipe(|) character. The first
											markup is for the singular result
											and the second one is for the plural
											result. %d will be replaced with
											product count.
										</>
									}
								/>
							)}

							{'sort_by_prefix' === id && (
								<TippyTooltip
									content={
										<>
											This prefix will be used in the
											active filters, before the sort by
											value.
											<br />
											<br />
											Default is "Sort by:", for a value
											"Title" it becomes
											<br />
											"Sort by: Title" in the active
											filters.
										</>
									}
								/>
							)}

							{'per_page_prefix' === id && (
								<TippyTooltip
									content={
										<>
											This prefix will be used in the
											active filters, before the per page
											value.
											<br />
											<br />
											Default is "Per page:", for a value
											"15" it becomes
											<br />
											"Per page: 15" in the active
											filters.
										</>
									}
								/>
							)}

							{proTag(isPro)}
						</label>
					</div>
					<div className='__wrapper'>
						<div className='__input_wrapper'>
							{isFilterKey ? (
								<InputFieldWithBlur
									inputId={inputId}
									id={id}
									index={index}
									initialValue={value}
									onChange={onChange}
									type={type}
									isDisabled={isDisabled}
									customClass={customClass}
									{...rest}
								/>
							) : (
								<InputField
									inputId={inputId}
									id={id}
									index={index}
									initialValue={value}
									onChange={onChange}
									type={type}
									isDisabled={isDisabled}
									customClass={customClass}
									{...rest}
								/>
							)}

							{tooltip && <TippyTooltip content={tooltip} />}
						</div>
					</div>
				</div>
				{description && (
					<p
						className='description'
						dangerouslySetInnerHTML={{ __html: description }}
					/>
				)}
			</div>
		);
	} else {
		return (
			<>
				{isFilterKey ? (
					<InputFieldWithBlur
						inputId={inputId}
						id={id}
						index={index}
						initialValue={value}
						onChange={onChange}
						type={type}
						isDisabled={isDisabled}
						customClass={customClass}
						{...rest}
					/>
				) : (
					<InputField
						inputId={inputId}
						id={id}
						index={index}
						initialValue={value}
						onChange={onChange}
						type={type}
						isDisabled={isDisabled}
						customClass={customClass}
						{...rest}
					/>
				)}
			</>
		);
	}
};

export default Text;
