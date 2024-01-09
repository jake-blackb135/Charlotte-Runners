const {body} = require('express-validator');
const {validationResult} = require('express-validator');
const validator = require('validator');

exports.validateId = (req,res,next) =>{
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid event Id');
        err.status = 400;
        return next(err);
    }
    return next();
}

exports.validateSignUp = 
    [
        body('firstName', 'first name cannot be empty').notEmpty().trim().escape(), 
        body('lastName', 'last name cannot be empty').notEmpty().trim().escape(), 
        body('email', 'Email must be a valid address').isEmail().trim().escape().normalizeEmail(),
        body('password', 'Password must be between 8 and 64 characters').isLength({min:8, max:64}).trim()];
 
exports.validateLogin = 
    [
        body('email', 'Email must be a valid address').isEmail().trim().escape().normalizeEmail(),
        body('password', 'Password must be between 8 and 64 characters').isLength({min:8, max:64}).trim()];
    


exports.validateEvent = 
    [
        body('category', 'category cannot be empty').notEmpty().trim().escape()
        .custom((value)=>{
            if (!validator.isIn(value,['Races','Training buddy'])){
                throw new Error('Invalid category. Must be "Races" or "Training buddy"');
            }
            return true;
        }),
        body('title', 'Title Cannot be empty').notEmpty().trim().escape(),
        body('details', 'event contents must be at least 10 characters').isLength({min:10}).trim().escape(),
        body('start', 'You must include a start date').notEmpty().trim().escape(),
        body('start','start field must have valid date').isISO8601(),
        body('start','start date cannot be in the past').custom((value)=>{
            if (!validator.isAfter(value)){
                return false;
            }
            return true;
        }),
        body('end', 'You must include a end date').notEmpty().trim().escape(),
        body('end','end field must have valid date').isISO8601(),
        body('end','Event end date must be after the start date').custom((value, {req})=>{
            let start = Date.parse(req.body.start);
            let compare = Date.parse(value) - start;
            if (compare < 0){
                return false;
            }
            return true;
        }),
        body('image','You must include an event image').trim().escape()
    ];

exports.validateRsvp = [
    body('user', 'RSVP must have a user').notEmpty().trim().escape(),
    body('event', 'RSVP must have an event').notEmpty().trim().escape(),
    body('status', 'RSVP must have a status').notEmpty().trim().escape()
    .custom((value)=>{ 
        if (!validator.isIn(value,['yes','no','maybe'])){
            throw new Error('Invalid status. rsvp status must be "yes" "no" or "maybe"');
        }
        return true;
    })
];
    

exports.validateResult = (req,res,next) =>{
    
    let errors = validationResult(req);
    if (!errors.isEmpty()){
        errors.array().forEach(error =>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else{
        return next();
    }
}



