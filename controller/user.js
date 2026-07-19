const User = require("../models/user.js");

module.exports.signupform = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.newuser = async (req,res,next)=>{
    try{
      let{username,email,password} = req.body;
    const newuser = new User({email,username});
   const rejistereduser = await User.register(newuser,password);


   req.login(rejistereduser,(err)=>{
    if(err){
       return next(err);
      }
     req.flash("success","welcome to wandor Lust Signed in");
     res.redirect("/listing");
     })
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

module.exports.loginform =(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.loginpost=async (req,res)=>{
   let redirectUrl = res.locals.redirectUrl || "/listing";
        delete req.session.redirecturl;

        res.redirect(redirectUrl);
};

module.exports.logoutaction = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
          return next(err);  
        }
        req.flash("success","you are succefully logged out");
        res.redirect("/listing");
    });
};