const bcryptjs = require('bcryptjs')
const { adminModel } = require('../models')

module.exports = async () => {
    try {
        const find = await adminModel.findOne()
        if (!find) {
            const salt = await bcryptjs.genSalt(10);
            await adminModel.create({
                name: "Админ",
                login: 'admin',
                password: await bcryptjs.hash("p@ssw0rd", salt),
            })
            console.log('Create Super User...')
        } else {
            console.log('SuperAdmin mavjud...')
        }
    } catch (error) {
        console.log(error)
    }
}
