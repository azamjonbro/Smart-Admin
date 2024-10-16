const { leadModel } = require("../models");
const { newObject } = require("../utils/newobject");

module.exports.createLead = () => {
    return async (event, args) => {
        try {
            await leadModel.create(args);
            return { status: 201, error: null };
        } catch (err) {
            return { status: 500, error: err.message, result: null }
        }
    }
}

module.exports.listLead = () => {
    return async (event, args) => {
        try {
            return { status: 200, error: null, args: newObject(await leadModel.find()) };
        } catch (err) {
            return { status: 500, error: err.message, result: null }
        }
    }
}

module.exports.oneLead = () => {
    return async (event, args) => {
        try {
            return { status: 200, error: null, args: newObject(await leadModel.findOne({ _id: args.id })) };
        } catch (err) {
            return { status: 500, error: err.message, result: null }
        }
    }
}

module.exports.updateLead = () => {
    return async (event, args) => {
        try {
            await leadModel.updateOne({ _id: args.id }, args)
            return { status: 201, error: null };
        } catch (err) {
            return { status: 500, error: err.message, result: null }
        }
    }
}

module.exports.deleteLead = () => {
    return async (event, args) => {
        try {
            await leadModel.deleteOne({ _id: args.id })
            return { status: 201, error: null };
        } catch (err) {
            return { status: 500, error: err.message, result: null }
        }
    }
}