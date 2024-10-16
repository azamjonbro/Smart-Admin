const { default: mongoose } = require("mongoose");
const { companyModel } = require("../models");
const { newObject } = require("../utils/newobject");

module.exports.createCompany = () => {
    return async (event, args) => {
        try {
            await companyModel.create(args);
            return { status: 201, error: null };
        } catch (err) {
            return { status: 500, error: err.message, result: null }
        }
    }
}

module.exports.listCompany = () => {
    return async (event, args) => {
        try {
            return { status: 200, error: null, args: newObject(await companyModel.find()) };
        } catch (err) {
            return { status: 500, error: err.message, result: null }
        }
    }
}

module.exports.oneCompany = () => {
    return async (event, args) => {
        try {
            return { status: 200, error: null, args: newObject((await companyModel.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(args.id) }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: '_id',
                        foreignField: 'firma_id',
                        as: 'categories'
                    }
                }
            ]))[0]) };
        } catch (err) {
            return { status: 500, error: err.message, result: null }
        }
    }
}

module.exports.updateCompany = () => {
    return async (event, args) => {
        try {
            await companyModel.updateOne({ _id: args.id }, args)
            return { status: 201, error: null };
        } catch (err) {
            return { status: 500, error: err.message, result: null }
        }
    }
}

module.exports.deleteCompany = () => {
    return async (event, args) => {
        try {
            await companyModel.deleteOne({ _id: args.id })
            return { status: 201, error: null };
        } catch (err) {
            return { status: 500, error: err.message, result: null }
        }
    }
}