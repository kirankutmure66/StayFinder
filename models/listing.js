const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviewa.js");
const User = require("./user.js");
const { required } = require("joi");

const listingSchema = new Schema({
    title:{
        type:String
    },
    description:{
        type:String
    },
    image: {
    
    url: {
        type: String,
        default: "https://www.magnific.com/free-photo/urban-traffic-with-cityscape_1120238.htm#from_element=cross_selling__photo"
    },
    filename: {
        type: String,
        default: "listingimage"
    }
},
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    review:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
     geometry: {
    type: {
        type:String,
        enum:["Point"],
        required:true
    },
    coordinates:{
        type:[Number],
        required:true
    }
    
  },
});


listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
      await Review.deleteMany({_id:{$in:listing.review}});
    }

});
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;