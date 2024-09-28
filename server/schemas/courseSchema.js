const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let courseCollections = {};

const courseSchema = new Schema({
    semester: {type: String, required: true, unique: true},
    notes: {type: Array, required: true}
}, {autoIndex: false});

const Course = (collectionName) => {
    if(!(collectionName in courseCollections)) {
        courseCollections[collectionName] = mongoose.connection.model(collectionName, courseSchema, collectionName);
    }
    return courseCollections[collectionName];
}

module.exports = Course;