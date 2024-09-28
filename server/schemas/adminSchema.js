const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
}, {collection: "admin"});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;