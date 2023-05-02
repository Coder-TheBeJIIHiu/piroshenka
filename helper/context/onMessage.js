const message = require('./algorithm/index.js');
const db = require('../../utils/db.js');

const startMajor = async (bot) => {
  bot.on('text', async (ctx) => {
    if (ctx.chat.type === 'private') return await ctx.reply(`📝✨ :: Добавьте меня в группу и напишите что-нибудь - я с удовольствием начну обучение и общение с вами!`)
    const regex = /(https?:\/\/(?:www\.|(?!www))[^\s.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
    if (regex.test(ctx.message.text)) {
        const row = await db.execute('SELECT * FROM users WHERE telegram_id = ?;', [ctx.message?.from?.id]);
        await db.execute(`UPDATE users SET urls = ? WHERE uuid = ?`, [row[0].urls + 1, row[0].uuid])
        return await ctx.replyWithHTML(`😒 :: <a href="tg://user?id=${ctx.message.from.id}">${ctx.message.from.first_name}</a>, Ссылки запрещены!`)
    }
    await message(ctx);
  });

  bot.on('callback_query', async (ctx) => {
    const action = ctx.update.callback_query?.data?.split('_');
    const row = await db.execute('SELECT * FROM messages WHERE uuid = ?;', [action[1]]);

    if (row.length === 0) return;
    
    await db.execute(`UPDATE messages SET \`Like\` = ? WHERE uuid = ?;`, [row[0].Like + 1, row[0].uuid]);
    const aliases = JSON.parse(row[0].aliases);
    if (!aliases.includes(action[2])) {
        aliases.push(action[2]);
        await db.execute(`UPDATE messages SET aliases = ? WHERE uuid = ?`, [JSON.stringify(aliases), row[0].uuid]);
    }
    await ctx.replyWithHTML(`✅ :: <a href="tg://user?id=${ctx.update.callback_query.from.id}">${ctx.update.callback_query.from.first_name}</a>, Спасибо за поддержку!`);
  });
};

module.exports = {
  startMajor,
};
