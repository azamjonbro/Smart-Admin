const { invalidModel, historyModel, workerModel } = require("../models");
const { newObject } = require("../utils/newobject");

module.exports.createInvalid = () => {
    return async (event, args) => {
        try {
            for (const worker_id of (args.workers || [])) {
                const worker = await workerModel.findOne({ _id: worker_id })
                const numberOfWorkers = Object.keys(args.workers).length;
                const deduction = (args.price / numberOfWorkers);
                const summa = worker.summa - deduction;
                await historyModel.create({
                    foiz: worker.foiz,
                    worker_id,
                    status: "returned",
                    summa: args.price,
                    worker_summa_old: worker.summa,
                    worker_summa_new: summa
                })
                await workerModel.updateOne({ _id: worker_id }, { summa })
            }
            await invalidModel.create(args);
            return { status: 201, error: null };
        } catch (err) {
            return { status: 500, error: err.message, result: null }
        }
    }
}

module.exports.listInvalids = () => {
    return async (event, args) => {
        try {
            return { status: 200, error: null, args: newObject(await invalidModel.find().populate("workers").exec()) };
        } catch (err) {
            return { status: 500, error: err.message, result: null }
        }
    }
}