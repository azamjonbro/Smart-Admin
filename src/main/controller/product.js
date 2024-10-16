const { archiveModel } = require("../models/archive");
const { productModel, workerModel, historyModel, categoryModel } = require("../models");
const { newObject } = require("../utils/newobject");

module.exports.createProduct = () => {
    return async (event, args) => {
        try {
            await productModel.create(args);
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

module.exports.listProduct = () => {
    return async (event, args) => {
        try {
            return { status: 200, error: null, args: newObject(await productModel.find()) };
        } catch (err) {
            return { status: 500, error: err.message, result: null }
        }
    }
}

module.exports.oneProduct = () => {
    return async (event, args) => {
        try {
            return { status: 200, error: null, args: newObject(await productModel.findOne({ _id: args.id })) };
        } catch (err) {
            return { status: 500, error: err.message, result: null }
        }
    }
}

module.exports.home = () => {
  return async (event, args) => {
      try {
          const result = {
              year: { plus: 0, minus: 0, pending: 0 },
              month: { plus: 0, minus: 0, pending: 0 },
              today: { plus: 0, minus: 0, pending: 0 },
              qoldiq: 0
          }
          const today = new Date()
          const month = new Date()
          const year = new Date()
          today.setHours(0, 0, 0, 0)
          month.setDate(1)
          month.setHours(0, 0, 0, 0)
          year.setMonth(0)
          year.setDate(1)
          year.setHours(0, 0, 0, 0)

          const archives = await archiveModel.find()
          const products = await productModel.find()
          const category = await categoryModel.find({ summa: { $gt: 0 } }); 
          const worker = await historyModel.find({ status: "paid" })

          for (const { price, createdAt } of archives) {
              if (createdAt - today > 0) {
                  result.today.plus += Number(price) || 0
              }
              if (createdAt - month > 0) {
                  result.month.plus += Number(price) || 0
              }
              if (createdAt - year > 0) {
                  result.year.plus += Number(price) || 0
              }
          }
          
          for (const product of products) {
              if (product.createdAt - today > 0) {
                  result.today.plus += Number(product.advance) || 0
                  result.today.pending += Number(product.balance) || 0
              }
              if (product.createdAt - month > 0) {
                  result.month.plus += Number(product.advance) || 0
                  result.month.pending += Number(product.balance) || 0
              }
              if (product.createdAt - year > 0) {
                  result.year.plus += Number(product.advance) || 0
                  result.year.pending += Number(product.balance) || 0
              }
          }
          for (const { summa, createdAt } of category) {
              if (createdAt - today > 0) {
                  result.today.minus += Number(summa) || 0
              }
              if (createdAt - month > 0) {
                  result.month.minus += Number(summa) || 0
              }
              if (createdAt - year > 0) {
                  result.year.minus += Number(summa) || 0
              }
          }
          for (const { summa, createdAt } of worker) {
              if (createdAt - today > 0) {
                  result.today.minus += Number(summa) || 0
              }
              if (createdAt - month > 0) {
                  result.month.minus += Number(summa) || 0
              }
              if (createdAt - year > 0) {
                  result.year.minus += Number(summa) || 0
              }
          }
          result.qoldiq = Number(result.year.plus) - Number(result.year.minus);
          return { status: 200, error: null, args: result };
      } catch (err) {
          return { status: 500, error: err.message, result: null }
      }
  }
}

module.exports.updateProduct = () => {
    return async (event, args) => {
        try {
            const find = await productModel.findOne({ _id: args.id })
            if (!find) { return { status: 400, error: "Product not found" } }

            if (args.status == 'Заказ оплачен') {
                const findArchive = await archiveModel.findOne({ product_id: args.id })
                if (!findArchive) {
                    const newObj = newObject(find)
                    delete newObj._id
                    newObj.product_id = args.id
                    await archiveModel.create(newObj)

                    const workersList = await workerModel.find({ _id: { $in: find.workers } });
                    for (const worker of workersList) {
                        const summa = (find.price * worker.foiz) / 100;
                        await workerModel.updateOne({ _id: worker._id }, { summa: worker.summa + summa })
                        await historyModel.create({
                            foiz: worker.foiz,
                            worker_id: worker._id,
                            product_id: find._id,
                            summa: find.price,
                            status: "created",
                            worker_summa_old: worker.summa,
                            worker_summa_new: worker.summa + summa,
                        })
                    }
                }
                await productModel.deleteOne({ _id: args.id })
                return { status: 201, error: null };
            }

            await productModel.updateOne({ _id: args.id }, args)
            return { status: 201, error: null };
        } catch (err) {
            return { status: 500, error: err.message, result: null }
        }
    }
}

module.exports.deleteProduct = () => {
    return async (event, args) => {
        try {
            await productModel.deleteOne({ _id: args.id })
            return { status: 201, error: null };
        } catch (err) {
            return { status: 500, error: err.message, result: null }
        }
    }
}