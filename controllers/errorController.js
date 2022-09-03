const AppError = require('./../utils/appError');

const handleCastErrorDB = err =>{
        //handling error mongoose
        const message = `Invalid ${err.path}: ${err.value}.`;
        return new AppError(message, 400);
}
const handleDuplicateFieldsDB = err =>{
        //REGEX  encontrando palavra entre Aspas
        const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
        console.log(value);
        const message = `Duplicate field value:  please use another value`;
        console.log(message)

                return new AppError (message, 404);
}
const handleValidationErrorDB = err => {
        const errors = Object.values(err.errors).map(el => el.message);
        const message = `Invalid input data. ${errors.join('. ')}`;
        console.log(message)
        return new AppError(message, 400);
}

const handleJWTError = err =>  new AppError('Inalid token, please log in again', 401);

const handleExpiredError = err => new AppError('Your token has expired, Please log in again', 401);

const sendErrorDev = (err, res) => {
        res.status(err.statusCode).json({
                status: err.status,
                error: err,
                message: err.message,
                stack: err.stack
        });
}
 
const sendErrorProd = (err, res) => {
        //Operational, trusted error: send message to client
        if(err.isOperational){
                res.status(err.statusCode).json({
                        status: err.status,
                        message: err.message
                });
                //Programing or other unknown error don't leat error details
        }else{
                // 1) Log error 
                console.error('Error', err)
                res.status(500).json({
                        // send generic message
                        status: 'error',
                        message: 'Something wwent wrong'
                })
        }
        
}
module.exports = (err, req, res, next) =>{
        // console.log(err.stack);
     
         err.statusCode = err.statusCode || 500;
         err.status = err.status || 'error';
        if(process.env.NODE_ENV === 'development'){

               sendErrorDev(err, res);

        }else if(process.env.NODE_ENV === 'production'){
                let error = {...err};
                // caso um erro id , erro no link
                if(error.name === 'CastError') error = handleCastErrorDB(error);
                // valor do campos duplicados ex: inserir um nome existente
                if(error.code === 11000) error = handleDuplicateFieldsDB(error);
                // ex: um codigo curto ou tem mais de que caracteres pedidos
                if(error.name === 'ValidatorError') error = handleValidationErrorDB(error);
                // JWT ERROR
                if(err.name === 'JsonWebTokenError') error = handleJWTError(error);
                //EXP ERRoR
                if(err.name === 'TokenExpiredError') error = handleExpiredError(error);

                sendErrorProd(error, res);
        }
         
 }      