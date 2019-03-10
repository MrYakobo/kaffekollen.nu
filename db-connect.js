const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL;
console.log('connstring:' + connectionString);

const pool = new Pool({
    connectionString: connectionString,
    ssl: true,
});

module.exports = (text, params)=>{
    return new Promise((res,rej)=>{
        pool.query(text, params).then(res).catch(rej)
    })
}