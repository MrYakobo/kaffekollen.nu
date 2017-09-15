const squel = require("squel").useFlavour('postgres');
const db = require('./db-connect')
const fs = require('fs')

var moment = require('moment')
moment.locale('sv')

var brands = [];
var types =   [];
var frontpage = [];

var date;
fs.stat('lib/db.pgsql', (err, stats) => {
  date = moment(stats.mtime).toNow(true)
})

let promo = squel.select()
  .field('*')
  .field(`'coop'`, 'tablename')
  .where('promo')
  .from('coop')
  .union(squel.select()
    .field('*')
    .field(`'willys'`, 'tablename')
    .where('promo')
    .from('willys')
  )

db(promo.toString()).then((data) => {
  frontpage = data.rows
}).catch((err) => {
  throw err
})
db('SELECT brand,COUNT(*) as freq FROM coffee GROUP BY brand ORDER BY COUNT(*) DESC').then((data) => {
  brands = data.rows.map((x) => {
    return x.brand
  });
}).catch((err) => {
  throw err
})
db('SELECT type,COUNT(*) as freq FROM coffee GROUP BY type ORDER BY COUNT(*) DESC').then((data) => {
  types = data.rows.map((x) => {
    return x.type
  });
}).catch((err) => {
  throw err
})

module.exports = {
  brands(){
      return brands;
  },
  types(){
      return types;
  },
  frontpage(){
      return frontpage;
  },
  date(){
      return date;
  }
}
// module.exports.brands = brands
// module.exports.types = types
// module.exports.frontpage = frontpage
// module.exports.date = date
