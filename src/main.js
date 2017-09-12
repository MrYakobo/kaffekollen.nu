import Vue from 'vue'

import app from './app.vue'
Vue.component('app', app)

import index from './index.vue'

var vm = new Vue({
  el: '#app',
  render: h => h(index)
})

export default vm