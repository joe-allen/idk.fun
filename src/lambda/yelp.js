let axios = require('axios')

export function handler(event, context, callback) {

  console.log("event::", event.body);
  console.log("context::", context);
  console.log("callback::", callback);



  axios.get('https://api.yelp.com/v3/businesses/search'+event.body, {
    headers: {
      'Authorization': 'Bearer BhauabqxyVvHFMECHZkaCCxlH5l0LDDAtVXB_oKPhYvGupr9fPcjTayY0EgaCDcIava1srZdjxFNb_yhNWMBZIbIzuBufiEkCd49tnVuKENbgKUV3GrAVuLk_iTOWnYx',
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
    }
  })
    .then(response => {

      callback(null, {
        statusCode: 200,
        body: JSON.stringify(response.data)
      })

    }).catch((error) => {
      // Error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // console.log(error.response.data);
        console.log(error.response.status);
        // console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }

      console.log("config", error.config);
    });
}
