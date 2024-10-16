const { categoryModel, companyModel } = require("../models");
const { newObject } = require("../utils/newobject");

module.exports.createCategory = () => {
  return async (event, args) => {
    try {
      await categoryModel.create(args);
      return { status: 201, error: null };
    } catch (err) {
      return { status: 500, error: err.message, result: null };
    }
  };
};

module.exports.listCategory = () => {
  return async (event, args) => {
    try {
      return {
        status: 200,
        error: null,
        args: newObject(await categoryModel.find()),
      };
    } catch (err) {
      return { status: 500, error: err.message, result: null };
    }
  };
};

module.exports.oneCategory = () => {
  return async (event, args) => {
    try {
      return {
        status: 200,
        error: null,
        args: newObject(await categoryModel.findOne({ _id: args.id })),
      };
    } catch (err) {
      return { status: 500, error: err.message, result: null };
    }
  };
};

module.exports.updateCategory = () => {
  return async (event, args) => {
    try {
      const { add, firma_summa, id, firma_id } = args;

      // Check if 'add' is provided and is a boolean value
      if (add === undefined || ![true, false].includes(add)) {
        return {
          status: 400,
          error: true,
          message: "Add degan keyda boolean bering...",
        };
      }

      // Find the category based on its id
      const findCategory = await categoryModel.findOne({ _id: id });
      if (!findCategory) {
        return { status: 404, error: true, message: "Category topilmadi..." };
      }
      if (firma_summa !== undefined && firma_summa !== null) {
        const findCompany = await companyModel.findOne({ _id: firma_id });
        if (!findCompany) {
          return { status: 404, error: true, message: "Firma topilmadi..." };
        }

        // Update company's summa based on the 'add' flag
        if (add) {
          await companyModel.updateOne(
            { _id: findCompany._id },
            { summa: Number(findCompany.summa) + Number(firma_summa) }
          );
        } else {
          await companyModel.updateOne(
            { _id: findCompany._id },
            { summa: Number(findCompany.summa) - Number(firma_summa) }
          );
        }
      }

      // Update the category with the updated values
      await categoryModel.updateOne({ _id: id }, { $set: args });

      return { status: 201, error: null };
    } catch (err) {
      return { status: 500, error: err.message, result: null };
    }
  };
};

module.exports.deleteCategory = () => {
  return async (event, args) => {
    try {
      await categoryModel.deleteOne({ _id: args.id });
      return { status: 201, error: null };
    } catch (err) {
      return { status: 500, error: err.message, result: null };
    }
  };
};
