const StageManager = require('../stage.js')
const userMiddleware = require('./user.js')

class LoadMiddlewares {
    constructor(bot, session) {
        this.bot = bot;
        this.session = session;
    }

    async load() {
        try {
            const stageManager = new StageManager()
            this.bot.use(this.session(), stageManager.load(), userMiddleware)
        } catch (err) {
            console.error(err)
            // обработка ошибки
        }
    }
}

module.exports = LoadMiddlewares;
