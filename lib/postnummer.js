var token = require('./credentials').api_key;
var request = require('request')

module.exports = function(postnummer){
    request(`https://papapi.se/json/?z=${spaceify(postnummer.toString())}&token=${token}`,{},(err, header, body)=>{
        if(err) throw err;
        var city = JSON.parse(body).result.city
        return city
    })
}

function spaceify(str){
    //papapi vill ha postnummer såhär: 439 71 och inte 43971.
    return str.substr(0, 3) + " " + str.substr(3,2)
}