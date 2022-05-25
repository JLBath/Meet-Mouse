const {validationResult} = require("express-validator");
const model = require('../models/user');
const event = require('../models/event');
const rsvpmodel = require('../models/rsvp');

exports.new = (req, res)=>{
        return res.render('./user/new');
};

exports.create = (req, res, next)=>{
    let user = new model(req.body);
    if(user.email){
        user.email = user.email.toLowerCase();
    }
    user.save()
    .then(user=> {
        req.flash('success', 'Registration succeeded!');
        res.redirect('/users/login');
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('back');
        }

        if(err.code === 11000) {
            req.flash('error', 'Email has been used');  
            return res.redirect('back');
        }
        next(err);
    }); 
    
};

exports.getUserLogin = (req, res, next) => {
        return res.render('./user/login');
}

exports.login = (req, res, next)=>{
    let email = req.body.email;
    if(email){
        email = email.toLowerCase();
    }
    let password = req.body.password;
    model.findOne({ email: email })
    .then(user => {
        if (!user) {
            req.flash('error', 'Wrong email address');  
            res.redirect('/users/login');
            } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/users/profile');
            } else {
                req.flash('error', 'Wrong password');      
                res.redirect('/users/login');
            }
            });     
        }     
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;
    Promise.all([model.findById(id), event.find({host: id}), rsvpmodel.find({user: id})])
    .then(results=>{
        const [user, events, rsvp] = results;
        res.render('./user/profile', {user, events, rsvp});
    })
    .catch(err=>next(err));
};


exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
   
 };



 exports.cancelRSVP = (req, res, next) =>{
     let id = req.session.user;
     let event = req.params.id;
     rsvpmodel.findOneAndDelete({user: id, event: event})
     .then(rsvp=>{
         if(rsvp){
             req.flash("success", "RSVP cancelled");
             res.redirect("/users/profile");
         } else {
             let err= new Error("RSVP not found");
             err.status = 404;
             next(err)
         }
     })
     .catch(err=>next(err));
 }

