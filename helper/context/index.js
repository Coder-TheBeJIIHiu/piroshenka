const { startBasic, topCommand } = require('./basic.js')
const { startMajor } = require('./onMessage.js')

class ContextManager {
    constructor(bot) {
      this.bot = bot;
    }
  
    async load() {
        try {
            await startBasic(this.bot)
            //await topCommand(this.bot)
            await startMajor(this.bot)
        } catch (err) {
            console.error(err)
            // обработка ошибки
        }
    }
}
  
module.exports = ContextManager;
