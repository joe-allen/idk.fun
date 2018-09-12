<template>
  <v-app :dark="darkTheme">
    <!-- <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      v-model="drawer"
      enable-resize-watcher
      app
    >
      <v-list>
        <img src="@/assets/logo.png" alt="Fun Flip" class="mb-5 mt-4 align-center logo" :class="hasMiniVariant">
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
          :to="item.path"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer> -->
    <v-toolbar
      app
      class="transarent--bg"
    >
      <!-- <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn> -->
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="invertColors">
        <v-icon medium>invert_colors</v-icon>
      </v-btn>
      <v-btn icon @click.stop="showMenu">
        <v-icon large class="secondary--text">more_vert</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content style="padding: 60px 0px 10px;">
      <router-view/>
    </v-content>
    <v-navigation-drawer
      temporary
      :right="right"
      v-model="openDrawer"
      app
    >
      <v-flex xs12 ma-4>
        <v-layout column>
          <!-- <p>Will<br>soon<br>have<br>options<br>.</p> -->
          <v-form
            method="post"
            action=""
            data-netlify="true"
            netlify-honeypot="bot-field"
            name="contact"
            ref="form"
            v-model="valid"
            lazy-validation
            @submit.prevent="handleSubmit">
            <input type="hidden" name="form-name" value="contact" />

            <v-textarea
              name="suggestions"
              label="Have any suggestions?"
              value=""
              hint="More options, ability to order food, sharing options"
              persistent-hint
              counter
              :rules="suggestionRules"
            ></v-textarea>
            <v-checkbox
              name="receiveUpdates"
              v-model="checkbox"
              @change="EmailUpdates"
              label="Wanna stay updated?"
              class="mt-4"
            ></v-checkbox>
            <v-text-field
              name="emailAddress"
              v-show="checkbox"
              id="email"
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
              class="mt-0"
              type="email"
            ></v-text-field>
            <v-btn
              :disabled="!valid"
              type="submit"
              class="ma-1"
            >
              submit
            </v-btn>
          </v-form>
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
        </v-layout>
      </v-flex>
      <v-footer app>
        <span>&copy; IDK.</span>
      </v-footer>
    </v-navigation-drawer>
  </v-app>
</template>

<script>

// import { bus } from './main';
import qs from 'qs';

export default {
  data () {
    return {
      valid: true,
      email: '',
      emailRules: [
        // v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      suggestionRules: [
        v => !!v || 'Suggestion is required in order to submit',
        v => (v && v.length >= 5) || 'Must be more than 5 characters'
      ],
      checkbox: false,
      drawer: false,
      fixed: false,
      marker: true,
      darkTheme: false,
      searchStr: '',
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
      miniVariant: false,
      right: true,
      openDrawer: false,
      title: 'IDK.',
      alert: false,
      errorMsg: '',
      snackbar: false,
      color: '',
      mode: '',
      timeout: 3000,
    }
  },
  name: 'App',
  created () {
    // bus.$on('darkTheme', (darkTheme) => {
    //  this.darkTheme = darkTheme;
    // });
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
    EmailUpdates: function () {
      if(this.checkbox == true) {
        setTimeout(function() {
          document.getElementById('email').focus();
        }, 250);
      } else {
        // console.log('yes',this.$refs.form);
      }
    },
    clearAlert: function () {
      this.alert = false;
    },
    handleSubmit () {
      let component = this;
      if (this.$refs.form.validate()) {

        let formResults = {
          'form-name': 'contact',
          'suggestion': this.suggestion,
          'email_updates': this.EmailUpdates,
          'email': this.email
        }

        // console.log('component: ', this.$refs.form.$attrs.action);
        console.log('component: ', component);

        fetch("/#/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: qs.stringify(formResults)
        }).then(response => {
          component.alert = true;
          component.snackbar = true;
          component.loading = false;
          component.timeout = 3000;
          component.errorMsg = (this.checkbox) ? "Nice! We will be in touch." : "Nice! Thanks for your input";
          console.log('response: ', response);
        });
      } else {
        // console.log('no',this.suggestionRules);
      }
    },
    showMenu () {
      // open drawer
      this.openDrawer = !this.openDrawer
    },
    invertColors () {
      // switch colors
      this.darkTheme = !this.darkTheme
    },
    search () {
      this.$router.push('/promo/' + this.searchStr)
    }
  }
}
</script>

<style>
  *, p, span, h1, h2, h3 {
    font-family: courier;
  }
  ::selection {
    background: #00bbde;
    color: #fff;
  }
  ::-moz-selection {
    background: #00bbde;
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
  .theme--light nav.transarent--bg {
    background-color: #fafafa;
    background: #fafafa;
    box-shadow: none;
  }
  .theme--dark nav.transarent--bg {
    background-color: #303030;
    background: #303030;
    box-shadow: none;
  }
</style>