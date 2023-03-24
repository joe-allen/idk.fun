<script>
	/** @type {import('./$types').PageData} */
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import places from '../Store';
	import ClipboardJS from '../../../node_modules/clipboard/src/clipboard.js';

	export let data;
	export let form;
	let show;
	let url;
	let copyBtn;
	let loading = false;

	onMount(() => {
		// check if form exists
		// and error free
		if (form && !form.error) {
			console.log('form', form);
			loading = false;
			show = !show
			url = `${window.location}/${form.results.slug}`;
			copyBtn.dataset.clipboardText = url;
		}
	});

	// copy to clipboard
	function copyLink(e) {
		let clipboard = new ClipboardJS('.b-copy-link');
		clipboard.on('success', function(e) {
			return;
		});
	}

	// send user to page
	// w/ results
	function play() {
		if (form && !form.error) {
			places.update(() => {
				return form;
			});
		}

		goto(url);
	}

	// while loading, `action`
	// in page.server is
	// being run after
	// to get results
	function showLoading() {
		loading = true;
	}
</script>

<!-- <svelte:head>
	<script async
		src="https://maps.googleapis.com/maps/api/js?key={gAPIKey}&libraries=places&callback=Function.prototype"
		on:load={initialize()}
	>
	</script>
</svelte:head> -->
<h1>How To Play:</h1>

<ol>
	<li>Select a category</li>
	<li>Set you zip code</li>
	<li>Click "Find Locations"</li>
	<li>Copy the link</li>
	<li>Send to a friend</li>
	<li>Start the game</li>
</ol>

<form method="POST">
	<fieldset>
		<h3>Select a category</h3>
		<select name="cat" value={form?.cat ?? ''}>
			<option disabled>Select</option>
			<option>Food</option>
			<option>Bar</option>
			<option>Museum</option>
		</select>

		<h3>Provide a zip code</h3>
		<input type="number" name="zip" value={form?.zip ?? ''}>
		<br>
		<br>
		<!-- <button>Find Locations</button> -->
		<button on:click|once={showLoading}>Find Locations</button>
		{#if loading}
			<div>loading...</div>
		{/if}
		{#if form && form.error}
			<div>Whoops, please fill out all fields.</div>
		{/if}
	</fieldset>
</form>

{#if form && !form.error}
<div style="display: {show ? 'block' : 'none'};">
	<button
		class="b-copy-link"
		bind:this={copyBtn}
		on:click|once|preventDefault={copyLink}
		data-clipboard-text='ok'
	>
		Copy to clipboard!
	</button>
	<button on:click={play}>Play game!</button>
</div>
{/if}