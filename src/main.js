import Vue from 'vue'

import app from './app.vue'
Vue.component('app', app)

import city from './city.vue'
Vue.component('city', city)

import result from './result.vue'
Vue.component('result',result)

import index from './index.vue'

var vm = new Vue({
  el: '#app',
  render: h => h(index)
})

export default vm