const mongoose = require("mongoose")

const archiveSchema = new mongoose.Schema({
    name: String,
    product_id: String,
    phone: String,
    type: String,
    price: String,
    color: String,
    service: String,
    address: String,
    status: String,
    advance: String,
    balance: String,
    date1: Date,
    date2: Date,
}, { timestamps: true })

module.exports.archiveModel = mongoose.model("archive", archiveSchema)