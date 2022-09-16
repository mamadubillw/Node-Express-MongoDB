const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModels');
const AppError = require('./../utils/appError')
const crypto = require('crypto');
const sendEmail = require('./../utils/email')
const catchAsync = require('./../utils/catchAsync')

const signToken = id =>{
        return jwt.sign({id }, process.env.JWT_SECRET, {expiresIn : process.env.JWT_EXPIRES_IN});
}

const createSendToken = (user, statusCode, res) =>{
        const token = signToken(user.id);

        res.status(statusCode).json({
                status: 'success',
                token,
                data:{
                        user
                }
        })
}

exports.signup =catchAsync(async (req, res, next) => {
        const newUser = await User.create(req.body);
        createSendToken(newUser, 201, res)
        // em vez de :
//         const token = signToken(newUser._id);
        

// res.status(201).json({
//         status: 'success',
//         token,
//         data: {
//                 user: newUser
//         }
// });
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
        createSendToken(user, 200, res)
        
});

exports.protect = catchAsync(async (req, res, next) =>{
       // 1) Getting Token and check of it's true 
        let token;
        if(
                req.headers.authorization && req.headers.authorization.startsWith('Bearer')
        ){ 
                token = req.headers.authorization.split(' ')[1];
        }
      
        if(!token){
                return next(new AppError('You are not logged in !  please log in to get acces ', 401));
        }
       // 2) Verification Token 
       const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

      // console.log(decoded);
       // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if(!currentUser){
                return next(new AppError('The user belonging to this token does no longer exists', 401));
        }

      //  4) Check if user changed password after the token was issued
      if(currentUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed paassword, please log in again', 401));
      }
      //GRANT ACEES TO  PROTECTED ROUTE
      req.user = currentUser;
        next();
 })

 exports.restrictTo = (...roles) =>{
        return (req, res, next) =>{
                //roles [admin, lead-guide]. role = user

                if(!roles.includes(req.user.role)){
                        return next(
                                new AppError('You do not have permission to perform this action ', 403)
                        )
                }
                next();
        }  
 }

 exports.forgotPassword = catchAsync(async (req, res, next) =>{
        //1 get user based on posted email
        const user = await User.findOne({email: req.body.email});
        if(!user){
                return next( new AppError('There is no user whit email address', 404));
        }

        //2 Generate the random reset Token
        const resetToken = user.createPasswordResetToken();
        await user.save({validateBeforeSave: false});

        // send it  to users email
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

        const message = `Forgot a password Submit a patch request with your new password and paswordConfirm to: ${resetURL}.\nIf you didn't forget your password please ignore this email`;

        try{

        await sendEmail({
                email: user.email,
                subject: 'Your password reset token (valid for 10 min)',
                message
        }),

        res.status(200).json({
                status: 'success',
                message: 'Token sent to email'
        })
        }catch(err){
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                await user.save({validateBeforeSave: false});

                return next(new AppError('There was error sending the email. try again later', 500))
        }

        next()
 });

 exports.resetPassword = catchAsync( async(req, res, next) => {
        // 1) Get user based on the token
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({
                passwordResetToken: hashedToken,
                passwordResetExpires: {$gt: Date.now()}
        });
        // 2) If token has npt expired, and there is user, set the new passwor
        if(!user){
                return next(new AppError('Token is invalid or has expired', 400));
        }
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        // 3) Update changedPasswordAt property for the user

        // 4) Log the user user in, send JWT
        createSendToken(user, 200, res)
       
 });

exports.updatePassword = catchAsync(async(req, res, next)=>{
        //1Get User in collection
        const user = await User.findById(req.user.id).select('+password');
        // 2 check if POSTED current password is correct
         if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
                return next(new AppError('Your current password is wrong', 401))
         }

         //3 if so update password
         user.password = req.body.password;
         user.passwordConfirm = req.body.passwordConfirm;

         //4 Log user in send token jwt
         createSendToken(user, 200, res)        
})