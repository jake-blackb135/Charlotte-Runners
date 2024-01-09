const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema(
    {
        user: {type: Schema.Types.ObjectId, ref: 'User', required:[true,'rsvp must have a user']},
        event: {type:Schema.Types.ObjectId, ref: 'Event', required:[true,'rsvp must have an event']},
        status: {type:String, required: [true, 'You must make a selection']},
    }
);

module.exports = mongoose.model('rsvp', rsvpSchema);