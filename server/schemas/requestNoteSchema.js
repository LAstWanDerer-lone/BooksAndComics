const { ObjectID } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestNoteSchema = new Schema({
    userId: {type: ObjectID, required: true},
    courseName: {type: String, required: true},
    semester: {type: String, required: true},
    subjectName: {type: String, required: true, unique: true},
    fileName: {type: String, required: true, unique: true},
    status: {type: Boolean, default: false}
},{collection: "requests"});

const RequestNote = mongoose.model('RequestNote', requestNoteSchema);

module.exports = RequestNote;