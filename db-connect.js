const { Pool } = require('pg')

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

module.exports = (text, params)=>{
    return new Promise((res,rej)=>{
        pool.query(text, params).then(res).catch(rej)
    })
}