
const mongoose  = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./app');


const  DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB,
        //process.env.DATABASE_LOCAL, => CONEXAO LOCAL
         {})
.then(conn =>{
        console.log('connection Success');
})



//console.log(process.env) // lista variables env
const port =process.env.PORT || 3000
app.listen(port, ()=>{
        console.log('Listening on port 3000');
});