const mongoose  = require('mongoose');

const tourSchema = new mongoose.Schema({
        name:{
                type:String,
                required:[true, 'A tour must hAVE a neme'],
                unique:true
        },
        rating:{
                type:String,
                dafault:4.5
        },
        price:{
                type:Number,
                required:[true, 'Atour must have a value']
        }

});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;