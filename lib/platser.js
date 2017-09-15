let fs = require('fs')
let parser = require('xml2json')
let _ = require('lodash')
let s = fs.readFileSync('platser.osm.xml','utf8')
let obj = JSON.parse(parser.toJson(s))

var db = []
obj.osm.node.forEach((o)=>{
  // let l = _.find(o.tag, (a)=>{ return a.k == 'name' }).v
  try{
  db.push({
    name: _.find(o.tag, (a)=>{ return a.k == 'name' }).v,
    place: _.find(o.tag, (a)=>{ return a.k == 'place' }).v,
    population: parseInt(_.find(o.tag, (a)=>{ return a.k == 'population' }).v),
    lat: o.lat,
    lon: o.lon
  })
}
catch(e){
  // console.log(_.find(o.tag, (a)=>{return a.k == 'name'}).v)
  // console.log(e)
}
})
fs.writeFileSync('db.json',JSON.stringify(db))
// { id: '-1',
//   lat: '57.73661532174',
//   lon: '11.72846786975',
//   tag:
//    [ { k: 'name', v: 'Tumlehed' },
//      { k: 'place', v: 'village' },
//      { k: 'ref:se:scb:tätort:kod', v: 'T4510' },
//      { k: 'population', v: '475' },
//      { k: 'population:source', v: 'Statistiska centralbyrån' },
//      { k: 'population:source:date', v: '2010-12-31' } ] }
//
// console.log(obj)
