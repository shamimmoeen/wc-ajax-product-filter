import { describe, it, expect } from '@jest/globals';
import reducer from '../reducer';
import { addForm, removeForm } from '../actions';

describe( 'forms reducer', () => {
	it( 'prepends a new form on addForm so the newest is first', () => {
		const state = reducer(
			{
				forms: [ { id: 1, title: 'A' } ],
			},
			addForm( { id: 2, title: 'B' } ),
		);

		expect( state.forms ).toEqual( [
			{ id: 2, title: 'B' },
			{ id: 1, title: 'A' },
		] );
	} );

	it( 'drops only the matching form on removeForm', () => {
		const state = reducer(
			{
				forms: [
					{ id: 1, title: 'A' },
					{ id: 2, title: 'B' },
				],
			},
			removeForm( 1 ),
		);

		expect( state.forms ).toEqual( [ { id: 2, title: 'B' } ] );
	} );

	it( 'does not mutate the previous state', () => {
		const previous = { forms: [ { id: 1, title: 'A' } ] };

		reducer( previous, addForm( { id: 2, title: 'B' } ) );

		expect( previous.forms ).toEqual( [ { id: 1, title: 'A' } ] );
	} );
} );
