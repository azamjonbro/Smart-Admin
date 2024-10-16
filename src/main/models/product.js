const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: String,
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
    workers: [{ type: mongoose.Schema.Types.ObjectId, ref: "worker" }]
}, { timestamps: true })

module.exports.productModel = mongoose.model("product", productSchema)