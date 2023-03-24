import { supabase } from "$lib/supabaseClient";
/** @type {import('../$types').LayoutServerLoad} */

// export async function load() {
// 	const { data } = await supabase.from("location_approvedroved").select();

// 	return {
// 		locations: data ?? [],
// 	};
// }