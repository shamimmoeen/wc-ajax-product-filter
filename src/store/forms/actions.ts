import apiFetch from '@wordpress/api-fetch';
import type { Form } from './types';

interface CreateFormData {
	title: string;
	settings: Record< string, unknown >;
}

interface ThunkContext {
	dispatch: {
		addForm: ( form: Form ) => void;
		removeForm: ( id: number ) => void;
	};
}

export function setForms( forms: Form[] ) {
	return { type: 'SET_FORMS' as const, forms };
}

export function addForm( form: Form ) {
	return { type: 'ADD_FORM' as const, form };
}

export function removeForm( id: number ) {
	return { type: 'REMOVE_FORM' as const, id };
}

export const createForm =
	( data: CreateFormData ) =>
	async ( { dispatch }: ThunkContext ): Promise< Form > => {
		const form = await apiFetch< Form >( {
			path: '/wcapf/v1/forms',
			method: 'POST',
			data,
		} );

		dispatch.addForm( form );

		return form;
	};

export const createSampleForm =
	() =>
	async ( { dispatch }: ThunkContext ): Promise< Form > => {
		const form = await apiFetch< Form >( {
			path: '/wcapf/v1/forms/sample',
			method: 'POST',
		} );

		dispatch.addForm( form );

		return form;
	};

export const duplicateForm =
	( id: number ) =>
	async ( { dispatch }: ThunkContext ): Promise< Form > => {
		const form = await apiFetch< Form >( {
			path: `/wcapf/v1/forms/${ id }/duplicate`,
			method: 'POST',
		} );

		dispatch.addForm( form );

		return form;
	};

export const deleteForm =
	( id: number ) =>
	async ( { dispatch }: ThunkContext ): Promise< void > => {
		await apiFetch( {
			path: `/wcapf/v1/forms/${ id }`,
			method: 'DELETE',
		} );

		dispatch.removeForm( id );
	};
