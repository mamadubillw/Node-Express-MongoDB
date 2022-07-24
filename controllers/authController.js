const jwt = require('jsonwebtoken');
const User = require('./../models/userModels');
const AppError = require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync')


exports.signup =catchAsync(async (req, res, next) => {
        const newUser = await User.create(req.body);
        const token = jwt.sign({id : newUser._id}, process.env.JWT_SECRET, {expiresIn : process.env.JWT_EXPIRES_IN})

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
        console.log(user)
        // 3_if everything is ok send token to client
        const token = ''
        res.status(200).json({
                status: 'success',
                token
        });
});