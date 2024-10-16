const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    name: String,
    firma_id: { type: mongoose.Schema.Types.ObjectId, ref: "company" },
    summa: { type: Number, default: 0 },
}, { timestamps: true })

module.exports.categoryModel = mongoose.model("category", categorySchema)