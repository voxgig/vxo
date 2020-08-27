import { mount } from '@vue/test-utils'
import Vue from 'vue'

import Vuetify from 'vuetify'

import def from '../src/components/Canary.vue'

Vue.use(Vuetify)


describe(def.name, () => {
  it('happy', async () => {
    var props = {}

    var wrapper = make_component({ Vue, mount, def, props })

    expect(wrapper.html()).contains('CANARY')
  })
})
