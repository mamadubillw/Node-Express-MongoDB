const fs = require('fs');
const express = require('express');
const app = express();


const morgan = require('morgan'); //middlewere
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//middlewere
console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === 'development'){
        app.use(morgan('dev'));
}
 // that will return one function similar to fuc middlewere      
app.use(express.json()); // Retorna uma funcao que permitira next
app.use(express.static(`${__dirname}/public`)) // acces to files html

app.use((req, res, next) =>{
        console.log('Hello from the middlewer');
        next();
});

app.use((req, res, next) =>{
        console.log('middlewere 2')
        req.requestTime = new Date().toISOString();
        next();
})



        //      ROUTES HANDLERS
        



        // app.get('/api/v1/tours', getAllTours)

        // app.get('/api/v1/tours/:id', getTour);

        // app.post('/api/v1/tours', createTour)

        // app.patch('/api/v1/tours/:id', updateTour)

        // app.delete('/api/v1/tours/:id', deleteTour)

        // Substituido👆 👇


        //ROUTES



        
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
        //START SERVER


module.exports = app;