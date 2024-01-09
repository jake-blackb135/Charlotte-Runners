const Event = require('../models/event');

exports.isGuest = (req,res,next)=>{
    if (!req.session.user){
        return next();
    } else{
        req.flash('error', 'You\'re already logged in.');
        res.redirect('/users/profile');
    }
}

exports.isLoggedIn = (req,res,next)=>{
    if (req.session.user){
        return next();
    } else{
        req.flash('error','You need to log in first.');
        res.redirect('/users/login');
    }
}

exports.isAuthor = (req,res,next)=>{
    let id = req.params.id;
    Event.findById(id)
    .then(event=>{
        if (event){
            if (req.session.user == event.hostname){
                return next();
            } else{
                let err = new Error('Unauthorized to access the resource');
                err.status=401;
                return next(err);
            }
        } else{
            let err = new Error('Cannot find an event with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
}

exports.notHost = (req,res,next) =>{
    let id = req.params.id;
    Event.findById(id)
    .then(event=>{
        if (event){
            if (req.session.user == event.hostname){
                let err = new Error('Unauthorized to access the resource');
                err.status=401;
                return next(err);
            } else{
                return next();
            }
        } else{
            let err = new Error('Cannot find an event with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
}