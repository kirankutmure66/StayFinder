const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {loggedcheck,saveRedirectUrl}= require("../middleware.js");
const usercontroller = require("../controller/user.js");

router
    .route("/signup")
    .get(usercontroller.signupform)
    .post(wrapAsync(usercontroller.newuser));


router
    .route("/login")
     // for login
    .get(usercontroller.loginform)
    .post(saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),usercontroller.loginpost);

// for logout
router.get("/logout",usercontroller.logoutaction);
module.exports=router;