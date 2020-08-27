import './vxo.scss'

import VxoCanary from './components/Canary.vue'
import VxoSlideSelect from './components/SlideSelect.vue'

const Vxo = {
  found: [],
}

Vxo.install = function (Vue, options) {
  var co = {
    VxoCanary,
    VxoSlideSelect,
  }

  Object.keys(co).forEach((name) => {
    Vue.component(name, co[name])
    Vxo.found.push(name)
  })
}

export default Vxo
