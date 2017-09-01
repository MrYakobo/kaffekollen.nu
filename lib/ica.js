var fs = require('fs')
var xray = require('x-ray')

var x = xray()

var src = 'https://www.ica.se/butiker/${stad}/'

x(src, 'ul.links', [{
    links: 'li>a',
}])((err, data)=>{
    if(err) throw err;
    console.log(data)
})