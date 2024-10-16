const mongoose = require("mongoose")

const historySchema = new mongoose.Schema({
    foiz: String,
    worker_id: { type: mongoose.Schema.Types.ObjectId, ref: "worker" },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    summa: String,
    status: String,
    worker_summa_old: String,
    worker_summa_new: String,
}, { timestamps: true })

module.exports.historyModel = mongoose.model("history", historySchema)