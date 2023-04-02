import { PRIVATE_YELP_KEY } from '$env/static/private';
import { supabase } from '$lib/supabaseClient';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({params}) {
	//! JOE: call SUPABASE here

	// if ID exists, return w/ success if so
	const results  = await supabase
	.from('locations_by_id')
	.select()
	.eq('slug', params.slug);

	console.log('success', results);
	return {
		results,
		slug: params.slug
	}

	throw error(404, 'Not Found');
}