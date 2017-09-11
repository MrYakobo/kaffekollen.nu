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
    input{
        grid-area: input
    }
    button{
        grid-area: button
    }
    p{
        grid-area: label
    }
</style>
<template>
    <div class="">
        <div v-if="!ok">
            <div class="box grid-index">
                <h1 class="title is-1">Kaffekollen.nu</h1>
                <p>Välkommen! Skriv in ditt postnummer här för att kunna söka på lokala kaffeerbjudanden.</p>
                <input type="text" class="input" v-model="city">
                <button class="button is-success" @click="ok=true">Ok</button>
            </div>
        </div>
    <app v-else></app>
    </div>
</template>
<script>
    import store from 'store'

    export default {
        name: 'index',
        data() {
            return {
                ok: typeof (store.get('city')) !== 'undefined',
                city: store.get('city')
            }
        },
        watch: {
            city(newval) {
                store.set('city', [newval])
            }
        }
    }
</script>