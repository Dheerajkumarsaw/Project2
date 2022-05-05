const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const internSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    mobile: {
        type: String,
        required: true,
        minlength: 10, maxlength: 10,
        trim: true
    },
    collegeId: {
        type: ObjectId,
        required: true,
        ref: "College"
    },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model("internship", internSchema)