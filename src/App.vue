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
        <p>Will<br>soon<br>have<br>options<br>.</p>
      </v-flex>
      <v-footer app>
        <span>&copy; IDK.</span>
      </v-footer>
    </v-navigation-drawer>
  </v-app>
</template>

<script>

// import { bus } from './main';

export default {
  data () {
    return {
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
      title: 'IDK.'
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
    showMenu () {
      let setFocus = document.getElementById('myid');

      // open drawer
      this.openDrawer = !this.openDrawer

      // set input focus
      setFocus.focus();
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