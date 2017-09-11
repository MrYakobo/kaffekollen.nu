function get(postnummer) {
    var fs = require('fs')
    var xray = require('x-ray')

    var x = xray()
    var city = require('./postnummer.js')

    var src = `https://www.ica.se/butiker/${city(postnummer)}/`

    x(src, 'ul.links', [{
        links: 'li>a',
    }])((err, data) => {
        if (err) throw err;
        console.log(data)
    })

}