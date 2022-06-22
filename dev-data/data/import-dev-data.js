const fs = require('fs');
const dotenv = require('dotenv');
const mongoose  = require('mongoose');
const Tour = require('./../../models/tourModels')

dotenv.config({path: './config.env'});

const  DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB,
        //process.env.DATABASE_LOCAL, => CONEXAO LOCAL
         {})
.then(conn =>{
        console.log('connection Success');
})

//Reading JSON file
const tours = JSON.parse(fs.readFileSync( `${__dirname}/tours-simple.json`, 'utf8'));

// IMPORT DATA INTO DB

const importData = async () =>{
        try {
                await Tour.create(tours);
                console.log('Data succesifle loadded')
        } catch (err) {
                console.log(err);
        }
}

//DELETING DATA FROM DB 

const delteData = async () =>{
        try {
                await Tour.deleteMany();
                console.log('Data succesifle deleted');
                process.exit();
        } catch (err) {
          console.log(err)
        }
}
if (process.argv[2] == '--import') {
        importData();
}else if(process.argv[2] == '--delete'){
        delteData();
}