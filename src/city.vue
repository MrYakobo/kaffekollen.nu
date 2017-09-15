<template>
<div class="tag is-light" style="font-size:1em;margin:3px" :key="city.id">
  {{city.name}}&nbsp;<i :class="icon(city.place)"></i>
  <div v-if="!readonly" class="delete is-small" @click="deleteCity()"></div>
</div>
</template>
<script>
export default {
  props: ['i', 'city', 'readonly'],
  name: 'city',
  methods: {
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
    deleteCity() {
      this.$emit('deleteCity', this.i)
    }
  }
}
</script>
