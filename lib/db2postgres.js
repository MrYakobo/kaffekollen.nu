var fs = require('fs')
var db = [];

db.push(['coop', JSON.parse(fs.readFileSync('coop_db.json', 'utf8'))])
db.push(['willys', JSON.parse(fs.readFileSync('willys_db.json', 'utf8'))])

var allSql = ""
db.forEach((o) => {
    var sql =
    `
    DROP TABLE ${o[0]};
    CREATE TABLE ${o[0]} (
    id SERIAL PRIMARY KEY,
    name VARCHAR(44),
    weight INTEGER,
    price NUMERIC(5, 2),
    img_full VARCHAR(200),
    img_preview VARCHAR(200),
    brand VARCHAR(20),
    eco BOOLEAN,
    compareprice NUMERIC(5, 2),
    type VARCHAR(6),
    coffeinfree BOOLEAN,
    promo boolean,
    promo_amount INTEGER,
    promo_weight INTEGER,
    promo_price NUMERIC(3, 1),
    promo_compareprice INTEGER,
    promo_savings INTEGER,
    promo_label VARCHAR(21)
);
`
    o[1].forEach((e) => {
        var arr = [quote(e.name), e.weight, e.price, quote(e.img.full), quote(e.img.preview), quote(e.brand), truthy(e.eco), e.compareprice, quote(e.type), e.coffeinfree, promo(e.promo)]

        sql += `INSERT INTO ${o[0]} VALUES (DEFAULT, ${arr.join(',')});`;
    });
    allSql += sql
})

allSql = `${allSql}

DROP TABLE IF EXISTS coffee;

CREATE TABLE coffee (
id SERIAL PRIMARY KEY,
name VARCHAR(44),
weight INTEGER,
price NUMERIC(5, 2),
img_full VARCHAR(200),
img_preview VARCHAR(200),
brand VARCHAR(20),
eco BOOLEAN,
compareprice NUMERIC(5, 2),
type VARCHAR(6),
coffeinfree BOOLEAN,
promo boolean,
promo_amount INTEGER,
promo_weight INTEGER,
promo_price NUMERIC(3, 1),
promo_compareprice INTEGER,
promo_savings INTEGER,
promo_label VARCHAR(21)
);

ALTER TABLE coop INHERIT coffee;
ALTER TABLE willys INHERIT coffee;
`

fs.writeFileSync('db.pgsql', allSql)

function quote(str) {
    if(str == null) return 'null';
    return `'${str}'`
}

function truthy(bool){
    return bool ? 'true' : 'false'
}

function promo(promo) {
    if (promo == null) {
        var a = 'false,' + 'null,'.repeat(6);
        return a.substr(0, a.length - 1);
    }
    return [true, promo.amount, promo.weight, promo.price, promo.compareprice, promo.savings, quote(promo.label)].join(',')
}