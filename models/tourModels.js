const mongoose  = require('mongoose');

const tourSchema = new mongoose.Schema({
        name:{
                type:String,
                required:[true, 'A tour must hAVE a neme'],
                unique:true,
                trim:true
        },
        duration:{
                type:Number,
                required:[true, "Atour must have a duration"]
        },
        maxGroupSize:{
                type:Number,
                required:[true, "Atour must have a groupe size"]
        },
        difficulty:{
                type:String,
                required:[true, 'A tour must have a difficulty']
        },
        ratingsAvrage:{
                type:String,
                dafault:4.5
        },
        ratingsQuantity:{
                type:String,
                dafault:0
        },
        price:{
                type:Number,
                required:[true, 'Atour must have a value']
        },

        priceDiscount:Number,

        summary:{
                type:String,
                trim:true,
                required:[true, 'A tour must have a description']
        },
        description:{
                type:String,
                tirm:true
        },
        imageCover:{
                type:String,
                required:[true, 'A Tour must have cover page']
        },

        images: [String],

        createdAt:{
                type:Date,
                default:Date.now()
        },
        startDates: [Date]

});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;