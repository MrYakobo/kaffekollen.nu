var express = require('express')
var path = require('path')
var app = express()

var fs = require('fs')
var moment = require('moment')
moment.locale('sv')
var db = require('./db-connect')

var squel = require("squel").useFlavour('postgres');

var staticData = {};
var frontpage = [];

let promo = squel.select()
.field('*')
.field(`'coop'`,'tablename')
.where('promo')
.from('coop')
.union(squel.select()
    .field('*')
    .field(`'willys'`,'tablename')
    .where('promo')
    .from('willys')
)

db(promo.toString()).then((data) => {
    frontpage = data.rows
}).catch((err) => {
    throw err
})
db('SELECT brand,COUNT(*) as freq FROM coffee GROUP BY brand ORDER BY COUNT(*) DESC').then((data) => {
    staticData.brands = data.rows.map((x) => {
        return x.brand
    });
}).catch((err) => {
    throw err
})
db('SELECT type,COUNT(*) as freq FROM coffee GROUP BY type ORDER BY COUNT(*) DESC').then((data) => {
    staticData.types = data.rows.map((x) => {
        return x.type
    });
}).catch((err) => {
    throw err
})

var date;
fs.stat('lib/db.pgsql',(err,stats)=>{
    date = moment(stats.mtime).toNow(true)
})

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

var apikey = require('lib/credentials.js').api
var request = require('request')

io.on('connection', (socket) => {
    console.log('a dude connected')
    // send static data about brands and the such
    socket.emit('data', JSON.stringify(staticData))
    socket.emit('date', JSON.stringify(date))

    // send frontpage information
    socket.emit('frontpage', JSON.stringify(frontpage))

    socket.on('papi', (query)=>{
        request(`https://papapi.se/json/?z=${JSON.parse(query)}&c=Stockholm&token=${apikey}`)
        JSON.parse(query)
    })
    socket.on('query', (msg) => {
        let data = JSON.parse(msg)

        function build(tablename) {
            let sql = squel
            .select()
            .from(tablename)
            .field(`'${tablename}'`,'tablename')
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
        console.log(`finalsql: ${finalSql}`)
        console.log(sql.toParam().text)
        console.log(sql.toParam().values)

        db(finalSql, sql.toParam().values).then((dat) => {
            socket.emit('result', JSON.stringify(dat.rows))
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