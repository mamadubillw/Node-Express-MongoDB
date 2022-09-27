const express = require('express');
const app = express();
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const morgan = require('morgan'); //middlewere
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');



//set security http headers
app.use(helmet());
//middlewere
//console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === 'development'){
        app.use(morgan('dev'));
}

// app.use = global middleware 

//limit requests from same api
const limiter = rateLimit({
        max:100,
        windowMs:60 * 60 * 1000,
        message: 'tOO many request from this ip, please try again an 1 hour'
});
app.use('/api',limiter);
 // that will return one function similar to func middlewere      
 //body parser reading data from body into req.body
app.use(express.json({limit: '10kb'})); // Retorna uma funcao que permitira next req e res

//Data sanitazation against noSql query injection
app.use(mongoSanitize());
//Data sanitazation against xss 
app.use(xss());

//prevent parameter polluition
app.use(hpp({
        whitelist: [
                'duration',
                'ratingsAverage',
                'ratingsQuantity',
                'maxGroupeSize',
                'difficulty',
                'price'
        ]
}));
app.use(express.static(`${__dirname}/public`)) // acces to files html


app.use((req, res, next) =>{
        req.requestTime = new Date().toISOString();
        // console.log(req.headers)
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
//UM MIDDLEWARE DEPOIS Q JA FIZEMOS UM REQUISICAO



module.exports = app;