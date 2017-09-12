<style scoped>
    .grid-index {
        display: grid;
        grid-template-rows: 1fr [title] auto;
        grid-template-columns: 1fr [label] 150px [input] 80px [button];
        grid-template-areas: "title title title" "label input button";
        grid-row-gap: 0px;
        grid-column-gap: 10px
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
    <div class="">
        <div class="container" v-if="true">
            <div class="box grid-index">
                <h1 class="title is-1">Kaffekollen.nu</h1>
                <p>Välkommen! Skriv in en postnummer/adress här för att kunna söka på lokala kaffeerbjudanden.</p>
                <input type="text" class="input" v-model="query">
                <!-- <dropdown></dropdown> -->
                <button :class="['button is-success is-outlined', loading ? 'is-loading' : '']" @click="search">Sök</button>
            </div>
            <div class="modal">
                <!-- search and list the closest cities -->
            </div>
        </div>
        <app v-else></app>
    </div>
</template>
<script>
    const online = location.href.indexOf('5000')>-1

    import store from 'store'
    import socketIO from 'socket.io-client'

    import dropdown from './dropdown.vue'

    export default {
        name: 'index',
        components:{
            dropdown: dropdown
        },
        data() {
            return {
                chooseCity: true,
                io: {},
                loading: false,
                ok: typeof (store.get('city')) !== 'undefined',
                city: store.get('city')
            }
        },
        mounted() {
            if(online)
                this.io = socketIO();
        },
        methods: {
            search() {
                this.loading = true;
                // this.io.emit('papi', JSON.stringify(this.query))
            }
        },
        watch: {
            city(newval) {
                store.set('city', [newval])
            },
            query(newquery){
                this.io.emit('autocomplete', JSON.stringify(newquery))
            }
        }
    }
</script>