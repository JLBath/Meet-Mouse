
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {type: String, required: [true, "Title is required"]},
    image: {type: String},
    host: {type: Schema.Types.ObjectId, ref: "User"},
    date:{type: String, require:[true, "Date is required"]},
    startTime:{type: String, require:[true, "Start time is required"]},
    endTime:{type: String, require:[true, "End time is required"]},
    location:{type: String, require:[true, "Location is required"]},
    description: {type: String, required: [true, "Description is required"]},
    category:{type: String, required: [true, "Category is required"]}
},
);

module.exports = mongoose.model("Event", eventSchema);
