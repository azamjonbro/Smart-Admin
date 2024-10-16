const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    name: String,
    password: String,
    login: { type: String, unique: true },
})

module.exports.adminModel = mongoose.model("admin", adminSchema)