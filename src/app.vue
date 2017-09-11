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
                <h3 class="subtitle is-3">Mina städer:</h3>
                <city v-for="(city,i) in query.cities" :i="i" @remove="removeCity(i)" :key="i">{{city}}</city>
            </div>
        </header>

        <aside class="box">
            <h3 class="subtitle is-4">Filtrera resultat</h3>
            <div class="tabs">
                <ul>
                    <li :class="tabclass('brands')"><a @click="currentTab = 'brands'">Märken</a></li>
                    <li :class="tabclass('types')"><a @click="currentTab = 'types'">Kaffetyp</a></li>
                    <li :class="tabclass('other')"><a @click="currentTab = 'other'">Övrigt</a></li>
                </ul>
            </div>
            <div style="overflow-y:auto;max-height:60vh;padding-right:10px">
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
                <h1 class="title is-1 column is-12">Aktuella erbjudanden</h1>
                <result v-for="(result, i) in frontpage" class="column is-3" :key="i" :res="result"></result>
            </div>
            <div v-show="!viewFrontpage" class="columns is-multiline">
                <h1 class="title is-1 column is-12">Sökresultat</h1>
                <result v-for="(result, i) in results" class="column is-3" :key="i" :res="result"></result>
            </div>
        </main>
        <footer class="box">
            <h5 class="subtitle is-5">&copy; Jakob Lindskog {{year}}</h5>
        </footer>
    </div>
</template>
<script>
    const online = location.href.indexOf('5000')>-1

    const emptyQuery = {
        cities: [],
        brands: [],
        types: [],
        eco: false,
        coffeinfree: false
    }

    import _ from 'lodash'

    // if (online)
    import socketIO from 'socket.io-client'

    import togglebtn from './togglebtn.vue'
    import store from 'store'

    var app = {
        name: 'app',
        components: {
            togglebtn: togglebtn
        },
        data() {
            return {
                io: {},
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
                staticData: {
                    brands: [],
                    types: []
                },
                connected: false
            }
        },
        mounted() {
            if (online)
                this.io = socketIO()

            this.initSocket();

            //load from storage, if available
            var s = store.get('query')
            if (typeof (s) !== 'undefined') {
                this.query = s
            }
        },
        computed: {
            viewFrontpage() {
                // if (online) return true
                //if user has specified search filters, show the front page
                if (_.isEqual(this.query, emptyQuery))
                    return true
                //else, show the results page
                return false
            }
        },
        methods: {
            removeCity(i) {
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
                if (online) {
                    this.io.on('connect', () => {
                        this.connected = true
                    })

                    this.io.on('data', dat => {
                        this.staticData = JSON.parse(dat)
                    })
                    this.io.on('result', data => {
                        this.results = JSON.parse(data)
                    })
                    this.io.on('frontpage', data => {
                        this.frontpage = JSON.parse(data)
                    })
                } else {
                    this.staticData = JSON.parse(
                        '{"types":["bönor","brygg","kapsel","kok","press","snabb"],"brands":["Änglamark","Arvid Nordquist","Bontas","Cafego","Cafe Organico","Caffe Molinari","Caffe Musetti","Coop","Dolce Gusto","Eldorado","Equale","Garant","Gevalia","Grand Cru","Idee Kaffe","Lavazza","Lindvalls","Löfbergs","Melitta","Molinari","Musetti","Najjar","Nescafe","Nestle","Plivit Trade","Rostmästarens","Tassimo","Vispak","X-Tra","Zoegas"]}'
                    )
                    this.results = JSON.parse('[{"tablename":"coop","id":10,"name":"Kaffe Mezzo","weight":450,"price":"38.95","img_full":null,"img_preview":"http://res.cloudinary.com/coopsverige/image/upload/b_white,fl_progressive,q_90,c_lpad,g_center,h_200,w_200/v1491780705/196359.jpg","brand":"Zoegas","eco":false,"compareprice":"86.56","type":"brygg","coffeinfree":false,"promo":true,"promo_amount":2,"promo_weight":900,"promo_price":"69.9","promo_compareprice":78,"promo_savings":9,"promo_label":"Köp 2 st för 69.90 kr"},{"tablename":"coop","id":11,"name":"Kaffe Intenzo","weight":450,"price":"38.95","img_full":null,"img_preview":"http://res.cloudinary.com/coopsverige/image/upload/b_white,fl_progressive,q_90,c_lpad,g_center,h_200,w_200/v1491780671/196351.jpg","brand":"Zoegas","eco":false,"compareprice":"86.56","type":"brygg","coffeinfree":false,"promo":true,"promo_amount":2,"promo_weight":900,"promo_price":"69.9","promo_compareprice":78,"promo_savings":9,"promo_label":"Köp 2 st för 69.90 kr"},{"tablename":"coop","id":2,"name":"Kaffe Skånerost","weight":450,"price":"38.95","img_full":null,"img_preview":"http://res.cloudinary.com/coopsverige/image/upload/b_white,fl_progressive,q_90,c_lpad,g_center,h_200,w_200/v1497847840/230905.jpg","brand":"Zoegas","eco":false,"compareprice":"86.56","type":"brygg","coffeinfree":false,"promo":true,"promo_amount":2,"promo_weight":900,"promo_price":"69.9","promo_compareprice":78,"promo_savings":9,"promo_label":"Köp 2 st för 69.90 kr"},{"tablename":"coop","id":12,"name":"Kaffe Blue Java","weight":450,"price":"38.95","img_full":null,"img_preview":"http://res.cloudinary.com/coopsverige/image/upload/b_white,fl_progressive,q_90,c_lpad,g_center,h_200,w_200/v1491780689/196355.jpg","brand":"Zoegas","eco":false,"compareprice":"86.56","type":"brygg","coffeinfree":false,"promo":true,"promo_amount":2,"promo_weight":900,"promo_price":"69.9","promo_compareprice":78,"promo_savings":9,"promo_label":"Köp 2 st för 69.90 kr"},{"tablename":"coop","id":32,"name":"Instant Coffee Medium","weight":200,"price":"41.50","img_full":null,"img_preview":"http://res.cloudinary.com/coopsverige/image/upload/b_white,fl_progressive,q_90,c_lpad,g_center,h_200,w_200/v1444081333/53775.jpg","brand":"Coop","eco":false,"compareprice":"207.50","type":"brygg","coffeinfree":false,"promo":true,"promo_amount":2,"promo_weight":400,"promo_price":"69.0","promo_compareprice":173,"promo_savings":35,"promo_label":"Köp 2 st för 69.00 kr"},{"tablename":"coop","id":58,"name":"Instant Coffee Dark","weight":200,"price":"41.50","img_full":null,"img_preview":"http://res.cloudinary.com/coopsverige/image/upload/b_white,fl_progressive,q_90,c_lpad,g_center,h_200,w_200/v1444080545/53676.jpg","brand":"Coop","eco":false,"compareprice":"207.50","type":"brygg","coffeinfree":false,"promo":true,"promo_amount":2,"promo_weight":400,"promo_price":"69.0","promo_compareprice":173,"promo_savings":35,"promo_label":"Köp 2 st för 69.00 kr"},{"tablename":"coop","id":29,"name":"Snabbkaffe Glasburk","weight":200,"price":"47.50","img_full":null,"img_preview":"http://res.cloudinary.com/coopsverige/image/upload/b_white,fl_progressive,q_90,c_lpad,g_center,h_200,w_200/v1495604301/205250.jpg","brand":"Coop","eco":false,"compareprice":"237.50","type":"snabb","coffeinfree":false,"promo":true,"promo_amount":2,"promo_weight":400,"promo_price":"69.0","promo_compareprice":173,"promo_savings":65,"promo_label":"Köp 2 st för 69.00 kr"},{"tablename":"willys","id":11,"name":"Nescafé Gold","weight":150,"price":"44.90","img_full":"https://d2rfo6yapuixuu.cloudfront.net/hee/h9d/8856746590238/07613032546571.jpg_master_axfood_300","img_preview":"https://d2rfo6yapuixuu.cloudfront.net/hf1/h9a/8856746655774/07613032546571.jpg_master_axfood_100","brand":"Nescafe","eco":false,"compareprice":"299.35","type":"snabb","coffeinfree":false,"promo":true,"promo_amount":1,"promo_weight":150,"promo_price":"39.9","promo_compareprice":266,"promo_savings":5,"promo_label":"Spara 5,00 kr/st"},{"tablename":"willys","id":106,"name":"Cappuccino Original","weight":10,"price":"18.95","img_full":"https://d2rfo6yapuixuu.cloudfront.net/h28/h40/8862471127070/08711000510940.jpg_master_axfood_300","img_preview":"https://d2rfo6yapuixuu.cloudfront.net/h67/h3f/8862471192606/08711000510940.jpg_master_axfood_100","brand":"Gevalia","eco":false,"compareprice":"1.90","type":"kapsel","coffeinfree":false,"promo":false,"promo_amount":null,"promo_weight":null,"promo_price":null,"promo_compareprice":null,"promo_savings":null,"promo_label":null},{"tablename":"coop","id":54,"name":"Cappuccino Original","weight":144,"price":"19.95","img_full":null,"img_preview":"http://res.cloudinary.com/coopsverige/image/upload/b_white,fl_progressive,q_90,c_lpad,g_center,h_200,w_200/v1498134393/247777.jpg","brand":"Gevalia","eco":false,"compareprice":"2.00","type":"brygg","coffeinfree":false,"promo":false,"promo_amount":null,"promo_weight":null,"promo_price":null,"promo_compareprice":null,"promo_savings":null,"promo_label":null}]')
                }
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
                    console.log('change in query object')
                    if(online)
                        this.io.emit('query', JSON.stringify(this.query))
                    store.set('query', this.query)
                },
                deep: true
            }
        }
    }

    export default app
</script>