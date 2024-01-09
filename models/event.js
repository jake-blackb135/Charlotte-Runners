const { DateTime } = require('luxon');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema(
    
    {
    category: {type: String, required: [true,"Category is required."]},
    title: {type: String, required: [true,"Title is required."]},
    hostname: {type: Schema.Types.ObjectId, ref: 'User', required: [true,'Host name is required']},
    start: {type:Date, required: [true, "Start date is required"]},
    end: {type:Date, required: [true, "End date is required"]},
    details: {type: String, required: [true,"Event details are required"], minlength: [10, "Event details must be at least 10 characters."]},
    Image: {type: String, required: [true, "Your event must have an image."]},
},

{timestamps:true}
);



module.exports = mongoose.model('Event', eventSchema);
