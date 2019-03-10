// getStores(city): return all stores of different brands
// getCoffee(store): return all coffeeprices for a store

var request = require('request')
var fs = require('fs')

var regtest = require('./regtest')

var Xray = require('x-ray');
var x = Xray({
  filters: {
    trim(val) {
      return val.trim().replace(/\n|\r/g, '')
    }
  }
})

function fetchStores() {
  // const url = 'https://www.ica.se/butiker/'
  const url = fs.readFileSync('icabutiker.html', 'utf8')

  function prefix(link) {
    if (link.indexOf('https://www.ica.se/butiker/') === 0) return link
    return 'https://www.ica.se' + link
  }

  //scrape all links from the page, scrape those as well on links to their stores and promos
  x(url, '.store-list-entry.sprite1-p', [{
      linkToStore: 'a@href',
      city: 'a@text',
    }])
    ((e1, data) => {
      // console.log(data)

      function cb1(i) {
        if (i < data.length) {
          let dat = data[i]
          let link = prefix(dat.linkToStore)

          console.log(link)

          x(link, '.store-card-main-content', [{
            name: 'header>div.card-heading.column.size20of20.md_size2of3@text',
            link: 'a.store-card-store-link@href'
          }])((e2, storeData) => {
            var promos = [];

            function cb2(j) {
              if (storeData == null) return

              if (j < storeData.length) {
                // console.log(j)

                let store = storeData[j];
                var link2 = prefix(store.link.replace(/\/start\/$/, '/erbjudanden'))
                console.log(link2)

                function moreinfo() {
                  x(link2, '.product-info-wrapper > .product-info-wrapper__body > div.row', [{
                    header: ['h4 | trim'],
                    info: ['p | trim'],
                    krav: '.col-12.label-items > svg@html'
                  }])((e3, itemData) => {
                    if (itemData != null) {
                      for (let k = 0; k < promos.length; k++) {
                        if (typeof (promos[k]) !== 'undefined') {
                          console.log(promos[k])

                          //original index that this promo was extracted from
                          let ind = promos[k].ind
                          //item is "moreinfo" for a promo (coffee 100%)
                          let item = itemData[ind]

                          console.log(item.header)
                          function val(str){
                            return item.info[item.header.indexOf(str)]
                          }
                          let props = {
                            weight: val('Vikt/Volym:'),
                            brand: val('Leverantör/Land:'),
                            compareprice: val('Jfr pris:'),
                            get eco(){
                              return val('Leverantör/Land:').test(/eco/g) || typeof(krav) != null
                            },
                            get type(){
                              let v = val('Mer info:')
                              if(v.test(/Gäller ej/gi)){
                                return 'brygg'
                              }
                              return regtest.coffeetest(v)
                            }
                          }
                          
                          // let indTest = item.header.indexOf("Giltighetstid:")
                          // if (indTest > -1) {
                          //"Giltigt 2017-09-18 till 2017-09-24."
                          let reg = /^\D+ (.*?) till (.*?)\.$/g
                          let res = reg.exec(item.info[indTest])

                          let o = {};

                          o.begin = res[1]
                          o.expire = res[2]

                          // o[item.header[indTest]] = item.info

                          //remove ind as it's not needed anymore
                          delete promos[k].ind
                          promos[k].promo = o
                        }
                      }
                    }

                    fs.writeFile(`icadata/${storeData[j].name}.json`, JSON.stringify(promos), () => {
                      console.log(storeData[j].name + ' done.')
                      cb2(j + 1)
                    })
                  })
                }

                x(link2, '.offer-category__item', [{
                  title: 'h2.offer-type__product-name.splash-bg.icon-store-pseudo@text | trim',
                  text: '.offer-type__product-info@text',
                  price: '.product-price__price-value@text',
                  promo_amount: '.product-price__amount@text',
                  img_full: 'img.lazy@data-original',
                  cardprice: '.offer-type__price@text'
                }])((e3, itemData) => {
                  //expirity is stored in a seperate div, sibling to the one we just saw
                  if (itemData != null) {
                    // console.log(itemData)
                    // promos.length = itemData.length
                    for (let k = 0; k < itemData.length; k++) {
                      let str = itemData[k].title.toLowerCase()
                      if (str.indexOf('kaffe') > -1 && str.indexOf('bryggare') === -1) {

                        //text: Lavazza. 1000 g. Hel bönor
                        //text: ICA. 500 g. Gäller ej I love eco och Hela bönor. Max 2 köp/hushåll
                        // let reg = /(\w+)\. (\d+) k?g\./
                        let o = itemData[k];
                        promos.push({
                          info: o,
                          ind: k
                        })
                      }
                    }
                    // promos.push(promos, itemData.filter(x => x.name.toLowerCase() == 'kaffe'));

                    console.log('info (kaffe) pushed to promos: ' + promos.length + ' items')

                    moreinfo()
                  }
                });

              } else {
                // console.log(`j = ${j}, done. i = ${i}`)
                cb1(i + 1)
              }
            }
            cb2(0)
          })
          // throw ''
          // console.log(i)
        } else {

        }
      }
      cb1(0)
    })
}
/*
stores: x('a@href', ['.store-card-main-content'], [{
    all: '',
    name: 'header>div.card-heading.column.size20of20.md_size2of3@text',
    link: 'a.store-card-store-link@href'
}])
*/
fetchStores()
// x("https://www.ica.se/butiker/ale/", '.store-card-main-content', [{
//   all: ''
// }])((err, data)=>{
//     console.log(data)
// })

function localStores(city) {
  fs.readFile('ica-butiker.json', (err, file) => {
    if (err) throw err;
    let db = JSON.parse(file)
    return db[city[0]][city][city]
  })
}

function getStorePrices(offerLink) {
  //lite jobbigt. Ica lägger inte alla sina (lokala) erbjudanden under samma sida.
}

module.exports.localStores = localStores
module.exports.getCoffee