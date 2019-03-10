var casper = require('casper').create();
var links;


// Opens casperjs homepage
casper.start('https://www.coop.se/handla-online/sok/kaffe');

casper.then(function () {
    var btn = 'button.FlatButton.FlatButton--green.FlatButton--block.js-paginator.Pagination-button'
    casper.waitForSelector(btn, function () {
        for (var i = 0; i < 5; i++)
            this.click(btn)
    });

    function getCoffee() {
        var base = 'div.StoreGrid-inner.js-gridBody>article>div.StoreItem-inner'
        var titles = get(base, 'a>h3')
        var brands = get(base, `a>p>span>strong>span`)
        var weights = get(base, 'a>p>span>span[itemprop="weight"]')
        var price = get(base, 'div.StoreItem-footer>div>div.StoreItem-price span[itemprop="price"]')
    }
});

function get(base, selector) {
    return document.querySelectorAll(`${base} ${selector}`).innerHTML;
}

casper.run(function () {
    for (var i in links) {
        console.log(links[i]);
    }
    casper.done();
});