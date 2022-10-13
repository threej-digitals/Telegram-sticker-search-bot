require('dotenv').config();
const {Markup} = require('telegraf');
const bot = new (require("telegraf").Telegraf)(process.env.BOT_TOKEN);
const tgbot = new (require('./modules/tgbot').Tgbot);

// handle bot commands
bot.use(async (ctx, next)=>{
    if(ctx?.message?.entities && ctx.message.entities[0].type == 'bot_command'){
        return await require('./modules/commands').handleCommands(ctx.update);
    }
    return await next();
});

// handle inline queries
bot.on('inline_query', ctx => require('./modules/inlineQueryHandler').handleInlineQueries(ctx, tgbot));

// Default message
bot.use(async (ctx) => {
    ctx.reply('Use me in inline mode, click on the button below.',{
        reply_markup : Markup.inlineKeyboard([
            [Markup.button.switchToChat('Search stickers','')]
        ]).reply_markup
    })
});

// handle errors
bot.catch((err)=>{tgbot.logError(err)});

// Launch bot
bot.launch({
    polling:{
        allowed_updates: [
            'inline_query',
            'message'
        ]
    }
});
// Production
/*
bot.launch({
    webhook:{
        domain: process.env.webhookDomain,
        hookPath: process.env.WEBHOOKPATH,
        secretToken: process.env.SECRETTOKEN,
        port: 443,
        allowed_updates: [
            'inline_query',
            'message'
        ]
    }
})
*/

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));