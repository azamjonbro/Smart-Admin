const mongoose = require("mongoose")

const leadSchema = new mongoose.Schema({
    name: String,
    phone: String,
    service: String,
    status: String,
    description: String,
    consultation: Boolean,
})

module.exports.leadModel = mongoose.model("lead", leadSchema)