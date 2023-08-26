import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import OrClause from './OrClause';

const AndClause = ({
	filterData,
	clause,
	andIndex,
	handleChange,
	handleRemove,
	handleAddingOrClause,
}) => {
	return (
		<div className='and-clause'>
			<div className='or-clauses'>
				{clause.map((andClause, index) => (
					<OrClause
						filterData={filterData}
						clause={andClause}
						orIndex={index}
						andIndex={andIndex}
						handleChange={handleChange}
						handleRemove={handleRemove}
						key={index}
					/>
				))}
				<Button
					onClick={() => handleAddingOrClause(andIndex)}
					variant='secondary'
				>
					{__('OR', 'wc-ajax-product-filter')}
				</Button>
			</div>
			<p className='and-clauses-separator'>
				{__('AND', 'wc-ajax-product-filter')}
			</p>
		</div>
	);
};

export default AndClause;
