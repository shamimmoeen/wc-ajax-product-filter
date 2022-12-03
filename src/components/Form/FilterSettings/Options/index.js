import ValueTypeNumber from './ValueTypeNumber';
import TaxonomyOptions from './TaxonomyOptions';
import RatingOptions from './RatingOptions';
import ManualOptions from './ManualOptions';
import ValueTypeText from './ValueTypeText';
import ValueTypeDate from './ValueTypeDate';
import PostAuthorOptions from './PostAuthorOptions';
import { useForm } from '../../FormContext';

const Options = ({ index }) => {
	const { state } = useForm();

	const { formFilters } = state;

	const filter = formFilters[index];

	const { type: filterType, value_type } = filter;

	const renderFields = () => {
		let fields;

		if ('taxonomy' === filterType) {
			if ('number' === value_type) {
				fields = <ValueTypeNumber index={index} />;
			} else {
				fields = <TaxonomyOptions index={index} />;
			}
		} else if ('price' === filterType) {
			fields = <ValueTypeNumber index={index} />;
		} else if ('rating' === filterType) {
			fields = <RatingOptions index={index} />;
		} else if ('product-status' === filterType) {
			fields = <ManualOptions index={index} />;
		} else if ('post-meta' === filterType) {
			if ('text' === value_type) {
				fields = <ValueTypeText index={index} />;
			} else if ('number' === value_type) {
				fields = <ValueTypeNumber index={index} />;
			} else if ('date' === value_type) {
				fields = <ValueTypeDate index={index} />;
			}
		} else if ('post-author' === filterType) {
			fields = <PostAuthorOptions index={index} />;
		}

		return fields;
	};

	return <>{renderFields()}</>;
};

export default Options;
