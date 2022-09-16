const AppError = require('../utils/appError');
const User = require('./../models/userModels');
const catchAsync = require('./../utils/catchAsync');


const filterObj = (obj, ...allowedFields) =>{
        const newObj = {};
        Object.keys(obj).forEach(el=>{
                if(allowedFields.includes(el))  newObj[el] = obj[el]
        });
        return newObj; 
}

exports.getAllUsers =catchAsync(async (req, res) =>{
        const users = await User.find();
        res.status(200).json({
                status: 'success',
                results: users.length,
                data:{
                        users
                }
        });
});

exports.createUser = (req, res) =>{
        res.status(500).json({
                status: 'Error',
                message: 'This route is not yet defined'
        });
};

exports.getUser = (req, res) =>{
        res.status(500).json({
                status: 'Error',
                message: 'This route is not yet defined'
        });
};

exports.updateMe = catchAsync(async(req, res, next) =>{
        //1)-create error if user posted password data
        if(req.body.password || req.body.passwordConfirm){
                return next(new AppError('This route is not for password updates. please use /updateMyPassword'))
        }

        //update user document
        //filtered out unwanted fields tha are not be allowed to be updated
        const filteredBody = filterObj(req.body, 'name', 'email');
        const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {new: true, runValidators:true})
        //await user.save(); porque
        res.status(200).json({
                status: 'success',
                data:{
                        user:updateUser
                }
        })
});

exports.updateUser = (req, res) =>{
        res.status(500).json({
                status: 'Error',
                message: 'This route is not yet defined'
        });
};

exports.deleteUser = (req, res) =>{
        res.status(500).json({
                status: 'Error',
                message: 'This route is not yet defined'
        });
};
