import { PRIVATE_YELP_KEY } from '$env/static/private';
import { supabase } from '$lib/supabaseClient';
import { fail } from '@sveltejs/kit';
import axios  from 'axios';

let limit = 3; // max yelp results
let radius = 16093; // 10 miles
let slug;

// Get the total number of places
// so an offset # can be used
async function getOffset(cat=null, zip=null) {
	const offset = `https://api.yelp.com/v3/businesses/search?limit=1&radius=${radius}&location=${zip}&term=${cat}&open_now=true`
	const headers = {
		'Authorization': `Bearer ${PRIVATE_YELP_KEY}`,
		'Accept': 'application/json',
		'Content-Type': 'application/x-www-form-urlencoded',
		"Access-Control-Allow-Origin": "*", // Required for CORS support to work
		"Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
	}

	const offsetNumber = await axios.get(offset, {headers}).then(total => {
		return fetchLocations(cat, zip, total.data.total)
	});

	return offsetNumber;

}

// YELP'S API
async function fetchLocations(cat=null, zip=null,total=null) {
	// use the total / minus the limit
	// bc an offset greater than
	// the total will break
	const randomOffset = Math.floor(Math.random() * parseInt((total - limit), 10));
	const route = `https://api.yelp.com/v3/businesses/search?limit=${limit}&offset=${randomOffset}&radius=${radius}&location=${zip}&term=${cat}&open_now=true`
	const headers = {
		'Authorization': `Bearer ${PRIVATE_YELP_KEY}`,
		'Accept': 'application/json',
		'Content-Type': 'application/x-www-form-urlencoded',
		"Access-Control-Allow-Origin": "*", // Required for CORS support to work
		"Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
	}

	const data = await axios.get(route, {headers}).then(places => {
		 return storePlace(places);
	});

	return data;
}

async function storePlace(yelp_results) {
	slug = crypto.randomUUID();
	const inserted = await supabase
		.from('locations_by_id')
		.insert({
			locations: yelp_results.data.businesses,
			slug
		})
		.then(sb_results => {
			return {
				success: true,
				slug,
				...sb_results,
				...yelp_results.data
			};
	});

	return inserted;
}

// USE `export let form` in view
/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request }) => {

		try {
			const data = await request.formData();
			const cat = data.get('cat');
			const zip = data.get('zip');

			// return form
			// if invalid
			if (!cat || !zip) {
				return fail(400, {
					error: true,
					message: 'Please fill out all fields.',
					cat,
					zip,
				});
			}

			return {
				cat,
				zip,
				results: await getOffset(cat, zip)
			}

		} catch (error) {
			console.log('Error: ', error);
		}
  }

};
