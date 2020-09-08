import '@mdi/font/css/materialdesignicons.css'

import Moment from 'moment'

import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'

import draggable from 'vuedraggable'

import Vxo from './vxo.js'
import App from './App.vue'

Vue.config.productionTip = false

Vue.prototype.$Moment = Moment

Vue.component('vueper-slides', VueperSlides)
Vue.component('vueper-slide', VueperSlide)

Vue.component('draggable', draggable)

Vue.use(Vuetify, {
  iconfont: 'mdi',
})

Vue.use(Vxo)

var vue = new Vue({
  render: (h) => h(App),
}).$mount('#app')
