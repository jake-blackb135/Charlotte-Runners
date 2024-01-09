const model = require('../models/event');
const user = require('../models/user');
const rsvp = require('../models/rsvp');
exports.index = (req, res, next)=>{
    model.find()
        .then(events => {
            res.render('./events/index', { events });
        })
        .catch(err => next(err));
    
}

exports.show = (req, res) =>{
    let id = req.params.id;
    model.findById(id).populate('hostname', 'firstName lastName')
    .then((event)=>{
        if (event){ 
            rsvp.find({event:id, status:'yes'})
            .then(rsvps =>{
                res.render('./events/event', {event, rsvps});
            })
            .catch(err => next(err));
              
        } else{
            let err = new Error('Cannot find event with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    
}

exports.new = (req, res) =>{
    res.render('events/newEvent');
}

exports.create = ( req, res, next) =>{
    let event = new model(req.body); 
    event.hostname = req.session.user;   
    if (req.file){
        event.Image = '/images/'+req.file.filename;
    }
    
    event.save()
    .then(()=>{  
        req.flash('success','successfully created New event');
        res.redirect('/events');
    })
    .catch(err=>{
        if (err.name==="ValidationError"){
            err.status=400;
        }
        next(err);
    });
    
    
}


exports.edit = (req,res,next) =>{
    let id= req.params.id;

    model.findById(id)
    .then((event)=>{
        if (event){   
            res.render('./events/edit', {event});       
        } else {
            let err = new Error('Can\'t find event with id '+ id);
            err.status = 404;
            next(err);
        }}) 
    .catch((err)=>next(err));  
}


exports.update = (req,res,next) =>{
    let id = req.params.id;
    let event = req.body;
    event.hostname = req.session.user;
    if (req.file){
        event.Image = '/images/'+req.file.filename;
    }
    
    model.findByIdAndUpdate(id,event,{useFindAndModify:false, runValidators:true})
    .then((event)=>{
        if (event){
            req.flash('success','successfully edited event');
            res.redirect('/events/' + id);
        } else {
            let err = new Error('Can\'t find event with id ' + id);
            err.status=404;
            next(err);
        }
    })
    .catch(err=>next(err));
}

exports.delete = (req,res,next) =>{
    let id= req.params.id;
    model.findByIdAndDelete(id)
    .then((event)=>{
        if (event){
            rsvp.deleteMany({event:event._id})
            .then(()=>{
                req.flash('success','successfully deleted event');
                res.redirect('/events');
            })
            .catch(err=>next(err));
            
        } else {
            let err = new Error('Can\'t find event with id ' + id);
            err.status=404;
            next(err);
        } 
    })
    .catch(err=>next(err));
}

exports.rsvp = (req,res,next) =>{
    let newStatus = req.body.status;
    let newEvent = req.params.id;
    let newUser = req.session.user;

    let newRsvp = new rsvp({
        newUser,
        newEvent,
        newStatus
    });
    
    if (newStatus != 'yes' && newStatus != 'no' && newStatus != 'maybe'){
        let err = new Error('Status must be "yes", "no", or "maybe"');
        err.status = 401;
        next(err);
    }
    
    rsvp.findOneAndUpdate(
        {
            $and:[
                {event: newEvent},
                {user: newUser}
            ]
            
        },
        {$set: {status:newStatus}},
        {upsert:true}
        
    )
    .then((rsvp)=>{
        req.flash('success', 'You\'ve indicated your interest');
        res.redirect('/events/' + newEvent);
    })
    .catch(err =>{
        if (err.name ==="ValidationError"){
            err.status = 401;
        }
        next(err);
    });

    
}
