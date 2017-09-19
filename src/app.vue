<style>
    html,
    body {
        width: 100vw;
        min-height: 100vh;
        margin: 0;
        padding: 0;
        font-family: 'Lato', serif
    }

    .grid {
        display: grid;
        grid-template-rows: 130px [header] auto 80px [footer];
        /* grid-template-rows: 1fr [header] 8fr 1fr [footer]; */
        grid-template-columns: 2fr [aside] 5fr [main];
        grid-template-areas: "header header" "aside main" "footer footer";
        grid-row-gap: 0px;
        grid-column-gap: 10px
    }

    .bg-primary {
        background-color: #eee !important;
    }

    header {
        grid-area: header;
    }

    aside {
        grid-area: aside;
    }

    main {
        grid-area: main;
    }

    footer {
        grid-area: footer;
    }
</style>
<template>
    <div class="grid bg-primary">
        <header class="columns box">
            <div class="column is-one-third">
                <h1 class="title is-1">Kaffekollen.nu</h1>
                <h1 class="subtitle is-5">Din källa för billigt kvalitetskaffe</h1>
            </div>
            <div class="column box">
                <h3 class="subtitle is-3 is-inline">Mina platser: </h3>
                <template v-if="query.cities.length>0">
                    <city v-for="(city, i) in query.cities" :readonly="true" :city="city" :i="i" :key="city.id" @deleteCity="deleteCity"></city>
                    <a href="#" @click="choose">Välj platser</a>
                </template>
                <template v-else>
                    <br>
                    <span>Här var det tomt. Om du vill, så kan du <a href="#" @click="choose">välja plats</a> igen.</span>
                    <!-- <button class="button is-dark" @click="this.emit('choose')">Välj plats</button> -->
                </template>
            </div>
        </header>

        <aside class="box">
            <h3 class="subtitle is-4">Filtrera resultat</h3>
            <div class="tabs is-boxed">
                <ul>
                    <li :class="tabclass('brands')">
                        <a @click="currentTab = 'brands'">Märken &nbsp;<span v-show="query.brands.length>0" class="tag is-rounded is-success">{{query.brands.length}}</span></a>
                    </li>
                    <li :class="tabclass('types')">
                        <a @click="currentTab = 'types'">Kaffetyp &nbsp;<span v-show="query.types.length>0" class="tag is-rounded is-success">{{query.types.length}}</span></a>
                    </li>
                    <li :class="tabclass('other')"><a @click="currentTab = 'other'">Övrigt  &nbsp;<span v-show="query.eco || query.coffeinfree" class="tag is-rounded is-success">{{query.eco + query.coffeinfree}}</span></a></li>
                </ul>
            </div>
            <div style="overflow-y:auto;max-height:80vh;padding-right:10px">
                <div class="columns is-mobile is-multiline is-gapless" v-show="currentTab === 'brands'">
                    <div class="column card" v-for="(brand, i) in staticData.brands">
                        <togglebtn style="width:100%" :active="query.brands.indexOf(brand) > -1" @toggle="toggle('brands',brand)">{{brand}}</togglebtn>
                    </div>
                </div>
                <div class="columns is-mobile is-multiline is-gapless" v-show="currentTab === 'types'">
                    <div class="column card" v-for="(type, i) in staticData.types">
                        <togglebtn style="width:100%" @toggle="toggle('types',type)" :active="query.types.indexOf(type) > -1">{{type}}</togglebtn>
                    </div>
                </div>
                <div class="columns is-mobile is-multiline is-gapless" v-show="currentTab === 'other'">
                    <div class="column card is-half">
                        <togglebtn :active="query.eco" style="width:100%" @toggle="query.eco = !query.eco">Ekologiskt</togglebtn>
                    </div>
                    <div class="column card is-half">
                        <togglebtn :active="query.coffeinfree" style="width:100%" @toggle="query.coffeinfree = !query.coffeinfree">Koffeinfritt </togglebtn>
                    </div>
                </div>
            </div>
        </aside>
        <main class="box">
            <!-- Decides between showing the frontpage and search results as default -->
            <div v-show="viewFrontpage" class="columns is-multiline">
                <h1 class="title is-1 column is-12 has-text-success">Aktuella erbjudanden:</h1>
                <result v-for="(result, i) in frontpage" class="column is-3" :key="i" :res="result"></result>
            </div>
            <div v-show="!viewFrontpage" class="columns is-multiline">
                <h1 class="title is-1 column is-12 has-text-success">Sökresultat:</h1>
                <template v-show="results.length>0">
                    <result v-for="(result, i) in results" class="column is-3" :key="i" :res="result"></result>
                </template>
                <div class="column is-12" v-show="results.length===0">
                    <button v-show="isLoading" class="button is-white is-loading is-unselectable">Laddar...</button>
                    <h2 v-show="!isLoading" class="subtitle is-4">Din sökning gav inga resultat.</h2>
                </div>
            </div>
        </main>
        <footer class="box columns">
            <h5 class="column subtitle is-5">Jakob Lindskog, {{year}}</h5>
            <p class="column subtitle is-5 ">Senast uppdaterad för {{date}} sen.</p>
        </footer>
    </div>
</template>
<script>
    import _ from 'lodash'

    import socketIO from 'socket.io-client'

    import togglebtn from './togglebtn.vue'
    import store from 'store'

    import city from './city.vue'
    import result from './result.vue'

    var app = {
        name: 'app',
        components: {
            togglebtn: togglebtn,
            result: result,
            city: city
        },
        data() {
            return {
                io: {},
                date: '',
                currentTab: 'brands',
                frontpage: [],
                results: [],
                year: new Date().getFullYear(),
                store: store,
                query: {
                    cities: [],
                    brands: [],
                    types: [],
                    eco: false,
                    coffeinfree: false
                },
                emptyQuery: {
                    brands: [],
                    types: [],
                    eco: false,
                    coffeinfree: false
                },
                staticData: {
                    brands: [],
                    types: []
                },
                connected: false,
                isLoading: false
            }
        },
        mounted() {
            this.io = socketIO()
            this.initSocket();

            //load from storage, if available
            var s = store.get('query')
            if (typeof (s) !== 'undefined') {
                this.query = s;
            }
            // console.log(store.get('cities'))
            this.query.cities = store.get('cities') || []
        },
        computed: {
            viewFrontpage() {
                //if user has specified search filters, show the front page
                if (_.isEqual(_.omit(this.query, 'cities'), this.emptyQuery))
                    return true
                //else, show the results page
                return false
            }
        },
        methods: {
            choose() {
                this.$emit('choose')
            },
            deleteCity(i) {
                this.query.cities.splice(i, 1);
                if (this.query.cities.length === 0)
                    store.remove('cities')
            },
            tabclass(str) {
                if (this.currentTab === str)
                    return 'is-active'
                return ''
            },
            prefs(setting, value) {
                return store.get(setting).indexOf(value) > -1
            },
            initSocket() {
                this.io.on('connect', () => {
                    this.connected = true
                })
                this.io.on('data', dat => {
                    this.staticData = dat
                })
                this.io.on('result', data => {
                    this.results = data
                    this.isLoading = false
                })
                this.io.on('frontpage', data => {
                    this.frontpage = data
                })
                this.io.on('date', date => {
                    this.date = date
                })
            },
            toggle(setting, value) {
                var ind = this.query[setting].indexOf(value)
                if (ind > -1) {
                    this.query[setting].splice(ind, 1)
                } else {
                    this.query[setting].push(value)
                }
            }
        },
        watch: {
            query: {
                handler() {
                    // console.log('change in query object')
                    this.io.emit('query', this.query)
                    this.isLoading = true
                    store.set('query', this.query)
                },
                deep: true
            }
        }
    }

    export default app
</script>