const Listing = require("../models/listing.js");
const Review = require("../models/reviewa.js");

module.exports.destroyreview = async(req,res)=>{
    let {id,reviewid}=req.params;
    
   await Listing.findByIdAndUpdate(id,{$pull:{review:reviewid}});
   const delted = await Review.findByIdAndDelete(reviewid);
   req.flash("success","review deleted");
   res.redirect(`/listing/${id}`);

};

module.exports.reviewpost = async (req, res) => {
    let listing = await Listing.findById(req.params.id);

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.review.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","review updated");
    res.redirect(`/listing/${listing._id}`);
};