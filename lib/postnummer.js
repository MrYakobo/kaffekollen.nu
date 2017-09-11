var token = require('./credentials').api_key;
var fs = require('fs')
var request = require('request')

module.exports = function (postnummer) {
    return new Promise((resolve, reject) => {
        request(`https://papapi.se/json/?z=${spaceify(postnummer.toString())}&token=${token}`, {}, (err, header, body) => {
            fs.writeFileSync('post.json',JSON.stringify(body))
            if (err) reject(err)
            // var city = body.result.city
            resolve(body)
        })
    })
}

function spaceify(str) {
    //papapi vill ha postnummer såhär: 439 71 och inte 43971.
    return str.substr(0, 3) + " " + str.substr(3, 2)
}