import { __ } from '@wordpress/i18n';
import { useForm } from '../../FormContext';
import ValueTypeText from './ValueTypeText';
import ValueTypeNumber from './ValueTypeNumber';
import ValueTypeDate from './ValueTypeDate';

const Appearance = ({ index }) => {
	const { state } = useForm();

	const { formFilters } = state;

	const filter = formFilters[index];

	const { type, value_type } = filter;

	const renderFields = () => {
		let fields;

		if ('taxonomy' === type && 'number' === value_type) {
			fields = <ValueTypeNumber index={index} />;
		} else if ('price' === type) {
			fields = <ValueTypeNumber index={index} />;
		} else if ('post-meta' === type) {
			if ('text' === value_type) {
				fields = <ValueTypeText index={index} />;
			} else if ('number' === value_type) {
				fields = <ValueTypeNumber index={index} />;
			} else if ('date' === value_type) {
				fields = <ValueTypeDate index={index} />;
			}
		} else {
			fields = <ValueTypeText index={index} />;
		}

		return fields;
	};

	return renderFields();
};

export default Appearance;
