var request = require('request')
var fs = require('fs')

function getCities() {
  return new Promise((resolve, rej) => { request('https://prod.handla.ica.se/api/store/v1?groupby=citygroup&customertype=B2C', (err, res, body) => {
      if(err) rej(err)
      // fs.writeFile('ica-butiker.json', body);
      resolve(body)
    })
  })
}

getCities()

function search(search) {
  request({
      url: `https://www.ica.se/Templates/GlobalSearch/Handlers/GlobalSearchHandler.ashx?CommandName=GetAllStores&Search=${search}`,
      headers: {
        accept: '*/*'
      }
    },
    (err, res, body) => {
      // fs.writeFileSync('ica.json', body)
      return body;
    })
}

// search('Kungsbacka')

function getStorePrices(offerLink) {
  //lite jobbigt. Ica lägger inte alla sina (lokala) erbjudanden under samma sida.
}

module.exports.search = search
module.exports.getStorePrices = getStorePrices
