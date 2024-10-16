const mongoose = require("mongoose")

const companySchema = new mongoose.Schema({
    name: String,
    username: String,
    manager: String,
    phone_username: String,
    phone_manager: String,
    status: String,
    address: String,
    tax_phone: String,
    email: String,
    date: Date,
    summa: { type: Number, default: 0 },
})

module.exports.companyModel = mongoose.model("company", companySchema)