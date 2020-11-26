import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

const colors = {
  primary: '#007bff',
  secondary: '#3e8989',
  accent: '#df2d16',
  error: '#FF5252',
  info: '#2196F3',
  success: '#4CAF50',
  warning: '#FFC107',
}

export default new Vuetify({
  theme: {
    themes: {
      light: {
        ...colors,
      },
    },
  },
})
