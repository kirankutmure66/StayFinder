const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/expresserror.js");
const Review = require("../models/reviewa.js");
const {listingSchema} = require("../schema.js");
const {reviewSchema} = require("../schema.js");
const {loggedcheck,isauthor} = require("../middleware.js");
const reviewcontroller = require("../controller/review.js");

// validation error function for review shchema
const validationreview=(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
};

router.delete("/:id/reviews/:reviewid",loggedcheck,isauthor,
    wrapAsync(reviewcontroller.destroyreview));


// Review comments part
router.post("/:id/review",validationreview, wrapAsync(reviewcontroller.reviewpost));

module.exports = router;