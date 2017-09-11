//sends requests to coop's own DB! No scraping required!
var fs = require('fs')
var cap = require('capitalize').words
var standardize = require('./standardize')

function capitalize(str){
    return cap(str.toLowerCase())
}

function get() {
    var request = require('request')

    request({
        method: 'POST',
        url: 'https://coop-dev6.54proxy.se/',
        body: {
            "ProductsInCategory": {
                "RequestEntity": {
                    "EntityType": "Section2",
                    "ExternalId": "32644"
                },
                "IP": "194.236.7.31",
                "StoreId": "016001",
                "CustomerGroups": "CUSTOMER_NOT_LOGGED_IN,CUSTOMER_PRIVATE,DEFAULT,STORE_016001,STORE_NOT_MEDMERA",
                "UserId": "xzqgrrurraxhjjpy2vhmxzy3",
                "ProductsInCategory_FromIndex": 0,
                "ProductsInCategory_ToIndex": 300
            }
        },
        json: true,
    }, (err, res, body) => {
        if (err) throw err;

        // body.DirectResults
        fs.writeFileSync('coop.json', JSON.stringify(body))
    })
}

// get()
logic()

function logic() {
    var db = JSON.parse(fs.readFileSync('coop.json', 'utf8'))
    var res = db.Data.ProductsInCategory.ProductsInCategory

    var newdb = []

    res.forEach((o) => {
        var data = o.Entity.Attributes
        if (!/.*filter.*/ig.test(data.Name[0])) {

            var obj = {
                name: capitalize(data.Name[0]),
                weight: data.Size[0],
                price: data.SortPrice[0],
                img: {
                    get full(){
                        if(data.ImageUrl[0].charAt(0)==='/')
                            return data.ImageUrl[0]
                    },
                    get preview(){
                        return data.ImageUrl[0].replace(/upload\//gi,'upload/b_white,fl_progressive,q_90,c_lpad,g_center,h_200,w_200/').replace(/tiff/gi, 'jpg')
                        //http://res.cloudinary.com/coopsverige/image/upload/v1485655321/185397.tiff
                        // =>
                        //https://res.cloudinary.com/coopsverige/image/upload/b_white,fl_progressive,q_90,c_lpad,g_center,h_222,w_222/v1485655321/185397.jpg
                    }
                },
                brand: capitalize(standardize.brand(data.Manufacturer[0])),
                get eco() {
                    if (data.Attributes.length == 0)
                        return false

                    return data.Attributes[0].IsEKO[0]
                },
                get compareprice() {
                    if (typeof (data.SortComparativePrice) === 'undefined') {
                        return Math.round(this.price / this.weight * 1000)
                    }
                    return comprice(data.SortComparativePrice[0])
                },
                type: parseType(data),
                coffeinfree: /.*koffeinfri.*/gi.test(data.Name[0]),
                promo: null
            }

            if (typeof (data.HasPromos) !== 'undefined' && data.HasPromos[0]) {
                //coop ger inte ut numerisk information om erbjudandet...regex!
                //deras textsträng är: "Köp 2 st för 69.90 kr"

                var reg = /(\d) ?(?=st)?.*?(\d+\.?\d{0,2}) ?kr/gi
                var match = reg.exec(data.promoTexts[0])

                obj.promo = {
                    amount: match[1],
                    weight: parseInt(match[1]) * obj.weight,
                    price: parseFloat(match[2]),
                    get compareprice() {
                        return Math.round(this.price / this.weight * 1000)
                    },
                    get savings() {
                        return Math.round(obj.compareprice - this.compareprice)
                    },
                    label: data.promoTexts[0]
                }
            }

            newdb.push(obj)
        }
    })

    fs.writeFileSync('coop_db.json', JSON.stringify(newdb))
}

function comprice(comparePrice) {
    return parseFloat(comparePrice.toString().replace(/,/g, '.'))
}

function parseType(data) {
    var regtest = require('./regtest');
    if (/.*kapsl.*/gi.test(data.Name[0])) {
        return 'kapsel'
    }
    return regtest.coffeetest(data.Name[0])
}