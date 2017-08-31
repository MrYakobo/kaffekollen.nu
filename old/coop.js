var fs = require('fs')
var xray = require('x-ray')
var NightmareElectron = require('x-ray-nightmare');

var driver = NightmareElectron()

function clickBtn(ctx, nightmare){
    NightmareElectron.goto(ctx.url).click('button.FlatButton.FlatButton--green.FlatButton--block.js-paginator.Pagination-button')
}

var x = xray().driver(NightmareElectron(clickBtn))

// var src = 'https://www.coop.se/handla-online/sok/kaffe'
var src = fs.readFileSync(__dirname + '/coop.html','utf8')

x(src, 'div.StoreGrid-inner.js-gridBody>article>div.StoreItem-inner', [{
    name: 'a>h3.u-text17.u-textNormal.u-textHyphenate.u-marginVs.u-linkComplexTarget',
    brand: 'a>p>span>strong>span',
    weight: 'a>p>span>span[itemprop="weight"]',
    price: 'div.StoreItem-footer>div>div.StoreItem-price span[itemprop="price"]'
}])((err, data)=>{
    if(err) throw err
    console.log(data)
})
// .paginate('button.FlatButton.FlatButton--green.FlatButton--block.js-paginator.Pagination-button')
// .write('result.json')