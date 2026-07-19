if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expresserror.js");
const {listingSchema} = require("./schema.js");
const Review = require("./models/reviewa.js");
const {reviewSchema} = require("./schema.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listings = require("./routes/listing.js");
const reviews=require("./routes/review.js");
const userrouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("Error in Mongo Session Store", err);
});

const sessionoption = {
    store,
    secret: "mysupersecretecode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionoption)); 
app.use(flash());                

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser = req.user; 
    next();
})

main().then((res)=>{
    console.log("conected to database")
})
.catch(err=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views")); 
app.use(express.urlencoded({extended:true}));  
app.use(methodoverride("_method"));  
app.engine('ejs', ejsMate);     
app.use(express.static(path.join(__dirname,"public"))); 

app.use("/listing",listings);
app.use("/listing",reviews);
app.use("/",userrouter);

app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error.ejs", { status, message });
});

app.listen(8080,()=>{
    console.log("app is started ");
})