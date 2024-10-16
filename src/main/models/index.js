const { adminModel } = require("./admin")
const { archiveModel } = require("./archive")
const { categoryModel } = require("./category")
const { companyModel } = require("./company")
const { historyModel } = require("./history")
const { invalidModel } = require("./invalid")
const { leadModel } = require("./lead")
const { productModel } = require("./product")
const { workerModel } = require("./worker")

module.exports = Object.freeze({
    adminModel,
    archiveModel,
    productModel,
    leadModel,
    companyModel,
    workerModel,
    historyModel,
    categoryModel,
    invalidModel
})
