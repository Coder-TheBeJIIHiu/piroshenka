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

const topCommand = async (bot) => {
    try {
        await bot.hears(/^\/(?:top|топ)|[A-Z]+$|^[a-z]+$/, async (ctx) => {
            const rows = await db.execute(`SELECT * FROM messages ORDER BY \`Like\` DESC LIMIT 10`);
            let message = `🔝 Топ-10 сообщений с самым большим количеством лайков:\n-------------------------------------\n`;

            for (let i = 0; i < rows.length; i++) {
                message += `:: ${i + 1}. "${rows[i].message}" - ${rows[i].Like} лайков\n`;
            }

            message += `-------------------------------------`;
            return await ctx.reply(message);
        });
    } catch (err) {
        console.error(err);
        ctx.reply(`❌ :: О, нет! Я получил ошибку:\n\n${err}`);
    }
}


module.exports = {
    startBasic,
    topCommand
}
