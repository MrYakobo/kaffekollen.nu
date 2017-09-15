import Vue from 'vue'

import index from './index.vue'

var vm = new Vue({
  el: '#app',
  render: h => h(index)
})

export default vm
