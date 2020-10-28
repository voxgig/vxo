import './vxo.scss'

import Pkg from '../package.json'

import VxoCanary from './components/Canary.vue'
import VxoTaskBox from './components/TaskBox.vue'
import VxoSlideSelect from './components/SlideSelect.vue'
import VxoTime from './components/Time.vue'



const Vxo = {
  found: [],
}

Vxo.install = function (Vue, options) {
  var co = {
    VxoCanary,
    VxoTaskBox,
    VxoSlideSelect,
    VxoTime,
  }

  Object.keys(co).forEach((name) => {
    Vue.component(name, co[name])
    Vxo.found.push(name)
  })

  Vue.prototype.$vxo = {
    version: Pkg.version
  }
}

export default Vxo
