import { useEffect } from '@wordpress/element';
import { useForm } from './FormContext';
import axios from 'axios';
import { merge } from 'lodash';
import TopBar from '../TopBar';
import FormTitle from './FormTitle';
import FormTabPanel from './FormTabPanel';
// import FormPreview from './FormPreview';
import Notifications from '../Notifications';
import { defaultFormSettings } from '../utilsForForm';
import {
	filterDefaultData,
	proFilterComponents,
	proFilterTypes,
} from './utils';
import { foundProVersion } from '../utils';
import ReviewNotices from './ReviewNotices';

const WCAPF_PRO = foundProVersion();

const Form = () => {
	const { dispatch } = useForm();

	const getFormData = () => {
		const query = new URL(window.location.href);
		const id = query.searchParams.get('id');

		const data = {
			action: 'wcapf_get_form_data',
			post_id: id,
		};

		return axios.get(wcapf_admin_params.ajaxurl, {
			params: data,
		});
	};

	useEffect(() => {
		getFormData()
			.then((response) => {
				const {
					data: { data: formData },
				} = response;

				const filterKeys = formData['filter_keys'];
				const formFilters = [];
				const _formFilters = formData['form_filters'];
				const formSettings = formData['form_settings'];

				const proTypes = proFilterTypes();
				const proComponents = proFilterComponents();

				if (_formFilters) {
					for (let index = 0; index < _formFilters.length; index++) {
						const _formFilter = _formFilters[index];

						const isPro =
							proTypes.includes(_formFilter['type']) ||
							proComponents.includes(_formFilter['component']);

						if (!WCAPF_PRO && isPro) {
							continue;
						}

						const formFilter = {
							...filterDefaultData(),
							..._formFilter,
						};

						formFilters.push(formFilter);
					}
				}

				dispatch({ type: 'SET_FILTER_KEYS', payload: filterKeys });

				// The accordion and tab states of form filters.
				const filterStates = {};

				for (let index = 0; index < formFilters.length; index++) {
					const filterId = formFilters[index]['id'];
					let accordionStatus = false; // False means collapsed.
					let currentTab = 'general'; // The name of the first tab.

					// if (index === 0) {
					// 	accordionStatus = true;
					// 	currentTab = 'advanced';
					// }

					filterStates[filterId] = { accordionStatus, currentTab };
				}

				dispatch({ type: 'SET_FILTER_STATES', payload: filterStates });

				dispatch({ type: 'SET_FORM_FILTERS', payload: formFilters });

				dispatch({
					type: 'SET_FORM_SETTINGS',
					payload: merge({}, defaultFormSettings(), formSettings),
				});

				dispatch({ type: 'SET_LOADING', payload: false });
			})
			.catch((err) => {
				// TODO: Maybe show a snackbar notice.

				console.log(err);

				dispatch({ type: 'SET_LOADING', payload: false });
			});
	}, []);

	return (
		<>
			<div className='__wcapf_admin'>
				<TopBar view={'form'} />

				{/* This is customized only for the 'form' view */}
				<ReviewNotices />

				<div className='__edit_filter'>
					<div className='__edit_filter_from'>
						<div className='__content'>
							<FormTitle />
							<FormTabPanel />
						</div>
					</div>

					{/* <FormPreview /> */}
				</div>

				<Notifications />
			</div>
		</>
	);
};

export default Form;
