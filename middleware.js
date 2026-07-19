const Listing = require("./models/listing.js");
const Review = require("./models/reviewa.js");
const loggedcheck = (req,res,next)=>{
    if(!req.isAuthenticated()){
        console.log(req);
        req.session.redirecturl = req.originalUrl;
        req.flash("error","you must logged in");
        return res.redirect("/login");
    }
    next();
}

const saveRedirectUrl = (req, res, next) => {
    if (req.session.redirecturl) {
        res.locals.redirectUrl = req.session.redirecturl;
    }
    next();
};

const isowner = async (req, res, next) => {
    let { id } = req.params;
    let checking = await Listing.findById(id);

    if (!checking.owner.equals(req.user._id)) {
        req.flash("error", "You don't have access to edit");
        return res.redirect(`/listing/${id}`);
    }

    next();
};
const isauthor = async (req,res,next)=>{
    let {id,reviewid} = req.params;
    let review = await Review.findById(reviewid);
    if(!review.author.equals(res.locals.curruser._id)){
        req.flash("error","you are not author");
        return res.redirect(`/listing/${id}`);
    }
    next();
}
module.exports = {
    loggedcheck,
    saveRedirectUrl,
    isowner,
    isauthor
};
