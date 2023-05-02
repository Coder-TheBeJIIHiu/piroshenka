require('dotenv').config()

const { Telegraf, session } = require('telegraf');
const express = require('express')
const LoadMiddlewares = require('./helper/middlewares/index.js');
const ContextManager = require('./helper/context/index.js')
const db = require('./utils/db.js')
const bot = new Telegraf(process.env.BOT_TOKEN);
const middleware = new LoadMiddlewares(bot, session);
const context = new ContextManager(bot);
const app = express()

middleware.load().then(async () => {
    console.log('Бот запущен!')
    await context.load()
    await bot.launch();
    await updateMessages();
    app.listen(3000)
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateMessages() {
    while (true) {
      const messages = await db.execute(`SELECT * FROM messages`);
      console.log(messages);
      await sleep(2000);
    }
  }
  