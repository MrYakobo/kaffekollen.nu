var post = require('./postnummer')

post(43971).then((city)=>{
    console.log(city)
}).catch((err)=>{
    throw err;
})