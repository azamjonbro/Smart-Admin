const { archiveModel } = require("../models/archive");
const { workerModel, historyModel } = require("../models");
const { newObject } = require("../utils/newobject");
const { default: mongoose } = require("mongoose");

module.exports.createWorker = () => {
    return async (event, args) => {
        try {
            await workerModel.create(args);
            return { status: 201, error: null };
        } catch (err) {
            return { status: 500, error: err.message, result: null }
        }
    }
}

module.exports.listArchives = () => {
    return async (event, args) => {
        try {
            return { status: 200, error: null, args: newObject(await archiveModel.find()) };
        } catch (err) {
            return { status: 500, error: err.message, result: null }
        }
    }
}

module.exports.listWorker = () => {
    return async (event, args) => {
        try {
            return { status: 200, error: null, args: newObject(await workerModel.find()) };
        } catch (err) {
            return { status: 500, error: err.message, result: null }
        }
    }
}
module.exports.oneWorker = () => {
    return async (event, args) => {
        try {
            const find = newObject(await workerModel.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(args.id) }
                },
                {
                    $lookup: {
                        from: 'histories',
                        localField: '_id',
                        foreignField: 'worker_id',
                        as: 'histories'
                    }
                }
            ]))
            return { status: 200, error: null, args: find[0] };
        } catch (err) {
            return { status: 500, error: err.message, result: null }
        }
    }
}


module.exports.updateWorker = () => {
    return async (event, args) => {
        try {
            const find = await workerModel.findOne({ _id: args.id })
            if (!find) { return { status: 400, error: "Worker not found" } }

            if (args.status == 'archive') {
                const findArchive = await archiveModel.findOne({ Worker_id: args.id })
                if (!findArchive) {
                    const newObj = newObject(find)
                    delete newObj._id
                    newObj.Worker_id = args.id
                    await archiveModel.create(newObj)
                }
            }

            if(args.status == "paid") {
                await historyModel.create({
                    worker_id: args.id,
                    status: "paid",
                    summa: args.summa,
                })
            }
            await workerModel.updateOne({ _id: args.id }, args)
            return { status: 201, error: null };
        } catch (err) {
            return { status: 500, error: err.message, result: null }
        }
    }
}

module.exports.deleteWorker = () => {
    return async (event, args) => {
        try {
            await workerModel.deleteOne({ _id: args.id })
            return { status: 201, error: null };
        } catch (err) {
            return { status: 500, error: err.message, result: null }
        }
    }
}