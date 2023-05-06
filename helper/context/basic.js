const db = require("../../utils/db")
const registration = require('../registration.js')

const startBasic = async (bot) => {
    try {
        await bot.start(async (ctx, next) => {
            await registration(ctx, next)
        })
    } catch (err) {
        console.error(err)
		ctx.reply(`❌ :: О, нет! Я получил ошибку:\n\n${err}`)
    }
}

const activateCommand = async (bot) => {
    try {
        await bot.command('activate', async (ctx) => {   
            const chatId = ctx.chat.id;
            const row = await db.execute(`SELECT * FROM chats WHERE chat_id = ?`, [chatId])
            if (row[0].activated === 1) return ctx.reply(`❌ :: Группа уже активирована!`);
            await ctx.reply(`⏳ :: Активирую... Пожалуйста подождите...`)
            const startTime = Date.now()
            await db.execute(`UPDATE chats SET activated = ? WHERE chat_id = ?`, [true, chatId])
            const endTime = Date.now()
            await ctx.reply(`✅ :: Группа успешно активирована за ${endTime - startTime} мс.`)
        });
    } catch (err) {
        console.error(err);
        ctx.reply(`❌ :: О, нет! Я получил ошибку:\n\n${err}`);
    }
}

const joinEvent = async (bot) => {
    try {
        await bot.on('new_chat_members', async (ctx) => {
            const chatId = ctx.chat.id;
            const botId = ctx.botInfo.id;
            const newMember = ctx.message.new_chat_member;
            if (newMember.id === botId) {
                const row = await db.execute(`SELECT * FROM chats WHERE chat_id = ?`, [chatId])
                if (row.length === 0) {
                    await ctx.reply(`⏳ :: Добавляю эту группу в базу данных.`)
                    const startTime = Date.now()
                    await db.execute(`INSERT INTO chats(chat_id, created_at) VALUES (?, ?)`, [chatId, Date.now()])
                    const endTime = Date.now()
                    await ctx.reply(`✅ :: Отлично, группа успешно добавлена в базу данных за ${endTime - startTime} мс.`)
                    return ctx.reply(`🧁 :: Напишите /activate чтобы бот начал работать!`)
                }
            }
        })
    } catch (err) {
        console.error(err);
        ctx.reply(`❌ :: О, нет! Я получил ошибку:\n\n${err}`);
    }
}

const kickEvent = async (bot) => {
    try {
      await bot.on('left_chat_member', async (ctx) => {
        const chatId = ctx.chat.id;
        const botId = ctx.botInfo.id;
        const kickedMember = ctx.message.left_chat_member;
        if (kickedMember.id === botId) {
          const row = await db.execute(`SELECT * FROM chats WHERE chat_id = ?`, [chatId])
          if (row.length !== 0) {
            return db.execute(`DELETE FROM chats WHERE chat_id = ?`, [chatId])
          }
        }
      });
    } catch (err) {
      console.error(err);
      ctx.reply(`❌ :: О, нет! Я получил ошибку:\n\n${err}`);
    }
  }
  


module.exports = {
    startBasic,
    activateCommand,
    joinEvent,
    kickEvent
}
