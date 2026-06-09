const mongoose = require('mongoose');

require('dotenv').config();

exports.connect = ()=>{

    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{console.log('DB connected')})
    .catch((err)=>{
        console.log('DB connection issue');
        console.error(err);
        process.exit(1);
    })

}