let map;
let service;
let infowindow;

// export const initialize = () => {
// 	// getLatLngFromZip(75223);
// 	console.log('hey joe');
// }

// function getLatLngFromZip(zip) {
// 	let geocoder = new google.maps.Geocoder();

// 	geocoder.geocode(
// 		{ 'address': 'zipcode '+zip },
// 		function (results, status) {
// 			if (status == google.maps.GeocoderStatus.OK) {
// 				let latitude = results[0].geometry.location.lat();
// 				let longitude = results[0].geometry.location.lng();
// 				// return [latitude, longitude];
// 				getLocations(latitude, longitude);
// 			} else {
// 				alert("Request failed.")
// 			}
// 	});

// }

// async function getLocations(latitude, longitude) {
// 	let location = new google.maps.LatLng(latitude, longitude);

// 	map = new google.maps.Map(document.getElementById('map'), {
// 		center: location,
// 		zoom: 15
// 	});

// 	let request = {
// 			location,
// 			radius: '8046.72', // 5 miles in meters: 8046.72
// 			query: 'bar'
// 	};

// 	service = new google.maps.places.PlacesService(map);
// 	service.textSearch(request, callback);
// }

// function callback(results, status) {

// 	let rez = [...results].filter((res, i) => {
// 		console.log('res', res);
// 		// if (res.photos) {
// 		// 	console.log(`photos ${i}:`, res.photos[0].getUrl());
// 		// }

// 		// return res.opening_hours.isOpen;
// 	});
// 	// console.log('res', rez);
// 	// return results;
// }