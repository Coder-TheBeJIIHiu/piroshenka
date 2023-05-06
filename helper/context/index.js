const { startBasic, activateCommand, joinEvent, kickEvent } = require('./basic.js')
const { startMajor } = require('./onMessage.js')

class ContextManager {
    constructor(bot) {
      this.bot = bot;
    }
  
    async load() {
        try {
            await startBasic(this.bot)
            await activateCommand(this.bot)
            await joinEvent(this.bot)
            await kickEvent(this.bot)
            await startMajor(this.bot)
        } catch (err) {
            console.error(err)
            // обработка ошибки
        }
    }
}
  
module.exports = ContextManager;
