const mongoose = require("mongoose")

const invalidSchema = new mongoose.Schema({
    product_name: String,
    client_name: String,
    type: String,
    price: Number,
    workers: [{ type: mongoose.Schema.Types.ObjectId, ref: "worker" }],
})

module.exports.invalidModel = mongoose.model("invalid", invalidSchema)