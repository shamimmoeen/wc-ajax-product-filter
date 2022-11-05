import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import AndClause from './AndClause';
import { isEmpty } from 'lodash';

const Rules = ({
	label,
	rules,
	handleChange,
	handleRemove,
	handleAddingAndClause,
	handleAddingOrClause,
	handleRemoveAllRules,
}) => {
	return (
		<div className='__form_control __rules'>
			<div className='__inner'>
				<div className='__label'>
					<label>{label}</label>
				</div>
				<div className='__wrapper'>
					<div className='__input_wrapper'>
						<div className='and-clauses'>
							{rules.map((clause, index) => (
								<AndClause
									clause={clause}
									andIndex={index}
									handleChange={handleChange}
									handleRemove={handleRemove}
									handleAddingOrClause={handleAddingOrClause}
									key={index}
								/>
							))}
						</div>

						<div className='__buttons'>
							<Button
								onClick={handleAddingAndClause}
								variant='secondary'
							>
								{__('Add rule group', 'wc-ajax-product-filter')}
							</Button>
							{!isEmpty(rules) && (
								<Button
									onClick={handleRemoveAllRules}
									variant='tertiary'
									isDestructive
								>
									{__('Remove all', 'wc-ajax-product-filter')}
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Rules;
