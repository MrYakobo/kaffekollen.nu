<template>
<div>
  <div class="columns has-text-centered box">
    <div class="column is-6">
      <!-- <div class="columns is-multiline"> -->
      <div class="">
        <!-- <h3 class="title is-3">Resultat</h3> -->
        <div class="columns">
          <div class="column">
            <button class="button is-white is-disabled ">Sök efter platser:</button>
          </div>
          <div class="column">
            <input type="text" class="input " v-model="search" placeholder="">
          </div>
          <!-- <div class="column is-2"> -->
          <!-- <button v-show="enableButton" class="button is-primary" @click="addToChosen(city)">Välj stad</button> -->
          <!-- </div> -->
        </div>
        <div style="height:200px; overflow:hidden">
          <div v-if="showAutocomplete" v-for="result in results">
            <span class="button is-light" @click="addToChosen(result.item)" style="width:100%">
            <span v-html="boldify(result.item.name, result.matches[0].indices[0])"></span>&nbsp;<i :class="icon(result.item.place)"></i></span>
          </div>
        </div>
      </div>
    </div>
    <div class="column is-6">
      <h3 class="title is-5">Valda ställen:</h3>
      <template v-for="(city,i) in chosenCities">
        <city :city="city" :i="i" :key="city.id" @deleteCity="deleteCity"></city>
    </template>
    </div>
  </div>
  <!-- <span>{{chosenCities.length > 0 ? 'Nice! Nu kan du':'Om du inte orkar välja, så kan du:'}}</span>&nbsp; -->
  <button @click="done" :class="['button', chosenCities.length>0? 'is-success':'is-dark']">{{ chosenCities.length>0 ? 'Gå vidare':'Skippa' }}&nbsp;<i class="fa fa-arrow-right"></i></button>
</div>
</template>
<script>
import _ from 'lodash'
import socketIO from 'socket.io-client'
import togglebtn from './togglebtn.vue'
import cityModule from './city.vue'

import Fuse from 'fuse.js'
import cache from './cache.js'
import online from './isOnline.js'

if (online) {
  var fuse = new Fuse(cache, {
    shouldSort: true,
    includeMatches: true,
    threshold: 0.3,
    location: 0,
    distance: 10,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ["name"],
    sortFn: (a, b) => {
      // console.log(a.item.population)
      // console.log(b.item.population)
      return (a.score - a.item.population) - (b.score - b.item.population)
      // (a.score-a.population) - (b.score-b.population)
    }
  })
}

import store from 'store'

export default {
  name: 'mapsquery',
  components: {
    togglebtn: togglebtn,
    city: cityModule
  },
  data() {
    return {
      showAutocomplete: false,
      enableButton: false,
      search: '',
      isSearching: false,
      io: {},
      results: [],
      chosenCities: store.get('cities') || [],
      city: {},
      enableWatcher: true,
    }
  },
  mounted() {
    if (online) {
      this.io = socketIO();
      this.io.emit('cities', this.chosenCities)
      this.io.on('swedenquery', (data) => {
          this.results = data
      })
    }
  },
  methods: {
    done() {
      this.$emit('done', this.chosenCities)
    },
    icon(str) {
      switch (str) {
        case 'town':
          return 'fa fa-home'
        case 'village':
          return 'fa fa-users'
        case 'hamlet':
          return 'fa fa-road'
        case 'city':
          return 'fa fa-building'
        default:
          return 'fa fa-warning'
      }
    },
    isActive(result) {
      return this.chosenCities.indexOf(result) > -1
    },
    addToChosen(city) {
      this.showAutocomplete = false;
      this.chosenCities.push(city)
      this.enableButton = false;
      this.search = '';
      this.enableWatcher = false;
      this.$nextTick(function() {
        this.enableWatcher = true
      })
      this.io.emit('cities', this.chosenCities)
      this.$emit('city', this.chosenCities)
    },
    deleteCity(i) {
      this.chosenCities.splice(i, 1);
      this.io.emit('cities', this.chosenCities)
      this.$emit('city', this.chosenCities)
    },
    boldify(name, indexes) {
      let before = name.substring(0, indexes[0])
      let bold = name.substring(indexes[0], indexes[1] + 1)
      let after = name.substring(indexes[1] + 1)

      let ret = `<span>${before}</span><b>${bold}</b><span>${after}</span>`
      return ret
    }
  },
  watch: {
    search: _.debounce(function() {
      if (this.enableWatcher) {
        this.showAutocomplete = true;
        if (online)
          this.io.emit('swedenquery', this.search);
        else {
          var that = this
          //filterFunc makes sure duplicates don't occur
          function filterFunc(a) {
            return that.chosenCities.indexOf(a.item) === -1
          }
          this.results = _.filter(fuse.search(this.search), filterFunc).slice(0, 5)
        }
      }
    }, 150, {
      leading: true,
      trailing: true
    })
  }
}
</script>
