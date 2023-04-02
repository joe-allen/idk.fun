<script>
	import { supabase } from '$lib/supabaseClient.js';
	import { onMount } from 'svelte';
	import places from '../../Store';

	export let data;
	let yLocation;
	let nLocation;
	let businesses;
	let userId;
	let yesItems = [];
	let showYesItems;

	let match;
	$: match;

	// check svelte Store
	// for places
	if ($places) {
		businesses = $places.form.results.businesses;
	} else {
		// get supabase api results from
		// slug param from w/in load fn
		businesses = data.results.data[0].locations;
	}

	onMount(() => {
		// check svelte Store
		// for userID
		if ($places?.userId) {
			userId = $places.userId;
		} else if (window.localStorage.getItem('userId')) {
			userId = window.localStorage.getItem('userId');
		} else {
			userId = crypto.randomUUID();
			window.localStorage.setItem('userId', userId);
		}

		// listen for realtime
		// insert events
		supabase
			.channel('any')
			.on('postgres_changes', {
				event: 'INSERT',
				schema: 'public',
				table: 'locations_matched' }, payload => {
					showMatch(payload.new)
			})
			.subscribe();
	});

	function showMatch(data) {
		match = data;
		return;
	}

	async function yes(e) {
		const { id, name, zip } = e.target.dataset;
		const slug = $places?.form?.results?.slug ? $places.form.results.slug : data.results.data[0].slug;

		// if ID exists, return w/ success if so
		const success  = await supabase
			.from('locations_approved')
			.select()
			.neq('user_id', userId)
			.eq('location_id', id);

		if ( success.data.length ) {
			// Success! send location
			// to realtime table
			match = await supabase
				.from('locations_matched')
				.insert({
					location_id: id,
					location: businesses[0],
					name: name,
					slug,
					zip
				});

			showMatch(success.data[0]);
		}

		// insert row
		const { error } = await supabase
			.from('locations_approved')
			.insert({
				location_id: id,
				location: businesses[0],
				name: name,
				user_id: userId,
				slug,
				zip
			});

		if (error) {
			console.log('Insert Error: ', error);
		}

		// add yes item
		yesItems.push(businesses[0]);

		// remove from array
		businesses = businesses.slice(1);

		// Would like to avoid checking if matched
		// by hitting the database so often
		// checkForMatch();
	}

	function no() {
		// Would like to avoid checking if matched
		// by hitting the database so often
		checkForMatch();

		// remove from array
		businesses = businesses.slice(1);
	}

	async function checkForMatch() {
		const slug = data.slug;
		// CHECK if there are 2 records w/ same SLUG and LOCATION_ID'
		// where userId !== current userId;

		// get all records with same slug
		// flatten entries by location_id
		// flatten entries by user_id
		//
		// check are there two record of the same location_id from two different
		// user_ids

		// const success  = await supabase
		// 	.from('locations_approved')
		// 	.selectAll()
		// 	.eq('location_id', id)
		// 	.eq('userId', !== 'current_userId')
		// 	.eq('slug', slug);
	}

</script>

{#if match }
	Wahoo! Looks like we're going to "<strong>{match.name}</strong>" 🎉<br>
	<img src="{match.location.image_url}" width="300" height="366" alt=""><br>
	{#if match.location.url}
		 Make sure they're open: <a target="_blank" rel="nofollow noreferrer noopener" href="{match.location.url}">Yelp</a><br>
	{/if}
{:else if businesses }
	{#each businesses as b, index (index)}
	<div data-key={index}>
			<div>
				<p>name: {b.name}<br>rating: {b.rating}</p>
				<img src="{b.image_url}" width="300" height="366" alt="">
				<button bind:this={yLocation} on:click={yes} data-name={b.name} data-id={b.id} data-zip={b.location.zip_code}>Yes</button>
				<button bind:this={nLocation} on:click={no} data-name={b.name} data-id={b.id} data-zip={b.location.zip_code}>No</button>
			</div>
		</div>
		<hr>
	{/each}
	{#if !businesses.length }
		<h1>Welp, no matches yet. <button on:click={() => {window.location.reload()}}>Try again</button> {#if yesItems.length } or convince someone of the places you swiped '<button on:click={() => { showYesItems = true }}>Yes</button>' on.{/if}</h1>
		{#if yesItems && showYesItems}
			{#each yesItems as item}
				<p>name: <a target="_blank" rel="nofollow noreferrer noopener" href={item.url}>{item.name}</a><br>rating: {item.rating}</p>
				<img src="{item.image_url}" width="300" height="366" alt="">
				<hr>
			{/each}
		{/if}
	{/if}
{/if}
