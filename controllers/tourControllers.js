const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const Tour = require('./../models/tourModels')
const { toUSVString } = require('util');
const { trusted } = require('mongoose');
const { match } = require('assert');
const { json } = require('express');


exports.aliasTopTours = (req, res, next) =>{
        req.query.limit = '5';
        req.query.sort = '-ratingsAverage,price';
        req.query.field = 'name,price,ratingsAverage,summary,difficulty';

        next();
};
 
exports.getAllTours = catchAsync(async (req, res, next) =>{
        //EXCECUTE QUERY 

        const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
        const tours = await features.query;
        // SEND RESPONSE
        res.status(200).json({
                status:'success', 
                results: tours.length,
                // resultat:tours.length,
                data:{
                        tours
                   }
        });
});

exports.getTour = catchAsync(async (req, res, next) =>{
                //populate taz todos os dados de uma reference
                const tour = await Tour.findById(req.params.id).populate('Reviews');
                // Se mudamos uma letra no id devolve um sucesso com o tour null e por isso 
                if(!tour){
                        return next(new AppError('No tour found with that ID', 404));
                }
                res.status(200).json({
                        data:{
                                tour
                        }
       
});
        //return(next())
});



exports.createTour = catchAsync(async  (req, res) =>{
        const newTour = await Tour.create(req.body);

        res.status(201).json({
                status:'success',
                 data: {
                         tour: newTour
                 }
        });

        //return(next())
});

exports.updateTour =catchAsync(async (req, res, next) =>{
       
       
        const tour= await Tour.findByIdAndUpdate(req.params.id, req.body, {
                new:true,
                runValidators:true
        }); 

        if(!tour){
                return next(new AppError('No tour found with that ID', 404));
        }
        res.status(200).json({
                status:'succes',
                data:{
                        tour
                }
        });
});

exports.deleteTour = catchAsync(async (req, res, next) =>{
       
       
        const tour = await Tour.findByIdAndDelete(req.params.id);
        if(!tour){
                return next(new AppError('No tour found with that ID', 404));
        }
        res.status(200).json({
                status:'success',
                data:null
                       
                
        })
})

        //CORRECAO
exports.getTourStats =catchAsync(async (req, res) =>{
                const stats = await Tour.aggregate([
                        {
                                $match: {ratingsAverage:{$gte:'4.5'}}
                        },
                        {
                                $group: {
                                       // _id:'difficulty', se agroupamos por dificuldade teremos resultado como teremos como os que tem difficulty easy e mediun
                                       _id:{$toUpper: '$difficulty'},
                                        numTours:   {$sum: 1},
                                        numRatings: {$sum: '$ratingsQuantity'},
                                        avgRating:  {$avg: '$ratingsAverage'},
                                        avgPrice:   {$avg: '$price'},
                                        minPrice:   {$min: '$price'},
                                        maxPrice:   {$max: '$price'}

                                }
                        },
                        {
                                $sort:{avgPrice: 1}
                        },
                        {
                                $match: {_id:{$ne:'EASY'}}
                        }
                ]);
                res.status(200).json({
                        status:'success',
                        data:{
                                stats
                        }       
                });
})

exports.getMonthlyPlan =catchAsync(async (req, res) =>{
        
                const year = req.params.year * 1;
                const plan = await Tour.aggregate([

                        {$unwind: '$startDates'},
                        {
                                $match:{
                                        startDates:{
                                                $gte: new Date(`${year}-01-01`),
                                                $lte: new Date(`${year}-12-31`)
                                        }
                                }
                        },
                        {
                                $group:{
                                        _id:{ $month: '$startDates' },
                                        numTourStarts:{$sum: 1},
                                        tours:{$push: '$name'}
                                }
                        },
                        {
                                $addFields:{ month: '$_id' }
                        },
                        {
                                $project:{_id:0}
                        },
                        {
                                $sort:{numTourStarts: -1}
                        }
                ]);
                res.status(200).json({
                        
                        status:'success',
                       // results: plan.length,
                        data:{
                                plan
                        }
                });
})
 