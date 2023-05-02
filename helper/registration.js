const db = require("../utils/db.js");
const { generateUUID } = require('../utils/utils.js')

module.exports = async (ctx, next) => {
    try {
        const userId = ctx.message?.from?.id;
        if (userId === undefined) return await next();
        const rows = await db.execute(`SELECT * FROM users WHERE telegram_id = ?`, [userId]);
        if (rows.length !== 0) {
            await db.execute(`UPDATE users SET messages_count = ? WHERE uuid = ?`, [rows[0].messages_count + 1, rows[0].uuid])
            return await next();
        } else {
            const startTime = Date.now();
            await ctx.reply(`❌ :: Я добавляю вас в базу данных, пожалуйста, подождите!`);
            await db.execute(`INSERT INTO users (telegram_id, uuid, created_at) VALUES (?, ?, ?)`, [userId, generateUUID(userId.toString()), Date.now()]);
            const endTime = Date.now();
            await ctx.reply(`✅ :: Вы успешно зарегистрировались за ${endTime - startTime} мс, можете продолжать пользоваться ботом!`);
        }
    } catch (err) {
        console.error(`Error executing SQL: ${err}`);
        ctx.reply(`❌ :: О, нет! Я получил ошибку:\n\n${err}`);
    }
};
