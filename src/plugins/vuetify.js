import Vue from 'vue'
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  VTextField,
  VAutocomplete,
  VCombobox,
  VSlider,
  VChip,
  VAlert,
  VSnackbar,
  VTextarea,
  VCheckbox,
  VForm,
  VDialog,
  VCard,
  transitions
} from 'vuetify'
import 'vuetify/src/stylus/app.styl'

// Helpers
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VTextField,
    VAutocomplete,
    VCombobox,
    VSlider,
    VChip,
    VAlert,
    VSnackbar,
    VTextarea,
    VCheckbox,
    VForm,
    VDialog,
    VCard,
    transitions
  },
  theme: {
    primary: colors.blue.darken2,
    secondary: colors.red.lighten2,
    accent: colors.orange.lighten1,
    error: colors.red.base,
    warning: colors.yellow.base,
    info: colors.blue.base,
    success: colors.green.base
  }
})
