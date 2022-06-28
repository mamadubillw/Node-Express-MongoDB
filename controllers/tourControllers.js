const APIFeatures = require('./../utils/apiFeatures')
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

exports.getAllTours = async (req, res) =>{
        try{
             
        
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
}catch(err){
        res.status(404).json({
                status:'Fail',
                message:err
        })
}
};

exports.getTour = async (req, res) =>{
        try{
                const tour = await Tour.findById(req.params.id);
                res.status(200).json({
                        data:{
                                tour
                        }
                });
        }catch(err){
                res.status(404).json({
                        status:'Fail',
                        message:err
        });
}
}


exports.createTour = async  (req, res) =>{
        // const newTour = newTour({})
        // newTour.save();
try{ 
        const newTour = await Tour.create(req.body);

        res.status(201).json({
                status:'success',
                 data: {
                         tour: newTour
                 }
        });
}catch(err){
        res.status(400).json({
                status:'fail',
                message:err
        })
}
}

exports.updateTour = async (req, res) =>{
       
       try {
        const tour= await Tour.findByIdAndUpdate(req.params.id, req.body, {
                new:true,
                runValidators:true
        }); 
        res.status(200).json({
                status:'succes',
                data:{
                        tour
                }
        });
       } catch (err) {
        res.status(400).json({
                status:'fail',
                message:err
        });
       }
};

exports.deleteTour =  async (req, res) =>{
       
       try {
        await Tour.findByIdAndDelete(req.params.id)
        res.status(200).json({
                status:'success',
                data:null
                       
                
        })
        
       } catch (err) {
        res.status(400).json({
                status:'fail',
                message:err
        });
       }
}

        //CORRECAO
exports.getTourStats = async (req, res) =>{
        try {
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

        } catch (err) {
                res.status(400).json({
                        status:'fail',
                        message:err
                });
        }
}

exports.getMonthlyPlan = async (req, res) =>{
        try {
                const year = rea.params.year * 1;
                const plan = await Tour.aggregate([])
                res.status(200).json({
                        
                        status:'success',
                        data:{
                                plan
                        }
                });
                
        } catch (err) {
                res.status(400).json({
                        status:'fail',
                        message:err
                });
        
        }
}
