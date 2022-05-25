
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User"},
    event:{type: Schema.Types.ObjectId,  ref: "Event"},
    eventName:{type: String, ref: "Event"},
    eventCategory:{type: String, ref: "Event"},
    answer:{type:String, required: [true, "answer is required"]}
},
);

module.exports = mongoose.model("RSVP", rsvpSchema);
