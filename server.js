var express = require('express')
var path = require('path')
var app = express()

var fs = require('fs')

var db = require('./db-connect')
var _ = require('lodash')
var squel = require("squel").useFlavour('postgres');

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

var request = require('request')

var sweden = JSON.parse(fs.readFileSync('lib/platser.json', 'utf8'))
var Fuse = require('fuse.js')
var fuse = new Fuse(sweden, {
  shouldSort: true,
  includeMatches: true,
  threshold: 0.3,
  location: 0,
  distance: 10,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ["name"],
  sortFn: (a, b) => {
    return (a.score - a.item.population) - (b.score - b.item.population)
  }
})

const stat = require('./staticStuff')

io.on('connection', (socket) => {
  var chosenCities = []
  console.log('a dude connected')
  // send static data about brands and the such
  socket.emit('data', {
    brands: stat.brands(),
    types: stat.types()
  })
  socket.emit('date', stat.date())

  // send frontpage information
  socket.emit('frontpage', stat.frontpage())
  socket.on('cities', (msg) => {
    console.log('chosenCities from client: ' + msg)
    chosenCities = msg
  })
  socket.on('swedenquery', (msg) => {
    let f = fuse.search(msg)
    var db = []
    if (chosenCities.length == 0 || typeof(chosenCities) !== 'object') {
      for(let i = 0; i < f.length; i++){
        db.push(f[i])
      }
    } else {
      for (let i = 0; i < f.length; i++) {
        for (let j = 0; j < chosenCities.length; j++) {
          if (!_.isEqual(f[i].item, chosenCities[i]))
            db.push(f[i])
        }
      }
    }
    socket.emit('swedenquery', db.slice(0, 5))
  })

  socket.on('query', (data) => {

    function build(tablename) {
      let sql = squel
        .select()
        .from(tablename)
        .field(`'${tablename}'`, 'tablename')
        .field('*')

      if (data.brands.length > 0)
        sql = sql.where(data.brands.length > 0 ? 'brand IN ?' : '', data.brands)
      if (data.types.length > 0)
        sql = sql.where(data.types.length > 0 ? 'type IN ?' : '', data.types)

      sql = sql
        .where(data.eco ? 'eco' : '')
        .where(data.coffeinfree ? 'coffeinfree' : '');
      return sql
    }
    let sql = build('willys').union(build('coop'))
    var finalSql = sql.toParam().text + ` ORDER BY promo_compareprice,compareprice`
    // console.log(`finalsql: ${finalSql}`)
    // console.log(sql.toParam().text)
    // console.log(sql.toParam().values)
    // console.log(sql.toString())

    db(finalSql, sql.toParam().values).then((dat) => {
      socket.emit('result', dat.rows)
      // console.log('results: ' + JSON.stringify(dat.rows))
    })
    // console.log('query: ' + msg)
  })
  socket.on('disconnect', () => {
    console.log('the dude disconnected')
  })
})

app.use('/node_modules', express.static(__dirname + '/node_modules'))
app.use('/dist', express.static(__dirname + '/dist'))

http.listen(5000, () => {
  console.log(5000)
})
