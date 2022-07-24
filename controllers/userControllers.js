const User = require('./../models/userModels');
const catchAsync = require('./../utils/catchAsync');


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
