const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    subjectName: {type: String, required: true, unique: true},
    fileName: {type: String, required: true, unique: true}
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;