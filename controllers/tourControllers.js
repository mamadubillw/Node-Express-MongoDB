const Tour = require('./../models/tourModels')
const { toUSVString } = require('util');






exports.getAllTours = async (req, res) =>{
        try{ 
        const tours =  await Tour.find();
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

exports.updateTour = (req, res) =>{
       
        res.status(200).json({
                status:'succes',
                data:{
                        tour:'<Updated here>',
                        
                }
        });
}

exports.deleteTour =  (req, res) =>{
       
        res.status(204).json({
                status:'succes',
                data:{
                       // tour:'<Updated here>'
                        tour:null
                }
        })
}
