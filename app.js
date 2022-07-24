const express = require('express');
const app = express();
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const morgan = require('morgan'); //middlewere
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//middlewere
//console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === 'development'){
        app.use(morgan('dev'));
}

// app.use = global middleware 

 // that will return one function similar to fuc middlewere      
app.use(express.json()); // Retorna uma funcao que permitira next
app.use(express.static(`${__dirname}/public`)) // acces to files html


app.use((req, res, next) =>{
        req.requestTime = new Date().toISOString();
        next();
})
        // app.delete('/api/v1/tours/:id', deleteTour)

        // Substituido👆 👇
        
        //ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
        //START SERVER

        //FOR ALL THE HTTP MEETHODS and ALL ROUTES*
app.all('*', (req, res, next) =>{
        //quando next e passado um argumento geralmente e um error
        next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);


module.exports = app;