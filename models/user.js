const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName:{type:String, required:[true, 'First name is required']},
    lastName:{type:String, required:[true, 'Last name is required']},
    email:{type:String, required:[true, 'Email is required'], unique:[true,'This email has already been used.']},
    password:{type:String, required:[true, 'Password is required'], minlength:[8,'Password must be at least 8 characters']}
});

userSchema.pre('save', function(next){
    let user = this;
    if (!user.isModified('password')){
        return next();
    }
    bcrypt.hash(user.password, 10)
    .then(hash =>{
        user.password = hash;
        next();
    })
    .catch(err => next(err));
});

userSchema.methods.comparePassword = function(inputPassword){
    let password = this.password;
    return bcrypt.compare(inputPassword, password);
}

module.exports = mongoose.model('User', userSchema);