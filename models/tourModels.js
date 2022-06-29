const mongoose  = require('mongoose');
const slugify = require('slugify');
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
        slug: String,
        difficulty:{
                type:String,
                required:[true, 'A tour must have a difficulty']
        },
        ratingsAverage:{
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
                default:Date.now(),
                select: false //exlcuir campo ex pasword
        },
        startDates: [Date],
        secreTours:{
                type:Boolean,
                defaul:false
        }

},{
        toJSON: {virtuals: true,},
        toObject: {virtuals: true}
});
tourSchema.virtual('durationWeeks').get(function (){
        return this.duration / 7;
});
//DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function(next) {
        this.slug = slugify(this.name, {lower: true});
        next();
});

// tourSchema.pre('save', function(next) {
//         console.log('Will save document');
//         next();
// });

// tourSchema.post('save', function(doc, next) {
//         console.log(doc)
//         next();
// });
//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next) {
        this.find({secreTours:{$ne: true}});
        this.start = Date.now();
        next();
})

tourSchema.post(/^find/, function(docs, next){
        console.log(`Query took ${Date.now() - this.start} milliseconds`)
        console.log(docs);
        next();
})



const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;