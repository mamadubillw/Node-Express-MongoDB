
const mongoose  = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err =>{
        console.log('UNCAUGHT EXEPTION  Shuting down... ');
        console.log(err.name, err.message);
                process.exit(1);
 })

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
const server = app.listen(port, ()=>{
        console.log('Listening on port 3000');
});

// handling Rejections ex: connection to the DB
process.on('unhandledRejection', err =>{
        console.log(err.name, err.message);
        console.log('UNHANDLE REJECTION Shuting down')
        server.close(() => {

                process.exit(1)
        })
});
 
//console.log(x)

//estudo :LER SOBRE ERROR NA DOCUMENTATACAO E SOBRE VARIAVEL SERVER QUE FOI DEFINIDO NO INICIO