//sends requests to coop's own DB! No scraping required!
var fs = require('fs')

function doRequest() {
    var request = require('request')

    request({
        method: 'POST',
        url: 'https://coop-dev6.54proxy.se/',
        body: {
            "Search": {
                "DirectResults_FromIndex": 0,
                "DirectResults_ToIndex": 100,
                "RecommendedResults_FromIndex": 0,
                "RecommendedResults_ToIndex": 0,
                "QueryString": "kaffe",
                "OnlyEKO": false,
                "StoreId": "016001",
                "CustomerGroups": "CUSTOMER_NOT_LOGGED_IN,CUSTOMER_PRIVATE,DEFAULT,STORE_016001,STORE_NOT_MEDMERA",
                "IP": "194.236.7.31",
                "UserId": "xakswebezikoezvkozr4ct2o"
            }
        },
        json: true,
    }, (err, res, body) => {
        if (err) throw err;

        // body.DirectResults
        fs.writeFileSync('output.json', JSON.stringify(body))
    })

}


//doRequest()
var db = JSON.parse(fs.readFileSync('output.json', 'utf8'))
var res = db.Data.Search.DirectResults

var newdb = []

res.forEach((o) => {
    var data = o.Entity.Attributes
    var obj = {
        name: data.Name,
        size: data.Size,
        brand: data.Manufacturer,
        img: data.ImageUrl,
        price: data.SortPrice,
        comparativePrice: data.SortComparativePrice,
        promos: data.Promos
    }
    console.log(data.Promos)

    newdb.push(obj)
})

// fs.writeFileSync('newdb.json', JSON.stringify(newdb))