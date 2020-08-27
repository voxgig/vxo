import { mount } from '@vue/test-utils'
import Vue from 'vue'

import Vuetify from 'vuetify'
import { VueperSlides, VueperSlide } from 'vueperslides'

import def from '../src/components/SlideSelect.vue'

Vue.use(Vuetify)

Vue.component('vueper-slides', VueperSlides)
Vue.component('vueper-slide', VueperSlide)

describe(def.name, () => {
  it('happy', async () => {
    var props = {}

    var wrapper = make_component({ Vue, mount, def, props })

    expect(wrapper.html()).contains('vxo-slide-select')
  })
})
