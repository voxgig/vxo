import '@mdi/font/css/materialdesignicons.css'

import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import Vxo from './vxo.js'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(Vuetify, {
  iconfont: 'mdi'
})

Vue.use(Vxo)

var vue = new Vue({
  render: h => h(App)
}).$mount('#app')


