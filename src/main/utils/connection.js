const mongoose = require("mongoose");
const { DB_ADDRESS } = require("../module/config");

module.exports = async function () {
    if (mongoose.connection.readyState !== 1) {
        console.log(DB_ADDRESS)
        await mongoose.connect(DB_ADDRESS).then(() => {
            console.log("DB is successfully connected");
        }).catch((err) => {
            console.error("DB connection error:", err);
        });
    }
};
