const express = require("express");
const Listing = require("../models/listing.js");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expresserror.js");
const {listingSchema} = require("../schema.js");
const {loggedcheck,isowner} = require("../middleware.js");
const render = require("../controller/listing.js"); // for controller
const multer  = require('multer')
const{storage} = require("../cloudconfig.js");
const upload = multer({ storage })

// validation error function for crete listing
const validationlisting=(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
};

router
    .route("/")
    // create post request
   .post(loggedcheck,validationlisting,upload.single('listing[image]'),
    wrapAsync(render.cretepostlisting))
    // Index Route
   .get(wrapAsync(render.listingcrete));
   
   // crete route
router.get("/new",loggedcheck,(req,res)=>{
    res.render("listing/new.ejs");
})

router
    .route("/:id")
// Delete route
    .delete(loggedcheck,wrapAsync(render.destoylisting))
// Edit Put Route
    .put(loggedcheck,isowner,upload.single('listing[image]'),validationlisting,wrapAsync(render.editputlisting))
// Show Route
    .get(wrapAsync(render.listingshow));

// Edit Route
router.get("/:id/edit",loggedcheck,wrapAsync(render.editlisting));

module.exports = router;