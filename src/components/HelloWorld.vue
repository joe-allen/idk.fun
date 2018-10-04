<template>
  <v-container fluid fill-height abs>
    <!-- <div class="bgImage" style="
        background: url('https://s3-media3.fl.yelpcdn.com/bphoto/LhtqPDUKgSUHv0gkri9pdg/o.jpg');
        position: absolute;
        width: 100%;
        height: 200px;
        background-size: cover;
        background-position: center;
        margin-left: -16px;
        top: 0;
        z-index: 0;
        filter: blur(3px) saturate(99%);
        /* display: none; */
    "></div> -->
    <v-layout column>
      <v-flex justify-space-between>
        <v-layout column justify-space-between>
          <v-autocomplete
            v-show="!resultsAreIn"
            v-model="filter_category"
            :items="categories"
            hide-no-data
            hide-selected
            item-text="Description"
            clearable
            item-value="API"
            placeholder="Search (bars, coffee, restaurants)"
            prepend-icon="business"
            return-object
          ></v-autocomplete>
          <!-- <v-text-field
            required
            prepend-icon="my_location"
            @keyup="getTypedLocation"
            v-model="filter_location"
            :items="location"
            clearable
            @input="filterLocation"
            label="What's your location?"
            class="your_locale--input"
            hint="USE YOUR LOCATION?"
            persistent-hint
          ></v-text-field> -->
          <v-combobox
              v-show="!resultsAreIn"
              prepend-icon="my_location"
              @keyup.native="getTypedLocation"
              :no-filter=true
              v-model="filter_location"
              :items="location"
              clearable
              @input="filterLocation"
              label="What's your location?"
            ></v-combobox>
          <v-slider
            v-show="!resultsAreIn"
            class="mt-4"
            prepend-icon="place"
            thumb-label="always"
            step="5"
            max="25"
            min="0"
            label="Distance (mi)"
            ticks="always"
            tick-size="2"
            v-model="distance"
            auto-grow
            color="primary"
            full-width
            type="number"
          ></v-slider>
          <div v-if="alert">
            <!-- <v-alert
              transition="scale-transition"
              :value="true"
              color="error"
              dismissible
              @input="clearAlert"
            >
              {{errorMsg}}
            </v-alert> -->
            <v-snackbar
              dismissible
              @input="clearAlert"
              v-model="snackbar"
              multi-line="multi-line"
              :timeout="timeout"
              vertical="vertical"
            >
              {{errorMsg}}
              <v-btn
                dark
                flat
                @click="snackbar = false"
              >
                Close
              </v-btn>
            </v-snackbar>
          </div>
          <div v-else>
            <v-flex justify-center v-if="resultsAreIn">
              <v-layout column align-center class="text-center">
                <!-- <code style="height: 100px; overflow: scroll;">{{ yelpResultsRandom1 }}</code> -->
                <a
                  target="_blank"
                  :href="`http://maps.google.com/maps?q=${yelpResultsRandom1.coordinates.latitude},${yelpResultsRandom1.coordinates.longitude}`"
                >
                  <img class="result_img" v-show="yelpResultsRandom1.image_url !== undefined" :src="yelpResultsRandom1.image_url" :alt="`${yelpResultsRandom1.name} + image`">
                </a>
                <p class="result_title"><strong>{{ yelpResultsRandom1.name }}</strong></p>
                <!-- <p class="result_rating" v-if="yelpResultsRandom1.rating.length > 1"><v-icon v-for="star in yelpResultsRandom1.rating" small ma-0>star</v-icon></p> -->
                <p class="result_rating">{{yelpResultsRandom1.rating }}<v-icon small ma-0>star</v-icon></p>
                <p class="result_category">
                  <span v-for="(cat, index) in yelpResultsRandom1.categories" :key="`cat_${index}_${yelpResultsRandom1.id}`">
                    <v-chip class="secondary white--text" small>{{ cat.title }}</v-chip>
                  </span>
                </p>
              </v-layout>
            </v-flex>
          </div>

          <v-flex xs2 column justify-space-around align-center>

            <div v-show="showMap" id="mapContainer"></div>

            <v-flex column justify-space-around align-center class="cta_buttons">

              <!-- <v-btn
                small
                v-if="resultsAreIn"
                class="mx-0 flip_btn_sm"
                @click="clickShowMap"
                :loading="loading"
                :disabled="loading">

              </v-btn> -->
              <v-icon
                large
                v-show="resultsAreIn"
                color="accent"
                @click="clickShowMap">
                place
              </v-icon>


              <v-btn
                v-if="resultsAreIn"
                class="mx-0 flip_btn"
                @click="processReset"
                :loading="loading"
                :disabled="loading"
                color="primary">
                <v-icon medium v-if="resultsAreIn">keyboard_backspace</v-icon>
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
              </v-btn>
              <v-btn
                v-else
                class="mx-0 flip_btn"
                @click="processRequest"
                :loading="loading"
                :disabled="loading"
                color="primary">
                <v-icon medium>search</v-icon>
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
              </v-btn>

              <v-icon
                large
                color="accent"
                v-show="resultsAreIn"
                @click="clickShowOptions">
                local_taxi
              </v-icon>
            </v-flex>

          </v-flex>

          <v-dialog
            v-model="showOptions"
            max-width="290"
          >
            <v-card v-if="resultsAreIn">
              <v-card-title class="headline">Show me the way!</v-card-title>

              <v-card-text>
                <div class="option_container">
                  <a class="ride_link d-flex align-center" :href="`https://lyft.com/ride?id=lyft&pickup[latitude]=${latitude}&pickup[longitude]=${longitude}&profile=personal&partner=yAgBxTGTRKTD&destination[latitude]=${yelpResultsRandom1.coordinates.latitude}&destination[longitude]=${yelpResultsRandom1.coordinates.longitude}`" target="_blank" rel="noopener">
                    <img src="/img/lyft-icon.png" alt="lyft logo" class="option_icons">
                    <p>Use Lyft</p>
                  </a>
                </div>
                <div class="option_container">
                  <a class="ride_link d-flex align-center" :href="`https://m.uber.com/ul/?action=setPickup&client_id=XteLnZWwawM3slD31lMIiYrc6_jfvBke&pickup[latitude]=${latitude}&pickup[longitude]=${longitude}&dropoff[latitude]=${yelpResultsRandom1.coordinates.latitude}&dropoff[longitude]=${yelpResultsRandom1.coordinates.longitude}&dropoff[nickname]=${encodeURIComponent(yelpResultsRandom1.name)}`" target="_blank" rel="noopener">
                    <img src="/img/uber-icon.png" alt="uber logo" class="option_icons">
                    <p>Use Uber</p>
                  </a>
                </div>
                <div class="option_container">
                  <a class="ride_link d-flex align-center" :href="`tel:${encodeURIComponent(yelpResultsRandom1.display_phone)}`">
                    <v-icon medium class="option_icons">phone</v-icon>
                    <p>Call 'em {{yelpResultsRandom1.display_phone}}</p>
                  </a>
                </div>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import mapboxgl from 'mapbox-gl';

export default {
  data () {
    return {
      alert: false,
      errorMsg: '',
      resultsAreIn: false,
      loading: false,
      yelpResults: {},
      yelpResultsRandom1: {},
      yelpResultsTotal: '',
      userResults: '',
      category: '',
      distance: 5,
      items: [
      {
        icon: 'home',
        title: 'Dashboard',
        path: '/'
      },
      // {
      //   icon: 'monetization_on',
      //   title: 'Revenue',
      //   path: '/revenue'
      // },
      // {
      //   icon: 'nature',
      //   title: 'Promos',
      //   path: '/promo/id'
      // },
      // {
      //   icon: 'settings',
      //   title: 'Settings',
      //   path: '/settings'
      // },
      // {
      //   icon: 'power_settings_new',
      //   title: 'Login',
      //   path: '/login'
      // }
      ],
      filter_category: '',
      filter_location: '',
      location: ['Use My Location'],
      latitude: '',
      longitude: '',
      defaultRadius: 40000,
      defaultLimit: 50,
      defaultTerm: 'restaurant',
      defaultLocation: '21202',
      defaultOffset: 0,
      snackbar: false,
      color: '',
      mode: '',
      timeout: 3000,
      showMap: false,
      showOptions: false,
      categories: ["Food","Bars","Restaurants","Museums","Coffee","Wine","Brewering","Candy Stores","Parks","Adult Entertainment"]
    }
  },
  name: 'App',
  mounted () {

  },
  computed: {
    // update logo size
    hasMiniVariant () {
      let logoSize = ''

      // if menu icons only are shown
      if(this.miniVariant) {
        logoSize = 'logo_sm';
      }
      return logoSize;
    }
  },
  methods: {
    getTypedLocation: function ($event) {

      if($event.target.value.length > 2) {

        let encodeInput = encodeURI($event.target.value)

        axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeInput}.json?access_token=pk.eyJ1Ijoiam9lLWFsbGVuIiwiYSI6ImNqbTZ3NW9qdjM0dmYzcG10cDVrcnBqMGcifQ.l5Y9LdUyIKmyZ8-ufkczJQ&autocomplete=true&limit=6`)
        .then(response => {
          this.location = ["Use My Location"]
          response.data.features.forEach(element => {
            this.location.push(element.place_name);
          })
        });
      }
      else {
        this.location = ["Use My Location"]
      }
    },
    filterLocation: function () {
      if(this.filter_location == 'Use My Location') {
        if (navigator.geolocation) {
          return new Promise((res, reject) => {
            navigator.geolocation.getCurrentPosition(res, reject)
          })
        }
      }
    },
    getUserCoords: function () {
      let component = this;

      this.filterLocation().then(response => {

        if (response.coords) {
          component.latitude = response.coords.latitude;
          component.longitude = response.coords.longitude;
        }
        else {
          alert('Sorry, geolocation is not available in your browser');
        }

        // response is ready, call postRequest
        this.buildRequest();

      }).catch(
        // catch error
        error => {
          var msg = null;
          switch(error.code) {
            case error.PERMISSION_DENIED:
                msg = "User denied the request for Geolocation.";
                break;
            case error.POSITION_UNAVAILABLE:
                msg = "Location information is unavailable.";
                break;
            case error.TIMEOUT:
                msg = "The request to get user location timed out.";
                break;
            case error.UNKNOWN_ERROR:
                msg = "An unknown error occurred.";
                break;
          }
          console.log('error: ', msg);
          this.alert = true;
          this.snackbar = true;
          this.loading = false;
          this.timeout = 8000;
          this.errorMsg = "Location error! :o We dont have permission to user your location. Try your zip code!";
        }
      );
    },
    processRequest: function () {
      let component = this;

      // show loading
      this.loading = true;
      this.resultsAreIn = false;

      if (this.filter_location == "" || this.filter_location == null || this.filter_location == 'undefined' ||
          this.filter_category == "" || this.filter_category == null || this.filter_category == 'undefined') {
        this.alert = true;
        this.snackbar = true;
        this.loading = false;
        this.timeout = 3000;
        this.errorMsg = "Oops, please use the filters above!";
      } else {

        this.alert = false;
        this.snackbar = false;

        if(this.filter_location == 'Use My Location') {
          // 'Use My Location' is selected, wait coords
          this.getUserCoords();
        }
        else {
          // reset vars
          this.latitude = '';
          this.longitude = '';

          this.buildRequest();
        }
      }
    },
    processReset: function () {
      this.resultsAreIn = false;
      this.showMap = false;
    },
    buildRequest: function () {
      let component = this;
      let params = {};

      // non exposed params
      params = {
          "limit": this.defaultLimit,
          "radius": this.defaultRadius,
          "offset": this.defaultOffset,
      };

      // user input overwrites
      if (this.distance !== '') {
        // 25 miles is more than 40000 meters.
        // Set to 40k if 25 is inputted
        if(this.distance == 25) {
          params.radius = 40000;
        } else {
          // mutliply meters with miles
          params.radius = (this.distance * 1610);
        }
      }

      if (this.latitude !== '') {
        params.latitude = this.latitude;
        params.longitude = this.longitude;
      }
      else {
        params.location = (this.filter_location !== '') ? this.filter_location : this.defaultLocation;
      }
      params.term = (this.filter_category !== '') ? this.filter_category : 'restaurant';

      // build api query string
      let qs = function(obj) {
        let str = '';
        let objLen = Object.values(obj).length;
        let i = 0;

        for(let k in obj) {

          if(obj.hasOwnProperty(k)) {
            if (i == 0) {
              // check weather to add '?'
              str += `?${k}=`;
              str += `${obj[k]}&`;
            } else if ((i+1) == objLen) {
              // check weather to add '&'
              str += `${k}=`;
              str += `${obj[k]}`;
            } else {
              str += `${k}=`;
              str += `${obj[k]}&`;
            }
          }

          i++;
        }
        return str;
      }

      let paramResults = qs(params);
      // console.log('paramResults: ', paramResults);

      // send to api
      this.postRequest(paramResults);
    },
    clearAlert: function () {
      this.alert = false;
    },
    postRequest: function (paramResults) {
      let component = this;
      let randomNum = Math.floor((Math.random() * 50));

      axios.post('/.netlify/functions/yelp', paramResults)
      .then(response => {
        component.loading = false;
        component.resultsAreIn = true;
        component.yelpResults = response.data;
        component.yelpResultsRandom1 = response.data.businesses[randomNum];
        component.yelpResultsTotal = response.data.total;
        console.log('component.yelpResultsRandom1: ', component.yelpResultsRandom1);
      });
    },
    clickShowMap: function () {
      let component = this;
      this.showMap = !this.showMap;

      if (this.showMap == true) {
        mapboxgl.accessToken = 'pk.eyJ1Ijoiam9lLWFsbGVuIiwiYSI6ImNqbTZ3NW9qdjM0dmYzcG10cDVrcnBqMGcifQ.l5Y9LdUyIKmyZ8-ufkczJQ';

        // FOR DARK THEME:
        // style: 'mapbox://styles/mapbox/dark-v9'
        let map = new mapboxgl.Map({
          container: 'mapContainer',
          logoPosition: 'top-left',
          // center: [-122.420679, 37.772537],
          center: [component.yelpResultsRandom1.coordinates.longitude, component.yelpResultsRandom1.coordinates.latitude],
          zoom: 11,
          style: 'mapbox://styles/joe-allen/cjm722bp94bof2rnyln7bp8l0'
        });

        setTimeout(() => {
          map.resize();
        }, 0);

        var marker = new mapboxgl.Marker({
          color: '#ffa726'
        })
        .setLngLat([component.longitude, component.latitude])
        .addTo(map);

        var marker = new mapboxgl.Marker({
          color: '#1976d2'
        })
        .setLngLat([component.yelpResultsRandom1.coordinates.longitude, component.yelpResultsRandom1.coordinates.latitude])
        .addTo(map);
      }
    },
    clickShowOptions: function () {
      console.log('showOPtions: ', this.showOptions);
      this.showOptions = !this.showOptions
    }
  }
}
</script>

<style>
  ::selection {
    background: #1976d2;
    color: #fff;
  }
  ::-moz-selection {
    background: #1976d2;
    color: #fff;
  }
  .flex {
    display: flex;
  }
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img.logo {
    margin: 0 auto;
    align-self: center;
  }
  img.logo {
    width: 100px;
    border-radius: 50%;
  }
  img.logo_sm {
    width: 50px;
    margin-bottom: 20px;
  }
  .v-footer {
    padding: 0 24px;
  }
  .v-text-field.v-text-field--enclosed .v-input__slot {
    padding: 4px 20px;
  }
  .v-text-field--outline .v-input__slot {
    border-radius: 345290px;
  }
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  .flip_btn {
    /* position: fixed; */
    /* align-self:center;
    bottom: -190px;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    margin: 0 auto; */
    border-radius: 50%;
    width: 90px;
    height: 90px;
    z-index: 1;
    padding: 0;
    animation: change_color;
    animation-duration: 15s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
    background: #ffa726;
    /* background: linear-gradient(top, #ffa726 99%, #e57373 100%); */
  }
  .flip_btn_sm {
    /* position: fixed; */
    /* align-self:center;
    bottom: -190px;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    margin: 0 auto; */
    border-radius: 23252523px;
    width: 25px;
    height: 50px;
    z-index: 1;
    padding: 0;
    animation: change_color;
    animation-duration: 15s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
    background: #ffa726;
    /* background: linear-gradient(top, #ffa726 99%, #e57373 100%); */
  }
  @keyframes change_color {
    0% {
     background: #ffa726;
     /* background: linear-gradient(top, #ffa726 50%, #e57373 100%); */
    }
    50% {
     background: #e57373;
     /* background: linear-gradient(top, #e57373 60%, #ffa726 100%); */
    }
    100% {
      background: #ffa726;
      /* background: linear-gradient(top, #ffa726 99%, #e57373 100%); */
    }
  }
  .text-center p {
    text-align: center;
  }
  .your_locale--input .v-messages.theme--light,
  .your_locale--input .v-messages.theme--dark {
    color: #e57373
  }
  .your_locale--input .v-messages.theme--light:hover,
  .your_locale--input .v-messages.theme--dark:hover {
    cursor: pointer;
  }
  .abs {
    position: absolute;
  }
  .result_img {
    border-radius: 50%;
    /* border: 4px solid #fff; */
    margin-bottom: 30px;
    width: 250px;
    height: 250px;
    box-shadow: 0px 4px 10px #333, -24px 17px 0px -2px #e57373, -17px -9px 0px 0px #1976d2, 12px 2px 0px 10px #ffa726;
    /* box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12); */
    object-fit: cover;
  }
  .result_rating .v-icon {
    font-size: 1.25em;
    color: #e57373;
    margin-left: 0px;
  }
  .result_category {
    white-space: nowrap;
    overflow-x: auto;
  }
  .result_title {
    text-transform: uppercase;
    font-size: 2em;
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media screen and (max-height: 480px) {
    .fill-height {
      height: 600px;
    }
  }

  .cta_buttons {
    position: absolute;
    width: 100%;
    z-index: 10;
    padding: 10px 0;
  }
  .option_container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
  }
  .option_container p {
    margin: 0;
    margin-left: 16px;
  }
  .option_icons {
    width: 45px;
    align-self: center;
  }
  .ride_link {
    color: initial;
    text-decoration: none;
  }

  /* map */
  #mapContainer { position:absolute; top:0; height: 300px; width:100%; }
  canvas.mapboxgl-canvas {
    left: 0;
    width: 100%;
  }
  @media screen and (max-width: 800px) {
    #mapContainer { position:absolute; top:0; width:100%; }
  }
</style>