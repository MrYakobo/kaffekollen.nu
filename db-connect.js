const { Pool } = require('pg')
const pool = new Pool(require('./lib/credentials').db)

module.exports = (text, params)=>{
    return new Promise((res,rej)=>{
        pool.query(text, params).then(res).catch(rej)
    })
}