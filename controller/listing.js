const Listing = require("../models/listing.js");

const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });

module.exports.listingcrete = async (req,res,next)=>{
   const alllistning =await Listing.find({});
   res.render("listing/index.ejs",{alllistning});
};

module.exports.listingshow = async (req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "review",
        populate: {
            path: "author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist");
        res.redirect("/listing"); 
    }
    // console.log(listing);
    res.render("listing/show.ejs",{listing});
};

module.exports.cretepostlisting = async (req,res,next)=>{
    let response = await geocodingClient.forwardGeocode({
        query:req.body.listing.location,
        limit:1
    })
    .send();

    let url = req.file.path;
    let filename = req.file.filename;    
    const newlisting = new Listing(req.body.listing);
        req.flash("success","New Listing");
        newlisting.owner = req.user._id;
        newlisting.image = {url,filename};
        newlisting.geometry = response.body.features[0].geometry;
        await newlisting.save();
        
       res.redirect("/listing");
 
};

module.exports.editlisting = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist");
        res.redirect("/listing"); 
    }
    let originalurl = listing.image.url;
    originalurl = originalurl.replace("/upload","/upload/h_200,w_250")
    res.render("listing/edit.ejs",{listing,originalurl});
};

module.exports.editputlisting = async (req, res, next) => {
    let { id } = req.params;
    let listing = req.body.listing;

    let updatelisting = await Listing.findByIdAndUpdate(id, listing);

    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;

        updatelisting.image = { url, filename };
        await updatelisting.save();
    }

    req.flash("success", "Listing updated");
    res.redirect(`/listing/${id}`);
};

module.exports.destoylisting=async(req,res,next)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listing");
};