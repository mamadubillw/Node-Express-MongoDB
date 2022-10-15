const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review:{
        type:String,
        required:[true, 'Review cannot be empty']
    },
    reting:{
        type:Number,
        min:1,
        max:5
    },
    cretedAt:{
            type:Date,
            Default:Date.now

    },

    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required: [true, 'Review must belong a tour']
    },

    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true, 'Review must belong to a User']
    },

    
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
}
);
reviewSchema.pre(/^find/, function(next){
    this.populate({
        path: 'tour',
        select: 'name'
    }).populate({
        path: 'user',
        select: 'name photo'
    })
    next();
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;