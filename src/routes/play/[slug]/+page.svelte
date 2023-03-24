<script>
	import { supabase } from '$lib/supabaseClient.js';
	import places from '../../Store';

	export let data;
	let yLocation;
	let nLocation;
	let businesses;

	let match;
	$: match;

	if ($places) {
		businesses = $places.results.businesses;
	} else {
		// get supabase api results from
		// slug param from w/in load fn
		businesses = data.results.data[0].locations;
	}

	function showMatch(data) {
		console.log('data', data);
		match = data;
		return;
	}

	async function yes(e) {
		const { id, name } = e.target.dataset;

		// if ID exists, return w/ success if so
		const success  = await supabase
			.from('locations_approved')
			.select()
			.eq('location_id', id);

		if ( success.data.length ) {
			console.log(`Yes, we\'re going to: ${success.data[0].name}. Please make sure to check that theyre open: Yelp URL.`);
			showMatch(success.data[0]);
			return;
		}

		// insert ID
		const { error } = await supabase
			.from('locations_approved')
			.insert({
				location_id: id,
				location: businesses[0],
				name: name,
				slug: $places ? $places.id : data.results.data[0].slug,
				zip: 21206
			});

		if (error) {
			console.log('Insert Error: ', error);
		}

		// remove from array
		businesses = businesses.slice(1);
	}

	function no() {
		// remove from array
		businesses = businesses.slice(1);
	}
</script>

{#if match }
	Wahoo: {match.name}<br>
	<img src="{match.location.image_url}" width="300" height="366" alt=""><br>
	{#if match.location.url}
		 Make sure they're open: <a target="_blank" rel="nofollow noreferrer noopener" href="{match.location.url}">Yelp</a><br>
	{/if}
{:else if businesses }
	{#each businesses as b, index (index)}
	<div data-key={index}>
			<div>
				<p>name: {b.name}<br>rating: {b.rating}<br>Open: {b.is_closed}</p>
				<img src="{b.image_url}" width="300" height="366" alt="">
				<button bind:this={yLocation} data-name={b.name} data-id={b.id} on:click={yes}>Yes</button>
				<button bind:this={nLocation} data-name={b.name} data-id={b.id} on:click={no}>No</button>
			</div>
		</div>
		<hr>
	{/each}
	{#if !businesses.length }
		<h1>Welp, no matches yet. Either <a href="/play">try again</a> or convince someone on the places you swiped 'Yes' for.</h1>
	{/if}
{/if}
