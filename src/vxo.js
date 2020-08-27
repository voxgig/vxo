import './vxo.scss'

import VxoCanary from './components/Canary.vue'

const Vxo = {
  found: [],
}

Vxo.install = function (Vue, options) {
  var co = {
    VxoCanary,
  }

  Object.keys(co).forEach((name) => {
    Vue.component(name, co[name])
    Vxo.found.push(name)
  })
}

export default Vxo
