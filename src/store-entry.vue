<template>
    <div :class="['notification', active ? 'is-success':'is-light']">
        <p>{{store.name}}</p>
        <img :src="store.logo">
        <button @click="active=!active" :class="['button is-inverted', !active ? 'is-success' : 'is-danger' ]"><i :class="['fa', !active ? 'fa-check' : 'fa-remove']"></i></button>
    </div>
</template>

<script>
    import togglebtn from './togglebtn.vue'

    export default {
        name: 'store-entry',
        props: ['store'],
        components: {
            togglebtn: togglebtn
        },
        data() {
            return {
                active: false
            }
        }
    }
</script>