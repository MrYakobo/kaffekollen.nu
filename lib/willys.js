var fs = require('fs')
var cap = require('capitalize').words
function capitalize(str){
    return cap(str.toLowerCase())
}
var standardize = require('./standardize')

//fetchar alla items i "Kaffe"
function get(callback) {
    var request = require('request')
    var totalbody = [];

    function cb(i) {
        var param = i == 0 ? '' : `&page=${i}`

        request({
            method: 'GET',
            url: `https://www.willys.se/c/Dryck/Kaffe?avoidCache=1504186532810&categoryPath=Dryck%2FKaffe${param}&size=15`
        }, (err, res, body) => {
            if (err) throw err;
            // console.log(JSON.parse(body).results)
            //console.log(JSON.parse(body.results))
            var j = JSON.parse(body).results
            if (j != null) {
                totalbody.push(...j)
                cb(i + 1)
            } else {
                fs.writeFileSync('willys.json', JSON.stringify({ results: totalbody }));
                callback()
            }
        })
    }
    cb(0)
}

if (process.argv[2] === '--download')
    get(logic);
else
    logic();

function logic() {
    var db = JSON.parse(fs.readFileSync('willys.json', 'utf8'))
    var newdb = [];

    db.results.forEach((o) => {
        if (!o.outOfStock && !/.*filter.*/ig.test(o.name)) {
            //grundobjekt. Om inga promos "extrapris" finns, så visas detta.
            var obj = {
                name: capitalize(o.name),
                get weight() {
                    var t = o.displayVolume
                    if (t.indexOf('kg') > -1) {
                        return parseInt(t) * 1000
                    }
                    return parseInt(t)
                },
                price: o.priceValue,
                img: {
                    full: o.image.url,
                    preview: o.thumbnail.url
                },
                brand: capitalize(standardize.brand(o.manufacturer)),
                compareprice: comprice(o.comparePrice),
                eco: o.labels.indexOf('ecological') > -1,
                type: parseType(o),
                coffeinfree: /.*koffeinfri.*/i.test(o.name),
                promo: null
            }

            var promotion = o.potentialPromotions[0];

            if (typeof (promotion) == 'object') {
                obj.promo = {
                    amount: promotion.qualifyingCount,
                    weight: obj.weight * promotion.qualifyingCount,
                    compareprice: comprice(promotion.comparePrice),
                    price: promotion.price.value,
                    savings: o.savingsAmount,
                    label: promotion.conditionLabel
                }
            }

            newdb.push(obj)
        }
    });

    fs.writeFileSync('willys_db.json', JSON.stringify(newdb))

    function comprice(comparePrice){
       return parseFloat(comparePrice.toString().replace(/,/g,'.'))
    }

    function parseType(o) {
        //willy's ger ingen bra information på vad som är brygg/press/kapsel/espresso-kaffe... så det får bli regexbaserad lösning!
        /*
        Möjliga sorter är:
        Kapsel
        Bönor
        Kok 
        Snabb
        Press
        Brygg
        */
        if (o.comparePriceUnit === 'st') {
            return 'kapsel'
        }
        //använder regtest, en modul som ger effektivare regexmatchning.
        var regtest = require('./regtest')
        return regtest.coffeetest(o.name)
    }
}