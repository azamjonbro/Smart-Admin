const bcryptjs = require("bcryptjs");
const { adminModel } = require("../models");
const { newObject } = require("../utils/newobject");

module.exports.login = () => {
    return async (event, args) => {
        try {
            const { login, password } = args;

            if (!(login && password)) {
                return { status: 401, error: "Login and password is required", args: null }
            }

            const user = await adminModel.findOne({ login })
            if (user) {
                const isMatch = await bcryptjs.compare(password, user.password)
                if (!isMatch) { return { status: 401, error: "Login or password is wrong", args: null } }
                const args = newObject(user)
                delete args.password
                return { status: 200, error: null, args }
            }
            return { status: 401, error: "user is not exist with this id", args: null };
        } catch (err) {
            return { status: 500, error: err.message, result: null }
        }
    }
}

module.exports.updateUser = () => {
    return async (event, args) => {
        try {
            const { login, password, name, id } = args;

            const user = await adminModel.findOne({ _id: id })
            console.log(id, user)
            if (user) {
                const salt = await bcryptjs.genSalt(10);
                const newObject = {
                    login: login || user.login,
                    name: name || user.name,
                    password: password ? await bcryptjs.hash("sm@rt_l0g1n", salt) : user.password
                }
                await adminModel.updateOne({ _id: user._id }, newObject)
                return { status: 200, error: null };
            }
            return { status: 401, error: "user is not exist with this id", args: null };
        } catch (err) {
            return { status: 500, error: err.message, result: null }
        }
    }
}