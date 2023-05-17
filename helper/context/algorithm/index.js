const { Markup } = require('telegraf');
const db = require('../../../utils/db.js');
const { generateUUID } = require('../../../utils/utils.js');
const crypto = require('crypto')

const getMessage = async (ctx) => {
  	try {
    	const messageText = ctx.message?.text;
    	const messageRows = await db.execute('SELECT * FROM messages WHERE JSON_CONTAINS(aliases, ?, "$")', [JSON.stringify(messageText)]);
    	const length = messageRows.length;
    	const randomRow = length > 0 ? messageRows[Math.floor(Math.random() * length)] : null;
    	if (randomRow) {
    	  	await sendMessage(ctx, randomRow);
    	} else {
    	  	await saveMessage(ctx, messageText);
    	}
  	} catch (err) {
    	console.error(err);
    	ctx.reply(`❌ :: О, нет! Я получил ошибку:\n\n${err}`);
  	}
};

const sendMessage = async (ctx, row) => {
  	try {
    	ctx.reply(`${row?.message}\n\nНажми '♥️' чтобы покормить алгоритм знаньями.`, Markup.inlineKeyboard([
      		Markup.button.callback(`♥️ - ${row?.Like}`, `Like_${row?.id}_${ctx.message?.text}`),
    	]));
  	} catch (err) {
    	console.error(err);
    	ctx.reply(`❌ :: О, нет! Я получил ошибку:\n\n${err}`);
  	}
};

const saveMessage = async (ctx, messageText) => {
  	try {
    	const generatedUuid = generateUUID(messageText);
    	const row = await db.execute(`SELECT * FROM messages WHERE uuid = ?`, [generatedUuid]);
			const userInfo = await db.execute(`SELECT * FROM users WHERE telegram_id = ?`, [ctx.message?.from?.id])
			const rows = await db.execute(`SELECT * FROM messages`);
			const randomRow = rows[crypto.randomInt(rows.length)]
    	if (row.length === 0) {
      		await db.execute(`INSERT INTO messages (message, uuid, first_user_uuid, created_at) VALUES (?, ?, ?, ?)`, [messageText, generatedUuid, userInfo[0].uuid, Date.now()]);
      		await sendMessage(ctx, randomRow);
    	} else {
     		const aliases = JSON.parse(row[0].aliases);
     		if (!aliases.includes(messageText)) {
				aliases.push(messageText); 
				await db.execute(`UPDATE messages SET aliases = ? WHERE uuid = ? `, [JSON.stringify(aliases), row[0].uuid]);
			}
      		await sendMessage(ctx, randomRow);
   		}
  	} catch (err) {
    	console.error(err);
    	ctx.reply(`❌ :: О, нет! Я получил ошибку:\n\n${err}`);
  	}
};

module.exports = getMessage;
