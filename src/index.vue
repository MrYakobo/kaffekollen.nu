<style scoped>
.grid-index {
  /*display: grid;*/
  /*grid-template-rows: 1fr [title] auto;*/
  /*grid-template-columns: 1fr [label] 150px [input] 80px [button];*/
  /*grid-template-columns: 1fr [title];*/
  /*grid-template-areas: "title title title" "label input button";*/
  /*grid-row-gap: 0px;*/
  /*grid-column-gap: 10px*/
}

h1.title {
  grid-area: title
}

input {
  grid-area: input
}

button {
  grid-area: button
}

p {
  grid-area: label
}
</style>
<template>
<div>
    <div class="container" v-if="!ok">
      <div class="box grid-index">
        <h1 class="title is-1">Kaffekollen.nu</h1>
        <div class="section">
          <p>Hej, och varmt välkommen till Kaffekollen.nu! För att kunna erbjuda lokala priser så rekommenderar vi på Kaffekollen att du skriver in var du befinner dig eller kommer att befinna dig när du handlar ditt kaffe.</p>
        </div>
        <mapsquery @done="done"></mapsquery>
      </div>
    </div>
    <app v-else @choose="ok=false"></app>
</div>
</template>
<script>
// const online = location.href.indexOf('5000') > -1
const online = require('./isOnline.js')

import store from 'store'
import socketIO from 'socket.io-client'

import app from './app.vue'

import mapsquery from './mapsquery.vue'
export default {
  name: 'index',
  components: {
    mapsquery: mapsquery,
    app: app
  },
  data() {
    return {
      io: {},
      ok: typeof(store.get('cities')) !== 'undefined',
    }
  },
  mounted() {
    if (online)
      this.io = socketIO();
  },
  methods: {
    done(cities){
      // console.log(cities)
      store.set('cities',cities);
      this.ok = true
    },
  }
}
</script>
