import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import apiFetch from '@wordpress/api-fetch';
import { createForm, createSampleForm, deleteForm } from '../actions';
import type { Form } from '../types';

jest.mock( '@wordpress/api-fetch' );
const mockedApiFetch = jest.mocked( apiFetch );

describe( 'forms action thunks', () => {
	let dispatch: { addForm: jest.Mock; removeForm: jest.Mock };

	beforeEach( () => {
		dispatch = { addForm: jest.fn(), removeForm: jest.fn() };
		mockedApiFetch.mockReset();
	} );

	it( 'createForm posts the data and prepends the returned form', async () => {
		const created: Form = { id: 7, title: 'New' };
		mockedApiFetch.mockResolvedValue( created );

		const result = await createForm( { title: 'New', settings: {} } )( {
			dispatch,
		} );

		expect( mockedApiFetch ).toHaveBeenCalledWith( {
			path: '/wcapf/v1/forms',
			method: 'POST',
			data: { title: 'New', settings: {} },
		} );

		expect( dispatch.addForm ).toHaveBeenCalledWith( created );
		expect( result ).toBe( created );
	} );

	it( 'createSampleForm posts to the sample route', async () => {
		const created: Form = { id: 8, title: 'Sample' };
		mockedApiFetch.mockResolvedValue( created );

		await createSampleForm()( { dispatch } );

		expect( mockedApiFetch ).toHaveBeenCalledWith( {
			path: '/wcapf/v1/forms/sample',
			method: 'POST',
		} );
		expect( dispatch.addForm ).toHaveBeenCalledWith( created );
	} );

	it( 'deleteForm keeps the form in state when the request fails', async () => {
		mockedApiFetch.mockRejectedValue( new Error( 'nope' ) );

		await expect( deleteForm( 5 )( { dispatch } ) ).rejects.toThrow(
			'nope',
		);
		expect( dispatch.removeForm ).not.toHaveBeenCalled();
	} );
} );
