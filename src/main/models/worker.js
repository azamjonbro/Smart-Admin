const mongoose = require("mongoose")

const workerSchema = new mongoose.Schema({
    name: String,
    foiz: String,
    summa: { type: Number, default: 0 },
})

module.exports.workerModel = mongoose.model("worker", workerSchema)