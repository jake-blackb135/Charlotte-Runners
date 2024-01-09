const model = require('../models/user');
const events = require('../models/event');
const rsvp = require('../models/rsvp');

exports.new = ((req,res,next)=> {
    res.render('./user/new.ejs')
});

exports.create = ((req,res,next)=>{
    let user = new model(req.body);
    user.save()
    .then(user => {
        res.redirect('/users/login');
    })
    .catch(err =>{
        if (err.name ==="ValidationError"){
            req.flash('error', err.message);
            return res.redirect('/users/new');
        }
        if (err.code === 11000){
            req.flash('error', 'Email has been used.');
            return res.redirect('/users/new');
        }
        return next(err);
    });
});

exports.getLogin = ((req,res,next) =>{
    res.render('./user/login.ejs');
});

exports.login = ((req,res,next)=>{
    let email = req.body.email;
    let password = req.body.password;
    model.findOne({email:email})
    .then(user=>{
        if (!user){
            req.flash('error', 'Wrong email address');
            res.redirect('/users/login');
        }else{
            user.comparePassword(password)
            .then(result =>{
                if (result){
                    req.session.user = user._id;
                    req.session.userName = user.firstName;
                    req.flash('success','You\'ve successfully logged in.');
                    res.redirect('/users/profile');
                } else{
                    req.flash('error', 'Incorrect password');
                    res.redirect('/users/login');
                }
            });
        }
    });
});

exports.profile = ((req,res,next)=>{
    let id = req.session.user;
    model.findById(id)
    .then(user =>{ 
        events.find({hostname:user._id})
        .then(userEvents=>{ 
            rsvp.find({user:id}).populate('event','title')
            .then(rsvps =>{
                res.render('./user/profile', {user, userEvents, rsvps}); 
            })
            .catch(err=> next(err));
            
        })
        
    })
    
    .catch(err =>next(err));
});

exports.logout = ((req,res,next)=>{
    req.session.destroy(err=>{
        if (err){
            return next(err);
        } else {
            res.redirect('/');
        }
    });
});