const registration = require('../registration.js')

module.exports = async (ctx, next) => {
    await registration(ctx, next)
}