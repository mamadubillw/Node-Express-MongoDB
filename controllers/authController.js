const jwt = require('jsonwebtoken');
const User = require('./../models/userModels');
const AppError = require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync')

const signToken = id =>{
        return jwt.sign({id }, process.env.JWT_SECRET, {expiresIn : process.env.JWT_EXPIRES_IN});
}

exports.signup =catchAsync(async (req, res, next) => {
        const newUser = await User.create(req.body);
        const token = signToken(newUser._id);
        

res.status(201).json({
        status: 'success',
        token,
        data: {
                user: newUser
        }
});
});

exports.login =catchAsync(async (req, res, next) => {
        //const email = req.body.email; e igual a :
        //const password = req.body.password; e igual a :
        const {email, password} = req.body;

        // 1_ Check if email and password exist
        if(!email || !password){
              return  next(new AppError('Please provide email and password', 400));
        }

        // 2_ check if user exists and password is correct
       // const user = User.findOne({email:email});
        const user = await User.findOne({email}).select('+password');
        if(!user || !(await user.correctPassword(password, user.password))){
                return next(new AppError ('Incorret Email or Password', 401));
        }
        // 3_if everything is ok send token to client
        const token = signToken(user._id);
        res.status(200).json({
                status: 'success',
                token
        });
});

exports.protect = catchAsync((req, res, next) =>{
        // 1) Getting Token and check of it's true 
        // 2) Verification Token 
        // 3) Check if user still exists
        // 4) Check if user changed password after the token was issue
        next();
 })