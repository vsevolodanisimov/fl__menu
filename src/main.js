import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import createRouter from './router'

const router = createRouter()

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount('#app')
