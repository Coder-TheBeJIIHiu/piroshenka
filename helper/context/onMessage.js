const message = require('./algorithm/index.js');
const db = require('../../utils/db.js');
const crypto = require('crypto')
const startMajor = async (bot) => {
  bot.on('text', async (ctx) => {
    if (ctx.chat.type === 'private') return await ctx.reply(`📝✨ :: Добавьте меня в группу и напишите что-нибудь - я с удовольствием начну обучение и общение с вами!`)
    const regex = /(https?:\/\/(?:www\.|(?!www))[^\s.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
    const chatId = ctx.chat.id;
    const rows = await db.execute(`SELECT * FROM chats WHERE chat_id = ?`, [chatId])
    if (rows.length === 0) return ctx.leaveChat()
    await db.execute(`UPDATE chats SET messages_count = ? WHERE chat_id = ?`, [rows[0].messages_count + 1, rows[0].chat_id])
    if (rows[0].activated !== 1) return;
    if (regex.test(ctx.message.text)) {
        const row = await db.execute('SELECT * FROM users WHERE telegram_id = ?;', [ctx.message?.from?.id]);
        await db.execute(`UPDATE users SET urls = ? WHERE uuid = ?`, [row[0].urls + 1, row[0].uuid])
        return await ctx.replyWithHTML(`😒 :: <a href="tg://user?id=${ctx.message.from.id}">${ctx.message.from.first_name}</a>, Ссылки запрещены!`)
    }
    const random = crypto.randomInt(10)
    if (random > 5) return;
    await message(ctx);
  });

  bot.on('callback_query', async (ctx) => {
  	const action = ctx.update.callback_query?.data?.split('_');
  	const row = await db.execute('SELECT * FROM messages WHERE id = ?;', [action[1]]);
  	if (row.length === 0) return;
  	await db.execute(`UPDATE messages SET \`Like\` = ? WHERE uuid = ?;`, [row[0].Like + 1, row[0].uuid]);
		
		if (action[2] === undefined) action[2] = ``;
  	const aliases = JSON.parse(row[0].aliases);
  	if (!aliases.includes(action[2])) {
    	aliases.push(action[2]);
    	await db.execute(`UPDATE messages SET aliases = ? WHERE uuid = ?`, [JSON.stringify(aliases), row[0].uuid]);
  	}
  	await ctx.editMessageText(ctx.update.callback_query.message.text.replace(`Нажми '♥️' чтобы покормить алгоритм знаньями.`, `✅ :: <a href="tg://user?id=${ctx.update.callback_query.from.id}">${ctx.update.callback_query.from.first_name}</a>, Спасибо за поддержку!`), { parse_mode: 'HTML', reply_markup: { inline_keyboard: [] } });
	});

};

module.exports = {
  startMajor,
};
