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

// handle stickers
bot.on('sticker', async ctx => await ctx.reply('Want to add your sticker? Talk to @threej_bot'));

// handle inline queries
bot.on('inline_query', ctx => require('./modules/inlineQueryHandler').handleInlineQueries(ctx, tgbot));

//handle callback query
bot.on('callback_query', async ctx => {
    if(ctx.callbackQuery.data == 'secondaryMenu'){

        await ctx.answerCbQuery('Advance search');
        return await ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
            [
                Markup.button.switchToCurrentChat('⏸ Animated sticker','A '),
                Markup.button.switchToCurrentChat('🎦 Video sticker','V ')
            ],
            [
                Markup.button.switchToCurrentChat('▶️ Static sticker','S '),
                Markup.button.switchToCurrentChat('🌟Premium sticker','P ')
            ],
            [
                Markup.button.callback('◀️ Back','mainMenu'),
            ]
        ]).reply_markup)
    }else if(ctx.callbackQuery.data == 'mainMenu'){
        await ctx.answerCbQuery('Main menu');
        return await ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
            [
                Markup.button.switchToChat('🔎 Search stickers',''),
                Markup.button.callback('🕵️‍♂️ Advance search','secondaryMenu')
            ],
            [
                Markup.button.url('➕ Add sticker','https://t.me/threej_bot'),
                Markup.button.url('😺 Contribute','https://t.me/threej_bot')
            ]
        ]).reply_markup)

    }
})

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