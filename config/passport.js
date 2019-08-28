const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user,done) {
    done(null,user.id);
});


passport.deserializeUser(function (id,done) {
    User.findById(id,function (err,user) {
        done(err,user);
    })
});


passport.use('local.signup',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
}, function (req,email,password,done) {
    req.checkBody('email',  email+' is an Invalid email').notEmpty().isEmail();
    req.checkBody('password',  'Invalid password').notEmpty().isLength({min:3});
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null,false, req.flash('error', messages))
    }
    User.findOne({'email':email}, function (err,user) {
       if(err){
           return done(err);
       }
       if(user){
           return done(null, false, {message:'Email already in use.'})
       }
       var newUser = new User();
       newUser.email = email;
       //have tom encrypt the password
        newUser.password =password;
        newUser.save(function (err, result) {
            if(err){
                return done(err)
            }
            return done(null, newUser);
        })
    });
}));


passport.use('local.signin', new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
}, function (req, email,password,done) {
    req.checkBody('email',  email+' is an Invalid email').notEmpty().isEmail();
    req.checkBody('password',  'Invalid password').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null,false, req.flash('error', messages))
    }
    User.findOne({'email':email}, function (err,user) {
        if(err){
            return done(err);
        }
        if(!user){
            return done(null, false, {message:'No existing user account!'});
        }
        if(!password){
            return done(null, false, {message:'Wrong password!'});
        };
       return done(null,user);
    });

}));