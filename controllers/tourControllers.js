const Tour = require('./../models/tourModels')
const { toUSVString } = require('util');
const { trusted } = require('mongoose');
const { match } = require('assert');
const { json } = require('express');


exports.aliasTopTours = (req, res, next) =>{
        req.query.limit = '5';
        req.query.sort = '-ratingsAverage,price';
        req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

        next();
};



exports.getAllTours = async (req, res) =>{
        try{ 
                // BUILD A QUERY
                //1)filtering
                const queryObj = { ...req.query };
                const excludeFields = ['page', 'sort','limit', 'fields'];
                excludeFields.forEach(el => delete queryObj[el]);
               
               //2)ADVANCED FILTERING 
               let queryStr = JSON.stringify(queryObj); //converter para string
               queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,  match => `$${match}`);

               //{difficulty: 'easy', duration:'{$gte: 5}}
               //{difficulty: 'easy', duration:'{gte: 5}}
               //gte, gt, lte, lt
              // console.log(JSON.parse(queryStr))

        // const tours =  await Tour.find({
        //         duration:'easy',
        //         duration:5
        // });
        // const tours = await Tour.find()
        // .where('duration').equals(5)
        // .where('difficulty').equals('easy')

        let query = Tour.find(JSON.parse(queryStr))//para fazer directamente do postman

        //SORTING
        if(req.query.sort){
                const sortBy = req.query.sort.split(',').join(' ');
                query = query.sort(sortBy);
        }else{
                query = query.sort('createdAt');
        }

        //FIELD LIMITING
        if(req.query.fields){
                const fields = req.query.fields.split(',').join(' ');
                query = query.select(fields);
        }else{
                query = query.select('-__v');
        }
        //PAGINATION
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if(req.query.page){
                const numTours = await Tour.countDocuments();
                if(skip > numTours) throw new Error('This page does not exists ');
        }

        //EXCECUTE QUERY 
        const tours = await query;

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
