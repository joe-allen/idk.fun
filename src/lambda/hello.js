// 'use strict';
// const util = require('util');
// const fetch = require('node-fetch');
// // const client_id = process.env.client_id; // Your client id
// // const client_secret = process.env.client_secret; // Your secret

// export function handler(event, context, callback) {
//     // done is called in order to send information back to the client
//     let done = (err, res) => {
//         if (err) {
//             callback(null,
//                 {
//                     statusCode: 400,
//                     body: JSON.stringify({
//                         type: "error"
//                     }),
//                     headers: {
//                     "Access-Control-Allow-Origin":"*" ,
//                     "Access-Control-Allow-Headers":"Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
//                     }

//                 });
//         }
//         else {
//             callback(null,
//                 {
//                     statusCode: 200,
//                     body: JSON.stringify({
//                         type: "success",
//                         done: res
//                     }),
//                     headers: {
//                     "Access-Control-Allow-Origin":"*" ,
//                     "Access-Control-Allow-Headers":"Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
//                     }
//                 });
//         }
//     };

//     // retrieve access token from Spotify API
//     let getAccessToken = (queryStringParameters) => {
//         // build Spotify API querystring according to the "Your application requests authorization"
//         //    section of https://developer.spotify.com/web-api/authorization-guide/#implicit-grant-flow
//         let url = 'https://api.yelp.com/v3/businesses/search';
//         let apiKey = 'BhauabqxyVvHFMECHZkaCCxlH5l0LDDAtVXB_oKPhYvGupr9fPcjTayY0EgaCDcIava1srZdjxFNb_yhNWMBZIbIzuBufiEkCd49tnVuKENbgKUV3GrAVuLk_iTOWnYx';
//         console.log("apiKey = " + apiKey);

//         let params = {
//             "term":"restaurant",
//             "location":"21214"
//         };

//         const formParams = Object.keys(params).map((key) => {
//             return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
//         }).join('&');

//         return fetch(url, {
//             method: 'GET',
//             headers: {
//                 "Authorization": 'Bearer ' + apiKey,
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             body: formParams
//         })
//             .then((response) => {
//                 console.log(util.inspect(response, { showHidden: true, depth: null }));
//                 return response.json();
//             })
//             .then((json) => {
//                 console.log("-----------------------------------------------");
//                 console.log(util.inspect(json, { showHidden: true, depth: null }));
//                 done(null, {
//                     json: json
//                 });
//             })
//             .catch((error) => {
//                 done({
//                     error: error
//                 });
//             });
//     };

//     // enter here
//     // surround everything in a try catch statement in case something breaks
//     try {
//         //console log the query string parameters
//         console.log(util.inspect(event.queryStringParameters, { showHidden: true, depth: null }));
//         getAccessToken(event.queryStringParameters);
//     } catch (error) {
//         console.log("initialization error");
//         console.log(util.inspect(error, { showHidden: true, depth: null }));
//         done(error);
//     }
// };